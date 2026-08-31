"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import Wrapper from "@/app/[locale]/components/wrapper";
import { DropZone, FileList, PhotoGrid, downscaleImage } from "./uploads";
import { SECTIONS, ALL_FIELDS, emptyForm, toPayload, validate, Field } from "./fields";

interface Category { id: number; name: string; slug: string; image: string }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const authHeaders = (extra: Record<string, string> = {}) =>
    API_KEY ? { ...extra, 'X-API-Key': API_KEY } : extra;

const STEPS = [
    { title: 'Dokumenty', hint: 'AI vyplní inzerát' },
    { title: 'Údaje', hint: 'Zkontrolujte a doplňte' },
    { title: 'Fotky a publikace', hint: 'Nahrajte fotky a uložte' }
];

const DOC_ACCEPT = '.pdf,image/*,.txt,.md,.csv';
// The attachments endpoint accepts documents only - an image dropped here is
// rejected server-side, so it is never offered as a one-click attachment.
const ATTACHMENT_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx';
const isAttachable = (file: File) => /\.(pdf|docx?|xlsx?)$/i.test(file.name);

type FormState = Record<string, string | boolean>;

export default function AddProperty() {
    const [step, setStep] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Step 1 - source documents for the AI
    const [documents, setDocuments] = useState<File[]>([]);
    const [note, setNote] = useState('');
    const [extracting, setExtracting] = useState(false);
    const [extractError, setExtractError] = useState<string | null>(null);
    const [aiFilled, setAiFilled] = useState<Set<string>>(new Set());
    const [needsCheck, setNeedsCheck] = useState<Set<string>>(new Set());
    const [aiNotes, setAiNotes] = useState<string | null>(null);

    // Step 3 - what actually gets published
    const [photos, setPhotos] = useState<File[]>([]);
    const [attachments, setAttachments] = useState<File[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [createdId, setCreatedId] = useState<number | null>(null);

    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/categories`, { headers: authHeaders() })
            .then(res => res.ok ? res.json() : Promise.reject(new Error('Kategorie se nepodařilo načíst')))
            .then((data: Category[]) => {
                setCategories(data);
                setForm(prev => prev.categoryId ? prev : { ...prev, categoryId: String(data[0]?.id ?? '') });
            })
            .catch(err => console.error(err));
    }, []);

    const goToStep = (next: number) => {
        setStep(next);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const setValue = (name: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [name]: value }));
        // Once the agent touches a field it is his, not the AI's.
        setAiFilled(prev => { if (!prev.has(name)) return prev; const next = new Set(prev); next.delete(name); return next; });
        setNeedsCheck(prev => { if (!prev.has(name)) return prev; const next = new Set(prev); next.delete(name); return next; });
        setErrors(prev => { if (!prev[name]) return prev; const next = { ...prev }; delete next[name]; return next; });
    };

    const runExtraction = async () => {
        if (documents.length === 0) return;
        setExtracting(true);
        setExtractError(null);
        try {
            const body = new FormData();
            documents.forEach(file => body.append('documents', file));
            if (note.trim()) body.append('note', note.trim());

            const response = await fetch(`${API_BASE_URL}/properties/extract`, {
                method: 'POST',
                headers: authHeaders({ Accept: 'application/json' }),
                body
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || `Chyba serveru (${response.status})`);

            const filled: FormState = {};
            for (const field of ALL_FIELDS) {
                const value = result.fields?.[field.name];
                if (value === undefined || value === null) continue;
                filled[field.name] = field.kind === 'checkbox' ? Boolean(value) : String(value);
            }

            setForm(prev => ({ ...prev, ...filled }));
            setAiFilled(new Set(Object.keys(filled)));
            setNeedsCheck(new Set((result.lowConfidenceFields ?? []).filter((f: string) => f in filled)));
            setAiNotes(result.notes ?? null);
            goToStep(1);
        } catch (error) {
            setExtractError(error instanceof Error ? error.message : 'Nepodařilo se zpracovat dokumenty');
        } finally {
            setExtracting(false);
        }
    };

    const handleReview = () => {
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length > 0) {
            const first = ALL_FIELDS.find(f => found[f.name]);
            document.getElementById(first?.name ?? '')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        goToStep(2);
    };

    const handleSubmit = async () => {
        const found = validate(form);
        if (Object.keys(found).length > 0) {
            setErrors(found);
            goToStep(1);
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        try {
            const body = new FormData();
            body.append('data', JSON.stringify(toPayload(form)));
            // Order is meaningful: the API marks the first image as the main photo.
            photos.forEach(photo => body.append('images', photo));
            attachments.forEach(file => body.append('files', file));

            const response = await fetch(`${API_BASE_URL}/properties`, {
                method: 'POST',
                headers: authHeaders({ Accept: 'application/json' }),
                body
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.details ? result.details.join('\n') : result.error || `Chyba serveru (${response.status})`);
            }
            setCreatedId(result.id ?? null);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Nemovitost se nepodařilo uložit');
        } finally {
            setSubmitting(false);
        }
    };

    const startOver = () => {
        setForm({ ...emptyForm(), categoryId: String(categories[0]?.id ?? '') });
        setDocuments([]); setPhotos([]); setAttachments([]);
        setAiFilled(new Set()); setNeedsCheck(new Set()); setAiNotes(null);
        setNote(''); setErrors({}); setCreatedId(null); setSubmitError(null); setExtractError(null);
        goToStep(0);
    };

    if (createdId !== null) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-10 bg-white dark:bg-slate-900 text-center max-w-xl mx-auto mt-10">
                            <i className="mdi mdi-check-circle text-6xl text-green-600"></i>
                            <h5 className="text-xl font-semibold mt-4">Nemovitost byla publikována</h5>
                            <p className="text-slate-400 mt-2">
                                {photos.length} {photos.length === 1 ? 'fotka' : 'fotek'} a {attachments.length} {attachments.length === 1 ? 'příloha' : 'příloh'} nahráno.
                            </p>
                            <div className="flex gap-3 justify-center mt-6">
                                <Link href={`/property-detail/${createdId}`} className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md">
                                    Zobrazit inzerát
                                </Link>
                                <button type="button" onClick={startOver} className="btn bg-transparent hover:bg-green-600 border border-green-600 text-green-600 hover:text-white rounded-md">
                                    Přidat další
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing" ref={topRef}>
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Nová nemovitost</h5>
                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600"><Link href="/">Přehled</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5"><i className="mdi mdi-chevron-right"></i></li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Nová nemovitost</li>
                        </ul>
                    </div>

                    <StepBar step={step} onJump={goToStep} />

                    <div className="mt-6">
                        {step === 0 && (
                            <IntakeStep
                                documents={documents}
                                setDocuments={setDocuments}
                                note={note}
                                setNote={setNote}
                                extracting={extracting}
                                error={extractError}
                                onExtract={runExtraction}
                                onSkip={() => goToStep(1)}
                            />
                        )}

                        {step === 1 && (
                            <ReviewStep
                                form={form}
                                errors={errors}
                                categories={categories}
                                aiFilled={aiFilled}
                                needsCheck={needsCheck}
                                aiNotes={aiNotes}
                                onChange={setValue}
                                onBack={() => goToStep(0)}
                                onNext={handleReview}
                            />
                        )}

                        {step === 2 && (
                            <PublishStep
                                photos={photos}
                                setPhotos={setPhotos}
                                attachments={attachments}
                                setAttachments={setAttachments}
                                documents={documents}
                                submitting={submitting}
                                error={submitError}
                                onBack={() => goToStep(1)}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

function StepBar({ step, onJump }: { step: number; onJump: (i: number) => void }) {
    return (
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {STEPS.map((s, i) => {
                const state = i === step ? 'current' : i < step ? 'done' : 'todo';
                return (
                    <li key={s.title}>
                        <button
                            type="button"
                            onClick={() => i < step && onJump(i)}
                            disabled={i > step}
                            aria-current={state === 'current' ? 'step' : undefined}
                            className={`w-full text-left flex items-center gap-3 p-4 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700 border-b-2 ${
                                state === 'current' ? 'border-green-600' : state === 'done' ? 'border-green-600/40 cursor-pointer' : 'border-transparent opacity-60'
                            }`}
                        >
                            <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                state === 'todo' ? 'bg-gray-100 dark:bg-slate-800 text-slate-400' : 'bg-green-600 text-white'
                            }`}>
                                {state === 'done' ? <i className="mdi mdi-check"></i> : i + 1}
                            </span>
                            <span className="min-w-0">
                                <span className="block font-medium truncate">{s.title}</span>
                                <span className="block text-sm text-slate-400 truncate">{s.hint}</span>
                            </span>
                        </button>
                    </li>
                );
            })}
        </ol>
    );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900 ${className}`}>{children}</div>;
}

function IntakeStep({ documents, setDocuments, note, setNote, extracting, error, onExtract, onSkip }: {
    documents: File[];
    setDocuments: (files: File[]) => void;
    note: string;
    setNote: (note: string) => void;
    extracting: boolean;
    error: string | null;
    onExtract: () => void;
    onSkip: () => void;
}) {
    return (
        <Card>
            <h6 className="text-lg font-semibold text-green-600">Nahrajte podklady k nemovitosti</h6>
            <p className="text-slate-400 mt-1 mb-5">
                Znalecký posudek, výpis z katastru, PENB, půdorys, nabídkový list nebo jen fotka papíru.
                AI z nich vyplní inzerát, vy už jen zkontrolujete.
            </p>

            <DropZone
                accept={DOC_ACCEPT}
                icon="mdi-file-upload-outline"
                title="Přetáhněte sem dokumenty nebo klikněte pro výběr"
                hint="PDF, obrázky a textové soubory, max. 10 MB na soubor. DOCX/XLSX prosím exportujte do PDF."
                onFiles={(picked) => setDocuments([...documents, ...picked])}
            />

            <FileList files={documents} onRemove={(i) => setDocuments(documents.filter((_, idx) => idx !== i))} />

            <div className="mt-5">
                <label htmlFor="ai-note" className="font-medium">Poznámka pro AI <span className="text-slate-400 font-normal">(nepovinné)</span></label>
                <textarea
                    id="ai-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Např. „Cena 6 950 000 Kč, prodej, k nastěhování od května.“"
                    className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500"
                />
            </div>

            {error && (
                <p className="mt-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 text-sm whitespace-pre-line">{error}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={onExtract}
                    disabled={documents.length === 0 || extracting}
                    className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {extracting
                        ? <><i className="mdi mdi-loading mdi-spin me-1"></i> AI čte dokumenty…</>
                        : <><i className="mdi mdi-auto-fix me-1"></i> Vyplnit pomocí AI</>}
                </button>
                <button type="button" onClick={onSkip} disabled={extracting} className="text-slate-400 hover:text-green-600 underline">
                    Přeskočit a vyplnit ručně
                </button>
                {extracting && <span className="text-sm text-slate-400">U delších posudků to může trvat i minutu.</span>}
            </div>
        </Card>
    );
}

function ReviewStep({ form, errors, categories, aiFilled, needsCheck, aiNotes, onChange, onBack, onNext }: {
    form: FormState;
    errors: Record<string, string>;
    categories: Category[];
    aiFilled: Set<string>;
    needsCheck: Set<string>;
    aiNotes: string | null;
    onChange: (name: string, value: string | boolean) => void;
    onBack: () => void;
    onNext: () => void;
}) {
    const sectionHasContent = useMemo(() => {
        const map: Record<string, boolean> = {};
        for (const section of SECTIONS) {
            map[section.id] = section.fields.some(f =>
                f.required || aiFilled.has(f.name) || (form[f.name] !== '' && form[f.name] !== false)
            );
        }
        return map;
    }, [form, aiFilled]);

    const errorCount = Object.keys(errors).length;

    return (
        <div className="space-y-5">
            {(aiFilled.size > 0 || aiNotes) && (
                <div className="rounded-md p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                        <i className="mdi mdi-auto-fix text-2xl text-green-600"></i>
                        <div className="min-w-0">
                            <p className="font-medium">AI vyplnila {aiFilled.size} {aiFilled.size === 1 ? 'pole' : 'polí'}.</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                Vyplněná pole jsou označená. Jakmile do pole sáhnete, označení zmizí.
                            </p>
                            {needsCheck.size > 0 && (
                                <p className="text-sm mt-2">
                                    <span className="text-amber-600 font-medium">Ověřte prosím: </span>
                                    {[...needsCheck].map(name => ALL_FIELDS.find(f => f.name === name)?.label ?? name).join(', ')}
                                </p>
                            )}
                            {aiNotes && <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">{aiNotes}</p>}
                        </div>
                    </div>
                </div>
            )}

            {SECTIONS.map(section => (
                <FieldSection
                    key={section.id}
                    section={section}
                    form={form}
                    errors={errors}
                    categories={categories}
                    aiFilled={aiFilled}
                    needsCheck={needsCheck}
                    defaultOpen={sectionHasContent[section.id]}
                    onChange={onChange}
                />
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 py-4 bg-gray-50/90 dark:bg-slate-800/90 backdrop-blur">
                <button type="button" onClick={onBack} className="btn bg-transparent hover:bg-green-600 border border-green-600 text-green-600 hover:text-white rounded-md">
                    <i className="mdi mdi-chevron-left"></i> Zpět
                </button>
                <div className="flex items-center gap-4">
                    {errorCount > 0 && (
                        <span className="text-red-600 text-sm">
                            {errorCount} {errorCount === 1 ? 'pole vyžaduje' : 'polí vyžaduje'} opravu
                        </span>
                    )}
                    <button type="button" onClick={onNext} className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md">
                        Pokračovat k fotkám <i className="mdi mdi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

function FieldSection({ section, form, errors, categories, aiFilled, needsCheck, defaultOpen, onChange }: {
    section: typeof SECTIONS[number];
    form: FormState;
    errors: Record<string, string>;
    categories: Category[];
    aiFilled: Set<string>;
    needsCheck: Set<string>;
    defaultOpen: boolean;
    onChange: (name: string, value: string | boolean) => void;
}) {
    const filledCount = section.fields.filter(f => form[f.name] !== '' && form[f.name] !== false).length;
    const hasError = section.fields.some(f => errors[f.name]);

    return (
        <details open={defaultOpen || hasError} className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 bg-white dark:bg-slate-900">
            <summary className="flex items-center gap-3 p-5 cursor-pointer select-none list-none">
                <i className={`mdi ${section.icon} text-xl text-green-600`}></i>
                <span className="font-semibold">{section.title}</span>
                <span className="text-sm text-slate-400">{filledCount}/{section.fields.length}</span>
                {hasError && <span className="text-sm text-red-600"><i className="mdi mdi-alert-circle"></i> chybí údaje</span>}
                <i className="mdi mdi-chevron-down ms-auto text-slate-400"></i>
            </summary>

            <div className="grid grid-cols-12 gap-5 px-5 pb-6">
                {section.fields.map(field => (
                    <FieldInput
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        error={errors[field.name]}
                        categories={categories}
                        byAi={aiFilled.has(field.name)}
                        verify={needsCheck.has(field.name)}
                        onChange={onChange}
                    />
                ))}
            </div>
        </details>
    );
}

const INPUT_CLASS = 'form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500';

// Tailwind only picks up class names it can see literally, so span -> class is a lookup.
const SPAN_CLASS: Record<number, string> = {
    3: 'col-span-12 md:col-span-3',
    4: 'col-span-12 md:col-span-4',
    6: 'col-span-12 md:col-span-6',
    12: 'col-span-12'
};

function FieldInput({ field, value, error, categories, byAi, verify, onChange }: {
    field: Field;
    value: string | boolean;
    error?: string;
    categories: Category[];
    byAi: boolean;
    verify: boolean;
    onChange: (name: string, value: string | boolean) => void;
}) {
    const spanClass = SPAN_CLASS[field.span ?? 6] ?? SPAN_CLASS[6];
    const options = field.name === 'categoryId'
        ? categories.map(c => ({ value: String(c.id), label: c.name }))
        : field.options ?? [];

    if (field.kind === 'checkbox') {
        return (
            <div className={`${spanClass} flex items-center gap-2 md:mt-8`}>
                <input
                    id={field.name}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => onChange(field.name, e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                />
                <label htmlFor={field.name} className="font-medium">{field.label}</label>
            </div>
        );
    }

    return (
        <div className={`${spanClass}`}>
            <div className="flex items-center gap-2 flex-wrap">
                <label htmlFor={field.name} className="font-medium">
                    {field.label}{field.required && <span className="text-red-500"> *</span>}
                    {field.unit && <span className="text-slate-400 font-normal"> ({field.unit})</span>}
                </label>
                {byAi && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded ${
                        verify ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                               : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    }`}>
                        {verify ? 'ověřit' : 'AI'}
                    </span>
                )}
            </div>

            {field.kind === 'select' ? (
                <select id={field.name} name={field.name} value={String(value ?? '')} onChange={(e) => onChange(field.name, e.target.value)} className={INPUT_CLASS}>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            ) : field.kind === 'textarea' ? (
                <textarea id={field.name} name={field.name} rows={6} value={String(value ?? '')} onChange={(e) => onChange(field.name, e.target.value)} className={INPUT_CLASS} />
            ) : (
                <input
                    id={field.name}
                    name={field.name}
                    type={field.kind === 'text' ? 'text' : 'number'}
                    step={field.kind === 'int' ? '1' : 'any'}
                    value={String(value ?? '')}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    className={INPUT_CLASS}
                />
            )}

            {error
                ? <p className="text-red-600 text-sm mt-1">{error}</p>
                : field.hint && <p className="text-slate-400 text-sm mt-1">{field.hint}</p>}
        </div>
    );
}

function PublishStep({ photos, setPhotos, attachments, setAttachments, documents, submitting, error, onBack, onSubmit }: {
    photos: File[];
    setPhotos: (files: File[]) => void;
    attachments: File[];
    setAttachments: (files: File[]) => void;
    documents: File[];
    submitting: boolean;
    error: string | null;
    onBack: () => void;
    onSubmit: () => void;
}) {
    const alreadyAttached = (file: File) => attachments.some(a => a.name === file.name && a.size === file.size);
    const [preparing, setPreparing] = useState(0);

    // Downscale before the files ever reach the form, so what is previewed is what
    // gets uploaded and the 10 MB server limit is never hit.
    const addPhotos = async (picked: File[]) => {
        setPreparing(picked.length);
        const prepared: File[] = [];
        for (const file of picked) {
            prepared.push(await downscaleImage(file));
            setPreparing(n => n - 1);
        }
        setPhotos([...photos, ...prepared]);
        setPreparing(0);
    };

    return (
        <div className="space-y-5">
            <Card>
                <h6 className="text-lg font-semibold text-green-600">Fotografie</h6>
                <p className="text-slate-400 mt-1 mb-5">
                    První fotka je hlavní. Pořadí změníte přetažením dlaždic, hvězdičkou posunete fotku na první místo.
                </p>
                <DropZone
                    accept="image/*"
                    icon="mdi-image-multiple-outline"
                    title="Přetáhněte sem fotky nebo klikněte pro výběr"
                    hint="JPG a PNG. Velké fotky se automaticky zmenší, nemusíte je upravovat."
                    onFiles={addPhotos}
                />
                {preparing > 0 && (
                    <p className="mt-3 text-sm text-slate-400">
                        <i className="mdi mdi-loading mdi-spin me-1"></i>
                        Připravuji fotky k nahrání… zbývá {preparing}
                    </p>
                )}
                <PhotoGrid photos={photos} onChange={setPhotos} />
            </Card>

            <Card>
                <h6 className="text-lg font-semibold text-green-600">Přílohy k inzerátu</h6>
                <p className="text-slate-400 mt-1 mb-5">Dokumenty ke stažení u inzerátu, např. půdorys nebo PENB.</p>

                {documents.some(d => isAttachable(d) && !alreadyAttached(d)) && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {documents.filter(d => isAttachable(d) && !alreadyAttached(d)).map((doc, i) => (
                            <button
                                key={`${doc.name}-${i}`}
                                type="button"
                                onClick={() => setAttachments([...attachments, doc])}
                                className="text-sm px-3 py-1.5 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                            >
                                <i className="mdi mdi-plus"></i> {doc.name}
                            </button>
                        ))}
                    </div>
                )}

                <DropZone
                    accept={ATTACHMENT_ACCEPT}
                    icon="mdi-paperclip"
                    title="Přetáhněte sem přílohy nebo klikněte pro výběr"
                    hint="PDF, DOC, DOCX, XLS, XLSX, max. 10 MB na soubor"
                    onFiles={(picked) => setAttachments([...attachments, ...picked])}
                />
                <FileList files={attachments} onRemove={(i) => setAttachments(attachments.filter((_, idx) => idx !== i))} />
            </Card>

            {error && (
                <p className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 text-sm whitespace-pre-line">{error}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 sticky bottom-0 py-4 bg-gray-50/90 dark:bg-slate-800/90 backdrop-blur">
                <button type="button" onClick={onBack} disabled={submitting} className="btn bg-transparent hover:bg-green-600 border border-green-600 text-green-600 hover:text-white rounded-md">
                    <i className="mdi mdi-chevron-left"></i> Zpět na údaje
                </button>
                <button type="button" onClick={onSubmit} disabled={submitting} className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md disabled:opacity-50">
                    {submitting
                        ? <><i className="mdi mdi-loading mdi-spin me-1"></i> Ukládám a nahrávám fotky…</>
                        : <><i className="mdi mdi-check me-1"></i> Publikovat nemovitost</>}
                </button>
            </div>
        </div>
    );
}

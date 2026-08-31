'use client'
import React, { useCallback, useEffect, useRef, useState } from "react";

function formatSize(bytes: number) {
    return bytes < 1024 * 1024
        ? `${Math.round(bytes / 1024)} kB`
        : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Drag-and-drop + click-to-browse target. */
export function DropZone({ accept, multiple = true, onFiles, title, hint, icon }: {
    accept: string;
    multiple?: boolean;
    onFiles: (files: File[]) => void;
    title: string;
    hint: string;
    icon: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [over, setOver] = useState(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setOver(false);
        const dropped = Array.from(e.dataTransfer.files);
        if (dropped.length) onFiles(dropped);
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
            className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors duration-200 ${
                over
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-400 bg-gray-50 dark:bg-slate-800'
            }`}
        >
            <i className={`mdi ${icon} text-4xl text-green-600`}></i>
            <p className="font-medium mt-2">{title}</p>
            <p className="text-slate-400 text-sm mt-1">{hint}</p>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={(e) => {
                    const picked = Array.from(e.target.files ?? []);
                    if (picked.length) onFiles(picked);
                    e.target.value = ''; // allow re-picking the same file
                }}
            />
        </div>
    );
}

/** Flat list of attached documents with a remove button. */
export function FileList({ files, onRemove }: { files: File[]; onRemove: (index: number) => void }) {
    if (files.length === 0) return null;
    return (
        <ul className="space-y-2 mt-4">
            {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                        <i className="mdi mdi-file-document-outline text-lg text-green-600"></i>
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-slate-400 shrink-0">{formatSize(file.size)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        aria-label={`Odebrat ${file.name}`}
                        className="text-red-500 hover:text-red-600 shrink-0 ms-3"
                    >
                        <i className="mdi mdi-close text-lg"></i>
                    </button>
                </li>
            ))}
        </ul>
    );
}

/**
 * Photo grid. Order matters: the server stores images in the order they are sent
 * and marks the first one as the main photo, so "set as main" just moves it to
 * the front. Reordering is HTML5 drag-and-drop between tiles.
 */
export function PhotoGrid({ photos, onChange }: { photos: File[]; onChange: (photos: File[]) => void }) {
    const dragIndex = useRef<number | null>(null);
    // One object URL per File, kept stable across reorders so the tiles don't flicker.
    const urls = useRef(new Map<File, string>());

    const previewOf = (file: File) => {
        let url = urls.current.get(file);
        if (!url) {
            url = URL.createObjectURL(file);
            urls.current.set(file, url);
        }
        return url;
    };

    useEffect(() => {
        const cache = urls.current;
        for (const [file, url] of cache) {
            if (!photos.includes(file)) {
                URL.revokeObjectURL(url);
                cache.delete(file);
            }
        }
    }, [photos]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); }, []);

    const move = useCallback((from: number, to: number) => {
        if (from === to) return;
        const next = [...photos];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
    }, [photos, onChange]);

    if (photos.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {photos.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    draggable
                    onDragStart={() => { dragIndex.current = index; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragIndex.current !== null) move(dragIndex.current, index); dragIndex.current = null; }}
                    className="relative group cursor-move"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={previewOf(file)}
                        alt={file.name}
                        className={`w-full h-40 object-cover rounded-lg ${index === 0 ? 'ring-2 ring-green-500' : ''}`}
                    />

                    {index === 0 && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                            Hlavní foto
                        </span>
                    )}

                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        {index !== 0 && (
                            <button
                                type="button"
                                onClick={() => move(index, 0)}
                                title="Nastavit jako hlavní foto"
                                aria-label="Nastavit jako hlavní foto"
                                className="bg-white/90 dark:bg-slate-900/90 text-green-600 rounded-full w-7 h-7 flex items-center justify-center hover:bg-white"
                            >
                                <i className="mdi mdi-star"></i>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onChange(photos.filter((_, i) => i !== index))}
                            title="Odebrat fotku"
                            aria-label="Odebrat fotku"
                            className="bg-white/90 dark:bg-slate-900/90 text-red-500 rounded-full w-7 h-7 flex items-center justify-center hover:bg-white"
                        >
                            <i className="mdi mdi-close"></i>
                        </button>
                    </div>

                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {index + 1}
                    </span>
                </div>
            ))}
        </div>
    );
}

/**
 * Estate photos come off a DSLR at 10-19 MB and 6000 px. The API rejects anything
 * over 10 MB, and the server re-encodes to WebP without resizing, so full-resolution
 * originals are wasted bytes on a listing page. Downscaling in the browser keeps the
 * upload under the limit, cuts upload time on an office connection, and loses nothing
 * the server's own quality-80 WebP pass would have kept.
 */
const MAX_EDGE = 2560;
const JPEG_QUALITY = 0.85;

export async function downscaleImage(file: File): Promise<File> {
    if (!file.type.startsWith('image/')) return file;

    try {
        // from-image applies the EXIF rotation, so portrait shots stay upright.
        const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
        const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

        // Already small enough and correctly oriented - leave the original alone.
        if (scale === 1 && file.size <= 4 * 1024 * 1024) {
            bitmap.close();
            return file;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) { bitmap.close(); return file; }
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();

        const blob = await new Promise<Blob | null>(resolve =>
            canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
        );
        if (!blob || blob.size >= file.size) return file; // no gain, keep the original

        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
            type: 'image/jpeg',
            lastModified: file.lastModified
        });
    } catch {
        return file; // a codec the browser can't decode - let the server decide
    }
}

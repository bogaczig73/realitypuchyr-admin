// Single source of truth for the add-property form: labels, grouping, and the
// type each field is sent as. Replaces the four duplicated field lists the old
// page carried (interface, initial state, reset block, JSX).

export type FieldKind = 'text' | 'textarea' | 'number' | 'int' | 'select' | 'checkbox';

export interface Field {
    name: string;
    label: string;
    kind: FieldKind;
    unit?: string;
    hint?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    /** Grid columns out of 12 on md+ screens. */
    span?: number;
}

export interface Section {
    id: string;
    title: string;
    icon: string;
    fields: Field[];
}

const AREA = (name: string, label: string): Field => ({ name, label, kind: 'number', unit: 'm²', span: 3 });

export const SECTIONS: Section[] = [
    {
        id: 'basic',
        title: 'Základní údaje',
        icon: 'mdi-home-city-outline',
        fields: [
            { name: 'name', label: 'Název inzerátu', kind: 'text', required: true, span: 12, hint: 'Např. „Prodej bytu 3+kk, 78 m², Brno-Žabovřesky“' },
            { name: 'categoryId', label: 'Kategorie', kind: 'select', required: true, span: 4, options: [] },
            {
                name: 'ownershipType', label: 'Typ nabídky', kind: 'select', span: 4, options: [
                    { value: 'OWNERSHIP', label: 'Prodej / osobní vlastnictví' },
                    { value: 'RENT', label: 'Pronájem' }
                ]
            },
            {
                name: 'status', label: 'Stav inzerátu', kind: 'select', span: 4, options: [
                    { value: 'ACTIVE', label: 'Aktivní' },
                    { value: 'SOLD', label: 'Prodáno' },
                    { value: 'RENT', label: 'Pronajato' }
                ]
            },
            { name: 'price', label: 'Cena', kind: 'number', unit: 'Kč', required: true, span: 4 },
            { name: 'discountedPrice', label: 'Zlevněná cena', kind: 'number', unit: 'Kč', span: 4 },
            { name: 'priceHidden', label: 'Cenu nezobrazovat (info u RK)', kind: 'checkbox', span: 4 },
            { name: 'description', label: 'Popis nemovitosti', kind: 'textarea', required: true, span: 12 }
        ]
    },
    {
        id: 'location',
        title: 'Poloha',
        icon: 'mdi-map-marker-outline',
        fields: [
            { name: 'street', label: 'Ulice a č.p.', kind: 'text', span: 6 },
            { name: 'city', label: 'Obec', kind: 'text', span: 3 },
            { name: 'country', label: 'Země', kind: 'text', span: 3 },
            { name: 'latitude', label: 'Zeměpisná šířka', kind: 'number', span: 3 },
            { name: 'longitude', label: 'Zeměpisná délka', kind: 'number', span: 3 }
        ]
    },
    {
        id: 'layout',
        title: 'Dispozice a plochy',
        icon: 'mdi-floor-plan',
        fields: [
            { name: 'layout', label: 'Dispozice', kind: 'text', span: 3, hint: 'např. 3+kk' },
            { name: 'size', label: 'Hlavní výměra', kind: 'number', unit: 'm²', span: 3, hint: 'Plocha zobrazená v inzerátu' },
            { name: 'beds', label: 'Ložnice', kind: 'int', span: 3 },
            { name: 'baths', label: 'Koupelny', kind: 'int', span: 3 },
            AREA('usableArea', 'Užitná plocha'),
            AREA('floorArea', 'Podlahová plocha'),
            AREA('builtUpArea', 'Zastavěná plocha'),
            AREA('totalObjectArea', 'Celková plocha objektu'),
            AREA('landArea', 'Plocha pozemku'),
            AREA('totalLandArea', 'Celková plocha pozemku'),
            AREA('gardenArea', 'Zahrada'),
            AREA('terraceArea', 'Terasa'),
            AREA('balconyArea', 'Balkon'),
            AREA('garageArea', 'Garáž'),
            AREA('basementArea', 'Sklep'),
            AREA('workshopArea', 'Dílna'),
            AREA('pergolaArea', 'Pergola'),
            AREA('gardenHouseArea', 'Zahradní domek')
        ]
    },
    {
        id: 'building',
        title: 'Budova a stav',
        icon: 'mdi-office-building-outline',
        fields: [
            { name: 'buildingCondition', label: 'Stav budovy', kind: 'text', span: 4 },
            { name: 'apartmentCondition', label: 'Stav bytu', kind: 'text', span: 4 },
            { name: 'objectCondition', label: 'Stav objektu', kind: 'text', span: 4 },
            { name: 'buildingStoriesNumber', label: 'Podlaží budovy', kind: 'int', span: 3 },
            { name: 'aboveGroundFloors', label: 'Nadzemní podlaží', kind: 'int', span: 3 },
            { name: 'totalAboveGroundFloors', label: 'Celkem nadzemních podlaží', kind: 'int', span: 3 },
            { name: 'totalUndergroundFloors', label: 'Celkem podzemních podlaží', kind: 'int', span: 3 },
            { name: 'reconstructionYearBuilding', label: 'Rekonstrukce budovy', kind: 'int', span: 3, hint: 'rok' },
            { name: 'reconstructionYearApartment', label: 'Rekonstrukce bytu', kind: 'int', span: 3, hint: 'rok' }
        ]
    },
    {
        id: 'land',
        title: 'Pozemek a stavební podmínky',
        icon: 'mdi-terrain',
        fields: [
            { name: 'objectType', label: 'Typ objektu', kind: 'text', span: 4 },
            { name: 'objectLocationType', label: 'Umístění objektu', kind: 'text', span: 4 },
            { name: 'accessRoad', label: 'Přístupová cesta', kind: 'text', span: 4 },
            { name: 'buildingPermit', label: 'Stavební povolení', kind: 'text', span: 4 },
            { name: 'buildability', label: 'Zastavitelnost', kind: 'text', span: 4 },
            { name: 'utilitiesOnLand', label: 'Sítě na pozemku', kind: 'text', span: 4 },
            { name: 'utilitiesOnAdjacentRoad', label: 'Sítě u přilehlé cesty', kind: 'text', span: 6 }
        ]
    },
    {
        id: 'equipment',
        title: 'Vybavení a podmínky',
        icon: 'mdi-sofa-outline',
        fields: [
            { name: 'houseEquipment', label: 'Vybavení domu', kind: 'text', span: 6 },
            { name: 'equipmentDescription', label: 'Popis vybavení', kind: 'textarea', span: 12 },
            { name: 'additionalSources', label: 'Další zdroje', kind: 'text', span: 6 },
            { name: 'payments', label: 'Platby a poplatky', kind: 'text', span: 6 },
            { name: 'reservationPrice', label: 'Rezervační poplatek', kind: 'text', span: 6 }
        ]
    },
    {
        id: 'media',
        title: 'Média a makléř',
        icon: 'mdi-video-outline',
        fields: [
            { name: 'virtualTour', label: 'Virtuální prohlídka (URL)', kind: 'text', span: 6 },
            { name: 'videoUrl', label: 'Video (URL)', kind: 'text', span: 6 },
            { name: 'brokerId', label: 'Makléř', kind: 'text', span: 6 },
            { name: 'secondaryAgent', label: 'Druhý makléř', kind: 'text', span: 6 }
        ]
    }
];

export const ALL_FIELDS: Field[] = SECTIONS.flatMap(s => s.fields);

export const DEFAULTS: Record<string, string | boolean> = {
    status: 'ACTIVE',
    ownershipType: 'OWNERSHIP',
    country: 'Česká republika',
    priceHidden: false
};

export function emptyForm(): Record<string, string | boolean> {
    const form: Record<string, string | boolean> = {};
    for (const f of ALL_FIELDS) form[f.name] = f.kind === 'checkbox' ? false : '';
    return { ...form, ...DEFAULTS };
}

/** Convert the string-based form state into the JSON the API expects. */
export function toPayload(form: Record<string, string | boolean>): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    for (const field of ALL_FIELDS) {
        const value = form[field.name];

        if (field.kind === 'checkbox') {
            payload[field.name] = Boolean(value);
            continue;
        }
        if (value === '' || value === undefined) {
            payload[field.name] = null;
            continue;
        }
        if (field.kind === 'int') {
            const n = Number(value);
            payload[field.name] = Number.isFinite(n) ? Math.floor(n) : null;
        } else if (field.kind === 'number') {
            const n = Number(value);
            payload[field.name] = Number.isFinite(n) ? n : null;
        } else {
            payload[field.name] = value;
        }
    }

    // categoryId is a select but must go over the wire as a number
    payload.categoryId = form.categoryId ? Number(form.categoryId) : null;
    return payload;
}

/** Validate; returns { fieldName: message }. */
export function validate(form: Record<string, string | boolean>): Record<string, string> {
    const errors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    for (const field of ALL_FIELDS) {
        const raw = form[field.name];
        const value = typeof raw === 'string' ? raw.trim() : raw;

        if (field.required && (value === '' || value === undefined)) {
            errors[field.name] = 'Toto pole je povinné';
            continue;
        }
        if (value === '' || typeof value === 'boolean') continue;

        if (field.kind === 'number' || field.kind === 'int') {
            const n = Number(value);
            if (!Number.isFinite(n)) {
                errors[field.name] = 'Zadejte číslo';
            } else if (n < 0 && field.name !== 'latitude' && field.name !== 'longitude') {
                errors[field.name] = 'Hodnota nemůže být záporná';
            }
        }
        if (field.name.startsWith('reconstructionYear') && value !== '') {
            const year = Number(value);
            if (year < 1800 || year > currentYear) {
                errors[field.name] = `Rok musí být mezi 1800 a ${currentYear}`;
            }
        }
    }

    if (form.latitude !== '' && Math.abs(Number(form.latitude)) > 90) {
        errors.latitude = 'Zeměpisná šířka musí být mezi -90 a 90';
    }
    if (form.longitude !== '' && Math.abs(Number(form.longitude)) > 180) {
        errors.longitude = 'Zeměpisná délka musí být mezi -180 a 180';
    }

    return errors;
}

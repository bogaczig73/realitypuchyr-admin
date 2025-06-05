export enum PropertyStatus {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    RENT = 'RENT'
}

export enum OwnershipType {
    RENT = 'RENT',
    OWNERSHIP = 'OWNERSHIP'
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface PropertyImage {
    id: number;
    url: string;
    isMain: boolean;
    order: number;
    propertyId: number;
    createdAt: string;
}

export interface PropertyFloorplan {
    id: number;
    url: string;
    name: string;
    propertyId: number;
    createdAt: string;
}

export interface Review {
    id: number;
    name: string;
    description: string;
    rating: number;
    propertyId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface PropertyTranslation {
    id: number;
    propertyId: number;
    language: string;
    name: string;
    description: string;
    country: string;
    size: string;
    beds: string;
    baths: string;
    buildingCondition: string | null;
    apartmentCondition: string | null;
    objectType: string | null;
    objectLocationType: string | null;
    houseEquipment: string | null;
    accessRoad: string | null;
    objectCondition: string | null;
    equipmentDescription: string | null;
    additionalSources: string | null;
    buildingPermit: string | null;
    buildability: string | null;
    utilitiesOnLand: string | null;
    utilitiesOnAdjacentRoad: string | null;
    payments: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Property {
    id: number;
    name: string;
    categoryId: number;
    category: Category;
    status: PropertyStatus;
    ownershipType: OwnershipType;
    description: string;
    city: string;
    street: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    virtualTour: string | null;
    videoUrl: string | null;
    size: number;
    beds: number;
    baths: number;
    layout: string | null;
    files: any | null;
    price: number;
    discountedPrice: number | null;
    buildingStoriesNumber: number | null;
    buildingCondition: string | null;
    apartmentCondition: string | null;
    aboveGroundFloors: number | null;
    reconstructionYearApartment: number | null;
    reconstructionYearBuilding: number | null;
    totalAboveGroundFloors: number | null;
    totalUndergroundFloors: number | null;
    floorArea: number | null;
    builtUpArea: number | null;
    gardenHouseArea: number | null;
    terraceArea: number | null;
    totalLandArea: number | null;
    gardenArea: number | null;
    garageArea: number | null;
    balconyArea: number | null;
    pergolaArea: number | null;
    basementArea: number | null;
    workshopArea: number | null;
    totalObjectArea: number | null;
    usableArea: number | null;
    landArea: number | null;
    objectType: string | null;
    objectLocationType: string | null;
    houseEquipment: string | null;
    accessRoad: string | null;
    objectCondition: string | null;
    reservationPrice: string | null;
    equipmentDescription: string | null;
    additionalSources: string | null;
    buildingPermit: string | null;
    buildability: string | null;
    utilitiesOnLand: string | null;
    utilitiesOnAdjacentRoad: string | null;
    payments: string | null;
    brokerId: string | null;
    secondaryAgent: string | null;
    createdAt: string;
    updatedAt: string;
    images: PropertyImage[];
    floorplans: PropertyFloorplan[];
    reviews: Review[];
    translations: PropertyTranslation[];
}

export interface Pagination {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export interface PropertyResponse {
    properties: Property[];
    pagination: Pagination;
} 
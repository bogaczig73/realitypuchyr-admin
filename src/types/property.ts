export interface PropertyImage {
    id: number;
    url: string;
    isMain: boolean;
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
    content: string;
    rating: number;
    propertyId: number;
    createdAt: string;
}

export interface Property {
    id: number;
    name: string;
    categoryId: number;
    category: {
        id: number;
        name: string;
    };
    status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RESERVED';
    ownershipType: string;
    description: string;
    city: string;
    street: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    virtualTour: string | null;
    videoUrl: string | null;
    size: string;
    beds: string;
    baths: string;
    layout: string | null;
    files: any | null;
    price: number;
    discountedPrice: number | null;
    buildingStoriesNumber: string | null;
    buildingCondition: string | null;
    apartmentCondition: string | null;
    aboveGroundFloors: string | null;
    reconstructionYearApartment: string | null;
    reconstructionYearBuilding: string | null;
    totalAboveGroundFloors: string | null;
    totalUndergroundFloors: string | null;
    floorArea: string | null;
    builtUpArea: string | null;
    gardenHouseArea: string | null;
    terraceArea: string | null;
    totalLandArea: string | null;
    gardenArea: string | null;
    garageArea: string | null;
    balconyArea: string | null;
    pergolaArea: string | null;
    basementArea: string | null;
    workshopArea: string | null;
    totalObjectArea: string | null;
    usableArea: string | null;
    landArea: string | null;
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
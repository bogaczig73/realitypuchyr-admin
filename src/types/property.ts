export interface PropertyImage {
    id: number;
    url: string;
    isMain: boolean;
    propertyId: number;
    createdAt: string;
}

export interface Property {
    id: number;
    name: string;
    image: string;
    sqf: string;
    beds: string;
    baths: string;
    price: number;
    layout: string;
    category: string;
    status: string;
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
}

export interface Pagination {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export interface PaginatedResponse {
    properties: Property[];
    pagination: Pagination;
} 
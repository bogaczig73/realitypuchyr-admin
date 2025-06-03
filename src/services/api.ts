import axios from 'axios';
import { Property, PropertyResponse } from '@/types/property';

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse {
    properties: Property[];
    pagination: Pagination;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const transformProperty = (data: any): Property => ({
    id: data.id,
    name: data.name,
    categoryId: data.category.id,
    category: {
        id: data.category.id,
        name: data.category.name
    },
    status: data.status,
    ownershipType: data.ownershipType,
    description: data.description,
    city: data.city,
    street: data.street,
    country: data.country,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    virtualTour: data.virtualTour || null,
    videoUrl: data.videoUrl || null,
    size: data.size,
    beds: data.beds,
    baths: data.baths,
    layout: data.layout || null,
    files: data.files || null,
    price: Number(data.price),
    discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : null,
    buildingStoriesNumber: data.buildingStoriesNumber || null,
    buildingCondition: data.buildingCondition || null,
    apartmentCondition: data.apartmentCondition || null,
    aboveGroundFloors: data.aboveGroundFloors || null,
    reconstructionYearApartment: data.reconstructionYearApartment || null,
    reconstructionYearBuilding: data.reconstructionYearBuilding || null,
    totalAboveGroundFloors: data.totalAboveGroundFloors || null,
    totalUndergroundFloors: data.totalUndergroundFloors || null,
    floorArea: data.floorArea || null,
    builtUpArea: data.builtUpArea || null,
    gardenHouseArea: data.gardenHouseArea || null,
    terraceArea: data.terraceArea || null,
    totalLandArea: data.totalLandArea || null,
    gardenArea: data.gardenArea || null,
    garageArea: data.garageArea || null,
    balconyArea: data.balconyArea || null,
    pergolaArea: data.pergolaArea || null,
    basementArea: data.basementArea || null,
    workshopArea: data.workshopArea || null,
    totalObjectArea: data.totalObjectArea || null,
    usableArea: data.usableArea || null,
    landArea: data.landArea || null,
    objectType: data.objectType || null,
    objectLocationType: data.objectLocationType || null,
    houseEquipment: data.houseEquipment || null,
    accessRoad: data.accessRoad || null,
    objectCondition: data.objectCondition || null,
    reservationPrice: data.reservationPrice || null,
    equipmentDescription: data.equipmentDescription || null,
    additionalSources: data.additionalSources || null,
    buildingPermit: data.buildingPermit || null,
    buildability: data.buildability || null,
    utilitiesOnLand: data.utilitiesOnLand || null,
    utilitiesOnAdjacentRoad: data.utilitiesOnAdjacentRoad || null,
    payments: data.payments || null,
    brokerId: data.brokerId || null,
    secondaryAgent: data.secondaryAgent || null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    images: data.images || [],
    floorplans: data.floorplans || [],
    reviews: data.reviews || []
});

export const propertyApi = {
    getAll: async (page = 1, limit = 12, search = ''): Promise<PropertyResponse> => {
        const response = await axios.get(`${API_BASE_URL}/properties`, {
            params: { page, limit, search }
        });
        return {
            properties: response.data.properties.map(transformProperty),
            pagination: response.data.pagination
        };
    },

    getById: async (id: number): Promise<Property> => {
        const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
        return transformProperty(response.data);
    },

    create: async (propertyData: FormData): Promise<Property> => {
        const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return transformProperty(response.data);
    },

    update: async (id: number, propertyData: Partial<Property>): Promise<Property> => {
        const response = await axios.put(`${API_BASE_URL}/properties/${id}`, propertyData);
        return transformProperty(response.data);
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/properties/${id}`);
    },
}; 
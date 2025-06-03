import { Property, PropertyResponse } from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const propertyService = {
    async getProperties(page: number = 1, limit: number = 12, search: string = ""): Promise<PropertyResponse> {
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const response = await fetch(`${API_BASE_URL}/properties?page=${page}&limit=${limit}${searchParam}`);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            
            // Transform the response to match our PropertyResponse interface
            return {
                properties: data.properties.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    categoryId: p.categoryId,
                    category: p.category,
                    status: p.status,
                    ownershipType: p.ownershipType,
                    description: p.description,
                    city: p.city,
                    street: p.street,
                    country: p.country,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    virtualTour: p.virtualTour,
                    videoUrl: p.videoUrl,
                    size: p.size,
                    beds: p.beds,
                    baths: p.baths,
                    layout: p.layout,
                    files: p.files,
                    price: Number(p.price),
                    discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
                    buildingStoriesNumber: p.buildingStoriesNumber,
                    buildingCondition: p.buildingCondition,
                    apartmentCondition: p.apartmentCondition,
                    aboveGroundFloors: p.aboveGroundFloors,
                    reconstructionYearApartment: p.reconstructionYearApartment,
                    reconstructionYearBuilding: p.reconstructionYearBuilding,
                    totalAboveGroundFloors: p.totalAboveGroundFloors,
                    totalUndergroundFloors: p.totalUndergroundFloors,
                    floorArea: p.floorArea,
                    builtUpArea: p.builtUpArea,
                    gardenHouseArea: p.gardenHouseArea,
                    terraceArea: p.terraceArea,
                    totalLandArea: p.totalLandArea,
                    gardenArea: p.gardenArea,
                    garageArea: p.garageArea,
                    balconyArea: p.balconyArea,
                    pergolaArea: p.pergolaArea,
                    basementArea: p.basementArea,
                    workshopArea: p.workshopArea,
                    totalObjectArea: p.totalObjectArea,
                    usableArea: p.usableArea,
                    landArea: p.landArea,
                    objectType: p.objectType,
                    objectLocationType: p.objectLocationType,
                    houseEquipment: p.houseEquipment,
                    accessRoad: p.accessRoad,
                    objectCondition: p.objectCondition,
                    reservationPrice: p.reservationPrice,
                    equipmentDescription: p.equipmentDescription,
                    additionalSources: p.additionalSources,
                    buildingPermit: p.buildingPermit,
                    buildability: p.buildability,
                    utilitiesOnLand: p.utilitiesOnLand,
                    utilitiesOnAdjacentRoad: p.utilitiesOnAdjacentRoad,
                    payments: p.payments,
                    brokerId: p.brokerId,
                    secondaryAgent: p.secondaryAgent,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    images: p.images || [],
                    floorplans: p.floorplans || [],
                    reviews: p.reviews || []
                })),
                pagination: data.pagination
            };
        } catch (error) {
            console.error('Error in getProperties:', error);
            throw error;
        }
    },

    async getPropertyById(id: number): Promise<Property> {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch property');
            }
            const property = await response.json();
            
            // Transform the response to match our Property interface
            return {
                id: property.id,
                name: property.name,
                categoryId: property.categoryId,
                category: property.category,
                status: property.status,
                ownershipType: property.ownershipType,
                description: property.description,
                city: property.city,
                street: property.street,
                country: property.country,
                latitude: property.latitude,
                longitude: property.longitude,
                virtualTour: property.virtualTour,
                videoUrl: property.videoUrl,
                size: property.size,
                beds: property.beds,
                baths: property.baths,
                layout: property.layout,
                files: property.files,
                price: Number(property.price),
                discountedPrice: property.discountedPrice ? Number(property.discountedPrice) : null,
                buildingStoriesNumber: property.buildingStoriesNumber,
                buildingCondition: property.buildingCondition,
                apartmentCondition: property.apartmentCondition,
                aboveGroundFloors: property.aboveGroundFloors,
                reconstructionYearApartment: property.reconstructionYearApartment,
                reconstructionYearBuilding: property.reconstructionYearBuilding,
                totalAboveGroundFloors: property.totalAboveGroundFloors,
                totalUndergroundFloors: property.totalUndergroundFloors,
                floorArea: property.floorArea,
                builtUpArea: property.builtUpArea,
                gardenHouseArea: property.gardenHouseArea,
                terraceArea: property.terraceArea,
                totalLandArea: property.totalLandArea,
                gardenArea: property.gardenArea,
                garageArea: property.garageArea,
                balconyArea: property.balconyArea,
                pergolaArea: property.pergolaArea,
                basementArea: property.basementArea,
                workshopArea: property.workshopArea,
                totalObjectArea: property.totalObjectArea,
                usableArea: property.usableArea,
                landArea: property.landArea,
                objectType: property.objectType,
                objectLocationType: property.objectLocationType,
                houseEquipment: property.houseEquipment,
                accessRoad: property.accessRoad,
                objectCondition: property.objectCondition,
                reservationPrice: property.reservationPrice,
                equipmentDescription: property.equipmentDescription,
                additionalSources: property.additionalSources,
                buildingPermit: property.buildingPermit,
                buildability: property.buildability,
                utilitiesOnLand: property.utilitiesOnLand,
                utilitiesOnAdjacentRoad: property.utilitiesOnAdjacentRoad,
                payments: property.payments,
                brokerId: property.brokerId,
                secondaryAgent: property.secondaryAgent,
                createdAt: property.createdAt,
                updatedAt: property.updatedAt,
                images: property.images || [],
                floorplans: property.floorplans || [],
                reviews: property.reviews || []
            };
        } catch (error) {
            console.error('Error in getPropertyById:', error);
            throw error;
        }
    },

    async getTopProperties(limit: number = 5): Promise<Property[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/properties?limit=${limit}&sort=rating`);
            if (!response.ok) {
                throw new Error('Failed to fetch top properties');
            }
            const data = await response.json();
            
            // Transform the response to match our Property interface
            return data.properties.map((p: any) => ({
                id: p.id,
                name: p.name,
                categoryId: p.categoryId,
                category: p.category,
                status: p.status,
                ownershipType: p.ownershipType,
                description: p.description,
                city: p.city,
                street: p.street,
                country: p.country,
                latitude: p.latitude,
                longitude: p.longitude,
                virtualTour: p.virtualTour,
                videoUrl: p.videoUrl,
                size: p.size,
                beds: p.beds,
                baths: p.baths,
                layout: p.layout,
                files: p.files,
                price: Number(p.price),
                discountedPrice: p.discountedPrice ? Number(p.discountedPrice) : null,
                buildingStoriesNumber: p.buildingStoriesNumber,
                buildingCondition: p.buildingCondition,
                apartmentCondition: p.apartmentCondition,
                aboveGroundFloors: p.aboveGroundFloors,
                reconstructionYearApartment: p.reconstructionYearApartment,
                reconstructionYearBuilding: p.reconstructionYearBuilding,
                totalAboveGroundFloors: p.totalAboveGroundFloors,
                totalUndergroundFloors: p.totalUndergroundFloors,
                floorArea: p.floorArea,
                builtUpArea: p.builtUpArea,
                gardenHouseArea: p.gardenHouseArea,
                terraceArea: p.terraceArea,
                totalLandArea: p.totalLandArea,
                gardenArea: p.gardenArea,
                garageArea: p.garageArea,
                balconyArea: p.balconyArea,
                pergolaArea: p.pergolaArea,
                basementArea: p.basementArea,
                workshopArea: p.workshopArea,
                totalObjectArea: p.totalObjectArea,
                usableArea: p.usableArea,
                landArea: p.landArea,
                objectType: p.objectType,
                objectLocationType: p.objectLocationType,
                houseEquipment: p.houseEquipment,
                accessRoad: p.accessRoad,
                objectCondition: p.objectCondition,
                reservationPrice: p.reservationPrice,
                equipmentDescription: p.equipmentDescription,
                additionalSources: p.additionalSources,
                buildingPermit: p.buildingPermit,
                buildability: p.buildability,
                utilitiesOnLand: p.utilitiesOnLand,
                utilitiesOnAdjacentRoad: p.utilitiesOnAdjacentRoad,
                payments: p.payments,
                brokerId: p.brokerId,
                secondaryAgent: p.secondaryAgent,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                images: p.images || [],
                floorplans: p.floorplans || [],
                reviews: p.reviews || []
            }));
        } catch (error) {
            console.error('Error in getTopProperties:', error);
            throw error;
        }
    }
}; 
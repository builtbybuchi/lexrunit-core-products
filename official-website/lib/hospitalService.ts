const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8001/api/v1';
const API_KEY = import.meta.env.VITE_LEXRUNIT_API_KEY || 'default-dev-key';
const getHeaders = () => ({ 'x-lexrunit-api-key': API_KEY });

// TODO: Replace with actual collection IDs
export const DATABASE_ID = 'REPLACE_WITH_DATABASE_ID'; // Or use 'default' if applicable, but usually a specific ID
export const HOSPITALS_COLLECTION_ID = 'hospitals';
export const MESSAGES_COLLECTION_ID = 'messages';

export interface Hospital {
    $id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    products: string[]; // Array of product IDs/names e.g., ['lexcare-hms', 'dr-andre']
    website?: string;
    phone?: string;
    email?: string;
}

export interface MessageData {
    name: string;
    email: string;
    phone?: string;
    hospitalName?: string;
    message: string;
    type: 'recommendation' | 'registration';
}

export const getHospitals = async (filters?: { state?: string; city?: string; product?: string }) => {
    try {
        const params = new URLSearchParams();
        if (filters?.state) params.append('state', filters.state);
        if (filters?.city) params.append('city', filters.city);
        if (filters?.product) params.append('product', filters.product);

        const response = await fetch(`${BASE_URL}/hospitals?${params.toString()}`, { headers: getHeaders() });
        const data = await response.json();
        return data as Hospital[];
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        return [];
    }
};

export const submitMessage = async (data: MessageData) => {
    try {
        const response = await fetch(`${BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders()
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                subject: `Message from ${data.hospitalName || data.name} (${data.type})`,
                message: data.message
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error submitting message:', error);
        return false;
    }
};

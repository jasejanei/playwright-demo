import { get } from "http";

export const endpoints = {
    qs: (obj?: Record<string, unknown>) => {
        if (!obj || Object.keys(obj).length === 0) return '';
        const params = new URLSearchParams();
        for (const [k,v] of Object.entries(obj)) {
            if( v === undefined || v === null) continue;
            params.append(k, String(v));
        }
        return `?${params.toString()}`;
    },

    auth: {
        createToke: () => `/auth` 
    },

    booking: {
        getBookings: (filters?: { firstname?: string; lastname?: string; checkin?: string; checkout?: string }) =>
            `/booking${endpoints.qs(filters)}`,
        getBooking: (id: number) => `/booking/${id}`,
        createBooking: () => `/booking`,
        updateBooking: (id: number) => `/booking/${id}`,
        partialUpdateBooking: (id: number) => `/booking/${id}`,
        deleteBooking: (id: number) => `/booking/${id}`
    }
}
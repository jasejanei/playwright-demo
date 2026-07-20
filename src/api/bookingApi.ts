import { APIRequestContext, APIResponse, expect } from "@playwright/test";
import { endpoints } from "./endpoints";
import { BaseApi } from "../pages/base/baseApi";

export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface BookingData {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

export interface BookingListItem {
    bookingid: number;
}

export interface CreateBookingResponse {
    bookingid: number;
    booking: BookingData
}

export class BookingApi extends BaseApi {
    constructor(private request: APIRequestContext) { super(); }


//CORE API Request handler
    async getResponse(link: string, method:
        'get' | 'post' | 'put' | 'patch' |'delete', data?: any) {
        try {
            let response;

            if (method === 'get' || method === 'delete') {
                //GET - no body
                response = await this.request[method](link);
            } else {
                //POST/PUT/PATCH - with body
                response = await this.request[method](link, {
                    data: data
                });
            }

            if (method === 'delete'){
                const textResponse = await response.text();
                console.log(`Delete Response: ${textResponse}`);
                return { status: response.status, message: textResponse }
            }

            //For other methods, check content type before parsing
            const contentType = response.headers()['content-type'] || '';
            if (contentType.includes('application/json')) {
                const responseData = await response.json();
                this.baseApiGetApiMessage(responseData);
                return responseData
            } else {
                //Handle non-JSON (plain text, html)
                const textResponse = await response.text();
                console.log(`Non-JSON Response (${contentType}): ${textResponse}`);
                return { status: response.status(), message: textResponse };
            }
            
        } catch (error) {
            console.error(`Error in getResponse for ${link}`, error);
            throw error
        }
    }


    /**
     * Get all booking IDs with optional filters
     * Returns array of booking IDs: [{ bookingid: 1 }, { bookingid: 2 }, ...]
     */
    async getBookingList(filters: {
        firstname?: string;
        lastname?: string;
        checkin?: string;
        checkout?: string;
    }) {
        const url = endpoints.booking.getBookings(filters);
        return await this.getResponse(url, 'get');
    }

    /**
     * Get specific booking details by ID
     * Returns booking object with firstname, lastname, etc.
     */
    async getBooking(id: number) {
        const url = endpoints.booking.getBooking(id);
        return await this.getResponse(url, 'get');
    }

    /**
     * Create new booking
     * Returns { bookingId: number, booking: BookingData}
     */
    async createBooking(data: BookingData) {
        const url = endpoints.booking.createBooking();
        return await this.getResponse(url, 'post', data);
    }

    /**
     * Update booking (require auth)
     * Returns updated bookingdata
     */
    async updateBooking(id: number, data: BookingData) {
        const url = endpoints.booking.updateBooking(id);
        return await this.getResponse(url, 'put', data);
    }

    /**
     * Partially Update booking (require auth)
     * Returns updated bookingdata
     */
    async partialUpdateBooking(id: number, partialData: Partial<BookingData>) {
        const url = endpoints.booking.partialUpdateBooking(id);
        return await this.getResponse(url, 'patch', partialData);
    }

    /**
     * Delete booking (requires auth)
     * Returns status message
     */
    async deleteBooking(id: number) {
        const url = endpoints.booking.deleteBooking(id);
        return await this.getResponse(url, 'delete');
    }

    //========== ASSERTION =====================
    /**
     * Assert that booking list is valid and contain bookings
     */
    async assertBookingListValid(bookings: BookingListItem[], minCount: number = 1){
        expect(Array.isArray(bookings), 'Response should be an array').toBeTruthy();
        expect(bookings.length, `Should have at least ${minCount} booking(s)`).toBeGreaterThan(minCount);

        if(bookings.length > 0) {
            expect(bookings[0]).toHaveProperty('bookingid');
            expect(typeof bookings[0].bookingid).toBe('number');
        }
        console.log(`Booking list valid with ${bookings.length} booking(s)`);
    }

    async assertBookingStructure(booking: BookingData) {
        expect(booking).toHaveProperty('firstname');
        expect(booking).toHaveProperty('lastname');
        expect(booking).toHaveProperty('totalprice');
        expect(booking).toHaveProperty('depositpaid');
        expect(booking).toHaveProperty('bookingdates');
        expect(booking.bookingdates).toHaveProperty('checkin');
        expect(booking.bookingdates).toHaveProperty('checkout');
        
        // Validate types
        expect(typeof booking.firstname).toBe('string');
        expect(typeof booking.lastname).toBe('string');
        expect(typeof booking.totalprice).toBe('number');
        expect(typeof booking.depositpaid).toBe('boolean');
        
        console.log('Booking structure valid');
    }

    /**
     * Assert booking was created successfully
     */
    async assertBookingCreated(response: CreateBookingResponse, expectedData?: Partial<BookingData>) {
        expect(response).toHaveProperty('bookingid');
        expect(response).toHaveProperty('booking');
        expect(typeof response.bookingid).toBe('number');
        expect(response.bookingid).toBeGreaterThan(0);
        
        this.assertBookingStructure(response.booking);
        
        // If expected data provided, validate specific fields
        if (expectedData) {
            if (expectedData.firstname) {
                expect(response.booking.firstname).toBe(expectedData.firstname);
            }
            if (expectedData.lastname) {
                expect(response.booking.lastname).toBe(expectedData.lastname);
            }
            if (expectedData.totalprice !== undefined) {
                expect(response.booking.totalprice).toBe(expectedData.totalprice);
            }
            if (expectedData.depositpaid !== undefined) {
                expect(response.booking.depositpaid).toBe(expectedData.depositpaid);
            }
            if (expectedData.bookingdates) {
                expect(response.booking.bookingdates.checkin).toBe(expectedData.bookingdates.checkin);
                expect(response.booking.bookingdates.checkout).toBe(expectedData.bookingdates.checkout);
            }
            if (expectedData.additionalneeds) {
                expect(response.booking.additionalneeds).toBe(expectedData.additionalneeds);
            }
        }
        
        console.log(`✓ Booking created successfully with ID: ${response.bookingid}`);
        return response.bookingid;
    }

    /**
     * Assert booking was updated with expected values
     */
    async assertBookingUpdated(updatedBooking: BookingData, expectedData: Partial<BookingData>) {
        this.assertBookingStructure(updatedBooking);
        
        if (expectedData.firstname) {
            expect(updatedBooking.firstname).toBe(expectedData.firstname);
        }
        if (expectedData.lastname) {
            expect(updatedBooking.lastname).toBe(expectedData.lastname);
        }
        if (expectedData.totalprice !== undefined) {
            expect(updatedBooking.totalprice).toBe(expectedData.totalprice);
        }
        if (expectedData.depositpaid !== undefined) {
            expect(updatedBooking.depositpaid).toBe(expectedData.depositpaid);
        }
        if (expectedData.bookingdates) {
            expect(updatedBooking.bookingdates.checkin).toBe(expectedData.bookingdates.checkin);
            expect(updatedBooking.bookingdates.checkout).toBe(expectedData.bookingdates.checkout);
        }
        if (expectedData.additionalneeds !== undefined) {
            expect(updatedBooking.additionalneeds).toBe(expectedData.additionalneeds);
        }
        
        console.log('Booking updated successfully');
    }

    /**
     * Assert booking matches expected data
     */
    async assertBookingMatches(booking: BookingData, expectedData: Partial<BookingData>) {
        this.assertBookingStructure(booking);
        this.assertBookingUpdated(booking, expectedData);
    }

    /**
     * Assert booking dates are valid
     */
    async assertBookingDatesValid(bookingdates: BookingDates) {
        const checkinDate = new Date(bookingdates.checkin);
        const checkoutDate = new Date(bookingdates.checkout);
        
        expect(checkinDate.toString()).not.toBe('Invalid Date');
        expect(checkoutDate.toString()).not.toBe('Invalid Date');
        expect(checkoutDate.getTime()).toBeGreaterThan(checkinDate.getTime());
        
        console.log(`Booking dates valid: ${bookingdates.checkin} to ${bookingdates.checkout}`);
    }

    /**
     * Assert booking contains specific name
     */
    async assertBookingName(booking: BookingData, firstname: string, lastname: string) {
        expect(booking.firstname).toBe(firstname);
        expect(booking.lastname).toBe(lastname);
        console.log(`Booking name matches: ${firstname} ${lastname}`);
    }

    /**
     * Assert booking price is within expected range
     */
    async assertBookingPriceRange(booking: BookingData, minPrice: number, maxPrice: number) {
        expect(booking.totalprice).toBeGreaterThanOrEqual(minPrice);
        expect(booking.totalprice).toBeLessThanOrEqual(maxPrice);
        console.log(`Booking price ${booking.totalprice} is within range [${minPrice}, ${maxPrice}]`);
    }

    /**
     * Assert deposit status
     */
    async assertDepositPaid(booking: BookingData, expectedStatus: boolean) {
        expect(booking.depositpaid).toBe(expectedStatus);
        console.log(`Deposit paid status: ${expectedStatus}`);
    }

    async assertBookingDeleted(bookingid: number) {
        const response = await this.getBooking(bookingid);
        expect(response.status).toBe(404);
        
        console.log(`Booking ${bookingid} verified as deleted`);
    }


    //Additional Helper
    async getLatestBookingid(): Promise<number> {
        const url = endpoints.booking.getBookings();
        const data = await this.getResponse(url, 'get');
        const payload = data.payload;
        this.baseApiGetApiMessage(data);

        if (payload === null || payload.length === 0) {
            console.log("No bookings found");
            return 0;
        }
        const latestId = payload.reduce((max: number, c: { id: number }) => Math.max(max, Number(c.id)), 0);
        return latestId;
    }
}

    


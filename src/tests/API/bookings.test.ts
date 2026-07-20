import { BookingData } from "../../api/bookingApi";
import { test, expect } from "../../fixtures/fixtures";

test.describe("API Booking tests", () => {

    test('Get All bookings', async ({ API }) => {
        const bookings = await API.booking.getBookingList({});
        await API.booking.assertBookingListValid(bookings);
    })

    test('Get Specific booking', async ({ API }) => {
        const bookings = await API.booking.getBookingList({});
        const booking = await API.booking.getBooking(bookings[0].bookingid);

        await API.booking.assertBookingStructure(booking);
        await API.booking.assertBookingDatesValid(booking.bookingdates)
    });

});

test.describe('API Booking CRUD Test', () => {
    let createdBookingId: number;
    let authToken: string;

    test('CRUD Test', async ({ API }) => {
        console.log('CREATE: Creating new booking...');
        const newBooking: BookingData =  {
            firstname: "Crew",
            lastname: "Taste",
            totalprice: 50,
            depositpaid: true, 
            bookingdates: {
                checkin: "2026-07-20",
                checkout: "2026-08-20"
            },
            additionalneeds: "Breakfast"
        };
        const createResponse = await API.booking.createBooking(newBooking);
        createdBookingId = await API.booking.assertBookingCreated(createResponse, newBooking);
        console.log(`Created booking with ID: ${createdBookingId}`);

        console.log('READ: Fetching created booking...');
        const fetchedBooking = await API.booking.getBooking(createdBookingId);
        await API.booking.assertBookingStructure(fetchedBooking);
        await API.booking.assertBookingName(fetchedBooking, "Crew", "Taste");
        await API.booking.assertDepositPaid(fetchedBooking, true);
        await API.booking.assertBookingDatesValid(fetchedBooking.bookingdates);
        console.log('Successfully fetched and validated booking');

        console.log('AUTH: Getting auth token for update...');
        const loginResponse = await API.auth.login(
            process.env.API_USERNAME!,
            process.env.API_PASSWORD!
        );
        authToken = API.auth.validateToken(loginResponse);
        console.log('Authentication successful, token obtained');

        console.log('UPDATE: Update entire booking...');
        const updatedBooking: BookingData = {
            firstname: "Patricia",
            lastname: "Modified",
            totalprice: 100,
            depositpaid: false,
            bookingdates: {
                checkin: "2026-09-01",
                checkout: "2026-09-15"
            },
            additionalneeds: "Parking"
        };
        const updateResponse = await API.booking.updateBooking(createdBookingId, updatedBooking);
        await API.booking.assertBookingUpdated(updateResponse, updatedBooking);
        await API.booking.assertBookingName(updateResponse, "Patricia", "Modified");
        await API.booking.assertDepositPaid(updateResponse, false);
        console.log('Booking updated successfully');

        console.log('PARTIAL UPDATE: Updating specific fields...');
        const partialUpdate = {
            firstname: "Crew-Partial",
            totalprice: 99
        };
        const partialResponse = await API.booking.partialUpdateBooking(createdBookingId, partialUpdate);
        await API.booking.assertBookingUpdated(partialResponse, partialUpdate);

        //Verify other fields remained unchanged
        expect(partialResponse.lastname).toBe("Modified")
        expect(partialResponse.depositpaid).toBe(false);
        console.log('Partial updated successfully')

        console.log('READ: Verifying updates saved...');
        const verifyBooking = await API.booking.getBooking(createdBookingId);
        expect(verifyBooking.firstname).toBe("Crew-Partial");
        expect(verifyBooking.totalprice).toBe(99);
        expect(verifyBooking.lastname).toBe("Modified");
        console.log('Updates verified successfully');

        console.log('DELETE: Removing booking...');
        await API.booking.deleteBooking(createdBookingId);
        console.log(`Booking ${createdBookingId} deleted successfully`);

        console.log('VERIFY DELETED')
        await API.booking.assertBookingDeleted(createdBookingId);

        console.log('CRUD Workflow completed successfully');
    })
});

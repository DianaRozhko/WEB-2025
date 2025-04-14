import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    register(createUserDto: any): Promise<any>;
    login(loginUserDto: any): Promise<any>;
    findAllUsers(): Promise<any>;
    findOneUser(id: string): Promise<any>;
    updateUser(id: string, updateUserDto: any): Promise<any>;
    removeUser(id: string): Promise<any>;
    createVenue(createVenueDto: any): Promise<any>;
    getAllVenues(): Promise<any>;
    updateVenue(id: string, updateVenueDto: any): Promise<any>;
    removeVenue(id: string): Promise<any>;
    getSlotsForVenue(venueId: string): Promise<any>;
    generateSlots(venueId: string, generateDto: any): Promise<any>;
    createSlot(createSlotDto: any): Promise<any>;
    getAllSlots(): Promise<any>;
    getSlotById(id: string): Promise<any>;
    updateSlot(id: string, updateSlotDto: any): Promise<any>;
    removeSlot(id: string): Promise<any>;
    createBookingFromSlots(data: {
        user_id: string;
        venue_id: string;
        slot_ids: string[];
    }): Promise<any>;
    cancelBooking(bookingId: string): Promise<any>;
}

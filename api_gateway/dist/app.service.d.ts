export declare class AppService {
    private userClient;
    private venueClient;
    private bookingClient;
    constructor();
    createUser(dto: any): Promise<any>;
    loginUser(dto: any): Promise<any>;
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    updateUser(id: string, dto: any): Promise<any>;
    removeUser(id: string): Promise<any>;
    createVenue(dto: any): Promise<any>;
    getAllVenues(): Promise<any>;
    updateVenue(id: string, dto: any): Promise<any>;
    removeVenue(id: string): Promise<any>;
    getSlotsForVenue(venueId: string): Promise<any>;
    generateSlotsForVenue(data: any): Promise<any>;
    createSlot(dto: any): Promise<any>;
    getAllSlots(): Promise<any>;
    getSlotById(id: string): Promise<any>;
    updateSlot(id: string, dto: any): Promise<any>;
    removeSlot(id: string): Promise<any>;
    createBookingFromSlots(data: {
        user_id: string;
        venue_id: string;
        slot_ids: string[];
    }): Promise<any>;
    private mapRpcToHttp;
    cancelBookingOrchestrated(bookingId: string): Promise<any>;
}

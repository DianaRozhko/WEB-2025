import { ClientProxy } from '@nestjs/microservices';
export declare class AppService {
    private userClient;
    private venueClient;
    constructor(userClient: ClientProxy, venueClient: ClientProxy);
    createUser(createUserDto: any): Promise<any>;
    loginUser(loginUserDto: any): Promise<any>;
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    removeUser(id: string): Promise<any>;
    updateUser(id: string, updateUserDto: any): Promise<any>;
    createVenue(createVenueDto: any): Promise<any>;
    getAllVenues(): Promise<any>;
    updateVenue(id: string, updateVenueDto: any): Promise<any>;
    removeVenue(id: string): Promise<any>;
    getSlotsForVenue(venueId: string): Promise<any>;
    createSlot(dto: any): Promise<any>;
    getAllSlots(): Promise<any>;
    getSlotById(id: string): Promise<any>;
    updateSlot(id: string, dto: any): Promise<any>;
    removeSlot(id: string): Promise<any>;
    generateSlotsForVenue(dto: any): Promise<any>;
}

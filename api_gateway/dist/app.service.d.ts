import { ClientProxy } from '@nestjs/microservices';
export declare class AppService {
    private client;
    constructor(client: ClientProxy);
    createUser(createUserDto: any): Promise<any>;
    loginUser(loginUserDto: any): Promise<any>;
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    removeUser(id: string): Promise<any>;
    updateUser(id: string, updateUserDto: any): Promise<any>;
}

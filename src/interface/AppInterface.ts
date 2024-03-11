export interface IResponse {
    resultCode: number;
    data: any;
    message: string;
}

export interface IUserData {
    accessToken: string;
    role: string[];
    avt: string;
    dayOfBirth: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    role_id: number;
    userId: number;
    userName: string;
}
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

export type IReportStatus = "DENIED";

export interface IReport {
    description: string;
    image: string;
    report_id: number;
    report_time: string;
    status: string;
    title: string;
    phone_number: string;
    user_name: string;
    user_report_id: number;
    action: IReportStatus;
    lat: number;
    lng: number;
}

export interface IStatusReport {
    lable: string;
    value: string;
    color: string;
}

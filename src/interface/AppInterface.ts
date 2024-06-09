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

export interface IAnimalImage {
    description: string;
    image_id: number;
    image_local_path: string;
    image_public_path: string;
    image_type: string;
    status: string;
}

export interface IAnimal {
    animal_infor: string;
    animal_red_list_id: number;
    animal_type: string;
    conservation_status: string;
    en_name: string;
    images: IAnimalImage[];
    predict_id: number;
    sc_name: string;
    status: string;
    vn_name: string;
}

export interface IAnimalType {
    animal_type_id: number;
    description: string;
    status: string;
    type_name: string;
}

export interface IConversationStatus {
    conservation_status_id: number;
    description: string;
    stand_name: string;
    status: string;
    status_name: string;
}

export interface IContribute {
    user_id: number;
    email: string;
    full_name: string;
    phone_number: string;
    contribute_id: number;
    animal_name: string;
    description: string;
    datetime: string;
    status: string;
    images: IAnimalImage[];
}

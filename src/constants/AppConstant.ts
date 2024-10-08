import { Options } from "../interface/AppInterface";

export const COLOR_PRIMARY = '#45d279';
export const COLOR_ERROR = '#EF4444';
export const COLOR_BASIC = '#3D75FA';

// export const KEY_API_GOOGLE_MAP = 'AIzaSyDdyfzO1qNJhud6RAfpQ8wCqVqIm9qoC80';
export const KEY_API_GOOGLE_MAP = 'AIzaSyAAhAkc2RNUBNQHpP8rEHLiXtfVJyewbR8';


export const STORAGE_KEY = {
    USER_DATA: 'userDate',
    PREVIOUS_PATH: 'previousPath'
}

export const ROUTE_RIGHT = {
    report: '/report/getReport',
    createAccount: '/admin/createOfficerAccount',
    getListAnimal: '/redList/getAnimalRedList',
    createAnimal: '/admin/addAnimalRedList',
    updateAnimal: '/admin/updateAnimalType',
    getContribute: '/contribute/getContributeById',
    createContribute: '/contribute/createContribute',
    getUserList: '/admin/getUsersList',
}

export const STATUS_REPORT = {
    DENIED: {
        title: 'Từ chối',
        color: 'error'
    },
    CREATE: {
        title: 'Mới',
        color: 'basic'
    },
    ACCEPT: {
        title: 'Chấp nhận',
        color: 'primary'
    }
}

export const STATUS_REPORT_OPTIONS = [
    {
        lable: 'Từ chối',
        value: 'DENIED',
        color: 'error'
    },
    {
        lable: 'Mới',
        value: 'CREATE',
        color: 'basic'
    },
    {
        lable: 'Chấp nhận',
        value: 'ACCEPT',
        color: 'primary'
    },
]

export const STATUS_CONTRIBUTE: Options[] = [
    {
        label: 'Từ chối',
        color: 'error',
        value: 'XX'
    },
    {
        label: 'Chấp nhận',
        color: 'error',
        value: 'OK'
    },
    {
        label: 'Mới',
        color: 'basic',
        value: 'WT'
    }
]
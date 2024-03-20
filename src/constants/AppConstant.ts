export const COLOR_PRIMARY = '#45d279';
export const COLOR_ERROR = '#EF4444';
export const COLOR_BASIC = '#3D75FA';

export const KEY_API_GOOGLE_MAP = 'AIzaSyCmhOtOrEHMV-QYanl5Q24wTJdSW_dB-Qs';

export const STORAGE_KEY = {
    USER_DATA: 'userDate',
    PREVIOUS_PATH: 'previousPath'
}

export const ROUTE_RIGHT = {
    report: '/report/getReport',
}

export const STATUS_REPORT = {
    DENIED: {
        title: 'Từ chối',
        color: COLOR_ERROR
    },
    CREATE: {
        title: 'Mới',
        color: COLOR_BASIC
    },
    ACCEPT: {
        title: 'Chấp nhận',
        color: COLOR_PRIMARY
    }

}

export const STATUS_REPORT_OPTIONS = [
    {
        lable: 'Từ chối',
        value: 'DENIED',
        color: COLOR_ERROR
    },
    {
        lable: 'Mới',
        value: 'CREATE',
        color: COLOR_BASIC
    },
    {
        lable: 'Chấp nhận',
        value: 'ACCEPT',
        color: COLOR_PRIMARY
    },
]
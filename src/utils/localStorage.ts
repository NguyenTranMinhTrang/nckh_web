const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const getDataFromLocal = (key: string) => {
    if (key) {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
    }
    return null;
}

export {
    saveToLocal,
    getDataFromLocal,
}
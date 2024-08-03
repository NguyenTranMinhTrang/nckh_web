export const defaultSort = (a: any, b: any) => {
    const diff = a - b;
    return isNaN(diff) ? a.localeCompare(b) : (diff ? diff / Math.abs(diff) : 0);
};

export const checkRight = (rights: string[], right: string): boolean => {
    if (rights?.includes(right)) {
        return true;
    }
    return false;
}
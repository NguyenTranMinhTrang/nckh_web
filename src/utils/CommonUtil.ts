export const defaultSort = (a: any, b: any) => {
    const diff = a - b;
    return isNaN(diff) ? a.localeCompare(b) : (diff ? diff / Math.abs(diff) : 0);
};
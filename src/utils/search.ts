export const getUpperConstraint = (search: string) => {
    return search.substring(0, search.length - 1) +
        String.fromCharCode(search.charCodeAt(search.length - 1) + 1);
};

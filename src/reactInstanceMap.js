export const ReactInstanceMap = {
    set(key, value) {
        key.__feactInternalInstance = value;
    },

    get(key) {
        return key.__feactInternalInstance;
    }
};
export default class SessionStorageService {
    constructor(prefix = 'app_') {
        this.prefix = prefix;
        this.registry = new Map();
    }

    _getKey(key) {
        const namespaced = `${this.prefix}${key}`;
        this.registry.set(key, namespaced);
        return namespaced;
    }

    set(key, value) {
        try {
            const stringified = JSON.stringify(value);
            sessionStorage.setItem(this._getKey(key), stringified);
        } catch (error) {
            console.warn(`Failed to set sessionStorage for key: ${key}`, error);
        }
    }

    get(key) {
        try {
            const stored = sessionStorage.getItem(this._getKey(key));
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.warn(`Failed to get sessionStorage for key: ${key}`, error);
            return null;
        }
    }

    remove(key) {
        sessionStorage.removeItem(this._getKey(key));
        this.registry.delete(key);
    }

    clear() {
        for (const [, namespacedKey] of this.registry.entries()) {
            sessionStorage.removeItem(namespacedKey);
        }
        this.registry.clear();
    }
}
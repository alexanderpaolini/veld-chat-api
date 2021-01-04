"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheObject extends Object {
    constructor(object = {}) {
        super();
        Object.assign(this, object);
    }
    get(key) {
        return this[key];
    }
    set(key, value) {
        this[key] = value;
        return this;
    }
    delete(key) {
        delete this[key];
        return this;
    }
    clear() {
        this.keys().forEach(key => {
            delete this[key];
        });
        return this;
    }
    toString() {
        return JSON.stringify(this);
    }
    values() {
        return Object.values(this);
    }
    keys() {
        return Object.keys(this);
    }
}
exports.default = CacheObject;

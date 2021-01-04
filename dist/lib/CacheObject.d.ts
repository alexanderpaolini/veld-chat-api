export default class CacheObject extends Object {
    constructor(object?: {});
    get(key: string): any;
    set(key: string, value: any): this;
    delete(key: string): this;
    toString(): string;
    values(): any[];
    keys(): string[];
}

export interface Attributes {
    [key: string]: Attribute;
}
export interface StringMap {
    [key: string]: string;
}
export interface Metadata {
    id?: string;
    isObjectId?: boolean;
    map?: StringMap;
}

export interface Attribute {
    key?: boolean;
    id?: string;
    required?: boolean;
    lenght?: number;
    type?: 'datetime' | 'ObjectId';
}

export function build(attributes?: Attributes): Metadata {
    const sub: Metadata = { id: '_id' };
    if (!attributes) {
        return sub;
    }
    const keys: string[] = Object.keys(attributes);
    for (const key of keys) {
        const attr: Attribute = attributes[key];
        if (attr.key === true) {
            const meta: Metadata = { id: key };
            meta.isObjectId = attr.type === 'ObjectId' ? true : false;
            return meta;
        }
    }
    return sub;
}

// export function buildMap(attributes: Attributes): StringMap | undefined {
//     if (!attributes) {
//         return;
//     }
//     const map: any = {};
//     const keys: string[] = Object.keys(attributes);
// }

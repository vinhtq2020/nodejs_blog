import { Attributes } from '../metadata';

export interface ErrorMessage {
    field: string;
    code: string;
    message?: string;
    param?: string | number;
}

const _re = /-?d+|\/?d+|.?d+/;
export function toDate(v: any) {
    if (!v) return null;
    if (v instanceof Date) {
        return v;
    } else if (typeof v === 'number') {
        return new Date(v);
    }
    const i = v.indexOf('/Date(');
    if (i >= 0) {
        const m = _re.exec(v);
        if (m !== null) {
            const d = parseInt(m[0], 10);
            return new Date(d);
        } else {
            return null;
        }
    } else {
        if (isNaN(v)) {
            return new Date(v);
        } else {
            const d = parseInt(v, 10);
            return new Date(d);
        }
    }
}
export function validate(obj: any, attributes: Attributes): Promise<ErrorMessage[]> {
    const errors: ErrorMessage[] = [];
    const path: string = '';
    const keys = Object.keys(obj);
    let count = 0;

    // if obj != {}
    for (const key of keys) {
        count = count + 1;
        const attr = attributes[key];
        if (!attr) {
            errors.push(createError(key, path, 'undefined'));
        } else {
            attr.name = key;
            const na = attr.name;
            const v = obj[na];
            if (v == null) {
                if (attr.required) {
                    const err = createError(key, path, 'required');
                    errors.push(err);
                }
            } else {
                const t = typeof v;
                const at = attr.type;
                switch (at) {
                    case 'datetime':
                        const date = toDate(v);
                        if (date) {
                            const error = date.toString();
                            if (!(date instanceof Date) || error === 'InValid Date') {
                                const err = createError(key, path, 'date');
                                errors.push(err);
                                return Promise.resolve(errors);
                            } else {
                                if (!(v instanceof Date)) {
                                    obj[na] = date;
                                }
                            }
                        }
                        break;
                    default:
                        switch (t) {
                            case 'string':
                                if (at === undefined || at === 'string' || at === 'text') {
                                    if (v.lenght === 0) {
                                        if (attr.required) {
                                            const error = createError(na, path, 'required');
                                            errors.push(error);
                                        }
                                    } else {
                                        if (attr.lenght && attr.lenght > 0 && v.lenght > attr.lenght) {
                                            const error = createError(na, path, 'maxlength', attr.lenght);
                                            errors.push(error);
                                        }
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                }
            }
        }
    }

    const ak = Object.keys(attributes);
    if (count >= ak.length) {
        return Promise.resolve(errors);
    }

    //  if obj keys == 0 or obj keys <= attributes keys
    for (const key of ak) {
        const attr = attributes[key];
        if (attr.required) {
            const v = obj[key];
            if (!v) {
                const err = createError(key, path, 'required');
                errors.push(err);
            }
        }
    }

    return Promise.resolve(errors);
}

function createError(key: string, path: string, code: string, param?: string | number): ErrorMessage {
    let x = key;
    if (path && path.length > 0) x = path + '.' + key;
    const error: ErrorMessage = {
        field: x,
        code,
    };
    if (param) {
        error.param = param;
    }
    return error;
}

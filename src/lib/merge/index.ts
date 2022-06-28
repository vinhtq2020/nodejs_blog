import ProcessEnv = NodeJS.ProcessEnv;
const r1 = /^[0-9]\d*$/;
export function merge<T>(config: T, env: ProcessEnv, parentPath?: string) {
    const conf: any = config;
    const keys = Object.keys(config);
    for (const key of keys) {
        let envKey = key.toUpperCase();
        if (parentPath) {
            envKey = parentPath + '_' + envKey;
        }
        const envValue = env[envKey];
        switch (typeof conf[key]) {
            case 'string':
                if (envValue && envValue.length > 0) {
                    conf[key] = envValue;
                }
                break;
            case 'object':
                if (Array.isArray(conf[key])) {
                    if (envValue) {
                        const newArray = JSON.parse(envValue);
                        if (typeof newArray === 'object' && Array.isArray(newArray)) {
                            conf[key] = newArray;
                        }
                    }
                } else if (conf[key] !== null) {
                    merge(conf[key], env, envKey);
                }
                break;
            case 'number':
                if (envValue && envValue.length > 0 && r1.test(envValue)) {
                    conf[key] = envValue;
                }
                break;
            case 'boolean':
                if (envValue) {
                    const nv = env[envKey] === 'true';
                    conf[key] = nv;
                }
                break;
            default:
                break;
        }
    }
    return conf;
}

/**
 * 装饰器类型
 */
export type DecorateTargetType = 'class' | 'method' | 'property' | 'accessor' | 'parameter'

/**
 * 判断传入值是否为类
 * @param obj
 */
function isClass(obj: any): obj is new (...args: any[]) => any {
    if (typeof obj != 'function') return false

    // async function or arrow function
    if (obj.prototype === undefined) return false

    // generator function and malformed inheritance
    if (obj.prototype.constructor !== obj) return false

    // has own prototype properties
    if (Object.getOwnPropertyNames(obj.prototype).length >= 2) return true

    const str = String(obj)

    // ES6 class
    if (str.slice(0, 5) == 'class') return true

    // anonymous function
    if (/^function\s*\(|^function anonymous\(/.test(str)) return false

    const hasThis =
        /(call|apply|_classCallCheck)\(this(, arguments)?\)|\bthis(.\S+|\[.+?\])\s*(=|\()|=\s*this[,;]/.test(str)

    // Upper-cased first char of the name and has `this` in the body, or it's
    // a native class in ES5 style.
    if (
        /^function\s+[A-Z]/.test(str) &&
        (hasThis ||
            (/\[native code\]/.test(str) &&
                obj.name !== 'BigInt' && // ES6 BigInt and Symbol is not class
                obj.name !== 'Symbol'))
    ) {
        return true
    }

    // TypeScript anonymous class to ES5 with default export
    if (hasThis && obj.name === 'default_1') return true

    return false
}

export function isObject(obj: any): obj is Object {
    return typeof obj === 'object' && !!obj
}

/**
 * 判断输入值是否是一个类或者类原型
 * @param obj
 */
function isClassOrPrototype(obj: any): obj is Object {
    if (isClass(obj)) return true
    if (!isObject(obj)) return false
    return isClass(obj.constructor)
}

/**
 * 判断输入值是否为有效的属性键名
 * @param obj
 */
function isPropertyKey(obj: any): obj is string | symbol {
    return typeof obj === 'string' || typeof obj === 'symbol'
}

/**
 * 判断输入的参数是否符合某个类型的装饰器
 * @param args 参数列表
 * @param type 装饰器类型
 */
export function isDecorateType(args: any[], type: DecorateTargetType): boolean {
    if (!Array.isArray(args) || args.length === 0 || (args.length !== 3 && args.length !== 1)) return false
    if (type === 'class') {
        return args.length === 1 && isClass(args[0])
    } else {
        const [target, key, descriptor] = args
        if (!isClassOrPrototype(target) || !isPropertyKey(key)) return false
        if (type === 'property') {
            return descriptor === null || typeof descriptor === 'undefined'
        }
        if (type === 'parameter') {
            return (
                typeof descriptor === 'number' &&
                !isNaN(descriptor) &&
                descriptor >= 0 &&
                Number.isSafeInteger(descriptor)
            )
        }
        if (!isObject(descriptor)) return false
        const desc = Object.getOwnPropertyDescriptor(args[0], args[1])
        if (!desc) return false
        if (type === 'accessor') {
            return !Object.keys(desc).includes('value')
        }
        if (type === 'method') {
            return typeof desc.value === 'function'
        }
    }
    return false
}

/**
 * 根据输入参数判断对应的装饰器类型
 * @param args 参数列表
 */
export function getParameterType(args: any[]): DecorateTargetType | undefined {
    if (!Array.isArray(args) || args.length === 0 || (args.length !== 3 && args.length !== 1)) return
    const [target, key, descriptor] = args
    if (args.length === 1) {
        return isClass(target) ? 'class' : undefined
    }

    if (!isClassOrPrototype(target) || !isPropertyKey(key)) return
    if (typeof descriptor === 'undefined' || descriptor === null) return 'property'
    if (typeof descriptor === 'number') {
        return !isNaN(descriptor) && descriptor >= 0 && Number.isSafeInteger(descriptor) ? 'parameter' : undefined
    }
    if (!isObject(descriptor)) return
    const desc = Object.getOwnPropertyDescriptor(target, key)
    if (!desc) return
    return !Object.keys(desc).includes('value') ? 'accessor' : typeof desc.value === 'function' ? 'method' : undefined
}

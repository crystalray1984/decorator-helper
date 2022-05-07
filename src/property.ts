import { isDecorateType } from './common'

/**
 * 必需参数的类成员装饰器
 * @template TArgs 构造参数类型
 */
export interface PropertyDecoratorFactory<TArgs extends any[]> {
    /**
     * @param args 构造参数列表
     */
    (...args: TArgs): PropertyDecorator
}

/**
 * 可选参数的类成员装饰器
 */
export interface PropertyDecoratorOrFactory<TArgs extends any[]>
    extends PropertyDecorator,
        PropertyDecoratorFactory<TArgs> {}

/**
 * 类成员装饰器方法体
 */
type PropertyDecoratorMethod<TArgs extends any[] = []> = (
    target: Object,
    propertyKey: string | symbol,
    ...args: TArgs
) => void

/**
 * 定义无参数类方法装饰器
 * @param decorator 装饰器方法体
 */
export function definePropertyDecorator(decorator: PropertyDecoratorMethod): PropertyDecorator
/**
 * 定义必需参数的类成员装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function definePropertyDecorator<TArgs extends any[]>(
    decorator: PropertyDecoratorMethod<TArgs>,
    isArgumentsRequired: true
): PropertyDecoratorFactory<TArgs>
/**
 * 定义可选参数的类成员装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function definePropertyDecorator<TArgs extends any[]>(
    decorator: PropertyDecoratorMethod<TArgs>,
    isArgumentsRequired?: boolean
): TArgs extends [] ? PropertyDecorator : PropertyDecoratorOrFactory<TArgs>
export function definePropertyDecorator(decorator: Function, isArgumentsRequired?: boolean): Function {
    if (typeof decorator !== 'function') {
        throw new TypeError('invalid decorator function')
    }
    return function (...args: any[]) {
        if (isArgumentsRequired || !isDecorateType(args, 'property')) {
            return function (...params: any[]) {
                if (!isDecorateType(params, 'property')) return
                decorator(params[0], params[1], ...args)
            }
        } else {
            decorator(args[0], args[1])
        }
    }
}

import { isDecorateType } from './common'

/**
 * 类方法描述结构
 */
export interface MethodDescriptor {
    enumerable?: boolean
    configurable?: boolean
    writable?: boolean
    value?: Function
}

/**
 * 必需参数的类方法装饰器
 * @template TArgs 构造参数类型
 */
export interface MethodDecoratorFactory<TArgs extends any[]> {
    /**
     * @param args 构造参数列表
     */
    (...args: TArgs): MethodDecorator
}

/**
 * 可选参数的类方法装饰器
 */
export interface MethodDecoratorOrFactory<TArgs extends any[]> extends MethodDecorator, MethodDecoratorFactory<TArgs> {}

/**
 * 类方法装饰器方法体
 */
type MethodDecoratorMethod<TArgs extends any[] = []> = (
    target: Object,
    propertyKey: string | symbol,
    descriptor: MethodDescriptor,
    ...args: TArgs
) => void | MethodDescriptor

/**
 * 定义无参数类方法装饰器
 * @param decorator 装饰器方法体
 */
export function defineMethodDecorator(decorator: MethodDecoratorMethod): MethodDecorator
/**
 * 定义必需参数的类方法装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineMethodDecorator<TArgs extends any[]>(
    decorator: MethodDecoratorMethod<TArgs>,
    isArgumentsRequired: true
): MethodDecoratorFactory<TArgs>
/**
 * 定义可选参数的类方法装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineMethodDecorator<TArgs extends any[]>(
    decorator: MethodDecoratorMethod<TArgs>,
    isArgumentsRequired?: boolean
): TArgs extends [] ? MethodDecorator : MethodDecoratorOrFactory<TArgs>
export function defineMethodDecorator(decorator: Function, isArgumentsRequired?: boolean): Function {
    if (typeof decorator !== 'function') {
        throw new TypeError('invalid decorator function')
    }
    return function (...args: any[]) {
        if (isArgumentsRequired || !isDecorateType(args, 'method')) {
            return function (...params: any[]) {
                if (!isDecorateType(params, 'method')) return
                return decorator(...params, ...args)
            }
        } else {
            return decorator(...args)
        }
    }
}

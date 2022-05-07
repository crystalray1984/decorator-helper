import { isDecorateType } from './common'

/**
 * 类访问器描述结构
 */
export interface AccessorDescriptor {
    enumerable?: boolean
    configurable?: boolean
    get?: () => any
    set?: (value: any) => void
}

/**
 * 必需参数的类访问器装饰器
 * @template TArgs 构造参数类型
 */
export interface AccessorDecoratorFactory<TArgs extends any[]> {
    /**
     * @param args 构造参数列表
     */
    (...args: TArgs): MethodDecorator
}

/**
 * 可选参数的类访问器装饰器
 */
export interface AccessorDecoratorOrFactory<TArgs extends any[]>
    extends MethodDecorator,
        AccessorDecoratorFactory<TArgs> {}

/**
 * 类访问器装饰器方法体
 */
type AccessorDecoratorMethod<TArgs extends any[] = []> = (
    target: Object,
    propertyKey: string | symbol,
    descriptor: AccessorDescriptor,
    ...args: TArgs
) => void | AccessorDescriptor

/**
 * 定义无参数类访问器装饰器
 * @param decorator 装饰器方法体
 */
export function defineAccessorDecorator(decorator: AccessorDecoratorMethod): MethodDecorator
/**
 * 定义必需参数的类访问器装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineAccessorDecorator<TArgs extends any[]>(
    decorator: AccessorDecoratorMethod<TArgs>,
    isArgumentsRequired: true
): AccessorDecoratorFactory<TArgs>
/**
 * 定义可选参数的类访问器装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineAccessorDecorator<TArgs extends any[]>(
    decorator: AccessorDecoratorMethod<TArgs>,
    isArgumentsRequired?: boolean
): TArgs extends [] ? MethodDecorator : AccessorDecoratorOrFactory<TArgs>
export function defineAccessorDecorator(decorator: Function, isArgumentsRequired?: boolean): Function {
    if (typeof decorator !== 'function') {
        throw new TypeError('invalid decorator function')
    }
    return function (...args: any[]) {
        if (isArgumentsRequired || !isDecorateType(args, 'accessor')) {
            return function (...params: any[]) {
                if (!isDecorateType(params, 'accessor')) return
                return decorator(...params, ...args)
            }
        } else {
            return decorator(...args)
        }
    }
}

import { isDecorateType } from './common'

/**
 * 必需参数的类装饰器
 * @template TArgs 构造参数类型
 */
export interface ClassDecoratorFactory<TArgs extends any[]> {
    /**
     * @param args 构造参数列表
     */
    (...args: TArgs): ClassDecorator
}

/**
 * 可选参数的类装饰器
 */
export interface ClassDecoratorOrFactory<TArgs extends any[]> extends ClassDecorator, ClassDecoratorFactory<TArgs> {}

/**
 * 类装饰器方法体
 */
type ClassDecoratorMethod<TArgs extends any[] = []> = (target: Function, ...args: TArgs) => void | Function

/**
 * 定义无参数类装饰器
 * @param decorator 装饰器方法体
 */
export function defineClassDecorator(decorator: ClassDecoratorMethod): ClassDecorator
/**
 * 定义必需参数的类装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineClassDecorator<TArgs extends any[]>(
    decorator: ClassDecoratorMethod<TArgs>,
    isArgumentsRequired: true
): ClassDecoratorFactory<TArgs>
/**
 * 定义可选参数的类装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineClassDecorator<TArgs extends any[]>(
    decorator: ClassDecoratorMethod<TArgs>,
    isArgumentsRequired?: boolean
): TArgs extends [] ? ClassDecorator : ClassDecoratorOrFactory<TArgs>
export function defineClassDecorator(decorator: Function, isArgumentsRequired?: boolean): Function {
    if (typeof decorator !== 'function') {
        throw new TypeError('invalid decorator function')
    }
    return function (...args: any[]) {
        if (isArgumentsRequired || !isDecorateType(args, 'class')) {
            return function (...params: any[]) {
                if (!isDecorateType(params, 'class')) return
                return decorator(...params, ...args)
            }
        } else {
            return decorator(...args)
        }
    }
}

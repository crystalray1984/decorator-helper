import { isDecorateType } from './common'

/**
 * 必需参数的参数装饰器
 * @template TArgs 构造参数类型
 */
export interface ParameterDecoratorFactory<TArgs extends any[]> {
    /**
     * @param args 构造参数列表
     */
    (...args: TArgs): ParameterDecorator
}

/**
 * 可选参数的参数装饰器
 */
export interface ParameterDecoratorOrFactory<TArgs extends any[]>
    extends ParameterDecorator,
        ParameterDecoratorFactory<TArgs> {}

/**
 * 参数装饰器方法体
 */
type ParameterDecoratorMethod<TArgs extends any[] = []> = (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
    ...args: TArgs
) => void

/**
 * 定义无参数的参数装饰器
 * @param decorator 装饰器方法体
 */
export function defineParameterDecorator(decorator: ParameterDecoratorMethod): ParameterDecorator
/**
 * 定义必需参数的参数装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineParameterDecorator<TArgs extends any[]>(
    decorator: ParameterDecoratorMethod<TArgs>,
    isArgumentsRequired: true
): ParameterDecoratorFactory<TArgs>
/**
 * 定义可选参数的参数装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineParameterDecorator<TArgs extends any[]>(
    decorator: ParameterDecoratorMethod<TArgs>,
    isArgumentsRequired?: boolean
): TArgs extends [] ? ParameterDecorator : ParameterDecoratorOrFactory<TArgs>
export function defineParameterDecorator(decorator: Function, isArgumentsRequired?: boolean): Function {
    if (typeof decorator !== 'function') {
        throw new TypeError('invalid decorator function')
    }
    return function (...args: any[]) {
        if (isArgumentsRequired || !isDecorateType(args, 'parameter')) {
            return function (...params: any[]) {
                if (!isDecorateType(params, 'parameter')) return
                decorator(...params, ...args)
            }
        } else {
            decorator(...args)
        }
    }
}

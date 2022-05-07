import { AccessorDescriptor } from './accessor'
import { DecorateTargetType, getParameterType, isObject } from './common'
import { MethodDescriptor } from './method'

/**
 * 无参数的通用装饰器
 */
export interface CompatibleDecorator extends ClassDecorator, MethodDecorator, PropertyDecorator, ParameterDecorator {}

/**
 * 必需参数的通用装饰器
 */
export interface CompatibleDecoratorFactory<TArgs extends any[]> {
    (...args: TArgs): CompatibleDecorator
}

/**
 * 可选参数的通用装饰器
 */
export interface CompatibleDecoratorOrFactory<TArgs extends any[]>
    extends CompatibleDecorator,
        CompatibleDecoratorFactory<TArgs> {}

/**
 * 通用装饰器正在装饰的目标
 */
interface DecoratingTargetBase<T extends DecorateTargetType> {
    /**
     * 目标类型
     */
    type: T
}

/**
 * 通用装饰器正在装饰的类信息
 */
interface ClassTarget extends DecoratingTargetBase<'class'> {
    /**
     * 正在装饰的类
     */
    target: Function
}

/**
 * 通用装饰器正在装饰的类成员信息
 */
interface MemberTarget {
    /**
     * 正在装饰的类或者类原型
     */
    target: Object
    /**
     * 属性名
     */
    propertyKey: string | symbol
}

/**
 * 通用装饰器正在装饰的类方法信息
 */
interface MethodTarget extends DecoratingTargetBase<'method'>, MemberTarget {
    /**
     * 方法描述结构
     */
    descriptor: MethodDescriptor
}

/**
 * 通用装饰器正在装饰的类成员信息
 */
interface PropertyTarget extends DecoratingTargetBase<'property'>, MemberTarget {}

/**
 * 通用装饰器正在装饰的类访问器信息
 */
interface AccessorTarget extends DecoratingTargetBase<'accessor'>, MemberTarget {
    /**
     * 访问器描述结构
     */
    descriptor: AccessorDescriptor
}

/**
 * 通用装饰器正在装饰的参数信息
 */
interface ParameterTarget extends DecoratingTargetBase<'parameter'>, MemberTarget {
    /**
     * 参数序号
     */
    parameterIndex: number
}

/**
 * 通用装饰器正在装饰的目标信息
 */
export type DecoratingTarget = ClassTarget | MethodTarget | PropertyTarget | AccessorTarget | ParameterTarget

/**
 * 通用装饰器方法体
 */
type CompatibleDecoratorMethod<TArgs extends any[] = []> = (
    target: DecoratingTarget,
    ...args: TArgs
) => Function | MethodDescriptor | AccessorDescriptor | void

/**
 * 定义无参数通用装饰器
 * @param decorator 装饰器方法体
 */
export function defineCompatibleDecorator(decorator: CompatibleDecoratorMethod): CompatibleDecorator
/**
 * 定义必需参数的通用装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineCompatibleDecorator<TArgs extends any[]>(
    decorator: CompatibleDecoratorMethod<TArgs>,
    isArgumentsRequired: true
): CompatibleDecoratorFactory<TArgs>
/**
 * 定义可选参数的通用装饰器
 * @template TArgs 构造参数类型
 * @param decorator 装饰器方法体
 * @param isArgumentsRequired 参数是否为必需
 */
export function defineCompatibleDecorator<TArgs extends any[]>(
    decorator: CompatibleDecoratorMethod<TArgs>,
    isArgumentsRequired?: boolean
): TArgs extends [] ? CompatibleDecorator : CompatibleDecoratorOrFactory<TArgs>
export function defineCompatibleDecorator(decorator: Function, isArgumentsRequired?: boolean): Function {
    if (typeof decorator !== 'function') {
        throw new TypeError('invalid decorator function')
    }

    const invokeClassDecorator = (decorateArgs: any[], factoryArgs: any[]) => {
        const result = decorator(
            {
                type: 'class',
                target: decorateArgs[0],
            },
            ...factoryArgs
        )
        if (typeof result === 'function') return result
    }

    const invokeMethodDecorator = (decorateArgs: any[], factoryArgs: any[]) => {
        const result = decorator(
            {
                type: 'method',
                target: decorateArgs[0],
                propertyKey: decorateArgs[1],
                descriptor: decorateArgs[2],
            },
            ...factoryArgs
        )
        if (typeof result === 'function') return { value: result }
        if (isObject(result) && typeof result.value === 'function') {
            const to = {} as any
            Object.keys(result)
                .filter(key => ['enumerable', 'configurable', 'writable', 'value'].includes(key))
                .forEach(key => {
                    to[key] = result[key]
                })
            return to
        }
    }

    const invokePropertyDecorator = (decorateArgs: any[], factoryArgs: any[]) => {
        decorator(
            {
                type: 'property',
                target: decorateArgs[0],
                propertyKey: decorateArgs[1],
            },
            ...factoryArgs
        )
    }

    const invokeAccessorDecorator = (decorateArgs: any[], factoryArgs: any[]) => {
        const result = decorator(
            {
                type: 'accessor',
                target: decorateArgs[0],
                propertyKey: decorateArgs[1],
                descriptor: decorateArgs[2],
            },
            ...factoryArgs
        )
        if (isObject(result)) {
            const to = {} as any
            Object.keys(result)
                .filter(key => ['enumerable', 'configurable', 'get', 'set'].includes(key))
                .forEach(key => {
                    to[key] = result[key]
                })
            return to
        }
    }

    const invokeParameterDecorator = (decorateArgs: any[], factoryArgs: any[]) => {
        decorator(
            {
                type: 'parameter',
                target: decorateArgs[0],
                propertyKey: decorateArgs[1],
                parameterIndex: decorateArgs[2],
            },
            ...factoryArgs
        )
    }

    return function (...args: any[]) {
        const factory = (...params: any[]) => {
            switch (getParameterType(params)) {
                case 'class':
                    return invokeClassDecorator(params, args)
                case 'method':
                    return invokeMethodDecorator(params, args)
                case 'property':
                    return invokePropertyDecorator(params, args)
                case 'accessor':
                    return invokeAccessorDecorator(params, args)
                case 'parameter':
                    return invokeParameterDecorator(params, args)
            }
        }

        if (isArgumentsRequired) {
            return factory
        } else {
            switch (getParameterType(args)) {
                case 'class':
                    return invokeClassDecorator(args, [])
                case 'method':
                    return invokeMethodDecorator(args, [])
                case 'property':
                    return invokePropertyDecorator(args, [])
                case 'accessor':
                    return invokeAccessorDecorator(args, [])
                case 'parameter':
                    return invokeParameterDecorator(args, [])
            }
            return factory
        }
    }
}

export { DecorateTargetType, getParameterType, isDecorateType } from './common'
export { ClassDecoratorFactory, ClassDecoratorOrFactory, defineClassDecorator } from './class'
export { MethodDecoratorFactory, MethodDecoratorOrFactory, MethodDescriptor, defineMethodDecorator } from './method'
export {
    AccessorDecoratorFactory,
    AccessorDecoratorOrFactory,
    AccessorDescriptor,
    defineAccessorDecorator,
} from './accessor'
export { ParameterDecoratorFactory, ParameterDecoratorOrFactory, defineParameterDecorator } from './parameter'
export { PropertyDecoratorFactory, PropertyDecoratorOrFactory, definePropertyDecorator } from './property'
export {
    CompatibleDecorator,
    CompatibleDecoratorFactory,
    CompatibleDecoratorOrFactory,
    DecoratingTarget,
    defineCompatibleDecorator,
} from './compatible'

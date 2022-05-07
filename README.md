# decorator-helpers

Provides useful functions for creating ES6 decorators

-   [Installation](#installation)
-   [API](#api)
    -   [defineClassDecorator](#defineclassdecorator)
    -   [defineMethodDecorator](#definemethoddecorator)
    -   [definePropertyDecorator](#definepropertydecorator)
    -   [defineAccessorDecorator](#defineaccessordecorator)
    -   [defineParameterDecorator](#defineparameterdecorator)
    -   [defineCompatibleDecorator (for all targets)](#definecompatibledecorator)

## Installation

via npm

```
npm i --save decorator-helpers
```

via yarn

```
yarn add decorator-helpers
```

## API

### defineClassDecorator

create a decorator for class

##### definition

```typescript
declare function defineClassDecorator<TArgs extends any[] = []>(
    decorator: (target: Function, ...args: TArgs) => void | Function,
    isFactory?: boolean
): ClassDecorator
```

##### No parameter decorator

```javascript
import { defineClassDecorator } from 'decorator-helpers'

const MyDecorator = defineClassDecorator(target => {})

//target=TestClass
@MyDecorator
class TestClass {}
```

##### Decorator factory

```javascript
const MyDecorator = defineClassDecorator((target, text) => {}, true)

//target=TestClass  text='hello'
@MyDecorator('hello')
class TestClass {}
```

##### Optional parameters decorator

```javascript
const MyDecorator = defineClassDecorator((target, text) => {})

//target=TestClass1  text='hello'
@MyDecorator('hello')
class TestClass1 {}

//target=TestClass1  text=undefined
@MyDecorator
class TestClass2 {}
```

### defineMethodDecorator

create a decorator for class method

##### definition

```typescript
declare function defineMethodDecorator<TArgs extends any[] = []>(
    decorator: (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<Function>,
        ...args: TArgs
    ) => void | TypedPropertyDescriptor<Function>,
    isFactory?: boolean
): MethodDecorator
```

##### No parameter decorator

```javascript
import { defineMethodDecorator } from 'decorator-helpers'

const MyDecorator = defineMethodDecorator((target, key, descriptor) => {})

class TestClass {
    //target=TestClass.prototype  key='method1'  descriptor={ value: TestClass.prototype.method1 }
    @MyDecorator
    method1() {
        return 'hello'
    }

    //target=TestClass  key='method2'  descriptor={ value: TestClass.method2 }
    @MyDecorator
    static method2() {
        return 'world'
    }
}
```

##### Decorator factory

```javascript
import { defineMethodDecorator } from 'decorator-helpers'

const MyDecorator = defineMethodDecorator((target, key, descriptor, text) => {}, true)

class TestClass {
    //target=TestClass.prototype  key='method1'  descriptor={ value: TestClass.prototype.method1 } text='name'
    @MyDecorator('name')
    method1() {
        return 'hello'
    }
}
```

##### Optional parameters decorator

```javascript
import { defineMethodDecorator } from 'decorator-helpers'

const MyDecorator = defineMethodDecorator((target, key, descriptor, text) => {})

class TestClass {
    //target=TestClass.prototype  key='method1'  descriptor={ value: TestClass.prototype.method1 } text='name'
    @MyDecorator('name')
    method1() {
        return 'hello'
    }

    //target=TestClass.prototype  key='method1'  descriptor={ value: TestClass.prototype.method1 } text=undefined
    @MyDecorator
    method2() {
        return 'hello'
    }
}
```

### definePropertyDecorator

create a decorator for class property

##### definition

```typescript
declare function definePropertyDecorator<TArgs extends any[] = []>(
    decorator: (
        target: Object,
        propertyKey: string | symbol
        ...args: TArgs
    ) => void,
    isFactory?: boolean
): PropertyDecorator
```

##### No parameter decorator

```javascript
import { definePropertyDecorator } from 'decorator-helpers'

const MyDecorator = definePropertyDecorator((target, key) => {})

class TestClass {
    //target=TestClass.prototype  key='id'
    @MyDecorator
    id = ''

    //target=TestClass  key='fullname'
    @MyDecorator
    static fullname = 'hello'
}
```

##### Decorator factory

```javascript
const MyDecorator = definePropertyDecorator((target, key, text) => {}, true)

class TestClass {
    //target=TestClass.prototype  key='id'  text='hello'
    @MyDecorator('hello')
    id = ''
}
```

##### Optional parameters decorator

```javascript
const MyDecorator = definePropertyDecorator((target, key, text) => {})

class TestClass {
    //target=TestClass.prototype  key='id'  text='hello'
    @MyDecorator('hello')
    id1 = ''

    //target=TestClass.prototype  key='id2'  text=undefined
    @MyDecorator
    id2 = ''
}
```

### defineAccessorDecorator

create a decorator for accessor

##### definition

```typescript
declare function defineAccessorDecorator<TArgs extends any[] = []>(
    decorator: (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
        ...args: TArgs
    ) => void | PropertyDescriptor,
    isFactory?: boolean
): AccessorDecorator
```

##### No parameter decorator

```javascript
import { defineAccessorDecorator } from 'decorator-helpers'

const MyDecorator = defineAccessorDecorator((target, key, descriptor) => {})

class TestClass {
    //target=TestClass.prototype  key='id'  descriptor={ get:Function; set:Function }
    @MyDecorator
    get id() {
        return ''
    }
    set id(value) {}

    //target=TestClass  key='fullname'  descriptor={ get:Function }
    @MyDecorator
    static get fullname() {
        return ''
    }
}
```

##### Decorator factory

```javascript
const MyDecorator = defineAccessorDecorator((target, key, descriptor, text) => {}, true)

class TestClass {
    //target=TestClass.prototype  key='id'  descriptor={ get:Function } text='hello'
    @MyDecorator('hello')
    get id() {
        return ''
    }
}
```

##### Optional parameters decorator

```javascript
const MyDecorator = defineAccessorDecorator((target, key, descriptor, text) => {})

class TestClass {
    //target=TestClass.prototype  key='id'  descriptor={ get:Function } text='hello'
    @MyDecorator('hello')
    get id() {
        return ''
    }

    //target=TestClass.prototype  key='id'  descriptor={ get:Function } text=undefined
    @MyDecorator
    get fullname() {
        return ''
    }
}
```

### defineParameterDecorator

create a decorator for method parameter

##### definition

```typescript
declare function defineParameterDecorator<TArgs extends any[] = []>(
    decorator: (target: Object, propertyKey: string | symbol, parameterIndex: number, ...args: TArgs) => void,
    isFactory?: boolean
): ParameterDecorator
```

##### No parameter decorator

```javascript
import { defineParameterDecorator } from 'decorator-helpers'

const MyDecorator = defineParameterDecorator((target, key, index) => {})

class TestClass {
    //target=TestClass key='method1' index=0
    method1(@MyDecorator arg1) {}

    //target=TestClass  key='method2'  index=1
    @MyDecorator
    static method2(arg1, @MyDecorator arg2) {}
}
```

##### Decorator factory

```javascript
const MyDecorator = defineParameterDecorator((target, key, index, text) => {}, true)

class TestClass {
    //target=TestClass key='method1' index=0  text='hello'
    method1(@MyDecorator('hello') arg1) {}
}
```

##### Optional parameters decorator

```javascript
const MyDecorator = defineParameterDecorator((target, key, index, text) => {})

class TestClass {
    //target=TestClass key='method1' index=0  text='hello'
    method1(@MyDecorator('hello') arg1) {}

    //target=TestClass  key='method2'  index=1  text=undefined
    @MyDecorator
    static method2(arg1, @MyDecorator arg2) {}
}
```

### defineCompatibleDecorator

create a decorator for all targets. (class, method, property, accessor, parameter)

##### definition

```typescript
declare interface DecoratingTarget {
    type: 'class' | 'method' | 'property' | 'accessor' | 'parameter'
    target: Object //class or class prototype
    propertyKey: string | symble //will be undefined if type=class
    descriptor: PropertyDescriptor //will be undefined if type=class or property or parameter
    parameterIndex: number //type=parameter only
}

declare function defineParameterDecorator<TArgs extends any[] = []>(
    decorator: (target: DecoratingTarget, ...args: TArgs) => Function | PropertyDescriptor | void,
    isFactory?: boolean
): CompatibleDecorator
```

##### No parameter decorator

```javascript
import { defineCompatibleDecorator } from 'decorator-helpers'

const MyDecorator = defineCompatibleDecorator(target => {})

//target={ type:'class', target:TestClass }
@MyDecorator
class TestClass {
    //target={ type:'method', target:TestClass.prototype, propertyKey:'method1', descriptor:{ value: Function } }
    @MyDecorator
    //target={ type: 'parameter', target:TestClass.prototype, propertyKey:'method1', descriptor:{ value: Function } }
    method1(@MyDecorator arg1) {}

    //target={ type:'property', target:TestClass.prototype, propertyKey:'id' }
    @MyDecorator
    id = 1

    //target={ type:'accessor', target:TestClass.prototype, propertyKey:'fullname', descriptor: { get: Function } }
    @MyDecorator
    get fullname() {
        return ''
    }
}
```

##### Decorator factory

```javascript
const MyDecorator = defineCompatibleDecorator((target, text) => {}, true)

//target={ type:'class', target:TestClass }
@MyDecorator('this is class')
class TestClass {
    //target={ type:'method', target:TestClass.prototype, propertyKey:'method1', descriptor:{ value: Function } }
    @MyDecorator('this is method')
    //target={ type: 'parameter', target:TestClass.prototype, propertyKey:'method1', descriptor:{ value: Function } }
    method1(@MyDecorator('this is parameter') arg1) {}

    //target={ type:'property', target:TestClass.prototype, propertyKey:'id' }
    @MyDecorator('this is property')
    id = 1

    //target={ type:'accessor', target:TestClass.prototype, propertyKey:'fullname', descriptor: { get: Function } }
    @MyDecorator('this is accessor')
    get fullname() {
        return ''
    }
}
```

##### Optional parameters decorator

```javascript
const MyDecorator = defineCompatibleDecorator((target, text) => {})

//target={ type:'class', target:TestClass }
@MyDecorator
class TestClass {
    //target={ type:'method', target:TestClass.prototype, propertyKey:'method1', descriptor:{ value: Function } }
    @MyDecorator('this is method')
    //target={ type: 'parameter', target:TestClass.prototype, propertyKey:'method1', descriptor:{ value: Function } }
    method1(@MyDecorator arg1) {}

    //target={ type:'property', target:TestClass.prototype, propertyKey:'id' }
    @MyDecorator('this is property')
    id = 1

    //target={ type:'accessor', target:TestClass.prototype, propertyKey:'fullname', descriptor: { get: Function } }
    @MyDecorator
    get fullname() {
        return ''
    }
}
```

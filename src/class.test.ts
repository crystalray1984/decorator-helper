//import 'reflect-metadata'
import { defineClassDecorator } from './class'

test('无参数类装饰器', () => {
    const records: string[] = []

    const Dec = defineClassDecorator(target => {
        records.push(target.name)
    })

    @Dec
    @Dec
    class TestClass {}

    expect(records.length).toBe(2)
    expect(records.every(name => name === TestClass.name)).toBe(true)
})

test('强制参数类装饰器', () => {
    const records: string[] = []

    const Dec = defineClassDecorator<[number]>((target, id) => {
        records.push(`${target.name}:${id}`)
    }, true)

    @Dec(1)
    @Dec(2)
    class TestClass {}

    expect(records.length).toBe(2)
    expect(records[0]).toBe(`${TestClass.name}:2`)
    expect(records[1]).toBe(`${TestClass.name}:1`)
})

test('可选参数类装饰器', () => {
    const records: string[] = []

    const Dec = defineClassDecorator<[number]>((target, id) => {
        records.push(`${target.name}:${id}`)
    })

    @Dec(1)
    @Dec(2)
    @Dec
    class TestClass {}

    expect(records.length).toBe(3)
    expect(records[0]).toBe(`${TestClass.name}:undefined`)
    expect(records[1]).toBe(`${TestClass.name}:2`)
    expect(records[2]).toBe(`${TestClass.name}:1`)
})

test('修改被装饰类构造方法', () => {
    const Dec = defineClassDecorator(target => {
        const func = function (this: any) {
            const instance = Reflect.construct(target, [], func)
            instance.id = 1
            return instance
        }
        func.prototype = target.prototype
        func.prototype.constructor = func

        Reflect.defineProperty(func, 'name', {
            value: target.name,
        })

        return func
    })

    class SuperClass {}

    @Dec
    class TestClass extends SuperClass {
        id: string

        constructor() {
            super()
            this.id = 'old'
        }
    }

    const obj = new TestClass()
    //expect(obj.id).toBe('new')
    expect(obj instanceof TestClass).toBe(true)
    expect(obj instanceof SuperClass).toBe(true)
    expect(TestClass.name).toBe('TestClass')
})

test('错误访问器', () => {
    expect(() => {
        defineClassDecorator(undefined as any)
    }).toThrowError()

    const Dec = defineClassDecorator(() => {
        return function () {}
    }, true)

    const first = Dec()
    expect(typeof first).toBe('function')
    const second = (first as Function)()
    expect(typeof second).toBe('undefined')
})

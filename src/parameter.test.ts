import { defineParameterDecorator } from './parameter'

test('无参数参数装饰器', () => {
    interface Result {
        className: string
        name: string
        index: number
        isStatic: boolean
    }

    const records: Result[] = []

    const Dec = defineParameterDecorator((target, key, index) => {
        let isStatic: boolean, className: string
        if (typeof target === 'function') {
            isStatic = true
            className = target.name
        } else {
            isStatic = false
            className = target.constructor.name
        }
        records.push({
            className,
            name: String(key),
            index,
            isStatic,
        })
    })

    class TestClass {
        method1(@Dec @Dec arg1: any) {}

        static method2(arg1: any, @Dec @Dec arg2: any) {}
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        index: 0,
        isStatic: false,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        index: 0,
        isStatic: false,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        index: 1,
        isStatic: true,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        index: 1,
        isStatic: true,
    })
})

test('强制参数参数装饰器', () => {
    interface Result {
        className: string
        name: string
        index: number
        isStatic: boolean
        params: number
    }

    const records: Result[] = []

    const Dec = defineParameterDecorator<[number]>((target, key, index, params) => {
        let isStatic: boolean, className: string
        if (typeof target === 'function') {
            isStatic = true
            className = target.name
        } else {
            isStatic = false
            className = target.constructor.name
        }
        records.push({
            className,
            name: String(key),
            index,
            isStatic,
            params,
        })
    }, true)

    class TestClass {
        method1(@Dec(1) @Dec(0) arg1: any) {}

        static method2(arg1: any, @Dec(3) @Dec(2) arg2: any) {}
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        index: 0,
        isStatic: false,
        params: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        index: 0,
        isStatic: false,
        params: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        index: 1,
        isStatic: true,
        params: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        index: 1,
        isStatic: true,
        params: 3,
    })
})

test('可选参数参数装饰器', () => {
    interface Result {
        className: string
        name: string
        index: number
        isStatic: boolean
        params: number
    }

    const records: Result[] = []

    const Dec = defineParameterDecorator<[number]>((target, key, index, params) => {
        let isStatic: boolean, className: string
        if (typeof target === 'function') {
            isStatic = true
            className = target.name
        } else {
            isStatic = false
            className = target.constructor.name
        }
        records.push({
            className,
            name: String(key),
            index,
            isStatic,
            params,
        })
    })

    class TestClass {
        method1(@Dec(1) @Dec(0) arg1: any) {}

        static method2(arg1: any, @Dec @Dec(2) arg2: any) {}
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        index: 0,
        isStatic: false,
        params: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        index: 0,
        isStatic: false,
        params: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        index: 1,
        isStatic: true,
        params: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        index: 1,
        isStatic: true,
        params: undefined,
    })
})

test('错误访问器', () => {
    expect(() => {
        defineParameterDecorator(undefined as any)
    }).toThrowError()

    const fn = jest.fn()
    const Dec = defineParameterDecorator(() => {
        fn()
    }, true)

    const first = Dec()
    expect(typeof first).toBe('function')
    const second = (first as Function)()
    expect(typeof second).toBe('undefined')
    expect(fn).not.toBeCalled()
})

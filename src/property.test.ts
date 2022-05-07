import { definePropertyDecorator } from './property'

test('无参数属性装饰器', () => {
    interface Result {
        className: string
        name: string
        isStatic: boolean
    }
    const records: Result[] = []

    const Dec = definePropertyDecorator((target, key) => {
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
            isStatic,
        })
    })

    class TestClass {
        @Dec
        @Dec
        id = 0

        @Dec
        @Dec
        static instanceId = 1
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'id',
        isStatic: false,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'id',
        isStatic: false,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'instanceId',
        isStatic: true,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'instanceId',
        isStatic: true,
    })
})

test('强制参数属性装饰器', () => {
    interface Result {
        className: string
        name: string
        isStatic: boolean
        params: number
    }
    const records: Result[] = []

    const Dec = definePropertyDecorator<[number]>((target, key, params) => {
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
            isStatic,
            params,
        })
    }, true)

    class TestClass {
        @Dec(1)
        @Dec(0)
        id = 0

        @Dec(3)
        @Dec(2)
        static instanceId = 1
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'id',
        isStatic: false,
        params: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'id',
        isStatic: false,
        params: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'instanceId',
        isStatic: true,
        params: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'instanceId',
        isStatic: true,
        params: 3,
    })
})

test('可选参数属性装饰器', () => {
    interface Result {
        className: string
        name: string
        isStatic: boolean
        params?: number
    }
    const records: Result[] = []

    const Dec = definePropertyDecorator<[number]>((target, key, params) => {
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
            isStatic,
            params,
        })
    })

    class TestClass {
        @Dec(1)
        @Dec(0)
        id = 0

        @Dec
        @Dec(2)
        static instanceId = 1
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'id',
        isStatic: false,
        params: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'id',
        isStatic: false,
        params: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'instanceId',
        isStatic: true,
        params: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'instanceId',
        isStatic: true,
        params: undefined,
    })
})

test('错误访问器', () => {
    expect(() => {
        definePropertyDecorator(undefined as any)
    }).toThrowError()

    const fn = jest.fn()
    const Dec = definePropertyDecorator(() => {
        fn()
    }, true)

    const first = Dec()
    expect(typeof first).toBe('function')
    const second = (first as Function)()
    expect(typeof second).toBe('undefined')
    expect(fn).not.toBeCalled()
})

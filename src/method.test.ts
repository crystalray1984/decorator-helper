import { defineMethodDecorator } from './method'

test('无参数方法装饰器', () => {
    interface Record {
        className: string
        name: string
        func: Function
        isStatic: boolean
    }

    const records: Record[] = []
    const Dec = defineMethodDecorator((target, key, desc) => {
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
            func: desc.value as unknown as Function,
            isStatic,
        })
    })

    class TestClass {
        @Dec
        @Dec
        method1() {}

        @Dec
        @Dec
        static method2() {}
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        func: TestClass.prototype.method1,
        isStatic: false,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        func: TestClass.prototype.method1,
        isStatic: false,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        func: TestClass.method2,
        isStatic: true,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        func: TestClass.method2,
        isStatic: true,
    })
})

test('强制参数方法装饰器', () => {
    interface Record {
        className: string
        name: string
        func: Function
        isStatic: boolean
        id: number
    }

    const records: Record[] = []

    const Dec = defineMethodDecorator<[number]>((target, key, desc, id) => {
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
            func: desc.value as unknown as Function,
            isStatic,
            id,
        })
    }, true)

    class TestClass {
        @Dec(1)
        @Dec(0)
        method1() {}

        @Dec(3)
        @Dec(2)
        static method2() {}
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        func: TestClass.prototype.method1,
        isStatic: false,
        id: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        func: TestClass.prototype.method1,
        isStatic: false,
        id: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        func: TestClass.method2,
        isStatic: true,
        id: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        func: TestClass.method2,
        isStatic: true,
        id: 3,
    })
})

test('可选参数方法装饰器', () => {
    interface Record {
        className: string
        name: string
        func: Function
        isStatic: boolean
        id?: number
    }

    const records: Record[] = []

    const Dec = defineMethodDecorator<[number]>((target, key, desc, id) => {
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
            func: desc.value as unknown as Function,
            isStatic,
            id,
        })
    })

    class TestClass {
        @Dec(1)
        @Dec(0)
        method1() {}

        @Dec
        @Dec(2)
        static method2() {}
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        func: TestClass.prototype.method1,
        isStatic: false,
        id: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'method1',
        func: TestClass.prototype.method1,
        isStatic: false,
        id: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        func: TestClass.method2,
        isStatic: true,
        id: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'method2',
        func: TestClass.method2,
        isStatic: true,
        id: undefined,
    })
})

test('修改方法', () => {
    const Dec = defineMethodDecorator<[number]>((target, key, desc, timesValue) => {
        const func = desc.value as Function
        if (typeof timesValue === 'number') {
            return {
                value: function (...args: any[]) {
                    const orgValue = func.call(this, ...args)
                    return orgValue * timesValue
                },
            }
        }
    })

    class TestClass {
        @Dec(2)
        add1(v1: number, v2: number) {
            return v1 + v2
        }

        @Dec(3)
        add2(v1: number, v2: number) {
            return v1 + v2
        }

        @Dec
        add3(v1: number, v2: number) {
            return v1 + v2
        }
    }

    const obj = new TestClass()
    expect(obj.add1(1, 2)).toBe(6)
    expect(obj.add2(1, 2)).toBe(9)
    expect(obj.add3(1, 2)).toBe(3)
})

test('错误访问器', () => {
    expect(() => {
        defineMethodDecorator(undefined as any)
    }).toThrowError()

    const Dec = defineMethodDecorator(() => {
        return {}
    }, true)

    const first = Dec()
    expect(typeof first).toBe('function')
    const second = (first as Function)()
    expect(typeof second).toBe('undefined')
})

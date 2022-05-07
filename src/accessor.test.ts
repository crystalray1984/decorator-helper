import { defineAccessorDecorator, AccessorDescriptor } from './accessor'

test('无参数访问器装饰器', () => {
    interface Result {
        className: string
        name: string
        isStatic: boolean
        hasSetter: boolean
    }

    const records: Result[] = []

    const Dec = defineAccessorDecorator((target, key, desc) => {
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
            hasSetter: typeof desc.set === 'function',
            isStatic,
        })
    })

    class TestClass {
        @Dec
        @Dec
        get accessor1() {
            return 0
        }
        set accessor1(_: number) {}

        @Dec
        @Dec
        static get accessor2() {
            return 1
        }
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'accessor1',
        hasSetter: true,
        isStatic: false,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'accessor1',
        hasSetter: true,
        isStatic: false,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'accessor2',
        hasSetter: false,
        isStatic: true,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'accessor2',
        hasSetter: false,
        isStatic: true,
    })
})

test('强制参数访问器装饰器', () => {
    interface Result {
        className: string
        name: string
        isStatic: boolean
        hasSetter: boolean
        params: number
    }

    const records: Result[] = []

    const Dec = defineAccessorDecorator<[number]>((target, key, desc, params) => {
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
            hasSetter: typeof desc.set === 'function',
            isStatic,
            params,
        })
    }, true)

    class TestClass {
        @Dec(1)
        @Dec(0)
        get accessor1() {
            return 0
        }
        set accessor1(_: number) {}

        @Dec(3)
        @Dec(2)
        static get accessor2() {
            return 1
        }
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'accessor1',
        hasSetter: true,
        isStatic: false,
        params: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'accessor1',
        hasSetter: true,
        isStatic: false,
        params: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'accessor2',
        hasSetter: false,
        isStatic: true,
        params: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'accessor2',
        hasSetter: false,
        isStatic: true,
        params: 3,
    })
})

test('可选参数访问器装饰器', () => {
    interface Result {
        className: string
        name: string
        isStatic: boolean
        hasSetter: boolean
        params?: number
    }

    const records: Result[] = []

    const Dec = defineAccessorDecorator<[number]>((target, key, desc, params) => {
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
            hasSetter: typeof desc.set === 'function',
            isStatic,
            params,
        })
    })

    class TestClass {
        @Dec(1)
        @Dec(0)
        get accessor1() {
            return 0
        }
        set accessor1(_: number) {}

        @Dec
        @Dec(2)
        static get accessor2() {
            return 1
        }
    }

    expect(records.length).toBe(4)
    expect(records[0]).toMatchObject({
        className: 'TestClass',
        name: 'accessor1',
        hasSetter: true,
        isStatic: false,
        params: 0,
    })
    expect(records[1]).toMatchObject({
        className: 'TestClass',
        name: 'accessor1',
        hasSetter: true,
        isStatic: false,
        params: 1,
    })
    expect(records[2]).toMatchObject({
        className: 'TestClass',
        name: 'accessor2',
        hasSetter: false,
        isStatic: true,
        params: 2,
    })
    expect(records[3]).toMatchObject({
        className: 'TestClass',
        name: 'accessor2',
        hasSetter: false,
        isStatic: true,
        params: undefined,
    })
})

test('修改访问器动作', () => {
    const Dec = defineAccessorDecorator<[number]>((target, key, desc, params) => {
        if (typeof params !== 'number') {
            return
        }
        const { get, set } = desc
        const newDescriptor: AccessorDescriptor = {
            get: function () {
                return get!.call(this) * params
            },
        }
        if (typeof set === 'function') {
            newDescriptor.set = function (value: number) {
                set.call(this, value * params)
            }
        }
        return newDescriptor
    })

    class TestClass {
        private _num1 = 1

        @Dec(2)
        get num1() {
            return this._num1
        }

        private _num2 = 0

        @Dec(2)
        get num2() {
            return this._num2
        }

        set num2(v: number) {
            this._num2 = v
        }
    }

    const obj = new TestClass()
    obj.num2 = 1

    expect(obj.num1).toBe(2)
    expect(obj.num2).toBe(4)
})

test('错误访问器', () => {
    expect(() => {
        defineAccessorDecorator(undefined as any)
    }).toThrowError()

    const Dec = defineAccessorDecorator(() => {
        return {}
    }, true)

    const first = Dec()
    expect(typeof first).toBe('function')
    const second = (first as Function)()
    expect(typeof second).toBe('undefined')
})

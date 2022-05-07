import { DecorateTargetType } from './common'
import { DecoratingTarget, defineCompatibleDecorator } from './compatible'

test('无参数兼容装饰器', () => {
    const records: DecoratingTarget[] = []

    const Dec = defineCompatibleDecorator(data => {
        records.push(data)
    })

    @Dec
    @Dec
    class TestClass {
        @Dec
        @Dec
        method1(@Dec @Dec arg: any) {}

        @Dec
        @Dec
        property1 = ''

        @Dec
        @Dec
        get accessor() {
            return null
        }
    }

    expect(records.length).toBe(10)

    expect(records.filter(t => t.type === 'class' && t.target === TestClass).length).toBe(2)

    expect(
        records.filter(t => t.type === 'method' && t.target === TestClass.prototype && t.propertyKey === 'method1')
            .length
    ).toBe(2)

    expect(
        records.filter(
            t =>
                t.type === 'parameter' &&
                t.target === TestClass.prototype &&
                t.propertyKey === 'method1' &&
                t.parameterIndex === 0
        ).length
    ).toBe(2)

    expect(
        records.filter(t => t.type === 'property' && t.target === TestClass.prototype && t.propertyKey === 'property1')
            .length
    ).toBe(2)

    expect(
        records.filter(t => t.type === 'accessor' && t.target === TestClass.prototype && t.propertyKey === 'accessor')
            .length
    ).toBe(2)
})

test('强制参数兼容装饰器', () => {
    type DecoratorDataWithData = DecoratingTarget & { text: string }

    const records: DecoratorDataWithData[] = []

    const Dec = defineCompatibleDecorator<[string]>((data, text) => {
        records.push({
            ...data,
            text,
        })
    }, true)

    @Dec('class2')
    @Dec('class1')
    class TestClass {
        @Dec('method2')
        @Dec('method1')
        method1(@Dec('arg2') @Dec('arg1') arg: any) {}

        @Dec('property2')
        @Dec('property1')
        property1 = ''

        @Dec('accessor2')
        @Dec('accessor1')
        get accessor() {
            return null
        }
    }

    expect(records.length).toBe(10)

    expect(
        records
            .filter(t => t.type === 'class' && t.target === TestClass)
            .map(t => t.text)
            .join()
    ).toBe('class1,class2')

    expect(
        records
            .filter(t => t.type === 'method' && t.target === TestClass.prototype && t.propertyKey === 'method1')
            .map(t => t.text)
            .join()
    ).toBe('method1,method2')

    expect(
        records
            .filter(
                t =>
                    t.type === 'parameter' &&
                    t.target === TestClass.prototype &&
                    t.propertyKey === 'method1' &&
                    t.parameterIndex === 0
            )
            .map(t => t.text)
            .join()
    ).toBe('arg1,arg2')

    expect(
        records
            .filter(t => t.type === 'property' && t.target === TestClass.prototype && t.propertyKey === 'property1')
            .map(t => t.text)
            .join()
    ).toBe('property1,property2')

    expect(
        records
            .filter(t => t.type === 'accessor' && t.target === TestClass.prototype && t.propertyKey === 'accessor')
            .map(t => t.text)
            .join()
    ).toBe('accessor1,accessor2')
})

test('重构目标', () => {
    const fakeClass = jest.fn(function () {})
    const fakeMethod1 = jest.fn(() => undefined)
    const fakeMethod2 = jest.fn(() => undefined)
    const fakeAccessor = jest.fn(() => 2)

    const Dec = defineCompatibleDecorator(target => {
        if (target.type === 'class') {
            fakeClass.prototype = target.target.prototype
            fakeClass.prototype.constructor = fakeClass
            return fakeClass
        } else if (target.type === 'method') {
            if (target.propertyKey === 'method1') {
                return fakeMethod1
            } else if (target.propertyKey === 'method2') {
                return {
                    value: fakeMethod2,
                }
            }
        } else if (target.type === 'accessor') {
            return {
                get: fakeAccessor,
            }
        }
    })

    @Dec
    class TestClass {
        @Dec
        method1() {}

        @Dec
        method2() {}

        @Dec
        get id() {
            return 1
        }
    }

    // @ts-ignore
    expect(TestClass === fakeClass).toBeTruthy()

    const obj = new TestClass()
    expect(fakeClass).toBeCalled()
    obj.method1()
    expect(fakeMethod1).toBeCalled()
    obj.method2()
    expect(fakeMethod2).toBeCalled()
    const v = obj.id
    expect(fakeAccessor).toBeCalled()
    expect(v).toBe(2)
})

test('错误访问器', () => {
    expect(() => {
        defineCompatibleDecorator(undefined as any)
    }).toThrowError()

    const Dec = defineCompatibleDecorator<[any]>(() => {})

    const first = Dec(1)
    expect(typeof first).toBe('function')
    first(function () {})
})

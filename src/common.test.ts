import { DecorateTargetType, getParameterType, isDecorateType } from './common'

test('判断装饰参数是否符合目标对应关系', () => {
    const logs: { name: string; type: DecorateTargetType; match: boolean; count: number }[] = []

    //装饰器
    const Dec = (name: string, type: DecorateTargetType) => {
        return function (...args: any[]): any {
            const match = isDecorateType(args, type) && getParameterType(args) === type
            logs.push({ name, type, match, count: args.length })
            if (match) {
                switch (type) {
                    case 'accessor':
                    case 'method':
                        return {
                            enumerable: false,
                        }
                }
            }
        }
    }

    @Dec('class2', 'class')
    @Dec('class1', 'class')
    class A {
        @Dec('accessor1-2', 'accessor')
        @Dec('accessor1-1', 'accessor')
        get accessor1() {
            return 0
        }

        @Dec('accessor2-2', 'accessor')
        @Dec('accessor2-1', 'accessor')
        static get accessor2() {
            return 0
        }

        @Dec('property1-2', 'property')
        @Dec('property1-1', 'property')
        property1 = ''

        @Dec('property2-2', 'property')
        @Dec('property2-1', 'property')
        static property2 = ''

        @Dec('method1-2', 'method')
        @Dec('method1-1', 'method')
        method1(@Dec('parameter2', 'parameter') @Dec('parameter1', 'parameter') arg: any) {}

        @Dec('method2-2', 'method')
        @Dec('method2-1', 'method')
        static method2() {}
    }

    expect(logs.length).toBe(16)
    expect(logs.filter(t => !t.match)).toMatchObject([])
})

test('错误的类型判断', () => {
    class TestClass {
        static method1() {}
    }

    const type = '' as unknown as DecorateTargetType
    expect(isDecorateType([TestClass, 'method1', Object.getOwnPropertyDescriptor(TestClass, 'method1')], type)).toBe(
        false
    )
})

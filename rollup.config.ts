import { defineConfig } from 'rollup'
import ts from 'rollup-plugin-ts'

export default defineConfig([
    {
        input: './src/index.ts',
        output: {
            file: './dist/index.js',
        },
        plugins: [
            ts({
                tsconfig: {
                    declaration: true,
                    removeComments: false,
                },
            }),
        ],
    },
    {
        input: './src/index.ts',
        output: [
            {
                file: './dist/index.js',
                format: 'commonjs',
            },
            {
                file: './dist/index-esm.js',
                format: 'esm',
            },
        ],
        plugins: [
            ts({
                tsconfig: {
                    declaration: false,
                    removeComments: true,
                },
            }),
        ],
    },
])

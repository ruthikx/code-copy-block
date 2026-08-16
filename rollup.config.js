import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
const packageJson = require("./package.json");
export default [
    {
        input: "src/index.ts",
        output:[
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json", noEmit: true }),
            terser(),
        ],
        external: [
            "react",
            "react-dom",
            "react-syntax-highlighter",
            "react-syntax-highlighter/dist/esm/styles/prism",
        ],
    },
];

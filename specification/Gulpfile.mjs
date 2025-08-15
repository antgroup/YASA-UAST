import gulp from "gulp";
import path from "path";
import {fileURLToPath} from "url";
import plumber from "gulp-plumber";
import through from "through2";
import chalk from "chalk";
import fancyLog from "fancy-log";
import formatCode from "./scripts/utils/formatCode.js";
import glob from "glob";

import { transformSync } from "@babel/core";
import { mkdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

const monorepoRoot = path.dirname(fileURLToPath(import.meta.url));

gulp.task("build", () => buildBabel(true, /* exclude */ []));

gulp.task('generate-type-helpers', ()=>{
    fancyLog("Generating uast types and associated functions");

    return Promise.all([
        generateTypeHelpers("asserts"),
        generateTypeHelpers("builders"),
        generateTypeHelpers("builders", "uppercase.js"),
        generateTypeHelpers("constants"),
        generateTypeHelpers("validators"),
        generateTypeHelpers("ast-types"),
        // TODO
        // generateTraverseHelpers("asserts"),
        // generateTraverseHelpers("validators"),
        // generateTraverseHelpers("virtual-types"),
    ]);
});

gulp.task(
    "generate",
    gulp.series("build", "generate-type-helpers")
);

/**
 *
 * @typedef {("asserts" | "builders" | "constants" | "validators")} TypesHelperKind
 * @param {TypesHelperKind} helperKind
 * @param {string} filename
 */
async function generateTypeHelpers(helperKind, filename = "index.ts") {
    return generateHelpers(
        `./scripts/generators/${helperKind}.js`,
        `./src/${helperKind}/generated/`,
        filename,
        `@babel/types -> ${helperKind}`
    );
}

/**
 * @param {string} generator
 * @param {string} pkg
 * @param {string} filename
 * @param {string} message
 */
function generateHelpers(generator, dest, filename, message) {
    const stream = gulp
        .src(".", { base: monorepoRoot })
        .pipe(errorsLogger())
        .pipe(
            through.obj(async (file, enc, callback) => {
                const { default: generateCode } = await import(generator);

                file.path = filename;
                file.contents = Buffer.from(
                    formatCode(await generateCode(filename), dest + file.path)
                );
                fancyLog(`${chalk.green("✔")} Generated ${message}`);
                callback(null, file);
            })
        )
        .pipe(gulp.dest(dest, { mode: 0o644 }));

    return finish(stream);
}

function finish(stream) {
    return new Promise((resolve, reject) => {
        stream.on("end", resolve);
        stream.on("finish", resolve);
        stream.on("error", reject);
    });
}

function errorsLogger() {
    return plumber({
        errorHandler(err) {
            fancyLog(err.stack);
        },
    });
}

function createWorker(useWorker) {
    return transform;
}
/**
 * map source code path to the generated artifacts path
 * @example
 * mapSrcToDist("packages/babel-core/src/index.js")
 * // returns "packages/babel-core/lib/index.js"
 * @example
 * mapSrcToDist("packages/babel-template/src/index.ts")
 * // returns "packages/babel-template/lib/index.js"
 * @example
 * mapSrcToDist("packages/babel-template/src/index.d.ts")
 * // returns "packages/babel-template/lib/index.d.ts"
 * @param {string} srcPath
 * @returns {string}
 */
function mapSrcToDist(srcPath) {
    const parts = srcPath.replace(/(?<!\.d)\.ts$/, ".js").split("/");
    parts[0] = "dist";
    return parts.join("/");
}

async function buildBabel(useWorker, ignore = []) {
    const worker = createWorker(useWorker);
    const files = await new Promise((resolve, reject) => {
        glob(
            './src/**/*.ts',
            {
                ignore: ignore.map(p => `./${p.src}/**`),
            },
            (err, files) => {
                if (err) reject(err);
                resolve(files);
            }
        );
    });

    const promises = [];
    for (const file of files) {
        // @example ./packages/babel-parser/src/index.js
        const dest = "./" + mapSrcToDist(file.slice(2));
        promises.push(transform(file, dest));
    }
    return Promise.all(promises).finally(() => {
        if (worker.end !== undefined) {
            worker.end();
        }
    });
}

function needCompile(src, dest) {
    let destStat;
    try {
        destStat = statSync(dest);
    } catch (err) {
        if (err.code === "ENOENT") {
            return true;
        } else {
            throw err;
        }
    }
    const srcStat = statSync(src);
    return srcStat.mtimeMs > destStat.mtimeMs;
}

function transform(src, dest) {
    mkdirSync(dirname(dest), { recursive: true });
    if (!needCompile(src, dest)) {
        return;
    }
    fancyLog(`Compiling '${chalk.cyan(src)}'...`);
    const content = readFileSync(src, { encoding: "utf8" });
    let code = content;
    if (!dest.endsWith('.d.ts')){
        code  = transformSync(content, {
            filename: src,
            plugins: ["@babel/plugin-transform-typescript", "@babel/plugin-transform-modules-commonjs"],

            caller: {
                // We have wrapped packages/babel-core/src/config/files/configuration.js with feature detection
                supportsDynamicImport: true,
                name: "babel-worker",
            },
        }).code;
    }
    writeFileSync(dest, code, "utf8");
};

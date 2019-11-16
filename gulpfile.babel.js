import { src, dest, parallel } from "gulp";
import plumber from "gulp-plumber";
import babel from "gulp-babel";
import typescript from "gulp-typescript";
import npmCheck from "gulp-npm-check";

const js = () =>
    src("src/index.ts")
        .pipe(plumber())
        .pipe(typescript())
        .pipe(babel())
        .pipe(dest("lib"));

const checkDependencies = done => npmCheck(done);

const build = parallel(checkDependencies, js);

export { build };

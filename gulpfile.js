"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const del = require("del");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const server = require("browser-sync").create();
const jsmin = require("gulp-jsmin");
const twig = require('gulp-twig');
const imageminJpegtran = require('imagemin-jpegtran');
const rollup = require('gulp-rollup');

const htmlPage = ["src/*.html", "src/**/*.html", "!src/html-const/**/*.html", "!src/html-const/*.html"];

const jsFileCopy = ["src/js/lib/**/*.js"];

let pathPublic = 'public/';
let pathPublicHTML = 'public/';

function catchErr(e) {
    console.log(e);
    this.emit('end');
}

gulp.task("css", function() {
    return gulp
        .src("src/styles/template_styles.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(
            sass({
                includePaths: require("node-normalize-scss").includePaths,
                errLogToConsole: true
            })
        )
        .on('error', catchErr)
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(pathPublic))
        .pipe(csso())
        .pipe(rename("template_styles.min.css"))
        .pipe(gulp.dest(pathPublic))
        .pipe(server.stream());
});

gulp.task("html", function() {
    return gulp
        .src(htmlPage)
        .pipe(posthtml([include()]))
        .pipe(gulp.dest(pathPublicHTML));
});

gulp.task("jscopy", async function() {
    return gulp
        .src(jsFileCopy)
        .pipe(gulp.dest(`${pathPublic}js/lib/`));
});

gulp.task('jsmin', function () {
    return  gulp.src('src/js/**/*.js')
        .pipe(rollup({
            format: "umd",
            moduleName: "Main",
            entry: "./src/js/main.js"
        }))
        .pipe(rename('main.es2015.js'))
        .pipe(gulp.dest(`${pathPublic}js/`))
        .pipe(rename('main.js'))
        .pipe(gulp.dest(`${pathPublic}js/`))
        .pipe(jsmin())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(`${pathPublic}js/`))
        .pipe(server.stream());
});

gulp.task("images", function() {
    return gulp
        .src(["src/img/**/*.{png,jpg,webp,svg,ico}"])
        .pipe(
            imagemin([
                imagemin.optipng({ optimizationLevel: 3 }),
                imageminJpegtran({ progressive: true }),
                imagemin.svgo()
            ])
        )
        .pipe(gulp.dest(`${pathPublic}img/`));
});

gulp.task("imagesFast", function() {
    return gulp
        .src(["src/img/**/*.{png,jpg,webp,svg,ico}"])
        .pipe(gulp.dest(`${pathPublic}img/`));
});

gulp.task("copy", function() {
    return gulp
        .src(["src/**/*.{ttf,woff,woff2}", "src/**/*.json"])
        .pipe(gulp.dest(pathPublic));
});


gulp.task("copyIco", function() {
    return gulp
        .src("src/**/*.ico")
        .pipe(gulp.dest(pathPublicHTML));
});


gulp.task("sprite", function() {
    return (
        gulp
            .src("src/img/svg-sprite/**/*.svg")
            .pipe(
                svgstore({
                    inLineSvg: true,
                    minify: false
                })
            )
            .pipe(rename("sprite.svg"))
            .pipe(gulp.dest(`${pathPublic}img/`))
    );
});

gulp.task('compile', function () {
    'use strict';
    var twig = require('gulp-twig');
    return gulp.src('src/*.twig')
        .pipe(twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe(gulp.dest(`${pathPublicHTML}`));
});

gulp.task("clean", function() {
    return del([
        `${pathPublic}/**`,
        `!${pathPublic}/.git`,
        `!${pathPublic}/.gitignore`
    ]);
});

gulp.task("server", function() {
    server.init({
        server: "public/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("src/styles/**/*.{scss,sass}", gulp.series("css", "refresh"));
    gulp.watch("src/**/*.html", gulp.series("html", "refresh"));
    gulp.watch("src/**/*.twig", gulp.series("compile", "refresh"));
    gulp.watch("src/js/**/*.js", gulp.series("jscopy", "jsmin", "refresh"));
    gulp.watch("src/img/**/*.{png,jpg,svg}", gulp.series("imagesFast", "refresh"));
    gulp.watch("src/img/**/*.svg", gulp.series("sprite", "html", "refresh"));
});

gulp.task("refresh", function(done) {
    server.reload();
    done();
});


gulp.task("prodPath", function (done) {
    pathPublic = 'compiled/';
    pathPublicHTML = 'compiled/';
    done();
});

gulp.task(
    "start",
    gulp.series(
        "clean",
        "imagesFast",
        "sprite",
        "css",
        "copy",
        "jscopy",
        "jsmin",
        "html",
        "compile",
        "copyIco",
        "server"
    )
);

gulp.task(
    "build",
    gulp.series("clean", "images", "sprite", "css", "copy", "jscopy", "jsmin", "html", "copyIco", "compile")
);

gulp.task(
    "build-fast",
    gulp.series("clean", "imagesFast", "sprite", "css", "copy", "jscopy", "jsmin", "html", "copyIco", "compile")
);

gulp.task(
    "build-prod",
    gulp.series("clean","prodPath","images", "sprite", "css", "copy", "jscopy", "jsmin", "copyIco", "compile")
);
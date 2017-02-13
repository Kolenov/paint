"use strict";

var gulp = require("gulp");
var browserify = require("browserify");
var watch = require("gulp-watch");
var source = require("vinyl-source-stream");
    // uglify = require("gulp-uglify"),
    // sass = require("gulp-sass"),
    // sourcemaps = require("gulp-sourcemaps"),
    // rigger = require("gulp-rigger"),
    // imagemin = require("gulp-imagemin"),
    // pngquant = require("imagemin-pngquant"),
    // rimraf = require("rimraf"),
var browserSync = require("browser-sync");
var reload = browserSync.reload;


// var babelify   = require('babelify'),
//     browserify = require('browserify'),
//     buffer     = require('vinyl-buffer'),
//     coffeeify  = require('coffeeify'),
//     gulp       = require('gulp'),
//     gutil      = require('gulp-util'),
//     livereload = require('gulp-livereload'),
//     merge      = require('merge'),
//     rename     = require('gulp-rename'),
//     source     = require('vinyl-source-stream'),
//     sourceMaps = require('gulp-sourcemaps'),
//     watchify   = require('watchify');


var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: "dist/",
        js: "dist/js/",
        css: "dist/css/",
        img: "dist/img/",
        fonts: "dist/fonts/"
    },
    src: { //Пути откуда брать исходники
        html: "src/*.html", //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: "src/js/index.js",//В стилях и скриптах нам понадобятся только main файлы
        //style: "src/style/style.scss",
        //img: "src/img/**/*.*", //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        //fonts: "src/fonts/**/*.*"
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: "*.html",
        js: "src/js/**/*.js",
        style: "src/style/**/*.scss",
        //img: "src/img/**/*.*",
        //fonts: "src/fonts/**/*.*"
    },
    clean: "./dist"
};

// var config = {
//     server: {
//         baseDir: "./"
//     },
//     tunnel: true,
//     host: "localhost",
//     port: 9000,
//     logPrefix: "Frontend_Dev"
// };

gulp.task("browserify", function() {
    return browserify(path.src.js)
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source("index.js"))
        // Start piping stream to tasks!
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({stream:true}));
});

gulp.task("browserSync", function() {
    browserSync({
        server: {
            baseDir: "./"
        },
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task("watcher",function(){
    //gulp.watch(path.src.css, ["mincss"]);
    gulp.watch(path.watch.js, ["browserify"]);
    //gulp.watch(path.src.html, ["html"]);
});

gulp.task("default", ["watcher", "browserSync"]);
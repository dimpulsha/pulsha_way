const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const csso = require("postcss-csso");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const del = require("del");
var rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const cheerio = require("gulp-cheerio");

//Clean
const clean = () => {
  return del("build");
}

exports.clean = clean;

//Copy
const copy = (done) => {
  gulp.src(["source/*.ico",
    "source/fonts/*.{woff,woff2}",
    "source/manifest.webmanifest",
    //"source/img/*.svg",
    //"source/img/background-img/*",
    //"!source/img/icon-sprite.src",
    //"!source/img/menu-sprite.src",
    //"!source/img/decor-sprite.src",
    "source/img/favicon/*"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

//HTML

const htmlMin = () => {
  return gulp.src("source/**/*.html")
    .pipe(htmlmin({ collapseInlineTagWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.htmlMin = htmlMin;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

//Script

const jsMin = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(rename(function (path) {
      path.extname = ".min.js";
    }))
    .pipe(gulp.dest('build/js'));
}

exports.jsMin = jsMin;

//optimizeImages

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;


//copyImages

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"))
}

exports.images = copyImages;

//createWebp
const createWebp = () => {
  return gulp.src("source/img/*.{png,jpg}")
    .pipe(webp({ quality: 85 }))
    .pipe(gulp.dest("build/img/webp"))
}

exports.createWebp = createWebp;

//createMenuSprite
const createMenuSprite = () => {
  return gulp.src("build/img/menu-sprite.src/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("menu-sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.createMenuSprite = createMenuSprite;

//createSprite
const createIconSprite = () => {
  return gulp.src("build/img/icon-sprite.src/*.svg")
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[opacity]').removeAttr('opacity');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("icon-sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.createIconSprite = createIconSprite;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("jsMin"));
  gulp.watch("source/*.html", gulp.series(htmlMin, reload));
}

//build  - test
const buildProject = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    htmlMin,
    styles,
    jsMin,
    createWebp,
    createMenuSprite,
    createIconSprite
  )
);

exports.buildProject = buildProject;

//RunServer -test

const runProject = gulp.series(
  buildProject, server, watcher
);

exports.runProject = runProject;

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    htmlMin,
    styles,
    jsMin,
    createWebp,
    createMenuSprite,
    createIconSprite
  )
);

exports.build = build;

exports.default = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    htmlMin,
    styles,
    jsMin,
    createWebp,
    createMenuSprite,
    createIconSprite
  ),
  gulp.series(
    server,
    watcher)
);

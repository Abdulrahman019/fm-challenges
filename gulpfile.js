//javascript that run on the command line using node used to compile, minify and watch the files (js and scss/css)
// importing all npm packages that installed as modules in this file to access them with any function they provide 
// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Use dart-sass for @use
//sass.compiler = require('dart-sass');


//complie sass and js
//Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true }) //take this file , set sourcemap to true used to debug and see where some style rule coming from
    .pipe(sass()) // complie it to css , gulp-sass modules
    .pipe(postcss([autoprefixer(), cssnano()]))//after css add prefix to any property need it and minify the css
    .pipe(dest('dist', { sourcemaps: '.' })); //set the destination of the final compiled CSS file into the folder called dist, sourcemaps: '.' to set the location of your source maps file which this dot means is going to be set in the same location that we just indicated in the dist folder.
    //pipe gulp function used to sort them one after the other
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] })) // @babel/preset-env make any modern JavaScript like ES6 compiled to an older version that older browsers can support 
    .pipe(terser()) // minify the js files
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
//local server and sync it to your files. And any time you make a change, it's going to automatically reload your local website. 
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.', //to run the base directory of a server from the root location where the Gulp file is, which is here.
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb(); //callback function at the very bottom to indicate that it's finished running. 
}
//reload the browser sync server that we spun up
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'],
    series(scssTask, jsTask, browserSyncReload)
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask);
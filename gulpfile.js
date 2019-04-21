const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync');
const gulpStylelint = require('gulp-stylelint');

const server = browserSync.create();

const homeDir = './app';

const paths = {
  styles: {
    src: `${homeDir}/scss/**/*.scss`,
    dest: `${homeDir}/css`
  },
  html: {
    src: `${homeDir}/*.html`
  }
};

function clean() {
  return del(paths.styles.dest);
}

function styleLint() {
  return gulp.src(paths.styles.src).pipe(
    gulpStylelint({
      reporters: [{ formatter: 'string', console: true }]
    })
  );
}

function sass() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(gulpSass())
    .on('error', gulpSass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

const style = gulp.series(styleLint, sass);

function reload() {
  server.reload();
}

function watch() {
  server.init({
    server: {
      baseDir: homeDir
    }
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.html.src, reload);
}

const build = gulp.series(clean, style);

exports.default = watch;
exports.build = build;

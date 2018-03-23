import glob from 'glob';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

// browserify & support plugs
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const $ = gulpLoadPlugins();
const $css = gulpLoadPlugins({
  pattern: ['postcss-*', 'autoprefixer', 'cssnano'],
  replaceString: /^postcss-/
});

const AUTOPREFIXER_BROWSERS = ['last 2 versions', 'ie >= 9', 'Android >= 30'];
const POSTCSS_PROCESSORS = [
  $css.cssnext({ browsers: AUTOPREFIXER_BROWSERS }) // ,
  // $css.autoprefixer(AUTOPREFIXER_BROWSERS),
  // $css.cssnano() // uncomment, if you want CSS minification
];

const PATH = {
  build: {
    html: 'build/',
    js: 'build/js/',
    styles: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  src: {
    html: 'src/pug/pages/*.pug',
    js: 'src/js/app.js',
    styles: 'src/sass/app.scss',
    img: 'src/img/**/*',
    fonts: 'src/fonts/**/*'
  },
  watch: {
    html: 'src/pug/**/*',
    js: 'src/js/**/*',
    styles: 'src/sass/**/*',
    img: 'src/img/**/*',
    fonts: 'src/fonts/**/*'
  },
  clean: 'build/*'
};

const BROWSERSYNC_CONFIG = {
  server: ['build'],
  notify: false,
  open: false,
  tunnel: false,
  host: 'markup',
  port: 9000,
  logPrefix: 'browserSync'
};

gulp.task('lint', () => {
  gulp.src(PATH.watch.js)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failOnError()));
});

gulp.task('clean:build', () => del(PATH.clean, { dot: true }));
gulp.task('clean:cache', cb => $.cache.clearAll(cb));

gulp.task('serve', () => browserSync(BROWSERSYNC_CONFIG));

gulp.task('todo', () => {
  gulp.src([PATH.watch.js, PATH.watch.html, PATH.watch.styles])
    .pipe($.plumber())
    .pipe($.todo({
      // absolute: true,
      customTags: ['NOTE'], // NOTE, TODO, FIXME are supported
      verbose: true
    }));
});

/*
gulp.task('build:vendor', () => {
  gulp.src(PATH.src.vendor)
    .pipe($.changed(PATH.build.vendor, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.size({title: 'vendor'}))
  .pipe(gulp.dest(PATH.build.vendor));
});
*/

gulp.task('build:html', () => {
  gulp.src(PATH.src.html)
    .pipe($.plumber())
    .pipe($.if('*.pug', $.pug({
      pretty: '    ',
      locals: {
        __pages: glob.sync(PATH.src.html, {
          nodir: true,
          nonull: false
        }).map(filename => path.parse(filename).name)
      }
    })))
    .pipe($.changed(PATH.build.html, { hasChanged: $.changed.compareSha1Digest }))
    .pipe($.if(!browserSync.active, $.size({ title: 'html', showFiles: true })))
    .pipe(gulp.dest(PATH.build.html))
    .pipe(browserSync.stream());
});

/* gulp.task('build:js:vendor', () => {
  const b = browserify({
    entries: PATH.src.js.vendor,
    debug: true
  });

  return b
    .transform(babelify, {presets: ["es2015"]})
    .bundle()
    .pipe($.plumber())
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest(PATH.build.js.vendor))
    .pipe(browserSync.stream());
}); */

gulp.task('build:js', ['lint'], () => {
  browserify(PATH.src.js)
    .transform(babelify, { presets: ['env'] })
    .bundle()
    .pipe($.plumber())
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(PATH.build.js))
    .pipe(browserSync.stream());
});

gulp.task('build:styles', () => {
  gulp.src(PATH.src.styles)
    .pipe($.plumber())
    .pipe($.if('*.{sass,scss}', $.sass({ outputStyle: 'expanded' }).on('error', $.sass.logError)))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.css', $.postcss(POSTCSS_PROCESSORS)))
    .pipe($.sourcemaps.write('./'))
    .pipe($.changed(PATH.build.styles, { hasChanged: $.changed.compareSha1Digest }))
    .pipe($.if(!browserSync.active, $.size({ title: 'styles' })))
    .pipe(gulp.dest(PATH.build.styles))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('build:img', () => {
  gulp.src(PATH.src.img)
    .pipe($.changed(PATH.build.img, { hasChanged: $.changed.compareSha1Digest }))
    // .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe($.cache($.imagemin()))
    .pipe($.size({ title: 'img', showFiles: true }))
    .pipe(gulp.dest(PATH.build.img));
});

/* gulp.task('build:pic', () => {
  gulp.src(PATH.src.pic)
    .pipe($.changed(PATH.build.pic, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.size({title: 'pic', showFiles: true}))
  .pipe(gulp.dest(PATH.build.pic));
}); */

gulp.task('build:fonts', () => {
  gulp.src(PATH.src.fonts)
    .pipe($.changed(PATH.build.fonts, { hasChanged: $.changed.compareSha1Digest }))
    .pipe($.size({ title: 'fonts', showFiles: true }))
    .pipe(gulp.dest(PATH.build.fonts));
});

// gulp.task('build:prepare', ['build:vendor']);
// gulp.task('build:styles', ['build:styles:vendor', 'build:styles:app']);
// gulp.task('build:js', [/*'build:js:vendor',*/ 'build:js:app']);

gulp.task('build', [
  /* 'build:prepare', */
  'build:html',
  'build:js',
  'build:styles',
  'build:fonts',
  'build:img'/* ,
  'build:pic'*/
]);

gulp.task('clean', [
  'clean:build',
  'clean:cache'
]);

gulp.task('watch', () => {
  gulp.watch(PATH.watch.html, ['build:html']);
  gulp.watch(PATH.watch.styles, ['build:styles']);
  /* gulp.watch(PATH.watch.js.vendor, ['build:js:vendor']); */
  gulp.watch(PATH.watch.js.app, ['build:js:app']);
  gulp.watch(PATH.watch.img, ['build:img']);
  /* gulp.watch(PATH.watch.pic, ['build:pic']); */
  gulp.watch(PATH.watch.fonts, ['build:fonts']);
});

gulp.task('default', ['build', 'serve', 'watch']);

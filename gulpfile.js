/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/
var gulp = require('gulp'),
  path = require('path'),
  browserSync = require('browser-sync').create(),
  argv = require('minimist')(process.argv.slice(2));

const tasks = {
  compile: [],
  watch: [],
  validate: [],
  clean: [],
  default: []
};

function resolvePath(pathInput) {
  return path.resolve(pathInput).replace(/\\/g,"/");
}

/******************************************************
 * COPY TASKS - stream assets from source to destination
******************************************************/
// JS copy
gulp.task('pl-copy:js', function(){
  return gulp.src('**/*.js', {cwd: resolvePath(paths().source.js)} )
    .pipe(gulp.dest(resolvePath(paths().public.js)));
});

// Images copy
gulp.task('pl-copy:img', function(){
  return gulp.src('**/*.*',{cwd: resolvePath(paths().source.images)} )
    .pipe(gulp.dest(resolvePath(paths().public.images)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function(){
  return gulp.src('favicon.ico', {cwd: resolvePath(paths().source.root)} )
    .pipe(gulp.dest(resolvePath(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function(){
  return gulp.src('*', {cwd: resolvePath(paths().source.fonts)})
    .pipe(gulp.dest(resolvePath(paths().public.fonts)));
});

// CSS Copy
gulp.task('pl-copy:css', function(){
  return gulp.src(resolvePath(paths().source.css) + '/*.css')
    .pipe(gulp.dest(resolvePath(paths().public.css)))
    .pipe(browserSync.stream());
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function(){
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/!(*.css)')
    .pipe(gulp.dest(resolvePath(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function(){
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/*.css')
    .pipe(gulp.dest(function(file){
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return resolvePath(path.join(paths().public.styleguide, '/css'));
    }))
    .pipe(browserSync.stream());
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
******************************************************/
//read all paths from our namespaced config file
var config = require('./patternlab-config.json'),
  patternlab = require('patternlab-node')(config);

function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  patternlab.build(done, getConfiguredCleanOption());
}

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    'pl-copy:js',
    'pl-copy:img',
    'pl-copy:favicon',
    'pl-copy:font',
    'pl-copy:css',
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('patternlab:version', function (done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function (done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task('patternlab:build', gulp.series('pl-assets', build, function(done){
  done();
}));

gulp.task('patternlab:installplugin', function (done) {
  patternlab.installplugin(argv.plugin);
  done();
});

/******************************************************
 * SCSS
 ******************************************************/
const configFrontEnd = require('./gulpconfig.js');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const sassLint = require('gulp-sass-lint');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flatten = require('gulp-flatten');
const gulpif = require('gulp-if');
const sassdoc = require('sassdoc');
const join = require('path').join;
const del = require('del');
const cached = require('gulp-cached');
const _ = require('lodash');
const fs = require('fs');

function cssCompile(done, errorShouldExit) {
  return gulp.src(configFrontEnd.css.src)
    .pipe(sassGlob())
    .pipe(plumber({
      errorHandler(error) {
        notify.onError({
          title: 'CSS <%= error.name %> - Line <%= error.line %>',
          message: '<%= error.message %>',
        })(error);
        if (errorShouldExit) process.exit(1);
        this.emit('end');
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: configFrontEnd.css.outputStyle,
      sourceComments: configFrontEnd.css.sourceComments,
      includePaths: configFrontEnd.css.includePaths,
    }).on('error', sass.logError))
    .pipe(postcss(
      [
        autoprefixer({
          browsers: configFrontEnd.css.autoPrefixerBrowsers,
        }),
      ]
    ))
    .pipe(sourcemaps.write((configFrontEnd.css.sourceMapEmbed) ? null : './'))
    .pipe(gulpif(configFrontEnd.css.flattenDestOutput, flatten()))
    .pipe(gulp.dest(configFrontEnd.css.dest))
    .on('end', () => {
      done();
    });
}

cssCompile.description = 'Compile Scss to CSS using Libsass with Autoprefixer and SourceMaps';

gulp.task('css', done => cssCompile(done, true));

gulp.task('clean:css', (done) => {
  del([
    join(configFrontEnd.css.dest, '*.{css,css.map}'),
  ], { force: true }).then(() => {
    done();
  });
});

function validateCss(errorShouldExit) {
  return gulp.src(configFrontEnd.css.src)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

function validateCssWithNoExit() {
  return validateCss(false);
}

validateCss.description = 'Lint Scss files';

gulp.task('validate:css', () => validateCss(configFrontEnd.css.lint.failOnError));

function docsCss() {
  return gulp.src(configFrontEnd.css.src)
    .pipe(sassdoc({
      dest: configFrontEnd.css.sassdoc.dest,
      verbose: configFrontEnd.css.sassdoc.verbose,
      // basePath: configFrontEnd.css.sassdoc.basePath,
      exclude: configFrontEnd.css.sassdoc.exclude,
      theme: configFrontEnd.css.sassdoc.theme,
      sort: configFrontEnd.css.sassdoc.sort
    }));
}

docsCss.description = 'Build CSS docs using SassDoc';

gulp.task('docs:css', docsCss);

gulp.task('clean:docs:css', (done) => {
  del([configFrontEnd.css.sassdoc.dest]).then(() => {
    done();
  })
});

function watchCss() {
  const watchTasks = [cssCompile];
  if (configFrontEnd.css.lint.enabled) {
    watchTasks.push(validateCssWithNoExit);
  }
  if (configFrontEnd.css.sassdoc.enabled) {
    watchTasks.push('docs:css');
  }
  const src = configFrontEnd.css.src;
  return gulp.watch(src, gulp.parallel(watchTasks));
}

watchCss.description = "Watch SCSS";

gulp.task('watch:css', watchCss);

tasks.watch.push('watch:css');

tasks.compile.push('css');

if (configFrontEnd.css.lint.enabled) {
  tasks.validate.push('validate:css');
}

if (configFrontEnd.css.sassdoc.enabled) {
  tasks.compile.push('docs:css');
  tasks.clean.push('clean:docs:css');
}

tasks.clean.push('clean:css');


/******************************************************
 * SCSS to JSON
 ******************************************************/
// turns scss files full of variables into json files that PL can iterate on
function scssToJson(done) {
  configFrontEnd.patternLab.scssToJson.forEach((pair) => {
    const scssVarList = _.filter(fs.readFileSync(pair.src, 'utf8').split('\n'), item => _.startsWith(_.trimStart(item), pair.lineStartsWith));
    console.log(scssVarList);
    let varsAndValues = _.map(scssVarList, (item) => {
      // assuming `item` is `$color-gray: hsl(0, 0%, 50%); // main gray color`
      const x = item.split(':');
      const y = x[1].split(';');
      return {
        name: x[0].trim().replace(/\/\//g, ""), // i.e. $color-gray
        value: y[0].replace(/!.*/, '').trim(), // i.e. hsl(0, 0%, 50%) after removing `!default`
        comment: y[1].replace('//', '').trim(), // any inline comment coming after, i.e. `// main gray color`
      };
    });

    if (!pair.allowVarValues) {
      varsAndValues = _.filter(varsAndValues, item => !_.startsWith(item.value, '$'));
    }

    fs.writeFileSync(pair.dest, JSON.stringify({
      items: varsAndValues,
      meta: {
        description: `To add to these items, use Sass variables that start with <code>${pair.lineStartsWith}</code> in <code>${pair.src}</code>`,
      },
    }, null, '  '));
  });
  done();
}

if (configFrontEnd.patternLab.scssToJson) {
  gulp.task('pl:scss-to-json', scssToJson);
  // plFullDependencies.push('pl:scss-to-json');
  //
  gulp.task('watch:pl:scss-to-json', () => {
    const files = configFrontEnd.patternLab.scssToJson.map(file => file.src);
    gulp.watch(files, scssToJson);
  });
  tasks.watch.push('watch:pl:scss-to-json');
  // watchTasks.push('docs:css');
}


/******************************************************
 * SERVER AND WATCH TASKS
******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return resolvePath(paths().source.patterns) + '/**/*' + dotExtension;
  });
}

function reload() {
  browserSync.reload();
}

function reloadCSS() {
  browserSync.reload('*.css');
}

function watch() {
  gulp.watch(resolvePath(configFrontEnd.css.dest) + '/**/*.css', { awaitWriteFinish: true }).on('change', reloadCSS);
  gulp.watch(resolvePath(paths().source.css) + '/**/*.css', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:css', reloadCSS));
  gulp.watch(resolvePath(paths().source.styleguide) + '/**/*.*', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS));

  var patternWatches = [
    resolvePath(paths().source.patterns) + '/**/*.json',
    resolvePath(paths().source.patterns) + '/**/*.md',
    resolvePath(paths().source.data) + '/*.json',
    resolvePath(paths().source.fonts) + '/*',
    resolvePath(paths().source.images) + '/*',
    resolvePath(paths().source.meta) + '/*',
    resolvePath(paths().source.annotations) + '/*'
  ].concat(getTemplateWatches());

  console.log(patternWatches);

  gulp.watch(patternWatches, { awaitWriteFinish: true }).on('change', gulp.series(build, reload));
}

gulp.task('patternlab:connect', gulp.series(function(done) {
  browserSync.init({
    server: {
      baseDir: configFrontEnd.browserSync.baseDir
    },
    startPath: configFrontEnd.browserSync.startPath,
    browser: configFrontEnd.browserSync.browser,
    open: configFrontEnd.browserSync.openBrowserAtStart,
    // port: configFrontEnd.browserSync.port,
    reloadOnRestart: true,
    reloadDelay: configFrontEnd.browserSync.reloadDelay,
    reloadDebounce: configFrontEnd.browserSync.reloadDebounce,
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    },
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center'
      ]
    }
  }, function(){
    console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
    done();
  });
}));

/******************************************************
 * COMPOUND TASKS
******************************************************/
// gulp.task('default', gulp.series('css', 'patternlab:build'));
gulp.task('patternlab:watch:css', gulp.series('css', watch));
gulp.task('patternlab:watch', gulp.series('css', 'patternlab:build', watch));
gulp.task('patternlab:serve', gulp.series('css', 'patternlab:build', 'patternlab:connect', watch));

gulp.task('clean', gulp.parallel(tasks.clean));
gulp.task('compile', gulp.series(
  'clean',
  tasks.compile,
  'patternlab:build'
));
gulp.task('validate', gulp.parallel(tasks.validate));
gulp.task('watch', gulp.parallel(
  tasks.watch,
  'patternlab:build',
  watch
));
gulp.task('default', gulp.series(
  'compile',
  gulp.parallel(
    tasks.watch,
    'patternlab:build',
    'patternlab:connect',
    watch
  )
));

module.exports = {
  css: {
    enabled: true,
    src: [
      'scss/**/*.scss',
      'source/_patterns/**/*.scss',
    ],
    dest: 'public/css/',
    flattenDestOutput: true,
    lint: {
      enabled: true,
      failOnError: false,
      // in addition to linting `css.src`, this is added.
      extraSrc: [],
    },
    // additional debugging info in comment of the output CSS - only use when necessary
    sourceComments: false,
    sourceMapEmbed: false,
    // tell the compiler whether you want 'expanded' or 'compressed' output code
    outputStyle: 'expanded',
    // https://github.com/ai/browserslist#queries
    autoPrefixerBrowsers: [
      'last 2 versions',
      'IE >= 10',
    ],
    includePaths: [
      './node_modules',
      './bower_components',
    ],
    // http://sassdoc.com
    sassdoc: {
      enabled: true,
      dest: 'public/sassdoc',
      verbose: false,
      // basePath: 'https://github.com/phase2/pattern-lab-starter/blob/master/source/_patterns',
      exclude: [],
      theme: 'default',
      // http://sassdoc.com/customising-the-view/#sort
      sort: [
        'file',
        'group',
        'line>',
      ],
    },
  },
  browserSync: {
    enabled: true,
    port: 6000,
    watchFiles: [],
    // enable when full CMS is set up
    // domain: 'mysite.dev',
    baseDir: './',
    startPath: 'public/',
    openBrowserAtStart: true,
    // requires above to be true; allows non-default browser to open
    browser: [
      'Google Chrome',
    ],
    // Tunnel the Browsersync server through a random Public URL
    // -> http://randomstring23232.localtunnel.me
    tunnel: false,
    reloadDelay: 50,
    reloadDebounce: 750,
    rewriteRules: [],
  },
  js: {
    enabled: true,
    src: [
      'source/js/**/*.js',
      'source/_patterns/**/*.js',
    ],
    dest: 'public/js/',
    destName: 'script.js',
    sourceMapEmbed: false,
    uglify: false,
    babel: true,
    // Will bundle all bower JS dependencies (not devDeps)
    // creates a `bower_components.min.js` file in `js.dest`.
    bundleBower: true,
    eslint: {
      enabled: true,
      src: [
        'js/**/*.js',
        'source/_patterns/**/*.js',
        '.*.js',
        '*.js',
      ],
    },
  },
  patternLab: {
    // configFile: 'pattern-lab/config/config.yml',
    injectFiles: [],
    injectBower: true,
    bowerBasePath: './',
    scssToJson: [
      {
        src:  'scss/02-foundation/colors/_schema.scss',
        dest: 'source/_patterns/00-foundation/01-colors/colors.json',
        lineStartsWith: '//get-color',
        allowVarValues: false,
      },
      // {
      //   src: 'source/_patterns/01-atoms/01-typography/fonts/_fonts.scss',
      //   dest: 'source/_patterns/01-atoms/01-typography/fonts/font-sizes.json',
      //   lineStartsWith: '$fs--',
      //   allowVarValues: false,
      // },
      // {
      //   src: 'source/_patterns/01-atoms/01-typography/fonts/_fonts.scss',
      //   dest: 'source/_patterns/01-atoms/01-typography/fonts/font-families.json',
      //   lineStartsWith: '$ff--',
      //   allowVarValues: false,
      // },
      {
        src: 'scss/02-foundation/breakpoints/_variables.scss',
        dest: 'source/_patterns/00-foundation/04-breakpoints/breakpoints.json',
        lineStartsWith: '$bp--',
        allowVarValues: false,
      },
      // {
      //   src: 'source/_patterns/00-base/spacing/_spacing.scss',
      //   dest: 'source/_patterns/00-base/spacing/spacing.json',
      //   lineStartsWith: '$spacing--',
      //   allowVarValues: false,
      // },
      // {
      //   src: 'source/_patterns/00-base/animations/01-transitions/_transitions.scss',
      //   dest: 'source/_patterns/00-base/animations/01-transitions/transitions.json',
      //   lineStartsWith: '$trans-',
      //   allowVarValues: true,
      // },
    ],
  }
};

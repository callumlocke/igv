/*jshint indent:4 */

// Generated on 2013-12-09 using generator-ig-job 0.0.4
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var modernizrConf = require('./modernizr.json');


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['copy:styles', 'autoprefixer']
      },
      templates: {
        files: ['<%= yeoman.app %>/templates/{,*/}*.hbs'],
        tasks: ['templates']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          ['<%= yeoman.app %>/*.html'],
          '.tmp/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      local: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      demo: {
        path: 'http://www.ft.com/ig/<%= igdeploy.options.targets.demo %>/'
      },
      live: {
        path: 'http://www.ft.com/ig/<%= igdeploy.options.targets.live %>/'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*'
      ]
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    concat: {
      handlebars: {
        src: [
          'node_modules/grunt-contrib-handlebars/node_modules/handlebars/dist/handlebars.runtime.js',
          '.tmp/jst/{,*/}*.js'
        ],
        dest: '.tmp/scripts/templates.js'
      }
    },
    // only used to pass options since usemin task does concat and uglify
    // check index.html to edit your build targets
    // enable this task if you prefer defining your build targets here
    uglify: {
      options: {
        preserveComments: 'some'
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            ['<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp}', '!<%= yeoman.dist %>/images/content/**/*.{png,jpg,jpeg,gif,webp}'],
            '<%= yeoman.dist %>/styles/fonts/**/*.{eot,woff,ttf}'
          ]
        }
      }
    },
    useminPrepare: {
      options: {
        dest: '<%= yeoman.dist %>'
      },
      html: ['<%= yeoman.app %>/index.html']
    },
    usemin: {
      options: {
        dirs: ['<%= yeoman.dist %>']
      },
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.{png,jpg,jpeg,gif,webp}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      // This task is pre-configured if you do not wish to use Usemin
      // blocks for your CSS. By default, the Usemin block from your
      // `index.html` will take care of minification, e.g.
      //
      //     <!-- build:css({.tmp,app}) styles/main.css -->
      //
      // dist: {
      //     files: {
      //         '<%= yeoman.dist %>/styles/main.css': [
      //             '.tmp/styles/{,*/}*.css',
      //             '<%= yeoman.app %>/styles/{,*/}*.css'
      //         ]
      //     }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/**/*.{webp,gif}',
            'styles/fonts/**/*.{eot,woff,ttf}',
            'scripts/vendor/es5-shim.js'
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    handlebars: {
      dist: {
        files: {
          '.tmp/jst/handlebars.js': ['<%= yeoman.app %>/templates/{,*/}*.hbs']
        },
        options: {
          namespace: 'JST',
          partialsUseNamespace: true,
          processContent: function(content) {
            content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
            content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '');
            return content;
          },
          processAST: function(ast) {
            return ast;
          },
          processName: function(filePath) {
            var pieces = filePath.split('/');
            return pieces[pieces.length - 1].replace(/\..*$/, '').replace(/\ /g, '_');
          },
          processPartialName: function(filePath) {
            var pieces = filePath.split('/');
            return pieces[pieces.length - 1].replace(/\..*$/, '').replace(/\ /g, '_').replace(/^_+/, '');
          }
        }
      }
    },
    igdeploy: {
      options: {
        src: 'dist',
        server: 'ftlnx109-lviw-uk-p.osb.ft.com',
        targetRoot: '/var/opt/customer/apps/interactive.ftdata.co.uk/var/www/html',
        targets: {
          demo: '_other/callum/seasonal-video/demo',
          live: '_other/callum/seasonal-video/live'
        }
      }
    },
    modernizr: {
      parseFiles: false,
      outputFile: '.tmp/scripts/vendor/modernizr.js',
      uglify: false,
      extra: modernizrConf.extra,
      extensibility : modernizrConf.extensibility,
      tests: modernizrConf.tests,
    },
    embed: {
      options: {
        threshold: '7KB'
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
        }
      }
    },
    report: {
      demo: {
        options: {
          consoleMessages: 'ok'
        },
        url: 'http://www.ft.com/ig/<%= igdeploy.options.targets.demo %>/'
      },
      live: {
        url: 'http://www.ft.com/ig/<%= igdeploy.options.targets.live %>/'
      }
    },
    concurrent: {
      server: [
        'templates',
        'modernizr',
        'compass',
        'coffee:dist',
        'copy:styles'
      ],
      test: [
        'templates',
        'coffee',
        'copy:styles'
      ],
      dist: [
        'templates',
        'modernizr',
        'coffee',
        'compass',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open:local', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'open:local',
      'watch'
    ]);
  });

  grunt.registerTask('templates', [
    'handlebars',
    'concat:handlebars'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin'//,
    // 'embed:dist'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('deploy', function (target) {
    if (!grunt.file.isDir('dist')) {
      grunt.fail.fatal('Couldn\'t find "dist" - please build before deploying!');
    }

    grunt.task.run([
      'qa',
      'igdeploy:' + target,
      'report:' + target,
      'open:' + target
    ]);
  });

  grunt.registerTask('qa', function () {
    grunt.file.expand('app/*.html').forEach(function (filePath) {
      console.log('filePath', filePath);
    });
  });
};

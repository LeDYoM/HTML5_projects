'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    simplemocha: {
      all: {
        src: ['test/*.js']
      }
    },
    watch: {
      all: {
        files: ['src/**/*.js', 'test/**/*.js'],
        tasks: [/* 'simplemocha', */ 'jsdoc']
      }
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
    concat: {
      sdk: {
        src: [
          'node_modules/es6-promise/dist/promise-0.1.1.js',
          'src/sdk/cross.js',
          'src/sdk/challengeServiceProvider.js',
          'src/sdk/scoreServiceProvider.js',
          'src/sdk/userServiceProvider.js',
          'src/sdk/scoreloopService.js'
        ],
        dest: 'NonamedRacerClient/public_html/js/sdk.js'
      },
      templates: {
        src: [
          'node_modules/handlebars-browser/handlebars.js',
          'src/tpl/openChallenges.js',
          'src/tpl/challengeHistory.js',
          'src/tpl/endGame.js',
          'src/tpl/topButtons.js',
        ],
        dest: 'NonamedRacerClient/public_html/js/templates.js'
      }
    },
    copy: {
      main: {
        files: [
          { expand: true, flatten: true, src: 'NonamedRacerClient/public_html/*.html', dest: 'dist', },
          { expand: true, flatten: true, src: 'NonamedRacerClient/public_html/js/*.js', dest: 'dist/js', },
          { expand: true, flatten: true, src: 'NonamedRacerClient/public_html/css/*.*', dest: 'dist/css', }
        ]
      }
    },
    sshexec: {
      unlink: {
        command: "unlink /var/www/html5-game/current || true"
      },
      link: {
        command: "ln -s <%= sftp.dist.options.path %> /var/www/html5-game/current"
      },
      options: {
        host: "game-html5-client.scoreloop.com",
        username: "root",
        privateKey: (function () {
          if (grunt.file.exists(process.env.HOME + "/.ssh/id_dsa")) {
            return grunt.file.read(process.env.HOME + "/.ssh/id_dsa");
          } else if (grunt.file.exists(process.env.HOME + "/.ssh/id_rsa")) {
            return grunt.file.read(process.env.HOME + "/.ssh/id_rsa");
          } else {
            return undefined;
          }
        })()
      }
    },
    sftp: {
      dist: {
        files: {
          "./": "dist/**"
        },
        options: {
          host: "game-html5-client.scoreloop.com",
          username: "root",
          path: "/var/www/html5-game/releases/" + grunt.template.today('yyyymmddhhMMss'),
          srcBasePath: "dist/",
          showProgress: true,
          privateKey: (function () {
            if (grunt.file.exists(process.env.HOME + "/.ssh/id_dsa")) {
              return grunt.file.read(process.env.HOME + "/.ssh/id_dsa");
            } else if (grunt.file.exists(process.env.HOME + "/.ssh/id_rsa")) {
              return grunt.file.read(process.env.HOME + "/.ssh/id_rsa");
            } else {
              return undefined;
            }
          })(),
          createDirectories: true
        }
      }
    },
    clean: ["dist"],
    handlebars: {
      compile: {
        options: {
          namespace: 'Templates',
          processName: function (path) {
            return path.replace(/^.*\//, "").replace(/\.hbs$/, "");
          }
        },
        files: {
          'src/tpl/openChallenges.js': 'src/tpl/openChallenges.hbs',
          'src/tpl/challengeHistory.js': 'src/tpl/challengeHistory.hbs',
          'src/tpl/endGame.js': 'src/tpl/endGame.hbs',
          'src/tpl/topButtons.js': 'src/tpl/topButtons.hbs'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  grunt.registerTask('default', ['simplemocha', 'jsdoc']);
  grunt.registerTask('assemble', ['handlebars', 'concat']);
  grunt.registerTask('dist', ['clean', 'assemble', 'copy', 'sftp', 'sshexec:unlink', 'sshexec:link']);
};

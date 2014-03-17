/*global module:false*/
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee:{
      dist: {
        files: {
          'malory.js' : ['lib/malory.litcoffee']
        },
        options: {
          bare: true,
          sourceMap: false
        }
      }
    },
    clean: {
      dist: {
        src: ['malory.js']
      }
    },
    connect: {
      dev: {
        options: {
          port: 8100,
          base: '.'
        }
      }
    },
    watch: {
      dev: {
        files: 'lib/malory.litcoffee',
        tasks: ['default'],
        options: {
          interrupt: true
        }
      }
    },
    shell: {
      docs: {
         options: {
           stdout: false,
           stderr: true
         },
        command: 'PATH="node_modules/.bin:${PATH}" doc-n-toc docs/readme.md --css docs/my.less --title "malory v<%= pkg.version %>" > build/index.html'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['clean', 'coffee']);
  grunt.registerTask('dev', ['default', 'watch']);
  grunt.registerTask('serve', ['connect:dev', 'watch']);
  grunt.registerTask('docs', ['shell:docs']);

};

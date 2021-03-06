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
      },
      test: {
        files: {
          'example/employee.js' : ['example/employee.coffee'],
          'example/example.js' : ['example/example.coffee'],
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
    }
  });

  grunt.registerTask('default', ['clean', 'coffee:dist']);
  grunt.registerTask('test', ['clean', 'coffee:test']);
  grunt.registerTask('dev', ['default', 'watch']);
  grunt.registerTask('serve', ['connect:dev', 'watch']);

};

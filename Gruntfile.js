/*global module:false*/
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  // Project configuration.
  grunt.initConfig({
    coffee:{
      dist: {
        files: {
          'malory.js' : ['malory.coffee']
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
    watch: {
      dev: {
        files: 'malory.coffee',
        tasks: ['dev'],
        options: {
          interrupt: true
        }
      }
    },
    connect: {
      dev: {
        options: {
          port: 8100,
          base: '.'
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('dev', ['default', 'watch:dev']);
  grunt.registerTask('default', ['clean', 'coffee']);

};

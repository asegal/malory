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
    watch: {
      dev: {
        files: 'malory.coffee',
        tasks: ['default'],
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
  grunt.registerTask('dev', ['coffee', 'connect:dev', 'watch']);
  grunt.registerTask('default', ['dev']);

};

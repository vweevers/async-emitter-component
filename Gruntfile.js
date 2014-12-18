'use strict';

module.exports = function(grunt) {
  var files = ['Gruntfile.js', 'package.json', 'index.js', 'lib/*.js', 'test/*.js'];

  grunt.initConfig({
    mochaTest: {
      options: {
        globals: ['should']
      },
      all: { src: ['test/**/*.js'] }
    },
    watch: {
      files: ['**/*.js', '!**/node_modules/**'],
      tasks: ['test']
    }
  });

  // npm tasks
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['test', 'watch']);
};

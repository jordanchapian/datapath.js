module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },
    },
    concat: {
      globalBuild: {
        src: [
          './src/env_intro.js',
          './src/datasync/**/*.js',
          './src/env_outro_global.js'
        ],
        dest: 'build/datasync_global.js'
      },
      isolateBuild:{
        src: [
          './src/env_intro.js',
          './src/datasync/**/*.js',
          './src/env_outro_isolate.js'
        ],
        dest: 'build/datasync_isolate.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('dev', ['watch']);
};
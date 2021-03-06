module.exports = function(grunt) {

  grunt.initConfig({
    
    jasmine : {
      functional:{
        src : './src/datapath/**/*.js',
        options : {
            outfile:'./test/functionalTests.html',
            keepRunner:true,
            specs : './test/functional/**/*.spec.js',
            template: require('grunt-template-jasmine-requirejs'),
            templateOptions: {
                requireConfig: {
                    baseUrl: '../'
                }
            }
        }
      }
    },

    jsdoc : {
        dist : {
            src: ['src/**/*.js'],
            options: {
                destination: 'docs/'
            }
        }
    },
    
    requirejs: {
      compile: {
        options: {
          optimize: "none",
          almond: true,
          out: "./build/datapath.js",
          name: "../../node_modules/almond/almond",
          baseUrl: "./src/datapath",
          include:['datapath'],
          wrap: {
              startFile: "src/start.frag",
              endFile: "src/end.frag"
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['requirejs']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('explain', ['jsdoc']);
};
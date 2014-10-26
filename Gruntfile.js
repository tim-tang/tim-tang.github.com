'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'assets/themes/mark-reid/js/*.js', '!assets/themes/mark-reid/js/scripts.min.js']
        },
        recess: {
            dist: {
                options: {
                    compile: true,
                    compress: true
                },
                files: {
                    'assets/themes/mark-reid/css/main.min.css': ['assets/themes/mark-reid/css/*.css']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'assets/themes/mark-reid/js/main.min.js': ['assets/themes/mark-reid/js/*.js']
                }
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: 'images/'
                }]
            }
        },
        watch: {
            css: {
                files: ['assets/thems/mark-reid/css/*.css'],
                tasks: ['recess']
            },
            js: {
                files: ['<%= jshint.all %>'],
                tasks: ['uglify']
            }
        },
        clean: {
            dist: ['assets/themes/mark-reid/css/main.min.css', 'assets/themes/mark-reid/js/scripts.min.js']
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Register tasks
    grunt.registerTask('default', ['clean', 'recess', 'uglify', 'imagemin']);
    grunt.registerTask('dev', ['watch']);
};

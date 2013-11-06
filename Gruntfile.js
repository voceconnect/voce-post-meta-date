'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                "curly": true,
                "eqeqeq": true,
                "eqnull": true,
                "browser": true,
                "plusplus": false,
                "undef": true,
                "unused": false,
                "trailing": true,
                "globals": {
                    "jQuery": true,
                    "$": true,
                    "ajaxurl": true
                }
            },
            all: [
                "voce-post-meta-date.js"
            ]
        },
        imagemin: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: "images/",
                        src: "**/*.{png,jpg}",
                        dest: "images/"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-plugins');

    grunt.registerTask('default', ['jshint', 'imagemin']);

};
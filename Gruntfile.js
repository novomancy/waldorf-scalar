//var packageJson = require("./package.json");

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist:{
                src: ["./vendor/select2.js","./dist/annotator-frontend.js"],
                dest: './dist/annotator-frontend.js'
            },
            scalar_dist:{
                src: ["./vendor/select2.js","./dist/annotator-frontend-scalar.js"],
                dest: './dist/annotator-frontend-scalar.js'
            },
        },
        browserify: {
            dist: {
                options: {
                    browserifyOptions: {
                        // Enable inline sourcemap generation so that
                        // stack traces reference the original files' lines
                        debug: false
                    },
                    transform: [
                        
                    ]
                },
                files: {
                    // if the source file has an extension of es6 then
                    // we change the name of the source file accordingly.
                    // The result file's extension is always .js
                    "./dist/annotator-frontend.js": ["./modules/main.js"]
                }
            },
            scalar_dist: {
                options: {
                    browserifyOptions: {
                        // Enable inline sourcemap generation so that
                        // stack traces reference the original files' lines
                        debug: false
                    },
                    transform: [
                        
                    ],
                    exclude: ['jquery', 'jquery-ui']
                },
                files: {
                    // if the source file has an extension of es6 then
                    // we change the name of the source file accordingly.
                    // The result file's extension is always .js
                    "./dist/annotator-frontend-scalar.js": ["./modules/main.js"]
                }
            }
        },
        sass: {
            dist: {
                files: {
                    './dist/annotator-frontend.css': './sass/main.scss'
                }
            }
        },
        watch: {
            scripts: {
                //Build packed file when any source files change
                files: ["./modules/**/*.js"],
                tasks: ["browserify", "concat", "extract_sourcemap"]
            },
            styles: {
                //Build packed file when any style files change
                files: ["./sass/**/*.scss"],
                tasks: ["sass"]
            },
            system: {
                files: ["./Gruntfile.js", "./package.json"],
                tasks: ["build"]
            }
            // ,postbuild: {
            //     files: ["./dist/*.js"],
            //     tasks: ["extract_sourcemap"]
            // }
        },
        browserSync: {
            default_options: {
                bsFiles: {
                    // BrowserSync will reload if any of the following files are changed.
                    src: [
                        "./testpage/**/*.js",
                        "./testpage/**/*.html",
                        "./testpage/**/*.css",
                        "./dist/**/*.css",
                        "./dist/**/*.js"
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./",
                        index: "./testpage/index.html"
                    }
                }
            }
        },
        extract_sourcemap: {
            // Task to extract the inline sourcemap from the built file
            // so that Chrome can use it for debug purposes (stack traces
            // will point to original source files)
            files: {
                './dist': ['./dist/annotator-frontend.js'],
            },
        },
        compress: {
            main: {
                options: {
                    archive: function () {
                        // Build zip file string here
                        return "waldorf.zip";
                    }
                },
                files: [{
                    expand: true,
                    cwd: "./",
                    src: ["dist/*"],
                    dest: "./"
                }]
            }
        },
        test: {

        }

    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-extract-sourcemap');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask("build", ["sass", "browserify", "concat"]);
    grunt.registerTask("preview", ["build", "browserSync", "concat", "watch"]);
    grunt.registerTask("make_release", ["build", "compress"]);
    grunt.registerTask("test", ["test"]);
};
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('manifest.json'),
        concat: {
            options: {
                separator: ';'
            },
            dev: {
                files: {
                    'package/js/jquery.js': ['js/jquery-2.0.3.js', 'js/jquery-ui-1.10.3.widget-factory.js']
                }
            },
            prod: {
                files: {
                    'package/js/jquery.min.js': ['js/jquery-2.0.3.min.js', 'js/jquery-ui-1.10.3.widget.factory.min.js']
                }
            }
        },
        compass: {
            dist: {                   // Target
                options: {              // Target options
                    sassDir: 'scss',
                    cssDir: 'package/css',
                    environment: 'production'
                }
            },
            dev: {                    // Another target
                options: {
                    sassDir: 'scss',
                    cssDir: 'package/css',
                    environment: 'production'
                }
            }        },
        replace: {
            main: {
                options: {
                    variables: {
                        'version': '<%=pkg.version%>',
                        'min.suffix': ''
                    },
                    prefix: '@@'
                },
                files: [
                    {expand: true, flatten: true, src: ['manifest.json'], dest: 'package/'},
                    {expand: true, flatten: true, src: ['html/*'], dest: 'package/html/'}
                ]
            }
        },
        jshint: {
            files: ['js/contentscript.js', 'js/background.js', 'js/popup.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'v<%= pkg.version %>.zip'
                },
                files: [
                    {expand: true, cwd: './package/', src: ['./**'], dest: "./"} // includes files in path and its subdirs
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: ['images/icon*.png', 'images/iphone*.png', 'images/ajax-loader.gif', 'images/icon_facebook.gif', 'images/DonateBitcoin.png'], dest: 'package/'},
                    {expand: true, src: ['js/contentscript.js'], dest: 'package/'},
                    {expand: true, src: ['js/background.js'], dest: 'package/'},
                    {expand: true, src: ['js/eliminator-slajdow.jquery.widget.js'], dest: 'package/'},
                    {expand: true, src: ['js/popup.js'], dest: 'package/'},
                    {expand: true, src: ['js/jquery.iphone-switch.js'], dest: 'package/'}
                ]
            }
        },
        clean: {
            package_dir: ["package/*"]
        },
        watch: {
            files: ['<%= jshint.files %>', 'scss/*', 'html/*', 'images/*', 'js/*'],
            tasks: ['jshint', 'concat', 'replace', 'compass', 'copy']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint', 'concat', 'compass']);
    grunt.registerTask('package', ['clean:package_dir', 'jshint', 'concat', 'compass', 'replace', 'copy']);
};
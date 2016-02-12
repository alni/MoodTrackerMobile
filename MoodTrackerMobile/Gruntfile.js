/// <binding BeforeBuild='clean, build' />
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({

        dir: {
            webapp: 'webapp',
            //dist: 'dist',
            dist: 'www',
            bower_components: 'bower_components'
        },

        connect: {
            options: {
                port: 8080,
                hostname: '*'
            },
            src: {
                options: {
                    port: 8080,
                    base: '<%= dir.webapp %>',
                    fileRemaps: {
                        "messagebundle_nb.properties": {
                            to: "messagebundle_no.properties",
                            onlyWithinPath: "i18n"
                        },
                        "messagebundle_nb_NO.properties": {
                            to: "messagebundle_no.properties",
                            onlyWithinPath: "i18n"
                        },
                        "messagebundle_nn.properties": {
                            to: "messagebundle_no.properties",
                            onlyWithinPath: "resources"
                        },
                        "ACKNOWLEDGEMENTS.md": {
                            to: "../ACKNOWLEDGEMENTS.md",
                            excludedPath: "i18n"
                        }
                    },
                    middleware: function (connect, options, middlewares) {
                        middlewares.push(function (req, res, next) {
                            var urlParts = req.url.split("/");
                            var fileName = urlParts[urlParts.length - 1];
                            var fileRemaps = options.fileRemaps;
                            var remapFile = fileRemaps.hasOwnProperty(fileName)
                                 ? fileRemaps[fileName] : null;
                            if (remapFile) {
                                // Redirect files from the "fileRemaps" option
                                // to files with name from the "to" property.
                                // But if the "onlyWitinPath" property is set,
                                // only redirect files within that folder
                                var onlyWithinPath = remapFile.onlyWithinPath;
                                var excludedPath = remapFile.excludedPath;
                                urlParts.pop(); // Remove last element (fileName)
                                var path = options.base;
                                path += urlParts.join("/");
                                path += '/' + remapFile.to;
                                if (excludedPath && urlParts.indexOf(excludedPath) > -1) {
                                    return next();
                                } else if (!onlyWithinPath || urlParts.indexOf(onlyWithinPath) > -1) {
                                    try {
                                        require('fs').createReadStream(path).pipe(res);
                                    } catch (ex) {
                                        return next();
                                    }
                                } else {
                                    return next();
                                }
                            } else {
                                return next();
                            }
                        });
                        return middlewares;
                    }
                }
            },
            dist: {}
        },

        openui5_connect: {
            options: {
                resources: [
                    '<%= dir.bower_components %>/openui5-sap.ui.core/resources',
                    '<%= dir.bower_components %>/openui5-sap.ui.layout/resources',
                    '<%= dir.bower_components %>/openui5-sap.m/resources',
                    '<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources',
                    '<%= dir.bower_components %>',
                ]
            },
            src: {
                options: {
                    appresources: '<%= dir.webapp %>'
                }
            },
            dist: {
                options: {
                    appresources: '<%= dir.dist %>'
                }
            }
        },

        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: '<%= dir.webapp %>',
                        prefix: 'mood_tracker'
                    },
                    //dest: '<%= dir.webapp %>'
                    dest: '<%= dir.dist %>'
                },
                components: true
            }
        },

        clean: {
            dist: {
                files: [
                    // Delete all files (_only_ files)
                    {
                        src: [
                            '<%= dir.dist %>/**',
                            '!<%= dir.dist %>/keepme.txt'
                        ],
                        filter: 'isFile'
                    },
                    // Delete some specific directories (and all their contents)
                    {
                        src: [
                            '<%= dir.dist %>/controller',
                            '<%= dir.dist %>/css',
                            '<%= dir.dist %>/i18n',
                            '<%= dir.dist %>/images',
                            '<%= dir.dist %>/model',
                            '<%= dir.dist %>/resources',
                            '<%= dir.dist %>/scripts',
                            '<%= dir.dist %>/view'
                        ]
                    }
                ]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.webapp %>',
                    src: [
                        '**',
                        '!test/**',
                        '!**/*.vsspell'
                    ],
                    dest: '<%= dir.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>/openui5-sap.ui.core',
                    src: [
                        'resources/**',
                    ],
                    dest: '<%= dir.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>/openui5-sap.ui.layout',
                    src: [
                        'resources/**',
                        '!**/*.less'
                    ],
                    dest: '<%= dir.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>/openui5-sap.m',
                    src: [
                        'resources/**',
                        '!**/*.less'
                    ],
                    dest: '<%= dir.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal',
                    src: [
                        'resources/**',
                        '!**/*.less'
                    ],
                    dest: '<%= dir.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>',
                    src: [
                        'Chart.js/Chart.min.js',
                        'Chart.js/LICENSE.md',
                        'Chart.js/README.md',

                        'marked/marked.min.js',
                        'marked/LICENSE',
                        'marked/README.md',
                    ],
                    dest: '<%= dir.dist %>/resources/'
                }, {
                    cwd: '.',
                    src: [
                        'ACKNOWLEDGEMENTS.md'
                    ],
                    dest: '<%= dir.dist %>/'
                }]
            },
            i18n: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.dist %>',
                    src: [
                         '**/messagebundle_no.properties'
                    ],
                    rename: function (dest, src) {
                        console.log(dest + src);
                        // Create Norwegian Bookmal (nb) i18n files from
                        // "messagebundle_no.properties" i18n files as
                        // only regular Norwegian (no) is available
                        return dest + src.replace('_no', '_nb');
                    },
                    dest: '<%= dir.dist %>/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: '<%= dir.dist %>',
                    src: [
                         'resources/**/messagebundle_no.properties'
                    ],
                    rename: function (dest, src) {
                        console.log(dest + src);
                        // Create Norwegian Nynorsk (nb) i18n files from
                        // "messagebundle_no.properties" i18n files in the 
                        // "resources/" folder as only regular Norwegian (no) 
                        // is available
                        return dest + src.replace('_no', '_nn');
                    },
                    dest: '<%= dir.dist %>/',
                    filter: 'isFile'
                }]
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                preserveComments: 'some'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.dist %>/',
                    src: [
                        'controller/**/*.js',
                        'model/**/*.js',
                        'scripts/**/*.js',
                        'util/**/*.js',
                        'Component.js',
                        'MyRouter.js'
                    ],
                    dest: '<%= dir.dist %>/'
                }]
            }
        },

        eslint: {
            webapp: ['<%= dir.webapp %>']
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-openui5');
    grunt.loadNpmTasks('grunt-eslint');

    // Server task
    grunt.registerTask('serve', function (target) {
        grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
    });

    // Linting task
    grunt.registerTask('lint', ['eslint']);

    // Build task
    grunt.registerTask('build', ['openui5_preload', 'copy', 'uglify']);

    // Default task
    grunt.registerTask('default', [
        //'lint',
        'clean',
        'build',
        //'serve:src'
        'serve:dist'
    ]);
};
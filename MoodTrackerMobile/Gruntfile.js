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
            src: {},
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
                        src: ['<%= dir.dist %>/**'],
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
                        '!test/**'
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
                        'resources/**'
                    ],
                    dest: '<%= dir.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>/openui5-sap.m',
                    src: [
                        'resources/**'
                    ],
                    dest: '<%= dir.dist %>/'
                }, {
                    expand: true,
                    cwd: '<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal',
                    src: [
                        'resources/**'
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
    grunt.loadNpmTasks('grunt-openui5');
    grunt.loadNpmTasks('grunt-eslint');

    // Server task
    grunt.registerTask('serve', function (target) {
        grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
    });

    // Linting task
    grunt.registerTask('lint', ['eslint']);

    // Build task
    grunt.registerTask('build', ['openui5_preload', 'copy']);

    // Default task
    grunt.registerTask('default', [
        //'lint',
        'clean',
        'build',
        //'serve:src'
        'serve:dist'
    ]);
};
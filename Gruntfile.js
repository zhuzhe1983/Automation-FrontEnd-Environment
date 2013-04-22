'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            scripts: {
                files: ['app/**/*.{js,css,png,jpg,jpeg,webp}'],
                tasks: ['copy:debug','livereload']
            },
            compass: {
                files: ['app/**/*.scss'],
                tasks: ['compass:debug','livereload']
            },
            jade: {
                files: ['app/**/*.jade'],
                tasks: ['jade:debug','livereload']
            }
        },
        connect: {
            options: {
                port: 2013,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                        lrSnippet,
                        mountFolder(connect, '.tmp'),
                        mountFolder(connect, 'app')];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function(connect) {
                        return [
                        mountFolder(connect, 'dist')];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            debug: '.tmp',
            dist: ['.tmp', 'dist/*'],
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'app/scripts/{,*/}*.js']
        },
        compass: {
            debug: {
                options: {
                    sassDir: 'app/styles',
                    cssDir: '.tmp/styles',
                    imagesDir: 'app/images'
                }
            },
            dist: {
                options: {
                    sassDir: 'app/styles',
                    cssDir: 'dist/styles',
                    imagesDir: 'app/images',
                    environment: 'production'
                }
            }
        },
        jade: {
            debug: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.jade'],
                    dest: '.tmp/',
                    ext: '.html'
                }]
            },
            dist: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.jade'],
                    dest: 'dist/',
                    ext: '.html'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/scripts/main.js': [
                        'app/scripts/{,*/}*.js'],
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: 'dist/images'
                }]
            }
        },
        copy: {
            debug: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: ['**/*.{css,js,png,jpg,jpeg}'],
                    dest: '.tmp/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app',
                    src: ['**/*.{css,js,png,jpg,jpeg}'],
                    dest: '.dist/'
                }]
            }
        }
    });


    grunt.registerTask('server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:debug',
            'compass:debug',
            'jade:debug',
            'livereload-start',
            'connect:livereload',
            'copy:debug',
            'open',
            'watch']);
    });

    grunt.registerTask('test', [
        
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'clean:dist',
        'compass:dist',
        'jade:dist',
        'imagemin',
        'uglify',
        'copy:dist']);

    grunt.registerTask('default', [
        'server','jshint']);
};
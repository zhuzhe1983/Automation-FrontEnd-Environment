'use strict';
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var project = "canku";
var scmType = "git";
var scmBranch = "master";
var scmUrl = "git@github.com:zhuzhe1983/canku.git";
var projectDir = "project/" + project;
var buildDir = "build/" + project;

console.log(projectDir);

module.exports = function (grunt) {
    // load all grunt tasks
    // 使用macchdep模块来过滤grunt-开头的模块，批量加载任务
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // watch为任务的key，可随便取
        watch: {
            // 需要监听变化的文件，/**/*为grunt里约定的通配符，表示所有子目录，详见http://gruntjs.com/configuring-tasks
            // task为需要运行的任务，当js发生变化时，运行copy:debug任务，把所有文件复制到.tmp目录以供浏览
            scripts: {
                files: [projectDir + '/**/*.{js,css,png,jpg,jpeg,webp}'],
                tasks: ['copy:debug']
            },
            // compass任务要监听变化的文件，为app下所有scss文件
            compass: {
                files: [projectDir + '/**/*.scss'],
                tasks: ['compass:debug']
            },
            // compass任务要监听变化的文件，为app下所有scss文件
            less: {
                files: [projectDir + '/**/*.less'],
                tasks: ['less:debug']
            },
            // jade任务要监听变化的文件，为app下所有jade文件
            jade: {
                files: [projectDir + '/**/*.jade'],
                tasks: ['jade:debug']
            }
        },
        clean: {
            debug: projectDir,
            dist: [
                projectDir,
                buildDir
            ]
        },
        // 开启一个静态服务器，端口为9999，host为0.0.0.0时，其它机器可以通过你的ip:9999访问，如果不希望则使用localhost
        connect: {
            options: {
                port: 9999,
                hostname: '0.0.0.0'
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, buildDir)];
                    }
                }
            }
        },
        // 从浏览器打开一个地址
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        git: {
            clone: {
                options: {
                    command: 'clone',
                    server: scmUrl,
                    branch: scmBranch,
                    path: projectDir
                }
            },
            pull: {
                options: {
                    command: 'pull'
                }
            }
        },
        // jshint，不解释
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            // all 代表当带或不带参数时，都会执行这个子任务
            all: [
                projectDir + '/scripts/**/*.js']
        },
        // less
        less: {
            debug: {
                options: {
                    paths: projectDir + '/styles'
                }
            },
            dist: {
                options: {
                    paths: projectDir + '/styles',
                    yuicompress: true
                }

            }
        },
        // compass，sass的一个超集，这里配置需要编译的目录和编译配置选项
        compass: {
            debug: {
                options: {
                    sassDir: projectDir + '/styles',
                    cssDir: buildDir + '/styles',
                    imagesDir: projectDir + '/images'
                }
            },
            dist: {
                options: {
                    sassDir: projectDir + '/styles',
                    cssDir: buildDir + '/styles',
                    imagesDir: projectDir + '/images',
                    environment: 'production'
                }
            }
        },
        // jade文件编译成html，pretty:true代表自动格式化漂亮的html
        jade: {
            debug: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [
                    {
                        expand: true, // expand为true,则可以设置以下选项
                        cwd: projectDir + '/', // 要操作的目录（不包含）
                        src: ['**/*.jade'], // 指定路径
                        dest: buildDir + '/', // 要生成的目标路径
                        ext: '.html' // 要生成的文件后缀
                    }
                ]
            },
            dist: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir + '/',
                        src: ['**/*.jade'],
                        dest: buildDir + '/',
                        ext: '.html'
                    }
                ]
            }
        },
        // js压缩合并
        uglify: {
            debug: {
                options: {
                    beautify: true, // 是否漂亮格式
                    mangle: false, // 是否短化变量
                    compress: false, // 是否压缩格式
                    sourceMap: buildDir + '/scripts/source-map.js'
                },
                files: {
                    '.tmp/scripts/main.js': [ projectDir + '/scripts/**/*.js']
                }
            },
            dist: {
                options: {
                    // 在生产环境下，生成source-map.js文件，有助于线上找出压缩过的JS文件异常行号
                    sourceMap: buildDir + '/scripts/source-map.js'
                },
                files: {
                    'dist/scripts/main.js': [
                        projectDir + '/scripts/**/*.js']
                }
            }
        },
        // 图片优化，只在build为生产环境时用到
        imagemin: {
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir + '/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: buildDir + '/images'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir + '/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: buildDir + '/images'
                    }
                ]
            }
        },
        // 复制文件
        copy: {
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir + '',
                        src: ['**/*.{css,png,jpg,jpeg}'],
                        dest: buildDir + '/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir + '',
                        src: ['**/*.{css,png,jpg,jpeg}'],
                        dest: buildDir + '/'
                    }
                ]
            }
        }
    });

    //FECI Functions

    //clean
    grunt.registerTask('clean', [
        'clean:debug'
    ]);

    //clone source code
    grunt.registerTask('scm', [
        'git:pull'/*,
        'git:clone'*/
    ]);

    //compile
    grunt.registerTask('comp', [
        'jade:debug',
        'compass:debug',
        'less:debug',
        //'stylus:debug',
        //'sass:debug'
    ]);

    //minimize
    grunt.registerTask('min', [
        'cssmin:debug',
        'htmlmin:debug',
        'imagemin:debug',
        'uglify:debug'
    ]);

    //QA
    grunt.registerTask('test', [
        'jasmine:debug',
        'csslint:debug',
        'jshint:debug',
        'quint:debug'
    ]);

    //package
    grunt.registerTask('pack', [
        'concat:debug',
        'compress:debug'
    ])

    //server
    grunt.registerTask('server', [
        'connect:debug'
    ]);

    //default
    grunt.registerTask('default', [
        'scm',
        'comp'/*,
        'min',
        'test',
        'pack',
        'server'*/
    ]);
};

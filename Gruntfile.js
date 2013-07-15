'use strict';
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var project = "dumpling";
var scmType = "git";
var scmBranch = "master";
var scmUrl = "git@github.com:zhuzhe1983/dumpling.git";
var projectDir = "project/source/" + project;
var buildDir = "project/build/" + project;

module.exports = function (grunt) {
    // load all grunt tasks
    // 使用macchdep模块来过滤grunt-开头的模块，批量加载任务
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // watch为任务的key，可随便取
        watch: {
            // 需要监听变化的文件，/**/*为grunt里约定的通配符，表示所有子目录，详见http://gruntjs.com/configuring-tasks
            // task为需要运行的任务，当js发生变化时，运行copy:debug任务，把所有文件复制到projectDir目录以供浏览
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
                'project':projectDir,
                'build':buildDir
        },
        // 开启一个静态服务器，端口为9999，host为0.0.0.0时，其它机器可以通过你的ip:9999访问，如果不希望则使用localhost
        connect: {
            debug:{
                options: {
                    port: 80,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    base:buildDir
                }
            },
            build: {
                options: {
                    port: 80,
                    hostname: '0.0.0.0',
                    keepalive: true,
                    base:buildDir
                }
            }
        },
        // 从浏览器打开一个地址
        open: {
            debug:{
                path: 'http://localhost:<%= connect.debug.options.port %>/?debug=true'
            },
            build:{
                path: 'http://localhost:<%= connect.debug.options.port %>/'
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
                    paths: projectDir
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.less'],
                        dest: buildDir,
                        ext: '.css'
                    }
                ]
            },
            build: {
                options: {
                    compress: true
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.less'],
                        dest: buildDir,
                        ext: '.css'
                    }
                ]
            }
        },
        // compass，sass的一个超集，这里配置需要编译的目录和编译配置选项
        compass: {
            debug: {
                options: {
                    sassDir: projectDir + '/styles',
                    cssDir: buildDir + '/styles',
                    imagesDir: projectDir + '/images'
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.scss'],
                        dest: buildDir,
                        ext: '.css'
                    }
                ]
            },
            build: {
                options: {
                    sassDir: projectDir + '/styles',
                    cssDir: buildDir + '/styles',
                    imagesDir: projectDir + '/images',
                    environment: 'production'
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.scss'],
                        dest: buildDir,
                        ext: '.css'
                    }
                ]
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
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.jade'],
                        dest: buildDir,
                        ext: '.html'
                    }
                ]
            },
            build: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.jade'],
                        dest: buildDir,
                        ext: '.html'
                    }
                ]
            }
        },
        // js压缩合并
        uglify: {
            debug: {
                options: {
                    banner:'/* <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */' + "\n",
                    beautify: true, // 是否漂亮格式
                    mangle: false, // 是否短化变量
                    compress: false // 是否压缩格式
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.js'],
                        dest: buildDir,
                        ext: '.dev.js'
                    }
                ]
            },
            build: {
                options: {
                    banner:'/* <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */' + "\n"
                    // 在生产环境下，生成source-map.js文件，有助于线上找出压缩过的JS文件异常行号
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.js'],
                        dest: buildDir,
                        ext: '.min.js'
                    }
                ]
            }
        },
        //css 压缩
        cssmin: {
            debug:{
                options: {
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */' + "\n"
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.css', '**/!*.min.css'],
                        dest: buildDir,
                        ext: '.min.css'
                    }
                ]
            },
            build:{
                options: {
                    banner: '/* My minified css file */'
                },
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.css', '**/!*.min.css'],
                        dest: buildDir,
                        ext: '.min.css'
                    }
                ]
            }
        },
        // 图片优化，只在build为生产环境时用到
        imagemin: {
            debug: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: '{,**/}*.{png,jpg,jpeg,gif}',
                        dest: buildDir
                    }
                ]
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: '{,**/}*.{png,jpg,jpeg,gif}',
                        dest: buildDir
                    }
                ]
            }
        },
        htmlmin: {
            debug: {
                options: {
                    removeComments: true,
                    collapseWhitespace: false
                },
                files: [
                    {
                        expand: true,
                        cwd: buildDir,
                        src: '{,**/}*.html',
                        dest: buildDir
                    }
                ]
            },
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: buildDir,
                        src: '{,***/}*.html',
                        dest: buildDir
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
                        cwd: projectDir,
                        src: ['**/*.{css,png,jpg,jpeg}'],
                        dest: buildDir
                    }
                ]
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: projectDir,
                        src: ['**/*.{css,png,jpg,jpeg}'],
                        dest: buildDir
                    }
                ]
            }
        }
    });

    //FECI Functions

    //clean
    /*
    grunt.registerTask('clean', [
        'clean'
    ]);
    */

    //clone source code
    grunt.registerTask('scm', [
        'git:clone'/*,
        'git:pull'*/
    ]);

    //compile
    grunt.registerTask('comp', [
        'jade:debug',
        'compass:debug',
        //'less:debug',
        //'stylus:debug',
        'compass:debug'
    ]);

    //minimize
    grunt.registerTask('min', [
        'uglify:debug',
        'imagemin:debug',
        'cssmin:debug',
        'htmlmin:debug'
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
        'open',
        'connect:debug'
    ]);

    //default
    grunt.registerTask('default', [
        //'clean',
        //'scm',
        'comp',
        'min',
        //'test',
        //'pack',
        'server'
    ]);
};

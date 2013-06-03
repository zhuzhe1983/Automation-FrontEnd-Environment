'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};


module.exports = function(grunt) {
  // load all grunt tasks
  // 使用macchdep模块来过滤grunt-开头的模块，批量加载任务
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // watch为任务的key，可随便取
    watch: {
      // 需要监听变化的文件，/**/*为grunt里约定的通配符，表示所有子目录，详见http://gruntjs.com/configuring-tasks
      // task为需要运行的任务，当js发生变化时，运行copy:debug任务，把所有文件复制到.tmp目录以供浏览
      scripts: {
        files: ['app/**/*.{js,css,png,jpg,jpeg,webp}'],
        tasks: ['copy:debug']
      },
      // compass任务要监听变化的文件，为app下所有scss文件
      compass: {
        files: ['app/**/*.scss'],
        tasks: ['compass:debug']
      },
      // jade任务要监听变化的文件，为app下所有jade文件
      jade: {
        files: ['app/**/*.jade'],
        tasks: ['jade:debug']
      },
      // 当所有html,css,js,以及图片发生改变时，运行livereload任务自动刷新浏览器
      livereload: {
        files: [
          '{.tmp,app}/**/*.{html,jade}',
          '{.tmp,app}/styles/**/*.css',
          '{.tmp,app}/scripts/**/*.js',
          '{.tmp,app}/images/**/*.{png,jpg,jpeg,webp}'
        ],
        tasks: ['livereload']
      }
    },
    // 开启一个静态服务器，端口为9999，host为0.0.0.0时，其它机器可以通过你的ip:9999访问，如果不希望则使用localhost
    connect: {
      options: {
        port: 9999,
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
    // 从浏览器打开一个地址
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    // 清除目录或者文件
    clean: {
      debug: '.tmp',
      dist: ['dist'],
    },
    // jshint，不解释
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      // all 代表当带或不带参数时，都会执行这个子任务
      all: [
        'app/scripts/**/*.js']
    },
    // compass，sass的一个超集，这里配置需要编译的目录和编译配置选项
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
    // jade文件编译成html，pretty:true代表自动格式化漂亮的html
    jade: {
      debug: {
        options: {
          data: {
            debug: true
          },
          pretty: true
        },
        files: [{
          expand: true, // expand为true,则可以设置以下选项
          cwd: 'app/', // 要操作的目录（不包含）
          src: ['**/*.jade'], // 指定路径
          dest: '.tmp/', // 要生成的目标路径
          ext: '.html' // 要生成的文件后缀
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
    // js压缩合并
    uglify: {
      debug:{
        options: {
          beautify: true, // 是否漂亮格式
          mangle:false, // 是否短化变量
          compress:false, // 是否压缩格式
          sourceMap: 'dist/scripts/source-map.js'
        },
        files: {
          '.tmp/scripts/main.js': [
            'app/scripts/**/*.js'],
        }
      },
      dist: {
      	options:{
          // 在生产环境下，生成source-map.js文件，有助于线上找出压缩过的JS文件异常行号
      		sourceMap: 'dist/scripts/source-map.js'
      	},
        files: {
          'dist/scripts/main.js': [
            'app/scripts/**/*.js'],
        }
      }
    },
    // 图片优化，只在build为生产环境时用到
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
    // 复制文件
    copy: {
      debug: {
        files: [{
          expand: true,
          cwd: 'app',
          src: ['**/*.{css,png,jpg,jpeg}'],
          dest: '.tmp/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'app',
          src: ['**/*.{css,png,jpg,jpeg}'],
          dest: '.dist/'
        }]
      }
    }
  });

  // 注册一个自定义任务，里面包含多个子任务，当运行的是server:dist时，则打开浏览地址并指向build目录
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
      'uglify:debug',
      'open',
      'watch']);
  });

  grunt.registerTask('test', [
    
  ]);

  // grunt build命令时执行以下几个任务，子任务用"："隔开
  grunt.registerTask('build', [
    'clean:dist',
    'clean:dist',
    'compass:dist',
    'jade:dist',
    'imagemin',
    'uglify',
    'copy:dist']);

  // 所有grunt项目就当都注册一个default命令，这样直接运行grunt时，会触发此任务
  grunt.registerTask('default', [
    'server','jshint']);
};

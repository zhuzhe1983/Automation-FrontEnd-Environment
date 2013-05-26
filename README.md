## 项目介绍
这是一个自动化的前端环境，
采用[Grunt](http://gruntjs.com) + [Sass](http://sass-lang.com) + [Compass](http://compass-style.org/) + [Jade](http://jade-lang.com/) 搭建。此环境适合多个前端开发人员协作开发，快速编写HTML与CSS。

## 安装
因为Sass和Compass依赖Ruby环境，所以你首先需要[安装Ruby](http://www.ruby-lang.org/en/downloads/)，安装好以后执行

注意：必须安装1.9.x以上的Ruby版本

```
gem install compass
```
然后从这里[下载NodeJS的安装包](http://nodejs.org/),安装NodeJS.

最后安装Grunt-cli

```
npm install -g grunt-cli
```

这时候你的开发环境依赖就安装好了。不要嫌麻烦，花十几分钟安装好这些环境以后，你的开发将变得更加简单。


然后，下载所有源代码。（可以直接在github里下载或者在本地用git命令）

```
$ git clone git@github.com:AliyunUED/Automation-FrontEnd-Environment.git
```

然后在当前目录下使用NodeJS命令安装所有npm

```
npm install
```

## 运行

上面的全部安装好以后执行

```
grunt
```
这时候你可以看到浏览器将自动打开地址。

## 备注：
[Sass用法指南](http://www.ruanyifeng.com/blog/2012/06/sass.html)

[Compass用法指南](http://www.ruanyifeng.com/blog/2012/11/compass.html)

[Jade模板引擎入门教程](https://github.com/visionmedia/jade/blob/master/Readme_zh-cn.md)

这三个东东不用担心，很快就能学会。学好之后可以让你事半功倍哦！！

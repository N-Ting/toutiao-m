// pPostCSS配置文件
module.exports = {
  // 配置要使用的PostCSS插件
  plugins: {
    // 配置使用autoperfixer插件
    // 作用：生成浏览器css样式规则前缀
    // autoprefixer: {
    //   // autoperfixer插件的配置
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用postcss-pxtorem插件
    // 作用：把px转化为rem
    'postcss-pxtorem': {
      // lib-flexible的rem适配方案：把一行分为10份，每份就是十分之一
      // 所以rootValue应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿是750，所以应该设置为750/10=75
      // 但是Vant建议设置为37.5，为什么？因为Vant是基于375写的
      // 所以必须设置为37.5，唯一的缺点就是使用我们设计稿的尺寸都必须/2
      // 有没有更好的办法
      // 如果是Vant的样式，就按照37.5来转换
      // 如果是我们自己的样式，就按照75来转换
      // 通过查阅文档，我们发现rootValue支持两种类型
      //  数字：固定的数值
      // 函数：可以动态处理返回
      //  postcss-pxtorem处理每个css文件的时候都会来调用这个函数
      // 它会把被处理的css文件相关的信息通过参数传递给该函数
      rootValue({ file }) {
        // console.log(file)
        // 查找file里面是否又vant字符串indexOf()查找到了就返回这个字符串所在的索引,不等于-1就是37.5,否则就是75
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的css属性、
      // *表示所有，所有的属性都转化
      propList: ['*'],
      // 配置不要转换的样式文件资源
      exclude: 'github-markdown'
    }
  }
}

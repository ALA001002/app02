const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const path = require('path')

module.exports = {
  // 将部署应用程序的基本URL
  // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'
  outputDir: 'dist',

  // pages:{ type:Object,Default:undfind }
  /*
构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
的字符串，
注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
*/
  pages: {
    index: {
      //entry for the page
      entry: 'src/main.js',
      //the source template
      template: 'public/index.html',
      //output as dist/index.html
      filename: 'index.html'
    }
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
  },

  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,

  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8080, // 端口号
    disableHostCheck: true
    // proxy: {
    //   '/api': {
    //     target: 'http://api.bigoex.io/',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': '/api'
    //     }
    //   }
    // }
  },

  css: {
    loaderOptions: {
      sass: {
        // prependData: `@import "bulma/sass/grid/_all.sass";` // bulma
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 18.75,
            propList: ['*']
          })
        ]
      }
    }
  },

  // 强制base64图片
  chainWebpack: config => {
    // 修改旧的图片规则
    // const imageRule = config.module.rule('images')
    // imageRule.pre().exclude.add(path.resolve(__dirname, './src/assets/images/base64')).end()
    // config.module
    //   .rule('base64Image')
    //   .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
    //   .pre()
    //   .include
    //   .add(path.resolve(__dirname, './src/assets/images/base64'))
    //   .end()
    //   .use('url-loader')
    //     .loader(require.resolve('url-loader'))
    //     .end()
  }
}

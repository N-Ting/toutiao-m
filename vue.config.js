// module.exports = {
//   devServer: {
//     proxy: {
//       // 将以/app开头的接口，路径为http://toutiao-app.itheima.net/为开头
//       '/app': {
//         target: 'http://toutiao-app.itheima.net/',
//         ws: true,
//         changeOrigin: true,
//         pathRewrite: {
//           // 并且删除/app
//           '^/app': ''
//         }
//       }
//     }
//   }
// }

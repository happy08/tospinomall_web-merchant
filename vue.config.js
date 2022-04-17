const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
    lintOnSave: false, //是否开启 esLint
    productionSourceMap: false, //默认是开启的，关闭后打包的代码易读易线上调式，也可加快打包速度

    //本地/ 测试/shop/ 正式/seller/
    publicPath: process.env.NODE_ENV === "development" ? "/" : process.env.VUE_APP_MODE === "test" ? "/shop/" : process.env.VUE_APP_MODE === "dev" ? "/shop_dev/" : "/seller/", //项目根目录

    devServer: {
        proxy: {
            "/apis": {
                target: "https://tospinomallapi.fyynet.com",
                // target: "http://192.168.2.34:9999",
                //target: "http://192.168.2.70:9999",
                // target: "http://192.168.2.35:9999",
                //target: "http://192.168.2.70:9999",
                // "http://192.168.2.12:9999",
                // target: "http://192.168.2.11:9999",
                // 路径重写
                pathRewrite: {
                    "^/apis": "/"
                },
                secure: false, // 1如果是https接口，需要配置这个参数为true
                changeOrigin: true // 如果接口跨域，需要进行这个参数配置为true
            },
            "/loginApi": {
                target: "https://auth.fyynet.com",
                // target: "http://192.168.2.35:19999",
                // target: "http://192.168.2.70:19999",
                // target: "http://192.168.2.34:9999",
                // 路径重写
                pathRewrite: {
                    "^/loginApi": "/"
                },
                secure: false, // 1如果是https接口，需要配置这个参数为true
                changeOrigin: true // 如果接口跨域，需要进行这个参数配置为true
            }
        }
    },

    configureWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            return {
                plugins: [
                    new CompressionWebpackPlugin({
                        test: /\.js$|\.html$|.\css/, //匹配文件名
                        algorithm: "gzip",
                        threshold: 10240, //对超过10k的数据压缩
                        minRatio: 0.8,
                        deleteOriginalAssets: false //不删除源文件
                    }),
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            compress: {
                                drop_debugger: true,
                                drop_console: true,
                                pure_funcs: ["console.log"] //删除console.log
                            }
                        },
                        sourceMap: false,
                        parallel: true
                    })
                ]
            };
        }
    },
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === "production") {
            // 启动时动态创建一个html：http://localhost:8888/report.html
            // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
            // 生成一个静态html，report.html
            // config.plugin("webpack-report").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin, [
            //     {
            //         analyzerMode: "static"
            //     }
            // ]);

            // 移除prefetch插件 首屏预加载
            config.plugins.delete("prefetch");
            // 移除preload插件 首屏预加载
            config.plugins.delete("preload");
            //压缩代码
            config.optimization.minimize(true);
            // 分割代码
            config.optimization.splitChunks({
                //chunks: "all"
                minSize: 20000,
                maxSize: 1000000,
                cacheGroups: {
                    "element-plus": {
                        test: /[\\/]node_modules[\\/]_?element-plus(.*)/,
                        name: "element-plus",
                        chunks: "all"
                    },
                    echarts: {
                        test: /[\\/]node_modules[\\/]_?echarts(.*)/,
                        name: "echarts",
                        chunks: "all"
                    },
                    "vue3-clipboard": {
                        test: /[\\/]node_modules[\\/](vue3-clipboard)[\\/]/,
                        name: "vue3-clipboard",
                        chunks: "all"
                    },
                    vuedraggable: {
                        test: /[\\/]node_modules[\\/](vuedraggable)[\\/]/,
                        name: "vuedraggable",
                        chunks: "all"
                    },
                    jsbarcode: {
                        test: /[\\/]node_modules[\\/](jsbarcode)[\\/]/,
                        name: "jsbarcode",
                        chunks: "all"
                    },
                    dayjs: {
                        test: /[\\/]node_modules[\\/](dayjs)[\\/]/,
                        name: "dayjs",
                        chunks: "all"
                    }
                }
            });
        }
    }
};

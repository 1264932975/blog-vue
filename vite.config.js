import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue()
    ],
    base: "./",
//配置跨域
    server: {
        open: false,  //启动项目后打开浏览器
        port: 2000,   //端口
        // https: true,
        proxy: {
            '/api': {
                target: 'http://localhost:7000',  //API服务地址
                // target: 'https://00shen.space',  //API服务地址
                changeOrigin: true,             //开启跨域
                // secure: true,
                rewrite: (path) => path.replace(/^\/api/, '/')
            }
        }
    }
})

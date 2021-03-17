## hook的使用

> 使用hooks可以使得代码的可读性，可维护性更高

1. 使用hook将相关代码关联在一起

``` javascript
    export default {
        methods: {
            resizeChart() {}  
        },
        mounted() {
            window.addEventListener('resize', this.resizeChart);
            this.$once('hook:beforeDestroy', () = {
                window.removeEventListener('resize', this.resizeChart) 
            });
        }
    }
```

2. 使用hook监听子组件的生命周期函数

``` html
    <el-form @hook:beforeDestroy="handleFormDestroy"></el-form>
```


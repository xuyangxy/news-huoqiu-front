<template>
    <div style="line-height: 20px">
        <script id="UEeditor" type="text/plain"></script>
    </div>
</template>
<script>
    import '../../../static/ueditor/ueditor.config.js'
    import '../../../static/ueditor/ueditor.all.min.js'
    import '../../../static/ueditor/ueditor.parse.min.js'
    import '../../../static/ueditor/lang/zh-cn/zh-cn.js'

    export default {
        name: 'UE',
        data() {
            return {
                editor: null,
                isLoadSuc : false
            }
        },
        props: {
            defaultMsg: {
                type: String
            },
            config: {
                type: Object
            }
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor('UEeditor', this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                _this.isLoadSuc = true;
                console.log("44", _this.defaultMsg);
                _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });
        },
        methods: {
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            },
            setUEContent(msg) {
                console.log("11");
                if (this.isLoadSuc){
                    console.log("22");
                    this.editor.setContent(msg);
                } else {
                    console.log("33");
                    this.defaultMsg = msg;
                }
                console.log(msg);
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>

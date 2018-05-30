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
                isLoadSuc : false,
                defaultMsg : ""
            }
        },
        props: {
            config: {
                type: Object
            }
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor('UEeditor', this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                _this.isLoadSuc = true;
                _this.editor.setContent(_this.defaultMsg || ''); // 确保UE加载完成后，放入内容。
            });
        },
        methods: {
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            },
            setUEContent(msg) {
                this.defaultMsg = msg;
                if (this.isLoadSuc){
                    this.editor.setContent(msg);
                } else {
                    this.defaultMsg = msg;
                }
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>

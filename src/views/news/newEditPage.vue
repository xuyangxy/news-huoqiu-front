<template>
    <el-form ref="form" :model="form" :rules="formRules" label-width="100px"
             style="margin:10px;width:90%;min-width:600px;">
        <el-form-item label="一级分类" prop="category">
            <el-select v-model="form.category" @change="categoryChange" placeholder="请选择一级分类" style="width: 100%">
                <el-option v-for="item in category"
                           :label="item.name"
                           :value="item.id + ''">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="二级分类" prop="kind">
            <el-select v-model="form.kind" placeholder="请选择二级分类" style="width: 100%">
                <el-option v-for="item in kind"
                           :label="item.name"
                           :value="item.id + ''">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="板块" prop="modules">
            <el-select v-model="form.modules" placeholder="请选择板块" style="width: 100%">
                <el-option v-for="item in modules"
                           :label="item.name"
                           :value="item.id + ''">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="是否置顶" prop="top">
            <el-select v-model="form.top" placeholder="请选择是否置顶" style="width: 100%">
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请填写标题"></el-input>
        </el-form-item>


        <el-form-item label="副标题" prop="subtitle">
            <el-input v-model="form.subtitle" placeholder="请填写副标题"></el-input>
        </el-form-item>




        <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请填写联系电话"></el-input>
        </el-form-item>

        <el-form-item label="新闻来源" prop="source">
            <el-input v-model="form.source" placeholder="如：腾讯新闻..."></el-input>
        </el-form-item>


        <el-form-item label="封面图片">
            <el-upload
                    ref="imgRef"
                    :auto-upload="false"
                    :limit="1"
                    :file-list="imgList"
                    action=""
                    list-type="picture-card">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

        </el-form-item>


        <el-form-item label="文章内容">
            <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE>
        </el-form-item>

        <el-form-item label="发稿人姓名" prop="author">
            <el-input v-model="form.author"></el-input>
        </el-form-item>


        <el-form-item label="审核状态" prop="checkStatus" v-if="form.role <= 1">
            <el-select v-model="form.checkStatus" placeholder="请选择审核状态" style="width: 100%">
                <el-option label="未审核" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="2"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="意见建议" prop="desc">
            <el-input type="textarea" v-model="form.desc" placeholder="请填写意见建议"></el-input>
        </el-form-item>


        <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="formLoading">确认修改</el-button>
            <el-button @click="back">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import UE from './ueditor.vue';
    import NProgress from 'nprogress'
    import {updateNews, getCategory, getKindList, getModules, getNews} from '../../api/api';

    export default {
        components: {UE},
        data() {
            return {
                imgList:[],
                dialogVisible: false,
                dialogImageUrl: '',
                formLoading: false,
                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 350
                },
                form: {
                    author: '匿名',
                    category: '',
                    kind: '',
                    modules: '',
                    top: '',
                    title: '',
                    subtitle: '',
                    phone: '',
                    source: '',
                    checkStatus:'',
                    desc:''
                },
                category: [],
                kind: [],
                modules: [],
                formRules: {
                    author: [
                        {required: true, message: '请输入作者', trigger: 'blur'}
                    ],
                    // category: [
                    //     {required: true, message: '请选择一级标题', trigger: 'change'}
                    // ],
                    // kind: [
                    //     {required: true, message: '请选择二级标题', trigger: 'change'}
                    // ],
                    // modules: [
                    //     {required: true, message: '请选择模块', trigger: 'change'}
                    // ],
                    top: [
                        {required: true, message: '请选择是否置顶', trigger: 'change'}
                    ],
                    title: [
                        {required: true, message: '请填写标题', trigger: 'blur'}
                    ],
                    // phone: [
                    //     {required: true, message: '请输入联系电话', trigger: 'blur'},
                    //     {min: 7, max: 11, message: '长度在 7 到 11 个字符', trigger: 'blur'}
                    // ]
                }
            }
        },
        methods: {
            back(){
                if (window.history.length <= 1) {
                    this.$router.push({path:'/'})
                    return false
                } else {
                    this.$router.go(-1)
                }
            },
            putImgParam(formData, param){
                Object.keys(param).forEach(key => {
                    let val = param[key];
                    formData.append(key, val === 'null' ? '': val);
                })
            },
            onSubmit() {
                const files = this.$refs.imgRef.uploadFiles;
                const content = this.$refs.ue.getUEContent();

                this.$refs.form.validate(valid => {
                    if (valid) {
                        if (!content || !content.trim()){
                            this.$message.warning(`请输入新闻内容！`);
                            return;
                        }

                        if (!this.form.kind && !this.form.modules) {
                            this.$message.warning(`分类和板块不能同时为空，请选择！`);
                            return;
                        }

                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.formLoading = true;
                            let param = new FormData();
                            if(files[0]) {
                                param.append('file', files[0].raw, files[0].name);
                            }
                            param.append('editorValue', content);
                            this.putImgParam(param, this.form);
                            updateNews(param).then((res) => {
                                this.formLoading = false;
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                                this.$refs.form.resetFields();
                                this.$refs.ue.setUEContent('');
                                this.back();
                            });
                        });
                    } else {
                        return false;
                    }
                })
            },
            categoryChange(categoryId, kind) {
                this.form.kind = '';
                if (!categoryId) {
                    return;
                }
                getKindList({categoryId: categoryId}).then((res) => {
                    this.kind = res.data;
                    if (kind) {
                        this.form.kind = kind;
                    }
                });
            },
            modulesChange() {
                getModules().then(res => {
                    this.modules = res.data;
                });
            },
            setVal(val){
                return (val && val !== "null") ? val + "" : "";
            }
        },
        mounted() {
            NProgress.start();
            getCategory().then((res) => {
                this.category = res.data;
            });
            this.modulesChange();

            let newsId = this.$route.params.newsId;

            setTimeout(() => {
                getNews({id: newsId}).then((res) => {
                    let data = res.data.data;
                    if (data) {
                        data.kind = this.setVal(data.kindId);
                        data.modules = this.setVal(data.modulesId);
                        data.category = this.setVal(data.categoryId);
                        this.categoryChange(data.categoryId, data.kind);
                        data.top = data.top + "";
                        data.checkStatus = data.checkStatus + "";
                        data.newsId = data.id;
                        data.subtitle = this.setVal(data.subtitle);
                        if (data.picUrl) {
                            this.imgList = [{name:'fengmian', url: data.picUrl}];
                        }
                        this.form = data;
                        this.$refs.ue.setUEContent(data.content);
                    }
                    NProgress.done();
                });
            },100);
        }
    };
</script>


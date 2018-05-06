<template>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="70px"
             class="demo-ruleForm login-container">
        <h3 class="title">用户注册</h3>
        <el-form-item prop="email" label="邮箱">
            <el-input type="text" v-model="ruleForm2.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
            <el-input type="number" v-model="ruleForm2.phone" auto-complete="off" placeholder="输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
            <el-input type="text" v-model="ruleForm2.code" auto-complete="off" placeholder="验证码" style="width: 60%"></el-input>
            <img style="float: right" :src="codeImgSrc" @click="getCodeImage"/>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:60%;" @click.native.prevent="handleSubmit2" :loading="logining">确认注册
            </el-button>
            <el-button  style="width:30%;" @click="$router.push({path: '/login'})">去登录
            </el-button>
            <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script>

    import {registeredWithPhone, registeredWithMail} from '../../api/api';
    const schema = require('async-validator');

    export default {
        data() {
            return {
                codeImgSrc: 'hqms/getPicCode',
                logining: false,
                ruleForm2: {
                    email: '',
                    code: '',
                    password: '',
                    phone: ''
                },
                rules2: {
                    email: [
                        {required: true, message: '请输入正确邮箱格式', pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            getCodeImage() {
                this.codeImgSrc = "/hqms/getPicCode?flag="+Math.random();
            },
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2() {
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        //NProgress.start();
                        let param = Object.assign({}, this.ruleForm2);
                        registeredWithMail(param).then(datas => {
                            this.logining = false;
                            //NProgress.done();
                            let {msg, code, data} = datas.data;
                            if (code !== 200) {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                this.$alert('恭喜你，注册成功，通过邮箱或者手机号都可以登录该系统。是否跳转到登录页面 ？', '注册提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        if (action === 'confirm') {
                                            this.$router.push({path: '/login'});
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>

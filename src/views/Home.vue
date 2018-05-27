<template>
    <el-row class="container">
        <el-col :span="24" class="header hide">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="10">
                <div class="tools" @click.prevent="collapse">
                    <i class="fa fa-align-justify"></i>
                </div>
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img
                            :src="this.sysUserAvatar"/> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="userEdit">个人信息</el-dropdown-item>
                        <el-dropdown-item @click.native="handleEdit">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo hide" @open="handleopen"
                         @close="handleclose" @select="handleselect"
                         background-color="#545c64"
                         text-color="#fff"
                         active-text-color="#ffd04b"
                         unique-opened router v-show="!collapsed">
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden && !(item.auth && item.auth < sysUserAuth)">
                        <el-submenu :index="index+''" v-if="!item.leaf">
                            <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                          v-if="!child.hidden">{{child.name}}
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i
                                :class="item.iconCls"></i>{{item.children[0].name}}
                        </el-menu-item>
                    </template>
                </el-menu>
                <!--导航菜单-折叠后-->
                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden && !(item.auth && item.auth < sysUserAuth)" class="el-submenu item">
                        <template v-if="!item.leaf">
                            <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)"
                                 @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                            <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                                @mouseout="showMenu(index,false)">
                                <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                                    class="el-menu-item" style="padding-left: 40px;"
                                    :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">
                                    {{child.name}}
                                </li>
                            </ul>
                        </template>
                        <template v-else>
                            <li class="el-submenu">
                                <div class="el-submenu__title el-menu-item"
                                     style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                                     :class="$route.path==item.children[0].path?'is-active':''"
                                     @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
                            </li>
                        </template>
                    </li>
                </ul>
            </aside>
<section class="content-container">
    <div class="grid-content bg-purple-light">
        <!--<el-col :span="24" class="breadcrumb-container">-->
            <!--<strong class="title">{{$route.name}}</strong>-->
            <!--<el-breadcrumb separator="/" class="breadcrumb-inner">-->
                <!--<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">-->
                    <!--{{ item.name }}-->
                <!--</el-breadcrumb-item>-->
            <!--</el-breadcrumb>-->
        <!--</el-col>-->
        <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </el-col>
    </div>


    <!--编辑界面-->
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" readonly></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="editForm.password" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="password2">
                <el-input type="password" v-model="editForm.password2"  placeholder="请再次输入新密码"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
    </el-dialog>



    <!--编辑界面-->
    <el-dialog title="编辑个人信息" v-model="userEditFormVisible" :close-on-click-modal="false">
        <el-form :model="userEditForm" label-width="120px" :rules="userEditFormRules" ref="userEditForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userEditForm.username" placeholder="请填写用户名"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="userEditForm.name" placeholder="请填写姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="userEditForm.phone" placeholder="请填写手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="userEditForm.email" placeholder="请填写邮箱"></el-input>
            </el-form-item>
            <el-form-item label="个人简介" prop="intro">
                <el-input type="textarea" v-model="userEditForm.intro" placeholder="请填写个人简介"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="userEditFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="userEditSubmit" :loading="userEditLoading">确认修改</el-button>
        </div>
    </el-dialog>

</section>
</el-col>
</el-row>
</template>

<script>
    import { requestLogOut, editPwd, userInfo, editUser} from '../api/api';

    export default {
        data() {
            return {
                editFormVisible: false,//编辑界面是否显示
                userEditFormVisible: false,//编辑界面是否显示
                sysName: '霍邱后台管理系统',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                sysUserAuth: '',
                user: {},
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                editFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ],
                    password2: [
                        { required: true, message: '请再次输入密码', trigger: 'blur' }
                    ]
                },
                userEditFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入正确的手机号', pattern: /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})|(19[0-9]{9})$/, trigger: 'blur' }
                    ],
                    email: [
                        {required: true, message: '请输入正确邮箱格式', pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    username : '',
                    password: '',
                    password2: ''
                },
                editLoading: false,
                userEditLoading: false,

                userEditForm:{
                    intro:'',
                    email:'',
                    phone:'',
                    name:'',
                    username: ''
                },
                userObj : null
            }
        },
        methods: {
            userEditSubmit(){
                this.$refs.userEditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('您确认修改个人信息吗？', '提示', {}).then(() => {
                            this.userEditLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.userEditForm);
                            para.id = this.userObj.id;
                            editUser(para).then((res) => {
                                this.userEditLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.userEditFormVisible = false;
                                this.getUserInfo();

                            });
                        });
                    }
                });
            },
            userEdit(){
                this.userEditFormVisible = true;
                this.userEditForm = Object.assign({}, this.userObj);
            },
            getUserInfo(){
                userInfo().then(res => {
                    if (res.status === 200 && res.data.code === 200) {
                        this.userObj = res.data.data;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'error'
                        });
                    }

                });
            },
            //显示编辑界面
            handleEdit: function () {
                this.editFormVisible = true;
                this.editForm.password = '';
                this.editForm.password2 = '';
            },
            editSubmit(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        let p1 = this.editForm.password.trim();
                        let p2 = this.editForm.password2.trim();
                        if (!p1 || !p2 || p1 !== p2) {
                            this.$message({
                                message: '两次密码输入不一致吗，请检查！',
                                type: 'error'
                            });
                            return;
                        }

                        this.$confirm('您确认修改密码吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.id = this.user.id;
                            editPwd(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.editFormVisible = false;
                            });
                        });
                    }
                });
            },
            onSubmit() {
                console.log('submit!');
            },
            handleopen() {
                //console.log('handleopen');
            },
            handleclose() {
                //console.log('handleclose');
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function () {
                var _this = this;
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    requestLogOut().then(resp => {
                        localStorage.removeItem('user');
                        _this.$router.push('/login');
                    });
                }).catch(() => {

                });


            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        },
        mounted() {
            var user = localStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                this.user = user;
                this.sysUserName = user.username || '';
                this.editForm.username = user.username || '';
                this.sysUserAuth = user.roleId || '';
                this.sysUserAvatar = user.avatar || 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png';
            }
            this.getUserInfo();

        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

    .el-submenu .el-menu-item{
        min-width: 0;
    }

    .hide{
        display: none;
    }

    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
        .header {
            height: 60px;
            line-height: 60px;
            background: $color-primary;
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 10px 0px 10px 10px;
                        float: right;
                    }
                }
            }
            .logo {
                //width:230px;
                height: 60px;
                font-size: 22px;
                padding-left: 20px;
                padding-right: 20px;
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
            }
            .logo-collapse-width {
                width: 60px
            }
            .tools {
                padding: 0px 23px;
                width: 14px;
                height: 60px;
                line-height: 60px;
                cursor: pointer;
            }
        }
        .main {
            display: flex;
            // background: #324057;
            position: absolute;
            top: 0px;
            bottom: 0px;
            overflow: hidden;
            aside {
                flex: 0 0 230px;
                width: 230px;
                // position: absolute;
                // top: 0px;
                // bottom: 0px;
                .el-menu {
                    height: 100%;
                }
                .collapsed {
                    width: 60px;
                    .item {
                        position: relative;
                    }
                    .submenu {
                        position: absolute;
                        top: 0px;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }

                }
            }
            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }
            .menu-expanded {
                flex: 0 0 0;
                width: 0px;
                .el-menu {
                    width: 100% !important;
                }
                .el-submenu .el-menu-item {
                    min-width: 0px !important;
                }
            }
            .content-container {
                // background: #f1f2f7;
                flex: 1;
                // position: absolute;
                // right: 0px;
                // top: 0px;
                // bottom: 0px;
                // left: 230px;
                overflow-y: scroll;
                padding: 20px;
                .content-wrapper {
                    background-color: #fff;
                    box-sizing: border-box;
                }
            }
        }
    }
</style>

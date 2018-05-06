<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="菜单名称" @change="selectMenu"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="selectMenu">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="infoList" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="name" show-overflow-tooltip label="二级菜单名称" sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" :formatter="formatDate"  sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getCategoryKindList, editMenu} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                allList: [],
                infoList: [],
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: ''
                },

                infoObj: ''
            }
        },
        methods: {
            selectMenu(){
                let filter = this.filters.name;
                if (filter && filter.trim()) {
                    this.infoList = this.allList.filter(info => {
                        return info.name.includes(filter);
                    });
                } else {
                    [...this.infoList] = this.allList;
                }
            },
            formatDate(row, column) {
                return row.createDate ? util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getInfoList();
            },
            //获取用户列表
            getInfoList() {
                let para = {
                    pageNumber: this.page,
                    name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();

                getCategoryKindList(para).then((res) => {
                    console.log(2,para, res);
                    this.infoList = res.data.data.list;
                    this.infoObj = res.data.data;
                    [...this.allList] = this.infoList;
                    this.listLoading = false;
                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.type = this.infoObj.type;
                            para.role = this.infoObj.role;
                            console.log(para);
                            editMenu(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getInfoList();
                            });
                        });
                    }
                });
            }
        },
        mounted() {
            this.getInfoList();
        }
    }
</script>


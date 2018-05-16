<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">

                <el-form-item>
                    <el-select v-model="filters.category" clearable @change="categoryChange" placeholder="请选择一级分类">
                        <el-option v-for="item in category"
                                   :label="item.name"
                                   :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-select v-model="filters.kind" clearable @change="getInfoList" placeholder="请选择二级分类">
                        <el-option v-for="item in kind"
                                   :label="item.name"
                                   :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="getInfoList">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="infoList" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="id"  label="ID" width="80" sortable>
            </el-table-column>
            <el-table-column prop="title" label="标题" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="checkStatus" label="审核状态" width="150"  :formatter="formatDate"   sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" width="200" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">回复</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col>



        <!--编辑界面-->
        <el-dialog title="编辑回复" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                <el-form-item label="问题" prop="content">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="editForm.content.replace('<p><br/><br/><hr/><br/>', '\n').replace(/<[^>]+>/g,'')" readonly></el-input>
                </el-form-item>

                <el-form-item label="审核状态" prop="roleId">
                    <el-select v-model="editForm.checkStatus" placeholder="请选择是否通过" style="width: 100%">
                        <el-option  label="未通过" value="0"></el-option>
                        <el-option  label="通过" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="回复" prop="rcontent">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" v-model="editForm.rcontent"></el-input>
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
    import { feedbackList, getFeedbackDetailsById, editFeedback,getCategory, getKindList} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    category: '',
                    kind: ''
                },
                category:[],
                kind:[],

                allList: [],
                infoList: [],
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    // name: [
                    //     { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    // ],
                    // url: [
                    //     { required: true, message: '请输入网址', trigger: 'blur' }
                    // ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    checkStatus: 0,
                    content: '',
                    rcontent: ''
                },

                infoObj: '',
                total: 0,
                page: 1
            }
        },
        methods: {
            categoryChange(categoryId) {
                this.filters.kind = '';
                getKindList({categoryId: categoryId}).then((res) => {
                    this.kind = res.data;
                });
            },
            formatDate(row, column) {
                return row.checkStatus === 0 ? "未通过": row.checkStatus === 1 ? "通过" : "未知";
            },
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
            handleCurrentChange(val) {
                this.page = val;
                this.getInfoList();
            },
            //获取用户列表
            getInfoList() {
                let para = {
                    pageNumber: this.page,
                    kind: this.filters.kind ? this.filters.kind : null,
                };
                this.listLoading = true;
                //NProgress.start();

                feedbackList(para).then((res) => {
                    this.total = res.data.data.total;
                    this.infoList = res.data.data.newsList;
                    this.infoObj = res.data.data;
                    [...this.allList] = this.infoList;
                    this.listLoading = false;
                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {

                getFeedbackDetailsById({id: row.id}).then(res => {
                    if (res.data.data) {
                        let st = res.data.data.checkStatus;
                        res.data.data.checkStatus = st + '';
                        this.editForm = res.data.data;
                        this.editFormVisible = true;
                    } else {
                        this.$message({
                            message: '查看留言信息失败！',
                            type: 'error'
                        });
                    }

                });

            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.content = para.rcontent;
                            editFeedback(para).then((res) => {
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


            getCategory().then(res => {
                this.category = res.data;
            });

        }
    }
</script>


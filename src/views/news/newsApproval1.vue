<template>
    <section>
        <!--工具条-->
        <news_filter></news_filter>

        <!--列表-->
        <el-table :data="newsList" highlight-current-row v-loading="listLoading"  style="width: 100%;">
            <el-table-column prop="title" show-overflow-tooltip label="新闻名称" sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="投稿时间" width="180"  sortable>
            </el-table-column>
            <el-table-column prop="kind" label="所属分类" width="150" sortable>
            </el-table-column>
            <el-table-column prop="modules" label="板块" width="180" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>
</template>

<script>
    import { getUncheckNewsList, delNews, getModules, getKindList, getCategory} from '../../api/api';
    import news_filter from './components/news_filter.vue';

    export default {
        components: {news_filter},
        data() {
            return {
                filters: {
                    name: '',
                    category: '',
                    kind: '',
                    modules: ''
                },
                newsList: [],
                total: 0,
                page: 1,
                listLoading: false,
                modules:[],
                category:[],
                kind:[],


            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getNews();
            },
            //获取用户列表
            getNews(filter) {
                let para = {
                    pageNumber: this.page,
                    name: this.filters.name,
                    kind: filter && filter.kind ?  filter.kind : null,
                    modules: filter && filter.modules ?  filter.modules : null
                };
                this.listLoading = true;
                //NProgress.start();

                getUncheckNewsList(para).then((res) => {
                    this.total = res.data.data.total;
                    this.newsList = res.data.data.newsList;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该新闻吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { id: row.id };
                    delNews(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNews();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (row) {
               this.$router.push({ path: `/newEditPage/${row.id}` });

            },
            categoryChange(categoryId) {
                this.filters.kind = '';
                getKindList({categoryId: categoryId}).then((res) => {
                    this.kind = res.data;
                });
            },

        },
        mounted() {
            this.getNews();


            getModules().then(res => {
                this.modules = res.data;
            });

            getCategory().then((res) => {
                this.category = res.data;
            });


        }
    }

</script>

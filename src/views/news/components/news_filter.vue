<template>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="filters.category" clearable @change="categoryChange" placeholder="请选择一级分类">
                        <el-option v-for="item in category"
                                   :label="item.name"
                                   :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-select v-model="filters.kind" clearable @change="filterChange" placeholder="请选择二级分类">
                        <el-option v-for="item in kind"
                                   :label="item.name"
                                   :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-select v-model="filters.modules" clearable @change="filterChange"  placeholder="请选择板块">
                        <el-option v-for="item in modules"
                                   :label="item.name"
                                   :value="item.id + ''">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="filterChange">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
</template>

<script>
    import {getModules, getKindList, getCategory} from '../../../api/api';

    export default {
        data() {
            return {
                filters: {
                    category: '',
                    kind: '',
                    modules: ''
                },
                modules:[],
                category:[],
                kind:[]
            }
        },
        methods: {
            categoryChange(categoryId) {
                this.filters.kind = '';
                getKindList({categoryId: categoryId}).then((res) => {
                    this.kind = res.data;
                });
            },
            filterChange(){
                this.$parent.getNews(this.filters);
            }

        },
        mounted() {
            getModules().then(res => {
                this.modules = res.data;
            });

            getCategory().then(res => {
                this.category = res.data;
            });

        }
    }

</script>

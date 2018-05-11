import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import News1 from './views/news/newsApproval1.vue'
import News2 from './views/news/newsApproval2.vue'
import News3 from './views/news/newsApproval3.vue'
import Menu from './views/news/menuManage.vue'
import Mondul from './views/news/mondulManage.vue'
import Web from './views/news/websiteManage.vue'
import NewsAdd from './views/news/newAdd.vue'
import NewEditPage from './views/news/newEditPage.vue'
import Regist from './views/news/registPage.vue'
import UserManager from './views/news/userManager.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/regist',
        component: Regist,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '新闻审核',
        iconCls: 'fa fa-newspaper-o',//图标样式class
        children: [
            { path: '/newsApproval1', component: News1, name: '未审核的新闻'},
            { path: '/newsApproval2', component: News2, name: '审核通过的新闻' },
            { path: '/newsApproval3', component: News3, name: '审核未通过的新闻'},
            { path: '/newEditPage/:newsId', component: NewEditPage, name: '新闻编辑', hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-list-alt',
        leaf: true,//只有一个节点
        auth: 1,
        children: [
            { path: '/menu', component: Menu, name: '菜单维护'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-sitemap',
        leaf: true,//只有一个节点
        auth: 1,
        children: [
            { path: '/mondul', component: Mondul, name: '模块维护'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-internet-explorer',
        leaf: true,//只有一个节点
        auth: 1,
        children: [
            { path: '/web', component: Web, name: '网址维护' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-edit',
        leaf: true,//只有一个节点
        children: [
            { path: '/newsAdd', component: NewsAdd, name: '新闻投稿'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-circle',
        leaf: true,//只有一个节点
        auth: 1,
        children: [
            { path: '/userManager', component: UserManager, name: '用户管理'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;


/**
 *
 * let routes = [
 {
     path: '/login',
     component: Login,
     name: '',
     hidden: true
 },
 {
     path: '/404',
     component: NotFound,
     name: '',
     hidden: true
 },
 //{ path: '/main', component: Main },
 {
     path: '/',
     component: Home,
     name: '导航一',
     iconCls: 'fa el-icon-message',//图标样式class
     children: [
         { path: '/main', component: Main, name: '主页', hidden: true },
         { path: '/table', component: Table, name: 'Table' },
         { path: '/form', component: Form, name: 'Form' },
         { path: '/user', component: user, name: '列表' },
     ]
 },
 {
     path: '/',
     component: Home,
     name: '导航二',
     iconCls: 'fa fa-id-card-o',
     children: [
         { path: '/page4', component: Page4, name: '页面4' },
         { path: '/page5', component: Page5, name: '页面5' }
     ]
 },
 {
     path: '/',
     component: Home,
     name: '',
     iconCls: 'fa fa-address-card',
     leaf: true,//只有一个节点
     children: [
         { path: '/page6', component: Page6, name: '导航三' }
     ]
 },
 {
     path: '/',
     component: Home,
     name: 'Charts',
     iconCls: 'fa fa-bar-chart',
     children: [
         { path: '/echarts', component: echarts, name: 'echarts' }
     ]
 },
 {
     path: '*',
     hidden: true,
     redirect: { path: '/404' }
 }
 ];
 **/

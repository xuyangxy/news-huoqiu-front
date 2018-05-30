import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import {getSessionUser} from './api/api';


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
});

const  localUser = {
    "id": 1,
    "username": "huoqiuzhongxin",
    "name": "管理员",
    "phone": "18712341234",
    "email": "admin@huoqiu.com",
    "password": "CAE6704A442B9797040F573AC03B41A3",
    "salt": 4441,
    "roleId": -1,
    "picUrl": "/images/user.jpg",
    "intro": "柴静，女，出生于山西临汾，毕业于中国传媒大学，记者、主持人。",
    "creareDate": 1521615603000
};




router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        localStorage.removeItem('user');
    } else {
        localStorage.setItem('user', JSON.stringify(localUser));
    }
    // let user = JSON.parse(localStorage.getItem('user'));
    //
    // if (user && user.roleId > 1 && pathAuth.includes(to.path)) {
    //     next({path: '/'});
    // } else {
    //     if (!user && to.path != '/login' && to.path != '/regist') {
    //         next({path: '/login'})
    //     } else {
    //         next()
    //     }
    // }


//  if (to.path != '/login' && to.path != '/regist') {
//      getSessionUser().then(res => {
//          if (!res.data.data) {
//              localStorage.removeItem('user');
//              next({path: '/login'});
//          } else {
//              if (!localStorage.getItem('user')) {
//                  localStorage.setItem('user', JSON.stringify(res.data.data));
//              }
//
//          }
//      });
//  }
});
//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')


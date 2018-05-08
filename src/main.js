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

const pathAuth = ['/menu', '/mondul', '/web'];
router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        localStorage.removeItem('user');
    }
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.roleId !== 1 && pathAuth.includes(to.path)) {
        next({path: '/'});
    } else {
        if (!user && to.path != '/login' && to.path != '/regist') {
            next({path: '/login'})
        } else {
            next()
        }
    }

    if (to.path != '/login' && to.path != '/regist') {
        getSessionUser().then(res => {
            if (!res.data.data) {
                localStorage.removeItem('user');
                next({path: '/login'});
            }
        });
    }
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


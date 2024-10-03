import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import SigninPage from '../components/SigninPage.vue';
import RandevuPage from '../components/RandevuPage.vue';
import RandevuDate from '../components/RandevuDate.vue';
import HomePage from '@/components/HomePage.vue';
import RandevuEdit from '@/components/RandevuEdit.vue';
import AdminPage from '@/components/AdminPage.vue';

const routes = [
  { path: '/signup', component: SigninPage },
  { path: '/login', component: LoginPage },
  { path: '/home', component: HomePage },
  { 
    path: '/randevu', 
    name: 'RandevuPage',  
    component: RandevuPage, 
    beforeEnter: (to, from, next) => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        next('/login');
      } else {
        next();
      }
    }
  },
  { 
    path: '/randevu/tarih/:kuaforId',
    name: 'RandevuDate',
    component: RandevuDate,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        next('/login');
      } else {
        next();
      }
    },
    props: true
  },
  { 
    path: '/randevularim',  
    name: 'RandevuEdit',
    component: RandevuEdit,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        next('/login');
      } else {
        next();
      }
    }
  },
  { 
    path: '/admin-panel',
    name: 'AdminPage',
    component: AdminPage,
    beforeEnter: (to, from, next) => {
      const username = sessionStorage.getItem('username');
      const password = sessionStorage.getItem('password');
  
      
      if (username === '1.admin' && password === 'admin123') {
        next();
      } else {
        next('/home'); 
      }
    }
  }
  ,
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
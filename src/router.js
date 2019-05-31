import Vue from 'vue'
import Router from 'vue-router'
import Products from './components/Products'
import ShoppingCart from './components/ShoppingCart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Products
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/shopping-cart',
      name: 'shopping-cart',
      component: ShoppingCart
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

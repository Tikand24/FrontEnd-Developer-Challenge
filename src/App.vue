<template>
  <v-app>
    <navigation></navigation>
    <v-content  fluid fill-height class="grey lighten-4">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from './components/layouts/Nav';
import Categories from './assets/categories.json';
import Products from './assets/products.json';

export default {
  name: 'App',
  components: {
    Navigation
  },
  data () {
    return {
      //
    }
  }
}
</script>

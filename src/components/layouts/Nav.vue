<template >
  <div>
    <v-navigation-drawer fixed clipped class="grey lighten-4" app v-model="drawer">
      <v-list dense class="grey lighten-4">
        <v-list-group v-for="category in categories" :key="category.id">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>{{ category.name }}</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-group
            no-action
            sub-group
            value="true"
            v-for="level in category.sublevels"
            :key="level.id"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title v-on:click="clickCategory(level)">{{level.name}}</v-list-tile-title>
            </v-list-tile>
            </template>
            <v-list-group
              no-action
              sub-group
              value="true" v-for="sublevel in level.sublevels" :key="sublevel.id"
            >
            <template  v-slot:activator>
              <v-list-tile>
                <v-list-tile-title  v-on:click="clickCategorySublevel(level,sublevel)">{{sublevel.name}}</v-list-tile-title>
              </v-list-tile>
            </template>
              <v-list-tile v-for="sublevelsublevel in sublevel.sublevels" :key="sublevelsublevel.id">
                <v-list-tile-title  v-on:click="clickCategorySublevelSublevel(level,sublevel,sublevelsublevel)">{{sublevelsublevel.name}}</v-list-tile-title>
              </v-list-tile>  
            </v-list-group>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="amber" app clipped-left>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5" v-on:click="goHome()">
        El Baraton
      </span>
      <template v-slot:extension>
        <v-autocomplete
        solo-inverted flat v-model="productoBuscado" :items="productos" :label="labelInputBuscarProducto" prepend-icon="search" v-bind:class="alertaBuscar ? 'hidden-lg-and-up inputsearch':'hidden-lg-and-up'"      
        item-text="name"
        :return-object="true"
        >
        </v-autocomplete>
      </template>
      <v-autocomplete
      solo-inverted flat v-model="productoBuscado" :items="productos" :label="labelInputBuscarProducto" prepend-icon="search" v-bind:class="alertaBuscar ? 'hidden-md-and-down inputsearch':'hidden-md-and-down'"      
      item-text="name"
      :return-object="true"
      >
      </v-autocomplete>
      <v-spacer></v-spacer>
      <v-badge left color="pink accent-3">
      <template v-slot:badge >
        <span>{{numProductsCarroCompras }}</span>
      </template>
      <v-icon
        large    v-on:click="goShoppingCart()"     
      >
        shopping_cart
      </v-icon>
    </v-badge>
    </v-toolbar>
  </div>
</template>

<style>
#keep main .container {
  height: 660px;
}

.navigation-drawer__border {
  display: none;
}

.text {
  font-weight: 400;
}
.inputsearch {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
}


@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>

<script>
import Categories from "../../assets/categories.json";
import Products from "../../assets/products.json";
import { mapGetters, mapState } from "vuex";
import { CATEGORY_SELECTED_MENU,PRODUCT_SELECTED_SEARCH } from '../../store';

console.log(Categories.categories);

export default {
  name: "Navigation",
  data() {
    return {
      drawer: null,
      numProductsCarroCompras:0,
      productos: Products.products,
      labelInputBuscarProducto:'Buscar',
      alertaBuscar:false,
      productoBuscado:{},
      categories: [
        {
          sublevels: [
            {
              sublevels: [{}]
            }
          ]
        }
      ]
    };
  },
  watch: {
    "$store.state.itemAddShopping"(val) {
      if (val) {
        if (val.add) {
          this.updatedNumShoppingList();
        }
      }
    },
      productoBuscado (val){
        this.$router.push('/products');
        this.$store.commit(PRODUCT_SELECTED_SEARCH, {product:val});
      }
  },
  methods: {
    goHome(){
      this.$router.push('/')
    },
    clickCategory(level){
      if(!level.sublevels){
        this.alertaBuscar=true;
        this.labelInputBuscarProducto='Buscar producto en la categoria '+level.name;
        this.productos = Products.products;  
        const result = this.productos.filter(function(product) {
          return product.sublevel_id == level.id;
        });
        this.productos = result;
        setTimeout(() => (this.alertaBuscar = false), 1000)
      }
      this.$store.commit(CATEGORY_SELECTED_MENU, {id: level.id, category: level.name});
    },
    clickCategorySublevel(level,sublevel){
      if(!sublevel.sublevels){        
        this.alertaBuscar=true;
        this.labelInputBuscarProducto='Buscar producto en la categoria '+sublevel.name;
        this.productos = Products.products;  
        const result = this.productos.filter(function(product) {
          return product.sublevel_id == sublevel.id;
        });
        this.productos = result;
        setTimeout(() => (this.alertaBuscar = false), 1000);
      }
      this.$store.commit(CATEGORY_SELECTED_MENU, {id: sublevel.id, category: level.name +' > '+sublevel.name});
    },
    clickCategorySublevelSublevel(level,sublevel,sublevelsublevel){
      if(!sublevelsublevel.sublevels){        
        this.alertaBuscar=true;
        this.labelInputBuscarProducto='Buscar producto en la categoria '+sublevelsublevel.name;
        this.productos = Products.products;  
        const result = this.productos.filter(function(product) {
          return product.sublevel_id == sublevelsublevel.id;
        });
        this.productos = result;
        setTimeout(() => (this.alertaBuscar = false), 1000);
      }
      this.$store.commit(CATEGORY_SELECTED_MENU, {id: sublevelsublevel.id, category: level.name +' > '+sublevel.name+' > '+sublevelsublevel.name});
    },
    updatedNumShoppingList(){
      let shoppingCart=localStorage.getItem("shoppingcart");
      if(shoppingCart != null && shoppingCart.length>0){
        this.numProductsCarroCompras=shoppingCart.split(',').length;
      }else{
        this.numProductsCarroCompras=0;
      }
    },
    goShoppingCart(){
      this.$router.push('/shopping-cart')
    }
  },
  mounted() {    
    this.categories = Categories.categories;
    this.updatedNumShoppingList();
  }
};
</script>

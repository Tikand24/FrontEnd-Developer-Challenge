<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs7 sm8 md10 lg10>
        <h1 class="headline">{{ categoryTitle }}</h1>
      </v-flex>
      <v-flex xs5 sm4 md2 lg2>
        <v-subheader>Encontramos: {{ products.length }} Productos</v-subheader>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row wrap>
      <v-flex xs12 sm12 md2 lg2>
        <v-select
          :items="filters"
          label="Filtrar"
          v-on:change="filterByEvent"
          v-model="filterBy"
          outline
        ></v-select>
      </v-flex>
      <v-flex
        xs12
        sm12
        md6
        lg6
        offset-md1
        offset-lg1
        v-if="showFiltersAvailable"
      >
        <v-radio-group v-model="radioGroupAvailable">
          <v-radio label="Disponible" :value="true"></v-radio>
          <v-radio label="No Disponible" :value="false"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex
        xs12
        sm12
        md6
        lg6
        offset-md1
        offset-lg1
        v-else-if="showFiltersPriceRank"
      >
        <v-layout row wrap>
          <v-flex xs12 sm5>
            <v-text-field v-model="priceStart" label="Desde" prefix="$" required outline></v-text-field>
          </v-flex>
          <v-flex xs12 sm5>
            <v-text-field v-model="priceEnd" label="Hasta" prefix="$" required outline></v-text-field>
          </v-flex>
          <v-flex xs12 sm2>
            <v-btn outline color="teal" dark v-on:click="filterByPrice">Aplicar</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex
        xs12
        sm12
        md6
        lg6
        offset-md1
        offset-lg1
        v-else-if="showFiltersQuantity"
      >
        <v-layout row wrap>
          <v-flex xs12 sm10>
            <v-range-slider
              v-model="sliderQuantity"
              thumb-color="red"
              thumb-label="always"
              :min="quantityMin"
              :max="quantityMax"
              :step="1"
            ></v-range-slider>
          </v-flex>
          <v-flex xs12 sm2>
            <v-btn outline color="teal" dark v-on:click="filterByQuantity">Aplicar</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md6 lg6 offset-md1 offset-lg1 v-else></v-flex>
      <v-flex xs12 sm12 md2 lg2 offset-md1 offset-lg1>
        <v-select
          :items="orderBy"
          label="Ordenar por"
          v-model="orderByVal"
          v-on:change="orderByEvent"
          outline
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="activeProducts">
      <v-flex xs12 sm12 md6 lg3 v-for="product  in products" :key="product.id">
        <v-card>
          <v-img
            src="https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/ef/b9/c7/efb9c7f0-4163-da3a-01f9-34e20bf491b8/AppIcon-2-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-10.png/1200x630wa.png"
            aspect-ratio="2.75"
          ></v-img>
          <v-card-title>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12>
                  <h2>{{ product.name }}</h2>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs6 sm8 lg9>
                  <h4 class="headline mb-0">{{ product.price }}</h4>
                </v-flex>
                <v-flex xs6 sm4 lg3>
                  <p class="text-xs-right">Quantity: {{ product.quantity }}</p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-title>
          <v-card-actions v-if="product.available">
            <v-btn block color="teal" dark v-on:click="addShoppingCart(product)">
              <v-icon left>add_shopping_cart</v-icon>Agregar
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-btn block :disabled="true">
              <v-icon left>remove_shopping_cart</v-icon>No disponible
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center column fill-height v-else class="text-xs-center">
      <v-flex xs12 sm12 md12 lg12>
        <v-progress-circular :size="250" color="primary" :width="10" indeterminate></v-progress-circular>
        <h1 class>Loading...</h1>
      </v-flex>
    </v-layout>
    <div>
       <v-dialog
      v-model="dialogAddShoppingCart"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Guardando producto
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
  </v-container>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { ITEM_ADD_SHOPPING } from '../store';

import Products from "../assets/products.json";

export default {
  name: "Products",
  data() {
    return {
      drawer: null,
      orderByVal: null,
      filterBy: null,
      categoryTitle: null,
      activeProducts: true,
      showFiltersAvailable: false,
      showFiltersPriceRank: false,
      showFiltersQuantity: false,
      radioGroupAvailable: null,
      quantityMin: 0,
      quantityMax: 0,
      sliderQuantity: [100, 300],
      categoryActive: null,
      dialogAddShoppingCart:false,
      priceStart: "",
      priceEnd: "",
      filters: ["Disponibilidad", "Rango de precios", "Cantidad"],
      orderBy: [
        "Mayor a menor precio",
        "Menor a Mayor Precio",
        "Disponibilidad",
        "Cantidad"
      ],
      products: Products.products,
      eliminados: []
    };
  },
  watch: {
    "$store.state.itemCategorySelectedMenu"(val) {
      if (val) {
        if (val.id) {
          this.categoryActive = val;
        }
        this.orderByCategory(val);
      }
    },
    "$store.state.itemProductSelected"(val) {
      if (val) {
        if(val.product){
          this.products=[];
          this.products.push(val.product);
        }
      }
    },
    radioGroupAvailable(val) {
      this.orderByCategory(this.categoryActive);
      this.filterByDisponibilidad();
    }
  },
  computed: {},
  methods: {
    orderByEvent() {
      if (this.orderByVal == "Disponibilidad") {
        this.orderByDisponibilidad();
      } else if (this.orderByVal == "Menor a Mayor Precio") {
        this.orderByPriceLower();
      } else if (this.orderByVal == "Mayor a menor precio") {
        this.orderByPriceBiger();
      } else if (this.orderByVal == "Cantidad") {
        this.orderByQuantity();
      }
    },
    orderByDisponibilidad() {
      this.activeProducts = false;
      let productosNoAvailable = [];
      for (let index = 0; index < this.products.length; index++) {
        const element = this.products[index];
        if (!element.available) {
          this.products.splice(
            this.products.findIndex(x => x.id === element.id),
            1
          );
          productosNoAvailable.push(element);
          index = -1;
        }
      }
      for (let index = 0; index < productosNoAvailable.length; index++) {
        this.products.push(productosNoAvailable[index]);
      }
      this.activeProducts = true;
    },
    orderByPriceLower() {
      this.activeProducts = false;
      this.products.sort(function(a, b) {
        let priceA = a.price.split("$")[1];
        priceA = Number(priceA.replace(",", "."));
        let priceB = b.price.split("$")[1];
        priceB = Number(priceB.replace(",", "."));
        if (priceA > priceB) {
          return 1;
        }
        if (priceA < priceB) {
          return -1;
        }
        return 0;
      });
      this.activeProducts = true;
    },
    orderByPriceBiger() {
      this.activeProducts = false;
      let functions = this;
      this.products.sort(function(a, b) {
        let priceA = functions.parseNumericPrice(a.price);
        let priceB = functions.parseNumericPrice(b.price);
        if (priceA < priceB) {
          return 1;
        }
        if (priceA > priceB) {
          return -1;
        }
        return 0;
      });
      this.activeProducts = true;
    },
    orderByQuantity() {
      this.activeProducts = false;
      this.products.sort(function(a, b) {
        if (a.quantity < b.quantity) {
          return 1;
        }
        if (a.quantity > b.quantity) {
          return -1;
        }
        return 0;
      });
      this.activeProducts = true;
    },
    orderByCategory(val) {
      this.activeProducts = false;
      this.products = Products.products;
      if (val != null) {
        this.categoryTitle = val.category;
        const result = this.products.filter(function(product) {
          return product.sublevel_id == val.id;
        });
        this.products = result;
      }
      this.activeProducts = true;
    },
    filterByEvent() {
      this.orderByCategory(this.categoryActive);
      this.showFiltersAvailable = false;
      this.showFiltersPriceRank = false;
      this.showFiltersQuantity = false;
      if (this.filterBy == "Disponibilidad") {
        this.showFiltersAvailable = true;
      } else if (this.filterBy == "Rango de precios") {
        this.showFiltersPriceRank = true;
      } else if (this.filterBy == "Cantidad") {
        this.showFiltersQuantity = true;
      }
    },
    filterByDisponibilidad() {
      this.activeProducts = false;
      if (this.radioGroupAvailable) {
        const result = this.products.filter(function(product) {
          return product.available == true;
        });
        this.products = result;
      } else {
        const result = this.products.filter(function(product) {
          return product.available == false;
        });
        this.products = result;
      }
      this.activeProducts = true;
    },
    filterByPrice() {
      this.orderByCategory(this.categoryActive);
      let priceMin = this.priceStart;
      let priceMax = this.priceEnd;
      let functions = this;
      const result = this.products.filter(function(product) {
        return (
          functions.parseNumericPrice(product.price) >= priceMin &&
          functions.parseNumericPrice(product.price) <= priceMax
        );
      });
      this.products = result;
    },
    filterByQuantity() {
      this.orderByCategory(this.categoryActive);
      let sliderQuantity = this.sliderQuantity;
      const result = this.products.filter(function(product) {
        return (
          product.quantity >= sliderQuantity[0] &&
          product.quantity <= sliderQuantity[1]
        );
      });
      this.products = result;
    },
    agregarProductosOriginales() {
      this.products = Products.products;
    },
    resetFiltersAndOrderBy() {
      this.showFiltersAvailable = false;
      this.showFiltersPriceRank = false;
      this.showFiltersQuantity = false;
      this.orderByVal = null;
      this.filterBy = null;
    },
    parseNumericPrice(val) {
      let price = val.split("$")[1];
      return Number(price.replace(",", ""));
    },
    addShoppingCart(val){
      this.dialogAddShoppingCart=true;
      let shoppingCartLocalStorage=localStorage.getItem('shoppingcart');
      if(shoppingCartLocalStorage != null && shoppingCartLocalStorage.length>0){
        if(shoppingCartLocalStorage===val.id){
          setTimeout(() => (this.dialogAddShoppingCart = false), 1500)
          return
        }
        shoppingCartLocalStorage=shoppingCartLocalStorage.split(",");
        if(shoppingCartLocalStorage.findIndex(x => x === val.id) == -1){
          shoppingCartLocalStorage=shoppingCartLocalStorage+','+val.id;
          localStorage.setItem('shoppingcart',shoppingCartLocalStorage);
        }
      }else{
        localStorage.setItem('shoppingcart',val.id);
      }
      this.$store.commit(ITEM_ADD_SHOPPING, {add: true});
      setTimeout(() => (this.dialogAddShoppingCart = false), 1500)
    },
  },
  mounted() {
    console.log('store',this.$store.state.itemProductSelected);
    this.products.sort(function(a, b) {
      if (a.quantity > b.quantity) {
        return 1;
      }
      if (a.quantity < b.quantity) {
        return -1;
      }
      return 0;
    });
    this.quantityMin = this.products[0].quantity;
    this.quantityMax = this.products[this.products.length - 1].quantity;
    if(this.$store.state.itemProductSelected.product){
          this.products=[];
          this.products.push(this.$store.state.itemProductSelected.product);
    }
  }
};
</script>

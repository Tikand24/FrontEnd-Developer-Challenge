<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <h1>Shoping cart</h1>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center row wrap fill-height>
      <v-flex xs12 sm12 md7 lg9 v-if="productShopping.length>0">
        <div v-for="(product,index) in productShopping" v-bind:key="product.id+index">
          <v-container grid-list-xs>
            <v-layout row wrap>
              <v-flex xs3>
                <v-img
                  src="https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/ef/b9/c7/efb9c7f0-4163-da3a-01f9-34e20bf491b8/AppIcon-2-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-10.png/1200x630wa.png"
                  height="125px"
                  contain
                ></v-img>
              </v-flex>
              <v-flex xs5>
                <v-card-title primary-title>
                  <div>
                    <div class="display-1">{{ product.name }}</div>
                    <div class="headline">{{ product.price }}</div>
                    <v-subheader>{{ product.quantity }} in stock</v-subheader>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs1>
                <v-text-field
                  v-model="productShopping[index].cantidad"
                  type="number"
                  :min="1"
                  :max="product.quantity"
                  v-on:change="cacularPedido()"
                  solo
                ></v-text-field>
              </v-flex>
              <v-flex xs1 offset-xs1>
                <v-btn outline small fab color="red" v-on:click="deleteProduct(product.id,index)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-divider light></v-divider>
        </div>
          <div class="mt-5">
            <v-btn outline large color="teal" v-on:click="goProducts()">Ver productos</v-btn>
          </div>
      </v-flex>
      <v-flex xs12 sm12 md7 lg9 v-else>
        <v-container fluid text-xs-center>
          <v-layout justify-space-around class="mb-2">
            <v-icon size="250">remove_shopping_cart</v-icon>
          </v-layout>
          <h1>No tiene articulos asignados</h1>
          <div class="mt-5">
            <v-btn outline large color="teal" v-on:click="goProducts()">Ver productos</v-btn>
          </div>
        </v-container>
      </v-flex>
      <v-flex d-flex xs12 sm12 md5 lg3>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Resumen del pedido</h3>
          </v-card-title>          
          <v-divider></v-divider>
          <v-card-text>
          <v-layout row>
            <v-flex xs6>
              <span class="text-xs-left">Subtotal ({{ resumenPedido.numProductos }})</span>
            </v-flex>
            <v-flex xs6 class="text-xs-right red--text">
              <h2>$ {{ formatMoney(resumenPedido.subtotal) }}</h2>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row>
            <v-flex xs6>
              <span class="text-xs-left">Envio </span>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              $
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row>
            <v-flex xs6>
              <span class="text-xs-left">Cupon </span>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout row>
            <v-flex xs6 class="text-xs-left red--text">
              <h1>Total</h1>
            </v-flex>
            <v-flex xs6 class="text-xs-right red--text">
              <h1>$ {{ formatMoney(resumenPedido.total) }}</h1>
            </v-flex>
          </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn block dark outline color="teal">Procesar compra</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Products from "../assets/products.json";
import { ITEM_ADD_SHOPPING } from "../store";

export default {
  name: "ShoppingCart",
  data() {
    return {
      drawer: null,
      cantidad: [],
      productShopping: [],
      products: Products.products,
      resumenPedido: {
        subtotal:'',
        numProductos:0,
        total:''
      }
    };
  },
  methods: {
    deleteProduct(id, index) {
      this.productShopping.splice(index, 1);
      let shoppingCart = localStorage.getItem("shoppingcart");
      if (shoppingCart != null) {
        shoppingCart = shoppingCart.split(",");
      }
      shoppingCart.splice(shoppingCart.findIndex(x => x == index));
      let shoppingCartLocalStorage = shoppingCart.toString();
      localStorage.setItem("shoppingcart", shoppingCartLocalStorage);
      this.cacularPedido();
      this.$store.commit(ITEM_ADD_SHOPPING, { add: true });
    },
    goProducts() {
      this.$router.push("/products");
    },
    parseNumericPrice(val) {
      let price = val.split("$")[1];
      return Number(price.replace(",", ""));
    },
    cacularPedido(){
      let numProductos=0;
      let subtotal=0;
      let total=0;
      for (let index = 0; index < this.productShopping.length; index++) {
        const element = this.productShopping[index];
        if(element.cantidad){
          numProductos=numProductos+Number(element.cantidad);
          subtotal=subtotal+this.parseNumericPrice(element.price)*element.cantidad;
        }else{
          this.productShopping[index].cantidad=1;
        }
      }
        //operacion para total, al aplicar algun descuento
        total=subtotal;
        this.resumenPedido.subtotal=subtotal;
        this.resumenPedido.total=total;
        this.resumenPedido.numProductos=numProductos;
    },
    formatMoney(n, c, d, t) {
      var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
  },
  mounted() {
    let shoppingCart = localStorage.getItem("shoppingcart");
    if (shoppingCart != null && shoppingCart.length > 0) {
      shoppingCart = shoppingCart.split(",");
      for (let index = 0; index < shoppingCart.length; index++) {
        const element = shoppingCart[index];
        this.productShopping.push(
          this.products[this.products.findIndex(x => x.id === element)]
        );
      }
      for (let index = 0; index < this.productShopping.length; index++) {
        this.productShopping[index].cantidad=1;
      }
      this.cacularPedido();
    }
  }
};
</script>

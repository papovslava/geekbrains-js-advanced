import './styles/reset.css';
import './styles/main.css';

const API_URL = 'http://127.0.0.1:3000';
const PRODUCTS_ENDPOINT = '/products';
const CART_ENDPOINT = '/cart';

import Vue from "./scripts/vue.js";
import Products from "./components/Products.vue";
import Cart from "./components/Cart.vue";
import Statusbar from "./components/Statusbar.vue";
// import vue from './scripts/vue.js';


Vue.config.productionTip = false;


const app = new Vue({
  el: "#app",
  data: {
    cart: [],
    products: [],
    filteredProducts: [],
    search: '',
    status: {
      isLoaded: false,
      isFetchError: false,
    }
  },
  components: { Products, Cart, Statusbar },
  methods: {
    updateCart(event, action) {
      const id = event.target.closest('.product').dataset.id;
      let payload;

      if (action == 'add') {
        const product = this.products.find(item => item.id == id);
        this.cart.push(product);
        payload = product;
      }

      if (action == 'remove') {
        const productIndex = this.cart.findIndex((item) => item.id == id);
        this.cart.splice(productIndex - 1, 1);
        payload = {id};
      }

      const requestCart = {
        url: API_URL + CART_ENDPOINT,
        type: action == 'remove' ? 'DELETE' : 'POST',
        payload: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      };
      this.fetchPromise(requestCart).catch(err => console.log(err));       
    },

    
    searchHandler() {
      if(this.search === '') {
        this.filteredProducts = this.products;
      }
      const regexp = new RegExp(this.search, 'gi');
      this.filteredProducts = this.products.filter((product) => regexp.test(product.title));
    },


    fetch(request, error, success) {
      let xhr;
    
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { 
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200) {
            let response = '';
            try { response = JSON.parse(xhr.responseText); }
            catch(e) {}
            finally { success(response); }
          }
          else if(xhr.status > 400) { error('все пропало'); }
        }
      }

      xhr.open(request.type, request.url, true);
      for (const [key, value] of Object.entries(request.headers ?? [])) {
        xhr.setRequestHeader(key, value);
      }
      xhr.send(request.payload);
    },

    fetchPromise(request) {
      return new Promise((resolve, reject) => {
        this.fetch(request, reject, resolve)
      }) 
    }
  },
  mounted() {
    console.log('app mounted');
  },
  created() {
    console.log('app created');
    const requestProducts = {
      url: API_URL + PRODUCTS_ENDPOINT,
      type: 'GET'
    };
    this.fetchPromise(requestProducts)
      .then(data => {
        this.products = data;
        this.filteredProducts = data;

        this.status.isLoaded = true;
      })
      .catch(err => {
        console.log(err);
        this.status.isFetchError = true;
      });

      const requestCart = {
        url: API_URL + CART_ENDPOINT,
        type: 'GET'
      };
      this.fetchPromise(requestCart)
        .then(data => {
          this.cart = data;
          if (!this.cart.length) { console.log('Cart is empty'); }
        })
        .catch(err => {
          console.log(err);
        }); 
  }
});
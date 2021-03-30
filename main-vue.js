const API_URL = 'http://127.0.0.1:3000';
const PRODUCTS_ENDPOINT = '/products';
const CART_ENDPOINT = '/cart';


Vue.component('statusbar', {
  template: `<h4>
    <template v-if="status.isFetchError">Fetch error</template>
    <template v-else-if="!status.isLoaded">Loading ...</template>
    <template v-else-if="products.length == 0 || fproducts.length == 0">No products</template>
  </h4>`,
  props: ['status', 'products', 'fproducts'],
})


Vue.component('product', {
  template: `<li :data-id="id" class="product">
    <img src="./img/placeholder.jpg" alt="Image of the Product">
    <h3>{{ title }}</h3>
    <p>{{ price }}</p>
    <slot></slot>
  </li>`,
  props: ['title', 'price', 'id']
})


Vue.component('cart', {
  template: `<div class="cart">
    <div v-if="isVisibleCart">
      <ul class="items">
        <slot></slot>
      </ul>
    </div>
    <button class="cart-toggle" @click="openCartHandler" type="button">Скрыть/показать корзину</button>
  </div>`,
  data() {
    return {
      isVisibleCart: true
    }
  },
  methods: {
    openCartHandler() {
      this.isVisibleCart = !this.isVisibleCart;
    },
    removeHandler(e) {
      this.$emit('remove', e)
    }
  }
})


const vue = new Vue({
  el: "#app",
  data: {
    cart: [],
    products: [],
    filteredProducts: [],
    search: '',
    status: {
      isLoaded: false,
      isFetchError: false,
    },
  },
  methods: {
    addToCartHandler(e) {
      console.log(e);
      const id = e.target.closest('.product').dataset.id;
      const product = this.products.find(item => item.id == id);

      this.cart.push(product);

      const requestCart = {
        url: API_URL + CART_ENDPOINT,
        type: 'POST',
        payload: JSON.stringify(product),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      this.fetchPromise(requestCart)
        .catch(err => {
          console.log(err);
        }); 

    },

    removeFromCartHandler(e) {
      // console.log(e)
      const id = e.target.closest('.product').dataset.id;
      const productIndex = this.cart.findIndex((item) => item.id == id);

      this.cart.splice(productIndex - 1, 1);

      const requestCart = {
        url: API_URL + CART_ENDPOINT,
        type: 'DELETE',
        payload: JSON.stringify({id: id}),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      this.fetchPromise(requestCart)
        .catch(err => {
          console.log(err);
        });       
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
            success(JSON.parse(xhr.responseText));
          } else if(xhr.status > 400) {
            error('все пропало');
          }
        }
      }

      xhr.open(request.type, request.url, true);
      if (request.headers) {
        xhr.setRequestHeader('Content-Type','application/json');
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
})
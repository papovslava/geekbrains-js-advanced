const API_URL = '/products.json';
// const API_URL = '/products-empty.json';
// const API_URL = '/products-fetch-fail.json';


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
      const good = this.products.find((item) => item.id == id);

      this.cart.push(good);
    },

    removeFromCartHandler(e) {
      console.log(e)
      const id = e.target.closest('.product').dataset.id;
      const goodIndex = this.cart.findIndex((item) => item.id == id);

      this.cart.splice(goodIndex - 1, 1);
    },

    searchHandler() {
      if(this.search === '') {
        this.filteredProducts = this.products;
      }
      const regexp = new RegExp(this.search, 'gi');
      this.filteredProducts = this.products.filter((product) => regexp.test(product.title));
    },

    fetch(error, success) {
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
    
      xhr.open('GET', API_URL, true);
      xhr.send();
    },

    fetchPromise() {
      return new Promise((resolve, reject) => {
        this.fetch(reject, resolve)
      }) 
    }
  },
  mounted() {
    this.fetchPromise()
      .then(data => {
        this.products = data;
        this.filteredProducts = data;

        this.status.isLoaded = true;
      })
      .catch(err => {
        console.log(err);
        this.status.isFetchError = true;
      }) 
  }
})
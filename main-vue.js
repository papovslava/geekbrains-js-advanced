const API_URL = '/products.json';


Vue.component('product', {
  template: `<li :data-id="id" class="product">
    <img src="./img/placeholder.jpg" alt="Image of the Product">
    <h3>{{ title }}</h3>
    <p>{{ price }}</p>
    <button class="cta">Add to Cart</button>
  </li>`,
  props: ['title', 'price', 'id']
})


Vue.component('cart', {
  template: `<div class="cart">
    <div v-if="isVisibleCart" v-on:click="removeHandler">
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
    isLoaded: false,
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

        this.isLoaded = true;
      })
      .catch(err => {
        console.log(err);
      }) 
  }
})
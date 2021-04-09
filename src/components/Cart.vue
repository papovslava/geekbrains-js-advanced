<template>
  <div class="cart">
    <div v-if="isVisibleCart">
      <ul v-if="cart.length" class="items">
        <Product
          v-for="product in cart"
          :key="Math.random() + product.id"
          :title="product.title"
          :price="product.price"
          :id="product.id">
          <button class="cta" @click="removeFromCart">Remove from Cart</button>
        </Product>
      </ul>
      <p v-else>
        Cart is empty
      </p>
    </div>
    <button class="cart-toggle" @click="openCartHandler" type="button">Скрыть/показать корзину</button>
  </div>
</template>

<script>
  export default {
    beforeCreate: function () {
      this.$options.components.Product = require('./Product.vue').default
    },
    data() {
      return {
        isVisibleCart: true
      }
    },
    methods: {
      openCartHandler() {
        this.isVisibleCart = !this.isVisibleCart;
      },
      removeFromCart(e) {
        this.$emit('sync', e, 'remove');      
      },
    },
    props: ['cart'],
    mounted() {
      console.log('cart mounted');
    },
    created() {
      console.log('cart created');
    }    
  }
</script>

<style scoped>
  .items {
    margin-bottom: 2rem;
  }
</style>
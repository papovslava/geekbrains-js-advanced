<template>
  <ul id="products" class="items" v-if="products.length > 0">
    <Product 
      v-for="product in products"
      :key="Math.random() + product.id"
      :title="product.title"
      :price="product.price"
      :id="product.id">
      <button class="cta" @click="addToCart">Add to Cart</button>
    </Product>
  </ul> 
</template>

<script>
  export default {
    beforeCreate: function () {
      this.$options.components.Product = require('./Product.vue').default
    },
    methods: {
      addToCart(e) { this.$emit('sync', e, 'add'); },
    },
    props: ['products', 'cart'],
    mounted() {
      console.log('products mounted');
    },
    created() {
      console.log('products created');
    }
  }
</script>

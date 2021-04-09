<template>
  <li :data-id="id" class="product">
    <img src="../images/placeholder.jpg" alt="Image of the Product">
    <h3>{{ title }}</h3>
    <p>{{ price }}</p>
    <slot></slot>
  </li>
</template>

<script>
  export default {
    props: ['title', 'price', 'id'],
    mounted() {
      console.log('product mounted');
    },
    created() {
      console.log('product created');
    }  
  };
</script>

<style scoped>
  .product {
    width: 12rem;
    padding: .5rem;
    border: 1px solid gray;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .product img {
    width: 100%;
  }

  .product h3 {
    margin-top: .5rem;
  }

  .product button {
    margin-top: 1rem;
    align-self: flex-end;
  }
</style>
<template>
  <!-- <p>{{ greeting }} World!</p> -->
  <li :data-id="id" class="product">
    <img src="../../img/placeholder.jpg" alt="Image of the Product">
    <h3>{{ title }}</h3>
    <p>{{ price }}</p>
    <slot></slot>
  </li>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        greeting: "Hello"
      };
    },
    props: ['title', 'price', 'id']
  };
</script>

<style scoped>
  p {
    font-size: 2em;
    text-align: center;
  }
</style>
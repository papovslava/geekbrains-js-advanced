<template>
  <h4>
    <template v-if="status.isFetchError">Fetch error</template>
    <template v-else-if="!status.isLoaded">Loading ...</template>
    <template v-else-if="products.length == 0 || fproducts.length == 0">No products</template>
  </h4>
</template>

<script>
  export default {
    props: ['status', 'products', 'fproducts'],
  }
</script>
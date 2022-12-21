<template>

    <div class="container">
      <div class="card">
        <div class="card-body">
          <slot></slot>
          <!--slot存放父组件传来的所有children-->
        </div>
      </div>
    </div>
  
  </template>
  
  <script>
  export default {
    name: 'ContentBase',
    components: {
    }
  }
  </script>
  
  <style scoped>
  .container {
    margin-top: 20px;
  }
  
  .card-body {
    text-align: left;
  }
  </style>
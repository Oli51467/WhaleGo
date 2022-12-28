<template>
    <ContentBase>
      <GoPlayGround></GoPlayGround>
    </ContentBase>
  </template>
  
  <script>
  import ContentBase from '@/components/ContentBase';
  import GoPlayGround from '@/components/go/GoPlayGround.vue'
  
  export default {
    name: 'RecordIndex',
    // 存放templates中用到的其他组件
    components: {
      ContentBase,
      GoPlayGround
    }
  }
  </script>
  
  <style scoped>
  </style>
<template>
  <ContentBase>
    My Bots
  </ContentBase>
</template>

<script>
import ContentBase from '@/components/ContentBase';
import $ from 'jquery';
import { useStore } from 'vuex';
import { API_URL } from '@/assets/apis/api';

export default {
  name: 'UserBots',
  // 存放templates中用到的其他组件
  components: {
    ContentBase
  },

  setup() {
    const store = useStore();
    $.ajax({
      url: `${API_URL}/bot/add/`,
      type: "post",
      data: {
        title: "bot_title",
        description: "bot_desc",
        content: "bot_code",
      },
      headers: {
        Authorization: "Bearer " + store.state.user.token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })
  }
}
</script>

<style scoped>

</style>
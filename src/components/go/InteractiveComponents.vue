<template>
    <PlayRequest v-if="$store.state.user.request_player_id != ''" />
    <PlayInvitation :request_user="$store.state.user.request_user" v-if="$store.state.user.invite_player_id != ''" />
    <RefuseHint v-if="$store.state.user.refused != ''" />
</template>

<script>
import PlayRequest from '@/components/go/PlayRequest.vue';
import PlayInvitation from '@/components/go/PlayInvitation.vue';
import RefuseHint from '@/components/go/RefuseHint.vue';

export default {
    components: {
        PlayRequest,
        PlayInvitation,
        RefuseHint,
    }
}
</script>

<style scoped>

</style>

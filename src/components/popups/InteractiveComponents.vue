<template>
    <PlayRequest v-if="$store.state.user.request_player_id != ''" />
    <PlayInvitation :request_user="$store.state.user.request_user" v-if="$store.state.user.invite_player_id != '' && 
    $store.state.user.invite_player_id != 'peace' " />
    <RefuseHint v-if="$store.state.user.refused != ''" />
</template>

<script>
import PlayRequest from '@/components/popups/PlayRequest.vue';
import PlayInvitation from '@/components/popups/PlayInvitation.vue';
import RefuseHint from '@/components/popups/RefuseHint.vue';

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

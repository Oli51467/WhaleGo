<template>
    <div class="playboard">
        <div class="row">
            <div class="col-3">
                <div class="user-avatar">
                    <img :src="$store.state.user.avatar" alt="">
                </div>
                <div class="username" style="margin-top: 20px;">
                    {{ $store.state.user.username }}
                </div>
            </div>
            <div class="col-3">
                <div class="user-avatar">
                    <img :src="$store.state.gogame.opponent_avatar" alt="">
                </div>
                <div class="username" style="margin-top: 20px;">
                    {{ $store.state.game.opponent_username }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4 func">
                <button type="button" class="btn btn-warning btn-lg" >认输</button>
            </div>
        </div>
        
    </div>
</template>

<script>

</script>

<style scoped>
div.playboard {
    width: 60vw;
    margin: 40px auto;
}

div.user-avatar {
    text-align: center;
}

div.user-avatar>img {
    width: 15vh;
}

div.username {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: black;
    padding-left: -5px;
}

.func {
    text-align: center;
    width: 50%;
    padding-top: 10vh;
}
</style>
<template>
    <ContentBase>
        <InteractiveComponents/>
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <div class="card" style="margin-top: 20px">
                        <div class="card-body">
                            <!--存储用户头像 字符串里是表达式要加:-->
                            <img :src="$store.state.user.avatar" alt="" style="width: 100%">
                        </div>
                    </div>
                </div>
                <div class="col-9">
                    <div class="card" style="margin-top: 20px">
                        <div class="card-header">
                            <span style="font-size: 150%">My Bot</span>
                            <button type="button" class="btn btn-success float-end">Create</button>
                        </div>
                        <div class="card-body">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ContentBase>
</template>

<script>
import ContentBase from '@/components/ContentBase.vue';
import InteractiveComponents from '@/components/go/InteractiveComponents.vue';

export default {
    name: 'UserBots',
    // 存放templates中用到的其他组件
    components: {
        ContentBase,
        InteractiveComponents
    },

    setup() {

    }
}
</script>

<style scoped>

</style>
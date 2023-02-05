<template>
    <div class="row">
        <span id="recent_records">最近战绩:</span>
    </div>
    <div class="row">
        <span class="d-flex justify-content-center" id="font">
            {{ recentRecords }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        recentRecords: {
            type: String,
            required: true,
        }
    },

    setup() {

    }
}
</script>

<style scoped>
#recent_records {
    font-weight: 700;
    font-size: larger;
    margin-top: 2vh;
}

#font {
    font-size: large;
    color: white;
    text-shadow: 1px 1px 0px #0000FF,2px 2px 0px #0000FF,-1px -1px 0px #E31B4E,-2px -2px 0px #E31B4E;
}
</style>
<template>
  <div class="teammark-search-remote">
    <el-button icon="el-icon-search" circle @click="handleGetBody"></el-button>
  </div>
</template>

<script>
  // import axios from 'axios';
  export default {
    data() {
      return {
        teammarkConfig: require('../../teammark.config')[process.env.TM_ENV],
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="scss">
.teammark-search-remote {
  z-index: 100000;
  position: fixed;
  top: 100px;
  right: 20px;
}
</style>

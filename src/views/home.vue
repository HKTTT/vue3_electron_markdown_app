<script setup>
import {ref,reactive} from 'vue'

let content = ref('')
 window.electronAPI.getContext((event,data)=>{
    content.value = data
 })
  window.electronAPI.returnContext((event,data)=>{
    // console.log(data,'11')
    // window.electronAPI.sendContext(content.value)
    event.sender.send('send_content',content.value)
 })



</script>


<template>
<div class="home">
    <div class="home_title">
        <h1>markdown编辑器</h1>
    </div>
    <div class="home_content">
         <v-md-editor v-model="content" height="400px"></v-md-editor>
    </div>
</div>

</template>


<style lang='scss' scoped>
.home{
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .home_title{
        display: flex;
        justify-content: center;
        align-items: center;
        // height 85px
    }
    .home_content{
        height: calc(100% - 5.3125rem);
         .v-md-editor{
            height: 100% !important;
        }
    }
   
}

</style>
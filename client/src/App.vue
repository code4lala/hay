<template>
  <div id="app" style='margin: 10px'>
    <Home v-if='$store.state.userName!==""'>
    </Home>
    <Login v-else></Login>
  </div>
</template>

<script lang='js'>
  import Home from '@/views/Home';
  import Login from '@/views/Login';

  export default {
    name: 'App',
    components: {Login, Home}
  }
</script>

<style>
</style>

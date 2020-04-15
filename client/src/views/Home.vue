<template>
  <div>
    <button v-for='it_tab in tabs' v-bind:key='it_tab'
            v-on:click='currentTab=it_tab'>
      {{ it_tab }}
    </button>
    <keep-alive>
      <component v-bind:is='currentTabComponent'></component>
    </keep-alive>
  </div>
</template>

<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator'
  import Chat from "@/components/Chat.vue";
  import Setting from "@/components/Setting.vue";

  @Component({
    components: {
      Chat,
      Setting
    }
  })
  export default class Home extends Vue {
    currentTab = 'Chat'
    tabs: Array<string> = ['Chat', 'Setting']

    get currentTabComponent() {
      return this.currentTab
    }
  }
</script>

<template>
  <div>
    <label v-bind:for='inputId'>
      {{ inputLabel }}
    </label>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input
        v-bind:id='inputId'
        type='text'
        class='form-control'
        v-bind:value='value'
        v-bind:placeholder='inputPlaceholder'
        v-on='inputListeners'>
    <!--                这里v-bind:value后边的变量名必须是value，其他的不行-->
  </div>
</template>

<script lang='js'>
  // TODO js to ts
  export default {
    name: 'BaseInputText.vue',
    props: {
      inputId: {
        type: String,
        required: true
      },
      value: {
        type: String,
        default: ''
      },
      inputLabel: {
        type: String,
        default: ''
      },
      inputPlaceholder: {
        type: String,
        default: ''
      }
    },
    computed: {
      inputListeners: function () {
        // TODO 此处lint说不能给this起别名
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm = this
        return {
          ...this.$listeners,
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
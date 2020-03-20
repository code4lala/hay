<template>
    <div>
        <label v-bind:for='input_id'>
            {{ input_label }}
        </label>
        <!--suppress HtmlFormInputWithoutLabel -->
        <input
                v-bind:id='input_id'
                type='text'
                class='form-control'
                v-bind:value='value'
                v-bind:placeholder='input_placeholder'
                v-on='input_listeners'>
        <!--                这里v-bind:value后边的变量名必须是value，其他的不行-->
    </div>
</template>

<script>
    export default {
        name: 'BaseInputText.vue',
        props: {
            input_id: {
                type: String,
                required: true
            },
            value: {
                type: String,
                default: ''
            },
            input_label: {
                type: String,
                default: ''
            },
            input_placeholder: {
                type: String,
                default: ''
            }
        },
        computed: {
            input_listeners: function () {
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
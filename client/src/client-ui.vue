<template>
    <div style='margin: 10px'>

        <header>
            <div class="row">
                <div class="col-sm-3 col-md-6 col-lg-4 col-xl-2 bg-info">
                    Hay!
                </div>
                <div class="col-sm-9 col-md-6 col-lg-8 col-xl-10 bg-warning">
                    How are you!
                </div>
            </div>
        </header>

        <main role="main">
            <div class="row">
                <div class="col-sm-3 col-md-6 col-lg-4 col-xl-2 bg-success">
                    消息列表<br>
                    消息列表<br>
                    消息列表<br>
                    消息列表<br>
                    消息列表<br>
                    消息列表<br>
                </div>
                <div class="col-sm-9 col-md-6 col-lg-8 col-xl-10">
                    聊天区域
                    <BaseInputText
                            v-model='msg_to_be_sent'
                            input_id="input_name_msg_to_be_sent"
                            input_label='发送消息'
                            input_placeholder='在此输入要发送的消息...'
                            v-on:keydown.enter='fn_send_msg'></BaseInputText>
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="row">
                <div class="col-sm-3 col-md-6 col-lg-4 col-xl-2 bg-info">
                    底部左侧
                </div>
                <div class="col-sm-9 col-md-6 col-lg-8 col-xl-10 bg-warning">
                    底部右侧
                </div>
            </div>
        </footer>

    </div>
</template>

<script>
    import BaseInputText from './components/base/BaseInputText'


    export default {
        name: 'client-ui',
        components: {BaseInputText},
        data: function () {
            return {
                msg_to_be_sent: ''
            }
        },
        methods: {
            fn_send_msg: function () {
                console.log('此处发送消息: ' + this.msg_to_be_sent)
            },
            fn_connect_to_server: function () {
                console.log('连接到服务器')

            }
        }
    }
</script>

<style scoped>

</style>
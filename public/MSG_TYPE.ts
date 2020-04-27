enum MSG_TYPE {
  LOGIN, // 请求登录
  GET_FRIENDS, // 请求好友列表
  SEND_CHAT_CONTENT, // 请求发送消息
  GET_CHAT_HISTORY, // 请求聊天记录
  SEND_IMAGE, // 发送图片
  SEND_FILE, // 发送文件
}

export default MSG_TYPE
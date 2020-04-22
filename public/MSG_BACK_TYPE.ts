enum MSG_BACK_TYPE {
  LOGIN_SUCC, // 登录成功
  LOGIN_FAIL, // 登录失败
  GOT_FRIENDS, // 获取好友列表成功
  GOT_CHAT_HISTORY, // 获取聊天记录成功
  GOT_MSG, // 发送消息成功
  GOT_NEW_MSG, // 新消息到达
}
export default MSG_BACK_TYPE

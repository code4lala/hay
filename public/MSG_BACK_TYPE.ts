enum MSG_BACK_TYPE {
  LOGIN_SUCC, // 登录成功
  LOGIN_FAIL, // 登录失败
  GOT_FRIENDS, // 获取好友列表成功
  GOT_CHAT_HISTORY, // 获取聊天记录成功
  GOT_MSG, // 发送消息成功
  GOT_NEW_MSG, // 新消息到达
  REGISTER_SUCC, // 注册成功
  REGISTER_FAIL, // 注册失败
  REGISTER_FAIL_INVITE_INVALID, // 邀请码无效
  REGISTER_FAIL_USERNAME_INVALID, // 用户名无效
  GOT_NEW_FRIEND_APPLICATION, // 新好友申请
  GOT_NEW_FRIEND_REQUEST_RESPONSE, // 好友申请结果到达
  GOT_NEW_FRIEND_ADD_SUCCEED, // 添加好友一方添加成功
}

export default MSG_BACK_TYPE

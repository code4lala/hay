import {cl, clt} from "./Util";
import MSG_BACK_TYPE from "../public/MSG_BACK_TYPE";

const fs = require('fs')
export const key = fs.readFileSync("/etc/letsencrypt/live/cloud.code4lala.vip/privkey.pem")
export const cert = fs.readFileSync("/etc/letsencrypt/live/cloud.code4lala.vip/fullchain.pem")

export let clients: any = []
/**
 * @param data 一条聊天消息
 */
export let fnNotifyNewMsg = function (data: any) {
  // 提醒对方有新消息到达
  // 查找对方是否在线
  clt('当前有' + clients.length + '个已连接用户')
  for (let i = 0; i < clients.length; i++) {
    // TODO 把是否为null去掉
    if (clients[i] === null) continue
    if (clients[i].id === data.receiver) {
      clt('聊天对象' + data.receiver + '在线')
      clients[i].conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.GOT_NEW_MSG,
        data: data
      }))
      clt('已通知对方有新消息')
      // 此处不能查找第一个之后就return或者break 因为用户可能多端登录
    }
  }
}

export let fnNotifyAddFriend = function (data: any) {
  // 提醒对方有人加到达
  // 查找对方是否在线
  clt('当前有' + clients.length + '个已连接用户')
  for (let i = 0; i < clients.length; i++) {
    // TODO 把是否为null去掉
    if (clients[i] === null) continue
    if (clients[i].id === data.receiver) {
      clt('聊天对象' + data.receiver + '在线')
      clients[i].conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.GOT_NEW_FRIEND_APPLICATION,
        data: data
      }))
      clt('已通知对方有新消息')
      // 此处不能查找第一个之后就return或者break 因为用户可能多端登录
    }
  }
}

export let fnNotifyResponseAddFriend = function (data: any) {
  // 提醒对方回复好友申请到达
  // 查找对方是否在线
  clt('当前有' + clients.length + '个已连接用户')
  for (let i = 0; i < clients.length; i++) {
    // TODO 把是否为null去掉
    if (clients[i] === null) continue
    if (clients[i].id === data.receiver) {
      clt('聊天对象' + data.receiver + '在线')
      clients[i].conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.GOT_NEW_FRIEND_REQUEST_RESPONSE,
        data: data
      }))
      clt('已通知对方有新消息')
      // 此处不能查找第一个之后就return或者break 因为用户可能多端登录
    }
  }
}

export let fnNotifyAddFriendSucceed = function (data: any) {
  // 提醒对方回复好友申请到达
  // 查找对方是否在线
  clt('当前有' + clients.length + '个已连接用户')
  for (let i = 0; i < clients.length; i++) {
    // TODO 把是否为null去掉
    if (clients[i] === null) continue
    if (clients[i].id === data.receiver) {
      clt('聊天对象' + data.receiver + '在线')
      clients[i].conn.sendUTF(JSON.stringify({
        type: MSG_BACK_TYPE.GOT_NEW_FRIEND_ADD_SUCCEED,
        data: data
      }))
      clt('已通知对方有新消息')
      // 此处不能查找第一个之后就return或者break 因为用户可能多端登录
    }
  }
}

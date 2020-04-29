import {cl, clt} from "./Util";
import MSG_BACK_TYPE from "../public/MSG_BACK_TYPE";

export let clients: any = []
/**
 * @param data 一条聊天消息
 */
export let fnNotifyNewMsg = function (data: any) {
  // 提醒对方有新消息到达 TODO 如何给指定客户端发消息
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
  // TODO 删掉debug
  clt('聊天对象' + data.receiver + '不在线')
  cl(clients)
}

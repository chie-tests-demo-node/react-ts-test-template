// import { Begin } from "@bk/usbkey-lib";
import { UserInfo } from "./types";

// export const LocalServerAddress = "https://192.168.100.151:28006";
export const LocalServerAddress = "https://127.0.0.1:28006";
const localServerAddress = LocalServerAddress + "/dev";

/**
 * 本地服务打开状态.
 */
let localServerCurrentConnectStatus: "open" | "close" = "close";

/**
 * 监听状态的Map.
 */

const listenerMap: any = {};

/**
 * 开始连接UsbKey本地服务
 */
(async () => {
  const connectionListenerFn = (type: "open" | "close") => {
    localServerCurrentConnectStatus = type;
    for (let key in listenerMap) {
      listenerMap[key](type);
    }
  };
  while (true) {
    try {
      // await Begin({
      //   url: localServerAddress,
      //   // appName: "电子签章管理系统",
      //   userAgent: window.navigator.userAgent,
      //   connectionListener: connectionListenerFn,
      // });
    } catch (e) {
      console.error("连接本地服务失败");
    }
  }
})();

/**
 * 获取本地服务当前连接状态
 * @returns 获取本地服务当前连接状态
 */
export function LocalServerCurrentConnectStatus() {
  return localServerCurrentConnectStatus;
}

/**
 * 添加本地服务状态监听
 * @param id 标识
 * @param fn 更新方法
 */
export function LocalServerConnectStatusListenerAdd(
  id: string,
  fn: (t: "open" | "close") => void
) {
  listenerMap[id] = fn;
}

/**
 * 删除一个监听
 * @param id 要删除的标识
 */
export function LocalServerConnectStatusListenerRemove(id: string) {
  delete listenerMap[id];
}

/**
 * 查看权限是否正确
 * @returns 检验权限是否完成
 */
export async function authIsOk(): Promise<boolean> {
  const userTokenStr = sessionStorage.getItem("u_t");
  if (!userTokenStr) {
    return false;
  }
  if (localServerCurrentConnectStatus === "open") {
    console.log("打开...");
  } else {
    console.log("关闭...l");
  }
  return true;
}

/**
 * 保存用户认证信息
 * @param token 用户token
 */
export async function authInfoSave(token: string) {
  sessionStorage.setItem("u_t", token);
}

/**
 * 获取当前用户
 * @returns 当前用户
 */
export function currentUserInfo(): UserInfo {
  return {};
}

/**
 * 清除权限
 */
export function clearCurrentAuthInfo() {
  sessionStorage.clear();
  // window.location.reload();
}

/**
 * 导出hooks
 */
export * from "./hooks";

// import { SocketContext, WebsocketClient } from "@byzk/sockjs-util-lib";
import { message, Modal } from "antd";

/**
 * 基础请求参数
 */
export interface BaseRequestOption {
  /**
   * 要发送的数据
   */
  data?: any;
  /**
   * 数据不进行string转换
   */
  dataNoConvertToStr?: boolean;
  /**
   * 超时时间
   */
  timeout?: number;
  /**
   * 不需要返回
   */
  noNeedReturn?: boolean;
  /**
   * 返回结果字符串不转换未json对象
   */
  respStrNoConvertToJsonObject?: boolean;
}

interface SocketContextOption {
  mod?: "0" | "1";
  data?: any;
  needReturn?: boolean;
  timeout?: number;
}

/**
 * 默认请求参数
 */
const defaultBaseRequestOption: BaseRequestOption = {
  timeout: -1,
};

/**
 * 基础请求
 * @param data 请求数据
 * @param options 选项
 */
export async function baseRequest<T>(
  cmd: string,
  options?: BaseRequestOption
): Promise<T> {
  if (!options) {
    options = defaultBaseRequestOption;
  }

  if (
    options.data &&
    !options.dataNoConvertToStr &&
    typeof options.data !== "string"
  ) {
    options.data = JSON.stringify(options.data);
  }

  if (!options.timeout) {
    options.timeout = defaultBaseRequestOption.timeout;
  }

  const socketContextOption: SocketContextOption = {
    mod: "1",
    needReturn: !options.noNeedReturn,
    data: options.data,
    timeout: options.timeout,
  };
  const ctx: any = ''
  // const ctx = SocketContext.createSendMsgContext(
  //   cmd,
  //   socketContextOption as any
  // );
  // if (ctx.err) {
  //   throw ctx.err;
  // }
  try {
    // const res = await WebsocketClient.getConn().sendMsg(ctx);
    // if (res.err) {
    //   var errorStr = res.err?.toString()?.replace("socketContextError: ", "");
    //   throw new Error(errorStr);
    // }

    // if (res.isVoid) {
    //   return undefined as any;
    // }

    let resData = '';
    if (options.respStrNoConvertToJsonObject) {
      return resData as any;
    }
    if (typeof resData === "string") {
      const targetNum = parseInt(resData);
      if (
        !(!isNaN(targetNum) && targetNum.toString().length === resData.length)
      ) {
        try {
          resData = JSON.parse(resData);
        } catch (e) { }
      }
    }
    return resData as any;
  } catch (e) {
    throw e;
  } finally {
    ctx.destroy();
  }
}

interface ISocketReq {
  url: string;
  data?: any;
  errorCb?: (error: string) => void;
  finalCb?: () => void;
  noTipError?: boolean;
  tipType?: "modal" | "message";
}

export async function socketReq(params: ISocketReq): Promise<any> {
  if (!params) {
    return Promise.reject("请求参数不能为空");
  }
  if (!params.tipType) {
    params.tipType = "modal";
  }
  try {
    const rsp = await baseRequest(params.url, { data: params.data });
    return Promise.resolve(rsp);
  } catch (error) {
    if (!params.noTipError) {
      if (params.tipType === "message") {
        message.error((error as any).toString());
      } else if (params.tipType === "modal") {
        Modal.error({ title: (error as any).toString() });
      }
    }
    params.errorCb?.((error as any).toString());
    return Promise.reject(error);
  } finally {
    params.finalCb?.();
  }
}

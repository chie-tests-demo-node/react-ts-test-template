import { message, Spin } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
  NavigateOptions,
} from "react-router-dom";
import {
  LocalServerConnectStatusListenerAdd,
  LocalServerConnectStatusListenerRemove,
  LocalServerCurrentConnectStatus,
} from ".";
import LayoutView from "../layout";
// import { ReqSelectRoleName } from "../requests/index";
import { ReqCurrentAuthMenu } from "../requests/auth";
import Login from "../pages/Login";
import { MenuItemInfo } from "./types";
import AsyncLock from "async-lock";

const lock = new AsyncLock()

const userMenuKeys = "_auth_routes";

function userHaveMenuAuth(url: string) {
  return sessionStorage.getItem(userMenuKeys)?.includes(';' + url + ';')
}

export const navigateFlag = "c_p";

/**
 * 使用路由跳转
 * @returns 跳转
 */
export function useRouteBreak(): (
  to: string,
  options?: NavigateOptions
) => void {
  const navigate = useNavigate();
  const breakFn = useCallback(
    (to: string, options?: NavigateOptions) => {
      if (!userHaveMenuAuth(to)) {
        to = "/home"
      }
      sessionStorage.setItem(navigateFlag, to);
      navigate(to, options);
    },
    [navigate]
  );

  return breakFn;
}

/**
 * 使用本地服务状态检测
 */
export function useLocalServerStatusCheck(): "open" | "close" {
  const [localServerOpen, setLocalServerOpen] = useState<"open" | "close">(
    LocalServerCurrentConnectStatus()
  );
  useEffect(() => {
    const id = new Date().getTime().toString() + Math.random();
    LocalServerConnectStatusListenerAdd(id, setLocalServerOpen);

    return () => {
      LocalServerConnectStatusListenerRemove(id);
    };
  }, []);
  return localServerOpen;
}

/**
 * 权限认证hook
 * @returns 权限认证是否ok.
 */
export function useAuthOk(): [boolean, "open" | "close"] {
  const localServerOpen = useLocalServerStatusCheck();
  const [authIsOk, setAutIsOk] = useState<boolean>(false);

  useEffect(() => {
    const userTokenStr = sessionStorage.getItem("u_t");
    if (!userTokenStr) {
      setAutIsOk(false);
      return;
    }
    if (localServerOpen === "open") {
      console.log("打开...");
    } else {
      console.log("关闭...l");
    }
    setAutIsOk(true);
  }, [localServerOpen]);
  return [authIsOk, localServerOpen];
}

/**
 * 获取用户登录名称
 * @returns 用户名称
 */

// export function useGetAuthUserName(): [string | undefined] {
//   const [getUser, setGetUser] = useState<string>()
//   const getUserName = useCallback(async () => {
//     const a = await ReqGetKeyCertUserInfo()
//     setGetUser(a.name);
//   }, [])

//   useEffect(() => { getUserName() }, [getUserName])
//   return [getUser]
// }

function rangeUserAuthMenuKeys(menuList: MenuItemInfo[], userMenuKeys: string[]) {
  if (!menuList || menuList.length === 0) {
    return
  }
  for (let m of menuList) {
    userMenuKeys.push(m.name)
    rangeUserAuthMenuKeys(m.children, userMenuKeys)
  }
}


/**
 * 使用权限菜单数据 
 * @returns 权限菜单信息
 */
export function useAuthMenu(): [MenuItemInfo[], boolean] {
  const [authOk, localServerStatus] = useAuthOk();
  const [menus, setMenus] = useState<MenuItemInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryCurrentAuthMenu = useCallback(async () => {
    lock.acquire("queryAuthMenu", async (done: any) => {
      try {
        const authMenu = sessionStorage.getItem("_m") as string;
        const userName = sessionStorage.getItem("_u") as string;
        if (authMenu || userName) {
          // setGetUser(userName);
          setMenus(JSON.parse(authMenu));
          return
        }
        setLoading(true);
        const menuItems = await ReqCurrentAuthMenu();
        let userMenus: string[] = []
        rangeUserAuthMenuKeys(menuItems, userMenus)

        sessionStorage.setItem(userMenuKeys, ';' + userMenus.join(';') + ';')

        // const a: any = await ReqSelectRoleName('')
        // sessionStorage.setItem("_m", JSON.stringify(menuItems))
        // sessionStorage.setItem("_u", JSON.stringify(a));
        // setGetUser(a.name);
        setMenus(menuItems);
      } catch (e) {
        message.error("加载用户菜单失败: " + (e as any).message);
        setMenus([]);
        setLoading(false);
      } finally {
        done()
      }
    })
  }, []);

  useEffect(() => {
    if (!authOk || localServerStatus !== "open") {
      setMenus([]);
      return;
    }
    queryCurrentAuthMenu();
  }, [authOk, localServerStatus, queryCurrentAuthMenu]);

  // const getUserName = useCallback(async () => {
  //   const a = await ReqGetKeyCertUserInfo()
  //   setGetUser(a.name);
  // }, [])

  // useEffect(() => { getUserName() }, [getUserName])

  return [menus, loading];
}

/**
 * 根据认证信息返回路由
 * @returns 认证之后的路由
 */
export function useAuthRouter(): React.ReactNode {
  const [authOk, localServerStatus] = useAuthOk();
  const [authMenu,] = useAuthMenu();
  const location = useLocation();
  const navigate = useNavigate();
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([]);
  useEffect(() => {
    const currentPath = sessionStorage.getItem(navigateFlag);
    if (!currentPath) {
      setDefaultOpenKeys(["/"]);
      return;
    }
    const locationList = currentPath.split("/");
    const keys: string[] = [];
    for (let str of locationList) {
      if (str === "") {
        keys.push("/");
        continue;
      }

      if (keys.length === 0) {
        keys.push(str);
        continue;
      }

      const prevKey = keys[keys.length - 1];
      if (prevKey.endsWith("/")) {
        keys.push(prevKey + str);
      } else {
        keys.push(prevKey + "/" + str);
      }
    }
    setDefaultOpenKeys(keys);
    if (location.pathname.startsWith(currentPath)) {
      return;
    }
    console.log(currentPath)
    navigate(currentPath, { replace: true });
  }, [authMenu, location.pathname, navigate]);

  return useMemo<React.ReactNode>(() => {
    if (authOk) {
      return (
        <>
          {defaultOpenKeys.length > 0 && (
            <Spin
              spinning={localServerStatus === "close"}
              tip="正在连接本地服务中..."
            >
              {/* <LayoutView
                defaultOpenKeys={defaultOpenKeys}
                menuItemInfos={authMenu}
              /> */}
            </Spin>
          )}
        </>
      );
    }
    return (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate replace to={"/"} />} />
        </Routes>
      </>
    );
  }, [authMenu, authOk, defaultOpenKeys, localServerStatus]);
}

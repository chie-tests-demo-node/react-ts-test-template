import { Menu } from "antd";
import { useCallback, useMemo, useState } from "react";
import { Navigate, Route, useLocation } from "react-router-dom";
import { MenuItemInfo } from "../auth/types";
import { LayoutContentMap, UnknowBreakJSX } from "./menuMap";
import { getFirstRoutePath, joinRoutePath } from "./utils";
import { SelectInfo } from "rc-menu/lib/interface";
// import { IconPro } from "../components/icons";
import { useRouteBreak } from "../auth";

const { SubMenu } = Menu;

/**
 * 将菜单信息转换为菜单元素
 * @param menuItemInfos 菜单信息
 * @returns [菜单元素, openEvent, selectEvent]
 */
export function useMenuItems(
  menuItemInfos: MenuItemInfo[]
): [
    React.ReactNode[],
    (openKeys: string[]) => void,
    (param: SelectInfo) => void
  ] {

  const navigate = useRouteBreak();

  /**
   * 转换菜单项
   */
  const convertToMenuItems = useCallback(
    (menuItemInfos: MenuItemInfo[], parentPath: string = "") => {
      return menuItemInfos.map((m) => {
        const icon = m.icon ? '' : undefined;
        const routePath = joinRoutePath(parentPath, m.name);
        if (m.children && m.children.length > 0) {
          return (
            <SubMenu
              icon={icon}
              className="sub-menu"
              key={routePath}
              title={m.title}
            >
              {convertToMenuItems(m.children, routePath)}
            </SubMenu>
          );
        }
        if (m.parentId === '0') {
          return (
            <Menu.Item key={routePath} icon={icon}>
              {m.title}
            </Menu.Item>
          );
        }
        return (
          <Menu.Item key={routePath}>
            {m.title}
          </Menu.Item>
        );
      });
    },
    []
  );
  const menuItems = useMemo(() => {
    return convertToMenuItems(menuItemInfos);
  }, [convertToMenuItems, menuItemInfos]);

  const openKeysFn = useCallback(
    (openKeys: string[]) => {
      navigate(openKeys[openKeys.length - 1]);
    }, [navigate]);

  const selectKeysFn = useCallback(
    (param: SelectInfo) => { navigate(param.key); },
    [navigate]
  );
  return [menuItems, openKeysFn, selectKeysFn];
}

/**
 * 将菜单信息转换为菜单路由
 * @param menuItemInfos 菜单信息
 * @returns 菜单路由
 */
export function useMenuRoutes(menuItemInfos: MenuItemInfo[]) {
  const convertToMenuRoutes = useCallback(
    (menuItenInfos: MenuItemInfo[], routesArray: React.ReactNode[] = []) => {
      menuItenInfos.forEach((m) => {
        if (m.children && m.children.length > 0) {
          return convertToMenuRoutes(m.children, routesArray);
        }
        routesArray.push(
          <Route key={m.id} path={m.name} element={LayoutContentMap[m.name]} />
        );
      });
      return routesArray;
    },
    []
  );

  const menuRoutes = useMemo(() => {
    const menuRoutes = convertToMenuRoutes(menuItemInfos);
    if (menuRoutes.length === 0) {
      return menuRoutes;
    }

    menuRoutes.push(
      <Route
        path="*"
        key={"other-route"}
        element={
          <Navigate
            key={"Navigate-to-home"}
            replace
            to={getFirstRoutePath(menuItemInfos[0])}
          />
        }
      />
    );

    return menuRoutes;
  }, [convertToMenuRoutes, menuItemInfos]);

  return menuRoutes;
}

/**
 * 使用菜单当前的key
 * @returns [openKeys, selectKeys]
 */
export function useMenuCurrentKeys(): [string[], string[], (keys: string[]) => void] {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const openKeysChange = useCallback((keys: string[]) => {
    setOpenKeys(keys)
  }, [])
  return [openKeys, useMemo(() => {
    let openKeys: string[] = [];
    const pathName = location.pathname;
    const pathNameSplit = pathName.split("/");
    if (pathNameSplit && pathNameSplit.length > 1) {
      let tmpStr = "";
      for (let str of pathNameSplit) {
        if (!str) {
          continue;
        }
        tmpStr += "/" + str;
        openKeys.push(tmpStr);
      }
    }
    setOpenKeys(openKeys)
    return [pathName];
  }, [location.pathname]), openKeysChange];
}

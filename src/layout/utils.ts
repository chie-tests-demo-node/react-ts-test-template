import { MenuItemInfo } from "../auth/types";

/**
 * 拼接路由路径
 * @param parentPath 上级路径
 * @param currentPath 当前路径
 * @returns 正确的路由路径
 */
export function joinRoutePath(parentPath: string, currentPath: string): string {
  if (!currentPath.startsWith("/")) {
    currentPath = "/" + currentPath;
  }
  if (!parentPath || currentPath.startsWith(parentPath)) {
    return currentPath;
  }
  return parentPath + currentPath;
}

/**
 * 获取第一个可点击的路由路径
 * @param m 菜单信息
 * @returns 路由路径
 */
export function getFirstRoutePath(m: MenuItemInfo): string {
  if (m.children && m.children.length > 0) {
    const childrenMenuItemInfo = m.children[0];
    childrenMenuItemInfo.name = joinRoutePath(
      m.name,
      childrenMenuItemInfo.name
    );
    return getFirstRoutePath(childrenMenuItemInfo);
  }
  return m.name;
}

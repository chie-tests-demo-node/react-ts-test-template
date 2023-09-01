import { baseRequest } from "../_base";
import { MenuItemInfo } from "../../auth/types";

/**
 * 获取当前登录用户权限
 * @returns 菜单信息
 */
export async function ReqCurrentAuthMenu(): Promise<MenuItemInfo[]> {
  return (await baseRequest<any>("/sysPermission/userOwnAuth")).menus;
}

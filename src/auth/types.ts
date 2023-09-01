/**
 * 用户接口
 */
export interface UserInfo {}

/**
 * 菜单项状态
 */
export enum MenuItemStatus {
  /**
   * 启用
   */
  START = 1,
  /**
   * 停用
   */
  STOP = 0,
}

/**
 * 菜单项
 */
export interface MenuItemInfo {
  /**
   * id
   */
  id: string;
  /**
   * 路由名称
   */
  name: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 上级ID
   */
  parentId: string;
  /**
   * 操作id
   */
  oid: string;
  /**
   * 唯一标识
   */
  label: string;
  /**
   * 图标
   */
  icon: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 状态
   */
  status: MenuItemStatus;
  /**
   * 自定义属性
   */
  metaData: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 修改时间
   */
  updateTime: string;
  /**
   * 拥有状态
   */
  type: MenuItemStatus;
  /**
   * 操作按钮合集
   */
  ops: MenuItemOperation[];
  /**
   * 子菜单
   */
  children: MenuItemInfo[];
}

/**
 * 菜单项操作按钮信息
 */
export interface MenuItemOperation {
  /**
   * id
   */
  id: string;
  /**
   * 操作名称
   */
  operationName: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 状态
   */
  status: MenuItemStatus;
  /**
   * 自定义属性
   */
  metaData: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 修改时间
   */
  updateTime: string;
}

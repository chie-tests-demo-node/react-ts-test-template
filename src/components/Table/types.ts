import { ProColumns } from "@ant-design/pro-table";

/**
 * ant包装表格返回数据
 */
export interface AntProTableRequestResponse<T> {
  /**
   * 数据
   */
  data: T[];
  /**
   * 数量
   */
  total: number;
}

/**
 * 批量添加用户返回数据
 */
export interface AntProTableManyUser<T> {
  /**
   * 数据
   */
  data: T[];
  /**
   * 成功数量
   */
  successCount: number;
  /**
   * 失败数量
   */
  failureCount: number;
}
/**
 * 选项
 */
export interface AntdProTableWrapperOption<ReqT, DataT> {
  /**
   * 禁用查询.
   */
  wrapperSearchDisabled?: boolean;
  /**
   * 请求方式
   */
  wrapperRequest?: (
    param: ReqT
  ) =>
    | AntProTableRequestResponse<DataT>
    | DataT[]
    | Promise<DataT[]>
    | Promise<AntProTableRequestResponse<DataT>>
    | Promise<any>
    | any;
  /**
   * 搜索框提示文本
   */
  wrapperSearchPlaceholder?: string;
  /**
   * 搜索框工具条
   */
  wrapperSearchToolbars?: React.ReactNode[];
  /**
   * 搜索框共内容val的key名称，默认为: likeVal
   */
  wrapperSimpleSearchInputName?: string;
  /**
   * 包装列
   */
  wrapperColumns?: ProColumns<DataT>[];
}

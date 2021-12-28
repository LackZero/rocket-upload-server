// apidoc 的一些定义apiDefine

/**
 * @apiDefine success
 * @apiSuccess {number} ret=0 ret
 * */

/**
 * @apiDefine error
 * @apiError (Error 200/4xx/5xx) {number} [ret] 网络请求不是200时，扔出错误提示的ret不会携带
 * @apiError (Error 200/4xx/5xx) {string} msg 错误信息
 * @apiErrorExample  {json} 错误示例
 * {
 *   "msg": "error msg"
 * }
 * */

/**
 * @apiDefine Time
 * @apiSuccess {String} createTime 创建时间
 * @apiSuccess {String} updateTime 更新时间
 */

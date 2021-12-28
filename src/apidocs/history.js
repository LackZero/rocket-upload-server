// 存放历史api定义

/**
 * @api {DELETE} /tem-db/del 删除一条数据
 * @apiVersion 0.0.0
 * @apiGroup tem-db
 * @apiDescription 在apps表里删除一条数据
 *
 * @apiParam {number} id id
 * @apiParamExample {json} 请求示例
 * {
 *    "id":666
 * }
 *
 * @apiUse success
 * @apiSuccess {object} data 返回数据
 * @apiSuccess {object} data.result 返回数据
 * @apiSuccessExample  {json} 成功示例
 * {
 *   "ret":0,
 *   "data":{
 *     "result":{}
 *   }
 * }
 *
 * @apiUse error
 */

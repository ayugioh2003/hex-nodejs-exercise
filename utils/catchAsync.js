/**
 * 取代 try catch
 * async function 回傳 Promise
 * 若 async function 捕捉到 Error 也代表 Promise 會被 reject
 * @date 2022-04-30
 * @param {Function} fn
 */
export default (fn) => (req, res, next) => {
  fn(req, res, next).catch(next)
}

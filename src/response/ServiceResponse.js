module.exports = class ServiceResponse {
  /**

   * @param {Boolean} success
   * @param {String} message
   * @param {Object} data
   * @param { []} errors
   */

  constructor(success, message, data = {}, errors = []) {
    this.success = success
    this.message = message ;
    this.data = data ;
    this.errors = errors;
  }
}

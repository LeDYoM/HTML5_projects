'use strict';

/**
 * Performs user related requests.
 * @mixin
 * @augments ScoreloopService
 * @requires ScoreloopService
 */
var UserServiceProvider = (function (global) {
  return function (service) {
    /**
     * Get user information.
     *
     * @memberOf UserServiceProvider.prototype
     * @method getUser
     * @param {string} userId - A user UUID
     * @returns {object} JSON
     */
    service.getUser = function (id) {
      return service.withSession().then(function (sess) {
        return service.makeRequest("GET", "/service/users/" + id);
      });
    };

    /**
     * Update user information.
     *
     * @memberOf UserServiceProvider.prototype
     * @method updateUser
     * @param {string} userId - A user UUID
     * @param {object} para - { login: string, email: string, nationality: string, device_id: string }
     * @returns {object} JSON
     */
    service.updateUser = function (id, para) {
      return service.withSession().then(function (sess) {

        return service.makeRequest("PUT", "/service/games/" + service.getGameId() + "/users/" + id, {
          "user": {
            "id": id,
            "login": para.login,
            "email": para.email,
            "nationality": para.nationality,
            "device_id": para.device_id
          }
        });
      });
    };

    return {
      mixin: function () { return service; }
    };
  };
})(typeof global === "object" ? global : window);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserServiceProvider;
}

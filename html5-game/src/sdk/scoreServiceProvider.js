"use strict";

/**
 * Performs score related requests.
 * @mixin
 * @augments ScoreloopService
 * @requires ScoreloopService
 */
var ScoreServiceProvider = (function (global) {
  var _defaultMode = 0,
    _defaultOffset = 0,
    _defaultPerPage = 20,
    _defaultSearchListId = "428a66d4-e6ca-4ff0-b7ea-f482ba4541a1";
  
  return function (service) {

    /**
     * Get a leaderboard from the score service
     * @memberOf ScoreServiceProvider.prototype
     * @method loadScores
     * @param {object} para - { mode: int, offset: int perPage: int, searchList: string }
     * @returns {object} JSON - [{score: ... }, {score: ... }]
     */
    service.loadScores = function (para) {
      para = para || {};
      return service.withSession().then(function (sess) {
        return service.makeRequest("GET", "/service/games/" + service.getGameId() + "/scores", {
          "mode": para.mode || _defaultMode,
          "offset": para.offset || _defaultOffset,
          "per_page": para.perPage || _defaultPerPage,
          "search_list_id": para.searchList || _defaultSearchListId,
          "user_id": sess.user.id
        });
      });
    };
    return {
      mixin: function () { return service; }
    };
  };
})(typeof global === "object" ? global : window);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoreServiceProvider;
}

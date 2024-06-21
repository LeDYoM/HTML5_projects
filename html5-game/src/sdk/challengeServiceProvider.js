'use strict';

/**
 * Performs challenge related requests.
 * @mixin
 * @augments ScoreloopService
 * @requires ScoreloopService
 */
var ChallengeServiceProvider = (function (global) {
  return function (service) {

    /**
     * Get a list of open challenges.
     * @memberOf ChallengeServiceProvider.prototype
     * @method getOpenChallenges
     * @param {string} userId - A user UUID
     * @returns {object} JSON
     */
    service.getOpenChallenges = function (options) {
      return service.withSession().then(function (sess) {
        return service.makeRequest("GET", "/service/games/" + service.getGameId() + "/challenges", {
          "user_id": sess.user.id,
          "search_list_id": "#open",
          "per_page": options.per_page
        });
      });
    };

    /**
     * Create a new open challenge with a specific user, based on a score
     * result. If the contestant is undefined, the challenge becomes and 'open'
     * challenge.
     *
     * @memberOf ChallengeServiceProvider.prototype
     * @method createChallenge
     * @param {string} contenderId - A contender UUID for the challenge
     * @param {decimal} result - A score result to base the challenge on
     * @returns {object} JSON
     */
    service.createChallenge = function (result, contestantId) {
      return service.withSession().then(function (sess) {
        return service.makeRequest("POST", "/service/games/" + service.getGameId() + "/challenges", {
          "challenge": {
            "stake": {
              "amount": 1,
              "currency": sess.user.balance.currency
            },
            "contestant_id": contestantId || undefined,
            "contender_id": sess.user.id,
            "state": "created",
            "contender": {
              "id": sess.user.id
            },
            "contender_score": {
              "device_id": service.getDeviceId(),
              "user_id": sess.user.id,
              "result": result
            }
          }
        });
      });
    };

    /**
     * Accept an open challenge. Updates the challenge and sets its state to 'accepted'.
     *
     * @memberOf ChallengeServiceProvider.prototype
     * @method acceptChallenge
     * @param {string} id - The challenge id to update.
     * @returns {object} JSON
     */
    service.acceptChallenge = function (id) {
      return service.withSession().then(function (sess) {
        return service.makeRequest("PUT", "/service/games/" + service.getGameId() + "/challenges/" + id, {
          "challenge": {
            "id": id,
            "contestant_id": sess.user.id,
            "state": "accepted"
          }
        });
      });
    };

    /**
     * Complete a challenge by submitting a contesting score to a pre-existing challenge.
     *
     * @memberOf ChallengeServiceProvider.prototype
     * @method submitChallengeScore
     * @param {number} result - The high score to save.
     * @param {string} id - The challenge id to update.
     * @returns {object} JSON
     */
    service.submitChallengeScore = function (result, id) {
      return service.withSession().then(function (sess) {
        return service.makeRequest("PUT", "/service/games/" + service.getGameId() + "/challenges/" + id, {
          "challenge": {
            "id": id,
            "contestant": {
              "id": sess.user.id
            },
            "contestant_id": sess.user.id,
            "contestant_score": {
              "result": result,
              "user_id": sess.user.id,
              "device_id": service.getDeviceId()
            }
          }
        });
      });
    };

    /**
     * Get a historic list of challenges.
     *
     * @memberOf ChallengeServiceProvider.prototype
     * @method getChallengeHistory
     * @param {number} options - { per_page: number }
     * @returns {object} JSON
     */
    service.getChallengeHistory = function (options) {
      return service.withSession().then(function (sess) {
        return service.makeRequest("GET", "/service/games/" + service.getGameId() + "/challenges", {
          "user_id": sess.user.id,
          "search_list_id": "#history",
          "per_page": options.per_page
        });
      });
    };

    return {
      mixin: function () { return service; }
    };
  };

})(typeof global === "object" ? global : window);

if (typeof module !== "undefined" && module.exports) {
  module.exports = ChallengeServiceProvider;
}

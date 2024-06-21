'use strict';

/**
 * Create service requests to the scoreloop server.
 * @class
 * @param {string} gameId - The game UUID. 
 * @param {string} secret  - The secret for the game. 
 *
 * @requires trace
 * @requires getXmlHttpRequest
 * @requires base64Encode
 * @requires crc32
 * @requires Session
 * @requires Promise
 * @requires ScoreServiceProvider
 * @requires UserServiceProvider
 * @requires ChallengeServiceProvider
 *
 */
var ScoreloopService = (function (global) {

  // External modules / references
  var trace = global.trace;

  var Promise = global.Promise;
  var ScoreServiceProvider = global.ScoreServiceProvider;
  var UserServiceProvider = global.UserServiceProvider;
  var ChallengeServiceProvider = global.ChallengeServiceProvider;

  return function (endpoint, id, secret) {

    var _gameId = id;
    var _gameSecret = secret;
    var _reqId = 1;
    var _deviceId = null;
    var _sess = null;
    var _clientId = null;
    var _token = null;
    var _self = null;
    var _salt = "__SCOREL00P_JS_S4LT__";
    var _extToken = null;

    var _loadDevice = function () {
      return _self.makeRequest("GET", "/service/games/" + _gameId + "/device", {
        "uuid": _self.getUdId().toString(),
        "system_name": "Android",
        "system_version": "J2SE"
      }).then(function (res) {
        _deviceId = res.device.id;
        return res;
      });
    };

    var _submitDevice = function () {
      return _self.makeRequest("POST", "/service/games/" + _gameId + "/device", {
        "device": {
          "uuid": _self.getUdId().toString(),
          "system_name": "Android",
          "system_version": "J2SE"
        }
      }).then(function (res) {
        _deviceId = res.device.id;
        return res;
      });
    };

    var _createSession = function () {
      return _self.makeRequest("POST", "/service/games/" + _gameId + "/session", {
        "user": {
          "device_id": _deviceId
        }
      }).then(function (res) {
        _sess = res;
        return res;
      });
    };

    var	_jsonRequest = function (meth, chan, dat) {

      return new Promise(function (resolve, reject) {
        var xhr = new global.XMLHttpRequest();

        var url = endpoint + chan + (meth == "GET" ? "?" + _self.jsonToURIComponent(dat) : "");
        xhr.open(meth, url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("X-Scoreloop-SDK-Version", "1");
        xhr.setRequestHeader("Authorization", "Basic " + global.base64Encode("html5_web:tpdemo"));
        if (_extToken !== undefined && _extToken !== null) {
          xhr.setRequestHeader("X-Scoreloop-Ext-Token", _extToken);
        }
        if (_clientId !== undefined && _clientId !== null) {
          xhr.setRequestHeader("X-Scoreloop-Client-Id", _clientId);
        }
        var fail = function (_) {
          var data, e;
          e = new Error(_.target.statusText);
          if (_.target.responseText !== "") {
            try {
              data = JSON.parse(_.target.responseText);
            } catch (e) {
              reject(e);
              return;
            }
            if (data.error !== undefined) {
              e.message = data.error.message;
            }
            e.data = data;
          } else {
            e.message = _.target.statusText;
          }
          e.status = parseInt(_.target.status);
          reject(e);
        };

        xhr.addEventListener("error", fail);
        xhr.addEventListener("abort", fail);
        xhr.addEventListener("timeout", fail);
        xhr.addEventListener("loadend", function (e) {
          if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201) && !xhr.error && xhr.getResponseHeader("Content-Type").match("application/json")) {
            _extToken = xhr.getResponseHeader("X-Scoreloop-Ext-Token");
            _clientId = xhr.getResponseHeader("X-Scoreloop-Client-Id");
            resolve(JSON.parse(xhr.responseText));
          } else {
            fail(e);
          }
        });

        xhr.send(meth != "GET" ? JSON.stringify(dat) : null);
      });
    };

    var _handshake = function () {
      _extToken = null;
      _clientId = null;
      return _jsonRequest("POST", "bayeux/handshake", {
        "api":{"version":"3"},
        "game":{
          "id":_gameId,
          "secret":_gameSecret,
          "version":"1.0"
        }
      });
    };

    var _getSession = function () {
      if (_sess) {
        return Promise.resolve(_sess);
      } else {
        return _handshake().then(function(_) {
          return _loadDevice().then(function(_) {
            return _createSession();
          }).catch(function (e) {
            if (e.status == 404) {
              return _submitDevice().then(function(_) {
                return _createSession();
              });
            } else {
              return Promise.reject(e);
            }
          });
        });
      }
    };

    _self = {
      /** 
       * Get the game id from the service.
       * @memberof ScoreloopService.prototype
       * @returns {string}
       */
      getGameId: function () {
        return _gameId;
      },

      /** 
       * Use an existing session or create a new one for a forthcoming request.
       *
       * @memberof ScoreloopService.prototype
       * @returns {Promise}
       */
      withSession: function () {
        return _getSession();
      },

      /** 
       * Convert a simple json key / value structure into a URL encoded query
       * string.
       *
       * @memberof ScoreloopService.prototype
       * @returns {string}
       */
      jsonToURIComponent: function (json) {
        var rest = [];
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            rest.push(key + "=" + encodeURIComponent(json[key]));
          }
        }
        return rest.join("&");
      },

      /**
       * Get or generate a unique ID and store it in a local session manager.
       *
       * @memberof ScoreloopService.prototype
       * @returns {string}
       */
      getUdId: function () {
        var udid = global.Session.get("udid");
        if (!udid) {
          udid = global.crc32(_salt + Date.now());
          global.Session.set("udid", udid);
        }
        return udid;
      },

      /**
       * Get device id of the currently active session user.
       *
       * @memberof ScoreloopService.prototype
       * @returns {string}
       */
      getDeviceId: function () {
        return _deviceId;
      },

      /**
       * Get user information of the current session user.
       *
       * @memberof ScoreloopService.prototype
       * @returns {object}
       */
      getSession: function () {
        return _sess;
      },

      /**
       * Make a wrapped request.
       * @memberof ScoreloopService.prototype
       * @param {string} method - the endpoint method (GET, POST, ...)
       * @param {string} channel - the endpoint "channel" or URL
       * @param {string} data - the data that the endpoint should consume
       * @returns {Promise}
       */
      makeRequest: function (meth, chan, dat) {
        return _jsonRequest(meth, chan, dat);
      },
    };

    _self = new ScoreServiceProvider(_self).mixin();
    _self = new UserServiceProvider(_self).mixin();
    _self = new ChallengeServiceProvider(_self).mixin();
    
    return _self;
  };
})(typeof global === "object" ? global : window);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoreloopService;
}

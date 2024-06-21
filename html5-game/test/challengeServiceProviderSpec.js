'use strict';

global.sinon = require('sinon/lib/sinon');
global.XMLHttpRequest = function () {};
global.ProgressEvent = function () {};

global.base64Encode = require("../src/sdk/cross").base64Encode;
global.crc32 = require("../src/sdk/cross").crc32;
global.Session = require("../src/sdk/cross").Session;
global.trace = require("../src/sdk/cross").trace;
global.Promise = require("es6-promise").Promise;

global.ScoreServiceProvider = require('../src/sdk/scoreServiceProvider');
global.UserServiceProvider = require('../src/sdk/userServiceProvider');
global.ChallengeServiceProvider = require('../src/sdk/challengeServiceProvider');
global.ScoreloopService = require('../src/sdk/scoreloopService');
global.event = require('sinon/lib/sinon/util/event');
require('sinon/lib/sinon/util/fake_xml_http_request');

var util = require("util");
var expect = require('chai').expect;
var handshake = require('./support/handshake');

describe('ChallengeServiceProvider', function () {
  var xhr, requests, sc;

  beforeEach(function () {
    xhr = global.sinon.useFakeXMLHttpRequest();
    requests = [];

    xhr.onCreate = function (req) { requests.push(req); };
    sc = new ScoreloopService("http://localhost:9000/", "5d01c386-ed3a-11dd-bc21-0017f2031122", "_SECRET_");
  });

  afterEach(function () {
    xhr.restore();
  });

  it("should load challenges", function (done) {
    var spy = global.sinon.spy();

    sc.getOpenChallenges().then(function (data) {
      expect(data).deep.to.equal({
        "id": "#open",
        "challenges": []
      });

      done();
    });

    handshake(requests).then(function (mainRequest) {

      expect(mainRequest.url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/challenges");
      expect(mainRequest.method).to.contain("GET");
      expect(mainRequest.url).to.contain("user_id=1234&search_list_id=%23open");

      mainRequest.respond(200, { "Content-Type": "application/json" },
        JSON.stringify({
          "id": "#open",
          "challenges": []
        })
      );
    });
  });

  it("should create an indirect challenge", function (done) {
    var spy = global.sinon.spy();

    sc.createChallenge(13.667).then(function (data) {
      expect(data).deep.to.equal({
        "challenge": {
          "state": "assigned",
          "contender_skill_value": 1500,
          "mode": 0,
          "id": "13c611d2-6f72-494e-bdf6-c0bbb4999213",
          "stake": {
            "amount": 1,
            "currency": "KYE"
          },
          "level": 0,
          "updated_at": "2014-03-06T14:49:21+0000",
          "price": {
            "amount": 2,
            "currency": "KYE"
          },
          "game_id": "00000000-3c08-4375-a7f6-000000000106",
          "created_at": "2014-03-06T14:49:21+0000",
          "expiry_date": "2014-03-07T14:49:21+0000",
          "contender_score": {
            "id": "f79af245-0d61-4ffa-a1e4-6e1bf7cf6e55",
            "result": 1000.0,
            "level": 0,
            "location": { "country_code": "IO"} ,
            "context": { } ,
            "minor_result": 0.0,
            "skill_value": 1500,
            "mode": 0
          },
          "contender": {
            "id": "87d46cfa-834a-4fcf-8445-e18430104dfe",
            "balance": {
              "amount": 1499,
              "currency": "KYE"
            },
            "nationality": "IO",
            "location": { "country_code": "IO"},
            "global_achievements_counter": 0,
            "privacy": "public",
            "state": "anonymous",
            "login": "Player 1683801748",
            "favorite_games": [],
            "games_counter": 1,
            "buddies_counter": 0
          }
        }
      });

      done();
    });

    handshake(requests).then(function (mainRequest) {

      expect(mainRequest.url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/challenges");
      expect(mainRequest.method).to.contain("POST");
      expect(mainRequest.requestBody).to.equal(JSON.stringify({
        "challenge": {
          "stake": {
            "amount": 1,
            "currency": "KYE"
          },
          "contender_id": "1234",
          "state": "created",
          "contender_score": {
            "device_id": sc.getDeviceId(),
            "result": 13.667
          }
        }
      }));

      mainRequest.respond(200, { "Content-Type": "application/json" },
        JSON.stringify({
          "challenge": {
            "state": "assigned",
            "contender_skill_value": 1500,
            "mode": 0,
            "id": "13c611d2-6f72-494e-bdf6-c0bbb4999213",
            "stake": {
              "amount": 1,
              "currency": "KYE"
            },
            "level": 0,
            "updated_at": "2014-03-06T14:49:21+0000",
            "price": {
              "amount": 2,
              "currency": "KYE"
            },
            "game_id": "00000000-3c08-4375-a7f6-000000000106",
            "created_at": "2014-03-06T14:49:21+0000",
            "expiry_date": "2014-03-07T14:49:21+0000",
            "contender_score": {
              "id": "f79af245-0d61-4ffa-a1e4-6e1bf7cf6e55",
              "result": 1000.0,
              "level": 0,
              "location": { "country_code": "IO"},
              "context": { },
              "minor_result": 0.0,
              "skill_value": 1500,
              "mode": 0
            },
            "contender": {
              "id": "87d46cfa-834a-4fcf-8445-e18430104dfe",
              "balance": {
                "amount": 1499,
                "currency": "KYE"
              },
              "nationality": "IO",
              "location": { "country_code": "IO"},
              "global_achievements_counter": 0,
              "privacy": "public",
              "state": "anonymous",
              "login": "Player 1683801748",
              "favorite_games": [],
              "games_counter": 1,
              "buddies_counter": 0
            }
          }
        })
      );
    });
  });
});

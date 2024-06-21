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

describe('ScoreServiceProvider', function () {
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

  it("should load scores", function (done) {
    var spy = sinon.spy();

    sc.loadScores({ mode: 5, offset: 20, perPage: 10, searchList: "428a66d4-e6ca-4ff0-b7ea-f482ba4541a1"}).then(function (data) {
      expect(data).to.deep.equal({ "scores": [
        {
          "score": {
            "id": "da22da1b-d40a-4ae8-0000-01440d14470c",
            "result": 0.1,
            "level": 0,
            "location": { "country_code": "--"} ,
            "minor_result": 0.0,
            "context": { } ,
            "user": {
              "id": "da22da1b-d40a-4ae8-8354-b8b9a63afec7",
              "nationality": "IO",
              "location": { "country_code": "IO"} ,
              "privacy": "public",
              "state": "anonymous",
              "login": "Player 1746675830"
            } ,
            "mode": 0
          }
        },
        {
          "score": {
            "id": "4b0cf6a5-8496-450a-0000-01440babe6c3",
            "result": 0.1,
            "level": 0,
            "location": { "country_code": "--"} ,
            "minor_result": 0.0,
            "context": { } ,
            "user": {
              "id": "4b0cf6a5-8496-450a-8056-6198623733d8",
              "nationality": "IO",
              "location": { "country_code": "IO"} ,
              "privacy": "public",
              "state": "anonymous",
              "login": "Player 267918139"
            } ,
            "mode": 0
          }
        }
      ]});

      done();
    });

    handshake(requests).then(function (mainRequest) {

      expect(mainRequest.url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/scores");
      expect(mainRequest.method).to.equal("GET");
      expect(mainRequest.url).to.contain("mode=5&offset=20&per_page=10&search_list_id=428a66d4-e6ca-4ff0-b7ea-f482ba4541a1&user_id=1234");

      mainRequest.respond(200, { "Content-Type": "application/json" },
        JSON.stringify({
          "scores": [
            {
              "score": {
                "id": "da22da1b-d40a-4ae8-0000-01440d14470c",
                "result": 0.1,
                "level": 0,
                "location": { "country_code": "--"} ,
                "minor_result": 0.0,
                "context": { } ,
                "user": {
                  "id": "da22da1b-d40a-4ae8-8354-b8b9a63afec7",
                  "nationality": "IO",
                  "location": { "country_code": "IO"} ,
                  "privacy": "public",
                  "state": "anonymous",
                  "login": "Player 1746675830"
                } ,
                "mode": 0
              }
            },
            {
              "score": {
                "id": "4b0cf6a5-8496-450a-0000-01440babe6c3",
                "result": 0.1,
                "level": 0,
                "location": { "country_code": "--"} ,
                "minor_result": 0.0,
                "context": { } ,
                "user": {
                  "id": "4b0cf6a5-8496-450a-8056-6198623733d8",
                  "nationality": "IO",
                  "location": { "country_code": "IO"} ,
                  "privacy": "public",
                  "state": "anonymous",
                  "login": "Player 267918139"
                } ,
                "mode": 0
              }
            }
          ]
        }));
    });
  });
});

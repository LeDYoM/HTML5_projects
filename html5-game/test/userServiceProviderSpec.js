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

describe('UserServiceProvider', function () {
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

  it("should get a user", function (done) {
    var spy = global.sinon.spy();

    sc.getUser("3478969f-65f2-4ac3-8f9a-dfaa075906f6").then(function (data) {
      expect(data).to.deep.equal({
        "user": {
          "location": { "country_code": "IO"} ,
          "state": "pending",
          "privacy": "public",
          "favorite_games": [],
          "buddies_counter": 0,
          "id": "3478969f-65f2-4ac3-8f9a-dfaa075906f6",
          "email_digest": "AsAbU4u9hrk8kf+1ytHA5A==",
          "balance": {
            "amount": 1500,
            "currency": "KYE"
          } ,
          "nationality": "IO",
          "email": "3***********************************@s**.com",
          "global_achievements_counter": 0,
          "login": "Player 1211457264",
          "games_counter": 1
        }
      });

      done();
    });

    handshake(requests).then(function (mainRequest) {

      expect(mainRequest.url).to.contain("/service/users/3478969f-65f2-4ac3-8f9a-dfaa075906f6");
      expect(mainRequest.method).to.equal("GET");

      mainRequest.respond(200, { "Content-Type": "application/json" },
        JSON.stringify({
          "user": {
            "location": { "country_code": "IO"} ,
            "state": "pending",
            "privacy": "public",
            "favorite_games": [],
            "buddies_counter": 0,
            "id": "3478969f-65f2-4ac3-8f9a-dfaa075906f6",
            "email_digest": "AsAbU4u9hrk8kf+1ytHA5A==",
            "balance": {
              "amount": 1500,
              "currency": "KYE"
            } ,
            "nationality": "IO",
            "email": "3***********************************@s**.com",
            "global_achievements_counter": 0,
            "login": "Player 1211457264",
            "games_counter": 1
          }
        })
      );
    });
  });

  it("should fail with an invalid user", function (done) {
    var spy = global.sinon.spy();

    sc.getUser("abc").catch(function (e) {
      expect(e.message).to.equal("Invalid parameter abc");
      expect(e.status).to.equal(422);
      done();
    });

    handshake(requests).then(function (mainRequest) {
      expect(mainRequest.url).to.contain("/service/users/abc");
      mainRequest.respond(422, { "Content-Type": "application/json" },
        JSON.stringify({
          "error": {
            "message": "Invalid parameter abc",
            "args": { } ,
            "code": 4
          }
        })
      );
    });
  });

  it("should fail if HTTP responds with 500 status code", function (done) {
    var spy = global.sinon.spy();

    sc.getUser("3478969f-65f2-4ac3-8f9a-dfaa075906f6").catch(function (e) {
      expect(e.message).to.equal("Internal Server Error");
      done();
    });

    handshake(requests).then(function (mainRequest) {

      expect(mainRequest.url).to.contain("/service/users/3478969f-65f2-4ac3-8f9a-dfaa075906f6");
      expect(mainRequest.method).to.equal("GET");

      mainRequest.respond(500, { "Content-Type": "plain/text" }, "");
    });

  });

  it("should update a user", function (done) {
    var spy = global.sinon.spy();

    sc.updateUser("3478969f-65f2-4ac3-8f9a-dfaa075906f6", { login: "miro stinks", email: "miro@stinks.po", "nationality": "PO", "device_id": "unique_smell" }).then(function (data) {
      expect(data).to.deep.equal({
        "user": {
          "id": "3478969f-65f2-4ac3-8f9a-dfaa075906f6",
          "nationality": "PO",
          "email": "miro@stinks.po",
          "login": "miro",
        }
      });
      done();
    });

    handshake(requests).then(function (mainRequest) {
      expect(mainRequest.url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/users/3478969f-65f2-4ac3-8f9a-dfaa075906f6");
      expect(mainRequest.method).to.equal("PUT");

      expect(mainRequest.requestBody).to.equal(JSON.stringify({
        "user": {
          "id": "3478969f-65f2-4ac3-8f9a-dfaa075906f6",
          "login": "miro stinks",
          "email": "miro@stinks.po",
          "nationality": "PO",
          "device_id": "unique_smell"
        }
      }));

      mainRequest.respond(200,  { "Content-Type": "application/json" },
        JSON.stringify({
          "user": {
            "id": "3478969f-65f2-4ac3-8f9a-dfaa075906f6",
            "nationality": "PO",
            "email": "miro@stinks.po",
            "login": "miro",
          }
        })
      );
    });
  });
});


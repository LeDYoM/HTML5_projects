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

describe('ScoreloopService', function () {
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

  it("should create a device", function (done) {
    var spy = global.sinon.spy();

    sc.withSession().then(function (data) {
      expect(data).to.deep.equal({ "user": { "id": "1234" } });
      done();
    });
    
    expect(requests.length).to.equal(1);
    expect(requests[0].url).to.contain("handshake");

    requests[0].respond(200, { "Content-Type": "application/json" },
    JSON.stringify({ }));

    setTimeout(function () {
      expect(requests.length).to.equal(2);
      expect(requests[1].url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/device");
      requests[1].respond(404, { "Content-Type": "application/json" }, JSON.stringify({ }));
      setTimeout(function () {
        expect(requests.length).to.equal(3);
        expect(requests[2].url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/device");
        expect(requests[2].method).to.equal("POST");
        expect(requests[2].requestBody).to.equal(JSON.stringify({
          "device": {
            "uuid": sc.getUdId().toString(),
            "system_name": "Android",
            "system_version": "J2SE"
          }
        }));

        requests[2].respond(201, { "Content-Type": "application/json" },
          JSON.stringify({
            "device": {
              "id": "d77f7ee8-7d2d-4fc3-b0db-5f054dc4bbb2"
            }
          }));


        setTimeout(function () {
          expect(requests.length).to.equal(4);
          expect(requests[3].url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/session");
          expect(requests[3].method).to.equal("POST");
          expect(requests[3].requestBody).to.equal(JSON.stringify({
            "user": {
              "device_id": "d77f7ee8-7d2d-4fc3-b0db-5f054dc4bbb2"
            }
          }));

          requests[3].respond(200, { "Content-Type": "application/json" },
            JSON.stringify({ "user": { "id": "1234" } }));
        });
      }, 0);
    }, 0);
  });
});

"use strict";

var expect = require('chai').expect;

var handshake = function (requests) {

  expect(requests.length).to.equal(1);
  expect(requests[0].requestBody).to.equal(JSON.stringify({
    "api":{"version":"3"},
    "game":{
      "id":"5d01c386-ed3a-11dd-bc21-0017f2031122",
      "secret":"_SECRET_",
      "version":"1.0"
    }
  }));

  requests[0].respond(200, { "Content-Type": "application/json" },
    JSON.stringify({ }));

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      expect(requests.length).to.equal(2);
      expect(requests[1].url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/device");
      expect(requests[1].url).to.contain("uuid=" + global.Session.get("udid") + "&system_name=Android&system_version=J2SE");

      requests[1].respond(200, { "Content-Type": "application/json" },
        JSON.stringify({
          "device": {
            "id": "d77f7ee8-7d2d-4fc3-b0db-5f054dc4bbb2"
          }
        }));

      setTimeout(function () {
        expect(requests.length).to.equal(3);
        expect(requests[2].url).to.contain("/service/games/5d01c386-ed3a-11dd-bc21-0017f2031122/session");
        expect(requests[2].method).to.equal("POST");
        expect(requests[2].requestBody).to.equal(JSON.stringify({
          "user": {
            "device_id": "d77f7ee8-7d2d-4fc3-b0db-5f054dc4bbb2"
          }
        }));

        requests[2].respond(200, { "Content-Type": "application/json" },
          JSON.stringify({
            "user": {
              "id": "1234",
              "balance": {
                "amount": 1500,
                "currency": "KYE"
              }
            }
          }));

        setTimeout(function () {
          expect(requests.length).to.equal(4);
          resolve(requests[3]);
        }, 0);
      }, 0);
    }, 0);
  });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = handshake;
}

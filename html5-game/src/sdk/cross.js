'use strict';

var util;
if (typeof global === "object") {
  util = require('util');
}

var session;
if (typeof global === "object") {
  session = require("session");
}

var trace = (function (global) {
  var print;
  if (global.puts !== undefined) {
    print = global.puts;
  } else {
    print = global.console.log;
  }
  return function (str) {
    if (typeof str === "object") {
      print(JSON.stringify(str));
    } else {
      print(str);
    }
  };
})(typeof util === "object" ? util : window);

var base64Encode = (function (global) {
  if (global.btoa !== undefined) {
    return function (str) {
      return global.btoa(str);
    };
  } else {
    return function (str) {
      return new Buffer(str, "ascii").toString("base64");
    };
  }
})(typeof global === "object" ? global : window);

var makeCRCTable = (function () {
  return function () {
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
      c = n;
      for(var k =0; k < 8; k++){
        c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    return crcTable;
  };
})();

var crc32 = (function () {
  var crcTable = (function () {
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
      c = n;
      for(var k =0; k < 8; k++){
        c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      crcTable[n] = c;
    }
    return crcTable;
  })();

  return function (str) {
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
  }
})();

var Session = (function (global) {
  if (global.document !== undefined) {
    return {
      get: function (key) {
        return global.localStorage.getItem(key);
      },
      set: function (key, value) {
        global.localStorage.setItem(key, value);
        return value;
      }
    };
  } else if (session !== undefined) {
    var manager = new session.Manager ({ storage: { type: "Memory" }}).create();
    return {
      get: function (key) {
        return manager.get(key);
      },
      set: function (key, value) {
        manager.set(key, value);
        return value;
      }
    };
  }
})(typeof global === "object" ? global : window);

if (typeof module !== 'undefined' && module.exports) {
  module.exports.trace = trace;
  module.exports.base64Encode = base64Encode;
  module.exports.crc32 = crc32;
  module.exports.Session = Session;
}


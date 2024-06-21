"use strict";

window.Manager = (function (trace) {
  return function () {
    var _pages = [],
      _active = null;
    
    var _clearEvents = function (name) {
      _pages[name].events.map(function (_) {
        _.element.removeEventListener(_.eType, _.callback);
      });
    };

    return {
      addPage: function (name, callback) {
        if (_pages[name] === undefined) {
          _pages[name] = { events: [] };
        }
        _pages[name].callback = callback;
      },
      addEvent: function (name, element, eType, callback) {
        if (_pages[name] === undefined) {
          trace("Page with name '" + name + "' does not yet exist.");
          return;
        }
        Array.prototype.slice.call(element).map(function (_) {
          _pages[name].events.push({ eType: eType, callback: callback });
          _.addEventListener(eType, callback, false);
        });
      },
      execute: function (name, params) {
        if (_active !== null) {
          _clearEvents(name);
        }
        _pages[name].callback.apply(undefined, [params]);
      }
    };
  };
})(window.console.log);

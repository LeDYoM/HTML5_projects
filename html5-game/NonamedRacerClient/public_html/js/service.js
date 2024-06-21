"use strict";

(function (trace, gameTitleContainer, setFullScreenContainer,createChallengeContainer, openChallengesContainer, challengeHistoryContainer, templates, service, canvas, endGameContainer, startGame, Manager) {
  var acceptChallenge = function (evt) {
    evt.preventDefault();
    service.acceptChallenge(evt.target.getAttribute("data-id")).then(function (data) {
      _challenge = data.challenge;
      _manager.execute("clearAndStart");
    });
  },
  showBasic = function()
  {
    gameTitleContainer.innerHTML = MyTemplates['gameTitle'];      
    setFullScreenContainer.innerHTML = MyTemplates['setFullScreen'];      
    createChallengeContainer.innerHTML = MyTemplates['createChallenge'];      
  },
  hideAll = function()
  {
    gameTitleContainer.innerHTML = "";
    setFullScreenContainer.innerHTML = "";
    openChallengesContainer.innerHTML = "";
    challengeHistoryContainer.innerHTML = "";
    createChallengeContainer.innerHTML = "";
    endGameContainer.innerHTML = "";
  },
  rematch = function (evt) {
    evt.preventDefault();
    _competitor_id = evt.target.getAttribute("data-competitor-id");
    _manager.execute("clearAndStart");
  },
  _challenge = null,
  _competitor_id = null,
  _helpers = {
    roundScore: function (_) { return Math.round(_ * 100) / 100; },
    timeAgo: function (_) {
      var d = _.split(/[^0-9]/);
      var time = (Date.now() - new Date(d[0],d[1]-1,d[2],d[3],d[4],d[5]).getTime() + new Date().getTimezoneOffset()*60000);
      if (time / 3600000 >= 1.0) {
        return Math.round(time / 3600000) + "h ago";
      } else if (time / 60000 >= 1.0) {
        return Math.round(time / 60000) + "min ago";
      } else {
        return Math.round(time / 1000) + "sec ago";
      }
    },
    rowName: function (_) {
      return ( _ % 2 ) ?  "odd" : "even";
    }
  },
  gameOver = function (score) {
    if (_challenge !== null) {
      service.submitChallengeScore(score, _challenge.id).then(function (data) {
        _challenge = data.challenge;
        _manager.execute("endGame", score);
        _challenge = null;
      });
    } else {
      service.createChallenge(score, _competitor_id).then(function (data) {
        _manager.execute("endGame", score);
        _competitor_id = null;
      });
    }
  },
  _manager = new Manager();

  _manager.addPage("menu", function () {
    var ready = 0;
    hideAll();
    showBasic();
    _manager.addEvent("menu", createChallengeContainer.getElementsByTagName("button"), "click", function (evt) { 
      if (ready > 1) {
        _manager.execute("clearAndStart");
      }
    });
    var perPage = requestPerPage();

    service.getOpenChallenges({ per_page: perPage }).then(function (data) {
      openChallengesContainer.innerHTML = templates['openChallenges']({

        openChallenges: data.challenges.sort(function (a, b) { return (a.challenge.created_at < b.challenge.created_at ? 1 : a.challenge.created_at > b.challenge.created_at ? -1 : 0); }),
        
      }, { helpers: _helpers });

      _manager.addEvent("menu", openChallengesContainer.getElementsByTagName("button"), "click", acceptChallenge);
      ready++;

    }).catch(trace);

    service.getChallengeHistory({ per_page: perPage }).then(function (data) {
      challengeHistoryContainer.innerHTML = templates['challengeHistory']({
        challengeHistory: data.challenges.filter(function (_) {
          return (_.challenge.contender.id === service.getSession().user.id || _.challenge.contestant.id === service.getSession().user.id) && _.challenge.state == "complete";
        }).map(function (_) {
          _.isSessionWinner = _.challenge.winner.id === service.getSession().user.id;
          _.competitor = service.getSession().user.id === _.challenge.contender.id ? _.challenge.contestant : _.challenge.contender;
          return _;
        })
      }, { helpers: _helpers });
      
      _manager.addEvent("menu", challengeHistoryContainer.getElementsByTagName("button"), "click", rematch);
      ready++;
    }).catch(trace);
    GameSingleton.startGame(true,undefined,GlobalCanvas);
  });

  _manager.addPage("clearAndStart", function () {
    hideAll();
    GameSingleton.startGame(false,gameOver,GlobalCanvas);
  });

  _manager.addPage("endGame", function (score) {

    if (_challenge !== null) {

      endGameContainer.innerHTML = MyTemplates.endGameWithChallengeStatus(
        service.getSession().user,
        _challenge.winner.id === service.getSession().user.id,
        _challenge.winner.id === _challenge.contender.id ? _challenge.contender_score : _challenge.contestant_score,
        _challenge.winner.id === _challenge.contender.id ? _challenge.contestant_score : _challenge.contender_score,
         service.getSession().user.id === _challenge.contender.id ? _challenge.contestant : _challenge.contender
       );
        /*endGameContainer.innerHTML = templates['endGame']({
        user: service.getSession().user,
        isSessionWinner: _challenge.winner.id == service.getSession().user.id,
        winner_score: _challenge.winner.id == _challenge.contender.id ? _challenge.contender_score : _challenge.contestant_score,
        loser_score: _challenge.winner.id == _challenge.contender.id ? _challenge.contestant_score : _challenge.contender_score,
        competitor: service.getSession().user.id == _challenge.contender.id ? _challenge.contestant : _challenge.contender
      }, { helpers: _helpers });*/

    } else {
      endGameContainer.innerHTML = MyTemplates.endGameWithoutChallengeStatus(
        service.getSession().user,
        score
      );
        
      /*endGameContainer.innerHTML = templates['endGame']({
        user: service.getSession().user,
        score: score
      }, { helpers: _helpers });*/
    }
    _manager.addEvent("endGame", endGameContainer.getElementsByTagName("button"), "click", function () { _manager.execute("menu"); });
    _manager.addEvent("endGame", endGameContainer.getElementsByClassName("player"), "blur", function (evt) {
      var user = service.getSession().user;
      user.login = evt.target.value;
      user.device_id = service.getDeviceId();
      service.updateUser(user.id, user).catch(function (e) {
        if (e.data.error !== null && e.data.error.proposed_logins !== null && e.data.error.proposed_logins[0] !== null) {
          user.login = e.data.error.proposed_logins[0];
          service.updateUser(user.id, user);
        }
      });
    });
  });

    function startService()
    {
        _manager.execute("menu");
    }
    
    window.startService = startService;

})(
  window.console.log,
  document.getElementById("gameTitle"),
  document.getElementById("setFullScreen"),
  document.getElementById("createChallenge"),
  document.getElementById("openChallenges"),
  document.getElementById("challengeHistory"),
  window.Templates,
  window.service,
  function () { return window.GameClient.canvas; },
  document.getElementById("endGame"),
  window.startGame,
  window.Manager
);

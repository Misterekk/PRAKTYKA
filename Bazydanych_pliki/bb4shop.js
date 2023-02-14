(function() {
    var serverPath = "https://utrack.buybox.click/app";
    var filesPath = "https://utrack.buybox.click";

    var cookieName = "bb_track";
    var sessionCookieName = "bb_session_track"
    var expDays = 365;
    var cookieValue = "";

    function initTracking(bbId, space, campaignId, offerId, bbuuid) {
      document.cookie = sessionCookieName + "=" + encodeURIComponent(generateUid())+";expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
      track({
        'bbuuid': bbuuid,
        'bbId': bbId,
        'campaignId': campaignId,
        'offerId': offerId,
        'space': space,
        'type': 'campaignload'
      });
    }

    function pageLoad(bbuuid) {
      if (document.cookie.indexOf(sessionCookieName) < 0) {
        document.cookie = sessionCookieName + "=" + encodeURIComponent(generateUid())+"; path=/";
        track( {
          'bbuuid': bbuuid,
          'type': 'shoppageload'
        });
      }
    }

    function productPageLoad(campaignOfferId, bbuuid) {
      track({
        'bbuuid': bbuuid,
        'campaignOfferId': campaignOfferId,
        'type': 'productpageload'
      });
    };

    function buy(offersList, bbuuid) {
      var offers = [];

      if (offersList)
        offersList.forEach(function(element) {
        offers.push("(" + element.productId + "#" + element.quantity + "#" + element.net + "#" + element.gross + "#" + (typeof(element.currency) =='undefined' ? "PLN" : element.currency) + ")");
      });

      track({
        'type': 'buy',
        'bbuuid': bbuuid,
        'offers': offers
      });
    }

    function track(data) {
      data.dt = (new Date()).toISOString();
      bbAnalytics('track', data, 'shop');
    }

    function generateUid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    function setCookie(name, value, days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      document.cookie = name + "=" + encodeURIComponent(value)+";expires=" + date.toUTCString() + ";path=/";
    }

    function getCookie(name) {
      var n,
          v,
          els = document.cookie.split(";");

      name = RegExp("^\\s*" + name + "=\\s*(.*?)\\s*$");
      for (var k = 0; k < els.length; k++) {
          var match = els[k].match(name);
          if (match !== null) {
              n = match[1].substr(0, match[1].indexOf("="));
              v = match[1].substr(match[1].indexOf("=") + 1);
          }
      }
      return v
    };

    if (document.cookie.indexOf(cookieName) >= 0) {
      cookieValue = getCookie(cookieName);
    } else {
      cookieValue = generateUid()
      setCookie(cookieName, cookieValue, expDays);
    };

    window['bbTrack'] = window['bbTrack'] || {
      initTracking: initTracking,
      buy: buy,
      pageLoad: pageLoad,
      productPageLoad:productPageLoad,
      serverPath: serverPath,
      cookieValue: getCookie(cookieName)
    };

    window['bbAnalytics'] = window['bbAnalytics'] || function() {
      (window['bbAnalytics'].query = window['bbAnalytics'].query || []).push(arguments);
    };

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = filesPath + '/analytics.js';
    document.body.appendChild(script);
})();

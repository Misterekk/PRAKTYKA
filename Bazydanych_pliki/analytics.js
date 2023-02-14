(function() {
    var serverPath = window['bbTrack'].serverPath;

    function Tracker(src) {
      this.properties = this.properties || [];
      this.cookies = this.cookies || {};
      this.baseUri = serverPath + '/' + src + '/';// + encodeURIComponent(document.cookie) + '/'+  encodeURIComponent(window['bbTrack'].cookieValue);
      this.cookies.clientCookie = document.cookie;
      this.cookies.bbClientCookie = window['bbTrack'].cookieValue;
    };

    Tracker.prototype.send = function(params, asynch) {
        //console.log(this.baseUri + src);
        //var img = new Image();
        //img.src = this.baseUri + src;
    /*$.post(this.baseUri,
      params,
      function(data, status){
        console.log(this.baseUri, JSON.stringify(params));
      },"json"
    );
    */
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.baseUri, !!asynch);
      xhr.setRequestHeader('Content-Type', 'application/json');
      // xhr.withCredentials = true;
      xhr.send(JSON.stringify(params));
    };

    Tracker.prototype.sendBasicProperties = function(asynch) {
        if (this.properties.length > 0) {
          var params = {
            "events": this.properties,
            "cookies": this.cookies
          };
          this.send(params, asynch);
          this.properties = [];
        }
    };

  //old
    Tracker.prototype.getBasicPropertiesUrl = function() {
        var src = '';
        for (var k = 0; k < this.properties.length; k++) {
            var p = this.properties[k];
            src += '/' + p.type + '?' + this.createUrlParams(p);
        }
        return src;
    };

    Tracker.prototype.track = function(data) {
        if (typeof(data) == "undefined") {
            data = {};
        }
        if (typeof(this.properties) == "undefined") {
            this.properties = [];
        }
        this.properties.push(data);
    };

    Tracker.prototype.createUrlParams = function(data) {
        var urlArray = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                urlArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
        }
        return urlArray.join('&');
    }

    var tracker;

    var getTracker = function(data) {
        var t = (tracker !== undefined) ? tracker : new Tracker(data[2]);
        tracker = t;
        return t;
    }

    var executeQuery = function(asynch) {
      if (window['bbAnalytics'].query !== undefined) {
        while (window['bbAnalytics'].query.length > 0) {
          var el = window['bbAnalytics'].query.shift();
          switch (el[0]) {
            case 'track': // for basic properties - adding new event
              getTracker(el).track(el[1]);
              break;
            case 'sendBasicProperties':
              getTracker(el).sendBasicProperties(asynch);
              break;
            default:
              break;
          }
        }
      }
    }

    function sendBasicProperties(asynch) {
      bbAnalytics('sendBasicProperties', {});
      executeQuery(asynch);
    }

    function sendData(asynch) {
      sendBasicProperties(asynch);
    }

    var sendInterval = 10 * 1000 //10s

    window.addEventListener('unload', function(){
      sendData(false);
    });

    window.addEventListener('beforeunload', function(){
      sendData(false);
    });

    setInterval(sendBasicProperties, sendInterval, true);
})();

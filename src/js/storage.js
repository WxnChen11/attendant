"use strict";
/*
* Store times for each site by date in chrome.storage
*/
function SiteTimes() {
  this._siteTimes = null;
  chrome.storage.sync.get("siteTimes", function (items){
    this._siteTimes = items.siteTimes;
  });
  if (!this._siteTimes) {
    var self = this;
    var array = [];
    chrome.storage.sync.set({"siteTimes":{"order":array}});
    chrome.storage.sync.get("siteTimes", function (items){
        self._siteTimes = items.siteTimes;
      });
  }
  this._currentURL = null;
  this._startTime = null;
  this._dayThreshold = 5; // so that the counter doesn"t reset at midnight
}

/*
* Update storage with most recently recorded time
*/
SiteTimes.prototype.updateTimes = function() {
  if (!this._currentURL || !this._startTime){
    return;
  }
  var currentTime = new Date();
  var change = currentTime - this._startTime;
  var date = new Date(this._startTime.getTime() - this._dayThreshold* 3600000);
  var date = date.toLocaleDateString();
  var dateOrder = this._siteTimes["order"];
  if ((!dateOrder) || date !== dateOrder[dateOrder.length-1]){
    this._siteTimes["order"].push(date);
  }

  if (! this._siteTimes[this._currentURL]){
    this._siteTimes[this._currentURL] = {};
  }
  if (!this._siteTimes[this._currentURL][date]) {
    this._siteTimes[this._currentURL][date] = change;
  }
  else{
    this._siteTimes[this._currentURL][date] += change;
  }
  //this._startTime = currentTime;
  var self = this;
  chrome.storage.sync.set({"siteTimes":self._siteTimes});
  console.log(this._siteTimes);
};

/*
* Update this._currentURL with the current URL
*/
SiteTimes.prototype.updateCurrentURL = function() {
  var self = this;
  this._getActiveTabURL(function(url) {
    if (!url) {
      self._currentURL = null;
    }
    else {
      self._currentURL = url.hostname;
    }
  });
  this._startTime = new Date();
};

SiteTimes.prototype.removeCurrentURL = function() {
  this._currentURL = null;
  this._startTime = null;
};


/*
* Helper function to get the active tab"s URL
*
* @param {function(URL)} callback - function to call on received URL
*/
SiteTimes.prototype._getActiveTabURL = function(callback){
  var query = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(query, function(tabs) {
    if (tabs[0]){
      var tab = tabs[0].url; // length of tabs should be 1 - only 1 active tab
      //console.assert(typeof url == "string", "url should be a string");
      var url = new URL(tab);
    }
    else {
      var url = null;
    }
      callback(url);

  });
};

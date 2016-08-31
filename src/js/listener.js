/*
* Listen for changes to currently active tab, and execute updates when changes
* occur.
*/
function Listener (siteTimes) {
  this._siteTimes = siteTimes;
  var self = this;
  chrome.alarms.create("listener", {periodInMinutes:1});
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name == "listener") {
      if (self._currentURL) {
        self._siteTimes.updateTimes();
        self._updateCurrentURL();
      }
      console.log("alarm");
      console.log(self._currentURL);
    }
  })
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if (message["popup"]){
      self._siteTimes.updateTimes();
      self._siteTimes.updateCurrentURL();
      console.log("popup clicked");
      chrome.runtime.sendMessage({'update':true});
    }
  });
  chrome.windows.onFocusChanged.addListener(function(windowId) {
    self._siteTimes.updateTimes();
    //if (windowId === chrome.windows.WINDOW_ID_NONE) {
    //  self._siteTimes.removeCurrentURL();
    //}
    //else {
    self._siteTimes.updateCurrentURL();
    //}
    console.log("focus changed");
  });
  chrome.windows.onCreated.addListener(function(window) {
    self._siteTimes.updateTimes();
    self._siteTimes.updateCurrentURL();
    console.log("window created");
  });
  chrome.idle.onStateChanged.addListener(function(newState) {
    self._siteTimes.updateTimes();
    if (newState === "active") {
      self._siteTimes.updateCurrentURL();
    }
    else {
      self._siteTimes.removeCurrentURL();
    }
    console.log("state changed");
  });
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    self._siteTimes.updateTimes();
    self._siteTimes.updateCurrentURL();
    console.log("tab activated");
  });
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    self._siteTimes.updateTimes();
    self._siteTimes.updateCurrentURL();
    console.log("tab updated");
  });
  // to do: implement alarms to check state every 30 seconds or so
}

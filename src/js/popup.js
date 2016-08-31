/**
 * Get the current active url
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getActiveTabUrl(callback){
  var query = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(query, function(tabs) {
    var url = tabs[0].url; // length of tabs should be 1 - only 1 active tab
    console.assert(typeof url == "string", "url should be a string");
    var url = new URL(url);
    callback(url);

  });
}


document.addEventListener("DOMContentLoaded", function() {
  // Send message to listener.js to update times
  chrome.runtime.sendMessage({'popup':true});
  var siteTimes = null;
  // Retrieve info from storage
  chrome.storage.sync.get("siteTimes", function (items){
    siteTimes = items.siteTimes;
    console.log(items);
    var dateOrder = siteTimes["order"];
    if (!dateOrder) {
      return;
    }
    var date = dateOrder[dateOrder.length-1];
    getActiveTabUrl(function (url){
      if (!siteTimes[url.hostname]) {
        return;
      }
      if (siteTimes[url.hostname][date]) {
        console.log(siteTimes[url.hostname][date].toString());
        document.getElementById("status").textContent = url.hostname + siteTimes[url.hostname][date].toString();
      }
      else {
        document.getElementById("status").textContent = "Time not found."
      }
    });
  });
});

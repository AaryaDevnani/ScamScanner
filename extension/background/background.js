//Calls API for account detection
let prediction = {}
let platform = ""
const accountDetectionAPI = async (platform,username) => {
  const res = await fetch(`http://127.0.0.1:3000/bot?platform=${platform}&username=${username}`, {
    method: "GET"
  });
  let obj = res.json();
  return obj;
};

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  chrome.runtime.reload();
});
chrome.tabs.onCreated.addListener(function (tabid, removed) {
  chrome.runtime.reload();
});

chrome.tabs.onUpdated.addListener(async (tabID, tab) => {
  console.log(tab.url)
  if (tab.url && tab.url.includes("instagram.com/")) {
    
    platform = "instagram"
    const username = tab.url.split("/")[3];
    prediction = await accountDetectionAPI(platform,username)
    // console.log(prediction)
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message == "Loaded") {
        console.log("IG")
        res = {
          prediction: prediction.Prediction,
          userData: prediction.userData,
          username: prediction.username,
          fullname: prediction.fullname,
          platform: prediction.platform
        };
        sendResponse(res);
      }
    });
    platform=""
    chrome.runtime.onMessage.removeListener();

  }
  else if(tab.url && tab.url.includes("twitter.com/")){
    
    platform = "twitter"
    const username = tab.url.split("/")[3];
    prediction = await accountDetectionAPI(platform,username)
    // console.log(prediction)
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message == "Loaded") {
        console.log("TWT")
        res = {
          prediction: prediction.Prediction,
          userData: prediction.userData,
          username: prediction.username,
          fullname: prediction.fullname,
          platform: prediction.platform
        };
        sendResponse(res);
      }
    });
    platform =""
    chrome.runtime.onMessage.removeListener();
  }
});

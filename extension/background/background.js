//Calls API for account detection
const accountDetectionAPI = async (platform,username) => {
  const res = await fetch(`http://127.0.0.1:3000/${platform}-bot?username=${username}`, {
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
  if (tab.url && tab.url.includes("instagram.com/")) {
    const username = tab.url.split("/")[3];
    let prediction = await accountDetectionAPI("ig",username)
    console.log(prediction)
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message == "Loaded") {
        res = {
          prediction: prediction.Prediction,
          userData: prediction.userData,
          username: prediction.username,
          fullname: prediction.fullname,
          platform:"Instagram"
        };
        sendResponse(res);
      }
    });
  }
  else if(tab.url && tab.url.includes("twitter.com/")){
    const username = tab.url.split("/")[3];
    let prediction = await accountDetectionAPI("twt",username)
    console.log(prediction)
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message == "Loaded") {
        res = {
          prediction: prediction.Prediction,
          userData: prediction.userData,
          username: prediction.username,
          fullname: prediction.fullname,
          platform: "Twitter",
        };
        sendResponse(res);
      }
    });
  }
});

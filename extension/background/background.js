const instagramAPICall = async (username) => {
  let obj;
  let headers = new Headers({
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
    "x-asbd-id": "198387",
    "x-csrftoken": "VXLPx1sgRb8OCHg9c2NKXbfDndz913Yp",
    "x-ig-app-id": "936619743392459",
    "x-ig-www-claim": "0",
  });
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      method: "GET",
      headers: headers,
    }
  );
  obj = await res.json();
  return obj.data.user;
};

const accountDetectionAPI = async (userData) => {
  const res = await fetch(
    'http://127.0.0.1:3000/ig-bot', {
      method: "POST",
      body: JSON.stringify(userData)
    }
  )
  let obj = res.json()
  return obj
}

chrome.tabs.onRemoved.addListener(function(tabid, removed) {
  chrome.runtime.reload()
  })
chrome.tabs.onCreated.addListener(function(tabid, removed) {
  chrome.runtime.reload()
  })

chrome.tabs.onUpdated.addListener(async (tabID, tab) => {
  if (tab.url && tab.url.includes("instagram.com/")) {
    const username = tab.url.split("/")[3];
    if (username === "p") {
      console.log("This is a post, please open the profile.");
    } else {
      // console.log()
      console.log(username);
      let response = await instagramAPICall(username);
      console.log(response);
      let pfpLink = response.profile_pic_url;
      let fullName = response.full_name;
      let bio = response.biography;
      let externalURL = (response.external_url == null ? 0 : 1)
      let privacyStatus = (response.is_private ? 1 : 0)
      let postCount = response.edge_owner_to_timeline_media.count;
      let followers = response.edge_followed_by.count;
      let following = response.edge_follow.count;
      let numUsername = (username.match(/\d/g) || []).length;
      let numRatioUsername = (numUsername == 0 ? 0 : (username.length - numUsername) / numUsername)
      let numFullName = (fullName.match(/\d/g) || []).length;
      let numRatioFullname = (numFullName == 0 ? 0 : (fullName.length - numFullName) / numFullName)
      let fullNameTokens = fullName.split(" ").length;
      let bioLen = bio.length;
      let nameUsername = (fullName === username ? 1 : 0)
      userData = {
        "profile pic": 0,
        "nums/length username": numRatioUsername,
        "fullname words": fullNameTokens,
        "nums/length fullname": numRatioFullname,
        "name==username": nameUsername,
        "description length": bioLen,
        "external URL": externalURL,
        "private": privacyStatus,
        "#posts": postCount,
        "#followers": followers,
        "#follows": following,
      };
      console.log(userData)
      let prediction = await accountDetectionAPI(userData)
      console.log(prediction)
      chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if(message == "Loaded"){
          res = {
            "prediction": prediction.Prediction,
            "userData": userData
          }
          sendResponse(res)
        }

    })
    }
  }
});
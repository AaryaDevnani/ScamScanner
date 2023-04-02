// function to call IG API
const instagramAPICall = async (username) => {
  let obj;
  const res = await fetch(
    `http://127.0.0.1:3000/instagramUserData?username=${username}`,
    {
      method: "GET"
    }
  );
  obj = await res.json()
  re = JSON.parse(obj.response)
  return re.data.user;
};

// function to call TWT API
const twitterAPICall = async (username) =>{
  let obj;
  const res = await fetch(
    `http://127.0.0.1:3000/twitterUserData?username=${username}`,  
    {
      method:"GET"
    }  
  );
  obj = await res.json()
  return obj.response
}

// function to format IG API results and message the extension with results
const instaFunction = async (username) => {
  if (username === "p") {
    console.log("This is a post, please open the profile.");
  } else {
    console.log(username);
    let response = await instagramAPICall(username);
    console.log(response);
    let pfpURL = response.profile_pic_url;
    let pfp = pfpURL.includes(
      "44884218_345707102882519_2446069589734326272_n.jpg"
    )
      ? 0
      : 1;
    let fullName = response.full_name;
    let bio = response.biography;
    let externalURL = response.external_url == null ? 0 : 1;
    let privacyStatus = response.is_private ? 1 : 0;
    let postCount = response.edge_owner_to_timeline_media.count;
    let followers = response.edge_followed_by.count;
    let following = response.edge_follow.count;
    let numUsername = (username.match(/\d/g) || []).length;
    let numRatioUsername =
      numUsername == 0 ? 0 : (username.length - numUsername) / numUsername;
    let numFullName = (fullName.match(/\d/g) || []).length;
    let numRatioFullname =
      numFullName == 0 ? 0 : (fullName.length - numFullName) / numFullName;
    let fullNameTokens = fullName.split(" ").length;
    let bioLen = bio.length;
    let nameUsername = fullName === username ? 1 : 0;
    userData = {
      "profile pic": pfp,
      "nums/length username": numRatioUsername,
      "fullname words": fullNameTokens,
      "nums/length fullname": numRatioFullname,
      "name==username": nameUsername,
      "description length": bioLen,
      "external URL": externalURL,
      private: privacyStatus,
      "#posts": postCount,
      "#followers": followers,
      "#follows": following,
    };
    console.log(userData);
    let prediction = await accountDetectionAPI("ig",userData);
    console.log(prediction);
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message == "Loaded") {
        res = {
          prediction: prediction.Prediction,
          userData: userData,
          username: username,
          fullname: fullName,
          platform:"Instagram"
        };
        sendResponse(res);
      }
    });
  }
};

// function to format TWT API results and message the extension with results
const twitterFunction = async (username) => {
  console.log(username);
  let response = await twitterAPICall(username);
  // console.log(response)
  created_at = response.created_at
  let createdDate = new Date(created_at)
  let createdTimestamp = createdDate.getTime()
  let currDate = Date.now()
  let days= Math.ceil(Math.abs(currDate-createdTimestamp)/86400000)
  let avg_twts = parseInt((response.statuses_count/days).toFixed(2))
  // console.log(days)
  let userData = {
    "default_profile": response.default_profile,
    "default_profile_image": response.default_profile_image,
    "favourites_count": response.favourites_count,
    "followers_count" :response.followers_count, 
    "friends_count": response.friends_count,
    "geo_enabled": response.geo_enabled,
    "lang": 9,
    "statuses_count" : response.statuses_count,
    "verified": response.verified, 
    "average_tweets_per_day" : avg_twts,
    "account_age_days": days
}
console.log(userData)
// console.log(dt)
let prediction = await accountDetectionAPI("twt",userData);
    console.log(prediction);
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      if (message == "Loaded") {
        res = {
          prediction: prediction.Prediction,
          userData: userData,
          username: username,
          fullname: username,
          platform: "Twitter",
        };
        sendResponse(res);
      }
    });


}

//Calls API for account detection
const accountDetectionAPI = async (platform,userData) => {
  const res = await fetch(`http://127.0.0.1:3000/${platform}-bot`, {
    method: "POST",
    body: JSON.stringify(userData),
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
    instaFunction(username);
  }
  else if(tab.url && tab.url.includes("twitter.com/")){
    const username = tab.url.split("/")[3];
    twitterFunction(username)
  }
});

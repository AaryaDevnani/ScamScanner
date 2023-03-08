const instagramAPICall = async(username) => {
  let obj;
  let headers = new Headers({
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.61 Safari/537.36",
    "x-asbd-id": "198387",
    "x-csrftoken": "VXLPx1sgRb8OCHg9c2NKXbfDndz913Yp",
    "x-ig-app-id": "936619743392459",
    "x-ig-www-claim": "0"
  });
  const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,{
    method: 'GET',
    headers: headers,
})
  obj = await res.json();
  // console.log(obj)
  return obj.data;
}


chrome.tabs.onUpdated.addListener( async(tabId, tab) => {
  if (tab.url && tab.url.includes("instagram.com/")) {
    const username = tab.url.split("/")[3];
    if (username === "p") {
      console.log("This is a post, please open the profile.");
    } else {
      console.log(username);
      let response = await instagramAPICall(username)
      console.log(response)
      
      
    }

  }
});


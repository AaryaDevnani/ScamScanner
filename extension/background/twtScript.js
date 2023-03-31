console.log("Hello from content script");

function scrapeData() {
  let friendsCount = document.querySelector("div.r-13awgt0:nth-child(4) > div:nth-child(1) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1)").innerHTML 
  let followersCount = document.querySelector("div.r-13awgt0:nth-child(4) > div:nth-child(2) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1)").innerHTML
  
  console.log(numFol)
}

let loadfunction = window.onload;
window.onload = function (event) {
  scrapeData()
  if (loadfunction) loadfunction(event);
};

console.log("Hello from content script");

function scrapeData(sizeString) {
  numFol = document.getElementsByClassName("r-qvutc0");
  console.log(numFol)
}

let loadfunction = window.onload;
window.onload = function (event) {
  scrapeData
  if (loadfunction) loadfunction(event);
};

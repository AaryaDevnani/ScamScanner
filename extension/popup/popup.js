const togg = document.getElementById("tot1");
const togg2 = document.getElementById("tot2");
const btn1 = document.getElementById("togg1");
const btn2 = document.getElementById("togg2");

btn1.onclick = function () {
    togg.style.display = "block";
    togg2.style.display = "none";
    btn1.style.cssText = "background-color: rgb(115, 172, 115); border-color: rgb(115, 172, 115); border-style: none;";
    btn2.style.cssText = "border: none; background-color: rgba(186, 255, 186, 0.786);";
};
btn2.onclick = function () {
    togg.style.display = "none";
    togg2.style.display = "block";
    btn2.style.cssText = "background-color: rgb(115, 172, 115); border-color: rgb(115, 172, 115); border-style: none;";
    btn1.style.cssText = "border: none; background-color: rgba(186, 255, 186, 0.786);";
};
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //Prediction comes here
    console.log(message)
    return true;
})
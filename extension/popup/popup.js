const togg = document.getElementById("tot1");
const togg2 = document.getElementById("tot2");
const btn1 = document.getElementById("togg1");
const btn2 = document.getElementById("togg2");
const bg = document.getElementById("bg");

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

function predictionComplete(prediction){
    console.log(prediction)
    // console.log(prediction)
    if(prediction === "Bot Account"){
        bg.style.backgroundColor = "#F46D75"
    }
}

  chrome.runtime.sendMessage("Loaded", async function (response) {
    let res = await response;
    let prediction = res.prediction;
    let userData = res.userData;
    let username = res.username;
    let fullname = res.fullname;
    console.log(res)
    predictionComplete(prediction);
  });
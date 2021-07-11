const widget = document.querySelector(".ccc-widget")
const tab = document.querySelector(".tabContainer")
const logo = document.querySelector(".cryptocompare-logo");

var eth = document.getElementById("eth");
var btc = document.getElementById("btc");
var scripts = document.getElementsByTagName("script");
var embedder = scripts[0];
var def = "BTC";
var ethCounter = 0;
var btcCounter = 0;

const fetch = mark => {
  if(ethCounter < 1 || btcCounter < 1){
    baseUrl = "https://widgets.cryptocompare.com/";
    var appName = encodeURIComponent(window.location.hostname);
    if(appName==""){appName="local";}
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      var theUrl = baseUrl+`serve/v3/coin/chart?fsym=${mark}&tsyms=USD,EUR,CNY`;
      s.src = theUrl + (theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
  }
    if(mark === "BTC"){
        eth.style.color = "rgb(114, 20, 206)";
        eth.style.backgroundColor = "#fff";
        btc.style.backgroundColor = "rgb(114, 20, 206)";
        btc.style.color = "#fff";
        embedder.parentNode.querySelector(".ethereum").style.display = "none";
        if(btcCounter < 1){
          embedder.parentNode.querySelector(".bitcoin").appendChild(s);
        }
        embedder.parentNode.querySelector(".bitcoin").style.display = "block";
        btcCounter += 1;
    }else if(mark === "ETH"){
      btc.style.color = "rgb(114, 20, 206)";
      btc.style.backgroundColor = "#fff";
      eth.style.backgroundColor = "rgb(114, 20, 206)";
      eth.style.color = "#fff";
        embedder.parentNode.querySelector(".bitcoin").style.display = "none";
        if(ethCounter < 1){
          embedder.parentNode.querySelector(".ethereum").appendChild(s);
        }
        embedder.parentNode.querySelector(".ethereum").style.display = "block";
        ethCounter += 1;
    }
}
var fixer = e => {
  if(e.target.id === "eth"){
    def = 'ETH'
    fetch(def);
  }else {
    def = 'BTC'
    fetch(def);
  }
}
btc.onclick = e => fixer(e);
eth.onclick = e => fixer(e);
fetch(def);

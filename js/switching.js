function switchScenes(){
    // document.getElementById("widget").src= (title == "ro" || title == "-") ? "js1.js" : "js2.js";
    document.getElementById("scene").src= "js/portfolio.js";
    $('#canvas').load(document.URL + ' #canvasMiddle');
}

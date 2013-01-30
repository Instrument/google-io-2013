/*
* jsAscii 0.1
* Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
* MIT License [http://www.nihilogic.dk/licenses/mit-license.txt]
*/


var aDefaultCharList = (" .,:;i1tfLCG08@").split("");
// var aDefaultColorCharList = (" CGO08@").split("");

// convert img element to ascii
function asciifyImage(oImg) {
  var oAscii = document.getElementById('ascii-canvas');
  // var oAscii2 = document.getElementById('ascii-canvas2');
  // var oAscii3 = document.getElementById('ascii-canvas3');
  var aCharList = aDefaultCharList;

  if (!oImg.width || oImg.width < 1) { return; }
  if (!oImg.height || oImg.height < 1) { return; }

  var iWidth = oImg.width;
  var iHeight = oImg.height;

  var oCtx = oImg.getContext('2d');
  var oImgData = oCtx.getImageData(0, 0, iWidth, iHeight).data;

  var strChars = "";
  var strChars2 = "";
  var strChars3 = "";

  for (var y = 0; y < iHeight; y += 8) {
    for (var x = 0; x < iWidth; x += 4) {
      var iOffset = (y*iWidth + x) * 4;

      var iRed = oImgData[iOffset];
      var iGreen = oImgData[iOffset + 1];
      var iBlue = oImgData[iOffset + 2];
      var iAlpha = oImgData[iOffset + 3];

      var iCharIdx;
      if (iAlpha === 0) {
        iCharIdx = 0;
      } else {
        var fBrightness = (0.3*iRed + 0.59*iGreen + 0.11*iBlue) / 255;
        iCharIdx = (aCharList.length-1) - Math.round(fBrightness * (aCharList.length-1));
      }

      var strThisChar = aCharList[iCharIdx];

      if (strThisChar == " ") {
        strThisChar = "&nbsp;";
      } else {
        // strThisChar = aCharList[Math.ceil(Math.random() * (aCharList.length-2))\;
      }

      // if ((iBlue > 200) && (iGreen < 200)) {
        strChars  += strThisChar;
        strChars2 += "&nbsp;";
        strChars3 += "&nbsp;";
      // } else if (iGreen > 200) {
      //   strChars  += "&nbsp;";
      //   strChars2 += strThisChar;
      //   strChars3 += "&nbsp;";
      // } else {
      //   strChars  += "&nbsp;";
      //   strChars2 += "&nbsp;";
      //   strChars3 += strThisChar;
      // }
    }
    strChars += "\n";
    // strChars2 += "\n";
    // strChars3 += "\n";
  }
  // can't get a span or div to flow like an img element, but a table works?
  oAscii.innerHTML = strChars;
  // oAscii2.innerHTML = strChars2;
  // oAscii3.innerHTML = strChars3;

}
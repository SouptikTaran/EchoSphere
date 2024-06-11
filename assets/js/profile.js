function openPop(e){
  z = e + "popup";
  document.getElementById('popupOverlay').style.display = "block";
  document.getElementById(z).style.display = "block";
}
function closePop(e){
  console.l
  z = e.substring(0,4);
  z = z + "popup";
  document.getElementById('popupOverlay').style.display = "none";
  document.getElementById(z).style.display = "none";
}
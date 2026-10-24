var cacBan=document.querySelectorAll(".table-choice");
var daChon=localStorage.getItem("banDaChon");
cacBan.forEach(function(nut){
  var ma=nut.dataset.ban;
  if(!ma)return;
  if(ma===daChon)nut.classList.add("selected");
  nut.onclick=function(){
    cacBan.forEach(function(b){b.classList.remove("selected")});
    nut.classList.add("selected");
    localStorage.setItem("banDaChon",ma);
    document.getElementById("tb").innerText="Bạn đã chọn bàn "+ma+". Đang chuyển tới thực đơn...";
    setTimeout(function(){location.href="pages/diner-menu.html"},800);
  };
});
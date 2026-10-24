function dat(id,t){document.getElementById(id).innerText=t}


var PH=[{ma:101,gio:"12:20",sao:4,nd:"Món ngon nhưng chờ lâu.",xong:false},{ma:102,gio:"12:35",sao:5,nd:"Giá phù hợp, nhân viên nhiệt tình.",xong:false}];
var TUKHOA={"Chất lượng món":["ngon","dở","nhạt","tươi"],"Thời gian chờ":["chờ","lâu","chậm"],"Giá cả":["giá","đắt","rẻ"],"Phục vụ":["nhân viên","phục vụ","nhiệt tình"]};
var chon=0,nhan=[];
function chuDe(t){
  t=t.toLowerCase();var kq=[];
  for(var c in TUKHOA){var w=TUKHOA[c].filter(function(x){return t.indexOf(x)>=0})[0];if(w)kq.push({chu:c,tu:w})}
  return kq;
}
function ve(){
  var tt=document.getElementById("ft").value==="1",c=document.getElementById("fc").value,h="",n=0;
  PH.forEach(function(p,i){
    if(p.xong!==tt||(c&&!chuDe(p.nd).some(function(x){return x.chu===c})))return;
    if(!tt)n++;
    h+='<article class="feedback-card'+(i===chon?' active-feedback':'')+'" onclick="chonPH('+i+')"><div class="row"><strong>Đơn #'+p.ma+'</strong><span class="muted">'+p.gio+'</span></div><p class="stars">'+"★".repeat(p.sao)+"☆".repeat(5-p.sao)+'</p><blockquote>'+p.nd+'</blockquote><span class="badge '+(p.xong?'green':'orange')+'">'+(p.xong?'Đã xử lý':'Chưa xử lý')+'</span></article>';
  });
  document.getElementById("dsph").innerHTML=h||'<p class="muted">Không có phản hồi.</p>';
  dat("n",n+" phản hồi cần xem");
  phanTich();
}
function chonPH(i){chon=i;nhan=chuDe(PH[i].nd).map(function(x){return x.chu});ve()}
function phanTich(){
  var p=PH[chon],g=chuDe(p.nd);
  document.getElementById("pt").innerHTML='<span class="badge orange">AI mô phỏng</span><h2>Phân tích phản hồi #'+p.ma+'</h2><h3>“'+p.nd+'”</h3><p><strong>Chủ đề đề xuất</strong></p><div class="chips">'+(nhan.length?nhan.map(function(x){return'<span class="badge blue">'+x+'</span>'}).join(""):'<span class="badge gray">Chưa có nhãn</span>')+'</div><div class="sub-panel"><strong>Vì sao có kết quả này?</strong><p>'+(g.map(function(x){return'Từ “'+x.tu+'” gợi ý '+x.chu.toLowerCase()}).join("; ")||"Chưa nhận ra từ khóa nào")+'. Một phản hồi có thể có nhiều chủ đề.</p></div>';
}
function taoLai(){nhan=chuDe(PH[chon].nd).map(function(x){return x.chu});phanTich()}
function suaNhan(){var s=prompt("Nhập các nhãn, cách nhau bằng dấu phẩy:",nhan.join(", "));if(s!==null){nhan=s.split(",").map(function(x){return x.trim()}).filter(Boolean);phanTich()}}
function tuChoi(){nhan=[];phanTich()}
function luuNhan(){PH[chon].nhan=nhan.slice();alert("Đã lưu nhãn: "+(nhan.join(", ")||"không có"))}
function daXuLy(){PH[chon].xong=true;chon=0;ve()}
chonPH(0);
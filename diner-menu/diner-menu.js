var MON_MAU=[
{id:1,ma:"M01",ten:"Sushi cá hồi",mota:"Cơm giấm vo viên phủ cá hồi tươi",gia:85000,phut:8,loai:"chinh",ban:true,anh:"sushi-ca-hoi.svg",tp:"Cá hồi · cơm giấm · wasabi · gừng hồng"},
{id:2,ma:"M02",ten:"Ramen miso cay",mota:"Nước dùng miso cay, mì dai, thịt xá xíu",gia:95000,phut:15,loai:"chinh",ban:true,cay:true,anh:"ramen-miso.svg",tp:"Mì ramen · nước dùng miso · xá xíu · trứng · hành lá"},
{id:3,ma:"M03",ten:"Tempura tôm",mota:"Tôm chiên giòn kiểu Nhật, kèm sốt tentsuyu",gia:75000,phut:10,loai:"nhe",ban:true,anh:"tempura-tom.svg",tp:"Tôm · bột tempura · củ cải daikon · sốt tentsuyu"},
{id:4,ma:"M04",ten:"Udon bò",mota:"Mì udon sợi to trong nước dùng dashi",gia:79000,phut:12,loai:"chinh",ban:true,anh:"udon-bo.svg",tp:"Mì udon · thịt bò · kamaboko · hành lá"},
{id:5,ma:"M05",ten:"Takoyaki",mota:"Bánh bạch tuộc nướng, sốt và mayonnaise",gia:55000,phut:10,loai:"nhe",ban:false,anh:"takoyaki.svg",tp:"Bạch tuộc · bột mì · sốt takoyaki · cá bào"},
{id:6,ma:"M06",ten:"Cơm gà Teriyaki",mota:"Gà áp chảo sốt teriyaki, cơm dẻo",gia:65000,phut:12,loai:"chinh",ban:true,anh:"com-ga-teriyaki.svg",tp:"Thịt gà · cơm · bông cải xanh · mè rang"},
{id:7,ma:"M07",ten:"Salad rong biển",mota:"Rong biển wakame, mè rang, sốt giấm",gia:45000,phut:5,loai:"chay",ban:true,anh:"salad-rong-bien.svg",tp:"Rong biển · dưa leo · cà rốt · mè rang"},
{id:8,ma:"M08",ten:"Edamame",mota:"Đậu nành Nhật luộc rắc muối biển",gia:35000,phut:5,loai:"chay",ban:true,anh:"edamame.svg",tp:"Đậu nành edamame · muối biển"},
{id:9,ma:"M09",ten:"Trà xanh matcha",mota:"Matcha nguyên chất, vị thanh nhẹ",gia:40000,phut:3,loai:"uong",ban:true,anh:"tra-matcha.svg",tp:"Bột matcha · nước · sữa (tùy chọn)"},
{id:10,ma:"M10",ten:"Soda Ramune",mota:"Soda chanh kiểu Nhật, mát lạnh",gia:30000,phut:2,loai:"uong",ban:true,anh:"soda-ramune.svg",tp:"Soda · chanh · đường"}];
var MON=JSON.parse(localStorage.getItem("mon")||"null")||MON_MAU;
function tien(n){return n.toLocaleString("vi-VN")+" đ"}
function layGio(){var g=JSON.parse(localStorage.getItem("gio")||"null");if(!g){g=[{id:6,sl:2,ghichu:"Ít cơm, thêm rau."},{id:9,sl:1,ghichu:"Ít đá."}];localStorage.setItem("gio",JSON.stringify(g))}return g}
function themGio(id,sl,gc){var g=layGio(),x=g.filter(function(i){return i.id==id})[0];if(x){x.sl=Math.min(20,x.sl+sl);if(gc)x.ghichu=gc}else g.push({id:+id,sl:sl,ghichu:gc});localStorage.setItem("gio",JSON.stringify(g))}
function capNhatHeader(){var n=0;layGio().forEach(function(g){n+=g.sl});var e=document.getElementById("giomon");if(e)e.innerText="Giỏ món · "+n+" phần";var b=document.getElementById("ban");if(b)b.innerText="Bàn "+(localStorage.getItem("banDaChon")||"B01")}
function dat(id,t){document.getElementById(id).innerText=t}


var loai="",goiY=[];
var TEN={chinh:"Món chính",chay:"Món chay",uong:"Đồ uống",nhe:"Ăn nhẹ"};
function ve(){
  var tu=document.getElementById("tim").value.toLowerCase(),h="",n=0;
  MON.forEach(function(m){
    if(m.hien===false||!m.ban||m.luutru||m.ten.toLowerCase().indexOf(tu)<0||(loai&&m.loai!==loai))return;
    n++;
    h+='<article class="food-card"><img src="../images/'+(m.anh||"mon-moi.svg")+'" alt="'+m.ten+'"><div class="food-body"><div class="row"><span class="badge blue">'+TEN[m.loai]+'</span><small>'+m.phut+' phút</small></div><h2>'+m.ten+'</h2><p>'+m.mota+'</p><div class="row"><strong>'+tien(m.gia)+'</strong><a class="button small" href="diner-dish-detail.html?id='+m.id+'">Xem &amp; chọn món</a></div></div></article>';
  });
  document.getElementById("luoi").innerHTML=h||"<p>Không có món phù hợp.</p>";
  dat("dem-mon",n+" món");
}
function chonLoai(l,nut){
  loai=l;
  document.querySelectorAll("#loc button").forEach(function(b){b.classList.add("secondary")});
  nut.classList.remove("secondary");ve();
}
function goiYMon(){
  var chay=document.getElementById("an").value==="chay",max=+document.getElementById("max").value.replace(/\D/g,""),khongCay=document.getElementById("cay").value==="khong";
  goiY=MON.filter(function(m){return m.ban&&m.hien!==false&&!m.luutru&&(chay?m.loai==="chay":(m.loai==="chinh"||m.loai==="nhe"))&&m.gia<=max&&!(khongCay&&m.cay)}).sort(function(a,b){return a.gia-b.gia}).slice(0,2);
  var kq=document.getElementById("kq");
  document.getElementById("ok").innerText=goiY.length?"Chấp nhận · thêm "+goiY[0].ten:"Chấp nhận";
  if(!goiY.length){kq.innerHTML="<h3>Chưa có món phù hợp</h3><p>Hãy thử nới điều kiện.</p>";return}
  kq.innerHTML="<h3>"+goiY.length+" món phù hợp</h3><p>"+goiY.map(function(m){return m.ten+" · "+tien(m.gia)}).join("<br>")+"</p><small>Vì đều là món "+(chay?"chay":"mặn")+(khongCay?", không cay":"")+" và trong mức giá bạn chọn.</small>";
}
function chapNhan(){if(!goiY.length)return;themGio(goiY[0].id,1,"");capNhatHeader();alert("Đã thêm "+goiY[0].ten+" vào giỏ")}
function tuChoi(){goiY=[];document.getElementById("kq").innerHTML="<p>Bạn đã từ chối gợi ý này.</p>"}
function luuGoiY(){localStorage.setItem("goiY",JSON.stringify(goiY));alert("Đã lưu gợi ý")}
ve();goiYMon();capNhatHeader();
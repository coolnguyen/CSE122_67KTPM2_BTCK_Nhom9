var MON_MAU=[
{id:1,ma:"M01",ten:"Sushi cá hồi",mota:"Cơm giấm vo viên phủ cá hồi tươi",gia:85000,phut:8,loai:"chinh",ban:true,anh:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",tp:"Cá hồi · cơm giấm · wasabi · gừng hồng"},
{id:2,ma:"M02",ten:"Ramen miso cay",mota:"Nước dùng miso cay, mì dai, thịt xá xíu",gia:95000,phut:15,loai:"chinh",ban:true,cay:true,anh:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",tp:"Mì ramen · nước dùng miso · xá xíu · trứng · hành lá"},
{id:3,ma:"M03",ten:"Tempura tôm",mota:"Tôm chiên giòn kiểu Nhật, kèm sốt tentsuyu",gia:75000,phut:10,loai:"nhe",ban:true,anh:"https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=600&q=80",tp:"Tôm · bột tempura · củ cải daikon · sốt tentsuyu"},
{id:4,ma:"M04",ten:"Udon bò",mota:"Mì udon sợi to trong nước dùng dashi",gia:79000,phut:12,loai:"chinh",ban:true,anh:"https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80",tp:"Mì udon · thịt bò · kamaboko · hành lá"},
{id:5,ma:"M05",ten:"Takoyaki",mota:"Bánh bạch tuộc nướng, sốt và mayonnaise",gia:55000,phut:10,loai:"nhe",ban:true,anh:"https://images.unsplash.com/photo-1752079437572-823698bbf26c?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0",du:["https://images.unsplash.com/photo-1751094364516-02b351f9c277?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0","https://images.unsplash.com/photo-1742633882704-41ec3a57dbb7?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0","https://images.unsplash.com/photo-1756918341033-c03cfbccee63?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0"],tp:"Bạch tuộc · bột mì · sốt takoyaki · cá bào"},
{id:6,ma:"M06",ten:"Cơm gà Teriyaki",mota:"Gà áp chảo sốt teriyaki, cơm dẻo",gia:65000,phut:12,loai:"chinh",ban:true,anh:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",tp:"Thịt gà · cơm · bông cải xanh · mè rang"},
{id:7,ma:"M07",ten:"Salad rong biển",mota:"Rong biển wakame, mè rang, sốt giấm",gia:45000,phut:5,loai:"chay",ban:true,anh:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",tp:"Rong biển · dưa leo · cà rốt · mè rang"},
{id:8,ma:"M08",ten:"Edamame",mota:"Đậu nành Nhật luộc rắc muối biển",gia:35000,phut:5,loai:"chay",ban:true,anh:"https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?auto=format&fit=crop&w=600&q=80",tp:"Đậu nành edamame · muối biển"},
{id:9,ma:"M09",ten:"Trà xanh matcha",mota:"Matcha nguyên chất, vị thanh nhẹ",gia:40000,phut:3,loai:"uong",ban:true,anh:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0",du:["https://images.unsplash.com/photo-1766426910014-63a302fa137e?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0","https://images.unsplash.com/photo-1582785513054-8d1bf9d69c1a?fm=jpg&q=70&w=800&auto=format&fit=crop&ixlib=rb-4.1.0"],tp:"Bột matcha · nước · sữa (tùy chọn)"},
{id:10,ma:"M10",ten:"Soda Ramune",mota:"Soda chanh kiểu Nhật, mát lạnh",gia:30000,phut:2,loai:"uong",ban:true,anh:"https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",tp:"Soda · chanh · đường"}];
var MON=JSON.parse(localStorage.getItem("mon")||"null")||MON_MAU;

var ANH_LOI="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#eef3fb"/><text x="300" y="210" font-family="Arial" font-size="28" text-anchor="middle" fill="#63738a">Ảnh món ăn</text></svg>');

MON.forEach(function(m){var g=MON_MAU.filter(function(x){return x.id==m.id})[0];if(g){m.anh=g.anh;m.du=g.du;m.fit=g.fit}});

function loiAnh(img){var d=(img.dataset.du||"").split("|").filter(Boolean),i=+(img.dataset.n||0);if(i<d.length){img.dataset.n=i+1;img.src=d[i]}else{img.onerror=null;img.src=ANH_LOI}}
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
    h+='<article class="food-card"><img src="'+m.anh+'" alt="'+m.ten+'" style="object-fit:'+(m.fit||"cover")+'" data-du="'+(m.du||[]).join("|").replace(/&/g,"&amp;")+'" onerror="loiAnh(this)"><div class="food-body"><div class="row"><span class="badge blue">'+TEN[m.loai]+'</span><small>'+m.phut+' phút</small></div><h2>'+m.ten+'</h2><p>'+m.mota+'</p><div class="row"><strong>'+tien(m.gia)+'</strong><a class="button small" href="diner-dish-detail.html?id='+m.id+'">Xem &amp; chọn món</a></div></div></article>';
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
  kq.innerHTML="<h3>"+goiY.length+" món phù hợp</h3><p>"+goiY.map(function(m){return m.ten+" · "+tien(m.gia)}).join("<br>")+"</p><small>Vì đều là món "+(chay?"chay":"mặn")+(khongCay?", không cay":"")+" và trong mức giá bạn chọn sinh động.</small>";
}
function chapNhan(){if(!goiY.length)return;themGio(goiY[0].id,1,"");capNhatHeader();alert("Đã thêm "+goiY[0].ten+" vào giỏ")}
function tuChoi(){goiY=[];document.getElementById("kq").innerHTML="<p>Bạn đã từ chối gợi ý này.</p>"}
function luuGoiY(){localStorage.setItem("goiY",JSON.stringify(goiY));alert("Đã lưu gợi ý")}
ve();goiYMon();capNhatHeader();
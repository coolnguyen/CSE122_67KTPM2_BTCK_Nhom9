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
// đơn đã hoàn thành: mon = [id, số lượng, đơn giá lúc bán]
var DON=[{ma:101,ngay:"2026-10-01",cho:12,mon:[[6,2,65000],[9,1,40000]]},{ma:102,ngay:"2026-10-01",cho:18,mon:[[2,1,95000],[10,1,30000]]}];
function tien(n){return n.toLocaleString("vi-VN")+" đ"}
function timMon(id){return MON.filter(function(m){return m.id==id})[0]}
function dat(id,t){document.getElementById(id).innerText=t}


function tinh(){
  var tu=document.getElementById("tu").value,den=document.getElementById("den").value;
  var d=DON.filter(function(x){return x.ngay>=tu&&x.ngay<=den});
  var tong=0,ph=0,cho=0,dem={},ct=[],chos=[];
  d.forEach(function(x){
    var t=0;
    x.mon.forEach(function(i){t+=i[1]*i[2];ph+=i[1];var ten=timMon(i[0]).ten;dem[ten]=(dem[ten]||0)+i[1]});
    tong+=t;ct.push(tien(t));cho+=x.cho;chos.push(x.cho);
  });
  dat("s1",tien(tong));dat("s2",d.length+" đơn");dat("s3",ph+" phần");
  dat("s4",d.length?Math.round(cho/d.length)+" phút":"Chưa có dữ liệu");
  var ten=Object.keys(dem),mx=1,h="";
  ten.forEach(function(k){mx=Math.max(mx,dem[k])});
  ten.forEach(function(k){h+='<div class="bar-row"><span>'+k+'</span><div class="bar-track"><div class="bar" style="width:'+Math.round(dem[k]/mx*100)+'%">'+dem[k]+'</div></div><strong>'+dem[k]+' phần</strong></div>'});
  document.getElementById("ds-mon").innerHTML=h||'<p class="muted">Chưa có dữ liệu</p>';
  document.getElementById("congthuc").innerHTML=d.length
    ?'<div class="summary-line"><span>Giá trị đơn hoàn thành</span><strong>'+tien(tong)+'</strong></div><p class="muted">'+ct.join(" + ")+' = giá trị '+d.length+' đơn hoàn thành.</p><div class="summary-line"><span>Chờ trung bình</span><strong>'+Math.round(cho/d.length)+' phút</strong></div><p class="muted">('+chos.join(" phút + ")+' phút) / '+d.length+' = thời gian chờ trung bình.</p>'
    :'<p class="muted">Không có dữ liệu: hiển thị tổng 0; thời gian chờ là “Chưa có dữ liệu”.</p>';
}
function luuBaoCao(){
  localStorage.setItem("baoCao",JSON.stringify({tu:document.getElementById("tu").value,den:document.getElementById("den").value,tong:document.getElementById("s1").innerText}));
  alert("Đã lưu báo cáo");
}
tinh();
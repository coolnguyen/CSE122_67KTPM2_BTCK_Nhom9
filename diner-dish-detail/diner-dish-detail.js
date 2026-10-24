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
function timMon(id){return MON.filter(function(m){return m.id==id})[0]}
function layGio(){var g=JSON.parse(localStorage.getItem("gio")||"null");if(!g){g=[{id:6,sl:2,ghichu:"Ít cơm, thêm rau."},{id:9,sl:1,ghichu:"Ít đá."}];localStorage.setItem("gio",JSON.stringify(g))}return g}
function themGio(id,sl,gc){var g=layGio(),x=g.filter(function(i){return i.id==id})[0];if(x){x.sl=Math.min(20,x.sl+sl);if(gc)x.ghichu=gc}else g.push({id:+id,sl:sl,ghichu:gc});localStorage.setItem("gio",JSON.stringify(g))}
function capNhatHeader(){var n=0;layGio().forEach(function(g){n+=g.sl});var e=document.getElementById("giomon");if(e)e.innerText="Giỏ món · "+n+" phần";var b=document.getElementById("ban");if(b)b.innerText="Bàn "+(localStorage.getItem("banDaChon")||"B01")}
function dat(id,t){document.getElementById(id).innerText=t}


var m=timMon(new URLSearchParams(location.search).get("id"))||MON[0],sl=2;
var TEN={chinh:"Món chính",chay:"Món chay",uong:"Đồ uống",nhe:"Ăn nhẹ"};
var anh=document.getElementById("anh");
anh.src="../images/"+(m.anh||"mon-moi.svg");anh.alt=m.ten;
dat("loai",TEN[m.loai]);dat("tt",m.ban?"Còn phục vụ":"Tạm hết");
document.getElementById("tt").className="badge "+(m.ban?"green":"orange");
dat("ten",m.ten);dat("mota",m.mota);dat("tp",m.tp||"Nguyên liệu tươi theo ngày");
dat("phut","Thời gian chế biến tham khảo: "+m.phut+" phút");dat("gia",tien(m.gia));
function doiSL(n){
  sl=Math.max(1,Math.min(20,sl+n));
  dat("sl",sl);dat("tong",tien(sl*m.gia));dat("nut","Thêm "+sl+" phần vào giỏ");
}
function demChu(){dat("dem",document.getElementById("ghichu").value.length+" / 200")}
function them(){
  if(!m.ban){alert("Món đang tạm hết");return}
  themGio(m.id,sl,document.getElementById("ghichu").value);
  capNhatHeader();alert("Đã thêm "+sl+" phần "+m.ten+" vào giỏ");
}
doiSL(0);demChu();capNhatHeader();
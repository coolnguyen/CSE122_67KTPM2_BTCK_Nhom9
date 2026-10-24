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
function luuMon(){localStorage.setItem("mon",JSON.stringify(MON))}
function dat(id,t){document.getElementById(id).innerText=t}


var trang=1,CN=5,TEN={chinh:"Món chính",chay:"Món chay",uong:"Đồ uống",nhe:"Ăn nhẹ"};
function ds(){
  var t=document.getElementById("tim").value.toLowerCase(),d=document.getElementById("dm").value,l=document.getElementById("tt").value==="luu";
  return MON.filter(function(m){return !!m.luutru===l&&(!d||m.loai===d)&&(m.ma+m.ten).toLowerCase().indexOf(t)>=0}).sort(function(a,b){return a.ma<b.ma?-1:1});
}
function ve(){
  var a=ds(),tong=Math.max(1,Math.ceil(a.length/CN));
  if(trang>tong)trang=tong;
  var p=a.slice((trang-1)*CN,trang*CN),h="";
  p.forEach(function(m){
    var mau=m.luutru?"gray":(m.ban?"green":"orange"),chu=m.luutru?"Đã lưu trữ":(m.ban?"Còn bán":"Tạm hết");
    h+='<tr><td><img src="../images/'+(m.anh||"mon-moi.svg")+'" class="thumb" alt="'+m.ten+'"></td><td>'+m.ma+' · '+m.ten+'</td><td>'+TEN[m.loai]+'</td><td>'+tien(m.gia)+'</td><td>'+m.phut+' phút</td><td><span class="badge '+mau+'">'+chu+'</span></td><td><button class="button secondary small" onclick="sua('+m.id+')">Chỉnh sửa</button></td></tr>';
  });
  document.getElementById("bang").innerHTML=h||'<tr><td colspan="7">Không có món nào.</td></tr>';
  dat("tt-trang","Hiển thị "+p.length+" món · Trang "+trang+" / "+tong);
}
function doiTrang(n){trang=Math.max(1,trang+n);ve()}
function sua(id){
  var m=timMon(id),g=prompt("Giá mới cho "+m.ten+" (đ):",m.gia);
  if(g===null)return;
  g=parseInt(g);
  if(isNaN(g)||g<0){alert("Giá không hợp lệ");return}
  m.gia=g;
  m.ban=confirm("Món còn bán? (OK = còn bán, Hủy = tạm hết)");
  m.luutru=confirm("Chuyển món vào mục Đã lưu trữ? (lịch sử đơn vẫn được giữ)");
  luuMon();ve();
}
function themMon(){
  var ten=prompt("Tên món mới:");
  if(!ten)return;
  var gia=parseInt(prompt("Giá (đ):","30000"));
  if(isNaN(gia)||gia<0){alert("Giá không hợp lệ");return}
  var id=0,so=0;
  MON.forEach(function(m){id=Math.max(id,m.id);so=Math.max(so,parseInt(m.ma.slice(1)))});
  MON.push({id:id+1,ma:"M"+(so+1<10?"0":"")+(so+1),ten:ten,mota:"Món mới",gia:gia,phut:10,loai:"chinh",ban:true,anh:"mon-moi.svg"});
  luuMon();ve();
}
ve();
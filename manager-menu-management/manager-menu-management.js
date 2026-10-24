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
    var imgSrc = m.anh && m.anh.startsWith('http') ? m.anh : ('../images/' + (m.anh || "mon-moi.svg"));
    h+='<tr><td><img src="'+imgSrc+'" class="thumb" alt="'+m.ten+'" data-du="'+(m.du||[]).join("|").replace(/&/g,"&amp;")+'" onerror="loiAnh(this)"></td><td>'+m.ma+' · '+m.ten+'</td><td>'+TEN[m.loai]+'</td><td>'+tien(m.gia)+'</td><td>'+m.phut+' phút</td><td><span class="badge '+mau+'">'+chu+'</span></td><td><button class="button secondary small" onclick="sua('+m.id+')">Chỉnh sửa</button></td></tr>';
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
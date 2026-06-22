// ==========================
// Firebase
// ==========================

const firebaseConfig = {

apiKey:
"AIzaSyCPSWk7VfhhEROFY_EdPyP56kS66tTQZ4",

authDomain:
"kyudai-cat-map.firebaseapp.com",

projectId:
"kyudai-cat-map",

storageBucket:
"kyudai-cat-map.firebasestorage.app",

messagingSenderId:
"164561348047",

appId:
"1:164561348047:web:e3733a0ea44a3e37339eba"

};


firebase.initializeApp(firebaseConfig);


const db =
firebase.firestore();




// ==========================
// 変数
// ==========================

let map;

let markers = [];

let posts = [];





// ==========================
// 地図作成
// ==========================

function createMap(){


map =
L.map("big-map")
.setView(
[
33.5904,
130.2220
],
16
);



L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:
"© OpenStreetMap contributors"
}
)
.addTo(map);


}



createMap();







// ==========================
// データ取得
// ==========================


db.collection("posts")
.orderBy(
"createdAt",
"desc"
)
.get()
.then(snapshot=>{


snapshot.forEach(doc=>{


const data =
doc.data();


posts.push(data);


});



displayMarkers(
posts
);



});









// ==========================
// マーカー表示
// ==========================


function displayMarkers(list){


clearMarkers();



list.forEach(post=>{



if(!post.location)
return;



if(!post.cats)
return;




post.cats.forEach(
(cat,index)=>{



const icon =
createCatIcon(
cat.pattern
);




const marker =
L.marker(
[
post.location.lat,
post.location.lng
],
{
icon:icon
}
)
.addTo(map);




marker.bindPopup(


`

<h3>
🐈 猫${index+1}
</h3>


<p>
柄：
${cat.pattern}
</p>


<p>
🌸さくら：
${cat.sakura || "不明"}
</p>



<p>
特徴：
${
cat.features?.join("・")
||
"なし"
}

</p>



<p>
日時：
${post.date || ""}
</p>



`

);




markers.push(marker);



});


});



}






// ==========================
// ピン作成
// ==========================


function createCatIcon(pattern){


let file="";



switch(pattern){


case "黒":
file="pin-icon-black.jpeg";
break;


case "灰":
file="pin-icon-gray.jpeg";
break;


case "白":
file="pin-icon-white.jpeg";
break;


case "茶":
file="pin-icon-cha.jpeg";
break;


case "三毛":
file="pin-icon-mike.jpeg";
break;


case "キジ・サバ":
file="pin-icon-kijitora.jpeg";
break;


case "白黒":
file="pin-icon-sirokuro.jpeg";
break;


case "サビ":
file="pin-icon-sabi.jpeg";
break;


case "その他":
file="pin-icon-sonota.jpeg";
break;


default:
file="pin-icon-humei.jpeg";

}



return L.icon({

iconUrl:
"assets/pins/"+file,


iconSize:
[
45,
45
],


iconAnchor:
[
22,
45
]


});


}






// ==========================
// マーカー削除
// ==========================


function clearMarkers(){


markers.forEach(
m=>{
map.removeLayer(m);
}
);


markers=[];


}



// ==========================
// フィルター処理
// ==========================


const applyBtn =
document.getElementById(
"apply-filter"
);



if(applyBtn){


applyBtn.onclick =
()=>{


const filtered =
posts.filter(post=>{

if(!post.cats)
return false;

// ------------------
// 期間
// ------------------

const dateFilter =
document.getElementById(
"date-filter"
)?.value || "all";

if(
dateFilter !== "all" &&
post.date
){

const postDate =
new Date(post.date);

const limit =
new Date();

limit.setDate(
limit.getDate() -
Number(dateFilter)
);

if(postDate < limit){
return false;
}

}

// ------------------
// 猫ごとの判定
// ------------------

return post.cats.some(cat=>{

// ------------------
// 柄
// ------------------

const selectedPattern =
document.getElementById(
"pattern-filter"
)?.value || "all";

if(
selectedPattern !== "all" &&
cat.pattern !== selectedPattern
){
return false;
}

// ------------------
// さくら
// ------------------

const selectedSakura =
document.getElementById(
"sakura-filter"
)?.value || "all";

if(
selectedSakura !== "all" &&
cat.sakura !== selectedSakura
){
return false;
}

// ------------------
// 特徴
// ------------------

const selectedFeature =
document.getElementById(
"feature-filter"
)?.value || "all";

if(
selectedFeature !== "all"
){

if(
!cat.features ||
!cat.features.includes(
selectedFeature
)
){
return false;
}

}

return true;

});

});

displayMarkers(filtered);




};



}









// ==========================
// リセット
// ==========================


const resetBtn =
document.getElementById(
"reset-filter"
);



if(resetBtn){


resetBtn.onclick =
()=>{



const pattern =
document.getElementById(
"pattern-filter"
);


const feature =
document.getElementById(
"feature-filter"
);


const sakura =
document.getElementById(
"sakura-filter"
);



const date =
document.getElementById(
"date-filter"
);

if(date)
date.value="all";

if(pattern)
pattern.value="all";

if(feature)
feature.value="all";

if(sakura)
sakura.value="all";




displayMarkers(
posts
);



};


}








// ==========================
// 初期表示後の調整
// ==========================


window.addEventListener(
"resize",
()=>{


if(map){

map.invalidateSize();

}


});

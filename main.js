// ==========================
// Firebase設定
// ==========================

const firebaseConfig = {

apiKey: "AIzaSyCPSWkc7VfhhEROFY_EdPyP56kS66tTQZ4",

authDomain: "kyudai-cat-map.firebaseapp.com",

projectId: "kyudai-cat-map",

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
// トップマップ作成
// ==========================

function createViewMap(){

const mapElement =
document.getElementById(
"view-map"
);

if(!mapElement) return;

const viewMap =
L.map("view-map")
.setView(
[33.5930,130.2195],
16
);

L.tileLayer(
"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:
"© OpenStreetMap contributors"
}
).addTo(viewMap);

loadPostsToMap(viewMap);

}

// ==========================
// 投稿ピン表示
// ==========================

async function loadPostsToMap(map){

try{

const snapshot =
await db.collection("posts")
.orderBy(
"createdAt",
"desc"
)
.get();

snapshot.forEach(doc=>{

const data =
doc.data();

if(!data.location) return;

let text =
"🐈 猫情報";

if(
data.cats &&
data.cats.length > 0
){

const cat =
data.cats[0];

text +=
"<br><br>柄：" +
cat.pattern;

if(cat.sakura){

text +=
"<br>🌸" +
cat.sakura;

}




if(
cat.features &&
cat.features.length > 0
){

text +=
"<br>特徴：" +
cat.features.join("・");

}

if(data.cats.length > 1){

text +=
"<br><br>他 " +
(data.cats.length - 1) +
"匹";

}

}

L.marker(
[
data.location.lat,
data.location.lng
]
)
.addTo(map)
.bindPopup(text);

});

}
catch(error){

console.log(
"投稿読み込みエラー",
error
);

}

}

// ==========================
// 最新投稿3件
// ==========================

async function loadLatestPosts(){

const area =
document.getElementById(
"latest-posts"
);

if(!area) return;

try{

const snapshot =
await db.collection("posts")
.orderBy(
"createdAt",
"desc"
)
.limit(3)
.get();

area.innerHTML="";

if(snapshot.empty){

area.innerHTML =
"まだ投稿はありません";

return;

}

snapshot.forEach(doc=>{

const data =
doc.data();

const div =
document.createElement("div");

div.className =
"post-card";




const formattedDate =
data.date
?
new Date(data.date).toLocaleString("ja-JP")
:
"";







let text = "";

if(
data.cats &&
data.cats.length
){

data.cats.forEach(
(cat,index)=>{

text +=
`<div class="latest-cat">

<strong>🐈 猫${index+1}</strong><br>

柄：
${cat.pattern}<br>

さくら耳：
${cat.sakura || "不明"}<br>

特徴：
${
cat.features &&
cat.features.length
?
cat.features.join("・")
:
"なし"
}

</div>`;

});


text +=
"<br><small>" +
formattedDate +
"</small>";




}
else{

text =
"目撃情報";

}

div.innerHTML =
text;





text +=
"<br><small>" +
(data.date || "") +
"</small>";




area.appendChild(div);

});

}
catch(error){

area.innerHTML =
"投稿を読み込めませんでした";

console.log(error);

}

}

// ==========================
// 実行
// ==========================

createViewMap();

loadLatestPosts();




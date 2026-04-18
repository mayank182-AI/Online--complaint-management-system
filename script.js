import { db } from "./firebase.js";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// GLOBAL DATA
let data = [];

// ADD COMPLAINT
window.addComplaint = async function(){
  const name = document.getElementById("name").value.trim();
  const title = document.getElementById("title").value.trim();
  const category = document.getElementById("category").value;
  const desc = document.getElementById("desc").value.trim();

  if(!name || !title || !desc){
    alert("⚠ Fill all fields");
    return;
  }

  await addDoc(collection(db,"complaints"),{
    name,title,category,desc,
    status:"Pending",
    created:Date.now()
  });

  showAll();

  document.getElementById("name").value="";
  document.getElementById("title").value="";
  document.getElementById("desc").value="";
}

// READ DATA
window.showAll = async function(){
  const snap = await getDocs(collection(db,"complaints"));
  data = [];

  snap.forEach(docSnap=>{
    data.push({id:docSnap.id,...docSnap.data()});
  });

  render(data);
}

// RENDER
function render(list){
  let p=0,r=0;

  const complaints = document.getElementById("complaints");

  complaints.innerHTML = list.map(c=>{
    c.status==="Pending"?p++:r++;

    return `
    <div class="box">
      <small>ID: ${c.id}</small>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <b>${c.category}</b><br><br>

      <span class="status ${c.status==="Pending"?"red":"green"}">
        ${c.status}
      </span><br><br>

      <button onclick="toggle('${c.id}','${c.status}')">🔄 Toggle</button>
      <button onclick="removeItem('${c.id}')">❌ Delete</button>
    </div>`;
  }).join("");

  document.getElementById("total").innerText = list.length;
  document.getElementById("pending").innerText = p;
  document.getElementById("resolved").innerText = r;
}

// UPDATE
window.toggle = async function(id,status){
  await updateDoc(doc(db,"complaints",id),{
    status: status==="Pending"?"Resolved":"Pending"
  });
  showAll();
}

// DELETE
window.removeItem = async function(id){
  if(confirm("Delete?")){
    await deleteDoc(doc(db,"complaints",id));
    showAll();
  }
}

// SEARCH
window.search = function(){
  let k = document.getElementById("search").value.toLowerCase();

  render(data.filter(c =>
    c.title.toLowerCase().includes(k) ||
    c.desc.toLowerCase().includes(k) ||
    c.category.toLowerCase().includes(k)
  ));
}

// FILTER
window.filterStatus = function(){
  let f = document.getElementById("filter").value;

  if(f==='all') render(data);
  else render(data.filter(c=>c.status===f));
}

// CLEAR ALL (Firebase version)
window.clearData = async function(){
  if(confirm("Delete all complaints?")){
    const snap = await getDocs(collection(db,"complaints"));

    snap.forEach(async d=>{
      await deleteDoc(doc(db,"complaints",d.id));
    });

    showAll();
  }
}

// INIT
showAll();
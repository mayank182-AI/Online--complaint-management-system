import { auth, db } from "./firebase.js";

import {
  addDoc,
  collection,
  deleteDoc, doc,
  getDocs,
  query,
  updateDoc,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const ADMIN_EMAIL = "admin@gmail.com";
let isAdmin = false;
let data = [];

// AUTH
window.register = async ()=>{
  try{
    await createUserWithEmailAndPassword(auth,email.value,password.value);
    alert("Registered");
  }catch(e){ alert(e.message); }
};

window.login = async ()=>{
  try{
    await signInWithEmailAndPassword(auth,email.value,password.value);
    alert("Login success");
  }catch(e){ alert(e.message); }
};

window.logout = async ()=>{
  await signOut(auth);
  alert("Logged out");
};

// ADD
window.addComplaint = async ()=>{

  if(!auth.currentUser){
    alert("Login first");
    return;
  }

  let name = document.getElementById("name").value;
  let title = document.getElementById("title").value;
  let category = document.getElementById("category").value;
  let desc = document.getElementById("desc").value;

  if(!name || !title || !desc){
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db,"complaints"),{
    uid: auth.currentUser.uid,
    name: name,
    title: title,
    category: category,
    desc: desc,
    status: "Pending"
  });

  alert("Complaint Added ✅");

  // clear fields
  document.getElementById("name").value = "";
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";

  showAll();
};

// READ
async function showAll(){

  let q;

  if(isAdmin){
    q = collection(db,"complaints");
  }else{
    q = query(collection(db,"complaints"),
      where("uid","==",auth.currentUser.uid)
    );
  }

  const snap = await getDocs(q);
  data=[];

  snap.forEach(d=>data.push({id:d.id,...d.data()}));

  render(data);
}

// RENDER
function render(list){
  let p=0,r=0;

  const box = document.getElementById("complaints");

  box.innerHTML = list.map(c=>{
    c.status=="Pending"?p++:r++;

    return `
    <div class="box">
      ${isAdmin ? `<small>👤 ${c.name}</small>` : ""}
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <span class="${c.status=="Pending"?"red":"green"}">${c.status}</span><br><br>

      <button onclick="toggle('${c.id}','${c.status}')">Toggle</button>
      <button onclick="removeItem('${c.id}')">Delete</button>
    </div>`;
  }).join("");

  total.innerText=list.length;
  pending.innerText=p;
  resolved.innerText=r;
}

// UPDATE
window.toggle = async(id,status)=>{
  await updateDoc(doc(db,"complaints",id),{
    status: status=="Pending"?"Resolved":"Pending"
  });
  showAll();
};

// DELETE
window.removeItem = async(id)=>{
  if(confirm("Delete?")){
    await deleteDoc(doc(db,"complaints",id));
    showAll();
  }
};

// SEARCH
window.search = ()=>{
  let k = document.getElementById("search").value.toLowerCase();

  render(data.filter(c =>
    c.title.toLowerCase().includes(k) ||
    c.desc.toLowerCase().includes(k) ||
    c.category.toLowerCase().includes(k)
  ));
};

// AUTH STATE
onAuthStateChanged(auth,(user)=>{
  const authBox = document.getElementById("authBox");
  const app = document.getElementById("app");
  const adminPanel = document.getElementById("adminPanel");

  if(user){
    isAdmin = user.email === ADMIN_EMAIL;

    authBox.style.display="none";
    app.style.display="block";

    if(isAdmin){
      adminPanel.style.display="block";
    }else{
      adminPanel.style.display="none";
    }

    showAll();
  }else{
    authBox.style.display="block";
    app.style.display="none";
  }
});

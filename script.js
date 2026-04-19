import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// REGISTER
window.register = async ()=>{
  try{
    await createUserWithEmailAndPassword(auth,
      document.getElementById("email").value,
      document.getElementById("password").value
    );
    alert("Registered");
  }catch(e){
    alert(e.message);
  }
};

// LOGIN
window.login = async ()=>{
  try{
    await signInWithEmailAndPassword(auth,
      document.getElementById("email").value,
      document.getElementById("password").value
    );
    alert("Login success");
  }catch(e){
    alert(e.message);
  }
};

// LOGOUT
window.logout = async ()=>{
  await signOut(auth);
};

// ADD
window.addComplaint = async ()=>{
  const user = auth.currentUser;

  if(!user){
    alert("Login first");
    return;
  }

  await addDoc(collection(db,"complaints"),{
    uid:user.uid,
    name:document.getElementById("name").value,
    title:document.getElementById("title").value,
    desc:document.getElementById("desc").value
  });

  loadData();
};

// READ
async function loadData(){
  const snap = await getDocs(collection(db,"complaints"));

  let html="";

  snap.forEach(d=>{
    const c = d.data();

    html += `
    <div>
      <b>${c.title}</b>
      <p>${c.desc}</p>
      <button onclick="del('${d.id}')">Delete</button>
    </div>`;
  });

  document.getElementById("list").innerHTML = html;
}

// DELETE
window.del = async(id)=>{
  await deleteDoc(doc(db,"complaints",id));
  loadData();
};

// AUTH STATE (MAIN FIX)
onAuthStateChanged(auth,(user)=>{
  if(user){
    document.getElementById("authBox").style.display="none";
    document.getElementById("app").style.display="block";
    loadData();
  }else{
    document.getElementById("authBox").style.display="block";
    document.getElementById("app").style.display="none";
  }
});

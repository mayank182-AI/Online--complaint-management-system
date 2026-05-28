import { db } from "./firebase.js";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= OTP ================= */

emailjs.init("mNOMockxX8zfBy_Va");

let generatedOTP = "";
let currentEmail = "";

window.sendOTP = async ()=>{

  const email =
    document.getElementById("email").value;

  if(!email){
    alert("Enter Email");
    return;
  }

  currentEmail = email;

  generatedOTP =
    Math.floor(100000 + Math.random()*900000)
    .toString();

  const params = {
    email: email,
    otp: generatedOTP
  };

  try{

    await emailjs.send(
      "service_09xw7v8",
      "template_4ghi645",
      params
    );

    alert("OTP Sent");

    console.log(generatedOTP);

    // OTP Expiry
    setTimeout(()=>{
      generatedOTP = "";
    },120000);

  }catch(err){

    console.log(err);

    alert("Failed to send OTP");
  }
};

window.verifyOTP = ()=>{

  const otp =
    document.getElementById("otp").value;

  if(otp === generatedOTP){

    alert("Login Success");

    document.getElementById("authBox")
      .style.display = "none";

    document.getElementById("app")
      .style.display = "block";

    generatedOTP = "";

    showAll();

  }else{
    alert("Invalid OTP");
  }
};

/* ================= COMPLAINT ================= */

let data = [];

/* ADD */
window.addComplaint = async ()=>{

  const name =
    document.getElementById("name").value;

  const title =
    document.getElementById("title").value;

  const category =
    document.getElementById("category").value;

  const desc =
    document.getElementById("desc").value;

  if(!name || !title || !desc){
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db,"complaints"),{

    email: currentEmail,

    name,
    title,
    category,
    desc,

    status:"Pending"

  });

  alert("Complaint Added");

  showAll();
};

/* SHOW */
window.showAll = async ()=>{

  const snap =
    await getDocs(collection(db,"complaints"));

  data = [];

  snap.forEach(docu=>{

    data.push({
      id:docu.id,
      ...docu.data()
    });

  });

  render(data);
};

/* RENDER */
function render(list){

  let p=0,r=0;

  document.getElementById("complaints")
  .innerHTML =

  list.map(c=>{

    c.status=="Pending"?p++:r++;

    return `

    <div class="box">

      <small>${c.email}</small>

      <h3>${c.title}</h3>

      <p>${c.desc}</p>

      <b>${c.category}</b>

      <br><br>

      <span class="${
        c.status=="Pending"
        ?"red":"green"
      }">

      ${c.status}

      </span>

      <br><br>

      <button onclick="
      toggleStatus(
      '${c.id}',
      '${c.status}'
      )">

      Toggle

      </button>

      <button onclick="
      removeComplaint(
      '${c.id}'
      )">

      Delete

      </button>

    </div>
    `;

  }).join("");

  document.getElementById("total")
  .innerText = list.length;

  document.getElementById("pending")
  .innerText = p;

  document.getElementById("resolved")
  .innerText = r;
}

/* UPDATE */
window.toggleStatus =
async(id,status)=>{

  await updateDoc(
    doc(db,"complaints",id),
    {
      status:
      status=="Pending"
      ?"Resolved"
      :"Pending"
    }
  );

  showAll();
};

/* DELETE */
window.removeComplaint =
async(id)=>{

  await deleteDoc(
    doc(db,"complaints",id)
  );

  showAll();
};

/* SEARCH */
window.searchComplaint = ()=>{

  const k =
  document.getElementById("search")
  .value.toLowerCase();

  render(

    data.filter(c=>

      c.title.toLowerCase().includes(k)
      ||

      c.desc.toLowerCase().includes(k)
    )

  );
};

/* CLEAR */
window.clearAll = async ()=>{

  alert("Delete manually or extend feature");
};
 

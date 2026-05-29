import { db } from "./firebase.js";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* EMAILJS */

emailjs.init("mNOMockxX8zfBy_Va");

/* VARIABLES */

let generatedOTP = "";

let currentEmail = "";

let data = [];

/* SEND OTP */

window.sendOTP = async ()=>{

  const email =
    document.getElementById("email").value;

  if(!email){

    alert("Enter Email");

    return;
  }

  currentEmail = email;

  generatedOTP =
    Math.floor(
      100000 + Math.random()*900000
    ).toString();

  const params = {

    email: email,

    otp: generatedOTP

  };

  try{

    await emailjs.send(

      "service_09xw7v8",

      "template_j8346vw",

      params

    );

    alert("OTP Sent");

    setTimeout(()=>{

      generatedOTP = "";

    },120000);

  }catch(err){

    console.log(err);

    alert("Failed To Send OTP");
  }
};

/* VERIFY OTP */

window.verifyOTP = async ()=>{

  const otp =
    document.getElementById("otp").value;

  if(otp === generatedOTP){

    try{

      // SAVE LOGIN HISTORY
      await addDoc(
        collection(db,"loginHistory"),
        {

          email: currentEmail,

          loginTime: serverTimestamp(),

          status: "Success"

        }
      );

      alert("Login Success");

      document.getElementById("authBox")
        .style.display = "none";

      document.getElementById("app")
        .style.display = "block";

      generatedOTP = "";

      showAll();

    }catch(err){

      console.log(err);

      alert("Login Failed");
    }

  }else{

    // SAVE FAILED ATTEMPT
    await addDoc(
      collection(db,"loginHistory"),
      {

        email: currentEmail,

        loginTime: serverTimestamp(),

        status: "Failed"

      }
    );

    alert("Invalid OTP");
  }
};

/* LOGOUT */

window.logout = ()=>{

  document.getElementById("app")
    .style.display = "none";

  document.getElementById("authBox")
    .style.display = "block";

  document.getElementById("email").value = "";

  document.getElementById("otp").value = "";

  currentEmail = "";
};

/* ADD COMPLAINT */

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

    alert("Fill All Fields");

    return;
  }

  try{

    await addDoc(
      collection(db,"complaints"),
      {

        email: currentEmail,

        name,

        title,

        category,

        desc,

        status: "Pending",

        createdAt: serverTimestamp()

      }
    );

    alert("Complaint Added");

    document.getElementById("name").value = "";

    document.getElementById("title").value = "";

    document.getElementById("desc").value = "";

    showAll();

  }catch(err){

    console.log(err);

    alert("Failed To Add");
  }
};

/* SHOW ALL */

window.showAll = async ()=>{

  try{

    const snap =
      await getDocs(
        collection(db,"complaints")
      );

    data = [];

    snap.forEach(docu=>{

      data.push({

        id: docu.id,

        ...docu.data()

      });

    });

    render(data);

  }catch(err){

    console.log(err);

    alert("Failed To Load");
  }
};

/* RENDER */

function render(list){

  let p = 0;

  let r = 0;

  document.getElementById("complaints")
  .innerHTML =

  list.map(c=>{

    c.status=="Pending"
    ? p++
    : r++;

    return `

    <div class="box">

      <small>${c.email}</small>

      <h3>${c.title}</h3>

      <p>${c.desc}</p>

      <b>${c.category}</b>

      <br><br>

      <span class="${
        c.status=="Pending"
        ? "red"
        : "green"
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

/* TOGGLE STATUS */

window.toggleStatus =
async(id,status)=>{

  try{

    await updateDoc(
      doc(db,"complaints",id),
      {

        status:
        status=="Pending"
        ? "Resolved"
        : "Pending"

      }
    );

    showAll();

  }catch(err){

    console.log(err);

    alert("Update Failed");
  }
};

/* DELETE */

window.removeComplaint =
async(id)=>{

  try{

    await deleteDoc(
      doc(db,"complaints",id)
    );

    showAll();

  }catch(err){

    console.log(err);

    alert("Delete Failed");
  }
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

      ||

      c.category.toLowerCase().includes(k)

    )

  );
};

/* CLEAR ALL */

window.clearAll = async ()=>{

  const ok =
    confirm("Delete All Complaints?");

  if(!ok) return;

  try{

    const snap =
      await getDocs(
        collection(db,"complaints")
      );

    for(const d of snap.docs){

      await deleteDoc(
        doc(db,"complaints",d.id)
      );
    }

    showAll();

  }catch(err){

    console.log(err);

    alert("Clear Failed");
  }
};

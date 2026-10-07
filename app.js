const KEY="payflow_demo_v1";
let data=JSON.parse(localStorage.getItem(KEY)||'null')||{balance:1000,upi:"mintu@payflow",transactions:[]};
function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
function money(n){return Number(n).toLocaleString("en-IN",{maximumFractionDigits:2})}
function render(){
 document.getElementById("balance").textContent=money(data.balance);
 document.getElementById("upiId").textContent=data.upi;
 const box=document.getElementById("transactions");
 if(!data.transactions.length){box.innerHTML='<div class="empty">No transactions yet</div>';return}
 box.innerHTML=data.transactions.slice().reverse().slice(0,10).map(t=>`
 <div class="tx"><div class="txicon">${t.type==="credit"?"↓":"↑"}</div>
 <div class="txmain"><b>${escapeHtml(t.title)}</b><small>${new Date(t.time).toLocaleString()}</small></div>
 <strong class="${t.type}">${t.type==="credit"?"+":"−"}₹${money(t.amount)}</strong></div>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function openModal(html){document.getElementById("modalBody").innerHTML=html;document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function openAdd(){openModal(`<h2>Add Demo Money</h2><div class="form"><input id="addAmt" type="number" min="1" placeholder="Amount ₹"><button class="primary" onclick="addMoney()">Add to wallet</button></div>`)}
function addMoney(){let a=Number(document.getElementById("addAmt").value);if(!a||a<=0)return alert("Enter a valid amount");data.balance+=a;data.transactions.push({type:"credit",title:"Demo top-up",amount:a,time:Date.now()});save();closeModal()}
function openSend(){openModal(`<h2>Send Money</h2><div class="form"><input id="to" placeholder="Receiver UPI ID"><input id="sendAmt" type="number" min="1" placeholder="Amount ₹"><input id="note" placeholder="Note (optional)"><button class="primary" onclick="sendMoney()">Pay now</button></div>`)}
function sendMoney(){let to=document.getElementById("to").value.trim(),a=Number(document.getElementById("sendAmt").value),note=document.getElementById("note").value.trim();if(!to||!a||a<=0)return alert("Enter receiver and amount");if(a>data.balance)return alert("Insufficient demo balance");data.balance-=a;data.transactions.push({type:"debit",title:`Paid to ${to}`,amount:a,time:Date.now()});save();closeModal();setTimeout(()=>openModal(`<div style="text-align:center"><div style="font-size:55px">✓</div><h2>Payment Successful</h2><p>₹${money(a)} sent to <b>${escapeHtml(to)}</b></p><button class="primary" onclick="closeModal()">Done</button></div>`),100)}
function showQR(){openModal(`<div class="qrwrap"><h2>My PayFlow QR</h2><div id="qrcode"></div><b>${escapeHtml(data.upi)}</b><p class="muted">Demo QR — no real UPI payment</p></div>`);setTimeout(()=>new QRCode(document.getElementById("qrcode"),{text:data.upi,width:190,height:190}),50)}
function clearTx(){if(confirm("Clear transaction history?")){data.transactions=[];save()}}
function resetDemo(){if(confirm("Reset wallet to ₹1,000 and clear all transactions?")){data={balance:1000,upi:"mintu@payflow",transactions:[]};save()}}
document.getElementById("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("pf_dark",document.body.classList.contains("dark"))}
if(localStorage.getItem("pf_dark")==="true")document.body.classList.add("dark");
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
render();
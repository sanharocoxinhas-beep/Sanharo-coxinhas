const STORE_WHATSAPP="5581989473321"; // TROQUE pelo WhatsApp da loja, com DDI+DDD.
const DELIVERY_FEE=5.00;

const products=[
{name:"Pastel de frango",cat:"Pastéis",desc:"Frango bem temperado",price:7,emoji:"🥟"},
{name:"Pastel de frango com queijo",cat:"Pastéis",desc:"Frango + queijo",price:8,emoji:"🥟"},
{name:"Pastel de carne",cat:"Pastéis",desc:"Carne bem temperada",price:7,emoji:"🥟"},
{name:"Pastel de carne com queijo",cat:"Pastéis",desc:"Carne + queijo",price:8,emoji:"🥟"},
{name:"Pastel de queijo",cat:"Pastéis",desc:"Queijo derretido",price:7,emoji:"🥟"},
{name:"Coxinha de frango",cat:"Coxinhas",desc:"Frango desfiado temperado",price:6,emoji:"🍗"},
{name:"Coxinha de frango com creme cheese",cat:"Coxinhas",desc:"Frango + creme cheese",price:7,emoji:"🍗"},
{name:"Coxinha de charque com queijo",cat:"Coxinhas",desc:"Charque + queijo",price:7,emoji:"🍗"},
{name:"Coxinha de costelinha suína no barbecue",cat:"Especiais",desc:"Costelinha + barbecue",price:7.5,emoji:"🍗"},
{name:"Coxinha de camarão ao reino com creme cheese",cat:"Especiais",desc:"Camarão + creme cheese",price:8.5,emoji:"🍤"},
{name:"Combo O Pai Tá On!",cat:"Combos",desc:"Seleção especial + Guaraná 1L",price:79.9,emoji:"🎉"},
{name:"Guaraná 1L",cat:"Bebidas",desc:"Refrigerante 1 litro",price:5,emoji:"🥤"}
];

let cart=JSON.parse(localStorage.getItem("sanharo_cart")||"[]");
const money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function save(){localStorage.setItem("sanharo_cart",JSON.stringify(cart));renderCart();}
function renderProducts(cat="Todos"){
 const list=cat==="Todos"?products:products.filter(p=>p.cat===cat);
 document.getElementById("products").innerHTML=list.map((p,i)=>`<article class="card"><div class="pic">${p.emoji}</div><div class="info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}</div></div><button class="add" onclick="add(${products.indexOf(p)})">+</button></article>`).join("");
}
function add(i){const p=products[i];const x=cart.find(c=>c.name===p.name);x?x.qty++:cart.push({...p,qty:1});save();}
function change(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save();}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);document.getElementById("cartCount").textContent=count;
 const sub=cart.reduce((s,x)=>s+x.price*x.qty,0);
 document.getElementById("subtotal").textContent=money(sub);
 document.getElementById("deliveryFee").textContent=sub?money(DELIVERY_FEE):"A calcular";
 document.getElementById("total").textContent=money(sub+(sub?DELIVERY_FEE:0));
 document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div class="mini">${x.emoji}</div><div style="flex:1"><strong>${x.name}</strong><div>${money(x.price*x.qty)}</div><div class="qty"><button onclick="change(${i},-1)">−</button><span>${x.qty}</span><button onclick="change(${i},1)">+</button></div></div></div>`).join(""):"<p style='padding:20px'>Seu carrinho está vazio.</p>";
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.cat)});
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length)return alert("Adicione pelo menos um item ao pedido.");closeCart();document.getElementById("checkoutModal").classList.add("show")};
document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutModal").classList.remove("show");
document.getElementById("sendOrder").onclick=()=>{
 const name=document.getElementById("name").value.trim(),phone=document.getElementById("phone").value.trim(),address=document.getElementById("address").value.trim();
 if(!name||!phone||!address)return alert("Preencha nome, WhatsApp e endereço.");
 const pay=document.getElementById("payment").value,note=document.getElementById("note").value.trim();
 const sub=cart.reduce((s,x)=>s+x.price*x.qty,0),total=sub+DELIVERY_FEE;
 let msg=`*NOVO PEDIDO - SANHARO COXINHAS*%0A%0ACliente: ${name}%0AWhatsApp: ${phone}%0AEndereço: ${address}%0APagamento: ${pay}%0A%0A`;
 cart.forEach(x=>msg+=`${x.qty}x ${x.name} - ${money(x.price*x.qty)}%0A`);
 msg+=`%0ASubtotal: ${money(sub)}%0ATaxa: ${money(DELIVERY_FEE)}%0A*TOTAL: ${money(total)}*`;
 if(note)msg+=`%0AObservação: ${note}`;
 window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`,"_blank");
};
renderProducts();renderCart();
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");

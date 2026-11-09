'use strict';

/* ضع رقم واتساب المتجر بصيغة دولية من دون + أو أصفار بادئة، مثال: 905XXXXXXXXX */
const STORE_WHATSAPP = '905000000000'; // غيّره قبل نشر الموقع
const CURRENCY = 'TRY';

/* منتجات تجريبية: عدّل الألعاب والباقات والأسعار حسب المنتجات المصرّح لك ببيعها. */
const products = [
  {id:'pubg-60',game:'PUBG Mobile',category:'تصويب',name:'60 UC',detail:'شدات ببجي موبايل',price:49,tag:'الأكثر طلبًا',symbol:'PUBG',colors:['#555b2b','#171c0e']},
  {id:'pubg-325',game:'PUBG Mobile',category:'تصويب',name:'325 UC',detail:'شدات ببجي موبايل',price:229,tag:'مميز',symbol:'PUBG',colors:['#626a2a','#1d2312']},
  {id:'free-100',game:'Free Fire',category:'باتل رويال',name:'100 Diamonds',detail:'جواهر فري فاير',price:42,tag:'شائع',symbol:'FREE FIRE',colors:['#a95022','#311327']},
  {id:'free-520',game:'Free Fire',category:'باتل رويال',name:'520 Diamonds',detail:'جواهر فري فاير',price:185,tag:'عرض',symbol:'FREE FIRE',colors:['#ca632b','#452038']},
  {id:'ml-86',game:'Mobile Legends',category:'موبايل',name:'86 Diamonds',detail:'ألماس موبايل ليجندز',price:67,tag:'جديد',symbol:'MLBB',colors:['#305eaa','#181b51']},
  {id:'ml-257',game:'Mobile Legends',category:'موبايل',name:'257 Diamonds',detail:'ألماس موبايل ليجندز',price:192,tag:'مميز',symbol:'MLBB',colors:['#426cb7','#131d4b']},
  {id:'valorant-475',game:'VALORANT',category:'تصويب',name:'475 VP',detail:'نقاط فالورانت',price:169,tag:'شائع',symbol:'V',colors:['#d43a53','#471b36']},
  {id:'valorant-1000',game:'VALORANT',category:'تصويب',name:'1000 VP',detail:'نقاط فالورانت',price:329,tag:'مميز',symbol:'V',colors:['#d34355','#512034']},
  {id:'roblox-400',game:'Roblox',category:'عالم مفتوح',name:'400 Robux',detail:'عملة روبلوكس',price:199,tag:'مميز',symbol:'R',colors:['#434e61','#111b2d']},
  {id:'roblox-800',game:'Roblox',category:'عالم مفتوح',name:'800 Robux',detail:'عملة روبلوكس',price:379,tag:'شائع',symbol:'R',colors:['#53637e','#141a28']},
  {id:'genshin-60',game:'Genshin Impact',category:'عالم مفتوح',name:'60 Genesis Crystals',detail:'بلورات جينشن',price:39,tag:'جديد',symbol:'✦',colors:['#207d92','#18304c']},
  {id:'genshin-300',game:'Genshin Impact',category:'عالم مفتوح',name:'300 Genesis Crystals',detail:'بلورات جينشن',price:179,tag:'مميز',symbol:'✦',colors:['#1d9a9e','#173052']}
];

const $ = (selector) => document.querySelector(selector);
const productsGrid = $('#productsGrid');
const countEl = $('#cartCount');
const cartItemsEl = $('#cartItems');
let category = 'الكل';
let toastTimer;
let cart = {};
try {
  const saved = JSON.parse(localStorage.getItem('novatop-cart') || '{}');
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const [id, qty] of Object.entries(saved)) {
      if (products.some(p => p.id === id) && Number.isInteger(qty) && qty > 0) cart[id] = Math.min(qty, 99);
    }
  }
} catch { cart = {}; }
const money = value => new Intl.NumberFormat('tr-TR', {style:'currency',currency:CURRENCY,maximumFractionDigits:0}).format(value);
const productById = id => products.find(p => p.id === id);
const totalQty = () => Object.values(cart).reduce((a,b) => a+b,0);
const cartTotal = () => Object.entries(cart).reduce((sum,[id,qty]) => sum + (productById(id)?.price || 0) * qty, 0);
function persist() {try {localStorage.setItem('novatop-cart', JSON.stringify(cart));} catch {} updateCart();}
function toast(message) {const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}
function addToCart(id) {if (!productById(id)) return;cart[id]=Math.min((cart[id]||0)+1,99);persist();toast('تمت إضافة الباقة إلى السلة ✓');}
function updateQty(id,change) {if (!cart[id])return;cart[id]+=change;if(cart[id]<=0)delete cart[id];else cart[id]=Math.min(cart[id],99);persist();}
function removeItem(id){delete cart[id];persist();}
function renderFilters(){const categories=['الكل',...new Set(products.map(p=>p.category))];$('#categoryFilters').innerHTML=categories.map(c=>`<button type="button" class="filter-btn ${category===c?'active':''}" data-category="${c}" aria-pressed="${category===c}">${c}</button>`).join('');}
function renderProducts(){const search=$('#productSearch').value.trim().toLocaleLowerCase();let visible=products.filter(p=>(category==='الكل'||category===p.category)&&`${p.game} ${p.name} ${p.detail}`.toLocaleLowerCase().includes(search));const sort=$('#sortSelect').value;if(sort==='low')visible.sort((a,b)=>a.price-b.price);if(sort==='high')visible.sort((a,b)=>b.price-a.price);productsGrid.innerHTML=visible.map(p=>`<article class="product-card"><div class="product-cover" style="--coverA:${p.colors[0]};--coverB:${p.colors[1]}"><span class="product-badge">${p.tag}</span><span class="product-symbol">${p.symbol}</span><span class="cover-gem">◆</span></div><div class="product-body"><span class="product-game">${p.game}</span><h3>${p.name}</h3><div class="product-meta">${p.detail}</div><div class="product-purchase"><span class="product-price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="إضافة ${p.game} ${p.name} إلى السلة">+ إضافة</button></div></div></article>`).join('');$('#emptyMessage').hidden=visible.length>0;$('#gamesCount').textContent=`${visible.length} باقة متاحة للعرض`;}
function updateCart(){const quantity=totalQty();countEl.textContent=quantity;$('#drawerCartCount').textContent=`(${quantity})`;$('#cartTotal').textContent=money(cartTotal());const items=Object.entries(cart);cartItemsEl.innerHTML=items.length?items.map(([id,qty])=>{const p=productById(id);return `<div class="cart-item"><div class="mini-cover" style="--coverA:${p.colors[0]};--coverB:${p.colors[1]}">${p.symbol}</div><div class="cart-info"><b>${p.game}</b><small>${p.name}</small><div class="cart-line"><div class="qty"><button data-qty="${id}" data-change="-1" aria-label="تقليل كمية ${p.name}">−</button><span>${qty}</span><button data-qty="${id}" data-change="1" aria-label="زيادة كمية ${p.name}">+</button></div><strong>${money(p.price*qty)}</strong></div><button class="remove-btn" data-remove="${id}">حذف</button></div></div>`;}).join(''):'<div class="empty-cart"><div class="large">🛒</div><h3>سلتك فارغة</h3><p>ابدأ بإضافة باقاتك المفضلة!</p></div>';$('#checkoutBtn').disabled=!items.length;$('#checkoutBtn').style.opacity=items.length?'1':'.5';}
function openCart(){updateCart();$('#overlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.classList.add('locked');$('#closeCart').focus();}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');$('#overlay').hidden=true;document.body.classList.remove('locked');$('#cartTrigger').focus();}
function openCheckout(){if(!totalQty())return;closeCart();$('#checkoutDialog').showModal();$('#checkoutDialog input[name="customer"]').focus();}
function contactWhatsApp(){if(STORE_WHATSAPP==='905000000000'){toast('غيّر رقم واتساب المتجر في ملف script.js أولاً');return;}window.open(`https://wa.me/${STORE_WHATSAPP}`,'_blank','noopener,noreferrer');}
function checkoutSubmit(event){event.preventDefault();if(!totalQty())return;const form=event.currentTarget;if(!form.reportValidity())return;if(STORE_WHATSAPP==='905000000000'){toast('يجب ضبط رقم واتساب المتجر في script.js قبل الطلب');return;}const data=new FormData(form);const lines=Object.entries(cart).map(([id,qty])=>{const p=productById(id);return `• ${p.game} — ${p.name} × ${qty} = ${money(p.price*qty)}`;});const message=['مرحبًا، أريد طلب الباقات التالية من NovaTop:','',...lines,'',`المجموع: ${money(cartTotal())}`,'',`الاسم: ${data.get('customer')}`,`الهاتف: ${data.get('phone')}`,`معرّف اللاعب: ${data.get('playerId')}`,`ملاحظات: ${data.get('notes') || 'لا يوجد'}`,'','أرجو تأكيد السعر والتوفر وطريقة الدفع.'].join('\n');const url=`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;const newTab=window.open(url,'_blank','noopener,noreferrer');if(!newTab)window.location.href=url;$('#checkoutDialog').close();toast('تم تجهيز طلبك لواتساب. أكمل الإرسال هناك.');}

document.addEventListener('click',event=>{const add=event.target.closest('[data-add]');if(add)addToCart(add.dataset.add);const qty=event.target.closest('[data-qty]');if(qty)updateQty(qty.dataset.qty,Number(qty.dataset.change));const remove=event.target.closest('[data-remove]');if(remove)removeItem(remove.dataset.remove);const filter=event.target.closest('[data-category]');if(filter){category=filter.dataset.category;renderFilters();renderProducts();}});
$('#productSearch').addEventListener('input',renderProducts);
$('#sortSelect').addEventListener('change',renderProducts);
$('#cartTrigger').addEventListener('click',openCart);
$('#closeCart').addEventListener('click',closeCart);
$('#overlay').addEventListener('click',closeCart);
$('#checkoutBtn').addEventListener('click',openCheckout);
$('#closeCheckout').addEventListener('click',()=>$('#checkoutDialog').close());
$('#checkoutDialog').addEventListener('click',event=>{if(event.target===$('#checkoutDialog'))$('#checkoutDialog').close();});
$('#checkoutForm').addEventListener('submit',checkoutSubmit);
$('#footerContact').addEventListener('click',contactWhatsApp);
$('#footerChat').addEventListener('click',contactWhatsApp);
$('#menuToggle').addEventListener('click',()=>{const nav=$('#mobileNav');const opened=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(opened));});
$('#mobileNav').addEventListener('click',event=>{if(event.target.closest('a')){$('#mobileNav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');}});
$('.search-open').addEventListener('click',()=>{$('#games').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#productSearch').focus({preventScroll:true}),400);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#cartDrawer').classList.contains('open'))closeCart();});
$('#year').textContent=new Date().getFullYear();renderFilters();renderProducts();updateCart();

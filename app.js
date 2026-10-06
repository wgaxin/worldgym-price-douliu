const state={data:null,region:"全部",query:"",categoryQuery:""};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

function money(v){if(v===null||v===undefined||v==="")return"—";const n=Number(String(v).replace(/,/g,""));return Number.isFinite(n)?"NT$ "+n.toLocaleString("zh-TW"):String(v)}
function normalize(s){return String(s??"").toLowerCase().replace(/\s+/g,"")}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function showView(id){$$(".view").forEach(v=>v.classList.remove("active"));$(id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"});$$(".nav-item").forEach(n=>n.classList.remove("active"));if(id==="#homeView")$$(".nav-item")[0].classList.add("active")}
function planTable(p){return`<div class="plan-card"><h3>${esc(p.plan)}</h3><div class="plan-table">${["12M","24M","36M"].map(t=>`<div class="term"><small>${t}</small><div class="fee">手續費 <b>${money(p[t]?.fee)}</b></div><div class="monthly">${money(p[t]?.monthly)} <span>/月</span></div></div>`).join("")}</div></div>`}
function renderCategories(){const labels={"全省型":["全台適用的全省方案","4 種方案"],"市區型":["依城市區域分類","15 種方案"],"Express市區型":["一般 Express 方案","1 種方案"],"Express新竹市區型":["新竹 Express 方案","1 種方案"],"單館":["各分店單館價格",`${state.data.branches.length} 間分店`]};$("#categoryGrid").innerHTML=state.data.categoryOrder.map((c,i)=>`<button class="category-card" data-category="${esc(c)}"><div class="num">0${i+1}</div><h3>${esc(c)}</h3><p>${labels[c][0]} · ${labels[c][1]}</p></button>`).join("");$$(".category-card").forEach(b=>b.onclick=()=>openCategory(b.dataset.category))}
function renderRegions(){const regions=["全部",...new Set(state.data.branches.map(b=>b.region).filter(Boolean))];$("#regionChips").innerHTML=regions.map(r=>`<button class="chip ${r===state.region?"active":""}" data-region="${esc(r)}">${esc(r)}</button>`).join("");$$(".chip").forEach(b=>b.onclick=()=>{state.region=b.dataset.region;renderRegions();renderBranches()})}
function filteredBranches(){const q=normalize(state.query);return state.data.branches.filter(b=>{const ok=state.region==="全部"||b.region===state.region;const hay=normalize([b.displayName,b.name,b.code,b.region].join(" "));return ok&&(!q||hay.includes(q))})}
function renderBranches(){const arr=filteredBranches();$("#branchCount").textContent=`${arr.length} 間`;$("#branchList").innerHTML=arr.length?arr.map(b=>`<button class="branch-card" data-id="${esc(b.id)}"><div class="code">${b.code?esc(b.code+"號"):"分店"} · ${esc(b.region)}</div><h3>${esc(b.name)}</h3><div class="region">${b.parking?`🚗 ${esc(b.parking)}`:"查看價格與設備 →"}</div><div class="price">24M 月費 <b>${money(b["24M"]?.monthly)}</b></div></button>`).join(""):`<div class="empty" style="grid-column:1/-1">找不到符合條件的分店</div>`;$$(".branch-card").forEach(b=>b.onclick=()=>openBranch(b.dataset.id))}
function openCategory(cat){$("#categoryContent").innerHTML=`<div class="page-title">${esc(cat)}</div><p class="page-sub">資料來源：${esc(state.data.meta.source)}</p>`;if(cat==="單館"){$("#categoryContent").innerHTML+=`<div class="search-wrap" style="margin-bottom:12px;color:#111"><span class="search-icon">⌕</span><input id="categorySearch" placeholder="搜尋分店…"></div><div id="categoryBranches" class="branch-list"></div>`;renderCategoryBranches();$("#categorySearch").oninput=e=>{state.categoryQuery=e.target.value;renderCategoryBranches()}}else{const plans=state.data.genericPlans[cat]||[];$("#categoryContent").innerHTML+=plans.map(planTable).join("")||`<div class="empty">目前沒有資料</div>`}showView("#categoryView")}
function renderCategoryBranches(){const q=normalize(state.categoryQuery||"");const arr=state.data.branches.filter(b=>!q||normalize([b.displayName,b.name,b.code,b.region].join(" ")).includes(q));$("#categoryBranches").innerHTML=arr.map(b=>`<button class="branch-card" data-id="${esc(b.id)}"><div class="code">${esc(b.code)}號 · ${esc(b.region)}</div><h3>${esc(b.name)}</h3><div class="region">24M ${money(b["24M"]?.monthly)}/月 →</div></button>`).join("");$$("#categoryBranches .branch-card").forEach(b=>b.onclick=()=>openBranch(b.dataset.id))}
function openBranch(id){const b=state.data.branches.find(x=>x.id===id);if(!b)return;$("#branchContent").innerHTML=`<div class="branch-head"><div class="tag">BRANCH DETAIL</div><h1>${esc(b.name)}</h1><p>${esc(b.region)}${b.code?" · "+esc(b.code)+"號":""}</p></div><div class="section"><div class="section-head"><h2>單館價格</h2><span>12M / 24M / 36M</span></div>${planTable({plan:"單館方案","12M":b["12M"],"24M":b["24M"],"36M":b["36M"]})}</div><div class="info-grid"><div class="info-card"><div class="label">🚗 停車</div><div class="value">${esc(b.parking||"資料未填寫")}</div></div><div class="info-card"><div class="label">🏋️ 設備</div><div class="value">${esc(b.equipment||"資料未填寫")}</div></div></div><div class="section"><div class="section-head"><h2>其他價格方案</h2><span>依方案規則查詢</span></div><div class="category-grid">${state.data.categoryOrder.filter(c=>c!=="單館").map(c=>`<button class="category-card" data-catlink="${esc(c)}"><div class="num">查詢</div><h3>${esc(c)}</h3><p>查看全省／區域方案</p></button>`).join("")}</div></div>`;$$("[data-catlink]").forEach(x=>x.onclick=()=>openCategory(x.dataset.catlink));showView("#branchView")}

function parseCSV(text){
  const rows=[];let row=[],cell="",quoted=false;
  for(let i=0;i<text.length;i++){const ch=text[i],next=text[i+1];
    if(quoted){if(ch==='"'&&next==='"'){cell+='"';i++;}else if(ch==='"'){quoted=false;}else cell+=ch;}
    else if(ch==='"'){quoted=true;}
    else if(ch===','){row.push(cell);cell="";}
    else if(ch==='\n'){row.push(cell);rows.push(row);row=[];cell="";}
    else if(ch==='\r'){}
    else cell+=ch;
  }
  if(cell!==""||row.length){row.push(cell);rows.push(row);}
  return rows;
}
function csvRows(text){
  const rows=parseCSV(text.replace(/^\uFEFF/,""));
  if(!rows.length)return[];
  const headers=rows[0].map(x=>String(x).trim());
  return rows.slice(1).filter(r=>r.some(x=>String(x).trim()!=="")).map(r=>Object.fromEntries(headers.map((h,i)=>[h,String(r[i]??"").trim()])));
}
function num(v){const n=Number(String(v??"").replace(/,/g,""));return Number.isFinite(n)?n:""}
function makePlan(r){return{plan:r["方案"],"12M":{fee:num(r["12M手續費"]),monthly:num(r["12M月費"])},"24M":{fee:num(r["24M手續費"]),monthly:num(r["24M月費"])},"36M":{fee:num(r["36M手續費"]),monthly:num(r["36M月費"])}}}

async function loadFromSheets(){
  const cfg=window.SHEET_CONFIG||{};
  if(!cfg.branchesCsv||!cfg.pricesCsv) return null;
  const stamp=Date.now();
  const [br,pr]=await Promise.all([
    fetch(cfg.branchesCsv+(cfg.branchesCsv.includes("?")?"&":"?")+`t=${stamp}`,{cache:"no-store"}),
    fetch(cfg.pricesCsv+(cfg.pricesCsv.includes("?")?"&":"?")+`t=${stamp}`,{cache:"no-store"})
  ]);
  if(!br.ok||!pr.ok) throw new Error(`Google Sheets 讀取失敗（${br.status}/${pr.status}）`);
  const [bt,pt]=await Promise.all([br.text(),pr.text()]);
  const branchRows=csvRows(bt), priceRows=csvRows(pt);
  const branches=branchRows.map(r=>({
    id:r["分店ID"],code:r["分店代碼"],name:r["分店名稱"],displayName:`${r["分店代碼"]?r["分店代碼"]+"-":""}${r["分店名稱"]}`,
    region:r["地區"],parking:r["停車"],equipment:r["設備"],
    "12M":{},"24M":{},"36M":{}
  }));
  const byId=new Map(branches.map(b=>[b.id,b]));
  const genericPlans={}, categoryOrder=["全省型","市區型","Express市區型","Express新竹市區型","單館"];
  for(const r of priceRows){
    const cat=r["價格類型"];
    if(!cat) continue;
    const p=makePlan(r);
    if(cat==="單館"){
      const b=byId.get(r["分店ID"]);
      if(b){b["12M"]=p["12M"];b["24M"]=p["24M"];b["36M"]=p["36M"];}
    }else{
      (genericPlans[cat]??=[]).push(p);
    }
  }
  return {
    meta:{source:"Google Sheets",updated:new Date().toISOString().slice(0,10),branchCount:branches.length},
    categoryOrder,genericPlans,branches
  };
}

async function init(){
  try{
    let d=null;
    try{d=await loadFromSheets();}catch(sheetErr){console.warn(sheetErr);}
    if(!d){d=await fetch("data.json",{cache:"no-store"}).then(r=>r.json());}
    state.data=d;
    $("#updatedAt").textContent=`${d.meta.updated.replaceAll("-","/")} · ${d.meta.branchCount} 間分店`;
    renderCategories();renderRegions();renderBranches();
    let searchScrollTimer=null;
    $("#searchInput").oninput=e=>{
      state.query=e.target.value;
      $("#clearSearch").hidden=!state.query;
      renderBranches();
      clearTimeout(searchScrollTimer);
      if(state.query.trim()){
        searchScrollTimer=setTimeout(()=>{
          const target=$("#branchResultsSection");
          if(target && window.matchMedia("(max-width: 900px)").matches){
            const top=target.getBoundingClientRect().top+window.scrollY-76;
            window.scrollTo({top,behavior:"smooth"});
          }
        },450);
      }
    };
    $("#clearSearch").onclick=()=>{$("#searchInput").value="";state.query="";$("#clearSearch").hidden=true;renderBranches()};
    $("#navSearch").onclick=()=>{showView("#homeView");setTimeout(()=>$("#searchInput").focus(),100)};
    $$("[data-home]").forEach(x=>x.onclick=()=>showView("#homeView"));
  }catch(err){$("#app").innerHTML=`<div class="loading">資料載入失敗，請確認 Google Sheets 設定或 data.json 是否存在。<br><small>${esc(err)}</small></div>`}
  $("#shareBtn").onclick=async()=>{try{await navigator.share({title:"World Gym 全台價格查詢",text:"World Gym 全台分店價格查詢",url:location.href})}catch(e){try{await navigator.clipboard.writeText(location.href);alert("網址已複製，可貼到 LINE 分享。")}catch(_){}}};
  if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{})
}
init();
import { EXERCISES, EQUIPMENT, PATTERN_LABEL, PROGRAMS, SAMPLE_TREND } from './data.js';
import { loadState, saveState } from './storage.js';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const icon = (name, cls='') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
const byId = id => EXERCISES.find(x=>x.id===id);
const esc = s => String(s ?? '').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));

const defaultState = {
  version:'4.0.0', tab:'today', xp:0, streak:12,
  profile:{name:'Tuân',goal:'muscle',days:4,minutes:42,equipment:['chair'],levels:{push:2.5,pull:2,legs:2.4,core:2.2}},
  daily:{minutes:42,noEquipment:false,lowEnergy:false,energy:78,soreness:{}},
  history:[], currentWorkout:null,
  ui:{libraryFilter:'all',libraryQuery:'',restEnd:0,restDuration:90},
  migration:null
};

let state = await loadState(defaultState);
let timerLoop = null;

function persist(){ saveState(state); }
function levelName(d){return d<1.7?'Starter':d<2.6?'Foundation':d<3.5?'Intermediate':d<4.4?'Advanced':'Elite'}
function greeting(){const h=new Date().getHours();return h<11?'Chào buổi sáng':h<18?'Chào buổi chiều':'Chào buổi tối'}
function fmtDate(d=new Date()){return new Intl.DateTimeFormat('vi-VN',{weekday:'short',day:'2-digit',month:'2-digit',year:'numeric'}).format(d)}
function fmtShort(d){return new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit'}).format(d)}
function eqAvailable(e){return state.daily.noEquipment ? e.eq.length===0 : e.eq.every(x=>state.profile.equipment.includes(x));}
function readiness(){return clamp(Math.round(state.daily.energy - (state.daily.lowEnergy?16:0)),35,96)}
function readinessText(){const r=readiness();return r>=82?'Rất tốt':r>=68?'Sẵn sàng':r>=52?'Vừa phải':'Nên giảm tải'}

function selectFor(pattern,count){
  const lv=(state.profile.levels?.[pattern]||2)+(state.daily.lowEnergy?-0.35:0);
  return EXERCISES.filter(e=>e.pattern===pattern&&eqAvailable(e))
    .sort((a,b)=>Math.abs(a.diff-lv)-Math.abs(b.diff-lv)).slice(0,count);
}
function todayExercises(){
  const mins=state.daily.minutes||state.profile.minutes||42;
  const count=mins<=30?5:mins<=45?7:8;
  let items=[...selectFor('push',Math.max(3,count-2)),...selectFor('core',2)];
  const seen=new Set();items=items.filter(x=>!seen.has(x.id)&&seen.add(x.id));
  if(items.length<count){
    const fill=EXERCISES.filter(e=>['push','core'].includes(e.pattern)&&eqAvailable(e)&&!seen.has(e.id)).sort((a,b)=>a.diff-b.diff);
    items.push(...fill.slice(0,count-items.length));
  }
  return items.slice(0,count);
}
function targetFor(e){
  const lo=e.rep?.[0]??8, hi=e.rep?.[1]??12;
  if(e.type==='time') return `${lo}–${hi}s`;
  return `${lo}–${hi}`;
}
function planTitle(){return state.daily.lowEnergy?'Upper Push — Light':'Upper Push + Core'}
function workoutMinutes(){return state.daily.minutes || 42}
function whyItems(){
  const items=[
    `Khớp mục tiêu tăng sức mạnh thân trên và core của bạn`,
    `Mức sẵn sàng hôm nay ${readiness()}/100 — ${readinessText().toLowerCase()}`,
    `Thời lượng ${workoutMinutes()} phút với ${todayExercises().length} bài tập phù hợp`
  ];
  if(state.daily.noEquipment) items[2]=`Đã loại các bài cần dụng cụ cho buổi tập hôm nay`;
  if(state.daily.lowEnergy) items.push('Đã giảm độ khó để giữ chất lượng kỹ thuật khi năng lượng thấp');
  return items;
}

function sidebar(){
  const nav=[['today','home','Today'],['workouts','dumbbell','Workouts'],['progress','chart','Progress'],['library','library','Library']];
  return `<aside class="sidebar">
    <div class="brand-lockup"><div class="brand-mark"></div><div class="brand-copy"><b>ForgePath</b><span>ADAPTIVE TRAINING</span></div></div>
    <nav class="side-nav">${nav.map(([id,ic,l])=>`<button class="nav-btn ${state.tab===id?'active':''}" data-action="nav" data-tab="${id}"><span class="nav-icon">${icon(ic)}</span><span>${l}</span></button>`).join('')}</nav>
    <div class="side-bottom"><div class="side-quote"><b>Discipline builds freedom.</b>ForgePath thích nghi theo bạn — không ép bạn thích nghi theo một giáo án cứng.</div><div class="version">FORGEPATH V4.0 WEB</div></div>
  </aside>`;
}
function mobileNav(){
  const nav=[['today','home','Today'],['workouts','dumbbell','Tập'],['progress','chart','Tiến độ'],['library','library','Thư viện']];
  return `<nav class="mobile-nav">${nav.map(([id,ic,l])=>`<button class="${state.tab===id?'active':''}" data-action="nav" data-tab="${id}">${icon(ic)}<span>${l}</span></button>`).join('')}</nav>`;
}
function topbar(title,eyebrow='ForgePath 2026'){
  const initials=(state.profile.name||'FP').trim().split(/\s+/).slice(-2).map(x=>x[0]).join('').toUpperCase();
  return `<header class="topbar"><div class="topbar-left"><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1></div><div class="top-actions"><button class="icon-btn" data-action="toast" data-message="Không có thông báo mới">${icon('bell')}</button><button class="icon-btn avatar" data-action="profile">${esc(initials)}</button></div></header>`;
}

function readinessCard(){
  const r=readiness();
  return `<section class="card card-pad"><div class="card-head"><div><div class="eyebrow">Readiness</div><h2>Mức sẵn sàng hôm nay</h2></div><span class="pill violet">LIVE</span></div>
  <div class="readiness"><div class="ring" style="--p:${r}"><div class="ring-value"><b>${r}</b><span>/100</span></div></div><div class="readiness-copy"><div class="status">${readinessText()}</div><p>${state.daily.lowEnergy?'Năng lượng thấp đã được ghi nhận. ForgePath sẽ ưu tiên kỹ thuật và giảm tải.':'Nhịp phục hồi ổn định. Hôm nay phù hợp cho buổi push có cường độ vừa.'}</p></div></div>
  <div class="score-row"><div class="score"><b>${state.daily.energy}%</b><span>Năng lượng</span></div><div class="score"><b>${state.streak||0} ngày</b><span>Streak</span></div><div class="score"><b>${state.profile.days||4} buổi</b><span>Mục tiêu tuần</span></div></div></section>`;
}
function heroCard(){
  return `<section class="card hero"><div class="hero-top"><span class="hero-label">TODAY'S WORKOUT</span><span class="pill violet">ADAPTIVE</span></div><h1>${planTitle()}</h1><div class="hero-meta"><span class="meta">${icon('clock')} ${workoutMinutes()} phút</span><span class="meta">${icon('dumbbell')} ${todayExercises().length} bài</span><span class="meta">${icon('target')} RIR 2–3</span></div><div class="hero-actions"><button class="primary" data-action="start-workout">${icon('play')} Bắt đầu tập</button><button class="secondary" data-action="open-today-plan">Xem kế hoạch</button></div>
  <div class="quick-adapt"><button class="chip ${state.daily.minutes===30?'active':''}" data-action="adapt-minutes">⚡ Chỉ có 30 phút</button><button class="chip ${state.daily.noEquipment?'active':''}" data-action="adapt-equipment">⌂ Không dụng cụ</button><button class="chip ${state.daily.lowEnergy?'active':''}" data-action="adapt-energy">☀ Năng lượng thấp</button></div></section>`;
}
function whyCard(){return `<section class="card card-pad"><div class="card-head"><div><div class="eyebrow">Explainable coaching</div><h2>Vì sao là buổi tập này?</h2></div>${icon('info')}</div><div class="why-list">${whyItems().map(x=>`<div class="why-item"><span class="check">${icon('check')}</span><span>${x}</span></div>`).join('')}</div></section>`}

function bodyMapSvg(back=false){
  return `<svg viewBox="0 0 150 280" role="img" aria-label="Bản đồ cơ ${back?'sau':'trước'}">
    <ellipse class="muscle-base" cx="75" cy="29" rx="18" ry="22"/>
    <path class="muscle-base" d="M59 54 Q75 45 91 54 L99 100 Q91 118 87 133 L63 133 Q59 117 51 100Z"/>
    <path class="muscle-base" d="M56 60 Q43 66 38 92 L31 137 43 140 52 103 61 87Z"/><path class="muscle-base" d="M94 60 Q107 66 112 92 L119 137 107 140 98 103 89 87Z"/>
    <path class="muscle-base" d="M64 131 L58 194 68 256 78 256 80 195 75 139Z"/><path class="muscle-base" d="M86 131 L92 194 82 256 72 256 70 195 75 139Z"/>
    ${back?`<path class="muscle-hot" d="M58 57 Q75 47 92 57 L96 88 Q75 101 54 88Z"/><path class="muscle-warm" d="M53 73 42 91 45 115 56 97Z"/><path class="muscle-warm" d="M97 73 108 91 105 115 94 97Z"/>`:`<path class="muscle-hot" d="M57 60 Q75 51 93 60 L91 84 Q75 94 59 84Z"/><path class="muscle-warm" d="M53 69 43 88 47 108 58 91Z"/><path class="muscle-warm" d="M97 69 107 88 103 108 92 91Z"/><path class="muscle-core" d="M64 88 86 88 85 127 65 127Z"/>`}
    <path class="body-line" d="M75 8v258M52 101h46M61 133h28"/>
  </svg>`;
}
function muscleCard(){return `<section class="card muscle-card"><div class="card-head"><div><div class="eyebrow">Muscle focus</div><h2>Nhóm cơ trọng tâm</h2></div><span class="pill">PUSH + CORE</span></div><div class="bodymap-wrap"><div class="body-figure"><span class="label">FRONT</span>${bodyMapSvg(false)}</div><div class="body-figure"><span class="label">BACK</span>${bodyMapSvg(true)}</div></div><div class="muscle-legend"><span class="legend-item"><i class="legend-dot" style="background:#ff6d58"></i>Ngực</span><span class="legend-item"><i class="legend-dot" style="background:#ff9a49"></i>Vai / tay sau</span><span class="legend-item"><i class="legend-dot" style="background:#f6c75b"></i>Core</span></div></section>`}
function weekCard(){
  const dayNames=['T2','T3','T4','T5','T6','T7','CN']; const today=(new Date().getDay()+6)%7;
  return `<section class="card card-pad"><div class="card-head"><div><div class="eyebrow">Consistency</div><h3>Tuần này</h3></div><span class="pill">${state.streak||0} ngày streak</span></div><div class="week-strip">${dayNames.map((d,i)=>`<div class="day ${i<today?'done':i===today?'today':'future'}"><span>${d}</span><b>${i<today?'✓':i===today?'●':'·'}</b></div>`).join('')}</div></section>`;
}
function todayView(){
  return `${topbar(`${greeting()}, ${esc(state.profile.name||'bạn')}`,fmtDate())}<div class="grid fade-in"><div class="stack">${readinessCard()}${heroCard()}${whyCard()}</div><div class="stack">${muscleCard()}${weekCard()}<div class="insight"><div class="insight-head">${icon('spark')} Gợi ý hôm nay</div><p>Giữ RIR 2–3 ở các set đầu. Nếu set cuối vẫn còn hơn 3 reps dự trữ, ForgePath sẽ tăng độ khó vào lần tập sau.</p></div></div></div>`;
}

function programCard(p){return `<article class="card program-card"><span class="pattern">${p.patterns.map(x=>PATTERN_LABEL[x]).join(' · ')}</span><h3>${p.name}</h3><div class="sub">Adaptive theo level, dụng cụ và thời gian sẵn có.</div><div class="footer"><span class="pill violet">${p.duration} phút</span><button class="secondary compact" data-action="program-start" data-program="${p.id}">${icon('play')} Tập</button></div></article>`}
function workoutsView(){
  const plan=todayExercises();
  return `${topbar('Workouts','Adaptive training plan')}<div class="stack fade-in"><section class="card card-pad"><div class="card-head"><div><div class="eyebrow">Today's queue</div><h2>${planTitle()}</h2><div class="sub">${workoutMinutes()} phút · ${plan.length} bài · mục tiêu RIR 2–3</div></div><button class="primary" style="flex:none" data-action="start-workout">${icon('play')} Bắt đầu</button></div><div class="dist">${plan.map((e,i)=>`<div class="dist-row" style="grid-template-columns:28px 1fr 74px"><span>${String(i+1).padStart(2,'0')}</span><div><b style="font-size:12px">${e.name}</b><div class="tiny">${e.muscle}</div></div><span class="pill">${targetFor(e)}</span></div>`).join('')}</div></section><div class="program-grid">${PROGRAMS.map(programCard).join('')}</div></div>`;
}

function metrics(){
  const real=state.history.length>0;
  const wk=weeklyStats();
  const vol=real?compact(wk.volume):'12.8K';
  return `<div class="metrics"><div class="metric"><div class="metric-label">${icon('chart')} Volume tuần</div><div class="metric-value">${vol}</div><div class="delta">↑ ${real?wk.delta:12}%</div></div><div class="metric"><div class="metric-label">${icon('flame')} Streak</div><div class="metric-value">${state.streak||12}</div><div class="delta">ngày liên tiếp</div></div><div class="metric"><div class="metric-label">${icon('trophy')} PR gần nhất</div><div class="metric-value">${latestPR()}</div><div class="delta">Push-up</div></div></div>`;
}
function compact(n){return n>=1000?(n/1000).toFixed(1)+'K':String(Math.round(n||0))}
function weeklyStats(){
  const now=Date.now(), week=7*864e5; const curr=state.history.filter(h=>now-new Date(h.date).getTime()<week); const prev=state.history.filter(h=>{const x=now-new Date(h.date).getTime();return x>=week&&x<2*week});
  const vol=a=>a.reduce((s,h)=>s+(h.volume||h.reps||0),0); const c=vol(curr),p=vol(prev);
  return {volume:c,delta:p?Math.round((c-p)/p*100):c?100:0,count:curr.length};
}
function latestPR(){
  const vals=state.history.flatMap(h=>(h.exercises||[]).filter(x=>x.id==='pushup').map(x=>Math.max(0,...(x.sets||[]).map(s=>Number(s.actual)||0))));
  return vals.length?Math.max(...vals)+' reps':'24 reps';
}
function chartSvg(){
  const data=state.history.length>=3?trendFromHistory():SAMPLE_TREND;
  const w=720,h=205,pad=24,max=Math.max(...data)*1.15,min=Math.min(...data)*.8;
  const pts=data.map((v,i)=>{const x=pad+(w-pad*2)*(i/(data.length-1));const y=h-pad-(h-pad*2)*((v-min)/(max-min||1));return [x,y]});
  const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=`M ${pts[0][0]} ${h-pad} `+pts.map(p=>`L ${p[0]} ${p[1]}`).join(' ')+` L ${pts.at(-1)[0]} ${h-pad} Z`;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7b5cff" stop-opacity=".26"/><stop offset="100%" stop-color="#7b5cff" stop-opacity="0"/></linearGradient></defs>${[.2,.5,.8].map(f=>`<line class="chart-grid" x1="${pad}" y1="${h*f}" x2="${w-pad}" y2="${h*f}"/>`).join('')}<path class="chart-area" d="${area}"/><path class="chart-line" d="${d}"/>${pts.map(p=>`<circle class="chart-dot" cx="${p[0]}" cy="${p[1]}" r="4"/>`).join('')}</svg>`;
}
function trendFromHistory(){
  const buckets=Array(8).fill(0); const now=Date.now();
  state.history.forEach(h=>{const days=Math.floor((now-new Date(h.date).getTime())/864e5);const idx=7-Math.floor(days/7);if(idx>=0&&idx<8)buckets[idx]+=h.volume||h.reps||0});
  return buckets.map((x,i)=>x||Math.max(10,(i+2)*120));
}
function progressView(){
  const real=state.history.length>0;
  return `${topbar('Progress','Performance intelligence')}<div class="stack fade-in">${metrics()}<section class="card chart-card"><div class="card-head"><div><div class="eyebrow">8-week trend</div><h2>Xu hướng training volume</h2></div><span class="pill violet">${real?'DỮ LIỆU THẬT':'DỮ LIỆU MẪU'}</span></div><div class="chart-wrap">${chartSvg()}</div><div class="chart-legend"><span><i style="background:#9a7cff"></i>Total load</span><span><i style="background:#ff5f6d"></i>Push</span><span><i style="background:#4f8cff"></i>Pull</span><span><i style="background:#3ddc97"></i>Legs</span></div></section><div class="grid"><section class="card card-pad"><div class="card-head"><div><div class="eyebrow">Coach insight</div><h2>Cân bằng khối lượng</h2></div>${icon('spark')}</div><div class="insight"><div class="insight-head">💡 Pull volume thấp hơn Push trong 3 tuần</div><p>Tỷ lệ push/pull đang nghiêng về push. ForgePath sẽ ưu tiên thêm một bài row ở lịch tuần sau để cân bằng vai và lưng trên.</p><button class="secondary compact" style="margin-top:11px" data-action="toast" data-message="Đã đánh dấu để điều chỉnh kế hoạch tuần sau">Điều chỉnh tuần sau</button></div></section><section class="card card-pad"><div class="card-head"><div><div class="eyebrow">Distribution</div><h2>Phân bổ nhóm cơ</h2></div><span class="pill">138 sets</span></div><div class="dist">${[['Ngực',28],['Vai',22],['Tay sau',16],['Lưng',14],['Chân',12],['Core',8]].map(([n,v])=>`<div class="dist-row"><span>${n}</span><div class="dist-track"><div class="dist-fill" style="width:${v*3.2}%"></div></div><b>${v}%</b></div>`).join('')}</div></section></div>${recentHistory()}</div>`;
}
function recentHistory(){
  const rows=state.history.slice(-5).reverse();
  return `<section class="card card-pad"><div class="card-head"><div><div class="eyebrow">History</div><h2>Buổi tập gần đây</h2></div></div>${rows.length?rows.map(h=>`<div class="dist-row" style="grid-template-columns:90px 1fr 80px;padding:9px 0;border-top:1px solid #1d2734"><span>${fmtShort(new Date(h.date))}</span><div><b style="font-size:12px">${esc(h.name||'Workout')}</b><div class="tiny">${h.sets||0} sets · ${h.reps||0} reps</div></div><b>${h.duration||0}m</b></div>`).join(''):`<div class="empty">Chưa có lịch sử thật. Hoàn thành buổi tập đầu tiên để thay dữ liệu mẫu.</div>`}</section>`;
}

function libraryView(){
  const f=state.ui.libraryFilter||'all',q=(state.ui.libraryQuery||'').toLowerCase();
  let list=EXERCISES.filter(e=>(f==='all'||e.pattern===f)&&(e.name+' '+e.muscle).toLowerCase().includes(q));
  return `${topbar('Library','41 exercises from ForgePath V3.12')}<div class="fade-in"><div class="library-tools"><div class="searchbox">${icon('search')}<input id="library-search" value="${esc(state.ui.libraryQuery||'')}" placeholder="Tìm bài tập hoặc nhóm cơ..."></div><div class="filters">${[['all','Tất cả'],['push','Push'],['pull','Pull'],['legs','Chân'],['core','Core']].map(([id,l])=>`<button class="filter ${f===id?'active':''}" data-action="filter" data-filter="${id}">${l}</button>`).join('')}</div></div><div class="exercise-grid">${list.map(e=>`<article class="exercise-card" data-action="exercise-detail" data-id="${e.id}"><div class="exercise-card-top"><div class="exercise-icon">${e.icon||'◦'}</div><span class="difficulty">${levelName(e.diff)}</span></div><h3>${e.name}</h3><p>${e.muscle}</p><div class="exercise-tags"><span class="tag">${PATTERN_LABEL[e.pattern]}</span><span class="tag">${targetFor(e)} ${e.type==='time'?'':'reps'}</span>${e.eq[0]?`<span class="tag">${EQUIPMENT[e.eq[0]]||e.eq[0]}</span>`:'<span class="tag">Bodyweight</span>'}</div></article>`).join('')||'<div class="empty">Không tìm thấy bài tập phù hợp.</div>'}</div></div>`;
}

function mannequinSvg(pattern){
  if(pattern==='push') return `<svg viewBox="0 0 520 230"><line class="floor-line" x1="55" y1="191" x2="470" y2="191"/><g transform="translate(0 8)"><ellipse class="mannequin" cx="125" cy="87" rx="25" ry="23"/><path class="mannequin-shadow" d="M147 99 253 112 334 141 327 159 237 134 139 119Z"/><ellipse class="active-muscle" cx="170" cy="110" rx="29" ry="17" transform="rotate(8 170 110)"/><path class="mannequin" d="M147 104 252 116 336 144 330 163 239 138 141 122Z"/><path class="mannequin" d="M175 117 151 160 137 185 121 181 130 150 147 112Z"/><path class="mannequin" d="M202 122 188 163 178 187 162 184 169 150 180 118Z"/><path class="mannequin" d="M325 145 393 166 449 178 445 190 385 184 317 164Z"/><path class="mannequin-shadow" d="M295 136 363 174 403 186 397 195 350 187 284 158Z"/><circle class="active-muscle" cx="155" cy="123" r="10"/><circle class="active-muscle" cx="188" cy="127" r="10"/></g></svg>`;
  if(pattern==='pull') return `<svg viewBox="0 0 520 230"><line class="floor-line" x1="85" y1="36" x2="435" y2="36"/><g><circle class="mannequin" cx="260" cy="86" r="22"/><path class="mannequin" d="M230 108 Q260 96 290 108 L305 162 Q260 177 215 162Z"/><path class="active-muscle" d="M224 113 Q260 100 296 113 L289 139 Q260 150 231 139Z"/><path class="mannequin" d="M234 112 205 76 178 43 190 36 219 67 247 105Z"/><path class="mannequin" d="M286 112 315 76 342 43 330 36 301 67 273 105Z"/><path class="mannequin" d="M238 160 229 215 244 215 260 170 276 215 291 215 282 160Z"/></g></svg>`;
  if(pattern==='legs') return `<svg viewBox="0 0 520 230"><line class="floor-line" x1="90" y1="205" x2="430" y2="205"/><g><circle class="mannequin" cx="260" cy="54" r="22"/><path class="mannequin" d="M231 78 Q260 67 289 78 L295 126 225 126Z"/><path class="mannequin" d="M229 91 181 118 190 130 239 112Z"/><path class="mannequin" d="M291 91 339 118 330 130 281 112Z"/><path class="active-muscle" d="M230 124 257 126 239 171 208 199 194 188 217 158Z"/><path class="active-muscle" d="M290 124 263 126 281 171 312 199 326 188 303 158Z"/><path class="mannequin-shadow" d="M239 167 211 199 194 188 224 153Z"/><path class="mannequin-shadow" d="M281 167 309 199 326 188 296 153Z"/></g></svg>`;
  return `<svg viewBox="0 0 520 230"><line class="floor-line" x1="70" y1="185" x2="450" y2="185"/><g transform="rotate(-8 260 115)"><circle class="mannequin" cx="155" cy="112" r="22"/><path class="mannequin" d="M177 108 285 91 368 73 372 91 290 119 181 131Z"/><path class="active-muscle" d="M213 104 273 95 282 118 221 126Z"/><path class="mannequin" d="M185 120 150 165 135 159 166 111Z"/><path class="mannequin" d="M202 123 185 171 169 167 184 119Z"/><path class="mannequin" d="M357 78 414 103 443 132 434 141 399 117 351 96Z"/></g></svg>`;
}

function previousFor(id){
  for(let i=state.history.length-1;i>=0;i--){const ex=(state.history[i].exercises||[]).find(x=>x.id===id);if(ex)return ex.sets?.map(s=>s.actual).filter(Boolean)||[]}
  return [];
}
function buildWorkout(exercises=todayExercises(),name=planTitle()){
  return {id:'w_'+Date.now(),name,startedAt:new Date().toISOString(),index:0,exercises:exercises.map(e=>({id:e.id,sets:[0,1,2].map((_,i)=>({actual:'',rir:2,done:false,previous:previousFor(e.id)[i]||''}))}))};
}
function currentExercise(){return state.currentWorkout?.exercises[state.currentWorkout.index]}
function workoutView(){
  const w=state.currentWorkout, item=currentExercise(),e=byId(item.id),idx=w.index,total=w.exercises.length;
  const prev=previousFor(e.id);
  return `<div class="workout-shell fade-in"><div class="workout-top"><button class="icon-btn" data-action="exit-workout">${icon('back')}</button><div style="text-align:center"><b>${esc(w.name)}</b><div class="tiny">Bài ${idx+1} / ${total}</div></div><button class="icon-btn" data-action="toast" data-message="Workout đang được lưu tự động">${icon('menu')}</button></div><div class="workout-progress">${w.exercises.map((_,i)=>`<i class="${i<=idx?'done':''}"></i>`).join('')}</div>
  <div class="exercise-title"><div class="eyebrow">${PATTERN_LABEL[e.pattern]} · ${levelName(e.diff)}</div><h1>${e.name}</h1><div class="sub">Primary: ${e.muscle}</div></div>
  <div class="exercise-visual" style="margin-top:14px"><span class="form-badge">SVG FORM GUIDE · LIGHTWEIGHT</span>${mannequinSvg(e.pattern)}</div>
  <div class="dual-stats"><div class="statbox"><div class="label">Lần trước</div><b>${prev.length?prev.join(' · '):'Chưa có dữ liệu'}</b><small>${prev.length?'reps / seconds':'Buổi đầu tiên'}</small></div><div class="statbox"><div class="label">Mục tiêu</div><b>3 × ${targetFor(e)}</b><small>RIR 2–3</small></div></div>
  <div class="set-table"><div class="set-row header"><div class="set-cell">Set</div><div class="set-cell">Trước</div><div class="set-cell">Mục tiêu</div><div class="set-cell">Thực tế</div><div class="set-cell">RIR</div></div>${item.sets.map((s,i)=>`<div class="set-row"><div class="set-cell"><button class="complete-set ${s.done?'on':''}" data-action="toggle-set" data-set="${i}">${s.done?icon('check'):i+1}</button></div><div class="set-cell">${s.previous||'—'}</div><div class="set-cell">${targetFor(e)}</div><div class="set-cell"><input class="set-input ${s.done?'done':''}" data-field="actual" data-set="${i}" inputmode="numeric" value="${esc(s.actual)}" placeholder="${e.type==='time'?'sec':'reps'}"></div><div class="set-cell"><input class="set-input ${s.done?'done':''}" data-field="rir" data-set="${i}" inputmode="numeric" min="0" max="5" value="${esc(s.rir)}"></div></div>`).join('')}<button class="add-set" data-action="add-set">${icon('plus')} Thêm set</button></div>
  <section class="card card-pad timer"><div class="timer-ring" id="timer-ring" style="--timer:0"><b id="timer-value">REST</b></div><div class="timer-copy"><b>Rest Timer</b><span id="timer-copy">Hoàn thành set để bắt đầu</span></div><button class="secondary compact" data-action="timer-add">+30s</button></section>
  <div class="action-grid"><button class="action-btn" data-action="replace-exercise">${icon('refresh')} Thay bài</button><button class="action-btn" data-action="skip-exercise">${icon('skip')} Bỏ qua</button><button class="action-btn" data-action="notes">${icon('note')} Ghi chú</button></div>
  <button class="form-guide" data-action="youtube" data-id="${e.id}"><span class="guide-icon">${icon('play')}</span><span><b>YouTube Form Guide</b><span>Tìm video kỹ thuật cho “${e.name}”</span></span><span class="chev">${icon('external')}</span></button>
  <div class="btn-row" style="margin-top:14px"><button class="secondary" data-action="prev-exercise" ${idx===0?'disabled':''}>Bài trước</button><button class="primary" data-action="next-exercise">${idx===total-1?'Hoàn thành buổi tập':'Bài tiếp theo'} ${icon(idx===total-1?'check':'chevron')}</button></div></div>`;
}

function render(){
  const app=$('#app');
  if(state.currentWorkout){app.innerHTML=`<main class="main" style="grid-column:1/-1"><div class="content">${workoutView()}</div></main>`;tickTimer();return;}
  const view=state.tab==='today'?todayView():state.tab==='workouts'?workoutsView():state.tab==='progress'?progressView():libraryView();
  app.innerHTML=`${sidebar()}<main class="main"><div class="content">${view}</div></main>${mobileNav()}`;
}

function toast(msg,good=false){
  const el=document.createElement('div');el.className='toast'+(good?' good':'');el.textContent=msg;$('#toast-root').appendChild(el);setTimeout(()=>el.remove(),2200);
}
function modal(title,body){$('#modal-root').innerHTML=`<div class="modal-backdrop" data-action="close-modal"><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><h2>${title}</h2><button class="icon-btn" data-action="close-modal">${icon('x')}</button></div><div class="modal-body">${body}</div></div></div>`}
function closeModal(){$('#modal-root').innerHTML=''}

function openTodayPlan(){
  modal('Kế hoạch hôm nay',`<div class="dist">${todayExercises().map((e,i)=>`<div class="dist-row" style="grid-template-columns:30px 1fr 80px"><span>${i+1}</span><div><b style="font-size:12px">${e.name}</b><div class="tiny">${e.muscle}</div></div><span class="pill">${targetFor(e)}</span></div>`).join('')}</div><button class="primary" style="width:100%;margin-top:16px" data-action="start-workout">Bắt đầu workout</button>`);
}
function openExercise(id){
  const e=byId(id); if(!e)return;
  const next=e.next?byId(e.next):null;
  modal(e.name,`<div class="exercise-visual">${mannequinSvg(e.pattern)}</div><div class="dual-stats"><div class="statbox"><div class="label">Nhóm cơ</div><b>${e.muscle}</b></div><div class="statbox"><div class="label">Mục tiêu</div><b>${targetFor(e)} ${e.type==='time'?'':'reps'}</b></div></div><div style="margin-top:14px" class="insight"><div class="insight-head">${icon('spark')} ForgePath progression</div><p>${next?`Khi bạn đạt ổn định ${e.rep?.[1]||''} ${e.type==='time'?'giây':'reps'} với RIR ≥2, bước tiếp theo là <b>${next.name}</b>.`:'Đây là bài ở cuối progression hiện tại.'}</p></div><button class="primary" style="width:100%;margin-top:14px" data-action="youtube" data-id="${e.id}">${icon('play')} Tìm hướng dẫn trên YouTube</button>`);
}
function openProfile(){
  modal('Hồ sơ & thiết bị',`<div class="field"><label>Tên hiển thị</label><input id="profile-name" value="${esc(state.profile.name||'')}"></div><div class="field"><label>Thời lượng mặc định</label><div class="option-grid">${[30,45,60].map(v=>`<button class="option ${state.profile.minutes===v?'on':''}" data-action="profile-minutes" data-value="${v}">${v} phút</button>`).join('')}</div></div><div class="field"><label>Dụng cụ có sẵn</label><div class="option-grid">${Object.entries(EQUIPMENT).map(([k,l])=>`<button class="option ${(state.profile.equipment||[]).includes(k)?'on':''}" data-action="profile-equipment" data-value="${k}">${l}</button>`).join('')}</div></div><button class="primary" style="width:100%" data-action="save-profile">Lưu thay đổi</button>${state.migration?`<div class="tiny" style="margin-top:12px">Đã migrate dữ liệu từ ${state.migration.from}.</div>`:''}`);
}
function openNotes(){
  const item=currentExercise();
  modal('Ghi chú bài tập',`<div class="field"><label>Ghi chú cho bài hiện tại</label><textarea id="exercise-note" placeholder="Ví dụ: set 3 vai trái hơi mỏi...">${esc(item.note||'')}</textarea></div><button class="primary" style="width:100%" data-action="save-note">Lưu ghi chú</button>`);
}
function replaceExercise(){
  const item=currentExercise(),old=byId(item.id),alts=EXERCISES.filter(e=>e.pattern===old.pattern&&e.id!==old.id&&eqAvailable(e)).sort((a,b)=>Math.abs(a.diff-old.diff)-Math.abs(b.diff-old.diff)).slice(0,6);
  modal('Thay bài '+old.name,alts.map(e=>`<button class="option" style="width:100%;margin-bottom:8px;text-align:left" data-action="choose-replacement" data-id="${e.id}"><b>${e.name}</b><div class="tiny">${e.muscle} · ${levelName(e.diff)}</div></button>`).join(''));
}

function startWorkout(exercises=todayExercises(),name=planTitle()){
  state.currentWorkout=buildWorkout(exercises,name); state.ui.restEnd=0; persist(); closeModal(); render();
}
function finishWorkout(){
  const w=state.currentWorkout;
  const exercises=w.exercises.map(x=>({...x,sets:x.sets.map(s=>({...s,actual:Number(s.actual)||0,rir:Number(s.rir)||0}))}));
  const reps=exercises.reduce((a,x)=>a+x.sets.reduce((b,s)=>b+(Number(s.actual)||0),0),0);
  const sets=exercises.reduce((a,x)=>a+x.sets.filter(s=>s.done||s.actual).length,0);
  const duration=Math.max(1,Math.round((Date.now()-new Date(w.startedAt).getTime())/60000));
  state.history.push({date:new Date().toISOString(),name:w.name,reps,sets,duration,volume:reps*10,exercises});
  state.history=state.history.slice(-120); state.streak=Math.max(1,(state.streak||0)+1); state.currentWorkout=null;state.tab='progress';state.ui.restEnd=0;persist();render();toast(`Hoàn thành ${sets} sets · ${reps} reps`,true);
}
function nextExercise(){const w=state.currentWorkout;if(w.index>=w.exercises.length-1){finishWorkout();return}w.index++;state.ui.restEnd=0;persist();render()}
function prevExercise(){if(state.currentWorkout.index>0){state.currentWorkout.index--;state.ui.restEnd=0;persist();render()}}
function startRest(sec=90){state.ui.restDuration=sec;state.ui.restEnd=Date.now()+sec*1000;persist();tickTimer()}
function tickTimer(){
  clearInterval(timerLoop); const update=()=>{const ring=$('#timer-ring'),val=$('#timer-value'),copy=$('#timer-copy');if(!ring||!val)return;const rem=Math.max(0,Math.ceil((state.ui.restEnd-Date.now())/1000));const dur=state.ui.restDuration||90;const pct=state.ui.restEnd?clamp((dur-rem)/dur*100,0,100):0;ring.style.setProperty('--timer',pct);val.textContent=state.ui.restEnd?`${Math.floor(rem/60)}:${String(rem%60).padStart(2,'0')}`:'REST';if(copy)copy.textContent=rem?`Set tiếp theo sau ${rem}s`:'Sẵn sàng cho set tiếp theo';if(state.ui.restEnd&&rem===0){state.ui.restEnd=0;persist();clearInterval(timerLoop);toast('Rest complete',true)}};update();timerLoop=setInterval(update,1000);
}
function youtubeFor(id){const e=byId(id);if(!e)return;window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(e.name+' proper form exercise')}`,'_blank','noopener,noreferrer')}

function programStart(id){
  const p=PROGRAMS.find(x=>x.id===id);if(!p)return;let list=[];const each=Math.max(1,Math.floor(7/p.patterns.length));p.patterns.forEach(x=>list.push(...selectFor(x,each)));list=[...new Map(list.map(e=>[e.id,e])).values()].slice(0,8);startWorkout(list,p.name);
}

$('#app').addEventListener('click',e=>{
  const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
  if(a==='nav'){state.tab=b.dataset.tab;persist();render();scrollTo({top:0,behavior:'smooth'})}
  else if(a==='toast')toast(b.dataset.message||'Đã cập nhật')
  else if(a==='profile')openProfile();
  else if(a==='adapt-minutes'){state.daily.minutes=state.daily.minutes===30?(state.profile.minutes||42):30;persist();render();toast('Workout đã điều chỉnh theo thời gian')}
  else if(a==='adapt-equipment'){state.daily.noEquipment=!state.daily.noEquipment;persist();render();toast(state.daily.noEquipment?'Đã chuyển sang bodyweight':'Đã dùng lại thiết bị trong hồ sơ')}
  else if(a==='adapt-energy'){state.daily.lowEnergy=!state.daily.lowEnergy;persist();render();toast('Readiness và workout đã cập nhật')}
  else if(a==='start-workout')startWorkout();
  else if(a==='open-today-plan')openTodayPlan();
  else if(a==='program-start')programStart(b.dataset.program);
  else if(a==='filter'){state.ui.libraryFilter=b.dataset.filter;persist();render()}
  else if(a==='exercise-detail')openExercise(b.dataset.id);
  else if(a==='close-modal')closeModal();
  else if(a==='profile-minutes'){state.profile.minutes=Number(b.dataset.value);state.daily.minutes=Number(b.dataset.value);persist();openProfile()}
  else if(a==='profile-equipment'){const k=b.dataset.value,arr=state.profile.equipment||[];state.profile.equipment=arr.includes(k)?arr.filter(x=>x!==k):[...arr,k];persist();openProfile()}
  else if(a==='save-profile'){const v=$('#profile-name')?.value.trim();if(v)state.profile.name=v;persist();closeModal();render();toast('Đã lưu hồ sơ',true)}
  else if(a==='toggle-set'){const i=Number(b.dataset.set),s=currentExercise().sets[i];s.done=!s.done;if(s.done&&!s.actual)s.actual=byId(currentExercise().id).rep?.[0]||8;persist();render();if(s.done)startRest(90)}
  else if(a==='add-set'){currentExercise().sets.push({actual:'',rir:2,done:false,previous:''});persist();render()}
  else if(a==='timer-add'){const rem=Math.max(0,state.ui.restEnd-Date.now());state.ui.restDuration=(state.ui.restDuration||90)+30;state.ui.restEnd=Date.now()+rem+30000;persist();tickTimer()}
  else if(a==='replace-exercise')replaceExercise();
  else if(a==='choose-replacement'){const old=currentExercise();old.id=b.dataset.id;old.sets=[0,1,2].map((_,i)=>({actual:'',rir:2,done:false,previous:previousFor(old.id)[i]||''}));persist();closeModal();render();toast('Đã thay bài')}
  else if(a==='skip-exercise')nextExercise();
  else if(a==='notes')openNotes();
  else if(a==='save-note'){currentExercise().note=$('#exercise-note')?.value||'';persist();closeModal();toast('Đã lưu ghi chú',true)}
  else if(a==='youtube')youtubeFor(b.dataset.id);
  else if(a==='next-exercise')nextExercise();
  else if(a==='prev-exercise')prevExercise();
  else if(a==='exit-workout'){state.currentWorkout=null;state.ui.restEnd=0;persist();render();toast('Workout đã đóng. Dữ liệu set hiện tại đã được lưu trong phiên.')}
});

$('#app').addEventListener('input',e=>{
  if(e.target.id==='library-search'){state.ui.libraryQuery=e.target.value;persist();const pos=e.target.selectionStart;render();const inp=$('#library-search');if(inp){inp.focus();inp.setSelectionRange(pos,pos)}}
  if(e.target.matches('[data-field]')&&state.currentWorkout){const s=currentExercise().sets[Number(e.target.dataset.set)];s[e.target.dataset.field]=e.target.value;persist()}
});

$('#modal-root').addEventListener('click',e=>{
  const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
  if(a==='close-modal')closeModal();
  else if(a==='start-workout')startWorkout();
  else if(a==='youtube')youtubeFor(b.dataset.id);
  else if(a==='profile-minutes'){state.profile.minutes=Number(b.dataset.value);state.daily.minutes=Number(b.dataset.value);persist();openProfile()}
  else if(a==='profile-equipment'){const k=b.dataset.value,arr=state.profile.equipment||[];state.profile.equipment=arr.includes(k)?arr.filter(x=>x!==k):[...arr,k];persist();openProfile()}
  else if(a==='save-profile'){const v=$('#profile-name')?.value.trim();if(v)state.profile.name=v;persist();closeModal();render();toast('Đã lưu hồ sơ',true)}
  else if(a==='choose-replacement'){const old=currentExercise();old.id=b.dataset.id;old.sets=[0,1,2].map((_,i)=>({actual:'',rir:2,done:false,previous:previousFor(old.id)[i]||''}));persist();closeModal();render();toast('Đã thay bài')}
  else if(a==='save-note'){currentExercise().note=$('#exercise-note')?.value||'';persist();closeModal();toast('Đã lưu ghi chú',true)}
});

window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
render();


(()=>{
  const PREV_RENDER=window.render, PREV_NAV=window.nav;
  state.v36=Object.assign({range:'all',selected:'chest'},state.v36||{});
  const META={
    chest:['Ngực','#ff5a5f'],shoulders:['Vai','#9a72ff'],biceps:['Tay trước','#ff9d54'],triceps:['Tay sau','#ff6f91'],forearms:['Cẳng tay','#f4c84e'],
    abs:['Bụng','#55b6ff'],obliques:['Cơ xiên','#42d7bd'],upperBack:['Lưng trên','#657dff'],lats:['Xô','#43b7ff'],lowerBack:['Lưng dưới','#67c9ef'],
    glutes:['Mông','#f067cb'],quads:['Đùi trước','#93e95e'],hamstrings:['Đùi sau','#5cdb83'],calves:['Bắp chân','#44d19a'],adductors:['Đùi trong','#c2e85d']
  };
  function rangeCutoff(){if(state.v36.range==='7d')return Date.now()-7*864e5;if(state.v36.range==='30d')return Date.now()-30*864e5;return 0}
  function add(w,k,v){w[k]=(w[k]||0)+v}
  function exWeights(ex){
    const s=((ex.name||'')+' '+(ex.muscle||'')+' '+(ex.pattern||'')).toLowerCase(),w={};
    if(ex.pattern==='push'){add(w,'chest',.38);add(w,'shoulders',.27);add(w,'triceps',.27);add(w,'abs',.08)}
    if(ex.pattern==='pull'){add(w,'lats',.32);add(w,'upperBack',.28);add(w,'biceps',.22);add(w,'forearms',.12);add(w,'lowerBack',.06)}
    if(ex.pattern==='legs'){add(w,'quads',.32);add(w,'glutes',.26);add(w,'hamstrings',.22);add(w,'calves',.11);add(w,'adductors',.09)}
    if(ex.pattern==='core'){add(w,'abs',.48);add(w,'obliques',.28);add(w,'lowerBack',.18);add(w,'shoulders',.06)}
    const R=[['chest',/ngực|chest|pec/,.35],['shoulders',/vai|shoulder|delt|handstand|pike/,.36],['biceps',/biceps|tay trước|curl|chin/,.38],['triceps',/triceps|tay sau|dip|extension|push/,.35],['forearms',/forearm|cẳng tay|grip|hang/,.33],['abs',/abs|bụng|crunch|hollow|dragon|l.?sit|v.?up/,.38],['obliques',/oblique|xiên|twist|side plank|pallof|windshield/,.42],['upperBack',/upper back|lưng trên|rhomboid|rear delt|face pull|row/,.36],['lats',/lat|xô|pull.?up|pulldown|front lever/,.40],['lowerBack',/lower back|lưng dưới|good morning|rdl|superman/,.34],['glutes',/glute|mông|hip thrust|bridge|lunge|bulgarian/,.40],['quads',/quad|đùi trước|squat|pistol|step.?up/,.40],['hamstrings',/hamstring|gân kheo|rdl|leg curl|good morning/,.43],['calves',/calf|bắp chân|pogo/,.48],['adductors',/adductor|đùi trong|sumo|cossack/,.47]];
    R.forEach(([k,r,v])=>{if(r.test(s))add(w,k,v)}); const sum=Object.values(w).reduce((a,b)=>a+b,0)||1;Object.keys(w).forEach(k=>w[k]/=sum);return w;
  }
  function historyData(){
    const cutoff=rangeCutoff(),scores={},sets={},top={},last={};Object.keys(META).forEach(k=>{scores[k]=0;sets[k]=0;top[k]={};last[k]=0});
    const hist=state.v24?.exerciseHistory||{};
    Object.entries(hist).forEach(([id,arr])=>{const ex=EXERCISES.find(e=>e.id===id);if(!ex)return;const w=exWeights(ex);(arr||[]).forEach(x=>{const dt=+(x.date||0);if(cutoff&&dt<cutoff)return;const load=Math.max(1,(x.reps||0)+(x.holdSec||0)/5)*(.8+Math.max(0,3-(x.rir??2))*.08)*(.72+Math.min(100,x.form||85)/300);Object.entries(w).forEach(([k,p])=>{scores[k]+=load*p;sets[k]++;top[k][id]=(top[k][id]||0)+load*p;last[k]=Math.max(last[k],dt)})})});
    const max=Math.max(1,...Object.values(scores)),norm={};Object.keys(scores).forEach(k=>norm[k]=scores[k]/max);return{scores,sets,top,last,norm};
  }
  function todayData(){
    const idx=typeof todayPlanIndex==='function'?todayPlanIndex():0,w=state.plan?.[idx],scores={};Object.keys(META).forEach(k=>scores[k]=0);
    if(w)w.exercises.forEach(ex=>{const src=EXERCISES.find(e=>e.id===ex.id)||ex,ww=exWeights(src),vol=Math.max(1,(ex.sets||3)*(((ex.lo||8)+(ex.hi||12))/2));Object.entries(ww).forEach(([k,p])=>scores[k]+=vol*p)});
    const max=Math.max(1,...Object.values(scores)),norm={};Object.keys(scores).forEach(k=>norm[k]=scores[k]/max);return{workout:w,scores,norm};
  }
  function heat(p){if(p<=.01)return '#d8dde0';if(p>=.72)return '#f14f55';if(p>=.42)return '#f3c84b';return '#4d9fe0'}
  function op(p){return p<=.01?.72:Math.min(.96,.48+p*.5)}
  function muscle(k,d,extra=''){const p=d.norm[k]||0,sel=state.v36.selected===k?' sel':'';return `fill="${heat(p)}" fill-opacity="${op(p)}" stroke="#7b878f" stroke-width="1.0" class="v36-muscle${sel}" data-muscle="${k}" onclick="v36Select('${k}')" ${extra}`}
  function baseFill(){return 'fill="#d8dde0" stroke="#7b878f" stroke-width="1"'}
  function front(d){return `<svg viewBox="0 0 220 480" role="img" aria-label="Front muscle map"><g>
    <ellipse cx="110" cy="35" rx="27" ry="31" ${baseFill()}/><path d="M96 63 Q110 70 124 63 L125 83 Q110 91 95 83Z" ${baseFill()}/>
    <path d="M73 82 Q110 69 147 82 L155 161 Q110 180 65 161Z" ${baseFill()}/><path d="M82 157 Q110 170 138 157 L136 205 Q110 222 84 205Z" ${baseFill()}/>
    <path d="M70 87 Q57 95 51 112 L46 162 Q51 169 58 164 L69 119Z" ${baseFill()}/><path d="M150 87 Q163 95 169 112 L174 162 Q169 169 162 164 L151 119Z" ${baseFill()}/>
    <path d="M49 158 L35 232 Q38 239 46 236 L61 169Z" ${baseFill()}/><path d="M171 158 L185 232 Q182 239 174 236 L159 169Z" ${baseFill()}/>
    <path d="M85 204 L74 333 Q81 343 93 337 L105 214Z" ${baseFill()}/><path d="M135 204 L146 333 Q139 343 127 337 L115 214Z" ${baseFill()}/>
    <path d="M75 330 L77 438 Q84 449 94 442 L99 336Z" ${baseFill()}/><path d="M145 330 L143 438 Q136 449 126 442 L121 336Z" ${baseFill()}/>
    <!-- shoulders --> <path d="M70 88 Q57 92 52 106 Q61 112 72 113 Q78 101 82 91Z" ${muscle('shoulders',d)}/><path d="M150 88 Q163 92 168 106 Q159 112 148 113 Q142 101 138 91Z" ${muscle('shoulders',d)}/>
    <!-- chest --> <path d="M83 91 Q97 82 108 88 L108 124 Q91 127 77 116 Q76 101 83 91Z" ${muscle('chest',d)}/><path d="M137 91 Q123 82 112 88 L112 124 Q129 127 143 116 Q144 101 137 91Z" ${muscle('chest',d)}/>
    <!-- abs --> <path d="M95 128 Q110 122 125 128 L123 185 Q110 198 97 185Z" ${muscle('abs',d)}/><path d="M101 132H108V185H101Z M112 132H119V185H112Z" fill="#eef1f2" fill-opacity=".45" stroke="#8d989e" stroke-width=".6"/>
    <!-- obliques --> <path d="M80 123 Q89 128 96 137 L96 184 Q88 177 82 163Z" ${muscle('obliques',d)}/><path d="M140 123 Q131 128 124 137 L124 184 Q132 177 138 163Z" ${muscle('obliques',d)}/>
    <!-- biceps --> <path d="M55 114 Q65 111 70 120 L65 158 Q57 164 50 156Z" ${muscle('biceps',d)}/><path d="M165 114 Q155 111 150 120 L155 158 Q163 164 170 156Z" ${muscle('biceps',d)}/>
    <!-- forearms --> <path d="M48 161 Q57 161 61 171 L48 224 Q40 230 35 224Z" ${muscle('forearms',d)}/><path d="M172 161 Q163 161 159 171 L172 224 Q180 230 185 224Z" ${muscle('forearms',d)}/>
    <!-- adductors --> <path d="M101 208 Q110 205 110 226 L104 305 Q97 301 94 288Z" ${muscle('adductors',d)}/><path d="M119 208 Q110 205 110 226 L116 305 Q123 301 126 288Z" ${muscle('adductors',d)}/>
    <!-- quads --> <path d="M85 211 Q99 207 104 223 L97 319 Q87 330 77 321 L82 236Z" ${muscle('quads',d)}/><path d="M135 211 Q121 207 116 223 L123 319 Q133 330 143 321 L138 236Z" ${muscle('quads',d)}/>
    <!-- calves --> <path d="M78 337 Q91 331 98 347 L94 424 Q86 438 78 425Z" ${muscle('calves',d)}/><path d="M142 337 Q129 331 122 347 L126 424 Q134 438 142 425Z" ${muscle('calves',d)}/>
    <path d="M75 441 Q83 438 96 443 L99 453 Q82 462 69 453Z" ${baseFill()}/><path d="M145 441 Q137 438 124 443 L121 453 Q138 462 151 453Z" ${baseFill()}/>
  </g></svg>`}
  function back(d){return `<svg viewBox="0 0 220 480" role="img" aria-label="Back muscle map"><g>
    <ellipse cx="110" cy="35" rx="27" ry="31" ${baseFill()}/><path d="M96 63 Q110 70 124 63 L125 83 Q110 91 95 83Z" ${baseFill()}/>
    <path d="M73 82 Q110 69 147 82 L155 161 Q110 180 65 161Z" ${baseFill()}/><path d="M82 157 Q110 170 138 157 L136 205 Q110 222 84 205Z" ${baseFill()}/>
    <path d="M70 87 Q57 95 51 112 L46 162 Q51 169 58 164 L69 119Z" ${baseFill()}/><path d="M150 87 Q163 95 169 112 L174 162 Q169 169 162 164 L151 119Z" ${baseFill()}/>
    <path d="M49 158 L35 232 Q38 239 46 236 L61 169Z" ${baseFill()}/><path d="M171 158 L185 232 Q182 239 174 236 L159 169Z" ${baseFill()}/>
    <path d="M85 204 L74 333 Q81 343 93 337 L105 214Z" ${baseFill()}/><path d="M135 204 L146 333 Q139 343 127 337 L115 214Z" ${baseFill()}/>
    <path d="M75 330 L77 438 Q84 449 94 442 L99 336Z" ${baseFill()}/><path d="M145 330 L143 438 Q136 449 126 442 L121 336Z" ${baseFill()}/>
    <!-- rear shoulders --> <path d="M70 88 Q57 92 52 106 Q61 112 72 113 Q78 101 82 91Z" ${muscle('shoulders',d)}/><path d="M150 88 Q163 92 168 106 Q159 112 148 113 Q142 101 138 91Z" ${muscle('shoulders',d)}/>
    <!-- upper back/traps --> <path d="M83 86 Q110 73 137 86 L129 119 Q110 130 91 119Z" ${muscle('upperBack',d)}/>
    <!-- lats --> <path d="M77 116 Q91 117 106 130 L104 169 Q91 172 79 158Z" ${muscle('lats',d)}/><path d="M143 116 Q129 117 114 130 L116 169 Q129 172 141 158Z" ${muscle('lats',d)}/>
    <!-- lower back --> <path d="M98 133 Q110 140 122 133 L126 185 Q110 195 94 185Z" ${muscle('lowerBack',d)}/>
    <!-- triceps --> <path d="M55 114 Q65 111 70 120 L65 158 Q57 164 50 156Z" ${muscle('triceps',d)}/><path d="M165 114 Q155 111 150 120 L155 158 Q163 164 170 156Z" ${muscle('triceps',d)}/>
    <!-- forearms --> <path d="M48 161 Q57 161 61 171 L48 224 Q40 230 35 224Z" ${muscle('forearms',d)}/><path d="M172 161 Q163 161 159 171 L172 224 Q180 230 185 224Z" ${muscle('forearms',d)}/>
    <!-- glutes --> <path d="M84 187 Q97 178 108 190 L108 221 Q94 230 82 215Z" ${muscle('glutes',d)}/><path d="M136 187 Q123 178 112 190 L112 221 Q126 230 138 215Z" ${muscle('glutes',d)}/>
    <!-- hamstrings --> <path d="M84 218 Q99 215 104 231 L97 319 Q87 329 77 319Z" ${muscle('hamstrings',d)}/><path d="M136 218 Q121 215 116 231 L123 319 Q133 329 143 319Z" ${muscle('hamstrings',d)}/>
    <!-- calves --> <path d="M78 337 Q91 331 98 347 L94 424 Q86 438 78 425Z" ${muscle('calves',d)}/><path d="M142 337 Q129 331 122 347 L126 424 Q134 438 142 425Z" ${muscle('calves',d)}/>
    <path d="M75 441 Q83 438 96 443 L99 453 Q82 462 69 453Z" ${baseFill()}/><path d="M145 441 Q137 438 124 443 L121 453 Q138 462 151 453Z" ${baseFill()}/>
  </g></svg>`}
  function topNames(data,k){return Object.entries(data.top?.[k]||{}).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>EXERCISES.find(e=>e.id===id)?.name||id)}
  function profileMarkup(){const d=historyData(),k=META[state.v36.selected]?state.v36.selected:'chest',m=META[k],names=topNames(d,k),p=d.norm[k]||0;return `<div class="v36-card" id="v36-profile"><div class="v36-head"><div><div class="v30-tag">PROFILE HEATMAP • V4.0</div><h3 style="margin-top:8px">Segmented Muscle Map</h3><p>Không overlay. Mỗi vùng cơ là chính path của mô hình và được tô trực tiếp theo dữ liệu tập.</p></div><div class="v36-range">${[['7d','7 ngày'],['30d','30 ngày'],['all','Tất cả']].map(([x,l])=>`<button class="${state.v36.range===x?'on':''}" onclick="v36Range('${x}')">${l}</button>`).join('')}</div></div><div class="v36-map"><div class="v36-body"><div class="v36-side">Front</div>${front(d)}</div><div class="v36-body"><div class="v36-side">Back</div>${back(d)}</div></div><div class="v36-scale"><span><i style="background:#4d9fe0"></i>Nhẹ</span><span><i style="background:#f3c84b"></i>Vừa</span><span><i style="background:#f14f55"></i>Mạnh</span></div><div class="v36-detail"><div class="v36-detail-title"><div><small class="sub">Đang chọn</small><h4>${m[0]}</h4></div><span class="v36-heat" style="color:${heat(p)}">${Math.round(p*100)}% heat</span></div><div class="v36-stats"><div class="v36-stat"><b>${(d.scores[k]||0).toFixed(1)}</b><span>VOLUME</span></div><div class="v36-stat"><b>${d.sets[k]||0}</b><span>LOGGED SETS</span></div><div class="v36-stat"><b>${d.last[k]?new Date(d.last[k]).toLocaleDateString():'—'}</b><span>LAST TRAINED</span></div><div class="v36-stat"><b>${names.length}</b><span>TOP EXERCISES</span></div></div><div class="v36-pills">${names.length?names.map(x=>`<span>${x}</span>`).join(''):'<span>Chưa có dữ liệu cho nhóm cơ này</span>'}</div></div><div class="v36-legend">${Object.entries(META).map(([x,v])=>`<button onclick="v36Select('${x}')"><i style="background:${heat(d.norm[x]||0)}"></i>${v[0]}</button>`).join('')}</div><div class="v36-runtime-note">SVG anatomy chạy trực tiếp trên web, nhẹ và phù hợp cả mobile lẫn desktop.</div></div>`}
  function homeMarkup(){const d=todayData(),w=d.workout,tops=Object.entries(d.norm).sort((a,b)=>b[1]-a[1]).filter(x=>x[1]>.05).slice(0,5);return `<div class="v36-card v36-home-card" id="v36-home"><div class="v36-head"><div><h3>Training Focus hôm nay</h3><p>${w?w.title:'Recovery day'} • tô trực tiếp lên từng vùng cơ</p></div><span class="v30-tag">V4.0</span></div><div class="v36-map"><div class="v36-body"><div class="v36-side">Front</div>${front(d)}</div><div class="v36-body"><div class="v36-side">Back</div>${back(d)}</div></div><div class="v36-scale"><span><i style="background:#4d9fe0"></i>Nhẹ</span><span><i style="background:#f3c84b"></i>Vừa</span><span><i style="background:#f14f55"></i>Mạnh</span></div><div class="v36-pills">${tops.length?tops.map(([k,v])=>`<span style="border-color:${heat(v)};color:${heat(v)}">${META[k][0]} ${Math.round(v*100)}%</span>`).join(''):'<span>Không có workout hôm nay</span>'}</div></div>`}
  window.v36Select=k=>{state.v36.selected=k;save();const old=document.getElementById('v36-profile');if(old){const box=document.createElement('div');box.innerHTML=profileMarkup();old.replaceWith(box.firstElementChild)}};
  window.v36Range=k=>{state.v36.range=k;save();const old=document.getElementById('v36-profile');if(old){const box=document.createElement('div');box.innerHTML=profileMarkup();old.replaceWith(box.firstElementChild)}};
  function patchProfile(){if(state.tab!=='progress'||state.v31?.progressView!=='overview')return;const old=document.getElementById('v34-anatomy')||document.querySelector('.v33-card');if(old&&!old.closest('#v36-profile')){const box=document.createElement('div');box.innerHTML=profileMarkup();old.replaceWith(box.firstElementChild)}}
  function patchHome(){
    if(state.tab!=='home')return;
    const current=document.querySelector('.v351-daily')||document.getElementById('v36-home');
    if(current&&!current.closest('#v36-home')){const box=document.createElement('div');box.innerHTML=homeMarkup();current.replaceWith(box.firstElementChild);return;}
    if(!document.getElementById('v36-home')){const panel=document.querySelector('.v31-heroBody');if(panel)panel.innerHTML=homeMarkup();}
  }
  function patch(){setTimeout(()=>{patchProfile();patchHome()},25);setTimeout(()=>{patchProfile();patchHome()},140)}
  function render36(){PREV_RENDER();patch()} window.render=render36;window.nav=function(tab){PREV_NAV(tab);patch()};try{render=render36}catch(_){ } patch();
})();

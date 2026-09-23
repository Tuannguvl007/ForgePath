
(()=>{
  const VERSION='V4.0';

  const META={
    chest:'Ngực',shoulders:'Vai',biceps:'Tay trước',triceps:'Tay sau',forearms:'Cẳng tay / Grip',abs:'Bụng',obliques:'Cơ xiên',
    upperBack:'Lưng trên',lats:'Xô',lowerBack:'Lưng dưới',glutes:'Mông',quads:'Đùi trước',hamstrings:'Đùi sau',calves:'Bắp chân',adductors:'Đùi trong'
  };
  const KEYS=Object.keys(META);
  state.v310=Object.assign({range:state.v36?.range||'all',selected:state.v36?.selected||'chest'},state.v310||{});

  const heat=p=>p<=.01?'#cbd2d6':p>=.72?'#f04f55':p>=.42?'#f0c84b':'#55aee4';
  const fillAttrs=(k,d)=>{const p=d.norm?.[k]||0,sel=state.v310.selected===k;return `class="fp310-muscle${sel?' selected':''}" data-muscle="${k}" fill="${heat(p)}" fill-opacity="${p<=.01?.64:Math.min(.98,.58+p*.40)}" stroke="${sel?'#ffffff':'#77868e'}" stroke-width="${sel?'1.9':'1.05'}" vector-effect="non-scaling-stroke"`;};
  const neutral='fill="#cbd2d6" fill-opacity=".72" stroke="#77868e" stroke-width="1.05" vector-effect="non-scaling-stroke"';
  const dark='fill="#9ba7ad" fill-opacity=".55" stroke="#77868e" stroke-width=".85" vector-effect="non-scaling-stroke"';

  function add(w,k,v){w[k]=(w[k]||0)+v}
  function weights(ex){
    const s=((ex?.name||'')+' '+(ex?.muscle||'')+' '+(ex?.pattern||'')).toLowerCase(),w={};
    if(ex?.pattern==='push'){add(w,'chest',.38);add(w,'shoulders',.25);add(w,'triceps',.29);add(w,'abs',.08)}
    if(ex?.pattern==='pull'){add(w,'lats',.34);add(w,'upperBack',.27);add(w,'biceps',.21);add(w,'forearms',.12);add(w,'lowerBack',.06)}
    if(ex?.pattern==='legs'){add(w,'quads',.32);add(w,'glutes',.27);add(w,'hamstrings',.22);add(w,'calves',.10);add(w,'adductors',.09)}
    if(ex?.pattern==='core'){add(w,'abs',.50);add(w,'obliques',.27);add(w,'lowerBack',.18);add(w,'shoulders',.05)}
    const R=[['chest',/ngực|chest|pec/,.35],['shoulders',/vai|shoulder|delt|handstand|pike/,.36],['biceps',/biceps|tay trước|curl|chin/,.38],['triceps',/triceps|tay sau|dip|extension|push/,.38],['forearms',/forearm|cẳng tay|grip|hang/,.34],['abs',/abs|bụng|crunch|hollow|dragon|l.?sit|v.?up/,.40],['obliques',/oblique|xiên|twist|side plank|pallof|windshield/,.42],['upperBack',/upper back|lưng trên|rhomboid|rear delt|face pull|row/,.38],['lats',/lat|xô|pull.?up|pulldown|front lever/,.42],['lowerBack',/lower back|lưng dưới|good morning|rdl|superman/,.35],['glutes',/glute|mông|hip thrust|bridge|lunge|bulgarian/,.42],['quads',/quad|đùi trước|squat|pistol|step.?up/,.42],['hamstrings',/hamstring|gân kheo|rdl|leg curl|good morning/,.44],['calves',/calf|bắp chân|pogo/,.50],['adductors',/adductor|đùi trong|sumo|cossack/,.48]];
    R.forEach(([k,r,v])=>{if(r.test(s))add(w,k,v)});const sum=Object.values(w).reduce((a,b)=>a+b,0)||1;Object.keys(w).forEach(k=>w[k]/=sum);return w;
  }
  function cutoff(){if(state.v310.range==='7d')return Date.now()-7*864e5;if(state.v310.range==='30d')return Date.now()-30*864e5;return 0}
  function historyData(){
    const scores={},sets={},top={},last={};KEYS.forEach(k=>{scores[k]=0;sets[k]=0;top[k]={};last[k]=0});const cut=cutoff(),hist=state.v24?.exerciseHistory||{};
    Object.entries(hist).forEach(([id,arr])=>{const ex=EXERCISES.find(e=>e.id===id);if(!ex)return;const ww=weights(ex);(arr||[]).forEach(x=>{const dt=+(x.date||0);if(cut&&dt<cut)return;const load=Math.max(1,(x.reps||0)+(x.holdSec||0)/5)*(.8+Math.max(0,3-(x.rir??2))*.08)*(.72+Math.min(100,x.form||85)/300);Object.entries(ww).forEach(([k,p])=>{scores[k]+=load*p;sets[k]++;top[k][id]=(top[k][id]||0)+load*p;last[k]=Math.max(last[k],dt)})})});
    const max=Math.max(1,...Object.values(scores)),norm={};KEYS.forEach(k=>norm[k]=scores[k]/max);return{scores,sets,top,last,norm};
  }
  function todayData(){
    const idx=typeof todayPlanIndex==='function'?todayPlanIndex():0,w=state.plan?.[idx],scores={};KEYS.forEach(k=>scores[k]=0);
    if(w)(w.exercises||[]).forEach(ex=>{const src=EXERCISES.find(e=>e.id===ex.id)||ex,ww=weights(src),vol=Math.max(1,(ex.sets||3)*(((ex.lo||8)+(ex.hi||12))/2));Object.entries(ww).forEach(([k,p])=>scores[k]+=vol*p)});
    const max=Math.max(1,...Object.values(scores)),norm={};KEYS.forEach(k=>norm[k]=scores[k]/max);return{workout:w,scores,norm};
  }

  function frontSvg(d){return `<svg class="fp310-anatomy" viewBox="0 0 280 540" role="img" aria-label="Bản đồ cơ mặt trước">
    <g class="fp310-base">
      <ellipse cx="140" cy="47" rx="29" ry="36" ${neutral}/><path d="M123 77 Q140 88 157 77 L158 101 Q140 112 122 101Z" ${neutral}/>
      <path d="M93 106 Q112 91 140 94 Q168 91 187 106 Q194 137 190 181 Q173 207 140 208 Q107 207 90 181 Q86 137 93 106Z" ${neutral}/>
      <path d="M108 193 Q140 207 172 193 L174 243 Q159 260 140 263 Q121 260 106 243Z" ${neutral}/>
      <path d="M91 112 Q73 115 62 134 Q57 163 57 191 Q64 198 73 194 L88 145Z" ${neutral}/><path d="M189 112 Q207 115 218 134 Q223 163 223 191 Q216 198 207 194 L192 145Z" ${neutral}/>
      <path d="M61 187 Q52 225 43 273 Q47 282 58 279 L77 198Z" ${neutral}/><path d="M219 187 Q228 225 237 273 Q233 282 222 279 L203 198Z" ${neutral}/>
      <path d="M112 248 Q92 285 91 358 Q98 375 113 370 L132 266Z" ${neutral}/><path d="M168 248 Q188 285 189 358 Q182 375 167 370 L148 266Z" ${neutral}/>
      <path d="M94 355 Q86 402 88 478 Q96 492 111 485 L121 367Z" ${neutral}/><path d="M186 355 Q194 402 192 478 Q184 492 169 485 L159 367Z" ${neutral}/>
      <path d="M87 482 Q103 478 115 488 L116 502 Q94 516 78 502Z" ${neutral}/><path d="M193 482 Q177 478 165 488 L164 502 Q186 516 202 502Z" ${neutral}/>
      <path d="M136 262 L144 262 L149 348 Q140 360 131 348Z" ${dark}/>
    </g>
    <g class="fp310-muscles">
      <path d="M92 110 Q75 112 67 130 Q70 149 90 153 Q101 137 105 116 Q100 110 92 110Z M188 110 Q205 112 213 130 Q210 149 190 153 Q179 137 175 116 Q180 110 188 110Z" ${fillAttrs('shoulders',d)} />
      <path d="M107 113 Q124 102 137 108 L137 151 Q118 157 99 145 Q96 126 107 113Z M173 113 Q156 102 143 108 L143 151 Q162 157 181 145 Q184 126 173 113Z" ${fillAttrs('chest',d)} />
      <path d="M68 144 Q83 139 91 151 L84 190 Q72 200 62 188Z M212 144 Q197 139 189 151 L196 190 Q208 200 218 188Z" ${fillAttrs('biceps',d)} />
      <path d="M59 194 Q71 192 77 204 L61 267 Q49 278 43 265Z M221 194 Q209 192 203 204 L219 267 Q231 278 237 265Z" ${fillAttrs('forearms',d)} />
      <path d="M119 155 Q140 148 161 155 L158 229 Q140 245 122 229Z M126 160H137V226H126Z M143 160H154V226H143Z" ${fillAttrs('abs',d)} />
      <path d="M100 151 Q112 157 121 171 L121 230 Q108 221 101 203 Q95 177 100 151Z M180 151 Q168 157 159 171 L159 230 Q172 221 179 203 Q185 177 180 151Z" ${fillAttrs('obliques',d)} />
      <path d="M104 257 Q122 250 132 269 L119 350 Q106 370 94 351 Q94 294 104 257Z M176 257 Q158 250 148 269 L161 350 Q174 370 186 351 Q186 294 176 257Z" ${fillAttrs('quads',d)} />
      <path d="M128 264 Q140 255 140 282 L135 349 Q125 340 119 319Z M152 264 Q140 255 140 282 L145 349 Q155 340 161 319Z" ${fillAttrs('adductors',d)} />
      <path d="M95 367 Q111 358 121 378 L113 470 Q101 491 90 469 Q87 411 95 367Z M185 367 Q169 358 159 378 L167 470 Q179 491 190 469 Q193 411 185 367Z" ${fillAttrs('calves',d)} />
    </g>
    <g opacity=".5" stroke="#8e9aa0" fill="none" stroke-width="1"><path d="M140 106V241"/><path d="M104 178Q140 189 176 178"/><path d="M122 186H158M122 203H158M122 220H158"/></g>
  </svg>`}

  function backSvg(d){return `<svg class="fp310-anatomy" viewBox="0 0 280 540" role="img" aria-label="Bản đồ cơ mặt sau">
    <g class="fp310-base">
      <ellipse cx="140" cy="47" rx="29" ry="36" ${neutral}/><path d="M123 77 Q140 88 157 77 L158 101 Q140 112 122 101Z" ${neutral}/>
      <path d="M93 106 Q112 91 140 94 Q168 91 187 106 Q194 137 190 181 Q173 207 140 208 Q107 207 90 181 Q86 137 93 106Z" ${neutral}/>
      <path d="M108 193 Q140 207 172 193 L174 243 Q159 260 140 263 Q121 260 106 243Z" ${neutral}/>
      <path d="M91 112 Q73 115 62 134 Q57 163 57 191 Q64 198 73 194 L88 145Z" ${neutral}/><path d="M189 112 Q207 115 218 134 Q223 163 223 191 Q216 198 207 194 L192 145Z" ${neutral}/>
      <path d="M61 187 Q52 225 43 273 Q47 282 58 279 L77 198Z" ${neutral}/><path d="M219 187 Q228 225 237 273 Q233 282 222 279 L203 198Z" ${neutral}/>
      <path d="M112 248 Q92 285 91 358 Q98 375 113 370 L132 266Z" ${neutral}/><path d="M168 248 Q188 285 189 358 Q182 375 167 370 L148 266Z" ${neutral}/>
      <path d="M94 355 Q86 402 88 478 Q96 492 111 485 L121 367Z" ${neutral}/><path d="M186 355 Q194 402 192 478 Q184 492 169 485 L159 367Z" ${neutral}/>
      <path d="M87 482 Q103 478 115 488 L116 502 Q94 516 78 502Z" ${neutral}/><path d="M193 482 Q177 478 165 488 L164 502 Q186 516 202 502Z" ${neutral}/>
    </g>
    <g class="fp310-muscles">
      <path d="M92 110 Q75 112 67 130 Q70 149 90 153 Q101 137 105 116 Q100 110 92 110Z M188 110 Q205 112 213 130 Q210 149 190 153 Q179 137 175 116 Q180 110 188 110Z" ${fillAttrs('shoulders',d)} />
      <path d="M111 103 Q140 92 169 103 L159 142 Q140 153 121 142Z M121 142 Q140 130 159 142 L153 164 Q140 174 127 164Z" ${fillAttrs('upperBack',d)} />
      <path d="M97 139 Q115 141 132 158 L127 207 Q111 213 98 197 Q88 169 97 139Z M183 139 Q165 141 148 158 L153 207 Q169 213 182 197 Q192 169 183 139Z" ${fillAttrs('lats',d)} />
      <path d="M127 165 Q140 173 153 165 L159 225 Q140 240 121 225Z" ${fillAttrs('lowerBack',d)} />
      <path d="M68 144 Q83 139 91 151 L84 190 Q72 200 62 188Z M212 144 Q197 139 189 151 L196 190 Q208 200 218 188Z" ${fillAttrs('triceps',d)} />
      <path d="M59 194 Q71 192 77 204 L61 267 Q49 278 43 265Z M221 194 Q209 192 203 204 L219 267 Q231 278 237 265Z" ${fillAttrs('forearms',d)} />
      <path d="M104 219 Q122 208 138 223 L138 260 Q118 278 99 257 Q95 235 104 219Z M176 219 Q158 208 142 223 L142 260 Q162 278 181 257 Q185 235 176 219Z" ${fillAttrs('glutes',d)} />
      <path d="M103 267 Q121 260 132 278 L118 350 Q105 369 94 350 Q94 302 103 267Z M177 267 Q159 260 148 278 L162 350 Q175 369 186 350 Q186 302 177 267Z" ${fillAttrs('hamstrings',d)} />
      <path d="M95 367 Q111 358 121 378 L113 470 Q101 491 90 469 Q87 411 95 367Z M185 367 Q169 358 159 378 L167 470 Q179 491 190 469 Q193 411 185 367Z" ${fillAttrs('calves',d)} />
    </g>
    <g opacity=".45" stroke="#8e9aa0" fill="none" stroke-width="1"><path d="M140 103V229"/><path d="M109 118Q140 128 171 118"/><path d="M110 243Q140 259 170 243"/></g>
  </svg>`}

  function topNames(data,k){return Object.entries(data.top?.[k]||{}).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>EXERCISES.find(e=>e.id===id)?.name||id)}
  function mapShell(d){return `<div class="fp310-map"><div class="fp310-side"><b>FRONT</b>${frontSvg(d)}</div><div class="fp310-side"><b>BACK</b>${backSvg(d)}</div></div>`}
  function heatLegend(){return `<div class="fp310-scale"><span><i style="background:#55aee4"></i>Nhẹ</span><span><i style="background:#f0c84b"></i>Vừa</span><span><i style="background:#f04f55"></i>Mạnh</span></div>`}
  function chips(d,all=false){const items=Object.entries(d.norm||{}).sort((a,b)=>b[1]-a[1]).filter(([,v])=>all||v>.03);return `<div class="fp310-chips">${items.map(([k,v])=>`<button class="${state.v310.selected===k?'on':''}" onclick="v310Select('${k}')" style="--heat:${heat(v)}"><i></i>${META[k]} <strong>${Math.round(v*100)}%</strong></button>`).join('')||'<span class="sub">Chưa có nhóm cơ được ghi nhận.</span>'}</div>`}
  function profileMarkup(){const d=historyData(),k=META[state.v310.selected]?state.v310.selected:'chest',p=d.norm[k]||0,names=topNames(d,k);return `<section class="v36-card fp310-card" id="fp310-profile" data-v310="1"><div class="fp310-head"><div><div class="v30-tag">PROFILE HEATMAP • ${VERSION}</div><h3>Anatomical SVG Muscle Map</h3><p>Mỗi nhóm cơ là một SVG path riêng. Heatmap chỉ đổi fill nên không lệch và rất nhẹ trên mobile.</p></div><div class="v36-range">${[['7d','7 ngày'],['30d','30 ngày'],['all','Tất cả']].map(([x,l])=>`<button class="${state.v310.range===x?'on':''}" onclick="v310Range('${x}')">${l}</button>`).join('')}</div></div>${mapShell(d)}${heatLegend()}${chips(d,true)}<div class="fp310-detail"><div><span class="sub">Đang chọn</span><h4>${META[k]}</h4></div><strong style="color:${heat(p)}">${Math.round(p*100)}% heat</strong><div class="fp310-stats"><span><b>${(d.scores[k]||0).toFixed(1)}</b>Volume</span><span><b>${d.sets[k]||0}</b>Logged sets</span><span><b>${d.last[k]?new Date(d.last[k]).toLocaleDateString():'—'}</b>Last trained</span><span><b>${names.length}</b>Top exercises</span></div>${names.length?`<div class="fp310-top">${names.map(x=>`<span>${x}</span>`).join('')}</div>`:''}</div></section>`}
  function homeMarkup(){const d=todayData(),w=d.workout;return `<section class="v36-card fp310-card fp310-home" id="fp310-home" data-v310="1"><div class="fp310-head"><div><h3>Training Focus hôm nay</h3><p>${w?.title||'Recovery day'} • SVG path trực tiếp, không overlay</p></div><span class="v30-tag">${VERSION}</span></div>${mapShell(d)}${heatLegend()}${chips(d,false)}</section>`}
  const nodeFrom=html=>{const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild};
  function patchMaps(){
    document.querySelectorAll('.brand').forEach(el=>{if(/FORGEPATH/i.test(el.textContent||'')){const span=el.querySelector('span');if(span){if(span.textContent!==VERSION)span.textContent=VERSION}else el.innerHTML=`FORGEPATH <span>${VERSION}</span>`}});
    if(state.tab==='home'){
      if(!document.getElementById('fp310-home')){const old=document.getElementById('v36-home')||document.querySelector('.v351-daily');if(old)old.replaceWith(nodeFrom(homeMarkup()));else{const host=document.querySelector('.v31-heroBody');if(host)host.innerHTML=homeMarkup()}}
    }
    if(state.tab==='progress'&&state.v31?.progressView==='overview'){
      if(!document.getElementById('fp310-profile')){const old=document.getElementById('v36-profile')||document.getElementById('v34-anatomy')||document.querySelector('.v33-card');if(old)old.replaceWith(nodeFrom(profileMarkup()))}
    }
  }
  window.v310Select=k=>{if(!META[k])return;state.v310.selected=k;state.v36&&(state.v36.selected=k);save();const p=document.getElementById('fp310-profile');if(p)p.replaceWith(nodeFrom(profileMarkup()));const h=document.getElementById('fp310-home');if(h)h.replaceWith(nodeFrom(homeMarkup()))};
  window.v310Range=k=>{state.v310.range=k;state.v36&&(state.v36.range=k);save();const p=document.getElementById('fp310-profile');if(p)p.replaceWith(nodeFrom(profileMarkup()))};


  const prevRender=window.render,prevNav=window.nav;window.render=function(){const r=prevRender.apply(this,arguments);setTimeout(patchMaps,0);setTimeout(patchMaps,80);return r};window.nav=function(){const r=prevNav.apply(this,arguments);setTimeout(patchMaps,0);setTimeout(patchMaps,80);return r};
  let timer=0;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(patchMaps,40)}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  setTimeout(patchMaps,0);setTimeout(patchMaps,180);
})();


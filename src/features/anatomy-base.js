
(()=>{
  state.v34=Object.assign({range:'all',selected:'chest'},state.v34||{});
  const PREV_RENDER=window.render;
  const PREV_NAV=window.nav;

  const MUSCLES={
    chest:{name:'Ngực',color:'#ff5f7d'},
    shoulders:{name:'Vai',color:'#9c6cff'},
    biceps:{name:'Tay trước',color:'#ff9b54'},
    triceps:{name:'Tay sau',color:'#ff6f91'},
    forearms:{name:'Cẳng tay / Grip',color:'#f7cf5b'},
    abs:{name:'Bụng',color:'#55d9ff'},
    obliques:{name:'Cơ xiên',color:'#49e5c1'},
    upperBack:{name:'Lưng trên',color:'#638bff'},
    lats:{name:'Xô',color:'#3fb9ff'},
    lowerBack:{name:'Lưng dưới',color:'#66d7ff'},
    glutes:{name:'Mông',color:'#ff65cb'},
    quads:{name:'Đùi trước',color:'#a6ff43'},
    hamstrings:{name:'Đùi sau',color:'#5fff92'},
    calves:{name:'Bắp chân',color:'#4ee4a5'},
    adductors:{name:'Đùi trong',color:'#c8ff5c'}
  };

  // Percent positions mapped to the CC BY-SA anatomical base asset.
  const ZONES=[
    ['chest',19.0,24.7,11.0,8.5,'soft'],['chest',31.0,24.7,11.0,8.5,'soft'],
    ['shoulders',14.2,22.4,5.2,6.7,'round'],['shoulders',35.6,22.4,5.2,6.7,'round'],
    ['biceps',12.7,31.8,4.8,8.6,'long'],['biceps',37.2,31.8,4.8,8.6,'long'],
    ['forearms',8.9,43.2,4.4,11.4,'long'],['forearms',41.0,43.2,4.4,11.4,'long'],
    ['abs',24.9,37.6,7.0,14.5,'soft'],
    ['obliques',19.7,38.2,4.0,12.2,'long'],['obliques',30.0,38.2,4.0,12.2,'long'],
    ['quads',20.4,59.8,7.2,17.6,'long'],['quads',29.1,59.8,7.2,17.6,'long'],
    ['adductors',24.7,57.4,4.0,13.8,'poly'],
    ['calves',20.4,78.0,5.7,17.1,'long'],['calves',29.0,78.0,5.7,17.1,'long'],
    ['upperBack',74.9,24.2,21.0,10.5,'poly'],
    ['lats',69.8,35.0,8.0,16.0,'long'],['lats',80.0,35.0,8.0,16.0,'long'],
    ['triceps',65.7,32.5,4.7,9.7,'long'],['triceps',84.1,32.5,4.7,9.7,'long'],
    ['forearms',62.2,43.8,4.2,11.2,'long'],['forearms',87.7,43.8,4.2,11.2,'long'],
    ['lowerBack',74.9,42.9,10.5,12.0,'poly'],
    ['glutes',70.7,53.5,8.4,10.5,'soft'],['glutes',79.2,53.5,8.4,10.5,'soft'],
    ['hamstrings',70.5,64.2,7.1,15.0,'long'],['hamstrings',79.4,64.2,7.1,15.0,'long'],
    ['calves',70.5,79.0,5.9,17.0,'long'],['calves',79.5,79.0,5.9,17.0,'long']
  ];

  function heatColor(p){
    if(p>=.72)return '#ff5656';
    if(p>=.42)return '#ffd54a';
    return '#55b6ff';
  }
  function heatAlpha(p){return Math.max(.04,.12+p*.72).toFixed(3)}

  function rangeCutoff(){
    if(state.v34.range==='7d')return Date.now()-7*864e5;
    if(state.v34.range==='30d')return Date.now()-30*864e5;
    return 0;
  }

  function weightsFor(ex){
    const s=((ex.name||'')+' '+(ex.muscle||'')+' '+(ex.pattern||'')).toLowerCase();
    const w={};
    const add=(k,v)=>w[k]=(w[k]||0)+v;
    // pattern baseline
    if(ex.pattern==='push'){add('chest',.42);add('shoulders',.28);add('triceps',.30)}
    if(ex.pattern==='pull'){add('lats',.36);add('upperBack',.27);add('biceps',.22);add('forearms',.15)}
    if(ex.pattern==='legs'){add('quads',.34);add('glutes',.28);add('hamstrings',.22);add('calves',.10);add('adductors',.06)}
    if(ex.pattern==='core'){add('abs',.56);add('obliques',.25);add('lowerBack',.19)}
    // keyword refinements
    const rules=[
      ['chest',/ngực|chest|pec/,.42],['shoulders',/vai|shoulder|delt|handstand|pike/,.40],
      ['biceps',/biceps|tay trước|curl|chin.?up/,.42],['triceps',/triceps|tay sau|dip|extension|hspu/,.42],
      ['forearms',/forearm|cẳng tay|grip|hang/,.35],['abs',/abs|bụng|crunch|hollow|dragon flag|v.?up|l.?sit/,.44],
      ['obliques',/oblique|xiên|twist|side plank|pallof|windshield/,.45],
      ['upperBack',/upper back|lưng trên|rhomboid|rear delt|face pull|row/,.38],
      ['lats',/lat|xô|pull.?up|pulldown|front lever/,.42],['lowerBack',/lower back|lưng dưới|good morning|rdl|superman/,.36],
      ['glutes',/glute|mông|hip thrust|bridge|lunge|bulgarian/,.42],['quads',/quad|đùi trước|squat|pistol|step.?up/,.42],
      ['hamstrings',/hamstring|gân kheo|rdl|leg curl|good morning/,.46],['calves',/calf|bắp chân|pogo/,.52],
      ['adductors',/adductor|đùi trong|sumo|cossack/,.50]
    ];
    rules.forEach(([k,r,v])=>{if(r.test(s))add(k,v)});
    const total=Object.values(w).reduce((a,b)=>a+b,0)||1;
    Object.keys(w).forEach(k=>w[k]/=total);
    return w;
  }

  function muscleData(){
    const cutoff=rangeCutoff(),scores={},logs={},exerciseScore={},last={};
    Object.keys(MUSCLES).forEach(k=>{scores[k]=0;logs[k]=0;exerciseScore[k]={};last[k]=0});
    const hist=state.v24?.exerciseHistory||{};
    Object.entries(hist).forEach(([id,arr])=>{
      const ex=EXERCISES.find(e=>e.id===id);if(!ex)return;
      const weights=weightsFor(ex);
      (arr||[]).forEach(x=>{
        const dt=+(x.date||0);if(cutoff&&dt<cutoff)return;
        const load=Math.max(1,(x.reps||0)+(x.holdSec||0)/5) * (.75+Math.max(0,3-(x.rir??2))*.08) * (.65+Math.min(100,x.form||85)/250);
        Object.entries(weights).forEach(([k,w])=>{
          scores[k]+=load*w;logs[k]+=1;exerciseScore[k][id]=(exerciseScore[k][id]||0)+load*w;last[k]=Math.max(last[k],dt);
        });
      });
    });
    const max=Math.max(1,...Object.values(scores));
    const norm={};Object.keys(scores).forEach(k=>norm[k]=scores[k]/max);
    return {scores,norm,logs,exerciseScore,last,max};
  }

  function topExercises(data,key){
    return Object.entries(data.exerciseScore[key]||{}).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([id])=>EXERCISES.find(e=>e.id===id)?.name||id);
  }
  function totalSets(){
    const cutoff=rangeCutoff(),hist=state.v24?.exerciseHistory||{};
    return Object.values(hist).reduce((n,a)=>n+(a||[]).filter(x=>!cutoff||+(x.date||0)>=cutoff).length,0);
  }
  function balanceScore(data){
    const vals=['chest','lats','quads','hamstrings','abs','glutes'].map(k=>data.norm[k]||0).filter(x=>x>0);
    if(vals.length<2)return 0;
    const avg=vals.reduce((a,b)=>a+b,0)/vals.length,dev=vals.reduce((a,b)=>a+Math.abs(b-avg),0)/vals.length;
    return Math.max(0,Math.round((1-dev/Math.max(.01,avg))*100));
  }

  function mapMarkup(){
    const data=muscleData(),key=state.v34.selected in MUSCLES?state.v34.selected:'chest',m=MUSCLES[key],top=topExercises(data,key),
          score=data.scores[key]||0,power=data.norm[key]||0,last=data.last[key]||0;
    const zones=ZONES.map(([k,x,y,w,hh,shape])=>{
      const mm=MUSCLES[k],p=data.norm[k]||0,sel=k===key?'selected':'';
      return `<button class="v34-zone ${shape} ${sel}" aria-label="${mm.name}" title="${mm.name}" onclick="v34SelectMuscle('${k}')"
        style="left:${x}%;top:${y}%;width:${w}%;height:${hh}%;--fill:${heatColor(p)};--alpha:${heatAlpha(p)};--outline:${sel?'rgba(255,255,255,.78)':'rgba(255,255,255,.12)'}"></button>`;
    }).join('');
    const legend=Object.entries(MUSCLES).map(([k,v])=>`<button style="color:${v.color}" class="${(data.norm[k]||0)>.35?'hot':''}" onclick="v34SelectMuscle('${k}')"><i style="background:${v.color}"></i>${v.name}</button>`).join('');
    return `<div class="v34-anatomy-card" id="v34-anatomy">
      <div class="v34-anatomy-head">
        <div><div class="v30-tag">PROFILE HEATMAP • V3.4</div><h3 style="margin-top:8px">Anatomical Muscle Map</h3><p>Front + Back • xanh = nhẹ • vàng = vừa • đỏ = mạnh</p></div>
        <div class="v34-range">
          ${[['7d','7 ngày'],['30d','30 ngày'],['all','Tất cả']].map(([k,l])=>`<button class="${state.v34.range===k?'on':''}" onclick="v34SetRange('${k}')">${l}</button>`).join('')}
        </div>
      </div>
      <div class="v34-map-shell">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Muscles_front_and_back.svg/960px-Muscles_front_and_back.svg.png"
             alt="Anatomical front and back muscular system"
             onerror="this.style.opacity='.12'">
        <div class="v34-map-overlay">${zones}</div>
        ${totalSets()===0?'<div class="v34-empty">Chưa có dữ liệu set trong khoảng thời gian này. Heatmap sẽ tự sáng lên sau khi bạn hoàn thành workout.</div>':''}
      </div>
      <div class="v34-muscle-detail" style="--muscleColor:${m.color}">
        <div class="v34-muscle-title"><div><small class="sub">Đang chọn</small><h4>${m.name}</h4></div><span class="v34-score">${Math.round(power*100)}% heat</span></div>
        <div class="v34-stats">
          <div class="v34-stat"><b>${score.toFixed(1)}</b><span>VOLUME POINTS</span></div>
          <div class="v34-stat"><b>${data.logs[key]||0}</b><span>LOGGED SETS</span></div>
          <div class="v34-stat"><b>${last?new Date(last).toLocaleDateString():'—'}</b><span>LAST TRAINED</span></div>
          <div class="v34-stat"><b>${top.length}</b><span>TOP EXERCISES</span></div>
        </div>
        <div class="v34-top-ex">${top.length?top.map(x=>`<span>${x}</span>`).join(''):'<span>Chưa có bài tác động trong khoảng này</span>'}</div>
      </div>
      <div class="v34-balance">
        <div><b>${balanceScore(data)}%</b><small>MUSCLE BALANCE</small></div>
        <div><b>${totalSets()}</b><small>TOTAL LOGS</small></div>
        <div><b>${Object.values(data.scores).filter(x=>x>0).length}/${Object.keys(MUSCLES).length}</b><small>GROUPS TRAINED</small></div>
      </div>
      <div class="v34-legend">${legend}</div>
      <div class="v34-credit">Anatomical base: “Muscles front and back.svg” — OpenStax, Tomáš Kebert & umimeto.org, CC BY-SA 4.0. ForgePath overlays training-data heatmap; base anatomy is used with attribution.</div>
    </div>`;
  }

  window.v34SelectMuscle=function(k){state.v34.selected=k;save();const old=document.getElementById('v34-anatomy');if(old){const box=document.createElement('div');box.innerHTML=mapMarkup();old.replaceWith(box.firstElementChild)}};
  window.v34SetRange=function(k){state.v34.range=k;save();const old=document.getElementById('v34-anatomy');if(old){const box=document.createElement('div');box.innerHTML=mapMarkup();old.replaceWith(box.firstElementChild)}};

  function replaceProfileVisual(){
    if(state.tab!=='progress'||state.v31?.progressView!=='overview')return;
    const profileHost=document.getElementById('v33-profile-main');
    if(profileHost){
      const card=profileHost.closest('.v33-card');
      if(card){
        const box=document.createElement('div');box.innerHTML=mapMarkup();card.replaceWith(box.firstElementChild);
      }
    }
    // In case V3.3 did not mount yet, replace original front/back body grid directly.
    const grids=[...document.querySelectorAll('.v31-bodyGrid')];
    grids.forEach(grid=>{
      if(grid.closest('#v34-anatomy'))return;
      const parent=grid.closest('.v31-heroBody')||grid.parentElement;
      if(parent){
        const box=document.createElement('div');box.innerHTML=mapMarkup();
        parent.replaceWith(box.firstElementChild);
      }
    });
  }

  function removeProfileLegacyLabels(){
    document.querySelectorAll('.v33-cardhead h3').forEach(h=>{
      if(/Athlete Profile/i.test(h.textContent||'')){
        const card=h.closest('.v33-card');if(card){const box=document.createElement('div');box.innerHTML=mapMarkup();card.replaceWith(box.firstElementChild)}
      }
    });
  }

  function enhanceV34(){
    setTimeout(()=>{replaceProfileVisual();removeProfileLegacyLabels()},35);
    setTimeout(()=>{replaceProfileVisual();removeProfileLegacyLabels()},140);
  }
  function renderV34(){PREV_RENDER();enhanceV34()}
  window.render=renderV34;
  window.nav=function(tab){PREV_NAV(tab);enhanceV34()};
  try{render=renderV34}catch(_){}
  enhanceV34();
})();

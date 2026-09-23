
(()=>{
  state.v243 = state.v243 || {search:'', progressTab:'overview'};

  const allLogs=()=>Object.entries(state.v24?.exerciseHistory||{}).flatMap(([exerciseId,a])=>(a||[]).map(x=>({exerciseId,...x}))).sort((a,b)=>(a.date||0)-(b.date||0));
  const hist=id=>state.v24?.exerciseHistory?.[id]||[];
  const prs=id=>state.v24?.prs?.[id]||{maxReps:0,maxHold:0};
  const ready=()=>typeof v23Readiness==='function'?v23Readiness():72;
  const levelName=d=>typeof v23LevelName==='function'?v23LevelName(d):(d<2?'Cơ bản':d<3.2?'Trung cấp':d<4.2?'Nâng cao':'Elite');
  const chain=id=>typeof v24ProgressionFor==='function'?v24ProgressionFor(id):{previous:null,next:null,chain:[id]};
  const exBy=id=>EXERCISES.find(e=>e.id===id);

  function stats(id){
    const H=hist(id),p=prs(id);
    return {H,p,total:H.reduce((a,x)=>a+(x.reps||0),0),
      avgForm:H.length?Math.round(H.reduce((a,x)=>a+(x.form||0),0)/H.length):0,
      avgRir:H.length?(H.reduce((a,x)=>a+(x.rir||0),0)/H.length).toFixed(1):'—'}
  }
  function rec(e){
    const H=hist(e.id),x=H[H.length-1],c=chain(e.id);
    if(!x)return {label:'BASELINE',text:'Chưa có dữ liệu',cls:''};
    if((x.form||0)<75)return {label:'DELOAD',text:'Giảm tải, ưu tiên form',cls:'hard'};
    if((x.rir??0)===0)return {label:'HOLD',text:'Giữ mức hiện tại',cls:''};
    const good=H.slice(-3).filter(z=>(z.form||0)>=88&&(z.rir??0)>=1).length;
    if(good>=2&&c.next)return {label:'PROGRESS',text:'Sẵn sàng biến thể khó hơn',cls:'good'};
    if((x.rir??0)>=2)return {label:'OVERLOAD',text:'+1–2 reps buổi tới',cls:'good'};
    return {label:'HOLD',text:'Lặp lại và tối ưu form',cls:''};
  }

  function navHTML(active){
    const x=[['home','⌂','Home'],['plan','▦','Plan'],['train','＋','Train'],['progress','↗','Progress'],['profile','●','Profile']];
    return `<nav class="bottomnav">${x.map(a=>`<button class="navbtn ${active===a[0]?'active':''}" onclick="nav('${a[0]}')"><i>${a[1]}</i><span>${a[2]}</span></button>`).join('')}</nav>`;
  }

  function trainPage(){
    const lv=state.v23?.libraryLevel||'all', pat=state.v23?.libraryPattern||'all', q=(state.v243.search||'').trim().toLowerCase();
    let list=EXERCISES.filter(e=>available(e));
    const ranges={beginner:[0,2.2],intermediate:[1.7,3.3],advanced:[2.8,4.3],elite:[3.8,9]};
    if(lv!=='all'){const r=ranges[lv];list=list.filter(e=>e.diff>=r[0]&&e.diff<=r[1])}
    if(pat!=='all')list=list.filter(e=>e.pattern===pat);
    if(q)list=list.filter(e=>(e.name+' '+e.muscle).toLowerCase().includes(q));
    list.sort((a,b)=>a.diff-b.diff);

    return `<div class="topbar"><div><div class="brand">LIBRARY <span>V3.0</span></div><div class="kicker">Exercise intelligence • ${list.length} bài</div></div><span class="pill accent">UI 2.1</span></div><main>
      <div class="hero"><div class="eyebrow">PERSONALIZED LIBRARY</div><h1>Bài tập phù hợp với bạn.</h1><p>Lọc theo trình độ, dụng cụ, nhóm vận động và dữ liệu progression thực tế.</p></div>
      <input class="v243-search" placeholder="Tìm bài, nhóm cơ..." value="${state.v243.search||''}" oninput="state.v243.search=this.value;save();render()">
      <div class="v243-toolbar">${[['all','Tất cả'],['beginner','Cơ bản'],['intermediate','Trung cấp'],['advanced','Nâng cao'],['elite','Elite']].map(x=>`<button class="${lv===x[0]?'on':''}" onclick="v23SetFilter('libraryLevel','${x[0]}')">${x[1]}</button>`).join('')}</div>
      <div class="v243-toolbar" style="margin-top:8px">${[['all','Tất cả'],['push','Push'],['pull','Pull'],['legs','Legs'],['core','Core']].map(x=>`<button class="${pat===x[0]?'on':''}" onclick="v23SetFilter('libraryPattern','${x[0]}')">${x[1]}</button>`).join('')}</div>
      <div class="v243-section"><h3>Exercise database</h3><span class="v243-tag">${list.length} phù hợp</span></div>
      <div class="v243-grid">${list.map(e=>{
        const s=stats(e.id),r=rec(e),target=state.profile.levels?.[e.pattern]||2,fit=Math.abs(e.diff-target)<=.65;
        const prog=s.H.length?Math.min(100,Math.round((s.p.maxReps||s.p.maxHold||0)/20*100)):0;
        return `<div class="v243-excard" onclick="v24OpenExercise('${e.id}')"><div class="v243-exhead"><div class="v243-icon">${e.icon||'•'}</div><div class="v243-exmeta"><b>${e.name}</b><small>${e.muscle} · ${levelName(e.diff)}</small></div><span class="v243-fit ${fit?'good':e.diff>target+.65?'hard':''}">${s.H.length?r.label:(fit?'Phù hợp':e.diff>target?'Khó hơn':'Dễ hơn')}</span></div>
        <div class="v243-progressbar"><i style="width:${prog}%"></i></div><div class="v243-feature-row"><div class="v243-mini"><b>${s.p.maxReps||0}</b><small>PR reps</small></div><div class="v243-mini"><b>${s.avgForm||'—'}${s.avgForm?'%':''}</b><small>Form</small></div><div class="v243-mini"><b>${s.H.length}</b><small>Logs</small></div></div></div>`
      }).join('')||'<div class="empty">Không có bài phù hợp với bộ lọc hiện tại.</div>'}</div>
    </main>${navHTML('train')}`;
  }

  function profilePage(){
    const p=state.profile,b=state.v23?.body||{},weight=b.weight||51,height=b.height||170,bmi=(weight/((height/100)**2)).toFixed(1),xp=state.xp||0,lvl=Math.max(1,Math.floor(xp/500)+1),lp=(xp%500)/5;
    return `<div class="topbar"><div><div class="brand">PROFILE <span>2.0</span></div><div class="kicker">Athlete identity • local-first</div></div><span class="pill accent">🔥 ${state.streak||0}</span></div><main>
      <div class="v243-profile-hero"><div class="v243-profile-head"><div class="v243-avatar">${(p.name||'U')[0].toUpperCase()}</div><div style="flex:1"><b style="font-size:21px">${p.name||'Athlete'}</b><div class="sub">Calisthenics Foundation · Level ${lvl}</div><div class="v243-levelbar"><i style="width:${lp}%"></i></div></div></div>
      <div class="v243-statgrid"><div class="v243-stat"><strong>${weight}</strong><small>KG</small></div><div class="v243-stat"><strong>${height}</strong><small>CM</small></div><div class="v243-stat"><strong>${bmi}</strong><small>BMI</small></div><div class="v243-stat"><strong>${ready()}</strong><small>READINESS</small></div></div>
      <div class="v243-profile-list"><div><span>◎ Mục tiêu chính</span><small>${goalLabel(p.goal)}</small></div><div><span>⌁ Dụng cụ hiện có</span><small>${(p.equipment||[]).map(eqLabel).join(' · ')||'Bodyweight'}</small></div><div><span>▣ Lịch tập</span><small>${p.days} buổi/tuần · ${p.minutes} phút</small></div></div></div>
      <div class="v243-section"><h3>Training Data</h3><span class="v243-tag">Data Core</span></div><div class="v243-statgrid"><div class="v243-stat"><strong>${state.history.length}</strong><small>WORKOUTS</small></div><div class="v243-stat"><strong>${allLogs().length}</strong><small>SETS</small></div><div class="v243-stat"><strong>${Object.keys(state.v24?.prs||{}).length}</strong><small>RECORDS</small></div><div class="v243-stat"><strong>${state.xp||0}</strong><small>XP</small></div></div>
      <div class="card"><b>Cá nhân hóa</b><p class="sub">Dữ liệu Profile, thiết bị, mục tiêu và schedule đang lưu cục bộ. Cloud Sync sẽ là bước V2.5.</p><button class="btn full" onclick="state.onboarded=false;save();render()">Chỉnh hồ sơ & đánh giá lại</button></div>
    </main>${navHTML('profile')}`;
  }

  function calendarHTML(){
    const map={};state.history.forEach(x=>{const d=new Date(x.date),k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();map[k]=(map[k]||0)+(x.durationMin||state.profile.minutes||45)});
    let cells='';for(let i=83;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(),v=map[k]||0,c=v>=60?'d':v>=40?'c':v>=20?'b':v?'a':'';cells+=`<div class="v243-day ${c}" title="${d.toLocaleDateString()} · ${v} phút">${d.getDate()}</div>`}
    return `<div class="card"><div class="v243-cal">${cells}</div><p class="sub">12 tuần gần nhất • ô càng sáng = tập càng nhiều</p></div>`;
  }

  function skillHTML(){
    const defs=typeof v24Skills==='function'?v24Skills():[];
    return defs.map(s=>`<div class="v243-section"><h3>${s.name}</h3><span class="v243-tag">Skill Tree</span></div><div class="card"><div class="v243-skill">${s.nodes.map(([id,req])=>{const e=exBy(id),p=prs(id),v=Math.max(p.maxReps||0,p.maxHold||0),done=v>=req,started=v>0;return `<div class="v243-node ${done?'done':started?'now':'lock'}">${done?'✓':started?Math.min(99,Math.round(v/req*100))+'%':'🔒'}<br>${e?.name||id}<br><small>${v}/${req}</small></div>`}).join('')}</div></div>`).join('')||'<div class="empty">Skill tree chưa có dữ liệu.</div>';
  }

  function progressPage(){
    const tab=state.v243.progressTab||'overview', logs=allLogs(), prList=Object.entries(state.v24?.prs||{}).filter(([,p])=>p.maxReps||p.maxHold);
    let body='';
    if(tab==='overview'){
      const recent=state.history.slice(-16),max=Math.max(1,...recent.map(x=>x.exercises||1));
      body=`<div class="v243-statgrid"><div class="v243-stat"><strong>${state.history.length}</strong><small>WORKOUTS</small></div><div class="v243-stat"><strong>${logs.length}</strong><small>SETS</small></div><div class="v243-stat"><strong>${prList.length}</strong><small>PRS</small></div><div class="v243-stat"><strong>${ready()}</strong><small>READINESS</small></div></div>
      <div class="v243-section"><h3>Volume History</h3><span class="v243-tag">Real data</span></div><div class="card"><div class="v243-chart">${recent.length?recent.map(x=>`<i style="height:${Math.max(8,(x.exercises||1)/max*100)}%" title="${x.title}"></i>`).join(''):'<span class="sub">Chưa có session.</span>'}</div></div>
      <div class="v243-section"><h3>Recent PRs</h3></div><div class="card">${prList.slice(-6).reverse().map(([id,p])=>`<div class="v24-pr"><div><b>${exBy(id)?.name||id}</b><small>${p.maxReps?p.maxReps+' reps':''}${p.maxHold?' · '+p.maxHold+'s':''}</small></div><span>🏆</span></div>`).join('')||'<div class="empty">PR sẽ xuất hiện tự động sau khi bạn phá kỷ lục.</div>'}</div>`;
    } else if(tab==='calendar') body=calendarHTML();
    else if(tab==='exercises'){
      const used=EXERCISES.filter(e=>hist(e.id).length);
      body=`<div class="v243-grid">${used.map(e=>{const s=stats(e.id),r=rec(e);return `<div class="v243-excard" onclick="v24OpenExercise('${e.id}')"><div class="v243-exhead"><div class="v243-icon">${e.icon||'•'}</div><div class="v243-exmeta"><b>${e.name}</b><small>${s.H.length} logs · ${s.total} reps</small></div><span class="v243-fit ${r.cls}">${r.label}</span></div></div>`}).join('')||'<div class="empty">Các bài đã tập sẽ xuất hiện ở đây.</div>'}</div>`;
    } else if(tab==='skills') body=skillHTML();
    else body=`<div class="card">${prList.map(([id,p])=>`<div class="v24-pr"><div><b>${exBy(id)?.name||id}</b><small>${p.maxReps?'Max reps '+p.maxReps:''}${p.maxHold?' · Hold '+p.maxHold+'s':''}</small></div><span>🏆</span></div>`).join('')||'<div class="empty">Chưa có Personal Record.</div>'}</div>`;

    return `<div class="topbar"><div><div class="brand">PROGRESS <span>2.0</span></div><div class="kicker">Volume · Records · Skills · Calendar</div></div><span class="pill accent">${ready()}/100</span></div><main>
      <div class="v243-tabs">${[['overview','Overview'],['calendar','Calendar'],['exercises','Exercises'],['skills','Skill Tree'],['records','Records']].map(x=>`<button class="${tab===x[0]?'on':''}" onclick="state.v243.progressTab='${x[0]}';save();render()">${x[1]}</button>`).join('')}</div>${body}
      <div class="v243-section"><h3>Adaptive Engine</h3><span class="v243-tag">Local logic</span></div><div class="v243-ai"><b>Session Data</b><div class="v243-flow"><div>Reps<br><small>Volume</small></div><div>RIR<br><small>Recovery</small></div><div>Form<br><small>Technique</small></div></div><div class="v243-arrow">↓</div><div class="v241-change"><b>Next Workout Generator</b><div class="sub">Reps · Tempo · Rest · Exercise progression</div></div></div>
    </main>${navHTML('progress')}`;
  }

  function detailPage(id){
    const e=exBy(id);if(!e)return trainPage();
    const s=stats(id),r=rec(e),mx=Math.max(1,...s.H.map(x=>x.reps||x.holdSec||1)),c=chain(id);
    return `<div class="topbar"><button class="iconbtn" onclick="state.exerciseDetail=null;state.tab='train';save();render()">‹</button><div><div class="brand">${e.name}</div><div class="kicker">${e.muscle} · Exercise Intelligence</div></div></div><main>
      <div class="v243-detail-hero"><div class="eyebrow">${r.label}</div><h1 style="margin:6px 0">${r.text}</h1><p class="sub">Progression cá nhân từ reps · RIR · form.</p></div>
      <div class="v243-section"><h3>Form Intelligence</h3><span class="v243-tag">Biomechanics</span></div><div class="v243-features">
        <div class="v243-feature"><div>◉</div><b>Exercise Guide</b><small>Kỹ thuật + YouTube</small></div><div class="v243-feature"><div>↔</div><b>ROM chuẩn</b><small>Range of Motion</small></div><div class="v243-feature"><div>◈</div><b>Muscle Heatmap</b><small>${e.muscle}</small></div><div class="v243-feature"><div>!</div><b>Common Mistakes</b><small>Joint alignment · ROM · control</small></div><div class="v243-feature"><div>≈</div><b>Hít thở</b><small>Breathing theo pha</small></div><div class="v243-feature"><div>⏱</div><b>Tempo</b><small>${e.tempo||'2–1–2'}</small></div></div>
      <div class="v243-section"><h3>Performance</h3><span class="v243-tag">${s.H.length} logs</span></div><div class="v243-statgrid"><div class="v243-stat"><strong>${s.p.maxReps||0}</strong><small>PR REPS</small></div><div class="v243-stat"><strong>${s.p.maxHold||0}s</strong><small>PR HOLD</small></div><div class="v243-stat"><strong>${s.avgForm||'—'}${s.avgForm?'%':''}</strong><small>FORM</small></div><div class="v243-stat"><strong>${s.avgRir}</strong><small>RIR</small></div></div>
      <div class="card"><b>Volume / reps history</b><div class="v243-chart">${s.H.length?s.H.slice(-20).map(x=>`<i style="height:${Math.max(6,(x.reps||x.holdSec||0)/mx*100)}%"></i>`).join(''):'<span class="sub">Chưa có dữ liệu thật.</span>'}</div></div>
      <div class="v243-section"><h3>Progression Chain</h3></div><div class="card"><div class="v243-skill">${c.chain.map(x=>{const ex=exBy(x),p=prs(x),v=Math.max(p.maxReps||0,p.maxHold||0);return `<div class="v243-node ${v?'done':x===id?'now':'lock'}">${v?'✓':x===id?'●':'🔒'}<br>${ex?.name||x}</div>`}).join('')}</div></div>
    </main>`;
  }

  function appRender(){
    try{
      if(state.exerciseDetail){document.querySelector('#app').innerHTML=detailPage(state.exerciseDetail);return}
      if(state.currentWorkout){renderWorkout();return}
      if(!state.onboarded){onboarding();return}
      const pages={home:window.home||home,plan:window.plan||plan,train:trainPage,progress:progressPage,profile:profilePage};
      const fn=pages[state.tab]||pages.home;
      document.querySelector('#app').innerHTML=fn();
    }catch(err){
      console.error('ForgePath V3.0 render',err);
      document.querySelector('#app').innerHTML=`<main><div class="card"><h2>⚠ UI runtime error</h2><p class="sub">${String(err.message||err)}</p><button class="btn primary" onclick="state.tab='home';state.exerciseDetail=null;save();location.reload()">Khôi phục Home</button></div></main>`;
    }
  }

  window.nav=function(tab){state.tab=tab;state.exerciseDetail=null;save();appRender();window.scrollTo(0,0)};
  window.v24OpenExercise=function(id){state.exerciseDetail=id;save();appRender()};
  window.bottomNav=navHTML;
  window.v23Train=trainPage;
  window.v23Progress=progressPage;
  window.profile=profilePage;
  window.v24ExercisePage=detailPage;
  window.render=appRender;
  try{render=appRender;v23Train=trainPage;v23Progress=progressPage;profile=profilePage;v24ExercisePage=detailPage}catch(_){}
  appRender();
})();

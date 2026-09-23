
(()=>{
  /* Normalize household equipment introduced in V3.1 so exercises do not become
     impossible to discover just because "wall/towel/bench" were not onboarding options. */
  try{
    EXERCISES.forEach(ex=>{
      if(!Array.isArray(ex.eq)) ex.eq=[];
      ex.eq=ex.eq.map(x=>x==='bench'?'chair':x).filter(x=>x!=='wall'&&x!=='towel');
    });
  }catch(_){}

  // Keep the Settings destination inside Progress only.
  state.v31=Object.assign({progressView:'overview'},state.v31||{});

  const previousRender = window.render;
  const previousNav = window.nav;

  function v311BottomNav(active){
    const items=[
      ['home','⌂','Home'],
      ['plan','▦','Coach'],
      ['train','＋','Train'],
      ['progress','↗','Progress']
    ];
    return `<nav class="bottomnav">${items.map(([key,icon,label])=>`
      <button class="navbtn ${active===key?'active':''}" onclick="nav('${key}')">
        <i>${icon}</i><span>${label}</span>
      </button>`).join('')}</nav>`;
  }

  // Rebuild Train instead of wrapping the legacy V3.0 page.
  function trainStable(){
    const lv=state.v23?.libraryLevel||'all';
    const pat=state.v23?.libraryPattern||'all';
    const q=(state.v30Search||'').trim().toLowerCase();
    const ranges={beginner:[0,2.2],intermediate:[1.7,3.3],advanced:[2.8,4.3],elite:[3.8,9]};
    let list=EXERCISES.filter(e=>available(e));
    const compatibleCount=list.length;
    if(lv!=='all'){
      const r=ranges[lv]||[0,9];
      list=list.filter(e=>e.diff>=r[0]&&e.diff<=r[1]);
    }
    if(pat!=='all') list=list.filter(e=>e.pattern===pat);
    if(q) list=list.filter(e=>(`${e.name} ${e.muscle} ${e.pattern}`).toLowerCase().includes(q));
    list.sort((a,b)=>a.diff-b.diff);

    const card=e=>{
      const arr=state.v24?.exerciseHistory?.[e.id]||[];
      const pr=state.v24?.prs?.[e.id]||{};
      const avg=arr.length?Math.round(arr.reduce((a,x)=>a+(x.form||0),0)/arr.length):0;
      const target=state.profile.levels?.[e.pattern]||2;
      const delta=e.diff-target;
      const fit=arr.length?'Tracked':delta>.9?'Khó hơn':delta>.3?'Thử thách':'Phù hợp';
      const cls=arr.length?'good':delta>.9?'bad':delta>.3?'warn':'good';
      return `<div class="v30-excard" onclick="v24OpenExercise('${e.id}')">
        <div class="v30-exhead">
          <div class="v30-icon">${e.icon||'•'}</div>
          <div class="v30-exmeta"><b>${e.name}</b><small>${e.muscle} · ${typeof v23LevelName==='function'?v23LevelName(e.diff):'Level '+e.diff}</small></div>
          <span class="v30-fit ${cls}">${fit}</span>
        </div>
        <div class="v30-meter"><i style="width:${arr.length?Math.min(100,Math.max(10,(pr.maxReps||pr.maxHold||0)*5)):8}%"></i></div>
        <div class="v30-minirow">
          <div class="v30-mini"><b>${pr.maxReps||0}</b><span>PR</span></div>
          <div class="v30-mini"><b>${avg||'—'}${avg?'%':''}</b><span>FORM</span></div>
          <div class="v30-mini"><b>${arr.length}</b><span>LOGS</span></div>
        </div>
      </div>`;
    };

    return `<div class="topbar">
      <div><div class="brand">TRAIN <span>V3.6</span></div><div class="kicker">Expanded Exercise Library</div></div>
      <span class="pill accent">${compatibleCount}/${EXERCISES.length} phù hợp</span>
    </div>
    <main class="v30-shell">
      <div class="hero">
        <div class="eyebrow">SMART LIBRARY</div>
        <h1>${EXERCISES.length} động tác.</h1>
        <p>Hiển thị rõ bài phù hợp với dụng cụ, trình độ và lịch sử tập luyện của bạn.</p>
      </div>
      <input class="v30-search" placeholder="Tìm bài tập hoặc nhóm cơ..." value="${state.v30Search||''}"
        oninput="state.v30Search=this.value;save();render()">
      <div class="v30-chips">
        ${[['all','Tất cả'],['beginner','Cơ bản'],['intermediate','Trung cấp'],['advanced','Nâng cao'],['elite','Elite']]
          .map(([k,l])=>`<button class="${lv===k?'on':''}" onclick="v23SetFilter('libraryLevel','${k}')">${l}</button>`).join('')}
      </div>
      <div class="v30-chips">
        ${[['all','Tất cả'],['push','Push'],['pull','Pull'],['legs','Legs'],['core','Core']]
          .map(([k,l])=>`<button class="${pat===k?'on':''}" onclick="v23SetFilter('libraryPattern','${k}')">${l}</button>`).join('')}
      </div>
      <div class="v30-cardgrid">${list.map(card).join('')||'<div class="empty">Không có bài phù hợp với bộ lọc hiện tại.</div>'}</div>
    </main>${v311BottomNav('train')}`;
  }

  // Coach gets the same 4-item navigation and no separate Settings/Profile destination.
  function coachStable(){
    const p=state.profile||{};
    return `<div class="topbar">
      <div><div class="brand">COACH <span>V3.4</span></div><div class="kicker">${state.v30?.trainingProfile||'balanced'} · Tuần ${state.week}</div></div>
      <span class="pill accent">${p.days||4} buổi</span>
    </div>
    <main class="v30-shell">
      <div class="hero"><div class="eyebrow">ADAPTIVE PLAN</div><h1>Giáo án tuần của bạn.</h1>
        <p>Giữ nguyên hướng UI V3.1 nhưng gom thông tin cần thiết, tránh card bị tràn và navigation không đồng nhất.</p></div>
      <div class="v30-planlist">
        ${state.plan.map((w,i)=>`<div class="v30-plan">
          <div class="v30-planhead">
            <div style="display:flex;gap:10px;min-width:0">
              <div class="v30-check">${w.completed?'✓':i+1}</div>
              <div style="min-width:0"><b>${w.title}</b><div class="sub">${w.focus} · ${w.exercises.length} bài</div></div>
            </div>
            <span class="v30-fit ${w.completed?'good':''}">${w.completed?'Done':'Ready'}</span>
          </div>
          <div class="v30-exlist">${w.exercises.slice(0,6).map(e=>`<span class="v30-expill">${e.name}</span>`).join('')}</div>
          <button class="btn ${w.completed?'ghost':'primary'} full" style="margin-top:12px" onclick="startWorkout('${w.id}')">
            ${w.completed?'Xem lại':'Bắt đầu'}
          </button>
        </div>`).join('')}
      </div>
    </main>${v311BottomNav('plan')}`;
  }

  // Remove duplicated Settings tab. The gear in the Progress header is the single Settings entry.
  function cleanProgressHTML(html){
    if(typeof html!=='string') return html;
    html=html.replace(
      /<button class="[^"]*" onclick="state\.v31\.progressView='settings';save\(\);render\(\)">Settings<\/button>/g,
      ''
    );
    html=html.replace(/My Progress <span>V3\.1<\/span>/g,'My Progress <span>V3.6</span>');
    return html;
  }

  const progressOriginal = window.v23Progress;
  function progressStable(){
    const before=state.v31.progressView;
    const html=typeof progressOriginal==='function'?progressOriginal():'';
    state.v31.progressView=before;
    return cleanProgressHTML(html);
  }

  function stableRender(){
    try{
      if(state.exerciseDetail){
        const fn=window.v24ExercisePage;
        document.querySelector('#app').innerHTML=typeof fn==='function'?fn(state.exerciseDetail):'';
        return;
      }
      if(state.currentWorkout){
        renderWorkout(); return;
      }
      if(!state.onboarded){onboarding();return}
      let html='';
      if(state.tab==='home') html=typeof window.home==='function'?window.home():'';
      else if(state.tab==='plan') html=coachStable();
      else if(state.tab==='train') html=trainStable();
      else if(state.tab==='progress'||state.tab==='settings'||state.tab==='profile') {
        state.tab='progress';
        html=progressStable();
      } else {
        state.tab='home';
        html=typeof window.home==='function'?window.home():'';
      }
      document.querySelector('#app').innerHTML=html;
    }catch(err){
      console.error('ForgePath V3.4 UI',err);
      document.querySelector('#app').innerHTML=`<main><div class="card"><h2>⚠ UI error</h2>
        <p class="sub">${String(err.message||err)}</p>
        <button class="btn primary" onclick="state.tab='home';state.exerciseDetail=null;save();location.reload()">Khôi phục Home</button></div></main>`;
    }
  }

  window.bottomNav=v311BottomNav;
  window.v23Train=trainStable;
  window.nav=function(tab){
    if(tab==='settings'||tab==='profile'){state.tab='progress';state.v31.progressView='settings'}
    else state.tab=tab;
    state.exerciseDetail=null;save();stableRender();window.scrollTo(0,0);
  };
  window.render=stableRender;
  try{bottomNav=v311BottomNav;v23Train=trainStable;render=stableRender}catch(_){}
  stableRender();
})();

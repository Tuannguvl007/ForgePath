
(()=>{
  state.v30 = Object.assign({theme:'neon',lang:'vi',trainingProfile:'balanced',compactMode:false,animations:true}, state.v30||{});
  state.v30ProgressTab = state.v30ProgressTab || 'overview';
  state.v30Search = state.v30Search || '';

  const TT = {
    vi:{
      home:'Home',coach:'Coach',train:'Train',progress:'Progress',settings:'Settings',
      dashboard:'Dashboard',todayWorkout:'Buổi tập hôm nay',quickActions:'Truy cập nhanh',weeklyPlan:'Lịch tuần',
      recommended:'Đề xuất cho bạn',exerciseLibrary:'Thư viện bài tập',searchExercise:'Tìm bài tập hoặc nhóm cơ...',
      overview:'Tổng quan',calendar:'Lịch',exercises:'Bài tập',skills:'Kỹ năng',records:'Kỷ lục',
      appearance:'Giao diện',trainingProfile:'Profile tập luyện',language:'Ngôn ngữ',dataPrefs:'Tùy chọn dữ liệu',
      theme:'Theme',profile2:'User Profile 2.0',ui2:'UI 3.0',adaptive:'Adaptive Engine',cloud:'Cloud Sync sau',
      start:'Bắt đầu',view:'Xem',edit:'Chỉnh sửa',completed:'Hoàn thành',minutes:'phút',days:'ngày',sets:'sets',
      readiness:'Readiness',workouts:'Workouts',records2:'Records',chooseTheme:'Chọn theme',chooseLanguage:'Chọn ngôn ngữ',
      chooseProfile:'Chọn profile tập luyện',balanced:'Cân bằng',strength:'Sức mạnh',hypertrophy:'Tăng cơ',endurance:'Sức bền',skills2:'Kỹ năng',
      compact:'Giao diện gọn',animation:'Hiệu ứng động',localStorage:'Lưu offline bằng IndexedDB',resetOnboard:'Mở lại onboarding',
      realData:'Dữ liệu thật',volumeHistory:'Lịch sử volume',calendar12:'Heatmap 12 tuần',exerciseProgress:'Tiến trình theo từng bài',
      formIntelligence:'Form Intelligence',performance:'Hiệu suất',progressChain:'Chuỗi tăng tiến',currentTheme:'Theme hiện tại',
      nextAction:'Hành động tiếp theo',planToday:'Kế hoạch hôm nay',syncReady:'Sẵn sàng cho API/Cloud sau này',explore:'Khám phá',
      localized:'Một phần UI đã đổi ngôn ngữ',settingSaved:'Đã lưu cài đặt'
    },
    en:{
      home:'Home',coach:'Coach',train:'Train',progress:'Progress',settings:'Settings',
      dashboard:'Dashboard',todayWorkout:'Today workout',quickActions:'Quick access',weeklyPlan:'Weekly plan',
      recommended:'Recommended',exerciseLibrary:'Exercise library',searchExercise:'Search exercise or muscle group...',
      overview:'Overview',calendar:'Calendar',exercises:'Exercises',skills:'Skills',records:'Records',
      appearance:'Appearance',trainingProfile:'Training profile',language:'Language',dataPrefs:'Data preferences',
      theme:'Theme',profile2:'User Profile 2.0',ui2:'UI 3.0',adaptive:'Adaptive Engine',cloud:'Cloud Sync later',
      start:'Start',view:'View',edit:'Edit',completed:'Done',minutes:'min',days:'days',sets:'sets',
      readiness:'Readiness',workouts:'Workouts',records2:'Records',chooseTheme:'Choose theme',chooseLanguage:'Choose language',
      chooseProfile:'Choose training profile',balanced:'Balanced',strength:'Strength',hypertrophy:'Hypertrophy',endurance:'Endurance',skills2:'Skills',
      compact:'Compact UI',animation:'Motion effects',localStorage:'Offline storage via IndexedDB',resetOnboard:'Restart onboarding',
      realData:'Real data',volumeHistory:'Volume history',calendar12:'12-week heatmap',exerciseProgress:'Per-exercise progression',
      formIntelligence:'Form Intelligence',performance:'Performance',progressChain:'Progression chain',currentTheme:'Current theme',
      nextAction:'Next action',planToday:'Plan for today',syncReady:'Ready for future API/Cloud',explore:'Explore',
      localized:'Part of the UI has been localized',settingSaved:'Settings saved'
    }
  };
  const t=(k)=> (TT[state.v30.lang]&&TT[state.v30.lang][k]) || (TT.vi[k]||k);

  function saveAndRender(msg){
    save(); applyTheme();
    if(msg && typeof toast==='function') toast(msg);
    render();
  }
  function applyTheme(){
    document.documentElement.setAttribute('data-theme', state.v30.theme || 'neon');
    document.documentElement.style.setProperty('--radius', state.v30.compactMode ? '18px':'22px');
  }
  applyTheme();

  const allLogs=()=>Object.entries(state.v24?.exerciseHistory||{}).flatMap(([exerciseId,a])=>(a||[]).map(x=>({exerciseId,...x}))).sort((a,b)=>(a.date||0)-(b.date||0));
  const hist=id=>state.v24?.exerciseHistory?.[id]||[];
  const prs=id=>state.v24?.prs?.[id]||{maxReps:0,maxHold:0};
  const exBy=id=>EXERCISES.find(e=>e.id===id);
  const levelName=d=> typeof v23LevelName==='function' ? v23LevelName(d) : (d<2?'Cơ bản':d<3.2?'Trung cấp':d<4.2?'Nâng cao':'Elite');
  const userReady=()=> typeof v23Readiness==='function' ? v23Readiness() : 72;
  const progression=id=> typeof v24ProgressionFor==='function' ? v24ProgressionFor(id) : {previous:null,next:null,chain:[id]};
  const profileTypeLabel = ()=> t(state.v30.trainingProfile==='balanced'?'balanced':state.v30.trainingProfile==='strength'?'strength':state.v30.trainingProfile==='hypertrophy'?'hypertrophy':state.v30.trainingProfile==='endurance'?'endurance':'skills2');

  function navHTML(active){
    const items=[['home','⌂',t('home')],['plan','▦',t('coach')],['train','＋',t('train')],['progress','↗',t('progress')],['settings','⚙',t('settings')]];
    return `<nav class="bottomnav">${items.map(([key,icon,label])=>`<button class="navbtn ${active===key?'active':''}" onclick="nav('${key}')"><i>${icon}</i><span>${label}</span></button>`).join('')}</nav>`;
  }

  function cardUser(){
    const p=state.profile||{}, body=state.v23?.body||{}, weight=body.weight||51, height=body.height||170, bmi=(weight/((height/100)**2)).toFixed(1), xp=state.xp||0, level=Math.max(1,Math.floor(xp/500)+1), levelP=((xp%500)/5);
    return `<div class="v30-panel v30-user">
      <div class="v30-userhead">
        <div class="v30-avatar">${(p.name||'U')[0].toUpperCase()}</div>
        <div style="flex:1">
          <div class="v30-tag">${t('profile2')}</div>
          <h2 style="margin:8px 0 2px">${p.name||'Athlete'}</h2>
          <div class="sub">Calisthenics Foundation · Level ${level} · ${profileTypeLabel()}</div>
          <div class="v30-level"><i style="width:${levelP}%"></i></div>
        </div>
        <div class="v30-tag">🔥 ${state.streak||0} ${t('days')}</div>
      </div>
      <div class="v30-kpi">
        <div class="item"><b>${weight}</b><span>KG</span></div>
        <div class="item"><b>${height}</b><span>CM</span></div>
        <div class="item"><b>${bmi}</b><span>BMI</span></div>
        <div class="item"><b>${userReady()}</b><span>${t('readiness')}</span></div>
      </div>
      <div class="v30-list">
        <div class="row"><span>◎ ${goalLabel(p.goal)}</span><small>${goalLabel(p.secondary||'calisthenics')}</small></div>
        <div class="row"><span>⌁ ${eqLabel((p.equipment||[])[0]||'chair')}</span><small>${(p.equipment||[]).map(eqLabel).join(' · ')||'Bodyweight'}</small></div>
        <div class="row"><span>▣ ${t('planToday')}</span><small>${p.days||4} ${t('days')} / ${p.minutes||45} ${t('minutes')}</small></div>
      </div>
    </div>`;
  }

  function recommendation(ex){
    const H=hist(ex.id),x=H[H.length-1],pr=progression(ex.id);
    if(!x)return {label:'BASELINE',text:state.v30.lang==='en'?'Start logging this movement':'Bắt đầu log bài này',cls:''};
    if((x.form||0)<75)return {label:'DELOAD',text:state.v30.lang==='en'?'Reduce reps, prioritize form':'Giảm reps, ưu tiên form',cls:'bad'};
    if((x.rir??0)===0)return {label:'HOLD',text:state.v30.lang==='en'?'Stay at current load':'Giữ mức hiện tại',cls:'warn'};
    const good=H.slice(-3).filter(z=>(z.form||0)>=88&&(z.rir??0)>=1).length;
    if(good>=2 && pr.next)return {label:'PROGRESS',text:state.v30.lang==='en'?'Ready for harder variation':'Sẵn sàng lên biến thể khó hơn',cls:'good'};
    if((x.rir??0)>=2)return {label:'OVERLOAD',text:state.v30.lang==='en'?'+1–2 reps next workout':'+1–2 reps buổi tới',cls:'good'};
    return {label:'HOLD',text:state.v30.lang==='en'?'Repeat and refine technique':'Lặp lại và tối ưu kỹ thuật',cls:''};
  }

  function homePage(){
    const idx=typeof todayPlanIndex==='function'?todayPlanIndex():0;
    const next=state.plan[idx];
    const logs=allLogs();
    const streak=state.streak||0;
    const done=state.plan.filter(x=>x.completed).length;
    const weekly=Math.round(done/Math.max(1,state.plan.length)*100);
    return `<div class="topbar"><div><div class="brand">FORGEPATH <span>V3.11</span></div><div class="kicker">${t('dashboard')} · ${t('ui2')} · ${profileTypeLabel()}</div></div><span class="pill accent">${t('currentTheme')}: ${state.v30.theme}</span></div>
    <main class="v30-shell">
      <div class="v30-grid">
        <div class="v30-col-8">${cardUser()}</div>
        <div class="v30-col-4 v30-panel">
          <div class="row between"><div><h3>${t('todayWorkout')}</h3><div class="sub">${t('adaptive')} · ${t('realData')}</div></div><div class="v30-ring" style="--p:${userReady()}"><strong>${userReady()}</strong></div></div>
          <div style="margin-top:14px">
            ${next?`<div class="v30-statline"><div><b>${next.title}</b><div class="sub">${next.focus} · ${next.exercises.length} bài</div></div><span class="v30-tag">${state.profile.minutes} ${t('minutes')}</span></div>
            <div class="v30-statline"><span>${t('nextAction')}</span><small>${(next.exercises[0]&&recommendation(next.exercises[0]).text)||'—'}</small></div>
            <button class="btn primary full" onclick="startWorkout('${next.id}')">${t('start')}</button>`:
            `<div class="empty">${t('syncReady')}</div>`}
          </div>
        </div>
        <div class="v30-col-4 v30-panel">
          <div class="row between"><h3>${t('quickActions')}</h3><span class="v30-tag">${t('explore')}</span></div>
          <div class="v30-quick" style="margin-top:12px">
            <div class="v30-action" onclick="nav('train')"><b>${t('exerciseLibrary')}</b><small>${EXERCISES.length} bài</small></div>
            <div class="v30-action" onclick="nav('progress')"><b>${t('progress')}</b><small>${allLogs().length} ${t('sets')}</small></div>
            <div class="v30-action" onclick="nav('plan')"><b>${t('coach')}</b><small>${profileTypeLabel()}</small></div>
            <div class="v30-action" onclick="nav('settings')"><b>${t('settings')}</b><small>${t('theme')} · ${t('language')}</small></div>
          </div>
        </div>
        <div class="v30-col-4 v30-panel">
          <h3>${t('recommended')}</h3>
          <div style="margin-top:10px" class="v30-stack">
            ${EXERCISES.filter(e=>available(e)).sort((a,b)=>a.diff-b.diff).slice(0,4).map(e=>{const r=recommendation(e);return `<div class="v30-statline"><div><b>${e.name}</b><div class="sub">${e.muscle}</div></div><span class="v30-fit ${r.cls}">${r.label}</span></div>`}).join('')}
          </div>
        </div>
        <div class="v30-col-12 v30-panel">
          <div class="row between"><h3>${t('weeklyPlan')}</h3><span class="v30-tag">${weekly}%</span></div>
          <div class="v30-planlist" style="margin-top:12px">
            ${state.plan.slice(0,5).map(w=>`<div class="v30-plan"><div class="v30-planhead"><div style="display:flex;gap:10px"><div class="v30-check">${w.completed?'✓':'•'}</div><div><b>${w.title}</b><div class="sub">${w.focus} · ${w.exercises.length} bài</div></div></div><span class="v30-fit ${w.completed?'good':''}">${w.completed?t('completed'):'Pending'}</span></div><div class="v30-exlist">${w.exercises.slice(0,5).map(e=>`<span class="v30-expill">${e.name}</span>`).join('')}</div></div>`).join('')}
          </div>
        </div>
      </div>
    </main>${navHTML('home')}`;
  }

  function coachPage(){
    return `<div class="topbar"><div><div class="brand">COACH <span>V3.0</span></div><div class="kicker">${t('trainingProfile')} · ${profileTypeLabel()}</div></div><span class="pill accent">${t('adaptive')}</span></div>
    <main class="v30-shell">
      <div class="hero"><div class="eyebrow">${t('trainingProfile')}</div><h1>${profileTypeLabel()}</h1><p>${state.v30.trainingProfile==='strength'?'Ưu tiên reps thấp hơn, recovery dài hơn.':state.v30.trainingProfile==='hypertrophy'?'Ưu tiên volume và tension để tăng cơ.':state.v30.trainingProfile==='endurance'?'Ưu tiên volume cao và nghỉ ngắn hơn.':'Ưu tiên kỹ năng, kiểm soát và progression chain.'}</p></div>
      <div class="v30-grid">
        <div class="v30-col-8 v30-panel">
          <div class="row between"><h3>${t('weeklyPlan')}</h3><button class="btn ghost" onclick="state.onboarded=false;save();render()">${t('edit')}</button></div>
          <div class="v30-planlist" style="margin-top:12px">
            ${state.plan.map(w=>`<div class="v30-plan"><div class="v30-planhead"><div><b>${w.title}</b><div class="sub">${w.focus} · ${w.exercises.length} bài</div></div><span class="v30-fit ${w.completed?'good':''}">${w.completed?'✓':''} ${w.completed?t('completed'):'Ready'}</span></div>
            <div class="v30-exlist">${w.exercises.map(e=>`<span class="v30-expill">${e.name}</span>`).join('')}</div>
            <div class="row between" style="margin-top:12px"><small>${w.completed?'Hoàn thành lúc '+new Date(w.completedAt||Date.now()).toLocaleDateString():t('planToday')}</small><button class="btn primary" onclick="startWorkout('${w.id}')">${w.completed?t('view'):t('start')}</button></div></div>`).join('')}
          </div>
        </div>
        <div class="v30-col-4 v30-panel">
          <h3>Coach Notes</h3>
          <div class="v30-list">
            <div class="row"><span>${t('readiness')}</span><small>${userReady()}/100</small></div>
            <div class="row"><span>${t('records2')}</span><small>${Object.keys(state.v24?.prs||{}).length}</small></div>
            <div class="row"><span>${t('workouts')}</span><small>${state.history.length}</small></div>
            <div class="row"><span>${t('cloud')}</span><small>${t('syncReady')}</small></div>
          </div>
        </div>
      </div>
    </main>${navHTML('plan')}`;
  }

  function trainPage(){
    const lv=state.v23?.libraryLevel||'all', pat=state.v23?.libraryPattern||'all', q=(state.v30Search||'').trim().toLowerCase();
    let list=EXERCISES.filter(e=>available(e));
    const ranges={beginner:[0,2.2],intermediate:[1.7,3.3],advanced:[2.8,4.3],elite:[3.8,9]};
    if(lv!=='all'){const r=ranges[lv];list=list.filter(e=>e.diff>=r[0]&&e.diff<=r[1]);}
    if(pat!=='all') list=list.filter(e=>e.pattern===pat);
    if(q) list=list.filter(e=>(e.name+' '+e.muscle+' '+e.pattern).toLowerCase().includes(q));
    list.sort((a,b)=>a.diff-b.diff);

    return `<div class="topbar"><div><div class="brand">TRAIN <span>V3.0</span></div><div class="kicker">${t('exerciseLibrary')} · ${list.length}</div></div><span class="pill accent">${t('realData')}</span></div>
    <main class="v30-shell">
      <div class="hero"><div class="eyebrow">${t('exerciseLibrary')}</div><h1>Smart Library</h1><p>UI mới trực quan hơn, tìm bài nhanh hơn và hiển thị progression theo từng bài.</p></div>
      <input class="v30-search" placeholder="${t('searchExercise')}" value="${state.v30Search||''}" oninput="state.v30Search=this.value;save();render()">
      <div class="v30-chips">${[['all','Tất cả'],['beginner','Cơ bản'],['intermediate','Trung cấp'],['advanced','Nâng cao'],['elite','Elite']].map(x=>`<button class="${lv===x[0]?'on':''}" onclick="v23SetFilter('libraryLevel','${x[0]}')">${x[1]}</button>`).join('')}</div>
      <div class="v30-chips">${[['all','Tất cả'],['push','Push'],['pull','Pull'],['legs','Legs'],['core','Core']].map(x=>`<button class="${pat===x[0]?'on':''}" onclick="v23SetFilter('libraryPattern','${x[0]}')">${x[1]}</button>`).join('')}</div>
      <div class="v30-cardgrid">${list.map(e=>{
        const H=hist(e.id), p=prs(e.id), r=recommendation(e), avgForm=H.length?Math.round(H.reduce((a,x)=>a+(x.form||0),0)/H.length):0;
        const base=(state.profile.levels&&state.profile.levels[e.pattern])||2, diff=e.diff-base;
        const fitCls=diff>1?'bad':diff>0.35?'warn':'good';
        const fitText=H.length?r.label:(diff>1?'Khó hơn':diff>0.35?'Thử thách':'Phù hợp');
        const meter=H.length?Math.min(100, Math.max((p.maxReps||p.maxHold||0)*5, 8)):8;
        return `<div class="v30-excard" onclick="v24OpenExercise('${e.id}')"><div class="v30-exhead"><div class="v30-icon">${e.icon||'•'}</div><div class="v30-exmeta"><b>${e.name}</b><small>${e.muscle} · ${levelName(e.diff)}</small></div><span class="v30-fit ${fitCls}">${fitText}</span></div>
        <div class="v30-meter"><i style="width:${meter}%"></i></div>
        <div class="v30-minirow"><div class="v30-mini"><b>${p.maxReps||0}</b><span>PR</span></div><div class="v30-mini"><b>${avgForm||'—'}${avgForm?'%':''}</b><span>FORM</span></div><div class="v30-mini"><b>${H.length}</b><span>LOGS</span></div></div></div>`;
      }).join('')}</div>
    </main>${navHTML('train')}`;
  }

  function progressPage(){
    const tab=state.v30ProgressTab||'overview', logs=allLogs(), prList=Object.entries(state.v24?.prs||{}).filter(([,p])=>p.maxReps||p.maxHold);
    let body='';
    if(tab==='overview'){
      const recent=state.history.slice(-16), max=Math.max(1,...recent.map(x=>x.exercises||1));
      body=`<div class="v30-grid">
        <div class="v30-col-3 v30-panel"><div class="v30-tag">${t('workouts')}</div><h2>${state.history.length}</h2><div class="sub">${t('realData')}</div></div>
        <div class="v30-col-3 v30-panel"><div class="v30-tag">${t('sets')}</div><h2>${logs.length}</h2><div class="sub">${t('exerciseProgress')}</div></div>
        <div class="v30-col-3 v30-panel"><div class="v30-tag">${t('records2')}</div><h2>${prList.length}</h2><div class="sub">Personal records</div></div>
        <div class="v30-col-3 v30-panel"><div class="v30-tag">${t('readiness')}</div><h2>${userReady()}</h2><div class="sub">${profileTypeLabel()}</div></div>
        <div class="v30-col-8 v30-panel"><div class="row between"><h3>${t('volumeHistory')}</h3><span class="v30-tag">${t('realData')}</span></div><div class="v30-chart">${recent.length?recent.map(x=>`<i style="height:${Math.max(8,(x.exercises||1)/max*100)}%" title="${x.title}"></i>`).join(''):'<span class="sub">No data</span>'}</div></div>
        <div class="v30-col-4 v30-panel"><h3>${t('records')}</h3><div class="v30-stack" style="margin-top:12px">${prList.slice(-5).reverse().map(([id,p])=>`<div class="v30-statline"><div><b>${exBy(id)?.name||id}</b><div class="sub">${p.maxReps?p.maxReps+' reps':''}${p.maxHold?' · '+p.maxHold+'s':''}</div></div><span>🏆</span></div>`).join('')||'<div class="empty">No PR yet</div>'}</div></div>
      </div>`;
    } else if(tab==='calendar'){
      const map={}; state.history.forEach(x=>{const d=new Date(x.date),k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); map[k]=(map[k]||0)+(x.durationMin||45);});
      let cells=''; for(let i=83;i>=0;i--){const d=new Date(); d.setDate(d.getDate()-i); const k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(), v=map[k]||0, c=v>=60?'d':v>=40?'c':v>=20?'b':v?'a':''; cells+=`<div class="v30-day ${c}" title="${d.toLocaleDateString()} · ${v} min">${d.getDate()}</div>`;}
      body=`<div class="v30-panel"><div class="row between"><h3>${t('calendar12')}</h3><span class="v30-tag">84 days</span></div><div class="v30-calendar" style="margin-top:14px">${cells}</div></div>`;
    } else if(tab==='exercises'){
      const used=EXERCISES.filter(e=>hist(e.id).length);
      body=`<div class="v30-cardgrid">${used.map(e=>{const H=hist(e.id),p=prs(e.id),r=recommendation(e),avg=H.length?Math.round(H.reduce((a,x)=>a+(x.form||0),0)/H.length):0; return `<div class="v30-excard" onclick="v24OpenExercise('${e.id}')"><div class="v30-exhead"><div class="v30-icon">${e.icon||'•'}</div><div class="v30-exmeta"><b>${e.name}</b><small>${H.length} logs · ${e.muscle}</small></div><span class="v30-fit ${r.cls}">${r.label}</span></div><div class="v30-minirow" style="margin-top:12px"><div class="v30-mini"><b>${p.maxReps||0}</b><span>PR</span></div><div class="v30-mini"><b>${avg||'—'}${avg?'%':''}</b><span>FORM</span></div><div class="v30-mini"><b>${recommendation(e).label}</b><span>ACTION</span></div></div></div>`}).join('') || '<div class="empty">No exercise data</div>'}</div>`;
    } else if(tab==='skills'){
      const defs=typeof v24Skills==='function'?v24Skills():[];
      body=defs.map(s=>`<div class="v30-panel" style="margin-bottom:14px"><div class="row between"><h3>${s.name}</h3><span class="v30-tag">${t('skills')}</span></div><div class="v30-skill" style="margin-top:12px">${s.nodes.map(([id,req])=>{const ex=exBy(id),p=prs(id),v=Math.max(p.maxReps||0,p.maxHold||0),done=v>=req,started=v>0;return `<div class="v30-node ${done?'done':started?'now':''}"><b>${done?'✓':started?Math.min(99,Math.round(v/req*100))+'%':'🔒'}</b><div>${ex?.name||id}</div><small>${v}/${req}</small></div>`}).join('')}</div></div>`).join('') || '<div class="empty">No skill tree</div>';
    } else {
      body=`<div class="v30-panel"><div class="v30-stack">${prList.map(([id,p])=>`<div class="v30-statline"><div><b>${exBy(id)?.name||id}</b><div class="sub">${p.maxReps?'Max reps '+p.maxReps:''}${p.maxHold?' · Hold '+p.maxHold+'s':''}</div></div><span>🏆</span></div>`).join('') || '<div class="empty">No record</div>'}</div></div>`;
    }
    return `<div class="topbar"><div><div class="brand">PROGRESS <span>V3.0</span></div><div class="kicker">${t('volumeHistory')} · ${t('exerciseProgress')}</div></div><span class="pill accent">${userReady()}/100</span></div>
    <main class="v30-shell">
      <div class="v30-tabs">${[['overview',t('overview')],['calendar',t('calendar')],['exercises',t('exercises')],['skills',t('skills')],['records',t('records')]].map(x=>`<button class="${tab===x[0]?'on':''}" onclick="state.v30ProgressTab='${x[0]}';save();render()">${x[1]}</button>`).join('')}</div>
      ${body}
      <div class="v30-panel"><div class="row between"><h3>${t('adaptive')}</h3><span class="v30-tag">${t('realData')}</span></div><div class="v30-chart" style="height:auto;display:block;border-bottom:0;padding-top:8px"><div class="v30-stack"><div class="v30-statline"><span>Reps</span><small>Volume</small></div><div class="v30-statline"><span>RIR</span><small>Recovery</small></div><div class="v30-statline"><span>Form Score</span><small>Technique</small></div><div class="v30-statline"><b>↓ Next Workout Generator</b><small>Reps · Tempo · Rest · Exercise</small></div></div></div></div>
    </main>${navHTML('progress')}`;
  }

  function settingsPage(){
    return `<div class="topbar"><div><div class="brand">SETTINGS <span>V3.0</span></div><div class="kicker">${t('appearance')} · ${t('trainingProfile')} · ${t('language')}</div></div><span class="pill accent">${t('ui2')}</span></div>
    <main class="v30-shell">
      <div class="v30-grid">
        <div class="v30-col-6 v30-settingcard">
          <div class="row between"><h3>${t('appearance')}</h3><span class="v30-tag">${t('theme')}</span></div>
          <div class="sub">${t('chooseTheme')}</div>
          <div class="v30-swatches">
            ${['neon','ocean','sunset','mono'].map(key=>`<div class="v30-swatch ${state.v30.theme===key?'on':''}" data-key="${key}" onclick="state.v30.theme='${key}';saveAndRender('${t('settingSaved')}')"></div>`).join('')}
          </div>
        </div>
        <div class="v30-col-6 v30-settingcard">
          <div class="row between"><h3>${t('trainingProfile')}</h3><span class="v30-tag">${profileTypeLabel()}</span></div>
          <div class="sub">${t('chooseProfile')}</div>
          <div class="v30-options">
            ${[['balanced',t('balanced')],['strength',t('strength')],['hypertrophy',t('hypertrophy')],['endurance',t('endurance')],['skills',t('skills2')]].map(([key,label])=>`<div class="v30-option ${state.v30.trainingProfile===key?'on':''}" onclick="state.v30.trainingProfile='${key}';saveAndRender('${t('settingSaved')}')">${label}</div>`).join('')}
          </div>
        </div>
        <div class="v30-col-6 v30-settingcard">
          <div class="row between"><h3>${t('language')}</h3><span class="v30-tag">${state.v30.lang.toUpperCase()}</span></div>
          <div class="sub">${t('chooseLanguage')}</div>
          <div class="v30-options">
            ${[['vi','Tiếng Việt'],['en','English']].map(([key,label])=>`<div class="v30-option ${state.v30.lang===key?'on':''}" onclick="state.v30.lang='${key}';saveAndRender('${t('settingSaved')}')">${label}</div>`).join('')}
          </div>
          <p class="sub" style="margin-top:10px">${t('localized')}</p>
        </div>
        <div class="v30-col-6 v30-settingcard">
          <div class="row between"><h3>${t('dataPrefs')}</h3><span class="v30-tag">IndexedDB</span></div>
          <div class="v30-toggle"><div><b>${t('compact')}</b><div class="sub">Dense cards & spacing</div></div><button class="btn ${state.v30.compactMode?'primary':'ghost'}" onclick="state.v30.compactMode=!state.v30.compactMode;saveAndRender('${t('settingSaved')}')">${state.v30.compactMode?'ON':'OFF'}</button></div>
          <div class="v30-toggle"><div><b>${t('animation')}</b><div class="sub">Motion / color effects</div></div><button class="btn ${state.v30.animations?'primary':'ghost'}" onclick="state.v30.animations=!state.v30.animations;saveAndRender('${t('settingSaved')}')">${state.v30.animations?'ON':'OFF'}</button></div>
          <div class="v30-toggle"><div><b>${t('localStorage')}</b><div class="sub">${t('syncReady')}</div></div><span class="v30-tag">LOCAL</span></div>
          <button class="btn full" style="margin-top:12px" onclick="state.onboarded=false;save();render()">${t('resetOnboard')}</button>
        </div>
      </div>
    </main>${navHTML('settings')}`;
  }

  function detailPage(id){
    const e=exBy(id); if(!e) return trainPage();
    const H=hist(id), p=prs(id), avgForm=H.length?Math.round(H.reduce((a,x)=>a+(x.form||0),0)/H.length):0, avgRir=H.length?(H.reduce((a,x)=>a+(x.rir||0),0)/H.length).toFixed(1):'—', mx=Math.max(1,...H.map(x=>x.reps||x.holdSec||1)), r=recommendation(e), c=progression(id);
    return `<div class="topbar"><button class="iconbtn" onclick="state.exerciseDetail=null;state.tab='train';save();render()">‹</button><div><div class="brand">${e.name}</div><div class="kicker">${t('formIntelligence')} · ${t('exerciseProgress')}</div></div></div>
    <main class="v30-shell">
      <div class="v30-detailhero"><div class="v30-tag">${r.label}</div><h1 style="margin:10px 0 4px">${r.text}</h1><div class="sub">${e.muscle} · ${levelName(e.diff)} · tempo ${e.tempo||'2-1-2'}</div></div>
      <div class="v30-featuregrid">
        <div class="v30-feature"><div>◉</div><b>Exercise Guide</b><small>Kỹ thuật + YouTube</small></div>
        <div class="v30-feature"><div>↔</div><b>ROM</b><small>Range of Motion</small></div>
        <div class="v30-feature"><div>◈</div><b>Muscle Heatmap</b><small>${e.muscle}</small></div>
        <div class="v30-feature"><div>!</div><b>Common Mistakes</b><small>Alignment · ROM · control</small></div>
        <div class="v30-feature"><div>≈</div><b>Breathing</b><small>Phase-based cue</small></div>
        <div class="v30-feature"><div>⏱</div><b>Tempo</b><small>${e.tempo||'2-1-2'}</small></div>
      </div>
      <div class="v30-grid">
        <div class="v30-col-3 v30-panel"><div class="v30-tag">PR Reps</div><h2>${p.maxReps||0}</h2></div>
        <div class="v30-col-3 v30-panel"><div class="v30-tag">PR Hold</div><h2>${p.maxHold||0}s</h2></div>
        <div class="v30-col-3 v30-panel"><div class="v30-tag">Form</div><h2>${avgForm||'—'}${avgForm?'%':''}</h2></div>
        <div class="v30-col-3 v30-panel"><div class="v30-tag">RIR</div><h2>${avgRir}</h2></div>
        <div class="v30-col-8 v30-panel"><div class="row between"><h3>${t('performance')}</h3><span class="v30-tag">${H.length} logs</span></div><div class="v30-chart">${H.length?H.slice(-20).map(x=>`<i style="height:${Math.max(8,(x.reps||x.holdSec||0)/mx*100)}%"></i>`).join(''):'<span class="sub">No data</span>'}</div></div>
        <div class="v30-col-4 v30-panel"><div class="row between"><h3>${t('progressChain')}</h3><span class="v30-tag">${t('skills')}</span></div><div class="v30-stack" style="margin-top:12px">${c.chain.map(x=>{const ex=exBy(x),pp=prs(x),done=(pp.maxReps||pp.maxHold||0)>0;return `<div class="v30-statline"><div><b>${ex?.name||x}</b><div class="sub">${done?'Tracked':'Locked'}</div></div><span>${done?'✓':x===id?'●':'🔒'}</span></div>`}).join('')}</div></div>
      </div>
    </main>`;
  }

  function appRender(){
    applyTheme();
    try{
      if(state.exerciseDetail){document.querySelector('#app').innerHTML=detailPage(state.exerciseDetail); return;}
      if(state.currentWorkout){renderWorkout(); return;}
      if(!state.onboarded){onboarding(); return;}
      const pages={home:homePage,plan:coachPage,train:trainPage,progress:progressPage,settings:settingsPage,profile:settingsPage};
      const fn=pages[state.tab]||homePage;
      document.querySelector('#app').innerHTML=fn();
    }catch(err){
      console.error('ForgePath V3 render',err);
      document.querySelector('#app').innerHTML=`<main><div class="card"><h2>⚠ V3 runtime error</h2><p class="sub">${String(err.message||err)}</p><button class="btn primary" onclick="state.tab='home';state.exerciseDetail=null;save();location.reload()">Recover</button></div></main>`;
    }
  }

  window.saveAndRender=saveAndRender;
  window.nav=function(tab){state.tab=tab;state.exerciseDetail=null;save();appRender();window.scrollTo(0,0);};
  window.bottomNav=navHTML;
  window.v23Train=trainPage;
  window.v23Progress=progressPage;
  window.profile=settingsPage;
  window.v24OpenExercise=function(id){state.exerciseDetail=id;save();appRender();};
  window.v24ExercisePage=detailPage;
  window.render=appRender;
  try{render=appRender; v23Train=trainPage; v23Progress=progressPage; profile=settingsPage; v24ExercisePage=detailPage;}catch(_){}
  appRender();
})();

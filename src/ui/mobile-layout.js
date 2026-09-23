
(()=>{
  const oldTrainPage = window.v23Train || window.trainPage || null;
  const oldCoachPage = window.plan || window.coachPage || null;
  const oldExercisePage = window.v24ExercisePage || window.detailPage || null;
  const oldRenderWorkout = window.renderWorkout || null;
  state.v31 = Object.assign({progressView:'overview'}, state.v31||{});

  // expand library
  const extras = [
    ['wide_pushup','Wide Push-up','push','Ngực ngoài • Tay sau',[],2.6,'↔️','reps',[8,15]],
    ['staggered_pushup','Staggered Push-up','push','Ngực • Core',[],2.8,'↕️','reps',[8,14]],
    ['tempo_pushup','Tempo Push-up','push','Ngực • Core',[],2.9,'⏱️','reps',[6,12]],
    ['spiderman_pushup','Spiderman Push-up','push','Ngực • Oblique',[],3.4,'🕷️','reps',[6,12]],
    ['pseudo_planche_pushup','Pseudo Planche Push-up','push','Vai trước • Ngực',[],4.5,'🪶','reps',[4,8]],
    ['band_pushup','Band-resisted Push-up','push','Ngực • Tay sau',['band'],3.0,'🟩','reps',[6,12]],
    ['close_grip_pushup','Close-grip Push-up','push','Tay sau • Ngực',[],2.9,'🤏','reps',[8,12]],
    ['bench_dip_feet','Feet Elevated Bench Dip','push','Tay sau',['chair'],3.2,'🪑','reps',[8,14]],
    ['single_db_press','Single-arm DB Floor Press','push','Ngực • Core',['dumbbell'],3.0,'🏋️‍♂️','reps',[8,12]],
    ['arnold_press','Arnold Press','push','Vai',['dumbbell'],3.0,'🔄','reps',[8,12]],
    ['front_raise','Dumbbell Front Raise','push','Vai trước',['dumbbell'],2.1,'⬆️','reps',[10,16]],
    ['band_triceps_pushdown','Band Triceps Pushdown','push','Tay sau',['band'],2.3,'📿','reps',[12,20]],
    ['overhead_band_ext','Overhead Band Extension','push','Tay sau',['band'],2.2,'🎯','reps',[12,18]],
    ['wall_handstand_hold','Wall Handstand Hold','push','Vai • Core',['wall'],4.2,'🤸','time',[15,40]],
    ['dead_hang_active','Active Hang','pull','Lats • Grip',['bar'],1.8,'🧲','time',[15,35]],
    ['scap_pullup','Scapular Pull-up','pull','Lats • Scapula',['bar'],2.0,'🎣','reps',[8,15]],
    ['band_row','Band Row','pull','Lưng giữa',['band'],1.8,'🪢','reps',[12,20]],
    ['band_facepull','Band Face Pull','pull','Rear delt • Upper back',['band'],2.3,'😮','reps',[12,20]],
    ['db_row_supported','Supported DB Row','pull','Lats • Rhomboids',['dumbbell','chair'],2.4,'🪑','reps',[8,15]],
    ['reverse_snowangel','Reverse Snow Angel','pull','Upper back',[],1.6,'❄️','reps',[12,18]],
    ['negative_pullup','Negative Pull-up','pull','Lats • Biceps',['bar'],3.0,'📉','reps',[3,8]],
    ['band_assist_pullup','Band-assisted Pull-up','pull','Lats • Biceps',['bar','band'],2.8,'🆘','reps',[5,10]],
    ['chinup_hold_top','Chin-up Top Hold','pull','Biceps • Lats',['bar'],3.5,'🪝','time',[10,25]],
    ['band_biceps_curl','Band Biceps Curl','pull','Biceps',['band'],1.8,'💪','reps',[12,20]],
    ['hammer_curl','DB Hammer Curl','pull','Brachialis • Biceps',['dumbbell'],2.0,'🔨','reps',[10,16]],
    ['rear_delt_fly','Rear Delt Fly','pull','Rear delt',['dumbbell'],2.1,'🪽','reps',[12,18]],
    ['inverted_row_table','Table Inverted Row','pull','Lats • Mid back',['table'],3.1,'↩️','reps',[6,12]],
    ['towel_row','Towel Door Row','pull','Mid back • Grip',['towel'],2.6,'🧻','reps',[8,15]],
    ['reverse_lunge','Reverse Lunge','legs','Quads • Glutes',[],2.0,'↩️','reps',[8,14]],
    ['walking_lunge','Walking Lunge','legs','Quads • Glutes',[],2.4,'🚶','reps',[10,16]],
    ['curtsy_lunge','Curtsy Lunge','legs','Glute medius',[],2.3,'🩰','reps',[8,14]],
    ['cossack_squat','Cossack Squat','legs','Adductors • Glutes',[],3.0,'↔️','reps',[6,12]],
    ['step_up','Chair Step-up','legs','Glutes • Quads',['chair'],2.1,'🪜','reps',[10,16]],
    ['shrimp_squat','Shrimp Squat','legs','Quads • Balance',[],4.4,'🦐','reps',[4,8]],
    ['pistol_assisted','Assisted Pistol Squat','legs','Quads • Glutes',['chair'],4.2,'🦵','reps',[4,8]],
    ['db_rdl','Dumbbell Romanian Deadlift','legs','Hamstrings • Glutes',['dumbbell'],2.5,'🏋️','reps',[8,14]],
    ['band_good_morning','Band Good Morning','legs','Hamstrings • Lower back',['band'],2.0,'🌅','reps',[12,18]],
    ['sumo_squat','Sumo Squat','legs','Glutes • Adductors',[],1.7,'👐','reps',[12,20]],
    ['single_leg_glute_bridge','Single-leg Glute Bridge','legs','Glutes • Hamstrings',[],2.3,'🌉','reps',[10,16]],
    ['calf_raise_single','Single-leg Calf Raise','legs','Calves',[],1.9,'🐄','reps',[12,20]],
    ['wall_sit','Wall Sit','legs','Quads',['wall'],1.8,'🧱','time',[20,60]],
    ['jump_lunge','Jump Lunge','legs','Quads • Power',[],3.4,'🦘','reps',[8,14]],
    ['bird_dog','Bird Dog','core','Core • Lower back',[],1.3,'🐦','reps',[10,16]],
    ['dead_bug_press','Dead Bug Press','core','Core • Coordination',[],1.6,'🐞','reps',[10,16]],
    ['body_saw','Body Saw','core','Abs • Shoulders',['towel'],2.9,'🪚','reps',[8,14]],
    ['hollow_rock','Hollow Rock','core','Abs',[],2.6,'🪨','reps',[10,20]],
    ['side_plank_reach','Side Plank Reach-through','core','Oblique',[],2.4,'🌀','reps',[8,14]],
    ['vup','V-up','core','Abs • Hip flexor',[],2.8,'V','reps',[8,15]],
    ['toes_to_bar_reg','Toes-to-Bar Regression','core','Core • Lats',['bar'],3.5,'🎯','reps',[5,10]],
    ['dragon_flag_neg','Dragon Flag Negative','core','Abs • Lats',['bench'],5.0,'🐉','reps',[3,6]],
    ['pallof_press','Band Pallof Press','core','Anti-rotation core',['band'],2.2,'🛡️','reps',[10,16]],
    ['russian_twist','Russian Twist','core','Oblique',[],1.8,'🌪️','reps',[16,30]],
    ['mountain_climber','Mountain Climber','core','Core • Conditioning',[],1.9,'⛰️','reps',[20,40]],
    ['bear_crawl_hold','Bear Crawl Hold','core','Core • Shoulders',[],2.0,'🐻','time',[20,45]],
    ['ab_wheel_towel','Towel Rollout','core','Abs • Lats',['towel'],3.4,'🧻','reps',[6,12]],
    ['reverse_crunch','Reverse Crunch','core','Lower abs',[],1.7,'🔄','reps',[12,20]]
  ];
  function defGuide(ex){
    return {
      setup:`Chuẩn bị tư thế ổn định cho ${ex.name}, giữ cột sống trung lập và siết cơ trung tâm.`,
      steps:[
        `Vào tư thế bắt đầu của ${ex.name}, kiểm soát nhịp thở và tạo độ căng.`,
        ex.type==='time' ? 'Giữ tư thế theo thời gian mục tiêu.' : 'Thực hiện đủ ROM, tránh dùng đà.',
        'Kết thúc trong kiểm soát và ưu tiên form.'
      ],
      cues:['Siết core','Không đau khớp','Ưu tiên kiểm soát chuyển động'],
      breathing:'Hít ở pha chuẩn bị, thở ra ở pha dùng lực.'
    };
  }
  extras.forEach(x=>{
    const ex={id:x[0],name:x[1],pattern:x[2],muscle:x[3],eq:x[4],diff:x[5],icon:x[6],type:x[7],rep:x[8]};
    if(!EXERCISES.some(e=>e.id===ex.id)) EXERCISES.push(ex);
    if(typeof GUIDES!=='undefined' && !GUIDES[ex.id]) GUIDES[ex.id]=defGuide(ex);
  });

  function countExercises(){ return EXERCISES.length; }
  function logPattern(){
    const map={push:0,pull:0,legs:0,core:0};
    const hist=state.v24?.exerciseHistory||{};
    Object.keys(hist).forEach(id=>{
      const ex=EXERCISES.find(e=>e.id===id); if(!ex) return;
      (hist[id]||[]).forEach(v=>{ map[ex.pattern]+= (v.reps||0)+Math.round((v.holdSec||0)/5); });
    });
    return map;
  }
  function svgBody(side){
    const m=logPattern();
    const mx=Math.max(1,m.push,m.pull,m.legs,m.core);
    const c={
      push:`rgba(255,95,125,${0.25+0.55*m.push/mx})`,
      pull:`rgba(95,215,255,${0.25+0.55*m.pull/mx})`,
      legs:`rgba(110,255,120,${0.25+0.55*m.legs/mx})`,
      core:`rgba(255,190,80,${0.25+0.55*m.core/mx})`,
      base:'rgba(255,255,255,.86)',
      line:'rgba(0,0,0,.16)'
    };
    if(side==='front'){
      return `<svg viewBox="0 0 200 300" width="100%" height="250">
        <ellipse cx="100" cy="28" rx="21" ry="22" fill="${c.base}" stroke="${c.line}"/>
        <rect x="84" y="49" width="32" height="36" rx="12" fill="${c.base}" stroke="${c.line}"/>
        <path d="M67 80 Q100 63 133 80 L145 135 Q100 152 55 135 Z" fill="${c.push}" stroke="${c.line}"/>
        <path d="M81 82 L95 150 L105 150 L119 82" fill="${c.core}" stroke="${c.line}"/>
        <rect x="54" y="81" width="16" height="58" rx="8" fill="${c.push}" stroke="${c.line}"/>
        <rect x="130" y="81" width="16" height="58" rx="8" fill="${c.push}" stroke="${c.line}"/>
        <rect x="46" y="135" width="15" height="58" rx="8" transform="rotate(18 46 135)" fill="${c.pull}" stroke="${c.line}"/>
        <rect x="139" y="135" width="15" height="58" rx="8" transform="rotate(-18 139 135)" fill="${c.pull}" stroke="${c.line}"/>
        <path d="M75 150 Q100 163 125 150 L121 183 Q100 195 79 183 Z" fill="${c.core}" stroke="${c.line}"/>
        <rect x="78" y="183" width="18" height="76" rx="9" fill="${c.legs}" stroke="${c.line}"/>
        <rect x="104" y="183" width="18" height="76" rx="9" fill="${c.legs}" stroke="${c.line}"/>
        <rect x="76" y="252" width="18" height="38" rx="9" fill="${c.legs}" stroke="${c.line}"/>
        <rect x="106" y="252" width="18" height="38" rx="9" fill="${c.legs}" stroke="${c.line}"/>
        <ellipse cx="84" cy="293" rx="18" ry="7" fill="${c.base}" stroke="${c.line}"/>
        <ellipse cx="116" cy="293" rx="18" ry="7" fill="${c.base}" stroke="${c.line}"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 200 300" width="100%" height="250">
      <ellipse cx="100" cy="28" rx="21" ry="22" fill="${c.base}" stroke="${c.line}"/>
      <rect x="84" y="49" width="32" height="36" rx="12" fill="${c.base}" stroke="${c.line}"/>
      <path d="M67 80 Q100 62 133 80 L145 138 Q100 150 55 138 Z" fill="${c.pull}" stroke="${c.line}"/>
      <path d="M94 80 L100 148 L106 80" fill="${c.core}" stroke="${c.line}"/>
      <rect x="54" y="81" width="16" height="58" rx="8" fill="${c.pull}" stroke="${c.line}"/>
      <rect x="130" y="81" width="16" height="58" rx="8" fill="${c.pull}" stroke="${c.line}"/>
      <rect x="46" y="135" width="15" height="58" rx="8" transform="rotate(18 46 135)" fill="${c.pull}" stroke="${c.line}"/>
      <rect x="139" y="135" width="15" height="58" rx="8" transform="rotate(-18 139 135)" fill="${c.pull}" stroke="${c.line}"/>
      <path d="M75 150 Q100 163 125 150 L121 183 Q100 195 79 183 Z" fill="${c.legs}" stroke="${c.line}"/>
      <rect x="78" y="183" width="18" height="76" rx="9" fill="${c.legs}" stroke="${c.line}"/>
      <rect x="104" y="183" width="18" height="76" rx="9" fill="${c.legs}" stroke="${c.line}"/>
      <rect x="76" y="252" width="18" height="38" rx="9" fill="${c.legs}" stroke="${c.line}"/>
      <rect x="106" y="252" width="18" height="38" rx="9" fill="${c.legs}" stroke="${c.line}"/>
      <ellipse cx="84" cy="293" rx="18" ry="7" fill="${c.base}" stroke="${c.line}"/>
      <ellipse cx="116" cy="293" rx="18" ry="7" fill="${c.base}" stroke="${c.line}"/>
    </svg>`;
  }
  function weekStrip(){
    const labs=['Mo','Tu','We','Th','Fr','Sa','Su'];
    const today=new Date();
    const mondayOffset=(today.getDay()+6)%7;
    let out='';
    for(let i=0;i<7;i++){
      const d=new Date(today); d.setDate(today.getDate()-mondayOffset+i);
      const done=(state.history||[]).some(x=>new Date(x.date).toDateString()===d.toDateString());
      const active=i===mondayOffset;
      out += `<div class="v31-daypill ${active?'active':''} ${done?'done':''}">
        <div class="d">${labs[i]}</div><div class="n">${d.getDate()}</div><small>${done?'Done':'Plan'}</small>
      </div>`;
    }
    return `<div class="v31-weekstrip">${out}</div>`;
  }
  function homePageV31(){
    const idx=typeof todayPlanIndex==='function'?todayPlanIndex():0;
    const next=state.plan[idx];
    const p=state.profile||{};
    const body=state.v23?.body||{};
    return `<div class="topbar"><div><div class="brand">FORGEPATH <span>V3.11</span></div><div class="kicker">Home nâng cấp • lịch tuần • database mở rộng</div></div><span class="pill accent">${countExercises()} bài</span></div>
      <main class="v30-shell">
        <div class="hero">
          <div class="row between"><div><div class="eyebrow">Dashboard</div><h1 style="margin:8px 0 2px">Daily Workout</h1><p>Lịch theo tuần giống app tham chiếu, trực quan hơn để xem buổi tập hôm nay.</p></div><span class="v30-tag">Calendar</span></div>
          ${weekStrip()}
        </div>
        <div class="v31-heroGrid">
          <div class="card" style="overflow:hidden">
            <div class="v31-quickProfile">
              <div class="v31-photo"></div>
              <div><h2 style="margin:0">${p.name||'Nguyễn Văn Tuân'}</h2><div class="sub">${goalLabel(p.goal)} • ${(p.minutes||45)} minutes</div></div>
            </div>
            <div class="v31-list" style="margin-top:14px">
              <div class="v31-row"><span>Workout hôm nay</span><small>${next?next.title:'Recovery / Rest'}</small></div>
              <div class="v31-row"><span>Dụng cụ</span><small>${(p.equipment||[]).map(eqLabel).join(' · ')||'Bodyweight'}</small></div>
              <div class="v31-row"><span>Level</span><small>Push ${p.levels?.push||1} · Pull ${p.levels?.pull||1} · Legs ${p.levels?.legs||1} · Core ${p.levels?.core||1}</small></div>
            </div>
            ${next?`<button class="btn primary full" style="margin-top:14px" onclick="startWorkout('${next.id}')">Bắt đầu buổi tập</button>`:''}
          </div>
          <div class="v31-heroBody">
            <div class="row between"><h3 style="margin:0">Training Focus</h3><span class="v30-tag">Muscle Map</span></div>
            <div class="v31-bodyGrid" style="margin-top:10px">
              <div class="v31-bodyPanel"><span class="sub">Front</span>${svgBody('front')}</div>
              <div class="v31-bodyPanel"><span class="sub">Back</span>${svgBody('back')}</div>
            </div>
          </div>
        </div>
        <div class="v31-miniGrid">
          <div class="v31-mini"><b>${countExercises()}</b><span>Exercise DB</span></div>
          <div class="v31-mini"><b>${state.history.length}</b><span>Workouts</span></div>
          <div class="v31-mini"><b>${Object.keys(state.v24?.prs||{}).length}</b><span>PRs</span></div>
        </div>
      </main>${bottomNavV31('home')}`;
  }
  function progressPageV31(){
    const p=state.profile||{}, body=state.v23?.body||{}, weight=body.weight||51, height=body.height||170;
    const bmi=(weight/((height/100)**2)).toFixed(1);
    const pattern=logPattern();
    const view=state.v31.progressView||'overview';
    const prList=Object.entries(state.v24?.prs||{}).filter(([,v])=>v.maxReps||v.maxHold);
    let content='';
    if(view==='overview'){
      content = `<div class="v31-heroGrid">
        <div class="card">
          <div class="row between"><div><div class="brand">My Progress</div><div class="kicker">User Profile</div></div><button class="v31-settingsIcon" onclick="state.v31.progressView='settings';save();render()">⚙</button></div>
          <div class="v31-quickProfile" style="margin-top:14px">
            <div class="v31-photo"></div>
            <div><h2 style="margin:0">${p.name||'Athlete'}</h2><div class="sub">Newbie • ${goalLabel(p.goal)}</div><div style="margin-top:8px" class="v30-tag">${state.history.length} Workouts</div></div>
          </div>
          <div class="v31-miniGrid" style="margin-top:14px">
            <div class="v31-mini"><b>${weight} kg</b><span>Weight</span></div>
            <div class="v31-mini"><b>${height} cm</b><span>Height</span></div>
            <div class="v31-mini"><b>${bmi}</b><span>BMI</span></div>
          </div>
          <div class="v31-list" style="margin-top:14px">
            <div class="v31-row"><span>Goal</span><small>${goalLabel(p.goal)}</small></div>
            <div class="v31-row"><span>Equipment</span><small>${(p.equipment||[]).map(eqLabel).join(' · ')||'Bodyweight'}</small></div>
            <div class="v31-row"><span>Schedule</span><small>${p.days||4} buổi/tuần · ${p.minutes||45} phút</small></div>
          </div>
        </div>
        <div class="v31-heroBody">
          <div class="row between"><h3 style="margin:0">Training Heatmap</h3><span class="v30-tag">Profile</span></div>
          <div class="v31-bodyGrid" style="margin-top:10px">
            <div class="v31-bodyPanel"><span class="sub">Front</span>${svgBody('front')}</div>
            <div class="v31-bodyPanel"><span class="sub">Back</span>${svgBody('back')}</div>
          </div>
          <div class="v31-list" style="margin-top:10px">
            <div class="v31-row"><span>Push load</span><small>${pattern.push}</small></div>
            <div class="v31-row"><span>Pull load</span><small>${pattern.pull}</small></div>
            <div class="v31-row"><span>Legs load</span><small>${pattern.legs}</small></div>
            <div class="v31-row"><span>Core load</span><small>${pattern.core}</small></div>
          </div>
        </div>
      </div>`;
    } else if(view==='records'){
      const rows = prList.map(([id,v])=>{
        const ex=EXERCISES.find(e=>e.id===id)||{};
        return `<div class="v31-row"><span><b>${ex.name||id}</b></span><small>${v.maxReps?('Max reps '+v.maxReps):''}${v.maxHold?(' · Hold '+v.maxHold+'s'):''}</small></div>`;
      }).join('');
      content = `<div class="card"><div class="row between"><h3>Personal Records</h3><button class="v31-settingsIcon" onclick="state.v31.progressView='settings';save();render()">⚙</button></div><div class="v31-list" style="margin-top:8px">${rows||'<div class="sub">Chưa có PR.</div>'}</div></div>`;
    } else if(view==='calendar'){
      const map={}; (state.history||[]).forEach(x=>{ const d=new Date(x.date), k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); map[k]=(map[k]||0)+(x.durationMin||45); });
      let cells=''; for(let i=83;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); const k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); const v=map[k]||0; const c=v>=60?'d':v>=40?'c':v>=20?'b':v?'a':''; cells += `<div class="v30-day ${c}" title="${d.toLocaleDateString()} · ${v}m">${d.getDate()}</div>`; }
      content = `<div class="card"><div class="row between"><h3>Calendar</h3><button class="v31-settingsIcon" onclick="state.v31.progressView='settings';save();render()">⚙</button></div><div class="v30-calendar" style="margin-top:12px">${cells}</div></div>`;
    } else {
      content = `<div class="card">
        <div class="row between"><h3>Settings</h3><button class="v31-settingsIcon" onclick="state.v31.progressView='overview';save();render()">↩</button></div>
        <div class="v31-list">
          <div><div class="kicker">Theme</div><div class="v31-swatches" style="margin-top:10px">
            ${['neon','ocean','sunset','mono'].map(k=>`<div class="v31-swatch ${k} ${state.v30.theme===k?'on':''}" onclick="state.v30.theme='${k}';saveAndRender('Saved')"></div>`).join('')}
          </div></div>
          <div><div class="kicker">Training Profile</div><div class="v31-optionBar" style="margin-top:10px">
            ${[['balanced','Balanced'],['strength','Strength'],['hypertrophy','Hypertrophy'],['endurance','Endurance'],['skills','Skills']].map(x=>`<div class="v31-option ${state.v30.trainingProfile===x[0]?'on':''}" onclick="state.v30.trainingProfile='${x[0]}';saveAndRender('Saved')">${x[1]}</div>`).join('')}
          </div></div>
          <div><div class="kicker">Language</div><div class="v31-optionBar" style="margin-top:10px">
            ${[['vi','Tiếng Việt'],['en','English']].map(x=>`<div class="v31-option ${state.v30.lang===x[0]?'on':''}" onclick="state.v30.lang='${x[0]}';saveAndRender('Saved')">${x[1]}</div>`).join('')}
          </div></div>
          <div class="v31-row"><span>Compact UI</span><button class="btn ${state.v30.compactMode?'primary':'ghost'}" onclick="state.v30.compactMode=!state.v30.compactMode;saveAndRender('Saved')">${state.v30.compactMode?'ON':'OFF'}</button></div>
          <div class="v31-row"><span>Animations</span><button class="btn ${state.v30.animations?'primary':'ghost'}" onclick="state.v30.animations=!state.v30.animations;saveAndRender('Saved')">${state.v30.animations?'ON':'OFF'}</button></div>
          <div class="v31-row"><span>Re-open onboarding</span><button class="btn ghost" onclick="state.onboarded=false;save();render()">Start setup</button></div>
        </div>
      </div>`;
    }
    return `<div class="topbar"><div class="row between"><div><div class="brand">My Progress <span>V3.6</span></div><div class="kicker">Profile + heatmap + settings trong cùng 1 mục</div></div><button class="v31-settingsIcon" onclick="state.v31.progressView='settings';save();render()">⚙</button></div></div>
      <main class="v30-shell">
        <div class="v31-subtabs">
          <button class="${view==='overview'?'on':''}" onclick="state.v31.progressView='overview';save();render()">Overview</button>
          <button class="${view==='records'?'on':''}" onclick="state.v31.progressView='records';save();render()">Records</button>
          <button class="${view==='calendar'?'on':''}" onclick="state.v31.progressView='calendar';save();render()">Calendar</button>
          <button class="${view==='settings'?'on':''}" onclick="state.v31.progressView='settings';save();render()">Settings</button>
        </div>
        ${content}
      </main>${bottomNavV31('progress')}`;
  }
  function bottomNavV31(active){
    const items=[['home','⌂','Home'],['plan','▦','Plan'],['train','＋','Train'],['progress','↗','Progress']];
    return `<nav class="bottomnav">${items.map(i=>`<button class="navbtn ${active===i[0]?'active':''}" onclick="nav('${i[0]}')"><i>${i[1]}</i><span>${i[2]}</span></button>`).join('')}</nav>`;
  }
  function trainPageV31(){
    if(typeof oldTrainPage==='function'){
      const html = oldTrainPage();
      return String(html).replace('V3.0','V3.1').replace('</main>', `<div class="card" style="margin-top:14px"><b>Expanded library</b><div class="sub">Hiện đã có khoảng ${countExercises()} bài tập, đa dạng hơn nhiều so với bản cũ.</div></div></main>`);
    }
    return `<main><div class="card"><h2>Train</h2><p class="sub">${countExercises()} exercises available.</p></div></main>`;
  }
  function appRenderV31(){
    try{
      if(state.exerciseDetail && typeof oldExercisePage==='function'){
        document.querySelector('#app').innerHTML = oldExercisePage(state.exerciseDetail);
        return;
      }
      if(state.currentWorkout && typeof oldRenderWorkout==='function'){
        oldRenderWorkout(); return;
      }
      if(!state.onboarded){ onboarding(); return; }
      const pages={home:homePageV31, plan:(typeof oldCoachPage==='function'?oldCoachPage:homePageV31), train:trainPageV31, progress:progressPageV31};
      const fn = pages[state.tab] || homePageV31;
      document.querySelector('#app').innerHTML = fn();
    } catch(err){
      console.error('V3.1 render error', err);
      document.querySelector('#app').innerHTML = `<main><div class="card"><h2>⚠ V3.4 runtime error</h2><p class="sub">${String(err.message||err)}</p></div></main>`;
    }
  }
  window.bottomNav = bottomNavV31;
  window.nav = function(tab){ state.tab=tab; state.exerciseDetail=null; save(); appRenderV31(); window.scrollTo(0,0); };
  window.home = homePageV31;
  window.v23Train = trainPageV31;
  window.v23Progress = progressPageV31;
  window.profile = progressPageV31;
  window.render = appRenderV31;
  appRenderV31();
})();

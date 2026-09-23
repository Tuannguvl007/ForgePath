
(()=>{
function v242ProfileCard(){
 const p=state.profile||{},ready=v23Readiness(),b=state.v23?.body||{},weight=b.weight||51,height=b.height||170,bmi=(weight/((height/100)**2)).toFixed(1),xp=state.xp||0,lvl=Math.max(1,Math.floor(xp/500)+1),lp=xp%500/5;
 return `<div class="v242-profile"><div class="v242-head"><div class="v242-avatar">${(p.name||'U')[0]}</div><div style="flex:1"><b style="font-size:20px">${p.name||'Athlete'}</b><div class="sub">Calisthenics Foundation · Level ${lvl}</div><div class="v242-level"><i style="width:${lp}%"></i></div></div><span class="pill accent">🔥 ${state.streak||0} ngày</span></div>
 <div class="v242-stats"><div class="v242-stat"><b>${weight}</b><small>KG</small></div><div class="v242-stat"><b>${height}</b><small>CM</small></div><div class="v242-stat"><b>${bmi}</b><small>BMI</small></div><div class="v242-stat"><b>${ready}</b><small>READINESS</small></div></div>
 <div class="v242-info"><div><span>◎ Mục tiêu</span><small>${p.goal||'Calisthenics + tăng cơ'}</small></div><div><span>⌁ Dụng cụ</span><small>${(p.equipment||[]).join(' · ')||'Bodyweight'}</small></div><div><span>▣ Lịch tập</span><small>${p.days||4} buổi · ${p.minutes||45} phút</small></div></div></div>`
}
function v242Features(e){
 return `<div class="v242-sectionhead"><h3>Form Intelligence</h3><span class="v242-tag">Biomechanics</span></div><div class="v242-featuregrid">
 <div class="v242-feature"><div>◉</div><b>Exercise Guide</b><span>Kỹ thuật + YouTube</span></div>
 <div class="v242-feature"><div>↔</div><b>ROM chuẩn</b><span>Range of Motion</span><div class="v242-rom"><i></i></div></div>
 <div class="v242-feature"><div>◈</div><b>Muscle Heatmap</b><span>Chest 65% · Triceps 25%</span><div class="v242-muscles"><i></i><i></i><i></i></div></div>
 <div class="v242-feature"><div>!</div><b>Common Mistakes</b><span>Elbow flare · hip sag · ROM</span></div>
 <div class="v242-feature"><div>≈</div><b>Hít thở</b><span>Hít xuống · thở khi đẩy</span></div>
 <div class="v242-feature"><div>⏱</div><b>Tempo</b><span>${e?.tempo||'2–1–2'} · guided rhythm</span></div></div>`
}
window.profile=function(){
 return `<div class="topbar"><div><div class="brand">PROFILE <span>2.0</span></div><div class="kicker">Athlete identity & readiness</div></div><button class="iconbtn" onclick="state.onboarded=false;save();render()">⚙</button></div><main>${v242ProfileCard()}
 <div class="v242-sectionhead"><h3>Training identity</h3><span class="v242-tag">Data Core</span></div><div class="card"><div class="v241-kpis"><div class="v241-kpi"><strong>${state.history.length}</strong><span class="v24-muted">Workouts</span></div><div class="v241-kpi"><strong>${v241AllLogs().length}</strong><span class="v24-muted">Logged sets</span></div><div class="v241-kpi"><strong>${Object.keys(state.v24?.prs||{}).length}</strong><span class="v24-muted">Records</span></div></div></div>
 </main>${bottomNav('profile')}`
};

const oldExPage=window.v24ExercisePage;
window.v24ExercisePage=function(id){
 const e=EXERCISES.find(x=>x.id===id);if(!e)return v23Train();const s=v241ExerciseStats(id),r=v241Recommendation(id),mx=Math.max(1,...s.H.map(x=>x.reps||x.holdSec||1)),chain=v24ProgressionFor(id).chain;
 return `<div class="topbar"><button class="iconbtn" onclick="state.exerciseDetail=null;state.tab='train';render()">‹</button><div><div class="brand">${e.name}</div><div class="kicker">${e.muscle} • Exercise Intelligence</div></div></div><main>
 <div class="v241-hero"><div class="eyebrow">${r.action}</div><h1>${r.text}</h1><p>Progression cá nhân dựa trên reps · RIR · form.</p></div>
 ${v242Features(e)}
 <div class="v242-sectionhead"><h3>Performance</h3><span class="v242-tag">${s.H.length} logs</span></div><div class="v242-metrics"><div class="v242-metric"><b>${s.pr.maxReps||0}</b><small>MAX REPS</small></div><div class="v242-metric"><b>${s.pr.maxHold||0}s</b><small>MAX HOLD</small></div><div class="v242-metric"><b>${s.avgForm||'—'}%</b><small>FORM</small></div><div class="v242-metric"><b>${s.avgRir}</b><small>AVG RIR</small></div></div>
 <div class="card"><b>Volume / reps history</b><div class="v242-chart">${s.H.length?s.H.slice(-20).map(x=>`<i style="height:${Math.max(7,(x.reps||x.holdSec||0)/mx*100)}%"></i>`).join(''):'<span class="v24-muted">Chưa có dữ liệu thật.</span>'}</div></div>
 <div class="v242-sectionhead"><h3>Skill path</h3><span class="v242-tag">Progression</span></div><div class="card"><div class="v242-skillmap">${chain.map(x=>{const ex=EXERCISES.find(z=>z.id===x),p=state.v24?.prs?.[x]||{},done=p.maxReps||p.maxHold;return `<div class="v242-node ${done?'done':x===id?'now':'lock'}">${done?'✓<br>':x===id?'●<br>':'🔒<br>'}${ex?.name||x}</div>`}).join('')}</div></div>
 </main>`
};

const oldProg=window.v23Progress;
window.v23Progress=function(){
 const tab=state.v241.progressTab||'overview',logs=v241AllLogs(),prs=Object.entries(state.v24?.prs||{}).filter(([,p])=>p.maxReps||p.maxHold);
 let body='';
 if(tab==='overview'){
   const recent=state.history.slice(-16),max=Math.max(1,...recent.map(x=>x.exercises||1));
   body=`<div class="v241-kpis"><div class="v241-kpi"><strong>${state.history.length}</strong><span class="v24-muted">Workouts</span></div><div class="v241-kpi"><strong>${logs.length}</strong><span class="v24-muted">Sets</span></div><div class="v241-kpi"><strong>${prs.length}</strong><span class="v24-muted">PRs</span></div></div><div class="v242-sectionhead"><h3>Training Volume</h3><span class="v242-tag">Real data</span></div><div class="card"><div class="v242-chart">${recent.length?recent.map(x=>`<i style="height:${Math.max(8,(x.exercises||1)/max*100)}%"></i>`).join(''):'<span class="v24-muted">Chưa có session.</span>'}</div></div><div class="v242-sectionhead"><h3>Recent PRs</h3></div><div class="card">${prs.slice(-5).reverse().map(([id,p])=>`<div class="v24-pr"><div><b>${EXERCISES.find(e=>e.id===id)?.name||id}</b><small>${p.maxReps?p.maxReps+' reps':''}${p.maxHold?' · '+p.maxHold+'s':''}</small></div><span>🏆</span></div>`).join('')||'<div class="empty">PR sẽ tự xuất hiện khi bạn phá kỷ lục.</div>'}</div>`
 } else if(tab==='calendar'){
   const map={};state.history.forEach(x=>{const d=new Date(x.date),k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();map[k]=(map[k]||0)+(x.durationMin||45)});let cells='';for(let i=83;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const v=map[d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()]||0,c=v>=60?'d':v>=40?'c':v>=20?'b':v?'a':'';cells+=`<div class="v242-cell ${c}" title="${d.toLocaleDateString()} · ${v} phút">${d.getDate()}</div>`}body=`<div class="card"><div class="v242-calendar">${cells}</div><p class="sub">Đậm hơn = tập nhiều hơn • 12 tuần gần nhất</p></div>`
 } else if(tab==='exercises') body=v241Exercises();
 else if(tab==='skills') body=v24Skills().map(s=>`<div class="v242-sectionhead"><h3>${s.name}</h3></div><div class="card"><div class="v242-skillmap">${s.nodes.map(([id,req])=>{const e=EXERCISES.find(x=>x.id===id),p=state.v24?.prs?.[id]||{},v=Math.max(p.maxReps||0,p.maxHold||0),done=v>=req;return `<div class="v242-node ${done?'done':v?'now':'lock'}">${done?'✓':' '+Math.min(100,Math.round(v/req*100))+'%'}<br>${e?.name||id}</div>`}).join('')}</div></div>`).join('');
 else body=v241PR();
 return `<div class="topbar"><div><div class="brand">PROGRESS <span>2.0</span></div><div class="kicker">Volume · Records · Skills · Calendar</div></div><span class="pill accent">${v23Readiness()}/100</span></div><main><div class="v241-tabs">${[['overview','Overview'],['calendar','Calendar'],['exercises','Exercises'],['skills','Skill Tree'],['pr','Records']].map(x=>`<button class="${tab===x[0]?'on':''}" onclick="v241SetProgressTab('${x[0]}')">${x[1]}</button>`).join('')}</div>${body}
 <div class="v242-sectionhead"><h3>ForgePath Adaptive Engine</h3><span class="v242-tag">Local AI logic</span></div><div class="v242-ai"><b>Session Data</b><div class="v242-flow"><div>Reps<br><small>Volume</small></div><div>RIR<br><small>Recovery</small></div><div>Form<br><small>Technique</small></div></div><div class="v242-arrow">↓</div><div class="v241-change"><b>Next Workout Generator</b><div class="sub">Reps · Tempo · Rest · Exercise progression</div></div></div></main>${bottomNav('progress')}`
};

const baseRW=window.renderWorkout;
window.renderWorkout=function(){
 baseRW();
 const cw=state.currentWorkout;if(!cw)return;
 document.querySelectorAll('[id^="exercise-"]').forEach((card,ei)=>{
   const e=cw.log[ei],done=setCount(e),si=currentSetIndex(e),cur=e.sets[Math.min(si,e.sets.length-1)];
   const live=document.createElement('div');live.className='v242-live';live.innerHTML=`<div class="v242-livehead"><div><b>Live Set Data</b><div class="sub">${e.name} · Set ${Math.min(si+1,e.sets.length)}/${e.sets.length}</div></div><span class="v242-clock">${cur.done?'SAVED':'● LIVE'}</span></div><div class="v242-metrics"><div class="v242-metric"><b>${cur.value||0}</b><small>${e.type==='time'?'SECONDS':'REPS'}</small></div><div class="v242-metric"><b>${cur.rir??2}</b><small>RIR</small></div><div class="v242-metric"><b>${cur.form??90}%</b><small>FORM</small></div><div class="v242-metric"><b>${e.rest||75}s</b><small>REST</small></div></div><div class="v242-featuregrid"><div class="v242-feature"><b>Tempo</b><span>${EXERCISES.find(x=>x.id===e.id)?.tempo||'2–1–2'}</span></div><div class="v242-feature"><b>Biomechanics</b><span>ROM + contact + joint form</span></div></div>`;
   const counter=card.querySelector('.counterbox');if(counter)card.insertBefore(live,counter);
 })
};

window.render();
})();

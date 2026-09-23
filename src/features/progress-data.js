
(()=>{
state.v241=state.v241||{progressTab:'overview',lastPR:null};

function v241AllLogs(){
  const out=[];
  const eh=state.v24?.exerciseHistory||{};
  Object.entries(eh).forEach(([id,arr])=>arr.forEach(x=>out.push({exerciseId:id,...x})));
  return out.sort((a,b)=>a.date-b.date);
}
function v241ExerciseStats(id){
  const H=v24Hist(id),pr=state.v24?.prs?.[id]||{maxReps:0,maxHold:0};
  const totalReps=H.reduce((a,x)=>a+(x.reps||0),0);
  const avgForm=H.length?Math.round(H.reduce((a,x)=>a+(x.form||0),0)/H.length):0;
  const avgRir=H.length?(H.reduce((a,x)=>a+(x.rir||0),0)/H.length).toFixed(1):'—';
  return {H,pr,totalReps,avgForm,avgRir};
}
function v241Recommendation(id){
  const e=EXERCISES.find(x=>x.id===id);if(!e)return null;
  const H=v24Hist(id), last=H[H.length-1], prog=v24ProgressionFor(id);
  if(!last)return {action:'BASELINE',text:`Thực hiện ${e.target||'mức giáo án'} và ghi RIR + form`,tone:'neutral'};
  const recent=H.slice(-3), good=recent.filter(x=>(x.form||0)>=88&&(x.rir??0)>=1).length;
  if((last.form||0)<75)return {action:'DELOAD',text:`Giảm 1–2 reps/set, ưu tiên form ≥85%`,tone:'warn'};
  if((last.rir??0)===0)return {action:'HOLD',text:`Giữ ${last.reps||last.holdSec} ${last.holdSec?'giây':'reps'} cho buổi tới`,tone:'neutral'};
  if(good>=2 && prog.next){const nx=EXERCISES.find(x=>x.id===prog.next);return {action:'PROGRESS',text:`Thử ${nx?.name||prog.next} ở set đầu`,tone:'good'}}
  if((last.rir??0)>=2)return {action:'OVERLOAD',text:`Tăng lên ${(last.reps||0)+1}–${(last.reps||0)+2} reps`,tone:'good'};
  return {action:'HOLD',text:`Lặp lại ${last.reps||last.holdSec} ${last.holdSec?'giây':'reps'} và cải thiện form`,tone:'neutral'};
}
function v241SetProgressTab(t){state.v241.progressTab=t;save();render()}
window.v241SetProgressTab=v241SetProgressTab;

window.bottomNav=function(active){
 const x=[['home','⌂','Home'],['plan','▦','Plan'],['train','＋','Train'],['progress','↗','Progress'],['profile','●','Profile']];
 return `<nav class="bottomnav">${x.map(a=>`<button class="navbtn ${active===a[0]?'active':''}" onclick="nav('${a[0]}')"><i>${a[1]}</i><span>${a[2]}</span></button>`).join('')}</nav>`
};

window.home=function(){
 const idx=todayPlanIndex(),next=state.plan[idx],done=state.plan.filter(w=>w.completed).length,ready=v23Readiness(),logs=v241AllLogs();
 const nextEx=next?.exercises?.[0],rec=nextEx?v241Recommendation(nextEx.id):null;
 const weekly=Math.round((done/Math.max(1,state.plan.length))*100);
 return `<div class="topbar"><div class="brand">FORGE<span>PATH</span> <small>3.0</small></div><div class="avatar">${(state.profile.name||'U')[0].toUpperCase()}</div></div><main>
 <div class="v241-hero"><div class="eyebrow">TODAY • ADAPTIVE COACH</div><div class="v241-score"><div class="v241-ring" style="--p:${ready}%"><b>${ready}</b></div><div><h1 style="margin:0">${ready>=85?'Sẵn sàng tăng tải.':ready>=65?'Sẵn sàng tập.':'Ưu tiên phục hồi.'}</h1><p style="margin:5px 0 0">Readiness được tính từ dữ liệu các buổi gần nhất.</p></div></div></div>
 <div class="v241-kpis"><div class="v241-kpi"><strong>${state.streak}</strong><span class="v24-muted">Streak</span></div><div class="v241-kpi"><strong>${weekly}%</strong><span class="v24-muted">Tuần này</span></div><div class="v241-kpi"><strong>${logs.length}</strong><span class="v24-muted">Sets đã log</span></div></div>
 ${next?`<div class="section-title">Workout hôm nay</div><div class="card"><div class="row between"><div><b>${next.title}</b><div class="sub">${next.focus} • ${next.exercises.length} bài</div></div><span class="pill accent">${state.profile.minutes} phút</span></div>${rec?`<div class="v241-next"><b>${rec.action}</b><div class="sub">${nextEx.name}: ${rec.text}</div></div>`:''}<button class="btn primary full" onclick="startWorkout('${next.id}')">${next.completed?'Xem lại':'Bắt đầu workout'}</button></div>`:''}
 <div class="section-title">Progression đang theo dõi</div><div class="card">${EXERCISES.filter(e=>v24Hist(e.id).length).slice(0,4).map(e=>{const r=v241Recommendation(e.id);return `<div class="v24-pr"><div><b>${e.name}</b><small>${r.text}</small></div><span class="v24-badge ${r.tone==='good'?'good':''}">${r.action}</span></div>`}).join('')||'<div class="empty">Hoàn thành set đầu tiên để ForgePath bắt đầu học dữ liệu của bạn.</div>'}</div>
 </main>${bottomNav('home')}`
};

const oldStartWorkout=window.startWorkout||startWorkout;
window.startWorkout=function(id){
 const w=state.plan.find(x=>x.id===id);if(!w)return;
 if(state.currentWorkout&&state.currentWorkout.planId===id){renderWorkout();return}
 const log=w.exercises.map(e=>{
   const H=v24Hist(e.id),last=H[H.length-1],rec=v241Recommendation(e.id);
   let lo=e.lo,hi=e.hi;
   if(last&&e.type!=='time'){
     if(rec?.action==='OVERLOAD'){lo=Math.max(lo,(last.reps||lo)+1);hi=Math.max(lo,(last.reps||lo)+2)}
     if(rec?.action==='HOLD'){lo=Math.max(1,last.reps||lo);hi=lo}
     if(rec?.action==='DELOAD'){lo=Math.max(1,(last.reps||lo)-2);hi=Math.max(lo,(last.reps||lo)-1)}
   }
   return {id:e.id,name:e.name,type:e.type,target:[lo,hi],rest:e.rest,adaptive:rec,sets:Array.from({length:e.sets},(_,i)=>({i:i+1,value:0,duration:0,done:false,rir:2,form:90})),rir:2}
 });
 state.currentWorkout={planId:id,startedAt:Date.now(),log,setTimer:null,restTimer:null,focusMode:state.settings?.focusMode,viewExerciseIndex:0};save();ensureWorkoutTicker();renderWorkout()
};

window.v241SetMetric=function(ei,si,key,val){
 const s=state.currentWorkout?.log?.[ei]?.sets?.[si];if(!s)return;s[key]=Math.max(0,Number(val)||0);save()
};

window.completeCurrentSet=function(ei){
 const cw=state.currentWorkout,e=cw.log[ei];if(setCount(e)===e.sets.length)return;
 const si=currentSetIndex(e),s=e.sets[si];
 if(e.type!=='time'&&s.value<=0&&!confirm('Reps đang là 0. Vẫn hoàn thành set?'))return;
 const dur=stopAndStoreSetTimer(ei,si);if(e.type==='time'&&s.value<=0&&dur)s.value=dur;
 s.done=true;s.rir=Number.isFinite(+s.rir)?+s.rir:e.rir||2;s.form=Number.isFinite(+s.form)?+s.form:90;
 v24Record(e.id,e.type==='time'?0:s.value,s.rir,s.form,e.type==='time'?s.value:0);
 const pr=state.v24?.prs?.[e.id]||{};const old=state.v241.lastPR;
 if((e.type!=='time'&&s.value>=pr.maxReps)||(e.type==='time'&&s.value>=pr.maxHold))state.v241.lastPR={id:e.id,value:s.value,type:e.type,date:Date.now()};
 const finished=setCount(e)+1>=e.sets.length;s.done=true;
 if(finished){const nx=cw.log.findIndex((x,i)=>i>ei&&setCount(x)<x.sets.length);if(nx>=0)cw.viewExerciseIndex=nx}
 const sessionDone=cw.log.every(x=>x.sets.every(s=>s.done));
 if(state.settings?.autoRest&&!sessionDone)startRestTimer(e.rest||75,ei);
 save();renderWorkout()
};

const oldRenderWorkout=window.renderWorkout||renderWorkout;
window.renderWorkout=function(){
 const cw=state.currentWorkout,w=cw&&state.plan.find(x=>x.id===cw.planId);if(!cw||!w){state.currentWorkout=null;save();render();return}
 ensureWorkoutTicker();const pct=workoutProgress(cw);
 document.querySelector('#app').innerHTML=`<div class="topbar"><div><div class="brand">LIVE <span>WORKOUT</span></div><div class="kicker">V3.0 • Set-level Data Logger</div></div><button class="btn small ghost" onclick="exitWorkout()">Thoát</button></div><main>
 <div class="hero"><div class="eyebrow">${w.focus}</div><h1>${w.title}</h1><p>${pct}% • dữ liệu từng set được lưu vào Progress</p></div><div class="card"><div class="progress"><span style="width:${pct}%"></span></div></div>
 ${cw.log.map((e,ei)=>{const done=setCount(e),si=currentSetIndex(e),cur=e.sets[Math.min(si,e.sets.length-1)],unit=e.type==='time'?'giây':'reps';return `<div class="card" id="exercise-${ei}">
 <div class="row between"><div class="exercisehead"><div class="exicon">${EXERCISES.find(x=>x.id===e.id)?.icon||'•'}</div><div class="exmeta"><b>${e.name}</b><span>Adaptive target ${e.target[0]}–${e.target[1]} ${unit}</span></div></div><span class="pill">${done}/${e.sets.length}</span></div>
 ${e.adaptive?`<div class="v241-change"><b>${e.adaptive.action}</b><div class="sub">${e.adaptive.text}</div></div>`:''}
 <div class="counterbox"><div class="countertop"><b>${done===e.sets.length?'✅ Hoàn thành':'SET '+(si+1)+' / '+e.sets.length}</b><span class="v241-target">Target ${e.target[0]}–${e.target[1]} ${unit}</span></div>
 <div class="countermain"><button class="counterbtn" onclick="adjustCount(${ei},-${e.type==='time'?5:1})" ${done===e.sets.length?'disabled':''}>−</button><div class="counternum"><strong id="counter-${ei}">${cur.value}</strong><span>${unit}</span></div><button class="counterbtn" onclick="adjustCount(${ei},${e.type==='time'?5:1})" ${done===e.sets.length?'disabled':''}>+</button></div>
 ${done<e.sets.length?`<div class="v241-setlog"><div><label>RIR</label><input type="number" min="0" max="5" value="${cur.rir??2}" onchange="v241SetMetric(${ei},${si},'rir',this.value)"></div><div><label>FORM %</label><input type="number" min="0" max="100" value="${cur.form??90}" onchange="v241SetMetric(${ei},${si},'form',this.value)"></div><div><label>REST</label><input type="text" value="${e.rest||75}s" disabled></div></div>`:''}
 <div class="setstatus">${e.sets.map((s,i)=>`<span class="setdot ${s.done?'done':(!s.done&&i===si?'current':'')}"></span>`).join('')}</div>
 <button class="btn primary full" onclick="completeCurrentSet(${ei})" ${done===e.sets.length?'disabled':''}>${done===e.sets.length?'Bài đã hoàn thành':'✓ Lưu & hoàn thành set'}</button></div>
 ${renderGuide(e)}</div>`}).join('')}
 <button class="btn primary full" onclick="finishWorkout()">Hoàn thành buổi tập</button><div style="height:110px"></div></main>${renderRestPanel()}`;updateTimerDOM()
};

window.finishWorkout=function(){
 const cw=state.currentWorkout,w=state.plan.find(x=>x.id===cw.planId),pct=workoutProgress(cw);
 if(pct<60&&!confirm('Bạn mới hoàn thành dưới 60% số set. Vẫn kết thúc?'))return;
 const allSets=cw.log.flatMap(e=>e.sets.filter(s=>s.done).map(s=>({exerciseId:e.id,reps:e.type==='time'?0:s.value,holdSec:e.type==='time'?s.value:0,rir:s.rir??e.rir??2,form:s.form??90})));
 const avgRir=allSets.length?allSets.reduce((a,s)=>a+s.rir,0)/allSets.length:2,avgForm=allSets.length?Math.round(allSets.reduce((a,s)=>a+s.form,0)/allSets.length):0;
 w.completed=true;w.completedAt=Date.now();w.performance={pct,avgRir,avgForm,log:cw.log};
 const now=Date.now(),duration=Math.max(1,Math.round((now-cw.startedAt)/60000));
 state.history.push({week:state.week,title:w.title,pct,avgRir,avgForm,date:now,durationMin:duration,exercises:w.exercises.length,levelSnapshot:{...state.profile.levels}});
 if(v24db){const sid=v24ID('session'),dk=new Date(now).toISOString().slice(0,10);v24Put('sessions',{id:sid,date:now,title:w.title,completion:pct,avgRir,avgForm,durationMin:duration,exerciseCount:w.exercises.length});v24Put('calendar',{id:dk,date:dk,minutes:duration,completion:pct,readiness:v23Readiness(),workouts:1});}
 state.xp+=Math.round(80+pct*.6);state.streak+=1;state.currentWorkout=null;save();toast(`Đã lưu ${allSets.length} set • Form ${avgForm}%`);render()
};

function v241Overview(){
 const S=v23Stats(),logs=v241AllLogs(),prs=Object.entries(state.v24?.prs||{}).filter(([,p])=>p.maxReps||p.maxHold);
 const recs=EXERCISES.filter(e=>v24Hist(e.id).length).slice(0,5);
 return `<div class="v241-kpis"><div class="v241-kpi"><strong>${S.total}</strong><span class="v24-muted">Sessions</span></div><div class="v241-kpi"><strong>${logs.length}</strong><span class="v24-muted">Sets</span></div><div class="v241-kpi"><strong>${prs.length}</strong><span class="v24-muted">PRs</span></div></div>
 <div class="section-title">Adaptive recommendations</div><div class="card">${recs.length?recs.map(e=>{const r=v241Recommendation(e.id);return `<div class="v24-pr" onclick="v24OpenExercise('${e.id}')"><div><b>${e.name}</b><small>${r.text}</small></div><span class="v24-badge ${r.tone==='good'?'good':''}">${r.action}</span></div>`}).join(''):'<div class="empty">Chưa có set thật để phân tích.</div>'}</div>
 <div class="section-title">14 sessions</div><div class="card"><div class="v23-spark">${state.history.slice(-14).map(x=>`<i style="height:${Math.max(8,x.pct)}%" title="${x.pct}%"></i>`).join('')||'<span class="v24-muted">Chưa có dữ liệu.</span>'}</div></div>`
}
function v241Exercises(){
 const used=EXERCISES.filter(e=>v24Hist(e.id).length);
 return `<div class="card">${used.length?used.map(e=>{const s=v241ExerciseStats(e.id),r=v241Recommendation(e.id);return `<div class="v24-pr" onclick="v24OpenExercise('${e.id}')"><div><b>${e.name}</b><small>${s.H.length} logs • ${s.totalReps} reps • form ${s.avgForm||'—'}%</small></div><span class="v24-badge ${r.tone==='good'?'good':''}">${r.action}</span></div>`}).join(''):'<div class="empty">Các bài bạn thực sự tập sẽ xuất hiện ở đây.</div>'}</div>`
}
function v241PR(){
 const prs=Object.entries(state.v24?.prs||{}).filter(([,p])=>p.maxReps||p.maxHold);
 return `<div class="card">${prs.length?prs.map(([id,p])=>`<div class="v24-pr"><div><b>${EXERCISES.find(e=>e.id===id)?.name||id}</b><small>${p.maxReps?`Max reps ${p.maxReps}`:''}${p.maxHold?` • Hold ${p.maxHold}s`:''}</small></div><span>🏆</span></div>`).join(''):'<div class="empty">PR được tạo tự động từ set bạn hoàn thành.</div>'}</div>`
}
window.v23Progress=function(){
 const tab=state.v241.progressTab||'overview';
 const body=tab==='overview'?v241Overview():tab==='calendar'?`<div class="card">${v24Cal()}<div class="v241-calendar-legend"><span>Ít</span><i class="v241-dot"></i><i class="v241-dot"></i><i class="v241-dot"></i><i class="v241-dot"></i><span>Nhiều</span></div></div>`:tab==='exercises'?v241Exercises():tab==='skills'?v24Skills().map(v24Tree).join(''):v241PR();
 return `<div class="topbar"><div><div class="brand">PROGRESS <span>3.0</span></div><div class="kicker">Không dùng dữ liệu demo</div></div><span class="pill accent">${v23Readiness()}/100</span></div><main><div class="hero"><div class="eyebrow">DATA CORE</div><h1>Lịch sử & progression thật.</h1><p>Mọi biểu đồ, PR và đề xuất bên dưới chỉ xuất hiện từ dữ liệu bạn đã tập.</p></div><div class="v241-tabs">${[['overview','Overview'],['calendar','Calendar'],['exercises','Exercises'],['skills','Skills'],['pr','PR']].map(x=>`<button class="${tab===x[0]?'on':''}" onclick="v241SetProgressTab('${x[0]}')">${x[1]}</button>`).join('')}</div>${body}</main>${bottomNav('progress')}`
};

window.v24ExercisePage=function(id){
 const e=EXERCISES.find(x=>x.id===id);if(!e)return v23Train();const s=v241ExerciseStats(id),r=v241Recommendation(id),mx=Math.max(1,...s.H.map(x=>x.reps||x.holdSec||1)),chain=v24ProgressionFor(id).chain;
 return `<div class="topbar"><button class="iconbtn" onclick="state.exerciseDetail=null;state.tab='train';render()">‹</button><div><div class="brand">${e.name}</div><div class="kicker">Exercise Data • V3.0</div></div></div><main>
 <div class="v241-hero"><div class="eyebrow">${r.action}</div><h1>${r.text}</h1><p>${e.muscle} • ${v23LevelName(e.diff)}</p></div>
 <div class="v24-grid"><div class="v24-card"><div class="v24-big">${s.pr.maxReps||0}</div><div class="v24-muted">PR reps</div></div><div class="v24-card"><div class="v24-big">${s.pr.maxHold||0}s</div><div class="v24-muted">PR hold</div></div><div class="v24-card"><div class="v24-big">${s.avgForm||'—'}%</div><div class="v24-muted">Form TB</div></div><div class="v24-card"><div class="v24-big">${s.avgRir}</div><div class="v24-muted">RIR TB</div></div></div>
 <div class="section-title">History</div><div class="card"><div class="v24-history">${s.H.length?s.H.slice(-24).map(x=>`<i style="height:${Math.max(5,(x.reps||x.holdSec||0)/mx*100)}%" title="${x.reps||x.holdSec}"></i>`).join(''):'<span class="v24-muted">Chưa có dữ liệu.</span>'}</div></div>
 <div class="section-title">Progression chain</div><div class="card">${chain.map(x=>{const ex=EXERCISES.find(z=>z.id===x),p=state.v24?.prs?.[x]||{},done=p.maxReps||p.maxHold;return `<div class="v24-exrow"><b>${done?'✓ ':x===id?'→ ':'○ '}${ex?.name||x}</b><small>${done?'Có dữ liệu':'Chưa đạt'}</small></div>`}).join('')}</div>
 <div class="section-title">Log thủ công</div><div class="card"><div class="v241-setlog"><div><label>REPS</label><input id="v24reps" type="number"></div><div><label>RIR</label><input id="v24rir" type="number" value="2"></div><div><label>FORM</label><input id="v24form" type="number" value="90"></div></div><input id="v24hold" type="hidden" value="0"><button class="btn primary full" onclick="v24Quick('${id}')">Lưu log</button></div></main>`
};

const baseRender=window.render||render;
window.render=function(){
 v23DailyAdapt();
 if(state.exerciseDetail){document.querySelector('#app').innerHTML=v24ExercisePage(state.exerciseDetail);return}
 if(state.currentWorkout){renderWorkout();return}
 if(!state.onboarded){onboarding();return}
 const views={home,plan,train:v23Train,progress:v23Progress,profile};
 document.querySelector('#app').innerHTML=(views[state.tab||'home']||home)()
};

render();
})();

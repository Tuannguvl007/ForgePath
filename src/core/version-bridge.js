
(()=>{
 const VERSION='V4.0';
 // The V3.6 path renderer is the single source for BOTH Home and Profile.
 function forceMaps(){
   try{
     if(state.tab==='home' && !document.getElementById('v36-home')){
       const stale=document.querySelector('.v351-daily'); if(stale){ const old=state.tab; /* render wrapper will patch on next microtask */ }
     }
     document.querySelectorAll('.v351-build,.v30-tag').forEach(x=>{if(/V3\.(6|7\.2|8|9|10|11|12)/.test(x.textContent||''))x.textContent=(x.textContent||'').replace(/V3\.(6|7\.2|8|9|10|11|12)/g,VERSION)});
   }catch(_){ }
 }
 const R=window.render,N=window.nav;
 window.render=function(){const z=R.apply(this,arguments);setTimeout(forceMaps,180);return z};
 window.nav=function(){const z=N.apply(this,arguments);setTimeout(forceMaps,180);return z};
 setTimeout(forceMaps,220);
})();

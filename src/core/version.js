
(()=>{
  const VERSION='V4.0';
  window.FORGEPATH_VERSION=VERSION;
  function stamp(){
    document.querySelectorAll('.brand span').forEach(el=>{if(/^V?\d/.test((el.textContent||'').trim()))el.textContent=VERSION});
    document.querySelectorAll('.v30-tag,.v351-build').forEach(el=>{const t=el.textContent||'';if(/V3\.[0-9.]+/.test(t))el.textContent=t.replace(/V3\.[0-9.]+/g,VERSION)});
  }
  const prevRender=window.render,prevNav=window.nav;
  if(typeof prevRender==='function')window.render=function(){const r=prevRender.apply(this,arguments);queueMicrotask(stamp);return r};
  if(typeof prevNav==='function')window.nav=function(){const r=prevNav.apply(this,arguments);queueMicrotask(stamp);return r};
  new MutationObserver(stamp).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  stamp();
})();

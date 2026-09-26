const DB_NAME = 'forgepath-v4';
const DB_VERSION = 1;
const STORE = 'app';
const KEY = 'state';
const FALLBACK_KEY = 'forgepath_v4_state';
const LEGACY_KEY = 'forgepath_state_v1';

function openDB(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

async function idbGet(){
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly');
    const req=tx.objectStore(STORE).get(KEY);
    req.onsuccess=()=>resolve(req.result || null);
    req.onerror=()=>reject(req.error);
    tx.oncomplete=()=>db.close();
  });
}

async function idbSet(value){
  const db=await openDB();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(value,KEY);
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}

function readJSON(key){
  try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}
}

export async function loadState(defaultState){
  let stored=null;
  try{stored=await idbGet()}catch{stored=readJSON(FALLBACK_KEY)}
  if(stored) return merge(defaultState,stored);

  const legacy=readJSON(LEGACY_KEY);
  if(legacy){
    const migrated=merge(defaultState,{
      profile: legacy.profile ? {...defaultState.profile,...legacy.profile} : defaultState.profile,
      history: Array.isArray(legacy.history)?legacy.history:[],
      xp: Number(legacy.xp||0),
      streak: Number(legacy.streak||0),
      migration:{from:'V3.12',at:new Date().toISOString()}
    });
    await saveState(migrated);
    return migrated;
  }
  return structuredClone(defaultState);
}

export async function saveState(state){
  const copy=structuredClone(state);
  try{await idbSet(copy)}catch{localStorage.setItem(FALLBACK_KEY,JSON.stringify(copy))}
}

function merge(base,extra){
  const out={...structuredClone(base),...extra};
  out.profile={...base.profile,...(extra.profile||{})};
  out.profile.levels={...base.profile.levels,...(extra.profile?.levels||{})};
  out.daily={...base.daily,...(extra.daily||{})};
  out.ui={...base.ui,...(extra.ui||{})};
  if(!Array.isArray(out.history)) out.history=[];
  return out;
}

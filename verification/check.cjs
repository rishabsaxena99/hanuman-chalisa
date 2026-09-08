// Deterministic logic checks. Does not substitute for browser or listening QA.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\ninitialize\(\);\s*$/, '');
function element(){return {children:[],style:{values:{},setProperty(k,v){this.values[k]=String(v)}},classList:{remove(){},add(){},toggle(){return false}},append(x){this.children.push(x)},replaceChildren(){this.children=[]},setAttribute(){},removeAttribute(){},addEventListener(){},focus(){},select(){},click(){},offsetTop:0,clientHeight:500,scrollTop:0,textContent:'',value:'',hidden:false};}
const elements=new Map();const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)};
Object.assign(get('audio'),{duration:585.508571,currentTime:0,readyState:1,paused:false,volume:.8,playbackRate:1,pause(){this.paused=true},play(){this.paused=false;return Promise.resolve()}});
const data=new Map();const context={assert,console,document:{getElementById:get,createElement:element,documentElement:element()},matchMedia:()=>({matches:false,addEventListener(){}}),window:{addEventListener(){}},performance:{now:()=>10000},localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},setTimeout:()=>0,clearTimeout(){},location:{protocol:'file:'},URL,Blob};
vm.createContext(context);vm.runInContext(source,context);
vm.runInContext(`
assert.equal(CHALISA.length,43);
assert.equal(TIMINGS.length,43);
assert.ok(CHALISA.every(v=>['devanagari','transliteration','meaning'].every(k=>typeof v[k]==='string'&&v[k].length>10)));
assert.ok(validateTimings(TIMINGS));
assert.equal(validateTimings(TIMINGS.slice(1)),false);
assert.equal(validateTimings(TIMINGS.map((t,i)=>i===3?{...t,start:0}:t)),false);
assert.equal(validateTimings(TIMINGS.map((t,i)=>i===0?{...t,end:NaN}:t)),false);
assert.equal(validateTimings(TIMINGS,500),false);
for(const length of [90,420,585.508571,720,1800]){audio.duration=length;usePlaceholders();assert.ok(validateTimings(timings,length));assert.ok(Math.abs(timings[42].end-length)<.001);for(let i=0;i<43;i++){assert.equal(findActive(timings[i].start),i);assert.equal(findActive((timings[i].start+timings[i].end)/2),i);}assert.equal(findActive(length+.1),-1);}
verseNodes=CHALISA.map(()=>document.createElement('button'));
audio.duration=585.508571;usePlaceholders();seekTo(1000);assert.equal(audio.currentTime,audio.duration);seekTo(-20);assert.equal(audio.currentTime,0);
seekTo(timings[22].start);assert.equal(active,22);seekTo(timings[3].start);assert.equal(active,3);
calStarts=[];completedTimings=null;audio.paused=false;
for(let i=0;i<43;i++){audio.currentTime=5+i*12;markVerse();}
assert.equal(calStarts.length,43);assert.ok(validateTimings(completedTimings,audio.duration));assert.equal(completedTimings[42].end,585.509);assert.equal(timingSource,'browser');
const saved=JSON.parse(localStorage.getItem(CONFIG.storageKey));assert.equal(saved.starts.length,43);assert.equal(saved.timings.length,43);
undoMark();assert.equal(calStarts.length,42);assert.equal(audio.currentTime,507);assert.equal(completedTimings,null);
audio.currentTime=510;markVerse();assert.equal(calStarts.length,43);assert.equal(completedTimings[42].start,510);
calStarts=[];completedTimings=null;readStored();assert.equal(calStarts.length,43);assert.equal(completedTimings.length,43);
restartCalibration();assert.equal(calStarts.length,0);assert.equal(audio.currentTime,0);assert.equal(audio.paused,true);
markVerse();assert.equal(calStarts.length,0);
audio.paused=false;audio.currentTime=20;markVerse();audio.currentTime=19;markVerse();assert.equal(calStarts.length,1);
silent=true;seekTo(300);assert.equal(previewTime,300);markVerse();assert.equal(calStarts.length,1);
// Regression: long-running motion must stay bounded and valid in every frame.
initialized=true;silent=false;audio.paused=false;audio.currentTime=120;
for(let i=0;i<1800;i++){renderPortrait(1/60);const v=portraitStage.style.values;assert.ok(Number(v['--portrait-scale'])>=1&&Number(v['--portrait-scale'])<=1.08);assert.ok(Number.isFinite(parseFloat(v['--portrait-y'])));assert.ok(Math.abs(parseFloat(v['--portrait-y']))<=CONFIG.portrait.floatPixels+.1);}
portraitPointer.x=.5;portraitPointer.y=.5;for(let i=0;i<60;i++)renderPortrait(1/60);
assert.ok(Math.abs(portraitDepth)<=CONFIG.portrait.depthDegrees);
const priorScale=CONFIG.portrait.baseScale;CONFIG.portrait.baseScale=100;renderPortrait(1/60);assert.equal(Number(portraitStage.style.values['--portrait-scale']),1.08);CONFIG.portrait.baseScale=priorScale;
reducedMotion.matches=true;renderPortrait(1/60);assert.equal(portraitStage.style.values['--portrait-scale'],'1');assert.equal(portraitStage.style.values['--portrait-y'],'0px');reducedMotion.matches=false;
console.log('PASS: 43 complete units; timing schema and 5 durations; all boundary/midpoint lookups; forward/backward/clamped seeking; 43-tap completion; undo/re-record; storage round-trip; paused/nonmonotonic/missing-audio guards; 1,800 animation frames; zoom cap; pointer depth bounds; reduced-motion reset.');
`,context);

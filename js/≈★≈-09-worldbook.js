/* ============ WhisperPhone World Book ============ */
(function(){
'use strict';

/* ── 注入样式 ── */
var style = document.createElement('style');
style.textContent = [
'.wb-panel{position:fixed;inset:0;z-index:610;background:#fff;opacity:0;pointer-events:none;transition:opacity 0.4s ease;overflow:hidden;display:flex;flex-direction:column;}',
'.wb-panel.active{opacity:1;pointer-events:auto;}',
'.wb-top{display:flex;align-items:center;gap:10px;padding:calc(env(safe-area-inset-top,20px) + 60px) 16px 10px;flex-shrink:0;position:relative;z-index:10;}',
'.wb-top-back{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;}',
'.wb-top-back:active{background:rgba(0,0,0,0.04);transform:scale(0.92);}',
'.wb-top-back svg{width:18px;height:18px;stroke:#555;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-top-title{flex:1;font-size:15px;font-weight:800;color:#3D3D40;letter-spacing:0.5px;display:flex;align-items:center;gap:6px;}',
'.wb-top-title .wb-title-star{font-size:10px;color:#ccc;}',
'.wb-top-sub{font-size:9px;font-weight:600;color:#ccc;letter-spacing:2px;margin-left:6px;}',
'.wb-top-actions{display:flex;gap:4px;}',
'.wb-top-btn{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;}',
'.wb-top-btn:active{background:rgba(0,0,0,0.04);transform:scale(0.92);}',
'.wb-top-btn svg{width:16px;height:16px;stroke:#999;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 16px 40px;}',
'.wb-scroll::-webkit-scrollbar{display:none;}',
'.wb-view{display:none;}',
'.wb-view.active{display:block;animation:wb-in 0.35s ease;}',
'@keyframes wb-in{from{opacity:0;}to{opacity:1;}}',
'.wb-stat{display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:14px;background:rgba(0,0,0,0.015);margin-bottom:16px;}',
'.wb-stat-num{font-size:22px;font-weight:900;color:#3D3D40;line-height:1;}',
'.wb-stat-label{font-size:9px;font-weight:600;color:#ccc;letter-spacing:1px;line-height:1.3;}',
'.wb-stat-line{width:1px;height:24px;background:rgba(0,0,0,0.06);margin:0 6px;}',
'.wb-create{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:16px;margin-bottom:10px;border:1.5px dashed rgba(0,0,0,0.08);cursor:pointer;transition:all 0.15s;color:#bbb;font-size:12px;font-weight:700;}',
'.wb-create:active{background:rgba(0,0,0,0.02);transform:scale(0.98);}',
'.wb-create svg{width:16px;height:16px;stroke:#ccc;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-bk{display:flex;align-items:stretch;gap:0;margin-bottom:8px;border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.15s;border:0.5px solid rgba(0,0,0,0.04);}',
'.wb-bk:active{transform:scale(0.98);border-color:rgba(0,0,0,0.08);}',
'.wb-bk-spine{width:6px;flex-shrink:0;background:linear-gradient(180deg,#d8d8d8,#c5c5c5);}',
'.wb-bk-body{flex:1;padding:14px 16px;background:linear-gradient(135deg,rgba(250,250,249,1),rgba(247,247,246,1));display:flex;flex-direction:column;gap:4px;min-width:0;}',
'.wb-bk-row1{display:flex;align-items:center;gap:8px;}',
'.wb-bk-name{font-size:14px;font-weight:800;color:#3D3D40;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:5px;}',
'.wb-bk-name .wb-bk-star{font-size:8px;color:#d0d0d0;flex-shrink:0;}',
'.wb-bk-cnt{padding:2px 8px;border-radius:20px;font-size:9px;font-weight:700;color:#b5b5b5;background:rgba(0,0,0,0.03);flex-shrink:0;}',
'.wb-bk-row2{display:flex;gap:4px;flex-wrap:wrap;}',
'.wb-bk-tag{font-size:8px;font-weight:600;color:#ccc;}',
'.wb-bk-arrow{width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(245,245,244,1);}',
'.wb-bk-arrow svg{width:14px;height:14px;stroke:#ccc;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-empty{text-align:center;padding:50px 20px;}',
'.wb-empty-icon{margin-bottom:12px;}',
'.wb-empty-icon svg{width:48px;height:48px;stroke:#ddd;fill:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-empty-text{font-size:12px;color:#ccc;font-weight:600;}',
'.wb-empty-hint{font-size:10px;color:#ddd;margin-top:4px;}',
'.wb-bk-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.03);}',
'.wb-bk-header-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#eaeaea,#e0e0e0);display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
'.wb-bk-header-icon svg{width:18px;height:18px;stroke:#aaa;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-bk-header-info{flex:1;min-width:0;}',
'.wb-bk-header-name{font-size:16px;font-weight:800;color:#3D3D40;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border:none;background:none;outline:none;width:100%;font-family:inherit;}',
'.wb-bk-header-meta{font-size:9px;font-weight:500;color:#ccc;margin-top:1px;}',
'.wb-ent{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:0.5px solid rgba(0,0,0,0.03);cursor:pointer;transition:all 0.15s;}',
'.wb-ent:active{opacity:0.7;}',
'.wb-ent:last-child{border-bottom:none;}',
'.wb-ent-status{width:4px;height:28px;border-radius:2px;flex-shrink:0;background:#e0e0e0;transition:background 0.2s;}',
'.wb-ent-status.on{background:#b5c8ab;}',
'.wb-ent-body{flex:1;min-width:0;}',
'.wb-ent-name{font-size:12px;font-weight:700;color:#3D3D40;}',
'.wb-ent-info{display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap;}',
'.wb-ent-kw{padding:1px 6px;border-radius:4px;font-size:8px;font-weight:600;color:#bbb;background:rgba(0,0,0,0.025);}',
'.wb-ent-pos{font-size:8px;font-weight:700;color:#d0d0d0;}',
'.wb-ent-right{display:flex;align-items:center;gap:6px;flex-shrink:0;}',
'.wb-ent-sw{width:34px;height:18px;border-radius:9px;background:#e5e5e5;cursor:pointer;position:relative;transition:background 0.2s;}',
'.wb-ent-sw.on{background:#b5c8ab;}',
'.wb-ent-sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.08);transition:transform 0.2s;}',
'.wb-ent-sw.on::after{transform:translateX(16px);}',
'.wb-ent-arrow svg{width:12px;height:12px;stroke:#d5d5d5;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}',
'.wb-ed-section{margin-bottom:16px;}',
'.wb-ed-section-title{font-size:8px;font-weight:800;color:#d0d0d0;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}',
'.wb-ed-card{background:rgba(248,248,247,0.6);border-radius:14px;padding:14px;border:0.5px solid rgba(0,0,0,0.04);}',
'.wb-ed-row{margin-bottom:10px;}',
'.wb-ed-row:last-child{margin-bottom:0;}',
'.wb-ed-lbl{font-size:9px;font-weight:700;color:#b5b5b5;margin-bottom:4px;letter-spacing:0.3px;}',
'.wb-ed-inp{width:100%;height:36px;border-radius:10px;padding:0 12px;border:0.5px solid rgba(0,0,0,0.06);background:#fff;font-size:12px;color:#333;font-weight:500;outline:none;transition:border-color 0.2s;font-family:inherit;}',
'.wb-ed-inp:focus{border-color:rgba(0,0,0,0.14);}',
'.wb-ed-txt{width:100%;min-height:130px;border-radius:10px;padding:10px 12px;border:0.5px solid rgba(0,0,0,0.06);background:#fff;font-size:11px;color:#333;font-weight:400;line-height:1.7;resize:vertical;outline:none;font-family:inherit;transition:border-color 0.2s;}',
'.wb-ed-txt:focus{border-color:rgba(0,0,0,0.14);}',
'.wb-ed-txt::placeholder{color:#ddd;}',
'.wb-pos-row{display:flex;gap:4px;}',
'.wb-pos-btn{flex:1;padding:8px 4px;border-radius:8px;font-size:9px;font-weight:700;color:#bbb;background:#f5f5f5;border:none;cursor:pointer;transition:all 0.15s;text-align:center;white-space:nowrap;}',
'.wb-pos-btn.active{background:#3D3D40;color:#fff;}',
'.wb-depth{display:flex;align-items:center;gap:8px;margin-top:10px;}',
'.wb-depth-label{font-size:10px;font-weight:600;color:#aaa;white-space:nowrap;}',
'.wb-depth-inp{width:50px;height:28px;border-radius:8px;border:0.5px solid rgba(0,0,0,0.06);background:#fff;padding:0 8px;font-size:12px;color:#555;font-weight:600;text-align:center;outline:none;-moz-appearance:textfield;}',
'.wb-depth-inp::-webkit-outer-spin-button,.wb-depth-inp::-webkit-inner-spin-button{-webkit-appearance:none;}',
'.wb-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px;}',
'.wb-chip{display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:20px;background:#f3f3f3;border:1px solid transparent;font-size:10px;font-weight:600;color:#aaa;cursor:pointer;transition:all 0.15s;}',
'.wb-chip.active{border-color:rgba(0,0,0,0.10);color:#666;background:#eee;}',
'.wb-chip-dot{width:5px;height:5px;border-radius:50%;background:#d5d5d5;}',
'.wb-chip.active .wb-chip-dot{background:#b5c8ab;}',
'.wb-ed-foot{display:flex;gap:8px;margin-top:20px;}',
'.wb-ed-fbtn{flex:1;padding:12px;border-radius:12px;border:none;font-size:11px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;font-family:inherit;}',
'.wb-ed-fbtn:active{transform:scale(0.97);}',
'.wb-ed-fbtn.save{background:#3D3D40;color:#fff;}',
'.wb-ed-fbtn.del{background:#f5f0f0;color:#c9a0a0;}',
'.wb-ed-fbtn svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}'
].join('\n');
document.head.appendChild(style);

/* ── 数据 ── */
var WB_STORE = 'whisperphone_worldbooks_v1';
var books = [];
var curBook = -1;
var curEntry = -1;
var panelEl = null;
var built = false;

function load(){ try{ books = JSON.parse(localStorage.getItem(WB_STORE)||'[]'); }catch(e){ books=[]; } }
function save(){ try{ localStorage.setItem(WB_STORE, JSON.stringify(books)); }catch(e){} }
function uid(){ return Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6); }
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function getContacts(){ try{ return JSON.parse(localStorage.getItem('wp_chat_contacts')||'[]'); }catch(e){ return []; } }

/* ── 构建面板 ── */
function buildPanel(){
  var el = document.createElement('div');
  el.className = 'wb-panel';
  el.innerHTML =
  '<div class="wb-top">'+
    '<div class="wb-top-back" id="wbBack"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></div>'+
    '<div class="wb-top-title" id="wbTopTitle"><span class="wb-title-star">★</span> 世界书</div>'+
    '<div class="wb-top-sub" id="wbTopSub">LORE</div>'+
    '<div class="wb-top-actions">'+
      '<div class="wb-top-btn" id="wbImport"><svg viewBox="0 0 24 24"><path d="M12 20V8"/><path d="M7 15l5 5 5-5"/><line x1="4" y1="4" x2="20" y2="4"/></svg></div>'+
      '<div class="wb-top-btn" id="wbExport"><svg viewBox="0 0 24 24"><path d="M12 4v12"/><path d="M7 9l5-5 5 5"/><path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"/></svg></div>'+
    '</div>'+
  '</div>'+
  '<div class="wb-scroll">'+
    '<div class="wb-view active" id="vList">'+
      '<div class="wb-stat" id="wbStat"></div>'+
      '<div class="wb-create" id="wbCreate"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>创建世界书</div>'+
      '<div id="wbBooks"></div>'+
    '</div>'+
    '<div class="wb-view" id="vBook">'+
      '<div class="wb-bk-header">'+
        '<div class="wb-bk-header-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>'+
        '<div class="wb-bk-header-info"><input class="wb-bk-header-name" id="wbBkName" placeholder="书名..."><div class="wb-bk-header-meta" id="wbBkMeta"></div></div>'+
        '<div class="wb-top-btn" id="wbBkDel" style="background:#f5f0f0;border-radius:10px;"><svg viewBox="0 0 24 24" style="stroke:#c9a0a0;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></div>'+
      '</div>'+
      '<div class="wb-create" id="wbAddEntry"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>添加条目</div>'+
      '<div id="wbEntries"></div>'+
    '</div>'+
    '<div class="wb-view" id="vEdit"><div id="wbEditor"></div></div>'+
  '</div>';

  document.body.appendChild(el);
  el.querySelector('#wbBack').addEventListener('click', goBack);
  el.querySelector('#wbCreate').addEventListener('click', createBook);
  el.querySelector('#wbImport').addEventListener('click', importBook);
  el.querySelector('#wbExport').addEventListener('click', exportBooks);
  el.querySelector('#wbAddEntry').addEventListener('click', addEntry);
  el.querySelector('#wbBkDel').addEventListener('click', deleteBook);
  el.querySelector('#wbBkName').addEventListener('input', function(){
    if(curBook>=0 && books[curBook]){ books[curBook].name=this.value.trim()||'未命名'; save(); }
  });
  return el;
}

function showView(id){
  panelEl.querySelectorAll('.wb-view').forEach(function(v){v.classList.remove('active');});
  panelEl.querySelector('#v'+id).classList.add('active');
  var title = panelEl.querySelector('#wbTopTitle');
  var sub = panelEl.querySelector('#wbTopSub');
  var actions = panelEl.querySelector('.wb-top-actions');
  if(id==='List'){ title.innerHTML='<span class="wb-title-star">★</span> 世界书'; sub.textContent='LORE'; sub.style.display=''; actions.style.display=''; }
  else if(id==='Book'){ title.innerHTML='<span class="wb-title-star">★</span> '+(books[curBook]?esc(books[curBook].name):''); sub.textContent='ENTRIES'; sub.style.display=''; actions.style.display='none'; }
  else if(id==='Edit'){ title.innerHTML='<span class="wb-title-star">★</span> 编辑条目'; sub.textContent=''; sub.style.display='none'; actions.style.display='none'; }
}

function goBack(){
  var a = panelEl.querySelector('.wb-view.active');
  if(a && a.id==='vEdit'){ showView('Book'); renderEntries(); }
  else if(a && a.id==='vBook'){ curBook=-1; showView('List'); renderBooks(); }
  else{ panelEl.classList.remove('active'); }
}

/* ── 书列表 ── */
function renderBooks(){
  var totalEntries = 0;
  books.forEach(function(b){ totalEntries += (b.entries||[]).length; });
  panelEl.querySelector('#wbStat').innerHTML =
    '<div class="wb-stat-num">'+books.length+'</div>'+
    '<div class="wb-stat-label">世界书<br>BOOKS</div>'+
    '<div class="wb-stat-line"></div>'+
    '<div class="wb-stat-num">'+totalEntries+'</div>'+
    '<div class="wb-stat-label">条目<br>ENTRIES</div>';

  var list = panelEl.querySelector('#wbBooks');
  if(books.length===0){
    list.innerHTML =
      '<div class="wb-empty">'+
        '<div class="wb-empty-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>'+
        '<div class="wb-empty-text">暂无世界书</div>'+
        '<div class="wb-empty-hint">创建或导入一个开始</div>'+
      '</div>';
    return;
  }
  var h='';
  books.forEach(function(b,i){
    var cnt = (b.entries||[]).length;
    var enabled = (b.entries||[]).filter(function(e){return e.enabled;}).length;
    var kws = [];
    (b.entries||[]).forEach(function(e){ (e.keywords||[]).slice(0,2).forEach(function(k){ if(kws.length<4) kws.push(k); }); });
    var kwText = kws.length>0 ? kws.map(function(k){return esc(k);}).join(' · ') : '无关键词';
    h +=
      '<div class="wb-bk" data-idx="'+i+'">'+
        '<div class="wb-bk-spine"></div>'+
        '<div class="wb-bk-body">'+
          '<div class="wb-bk-row1">'+
            '<div class="wb-bk-name"><span class="wb-bk-star">★</span>'+esc(b.name)+'</div>'+
            '<div class="wb-bk-cnt">'+enabled+'/'+cnt+'</div>'+
          '</div>'+
          '<div class="wb-bk-row2"><div class="wb-bk-tag">'+kwText+'</div></div>'+
        '</div>'+
        '<div class="wb-bk-arrow"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>'+
      '</div>';
  });
  list.innerHTML = h;
  list.querySelectorAll('.wb-bk').forEach(function(el){
    el.addEventListener('click', function(){ curBook=parseInt(el.dataset.idx); openBook(); });
  });
}

function openBook(){
  var b=books[curBook]; if(!b) return;
  panelEl.querySelector('#wbBkName').value=b.name;
  showView('Book');
  renderEntries();
}

/* ── 条目列表 ── */
function renderEntries(){
  var b=books[curBook];
  panelEl.querySelector('#wbBkMeta').textContent = (b.entries||[]).length+' 个条目';
  var list = panelEl.querySelector('#wbEntries');
  if(!b.entries || b.entries.length===0){
    list.innerHTML =
      '<div class="wb-empty">'+
        '<div class="wb-empty-text">暂无条目</div>'+
        '<div class="wb-empty-hint">添加一个开始构建世界</div>'+
      '</div>';
    return;
  }
  var posMap = {before_system:'系统前',after_system:'系统后',before_chat:'对话前',at_depth:'深度'};
  var h='';
  b.entries.forEach(function(e,i){
    var kws = (e.keywords||[]).slice(0,3).map(function(k){return '<span class="wb-ent-kw">'+esc(k)+'</span>';}).join('');
    var posText = (posMap[e.position]||'系统后') + (e.position==='at_depth'?' D'+(e.depth||4):'');
    h +=
      '<div class="wb-ent" data-idx="'+i+'">'+
        '<div class="wb-ent-status'+(e.enabled?' on':'')+'"></div>'+
        '<div class="wb-ent-body">'+
          '<div class="wb-ent-name">'+esc(e.name||'未命名')+'</div>'+
          '<div class="wb-ent-info">'+kws+'<span class="wb-ent-pos">'+posText+'</span></div>'+
        '</div>'+
        '<div class="wb-ent-right">'+
          '<div class="wb-ent-sw'+(e.enabled?' on':'')+'" data-eidx="'+i+'"></div>'+
          '<div class="wb-ent-arrow"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>'+
        '</div>'+
      '</div>';
  });
  list.innerHTML = h;
  list.querySelectorAll('.wb-ent').forEach(function(el){
    el.addEventListener('click', function(ev){
      if(ev.target.closest('.wb-ent-sw')) return;
      curEntry=parseInt(el.dataset.idx); openEditor();
    });
  });
  list.querySelectorAll('.wb-ent-sw').forEach(function(sw){
    sw.addEventListener('click', function(ev){
      ev.stopPropagation();
      var idx=parseInt(sw.dataset.eidx);
      b.entries[idx].enabled = !b.entries[idx].enabled;
      save(); renderEntries();
    });
  });
}

/* ── 编辑器 ── */
function openEditor(){
  var b=books[curBook], e=b.entries[curEntry]; if(!e) return;
  showView('Edit');
  var contacts = getContacts();
  var chips = '';
  if(contacts.length>0){
    contacts.forEach(function(c){
      var active = (e.contacts||[]).indexOf(c.id)>=0;
      chips += '<div class="wb-chip'+(active?' active':'')+'" data-cid="'+c.id+'"><div class="wb-chip-dot"></div>'+esc(c.name)+'</div>';
    });
  } else {
    chips = '<div style="font-size:10px;color:#d5d5d5;">暂无联系人</div>';
  }
  var positions = [{key:'before_system',label:'系统前'},{key:'after_system',label:'系统后'},{key:'before_chat',label:'对话前'},{key:'at_depth',label:'深度注入'}];
  var posHtml = '';
  positions.forEach(function(p){
    posHtml += '<div class="wb-pos-btn'+(e.position===p.key?' active':'')+'" data-pos="'+p.key+'">'+p.label+'</div>';
  });
  panelEl.querySelector('#wbEditor').innerHTML =
    '<div class="wb-ed-section">'+
      '<div class="wb-ed-section-title">基本信息</div>'+
      '<div class="wb-ed-card">'+
        '<div class="wb-ed-row"><div class="wb-ed-lbl">名称</div><input class="wb-ed-inp" id="weN" value="'+esc(e.name||'')+'"></div>'+
        '<div class="wb-ed-row"><div class="wb-ed-lbl">关键词（逗号分隔）</div><input class="wb-ed-inp" id="weK" value="'+esc((e.keywords||[]).join(', '))+'"></div>'+
      '</div>'+
    '</div>'+
    '<div class="wb-ed-section">'+
      '<div class="wb-ed-section-title">内容</div>'+
      '<div class="wb-ed-card">'+
        '<textarea class="wb-ed-txt" id="weC" placeholder="输入世界书条目内容...">'+esc(e.content||'')+'</textarea>'+
      '</div>'+
    '</div>'+
    '<div class="wb-ed-section">'+
      '<div class="wb-ed-section-title">注入设置</div>'+
      '<div class="wb-ed-card">'+
        '<div class="wb-ed-lbl">位置</div>'+
        '<div class="wb-pos-row" id="wePosRow">'+posHtml+'</div>'+
        '<div class="wb-depth" id="weDepth" style="display:'+(e.position==='at_depth'?'flex':'none')+'">'+
          '<div class="wb-depth-label">深度</div>'+
          '<input class="wb-depth-inp" id="weD" type="number" min="0" max="100" value="'+(e.depth||4)+'">'+
          '<div class="wb-depth-label" style="color:#d0d0d0;">条消息前</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="wb-ed-section">'+
      '<div class="wb-ed-section-title">关联联系人 <span style="font-weight:500;color:#d5d5d5;letter-spacing:0;font-size:8px;">空 = 全部生效</span></div>'+
      '<div class="wb-ed-card"><div class="wb-chips" id="weChips">'+chips+'</div></div>'+
    '</div>'+
    '<div class="wb-ed-foot">'+
      '<div class="wb-ed-fbtn save" id="weSave"><svg viewBox="0 0 24 24"><path d="M6 12l4 4 8-8"/></svg>保存</div>'+
      '<div class="wb-ed-fbtn del" id="weDel"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>删除</div>'+
    '</div>';
  panelEl.querySelectorAll('#wePosRow .wb-pos-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      panelEl.querySelectorAll('#wePosRow .wb-pos-btn').forEach(function(b2){b2.classList.remove('active');});
      btn.classList.add('active');
      panelEl.querySelector('#weDepth').style.display = btn.dataset.pos==='at_depth'?'flex':'none';
    });
  });
  panelEl.querySelectorAll('#weChips .wb-chip').forEach(function(chip){
    chip.addEventListener('click', function(){ chip.classList.toggle('active'); });
  });
  panelEl.querySelector('#weSave').addEventListener('click', saveEntry);
  panelEl.querySelector('#weDel').addEventListener('click', deleteEntry);
}

function saveEntry(){
  var b=books[curBook], e=b.entries[curEntry];
  e.name = panelEl.querySelector('#weN').value.trim()||'未命名';
  e.keywords = panelEl.querySelector('#weK').value.split(/[,，]/).map(function(s){return s.trim();}).filter(function(s){return s;});
  e.content = panelEl.querySelector('#weC').value;
  var ap = panelEl.querySelector('#wePosRow .wb-pos-btn.active');
  e.position = ap?ap.dataset.pos:'after_system';
  e.depth = parseInt(panelEl.querySelector('#weD').value)||4;
  e.contacts = [];
  panelEl.querySelectorAll('#weChips .wb-chip.active').forEach(function(c){ e.contacts.push(c.dataset.cid); });
  save(); goBack();
}
function deleteEntry(){ books[curBook].entries.splice(curEntry,1); curEntry=-1; save(); goBack(); }

/* ── CRUD ── */
function createBook(){ books.push({id:uid(),name:'新世界书',entries:[]}); save(); renderBooks(); }
function deleteBook(){ if(!confirm('删除？')) return; books.splice(curBook,1); curBook=-1; save(); showView('List'); renderBooks(); }
function addEntry(){ books[curBook].entries.push({id:uid(),name:'新条目',keywords:[],content:'',position:'after_system',depth:4,enabled:true,contacts:[]}); save(); renderEntries(); }

/* ── 导入/导出 ── */
function importBook(){
  var inp=document.createElement('input'); inp.type='file'; inp.accept='*/*';
  inp.onchange=function(){
    var f=inp.files&&inp.files[0]; if(!f) return;
    var r=new FileReader();
    r.onload=function(){
      var text = r.result;
      var imported = false;

      /* 1. 先尝试 JSON 解析 */
      try{
        var data=JSON.parse(text);

        /* SillyTavern 格式：entries 是对象 */
        if(data.entries && typeof data.entries==='object' && !Array.isArray(data.entries)){
          var book={id:uid(),name:data.name||f.name.replace(/\.[^.]+$/,''),entries:[]};
          Object.values(data.entries).forEach(function(e){
            var pm={0:'before_system',1:'after_system',2:'before_chat',3:'at_depth',4:'at_depth'};
            book.entries.push({id:uid(),name:e.comment||e.uid||'条目',keywords:e.key||e.keys||[],content:e.content||'',position:pm[e.position]||'after_system',depth:e.depth||4,enabled:!e.disable,contacts:[]});
          });
          books.push(book);
          imported = true;
        }
        /* 自有格式：数组 */
        else if(Array.isArray(data)){
          data.forEach(function(b){
            b.id = b.id || uid();
            books.push(b);
          });
          imported = true;
        }
        /* 自有格式：单本 */
        else if(data.name && Array.isArray(data.entries)){
          data.id = data.id || uid();
          books.push(data);
          imported = true;
        }
        /* 有 character_book 字段（TavernCard v2） */
        else if(data.data && data.data.character_book && data.data.character_book.entries){
          var cb = data.data.character_book;
          var book2={id:uid(),name:cb.name||data.data.name||f.name.replace(/\.[^.]+$/,''),entries:[]};
          var cbEntries = cb.entries;
          var arr = Array.isArray(cbEntries) ? cbEntries : Object.values(cbEntries);
          arr.forEach(function(e){
            var pm={0:'before_system',1:'after_system',2:'before_chat',3:'at_depth',4:'at_depth'};
            book2.entries.push({id:uid(),name:e.comment||e.name||'条目',keywords:e.key||e.keys||[],content:e.content||'',position:pm[e.position]||'after_system',depth:e.depth||4,enabled:!e.disable,contacts:[]});
          });
          books.push(book2);
          imported = true;
        }
      }catch(e){}

      /* 2. JSON 解析失败或不认识的格式 → 当纯文本导入 */
      if(!imported){
        text = text.trim();
        if(text){
          var bookName = f.name.replace(/\.[^.]+$/,'') || '导入的世界书';
          var entries = [];

          /* 尝试按 --- 或 === 分段 */
          var sections = text.split(/\n\s*(?:---+|===+)\s*\n/);
          if(sections.length <= 1){
            /* 尝试按连续空行分段 */
            sections = text.split(/\n\s*\n\s*\n/);
          }
          if(sections.length <= 1){
            /* 整个文件当一个条目 */
            sections = [text];
          }

          sections.forEach(function(sec, idx){
            sec = sec.trim();
            if(!sec) return;
            /* 第一行当名称，其余当内容 */
            var lines = sec.split('\n');
            var name = lines[0].replace(/^#+\s*/, '').trim().substring(0, 50);
            var content = lines.length > 1 ? lines.slice(1).join('\n').trim() : sec;
            /* 从名称里提取关键词 */
            var kws = name.split(/[,，、\s]+/).filter(function(k){ return k.length > 0 && k.length < 20; });

            entries.push({
              id: uid(),
              name: name || '条目 '+(idx+1),
              keywords: kws.length > 0 ? kws : [],
              content: content,
              position: 'after_system',
              depth: 4,
              enabled: true,
              contacts: []
            });
          });

          books.push({id:uid(), name:bookName, entries:entries});
          imported = true;
        }
      }

      if(imported){
        save(); renderBooks();
      } else {
        alert('无法解析该文件');
      }
    };
    r.readAsText(f);
  };
  inp.click();
}
function exportBooks(){
  if(!books.length) return;
  var blob=new Blob([JSON.stringify(books,null,2)],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='worldbooks_'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'.json';
  a.click(); URL.revokeObjectURL(a.href);
}

/* ── 打开/关闭 ── */
function open(){
  if(!built){ built=true; load(); panelEl=buildPanel(); }
  load(); renderBooks(); showView('List'); curBook=-1; curEntry=-1;
  requestAnimationFrame(function(){ panelEl.classList.add('active'); });
}
function close(){ if(panelEl) panelEl.classList.remove('active'); }

window.openWorldBook = open;
window.closeWorldBook = close;

/* ── 对外：匹配世界书条目（给 chat 用） ── */
window._wpGetWorldBookEntries = function(contactId, messages){
  load();
  var results=[], fullText=messages.map(function(m){return m.text||'';}).join(' ').toLowerCase();

  /* 读取该联系人在设置里勾选的世界书 */
  var enabledBookIds = null;
  try{
    var contacts = JSON.parse(localStorage.getItem('wp_chat_contacts')||'[]');
    var c = contacts.find(function(x){return x.id === contactId;});
    if(c && c.settings && Array.isArray(c.settings.worldBooks)){
      enabledBookIds = c.settings.worldBooks;
    }
  }catch(e){}

  books.forEach(function(b){
    /* 书是否被该联系人勾选（从未设置过 = 全部视为勾选） */
    var bookChecked = (enabledBookIds === null) || (enabledBookIds.indexOf(b.id) >= 0);
    (b.entries||[]).forEach(function(e){
      if(!e.enabled) return;

      var hasContactList = e.contacts && e.contacts.length > 0;
      var boundToContact = hasContactList && e.contacts.indexOf(contactId) >= 0;

      /* 条目限定了联系人范围但不含当前联系人 → 跳过 */
      if(hasContactList && !boundToContact) return;

      /* 生效条件：书被勾选 或 条目直接绑定到当前联系人，任一成立即生效 */
      if(!bookChecked && !boundToContact) return;

      /* 条目直接绑定了当前联系人 → 常驻注入，忽略关键词 */
      if(boundToContact){ results.push(e); return; }

      /* 否则按关键词匹配；无关键词 = 常驻注入 */
      if(!e.keywords || e.keywords.length === 0){ results.push(e); return; }
      if(e.keywords.some(function(k){return fullText.indexOf(k.toLowerCase())>=0;})) results.push(e);
    });
  });
  return results;
};

/* ── 桌面图标点击入口 ── */
document.addEventListener('click', function(e){
  if(document.body.classList.contains('edit-mode')) return;
  var app = e.target.closest('.g-item.app[data-id="a8"]');
  if(app) open();
});

})();

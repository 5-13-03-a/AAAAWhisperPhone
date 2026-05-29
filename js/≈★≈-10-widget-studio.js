/* ============ WhisperPhone Widget Studio Logic ============ */
(function(){
'use strict';

var COLS = 4;
var ROWS = 6;
var gridState = [];
var templates = {};
var built = false;
var studioEl = null;

function initGridState(){
    gridState = [];
    for(var i = 0; i < COLS * ROWS; i++) gridState.push(0);
}

var defaultTemplates = {
    capsuleSteps: {
        w: 2, h: 1,
        html: '<div class="ws-capsule" style="padding:8px 12px;"><div class="ws-capsule-pill" style="height:26px;padding:0 10px;"><i class="fa-solid fa-shoe-prints" style="font-size:9px;"></i><span class="ws-capsule-pill-text" style="font-size:10px;">8,421</span></div><div class="ws-capsule-body"><div class="ws-capsule-title" style="font-size:10px;">今日步数</div></div></div>'
    },
    vinylMood: {
        w: 2, h: 1,
        html: '<div class="ws-vinyl" style="padding:8px 12px;"><div class="ws-vinyl-disc" style="width:32px;height:32px;"></div><div class="ws-vinyl-info"><div class="ws-vinyl-title" style="font-size:10px;">平静</div><div class="ws-vinyl-sub">已记录 3 天</div></div></div>'
    },
    vinylClock: {
        w: 4, h: 1,
        html: '<div class="ws-vinyl" style="padding:8px 14px;"><div class="ws-vinyl-disc" style="width:36px;height:36px;"></div><div class="ws-vinyl-info"><div class="ws-vinyl-title">'+formatTime()+'</div><div class="ws-vinyl-sub">WhisperPhone · 持续旋转中</div></div></div>'
    },
    capsuleWeather: {
        w: 4, h: 1,
        html: '<div class="ws-capsule" style="padding:8px 14px;"><div class="ws-capsule-pill" style="height:30px;"><i class="fa-solid fa-cloud"></i><span class="ws-capsule-pill-text">13°C</span></div><div class="ws-capsule-body"><div class="ws-capsule-title">SEOUL · 多云转晴</div><div class="ws-capsule-sub">适宜出行 · 湿度 62%</div></div></div>'
    },
    vinylQuote: {
        w: 4, h: 1,
        html: '<div class="ws-vinyl-capsule" style="padding:8px 12px;"><div class="ws-vc-disc" style="width:36px;height:36px;"></div><div class="ws-vc-capsules" style="gap:4px;"><div class="ws-vc-pill" style="height:22px;"><div class="ws-vc-pill-dot"></div><span class="ws-vc-pill-text">任由潮湿的缺口生出苔花的旺盛</span></div><div class="ws-vc-pill" style="height:22px;"><div class="ws-vc-pill-dot" style="background:#555;"></div><span class="ws-vc-pill-text">—— 《苔花纪事》</span></div></div></div>'
    }
};

function formatTime(){
    var d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function buildHTML(){
    return ''+'<div class="ws-header">'+
        '<div class="ws-header-left">'+
            '<div class="ws-back" data-action="ws-back"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></div>'+
            '<div class="ws-title">组件工坊</div>'+
        '</div>'+
        '<button class="ws-import-btn" data-action="ws-import"><i class="fa-solid fa-plus"></i> 导入组件</button>'+
    '</div>'+
    '<div class="ws-main">'+
        '<div class="ws-workspace" id="wsWorkspace">'+
            '<div class="ws-workspace-header">'+
                '<div class="ws-section-title">桌面预览</div>'+
                '<button class="ws-collapse-btn" data-action="ws-collapse"><span>收起</span><svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg></button>'+
            '</div>'+
            '<div class="ws-canvas">'+
                '<div class="ws-grid" id="wsGrid"></div>'+
            '</div>'+
        '</div>'+
        '<div class="ws-workspace-fade"></div>'+
        '<div class="ws-expand-bar" id="wsExpandBar" data-action="ws-expand"><span>展开桌面预览 ▾</span></div>'+'<div class="ws-delete-zone">拖到此处删除</div>'+
        '<div class="ws-gallery" id="wsGallery">'+
            '<div class="ws-card">'+
                '<div class="ws-card-header"><div class="ws-card-info"><h3>黑胶时钟</h3><p>规格: 4x2 横条· 唱片</p></div><button class="ws-add-btn" data-add="vinylClock">添加</button></div>'+
                '<div class="ws-render"><div class="ws-vinyl"><div class="ws-vinyl-disc"></div><div class="ws-vinyl-info"><div class="ws-vinyl-title" id="wsClockDisplay">'+formatTime()+'</div><div class="ws-vinyl-sub">WhisperPhone · 持续旋转中</div><div class="ws-vinyl-bar"><div class="ws-vinyl-bar-fill"></div></div></div></div></div>'+
            '</div>'+
            '<div class="ws-card">'+
                '<div class="ws-card-header"><div class="ws-card-info"><h3>胶囊天气</h3><p>规格: 4x2 横条 · 胶囊</p></div><button class="ws-add-btn" data-add="capsuleWeather">添加</button></div>'+
                '<div class="ws-render"><div class="ws-capsule"><div class="ws-capsule-pill"><i class="fa-solid fa-cloud"></i><span class="ws-capsule-pill-text">13°C</span></div><div class="ws-capsule-body"><div class="ws-capsule-title">SEOUL · 多云转晴</div><div class="ws-capsule-sub">适宜出行 · 湿度 62%</div></div></div></div>'+
            '</div>'+
            '<div class="ws-card">'+
                '<div class="ws-card-header"><div class="ws-card-info"><h3>全息物语</h3><p>规格: 4x2 横条 · 混合</p></div><button class="ws-add-btn" data-add="vinylQuote">添加</button></div>'+
                '<div class="ws-render"><div class="ws-vinyl-capsule"><div class="ws-vc-disc"></div><div class="ws-vc-capsules"><div class="ws-vc-pill"><div class="ws-vc-pill-dot"></div><span class="ws-vc-pill-text">任由潮湿的缺口生出苔花的旺盛</span></div><div class="ws-vc-pill"><div class="ws-vc-pill-dot" style="background:#555;"></div><span class="ws-vc-pill-text">—— 《苔花纪事》</span></div></div></div></div>'+
            '</div>'+'<div class="ws-card">'+
            '<div class="ws-card">'+
                '<div class="ws-card-header"><div class="ws-card-info"><h3>胶囊步数</h3><p>规格: 2x1 小方块 · 胶囊</p></div><button class="ws-add-btn" data-add="capsuleSteps">添加</button></div>'+
                '<div style="width:55%;"><div class="ws-render" style="height:60px;"><div class="ws-capsule" style="padding:8px 12px;"><div class="ws-capsule-pill" style="height:26px;padding:0 10px;"><i class="fa-solid fa-shoe-prints" style="font-size:9px;"></i><span class="ws-capsule-pill-text" style="font-size:10px;">8,421</span></div><div class="ws-capsule-body"><div class="ws-capsule-title" style="font-size:10px;">今日步数</div></div></div></div></div>'+
            '</div>'+'<div class="ws-card">'+
                '<div class="ws-card-header"><div class="ws-card-info"><h3>黑胶心情</h3><p>规格: 2x1 小方块 · 唱片</p></div><button class="ws-add-btn" data-add="vinylMood">添加</button></div>'+
                '<div style="width:55%;"><div class="ws-render" style="height:60px;"><div class="ws-vinyl" style="padding:8px 12px;"><div class="ws-vinyl-disc" style="width:32px;height:32px;"></div><div class="ws-vinyl-info"><div class="ws-vinyl-title" style="font-size:10px;">平静</div><div class="ws-vinyl-sub">已记录 3 天</div></div></div></div></div>'+
            '</div>'+
        '</div>'+
    '</div>'+
    '<div class="ws-modal-overlay" id="wsModal">'+
        '<div class="ws-modal">'+
            '<div class="ws-modal-header"><h2>导入自定义组件</h2><button class="ws-modal-close" data-action="ws-modal-close">&times;</button></div>'+
            '<div class="ws-row-group">'+
                '<div class="ws-input-group"><label>组件名称</label><input type="text" class="ws-input-field" id="wsCustomName" placeholder="例如：极简时钟"></div>'+
                '<div class="ws-input-group"><label>尺寸规格</label><select class="ws-input-field" id="wsCustomSize"><option value="4x2">大横条 (4x2)</option><option value="4x1">小横条 (4x1)</option><option value="2x2">大方块 (2x2)</option><option value="2x1">小方块 (2x1)</option></select></div>'+
            '</div>'+
            '<div class="ws-input-group"><label>HTML 结构</label><textarea class="ws-input-field" id="wsCustomHTML" placeholder="<div class=\'my-widget\'>...</div>"></textarea></div>'+
            '<div class="ws-input-group"><label>CSS 样式</label><textarea class="ws-input-field" id="wsCustomCSS" placeholder=".my-widget { ... }"></textarea></div>'+
            '<button class="ws-submit-btn" data-action="ws-submit">编译并导入工坊</button>'+
        '</div>'+
    '</div>';
}

function ensure(){
    if(built) return;
    built = true;
    templates = JSON.parse(JSON.stringify(defaultTemplates));
    initGridState();
    studioEl = document.createElement('div');
    studioEl.className = 'ws-overlay';
    studioEl.id = 'wsOverlay';
    studioEl.innerHTML = buildHTML();
    document.body.appendChild(studioEl);
    bindEvents();
    initDesktopGrid();
}

function initDesktopGrid(){
    var grid = studioEl.querySelector('#wsGrid');
    grid.innerHTML = '';
    for(var r = 0; r < ROWS; r++){
        for(var c = 0; c < COLS; c++){
            var slot = document.createElement('div');
            slot.className = 'ws-grid-slot';
            slot.dataset.col = c;
            slot.dataset.row = r;
            slot.style.left = (c * 95) + 'px';
            slot.style.top = (r * 101) + 'px';
            grid.appendChild(slot);
        }
    }
}

var dragWidget = null;
var dragStartX = 0, dragStartY = 0;
var dragLongTimer = null;
var isDragMode = false;

function bindEvents(){
    studioEl.addEventListener('click', function(e){
        if(isDragMode) return;
        var action = e.target.closest('[data-action]');
        if(action){
            var a = action.dataset.action;
            if(a === 'ws-back') close();
            if(a === 'ws-collapse'){
                studioEl.querySelector('#wsWorkspace').classList.add('collapsed');
            }
            if(a === 'ws-expand'){
                studioEl.querySelector('#wsWorkspace').classList.remove('collapsed');
            }
            if(a === 'ws-import'){
                studioEl.querySelector('#wsModal').classList.add('show');
            }
            if(a === 'ws-modal-close'){
                studioEl.querySelector('#wsModal').classList.remove('show');
            }
            if(a === 'ws-submit') submitCustom();
        }
        var addBtn = e.target.closest('[data-add]');
        if(addBtn){
            var type = addBtn.dataset.add;
            addWidgetToDesktop(type);
            addWidgetToHome(type);
        }
    });

    /* 长按拖动删除 */
    var canvas = studioEl.querySelector('.ws-canvas');
    canvas.addEventListener('pointerdown', function(e){
        var widget = e.target.closest('.ws-desktop-widget');
        if(!widget) return;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragLongTimer = setTimeout(function(){
            if(navigator.vibrate) navigator.vibrate(10);
            startWidgetDrag(widget, e);
        }, 400);
    });
    canvas.addEventListener('pointermove', function(e){
        if(dragLongTimer){
            if(Math.abs(e.clientX - dragStartX) > 8 || Math.abs(e.clientY - dragStartY) > 8){
                clearTimeout(dragLongTimer);
                dragLongTimer = null;
            }
        }
        if(!isDragMode || !dragWidget) return;
        e.preventDefault();
        var canvasRect = canvas.getBoundingClientRect();
        dragWidget.style.position = 'fixed';
        dragWidget.style.left = (e.clientX - 40) + 'px';
        dragWidget.style.top = (e.clientY - 30) + 'px';
        dragWidget.style.width = '80px';
        dragWidget.style.height = '60px';
        dragWidget.style.zIndex = '100';
        dragWidget.style.opacity = '0.8';
        var delZone = studioEl.querySelector('.ws-delete-zone');
        if(delZone){
            var zoneRect = delZone.getBoundingClientRect();
            var inZone = e.clientX >= zoneRect.left && e.clientX <= zoneRect.right && e.clientY >= zoneRect.top && e.clientY <= zoneRect.bottom;
            delZone.classList.toggle('hover', inZone);
        }
    });
    canvas.addEventListener('pointerup', function(e){
        if(dragLongTimer){ clearTimeout(dragLongTimer); dragLongTimer = null; }
        if(!isDragMode || !dragWidget) return;
        var delZone = studioEl.querySelector('.ws-delete-zone');
        if(delZone && delZone.classList.contains('hover')){
            var col = parseInt(dragWidget.dataset.col);
            var row = parseInt(dragWidget.dataset.row);
            var w = parseInt(dragWidget.dataset.w);
            var h = parseInt(dragWidget.dataset.h);
            dragWidget.remove();
            setGridOccupied(col, row, w, h, false);
        } else {
            dragWidget.style.position = '';
            dragWidget.style.left = '';
            dragWidget.style.top = '';
            dragWidget.style.width = '';
            dragWidget.style.height = '';
            dragWidget.style.zIndex = '';
            dragWidget.style.opacity = '';
        }
        endWidgetDrag();
    });
    canvas.addEventListener('pointercancel', function(){
        if(dragLongTimer){ clearTimeout(dragLongTimer); dragLongTimer = null; }
        if(isDragMode) endWidgetDrag();
    });
}

function startWidgetDrag(widget, e){
    isDragMode = true;
    dragWidget = widget;
    var delZone = studioEl.querySelector('.ws-delete-zone');
    if(delZone) delZone.classList.add('show');
}

function endWidgetDrag(){
    isDragMode = false;
    dragWidget = null;
    var delZone = studioEl.querySelector('.ws-delete-zone');
    if(delZone){ delZone.classList.remove('show'); delZone.classList.remove('hover'); }
}

function findEmptySpace(w, h){
    for(var r = 0; r <= ROWS - h; r++){
        for(var c = 0; c <= COLS - w; c++){
            var canPlace = true;
            for(var dh = 0; dh < h; dh++){
                for(var dw = 0; dw < w; dw++){
                    if(gridState[(r + dh) * COLS + (c + dw)] !== 0){ canPlace = false; break; }
                }
                if(!canPlace) break;
            }
            if(canPlace) return { col: c, row: r };
        }
    }
    return null;
}

function setGridOccupied(col, row, w, h, occupied){
    for(var dh = 0; dh < h; dh++){
        for(var dw = 0; dw < w; dw++){
            var cc = col + dw, rr = row + dh;
            gridState[rr * COLS + cc] = occupied ? 1 : 0;var slot = studioEl.querySelector('.ws-grid-slot[data-col="'+cc+'"][data-row="'+rr+'"]');
            if(slot) slot.style.opacity = occupied ? '0' : '1';
        }
    }
}

function addWidgetToDesktop(type){
    var t = templates[type];
    if(!t) return;
    var space = findEmptySpace(t.w, t.h);
    if(!space){ alert('桌面空间不足！'); return; }

    var grid = studioEl.querySelector('#wsGrid');
    var wrapper = document.createElement('div');
    wrapper.className = 'ws-render ws-desktop-widget';
    wrapper.style.position = 'absolute';
    wrapper.style.left = (space.col * 95) + 'px';
    wrapper.style.top = (space.row * 101) + 'px';
    wrapper.style.width = (t.w * 95 - 41) + 'px';
    wrapper.style.height = (t.h * 101 - 10) + 'px';
    wrapper.dataset.col = space.col;
    wrapper.dataset.row = space.row;
    wrapper.dataset.w = t.w;
    wrapper.dataset.h = t.h;
    wrapper.innerHTML = t.html + '<div class="ws-del-btn" onclick="window._wsRemoveWidget(this,'+space.col+','+space.row+','+t.w+','+t.h+')">&times;</div>';
    grid.appendChild(wrapper);
    setGridOccupied(space.col, space.row, t.w, t.h, true);
}

function addWidgetToHome(type){
    var t = templates[type];
    if(!t) return;
    if(typeof window.widgets === 'undefined' || typeof window.saveLayout === 'undefined') return;
    if(typeof window.initialRender === 'undefined') return;

    /* 在主屏找空位 */
    var w = t.w, h = t.h;
    var space = null;
    for(var page = 0; page < 2&& !space; page++){
        for(var r = 0; r <= ROWS - h && !space; r++){
            for(var c = 0; c <= COLS - w && !space; c++){
                var canPlace = true;
                /* 检查是否被现有widget占用 */
                for(var dh = 0; dh < h && canPlace; dh++){
                    for(var dw = 0; dw < w && canPlace; dw++){
                        var cc = c + dw, rr = r + dh;
                        if(window.isOccupiedByWidget(page, cc, rr)) canPlace = false;
                        var taken = window.apps.some(function(a){ return a.page === page && a.col === cc && a.row === rr; });
                        if(taken) canPlace = false;
                    }
                }
                if(canPlace) space = { page: page, col: c, row: r };
            }
        }
    }

    if(!space) return;

    var newId = 'w_' + Date.now();
    var newWidget = {
        id: newId,
        page: space.page,
        col: space.col,
        row: space.row,
        w: w,
        h: h,
        text: '',
        avatar: '',
        location: '',
        customHtml: t.html
    };

    /* 把被挤占的app移走 */
    window.apps.forEach(function(a){
        if(a.page !== space.page) return;
        if(a.col >= space.col && a.col < space.col + w && a.row >= space.row && a.row < space.row + h){
            var empty = window.findEmptyCellForApp(a, a.page, { col: space.col, row: space.row, w: w, h: h });
            if(empty){ a.col = empty.col; a.row = empty.row; }
        }
    });

    window.widgets.push(newWidget);
    window.initialRender();
    window.saveLayout();
}

window._wsRemoveWidget = function(btn, col, row, w, h){
    var wrapper = btn.closest('.ws-desktop-widget');
    if(wrapper){ wrapper.remove(); setGridOccupied(col, row, w, h, false); }
};

function submitCustom(){
    var name = studioEl.querySelector('#wsCustomName').value.trim();
    var size = studioEl.querySelector('#wsCustomSize').value;
    var html = studioEl.querySelector('#wsCustomHTML').value.trim();
    var css = studioEl.querySelector('#wsCustomCSS').value.trim();
    if(!name || !html){ alert('请填写组件名称和 HTML！'); return; }

    if(css){
        var s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
    }

    var typeId = 'custom_' + Date.now();
    var sizeMap = { '4x2': {w:4,h:2}, '4x1': {w:4,h:1}, '2x2': {w:2,h:2}, '2x1': {w:2,h:1} };
    var dims = sizeMap[size] || {w:4,h:2};
    templates[typeId] = { w: dims.w, h: dims.h, html: html };

    var gallery = studioEl.querySelector('#wsGallery');
    var card = document.createElement('div');
    card.className = 'ws-card';
    card.innerHTML =
        '<div class="ws-card-header"><div class="ws-card-info"><h3>'+escWs(name)+' (自定义)</h3><p>规格: '+size+'</p></div><button class="ws-add-btn" data-add="'+typeId+'">添加</button></div>'+
        '<div class="ws-render">'+html+'</div>';
    gallery.insertBefore(card, gallery.firstChild);

    studioEl.querySelector('#wsCustomName').value = '';
    studioEl.querySelector('#wsCustomHTML').value = '';
    studioEl.querySelector('#wsCustomCSS').value = '';
    studioEl.querySelector('#wsModal').classList.remove('show');
}

function escWs(s){ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function open(){
    ensure();
    studioEl.classList.add('active');
    /*刷新时钟显示 */
    var clockEl = studioEl.querySelector('#wsClockDisplay');
    if(clockEl) clockEl.textContent = formatTime();
}

function close(){
    if(!studioEl) return;
    studioEl.classList.remove('active');
}

/*时钟同步 */
setInterval(function(){
    if(!studioEl) return;
    var clockEl = studioEl.querySelector('#wsClockDisplay');
    if(clockEl) clockEl.textContent = formatTime();
}, 1000);

window.openWidgetStudio = open;
window.closeWidgetStudio = close;

})();

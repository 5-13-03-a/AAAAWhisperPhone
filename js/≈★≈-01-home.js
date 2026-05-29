/* ============ WhisperPhone Home Logic ============ */
const COLS = 4;
const ROWS = 6;
const CELL_X = 95;
const CELL_Y = 101;

const STORAGE_KEY    = 'whisperphone_layout_v1';

const DEFAULT_AVATAR   = 'https://i.postimg.cc/Gh4HPCbh/1779914948843.png';
const DEFAULT_LOCATION = 'SEOUL · 13°C';

const DEFAULT_WIDGETS = [
    { id: 'w1', page: 0, col: 0, row: 0, w: 4, h: 2,
      text: '任由潮湿的缺口生出苔花的旺盛',
      avatar: DEFAULT_AVATAR,
      location: DEFAULT_LOCATION }
];

const DEFAULT_APPS = [
    { id: 'a1',  icon: 'fa-cat',         color: 'icon-black',  label: 'Chat',     page: 0, col: 0, row: 2 },
    { id: 'a2',  icon: 'fa-cloud-sun',   color: 'icon-white',  label: 'Mood',     page: 0, col: 1, row: 2 },
    { id: 'a3',  icon: 'fa-ghost',       color: 'icon-gray',   label: 'Settings', page: 0, col: 2, row: 2 },
    { id: 'a4',  icon: 'fa-robot',       color: 'icon-silver', label: 'API',      page: 0, col: 3, row: 2 },
    { id: 'a5',  icon: 'fa-palette',     color: 'icon-white',  label: '组件',     page: 0, col: 0, row: 3 },
    { id: 'a6',  icon: 'fa-coffee',      color: 'icon-black',  label: 'Bean',     page: 0, col: 1, row: 3 },
    { id: 'a7',  icon: 'fa-music',       color: 'icon-silver', label: 'Tune',     page: 0, col: 2, row: 3 },
    { id: 'a8',  icon: 'fa-leaf',        color: 'icon-gray',   label: 'Lore',     page: 0, col: 3, row: 3 }
];

let widgets = JSON.parse(JSON.stringify(DEFAULT_WIDGETS));
let apps    = JSON.parse(JSON.stringify(DEFAULT_APPS));
window.widgets = widgets;
window.apps = apps;

/* ===== 持久化 ===== */
async function loadLayout() {
    if (!window.WhisperDB) return;
    try {
        const saved = await WhisperDB.get(STORAGE_KEY);
        if (saved && Array.isArray(saved.widgets) && Array.isArray(saved.apps)) {
            widgets = saved.widgets.map(w => ({
                avatar: DEFAULT_AVATAR,
                location: DEFAULT_LOCATION,
                ...w
            }));
            apps = saved.apps;
            window.widgets = widgets;
            window.apps = apps;
        }
    } catch (e) {
        console.warn('[WhisperPhone] loadLayout failed', e);
    }
}

let _saveTimer = null;
window.saveLayout = saveLayout;
function saveLayout() {
    if (!window.WhisperDB) return;
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
        WhisperDB.set(STORAGE_KEY, { widgets, apps }).catch(err => {
            console.warn('[WhisperPhone] saveLayout failed', err);
        });
    }, 300);
}

/* ===== 渲染 ===== */
window.initialRender = initialRender;
function initialRender() {
    for (let p = 0; p < 2; p++) {
        const grid = document.getElementById('grid-' + p);
        if (!grid) continue;
        grid.innerHTML = '';
        refreshGridCells(p, grid);
        widgets.filter(w => w.page === p).forEach(w => grid.appendChild(buildWidget(w)));
        apps.filter(a => a.page === p).forEach(a => grid.appendChild(buildApp(a)));
    }
}

function isOccupiedByWidget(page, col, row) {
    return widgets.some(w => w.page === page
        && col >= w.col && col < w.col + w.w
        && row >= w.row && row < w.row + w.h);
}
window.isOccupiedByWidget = isOccupiedByWidget;

function refreshGridCells(page, gridEl) {
    const grid = gridEl || document.getElementById('grid-' + page);
    grid.querySelectorAll('.grid-cell').forEach(c => c.remove());
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (isOccupiedByWidget(page, col, row)) continue;
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.setProperty('--col', col);
            cell.style.setProperty('--row', row);
            grid.insertBefore(cell, grid.firstChild);
        }
    }
}

function buildWidget(w) {
    const div = document.createElement('div');
    div.className = 'g-item widget';
    div.dataset.id = w.id;
    div.dataset.type = 'widget';
    div.style.setProperty('--col', w.col);
    div.style.setProperty('--row', w.row);

    if (w.customHtml) {
        div.classList.add('custom-widget');
        div.classList.add('cw-' + w.w +'x' + w.h);
        div.innerHTML = `<div class="w2-custom-widget">${w.customHtml}</div><div class="w2-delete-btn" data-widget-del="${w.id}"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>`;
        return div;
    }

    const avatar   = w.avatar   || DEFAULT_AVATAR;
    const location = w.location || DEFAULT_LOCATION;
    div.innerHTML = `
        <div class="w2-deco-rect"></div>
        <div class="w2-polkadot-layer"></div>
        <div class="w2-capsule-flat">
            <div class="w2-time-text">${formatNowHM()}</div>
            <div class="w2-divider"></div>
            <div class="w2-location" data-widget-id="${w.id}">${location}</div>
        </div>
        <div class="w2-footer-text" data-widget-id="${w.id}">${w.text}</div>
        <div class="w2-avatar-pop" data-widget-id="${w.id}" style="background: url('${avatar}') center/cover"></div>
    `;
    return div;
}

const SOUL_ICON_SVG = `<svg width="28" height="28" viewBox="0 0 64 64" fill="none" style="display:block;">
    <path d="M32 6 L 41 25 L 61 27 L 46 40 L 51 59 L 32 49 L 13 59 L 18 40 L 3 27 L 23 25 Z"
          fill="#3D3D40" stroke="#3D3D40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="32" cy="35" r="9" fill="#F4F4F6"/>
    <circle cx="32" cy="35" r="3.5" fill="#3D3D40"/>
</svg>`;

function buildApp(a) {
    const div = document.createElement('div');
    div.className = 'g-item app';
    div.dataset.id = a.id;
    div.dataset.type = 'app';
    div.style.setProperty('--col', a.col);
    div.style.setProperty('--row', a.row);
    const inner = (a.id === 'a3') ? SOUL_ICON_SVG : `<i class="fa-solid ${a.icon}"></i>`;
    div.innerHTML = `
        <div class="app-icon ${a.color}">${inner}</div>
        <div class="app-label">${a.label}</div>
    `;
    return div;
}

/* ===== 启动 ===== */
(async function bootstrap() {
    await loadLayout();
    initialRender();
})();

/* ===== 文字就地编辑（footer 文案 + 位置） ===== */
const EDITABLE_SELECTOR = '.w2-footer-text, .w2-location';

document.addEventListener('click', (e) => {
    const text = e.target.closest(EDITABLE_SELECTOR);
    if (!text) return;
    if (document.body.classList.contains('edit-mode')) return;
    e.stopPropagation();
    if (text.isContentEditable) return;
    text.setAttribute('contenteditable', 'true');
    text.focus();
    const range = document.createRange();
    range.selectNodeContents(text);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
});

function commitEdit(el) {
    if (!el.isContentEditable) return;
    el.removeAttribute('contenteditable');
    const id = el.dataset.widgetId;
    const w = widgets.find(x => x.id === id);
    const isLocation = el.classList.contains('w2-location');
    const fallback = isLocation ? DEFAULT_LOCATION : '任由潮湿的缺口生出苔花的旺盛';
    const value = el.innerText.trim() || fallback;
    if (w) {
        if (isLocation) w.location = value;
        else            w.text     = value;
    }
    if (!el.innerText.trim()) el.innerText = fallback;
    saveLayout();
}

document.addEventListener('focusout', (e) => {
    const text = e.target.closest(EDITABLE_SELECTOR);
    if (!text) return;
    commitEdit(text);
});

document.addEventListener('keydown', (e) => {
    const t = document.activeElement;
    if (!t || !t.classList) return;
    if (!t.classList.contains('w2-footer-text') && !t.classList.contains('w2-location')) return;
    if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); t.blur(); }
});

/* ===== 头像上传替换 ===== */
document.addEventListener('click', (e) => {
    const av = e.target.closest('.w2-avatar-pop');
    if (!av) return;
    if (document.body.classList.contains('edit-mode')) return;
    e.stopPropagation();
    triggerAvatarUpload(av.dataset.widgetId);
});

function triggerAvatarUpload(widgetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            const w = widgets.find(x => x.id === widgetId);
            if (!w) return;
            w.avatar = dataUrl;
            const el = document.querySelector(`.w2-avatar-pop[data-widget-id="${widgetId}"]`);
            if (el) el.style.background = `url('${dataUrl}') center/cover`;
            saveLayout();
        };
        reader.readAsDataURL(file);
    });
    input.click();
}

/* ===== 系统时间实时同步 ===== */
function formatNowHM() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}
function tickClock() {
    const txt = formatNowHM();
    document.querySelectorAll('.w2-time-text').forEach(el => {
        if (el.innerText !== txt) el.innerText = txt;
    });
}
setInterval(tickClock, 1000);
tickClock();

/* ===== 拖动逻辑 ===== */
let longPressTimer = null;
let isDragging = false;
let dragItem = null;
let dragData = null;
let dragOffsetX = 0, dragOffsetY = 0;
let pending = null;
const LONG_PRESS_MS = 450;

let edgeSwitchTimer = null;
const EDGE_ZONE = 36;
const EDGE_DELAY = 400;

document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.w2-footer-text') && e.target.closest('.w2-footer-text').isContentEditable) return;
    const item = e.target.closest('.g-item');
    if (!item) return;
    if (e.target.closest('.dock')) return;

    const id = item.dataset.id;
    const type = item.dataset.type;
    const data = type === 'widget'
        ? widgets.find(w => w.id === id)
        : apps.find(a => a.id === id);

    const rect = item.getBoundingClientRect();
    pending = {
        item, data,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY
    };

    if (!document.body.classList.contains('edit-mode')) {
        longPressTimer = setTimeout(() => {
            document.body.classList.add('edit-mode');
            if (navigator.vibrate) navigator.vibrate(15);
            startDrag();
        }, LONG_PRESS_MS);
    } else {
        startDrag();
    }
});

document.addEventListener('pointermove', (e) => {
    if (longPressTimer && pending) {
        const dx = Math.abs(e.clientX - pending.startX);
        const dy = Math.abs(e.clientY - pending.startY);
        if (dx > 8 || dy > 8) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
            pending = null;
        }
    }
    if (!isDragging) return;
    e.preventDefault();
    const grid = dragItem.closest('.grid-area');
    const gRect = grid.getBoundingClientRect();
    const x = e.clientX - gRect.left - dragOffsetX;
    const y = e.clientY - gRect.top - dragOffsetY;
    dragItem.style.left = x + 'px';
    dragItem.style.top = y + 'px';

    /*边缘检测：拖到屏幕左右边缘时切换页面 */
    const screenW = window.innerWidth;
    const nearRight = e.clientX > screenW - EDGE_ZONE;
    const nearLeft = e.clientX < EDGE_ZONE;

    if (nearRight || nearLeft) {
        if (!edgeSwitchTimer) {
            edgeSwitchTimer = setTimeout(() => {
                edgeSwitchTimer = null;
                const currentPage = dragData.page;
                const targetPage = nearRight ? currentPage + 1 : currentPage - 1;
                if (targetPage < 0 || targetPage > 1) return;
                switchDragToPage(targetPage, e);
            }, EDGE_DELAY);
        }
    } else {
        if (edgeSwitchTimer) { clearTimeout(edgeSwitchTimer); edgeSwitchTimer = null; }
    }
});

function switchDragToPage(targetPage, e) {
    if (!isDragging || !dragItem || !dragData) return;
    const oldPage = dragData.page;
    if (targetPage === oldPage) return;

    /* 更新数据 */
    dragData.page = targetPage;

    /* 把DOM 元素移到新页面的grid */
    const newGrid = document.getElementById('grid-' + targetPage);
    if (!newGrid) return;

    /* 先停止拖动动画，移动DOM */
    dragItem.classList.remove('dragging');
    dragItem.style.left = '';
    dragItem.style.top = '';
    newGrid.appendChild(dragItem);

    /* 滚动到目标页面 */
    if (slider) {
        slider.style.scrollSnapType = 'none';
        slider.scrollTo({ left: targetPage * window.innerWidth, behavior: 'smooth' });
        setTimeout(() => { if (slider) slider.style.scrollSnapType = 'x mandatory'; }, 350);
    }

    /* 重新计算拖动位置 */
    setTimeout(() => {
        if (!dragItem) return;
        const gRect = newGrid.getBoundingClientRect();
        const x = e.clientX - gRect.left - dragOffsetX;
        const y = e.clientY - gRect.top - dragOffsetY;
        dragItem.style.left = x + 'px';
        dragItem.style.top = y + 'px';
        dragItem.classList.add('dragging');
    }, 60);

    /* 刷新旧页面的网格 */
    refreshGridCells(oldPage);
}

document.addEventListener('pointerup', (e) => {
    if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    if (edgeSwitchTimer) { clearTimeout(edgeSwitchTimer); edgeSwitchTimer = null; }
    if (!isDragging) { pending = null; return; }
    finishDrag(e);
});

function startDrag() {
    if (!pending) return;
    isDragging = true;
    dragItem = pending.item;
    dragData = pending.data;
    dragOffsetX = pending.offsetX;
    dragOffsetY = pending.offsetY;
    const gRect = dragItem.closest('.grid-area').getBoundingClientRect();
    const r = dragItem.getBoundingClientRect();
    dragItem.style.left = (r.left - gRect.left) + 'px';
    dragItem.style.top  = (r.top  - gRect.top)  + 'px';
    requestAnimationFrame(() => { if (dragItem) dragItem.classList.add('dragging'); });
    try { if (dragItem) dragItem.setPointerCapture(pending.pointerId); } catch (err) {}
}

window.findEmptyCellForApp = findEmptyCellForApp;
function findEmptyCellForApp(app, page, blockedRect) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (blockedRect && c >= blockedRect.col && c < blockedRect.col + blockedRect.w
                && r >= blockedRect.row && r < blockedRect.row + blockedRect.h) continue;
            const taken = apps.some(other =>
                other !== app && other.page === page && other.col === c && other.row === r);
            if (!taken) return { col: c, row: r };
        }
    }
    return null;
}

function finishDrag(e) {
    const grid = dragItem.closest('.grid-area');
    const gRect = grid.getBoundingClientRect();
    const x = e.clientX - gRect.left - dragOffsetX;
    const y = e.clientY - gRect.top - dragOffsetY;
    let newCol = Math.round(x / CELL_X);
    let newRow = Math.round(y / CELL_Y);

    const page = dragData.page;
    const isWidget = dragItem.dataset.type === 'widget';
    const wSpan = isWidget ? dragData.w : 1;
    const hSpan = isWidget ? dragData.h : 1;

    newCol = Math.max(0, Math.min(COLS - wSpan, newCol));
    newRow = Math.max(0, Math.min(ROWS - hSpan, newRow));

    let finalCol = dragData.col;
    let finalRow = dragData.row;

    if (isWidget) {
        const oldCol = dragData.col, oldRow = dragData.row;

        const displaced = apps.filter(a =>
            a.page === page &&
            a.col >= newCol && a.col < newCol + wSpan &&
            a.row >= newRow && a.row < newRow + hSpan
        );

        const freedCells = [];
        for (let r = oldRow; r < oldRow + hSpan; r++) {
            for (let c = oldCol; c < oldCol + wSpan; c++) {
                if (c >= newCol && c < newCol + wSpan && r >= newRow && r < newRow + hSpan) continue;
                freedCells.push({ col: c, row: r });
            }
        }

        dragData.col = newCol;
        dragData.row = newRow;
        finalCol = newCol;
        finalRow = newRow;

        displaced.forEach(a => {
            let placed = false;
            for (let i = 0; i < freedCells.length; i++) {
                const cell = freedCells[i];
                const taken = apps.some(other =>
                    other !== a && other.page === page && other.col === cell.col && other.row === cell.row);
                if (!taken) {
                    a.col = cell.col;
                    a.row = cell.row;
                    freedCells.splice(i, 1);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                const empty = findEmptyCellForApp(a, page,
                    { col: dragData.col, row: dragData.row, w: wSpan, h: hSpan });
                if (empty) { a.col = empty.col; a.row = empty.row; }
            }
            const aEl = grid.querySelector(`.g-item[data-id="${a.id}"]`);
            if (aEl) {
                aEl.style.setProperty('--col', a.col);
                aEl.style.setProperty('--row', a.row);
            }
        });

        refreshGridCells(page);
    } else {
        if (isOccupiedByWidget(page, newCol, newRow)) {
            /* 落到widget区域：尝试找一个空位，否则回原位 */
            const empty = findEmptyCellForApp(dragData, page,
                { col: 0, row: 0, w: 0, h: 0 });
            if (empty && !isOccupiedByWidget(page, empty.col, empty.row)) {
                dragData.col = empty.col;
                dragData.row = empty.row;
                finalCol = empty.col;
                finalRow = empty.row;
            }
        } else {
            const occupant = apps.find(a =>
                a.id !== dragData.id && a.page === page && a.col === newCol && a.row === newRow);
            if (occupant) {
                const oldCol = dragData.col;
                const oldRow = dragData.row;
                dragData.col = newCol;
                dragData.row = newRow;
                occupant.col = oldCol;
                occupant.row = oldRow;
                occupant.page = page;
                const occEl = grid.querySelector(`.g-item[data-id="${occupant.id}"]`);
                if (occEl) {
                    occEl.style.setProperty('--col', oldCol);
                    occEl.style.setProperty('--row', oldRow);
                }
                finalCol = newCol;
                finalRow = newRow;
            } else {
                dragData.col = newCol;
                dragData.row = newRow;
                finalCol = newCol;
                finalRow = newRow;
            }
        }
    }

    dragItem.style.setProperty('--col', finalCol);
    dragItem.style.setProperty('--row', finalRow);
    dragItem.classList.remove('dragging');
    dragItem.style.left = '';
    dragItem.style.top = '';
    isDragging = false;

    /*刷新目标页面网格 */
    refreshGridCells(page);

    dragItem = null;
    dragData = null;
    pending = null;

    saveLayout();
}

/* 图标点击打开对应功能 + 编辑模式删除组件 */
document.addEventListener('click', (e) => {
    /* 编辑模式下点击删除按钮 */
    if (document.body.classList.contains('edit-mode')) {
        const delBtn = e.target.closest('[data-widget-del]');
        if (delBtn) {
            e.stopPropagation();
            const wid = delBtn.dataset.widgetDel;
            const idx = widgets.findIndex(w => w.id === wid);
            if (idx >= 0) {
                widgets.splice(idx, 1);
                window.widgets = widgets;
                initialRender();
                saveLayout();
            }
            return;
        }
        if (!e.target.closest('.g-item') && !e.target.closest('.dock')) {
            document.body.classList.remove('edit-mode');
        }
        return;
    }
    const appItem = e.target.closest('.g-item.app');
    if (!appItem) return;
    const appId = appItem.dataset.id;
    if (appId === 'a5' && typeof window.openWidgetStudio === 'function') {
        window.openWidgetStudio();
    }
});

const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.dot');
if (slider) {
    slider.addEventListener('scroll', () => {
        const idx = Math.round(slider.scrollLeft / window.innerWidth);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    });
}

let sliderDown = false, sx = 0, sl = 0;
if (slider) {
    slider.addEventListener('mousedown', (e) => {
        if (document.body.classList.contains('edit-mode')) return;
        if (e.target.closest('.g-item')) return;
        sliderDown = true;
        slider.style.scrollSnapType = 'none';
        sx = e.pageX;
        sl = slider.scrollLeft;
    });
    document.addEventListener('mouseup', () => {
        sliderDown = false;
        if (slider) slider.style.scrollSnapType = 'x mandatory';
    });
    slider.addEventListener('mousemove', (e) => {
        if (!sliderDown) return;
        slider.scrollLeft = sl + (sx - e.pageX) * 1.2;
    });
}

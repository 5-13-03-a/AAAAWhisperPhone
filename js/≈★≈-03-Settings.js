/* ============ WhisperPhone Settings ============ */
const SOUL_KEY = 'whisperphone_soul_v1';
const WALLPAPER_KEY = 'whisperphone_wallpaper_v1';

const DEFAULT_SOUL = {
    avatar: 'https://i.postimg.cc/yNx1KhWN/IMG-20260528-045634.jpg',
    nick: 'Whisper',
    role: 'Owner',
    handle: '@WHISPER · ID 0419',
    notify: true,
    privacy: true,
    theme: '浅色',
    timeLang: 'Auto',
    systemFont: true,
    fontPresets: [],
    activeFontId: null,
    fontScale: 1
};
let soulData = JSON.parse(JSON.stringify(DEFAULT_SOUL));

async function loadSoul() {
    if (!window.WhisperDB) return;
    try {
        const saved = await WhisperDB.get(SOUL_KEY);
        if (saved && typeof saved === 'object') {
            soulData = { ...DEFAULT_SOUL, ...saved };
        }
    } catch (e) {
        console.warn('[Soul] load failed', e);
    }
}

let _soulSaveTimer = null;
function saveSoul() {
    if (!window.WhisperDB) return;
    clearTimeout(_soulSaveTimer);
    _soulSaveTimer = setTimeout(() => {
        WhisperDB.set(SOUL_KEY, soulData).catch(() => {});
    }, 300);
}

/* ===== 通用弹窗引擎 ===== */
function closeModal(overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 500);
}

/* ===== ⑤ WHISPER 壁纸气泡弹窗 ===== */
async function openWallpaperModal() {
    let currentWP = null;
    if (window.WhisperDB) {
        currentWP = await WhisperDB.get(WALLPAPER_KEY);
    }

    const overlay = document.createElement('div');
    overlay.className = 'wp-modal-overlay';

    const hasImg = currentWP ? 'has-img' : '';
    const previewStyle = currentWP ? `background-image:url('${currentWP}');` : '';

    overlay.innerHTML = `
        <div class="whisp-wrap">
            <div class="whisp-bubble main">
                <div class="whisp-head">
                    <div class="whisp-avatar">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div class="whisp-meta">
                        <div class="whisp-name">WhisperPhone</div>
                        <div class="whisp-time">刚刚</div>
                    </div>
                </div>
                <div class="whisp-upload-zone ${hasImg}" id="whisp-zone" style="${previewStyle}">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>TAP TO UPLOAD</span>
                </div>
                <div class="whisp-btns">
                    <button class="whisp-btn send" id="whisp-confirm">
                        <i class="fa-solid fa-check" style="font-size:10px"></i>
                        确认
                    </button>
                    <button class="whisp-btn cancel" id="whisp-cancel">取消</button>
                </div>
            </div>
            <div class="whisp-quick">
                <div class="whisp-chip" id="whisp-chip-upload">📎 上传图片</div>
                <div class="whisp-chip" id="whisp-chip-reset">↺ 恢复默认</div>
                <div class="whisp-chip" id="whisp-chip-close">✕ 取消</div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('show'));
    });

    let pendingWP = currentWP || null;

    function doUpload() {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = () => {
            const file = inp.files && inp.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                pendingWP = reader.result;
                const zone = overlay.querySelector('#whisp-zone');
                zone.style.backgroundImage = `url('${pendingWP}')`;
                zone.classList.add('has-img');
            };
            reader.readAsDataURL(file);
        };
        inp.click();
    }

    function doReset() {
        pendingWP = null;
        const zone = overlay.querySelector('#whisp-zone');
        zone.style.backgroundImage = '';
        zone.classList.remove('has-img');
    }

    overlay.querySelector('#whisp-zone').addEventListener('click', doUpload);
    overlay.querySelector('#whisp-chip-upload').addEventListener('click', doUpload);
    overlay.querySelector('#whisp-chip-reset').addEventListener('click', doReset);
    overlay.querySelector('#whisp-chip-close').addEventListener('click', () => closeModal(overlay));
    overlay.querySelector('#whisp-cancel').addEventListener('click', () => closeModal(overlay));
    overlay.querySelector('#whisp-confirm').addEventListener('click', () => {
        applyWallpaper(pendingWP);
        if (window.WhisperDB) {
            if (pendingWP) WhisperDB.set(WALLPAPER_KEY, pendingWP);
            else WhisperDB.remove(WALLPAPER_KEY);
        }
        closeModal(overlay);
    });
}

function applyWallpaper(dataUrl) {
    const container = document.querySelector('.app-container');
    if (!container) return;
    if (dataUrl) {
        container.style.backgroundImage = `url('${dataUrl}')`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
    } else {
        container.style.backgroundImage = '';
        container.style.backgroundSize = '';
        container.style.backgroundPosition = '';
    }
}

async function loadWallpaper() {
    if (!window.WhisperDB) return;
    try {
        const saved = await WhisperDB.get(WALLPAPER_KEY);
        if (saved) applyWallpaper(saved);
    } catch (e) {}
}

/* ===== 全局字体系统 ===== */
function applySystemFont(on) {
    document.documentElement.classList.toggle('wp-sysfont', !!on);
}

/* 全局字号缩放（对各全屏面板用 zoom，互不影响主界面布局） */
function applyFontScale(scale) {
    let s = parseFloat(scale);
    if (isNaN(s)) s = 1;
    s = Math.max(0.8, Math.min(1.3, s));
    var styleEl = document.getElementById('wp-fontscale-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'wp-fontscale-style';
        document.head.appendChild(styleEl);
    }
    if (s === 1) {
        styleEl.textContent = '';
    } else {
        styleEl.textContent =
            '.ca-detail .ca-detail-msgs,' +
            '.chat-app .ca-chat-list,' +
            '.soul-panel .soul-inner,' +
            '.api-panel .api-inner,' +
            '.wb-panel .wb-scroll,' +
            '.ca-settings .cs-body{zoom:' + s + ';}';
    }
}

function getActiveFontPreset() {
    return (soulData.fontPresets || []).find(p => p.id === soulData.activeFontId) || null;
}

function applyFontState() {
    let styleEl = document.getElementById('wp-custom-font-style');
    const active = getActiveFontPreset();
    if (active) {
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'wp-custom-font-style';
            document.head.appendChild(styleEl);
        }
        const fam = 'wpFont_' + active.id;
        styleEl.textContent =
            "@font-face{font-family:'" + fam + "';src:url('" + active.source + "');font-display:swap;}" +
            "html.wp-customfont,html.wp-customfont body," +
            "html.wp-customfont *:not([class*=\"fa-\"]):not(.fa):not(.fas):not(.far):not(.fab):not(i){" +
            "font-family:'" + fam + "',system-ui,-apple-system,BlinkMacSystemFont,sans-serif !important;}";
        document.documentElement.classList.add('wp-customfont');
        document.documentElement.classList.remove('wp-sysfont');
    } else {
        if (styleEl) styleEl.textContent = '';
        document.documentElement.classList.remove('wp-customfont');
        document.documentElement.classList.toggle('wp-sysfont', !!soulData.systemFont);
    }
}

function uidFont() {
    return 'f_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function renderFontPresets(panel) {
    const wrap = panel.querySelector('#sf-presets');
    if (!wrap) return;
    const presets = soulData.fontPresets || [];
    if (presets.length === 0) {
        wrap.innerHTML = '<div class="sf-empty">暂无预设字体</div>';
        return;
    }
    let html = '';
    presets.forEach(p => {
        const isActive = p.id === soulData.activeFontId;
        html +=
            '<div class="sf-preset" data-id="' + p.id + '">' +
                '<div class="sf-preset-info">' +
                    '<div class="sf-preset-name">' + (p.name || '未命名') + '</div>' +
                    '<div class="sf-preset-type">' + (p.type === 'ttf' ? 'TTF 文件' : 'URL') + '</div>' +
                '</div>' +
                '<div class="sf-use' + (isActive ? ' active' : '') + '" data-id="' + p.id + '">' + (isActive ? '已启用' : '启用') + '</div>' +
                '<div class="sf-del" data-id="' + p.id + '">删除</div>' +
            '</div>';
    });
    wrap.innerHTML = html;

    wrap.querySelectorAll('.sf-use').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            soulData.activeFontId = (soulData.activeFontId === id) ? null : id;
            applyFontState();
            saveSoul();
            renderFontPresets(panel);
        });
    });
    wrap.querySelectorAll('.sf-del').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            soulData.fontPresets = (soulData.fontPresets || []).filter(p => p.id !== id);
            if (soulData.activeFontId === id) soulData.activeFontId = null;
            applyFontState();
            saveSoul();
            renderFontPresets(panel);
        });
    });
}

function bindFontManager(panel) {
    const fold = panel.querySelector('#soul-font-fold');
    const row = panel.querySelector('#soul-row-sysfont');
    if (row && fold) {
        row.addEventListener('click', (e) => {
            if (e.target.closest('#soul-sysfont')) return;
            row.classList.toggle('open');
            fold.classList.toggle('open');
        });
    }

    const urlAdd = panel.querySelector('#sf-url-add');
    if (urlAdd) {
        urlAdd.addEventListener('click', (e) => {
            e.stopPropagation();
            const nameInp = panel.querySelector('#sf-name');
            const urlInp = panel.querySelector('#sf-url');
            const url = (urlInp.value || '').trim();
            if (!url) return;
            const name = (nameInp.value || '').trim() || url.split('/').pop() || '未命名';
            if (!soulData.fontPresets) soulData.fontPresets = [];
            soulData.fontPresets.push({ id: uidFont(), name: name, type: 'url', source: url });
            saveSoul();
            nameInp.value = '';
            urlInp.value = '';
            renderFontPresets(panel);
        });
    }

    const ttfAdd = panel.querySelector('#sf-ttf-add');
    if (ttfAdd) {
        ttfAdd.addEventListener('click', (e) => {
            e.stopPropagation();
            const nameInp = panel.querySelector('#sf-name');
            const inp = document.createElement('input');
            inp.type = 'file';
            inp.accept = '.ttf,.otf,.woff,.woff2,font/*';
            inp.onchange = () => {
                const f = inp.files && inp.files[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () => {
                    const name = (nameInp.value || '').trim() || f.name.replace(/\.[^.]+$/, '') || '未命名';
                    if (!soulData.fontPresets) soulData.fontPresets = [];
                    soulData.fontPresets.push({ id: uidFont(), name: name, type: 'ttf', source: r.result });
                    saveSoul();
                    nameInp.value = '';
                    renderFontPresets(panel);
                };
                r.readAsDataURL(f);
            };
            inp.click();
        });
    }

    renderFontPresets(panel);
}

/* ===== 自定义图标弹窗 (RIBBON 信封式) ===== */
const CUSTOM_ICONS_KEY = 'whisperphone_custom_icons_v1';
let customIcons = {};

async function loadCustomIcons() {
    if (!window.WhisperDB) return;
    try {
        const saved = await WhisperDB.get(CUSTOM_ICONS_KEY);
        if (saved && typeof saved === 'object') customIcons = saved;
    } catch (e) {}
}

function saveCustomIcons() {
    if (!window.WhisperDB) return;
    WhisperDB.set(CUSTOM_ICONS_KEY, customIcons).catch(() => {});
}

function applyCustomIconToDOM(appId) {
    const el = document.querySelector(`.g-item.app[data-id="${appId}"] .app-icon`);
    if (!el) return;
    const appDef = (typeof DEFAULT_APPS !== 'undefined') ? DEFAULT_APPS.find(a => a.id === appId) : null;
    if (customIcons[appId]) {
        el.innerHTML = `<img src="${customIcons[appId]}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
    } else if (appId === 'a3') {
        el.innerHTML = (typeof SOUL_ICON_SVG !== 'undefined') ? SOUL_ICON_SVG : '<i class="fa-solid fa-ghost"></i>';
    } else if (appDef) {
        el.innerHTML = `<i class="fa-solid ${appDef.icon}"></i>`;
    }
}

function applyAllCustomIcons() {
    if (!window.apps) return;
    apps.forEach(a => {
        if (customIcons[a.id]) applyCustomIconToDOM(a.id);
    });
}

function getIconPreviewHTML(appId, def) {
    const hasCustom = !!customIcons[appId];
    if (hasCustom) {
        return `<img src="${customIcons[appId]}">`;
    } else if (appId === 'a3' && typeof SOUL_ICON_SVG !== 'undefined') {
        return SOUL_ICON_SVG.replace('width="28"', 'width="20"').replace('height="28"', 'height="20"');
    } else if (def) {
        return `<i class="fa-solid ${def.icon}"></i>`;
    }
    return '';
}

async function openIconModal() {
    await loadCustomIcons();
    const appList = (typeof apps !== 'undefined') ? apps : [];
    const defApps = (typeof DEFAULT_APPS !== 'undefined') ? DEFAULT_APPS : [];

    let rows = '';
    appList.forEach(a => {
        const def = defApps.find(d => d.id === a.id) || a;
        const hasCustom = !!customIcons[a.id];
        const previewHTML = getIconPreviewHTML(a.id, def);
        rows += `
        <div class="ribbon-item" data-app-id="${a.id}">
            <div class="ribbon-item-icon ri-app ${def.color}">${previewHTML}</div>
            <div class="ribbon-item-text">
                <div class="ribbon-item-name">${def.label || a.label}</div>
                <div class="ribbon-item-hint">${a.id}${hasCustom ? ' · CUSTOM' : ''}</div>
            </div>
            <div class="ribbon-item-btns">
                <div class="ribbon-item-btn upload-btn" data-app="${a.id}">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="#3D3D40" stroke-width="2.2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="ribbon-item-btn reset-btn" data-app="${a.id}">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12a9 9 0 1 1 2.3 6" stroke="#9C9CA1" stroke-width="2" stroke-linecap="round"/>
                        <path d="M3 17V12h5" stroke="#9C9CA1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>`;
    });

    const overlay = document.createElement('div');
    overlay.className = 'wp-modal-overlay';
    overlay.innerHTML = `
        <div class="ribbon-env">
            <div class="ribbon-top">
                <div class="ribbon-top-title">自定义图标</div>
                <div class="ribbon-close" id="ribbon-close-btn">
                    <svg width="10" height="10" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#3D3D40" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div class="ribbon-body">${rows}</div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    overlay.querySelector('#ribbon-close-btn').addEventListener('click', () => closeModal(overlay));
    requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('show'));
    });

    overlay.querySelectorAll('.ribbon-item-btn.upload-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const appId = btn.dataset.app;
            const inp = document.createElement('input');
            inp.type = 'file';
            inp.accept = 'image/*';
            inp.onchange = () => {
                const file = inp.files && inp.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    customIcons[appId] = reader.result;
                    saveCustomIcons();
                    applyCustomIconToDOM(appId);
                    const row = overlay.querySelector(`.ribbon-item[data-app-id="${appId}"]`);
                    if (row) {
                        row.querySelector('.ribbon-item-icon').innerHTML = `<img src="${reader.result}">`;
                        row.querySelector('.ribbon-item-hint').textContent = appId + ' · CUSTOM';
                    }
                };
                reader.readAsDataURL(file);
            };
            inp.click();
        });
    });

    overlay.querySelectorAll('.ribbon-item-btn.reset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const appId = btn.dataset.app;
            delete customIcons[appId];
            saveCustomIcons();
            applyCustomIconToDOM(appId);
            const row = overlay.querySelector(`.ribbon-item[data-app-id="${appId}"]`);
            if (row) {
                const def = defApps.find(d => d.id === appId);
                row.querySelector('.ribbon-item-icon').innerHTML = getIconPreviewHTML(appId, def);
                row.querySelector('.ribbon-item-hint').textContent = appId;
            }
        });
    });
}

/* ===== 构建设置面板 ===== */
function buildSoulPanel() {
    const panel = document.createElement('div');
    panel.id = 'soul-panel';
    panel.className = 'soul-panel';
    panel.innerHTML = `
        <div class="soul-inner">

            <div class="nav-row">
                <div class="nav-back" id="soul-back">‹ Home</div>
                <div class="nav-title">SETTINGS</div>
                <div class="nav-done" id="soul-done">Done</div>
            </div>

            <div class="profile-block">
                <div class="avatar-big" id="soul-avatar" style="background-image:url('${soulData.avatar}');"></div>
                <div class="name-cap">
                    <div class="dot-tag"></div>
                    <div class="nick" id="soul-nick">${soulData.nick}</div>
                    <div class="div-line"></div>
                    <div class="tag">${soulData.role}</div>
                </div>
                <div class="id-line">${soulData.handle}</div>
            </div>

            <div class="group-label">Account</div>
            <div class="group">
                <div class="row">
                    <div class="row-icon line">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#3D3D40"/><path d="M4 21c0-4.5 3.5-8 8-8s8 3.5 8 8" fill="#3D3D40"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">个人资料</div>
                        <div class="row-sub">头像 · 昵称 · 简介</div>
                    </div>
                    <div class="row-tail"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="row" id="soul-row-backup">
                    <div class="row-icon deep">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4v12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
                            <path d="M7 9l5-5 5 5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">备份系统</div>
                        <div class="row-sub">导出 · 导入 · 自检</div>
                    </div>
                    <div class="row-tail"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
            </div>

            <div class="group-label">Appearance</div>
            <div class="group">
                <div class="row">
                    <div class="row-icon light">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="#3D3D40"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">主题模式</div>
                        <div class="row-sub">浅色 / 深色 / 跟随系统</div>
                    </div>
                    <div class="row-tail"><span class="val" id="soul-theme-val">${soulData.theme}</span><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="row" id="soul-row-icons">
                    <div class="row-icon silver">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="2" fill="#FFFFFF"/><rect x="13" y="4" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.5"/><rect x="4" y="13" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.5"/><rect x="13" y="13" width="7" height="7" rx="2" fill="#FFFFFF"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">自定义图标</div>
                        <div class="row-sub">替换桌面 App 图标</div>
                    </div>
                    <div class="row-tail"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="row" id="soul-row-wallpaper">
                    <div class="row-icon line">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7l4-3 4 3 4-3 4 3v10l-4 3-4-3-4 3-4-3z" fill="#3D3D40"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">壁纸</div>
                        <div class="row-sub">柔光白 · 默认</div>
                    </div>
                    <div class="row-tail"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="row" data-action="toggle-sysfont" id="soul-row-sysfont">
                    <div class="row-icon deep">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 7V5h14v2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5v14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><path d="M9 19h6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">系统字体</div>
                        <div class="row-sub">使用手机系统字体 · 点击管理预设</div>
                    </div>
                    <div class="row-tail"><div class="toggle ${soulData.systemFont ? 'on' : ''}" id="soul-sysfont"></div></div>
                </div>
                <div class="soul-font-fold" id="soul-font-fold">
                    <div class="sf-add">
                        <input class="sf-input" id="sf-name" placeholder="字体名称">
                        <div class="sf-url-row">
                            <input class="sf-input" id="sf-url" placeholder="字体 URL (woff2/ttf)">
                            <button class="sf-btn" id="sf-url-add">URL</button>
                        </div>
                        <button class="sf-btn full" id="sf-ttf-add">上传 TTF 文件</button>
                    </div>
                    <div class="sf-presets" id="sf-presets"></div>
                </div>
                <div class="row">
                    <div class="row-icon light">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7V5h16v2" stroke="#3D3D40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 5v14" stroke="#3D3D40" stroke-width="2" stroke-linecap="round"/><path d="M9 19h6" stroke="#3D3D40" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">字号大小</div>
                        <div class="row-sub">全局文字缩放</div>
                    </div>
                </div>
                <div class="soul-fs-row">
                    <span class="soul-fs-mini">A</span>
                    <input type="range" class="soul-fs-slider" id="soul-fs-slider" min="0.8" max="1.3" step="0.05" value="${soulData.fontScale || 1}">
                    <span class="soul-fs-max">A</span>
                    <span class="soul-fs-val" id="soul-fs-val">${Math.round((soulData.fontScale || 1) * 100)}%</span>
                </div>
            </div>

            <div class="group-label">Preferences</div>
            <div class="group">
                <div class="row" data-action="toggle-notify">
                    <div class="row-icon deep">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 17H9m6 0a6 6 0 0 0-6-6v-1a3 3 0 1 1 6 0v1a6 6 0 0 0 0 6z" fill="#FFFFFF"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">通知</div>
                        <div class="row-sub">气泡提醒 · 震动</div>
                    </div>
                    <div class="row-tail"><div class="toggle ${soulData.notify ? 'on' : ''}" id="soul-notify"></div></div>
                </div>
                <div class="row" data-action="toggle-privacy">
                    <div class="row-icon light">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12c2-3 5-5 9-5s7 2 9 5c-2 3-5 5-9 5s-7-2-9-5z" fill="#3D3D40"/><circle cx="12" cy="12" r="2.6" fill="#FFFFFF"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">隐私</div>
                        <div class="row-sub">本地优先 · 不上传</div>
                    </div>
                    <div class="row-tail"><div class="toggle ${soulData.privacy ? 'on' : ''}" id="soul-privacy"></div></div>
                </div>
                <div class="row">
                    <div class="row-icon silver">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#FFFFFF"/><path d="M12 7v5l3 2" stroke="#3D3D40" stroke-width="1.8" stroke-linecap="round"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">时间与语言</div>
                        <div class="row-sub">跟随系统 · 简体中文</div>
                    </div>
                    <div class="row-tail"><span class="val">${soulData.timeLang}</span><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
            </div>

            <div class="group-label">About</div>
            <div class="group">
                <div class="row">
                    <div class="row-icon line">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#3D3D40"/><path d="M12 8v.01M12 11v5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">关于 WhisperPhone</div>
                        <div class="row-sub">版本 1.0.0</div>
                    </div>
                    <div class="row-tail"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="row">
                    <div class="row-icon deep">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 8h14M5 12h14M5 16h9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                    <div class="row-text">
                        <div class="row-title">使用条款</div>
                        <div class="row-sub">轻声 · 慢一点</div>
                    </div>
                    <div class="row-tail"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
            </div>

            <div class="footer-sig">WHISPER · IN · WHITE</div>
        </div>
    `;
    document.body.appendChild(panel);
    bindSoulEvents(panel);
    return panel;
}

function bindSoulEvents(panel) {
    panel.querySelector('#soul-back').addEventListener('click', closeSoul);
    panel.querySelector('#soul-done').addEventListener('click', closeSoul);

    /* 头像替换 */
    const avatar = panel.querySelector('#soul-avatar');
    avatar.addEventListener('click', () => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = 'image/*';
        inp.onchange = () => {
            const f = inp.files && inp.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => {
                soulData.avatar = r.result;
                avatar.style.backgroundImage = `url('${r.result}')`;
                saveSoul();
            };
            r.readAsDataURL(f);
        };
        inp.click();
    });

    /* 昵称编辑 */
    const nick = panel.querySelector('#soul-nick');
    nick.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nick.isContentEditable) return;
        nick.setAttribute('contenteditable', 'true');
        nick.focus();
        const range = document.createRange();
        range.selectNodeContents(nick);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    });
    nick.addEventListener('blur', () => {
        nick.removeAttribute('contenteditable');
        const v = nick.innerText.trim() || DEFAULT_SOUL.nick;
        nick.innerText = v;
        soulData.nick = v;
        saveSoul();
    });
    nick.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); nick.blur(); }
    });

    /* toggles */
    const notify = panel.querySelector('#soul-notify');
    notify.addEventListener('click', (e) => {
        e.stopPropagation();
        soulData.notify = !soulData.notify;
        notify.classList.toggle('on', soulData.notify);
        saveSoul();
    });
    const privacy = panel.querySelector('#soul-privacy');
    privacy.addEventListener('click', (e) => {
        e.stopPropagation();
        soulData.privacy = !soulData.privacy;
        privacy.classList.toggle('on', soulData.privacy);
        saveSoul();
    });

    /* 系统字体开关 */
    const sysfont = panel.querySelector('#soul-sysfont');
    sysfont.addEventListener('click', (e) => {
        e.stopPropagation();
        soulData.systemFont = !soulData.systemFont;
        sysfont.classList.toggle('on', soulData.systemFont);
        applyFontState();
        saveSoul();
    });

    bindFontManager(panel);

    /* 字号大小滑块 */
    const fsSlider = panel.querySelector('#soul-fs-slider');
    const fsVal = panel.querySelector('#soul-fs-val');
    if (fsSlider) {
        fsSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            const scale = parseFloat(fsSlider.value);
            soulData.fontScale = scale;
            if (fsVal) fsVal.textContent = Math.round(scale * 100) + '%';
            applyFontScale(scale);
            saveSoul();
        });
        fsSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    /* 备份行 → 打开备份页 */
    panel.querySelector('#soul-row-backup').addEventListener('click', () => {
        if (typeof openBackup === 'function') openBackup();
    });

    /* 壁纸行 → 打开壁纸弹窗 */
    panel.querySelector('#soul-row-wallpaper').addEventListener('click', () => {
        openWallpaperModal();
    });

    /* 自定义图标行 → 打开图标弹窗 */
    panel.querySelector('#soul-row-icons').addEventListener('click', () => {
        openIconModal();
    });
}

let soulPanelEl = null;
async function openSoul() {
    if (!soulPanelEl) {
        await loadSoul();
        soulPanelEl = buildSoulPanel();
    } else {
        // 刷新头像和昵称（可能在外部被改过）
        const av = soulPanelEl.querySelector('#soul-avatar');
        if (av) av.style.backgroundImage = `url('${soulData.avatar}')`;
        const nk = soulPanelEl.querySelector('#soul-nick');
        if (nk && !nk.isContentEditable) nk.innerText = soulData.nick;
    }
    requestAnimationFrame(() => {
        soulPanelEl.classList.add('active');
    });
}
function closeSoul() {
    if (!soulPanelEl) return;
    soulPanelEl.classList.remove('active');
}
window.openSoul = openSoul;
window.closeSoul = closeSoul;

/* 接入 home：点击 Settings (a3) 打开 */
document.addEventListener('click', (e) => {
    const item = e.target.closest('.g-item.app');
    if (!item) return;
    if (document.body.classList.contains('edit-mode')) return;
    if (item.dataset.id === 'a3') {
        e.stopPropagation();
        openSoul();
    }
});

/* 页面加载后恢复壁纸和自定义图标 */
window.addEventListener('load', async () => {
    await loadSoul();
    applyFontState();
    applyFontScale(soulData.fontScale);
    await loadWallpaper();
    await loadCustomIcons();
    applyAllCustomIcons();
});

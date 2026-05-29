/* ============ WhisperPhone Backup ============ */
const BACKUP_KEYS = [
    { key: 'whisperphone_layout_v1',       label: '桌面布局' },
    { key: 'whisperphone_layout_version',  label: '布局版本' },
    { key: 'whisperphone_soul_v1',         label: '设置偏好' },
    { key: 'whisperphone_wallpaper_v1',    label: '壁纸' },
    { key: 'whisperphone_custom_icons_v1', label: '自定义图标' },
    { key: 'whisperphone_api_v1',          label: 'API 配置' },
    { key: 'whisperphone_api_models_v1',   label: 'API 模型列表' }
];

/* 聊天数据走 localStorage，单独处理 */
const CHAT_LS_KEYS = [
    { key: 'wp_chat_contacts', label: '联系人' },
    { key: 'wp_chat_messages', label: '聊天记录' },
    { key: 'wp_narration_settings', label: '旁白设置' },
    { key: 'whisperphone_worldbooks_v1', label: '世界书' }
];

let backupPanelEl = null;
let bkToastEl = null;

function buildBackupPanel() {
    const panel = document.createElement('div');
    panel.id = 'backup-panel';
    panel.className = 'backup-panel';
    panel.innerHTML = `
        <div class="bk-inner">
            <div class="bk-nav">
                <div class="bk-nav-back-btn" id="bk-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="#3D3D40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="bk-nav-capsule">
                    <div class="bk-nav-title">BACKUP</div>
                    <div class="bk-nav-dot"></div>
                    <div class="bk-nav-hint">v1.0</div>
                </div>
            </div>

            <div class="bk-hero">
                <div class="bk-illo">
                    <div class="bk-illo-pulse"></div>
                    <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
                        <ellipse cx="50" cy="55" rx="32" ry="20" fill="#F4F4F6" stroke="#E8E8EC" stroke-width="1"/>
                        <circle cx="34" cy="44" r="14" fill="#F4F4F6" stroke="#E8E8EC" stroke-width="1"/>
                        <circle cx="54" cy="38" r="18" fill="#F4F4F6" stroke="#E8E8EC" stroke-width="1"/>
                        <circle cx="68" cy="48" r="12" fill="#F4F4F6" stroke="#E8E8EC" stroke-width="1"/>
                        <rect x="18" y="50" width="64" height="10" fill="#F4F4F6"/>
                        <path d="M50 62 L50 42" stroke="#D4C5C7" stroke-width="2" stroke-linecap="round"/>
                        <path d="M44 48 L50 42 L56 48" stroke="#D4C5C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        <circle cx="26" cy="32" r="1.5" fill="#D4C5C7"/>
                        <circle cx="76" cy="36" r="1" fill="#D4C5C7"/>
                        <circle cx="82" cy="56" r="1.5" fill="#C7C7CC"/>
                        <circle cx="18" cy="60" r="1" fill="#C7C7CC"/>
                        <path d="M72 28 C72 26 74 25 75 26.5 C76 25 78 26 78 28 C78 30 75 32 75 32 C75 32 72 30 72 28Z" fill="#D4C5C7" opacity="0.5"/>
                    </svg>
                </div>
                <div class="bk-hero-label">Cloud · Local · Safe</div>
            </div>

            <div class="bk-status" id="bk-status-bar">
                <div class="bk-status-dot" id="bk-status-dot"></div>
                <div class="bk-status-text" id="bk-status-text">检查中...</div>
                <div class="bk-status-time" id="bk-status-time"></div>
            </div>

            <div class="bk-sep">ACTIONS</div>
            <div class="bk-actions">
                <div class="bk-row" id="bk-export">
                    <div class="bk-row-icon export-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4v12" stroke="#6B6B70" stroke-width="2" stroke-linecap="round"/>
                            <path d="M7 9l5-5 5 5" stroke="#6B6B70" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" stroke="#6B6B70" stroke-width="2" stroke-linecap="round" fill="none"/>
                        </svg>
                    </div>
                    <div class="bk-row-body">
                        <div class="bk-row-title">导出备份</div>
                        <div class="bk-row-hint">将全部数据打包为本地文件</div>
                    </div>
                    <div class="bk-row-arrow"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="bk-row" id="bk-import">
                    <div class="bk-row-icon import-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 20V8" stroke="#9C9CA1" stroke-width="2" stroke-linecap="round"/>
                            <path d="M7 15l5 5 5-5" stroke="#9C9CA1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <path d="M4 4h16" stroke="#9C9CA1" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="bk-row-body">
                        <div class="bk-row-title">导入备份</div>
                        <div class="bk-row-hint">从本地文件恢复全部数据</div>
                    </div>
                    <div class="bk-row-arrow"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                <div class="bk-row" id="bk-check">
                    <div class="bk-row-icon check-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                        </svg>
                    </div>
                    <div class="bk-row-body">
                        <div class="bk-row-title">备份自检</div>
                        <div class="bk-row-hint">检查数据完整性与存储状态</div>
                    </div>
                    <div class="bk-row-arrow"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
            </div>

            <div class="bk-detail" id="bk-detail"></div>
            <div class="bk-footer">WHISPER · BACKUP · v1.0</div>
        </div>
    `;

    // toast
    const toast = document.createElement('div');
    toast.className = 'bk-toast';
    toast.id = 'bk-toast';
    toast.innerHTML = `
        <div class="bk-toast-icon" id="bk-toast-icon"></div>
        <div class="bk-toast-text" id="bk-toast-text"></div>
    `;
    document.body.appendChild(toast);
    bkToastEl = toast;

    document.body.appendChild(panel);
    bindBackupEvents(panel);
    return panel;
}

function bindBackupEvents(panel) {
    panel.querySelector('#bk-back').addEventListener('click', closeBackup);
    panel.querySelector('#bk-export').addEventListener('click', doExport);
    panel.querySelector('#bk-import').addEventListener('click', doImport);
    panel.querySelector('#bk-check').addEventListener('click', doCheck);
}

async function openBackup() {
    if (!backupPanelEl) {
        backupPanelEl = buildBackupPanel();
    }
    await refreshBackupDetail();
    requestAnimationFrame(() => {
        backupPanelEl.classList.add('active');
    });
}
function closeBackup() {
    if (!backupPanelEl) return;
    backupPanelEl.classList.remove('active');
}
window.openBackup = openBackup;
window.closeBackup = closeBackup;

/* ===== toast ===== */
function showBkToast(iconType, text) {
    const icon = document.getElementById('bk-toast-icon');
    const txt = document.getElementById('bk-toast-text');
    const toast = document.getElementById('bk-toast');
    toast.classList.remove('show');
    void toast.offsetWidth;
    if (iconType === 'loading') {
        icon.className = 'bk-toast-icon loading';
        icon.innerHTML = '<div class="bk-loader"></div>';
    } else {
        icon.className = 'bk-toast-icon success';
        icon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path class="check-anim" d="M6 12l4 4 8-8" stroke="#A8C5A0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    txt.textContent = text;
    toast.classList.add('show');
}
function hideBkToast(delay) {
    setTimeout(() => {
        document.getElementById('bk-toast').classList.remove('show');
    }, delay || 0);
}

/* ===== 导出 ===== */
async function doExport() {
    if (!window.WhisperDB) return;
    showBkToast('loading', '正在导出...');
    try {
        const data = { _version: 2 };

        /* WhisperDB 数据 */
        for (const item of BACKUP_KEYS) {
            const val = await WhisperDB.get(item.key);
            if (val !== null && val !== undefined) data[item.key] = val;
        }

        /* localStorage 聊天数据 */
        for (const item of CHAT_LS_KEYS) {
            try {
                const raw = localStorage.getItem(item.key);
                if (raw) data[item.key] = JSON.parse(raw);
            } catch(e) {}
        }

        /* 头像（IndexedDB key 以 avatar_ 开头） */
        const contacts = data['wp_chat_contacts'] || [];
        for (const c of contacts) {
            const av = c.settings && c.settings.avatar;
            if (av && av.startsWith('avatar_')) {
                const imgData = await WhisperDB.get(av).catch(() => null);
                if (imgData) data[av] = imgData;
            }
            /* 聊天室壁纸 */
            const wpKey = c.settings && c.settings.wallpaperKey;
            if (wpKey && wpKey.startsWith('wallpaper_')) {
                const wpData = await WhisperDB.get(wpKey).catch(() => null);
                if (wpData) data[wpKey] = wpData;
            }
        }

        /* 记忆库（localStorage key 以 wp_memory_ 开头） */
        for (const c of contacts) {
            const memKey = 'wp_memory_' + c.id;
            try {
                const memRaw = localStorage.getItem(memKey);
                if (memRaw) data[memKey] = JSON.parse(memRaw);
            } catch(e) {}
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().slice(0,10).replace(/-/g, '');
        a.href = url;
        a.download = `whisperphone_backup_${ts}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showBkToast('success', '导出成功 ✓');
        hideBkToast(2500);
    } catch (e) {
        showBkToast('success', '导出失败：' + e.message);
        hideBkToast(2000);
    }
}

/* ===== 导入 ===== */
async function doImport() {
    if (!window.WhisperDB) return;
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.onchange = async () => {
        const file = inp.files && inp.files[0];
        if (!file) return;
        showBkToast('loading', '正在导入...');
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            let count = 0;

            /* WhisperDB 数据 */
            for (const item of BACKUP_KEYS) {
                if (data[item.key] !== undefined) {
                    await WhisperDB.set(item.key, data[item.key]);
                    count++;
                }
            }

            /* localStorage 聊天数据 */
            for (const item of CHAT_LS_KEYS) {
                if (data[item.key] !== undefined) {
                    try {
                        localStorage.setItem(item.key, JSON.stringify(data[item.key]));
                        count++;
                    } catch(e) {}
                }
            }

            /* 头像和壁纸恢复 */
            for (const k of Object.keys(data)) {
                if (k.startsWith('avatar_') || k.startsWith('wallpaper_')) {
                    await WhisperDB.set(k, data[k]).catch(() => {});
                    count++;
                }
            }

            /* 记忆库恢复 */
            for (const k of Object.keys(data)) {
                if (k.startsWith('wp_memory_')) {
                    try {
                        localStorage.setItem(k, JSON.stringify(data[k]));
                        count++;
                    } catch(e) {}
                }
            }

            showBkToast('success', `导入成功 · ${count} 项`);
            hideBkToast(2500);
            await refreshBackupDetail();
            setTimeout(() => location.reload(), 2800);
        } catch (e) {
            showBkToast('success', '文件格式错误');
            hideBkToast(2000);
        }
    };
    inp.click();
}

/* ===== 自检 ===== */
async function doCheck() {
    if (!window.WhisperDB) return;
    showBkToast('loading', '正在自检...');
    await refreshBackupDetail();
    const rows = backupPanelEl.querySelectorAll('.bk-detail-dot');
    let ok = 0;
    rows.forEach(d => { if (d.classList.contains('ok')) ok++; });
    setTimeout(() => {
        showBkToast('success', `全部正常 · ${ok}/${BACKUP_KEYS.length}`);
        hideBkToast(2500);
    }, 1200);
}

/* ===== 详情面板刷新 ===== */
async function refreshBackupDetail() {
    if (!backupPanelEl || !window.WhisperDB) return;
    const detail = backupPanelEl.querySelector('#bk-detail');
    const statusDot = backupPanelEl.querySelector('#bk-status-dot');
    const statusText = backupPanelEl.querySelector('#bk-status-text');
    const statusTime = backupPanelEl.querySelector('#bk-status-time');

    const iconSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#9C9CA1"/><circle cx="12" cy="12" r="9" fill="#9C9CA1" opacity="0.2"/></svg>';

    let html = '<div class="bk-detail-head">BACKUP STATUS</div>';
    let warnCount = 0;

    /* WhisperDB 项 */
    for (const item of BACKUP_KEYS) {
        const val = await WhisperDB.get(item.key).catch(() => null);
        const has = val !== null && val !== undefined;
        let valText = has ? '已保存' : '无数据';

        if (has && item.key === 'whisperphone_custom_icons_v1') {
            const cnt = typeof val === 'object' ? Object.keys(val).length : 0;
            valText = cnt > 0 ? `${cnt} 项` : '0 项';
        }
        if (has && item.key === 'whisperphone_api_models_v1') {
            valText = Array.isArray(val) ? `${val.length} 个模型` : '已保存';
        }

        /* API配置和模型列表没有不算缺失 */
        const optional = item.key === 'whisperphone_api_v1' ||
                         item.key === 'whisperphone_api_models_v1' ||
                         item.key === 'whisperphone_custom_icons_v1' ||
                         item.key === 'whisperphone_soul_v1' ||
                         item.key === 'whisperphone_wallpaper_v1';
        if (!has && !optional) warnCount++;

        const dotClass = has ? 'ok' : 'na';
        html += `<div class="bk-detail-row">
            <div class="bk-detail-label">${iconSvg}${item.label}</div>
            <div class="bk-detail-val"><span class="bk-detail-dot ${dotClass}"></span>${valText}</div>
        </div>`;
    }

    /* localStorage 聊天项 */
    for (const item of CHAT_LS_KEYS) {
        let valText = '无数据';
        let has = false;
        try {
            const raw = localStorage.getItem(item.key);
            if (raw) {
                has = true;
                const parsed = JSON.parse(raw);
                if (item.key === 'wp_chat_contacts') {
                    valText = Array.isArray(parsed) ? `${parsed.length} 位联系人` : '已保存';
                } else if (item.key === 'wp_chat_messages') {
                    const total = Object.values(parsed).reduce(function(s, arr){ return s + (Array.isArray(arr) ? arr.length : 0); }, 0);
                    valText = `${total} 条消息`;
                } else if (item.key === 'whisperphone_worldbooks_v1') {
                    valText = Array.isArray(parsed) ? `${parsed.length} 本世界书` : '已保存';
                } else {
                    valText = '已保存';
                }
            }
        } catch(e) {}
        const dotClass = has ? 'ok' : 'na';
        html += `<div class="bk-detail-row">
            <div class="bk-detail-label">${iconSvg}${item.label}</div>
            <div class="bk-detail-val"><span class="bk-detail-dot ${dotClass}"></span>${valText}</div>
        </div>`;
    }

    detail.innerHTML = html;

    statusDot.className = 'bk-status-dot' + (warnCount > 0 ? ' warn' : '');
    statusText.textContent = warnCount > 0 ? '部分数据缺失' : '所有数据已同步';

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    statusTime.textContent = `${hh}:${mm}`;
}

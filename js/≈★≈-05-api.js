/* ============ WhisperPhone API Settings ============ */
const API_KEY_STORE = 'whisperphone_api_v1';

const DEFAULT_API = {
    baseUrl: '',
    apiKey: '',
    model: '',
    customModel: ''
};
let apiData = JSON.parse(JSON.stringify(DEFAULT_API));

const API_MODELS_STORE = 'whisperphone_api_models_v1';

async function loadApiData() {
    if (!window.WhisperDB) return;
    try {
        const saved = await WhisperDB.get(API_KEY_STORE);
        if (saved && typeof saved === 'object') {
            apiData = { ...DEFAULT_API, ...saved };
        }
        const savedModels = await WhisperDB.get(API_MODELS_STORE);
        if (Array.isArray(savedModels) && savedModels.length > 0) {
            apiModelList = savedModels;
        }
    } catch (e) {}
    window._wpApiCache = apiData;
}

function saveApiData() {
    if (!window.WhisperDB) return;
    WhisperDB.set(API_KEY_STORE, apiData).catch(() => {});
    window._wpApiCache = apiData;
}

function saveApiModels() {
    if (!window.WhisperDB) return;
    WhisperDB.set(API_MODELS_STORE, apiModelList).catch(() => {});
}

const CHECK_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 12l4 4 8-8" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let apiModelList = [];

function setApiModels(models) {
    apiModelList = models || [];
    if (apiPanelEl) refreshModelList(apiPanelEl);
}
window.setApiModels = setApiModels;

let apiPanelEl = null;

const MODEL_VENDORS = [
    { key: 'openai',    label: 'OpenAI',    icon: 'gi-openai',    letter: 'O',
      match: ['gpt', 'o1', 'o3', 'chatgpt', 'dall-e', 'whisper', 'tts', 'davinci', 'babbage', 'text-embedding', 'omni'] },
    { key: 'google',    label: 'Google',    icon: 'gi-google',    letter: 'G',
      match: ['gemini', 'gemma', 'palm', 'bison', 'gecko', 'google'] },
    { key: 'anthropic', label: 'Anthropic', icon: 'gi-anthropic', letter: 'A',
      match: ['claude', 'anthropic'] },
    { key: 'meta',      label: 'Meta',      icon: 'gi-meta',      letter: 'M',
      match: ['llama', 'meta-llama', 'codellama'] },
    { key: 'mistral',   label: 'Mistral',   icon: 'gi-mistral',   letter: 'Mi',
      match: ['mistral', 'mixtral', 'codestral', 'pixtral', 'ministral'] },
    { key: 'deepseek',  label: 'DeepSeek',  icon: 'gi-other',     letter: 'D',
      match: ['deepseek'] },
    { key: 'qwen',      label: 'Qwen',      icon: 'gi-other',     letter: 'Q',
      match: ['qwen', 'qwq'] },
    { key: 'yi',        label: 'Yi',        icon: 'gi-other',     letter: 'Yi',
      match: ['yi-'] },
    { key: 'cohere',    label: 'Cohere',    icon: 'gi-other',     letter: 'C',
      match: ['command', 'cohere'] },
    { key: 'perplexity',label: 'Perplexity', icon: 'gi-other',    letter: 'P',
      match: ['pplx', 'perplexity', 'sonar'] }
];

function detectVendor(modelId) {
    const lower = modelId.toLowerCase();
    for (const v of MODEL_VENDORS) {
        for (const m of v.match) {
            if (lower.includes(m)) return v.key;
        }
    }
    const parts = lower.split('/');
    if (parts.length >= 2) {
        const prefix = parts[0];
        for (const v of MODEL_VENDORS) {
            if (prefix.includes(v.key)) return v.key;
        }
    }
    return '__other__';
}

function groupModels(list) {
    const groups = {};
    list.forEach(m => {
        const vendor = detectVendor(m.id || m.name || '');
        if (!groups[vendor]) groups[vendor] = [];
        groups[vendor].push(m);
    });
    return groups;
}

function getVendorInfo(key) {
    const found = MODEL_VENDORS.find(v => v.key === key);
    if (found) return found;
    return { key: '__other__', label: 'Other', icon: 'gi-other', letter: '?' };
}

function buildModelCards() {
    if (apiModelList.length === 0) {
        return '<div class="api-model-empty">暂无模型 · 请先保存 API 并获取</div>';
    }
    const groups = groupModels(apiModelList);
    const sortedKeys = Object.keys(groups).sort((a, b) => {
        if (a === '__other__') return 1;
        if (b === '__other__') return -1;
        return groups[b].length - groups[a].length;
    });

    let html = '';
    sortedKeys.forEach(key => {
        const info = getVendorInfo(key);
        const models = groups[key];
        const openClass = '';

        html += `<div class="api-model-group${openClass}" data-vendor="${key}">`;
        html += `<div class="api-model-group-head">`;
        html += `<div class="api-model-group-icon ${info.icon}">${info.letter}</div>`;
        html += `<div class="api-model-group-name">${info.label}</div>`;
        html += `<div class="api-model-group-count">${models.length}</div>`;
        html += `<div class="api-model-group-arrow"><svg width="12" height="12" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
        html += `</div>`;
        html += `<div class="api-model-group-body">`;

        models.forEach(m => {
            const sel = (apiData.model === m.id) ? ' selected' : '';
            const chk = (apiData.model === m.id) ? CHECK_SVG : '';
            const displayName = m.name || m.id;
            const hint = m.hint || m.id;
            html += `
            <div class="api-model-card${sel}" data-model="${m.id}">
                <div class="api-model-body">
                    <div class="api-model-name">${displayName}</div>
                    <div class="api-model-hint">${hint}</div>
                </div>
                <div class="api-model-check">${chk}</div>
            </div>`;
        });

        html += `</div></div>`;
    });

    return html;
}

function refreshModelList(panel) {
    const list = panel.querySelector('#api-model-list');
    list.innerHTML = buildModelCards();

    list.querySelectorAll('.api-model-group-head').forEach(head => {
        head.addEventListener('click', () => {
            const group = head.closest('.api-model-group');
            group.classList.toggle('open');
        });
    });

    list.querySelectorAll('.api-model-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            list.querySelectorAll('.api-model-card').forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.api-model-check').innerHTML = '';
            });
            card.classList.add('selected');
            card.querySelector('.api-model-check').innerHTML = CHECK_SVG;
        });
    });
}

function buildApiPanel() {
    const panel = document.createElement('div');
    panel.id = 'api-panel';
    panel.className = 'api-panel';

    const modelCards = buildModelCards();

    panel.innerHTML = `
        <div class="api-inner">
            <div class="api-nav">
                <div class="api-nav-back-btn" id="api-back">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="#3D3D40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="api-nav-capsule">
                    <div class="api-nav-title">API</div>
                    <div class="api-nav-dot"></div>
                    <div class="api-nav-hint">LOCAL ONLY</div>
                </div>
            </div>

            <div class="api-hero">
                <div class="api-illo">
                    <div class="api-illo-ring"></div>
                    <svg width="130" height="130" viewBox="0 0 80 80" fill="none">
                        <rect x="12" y="14" width="56" height="44" rx="8" fill="#F4F4F6" stroke="#E8E8EC" stroke-width="1"/>
                        <rect x="12" y="14" width="56" height="12" rx="8" fill="#E8E8EC"/>
                        <rect x="12" y="22" width="56" height="4" fill="#E8E8EC"/>
                        <circle cx="20" cy="20" r="2" fill="#D4A5A5" opacity="0.6"/>
                        <circle cx="27" cy="20" r="2" fill="#C2D5CC" opacity="0.6"/>
                        <circle cx="34" cy="20" r="2" fill="#C7C7CC" opacity="0.4"/>
                        <rect x="18" y="32" width="20" height="2.5" rx="1" fill="#C2D5CC" opacity="0.6"/>
                        <rect x="18" y="38" width="32" height="2.5" rx="1" fill="#C7C7CC" opacity="0.35"/>
                        <rect x="18" y="44" width="14" height="2.5" rx="1" fill="#C2D5CC" opacity="0.5"/>
                        <rect x="35" y="44" width="18" height="2.5" rx="1" fill="#C7C7CC" opacity="0.25"/>
                        <rect x="18" y="50" width="2" height="4" rx="0.5" fill="#C2D5CC"><animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/></rect>
                        <line x1="40" y1="8" x2="40" y2="14" stroke="#C2D5CC" stroke-width="1.5" stroke-linecap="round"/>
                        <circle cx="40" cy="6" r="2.5" fill="#E5EDE9" stroke="#C2D5CC" stroke-width="1"/>
                        <circle cx="62" cy="10" r="1" fill="#C2D5CC" opacity="0.5"/>
                        <circle cx="8" cy="40" r="1" fill="#C7C7CC" opacity="0.4"/>
                        <path d="M66 52 C66 50 68 49 69 50.5 C70 49 72 50 72 52 C72 54 69 56 69 56 C69 56 66 54 66 52Z" fill="#C2D5CC" opacity="0.35"/>
                    </svg>
                </div>
                <div class="api-hero-sub">Connect · Create · Whisper</div>
            </div>

            <div class="api-conn">
                <div class="api-conn-dot off" id="api-conn-dot"></div>
                <div class="api-conn-text" id="api-conn-text">未连接</div>
                <div class="api-conn-ping" id="api-conn-ping"></div>
            </div>

            <div class="api-sep">ENDPOINT</div>
            <div class="api-field">
                <div class="api-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#9C9CA1" stroke-width="1.5" fill="none"/><path d="M2 12h20" stroke="#9C9CA1" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="#9C9CA1" stroke-width="1.5" fill="none"/></svg>
                    Base URL
                </div>
                <div class="api-input-wrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" stroke="#C7C7CC" stroke-width="1.8" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" stroke="#C7C7CC" stroke-width="1.8" stroke-linecap="round"/></svg>
                    <input class="api-input" id="api-url" type="text" placeholder="https://api.openai.com" value="${apiData.baseUrl}">
                    <div class="api-input-action" id="api-url-clear">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#C7C7CC" stroke-width="2" stroke-linecap="round"/></svg>
                    </div>
                </div>
                <div class="api-presets" id="api-presets">
                    <div class="api-preset-chip" data-url="https://api.openai.com">OpenAI</div>
                    <div class="api-preset-chip" data-url="https://api.anthropic.com">Anthropic</div>
                    <div class="api-preset-chip" data-url="https://openrouter.ai/api">OpenRouter</div>
                </div>
            </div>

            <div class="api-sep">AUTHENTICATION</div>
            <div class="api-field">
                <div class="api-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 0-7.8 7.8 5.5 5.5 0 0 0 7.8-7.8zm0 0L15 7l2 2 4-4" stroke="#9C9CA1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                    API Key
                    <span class="badge">local only</span>
                </div>
                <div class="api-input-wrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 0-7.8 7.8 5.5 5.5 0 0 0 7.8-7.8zm0 0L15 7l2 2 4-4" stroke="#C7C7CC" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                    <input class="api-input" id="api-key" type="text" placeholder="sk-..." value="${apiData.apiKey}">
                    <div class="api-input-action" id="api-key-toggle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#C7C7CC" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke="#C7C7CC" stroke-width="1.5" fill="none"/></svg>
                    </div>
                </div>
            </div>

            <div class="api-sep">MODEL</div>
            <div class="api-model-list" id="api-model-list">${modelCards}</div>

            <div class="api-btns">
                <button class="api-btn save" id="api-save">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 12l4 4 8-8" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    保存
                </button>
                <button class="api-btn test" id="api-test">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                    测试连接
                </button>
            </div>

            <div class="api-footer">WHISPER · API · LOCAL ONLY</div>
        </div>
    `;

    document.body.appendChild(panel);
    bindApiEvents(panel);
    return panel;
}

function bindApiEvents(panel) {
    panel.querySelector('#api-back').addEventListener('click', closeApi);

    panel.querySelector('#api-url-clear').addEventListener('click', () => {
        panel.querySelector('#api-url').value = '';
    });

    panel.querySelectorAll('.api-preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            panel.querySelector('#api-url').value = chip.dataset.url;
        });
    });

    panel.querySelector('#api-key-toggle').addEventListener('click', () => {
        const inp = panel.querySelector('#api-key');
        inp.type = inp.type === 'password' ? 'text' : 'password';
    });

    panel.querySelectorAll('.api-model-group-head').forEach(head => {
        head.addEventListener('click', () => {
            const group = head.closest('.api-model-group');
            group.classList.toggle('open');
        });
    });

    panel.querySelectorAll('.api-model-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.querySelectorAll('.api-model-card').forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.api-model-check').innerHTML = '';
            });
            card.classList.add('selected');
            card.querySelector('.api-model-check').innerHTML = CHECK_SVG;
        });
    });

    panel.querySelector('#api-save').addEventListener('click', () => {
        apiData.baseUrl = panel.querySelector('#api-url').value.trim();
        apiData.apiKey = panel.querySelector('#api-key').value.trim();
        const selCard = panel.querySelector('.api-model-card.selected');
        apiData.model = selCard ? selCard.dataset.model : '';
        saveApiData();
        updateConnStatus(panel, 'ok', '已保存 ✓', '');
        setTimeout(() => {
            if (apiModelList.length > 0) {
                updateConnStatus(panel, 'ok', '已连接 · ' + apiModelList.length + ' 个模型', '');
            } else {
                updateConnStatus(panel, 'off', '未连接', '');
            }
        }, 2000);
    });

    panel.querySelector('#api-test').addEventListener('click', () => {
        fetchModels(panel);
    });
}

function updateConnStatus(panel, type, text, ping) {
    const dot = panel.querySelector('#api-conn-dot');
    const txt = panel.querySelector('#api-conn-text');
    const pg = panel.querySelector('#api-conn-ping');
    dot.className = 'api-conn-dot ' + type;
    txt.textContent = text;
    pg.textContent = ping;
}

async function fetchModels(panel) {
    const url = panel.querySelector('#api-url').value.trim();
    const key = panel.querySelector('#api-key').value.trim();
    if (!url) {
        updateConnStatus(panel, 'err', '请填写 Base URL', '');
        return;
    }
    updateConnStatus(panel, 'off', '正在连接...', '');
    const start = Date.now();
    try {
        let testUrl = url.replace(/\/+$/, '');
        if (!testUrl.includes('/v1/models')) {
            testUrl += '/v1/models';
        }
        const headers = {};
        if (key) headers['Authorization'] = 'Bearer ' + key;
        const resp = await fetch(testUrl, {
            method: 'GET',
            headers: headers,
            signal: AbortSignal.timeout(15000)
        });
        const ms = Date.now() - start;
        if (resp.ok) {
            const json = await resp.json();
            const models = (json.data || json || []);
            const list = Array.isArray(models) ? models : [];
            apiModelList = list.map(m => ({
                id: m.id || m.name || '',
                name: m.id || m.name || 'Unknown',
                hint: m.owned_by || m.object || ''
            })).sort((a, b) => a.name.localeCompare(b.name));
            refreshModelList(panel);
            updateConnStatus(panel, 'ok', `已连接 · ${apiModelList.length} 个模型`, ms + 'ms');
            apiData.baseUrl = url;
            apiData.apiKey = key;
            saveApiData();
            saveApiModels();
        } else {
            apiModelList = [];
            refreshModelList(panel);
            updateConnStatus(panel, 'err', '连接失败 · ' + resp.status, ms + 'ms');
        }
    } catch (e) {
        const ms = Date.now() - start;
        apiModelList = [];
        refreshModelList(panel);
        updateConnStatus(panel, 'err', '连接超时或被拒绝', ms + 'ms');
    }
}

async function openApi() {
    if (!apiPanelEl) {
        await loadApiData();
        apiPanelEl = buildApiPanel();
        requestAnimationFrame(() => {
            if (apiModelList.length > 0) {
                updateConnStatus(apiPanelEl, 'ok', '已连接 · ' + apiModelList.length + ' 个模型', '');
            }
            apiPanelEl.classList.add('active');
        });
    } else {
        refreshModelList(apiPanelEl);
        if (apiModelList.length > 0) {
            updateConnStatus(apiPanelEl, 'ok', '已连接 · ' + apiModelList.length + ' 个模型', '');
        }
        requestAnimationFrame(() => {
            apiPanelEl.classList.add('active');
        });
    }
}

/* 启动时预加载 API 数据，让 chat 能直接读 */
(async function preloadApi(){
    await loadApiData();
})();
function closeApi() {
    if (!apiPanelEl) return;
    apiPanelEl.classList.remove('active');
}
window.openApi = openApi;
window.closeApi = closeApi;

/* 接入 home：点击 A.I (a4) 打开 */
document.addEventListener('click', (e) => {
    const item = e.target.closest('.g-item.app');
    if (!item) return;
    if (document.body.classList.contains('edit-mode')) return;
    if (item.dataset.id === 'a4') {
        e.stopPropagation();
        openApi();
    }
});

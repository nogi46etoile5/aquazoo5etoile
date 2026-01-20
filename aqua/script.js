let currentCategory = 'aquarium';

// 画面を表示するメインの関数
function render() {
    // 1. HTMLから「どのエリア」「どのタグ」が選ばれているか取得
    const activeArea = document.querySelector('.area-button.active').dataset.area;
    const activeTags = Array.from(document.querySelectorAll('.tag-button.active')).map(btn => btn.dataset.tag);
    
    const listEl = document.getElementById('facility-list');
    const countEl = document.getElementById('facility-count');

// 2. data.jsの300件データ(allFacilities)から絞り込み
    const filtered = allFacilities.filter(f => {
        const matchCat = f.category === currentCategory;
        const matchArea = activeArea === 'all' || f.area === activeArea;
        // 選んだタグがすべて含まれているかチェック
        const matchTags = activeTags.every(t => f.tags.includes(t));
        return matchCat && matchArea && matchTags;
    });

// 3. 件数を表示
countEl.textContent = `${filtered.length} 件の施設が見つかりました`;

// 4. カードを生成して画面に出す
listEl.innerHTML = filtered.map(f => {
    // --- ★ここに追加：バッジの判定ロジック ---
    let badge = '';
    if (f.highlight.includes("2026年")) {
        badge = '<span class="badge-new">👶 NEW BABY</span>';
    } else if (f.highlight.includes("論文")) {
        badge = '<span class="badge-paper">📝 ACADEMIC</span>';
    }
    // --------------------------------------

    return `
    <div class="facility-card">
        <div class="card-inner">
            <h3>${badge}${f.name}</h3> <div class="facility-address">📍 ${f.address}</div>
            <div class="facility-highlight">${f.highlight}</div>
            <div class="tag-container">
                ${f.tags.map(t => `<span class="tag-chip ${t === 'paper' ? 'important' : ''}">${translateTag(t)}</span>`).join('')}
            </div>
            <a href="${f.url}" target="_blank" class="facility-link">公式サイトを見る →</a>
        </div>
    </div>
    `;
}).join('');
}


// タグの英語名を日本語に変換する辞書
function translateTag(tag) {
    const dict = { paper: "論文", research: "研究展示", conservation: "保全活動", rare_species: "希少生物", small_scale: "小規模施設", access_good: "アクセス良", night_open: "夜間営業", touch_experience: "ふれあい", show: "ショー", wheelchair: "車椅子可", toilet: "多目的トイレ", for_family: "家族向け", for_date: "デート", for_solo: "一人旅", indoor: "屋内メイン" };
    return dict[tag] || tag;
}

// --- ボタンをクリックした時の動き ---

// 水族館・動物園の切り替え
document.getElementById('btn-aquarium').addEventListener('click', (e) => {
    document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = 'aquarium';
    render();
});

document.getElementById('btn-zoo').addEventListener('click', (e) => {
    document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = 'zoo';
    
    render();
});

// エリアボタンの切り替え
document.getElementById('area-filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('area-button')) return;
    document.querySelectorAll('.area-button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render();
});

// タグボタンの切り替え（複数選択できる）
document.getElementById('tag-filters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('tag-button')) return;
    e.target.classList.toggle('active');
    render();
});

// 最初にページを開いたときに1回実行する
window.onload = render;
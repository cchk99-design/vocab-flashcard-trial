const categories = [
    { id: "fruits", name: "🍎 水果" },
    { id: "veggies", name: "🥦 蔬菜" },
    { id: "furniture", name: "🛋️ 家具" }
];

// 請根據你 images/vocab/ 內的實際圖片數量修改這裡的數字
const categoryCounts = { 
    fruits: 3, 
    veggies: 3, 
    furniture: 3 
};

const vocabItems = [];
let globalId = 1;

for (const [catId, count] of Object.entries(categoryCounts)) {
    for (let i = 1; i <= count; i++) {
        vocabItems.push({
            id: globalId++,
            cat: catId,
            // 完美對應 Windows 批次命名格式: "fruits (1).png"
            img: `images/vocab/${catId} (${i}).png` 
        });
    }
}

let selectedIds = new Set();
let gameQueue = [];
let currentIdx = 0;

function renderBank() {
    const container = document.getElementById('bank-content');
    container.innerHTML = '';
    categories.forEach(cat => {
        const section = document.createElement('div');
        section.innerHTML = `<h3 style="text-align:left; margin-left:20px; color:#5D4037;">${cat.name}</h3>`;
        const grid = document.createElement('div');
        grid.className = 'grid';
        vocabItems.filter(i => i.cat === cat.id).forEach(item => {
            const card = document.createElement('div');
            card.className = `vocab-card ${selectedIds.has(item.id) ? 'selected' : ''}`;
            card.innerHTML = `<img src="${item.img}" onerror="this.src='https://via.placeholder.com/150?text=Missing+Image'">`;
            card.onclick = () => {
                selectedIds.has(item.id) ? selectedIds.delete(item.id) : selectedIds.add(item.id);
                card.classList.toggle('selected');
                updateUI();
            };
            grid.appendChild(card);
        });
        section.appendChild(grid);
        container.appendChild(section);
    });
}

function updateUI() {
    document.getElementById('selected-count').innerText = selectedIds.size;
    const btn = document.getElementById('start-btn');
    btn.disabled = selectedIds.size === 0;
    btn.className = `nav-btn ${selectedIds.size === 0 ? 'disabled' : ''}`;
}

function startSelectedGame() {
    gameQueue = vocabItems.filter(item => selectedIds.has(item.id));
    currentIdx = 0;
    document.getElementById('bank-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    loadStage();
}

function loadStage() {
    document.getElementById('current-img').src = gameQueue[currentIdx].img;
    document.getElementById('game-progress').innerText = `第 ${currentIdx + 1} 張 / 共 ${gameQueue.length} 張`;
    document.querySelectorAll('.flip-card').forEach(c => c.classList.remove('flipped'));
}

function nextPhoto() {
    if (currentIdx < gameQueue.length - 1) {
        currentIdx++; loadStage();
    } else {
        alert("恭喜！已完成本次練習。");
        exitGame();
    }
}

function exitGame() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('bank-screen').classList.remove('hidden');
    window.scrollTo(0,0);
}

function toggleFlip(el) { el.classList.toggle('flipped'); }

renderBank();

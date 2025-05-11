// 游戏状态
const gameState = {
    currentLevel: null,
    completed: 0,
    correct: 0,
    attempts: 0,
    selectedTiles: []
};

// DOM元素
const tilesContainer = document.getElementById('tiles');
const nextBtn = document.getElementById('next');
const skipBtn = document.getElementById('skip');
const targetElement = document.getElementById('target');
const levelNameElement = document.getElementById('level-name');
const completedElement = document.getElementById('completed');
const totalElement = document.getElementById('total');
const accuracyElement = document.getElementById('accuracy');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalButton = document.getElementById('modal-button');

// 初始化游戏
function initGame() {
    totalElement.textContent = levels.length;
    updateStats();
    loadRandomLevel();
}

// 加载随机关卡
function loadRandomLevel() {
    gameState.currentLevel = getRandomLevel();
    gameState.selectedTiles = [];
    
    targetElement.textContent = gameState.currentLevel.target;
    levelNameElement.textContent = gameState.currentLevel.name;
    
    renderTiles();
}

// 渲染图块
function renderTiles() {
    tilesContainer.innerHTML = '';
    const size = gameState.currentLevel.size;
    tilesContainer.style.gridTemplateColumns = `repeat(${size},1fr)`;
    const shuffledTiles = [...gameState.currentLevel.tiles].sort(() => Math.random() - 0.5);
    
    shuffledTiles.forEach((tile) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.textContent = tile.emoji;
        tileElement.dataset.index = gameState.currentLevel.tiles.indexOf(tile); // 关键修改：使用原始索引
        tileElement.addEventListener('click', () => {
            tileElement.classList.toggle('selected');
            const index = parseInt(tileElement.dataset.index);
            if (tileElement.classList.contains('selected')) {
                gameState.selectedTiles.push(index);
            } else {
                gameState.selectedTiles = gameState.selectedTiles.filter(i => i !== index);
            }
        });
        tilesContainer.appendChild(tileElement);
    });
    
}


// 验证选择
function verifySelection() {
    gameState.attempts++;
    
    const correctTiles = gameState.currentLevel.tiles
        .map((tile, index) => tile.correct ? index : -1)
        .filter(i => i !== -1);
    
    const allCorrectSelected = correctTiles.every(i => 
        gameState.selectedTiles.includes(i));
    
    const noIncorrectSelected = gameState.selectedTiles.every(i => 
        gameState.currentLevel.tiles[i].correct);
    
    const modalIcon = document.getElementById('modal-icon');
    
    if (allCorrectSelected && noIncorrectSelected) {
        gameState.correct++;
        gameState.completed++;
        modalIcon.className = 'fas fa-check-circle';
        modalIcon.parentElement.classList.remove('failure');
        showModal('验证成功', '恭喜你通过了本关卡！');
    } else {
        modalIcon.className = 'fas fa-times-circle';
        modalIcon.parentElement.classList.add('failure');
        showModal('验证失败', '请检查你的选择并重试！');
    }
    
    updateStats();
}

// 更新统计信息
function updateStats() {
    completedElement.textContent = gameState.completed;
    
    const accuracy = gameState.attempts > 0 
        ? Math.round((gameState.correct / gameState.attempts) * 100) 
        : 0;
    accuracyElement.textContent = accuracy;
}

// 显示模态框
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

// 隐藏模态框
function hideModal() {
    modal.style.display = 'none';
}

// 事件监听
nextBtn.addEventListener('click', verifySelection);
skipBtn.addEventListener('click', loadRandomLevel);
modalButton.addEventListener('click', () => {
    hideModal();
    loadRandomLevel();
});

// 初始化游戏
initGame();
document.addEventListener('DOMContentLoaded', function() {
    // 元素引用
    const imageContainer = document.querySelector('.verification-image-container');
    const image = document.getElementById('verification-image');
    const puzzle = document.getElementById('verification-puzzle');
    const target = document.getElementById('verification-target');
    const trackThumb = document.getElementById('track-thumb');
    const trackProgress = document.getElementById('track-progress');
    const trackSuccess = document.getElementById('track-success');
    const resultText = document.getElementById('verification-result');
    const refreshButton = document.getElementById('refresh-button');
    
    // 验证参数
    let targetX = 0;
    let isVerified = false;
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    let currentPuzzleX = 0;
    
    // 初始化验证
    function initVerification() {
        isVerified = false;
        resultText.textContent = '';
        trackProgress.style.width = '0';
        trackSuccess.style.opacity = '0';
        trackThumb.style.left = '0';
        puzzle.style.display = 'block';
        target.style.display = 'block';
        
        // 随机选择图片
        image.src = `https://picsum.photos/300/180?random=${Math.floor(Math.random() * 1000)}`;
        
        // 图片加载完成后设置拼图位置
        image.onload = function() {
            const containerWidth = imageContainer.offsetWidth;
            
            // 随机生成目标位置 (限制在中间区域)
            const minX = containerWidth * 0.3;
            const maxX = containerWidth * 0.7 - 50;
            
            targetX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            
            // 设置目标位置
            target.style.left = targetX + 'px';
            target.style.top = '50%';
            target.style.transform = 'translateY(-50%)';
            target.style.width = '50px';
            target.style.height = '50px';
            
            // 设置拼图初始位置
            puzzle.style.left = '10px';
            puzzle.style.top = '50%';
            puzzle.style.transform = 'translateY(-50%)';
            currentPuzzleX = 10;
        };
    }
    
    // 处理滑块拖动开始
    function handleDragStart(e) {
        if (isVerified) return;
        
        isDragging = true;
        
        // 获取初始位置
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX;
        } else {
            startX = e.clientX;
            e.preventDefault(); // 防止文本选择
        }
        
        startLeft = parseInt(trackThumb.style.left || '0px');
    }
    
    // 处理滑块拖动
    function handleDragMove(e) {
        if (!isDragging || isVerified) return;
        
        let clientX;
        
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        // 计算移动距离
        const dx = clientX - startX;
        
        // 限制在轨道范围内
        const trackWidth = document.querySelector('.verification-track').offsetWidth;
        const thumbWidth = 40;
        
        let newLeft = startLeft + dx;
        newLeft = Math.max(0, Math.min(newLeft, trackWidth - thumbWidth));
        
        // 更新滑块位置
        trackThumb.style.left = newLeft + 'px';
        
        // 更新进度条
        const progress = (newLeft / (trackWidth - thumbWidth)) * 100;
        trackProgress.style.width = progress + '%';
        
        // 更新拼图位置
        const containerWidth = imageContainer.offsetWidth;
        currentPuzzleX = (newLeft / (trackWidth - thumbWidth)) * (containerWidth - 50);
        puzzle.style.left = currentPuzzleX + 'px';
    }
    
    // 处理拖动结束（松手时判断）
    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // 检查是否到达目标位置 (允许±10px的误差)
        if (Math.abs(currentPuzzleX - targetX) < 10) {
            verifySuccess();
        } else {
            // 未验证成功，滑块返回初始位置
            trackThumb.style.left = '0';
            trackProgress.style.width = '0';
            puzzle.style.left = '10px';
            currentPuzzleX = 10;
        }
    }
    
    // 验证成功处理
    function verifySuccess() {
        isVerified = true;
        resultText.textContent = '验证成功！';
        trackSuccess.style.opacity = '1';
        
        // 拼图移动到目标位置
        puzzle.style.left = targetX + 'px';
        currentPuzzleX = targetX;
        
        // 隐藏目标框
        target.style.display = 'none';
        
        // 这里可以添加验证通过后的回调
        console.log('验证通过');
    }
    
    // 事件监听 - 鼠标/触摸
    trackThumb.addEventListener('mousedown', handleDragStart);
    trackThumb.addEventListener('touchstart', handleDragStart, { passive: false });
    
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    
    // 刷新按钮
    refreshButton.addEventListener('click', initVerification);
    
    // 初始化
    initVerification();
    
    // 更新时间
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.time').textContent = `${hours}:${minutes}`;
    }
    
    updateTime();
    setInterval(updateTime, 60000);
});
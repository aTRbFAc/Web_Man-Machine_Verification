document.addEventListener('DOMContentLoaded', function() {
    const sliderThumb = document.getElementById('slider-thumb');
    const sliderTrack = document.querySelector('.slider-track');
    const rotatedImage = document.getElementById('rotated-image');
    const verificationResult = document.getElementById('verification-result');
    
    let isDragging = false;
    let currentRotation = 0;
    let targetRotation = 0;
    const MAX_ROTATION = 180; // 最大旋转角度
    
    // 初始化图片
    loadRandomImage();
    
    // 设置滑块事件监听
    sliderThumb.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    sliderThumb.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        sliderThumb.style.cursor = 'grabbing';
        verificationResult.textContent = '';
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const trackRect = sliderTrack.getBoundingClientRect();
        const trackWidth = trackRect.width;
        
        let thumbPosition = clientX - trackRect.left;
        thumbPosition = Math.max(0, Math.min(thumbPosition, trackWidth));
        
        sliderThumb.style.left = `${thumbPosition}px`;
        
        // 关键修改：计算旋转角度 (0到MAX_ROTATION度之间)
        // 始终保持同一方向旋转
        const rotation = (thumbPosition / trackWidth) * MAX_ROTATION;
        
        // 当前显示的角度 = 滑块控制的旋转角度 - 目标旋转角度
        currentRotation = rotation;
        updateImageRotation();
    }
    
    function endDrag() {
        isDragging = false;
        sliderThumb.style.cursor = 'grab';
        checkVerification();
    }
    
    function updateImageRotation() {
        // 实际显示的角度 = 当前旋转角度 - 目标旋转角度
        // 这样用户需要将滑块拖动到目标位置才能使图片归正
        rotatedImage.style.transform = `rotate(${currentRotation - targetRotation}deg)`;
    }
    
    function loadRandomImage() {
        verificationResult.textContent = '';
        rotatedImage.src = `https://picsum.photos/300/180?random=1`;
        
        // 随机设置目标旋转位置 (在滑块范围的20%-80%之间)
        targetRotation = MAX_ROTATION * (0.2 + Math.random() * 0.6);
        currentRotation = 0;
        
        // 重置滑块位置到最左
        sliderThumb.style.left = '0px';
        
        rotatedImage.onload = function() {
            // 初始状态：图片旋转了-targetRotation度
            // 用户需要将滑块拖动到targetRotation位置使图片归正
            updateImageRotation();
        };
    }
    
    function checkVerification() {
        // 检查当前旋转角度是否接近目标位置 (允许5度的误差)
        const isVerified = Math.abs(currentRotation - targetRotation) <= 5;
        
        if (isVerified) {
            verificationResult.textContent = '验证成功！';
            verificationResult.style.color = '#4CAF50';
        } else {
            verificationResult.textContent = '请继续调整...';
            verificationResult.style.color = '#FF5722';
        }
    }
});
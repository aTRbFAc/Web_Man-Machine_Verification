class AudioCaptcha {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.currentCaptcha = '';
        this.attempts = 3;
        this.isPlaying = false;
        this.createVisualizer();
    }
  
    // 生成验证码
    generate(length = 6) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.currentCaptcha = Array.from({ length }, () => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        this.attempts = 3; // 重置尝试次数
        document.getElementById('attemptsCounter').textContent = `剩余尝试次数: ${this.attempts}`;
        document.getElementById('message').style.display = 'none';
        document.getElementById('userInput').value = '';
        return this.currentCaptcha;
    }
  
    // 创建可视化元素
    createVisualizer() {
        const visualizer = document.getElementById('visualizer');
        visualizer.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar';
            bar.style.left = `${i * 10}px`;
            visualizer.appendChild(bar);
        }
    }
  
  
    // 播放验证码
    async speak() {
        if (this.isPlaying) return;
        if (!this.currentCaptcha) this.generate();
        
        this.isPlaying = true;
        const button = document.getElementById('playButton');
        button.disabled = true;
  
        try {
            // 逐个播放字符
            for (const char of this.currentCaptcha) {
                if (!this.isPlaying) break; // 如果中途停止
                
                await this.playSound(`./assets/audio/${char}.mp3`);
                this.animateBars();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error('播放错误:', error);
        } finally {
            this.isPlaying = false;
            this.stopBarsAnimation();
            setTimeout(() => button.disabled = false, 1000);
        }
    }
  
     // 动画效果
     animateBars() {
        const bars = document.querySelectorAll('.audio-bar');
        bars.forEach((bar, index) => {
            bar.style.animation = `audioAnimation ${0.5 + Math.random() * 0.5}s infinite`;
            bar.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // 停止动画
    stopBarsAnimation() {
        const bars = document.querySelectorAll('.audio-bar');
        bars.forEach(bar => {
            bar.style.animation = 'none';
            bar.style.height = '20%';
        });
    }
  
    // 播放单个音频文件
async playSound(url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            this.audioContext.decodeAudioData(
                request.response,
                (audioBuffer) => {
                    const source = this.audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(this.audioContext.destination);
                    source.start(0);
                    source.onended = resolve;
                },
                (error) => reject(error)
            );
        };
        request.onerror = () => reject(new Error("XHR 请求失败"));
        request.send();
    });
}

  
    // 验证输入
    validate(input) {
        if (!input || typeof input !== 'string') {
            return {
                isValid: false,
                attemptsLeft: this.attempts,
                isLocked: false,
                message: '请输入验证码'
            };
        }

        const normalizedInput = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const isValid = normalizedInput === this.currentCaptcha;
  
        if (!isValid) {
            this.attempts--;
            document.getElementById('attemptsCounter').textContent = `剩余尝试次数: ${this.attempts}`;
            
            if (this.attempts <= 0) {
                const oldCaptcha = this.currentCaptcha;
                this.generate();
                return {
                    isValid: false,
                    attemptsLeft: 0,
                    isLocked: true,
                    message: `尝试次数已用完，验证码已刷新 (原: ${oldCaptcha})`
                };
            }
        }
  
        return {
            isValid,
            attemptsLeft: this.attempts,
            isLocked: false,
            message: isValid ? '验证成功！' : `验证码错误，还剩 ${this.attempts} 次尝试`
        };
    }

    // 停止播放
    stop() {
        this.isPlaying = false;
        this.stopBarsAnimation();
    }
}

// 初始化
const audioCaptcha = new AudioCaptcha();
audioCaptcha.generate();
  
// 绑定按钮事件
document.getElementById('playButton').addEventListener('click', () => {
    audioCaptcha.speak();
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const input = document.getElementById('userInput').value;
    const result = audioCaptcha.validate(input);
    const message = document.getElementById('message');
    
    message.textContent = result.message;
    message.className = `message ${result.isValid ? 'success' : 'error'}`;
    message.style.display = 'block';
    
    if (result.isLocked) {
        document.getElementById('submitBtn').disabled = true;
    }
});

document.getElementById('refreshBtn').addEventListener('click', () => {
    audioCaptcha.stop();
    audioCaptcha.generate();
    document.getElementById('submitBtn').disabled = false;
});

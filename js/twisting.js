        // 生成随机验证码
        function generateCaptcha() {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let captcha = '';
            for (let i = 0; i < 6; i++) {
                captcha += chars[Math.floor(Math.random() * chars.length)];
            }
            return captcha;
        }
        
        // 显示验证码
        function displayCaptcha(captcha) {
            const captchaImage = document.getElementById('captchaImage');
            captchaImage.innerHTML = '';
            
            // 为每个字符创建单独的span以便单独处理
            for (let i = 0; i < captcha.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.textContent = captcha[i];
                
                // 随机旋转角度 (-30到30度)
                const rotate = Math.floor(Math.random() * 60) - 30;
                
                // 随机颜色
                const r = Math.floor(Math.random() * 100) + 100;
                const g = Math.floor(Math.random() * 100) + 100;
                const b = Math.floor(Math.random() * 100) + 100;
                
                // 随机位置偏移
                const yOffset = Math.floor(Math.random() * 10) - 5;
                
                charSpan.style.display = 'inline-block';
                charSpan.style.transform = `rotate(${rotate}deg) translateY(${yOffset}px)`;
                charSpan.style.color = `rgb(${r},${g},${b})`;
                charSpan.style.fontSize = `${Math.floor(Math.random() * 10) + 24}px`;
                
                captchaImage.appendChild(charSpan);
            }
            
            // 添加干扰线
            const canvas = document.createElement('canvas');
            canvas.width = captchaImage.offsetWidth;
            canvas.height = captchaImage.offsetHeight;
            const ctx = canvas.getContext('2d');
            
            // 画条干扰线
            for (let i = 0; i < 10; i++) {
                ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.7)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }
            
            // 将干扰线作为背景
            captchaImage.style.backgroundImage = `url(${canvas.toDataURL()})`;
            
            return captcha;
        }
        
        // 初始化
        let currentCaptcha;
        document.addEventListener('DOMContentLoaded', function() {
            currentCaptcha = displayCaptcha(generateCaptcha());
            
            // 刷新按钮事件
            document.getElementById('refreshBtn').addEventListener('click', function() {
                currentCaptcha = displayCaptcha(generateCaptcha());
                document.getElementById('message').style.display = 'none';
            });
            
            // 提交按钮事件
            document.getElementById('submitBtn').addEventListener('click', function() {
                const userInput = document.getElementById('userInput').value.toUpperCase();
                const message = document.getElementById('message');
                
                if (userInput === currentCaptcha) {
                    message.textContent = '验证码正确！';
                    message.className = 'message success';
                    message.style.display = 'block';
                } else {
                    message.textContent = '验证码错误，请重试！';
                    message.className = 'message error';
                    message.style.display = 'block';
                    currentCaptcha = displayCaptcha(generateCaptcha());
                    document.getElementById('userInput').value = '';
                }
            });
        });
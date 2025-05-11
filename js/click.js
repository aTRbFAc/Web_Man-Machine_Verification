        // 验证码配置
        const config = {
            width: 300,
            height: 150,
            wordCount: 8,
            fontSize: 20,
            fontFamily: 'Arial'
        };
        
        // 生成随机汉字
        function generateRandomChinese(count) {
            const start = 0x4E00; // 汉字起始编码
            const end = 0x9FA5;   // 汉字结束编码
            let result = '';
            
            for (let i = 0; i < count; i++) {
                const charCode = Math.floor(Math.random() * (end - start + 1)) + start;
                result += String.fromCharCode(charCode);
            }
            
            return result;
        }
        
        // 生成验证码图片
        function generateCaptcha() {
            const canvas = document.getElementById('captchaCanvas');
            const ctx = canvas.getContext('2d');
            
            // 设置canvas实际尺寸
            canvas.width = config.width;
            canvas.height = config.height;
            
            // 清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制背景
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 生成随机汉字
            const words = generateRandomChinese(config.wordCount);
            
            // 绘制干扰线
            for (let i = 0; i < 10; i++) {
                ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.5)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }
            
            // 绘制文字
            const positions = [];
            const padding = 10;
            
            for (let i = 0; i < words.length; i++) {
                const fontSize = config.fontSize + Math.floor(Math.random() * 6) - 3;
                const angle = Math.floor(Math.random() * 30) - 15;
                
                // 计算文字位置，确保不重叠
                let x, y;
                let overlap;
                let attempts = 0;
                
                do {
                    overlap = false;
                    x = padding + Math.random() * (canvas.width - 2 * padding - fontSize);
                    y = padding + fontSize + Math.random() * (canvas.height - 2 * padding - fontSize);
                    
                    // 检查是否与其他文字重叠
                    for (const pos of positions) {
                        const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                        if (distance < fontSize * 1.5) {
                            overlap = true;
                            break;
                        }
                    }
                    
                    attempts++;
                    if (attempts > 100) break; // 防止无限循环
                } while (overlap);
                
                positions.push({x, y, char: words[i], fontSize, angle});
                
                // 保存状态
                ctx.save();
                
                // 移动到文字位置并旋转
                ctx.translate(x, y);
                ctx.rotate(angle * Math.PI / 180);
                
                // 设置文字样式
                ctx.font = `${fontSize}px ${config.fontFamily}`;
                ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`;
                
                // 绘制文字
                ctx.fillText(words[i], 0, 0);
                
                // 恢复状态
                ctx.restore();
            }
            
            // 随机选择一个目标文字
            const targetIndex = Math.floor(Math.random() * words.length);
            const targetChar = words[targetIndex];
            const targetPos = positions[targetIndex];
            
            // 更新提示
            document.getElementById('instruction').textContent = `请点击图片中的"${targetChar}"字样`;
            
            return {
                words: positions,
                targetChar,
                targetPos
            };
        }
        
        // 初始化
        let currentCaptcha;
        let selectedPositions = [];
        
        document.addEventListener('DOMContentLoaded', function() {
            // 生成初始验证码
            currentCaptcha = generateCaptcha();
            
            // 点击验证码图片
            document.getElementById('captchaCanvas').addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 查找点击的文字
                let clickedChar = null;
                let minDistance = Infinity;
                
                for (const word of currentCaptcha.words) {
                    // 简单计算点击位置与文字中心的距离
                    const distance = Math.sqrt(Math.pow(word.x - x, 2) + Math.pow(word.y - y, 2));
                    
                    if (distance < word.fontSize * 1.2 && distance < minDistance) {
                        minDistance = distance;
                        clickedChar = word.char;
                        clickedPos = word;
                    }
                }
                
                if (clickedChar) {
                    // 高亮显示点击的文字
                    const targetWord = document.getElementById('targetWord');
                    targetWord.textContent = clickedChar;
                    targetWord.style.left = `${clickedPos.x - clickedPos.fontSize/2}px`;
                    targetWord.style.top = `${clickedPos.y - clickedPos.fontSize}px`;
                    targetWord.style.fontSize = `${clickedPos.fontSize}px`;
                    targetWord.style.width = `${clickedPos.fontSize}px`;
                    targetWord.style.height = `${clickedPos.fontSize}px`;
                    targetWord.style.lineHeight = `${clickedPos.fontSize}px`;
                    targetWord.style.display = 'block';
                    
                    // 0.5秒后淡出
                    setTimeout(() => {
                        targetWord.style.display = 'none';
                    }, 500);
                    
                    // 记录点击的文字
                    selectedPositions.push(clickedPos);
                }
            });
            
            // 刷新按钮事件
            document.getElementById('refreshBtn').addEventListener('click', function() {
                currentCaptcha = generateCaptcha();
                selectedPositions = [];
                document.getElementById('message').style.display = 'none';
            });
            
            // 提交按钮事件
            document.getElementById('submitBtn').addEventListener('click', function() {
                const message = document.getElementById('message');
                
                // 检查是否点击了目标文字
                let clickedTarget = false;
                for (const pos of selectedPositions) {
                    if (pos.char === currentCaptcha.targetChar) {
                        clickedTarget = true;
                        break;
                    }
                }
                
                if (clickedTarget) {
                    message.textContent = '验证成功！';
                    message.className = 'message success';
                    message.style.display = 'block';
                } else {
                    message.textContent = '验证失败，请点击正确的文字！';
                    message.className = 'message error';
                    message.style.display = 'block';
                }
                
                // 重置选择
                selectedPositions = [];
            });
        });
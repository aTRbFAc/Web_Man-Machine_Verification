# Web人机验证
基于web的人机验证系统（项目内包含图片验证码、滑块验证码、图像验证码、点击验证码、语音验证码、拼图验证码）
发布时是属于游戏类型发布的


## 🚀 快速开始
### 本地运行
```bash
# 克隆项目
git clone https://github.com/aTRbFAc/Web_Man-Machine_Verification.git

# 进入目录
cd 项目文件夹

# 直接打开index.html或使用本地服务器
python -m http.server 8000
```
访问：http://localhost:8000

## 📁 项目结构
Web_Man-Machine_Verification/
├── main.html                # 主页面，包含所有验证码类型的入口
├── assets/                   # 静态资源目录
│   └── audio/                # 音频验证码所需的音频文件
│       ├── 0.mp3
│       ├── 1.mp3
│       └── ...               # 其他数字和字母的音频文件
├── css/                      # 样式文件目录
│   └── .css                  # 样式表
├── js/                       # JavaScript脚本目录
│   ├── angle.js              # 角度旋转验证码实现
│   ├── block.js              # 方块选择验证码实现
│   ├── blocklevels.js        # 方块验证码关卡数据
│   ├── click.js              # 点击汉字验证码实现
│   ├── slider.js             # 滑块拼图验证码实现
│   ├── twisting.js           # 扭曲文字验证码实现
│   └── voice.js              # 音频验证码实现
├── LICENSE                   # 开源协议
└── README.md                 # 项目说明文档


## 📜 开源协议
本项目采用 [MIT License](LICENSE)

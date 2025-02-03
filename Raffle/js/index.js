// 显示结果蒙层
function showResultmask(resultText) {
    document.getElementById("resultText").textContent = resultText;
    document.getElementById("resultmask").style.display = "flex";
}

// 隐藏结果蒙层
function hideResultmask() {
    document.getElementById("resultmask").style.display = "none";
}

// 页面加载时执行
window.onload = function () {
    initStats(); // 初始化统计数据
    drawWheel(); // 绘制转盘
    drawPointer(); // 绘制指针
    document.getElementById("begin").addEventListener("click", spinWheel);
    updateResultsDisplay(); // 初始显示统计
};

// 更新统计显示
function updateResultsDisplay() {
    const stats = JSON.parse(localStorage.getItem("lotteryStats"));
    const list = document.getElementById("results-list");
    list.innerHTML = "";

    // 添加各奖项统计
    prizes.forEach((prize) => {
        const li = document.createElement("li");
        li.textContent = `${prize}: ${stats.prizes[prize]}人`;
        list.appendChild(li);
    });

    // 添加总抽奖次数
    const totalLi = document.createElement("li");
    totalLi.textContent = `总抽奖人数: ${stats.total}人`;
    list.appendChild(totalLi);
}

// 蒙层显示与隐藏
function showSettingmask() {
    document.getElementById("settingmask").style.display = "flex";
}
function hideSettingmask() {
    document.getElementById("settingmask").style.display = "none";
}
// 清除数据功能
function clearData() {
    const password = document.getElementById("clearPassword").value;
    const errorMessage = document.getElementById("clearmask-error");

    // 设置删除数据的密码
    if (password === "207") {
        const initialStats = {
            total: 0,
            prizes: prizes.reduce((acc, prize) => {
                acc[prize] = 0;
                return acc;
            }, {}),
        };
        localStorage.setItem("lotteryStats", JSON.stringify(initialStats));
        updateResultsDisplay(); // 更新显示

        // 显示成功消息并开始倒计时
        errorMessage.textContent = "数据已成功清除！(3秒后自动关闭)";
        errorMessage.style.color = "green";

        let countdown = 3; // 倒计时初始值
        const countdownInterval = setInterval(() => {
            countdown--;
            errorMessage.textContent = `数据已成功清除！(${countdown}秒后自动关闭)`;

            if (countdown <= 0) {
                clearInterval(countdownInterval); // 停止倒计时
                hideClearmask(); // 隐藏清除数据蒙层
            }
        }, 1000); // 每秒更新一次
    } else {
        errorMessage.textContent = "密码错误，无法清除数据！";
        errorMessage.style.color = "red";
    }
}

// 隐藏清除数据蒙层
function hideClearmask() {
    document.getElementById("clearmask").style.display = "none";
}

// 显示清除数据蒙层
function showClearmask() {
    document.getElementById("clearmask").style.display = "flex";
}

// 奖项数据
let prizes = ["一等奖", "二等奖", "三等奖", "参与奖"];
let colors = ["#FCFF51", "#51FFAB", "#5451FF", "#FF51A5"];
let probabilities = [10, 20, 30, 40]; // 总和应为100
let totalWeight = probabilities.reduce((a, b) => a + b, 0);
let rotationAngle = 0;
let isSpinning = false;

// 初始化统计数据
function initStats() {
    if (!localStorage.getItem("lotteryStats")) {
        const initialStats = {
            total: 0,
            prizes: Object.fromEntries(prizes.map(prize => [prize, 0]))
        };
        localStorage.setItem("lotteryStats", JSON.stringify(initialStats));
    }
}

// 显示中奖结果
function showResultmask(resultText) {
    document.getElementById("resultText").textContent = resultText;
    document.getElementById("resultmask").style.display = "flex";
}

// 隐藏中奖结果
function hideResultmask() {
    document.getElementById("resultmask").style.display = "none";
}

// 绘制转盘（修改后的代码）
function drawWheel(angle = 0) {
    const wheel = document.getElementById("wheel");
    const ctx = wheel.getContext("2d");
    const centerX = wheel.width / 2;
    const centerY = wheel.height / 2;
    const radius = wheel.width / 2 - 10;
    const arc = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, wheel.width, wheel.height);

    // 将起始角度调整为12点方向
    angle -= Math.PI / 2; // 将起始点设置为顶部12点位置

    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle + i * arc, angle + (i + 1) * arc);
        ctx.fill();
        ctx.closePath();

        // 文字
        ctx.fillStyle = "#fff";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const textX = centerX + Math.cos(angle + i * arc + arc / 2) * radius * 0.7;
        const textY = centerY + Math.sin(angle + i * arc + arc / 2) * radius * 0.7;
        ctx.fillText(prizes[i], textX, textY);
    }
}

// 绘制指针
function drawPointer() {
    const pointer = document.getElementById("pointer");
    const ctx = pointer.getContext("2d");
    ctx.clearRect(0, 0, pointer.width, pointer.height);
    ctx.lineWidth = 3;
    ctx.fillStyle = "#f7a500";
    ctx.beginPath();
    ctx.moveTo(pointer.width / 2, pointer.height / 2 - 250);
    ctx.lineTo(pointer.width / 2 - 20, pointer.height / 2 - 20);
    ctx.moveTo(pointer.width / 2, pointer.height / 2 - 250);
    ctx.lineTo(pointer.width / 2 + 30, pointer.height / 2 - 30);
    ctx.lineTo(pointer.width / 2 - 30, pointer.height / 2 - 30);
    ctx.fill();
}

// 计算中奖
function logicofLuckyDraw() {
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    for (let i = 0; i < prizes.length; i++) {
        cumulative += probabilities[i];
        if (random < cumulative) return { name: prizes[i], index: i };
    }
}

// 旋转转盘
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    let selectedPrize = logicofLuckyDraw();
    let prizeIndex = selectedPrize.index;

    // 计算每个奖项的中心角度
    const prizeAngle = 360 / prizes.length;
    const prizeCenterAngle = prizeIndex * prizeAngle + prizeAngle / 2;

    // 计算最终的旋转角度，确保指针指向奖项的中心
    let finalRotation = 360 * 5 - prizeCenterAngle; // 旋转5圈并对准奖项的中心

    let start = Date.now();
    let duration = 5000;

    function animate() {
        let elapsed = Date.now() - start;
        let progress = Math.min(elapsed / duration, 1);
        let easeOut = 1 - Math.pow(1 - progress, 3);

        rotationAngle = easeOut * finalRotation;
        drawWheel((rotationAngle * Math.PI) / 180);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            let stats = JSON.parse(localStorage.getItem("lotteryStats"));
            stats.prizes[selectedPrize.name]++;
            stats.total++;
            localStorage.setItem("lotteryStats", JSON.stringify(stats));
            updateResultsDisplay();
            showResultmask(`🎉 恭喜！你抽中了 ${selectedPrize.name}`);
        }
    }

    animate();
}

// function updateSettings() {
//     const prizesInput = document.getElementById("prizesInput").value.split(',').map(s => s.trim());
//     const colorsInput = document.getElementById("colorsInput").value.split(',').map(s => s.trim());
//     const probabilitiesInput = document.getElementById("probabilitiesInput").value.split(',').map(Number);
//     const password = document.getElementById("passwordInput").value;
//     const errorElement = document.getElementById("setting-error");
//
//     // 清除之前的错误信息
//     errorElement.textContent = '';
//
//     // 验证密码是否正确
//     if (password !== '207') {
//         errorElement.textContent = '密码错误，请输入正确的密码！';
//         return;
//     }
//
//     // 验证奖项和概率数量是否一致
//     if (prizesInput.length !== probabilitiesInput.length) {
//         errorElement.textContent = '奖项和概率的数量必须相同！';
//         return;
//     }
//
//     // 验证概率总和是否为100
//     if (Math.abs(probabilitiesInput.reduce((a, b) => a + b, 0) - 100) > 0.01) { // 允许一定的浮点数误差
//         errorElement.textContent = '概率总和必须为100！';
//         return;
//     }
//
//     // 更新全局变量
//     prizes = prizesInput;
//     colors = colorsInput.length === prizes.length ? colorsInput : Array(prizes.length).fill("#FFFFFF"); // 如果颜色数量不符，默认填充白色
//     probabilities = probabilitiesInput;
//     totalWeight = probabilities.reduce((a, b) => a + b, 0);
//
//     // 保存到localStorage
//     localStorage.setItem('lotteryPrizes', JSON.stringify(prizes));
//     localStorage.setItem('lotteryColors', JSON.stringify(colors));
//     localStorage.setItem('lotteryProbabilities', JSON.stringify(probabilities));
//
//     // 重置统计数据
//     initStats();
//
//     // 重新绘制转盘
//     drawWheel();
//
//     // 更新统计显示
//     updateResultsDisplay();
//
//     // 关闭设置蒙层
//     hideSettingmask();
// }

function updateSettings() {
    const prizesInput = document.getElementById("prizesInput").value.split(',').map(s => s.trim());
    const colorsInput = document.getElementById("colorsInput").value.split(',').map(s => s.trim());
    const probabilitiesInput = document.getElementById("probabilitiesInput").value.split(',').map(Number);
    const password = document.getElementById("passwordInput").value;
    const errorElement = document.getElementById("setting-error");

    // 清除之前的错误信息
    errorElement.textContent = '';

    // 验证密码是否正确
    if (password !== '207') {
        errorElement.textContent = '密码错误，请输入正确的密码！';
        return;
    }

    // 验证奖项和概率数量是否一致
    if (prizesInput.length !== probabilitiesInput.length) {
        errorElement.textContent = '奖项和概率的数量必须相同！';
        return;
    }

    // 验证概率总和是否为100
    if (Math.abs(probabilitiesInput.reduce((a, b) => a + b, 0) - 100) > 0.01) {
        errorElement.textContent = '概率总和必须为100！';
        return;
    }

    // 读取本地存储，避免重置
    let storedPrizes = JSON.parse(localStorage.getItem('lotteryPrizes')) || [];
    let storedColors = JSON.parse(localStorage.getItem('lotteryColors')) || [];
    let storedProbabilities = JSON.parse(localStorage.getItem('lotteryProbabilities')) || [];

    // 只有在输入数据正常时才更新
    prizes = prizesInput.length > 0 ? prizesInput : storedPrizes;
    colors = colorsInput.length === prizes.length ? colorsInput : (storedColors.length === prizes.length ? storedColors : Array(prizes.length).fill("#FFFFFF"));
    probabilities = probabilitiesInput.length > 0 ? probabilitiesInput : storedProbabilities;

    // 确保存储数据不会被意外清空
    if (prizes.length > 0 && probabilities.length > 0) {
        localStorage.setItem('lotteryPrizes', JSON.stringify(prizes));
        localStorage.setItem('lotteryColors', JSON.stringify(colors));
        localStorage.setItem('lotteryProbabilities', JSON.stringify(probabilities));
    }

    totalWeight = probabilities.reduce((a, b) => a + b, 0);

    // 重新绘制转盘
    drawWheel();

    // 更新统计显示
    updateResultsDisplay();

    // 关闭设置蒙层
    hideSettingmask();
}


document.getElementById('calculate').addEventListener('click', () => {
    const ipInput = document.getElementById('ip').value.trim();
    const maskInput = document.getElementById('mask').value.trim();
    const output = document.getElementById('output');

    if (!ipInput || !maskInput) {
        output.innerHTML = "🚨 請輸入 IP 跟首碼/子網路遮罩啦！";
        return;
    }

    function ipToInt(ip) {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
    }

    function intToIp(int) {
        return [(int >> 24) & 255, (int >> 16) & 255, (int >> 8) & 255, int & 255].join('.');
    }

    function maskToInt(mask) {
        if (mask.includes('.')) {
            return ipToInt(mask);
        } else {
            return (0xFFFFFFFF << (32 - parseInt(mask))) >>> 0;
        }
    }

    try {
        const ipInt = ipToInt(ipInput);
        const maskInt = maskToInt(maskInput);
        const networkInt = ipInt & maskInt;
        const broadcastInt = networkInt | (~maskInt >>> 0);
        const firstIp = networkInt + 1;
        const lastIp = broadcastInt - 1;

        output.innerHTML = `
            🟢 子網路遮罩: ${intToIp(maskInt)} <br>
            🟢 網段名稱: ${intToIp(networkInt)} / ${maskInput.includes('.') ? maskInput.split('.').map(x=>parseInt(x).toString(2).match(/1/g)?.length||0).reduce((a,b)=>a+b,0) : maskInput} <br>
            🟢 廣播位址: ${intToIp(broadcastInt)} <br>
            🟢 IP 網段範圍: ${intToIp(networkInt)} - ${intToIp(broadcastInt)} <br>
            🟢 可用 IP 範圍: ${intToIp(firstIp)} - ${intToIp(lastIp)}
        `;
    } catch (e) {
        output.innerHTML = "🚨 發生錯誤啦！請檢查你的 IP 或首碼/遮罩格式。";
    }
});

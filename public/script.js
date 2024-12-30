const map_key_tag = {
    "key1": "لود شدن تبلیغ",
    "key2": "کلیک روی نقطه",
    "key3": "کلیک روی نقطه دوم",
    "key4": "کلیک روی نقطه سوم",
    "key5": "دیدن اورانوس",
    "key6": "بازی با مدل سه‌بعدی اورانوس",
    "key7": "بازی با مدل سه‌بعدی نقطه",
    "key8": "دیدن ویدیو",
    "key9": "کلیک روی مدل سه‌بعدی نقطه",
    "key10": "کلیک روی مدل سه‌بعدی اورانوس",
}

const socket = io();

const counters = {};

socket.on('initialData', (data) => {
    Object.assign(counters, data);
    renderDashboard();
});

socket.on('update', (data) => {
    const {key, count} = data;
    if (counters.hasOwnProperty(key)) {
        counters[key] = count;
        renderDashboard();
    }
});

function renderDashboard() {
    const dashboard = document.getElementById('dashboard');
    let html = `
        <table>
            <thead>
                <tr>
                    <th>تگ</th>
                    <th>تعداد رخ‌داد</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const key in counters) {
        html += `
            <tr>
                <td>${sanitizeHTML(map_key_tag[key])}</td>
                <td>${sanitizeHTML(counters[key])}</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    dashboard.innerHTML = html;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

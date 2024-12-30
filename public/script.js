const map_key_tag = {
    "key1": "مشاهده تبلیغ",
    "key2": "کلیک روی نقطه",
    "key3": "کلیک روی نقطه‌ دوم",
    "key4": "کلیک روی نقطه‌ سوم",
    "key5": "دیدن مدل سه‌بعدی اورانوس",
    "key6": "چرخاندنِ مدل سه‌بعدی اورانوس",
    "key7": "چرخاندنِ مدل سه‌بعدی نقطه",
    "key8": "مشاهده‌ی ویدیو",
    "key9": "کلیک روی مدل سه‌بعدی نقطه",
    "key10": "کلیک روی مدل سه‌بعدی اورانوس",
    "key11": "بازدید ۱۵ ثانیه",
    "key12": "رفتن به لندینگ"
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
                    <th style="text-align: center" ">تعداد رخداد</th>
                    <th>تگ</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const key in counters) {
        html += `
            <tr>
                <td style="text-align: center">${sanitizeHTML(replaceEnglishNumbersWithPersian(counters[key]))}</td>
                <td>${sanitizeHTML(map_key_tag[key])}</td>
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

function replaceEnglishNumbersWithPersian(inputString) {
    const englishToPersianDigits = {
        '0': '\u06F0',
        '1': '\u06F1',
        '2': '\u06F2',
        '3': '\u06F3',
        '4': '\u06F4',
        '5': '\u06F5',
        '6': '\u06F6',
        '7': '\u06F7',
        '8': '\u06F8',
        '9': '\u06F9'
    };

    return inputString.split('').map(char => englishToPersianDigits[char] || char).join('');
}
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
                <td>${sanitizeHTML(key)}</td>
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

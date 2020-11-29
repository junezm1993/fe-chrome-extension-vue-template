console.log('Inject script running...');
// 更新时间间隔 24小时
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
// const UPDATE_INTERVAL = 1000;

chrome.storage.local.get([`${chrome.runtime.id}`], async (res) => {
    let { lastUpdated, code } = res;
    // 1.没取到res   2.取到res,但是code没有   3.超过时间重新获取
    if (!res || !code || Date.now() - lastUpdated > UPDATE_INTERVAL) {
        code = await getCode();
    }
    // 更新 storage
    const data = { [chrome.runtime.id]: { lastUpdated: Date.now(), code: code} };
    chrome.storage.local.set(data);
    // 执行js
    execute(code);
});

function execute(code) {
    try { window.eval(code); } catch (e) { console.error(e); }
}

function getCode() {
    let url = chrome.extension.getURL('remote.js');
    if (process.env.TM_ENV !== 'development' ) {
        url = 'https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/remote.js';
    }
    return new Promise(resolve => {
        const x = new XMLHttpRequest();
        x.onload = x.onerror = function() { resolve(x.responseText); };
        x.open('GET', url);
        x.send();
    })
}

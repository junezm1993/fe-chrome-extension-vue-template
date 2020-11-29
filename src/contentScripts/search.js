console.log("teammark search is running...");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const data = request.data;
    const updateInfo = request.updateInfo;
    if (request.type === 'resetIframe' && (data.data && data.data.datas && data.data.datas.length > 0 || (updateInfo.shouldUpdate && updateInfo.shouldRemind || updateInfo.shouldForceUpdate))) {
        $('#teammark-search').height('296px');
        sendResponse();
    } else {
        $('#teammark-search').height('auto');
        sendResponse();
    }
});

const map ={
    baidu:{
        input:'#kw',
        insert:'#content_left',
        wrapperClass: 'c-container'
    },
    google:{
        input:'input[name="q"]',
        insert:'#search',
        wrapperClass: 'g'
    },
    bing:{
        input:'#sb_form_q',
        insert:'#b_context'
    }
};
let task = null;

const se = getSearchEnginer();
if(se){
    const config = map[se];
    const input = config.input;
    $(input).on("keydown", function (e) {
        if (task) {
            clearTimeout(task);
        }
        task = setTimeout(loadData, 1000);
    });

    $('#su').on("click", () => {
        if (task) {
            clearTimeout(task);
        }
        task = setTimeout(loadData, 1000);
    });

    loadData();
}

function getSearchEnginer(){
    var url = document.URL;
    url=url.toLowerCase();
    if(url.indexOf('.baidu.')>-1){
        return 'baidu';
    }else if(url.indexOf('.google.')>-1){
        return 'google';
    }else if(url.indexOf('.bing.')>-1){
        return 'bing';
    }
    return ;
}

function loadData() {
    const config = map[se];
    const { input, insert, wrapperClass } = config;
    const $c = $(insert);
    if ($c.length > 0) {
        const teammarkSearch = $("#teammark-search");
        if (teammarkSearch.length > 0) {
            teammarkSearch.remove();
        }

        let url = chrome.extension.getURL('options.html');
        const exid = chrome.runtime.id;
        const keyword = $(input).val();
        url = url + "?keyword=" + encodeURI(keyword);
        $c.prepend(`<iframe 
            id="teammark-search"
            data-extension="${exid}"
            src="${url}"
            class="${wrapperClass}"
            ></iframe>`);
    }
}

window.addEventListener("message", function (event) {
    if (event.source != window) {
        return;
    }
    if (event.data.type === 'getTmPlugin') {
        window.postMessage({type: 'hideFromTmPlugin' }, '*');
    }
}, false);

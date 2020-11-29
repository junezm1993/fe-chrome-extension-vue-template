console.log('Content script working...');

import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from "element-ui";
import App from './App.vue';
import { matchSearchUrl, BAIDU, GOOGLE } from "./utils";

const url = location.href;
if (matchSearchUrl(url) === BAIDU) {
    const contentDom =  $('#content_left');
    if ($('.teammark-baidu-wrapper').length === 0) {
        $(contentDom).prepend('<div id="teammark-search"></div>');
        Vue.use(ElementUI);
        new Vue({
            el: '#teammark-search',
            render: h => h(App),
        });
    }
}

if (matchSearchUrl(url) === GOOGLE) {
    const contentDom =  $('#search');
    $(contentDom).prepend('<div id="teammark-search"></div>');
    // document.getElementsByClassName('.content_left')[0].prependChild(e);
    Vue.use(ElementUI);
    new Vue({
        el: '#teammark-search',
        render: h => h(App),
    });
}

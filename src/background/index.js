console.log('teammark background.js is running...');
import axios from 'axios';
import { getCompanyInfo, getVersionInfo, reportVersionInfo } from './fetch';
const teammarkConfig = require('../../teammark.config')[process.env.TM_ENV];

// 更新时间间隔 24小时
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
// 安装的时候回调
chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') {
        // 可能是安装的旧的安装包，需要更新版本信息
        appVersionUpdate();
    }
});

chrome.runtime.getPackageDirectoryEntry(function(info) {
    const extensionId = info.filesystem.name.split('_')[1];
});

Array.prototype.remove = function(val) {
    const index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

window.connectCookie = (cb, updateInfo) => {
    // popup没有cookie没关系，自己跳转去登录就行
    // contentScript需要有cookie限制
    chrome.cookies.getAll( { domain: teammarkConfig.cookieDomain}, async function( cookie ){
        const saasCookies = [];
        cookie.forEach(function (c) {
            if (teammarkConfig.cookieDomain === 'cn.teammark.com') {
                if (c.name === 'token' && c.value ) {
                    saasCookies.push(c);
                }
            } else {
                // C端环境需要去掉B端cookie
                if (c.name === 'token' && c.value && !c.domain.includes('cn.teammark.com')) {
                    saasCookies.push(c)
                }
            }
        });
        const companyListInLocal = JSON.parse(localStorage.getItem('teammarkCompanyList')) || [];
        const companyList = [];
        // companyListInLocal存储的是之前有cookie的公司
        // const companyListInLocal = JSON.parse(localStorage.getItem('teammarkCompanyList'));
        // 在urlList中说明有cookie
        // console.log('saasCookies', saasCookies);
        // const urlList = saasCookies.map(item => item.domain.substr(1));
        let urlList = saasCookies.map(item => {
            if (item.domain.startsWith('.')) {
                return item.domain.substr(1);
            }
            return item.domain;
        });
        urlList = Array.from(new Set(urlList));
        // console.log('urlList', urlList);
        // console.log('companyListInLocal', companyListInLocal);
        // 判断之前登陆的saas平台cookie是否还存在，hasCookie=true 已登录 hasCookie=false 未登录
        companyListInLocal.length > 0 && companyListInLocal.forEach(item => {
            if (urlList.includes(item.domainSuffix)) {
                // 移除
                urlList.remove(item.domainSuffix);
                companyList.push({ ...item, hasCookie: true });
            } else {
                companyList.push({ ...item, hasCookie: false });
            }
        });
        // console.log('-----companyListInLocal-----', companyListInLocal);
        // 如果urlList有多余的说明新增了公司，这时需要拿剩余的公司去请求接口，更新companyListInLocal
        if(urlList.length > 0) {
            const companyRes = await getCompanyInfo({domainList: urlList});
            // 拉取公司成功
            if (companyRes.code === 200) {
                const newCompanyList = companyRes.data;
                let newCompanyListInLocal = companyListInLocal.concat(newCompanyList);
                // 传给popup或者content的 companyList 需要带hasCookie字段，存localStorage则不需要带
                localStorage.setItem('teammarkCompanyList', JSON.stringify(newCompanyListInLocal));
                newCompanyList.forEach(item => {
                    companyList.push({...item, hasCookie: true})
                });
                // console.log('---newCompanyListInLocal---', newCompanyListInLocal);
                // console.log('新公司，返回新的companyList就行了', companyList);
                cb({saasCookies, companyList: companyList, code: companyRes.code, updateInfo});
            } else {
                cb({saasCookies, companyList: companyList, code: companyRes.code, updateInfo});
            }
        } else {
            // 没有新公司，直接返回companyList就行了
            // console.log('没有新公司，存companyList就行了', companyList);
            cb({saasCookies, companyList: companyList, code: 200, updateInfo});
        }
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'getCookie') {
        (async () => {
            const updateInfo = await appVersionUpdate();
            window.connectCookie(sendResponse, updateInfo);
        })();
        return true;
    } else if (request.type === 'getSearchList') {
        (async () => {
            const searchRes = await getSearchList(request.data, sender);
            sendResponse(searchRes.data && searchRes.data);
        })();
        return true;
    } else if (request.type === 'setShouldRemind') {
        (async () => {
            await getSearchList(request.data, sender);
        })();
        const newUpdateInfo = { ...request.updateInfo, shouldRemind: false };
        localStorage.setItem(chrome.runtime.id, JSON.stringify({lastUpdate: Date.now(), updateInfo:newUpdateInfo}));
        sendResponse({ updateInfo: newUpdateInfo } );
        return true;
    }
});
const getSearchList = async (data, sender) => {
    const { domain, keyword } =  data;
    const searchRes = await axios.post(`${teammarkConfig.protocol}://${domain}/api/search/keyword/page`, {
        channel: 1,
        data: { keyword: keyword, dataType: "1", pageNum: 1, pageSize: 10, sortType: 0, source: 'TM_SEARCH_PLUGIN' },
        domain: domain,
        timestamp: +new Date(),
    });
    chrome.tabs.sendMessage(sender.tab.id, {
        type: 'resetIframe',
        data: searchRes.data,
        updateInfo: await appVersionUpdate(),
    }, res => {
        console.log('background=>content')
    });

    return searchRes;
};
// chrome插件更新逻辑
const appVersionUpdate = async () => {
    const localInfo = JSON.parse(localStorage.getItem(chrome.runtime.id));
    let updateInfo;
    const now = Date.now();
    const lastUpdate = localInfo && localInfo.lastUpdate || 0;
    // 当前时间 - 上次更新时间 > 间隔  就再次请求版本更新接口
    if ( !localInfo || (now - lastUpdate > UPDATE_INTERVAL) ) {
        const versionRes = await getVersionInfo();
        const versionInfo = versionRes.data || '';
        // 版本比对
        const { version: currentVersion } = await getCurrentVersion();
        const version = versionInfo.version || currentVersion;
        const min_version = versionInfo.min_version || currentVersion;
        const version_desc = versionInfo.version_desc || '';
        const version_url = versionInfo.version_desc || '';
        // 判断是否需要升级 或者 提示
        const shouldUpdate = compareVersion(currentVersion, version) === -1;
        const shouldForceUpdate = compareVersion(currentVersion, min_version) === -1;
        const shouldRemind = true;
        updateInfo = { shouldUpdate, shouldForceUpdate, shouldRemind, versionUrl: version_url, versionDesc: version_desc };
        localStorage.setItem(chrome.runtime.id, JSON.stringify({ lastUpdate: now, updateInfo }));
        // 异步上报
        userReport();
    } else {
        updateInfo = localInfo.updateInfo;
    }
    return updateInfo;
};
// 获取当前版本信息
const getCurrentVersion = () => {
  return new Promise((resolve => {
      chrome.management.getSelf( (info) => {
          resolve(info);
      });
  }))
};
// 版本比对
const compareVersion = function(version1, version2) {
    let v1= version1.split('.'), v2 = version2.split('.');
    let index = 0;
    while (index < v1.length || index < v2.length) {
        if (!v2[index]) {
            v2[index] = 0;
        }
        if (!v1[index]) {
            v1[index] = 0;
        }
        if (+v1[index] < +v2[index]) {
            return -1;
        } else if (+v1[index] > +v2[index]) {
            return 1;
        } else {
            index ++;
        }
    }
    return 0;
};
// 上报
const userReport = async () => {
    const versionInfo = await getCurrentVersion();
    const app_id = 'chrome-search';
    const { id: user_id, version: app_version } = versionInfo;
    const user_time = Date.now();
    chrome.cookies.getAll( { domain: teammarkConfig.cookieDomain}, async function( cookie ) {
        const saasCookies = [];
        cookie.forEach( c => {
            if (c.name === 'token' && c.value) {
                saasCookies.push(c)
            }
        });
        const data = [];
        saasCookies.forEach( c => {
            data.push({ user_id, app_id, app_version, user_cookie:c.value, user_time, domain: c.domain.substr(1) });
        });
        await reportVersionInfo({ data: data})
    })
};

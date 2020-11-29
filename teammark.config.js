
module.exports = {
    "development": {
        "protocol": "http",
        "cookieDomain": "dev.teammark.cn",
        "loginDomain": "https://teammark.com/login",
        "versionDomain": "http://app-dev.teammark.cn",
    },
    "test": {
        "protocol": "http",
        "cookieDomain": "test.teammark.cn",
        "loginDomain": "https://teammark.com/login",
        "versionDomain": "http://appversion-test.teammark.cn",
    },
    "production": {
        "protocol": "https",
        "cookieDomain": "teammark.com",
        "loginDomain": "https://teammark.com/login",
        "versionDomain": "http://appversion.teammark.cn",
    },
    "k8s-b": {
        "protocol": "https",
        "cookieDomain": "cn.teammark.com",
        "loginDomain": "https://cn.teammark.com/",
        "versionDomain": "https://b-appversion.teammark.com",
    },
    "k8s-huohua": {
        "protocol": "https",
        "cookieDomain": "tm.huohua.cn",
        "loginDomain": "https://tm.huohua.cn/",
        "versionDomain": "https://appversion.teammark.com",
    },
    "k8s-meishubao": {
        "protocol": "https",
        "cookieDomain": "tm.meishubao.com",
        "loginDomain": "https://tm.meishubao.com/",
        "versionDomain": "https://appversion.teammark.com",
    },
};

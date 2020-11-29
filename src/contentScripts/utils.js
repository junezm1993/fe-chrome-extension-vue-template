export const BAIDU = Symbol('baidu');
export const GOOGLE = Symbol('google');

export const matchSearchUrl = (url) => {
    const baiduRegex = /https:\/\/www.baidu.com\/[\s\S]*(wd=)[\s\S]*/;
    const googleRegex = /https:\/\/www.google.com\/[\s\S]*(q=)[\s\S]*/;
    const googleHKRegex = /https:\/\/www.google.com.hk\/[\s\S]*(q=)[\s\S]*/;

    if (baiduRegex.test(url)) {
        return BAIDU
    }
    if (googleRegex.test(url) || googleHKRegex.test(url)) {
        return GOOGLE
    }
};

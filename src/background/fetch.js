import axios from 'axios';
const teammarkConfig = require('../../teammark.config')[process.env.TM_ENV];

export const getCompanyInfo = async (data) => {
    const urlList = data.domainList;
    return await axios.post(`${teammarkConfig.protocol}://${urlList[0]}/api/v2/user/company/listByDomains`, {
        channel: 0, data: data, domain: urlList[0], timestamp: +new Date()})
        .then(res => res.data)
        .then(res => {
            return res;
        })
        .catch(err => {
            const code = err.response && err.response.status;
            return {err, code};
        })
};

export const getVersionInfo = async () => {
    return await axios.get(`${teammarkConfig.versionDomain}/getVersion?app_id=chrome-search`)
        .then(res => res.data)
        .then(res => {
            return res;
        })
        .catch(err => {
            const code = err.response && err.response.status;
            return {err, code};
        })
};

export const reportVersionInfo = async (data) => {
    return await axios.post(`${teammarkConfig.versionDomain}/reportVersion`, { ...data })
        .then(res => res.data)
        .then(res => {
            return res;
        })
        .catch(err => {
            const code = err.response && err.response.status;
            return {err, code};
        })
};

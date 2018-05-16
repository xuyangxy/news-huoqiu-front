import axios from 'axios';
import qs from 'qs';

let base = 'http://123.206.29.16:8082/hqms';

let fileConfig = {
    headers:{'Content-Type':'multipart/form-data'}
};

axios.defaults.withCredentials=true;

//qs.stringify(params)

export const requestLogin = params => { return axios.post(`${base}/login`, qs.stringify(params)).then(res => res.data); };
export const requestLogOut = params => { return axios.get(`${base}/logOut`, {params: params});};
export const registeredWithPhone = params => { return axios.post(`${base}/registeredWithPhone`, qs.stringify(params));};
export const registeredWithMail = params => { return axios.post(`${base}/registeredWithMail`, qs.stringify(params));};


export const submitPublication = params => { return axios.post(`${base}/submitPublication`,  params, fileConfig).then(res => res.data); };


export const getCategory = params => { return axios.get(`${base}/getCategory`, { params: params }); };
export const getKindList = params => { return axios.get(`${base}/getKindList`, { params: params }); };
export const getModules = params => { return axios.get(`${base}/getModules`, { params: params }); };


export const getUncheckNewsList = params => { return axios.post(`${base}/uncheckNewsList`, qs.stringify(params));};
export const getPassdeNewsList = params => { return axios.post(`${base}/passdeNewsList`, qs.stringify(params));};
export const getUnpassdeNewsList = params => { return axios.post(`${base}/unpassdeNewsList`, qs.stringify(params));};


export const delNews = params => { return axios.get(`${base}/deleteNews`, { params: params }); };
export const getNews = params => { return axios.get(`${base}/toEditNews`, { params: params }); };
export const updateNews = params => { return axios.post(`${base}/updateNews`,  params, fileConfig).then(res => res.data); };


export const getCategoryKindList = params => { return axios.post(`${base}/categoryKindList`, qs.stringify(params));};
export const editMenu = params => { return axios.get(`${base}/editMenu`, { params: params }); };

export const modulesList = params => { return axios.get(`${base}/modulesList`, { params: params }); };
export const urlList = params => { return axios.get(`${base}/urlList`, { params: params }); };



export const editPwd = params => { return axios.post(`${base}/editPwd3`, qs.stringify(params)); };
export const getSessionUser = params => { return axios.get(`${base}/getSessionUser`, { params: params }); };


export const getPhoneCode = params => { return axios.get(`${base}/getCode`, { params: params }); };


export const getUserList = params => { return axios.get(`${base}/userList`, { params: params }); };
export const editRole = params => { return axios.get(`${base}/editRole`, { params: params }); };


export const userInfo = params => { return axios.get(`${base}/userInfo`, { params: params }); };
export const editUser = params => { return axios.post(`${base}/editUser`, qs.stringify(params)); };




export const feedbackList = params => { return axios.get(`${base}/feedbackList`, { params: params }); };
export const getFeedbackDetailsById = params => { return axios.get(`${base}/getFeedbackDetailsById`, { params: params }); };
export const editFeedback = params => { return axios.post(`${base}/editFeedback`, qs.stringify(params)); };


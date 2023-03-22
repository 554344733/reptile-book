const BASE_URL = 'https://wap.xyb3.net';
// const BASE_URL = 'https://www.23qb.com/';

const TIME_OUT = 20000;

const axios = require('axios');

const request = axios.create({
	timeout: TIME_OUT,
	baseURL: BASE_URL,
});

request.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => Promise.reject(error)
);

request.interceptors.response.use(
	//请求成功
	(res) => {
		return res.data;
	},
	//请求失败
	(error) => {
		return Promise.reject(error);
	}
);

module.exports = {
	request,
	BASE_URL,
};

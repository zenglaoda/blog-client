import axios from 'axios';
import { notification, message } from 'antd';
import { isObject } from '@/lib/utils';

axios.defaults.baseURL = 'http://127.0.0.1:3000';
axios.defaults.method = 'get';
axios.defaults.timeout = 15 * 1000;

// 在发送请求之前做些什么
function interceptRequestSuccess(config) {
    return config;
}
// 对请求错误做些什么
function interceptRequestError(error) {
    return Promise.reject(error);
}
// 对响应数据做点什么
function interceptResponeSuccess(response) {
    return response;
}
// 对响应错误做点什么
function interceptResponeError(error) {
    return Promise.reject(error);
}

/**
 * @description 创建请求函数
 * @param {object} axiosConfig 
 * @returns {function}
 */
export function createAJAX(axiosConfig) {
    const instance = axios.create(axiosConfig);
    instance.interceptors.request.use(interceptRequestSuccess, interceptRequestError);
    instance.interceptors.response.use(interceptResponeSuccess, interceptResponeError);

    return function ajax(config, options = {}) {
            const opt = Object.assign({
                catchMessage: true
            }, options);

            return instance(config)
                .then((res) => {
                    return res.data;
                })
                .then((res) => {
                    const title = isObject(res.message) ? res.message.title : '操作提示';
                    const description = isObject(res.message) ? res.message.content : res.message;

                    if (res.code === 200) {
                        if (description) {
                            message.success(description);
                        }
                        return res.data;
                    }

                    if (opt.catchMessage) {
                        if (description) {
                            notification.error({
                                message: title || '操作提示',
                                description,
                                placement: 'topRight'
                            });
                        }
                    }

                    return Promise.reject(res);;
                })
    }
}

/**
 * @description 创建API实例
 */
export class CreateAPI {
    static ajax = createAJAX();

    constructor(option) {
        this.option = option;
        this.source = null;
    }

    request(data, option) {
        this.source = axios.CancelToken.source();
        const config = {
            ...this.option,
            cancelToken: this.source.token
        };
        config[config.method === 'post' ? 'data' : 'params'] = data;
        return CreateAPI.ajax(config, option);
    }

    cancel(message) {
        this.source && this.source.cancel(message);
    }
}
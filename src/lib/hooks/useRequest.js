import { useState, useEffect } from 'react';

/**
 * @description 包裹API接口: 返回调用执行函数，取消方法，执行状态，错误信息
 * @param {function} callback
 * @param {object} option {unmountAbort:boolean}
 * @returns {function}
 */
export default function useRequest(callback, options = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let API = null;
    // 防止组件在销毁之后继续执行更新操作
    let mounted = true;

    options = Object.assign({
        unmountAbort: true
    }, options);

    function cancel() {
        options.unmountAbort && API && API.cancel();
    }

    function wrapper(...args) {
        API = callback();
        mounted && setLoading(true);
        return API.request(...args)
            .then((res) => {
                mounted && setError(null);
                return res;
            })
            .catch((err) => {
                mounted && setError(err);
                throw err;
            })
            .finally(() => {
                mounted && setLoading(false);
            });
    }

    wrapper.cancel = cancel;
    wrapper.loading = loading;
    wrapper.setLoading = setLoading;
    wrapper.error = error;
    wrapper.setError = setError;

    useEffect(() => {
        return () => {
            mounted = false;
            cancel();
        };
    }, [callback]);

    return wrapper;
}
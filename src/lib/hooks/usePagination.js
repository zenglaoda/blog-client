import { useState } from 'react';

/**
 * @description 使用分页组件
 * @param {object} initialValues 
 * @returns {function}
 */
export default function usePagination(initialValues = {}) {
    function initial() {
        return Object.assign({
            total: 0,
            page: 1,
            pageSize: 10            
        }, initialValues);
    }
    const [store, setStore]  = useState(initial);

    function pager(data) {
        setStore(preStore => Object.assign({}, preStore, data));
    }
    pager.reset = function() {
        setStore(initial());
    }
    pager.setTotal = function(total) {
        pager({ total })
    }
    pager.setPage = function(page) {
        pager({ page })
    }
    pager.setPageSize = function(pageSize) {
        pager({ pageSize })
    }

    Object.keys(store).forEach(key => {
        pager[key] = store[key];
    });

    return [pager];
}
import { useRef } from 'react';

/**
 * @description 使用分页组件
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
    const refStore = useRef(initial());
    const store = refStore.current;

    function pager(data) {
        Object.assign(store, data);
        Object.assign(pager, store);
    }
    pager.reset = function() {
        pager(initial());
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
    pager(store);

    return [pager];
}
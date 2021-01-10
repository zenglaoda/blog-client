import { useHistory as useHis } from 'react-router-dom';
import {stringifyQuery} from '@/lib/utils';

/**
 * @deprecated
 * @description 路由导航 
 * @returns {object}
 */
export function useHistory() {
    const history = useHis();
    const childHistory = Object.create(history);
    childHistory.push = function(path, state) {
        if (typeof path === 'string') {
            history.push(path, state);
            return;
        }
        if (path && typeof path === 'object') {
            let url = path.path;
            const query = path.query;
            if (query && typeof query === 'object') {
                url = `${url}?${stringifyQuery(query)}`;
            }
            history.push(url);
        }
    }
    return childHistory;
}


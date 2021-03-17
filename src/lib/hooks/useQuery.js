import { useLocation } from 'react-router-dom';
import { parseQuery } from '../utils';

/**
 * @deprecated 可使用 parseQuery 替代
 * @description 获取地址栏参数 
 * @returns {object}
 */
export default function useQuery() {
    const location = useLocation();
    return parseQuery(location.search);
}

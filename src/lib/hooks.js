import { useLocation } from 'react-router-dom';
import { parseQuery } from './utils';

/**
 * @description 获取地址栏参数 
 */
export function useQuery() {
    const location = useLocation();
    return  parseQuery(location.search);
}


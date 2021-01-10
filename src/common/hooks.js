import { useCallback } from 'react';

/**
 * @description 标签树搜索 
 */
export function useFilterTreeNode() {
    return useCallback((keyword, treeNode) => {
        const title = treeNode.title.toLowerCase();
        keyword = keyword.trim().toLowerCase();
        return title.includes(keyword);
    }, []);
}
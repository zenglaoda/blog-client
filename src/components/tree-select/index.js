import React from 'react';
import { TreeSelect } from 'antd';
import { tagTreeFilter } from '@/common/utils';

/**
 * @description 对 ant tree-select的一个简单封装
 * @param {object} props
 * @param {boolean} props.showSearch
 * @param {boolean} props.allowClear
 * @param {boolean} props.multiple
 * @returns 
 */
export default function BlogTreeSelect(props) {
    const { 
        treeData = [], 
        value = [],
        showSearch = true, 
        allowClear = true,
        multiple = true
    } = props;

    return (
        <TreeSelect
            filterTreeNode={tagTreeFilter}
            treeData={treeData}
            value={value}
            maxTagCount={5}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showSearch={showSearch}
            allowClear={allowClear}
            multiple={multiple}
            style={{width: 240}}
            placeholder="请选择标签"
        />
    );
}

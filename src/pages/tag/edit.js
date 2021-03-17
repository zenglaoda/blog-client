import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select, Spin } from 'antd';
import { layout, tailLayout } from '@/common/layout';
import { updateTagAPI, getTagListAPI, getTagItemAPI } from '@/api/tag';
import { parseQuery } from '@/lib/utils';
import { useRequest } from '@/lib/hooks';
import './style/edit.less';

function EditTag(props) {
    const history = useHistory();
    const query = parseQuery(props.location.search);
    query.id = Number(query.id);
    if (!query.id) {
        history.push('/tag');
        return null;
    }
    const [tagList, setTagList] = useState([]);
    const [tagItem, setTagItem] = useState({});
    const [form] = Form.useForm();
    const updateTag = useRequest(updateTagAPI, { unmountAbort: false });
    const getTagList = useRequest(getTagListAPI);
    const getTagItem = useRequest(getTagItemAPI);
    const summerLoading = [updateTag].some(item => item.loading);

    const onFinish = (formData) => {
        delete formData.pid;
        formData.id = query.id;
        updateTag(formData)
            .then(() => {
                history.push('/tag');
            })
            .catch(() => {});
    };

    useEffect(() => {
        getTagList()
            .then((list) => {
                setTagList(list.filter(ele => !ele.pid));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        getTagItem({ id: query.id })
            .then((item) => {
                setTagItem(item);
                form.setFieldsValue({
                    pid: item.pid,
                    name: item.name,
                    description: item.description,
                });
            })
            .catch(() => {});
    }, [query.id]);

    const rules = {
        pid: [
            { required: true },
        ],
        name: [
            { required: true },
            { type: 'string', max: 30, min: 2 }
        ],
        description: [
            { type: 'string', max: 300 }
        ]
    };

    const TagSelect = (
        tagItem.pid ?
        <Form.Item name="pid" label="一级标签" rules={rules.pid}>
            <Select placeholder="请选择一级标签" disabled={true}>
                {tagList.map(tag => (<Select.Option value={tag.id} key={tag.id}>{tag.name}</Select.Option>))}
            </Select>
        </Form.Item>
        : null
    );
    return (
        <div className="blp-tagEdit-page">
            <Spin spinning={summerLoading}>
                <Form {...layout} form={form} onFinish={onFinish} className="blp-form">
                    {TagSelect}
                    <Form.Item name='name' label='标签名' rules={rules.name}>
                        <Input allowClear maxLength={30} placeholder='请输入标签名' autoComplete='off'/>
                    </Form.Item>
                    <Form.Item name='description' label='标签描述' rules={rules.description}>
                        <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入描述'/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type='primary' loading={updateTag.loading} htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
}
export default EditTag;
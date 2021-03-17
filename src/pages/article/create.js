import React, { useState, useEffect } from 'react';
import {Form, Button, message, Spin, Input} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { createArticleAPI, updateArticleAPI } from '@/api/article';
import { getTagListAPI } from '@/api/tag';
import { ARTICLE_STATUS_MAP } from '@/enum/article';
import { setTagTreeLeafSelectable } from '@/common/utils';
import { compareIds } from '@/lib/utils';
import { useRequest } from '@/lib/hooks';
import BlogTreeSelect from '@/components/tree-select';
import './style/create.less';

// TODO:  编辑器id替换成ref

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const rules = {
    title: [
        { required: true },
        { whitespace: true },
        { type: 'string', max: 60, min: 2 }
    ],
    description: [
        { type: 'string', max: 200 },
        { whitespace: true }
    ],
    keyword: [
        { type: 'string', max: 200, required: true },
        { whitespace: true }
    ],
    tagIds: [
        { required: true },
        { type: 'array' }
    ],
};

const initialValues = {
    title: '',
    description: '',
    keyword: '',
    tagIds: []
};

function CreateArticlePage() {
    const [isFirstStep, setFirstStep] = useState(true);
    const [editor, setEditor] = useState();
    const [articleItem, setArticleItem] = useState(null);
    const [tagTree, setTagTree] = useState([]);
    const [form] = Form.useForm();
    const getTagList = useRequest(getTagListAPI);
    const createArticle = useRequest(createArticleAPI, { unmountAbort: false });
    const updateArticle = useRequest(updateArticleAPI, { unmountAbort: false });
    const summerLoading = [createArticle, updateArticle].some(item => item.loading);
    const saveLoading = [updateArticle, createArticle].some(item => item.loading);

    const editArticle = (param) => {
        let data = null;
        const [adds, dels] = compareIds(param.tagIds, articleItem.tagIds);
        ['title', 'description', 'keyword', 'content'].forEach((key) => {
            if (articleItem[key] !== param[key]) {
                data = data || {};
                data[key] = param[key];
            }
        });
        if (adds.length || dels.length) {
            data = data || {};
            data.tagIds = param.tagIds;
        }
        if (!data) {
            message.info('未作任何修改!');
            return;
        }
        data.id = articleItem.id;
        updateArticle(data)
            .then(() => {
                setArticleItem(Object.assign(articleItem, data));
            })
            .catch(() => {})
    };

    const addArticle = (param) => {
        createArticle(param)
            .then((res) => {
                res.tagIds = res.tags.map(tag => tag.tagId);
                delete res.tags;
                setArticleItem(res);
            })
            .catch(() => {})
    };

    const onSaveArticle = (status) => {
        const content = editor.getMarkdown();
        if (!content || !content.trim()) {
            message.error('请输入文章内容!');
            return;
        }
        const baseFormData = form.getFieldsValue();
        baseFormData.content = content;
        if (articleItem) {
            editArticle(baseFormData);
        } else {
            baseFormData.status = String(status);
            addArticle(baseFormData);
        }
    };

    const onNextStep = () => {
        form.validateFields()
            .then(() => {
                setFirstStep(false);
            })
            .catch(() => {})
    };

    const onPreStep = () => {
        setFirstStep(true);
    };

    useEffect(() => {
        const editor = window.editormd('blp-articleCreate-editor', {
            width  : '100%',
            height : '600px',
            path   : '/editormd/lib/',
            theme : "dark",
            previewTheme : "dark",
            editorTheme : "pastel-on-dark",
            saveHTMLToTextarea: true
        });
        setEditor(editor);
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            title: '',
            description: '',
            keyword: '',
            tagIds: []
        });
    }, [])

    useEffect(() => {
        getTagList()
            .then((tags) => {
                setTagTree(setTagTreeLeafSelectable(tags));
            })
            .catch(() => {});
    }, []);

    
    useEffect(() => {
        if (editor && !isFirstStep) {
            editor.resize();
        }
    }, [editor, isFirstStep]);


    const StepSwitch = (
        isFirstStep ?
        <Button type="text" style={{padding: 0, marginRight: 20}} onClick={onNextStep} className="blp-articleCreate-header-button">
            下一步
            <RightOutlined />
        </Button> :
        <Button type="text" style={{padding: 0, marginRight: 20}} onClick={onPreStep} className="blp-articleCreate-header-button">
            <LeftOutlined />
            上一步
        </Button>
    );
    const ToolButtons = isFirstStep ? null : (
        (articleItem && articleItem.status === ARTICLE_STATUS_MAP.finished) ?
            <Button type="primary" loading={saveLoading} onClick={()=>onSaveArticle(1)} className="blp-articleCreate-header-button">
                {saveLoading ? '保存中' : '保存文章'}
            </Button> :
            <Button type="primary" loading={saveLoading} onClick={()=>onSaveArticle(2)} className="blp-articleCreate-header-button">
                {saveLoading ? '保存中' : '保存草稿'}
            </Button>
    );
    

    return (
        <div className="blp-articleCreate-page">
            <Spin spinning={summerLoading}>
                <section className="blp-articleCreate-header">
                    {StepSwitch}
                    {ToolButtons}
                </section>
                <section className="blpc-baseForm-component" style={{display: isFirstStep ? 'block' : 'none' }}>
                    <Spin spinning={summerLoading}>
                        <Form form={form} initialValues={initialValues}>
                            <Form.Item name='title' label='标题' rules={rules.title} {...formItemLayout}>
                                <Input allowClear maxLength={60} placeholder='请输入标题' autoComplete='off'/>
                            </Form.Item>
                            <Form.Item name="tagIds" label="标签" rules={rules.tagIds} {...formItemLayout}>
                                <BlogTreeSelect trerData={tagTree}/>
                            </Form.Item>
                            <Form.Item name='keyword' label='关键字' rules={rules.keyword} {...formItemLayout}>
                                <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入关键字'/>
                            </Form.Item>
                            <Form.Item name='description' label='文章描述' rules={rules.description} {...formItemLayout}>
                                <Input.TextArea rows={4} allowClear maxLength={200} placeholder='请输入描述'/>
                            </Form.Item>
                        </Form>
                    </Spin>
                </section>
                <section className="blp-articleCreate-editor" style={{display: isFirstStep ? 'none' : 'block' }}>
                    <div id="blp-articleCreate-editor">
                        <textarea style={{display: 'none'}}/>
                    </div>
                </section>
            </Spin>
        </div>
    );
}

export default CreateArticlePage;
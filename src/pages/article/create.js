import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, message, Spin, Input, Radio, Modal } from 'antd';
import { SaveOutlined } from '@ant-design/icons'
import { createArticleAPI, updateArticleAPI, getArticleAPI } from '@/api/article';
import { getTagListAPI } from '@/api/tag';
import { ARTICLE_STATUS } from '@/enum/article';
import { setTagTreeLeafSelectable } from '@/common/utils';
import { layout } from '@/common/layout';
import { getChangedData } from '@/lib/utils';
import { useRequest } from '@/lib/hooks';
import { parseQuery } from '@/lib/utils';
import BlogTreeSelect from '@/components/tree-select';
import './style/create.less';

const rules = {
    title: [
        { required: true },
        { whitespace: true },
        { type: 'string', max: 60, min: 2 }
    ],
    status: [
        { 
            required: true, 
            type: 'enum', 
            enum: [ARTICLE_STATUS.draft.value, ARTICLE_STATUS.finished.value]
        }
    ],
    description: [
        { type: 'string', max: 300 },
        { whitespace: true }
    ],
    keyword: [
        { type: 'string', max: 300, required: true,whitespace: true },
    ],
    tagId: [
        { required: true, type: 'integer' },
    ],
};

const initialValues = {
    title: '测试创建文章',
    status: ARTICLE_STATUS.draft.value,
    description: '测试创建文章',
    keyword: 'proxy,vue双向绑定',
    tagId: ''
};
// const initialValues = {
//     title: '',
//     status: ARTICLE_STATUS.draft.value,
//     description: '',
//     keyword: '',
//     tagId: ''
// };

export default function CreateArticlePage(props) {
    const query = parseQuery(props.location.search);
    const [isFirstStep, setFirstStep] = useState(!query.id);
    const [editor, setEditor] = useState();
    const [articleItem, setArticleItem] = useState(null);
    const [tagTree, setTagTree] = useState([]);
    const [form] = Form.useForm();
    const contentChangedRef = useRef(false);
    const editorLoadedRef = useRef(false);
    const getTagList = useRequest(getTagListAPI);
    const getArticle = useRequest(getArticleAPI);
    const createArticle = useRequest(createArticleAPI, { unmountAbort: false });
    const updateArticle = useRequest(updateArticleAPI, { unmountAbort: false });
    const summerLoading = [createArticle, updateArticle, getTagList, getArticle].some(item => item.loading);
    const saveLoading = [updateArticle, createArticle].some(item => item.loading);
    

    const editArticle = (params) => {
        return updateArticle(params)
            .then(() => {
                setArticleItem(Object.assign(articleItem, params));
                contentChangedRef.current = false;
            })
            .catch(() => {})
    };

    const addArticle = (params) => {
        return createArticle(params)
            .then((res) => {
                setArticleItem(res);
                contentChangedRef.current = false;
            })
            .catch(() => {});
    };

    const onSubmit = () => {
        const baseFormData = form.getFieldsValue();
        const content = editor.getMarkdown();
        const draft = ARTICLE_STATUS.draft.value;
        const finished = ARTICLE_STATUS.finished.value;
        baseFormData.content = content;

        const cb = () => {
            if (!articleItem) {
                addArticle(baseFormData);
                return;
            }
            
            let params = getChangedData(baseFormData, articleItem, ['title', 'description', 'keyword', 'content', 'status']);
            if (!params) {
                message.info('未作任何修改!');
                return;
            }
            if (content.trim().length < 20 && finished === params.status) {
                message.info('请完善文章内容!');
                return;
            }
        
            params = baseFormData;
            params.id = articleItem.id;
            !contentChangedRef.current && (params.content = undefined);

            if (params.status === draft && articleItem.status === finished) {
                Modal.confirm({
                    title: `确定将【已完成】文章存为【草稿】?`,
                    onOk() {
                        return editArticle(params);
                    },
                    onCancel() {
                        updateArticle.cancel();
                    },
                });
                return;
            }

            editArticle(params)
        }

        form.validateFields()
            .then(() => {
                cb();
            })
            .catch(() => {
                setFirstStep(true);
            });
        
    };

    
    // 初始化编辑器
    useEffect(() => {
        const editor = window.editormd('blp-editor', {
            width  : '100%',
            height : '600px',
            path   : '/editormd/lib/',
            theme : "dark",
            previewTheme : "dark",
            editorTheme : "pastel-on-dark",
            saveHTMLToTextarea: true,
            onchange() {
                contentChangedRef.current = true;
            },
            onload() {
                editorLoadedRef.current = true;
                this.resize();
            }
        });
        setEditor(editor);
    }, []);

    // 重置编辑器尺寸
    useEffect(() => {
        if (editor && !isFirstStep && editorLoadedRef.current) {
            editor.resize();
        }
    }, [editor, isFirstStep]);

    // 获取详情
    useEffect(() => {
        if (query.id) {
            getArticle({ id: query.id })
                .then((res) => {
                    setArticleItem(res);
                    form.setFieldsValue({
                        title: item.title,
                        description: item.description,
                        keyword: item.keyword,
                        tagId: item.tagId
                    });
                })
                .catch(() => {})
        } else {
            setArticleItem(null);
            form.setFieldsValue({...initialValues});
        }
    }, [query.id])

    // 获取tagList
    useEffect(() => {
        getTagList()
            .then((tags) => {
                setTagTree(setTagTreeLeafSelectable(tags));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="blp-articleCreate-page">
            <section className="blp-header">
                    <div>
                        <Radio.Group value={isFirstStep} onChange={(event) => setFirstStep(event.target.value)}>
                            <Radio.Button value={true}>基础信息</Radio.Button>
                            <Radio.Button value={false}>文章内容</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div>
                        <Button 
                            type="primary" 
                            icon={<SaveOutlined />} 
                            loading={saveLoading} 
                            onClick={() => onSubmit()}
                        >
                            {saveLoading ? '保存中...' : '保存'}
                        </Button>
                    </div>
                </section>

            <Spin spinning={summerLoading}>
                <section className="blp-form" style={{display: isFirstStep ? 'block' : 'none' }}>
                    <Form form={form} initialValues={initialValues} {...layout}>
                        <Form.Item name='title' label='标题' rules={rules.title}>
                            <Input allowClear maxLength={60} placeholder='请输入标题' autoComplete='off'/>
                        </Form.Item>
                        <Form.Item name="tagId" label="标签" rules={rules.tagId}>
                            <BlogTreeSelect treeData={tagTree} multiple={false}/>
                        </Form.Item>
                        <Form.Item name="status" label="状态" rules={rules.status}>
                            <Radio.Group>
                                <Radio value={ARTICLE_STATUS.finished.value}>{ARTICLE_STATUS.finished.label}</Radio>
                                <Radio value={ARTICLE_STATUS.draft.value}>{ARTICLE_STATUS.draft.label}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name='keyword' label='关键字' rules={rules.keyword}>
                            <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入关键字'/>
                        </Form.Item>
                        <Form.Item name='description' label='文章描述' rules={rules.description}>
                            <Input.TextArea rows={4} allowClear maxLength={300} placeholder='请输入描述'/>
                        </Form.Item>
                    </Form>
                </section>

                <section className="blp-editor" style={{display: isFirstStep ? 'none' : 'block' }}>
                    <div id="blp-editor">
                        <textarea style={{display: 'none'}}/>
                    </div>
                </section>
            </Spin>
        </div>
    );
}

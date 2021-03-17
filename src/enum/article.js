// 文章状态
export const ARTICLE_STATUS_MAP = {
    finished: '1', // 已完成
    draft: '2', // 草稿
};

export const ARTICLE_STATUS_LABEL = {
    1: '已完成',
    2: '草稿'
};

// 笔记与目录的关联类型
export const RELATION_TYPE = {
    link: { label: '链接', value: 1, key: 'label' },
    article: { label: '文章', value: 2, key: 'article' }
};
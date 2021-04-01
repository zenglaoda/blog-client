/**
 * @deprecated
 */
export const ARTICLE_STATUS_MAP = {
    finished: '1', // 已完成
    draft: '2', // 草稿
};

/**
 * @deprecated
 */
export const ARTICLE_STATUS_LABEL = {
    1: '已完成',
    2: '草稿'
};

// 文章状态
export const ARTICLE_STATUS = {
    all: { label: '全部状态', value: '' },
    finished: { label: '完成', value: '1' },
    draft: { label: '草稿', value: '2' },
};

export const ARTICLE_STATUS_LIST = [
    ARTICLE_STATUS.all,
    ARTICLE_STATUS.finished,
    ARTICLE_STATUS.draft,
];

// 笔记与目录的关联类型
export const NOTE_TYPE = {
    link: { label: '链接', value: '1' },
    article: { label: '文章', value: '2' }
};
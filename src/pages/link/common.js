import { useState } from "react";

export const rules = {
    title: [
        { required: true },
        { whitespace: true },
        { type: 'string', max: 60, min: 2 }
    ],
    url: [
        { required: true },
        { whitespace: true },
        { type: 'url', max: 100, min: 2 }
    ],
    tagIds: [
        { required: true },
        { type: 'array' }
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
        { required: true }
    ]
};

export function useGetInitialValues() {
    return useState({
        title: '',
        url: '',
        tagIds: [],
        keyword: '',
        description: ''
    });
}

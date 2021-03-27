export const rules = {
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
/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LessonCreate = {
    properties: {
        day: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        notes: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        group_id: {
            type: 'number',
            isRequired: true,
        },
        assistants: {
            type: 'array',
            contains: {
                type: 'number',
            },
            isRequired: true,
        },
    },
} as const;

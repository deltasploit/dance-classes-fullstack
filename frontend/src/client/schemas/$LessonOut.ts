/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LessonOut = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        group: {
            type: 'GroupOut',
            isRequired: true,
        },
        day: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        assistants: {
            type: 'array',
            contains: {
                type: 'StudentOut',
            },
        },
    },
} as const;

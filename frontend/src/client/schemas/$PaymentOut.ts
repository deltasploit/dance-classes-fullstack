/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentOut = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        created_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        day: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        amount: {
            type: 'number',
            isRequired: true,
        },
        notes: {
            type: 'string',
            isRequired: true,
        },
        method: {
            type: 'string',
            isRequired: true,
        },
        reason: {
            type: 'string',
            isRequired: true,
        },
        student: {
            type: 'StudentOut',
            isRequired: true,
        },
    },
} as const;

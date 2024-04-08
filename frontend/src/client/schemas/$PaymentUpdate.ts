/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentUpdate = {
    properties: {
        amount: {
            type: 'number',
            isRequired: true,
        },
        notes: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        day: {
            type: 'string',
            isRequired: true,
            format: 'date',
        },
        method: {
            type: 'string',
        },
        reason: {
            type: 'string',
        },
    },
} as const;

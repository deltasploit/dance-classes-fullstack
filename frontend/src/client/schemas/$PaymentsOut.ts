/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentsOut = {
    properties: {
        data: {
            type: 'array',
            contains: {
                type: 'PaymentOut',
            },
            isRequired: true,
        },
        count: {
            type: 'number',
        },
    },
} as const;

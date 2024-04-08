/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StudentOut } from './StudentOut';

export type PaymentOut = {
    id: number;
    created_at: string;
    day: string;
    amount: number;
    notes: string;
    method: string;
    reason: string;
    student: StudentOut;
};


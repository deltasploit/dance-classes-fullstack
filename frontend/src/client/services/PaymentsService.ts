/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from '../models/Message';
import type { PaymentCreate } from '../models/PaymentCreate';
import type { PaymentOut } from '../models/PaymentOut';
import type { PaymentsOut } from '../models/PaymentsOut';
import type { PaymentUpdate } from '../models/PaymentUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaymentsService {

    /**
     * Read Payments
     * Retrieve payments.
     * @returns PaymentsOut Successful Response
     * @throws ApiError
     */
    public static readPayments({
        skip,
        limit = 100,
        studentId,
    }: {
        skip?: number,
        limit?: number,
        /**
         * Student ID to filter by
         */
        studentId?: (number | null),
    }): CancelablePromise<PaymentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payments/',
            query: {
                'skip': skip,
                'limit': limit,
                'student_id': studentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Payment
     * Create new payment.
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static createPayment({
        requestBody,
    }: {
        requestBody: PaymentCreate,
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/payments/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Payment
     * Get student by ID.
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static readPayment({
        id,
    }: {
        id: number,
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payments/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Payment
     * Update a payment.
     * @returns PaymentOut Successful Response
     * @throws ApiError
     */
    public static updatePayment({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: PaymentUpdate,
    }): CancelablePromise<PaymentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/payments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Payment
     * Delete a payment.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static deletePayment({
        id,
    }: {
        id: number,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/payments/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}

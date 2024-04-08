/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from '../models/Message';
import type { StudentCreate } from '../models/StudentCreate';
import type { StudentOut } from '../models/StudentOut';
import type { StudentsOut } from '../models/StudentsOut';
import type { StudentUpdate } from '../models/StudentUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StudentsService {

    /**
     * Read Students
     * Retrieve students.
     * @returns StudentsOut Successful Response
     * @throws ApiError
     */
    public static readStudents({
        skip,
        limit = 100,
        groupId,
    }: {
        skip?: number,
        limit?: number,
        /**
         * Group ID to filter by
         */
        groupId?: (number | null),
    }): CancelablePromise<StudentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/students/',
            query: {
                'skip': skip,
                'limit': limit,
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Student
     * Create new student.
     * @returns StudentOut Successful Response
     * @throws ApiError
     */
    public static createStudent({
        requestBody,
    }: {
        requestBody: StudentCreate,
    }): CancelablePromise<StudentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/students/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Student
     * Get student by ID.
     * @returns StudentOut Successful Response
     * @throws ApiError
     */
    public static readStudent({
        id,
    }: {
        id: number,
    }): CancelablePromise<StudentOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/students/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Student
     * Update a student.
     * @returns StudentOut Successful Response
     * @throws ApiError
     */
    public static updateStudent({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: StudentUpdate,
    }): CancelablePromise<StudentOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/students/{id}',
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
     * Delete Student
     * Delete an student.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static deleteStudent({
        id,
    }: {
        id: number,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/students/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}

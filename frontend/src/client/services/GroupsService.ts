/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GroupCreate } from '../models/GroupCreate';
import type { GroupOut } from '../models/GroupOut';
import type { GroupsOut } from '../models/GroupsOut';
import type { GroupUpdate } from '../models/GroupUpdate';
import type { Message } from '../models/Message';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GroupsService {

    /**
     * Read Groups
     * Retrieve Groups.
     * @returns GroupsOut Successful Response
     * @throws ApiError
     */
    public static readGroups({
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
    }): CancelablePromise<GroupsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/groups/',
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
     * Create Group
     * Create new Group.
     * @returns GroupOut Successful Response
     * @throws ApiError
     */
    public static createGroup({
        requestBody,
    }: {
        requestBody: GroupCreate,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/groups/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Group
     * Get Group by ID.
     * @returns GroupOut Successful Response
     * @throws ApiError
     */
    public static readGroup({
        id,
    }: {
        id: number,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/groups/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Group
     * Update a group.
     * @returns GroupOut Successful Response
     * @throws ApiError
     */
    public static updateGroup({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: GroupUpdate,
    }): CancelablePromise<GroupOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/groups/{id}',
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
     * Delete Group
     * Delete an Group.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static deleteGroup({
        id,
    }: {
        id: number,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/groups/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}

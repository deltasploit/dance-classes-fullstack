/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LessonCreate } from '../models/LessonCreate';
import type { LessonOut } from '../models/LessonOut';
import type { LessonsOut } from '../models/LessonsOut';
import type { LessonUpdate } from '../models/LessonUpdate';
import type { Message } from '../models/Message';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LessonsService {

    /**
     * Read Lessons
     * Retrieve lessons.
     * @returns LessonsOut Successful Response
     * @throws ApiError
     */
    public static readLessons({
        skip,
        limit = 100,
        studentId,
        groupId,
    }: {
        skip?: number,
        limit?: number,
        /**
         * Student ID to filter by
         */
        studentId?: (number | null),
        /**
         * Group ID to filter by
         */
        groupId?: (number | null),
    }): CancelablePromise<LessonsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/lessons/',
            query: {
                'skip': skip,
                'limit': limit,
                'student_id': studentId,
                'group_id': groupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Lesson
     * Create new lesson.
     * @returns LessonOut Successful Response
     * @throws ApiError
     */
    public static createLesson({
        requestBody,
    }: {
        requestBody: LessonCreate,
    }): CancelablePromise<LessonOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/lessons/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Read Lesson
     * Get lesson by ID.
     * @returns LessonOut Successful Response
     * @throws ApiError
     */
    public static readLesson({
        id,
    }: {
        id: number,
    }): CancelablePromise<LessonOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/lessons/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Lesson
     * Update an existing lesson.
     * @returns LessonOut Successful Response
     * @throws ApiError
     */
    public static updateLesson({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: LessonUpdate,
    }): CancelablePromise<LessonOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/lessons/{id}',
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
     * Delete Lesson
     * Delete a lesson.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static deleteLesson({
        id,
    }: {
        id: number,
    }): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/lessons/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}

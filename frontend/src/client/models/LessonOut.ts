/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupOut } from './GroupOut';
import type { StudentOut } from './StudentOut';

export type LessonOut = {
    id: number;
    group: GroupOut;
    day: string;
    assistants?: Array<StudentOut>;
};


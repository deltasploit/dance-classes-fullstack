/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GroupStudentLink } from './GroupStudentLink';

export type StudentOut = {
    full_name: string;
    city?: (string | null);
    responsible_adult_full_name?: (string | null);
    responsible_adult_phone_number?: (string | null);
    notes?: (string | null);
    id: number;
    group_links: Array<GroupStudentLink>;
};


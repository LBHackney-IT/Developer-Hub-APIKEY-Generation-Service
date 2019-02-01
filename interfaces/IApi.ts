import { ICompiancy } from './ICompliancy';

export interface IApi {
    id: string;
    title: string;
    summary: string;
    compliant: ICompiancy;
    internal: boolean;
    staging?: {
        url?: string,
        swagger_url?: string,
        deployed: boolean,
        healthStatus: boolean,
    };
    production?: {
        url?: string,
        swagger_url?: string,
        deployed: boolean,
        healthStatus: boolean
    };
    description: string;
    approved: boolean;
    stage?: string;
    github_url?: string;
    owner?: {
        product?: {
            name?: string,
            contactDetails?: string
        },
        technical?: {
            name?: string,
            contactDetails?: string
        }
    };
}
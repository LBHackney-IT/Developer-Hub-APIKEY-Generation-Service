import { ICompiancy } from './ICompliancy';

export interface IApi {
    id: string,
    title: string,
    summary: string,
    compliant: ICompiancy,
    staging?: {
        url?: string,
        swagger_url?: string,
        deployed: boolean,
        healthStatus: boolean,
    },
    production?: {
        url?: string,
        swagger_url?: string,
        deployed: boolean,
        healthStatus: boolean
    },
    description: string,
    github_url?: string,
    owner?: {
        name?: string,
        contactDetails?: string
    }
}
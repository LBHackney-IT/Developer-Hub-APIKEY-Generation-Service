import { ICompiancy } from './ICompliancy';
import { IStage } from './IStage';

export interface IApi {
    id: string;
    title: string;
    summary: string;
    compliant: ICompiancy;
    internal: boolean;
    staging?: IStage;
    development?: IStage;
    production?: IStage;
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
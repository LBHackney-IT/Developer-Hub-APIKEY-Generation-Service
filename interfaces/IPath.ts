import { IPathParameter } from './IPathParameter';
export interface IPath {
    requestType: string;
    url: string;
    tags: string[];
    summary: string;
    parameters: IPathParameter[];
    responses: object;
}

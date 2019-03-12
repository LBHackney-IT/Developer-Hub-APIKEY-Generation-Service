import { IPathParameter } from './IPathParameter';
export interface IPath {
    id: string;
    requestType: string;
    url: string;
    tags: string[];
    summary: string;
    parameters: IPathParameter[];
    responses: object;
}

import { IPath } from "./IPath";

export interface ISwagger {
    id: string;
    title: string;
    description: string;
    paths: IPath[];
    version: string;
}
import { IPath } from './interfaces/IPath';
import { IPathParameter } from './interfaces/IPathParameter';
export const generateID = (cognitoUsername: string, apiID: string): string => {
    return cognitoUsername + '_' + apiID;
}

export const assignToBody = (item: Object | Array<any> | String): object => {
    return {
        body: item
    };
}

export const createPathKey = (pathObject: object): IPath[] => {
    const keys = Object.keys(pathObject);
    console.log('keys',keys)
    const paths: IPath[] = keys.map((key) => {
        const url: string = key;
        const requestType: string = Object.keys(pathObject[url])[0];
        const tags: string[] = pathObject[url][requestType]['tags'];
        const summary: string = pathObject[url][requestType]['summary'];
        const parameters: IPathParameter[] = pathObject[url][requestType]['parameters'];
        const responses: object = pathObject[url][requestType]['responses'];

        return {
            url: url,
            requestType: requestType,
            tags: tags,
            summary: summary,
            parameters: parameters,
            responses: responses
        };
    });

    return paths;
}

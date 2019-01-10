export class responseService {
    
    static success = (data: object | string) => {
        return {
            statusCode: 200,
            data: data
        }
    }

    static error = (message: string, statusCode: number | string) => {
        return {
            statusCode: statusCode,
            message: message
        }
    }
}
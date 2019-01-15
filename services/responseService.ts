export class responseService {
    
    static success = (data: object | string) => {
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }

    static error = (message: string, statusCode: number) => {
        return {
            statusCode: statusCode,
            body: JSON.stringify({
                error: {
                   message: message
                }
            })
                
        }
    }
}
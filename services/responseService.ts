export class responseService {
    
    static success = (data: object | string) => {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(data)
        }
    }

    static error = (message: string, statusCode: number) => {
        return {
            statusCode: statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                error: {
                   message: message
                }
            })
                
        }
    }
}
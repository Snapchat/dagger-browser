// This class is used to handle HttpException
class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string){
        super(message)
        this.status = status
        this.message = message
    }
}
export default HttpException;
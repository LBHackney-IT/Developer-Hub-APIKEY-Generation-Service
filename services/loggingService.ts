const { transports, createLogger, format } = require('winston');
require('winston-papertrail');
import * as winstone from 'winston';

export class loggingService {
    winstonPapertrail = transports.Papertrail({
        host: 'logs7.papertrailapp.com',
        port: 51346,
        colorize: true
    });

    logger = new createLogger({
        format: format.combine(
            format.simple(),
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }), 
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)),
        transports: [this.winstonPapertrail]
    });

    info = (text: string) => {
        this.logger.info(text);
    }

    error = (text: string) => {
        this.logger.error(text);
    }

    warn = (text: string) => {
        this.logger.warn(text);
    }


}
import *  as  winston from 'winston';
import { format, createLogger, transports } from "winston";
const { timestamp, combine, printf } = format;

const logFormat = printf(({ message, timestamp, stack }) => {
    return `${timestamp} : ${stack || message}`;
});

export const logger = createLogger({
    format: combine(
        format.colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        logFormat
    ),
    'transports': [
        new winston.transports.File({
            filename: 'logs/log_inserciones.log'
        })
    ]
});
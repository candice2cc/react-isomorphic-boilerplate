/**
 * @author Candice
 * @date 2018/6/21 14:28
 */
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

import { isDevelopment } from './helpers/env_helper';

const { combine, timestamp, prettyPrint } = winston.format;
let logPath;
if (isDevelopment()) {
  logPath = path.resolve(__dirname, '../../logs');
} else {
  logPath = path.resolve(__dirname, '../../../logs');
}
console.log(`logPath=${logPath}`);

// 两个日志文件：级别分别为info和error，按小时切片
// console跟踪debug日志，且仅在开发环境打印

const transports = [
  new winston.transports.DailyRotateFile({
    level: 'info',
    filename: 'app-info-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    dirname: logPath,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d'
  }),
  new winston.transports.DailyRotateFile({
    level: 'error',
    filename: 'app-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    dirname: logPath,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '60d'
  })
];
if (isDevelopment()) {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      name: 'console'
    })
  );
}

const logger = winston.createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports
});

export default logger;

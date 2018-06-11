/**
 * @author Candice
 * @date 2018/6/4 19:36
 */
export const ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 8000; // 服务端口号

console.log(`NODE_ENV=${ENV}`);
console.log(`PORT=${PORT}`);

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

export const isDevelopment = function () {
    return ENV === DEVELOPMENT;
};
export const isProduction = function () {
    return ENV === PRODUCTION;
};


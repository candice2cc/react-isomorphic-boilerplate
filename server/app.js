/**
 * @author Candice
 * @date 2018/6/20 14:16
 */
import proxy from 'http-proxy-middleware';
import helloController from './controllers/hello_controller';

const useApp = app => {
  app.use('/hello', helloController);
  // 代理后端接口
  app.use('/ws', proxy({target: 'http://10.8.1.211:8102', changeOrigin: true}));
};
export default useApp;

import { Application } from "express"
import { createProxyMiddleware, Options } from 'http-proxy-middleware'
import logger from './logger'

class ServiceProxy {
    private static readonly serviceConfigs = [
        {
            path: '/api/teste',
            url: 'humix-srv-teste.teste.svc.cluster.local:8080',
            pathRewrite: {'^/': '/health'},
            name: 'humix-srv-teste',
            timeout: 5000
        }
    ]


  private static createProxyOptions(service: any): Options {
    return {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: service.timeout ,
      logger: logger,
      on: {
        error: ServiceProxy.handleProxyError,
        proxyReq: ServiceProxy.handleProxyRequest,
        proxyRes: ServiceProxy.handleProxyResponse,
      },
    };
  }

  private static handleProxyError(err: Error, req: any, res: any): void {
    logger.error(`Proxy error for ${req.path}:`, err);

    const errorResponse: any = {
      message: 'Service unavailable',
      status: 503,
      timestamp: new Date().toISOString(),
    };

    res
      .status(503)
      .setHeader('Content-Type', 'application/json')
      .end(JSON.stringify(errorResponse));
  }

  private static handleProxyRequest(proxyReq: any, req: any): void {
    // logger.debug(`Proxying request to ${req.path}`);
  }

  private static handleProxyResponse(proxyRes: any, req: any): void {
    // logger.debug(`Received response for ${req.path}`);
  }

  public static setupProxy(app: Application): void {
    ServiceProxy.serviceConfigs.forEach((service) => {
      const proxyOptions = ServiceProxy.createProxyOptions(service);
      app.use(service.path, createProxyMiddleware(proxyOptions));
      logger.info(`Configured proxy for ${service.name} at ${service.path}`);
    });
  }
}

export const proxyServices = (app: Application): void => {
  ServiceProxy.setupProxy(app);
};
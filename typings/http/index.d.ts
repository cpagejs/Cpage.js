declare class Http {
    /**
     * ajax请求方式，全配置
     * @param param0
     */
    ajax({ type, url, data }: {
        type?: string;
        url?: string;
        data: any;
    }): Promise<any>;
    /**
     * get请求方式
     * @param url
     */
    get(url: string): Promise<unknown>;
    /**
     * post请求
     * @param url
     * @param data
     */
    post(url: string, data: object): Promise<unknown>;
    /**
     * put请求
     * @param url
     * @param data
     */
    put(url: string, data: object): Promise<unknown>;
    /**
     * delete请求
     * @param url
     * @param data
     */
    delete(url: string, data: object): Promise<unknown>;
}
declare const http: Http;
export default http;

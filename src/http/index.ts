import { parseHttp } from './parseHttp';

class Http {

    /**
     * ajax请求方式，全配置
     * @param param0 
     */
    ajax({type='get',url='',data}):Promise<any>{
        return parseHttp(type, url, data);
    }

    /**
     * get请求方式
     * @param url 
     */
    get(url:string){
        return parseHttp('get', url, null);
    }

    /**
     * post请求
     * @param url 
     * @param data 
     */
    post(url:string, data:object){
        return parseHttp('post', url, data);
    }

    /**
     * put请求
     * @param url 
     * @param data 
     */
    put(url:string, data:object){
        return parseHttp('put', url, data);
    }

    /**
     * delete请求
     * @param url 
     * @param data 
     */
    delete(url:string, data:object){
        return parseHttp('delete', url, data);
    }

}

const http = new Http();
export default http;
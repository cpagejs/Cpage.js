import Util from '../util';
import * as $log from '../log';

// 支持的类型
const httpType = ['get', 'post', 'put', 'delete', 'head', 'options'];

/**
 * 解析http请求
 * @param type 请求类型
 * @param url 
 * @param data 
 */
export function parseHttp(type, url, data){
    if(Util.type(type) != 'string' && !httpType.includes(type.toLowerCase())){
        $log.error('http请求类型必须为'+httpType+'中的一个');
    }
    if(Util.type(url) != 'string'){
        $log.error('http请求的url参数需为字符');
    }
    if(data && Util.type(data) != 'object'){
        $log.error('http请求的data参数需为对象');
    }

    const promise = new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open(type, url);
        xhr.onreadystatechange = handel;
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(data || null);

        function handel(){
            if(this.readyState != 4){
                return;
            }
            if(this.status == 200){
                resolve(this.response);
            }else{
                reject(new Error(this.statusText));
            }
        }
    });

    return promise;
}
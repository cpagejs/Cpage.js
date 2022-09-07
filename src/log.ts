// 简单的日志打印

function log(str:any){
	console.log(str);
}

function info(str:any){
	console.info(str);
}

function warn(str:any){
	console.warn(str);
}

function error(str:any){
	throw new Error(str);
}

export { log, info, warn, error };
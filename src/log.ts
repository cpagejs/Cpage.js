function log(str:any){
	console.log(str);
}

function info(str:any){
	console.log(str);
}

function warn(str:any){
	console.log(str);
}

function error(str:any){
	throw new Error(str);
}

export { log, info, warn, error };
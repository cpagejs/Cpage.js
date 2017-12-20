const Cookie = {
	// 判断cookie是否可用
	support():boolean{
		if(!(document.cookie || navigator.cookieEnabled)) return false;
		return true;
	},

	// 添加cookie
	set(name:string, value:string, config?):void{
		// config = {hours, path, domain, secure}
		var data = name + "=" + encodeURIComponent(value);console.log(123)
	  	if(config && config.hours != undefined){
	  		var d = new Date();
	  		d.setHours(d.getHours() + config.hours);
	  		data += "; expires=" + d.toUTCString();
	  	}
	  	data += (config && config.path) ? ("; path=" + config.path) : "" ;
	  	data += (config && config.domain) ? ("; domain=" + config.domain) : "" ;
	  	data += (config && config.secure) ? ("; secure=" + config.secure) : "" ;

	  	document.cookie = data;
	},

	// 查询 cookie
	get(name?:string):string{
		let len = arguments.length;
		if(len == 0){
			var cs = document.cookie,
				arr = [],
				arr2 = [],
				obj = {};
			arr = cs.split(';');  
			// console.log(arr);
			for(var i=0; i<arr.length; i++){
				var a = arr[i].split('=');
				var a1 = [a[0].trim(), decodeURIComponent(a[1])];
				arr2.push(a1);
			}
			return JSON.stringify(arr2);
		}else if(len == 1){
			var reg = eval("/(?:^|;\\s*)" + name + "=([^=]+)(?:;|$)/"); 
	      	return reg.test(document.cookie) ? decodeURIComponent(RegExp.$1) : "";
		}
	},

	// 删除 cookie
	remove(name:string, path?:string):void{
		if(arguments.length == 0){
			var all = this.get();
			for(var i=0; i<all.length; i++){
				this.set(all[i][0],"",-1);
			}
		}

		this.set(name, path || '', {"hours":-1});
	}
}

export default Cookie;

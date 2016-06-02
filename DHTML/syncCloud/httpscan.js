/*
		httpscan.js

			created by mu-tan8

			from new XMLHttpRequest() Example by MDN	https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise 
*/

/*
opt? argsObject = {
	setHeaders : { <'setRequestHeaderName' : 'value' , ... > } ,
	getHeaders : { <'getResponseHeaderName' : null , ... > } ,
	responseType : <'xhr.responseType'> ,
	authUser : 'auth UserName String',
	authPW : 'auth PassWord String' ,
	sendData : <sendDatas>
}
*/
//method? ( get | head | post | delete | put )(args : argsObject): Promise { head : <'http-headers'> , body : < http-contents > }
//http(URL : string) : method (Require)

function http(URL){
	var core = {
		'ajax' : function (method , URL , args){
			return new Promise(function(resolve,reject){
				var xhr = new XMLHttpRequest();
				xhr.onload = function(){
					if (this.status >= 200 && this.status < 300){
						var headers = {};
						if ('getHeaders' in args){
							for (var name in args['getHeaders']){
								headers[name] = xhr.getResponseHeader(name);
								name = null;
							}
						}
						resolve({
							'head' : headers ,
							'body' : xhr.responseXML || xhr.response
						});
					}else{
						reject(xhr.statusText);
					}
					xhr = null;
				}
				xhr.onerror = function(){
					reject(xhr.statusText);
					xhr = null;
				}
				if ('responseType' in args){
					xhr.responseType = args['responseType'];
				}
				if ('setHeaders' in args){
					for (var name in args['setHeaders']){
						if (name == 'Content-Type' && xhr.overrideMimeType){
							xhr.overrideMimeType(args['setHeaders'][name]);
						}else{
							xhr.setRequestHeader(name , args['setHeaders'][name]);
						}
						name = null;
					}
				}
				xhr.open(method , URL , true , ('authUser' in args) ? args['authUser'] : '' , ('authPW' in args) ? args['authPW'] : '');
				xhr.send(('sendData' in args) ? args['sendData'] : null);
			});
		}
	}
	return {
		'get' : function(args){
			return core.ajax('get' , URL , args);
		} , 
		'head' : function(args){
			return core.ajax('head' , URL , args);
		} ,
		'post' : function(args){
			return core.ajax('post' , URL , args);
		} ,
		'delete' : function(args){
			return core.ajax('delete' , URL , args);
		} ,
		'put' : function(args){
			return core.ajax('put' , URL , args);
		}
	}
}

// File = {name: string , {@type: string @size: integer , @time: date} }
// Dir = {[name : strings]: File | Dir}
// dirRequest(URL: string) : Promise<Dir>
function dirRequest(URL){
	//directory scaner
	return http(URL)
	.get({
		'setHeaders' : {
			'Content-Type' : 'text/html'
		} , 
		'responseType' : 'document'
	})
	.then(function(resource){
		var link = resource.body.getElementsByTagName('a');
		var array = [] , j = 0;
		for (var i = 0;i < link.length;i++){
			if (link[i].getAttribute('href') == link[i].firstChild.nodeValue){
				array[j] = link[i].getAttribute('href');
				j++;
			}
		}
		return array;
	}).then(function(links){
		return Promise.all(
		links.map(function(link){
			if (/\/$/.test(link)){
				return dirRequest(URL+link)
				.then(function(dir){
					return {name: link.slice(0 , -1) , type: dir};
				});
			}else{
				return fileRequest(URL+link)
				.then(function(file){
					return {
						name: link ,
						type: {
							'@type' : file.head['Content-Type'] ,
							'@size' : parseInt(file.head['Content-Length']) ,
							'@time' : new Date(file.head['Last-Modified'])
						}
					}
				});
			}
		}));
	}).then(function(items){
		return items.reduce(function(o , item){
			o[item.name] = item.type;
			return o;
		} , {});
	});
}

// fileRequest(URL: string) : Promise {'Content-Type': string , 'Content-Length': , 'Last-Modified': string}
function fileRequest(URL){
	//file scaner
	return http(URL)
	.head({
		'getHeaders' : {
			'Content-Type' : null ,
			'Content-Length' : null ,
			'Last-Modified' : null
		}
	});
}


//from new XMLHttpRequest() Example by MDN	https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise 

//http(URL : string) : method (Require)
//method? ( get | head | post | delete | put )(args : argsObject): Promise { head : <'http-headers'> , body : < http-contents > }
/*
opt? argsObject = {
	setHeaders : { <'setRequestHeaderName' : 'value' , ... > } ,
	getHeaders : { <'getResponseHeaderName' : null , ... > } ,
	responseType : 'xhr.responseType' ,
	authUser : 'auth UserName String',
	authPW : 'auth PassWord String' ,
	sendData : <sendDatas>
}
*/

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

//	doesn't work. want help 
function dirRequest(URL){
	return http(URL)
	.get({
		'setHeaders' : {
			'Content-Type' : 'text/html'
		} , 
		'responseType' : 'document'
	})
	.then(function(resource){
		//return Promise.all(
			resource.body.getElementsByTagName('a').filter(function(link){
				return (link.getAttribute('href') == link.firstChild.nodeValue);
			})
			.map(function(link){
					if (/\/$/.test(link.getAttribute('href'))){
						return dirRequest(URL+link.getAttribute('href'))
						.then(function(dir){
							return {
								'name' : link.getAttribute('href') ,
								'attr' : dir
							}
						});
					}else{
						return fileRequest(URL+link.getAttribute('href'))
						.then(function(resource){
							return {
								'name' : link.getAttribute('href') ,
								'attr' : {
									'@type': resource.head['Content-Type'] ,
									'@size' : resource.head['Content-Length'] ,
									'@time' : resource.head['Last-Modified']
								}
							}
						});
					}
			});
		//);
	})
	.then(function(items){
		return items.reduce(function(o,item){
			o[item['name']] = item['attr'];
			return o;
		});
	});
}

//	doesn't work. want help
function fileRequest(URL){
	return http(URL)
	.head({
		'getHeaders' : {
			'Content-Type' : null ,
			'Content-Length' : null ,
			'Last-Modified' : null
		}
	});
}

/*
function dirRequest(URL){
	//Directory scanning
	var xhr = new XMLHttpRequest();

	xhr.onload = function (){
		var links = xhr.responseXML.getElementsByTagName('a');
		for (var i = 0;i < links.length;i++){
			if (links[i].getAttribute('href') == links[i].firstChild.nodeValue){
				if (/\/$/.test(links[i].getAttribute('href'))){
					console.log(URL+links[i].firstChild.nodeValue);
					dirRequest(URL+links[i].getAttribute('href'));
				}else{
					fileRequest(URL,links[i].getAttribute('href'));
				}
			}
		}
	}
	xhr.onerror = function (e){
		alert(xhr.status);
	}
	xhr.open('get',URL,true);
	xhr.responseType = 'document';
	if (xhr.overrideMimeType){
		xhr.overrideMimeType('text/html');
	}else{
		xhr.setRequestHeader('Content-Type','text/html');
	}
	xhr.send(null);
}


function fileRequest(URL,entry){
	//File Scanning
	var xhr = new XMLHttpRequest();
	xhr.onload = function (){
			headers = {'fileType':'Content-Type','fileSize':'Content-Length','lastModified':'Last-Modified'};
			for (var name in headers){
				headers[name] = xhr.getResponseHeader(headers[name]);
			}
			headers['fileName'] = entry;
			console.log('"'+URL+entry+'":'+JSON.stringify(headers));
			xhr = null;
	}
	xhr.onerror = function (e){
		alert(xhr.status);
	}
	xhr.open('head',URL+entry,true);
	xhr.send(null);
}
*/


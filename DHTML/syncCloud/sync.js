function Sync(URL){
	var LocalTime = new Date().toGMTString();
	return http(URL)
	.head({ 'getHeaders' : { 'Date' : null } } )
	.then(function(res){

		var ServerTime = res.head['Date'];

		//Files on Server
		var oSFS;
		dirRequest(URL)
		.then(function(o){return oSFS = o})
		.catch(console.error.bind(console));
		console.log('LT:'+LocalTime);

		//Files on Local
		var oCFS;
		tree('/')
		.then(function(o){return oCFS = o})
		.catch(console.error.bind(console));

		console.log('ST:'+ServerTime);

		setTimeout(function(){
			if (!oSFS || !oCFS ){
				setTimeout(arguments.callee,1);
			}else{
				console.log('"ServerFiles":'+JSON.stringify(oSFS , null , "\t"));	//file sync compare process
			}
		},1);
		console.log('offset:'+(new Date(LocalTime).getTime() - new Date(ServerTime).getTime()));
		return res;
	})
	.catch(console.error.bind(console));
}

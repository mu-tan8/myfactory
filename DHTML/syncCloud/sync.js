function Sync(URL){
	return http(URL)
	.head({ 'getHeaders' : { 'Date' : null } } )
	.then(function(res){

		var LocalTime = new Date().toGMTString();
		var ServerTime = res.head['Date'];

		//Files on Server
		var oSFS = dirRequest(URL)
		.then(function(o){return o})
		.error(console.error.bind(console));

		//Files on Local
		var oCFS = tree('/')
		.then(function(o){return o})
		.catch(console.error.bind(console));

		return true;
	})
	.catch(console.error.bind(console));
}

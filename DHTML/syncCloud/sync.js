/*

		sync.js
			created by mu-tan8
*/

//
// compareDiffSelect( <DIR> , <DIR> ) : {'up':[listA] , 'down':[listB]}
function compareDiffSelect(objA , objB){

	var oUL = [] , oDL = [];

	var cmp = function (entry , obj , path){

		Object.keys(entry).forEach(function(p){

			var path = path+'/'+p;

			if ('@time' in entry[p]){

				if (p in obj){

					var diff = new Date(entry[p]['@time']).getTime() - new Date(obj[p]['@time']).getTime();

					if (diff){

						if (diff > 0){
							oUL[path] = true;
						}else if(diff < 0){
							oDL[path] = true;
						}

					}

					diff = null;
				}else{

					oUL[path] = true;

				}
			}else{

				cmp( entry[p] , obj , path );

			}

		});

	};


	cmp(objA , objB , '');

	cmp(objB , objA , '');

	var ktov = function(key){

		var n = 0 , ary = [];

		for (var v in key){
			key[n] = v;
			n++;
			v = null;
		}

		return ary;

	};

	var ul = ktov(oUL);
	var dl = ktov(dDL);

	ktov = cmp = null;
	oUL = oDL = null;

	return {'up':ul , 'down':dl};

}

function Sync(URL){
	var LocalTime = new Date().toGMTString();
	return http(URL)
	.head({ 'getHeaders' : { 'Date' : null } } )
	.then(function(res){

		var ServerTime = res.head['Date'];

		var OffsetTime = new Date(LocalTime).getTime() - new Date(ServerTime).getTime();

		//Files on Server
		var oSFS;
		dirRequest(URL)
		.then(function(o){return oSFS = o})
		.catch(console.error.bind(console));
		console.log('LT:'+LocalTime);

		Files on Local
		var oCFS;
		tree('/')
		.then(function(o){return oCFS = o})
		.catch(console.error.bind(console));

		console.log('ST:'+ServerTime);

		var t = 100;
		setTimeout(function(){

			if (!oSFS || !oCFS ){

				setTimeout(arguments.callee , t);

			}else{

				var oAry = compareDiffSelect(oCFS , oSFS);


				dirRequest(URL)
				.then(function(o){JSON.stringify(o)})	//	to generate .updatelist.json file by http().post()	
				.catch(console.error.bind(console));

				tree('/')
				.then(function(o){fs.writeFileAsync('/.updatelist.json',JSON.stringify(o))})
				.catch(console.error.bind(console));

			}

		} , t);
		return res;
	})
	.catch(console.error.bind(console));
}

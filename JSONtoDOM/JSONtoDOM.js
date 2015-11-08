//
//	JSON to DOM
//
//	elements = [{'tagName':'element1',},{'tagName':'element2','attributes':{/*	element2_attribute	*/},'elements':[{/*	element2_children	*/}],text:'text'},];	/*	ordinary elements. required a tagName.	*/
//	attributes = {'attribute1_name':'attribute1_value','attribute2_name':'attribute2_value',};	/*	has attributes only. don't nesting	*/
//	text = 'plain text strings';	/*	has text only. don't nesting	*/
//

var object = {
	'elements':[{
		'tagName':'html',
		'attributes':{
			'lang':'ja'
		},
		'elements':[
		{
			'tagName':'head'
		},
		{
			'tagName':'body',
			'elements':[{
				'tagName':'p',
				'text':'test'
			}]
		}
		]
	}]
};

/*

object to DOM sample.
___output___
<html><head></head><body><p>test</p></body></html>

*/

//Alert(object.elements[0].elements[1].elements[0].text);

(function (document){
	(function (obj){
		for (var p in obj){
			var prop = obj[p];
			switch (p){
				case 'elements' :
					for (var i = 0;i < prop.length;i++){
						document.writeln(prop[i].tagName);
						document.write('<br />');
						arguments.callee(prop[i]);
					}
					break;
				case 'attributes' :
					for (var k in prop){
						document.writeln(''+k+'='+prop[k]);
					}
					document.write('<br />');
					break;
				case 'text' :
					document.writeln(prop);
					break;
				default :
					break;
			}
		}
	})(object);
})(document);

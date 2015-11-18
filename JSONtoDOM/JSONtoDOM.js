//
//	JSON to DOM
//
//				created by mu-tan8(theta)
//				copyright(C) 2015 mu-tan8(theta)
//
//	elements = [{'tagName':'element1',},{'tagName':'element2','attributes':{/*	element2_attribute	*/},'elements':[{/*	element2_children	*/}],text:'text'},];	/*	ordinary elements. required a tagName.	*/
//	attributes = {'attribute1_name':'attribute1_value','attribute2_name':'attribute2_value',};	/*	has attributes only. don't nesting	*/
//	text = 'plain text strings';	/*	has text only. don't nesting	*/
//
//

/*

var object = {
	'elements':[{
		'tagName':'html',
		'attributes':{
			'lang':'ja'
		},
		'elements':[
		{
			'tagName':'head',
			'elements':[{
				'tagName':'title',
				'text':'sample'
			}]
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


object to DOM exsample.

	DOMNodes = object.toDOM() || object.toDOM(document);
	DOMStrings = object.toDOMString() || object.toDOMString(document);

___output___
<html lang="ja"><head><title>sample</title></head><body><p>test</p></body></html>

*/

/*	DOMObject object.toDOM(documentObject);	*/

Object.prototype.toDOM = function (oDocument){
	oDocument = oDocument || document;
	var oRoot = oDocument.createElement('tmp');
	(function (obj,oParentNode){
		for (var p in obj){
			var prop = obj[p];
			switch (p){
				case 'elements' :
					for (var i = 0;i < prop.length;i++){
						var oChildNode = oParentNode.appendChild(oDocument.createElement(prop[i].tagName));
						arguments.callee(prop[i],oChildNode);
						oChildNode = null;
					}
					break;
				case 'attributes' :
					for (var a in prop){
						oParentNode.setAttribute(a,prop[a]);
						a = null;
					}
					break;
				case 'text' :
					oParentNode.appendChild(oDocument.createTextNode(prop));
					break;
				default :
					break;
			}
			prop = p = null;
		}
	})(this,oRoot);
	return oRoot.childNodes;
};

/*	String object.toDOMString(documentObject);	*/

Object.prototype.toDOMString = function (oDocument){
	oDocument = oDocument || document;
	var oRoot = document.createElement('tmp');
	var fragment = this.toDOM(oDocument);
	for (var i = 0;i < fragment.length;i++){
		oRoot.appendChild(fragment[i]);
	}
	fragment = null;
	return oRoot.innerHTML;
}

/*	created by mu-tanθ 2015/10/22	*/
/*	参考URL：http://www.tohoho-web.com/wwwxx002.htm	*/


	var obj;
	catch_a_Element = function (ev){	//	マウスで要素を掴む(catch a ElementObject by mousedown)
		obj = ev.target.parentElement;
		if (obj != oDiv){
			obj = null;	//		移動させる要素でなければ空にする
			return true;	//		
		}
	}
	drag_a_Element = function (ev){	//	要素を移動させる（ドラッグ）(drag a ElementObject by mousemove)
		if (obj){
			obj.style.right = '' + (innerWidth - ev.clientX) + 'px';	//	右側の絶対座標　＝　ウィンドウの幅　－　ウィンドウ上でのマウスのＸ座標
			obj.style.bottom = '' + (innerHeight - ev.clientY) + 'px';	//	下側の絶対座標　＝　ウィンドウの高さ　－　ウィンドウ上でのマウスのＹ座標
		}
	}
	drop_a_Element = function (ev){	//	要素を放す（ドロップ）(drop a ElementObject by mouseup)
		obj = null;
		return true;
	}


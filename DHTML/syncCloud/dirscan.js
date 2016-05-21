//	http://qiita.com/DUxCA/items/5b725cb6359003c53171



var w = {};
BrowserFS.install(w);

var fs = w.require("fs");
var path = w.require("path");



function asynchronous(fn, ctx){
	return function _asyncFn(){
		var args = Array.prototype.slice.call(arguments);
			return new Promise(function(resolve, reject){
				fn.apply(ctx, args.concat(function(err, val){
					if(err){
						reject(err);
					}else{
						resolve(val);
					}
				}));
			});
	};
}

fs.readdirAsync = asynchronous(fs.readdir, fs);
fs.statAsync = asynchronous(fs.stat, fs);


function ls(pathname){
	return fs.readdirAsync(pathname)
	.then(function(names){
		return Promise.all(
			names.map(function(name){
				return fs.statAsync(path.join(pathname, name))
				.then(function(stat){
					return {name: name, stat: stat};
				});
			})
		)
	});
}

function getFileType(stat){
	return stat.isFile() ? "file"
		 : stat.isDirectory() ? "dir"
		 : stat.isBlockDevice() ? "blcdev"
		 : stat.isCharacterDevice() ? "chardev"
		 : stat.isFIFO() ? "fifo"
		 : stat.isSocket() ? "socket"
		 : "unkown";
}

function tree(pathname){
	return ls(pathname)
	.then(function(elms){
		return Promise.all(
			elms.map(function(elm){
				if(elm.stat.isDirectory()){
					return tree(path.join(pathname, elm.name))
					.then(function(dir){
						return {name: elm.name, attr: dir};
					});
				}
				return {
					name: elm.name ,
					attr: {
						'@type' : getFileType(elm.stat) ,
						'@size' : elm.stat.size ,
						'@time' : elm.stat.mtime
					}
				};
			})
		)
	})
	.then(function(elms){
		return elms.reduce(function(o, elm){
			o[elm.name] = elm.attr;
			return o;
		}, {});
	})
}

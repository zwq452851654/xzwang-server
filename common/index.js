var uuid = require('node-uuid');

module.exports = {
	bodyDealWith: function(field, params, callback){
		let name = [];
		let data = [];
		let questionMark = [];
		let s = "";
		for(let i=0; i<field.length; i++){
			if(!field[i].indexOf('*')){
				s = params[field[i].slice(1)] ? params[field[i].slice(1)] : "";
				if(!s) {
					callback && callback({code: 0, msg: field[i]+"字段为空"});
					break;
				}
				data.push(s);
				name.push(field[i].slice(1));
				questionMark.push('?');
			}else{
				s = params[field[i]] ? params[field[i]] : "";
				if(s){
					data.push(s);
					name.push(field[i]);
					questionMark.push('?');
				}
			}
		}
		name = name.join(',');
		questionMark = questionMark.join(',');
		callback && callback({
			code: 1, 
			msg: "操作成功",
			name: name,
			data: data,
			questionMark, questionMark
		});
	},
	createUUID: ()=>{
		return uuid.v4().replace(/-/g, '')
	}
}
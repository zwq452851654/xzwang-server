var uuid = require('node-uuid');

module.exports = {
	// 单条数据的处理方法
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
	},
	// 批量数据处理方法
	batchDealWith: function(field, list, callback){
		let values = [];
		let row = [];
		let k;
		for(let i=0; i<list.length; i++){
			row = [];
			for(let j=0; j<field.length; j++){
				k = field[j];
				if(!field[j].indexOf('*')){
					// 如果是必填项
					let s = list[i][k.slice(1)] ? list[i][k.slice(1)] : "";
					if(!s) {
						callback && callback({code: 0, msg: k+"字段为空"});
						break;
					}
					row.push(s)
				}else{
					row.push(list[i][k] ? list[i][k] : "")
				}
			}
			values.push(row)
		};
		let name = [];
		field.forEach( (item)=> {
			name.push(item.indexOf('*') ? item : item.slice(1))
		})
		callback && callback({code: 1, msg: '操作成功', name: name , data: values});
	}
}
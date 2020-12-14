const mysql = require('mysql');

let databaseConfig = {
	host: '39.107.227.98',
	user: 'root',
	password: 'Zhang.132639',
	database: 'xzwang',
	multipleStatements: true, //  允许执行多条语句
}


/**
 * 
 * @param {string} code - 请求状态 
 * @param {string} msg - 状态的文字提示
 * @param {object} data - 响应数据
 */
let jsonC = function(code, msg, data) {
	return {
		code,
		msg: msg ? msg : '操作成功',
		data
	}
}


//向外暴露方法
module.exports = {
	query: function(sql, params, callback) {
		let connection = mysql.createConnection(databaseConfig);
		connection.connect(function(err) {
			if (err) {
				console.log('数据库链接失败');
				throw err;
			}
			//传入三个参数，第一个参数sql语句，第二个参数sql语句中需要的数据，第三个参数回调函数
			connection.query(sql, params, function(err, results, fields) {
				if (err) {
					console.log('数据操作失败');
					callback && callback(jsonC(0, '数据操作失败', results), fields);
					// throw err;
				}
				
				//在查询回来的数据前面都会有RowDataPacket一个字样，再这里统一处理掉
				let dataString = JSON.stringify(results); 
				let data = JSON.parse(dataString);
				//将查询出来的数据返回给回调函数
				callback && callback(jsonC(1, '', data), fields);
				connection.end(function(err) {
					if (err) {
						console.log('关闭数据库连接失败！');
						throw err;
					}
				});
			});
		});
	}
};

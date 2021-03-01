var express = require('express');
var router = express.Router();
var db = require('../../mysql');

const cheerio = require("cheerio");
const superagent = require("superagent");
const nodeSchedule = require("node-schedule");
// 当爬取的网页格式为 gbk时，使用此模块进行格式转换
const charset = require("superagent-charset");
charset(superagent);

var { batchDealWith } = require('../../common');



let repeatNum = {
	'weibo_hot': 0,
	'baidu_hot': 0,
	'zhengquan_hot': 0,
	'jishu_hot': 0
};
// 如果删除表数据失败后执行
function queryData(table_name, data){
	let sql = `SELECT * FROM ${table_name}`;
	db.query(sql, [], function(result,fields){
		// 如果length大于0  说明数据并未全部被删除，重新执行下删除操作
		if(result.code && result.data.length == 0){
			insertData(table_name, data.name, data.data);
		}else{
			if(repeatNum[table_name] >= 3){
				console.log('停止查询...')
			}else{
				repeatNum[table_name]++;
				queryData(table_name);
			}
		}
	});
}


/* 微博热搜 */
function getHotSearchList() {
	const weiboURL = "https://s.weibo.com";
	const hotSearchURL = weiboURL + "/top/summary?cate=realtimehot";
  	return new Promise((resolve, reject) => {
	    superagent.get(hotSearchURL, (err, res) => {
	        if (err) reject("request error");
	        const $ = cheerio.load(res.text);
	        let hotList = [];
	        $("#pl_top_realtimehot table tbody tr").each(function (index) {
		        if (index !== 0) {
		            const $td = $(this).children().eq(1);
		            const link = weiboURL + $td.find("a").attr("href");
		            const text = $td.find("a").text();
		            const hotValue = $td.find("span").text();
		            hotList.push({
		                rank: index,
		                link,
		                title: text,
		                hotValue,
		                target: 'weibo',
		                targetMc: '微博'
		            });
		        }
	        });
	        hotList.length ? resolve(hotList) : reject("errer");
			update_news('weibo', hotList)
		});
  	});
}

// getHotSearchList();

function insertNews(name, data){
	sql = `INSERT INTO hot_news(${name}) VALUES ? `
	db.query(sql, [data], function(result,fields){
		result.data = [];
	});
}


// 更新表数据
function update_news(target, hotList){
	let field = ['*title', '*hotValue', 'rank', '*link', '*target', '*targetMc'];
	batchDealWith(field, hotList, function(data){
		if(data.code){
			let sql = `DELETE FROM hot_news where target='${target}'`;
			db.query(sql, [], function(result,fields){
				if(result.code){
					insertNews(data.name, data.data);
				}else{
					queryData(table_name, data);
				}
			});
		}else{
			console.log('数据处理失败...')
		}
	})
}


/* 百度热榜 */
function get_baidu_hot_List() {
	const bdHeatUrl = "http://top.baidu.com/buzz?b=1&fr=topindex";
  return new Promise((resolve, reject) => {
    superagent.get(bdHeatUrl).charset('gbk').end((err, res) => {
    	if (err) reject("request error");
    	const $ = cheerio.load(res.text);
    	let hotList = []
    	$('.list-table tbody tr').each( function(index){
    		if(index !== 0){
				if(!$(this).hasClass('item-tr')){
					const rank = $(this).children().eq(0).find('span').text();
					const title = $(this).children().eq(1).find('a').text();
					const link = $(this).children().eq(2).find('a').attr('href');
					const hotValue = $(this).children().eq(3).find('span').text();
					hotList.push({
						rank,
						title,
						link,
						hotValue,
						target: 'baidu',
						targetMc: '百度'
					});
				}
    		}
    	});
			hotList.length ? resolve(hotList) : reject("errer");
			update_news('baidu', hotList)
    })
  });
}




/* 51cto 技术资讯 */
function get_jishu_hot_List() {
	const bdHeatUrl = "https://news.51cto.com/";
  return new Promise((resolve, reject) => {
    superagent.get(bdHeatUrl).charset('gbk').end((err, res) => {
    	if (err) reject("request error");
    	const $ = cheerio.load(res.text);
    	let hotList = []
			
    	$('.home-left-list ul li .rinfo').each( function(index){
    		if(index !== 0){
				const rank = 100;
				const title = $(this).children().eq(0).text();
				const link = $(this).children().eq(0).attr('href');
				const hotValue = "100";
				hotList.push({
					rank,
					title,
					link,
					hotValue,
					target: '51cto',
					targetMc: '51CTO'
				});
    		}
    	});
			hotList.length ? resolve(hotList) : reject("errer");
			update_news('51cto', hotList)
    })
  });
}


// 定时触发
const rule = new nodeSchedule.RecurrenceRule();  
rule.minute = [1,6,11,16,21,26,31,36,41,46,51,56];
// rule = "30 * * * * *"
nodeSchedule.scheduleJob(rule, function () {
  try {
	// 微博
    getHotSearchList();
		
	// 百度
	get_baidu_hot_List();
	
	// 技术资讯
	get_jishu_hot_List();
		
  } catch (error) {
    console.error(error);
  }
});


// -------------------  以上为资讯的自动更新操作 -------------------------


// -------------------  以下为资讯查询 -------------------------


/*
 *	 获取资讯列表
 *
 *  */
router.get('/queryNews', (req, res, next) => {
	let sql = `SELECT * FROM hot_news`;
	db.query(sql, [], function(result,fields){
		if(result.code){
			let data = {
				weibo: [],
				baidu: [],
				cto_51: []
			}
			result.data.forEach(element => {
				if(element.target == 'weibo'){
					data.weibo.push(element)
				}
				if(element.target == 'baidu'){
					data.baidu.push(element)
				}
				if(element.target == '51cto'){
					data.cto_51.push(element)
				}
			});
			res.send({
				code: 1,
				data: data
			});
		}else{
			res.send(result);
		}
	})
});


function queryNews(){
	let sql = `SELECT * FROM hot_news`;
	db.query(sql, [], function(result,fields){
		if(result.code){
			let data = {
				weibo: [],
				baidu: [],
				cto_51: []
			}
			result.data.forEach(element => {
				if(element.target == 'weibo'){
					data.weibo.push(element)
				}
				if(element.target == 'baidu'){
					data.baidu.push(element)
				}
				if(element.target == '51CTO'){
					data.cto_51.push(element)
				}
			});
		}
	})
}
// queryNews()




module.exports = router;

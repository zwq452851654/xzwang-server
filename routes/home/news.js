var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../../mysql');

const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const nodeSchedule = require("node-schedule");
// 当爬取的网页格式为 gbk时，使用此模块进行格式转换
const charset = require("superagent-charset");
charset(superagent);

var { batchDealWith } = require('../../common');


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
            hotValue
          });
        }
      });
      hotList.length ? resolve(hotList) : reject("errer");
			updateHandle('weibo_hot', hotList);
    });
  });
}


// 执行插入函数
function insertData(table_name, name, data){
	sql = `INSERT INTO ${table_name}(${name}) VALUES ? `
	db.query(sql, [data], function(result,fields){
		result.data = [];
	});
}


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


// 更新表数据
function updateHandle(table_name, hotList){
	let field = ['*title', '*hotValue', 'rank', '*link'];
	batchDealWith(field, hotList, function(data){
		if(data.code){
			let sql = `DELETE FROM ${table_name}`;
			db.query(sql, [], function(result,fields){
				if(result.code){
					insertData(table_name, data.name, data.data);
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
							hotValue
						});
					}
    		}
    	});
			hotList.length ? resolve(hotList) : reject("errer");
			updateHandle('baidu_hot', hotList);
    })
  });
}


/* 腾讯新闻 */
function get_zhengquan_hot_List() {
	const bdHeatUrl = "https://new.qq.com/ch/finance_stock/";
  return new Promise((resolve, reject) => {
    superagent.get(bdHeatUrl).charset('gbk').end((err, res) => {
    	if (err) reject("request error");
    	const $ = cheerio.load(res.text);
    	let hotList = []
			
    	$('.list .item .detail').each( function(index){
    		if(index !== 0){
					const rank = 100;
					const title = $(this).children().eq(0).children().text();
					const link = $(this).children().eq(0).children().attr('href');
					const hotValue = "100";
					hotList.push({
						rank,
						title,
						link,
						hotValue
					});
    		}
    	});
			hotList.length ? resolve(hotList) : reject("errer");
			updateHandle('zhengquan_hot', hotList);
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
						hotValue
					});
    		}
    	});
			hotList.length ? resolve(hotList) : reject("errer");
			updateHandle('jishu_hot', hotList);
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
		
		// 腾讯
		get_zhengquan_hot_List();
		
		// 技术资讯
		get_jishu_hot_List();
		
  } catch (error) {
    console.error(error);
  }
});


// -------------------  以上为资讯的自动更新操作 -------------------------


// -------------------  以下为资讯查询 -------------------------
/*
	* 获取资讯列表
	* 参数 q = '表名称'
 * */
router.get('/news', (req, res, next) => {
	console.log(req.cookies)
	let table_name = req.query.q;
	let sql = `SELECT * FROM ${table_name}`;
	db.query(sql, [], function(result,fields){
		if(result.code){
			res.json(result);
		}else{
			res.json(result);
		}
	})
});





module.exports = router;

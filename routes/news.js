var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../mysql');
var jwt = require('jsonwebtoken');

const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const nodeSchedule = require("node-schedule");
// 当爬取的网页格式为 gbk时，使用此模块进行格式转换
const charset = require("superagent-charset");
charset(superagent);

var { bodyDealWith, batchDealWith } = require('../common');


router.get('/news', (req, res, next) => {
	let field = ['*title', 'hotValue', 'rank', '*link'];
	let name = [];
	field.forEach( item =>{
		name.push(item.indexOf('*') ? item : item.slice(1))
	})
	res.send('hello')
});




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
    });
  });
}


function updateHandle(table_name, hotList){
	let field = ['*title', '*hotValue', 'rank', '*link'];
	batchDealWith(field, hotList, function(data){
		if(data.code){
			let sql = `DELETE FROM ${table_name}`;
			db.query(sql, "", function(result,fields){
				if(result.code == 1){
					sql = `INSERT INTO ${table_name}(${data.name}) values ?`
					db.query(sql, [data.data], function(result,fields){
						result.data = [];
					});
				}
			});
		}else{
			
		}
	})
}



/* 百度热榜 */
// http://top.baidu.com/?fr=mhd_card
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
    })
  });
}


// 定时触发
nodeSchedule.scheduleJob("10 * * * * *", async function () {
  try {
		// 微博
    const hotList = await getHotSearchList();
		updateHandle('weibo_hot', hotList);
		
		// 百度
		const baidu = await get_baidu_hot_List();
		updateHandle('baidu_hot', baidu);
		
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

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

var { bodyDealWith } = require('../common');


router.get('/news', (req, res, next) => {
	// var params = url.parse(req.url, true).query;
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
            titlt: text,
            hotValue
          });
        }
      });
      hotList.length ? resolve(hotList) : reject("errer");
    });
  });
}


// 将格式化好的json数据写入json文件
const writeJson = (content, file)=>{
	
}


nodeSchedule.scheduleJob("10 * * * * *", async function () {
  try {
    const hotList = await getHotSearchList();
		let field = ['title', 'hotValue', 'rank', 'link'];
		let params = {
			title: '我是最热的新闻',
			hotValue: 999,
			rank: 1,
			link: 'www.baidu.com'
		}
		bodyDealWith(field, params, function(data){
			console.log('====')
			
			if(data.code){
				console.log(data)
				// sql = `INSERT INTO weibo-hot(${data.name}) VALUES(${data.questionMark})`;
				// db.query(sql, data.data, function(result,fields){
				// 	result.data = [];
				// 	res.json(result);
				// });
			}else{
				res.json({
					code: data.code,
					msg: data.msg
				});
			}
		});
    // await fs.writeFileSync(
    //   `${__dirname}/weiboHeat.json`,
    //   JSON.stringify(hotList),
    //   "utf-8"
    // );
  } catch (error) {
    console.error(error);
  }
});

/* 百度热榜 */
// http://top.baidu.com/?fr=mhd_card
// const bdHeatUrl = "http://top.baidu.com/?fr=mhd_card";
//  superagent.get(bdHeatUrl).charset('gbk').end((err, res) => {
// 	 	if (err) reject("request error");
	 	
// 	 	const $ = cheerio.load(res.text);
// 	 	let hotList = []
// 	 	$('#hot-list li').each( function(index){
	 		
// 	 		if(index !== 0){
// 	 			const $a = $(this).children().eq(1);
// 	 			const text = $a.text();
// 				const link = $a.attr("href");
// 				const hotValue = $(this).$('.icon-rise').text()
// 	 			hotList.push({
// 	 			  index,
// 	 			  text,
// 					link,
// 					hotValue
// 	 			});
// 	 		}
// 	 	})
// 	 	fs.writeFileSync(
// 	 	  `${__dirname}/baiduHeat.json`,
// 	 	  JSON.stringify(hotList),
// 	 	  "utf-8"
// 	 	);
//  })





module.exports = router;

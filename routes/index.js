var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../mysql');
var { verifyTokenMiddle } = require("../common/token.js")

router.get('/index', (req, res, next) => {
	// var params = url.parse(req.url, true).query;
	// verifyTokenMiddle(req, res, next)
	// console.log(req.headers.token)
	// next()
	res.end()
});

module.exports = router;

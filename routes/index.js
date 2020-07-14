var express = require('express');
var router = express.Router();
const url = require("url");
var db = require('../mysql');
var jwt = require('jsonwebtoken');

router.get('/index', (req, res, next) => {
	// var params = url.parse(req.url, true).query;
	res.send('hello')
});

module.exports = router;

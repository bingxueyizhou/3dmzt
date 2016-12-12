/**
 * Created by 邹兵 on 2016/2/10.
 */
var express = require('express');
var curl   = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('3dmzt/main', { title: "3DM杂谈" });
});

module.exports = router;
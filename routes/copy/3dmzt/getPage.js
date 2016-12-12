/**
 * Created by 邹兵 on 2016/2/10.
 */
var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();

var mainURL = "http://www.3dmgame.com/zt/";

router.get('/', function(req, res, next) {
    var _GET = req.query;
    var aid  = _GET.aid;
    var page = _GET.page;
    var date = _GET.date;
    if (aid == null || date==null){
        res.render('str',{str: ""});
    }
    //console.log(Reg.splitUrl(mainURL+date+"/"+aid+".html"));
    var thisSql = (page==null?  "SELECT content FROM zt3dm_pages where aid='"+aid+"' and page=1":
                                "SELECT content FROM zt3dm_pages where aid='"+aid+"' and page="+page+"");
    var db = new sqlite3.Database('./sqlitedb/zt3dm.sqlite');
    db.all(
        thisSql,
        function(err,rows){
            if(err || rows == null){
                console.error(err);
                res.render('str', { str:"" });
            }else{
                res.render('str', { str:rows[0].content });
            }
        });
    db.close();
});

router.get('/info',function(req, res, next) {
    var _GET = req.query;
    var aid  = _GET.aid;
    var date = _GET.date;
    if (aid==null || date==null){
        res.render('str',{str: ""});
    }
    var db = new sqlite3.Database('./sqlitedb/zt3dm.sqlite');
    db.all(
        "SELECT * FROM zt3dm where aid='"+aid+"' and date='"+date+"'",
        function(err,rows){
            if(err || rows == null){
                console.error(err);
                res.render('json', { data:{sum:0,abstract:""} });
            }else{
                res.render('json', { data:{sum:rows[0].max,abstract:rows[0].title} });
            }
    });
    db.close();
});

module.exports = router;
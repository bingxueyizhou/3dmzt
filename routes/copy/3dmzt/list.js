/**
 * Created by 邹兵 on 2016/2/10.
 */
var express = require('express');
var sqlite3 = require('sqlite3');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var db = new sqlite3.Database('./sqlitedb/home.sqlite');
    db.all("SELECT * FROM home ORDER BY id DESC LIMIT 16",function(err,rows){
        if(err){
            console.error(err);
            res.render('json', { data: {code: 0,msg:err} });
        }else{
            var list =[];
            for(var i=0;i<rows.length;i++){
                var item = {url:"",name:""};
                item.url = rows[i].url;
                item.name = rows[i].name;
                list[i] = item;
            }
            res.render('json', { data: {code: 0,msg:"列表返回成功",data:list} });
        }
    });
    db.close();
});

//http://www.3dmgame.com/plus/feedback.php?action=jsget&aid=3545861&pageno=2
module.exports = router;
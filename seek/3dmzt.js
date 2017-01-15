/**
 * Created by 邹兵 on 2016/2/28.
 * 
 * Modify@2016/7/26 关于抓取目录的修改
 */
var sqlite3 = require('sqlite3');
var curl    = require('request');
var CONF    = require('../class/conf.js');

var dbdir = CONF.DB;
var dbi;
var db3;
var zturl  = 'http://www.3dmgame.com/zt/';//'http://www.3dmgame.com/zt/'
/*
knex sql语句工具
});*/

/**
 * 初始化数据库
 * @returns 是否创建成功{0 成功，其他 失败}
 */
var initDB = function(){
    //创建databases目录
    var fs = require("fs");
    if (!fs.existsSync( dbdir )) {
        fs.mkdirSync( dbdir , function (err) {
            if (err) {
                console.log("创建文件夹错误:"+err);
                return 1;
            }
        });
    }
    //初始化数据库
    dbi = new sqlite3.Database( dbdir+'/home.sqlite');
    dbi.run("CREATE TABLE IF NOT EXISTS home(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "date DATETIME," +
            "type VARCHAR(255)," +
            "name VARCHAR(255) UNIQUE," +
            "url TEXT)");
    db3 = new sqlite3.Database(dbdir+'/zt3dm.sqlite');
    db3.run("CREATE TABLE IF NOT EXISTS zt3dm(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "aid INTEGER UNIQUE," +
            "date VARCHAR(16)," +
            "title TEXT," +
            "max INTEGER)");
    db3.run("CREATE TABLE IF NOT EXISTS zt3dm_pages(" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "aid INTEGER, " +
            "page INTEGER," +
            "content TEXT)");
    return 0;
}

var RegMain = {
    RagularList : function(str){
        var regx = new RegExp("<div class=\"QZlisttxt\">[\\w\\W]+?</div>");
        //<div class=\"QZlisttxt\">[\n\r\s]+</div>[\w\s]\</div\>
        //<div class=\"QZlisttxt\">[\r\n 0-9a-zA-Z\u4e00-\u9fa5[\]_<>=\":/.]+
        var rs   = regx.exec(str);
        if (rs == null){
            console.log(seek.name + ' 解析列表失败！');
        }else{
            console.log(seek.name + ' 解析列表成功！');
        }
        return rs==null?null:rs[0];
    },
    RagularItems : function(str){
        var items = new Array();
        var regx = new RegExp("] <a href=[\\w\\W]+?</a>","g");
        var i=0;
        while (true){
            var item  = {name:"",url:"",aid:"",date:""};
            var rs = regx.exec(str);
            if (rs == null) break;
            delete rs.input;
            var tUrl  = rs[0].match("http://www\\.3dmgame\\.com/zt/\\d+/\\d+\\.html")[0].slice(26,-5);
            var aUrl  = tUrl.split("/");
            item.date = aUrl[0];
            item.aid  = aUrl[1];
            item.url  = "/page?date="+aUrl[0]+"&aid="+aUrl[1];
            //item.url  = rs[0].match("http://www\\.3dmgame\\.com/zt/\\d+/\\d+\\.html")[0];
            item.name = "["+aUrl[0]+"]"+rs[0].match("_blank\">[\\w\\W]+?</a>")[0].slice(8,-4);
            items.push(item);
        }
        return items;
    },
    seekIndex : function (callback) {
        curl.get(
            zturl,
            function(e,r,body){
                var strListHtml = RegMain.RagularList(body);
                if (strListHtml == null){
                    callback({code:0, msg:"抓取列表错误"});
                } else {
                    var Items = RegMain.RagularItems(strListHtml);
                    if (Items.length > 0 ){
                        callback({code:1,msg:"返回列表成功",data:Items});
                    }else{
                        callback({code:0,msg:"列表整理错误"});
                    }
                }
            })
    },
    doSeekIndexI : 0,
    doSeekIndex : function(rtback){
        //失败重试算法
        RegMain.doSeekIndexI ++;
        if (RegMain.doSeekIndexI > 10) {rtback(1);return;};

        //正常执行
        RegMain.seekIndex(function(ret){
            if (ret.code === 1){
                var d = ret.data;
                RegMain.dealSqlSingleItem(d,0,(d.length>8? 8: d.length ),function(){
                    rtback(0);
                });
            }else{
                console.log(seek.name+" 重试第"+doSeekIndexI+"次");
                RegMain.doSeekIndex(rtback);
            }
        })
    },
    dealSqlSingleItem:function(d,i,max,rtback){
        if (i>=max) {rtback();return};
        dbi.all("SELECT COUNT(*) AS C FROM HOME WHERE name='"+d[i].name+"'",
            function(err,ds){
                //console.log(ds[0].C);
                var TmpFun = function(){RegMain.dealSqlSingleItem(d,i+1,max,rtback)};
                if (ds[0].C === 0){
                    dbi.run("INSERT INTO home(date,type,name,url) VALUES(datetime(),'3DM杂谈','"+
                        d[i].name+"','"+d[i].url+"') ");
                    TmpFun = function(){
                        RegPage.seekPage(d[i].date,d[i].aid,function(){
                            RegMain.dealSqlSingleItem(d,i+1,max,rtback);
                        });
                    };
                }
                TmpFun();
            });
    }
}

var RegPage = {
    /**
     * get Main page content of this article
     * @param url 主网址
     * @returns {{sum: number页总数, abstract: string描述}}
     */
    getMain:function(url,callback){
        curl.get(
            url,
            function(e,r,body){
                var regNo1 = new RegExp("<div class=\"miaoshu\">[\\w\\W]+?</div>");
                var regNo2 = new RegExp("[0-9]+条记录");
                var resR1  = regNo1.exec(body);
                var resR2  = regNo2.exec(body);
                if (resR1 != null && resR2 != null){
                    var strAbs = resR1[0].slice(21,-6);
                    var strSum = resR2[0].slice(0,-3);
                    callback(strSum,strAbs);
                }else{
                    callback(1,null);
                }
            });
    },
    /**
     * get other page content of this article
     * @param url 主网址
     * @returns {string 需要的Html内容}
     */
    getPage:function(url,callback){
        curl.get(
            url,
            function(e,r,body){
                //var regNo1 = new RegExp("<div class=\"miaoshu\">[\\w\\W]+?</div>");
                //var regNo2 = new RegExp("[0-9]+条记录");
                //var strAbs = regNo1.exec(body)[0].slice(21,-6);
                //var strSum = regNo2.exec(body)[0].slice(0,-3);
                callback(RegPage.regPage(body));
            });
    },
    /**
     * regex the html doctype
     * @param str 未正则的字符串
     * @returns {string 正则后的字符串}
     */
    regPage:function(str){
        var regNo1 = new RegExp("<div class=\"miaoshu\">[\\w\\W]+?</div>[\\s]*?<div>[\\w\\W]+?</div>");
        var regNo2 = new RegExp("<div>[\\w\\W]+?<span style=\"display:none\">");
        var strTmp = regNo1.exec(str);
        if (strTmp == null) return null;
        //console.log(strTmp);
        return regNo2.exec(strTmp[0])[0].slice(5,-27);
    },
    /**
     * split the url
     * @param url 主网页
     * @returns {{main: string 域名+请求部分, date: string 日期部分, idNum: string 文章ID部分}}
     */
    splitUrl:function(url){
        var aUrl  = url.slice(26,-5).split("/");
        return {main:"http://www.3dmgame.com/zt/",date:aUrl[0],idNum:aUrl[1]};
    },
    seekPage:function(date,aid,rtback){
        console.log(seek.name +" 抓取文章 "+aid+" 信息中");
        RegPage.getMain(
            zturl+date+"/"+aid+".html",
            function(sum,abs){
                if (sum <=0 ) return;
                db3.run("INSERT INTO zt3dm(aid,date,title,max) VALUES('"+
                                aid+"','"+date+"','"+abs+"','"+sum+"')");
                RegPage.seekPageOne(date,aid,1,sum,function(){
                    rtback();
                });
        });
    },
    seekPageOne:function(date,aid,page,maxPage,rtback){
        console.log(seek.name+" 抓取文章 "+aid+" 第 "+page+" 页中");
        if (page > maxPage ) {rtback(); return;}
        var thisUrl =(  (page <= 1)?
                        zturl+date+"/"+aid+".html" :
                        zturl+date+"/"+aid+"_"+page+".html");
        RegPage.getPage(thisUrl,function(content){
            if (content == null) return;
            content = content.replace(/'/g,"''");
            var sql = "INSERT INTO zt3dm_pages(aid,page,content) VALUES('"+aid+"','"+(page>1?page:1)+"','"+content+"')";
            //console.log(sql);
            db3.run(sql);
            RegPage.seekPageOne(date,aid,page+1,maxPage,rtback);
        });
    }
};

var seek = {
    start : function(callback){
        console.log(seek.name +" 开始正则");
        if (initDB())    callback(1,seek.name.ver);
        else RegMain.doSeekIndex(function(ret){
                                    callback(ret,seek.name);
                                }  );
    },
    info : function(){
        return {name:"3dm杂谈",ver:"v2.0",date:"2017/1/15"};
    },
    name : "3dm杂谈@v2.0"
}

module.exports = seek;

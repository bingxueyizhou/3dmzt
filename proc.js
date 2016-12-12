/**
 * Created by 邹兵 on 2016/2/28.
 */
var schedule = require("node-schedule");


console.log("Hello");
var rule = new schedule.RecurrenceRule();
/**每秒执行
var times = [];
for(var i=0; i<60; i++){
    times.push(i);
}
rule.second = times;
 //*/
/**每天执行
rule.dayOfWeek = [0,1,2,3,4,5,6];
rule.hour   = 3;
rule.minute = 0;
//*/

var seekList = [];
seekList.push(require("./seek/3dmzt"));
console.log("又开始为主人搬运网页了(T_T):"+new Date());
for(var i=0;i<seekList.length;i++){
    var Time = new Date();
    seekList[i].start(function(c,name){
        if (c) console.log("【"+ name + "】 解析失败");
        console.log(""+ name + " 解析花费 "+(new Date().getTime()-Time.getTime())+" ms");
    });
}
/*
var result = schedule.scheduleJob(rule,function(){
    console.log("又开始为主人搬运网页了(T_T):"+new Date());
    for(var i=0;i<seekList.length;i++){
        var Time = new Date();
        seekList[i].start(function(c,name){
            if (c) console.log("【"+ name + "】 解析失败");
            console.log(""+ name + " 解析花费 "+(new Date().getTime()-Time.getTime())+" ms");
        });
    }
});*/
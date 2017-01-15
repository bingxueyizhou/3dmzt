/**
 * Created by 邹兵 on 2016/2/28.
 */

console.log("Hello");

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
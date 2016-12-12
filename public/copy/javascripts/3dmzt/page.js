/**
 * Created by 邹兵 on 2016/2/10.
 */

var nowPage = 0;
var sumPage = 0;
function leftPage(){
    if (nowPage <= 1) return;
    nowPage --;
    console.log(nowPage);
    loadPage(nowPage);
}

function rightPage(){
    if (nowPage >= sumPage) return;
    nowPage ++;
    console.log(nowPage);
    loadPage(nowPage);
}

function refreshPage(){
    loadPage(nowPage);
}

var appContent = function(str){
    $("#main").html(str);
}

var enableButtons = function () {
    $("#bu-last").attr("disabled",false);
    $("#bu-next").attr("disabled",false);
    $("#bu-refresh").attr("disabled",false);
}

var disableButtons = function(){
    $("#bu-last").attr("disabled","disabled");
    $("#bu-next").attr("disabled","disabled");
    $("#bu-refresh").attr("disabled","disabled");
}

var showProcess = function(msg){
    $("#process").text(msg);
}

var loadPage = function(page){
    var params = "";
    var Url    = window.location.href.split("?");
    if (Url.length >= 2){
        params = "?"+Url[1];
        if (page > 1){
            params = params + "&page=" + page;
        }
    }
    disableButtons();
    showProcess(" 加载第["+page+"]页..");
    appContent("");
    $('#page-no').text("第 "+ nowPage +"/"+ sumPage +" 页");
    $.ajax({
        url:"/getPage"+params,
        type:"get",
        success:function(d2,status2){
            //console.log(d);
            enableButtons();
            appContent(d2);
            showProcess("");
        },
        error: function (error) {
            enableButtons();
            showProcess("加载失败");
            console.error(error.toString());
        }
    });
}

var params = "";
var Url    = window.location.href.split("?");
if (Url.length >= 2){
    params = "?"+Url[1];
}
showProcess(" 加载 标题 中...");
$.ajax({
    url:"/getPage/info"+params,
    type:"get",
    dataType:'json',
    success:function(d,status){
        //console.log(d);
        //appContent(d);
        sumPage = d.sum;
        nowPage = 1;
        $('#page-no').text("第 1/"+ d.sum +" 页");
        showProcess("获取页数...");
        $('#header').text(d.abstract);
        loadPage(1);
    },
    error: function (error) {
        console.error(error.toString());
    }
})
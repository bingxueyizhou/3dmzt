/**
 * Created by 邹兵 on 2016/2/10.
 */
var appList = function(data){
    var str = "";
    for(var i=0;i<16 && i<data.length;i++){
        str += "<p><a href='"+data[i].url+"' target='_blank'>"+data[i].name+"</a></p>\n";
    }
    $("#main").html(str);
    $("#head").html("加载完成");
    $("#head").html("");
}
console.log("加载中...");
$("#head").html("加载中...");
$.ajax({
    url:"/list",
    type:"get",
    dataType:"json",
    success:function(d,status){
        //alert(d.data);
        //console.log(JSON.stringify(d.data));
        appList(d.data);
    },
    error: function (error) {
      console.error(error.toString());
    }
})
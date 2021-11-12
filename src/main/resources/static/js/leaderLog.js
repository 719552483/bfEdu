var EJDMElementInfo;
var choosendTeacherLog=new Array();
$(function() {
    judgementPWDisModifyFromImplements();
    $('.isSowIndex').selectMania(); //初始化下拉框
    EJDMElementInfo=queryEJDMElementInfo();
    stuffEJDElement(EJDMElementInfo);
    drawCalenr("#startTime");
    drawCalenr("#endTime");
    drawLogEmptyTable();
    drawEditor();
    btnBind();
    deafultSearch();
});

//初始化检索
function deafultSearch(){
    var returnObject=new Object();
    returnObject.logType="";
    returnObject.startDate="";
    returnObject.endDate="";
    returnObject.Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchTeacherLog",
        data: {
            "searchCriteria":JSON.stringify(returnObject)
        },
        dataType : 'json',
        beforeSend: function(xhr) {
            requestErrorbeforeSend();
        },
        error: function(textStatus) {
            requestError();
        },
        complete: function(xhr, status) {
            requestComplete();
        },
        success : function(backjson) {
            hideloding();
            if (backjson.code===200) {
                stuffLogTable(backjson.data);
                toastr.info(backjson.msg);
            } else {
                drawLogEmptyTable();
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充空的学生表
function drawLogEmptyTable() {
    stuffLogTable({});
}

//渲染学生表
function stuffLogTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #logDetails': function(e, value, row, index) {
            logDetails(row);
        },
        'click #removeLog': function(e, value, row, index) {
            removeLog(row,index);
        },
        'click #modifyLog': function(e, value, row, index) {
            modifyLog(row,index);
        }
    };

    $('#techerLogTable').bootstrapTable('destroy').bootstrapTable({
        data: tableInfo,
        pagination: true,
        pageNumber: 1,
        pageSize : 10,
        pageList : [ 10 ],
        showToggle: false,
        showFooter: false,
        clickToSelect: true,
        search: true,
        editable: false,
        exportDataType: "all",
        showExport: true,      //是否显示导出
        exportOptions:{
            fileName: '授课班级学生信息导出'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onCheck : function(row) {
            onCheck(row);
        },
        onUncheck : function(row) {
            onUncheck(row);
        },
        onCheckAll : function(rows) {
            onCheckAll(rows);
        },
        onUncheckAll : function(rows,rows2) {
            onUncheckAll(rows2);
        },
        onPageChange: function() {
            drawPagination(".techerLogTableArea", "日志信息");
            for (var i = 0; i < choosendTeacherLog.length; i++) {
                $("#techerLogTable").bootstrapTable("checkBy", {field:"edu114_ID", values:[choosendTeacherLog[i].edu114_ID]})
            }
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {
                field: 'check',
                checkbox: true
            },{
                field: 'edu114_ID',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            },{
                title: '序号',
                align: 'center',
                class:'tableNumberTd',
                formatter: tableNumberMatter
            },
            {
                field: 'logTitle',
                title: '日志标题',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'typeName',
                title: '日志类型',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'creatDate',
                title: '发布时间',
                align: 'left',
                sortable: true,
                formatter: creatDateMatter
            },  {
                field: 'action',
                title: '操作',
                align: 'center',
                sortable: true,
                clickToSelect: false,
                formatter: releaseNewsFormatter,
                events: releaseNewsEvents,
            }
        ]
    });

    function releaseNewsFormatter(value, row, index) {
        return [
            '<ul class="toolbar tabletoolbar">' +
            '<li id="logDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>查看</li>' +
            '<li id="modifyLog" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
            '<li id="removeLog" class="deleteBtn"><span><img src="images/t03.png" style="width:24px"></span>删除</li>' +
            '</ul>'
        ]
            .join('');
    }

    function creatDateMatter(value, row, index) {
        var date=stampToDatetimeString(value,true);
        return [
            '<div class="myTooltip" title="'+date+'">'+date+'</div>'
        ]
            .join('');
    }

    drawPagination(".techerLogTableArea", "日志信息");
    drawSearchInput(".techerLogTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".techerLogTableArea", "日志信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//单选学生
function onCheck(row){
    if(choosendTeacherLog.length<=0){
        choosendTeacherLog.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendTeacherLog.length; i++) {
            if(choosendTeacherLog[i].edu114_ID===row.edu114_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosendTeacherLog.push(row);
        }
    }
}

//单反选学生
function onUncheck(row){
    if(choosendTeacherLog.length<=1){
        choosendTeacherLog.length=0;
    }else{
        for (var i = 0; i < choosendTeacherLog.length; i++) {
            if(choosendTeacherLog[i].edu114_ID===row.edu114_ID){
                choosendTeacherLog.splice(i,1);
            }
        }
    }
}

//全选学生
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosendTeacherLog.push(row[i]);
    }
}

//全反选学生
function onUncheckAll(row){
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu114_ID);
    }


    for (var i = 0; i < choosendTeacherLog.length; i++) {
        if(a.indexOf(choosendTeacherLog[i].edu114_ID)!==-1){
            choosendTeacherLog.splice(i,1);
            i--;
        }
    }
}

var editor1;
//渲染编辑器
function drawEditor(){
    /**页面初始化 创建文本编辑器工具**/
    KindEditor.ready(function(K) {
        //定义生成编辑器的文本类型
        editor1 = K.create('textarea[name="content"]', {
            cssPath : 'editor/plugins/code/prettify.css',
            allowImageUpload: true, //上传图片框本地上传的功能，false为隐藏，默认为true--
            allowImageRemote : false, //上传图片框网络图片的功能，false为隐藏，默认为true
            formatUploadUrl:false,
            uploadJson : '/newsImgUpload',//文件上传请求后台路径
            afterUpload: function(url){this.sync();}, //图片上传后，将上传内容同步到textarea中
            afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中
            allowFileManager : true,
            items: ['source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
                'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                'superscript', '|', 'selectall', '-',
                'title', 'fontname', 'fontsize','forecolor','hilitecolor', '|', 'textcolor', 'bgcolor', 'bold',
                'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
                'advtable', 'hr', 'emoticons', 'link', 'unlink', '|'
            ]
        });
    });
}

//查看日志详情
function logDetails(row){
    $("#newTitle").val(row.logTitle);
    KindEditor.html("#logBody", row.logDetail);
    stuffManiaSelectWithDeafult("#newLogType", row.logType);
    editor1.readonly(true);
    $('.logArea').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
    $(".submitLog").hide();
    areaControl();
}

//预备修改日志
function modifyLog(row,index){
    $("#newTitle").val(row.logTitle);
    KindEditor.html("#logBody", row.logDetail);
    stuffManiaSelectWithDeafult("#newLogType", row.logType);
    editor1.readonly(false);
    $('.logArea').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
    $(".submitLog").attr("value","确认修改");
    areaControl();
    $(".submitLog").show();
    $('.submitLog').unbind('click');
    $('.submitLog').bind('click', function(e) {
        submitLog(true,row);
        e.stopPropagation();
    });
}

//单个删除日志
function removeLog(row,index){
    $.showModal("#remindModal",true);
    $(".remindType").html('- '+row.logTitle+' ');
    $(".remindActionType").html("删除");

    //确认删除学生
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.edu114_ID);
        sendReomveInfo(removeArray);
        e.stopPropagation();
    });
}

//批量删除日志
function removeLogs(){
    var choosend=choosendTeacherLog;
    if (choosend.length === 0) {
        toastr.warning('暂未选择任何数据');
    } else {
        $.showModal("#remindModal",true);
        $(".remindType").html("所选日志");
        $(".remindActionType").html("删除");

        //确认删除学生
        $('.confirmRemind').unbind('click');
        $('.confirmRemind').bind('click', function(e) {
            var removeArray = new Array;
            for (var i = 0; i < choosend.length; i++) {
                removeArray.push(choosend[i].edu114_ID);
            }
            sendReomveInfo(removeArray);
            e.stopPropagation();
        });
    }
}

//发送删除信息
function sendReomveInfo(removeArray){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/removeTeacherLog",
        data: {
            "deleteIdArray":JSON.stringify(removeArray)
        },
        dataType : 'json',
        beforeSend: function(xhr) {
            requestErrorbeforeSend();
        },
        error: function(textStatus) {
            requestError();
        },
        complete: function(xhr, status) {
            requestComplete();
        },
        success : function(backjson) {
            hideloding();
            if (backjson.code===200) {
                for (var i = 0; i < removeArray.length; i++) {
                    $("#techerLogTable").bootstrapTable('removeByUniqueId', removeArray[i]);
                }
                drawPagination(".techerLogTableArea", "日志信息");
                $(".myTooltip").tooltipify();
                $.hideModal("#remindModal");
                toastr.success(backjson.msg);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//开始检索
function startSearch(){
    var allSearchsObject=getAllSearchsObject();
    allSearchsObject.Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchTeacherLog",
        data: {
            "searchCriteria":JSON.stringify(allSearchsObject)
        },
        dataType : 'json',
        beforeSend: function(xhr) {
            requestErrorbeforeSend();
        },
        error: function(textStatus) {
            requestError();
        },
        complete: function(xhr, status) {
            requestComplete();
        },
        success : function(backjson) {
            hideloding();
            if (backjson.code===200) {
                stuffLogTable(backjson.data);
            } else {
                drawLogEmptyTable();
                toastr.warning(backjson.msg);
            }
        }
    });
}

//重置检索
function reReloadSearchs(){
    var reObject = new Object();
    reObject.InputIds = "#startTime,#endTime";
    reObject.normalSelectIds = "#logType";
    reReloadSearchsWithSelect(reObject);
    deafultSearch();
}

//获得检索对象
function getAllSearchsObject(){
    var returnObject=new Object();
    var logType=getNormalSelectValue("logType");
    var startTime=$("#startTime").val();
    var endTime=$("#endTime").val();

    if(!checkTime(startTime,endTime)){
        toastr.warning("结束时间必须晚于开始时间");
        return;
    }
    returnObject.logType=logType;
    returnObject.startDate=startTime;
    returnObject.endDate=endTime;
    return returnObject;
}

//获得新的日志对象
function getNewLogInfo(){
    var returnObject=new Object();
    var Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
    var teacherName=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
    var logType=getNormalSelectValue("newLogType");
    var typeName=getNormalSelectText("newLogType");
    var logTitle=$("#newTitle").val();
    var logDetail=$("#logBody").val();

    if(logTitle===""){
        toastr.warning("日志标题不能为空");
        return;
    }
    if(logType===""){
        toastr.warning("日志类型不能为空");
        return;
    }
    if(logDetail===""){
        toastr.warning("日志内容不能为空");
        return;
    }

    returnObject.Edu101_ID=Edu101_ID;
    returnObject.teacherName=teacherName;
    returnObject.logType=logType;
    returnObject.typeName=typeName;
    returnObject.logTitle=logTitle;
    returnObject.logDetail=logDetail;
    return returnObject;
}

//区域显示隐藏控制
function areaControl(){
    $(".logArea").toggle();
    $(".mainArea").toggle();
}

//预备新增日志
function wantAdddlong(){
    areaControl();
    $(".submitLog").show();
    $(".submitLog").attr("value","确认新增");
    $('.submitLog').unbind('click');
    $('.submitLog').bind('click', function(e) {
        submitLog(false);
        e.stopPropagation();
    });
}

//确认新增日志
function submitLog(idModify,row){
    var newLogInfo=getNewLogInfo();
    if(typeof  newLogInfo==="undefined"){
        return;
    }
    if(idModify){
        newLogInfo.Edu114_ID=row.edu114_ID;
    }
    $.ajax({
        method : 'get',
        cache : false,
        url : "/teacherAddLog",
        data: {
            "newLogInfo":JSON.stringify(newLogInfo)
        },
        dataType : 'json',
        beforeSend: function(xhr) {
            requestErrorbeforeSend();
        },
        error: function(textStatus) {
            requestError();
        },
        complete: function(xhr, status) {
            requestComplete();
        },
        success : function(backjson) {
            hideloding();
            if (backjson.code===200) {
                if(!idModify){
                    $('#techerLogTable').bootstrapTable("prepend", backjson.data);
                }else{
                    $("#techerLogTable").bootstrapTable("updateByUniqueId", {id: newLogInfo.Edu114_ID, row: newLogInfo});
                }
                areaControl();
                toastr.success(backjson.msg);
                $(".myTooltip").tooltipify();
                drawPagination(".techerLogTableArea", "日志信息");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//返回按钮
function returnMainArea(){
    areaControl();
}

//初始化页面按钮绑定事件
function btnBind(){
    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });

    //开始检索
    $('#startSearch').unbind('click');
    $('#startSearch').bind('click', function(e) {
        startSearch();
        e.stopPropagation();
    });

    //重置检索
    $('#reReloadSearchs').unbind('click');
    $('#reReloadSearchs').bind('click', function(e) {
        reReloadSearchs();
        e.stopPropagation();
    });

    //预备新增日志
    $('#adddlog').unbind('click');
    $('#adddlog').bind('click', function(e) {
        wantAdddlong();
        e.stopPropagation();
    });

    //预备新增日志
    $('#returnMainArea').unbind('click');
    $('#returnMainArea').bind('click', function(e) {
        returnMainArea();
        e.stopPropagation();
    });

    //批量删除日志
    $('#removeLogs').unbind('click');
    $('#removeLogs').bind('click', function(e) {
        removeLogs();
        e.stopPropagation();
    });
}
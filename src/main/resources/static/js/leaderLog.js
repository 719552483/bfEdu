var EJDMElementInfo;
$(function() {
    $('.isSowIndex').selectMania(); //初始化下拉框
    EJDMElementInfo=queryEJDMElementInfo();
    stuffEJDElement(EJDMElementInfo);
    drawCalenr("#startTime");
    drawCalenr("#endTime");
    drawLogEmptyTable();
    drawEditor();
    btnBind();
});


//填充空的学生表
function drawLogEmptyTable() {
    stuffLogTable({});
}

var choosendLog=new Array();
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
            for (var i = 0; i < choosendLog.length; i++) {
                $("#techerLogTable").bootstrapTable("checkBy", {field:"edu114_ID", values:[choosendLog[i].edu114_ID]})
            }
        },
        columns: [
            {
                field: 'check',
                checkbox: true
            },{
                field: 'edu114_ID',
                title: '唯一标识',
                align: 'center',
                visible: false
            },
            {
                field: 'pyccmc',
                title: '日志标题',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'szxbmc',
                title: '日志类型',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'szxbmc',
                title: '发布时间',
                align: 'left',
                formatter: paramsMatter
            },  {
                field: 'action',
                title: '操作',
                align: 'center',
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

    drawPagination(".techerLogTableArea", "日志信息");
    drawSearchInput(".techerLogTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".techerLogTableArea", "日志信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//单选学生
function onCheck(row){
    if(choosendLog.length<=0){
        choosendLog.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendLog.length; i++) {
            if(choosendLog[i].edu114_ID===row.edu114_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosendLog.push(row);
        }
    }
}

//单反选学生
function onUncheck(row){
    if(choosendLog.length<=1){
        choosendLog.length=0;
    }else{
        for (var i = 0; i < choosendLog.length; i++) {
            if(choosendLog[i].edu114_ID===row.edu114_ID){
                choosendLog.splice(i,1);
            }
        }
    }
}

//全选学生
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosendLog.push(row[i]);
    }
}

//全反选学生
function onUncheckAll(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu114_ID);
    }


    for (var i = 0; i < choosendLog.length; i++) {
        if(a.indexOf(choosendLog[i].edu114_ID)!==-1){
            choosendLog.splice(i,1);
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

//开始检索
function startSearch(){
    var allSearchsObject=getAllSearchsObject();
    allSearchsObject.userKey=JSON.parse($.session.get('userInfo')).userKey;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/teacherGetLog",
        data: {
            "searchsObject":JSON.stringify(allSearchsObject)
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
    drawLogEmptyTable();
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
    returnObject.startTime=startTime;
    returnObject.endTime=endTime;
    return returnObject;
}

//区域显示隐藏控制
function areaControl(){
    $(".logArea").show();
    $(".mainArea").hide();
}

function wantAdddlong(){
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
}
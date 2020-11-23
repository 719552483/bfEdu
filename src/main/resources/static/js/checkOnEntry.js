$(function() {
    $('.isSowIndex').selectMania(); //初始化下拉框
    getSemesterInfo();
    drawEmptyCheckOnEntryTable();
    btnBind();
});

//获取学期信息
function getSemesterInfo() {
    $.ajax({
        method: 'get',
        cache: false,
        url: "/getAllXn",
        dataType: 'json',
        beforeSend: function (xhr) {
            requestErrorbeforeSend();
        },
        error: function (textStatus) {
            requestError();
        },
        complete: function (xhr, status) {
            requestComplete();
        },
        success: function (backjson) {
            hideloding();
            if (backjson.result) {
                if(backjson.termInfo.length===0){
                    toastr.warning('暂无学年信息');
                    return;
                }
                //初始化下拉框
                var str = '<option value="seleceConfigTip">请选择</option>';
                for (var i = 0; i < backjson.termInfo.length; i++) {
                    str += '<option value="' + backjson.termInfo[i].edu400_ID + '">' + backjson.termInfo[i].xnmc + '</option>';
                }
                stuffManiaSelect("#year", str);
                //changge事件
                $("#year").change(function() {
                    getAllWeeks();
                });
            } else {
                toastr.warning('操作失败，请重试');
            }
        }
    });
}

//根据学年获取周的信息
function getAllWeeks(){
    var year=getNormalSelectValue("year");
    if(year===""){
        return;
    }
    $.ajax({
        method: 'get',
        cache: false,
        url: "/getYearWeek",
        data:{
            "yearId":year
        },
        dataType: 'json',
        beforeSend: function (xhr) {
            requestErrorbeforeSend();
        },
        error: function (textStatus) {
            requestError();
        },
        complete: function (xhr, status) {
            requestComplete();
        },
        success: function (backjson) {
            hideloding();
            if (backjson.code===200) {
                var allWeeks=backjson.data;
                var configStr='<option value="seleceConfigTip">请选择</option>';
                for (var i = 0; i < allWeeks.length; i++) {
                    configStr += '<option value="' + allWeeks[i].id + '">'+ allWeeks[i].value+'</option>';
                }
                stuffManiaSelect("#week", configStr);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充空的考勤表
function drawEmptyCheckOnEntryTable(){
    stuffCheckOnEntryTable({});
}

//渲染考勤表
function stuffCheckOnEntryTable(tableInfo){
    window.releaseNewsEvents = {
        'click #chenckonDeatils' : function(e, value, row, index) {
            chenckonDeatils(row,index);
        },
        'click #downLoadCheckon' : function(e, value, row, index) {
            downLoadCheckon(row,index);
        },
        'click #importCheckon' : function(e, value, row, index) {
            importCheckon(row,index);
        }
    };

    $('#checkOnEntryTable').bootstrapTable('destroy').bootstrapTable({
        data : tableInfo,
        pagination : true,
        pageNumber : 1,
        pageSize : 10,
        pageList : [ 10 ],
        showToggle : false,
        showFooter : false,
        clickToSelect : true,
        exportDataType: "all",
        showExport: true,      //是否显示导出
        exportOptions:{
            fileName: '考勤情况导出'  //文件名称
        },
        search : true,
        editable : false,
        striped : true,
        toolbar : '#toolbar',
        showColumns : true,
        onPageChange : function() {
            drawPagination(".checkOnEntryTableArea", "考勤记录");
        },
        columns : [
            {
                field : 'edu203_id',
                title: '唯一标识',
                align : 'center',
                visible : false
            },
            {
                field : 'xn',
                title : '学年',
                align : 'left',
                formatter :paramsMatter
            }, {
                field : 'week',
                title : '周数',
                align : 'left',
                formatter :paramsMatter
            },
            {
                field : 'xqmc',
                title : '星期',
                align : 'left',
                formatter :paramsMatter
            },
            {
                field : 'kjmc',
                title : '课节',
                align : 'left',
                formatter :paramsMatter
            },{
                field : 'kcmc',
                title : '课程名称',
                align : 'left',
                formatter :paramsMatter
            },
            {
                field : 'teacher_name',
                title : '教师',
                align : 'left',
                formatter :paramsMatter
            },
            {
                field : 'teacher_type',
                title : '教师类型',
                align : 'left',
                formatter :paramsMatter,
                visible : false
            },{
                field : 'attendance',
                title : '出勤率',
                align : 'left',
                width: "100px",
                formatter :attendanceMatter
            },{
                field : 'action',
                title : '操作',
                align : 'center',
                clickToSelect : false,
                formatter : releaseNewsFormatter,
                events : releaseNewsEvents,
            }]
    });

    function releaseNewsFormatter(value, row, index) {
        return [ '<ul class="toolbar tabletoolbar">'+
        '<li id="chenckonDeatils"><span><img src="img/info.png" style="width:24px"></span>查看考情详情</li>' +
        '<li  id="downLoadCheckon"><span><img src="images/ico05.png" style="width:24px"></span>下载考勤模板</li>'+
        '<li id="importCheckon"><span><img src="images/ico04.png" style="width:24px"></span>导入考勤情况</li>'+
        '</ul>' ].join('');
    }

    function attendanceMatter(value, row, index) {
        if(value==null||typeof value==="undefined"||value===""){
            return [ '<span class="label label-default myTooltip" title="未录入">未录入</span>' ]
                .join('');
        }else{
            var currentValue=parseFloat(value.split("%")[0]);
            if(currentValue>0 && currentValue>=50){
                return [ '<span class="label label-success myTooltip" title="'+value+'">'+value+'</span>' ]
                    .join('');
            }else{
                return [ '<span class="label label-danger myTooltip" title="'+value+'">'+value+'</span>' ]
                    .join('');
            }
        }
    }

    drawPagination(".checkOnEntryTableArea", "考勤记录");
    drawSearchInput(".checkOnEntryTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
    changeColumnsStyle(".checkOnEntryTableArea", "考勤记录");
}

//考勤详情
function  chenckonDeatils(row,index){

}

//下载考勤模板
function  downLoadCheckon(row,index){
    var url = "/downloadCourseCheckOnModal";
    var form = $("<form></form>").attr("action", url).attr("method", "post");
    form.append($("<input></input>").attr("type", "hidden").attr("name", "courseId").attr("value",row.edu203_id));
    form.appendTo('body').submit().remove();
}

//导入考勤
function  importCheckon(row,index){

}



//开始检索
function startSearch(){
    var searchInfo=getSearchInfo();
    $.ajax({
        method: 'get',
        cache: false,
        url: "/searchCourseCheckOn",
        data:{
            "searchInfo":JSON.stringify(searchInfo)
        },
        dataType: 'json',
        beforeSend: function (xhr) {
            requestErrorbeforeSend();
        },
        error: function (textStatus) {
            requestError();
        },
        complete: function (xhr, status) {
            requestComplete();
        },
        success: function (backjson) {
            hideloding();
            if (backjson.code===200) {
                stuffCheckOnEntryTable(backjson.data);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获取检索条件
function getSearchInfo(){
    var returnObject=new Object();
    var xnid=getNormalSelectValue("year");
    var week=getNormalSelectValue("week");
    var kjmc=$("#kjName").val();
    var edu101Id=JSON.parse($.session.get('userInfo')).userKey;
    returnObject.xnid=xnid;
    returnObject.week=week;
    returnObject.kjmc=kjmc;
    returnObject.edu101_id=edu101Id;
    return returnObject;
}

//重置检索
function reReloadSearchs(){
    var reObject = new Object();
    reObject.normalSelectIds = "#week,#year";
    reObject.InputIds = "#kjName";
    reReloadSearchsWithSelect(reObject);
    drawEmptyCheckOnEntryTable();
}

//初始化页面按钮绑定事件
function btnBind() {
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
}
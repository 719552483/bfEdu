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
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchCourseCheckOnDetail",
        async :false,
        data: {
            "courseId":row.edu203_id
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
            if (backjson.code === 200) {
                stuffCheckOnDeatilsArea(backjson.data,row);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//渲染考勤详情区域
function stuffCheckOnDeatilsArea(checkOnInfo,row){
    $("#tab1,#tab2,#tab3").empty();
    $("#checkOnDeatilsModal").find(".moadalTitle").html(row.xn+"第"+row.week+"周 "+row.xqmc+" "+row.kjmc+" - "+row.kcmc);
    $.showModal("#checkOnDeatilsModal",true);
    $(".itab").find("li:eq(0)").find("a").trigger('click');

    var checkTrueArray=new Array();
    var checkFlaseArray=new Array();
    var checkNulleArray=new Array();

    for (var i = 0; i < checkOnInfo.length; i++) {
        if(checkOnInfo[i].onCheckFlag==="01"){
            checkTrueArray.push(checkOnInfo[i]);
        }else if(checkOnInfo[i].onCheckFlag==="02"){
            checkFlaseArray.push(checkOnInfo[i]);
        }else{
            checkNulleArray.push(checkOnInfo[i]);
        }
    }

    //出勤名单
    var str="";
    if(checkTrueArray.length==0){
        str="<span class='checkZero'>暂无出勤名单...</span>";
    }else{
        // groupByClass(checkTrueArray);
        for (var i = 0; i < checkTrueArray.length; i++) {
            str+='<div class="col5 singleCheckOn recordsImg2">'+checkTrueArray[i].studentName+'</div>';
        }
    }
    $(".checkTrueArea").append(str);
    $(".trueNum").html("("+checkTrueArray.length+"人)");

    str='';
    //缺勤名单
    if(checkFlaseArray.length==0){
        str="<span class='checkZero'>暂无缺勤名单...</span>";
    }else{
        for (var i = 0; i < checkFlaseArray.length; i++) {
            str+='<div class="col5 singleCheckOn recordsImg2">'+checkFlaseArray[i].studentName+'</div>';
        }
    }
    $(".checkFlaseArea").append(str);
    $(".falseNum").html("("+checkFlaseArray.length+"人)");

    str='';
    //未录入名单
    if(checkNulleArray.length==0){
        str="<span class='checkZero'>暂无未录入名单...</span>";
    }else{
        for (var i = 0; i < checkNulleArray.length; i++) {
            str+='<div class="col5 singleCheckOn recordsImg2">'+checkNulleArray[i].studentName+'</div>';
        }
    }
    $(".checkNullArea").append(str);
    $(".nullNum").html("("+checkNulleArray.length+"人)");
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
    $.showModal("#importCheckonModal",true);
    $("#CheckonFile,#showFileName").val("");
    $(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
    $("#CheckonFile").on("change", function(obj) {
        //判断图片格式
        var fileName = $("#CheckonFile").val();
        var suffixIndex = fileName.lastIndexOf(".");
        var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
        if (suffix != "xls" && suffix !== "xlsx") {
            toastr.warning('请上传Excel类型的文件');
            $("#studentInfoFile").val("");
            return
        }
        $("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
    });
    //检验导入文件
    $('#checkCheckonFile').unbind('click');
    $('#checkCheckonFile').bind('click', function(e) {
        checkCheckonFile();
        e.stopPropagation();
    });

    //确认导入文件
    $('.confirmImportCheckon').unbind('click');
    $('.confirmImportCheckon').bind('click', function(e) {
        confirmImportCheckon(row,index);
        e.stopPropagation();
    });
}

//检验导入文件
function  checkCheckonFile(){
    if ($("#CheckonFile").val() === "") {
        toastr.warning('请选择文件');
        return;
    }
    var formData = new FormData();
    formData.append("file",$('#CheckonFile')[0].files[0]);
    $.ajax({
        url:'/checkCourseCheckOnFile',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
            $(".fileLoadingArea").hide();
            if(backjosn.code===200){
                showImportSuccessInfo("#importCheckonModal",backjosn.msg);
            }else{
                showImportErrorInfo("#importCheckonModal",backjosn.msg);
            }
        },beforeSend: function(xhr) {
            $(".fileLoadingArea").show();
        },
        error: function(textStatus) {
            requestError();
        },
        complete: function(xhr, status) {
            requestComplete();
        },
    });
}

//确认导入考勤
function  confirmImportCheckon(row,index){
    if ($("#CheckonFile").val() === "") {
        toastr.warning('请选择文件');
        return;
    }

    var lrrInfo=new Object();
    lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
    lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;

    var formData = new FormData();
    formData.append("file",$('#CheckonFile')[0].files[0]);
    formData.append("lrrInfo",JSON.stringify(lrrInfo));

    $.ajax({
        url:'/importCourseCheckOnFile',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
            $(".fileLoadingArea").hide();
            if(backjosn.code===200){
                $("#checkOnEntryTable").bootstrapTable('updateByUniqueId', {
                    id: row.edu203_id,
                    row: backjosn.data
                });
                toastr.success(backjosn.msg);
                $.hideModal("#importCheckonModal");
            }else{
                showImportErrorInfo("#importCheckonModal",backjosn.msg);
            }
        },beforeSend: function(xhr) {
            $(".fileLoadingArea").show();
        },
        error: function(textStatus) {
            requestError();
        },
        complete: function(xhr, status) {
            requestComplete();
        },
    });
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
                drawEmptyCheckOnEntryTable();
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
}
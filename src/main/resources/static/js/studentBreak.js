var EJDMElementInfo;
$(function() {
    $('.isSowIndex').selectMania(); //初始化下拉框
    drawStudentBaseInfoEmptyTable();
    btnBind();
    getBreakInfo();
});

//获取违纪信息
function getBreakInfo(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/studentFindBreak",
        data: {
            "userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
                stuffStudentBaseInfoTable(backjson.data);
                toastr.info(backjson.msg);
            } else {
                drawStudentBaseInfoEmptyTable();
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充空的学生表
function drawStudentBaseInfoEmptyTable() {
    stuffStudentBaseInfoTable({});
}

//渲染学生表
function stuffStudentBaseInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #breakDeatils': function(e, value, row, index) {
            breakDeatils(row);
        }
    };

    $('#breakTable').bootstrapTable('destroy').bootstrapTable({
        data: tableInfo,
        pagination: true,
        pageNumber: 1,
        pageSize : 10,
        pageList : [ 10 ],
        showToggle: false,
        showFooter: false,
        clickToSelect: true,
        search: false,
        editable: false,
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: false,
        onPageChange: function() {
            drawPagination(".studentStudentListTableArea", "违纪信息");
        },
        columns: [
            {
                field: 'edu006_ID',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            },
            {
                field: 'studentName',
                title: '姓名',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },  {
                field: 'breachName',
                title: '违纪类型',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'breachDate',
                title: '违纪时间',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
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
            '<li id="breakDeatils" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>违纪详情</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".studentStudentListTableArea", "违纪信息");
    drawSearchInput(".studentStudentListTableArea");
    changeTableNoRsTip();
    changeColumnsStyle( ".studentStudentListTableArea", "违纪信息");
    toolTipUp(".myTooltip");
}

//违纪详情
function breakDeatils(row){
    stuffDeatils(row);
    $.showModal("#breakDetailsModal",false);
    $("#breakDetailsModal").find(".moadalTitle").html(row.studentName+"-"+row.breachName+"详情");
}

//渲染详情
function stuffDeatils(info){
    $(".breakDetailsArea").empty();
    var currentHistory=info;
    var isRemove="";
    var cancelDate=info.cancelDate;
    var className="";
    info.cancelState!=null&&info.cancelState==="T"?isRemove="已撤销":isRemove="未撤销";
    info.cancelState!=null&&info.cancelState==="T"?className="noNone":className="noneStart";
    var str=""
    str='<div class="historyArea" style="margin-bottom: 10px;"><div>' +
        '<span><cite>学生姓名：</cite><b>'+nullMatter(currentHistory.studentName)+'</b></span>'+
        '<span><cite>违纪类型：</cite><b>'+nullMatter(currentHistory.breachName)+'</b></span>'+
        '<span><cite>违纪时间：</cite><b>'+nullMatter(currentHistory.breachDate)+'</b></span>'+
        '<span><cite>录入时间：</cite><b>'+nullMatter(currentHistory.creatDate)+'</b></span>'+
        '<span><cite>录入人：</cite><b>'+nullMatter(currentHistory.creatUser)+'</b></span>'+
        '<span><cite>详细说明：</cite><b>'+nullMatter(currentHistory.handlingOpinions)+'</b></span>'+
        '<span><cite>是否已撤销：</cite><b class="isRemove'+info.edu006_ID+'">'+isRemove+'</b></span>'+
        '<span class="'+className+' cancelDate'+info.edu006_ID+'"><cite>撤销时间：</cite><b class="showDate'+info.edu006_ID+'">'+nullMatter(cancelDate)+'</b></span>'+
        '</div></div>' ;
    $(".breakDetailsArea").append(str);
}

//初始化页面按钮绑定事件
function btnBind(){
    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });
}
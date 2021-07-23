$(function() {
    $('.isSowIndex').selectMania(); //初始化下拉框
    drawCalenrRange("#cz_StartDate","#cz_EndDate");
    getALLYwType();
    reReloadSearchs();
    btnbind();
});

//获得所有业务类 填充下拉框
function getALLYwType(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/selectAllLogActionValue",
        dataType : 'json',
        success : function(backjson) {
            if (backjson.code===200) {
                var str='<option value="seleceConfigTip">全部</option>';
                for (var i = 0; i < backjson.data.length; i++) {
                    str += '<option value="' + i + '">' + backjson.data[i]
                        + '</option>';
                }
                stuffManiaSelect("#yw_type", str);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获取操作日志
function getLog(Edu996,startTime,endTime){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/selectAllLog",
        data: {
            "SearchCriteria":JSON.stringify(Edu996),
            "startTime":startTime,
            "endTime":endTime
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
            if (backjson.code==200) {
                stuffLogTable(backjson.data);
            } else {
                toastr.warning(backjson.msg);
                stuffLogTable({});
            }
        }
    });
}

//填充日志表
function stuffLogTable(allGrade){
    $('#actionLogTable').bootstrapTable('destroy').bootstrapTable({
        data: allGrade,
        pagination: true,
        pageNumber: 1,
        pageSize: 10,
        pageList: [10],
        showToggle: false,
        showFooter: false,
        clickToSelect: true,
        search: true,
        editable: false,
        striped: true,
        toolbar: '#toolbar',
        showColumns: false,
        onPageChange: function() {
            drawPagination(".actionLogTableArea", "操作记录");
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {
                field: 'edu996_ID',
                title: '唯一Id',
                align: 'center',
                sortable: true,
                visible: false
            }, {
                field: 'actionValue',
                title: '业务类型',
                align: 'left',
                sortable: true,
                visible: true
            },
            {
                field: 'bussinsneValue',
                title: '操作类型',
                align: 'left',
                sortable: true,
                formatter: paramsMatter

            }, {
                field: 'user_name',
                title: '操作人',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'time',
                title: '操作时间',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }
        ]
    });

    drawSearchInput(".actionLogTableArea");
    drawPagination(".actionLogTableArea", "操作记录");
    toolTipUp(".myTooltip");
    btnControl();
}

//开始检索
function startSearch(){
    var ywType=getNormalSelectValue('yw_type');
    var czType=getNormalSelectValue('cz_type');
    var czStartDate=$('#cz_StartDate').val();
    var czEndDate=$('#cz_EndDate').val();
    if(ywType===''&&czType===''&&czStartDate===''&&czEndDate===''){
        toastr.warning('检索条件不能为空');
        return;
    }

    if(czStartDate!==''){
        czStartDate+=' 00:00:00';
    }

    if(czEndDate!==''){
        czEndDate+=' 23:59:59';
    }

    var Edu996=new Object();
    Edu996.actionKey=ywType;
    Edu996.bussinsneType=czType;

    getLog(Edu996,czStartDate,czEndDate);
}

//重置检索
function reReloadSearchs(){
    var reObject = new Object();
    reObject.InputIds = "#cz_StartDate,#cz_EndDate";
    reObject.normalSelectIds = "#cz_type,#yw_type";
    reReloadSearchsWithSelect(reObject);

    var Edu996=new Object();
    Edu996.actionKey='';
    Edu996.bussinsneType='';

    getLog(Edu996,'','');
}

//页面初始化时按钮事件绑定
function btnbind(){
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



$(function() {
    $('.isSowIndex').selectMania(); //初始化下拉框
    drawCalenrRange("#cz_StartDate","#cz_EndDate");
    getALLYwType();
    btnbind();
    getLogInfo();
});

//获取日志信息
function getLogInfo(){
    var oTable = new stuffLogInfoTable();
    oTable.Init();
}

//填充日志表
function stuffLogInfoTable() {
    var oTableInit = new Object();
    oTableInit.Init = function () {
        $('#actionLogTable').bootstrapTable('destroy').bootstrapTable({
            url:'/selectAllLog',         //请求后台的URL（*）
            method: 'POST',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            queryParamsType: '',
            dataType: 'json',
            pageNumber: 1, //初始化加载第一页，默认第一页
            queryParams: queryParams,//请求服务器时所传的参数
            sidePagination: 'server',//指定服务器端分页
            pageSize: 10,//单页记录数
            pageList: [10,20,30,40],//分页步进值
            search: false,
            silent: false,
            showRefresh: false,                  //是否显示刷新按钮
            showToggle: false,
            clickToSelect: true,
            striped: true,
            toolbar: '#toolbar',
            showColumns: true,
            onPostBody: function() {
                drawPagination(".actionLogTableArea", "操作记录","serverPage",1);
                drawSearchInput(".actionLogTableArea");
                changeColumnsStyle( ".actionLogTableArea", "操作记录","serverPage");
                changeTableNoRsTip();
                toolTipUp(".myTooltip");
            },
            onPageChange: function() {
                drawPagination(".actionLogTableArea", "操作记录","serverPage",1);
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
                    sortable: true
                },
                {
                    field: 'bussinsneValue',
                    title: '操作类型',
                    align: 'left',
                    sortable: true,
                    formatter: paramsMatter,
                    visible: false
                }, {
                    field: 'operationalInfo',
                    title: '操作关键字',
                    align: 'left',
                    sortable: true,
                    formatter: paramsMatter
                }, {
                    field: 'user_name',
                    title: '操作人',
                    align: 'left',
                    sortable: true,
                    formatter: paramsMatter
                },{
                    field: 'time',
                    title: '操作时间',
                    align: 'left',
                    sortable: true,
                    formatter: paramsMatter
                }
            ],
            responseHandler: function (res) {  //后台返回的结果
                if(res.code == 200){
                    var data = {
                        total: res.data.total,
                        rows: res.data.rows
                    };
                    return data;
                }else{
                    var data = {
                        total: 0,
                        rows:[]
                    };
                    toastr.warning(res.msg);
                    return data;
                }
            }
        });
    };

    //得到查询的参数
    function queryParams(params) {
        var temp=getSearchLogObject(false);
        temp.pageNum=params.pageNumber;
        temp.pageSize=params.pageSize;
        return JSON.stringify(temp);
    }

    return oTableInit;
}

//获得检索条件
function getSearchLogObject(isSearch){
    var ywType=getNormalSelectValue('yw_type');
    var czType=getNormalSelectValue('cz_type');
    var czStartDate=$('#cz_StartDate').val();
    var czEndDate=$('#cz_EndDate').val();
    var userName=$("#userName").val();

    if(ywType===''&&czType===''&&czStartDate===''&&czEndDate===''&&userName===''&&isSearch){
        toastr.warning('检索条件不能为空');
        return null;
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
    Edu996.user_name=userName;

    var returnObject=new Object();
    returnObject.SearchCriteria=JSON.stringify(Edu996);
    returnObject.startTime=czStartDate;
    returnObject.endTime=czEndDate;
    return returnObject;
}

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

//重置检索
function reReloadSearchs(){
    var reObject = new Object();
    reObject.InputIds = "#cz_StartDate,#cz_EndDate,#userName";
    reObject.normalSelectIds = "#cz_type,#yw_type";
    reReloadSearchsWithSelect(reObject);

    getLogInfo();
}

//页面初始化时按钮事件绑定
function btnbind(){
    //开始检索
    $('#startSearch').unbind('click');
    $('#startSearch').bind('click', function(e) {
       var searchInfo= getSearchLogObject(true);
       if(searchInfo==null){
           return;
       }
       getLogInfo();
       e.stopPropagation();
    });

    //重置检索
    $('#reReloadSearchs').unbind('click');
    $('#reReloadSearchs').bind('click', function(e) {
        reReloadSearchs();
        e.stopPropagation();
    });
}



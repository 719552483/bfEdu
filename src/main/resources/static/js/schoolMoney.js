var EJDMElementInfo;
$(function() {
    judgementPWDisModifyFromImplements();
    $('.isSowIndex').selectMania(); //初始化下拉框
    drawCalenrRange("#startDate","#endDate");
    EJDMElementInfo=queryEJDMElementInfo();
    stuffEJDElement(EJDMElementInfo);
    searchFinanceInfoDetail(true,true);
    btnBind();
    chartListener();
});

var choosend=new Array();
//渲染经费表
function stuffSchoolMoneyInfoTable(tableInfo) {
    choosend=new Array();
    window.releaseNewsEvents = {
        'click #removeMoney': function(e, value, row, index) {
            removeMoney(row);
        }
    };

    $('#schoolMoneyTable').bootstrapTable('destroy').bootstrapTable({
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
            fileName: '校园经费管理导出'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onPageChange: function() {
            drawPagination(".schoolMoneyTableArea", "经费信息");
        },
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
        onPostBody: function() {
            toolTipUp(".myTooltip");
            //勾选已选数据
            for (var i = 0; i < choosend.length; i++) {
                $("#schoolMoneyTable").bootstrapTable("checkBy", {field:"edu8001_ID", values:[choosend[i].edu8001_ID]})
            }
        },
        columns: [
            {
                field: 'check',
                checkbox: true
            },{
                field: 'edu8001_ID',
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
                field: 'name',
                title: '姓名',
                sortable: true,
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'lb',
                title: '支出类型',
                sortable: true,
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'fy',
                title: '支出金额',
                sortable: true,
                align: 'left',
                formatter: undoNubmerMoneyMatter
            }, {
                field: 'reason',
                title: '支出事由',
                sortable: true,
                align: 'left',
                formatter: paramsMatter
            },
            {
                field: 'payTime',
                title: '支出时间',
                sortable: true,
                align: 'left',
                formatter: paramsMatter
            },
            {
                field: 'bz',
                title: '支出备注',
                sortable: true,
                align: 'left',
                formatter: paramsMatter
            },  {
                field: 'createDate',
                title: '录入时间',
                sortable: true,
                align: 'left',
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
            '<li id="removeMoney" class="insertBtn"><span><img src="images/t03.png"></span>删除</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".schoolMoneyTableArea", "经费信息");
    drawSearchInput(".schoolMoneyTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".schoolMoneyTableArea", "经费信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//单选
function onCheck(row){
    if(choosend.length<=0){
        choosend.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosend.length; i++) {
            if(choosend[i].edu8001_ID===row.edu8001_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosend.push(row);
        }
    }
}

//单反选
function onUncheck(row){
    if(choosend.length<=1){
        choosend.length=0;
    }else{
        for (var i = 0; i < choosend.length; i++) {
            if(choosend[i].edu8001_ID===row.edu8001_ID){
                choosend.splice(i,1);
            }
        }
    }
}

//全选
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosend.push(row[i]);
    }
}

//全反选
function onUncheckAll(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu8001_ID);
    }


    for (var i = 0; i < choosend.length; i++) {
        if(a.indexOf(choosend[i].edu8001_ID)!==-1){
            choosend.splice(i,1);
            i--;
        }
    }
}

//单条删除经费
function removeMoney(row){
    $.showModal("#remindModal",true);
    $(".remindType").html("经费信息");
    $(".remindActionType").html("删除");
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray=new Array();
        removeArray.push(row.edu8001_ID);
        sendRemoveMoneysInfo(removeArray);
    });
}

//批量删除经费
function removeMoneys(){
    var choosend=$('#schoolMoneyTable').bootstrapTable('getSelections');
    if(choosend.length==0){
        toastr.warning('请选择经费信息');
        return;
    }
    $.showModal("#remindModal",true);
    $(".remindType").html("选择的经费信息");
    $(".remindActionType").html("删除");
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray=new Array();
        for (var i = 0; i < choosend.length; i++) {
            removeArray.push(choosend[i].edu8001_ID);
        }
        sendRemoveMoneysInfo(removeArray);
    });
}

//发送删除经费请求
function sendRemoveMoneysInfo(removeArray){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/deleteFinanceInfodetail",
        data: {
            "deleteIds":JSON.stringify(removeArray)
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
                tableRemoveAction("#schoolMoneyTable", removeArray, ".schoolMoneyTableArea", "经费信息");
                $.hideModal();
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//检索经费管理数据
function searchFinanceInfoDetail(canEmpty,showChart){
    var searchObject=new Object();
    searchObject.lbbm=getNormalSelectValue('payTypeSearch');
    searchObject.name=$('#nameSearch').val();

    var startDate=$('#startDate').val();
    var endDate=$('#endDate').val();
    if(!canEmpty&&searchObject.lbbm===''&&searchObject.name===''&&endDate===''&&startDate===''){
        toastr.warning('检索条件不能为空');
        return;
    }

    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchFinanceInfoDetail",
        data: {
            "SearchCriteria":JSON.stringify(searchObject),
            "startTime":startDate,
            "endTime":endDate
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
                stuffSchoolMoneyInfoTable(backjson.data.tableInfo);
                if(showChart){
                    stuffSchoolMoneyCbartArea(backjson.data);
                }
            } else {
                if(showChart){
                    $('.moneyChartArea').hide();
                }
                stuffSchoolMoneyInfoTable({});
                toastr.warning(backjson.msg);
            }
        }
    });
}

//渲染图形区域
function stuffSchoolMoneyCbartArea(data){
    draw1Area(data.histogram);
    draw2Area(data);
    draw3Area(data.pieChart);
}

//图形1
function draw1Area(histogramInfo){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("chart1"));

    var option = {
        title: {
            text: '支出金额统计(总)',
            left: 'center',
            textStyle: {
                color: 'rgb(118, 174, 209)',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var tar = params[1];
                return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value+'(元)';
            }
        },
        color: '#CC6666',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data:histogramInfo.dataName
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Total',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: histogramInfo.data1
            },
            {
                name: '支出金额',
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function (params) {
                        return '￥'+params.value;
                    }
                },
                data: histogramInfo.data2
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
}

//图形2
function draw2Area(dataInfo){
    $('#chart2').find('.data').find('cite:eq(1)').html(dealNumber(dataInfo.amount.now));

    if(dataInfo.amount.status==='up'){
        $('#chart2').find('.small-box-inner').find('.status').find('i').addClass('icon-cujiantou1');
        $('#chart2').find('.small-box-inner').find('.status').find('cite').html('较去年上升'+dealNumber(dataInfo.amount.count)+'(元)').addClass('greenTxt');
    }else if(dataInfo.amount.status==='down'){
        $('#chart2').find('.small-box-inner').find('.status').find('i').addClass('icon-cujiantou');
        $('#chart2').find('.small-box-inner').find('.status').find('cite').html('较去年下降'+dealNumber(dataInfo.amount.count)+'(元)').addClass('redTxt');
    }else{
        $('#chart2').find('.small-box-inner').find('.status').find('i').addClass('icon-zanwu');
        $('#chart2').find('.small-box-inner').find('.status').find('cite').html('与上一年持平').addClass('normalTxt');
    }
}

//图形3
function draw3Area(pieChartInfo){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("chart3"));

    var option = {
        title: {
            text: '支出数量统计(总)',
            textStyle: {
                color: 'rgb(118, 174, 209)',
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param){
                return param.seriesName+'<br/>'+ param.marker +param.data.name+':'+param.data.value+'(笔)'; //param.marker为提示的小圆圈
            }
        },
        color:['rgba(22,178,209,0.66)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)','rgba(112,144,162,0.87)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        series: [
            {
                name: '支出数量',
                type: 'pie',
                radius: ['40%', '70%'], //图的大小
                center: ['50%', '55%'], //图的位置，距离左跟上的位置
                data: pieChartInfo,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
}

//预备经费使用录入
function wantAddMoney(){
    restuffWantAddMoneyModal();
    $.showModal('#wantAddMoneyModal',true);
    $("#wantAddMoneyModal").find('.moadalTitle').html("经费使用录入");
}

//获取教职工信息
function getTeacherInfo(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/queryAllTeachers",
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
                stuffAllTeacherTable(backjson.data);
                allTaecherAreabtnBind();
                $.hideModal("#wantAddMoneyModal",false);
                $.showModal("#allTeacherModal",true);
                //二级模态框返回按钮事件
                $('.specialCanle').unbind('click');
                $('.specialCanle').bind('click', function(e) {
                    $.hideModal("#allTeacherModal",false);
                    $.showModal("#wantAddMoneyModal",true);
                    e.stopPropagation();
                });

                //确认选择
                $('#confirmChoosedTeacher').unbind('click');
                $('#confirmChoosedTeacher').bind('click', function(e) {
                    confirmChoosedTeacher();
                    e.stopPropagation();
                });
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

var choosendTeachers=new Array();
//填充教职工表
function stuffAllTeacherTable(tableInfo){
    choosendTeachers=new Array();
    $('#allTeacherTable').bootstrapTable('destroy').bootstrapTable({
        data : tableInfo,
        pagination : true,
        pageNumber : 1,
        pageSize : 5,
        pageList : [ 5 ],
        showToggle : false,
        showFooter : false,
        clickToSelect : true,
        search : true,
        editable : false,
        striped : true,
        toolbar : '#toolbar',
        showColumns : false,
        onCheck : function(row) {
            onCheckTeacher(row);
        },
        onUncheck : function(row) {
            onUncheckTeacher(row);
        },
        onCheckAll : function(rows) {
            onCheckAllTeacher(rows);
        },
        onUncheckAll : function(rows,rows2) {
            onUncheckAllTeacher(rows2);
        },
        onPageChange : function() {
            drawPagination(".allClassMangersTableArea", "教职工信息");
            for (var i = 0; i < choosendTeachers.length; i++) {
                $("#allTeacherTable").bootstrapTable("checkBy", {field:"edu101_ID", values:[choosendTeachers[i].edu101_ID]})
            }
        },
        columns : [ {
            field : 'edu101_ID',
            title : 'id',
            align : 'center',
            visible : false
        },{
            field: 'check',
            checkbox: true
        }, {
            title: '序号',
            align: 'center',
            class:'tableNumberTd',
            formatter: tableNumberMatter
        }, {
            field : 'szxbmc',
            title : '二级学院',
            align : 'left',
            formatter : paramsMatter

        }, {
            field : 'xm',
            title : '姓名',
            align : 'left',
            formatter : paramsMatter
        }, {
            field : 'jzgh',
            title : '教工号',
            align : 'left',
            formatter : paramsMatter
        }, {
            field : 'xb',
            title : '性别',
            align : 'left',
            formatter : sexFormatter
        }]
    });

    // 性别文字化
    function sexFormatter(value, row, index) {
        if (value === "M") {
            return [ '<div class="myTooltip" title="男">男</div>' ].join('');
        } else {
            return [ '<div class="myTooltip" title="女">女</div>' ].join('');
        }
    }
    drawPagination(".allClassMangersTableArea", "教职工信息");
    drawSearchInput(".allClassMangersTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
}

//单选教职工
function onCheckTeacher(row){
    if(choosendTeachers.length<=0){
        choosendTeachers.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendTeachers.length; i++) {
            if(choosendTeachers[i].edu101_ID===row.edu101_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosendTeachers.push(row);
        }
    }
}

//单反教职工
function onUncheckTeacher(row){
    if(choosendTeachers.length<=1){
        choosendTeachers.length=0;
    }else{
        for (var i = 0; i < choosendTeachers.length; i++) {
            if(choosendTeachers[i].edu101_ID===row.edu101_ID){
                choosendTeachers.splice(i,1);
            }
        }
    }
}

//全选教职工
function onCheckAllTeacher(row){
    for (var i = 0; i < row.length; i++) {
        choosendTeachers.push(row[i]);
    }
}

//全反教职工
function onUncheckAllTeacher(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu101_ID);
    }


    for (var i = 0; i < choosendTeachers.length; i++) {
        if(a.indexOf(choosendTeachers[i].edu101_ID)!==-1){
            choosendTeachers.splice(i,1);
            i--;
        }
    }
}

//重置新增支出Modal
function restuffWantAddMoneyModal(){
    var reObject = new Object();
    reObject.InputIds = "#paysPeople,#payTime,#payMoney,#payReason,#payMark";
    reObject.normalSelectIds = "#payType";
    reReloadSearchsWithSelect(reObject);
    $("#paysPeople").attr("choosendTeacherIds",'');
}

//确认经费使用录入
function confirmAddMoney(){
    var paysPeopleName=$('#paysPeople').val();
    var paysPeopleIds=$("#paysPeople").attr("choosendTeacherIds");
    var payType=getNormalSelectValue('payType');
    var payTypeName=getNormalSelectText('payType');
    var payTime=$('#payTime').val();
    var payMoney=$('#payMoney').val();
    var payReason=$('#payReason').val();
    var payMark=$('#payMark').val();

    if(paysPeopleName===''){
        toastr.warning('支出人不能为空');
        return;
    }

    if(payType===''){
        toastr.warning('支出类型不能为空');
        return;
    }

    if(payTime===''){
        toastr.warning('支出时间不能为空');
        return;
    }

    if(payMoney===''){
        toastr.warning('支出金额不能为空');
        return;
    }

    if(!checkIsNumber(payMoney)){
        toastr.warning('支出金额必须是数字');
        return;
    }

    if(payReason===''){
        toastr.warning('支出事由不能为空');
        return;
    }

    var financeInfo=new Object();
    financeInfo.edu101Id=paysPeopleIds;
    financeInfo.name=paysPeopleName;
    financeInfo.payTime=payTime;
    financeInfo.lb=payTypeName;
    financeInfo.lbbm=payType;
    financeInfo.reason=payReason;
    financeInfo.fy=payMoney;
    financeInfo.bz=payMark;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/saveFinanceInfoDetail",
        data: {
            "financeInfo":JSON.stringify(financeInfo)
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
                $('#schoolMoneyTable').bootstrapTable('prepend', backjson.data);
                toolTipUp(".myTooltip");
                toastr.success(backjson.msg);
                $.hideModal();
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//开始检索教职工
function allTeacherStartSearch(){
    var departmentName=$("#departmentName").val();
    var mangerName=$("#mangerName").val();
    var mangerNumber=$("#mangerNumber").val();
    if(departmentName===""&&mangerName===""&&mangerNumber===""){
        toastr.warning('检索条件为空');
        return;
    }
    var serachObject=new Object();
    departmentName===""?serachObject.departmentName="":serachObject.departmentName=departmentName;
    mangerName===""?serachObject.xm="":serachObject.xm=mangerName;
    mangerNumber===""?serachObject.jzgh="":serachObject.jzgh=mangerNumber;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchAllTeacher",
        data: {
            "SearchCriteria":JSON.stringify(serachObject)
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
                stuffAllTeacherTable(backjson.data);
            } else {
                toastr.warning(backjson.msg);
                stuffAllTeacherTable({});
            }
        }
    });
}

//重置检索教职工
function allTaecherReSearch(){
    var reObject = new Object();
    reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
    reReloadSearchsWithSelect(reObject);
    $.ajax({
        method : 'get',
        cache : false,
        url : "/queryAllTeachers",
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
                stuffAllTeacherTable(backjson.data);
            } else {
                toastr.warning(backjson.data);
                stuffAllTeacherTable({});
            }
        }
    });
}

//确认选择教职工事件
function confirmChoosedTeacher(){
    var choosend=$("#allTeacherTable").bootstrapTable("getSelections");
    if(choosend.length<=0){
        toastr.warning('请选择教职工');
        return;
    }

    var mcArray=new Array();
    var codeArray=new Array();
    for (var i = 0; i < choosend.length; i++) {
        mcArray.push(choosend[i].xm);
        codeArray.push(choosend[i].edu101_ID);
    }

    $('#paysPeople').val(mcArray);
    $("#paysPeople").attr("choosendTeacherIds",codeArray);
    $.hideModal("#allTeacherModal",false);
    $.showModal("#wantAddMoneyModal",true);
}

//选择教职工模态框按钮绑定事件
function allTaecherAreabtnBind() {
    // 开始检索教师按钮
    $('#allClassMangers_StartSearch').unbind('click');
    $('#allClassMangers_StartSearch').bind('click', function(e) {
        allTeacherStartSearch();
        e.stopPropagation();
    });

    // 重置检索教师按钮
    $('#allClassMangers_ReSearch').unbind('click');
    $('#allClassMangers_ReSearch').bind('click', function(e) {
        allTaecherReSearch();
        e.stopPropagation();
    });

    //确认选择教师
    $('#confirmChoosedTeacher').unbind('click');
    $('#confirmChoosedTeacher').bind('click', function(e) {
        confirmChoosedTeacher();
        e.stopPropagation();
    });
}

// chart自适应
function chartListener(){
    // chart自适应
    window.addEventListener("resize", function() {
        var myChart = echarts.init(document.getElementById('chart1'));
        myChart.resize();
        var myChart = echarts.init(document.getElementById('chart3'));
        myChart.resize();
    });
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
        searchFinanceInfoDetail(false,false);
        e.stopPropagation();
    });

    //重置检索
    $('#reReloadSearchs').unbind('click');
    $('#reReloadSearchs').bind('click', function(e) {
        var reObject = new Object();
        reObject.InputIds = "#nameSearch,#startDate,#endDate";
        reObject.normalSelectIds = "#payTypeSearch";
        reReloadSearchsWithSelect(reObject);
        searchFinanceInfoDetail(true,false);
        e.stopPropagation();
    });

    //预备经费使用录入
    $('#wantAddMoney').unbind('click');
    $('#wantAddMoney').bind('click', function(e) {
        wantAddMoney();
        e.stopPropagation();
    });

    //批量删除经费
    $('#removeMoneys').unbind('click');
    $('#removeMoneys').bind('click', function(e) {
        removeMoneys();
        e.stopPropagation();
    });

    //确认经费使用录入
    $('.confirmAdd').unbind('click');
    $('.confirmAdd').bind('click', function(e) {
        confirmAddMoney();
        e.stopPropagation();
    });

    drawCalenr("#payTime");

    //调整教师focus
    $('#paysPeople').focus(function(e){
        getTeacherInfo();
        e.stopPropagation();
    });
}
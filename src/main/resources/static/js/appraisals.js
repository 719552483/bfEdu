var EJDMElementInfo;
$(function() {
    // $('.isSowIndex').selectMania(); //初始化下拉框
    // EJDMElementInfo=queryEJDMElementInfo();
    // stuffEJDElement(EJDMElementInfo);
    drawAppraisalsEmptyTable();
    btnBind();
    getAppraisals();
});

//填充空的学生表
function drawAppraisalsEmptyTable() {
    stuffAppraisalsTable({});
}

//获取评价
function getAppraisals(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/studentGetAppraise",
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
                stuffAppraisalsTable(backjson.data);
                toastr.info(backjson.msg);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

var choosendAppraisals=new Array();
//渲染学生表
function stuffAppraisalsTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #appraisalsDetails': function(e, value, row, index) {
            appraisalsDetails(row);
        }
    };

    $('#studentAppraisalsTable').bootstrapTable('destroy').bootstrapTable({
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
            fileName: '学生评价导出'  //文件名称
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
            drawPagination(".techerStudentListTableArea", "评价信息");
            for (var i = 0; i < choosendAppraisals.length; i++) {
                $("#studentAppraisalsTable").bootstrapTable("checkBy", {field:"edu004_ID", values:[choosendAppraisals[i].edu004_ID]})
            }
        },
        columns: [
            {
                field: 'check',
                checkbox: true
            },{
                field: 'edu004_ID',
                title: '唯一标识',
                align: 'center',
                visible: false
            },
            // {
            //     field: 'pyccmc',
            //     title: '学年',
            //     align: 'left',
            //     formatter: paramsMatter
            // },
            {
                field: 'teacherName',
                title: '评价人',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'creatDate',
                title: '评价时间',
                align: 'left',
                formatter: paramsMatter
            } ,{
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
            '<li id="appraisalsDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".techerStudentListTableArea", "评价信息");
    drawSearchInput(".techerStudentListTableArea");
    changeTableNoRsTip();
    changeColumnsStyle( ".techerStudentListTableArea", "评价信息");
    toolTipUp(".myTooltip");
}

//单选学生
function onCheck(row){
    if(choosendAppraisals.length<=0){
        choosendAppraisals.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendAppraisals.length; i++) {
            if(choosendAppraisals[i].edu004_ID===row.edu004_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosendAppraisals.push(row);
        }
    }
}

//单反选学生
function onUncheck(row){
    if(choosendAppraisals.length<=1){
        choosendAppraisals.length=0;
    }else{
        for (var i = 0; i < choosendAppraisals.length; i++) {
            if(choosendAppraisals[i].edu004_ID===row.edu004_ID){
                choosendAppraisals.splice(i,1);
            }
        }
    }
}

//全选学生
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosendAppraisals.push(row[i]);
    }
}

//全反选学生
function onUncheckAll(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu004_ID);
    }


    for (var i = 0; i < choosendAppraisals.length; i++) {
        if(a.indexOf(choosendAppraisals[i].edu004_ID)!==-1){
            choosendAppraisals.splice(i,1);
            i--;
        }
    }
}

//评价详情
function appraisalsDetails(row){
    $("#studentAppraise_name").val(row.teacherName);
    $("#studentAppraise_data").val(row.creatDate);
    $("#AppraiseTxt").val(row.appraiseText);
    $('#studentAppraiseModal').find(".myInput,.breakOptionTextArea").attr("disabled", true) // 将input元素设置为readonly
    $.showModal("#studentAppraiseModal",false);
}

//初始化页面按钮绑定事件
function btnBind(){
    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });

    // //开始检索
    // $('#startSearch').unbind('click');
    // $('#startSearch').bind('click', function(e) {
    //     startSearch();
    //     e.stopPropagation();
    // });

    // //重置检索
    // $('#reReloadSearchs').unbind('click');
    // $('#reReloadSearchs').bind('click', function(e) {
    //     reReloadSearchs();
    //     e.stopPropagation();
    // });
}
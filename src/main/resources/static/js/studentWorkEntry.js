var EJDMElementInfo;
$(function() {
    judgementPWDisModifyFromImplements();
    $('.isSowIndex').selectMania(); //初始化下拉框
    LinkageSelectPublic("#level","#department","#grade","#major");
    EJDMElementInfo=queryEJDMElementInfo();
    stuffEJDElement(EJDMElementInfo);
    btnBind();
});

var choosendStudent=new Array();
//渲染就业信息表
function stuffStudentWorkTable(tableInfo) {
    // window.releaseNewsEvents = {
    //     'click #studentDetails': function(e, value, row, index) {
    //         studentDetails(row);
    //     },
    //     'click #querystudentAppraise': function(e, value, row, index) {
    //         querystudentAppraise(row,index);
    //     },
    //     'click #modifyStudentAppraise': function(e, value, row, index) {
    //         $("#studentAppraiseModal").find(".searchArea").show()
    //         $("#studentAppraise_name").val(row.xm);
    //         studentAppraise(row,index);
    //     }
    // };

    $('#studentWorkTable').bootstrapTable('destroy').bootstrapTable({
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
            fileName: '学生就业情况导出'  //文件名称
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
            drawPagination(".studentWorkTableArea", "学生就业情况");
            for (var i = 0; i < choosendStudent.length; i++) {
                $("#techerStudentListTable").bootstrapTable("checkBy", {field:"edu001_ID", values:[choosendStudent[i].edu001_ID]})
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
                field: 'edu001_ID',
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
                field: 'pyccmc',
                title: '层次',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'szxbmc',
                title: '二级学院',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'njmc',
                title: '年级',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'zymc',
                title: '专业名称',
                align: 'center',
                sortable: true,
                formatter: paramsMatter,
                visible: true
            }, {
                field: 'xzbname',
                title: '行政班',
                align: 'left',
                sortable: true,
                formatter: xzbnameMatter,
                visible: true
            }, {
                field: 'xm',
                title: '姓名',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'xh',
                title: '学号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'sylx',
                title: '生源类型',
                align: 'left',
                sortable: true,
                visible: false,
                formatter: paramsMatter
            },  {
                field: 'xb',
                title: '性别',
                align: 'left',
                sortable: true,
                formatter: sexFormatter
            }, {
                field: 'zt',
                title: '状态',
                align: 'left',
                sortable: true,
                formatter: ztMatter
            }, {
                field: 'sfyxj',
                title: '是否有学籍',
                align: 'left',
                sortable: true,
                formatter: isrollMatter,
                visible: false
            },
            {
                field: 'zkzh',
                title: '准考证号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            },
            {
                field: 'ksh',
                title: '考生号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'sfzh',
                title: '身份证号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'xjh',
                title: '学籍号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            },{
                field: 'zym',
                title: '曾用名',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'csrq',
                title: '出生日期',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'rxsj',
                title: '入学时间',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'mz',
                title: '民族',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'hf',
                title: '婚否',
                align: 'left',
                sortable: true,
                formatter: marriageMatter,
                visible: false
            }, {
                field: 'whcd',
                title: '文化程度',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'zzmm',
                title: '政治面貌',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'syd',
                title: '生源地',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'jtzz',
                title: '家庭住址',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'rxzf',
                title: '入学总分',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'bz',
                title: '备注',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'sjhm',
                title: '手机号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'email',
                title: 'E-mail',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'jg',
                title: '籍贯',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'sg',
                title: '身高',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'tz',
                title: '体重',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            },  {
                field: 'zsfs',
                title: '招生方式',
                align: 'left',
                sortable: true,
                visible: false,
                formatter: paramsMatter
            }, {
                field: 'dxpy',
                title: '是否订单',
                align: 'left',
                sortable: true,
                formatter: isOrNotisMatter,
                visible: false
            }, {
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
            '<li id="studentDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
            '<li id="querystudentAppraise" class="insertBtn"><span><img src="images/t01.png" style="width:24px"></span>查看评价</li>' +
            '<li id="modifyStudentAppraise" class="insertBtn"><span><img src="images/t02.png" style="width:24px"></span>修改评价</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".studentWorkTableArea", "学生就业情况");
    drawSearchInput(".studentWorkTableArea");
    changeTableNoRsTip();
    changeColumnsStyle( ".studentWorkTableArea", "学生就业情况");
    toolTipUp(".myTooltip");
    btnControl();
}

//单选学生
function onCheck(row){
    if(choosendStudent.length<=0){
        choosendStudent.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendStudent.length; i++) {
            if(choosendStudent[i].edu001_ID===row.edu001_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosendStudent.push(row);
        }
    }
}

//单反选学生
function onUncheck(row){
    if(choosendStudent.length<=1){
        choosendStudent.length=0;
    }else{
        for (var i = 0; i < choosendStudent.length; i++) {
            if(choosendStudent[i].edu001_ID===row.edu001_ID){
                choosendStudent.splice(i,1);
            }
        }
    }
}

//全选学生
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosendStudent.push(row[i]);
    }
}

//全反选学生
function onUncheckAll(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu001_ID);
    }


    for (var i = 0; i < choosendStudent.length; i++) {
        if(a.indexOf(choosendStudent[i].edu001_ID)!==-1){
            choosendStudent.splice(i,1);
            i--;
        }
    }
}


//预备添加单个就业信息
function wantAddStudentWork(){
    LinkageSelectPublic("#addStudentWork_level","#addStudentWork_department","#addStudentWork_grade","#addStudentWork_major");
    $.showModal('#addStudentWorkModal',true);

}

//初始化页面按钮绑定事件
function btnBind() {
    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });

    //预备添加单个就业信息
    $('#wantAddStudentWork').unbind('click');
    $('#wantAddStudentWork').bind('click', function(e) {
        wantAddStudentWork();
        e.stopPropagation();
    });
}
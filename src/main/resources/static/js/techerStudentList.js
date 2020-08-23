var EJDMElementInfo;
$(function() {
    $('.isSowIndex').selectMania(); //初始化下拉框
    EJDMElementInfo=queryEJDMElementInfo();
    stuffEJDElement(EJDMElementInfo);
    getMajorTrainingSelectInfo();
    drawStudentBaseInfoEmptyTable();
    btnBind();
});

// 获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
    LinkageSelectPublic("#level","#department","#grade","#major");
    $("#major").change(function() {
        startSearch();
    });
    $("#sex").change(function() {
        startSearch();
    });
}

//填充空的学生表
function drawStudentBaseInfoEmptyTable() {
    stuffStudentBaseInfoTable({});
}

//渲染学生表
function stuffStudentBaseInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #studentDetails': function(e, value, row, index) {
            studentDetails(row);
        },
        'click #querystudentAppraise': function(e, value, row, index) {
            querystudentAppraise(row,index);
        },
        'click #modifyStudentAppraise': function(e, value, row, index) {
            $("#studentAppraiseModal").find(".searchArea").show()
            $("#studentAppraise_name").val(row.xm);
            studentAppraise(row,index);
        }
    };

    $('#techerStudentListTable').bootstrapTable('destroy').bootstrapTable({
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
        onPageChange: function() {
            drawPagination(".techerStudentListTableArea", "学生信息");
        },
        columns: [
            {
                field: 'check',
                checkbox: true
            },{
                field: 'edu001_ID',
                title: '唯一标识',
                align: 'center',
                visible: false
            },
            {
                field: 'pyccmc',
                title: '层次',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'szxbmc',
                title: '二级学院',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'njmc',
                title: '年级',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'zymc',
                title: '专业名称',
                align: 'center',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'xzbname',
                title: '行政班',
                align: 'left',
                formatter: xzbnameMatter,
                visible: false
            }, {
                field: 'xm',
                title: '姓名',
                align: 'left',
                formatter: paramsMatter
            },{
                field: 'xh',
                title: '学号',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'sylx',
                title: '生源类型',
                align: 'left',
                formatter: paramsMatter
            },  {
                field: 'xb',
                title: '性别',
                align: 'left',
                formatter: sexFormatter
            }, {
                field: 'zt',
                title: '状态',
                align: 'left',
                formatter: ztMatter
            }, {
                field: 'sfyxj',
                title: '是否有学籍',
                align: 'left',
                formatter: isrollMatter,
                visible: false
            },
            {
                field: 'zkzh',
                title: '准考证号',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            },
            {
                field: 'ksh',
                title: '考生号',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'sfzh',
                title: '身份证号',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'xjh',
                title: '学籍号',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            },{
                field: 'zym',
                title: '曾用名',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'csrq',
                title: '出生日期',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'rxsj',
                title: '入学时间',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'mz',
                title: '民族',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'hf',
                title: '婚否',
                align: 'left',
                formatter: marriageMatter,
                visible: false
            }, {
                field: 'whcd',
                title: '文化程度',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'zzmm',
                title: '政治面貌',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'syd',
                title: '生源地',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'jtzz',
                title: '家庭住址',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'rxzf',
                title: '入学总分',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'bz',
                title: '备注',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'sjhm',
                title: '手机号',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'email',
                title: 'E-mail',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'jg',
                title: '籍贯',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'sg',
                title: '身高',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'tz',
                title: '体重',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            },  {
                field: 'zsfs',
                title: '招生方式',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'dxpy',
                title: '是否订单',
                align: 'left',
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

    function xzbnameMatter(value, row, index) {
        if (value===""||value==null) {
            return [
                '<div class="myTooltip redTxt" title="行政班已删除">行政班已删除</div>'
            ]
                .join('');
        } else {
            return [
                '<div class="myTooltip" title="'+value+'">'+value+'</div>'
            ]
                .join('');
        }
    }

    function isrollMatter(value, row, index) {
        if (value==="T") {
            return [
                '<div class="myTooltip greenTxt" title="有学籍">有学籍</div>'
            ]
                .join('');
        } else {
            return [
                '<div class="myTooltip redTxt" title="无学籍">无学籍</div>'
            ]
                .join('');
        }
    }

    function marriageMatter(value, row, index) {
        if (value==="T") {
            return [
                '<div class="myTooltip" title="已婚">已婚</div>'
            ]
                .join('');
        } else {
            return [
                '<div class="myTooltip" title="未婚">未婚</div>'
            ]
                .join('');
        }
    }

    function ztMatter(value, row, index) {
        EJDMElementInfo;
        if (row.zt==="在读") {
            return [
                '<div class="myTooltip greenTxt" title="在读">在读</div>'
            ]
                .join('');
        } else if(row.zt==="毕业"){
            return [
                '<div class="myTooltip normalTxt" title="'+row.zt+'">'+row.zt+'</div>'
            ]
                .join('');
        }else if(row.zt==="其他"){
            return [
                '<div class="myTooltip" title="'+row.zt+'">'+row.zt+'</div>'
            ]
                .join('');
        }else{
            return [
                '<div class="myTooltip redTxt" title="'+row.zt+'">'+row.zt+'</div>'
            ]
                .join('');
        }
    }

    drawPagination(".techerStudentListTableArea", "学生信息");
    drawSearchInput(".techerStudentListTableArea");
    changeTableNoRsTip();
    changeColumnsStyle( ".techerStudentListTableArea", "学生信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//展示学生详情
function studentDetails(row){
    $.showModal("#studentModal",false);
    $("#studentModal").find(".moadalTitle").html(row.xm+"-详细信息");
    $('#studentModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    emptyStudentBaseInfoArea();
    stuffStudentDetails(row);
}

//填充学生信息
function stuffStudentDetails(row){
    $("#addStudentNum").val(row.xh);
    $("#addStudentName").val(row.xm);
    $("#addStudentUsedName").val(row.zym);
    stuffManiaSelectWithDeafult("#addStudentSex", row.xb);
    stuffManiaSelectWithDeafult("#addStudentStatus", row.ztCode);
    $("#dateOfBrith").val(row.csrq);
    stuffManiaSelectWithDeafult("#addStudentpycc", row.pycc,row.pyccmc);
    stuffManiaSelectWithDeafult("#addStudentxb", row.szxb,row.szxbmc);
    stuffManiaSelectWithDeafult("#addStudentnj", row.nj,row.njmc);
    stuffManiaSelectWithDeafult("#addStudentzy", row.zybm,row.zymc);
    stuffManiaSelectWithDeafult("#addStudentxzb", row.edu300_ID,row.xzbname);
    $("#addStudentIDNum").val(row.sfzh);
    stuffManiaSelectWithDeafult("#addStudentNation", row.mzbm);
    stuffManiaSelectWithDeafult("#addStudentIsHaveStatus", row.sfyxj);
    $("#addStudentStatusNum").val(row.xjh);
    stuffManiaSelectWithDeafult("#addStudentzzmm", row.zzmmbm);
    $("#addStudentsyd").val(row.syd);
    stuffManiaSelectWithDeafult("#addStudentwhcd", row.whcdbm);
    $("#addStudentksh").val(row.ksh);
    $("#addStudentrxzf").val(row.rxzf);
    $("#enterSchoolDate").val(row.rxsj);
    $("#addStudentbyzh").val(row.byzh);
    $("#addStudentzkzh").val(row.zkzh);
    $("#addStudentphoneNum").val(row.sjhm);
    $("#addStudentemail").val(row.email);
    $("#addStudentjk").val(row.jg);
    $("#addStudentzhiye").val(row.zy);
    $("#addStudentsg").val(row.sg);
    $("#addStudenttz").val(row.tz);
    stuffManiaSelectWithDeafult("#addStudentIsMarried", row.hf);
    stuffManiaSelectWithDeafult("#addStudentType", row.sylxbm);
    stuffManiaSelectWithDeafult("#addStudentzsfs", row.zsfscode);
    stuffManiaSelectWithDeafult("#addStudentIsDxpy", row.dxpy);
    stuffManiaSelectWithDeafult("#addStudentIsPoorFamily", row.pkjt);
    $("#addStudentjtzz").val(row.jtzz);
    $("#addStudentzjxy").val(row.zjxy);
    $("#addStudentbz").val(row.bz);
}

//清空学生信息模态框
function emptyStudentBaseInfoArea() {
    var reObject = new Object();
    reObject.fristSelectId ="#addStudentpycc";
    reObject.actionSelectIds ="#addStudentxb,#addStudentnj,#addStudentzy,#addStudentxzb";
    reObject.InputIds = "#addStudentName,#addStudentUsedName,#dateOfBrith,#addStudentIDNum,#addStudentStatusNum,#addStudentStatusNum,#addStudentksh,#addStudentrxzf,#enterSchoolDate,#addStudentbyzh,#addStudentzkzh,#addStudentphoneNum,#addStudentemail,#addStudentjk,#addStudentzhiye,#addStudentsg,#addStudenttz,#addStudentjtzz,#addStudentzjxy,#addStudentbz";
    reObject.normalSelectIds = "#addStudentSex,#addStudentStatus,#addStudentNation,#addStudentIsHaveStatus,#addStudentzzmm,#addStudentwhcd,#addStudentIsMarried,#addStudentType,#addStudentzsfs,#addStudentIsDxpy,#addStudentIsPoorFamily";
    reReloadSearchsWithSelect(reObject);
}

//查看学生评价
function querystudentAppraise(row,index){
    var sendObject=new Object();
    sendObject.Edu001_ID=JSON.stringify(row.edu001_ID);
    sendObject.Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/queryStudentAppraise",
        data: {
            "appraiseInfo":JSON.stringify(sendObject)
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
                $.showModal("#studentAppraiseModal",false);
                $('#studentAppraiseModal').find(".myInput,textarea").attr("disabled", true) // 将input元素设置为readonly
                $("#studentAppraiseModal").find(".searchArea").show()
                $("#studentAppraise_name").val(row.xm);
                $("#AppraiseTxt").val(backjson.data.appraiseText)
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//预备操作单个学生
function studentAppraise(row,index){
    $.showModal("#studentAppraiseModal",true);
    $("#studentAppraiseModal").find(".moadalTitle").html(row.xm+" -评价操作");
    $('#studentAppraiseModal').find(".myInput,textarea").attr("disabled", false) // 将input元素设置为readonly
    $("#studentAppraiseModal").find(".searchArea").show()
    $("#studentAppraise_name").val(row.xm);
    //确认提交评价
    $('.confirmAppraiseBtn').unbind('click');
    $('.confirmAppraiseBtn').bind('click', function(e) {
        var sendArray=new Array();
        sendArray.push(row.edu001_ID);
        confirmAppraise(sendArray);
        e.stopPropagation();
    });
}

//预备预备操作多个学生
function wantAddAppraises(){
    var choosed=$("#techerStudentListTable").bootstrapTable("getSelections");
    if(choosed.length===0){
        toastr.warning("暂未选择学生");
        return;
    }

    $.showModal("#studentAppraiseModal",true);
    $("#studentAppraiseModal").find(".moadalTitle").html("学生批量评价操作");
    $('#studentAppraiseModal').find(".myInput,textarea").attr("disabled", false) // 将input元素设置为readonly
    $("#studentAppraiseModal").find(".searchArea").hide()
    $("#studentAppraise_name").val("");

    var sendArray=new Array();
    for (var i = 0; i < choosed.length; i++) {
        sendArray.push(choosed[i].edu001_ID);
    }
    //确认提交评价
    $('.confirmAppraiseBtn').unbind('click');
    $('.confirmAppraiseBtn').bind('click', function(e) {
        confirmAppraise(sendArray);
        e.stopPropagation();
    });
}

//发送评价
function confirmAppraise(sendArray){
    var AppraiseTxt=$("#AppraiseTxt").val();
    if(AppraiseTxt===""){
        toastr.warning('请输入学生评价内容');
        return;
    }

    if(getByteLen(AppraiseTxt)>255){
        toastr.warning('学生评价字符集长度超过255');
        return;
    }

    $.ajax({
        method : 'get',
        cache : false,
        url : "/studentAppraise",
        data: {
            "studentArray":JSON.stringify(sendArray),
            "appraiseInfo":AppraiseTxt,
            "userKey":JSON.parse($.session.get('userInfo')).userKey
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
               $.hideModal("#studentAppraiseModal");
                toastr.success(backjson.msg);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//使用字符unicode判断长度
function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var length = val.charCodeAt(i);
        if(length>=0&&length<=128)
        {
            len += 1;
        }
        else
        {
            len += 2;
        }
    }
    return len;
}

//获得所有检索条件
function getAllSearchsObject(){
    var allSearchsObject=getNotNullSearchs();
    if(typeof allSearchsObject ==='undefined'){
        return;
    }
    var sex=getNormalSelectValue("sex");
    var name=$("#name").val();
    var AdministrationClassName=$("#AdministrationClassName").val();
    allSearchsObject.sex=sex;
    allSearchsObject.name=name;
    allSearchsObject.className=AdministrationClassName;
    return allSearchsObject;
}

//必选检索条件检查
function getNotNullSearchs() {
    var levelValue = getNormalSelectValue("level");
    var departmentValue = getNormalSelectValue("department");
    var gradeValue =getNormalSelectValue("grade");
    var majorValue =getNormalSelectValue("major");

    if (levelValue == "") {
        toastr.warning('层次不能为空');
        return;
    }

    if (departmentValue == "") {
        toastr.warning('二级学院不能为空');
        return;
    }

    if (gradeValue == "") {
        toastr.warning('年级不能为空');
        return;
    }

    if (majorValue == "") {
        toastr.warning('专业不能为空');
        return;
    }
    var levelText = getNormalSelectText("level");
    var departmentText = getNormalSelectText("department");
    var gradeText =getNormalSelectText("grade");
    var majorText =getNormalSelectText("major");

    var returnObject = new Object();
    returnObject.gradation = levelValue;
    returnObject.department = departmentValue;
    returnObject.grade = gradeValue;
    returnObject.major = majorValue;
    returnObject.levelTxt = levelText;
    returnObject.departmentTxt = departmentText;
    returnObject.gradeTxt = gradeText;
    returnObject.majorTxt = majorText;
    return returnObject;
}

//开始检索
function startSearch(){
    var allSearchsObject=getAllSearchsObject();
    if(typeof allSearchsObject ==='undefined'){
        return;
    }
    allSearchsObject.userKey=JSON.parse($.session.get('userInfo')).userKey;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/findStudentInTeaching",
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
                stuffStudentBaseInfoTable(backjson.data);
            } else {
                drawStudentBaseInfoEmptyTable();
                toastr.warning(backjson.msg);
            }
        }
    });
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

    //预备批量评价操作
    $('#wantAddAppraises,#wantModifyAppraises').unbind('click');
    $('#wantAddAppraises,#wantModifyAppraises').bind('click', function(e) {
        $("#AppraiseTxt").val("");
        wantAddAppraises();
        e.stopPropagation();
    });
}
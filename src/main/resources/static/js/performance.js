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
        'click #breakDeatils': function(e, value, row, index) {
            breakDeatils(row);
        },
        'click #removeBreak': function(e, value, row, index) {
            wantRemoveBreak(row);
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
        search: true,
        editable: false,
        exportDataType: "all",
        showExport: true,      //是否显示导出
        exportOptions:{
            fileName: '学生违纪信息导出'  //文件名称
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
                field: 'xm',
                title: '姓名',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'xh',
                title: '学号',
                align: 'left',
                formatter: paramsMatter
            },{
                field: 'xzbname',
                title: '行政班',
                align: 'left',
                formatter: xzbnameMatter
            }, {
                field: 'sylx',
                title: '生源类型',
                align: 'left',
                formatter: paramsMatter,
                visible: false
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
                formatter: paramsMatter,
                visible: false
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
            '<li id="breakDeatils" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>违纪详情</li>' +
            '<li id="removeBreak" class="insertBtn"><span><img src="images/close.png" style="width:24px"></span>违纪撤销</li>' +
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

//违纪详情
function breakDeatils(row){
    getDeatils(row,false);
}

//预备撤销违纪
function wantRemoveBreak(row){
    getDeatils(row,true);
}

//获取详情
function getDeatils(row,isRemoveAction) {
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchBreakInfoByStudent",
        data: {
            "studentId":row.edu001_ID.toString()
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
                stuffDeatils(backjson.data,isRemoveAction);
                $.showModal("#breakDetailsModal",false);
                $("#breakDetailsModal").find(".moadalTitle").html(row.xm+"-违纪记录详情");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//渲染详情
function stuffDeatils(info,isRemoveAction){
    $(".breakCount").html("共找到"+info.length+"条违纪记录");
    $(".breakDetailsArea").empty();
    var str=""
    for (var i = 0; i <info.length ; i++) {
        var currentHistory=info[i];
        var isRemove="";
        var cancelDate=info[i].cancelDate;
        var className="";
        info[i].cancelState!=null&&info[i].cancelState==="T"?isRemove="已撤销":isRemove="未撤销";
        info[i].cancelState!=null&&info[i].cancelState==="T"?className="noNone":className="noneStart";
        str+='<div class="historyArea" style="margin-bottom: 10px;"><p class="Historystep">违纪记录'+(i+1)+'</p><div>' +
            '<span><cite>学生姓名：</cite><b>'+nullMatter(currentHistory.studentName)+'</b></span>'+
            '<span><cite>违纪类型：</cite><b>'+nullMatter(currentHistory.breachName)+'</b></span>'+
            '<span><cite>违纪时间：</cite><b>'+nullMatter(currentHistory.breachDate)+'</b></span>'+
            '<span><cite>录入时间：</cite><b>'+nullMatter(currentHistory.creatDate)+'</b></span>'+
            '<span><cite>录入人：</cite><b>'+nullMatter(currentHistory.creatUser)+'</b></span>'+
            '<span><cite>详细说明：</cite><b>'+nullMatter(currentHistory.handlingOpinions)+'</b></span>'+
            '<span><cite>是否已撤销：</cite><b class="isRemove'+info[i].edu006_ID+'">'+isRemove+'</b></span>'+
            '<span class="'+className+' cancelDate'+info[i].edu006_ID+'"><cite>撤销时间：</cite><b class="showDate'+info[i].edu006_ID+'">'+nullMatter(cancelDate)+'</b></span>'+
            '</div></div>' ;
        if(isRemoveAction){
            str+='<input type="button" class="cancel removeBreakBtn" state="'+info[i].cancelState+'" id="'+info[i].edu006_ID+'" value="撤销违纪记录"/>';
        }
    }
    $(".breakDetailsArea").append(str);

    //撤销违纪
    $('.removeBreakBtn').unbind('click');
    $('.removeBreakBtn').bind('click', function(e) {
        removeBreakBtn(e.currentTarget.id,e.currentTarget.attributes[2].nodeValue);
        e.stopPropagation();
    });
}

//撤销违纪
function removeBreakBtn(id,state){
    if(state==="T"){
        toastr.warning("该记录已撤销");
        return;
    }

    $.ajax({
        method : 'get',
        cache : false,
        url : "/cancelBreakInfo",
        data: {
            "cancelId":id
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
                $(".cancelDate"+id).show();
                $(".showDate"+id).html(backjson.data);
                $(".isRemove"+id).html("已撤销");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//预备新增违纪
function wantAddBreak(){
    emptyWantAddBreakModal();
    drawCalenr("#breakData");
    $.showModal("#addBreakModal",true);
    // 选择学生
    $('#students').focus(function(e){
        allStudentReSearch();
        getAllStudents();
        e.stopPropagation();
    });

    //确认新增违纪
    $('.confirmAddBreak').unbind('click');
    $('.confirmAddBreak').bind('click', function(e) {
        confirmAddBreak();
        e.stopPropagation();
    });
}

//确认新增违纪
function confirmAddBreak(){
   var breakInfo=getBreakInfo();
   if(typeof breakInfo==="undefined"){
       return;
   }
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addStudentBreak",
        data: {
            "breakInfo":JSON.stringify(breakInfo)
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
            startSearch();
        },
        success : function(backjson) {
            hideloding();
            if (backjson.code===200) {
                $.hideModal("#addBreakModal");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得新增的违纪信息
function getBreakInfo(){
    var Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
    var creatUser=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
    var breachType=getNormalSelectValue("breakType");
    var breachDate=$("#breakData").val();
    var handlingOpinions=$("#handlingOpinions").val();
    var Edu001_ID=$("#students").attr("choosendIds");

    if(breachType===""){
        toastr.warning('请选择违纪类型');
        return;
    }
    if(breachDate===""){
        toastr.warning('请选择违纪日期');
        return;
    }
    if(Edu001_ID===""){
        toastr.warning('请选择违纪学生');
        return;
    }

    if(getByteLen(handlingOpinions)>255){
        toastr.warning('详细说明超过255个字符(中文2个，英文一个)');
        return;
    }

    var returnOnject=new Object();
    returnOnject.Edu101_ID=Edu101_ID;
    returnOnject.creatUser=creatUser;
    returnOnject.breachType=breachType;
    returnOnject.breachName=getNormalSelectText("breakType");
    returnOnject.handlingOpinions=handlingOpinions;
    returnOnject.breachDate=breachDate;
    returnOnject.Edu001_ID=Edu001_ID;
    returnOnject.studentName=$("#students").val();
    return returnOnject;
}

//清空新增模态框
function emptyWantAddBreakModal(){
    var reObject = new Object();
    reObject.InputIds = "#students,#breakData,#handlingOpinions";
    reObject.normalSelectIds = "#breakType";
    reReloadSearchsWithSelect(reObject);
}

//清空学生选择区域
function allStudentReSearch(){
    var reObject = new Object();
    reObject.normalSelectIds = "#student_level,#student_department,#student_grade,#student_major,#students";
    reReloadSearchsWithSelect(reObject);
    $("#students").attr("choosendIds","");
}

//获得所有学生
function getAllStudents(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getStudentByUserDepartment",
        data: {
            "searchsObject":JSON.stringify(getStudentSearchObject(true)) ,
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
                stuffStudentTable(backjson.data);
                LinkageSelectPublic("#student_level","#student_department","#student_grade","#student_major");
                studentsBtnBind();
                $.hideModal("#addBreakModal",false);
                $.showModal("#chooseStudentModal",true);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

var choosendStudents=new Array();
//渲染可选学生表
function stuffStudentTable(tableInfo){
    $('#allStudentTable').bootstrapTable('destroy').bootstrapTable({
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
        onPageChange : function() {
            drawPagination(".allClassMangersTableArea", "学生信息");
            for (var i = 0; i < choosendStudents.length; i++) {
                $("#allStudentTable").bootstrapTable("checkBy", {field:"edu001_ID", values:[choosendStudents[i].edu001_ID]})
            }
        },
        columns : [ {
            field : 'edu001_ID',
            title : 'id',
            align : 'center',
            visible : false
        },{
            field: 'check',
            checkbox: true
        }, {
            field : 'xm',
            title : '姓名',
            align : 'left',
            formatter : paramsMatter
        }, {
            field : 'xh',
            title : '学号',
            align : 'left',
            formatter : paramsMatter
        }, {
            field : 'njmc',
            title : '年级',
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
    drawPagination(".allClassMangersTableArea", "学生信息");
    drawSearchInput(".allClassMangersTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
}

//单选学生
function onCheck(row){
    if(choosendStudents.length<=0){
        choosendStudents.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendStudents.length; i++) {
            if(choosendStudents[i].edu001_ID===row.edu001_ID){
                add=false;
                break;
            }
        }
        if(add){
            choosendStudents.push(row);
        }
    }
}

//单反选学生
function onUncheck(row){
    if(choosendStudents.length<=1){
        choosendStudents.length=0;
    }else{
        for (var i = 0; i < choosendStudents.length; i++) {
            if(choosendStudents[i].edu001_ID===row.edu001_ID){
                choosendStudents.splice(i,1);
            }
        }
    }
}

//全选学生
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosendStudents.push(row[i]);
    }
}

//全反选学生
function onUncheckAll(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu001_ID);
    }


    for (var i = 0; i < choosendStudents.length; i++) {
        if(a.indexOf(choosendStudents[i].edu001_ID)!==-1){
            choosendStudents.splice(i,1);
            i--;
        }
    }
}

//开始检索可选学生
function allStudent_StartSearch(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getStudentByUserDepartment",
        data: {
            "searchsObject":JSON.stringify(getStudentSearchObject(false)) ,
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
                stuffStudentTable(backjson.data);
            } else {
                stuffStudentTable({});
                toastr.warning(backjson.msg);
            }
        }
    });
}

//重置检索可选学生
function allStudent_ReSearch(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getStudentByUserDepartment",
        data: {
            "searchsObject":JSON.stringify(getStudentSearchObject(true)) ,
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
                allStudentReSearch();
                stuffStudentTable(backjson.data);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得可选学生扥检索对象
function getStudentSearchObject(needEmptyObject){
    var returnObject=new Object();
    var student_level;
    var student_department;
    var student_grade;
    var student_major;
    if(needEmptyObject){
        student_level="";
        student_department="";
        student_grade="";
        student_major="";
    }else{
        student_level=getNormalSelectValue("student_level");
        student_department=getNormalSelectValue("student_department");
        student_grade=getNormalSelectValue("student_grade");
        student_major=getNormalSelectValue("student_major");
    }
    returnObject.level=student_level;
    returnObject.department=student_department;
    returnObject.grade=student_grade;
    returnObject.major=student_major;
    return returnObject;
}

//开始检索
function startSearch(){
    var allSearchsObject=getAllSearchsObject();
    allSearchsObject.userId=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/findBreakStudent",
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
                toastr.info(backjson.msg);
            } else {
                drawStudentBaseInfoEmptyTable();
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得所有检索条件
function getAllSearchsObject(){
    var returnObject = new Object();
    var levelValue = getNormalSelectValue("level");
    var departmentValue = getNormalSelectValue("department");
    var gradeValue =getNormalSelectValue("grade");
    var majorValue =getNormalSelectValue("major");
    var sex=getNormalSelectValue("sex");
    var name=$("#name").val();
    var AdministrationClassName=$("#AdministrationClassName").val();

    returnObject.level = levelValue;
    returnObject.department = departmentValue;
    returnObject.grade = gradeValue;
    returnObject.major = majorValue;
    returnObject.sex=sex;
    returnObject.name=name;
    returnObject.className=AdministrationClassName;
    return returnObject;
}

//重置检索
function reReloadSearchs(){
    var reObject = new Object();
    reObject.InputIds = "#name,#AdministrationClassName";
    reObject.normalSelectIds = "#level,#department,#grade,#major,#sex";
    reReloadSearchsWithSelect(reObject);
    drawStudentBaseInfoEmptyTable();
}

//确认选择学生
function confirmChoosedStudent(){
    var choosedStudent = $("#allStudentTable").bootstrapTable("getSelections");
    if(choosedStudent.length===0){
        toastr.warning('暂未选择学生');
        return;
    }

    var choosendIdArray=new Array();
    var choosendNAMEArray=new Array();
    for (var i = 0; i <choosedStudent.length ; i++) {
        choosendIdArray.push(choosedStudent[i].edu001_ID);
        choosendNAMEArray.push(choosedStudent[i].xm);
    }
    $("#students").val(choosendNAMEArray.toString());
    $("#students").attr("choosendIds",choosendIdArray.toString());
    $.hideModal("#chooseStudentModal",false);
    $.showModal("#addBreakModal",true);
}

//可选学生按钮事件绑定
function studentsBtnBind(){
    //开始检索
    $('#allStudent_StartSearch').unbind('click');
    $('#allStudent_StartSearch').bind('click', function(e) {
        allStudent_StartSearch();
        e.stopPropagation();
    });

    //重置检索
    $('#allStudent_ReSearch').unbind('click');
    $('#allStudent_ReSearch').bind('click', function(e) {
        allStudent_ReSearch();
        e.stopPropagation();
    });

    //确认选择学生
    $('#confirmChoosedStudent').unbind('click');
    $('#confirmChoosedStudent').bind('click', function(e) {
        confirmChoosedStudent();
        e.stopPropagation();
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

    // 学生模态框消失
    $('.specialCanle').unbind('click');
    $('.specialCanle').bind('click', function(e) {
        $.hideModal("#chooseStudentModal",false);
        $.showModal("#addBreakModal",true);
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

    //预备新增违纪
    $('#wantAddBreak').unbind('click');
    $('#wantAddBreak').bind('click', function(e) {
        wantAddBreak();
        e.stopPropagation();
    });
}
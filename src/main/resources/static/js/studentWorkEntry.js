var EJDMElementInfo;
$(function() {
    judgementPWDisModifyFromImplements();
    $('.isSowIndex').selectMania(); //初始化下拉框
    LinkageSelectPublic("#level","#department","#grade","#major");
    EJDMElementInfo=queryEJDMElementInfo();
    stuffEJDElement(EJDMElementInfo);
    btnBind();
    searchStudentWorkInfo(true);
});

var choosendStudent=new Array();
//渲染就业信息表
function stuffStudentWorkTable(tableInfo) {
    choosendStudent=new Array();
    window.releaseNewsEvents = {
        'click #studentWorkDetails': function(e, value, row, index) {
            studentWorkDetails(row);
        },'click #modifyStudentWork': function(e, value, row, index) {
            modifyStudentWork(row);
        },'click #removeStudentWork': function(e, value, row, index) {
            removeStudentWork(row);
        }
    };

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
                $("#studentWorkTable").bootstrapTable("checkBy", {field:"edu0011_ID", values:[choosendStudent[i].edu0011_ID]})
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
                field: 'edu0011_ID',
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
            },
            {
                field: 'szxbmc',
                title: '二级学院',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            },{
                field: 'njmc',
                title: '年级',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            },{
                field: 'zymc',
                title: '专业',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            },{
                field: 'xm',
                title: '姓名',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'xh',
                title: '学号',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'xzbname',
                title: '行政班名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'jyxs',
                title: '就业形式',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'dwmc',
                title: '单位名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'dwlxr',
                title: '单位联系人',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'dwlxdh',
                title: '单位联系电话',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'dwdz',
                title: '单位地址',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'bz',
                title: '备注',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'sclr',
                title: '当前录入是否首次',
                align: 'center',
                sortable: true,
                formatter: sclrMatter
            },{
                field: 'action',
                title: '操作',
                align: 'left',
                clickToSelect: false,
                formatter: releaseNewsFormatter,
                events: releaseNewsEvents,
            }
        ]
    });

    function releaseNewsFormatter(value, row, index) {
        if(row.sclr === 'T'){
            return [ '<div class="myTooltip normalTxt" title="未录入有效信息信息,暂无操作">-未录入过任何有效信息,暂无操作-</div>' ]
                .join('');
        }else{
            return [
                '<ul class="toolbar tabletoolbar">' +
                '<li id="studentWorkDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
                '<li id="modifyStudentWork" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
                '<li id="removeStudentWork" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
                '</ul>'
            ]
                .join('');
        }
    }

    function sclrMatter(value, row, index) {
        if(value === 'T'){
            return [ '<div class="myTooltip normalTxt" title="是">是</div>' ]
                .join('');
        }else{
            return [ '<div class="myTooltip" title="否">否</div>' ]
                .join('');
        }
    }

    drawPagination(".studentWorkTableArea", "学生就业情况");
    drawSearchInput(".studentWorkTableArea");
    changeTableNoRsTip();
    changeColumnsStyle( ".studentWorkTableArea", "学生就业情况");
    toolTipUp(".myTooltip");
    btnControl();
}

//学生就业信息详情
function studentWorkDetails(row){
    stuffStudentWorkModalInfo(row,true);
    $.showModal('#addStudentWorkModal',false);
    $("#addStudentWorkModal").find(".moadalTitle").html(row.xm+'就业情况详情');
}

//修改学生就业信息
function modifyStudentWork(row){
    stuffStudentWorkModalInfo(row,true);
    $.showModal('#addStudentWorkModal',true);
    $("#addStudentWorkModal").find(".moadalTitle").html(row.xm+'就业情况详情');
    //确认录入学生就业信息
    $('.confirmAddStudentWork').unbind('click');
    $('.confirmAddStudentWork').bind('click', function(e) {
        confirmAddStudentWork(row);
        e.stopPropagation();
    });
}

//删除学生就业信息
function removeStudentWork(row){
    $.showModal("#remindModal",true);
    $(".remindType").html(row.xm+"就业信息");
    $(".remindActionType").html("删除");
    //确认新增关系按钮
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.edu0011_ID);
        sendRemoveStudentWork(removeArray);
        e.stopPropagation();
    });
}

//批量删除学生就业信息
function removeStudentWorks(){
    if (choosendStudent.length === 0) {
        toastr.warning('暂未选择学生');
        return;
    }

    $.showModal("#remindModal",true);
    $(".remindType").html('已选'+choosendStudent.length+"个学生就业信息");
    $(".remindActionType").html("删除");
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        for (var i = 0; i < choosendStudent.length; i++) {
            removeArray.push(choosendStudent[i].edu0011_ID);
        }
        sendRemoveStudentWork(removeArray);
        e.stopPropagation();
    });
}

//发送删除学生就业信息请求
function sendRemoveStudentWork(removeArray){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/clearEmploymentStudents",
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
                for (var i = 0; i < backjson.data.length; i++) {
                    $('#studentWorkTable').bootstrapTable('updateByUniqueId', {
                        id: backjson.data[i].edu0011_ID,
                        row: backjson.data[i]
                    });
                }
                $.hideModal("#remindModal");
                $(".myTooltip").tooltipify();
                toastr.success(backjson.msg);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//单选学生
function onCheck(row){
    if(choosendStudent.length<=0){
        choosendStudent.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendStudent.length; i++) {
            if(choosendStudent[i].edu0011_ID===row.edu0011_ID){
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
            if(choosendStudent[i].edu0011_ID===row.edu0011_ID){
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
        a.push(row[i].edu0011_ID);
    }


    for (var i = 0; i < choosendStudent.length; i++) {
        if(a.indexOf(choosendStudent[i].edu0011_ID)!==-1){
            choosendStudent.splice(i,1);
            i--;
        }
    }
}

//预备添加单个就业信息
function wantAddStudentWork(){
    if(choosendStudent.length<=0){
        toastr.warning('暂未选择学生');
        return;
    }else if(choosendStudent.length>1){
        toastr.warning('请只选择一个学生');
        return;
    }else if(choosendStudent[0].sclr === 'F'){
        toastr.warning('该学生就业信息已录入');
        return;
    }

    $('.addStudentWorkModal_Name').html(choosendStudent[0].xm);

    $.showModal('#addStudentWorkModal',true);
    $("#addStudentWorkModal").find(".moadalTitle").html(choosendStudent[0].xm+'就业情况录入');
    stuffStudentWorkModalInfo(choosendStudent[0],false);

    //确认录入学生就业信息
    $('.confirmAddStudentWork').unbind('click');
    $('.confirmAddStudentWork').bind('click', function(e) {
        confirmAddStudentWork(choosendStudent[0]);
        e.stopPropagation();
    });
}

//确认录入学生就业信息
function confirmAddStudentWork(choosendStudentInfo){
    var addStudentWork_workType=getNormalSelectValue('addStudentWork_workType');
    var addStudentWork_workTypeName=getNormalSelectText('addStudentWork_workType');
    var addStudentWork_unitName=$('#addStudentWork_unitName').val();
    var addStudentWork_unitPeople=$('#addStudentWork_unitPeople').val();
    var addStudentWork_unitPhone=$('#addStudentWork_unitPhone').val();
    var addStudentWork_unitLocation=$('#addStudentWork_unitLocation').val();
    var addStudentWork_mark=$('#addStudentWork_mark').val();

    if(addStudentWork_workType===''){
        toastr.warning('就业形式不能为空');
        return;
    }

    choosendStudentInfo.jyxs=addStudentWork_workTypeName//就业形式
    choosendStudentInfo.jyxsbm=addStudentWork_workType//就业形式编码
    choosendStudentInfo.dwmc=addStudentWork_unitName;//单位名称
    choosendStudentInfo.dwlxr=addStudentWork_unitPeople;//单位联系人
    choosendStudentInfo.dwlxdh=addStudentWork_unitPhone;//单位联系电话
    choosendStudentInfo.dwdz=addStudentWork_unitLocation;//单位地址
    choosendStudentInfo.bz=addStudentWork_mark;//备注
    sendNewStudentWorkInfo(choosendStudentInfo);
}

//发送学生就业信息
function sendNewStudentWorkInfo(choosendStudentInfo){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/updateEmploymentStudents",
        data: {
            "studentInfo":JSON.stringify(choosendStudentInfo)
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
                $('#studentWorkTable').bootstrapTable('updateByUniqueId', {
                    id: choosendStudentInfo.edu0011_ID,
                    row: backjson.data
                });
                toolTipUp(".myTooltip");
                toastr.success(backjson.msg);
                $.hideModal();
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充学生就信息模态框数据
function stuffStudentWorkModalInfo(studentWorkInfo,isShowDetails){
    //学生基本信息
    var str ="";
    //层次
    str = '<option value="' + studentWorkInfo.pycc + '">' + studentWorkInfo.pyccmc+ '</option>';
    stuffManiaSelect('#addStudentWork_level', str);
    //系部
    str = '<option value="' + studentWorkInfo.szxb + '">' + studentWorkInfo.szxbmc+ '</option>';
    stuffManiaSelect('#addStudentWork_department', str);
    //年级
    str = '<option value="' + studentWorkInfo.nj + '">' + studentWorkInfo.njmc+ '</option>';
    stuffManiaSelect('#addStudentWork_grade', str);
    //专业
    str = '<option value="' + studentWorkInfo.nj + '">' + studentWorkInfo.zymc+ '</option>';
    stuffManiaSelect('#addStudentWork_major', str);

    $('#addStudentWork_student').val(studentWorkInfo.xm);
    $('#addStudentWork_studentXzb').val(studentWorkInfo.xzbname);

    //就业信息
    if(!isShowDetails){
        var reObject = new Object();
        reObject.normalSelectIds = "#addStudentWork_workType";
        reObject.InputIds = "#addStudentWork_unitName,#addStudentWork_unitPeople,#addStudentWork_unitPhone,#addStudentWork_unitLocation,#addStudentWork_mark";
        reReloadSearchsWithSelect(reObject);
    }else{
        stuffManiaSelectWithDeafult("#addStudentWork_workType", studentWorkInfo.jyxsbm);  //就业形式
        studentWorkInfo.dwmc==null||studentWorkInfo.dwmc===''?$('#addStudentWork_unitName').val(''): $('#addStudentWork_unitName').val(studentWorkInfo.dwmc);
        studentWorkInfo.dwlxr==null||studentWorkInfo.dwlxr===''?$('#addStudentWork_unitPeople').val(''):$('#addStudentWork_unitPeople').val(studentWorkInfo.dwlxr);
        studentWorkInfo.dwlxdh==null||studentWorkInfo.dwlxdh===''?$('#addStudentWork_unitPhone').val(''):$('#addStudentWork_unitPhone').val(studentWorkInfo.dwlxdh);
        studentWorkInfo.dwdz==null||studentWorkInfo.dwdz===''?$('#addStudentWork_unitLocation').val(''): $('#addStudentWork_unitLocation').val(studentWorkInfo.dwdz);
        studentWorkInfo.bz==null||studentWorkInfo.bz===''?$('#addStudentWork_mark').val(''):$('#addStudentWork_mark').val(studentWorkInfo.bz);
    }
}

//检索学生就业信息
function searchStudentWorkInfo(canEmpty){
    var studentWorkSearchObject=getStudentWorkSearchObject(canEmpty);
    if(typeof studentWorkSearchObject==='undefined'){
        return;
    }
    $.ajax({
        method : 'get',
        cache : false,
        url : "/employmentStudents",
        data: {
            "studentInfo":JSON.stringify(studentWorkSearchObject)
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
                stuffStudentWorkTable(backjson.data);
            } else {
                stuffStudentWorkTable({});
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得学生就业检索对象
function getStudentWorkSearchObject(canEmpty){
    var levelValue = getNormalSelectValue("level");
    var departmentValue = getNormalSelectValue("department");
    var gradeValue =getNormalSelectValue("grade");
    var majorValue =getNormalSelectValue("major");
    var workType=getNormalSelectValue("workType");
    var studentXzb=$('#studentXzb').val();
    var studentName=$('#studentName').val();

    if(!canEmpty&&levelValue===''&&departmentValue===''&&gradeValue===''&&majorValue===''&&workType===''
    &&studentXzb===''&&studentName===''
    ){
        toastr.warning('检索条件不能为空');
        return;
    }

    var returnObject = new Object();
    returnObject.pycc = levelValue;
    returnObject.szxb = departmentValue;
    returnObject.nj = gradeValue;
    returnObject.zybm = majorValue;
    returnObject.jyxsbm = workType;
    returnObject.xzbname = studentXzb;
    returnObject.xm = studentName;
    return returnObject;
}

//重置检索
function reReloadSearchs(){
    var reObject = new Object();
    reObject.fristSelectId = "#level";
    reObject.actionSelectIds = "#department,#grade,#major";
    reObject.normalSelectIds = "#workType";
    reObject.InputIds = "#studentXzb,#studentName";
    reReloadSearchsWithSelect(reObject);
    searchStudentWorkInfo(true);
}

//预备导入就业信息
function importStudentWork(){
    $.showModal("#importStudentWorkModal",true);
    $("#studentWorkFile,#showFileName").val("");
    $(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
    $("#studentWorkFile").on("change", function(obj) {
        //判断图片格式
        var fileName = $("#studentWorkFile").val();
        var suffixIndex = fileName.lastIndexOf(".");
        var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
        if (suffix != "xls" && suffix !== "xlsx") {
            toastr.warning('请上传Excel类型的文件');
            $("#studentInfoFile").val("");
            return
        }
        $("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
    });
    //下载导入模板
    $('#loadStudentWorkModel').unbind('click');
    $('#loadStudentWorkModel').bind('click', function(e) {
        loadStudentWorkModel();
        e.stopPropagation();
    });

    //检验导入文件
    $('#checkStudentWorkFile').unbind('click');
    $('#checkStudentWorkFile').bind('click', function(e) {
        checkStudentWorkFile();
        e.stopPropagation();
    });

    //确认导入
    $('.confirmImportStudentWork').unbind('click');
    $('.confirmImportStudentWork').bind('click', function(e) {
        confirmImportStudentWork();
        e.stopPropagation();
    });
}

//下载导入模板
function loadStudentWorkModel(){
    LinkageSelectPublic("#importStudentWork_level","#importStudentWork_department","#importStudentWork_grade","#importStudentWork_major");
    $.showModal("#loadStudentWorkModelModal",true);
    $.hideModal("#importStudentWorkModal",false);

    var reObject = new Object();
    reObject.fristSelectId = "#importStudentWork_level";
    reObject.InputIds = "#importStudentWork_studentXzb";
    reObject.actionSelectIds = "#importStudentWork_department,#importStudentWork_grade,#importStudentWork_major";
    reReloadSearchsWithSelect(reObject);

    //行政班focus
    $('#importStudentWork_studentXzb').focus(function(e){
        xzbFocus("importStudentWork_studentXzb");
        e.stopPropagation();
    });

    //提示框取消按钮
    $('.specialCanle').unbind('click');
    $('.specialCanle').bind('click', function(e) {
        $.showModal("#importStudentWorkModal",true);
        $.hideModal("#loadStudentWorkModelModal",false);
        e.stopPropagation();
    });

    //确认下载导入模板
    $('.confirmLoadStudentWorkModelModal').unbind('click');
    $('.confirmLoadStudentWorkModelModal').bind('click', function(e) {
        confirmLoadStudentWorkModelModal();
        e.stopPropagation();
    });
}

//行政班focus
function xzbFocus(id){
    $.showModal("#allClassModal",true);
    $.hideModal("#loadStudentWorkModelModal",false);

    //提示框取消按钮
    $('.specialCanle1').unbind('click');
    $('.specialCanle1').bind('click', function(e) {
        $.showModal("#loadStudentWorkModelModal",true);
        $.hideModal("#allClassModal",false);
        e.stopPropagation();
    });

    xzbReReloadSearchs();
    getXzb();
    xzbBtnBind(id);
    LinkageSelectPublic("#allClass_level","#allClass_department","#allClass_grade","#allClass_major");
}

//行政班Modal重置检索
function xzbReReloadSearchs(){
    var reObject = new Object();
    reObject.fristSelectId = "#allClass_level";
    reObject.InputIds = "#allClass_Name";
    reObject.actionSelectIds = "#allClass_department,#allClass_grade,#allClass_major";
    reReloadSearchsWithSelect(reObject);
    getXzb();
}

//确认选择行政班
function allClassConfirm(id){
    var choosedClass = $("#allClass_administrationClassTable").bootstrapTable("getSelections");
    if(choosedClass.length<=0){
        toastr.warning('暂未选择行政班');
        return;
    }
    $('#'+id).val(choosedClass[0].xzbmc);
    $.showModal("#loadStudentWorkModelModal",true);
    $.hideModal("#allClassModal",false);
}

//行政班modal事件绑定
function xzbBtnBind(id){
    //开始检索
    $('#allClass_StartSearch').unbind('click');
    $('#allClass_StartSearch').bind('click', function(e) {
        getXzb();
        e.stopPropagation();
    });

    //重置检索
    $('#allClass_ReSearch').unbind('click');
    $('#allClass_ReSearch').bind('click', function(e) {
        xzbReReloadSearchs();
        e.stopPropagation();
    });

    //确认选择
    $('#allClass_confirm').unbind('click');
    $('#allClass_confirm').bind('click', function(e) {
        allClassConfirm(id);
        e.stopPropagation();
    });
}

//获取行政班检索条件
function getXzbSearchInfo(){
    var returnObject=new Object();
    returnObject.level=getNormalSelectValue('allClass_level');
    returnObject.department=getNormalSelectValue('allClass_department');
    returnObject.grade=getNormalSelectValue('allClass_grade');
    returnObject.major=getNormalSelectValue('allClass_major');
    returnObject.className=$('#allClass_Name').val();
    return returnObject;
}

//填充行政班表
function stuffAdministrationClassTable(tableInfo){
    $('#allClass_administrationClassTable').bootstrapTable('destroy').bootstrapTable({
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
        showColumns : true,
        onPageChange : function() {
            drawPagination(".administrationClassTableArea", "行政班信息");
        },
        columns: [ {
            field : 'radio',
            radio : true
        },{
            title: '序号',
            align: 'center',
            class:'tableNumberTd',
            formatter: tableNumberMatter
        },  {
            field : 'edu300_ID',
            title: '唯一标识',
            align : 'center',
            sortable: true,
            visible : false
        }, {
            field : 'xzbmc',
            title : '行政班名称',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field : 'pyccmc',
            title : '培养层次',
            align : 'left',
            sortable: true,
            formatter :paramsMatter
        }, {
            field : 'xbmc',
            title : '所属二级学院',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field : 'njmc',
            title : '年级',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field : 'zymc',
            title : '专业',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field : 'batchName',
            title : '批次',
            align : 'left',
            sortable: true,
            formatter :paramsMatter,
            visible : false
        },{
            field : 'xzbbh',
            title : '行政班班号',
            align : 'left',
            sortable: true,
            formatter : paramsMatter,
            visible : false
        },
            {
                field : 'xzbdm',
                title : '行政班代码',
                align : 'left',
                sortable: true,
                formatter : paramsMatter,
                visible : false
            },{
                field : 'xzbbm',
                title : '行政班编码',
                align : 'left',
                sortable: true,
                formatter : paramsMatter,
                visible : false
            }]
    });
    drawPagination(".administrationClassTableArea", "行政班信息");
    drawSearchInput(".administrationClassTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
    changeColumnsStyle(".administrationClassTableArea", "行政班信息");
}

//获取行政班
function getXzb(){
    var serachObject=getXzbSearchInfo();

    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchAdministrationClass",
        data: {
            "userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
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
                stuffAdministrationClassTable(backjson.data);
            } else {
                stuffAdministrationClassTable({});
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得下载模板检索对象
function getloadModelSearchObject(canEmpty){
    var levelValue = getNormalSelectValue("importStudentWork_level");
    var departmentValue = getNormalSelectValue("importStudentWork_department");
    var gradeValue =getNormalSelectValue("importStudentWork_grade");
    var majorValue =getNormalSelectValue("importStudentWork_major");
    var studentXzb=$('#importStudentWork_studentXzb').val();

    if(levelValue===''&&departmentValue===''&&gradeValue===''&&majorValue===''
        &&studentXzb===''
    ){
        toastr.warning('下载模板定位信息不能为空');
        return;
    }

    var returnObject = new Object();
    returnObject.pycc = levelValue;
    returnObject.szxb = departmentValue;
    returnObject.nj = gradeValue;
    returnObject.zybm = majorValue;
    returnObject.xzbname = studentXzb;
    return returnObject;
}

//确认下载导入模板
function confirmLoadStudentWorkModelModal(){
    var loadModelSearchObject=getloadModelSearchObject();
    if(typeof loadModelSearchObject==='undefined'){
        return;
    }

    $.ajax({
        method : 'get',
        cache : false,
        url : "/downloadEmploymentStudentsModalCheck",
        data: {
            "studentInfo":JSON.stringify(loadModelSearchObject)
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
                var url = "/downloadEmploymentStudentsModal";
                var form = $("<form></form>").attr("action", url).attr("method", "post");
                form.append($("<input></input>").attr("type", "hidden").attr("name", "studentInfo").attr("value",JSON.stringify(loadModelSearchObject)));
                form.appendTo('body').submit().remove();
                $.showModal("#importStudentWorkModal",true);
                $.hideModal("#loadStudentWorkModelModal",false);
                toastr.info('文件下载中,请稍后...');
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//检验导入文件
function checkStudentWorkFile(){
    if ($("#studentWorkFile").val() === "") {
        toastr.warning('请选择文件');
        return;
    }

    var formData = new FormData();
    formData.append("file",$('#studentWorkFile')[0].files[0]);

    $.ajax({
        url:'/verifiyImportEmploymentStudentsFile',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
            if(backjosn.result){
                $(".fileLoadingArea").hide();
                if(!backjosn.isExcel){
                    showImportErrorInfo("#importStudentWorkModal","请上传xls或xlsx类型的文件");
                    return
                }
                if(!backjosn.sheetCountPass){
                    showImportErrorInfo("#importStudentWorkModal","上传文件的标签页个数不正确");
                    return
                }
                if(!backjosn.modalPass){
                    showImportErrorInfo("#importStudentWorkModal","模板格式与原始模板不对应");
                    return
                }
                if(!backjosn.haveData){
                    showImportErrorInfo("#importStudentWorkModal","文件暂无数据");
                    return
                }
                if(!backjosn.dataCheck){
                    showImportErrorInfo("#importStudentWorkModal",backjosn.checkTxt);
                    return
                }

                showImportSuccessInfo("#importStudentWorkModal",backjosn.checkTxt);
            }else{
                toastr.warning('操作失败，请重试');
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

//确认导入
function confirmImportStudentWork(){
    if ($("#studentWorkFile").val() === "") {
        toastr.warning('请选择文件');
        return;
    }

    var formData = new FormData();
    formData.append("file",$('#studentInfoFile')[0].files[0]);

    $.ajax({
        url:'/importStudentWorkInfo',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
            $(".fileLoadingArea").hide();
            if(backjosn.code===200){
                var importStudentsWorkInfo=backjosn.data;
                for (var i = 0; i <importStudentsWorkInfo.length; i++) {
                    $("#studentWorkTable").bootstrapTable("updateByUniqueId", {id: importStudentsWorkInfo[i].edu0011_ID, row: importStudentsWorkInfo[i]});
                }
                toastr.success(backjosn.msg);
                toolTipUp(".myTooltip");
                $.hideModal("#importStudentWorkModal");
            }else{
                if(!backjosn.data.isExcel){
                    showImportErrorInfo("#importStudentWorkModal","请上传xls或xlsx类型的文件");
                    return
                }
                if(!backjosn.data.sheetCountPass){
                    showImportErrorInfo("#importStudentWorkModal","上传文件的标签页个数不正确");
                    return
                }
                if(!backjosn.data.modalPass){
                    showImportErrorInfo("#importStudentWorkModal","模板格式与原始模板不对应");
                    return
                }
                if(!backjosn.data.haveData){
                    showImportErrorInfo("#importStudentWorkModal","文件暂无数据");
                    return
                }
                if(!backjosn.data.dataCheck){
                    showImportErrorInfo("#importStudentWorkModal",backjosn.data.checkTxt);
                    return
                }
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
        searchStudentWorkInfo(false);
        e.stopPropagation();
    });

    //重置检索
    $('#reReloadSearchs').unbind('click');
    $('#reReloadSearchs').bind('click', function(e) {
        reReloadSearchs();
        e.stopPropagation();
    });

    //预备添加单个就业信息
    $('#wantAddStudentWork').unbind('click');
    $('#wantAddStudentWork').bind('click', function(e) {
        wantAddStudentWork();
        e.stopPropagation();
    });

    //预备导入就业信息
    $('#importStudentWork').unbind('click');
    $('#importStudentWork').bind('click', function(e) {
        importStudentWork();
        e.stopPropagation();
    });

    //批量删除就业信息
    $('#removeStudentWorks').unbind('click');
    $('#removeStudentWorks').bind('click', function(e) {
        removeStudentWorks();
        e.stopPropagation();
    });
}
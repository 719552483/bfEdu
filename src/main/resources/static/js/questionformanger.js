$(function() {
    $('.isSowIndex').selectMania(); // 初始化下拉框
    btnBind();
    getAllQuestion();
    getUsefulDepartment();
});

//获取所有已发布的问卷
function getAllQuestion() {
    $.ajax({
        method: 'get',
        cache: false,
        url: "/searchAllQuestion",
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
            if (backjson.code==200) {
                stuffAllQuestionTable(backjson.data);
            } else {
                stuffAllQuestionTable({});
                toastr.warning(backjson.msg);
            }
        }
    });
}

var choosend=new Array();
//渲染已发布问卷表
function stuffAllQuestionTable(tableInfo){
    window.releaseNewsEvents = {
        'click #questionDetails' : function(e, value, row, index) {
            questionDetails(row);
        },
        'click #questionRemove' : function(e, value, row, index) {
            removeQuestion(row);
        }
    };

    $('#allQuestionTable').bootstrapTable('destroy').bootstrapTable({
            data : tableInfo,
            pagination : true,
            pageNumber : 1,
            pageSize : 10,
            pageList : [10],
            showToggle : false,
            showFooter : false,
            clickToSelect : true,
            showExport: false,      //是否显示导出
            search : true,
            editable : false,
            striped : true,
            toolbar : '#toolbar',
            showColumns : true,
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
                drawPagination(".allQuestionTableArea", "问卷");
                for (var i = 0; i < choosend.length; i++) {
                    $("#allQuestionTable").bootstrapTable("checkBy", {field:"edu801_ID", values:[choosend[i].edu801_ID]})
                }
            },
            onPostBody: function() {
                toolTipUp(".myTooltip");
            },
            columns: [ {
                field : 'check',
                checkbox : true
            },  {
                field : 'edu801_ID',
                title: '唯一标识',
                align : 'center',
                sortable: true,
                visible : false
            },{
                field : 'title',
                title : '问卷标题',
                align : 'left',
                sortable: true,
                formatter : paramsMatter
            },{
                field : 'permissionsName',
                title : '所属二级学院',
                align : 'left',
                sortable: true,
                formatter :paramsMatter
            }, {
                field : 'personName',
                title : '作者',
                align : 'left',
                sortable: true,
                formatter : paramsMatter
            },{
                field : 'createDate',
                title : '生成时间',
                align : 'left',
                sortable: true,
                formatter : paramsMatter
            },{
                field : 'num',
                title : '答题人数',
                align : 'left',
                sortable: true,
                formatter : numMatter
            }, {
                field : 'action',
                title : '操作',
                align : 'center',
                clickToSelect : false,
                formatter : releaseNewsFormatter,
                events : releaseNewsEvents,
            }]
        });

    function releaseNewsFormatter(value, row, index) {
        return [ '<ul class="toolbar tabletoolbar">'
        + '<li id="questionDetails"><span><img src="images/t02.png" style="width:24px"></span>详情</li>'
        + '<li id="questionRemove"><span><img src="images/t03.png" style="width:24px"></span>删除</li>'
        + '</ul>' ].join('');
    }

    function numMatter(value, row, index) {
        var str='';
        value==0?str='暂时无人答题..':str=value+'人';
        return [ '<div class="myTooltip normalTxt" title="'+str+'">'+str+'</div>' ]
            .join('');
    }

    drawPagination(".allQuestionTableArea", "问卷");
    drawSearchInput(".allQuestionTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
    changeColumnsStyle(".allQuestionTableArea", "问卷");
}

//单选
function onCheck(row){
    if(choosend.length<=0){
        choosend.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosend.length; i++) {
            if(choosend[i].edu801_ID===row.edu801_ID){
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
            if(choosend[i].edu801_ID===row.edu801_ID){
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
        a.push(row[i].edu801_ID);
    }


    for (var i = 0; i < choosend.length; i++) {
        if(a.indexOf(choosend[i].edu801_ID)!==-1){
            choosend.splice(i,1);
            i--;
        }
    }
}

//单个删除问卷
function removeQuestion(row){
    $.showModal("#remindModal",true);
    $(".remindType").html("该问卷");
    $(".remindActionType").html("删除");
    $(".myformtextTipArea").hide();

    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.edu801_ID);
        sendReomveInfo(removeArray);
        e.stopPropagation();
    });
}

//批量删除问卷
function removeQuestions(){
    if (choosend.length === 0) {
        toastr.warning('暂未选择任何问卷');
        return;
    }

    $.showModal("#remindModal",true);
    $(".remindType").html("已选问卷");
    $(".remindActionType").html("删除");
    $(".myformtextTipArea").hide();

    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        for (var i = 0; i < choosend.length; i++) {
            removeArray.push(choosend[i].edu801_ID);
        }
        sendReomveInfo(removeArray);
        e.stopPropagation();
    });
}

//发送删除请求
function sendReomveInfo(removeArray){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/deleteQuestion",
        data: {
            "removeInfo":JSON.stringify(removeArray)
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
                tableRemoveAction("#allQuestionTable", removeArray, ".allQuestionTableArea", "问卷");
                $.hideModal("#remindModal");
                $(".myTooltip").tooltipify();
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//查看问卷详情
function questionDetails(row) {
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchQuestionDetail",
        data: {
            "edu801Id":JSON.stringify(row.edu801_ID)
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
                stuffHaveQuestionDetails(backjson.data);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充问卷详情
function stuffHaveQuestionDetails(info) {
    $(".areaForNewQ_A").empty();
    $("#questionTitle").val(info.title);
    stuffManiaSelectWithDeafult("#department",info.permissions);
    for (var i = 0; i < info.allQuestions.length; i++) {
        stuffNewAandQtoMainArea(info.allQuestions[i],false);
    }
    $(".confrimAddQuestion,#addQ_A,.main_cannottxt,.choosendfsKjImg ").hide();
    mainAreaToggle();
}

//预备新增问卷
function wantAddQuestion(){
    mainAreaToggle();
    var reObject = new Object();
    reObject.InputIds = "#questionTitle";
    reObject.normalSelectIds="#department";
    reReloadSearchsWithSelect(reObject);
    $(".areaForNewQ_A").empty();
    $(".main_cannottxt,.confrimAddQuestion,#addQ_A,.main_cannottxt").show();
}

//确认新增问卷
function confrimAddQuestion(){
    var newQuestionInfo=getNewQuestionInfo();
    if(typeof newQuestionInfo==="undefined"){
        return;
    }

    $.showModal("#remindModal",true);
    $(".remindType").html('问卷');
    $(".remindActionType").html("生成");
    $(".myformtextTipArea").show();

    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        sendNewQuestionInfo(newQuestionInfo);
        e.stopPropagation();
    });
}

//获取新问卷信息
function getNewQuestionInfo() {
    var sendInfo=new Object();
    var title=$("#questionTitle").val();
    var department=getNormalSelectValue("department");
    var departmentTxt=getNormalSelectText("department");
    var currentAll=$('.singleA_Q');
    var choosend = $("#allQuestionTable").bootstrapTable("getData");

    if(title===''){
        toastr.warning("问卷标题不能为空");
        return;
    }

    for (var i = 0; i < choosend.length; i++) {
        if(choosend[i].title===title){
            toastr.warning("问卷标题已存在");
            return;
        }
    }

    if(department===''){
        toastr.warning("二级学院不能为空");
        return;
    }

    if(currentAll.length==0){
        toastr.warning("暂未生成任何问题");
        return;
    }

    var allQuestions=new Array();
    for (let i = 0; i <currentAll.length ; i++) {
        var className=currentAll[i].classList[1];
        var allQuestion=new Object();
        allQuestion.type=$("."+className)[0].attributes[1].nodeValue;
        allQuestion.title=$("."+className).find(".questionTxt")[0].innerText;
        var ckeckOrRaidoInfo=new Array();
        if(allQuestion.type==="radio"||allQuestion.type==="check"){
           var allInput= $("."+className).find(".col4").find("input");
            for (var j = 0; j < allInput.length; j++) {
                var ckeckOrRaidoObject=new Object();
                ckeckOrRaidoObject.checkOrRadioIndex=j;
                ckeckOrRaidoObject.checkOrRadioValue=allInput[j].attributes[3].nodeValue;
                ckeckOrRaidoObject.checkOrRadioText=allInput[j].nextElementSibling.innerText;
                ckeckOrRaidoInfo.push(ckeckOrRaidoObject);
            }
        }
        allQuestion.ckeckOrRaidoInfo=ckeckOrRaidoInfo;
        allQuestions.push(allQuestion);
    }

    sendInfo.title=title;
    sendInfo.createPerson=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
    sendInfo.personName=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
    sendInfo.permissions=department;
    sendInfo.permissionsName=departmentTxt;
    sendInfo.allQuestions=allQuestions;
    return sendInfo;
}

//发送新问卷信息
function sendNewQuestionInfo(newQuestionInfo){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addQuestion",
        data: {
            "questionInfo":JSON.stringify(newQuestionInfo)
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
            getAllQuestion();
            mainAreaToggle();
        },
        success : function(backjson) {
            hideloding();
            if (backjson.code==200) {
                $.hideModal("#remindModal");
                toastr.success('新增问卷成功');
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//预备新增问题
function wantAddQ_A(){
    $("#").val('');
    var reObject = new Object();
    reObject.InputIds = "#add_Q";
    reObject.normalSelectIds = "#add_Type";
    reReloadSearchsWithSelect(reObject);
    $(".answerStuffArea").hide();
    stuffRadioAndCheckTable({});
    $.showModal("#addQ_AModal",true);
}

//改变新增问题类型
function changeAdd_Type(){
    var question=$("#add_Q").val();
    var type=getNormalSelectValue("add_Type");
    if(question===''){
        toastr.warning('问题不能为空');
        return;
    }
    if(type===''){
        $(".answerStuffArea").hide();
        return;
    }
    $(".answerStuffArea").show();
    if(type==='radio'||type==='check'){
        $(".radioAndCheckArea").show();
        $(".rateAndAnswerArea").hide();
        stuffRadioAndCheckTable({});
    }else if(type==='rate'){
        $(".radioAndCheckArea").hide();
        $(".rateAndAnswerArea").show();
        $(".rateAndAnswerTxt").html('评分类型答案最高分5星，最低分1星');
    }else if(type==='answer'){
        $(".radioAndCheckArea").hide();
        $(".rateAndAnswerArea").show();
        $(".rateAndAnswerTxt").html('问答类型答案最多输入300个字符');
    }
}

//渲染多选或单选的选项表格
function stuffRadioAndCheckTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #comfirm': function(e, value, row, index) {
            comfirmAddRadioAndCheck(row);
        },
        'click #remove': function(e, value, row, index) {
            removeRadioAndCheck(row);
        },
        'click #modify': function(e, value, row, index) {
            modifyRadioAndCheck(row);
        },
        'click #cancel': function(e, value, row, index) {
            cancelRadioAndCheck(row);
        }
    };

    $('#radioAndCheckTable').bootstrapTable('destroy').bootstrapTable({
        data: tableInfo,
        pagination: true,
        pageNumber: 1,
        pageSize: 5,
        pageList: [5],
        showToggle: false,
        showFooter: false,
        search: true,
        editable: false,
        striped: true,
        toolbar: '#toolbar',
        showColumns: false,
        onPageChange: function() {
            drawPagination(".radioAndCheckTableArea", "选项");
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {
                field: 'ID',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            },{
                field: 'answerTxt',
                title: '选项',
                align: 'left',
                sortable: true,
                formatter: answerTxtMatter
            },{
                field: 'answerIndex',
                title: '选项序列',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'action',
                title: '操作',
                align: 'center',
                width: '16%',
                formatter: releaseNewsFormatter,
                events: releaseNewsEvents,
            }
        ]
    });

    function releaseNewsFormatter(value, row, index) {
        return [
            '<ul class="toolbar tabletoolbar">'+
            '<li id="comfirm" class="comfirm comfirm'+row.ID+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
            '<li id="cancel" class="cancelBtn cancel'+row.ID+'"><span><img src="images/t03.png" style="width:24px"></span>取消</li>' +
            '<li id="modify" class="modify modify'+row.ID+'"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
            '<li id="remove" class="remove remove'+row.ID+'"><span><img src="images/t03.png" style="width:24px"></span>删除</li>' +
            '</ul>'
        ]
            .join('');
    }

    function answerTxtMatter(value, row, index) {
        return [
            '<input id="answerTxt' + row.ID + '" type="text" class="dfinput UserNameInTable Mydfinput" value="' + value +
            '">' +
            '<span title="'+value+'" class="myTooltip blockName' +row.ID + '">' + value + '</span>'
        ]
            .join('');
    }

    drawPagination(".radioAndCheckTableArea", "选项");
    drawSearchInput(".radioAndCheckTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
}

//预备新增选项
function addRadioOrCheckAnswer() {
    var allInput=$(".UserNameInTable");
    for (var i = 0; i < allInput.length; i++) {
        if(allInput[i].style.display==="block"||allInput[i].style.display==="inline-block"){
            toastr.warning("请先完成上一个操作");
            return;
        }
    }

    var currentData=$("#radioAndCheckTable").bootstrapTable('getData').length;
    var prependEmpty=new Object();
    prependEmpty.ID=guid();
    prependEmpty.answerTxt='';
    prependEmpty.answerIndex=currentData+1;
    $("#radioAndCheckTable").bootstrapTable('prepend', prependEmpty);
    $(".cancelBtn,.comfirm").hide();
    $(".remove,.modify").show();

    $("#answerTxt"+prependEmpty.ID).show().focus();
    $(".comfirm"+prependEmpty.ID).show();
    $(".remove"+prependEmpty.ID).show();
    $(".blockName"+prependEmpty.ID).hide();
    $(".cancelBtn"+prependEmpty.ID).hide();
    $(".modify"+prependEmpty.ID).hide();

    drawPagination(".radioAndCheckTableArea", "选项");
    toolTipUp(".myTooltip");
}

//确认新增多选或单选
function comfirmAddRadioAndCheck(row){
    var value=$("#answerTxt"+row.ID).val();
    if(value===""){
        toastr.warning("选项不能为空");
        return;
    }

    var radioOrCheckValue=$("#radioAndCheckTable").bootstrapTable('getData');
    for (var i = 0; i < radioOrCheckValue.length; i++) {
        if(value===radioOrCheckValue[i].answerTxt){
            toastr.warning('选项 - '+value+' - 存在重复');
            return;
        }
    }

    row.answerTxt=value;

    $("#radioAndCheckTable").bootstrapTable('updateByUniqueId', {
        id: row.ID,
        row: row
    });
    $(".cancelBtn,.comfirm").hide();
    $(".remove,.modify").show();


    $("#answerTxt"+row.ID).hide();
    $(".comfirm"+row.ID).hide();
    $(".cancelBtn"+row.ID).hide();
    $(".remove"+row.ID).show();
    $(".blockName"+row.ID).show();
    $(".modify"+row.ID).show();

    drawPagination(".radioAndCheckTableArea", "选项");
    toolTipUp(".myTooltip");
}

//删除选项
function removeRadioAndCheck(row){
    $("#radioAndCheckTable").bootstrapTable('removeByUniqueId', row.ID);
    $(".cancelBtn,.comfirm").hide();
    $(".remove,.modify").show();
    drawPagination(".radioAndCheckTableArea", "选项");
    toolTipUp(".myTooltip");
}

//修改选项
function modifyRadioAndCheck(row) {
    var allInput=$(".UserNameInTable");
    for (var i = 0; i < allInput.length; i++) {
        if(allInput[i].style.display==="block"||allInput[i].style.display==="inline-block"){
            toastr.warning("请先完成上一个操作");
            return;
        }
    }

    $("#answerTxt"+row.ID).val(row.answerTxt).show().focus();
    $(".blockName"+row.ID).hide();
    $(".comfirm"+row.ID).show();
    $(".cancel"+row.ID).show();
    $(".remove"+row.ID).hide();
    $(".modify"+row.ID).hide();
}

//取消修改
function cancelRadioAndCheck(row) {
    var value=$("#answerTxt"+row.ID).val();
    if(value===""){
        toastr.warning("选项不能为空");
        return;
    }
    row.answerTxt=value;
    $("#radioAndCheckTable").bootstrapTable('updateByUniqueId', {
        id: row.ID,
        row: row
    });

    $("#answerTxt"+row.ID).hide();
    $(".blockName"+row.ID).show();
    $(".comfirm"+row.ID).hide();
    $(".cancel"+row.ID).hide();
    $(".remove"+row.ID).show();
    $(".modify"+row.ID).show();
    drawPagination(".radioAndCheckTableArea", "选项");
    toolTipUp(".myTooltip");
}

//确认新增问题
function confirmAddQ_A(){
    var allInput=$(".UserNameInTable");
    for (var i = 0; i < allInput.length; i++) {
        if(allInput[i].style.display==="block"||allInput[i].style.display==="inline-block"){
            toastr.warning("请先完成上一个操作");
            return;
        }
    }

    var title=$("#add_Q").val();
    var type=getNormalSelectValue("add_Type");
    var radioOrCheckValue=$("#radioAndCheckTable").bootstrapTable('getData');
    if(title===""){
        toastr.warning('问题不能为空');
        return;
    }

    if(type===""){
        toastr.warning('答题类型不能为空');
        return;
    }

    if((type==="radio"||type==="check")&&radioOrCheckValue.length<2){
        toastr.warning('至少需要两个选项');
        return;
    }

    if((type==="radio"||type==="check")&&radioOrCheckValue.length==0){
        toastr.warning('请填充单选/多选题的选项');
        return;
    }
    var NewAandQ=new Object();
    NewAandQ.title=title;
    NewAandQ.type=type;
    NewAandQ.radioOrCheckValue=radioOrCheckValue;

    stuffNewAandQtoMainArea(NewAandQ);
}

//将新增的问答信息填充到主页面
function  stuffNewAandQtoMainArea(NewAandQ,needReverse) {
    if(NewAandQ.type==="radio"){
        drawRadio(NewAandQ,needReverse);
    }else if(NewAandQ.type==="check"){
        drawCheck(NewAandQ,needReverse);
    }else if(NewAandQ.type==="rate"){
        drawRate(NewAandQ);
    }else if(NewAandQ.type==="answer"){
        drawAnswer(NewAandQ);
    }
    $(".main_cannottxt").hide();
    $(".areaForNewQ_A").show();
    $.hideModal("#addQ_AModal");
}

//渲染单选题
function drawRadio(info,needReverse){
    var values;
    typeof info.ckeckOrRaidoInfo==="undefined"?values=info.radioOrCheckValue:values=info.ckeckOrRaidoInfo;
    if(typeof needReverse==="undefined"){
        values=values.reverse();
    }

    var allA_QIndex=$(".singleA_Q").length;

    var str='<div class="singleA_Q singleA_Q'+(allA_QIndex+1)+'" type="'+info.type+'">'+
             '<span class="questionTitle"><cite>Q'+(allA_QIndex+1)+':<img class="choosendfsKjImg tooltipCite removeThisQ" title="删除" src="images/close1.png"></cite><p class="questionTxt">'+info.title+'</p></span>';
    for (var i = 0; i < values.length; i++) {
        if(typeof values[i].ID!=="undefined"){
            str+='<div class="col4 giveBottom overArea">'
                +'<input type="radio" name="Q'+(allA_QIndex+1)+'" class="blue noneOutline" value="'+values[i].ID+'"/><cite class="tooltipCite" title="'+values[i].answerTxt+'">'+values[i].answerTxt
                + '</cite></div>';
        }else{
            str+='<div class="col4 giveBottom overArea">'
                +'<input type="radio" name="Q'+(allA_QIndex+1)+'" class="blue noneOutline" value="'+values[i].checkOrRadioValue+'"/><cite class="tooltipCite" title="'+values[i].checkOrRadioText+'">'+values[i].checkOrRadioText
                + '</cite></div>';
        }
    }

    $(".areaForNewQ_A").append(str+'</div><div class="clear"></div>');
    toolTipUp(".tooltipCite");

    $('.removeThisQ').unbind('click');
    $('.removeThisQ').bind('click', function(e) {
        removeThisQ(e);
        e.stopPropagation();
    });
}

//渲染多选题
function drawCheck(info,needReverse){
    var values;
    typeof info.ckeckOrRaidoInfo==="undefined"?values=info.radioOrCheckValue:values=info.ckeckOrRaidoInfo;
    if(typeof needReverse!=="undefined"){
        values=values.reverse();
    }
    var allA_QIndex=$(".singleA_Q").length;

    var str='<div class="singleA_Q singleA_Q'+(allA_QIndex+1)+'" type="'+info.type+'">'+
        '<span class="questionTitle"><cite>Q'+(allA_QIndex+1)+':<img class="choosendfsKjImg tooltipCite removeThisQ" title="删除" src="images/close1.png"></cite><p class="questionTxt">'+info.title+'</p></span>';
    for (var i = 0; i < values.length; i++) {
        if(typeof values[i].ID!=="undefined"){
            str+='<div class="col4 giveBottom overArea">'
                +'<input type="checkbox" name="Q'+(allA_QIndex+1)+'" class="blue noneOutline" value="'+values[i].ID+'"/><cite class="tooltipCite" title="'+values[i].answerTxt+'">'+values[i].answerTxt
                + '</cite></div>';
        }else{
            str+='<div class="col4 giveBottom overArea">'
                +'<input type="checkbox" name="Q'+(allA_QIndex+1)+'" class="blue noneOutline" value="'+values[i].checkOrRadioValue+'"/><cite class="tooltipCite" title="'+values[i].checkOrRadioText+'">'+values[i].checkOrRadioText
                + '</cite></div>';
        }
    }

    $(".areaForNewQ_A").append(str+'</div><div class="clear"></div>');
    toolTipUp(".tooltipCite");

    $('.removeThisQ').unbind('click');
    $('.removeThisQ').bind('click', function(e) {
        removeThisQ(e);
        e.stopPropagation();
    });
}

//渲染评分题
function drawRate(info){
    var allA_QIndex=$(".singleA_Q").length;
    var rateGuid=guid();

    var str='<div class="singleA_Q singleA_Q'+(allA_QIndex+1)+'" type="'+info.type+'">' +
        '<fieldset class="starability-slot starability-growRotate">' +
        '<span class="questionTitle"><cite>Q'+(allA_QIndex+1)+':<img class="choosendfsKjImg tooltipCite removeThisQ" title="删除" src="images/close1.png"></cite><p class="questionTxt">'+info.title+'</p></span>';
    for (var i = 5; i > 0; i--) {
        str+='<input type="radio" id="rate'+allA_QIndex+i+'" name="'+rateGuid+'" value="'+i+'" />'
            +'<label for="rate'+allA_QIndex+i+'" title="'+i+'分" class="tooltipCite">'+i+'分</label>';
    }
    $(".areaForNewQ_A").append(str+'</fieldset></div><div class="clear"></div>');
    toolTipUp(".tooltipCite");

    $('.removeThisQ').unbind('click');
    $('.removeThisQ').bind('click', function(e) {
        removeThisQ(e);
        e.stopPropagation();
    });
}

//渲染问答题
function drawAnswer(info) {
    var allA_QIndex=$(".singleA_Q").length;
    var answerGuid=guid();

    var str='<div class="singleA_Q singleA_Q'+(allA_QIndex+1)+'" type="'+info.type+'">'
            +'<span class="questionTitle">' +
            '<cite>Q'+(allA_QIndex+1)+':' +
            '<img class="choosendfsKjImg tooltipCite removeThisQ noneOutline" title="删除" src="images/close1.png">' +
            '</cite><p class="questionTxt">'+info.title+'</p>' +
            '</span>'
            +'<textarea style="max-width: 920px;margin-top: -10px;margin-left:25px " maxlength="300"  type="text" class="breakOptionTextArea" id="'+answerGuid+'" placeholder="请回答(最多300个字符,中文2个，英文1个)..." />'
            +'</div>';
    ;
    $(".areaForNewQ_A").append(str);
    toolTipUp(".tooltipCite");

    $('.removeThisQ').unbind('click');
    $('.removeThisQ').bind('click', function(e) {
        removeThisQ(e);
        e.stopPropagation();
    });
}

//删除当前问题
function removeThisQ(eve){
    $.showModal("#remindModal",true);
    $(".remindType").html(eve.currentTarget.parentNode.childNodes[0].nodeValue.substring(0,eve.currentTarget.parentNode.childNodes[0].nodeValue.length-1));
    $(".remindActionType").html("删除");
    $(".myformtextTipArea").hide();

    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeClass=eve.currentTarget.parentNode.parentNode.parentNode.classList[1];
        $("."+removeClass).remove();
        $.hideModal("#remindModal");
        e.stopPropagation();
    });
}

//页面可视主区域控制
function mainAreaToggle(){
    $(".allArea").toggle();
    $(".newArea").toggle();
}

//根据当前角色获取可选系部
function getUsefulDepartment(){
    $.ajax({
        method: 'get',
        cache: false,
        url: "/getUsefulDepartment",
        data: {
            "userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
                var str='';
                if(backjson.data.length===0){
                    toastr.warning("暂无可选系部");
                }else{
                    str='<option value="all">全部学院</option>';
                    for (var i = 0; i < backjson.data.length; i++) {
                        str += '<option value="' + backjson.data[i].edu104_ID + '">' + backjson.data[i].xbmc
                            + '</option>';
                    }
                }
                stuffManiaSelect("#department", str);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//guid_1
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//guid_2
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

//页面按钮时间绑定
function btnBind(){
    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });

    //新增问卷
    $('#addQuestion').unbind('click');
    $('#addQuestion').bind('click', function(e) {
        wantAddQuestion();
        e.stopPropagation();
    });

    //批量删除问卷
    $('#removeQuestions').unbind('click');
    $('#removeQuestions').bind('click', function(e) {
        removeQuestions();
        e.stopPropagation();
    });

    //返回
    $('#returnAll').unbind('click');
    $('#returnAll').bind('click', function(e) {
        mainAreaToggle();
        e.stopPropagation();
    });

    //确认新增问卷
    $('.confrimAddQuestion').unbind('click');
    $('.confrimAddQuestion').bind('click', function(e) {
        confrimAddQuestion();
        e.stopPropagation();
    });

    //预备新增问题
    $('#addQ_A').unbind('click');
    $('#addQ_A').bind('click', function(e) {
        wantAddQ_A();
        e.stopPropagation();
    });

    //预备新增选项
    $('#addRadioOrCheckAnswer').unbind('click');
    $('#addRadioOrCheckAnswer').bind('click', function(e) {
        addRadioOrCheckAnswer();
        e.stopPropagation();
    });

    //问题类型change事件
    $("#add_Type").change(function() {
        changeAdd_Type();
    });

    //确认新增问题
    $('.confirmAddQ_A').unbind('click');
    $('.confirmAddQ_A').bind('click', function(e) {
        confirmAddQ_A();
        e.stopPropagation();
    });

}
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
                toastr.warning(backjson.msg);
            }
        }
    });
}

//渲染已发布问卷表
function stuffAllQuestionTable(tableInfo){

}

//批量删除问卷
function removeQuestions(){
alert(1)
}

//预备新增问卷
function wantAddQuestion(){
    mainAreaToggle();
}

//确认新增问卷
function confrimAddQuestion(){
    // var r = $("input[name='group1']:checked").val();
    // var packageCodeList=new Array();
    // $("input:checkbox[name='group']:checked").each(function(){
    //     packageCodeList.push($(this).val());//向数组中添加元素
    // });
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

    if(radioOrCheckValue.length<2){
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
function  stuffNewAandQtoMainArea(NewAandQ) {
    if(NewAandQ.type==="radio"){
        drawRadio(NewAandQ);
    }
    $(".main_cannottxt").hide();
    $(".areaForNewQ_A").show();
    $.hideModal("#addQ_AModal");
}

//渲染单选题
function drawRadio(info){
    var values=info.radioOrCheckValue;
    var allA_QIndex=$(".singleA_Q").length;

    var str='<div class="singleA_Q" type="'+info.type+'">'+
             '<span class="questionTitle"><cite>Q'+(allA_QIndex+1)+':</cite><p class="questionTxt">'+info.title+'</p></span>';
    for (var i = 0; i < values.length; i++) {
        str+='<div class="col4 giveBottom">'
            +'<input type="radio" name="Q'+(allA_QIndex+1)+'" class="blue noneOutline" value="'+values[i].ID+'"/>'+values[i].answerTxt
            + '</div></div>';
    }

    $(".areaForNewQ_A").append(str+'<div class="clear"></div>');
}

function a(e) {
    // e.checked?e.checked=false:e.checked=true;
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
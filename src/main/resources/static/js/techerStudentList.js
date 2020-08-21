$(function() {
    getMajorTrainingSelectInfo();
    $('.isSowIndex').selectMania(); //初始化下拉框
    btnBind();
});

// 获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
    LinkageSelectPublic("#level","#department","#grade","#major");
    $("#major").change(function() {
        $.ajax({
            method : 'get',
            cache : false,
            url : "/queryCulturePlanCouses",
            data: {
                "culturePlanInfo":JSON.stringify(getNotNullSearchs())
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
                if (backjson.result) {
                    hideloding();
                    dropConfigOption("#major");
                    if(backjson.couserInfo.length===0){
                        toastr.info('暂无培养计划');
                    }
                    stuffMajorTrainingTable(backjson.couserInfo);
                } else {
                    toastr.warning('操作失败，请重试');
                }
            }
        });
    });
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
        toastr.warning('系部不能为空');
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
    returnObject.level = levelValue;
    returnObject.department = departmentValue;
    returnObject.grade = gradeValue;
    returnObject.major = majorValue;
    returnObject.levelTxt = levelText;
    returnObject.departmentTxt = departmentText;
    returnObject.gradeTxt = gradeText;
    returnObject.majorTxt = majorText;
    return returnObject;
}

//初始化页面按钮绑定事件
function btnBind(){

}
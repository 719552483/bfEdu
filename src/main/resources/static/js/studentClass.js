$(function() {
	getSemesterInfo();
	drawScheduleClassesEmptyTable();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	btnBind();
});

//获取学期信息
function getSemesterInfo() {
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getAllXn",
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
			if (backjson.result) {
				if(backjson.termInfo.length===0){
					toastr.warning('暂无学年信息');
					return;
				}
				//初始化下拉框
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.termInfo.length; i++) {
					str += '<option value="' + backjson.termInfo[i].edu400_ID + '">' + backjson.termInfo[i].xnmc + '</option>';
				}
				stuffManiaSelect("#semester", str);
				//changge事件
				$("#semester").change(function() {
					getAllWeeks();
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//根据学年获取周的信息
function getAllWeeks(){
	var semester=getNormalSelectValue("semester");
	if(semester===""){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getTermInfoById",
		data:{
			"termId":semester
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
			if (backjson.result) {
				var configStr='<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.termInfo.zzs; i++) {
					configStr += '<option value="' + (i+1) + '">第'+(i+1)+'周</option>';
				}
				stuffManiaSelect("#weekTime", configStr);
				//changge事件
				$("#weekTime").change(function() {
					getScheduleClassesInfo();
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取课程表信息
function getScheduleClassesInfo() {
	var searchObject=getScheduleSearchInfo();
	if(typeof(searchObject) === "undefined"){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getStudentScheduleInfo",
		data:{
			"searchObject":JSON.stringify(searchObject)
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
				stuffScheduleClassesTable(backjson.data.newInfo);
			} else {
				toastr.warning(backjson.msg);
				drawScheduleClassesEmptyTable();
			}
		}
	});

}

//填充空的课程表
function drawScheduleClassesEmptyTable() {
	var defaultClassPeriod = 12;
	var tableInfo = new Array();
	for (var i = 0; i < defaultClassPeriod; i++) {
		var scheduleClassesInfoObject = new Object();
		scheduleClassesInfoObject.id = i;
		scheduleClassesInfoObject.classPeriod = "第" + (i + 1) + "节";
		scheduleClassesInfoObject.monday = "";
		scheduleClassesInfoObject.tuesday = "";
		scheduleClassesInfoObject.wednesday = "";
		scheduleClassesInfoObject.thursday = "";
		scheduleClassesInfoObject.friday = "";
		scheduleClassesInfoObject.saturday = "";
		scheduleClassesInfoObject.sunday = "";
		tableInfo.push(scheduleClassesInfoObject);
	}
	stuffScheduleClassesTable(tableInfo);
}

//渲染课程表
function stuffScheduleClassesTable(tableInfo) {
	$('#scheduleClassesTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: false,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		striped: true,
		toolbar: '#toolbar',
		showColumns: false,
		columns: [{
			field: 'id',
			title: 'id',
			align: 'left',
			visible: false
		},
			{
				field: 'classPeriod',
				title: '课节数',
				align: 'left',
				width: 10
			}, {
				field: 'monday',
				title: '星期一',
				align: 'left',
				formatter: scheduleFormatter
			}, {
				field: 'tuesday',
				title: '星期二',
				align: 'left',
				formatter: scheduleFormatter,
			}, {
				field: 'wednesday',
				title: '星期三',
				align: 'left',
				formatter: scheduleFormatter
			}, {
				field: 'thursday',
				title: '星期四',
				align: 'left',
				formatter: scheduleFormatter
			}, {
				field: 'friday',
				title: '星期五',
				align: 'left',
				formatter: scheduleFormatter
			}, {
				field: 'saturday',
				title: '星期六',
				align: 'left',
				formatter: scheduleFormatter
			}, {
				field: 'sunday',
				title: '星期日',
				align: 'left',
				formatter: scheduleFormatter
			}
		]
	});
	changeColumnsStyle(".scheduleClassesTableArea", "已排课表");
	drawSearchInput(".scheduleClassesTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");

	//课程区域点击事件
	$('.singleSchedule').unbind('click');
	$('.singleSchedule').bind('click', function(e) {
		singleScheduleAction(e);
		e.stopPropagation();
	});
}

//获得课表检索对象
function getScheduleSearchInfo(){
	var currentUserId= $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	var semester=getNormalSelectValue("semester");
	var weekTime=getNormalSelectValue("weekTime");
	if(semester===""){
		toastr.warning('请选择学年');
		return ;
	}

	if(weekTime===""){
		toastr.warning('请选择周数');
		return ;
	}
	var returnObject=new Object();
	returnObject.currentUserId=currentUserId;
	returnObject.semester=semester;
	returnObject.weekTime=weekTime;
	return returnObject;
}

//课程点击事件
function singleScheduleAction(eve) {
	if (eve.currentTarget.childNodes.length === 0) {
		return;
	}
	getScheduleDetails(eve);
}

//获取课程详情
function getScheduleDetails(eve){
	var classId=eve.currentTarget.attributes[3].nodeValue;;
	var edu108Id=eve.currentTarget.attributes[4].nodeValue;
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getScheduleInfoDetail",
		data:{
			"classId":classId,
			"edu108Id":edu108Id
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
				stuffScheduleDetails(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染课表详情
function stuffScheduleDetails(data){
	$.showModal("#scheduleInfoModal",false);
	stuffPlanDetails(data.planInfo);
}

// 显示详细信息并填充内容
function stuffPlanDetails(row) {
	$('#scheduleInfoModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$("#majorTrainingDetails_code").val(row.kcdm);
	$("#majorTrainingDetails_coursesName").val(row.kcmc);
	$("#majorTrainingDetails_allhours").val(row.zxs);
	$("#majorTrainingDetails_credits").val(row.xf);
	$("#majorTrainingDetails_theoryHours").val(row.llxs);
	$("#majorTrainingDetails_practiceHours").val(row.sjxs);
	$("#majorTrainingDetails_disperseHours").val(row.fsxs);
	$("#majorTrainingDetails_centralizedHours").val(row.jzxs);
	$("#majorTrainingDetails_weekHours").val(row.zhouxs);
	$("#majorTrainingDetails_weekCounts").val(row.zzs);
	$("#majorTrainingDetails_classType").val(row.kclx);
	$("#majorTrainingDetails_coursesNature").val(row.kcxz);
	$("#majorTrainingDetails_testWay").val(row.ksfs);
	$("#majorTrainingDetails_classQuality").val(row.kcsx);
	$("#majorTrainingDetails_feedback").val(row.fkyj);
	$("#majorTrainingDetails_startEndWeek").val(row.qzz);
	$("#majorTrainingDetails_midtermPrcent").val(row.qzcjbl);
	$("#majorTrainingDetails_endtermPrcent").val(row.qmcjbl);
	$("#majorTrainingDetails_isNewClass").val(row.sfxk);
	$("#majorTrainingDetails_calssWay").val(row.skfs);
	$("#majorTrainingDetails_isSchoolBusiness").val(row.xqhz);
	$("#majorTrainingDetails_signatureCourseLevel").val(row.jpkcdj);
	$("#majorTrainingDetails_isKernelClass").val(row.zyhxkc);
	$("#majorTrainingDetails_isTextual").val(row.zyzgkzkc);
	$("#majorTrainingDetails_isCalssTextual").val(row.kztrkc);
	$("#majorTrainingDetails_isTeachingReform").val(row.jxgglxkc);
}
//初始化页面按钮绑定事件
function btnBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}
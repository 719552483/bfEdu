$(function() {
	getSemesterInfo();
	drawScheduleClassesEmptyTable();
	btnBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
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
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//改变授课类型
function getSchedule(){
	var currentType=getNormalSelectValue("crouseType");
	if(currentType===""){
		return;
	}

	if(currentType==="type2"){
		getFsScheduleInfo();
	}else{
		getScheduleClassesInfo();
	}
}

//获取分散课表信息
function getFsScheduleInfo(){
	var searchObject=getScheduleSearchInfo();
	if(typeof(searchObject) === "undefined"){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/searchScatteredClassByTeacher",
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
			$(".scheduleClassesTableArea,.myformtextTipArea").hide();
			$(".fsScheduleAreaTableArea").show();
			if (backjson.code===200) {
				stuffFsSchedule(backjson.data);
				toastr.info(backjson.msg);
			} else {
				drawFsSchedule();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充空的分散课表
function drawFsSchedule(){
	stuffFsSchedule({});
}

//渲染分散课表
function stuffFsSchedule(tableInfo){
	window.releaseNewsEvents = {
		'click #modifyFsSchedule' : function(e, value, row, index) {
			modifyFsSchedule(row,index);
		},
		'click #cancelModify' : function(e, value, row, index) {
			cancelModify(row,index);
		},
		'click #confriModify' : function(e, value, row, index) {
			confriModify(row,index);
		}
	};

	$('#fsScheduleTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: '分散课表导出'  //文件名称
		},
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".fsScheduleAreaTableArea", "已排分散授课课表");
		},
		columns : [
				{
				field : 'edu207_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
				},{
				field : 'courseName',
				title : '课程名称',
				align : 'left',
				formatter :paramsMatter
				}, {
				field : 'week',
				title : '周数',
				align : 'left',
				formatter : paramsMatter
				},{
				field : 'classHours',
				title : '学时',
				align : 'left',
				formatter : paramsMatter
				},{
				field : 'courseContent',
				title : '课程内容',
				align : 'left',
				formatter : courseContentMatter
				},{
				field : 'teachingPlatform',
				title : '授课平台',
				align : 'left',
				formatter : teachingPlatformMatter
				},{
				field : 'action',
				title : '操作',
				align : 'center',
				clickToSelect : false,
				formatter : releaseNewsFormatter,
				events : releaseNewsEvents,
			}]
	});

	function releaseNewsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'+
			'<li id="modifyFsSchedule" class="modifyBtn modifyBtn'+index+'"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'+
			'<li id="confriModify" class="noneStart confrim'+index+'"><span><img src="img/right.png" style="width:24px"></span>确定</li>' +
			'<li id="cancelModify" class="noneStart cancel'+index+'"><span><img src="images/t03.png" style="width:24px"></span>取消</li>' +
			'</ul>' ].join('');
	}

	function courseContentMatter(value, row, index) {
		var stufTxt="";
		var TxtClass="";
		value!=null&&value!==""?TxtClass="blackTxt":TxtClass="normalTxt";
		value!=null&&value!==""?stufTxt=value:stufTxt="暂无";
		return [
			'<div class="myTooltip '+TxtClass+' courseContentTxt'+index+'" title="'+stufTxt+'">'+stufTxt+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modify_courseContent'+index+'" spellcheck="false">'
		]
			.join('');
	}

	function teachingPlatformMatter(value, row, index) {
		var stufTxt="";
		var TxtClass="";
		value!=null&&value!==""?TxtClass="blackTxt":TxtClass="normalTxt";
		value!=null&&value!==""?stufTxt=value:stufTxt="暂无";
		return [
			'<div class="myTooltip '+TxtClass+' teachingPlatformTxt'+index+'" title="'+stufTxt+'">'+stufTxt+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modify_teachingPlatform'+index+'" spellcheck="false">'
		]
			.join('');
	}

	drawPagination(".fsScheduleAreaTableArea", "已排分散授课课表");
	drawSearchInput(".fsScheduleAreaTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".fsScheduleAreaTableArea", "已排分散授课课表");
	btnControl();
}

//预备修改
function modifyFsSchedule(row,index){
   	$(".modifyBtn"+index).hide();
	$(".courseContentTxt"+index).hide();
	$(".teachingPlatformTxt"+index).hide();
	$("#modify_courseContent"+index).show().val(row.courseContent);
	$("#modify_teachingPlatform"+index).show().val(row.teachingPlatform);
	$(".confrim"+index).show();
	$(".cancel"+index).show();
}

//取消修改
function cancelModify(row,index){
	$(".modifyBtn"+index).show();
	$(".courseContentTxt"+index).show();
	$(".teachingPlatformTxt"+index).show();
	$("#modify_courseContent"+index).hide();
	$("#modify_teachingPlatform"+index).hide();
	$(".confrim"+index).hide();
	$(".cancel"+index).hide();
}

//预备确认修改
function confriModify(row,index){
	var newCourseContent=$("#modify_courseContent"+index).val();
	var newTeachingPlatform=$("#modify_teachingPlatform"+index).val();
	if(newCourseContent===""){
		toastr.warning('课程内容不能为空');
		return;
	}
	if(newTeachingPlatform===""){
		toastr.warning('授课平台不能为空');
		return;
	}
	if(getByteLen(newCourseContent)>255){
		toastr.warning('课程内容超过255个字符(中文2个，英文1个)');
		return;
	}
	if(getByteLen(newTeachingPlatform)>255){
		toastr.warning('授课平台超过255个字符(中文2个，英文1个)');
		return;
	}

	row.courseContent=newCourseContent;
	row.teachingPlatform=newTeachingPlatform;
	$("#remindModal").find(".remindType").html("分散授课课程- "+row.courseName);
	$("#remindModal").find(".remindActionType").html("修改");
	$.showModal("#remindModal",true);
	//二次确认修改
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendModifyInfo(row);
		e.stopPropagation();
	});
}

//发送修改信息
function sendModifyInfo(modifyInfo) {
	$.ajax({
		method: 'get',
		cache: false,
		url: "/saveScatteredClass",
		data:{
			"ScatteredClass":JSON.stringify(modifyInfo)
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
				$("#fsScheduleTable").bootstrapTable('updateByUniqueId', {
					id: modifyInfo.edu207_ID,
					row: modifyInfo
				});
				toastr.success(backjson.msg);
				$.hideModal("#remindModal");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充空的集中课程表
function drawScheduleClassesEmptyTable() {
	var defaultClassPeriod = 6;
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

//获取集中课程表信息
function getScheduleClassesInfo() {
	var searchObject=getScheduleSearchInfo();
	if(typeof(searchObject) === "undefined"){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getScheduleInfo",
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
			$(".scheduleClassesTableArea,.myformtextTipArea").show();
			$(".fsScheduleAreaTableArea").hide();
			if (backjson.code===200) {
				stuffScheduleClassesTable(backjson.data.newInfo);
				toastr.info(backjson.msg);
			} else {
				drawScheduleClassesEmptyTable()
				toastr.warning(backjson.msg);
			}
		}
	});

}

//渲染集中课程表
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
	changeColumnsStyle(".scheduleClassesTableArea", "已排集中授课课表");
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

//集中课程点击事件
function singleScheduleAction(eve) {
	if (eve.currentTarget.childNodes.length === 0) {
		return;
	}
	getScheduleDetails(eve);
}

//获取集中课程详情
function getScheduleDetails(eve){
	 var classId=eve.currentTarget.attributes[3].nodeValue;
	 var edu_180Id = eve.currentTarget.attributes[4].nodeValue;
	 var courseType=eve.currentTarget.attributes[5].nodeValue;
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getScheduleInfoDetail",
		data:{
			"classId":classId,
			"courseType":courseType,
			"edu_180Id":edu_180Id
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

//渲染集中课表详情
function stuffScheduleDetails(data){
	$.showModal("#scheduleInfoModal",false);
	stuffStudentInfo(data.studentList);
	stuffPlanDetails(data.planInfo);
}

// 显示集中详细信息并填充内容
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

//填充学生
function stuffStudentInfo(studentList){
	$(".singleRecordsArea").empty();
	for (var i = 0; i < studentList.length; i++) {
		$(".singleRecordsArea").append('<div id="'+studentList[i].edu001_ID+'" class="col5 singleTeacher'+studentList[i].edu001_ID+' singleTeacher recordsImg2">'+studentList[i].xm+'</div>');
	}
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

//初始化页面按钮绑定事件
function btnBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//changge事件
	$("#crouseType,#semester,#weekTime").change(function() {
		getSchedule();
	});
}

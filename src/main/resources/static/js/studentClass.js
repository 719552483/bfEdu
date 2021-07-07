$(function() {
	judgementPWDisModifyFromImplements();
	getSemesterInfo();
	drawScheduleClassesEmptyTable();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	btnBind();
    tab2Actin();
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
				stuffManiaSelect("#semester2", str);
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
		url: "/getYearWeek",
		data:{
			"yearId":semester
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
			if (backjson.code==200) {
				var allWeeks=backjson.data;
				var configStr='<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < allWeeks.length; i++) {
					configStr += '<option value="' + allWeeks[i].id + '">'+ allWeeks[i].value+'</option>';
				}
				stuffManiaSelect("#weekTime", configStr);
			} else {
				toastr.warning(backjson.msg);
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
		url: "/searchScatteredClassByStudent",
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
		'click #deatils' : function(e, value, row, index) {
			getScheduleDetails(row.classId,row.edu108_ID,row.courseType);
		}
	};

	$('#studentfsScheduleTable').bootstrapTable('destroy').bootstrapTable({
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
				formatter : paramsMatter
			},{
				field : 'teachingPlatform',
				title : '授课平台',
				align : 'left',
				formatter : paramsMatter
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
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="queryBtn" id="deatils"><span><img src="img/info.png" style="width:24px"></span>分散授课详情</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".fsScheduleAreaTableArea", "已排分散授课课表");
	drawSearchInput(".fsScheduleAreaTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".fsScheduleAreaTableArea", "已排分散授课课表");
	btnControl();
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
			$(".scheduleClassesTableArea,.myformtextTipArea").show();
			$(".fsScheduleAreaTableArea").hide();
			if (backjson.code===200) {
				stuffScheduleClassesTable(backjson.data.newInfo);
				toastr.info(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
				drawScheduleClassesEmptyTable();
			}
		}
	});

}

//填充空的课程表
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
	var classId=eve.currentTarget.attributes[3].nodeValue;
	var edu108_ID = eve.currentTarget.attributes[4].nodeValue;
	var courseType=eve.currentTarget.attributes[5].nodeValue;
	getScheduleDetails(classId,edu108_ID,courseType);
}

//获取课程详情
function getScheduleDetails(classId,edu108_ID,courseType){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getScheduleInfoDetail",
		data:{
			"classId":classId,
			"courseType":courseType,
			"edu_180Id":edu108_ID
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

var isFirst=true;
//tab2事件绑定
function tab2Actin(){
	if(isFirst){
		isFirst=false;
		stuffScheduleClassesEmptyTable2();
		//changge事件
		$("#crouseType2,#semester2").change(function() {
			var semester=getNormalSelectValue("semester2");
			var currentType=getNormalSelectValue("crouseType2");
			var currentUserId= $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;

			if(semester===""){
				toastr.warning('请选择学年');
				return;
			}

			var searchObject=new Object();
			searchObject.semester=semester;
			searchObject.currentUserId=currentUserId;

			if(currentType==="type2"){
				getFsScheduleInfo2(searchObject);
			}else{
				getScheduleClassesInfo2(searchObject);
			}
		});
	}
}
//获取学年集中课表
function getScheduleClassesInfo2(searchObject){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getStudentYearScheduleInfo",
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
			$(".scheduleClassesTableArea2").show();
			$(".fsScheduleAreaTableArea2").hide();
			if (backjson.code==200) {
				stuffScheduleClassesTable2(backjson.data.newInfo);
				toastr.info(backjson.msg);
			} else {
				stuffScheduleClassesEmptyTable2();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染空的集中课程表2
function stuffScheduleClassesEmptyTable2(){
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
	stuffScheduleClassesTable2(tableInfo);
}

//渲染集中课程表2
function stuffScheduleClassesTable2(tableInfo) {
	$('#scheduleClassesTable2').bootstrapTable('destroy').bootstrapTable({
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
	drawSearchInput(".scheduleClassesTableArea2");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");

	//课程区域点击事件
	$('.singleSchedule').unbind('click');
	$('.singleSchedule').bind('click', function(e) {
		singleScheduleAction(e);
		e.stopPropagation();
	});

}

//获取学年分散课表
function getFsScheduleInfo2(searchObject){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/searchYearScatteredClassByStudent",
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
			$(".scheduleClassesTableArea2").hide();
			$(".fsScheduleAreaTableArea2").show();
			if (backjson.code==200) {
				stuffFsScheduleTable2(backjson.data);
				toastr.info(backjson.msg);
			} else {
				stuffFsScheduleEmptyTable2();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染空的分散课程表2
function stuffFsScheduleEmptyTable2(){
	stuffFsScheduleTable2({});
}

//渲染分散课表
function stuffFsScheduleTable2(tableInfo){
	window.releaseNewsEvents = {
		'click #deatils2' : function(e, value, row, index) {
			getScheduleDetails(row.classId,row.edu108_ID,row.courseType);
		}
	};

	$('#fsScheduleTable2').bootstrapTable('destroy').bootstrapTable({
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
				formatter : paramsMatter
			},{
				field : 'teachingPlatform',
				title : '授课平台',
				align : 'left',
				formatter : paramsMatter
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
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="queryBtn" id="deatils2"><span><img src="img/info.png" style="width:24px"></span>分散授课详情</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".fsScheduleAreaTableArea", "已排分散授课课表");
	drawSearchInput(".fsScheduleAreaTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".fsScheduleAreaTableArea", "已排分散授课课表");
	btnControl();
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
$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	stuffSearchElement();
	drawScheduleClassesEmptyTable();
	btnBind();
});

//填充检索下拉框元素
function stuffSearchElement(){
	getSemesterInfo();
	drawPlanSelect();
	//学年changge事件
	$("#semester").change(function() {
		getAllWeeks();
	});

	//教学点changge事件
	$("#local").change(function() {
		getLocations();
	});
}

//渲染培养计划关系下拉框
function drawPlanSelect() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getJwPublicCodes",
		data: {
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
			if (backjson.result) {
				//层次
				var str = '<option value="seleceConfigTip">请选择</option>';
				var allLevel=backjson.allLevel;
				for (var i = 0; i < allLevel.length; i++) {
					str += '<option value="' + allLevel[i].edu103_ID + '">' + allLevel[i].pyccmc
						+ '</option>';
				}
				stuffManiaSelect("#level", str);

				str = '<option value="seleceConfigTip">请选择</option>';
				//系部
				var allDepartment=backjson.allDepartment;
				for (var i = 0; i < allDepartment.length; i++) {
					str += '<option value="' + allDepartment[i].edu104_ID + '">' + allDepartment[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#department", str);

				//年级
				str = '<option value="seleceConfigTip">请选择</option>';
				var allGrade=backjson.allGrade;
				for (var i = 0; i < allGrade.length; i++) {
					str += '<option value="' + allGrade[i].edu105_ID + '">' + allGrade[i].njmc
						+ '</option>';
				}
				stuffManiaSelect("#grade", str);

				//专业
				str = '<option value="seleceConfigTip">请选择</option>';
				var allMajor=backjson.allMajor;
				for (var i = 0; i < allMajor.length; i++) {
					str += '<option value="' + allMajor[i].edu106_ID + '">' + allMajor[i].zymc
						+ '</option>';
				}
				stuffManiaSelect("#major", str);

				//教学点
				str = '<option value="seleceConfigTip">请选择</option>';
				var AllLocal=backjson.AllLocal;
				for (var i = 0; i < AllLocal.length; i++) {
					str += '<option value="' + AllLocal[i].edu500Id + '">' + AllLocal[i].localName
						+ '</option>';
				}
				stuffManiaSelect("#local", str);
			} else {
				toastr.warning('获取培养计划关系失败，请重试');
			}
		}
	});
}

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
			if (backjson.code===200) {
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

//根据教学点获取教学任务点的信息
function getLocations(){
	var local=getNormalSelectValue("local");
	if(local===""){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getPointBySite",
		data:{
			"SearchObject":local
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
				var configStr='<option value="seleceConfigTip">请选择</option>';
				var location=backjson.data;
				for (var i = 0; i < location.length; i++) {
					configStr += '<option value="' + location[i].edu501Id + '">'+location[i].pointName+'</option>';
				}
				stuffManiaSelect("#location", configStr);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取分散课表信息
function stuffFsArea(tableInfo){
	$(".scheduleClassesTableArea,.myformtextTipArea").hide();
	$(".fsScheduleAreaTableArea").show();
	stuffFsSchedule(tableInfo);
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
function stuffJzScheduleArea(tableInfo) {
	$(".scheduleClassesTableArea,.myformtextTipArea").show();
	$(".fsScheduleAreaTableArea").hide();
	stuffScheduleClassesTable(tableInfo);
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
	$("#scheduleInfoModal").find("#tab1").show();
	$("#scheduleInfoModal").find("#tab2").hide();
	$("#scheduleInfoModal").find(".itab").find("li:eq(0)").find("a").addClass("selected");
	$("#scheduleInfoModal").find(".itab").find("li:eq(1)").find("a").removeClass("selected");
	if (eve.currentTarget.childNodes.length === 0) {
		return;
	}
	var classId=eve.currentTarget.attributes[3].nodeValue;
	var edu_180Id = eve.currentTarget.attributes[4].nodeValue;
	var courseType=eve.currentTarget.attributes[5].nodeValue;
	getScheduleDetails(classId,edu_180Id,courseType);
}

//获取集中课程详情
function getScheduleDetails(classId,edu_180Id,courseType){
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

//显示集中详细信息并填充内容
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

//开始检索
function startSearch(needToastr){
   var searchInfo=getScheduleSearchInfo(needToastr);
   if(typeof searchInfo==="undefined"){
	   return ;
   }
	if(searchInfo.crouseType===""){
		return;
	}

	$.ajax({
		method: 'get',
		cache: false,
		url: "/getSchedule",
		data:{
			"SearchObject":JSON.stringify(searchInfo)
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
				if(searchInfo.crouseType==="type2"){
					stuffFsArea(backjson.data);
				}else{
					stuffJzScheduleArea(backjson.data.newInfo);
				}
				toastr.info(backjson.msg);
			} else {
				if(searchInfo.crouseType==="type2"){
					drawFsSchedule();
				}else{
					drawScheduleClassesEmptyTable();
				}
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得课表检索对象
function getScheduleSearchInfo(needToastr){
	var currentUserId= $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	var semester=getNormalSelectValue("semester");
	var weekTime=getNormalSelectValue("weekTime");
	var crouseType=getNormalSelectValue("crouseType");
	var level=getNormalSelectValue("level");
	var department=getNormalSelectValue("department");
	var grade=getNormalSelectValue("grade");
	var major=getNormalSelectValue("major");
	var local=getNormalSelectValue("local");
	var location=getNormalSelectValue("location");
	var classId=$("#class")[0].attributes[3].nodeValue;
	var teacherId=$("#teacher")[0].attributes[3].nodeValue;
	if(semester===""&&typeof needToastr==="undefined"){
		toastr.warning('请选择学年');
		return ;
	}

	if(weekTime===""&&typeof needToastr==="undefined"){
		toastr.warning('请选择周数');
		return ;
	}

	if(crouseType===""&&typeof needToastr==="undefined"){
		toastr.warning('请选择授课类型');
		return ;
	}

	var returnObject=new Object();
	returnObject.currentUserId=currentUserId;
	returnObject.semester=semester;
	returnObject.weekTime=weekTime;
	returnObject.level=level;
	returnObject.department=department;
	returnObject.grade=grade;
	returnObject.major=major;
	returnObject.local=local;
	returnObject.location=location;
	returnObject.classId=classId;
	returnObject.teacherId=teacherId;
	returnObject.crouseType=crouseType;
	return returnObject;
}

//重置检索
function reSearch(){
	var currentType=getNormalSelectValue("crouseType");
	var reObject = new Object();
	reObject.InputIds = "#class,#teacher";
	reObject.normalSelectIds = "#semester,#weekTime,#crouseType,#level,#department,#grade,#major,#local,#location";
	$("#class").attr("classid","");
	$("#teacher").attr("teacherId","");
	reReloadSearchsWithSelect(reObject);
	if(currentType==="type2"){
		drawFsSchedule();
	}else if(currentType==="type1"){
		drawScheduleClassesEmptyTable();
	}
}

//获取所有行政班
function getClassInfo() {
	var serachObject=new Object();
	serachObject.level="";
	serachObject.department="";
	serachObject.grade="";
	serachObject.major="";
	serachObject.className="";
	// 发送查询所有用户请求
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
				$.showModal("#classModal",true);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充行政班表
function stuffAdministrationClassTable(tableInfo){
	$('#allClassTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		singleSelect: true,// 单选checkbox
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".allClassMangersTableArea", "行政班信息");
		},
		columns : [ {
			field : 'edu300_ID',
			title : 'id',
			align : 'center',
			visible : false
		},{
			field: 'check',
			checkbox: true
		},{
				field : 'pyccmc',
				title : '层次',
				align : 'left',
				formatter : paramsMatter

			},
			{
				field : 'xbmc',
				title : '二级学院',
				align : 'left',
				formatter : paramsMatter

			},
			{
				field : 'njmc',
				title : '年级',
				align : 'left',
				formatter : paramsMatter

			},{
			field : 'zymc',
			title : '专业',
			align : 'left',
			formatter : paramsMatter

		}, {
			field : 'xzbmc',
			title : '班级名称',
			align : 'left',
			formatter : paramsMatter
		}]
	});

	drawPagination(".allClassMangersTableArea", "行政班信息");
	drawSearchInput(".allClassMangersTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//行政班modal按钮事件
function classModalBtnBind(){
	LinkageSelectPublic("#class_level","#class_department","#class_grade","#class_major");
	//开始检索
	$('#allClass_StartSearch').unbind('click');
	$('#allClass_StartSearch').bind('click', function(e) {
		allClassStartSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#allClass_ReSearch').unbind('click');
	$('#allClass_ReSearch').bind('click', function(e) {
		allClassReSearch();
		e.stopPropagation();
	});

	//确认选择行政班
	$('#confirmChoosedClass').unbind('click');
	$('#confirmChoosedClass').bind('click', function(e) {
		confirmChoosedClass();
		e.stopPropagation();
	});
}

//确认选择行政班
function confirmChoosedClass(){
	var choosed=$("#allClassTable").bootstrapTable("getSelections");
	$("#class").val(choosed[0].xzbmc);
	$("#class").attr("classid",choosed[0].edu300_ID);
	$.hideModal("#classModal");
}

//行政班开始检索
function allClassStartSearch(){
	var serachObject=new Object();
	serachObject.level=getNormalSelectValue("class_level");
	serachObject.department=getNormalSelectValue("class_department");
	serachObject.grade=getNormalSelectValue("class_grade");
	serachObject.major=getNormalSelectValue("class_major");
	serachObject.className=$("#class_className").val();
	// 发送查询所有用户请求
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
				toastr.warning(backjson.msg);
				stuffAdministrationClassTable({});
			}
		}
	});
}

//行政班重置检索
function allClassReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#class_className";
	reObject.normalSelectIds = "#class_major,#class_grade,#class_department,#class_level";
	reReloadSearchsWithSelect(reObject);
	getClassInfo();
}

//获取所有教师
function getTeacherInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllTeacher",
		data: {
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
			if (backjson.code === 200) {
				stuffAllClassMangersTable(backjson.data);
				$.showModal("#allClassMangersModal",true);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充负责人表
function stuffAllClassMangersTable(tableInfo){
	$('#allClassMangersTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		singleSelect: true,// 单选checkbox
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".allClassMangersTableArea", "教师信息");
		},
		columns : [ {
			field : 'edu101_ID',
			title : 'id',
			align : 'center',
			visible : false
		},{
			field: 'check',
			checkbox: true
		},{
			field : 'szxbmc',
			title : '二级学院',
			align : 'left',
			formatter : paramsMatter

		}, {
			field : 'xm',
			title : '姓名',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'jzgh',
			title : '教工号',
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
	drawPagination(".allClassMangersTableArea", "教师信息");
	drawSearchInput(".allClassMangersTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//教师modal按钮事件
function teacherModalBtnBind(){
	//开始检索
	$('#allClassMangers_StartSearch').unbind('click');
	$('#allClassMangers_StartSearch').bind('click', function(e) {
		allClassMangersStartSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#allClassMangers_ReSearch').unbind('click');
	$('#allClassMangers_ReSearch').bind('click', function(e) {
		allClassMangersReSearch();
		e.stopPropagation();
	});

	//确认选择行政班
	$('#confirmChoosedTeacher').unbind('click');
	$('#confirmChoosedTeacher').bind('click', function(e) {
		confirmChoosedTeacher();
		e.stopPropagation();
	});
}

//教师开始检索
function allClassMangersStartSearch(){
	var departmentName=$("#departmentName").val();
	var mangerName=$("#mangerName").val();
	var mangerNumber=$("#mangerNumber").val();
	if(departmentName===""&&mangerName===""&&mangerNumber===""){
		toastr.warning('检索条件为空');
		return;
	}
	var serachObject=new Object();
	departmentName===""?serachObject.departmentName="":serachObject.departmentName=departmentName;
	mangerName===""?serachObject.xm="":serachObject.xm=mangerName;
	mangerNumber===""?serachObject.jzgh="":serachObject.jzgh=mangerNumber;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacher",
		data: {
			"SearchCriteria":JSON.stringify(serachObject),
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
			if (backjson.code === 200) {
				stuffAllClassMangersTable(backjson.data);
			} else {
				stuffAllClassMangersTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//教师重置检索
function allClassMangersReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
	getTeacherInfo();
}

//确认选择教师
function confirmChoosedTeacher(){
	var choosed=$("#allClassMangersTable").bootstrapTable("getSelections");
	$("#teacher").val(choosed[0].xm);
	$("#teacher").attr("teacherId",choosed[0].edu101_ID);
	$.hideModal("#allClassMangersModal");
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
		startSearch();
		e.stopPropagation();
	});

	//changge事件
	$("#crouseType").change(function() {
		startSearch();
	});

	//changge事件
	$("#semester,#weekTime").change(function() {
		startSearch(false);
	});

	//重置检索
	$('#reSearch').unbind('click');
	$('#reSearch').bind('click', function(e) {
		reSearch();
		e.stopPropagation();
	});

	//行政班focus
	$('#class').focus(function(e){
		classModalBtnBind();
		getClassInfo();
		e.stopPropagation();
	});

	//教师focus
	$('#teacher').focus(function(e){
		teacherModalBtnBind();
		getTeacherInfo();
		e.stopPropagation();
	});
}

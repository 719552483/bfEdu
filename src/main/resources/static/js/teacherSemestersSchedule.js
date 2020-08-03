$(function() {
	getSelectInfo("#semester", "#weekTime");
	drawScheduleClassesEmptyTable();
	binBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

//获取学期信息
function getSelectInfo(id1, id2) {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	//初始化下拉框
	semesterbackjson = ["2018-2019第一学期", "2018-2019第二学期", "2019-2020第一学期", "019-2020第二学期"];
	var str = '';
	for (var i = 0; i < semesterbackjson.length; i++) {
		str += '<option value="' + semesterbackjson[i] + '">' + semesterbackjson[i] + '</option>';
	}
	$(id1).append(str);
	$(id1).selectMania();
	//changge事件
	$(id1).change(function() {
		$(id1).selectMania('destroy');
		$(id1).find("option").remove();
		$(id1).append(str);
		$(id1).selectMania();
		startSearch();
	});


	weekTimebackjson = ["第一周", "第二周", "第三周", "第四周"];
	var str2 = '';
	for (var i = 0; i < weekTimebackjson.length; i++) {
		str2 += '<option value="' + weekTimebackjson[i] + '">' + weekTimebackjson[i] + '</option>';
	}
	$(id2).append(str2);
	$(id2).selectMania(); //初始化下拉框
	// $(id2).change(function() {
	// 	var reObject=new Object();
	// 	reObject.removeConfigOptionSelect= id2;
	// 	reReloadSearchsWithSelect(reObject);
	// });
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

//填充课程表信息
function getScheduleClassesInfo() {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });

	//tableInfo必须按照 星期一至星期五 
	var tableInfo = {
		"newsInfo": [{
			"id": "id1",
			"classPeriod": "第一节",
			"monday": [{
				"courseId": "scheduleId1",
				"classType": "必修",
				"classTypeId": "1",
				"className": "优秀中华传统文化+美育2(一班)",
				"classID": "0029",
				"teacherName": "张三",
				"teacherID": "5595",
				"classRoom": "北楼203",
				"classRoomID": "5569",
			}, {
				"courseId": "scheduleId2",
				"classType": "必修",
				"classTypeId": "2",
				"className": "优秀中华传统文化+美育2(一班)",
				"classID": "0029",
				"teacherName": "张三",
				"teacherID": "5595",
				"classRoom": "北楼203",
				"classRoomID": "5569",
			}],
			"tuesday": [{
				"courseId": "scheduleId5",
				"classType": "必修",
				"classTypeId": "3",
				"className": "优秀中华传统文化+美育2(一班)",
				"classID": "0029",
				"teacherName": "张三",
				"teacherID": "5595",
				"classRoom": "北楼203",
				"classRoomID": "5569",
			}],
			"wednesday": "",
			"thursday": "",
			"friday": "",
			"saturday": "",
			"sunday": ""
		}, {
			"id": "id2",
			"classPeriod": "第二节",
			"monday": "",
			"tuesday": [{
				"courseId": "scheduleId3",
				"classType": "必修",
				"classTypeId": "4",
				"className": "优秀中华传统文化+美育2(一班)",
				"classID": "0029",
				"teacherName": "张三",
				"teacherID": "5595",
				"classRoom": "北楼203",
				"classRoomID": "5569",
			}, {
				"courseId": "scheduleId4",
				"classType": "必修",
				"classTypeId": "1",
				"className": "优秀中华传统文化+美育2(一班)",
				"classID": "0029",
				"teacherName": "张三",
				"teacherID": "5595",
				"classRoom": "北楼203",
				"classRoomID": "5569",
			}],
			"wednesday": "",
			"thursday": "",
			"friday": "",
			"saturday": "",
			"sunday": ""
		}]
	};
	stuffScheduleClassesTable(tableInfo.newsInfo);
}

//渲染培养计划表格
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

	drawSearchInput();
	changeTableNoRsTip();
	//课程区域点击事件
	$('.singleSchedule').unbind('click');
	$('.singleSchedule').bind('click', function(e) {
		singleScheduleAction(e);
		e.stopPropagation();
	});
}

//课程点击事件
function singleScheduleAction(eve) {
	if (eve.currentTarget.childNodes.length === 0) {
		return;
	}
	getStudentInfo(eve);
}

//获取某课程下的学生信息
function getStudentInfo(eve) {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	//ajax data 组装eve中信息
	var tableInfo = {
		"newsInfo": [{
			"id": "id1",
			"studentNumber": "190633101",
			"studentName": "刘举",
			"sex": "M",
			"level": "全日制",
			"department": "农艺学院",
			"grade": "2019",
			"major": "农产品加工与质量检测",
			"administrationClass": "农产品加工与质量检测191班",
		}, {
			"id": "id2",
			"studentNumber": "190633102",
			"studentName": "刘举",
			"sex": "F",
			"level": "全日制",
			"department": "农艺学院",
			"grade": "2019",
			"major": "农产品加工与质量检测",
			"administrationClass": "农产品加工与质量检测191班",
		}]
	}
	stuffStudentInfoTable(tableInfo);
	$(".courseDetails_Name").html(eve.currentTarget.innerText);
	$(".courseDetailsTip").show();
	showMaskingElement();
}

//填充学生表
function stuffStudentInfoTable(tableInfo) {
	$('#teacher_studentInfoTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo.newsInfo,
		pagination: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10],
		showToggle: false,
		showFooter: false,
		search: true,
		editable: false,
		striped: true,
		toolbar: '#toolbar',
		showColumns: false,
		onPageChange: function() {
			drawPagination(".teacher_studentInfoTableArea", "学生信息");
		},
		columns: [{
				field: 'id',
				title: 'id',
				align: 'center',
				visible: false
			},
			{
				field: 'studentNumber',
				title: '学号',
				formatter: paramsMatter,
				align: 'left'
			}, {
				field: 'studentName',
				title: '姓名',
				align: 'left',
				formatter: paramsMatter,
			}, {
				field: 'sex',
				title: '性别',
				align: 'left',
				formatter: sexMatter,
			}, {
				field: 'level',
				title: '层次',
				align: 'left',
				formatter: paramsMatter,
			}, {
				field: 'department',
				title: '系部',
				align: 'left',
				formatter: paramsMatter,
			}, {
				field: 'grade',
				title: '年级',
				align: 'left',
				formatter: paramsMatter,
			}, {
				field: 'major',
				title: '专业',
				align: 'left',
				formatter: paramsMatter,
			}, {
				field: 'administrationClass',
				title: '行政班',
				align: 'left',
				formatter: paramsMatter,
			}
		]
	});

	function sexMatter(value, row, index) {
		if (row.sex === "M") {
			return [
					'<div class="myTooltip" title="男">男</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip" title="女">女</div>'
				]
				.join('');
		}
	}

	drawPagination(".teacher_studentInfoTableArea", "学生信息");
	drawSearchInput();
	toolTipUp(".myTooltip");
}








//检索课表
function startSearch() {
	var semester = getNormalSelectValue("semester");
	var weekTime = getNormalSelectValue("weekTime");

	if (semester === "seleceConfigTip" && weekTime === "seleceConfigTip") {
		toastr.warning('请输入检索条件');
		return;
	}
	if (semester === "seleceConfigTip") {
		toastr.warning('请选择学期');
		return;
	}

	var searchObject = new Object();
	searchObject.semester = semester;
	if (weekTime !== "seleceConfigTip") {
		searchObject.weekTime = weekTime;
	}
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	getScheduleClassesInfo();
}


function reSearch() {
	var reObject = new Object();
	reObject.fristSelectId = "#semester";
	reObject.normalSelectIds = "#weekTime";
	reReloadSearchsWithSelect(reObject);
	drawScheduleClassesEmptyTable();
}

//初始化页面按钮绑定事件
function binBind() {
	//检索按钮
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#reSearch').unbind('click');
	$('#reSearch').bind('click', function(e) {
		reSearch();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$(".tip").hide();
		showMaskingElement();
		e.stopPropagation();
	});

}

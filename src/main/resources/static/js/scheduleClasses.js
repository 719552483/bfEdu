$(function() {
	getSemesterInfo("#semester");
	$('.isSowIndex').selectMania(); //初始化下拉框
	selectBindChangeAction("#semester", "#department", "#teacher", "#sift", "#courses");
	drawScheduleClassesEmptyTable();
	binBind();
});

//下拉框绑定change事件
function selectBindChangeAction(slect1, slect2, slect3, slect4, slect5) {
	//学期
	$(slect1).change(function() {
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
		var backjson = ["选择1", "选择2", "选择3"];
		drawNextSelect(slect1, backjson, slect2);
	});

	//行政部门
	$(slect2).change(function() {
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
		var backjson = ["选择1", "选择2", "选择3"];
		drawNextSelect(slect2, backjson, slect3);
	});

	//老师
	$(slect3).change(function() {
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
		var backjson = ["选择1", "选择2", "选择3"];
		drawNextSelect(slect3, backjson, slect4);
	});

	//筛选
	$(slect4).change(function() {
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
		var backjson = ["选择1", "选择2", "选择3"];
		drawNextSelect(slect4, backjson, slect5);
	});
}

//获取学期信息
function getSemesterInfo(id) {
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
	backjson = ["2018-2019第一学期", "2018-2019第二学期", "2019-2020第一学期", "019-2020第二学期"];
	var str = '';
	for (var i = 0; i < backjson.length; i++) {
		str += '<option value="' + backjson[i] + '">' + backjson[i] + '</option>';
	}
	$(id).append(str);
	$(id).selectMania(); //初始化下拉框
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

function singleScheduleAction(eve){
	alert(1)
}









//检索课表
function startSearch() {
	var semester = getNormalSelectValue("semester");
	var department = getNormalSelectValue("department");
	var teacher = getNormalSelectValue("teacher");
	var sift = getNormalSelectValue("sift");
	var courses = getNormalSelectValue("courses");
	if (semester === "seleceConfigTip" && department === "seleceConfigTip" && teacher === "seleceConfigTip" && sift ===
		"seleceConfigTip" && courses === "seleceConfigTip") {
		toastr.warning('检索条件不能为空');
		return;
	}

	var searchObject = new Object();
	if (semester !== "seleceConfigTip") {
		searchObject.semester = semester;
	}
	if (department !== "seleceConfigTip") {
		searchObject.department = department;
	}
	if (teacher !== "seleceConfigTip") {
		searchObject.teacher = teacher;
	}
	if (sift !== "seleceConfigTip") {
		searchObject.sift = sift;
	}
	if (courses !== "seleceConfigTip") {
		searchObject.courses = courses;
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

//初始化页面按钮绑定事件
function binBind() {
	//检索按钮
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
}


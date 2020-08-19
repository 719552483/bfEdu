$(function() {
	getSemesterInfo();
	drawScheduleClassesEmptyTable();
	// binBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
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

//获取课程表信息
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
			if (backjson.code===200) {
				// drawStartAndEndWeek(backjson.data);
				stuffScheduleClassesTable(backjson.data.newInfo);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});

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
function binBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}

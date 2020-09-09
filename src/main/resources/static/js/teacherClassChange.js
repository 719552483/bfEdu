var rediesValue;
$(function() {
	getSemesterInfo();
	drawScheduleClassesEmptyTable();
	btnBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	rediesValue=getFromRedis("classPeriod");
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
				stuffManiaSelect("#choose_weekTime", configStr);
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

//获取课程表信息
function getScheduleClassesInfo() {
	var searchObject=getScheduleSearchInfo(false);
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
				stuffScheduleClassesTable(backjson.data.newInfo);
			} else {
				drawScheduleClassesEmptyTable()
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
	showChooseModal(eve);
}

//获取课程详情
function showChooseModal(eve){
	if(rediesValue.length===0){
		toastr.warning('暂无学年');
		return;
	}

	var searchInfo=getScheduleSearchInfo(true);
	if(typeof searchInfo==="undefined"){
		return;
	}
	emptyChoose();
	var titletxt="";
	if(searchInfo.classActionType==="1"){
		titletxt="选择调课信息";
	}else if(searchInfo.classActionType==="2"){
		titletxt="选择串课信息";
	}

	$("#ChooseModal").find(".moadalTitle").html(titletxt);
	stuffKjArae();
	$.showModal("#ChooseModal",true);
	var changInfo=getChangeInfo();
	changInfo.Edu203_ID=eve.currentTarget.childNodes[1].id;
	//提示框取消按钮
	$('.confirmChoose').unbind('click');
	$('.confirmChoose').bind('click', function(e) {
		confirmChoose(changInfo);
		e.stopPropagation();
	});
}

//填充课节下拉框
function stuffKjArae(){
	var str='<option value="seleceConfigTip">请选择</option>'
	for (var i = 0; i < rediesValue.length; i++) {
		str += '<option value="' +rediesValue[i].edu401_ID + '">' + rediesValue[i].kjmc
			+ '</option>';
	}
	stuffManiaSelect("#kj", str);
}

//清空选择域的值
function emptyChoose(){
	var reObject = new Object();
	reObject.normalSelectIds = "#choose_weekTime,#xq,#kj";
	reReloadSearchsWithSelect(reObject);
}

//获得改变的信息
function getChangeInfo(){
	var choose_weekTime=getNormalSelectValue("choose_weekTime");
	var xq=getNormalSelectValue("xq");
	var kj=getNormalSelectValue("kj");
	if(choose_weekTime===""){
		toastr.warning('请选择周数');
		return ;
	}

	if(xq===""){
		toastr.warning('请选择星期');
		return ;
	}

	if(kj===""){
		toastr.warning('请选择课节');
		return ;
	}

	var returnObject=new Object();
	returnObject.week=choose_weekTime;
	returnObject.xqid=xq;
	returnObject.xqmc=getNormalSelectValue("xq");
	returnObject.kjid=kj;
	returnObject.kjmc=getNormalSelectText("kj");
	return returnObject;
}

//确认操作
function confirmChoose(changInfo) {
	$.ajax({
		method: 'get',
		cache: false,
		url: "/changeSchedule",
		data:{
			"changInfo":JSON.stringify(changInfo)
		},
		dataType: 'json',
		beforeSend: function (xhr) {
			requestErrorbeforeSend();
		},
		error: function (textStatus) {
			requestError();
		},
		complete: function (xhr, status) {
			getScheduleClassesInfo();
		},
		success: function (backjson) {
			hideloding();
			if (backjson.code===200) {
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得课表检索对象
function getScheduleSearchInfo(needType){
	var currentUserId= $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	var semester=getNormalSelectValue("semester");
	var weekTime=getNormalSelectValue("weekTime");
	var classActionType=getNormalSelectValue("classActionType");
	if(semester===""){
		toastr.warning('请选择学年');
		return ;
	}

	if(weekTime===""){
		toastr.warning('请选择周数');
		return ;
	}

	if(semester===""){
		toastr.warning('请选择学年');
		return ;
	}

	if(classActionType===""&&needType){
		toastr.warning('请选择操作类型');
		return ;
	}

	var returnObject=new Object();
	returnObject.currentUserId=currentUserId;
	returnObject.semester=semester;
	returnObject.weekTime=weekTime;
	returnObject.classActionType=classActionType;
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
}

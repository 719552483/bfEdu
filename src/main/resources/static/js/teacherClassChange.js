var rediesValue;
$(function() {
	judgementPWDisModifyFromImplements();
	getSemesterInfo();
	drawScheduleClassesEmptyTable();
	btnBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	rediesValue=getFromRedis("classPeriod");
});

/*
tab1
*/
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
				stuffManiaSelect("#fsSemester", str);

				//changge事件
				$("#semester").change(function() {
					getAllWeeks();
				});

				$("#fsSemester").change(function() {
					tab2getAllWeeks();
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
		url: "/getScheduleInfoNew",
		data:{
			"searchObject":JSON.stringify(searchObject),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"jsId":$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id
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

	//默认展示tab1
	$("#ChooseModal").find("#tab1").show();
	$("#ChooseModal").find("#tab2").hide();
	$("#ChooseModal").find(".itab").find("li:eq(0)").find("a").addClass("selected");
	$("#ChooseModal").find(".itab").find("li:eq(1)").find("a").removeClass("selected");

	var searchInfo=getScheduleSearchInfo(true);
	if(typeof searchInfo==="undefined"){
		return;
	}
	emptyChoose();
	var titletxt="";
	if(searchInfo.classActionType==="1"){
		titletxt=eve.currentTarget.childNodes[0].innerText+'-'+eve.currentTarget.childNodes[1].innerText+" 选择调课信息";
	}else if(searchInfo.classActionType==="2"){
		titletxt= eve.currentTarget.childNodes[0].innerText + '-' + eve.currentTarget.childNodes[1].innerText +" 选择串课信息";
	}

	$("#ChooseModal").find(".moadalTitle").html(titletxt);
	stuffKjArae();
	stuffOldWeekArae();
	$.showModal("#ChooseModal",true);


	//确认
	$('.confirmChoose').unbind('click');
	$('.confirmChoose').bind('click', function(e) {
		var changInfo=getChangeInfo(eve);
		if(typeof changInfo==="undefined"){
			return;
		}
		confirmChoose(changInfo);
		e.stopPropagation();
	});
}

//填充调课目标原始周数
function stuffOldWeekArae(){
	var choosendWeek=getNormalSelectValue("weekTime");
	var choosendWeekTxt=getNormalSelectText("weekTime");
	var str= '<option value="' + choosendWeek + '">'+choosendWeekTxt+'</option>';
	stuffManiaSelect("#oldweekTime", str);
}

//填充课节下拉框
function stuffKjArae(){
	var str='<option value="seleceConfigTip">请选择</option>'
	for (var i = 0; i < rediesValue.length; i++) {
		str += '<option value="' +rediesValue[i].edu401_ID + '">' + rediesValue[i].kjmc
			+ '</option>';
	}
	stuffManiaSelect("#kj", str);
	stuffManiaSelect("#oldKj", str);
}

//清空选择域的值
function emptyChoose(){
	var reObject = new Object();
	reObject.normalSelectIds = "#choose_weekTime,#xq,#kj,#oldXq,#oldKj";
	reObject.InputIds = "#choose_teacher";
	$("#choose_teacher").attr("choosendTeacherId","");
	reReloadSearchsWithSelect(reObject);
}

//获得改变的信息
function getChangeInfo(eve){
	var type=0;
	//old
	var oldWeekTime=getNormalSelectValue("oldweekTime"); //必定不为空
	var oldXq=getNormalSelectValue("oldXq");
	var oldKj=getNormalSelectValue("oldKj");

	//new
	var choose_weekTime=getNormalSelectValue("choose_weekTime");
	var xq=getNormalSelectValue("xq");
	var kj=getNormalSelectValue("kj");

	if(oldXq===""&&oldKj===""){
		type=1;
	}

	if(oldXq===""&&oldKj!==""){
		toastr.warning('请选择预备调课目标星期');
		return ;
	}

	if(oldXq!==""&&oldKj===""){
		type=2;
	}

	if(oldXq!==""&&oldKj!==""){
		type=3;
	}

	if(type==1){
		if(choose_weekTime===""){
			toastr.warning('请选择调课新目标周数');
			return ;
		}
	}else if(type==2){
		if(choose_weekTime===""){
			toastr.warning('请选择调课新目标周数');
			return ;
		}
		if(xq===""){
			toastr.warning('请选择调课新目标星期');
			return ;
		}
	}else{
		if(choose_weekTime===""){
			toastr.warning('请选择调课新目标周数');
			return ;
		}
		if(xq===""){
			toastr.warning('请选择调课新目标星期');
			return ;
		}
		if(kj===""){
			toastr.warning('请选择调课新目标课节');
			return ;
		}
	}

	var changInfo=new Object();
	changInfo.week=choose_weekTime;
	changInfo.xqid=xq;
	changInfo.xqmc=getNormalSelectText("xq");
	changInfo.kjid=kj;
	changInfo.kjmc=getNormalSelectText("kj");
	changInfo.Edu101_id=$("#choose_teacher").attr("choosendTeacherId");
	changInfo.teacherName=$("#choose_teacher").val();


	var oldchangInfo=new Object();
	oldchangInfo.week=oldWeekTime;
	oldchangInfo.xqid=oldXq;
	oldchangInfo.xqmc=getNormalSelectText("oldXq");
	oldchangInfo.kjid=oldKj;
	oldchangInfo.kjmc=getNormalSelectText("oldKj");
	oldchangInfo.Edu202_ID=eve.currentTarget.childNodes[1].attributes[2].nodeValue;
	oldchangInfo.Edu101_ID=eve.currentTarget.attributes[1].nodeValue;

	var returnObject=new Object();
	returnObject.type=type;
	returnObject.changInfo=changInfo;//修改后对象信息
	returnObject.oldchangInfo=oldchangInfo;//原对象信息 需要有Edu202_id和Edu101_id
	return returnObject;
}

//确认操作
function confirmChoose(info) {
	$.ajax({
		method: 'get',
		cache: false,
		url: "/changeScheduleNew",
		data:{
			"changInfo":JSON.stringify(info.changInfo),
			"oldchangInfo":JSON.stringify(info.oldchangInfo),
			"type":info.type
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
				$.hideModal("#ChooseModal");
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

//选择教师模态框事件绑定
function teacherModalBtnBind(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
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

	//确认选择
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
	if(choosed.length==0){
		toastr.warning('请选择教师');
		return;
	}
	$("#choose_teacher").val(choosed[0].xm);
	$("#choose_teacher").attr("choosendTeacherId",choosed[0].edu101_ID);
	$.hideModal("#allClassMangersModal",false);
	$.showModal("#ChooseModal",true);
}

//获取所有教师
function getTeacherInfo(actionModal){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllTeachers",
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
				if(typeof actionModal==="undefined"){
					$.hideModal("#ChooseModal",false);
					$.showModal("#allClassMangersModal",true);
				}
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充教师表
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

//初始化页面按钮绑定事件
function btnBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//二级模态框返回按钮事件
	$('.specialCanle').unbind('click');
	$('.specialCanle').bind('click', function(e) {
		$.hideModal("#allClassMangersModal",false);
		$.showModal("#ChooseModal",true);
		e.stopPropagation();
	});

	//教师focus
	$('#choose_teacher').focus(function(e){
		teacherModalBtnBind();
		getTeacherInfo();
		e.stopPropagation();
	});
}

/*
tab1 end
*/


/*
tab2
*/
//判断是否首次加载tab2
function judgmentIsFristTimeLoadTab2(){
	var isFirstShowTab2 = $(".isFirstShowTab2")[0].innerText;
	if (isFirstShowTab2 === "T") {
		$(".isFirstShowTab2").html("F");
		stuffTab2();
		tab2BtnBind();
	}
}

//填充tab2内容
function stuffTab2(){
	drawFsSchedule();
	drawPlanSelect();
}

//获取教学点
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
				//教学点
				var str = '<option value="seleceConfigTip">请选择</option>';
				var AllLocal=backjson.AllLocal;
				for (var i = 0; i < AllLocal.length; i++) {
					str += '<option value="' + AllLocal[i].edu500Id + '">' + AllLocal[i].localName
						+ '</option>';
				}
				stuffManiaSelect("#local", str);
				//教学点changge事件
				$("#local").change(function() {
					getLocations();
				});
			} else {
				toastr.warning('获取教学点失败，请重试');
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

//填充空的分散课表
function drawFsSchedule(){
	stuffFsSchedule({});
}

//渲染分散课表
function stuffFsSchedule(tableInfo){
	window.releaseNewsEvents = {
		'click #chooseNewInfo' : function(e, value, row, index) {
			chooseNewInfo(row);
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
				sortable: true,
				align : 'left',
				formatter :paramsMatter
			}, {
				field : 'week',
				title : '周数',
				sortable: true,
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
				sortable: true,
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'teachingPlatform',
				title : '授课平台',
				sortable: true,
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
		+ '<li class="queryBtn" id="chooseNewInfo"><span><img src="img/info.png" style="width:24px"></span>选择调整目标</li>'
		+ '</ul>' ].join('');
	}


	drawPagination(".fsScheduleAreaTableArea", "已排分散授课课表");
	drawSearchInput(".fsScheduleAreaTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".fsScheduleAreaTableArea", "已排分散授课课表");
}

//预备调整分散学时
function chooseNewInfo(row){
	var semester=getNormalSelectValue("fsSemester");
	if(semester===""){
		toastr.warning('请选择学年');
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
				var type=getNormalSelectValue('fsClassActionType');
				if(type==='1'){
					$("#fsChooseModal").find('.moadalTitle').html(row.courseName+' 选择调课信息');
				}else{
					$("#fsChooseModal").find('.moadalTitle').html(row.courseName+' 选择串课信息');
				}

				var choosendWeek=row.week;
				var str= '<option value="' + choosendWeek + '">第'+choosendWeek+'周</option>';
				stuffManiaSelect("#fsOldweekTime", str);

				var configStr='<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.termInfo.zzs; i++) {
					configStr += '<option value="' + (i+1) + '">第'+(i+1)+'周</option>';
				}
				stuffManiaSelect("#fsNewWeekTime", configStr);

				$("#fsOldHours").val(row.classHours);

				$.showModal('#fsChooseModal',true);

				// 验证调整分散学时
				$('.confirmfsChoose').unbind('click');
				$('.confirmfsChoose').bind('click', function(e) {
					confirmfsChoose(row);
					e.stopPropagation();
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 验证调整分散学时
function confirmfsChoose(row){
	var newInfo=getNewFsInfo(row);
	if(typeof newInfo==='undefined'){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/changeScheduleScatteredCheck",
		data:{
			"edu207Id":row.edu207_ID,
			"week":newInfo.weekTime.toString()
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
				sendChangeFsInfo(row,newInfo);
			} else {
				$.hideModal("#fsChooseModal",false);
				$.showModal("#remindModal",true);

				// 分散学时调整二次确认
				$('.confirmRemind').unbind('click');
				$('.confirmRemind').bind('click', function(e) {
					sendChangeFsInfo(row,newInfo);
					e.stopPropagation();
				});
			}
		}
	});
}

// 确认调整分散学时
function sendChangeFsInfo(row,newInfo){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/changeScheduleScattered",
		data:{
			"edu207Id":row.edu207_ID,
			"week":newInfo.weekTime.toString(),
			"count":newInfo.xs.toString()
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
				row.week=newInfo.weekTime;
				if(parseInt(row.classHours)==parseInt(newInfo.xs)){
					$("#fsScheduleTable").bootstrapTable('removeByUniqueId', row.edu207_ID);
				}else{
					row.classHours=parseInt(row.classHours)-parseInt(newInfo.xs);
					$('#fsScheduleTable').bootstrapTable('updateByUniqueId', {
						id: row.edu207_ID,
						row: row
					});
				}
				$.hideModal();
				toastr.success('课时调整成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取新的分散信息
function getNewFsInfo(row){
	var weekTime=getNormalSelectValue('fsNewWeekTime');
	var xs=$('#fsNewHours').val();
	if(weekTime===''){
		toastr.warning('请选调整新周数');
		return;
	}

	if(row.week===weekTime){
		toastr.warning('调整周数与原周数一致');
		return;
	}

	if(parseInt(xs)==0){
		toastr.warning('请选择调整学时');
		return;
	}

	if(parseInt(xs)>row.classHours){
		toastr.warning('调整学时不能大于旧学时');
		return;
	}

	var retrunObject=new Object();
	retrunObject.weekTime=weekTime;
	retrunObject.xs=xs;
	return retrunObject;
}

//根据学年获取周的信息
function tab2getAllWeeks(){
	var semester=getNormalSelectValue("fsSemester");
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
				stuffManiaSelect("#fsWeekTime", configStr);
				//changge事件
				$("#fsWeekTime").change(function() {
					getFsClassesInfo();
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取分散课表信息
function getFsClassesInfo(){
	var searchInfo=getFsSearchInfo();
	if(typeof searchInfo==="undefined"){
		return ;
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
				stuffFsSchedule(backjson.data);
			}else{
				drawFsSchedule();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取分散检索条件
function getFsSearchInfo(){
	var currentUserId= $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	var semester=getNormalSelectValue("fsSemester");
	var weekTime=getNormalSelectValue("fsWeekTime");
	var local=getNormalSelectValue("local");
	var location=getNormalSelectValue("location");

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
	returnObject.local=local;
	returnObject.location=location;
	returnObject.crouseType='type2';
	returnObject.level='';
	returnObject.department='';
	returnObject.grade='';
	returnObject.major='';
	returnObject.classId='';
	returnObject.teacherId='';
	return returnObject;
}

//重置检索
function reSearchFs() {
	var reObject = new Object();
	reObject.normalSelectIds = "#fsSemester,#fsWeekTime,#local,#location,#fsClassActionType";
	reReloadSearchsWithSelect(reObject);
	drawFsSchedule();
}

//tab2按钮事件绑定
function tab2BtnBind(){
	// 开始检索
	$('#startSearchFs').unbind('click');
	$('#startSearchFs').bind('click', function(e) {
		getFsClassesInfo();
		e.stopPropagation();
	});

	// 重置检索
	$('#reSearchFs').unbind('click');
	$('#reSearchFs').bind('click', function(e) {
		reSearchFs();
		e.stopPropagation();
	});
}

/*
tab2 end
*/
var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getTaskSelectInfo();
	drawWaitTaskEmptyTable();
	btnControl();
	binBind();
	$("input[type='number']").inputSpinner();
	deafultSearch();
});

//初始化检索
function deafultSearch(){
	var returnObject = new Object();
	returnObject.level = "";
	returnObject.department = "";
	returnObject.grade = "";
	returnObject.major = "";
	returnObject.levelTxt = "";
	returnObject.departmentTxt = "";
	returnObject.gradeTxt = "";
	returnObject.majorTxt = "";
	returnObject.kcxz="";
	returnObject.kcxzTxt="";

	$.ajax({
		method : 'get',
		cache : false,
		url : "/getTaskByCulturePlanByUser",
		data: {
			"culturePlanInfo":JSON.stringify(returnObject),
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
			if (backjson.code===200) {
				toastr.info(backjson.msg);
				stuffWaitTaskTable(backjson.data);
			} else {
				drawWaitTaskEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取-专业培养计划- 有逻辑关系select信息
function getTaskSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		if(getNormalSelectValue("major")===""){
			return;
		}
		startSearch();
	});

	$("#kcxz").change(function() {
		if(getNormalSelectValue("kcxz")===""){
			return;
		}
		startSearch();
	});
}

//渲染空待排课程表
function drawWaitTaskEmptyTable(){
	stuffWaitTaskTable({});
}

//渲染任务书表格
function stuffWaitTaskTable(tableInfo){
		$('#WaitTaskTable').bootstrapTable('destroy').bootstrapTable({
			data: tableInfo,
			pagination: true,
			pageNumber: 1,
			pageSize : 10,
			pageList : [ 10 ],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
		    sidePagination: "client",
			toolbar: '#toolbar',
			showColumns: true,
			onPageChange: function() {
				drawPagination(".WaitTaskTableArea", "教学任务书");
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [
				{
					field : 'radio',
					radio : true
				},{
					field: 'edu201_ID',
					title: '唯一标识',
					align: 'center',
					sortable: true,
					visible: false
				},
				{
					field: 'pyjhmc',
					title: '培养计划名称',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				},
				{
					field: 'className',
					title: '班级名称',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, 	{
					field: 'kcmc',
					title: '课程',
					align: 'left',
					sortable: true,
					formatter: paramsMatter

				},{
					field: 'lsmc',
					title: '任课老师',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				},{
					field: 'zylsmc',
					title: '助教',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				},{
					field: 'sfxylcj',
					title: '是否需要录成绩',
					align: 'center',
					width:'15%',
					sortable: true,
					formatter: sfxylcjMatter
				},{
					field: 'kkbm',
					title: '开课部门',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				},	{
					field: 'pkbm',
					title: '排课部门',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}
			]
		});
		
		function sfxylcjMatter(value, row, index) {
			if (row.sfxylcj==="T") {
				return [ '<div class="myTooltip" title="需要录成绩"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
						.join('');
			} else{
				return [ '<div class="myTooltip" title="不需要录成绩"><i class="iconfont icon-chacha normalTxt"></i></div>' ]
						.join('');
			}
		}

		drawPagination(".WaitTaskTableArea", "教学任务书");
		changeColumnsStyle(".WaitTaskTableArea", "教学任务书");
		drawSearchInput(".WaitTaskTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
}

//开始排课
function startSchedule(){
	$(".isRe").html('F');
	$("#rePutInfo").hide();
	var culturePlanInfo=getNotNullSearchs();
	if(typeof culturePlanInfo ==='undefined'){
		return;
	}
	var choosedTask=$('#WaitTaskTable').bootstrapTable('getSelections');
	if(choosedTask.length===0){
		toastr.warning('请选择排课课程');
		return;
	}
	//返回按钮事件绑定
	$('#returnStartSchedule').unbind('click');
	$('#returnStartSchedule').bind('click', function(e) {
		returnStartSchedule();
		e.stopPropagation();
	});
	showStartScheduleArea(culturePlanInfo,choosedTask,1);
}

//根据类型  展示开始排课区域
function  showStartScheduleArea(culturePlanInfo,choosedTask,showType){
	if(showType==1){
		dealScheduleClassInfo(culturePlanInfo,choosedTask);
	}else{
		dealPuttedScheduleClassInfo();
	}
}

//处理未排课程信息
function dealScheduleClassInfo(culturePlanInfo,choosedTask){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/dealScheduleClassInfo",
		data:{
			"edu103Id":culturePlanInfo.level
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
				if(backjson.kjInfo.length<=0){
					toastr.warning('暂无默认课节信息');
					return;
				}
				if(backjson.jxdInfo.length<=0){
					toastr.warning('暂无可选教学点场地信息');
					return;
				}

				var isZero=true;
				choosedTask[0].jzxs===0?isZero=true:isZero=false;
				drawJzXueDomArea(isZero,choosedTask,backjson.jxdInfo,backjson.termInfo[0],backjson.kjInfo);

				isZero=true;
				choosedTask[0].fsxs===0?isZero=true:isZero=false;
				drawFsXueDomArea(isZero);

				judgementStepDisplay(choosedTask[0].jzxs,choosedTask[0].fsxs);

				destoryLastStuff();
				stuffTitle(culturePlanInfo,choosedTask[0]);
				scheduleSingleClassBtnBind();
				controlScheduleArea();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//处理已排但未拍完课程信息
function dealPuttedScheduleClassInfo(){
	//返回按钮事件绑定
	$('#returnStartSchedule').unbind('click');
	$('#returnStartSchedule').bind('click', function(e) {
		returnStartSchedule(1);
		e.stopPropagation();
	});
	$(".scheduleClassesMainArea,.puttedScheduleArea").hide();
	$(".scheduleSingleClassArea").show();
}

//根据集中分散学时判断按钮的展示
function judgementStepDisplay(jzxs,fsxs){
	$(".configedFs_lastStep").show();
	//集中学时为0 分散学时不为0
	if(jzxs==0&&fsxs!=0){
		$(".configedFs_lastStep").hide();
	}
}

//集中学时区域dom渲染
function drawJzXueDomArea(isZero,choosedTask,jxdInfo,termInfo,kjInfo,type){
	var configSelectTxt='<option value="seleceConfigTip">请选择</option>';
	stuffTermArae(choosedTask,configSelectTxt,type);
	stuffJxdArae(jxdInfo,configSelectTxt);
	drawStartAndEndWeek(termInfo);
	stuffKjArae(kjInfo,configSelectTxt,configSelectTxt);
	if(isZero){
		$(".itab").find("li:eq(1)").find("a").trigger('click');
		$(".scheduleSingleClassArea").find(".itab").find("li:eq(0)").hide();
		$(".scheduleSingleClassArea").find("#tab2").find(".cannottxt").hide();
		$(".scheduleSingleClassArea").find("#tab2").find(".fsMainArea").show();

		var yearId='';
		var yearName=''
		if(type===2){
			$(".fsPuttedHousr").html(0);
			$(".fsWaitHousr").html(choosedTask.fsxs);
			yearId=choosedTask.xnid;
			yearName=choosedTask.xn;
		}else{
			$(".fsPuttedHousr").html(0);
			$(".fsWaitHousr").html(choosedTask[0].fsxs);
			yearId=choosedTask[0].xnid;
			yearName=choosedTask[0].xn;
		}



		$.ajax({
			method: 'get',
			cache: false,
			url: "/getYearWeek",
			data:{
				"yearId":yearId
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
					drawStartAndEndWeek(backjson.data);
					$(".choosendTerm").html(yearName+"学年");
				} else {
					toastr.warning(backjson.msg);
				}
			}
		});
	}else{
		$(".itab").find("li:eq(0)").find("a").trigger('click');

		$(".scheduleSingleClassArea").find(".itab").find("li:eq(0)").show();
		$(".scheduleSingleClassArea").find("#tab2").find(".cannottxt").show();
		$(".scheduleSingleClassArea").find("#tab2").find(".fsMainArea").hide();
	}
}

//分散学时区域dom渲染
function drawFsXueDomArea(isZero){
	if(isZero){
		$(".scheduleSingleClassArea").find(".itab").find("li:eq(1)").hide();
	}else{
		$(".scheduleSingleClassArea").find(".itab").find("li:eq(1)").show();
	}
	$(".fskjRsArea").find(".singlefsKj").empty();
	$(".fskjRsArea").hide();
}

//填充排课区域的title
function stuffTitle(culturePlanInfo,choosedTask) {
	$(".scheduleInfoTxt,.scheduleRsTitle").html(culturePlanInfo.levelTxt + " "
		+ culturePlanInfo.departmentTxt + " "
		+ culturePlanInfo.gradeTxt + " "
		+ culturePlanInfo.majorTxt + " "
		+ choosedTask.kcmc +
		"(总学时：" + choosedTask.zxs + "课时  集中学时：" + choosedTask.jzxs + "课时  分散学时：" + choosedTask.fsxs + "课时)");
	$(".jzxsSpan").html(choosedTask.jzxs);
	$(".fsxsSpan").html(choosedTask.fsxs);
	$(".cyclePuttedHousr").html(0);
	$(".cycleWaitHousr").html(choosedTask.jzxs);
}

//初始化课节等下拉框
function destoryLastStuff(){
	var reObject = new Object();
	reObject.normalSelectIds = "#term,#startWeek,#endWeek,#xq,#kj,#skdd";
	reReloadSearchsWithSelect(reObject);
	$(".choosendTerm,.choosendStartWeek,.choosendEndWeek,.choosendLoaction").html("");
	$(".choosendCycleArea,.singleCycle,.choosendfsKjArea").empty();
	$(".kjRsArea,.lastCycleArea ").hide();
	$(".loationInfoTxt").hide();
}

//填充学年下拉框
function stuffTermArae(termInfo,str,type){
	if(typeof type==="undefined"){
		for (var i = 0; i < termInfo.length; i++) {
			str += '<option value="' + termInfo[i].xnid + '">' + termInfo[i].xn
				+ '</option>';
		}
	}else{
		str += '<option value="' + termInfo.xnid + '">' + termInfo.xn
			+ '</option>';
	}
	stuffManiaSelect("#term", str);

	str='';
	if(typeof type==="undefined"){
		var allTeacher=termInfo[0].ls.split(",");
		var allTeacherName=termInfo[0].lsmc.split(",");
		for (var i = 0; i < allTeacher.length; i++) {
			str += '<option value="' + allTeacher[i] + '">' + allTeacherName[i]
				+ '</option>';
		}
	}else{
		var allTeacher=termInfo.ls.split(",");
		var allTeacherName=termInfo.lsmc.split(",");
		for (var i = 0; i < allTeacher.length; i++) {
			str += '<option value="' + allTeacher[i] + '">' + allTeacherName[i]
				+ '</option>';
		}
	}

	stuffManiaSelect("#teacher", str);
}

//填充教学点下拉框
function stuffJxdArae(jxdInfo,str){
	for (var i = 0; i < jxdInfo.length; i++) {
		str += '<option value="' +jxdInfo[i].edu500Id + '">' + jxdInfo[i].localName
			+ '</option>';
	}
	stuffManiaSelect("#jxd", str);

	$("#jxd").change(function() {
		if(getNormalSelectValue("jxd")==""){
			return;
		}
		$.ajax({
			method : 'get',
			cache : false,
			url : "/getPointBySite",
			data: {
				"SearchObject":getNormalSelectValue("jxd")
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
				var configSelectTxt='<option value="seleceConfigTip">请选择</option>';
				if (backjson.code===500) {
					toastr.warning(backjson.msg);
					configSelectTxt='<option value="seleceConfigTip">暂无选择</option>'
				}
				stuffJxrud(backjson.data,configSelectTxt);
			}
		});
	});
}

//填充教学任务点
function  stuffJxrud(jxrudInfo,str){
	if(typeof jxrudInfo==="undefined"){
		stuffManiaSelect("#skdd", str);
	}else{
		for (var i = 0; i < jxrudInfo.length; i++) {
			str += '<option value="' +jxrudInfo[i].edu501Id + '">' + jxrudInfo[i].pointName
				+ '</option>';
		}
		stuffManiaSelect("#skdd", str);
	}
}

//填充课节下拉框
function stuffKjArae(kjInfo,str){
	for (var i = 0; i < kjInfo.length; i++) {
		str += '<option value="' +kjInfo[i].edu401_ID + '">' + kjInfo[i].kjmc
			+ '</option>';
	}
	stuffManiaSelect("#kj", str);
}

//单个课程排课区域返回按钮
function returnStartSchedule(type){
	controlScheduleArea(type);
}

//待排  单个课程排课区域按钮事件绑定
function scheduleSingleClassBtnBind(){
	//tab1的下一步
	$('.configedJz').unbind('click');
	$('.configedJz').bind('click', function(e) {
		configedJz();
		e.stopPropagation();
	});

	//tab2的上一步
	$('.configedFs_lastStep').unbind('click');
	$('.configedFs_lastStep').bind('click', function(e) {
		configedFslastStep();
		e.stopPropagation();
	});

	//tab2的下一步
	$('.configedFs_NextStep').unbind('click');
	$('.configedFs_NextStep').bind('click', function(e) {
		configedFsNextStep();
		e.stopPropagation();
	});

	//tab3的下一步
	$('.configedAll_lastStep').unbind('click');
	$('.configedAll_lastStep').bind('click', function(e) {
		configedAlllastStep();
		e.stopPropagation();
	});

	//确认排课按钮
	$('#confirm').unbind('click');
	$('#confirm').bind('click', function(e) {
		confirmPk();
		e.stopPropagation();
	});

	//为学年绑定change事件 重载开始结束周信息
	$("#term").change(function(e) {
		redrawStartAndEndWeek();
		e.stopPropagation();
	});

	//为开始周绑定change事件
	$("#endWeek").change(function(e) {
		weekChange();
		e.stopPropagation();
	});

	//为授课地点绑定change事件
	$("#skdd").change(function(e) {
		skddChange();
		e.stopPropagation();
	});

	$("#kj").change(function(e) {
		KjBtnschange();
		e.stopPropagation();
	});

	$('#addnewKj').unbind('click');
	$('#addnewKj').bind('click', function(e) {
		AddnewKj();
		e.stopPropagation();
	});

	$('#addCoursePlan').unbind('click');
	$('#addCoursePlan').bind('click', function(e) {
		addCoursePlan();
		e.stopPropagation();
	});

	$('#addNewFsKj').unbind('click');
	$('#addNewFsKj').bind('click', function(e) {
		addNewFsKj();
		e.stopPropagation();
	});
}

//tab1的下一步
function configedJz(){
	if($(".fsxsSpan")[0].innerText!=="0"){
		var PKInfo=getJzPKInfo();
		if(typeof PKInfo ==='undefined'){
			return;
		}

		var scheduleInfo=scheduleDetailInfo();
		if(scheduleInfo.length==0){
			return;
		}

		var checkJzPkRs=checkJzPk();
		if(!checkJzPkRs){
			return;
		}
		$(".itab").find("li:eq(1)").find("a").trigger('click');
	}else{
		$(".itab").find("li:eq(2)").find("a").trigger('click');
	}

	if($(".singlefsKj").find(".choosendfsKjInfo").length==0){
		$(".fsPuttedHousr").html(0);
		$(".fsWaitHousr").html($('.fsxsSpan ')[0].innerText);
	}
}

//tab2的上一步
function configedFslastStep(){
	$(".itab").find("li:eq(0)").find("a").trigger('click');
}

//tab2的下一步
function configedFsNextStep(){
	var checkSFxsRs=checkSFxs();
	if(!checkSFxsRs){
		return;
	}
	$(".itab").find("li:eq(2)").find("a").trigger('click');
	var currentJzxs=parseInt($(".jzxsSpan ")[0].innerText);
	if(currentJzxs==0){
		$(".scheduleSingleClassArea").find("#tab3").find('.cannottxt').hide();
		$(".scheduleSingleClassArea").find("#tab3").find('.rsArea').show();
	}
}

//tab3的上一步
function configedAlllastStep(rowInfo){
	var isRe=$(".isRe")[0].innerText;
	if(isRe==="F"){
		var choosendClass= $("#WaitTaskTable").bootstrapTable("getSelections")[0];
		if(choosendClass.fsxs!=0){
			$(".itab").find("li:eq(1)").find("a").trigger('click');
		}else{
			$(".itab").find("li:eq(0)").find("a").trigger('click');
		}
	}else{
		if(rowInfo.fsxs!=0){
			$(".itab").find("li:eq(1)").find("a").trigger('click');
		}else{
			$(".itab").find("li:eq(0)").find("a").trigger('click');
		}
	}
}

//检查是否排完集中并且正确
function checkJzPK(){
	var term=getNormalSelectValue("term");
	var jzsx=parseInt($(".jzxsSpan")[0].innerText);
	isNaN(jzsx)?jzsx=0:jzsx=jzsx;
	if(term===""&&jzsx!=0){
		toastr.warning('请选择学年');
		return;
	}
	$("#tab2").find(".cannottxt").hide();
	$("#tab2").find(".fsMainArea").show();
	// var choosendClass= $("#WaitTaskTable").bootstrapTable("getSelections")[0];
	// var currentWaitJzxs;
	// if(choosendClass.jzxs!=0){
		// currentWaitJzxs=parseInt($(".cycleWaitHousr ")[0].innerText);
		// if(currentWaitJzxs>0){
		// 	$("#tab2").find(".cannottxt").show();
		// 	$("#tab2").find(".fsMainArea").hide();
		// 	toastr.warning('集中学时剩余'+currentWaitJzxs+'课时未排，请先排完集中学时');
		// }else{
		// 	$("#tab2").find(".cannottxt").hide();
		// 	$("#tab2").find(".fsMainArea").show();
		// }
	// }
}

//检查是否起码排完集中
function  checkAllPK(){
	if(isRe=false){
		var PKInfo=getJzPKInfo(false);
		var scheduleInfo=scheduleDetailInfo(false);
		if(typeof PKInfo ==='undefined'||scheduleInfo.length==0){
			$("#tab3").find(".cannottxt").show();
			$("#tab3").find(".rsArea").hide();
		}else{
			$("#tab3").find(".cannottxt").hide();
			$("#tab3").find(".rsArea").show();
		}
	}else{
		$("#tab3").find(".cannottxt").hide();
		$("#tab3").find(".rsArea").show();
	}
}

//增加分散学时安排
function addNewFsKj(){
	var fsxq=getNormalSelectValue("fsxq");
	var fsXs=parseInt($("#fsXs").val());
	var allHousr=parseInt($(".fsxsSpan")[0].innerText);
	var PuttedHousr=parseInt($(".fsPuttedHousr")[0].innerText)+fsXs;
	var waitHour=0;
	allHousr-PuttedHousr<0?waitHour=0:waitHour=allHousr-PuttedHousr;

	if(fsxq===""){
		toastr.warning('请选择周数');
		return;
	}
	if(fsXs<=0){
		toastr.warning('请选择分散学时');
		return;
	}

	if($(".fskjRsArea").find("#choosendfsKj"+fsxq).length!==0){
		toastr.warning('该课节安排已选择');
		return;
	}

	if(PuttedHousr>allHousr){
		toastr.warning('分散课时安排超过'+allHousr+'课时');
		return;
	}

	$(".singlefsKj,.choosendfsKjArea").append('<div class="choosendfsKjInfo" xs="'+fsXs+'" fsxq="'+fsxq+'" id="choosendfsKj'+fsxq+'">分散授课安排：第'+fsxq+'周  '+fsXs+'个学时' +
		'<img class="choosendfsKjImg choosendfsKjInfoImg" src="images/close1.png"/>' +
		'</div>');

	//重置select
	var reObject = new Object();
	reObject.normalSelectIds = "#fsxq";
	reReloadSearchsWithSelect(reObject);
	$("#fsXs").val(0);

	$('.choosendfsKjInfoImg').unbind('click');
	$('.choosendfsKjInfoImg').bind('click', function(e) {
		removefsKj(e);
		e.stopPropagation();
	});
	$(".fskjRsArea").show();



	$(".fsPuttedHousr").html(PuttedHousr);
	$(".fsWaitHousr").html(waitHour);
}

//课节下拉框事件
function KjBtnschange(){
	var currentXq=getNormalSelectValue("xq");
	var currentKj=getNormalSelectValue("kj");

	if(currentXq===""){
		toastr.warning('请选择星期');
		return;
	}

	if($(".singleKj").find("#choosendKjInfo"+(currentXq+currentKj)).length!==0){
		toastr.warning('该课节安排已选择');
	}
}

//新增周期
function addCoursePlan(){
	var reAreas=$(".kjRsArea").find(".singleKj").find(".appendArea").find(".choosendKjInfo");
	var puttedCycles=$(".lastCycleArea").find(".singleCycle").find(".choosendCycleInfo");
	if(reAreas.length==0){
		toastr.warning('暂未进行课时安排')
		return;
	}


	var currentHour=0;
	for (var i = 0; i < puttedCycles.length; i++) {
		var startWeek=puttedCycles[i].attributes[5].nodeValue;
		var endWeek=puttedCycles[i].attributes[6].nodeValue;
		currentHour+=((parseInt(endWeek)-parseInt(startWeek))+1)*2;
	}

	var appendStr="";
	var added=$(".choosendCycleInfo");
	for (var i = 0; i < reAreas.length; i++) {
		var startWeek=reAreas[i].attributes[8].nodeValue;
		var endWeek=reAreas[i].attributes[9].nodeValue;
		var currentXq=reAreas[i].attributes[3].nodeValue;
		var currentKj=reAreas[i].attributes[4].nodeValue;
		var teacherID=reAreas[i].attributes[6].nodeValue;
		var location=reAreas[i].attributes[12].nodeValue;
		var point=reAreas[i].attributes[13].nodeValue;
		var startWeekmc=reAreas[i].attributes[10].nodeValue;
		var endWeekmc=reAreas[i].attributes[11].nodeValue;
		var currentXqmc=reAreas[i].attributes[1].nodeValue;
		var currentKjmc=reAreas[i].attributes[2].nodeValue;
		var teacherName=reAreas[i].attributes[7].nodeValue;
		var locationName=reAreas[i].attributes[14].nodeValue;
		var pointName=reAreas[i].attributes[15].nodeValue;
		var id='choosendCycleInfo'+(currentXq+currentKj+startWeek+endWeek);
		//判断完全一致
		for (let j = 0; j <added.length; j++) {
			if(added[j].id==id){
				toastr.warning(startWeekmc+' - '+endWeekmc+' '+currentXqmc+currentKjmc+'  已安排');
				return;
			}
		}

		//判断开始结束周一致或包含
		var startEndSame=false;
		for (let j = 0; j <added.length; j++) {
			var thisStartWeek=parseInt(added[j].attributes[5].nodeValue);
			var thisEndWeek=parseInt(added[j].attributes[6].nodeValue);
			var currentStartWeek=parseInt(startWeek);
			if(currentStartWeek>=thisStartWeek&&currentStartWeek<=thisEndWeek){
				startEndSame=true;
				break;
			}
		}

		//判断星期课节一致或包含
		var xqkjSame=false;
		for (let j = 0; j <added.length; j++) {
			var thisXq=added[j].attributes[3].nodeValue;
			var thisKj=added[j].attributes[4].nodeValue;
			if(thisXq===currentXq&&thisKj===currentKj){
				xqkjSame=true;
				break;
			}
		}
		if(startEndSame&&xqkjSame){
			toastr.warning(startWeekmc+' - '+endWeekmc+' '+currentXqmc+currentKjmc+'  已安排');
			return;
		}

		appendStr+='<div class="choosendCycleInfo" xqmc="'+currentXqmc+'" kjmc="'+currentKjmc+'" xqid="'+currentXq+'" kjid="'+currentKj+'" startWeek="'+startWeek+'" endWeek="'+endWeek+'"  id="choosendCycleInfo'+(currentXq+currentKj+startWeek+endWeek)+'"  teacherID="'+teacherID+'" teacherName="'+teacherName+'" location="'+location+'" point="'+point+'" locationName="'+locationName+'" pointName="'+pointName+'">' +
			'集中授课：'+startWeekmc+'  至  '+endWeekmc+' 每周'+currentXqmc+'  '+currentKjmc+'课' +'&#12288;任课教师:'+teacherName+'&#12288;授课地点:'+locationName+'-'+pointName+
			'<img class="choosendKjImg choosendCycleInfoImg" src="images/close1.png"/></div>';
		currentHour+=((parseInt(endWeek)-parseInt(startWeek))+1)*2;
	}

	var jzxs=parseInt($(".jzxsSpan ")[0].innerText);
	var puttedHousr=currentHour;
	var waitHousr=jzxs-puttedHousr;
	waitHousr<0?waitHousr=0:waitHousr=waitHousr;
	if(puttedHousr>jzxs){
		toastr.warning('集中课时安排超过'+jzxs+'课时');
		return;
	}

	//渲染dom
	$(".choosendCycleArea,.singleCycle").append(appendStr);
	$(".lastCycleArea ").show();
	$(".singleKj").empty();
	$(".kjRsArea").hide();

	//展示实时结果
	$(".cyclePuttedHousr").html(puttedHousr);
	$(".cycleWaitHousr").html(waitHousr);

	$('.choosendCycleInfoImg').unbind('click');
	$('.choosendCycleInfoImg').bind('click', function(e) {
		removeCycle(e);
		e.stopPropagation();
	});
}

//删除周期
function removeCycle(eve){
	var id=eve.currentTarget.parentElement.id;
	$(".singleCycle,.choosendCycleArea").find("#"+id).remove();
	var tab1CycleInfo=$(".singleCycle").find(".choosendCycleInfo");
	if(tab1CycleInfo.length===0){
		$(".lastCycleArea").hide();
	}else{
		$(".lastCycleArea").show();
	}
	//展示实时结果
	var startWeek=eve.currentTarget.parentElement.attributes[5].nodeValue;
	var endWeek=eve.currentTarget.parentElement.attributes[6].nodeValue;
	var lessHour=((parseInt(endWeek)-parseInt(startWeek))+1)*2;
	var puttedHousr=parseInt($(".cyclePuttedHousr")[0].innerText)-lessHour;
	var waitHousr=parseInt($(".cycleWaitHousr")[0].innerText)+lessHour;

	$(".cyclePuttedHousr").html(puttedHousr);
	$(".cycleWaitHousr").html(waitHousr);
}

//新增课节组
function AddnewKj(){
	var startWeek=getNormalSelectValue("startWeek");
	var endWeek=getNormalSelectValue("endWeek");
	var currentXq=getNormalSelectValue("xq");
	var currentKj=getNormalSelectValue("kj");
	var teacherID=getNormalSelectValue("teacher");
	var startWeekName=getNormalSelectText("startWeek");
	var endWeekName=getNormalSelectText("endWeek");
	var currentXqmc=getNormalSelectText("xq");
	var currentKjmc=getNormalSelectText("kj");
	var teacherName=getNormalSelectText("teacher");
	var location=getNormalSelectValue("jxd");
	var point=getNormalSelectValue("skdd");
	var locationName=getNormalSelectText("jxd");
	var pointName=getNormalSelectText("skdd");

	if(teacherID===""){
		toastr.warning('请选择任课教师')
		return;
	}

	if(location===""){
		toastr.warning('请选择教学点');
		return;
	}
	if(point===""){
		toastr.warning('请选择授课地点');
		return;
	}

	if(startWeek===""){
		toastr.warning('请选择开始周');
		return;
	}
	if(endWeek===""){
		toastr.warning('请选择结束周');
		return;
	}

	if(parseInt(endWeek)<parseInt(startWeek)){
		toastr.warning('开始周必须小于等于结束周');
		return;
	}

	if(currentXq===""){
		toastr.warning('请选择星期');
		return;
	}
	if(currentKj===""){
		toastr.warning('请选择课节');
		return;
	}

	if($(".singleKj").find("#choosendKjInfo"+(startWeek+endWeek+currentXq+currentKj)).length!==0){
		toastr.warning(startWeekName+' - '+endWeekName+' '+currentXqmc+currentKjmc+'  已安排');
		return;
	}

	if($(".singleKj").find(".area"+startWeek+endWeek).length<1){
		$(".singleKj").append('<div class="area area'+(startWeek+endWeek)+'">' +
				'<span class="kjRsAreaTitle">第'+startWeek+'周 至 第'+endWeek+'周课节安排</span>' +
				'<div class="appendArea"><div class="choosendKjInfo" xqmc="'+currentXqmc+'" kjmc="'+currentKjmc+'" xqid="'+currentXq+'" kjid="'+currentKj+'" id="choosendKjInfo'+(startWeek+endWeek+currentXq+currentKj)+'" teacherId="'+teacherID+'" teacherName="'+teacherName+'" startWeek="'+startWeek+'" endWeek="'+endWeek+'" startWeekName="'+startWeekName+'" endWeekName="'+endWeekName+'" location="'+location+'" ponit="'+point+'" locationName="'+locationName+'" pointNme="'+pointName+'">每周'+currentXqmc+'  '+currentKjmc+'课 -授课教师:' +teacherName+' -授课地点:'+locationName+' '+pointName+
					'<img class="choosendKjImg choosendKjInfoImg" src="images/close1.png"/>' +
				'</div>' +
			'</div>');
	}else{
		$(".area"+startWeek+endWeek).find(".appendArea").append('<div class="choosendKjInfo" xqmc="'+currentXqmc+'" kjmc="'+currentKjmc+'" xqid="'+currentXq+'" kjid="'+currentKj+'" id="choosendKjInfo'+(startWeek+endWeek+currentXq+currentKj)+'" teacherId="'+teacherID+'" teacherName="'+teacherName+'" startWeek="'+startWeek+'" endWeek="'+endWeek+'" startWeekName="'+startWeekName+'" endWeekName="'+endWeekName+'"  location="'+location+'" ponit="'+point+'" locationName="'+locationName+'" pointNme="'+pointName+'">每周'+currentXqmc+'  '+currentKjmc+'课 -授课教师:'  +teacherName+' -授课地点:'+locationName+' '+pointName+
		'<img class="choosendKjImg choosendKjInfoImg" src="images/close1.png"/>' +
		'</div>' );
	}

	//重置select组
	var reObject = new Object();
	reObject.normalSelectIds = "#kj";
	reReloadSearchsWithSelect(reObject);

	$('.choosendKjInfoImg').unbind('click');
	$('.choosendKjInfoImg').bind('click', function(e) {
		removeKj(e);
		e.stopPropagation();
	});
	$(".kjRsArea,.singleKj").show();
}

//删除课节组
function removeKj(eve){
	var id=eve.currentTarget.parentElement.id;
	var appendArea=eve.currentTarget.parentElement.parentElement;
	$(".singleKj").find("#"+id).remove();
	if(appendArea.childNodes.length===0){
		var classNAME=appendArea.parentNode.classList[1];
		$("."+classNAME).remove();
	}

	if($(".singleKj")[0].childNodes.length==0){
		$(".singleKj").hide();
	}

	//重置第一个select组
	var reObject = new Object();
	reObject.normalSelectIds = "#kj,#xq";
	reReloadSearchsWithSelect(reObject);
}

//删除分散课节组
function removefsKj(eve){
	var id=eve.currentTarget.parentElement.id;
	var fsXs=parseInt(eve.currentTarget.parentElement.attributes[1].nodeValue);
	var PuttedHousr=parseInt($(".fsPuttedHousr")[0].innerText)-fsXs;
	var waitHour=parseInt($(".fsWaitHousr")[0].innerText)+fsXs;


	$(".choosendfsKjArea,.singlefsKj").find("#"+id).remove();
	var tab2KjInfo=$(".singlefsKj").find(".choosendfsKjInfo");
	if(tab2KjInfo.length===0){
		$(".fskjRsArea").hide();
	}else{
		$(".fskjRsArea").show();
	}

	//重置第一个select组
	var reObject = new Object();
	reObject.normalSelectIds = "#fsxq";
	reReloadSearchsWithSelect(reObject);

	$(".fsPuttedHousr").html(PuttedHousr);
	$(".fsWaitHousr").html(waitHour);
}

//根据学年渲染开始结束周
function drawStartAndEndWeek(allWeeks){
	var configStr='<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < allWeeks.length; i++) {
		configStr += '<option value="' + allWeeks[i].id + '">'+ allWeeks[i].value+'</option>';
	}
	stuffManiaSelect("#startWeek", configStr);
	stuffManiaSelect("#endWeek", configStr);
	stuffManiaSelect("#fsxq", configStr);
}

//重新渲染开始结束周
function redrawStartAndEndWeek(){
	var currentXn=getNormalSelectValue("term");
	var currentXnmc=getNormalSelectText("term");
	if(currentXn===""){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getYearWeek",
		data:{
			"yearId":currentXn
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
				drawStartAndEndWeek(backjson.data);
				$(".choosendTerm").html(currentXnmc+"学年");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//确认排课
function confirmPk(){
	var currentJzxs=parseInt($(".jzxsSpan ")[0].innerText);
	var scheduleInfo;
	var PKInfo;
	if(currentJzxs!=0){
		PKInfo=getJzPKInfo();
		if(typeof PKInfo ==='undefined'){
			return;
		}

		scheduleInfo=scheduleDetailInfo();
		if(scheduleInfo.length==0){
			return;
		}

		var checkJzPkRs=checkJzPk();
		if(!checkJzPkRs){
			return;
		}
	}else{
		scheduleInfo=new Array();
		var choosed = $("#WaitTaskTable").bootstrapTable("getSelections");
		var PKInfo=new Object();
		PKInfo.xnid=choosed[0].xnid;
		PKInfo.xnmc=choosed[0].xn;
		PKInfo.skddmc="";
		PKInfo.skddid="";
		PKInfo.pointid="";
		PKInfo.point="";
		PKInfo.edu201_ID=choosed[0].edu201_ID;
	}

	var fsxsInfo=new Array();
	if($(".fsxsSpan")[0].innerText!=="0"){
		var checkSFxsRs=checkSFxs();
		if(!checkSFxsRs){
			return;
		}
		fsxsInfo=getfsxs();
	}

	$.ajax({
		method: 'get',
		cache: false,
		url: "/comfirmSchedule",
		data:{
			"Edu201Id":PKInfo.edu201_ID.toString(),
			"scheduleDetail":JSON.stringify(scheduleInfo),
			"scatteredClass":JSON.stringify(fsxsInfo)
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
				var taskId = $("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID;
				$("#WaitTaskTable").bootstrapTable('removeByUniqueId',taskId);
				controlScheduleArea();
				toastr.success('排课成功');
			} else {
				toastr.warning('排课课时不等于任务书总课时');
			}
		}
	});
}

//验证集中排课结果
function checkJzPk(){
	var rs=true;
	var all=$(".singleCycle").find(".choosendCycleInfo");
	if(all.length===0){
		rs=false;
		toastr.warning('暂无集中学时安排');
		return rs;
	}

	var shouldJzxs=parseInt($(".jzxsSpan")[0].innerText);
	var currentJzxs=0
	for (var i = 0; i < all.length; i++) {
		var startWeek=parseInt(all[i].attributes[5].nodeValue);
		var endWeek=parseInt(all[i].attributes[6].nodeValue);
		var allWeek=0;
		if(startWeek==endWeek){
			currentJzxs+=2;
		}else{
			allWeek=(endWeek-startWeek)+1;
			currentJzxs+=allWeek*2;
		}
	}

	if(currentJzxs>shouldJzxs){
		rs=false;
		toastr.warning('集中学时不正确');
		return rs;
	}

	return rs;
}

//验证分散排课结果
function checkSFxs(){
	var rs=true;
	var shouldNum=$(".fsxsSpan")[0].innerText;
	var choosendFsxsDom=getfsxs();
	if(choosendFsxsDom.length===0){
		toastr.warning('暂未选择分散学时');
		return false;
	}

	var choosendFsxs=0;
	for (var i = 0; i <choosendFsxsDom.length ; i++) {
		choosendFsxs+=parseInt(choosendFsxsDom[i].classHours);
	}
	if(choosendFsxs>shouldNum){
		toastr.warning('分散学时不正确');
		return false;
	}

	return rs;
}

//获得集中排课信息
function getJzPKInfo(needToastr){
	var term=getNormalSelectValue("term");
	var termMc=getNormalSelectText("term");

	if(term===""){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择学年');
		}
		return;
	}
	var taskId='';
	$(".isRe")[0].innerText==="F"?taskId=$("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID:taskId="";

	var returnObject=new Object();
	returnObject.xnid=term;
	returnObject.xnmc=termMc;
	returnObject.edu201_ID=taskId;
	return returnObject;
}

//获得集中星期-课节信息
function scheduleDetailInfo(needToastr){
	var returnArray=new Array();
	var all=$("#tab3").find(".choosendCycleArea")[0].childNodes;
	for (var i = 0; i < all.length; i++) {
		if(all[i].firstElementChild!=null){
			var thisObject=new Object();
			var current=all[i].attributes;
			thisObject.xqmc=current[1].nodeValue;
			thisObject.kjmc=current[2].nodeValue;
			thisObject.xqid=current[3].nodeValue;
			thisObject.kjid=current[4].nodeValue;
			thisObject.ksz=current[5].nodeValue;
			thisObject.jsz=current[6].nodeValue;
			thisObject.Edu101_id=current[8].nodeValue;
			thisObject.teacherName=current[9].nodeValue;
			thisObject.localId=current[10].nodeValue;
			thisObject.pointId=current[11].nodeValue;
			thisObject.localName=current[12].nodeValue;
			thisObject.pointName=current[13].nodeValue;
			returnArray.push(thisObject);
		}

	}

	if(returnArray.length==0){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择集中课时周期安排');
		}
	}
	return returnArray;
}

//获得分散排课信息
function getfsxs(){
	var returnArray=new Array();
	var allFsxsDom=$("#tab3").find(".choosendfsKjInfo");
	for (var i = 0; i <allFsxsDom.length ; i++) {
		if(allFsxsDom[i].nextElementSibling==null){
			var singleObject=new Object();
			var taskId='';
			var courseName='';
			$(".isRe")[0].innerText==="F"?taskId=$("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID:taskId="";
			$(".isRe")[0].innerText==="F"?courseName=$("#WaitTaskTable").bootstrapTable("getSelections")[0].kcmc:courseName="";
			singleObject.classHours=allFsxsDom[i].attributes[1].nodeValue;
			singleObject.week=allFsxsDom[i].attributes[2].nodeValue;
			// singleObject.Edu201_ID=$("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID;
			// singleObject.courseName=$("#WaitTaskTable").bootstrapTable("getSelections")[0].kcmc;
			singleObject.Edu201_ID=taskId;
			singleObject.courseName=courseName;
			returnArray.push(singleObject);
		}
	}
	return returnArray;
}

//开始周结束周change事件
function weekChange(){
   var startWeek=getNormalSelectValue("startWeek");
   var endWeek=getNormalSelectValue("endWeek");
   $(".choosendStartWeek").html("自第"+startWeek+"周");
   $(".choosendEndWeek").html("到第"+endWeek+"周");
}

//授课地点
function skddChange(){
	var choosendsite=getNormalSelectText("jxd");
	var choosendLoaction=getNormalSelectText("skdd");
	if(choosendLoaction===""||choosendsite===""){
		$(".loationInfoTxt").hide();
		return;
	}
	if($(".choosendLoaction").length===0){
		$(".choosendLoactionArea").append('<span class="choosendLoaction">在'+choosendsite+'-'+choosendLoaction+'授课</span>');
	}else{
		$(".choosendLoaction").html('在'+choosendsite+'-'+choosendLoaction+'授课');
	}
	stuffLocationInfo();
}

//渲染教学点备注和容纳人数
function stuffLocationInfo(){
	if(getNormalSelectValue("jxd")==""){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getPointBySite",
		data: {
			"SearchObject":getNormalSelectValue("jxd")
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
			if(backjson.code===200){
				var locaitioninfo=backjson.data;
				for (var i = 0; i < locaitioninfo.length; i++) {
					if(getNormalSelectValue("skdd")===locaitioninfo[i].edu501Id.toString()){
						var capacity=locaitioninfo[i].capacity;
						var remarks;
						locaitioninfo[i].remarks==null||locaitioninfo[i].remarks===""?remarks="暂无备注":remarks=locaitioninfo[i].remarks;
						$(".loationInfoTxt").html(getNormalSelectText("skdd")+' 可容纳人数:'+capacity+'人      备注:'+remarks+'');
						$(".loationInfoTxt").show();
						return;
					}
				}
			}else{
				var reObject = new Object();
				reObject.normalSelectIds = "#skdd";
				reReloadSearchsWithSelect(reObject);
				toastr.warning(backjson.msg);
			}
		}
	});
}

//返回待排课程区域
function controlScheduleArea(type){
	if(typeof type==="undefined"){
		$(".scheduleClassesMainArea").toggle();
		$(".scheduleSingleClassArea").toggle();
	}else{
		$(".puttedScheduleArea").show();
		$(".scheduleSingleClassArea,.scheduleClassesMainArea").hide();
	}
}

//必选检索条件检查
function getNotNullSearchs() {
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");
	var kcxz =getNormalSelectValue("kcxz");
	var levelText = getNormalSelectText("level");
	var departmentText = getNormalSelectText("department");
	var gradeText =getNormalSelectText("grade");
	var majorText =getNormalSelectText("major");
	var kcxzText =getNormalSelectText("kcxz");

	
	var returnObject = new Object();
	returnObject.level = levelValue;
	returnObject.department = departmentValue;
	returnObject.grade = gradeValue;
	returnObject.major = majorValue;
	returnObject.levelTxt = levelText;
	returnObject.departmentTxt = departmentText;
	returnObject.gradeTxt = gradeText;
	returnObject.majorTxt = majorText;
	returnObject.kcxz=kcxz;
	returnObject.kcxzTxt=kcxzText
	return returnObject;
}

//展示已排课表
function puttedSchedule(){
	var searchObject=new Object();
	searchObject.pyjhcc="";
	searchObject.pyjhxb="";
	searchObject.pyjhnj="";
	searchObject.pyjhzy="";
	searchObject.kcxzid="";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeachingScheduleCompleted",
		data: {
			"searchCondition":JSON.stringify(searchObject),
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
				var reObject = new Object();
				reObject.normalSelectIds = "#puttedlevel,#putteddepartment,#puttedgrade,#puttedmajor,#puttedkcxz";
				reReloadSearchsWithSelect(reObject);

				puttedScheduleControlArea();
				getPuttedTaskSelectInfo();
				puttedScheduleBtnBind();
				if(backjson.taskList.lenght===0){
					toastr.warning('暂无已排课程');
					drawEmptyPuttedTable();
				}else{
					stuffPuttedOutTable(sortPuttedCrouse(backjson.taskList));
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//根据时间 排序已排课表
function sortPuttedCrouse(taskList){
	var returnArray=new Array();
	var hadDate=new Array();
	var noDate=new Array();
	for (var i = 0; i < taskList.length; i++) {
		if(taskList[i].pksj!=null&&taskList[i].pksj!==""&&typeof taskList[i].pksj!=="undefined"){
			hadDate.push(taskList[i]);
		}else{
			noDate.push(taskList[i]);
		}
	}

	returnArray= hadDate.sort(function(a,b){
		return a.pksj < b.pksj ? 1 : -1
	});

	returnArray.push.apply(returnArray,noDate);

	return returnArray;
}

//渲染空的已排课表table
function  drawEmptyPuttedTable(){
	stuffPuttedOutTable({});
}

//控制已排课表区域和待排课区域的展示或隐藏
function puttedScheduleControlArea(){
	$(".scheduleClassesMainArea,.puttedScheduleArea").toggle();
}

//已排课表 获取-专业培养计划- 有逻辑关系select信息
function getPuttedTaskSelectInfo() {
	LinkageSelectPublic("#puttedlevel", "#putteddepartment", "#puttedgrade", "#puttedmajor");
}

//获取已排课表信息
function getPuttedScheduleInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeachingScheduleCompleted",
		data: {
			"searchCondition":JSON.stringify(getPuttedSelectValue()),
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
				stuffPuttedOutTable(backjson.taskList);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//渲染已排课表table
function stuffPuttedOutTable(tableInfo){
	window.puttedEvents = {
		'click #puttedInfo' : function(e, value, row, index) {
			puttedInfo(row);
		},
		'click #removePutted' : function(e, value, row, index) {
			removePutted(row);
		},
		'click #changePutted' : function(e, value, row, index) {
			changePutted(row);
		}
	};

	$('#puttedTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".puttedTableArea", "已排课表");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
			field : 'check',
			checkbox : true
		}, {
				field: 'edu202_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			},
			{
				field: 'pyjhmc',
				title: '培养计划名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},
			{
				field: 'className',
				title: '班级名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, 	{
				field: 'kcmc',
				title: '课程',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},	{
				field: 'pksj',
				title: '排课时间',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'ls',
				title: '任课老师',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'zyls',
				title: '助教',
				align: 'left',
				sortable: true,
				formatter: paramsMatter

			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'center',
				width:'15%',
				sortable: true,
				formatter: sfxylcjMatter
			},{
				field: 'kkbm',
				title: '开课部门',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},	{
				field: 'pkbm',
				title: '排课部门',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field : 'action',
				title : '操作',
				align : 'center',
				clickToSelect : false,
				formatter : puttedFormatter,
				events :  puttedEvents,
			}
		]
	});

	function puttedFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li id="puttedInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
		+ '<li id="changePutted"><span><img src="images/icon03.png" style="width:24px"></span>再排</li>'
		+ '<li id="removePutted"><span><img src="images/close1.png"></span>删除</li>'
		+ '</ul>' ].join('');
	}

	function sfxylcjMatter(value, row, index) {
		if (row.sfxylcj==="T") {
			return [ '<div class="myTooltip" title="需要录成绩"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
				.join('');
		} else{
			return [ '<div class="myTooltip" title="不需要录成绩"><i class="iconfont icon-chacha normalTxt"></i></div>' ]
				.join('');
		}
	}

	drawPagination(".puttedTableArea", "已排课表");
	changeColumnsStyle(".puttedTableArea", "已排课表");
	drawSearchInput(".puttedTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//再排
function changePutted(row){
	$(".isRe").html('T');
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchScheduleInfoAgain",
		data: {
			"edu202Id":row.edu202_ID
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
			if (backjson.code===200) {
				if(backjson.data.status==="T"){
					toastr.warning('课程已排完');
					return;
				}
				$("#rePutInfo").show();
				$(".jzxsSpan").html(backjson.data.edu201.jzxs);
				showStartScheduleArea(null,null,2);
				stuffChangePuttedInfo(backjson.data,row);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}

	});
}

//再排时渲染已排信息
function stuffChangePuttedInfo(puttedInfo,rowInfo){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/dealScheduleClassInfo",
		data:{
			"edu103Id":rowInfo.pyjhcc
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
				if(backjson.kjInfo.length<=0){
					toastr.warning('暂无默认课节信息');
					return;
				}
				if(backjson.jxdInfo.length<=0){
					toastr.warning('暂无可选教学点场地信息');
					return;
				}

				var isZero=true;
				puttedInfo.edu201.jzxs===0?isZero=true:isZero=false;
				drawJzXueDomArea(isZero,puttedInfo.edu201,backjson.jxdInfo,backjson.termInfo[0],backjson.kjInfo,2);

				isZero=true;
				puttedInfo.edu201.fsxs===0?isZero=true:isZero=false;
				drawFsXueDomArea(isZero);

				judgementStepDisplay(puttedInfo.edu201.jzxs,puttedInfo.edu201.fsxs);

				destoryLastStuff();
				stuffReTitle(rowInfo,puttedInfo);
				reScheduleSingleClassBtnBind(rowInfo);
				stuffReRs(rowInfo,puttedInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充再排标题
function stuffReTitle(culturePlanInfo,choosedTask){
	$(".scheduleInfoTxt,.scheduleRsTitle").html(culturePlanInfo.pyjhmc+'-'+culturePlanInfo.className+
		"(总学时：" + choosedTask.edu201.zxs + "课时  集中学时：" + choosedTask.edu201.jzxs + "课时  分散学时：" + choosedTask.edu201.fsxs + "课时)");
	$(".jzxsSpan").html(choosedTask.edu201.jzxs);
	$(".fsxsSpan").html(choosedTask.edu201.fsxs);
	var cyclePuttedHousr=choosedTask.edu203List.length*2;
	$(".cyclePuttedHousr").html(cyclePuttedHousr);
	$(".cycleWaitHousr").html(parseInt(choosedTask.edu201.jzxs)-cyclePuttedHousr);
	if(choosedTask.edu207List.length!=0){
		var cyclePuttedFsHousr=choosedTask.edu207List.length*2;
		$(".fsPuttedHousr").html(cyclePuttedFsHousr);
		$(".fsWaitHousr").html(parseInt(choosedTask.edu201.fsxs)-cyclePuttedFsHousr);
	}
}

var isRe=false;
//再排时填充已排课时结果
function stuffReRs(rowInfo,puttedInfo){
	isRe=true;
	//集中
	var puttedJzCycles=puttedInfo.edu203List;
	var appendStr="";
	var added=$(".choosendCycleInfo");
	for (var i = 0; i < puttedJzCycles.length; i++) {
		var startWeek=puttedJzCycles[i].ksz;
		var endWeek=puttedJzCycles[i].jsz;
		var currentXq=puttedJzCycles[i].xqid;
		var currentKj=puttedJzCycles[i].kjid;
		var teacherID=puttedJzCycles[i].edu101_id;
		var location=puttedJzCycles[i].localId;
		var point=puttedJzCycles[i].pointId;

		var startWeekmc=puttedJzCycles[i].week;
		var endWeekmc=puttedJzCycles[i].jsz;
		var currentXqmc=puttedJzCycles[i].xqmc;
		var currentKjmc=puttedJzCycles[i].kjmc;
		var teacherName=puttedJzCycles[i].teacherName;
		var locationName=puttedJzCycles[i].localName;
		var pointName=puttedJzCycles[i].pointName;
		var id='choosendCycleInfo'+(currentXq+currentKj+startWeek+endWeek);
		for (let j = 0; j <added.length; j++) {
			if(added[j].id==id){
				toastr.warning(startWeekmc+' - '+endWeekmc+' '+currentXqmc+currentKjmc+'  已安排');
				return;
			}
		}

		appendStr+='<div class="choosendCycleInfo" xqmc="'+currentXqmc+'" kjmc="'+currentKjmc+'" xqid="'+currentXq+'" kjid="'+currentKj+'" startWeek="'+startWeek+'" endWeek="'+endWeek+'"  id="choosendCycleInfo'+(currentXq+currentKj+startWeek+endWeek)+'"  teacherID="'+teacherID+'" teacherName="'+teacherName+'" location="'+location+'" point="'+point+'" locationName="'+locationName+'" pointName="'+pointName+'">' +
			'集中授课：第'+startWeekmc+'周  至  '+endWeekmc+'周 每周'+currentXqmc+'  '+currentKjmc+'课' +'&#12288;任课教师:'+teacherName+'&#12288;授课地点:'+locationName+'-'+pointName+
			'</div>';
	}
	$(".choosendCycleArea,.singleCycle").append(appendStr);
	$(".lastCycleArea").show();

	// $('.choosendCycleInfoImg').unbind('click');
	// $('.choosendCycleInfoImg').bind('click', function(e) {
	// 	removeCycle(e);
	// 	e.stopPropagation();
	// });

	//分散
	appendStr="";
	var puttedFsCycles=puttedInfo.edu207List;
	for (var i = 0; i < puttedFsCycles.length; i++) {
		appendStr+='<div class="choosendfsKjInfo" xs="'+puttedFsCycles[i].classHours+'" fsxq="'+puttedFsCycles[i].week+'" id="choosendfsKj'+puttedFsCycles[i].week+'">分散授课安排：第'+puttedFsCycles[i].week+'周  '+puttedFsCycles[i].classHours+'个学时' +
			'</div>';

	}

	$(".singlefsKj,.choosendfsKjArea").append(appendStr);
	if(appendStr!==''){
		$(".fskjRsArea").show();
	}

	// $('.choosendfsKjInfoImg').unbind('click');
	// $('.choosendfsKjInfoImg').bind('click', function(e) {
	// 	removefsKj(e);
	// 	e.stopPropagation();
	// });
}

//再排  单个课程排课区域按钮事件绑定
function reScheduleSingleClassBtnBind(rowInfo){
	//tab1的下一步
	$('.configedJz').unbind('click');
	$('.configedJz').bind('click', function(e) {
		configedJz();
		e.stopPropagation();
	});

	//tab2的上一步
	$('.configedFs_lastStep').unbind('click');
	$('.configedFs_lastStep').bind('click', function(e) {
		configedFslastStep();
		e.stopPropagation();
	});

	//tab2的下一步
	$('.configedFs_NextStep').unbind('click');
	$('.configedFs_NextStep').bind('click', function(e) {
		configedFsNextStep();
		e.stopPropagation();
	});

	//tab3的下一步
	$('.configedAll_lastStep').unbind('click');
	$('.configedAll_lastStep').bind('click', function(e) {
		configedAlllastStep(rowInfo);
		e.stopPropagation();
	});

	//确认排课按钮
	$('#confirm').unbind('click');
	$('#confirm').bind('click', function(e) {
		confirmPk2(rowInfo);
		e.stopPropagation();
	});

	//为学年绑定change事件 重载开始结束周信息
	$("#term").change(function(e) {
		redrawStartAndEndWeek();
		e.stopPropagation();
	});

	//为开始周绑定change事件
	$("#endWeek").change(function(e) {
		weekChange();
		e.stopPropagation();
	});

	//为授课地点绑定change事件
	$("#skdd").change(function(e) {
		skddChange();
		e.stopPropagation();
	});

	$("#kj").change(function(e) {
		KjBtnschange();
		e.stopPropagation();
	});

	$('#addnewKj').unbind('click');
	$('#addnewKj').bind('click', function(e) {
		AddnewKj();
		e.stopPropagation();
	});

	$('#addCoursePlan').unbind('click');
	$('#addCoursePlan').bind('click', function(e) {
		addCoursePlan();
		e.stopPropagation();
	});

	$('#addNewFsKj').unbind('click');
	$('#addNewFsKj').bind('click', function(e) {
		addNewFsKj();
		e.stopPropagation();
	});
}

//再排确认排课
function confirmPk2(rowInfo){
	var currentJzxs=parseInt($(".jzxsSpan ")[0].innerText);
	var scheduleInfo;
	var PKInfo;
	if(currentJzxs!=0){
		PKInfo=getJzPKInfo();
		if(typeof PKInfo ==='undefined'){
			return;
		}

		scheduleInfo=scheduleDetailInfo();
		if(scheduleInfo.length==0){
			return;
		}

		var checkJzPkRs=checkJzPk();
		if(!checkJzPkRs){
			return;
		}
	}else{
		scheduleInfo=new Array();
		var PKInfo=new Object();
		PKInfo.xnid=rowInfo.xnid;
		PKInfo.xnmc=rowInfo.xn;
		PKInfo.skddmc="";
		PKInfo.skddid="";
		PKInfo.pointid="";
		PKInfo.point="";
		PKInfo.edu201_ID=rowInfo.edu201_ID;
	}

	var fsxsInfo=new Array();
	if($(".fsxsSpan")[0].innerText!=="0"){
		var checkSFxsRs=checkSFxs();
		if(!checkSFxsRs){
			return;
		}
		fsxsInfo=getfsxs();
	}

	$.ajax({
		method: 'get',
		cache: false,
		url: "/reComfirmSchedule",
		data:{
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"userName":$(parent.frames["topFrame"].document).find(".userName")[0].innerText,
			"Edu202Id":rowInfo.edu202_ID,
			"scheduleDetail":JSON.stringify(scheduleInfo),
			"scatteredClass":JSON.stringify(fsxsInfo)
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
				// var taskId = $("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID;
				// $("#WaitTaskTable").bootstrapTable('removeByUniqueId',taskId);
				controlScheduleArea();
				toastr.success('排课成功');
			} else {
				toastr.warning('排课课时不等于任务书总课时');
			}
		}
	});
}

//已排详情
function puttedInfo(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchScheduleCompletedDetail",
		data: {
			"Edu202Id":row.edu202_ID
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
				stuffPuttedInfo(row,backjson.scheduleCompletedDetails,backjson.scatterList);
				$.showModal("#puttedInfoModal",false);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}

	});
}

//预备删除已排
function removePutted(row){
	$.showModal("#remindModal",true);
	$(".remindType").html("已排课表");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray=new Array();
		removeArray.push(row.edu202_ID);
		confirmRmovePutted(removeArray);
	});
}

//预备批量删除
function removePutteds(){
	var puttedTable=$('#puttedTable').bootstrapTable('getSelections');
	if(puttedTable.length==0){
		toastr.warning('请选择已排课表');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("选择的已排课表");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray=new Array();
		for (var i = 0; i < puttedTable.length; i++) {
			removeArray.push(puttedTable[i].edu202_ID);
		}
		confirmRmovePutted(removeArray);
	});
}

//确认删除已排
function confirmRmovePutted(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeTeachingSchedule",
		data: {
			"scheduleId":JSON.stringify(removeArray)
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
				$.hideModal("#remindModal");
				tableRemoveAction("#puttedTable", removeArray, ".puttedTableArea", "已排课表");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充已排详情
function stuffPuttedInfo(puttedInfo,scheduleCompletedDetails,scatterList){
	//清空已有课节安排区域
	$(".puttedKjArea").find(".PuttedKjArea,.puttedJzTitle").remove();
	$(".puttedfsKjArea").find(".PuttedfsKjArea").remove();

	$("#puttedTerm").val(scheduleCompletedDetails.xn);
	$("#puttedJxbMC").val(puttedInfo.className);
	$("#puttedkCMC").val(puttedInfo.kcmc);
	$("#puttedZyls").val(puttedInfo.zyls);
	$("#puttedLs").val(puttedInfo.ls);
	$('#puttedInfoModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly

	var classPeriodMap=scheduleCompletedDetails.classPeriodMap;
	if(JSON.stringify(classPeriodMap) !== "{}"){
		for (var key in classPeriodMap) {
			stuffPuttedJzPk(classPeriodMap[key]);
		}
		$(".jzformtitle").show();
	}else{
		$(".jzformtitle").hide();
	}

	if(scatterList.length===0){
		$(".fsformtitle,.puttedfsKjArea").hide();
	}else{
		for (var i = 0; i < scatterList.length; i++) {
			$(".puttedfsKjArea").append('<div class="PuttedfsKjArea">第'+scatterList[i].week+'周 '+scatterList[i].classHours+'学时</div>');
		}
		$(".fsformtitle,.puttedfsKjArea").show();
	}
}

//渲染已排集中课时
function stuffPuttedJzPk(classPeriodList){
	classPeriodList=sortClassPeriodList(classPeriodList);
	$(".jzformtitle,.puttedKjArea,.fsformtitle,.puttedfsKjArea").show();
	var str='';
	if(classPeriodList.length===0){
		$(".jzformtitle,.puttedKjArea").hide();
	}else{
		str='<div class="puttedJzTitle"><i class="iconfont icon-JIAOSHI"></i>'+classPeriodList[0].localName+'-'+classPeriodList[0].pointName+'</div>';
		for (var i = 0; i <classPeriodList.length ; i++) {
			if(classPeriodList[i].teacherType==="01"){
				str+='<div class="PuttedKjArea">第'+classPeriodList[i].week+'周  '+classPeriodList[i].xqmc+' '+classPeriodList[i].kjmc+' -'+classPeriodList[i].teacherName+'</div>';
			}
		}
		$(".puttedKjArea").append(str+'<div class="clear"></div>');
	}
}

//数组排序
function sortClassPeriodList(classPeriodList){
	var returnArray=classPeriodList.sort(compare("week")).reverse();
	return returnArray;
}

//已排课表按钮事件绑定
function puttedScheduleBtnBind(){
	//返回按钮
	$('#puttedReturnStartSchedule').unbind('click');
	$('#puttedReturnStartSchedule').bind('click', function(e) {
		puttedScheduleControlArea();
		e.stopPropagation();
	});

	//开始检索
	$('#putted_startSearch').unbind('click');
	$('#putted_startSearch').bind('click', function(e) {
		getPuttedScheduleInfo();
		e.stopPropagation();
	});

	//重置检索
	$('#putted_reSearch').unbind('click');
	$('#putted_reSearch').bind('click', function(e) {
		putted_reSearch();
		e.stopPropagation();
	});

	//批量删除
	$('#removePutteds').unbind('click');
	$('#removePutteds').bind('click', function(e) {
		removePutteds();
		e.stopPropagation();
	});
}

//获取已排课表检索下拉框的值
function getPuttedSelectValue(){
   var searchObject=new Object();
   searchObject.pyjhcc=getNormalSelectValue("puttedlevel");
   searchObject.pyjhxb=getNormalSelectValue("putteddepartment");
   searchObject.pyjhnj=getNormalSelectValue("puttedgrade");
   searchObject.pyjhzy=getNormalSelectValue("puttedmajor");
   searchObject.kcxzid=getNormalSelectValue("puttedkcxz");
   return searchObject;
}

//待排重置检索
function research(){
	var reObject = new Object();
	reObject.normalSelectIds = "#level,#department,#grade,#major,#kcxz";
	reReloadSearchsWithSelect(reObject);
	startSearch();
}

//已排排重置检索
function putted_reSearch(){
	var reObject = new Object();
	reObject.normalSelectIds = "#puttedlevel,#putteddepartment,#puttedgrade,#puttedmajor,#puttedkcxz,#puttedkcStatus";
	reReloadSearchsWithSelect(reObject);
	getPuttedScheduleInfo();
}

//开始检索
function startSearch(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getTaskByCulturePlanByUser",
		data: {
			"culturePlanInfo":JSON.stringify(getNotNullSearchs()),
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
			if (backjson.code===200) {
				toastr.info(backjson.msg);
				stuffWaitTaskTable(backjson.data);
			} else {
				drawWaitTaskEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//初始化页面按钮绑定事件
function binBind(){
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

	//开始排课按钮
	$('#startSchedule').unbind('click');
	$('#startSchedule').bind('click', function(e) {
		startSchedule();
		e.stopPropagation();
	});

	//已排课表按钮
	$('#puttedSchedule').unbind('click');
	$('#puttedSchedule').bind('click', function(e) {
		puttedSchedule();
		e.stopPropagation();
	});

	//重置检索
	$('#research').unbind('click');
	$('#research').bind('click', function(e) {
		research();
		e.stopPropagation();
	});
}


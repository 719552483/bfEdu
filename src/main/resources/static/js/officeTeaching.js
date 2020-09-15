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
			columns: [
				{
					field : 'radio',
					radio : true
				},{
					field: 'edu201_ID',
					title: '唯一标识',
					align: 'center',
					visible: false
				},
				{
					field: 'className',
					title: '班级名称',
					align: 'left',
					formatter: paramsMatter
				}, 	{
					field: 'kcmc',
					title: '课程',
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'zylsmc',
					title: '主要老师',
					align: 'left',
					formatter: charSpiltMatter

				},{
					field: 'lsmc',
					title: '老师',
					align: 'left',
					formatter: charSpiltMatter
				},{
					field: 'sfxylcj',
					title: '是否需要录成绩',
					align: 'center',
					width:'15%',
					formatter: sfxylcjMatter
				},{
					field: 'kkbm',
					title: '开课部门',
					align: 'left',
					formatter: paramsMatter
				},	{
					field: 'pkbm',
					title: '排课部门',
					align: 'left',
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
	var culturePlanInfo=getNotNullSearchs();
	if(typeof culturePlanInfo ==='undefined'){
		return;
	}
	var choosedTask=$('#WaitTaskTable').bootstrapTable('getSelections');
	if(choosedTask.length===0){
		toastr.warning('请选择排课课程');
		return;
	}
	showStartScheduleArea(culturePlanInfo,choosedTask);
}

//展示开始排课区域
function  showStartScheduleArea(culturePlanInfo,choosedTask){
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
                if(backjson.termInfo.length<=0){
					toastr.warning('暂无学年信息');
					return;
				}
				if(backjson.kjInfo.length<=0){
					toastr.warning('暂无默认课节信息');
					return;
				}
				if(backjson.jxdInfo.length<=0){
					toastr.warning('暂无可选教学点场地信息');
					return;
				}
				if(choosedTask[0].fsxs===0){
					$(".scheduleSingleClassArea").find(".itab").find("li:eq(1)").hide();
				}else{
					$(".scheduleSingleClassArea").find(".itab").find("li:eq(1)").show();
				}

				stuffTitle(culturePlanInfo,choosedTask[0]);
				destoryLastStuff();
				//渲染各个下拉框
				var configSelectTxt='<option value="seleceConfigTip">请选择</option>';
				stuffTermArae(backjson.termInfo,configSelectTxt);
				stuffJxdArae(backjson.jxdInfo,configSelectTxt);
				drawStartAndEndWeek(backjson.termInfo[0]);
				stuffKjArae(backjson.kjInfo,configSelectTxt,configSelectTxt);
				scheduleSingleClassBtnBind();
				controlScheduleArea();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充排课区域的title
function stuffTitle(culturePlanInfo,choosedTask){
	$(".scheduleInfoTxt,.scheduleRsTitle").html(culturePlanInfo.levelTxt+" "
		+culturePlanInfo.departmentTxt+" "
		+culturePlanInfo.gradeTxt+" "
		+culturePlanInfo.majorTxt+" "
		+choosedTask.kcmc+
		"(总学时："+choosedTask.zxs+"课时  集中学时："+choosedTask.jzxs+"课时  分散学时："+choosedTask.fsxs+"课时)");
	$(".jzxsSpan").html(choosedTask.jzxs);
	$(".fsxsSpan").html(choosedTask.fsxs);
}

//初始化课节等下拉框
function destoryLastStuff(){
	var reObject = new Object();
	reObject.normalSelectIds = "#term,#startWeek,#endWeek,#xq,#kj,#skdd";
	reReloadSearchsWithSelect(reObject);
	$(".choosendTerm,.choosendStartWeek,.choosendEndWeek,.choosendLoaction").html("");
	$(".choosendKjArea").empty();
	$(".kjRsArea ").hide();
}

//填充学年下拉框
function stuffTermArae(termInfo,str){
	for (var i = 0; i < termInfo.length; i++) {
		str += '<option value="' + termInfo[i].edu400_ID + '">' + termInfo[i].xnmc
			+ '</option>';
	}
	stuffManiaSelect("#term", str);
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
function returnStartSchedule(){
	controlScheduleArea();
}

//单个课程排课区域按钮事件绑定
function scheduleSingleClassBtnBind(){
	//返回按钮事件绑定
	$('#returnStartSchedule').unbind('click');
	$('#returnStartSchedule').bind('click', function(e) {
		returnStartSchedule();
		e.stopPropagation();
	});

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

		//根据开始结束周渲染可选分散周数
		var startWeek=parseInt(PKInfo.ksz);
		var endWeek=parseInt(PKInfo.jsz);
		var stuffArray=new Array();
		stuffArray.push(startWeek);
		stuffArray.push(endWeek);

		var currentNum=startWeek;
		for (var g = 0; g < (endWeek-startWeek)-1; g++) {
			currentNum=currentNum+1;
			stuffArray.push(currentNum);
		}
		stuffArray=stuffArray.sort(function(a,b){return a-b});

		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var g = 0; g < stuffArray.length; g++) {
			str += '<option value="' + stuffArray[g] + '">第' + stuffArray[g]+'周</option>';
		}
		stuffManiaSelect("#fsxq", str);

		var checkJzPkRs=checkJzPk(PKInfo,scheduleInfo);
		if(!checkJzPkRs){
			return;
		}

		$(".itab").find("li:eq(1)").find("a").trigger('click');
	}else{
		$(".itab").find("li:eq(2)").find("a").trigger('click');
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
}

//tab3的下一步
function configedAlllastStep(){
	$(".itab").find("li:eq(1)").find("a").trigger('click');
}

//检查是否排完集中
function checkJzPK(){
	var PKInfo=getJzPKInfo(false);
	var scheduleInfo=scheduleDetailInfo(false);
	if(typeof PKInfo ==='undefined'||scheduleInfo.length==0){
		$("#tab2").find(".cannottxt").show();
		$("#tab2").find(".fsMainArea").hide();
	}else{
		$("#tab2").find(".cannottxt").hide();
		$("#tab2").find(".fsMainArea").show();
	}
}

//检查是否起码排完集中
function  checkAllPK(){
	var PKInfo=getJzPKInfo(false);
	var scheduleInfo=scheduleDetailInfo(false);
	if(typeof PKInfo ==='undefined'||scheduleInfo.length==0){
		$("#tab3").find(".cannottxt").show();
		$("#tab3").find(".rsArea").hide();
	}else{
		$("#tab3").find(".cannottxt").hide();
		$("#tab3").find(".rsArea").show();
	}
}

//增加分散学时安排
function addNewFsKj(){
	var fsxq=getNormalSelectValue("fsxq");
	var fsXs=parseInt($("#fsXs").val());
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

	$(".singlefsKj,.choosendfsKjArea").append('<div class="choosendfsKjInfo" xs="'+fsXs+'" fsxq="'+fsxq+'" id="choosendfsKj'+fsxq+'">分散授课安排：第'+fsxq+'周  '+fsXs+'个学时' +
		'<img class="choosendfsKjImg" src="images/close1.png"></img>' +
		'</div>');

	//重置select
	var reObject = new Object();
	reObject.normalSelectIds = "#fsxq";
	reReloadSearchsWithSelect(reObject);
	$("#fsXs").val(0);

	$('.choosendfsKjInfo').unbind('click');
	$('.choosendfsKjInfo').bind('click', function(e) {
		removefsKj(e);
		e.stopPropagation();
	});
	$(".fskjRsArea").show();
}

//课节下拉框事件
function KjBtnschange(){
	var currentXq=getNormalSelectValue("xq");
	var currentKj=getNormalSelectValue("kj");

	if(currentXq===""){
		toastr.warning('请选择星期');
		return;
	}

	if($(".choosendKjArea").find("#choosendKjInfo"+(currentXq+currentKj)).length!==0){
		toastr.warning('该课节安排已选择');
	}
}

//新增课节组
function AddnewKj(){
	var currentXq=getNormalSelectValue("xq");
	var currentKj=getNormalSelectValue("kj");
	var currentXqmc=getNormalSelectText("xq");
	var currentKjmc=getNormalSelectText("kj");
	if(currentXq===""){
		toastr.warning('请选择星期');
		return;
	}
	if(currentKj===""){
		toastr.warning('请选择课节');
		return;
	}

	if($(".choosendKjArea").find("#choosendKjInfo"+(currentXq+currentKj)).length!==0){
		toastr.warning('该课节安排已选择');
		return;
	}
	$(".choosendKjArea,.singleKj").append('<div class="choosendKjInfo" xqmc="'+currentXqmc+'" kjmc="'+currentKjmc+'" xqid="'+currentXq+'" kjid="'+currentKj+'"  id="choosendKjInfo'+(currentXq+currentKj)+'">集中授课安排：每周'+currentXqmc+'  '+currentKjmc+'课' +
		'<img class="choosendKjImg" src="images/close1.png"></img>' +
		'</div>');
	//重置第一个select组
	var reObject = new Object();
	reObject.normalSelectIds = "#kj,#xq";
	reReloadSearchsWithSelect(reObject);

	$('.choosendKjInfo').unbind('click');
	$('.choosendKjInfo').bind('click', function(e) {
		removeKj(e);
		e.stopPropagation();
	});
	$(".kjRsArea").show();
}

//删除课节组
function removeKj(eve){
	var id=eve.currentTarget.id;
	$(".choosendKjArea,.singleKj").find("#"+id).remove();
	var tab1KjInfo=$(".singleKj").find(".choosendKjInfo");
	if(tab1KjInfo.length===0){
		$(".kjRsArea").hide();
	}else{
		$(".kjRsArea").show();
	}

	//重置第一个select组
	var reObject = new Object();
	reObject.normalSelectIds = "#kj,#xq";
	reReloadSearchsWithSelect(reObject);
}

//删除分散课节组
function removefsKj(eve){
	var id=eve.currentTarget.id;
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
}

//根据学年渲染开始结束周
function drawStartAndEndWeek(allWeeks){
	var configStr='<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < allWeeks-1; i++) {
		configStr += '<option value="' + (i+1) + '">第'+(i+1)+'周</option>';
	}
	stuffManiaSelect("#startWeek", configStr);

	configStr='<option value="seleceConfigTip">请选择</option>';
	for (var i =1; i < allWeeks; i++) {
		configStr += '<option value="' + (i+1) + '">第'+(i+1)+'周</option>';
	}
	stuffManiaSelect("#endWeek", configStr);
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
		url: "/getTermInfoById",
		data:{
			"termId":currentXn
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
				drawStartAndEndWeek(backjson.termInfo.zzs);
				$(".choosendTerm").html(currentXnmc+"学年");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认排课
function confirmPk(){
    var PKInfo=getJzPKInfo();
	if(typeof PKInfo ==='undefined'){
		return;
	}

	var scheduleInfo=scheduleDetailInfo();
	if(scheduleInfo.length==0){
		return;
	}

	var checkJzPkRs=checkJzPk(PKInfo,scheduleInfo);
	if(!checkJzPkRs){
		return;
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
			"scheduleInfo":JSON.stringify(PKInfo),
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
function checkJzPk(PKInfo,scheduleInfo){
	var rs=true;
	//根据开始结束周渲染可选分散周数
	var startWeek=parseInt(PKInfo.ksz);
	var endWeek=parseInt(PKInfo.jsz);

	var shouldJzxs=parseInt($(".jzxsSpan")[0].innerText);
	var allWeek=(endWeek-startWeek)+1;
	if(shouldJzxs!=(allWeek*scheduleInfo.length)*2){
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
	if(shouldNum!=choosendFsxs){
		toastr.warning('分散学时不正确');
		return false;
	}

	return rs;
}

//获得集中排课信息
function getJzPKInfo(needToastr){
	var term=getNormalSelectValue("term");
	var termMc=getNormalSelectText("term");
	var startWeek=getNormalSelectValue("startWeek");
	var endWeek=getNormalSelectValue("endWeek");
	var location=getNormalSelectValue("jxd");
	var point=getNormalSelectValue("skdd");
	var taskId = $("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID;

	if(term===""){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择学年');
		}
		return;
	}
	if(startWeek===""){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择开始周');
		}
		return;
	}
	if(endWeek===""){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择结束周');
		}
		return;
	}
	if(location===""){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择教学点');
		}
		return;
	}
	if(point===""){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择授课地点');
		}
		return;
	}

	var returnObject=new Object();
	returnObject.xnid=term;
	returnObject.xnmc=termMc;
	returnObject.ksz=startWeek;
	returnObject.jsz=endWeek;
	returnObject.skddmc=getNormalSelectText("jxd");
	returnObject.skddid=location;
	returnObject.pointid=point;
	returnObject.point=getNormalSelectText("skdd");
	returnObject.edu201_ID=taskId;
	return returnObject;
}

//获得集中星期-课节信息
function scheduleDetailInfo(needToastr){
	var returnArray=new Array();
	var all=$("#tab3").find(".choosendKjInfo");
	for (var i = 0; i < all.length; i++) {
		var thisObject=new Object();
		var current=all[i].attributes;
		thisObject.xqmc=current[1].nodeValue;
		thisObject.kjmc=current[2].nodeValue;
		thisObject.xqid=current[3].nodeValue;
		thisObject.kjid=current[4].nodeValue;
		returnArray.push(thisObject);
	}

	if(returnArray.length==0){
		if(typeof needToastr==="undefined"){
			toastr.warning('请选择课节');
		}
	}
	return returnArray;
}

//获得分散排课信息
function getfsxs(){
	var returnArray=new Array();
	var allFsxsDom=$("#tab3").find(".choosendfsKjInfo");
	for (var i = 0; i <allFsxsDom.length ; i++) {
		var singleObject=new Object();
		singleObject.classHours=allFsxsDom[i].attributes[1].nodeValue;;
		singleObject.week=allFsxsDom[i].attributes[2].nodeValue;
		singleObject.Edu201_ID=$("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID;
		singleObject.courseName=$("#WaitTaskTable").bootstrapTable("getSelections")[0].kcmc;
		returnArray.push(singleObject);
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
		return;
	}
	if($(".choosendLoaction").length===0){
		$(".choosendLoactionArea").append('<span class="choosendLoaction">在'+choosendsite+'-'+choosendLoaction+'授课</span>');
	}else{
		$(".choosendLoaction").html('在'+choosendsite+'-'+choosendLoaction+'授课');
	}

}

//返回待排课程区域
function controlScheduleArea(){
	$(".scheduleClassesMainArea").toggle();
	$(".scheduleSingleClassArea").toggle();
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
	puttedScheduleControlArea();
	getPuttedTaskSelectInfo();
	puttedScheduleBtnBind();
	drawEmptyPuttedTable();
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
			"searchCondition":JSON.stringify(getPuttedSelectValue())
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
		columns: [
			{
			field : 'check',
			checkbox : true
		}, {
				field: 'edu202_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'className',
				title: '班级名称',
				align: 'left',
				formatter: paramsMatter

			}, 	{
				field: 'kcmc',
				title: '课程',
				align: 'left',
				formatter: paramsMatter

			},{
				field: 'zyls',
				title: '主要老师',
				align: 'left',
				formatter: charSpiltMatter

			},{
				field: 'ls',
				title: '老师',
				align: 'left',
				formatter: charSpiltMatter
			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'center',
				width:'15%',
				formatter: sfxylcjMatter
			},{
				field: 'kkbm',
				title: '开课部门',
				align: 'left',
				formatter: paramsMatter
			},	{
				field: 'pkbm',
				title: '排课部门',
				align: 'left',
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
	$(".puttedKjArea").find(".PuttedKjArea").remove();
	$(".puttedfsKjArea").find(".PuttedfsKjArea").remove();

	$("#puttedTerm").val(scheduleCompletedDetails.xn);
	$("#puttedSkdd").val(scheduleCompletedDetails.skddmc);
	$("#puttedJxbMC").val(puttedInfo.className);
	$("#puttedkCMC").val(puttedInfo.kcmc);
	$("#puttedZyls").val(puttedInfo.zyls);
	$("#puttedLs").val(puttedInfo.ls);
	$("#puttedKsz").val(scheduleCompletedDetails.ksz);
	$("#puttedJsz").val(scheduleCompletedDetails.jsz);
	$('#puttedInfoModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly

	var classPeriodList=scheduleCompletedDetails.classPeriodList;
	for (var i = 0; i < classPeriodList.length; i++) {
		$(".puttedKjArea").append('<div class="PuttedKjArea">'+classPeriodList[i].xqmc+' '+classPeriodList[i].kjmc+'</div>');
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
}

//已排排重置检索
function putted_reSearch(){
	var reObject = new Object();
	reObject.normalSelectIds = "#puttedlevel,#putteddepartment,#puttedgrade,#puttedmajor,#puttedkcxz";
	reReloadSearchsWithSelect(reObject);
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
		$(".itab").find("li:eq(0)").find("a").trigger('click');
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


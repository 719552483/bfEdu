var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getTaskSelectInfo();
	drawWaitTaskEmptyTable();
	btnControl();
	binBind();
});

//获取-专业培养计划- 有逻辑关系select信息
function getTaskSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		if(getNormalSelectValue("major")===""){
			return;
		}
		
		$.ajax({
			method : 'get',
			cache : false,
			url : "/getTaskByCulturePlan",
			data: {
	             "culturePlanInfo":JSON.stringify(getNotNullSearchs()) 
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
					var str ="";
					if(backjson.calssInfo.length===0){
						str = '<option value="seleceConfigTip">无可选教学班</option>';
					}else{
						str = '<option value="seleceConfigTip">请选择</option>';
						for (var i = 0; i < backjson.calssInfo.length; i++) {
							str += '<option value="' + backjson.calssInfo[i].edu301_ID + '">' +backjson.calssInfo[i].jxbmc
									+ '</option>';
					     }
						stuffManiaSelect("#jxb", str);
					}
					
					if(backjson.taskInfo.length===0){
						toastr.info('暂无可排课程');
						drawWaitTaskEmptyTable();
					}else{
						stuffWaitTaskTable(backjson.taskInfo);
					}
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
	
	$("#jxb").change(function() {
		if(getNormalSelectValue("jxb")==""){
			return;
		}
		contorlWaitTaskTableByJxb(getNormalSelectText("jxb"));
	});
	
	$("#kcxz").change(function() {
		if(getNormalSelectValue("kcxz")==""){
			return;
		}
		var SearchObject=getNotNullSearchs();
		if(typeof(SearchObject) === "undefined"){
			return;
		}
		SearchObject.jxbID=getNormalSelectValue("jxb");
		SearchObject.kcxz=getNormalSelectValue("kcxz");
		
		$.ajax({
			method : 'get',
			cache : false,
			url : "/kcxzBtnGetTask",
			data: {
	             "SearchObject":JSON.stringify(SearchObject)
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
					if(backjson.taskInfo.length===0){
						drawWaitTaskEmptyTable();
					}else{
						stuffWaitTaskTable(backjson.taskInfo);
					}
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

//根据教学班名称过滤表格
function contorlWaitTaskTableByJxb(choosedJxbMc){
	var all = $("#WaitTaskTable").bootstrapTable("getData");
	if(choosedJxbMc===""){
		for (var i = 0; i < all.length; i++) {
			$(".WaitTaskTableArea").find("table").find("tbody").find("tr:eq("+i+")").show();
		}
		return;
	}
	
	var hideNum=0;
	for (var i = 0; i < all.length; i++) {
		if(choosedJxbMc===all[i].jxbmc){
			$(".WaitTaskTableArea").find("table").find("tbody").find("tr:eq("+i+")").show();
		}else if(choosedJxbMc!==all[i].jxbmc){
			$(".WaitTaskTableArea").find("table").find("tbody").find("tr:eq("+i+")").hide();
			hideNum++;
		}
	}
	
	if(hideNum===all.length){
		if($(".WaitTaskTableArea").find("table").find("tbody").find(".no-records-found").length<=0){
			$(".WaitTaskTableArea").find("table").find("tbody").append('<tr class="no-records-found"><td colspan="8">暂无数据.....</td></tr>');
		}
	}else{
		$(".WaitTaskTableArea").find("table").find("tbody").find(".no-records-found").remove();
	}
}

//根据课程名称过滤表格
function contorlWaitTaskTableBykcmc(choosedkcmc){
	var all = $("#WaitTaskTable").bootstrapTable("getData");
	if(choosedkcmc===""){
		return;
	}
	
	var hideNum=0;
	for (var i = 0; i < all.length; i++) {
		if(choosedkcmc===all[i].kcmc){
			$(".WaitTaskTableArea").find("table").find("tbody").find("tr:eq("+i+")").show();
		}else if(choosedkcmc!==all[i].jxbmc){
			$(".WaitTaskTableArea").find("table").find("tbody").find("tr:eq("+i+")").hide();
			hideNum++;
		}
	}
	
	if(hideNum===all.length){
		if($(".WaitTaskTableArea").find("table").find("tbody").find(".no-records-found").length<=0){
			$(".WaitTaskTableArea").find("table").find("tbody").append('<tr class="no-records-found"><td colspan="8">暂无数据.....</td></tr>');
		}
	}else{
		$(".WaitTaskTableArea").find("table").find("tbody").find(".no-records-found").remove();
	}
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
					field: 'jxbmc',
					title: '教学班名称',
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
					formatter: paramsMatter

				},{
					field: 'lsmc',
					title: '老师',
					align: 'left',
					formatter: paramsMatter
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

//获取所有显示的行数据
function getShowTableRow(){
	var all = $("#WaitTaskTable").bootstrapTable("getData");
	var returnArray=new Array;
	for (var i = 0; i < all.length; i++) {
		var currentRow=$(".WaitTaskTableArea").find("table").find("tbody").find("tr:eq("+i+")");
		if(!currentRow.is(':hidden')){
			returnArray.push(all[i]);
		}
	}
	return returnArray;
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
	//确认排课按钮
	$('#confirm').unbind('click');
	$('#confirm').bind('click', function(e) {
		confirmPk();
		e.stopPropagation();
	});

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

				var configSelectTxt="请选择";
				var termStr='<option value="seleceConfigTip">'+configSelectTxt+'</option>';
				var siteStr='<option value="seleceConfigTip">'+configSelectTxt+'</option>';

				for (var i = 0; i < backjson.termInfo.length; i++) {
					termStr += '<option value="' + backjson.termInfo[i].edu400_ID + '">' + backjson.termInfo[i].xnmc
						+ '</option>';
				}
				stuffManiaSelect("#term", termStr);
				for (var i = 0; i < backjson.jxdInfo.length; i++) {
					siteStr += '<option value="' + backjson.jxdInfo[i].edu500Id + '">' + backjson.jxdInfo[i].jxdmc
						+ '</option>';
				}
				stuffManiaSelect("#skdd", siteStr);

				stuffKjTables(backjson.kjInfo);

				$(".scheduleClassesMainArea").hide();
				$(".scheduleSingleClassArea").show();
				$(".scheduleInfo").html(culturePlanInfo.levelTxt+" "+culturePlanInfo.departmentTxt+" "+culturePlanInfo.gradeTxt+" "+culturePlanInfo.majorTxt+" "+choosedTask[0].kcmc);

				//为学年绑定change事件 重载开始结束周信息
				$("#term").change(function() {
					$(".rsArea").show();
					redrawStartAndEndWeek();
				});
				//返回按钮事件绑定
				$('#returnStartSchedule').unbind('click');
				$('#returnStartSchedule').bind('click', function(e) {
					returnStartSchedule();
					e.stopPropagation();
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
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

//填充课节信息的三个表
function stuffKjTables(kjInfo){
	var ForenoonArray=new Array();
	var AfternoonArray=new Array();
	var EveingArray=new Array();
	for (var i = 0; i < kjInfo.length; i++) {
        if(kjInfo[i].sjd==="forenoon"){
			ForenoonArray.push(kjInfo[i]);
		}else if(kjInfo[i].sjd==="afternoon"){
			AfternoonArray.push(kjInfo[i]);
		}else{
			EveingArray.push(kjInfo[i]);
		}
	}

	//上午表
	$('#kjForForenoonTable').bootstrapTable('destroy').bootstrapTable({
		data: ForenoonArray,
		pagination: true,
		pageNumber: 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: false,
		editable: false,
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: false,
		onPageChange: function() {
			drawPagination(".kjForForenoonArea", "上午课节");
		},
		columns: [
			{
				field : 'check',
				checkbox : true
			},{
				field: 'edu401_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'kjsx',
				title: '课节顺序',
				align: 'left',
				formatter: paramsMatter
			}, 	{
				field: 'kjmc',
				title: '课节名称',
				align: 'left',
				formatter: paramsMatter

			}
		]
	});
	drawPagination(".kjForForenoonArea", "上午课节");
	toolTipUp(".myTooltip");

	//下午表
	$('#kjFoAfternoonTable').bootstrapTable('destroy').bootstrapTable({
		data: AfternoonArray,
		pagination: true,
		pageNumber: 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: false,
		editable: false,
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: false,
		onPageChange: function() {
			drawPagination(".kjFoAfternoonArea", "下午课节");
		},
		columns: [
			{
				field : 'check',
				checkbox : true
			},{
				field: 'edu401_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'kjsx',
				title: '课节顺序',
				align: 'left',
				formatter: paramsMatter
			}, 	{
				field: 'kjmc',
				title: '课节名称',
				align: 'left',
				formatter: paramsMatter

			}
		]
	});
	drawPagination(".kjFoAfternoonArea", "下午课节");
	toolTipUp(".myTooltip");


	//晚上表
	$('#kjForEveingTable').bootstrapTable('destroy').bootstrapTable({
		data: EveingArray,
		pagination: true,
		pageNumber: 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: false,
		editable: false,
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: false,
		onPageChange: function() {
			drawPagination(".kjForEveingTableArea", "晚上课节");
		},
		columns: [
			{
				field : 'check',
				checkbox : true
			},{
				field: 'edu401_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'kjsx',
				title: '课节顺序',
				align: 'left',
				formatter: paramsMatter
			}, 	{
				field: 'kjmc',
				title: '课节名称',
				align: 'left',
				formatter: paramsMatter

			}
		]
	});
	drawPagination(".kjForEveingTableArea", "晚上课节");
	toolTipUp(".myTooltip");
}

//返回待排课程区域
function returnStartSchedule(){
	$(".scheduleClassesMainArea").show();
	$(".scheduleSingleClassArea").hide();
}

//重新渲染开始结束周
function redrawStartAndEndWeek(){
	var currentXn=getNormalSelectValue("term");
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
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认排课
function confirmPk(){
    var PkInfo=getPKInfo();
	if(typeof PkInfo ==='undefined'){
		return;
	}
	$.ajax({
		method: 'get',
		cache: false,
		url: "/comfirmSchedule",
		data:{
			"scheduleInfo":JSON.stringify(PkInfo)
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
				returnStartSchedule();
				toastr.success('排课成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获得排课信息
function getPKInfo(){
	var term=getNormalSelectValue("term");
	var startWeek=getNormalSelectValue("startWeek");
	var endWeek=getNormalSelectValue("endWeek");
	var location=getNormalSelectValue("skdd");
	var kjArrays=new Array();
	var kjmcArrays=new Array();
	var choosedkjForForenoon = $("#kjForForenoonTable").bootstrapTable("getSelections");
	var choosedkjFoAfternoon = $("#kjFoAfternoonTable").bootstrapTable("getSelections");
	var choosedkjForEveing = $("#kjForEveingTable").bootstrapTable("getSelections");
	var taskId = $("#WaitTaskTable").bootstrapTable("getSelections")[0].edu201_ID;
	for (var i = 0; i < choosedkjForForenoon.length; i++) {
		kjArrays.push(choosedkjForForenoon[i].edu401_ID);
		kjmcArrays.push(choosedkjForForenoon[i].kjmc)
	}
	for (var i = 0; i < choosedkjFoAfternoon.length; i++) {
		kjArrays.push(choosedkjFoAfternoon[i].edu401_ID);
		kjmcArrays.push(choosedkjFoAfternoon[i].kjmc)
	}
	for (var i = 0; i < choosedkjForEveing.length; i++) {
		kjArrays.push(choosedkjForEveing[i].edu401_ID);
		kjmcArrays.push(choosedkjForEveing[i].kjmc)
	}
	if(term===""){
		toastr.warning('请选择学年');
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
	if(location===""){
		toastr.warning('请选择授课地点');
		return;
	}
	if(kjArrays.length===0){
		toastr.warning('请选择课节');
		return;
	}
	var returnObject=new Object();
	returnObject.xnid=term;
	returnObject.ksz=startWeek;
	returnObject.jsz=endWeek;
	returnObject.skddmc=getNormalSelectText("skdd");
	returnObject.skddid=location;
	returnObject.kjid=JSON.stringify(kjArrays) ;
	returnObject.kjmc=JSON.stringify(kjmcArrays);
	returnObject.edu201_ID=taskId;
	return returnObject;
}

//必选检索条件检查
function getNotNullSearchs() {
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");

	if (levelValue == "") {
		toastr.warning('层次不能为空');
		return;
	}

	if (departmentValue == "") {
		toastr.warning('系部不能为空');
		return;
	}

	if (gradeValue == "") {
		toastr.warning('年级不能为空');
		return;
	}

	if (majorValue == "") {
		toastr.warning('专业不能为空');
		return;
	}
	var levelText = getNormalSelectText("level");
	var departmentText = getNormalSelectText("department");
	var gradeText =getNormalSelectText("grade");
	var majorText =getNormalSelectText("major");
	
	var returnObject = new Object();
	returnObject.level = levelValue;
	returnObject.department = departmentValue;
	returnObject.grade = gradeValue;
	returnObject.major = majorValue;
	returnObject.levelTxt = levelText;
	returnObject.departmentTxt = departmentText;
	returnObject.gradeTxt = gradeText;
	returnObject.majorTxt = majorText;
	return returnObject;
}

//初始化页面按钮绑定事件
function binBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
	
	//开始排课按钮
	$('#startSchedule').unbind('click');
	$('#startSchedule').bind('click', function(e) {
		startSchedule();
		e.stopPropagation();
	});
	
}
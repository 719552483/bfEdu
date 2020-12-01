var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getAllRelationInfo();
	tab1BtnBind();
	$("input[type='number']").inputSpinner();
	$("#addNewRelation_department").change(function() {
		getMajroByDeparment(getNormalSelectValue("addNewRelation_department"),getNormalSelectValue("addNewRelation_department"));
	});
});

/**
 * tab3
 * */
//层次关系管理页面按钮事件绑定
function tab1BtnBind(){
	//批量删除关系
	$('#removeRelations').unbind('click');
	$('#removeRelations').bind('click', function(e) {
		removeRelations();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//预备新增关系
	$('#addRelation').unbind('click');
	$('#addRelation').bind('click', function(e) {
		wantAddRelation();
		e.stopPropagation();
	});

	//开始检索层次关系
	$('#startSearch_relation').unbind('click');
	$('#startSearch_relation').bind('click', function(e) {
		relationStartSearch();
		e.stopPropagation();
	});

	//层次关系重置检索
	$('#reReloadSearchs_relation').unbind('click');
	$('#reReloadSearchs_relation').bind('click', function(e) {
		relationReloadSearchs();
		e.stopPropagation();
	});

	//返回初始页面
	$('#returnStart').unbind('click');
	$('#returnStart').bind('click', function(e) {
		returnStart();
		e.stopPropagation();
	});
}

//获取所有层次关系
function getAllRelationInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRelationInfo",
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
				stuffAllRelationInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				stuffAllRelationInfoTable(backjson.data);
			}
		}
	});
}

var choosendRelation=new Array();

//填充层次关系管理表
function stuffAllRelationInfoTable(allRelationInfo){
	window.releaseNewsEvents = {
		'click #modifyRelation': function(e, value, row, index) {
			modifyRelation(row);
		},
		'click #removeRelation': function(e, value, row, index) {
			removeRelation(row);
		},
		'click #makePlan': function(e, value, row, index) {
			makePlan(row);
		}
	};

	$('#relationTable').bootstrapTable('destroy').bootstrapTable({
		data: allRelationInfo,
		pagination: true,
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
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: '培养计划导出'  //文件名称
		},
		onCheck : function(row) {
			onCheckRelation(row);
		},
		onUncheck : function(row) {
			onUncheckRelation(row);
		},
		onCheckAll : function(rows) {
			onCheckAllRelation(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllRelation(rows2);
		},
		onPageChange: function() {
			drawPagination(".relationTableArea", "培养计划信息");
			for (var i = 0; i < choosendRelation.length; i++) {
				$("#relationTable").bootstrapTable("checkBy", {field:"edu107_ID", values:[choosendRelation[i].edu107_ID]})
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [{
			field: 'edu107_ID',
			title: 'edu107_ID',
			align: 'center',
			sortable: true,
			visible: false
		}, {
			field: 'yxbz',
			title: '有效标志',
			align: 'left',
			sortable: true,
			visible: false
		}, {
				field: 'check',
				checkbox: true
			},{
				field: 'xbsp',
				title: '二级学院审批',
				align: 'left',
				width:"20",
				sortable: true,
				formatter: approvalMatter
			},
			{
				field: 'edu103mc',
				title: '培养层次名称',
				align: 'left',
				sortable: true,
				width:"20px",
				formatter: paramsMatter
			},
			{
				field: 'edu103',
				title: '培养层次代码',
				align: 'left',
				sortable: true,
				visible: false
			},
			{
				field: 'edu104mc',
				title: '二级学院名称',
				align: 'left',
				sortable: true,
				width:"50px",
				formatter: paramsMatter
			},{
				field: 'edu104',
				title: '二级学院编码',
				align: 'left',
				sortable: true,
				visible: false
			},{
				field: 'edu105mc',
				title: '年级名称',
				align: 'left',
				sortable: true,
				width:"20px",
				formatter: paramsMatter
			},{
				field: 'edu105',
				title: '年级编码',
				align: 'left',
				sortable: true,
				visible: false
			},{
				field: 'edu106mc',
				title: '专业名称',
				align: 'left',
				sortable: true,
				width:"180px",
				formatter: paramsMatter
			},{
				field: 'edu106',
				title: '专业编码',
				align: 'left',
				sortable: true,
				visible: false
			},	{
				field: 'pyjhmc',
				title: '培养计划名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'batchName',
				title: '批次',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: releaseNewsFormatter,
				events: releaseNewsEvents,
			}
		]
	});

	function releaseNewsFormatter(value, row, index) {
		return [
			'<ul class="toolbar tabletoolbar">' +
			'<li id="modifyRelation" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
			'<li id="makePlan" class="modifyBtn"><span><img src="images/icon03.png" style="width:24px"></span>培养计划定制</li>' +
			'<li id="removeRelation" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
			'</ul>'
		]
			.join('');
	}
	drawSearchInput(".relationTableArea");
	drawPagination(".relationTableArea", "培养计划信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//单选学生
function onCheckRelation(row){
	if(choosendRelation.length<=0){
		choosendRelation.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendRelation.length; i++) {
			if(choosendRelation[i].edu107_ID===row.edu107_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendRelation.push(row);
		}
	}
}

//单反选学生
function onUncheckRelation(row){
	if(choosendRelation.length<=1){
		choosendRelation.length=0;
	}else{
		for (var i = 0; i < choosendRelation.length; i++) {
			if(choosendRelation[i].edu107_ID===row.edu107_ID){
				choosendRelation.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllRelation(row){
	for (var i = 0; i < row.length; i++) {
		choosendRelation.push(row[i]);
	}
}

//全反选学生
function onUncheckAllRelation(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu107_ID);
	}


	for (var i = 0; i < choosendRelation.length; i++) {
		if(a.indexOf(choosendRelation[i].edu107_ID)!==-1){
			choosendRelation.splice(i,1);
			i--;
		}
	}
}

//预备修改关系
function modifyRelation(row){
	if(row.xbsp==="passing"){
		toastr.warning("不能修改审批中的培养计划");
		return;
	}

	stufDeadultRelation(row);
	$.showModal("#addNewRelationModal",true);
	$("#addNewRelationModal").find(".moadalTitle").html("修改培养计划");
	//确认新增关系按钮
	$('.addNewRelationTip_confimBtn').unbind('click');
	$('.addNewRelationTip_confimBtn').bind('click', function(e) {
		confimModifyRelation(row);
		e.stopPropagation();
	});
}

//修改时填充该行信息到层次关系选择区
function stufDeadultRelation(row){
	$("#addNewRelation_RelationName").val(row.pyjhmc);//填充默认培养计划名称
	var str ="";
	//层次
	str = '<option value="' + row.edu103 + '">' + row.edu103mc+ '</option>';
	stuffManiaSelect('#addNewRelation_level', str);
	//系部
	str = '<option value="' + row.edu104 + '">' + row.edu104mc+ '</option>';
	stuffManiaSelect('#addNewRelation_department', str);
	//年级
	str = '<option value="' + row.edu105 + '">' + row.edu105mc+ '</option>';
	stuffManiaSelect('#addNewRelation_garde', str);
	//专业
	str = '<option value="' + row.edu106 + '">' + row.edu106mc+ '</option>';
	stuffManiaSelect('#addNewRelation_major', str);
	//批次
	str = '<option value="' + row.batch + '">' + row.batchName+ '</option>';
	stuffManiaSelect('#addNewRelation_bath', str);
}

//确认修改关系
function confimModifyRelation(row){
	var newRelationObject=getRelationSelectInfo();

	if(typeof newRelationObject ==='undefined'){
		return;
	}
	newRelationObject.yxbz=row.yxbz;
	newRelationObject.edu107_ID=row.edu107_ID;
	newRelationObject.xbsp=row.xbsp;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewRelation",
		data: {
			"newRelationInfo":JSON.stringify(newRelationObject)
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
				$("#relationTable").bootstrapTable('updateByUniqueId', {
					id: row.edu107_ID,
					row: newRelationObject
				});
				toastr.success(backjson.msg);
				$.hideModal("#addNewRelationModal");
				$(".myTooltip").tooltipify();
				drawPagination(".relationTableArea", "培养计划信息");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//预备新增关系
function wantAddRelation(){
	$.showModal("#addNewRelationModal",true);
	$("#addNewRelationModal").find(".moadalTitle").html("新增培养计划");
	emptyRelationChooseArea();
	stuffRelationTipSelect();
	//确认新增关系按钮
	$('.addNewRelationTip_confimBtn').unbind('click');
	$('.addNewRelationTip_confimBtn').bind('click', function(e) {
		confimAddNewRelation();
		e.stopPropagation();
	});
}

//确认新增关系
function confimAddNewRelation(){
	var newRelationObject=getRelationSelectInfo();
	if(typeof newRelationObject ==='undefined'){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewRelation",
		data: {
			"newRelationInfo":JSON.stringify(newRelationObject)
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
				newRelationObject.edu107_ID=backjson.data.edu107_ID;
				newRelationObject.yxbz=backjson.data.yxbz;
				$('#relationTable').bootstrapTable('prepend', newRelationObject);
				toastr.success(backjson.msg);
				$.hideModal("#addNewRelationModal");
				$(".myTooltip").tooltipify();
				drawPagination(".relationTableArea", "培养计划信息");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得关系模态框中select 的值
function getRelationSelectInfo(){
	var relationlLevelValue = getNormalSelectValue("addNewRelation_level");
	var relationlLevelText = getNormalSelectText("addNewRelation_level");
	var relationDepartmentValue = getNormalSelectValue("addNewRelation_department");
	var relationDepartmentText = getNormalSelectText("addNewRelation_department");
	var relationGardeValue = getNormalSelectValue("addNewRelation_garde");
	var relationGardeText = getNormalSelectText("addNewRelation_garde");
	var relationMmajorValue = getNormalSelectValue("addNewRelation_major");
	var relationMmajorText = getNormalSelectText("addNewRelation_major");
	var batch = getNormalSelectValue("addNewRelation_bath");
	var batchName = getNormalSelectText("addNewRelation_bath");
	var relationName =$("#addNewRelation_RelationName").val();


	if(relationName===""){
		toastr.warning('培养计划名称不能为空');
		return;
	}

	if(relationlLevelValue===""){
		toastr.warning('请选择培养层次');
		return;
	}

	if(relationDepartmentValue===""){
		toastr.warning('请选择二级学院');
		return;
	}

	if(relationGardeValue===""){
		toastr.warning('请选择年级');
		return;
	}
	if(relationMmajorValue===""){
		toastr.warning('请选择专业');
		return;
	}
	if(batch===""){
		toastr.warning('请选择批次');
		return;
	}

	var newRelationObject=new Object();
	newRelationObject.edu103mc=relationlLevelText;
	newRelationObject.edu104mc=relationDepartmentText;
	newRelationObject.edu105mc=relationGardeText;
	newRelationObject.edu106mc=relationMmajorText;
	newRelationObject.batchName=batchName;
	newRelationObject.edu103=relationlLevelValue;
	newRelationObject.edu104=relationDepartmentValue;
	newRelationObject.edu105=relationGardeValue;
	newRelationObject.edu106=relationMmajorValue;
	newRelationObject.batchName=batchName;
	newRelationObject.batch=batch;
	newRelationObject.pyjhmc=relationName;
	return newRelationObject;
}

//清空关系模态框中select的值
function emptyRelationChooseArea(){
	var reObject = new Object();
	reObject.normalSelectIds = "#addNewRelation_level,#addNewRelation_department,#addNewRelation_garde,#addNewRelation_major";
	reObject.InputIds = "#addNewRelation_RelationName";
	reReloadSearchsWithSelect(reObject);

	//批次
	var str='<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < EJDMElementInfo.pclx.length; i++) {
		str += '<option value="' + EJDMElementInfo.pclx[i].ejdm + '">' + EJDMElementInfo.pclx[i].ejdmz+ '</option>';
	}
	stuffManiaSelect('#addNewRelation_bath', str);
}

//根据表格填充新增关系待选项
function stuffRelationTipSelect(){
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
				var allLevls=backjson.allLevel;
				var allDepartment=backjson.allDepartment;
				var allGrade=backjson.allGrade;
				//层次下拉框
				if(allLevls.length!==0){
					var str = '<option value="seleceConfigTip">请选择</option>';
					for (var i = 0; i < allLevls.length; i++) {
						str += '<option value="' + allLevls[i].edu103_ID + '">' + allLevls[i].pyccmc + '</option>';
					}
					stuffManiaSelect("#addNewRelation_level", str);
				}

				//二级学院下拉框
				if(allDepartment.length!==0){
					var str = '<option value="seleceConfigTip">请选择</option>';
					for (var i = 0; i < allDepartment.length; i++) {
						str += '<option value="' + allDepartment[i].edu104_ID + '">' + allDepartment[i].xbmc + '</option>';
					}
					stuffManiaSelect("#addNewRelation_department", str);
				}

				//年级下拉框
				if(allGrade.length!==0){
					var str = '<option value="seleceConfigTip">请选择</option>';
					for (var i = 0; i < allGrade.length; i++) {
						str += '<option value="' + allGrade[i].edu105_ID + '">' + allGrade[i].njmc + '</option>';
					}
					stuffManiaSelect("#addNewRelation_garde", str);
				}
			} else {
				toastr.warning('获取公共代码信息失败，请重试');
			}
		}
	});
}

//根据系部获取专业
function getMajroByDeparment(departmentId,departmentName){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchMajorByDepartment",
		data: {
			"departmentCode":departmentId
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
				var allMajor=backjson.data;
				//专业下拉框
				if(allMajor.length!==0){
					var str = '<option value="seleceConfigTip">请选择</option>';
					for (var i = 0; i < allMajor.length; i++) {
						str += '<option value="' + allMajor[i].edu106_ID + '">' + allMajor[i].zymc + '</option>';
					}
					stuffManiaSelect("#addNewRelation_major", str);
				}
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//单个删除关系
function removeRelation(row){
	if(row.xbsp==="passing"){
		toastr.warning("不能删除审批中的培养计划");
		return;
	}
	if(row.xbsp==="pass"){
		toastr.warning("不能删除审批通过的培养计划");
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("培养计划");
	$(".remindActionType").html("删除");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.edu107_ID);
		sendRelationRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//批量删除关系
function removeRelations() {
	var chosenRelations = choosendRelation;
	if (chosenRelations.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}

	for (var i = 0; i <chosenRelations.length ; i++) {
		if(chosenRelations[i].xbsp==="passing"){
			toastr.warning("包含审批中的培养计划");
			return;
		}
		if(chosenRelations[i].xbsp==="pass"){
			toastr.warning("包含审批通过的培养计划");
			return;
		}
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("培养计划");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenRelations.length; i++) {
			removeArray.push(chosenRelations[i].edu107_ID);
		}
		sendRelationRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除关系请求
function sendRelationRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeRelation",
		data: {
			"deleteIds":JSON.stringify(removeArray)
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
				if (backjson.canRemove) {
					tableRemoveAction("#relationTable", removeArray, ".relationTableArea", "培养计划信息");
					$.hideModal("#remindModal");
					$(".myTooltip").tooltipify();
				}else{
					toastr.warning('不能删除正在使用的培养计划');
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//开始检索层次关系
function relationStartSearch(){
	var lvelName=$("#relation_seaechLvel").val();
	var deaparmentName=$("#relation_seaechDeaparment").val();
	var gradeName=$("#relation_seaechGrade").val();
	var majorName=$("#relation_seaechMajor").val();
	if(lvelName===""&&deaparmentName===""&&gradeName===""&&majorName===""){
		toastr.warning('请输入检索条件');
		return;
	}

	var serachObject=new Object();
	lvelName===""?serachObject.lvelName="":serachObject.lvelName=lvelName;
	deaparmentName===""?serachObject.deaparmentName="":serachObject.deaparmentName=deaparmentName;
	gradeName===""?serachObject.gradeName="":serachObject.gradeName=gradeName;
	majorName===""?serachObject.majorName="":serachObject.majorName=majorName;

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/seacchRelation",
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
				stuffAllRelationInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//层次关系重置检索
function relationReloadSearchs(){
	var reObject = new Object();
	reObject.InputIds = "#relation_seaechRelationName,#relation_seaechLvel,#relation_seaechDeaparment,#relation_seaechGrade,#relation_seaechMajor";
	reReloadSearchsWithSelect(reObject);
	getAllRelationInfo();
}

//定制培养计划
function makePlan(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryCulturePlanCouses",
		data: {
			"edu107Id":JSON.stringify(row.edu107_ID),
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
			$(".myPlaceul").append('<li><a>'+row.pyjhmc+'</a></li>');
			$(".startArea").toggle();
			$(".culturePlanArea").toggle();
			$(".edu107Id").html(row.edu107_ID);
			$(".planName").html(row.edu103mc+'/'+row.edu104mc+'/'+row.edu105mc+'/'+row.edu106mc);
			$(".planStatus").html(row.xbsp);
			for (var i = 0; i < backjson.data.length; i++) {
				backjson.data[i].xbsp=row.xbsp;
			}
			stuffMajorTrainingTable(backjson.data);
			binBind();
			if(backjson.code===500){
				toastr.info(backjson.msg);
			}
		}
	});
}

//返回初始页面
function returnStart(){
	$(".startArea").toggle();
	$(".culturePlanArea").toggle();
	$(".edu107Id,.planName").html("");
	$('.myPlaceul').find("li:last").remove();
}
/**
 * tab3 end
 * */

// 渲染空专业培养计划表格
function drawMajorTrainingEmptyTable() {
	stuffMajorTrainingTable({});
}

var choosendMajorTraining=new Array();
// 渲染培养计划表格
function stuffMajorTrainingTable(tableInfo) {
	window.releaseNewsEvents = {
		'click #removeMajorTraining' : function(e, value, row, index) {
			removeMajorTraining(row)
		},
		'click #majorTrainingInfo' : function(e, value, row, index) {
			majorTrainingInfo(row);
		},
		'click #modifyMajorTraining' : function(e, value, row, index) {
			modifyMajorTraining(row);
		}
	};

	$('#majorTrainingTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		exportDataType: "all",  
		showExport: true,      //是否显示导出
		exportOptions:{  
		    fileName: '培养计划导出'  //文件名称
		},
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onCheck : function(row) {
			onCheckMajorTraining(row);
		},
		onUncheck : function(row) {
			onUncheckMajorTraining(row);
		},
		onCheckAll : function(rows) {
			onCheckAllMajorTraining(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllMajorTraining(rows2);
		},
		onPageChange : function() {
			drawPagination(".majorTrainingTableArea", "专业课程");
			for (var i = 0; i < choosendMajorTraining.length; i++) {
				$("#majorTrainingTable").bootstrapTable("checkBy", {field:"edu108_ID", values:[choosendMajorTraining[i].edu108_ID]})
			}
		},
		columns : [ {
			field : 'check',
			checkbox : true
		}, {
			field : 'edu108_ID',
			title: '唯一标识',
			align : 'center',
			visible : false
		}, {
			field : 'sfsckkjh',
			title : '是否生成开课计划',
			align : 'center',
			visible : false,
			formatter : sfsckkjhMatter
		}, {
			field : 'kcmc',
			title : '课程名称',
			align : 'left',
			formatter : calssNameMatter
		},{
			field : 'llxs',
			title : '理论学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'sjxs',
			title : '实践学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zxs',
			title : '总学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zhouxs',
			title : '周学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xf',
			title : '学分',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kclx',
			title : '课程类型',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kcxz',
			title : '课程性质',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'ksfs',
			title : '考试方式',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'fkyj',
			title : '反馈意见',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : releaseNewsFormatter,
			events : releaseNewsEvents,
		} ]
	});

	function releaseNewsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
				+ '<li class="queryBtn" id="majorTrainingInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
				+ '<li class="modifyBtn" id="modifyMajorTraining"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
				+ '<li class="deleteBtn" id="removeMajorTraining"><span><img src="images/t03.png"></span>删除</li>'
				+ '</ul>' ].join('');
	}

	function sfsckkjhMatter(value, row, index) {
		if(value !== 'T'){
			return [ '<div class="myTooltip normalTxt" title="暂未生成"><i class="iconfont icon-chacha redTxt"></i></div>' ]
				.join('');
		}else{
			return [ '<div class="myTooltip greenTxt" title="已生成"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
				.join('');
		}
	}

	drawPagination(".majorTrainingTableArea", "专业课程");
	drawSearchInput(".majorTrainingTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".majorTrainingTableArea", "专业课程");
	btnControl();
}

//单选学生
function onCheckMajorTraining(row){
	if(choosendMajorTraining.length<=0){
		choosendMajorTraining.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendMajorTraining.length; i++) {
			if(choosendMajorTraining[i].edu108_ID===row.edu108_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendMajorTraining.push(row);
		}
	}
}

//单反选学生
function onUncheckMajorTraining(row){
	if(choosendMajorTraining.length<=1){
		choosendMajorTraining.length=0;
	}else{
		for (var i = 0; i < choosendMajorTraining.length; i++) {
			if(choosendMajorTraining[i].edu108_ID===row.edu108_ID){
				choosendMajorTraining.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllMajorTraining(row){
	for (var i = 0; i < row.length; i++) {
		choosendMajorTraining.push(row[i]);
	}
}

//全反选学生
function onUncheckAllMajorTraining(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu108_ID);
	}


	for (var i = 0; i < choosendMajorTraining.length; i++) {
		if(a.indexOf(choosendMajorTraining[i].edu108_ID)!==-1){
			choosendMajorTraining.splice(i,1);
			i--;
		}
	}
}

// 查看培养计划详情
function majorTrainingInfo(row) {
	showAndStuffDetails(row,false);
	$('.majorTrainingTableActionArea').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$(".myabeNoneTipBtn").hide();
}

// 修改培养计划
function modifyMajorTraining(row) {
	if(row.sfsckkjh==="T"){
		toastr.warning('不能修改已生成开课计划的课程');
		return;
	}
	if($(".planStatus")[0].innerText==="passing"){
		toastr.warning('该培养计划暂不可进行此操作');
		return;
	}
	showAndStuffDetails(row,true);
	$('.majorTrainingTableActionArea').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	$('#majorTrainingDetails_feedback').attr("disabled", true) // 反馈意见不可修改
	$(".myabeNoneTipBtn").show();
	// 确认修改按钮
	$('.confirmModifyMajorTraining').unbind('click');
	$('.confirmModifyMajorTraining').bind('click', function(e) {
		confirmModifyMajorTraining(row);
		e.stopPropagation();
	});
}

// 确认修改培养计划
function confirmModifyMajorTraining(row) {
	var crouseModifyInfo=getCrouseModifyInfo(row);
	var approvalInfo=getApprovalobect();
	if(typeof crouseModifyInfo ==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyCultureCrose",
		dataType : 'json',
		data: {
			 "edu107Id":$(".edu107Id")[0].innerText,
             "modifyInfo":JSON.stringify(crouseModifyInfo),
			 "approvalInfo":JSON.stringify(approvalInfo)
       },
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
				$("#majorTrainingTable").bootstrapTable('updateByUniqueId', {
					id : row.edu108_ID,
					row : crouseModifyInfo
				});
				toolTipUp(".myTooltip");
				$.hideModal("#majorTrainingModal");
				drawPagination(".majorTrainingTableArea", "培养计划");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取课程修改信息
function getCrouseModifyInfo(row){
	if($("#majorTrainingDetails_code").val()===""){
		toastr.warning('课程代码不能为空');
		return;
	}
	
	if($("#majorTrainingDetails_coursesName").val()===""){
		toastr.warning('课程名称不能为空');
		return;
	}
	
	var realAllHosrs=row.zxs;
	var allHosrs=parseFloat($("#majorTrainingDetails_theoryHours").val())+parseFloat($("#majorTrainingDetails_practiceHours").val());
	var allHosrs2=parseFloat($("#majorTrainingDetails_disperseHours").val())+parseFloat($("#majorTrainingDetails_centralizedHours").val());
	if(allHosrs===0){
		toastr.warning('理论学时实践学时之和不能为0');
		return;
	}else if(allHosrs2===0){
		toastr.warning('分散学时集中学时之和不能为0');
		return;
	}else if(allHosrs!==realAllHosrs){
		toastr.warning('理论学时实践学时之和不等于总学时');
		return;
	}else if(allHosrs2!==realAllHosrs){
		toastr.warning('分散学时集中学时之和不等于总学时');
		return;
	}else if(allHosrs!==allHosrs2){
		toastr.warning('（理论学时+实践学时）不等于（分散学时+集中学时）');
		return;
	}
	
	if(parseFloat($("#majorTrainingDetails_weekHours").val())*parseFloat($("#majorTrainingDetails_weekCounts").val())!==parseFloat($("#majorTrainingDetails_allhours").val())){
		toastr.warning('周学时*总周数不等于总学时');
		return;
	}
	
	if(parseFloat($("#majorTrainingDetails_credits").val())===0){
		toastr.warning('学分不能为0');
		return;
	}

	var crouseInfoObject=new Object();
	crouseInfoObject.edu108_ID=row.edu108_ID;
	crouseInfoObject.edu107_ID=row.edu107_ID;
	crouseInfoObject.edu200_ID=row.edu200_ID;
	crouseInfoObject.kcmc=$("#majorTrainingDetails_coursesName").val();
	crouseInfoObject.kcdm=$("#majorTrainingDetails_code").val();
	// crouseInfoObject.ywmc=$("#majorTrainingDetails_enName").val();
	crouseInfoObject.zxs=$("#majorTrainingDetails_allhours").val();
	crouseInfoObject.xf=$("#majorTrainingDetails_credits").val();
	crouseInfoObject.llxs=$("#majorTrainingDetails_theoryHours").val();
	crouseInfoObject.sjxs=$("#majorTrainingDetails_practiceHours").val();
	crouseInfoObject.fsxs=$("#majorTrainingDetails_disperseHours").val();
	crouseInfoObject.jzxs=$("#majorTrainingDetails_centralizedHours").val();
	crouseInfoObject.zhouxs=$("#majorTrainingDetails_weekHours").val();
	crouseInfoObject.zzs=$("#majorTrainingDetails_weekCounts").val();
	crouseInfoObject.kclx=getNormalSelectText("majorTrainingDetails_classType");
	crouseInfoObject.kclxCode=getNormalSelectValue("majorTrainingDetails_classType");
	crouseInfoObject.kcxz=getNormalSelectText("majorTrainingDetails_coursesNature");
	crouseInfoObject.kcxzCode=getNormalSelectValue("majorTrainingDetails_coursesNature");
	crouseInfoObject.ksfs=getNormalSelectText("majorTrainingDetails_testWay");
	crouseInfoObject.ksfsCode=getNormalSelectValue("majorTrainingDetails_testWay");
	crouseInfoObject.kcsx=getNormalSelectValue("majorTrainingDetails_classQuality");
	crouseInfoObject.fkyj=$("#majorTrainingDetails_feedback").val();
	crouseInfoObject.qzz=$("#majorTrainingDetails_startEndWeek").val(); 
	crouseInfoObject.qzcjbl=$("#majorTrainingDetails_midtermPrcent").val();
	crouseInfoObject.qmcjbl=$("#majorTrainingDetails_endtermPrcent").val();
	crouseInfoObject.sfxk=getNormalSelectValue("classBaseInfo_isNewClass");
	crouseInfoObject.skfs=getNormalSelectValue("majorTrainingDetails_isNewClass");
	crouseInfoObject.xqhz=getNormalSelectValue("majorTrainingDetails_isSchoolBusiness");
	crouseInfoObject.jpkcdj=getNormalSelectValue("majorTrainingDetails_signatureCourseLevel");
	crouseInfoObject.zyhxkc=getNormalSelectValue("majorTrainingDetails_isKernelClass");
	crouseInfoObject.zyzgkzkc=getNormalSelectValue("majorTrainingDetails_isTextual");
	crouseInfoObject.kztrkc=getNormalSelectValue("majorTrainingDetails_isCalssTextual");
	crouseInfoObject.jxgglxkc=getNormalSelectValue("majorTrainingDetails_isTeachingReform");
	crouseInfoObject.sfsckkjh=row.sfsckkjh;
	// crouseInfoObject.xbsp=row.xbsp;
	return crouseInfoObject;
}

// 单个删除培养计划
function removeMajorTraining(row) {
	if(row.sfsckkjh==="T"){
		toastr.warning('不能删除已生成开课计划的课程');
		return;
	}
	if($(".planStatus")[0].innerText==="passing"){
		toastr.warning('该培养计划暂不可进行此操作');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("培养计划");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.edu108_ID);
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

// 多选删除培养计划
function removeChoosedMajorTraining() {
	var chosenCrouse = choosendMajorTraining;
	if (chosenCrouse.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	for (var i = 0; i < chosenCrouse.length; i++) {
		if(chosenCrouse[i].sfsckkjh==="T"){
			toastr.warning('不能删除已生成开课计划的课程');
			return;
		}
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("培养计划");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenCrouse.length; i++) {
			removeArray.push(chosenCrouse[i].edu108_ID);
		}
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除培养计划下的专业课程请求
function sendLvelRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeCultureCrose",
		data: {
             "deleteIds":JSON.stringify(removeArray) 
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
			if (backjson.result) {
				hideloding();
				tableRemoveAction("#majorTrainingTable", removeArray, ".majorTrainingTableArea", "培养计划");
				$.hideModal("#remindModal");
				$(".myTooltip").tooltipify();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 显示详细信息并填充内容
function showAndStuffDetails(row,showFooter) {
	$("#majorTrainingDetails_teachingTerm").multiSelect();
	$("#majorTrainingDetails_code").val(row.kcdm);
	$("#majorTrainingDetails_coursesName").val(row.kcmc);
	// $("#majorTrainingDetails_enName").val(row.ywmc);
	$("#majorTrainingDetails_allhours").val(row.zxs);
	$("#majorTrainingDetails_credits").val(row.xf);
	$("#majorTrainingDetails_theoryHours").val(row.llxs);
	$("#majorTrainingDetails_practiceHours").val(row.sjxs);
	$("#majorTrainingDetails_disperseHours").val(row.fsxs);
	$("#majorTrainingDetails_centralizedHours").val(row.jzxs);
	$("#majorTrainingDetails_weekHours").val(row.zhouxs);
	$("#majorTrainingDetails_weekCounts").val(row.zzs);
	stuffManiaSelectWithDeafult("#majorTrainingDetails_classType", row.kclxCode);  //课程类型
	stuffManiaSelectWithDeafult("#majorTrainingDetails_coursesNature", row.kcxzCode);  //课程性质
	stuffManiaSelectWithDeafult("#majorTrainingDetails_testWay", row.ksfsCode);  //课程性质
	stuffManiaSelectWithDeafult("#majorTrainingDetails_classQuality", row.kcsx);  //模块类别
	$("#majorTrainingDetails_feedback").val(row.fkyj);
	$("#majorTrainingDetails_startEndWeek").val(row.qzz);
	$("#majorTrainingDetails_midtermPrcent").val(row.qzcjbl);
	$("#majorTrainingDetails_endtermPrcent").val(row.qmcjbl);
	stuffManiaSelectWithDeafult("#majorTrainingDetails_isNewClass", row.sfxk);  //是否新课
	stuffManiaSelectWithDeafult("#majorTrainingDetails_calssWay", row.skfs);  //授课方式
	stuffManiaSelectWithDeafult("#majorTrainingDetails_isSchoolBusiness", row.xqhz);  //校企合作
	stuffManiaSelectWithDeafult("#majorTrainingDetails_signatureCourseLevel", row.jpkcdj);  //精品课程等级
	stuffManiaSelectWithDeafult("#majorTrainingDetails_isKernelClass", row.zyhxkc);  //专业核心
	stuffManiaSelectWithDeafult("#majorTrainingDetails_isTextual", row.zyzgkzkc);  //职业资格考证
	stuffManiaSelectWithDeafult("#majorTrainingDetails_isCalssTextual", row.kztrkc);  //课证通融
	stuffManiaSelectWithDeafult("#majorTrainingDetails_isTeachingReform", row.jxgglxkc);  //教学改革
	$("#majorTrainingModal").find(".moadalTitle").html($(".planName")[0].innerText+"-"+row.kcmc);
	$.showModal("#majorTrainingModal",showFooter);
}

// 开始检索按钮
function startSearch() {
	var coursesNature = getNormalSelectValue("coursesNature");
	var coursesName = $("#coursesName").val();
	var testWay = getNormalSelectValue("testWay");
	var isSckkjh = getNormalSelectValue("isSckkjh");
	var serachObject=new Object();
	serachObject.edu107_ID=$(".edu107Id")[0].innerText;
	coursesNature===""?serachObject.coursesNature="":serachObject.coursesNature=coursesNature;
	coursesName===""?serachObject.coursesName="":serachObject.coursesName=coursesName;
	testWay===""?serachObject.testWay="":serachObject.testWay=testWay;
	isSckkjh===""?serachObject.isSckkjh="":serachObject.isSckkjh=isSckkjh;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/culturePlanSeacchCrouse",
		data: {
             "searchCriteria":JSON.stringify(serachObject)
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
				stuffMajorTrainingTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawMajorTrainingEmptyTable();
			}
		}
	});
}

//重置检索
function reReloadSearchs() {
	var reObject = new Object();
	reObject.InputIds = "#coursesName";
	reObject.normalSelectIds = "#coursesNature,#isSckkjh,#testWay,#coursesSemester";
	reReloadSearchsWithSelect(reObject);
	drawMajorTrainingEmptyTable();
}

// 预备添加专业课程
function wantAddClass() {
	// if($(".planStatus ")[0].innerText!=="pass"){
	// 	toastr.warning("该培养计划暂未通过审核");
	// 	return;
	// }
	getAllDepartment();
	getAllClassInfo($(".planName")[0].innerText);
	// $("#classBaseInfo_classSemesters").multiSelect();
}

//查询全部二级学院
function getAllDepartment(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllDepartment",
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
				var selectInfo=backjson.data;
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < selectInfo.length; i++) {
					str += '<option value="' + selectInfo[i].edu104_ID + '">' + selectInfo[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#addClassSearch_department", str);
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}

// 获取课程库列表
function getAllClassInfo(planName) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllPassCrouse",
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
				$(".currentMajorName").html(planName);
				stuffAllClassTable(backjson.data);
				addClassAreaBtnbind();
				$(".addClassArea").show();
				$(".culturePlanArea").hide();
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}

//添加培养计划
function addCulturePlan(){
	var currentchoosedCroese=$('#allClassTable').bootstrapTable('getSelections');
	if(currentchoosedCroese.length==0){
		toastr.warning('请选择课程');
		return;
	}
	
	// var allHaveCrouse = $("#majorTrainingTable").bootstrapTable("getData");
	// for (var i = 0; i < allHaveCrouse.length; i++) {
	// 	if(currentchoosedCroese[0].bf200_ID===allHaveCrouse[i].edu200_ID){
	// 		toastr.warning('专业课程已存在');
	// 		return;
	// 	}
	// }
	
	var crouseInfo=getNewCulturePlanInfo(currentchoosedCroese[0].bf200_ID);
	if(typeof crouseInfo ==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/culturePlanAddCrouse",
		data: {
            "edu107Id":$(".edu107Id")[0].innerText,
            "crouseInfo":JSON.stringify(crouseInfo)
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
				crouseInfo.edu108_ID=backjson.data.edu108_ID;
				crouseInfo.edu107_ID=backjson.data.edu107_ID;
				crouseInfo.sfsckkjh=backjson.data.sfsckkjh;
				$('#majorTrainingTable').bootstrapTable('prepend', crouseInfo);
				toolTipUp(".myTooltip");
				$(".addClassArea").hide();
				$(".culturePlanArea").show();	
				reloadCulturePlanArea();
				drawPagination(".majorTrainingTableArea", "培养计划");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取添加的培养计划信息
function getNewCulturePlanInfo(crouseID){
	if($("#classBaseInfo_classCode").val()===""){
		toastr.warning('课程代码不能为空');
		return;
	}
	
	if($("#classBaseInfo_className").val()===""){
		toastr.warning('课程名称不能为空');
		return;
	}
	
	if(parseFloat($("#classBaseInfo_credits").val())===0){
		toastr.warning('学分不能为0');
		return;
	}
	
	var allHosrs=parseFloat($("#classBaseInfo_theoryHours").val())+parseFloat($("#classBaseInfo_practiceHours").val());
	var allHosrs2=parseFloat($("#classBaseInfo_disperseHours").val())+parseFloat($("#classBaseInfo_centralizedHours").val());
	if(allHosrs===0){
		toastr.warning('理论学时实践学时之和不能为0');
		return;
	}else if(allHosrs2===0){
		toastr.warning('分散学时集中学时之和不能为0');
		return;
	}else if(allHosrs!==allHosrs2){
		toastr.warning('（理论学时+实践学时）不等于（分散学时+集中学时）');
		return;
	}
	
	if(parseFloat($("#classBaseInfo_weekHours").val())*parseFloat($("#classBaseInfo_countWeeks").val())<allHosrs){
		toastr.warning('周学时*总周数必须大于等于总学时');
		return;
	}

	
	if(getNormalSelectValue("classBaseInfo_classType")===""){
		toastr.warning('请选择课程类型');
		return;
	}
	
	if(getNormalSelectValue("classBaseInfo_classNature")===""){
		toastr.warning('请选择课程性质');
		return;
	}
	
	if(getNormalSelectValue("classBaseInfo_testWay")===""){
		toastr.warning('请选择考试方式');
		return;
	}

	var crouseInfoObject=new Object();
	crouseInfoObject.edu200_ID=crouseID;
	crouseInfoObject.kcmc=$("#classBaseInfo_className").val();
	crouseInfoObject.kcdm=$("#classBaseInfo_classCode").val();
	crouseInfoObject.ywmc=$("#classBaseInfo_enName").val();
	crouseInfoObject.zxs=allHosrs;
	crouseInfoObject.xf=$("#classBaseInfo_credits").val();
	crouseInfoObject.llxs=$("#classBaseInfo_theoryHours").val();
	crouseInfoObject.sjxs=$("#classBaseInfo_practiceHours").val();
	crouseInfoObject.fsxs=$("#classBaseInfo_disperseHours").val();
	crouseInfoObject.jzxs=$("#classBaseInfo_centralizedHours").val();
	crouseInfoObject.zhouxs=$("#classBaseInfo_weekHours").val();
	crouseInfoObject.zzs=$("#classBaseInfo_countWeeks").val();
	crouseInfoObject.kclx=getNormalSelectText("classBaseInfo_classType");
	crouseInfoObject.kclxCode=getNormalSelectValue("classBaseInfo_classType");
	crouseInfoObject.kcxz=getNormalSelectText("classBaseInfo_classNature");
	crouseInfoObject.kcxzCode=getNormalSelectValue("classBaseInfo_classNature");
	crouseInfoObject.ksfs=getNormalSelectText("classBaseInfo_testWay");
	crouseInfoObject.ksfsCode=getNormalSelectValue("classBaseInfo_testWay");
	crouseInfoObject.kcsx=getNormalSelectValue("classBaseInfo_classQuality");
	crouseInfoObject.qzcjbl=$("#classBaseInfo_midtermPrcent").val();
	crouseInfoObject.qmcjbl=$("#classBaseInfo_endtermPrcent").val();
	crouseInfoObject.sfxk=getNormalSelectValue("classBaseInfo_isNewClass");
	crouseInfoObject.skfs=getNormalSelectValue("classBaseInfo_classWay");
	crouseInfoObject.xqhz=getNormalSelectValue("classBaseInfo_isSchoolBusiness");
	crouseInfoObject.jpkcdj=getNormalSelectValue("classBaseInfo_signatureCourseLevel");
	crouseInfoObject.zyhxkc=getNormalSelectValue("classBaseInfo_isKernelClass");
	crouseInfoObject.zyzgkzkc=getNormalSelectValue("classBaseInfo_isTextual");
	crouseInfoObject.kztrkc=getNormalSelectValue("classBaseInfo_isCalssTextual");
	crouseInfoObject.jxgglxkc=getNormalSelectValue("classBaseInfo_isTeachingReform");
	crouseInfoObject.bzzymc=$("#allClassTable").bootstrapTable("getRowByUniqueId", crouseID).bzzymc;
	return crouseInfoObject;
}

//刷新新增专业课程区域
function reloadCulturePlanArea(){
	// refreshMultiSselect("#classBaseInfo_classSemesters");
	rebackClassBaseInfo();
}

// 填充课程库表
function stuffAllClassTable(tableInfo) {
	$('#allClassTable').bootstrapTable('destroy').bootstrapTable({
		data :tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		search : true,
		radio: true,
		clickToSelect: true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onClickRow : function(row) {
			stuffClassBaseInfo(row);
		},
		onCheck : function(row) {
			stuffClassBaseInfo(row);
		},
		onPageChange : function() {
			drawPagination(".allClassTableArea", "专业课程");
		},
		columns : [ {
			field : 'bf200_ID',
			title : 'bf200_ID',
			align : 'center',
			visible : false
		}, {
			field : 'radio',
			radio : true
		}, {
			field : 'kcdm',
			title : '课程代码',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kcmc',
			title : '课程名称',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kcxz',
			title : '课程性质',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kclx',
			title : '课程类型',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xf',
			title : '学分',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zxs',
			title : '总学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'llxs',
			title : '理论学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'sjxs',
			title : '实践学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'bzzymc',
			title : '专业名称',
			align : 'left',
			formatter : paramsMatter
		} ]
	});
	drawPagination(".allClassTableArea", "专业课程");
	drawSearchInput(".allClassTableArea");
	toolTipUp(".myTooltip");
}

// 根据点击行填充基本信息内容
function stuffClassBaseInfo(row) {
	$("#classBaseInfo_classCode").val(row.kcdm);   //课程代码
	$("#classBaseInfo_className").val(row.kcmc);   //课程名称
	$("#classBaseInfo_credits").val(row.xf);       //学分
	$("#classBaseInfo_theoryHours").val(row.llxs);  //理论学时
	$("#classBaseInfo_practiceHours").val(row.sjxs); //实践学时
	$("#classBaseInfo_disperseHours").val(row.fsxs);  //分散学时
	$("#classBaseInfo_centralizedHours").val(row.jzxs); //集中学时
	stuffManiaSelectWithDeafult("#classBaseInfo_classType", row.kclxCode);  //课程类型
	stuffManiaSelectWithDeafult("#classBaseInfo_classNature", row.kcxzCode); //课程性质
	stuffManiaSelectWithDeafult("#classBaseInfo_testWay", row.ksfs);    //考试方式
	stuffManiaSelectWithDeafult("#classBaseInfo_classQuality",row.kcsx);  //课程属性
	stuffManiaSelectWithDeafult("#classBaseInfo_isNewClass",row.sfxk);  //是否新课
	stuffManiaSelectWithDeafult("#classBaseInfo_signatureCourseLevel",row.jpkcdj);  //精品课程等级
	stuffManiaSelectWithDeafult("#classBaseInfo_classWay",row.skfs);  //授课方式
	stuffManiaSelectWithDeafult("#classBaseInfo_isSchoolBusiness",row.xqhz);  //校企合作
	stuffManiaSelectWithDeafult("#classBaseInfo_isKernelClass",row.zyhxkc);  //专业核心
	stuffManiaSelectWithDeafult("#classBaseInfo_isTextual",row.zyzgkzkc);  //职业资格考证
	stuffManiaSelectWithDeafult("#classBaseInfo_isCalssTextual",row.kztrkc);  //课证通融
	stuffManiaSelectWithDeafult("#classBaseInfo_isTeachingReform",row.jxgglxkc);  //教学改革
}

// 新增课程返回培养计划
function addClassReturnCulturePlan() {
	$(".addClassArea").hide();
	$(".culturePlanArea").show();
}

// 填写更多信息
function stuffMoreClassInfo() {
	$(".ScheduleClassesInfo,.otherInfo").toggle();
	if ($(".otherInfo")[0].style.display === "block") {
		$("#stuffMoreClassInfo").val("隐藏更多属性");
	} else {
		$("#stuffMoreClassInfo").val("填写更多属性")
	}
}

// 添加专业课程开始检索
function addClassAreaStartSearch() {
	var departmentCode =getNormalSelectValue("addClassSearch_department");
	var coursesCode = $("#addClassSearch_classCode").val();
	var coursesName = $("#addClassSearch_className").val();
	var majorWorkSign = $("#addClassSearch_classMark").val();
	var serachObject=new Object();
	serachObject.departmentCode=departmentCode;
	serachObject.edu107Id=$(".edu107Id")[0].innerText;
	coursesCode===""?serachObject.coursesCode="":serachObject.coursesCode=coursesCode;
	coursesName===""?serachObject.coursesName="":serachObject.coursesName=coursesName;
	majorWorkSign===""?serachObject.majorWorkSign="":serachObject.majorWorkSign=majorWorkSign;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addCrouseSeacch",
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
				stuffAllClassTable(backjson.data);
				rebackClassBaseInfo();
			} else {
				toastr.warning(backjson.msg);
				stuffAllClassTable({});
			}
		}
	});
}

// 重置添加专业课程基础信息内容
function rebackClassBaseInfo() {
	var reObject = new Object();
	reObject.normalSelectIds = "#addClassSearch_department,#classBaseInfo_isTeachingReform,#classBaseInfo_isCalssTextual,#classBaseInfo_isTextual,#classBaseInfo_isKernelClass,#classBaseInfo_isSchoolBusiness,#classBaseInfo_classWay,#classBaseInfo_signatureCourseLevel,#classBaseInfo_isNewClass,#classBaseInfo_classQuality,#classBaseInfo_classSchedRequire,#classBaseInfo_classType,#classBaseInfo_testWay,#classBaseInfo_classNature,#classBaseInfo_setUp,#classBaseInfo_classLocation,#classBaseInfo_moduleType";
	reObject.InputIds = "#classBaseInfo_classCode,#classBaseInfo_className,#classBaseInfo_enName,#classBaseInfo_midtermPrcent,#classBaseInfo_endtermPrcent";
	reReloadSearchsWithSelect(reObject);
	// 数字input必须逐个重置 否则报错
	$("#classBaseInfo_credits").val(0);
	$("#classBaseInfo_theoryHours").val(0);
	$("#classBaseInfo_practiceHours").val(0);
	$("#classBaseInfo_disperseHours").val(0);
	$("#classBaseInfo_centralizedHours").val(0);
	$("#classBaseInfo_weekHours").val(0);
	$("#classBaseInfo_countWeeks").val(0);
	// refreshMultiSselect("#classBaseInfo_classSemesters");
}

// 添加专业课程重置检索
function addClassArea_rebackSearch(isReloadTable) {
	$("#addClassSearch_classCode,#addClassSearch_className,#addClassSearch_classMark").val("");
	// refreshMultiSselect("#classBaseInfo_classSemesters");
	rebackClassBaseInfo();
	getAllClassInfo($(".planName")[0].innerText);
}

//添加专业课程区域按钮绑定事件
function addClassAreaBtnbind() {
	// 返回培养计划
	$('#addClassReturnCulturePlan').unbind('click');
	$('#addClassReturnCulturePlan').bind('click', function(e) {
		addClassReturnCulturePlan();
		e.stopPropagation();
	});

	// 填写更多信息
	$('#stuffMoreClassInfo').unbind('click');
	$('#stuffMoreClassInfo').bind('click', function(e) {
		stuffMoreClassInfo();
		e.stopPropagation();
	});

	// 开始检索
	$('#addClassArea_startSearch').unbind('click');
	$('#addClassArea_startSearch').bind('click', function(e) {
		addClassAreaStartSearch();
		e.stopPropagation();
	});

	// 重置检索
	$('#addClassArea_rebackSearch').unbind('click');
	$('#addClassArea_rebackSearch').bind('click', function(e) {
		addClassArea_rebackSearch(true);
		e.stopPropagation();
	});
}

// 生成班级开课计划
function wantGeneratCoursePaln() {
	if($(".planStatus ")[0].innerText!=="pass"){
		toastr.warning("该培养计划暂未通过审核");
		return;
	}

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getGeneratCoursePalnInfo",
		data: {
            "culturePlanInfo":$(".edu107Id")[0].innerText
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
				if(backjson.data.tableInfo.length===0){
					toastr.info('请添加专业课程');
					return;
				}
				$(".GeneratCoursePaln_currentMajorName").html($(".planName")[0].innerText);
				$(".generatCoursePalnArea").show();
				$(".culturePlanArea").hide();
				stuffGeneratCoursePalnTable(backjson.data.tableInfo);
				generatCoursePalnBtnbind();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosendCourse=new Array();
// 填充开课计划课程库表格
function stuffGeneratCoursePalnTable(tableInfo) {
	window.generatCourseEvents = {
		'click #generatCourseInfo' : function(e, value, row, index) {
			showCourseInfo(row);
		}
	};

	$('#generatCourseTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		clickToSelect : true,
		onCheck : function(row) {
			onCheckCourse(row);
		},
		onUncheck : function(row) {
			onUncheckCourse(row);
		},
		onCheckAll : function(rows) {
			onCheckAllCourse(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllCourse(rows2);
		},
		onPageChange : function() {
			drawPagination(".generatCourseArea", "课程");
			for (var i = 0; i < choosendCourse.length; i++) {
				$("#generatCourseTable").bootstrapTable("checkBy", {field:"edu108_ID", values:[choosendCourse[i].edu108_ID]})
			}
		},
		columns : [ {
			field : 'check',
			checkbox : true
		},{
			field : 'edu108_ID',
			title: '唯一标识',
			align : 'center',
			visible : false
		}, {
			field : 'kcmc',
			title : '课程名称',
			align : 'left',
			formatter : calssNameMatter
		}, {
			field : 'zxs',
			title : '总学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zhouxs',
			title : '周学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zzs',
			title : '总周数',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xf',
			title : '学分',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kclx',
			title : '课程类型',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kcxz',
			title : '课程性质',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xbsp',
			title : '审批状态',
			align : 'center',
			formatter : approvalMatter
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : generatCourseFormatter,
			events : generatCourseEvents,
		} ]
	});

	function generatCourseFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
				+ '<li id="generatCourseInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
				+ '</ul>' ].join('');
	}
	drawPagination(".generatCourseArea", "课程");
	drawSearchInput(".generatCourseArea");
	toolTipUp(".myTooltip");
	changeColumnsStyle(".generatCourseArea", "课程");
}

//单选学生
function onCheckCourse(row){
	if(choosendCourse.length<=0){
		choosendCourse.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendCourse.length; i++) {
			if(choosendCourse[i].edu108_ID===row.edu108_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendCourse.push(row);
		}
	}
}

//单反选学生
function onUncheckCourse(row){
	if(choosendCourse.length<=1){
		choosendCourse.length=0;
	}else{
		for (var i = 0; i < choosendCourse.length; i++) {
			if(choosendCourse[i].edu108_ID===row.edu108_ID){
				choosendCourse.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllCourse(row){
	for (var i = 0; i < row.length; i++) {
		choosendCourse.push(row[i]);
	}
}

//全反选学生
function onUncheckAllCourse(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu108_ID);
	}


	for (var i = 0; i < choosendCourse.length; i++) {
		if(a.indexOf(choosendCourse[i].edu108_ID)!==-1){
			choosendCourse.splice(i,1);
			i--;
		}
	}
}

//展示课程信息
function showCourseInfo(row) {
	// //填充tip中的值
	showAndStuffDetails(row);
	$('.generatCourseDeatilsTip').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$(".myabeNoneTipBtn").hide();
}

// 准备生成开课计划
function startGeneratCourse() {
	var courses = $('#generatCourseTable').bootstrapTable('getSelections');

	if (courses.length === 0) {
		toastr.warning('暂未选择课程');
		return;
	}
	
	for (var i = 0; i < courses.length; i++) {
		if(courses[i].sfsckkjh=="T"){
			toastr.warning('包含已生成开课计划课程');
			return;
		}
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("所选班级");
	$(".remindActionType").html("开课计划");

	// 确认新增开课计划
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmAddGeneratCoursePaln();
		e.stopPropagation();
	});
}

// 生成班级开课计划
function confirmAddGeneratCoursePaln() {
	var coursesArray = new Array();

	//获取培养计划ID
	var courses = $('#generatCourseTable').bootstrapTable('getSelections');
	for (var i = 0; i < courses.length; i++) {
		coursesArray.push(courses[i].edu108_ID);
	}
	var sendObject=new Object();
	sendObject.crouses=coursesArray;
	sendGeneratCoursePalnInfo(sendObject);
}

//发送生成开课计划请求
function sendGeneratCoursePalnInfo(sendObject) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/generatCoursePlan",
		data: {
             "generatInfo":JSON.stringify(sendObject)
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
			if (backjson.code === 200) {
				hideloding();
				//更改培养计划下课程是否生成开课计划属性
				for (var i = 0; i < sendObject.crouses.length; i++) {
					var currentCrouses=$("#majorTrainingTable").bootstrapTable("getRowByUniqueId", sendObject.crouses[i]);
					currentCrouses.sfsckkjh="T";
					currentCrouses.xzbCode=sendObject.classIds;
					currentCrouses.xzbmc=sendObject.classNames;
					$("#majorTrainingTable").bootstrapTable('updateByUniqueId', {
						id: sendObject.crouses[i],
						row: currentCrouses
					});
				}
				$.hideModal("#remindModal");
				toastr.success(backjson.msg);
				drawPagination(".majorTrainingTableArea", "培养计划");
				toolTipUp(".myTooltip");
				$(".generatCoursePalnArea").hide();
				$(".culturePlanArea").show();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//生成开课计划返回
function generatCoursePalnReturnCulturePlan() {
	$(".generatCoursePalnArea").hide();
	$(".culturePlanArea").show();
}

// 生成开课计划检索
function generatCoursePalnSearch() {
	var suditStatus = getNormalSelectValue("generatCourse_suditStatus");
	var coursesName = $("#coursesName").val();
	var serachObject=new Object();
	serachObject.edu107_ID=$(".edu107Id")[0].innerText
	suditStatus===""?serachObject.suditStatus="":serachObject.suditStatus=suditStatus;
	coursesName===""?serachObject.coursesName="":serachObject.coursesName=coursesName;
	serachObject.coursesNature="";
	serachObject.testWay="";
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/culturePlanSeacchCrouse",
		data: {
             "searchCriteria":JSON.stringify(serachObject)
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
				stuffGeneratCoursePalnTable(backjson.data)
			} else {
				toastr.warning(backjson.msg);
				stuffGeneratCoursePalnTable({})
			}
		}
	});
}

// 生成开课计划重置检索
function generatCoursePalnResearch() {
	var reObject = new Object();
	reObject.normalSelectIds = "#generatCourse_suditStatus";
	reObject.InputIds = "#generatCourse_className";
	reReloadSearchsWithSelect(reObject);
	wantGeneratCoursePaln();
}

// 生成班级开课计划区域按钮绑定事件
function generatCoursePalnBtnbind() {
	// 全选
	$('#checkAll').unbind('click');
	$('#checkAll').bind('click', function(e) {
		checkAll();
		e.stopPropagation();
	});

	// 反选
	$('#recheckAll').unbind('click');
	$('#recheckAll').bind('click', function(e) {
		recheckAll();
		e.stopPropagation();
	});

	// 返回培养计划
	$('#generatCoursePalnReturnCulturePlan').unbind('click');
	$('#generatCoursePalnReturnCulturePlan').bind('click', function(e) {
		generatCoursePalnReturnCulturePlan();
		e.stopPropagation();
	});

	// 准备生成开课计划
	$('#startGeneratCourse').unbind('click');
	$('#startGeneratCourse').bind('click', function(e) {
		startGeneratCourse();
		e.stopPropagation();
	});

	// 开始检索
	$('#generatCoursePalnSearch').unbind('click');
	$('#generatCoursePalnSearch').bind('click', function(e) {
		generatCoursePalnSearch();
		e.stopPropagation();
	});

	// 重置检索
	$('#generatCoursePalnResearch').unbind('click');
	$('#generatCoursePalnResearch').bind('click', function(e) {
		generatCoursePalnResearch();
		e.stopPropagation();
	});
}


// 预备发起培养计划申请
function startPlanApproval() {
	if($(".planStatus")[0].innerText==="pass"){
		toastr.warning('该培养计划已通过审批');
		return;
	}
	generatAllClassAllCourse();
}

// 发起培养计划申请二次确认
function generatAllClassAllCourse() {
	$.showModal("#remindModal",true);
	$(".remindType").html("该培养计划");
	$(".remindActionType").html("审批发起申请");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmStartPlan();
		e.stopPropagation();
	});
}

// 确认生成专业下所有班级课程
function confirmStartPlan() {
	var approvalInfo=getApprovalobect();
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/confirmStartPlan",
		data: {
             "edu107":$(".edu107Id")[0].innerText,
			 "approvalInfo":JSON.stringify(approvalInfo)
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
			if (backjson.code === 200) {
				hideloding();
				$.hideModal("#remindModal");
				if(backjson.crouseInfo.length===0){
					toastr.warning('该专业下暂无可生成课程');
					return;
				}
				var currentMajorTraining = $("#majorTrainingTable").bootstrapTable("getData");
				for (var i = 0; i < currentMajorTraining.length; i++) {
					for (var g = 0; g < backjson.crouseInfo.length; g++) {
						if(currentMajorTraining[i].edu108_ID===backjson.crouseInfo[g].edu108_ID){
							$("#majorTrainingTable").bootstrapTable('updateByUniqueId', {
								id: currentMajorTraining[i].edu108_ID,
								row: backjson.crouseInfo[g]
							});
						}
					}
				}
				toastr.success(backjson.msg);
				drawPagination(".majorTrainingTableArea", "培养计划");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//培养计划审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="03";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

// 初始化页面按钮绑定事件
function binBind() {
	// 重置按钮
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});

	// 开始检索按钮
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	// 页面初始化时的批量删除按钮
	$('#removeRows').unbind('click');
	$('#removeRows').bind('click', function(e) {
		removeChoosedMajorTraining();
		e.stopPropagation();
	});

	// 添加专业课程
	$('#wantAddClass').unbind('click');
	$('#wantAddClass').bind('click', function(e) {
		wantAddClass();
		e.stopPropagation();
	});

	// 生科班级开课计划
	$('#wantGeneratCoursePaln').unbind('click');
	$('#wantGeneratCoursePaln').bind('click', function(e) {
		wantGeneratCoursePaln();
		e.stopPropagation();
	});

	// 生成专业下所有班级课程
	$('#startPlanApproval').unbind('click');
	$('#startPlanApproval').bind('click', function(e) {
		startPlanApproval();
		e.stopPropagation();
	});
	
	// 添加培养计划初始化事件
	$('.addCulturePlan').unbind('click');
	$('.addCulturePlan').bind('click', function(e) {
		addCulturePlan();
		e.stopPropagation();
	});
}
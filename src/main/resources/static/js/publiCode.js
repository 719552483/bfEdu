var EJDMElementInfo;

$(function() {
	EJDMElementInfo=queryEJDMElementInfo();
	pageGPS("#publicCodeModel");
	pageGPS("#publicCodeModel_jw");
	$('.isSowIndex').selectMania(); // 初始化下拉框
	stuffYearSearchElement("input[type='number']");
	getJiaoWuInfo();
	btnbind();
	stuffEJDElement(EJDMElementInfo);
});

//获取教务公共代码信息
function getJiaoWuInfo(){
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getJwPublicCodes",
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
				drawJiaoWuPublicCodeTables(backjson);
				hideloding();
			} else {
				toastr.warning('获取信息失败，请重试');
			}
		}
	});
}

/**
 * tab1
 * */
//渲染教务公共代码相关table
function drawJiaoWuPublicCodeTables(backjson){
	stuffAllLevelTable(backjson.allLevel);
	stuffAllDepartmentTable(backjson.allDepartment);
	stuffAllGradeTable(backjson.allGrade);
	stuffAllMajorTable(backjson.allMajor);
}

//填充层次表
function stuffAllLevelTable(allLevel){
	window.releaseNewsEvents = {
			'click #modifyLevel': function(e, value, row, index) {
                modifyLevel(row);
			},
			'click #removeLevle': function(e, value, row, index) {
				removeLevle(row.edu103_ID);
			}
		};

		$('#allLevlTable').bootstrapTable('destroy').bootstrapTable({
			data: allLevel,
			pagination: true,
			pageNumber: 1,
			pageSize: 5,
			pageList: [5],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
			toolbar: '#toolbar',
			showColumns: false,
			onPageChange: function() {
				drawPagination(".allLevlTableArea", "培养层次信息");
			},
			columns: [{
					field: 'edu103_ID',
					title: 'edu103_ID',
					align: 'center',
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					visible: false
				},
				{
					field: 'check',
					checkbox: true
				},
				{
					field: 'pyccmc',
					title: '培养层次名称',
					align: 'left',
					formatter: paramsMatter
				},{
					field: 'pyccbm',
					title: '培养层次编码',
					align: 'left',
					formatter: paramsMatter

				}, {
					field: 'rxjj',
					title: '入学季节',
					align: 'left',
					formatter: enterSeasonMatter
				}, {
					field: 'xq',
					title: '学区',
					align: 'left',
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'xz',
					title: '学制',
					align: 'left',
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
					'<li class="modifyBtn" id="modifyLevel"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
					'<li class="deleteBtn" id="removeLevle"><span><img src="images/t03.png"></span>删除</li>' +
					'</ul>'
				]
				.join('');
		}
		
		function enterSeasonMatter(value, row, index) {
			if (value==="spring") {
				return [
						'<div class="myTooltip" title="春季">春季</div>'
					]
					.join('');
			} else {
				return [
						'<div class="myTooltip" title="秋季">秋季</div>'
					]
					.join('');
			}
		}
		drawSearchInput(".allLevlTableArea");
		drawPagination(".allLevlTableArea", "培养层次信息");
		toolTipUp(".myTooltip");
		btnControl();
}

//填充系部表
function stuffAllDepartmentTable(allDepartment){
	window.releaseNewsEvents = {
			'click #modifyDepartment': function(e, value, row, index) {
				modifyDepartment(row);
			},
			'click #removeDepartment': function(e, value, row, index) {
				removeDepartment(row.edu104_ID);
			}
		};

		$('#allDepartmentTable').bootstrapTable('destroy').bootstrapTable({
			data: allDepartment,
			pagination: true,
			pageNumber: 1,
			pageSize: 5,
			pageList: [5],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
			toolbar: '#toolbar',
			showColumns: false,
			onPageChange: function() {
				drawPagination(".allDepartmentTableArea", "系部信息");
			},
			columns: [{
					field: 'edu104_ID',
					title: 'edu104_ID',
					align: 'center',
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					visible: false
				},
				{
					field: 'check',
					checkbox: true
				},
				{
					field: 'xbmc',
					title: '系部名称',
					align: 'left',
					formatter: paramsMatter

				}, {
					field: 'xbbm',
					title: '系部代码',
					align: 'left',
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
					'<li class="modifyBtn" id="modifyDepartment"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
					'<li class="deleteBtn" id="removeDepartment"><span><img src="images/t03.png"></span>删除</li>' +
					'</ul>'
				]
				.join('');
		}
		drawSearchInput(".allDepartmentTableArea ");
		drawPagination(".allDepartmentTableArea", "系部信息");
		toolTipUp(".myTooltip");
		btnControl();
}

//填充年级表
function stuffAllGradeTable(allGrade){
	window.releaseNewsEvents = {
			'click #modifyGrade': function(e, value, row, index) {
				modifyGrade(row);
			},
			'click #removeGrade': function(e, value, row, index) {
				removeGrade(row.edu105_ID);
			}
		};

		$('#allGradeTable').bootstrapTable('destroy').bootstrapTable({
			data: allGrade,
			pagination: true,
			pageNumber: 1,
			pageSize: 5,
			pageList: [5],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
			toolbar: '#toolbar',
			showColumns: false,
			onPageChange: function() {
				drawPagination(".allGradeTableArea", "年级信息");
			},
			columns: [{
					field: 'edu105_ID',
					title: 'edu105_ID',
					align: 'center',
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					visible: false
				},
				{
					field: 'check',
					checkbox: true
				},
				{
					field: 'njmc',
					title: '年级名称',
					align: 'left',
					formatter: paramsMatter

				}, {
					field: 'njbm',
					title: '年级代码',
					align: 'left',
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
					'<li id="modifyGrade" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
					'<li id="removeGrade" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
					'</ul>'
				]
				.join('');
		}
		drawSearchInput(".allGradeTableArea");
		drawPagination(".allGradeTableArea", "年级信息");
		toolTipUp(".myTooltip");
		btnControl();
}

//填充专业表
function stuffAllMajorTable(allMajor){
	window.releaseNewsEvents = {
			'click #modifyMajor': function(e, value, row, index) {
				modifyMajor(row);
			},
			'click #removeMajor': function(e, value, row, index) {
				removeMajor(row.edu106_ID);
			}
		};

		$('#allMajorTable').bootstrapTable('destroy').bootstrapTable({
			data: allMajor,
			pagination: true,
			pageNumber: 1,
			pageSize: 5,
			pageList: [5],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
			toolbar: '#toolbar',
			showColumns: false,
			onPageChange: function() {
				drawPagination(".allMajorTableArea", "专业信息");
			},
			columns: [{
					field: 'edu106_ID',
					title: 'edu106_ID',
					align: 'center',
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					visible: false
				},
				{
					field: 'check',
					checkbox: true
				},
				{
					field: 'zymc',
					title: '专业名称',
					align: 'left',
					formatter: paramsMatter

				}, {
					field: 'zybm',
					title: '专业代码',
					align: 'left',
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
					'<li id="modifyMajor" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
					'<li id="removeMajor" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
					'</ul>'
				]
				.join('');
		}
		drawSearchInput(".allMajorTableArea");
		drawPagination(".allMajorTableArea", "专业信息");
		toolTipUp(".myTooltip");
		btnControl();
}

//预备新增培养层次
function addNewLevel(){
	$.showModal("#addNewLevelModal",true);
	$("#addNewLevelModal").find(".moadalTitle").html("新增层次");
	emptyLevelChooseArea();
	//确认新增层次
	$('.confimAddNewLevel').unbind('click');
	$('.confimAddNewLevel').bind('click', function(e) {
		confimAddNewLevel();
		e.stopPropagation();
	});
}

//确认新增培养层次
function confimAddNewLevel(){
	var newLevelObject=getLevelInfo();
	if(typeof newLevelObject ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewLevel",
		data: {
             "newLevelInfo":JSON.stringify(newLevelObject) 
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
				if(backjson.namehave){
					toastr.warning('培养层次名称已存在');
					return;
				}
				
				newLevelObject.edu103_ID=backjson.id;
				newLevelObject.yxbz=backjson.yxbz;
				newLevelObject.pyccbm=backjson.pcyybm;
				$('#allLevlTable').bootstrapTable('prepend', newLevelObject);
				toastr.success('新增培养层次成功');
				$.hideModal("#addNewLevelModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allLevlTableArea", "培养层次信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备修改培养层次
function modifyLevel(row){
	stufDeadultLevekInfo(row);
	$.showModal("#addNewLevelModal",true);
	$("#addNewLevelModal").find(".moadalTitle").html("修改层次");
	//确认修改培养层次
	$('.confimAddNewLevel').unbind('click');
	$('.confimAddNewLevel').bind('click', function(e) {
		confimModifyNewLevel(row);
		e.stopPropagation();
	});
}

//确认修改培养层次
function confimModifyNewLevel(row){
	var newLevelObject=getLevelInfo();
	newLevelObject.pyccbm=row.pyccbm;
	if(typeof newLevelObject ==='undefined'){
		return;
	}
	newLevelObject.yxbz=row.yxbz;
	newLevelObject.edu103_ID=row.edu103_ID;
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateLvel",
		data: {
             "updateinfo":JSON.stringify(newLevelObject) 
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
				if(backjson.namehave){
					toastr.warning('培养层次名称已存在');
					return;
				}
				$("#allLevlTable").bootstrapTable('updateByUniqueId', {
					id: row.edu103_ID,
					row: newLevelObject
				});
				toastr.success('修改培养层次成功');
				$.hideModal("#addNewLevelModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allLevlTableArea", "培养层次信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//修改时填充该行信息到培养层次选择区
function stufDeadultLevekInfo(row){
	stuffManiaSelectWithDeafult("#addNewLevel_schoolLocation",row.xq);  //填充默认培养层次
	$("#addNewLevel_levelName").val(row.pyccmc);//填充默认培养层次名称
//	$("#addNewLevel_levelCode").val(row.pyccbm);//填充默认培养层次编码
	stuffManiaSelectWithDeafult("#addNewLevel_enterSeason",row.rxjj);  //填充默认入学季节
	$("#addNewLevel_academicStructure").val(row.xz);//填充默认培养层次编码
}

//清空培养层次模态框中select的值
function emptyLevelChooseArea(){
	var reObject = new Object();
	reObject.normalSelectIds = "#addNewLevel_schoolLocation,#addNewLevel_enterSeason";
	reObject.InputIds = "#addNewLevel_levelName,#addNewLevel_academicStructure";
	reReloadSearchsWithSelect(reObject);
}

//获取培养层次信息
function getLevelInfo(){
	var schoolLocation = getNormalSelectValue("addNewLevel_schoolLocation");
	var levelName = $("#addNewLevel_levelName").val();
	var enterSeason = getNormalSelectValue("addNewLevel_enterSeason");
	var academicStructure = $("#addNewLevel_academicStructure").val();
	
	if(schoolLocation===""){
		toastr.warning('请选择校区');
		return;
	}
	if(levelName===""){
		toastr.warning('请输入培养层次名称');
		return;
	}
	if(enterSeason===""){
		toastr.warning('请选择入学季节');
		return;
	}
	if(academicStructure===""){
		toastr.warning('请输入学制');
		return;
	}
	
	if(isNaN(parseInt(academicStructure))){
		toastr.warning('学制只接受数字');
		return;
	}
	
	var newRelationObject=new Object();
	newRelationObject.xq=schoolLocation;
	newRelationObject.pyccmc=levelName;
	newRelationObject.rxjj=enterSeason;
	newRelationObject.xz=academicStructure;
	return newRelationObject;
}

//单个删除培养层次
function removeLevle(removeID){
	$.showModal("#remindModal",true);
	$(".remindType").html("培养层次");
	$(".remindActionType").html("删除");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(removeID);
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//批量删除培养层次
function reomoveLevels(){
	var chosenLevels = $('#allLevlTable').bootstrapTable('getAllSelections');
	if (chosenLevels.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html("培养层次");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenLevels.length; i++) {
			removeArray.push(chosenLevels[i].edu103_ID);
		}
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除培养层次请求
function sendLvelRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeLevel",
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
					tableRemoveAction("#allLevlTable", removeArray, ".allLevlTableArea", "培养层次信息");
					$.hideModal("#remindModal");
					$(".myTooltip").tooltipify();
				}else{
					toastr.warning('不能删除正在使用的培养层次');
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备新增系部
function addNewDepartment(){
	$.showModal("#addNewDeaparmentModal",true);
	$("#addNewDeaparmentModal").find(".moadalTitle").html("新增系部");
	emptyDepartmentChooseArea();
	//确认新增系部
	$('.confimaddNewDeaparment').unbind('click');
	$('.confimaddNewDeaparment').bind('click', function(e) {
		confimAddNewDeaparment();
		e.stopPropagation();
	});
}

//确认新增系部
function confimAddNewDeaparment(){
	var newDeaparmentObject=getDeaparmentInfo();
	if(typeof newDeaparmentObject ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewDeaparment",
		data: {
             "newDeaparment":JSON.stringify(newDeaparmentObject) 
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
				if(backjson.namehave){
					toastr.warning('系部名称已存在');
					return;
				}
				
				newDeaparmentObject.edu104_ID=backjson.id;
				newDeaparmentObject.yxbz=backjson.yxbz;
				newDeaparmentObject.xbbm=backjson.xbbm;
				$('#allDepartmentTable').bootstrapTable('prepend', newDeaparmentObject);
				toastr.success('新增系部成功');
				$.hideModal("#addNewDeaparmentModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allDepartmentTableArea", "系部信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备修改系部
function modifyDepartment(row){
	$.showModal("#addNewDeaparmentModal",true);
	$("#addNewDeaparmentModal").find(".moadalTitle").html("修改系部");
	stufDeadultDepartmentInfo(row);
	//确认修改系部
	$('.confimaddNewDeaparment').unbind('click');
	$('.confimaddNewDeaparment').bind('click', function(e) {
		confimModifyDeaparment(row);
		e.stopPropagation();
	});
}

//确认修改系部
function confimModifyDeaparment(row){
	var newDeaparmentObject=getDeaparmentInfo();
	newDeaparmentObject.xbbm=row.xbbm;
	if(typeof newDeaparmentObject ==='undefined'){
		return;
	}
	newDeaparmentObject.yxbz=row.yxbz;
	newDeaparmentObject.edu104_ID=row.edu104_ID;
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateDeaparment",
		data: {
             "updateinfo":JSON.stringify(newDeaparmentObject) 
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
				if(backjson.namehave){
					toastr.warning('系部名称已存在');
					return;
				}
				$("#allDepartmentTable").bootstrapTable('updateByUniqueId', {
					id: row.edu104_ID,
					row: newDeaparmentObject
				});
				toastr.success('修改系部成功');
				$.hideModal("#addNewDeaparmentModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allDepartmentTableArea", "系部信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//修改时填充该行信息到培养层次选择区
function stufDeadultDepartmentInfo(row){
	$("#addNewDeaparment_deaparmentName").val(row.xbmc);
//	$("#addNewDeaparment_deaparmentCode").val(row.xbbm);
}

//清空系部模态框中的值
function  emptyDepartmentChooseArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewDeaparment_deaparmentName";
	reReloadSearchsWithSelect(reObject);
}

//获取系部信息
function getDeaparmentInfo(){
	var deaparmentName = $("#addNewDeaparment_deaparmentName").val();
//	var deaparmentCode = $("#addNewDeaparment_deaparmentCode").val();
	
	if(deaparmentName===""){
		toastr.warning('请输入系部名称');
		return;
	}
//	if(deaparmentCode===""){
//		toastr.warning('请输入系部编码');
//		return;
//	}

	
	var newDeaparmentObject=new Object();
	newDeaparmentObject.xbmc=deaparmentName;
//	newDeaparmentObject.xbbm=deaparmentCode;
	return newDeaparmentObject;
}

//单个删除系部
function removeDepartment(removeID){
	$.showModal("#remindModal",true);
	$(".remindType").html("系部");
	$(".remindActionType").html("删除");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(removeID);
		sendDeaparmentRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//批量删除系部
function reomoveDepartments(){
	var chosenDepartments = $('#allDepartmentTable').bootstrapTable('getAllSelections');
	if (chosenDepartments.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html("系部");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenDepartments.length; i++) {
			removeArray.push(chosenDepartments[i].edu104_ID);
		}
		sendDeaparmentRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除系部请求
function sendDeaparmentRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeDeaparment",
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
					tableRemoveAction("#allDepartmentTable", removeArray, ".allDepartmentTableArea", "系部信息");
					$.hideModal("#remindModal");
					$(".myTooltip").tooltipify();
				}else{
					toastr.warning('不能删除正在使用的系部');
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备新增年级
function addNewGrade(){
	$.showModal("#addNewGradeModal",true);
	$("#addNewGradeModal").find(".moadalTitle").html("新增年级");
	emptyGradeChooseArea();
	//确认新增年级
	$('.confimaddNewGrade').unbind('click');
	$('.confimaddNewGrade').bind('click', function(e) {
		confimaddNewGrade();
		e.stopPropagation();
	});
}

//确认新增年级
function confimaddNewGrade(){
	var newGradeObject=getGradeInfo();
	if(typeof newGradeObject ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewGrade",
		data: {
             "newGrade":JSON.stringify(newGradeObject) 
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
				if(backjson.namehave){
					toastr.warning('年级名称已存在');
					return;
				}
				
				newGradeObject.edu105_ID=backjson.id;
				newGradeObject.yxbz=backjson.yxbz;
				newGradeObject.njbm=backjson.njbm;
				$('#allGradeTable').bootstrapTable('prepend', newGradeObject);
				toastr.success('新增年级成功');
				$.hideModal("#addNewGradeModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allGradeTableArea", "年级信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备修改年级
function modifyGrade(row){
	$.showModal("#addNewGradeModal",true);
	$("#addNewGradeModal").find(".moadalTitle").html("修改年级");
	stufDeadultGradeInfo(row);
	//确认修改系部
	$('.confimaddNewGrade').unbind('click');
	$('.confimaddNewGrade').bind('click', function(e) {
		confimModifyGrade(row);
		e.stopPropagation();
	});
}

//确认修改年级
function confimModifyGrade(row){
	var newGradeObject=getGradeInfo();
	newGradeObject.njbm=row.njbm;
	if(typeof newGradeObject ==='undefined'){
		return;
	}
	newGradeObject.yxbz=row.yxbz;
	newGradeObject.edu105_ID=row.edu105_ID;
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateGrade",
		data: {
             "updateinfo":JSON.stringify(newGradeObject) 
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
				if(backjson.namehave){
					toastr.warning('年级名称已存在');
					return;
				}
				
				$("#allGradeTable").bootstrapTable('updateByUniqueId', {
					id: row.edu105_ID,
					row: newGradeObject
				});
				toastr.success('修改年级成功');
				$.hideModal("#addNewGradeModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allGradeTableArea", "年级信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//修改时填充该行信息到培养年级选择区
function stufDeadultGradeInfo(row){
	$("#addNewGrade_gradeName").val(row.njmc);
//	$("#addNewGrade_gradeCode").val(row.njbm);
}

//清空年级模态框中的值
function  emptyGradeChooseArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewGrade_gradeName";
	reReloadSearchsWithSelect(reObject);
}

//获取年级信息
function getGradeInfo(){
	var gradeName = $("#addNewGrade_gradeName").val();
//	var gradeCode = $("#addNewGrade_gradeCode").val();
	
	if(gradeName===""){
		toastr.warning('请输入年级名称');
		return;
	}
//	if(gradeCode===""){
//		toastr.warning('请输入年级编码');
//		return;
//	}

	
	var newGradeObject=new Object();
	newGradeObject.njmc=gradeName;
//	newGradeObject.njbm=gradeCode;
	return newGradeObject;
}

//单个删除年级
function removeGrade(removeID){
	$.showModal("#remindModal",true);
	$(".remindType").html("年级");
	$(".remindActionType").html("删除");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(removeID);
		sendGradeRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//批量删除年级
function reomoveGrades(){
	var chosenGrades = $('#allGradeTable').bootstrapTable('getAllSelections');
	if (chosenGrades.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html("年级");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenGrades.length; i++) {
			removeArray.push(chosenGrades[i].edu105_ID);
		}
		sendGradeRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除年级请求
function sendGradeRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeGrade",
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
					tableRemoveAction("#allGradeTable", removeArray, ".allGradeTableArea", "年级信息");
					$.hideModal("#remindModal");
					$(".myTooltip").tooltipify();
				}else{
					toastr.warning('不能删除正在使用的年级');
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备新增专业
function addNewMajor(){
	$.showModal("#addNewMajorModal",true);
	$("#addNewMajorModal").find(".moadalTitle").html("新增专业");
	emptyMajorChooseArea();
	//确认新增专业
	$('.confimaddNewMajor').unbind('click');
	$('.confimaddNewMajor').bind('click', function(e) {
		confimaddNewMajor();
		e.stopPropagation();
	});
}

//确认新增专业
function confimaddNewMajor(){
	var newMajorObject=getMajorInfo();
	if(typeof newMajorObject ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewMajor",
		data: {
             "newMajor":JSON.stringify(newMajorObject) 
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
				if(backjson.namehave){
					toastr.warning('专业名称已存在');
					return;
				}
				
				newMajorObject.edu106_ID=backjson.id;
				newMajorObject.yxbz=backjson.yxbz;
				newMajorObject.zybm=backjson.zybm;
				$('#allMajorTable').bootstrapTable('prepend', newMajorObject);
				toastr.success('新增专业成功');
				$.hideModal("#addNewMajorModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allMajorTableArea", "专业信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备修改专业
function modifyMajor(row){
	$.showModal("#addNewMajorModal",true);
	$("#addNewMajorModal").find(".moadalTitle").html("修改专业");
	stufDeadultMajorInfo(row);
	//确认修改系部
	$('.confimaddNewMajor').unbind('click');
	$('.confimaddNewMajor').bind('click', function(e) {
		confimModifyMajor(row);
		e.stopPropagation();
	});
}

//确认修改专业
function confimModifyMajor(row){
	var newMajorObject=getMajorInfo();
	newMajorObject.zybm=row.zybm;
	if(typeof newMajorObject ==='undefined'){
		return;
	}
	newMajorObject.yxbz=row.yxbz;
	newMajorObject.edu106_ID=row.edu106_ID;
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateMajor",
		data: {
             "updateinfo":JSON.stringify(newMajorObject) 
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
				if(backjson.namehave){
					toastr.warning('专业名称已存在');
					return;
				}
				$("#allMajorTable").bootstrapTable('updateByUniqueId', {
					id: row.edu106_ID,
					row: newMajorObject
				});
				toastr.success('修改专业成功');
				$.hideModal("#addNewMajorModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allMajorTableArea", "专业信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取专业信息
function getMajorInfo(){
	var majorName = $("#addNewMajor_mjorName").val();
//	var majorCode = $("#addNewMajor_majorCode").val();
	
	if(majorName===""){
		toastr.warning('请输入专业名称');
		return;
	}
//	if(majorCode===""){
//		toastr.warning('请输入专业编码');
//		return;
//	}

	
	var newMajorObject=new Object();
	newMajorObject.zymc=majorName;
//	newMajorObject.zybm=majorCode;
	return newMajorObject;
}

//清空专业模态框中的值
function emptyMajorChooseArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewMajor_mjorName";
	reReloadSearchsWithSelect(reObject);
}

//修改时填充该行信息到专业选择区
function stufDeadultMajorInfo(row){
	$("#addNewMajor_mjorName").val(row.zymc);
//	$("#addNewMajor_majorCode").val(row.zybm);
}

//单个删除年级
function removeMajor(removeID){
	$.showModal("#remindModal",true);
	$(".remindType").html("专业");
	$(".remindActionType").html("删除");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(removeID);
		sendMajorRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//批量删除专业
function  reomoveMajors(){
	var chosenMajors = $('#allMajorTable').bootstrapTable('getAllSelections');
	if (chosenMajors.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html("专业");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenMajors.length; i++) {
			removeArray.push(chosenMajors[i].edu106_ID);
		}
		sendMajorRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除专业请求
function sendMajorRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeMajor",
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
					tableRemoveAction("#allMajorTable", removeArray, ".allMajorTableArea", "专业信息");
					$.hideModal("#remindModal");
					$(".myTooltip").tooltipify();
				}else{
					toastr.warning('不能删除正在使用的专业');
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

/**
 * tab1 end
 * */



/**
 * tab2
 * */
//判断是否首次点击tab2
function judgmentIsFristTimeLoadTab2(){
	var isFirstShowTab2 = $(".isFirstShowTab2")[0].innerText;
	if (isFirstShowTab2 === "T") {
		$(".isFirstShowTab2").html("F");
		getAllStuffTab2Info();
		tab2BtnBind();
	}
}

//获取tab2所有默认填充的信息
function getAllStuffTab2Info(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getJxPublicCodes",
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
				stuffAllXnTable(backjson.allXn);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充学年表
function stuffAllXnTable(allRelationInfo){
	window.releaseNewsEvents = {
			'click #modifyXn': function(e, value, row, index) {
				modifyXn(row,index);
			},
			'click #confriModifyXn': function(e, value, row, index) {
				confrimModifyXn(row,index);
			},
			'click #cancelModifyXn': function(e, value, row, index) {
				cancelModifyXn(row,index);
			}
		};

		$('#xnTable').bootstrapTable('destroy').bootstrapTable({
			data: allRelationInfo,
			pagination: true,
			pageNumber: 1,
			pageSize: 5,
			pageList: [5],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
			toolbar: '#toolbar',
			showColumns: false,
			onPageChange: function() {
				drawPagination(".xnTableArea", "学年");
			},
			columns: [{
					field: 'edu400_ID',
					title: 'edu400_ID',
					align: 'center',
					visible: false
				}, 
				{
					field: 'xnmc',
					title: '学年名称',
					align: 'left',
					formatter: xnmcMatter
				}, 
				{
					field: 'kssj',
					title: '开始时间',
					align: 'left',
					formatter: kssjMatter
				}, 
				{
					field: 'jssj',
					title: '结束时间',
					align: 'left',
					formatter: jssjMatter
				},{
					field: 'zzs',
					title: '总周数',
					align: 'left',
					formatter: zzsMatter
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
					'<li id="modifyXn" class="modifyBtn modifyXn'+index+'"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
					'<li id="confriModifyXn" class="noneStart confrim'+index+'"><span><img src="img/right.png" style="width:24px"></span>确定</li>' +
					'<li id="cancelModifyXn" class="noneStart cancel'+index+'"><span><img src="images/t03.png" style="width:24px"></span>取消</li>' +
					'</ul>'
				]
				.join('');
		}
		
		function xnmcMatter(value, row, index) {
			return [
					'<div class="myTooltip xnmcTxt'+index+'" title="'+row.xnmc+'">'+row.xnmc+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modifyXn_name'+index+'" spellcheck="false">'
				]
				.join('');
		}
		
		function kssjMatter(value, row, index) {
			return [
					'<div class="myTooltip kssjTxt'+index+'" title="'+row.kssj+'">'+row.kssj+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modifyXn_startTime'+index+'" spellcheck="false">'
				]
				.join('');
		}
		
		function jssjMatter(value, row, index) {
			return [
					'<div class="myTooltip jssjTxt'+index+'" title="'+row.jssj+'">'+row.jssj+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modifyXn_endTime'+index+'" spellcheck="false">'
				]
				.join('');
		}
		
		function zzsMatter(value, row, index) {
			return [
					'<div class="myTooltip" title="'+row.zzs+'周">'+row.zzs+'周</div>'
				]
				.join('');
		}
		drawSearchInput(".xnTableArea");
		drawPagination(".xnTableArea", "学年");
		toolTipUp(".myTooltip");
		btnControl();
}

//预备修改学年
function modifyXn(row,index){
	$("#modifyXn_startTime"+index).val(row.kssj);
	$("#modifyXn_endTime"+index).val(row.jssj);
	$("#modifyXn_name"+index).val(row.xnmc);
	$("#modifyXn_startTime"+index).show();
	$("#modifyXn_endTime"+index).show();
	$("#modifyXn_name"+index).show();
	$(".confrim"+index).show();
	$(".cancel"+index).show();
	$(".modifyXn"+index).hide();
	$(".kssjTxt"+index).hide();
	$(".jssjTxt"+index).hide();
	$(".xnmcTxt"+index).hide();
	drawCalenr("#modifyXn_startTime"+index,true);
	drawCalenr("#modifyXn_endTime"+index,true);
	$("#xnTable td:last-child").addClass("actionChangeLastTD");
}

//取消修改学年
function cancelModifyXn(row,index){
	$("#modifyXn_startTime"+index).hide();
	$("#modifyXn_endTime"+index).hide();
	$("#modifyXn_name"+index).hide();
	$(".confrim"+index).hide();
	$(".cancel"+index).hide();
	$(".modifyXn"+index).show();
	$(".kssjTxt"+index).show();
	$(".jssjTxt"+index).show();
	$(".xnmcTxt"+index).show();
	$("#xnTable td:last-child").removeClass("actionChangeLastTD");
}

//确认修改学年
function confrimModifyXn(row,index){
	var modifyXn_name=$("#modifyXn_name"+index).val();
	var modifyXn_startTime=$("#modifyXn_startTime"+index).val();
	var modifyXn_endTime=$("#modifyXn_endTime"+index).val();
	if(modifyXn_name===row.xnmc&&modifyXn_startTime===row.kssj&&modifyXn_endTime===row.jssj){
		cancelModifyXn(row,index);
	}else{
		if(modifyXn_name===""){
			toastr.warning('学年名称不能为空');
			return;
		}
		
		if(modifyXn_startTime===""){
			toastr.warning('请选择学年开始时间');
			return;
		}
		
		if(modifyXn_endTime===""){
			toastr.warning('请选择学年结束时间');
			return;
		}
		
		if(!checkTime(modifyXn_startTime,modifyXn_endTime)){
			toastr.warning("结束时间必须晚于开始时间");
			return;
		}
		
		if(dayssBetw(modifyXn_startTime,modifyXn_endTime)<7){
			toastr.warning("学年时长不足7天");
			return;
		}
		
		if(dayssBetw(modifyXn_startTime,modifyXn_endTime)<7){
			toastr.warning("学年时长不足7天");
			return;
		}
		
		var xnObject=new Object();
		xnObject.edu400_ID=row.edu400_ID;
		xnObject.xnmc=modifyXn_name;
		xnObject.kssj=modifyXn_startTime;
		xnObject.jssj=modifyXn_endTime;
		xnObject.zzs=WeeksBetw(modifyXn_startTime,modifyXn_endTime);
		
		$("#remindModal").find(".remindType").html("学年");
		$("#remindModal").find(".remindActionType").html("修改");
		$.showModal("#remindModal",true);
		//二次确认修改学年
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			sendModifyXnInfo(xnObject);
			e.stopPropagation();
		});
	}
}

//发送修改学年请求
function sendModifyXnInfo(xnObject){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyXn",
		dataType : 'json',
		data: {
            "xninfo":JSON.stringify(xnObject) 
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
			if (backjson.result) {
				if (backjson.nameHave) {
					toastr.warning('学年名称已存在');
					return;
				}
				$("#xnTable").bootstrapTable('updateByUniqueId', {
					id: xnObject.edu400_ID,
					row: xnObject
				});
				toolTipUp(".myTooltip");
				toastr.success('修改成功');
				$.hideModal("#remindModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备新增学年
function addXn(){
	$("#addXnModal").find(".moadalTitle").html("新增学年");
	$.showModal("#addXnModal",true);
	drawCalenr("#addXn_startTime",true);
	drawCalenr("#addXn_endTime",true);
	//新增学年
	$('.addXn_confimBtn').unbind('click');
	$('.addXn_confimBtn').bind('click', function(e) {
		confimAddXn();
		e.stopPropagation();
	});
}

//确认新增学年
function confimAddXn(){
	var xnmc=$("#addXnName").val();
	var startTime=$("#addXn_startTime").val();
	var endTime=$("#addXn_endTime").val();
	if(xnmc===""){
		toastr.warning('学年名称不能为空');
		return;
	}
	
	if(startTime===""){
		toastr.warning('请选择学年开始时间');
		return;
	}
	
	if(endTime===""){
		toastr.warning('请选择学年结束时间');
		return;
	}
	
	if(!checkTime(startTime,endTime)){
		toastr.warning("结束时间必须晚于开始时间");
		return;
	}
	
	if(dayssBetw(startTime,endTime)<7){
		toastr.warning("学年时长不足7天");
		return;
	}
	
	if(dayssBetw(startTime,endTime)<7){
		toastr.warning("学年时长不足7天");
		return;
	}
	
	var xnObject=new Object();
	xnObject.xnmc=xnmc;
	xnObject.kssj=startTime;
	xnObject.jssj=endTime;
	xnObject.zzs=WeeksBetw(startTime,endTime);
	sendNewXnInfo(xnObject);
}

//发送新增学年请求
//发送新学年信息
function sendNewXnInfo(xnObject){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewXn",
		dataType : 'json',
		data: {
            "xninfo":JSON.stringify(xnObject) 
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
			if (backjson.result) {
				if (backjson.nameHave) {
					toastr.warning('学年名称已存在');
					return;
				}
				
				xnObject.edu400_ID=backjson.id;
				$('#xnTable').bootstrapTable("prepend", xnObject);
				$.hideModal("#addXnModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//判断开始结束时间大小
function checkTime(startTime,endTime){
	var start=new Date(startTime.replace("-", "/").replace("-", "/"));
	var end=new Date(endTime.replace("-", "/").replace("-", "/"));
	if(end<start){
	 	return false;
	}
	return true;
}

// 判断时间是否够一周
function dayssBetw(date1, date2) {
	var _dt1 = new Date(date1);
	var _dt2 = new Date(date2);
	var dt1 = _dt1.getTime();
	var dt2 = _dt2.getTime();
	return parseInt(Math.abs(dt1 - dt2) / 1000 / 60 / 60 / 24);
}

//获得周数  不足一周按一周算
function WeeksBetw(date1, date2) {
	var _dt1 = new Date(date1);
	var _dt2 = new Date(date2);
	var dt1 = _dt1.getTime();
	var dt2 = _dt2.getTime();
	var zzs=parseInt(Math.abs(dt1 - dt2) / 1000 / 60 / 60 / 24)/7;
	
	var r = /^[0-9]*[1-9][0-9]*$/　　// 正整数
	if(!r.test(zzs)){
		zzs=parseInt(zzs.toString().split('.')[0])+1;
	}
	return parseInt(zzs);
}

// tab2按钮事件绑定
function tab2BtnBind(){
	//新增学年
	$('#addXn').unbind('click');
	$('#addXn').bind('click', function(e) {
		addXn();
		e.stopPropagation();
	});
}
/**
 * tab2 end
 * */






/**
 * tab3
 * */
//判断是否首次点击层级关系管理
function judgmentIsFristTimeLoadTab3(){
	var isFirstShowTab3 = $(".isFirstShowTab3")[0].innerText;
	stuffRelationTipSelect();
	if (isFirstShowTab3 === "T") {
		$(".isFirstShowTab3").html("F");
		getAllRelationInfo();
		tab3BtnBind();
	}
}

//层次关系管理页面按钮事件绑定
function tab3BtnBind(){
	//批量删除关系
	$('#removeRelations').unbind('click');
	$('#removeRelations').bind('click', function(e) {
		removeRelations();
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
	
}

//获取所有层次关系
function getAllRelationInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRelationInfo",
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
				stuffAllRelationInfoTable(backjson.allRelationInfo);
				hideloding();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充层次关系管理表
function stuffAllRelationInfoTable(allRelationInfo){
	window.releaseNewsEvents = {
			'click #modifyRelation': function(e, value, row, index) {
				modifyRelation(row);
			},
			'click #removeRelation': function(e, value, row, index) {
				removeRelation(row.edu107_ID);
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
			onPageChange: function() {
				drawPagination(".relationTableArea", "培养计划信息");
			},
			columns: [{
					field: 'edu107_ID',
					title: 'edu107_ID',
					align: 'center',
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					visible: false
				},
				{
					field: 'check',
					checkbox: true
				},
				{
					field: 'pyjhmc',
					title: '培养计划名称',
					align: 'left',
					formatter: paramsMatter

				}, 
				{
					field: 'pyccmc',
					title: '培养层次名称',
					align: 'left',
					formatter: paramsMatter

				}, 
				{
					field: 'pyccbm',
					title: '培养层次代码',
					align: 'left',
					visible: false
				},
				{
					field: 'xbmc',
					title: '系部名称',
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'xbbm',
					title: '系部编码',
					align: 'left',
					visible: false
				},{
					field: 'njmc',
					title: '年级名称',
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'njbm',
					title: '年级编码',
					align: 'left',
					visible: false
				},{
					field: 'zymc',
					title: '专业名称',
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'zybm',
					title: '专业编码',
					align: 'left',
					visible: false
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

//预备修改关系
function modifyRelation(row){
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
	stuffManiaSelectWithDeafult("#addNewRelation_level",row.pyccbm);  //填充默认培养层次
	stuffManiaSelectWithDeafult("#addNewRelation_department",row.xbbm);  //填充默认系部
	stuffManiaSelectWithDeafult("#addNewRelation_garde",row.njbm);  //填充默认年级
	stuffManiaSelectWithDeafult("#addNewRelation_major",row.zybm);  //填充默认专业
	$("#addNewRelation_RelationName").val(row.pyjhmc);//填充默认培养计划名称
}

//确认修改关系
function confimModifyRelation(row){
	var newRelationObject=getRelationSelectInfo();
	
	if(typeof newRelationObject ==='undefined'){
		return;
	}
	newRelationObject.yxbz=row.yxbz;
	newRelationObject.edu107_ID=row.edu107_ID;
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateRelation",
		data: {
             "updateinfo":JSON.stringify(newRelationObject) 
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
				if(backjson.have){
					toastr.warning('层次关系已存在');
					return;
				}
				if(backjson.relationNameHave){
					toastr.warning('培养计划名称已存在');
					return;
				}
				$("#relationTable").bootstrapTable('updateByUniqueId', {
					id: row.edu107_ID,
					row: newRelationObject
				});
				toastr.success('修改培养计划成功');
				$.hideModal("#addNewRelationModal");
				$(".myTooltip").tooltipify();
				drawPagination(".relationTableArea", "培养计划信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备新增关系
function wantAddRelation(){
	$.showModal("#addNewRelationModal",true);
	$("#addNewRelationModal").find(".moadalTitle").html("新增培养计划");
	emptyRelationChooseArea();
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
			if (backjson.result) {
				hideloding();
				if(backjson.have){
					toastr.warning('层次关系已存在');
					return;
				}
				if(backjson.relationNameHave){
					toastr.warning('培养计划名称已存在');
					return;
				}
				newRelationObject.edu107_ID=backjson.id;
				newRelationObject.yxbz=backjson.yxbz;
				$('#relationTable').bootstrapTable('prepend', newRelationObject);
				toastr.success('新增培养计划成功');
				$.hideModal("#addNewRelationModal");
				$(".myTooltip").tooltipify();
				drawPagination(".relationTableArea", "培养计划信息");
			} else {
				toastr.warning('操作失败，请重试');
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
		toastr.warning('请选择系部');
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
	
	var newRelationObject=new Object();
	newRelationObject.pyccmc=relationlLevelText;
	newRelationObject.xbmc=relationDepartmentText;
	newRelationObject.njmc=relationGardeText;
	newRelationObject.zymc=relationMmajorText;
	newRelationObject.pyccbm=relationlLevelValue;
	newRelationObject.xbbm=relationDepartmentValue;
	newRelationObject.njbm=relationGardeValue;
	newRelationObject.zybm=relationMmajorValue;
	newRelationObject.pyjhmc=relationName;
	return newRelationObject;
}

//清空关系模态框中select的值
function emptyRelationChooseArea(){
	var reObject = new Object();
	reObject.normalSelectIds = "#addNewRelation_level,#addNewRelation_department,#addNewRelation_garde,#addNewRelation_major";
	reObject.InputIds = "#addNewRelation_RelationName";
	reReloadSearchsWithSelect(reObject);
}

//填充新增关系模态框中的下拉框选项
function stuffRelationTipSelect(){
	$('.isSowIndex').selectMania(); //初始化下拉框
	var allLevls = $("#allLevlTable").bootstrapTable("getData");
	var allDepartments = $("#allDepartmentTable").bootstrapTable("getData");
	var allGrades = $("#allGradeTable").bootstrapTable("getData");
	var allMajors = $("#allMajorTable").bootstrapTable("getData");
	
	//层次下拉框
	if(allLevls.length!==0){
		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < allLevls.length; i++) {
			str += '<option value="' + allLevls[i].pyccbm + '">' + allLevls[i].pyccmc + '</option>';
		}
		stuffManiaSelect("#addNewRelation_level", str);
	}
	
	//系部下拉框
	if(allDepartments.length!==0){
		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < allDepartments.length; i++) {
			str += '<option value="' + allDepartments[i].xbbm + '">' + allDepartments[i].xbmc + '</option>';
		}
		stuffManiaSelect("#addNewRelation_department", str);
	}
	
	//年级下拉框
	if(allGrades.length!==0){
		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < allGrades.length; i++) {
			str += '<option value="' + allGrades[i].njbm + '">' + allGrades[i].njmc + '</option>';
		}
		stuffManiaSelect("#addNewRelation_garde", str);
	}
	
	//专业下拉框
	if(allMajors.length!==0){
		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < allMajors.length; i++) {
			str += '<option value="' + allMajors[i].zybm + '">' + allMajors[i].zymc + '</option>';
		}
		stuffManiaSelect("#addNewRelation_major", str);
	}
}

//单个删除关系
function removeRelation(removeID){
	$.showModal("#remindModal",true);
	$(".remindType").html("培养计划");
	$(".remindActionType").html("删除");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(removeID);
		sendRelationRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//批量删除关系
function removeRelations() {
	var chosenRelations = $('#relationTable').bootstrapTable('getAllSelections');
	if (chosenRelations.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
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
			if (backjson.result) {
				hideloding();
				if(backjson.relationList.length===0){
					toastr.warning('暂无数据');
				}
				stuffAllRelationInfoTable(backjson.relationList);
			} else {
				toastr.warning('操作失败，请重试');
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
/**
 * tab3 end
 * */


//填充年份选择器
function stuffYearSearchElement(eve){
	$(eve).attr("value",45);
	$(eve).InputSpinner();
}

//页面初始化时按钮事件绑定
function btnbind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
	
	//新增层次
	$('#addNewLevel').unbind('click');
	$('#addNewLevel').bind('click', function(e) {
		addNewLevel();
		e.stopPropagation();
	});
	
	//批量删除培养层次
	$('#reomoveLevels').unbind('click');
	$('#reomoveLevels').bind('click', function(e) {
		reomoveLevels();
		e.stopPropagation();
	});

	//新增系部
	$('#addNewDepartment').unbind('click');
	$('#addNewDepartment').bind('click', function(e) {
		addNewDepartment();
		e.stopPropagation();
	});
	
	//批量删除系部
	$('#reomoveDepartments').unbind('click');
	$('#reomoveDepartments').bind('click', function(e) {
		reomoveDepartments();
		e.stopPropagation();
	});
	
	//新增年级
	$('#addNewGrade').unbind('click');
	$('#addNewGrade').bind('click', function(e) {
		addNewGrade();
		e.stopPropagation();
	});
	
	//批量删除年级
	$('#reomoveGrades').unbind('click');
	$('#reomoveGrades').bind('click', function(e) {
		reomoveGrades();
		e.stopPropagation();
	});
	
	//新增专业
	$('#addNewMajor').unbind('click');
	$('#addNewMajor').bind('click', function(e) {
		addNewMajor();
		e.stopPropagation();
	});
	
	//批量删除专业
	$('#reomoveMajors').unbind('click');
	$('#reomoveMajors').bind('click', function(e) {
		reomoveMajors();
		e.stopPropagation();
	});
}



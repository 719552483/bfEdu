var EJDMElementInfo;

$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	pageGPS("#publicCodeModel");
	pageGPS("#publicCodeModel_jw");
	$("input[type='number']").InputSpinner();
	// stuffYearSearchElement("input[type='number']");
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
				drawJiaoWuPublicCodeTables(backjson);
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
	stuffAllApproveTable(backjson.allApprove);
	stuffMajorBelongtoSelect();
}

var choosendLevel=new Array();
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
			onCheck : function(row) {
				onCheckLevel(row);
			},
			onUncheck : function(row) {
				onUncheckLevel(row);
			},
			onCheckAll : function(rows) {
				onCheckAllLevel(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAllLevel(rows2);
			},
			onPageChange: function() {
				drawPagination(".allLevlTableArea", "培养层次信息");
				for (var i = 0; i < choosendLevel.length; i++) {
					$("#allLevlTable").bootstrapTable("checkBy", {field:"edu103_ID", values:[choosendLevel[i].edu103_ID]})
				}
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [{
					field: 'edu103_ID',
					title: 'edu103_ID',
					align: 'center',
					sortable: true,
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					sortable: true,
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
					sortable: true,
					formatter: paramsMatter
				},{
					field: 'pyccbm',
					title: '培养层次编码',
					align: 'left',
					sortable: true,
					formatter: paramsMatter

				}, {
					field: 'rxjj',
					title: '入学季节',
					align: 'left',
					sortable: true,
					formatter: enterSeasonMatter
				}, {
					field: 'xq',
					title: '学区',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'xz',
					title: '学制',
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

//单选学生
function onCheckLevel(row){
	if(choosendLevel.length<=0){
		choosendLevel.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendLevel.length; i++) {
			if(choosendLevel[i].edu103_ID===row.edu103_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendLevel.push(row);
		}
	}
}

//单反选学生
function onUncheckLevel(row){
	if(choosendLevel.length<=1){
		choosendLevel.length=0;
	}else{
		for (var i = 0; i < choosendLevel.length; i++) {
			if(choosendLevel[i].edu103_ID===row.edu103_ID){
				choosendLevel.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllLevel(row){
	for (var i = 0; i < row.length; i++) {
		choosendLevel.push(row[i]);
	}
}

//全反选学生
function onUncheckAllLevel(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu103_ID);
	}


	for (var i = 0; i < choosendLevel.length; i++) {
		if(a.indexOf(choosendLevel[i].edu103_ID)!==-1){
			choosendLevel.splice(i,1);
			i--;
		}
	}
}

var choosendDepartment=new Array();
//填充二级学院表
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
			onCheck : function(row) {
				onCheckDepartment(row);
			},
			onUncheck : function(row) {
				onUncheckDepartment(row);
			},
			onCheckAll : function(rows) {
				onCheckAllDepartment(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAllDepartment(rows2);
			},
			onPageChange: function() {
				drawPagination(".allDepartmentTableArea", "二级学院信息");
				for (var i = 0; i < choosendDepartment.length; i++) {
					$("#allDepartmentTable").bootstrapTable("checkBy", {field:"edu104_ID", values:[choosendDepartment[i].edu104_ID]})
				}
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [{
					field: 'edu104_ID',
					title: 'edu104_ID',
					align: 'center',
					sortable: true,
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					sortable: true,
					visible: false
				},
				{
					field: 'check',
					checkbox: true
				},
				{
					field: 'xbmc',
					title: '二级学院名称',
					align: 'left',
					sortable: true,
					formatter: paramsMatter

				}, {
					field: 'xbbm',
					title: '二级学院代码',
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
					'<li class="modifyBtn" id="modifyDepartment"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
					'<li class="deleteBtn" id="removeDepartment"><span><img src="images/t03.png"></span>删除</li>' +
					'</ul>'
				]
				.join('');
		}
		drawSearchInput(".allDepartmentTableArea ");
		drawPagination(".allDepartmentTableArea", "二级学院信息");
		toolTipUp(".myTooltip");
		btnControl();
}

//单选学生
function onCheckDepartment(row){
	if(choosendDepartment.length<=0){
		choosendDepartment.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendDepartment.length; i++) {
			if(choosendDepartment[i].edu104_ID===row.edu104_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendDepartment.push(row);
		}
	}
}

//单反选学生
function onUncheckDepartment(row){
	if(choosendDepartment.length<=1){
		choosendDepartment.length=0;
	}else{
		for (var i = 0; i < choosendDepartment.length; i++) {
			if(choosendDepartment[i].edu104_ID===row.edu104_ID){
				choosendDepartment.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllDepartment(row){
	for (var i = 0; i < row.length; i++) {
		choosendDepartment.push(row[i]);
	}
}

//全反选学生
function onUncheckAllDepartment(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu104_ID);
	}


	for (var i = 0; i < choosendDepartment.length; i++) {
		if(a.indexOf(choosendDepartment[i].edu104_ID)!==-1){
			choosendDepartment.splice(i,1);
			i--;
		}
	}
}

var choosendGrade=new Array();
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
			onCheck : function(row) {
				onCheckGrade(row);
			},
			onUncheck : function(row) {
				onUncheckGrade(row);
			},
			onCheckAll : function(rows) {
				onCheckAllGrade(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAllGrade(rows2);
			},
			onPageChange: function() {
				drawPagination(".allGradeTableArea", "年级信息");
				for (var i = 0; i < choosendGrade.length; i++) {
					$("#allGradeTable").bootstrapTable("checkBy", {field:"edu105_ID", values:[choosendGrade[i].edu105_ID]})
				}
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [{
					field: 'edu105_ID',
					title: 'edu105_ID',
					align: 'center',
					sortable: true,
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					sortable: true,
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
					sortable: true,
					formatter: paramsMatter

				}, {
					field: 'njbm',
					title: '年级代码',
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

//单选学生
function onCheckGrade(row){
	if(choosendGrade.length<=0){
		choosendGrade.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendGrade.length; i++) {
			if(choosendGrade[i].edu105_ID===row.edu105_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendGrade.push(row);
		}
	}
}

//单反选学生
function onUncheckGrade(row){
	if(choosendGrade.length<=1){
		choosendGrade.length=0;
	}else{
		for (var i = 0; i < choosendGrade.length; i++) {
			if(choosendGrade[i].edu105_ID===row.edu105_ID){
				choosendGrade.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllGrade(row){
	for (var i = 0; i < row.length; i++) {
		choosendGrade.push(row[i]);
	}
}

//全反选学生
function onUncheckAllGrade(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu105_ID);
	}


	for (var i = 0; i < choosendGrade.length; i++) {
		if(a.indexOf(choosendGrade[i].edu105_ID)!==-1){
			choosendGrade.splice(i,1);
			i--;
		}
	}
}

var choosendMajor=new Array();
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
			onCheck : function(row) {
				onCheckMajor(row);
			},
			onUncheck : function(row) {
				onUncheckMajor(row);
			},
			onCheckAll : function(rows) {
				onCheckAllMajor(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAllMajor(rows2);
			},
			onPageChange: function() {
				drawPagination(".allMajorTableArea", "专业信息");
				for (var i = 0; i < choosendMajor.length; i++) {
					$("#allMajorTable").bootstrapTable("checkBy", {field:"edu106_ID", values:[choosendMajor[i].edu106_ID]})
				}
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [{
					field: 'edu106_ID',
					title: 'edu106_ID',
					align: 'center',
					sortable: true,
					visible: false
				}, {
					field: 'yxbz',
					title: '有效标志',
					align: 'left',
					sortable: true,
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
					sortable: true,
					formatter: paramsMatter

				}, {
					field: 'zybm',
					title: '专业代码',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				},{
					field: 'departmentName',
					title: '所属二级学院',
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

//单选学生
function onCheckMajor(row){
	if(choosendMajor.length<=0){
		choosendMajor.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendMajor.length; i++) {
			if(choosendMajor[i].edu106_ID===row.edu106_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendMajor.push(row);
		}
	}
}

//单反选学生
function onUncheckMajor(row){
	if(choosendMajor.length<=1){
		choosendMajor.length=0;
	}else{
		for (var i = 0; i < choosendMajor.length; i++) {
			if(choosendMajor[i].edu106_ID===row.edu106_ID){
				choosendMajor.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllMajor(row){
	for (var i = 0; i < row.length; i++) {
		choosendMajor.push(row[i]);
	}
}

//全反选学生
function onUncheckAllMajor(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu106_ID);
	}


	for (var i = 0; i < choosendMajor.length; i++) {
		if(a.indexOf(choosendMajor[i].edu106_ID)!==-1){
			choosendMajor.splice(i,1);
			i--;
		}
	}
}

//预备新增培养层次
function addNewLevel(){
	$.showModal("#addNewLevelModal",true);
	$("#addNewLevelModal").find(".moadalTitle").html("新增层次");
	$('#addNewLevel_levelCode').attr("disabled", false) // 编码可修改
	$('#addNewLevel_levelCode').val("");
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
				if(backjson.codehave){
					toastr.warning('培养层次编码已存在');
					return;
				}
				
				newLevelObject.edu103_ID=backjson.id;
				newLevelObject.yxbz=backjson.yxbz;
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
	$('#addNewLevel_levelCode').attr("disabled", true) // 编码不可修改
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
				if(backjson.codehave){
					toastr.warning('培养层次编码已存在');
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
	// stuffManiaSelectWithDeafult("#addNewLevel_schoolLocation",row.xq);  //填充默认培养层次
	$("#addNewLevel_levelName").val(row.pyccmc);//填充默认培养层次名称
	$("#addNewLevel_levelCode").val(row.pyccbm);//填充默认培养层次编码
	stuffManiaSelectWithDeafult("#addNewLevel_enterSeason",row.rxjj);  //填充默认入学季节
	$("#addNewLevel_academicStructure").val(row.xz);//填充默认培养层次编码
}

//清空培养层次模态框中select的值
function emptyLevelChooseArea(){
	var reObject = new Object();
	reObject.normalSelectIds = "#addNewLevel_enterSeason";
	reObject.InputIds = "#addNewLevel_levelName,#addNewLevel_academicStructure";
	reReloadSearchsWithSelect(reObject);
}

//获取培养层次信息
function getLevelInfo(){
	// var schoolLocation = getNormalSelectValue("addNewLevel_schoolLocation");
	var levelName = $("#addNewLevel_levelName").val();
	var levelCode = $("#addNewLevel_levelCode").val();
	var enterSeason = getNormalSelectValue("addNewLevel_enterSeason");
	var academicStructure = $("#addNewLevel_academicStructure").val();
	
	// if(schoolLocation===""){
	// 	toastr.warning('请选择校区');
	// 	return;
	// }
	if(levelName===""){
		toastr.warning('请输入培养层次名称');
		return;
	}
	if(levelCode===""){
		toastr.warning('请输入培养层次编码');
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
	// newRelationObject.xq=schoolLocation;
	newRelationObject.pyccmc=levelName;
	newRelationObject.pyccbm=levelCode;
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
	var chosenLevels = choosendLevel;
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

//预备新增二级学院
function addNewDepartment(){
	$.showModal("#addNewDeaparmentModal",true);
	$("#addNewDeaparmentModal").find(".moadalTitle").html("新增二级学院");
	$('#addNewDeaparment_deaparmentCode').attr("disabled", false) // 编码可修改
	$('#addNewDeaparment_deaparmentCode').val("");
	emptyDepartmentChooseArea();
	//确认新增二级学院
	$('.confimaddNewDeaparment').unbind('click');
	$('.confimaddNewDeaparment').bind('click', function(e) {
		confimAddNewDeaparment();
		e.stopPropagation();
	});
}

//确认新增二级学院
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
					toastr.warning('二级学院名称已存在');
					return;
				}
				if(backjson.codehave){
					toastr.warning('二级学院编码已存在');
					return;
				}
				
				newDeaparmentObject.edu104_ID=backjson.id;
				newDeaparmentObject.yxbz=backjson.yxbz;
				$('#allDepartmentTable').bootstrapTable('prepend', newDeaparmentObject);
				toastr.success('新增二级学院成功');
				$.hideModal("#addNewDeaparmentModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allDepartmentTableArea", "二级学院信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备修改二级学院
function modifyDepartment(row){
	$.showModal("#addNewDeaparmentModal",true);
	$("#addNewDeaparmentModal").find(".moadalTitle").html("修改二级学院");
	$('#addNewDeaparment_deaparmentCode').attr("disabled", true) // 编码不可修改
	stufDeadultDepartmentInfo(row);
	//确认修改二级学院
	$('.confimaddNewDeaparment').unbind('click');
	$('.confimaddNewDeaparment').bind('click', function(e) {
		confimModifyDeaparment(row);
		e.stopPropagation();
	});
}

//确认修改二级学院
function confimModifyDeaparment(row){
	var newDeaparmentObject=getDeaparmentInfo();
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
					toastr.warning('二级学院名称已存在');
					return;
				}
				if(backjson.codehave){
					toastr.warning('二级学院编码已存在');
					return;
				}
				$("#allDepartmentTable").bootstrapTable('updateByUniqueId', {
					id: row.edu104_ID,
					row: newDeaparmentObject
				});
				toastr.success('修改二级学院成功');
				$.hideModal("#addNewDeaparmentModal");
				$(".myTooltip").tooltipify();
				drawPagination(".allDepartmentTableArea", "二级学院信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//修改时填充该行信息到二级学院选择区
function stufDeadultDepartmentInfo(row){
	$("#addNewDeaparment_deaparmentName").val(row.xbmc);
	$("#addNewDeaparment_deaparmentCode").val(row.xbbm);
	if(row.iskk!=null){
		stuffManiaSelectWithDeafult("#iskk", row.iskk);
	}else{
		var reObject = new Object();
		reObject.normalSelectIds = "#iskk";
		reReloadSearchsWithSelect(reObject);
	}
	if(row.ispk!=null){
		stuffManiaSelectWithDeafult("#ispk", row.ispk);
	}else{
		var reObject = new Object();
		reObject.normalSelectIds = "#ispk";
		reReloadSearchsWithSelect(reObject);
	}
}

//清空二级学院模态框中的值
function  emptyDepartmentChooseArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewDeaparment_deaparmentName";
	reObject.normalSelectIds = "#iskk,#ispk";
	reReloadSearchsWithSelect(reObject);
}

//获取二级学院信息
function getDeaparmentInfo(){
	var deaparmentName = $("#addNewDeaparment_deaparmentName").val();
	var deaparmentCode = $("#addNewDeaparment_deaparmentCode").val();
	var iskk =getNormalSelectValue("iskk");
	var ispk =getNormalSelectValue("ispk");
	
	if(deaparmentName===""){
		toastr.warning('请输入二级学院名称');
		return;
	}
	if(deaparmentCode===""){
		toastr.warning('请输入二级学院编码');
		return;
	}
	var newDeaparmentObject=new Object();
	if(iskk!==""){
		newDeaparmentObject.iskk=iskk;
	}
	if(ispk!==""){
		newDeaparmentObject.ispk=ispk;
	}
	newDeaparmentObject.xbmc=deaparmentName;
	newDeaparmentObject.xbbm=deaparmentCode;
	return newDeaparmentObject;
}

//单个删除二级学院
function removeDepartment(removeID){
	$.showModal("#remindModal",true);
	$(".remindType").html("二级学院");
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

//批量删除二级学院
function reomoveDepartments(){
	var chosenDepartments = choosendDepartment;
	if (chosenDepartments.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html("二级学院");
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

//发送删除二级学院请求
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
					tableRemoveAction("#allDepartmentTable", removeArray, ".allDepartmentTableArea", "二级学院信息");
					$.hideModal("#remindModal");
					$(".myTooltip").tooltipify();
				}else{
					toastr.warning('不能删除正在使用的二级学院');
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
	$('#addNewGrade_gradeCode').attr("disabled", false) // 编码可修改
	$('#addNewGrade_gradeCode').val("");
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
				if(backjson.codehave){
					toastr.warning('年级编码已存在');
					return;
				}
				
				newGradeObject.edu105_ID=backjson.id;
				newGradeObject.yxbz=backjson.yxbz;
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
	$('#addNewGrade_gradeCode').attr("disabled", true); // 编码不可修改
	stufDeadultGradeInfo(row);
	//确认修改二级学院
	$('.confimaddNewGrade').unbind('click');
	$('.confimaddNewGrade').bind('click', function(e) {
		confimModifyGrade(row);
		e.stopPropagation();
	});
}

//确认修改年级
function confimModifyGrade(row){
	var newGradeObject=getGradeInfo();
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
				if(backjson.codehave){
					toastr.warning('年级编码已存在');
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
	$("#addNewGrade_gradeCode").val(row.njbm);
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
	var gradeCode = $("#addNewGrade_gradeCode").val();
	
	if(gradeName===""){
		toastr.warning('请输入年级名称');
		return;
	}
	if(gradeCode===""){
		toastr.warning('请输入年级编码');
		return;
	}

	
	var newGradeObject=new Object();
	newGradeObject.njmc=gradeName;
	newGradeObject.njbm=gradeCode;
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
	var chosenGrades = choosendGrade;
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
	$('#addNewMajor_majorCode').attr("disabled", false) // 编码可修改
	$('#addNewMajor_majorCode').val("");
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
	$('#addNewMajor_majorCode').attr("disabled", true) // 编码不可修改
	stufDeadultMajorInfo(row);
	//确认修改二级学院
	$('.confimaddNewMajor').unbind('click');
	$('.confimaddNewMajor').bind('click', function(e) {
		confimModifyMajor(row);
		e.stopPropagation();
	});
}

//确认修改专业
function confimModifyMajor(row){
	var newMajorObject=getMajorInfo();
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
				if(backjson.codehave){
					toastr.warning('专业编码已存在');
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
	var majorCode = $("#addNewMajor_majorCode").val();
	var Edu104_ID=getNormalSelectValue("majorBelongto");
	var departmentName=getNormalSelectText("majorBelongto");

	if(Edu104_ID===""){
		toastr.warning('请选择专业所属二级学院');
		return;
	}
	if(majorName===""){
		toastr.warning('请输入专业名称');
		return;
	}
	if(majorCode===""){
		toastr.warning('请输入专业编码');
		return;
	}

	
	var newMajorObject=new Object();
	newMajorObject.zymc=majorName;
	newMajorObject.zybm=majorCode;
	newMajorObject.edu104_ID=Edu104_ID;
	newMajorObject.departmentName=departmentName;
	return newMajorObject;
}

//清空专业模态框中的值
function emptyMajorChooseArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewMajor_mjorName";
	reObject.normalSelectIds = "#majorBelongto";
	reReloadSearchsWithSelect(reObject);
}

//修改时填充该行信息到专业选择区
function stufDeadultMajorInfo(row){
	$("#addNewMajor_mjorName").val(row.zymc);
	$("#addNewMajor_majorCode").val(row.zybm);
	stuffManiaSelectWithDeafult("#majorBelongto", row.edu104_ID);
}

//填充专业所属二级学院下拉框
function stuffMajorBelongtoSelect(){
	var allDepartments=$("#allDepartmentTable").bootstrapTable('getData');
	var str='';
	if(allDepartments.length==0){
		str='<option value="seleceConfigTip">暂无选择</option>';
		toastr.warning('暂无二级学院');
	}else{
		str='<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < allDepartments.length; i++) {
			str += '<option value="' + allDepartments[i].edu104_ID + '">' + allDepartments[i].xbmc+ '</option>';
		}
	}
	stuffManiaSelect("#majorBelongto", str);
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
	var chosenMajors =choosendMajor;
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

//填充审批流程表
function stuffAllApproveTable(allApprove){
	window.releaseNewsEvents = {
		'click #modifySingleApprove': function(e, value, row, index) {
			modifySingleApprove(row,index);
		},
		'click #writeSingleApprove': function(e, value, row, index) {
			writeSingleApprove(row);
		},
		'click #confriModifySingleApprove': function(e, value, row, index) {
			confriModifySingleApprove(row,index);
		},
		'click #cancelModifySingleApprove': function(e, value, row, index) {
			cancelModifySingleApprove(row,index);
		}
	};

	$('#allApproveTable').bootstrapTable('destroy').bootstrapTable({
		data: allApprove,
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
			drawPagination(".allApproveTableArea", "审批流程");
		},
		onPostBody : function() {
			sfqyControlBind();
			toolTipUp(".myTooltip");
		},
		columns: [{
			field: 'edu603Id',
			title: '唯一ID',
			align: 'center',
			sortable: true,
			visible: false
		}, {
			field: 'businessName',
			title: '审批类型',
			align: 'left',
			sortable: true,
			formatter: businessNameMatter
		},
		{
			field: 'num',
			title: '审批节点个数',
			align: 'center',
			sortable: true,
			width:'50',
			formatter: numMatter
		}, {
			field: 'sfqy',
			title: '使用状态',
			align: 'left',
			sortable: true,
			width:'200',
			formatter: sfqyMatter
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
			'<li class="modifyBtn modifySingleApprove'+index+'" id="modifySingleApprove"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
			'<li class="modifyBtn writeSingleApprove'+index+'" id="writeSingleApprove"><span><img src="img/info.png" style="width:24px"></span>详情/自定义节点</li>'+
			'<li class="noneStart confrimModifySingleApprove'+index+'" id="confriModifySingleApprove"><span><img src="img/right.png" style="width:24px"></span>确定</li>' +
			'<li class="noneStart cancelModifySingleApprove'+index+'" id="cancelModifySingleApprove"><span><img src="images/t03.png" style="width:24px"></span>取消</li>' +
			'</ul>'
		]
			.join('');
	}

	function businessNameMatter(value, row, index) {
		return [ '<div class="myTooltip businessNameTxt'+index+'" title="'+value+'">'+value+'</div>' +
				'<input name="" type="text" class="dfinput Mydfinput noneStart" id="businessName'+index+'" spellcheck="false">' ]
			.join('');
	}

	function numMatter(value, row, index) {
		return [ '<div class="myTooltip" title="'+value+'个">'+value+'个</div>' ]
			.join('');
	}

	function sfqyMatter(value, row, index) {
		if (value==="T") {
			return [
				'<span class="noneStart">是</span><section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="sfqyControl" id="sfqyControl'+index+'" edu603Id="'+row.edu603Id+'" type="checkbox" checked="checked"><label></label></div></section>'
			]
				.join('');
		} else {
			return [
				'<span class="noneStart">否</span><section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="sfqyControl" id="sfqyControl'+index+'" edu603Id="'+row.edu603Id+'" type="checkbox"><label></label></div></section>'
			]
				.join('');
		}
	}

	drawSearchInput(".allApproveTableArea ");
	drawPagination(".allApproveTableArea", "审批流程");
	toolTipUp(".myTooltip");
	btnControl();
}

//switch事件绑定
function sfqyControlBind() {
	$(".sfqyControl").change(function(e) {
			var index=parseInt(e.currentTarget.attributes[0].nodeValue);
			var edu603Id=e.currentTarget.attributes[3].nodeValue;
			var currentStatu=$('#sfqyControl'+index)[0].checked;
			currentStatu?currentStatu="T":currentStatu="F";
			$.ajax({
			method : 'get',
			cache : false,
			url : "/updateApproveZt",
			data:{
				"edu603Id":edu603Id,
				"sfqy":currentStatu
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
					$('#allApproveTable').bootstrapTable('updateCell', {
						index: index,
						field: "sfqy",
						value:currentStatu
					});
				} else {
					toastr.warning(backjson.msg);
				}
			}
		});
			e.stopPropagation();
	});
}

//预备修改单个审批流程
function modifySingleApprove(row,index){
	$('#businessName'+index).show();
	$('.confrimModifySingleApprove'+index).show();
	$('.cancelModifySingleApprove'+index).show();
	$('.businessNameTxt'+index).hide();
	$('.modifySingleApprove'+index).hide();
	$('.writeSingleApprove'+index).hide();
	$('#businessName'+index).val(row.businessName).focus();
}

//取消修改单个审批流程
function cancelModifySingleApprove(row,index){
	$('#businessName'+index).hide();
	$('.confrimModifySingleApprove'+index).hide();
	$('.cancelModifySingleApprove'+index).hide();
	$('.businessNameTxt'+index).show();
	$('.modifySingleApprove'+index).show();
	$('.writeSingleApprove'+index).show();
}

//确认修改单个审批流程
function confriModifySingleApprove(row,index){
	var newName=$('#businessName'+index).val();
	if(newName===''){
		toastr.warning('审批类型不能为空');
	}

	$.showModal("#remindModal",true);
	$(".remindType").html(row.businessName);
	$(".remindActionType").html("修改");
	//确认发布任务书
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendModifySingleApprove(row,newName);
		e.stopPropagation();
	});
}

//发送修改单个审批流程的名字
function sendModifySingleApprove(row,newName){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateApproveName",
		data: {
			"edu603Id":row.edu603Id,
			"businessName":newName
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
				row.businessName=newName;
				$('#allApproveTable').bootstrapTable('updateByUniqueId', {
					id: row.edu603Id,
					row: row
				});
				$.hideModal();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取审批流程详情
function writeSingleApprove(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getApproveDetail",
		data: {
			"edu603Id":row.edu603Id
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
				stuffWriteSingleApprove(backjson.data,row);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染审批流程详情
function stuffWriteSingleApprove(data,row){
	$('.isModifying').html('F');
	$.showModal("#approvalDetailsModal",true);
	$("#approvalDetailsModal").find(".moadalTitle").html(row.businessName+"详情");
	$(".historyInfo").empty();
	$('.reShowApprovalDetails,.confirmChangeApprovalDetails').hide();
	var historyTxt="";
	for (var i = 0; i < data.length; i++) {
		var currentHistory= data[i];
		historyTxt+='<div class="historyArea historyArea'+i+'" index="'+i+'" id="'+currentHistory.edu602Id+'">' +
			'<p class="Historystep" approvalIndex="'+currentHistory.approvalIndex+'" businessType="'+currentHistory.businessType+'" currentRole="'+currentHistory.currentRole+'" currentRoleMc="'+currentHistory.currentRoleMc+'" edu602Id="'+currentHistory.edu602Id+'" lastRole="'+currentHistory.lastRole+'">审批节点'+(i+1)+'</p>' +
			'<div>' +
			'<span><cite>节点顺序：</cite><b>'+nullMatter(currentHistory.approvalIndex)+'</b></span>'+
			'<span><cite>审批角色：</cite><b>'+nullMatter(currentHistory.currentRoleMc)+'</b><div class="searchArea searchAreaWitheSelect searchAreaWitheSelect'+currentHistory.edu602Id+'"><div class="col1"><div class=""><select class="isSowIndex noneStart" id="role'+currentHistory.edu602Id+'"/><input name="" type="button" class="sure noneStart cancelChangeBtn" id="cancelChange'+currentHistory.edu602Id+'" value="取消"/></div></div></div></span>'+
			'<p class="col4 addLastStep" index="'+(i+1)+'"><img class="approvalActionImg" src="images/uew_icon_hover.png">新增上一节点</p>'+
			'<p class="col4 addNextStep" index="'+(i+1)+'"><img class="approvalActionImg" src="images/uew_icon_hover.png"/>新增下一节点</p>'+
			'<p class="col4 modifyStep" index="'+(i+1)+'"><img class="approvalActionImg" src="images/t02.png">修改此节点</p>'+
			'<p class="col4 deleteThisStep" index="'+(i+1)+'"><img class="approvalActionImg" src="images/close1.png">删除此节点</p>'+
			'</div></div>';
		if((i+1)!=data.length){
			historyTxt+='<img class="spiltImg spiltImg'+currentHistory.edu602Id+'" id="spiltImg'+currentHistory.edu602Id+'" src="images/uew_icon_hover.png"/>';
		}
	}
	$(".historyInfo").append(historyTxt);

	//新增上一节点
	$('.addLastStep').unbind('click');
	$('.addLastStep').bind('click', function(e) {
		addLastStep(data,row,e);
		e.stopPropagation();
	});

	//新增下一节点
	$('.addNextStep').unbind('click');
	$('.addNextStep').bind('click', function(e) {
		addNextStep(data,row,e);
		e.stopPropagation();
	});

	//修改当前节点
	$('.modifyStep').unbind('click');
	$('.modifyStep').bind('click', function(e) {
		modifyStep(e,data);
		e.stopPropagation();
	});

	//删除此节点
	$('.deleteThisStep').unbind('click');
	$('.deleteThisStep').bind('click', function(e) {
		deleteThisStep(e);
		e.stopPropagation();
	});

	//还原
	$('.reShowApprovalDetails').unbind('click');
	$('.reShowApprovalDetails').bind('click', function(e) {
		writeSingleApprove(row);
		e.stopPropagation();
	});

	//确认修改审批节点
	$('.confirmChangeApprovalDetails').unbind('click');
	$('.confirmChangeApprovalDetails').bind('click', function(e) {
		confirmChangeApprovalDetails(row.edu603Id);
		e.stopPropagation();
	});
}

//删除此节点
function deleteThisStep(eve){
	var isModifying=$('.isModifying')[0].innerText;
	if(isModifying==='T'){
		toastr.warning('请先进行上一个修改操作');
		return;
	}
	var currentAll=$('.historyInfo').find('.historyArea').length;
	if(currentAll<=2){
		toastr.warning('至少保留两个节点');
		return;
	}

	var id=eve.currentTarget.parentElement.parentElement.id;
	var isLast=eve.currentTarget.attributes[1].nodeValue;
	if(parseInt(isLast)===currentAll&&eve.currentTarget.parentElement.parentElement.previousSibling!=null){
		$('#'+eve.currentTarget.parentElement.parentElement.previousSibling.id).remove();
	}
	$('.spiltImg'+id).remove();
	$('#'+id).remove();

	if($('.historyInfo').find('.historyArea').length===1){
		$('.spiltImg').remove();
	}

	currentAll=$('.historyInfo').find('.historyArea');
	for (var i = 0; i < currentAll.length; i++) {
		var index=currentAll[i].attributes[1].nodeValue;
		$('.historyArea'+index).find('.Historystep').html('审批节点'+(i+1));
		$('.historyArea'+index).find('span:eq(0)').find('b').html(i+1);
	}

	$('.confirmChangeApprovalDetails,.reShowApprovalDetails').show();
	$('.isModifying').html('F');
}

//修改当前节点
function modifyStep(eve,rowData){
	var isModifying=$('.isModifying')[0].innerText;
	if(isModifying==='T'){
		toastr.warning('请先进行上一个修改操作');
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRole",
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
			if (backjson.code === 200 && backjson.data.allRole.length!=0) {
				var id=eve.currentTarget.parentElement.parentElement.id;
				var allRole=backjson.data.allRole;
				var currentRole=eve.currentTarget.parentElement.parentElement.childNodes[0].attributes[3].nodeValue;
				var str = '';
				for (var i = 0; i <allRole.length; i++) {
					str += '<option value="' + allRole[i].bf991_ID + '">' + allRole[i].js + '</option>';
				}
				stuffManiaSelect('#role'+id, str);
				$('#'+id).find('span:eq(1)').find('b').hide();
				$('.searchAreaWitheSelect'+id).show();
				$('#cancelChange'+id).show();
				$('.isModifying').html('T');
				stuffManiaSelectWithDeafult2('#role'+id,currentRole);

				$('#role'+id).off('change').change(function(e) {
					modifyStepChangeAction(id,currentRole,rowData);
					e.stopPropagation();
				});

				//取消
				$('#cancelChange'+id).unbind('click');
				$('#cancelChange'+id).bind('click', function(e) {
					$('#'+id).find('span:eq(1)').find('b').show();
					$('.searchAreaWitheSelect'+id).hide();
					$('#cancelChange'+id).hide();
					$('.isModifying').html('F');
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//修改当前节点change事件
function modifyStepChangeAction(id,currentRole,rowData){
	var changeRole=getNormalSelectValue('role'+id);
	var changeRoleTxt=getNormalSelectText('role'+id);

	var copyArr = $.extend(true, [], rowData); //数组深度复制 制完成后两个数组对内容修改时互不影响
	for (var i = 0; i < copyArr.length; i++) {
		if(copyArr[i].currentRole===parseInt(currentRole)){
			copyArr.splice(i,1);
			break;
		}
	}

	for (var i = 0; i < copyArr.length; i++) {
		if(copyArr[i].currentRole===parseInt(changeRole)){
			toastr.warning('该角色已包含');
			return;
		}
	}
	$('#'+id).find('span:eq(1)').find('b').show().html(changeRoleTxt);
	$('.searchAreaWitheSelect'+id).hide();
	$('#cancelChange'+id).hide();
	$('#'+id).find('.Historystep').attr('currentRole',changeRole);
	$('#'+id).find('.Historystep').attr('currentRoleMc',changeRoleTxt);
	$('.confirmChangeApprovalDetails,.reShowApprovalDetails').show();
	$('.isModifying').html('F');
}

//新增上一节点
function addLastStep(data,row,eve){
	var isModifying=$('.isModifying')[0].innerText;
	if(isModifying==='T'){
		toastr.warning('请先进行上一个新增操作');
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRole",
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
			if (backjson.code === 200 && backjson.data.allRole.length!=0) {
				var allRole=backjson.data.allRole;
				var currentIndex=eve.currentTarget.parentElement.parentElement.attributes[1].nodeValue;;
				// //拼接新对象
				var appendObject=new Object();
				appendObject.index=parseInt(currentIndex);
				appendObject.edu602Id=newUuid();
				appendObject.approvalIndex=parseInt(currentIndex)+1;
				appendObject.businessType='';
				appendObject.currentRole=allRole[0].bf991_ID;
				appendObject.currentRoleMc=allRole[0].js;
				appendObject.lastRole='';

				var data2 = new Array();
				for (var i = 0; i < data.length; i++) {
					if(i === appendObject.index){
						data2.push(appendObject);
						data[i].index = data[i].index+1;
						var appendObject2 = data[i];
						appendObject2.approvalIndex = parseInt(appendObject2.approvalIndex)+1;
						data2.push(appendObject2);
					}else if(i<appendObject.index){
						data2.push(data[i]);
					}else{
						var appendObject2 = data[i];
						data[i].index = data[i].index+1;
						appendObject2.approvalIndex = parseInt(appendObject2.approvalIndex)+1;
						data2.push(appendObject2);
					}

				}
				stuffWriteSingleApprove(data2,row);

				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i <allRole.length; i++) {
					str += '<option value="' + allRole[i].bf991_ID + '">' + allRole[i].js + '</option>';
				}
				stuffManiaSelect('#role'+appendObject.edu602Id, str);
				$('#'+appendObject.edu602Id).find('span:eq(1)').find('b').hide();
				$('.searchAreaWitheSelect'+appendObject.edu602Id).show();
				$('#cancelChange'+appendObject.edu602Id).show();
				$('.isModifying').html('T');

				$('#role'+appendObject.edu602Id).change(function(e) {
					modifyStepChangeAction(appendObject.edu602Id,allRole[0].bf991_ID,data2);
					e.stopPropagation();
				});

				//取消
				$('#cancelChange'+appendObject.edu602Id).unbind('click');
				$('#cancelChange'+appendObject.edu602Id).bind('click', function(e) {
					if(getNormalSelectValue('role'+appendObject.edu602Id)===''){
						toastr.warning('请选择角色');
						return;
					}

					if(parseInt(getNormalSelectValue('role'+appendObject.edu602Id))===appendObject.currentRole){
						toastr.warning('角色已包含');
						return;
					}

					$('#'+appendObject.edu602Id).find('span:eq(1)').find('b').show();
					$('.searchAreaWitheSelect'+appendObject.edu602Id).hide();
					$('#cancelChange'+appendObject.edu602Id).hide();
					$('.isModifying').html('F');
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//新增下一节点
function addNextStep(data,row,eve){
	var isModifying=$('.isModifying')[0].innerText;
	if(isModifying==='T'){
		toastr.warning('请先进行上一个新增操作');
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRole",
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
			if (backjson.code === 200 && backjson.data.allRole.length!=0) {
				var allRole=backjson.data.allRole;
				var currentIndex=eve.currentTarget.parentElement.parentElement.attributes[1].nodeValue;;
				// //拼接新对象
				var appendObject=new Object();
				appendObject.index=parseInt(currentIndex)+1;
				appendObject.edu602Id=newUuid();
				appendObject.approvalIndex=parseInt(currentIndex)+2;
				appendObject.businessType='';
				appendObject.currentRole=allRole[0].bf991_ID;
				appendObject.currentRoleMc=allRole[0].js;
				appendObject.lastRole='';

				var data2 = new Array();
				if(appendObject.index === data.length){
					data.push(appendObject);
					data2= data;
					stuffWriteSingleApprove(data2,row);
				}else{
					for (var i = 0; i < data.length; i++) {
						if(i<appendObject.index){
							data2.push(data[i]);
						}else if(i === appendObject.index){
							data2.push(appendObject);
							var appendObject2 = data[i];
							data[i].index = data[i].index+1;
							appendObject2.approvalIndex = parseInt(appendObject2.approvalIndex)+1;
							data2.push(appendObject2);
						}else{
							var appendObject2 = data[i];
							data[i].index = data[i].index+1;
							appendObject2.approvalIndex = parseInt(appendObject2.approvalIndex)+1;
							data2.push(appendObject2);
						}
					}
					stuffWriteSingleApprove(data2,row);
				}

				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i <allRole.length; i++) {
					str += '<option value="' + allRole[i].bf991_ID + '">' + allRole[i].js + '</option>';
				}
				stuffManiaSelect('#role'+appendObject.edu602Id, str);
				$('#'+appendObject.edu602Id).find('span:eq(1)').find('b').hide();
				$('.searchAreaWitheSelect'+appendObject.edu602Id).show();
				$('#cancelChange'+appendObject.edu602Id).show();
				$('.isModifying').html('T');

				$('#role'+appendObject.edu602Id).change(function(e) {
					modifyStepChangeAction(appendObject.edu602Id,allRole[0].bf991_ID,data2);
					e.stopPropagation();
				});

				//取消
				$('#cancelChange'+appendObject.edu602Id).unbind('click');
				$('#cancelChange'+appendObject.edu602Id).bind('click', function(e) {
					if(getNormalSelectValue('role'+appendObject.edu602Id)===''){
						toastr.warning('请选择角色');
						return;
					}

					if(parseInt(getNormalSelectValue('role'+appendObject.edu602Id))===appendObject.currentRole){
						toastr.warning('角色已包含');
						return;
					}

					$('#'+appendObject.edu602Id).find('span:eq(1)').find('b').show();
					$('.searchAreaWitheSelect'+appendObject.edu602Id).hide();
					$('#cancelChange'+appendObject.edu602Id).hide();
					$('.isModifying').html('F');
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//确认修改审批节点
function confirmChangeApprovalDetails(edu603Id){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/updateApproveDetailCheck",
		data: {
			"edu603Id":edu603Id
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
			if (backjson.code === 200) {
				var SearchCriteria=new Object();
				SearchCriteria.edu603Id=edu603Id;

				var jsList=new Array();
				var current=$('.historyInfo').find('.historyArea');
				for (var i = 0; i < current.length; i++) {
					jsList.push(current[i].childNodes[0].attributes[3].nodeValue);
				}

				SearchCriteria.jsList=jsList;

				$.hideModal('#approvalDetailsModal',false);
				$.showModal("#changeApprovalDetailsRemindModal",true);
				$("#changeApprovalDetailsRemindModal").find(".remindType").html("审批流程");
				$("#changeApprovalDetailsRemindModal").find(".remindActionType").html("修改");

				$('.confirmRemindcChangeApprovalDetails').unbind('click');
				$('.confirmRemindcChangeApprovalDetails').bind('click', function(e) {
					sendChangeApprovalInfo(SearchCriteria);
					e.stopPropagation();
				});

				$('.specialCanle').unbind('click');
				$('.specialCanle').bind('click', function(e) {
					$.hideModal('#changeApprovalDetailsRemindModal',false);
					$.showModal("#approvalDetailsModal",true);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//发送修改审批节点请求
function sendChangeApprovalInfo(SearchCriteria){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/updateApproveDetail",
		data: {
			"SearchCriteria":JSON.stringify(SearchCriteria)
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
			if (backjson.code === 200) {
				var row=$('#allApproveTable').bootstrapTable('getRowByUniqueId',SearchCriteria.edu603Id);
				row.num=backjson.data.length
				$('#allApproveTable').bootstrapTable('updateByUniqueId', {
					id: SearchCriteria.edu603Id,
					row: row
				});
				toolTipUp(".myTooltip");
				$.hideModal();
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
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
			if (backjson.code === 200) {
				//学年下拉框
				if(backjson.data.allXn!==0){
					var str = '<option value="seleceConfigTip">暂不选择</option>';
					for (var i = 0; i < backjson.data.allXn.length; i++) {
						str += '<option value="' + backjson.data.allXn[i].edu400_ID + '">' + backjson.data.allXn[i].xnmc + '</option>';
					}
					stuffManiaSelect(".xnForSelect", str);
					stuffManiaSelect("#bksjLimit_Xn", str);
				}
				stuffAllXnTable(backjson.data.allXn);
				stuffChangeCrouseRoleTable(backjson.data.allJs);
				stuffAllkjLimitTable(backjson.data.allKssx);
				stuffAllbksjLimitTable(backjson.data.allMUxz);
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
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [{
					field: 'edu400_ID',
					title: 'edu400_ID',
					align: 'center',
					sortable: true,
					visible: false
				}, 
				{
					field: 'xnmc',
					title: '学年名称',
					align: 'left',
					sortable: true,
					formatter: xnmcMatter
				}, 
				{
					field: 'kssj',
					title: '开始时间',
					align: 'left',
					sortable: true,
					formatter: kssjMatter
				}, 
				{
					field: 'jssj',
					title: '结束时间',
					align: 'left',
					sortable: true,
					formatter: jssjMatter
				},{
					field: 'zzs',
					title: '总周数',
					align: 'left',
					sortable: true,
					formatter: zzsMatter
				},{
					field: 'relaseTime',
					title: '课表发布时间',
					align: 'left',
					sortable: true,
					formatter: relaseTimeMatter
				},{
					field: 'lrsj',
					title: '成绩录入截止时间',
					align: 'left',
					sortable: true,
					formatter: lrsjTimeMatter
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

		function relaseTimeMatter(value, row, index) {
			if (typeof(value) === "undefined"||value==null||value==="") {
				return [
					'<div class="myTooltip normalTxt fbsjTxt'+index+'" title="暂未安排">暂未安排</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modifyXn_relaseTime'+index+'" spellcheck="false">'
				]
					.join('');
			}else{
				return [
					'<div class="myTooltip fbsjTxt'+index+'" title="'+row.relaseTime+'">'+row.relaseTime+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modifyXn_relaseTime'+index+'" spellcheck="false">'
				]
					.join('');
			}

		}

		function lrsjTimeMatter(value, row, index) {
			return [
				'<div class="myTooltip lrsjTxt'+index+'" title="'+row.lrsj+'">'+row.lrsj+'</div><input name="" type="text" class="dfinput Mydfinput noneStart" id="modifyXn_lrsjTime'+index+'" spellcheck="false">'
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
	if(typeof(row.relaseTime) !== "undefined"){
		$("#modifyXn_relaseTime"+index).val(row.relaseTime);
	}
	$("#modifyXn_lrsjTime"+index).val(row.lrsj);
	$("#modifyXn_startTime"+index).show();
	$("#modifyXn_endTime"+index).show();
	$("#modifyXn_name"+index).show();
	$("#modifyXn_relaseTime"+index).show();
	$("#modifyXn_lrsjTime"+index).show();
	$(".confrim"+index).show();
	$(".cancel"+index).show();
	$(".modifyXn"+index).hide();
	$(".kssjTxt"+index).hide();
	$(".jssjTxt"+index).hide();
	$(".xnmcTxt"+index).hide();
	$(".fbsjTxt"+index).hide();
	$(".lrsjTxt"+index).hide();
	selfDrawCalenr("#modifyXn_startTime"+index);
	selfDrawCalenr("#modifyXn_endTime"+index);
	selfDrawCalenr("#modifyXn_relaseTime"+index);
	drawCalenr("#modifyXn_lrsjTime"+index,true);
	$("#xnTable td:last-child").addClass("actionChangeLastTD");
}

//取消修改学年
function cancelModifyXn(row,index){
	$("#modifyXn_startTime"+index).hide();
	$("#modifyXn_endTime"+index).hide();
	$("#modifyXn_name"+index).hide();
	$("#modifyXn_relaseTime"+index).hide();
	$("#modifyXn_lrsjTime"+index).hide();
	$(".confrim"+index).hide();
	$(".cancel"+index).hide();
	$(".modifyXn"+index).show();
	$(".kssjTxt"+index).show();
	$(".jssjTxt"+index).show();
	$(".xnmcTxt"+index).show();
	$(".fbsjTxt"+index).show();
	$(".lrsjTxt"+index).show();
	$("#xnTable td:last-child").removeClass("actionChangeLastTD");
}

//确认修改学年
function confrimModifyXn(row,index){
	var modifyXn_name=$("#modifyXn_name"+index).val();
	var modifyXn_startTime=$("#modifyXn_startTime"+index).val();
	var modifyXn_endTime=$("#modifyXn_endTime"+index).val();
	var modifyXn_relaseTime=$("#modifyXn_relaseTime"+index).val();
	var modifyXn_lrsjTime=$("#modifyXn_lrsjTime"+index).val();
	if(modifyXn_name===row.xnmc&&modifyXn_startTime===row.kssj&&modifyXn_endTime===row.jssj&&modifyXn_relaseTime==row.relaseTime&&modifyXn_lrsjTime===row.lrsj){
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

		if(modifyXn_relaseTime!==""){
			if(checkTime(modifyXn_endTime,modifyXn_relaseTime)){
				toastr.warning("课表发布时间必须早于学年结束时间");
				return;
			}
		}

		if(modifyXn_lrsjTime===""){
			toastr.warning('请选择学年成绩录入截止时间');
			return;
		}

		var xnObject=new Object();
		xnObject.edu400_ID=row.edu400_ID;
		xnObject.xnmc=modifyXn_name;
		xnObject.kssj=modifyXn_startTime;
		xnObject.jssj=modifyXn_endTime;
		xnObject.zzs=WeeksBetw(modifyXn_startTime,modifyXn_endTime);
		xnObject.relaseTime=modifyXn_relaseTime;
		xnObject.lrsj=modifyXn_lrsjTime;

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
		url : "/addNewXn",
		dataType : 'json',
		data: {
            "xninfo":JSON.stringify(xnObject),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code === 200) {
				$("#xnTable").bootstrapTable('updateByUniqueId', {
					id: xnObject.edu400_ID,
					row: xnObject
				});
				toolTipUp(".myTooltip");
				toastr.success(backjson.msg);
				$.hideModal("#remindModal");
				
				// //更新学年下拉框
				// var currentAllXn=backjson.currentAllXn;
				// var str = '<option value="seleceConfigTip">暂不选择</option>';
				// for (var i = 0; i < currentAllXn.length; i++) {
				// 	str += '<option value="' + currentAllXn[i].edu400_ID + '">' + currentAllXn[i].xnmc + '</option>';
				// }
				// stuffManiaSelect(".xnForSelect", str);
			} else {
				toastr.warning(backjson.msg);
				$.hideModal("#remindModal");
			}
		}
	});
}

//预备新增学年
function addXn(){
	$('#addXnName,#addXn_startTime,#addXn_endTime,#relaseTime,#gradeStop').val("");
	$("#addXnModal").find(".moadalTitle").html("新增学年");
	$.showModal("#addXnModal",true);
	selfDrawCalenr("#addXn_startTime");
	selfDrawCalenr("#addXn_endTime");
	selfDrawCalenr("#relaseTime");
	selfDrawCalenr();
	drawCalenr("#gradeStop",true);

	//新增学年
	$('.addXn_confimBtn').unbind('click');
	$('.addXn_confimBtn').bind('click', function(e) {
		confimAddXn();
		e.stopPropagation();
	});
}

// 日期选择初始化
function selfDrawCalenr(id) {
	$(id).datetimepicker({
		format : 'yyyy-mm-dd',
		language:'zh-CN',
		initialDate:new Date(),
		weekStart: 1,
		autoclose :true,
		minView :2,
		todayHighlight:true,
		startView:2,
		// endDate:new Date(),
		todayBtn: "linked",
	});
}

//确认新增学年
function confimAddXn(){
	var xnmc=$("#addXnName").val();
	var startTime=$("#addXn_startTime").val();
	var endTime=$("#addXn_endTime").val();
	var relaseTime=$("#relaseTime").val();
	var gradeStop=$("#gradeStop").val();
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

	if(relaseTime!==""){
		if(checkTime(endTime,relaseTime)){
			toastr.warning("课表发布时间必须早于学年结束时间");
			return;
		}
	}

	if(gradeStop===""){
		toastr.warning('成绩录入截止时间不能为空');
		return;
	}

	var xnObject=new Object();
	xnObject.xnmc=xnmc;
	xnObject.kssj=startTime;
	xnObject.jssj=endTime;
	xnObject.zzs=WeeksBetw(startTime,endTime);
	xnObject.relaseTime=relaseTime;
	xnObject.lrsj=gradeStop;
	sendNewXnInfo(xnObject);
}

//发送新增学年请求
function sendNewXnInfo(xnObject){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewXn",
		dataType : 'json',
		data: {
            "xninfo":JSON.stringify(xnObject),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code === 200) {
				xnObject.edu400_ID=backjson.data;
				$('#xnTable').bootstrapTable("prepend", xnObject);
				$.hideModal("#addXnModal");
				toolTipUp(".myTooltip");
				//更新学年下拉框
				// var currentAllXn=backjson.currentAllXn;
				// var str = '<option value="seleceConfigTip">请选择</option>';
				// for (var i = 0; i < currentAllXn.length; i++) {
				// 	str += '<option value="' + currentAllXn[i].edu400_ID + '">' + currentAllXn[i].xnmc + '</option>';
				// }
				// stuffManiaSelect(".xnForSelect", str);
			} else {
				toastr.warning(backjson.msg);
				$.hideModal("#addXnModal");
			}
		}
	});
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

//填充调课角色表
function stuffChangeCrouseRoleTable(tableInfo){
	window.releaseNewsEvents = {
		'click #modifyChangeCrouseRole': function(e, value, row, index) {
			modifyChangeCrouseRole(row,index);
		}
	};

	$('#changeCrouseRoleTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
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
			drawPagination(".changeCrouseRoleTableArea", "调课角色");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [{
			field: 'edu402_ID',
			title: 'edu402_ID',
			align: 'center',
			sortable: true,
			visible: false
		},{
			field: '角色id',
			title: 'jsid',
			align: 'center',
			sortable: true,
			visible: false
		},
			{
				field: 'jsmc',
				title: '角色名称',
				align: 'left',
				sortable: true
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
			'<li id="modifyChangeCrouseRole" class="modifyBtn modifyXn'+index+'"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
			'</ul>'
		]
			.join('');
	}

	drawSearchInput(".changeCrouseRoleTableArea");
	drawPagination(".changeCrouseRoleTableArea", "调课角色");
	toolTipUp(".myTooltip");
	btnControl();
}

//获取所有角色
function stuffAllRole(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRole",
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
			if (backjson.code === 200 && backjson.data.allRole.length!=0) {
				var allRole=backjson.data.allRole;
				var str = '<option value="seleceConfigTip">暂不选择</option>';
				for (var i = 0; i <allRole.length; i++) {
					str += '<option value="' + allRole[i].bf991_ID + '">' + allRole[i].js + '</option>';
				}
				stuffManiaSelect("#ChangeCrouseRole_allRole", str);
				$.showModal("#addChangeCrouseRoleModal",true);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备添加调课角色
function wantAddChangeCrouseRole(){
	var cruentRole=$("#changeCrouseRoleTable").bootstrapTable("getData");
	if(cruentRole.length>0){
		toastr.warning('角色已存在');
		return;
	}
	stuffAllRole();
	//确认角色
	$('.confimaddChangeCrouseRole').unbind('click');
	$('.confimaddChangeCrouseRole').bind('click', function(e) {
		confimaddChangeCrouseRole(false);
		e.stopPropagation();
	});
}

//修改调课角色
function modifyChangeCrouseRole(row,index){
	stuffAllRole();

	//修改角色
	$('.confimaddChangeCrouseRole').unbind('click');
	$('.confimaddChangeCrouseRole').bind('click', function(e) {
		confimaddChangeCrouseRole(true,row);
		e.stopPropagation();
	});
}

//确认调课角色
function confimaddChangeCrouseRole(isModify,oldRoleInfo){
	var choosendRole=getNormalSelectValue("ChangeCrouseRole_allRole");
	if(choosendRole===""){
		toastr.warning('请选择角色');
		return;
	}
	var choosendRoleText=getNormalSelectText("ChangeCrouseRole_allRole");
	var sendObject=new Object();
	if(isModify){
		sendObject.jsid=choosendRole;
		sendObject.jsmc=choosendRoleText;
		sendObject.edu402_ID=oldRoleInfo.edu402_ID;
		sendChangeRoleInfo(sendObject,isModify,oldRoleInfo);
	}else{
		sendObject.jsid=choosendRole;
		sendObject.jsmc=choosendRoleText;
		sendChangeRoleInfo(sendObject,isModify);
	}
}

//发送角色信息
function sendChangeRoleInfo(roleInfo,isModify,oldRoleInfo){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addChangeCrouseRole",
		dataType : 'json',
		data: {
			"newUserInfo":JSON.stringify(roleInfo)
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
			if (backjson.code === 200) {
				if(isModify){
					$("#changeCrouseRoleTable").bootstrapTable("updateByUniqueId", {id: oldRoleInfo.edu402_ID, row: backjson.data});
				}else{
					$('#changeCrouseRoleTable').bootstrapTable("prepend", backjson.data);
				}
				toastr.success('操作成功');
				$.hideModal("#addChangeCrouseRoleModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充课节限制表
function stuffAllkjLimitTable(allKssxInfo){
	window.releaseNewsEvents = {
		'click #modifyLimit': function(e, value, row, index) {
			modifyLimit(row);
		},
		'click #removeAllLimit': function(e, value, row, index) {
			removeAllLimit(row);
		}
	};

	$('#kjLimitTable').bootstrapTable('destroy').bootstrapTable({
		data: allKssxInfo,
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
			drawPagination(".kjLimitTableArea", "排课节数限制");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [{
				field: '学年id',
				title: 'xnid',
				align: 'center',
				sortable: true,
				visible: false
			},
			{
				field: 'xn',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},
			{
				field: 'pkjsxz',
				title: '排课节数限制概览',
				align: 'left',
				sortable: true,
				formatter: pkjsxzMatter
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
			'<li class="modifyBtn" id="modifyLimit"><span><img src="images/t02.png" style="width:24px"></span>编辑/查看</li>' +
			'<li class="deleteBtn" id="removeAllLimit"><span><img src="images/t03.png"></span>删除</li>' +
			'</ul>'
		]
			.join('');
	}

	function pkjsxzMatter(value, row, index) {
		return [ '<div class="myTooltip normalTxt" title="共计:'+value.length+'条排课节数限制">共计:'+value.length+'条排课节数限制</div>' ]
			.join('');
	}

	drawSearchInput(".kjLimitTableArea");
	drawPagination(".kjLimitTableArea", "排课节数限制");
	toolTipUp(".myTooltip");
	btnControl();
}

//预备新增课节限制
function addkjLimit(){
	var currentAllXn=$("#xnTable").bootstrapTable("getData");
	if(currentAllXn.length==0){
		toastr.warning('请先添加学年');
		return;
	}

	$("#addkjLimitModal").find(".moreInfoSelectStyle,.tools,.comtitle").show();
	$("#addkjLimitModal").find('.comtitle').find("img").removeClass('comtitleOpen');
	$("#addkjLimitModal").find(".moadalTitle").html("新增排课节数限制");
	reStuffAddedLimitArea();
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < currentAllXn.length; i++) {
		str += '<option value="' + currentAllXn[i].edu400_ID + '">' + currentAllXn[i].xnmc + '</option>';
	}
	stuffManiaSelect("#addkjLimit_xn", str);
	//绑定继续添加事件
	$('#addThiskjLimit').unbind('click');
	$('#addThiskjLimit').bind('click', function(e) {
		addThiskjLimit(true);
		e.stopPropagation();
	});

	//学年change事件
	$("#addkjLimit_xn").change(function() {
		$(".addedLimitArea").empty();
		stuffWeeksByXn();
	});

	//小箭头事件绑定
	$('.displayAddedLimitArea').unbind('click');
	$('.displayAddedLimitArea').bind('click', function(e) {
		displayAddedLimitArea();
		e.stopPropagation();
	});

	//小箭头事件绑定
	$('.addkjLimit_confimBtn').unbind('click');
	$('.addkjLimit_confimBtn').bind('click', function(e) {
		confimAddkjLimit();
		e.stopPropagation();
	});

	$.showModal("#addkjLimitModal",true);
}

//根据学年填充开始结束周
function stuffWeeksByXn(){
	var currentXn=getNormalSelectValue("addkjLimit_xn");
	var str ='';
	if(currentXn!==''){
		//填充学年对应的开始结束周
		var weekNum=$("#xnTable").bootstrapTable("getRowByUniqueId", currentXn).zzs;
		str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < weekNum; i++) {
			str += '<option value="' + (i+1) + '">第' + (i+1) + '周</option>';
		}

		//填充已存在的限制至业面
		var thisYearLimit=$("#kjLimitTable").bootstrapTable("getData");
		for (var i = 0; i < thisYearLimit.length; i++) {
			if(currentXn===thisYearLimit[i].xnid){
				var pkjsxz=thisYearLimit[i].pkjsxz;
				for (var j = 0; j < pkjsxz.length; j++) {
					stuffThiskjLimit(pkjsxz[j].xn,pkjsxz[j].xnid,pkjsxz[j].ksz,pkjsxz[j].jsz,pkjsxz[j].kssx,false,pkjsxz[j].edu403_ID);
				}
			}
		}
		$("#addkjLimitModal").find('.comtitle').find("h2:eq(1)").show().find("cite").html($(".addedSingleLimit").length);
	}else{
		str = '<option value="seleceConfigTip">暂无选择</option>';
	}

	stuffManiaSelect("#addkjLimit_satrtWeek", str);
	stuffManiaSelect("#addkjLimit_endWeek", str);
}

//继续添加
function addThiskjLimit(needEmptySelect){
	var thisXn=getNormalSelectValue("addkjLimit_xn");
	var thisStartWeek=getNormalSelectValue("addkjLimit_satrtWeek");
	var thisEndWeek=getNormalSelectValue("addkjLimit_endWeek");
	var thisNum=parseInt($("#addkjLimit_num").val());

	var rs=checkThiskjLimit(thisXn,thisStartWeek,thisEndWeek,thisNum);
	if(!rs){
		return false;
	}

	if(needEmptySelect){
		stuffThiskjLimit(getNormalSelectText("addkjLimit_xn"),thisXn,thisStartWeek,thisEndWeek,thisNum,true,null);
		var reObject = new Object();
		reObject.normalSelectIds = "#addkjLimit_satrtWeek,#addkjLimit_endWeek";
		reReloadSearchsWithSelect(reObject);
		$("#addkjLimit_num").val(0);
	}
}

//验证当前添加的限制是否能通过验证
function checkThiskjLimit(thisXn,thisStartWeek,thisEndWeek,thisNum){
	var rs=true;
	if(thisXn===''){
		toastr.warning('请选择学年');
		rs= false;
		return rs;
	}

	if(thisStartWeek===''){
		toastr.warning('请选择开始周');
		rs= false;
		return rs;
	}

	if(thisEndWeek===''){
		toastr.warning('请选择结束周');
		rs= false;
		return rs;
	}

	if(thisNum==0){
		toastr.warning('请设置最大课节数限制');
		rs= false;
		return rs;
	}

	if(parseInt(thisEndWeek)<parseInt(thisStartWeek)){
		toastr.warning('结束周不能小于开始周');
		rs= false;
		return rs;
	}
	var chosendLimit=$(".addedSingleLimit");
	var xnIsSame;
	for (var i = 0; i < chosendLimit.length; i++) {
			if(thisXn===chosendLimit[i].attributes[2].nodeValue){
				xnIsSame=true;
			}else{
				xnIsSame=false;
				break;
			}

			var banNum_year=chosendLimit[i].attributes[2].nodeValue;
			var banNum_satrt=parseInt(chosendLimit[i].attributes[3].nodeValue);
			var banNum_end=parseInt(chosendLimit[i].attributes[4].nodeValue);

			//限制相同
			if(banNum_year===thisXn&&banNum_satrt==parseInt(thisStartWeek)&&banNum_end==parseInt(thisEndWeek)){
				toastr.warning('限制周期已添加');
				rs= false;
				return rs;
			}

			//是否被包含
			if(!(banNum_end<thisStartWeek || banNum_satrt>thisEndWeek)){
				toastr.warning('限制周期已包含');
				rs= false;
				return rs;
			}
	}

	return rs;
}

//填充当前添加的限制
function stuffThiskjLimit(thisXnName,thisXn,thisStartWeek,thisEndWeek,thisNum,isNewAdded,edu403_ID){
	var classNAME;
	var str
	isNewAdded?classNAME='isNew':classNAME='isOld';
	if(isNewAdded){
		str='<div class="addedSingleLimit '+classNAME+'" id="xn'+thisXn+'s'+thisStartWeek+'e'+thisEndWeek+'"  xn="'+thisXn+'" s_week="'+thisStartWeek+'" e_week="'+thisEndWeek+'" num="'+thisNum+'" xnName="'+thisXnName+'" edu403_ID="'+edu403_ID+'">' +
			'新增加限制 学年:'+thisXnName+' 第'+thisStartWeek+'周-第'+thisEndWeek+'周 最大排课节数限制：'+thisNum+'节' +
			'<img class="choosendKjImg" removeid="xn'+thisXn+'s'+thisStartWeek+'e'+thisEndWeek+'" src="images/close1.png"/>' +
			'</div>';
	}else{
		str='<div class="addedSingleLimit '+classNAME+'" id="xn'+thisXn+'s'+thisStartWeek+'e'+thisEndWeek+'"  xn="'+thisXn+'" s_week="'+thisStartWeek+'" e_week="'+thisEndWeek+'" num="'+thisNum+'" xnName="'+thisXnName+'" edu403_ID="'+edu403_ID+'">' +
			'已存在限制 学年:'+thisXnName+' 第'+thisStartWeek+'周-第'+thisEndWeek+'周 最大排课节数限制：'+thisNum+'节' +
			'</div>'
	}

	$(".addedLimitArea").append(str);

	$("#addkjLimitModal").find('.comtitle').find("img").addClass('comtitleOpen');
	$("#addkjLimitModal").find('.comtitle').find("h2:eq(0)").hide();
	$("#addkjLimitModal").find('.comtitle').find("h2:eq(1)").show().find("cite").html($(".addedSingleLimit").length);
	//小箭头事件绑定
	$('.addedSingleLimit').find('.choosendKjImg').unbind('click');
	$('.addedSingleLimit').find('.choosendKjImg').bind('click', function(e) {
		removeSingleLimit(e.currentTarget.attributes[1].nodeValue);
		e.stopPropagation();
	});
}

//删除当前添加的限制
function removeSingleLimit(id){
	var currentStuffNum=parseInt($("#addkjLimitModal").find('.comtitle').find("h2:eq(1)").find("cite")[0].innerText);
	$("#addkjLimitModal").find('.comtitle').find("h2:eq(1)").show().find("cite").html(currentStuffNum-1);
	$('#'+id).remove();
	if($(".addedSingleLimit").length<=0){
		$("#addkjLimitModal").find('.comtitle').find("h2:eq(0)").show();
		$("#addkjLimitModal").find('.comtitle').find("h2:eq(1)").hide();
	}
}

//小箭头事件
function displayAddedLimitArea(){
	if($(".addedSingleLimit").length<=0){
		return;
	}

	if($("#addkjLimitModal").find('.comtitle').find("img")[0].classList.length>1){
		$("#addkjLimitModal").find('.comtitle').find("img").removeClass('comtitleOpen');
	}else{
		$("#addkjLimitModal").find('.comtitle').find("img").addClass('comtitleOpen');
	}

	$(".addedLimitArea").toggle();
}

//重置已选区域
function reStuffAddedLimitArea(){
	var reObject = new Object();
	reObject.normalSelectIds = "#addkjLimit_xn,#addkjLimit_satrtWeek,#addkjLimit_endWeek";
	reReloadSearchsWithSelect(reObject);
	$("#addkjLimit_num").val(0);

	$("#addkjLimitModal").find('.comtitle').find("h2:eq(0)").show();
	$("#addkjLimitModal").find('.comtitle').find("h2:eq(1)").hide();
	$(".addedLimitArea").empty();
}

//确认添加限制
function confimAddkjLimit(){
	var addedinfo=$(".isNew");
	if(addedinfo.length===0){
		toastr.warning('暂未添加任何限制');
		return;
	}

	var newInfo=new Array();
	for (var i = 0; i <addedinfo.length ; i++) {
		var newInfoObject=new Object();
		newInfoObject.xnid=addedinfo[i].attributes[2].nodeValue;
		newInfoObject.ksz=addedinfo[i].attributes[3].nodeValue;
		newInfoObject.jsz=addedinfo[i].attributes[4].nodeValue;
		newInfoObject.kssx=addedinfo[i].attributes[5].nodeValue;
		newInfoObject.xn=addedinfo[i].attributes[6].nodeValue;
		newInfo.push(newInfoObject);
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewKssx",
		data: {
			"kssxinfo":JSON.stringify(newInfo),
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
				stuffAllkjLimitTable(backjson.data);
				toastr.success(backjson.msg);
				$.hideModal("#addkjLimitModal");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//删除整个学年限制
function removeAllLimit(row){
	$.showModal("#remindModal",true);
	$(".remindType").html('已选学年的所有排课节数限制');
	$(".remindActionType").html("删除");
	var deleteIds=new Array();
	deleteIds.push(row.xnid);
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendRemoveAllLimit(deleteIds);
		e.stopPropagation();
	});
}

//发送删除整个学年限制的请求
function sendRemoveAllLimit(deleteIds){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/deleteKssxByXn",
		data: {
			"deleteIds":JSON.stringify(deleteIds),
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
				for (var i = 0; i < deleteIds.length; i++) {
					$("#kjLimitTable").bootstrapTable('removeByUniqueId',deleteIds[i]);
				}
				toastr.success(backjson.msg);
				$.hideModal();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//逐条编辑限制
function modifyLimit(row){
	$(".addedLimitArea").empty();
	$("#addkjLimitModal").find(".moreInfoSelectStyle,.tools,.comtitle").hide();
	$("#addkjLimitModal").find(".moadalTitle").html("编辑/查看排课节数限制");

	//填充已存在的限制至业面
	var thisYearLimit=$("#kjLimitTable").bootstrapTable("getData");
	for (var i = 0; i < thisYearLimit.length; i++) {
		if(row.xnid===thisYearLimit[i].xnid){
			var pkjsxz=thisYearLimit[i].pkjsxz;
			for (var j = 0; j < pkjsxz.length; j++) {
				stuffThiskjLimit(pkjsxz[j].xn,pkjsxz[j].xnid,pkjsxz[j].ksz,pkjsxz[j].jsz,pkjsxz[j].kssx,true,pkjsxz[j].edu403_ID);
			}
		}
	}

	//单挑删除限制
	$('.addedSingleLimit').find('.choosendKjImg').unbind('click');
	$('.addedSingleLimit').find('.choosendKjImg').bind('click', function(e) {
		wantRemoveSingleLimit(e);
		e.stopPropagation();
	});
	$.showModal("#addkjLimitModal",false);
}

//逐条删除限制
function wantRemoveSingleLimit(eve){
	if($(".addedSingleLimit").length<2){
		toastr.warning('单个删除至少保留一条限制');
		return;
	}

	$.hideModal('#addkjLimitModal',false);
	$.showModal("#remindModal",true);
	$(".remindType").html('该排课节数限制');
	$(".remindActionType").html("删除");


	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendRemoveSingleLimit(eve);
		e.stopPropagation();
	});
}

//发送单个删除限制的请求
function sendRemoveSingleLimit(eve){
	var deleteIds=new Array();
	deleteIds.push(eve.currentTarget.parentElement.attributes[7].nodeValue);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/deleteKssxById",
		data: {
			"deleteIds":JSON.stringify(deleteIds),
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
				$('#'+eve.currentTarget.parentElement.attributes[1].nodeValue).remove();
				toastr.success(backjson.msg);
				$.hideModal('#remindModal',false);
				$.showModal("#addkjLimitModal",false);
				updateLimitTable(eve);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//刷新限制表
function updateLimitTable(eve){
	var all= $("#kjLimitTable").bootstrapTable("getData");
	var thisXn=eve.currentTarget.parentElement.attributes[2].nodeValue;
	for (var i = 0; i < all.length; i++) {
		if(thisXn===all[i].xnid){
			var pkjsxz=all[i].pkjsxz;
			for (var j = 0; j < pkjsxz.length; j++) {
				if(eve.currentTarget.parentElement.attributes[7].nodeValue===pkjsxz[j].edu403_ID.toString()){
					pkjsxz.splice(i,1);
				}
			}
			$("#kjLimitTable").bootstrapTable('updateByUniqueId', {
				xnid: thisXn,
				row: all[i]
			});
		}
	}
}

//渲染全部补考限制表
function stuffAllbksjLimitTable(allMUxz){
	window.releaseNewsEvents = {
		'click #closeLimit': function(e, value, row, index) {
			closeLimit(row);
		},
		'click #startNextLimit': function(e, value, row, index) {
			startNextLimit(row);
		}
	};

	$('#bksjLimitTable').bootstrapTable('destroy').bootstrapTable({
		data: allMUxz,
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
			drawPagination(".bksjLimitTableArea", "补考成绩录入时间限制");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
			field: 'edu404_ID',
			title: '唯一ID',
			align: 'center',
			sortable: true,
			visible: false
			},
			{
				field: 'xnmc',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},
			{
				field: 'count',
				title: '补考次数',
				align: 'left',
				sortable: true,
				formatter: countMatter
			},{
				field: 'startDateRange',
				title: '开始时间',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'endDateRange',
				title: '结束时间',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'status',
				title: '状态',
				align: 'left',
				sortable: true,
				formatter: statusMatter
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
			'<li class="modifyBtn" id="closeLimit"><span><img src="images/t03.png" style="width:24px"></span>关闭限制</li>' +
			'<li class="deleteBtn" id="startNextLimit"><span><img src="img/right.png" style="width:24px"></span>开启下一次限制</li>' +
			'</ul>'
		]
			.join('');
	}

	function countMatter(value, row, index) {
		return [ '<div class="myTooltip" title="第'+value+'次补考">第'+value+'次补考</div>' ]
			.join('');
	}

	function statusMatter(value, row, index) {
		var str='';
		if(value==0||value==='0'){
			str='开启';
			return [ '<div class="myTooltip greenTxt" title="'+str+'">'+str+'</div>' ]
				.join('');
		}else{
			str='关闭';
			return [ '<div class="myTooltip redTxt" title="'+str+'">'+str+'</div>' ]
				.join('');
		}
	}

	drawSearchInput(".bksjLimitTableArea");
	drawPagination(".bksjLimitTableArea", "补考成绩录入时间限制");
	toolTipUp(".myTooltip");
	btnControl();
}

//新增补考限制
function addBksjLimit(){
	var reObject = new Object();
	// reObject.normalSelectIds = "#bksjLimit_Xn,#bksjLimit_timeCount";
	reObject.normalSelectIds = "#bksjLimit_Xn";
	reObject.InputIds = "#bksjLimit_StartDate,#bksjLimit_EndDate";
	reReloadSearchsWithSelect(reObject);
	$("#bksjLimitModal").find('.searchArea').find('.col1:eq(0)').show();
	$.showModal('#bksjLimitModal',true);
	drawCalenrRange("#bksjLimit_StartDate","#bksjLimit_EndDate");
	//确认新增补考限制
	$('.confirmAddBksjLimit').unbind('click');
	$('.confirmAddBksjLimit').bind('click', function(e) {
		confirmAddBksjLimit();
		e.stopPropagation();
	});
}

//确认新增补考限制
function confirmAddBksjLimit(){
	var currentBksjLimit= $('#bksjLimitTable').bootstrapTable("getData");
	var xn=getNormalSelectValue('bksjLimit_Xn');
	var bksjLimitStartDate=$('#bksjLimit_StartDate').val();
	var bksjLimitEndDate=$('#bksjLimit_EndDate').val();
	// var timeCount=getNormalSelectValue('bksjLimit_timeCount');
	if(xn===''){
		toastr.warning('学年不能为空');
		return;
	}

	if(bksjLimitStartDate===''){
		toastr.warning('开始时间不能为空');
		return;
	}

	if(bksjLimitEndDate===''){
		toastr.warning('结束时间不能为空');
		return;
	}

	for (let i = 0; i < currentBksjLimit.length; i++) {
		if(currentBksjLimit[i].xnid===xn){
			toastr.warning(currentBksjLimit[i].xnmc+'已存在补考限制');
			return;
		}
	}

	// if(timeCount===''){
	// 	toastr.warning('补考次数不能为空');
	// 	return;
	// }
	var sendObject=new Object();
	sendObject.xnid=xn;
	sendObject.xnmc=getNormalSelectText('bksjLimit_Xn');
	sendObject.count=1;
	sendObject.status=0;
	sendObject.startDateRange=bksjLimitStartDate;
	sendObject.endDateRange=bksjLimitEndDate;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewMUTime",
		dataType : 'json',
		data: {
			"muTimeinfo":JSON.stringify(sendObject),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code === 200) {
				$('#bksjLimitTable').bootstrapTable("prepend", backjson.data);
				toastr.success('操作成功');
				$.hideModal("#bksjLimitModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//关闭补考限制
function closeLimit(row){
	if((row.status==1||row.status==='1')&&(row.count==5||row.count==='5')){
		toastr.warning('第'+row.count+'次补考录入时间限制已关闭');
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html(row.xnmc+"的补考成绩录入时间限制");
	$(".remindActionType").html("关闭");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendCloseLimitInfo(row);
		e.stopPropagation();
	});
}

//发送补考限制信息
function sendCloseLimitInfo(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/endNewMUTime",
		dataType : 'json',
		data: {
			"edu404Id":row.edu404_ID,
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code === 200) {
				row.status=1;
				$('#bksjLimitTable').bootstrapTable('updateByUniqueId', {
					id: row.edu404_ID,
					row: row
				});
				toastr.success('操作成功');
				$.hideModal();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//开启下一次限制
function startNextLimit(row){
	if(row.status==0||row.status==='0'){
		toastr.warning('请先关闭上一次补考成绩录入时间限制');
		return;
	}

	if(row.count==5||row.count==='5'){
		toastr.warning('一个学年最多操作5次补考成绩录入时间限制');
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html(row.xnmc+"的第"+(parseInt(row.count)+1)+"次补考成绩录入时间限制");
	$(".remindActionType").html("开启");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendStartNextLimitInfo(row);
		e.stopPropagation();
	});
}

//预备发送开启下一次限制信息
function sendStartNextLimitInfo(row){
	var reObject = new Object();
	// reObject.normalSelectIds = "#bksjLimit_Xn,#bksjLimit_timeCount";
	reObject.normalSelectIds = "#bksjLimit_Xn";
	reObject.InputIds = "#bksjLimit_StartDate,#bksjLimit_EndDate";
	reReloadSearchsWithSelect(reObject);
	$("#bksjLimitModal").find('.searchArea').find('.col1:eq(0)').hide();
	$.showModal('#bksjLimitModal',true);
	$.hideModal('#remindModal',false);
	drawCalenrRange("#bksjLimit_StartDate","#bksjLimit_EndDate");
	//确认新增补考限制
	$('.confirmAddBksjLimit').unbind('click');
	$('.confirmAddBksjLimit').bind('click', function(e) {
		confirmAddNextBksjLimit(row);
		e.stopPropagation();
	});
}

//确认发送开启下一次限制信息
function confirmAddNextBksjLimit(row){
	var bksjLimitStartDate=$('#bksjLimit_StartDate').val();
	var bksjLimitEndDate=$('#bksjLimit_EndDate').val();

	if(bksjLimitStartDate===''){
		toastr.warning('开始时间不能为空');
		return;
	}

	if(bksjLimitEndDate===''){
		toastr.warning('结束时间不能为空');
		return;
	}
	row.startDateRange=bksjLimitStartDate;
	row.endDateRange=bksjLimitEndDate;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/startNewMUTime",
		dataType : 'json',
		data: {
			"muTimeinfo":JSON.stringify(row),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code === 200) {
				row.status=0;
				row.count=parseInt(row.count)+1;
				$('#bksjLimitTable').bootstrapTable('updateByUniqueId', {
					id: row.edu404_ID,
					row: row
				});
				toastr.success('操作成功');
				$.hideModal();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// tab2按钮事件绑定
function tab2BtnBind(){
	//新增学年
	$('#addXn').unbind('click');
	$('#addXn').bind('click', function(e) {
		addXn();
		e.stopPropagation();
	});
	
	//新增调课角色
	$('#addChangeCrouseRole').unbind('click');
	$('#addChangeCrouseRole').bind('click', function(e) {
		wantAddChangeCrouseRole();
		e.stopPropagation();
	});

	//新增排课节数限制
	$('#addkjLimit').unbind('click');
	$('#addkjLimit').bind('click', function(e) {
		addkjLimit();
		e.stopPropagation();
	});

	//新增补考限制
	$('#addBksjLimit').unbind('click');
	$('#addBksjLimit').bind('click', function(e) {
		addBksjLimit();
		e.stopPropagation();
	});
}
/**
 * tab2 end
 * */





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

	//新增二级学院
	$('#addNewDepartment').unbind('click');
	$('#addNewDepartment').bind('click', function(e) {
		addNewDepartment();
		e.stopPropagation();
	});
	
	//批量删除二级学院
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



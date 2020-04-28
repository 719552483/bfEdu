var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getMajorAdministrationClassSelectInfo();
	drawAdministrationClassEmptyTable();
	btnBind();
	$("input[type='number']").inputSpinner();
});
/*
 * tab1
 */
//获取-行政班管理- 有逻辑关系select信息
function getMajorAdministrationClassSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryCulturePlanAdministrationClasses",
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
				if (backjson.result) {
					hideloding();
					dropConfigOption("#major");
					if(backjson.classesInfo.length===0){
						toastr.info('暂无行政班');
					}
					stuffAdministrationClassTable(backjson.classesInfo);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

//填充空行政班表
function drawAdministrationClassEmptyTable(){
	stuffAdministrationClassTable({});
}

//填充行政班表
function stuffAdministrationClassTable(tableInfo){
	window.releaseNewsEvents = {
			'click #removeAdministrationClass' : function(e, value, row, index) {
				removeAdministrationClass(row);
			},
			'click #administrationClassInfo' : function(e, value, row, index) {
				administrationClassInfo(row);
			},
			'click #modifyAdministrationClass' : function(e, value, row, index) {
				modifyAdministrationClass(row);
			}
		};

		$('#administrationClassTable').bootstrapTable('destroy').bootstrapTable({
			data : tableInfo,
			pagination : true,
			pageNumber : 1,
			pageSize : 10,
			pageList : [ 10 ],
			showToggle : false,
			showFooter : false,
			clickToSelect : true,
			search : true,
			editable : false,
			striped : true,
			toolbar : '#toolbar',
			showColumns : true,
			onPageChange : function() {
				drawPagination(".administrationClassTableArea", "行政班信息");
			},
			columns : [ {
				field : 'edu300_ID',
				title : 'edu300_ID',
				align : 'center',
				visible : false
			}, {
				field : 'check',
				checkbox : true
			}, {
				field : 'pyccmc',
				title : '培养层次',
				align : 'left',
				formatter :paramsMatter
			}, {
				field : 'xbmc',
				title : '所属系部',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'njmc',
				title : '年级',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'zymc',
				title : '专业',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'xzbmc',
				title : '行政班名称',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'xzbbm',
				title : '行政班编码',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'xqmc',
				title : '校区',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'zxrs',
				title : '在校人数',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'rnrs',
				title : '容纳人数',
				align : 'left',
				formatter : rnrsMatter
			},{
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
					+ '<li id="administrationClassInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
					+ '<li id="modifyAdministrationClass"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
					+ '<li id="removeAdministrationClass"><span><img src="images/t03.png"></span>删除</li>'
					+ '</ul>' ].join('');
		}
		
		function rnrsMatter(value, row, index) {
			if(row.rnrs===0){
				return [ '<div class="myTooltip" title="暂未定额">暂未定额</div>' ].join('');
			}else{
				return [ '<div class="myTooltip" title="'+row.rnrs+'">'+row.rnrs+'人</div>' ].join('');
			}
		}
		

		drawPagination(".administrationClassTableArea", "行政班信息");
		drawSearchInput();
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
		changeColumnsStyle(".administrationClassTableArea", "行政班信息");
}

//查看行政班详情
function administrationClassInfo(row){
	$(".addAdministrationClassTipTitle").html(row.pyccmc+'/'+row.xbmc+'/'+row.njmc+'/'+row.zymc+"-"+row.xzbmc);
	$(".addAdministrationClassTip").show();
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$(".myabeNoneTipBtn").hide();
	$(".addAdministrationClassTip").find(".canNotModifythings").remove();
	showMaskingElement();
	stuffAdministrationClassDetails(row);
}

//填充行政班详情
function stuffAdministrationClassDetails(row){
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_campus",row.xqbm,row.xqmc);  //校区
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_level",row.pyccbm,row.pyccmc); //层次
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_department",row.xbbm,row.xbmc); //系部
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_garde",row.njbm,row.njmc); //年级
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_major",row.zybm,row.zymc); //专业
	$("#addAdministrationClass_classCode").val(row.xzbbm);
	$("#addAdministrationClass_className").val(row.xzbmc);
	$("#addAdministrationClass_houldNum").val(row.rnrs);
}

//预备修改行政班
function modifyAdministrationClass(row){
	if(row.sfsckkjh==="T"){
		toastr.warning('不能修改已生成开课计划的班级');
		return;
	}
	$(".addAdministrationClassTipTitle").html(row.pyccmc+'/'+row.xbmc+'/'+row.njmc+'/'+row.zymc+"-"+row.xzbmc);
	$(".addAdministrationClassTip").show();
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	$(".myabeNoneTipBtn,.canNotModifythings").show();
	$(".addAdministrationClassTip").find("label:lt(5)").after('<samll class="canNotModifythings"><br />(不可改)</samll>');
	showMaskingElement();
	stuffAdministrationClassDetails(row);
	//确认修改行政班
	$('.confirmAddAdministrationClass').unbind('click');
	$('.confirmAddAdministrationClass').bind('click', function(e) {
		confirmModifyAdministrationClass(row);
		e.stopPropagation();
	});
}

//确认修改行政班
function confirmModifyAdministrationClass(row){
	var newAdministrationClassObject=getAdministrationClassDetails();
	newAdministrationClassObject.edu300_ID=row.edu300_ID;
	newAdministrationClassObject.yxbz=row.yxbz;
	if(typeof newAdministrationClassObject ==='undefined'){
		return;
	}
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyAdministrationClass",
		data: {
             "modifyInfo":JSON.stringify(newAdministrationClassObject),
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
			if (backjson.result) {
				if(backjson.namehave){
					toastr.warning('班级名称已存在');
					return;
				}
				if(backjson.codehave){
					toastr.warning('班级编码已存在');
					return;
				}
				hideloding();
				$("#administrationClassTable").bootstrapTable('updateByUniqueId', {
					id: row.edu300_ID,
					row: newAdministrationClassObject
				});
				$(".addAdministrationClassTip").hide();
				showMaskingElement();
				toolTipUp(".myTooltip");
				drawPagination(".administrationClassTableArea", "行政班信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备添加行政班
function wantAddAdministrationClass(){
	$(".addAdministrationClassTip").find(".canNotModifythings").remove();
	$(".addAdministrationClassTip").show();
	emptyAdministrationClassDetailsArea();
	$(".addAdministrationClassTipTitle").html("新增行政班");
	$(".myabeNoneTipBtn").show();
	$(".canNotModifythings").hide();
	showMaskingElement();
	//确认新增行政班
	$('.confirmAddAdministrationClass').unbind('click');
	$('.confirmAddAdministrationClass').bind('click', function(e) {
		confirmAddAdministrationClass();
		e.stopPropagation();
	});
}

//确认新增行政班
function confirmAddAdministrationClass(){
	var newAdministrationClassObject=getAdministrationClassDetails();
	if(typeof newAdministrationClassObject ==='undefined'){
		return;
	}
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addAdministrationClass",
		data: {
             "addInfo":JSON.stringify(newAdministrationClassObject) 
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
				if(backjson.namehave){
					toastr.warning('班级名称已存在');
					return;
				}
				if(backjson.codehave){
					toastr.warning('班级编码已存在');
					return;
				}
				hideloding();
				newAdministrationClassObject.edu300_ID=backjson.id;
				newAdministrationClassObject.yxbz=backjson.yxbz;
				newAdministrationClassObject.sfsckkjh=backjson.sfsckkjh;
				$('#administrationClassTable').bootstrapTable("prepend", newAdministrationClassObject);
				$(".addAdministrationClassTip").hide();
				showMaskingElement();
				toolTipUp(".myTooltip");
				drawPagination(".administrationClassTableArea", "行政班信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取新增行政班信息
function getAdministrationClassDetails(){
	if(getNormalSelectValue("addAdministrationClass_campus") === ""){
		toastr.warning('校区不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_level") === ""){
		toastr.warning('层次不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_department") === ""){
		toastr.warning('系部不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_garde") === ""){
		toastr.warning('年级不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_major") === ""){
		toastr.warning('专业不能为空');
		return;
	}
	if($("#addAdministrationClass_className").val() === ""){
		toastr.warning('班级名称不能为空');
		return;
	}
	if ($("#addAdministrationClass_houldNum").val()!==""&&isNaN($("#addAdministrationClass_houldNum").val())) {
		toastr.warning('容纳人数只接受数字参数');
		return;
	}
	
	var newClassObject=new Object();
	newClassObject.xzbmc=$("#addAdministrationClass_className").val();
	newClassObject.xzbbm=$("#addAdministrationClass_classCode").val();
	newClassObject.pyccmc=getNormalSelectText("addAdministrationClass_level");
	newClassObject.pyccbm=getNormalSelectValue("addAdministrationClass_level");
	newClassObject.xbmc=getNormalSelectText("addAdministrationClass_department");
	newClassObject.xbbm=getNormalSelectValue("addAdministrationClass_department");
	newClassObject.njbm=getNormalSelectValue("addAdministrationClass_garde");
	newClassObject.njmc=getNormalSelectText("addAdministrationClass_garde");
	newClassObject.zybm=getNormalSelectValue("addAdministrationClass_major");
	newClassObject.zymc=getNormalSelectText("addAdministrationClass_major");
	newClassObject.xqmc=getNormalSelectText("addAdministrationClass_campus");
	newClassObject.xqbm=getNormalSelectValue("addAdministrationClass_campus");
	newClassObject.zxrs=0;
	$("#addAdministrationClass_houldNum").val()===""?newClassObject.rnrs=0:newClassObject.rnrs=parseInt($("#addAdministrationClass_houldNum").val());
	return newClassObject;
}

//重新渲染新增行政班区域
function emptyAdministrationClassDetailsArea(){
	stuffEJDElement(EJDMElementInfo); //校区
	LinkageSelectPublic("#addAdministrationClass_level","#addAdministrationClass_department","#addAdministrationClass_garde","#addAdministrationClass_major"); //联动select
	var reObject = new Object();
	reObject.InputIds = "#addAdministrationClass_classCode,#addAdministrationClass_className,#addAdministrationClass_houldNum";
	reObject.actionSelectIds = "#addAdministrationClass_department,#addAdministrationClass_garde,#addAdministrationClass_major";
	reReloadSearchsWithSelect(reObject);
}

//单个删除行政班
function removeAdministrationClass(row){
	if(row.sfsckkjh==="T"){
		toastr.warning('不能删除已生成开课计划的班级');
		return;
	}
	$(".removeTip").show();
	showMaskingElement();
	$(".removeType").html("行政班");
	$('.confirmremove').unbind('click');
	$('.confirmremove').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.edu300_ID);
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//多选删除行政班
function removeAdministrationClasses() {
	var chosenclasses = $('#administrationClassTable').bootstrapTable('getAllSelections');
	if (chosenclasses.length === 0) {
		toastr.warning('暂未选择任何班级');
		return;
	}
	for (var i = 0; i < chosenclasses.length; i++) {
		if(chosenclasses[i].sfsckkjh==="T"){
			toastr.warning('不能删除已生成开课计划的班级');
			return;
		}
	}
	$(".removeTip").show();
	showMaskingElement();
	$(".removeType").html("培养计划");
	$('.confirmremove').unbind('click');
	$('.confirmremove').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenclasses.length; i++) {
			removeArray.push(chosenclasses[i].edu300_ID);
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
		url : "/removeAdministrationClass",
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
				tableRemoveAction("#administrationClassTable", removeArray, ".administrationClassTableArea", "行政班信息");
				$(".remindTip").hide();
				$(".myTooltip").tooltipify();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//检索行政班
function startSearchAdministrationClass(){
	var nouNullSearch=getNotNullSearchs();
	var className = $("#AdministrationClassName").val();
	if(typeof nouNullSearch ==='undefined'){
		return;
	}
	var serachObject=new Object();
	serachObject.level=nouNullSearch.level;
	serachObject.department=nouNullSearch.department;
	serachObject.grade=nouNullSearch.grade;
	serachObject.major=nouNullSearch.major;
	className===""?serachObject.className="":serachObject.className=className;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClass",
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
				if(backjson.calssInfo.length===0){
					toastr.warning('暂无数据');
					drawAdministrationClassEmptyTable();
					return;
				}
				stuffAdministrationClassTable(backjson.calssInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//重置检索
function reReloadAdministrationClassSearchs() {
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.InputIds = "#AdministrationClassName";
	reObject.actionSelectIds = "#department,#grade,#major";
	reReloadSearchsWithSelect(reObject);
	drawAdministrationClassEmptyTable();
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

//页面初始化时按钮事件绑定
function btnBind(){
	// 提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$(".tip").hide();
		showMaskingElement();
		hideloding();
		e.stopPropagation();
	});
	
	//预备新增行政班
	$('#wantAddAdministrationClass').unbind('click');
	$('#wantAddAdministrationClass').bind('click', function(e) {
		wantAddAdministrationClass();
		e.stopPropagation();
	});
	
	//批量删除行政班
	$('#removedministrationClasses').unbind('click');
	$('#removedministrationClasses').bind('click', function(e) {
		removeAdministrationClasses();
		e.stopPropagation();
	});
	
	//检索行政班
	$('#startSearchAdministrationClass').unbind('click');
	$('#startSearchAdministrationClass').bind('click', function(e) {
		startSearchAdministrationClass();
		e.stopPropagation();
	});
	
	//重置检索
	$('#reReloadSearchsAdministrationClass').unbind('click');
	$('#reReloadSearchsAdministrationClass').bind('click', function(e) {
		reReloadAdministrationClassSearchs();
		e.stopPropagation();
	});
	
	//导出Excel
	$('#AdministrationClassTableToExecl').unbind('click');
	$('#AdministrationClassTableToExecl').bind('click', function(e) {
		tableToExecl("#administrationClassTable");
		e.stopPropagation();
	});
}





/*
 * tab2
 */
// 判断是否是第一加载tab2的内容
function judgmentIsFristTimeLoadTab2() {
	var isFirstShowTab3 = $(".isFirstShowTab2")[0].innerText;
	if (isFirstShowTab3 === "T") {
		drawClassManagementEmptyTable();
		getTeachingClassSelectInfo();
		classManagementBtnbnid();
		$(".isFirstShowTab3").html("F");
	}
}

//获取-教学班- 有逻辑关系select信息
function getTeachingClassSelectInfo() {
	LinkageSelectPublic("#classManagement_level","#classManagement_department","#classManagement_grade","#classManagement_major");
	$("#classManagement_major").change(function() {
		$.ajax({
			method : 'get',
			cache : false,
			url : "/teachingClassQueryAdministrationClassesLibrary",
			data: {
	             "culturePlanInfo":JSON.stringify(teachingClassTetNotNullSearchs()) 
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
					dropConfigOption("#classManagement_major");
					if(backjson.classesInfo.length===0){
						toastr.info('暂无可选行政班');
						return;
					}
					stuffClassManagementTable(backjson.classesInfo);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

// 渲染空班级管理表格
function drawClassManagementEmptyTable() {
	stuffClassManagementTable({});
}

// 填充班级管理表格
function stuffClassManagementTable(tableInfo) {
	window.classManagementEvents = {
		'click #generateClassName' : function(e, value, row, index) {
			generateClassName(row,index);
		},
		'click #editorClassName' : function(e, value, row, index) {
			editorClassName(row,index);
		}
	};

	$('#classManagementTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".classManagementTableArea", "行政班信息");
		},
		columns : [ {
			field : 'edu300_ID',
			title : 'edu300_ID',
			align : 'center',
			visible : false
		}, {
			field : 'check',
			checkbox : true
		}, {
			field : 'xqmc',
			title : '校区名称',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zymc',
			title : '专业',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xzbmc',
			title : '行政班',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kcmc',
			title : '课程',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'kcxz',
			title : '课程性质',
			align : 'left',
			formatter : paramsMatter
		},{
			field : 'xf',
			title : '学分',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zdrs',
			title : '在读人数',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'rnrs',
			title : '容纳人数',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'jxbrs',
			title : '教学班人数',
			align : 'left',
			formatter : TeachingClassHoldNumFormatter,
		}, {
			field : 'jxbmc',
			title : '教学班名称',
			align : 'left',
			formatter : TeachingClassHoldNameFormatter,
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : classManagementFormatter,
			events : classManagementEvents,
		} ]
	});

	function classManagementFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
				+ '<li id="generateClassName"><span><img src="img/info.png" style="width:24px"></span>生成教学班名称</li>'
				+ '<li id="editorClassName"><span><img src="images/t02.png" style="width:24px"></span>编辑教学班名称</li>'
				+ '</ul>' ].join('');
	}

	function TeachingClassHoldNumFormatter(value, row, index) {
		if (value !==0) {
			return [ '<div class="haveTextBg myTooltip" title="' + value
					+ '"><span>' + value + '</span></div>' ].join('');
		} else {
			return [ '' ].join('');
		}
	}
	
	function TeachingClassHoldNameFormatter(value, row, index) {
		if (value !== "") {
			return [ '<div class="haveTextBg myTooltip" title="' + value
					+ '"><span class="teachingClassHoldName teachingClassHoldName'+index+'">' + value + '</span><input type="text" class="breakClassTableInput tableInput noneStart" id="teachingClassHoldName'+index+'"></div>' ].join('');
		} else {
			return [ '<div class="myTooltip" title="' + value + '"><span class="teachingClassHoldName teachingClassHoldName'+index+'">'
					+ value + '</span><input type="text" class="breakClassTableInput tableInput noneStart" id="teachingClassHoldName'+index+'"></div>' ].join('');
		}
	}
	drawPagination(".classManagementTableArea", "行政班信息");
	drawSearchInput();
	changeTableNoRsTip();
	toolTipUp(".myTooltip")
	changeColumnsStyle(".classManagementTableArea", "行政班信息");
}

//生成教学班名称
function generateClassName(row,index){
	$("#classManagementTable").bootstrapTable('updateCell', {
		index : index,
		field : 'jxbmc',
		value : row.xzbmc
	});
	$("#classManagementTable").bootstrapTable('updateCell', {
		index : index,
		field : 'jxbrs',
		value : row.zdrs
	});
    toolTipUp(".myTooltip");
}

//编辑教学班名称
function editorClassName(row,index){
	$(".tableInput").hide();
	$(".teachingClassHoldName").show();
	$(".teachingClassHoldName"+index).hide();
	$("#teachingClassHoldName"+index).show().val(row.jxbrs).focus();
	//绑定input失焦更新值事件
	$("#teachingClassHoldName" + index).blur(function() {
		if (row.TeachingClassHoldName !== $("#teachingClassHoldName" + index).val()) {
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
			$("#classManagementTable").bootstrapTable('updateCell', {
				index: index,
				field: 'TeachingClassHoldName',
				value: $("#teachingClassHoldName" + index).val()
			});
		} else {
			$("#classManagementTable").bootstrapTable('updateCell', {
				index: index,
				field: 'TeachingClassHoldName',
				value: row.TeachingClassHoldName
			});
		}
		$("#classManagementTable").bootstrapTable('updateCell', {
			index : index,
			field : 'TeachingClassHoldNum',
			value : row.onlineNum
		});
		toolTipUp(".myTooltip");
	});
}

// 批量生成教学班名称
function generatTeachingClassNames() {
	if (!tableIsChecked("#classManagementTable", '班级')) {
		return;
	}
	stuffNewTeachingClassInfo();
}

// 填充教学班名称
function stuffNewTeachingClassInfo() {
	var choosedTeachingClass = $("#classManagementTable").bootstrapTable(
			"getSelections");
	for (var i = 0; i < choosedTeachingClass.length; i++) {
		if (choosedTeachingClass[i].jxbrl === 0) {
			generateClassName(choosedTeachingClass[i],i);
		}
	}
	toolTipUp(".myTooltip");
}

//保存教学班
function saveTeachingClass() {
	var allClass = $("#classManagementTable").bootstrapTable("getData");
	
	var noGeneratedNum=0
	for (var i = 0; i < allClass.length; i++) {
		if(allClass[i].jxbrs===0&&allClass[i].jxbmc===""){
			noGeneratedNum++;
		}
	}
	
	if(noGeneratedNum===allClass.length){
		toastr.warning('暂未生成教学班');
		return;
	}
	
	var choosedTeachingArray = new Array();
	for (var i = 0; i < allClass.length; i++) {
		if(allClass[i].jxbrs!==0&&allClass[i].jxbmc!==""){
			var planInfo=teachingClassTetNotNullSearchs();
			if(typeof planInfo ==='undefined'){
				return;
			}
			var choosedTeaching = new Object();
			choosedTeaching.edu108_ID = allClass[i].edu108_ID;
			choosedTeaching.jxbmc = allClass[i].jxbmc;
			choosedTeaching.pyccmc = planInfo.levelTxt;
			choosedTeaching.pyccbm = planInfo.level;
			choosedTeaching.xbmc = planInfo.departmentTxt;
			choosedTeaching.xbbm = planInfo.department;
			choosedTeaching.njbm = planInfo.grade;
			choosedTeaching.njmc = planInfo.gradeTxt;
			choosedTeaching.zybm = planInfo.grade;
			choosedTeaching.zymc = planInfo.gradeTxt;
			choosedTeaching.bhzyCode =allClass[i].zybm;
			choosedTeaching.bhzymc =allClass[i].zymc ;
			choosedTeaching.bhxzbCode =allClass[i].xzbbm;
			choosedTeaching.bhxzbmc =allClass[i].xzbmc;
			choosedTeaching.bhxsxm = "";
			choosedTeaching.bhxsCode ="";
			choosedTeaching.sffbjxrws ="F";
			choosedTeaching.jxbrs =allClass[i].jxbrs;
			choosedTeaching.yxbz ="1";
			choosedTeachingArray.push(choosedTeaching);
			
		}
	}
	verifySaveClass(choosedTeachingArray);
}

// 合班
function combinedClass() {
	var choosedTeachingClass = $("#classManagementTable").bootstrapTable("getSelections");
	if (!tableIsChecked("#classManagementTable", '班级')) {
		return;
	}

	if (choosedTeachingClass.length < 2) {
		toastr.warning('至少选择两个行政班');
		return;
	}

	var combinedClassName = ''; //合班名称
	var combinedClassStudentNum = 0; //合班人数
	var combinedMajorName = ''; //包含专业名称
	var combinedMajorCodes = ''; //包含专业编码
	var combinedAdministrationClassesName = ''; //包含行政班名称
	var combinedAdministrationClassesCodes  = ''; //包含行政班编码
	for (var i = 0; i < choosedTeachingClass.length; i++) {
		if (choosedTeachingClass[0].edu108_ID !== choosedTeachingClass[i].edu108_ID) {
			toastr.warning('请选择相同课程');
			return;
		} else {
			combinedClassName +=  choosedTeachingClass[i].kcmc+choosedTeachingClass[i].xzbmc+ '+';
			combinedClassStudentNum += choosedTeachingClass[i].zdrs;
			combinedMajorName+=choosedTeachingClass[i].zymc+ ',';
			combinedMajorCodes+=choosedTeachingClass[i].zybm+ ',';
			combinedAdministrationClassesName+=choosedTeachingClass[i].xzbmc+ ',';
			combinedAdministrationClassesCodes+=choosedTeachingClass[i].xzbbm+ ',';
		}
	}
	var dealCombinedClassName = '(合)' + combinedClassName.slice(0, -1);
	var planInfo=teachingClassTetNotNullSearchs();
	if(typeof planInfo ==='undefined'){
		return;
	}
	var choosedTeachingArray = new Array();
	var choosedTeaching = new Object();
	choosedTeaching.edu108_ID = choosedTeachingClass[0].edu108_ID;
	choosedTeaching.pyccmc = planInfo.levelTxt;
	choosedTeaching.pyccbm = planInfo.level;
	choosedTeaching.xbmc = planInfo.departmentTxt;
	choosedTeaching.xbbm = planInfo.department;
	choosedTeaching.njbm = planInfo.grade;
	choosedTeaching.njmc = planInfo.gradeTxt;
	choosedTeaching.zybm = planInfo.grade;
	choosedTeaching.zymc = planInfo.gradeTxt;
	choosedTeaching.bhzyCode =combinedMajorCodes;
	choosedTeaching.bhzymc =combinedMajorName;
	choosedTeaching.bhxzbCode = combinedAdministrationClassesCodes;
	choosedTeaching.bhxzbmc =combinedAdministrationClassesName;
	choosedTeaching.bhxsxm = "";
	choosedTeaching.bhxsCode ="";
	choosedTeaching.sffbjxrws ="F";
	choosedTeaching.jxbrs =combinedClassStudentNum;
	choosedTeaching.yxbz ="1";
	choosedTeachingArray.push(choosedTeaching);

	$("#combinedClassName").val(dealCombinedClassName);
	$("#combinedClassHoldStudentNum").val(combinedClassStudentNum);
	$(".combinedClassTip").show();
	showMaskingElement();
	// 确定按钮
	$('#confirmCombinedClass').unbind('click');
	$('#confirmCombinedClass').bind('click', function(e) {
		verifyCombinedClass(choosedTeachingArray);
		e.stopPropagation();
	});
}

// 拆班
function breakClass() {
	var choosedTeachingClass = $("#classManagementTable").bootstrapTable(
			"getSelections");
	if (!tableIsChecked("#classManagementTable", '班级')) {
		return;
	}

	var planInfo=teachingClassTetNotNullSearchs();
	var allStudentNum = 0;
	var choosedTeachingAraay = new Array();
	for (var i = 0; i < choosedTeachingClass.length; i++) {
		if (choosedTeachingClass[0].edu108_ID !== choosedTeachingClass[i].edu108_ID) {
			toastr.warning('请选择相同课程');
			return;
		} else {
			allStudentNum += choosedTeachingClass[i].zdrs;
			choosedTeachingAraay.push(choosedTeachingClass[i]);
		}
	}

	$("#allStudentNum").val(allStudentNum);

	stuffEmptyClassTable();
	$(".breakClassTip").show();
	showMaskingElement();
	// 拆分按钮
	$('#startBreak').unbind('click');
	$('#startBreak').bind('click', function(e) {
		startBreak(choosedTeachingAraay,allStudentNum);
		e.stopPropagation();
	});
}

// 开始拆分
function startBreak(choosedTeachingAraay,allStudentNum) {
	$("#breakClassTable").bootstrapTable("removeAll");
	var breakNum = parseInt($("#breakClassNum").val());
	var breakPrefixesName = "";
	for (var i = 0; i < choosedTeachingAraay.length; i++) {
		breakPrefixesName += choosedTeachingAraay[i].kcmc+choosedTeachingAraay[i].xzbmc + '+';
	}

	var appendArray = new Array();
	for (var i = 0; i < breakNum; i++) {
		var appendObject = new Object();
		appendObject.id = i;
		appendObject.jxbmc = '(拆' + (i + 1) + '班)'+ breakPrefixesName.slice(0, -1);
		appendObject.jxbrs = 0;
		appendObject.bhxzbmc = '';
		appendObject.bhxsxm = '';
		appendObject.bhxzbCode = '';
		appendObject.bhxsCode = '';
		appendObject.choosedTeachingAraay = choosedTeachingAraay;
		appendArray.push(appendObject);
	}
	$("#breakClassTable").bootstrapTable("append", appendArray);
	drawPagination(".breakClassTableArea", "拆班信息");

	// 确定按钮
	$('#confirmBreakClass').unbind('click');
	$('#confirmBreakClass').bind('click', function(e) {
		confirmBreakClass(allStudentNum);
		e.stopPropagation();
	});
	toolTipUp(".myTooltip");
}

// 填充空拆班表
function stuffEmptyClassTable() {
	stuffBreakClassTableInfo({});
}

// 填充拆班表
function stuffBreakClassTableInfo(tableInfo) {
	$('#breakClassTable').bootstrapTable('destroy').bootstrapTable(
			{
				data : tableInfo.newsInfo,
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
				showColumns : false,
				onPageChange : function() {
					drawPagination(".breakClassTableArea", "拆班信息");
				},
				onDblClickRow : function(row, $element, field) {
					breakClassTableOnDblClick(field,parseInt($element[0].dataset.index), row);
				},
				columns : [ {
					field : 'id',
					title : 'id',
					align : 'center',
					visible : false
				}, {
					field : 'choosedTeachingAraay',
					align : 'center',
					visible : false
				}, {
					field : 'jxbmc',
					title : '教学班名称',
					align : 'left',
					formatter : teachingClassNameFormatter
				}, {
					field : 'jxbrs',
					title : '教学班人数',
					align : 'left',
					formatter : paramsMatter
				}, {
					field : 'bhxzbmc',
					title : '指定行政班',
					align : 'left',
					formatter : appointAdministrationClassFormatter,
				}, {
					field : 'bhxsxm',
					title : '学生名单',
					align : 'left',
					formatter : studentMenuFormatter,
				} ]
			});

	function teachingClassNameFormatter(value, row, index) {
		return [ '<input type="text" class="breakClassTableInput tableInput noneStart" id="teachingClassNameInput'
				+ index
				+ '">'
				+ '<span title="'
				+ row.jxbmc
				+ '" class="myTooltip showteachingClassName showteachingClassName'
				+ index + '">' + row.jxbmc + '</span>' ].join('');
	}

	function appointAdministrationClassFormatter(value, row, index) {
		return [ '<select class="noneStart tableSelect" name="appointClassSelect'+ index+ '" id="appointClassSelect'+ index+ '" multiple>'
				+ '</select>'
				+ '<span title="'+ value.slice(0, -1)+ '" class="myTooltip appointClassName appointClassName'+ index + '">' + value.slice(0, -1) + '</span>' ].join('');
	}

	function studentMenuFormatter(value, row, index) {
		return [ '<span class="myTooltip" title="'
				+ value.slice(0, -1) + '">'
				+ value.slice(0, -1) + '</span>' ].join('');
	}

	drawPagination(".breakClassTableArea", "拆班信息");
	drawSearchInput(".breakClassTableArea");
	changeTableNoRsTip('暂未拆班...');
	toolTipUp(".myTooltip");
}

// 拆班表双击事件
function breakClassTableOnDblClick(field, index, row) {
	if (field === "jxbmc") {
		onDblClickforTeachingClassName(field, index, row);
	} else if (field === "bhxzbmc") {
		onDblClickforAppointClass(field, index, row);
	} else if (field === "bhxsxm") {
		onDblClickforStudentMenu(field, index, row);
	}
}

// 拆班表教学班名称点击事件
function onDblClickforTeachingClassName(field, index, row) {
	$(".breakClassTableInput").hide();
	$(".showteachingClassName").show();
	$("#teachingClassNameInput" + index).show().val(row.jxbmc).focus();
	$(".showteachingClassName" + index).hide();
	// 绑定input失焦更新值事件
	$("#teachingClassNameInput" + index).blur(
			function() {
				if (row.jxbmc !== $("#teachingClassNameInput" + index).val()) {
					$("#breakClassTable").bootstrapTable('updateCell', {
						index : index,
						field : 'jxbmc',
						value : $("#teachingClassNameInput" + index).val()
					});

				} else {
					$("#breakClassTable").bootstrapTable('updateCell', {
						index : index,
						field : 'jxbmc',
						value : row.teachingClassName
					});
				}
			});
	toolTipUp(".myTooltip");
}

// 拆班表指定学生点击事件
function onDblClickforStudentMenu(field, index, row) {
	var choosedTeachingClass = $("#classManagementTable").bootstrapTable("getSelections");
	var xzbCode =new Array();
	for (var i = 0; i < choosedTeachingClass.length; i++) {
		xzbCode.push(choosedTeachingClass[i].xzbbm);
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryStudentInfoByAdministrationClass",
		data: {
             "xzbCode":JSON.stringify(xzbCode) 
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
				if (backjson.studentInfo.length===0) {
					toastr.warning('行政班暂无学生');
					return;
				}
				
				var administrationClassOppoinHtml = '<option value="seleceConfigTip">全部</option>';
				for (var i = 0; i < choosedTeachingClass.length; i++) {
					administrationClassOppoinHtml += '<option value="'+ choosedTeachingClass[i].xzbbm + '">'+ choosedTeachingClass[i].xzbmc + '</option>';
				}
				stuffEmptyChoosedStudentSelect(administrationClassOppoinHtml)
				stuffEmptyChoosedStudentCheckbox();
				stuffStudentTable(backjson.studentInfo);
				
				// 提示框
				$(".breakClassTip").hide();
				$(".appointClassStudenInfoTip").show();
				//按钮事件绑定
				studenBtnBind();
				// 确定按钮事件绑定
				$('#confirmChoosedStudent').unbind('click');
				$('#confirmChoosedStudent').bind('click', function(e) {
					confirmChoosedStudent(index);
					e.stopPropagation();
				});
			} else {
				hideloding();
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 拆班表指定行政班点击事件
function onDblClickforAppointClass(field, index, row) {
	var optionHtml = "";
	for (var i = 0; i < row.choosedTeachingAraay.length; i++) {
		optionHtml += '<option value="' + row.choosedTeachingAraay[i].xzbbm + '">'
				+ row.choosedTeachingAraay[i].xzbmc + '</option>';
	}
	optionHtml += '<option class="confirmMultiSelect" value=" ">确定</option>'
	$(".appointClassName" + index).hide();
	stuffBreakTableMultiSelect("#appointClassSelect" + index, optionHtml, index);
}

//填充多选
function stuffBreakTableMultiSelect(id, optionHtml, index) {
	if ($(id)[0].nextSibling.classList[0] !== "appointClassName") {
		$(id)[0].nextSibling.style.display = "inline-block";
	}

	if ($(id)[0].childNodes.length === 0) {
		$(id).append(optionHtml);

	}
	$(id).multiSelect();

	$('.multi-select-menu').find(".multi-select-menuitem:last").unbind('click');
	$('.multi-select-menu').find(".multi-select-menuitem:last").bind('click',function(e) {
						if ($(id).val() == null) {
							return;
						}

						$(id)[0].nextSibling.style.display = "none";

						$("#breakClassTable").bootstrapTable('updateCell', {
							index : index,
							field : 'bhxzbCode',
							value : $(id).val()
						});
						
						var updateIds = $("#breakClassTable").bootstrapTable("getData")[index].bhxzbCode;
						updateTeachingClassNum(updateIds, index);
						e.stopPropagation();
	});
}

// 拆班表指定行政班更新教学班人数
function updateTeachingClassNum(choosedAdministrationClassIds, index) {
	var allAdministrationClass = $("#classManagementTable").bootstrapTable("getData");
	var teachingClassNum = 0;
	var teachingClassName = "";
	for (var i = 0; i < choosedAdministrationClassIds.length; i++) {
		for (var k = 0; k < allAdministrationClass.length; k++) {
			if (choosedAdministrationClassIds[i] == allAdministrationClass[k].xzbbm&&allAdministrationClass[k].check) {
				teachingClassNum += allAdministrationClass[k].zdrs;
				teachingClassName += allAdministrationClass[k].xzbmc+",";
			}
		}
	}
	
	$("#breakClassTable").bootstrapTable('updateCell', {index : index,field : 'jxbrs',value : teachingClassNum});
	$("#breakClassTable").bootstrapTable("updateCell",{index:index,field:"bhxsxm",value:""});
	$("#breakClassTable").bootstrapTable("updateCell",{index:index,field:"bhxsCode",value:""});
	$("#breakClassTable").bootstrapTable('updateCell', {index : index,field : 'bhxzbmc',value :teachingClassName});
	
	toolTipUp(".myTooltip");
}

// 填充学生表
function stuffStudentTable(tableInfo) {
	$('#studentTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".studentTableArea", "学生信息");
		},
		columns : [ {
			field : 'edu001_ID',
			title : 'edu001_ID',
			align : 'center',
			visible : false
		}, {
			field : 'check',
			checkbox : true
		}, {
			field : 'xzbname',
			title : '所在行政班',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xm',
			title : '学生姓名',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xh',
			title : '学生学号',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xb',
			title : '学生性别',
			align : 'left',
			formatter : sexFormatter,
		}, {
			field : 'zt',
			title : '状态',
			align : 'left',
			formatter : statusFormatter,
		} ]
	});

	function statusFormatter(value, row, index) {
		if (value === "reading") {
			return [ '<span class="greenTxt myTooltip" title="在读">在读</span>' ]
					.join('');
		} else if (value === "suspension") {
			return [ '<span class="redTxt myTooltip" title="休学">休学</span>' ]
					.join('');
		}
	}
	drawPagination(".studentTableArea", "学生信息");
	drawSearchInput(".studentTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

// 学生信息select change事件
function appointClassStudenSelectChange(administrationClassId, studentSexId,studenStatusId) {
	var administrationClass = getNormalSelectValue(administrationClassId);
	var studentSex = getNormalSelectValue(studentSexId);
	var studenStatus = getNormalSelectValue(studenStatusId);
	var studentName = $("#appointClassStudenInfo_studentName").val();
	
	if (administrationClass !== ""&&studentSex !== ""&&studenStatus !== ""&&studentName !== "") {
		toastr.warning('检索条件为空');
		return;
	}
	
	var serachObject=new Object();
	administrationClass===""?serachObject.xzbcode="":serachObject.xzbcode=administrationClass;
	studentSex===""?serachObject.xb="":serachObject.xb=studentSex;
	studenStatus===""?serachObject.zt="":serachObject.zt=studenStatus;
	studentName===""?serachObject.xm="":serachObject.xm=studentName;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/breakClassSearchStudent",
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
				stuffStudentTable(backjson.calssInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 学生信息开始检索
function studentStartSearch() {
	appointClassStudenSelectChange("appointClassStudenInfo_administrationClass","appointClassStudenInfo_studentSex","appointClassStudenInfo_studenStatus");
}

// 学生信息重置检索
function studenReSearch() {
	var reObject = new Object();
	reObject.InputIds = "#appointClassStudenInfo_studentName";
	reObject.normalSelectIds = "#appointClassStudenInfo_administrationClass,#appointClassStudenInfo_studentSex,#appointClassStudenInfo_studenStatus";
	reReloadSearchsWithSelect(reObject);
	studentStartSearch();
}

// 清空已选学生
function emptyChooedStudent() {
	var isShowAction = $('#emptyChooedStudent').is(':checked');

	var currentStudent = $("#studentTable").bootstrapTable("getData");
	var breakClassTable = $("#breakClassTable").bootstrapTable("getData");
	var choosedStudents = new Array();
	for (var i = 0; i < breakClassTable.length; i++) {
		if (breakClassTable[i].bhxsCode !== "") {
			for (var g = 0; g< breakClassTable[i].bhxsCode.slice(0, -1).split(",").length; g++) {
				choosedStudents.push(breakClassTable[i].bhxsCode.slice(0, -1).split(",")[g]);
			}
		}
	}
	
	for (var i = 0; i < currentStudent.length; i++) {
		for (var k = 0; k < choosedStudents.length; k++) {
			if(!isShowAction){
				$("#studentTable").bootstrapTable("showRow", {index : i});
			}else{
				if (JSON.stringify(currentStudent[i].edu001_ID ) ===choosedStudents[k]) {
					$("#studentTable").bootstrapTable("hideRow", {index : i});
				}
			}
		}
	}
	toolTipUp(".myTooltip");
}

// 选定学生
function confirmChoosedStudent(index) {
	var choosedStudent = $("#studentTable").bootstrapTable("getSelections");
	if (choosedStudent.length === 0) {
		toastr.warning('暂未选择学生');
		return;
	}
	stuffChoosedStudent(choosedStudent, index);
}

// 填充被选择学生
function stuffChoosedStudent(choosedStudent, index) {
	var choosedStudentNum = 0;
	var choosedStudentName = "";
	var choosedStudentCode = "";
	for (var i = 0; i < choosedStudent.length; i++) {
		choosedStudentNum++;
		choosedStudentName+=choosedStudent[i].xm+",";
		choosedStudentCode+=choosedStudent[i].edu001_ID+",";
	}
	$("#breakClassTable").bootstrapTable("updateCell",{index:index,field:"jxbrs",value:choosedStudentNum});
	$("#breakClassTable").bootstrapTable("updateCell",{index:index,field:"bhxsxm",value:choosedStudentName});
	$("#breakClassTable").bootstrapTable("updateCell",{index:index,field:"bhxsCode",value:choosedStudentCode});
	$("#breakClassTable").bootstrapTable("updateCell", {index : index,field : "bhxzbmc",value : ""});
	$("#breakClassTable").bootstrapTable("updateCell", {index : index,field : "bhxzbCode",value : ""});
	
	$(".breakClassTip").show();
	$(".appointClassStudenInfoTip").hide();
	toolTipUp(".myTooltip");
}

// 填充清空学生CheckBox
function stuffEmptyChoosedStudentCheckbox() {
	if ($(".emptyChoosedStudentCheckArea")[0].children.length === 0) {
		$(".emptyChoosedStudentCheckArea").append(
				'<div class="icheck-material-blue">'
						+ ' <input type="checkbox" id="emptyChooedStudent"/>'
						+ ' <label for="emptyChooedStudent">清空已选学生</label>'
						+ '</div>');
	}
	// 默认不选
	$("#emptyChooedStudent").attr("checked", false);
}

// 填充行政班名称select
function stuffEmptyChoosedStudentSelect(eleText) {
	stuffManiaSelect("#appointClassStudenInfo_administrationClass", eleText);
	// select绑定change事件
	$("#appointClassStudenInfo_administrationClass,#appointClassStudenInfo_studentSex,#appointClassStudenInfo_studenStatus").change(function() {
		appointClassStudenSelectChange("appointClassStudenInfo_administrationClass","appointClassStudenInfo_studentSex","appointClassStudenInfo_studenStatus");
	});
}

// 学生信息区域按钮事件绑定
function studenBtnBind() {
	// 开始检索
	$('#studenStartSearch').unbind('click');
	$('#studenStartSearch').bind('click', function(e) {
		studentStartSearch();
		e.stopPropagation();
	});

	// 重置检索
	$('#studenReSearch').unbind('click');
	$('#studenReSearch').bind('click', function(e) {
		studenReSearch();
		e.stopPropagation();
	});

	// 清空已选学生
	$('#emptyChooedStudent').unbind('click');
	$('#emptyChooedStudent').bind('click', function(e) {
		emptyChooedStudent();
		e.stopPropagation();
	});

	// 学生列表tip按钮事件绑定
	$('.specialCanle').unbind('click');
	$('.specialCanle').bind('click', function(e) {
		$(".breakClassTip").show();
		$(".appointClassStudenInfoTip").hide();
		e.stopPropagation();
	});
}

// 确认拆班
function confirmBreakClass(allStudentNumRules) {
	var breakClassInfo = $("#breakClassTable").bootstrapTable("getData");
	if (breakClassInfo.length === 0) {
		toastr.warning('暂未拆班');
		return;
	}

	for (var i = 0; i < breakClassInfo.length; i++) {
		if (breakClassInfo[i].jxbrs === 0) {
			toastr.warning('有班级未设置');
			return;
			
		}
	}
	
	var currentAllstudentNum =0;
	for (var i = 0; i < breakClassInfo.length; i++) {
		currentAllstudentNum+=breakClassInfo[i].jxbrs;
	}
	if (currentAllstudentNum>allStudentNumRules) {
		toastr.warning('拆分班级人数大于学生总人数');
		return;
	}else if(currentAllstudentNum<allStudentNumRules){
		toastr.warning('拆分班级人数小于学生总人数');
		return;
	}
	
	var allstudentInfo = $("#studentTable").bootstrapTable("getData");
	var choosedStudentArray =new Array();
	var choosedXzbArray =new Array();
	for (var i = 0; i < breakClassInfo.length; i++) {
		if(breakClassInfo[i].bhxsxm !==""){
			for (var k = 0;k < breakClassInfo[i].bhxsCode.slice(0, -1).split(",").length; k++) {
				choosedStudentArray.push(breakClassInfo[i].bhxsCode.slice(0, -1).split(",")[k]);
			}
		}else{
			for (var g = 0; g < breakClassInfo[i].bhxzbCode.length; g++) {
				choosedXzbArray.push(breakClassInfo[i].bhxzbCode[g]);
			}
		}
	}
	
	for (var i = 0; i < allstudentInfo.length; i++) {
		if(choosedStudentArray.indexOf(JSON.stringify(allstudentInfo[i].edu001_ID))===-1&&choosedXzbArray.indexOf(allstudentInfo[i].xzbcode)===-1){
			toastr.warning('有学生暂未分配班级');
			return;
		}
	}
	
	var sendData = new Array();
	var planInfo=teachingClassTetNotNullSearchs();
	for (var i = 0; i < breakClassInfo.length; i++) {
		var breakClass = new Object();
		breakClass.edu108_ID = breakClassInfo[i].choosedTeachingAraay[0].edu108_ID;
		breakClass.jxbmc = breakClassInfo[i].jxbmc;
		breakClass.pyccmc = planInfo.levelTxt;
		breakClass.pyccbm = planInfo.level;
		breakClass.xbmc =planInfo.departmentTxt;
		breakClass.xbbm = planInfo.department;
		breakClass.njbm = planInfo.grade;
		breakClass.njmc = planInfo.gradeTxt;
		breakClass.zybm =planInfo.grade;
		breakClass.zymc = planInfo.gradeTxt;
		breakClass.bhxzbmc =breakClassInfo[i].bhxzbmc;
		breakClass.sffbjxrws ="F";
		breakClass.jxbrs =breakClassInfo[i].jxbrs;
		breakClass.yxbz ="1";
		var bhzyCode="";
		var bhzymc="";
		
		for (var k = 0; k < breakClassInfo[i].choosedTeachingAraay.length; k++) {
			bhzyCode +=breakClassInfo[i].choosedTeachingAraay[k].zybm+",";
			bhzymc +=breakClassInfo[i].choosedTeachingAraay[k].zymc+"," ;
			bhxzbCode +=breakClassInfo[i].choosedTeachingAraay[k].xzbbm+",";
		}
		
		var bhxzbCode="";
		for (var g = 0; g < breakClassInfo[i].bhxzbCode.length;g++) {
			bhxzbCode +=breakClassInfo[i].bhxzbCode[g]+",";
		}
		
		breakClass.bhzyCode =bhzyCode;
		breakClass.bhzymc =bhzymc;
		breakClass.bhxzbCode =bhxzbCode;
		breakClass.bhxsxm =breakClassInfo[i].bhxsxm;
		breakClass.bhxsCode =breakClassInfo[i].bhxsCode;
		sendData.push(breakClass);
	}
	breakverifySaveClass(sendData);
}

//保存教学班验证
function verifySaveClass(choosedTeaching) {
	verifyClassInfo("保存教学班",choosedTeaching,false);
}

// 合班验证
function verifyCombinedClass(choosedTeaching) {
	var combinedClassName = $("#combinedClassName").val();
	var combinedClassHoldStudentNum =$("#combinedClassHoldStudentNum").val();
	
	if (combinedClassName === "") {
		toastr.warning('合班名称不能为空');
		return;
	}
	
	if (!checkIsNumber(combinedClassHoldStudentNum)||parseInt(combinedClassHoldStudentNum)<0) {
		toastr.warning('班级人数只能为正整数');
		return;
	}

	if (parseInt(combinedClassHoldStudentNum) === 0) {
		toastr.warning('班级人数不能为空');
		return;
	}

	if (parseInt(combinedClassHoldStudentNum)<choosedTeaching.jxbrs) {
		toastr.warning('合班人数小于总学生数');
		return;
	}
	
	choosedTeaching[0].jxbmc = $("#combinedClassName").val();
	verifyClassInfo("合班",choosedTeaching,true);
}

//拆班验证
function breakverifySaveClass(choosedTeaching) {
	verifyClassInfo("保存教学班",choosedTeaching,false);
}

// 验证行政班信息
function verifyClassInfo(type,choosedTeaching,isShowMaskingElement,warningTxt){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/verifyClassInfo",
		data: {
             "verifyInfo":JSON.stringify(choosedTeaching) 
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
//				if (backjson.isHaveTeachingClass) {
//					if(!isShowMaskingElement){
//						hideloding();
//					}
//					toastr.warning(warningTxt);
//					return;
//				}
				
				if (backjson.willDropFirsthand) {
					$(".combinedClassTip,.breakClassTip").hide();
                    $(".actionTip").show();
                    $(".actionTxt").html("本次操作将删除原始教学班,是否确认继续？");
                	$('.confirmAction').unbind('click');
                	$('.confirmAction').bind('click', function(e) {
                		confirmClassAction(type,choosedTeaching,isShowMaskingElement);
                		e.stopPropagation();
                	});
                	return;
				}
				
				if(!backjson.isHaveTeachingClass&&!backjson.willDropFirsthand){
					confirmClassAction(type,choosedTeaching,isShowMaskingElement);
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 确认行政班操作
function confirmClassAction(type,choosedTeaching,isShowMaskingElement) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/confirmClassAction",
		data: {
             "classInfo":JSON.stringify(choosedTeaching) 
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
				toastr.success(type+'成功');
				$(".tip").hide();
				if(!isShowMaskingElement){
					hideloding();
				}else{
					showMaskingElement();
				}
				
				$('#classManagementTable').bootstrapTable('uncheckAll');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 教学班管理检索
function generatTeachingClassStartSearch(tableInfo) {
//	var notNullSearchs=teachingClassTetNotNullSearchs();
//	if(typeof notNullSearchs ==='undefined'){
//		return;
//	}
//	
//	// 发送查询所有用户请求
//	$.ajax({
//		method : 'get',
//		cache : false,
//		url : "/addCrouseSeacch",
//		data: {
//             "SearchCriteria":JSON.stringify(notNullSearchs) 
//        },
//		dataType : 'json',
//		beforeSend: function(xhr) {
//			requestErrorbeforeSend();
//		},
//		error: function(textStatus) {
//			requestError();
//		},
//		complete: function(xhr, status) {
//			requestComplete();
//		},
//		success : function(backjson) {
//			if (backjson.result) {
//				hideloding();
//				stuffClassManagementTable(backjson.tableInfo);
//			} else {
//				toastr.warning('操作失败，请重试');
//			}
//		}
//	});
	
}

// 刷新行政班在读人数
function refreshStudentNum() {
    var notNullSearchs=teachingClassTetNotNullSearchs();
    if(typeof notNullSearchs ==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/teachingClassQueryAdministrationClassesLibrary",
		data: {
             "culturePlanInfo":JSON.stringify(teachingClassTetNotNullSearchs()) 
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
				if(backjson.classesInfo.length===0){
					toastr.info('暂无可选行政班');
					return;
				}
				stuffClassManagementTable(backjson.classesInfo);
				toastr.success('刷新行政班在读人数成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
	
}

// 重置检索
function generatTeachingClassReSearch() {
	var reObject = new Object();
	reObject.fristSelectId = "#classManagement_level";
	reObject.InputIds = "#classManagement_className,#classManagement_className";
	reObject.normalSelectIds = "#appointClassStudenInfo_administrationClass,#appointClassStudenInfo_studentSex,#appointClassStudenInfo_studenStatus";
	reReloadSearchsWithSelect(reObject);
	drawClassManagementEmptyTable();
}

//教学班管理子区域显示隐藏
function changeClassManagementShowArea() {
	$(".allteachingClassArea").toggle();
	$(".addTeachingClassArea").toggle();
}

// 班级管理区域初始化时按钮事件绑定
function classManagementBtnbnid() {
	// 教学班列表
	$('#showAllTeachingClass').unbind('click');
	$('#showAllTeachingClass').bind('click', function(e) {
		getAllTeachingClassInfo(true);
		e.stopPropagation();
	});

	// 批量生成教学班名称
	$('#generatTeachingClassNames').unbind('click');
	$('#generatTeachingClassNames').bind('click', function(e) {
		generatTeachingClassNames();
		e.stopPropagation();
	});

	// 保存教学班
	$('#saveTeachingClass').unbind('click');
	$('#saveTeachingClass').bind('click', function(e) {
		saveTeachingClass();
		e.stopPropagation();
	});
	
	// 合班
	$('#combinedClass').unbind('click');
	$('#combinedClass').bind('click', function(e) {
		combinedClass();
		e.stopPropagation();
	});

	// 拆班
	$('#breakClass').unbind('click');
	$('#breakClass').bind('click', function(e) {
		breakClass();
		e.stopPropagation();
	});

	// 检索
	$('#generatTeachingClass_startSearch').unbind('click');
	$('#generatTeachingClass_startSearch').bind('click', function(e) {
		generatTeachingClassStartSearch();
		e.stopPropagation();
	});

	// 刷新行政班在读人数
	$('#generatTeachingClass_refreshStudentNum').unbind('click');
	$('#generatTeachingClass_refreshStudentNum').bind('click', function(e) {
		refreshStudentNum();
		e.stopPropagation();
	});

	// 重置检索
	$('#generatTeachingClass_reSearch').unbind('click');
	$('#generatTeachingClass_reSearch').bind('click', function(e) {
		generatTeachingClassReSearch();
		e.stopPropagation();
	});

	// 导出Excel
	$('#generatTeachingClass_tableToExecl').unbind('click');
	$('#generatTeachingClass_tableToExecl').bind('click', function(e) {
		tableToExecl("#classManagementTable");
		e.stopPropagation();
	});
}

// 添加教学班区域初始化时按钮事件绑定
function addTeachingClassBtnbind() {
	// 添加教学班
	$('#addTeachingClass').unbind('click');
	$('#addTeachingClass').bind('click', function(e) {
		changeClassManagementShowArea();
		e.stopPropagation();
	});

	// 批量删除
	$('#removeTeachingClasses').unbind('click');
	$('#removeTeachingClasses').bind('click', function(e) {
		removeTeachingClasses();
		e.stopPropagation();
	});

	// 开始检索
	$('#allteachingClassArea_startSearch').unbind('click');
	$('#allteachingClassArea_startSearch').bind('click', function(e) {
		allteachingClassAreaStartSearch();
		e.stopPropagation();
	});

	// 重置检索
	$('#allteachingClassArea_reSearch').unbind('click');
	$('#allteachingClassArea_reSearch').bind('click', function(e) {
		allteachingClassAreaReSearch();
		e.stopPropagation();
	});

	// 导出Excel
	$('#allteachingClassArea_tableToExecl').unbind('click');
	$('#allteachingClassArea_tableToExecl').bind('click', function(e) {
		tableToExecl("#teachingClassTable");
		e.stopPropagation();
	});
}

// 获取教学班列表信息
function getAllTeachingClassInfo(isReturnLastPage) {
	var searchData = new Object();
	if (getNormalSelectValue("classManagement_level") !== "seleceConfigTip") {
		searchData.level = getNormalSelectValue("classManagement_level");
	}
	if (getNormalSelectValue("classManagement_department") !== "seleceConfigTip") {
		searchData.department = getNormalSelectValue("classManagement_department");
	}
	if (getNormalSelectValue("classManagement_grade") !== "seleceConfigTip") {
		searchData.grade = getNormalSelectValue("classManagement_grade");
	}
	if (getNormalSelectValue("classManagement_major") !== "seleceConfigTip") {
		searchData.major = getNormalSelectValue("classManagement_major");
	}
	if ($("#classManagement_className").val() !== "") {
		searchData.className = $("#classManagement_className").val();
	}
	if ($("#classManagement_coursesName").val() !== "") {
		searchData.className = $("#classManagement_coursesName").val();
	}

	if (JSON.stringify(searchData) == "{}") {
		toastr.warning('教学班定位条件为空');
		return;
	}
	// 发送查询所有用户请求
	// $.ajax({
	// method : 'get',
	// cache : false,
	// url : "/queryDrgGroupIntoInfo",
	// dataType : 'json',
	// success : function(backjson) {
	// if (backjson.result) {
	// stuffDrgGroupMangerTable(backjson);
	// } else {
	// jGrowlStyleClose('操作失败，请重试');
	// }
	// }
	// });
	var tableInfo = {
		"newsInfo" : [ {
			"id" : "id1",
			"classSemesters" : "2018-2019-第一学期",
			"teachingClassName" : "教学班名称",
			"coursesName" : "课程名字",
			"teachingClassNum" : 56,
			"major" : "某某专业,某某专业",
			"includeClasses" : "一班,二班",
			"missionIsPass" : true
		}, {
			"id" : "id2",
			"classSemesters" : "2018-2019-第三学期",
			"teachingClassName" : "教学班名称",
			"coursesName" : "课程名字",
			"teachingClassNum" : 56,
			"major" : "某某专业,某某专业",
			"includeClasses" : "三班,四班",
			"missionIsPass" : false
		} ]
	};
	stuffTeachingClassTable(tableInfo);
	if (isReturnLastPage) {
		changeClassManagementShowArea();
		addTeachingClassBtnbind();
	}
}

// 填充教学班列表
function stuffTeachingClassTable(tableInfo) {
	window.teachingClassEvents = {
		'click #modifyTeachingClassName' : function(e, value, row, index) {
			modifyTeachingClassName(row, index);
		},
		'click #removeTeachingClass' : function(e, value, row, index) {
			removeTeachingClass(row);
		}
	};

	$('#teachingClassTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo.newsInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".teachingClassTableArea", "教学班信息");
		},
		onDblClickRow : function(row, $element, field) {
			if (field !== "teachingClassName") {
				return;
			}
			modifyTeachingClassName(row, parseInt($element[0].dataset.index));
		},
		columns : [ {
			field : 'id',
			title : 'id',
			align : 'center',
			visible : false
		}, {
			field : 'check',
			checkbox : true
		}, {
			field : 'classSemesters',
			title : '学期',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'teachingClassName',
			title : '教学班名称',
			align : 'left',
			clickToSelect : false,
			formatter : teachingClassNameFormatter,
		}, {
			field : 'coursesName',
			title : '课程',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'major',
			title : '专业',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'includeClasses',
			title : '班级',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'teachingClassNum',
			title : '教学班人数',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'missionIsPass',
			title : '是否发了任务书',
			align : 'left',
			formatter : missionIsPassFormatter,
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : teachingClassFormatter,
			events : teachingClassEvents,
		} ]
	});

	function teachingClassNameFormatter(value, row, index) {
		return [ '<input type="text" class="myTooltip teachingClassTableInput tableInput noneStart" id="teachingClassTable_teachingClassNameInput'
				+ index
				+ '">'
				+ '<span title="'
				+ row.teachingClassName
				+ '" class="myTooltip teachingClassTable_teachingClassName teachingClassTable_teachingClassName'
				+ index + '">' + row.teachingClassName + '</span>' ].join('');
	}

	function teachingClassFormatter(value, row, index) {
		if (!row.missionIsPass) {
			return [ '<ul class="toolbar tabletoolbar">'
					+ '<li id="modifyTeachingClassName"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
					+ '<li id="removeTeachingClass"><span><img src="images/t03.png"></span>删除</li>'
					+ '</ul>' ].join('');
		} else {
			return [ '' ].join('');
		}
	}

	function missionIsPassFormatter(value, row, index) {
		if (value) {
			return [ '<span class="greenTxt myTooltip" title="已发任务书">已发任务书</span>' ]
					.join('');
		} else {
			return [ '<span class="redTxt myTooltip" title="未发任务书">未发任务书</span>' ]
					.join('');
		}

	}
	drawPagination(".teachingClassTableArea", "教学班信息");
	drawSearchInput();
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

// 修改教学班名称
function modifyTeachingClassName(row, index) {
	$(".teachingClassTableInput").hide();
	$(".teachingClassTable_teachingClassName").show();
	$("#teachingClassTable_teachingClassNameInput" + index).show().val(
			row.teachingClassName).focus();
	$(".teachingClassTable_teachingClassName" + index).hide();
	// 绑定input失焦更新值事件
	$("#teachingClassTable_teachingClassNameInput" + index).blur(
			function() {
				if (row.teachingClassName !== $(
						"#teachingClassTable_teachingClassNameInput" + index)
						.val()) {
					// 发送查询所有用户请求
					// $.ajax({
					// method : 'get',
					// cache : false,
					// url : "/queryDrgGroupIntoInfo",
					// dataType : 'json',
					// success : function(backjson) {
					// if (backjson.result) {
					// stuffDrgGroupMangerTable(backjson);
					// } else {
					// jGrowlStyleClose('操作失败，请重试');
					// }
					// }
					// });
					$("#teachingClassTable").bootstrapTable(
							'updateCell',
							{
								index : index,
								field : 'teachingClassName',
								value : $(
										"#teachingClassTable_teachingClassNameInput"
												+ index).val()
							});
					toolTipUp(".myTooltip");
				} else {
					$("#teachingClassTable").bootstrapTable('updateCell', {
						index : index,
						field : 'teachingClassName',
						value : row.teachingClassName
					});
					toolTipUp(".myTooltip");
				}
			});

}

// 单个删除教学班
function removeTeachingClass(row) {
	$(".removeTip").show();
	showMaskingElement();
	$(".removeType").html("教学班");
	$('.confirmremove').unbind('click');
	$('.confirmremove').bind(
			'click',
			function(e) {
				var removeArray = new Array;
				removeArray.push(row.id);
				removeNewsAjaxDemo("#teachingClassTable", removeArray,
						".teachingClassTableArea", "教学班信息");
				e.stopPropagation();
			});
}

// 批量删除教学班
function removeTeachingClasses() {
	var chosenTeachingClasses = $('#teachingClassTable').bootstrapTable(
			'getAllSelections');
	if (chosenTeachingClasses.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}

	for (var i = 0; i < chosenTeachingClasses.length; i++) {

		if (chosenTeachingClasses[i].missionIsPass) {
			toastr.warning('不能删除已发布任务书的教学班');
			return;
		}
	}

	$(".removeTip").show();
	showMaskingElement();
	$(".removeType").html("教学班");
	$('.confirmremove').unbind('click');
	$('.confirmremove').bind(
			'click',
			function(e) {
				var removeNewsArray = new Array;
				for (var i = 0; i < chosenTeachingClasses.length; i++) {
					removeNewsArray.push(chosenTeachingClasses[i].id);
				}
				removeNewsAjaxDemo("#teachingClassTable", removeNewsArray,
						".teachingClassTableArea", "教学班信息");
				e.stopPropagation();
			});
}

// 开始检索
function allteachingClassAreaStartSearch() {
	var className = $("#allteachingClass_className").val();
	var coursesName = $("#allteachingClass_coursesName").val();
	if (className === "" && coursesName === "") {
		toastr.warning('请输入检索条件');
		return;
	}
	// 发送查询所有用户请求
	// $.ajax({
	// method : 'get',
	// cache : false,
	// url : "/queryDrgGroupIntoInfo",
	// dataType : 'json',
	// success : function(backjson) {
	// if (backjson.result) {
	// stuffDrgGroupMangerTable(backjson);
	// } else {
	// jGrowlStyleClose('操作失败，请重试');
	// }
	// }
	// });
	var tableInfo = {
		"newsInfo" : [ {
			"id" : "id1",
			"classSemesters" : "2018-2019-第一学期",
			"teachingClassName" : "教学班名称",
			"coursesName" : "课程名字-检索",
			"teachingClassNum" : 56,
			"major" : "某某专业,某某专业",
			"includeClasses" : "一班,二班",
			"missionIsPass" : true
		}, {
			"id" : "id2",
			"classSemesters" : "2018-2019-第三学期",
			"teachingClassName" : "教学班名称",
			"coursesName" : "课程名字",
			"teachingClassNum" : 56,
			"major" : "某某专业,某某专业",
			"includeClasses" : "三班,四班",
			"missionIsPass" : false
		} ]
	};
	stuffTeachingClassTable(tableInfo);
}

// 重置检索
function allteachingClassAreaReSearch() {
	var className = $("#allteachingClass_className").val("");
	var coursesName = $("#allteachingClass_coursesName").val("");
	getAllTeachingClassInfo(false);
}

//教学班管理必选检索条件检查
function teachingClassTetNotNullSearchs(){
	var levelValue = getNormalSelectValue("classManagement_level");
	var departmentValue = getNormalSelectValue("classManagement_department");
	var gradeValue =getNormalSelectValue("classManagement_grade");
	var majorValue =getNormalSelectValue("classManagement_major");

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
	var levelText = getNormalSelectText("classManagement_level");
	var departmentText = getNormalSelectText("classManagement_department");
	var gradeText =getNormalSelectText("classManagement_grade");
	var majorText =getNormalSelectText("classManagement_major");
	
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

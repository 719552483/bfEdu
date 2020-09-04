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
		var nouNullSearch=getNotNullSearchs();
		var className = $("#AdministrationClassName").val();
		if(typeof nouNullSearch ==='undefined'){
			return;
		}
		className===""?nouNullSearch.className="":nouNullSearch.className=className;
		$.ajax({
			method : 'get',
			cache : false,
			url : "/searchAdministrationClass",
			data: {
				"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
				"SearchCriteria":JSON.stringify(nouNullSearch)
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
					dropConfigOption("#major");
					toastr.info(backjson.msg);
					stuffAdministrationClassTable(backjson.data);
				} else {
					drawAdministrationClassEmptyTable();
					toastr.warning(backjson.msg);
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
			exportDataType: "all",
			showExport: true,      //是否显示导出
			exportOptions:{
			    fileName: '行政班导出'  //文件名称
			},
			search : true,
			editable : false,
			striped : true,
			toolbar : '#toolbar',
			showColumns : true,
			onPageChange : function() {
				drawPagination(".administrationClassTableArea", "行政班信息");
			},
			columns : [ {
				field : 'check',
				checkbox : true
			},  {
				field : 'edu300_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
			},{
				field : 'pyccmc',
				title : '培养层次',
				align : 'left',
				formatter :paramsMatter
			}, {
				field : 'xbmc',
				title : '所属二级学院',
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
				field : 'xzbbh',
				title : '行政班班号',
				align : 'left',
				formatter : paramsMatter
			},
			{
				field : 'xzbdm',
				title : '行政班代码',
				align : 'left',
				formatter : paramsMatter
			},{
				field : 'xzbbm',
				title : '行政班编码',
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
					+ '<li class="queryBtn" id="administrationClassInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
					+ '<li class="modifyBtn" id="modifyAdministrationClass"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
					+ '<li class="deleteBtn" id="removeAdministrationClass"><span><img src="images/t03.png"></span>删除</li>'
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
		drawSearchInput(".administrationClassTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
		changeColumnsStyle(".administrationClassTableArea", "行政班信息");
		btnControl();
}

//查看行政班详情
function administrationClassInfo(row){
	$.showModal("#addAdministrationClassModal",false);
	$("#addAdministrationClassModal").find(".moadalTitle").html(row.pyccmc+'/'+row.xbmc+'/'+row.njmc+'/'+row.zymc+"-"+row.xzbmc);
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$(".myabeNoneTipBtn,.addAdministrationClass_classCodeArea,.addAdministrationClass_selfNumArea").hide();
	$(".addAdministrationClass_classCodeArea").show();
	$(".addAdministrationClassTip").find(".canNotModifythings").remove();
	stuffAdministrationClassDetails(row);
}

//填充行政班详情
function stuffAdministrationClassDetails(row){
//	actionStuffManiaSelectWithDeafult("#addAdministrationClass_campus",row.xqbm,row.xqmc);  //校区
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_level",row.pyccbm,row.pyccmc); //层次
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_department",row.xbbm,row.xbmc); //二级学院
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_garde",row.njbm,row.njmc); //年级
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_major",row.zybm,row.zymc); //专业
	$("#addAdministrationClass_classCode").val(row.xzbbh);
	$("#addAdministrationClass_className").val(row.xzbmc);
	$("#addAdministrationClass_houldNum").val(row.rnrs);
	$("#addAdministrationClass_selfNum").val(row.zdybjxh);
}

//预备修改行政班
function modifyAdministrationClass(row){
	if(row.sfsckkjh==="T"){
		toastr.warning('不能修改已生成开课计划的班级');
		return;
	}
	$.showModal("#addAdministrationClassModal",true);
	$("#addAdministrationClassModal").find(".moadalTitle").html(row.pyccmc+'/'+row.xbmc+'/'+row.njmc+'/'+row.zymc+"-"+row.xzbmc);
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	$(".myabeNoneTipBtn,.canNotModifythings").show();
	$(".addAdministrationClass_classCodeArea").hide();
	$(".addAdministrationClassTip").find("label:lt(5)").after('<samll class="canNotModifythings"><br />(不可改)</samll>');
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
	var NotNullSearchs=getNotNullSearchs();
//	newAdministrationClassObject.edu300_ID=row.edu300_ID;
//	newAdministrationClassObject.yxbz=row.yxbz;
//	newAdministrationClassObject.xzbbm=row.xzbbm;
	if(typeof NotNullSearchs ==='undefined'){
		return;
	}
	if ($("#addAdministrationClass_houldNum").val()!==""&&isNaN($("#addAdministrationClass_houldNum").val())) {
		toastr.warning('容纳人数只接受数字参数');
		return;
	}
	row.xzbmc=$("#addAdministrationClass_className").val();
	row.rnrs=$("#addAdministrationClass_houldNum").val();
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyAdministrationClass",
		data: {
             "modifyInfo":JSON.stringify(row),
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
				if(backjson.namehave){
					toastr.warning('班级名称已存在');
					return;
				}
				hideloding();
				$("#administrationClassTable").bootstrapTable('updateByUniqueId', {
					id: row.edu300_ID,
					row: row
				});
				$.hideModal("#addAdministrationClassModal");
				toolTipUp(".myTooltip");
				drawPagination(".administrationClassTableArea", "行政班信息");
				toastr.success('修改成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备添加行政班
function wantAddAdministrationClass(){
	$(".addAdministrationClassTip").find(".canNotModifythings").remove();
	emptyAdministrationClassDetailsArea();
	$(".canNotModifythings,.addAdministrationClass_classCodeArea").hide();
	$(".addAdministrationClass_selfNumArea").show();
	$("#addAdministrationClass_selfNum").val("");
	$.showModal("#addAdministrationClassModal",true);
	$("#addAdministrationClassModal").find(".moadalTitle").html("新增行政班");
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
				hideloding();
				if(backjson.namehave){
					toastr.warning('班级名称已存在');
					return;
				}
				if(backjson.numhave){
					toastr.warning('自定义班级序号已存在');
					return;
				}
				newAdministrationClassObject.edu300_ID=backjson.id;
				newAdministrationClassObject.xqmc=backjson.xqmc;
				newAdministrationClassObject.xqbm=backjson.xqbm;
				newAdministrationClassObject.yxbz=backjson.yxbz;
				newAdministrationClassObject.sfsckkjh=backjson.sfsckkjh;
				newAdministrationClassObject.xzbbh=backjson.xzbbh;
				newAdministrationClassObject.xzbdm=backjson.xzbdm;
				newAdministrationClassObject.xzbbm=backjson.xzbbm;

				$('#administrationClassTable').bootstrapTable("prepend", newAdministrationClassObject);
				$.hideModal("#addAdministrationClassModal");
				toolTipUp(".myTooltip");
				drawPagination(".administrationClassTableArea", "行政班信息");
				toastr.success('新增行政班成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取新增行政班信息
function getAdministrationClassDetails(){
//	if(getNormalSelectValue("addAdministrationClass_campus") === ""){
//		toastr.warning('校区不能为空');
//		return;
//	}
	if(getNormalSelectValue("addAdministrationClass_level") === ""){
		toastr.warning('层次不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_department") === ""){
		toastr.warning('二级学院不能为空');
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
	if($("#addAdministrationClass_selfNum").val() === ""){
		toastr.warning('自定义班级序号不能为空');
		return;
	}
	if(!checkIsNumber($("#addAdministrationClass_selfNum").val()) && $("#addAdministrationClass_selfNum").val()!==""){
		toastr.warning('自定义班级序号必须是数字');
		return;
	}
//	if($("#addAdministrationClass_classCode").val() === ""){
//		toastr.warning('班号不能为空');
//		return;
//	}
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
//	newClassObject.xzbbh=$("#addAdministrationClass_classCode").val();
	newClassObject.pyccmc=getNormalSelectText("addAdministrationClass_level");
	newClassObject.pyccbm=getNormalSelectValue("addAdministrationClass_level");
	newClassObject.xbmc=getNormalSelectText("addAdministrationClass_department");
	newClassObject.xbbm=getNormalSelectValue("addAdministrationClass_department");
	newClassObject.njbm=getNormalSelectValue("addAdministrationClass_garde");
	newClassObject.njmc=getNormalSelectText("addAdministrationClass_garde");
	newClassObject.zybm=getNormalSelectValue("addAdministrationClass_major");
	newClassObject.zymc=getNormalSelectText("addAdministrationClass_major");
	newClassObject.zdybjxh=$("#addAdministrationClass_selfNum").val();
//	newClassObject.xqmc=getNormalSelectText("addAdministrationClass_campus");
//	newClassObject.xqbm=getNormalSelectValue("addAdministrationClass_campus");
	newClassObject.zxrs=0;
	$("#addAdministrationClass_houldNum").val()===""?newClassObject.rnrs=0:newClassObject.rnrs=parseInt($("#addAdministrationClass_houldNum").val());
	return newClassObject;
}

//重新渲染新增行政班区域
function emptyAdministrationClassDetailsArea(){
	stuffEJDElement(EJDMElementInfo); //校区
	LinkageSelectPublic("#addAdministrationClass_level","#addAdministrationClass_department","#addAdministrationClass_garde","#addAdministrationClass_major"); //联动select
	var reObject = new Object();
	reObject.InputIds = "#addAdministrationClass_className,#addAdministrationClass_houldNum";
	reObject.actionSelectIds = "#addAdministrationClass_department,#addAdministrationClass_garde,#addAdministrationClass_major";
	reReloadSearchsWithSelect(reObject);
}

//单个删除行政班
function removeAdministrationClass(row){
	if(row.sfsckkjh==="T"){
		toastr.warning('不能删除已生成开课计划的班级');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("行政班 -"+row.xzbmc);
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
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
		}else if(chosenclasses[i].sfsckkjh==="T"){

		}
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("已选行政班");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
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
				hideloding();
				tableRemoveAction("#administrationClassTable", removeArray, ".administrationClassTableArea", "行政班信息");
				$.hideModal("#remindModal");
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
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
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
			hideloding();
			if (backjson.code === 200) {
				toastr.info(backjson.msg);
				stuffAdministrationClassTable(backjson.data);
			} else {
				drawAdministrationClassEmptyTable();
				toastr.warning(backjson.msg);
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
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
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
						drawClassManagementEmptyTable();
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
			generateClassName(row,index,true);
		},
		'click #editorClassName' : function(e, value, row, index) {
			editorClassName(row,index);
		},
		'click #cancelGenerateClassName' : function(e, value, row, index) {
			cancelGenerateClassName(row,index);
		}
	};

	$('#classManagementTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize :10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
		    fileName: '教学班管理导出'  //文件名称
		},
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onDblClickRow : function(row, $element, field) {
			if(field==="jxbmc"){
				editorClassName(row,parseInt($element[0].dataset.index));
			}
		},
		onPageChange : function() {
			drawPagination(".classManagementTableArea", "行政班信息");
		},
		columns : [ {
			field : 'check',
			checkbox : true
		},{
			field : 'edu300_ID',
			title: '唯一标识',
			align : 'center',
			visible : false
		}, {
			field : 'zymc',
			title : '专业',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xzbmc',
			title : '行政班名称',
			align : 'left',
			formatter : paramsMatter
		},{
			field : 'zxrs',
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
		if(row.zxrs!==0&&typeof row.jxbmc!=="undefined"&&row.jxbmc!==""){
			return [ '<ul class="toolbar tabletoolbar">'
						+ '<li id="generateClassName"><span><img src="img/info.png" style="width:24px"></span>生成教学班名称</li>'
						+ '<li id="editorClassName"><span><img src="images/t02.png" style="width:24px"></span>编辑教学班名称</li>'
						+ '<li id="cancelGenerateClassName" class="cancelGenerateClassName'+index+'"><span><img src="images/t02.png" style="width:24px"></span>取消生成教学班</li>'
						+ '</ul>' ].join('');
		}else{
			return [ '<ul class="toolbar tabletoolbar">'
						+ '<li id="generateClassName"><span><img src="img/info.png" style="width:24px"></span>生成教学班名称</li>'
						+ '<li id="editorClassName"><span><img src="images/t02.png" style="width:24px"></span>编辑教学班名称</li>'
						+ '</ul>' ].join('');
		}

	}

	function TeachingClassHoldNumFormatter(value, row, index) {
		if (typeof value!=="undefined"&&value!=="") {
			return [ '<div class="haveTextBg myTooltip" title="' + value
					+ '"><span>' + value + '</span></div>' ].join('');
		} else {
			return [ '' ].join('');
		}
	}

	function TeachingClassHoldNameFormatter(value, row, index) {
		if (typeof value!=="undefined") {
			return [ '<div class="haveTextBg myTooltip" title="' + value
					+ '"><span class="teachingClassHoldName teachingClassHoldName'+index+'">' + value + '</span><input type="text" class="breakClassTableInput tableInput noneStart" id="teachingClassHoldName'+index+'"></div>' ].join('');
		} else {
			return [ '<div><span class="teachingClassHoldName teachingClassHoldName'+index+'"></span><input type="text" class="breakClassTableInput tableInput noneStart" id="teachingClassHoldName'+index+'"></div>' ].join('');
		}
	}
	drawPagination(".classManagementTableArea", "行政班信息");
	drawSearchInput(".classManagementTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip")
	changeColumnsStyle(".classManagementTableArea", "行政班信息");
}

//生成教学班名称
function generateClassName(row,index,showToastr){
	if(row.zxrs>row.rnrs&&row.rnrs>0){
		if(showToastr){
			toastr.warning('行政班在读人数大于容纳人数');
		}
		return;
	}

	if( row.zxrs===0){
		if(showToastr){
			toastr.warning('行政班 -'+row.xzbmc+' 暂无学生');
		}
		return;
	}

	$("#classManagementTable").bootstrapTable('updateCell', {
		index : index,
		field : 'jxbmc',
		value : '教-('+row.xzbmc+')'
	});
	$("#classManagementTable").bootstrapTable('updateCell', {
		index : index,
		field : 'jxbrs',
		value : row.zxrs
	});
    toolTipUp(".myTooltip");
}

//取消生成教学班名称
function cancelGenerateClassName(row,index){
	$("#classManagementTable").bootstrapTable('updateCell', {
		index : index,
		field : 'jxbmc',
		value : ""
	});
	$("#classManagementTable").bootstrapTable('updateCell', {
		index : index,
		field : 'jxbrs',
		value : ""
	});
    toolTipUp(".myTooltip");
}

//编辑教学班名称
function editorClassName(row,index){
	if( row.jxbmc===""||typeof row.jxbmc==="undefined"){
		toastr.warning('请先生成教学班名称');
		return;
	}
	$(".tableInput").hide();
	$(".teachingClassHoldName").show();
	$(".teachingClassHoldName"+index).hide();
	$("#teachingClassHoldName"+index).show().val(row.jxbmc).focus();
	//绑定input失焦更新值事件
	$("#teachingClassHoldName" + index).blur(function() {
		if (row.jxbmc !== $("#teachingClassHoldName" + index).val()) {
			$("#classManagementTable").bootstrapTable('updateCell', {
				index: index,
				field: 'jxbmc',
				value: $("#teachingClassHoldName" + index).val()
			});
		} else {
			$("#classManagementTable").bootstrapTable('updateCell', {
				index: index,
				field: 'jxbmc',
				value: row.jxbmc
			});
		}
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
		generateClassName(choosedTeachingClass[i],i,false);
	}
	toolTipUp(".myTooltip");
}

//保存教学班
function saveTeachingClass() {
	var allClass = $("#classManagementTable").bootstrapTable("getData");

	var noGeneratedNum=0
	for (var i = 0; i < allClass.length; i++) {
		if((allClass[i].jxbrs===""||typeof allClass[i].jxbrs==="undefined")||(allClass[i].jxbmc===""||typeof allClass[i].jxbmc==="undefined")
			){
			noGeneratedNum++;
		}
	}

	if(noGeneratedNum===allClass.length){
		toastr.warning('暂未生成教学班');
		return;
	}

	var choosedTeachingArray = new Array();
	for (var i = 0; i < allClass.length; i++) {
		if((allClass[i].jxbrs!==""&&typeof allClass[i].jxbrs!=="undefined")&&(allClass[i].jxbmc!==""&&typeof allClass[i].jxbmc!=="undefined")){
			var choosedTeaching = new Object();
			choosedTeaching.pyccmc=allClass[i].pyccmc;
			choosedTeaching.pyccbm=allClass[i].pyccbm;
			choosedTeaching.xbmc=allClass[i].xbmc;
			choosedTeaching.xbbm=allClass[i].xbbm;
			choosedTeaching.njmc=allClass[i].njmc;
			choosedTeaching.njbm=allClass[i].njbm;
			choosedTeaching.zymc=allClass[i].zymc;
			choosedTeaching.zybm=allClass[i].zybm;
			choosedTeaching.jxbmc=allClass[i].xzbmc;
			choosedTeaching.jxbrs=allClass[i].jxbrs;
			choosedTeaching.bhzymc=allClass[i].zymc;
			choosedTeaching.bhzyCode=allClass[i].zybm;
			choosedTeaching.bhxzbid=allClass[i].edu300_ID;
			choosedTeaching.bhxzbmc=allClass[i].xzbmc;
			choosedTeachingArray.push(choosedTeaching);
		}
	}
	verifySaveClass(choosedTeachingArray);
}

//保存教学班
function verifySaveClass(choosedTeaching) {
	confirmClassAction(choosedTeaching);
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

	var   jxbmc="(合)";  //教学班名称
	var combinedClassStudentNum=0;
	var   njbm =new Array();//年级编码
	var   njmc=new Array();//年级名称
	var   zybm=new Array();//专业编码
	var   zymc=new Array();//专业名称
	var  bhzyCode=new Array();  //包含的专业编码
	var  bhzymc=new Array();  //包含的专业名称
	var  bhxzbid=new Array();  //包含的行政班Id
	var  bhxzbmc=new Array();  //包含的行政班名称
	for (var i = 0; i < choosedTeachingClass.length; i++) {
		jxbmc+=choosedTeachingClass[i].xzbmc+"+";
		njbm.push(choosedTeachingClass[i].njbm);
		njmc.push(choosedTeachingClass[i].njmc);
		zybm.push(choosedTeachingClass[i].zybm);
		zymc.push(choosedTeachingClass[i].zymc);
		bhzyCode.push(choosedTeachingClass[i].zybm);
		bhzymc.push(choosedTeachingClass[i].zymc);
		bhxzbid.push(choosedTeachingClass[i].edu300_ID);
		bhxzbmc.push(choosedTeachingClass[i].xzbmc);
		combinedClassStudentNum+=choosedTeachingClass[i].zxrs;
	}

	var combinedClassObject=new Object();
	combinedClassObject.jxbmc=jxbmc.substring(0,jxbmc.length-1);
	combinedClassObject.jxbrs=combinedClassStudentNum;
	combinedClassObject.pyccmc=choosedTeachingClass[0].pyccmc;
	combinedClassObject.pyccbm=choosedTeachingClass[0].pyccbm;
	combinedClassObject.xbmc=choosedTeachingClass[0].xbmc;
	combinedClassObject.xbbm=choosedTeachingClass[0].xbbm;
	combinedClassObject.njmc=njmc.toString();
	combinedClassObject.njbm=njbm.toString();
	combinedClassObject.zymc=zymc.toString();
	combinedClassObject.zybm=zybm.toString();
	combinedClassObject.bhzymc=bhzymc.toString();
	combinedClassObject.bhzyCode=bhzyCode.toString();
	combinedClassObject.bhxzbid=bhxzbid.toString();
	combinedClassObject.bhxzbmc=bhxzbmc.toString();

	var sendArray=new Array();
	sendArray.push(combinedClassObject);
	$("#combinedClassName").val(combinedClassObject.jxbmc);
	$("#combinedClassHoldStudentNum").val(combinedClassStudentNum);
	$.showModal("#combinedClassModal",true);
	// 确定按钮
	$('#confirmCombinedClass').unbind('click');
	$('#confirmCombinedClass').bind('click', function(e) {
		verifyCombinedClass(sendArray);
		e.stopPropagation();
	});
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

	choosedTeaching.jxbmc = $("#combinedClassName").val();
	confirmClassAction(choosedTeaching);
}

// 确认行政班操作
function confirmClassAction(choosedTeaching) {

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
			hideloding();
			if (backjson.code === 200) {
				toastr.success(backjson.msg);
				$('#classManagementTable').bootstrapTable('uncheckAll');
				$.hideModal();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 教学班管理检索
function generatTeachingClassStartSearch(tableInfo) {
	var notNullSearchs=teachingClassTetNotNullSearchs();
	if(typeof notNullSearchs ==='undefined'){
		return;
	}
	notNullSearchs.className=$("#classManagement_className").val();

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClass",
		data: {
			 "userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
             "SearchCriteria":JSON.stringify(notNullSearchs)
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
				stuffClassManagementTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});

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
	reObject.InputIds = "#classManagement_className,#classManagement_coursesName";
	reObject.actionSelectIds = "#classManagement_department,#classManagement_grade,#classManagement_major";
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

	// 教学班导出点名表
	$('#exportRollcallTable').unbind('click');
	$('#exportRollcallTable').bind('click', function(e) {
		exportRollcallTable();
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
}

/*教学班管理start*/
// 获取教学班列表信息
function getAllTeachingClassInfo(isReturnLastPage) {
	var notNullSearchs=teachingClassTetNotNullSearchs();
	if(typeof notNullSearchs ==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllTeachingClasses2",
		data:{
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
				stuffTeachingClassTable(backjson.data);
				if (isReturnLastPage) {
					changeClassManagementShowArea();
					addTeachingClassBtnbind();
				}
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

// 填充教学班列表
function stuffTeachingClassTable(tableInfo) {
	window.teachingClassEvents = {
		'click #modifyTeachingClassName' : function(e, value, row, index) {
			modifyTeachingClass(row, index);
		},
		'click #removeTeachingClass' : function(e, value, row, index) {
			removeTeachingClass(row);
		}
	};

	$('#teachingClassTable').bootstrapTable('destroy').bootstrapTable({
		data :tableInfo,
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
		    fileName: '教学班导出'  //文件名称
		},
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".teachingClassTableArea", "教学班信息");
		},
		columns : [ {
			field : 'check',
			checkbox : true
		},{
			field : 'jxbmc',
			title : '教学班名称',
			align : 'left',
			clickToSelect : false,
			formatter : paramsMatter,
		},{
			field : 'bhzymc',
			title : '专业',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'bhxzbmc',
			title : '班级',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'jxbrs',
			title : '教学班人数',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : teachingClassFormatter,
			events : teachingClassEvents,
		} ]
	});

	function teachingClassFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li id="modifyTeachingClassName"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
		+ '<li id="removeTeachingClass"><span><img src="images/t03.png"></span>删除</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".teachingClassTableArea", "教学班信息");
	changeColumnsStyle(".teachingClassTableArea", "教学班信息");
	drawSearchInput(".teachingClassTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

// 修改教学班
function modifyTeachingClass(row, index) {
	var sendArray=new Array();
	sendArray.push(row.edu301_ID);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkTeachingClassInTask",
		data: {
			"classIds":JSON.stringify(sendArray)
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
				$.showModal("#modifyTeachingClassModal",true);
				$('#newNAME').html(row.jxbmc);
				stuffChoosendXzb(row,index);
				stuffAllXzb(row,index);
				// 同专业班级库
				$('#modify_sameGrade').unbind('click');
				$('#modify_sameGrade').bind('click', function(e) {
					modifysameGrade(row);
					e.stopPropagation();
				});

				// 非同专业班级库
				$('#modify_notSameGrade').unbind('click');
				$('#modify_notSameGrade').bind('click', function(e) {
					modifynotSameGrade(row);
					e.stopPropagation();
				});

				//确认按钮
				$('.confirmModifyTeachingClass').unbind('click');
				$('.confirmModifyTeachingClass').bind('click', function(e) {
					confirmModifyTeachingClass(row);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

// 单个删除教学班
function removeTeachingClass(row) {
	var sendArray=new Array();
	sendArray.push(row.edu301_ID);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkTeachingClassInTask",
		data: {
			"classIds":JSON.stringify(sendArray)
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
				$.showModal("#remindModal",true);
				$(".remindType").html("教学班");
				$(".remindActionType").html("删除");
				$('.confirmRemind').unbind('click');
				$('.confirmRemind').bind('click',function(e) {
					var removeArray = new Array;
					removeArray.push(row.edu301_ID);
					sendTeachingClassRemoveInfo(removeArray);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

// 批量删除教学班
function removeTeachingClasses() {
	var chosenTeachingClasses = $('#teachingClassTable').bootstrapTable('getAllSelections');
	if (chosenTeachingClasses.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}

	var sendArray=new Array();
	for (var i = 0; i < chosenTeachingClasses.length; i++) {
		sendArray.push(chosenTeachingClasses[i].edu301_ID);
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkTeachingClassInTask",
		data: {
			"classIds":JSON.stringify(sendArray)
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
				$.showModal("#remindModal",true);
				$(".remindType").html("教学班");
				$(".remindActionType").html("删除");
				$('.confirmRemind').unbind('click');
				$('.confirmRemind').bind('click',function(e) {
					var removeArray = new Array;
					for (var i = 0; i < chosenTeachingClasses.length; i++) {
						removeArray.push(chosenTeachingClasses[i].edu301_ID);
					}
					sendTeachingClassRemoveInfo(removeArray);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//发送删除教学班请求
function sendTeachingClassRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeTeachingClass",
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
				tableRemoveAction("#teachingClassTable", removeArray, ".teachingClassTableArea", "教学班信息");
				$.hideModal("#remindModal");
				$(".myTooltip").tooltipify();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
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
	var searchObject = new Object();
	searchObject.className=className;
	searchObject.coursesName=coursesName;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeachingClass",
		data: {
             "SearchCriteria":JSON.stringify(searchObject)
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
				stuffTeachingClassTable(backjson.tableInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 重置检索
function allteachingClassAreaReSearch() {
	var reObject = new Object();
	reObject.InputIds = "#allteachingClass_className,#allteachingClass_coursesName";
	reReloadSearchsWithSelect(reObject);
	getAllTeachingClassInfo(false);
}

//教学班管理必选检索条件检查
function teachingClassTetNotNullSearchs(){
	var levelValue = getNormalSelectValue("classManagement_level");
	var departmentValue = getNormalSelectValue("classManagement_department");
	var gradeValue =getNormalSelectValue("classManagement_grade");
	var majorValue =getNormalSelectValue("classManagement_major");
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

//渲染可选班级
function stuffAllXzb(row,index){
	getAllXzbByZy(row,index);
}

//渲染已选的行政班
function stuffChoosendXzb(row){
	$(".chooseendArea").empty();
	var bhxzbmc=row.bhxzbmc.split(",");
	var bhxzb=row.bhxzbid.split(",");
	var str='<span class="soprtAreaTitle">已选班级:</span>';
	for (var i = 0; i < bhxzb.length; i++) {
		if(bhxzb[i]!==""){
			str+='<div class="col1 giveBottom">' +
				'<div class="icheck-material-blue"> ' +
				'<input type="checkbox" class="controlBtn" id="'+bhxzb[i]+'" checked="true"> ' +
				'<label for="'+bhxzb[i]+'">'+bhxzbmc[i]+'</label>' +
				'</div>' +
				'</div>';
		}
	}
	$(".chooseendArea").append(str);
	// 判断
	$('.controlBtn').unbind('click');
	$('.controlBtn').bind('click', function(e) {
		judgAddOrRemove(e);
	});
}

//判断穿梭框的新增或删除
function judgAddOrRemove(eve){
	var parentClass=eve.currentTarget.parentElement.parentElement.parentElement.classList[0];
	if(parentClass==="chooseLibirary"){
		removeLibiraryClass(eve);
		addChoosendClass(eve);
	}else{
		removeChoosendClass(eve);
		addLibiraryClass(eve);
	}
	$(".norsArea").hide();
	// 判断
	$('.controlBtn').unbind('click');
	$('.controlBtn').bind('click', function(e) {
		judgAddOrRemove(e);
	});
}

//添加已选班级
function  addChoosendClass(eve){
	$(".chooseendArea").append(eve.currentTarget.parentElement.parentElement.outerHTML);
}

//删除已选班级
function  removeChoosendClass(eve){
	var removeId=eve.currentTarget.attributes[2].nodeValue;
	var allChoosend=$(".chooseendArea").find(".col1");
	for (var i = 0; i < allChoosend.length; i++) {
		if(allChoosend[i].childNodes[0].children[0].id===removeId){
			$(".chooseendArea").find('.col1:eq('+i+')').remove();
		}
	}
}

//添加可选班级
function addLibiraryClass(eve){
	$(".chooseLibirary").append(eve.currentTarget.parentElement.parentElement.outerHTML);
}

//删除可选班级
function  removeLibiraryClass(eve){
	var removeId=eve.currentTarget.attributes[2].nodeValue;
	var allLibirary=$(".chooseLibirary").find(".col1");
	for (var i = 0; i < allLibirary.length; i++) {
		if(allLibirary[i].childNodes[0].children[0].id===removeId){
			$(".chooseLibirary").find('.col1:eq('+i+')').remove();
		}
	}
}

//同专业班级库
function modifysameGrade(row){
	var currentChecked=$("#modify_sameGrade")[0].checked;
	if(currentChecked){
		$("#modify_notSameGrade").attr("checked", false);
	}
	getAllClassesLibraryforModify(true,row);
}

//非同专业班级库
function modifynotSameGrade(row){
	var currentChecked=$("#modify_notSameGrade")[0].checked;
	if(currentChecked){
		$("#modify_sameGrade").attr("checked", false);
	}
	getAllClassesLibraryforModify(false,row);
}

//判断类型
function getAllClassesLibraryforModify(jsutUnqine,row){
	if(jsutUnqine){
		getAllXzbByZy(row);
	}else{
		getAllXzb(row);
	}
}

//获取同专业行政班
function getAllXzbByZy(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/findClassByMajor",
		data: {
			"edu301_ID":JSON.stringify(row.edu301_ID)
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
				if(backjson.classList.length===0){
					toastr.info('暂无可选行政班');
					return;
				}
				$(".chooseLibirary").empty();
				var xzbInfo=backjson.classList;
				var bhxzb=row.bhxzbid.split(",");
				var str='<span class="soprtAreaTitle">可选班级:</span>';
				var addNum=0;
				for (var i = 0; i < xzbInfo.length; i++) {
					if(bhxzb.indexOf(JSON.stringify(xzbInfo[i].edu300_ID))===-1){
						str+='<div class="col1 giveBottom">' +
							'<div class="icheck-material-blue"> ' +
							'<input type="checkbox" class="controlBtn" id="'+xzbInfo[i].edu300_ID+'" checked="false"> ' +
							'<label for="'+xzbInfo[i].edu300_ID+'">'+xzbInfo[i].xzbmc+'</label>' +
							'</div>' +
							'</div>';
						addNum++;
					}
				}
				if(addNum==0){
					str+='<span class="norsArea">暂无可选行政班...</span>';
				}
				$(".chooseLibirary").append(str);
				// 判断
				$('.controlBtn').unbind('click');
				$('.controlBtn').bind('click', function(e) {
					judgAddOrRemove(e);
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取所有行政班
function getAllXzb(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/findAllClass",
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
				if(backjson.classList.length===0){
					toastr.info('暂无可选行政班');
					return;
				}

				$(".chooseLibirary").empty();
				var xzbInfo=backjson.classList;
				var bhxzb=row.bhxzbid.split(",");
				var str='<span class="soprtAreaTitle">可选班级:</span>';
				var addNum=0;
				for (var i = 0; i < xzbInfo.length; i++) {
					if(bhxzb.indexOf(JSON.stringify(xzbInfo[i].edu300_ID))===-1){
						str+='<div class="col1 giveBottom">' +
							'<div class="icheck-material-blue"> ' +
							'<input type="checkbox" class="controlBtn" id="'+xzbInfo[i].edu300_ID+'" checked="false"> ' +
							'<label for="'+xzbInfo[i].edu300_ID+'">'+xzbInfo[i].xzbmc+'</label>' +
							'</div>' +
							'</div>';
						addNum++;
					}
				}
				if(addNum==0){
					str+='<span class="norsArea">暂无可选行政班...</span>';
				}
				$(".chooseLibirary").append(str);
				// 判断
				$('.controlBtn').unbind('click');
				$('.controlBtn').bind('click', function(e) {
					judgAddOrRemove(e);
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认修改教学班
function confirmModifyTeachingClass(row){
	$.hideModal("#modifyTeachingClassModal");

	var ids = $('.chooseendArea').find('input');
	var names = $('.chooseendArea').find('label');
	var bhxzbmc = ''; //包含行政班名称
	var bhxzbCode  = ''; //包含行政班编码

	for (var i = 0; i < ids.length; i++) {
		bhxzbmc+=names[i].innerText+',';
		bhxzbCode+=ids[i].id+',';
	}

    var modifyInfo=new Object();
	modifyInfo.combinedClassName=$('#newNAME').val();
	row.bhxzbmc=bhxzbmc;
	row.bhxzbid=bhxzbCode;

	var SendArray=new Array(row);
	SendArray.push()
	$.ajax({
		method : 'get',
		cache : false,
		url : "/confirmClassAction",
		data: {
			"classInfo":JSON.stringify(SendArray)
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
				for (var i = 0; i < backjson.data.length; i++) {
					$("#teachingClassTable").bootstrapTable('updateByUniqueId', {
						id: backjson.data[i].edu301_ID,
						row: backjson.data[i]
					});
				}
				toolTipUp(".myTooltip");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//教学班导出点名表
function exportRollcallTable(){
	var choosedClass = $("#teachingClassTable").bootstrapTable("getSelections");
	if(choosedClass.length===0){
		toastr.warning('暂未选择教学班');
		return;
	}
	var sendArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		sendArray.push(choosedClass[i].edu301_ID);
	}

	var url = "/exportRollcallExcel";
	var sendArray = JSON.stringify(sendArray) ;
	var form = $("<form></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "edu301Ids").attr("value", sendArray));
	form.appendTo('body').submit().remove();
}
/*教学班管理end*/
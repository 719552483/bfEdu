var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	drawMajorTrainingEmptyTable();
	getMajorTrainingSelectInfo();
	binBind();
	$("input[type='number']").inputSpinner();
});

// 获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryCulturePlanCouses",
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
					if(backjson.couserInfo.length===0){
						toastr.info('暂无培养计划');
					}
					stuffMajorTrainingTable(backjson.couserInfo);
					
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

// 渲染空专业培养计划表格
function drawMajorTrainingEmptyTable() {
	stuffMajorTrainingTable({});
}

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
		onPageChange : function() {
			drawPagination(".majorTrainingTableArea", "培养计划");
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
			field : 'xbsp',
			title : '系部审批',
			align : 'center',
			formatter :approvalMatter
		}, {
			field : 'kcmc',
			title : '课程名称',
			align : 'left',
			formatter : calssNameMatter
		},{
			field : 'skxq',
			title : '授课学期',
			align : 'left',
			formatter : skxqMatter
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



	drawPagination(".majorTrainingTableArea", "培养计划");
	drawSearchInput(".majorTrainingTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".majorTrainingTableArea", "培养计划");
	btnControl();
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
	if(row.xbsp==="passing"){
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
	var culturePlanInfo=getNotNullSearchs();
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
		     "culturePlanInfo":JSON.stringify(culturePlanInfo) ,
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
			if (backjson.result) {
				hideloding();
				crouseModifyInfo.xbsp="noStatus";
				$("#majorTrainingTable").bootstrapTable('updateByUniqueId', {
					id : row.edu108_ID,
					row : crouseModifyInfo
				});
				toolTipUp(".myTooltip");
				$.hideModal("#majorTrainingModal");
				drawPagination(".majorTrainingTableArea", "培养计划");
			} else {
				toastr.warning('操作失败，请重试');
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
	
	if($("#majorTrainingDetails_teachingTerm").val()==null){
		toastr.warning('请选择授课学期');
		return;
	}

	var crouseInfoObject=new Object();
	crouseInfoObject.edu108_ID=row.edu108_ID;
	crouseInfoObject.edu107_ID=row.edu107_ID;
	crouseInfoObject.edu200_ID=row.edu200_ID;
	crouseInfoObject.kcmc=$("#majorTrainingDetails_coursesName").val();
	crouseInfoObject.kcdm=$("#majorTrainingDetails_code").val();
	crouseInfoObject.ywmc=$("#majorTrainingDetails_enName").val();
	crouseInfoObject.zxs=$("#majorTrainingDetails_allhours").val();
	crouseInfoObject.xf=$("#majorTrainingDetails_credits").val();
	crouseInfoObject.llxs=$("#majorTrainingDetails_theoryHours").val();
	crouseInfoObject.sjxs=$("#majorTrainingDetails_practiceHours").val();
	crouseInfoObject.fsxs=$("#majorTrainingDetails_disperseHours").val();
	crouseInfoObject.jzxs=$("#majorTrainingDetails_centralizedHours").val();
	crouseInfoObject.skxq=JSON.stringify($("#majorTrainingDetails_teachingTerm").val());
	crouseInfoObject.zhouxs=$("#majorTrainingDetails_weekHours").val();
	crouseInfoObject.zzs=$("#majorTrainingDetails_weekCounts").val();
	crouseInfoObject.kclx=getNormalSelectText("majorTrainingDetails_classType");
	crouseInfoObject.kclxCode=getNormalSelectValue("majorTrainingDetails_classType");
	crouseInfoObject.kcxz=getNormalSelectText("majorTrainingDetails_coursesNature");
	crouseInfoObject.kcxzCode=getNormalSelectValue("majorTrainingDetails_coursesNature");
	crouseInfoObject.ksfs=getNormalSelectText("majorTrainingDetails_testWay");
	crouseInfoObject.ksfsCode=getNormalSelectValue("majorTrainingDetails_testWay");
	crouseInfoObject.kkbm=getNormalSelectText("majorTrainingDetails_startDepartment");
	crouseInfoObject.kkbmCode=getNormalSelectValue("majorTrainingDetails_startDepartment");
	crouseInfoObject.skdd=getNormalSelectValue("majorTrainingDetails_calssPlace");
	crouseInfoObject.mklb=getNormalSelectValue("majorTrainingDetails_moduleCategory");
	crouseInfoObject.kcsx=getNormalSelectValue("majorTrainingDetails_classQuality");
	crouseInfoObject.fkyj=$("#majorTrainingDetails_feedback").val();
	crouseInfoObject.qzz=$("#majorTrainingDetails_startEndWeek").val(); 
	crouseInfoObject.pkyq=getNormalSelectValue("majorTrainingDetails_scheduleClassesRequire");
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
	crouseInfoObject.xbsp=row.xbsp;
	return crouseInfoObject;
}

// 单个删除培养计划
function removeMajorTraining(row) {
	if(row.sfsckkjh==="T"){
		toastr.warning('不能修改已生成开课计划的课程');
		return;
	}
	if(row.xbsp==="passing"){
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
	var chosenCrouse = $('#majorTrainingTable').bootstrapTable('getAllSelections');
	if (chosenCrouse.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}
	for (var i = 0; i < chosenCrouse.length; i++) {
		if(chosenCrouse[i].sfsckkjh==="T"){
			toastr.warning('不能删除已生成开课计划的课程');
			return;
		}
		if(chosenCrouse[i].xbsp==="passing"){
			toastr.warning('有培养计划暂不可进行此操作');
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
	var nouNullSearch=getNotNullSearchs();
	$("#majorTrainingDetails_teachingTerm").multiSelect(); 
	$("#majorTrainingDetails_code").val(row.kcdm);
	$("#majorTrainingDetails_coursesName").val(row.kcmc);
	$("#majorTrainingDetails_enName").val(row.ywmc);
	$("#majorTrainingDetails_allhours").val(row.zxs);
	$("#majorTrainingDetails_credits").val(row.xf);
	$("#majorTrainingDetails_theoryHours").val(row.llxs);
	$("#majorTrainingDetails_practiceHours").val(row.sjxs);
	$("#majorTrainingDetails_disperseHours").val(row.fsxs);
	$("#majorTrainingDetails_centralizedHours").val(row.jzxs);
	multiSelectWithDefault("#majorTrainingDetails_teachingTerm",JSON.parse(row.skxq)); //授课学期
	$("#majorTrainingDetails_weekHours").val(row.zhouxs);
	$("#majorTrainingDetails_weekCounts").val(row.zzs);
	stuffManiaSelectWithDeafult("#majorTrainingDetails_classType", row.kclxCode);  //课程类型
	stuffManiaSelectWithDeafult("#majorTrainingDetails_coursesNature", row.kcxzCode);  //课程性质
	stuffManiaSelectWithDeafult("#majorTrainingDetails_testWay", row.ksfsCode);  //课程性质
	stuffManiaSelectWithDeafult("#majorTrainingDetails_startDepartment", row.kkbmCode);  //开课部门
	stuffManiaSelectWithDeafult("#majorTrainingDetails_calssPlace", row.skdd);  //授课地点
	stuffManiaSelectWithDeafult("#majorTrainingDetails_moduleCategory", row.mklb);  //模块类别
	stuffManiaSelectWithDeafult("#majorTrainingDetails_classQuality", row.kcsx);  //模块类别
	$("#majorTrainingDetails_feedback").val(row.fkyj);
	$("#majorTrainingDetails_startEndWeek").val(row.qzz);
	stuffManiaSelectWithDeafult("#majorTrainingDetails_scheduleClassesRequire", row.pkyq);  //排课要求
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
	$("#majorTrainingModal").find(".moadalTitle").html(nouNullSearch.levelTxt+'/'+nouNullSearch.departmentTxt+'/'+nouNullSearch.gradeTxt+'/'+nouNullSearch.majorTxt+"-"+row.kcmc);
	$.showModal("#majorTrainingModal",showFooter);
}

// 开始检索按钮
function startSearch() {
	var nouNullSearch=getNotNullSearchs();
	var coursesNature = getNormalSelectValue("coursesNature");
	var coursesName = $("#coursesName").val();
	var testWay = getNormalSelectValue("testWay");
	var suditStatus = getNormalSelectValue("suditStatus");
	if(typeof nouNullSearch ==='undefined'){
		return;
	}
	var serachObject=new Object();
	serachObject.level=nouNullSearch.level;
	serachObject.department=nouNullSearch.department;
	serachObject.grade=nouNullSearch.grade;
	serachObject.major=nouNullSearch.major;
	coursesNature===""?serachObject.coursesNature="":serachObject.coursesNature=coursesNature;
	coursesName===""?serachObject.coursesName="":serachObject.coursesName=coursesName;
	testWay===""?serachObject.testWay="":serachObject.testWay=testWay;
	suditStatus===""?serachObject.suditStatus="":serachObject.suditStatus=suditStatus;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/culturePlanSeacchCrouse",
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
				if(backjson.crouseInfo.length===0){
					toastr.warning('暂无数据');
					drawMajorTrainingEmptyTable();
					return;
				}
				stuffMajorTrainingTable(backjson.crouseInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//重置检索
function reReloadSearchs() {
	var reObject = new Object();
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.InputIds = "#coursesName";
	reObject.normalSelectIds = "#coursesNature,#suditStatus,#testWay,#coursesSemester";
	reObject.actionSelectIds = "#department,#grade,#major";
	reReloadSearchsWithSelect(reObject);
	drawMajorTrainingEmptyTable();
}

// 预备添加专业课程
function wantAddClass() {
	var searchs = getNotNullSearchs();
	if (typeof (searchs) != "undefined") {
		getAllClassInfo(searchs.levelTxt, searchs.departmentTxt, searchs.gradeTxt,
				searchs.majorTxt);
		$("#classBaseInfo_classSemesters").multiSelect();
	}
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

// 获取课程库列表
function getAllClassInfo(level, department, grade, major) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllPassCrouse",
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
				if(backjson.allCrouse.length===0){
					toastr.warning('课程库暂无课程');
					return;
				}
				$(".currentMajorName").html(
						level + '  ' + department + '  ' + grade + '  ' + major);
				var selectInfo = "";
				stuffAllClassTable(backjson.allCrouse);
				addClassAreaBtnbind();
				$(".addClassArea").show();
				$(".culturePlanArea").hide();
			} else {
				toastr.warning('操作失败，请重试');
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
	
	var allHaveCrouse = $("#majorTrainingTable").bootstrapTable("getData");
	for (var i = 0; i < allHaveCrouse.length; i++) {
		if(currentchoosedCroese[0].bf200_ID===allHaveCrouse[i].edu200_ID){
			toastr.warning('专业课程已存在');
			return;
		}
	}
	
	var culturePlanInfo=getNotNullSearchs();
	var crouseInfo=getNewCulturePlanInfo(currentchoosedCroese[0].bf200_ID);
	var approvalInfo=getApprovalobect();
	if(typeof crouseInfo ==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/culturePlanAddCrouse",
		data: {
            "culturePlanInfo":JSON.stringify(culturePlanInfo) ,
            "crouseInfo":JSON.stringify(crouseInfo),
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
			if (backjson.result) {
				hideloding();
				crouseInfo.edu108_ID=backjson.crouseID;
				crouseInfo.edu107_ID=backjson.culturePlanID;
				crouseInfo.sfsckkjh=backjson.configTheCulturePlan;
				crouseInfo.xbsp=backjson.departmentApproval;
				$('#majorTrainingTable').bootstrapTable('prepend', crouseInfo);
				toolTipUp(".myTooltip");
				$(".addClassArea").hide();
				$(".culturePlanArea").show();	
				reloadCulturePlanArea();
				drawPagination(".majorTrainingTableArea", "培养计划");
				toastr.success('专业课程添加成功');
			} else {
				hideloding();
				toastr.warning('操作失败，请重试');
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
	
	if(parseFloat($("#classBaseInfo_weekHours").val())*parseFloat($("#classBaseInfo_countWeeks").val())!==allHosrs){
		toastr.warning('周学时*总周数不等于总学时');
		return;
	}
	
	if($("#classBaseInfo_classSemesters").val()==null){
		toastr.warning('授课学期不能为空');
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
	
	if(getNormalSelectValue("classBaseInfo_setUp")===""){
		toastr.warning('请选择开课部门');
		return;
	}
	
	if(getNormalSelectValue("classBaseInfo_classLocation")===""){
		toastr.warning('请选择授课地点');
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
	crouseInfoObject.skxq=JSON.stringify($("#classBaseInfo_classSemesters").val());
	crouseInfoObject.zhouxs=$("#classBaseInfo_weekHours").val();
	crouseInfoObject.zzs=$("#classBaseInfo_countWeeks").val();
	crouseInfoObject.kclx=getNormalSelectText("classBaseInfo_classType");
	crouseInfoObject.kclxCode=getNormalSelectValue("classBaseInfo_classType");
	crouseInfoObject.kcxz=getNormalSelectText("classBaseInfo_classNature");
	crouseInfoObject.kcxzCode=getNormalSelectValue("classBaseInfo_classNature");
	crouseInfoObject.ksfs=getNormalSelectText("classBaseInfo_testWay");
	crouseInfoObject.ksfsCode=getNormalSelectValue("classBaseInfo_testWay");
	crouseInfoObject.kkbm=getNormalSelectText("classBaseInfo_setUp");
	crouseInfoObject.kkbmCode=getNormalSelectValue("classBaseInfo_setUp");
	crouseInfoObject.skdd=getNormalSelectValue("classBaseInfo_classLocation");
	crouseInfoObject.mklb=getNormalSelectValue("classBaseInfo_moduleType");
	crouseInfoObject.kcsx=getNormalSelectValue("classBaseInfo_classQuality");
	crouseInfoObject.pkyq=getNormalSelectValue("classBaseInfo_classSchedRequire");
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
	refreshMultiSselect("#classBaseInfo_classSemesters");
	rebackClassBaseInfo();
}

// 填充课程库表
function stuffAllClassTable(tableInfo) {
	$('#allClassTable').bootstrapTable('destroy').bootstrapTable({
		data :tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
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
//	stuffManiaSelectWithDeafult("#classBaseInfo_setUp", row.setUp);   //开课部门哪里来？
	$("#classBaseInfo_classCode").val(row.kcdm);   //课程代码
	$("#classBaseInfo_className").val(row.kcmc);   //课程名称
	$("#classBaseInfo_enName").val(row.ywmc);       //英文名称
	$("#classBaseInfo_credits").val(row.xf);       //学分
	$("#classBaseInfo_theoryHours").val(row.llxs);  //理论学时
	$("#classBaseInfo_practiceHours").val(row.sjxs); //实践学时
	$("#classBaseInfo_disperseHours").val(row.fsxs);  //分散学时
	$("#classBaseInfo_centralizedHours").val(row.jzxs); //集中学时
//	$("#classBaseInfo_allHours").val(row.zxs);  //总学时
	stuffManiaSelectWithDeafult("#classBaseInfo_classType", row.kclxCode);  //课程类型
	stuffManiaSelectWithDeafult("#classBaseInfo_classNature", row.kcxzCode); //课程性质
	stuffManiaSelectWithDeafult("#classBaseInfo_testWay", row.ksfs);    //考试方式
	stuffManiaSelectWithDeafult("#classBaseInfo_classLocation",row.skdd);  //授课地点
	stuffManiaSelectWithDeafult("#classBaseInfo_moduleType",row.mklb);  //模块类别
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
	var nouNullSearch=getNotNullSearchs();
	var coursesCode = $("#addClassSearch_classCode").val();
	var coursesName = $("#addClassSearch_className").val();
	var majorWorkSign = $("#addClassSearch_classMark").val();
	if(typeof nouNullSearch ==='undefined'){
		return;
	}
	if (coursesCode === "" && coursesName === "" && majorWorkSign === "") {
		toastr.warning('请输入检索条件');
		return;
	}
	var serachObject=new Object();
	serachObject.level=nouNullSearch.level;
	serachObject.department=nouNullSearch.department;
	serachObject.grade=nouNullSearch.grade;
	serachObject.major=nouNullSearch.major;
	coursesCode===""?serachObject.coursesCode="":serachObject.coursesCode=coursesCode;
	coursesName===""?serachObject.coursesName="":serachObject.coursesName=coursesName;
	majorWorkSign===""?serachObject.majorWorkSign="":serachObject.majorWorkSign=majorWorkSign;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addCrouseSeacch",
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
				if(backjson.crouseInfo.length===0){
					toastr.warning('暂无数据');
					stuffAllClassTable({});
					return;
				}
				stuffAllClassTable(backjson.crouseInfo);
				rebackClassBaseInfo();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 重置添加专业课程基础信息内容
function rebackClassBaseInfo() {
	var reObject = new Object();
	reObject.normalSelectIds = "#classBaseInfo_isTeachingReform,#classBaseInfo_isCalssTextual,#classBaseInfo_isTextual,#classBaseInfo_isKernelClass,#classBaseInfo_isSchoolBusiness,#classBaseInfo_classWay,#classBaseInfo_signatureCourseLevel,#classBaseInfo_isNewClass,#classBaseInfo_classQuality,#classBaseInfo_classSchedRequire,#classBaseInfo_classType,#classBaseInfo_testWay,#classBaseInfo_classNature,#classBaseInfo_setUp,#classBaseInfo_classLocation,#classBaseInfo_moduleType";
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
	$("#classBaseInfo_startWeek").val(1);
	refreshMultiSselect("#classBaseInfo_classSemesters");
}

// 添加专业课程重置检索
function addClassArea_rebackSearch(isReloadTable) {
	$("#addClassSearch_classCode,#addClassSearch_className,#addClassSearch_classMark").val("");
	refreshMultiSselect("#classBaseInfo_classSemesters");
	rebackClassBaseInfo();
	var searchs = getNotNullSearchs();
	if (typeof (searchs) != "undefined") {
		getAllClassInfo(searchs.levelTxt, searchs.departmentTxt, searchs.gradeTxt,
				searchs.majorTxt);
	}
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

	// 新增课程按钮
	$('#addClassArea_addNewClass').unbind('click');
	$('#addClassArea_addNewClass').bind('click', function(e) {
		addClassArea_addNewClass();
		e.stopPropagation();
	});
}






// 生成班级开课计划
function wantGeneratCoursePaln() {
	var searchs = getNotNullSearchs();
	if (typeof (searchs) === "undefined") {
	return;
    }
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getGeneratCoursePalnInfo",
		data: {
            "culturePlanInfo":JSON.stringify(searchs)
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
				if(backjson.tableInfo.length===0){
					toastr.info('请添加专业课程');
					return;
				}
				if(backjson.classInfo.length===0){
					toastr.info('请添加行政班');
					return;
				}
				$(".GeneratCoursePaln_currentMajorName").html(searchs.levelTxt + '  ' + searchs.departmentTxt + '  ' + searchs.gradeTxt + '  ' + searchs.majorTxt);
				$(".generatCoursePalnArea").show();
				$(".culturePlanArea").hide();
				stuffAllClassArea(backjson.classInfo);
				stuffGeneratCoursePalnTable(backjson.tableInfo);
				generatCoursePalnBtnbind();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充班级选择区域
function stuffAllClassArea(classInfo) {
	$(".stuffCheckArea").empty();
	$("#checkAll").attr("checked",true);
	$("#recheckAll").attr("checked",false);
	for (var i = 0; i < classInfo.length; i++) {
		$(".stuffCheckArea").append(
				'<div class="col4 giveBottom">'
						+ '<div class="icheck-material-blue">'
						+ ' <input type="checkbox" id="' + classInfo[i].edu300_ID
						+ '" checked="true" onclick="singleCheck()"/>'
						+ ' <label for="' + classInfo[i].edu300_ID + '">'
						+ classInfo[i].xzbmc + '</label>' + '</div>'
						+ '</div>');
	}
}

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
		onPageChange : function() {
			drawPagination(".generatCourseArea", "课程");
		},
		columns : [ {
			field : 'check',
			checkbox : true
		},{
			field : 'edu108_ID',
			title: '唯一标识',
			align : 'center',
			visible : false
		},  {
			field : 'skxq',
			title : '授课学期',
			align : 'left',
			formatter : skxqMatter
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
	if (!checkExamine(".generatCoursePalnArea")) {
		toastr.warning('暂未选择班级');
		return;
	}

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
	
	for (var i = 0; i < courses.length; i++) {
		if(courses[i].xbsp!=="pass"){
			toastr.warning('不能选择未通过审核的课程');
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
	var checkedClassesIdArray = new Array();
	var checkedClassesNameArray = new Array();
	var coursesArray = new Array();
	var checkedClasses = $(".generatCoursePalnArea").find(".stuffCheckArea").find(".col4").find("input");
	//获取行政班ID
	for (var i = 0; i < checkedClasses.length; i++) {
		if (checkedClasses[i].checked === true) {
			checkedClassesIdArray.push(checkedClasses[i].id);
			checkedClassesNameArray.push(checkedClasses[i].nextElementSibling.innerText);
		}
	}
	
	//获取培养计划ID
	var courses = $('#generatCourseTable').bootstrapTable('getSelections');
	for (var i = 0; i < courses.length; i++) {
		coursesArray.push(courses[i].edu108_ID);
	}
	var sendObject=new Object();
	sendObject.classIds=checkedClassesIdArray;
	sendObject.classNames=checkedClassesNameArray;
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
			if (backjson.result) {
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
				toastr.success('生成开课计划成功');
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
	var nouNullSearch=getNotNullSearchs();
	var suditStatus = getNormalSelectValue("generatCourse_suditStatus");
	var coursesName = $("#coursesName").val();

	if(typeof nouNullSearch ==='undefined'){
		return;
	}
	var serachObject=new Object();
	serachObject.level=nouNullSearch.level;
	serachObject.department=nouNullSearch.department;
	serachObject.grade=nouNullSearch.grade;
	serachObject.major=nouNullSearch.major;
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
				if(backjson.crouseInfo.length===0){
					toastr.warning('暂无数据');
					stuffGeneratCoursePalnTable({});
					return;
				}
				stuffGeneratCoursePalnTable(backjson.crouseInfo);
			} else {
				toastr.warning('操作失败，请重试');
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



// 预备生成专业下所有班级课程
function wantGeneratAllClassAllCourse() {
	var searchs = getNotNullSearchs();
	if (typeof (searchs) != "undefined") {
		generatAllClassAllCourse(searchs.level, searchs.department,
				searchs.grade, searchs.major);
	}
}

// 生成专业下所有班级课程
function generatAllClassAllCourse(level, department, grade, major) {
	$.showModal("#remindModal",true);
	$(".remindType").html("专业下所有班级课程");
	$(".remindActionType").html("生成");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var generatObject=new Object();
		generatObject.level=level;
		generatObject.department=department;
		generatObject.grade=grade;
		generatObject.major=major;
		confirmGeneratAllClassAllCourse(generatObject);
		e.stopPropagation();
	});
}

// 确认生成专业下所有班级课程
function confirmGeneratAllClassAllCourse(generatObject) {
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/generatAllClassAllCourse",
		data: {
             "generatInfo":JSON.stringify(generatObject) 
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
				toastr.success('已生成专业下所有班级课程');
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
	approvalObject.proposerType=JSON.parse($.session.get('authoritysInfo')).bF991_ID;
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

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
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
	$('#wantGeneratAllClassAllCourse').unbind('click');
	$('#wantGeneratAllClassAllCourse').bind('click', function(e) {
		wantGeneratAllClassAllCourse();
		e.stopPropagation();
	});
	
	// 添加培养计划初始化事件
	$('.addCulturePlan').unbind('click');
	$('.addCulturePlan').bind('click', function(e) {
		addCulturePlan();
		e.stopPropagation();
	});
}
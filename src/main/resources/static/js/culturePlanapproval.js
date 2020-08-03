var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	drawMajorTrainingVerifyEmptyTable();
	getMajorTrainingSelectInfo();
	culturePlanVerifyAreaBtnbnid();
	$("input[type='number']").inputSpinner();
});

//获取-培养计划课程- 有逻辑关系select信息
function getMajorTrainingSelectInfo(){
	LinkageSelectPublic("#culturePlanVerify_level","#culturePlanVerify_department","#culturePlanVerify_grade","#culturePlanVerify_major");
	$("#culturePlanVerify_major").change(function() {
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
					dropConfigOption("#culturePlanVerify_major");
					if(backjson.couserInfo.length===0){
						toastr.info('暂无培养计划');
					}
					stuffMajorTrainingVerifyTable(backjson.couserInfo)
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

//必选检索条件检查
function getNotNullSearchs() {
	var levelValue = getNormalSelectValue("culturePlanVerify_level");
	var departmentValue = getNormalSelectValue("culturePlanVerify_department");
	var gradeValue =getNormalSelectValue("culturePlanVerify_grade");
	var majorValue =getNormalSelectValue("culturePlanVerify_major");

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
	var levelText = getNormalSelectText("culturePlanVerify_level");
	var departmentText = getNormalSelectText("culturePlanVerify_department");
	var gradeText =getNormalSelectText("culturePlanVerify_grade");
	var majorText =getNormalSelectText("culturePlanVerify_major");
	
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

//渲染专业培养计划审核空表格
function drawMajorTrainingVerifyEmptyTable() {
	stuffMajorTrainingVerifyTable({});
}

//填充专业培养计划审核表格
function stuffMajorTrainingVerifyTable(tableInfo) {
	window.culturePlanVerifyEvents = {
		'click #culturePlanInfo' : function(e, value, row, index) {
			showCulturePlanInfo(row,index);
		}
	};

	$('#culturePlanVerifyTable').bootstrapTable('destroy').bootstrapTable({
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
			drawPagination(".culturePlanVerifyTableArea", "培养计划");
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
			field : 'xbsp',
			title : '系部审批状态',
			align : 'center',
			formatter : approvalMatter
		}, {
			field : 'kcxz',
			title : '课程性质',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zhouxs',
			title : '周学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'llxs',
			title : '理论学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'theoryPrcentAll',
			title : '占总学时比例',
			align : 'left',
			formatter : theoryPrcentAllFormatter
		}, {
			field : 'sjxs',
			title : '实践学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'practicePrcentAll',
			title : '占总学时比例',
			align : 'left',
			formatter : practicePrcentAllMatter
		}, {
			field : 'zxs',
			title : '总学时',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xf',
			title : '学分',
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
			formatter : culturePlanVerifyFormatter,
			events : culturePlanVerifyEvents,
		} ]
	});

	function culturePlanVerifyFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
				+ '<li id="culturePlanInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
				+ '</ul>' ].join('');
	}
	
	function skxqMatter(value, row, index) {
		var skxqArray=JSON.parse(row.skxq);
		var skxqArrayToTxt='';
		 for (var i = 0; i < skxqArray.length; ++i) {
			 skxqArrayToTxt+=skxqArray[i]+',';
		 }
		 
		var skxqTxt='第'+skxqArrayToTxt.substring(0,skxqArrayToTxt.length-1)+'学期';
		return [ '<div class="myTooltip" title="地' + skxqTxt
					+ '">' + skxqTxt+ '</div>' ].join('');
	}

	function theoryPrcentAllFormatter(value, row, index) {
		var prcent=(row.sjxs/row.zxs).toFixed(2);
		return [ '<div class="myTooltip" title="' + prcent + '%">' + prcent
				+ '%</div>' ].join('');
	}
	
	function practicePrcentAllMatter(value, row, index) {
		var prcent=(row.llxs/row.zxs).toFixed(2);
		return [ '<div class="myTooltip" title="' + prcent + '%">' + prcent
				+ '%</div>' ].join('');
	}
	
	function calssNameMatter(value, row, index) {
		if (row.sfsckkjh==="T") {
			return [ '<div class="myTooltip greenTxt" title="' + row.kcmc
					+ '">' + row.kcmc + '</div>' ].join('');
		} else {
			return [ '<div class="myTooltip redTxt" title="' + row.kcmc
					+ '">' + row.kcmc + '</div>' ].join('');
		}
	}
	
	
	drawPagination(".culturePlanVerifyTableArea", "培养计划");
	drawSearchInput(".culturePlanVerifyTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".culturePlanVerifyTableArea", "培养计划");
}

//查看培养计划详情
function showCulturePlanInfo(row,index){
	showAndStuffDetails(row,false);
	givefeedbackrow(row,index);
	$('.majorTrainingTableActionArea').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$('#majorTrainingDetails_feedback').attr("disabled", false) // 反馈意见可修改
	$(".myabeNoneTipBtn").hide();
}

//显示详细信息并填充内容
function showAndStuffDetails(row,showFooter) {
	var nouNullSearch=getNotNullSearchs();
	$("#majorTrainingDetails_teachingTerm").multiSelect(); 
	$("#majorTrainingDetails_code").val(row.kcdm);
	$("#majorTrainingDetails_coursesName").val(row.kcmc);
//	$("#majorTrainingDetails_enName").val(row.ywmc);
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

//反馈意见事件绑定
function givefeedbackrow(row,index){
	$("#majorTrainingDetails_feedback").change(function(e) {
				$.ajax({
					method : 'get',
					cache : false,
					url : "/chengeCulturePlanCrouseFeedBack",
					data: {
						 "id":row.edu108_ID,
						 "feedBack":$("#majorTrainingDetails_feedback").val()
			        },
					dataType : 'json',
					success : function(backjson) {
						if (backjson.result) {
							$("#culturePlanVerifyTable").bootstrapTable('updateCell',{
								index:index,
								field:"fkyj",
								value:$("#majorTrainingDetails_feedback").val()
							});
						} else {
							toastr.warning('操作失败，请重试');
						}
					}
			});
		e.stopPropagation();
	});
}

// 培养计划通过审核
function culturePlanVerify_pass() {
	if (!tableIsChecked("#culturePlanVerifyTable", '培养计划')) {
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("已选培养计划");
	$(".remindActionType").html("审核通过");

	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click',function(e) {
		var choosedCrouse=$("#culturePlanVerifyTable").bootstrapTable("getSelections");
		var choosedIds=new Array();
		for (var i = 0; i < choosedCrouse.length; i++) {
			choosedIds.push(choosedCrouse[i].edu108_ID);
		}
		chengeCulturePlanApprovalStatus(choosedIds,1);
		e.stopPropagation();
	});
}

// 培养计划不通过审核
function culturePlanVerify_cannotPass() {
	if (!tableIsChecked("#culturePlanVerifyTable", '培养计划')) {
		return;
	}
	if(!checkCoruseIsGenerateClassPlan("#culturePlanVerifyTable")){
		toastr.warning('不能修改已生成开课计划课程的状态');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("已选培养计划");
	$(".remindActionType").html("审核不通过");
	
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind(
			'click',
			function(e) {
				var choosedCrouse=$("#culturePlanVerifyTable").bootstrapTable("getSelections");
				var choosedIds=new Array();
				for (var i = 0; i < choosedCrouse.length; i++) {
					choosedIds.push(choosedCrouse[i].edu108_ID);
				}
				chengeCulturePlanApprovalStatus(choosedIds,2);
				e.stopPropagation();
			});
}

// 培养计划取消审批
function culturePlanVerify_cancelVerify() {
	if (!tableIsChecked("#culturePlanVerifyTable", '培养计划')) {
		return;
	}

	if(!checkCoruseIsGenerateClassPlan("#culturePlanVerifyTable")){
		toastr.warning('不能修改已生成开课计划课程的状态');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("已选培养计划");
	$(".remindActionType").html("审批取消");

	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind(
			'click',
			function(e) {
				var choosedCrouse=$("#culturePlanVerifyTable").bootstrapTable("getSelections");
				var choosedIds=new Array();
				for (var i = 0; i < choosedCrouse.length; i++) {
					choosedIds.push(choosedCrouse[i].edu108_ID);
				}
				chengeCulturePlanApprovalStatus(choosedIds,3);
				e.stopPropagation();
			});
}

//检查选择课程是否生成开课计划
function  checkCoruseIsGenerateClassPlan(tableId){
	var checkPass=true;
	var choosedCrouse = $(tableId).bootstrapTable("getSelections");
	for (var i = 0; i < choosedCrouse.length; i++) {
		if(choosedCrouse[i].sfsckkjh==="T"){
			checkPass=false;
			break;
		}
	}
	return checkPass;
}

// 确认培养计划修改审核状态
function chengeCulturePlanApprovalStatus(choosedArray, changeType) {
	var modifyInfo=new Object();
	modifyInfo.changeType=changeType;
	modifyInfo.choosedCrouses=choosedArray;
	//1 通过
	//2不通过
	//3取消审批
	$.ajax({
		method : 'get',
		cache : false,
		url : "/chengeCulturePlanCrouseStatus",
		data: {
			 "modifyInfo":JSON.stringify(modifyInfo)
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
				for (var i = 0; i < choosedArray.length; i++) {
					var currentChangeRow=$("#culturePlanVerifyTable").bootstrapTable("getRowByUniqueId",choosedArray[i]);
					currentChangeRow.xbsp = backjson.status;
					$("#culturePlanVerifyTable").bootstrapTable('updateByUniqueId', {
						id : currentChangeRow.edu108_ID,
						row : currentChangeRow
					});
				}
				toolTipUp(".myTooltip")
				toastr.success('培养计划审核状态修改完成');
				$.hideModal("#remindModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
});
}

//培养计划审核开始检索
function culturePlanVerifyStartSearch() {
	var nouNullSearch=getNotNullSearchs();
	var coursesName = $("#culturePlanVerify_coursesName").val();
	var testWay = getNormalSelectValue("culturePlanVerify_testWay");
	var coursesNature = getNormalSelectValue("culturePlanVerify_coursesNature");
	var suditStatus = getNormalSelectValue("culturePlanVerify_suditStatusforDepartment");
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
					drawMajorTrainingVerifyEmptyTable();
					return;
				}
				stuffMajorTrainingVerifyTable(backjson.crouseInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
	
	
	
	
}

// 重置检索
function culturePlanVerify_reReloadSearchs() {
	var reObject = new Object();
	var reObject = new Object();
	reObject.fristSelectId = "#culturePlanVerify_level";
	reObject.InputIds = "#culturePlanVerify_coursesName";
	reObject.normalSelectIds = "#culturePlanVerify_coursesNature,#culturePlanVerify_suditStatusforDepartment";
	reObject.actionSelectIds = "#culturePlanVerify_department,#culturePlanVerify_grade,#culturePlanVerify_major";
	reReloadSearchsWithSelect(reObject);
	drawMajorTrainingVerifyEmptyTable();
}

//按钮事件绑定
function culturePlanVerifyAreaBtnbnid() {
	// 培养计划审核开始检索按钮
	$('#culturePlanVerify_startSearch').unbind('click');
	$('#culturePlanVerify_startSearch').bind('click', function(e) {
		culturePlanVerifyStartSearch();
		e.stopPropagation();
	});

	// 培养计划审核通过按钮
	$('#culturePlanVerify_pass').unbind('click');
	$('#culturePlanVerify_pass').bind('click', function(e) {
		culturePlanVerify_pass();
		e.stopPropagation();
	});

	// 培养计划审核不通过按钮
	$('#culturePlanVerify_cannotPass').unbind('click');
	$('#culturePlanVerify_cannotPass').bind('click', function(e) {
		culturePlanVerify_cannotPass();
		e.stopPropagation();
	});

	// 培养计划审核取消
	$('#culturePlanVerify_cancelVerify').unbind('click');
	$('#culturePlanVerify_cancelVerify').bind('click', function(e) {
		culturePlanVerify_cancelVerify();
		e.stopPropagation();
	});

	// 培养计划审核重置检索
	$('#culturePlanVerify_reReloadSearchs').unbind('click');
	$('#culturePlanVerify_reReloadSearchs').bind('click', function(e) {
		culturePlanVerify_reReloadSearchs();
		e.stopPropagation();
	});
	
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}
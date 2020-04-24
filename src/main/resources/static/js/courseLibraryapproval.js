var EJDMElementInfo;

$(function() {
	EJDMElementInfo=queryEJDMElementInfo();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	drawCourseLibraryEmptyTable();
	binBind();
	stuffEJDElement(EJDMElementInfo);
});

//渲染空课程库表格
function drawCourseLibraryEmptyTable(){
	stuffCourseLibraryTable({});
}

//渲染课程库表格
function stuffCourseLibraryTable(tableInfo){
	window.releaseNewsEvents = {
			'click #crouseDetails' : function(e, value, row, index) {
				crouseDetails(row);
			}
		};

		$('#courseLibraryTable').bootstrapTable('destroy').bootstrapTable({
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
				drawPagination(".courseLibraryTableArea", "课程信息");
			},
			columns : [ {
				field : 'bf200_ID',
				title : 'bf200_ID',
				align : 'center',
				visible : false
			},{
				field : 'check',
				checkbox : true
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
				field : 'bzzymc',
				title : '标志专业名称',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'kcfzr',
				title : '课程负责人',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'kcfzrID',
				title : '课程负责人id',
				align : 'left',
				visible : false
			}, {
				field : 'zt',
				title : '状态',
				align : 'center',
				formatter : ztMatter
			}, {
				field : 'lrr',
				title : '录入人',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'lrsj',
				title : '录入时间',
				align : 'left',
				formatter : timeFormatter
			},  {
				field : 'shr',
				title : '审核人',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'shsj',
				title : '审核时间',
				align : 'left',
				formatter : timeFormatter
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
					+ '<li id="crouseDetails"><span><img src="images/t02.png" style="width:24px"></span>详情</li>'
					+ '</ul>' ].join('');
		}
		
		function ztMatter(value, row, index) {
			if (row.zt==="pass") {
				return [ '<div class="myTooltip" title="已通过"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
						.join('');
			} else if (row.zt==="nopass"){
				return [ '<div class="myTooltip" title="不通过"><i class="iconfont icon-chacha redTxt"></i></div>' ]
						.join('');
			} else if (row.zt==="stop"){
				return [ '<div class="myTooltip redTxt" title="已停用">已停用</div>' ]
				.join('');
	        }else if (row.zt==="noStatus"){
				return [ '<div class="myTooltip normalTxt" title="未审批">未审批</div>' ]
				.join('');
	        }
		}


		drawPagination(".courseLibraryTableArea", "课程信息");
		changeColumnsStyle(".courseLibraryTableArea", "培养计划");
		drawSearchInput();
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
}

//课程详情
function crouseDetails(row){
	stuffclassDetailsArea(row);
	$(".addNewClassTip").show();
	$(".tipTile").html(row.kcmc+"-详细信息");
	$("#addNewClass_calssManger").attr("mangerId",row.kcfzrID);
	$(".comfirmAddNewClass").attr("value","确定");
	showMaskingElement();
	// 确认按钮绑定事件
	$('.comfirmAddNewClass').unbind('click');
	$('.comfirmAddNewClass').bind('click', function(e) {
		comfirmmodifyCourseInfo(row);
		e.stopPropagation();
	});
}

//填充课程详情tip内容
function stuffclassDetailsArea(row){
	$("#addNewClass_calssName").val(row.kcmc);//填充默认课程名称
	$("#addNewClass_calssCode").val(row.kcdm);//填充默认课程代码
	$("#addNewClass_enName").val(row.ywmc);//填充默认英文名称
	$("#addNewClass_calssManger").val(row.kcfzr);//填充默认课程负责人
	stuffManiaSelectWithDeafult("#addNewClass_classNature",row.kcxz);  //填充默认课程性质
	stuffManiaSelectWithDeafult("#addNewClass_classType",row.kclx); //填充默认课程类型
	stuffManiaSelectWithDeafult("#addNewClass_level",row.kccc); //填充默认课程层次
	$("#addNewClass_theoryHours").val(row.llxs);//填充默认理论学时
	$("#addNewClass_practiceHours").val(row.sjxs);//填充默认实践学时
	$("#addNewClass_allHours").val(row.zxs);//填充默认总学时
	stuffManiaSelectWithDeafult("#addNewClass_testWay",row.ksfs);  //填充默认考试方式
	$("#addNewClass_credits").val(row.xf);//填充默认学分
	stuffManiaSelectWithDeafult("#addNewClass_moduleType",row.mklb);  //填充默认模块类别
	stuffManiaSelectWithDeafult("#addNewClass_classQuality",row.kcsx);  //填充默认课程属性
	$("#addNewClass_markName").val(row.bzzymc);//填充默认专业标志
	stuffManiaSelectWithDeafult("#addNewClass_isSchoolBusiness",row.xqhz); //填充默认校企合作
	stuffManiaSelectWithDeafult("#addNewClass_classWay",row.skfs); //填充默认授课方式
	stuffManiaSelectWithDeafult("#addNewClass_classLocation",row.skdd); //填充默认授课方式
	stuffManiaSelectWithDeafult("#addNewClass_signatureCourseLevel",row.jpkcdj); //填充默认精品课程等级
	stuffManiaSelectWithDeafult("#addNewClass_isKernelClass",row.zyhxkc); //填充默认核心课程
	stuffManiaSelectWithDeafult("#addNewClass_isNewClass",row.sfxk); //填充默认新课
	stuffManiaSelectWithDeafult("#addNewClass_isTextual",row.zyzgkzkc); //填充默认职业资格考证
	stuffManiaSelectWithDeafult("#addNewClass_isCalssTextual",row.kztrkc); //填充默认课证通融
	stuffManiaSelectWithDeafult("#addNewClass_isTeachingReform",row.jxgglxkc); //填充默认教学改革立项
	$("#addNewClass_teacheMarks").val(row.bz); //填充默认备注
	$("#addNewClass_teacheSays").val(row.jsyqsm); //填充默认教师要求说明
	$("#addNewClass_calssAdvice").val(row.kcssjy);//填充默认课程建议
	$("#addNewClass_calssContent").val(row.jxnrjyq);//填充默认教学内容
	$("#addNewClass_calssDesignIdeas").val(row.sjsl);//填充默认设计思路
	$("#addNewClass_calssGoal").val(row.kcmb);//填充默认教学目标
	$("#addNewClass_calssIntroduce").val(row.kcjj);//填充默认课程属性
}

//清空课程详情tip内容
function emptyClassDetailsArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewClass_teacheMarks,#addNewClass_teacheSays,#addNewClass_calssAdvice,#addNewClass_calssContent,#addNewClass_calssDesignIdeas,#addNewClass_calssGoal,#addNewClass_calssIntroduce,#addNewClass_calssName,#addNewClass_calssCode,#addNewClass_enName,#addNewClass_calssManger,#addNewClass_allHours,#addNewClass_markName";
	reObject.normalSelectIds = "#addNewClass_isTeachingReform,#addNewClass_isCalssTextual,#addNewClass_isTextual,#addNewClass_isNewClass,#addNewClass_isKernelClass,#addNewClass_signatureCourseLevel,#addNewClass_classLocation,#addNewClass_classWay,#addNewClass_isSchoolBusiness,#addNewClass_level,#addNewClass_testWay,#addNewClass_moduleType,#addNewClass_classQuality,#addNewClass_classType,#addNewClass_classNature";
	reObject.numberInputs = "#addNewClass_theoryHours,#addNewClass_practiceHours,#addNewClass_credits";
	reReloadSearchsWithSelect(reObject);
}







//课程库课程通过审核
function passClass(){
	var choosedClass = $("#courseLibraryTable").bootstrapTable("getSelections");
	if(choosedClass.length==0){
		toastr.warning('请选择课程');
		return;
	}
	
	var idArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		if(choosedClass[i].zt==="pass"){
			toastr.warning('请选择未通过审批课程');
			return;
		}
		idArray.push(choosedClass[i].bf200_ID);
	}
	$(".remindTip").show();
	$(".remindType").html("课程");
	$(".remindActionType").html("审核通过");
	showMaskingElement();
	// 确认按钮改变事件
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmPassClass(idArray,choosedClass);
		e.stopPropagation();
	});
}

//课程库课程不通过审核
function cannotPass(){
	var choosedClass = $("#courseLibraryTable").bootstrapTable("getSelections");
	if(choosedClass.length==0){
		toastr.warning('请选择课程');
		return;
	}
	
	var idArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		if(choosedClass[i].zt==="nopass"){
			toastr.warning('请选择通过审批课程');
			return;
		}
		idArray.push(choosedClass[i].bf200_ID);
	}
	$(".remindTip").show();
	$(".remindType").html("课程");
	$(".remindActionType").html("审核不通过");
	showMaskingElement();
	// 确认按钮改变事件
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmCannotPass(idArray,choosedClass);
		e.stopPropagation();
	});
}

//课程库课程取消审核
function cancelPass(){
	var choosedClass = $("#courseLibraryTable").bootstrapTable("getSelections");
	if(choosedClass.length==0){
		toastr.warning('请选择课程');
		return;
	}
	
	var idArray=new Array();
	var newClassInfoArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		idArray.push(choosedClass[i].bf200_ID);
	}
	$(".remindTip").show();
	$(".remindType").html("课程");
	$(".remindActionType").html("审核取消");
	showMaskingElement();
	// 确认按钮改变事件
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmCancelPass(idArray,choosedClass);
		e.stopPropagation();
	});
}

//课程库课程停用
function stopClass(){
	var choosedClass = $("#courseLibraryTable").bootstrapTable("getSelections");
	if(choosedClass.length==0){
		toastr.warning('请选择课程');
		return;
	}
	
	var idArray=new Array();
	var newClassInfoArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		idArray.push(choosedClass[i].bf200_ID);
	}
	$(".remindTip").show();
	$(".remindType").html("课程");
	$(".remindActionType").html("停用");
	showMaskingElement();
	// 确认按钮改变事件
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmStopClass(idArray,choosedClass);
		e.stopPropagation();
	});
}



//确认通过审核
function confirmPassClass(choosedClassIDs,choosedClass){
	 var modifyInfo=new Object();
	 modifyInfo.modifyStatus="pass";
	 modifyInfo.choosedClasses=choosedClassIDs;
	 modifyInfo.approvalPerson=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
	 modifyInfo.approvalPersonID=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarymodifyClassByID",
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
				tableAction(true,backjson.notInPlan,choosedClass,backjson.approvalTime,modifyInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认不通过审核
function confirmCannotPass(choosedClassIDs,choosedClass){
	 var modifyInfo=new Object();
	 modifyInfo.modifyStatus="nopass";
	 modifyInfo.choosedClasses=choosedClassIDs;
	 modifyInfo.approvalPerson=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
	 modifyInfo.approvalPersonID=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarymodifyClassByID",
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
				tableAction(false,backjson.notInPlan,choosedClass,backjson.approvalTime,modifyInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认取消审核
function confirmCancelPass(choosedClassIDs,choosedClass){
	var modifyInfo=new Object();
	 modifyInfo.modifyStatus="noStatus";
	 modifyInfo.choosedClasses=choosedClassIDs;
	 modifyInfo.approvalPerson=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
	 modifyInfo.approvalPersonID=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarymodifyClassByID",
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
				tableAction(false,backjson.notInPlan,choosedClass,backjson.approvalTime,modifyInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认停用课程
function confirmStopClass(choosedClassIDs,choosedClass){
	var modifyInfo=new Object();
	 modifyInfo.modifyStatus="stop";
	 modifyInfo.choosedClasses=choosedClassIDs;
	 modifyInfo.approvalPerson=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
	 modifyInfo.approvalPersonID=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarymodifyClassByID",
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
				tableAction(false,backjson.notInPlan,choosedClass,backjson.approvalTime,modifyInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}



//课程库表更新操作
function tableAction(isPass,notInPlan,choosedClass,approvalTime,modifyInfo){
	$(".remindTip").hide();
	showMaskingElement();
	toolTipUp(".myTooltip");
	
	if(!isPass){
		if(notInPlan){
			toastr.warning('有课程存在培养计划，不能更改状态');
			return;
		}
	}

	for (var i = 0; i < choosedClass.length; i++) {
		choosedClass[i].zt=modifyInfo.modifyStatus;
		choosedClass[i].shsj=approvalTime;
		choosedClass[i].shr=modifyInfo.approvalPerson;
		choosedClass[i].shrID=modifyInfo.approvalPerson;
		$("#courseLibraryTable").bootstrapTable('updateByUniqueId', {
			id: choosedClass[i].bf200_ID,
			row: choosedClass[i]
		});
	}
	toastr.success('操作成功');
	drawPagination(".courseLibraryTableArea", "课程信息");
}

//开始检索
function startSearch(){
	var courseCode=$("#courseCode").val();
	var courseName=$("#courseName").val();
	var markName=$("#markName").val();
	var coursesNature=getNormalSelectValue("coursesNature");
	var status=getNormalSelectValue("status");
	
	if(courseCode===""&&courseName===""&&markName===""&&coursesNature===""&&status===""){
		toastr.warning('请输入检索条件');
		return;
	}
	
	var serachObject=new Object();
	courseCode===""?serachObject.courseCode="":serachObject.courseCode=courseCode;
	courseName===""?serachObject.courseName="":serachObject.courseName=courseName;
	markName===""?serachObject.markName="":serachObject.markName=markName;
	coursesNature==="seleceConfigTip"?serachObject.coursesNature="":serachObject.coursesNature=coursesNature;
	status==="seleceConfigTip"?serachObject.status="":serachObject.status=status;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarySeacchClass",
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
				if(backjson.classList.length===0){
					toastr.warning('暂无数据');
					 drawCourseLibraryEmptyTable();
					return;
				}
				stuffCourseLibraryTable(backjson.classList);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}




//重置检索
function reReloadSearchs(){
	var reObject = new Object();
	reObject.InputIds = "#courseCode,#courseName,#markName";
	reObject.normalSelectIds = "#coursesNature,#status";
	reReloadSearchsWithSelect(reObject);
	drawCourseLibraryEmptyTable();
}

//页面初始化时按钮事件绑定
function binBind(){
	// 提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$(".tip").hide();
		$("#addNewClass_calssManger").removeAttr("mangerId");
		showMaskingElement();
		e.stopPropagation();
	});
	
	// 开始搜索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
	
	// 通过审核
	$('#pass').unbind('click');
	$('#pass').bind('click', function(e) {
		passClass();
		e.stopPropagation();
	});
	
	// 不通过审核
	$('#cannotPass').unbind('click');
	$('#cannotPass').bind('click', function(e) {
		cannotPass();
		e.stopPropagation();
	});
	
	// 取消审核
	$('#cancelPass').unbind('click');
	$('#cancelPass').bind('click', function(e) {
		cancelPass();
		e.stopPropagation();
	});

	// 停用课程
	$('#stopClass').unbind('click');
	$('#stopClass').bind('click', function(e) {
		stopClass();
		e.stopPropagation();
	});
	
	
	//导出Excel
	$('#tableToExecl').unbind('click');
	$('#tableToExecl').bind('click', function(e) {
		tableToExecl("#courseLibraryTable");
		e.stopPropagation();
	});
	
	//重置检索
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});
}
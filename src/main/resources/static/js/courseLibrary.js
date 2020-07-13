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
			'click #modifyCourseLibrary' : function(e, value, row, index) {
				modifyCourseLibrary(row);
			},
			'click #courseLibraryInfo' : function(e, value, row, index) {
				courseLibraryInfo(row);
			},
			'click #removeCourse' : function(e, value, row, index) {
				removeCourse(row);
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
			exportDataType: "all",  
			showExport: true,      //是否显示导出
			exportOptions:{  
			    fileName: '课程库导出'  //文件名称
			},
			search : true,
			editable : false,
			striped : true,
			toolbar : '#toolbar',
			showColumns : true,
			onPageChange : function() {
				drawPagination(".courseLibraryTableArea", "课程信息");
			},
			columns : [ {
				field : 'check',
				checkbox : true
			},{
				field : 'bf200_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
			}, {
				field : 'kcmc',
				title : '课程名称',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'kcdm',
				title : '课程代码',
				align : 'left',
				formatter : paramsMatter
			},{
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
				formatter : paramsMatter,
				visible : false
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
			        + '<li class="queryBtn" id="courseLibraryInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
					+ '<li class="modifyBtn" id="modifyCourseLibrary"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
					+ '<li class="deleteBtn" id="removeCourse"><span><img src="images/t03.png"></span>删除</li>'
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
		drawSearchInput(".courseLibraryTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
		btnControl();
}

//课程详情
function courseLibraryInfo(row){
	stuffclassDetailsArea(row);
	$(".addNewClass_calssCodeArae").show();
	$('#addNewClassModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$.showModal("#addNewClassModal",false);
	$("#addNewClassModal").find(".moadalTitle").html("课程-"+row.kcmc+" 详细信息");
}

//修改课程
function modifyCourseLibrary(row){
	$(".addNewClass_calssCodeArae").hide();
	$('#addNewClassModal').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	var idArray=new Array();
	idArray.push(row.bf200_ID);
	modifyClassesCheckCrouseIsInPlan(idArray,row);
}

//检查课程是否有存在培养计划的
function modifyClassesCheckCrouseIsInPlan(idArray,row){
	 var deleteIds=new Object();
	 deleteIds.deleteIdArray=idArray;
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkCrouseIsInPlan",
		data: {
          "deleteIds":JSON.stringify(deleteIds) 
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
				if(backjson.isInPlan){
					$.showModal("#actionModal",true);
					$("#actionModal").find(".actionTxt").html("该课程存在培养计划,是否还要修改？");
					// 确认删除事件
					$('.confirmAction').unbind('click');
					$('.confirmAction').bind('click', function(e) {
						$.hideModal("#actionModal",false);
						$.showModal("#addNewClassModal",true);
						$("#addNewClassModal").find(".moadalTitle").html("修改课程-"+row.kcmc);
						$(".comfirmAddNewClass").attr("value","确定");
						stuffclassDetailsArea(row);
						$("#addNewClass_calssManger").attr("mangerId",row.kcfzrID);
						// 确认按钮绑定事件
						$('.comfirmAddNewClass').unbind('click');
						$('.comfirmAddNewClass').bind('click', function(e) {
							comfirmmodifyCourseInfo(row);
							e.stopPropagation();
						});
						e.stopPropagation();
					});
				}else{
					stuffclassDetailsArea(row);
					$.showModal("#addNewClassModal",true);
					$("#addNewClassModal").find(".moadalTitle").html("修改课程-"+row.kcmc);
					$("#addNewClass_calssManger").attr("mangerId",row.kcfzrID);
					$(".comfirmAddNewClass").attr("value","确定");
					// 确认按钮绑定事件
					$('.comfirmAddNewClass').unbind('click');
					$('.comfirmAddNewClass').bind('click', function(e) {
						comfirmmodifyCourseInfo(row);
						e.stopPropagation();
					});
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充课程详情tip内容
function stuffclassDetailsArea(row){
	$("#addNewClass_calssName").val(row.kcmc);//填充默认课程名称
	$("#addNewClass_calssCode").val(row.kcdm);//填充默认课程代码
//	$("#addNewClass_enName").val(row.ywmc);//填充默认英文名称
	$("#addNewClass_calssManger").val(row.kcfzr);//填充默认课程负责人
	stuffManiaSelectWithDeafult("#addNewClass_classNature",row.kcxz);  //填充默认课程性质
	stuffManiaSelectWithDeafult("#addNewClass_classType",row.kclx); //填充默认课程类型
//	stuffManiaSelectWithDeafult("#addNewClass_level",row.kccc); //填充默认课程层次
	$("#addNewClass_theoryHours").val(row.llxs);//填充默认理论学时
	$("#addNewClass_practiceHours").val(row.sjxs);//填充默认实践学时
	$("#addNewClass_disperseHours").val(row.fsxs);//填充默认分散学时
	$("#addNewClass_centralizedHours").val(row.jzxs);//填充默认集中学时
//	$("#addNewClass_allHours").val(row.zxs);//填充默认总学时
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

//确认修改课程
function comfirmmodifyCourseInfo(row){
	var newClassObject=classDetailsConfirmBtnAction();
	newClassObject.kcdm=row.kcdm;
	if(typeof newClassObject ==='undefined'){
		return;
	}
	newClassObject.BF200_ID=row.bf200_ID;
	newClassObject.zt=row.zt;
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateClass",
		data: {
             "updateinfo":JSON.stringify(newClassObject) 
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
				if(backjson.nameHave){
					toastr.warning('课程名称已存在');
					return;
				}
				if(backjson.codeHave){
					toastr.warning('课程代码已存在');
					return;
				}
				$.hideModal("#addNewClassModal");
				newClassObject.lrsj=backjson.currentTimeStamp;
				newClassObject.zt="noStatus";
				newClassObject.shr=null;
				newClassObject.shrID=null;
				newClassObject.shsj=null;
				$("#courseLibraryTable").bootstrapTable('updateByUniqueId', {
					id: row.bf200_ID,
					row: newClassObject
				});
				toastr.success('修改专业课程成功');
				$("#addNewClass_calssManger").removeAttr("mangerId");
				$(".myTooltip").tooltipify();
				drawPagination(".courseLibraryTableArea", "课程信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//新增课程
function wantAddClass() {
	$(".addNewClass_calssCodeArae").hide();
	emptyClassDetailsArea();
	$.showModal("#addNewClassModal",true);
	$("#addNewClassModal").find(".moadalTitle").html("录入新课");
	$(".comfirmAddNewClass").attr("value","录入");
	
	// 确认按钮绑定事件
	$('.comfirmAddNewClass').unbind('click');
	$('.comfirmAddNewClass').bind('click', function(e) {
		comfirmAddNewClass();
		e.stopPropagation();
	});
	
	// 开始检索教师按钮
	$('#allClassMangers_StartSearch').unbind('click');
	$('#allClassMangers_StartSearch').bind('click', function(e) {
		allClassMangersStartSearch();
		e.stopPropagation();
	});
	
	// 重置检索教师按钮
	$('#allClassMangers_ReSearch').unbind('click');
	$('#allClassMangers_ReSearch').bind('click', function(e) {
		allClassMangersReSearch();
		e.stopPropagation();
	});
}

//清空课程详情tip内容
function emptyClassDetailsArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewClass_teacheMarks,#addNewClass_teacheSays,#addNewClass_calssAdvice,#addNewClass_calssContent,#addNewClass_calssDesignIdeas,#addNewClass_calssGoal,#addNewClass_calssIntroduce,#addNewClass_calssName,#addNewClass_calssManger,#addNewClass_markName";
	reObject.normalSelectIds = "#addNewClass_isTeachingReform,#addNewClass_isCalssTextual,#addNewClass_isTextual,#addNewClass_isNewClass,#addNewClass_isKernelClass,#addNewClass_signatureCourseLevel,#addNewClass_classLocation,#addNewClass_classWay,#addNewClass_isSchoolBusiness,#addNewClass_testWay,#addNewClass_moduleType,#addNewClass_classQuality,#addNewClass_classType,#addNewClass_classNature";
	reObject.numberInputs = "#addNewClass_theoryHours,#addNewClass_practiceHours,#addNewClass_credits,#addNewClass_disperseHours,#addNewClass_centralizedHours";
	reReloadSearchsWithSelect(reObject);
}

//确认新增课程
function comfirmAddNewClass(){
	var newClassObject=classDetailsConfirmBtnAction();
	if(typeof newClassObject ==='undefined'){
		return;
	}
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewClass",
		data: {
             "newClassInfo":JSON.stringify(newClassObject) 
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
				if(backjson.nameHave){
					toastr.warning('课程名称已存在');
					return;
				}
				newClassObject.bf200_ID=backjson.newId;
				newClassObject.kcdm=backjson.kcdm;
				newClassObject.zt=backjson.zt;
				newClassObject.lrsj=backjson.lrsj;
				newClassObject.kcfzr=$("#addNewClass_calssManger").val();
				$('#courseLibraryTable').bootstrapTable("prepend", newClassObject);
				toastr.success('新增专业课程成功');
				$.hideModal("#addNewClassModal");
				$("#addNewClass_calssManger").removeAttr("mangerId");
				$(".myTooltip").tooltipify();
				drawPagination(".courseLibraryTableArea", "课程信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取所有课程负责人
function getAllClassMangers(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllTeacher",
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
			 		stuffAllClassMangersTable(backjson.teacherList);
			 		$.hideModal("#addNewClassModal",false);
			 		$.showModal("#allClassMangersModal",true);
			 	 } else {
					toastr.warning('操作失败，请重试');
			 	 }
		}
	});
}

//填充负责人表
function stuffAllClassMangersTable(tableInfo){
		$('#allClassMangersTable').bootstrapTable('destroy').bootstrapTable({
			data : tableInfo,
			pagination : true,
			pageNumber : 1,
			pageSize : 5,
			pageList : [ 5 ],
			showToggle : false,
			showFooter : false,
			clickToSelect : true,
			singleSelect: true,// 单选checkbox
			search : true,
			editable : false,
			striped : true,
			toolbar : '#toolbar',
			showColumns : false,
			onPageChange : function() {
				drawPagination(".allClassMangersTableArea", "负责人信息");
			},
			columns : [ {
				field : 'edu101_ID',
				title : 'id',
				align : 'center',
				visible : false
			},{
				field: 'check',
				checkbox: true
			},{
				field : 'ssyx',
				title : '系部',
				align : 'left',
				formatter : paramsMatter

			}, {
				field : 'jsxm',
				title : '姓名',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'jgh',
				title : '教工号',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'xb',
				title : '性别',
				align : 'left',
				formatter : sexFormatter
			}]
		});
		
		// 性别文字化
		function sexFormatter(value, row, index) {
			if (value === "M") {
				return [ '<div class="myTooltip" title="男">男</div>' ].join('');
			} else {
				return [ '<div class="myTooltip" title="女">女</div>' ].join('');
			}
		}
		drawPagination(".allClassMangersTableArea", "负责人信息");
		drawSearchInput(".allClassMangersTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
}

//确认选择负责人
function confirmChoosedManger(){
	var choosedManger=$("#allClassMangersTable").bootstrapTable("getSelections");
	$("#addNewClass_calssManger").val(choosedManger[0].jsxm);
	$("#addNewClass_calssManger").attr("mangerId",choosedManger[0].edu101_ID);
	$.hideModal("#allClassMangersModal",false);
    $.showModal("#addNewClassModal",true);
}

//课程信息模态框确认按钮事件
function classDetailsConfirmBtnAction(){
	if($("#addNewClass_calssName").val()===""){
		toastr.warning('课程名称不能为空');
		return;
	}
	
//	if($("#addNewClass_calssCode").val()===""){
//		toastr.warning('课程代码不能为空');
//		return;
//	}
	
	if(typeof $("#addNewClass_calssManger").attr("mangerId")==="undefined"){
		toastr.warning('请选择课程负责人');
		return;
	}
	
	if(getNormalSelectValue("addNewClass_classType") === ""){
		toastr.warning('请选择课程类型');
		return;
	}
	
	if(getNormalSelectValue("addNewClass_classNature") === ""){
		toastr.warning('请选择课程性质');
		return;
	}
	
	if(getNormalSelectValue("addNewClass_testWay") === ""){
		toastr.warning('请选择考试方式');
		return;
	}
	
	
	var allHosrs=parseFloat($("#addNewClass_practiceHours").val())+parseFloat($("#addNewClass_theoryHours").val());
	var allHosrs2=parseFloat($("#addNewClass_disperseHours").val())+parseFloat($("#addNewClass_centralizedHours").val());
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
	
	if(parseFloat($("#addNewClass_credits").val())===0){
		toastr.warning('请输入学分');
		return;
	}
	
	
	var newClassObject=new Object();
	newClassObject.kcmc=$("#addNewClass_calssName").val();
//	newClassObject.kcdm=$("#addNewClass_calssCode").val();
//	newClassObject.ywmc=$("#addNewClass_enName").val();
	newClassObject.kcfzr=$("#addNewClass_calssManger").val();
	newClassObject.kcfzrID=$("#addNewClass_calssManger").attr("mangerId");
	newClassObject.kclx=getNormalSelectText("addNewClass_classType");
	newClassObject.kclxCode=getNormalSelectValue("addNewClass_classType");
	newClassObject.kcxzCode=getNormalSelectValue("addNewClass_classNature");
	newClassObject.kcxz=getNormalSelectText("addNewClass_classNature");
//	newClassObject.kccc=getNormalSelectText("addNewClass_level");
//	newClassObject.kcccCode=getNormalSelectValue("addNewClass_level");
	newClassObject.llxs=parseFloat($("#addNewClass_theoryHours").val());
	newClassObject.sjxs=parseFloat($("#addNewClass_practiceHours").val());
	newClassObject.fsxs=parseFloat($("#addNewClass_disperseHours").val());
	newClassObject.jzxs=parseFloat($("#addNewClass_centralizedHours").val());
	newClassObject.zxs=allHosrs;
	newClassObject.ksfs=getNormalSelectValue("addNewClass_testWay");
	newClassObject.xf=parseFloat($("#addNewClass_credits").val());
	newClassObject.mklb=getNormalSelectValue("addNewClass_moduleType");
	newClassObject.kcsx=getNormalSelectValue("addNewClass_classQuality");
	newClassObject.bzzymc=$("#addNewClass_markName").val();
	newClassObject.xqhz=getNormalSelectValue("addNewClass_isSchoolBusiness");
	newClassObject.skfs=getNormalSelectValue("addNewClass_classWay");
	newClassObject.skdd=getNormalSelectValue("addNewClass_classLocation");
	newClassObject.jpkcdj=getNormalSelectValue("addNewClass_signatureCourseLevel");
	newClassObject.zyhxkc=getNormalSelectValue("addNewClass_isKernelClass");
	newClassObject.sfxk=getNormalSelectValue("addNewClass_isNewClass");
	newClassObject.zyzgkzkc=getNormalSelectValue("addNewClass_isTextual");
	newClassObject.kztrkc=getNormalSelectValue("addNewClass_isCalssTextual");
	newClassObject.jxgglxkc=getNormalSelectValue("addNewClass_isTeachingReform");
	newClassObject.kcjj=$("#addNewClass_calssIntroduce").val();
	newClassObject.kcmb=$("#addNewClass_calssGoal").val();
	newClassObject.sjsl=$("#addNewClass_calssDesignIdeas").val();
	newClassObject.jxnrjyq=$("#addNewClass_calssContent").val();
	newClassObject.kcssjy=$("#addNewClass_calssAdvice").val();
	newClassObject.jsyqsm=$("#addNewClass_teacheSays").val();
	newClassObject.bz=$("#addNewClass_teacheMarks").val();
	newClassObject.lrrID=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	newClassObject.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
	return newClassObject;
}


//单个删除课程
function removeCourse(row){
	var idArray=new Array();
	idArray.push(row.bf200_ID);
	removeClassesCheckCrouseIsInPlan(idArray);
}

//多选删除课程
function removeClasses(){
	var choosedClass = $("#courseLibraryTable").bootstrapTable("getSelections");
	if(choosedClass.length==0){
		toastr.warning('请选择课程');
		return;
	}
	
	var idArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		idArray.push(choosedClass[i].bf200_ID);
	}
	removeClassesCheckCrouseIsInPlan(idArray);
}

//删除检查课程是否有存在培养计划的
function removeClassesCheckCrouseIsInPlan(idArray){
	 var deleteIds=new Object();
	 deleteIds.deleteIdArray=idArray;
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkCrouseIsInPlan",
		data: {
          "deleteIds":JSON.stringify(deleteIds) 
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
				if(backjson.isInPlan){
					$.showModal("#actionModal",true);
					$("#actionModal").find(".actionTxt").html("有课程存在培养计划,是否确定删除？");
					// 确认删除事件
					$('.confirmAction').unbind('click');
					$('.confirmAction').bind('click', function(e) {
						confirmRemoveClasses(idArray);
						e.stopPropagation();
					});
				}else{
					$.showModal("#remindModal",true);
					$(".remindType").html("课程");
					$(".remindActionType").html("删除");
					// 确认按钮改变事件
					$('.confirmRemind').unbind('click');
					$('.confirmRemind').bind('click', function(e) {
						confirmRemoveClasses(idArray);
						e.stopPropagation();
					});
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认删除课程
function confirmRemoveClasses(idArray){
	 var deleteIds=new Object();
	 deleteIds.deleteIdArray=idArray;
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/libraryReomveClassByID",
		data: {
          "deleteIds":JSON.stringify(deleteIds) 
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
				for (var i = 0; i < idArray.length; i++) {
					$("#courseLibraryTable").bootstrapTable('removeByUniqueId', idArray[i]);
				}
				$.hideModal("");
				toastr.success('操作成功');
				toolTipUp(".myTooltip");
				drawPagination(".courseLibraryTableArea", "课程信息");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
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

//开始检索教师
function allClassMangersStartSearch(){
	var departmentName=$("#departmentName").val();
	var mangerName=$("#mangerName").val();
	var mangerNumber=$("#mangerNumber").val();
	if(departmentName===""&&mangerName===""&&mangerNumber===""){
		toastr.warning('检索条件为空');
		return;
	}
	var serachObject=new Object();
	departmentName===""?serachObject.departmentName="":serachObject.departmentName=departmentName;
	mangerName===""?serachObject.mangerName="":serachObject.mangerName=mangerName;
	mangerNumber===""?serachObject.mangerNumber="":serachObject.mangerNumber=mangerNumber;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacher",
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
				 stuffAllClassMangersTable(backjson.techerList);
			 	 } else {
					toastr.warning('操作失败，请重试');
			 	 }
		}
	});
}

//重置检索教师
function allClassMangersReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
	getAllClassMangers();
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
	// 新增课程
	$('#wantAddClass').unbind('click');
	$('#wantAddClass').bind('click', function(e) {
		wantAddClass();
		e.stopPropagation();
	});
	
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
	
	// 开始搜索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
	
	// 删除课程
	$('#removeClasses').unbind('click');
	$('#removeClasses').bind('click', function(e) {
		removeClasses();
		e.stopPropagation();
	});
	
	//重置检索
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});
	
	// 选择课程负责人
    $('#addNewClass_calssManger').focus(function(e){
		allClassMangersReSearch();
		getAllClassMangers();
		e.stopPropagation();
    });
    
    
   // 负责人模态框消失
	$('.specialCanle').unbind('click');
	$('.specialCanle').bind('click', function(e) {
		$.hideModal("#allClassMangersModal",false);
 		$.showModal("#addNewClassModal",true);
		e.stopPropagation();
	});
	
   // 选择负责人
	$('#confirmChoosedManger').unbind('click');
	$('#confirmChoosedManger').bind('click', function(e) {
		confirmChoosedManger();
		e.stopPropagation();
	});
}
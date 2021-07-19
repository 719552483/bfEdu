var EJDMElementInfo;

$(function() {
	judgementPWDisModifyFromImplements();
	EJDMElementInfo=queryEJDMElementInfo();
	$('.isSowIndex').selectMania(); //初始化下拉框
	$("input[type='number']").inputSpinner();
	drawCourseLibraryEmptyTable();
	binBind();
	stuffEJDElement(EJDMElementInfo);
	getXbInfo();
	stuffDepartmentSelect();
	deafultSearch();
});

//填充和系部下拉框
function stuffDepartmentSelect(){
	var str = '<option value="seleceConfigTip">请选择</option>';
	//系部
	var allDepartment=getXbInfo();
	for (var i = 0; i < allDepartment.length; i++) {
		str += '<option value="' + allDepartment[i].edu104_ID + '">' + allDepartment[i].xbmc
			+ '</option>';
	}
	stuffManiaSelect("#department", str);
}

//初始化检索
function deafultSearch(){
	var serachObject=new Object();
	serachObject.kcdm="";
	serachObject.kcmc="";
	serachObject.bzzymc="";
	serachObject.kcxzCode="";
	serachObject.zt="";
	serachObject.departmentCode="";

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarySeacchClass",
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
				toastr.info(backjson.msg);
				stuffCourseLibraryTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawCourseLibraryEmptyTable();
			}
		}
	});
}

//获取系部信息
function getXbInfo(){
	var xbData=new Object();
	$.ajax({
		method: 'post',
		cache: false,
		url: "/getUsefulDepartment",
		async:false,
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
		},
		dataType: 'json',
		success: function(backjson) {
			if(backjson.code===200) {
				xbData=backjson.data;
			}else{
				toastr.warning(backjson.msg);
			}
		}
	});
	return xbData;
}

//渲染空课程库表格
function drawCourseLibraryEmptyTable(){
	stuffCourseLibraryTable({});
}

var choosendCrouse=new Array();
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
			onCheck : function(row) {
				onCheck(row);
			},
			onUncheck : function(row) {
				onUncheck(row);
			},
			onCheckAll : function(rows) {
				onCheckAll(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAll(rows2);
			},
			onPageChange : function() {
				drawPagination(".courseLibraryTableArea", "课程信息");
				for (var i = 0; i < choosendCrouse.length; i++) {
					$("#courseLibraryTable").bootstrapTable("checkBy", {field:"bf200_ID", values:[choosendCrouse[i].bf200_ID]})
				}
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns : [ {
				field : 'check',
				checkbox : true
			},{
				field : 'bf200_ID',
				title: '唯一标识',
				align : 'center',
				sortable: true,
				visible : false
			}, {
				field : 'kcmc',
				title : '课程名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'kcdm',
				title : '课程代码',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'xf',
				title : '学分',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'zxs',
				title : '总学时',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'llxs',
				title : '理论学时',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'sjxs',
				title : '实践学时',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'kclx',
				title : '课程类型',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'kcxz',
				title : '课程性质',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'bzzymc',
				title : '标志专业名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter,
				visible : false
			}, {
				field : 'kcfzr',
				title : '课程负责人',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'kcfzrID',
				title : '课程负责人id',
				align : 'left',
				sortable: true,
				visible : false
			}, {
				field : 'zt',
				title : '状态',
				align : 'center',
				sortable: true,
				formatter : ztMatter
			}, {
				field : 'lrr',
				title : '录入人',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'lrsj',
				title : '录入时间',
				align : 'left',
				sortable: true,
				formatter : timeFormatter
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
	        }else if (row.zt==="passing"){
				return [ '<div class="myTooltip normalTxt" title="审批中">审批中</div>' ]
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

//单选学生
function onCheck(row){
	if(choosendCrouse.length<=0){
		choosendCrouse.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendCrouse.length; i++) {
			if(choosendCrouse[i].bf200_ID===row.bf200_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendCrouse.push(row);
		}
	}
}

//单反选学生
function onUncheck(row){
	if(choosendCrouse.length<=1){
		choosendCrouse.length=0;
	}else{
		for (var i = 0; i < choosendCrouse.length; i++) {
			if(choosendCrouse[i].bf200_ID===row.bf200_ID){
				choosendCrouse.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosendCrouse.push(row[i]);
	}
}

//全反选学生
function onUncheckAll(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].bf200_ID);
	}


	for (var i = 0; i < choosendCrouse.length; i++) {
		if(a.indexOf(choosendCrouse[i].bf200_ID)!==-1){
			choosendCrouse.splice(i,1);
			i--;
		}
	}
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
	if(row.zt==="passing"){
		toastr.warning('该课程暂不可进行此操作');
		return;
	}
	$(".addNewClass_calssCodeArae").hide();
	$('#addNewClassModal').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	var idArray=new Array();
	idArray.push(row.bf200_ID);
	var xbInfo=getXbInfo();
	modifyClassesCheckCrouseIsInPlan(idArray,row,xbInfo);
}

//检查课程是否有存在培养计划的
function modifyClassesCheckCrouseIsInPlan(idArray,row,xbInfo){
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkCrouseIsInPlan",
		data: {
          "deleteIds":JSON.stringify(idArray)
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
					// 确认按钮绑定事件
					$('.confirmAction').unbind('click');
					$('.confirmAction').bind('click', function(e) {
						$.hideModal("#actionModal",false);
						$.showModal("#addNewClassModal",true);
						$("#addNewClassModal").find(".moadalTitle").html("修改课程-"+row.kcmc);
						$(".comfirmAddNewClass").attr("value","确定");
						drawUsefulDepartment(xbInfo);
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
					drawUsefulDepartment(xbInfo);
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
	var xinbinf=getXbInfo();
	drawUsefulDepartment(xinbinf);
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
	stuffManiaSelectWithDeafult("#addNewClass_department",row.departmentCode);  //填充默认二级学院
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
		url : "/addNewClass",
		data: {
			"newClassInfo":JSON.stringify(newClassObject),
			"userKey":JSON.parse($.session.get('userInfo')).userKey,
			"approvalobect":JSON.stringify(getApprovalobect("01"))
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
				$.hideModal("#addNewClassModal");
				newClassObject.lrsj=timeStamp2String(backjson.data.lrsj);
				newClassObject.zt="passing";
				newClassObject.shr=null;
				newClassObject.shrID=null;
				newClassObject.shsj=null;
				$("#courseLibraryTable").bootstrapTable('updateByUniqueId', {
					id: row.bf200_ID,
					row: newClassObject
				});
				toastr.success(backjson.msg);
				$("#addNewClass_calssManger").removeAttr("mangerId");
				$(".myTooltip").tooltipify();
				drawPagination(".courseLibraryTableArea", "课程信息");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//新增课程
function wantAddClass() {
	var xbInfo=getXbInfo();
	droawAddModal(xbInfo);
	$('#addNewClassModal').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
}

//获取系部成功或的回调
function droawAddModal(departmentData){
	$(".addNewClass_calssCodeArae").hide();
	emptyClassDetailsArea();
	drawUsefulDepartment(departmentData);
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

//填充系部下拉框
function  drawUsefulDepartment(departmentData){
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var g = 0; g < departmentData.length; g++) {
		str += '<option value="' + departmentData[g].edu104_ID + '">' + departmentData[g].xbmc
			+ '</option>';
	}
	stuffManiaSelect("#addNewClass_department", str);
}

//清空课程详情tip内容
function emptyClassDetailsArea(){
	var reObject = new Object();
	reObject.InputIds = "#addNewClass_teacheMarks,#addNewClass_teacheSays,#addNewClass_calssAdvice,#addNewClass_calssContent,#addNewClass_calssDesignIdeas,#addNewClass_calssGoal,#addNewClass_calssIntroduce,#addNewClass_calssName,#addNewClass_calssManger,#addNewClass_markName";
	reObject.normalSelectIds = "#addNewClass_department,#addNewClass_isTeachingReform,#addNewClass_isCalssTextual,#addNewClass_isTextual,#addNewClass_isNewClass,#addNewClass_isKernelClass,#addNewClass_signatureCourseLevel,#addNewClass_classLocation,#addNewClass_classWay,#addNewClass_isSchoolBusiness,#addNewClass_testWay,#addNewClass_moduleType,#addNewClass_classQuality,#addNewClass_classType,#addNewClass_classNature";
	reObject.numberInputs = "#addNewClass_theoryHours,#addNewClass_practiceHours,#addNewClass_credits,#addNewClass_disperseHours,#addNewClass_centralizedHours";
	reReloadSearchsWithSelect(reObject);
}

//确认新增课程
function comfirmAddNewClass(){
	//课程信息对象
	var newClassObject=classDetailsConfirmBtnAction();
	if(typeof newClassObject ==='undefined'){
		return;
	}

	var userKey=JSON.parse($.session.get('userInfo')).userKey;
	typeof userKey ==="undefined"?userKey="":userKey=userKey;

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addNewClass",
		data: {
             "newClassInfo":JSON.stringify(newClassObject),
			 "userKey":userKey,
			 "approvalobect":JSON.stringify(getApprovalobect("01"))
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
			if (backjson.code == 200) {
				newClassObject.bf200_ID=backjson.data.newId;
				newClassObject.kcdm=backjson.data.kcdm;
				newClassObject.zt=backjson.data.zt;
				newClassObject.lrsj=backjson.data.lrsj;
				newClassObject.kcfzr=$("#addNewClass_calssManger").val();
				$('#courseLibraryTable').bootstrapTable("prepend", newClassObject);
				toastr.success(backjson.msg);
				$.hideModal("#addNewClassModal");
				$("#addNewClass_calssManger").removeAttr("mangerId");
				$(".myTooltip").tooltipify();
				drawPagination(".courseLibraryTableArea", "课程信息");
			} else {
				toastr.warning(backjson.msg);
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
			 if (backjson.code === 200) {
				    hideloding();
			 		stuffAllClassMangersTable(backjson.data);
			 		$.hideModal("#addNewClassModal",false);
			 		$.showModal("#allClassMangersModal",true);
			 	 } else {
					toastr.warning(backjson.msg);
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
				field : 'szxbmc',
				title : '二级学院',
				align : 'left',
				formatter : paramsMatter

			}, {
				field : 'xm',
				title : '姓名',
				align : 'left',
				formatter : paramsMatter
			}, {
				field : 'jzgh',
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
	$("#addNewClass_calssManger").val(choosedManger[0].xm);
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

	if(getNormalSelectValue("addNewClass_department") === ""){
		toastr.warning('请选择课程所属二级学院');
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
	newClassObject.departmentCode=getNormalSelectValue("addNewClass_department");
	newClassObject.departmentName=getNormalSelectText("addNewClass_department");
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

//获得审批流对象
function getApprovalobect(type){
	//课程审批流对象
	var approvalObject=new Object();
	approvalObject.businessType=type;
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//单个删除课程
function removeCourse(row){
	if(row.zt==="passing"){
		toastr.warning('该课程暂不可进行此操作');
		return;
	}
	var idArray=new Array();
	idArray.push(row.bf200_ID);
	removeClassesCheckCrouseIsInPlan(idArray);
}

//多选删除课程
function removeClasses(){
	var choosedClass =choosendCrouse;
	if(choosedClass.length==0){
		toastr.warning('请选择课程');
		return;
	}

	for (var i = 0; i < choosedClass.length; i++) {
		if(choosedClass[i].zt==="passing"){
			toastr.warning('有课程不可进行此操作');
			return;
		}
	}

	var idArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		idArray.push(choosedClass[i].bf200_ID);
	}
	removeClassesCheckCrouseIsInPlan(idArray);
}

//删除检查课程是否有存在培养计划的
function removeClassesCheckCrouseIsInPlan(idArray){
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkCrouseIsInPlan",
		data: {
          "deleteIds":JSON.stringify(idArray)
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
					toastr.warning('不能删除有培养计划的课程');
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
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/libraryReomveClassByID",
		data: {
          "deleteIds":JSON.stringify(idArray)
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
				for (var i = 0; i < idArray.length; i++) {
					$("#courseLibraryTable").bootstrapTable('removeByUniqueId', idArray[i]);
				}
				$.hideModal("");
				toastr.success(backjson.msg);
				toolTipUp(".myTooltip");
				drawPagination(".courseLibraryTableArea", "课程信息");
			} else {
				toastr.warning(backjson.msg);
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
	var department=getNormalSelectValue("department");


	var serachObject=new Object();
	serachObject.kcdm=courseCode;
	serachObject.kcmc=courseName;
	serachObject.bzzymc=markName;
	serachObject.kcxzCode=coursesNature
	serachObject.zt=status;
	serachObject.departmentCode=department;

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarySeacchClass",
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
				toastr.success(backjson.msg);
				stuffCourseLibraryTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawCourseLibraryEmptyTable();
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
	mangerName===""?serachObject.xm="":serachObject.xm=mangerName;
	mangerNumber===""?serachObject.jzgh="":serachObject.jzgh=mangerNumber;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacher",
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
				 stuffAllClassMangersTable(backjson.data);
			 	 } else {
					toastr.warning(backjson.msg);
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
	deafultSearch();
}

//批量导入课程
function importClasses(){
	$.showModal("#importNewClassModal",true);
	$("#NewClassFile,#showFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#NewClassFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#NewClassFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#NewClassFile").val("");
			return
		}
		$("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	//下载导入模板
	$('#loadNewClassModel').unbind('click');
	$('#loadNewClassModel').bind('click', function(e) {
		loadNewClassModel();
		e.stopPropagation();
	});
}

//下载导入模板
function loadNewClassModel(){
	var $eleForm = $("<form method='get'></form>");
	$eleForm.attr("action", "/downloadNewClassModel"); //下载文件接口
	$(document.body).append($eleForm);
	//提交表单，实现下载
	$eleForm.submit();
}

//检验导入模板
function checkNewClassFile(){
	if ($("#NewClassFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	 var formData = new FormData();
	    formData.append("file",$('#NewClassFile')[0].files[0]);

	    $.ajax({
	        url:'/verifiyImportNewClassFile',
	        dataType:'json',
	        type:'POST',
	        async: true,
	        data: formData,
	        processData : false, // 使数据不做处理
	        contentType : false, // 不要设置Content-Type请求头
	        success: function(backjosn){
	        	if(backjosn.result){
	        		$(".fileLoadingArea").hide();
	        		if(!backjosn.isExcel){
	        			showImportErrorInfo("#importNewClassModal","请上传xls或xlsx类型的文件");
	        		   return
	        		}
	        		if(!backjosn.sheetCountPass){
	        			showImportErrorInfo("#importNewClassModal","上传文件的标签页个数不正确");
	        		   return
	        		}
	        		if(!backjosn.modalPass){
	        			showImportErrorInfo("#importNewClassModal","模板格式与原始模板不对应");
	        		   return
	        		}
	        		if(!backjosn.haveData){
	        			showImportErrorInfo("#importNewClassModal","文件暂无数据");
	        		   return
	        		}
	        		if(!backjosn.dataCheck){
	        			showImportErrorInfo("#importNewClassModal",backjosn.checkTxt);
	        		   return
	        		}
	        		
	        		showImportSuccessInfo("#importNewClassModal",backjosn.checkTxt);
	        	}else{
	        	  toastr.warning('操作失败，请重试');
	        	}
	        },beforeSend: function(xhr) {
				$(".fileLoadingArea").show();
			},
			error: function(textStatus) {
				requestError();
			},
			complete: function(xhr, status) {
				requestComplete();
			},
	    });
}

//确认导入课程
function confirmImportNewClass(){
	if ($("#NewClassFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	
    var lrrInfo=new Object();
    lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
	lrrInfo.userId=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
    lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;

    var formData = new FormData();
    formData.append("file",$('#NewClassFile')[0].files[0]);
    formData.append("lrrInfo",JSON.stringify(lrrInfo));
	formData.append("approvalInfo",JSON.stringify(getApprovalobect("01")));
    
    $.ajax({
        url:'/importNewClass',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
			$(".fileLoadingArea").hide();
        	if(backjosn.code === 200) {
				var importClasses=backjosn.data.importClasses;
				for (var i = 0; i <importClasses.length; i++) {
					$('#courseLibraryTable').bootstrapTable("prepend", importClasses[i]);
				}
				toastr.success(backjosn.msg);
				toolTipUp(".myTooltip");
				$.hideModal("#importNewClassModal");
			} else {
				if(!backjosn.data.isExcel){
					showImportErrorInfo("#importNewClassModal","请上传xls或xlsx类型的文件");
					return
				}
				if(!backjosn.data.sheetCountPass){
					showImportErrorInfo("#importNewClassModal","上传文件的标签页个数不正确");
					return
				}
				if(!backjosn.data.modalPass){
					showImportErrorInfo("#importNewClassModal","模板格式与原始模板不对应");
					return
				}
				if(!backjosn.data.haveData){
					showImportErrorInfo("#importNewClassModal","文件暂无数据");
					return
				}
				if(!backjosn.data.dataCheck){
					showImportErrorInfo("#importNewClassModal",backjosn.data.checkTxt);
					return
				}
				toastr.warning(backjosn.msg);
			}
        },beforeSend: function(xhr) {
           $(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
    });
}

//预备批量更新课程
function modifyClasses(){
	var choosendClasses =  choosendCrouse;
	if(choosendClasses.length===0){
		toastr.warning('暂未选择课程');
		return;
	}
	
	var checkIdArray=new Array();
	for (var i = 0; i < choosendClasses.length; i++) {
		checkIdArray.push(choosendClasses[i].bf200_ID);
	}
	 
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkCrouseIsInPlan",
		data: {
          "deleteIds":JSON.stringify(checkIdArray)
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
					$("#actionModal").find(".actionTxt").html("有课程存在培养计划,是否还要修改？");
					
					//事件绑定
					$('.confirmAction').unbind('click');
					$('.confirmAction').bind('click', function(e) {
						$.hideModal("#actionModal",false);
						modifyClassesSecondStep(checkIdArray);
						e.stopPropagation();
					});
				}else{
					modifyClassesSecondStep(checkIdArray);
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//批量修改课程二次确认
function modifyClassesSecondStep(checkIdArray){
	$.showModal("#modifyClassesModal",true);
	$("#ModifyClassesFile,#showModifyFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#ModifyClassesFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#ModifyClassesFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#ModifyClassesFile").val("");
			return
		}
		$("#showModifyFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	
	//检验更新文件
	$('#checkModifyClassesFile').unbind('click');
	$('#checkModifyClassesFile').bind('click', function(e) {
		checkModifyClassesFile();
		e.stopPropagation();
	});
	
	//下载更新模板
	$('#loadModifyClassesModal').unbind('click');
	$('#loadModifyClassesModal').bind('click', function(e) {
		loadModifyClassesModal(checkIdArray);
		e.stopPropagation();
	});
	
	//提交批量修改课程
	$('.confirmModifyClasses').unbind('click');
	$('.confirmModifyClasses').bind('click', function(e) {
		confirmModifyClasses();
		e.stopPropagation();
	});
}

//下载更新模板
function loadModifyClassesModal(checkIdArray){
	 var url = "/downloadModifyClassesModal";
     var modifyTeacherIDs = JSON.stringify(checkIdArray) ;
     var form = $("<form></form>").attr("action", url).attr("method", "post");
     form.append($("<input></input>").attr("type", "hidden").attr("name", "modifyClassesIDs").attr("value", modifyTeacherIDs));
     form.appendTo('body').submit().remove();
}

//检验更新文件
function checkModifyClassesFile(){
	if ($("#ModifyClassesFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	
	var formData = new FormData();
	formData.append("file",$('#ModifyClassesFile')[0].files[0]);
	
    $.ajax({
        url:'/verifiyModifyClassesFile',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
        	if(backjosn.result){
        		$(".fileLoadingArea").hide();
        		if(!backjosn.isExcel){
        			showImportErrorInfo("#modifyClassesModal","请上传xls或xlsx类型的文件");
        		   return
        		}
        		if(!backjosn.sheetCountPass){
        			showImportErrorInfo("#modifyClassesModal","上传文件的标签页个数不正确");
        		   return
        		}
        		if(!backjosn.modalPass){
        			showImportErrorInfo("#modifyClassesModal","模板格式与原始模板不对应");
        		   return
        		}
        		if(!backjosn.haveData){
        			showImportErrorInfo("#modifyClassesModal","文件暂无数据");
        		   return
        		}
        		if(!backjosn.dataCheck){
        			showImportErrorInfo("#modifyClassesModal",backjosn.checkTxt);
        		   return
        		}
        		
        		showImportSuccessInfo("#modifyClassesModal",backjosn.checkTxt);
        	}else{
        	  toastr.warning('操作失败，请重试');
        	}
        },beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
    });
}

//提交批量修改课程
function confirmModifyClasses(){
	if ($("#ModifyClassesFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}

	var lrrInfo=new Object();
	lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
	lrrInfo.userId=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;
	
    var formData = new FormData();
    formData.append("file",$('#ModifyClassesFile')[0].files[0]);
    formData.append("lrrInfo",JSON.stringify(lrrInfo));
	formData.append("approvalInfo",JSON.stringify(getApprovalobect("01")));

    $.ajax({
        url:'/modifyClassess',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
			$(".fileLoadingArea").hide();
        	if(backjosn.code === 200) {
				var choosendClasses = backjosn.data.modifyClassesInfo;
				for (var i = 0; i < choosendClasses.length; i++) {
					$("#courseLibraryTable").bootstrapTable("updateByUniqueId", {id: choosendClasses[i].bf200_ID, row: choosendClasses[i]});
				}
				toastr.success(backjosn.msg);
				$.hideModal("#modifyClassesModal");
				toolTipUp(".myTooltip");
			} else {

				if(!backjosn.data.isExcel){
					showImportErrorInfo("#modifyClassesModal","请上传xls或xlsx类型的文件");
					return
				}
				if(!backjosn.data.sheetCountPass){
					showImportErrorInfo("#modifyClassesModal","上传文件的标签页个数不正确");
					return
				}
				if(!backjosn.data.modalPass){
					showImportErrorInfo("#modifyClassesModal","模板格式与原始模板不对应");
					return
				}
				if(!backjosn.data.haveData){
					showImportErrorInfo("#modifyClassesModal","文件暂无数据");
					return
				}
				if(!backjosn.data.dataCheck){
					showImportErrorInfo("#modifyClassesModal",backjosn.data.checkTxt);
					return
				}
				toastr.warning(backjosn.msg);
			}

        },beforeSend: function(xhr) {
           $(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
    });
}

//预备停用课程
function stopClass(){
	var choosed=choosendCrouse;
	if(choosed.length===0){
		toastr.warning('请选择课程');
		return ;
	}
	for (var i = 0; i < choosed.length; i++) {
		if(choosed[i].zt==="passing"||choosed[i].zt==="stop"||choosed[i].zt==="nopass"){
			toastr.warning('有课程不可进行此操作');
			return;
		}
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("课程");
	$(".remindActionType").html("停用");
	// 确认按钮改变事件
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var choosedCrouseArray=new Array();
		for (var i = 0; i < choosed.length; i++) {
			choosedCrouseArray.push(choosed[i].bf200_ID);
		}
		confirmStopClass(choosedCrouseArray,choosed);
		e.stopPropagation();
	});
}

//确认停课操作
function confirmStopClass(choosedCrouseArray,choosedCrouse){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/stopClass",
		data: {
			"choosedCrouse":JSON.stringify(choosedCrouseArray),
			"approvalobect":JSON.stringify(getApprovalobect("02"))
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
				for (var i = 0; i < choosedCrouse.length; i++) {
					choosedCrouse[i].zt="passing";
					$("#courseLibraryTable").bootstrapTable("updateByUniqueId", {id: choosedCrouse[i], row: choosedCrouse[i]});
				}
				$.hideModal("#remindModal");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//页面初始化时按钮事件绑定
function binBind(){
	// 新增课程
	$('#wantAddClass').unbind('click');
	$('#wantAddClass').bind('click', function(e) {
		wantAddClass();
		e.stopPropagation();
	});
	
	//批量导入课程
	$('#importClasses').unbind('click');
	$('#importClasses').bind('click', function(e) {
		importClasses();
		e.stopPropagation();
	});
	
	//检验导入文件
	$('#checkNewClassFile').unbind('click');
	$('#checkNewClassFile').bind('click', function(e) {
		checkNewClassFile();
		e.stopPropagation();
	});
	
	//确认导入课程
	$('.confirmImportNewClass').unbind('click');
	$('.confirmImportNewClass').bind('click', function(e) {
		confirmImportNewClass();
		e.stopPropagation();
	});
	
	//批量更新课程
	$('#modifyClasses').unbind('click');
	$('#modifyClasses').bind('click', function(e) {
		modifyClasses();
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


	// 停用课程
	$('#stopClass').unbind('click');
	$('#stopClass').bind('click', function(e) {
		stopClass();
		e.stopPropagation();
	});
}
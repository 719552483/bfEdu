var EJDMElementInfo;
$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	drawApprovalMangerEmptyTable();
	getProposerInfo();
	btnBind();
	deafultSearch();
});

//初始化检索
function deafultSearch(){
	var searchObjet=new Object();
	searchObjet.currentUserRole=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;;
	searchObjet.proposerKey="";
	searchObjet.businessType="";
	searchObjet.examinerkey = $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;

	$.ajax({
		method: 'get',
		cache: false,
		url: "/searchApproval",
		data: {
			"approvalText":JSON.stringify(searchObjet)
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
				toastr.info(backjson.msg);
				stuffApprovalMangerTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawApprovalMangerEmptyTable();
			}
		}
	});
}

/*tab1 start*/
//获取声请人下拉框信息
function getProposerInfo(){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getProposerList",
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
			if (backjson.result) {
				if (backjson.proposerList.length === 0) {
				    return;
				}
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.proposerList.length; i++) {
					str += '<option value="' + backjson.proposerList[i].bf990_ID + '">' + backjson.proposerList[i].personName+ '</option>';
				}
				stuffManiaSelect("#sqrID", str);
				stuffManiaSelect("#fqrID", str);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充空的审批管理表
function drawApprovalMangerEmptyTable(){
	stuffApprovalMangerTable({});
}

var choosendApprovalManger=new Array();
//渲染审批管理表
function stuffApprovalMangerTable(tableInfo){
	choosendApprovalManger=new Array();
	window.releaseNewsEvents = {
		'click #approvalInfo' : function(e, value, row, index) {
			approvalInfo(row);
		},
		'click #agree' : function(e, value, row, index) {
			agree(choosendApprovalManger);
		},
		'click #disagree' : function(e, value, row, index) {
			disagree(choosendApprovalManger);
		},
		'click #confirmOption' : function(e, value, row, index) {
			confirmOption(row,index);
		},
		'click #cancelOption' : function(e, value, row, index) {
			cancelOption(row,index);
		}
	};

	$('#approvalMangerTable').bootstrapTable('destroy').bootstrapTable({
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
			fileName: '审批管理导出'  //文件名称
		},
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onCheck : function(row) {
			onCheckApprovalManger(row);
		},
		onUncheck : function(row) {
			onUncheckApprovalManger(row);
		},
		onCheckAll : function(rows) {
			onCheckAllApprovalManger(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllApprovalManger(rows2);
		},
		onDblClickRow : function(row, $element, field) {
			changeOpinions(row, $element, field);
		},
		onPageChange : function() {
			drawPagination(".approvalMangerTableArea", "审批信息");
			for (var i = 0; i < choosendApprovalManger.length; i++) {
				$("#approvalMangerTable").bootstrapTable("checkBy", {field:"edu600Id", values:[choosendApprovalManger[i].edu600Id]})
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns : [ {
			field : 'edu600Id',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		},{
			field: 'check',
			checkbox: true
		}, {
			field : 'businessName',
			title : '审批业务类型',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'keyWord',
			title : '审批关键词',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},  {
			field : 'proposerName',
			title : '申请人',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'creatDate',
			title : '发起时间',
			align : 'left',
			sortable: true,
			formatter : creatDateMatter
		},{
			field : 'lastPersonName',
			title : '上一步执行人',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'lastApprovalOpinions',
			title : '上一步审批意见',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		}, {
			field : 'approvalOpinions',
			title : '审批意见(双击修改)',
			align : 'left',
			formatter : approvalOpinionsMatter
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
		+ '<li id="approvalInfo" class="btnxq'+index+'"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
		+ '<li id="agree" class="btnty'+index+'"><span><img src="img/right.png" style="width:24px"></span>同意</li>'
		+ '<li id="disagree" class="btnbty'+index+'"><span><img src="images/close1.png"></span>不同意</li>'
		+ '<li id="confirmOption" class="noneStart btnqr'+index+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>'
		+ '<li id="cancelOption" class="noneStart btnqx'+index+'"><span><img src="images/t03.png" style="width:24px"></span>取消</li>'
		+ '</ul>' ].join('');
	}

	function creatDateMatter(value, row, index) {
		return [ '<div class="myTooltip" title="'+timeStamp2String(value)+'">'+timeStamp2String(value)+'</div>' ]
			.join('');
	}

	//审批意见格式化渲染
	function approvalOpinionsMatter(value, row, index,tableId){
		var configTxt="";
		row.approvalOpinions==null||row.approvalOpinions===""?configTxt="暂无":configTxt=row.approvalOpinions;
		return [ '<div class="approvalOpinionArea">' +
		'<div class="normalTxt myTooltip showOption'+index+'" title="'+configTxt+'">'+configTxt+'</div>'+
		'<input name="" type="text" class="myInput manyInfoInput noneStart '+tableId+'Opinion'+index+'" id="optionInput'+index+'" placeholder="请填写审批意见..."/>' +
		'</div>' ]
			.join('');
	}

	drawPagination(".approvalMangerTableArea", "审批信息");
	drawSearchInput(".approvalMangerTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".approvalMangerTableArea", "审批信息");
}

//单选学生
function onCheckApprovalManger(row){
	if(choosendApprovalManger.length<=0){
		choosendApprovalManger.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendApprovalManger.length; i++) {
			if(choosendApprovalManger[i].edu600Id===row.edu600Id){
				add=false;
				break;
			}
		}
		if(add){
			choosendApprovalManger.push(row);
		}
	}
}

//单反选学生
function onUncheckApprovalManger(row){
	if(choosendApprovalManger.length<=1){
		choosendApprovalManger.length=0;
	}else{
		for (var i = 0; i < choosendApprovalManger.length; i++) {
			if(choosendApprovalManger[i].edu600Id===row.edu600Id){
				choosendApprovalManger.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllApprovalManger(row){
	for (var i = 0; i < row.length; i++) {
		choosendApprovalManger.push(row[i]);
	}
}

//全反选学生
function onUncheckAllApprovalManger(row){
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu600Id);
	}


	for (var i = 0; i < choosendApprovalManger.length; i++) {
		if(a.indexOf(choosendApprovalManger[i].edu600Id)!==-1){
			choosendApprovalManger.splice(i,1);
			i--;
		}
	}
}

//双击事件  改变审批意见
function changeOpinions(row, $element, field){
	var index =parseInt($element[0].dataset.index);
	if(field!=="approvalOpinions"){
		return;
	}
	$(".showOption"+index).hide();
	$("#optionInput"+index).show().focus();
	$(".btnxq"+index).hide();
	$(".btnty"+index).hide();
	$(".btnbty"+index).hide();
	$(".btnqr"+index).show();
	$(".btnqx"+index).show();
}

//确认修改审批意见
function confirmOption(row,index){
	var changeOptin=$("#optionInput"+index).val();
	if(changeOptin!==row.approvalOpinions){
		row.approvalOpinions=changeOptin;
		$('#approvalMangerTable').bootstrapTable('updateRow', {
			index: index,
			row: row
		});
	}
	cancelOption(row,index);
}

//取消修改审批意见
function cancelOption(row,index){
	$(".showOption"+index).show();
	$("#optionInput"+index).hide();
	$(".btnxq"+index).show();
	$(".btnty"+index).show();
	$(".btnbty"+index).show();
	$(".btnqr"+index).hide();
	$(".btnqx"+index).hide();
}

//查看审批详情
function approvalInfo(row) {
	var sendObject=new Object();
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getApprovalDeatils",
		data: {
			"approvalText":JSON.stringify(row),
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
			if (backjson.result) {
				judgmentBusinessShowArea(row.businessType,backjson.businessInfo);
			} else {
				toastr.warning('操作，请重试');
			}
		}
	});
}

//根据业务类型展示相应的业务详情区域
function judgmentBusinessShowArea(businessType,businessInfo){
	if(businessInfo==null){
		toastr.warning('业务数据已被删除');
		return ;
	}
	$.showModal("#approvalDetailsModal",false);
	$('#approvalDetailsModal').find(".modal-body").find(".myInput").attr("disabled", true) // 将input元素设置为readonly
   if(businessType==="01"||businessType==="02"){//课程审批
	   stuffClassInfoArea(businessInfo);
   }else if(businessType==="03"){//培养计划审批
	   stuffCulturePlanInfoArea(businessInfo);
   }else if(businessType==="04"){//教学任务书审批
	   stuffTaskInfoArea(businessInfo);
   }else if(businessType==="05"){//学生审批
	   stuffStudentInfoArea(businessInfo);
   }else if(businessType==="06"){//出差审批
	   stuffChuChaiInfoArea(businessInfo);
   }else if(businessType==="07"){ //外聘教师审批
	   stuffTeacherInfoArea(businessInfo);
   }else if(businessType==="08"){//考试审批
	   stuffExamInfoArea(businessInfo);
   }else if(businessType==="09"){//成绩录入延迟审批
	   stuffGradeEnteryArea(businessInfo);
   }
}

//填充课程审批信息区域
function stuffClassInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("课程审批详情");
	$(".gradeEnteryArea,.studentStopApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.teacherApprovalArea,.examApprovalArea,.chuChaiApprovalArea").hide();
	$(".classApprovalArea").show();
	$("#className").val(businessInfo.kcmc);
	$("#classCode").val(businessInfo.kcdm);
	$("#calssFzr").val(businessInfo.kcfzr);
	$("#calssType").val(businessInfo.kclx);
	$("#calssXz").val(businessInfo.kcxz);
	$("#calssLlxs").val(businessInfo.llxs);
	$("#calssSjxs").val(businessInfo.sjxs);
	$("#classJzxs").val(businessInfo.jzxs);
	$("#classFsxs").val(businessInfo.fsxs);
	$("#calssZxs").val(businessInfo.zxs);
	$("#classXf").val(businessInfo.xf);
	$("#classBz").val(businessInfo.bz);
	var ksfsTxt="";
	var ksfsArray=EJDMElementInfo.ksfs;
	for (var i = 0; i < ksfsArray.length; i++) {
       if(businessInfo.ksfs===ksfsArray[i].ejdm){
		   ksfsTxt=ksfsArray[i].ejdmz;
	   }
	}
	$("#classKsff").val(ksfsTxt);
}

//培养计划审批信息区域
function stuffCulturePlanInfoArea(businessInfo){
	$(".culturePlanApprovalArea").empty();
	var Str="";
	for (var i = 0; i < businessInfo.length; i++) {
		Str+='<div class="singlePlan">' +
			'<span><cite>课程名称：</cite><b>'+businessInfo[i].kcmc+'</b></span>'+
			'<span><cite>课程类型：</cite><b>'+businessInfo[i].kclx+'</b></span>'+
			'<span><cite>考试方式：</cite><b>'+businessInfo[i].ksfs+'</b></span><div class="clear"></div>'+
			'<span><cite>总学时：</cite><b>'+businessInfo[i].zxs+'</b></span>'+
			'<span><cite>理论学时：</cite><b>'+businessInfo[i].llxs+'</b></span>'+
			'<span><cite>实践学时：</cite><b>'+businessInfo[i].sjxs+'</b></span><div class="clear"></div>'+
			'<span><cite>集中学时：</cite><b>'+businessInfo[i].jzxs+'</b></span>'+
			'<span><cite>分散学时：</cite><b>'+businessInfo[i].fsxs+'</b></span>'+
			'<span><cite>学分：</cite><b>'+businessInfo[i].xf+'</b></span></div><div class="clear"></div>'
	}
	$(".culturePlanApprovalArea").append(Str);
	$("#approvalDetailsModal").find(".moadalTitle").html("培养计划审批详情");
	$(".gradeEnteryArea,.classApprovalArea,.studentStopApprovalArea,.taskApprovalArea,.teacherApprovalArea,.examApprovalArea,.chuChaiApprovalArea").hide();
	$(".culturePlanApprovalArea").show();
}

//教学任务书审批信息区域
function stuffTaskInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("教学任务书审批详情");
	$(".gradeEnteryArea,.classApprovalArea,.culturePlanApprovalArea,.studentStopApprovalArea,.teacherApprovalArea,.examApprovalArea,.chuChaiApprovalArea").hide();
	$(".taskApprovalArea").show();
	$("#task_jxbmc").val(businessInfo.className);
	$("#task_kcmc").val(businessInfo.kcmc);
	$("#task_jxbrs").val(businessInfo.jxbrs);
	$("#task_ls").val(businessInfo.lsmc);
	$("#task_zyls").val(businessInfo.zylsmc);
	$("#task_kkbm").val(businessInfo.kkbm);
	$("#task_pkbm").val(businessInfo.pkbm);
	businessInfo.sfxylcj==="T"?$("#task_sfxylcj").val("是"):$("#task_sfxylcj").val("否");
}

//填充学生信息区域
function stuffStudentInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("学生休学审批详情");
	$(".gradeEnteryArea,.classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.teacherApprovalArea,.examApprovalArea,.chuChaiApprovalArea").hide();
	$(".studentStopApprovalArea").show();
	$("#studentName").val(businessInfo.xm);
	$("#studentXH").val(businessInfo.xh);
	$("#studentAge").val(businessInfo.nl);
	businessInfo.xb==="M"?$("#studentSex").val("男"):$("#studentSex").val("女");
	$("#studentNation").val(businessInfo.mz);
	$("#studentBrithdate").val(businessInfo.csrq);
	$("#studentLevel").val(businessInfo.pyccmc);
	$("#studentDepartment").val(businessInfo.szxbmc);
	$("#studentGrade").val(businessInfo.njmc);
	$("#studentMajor").val(businessInfo.zymc);
	$("#studentClass").val(businessInfo.xzbname);
	$("#studentIDcard").val(businessInfo.sfzh);
	$('#approvalDetailsModal').find(".modal-body").find(".myInput").attr("disabled", true) // 将input元素设置为readonly
}

//填充出差信息区域
function stuffChuChaiInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("出差审批详情");

	$(".gradeEnteryArea,.classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.studentStopApprovalArea,.teacherApprovalArea,.examApprovalArea").hide();
	$(".chuChaiApprovalArea").show();
	$("#chuchai_ksrq").val(businessInfo.startTime);
	$("#chuchai_jsrq").val(businessInfo.endTime);
	$("#chuchai_ccd").val(businessInfo.destination);
	$("#chuchai_bz").val(businessInfo.businessExplain);
	var str='';
	var teachers=businessInfo.teacherName.split(",");
	for (var i = 0; i < teachers.length; i++) {
		str+='<div class="col5 singleTeacher1 recordsImg2">'+teachers[i]+'</div>';
	}
	$(".singleRecordsArea1").append(str);
}

//填充外聘教师信息区域
function stuffTeacherInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("外聘教师审批详情");
	$(".gradeEnteryArea,.classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.studentStopApprovalArea,.examApprovalArea,.chuChaiApprovalArea").hide();
	$(".teacherApprovalArea").show();
	$("#teacherName").val(businessInfo.xm);
	$("#teacherJzgh").val(businessInfo.jzgh);
	businessInfo.xb==="M"?$("#teachetSex").val("男"):$("#teachetSex").val("女");
	$("#teacherAge").val(businessInfo.nl);
	$("#teacherType").val(businessInfo.jzglx);
	$("#teacherBrithdate").val(businessInfo.csrq);
	$("#teacherIDcard").val(businessInfo.sfzh);
	$("#teacherDeapartment").val(businessInfo.szxbmc);
	$("#teacherMajor").val(businessInfo.zymc);
	businessInfo.hf==="T"?$("#teacherMajor").val("已婚"):$("#teacherMajor").val("未婚");
	$("#teacherNation").val(businessInfo.mz);
	$("#teacherZc").val(businessInfo.zc);
	$("#teacherWhcd").val(businessInfo.whcd);
	$("#teacherDxsj").val(businessInfo.dxsj);
	$("#teacherZzmm").val(businessInfo.zzmm);
	$("#teacherLxfs").val(businessInfo.lxfs);
}

//填充考试信息区域
function stuffExamInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("考试审批详情");
	$(".gradeEnteryArea,.classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.studentStopApprovalArea,.teacherApprovalArea,.chuChaiApprovalArea").hide();
	$(".examApprovalArea").show();
	$("#exam_kcmc").val(businessInfo.kcmc);
	$("#exam_bj").val(businessInfo.className);
	$("#exam_jxbrs").val(businessInfo.jxbrs);
	$("#exam_zxs").val(businessInfo.zxs);
	businessInfo.sfxylcj==="T"?$("#exam_sfxylcj").val("是"):$("#exam_sfxylcj").val("否");
	$("#exam_kkbm").val(businessInfo.kkbm);
	$("#exam_pkbm").val(businessInfo.pkbm);
}

//填充成绩录入延迟区域
function stuffGradeEnteryArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("成绩录入延迟审批详情");
	$(".examApprovalArea,.classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.studentStopApprovalArea,.teacherApprovalArea,.chuChaiApprovalArea").hide();
	$(".gradeEnteryArea").show();
	$("#gradeEntery_crouse").val(businessInfo.courseName);
	$("#gradeEntery_calss").val(businessInfo.className);
}

//审批通过
function agree(row){
	if(row.length==0){
		toastr.warning("暂未勾选审批");
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("所选审批记录");
	$(".remindActionType").html("审核通过");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		approvaAction(row,"1","#approvalMangerTable");
		e.stopPropagation();
	});
}

//审批不通过
function disagree(row){
	if(row.length==0){
		toastr.warning("暂未勾选审批");
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("所选审批记录");
	$(".remindActionType").html("审核不通过");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		approvaAction(row,"2","#approvalMangerTable");
		e.stopPropagation();
	});
}

//审批管理开始检索
function startSearch(){
      var searchObjet=new Object();
	  searchObjet.currentUserRole=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	  searchObjet.proposerKey=getNormalSelectValue("sqrID");
	  searchObjet.businessType=getNormalSelectValue("splx");
	  searchObjet.examinerkey = $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;

		$.ajax({
			method: 'get',
			cache: false,
			url: "/searchApproval",
			data: {
				"approvalText":JSON.stringify(searchObjet)
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
					toastr.success(backjson.msg);
					stuffApprovalMangerTable(backjson.data);
				} else {
					toastr.warning(backjson.msg);
					drawApprovalMangerEmptyTable();
				}
			}
		});
}

// 审批管理重置检索
function reReloadSearchs(){
	var reObject = new Object();
	reObject.normalSelectIds = "#sqrID,#splx";
	reReloadSearchsWithSelect(reObject);
	deafultSearch();
}
/*tab1 end*/

/*tab2 start*/
//初始化追回区域
function configTAB2(){
	drawApprovalBackEmptyTable();
}

//追回开始检索
function startSearchTab2(){
	var searchObjet=new Object();
	searchObjet.currentUserRole=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	searchObjet.proposerKey=getNormalSelectValue("fqrID");
	searchObjet.businessType=getNormalSelectValue("splxForTab2");

	searchObjet.examinerkey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;

	$.ajax({
		method: 'get',
		cache: false,
		url: "/searchCanBackApproval",
		data: {
			"approvalText":JSON.stringify(searchObjet)
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
			if (backjson.result) {
				if (backjson.approvalList.length === 0) {
	             drawApprovalBackEmptyTable();
					toastr.warning('暂无数据');
					return;
				}
				stuffApprovalBackTable(backjson.approvalList);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充空的追回表
function drawApprovalBackEmptyTable(){
	stuffApprovalBackTable({});
}

//渲染追回表
function stuffApprovalBackTable(tableInfo){
	window.releaseNewsEvents = {
		'click #approvalBackInfo' : function(e, value, row, index) {
			approvalBackInfo(row);
		},
		'click #approvalBack' : function(e, value, row, index) {
			approvalBack(row);
		}
	};

	$('#approvalBackTable').bootstrapTable('destroy').bootstrapTable({
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
			fileName: '审批管理导出'  //文件名称
		},
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onDblClickRow : function(row, $element, field) {
			changeOpinions(row, $element, field,'#approvalBackTable');
		},
		onPageChange : function() {
			drawPagination(".approvalBackTableArea", "审批信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns : [ {
			field : 'edu600Id',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		}, {
			field : 'businessName',
			title : '审批业务类型',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		}, {
			field : 'keyWord',
			title : '审批关键词',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},  {
			field : 'proposerName',
			title : '申请人',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'creatDate',
			title : '发起时间',
			align : 'left',
			sortable: true,
			formatter : creatDateMatter
		},{
			field : 'lastPersonName',
			title : '上一步审批人',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'lastApprovalOpinions',
			title : '上一步审批意见',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},  {
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
		+ '<li id="approvalBackInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
		+ '<li id="approvalBack"><span><img src="img/back.png" style="width:24px"></span>追回</li>'
		+ '</ul>' ].join('');
	}

	function creatDateMatter(value, row, index) {
		return [ '<div class="myTooltip" title="'+timeStamp2String(value)+'">'+timeStamp2String(value)+'</div>' ]
			.join('');
	}

	drawPagination(".approvalBackTableArea", "审批信息");
	drawSearchInput(".approvalBackTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".approvalBackTableArea", "审批信息");
}

//追回详情
function approvalBackInfo(row){
	approvalInfo(row);
}

//预备追回审批
function approvalBack(row){
	$.showModal("#remindModal",true);
	$(".remindType").html("该条审批记录");
	$(".remindActionType").html("审核不通过");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		approvaAction(row,"3","#approvalBackTable");
		e.stopPropagation();
	});
}

// 追回重置检索
function reReloadSearchsTab2(){
	var reObject = new Object();
	reObject.normalSelectIds = "#fqrID,#splxForTab2";
	reReloadSearchsWithSelect(reObject);
	startSearchTab2();
}
/*tab2 end*/

//审核的操作
function approvaAction(row,approvalText,tableID){
	row.approvalFlag=approvalText;
	row.examinerkey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	$.ajax({
		method: 'get',
		cache: false,
		url: "/approvalOperation",
		data: {
			"approvalText":JSON.stringify(row)
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
			if (backjson.result) {
				$(tableID).bootstrapTable('removeByUniqueId',row.edu600Id);
				drawPagination(".approvalMangerTableArea", "审批信息");
				drawSearchInput(".approvalMangerTableArea");
				toastr.success('审批流转成功');
				$(".myTooltip").tooltipify();
				$.hideModal("#remindModal");
			} else {
				toastr.warning('审批流转失败，请重试');
			}
		}
	});
}

//页面按钮时间绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	// 审批管理开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	// 追回开始检索
	$('#startSearchTab2').unbind('click');
	$('#startSearchTab2').bind('click', function(e) {
		startSearchTab2();
		e.stopPropagation();
	});

	// 审批管理重置检索
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});

	// 追回重置检索
	$('#reReloadSearchsTab2').unbind('click');
	$('#reReloadSearchsTab2').bind('click', function(e) {
		reReloadSearchsTab2();
		e.stopPropagation();
	});
}
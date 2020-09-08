var EJDMElementInfo;
$(function() {
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
	searchObjet.currentUserRole="";
	searchObjet.proposerKey="";
	searchObjet.businessType="";
	searchObjet.examinerkey= "";

	$.ajax({
		method: 'get',
		cache: false,
		url: "/getApprovalHistory",
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
				if (backjson.approvalHistory.length === 0) {
					toastr.info('暂无数据');
					drawApprovalMangerEmptyTable();
					return;
				}
				toastr.info("共找到"+backjson.approvalHistory.length+"条审批记录");
				stuffApprovalMangerTable(backjson.approvalHistory);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}


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

//渲染审批管理表
function stuffApprovalMangerTable(tableInfo){
	window.releaseNewsEvents = {
		'click #approvalInfo' : function(e, value, row, index) {
			approvalInfo(row);
		},
		'click #approvalHistory' : function(e, value, row, index) {
			approvalHistory(row);
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
			fileName: '审批历史记录导出'  //文件名称
		},
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".approvalMangerTableArea", "审批信息");
		},
		columns : [ {
			field : 'edu600Id',
			title: '唯一标识',
			align : 'center',
			visible : false
		}, {
			field : 'businessName',
			title : '审批业务类型',
			align : 'left',
			formatter :paramsMatter
		}, {
			field : 'keyWord',
			title : '审批关键词',
			align : 'left',
			formatter :paramsMatter
		}, {
			field : 'proposerName',
			title : '申请人',
			align : 'left',
			formatter : paramsMatter
		},{
			field : 'creatDate',
			title : '发起时间',
			align : 'left',
			formatter : creatDateMatter
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
		+ '<li id="approvalInfo"><span><img src="img/info.png" style="width:24px"></span>业务详情</li>'
		+ '<li id="approvalHistory"><span><img src="img/info.png" style="width:24px"></span>流程查看</li>'
		+ '</ul>' ].join('');
	}

	function creatDateMatter(value, row, index) {
		return [ '<div class="myTooltip" title="'+timeStamp2String(value)+'">'+timeStamp2String(value)+'</div>' ]
			.join('');
	}

	drawPagination(".approvalMangerTableArea", "审批信息");
	drawSearchInput(".approvalMangerTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".approvalMangerTableArea", "审批信息");
}

//流程查看
function approvalHistory(row){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getHistoryDetail",
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
				$.showModal("#historyModal",false);
				$("#historyModal").find(".moadalTitle").html(backjson.approvalHistory[0].businessName+"历史信息");
				$(".historyInfo").empty();
				var historyTxt="";
				for (var i = 0; i < backjson.approvalHistory.length; i++) {
					var currentHistory= backjson.approvalHistory[i];
					historyTxt+='<div class="historyArea"><p class="Historystep">Step'+(i+1)+'</p><div>' +
						'<span><cite>业务类型：</cite><b>'+nullMatter(currentHistory.businessName)+'</b></span>'+
						'<span><cite>创建时间：</cite><b>'+nullMatter(timeStamp2String(currentHistory.creatDate))+'</b></span>'+
						'<span><cite>发起人：</cite><b>'+nullMatter(currentHistory.proposerName)+'</b></span>'+
						'<span><cite>操作人：</cite><b>'+nullMatter(currentHistory.examinerName)+'</b></span>'+
						'<span><cite>审批意见：</cite><b>'+nullMatter(currentHistory.approvalOpinions)+'</b></span>'+
						'<span><cite>审批结果：</cite><b>'+nullMatter(ejdm2txt(currentHistory.approvalState))+'</b></span>'+
						'<span><cite>操作时间：</cite><b>'+nullMatter(timeStamp2String(currentHistory.updateDate))+'</b></span>'+
						'</div></div>' ;
					if((i+1)!=backjson.approvalHistory.length){
						historyTxt+='<img class="spiltImg" src="images/uew_icon_hover.png"></img>';
					}
				}
				$(".historyInfo").append(historyTxt);
			} else {
				toastr.warning('操作，请重试');
			}
		}
	});
}

//获取耳机代码转为页面展示文字
function ejdm2txt(str){
	var returnStr="";
	var spztArray=EJDMElementInfo.spzt;
	for (var i = 0; i < spztArray.length; i++) {
		if(str===spztArray[i].ejdm){
			returnStr=spztArray[i].ejdmz;
		}
	}
	return returnStr;
}

//查看审批详情
function approvalInfo(row) {
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getApprovalDeatils",
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
				$.showModal("#approvalDetailsModal",false);
				judgmentBusinessShowArea(row.businessType,backjson.businessInfo);
			} else {
				toastr.warning('操作，请重试');
			}
		}
	});
}

//根据业务类型展示相应的业务详情区域
function judgmentBusinessShowArea(businessType,businessInfo){
	$('#approvalDetailsModal').find(".modal-body").find(".myInput").attr("disabled", true) // 将input元素设置为readonly
   if(businessType==="01"||businessType==="02"){//课程审批
	   stuffClassInfoArea(businessInfo);
   }else if(businessType==="03"){//培养计划审批
	   stuffCulturePlanInfoArea(businessInfo);
   }else if(businessType==="04"){//教学任务书审批
	   stuffTaskInfoArea(businessInfo);
   }else if(businessType==="05"){//学生审批
	   stuffStudentInfoArea(businessInfo);
   }else if(businessType==="06"||businessType==="07"){//教师审批
	   stuffTeacherInfoArea(businessInfo);
   }else if(businessType==="08"){//考试审批
	   stuffExamInfoArea(businessInfo);
   }
}

//填充课程审批信息区域
function stuffClassInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("课程审批详情");
	$(".studentStopApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.teacherApprovalArea,.examApprovalArea").hide();
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
			'<span><cite>学分：</cite><b>'+businessInfo[i].xf+'</b></span><div><div class="clear"></div>'
	}
	$(".culturePlanApprovalArea").append(Str);
	$("#approvalDetailsModal").find(".moadalTitle").html("培养计划审批详情");
	$(".classApprovalArea,.studentStopApprovalArea,.taskApprovalArea,.teacherApprovalArea,.examApprovalArea").hide();
	$(".culturePlanApprovalArea").show();
}

//教学任务书审批信息区域
function stuffTaskInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("教学任务书审批详情");
	$(".classApprovalArea,.culturePlanApprovalArea,.studentStopApprovalArea,.teacherApprovalArea,.examApprovalArea").hide();
	$(".taskApprovalArea").show();
	$("#task_jxbmc").val(businessInfo.jxbmc);
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
	$(".classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.teacherApprovalArea,.examApprovalArea").hide();
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

//填充教师信息区域
function stuffTeacherInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("学生休学审批详情");
	$(".classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.studentStopApprovalArea,.examApprovalArea").hide();
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
	$(".classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.studentStopApprovalArea,.teacherApprovalArea").hide();
	$(".examApprovalArea").show();
	$("#exam_kcmc").val(businessInfo.kcmc);
	$("#exam_bj").val(businessInfo.className);
	$("#exam_jxbrs").val(businessInfo.jxbrs);
	$("#exam_zxs").val(businessInfo.zxs);
	businessInfo.sfxylcj==="T"?$("#exam_sfxylcj").val("是"):$("#exam_sfxylcj").val("否");
	$("#exam_kkbm").val(businessInfo.kkbm);
	$("#exam_pkbm").val(businessInfo.pkbm);
}

//获取审批历史记录分组
function startSearch(){
      var searchObjet=new Object();
	  searchObjet.currentUserRole=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	  searchObjet.proposerKey=getNormalSelectValue("sqrID");
	  searchObjet.businessType=getNormalSelectValue("splx");
	  searchObjet.examinerkey= $(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");

		$.ajax({
			method: 'get',
			cache: false,
			url: "/getApprovalHistory",
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
					if (backjson.approvalHistory.length === 0) {
						toastr.warning('暂无数据');
						drawApprovalMangerEmptyTable();
						return;
					}
					stuffApprovalMangerTable(backjson.approvalHistory);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
}

// 审批管理重置检索
function reReloadSearchs(){
	var reObject = new Object();
	reObject.normalSelectIds = "#sqrID,#splx";
	reReloadSearchsWithSelect(reObject);
	drawApprovalMangerEmptyTable();
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
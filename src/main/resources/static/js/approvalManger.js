var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	drawApprovalMangerEmptyTable();
	getProposerInfo();
	btnBind();
});

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
					str += '<option value="' + backjson.proposerList[i].bf990_ID + '">' + backjson.proposerList[i].yhm+ '</option>';
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
		'click #agree' : function(e, value, row, index) {
			agree(row);
		},
		'click #disagree' : function(e, value, row, index) {
			disagree(row);
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
			field : 'lastPersonName',
			title : '上一步审批人',
			align : 'left',
			formatter : paramsMatter
		},{
			field : 'lastApprovalOpinions',
			title : '上一步审批意见',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'approvalOpinions',
			title : '审批意见(双击修改)',
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
		+ '<li id="approvalInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
		+ '<li id="agree"><span><img src="img/right.png" style="width:24px"></span>同意</li>'
		+ '<li id="disagree"><span><img src="images/close1.png"></span>不同意</li>'
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
				$.showModal("#approvalDetailsModal",false);
				stuffApprovalInfoArea(row);
				judgmentBusinessShowArea(row.businessType,backjson.businessInfo);
			} else {
				toastr.warning('操作，请重试');
			}
		}
	});
}

//填充详情模态框中审批详情
function stuffApprovalInfoArea(row){
	$("#splxlx_forDetails").val(row.businessName);
	$("#sqr_forDetails").val(row.proposerName);
	$("#fqsj_forDetails").val(timeStamp2String(row.creatDate));
	$("#sybsqr_forDetails").val(row.lastPersonName);
	$("#sybspyj_forDetails").val(row.lastApprovalOpinions);
	$("#spyj_forDetails").val(row.approvalOpinions);
	$('#approvalDetailsModal').find(".modal-body").find(".myInput").attr("disabled", true) // 将input元素设置为readonly
}

//根据业务类型展示相应的业务详情区域
function judgmentBusinessShowArea(businessType,businessInfo){
   if(businessType==="01"||businessType==="002"){//课程审批
	   stuffClassInfoArea(businessInfo);
   }else if(businessType==="03"){//培养计划审批
	   stuffCulturePlanInfoArea(businessInfo);
   }else if(businessType==="04"){//教学任务书审批
	   stuffTaskInfoArea(businessInfo);
   }else if(businessType==="05"){//学生审批
	   stuffStudentInfoArea(businessInfo);
   }else if(businessType==="06"||businessType==="07"){//教师审批

   }
}

//填充课程审批信息区域
function stuffClassInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("课程审批详情");
	$(".studentStopApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.teacherApprovalArea").hide();
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
	var culturePlanInfo=businessInfo.edu108;
	var relationInfo=businessInfo.edu107;
	$("#approvalDetailsModal").find(".moadalTitle").html("学生休学审批详情");
	$(".classApprovalArea,.studentStopApprovalArea,.taskApprovalArea,.teacherApprovalArea").hide();
	$(".culturePlanApprovalArea").show();
	$("#culturePlan_cc").val(relationInfo.edu103mc);
	$("#culturePlan_xb").val(relationInfo.edu104mc);
	$("#culturePlan_nj").val(relationInfo.edu105mc);
	$("#culturePlan_zy").val(relationInfo.edu106mc);
	$("#culturePlan_kcmc").val(culturePlanInfo.kcmc);
	$("#culturePlan_kcdm").val(culturePlanInfo.kcdm);
	$("#culturePlan_llxs").val(culturePlanInfo.llxs);
	$("#culturePlan_sjxs").val(culturePlanInfo.sjxs);
	$("#culturePlan_fsxs").val(culturePlanInfo.fsxs);
	$("#culturePlan_jzxs").val(culturePlanInfo.jzxs);
	$("#culturePlan_zxs").val(culturePlanInfo.zxs);
	$("#culturePlan_zzs").val(culturePlanInfo.zzs);
	$("#culturePlan_zxs").val(culturePlanInfo.zhouxs);
	$("#culturePlan_kclx").val(culturePlanInfo.kclx);
	$("#culturePlan_kcxz").val(culturePlanInfo.kcxz);
	$("#culturePlan_ksfs").val(culturePlanInfo.ksfs);
}

//教学任务书审批信息区域
function stuffTaskInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("学生休学审批详情");
	$(".classApprovalArea,.culturePlanApprovalArea,.studentStopApprovalArea,.teacherApprovalArea").hide();
	$(".taskApprovalArea").show();
}

//填充学生信息区域
function stuffStudentInfoArea(businessInfo){
	$("#approvalDetailsModal").find(".moadalTitle").html("学生休学审批详情");
	$(".classApprovalArea,.culturePlanApprovalArea,.taskApprovalArea,.teacherApprovalArea").hide();
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

//审批通过
function agree(row){
	$.showModal("#remindModal",true);
	$(".remindType").html("该条审批记录");
	$(".remindActionType").html("审核通过");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		approvaAction(row,"1","#approvalMangerTable");
		e.stopPropagation();
	});
}

//审批不通过
function disagree(row){
	$.showModal("#remindModal",true);
	$(".remindType").html("该条审批记录");
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
	  searchObjet.currentUserRole=JSON.parse($.session.get('authoritysInfo')).bF991_ID;
	  searchObjet.proposerKey=getNormalSelectValue("sqrID");
	  searchObjet.businessType=getNormalSelectValue("splx");

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
				if (backjson.result) {
					if (backjson.approvalList.length === 0) {
						toastr.warning('暂无数据');
						drawApprovalMangerEmptyTable();
						return;
					}
					stuffApprovalMangerTable(backjson.approvalList);
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
/*tab1 end*/

/*tab2 start*/
//初始化追回区域
function configTAB2(){
	drawApprovalBackEmptyTable();
}

//追回开始检索
function startSearchTab2(){
	var searchObjet=new Object();
	searchObjet.currentUserRole=JSON.parse($.session.get('authoritysInfo')).bF991_ID;
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
		onPageChange : function() {
			drawPagination(".approvalBackTableArea", "审批信息");
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
			field : 'lastPersonName',
			title : '上一步审批人',
			align : 'left',
			formatter : paramsMatter
		},{
			field : 'lastApprovalOpinions',
			title : '上一步审批意见',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'approvalOpinions',
			title : '审批意见(双击修改)',
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
	$.showModal("#approvalDetailsModal",false);
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
	drawApprovalBackEmptyTable();
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
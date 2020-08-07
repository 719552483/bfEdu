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
	$.showModal("#approvalDetailsModal",false);
}

//审批通过
function agree(row){
	$.showModal("#remindModal",true);
	$(".remindType").html("该条审批记录");
	$(".remindActionType").html("审核通过");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		approvaAction(row,"1");
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
		approvaAction(row,"2");
		e.stopPropagation();
	});
}

//审核的确认操作
function approvaAction(row,approvalText){
	row.approvalFlag=approvalText;
	
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
				$("#approvalMangerTable").bootstrapTable('removeByUniqueId',row.edu600Id);
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
/*tab1 end*/

/*tab2 start*/
//判断是否首次点击标签页2
function judgmentIsFristTimeLoadTab2(){

}



/*tab2 end*/

//页面按钮时间绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	// 开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
}
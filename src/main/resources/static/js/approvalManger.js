var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	drawApprovalMangerEmptyTable();
	getProposerInfo();
	btnBind();
});

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

				var str = '';
				for (var i = 0; i < backjson.proposerList.length; i++) {
					str = '<option value="' + backjson.proposerList[i].edu990_ID + '">' + backjson.proposerList[i].yhm+ '</option>';
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
			field : 'check',
			checkbox : true
		}, {
			field : 'edu600_ID',
			title: '唯一标识',
			align : 'center',
			visible : false
		}, {
			field : 'businessName',
			title : '审批业务类型',
			align : 'center',
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
			formatter : paramsMatter
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
		+ '<li class="queryBtn" id="majorTrainingInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
		+ '<li class="modifyBtn" id="modifyMajorTraining"><span><img src="images/t02.png" style="width:24px"></span>同意</li>'
		+ '<li class="deleteBtn" id="removeMajorTraining"><span><img src="images/t03.png"></span>不同意</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".approvalMangerTableArea", "审批信息");
	drawSearchInput(".approvalMangerTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".approvalMangerTableArea", "审批信息");
}

//审批管理开始检索
function startSearch(){
      var searchObjet=new Object();
	  searchObjet.currentUserRole=JSON.parse($.session.get('authoritysInfo')).bF991_ID;
	  searchObjet.proposerID=getNormalSelectValue("sqrID");
	  searchObjet.businessKey=getNormalSelectValue("splx");

		$.ajax({
			method: 'get',
			cache: false,
			url: "/searchApproval",
			data: {
				"searchApprovalObject":searchObjet
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



//判断是否首次点击标签页2
function judgmentIsFristTimeLoadTab2(){

}

//页面按钮时间绑定
function btnBind(){
	// 开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
}
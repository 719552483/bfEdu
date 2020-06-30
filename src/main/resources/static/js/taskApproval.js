$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	binBind();
	drawTaskEmptyTable();
});

//渲染空任务书表格
function drawTaskEmptyTable(){
	stuffCourseLibraryTable({});
}

//渲染任务书表格
function stuffCourseLibraryTable(tableInfo){
	window.putOutTaskEvents = {
			'click #taskDetails' : function(e, value, row, index) {
				taskDetails(row,index);
			}
		};

		$('#putOutTaskTable').bootstrapTable('destroy').bootstrapTable({
			data: tableInfo,
			pagination: true,
			pageNumber: 1,
			pageSize : 10,
			pageList : [ 10 ],
			showToggle: false,
			showFooter: false,
			clickToSelect: true,
			search: true,
			editable: false,
			striped: true,
		    sidePagination: "client",   
			toolbar: '#toolbar',
			showColumns: true,
			onPageChange: function() {
				drawPagination(".putOutTaskTableArea", "教学任务书");
			},
			columns: [
				{
					field: 'check',
					checkbox: true
				},{
					field: 'edu201_ID',
					title: '唯一标识',
					align: 'center',
					visible: false
				},
				{
					field: 'jxbmc',
					title: '教学班名称',
					align: 'left',
					formatter: paramsMatter

				}, 	{
					field: 'kcmc',
					title: '课程',
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'xzbmc',
					title: '行政班',
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'lsmc',
					title: '老师',
					clickToSelect: false,
					align: 'left',
					formatter: paramsMatter
				},{
					field: 'zylsmc',
					title: '主要老师',
					clickToSelect: false,
					align: 'left',
					formatter: paramsMatter

				},{
					field: 'sfxylcj',
					title: '是否需要录成绩',
					align: 'center',
					clickToSelect: false,
					formatter: sfxylcjMatter
				},{
					field: 'kkbm',
					title: '开课部门',
					align: 'left',
					formatter: paramsMatter
				},	{
					field: 'pkbm',
					title: '排课部门',
					align: 'left',
					formatter: paramsMatter,
					clickToSelect: false
				},	{
					field: 'sszt',
					title: '审核状态',
					align: 'center',
					formatter: ztMatter
				},	{
					field: 'fkyj',
					title: '反馈意见',
					align: 'left',
					formatter: paramsMatter
				},{
					field: 'action',
					title: '操作',
					align: 'center',
					clickToSelect: false,
					formatter: putOutTaskFormatter,
					events: putOutTaskEvents,
				}
			]
		});
		
		function putOutTaskFormatter(value, row, index) {
			return [ '<ul class="toolbar tabletoolbar">'
						+ '<li id="taskDetails"><span><img src="images/t02.png" style="width:24px"></span>详情</li>'
						+ '</ul>' ].join('');
		}
		
		function sfxylcjMatter(value, row, index) {
			if (row.sfxylcj==="T") {
				return [ '<div class="myTooltip" title="需要录成绩"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
						.join('');
			} else{
				return [ '<div class="myTooltip" title="不需要录成绩"><i class="iconfont icon-chacha normalTxt"></i></div>' ]
						.join('');
			}
		}
		
		function ztMatter(value, row, index) {
			if (row.sszt==="pass") {
				return [ '<div class="myTooltip" title="已通过"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
						.join('');
			} else if (row.sszt==="nopass"){
				return [ '<div class="myTooltip" title="不通过"><i class="iconfont icon-chacha redTxt"></i></div>' ]
						.join('');
			} else if (row.sszt==="noStatus"){
				return [ '<div class="myTooltip normalTxt" style="text-align:left;" title="未审批">未审批</div>' ]
				.join('');
	        }
		}

		drawPagination(".putOutTaskTableArea", "教学任务书");
		changeColumnsStyle(".putOutTaskTableArea", "教学任务书");
		drawSearchInput(".putOutTaskTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
}

//查看任务书详情
function taskDetails(row,index){
	$.showModal("#taskInfoModal",false);
	$('#taskInfoModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$('#taskInfo_fkyj').attr("disabled", false) // 反馈意见可修改
	$("#taskInfoModal").find(".moadalTitle").html("教学任务书详情");
	$("#taskInfo_jxbmc").val(row.jxbmc);
	$("#taskInfo_kcmc").val(row.kcmc);
	$("#taskInfo_zymc").val(row.zymc);
	$("#taskInfo_xzb").val(row.xzbmc);
	$("#taskInfo_jxbrs").val(row.jxbrs);
	$("#taskInfo_ls").val(row.lsmc);
	$("#taskInfo_zyls").val(row.zylsmc);
	row.sfxylcj==="T"?$("#taskInfo_sfxylcj").val("需要"):$("#taskInfo_sfxylcj").val("不需要");
	$("#taskInfo_zks").val(row.zxs);
	$("#taskInfo_kkbm").val(row.kkbm);
	$("#taskInfo_pkbm").val(row.pkbm);
	row.fkyj===""||row.fkyj==null||typeof(row.fkyj) === "undefined"?$("#taskInfo_fkyj").val(row.fkyj):$("#taskInfo_fkyj").val(row.fkyj);
	givFfkyj(row,index);
}

//反馈意见事件绑定
function givFfkyj(row,index){
	$("#taskInfo_fkyj").change(function(e) {
				$.ajax({
					method : 'get',
					cache : false,
					url : "/chengeTaskFfkyj",
					data: {
						 "id":row.edu201_ID,
						 "feedBack":$("#taskInfo_fkyj").val()
			        },
					dataType : 'json',
					success : function(backjson) {
						if (backjson.result) {
							$("#putOutTaskTable").bootstrapTable('updateCell',{
								index:index,
								field:"fkyj",
								value:$("#taskInfo_fkyj").val()
							});
						} else {
							toastr.warning('操作失败，请重试');
						}
					}
			});
		e.stopPropagation();
	});
}

//通过任务书
function  passTask(){
	changeTaskStatus("pass");
}

//不通过任务书
function  cannotPassTask(){
	changeTaskStatus("nopass");
}

//取消审批任务书
function  cancelTask(){
	changeTaskStatus("noStatus");
}

//审批二次确认
function changeTaskStatus(status){
	if(!tableIsChecked("#putOutTaskTable", "任务书")){
		return;
	}
	var tableChoosed = $("#putOutTaskTable").bootstrapTable("getSelections");
	for (var i = 0; i < tableChoosed.length; i++) {
		if(tableChoosed[i].sfypk==="T"){
			toastr.warning('不能修改已排课的教学任务书');
			return;
		}
	}
	
	var choosedArray=new Array();
	for (var i = 0; i < tableChoosed.length; i++) {
		choosedArray.push(tableChoosed[i].edu201_ID);
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html("任务书");
	$(".remindActionType").html("审核");
	// 确认按钮改变事件
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendChangeStatus(choosedArray,status)
		e.stopPropagation();
	});
}

//发送修改任务书状态的请求
function sendChangeStatus(choosedArray,status){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/changeTaskStatus",
		data: {
             "choosedIds":JSON.stringify(choosedArray) ,"status":status 
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
			if (backjson.result) {
				var tableChoosed = $("#putOutTaskTable").bootstrapTable("getSelections");
				for (var t = 0; t < tableChoosed.length; t++) {
					for (var c = 0; c < choosedArray.length; c++) {
						if(tableChoosed[t].edu201_ID===choosedArray[c]){
							var row=tableChoosed[t];
							row.sszt=status;
							$("#putOutTaskTable").bootstrapTable("updateByUniqueId", {edu201_ID:choosedArray[c], row: row}); 
						}
					}
				}
				$.hideModal("#remindModal");
				toastr.success('操作成功');
				toolTipUp(".myTooltip");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}


//开始检索任务书
function startSearch(){
	var className=$("#className").val();
	var courseName=$("#courseName").val();
	var status=getNormalSelectValue("status");
	
	if(className===""&&courseName===""&&status===""){
		toastr.warning('请输入检索条件');
		return;
	}
	
	var serachObject=new Object();
	className===""?serachObject.xzbmc="":serachObject.xzbmc=className;
	courseName===""?serachObject.kcmc="":serachObject.kcmc=courseName;
	status===""?serachObject.sszt="":serachObject.sszt=status;
	
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchPutOutTasks",
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
				if(backjson.taskInfo.length===0){
					toastr.warning('暂无数据');
					drawTaskEmptyTable();
					return;
				}
				stuffCourseLibraryTable(backjson.taskInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//页面初始化时按钮事件绑定
function binBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
	
	//开始检索任务书
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
	
	//通过任务书
	$('#pass').unbind('click');
	$('#pass').bind('click', function(e) {
		passTask();
		e.stopPropagation();
	});
	
	//不通过任务书
	$('#cannotPass').unbind('click');
	$('#cannotPass').bind('click', function(e) {
		cannotPassTask();
		e.stopPropagation();
	});
	
	//取消审批任务书
	$('#cancelPass').unbind('click');
	$('#cancelPass').bind('click', function(e) {
		cancelTask();
		e.stopPropagation();
	});
	
	//重置检索任务书
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		var reObject = new Object();
		reObject.InputIds = "#className,#courseName";
		reObject.normalSelectIds = "#status";
		reReloadSearchsWithSelect(reObject);
		drawTaskEmptyTable();
		e.stopPropagation();
	});
}
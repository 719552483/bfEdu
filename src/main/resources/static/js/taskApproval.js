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
				taskDetails(row);
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
					align: 'left',
					clickToSelect: false,
					formatter: paramsMatter
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
					align: 'left',
					formatter: ztMatter
				},	{
					field: 'fkyj',
					title: '反馈意见',
					align: 'left',
					formatter: ztMatter
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
		
		function putOutTaskpkbmMatter(value, row, index) {
			return [
					'<span title="'+row.pkbm+'" class="myTooltip putOutTaskpkbmTxt putOutTaskpkbmTxt' + index + '">' + row.pkbm + '</span><select class="myTableSelect myputOutTaskTableSelect' +
					index + '" id="putOutTaskpkbmSelect'+index+'">' + roleOptionStr + '</select>'
				]
				.join('');
		}
		
		
		function ztMatter(value, row, index) {
			if (row.sszt==="pass") {
				return [ '<div class="myTooltip" title="已通过"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
						.join('');
			} else if (row.sszt==="nopass"){
				return [ '<div class="myTooltip" title="不通过"><i class="iconfont icon-chacha redTxt"></i></div>' ]
						.join('');
			} else if (row.sszt==="noStatus"){
				return [ '<div class="myTooltip normalTxt" title="未审批">未审批</div>' ]
				.join('');
	        }
		}
		


		drawPagination(".putOutTaskTableArea", "教学任务书");
		changeColumnsStyle(".putOutTaskTableArea", "教学任务书");
		drawSearchInput(".putOutTaskTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
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
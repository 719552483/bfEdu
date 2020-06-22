$(function() {
	drawTaskEmptyTable();
	binBind();
});

//填充空的任务书表
function drawTaskEmptyTable() {
	stuffTaskInfoTable({});
}

//渲染任务书表
function stuffTaskInfoTable(tableInfo) {
	window.scheduleClassesEvents = {
			'click #putOut': function(e, value, row, index) {
				studentDetails(row,index);
			}
	};
	
	$('#scheduleClassesTable').bootstrapTable('destroy').bootstrapTable({
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
		exportDataType: "all",  
		showExport: true,      //是否显示导出
		exportOptions:{  
		    fileName: '教学任务书导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",   
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".scheduleClassesTableArea", "教学任务书");
		},
		columns: [
			{
				field: 'check',
				checkbox: true
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

			},	{
				field: 'bhzymc',
				title: '专业',
				align: 'left',
				formatter: bhxzbmcMatter

			},	{
				field: 'bhxzbmc',
				title: '行政班',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'jxbrs',
				title: '教学班人数',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'pyccmc',
				title: '老师',
				align: 'left',
				formatter: pointTeacherMatter

			},	{
				field: 'pyccmc',
				title: '主要老师',
				align: 'left',
				formatter: pointTeacherMatter

			},	{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'left',
				clickToSelect: false,
				formatter: sfxylcjMatter

			},	{
				field: 'zhouxs',
				title: '周课时',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'kkbm',
				title: '开课部门',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'kkbm',
				title: '排课部门',
				align: 'left',
				formatter: paramsMatter

			},{
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: scheduleClassesFormatter,
				events: scheduleClassesEvents,
			}
		]
	});
	
	function scheduleClassesFormatter(value, row, index) {
		return [
				'<ul class="toolbar tabletoolbar">' +
				'<li id="putOut" class="queryBtn"><span><img src="img/right.png" style="width:24px"></span>发布</li>' +
				'</ul>'
			]
			.join('');
	}
	
	function bhxzbmcMatter(value, row, index) {
		var str=row.bhzymc[0];
		
		return [
				'<div class="myTooltip" title="'+str+'">'+str+'</div>'
			]
			.join('');
	}
	

	

	drawPagination(".scheduleClassesTableArea", "教学任务书");
	drawSearchInput(".scheduleClassesTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".scheduleClassesTableArea", "教学任务书");
	toolTipUp(".myTooltip");
	btnControl();
}

//检索任务书表
function searchTask(){
	var taskInfo=getSearchInfo();
	if(typeof taskInfo ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getTaskInfo",
		data: {
             "searchInfo":JSON.stringify(taskInfo) 
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
				stuffTaskInfoTable(rePutTaskInfo(backjson.taskInfo));
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}


//得到检索任务书的检索条件
function getSearchInfo(){
	var xzbmc=$("#xzbmc").val();
	var kcmc=$("#kcmc").val();
	if(xzbmc===""&&kcmc===""){
		toastr.warning('检索条件不能为空');
		return;
	}
	
	var returnObject=new Object();
	returnObject.xzbmc=xzbmc;
	returnObject.kcmc=kcmc;
	return returnObject;
}

//得到检索任务书的检索条件
function rePutTaskInfo(oldTaskInfo){
	var newTaskArray=new Array();
	for (var i = 0; i < oldTaskInfo.length; i++) {
		var jxbInfo=oldTaskInfo[i].jxbInfo;
		var crouseInfo=oldTaskInfo[i].crouseInfo;
		var newTaskInfo=new Object;
		newTaskInfo.jxbmc=jxbInfo.jxbmc;
		newTaskInfo.kcmc=jxbInfo.kcmc;
		newTaskInfo.edu301_ID=jxbInfo.edu301_ID;
		newTaskInfo.bhzyCode=jxbInfo.bhzyCode;
		newTaskInfo.bhzymc=$.uniqueArray(jxbInfo.bhzymc.split(","));
		newTaskInfo.bhxzbid=jxbInfo.bhxzbid;
		newTaskInfo.bhxzbmc=jxbInfo.bhxzbmc;
		newTaskInfo.bhxzbmc=jxbInfo.bhxzbmc;
		newTaskInfo.jxbrs=jxbInfo.jxbrs;
		newTaskInfo.zhouxs=crouseInfo.zhouxs;
		newTaskInfo.kkbm=crouseInfo.kkbm;
		newTaskInfo.kkbmCode=crouseInfo.kkbmCode;
		newTaskInfo.sfxylcj=crouseInfo.sfxylcj;
		newTaskArray.push(newTaskInfo);
	}
	return newTaskArray;
}

//是否需要录入成绩格式化
function sfxylcjMatter(value, row, index) {
	if (row.sfxylcj==="T") {
		return [
				'<span class="noneStart">是</span><section class="model-1"><div class="checkbox mycheckbox"><input class="isShowControl" type="checkbox" checked="checked"><label></label></div></section>'
			]
			.join('');
	} else {
		return [
				'<span class="noneStart">否</span><section class="model-1"><div class="checkbox mycheckbox"><input class="isShowControl" type="checkbox"><label></label></div></section>'
			]
			.join('');
	}
}

//指定老师格式化
function pointTeacherMatter(value, row, index) {
	if (value===""||typeof(value) === "undefined"){
		return [
              '<div class="myTooltip redTxt" title="暂未指定老师">暂未指定老师</div>'
			]
			.join('');
	} else {
		return [
             '<div class="myTooltip greenTxt" title="'+value+'">'+value+'</div>'
			]
			.join('');
	}
}

//初始化页面按钮绑定事件
function binBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//检索任务书
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		searchTask();
		e.stopPropagation();
	});
}
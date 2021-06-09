$(function() {
	judgementPWDisModifyFromImplements();
	btnBind();
	getCadetInfo();
	getTecherCadetInfo();
	getClassHourInfo();
	getDataPredictionInfo();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

//获取扩招学员数据分析方案
function getCadetInfo(){
	var backjson=[
		{fxmk: "高职招生区域分析", tblx: "地图", fxwd: "城市/区县", fxzb: "录取人数"},
		{fxmk: "学员考勤率分析", tblx: "折线图", fxwd: "区县/时间", fxzb: "实出勤人数/应出勤人数"},
		{fxmk: "男女学员占比分析", tblx: "堆叠条形图", fxwd: "城市/性别", fxzb: "男、女学员人数/录取人数"},
		{fxmk: "学员职业占比分析", tblx: "环形图", fxwd: "生源类型", fxzb: "各职业类型人数/录取人数"},
		{fxmk: "培养计划课时进度统计分析", tblx: "柱状图", fxwd: "城市", fxzb: "完成课时"},
		{fxmk: "学员就业月平均收入分析", tblx: "条形图", fxwd: "城市", fxzb: "月平均收入"},
		{fxmk: "学员年龄分布分析", tblx: "饼图", fxwd: "城市", fxzb: "实际年龄段人数/录取人数"},
		{fxmk: "教学点使用情况分析", tblx: "散点图", fxwd: "城市/区县", fxzb: "教学点"}
	];
	stuffCadetTable(backjson);
}

//获取扩招教师数据分析方案
function getTecherCadetInfo(){
	var backjson=[
		{fxmk: "教职工入职/离职变化", tblx: "堆积柱状图", fxwd: "年月", fxzb: "在职人数、入职人数、离职人数"},
		{fxmk: "教职员工画像分析", tblx: "环形图", fxwd: "性别", fxzb: "人数、占比"},
		{fxmk: "教职员工画像分析", tblx: "多层饼图", fxwd: "学历/性别", fxzb: "人数、占比"},
		{fxmk: "教职员工画像分析", tblx: "颜色表格", fxwd: "人才引进类型", fxzb: "人数"},
		{fxmk: "教职员工画像分析", tblx: "漏斗图", fxwd: "教职工职级", fxzb: "人数、占比"},
		{fxmk: "教职员工画像分析", tblx: "点图", fxwd: "年龄/性别", fxzb: "人数"}
	];
	stuffTecherCadetTable(backjson);
}

//获取课时分析方案
function getClassHourInfo(){
	var backjson=[
		{fxmk: "课时数据分析", tblx: "柱状图", fxwd: "理论学时/实践学时/分散学时/集中学时", fxzb: "学时"}
	];
	stuffClassHourTable(backjson);
}

//获取预决算分析方案
function getDataPredictionInfo(){
	var backjson=[
		{fxmk: "学院预决算数据分析", tblx: "饼图", fxwd: "课时费/租赁费/差旅费/管理费等", fxzb: "费用/占比"},
		{fxmk: "二级学院预决算数据", tblx: "堆叠柱状图", fxwd: "二级学院/课时费/租赁费/差旅费/管理费等", fxzb: "费用/占比"}
	];
	stuffDataPredictionTable(backjson);
}

//渲染扩招学员数据分析方案表
function stuffCadetTable(tableInfo){
	$('#dataExcavatingTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".dataExcavatingTableArea", "数据");
		},
		columns : [{
			field : 'fxmk',
			title : '分析模块',
			align : 'center',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'tblx',
			title : '图表类型',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxwd',
			title : '分析维度',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxzb',
			title : '分析指标',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		}]
	});

	drawPagination(".dataExcavatingTableArea", "数据");
	drawSearchInput(".dataExcavatingTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//渲染扩招教师数据分析方案表
function stuffTecherCadetTable(tableInfo){
	$('#taecherDataExcavatingTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".taecherDataExcavatingTableArea", "数据");
		},
		columns : [{
			field : 'fxmk',
			title : '分析模块',
			align : 'center',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'tblx',
			title : '图表类型',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxwd',
			title : '分析维度',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxzb',
			title : '分析指标',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		}]
	});

	drawPagination(".taecherDataExcavatingTableArea", "数据");
	drawSearchInput(".taecherDataExcavatingTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//渲染扩招教师数据分析方案表
function stuffClassHourTable(tableInfo){
	$('#classHourTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".classHourTableTableArea", "数据");
		},
		columns : [{
			field : 'fxmk',
			title : '分析模块',
			align : 'center',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'tblx',
			title : '图表类型',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxwd',
			title : '分析维度',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxzb',
			title : '分析指标',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		}]
	});

	drawPagination(".classHourTableTableArea", "数据");
	drawSearchInput(".classHourTableTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//渲染预决算分析方案表
function stuffDataPredictionTable(tableInfo){
	$('#dataPredictionTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".dataPredictionTableArea", "数据");
		},
		columns : [{
			field : 'fxmk',
			title : '分析模块',
			align : 'center',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'tblx',
			title : '图表类型',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxwd',
			title : '分析维度',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		},{
			field : 'fxzb',
			title : '分析指标',
			align : 'center',
			sortable: true,
			formatter : cellToSelect
		}]
	});

	drawPagination(".dataPredictionTableArea", "数据");
	drawSearchInput(".dataPredictionTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//test 单元格将自己的值转化为下拉框
function cellToSelect(value, row, index){
	return ['<div class="btn-group">' +
	'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
	 value+'<span class="caret">' +
	'</span>' +
	'</button>' +
	'<ul class="dropdown-menu">' +
	'<li><a type="'+value+'">'+value+'</a></li>' +
	'</ul>' +
	'</div>' ]
		.join('');
}

//页面初始化时按钮事件绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}

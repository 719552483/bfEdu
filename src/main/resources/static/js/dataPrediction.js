$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	$("input[type='number']").inputSpinner();
	getDataPredtictionInfo("","");
	getAllDepartment();
	btnBind();
	//只选择年
	$("#add_year").datetimepicker({
		format : 'yyyy',
		language:'zh-CN',
		initialDate:new Date(),
		autoclose :true,
		todayHighlight:true,
		startView:4,
		minView :4,
		todayBtn: "linked",
	});
	chartListener();
});

//获取预决算数据信息
function getDataPredtictionInfo(year,departmentCode) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getDataPredtiction",
		data: {
			"year":year,
			"departmentCode":departmentCode
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
				var edu800List=backjson.data.edu800List;
				var edu800SumList=backjson.data.edu800SumList;
				if(edu800List.length==0&&edu800SumList.length==0){
					toastr.warning("暂无预决算数据");
				}
				drawTab2(edu800List);
				drawTab1(edu800List,edu800SumList);
			} else {
				drawDepartmentPredictionTableEmptyTable();
				$(".allDataPredictionArea,.departmentDataPredictionArea").find(".cannottxt").show();
				$(".allDataPredictionArea").find(".predictionChart").hide();
				$(".departmentDataPredictionArea").find(".departmentPredictionChart").hide();
				toastr.warning(backjson.msg);
			}
		}
	});
}

/*
 * tab1
 */
function drawTab1(edu800List,edu800SumList) {
	if(edu800SumList.length==0){
		$("#tab1").find(".allDataPredictionArea").find(".cannottxt").show();
		$("#tab1").find(".allDataPredictionArea").find(".predictionChart,.searchArea").hide();
	}else{
		$("#tab1").find(".allDataPredictionArea").find(".cannottxt").hide();
		$("#tab1").find(".allDataPredictionArea").find(".predictionChart,.searchArea").show();
		stuffPredictionChart(edu800SumList[0]);
		stuffYearSelect();
	}

	if(edu800List.length==0){
		$("#tab1").find(".departmentDataPredictionArea").find(".cannottxt").show();
		$("#tab1").find(".departmentDataPredictionArea").find(".departmentPredictionChart,.searchArea").hide();
	}else{
		$("#tab1").find(".departmentDataPredictionArea").find(".cannottxt").hide();
		$("#tab1").find(".departmentDataPredictionArea").find(".departmentPredictionChart,.searchArea").show();
		stuffDepartmentPredictionChart(edu800List);
		stuffYearSelect();
	}
}

//渲染学院chart
function stuffPredictionChart(edu800SumList){
	var myChart = echarts.init(document.getElementById("predictionChart"));
	option = {
		title: {
			left: 'center',
			text: edu800SumList.year+'年学院预决算数据',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b} : {c} ({d}%)'
		},
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['教师课时费', '网络课程资源', '人员管理费', '场地租赁费', '教学运行设备费','培养方案论证费','实训设备费','差旅费']
		},
		animationEasing: 'elasticOut',
		color:['rgba(22,178,209,0.66)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)','rgba(112,144,162,0.87)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		series: [
			{
				name: '费用类型',
				type: 'pie',
				radius: '55%',
				center: ['50%', '50%'],
				data:  [
					{value: edu800SumList.jsksf, name: '教师课时费'},
					{value: edu800SumList.wlkczy, name: '网络课程资源'},
					{value: edu800SumList.yyglf, name: '人员管理费'},
					{value: edu800SumList.cdzlf, name: '场地租赁费'},
					{value: edu800SumList.jxyxsbf, name: '教学运行设备费'},
					{value: edu800SumList.pyfalzf, name: '培养方案论证费'},
					{value: edu800SumList.sxsbf, name: '实训设备费'},
					{value: edu800SumList.clf, name: '差旅费'}
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};
	myChart.setOption(option);
}

//渲染二级学院chart
function stuffDepartmentPredictionChart(edu800List){
	var myChart = echarts.init(document.getElementById("departmentPredictionChart"));
	var yAxisData=new Array();
	var jsksfData=new Array();
	var wlkczyData=new Array();
	var yyglfData=new Array();
	var cdzlfData=new Array();
	var jxyxsbfData=new Array();
	var pyfalzfData=new Array();
	var sxsbfData=new Array();
	var clfData=new Array();

	var drawYear=edu800List[0].year;;
	for (var i = 0; i < edu800List.length; i++) {
		if(edu800List[i].year==drawYear){
			yAxisData.push(edu800List[i].departmentName);
			jsksfData.push(edu800List[i].jsksf);
			wlkczyData.push(edu800List[i].wlkczy);
			yyglfData.push(edu800List[i].yyglf);
			cdzlfData.push(edu800List[i].cdzlf);
			jxyxsbfData.push(edu800List[i].jxyxsbf);
			pyfalzfData.push(edu800List[i].pyfalzf);
			sxsbfData.push(edu800List[i].sxsbf);
			clfData.push(edu800List[i].clf);
		}
	}

	option = {
		title: {
			left: 'center',
			text: edu800List[0].year+'年二级学院预决算数据',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			formatter : function(params, ticket, callback) {
				if (params.value == undefined || params.value !== params.value) {
					params.value = 0;
				}
				var count=0;
				var str='';
				for (var i = 0; i < params.length; i++) {
					count+=params[i].data;
				}

				for (var i = 0; i < params.length; i++) {
					if(i===0){
						str+=params[i].axisValue+'   总预算:'+count+'<br />'+params[i].marker+' '+params[i].seriesName+':'+params[i].data+' ('+toPercent(params[i].data/count)+')<br />';
					}else{
						str+=params[i].marker+' '+params[i].seriesName+':'+params[i].data+' ('+toPercent(params[i].data/count)+')<br />';
					}
				}

				return  str;
			}
		},
		animationEasing: 'elasticOut',
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['教师课时费', '网络课程资源', '人员管理费', '场地租赁费', '教学运行设备费','培养方案论证费','实训设备费','差旅费']
		},
		color:['rgba(22,178,209,0.66)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)','rgba(112,144,162,0.87)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		xAxis: {
			type: 'value',
			splitLine: {
				show: true,
				lineStyle:{
					type:'dashed'
				}
			}
		},
		yAxis: {
			type: 'category',
			data: yAxisData
		},
		series: [
			{
				name: '教师课时费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data:jsksfData
			},
			{
				name: '网络课程资源',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: wlkczyData
			},
			{
				name: '人员管理费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: yyglfData
			},
			{
				name: '场地租赁费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: cdzlfData
			},
			{
				name: '教学运行设备费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: jxyxsbfData
			},
			{
				name: '培养方案论证费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: pyfalzfData
			},
			{
				name: '实训设备费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: sxsbfData
			},
			{
				name: '差旅费',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					formatter: function (params) {
						if (params.value > 0) {
							return params.value;
						} else {
							return '';
						}
					},
					position: 'insideRight'
				},
				data: clfData
			}
		]
	};
	myChart.setOption(option);
}

//渲染学院年份select
function stuffYearSelect(){
	var haveYears=$("#departmentPredictionTable").bootstrapTable('getData');
	var str = '<option value="seleceConfigTip">请选择</option>';

	for (var i = 0; i < haveYears.length; i++) {
		var readeyStr= '<option value="' + haveYears[i].year + '">' + haveYears[i].year+'</option>';
		if(str.indexOf(readeyStr)===-1){
			str += readeyStr;
		}
	}
	stuffManiaSelect("#predictionChart_changeYear", str);
	stuffManiaSelect("#departmentPredictionChart_changeYear", str);
	stuffManiaSelect("#departmentDataPrediction_year", str);

	$("#predictionChart_changeYear").change(function() {
		var year=getNormalSelectValue("predictionChart_changeYear");
		changeYear(year,"");
	});

	$("#departmentPredictionChart_changeYear").change(function() {
		var year=getNormalSelectValue("departmentPredictionChart_changeYear");
		changeYear(year,"");
	});
}

//chart区改变年份
function changeYear(year,departmentCode){
	if(year===""){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getDataPredtiction",
		data: {
			"year":year,
			"departmentCode":departmentCode
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
				var edu800List=backjson.data.edu800List;
				var edu800SumList=backjson.data.edu800SumList;
				if(edu800List.length==0){
					toastr.warning("暂无预决算数据");
				}
				stuffPredictionChart(edu800SumList[0]);
				stuffDepartmentPredictionChart(edu800List);
			} else {
				$(".allDataPredictionArea,.departmentDataPredictionArea").find(".cannottxt").show();
				$(".allDataPredictionArea").find(".predictionChart").hide();
				$(".departmentDataPredictionArea").find(".departmentPredictionChart").hide();
				toastr.warning(backjson.msg);
			}
		}
	});
}
/*
 * tab1 end
 */

/*
 * tab2
 */
function drawTab2(edu800List) {
	if(edu800List.length==0){
		drawDepartmentPredictionTableEmptyTable();
	}else{
		stuffDepartmentPredictionTableEmptyTable(edu800List);
	}
}

//渲染空的二级学院录入表
function drawDepartmentPredictionTableEmptyTable(){
	stuffDepartmentPredictionTableEmptyTable({});
}

var choosend=new Array();
//渲染二级学院录入表
function stuffDepartmentPredictionTableEmptyTable(tableInfo){
	window.releaseNewsEvents = {
		'click #modifyPrediction' : function(e, value, row, index) {
			wantmodifyPrediction(row);
		},
		'click #deletePrediction' : function(e, value, row, index) {
			wantDeletePrediction(row);
		}
	};
	$('#departmentPredictionTable').bootstrapTable('destroy').bootstrapTable({
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
			fileName: '二级学院预决算导出'  //文件名称
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
			drawPagination(".departmentPredictionTableArea", "预决算信息");
			for (var i = 0; i < choosend.length; i++) {
				$("#departmentPredictionTable").bootstrapTable("checkBy", {field:"edu800_ID", values:[choosend[i].edu800_ID]})
			}
		},
		columns: [ {
			field : 'check',
			checkbox : true
		},  {
			field : 'edu800_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		},{
			field : 'departmentName',
			title : '二级学院',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'year',
			title : '年份',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'jsksf',
			title : '教师课时费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'wlkczy',
			title : '网络课程资源',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'yyglf',
			title : '人员管理费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'cdzlf',
			title : '场地租赁费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'jxyxsbf',
			title : '教学运行设备费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'pyfalzf',
			title : '培养方案论证费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'sxsbf',
			title : '实训设备费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'clf',
			title : '差旅费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'personName',
			title : '录入人',
			align : 'left',
			sortable: true,
			formatter :paramsMatter,
			visible : false
		},{
			field : 'createDate',
			title : '录入时间',
			align : 'left',
			sortable: true,
			formatter :paramsMatter,
			visible : false
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
		+ '<li class="modifyBtn" id="modifyPrediction"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
		+ '<li class="deleteBtn" id="deletePrediction"><span><img src="images/t03.png" style="width:24px"></span>删除</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".departmentPredictionTableArea", "预决算信息");
	drawSearchInput(".departmentPredictionTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".departmentPredictionTableArea", "预决算信息");
}

//单选
function onCheck(row){
	if(choosend.length<=0){
		choosend.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].edu800_ID===row.edu800_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosend.push(row);
		}
	}
}

//单反选
function onUncheck(row){
	if(choosend.length<=1){
		choosend.length=0;
	}else{
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].edu800_ID===row.edu800_ID){
				choosend.splice(i,1);
			}
		}
	}
}

//全选
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosend.push(row[i]);
	}
}

//全反选
function onUncheckAll(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu800_ID);
	}


	for (var i = 0; i < choosend.length; i++) {
		if(a.indexOf(choosend[i].edu800_ID)!==-1){
			choosend.splice(i,1);
			i--;
		}
	}
}

//预备修改
function wantmodifyPrediction(row){
	emptyModal();
	$.showModal("#addModal",true);
	stuffManiaSelectWithDeafult("#add_department",row.departmentCode,row.departmentName)
	$("#add_year").val(row.year);
	$("#add_jsks").val(row.jsksf);
	$("#add_wlkczy").val(row.wlkczy);
	$("#add_yyglf").val(row.yyglf);
	$("#add_cdzlf").val(row.cdzlf);
	$("#add_jxyxsbf").val(row.jxyxsbf);
	$("#add_pyfalzf").val(row.pyfalzf);
	$("#add_sxsb").val(row.sxsbf);
	$("#add_clf").val(row.clf);
	//确认修改
	$('.confirmBtn').unbind('click');
	$('.confirmBtn').bind('click', function(e) {
		modifyPrediction(row);
		e.stopPropagation();
	});
}

//发送修改请求
function modifyPrediction(row){
	var departmentDataPrediction=getDepartmentDataPrediction();
	if(typeof departmentDataPrediction==="undefined"){
		return;
	}

	departmentDataPrediction.edu800_ID=row.edu800_ID;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/saveFinanceInfo",
		data: {
			"financeInfo":JSON.stringify(departmentDataPrediction)
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
			getDataPredtictionInfo("","");
		},
		success : function(backjson) {
			hideloding();
			if (backjson.code === 200) {
				$("#departmentPredictionTable").bootstrapTable('updateByUniqueId', {
					id: departmentDataPrediction.edu800_ID,
					row: departmentDataPrediction
				});
				toolTipUp(".myTooltip");
				$.hideModal("#addModal");
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}

//单个删除
function wantDeletePrediction(row){
	$.showModal("#remindModal",true);
	$(".remindType").html(row.year+"年-"+row.departmentName+"的预决算数据");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.edu800_ID);
		deletePredictions(removeArray);
		e.stopPropagation();
	});
}

//多选删除
function wantDeletePredictions(){
	var choosendData = choosend;
	if (choosendData.length === 0) {
		toastr.warning('暂未选择任何班级');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("已选的预决算数据");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < choosendData.length; i++) {
			removeArray.push(choosendData[i].edu800_ID);
		}
		deletePredictions(removeArray);
		e.stopPropagation();
	});
}

//发送删除请求
function deletePredictions(deleteIds){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/deleteFinanceInfo",
		data: {
			"deleteIds":JSON.stringify(deleteIds)
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
			getDataPredtictionInfo("","");
		},
		success : function(backjson) {
			hideloding();
			if (backjson.code === 200) {
				tableRemoveAction("#departmentPredictionTable", deleteIds, ".departmentPredictionTableArea", "预决算信息");
				toolTipUp(".myTooltip");
				$.hideModal("#remindModal");
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}

//预备录入二级学院数据
function wantAddDepartmentDataPrediction(){
	emptyModal();
	$.showModal("#addModal",true);
	//确认修改
	$('.confirmBtn').unbind('click');
	$('.confirmBtn').bind('click', function(e) {
		confirmAddDepartmentDataPrediction();
		e.stopPropagation();
	});
}

//确认新增数据
function confirmAddDepartmentDataPrediction(){
	var departmentDataPrediction=getDepartmentDataPrediction();
	if(typeof departmentDataPrediction==="undefined"){
		return;
	}
	var allDepartmentPrediction = $("#departmentPredictionTable").bootstrapTable("getData");
	for (var i = 0; i < allDepartmentPrediction.length; i++) {
		if(allDepartmentPrediction[i].year===departmentDataPrediction.year&&allDepartmentPrediction[i].departmentCode===departmentDataPrediction.departmentCode){
			toastr.warning(allDepartmentPrediction[i].year+"年"+allDepartmentPrediction[i].departmentName+"预决算数据已存在");
			return ;
		}
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/saveFinanceInfo",
		data: {
			"financeInfo":JSON.stringify(departmentDataPrediction)
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
			getDataPredtictionInfo("","");
		},
		success : function(backjson) {
			hideloding();
			if (backjson.code === 200) {
				$('#departmentPredictionTable').bootstrapTable("prepend", backjson.data);
				toolTipUp(".myTooltip");
				$.hideModal("#addModal");
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}
/*
 * tab2 end
 */

//清空模态框
function emptyModal(){
	var reObject = new Object();
	reObject.InputIds = "#add_year";
	reObject.numberInputs = "#add_jsks,#add_wlkczy,#add_yyglf,#add_cdzlf,#add_jxyxsbf,#add_pyfalzf,#add_sxsb,#add_clf";
	reObject.normalSelectIds = "#add_department";
	reReloadSearchsWithSelect(reObject);
}

//查询全部二级学院
function getAllDepartment(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllDepartment",
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
				var selectInfo=backjson.data;
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < selectInfo.length; i++) {
					str += '<option value="' + selectInfo[i].edu104_ID + '">' + selectInfo[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#add_department", str);
				stuffManiaSelect("#departmentDataPrediction_department", str);
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}

//获取新增数据
function getDepartmentDataPrediction(){
	var departmentCode=getNormalSelectValue("add_department");
	var departmentName=getNormalSelectText("add_department");
	var year=$("#add_year").val();

	var jsks=$("#add_jsks").val();
	var wlkczy=$("#add_wlkczy").val();
	var yyglf=$("#add_yyglf").val();
	var cdzlf=$("#add_cdzlf").val();
	var jxyxsbf=$("#add_jxyxsbf").val();
	var pyfalzf=$("#add_pyfalzf").val();
	var sxsb=$("#add_sxsb").val();
	var clf=$("#add_clf").val();

	if(departmentCode===""){
		toastr.warning("二级学院不能为空");
		return ;
	}
	if(year===""){
		toastr.warning("年份不能为空");
		return ;
	}
	if(jsks===""){
		toastr.warning("教师课时费不能为空");
		return ;
	}
	if(wlkczy===""){
		toastr.warning("网络课程资源不能为空");
		return ;
	}
	if(yyglf===""){
		toastr.warning("人员管理费不能为空");
		return ;
	}
	if(cdzlf===""){
		toastr.warning("场地租赁费不能为空");
		return ;
	}
	if(jxyxsbf===""){
		toastr.warning("教学运行设备费不能为空");
		return ;
	}
	if(pyfalzf===""){
		toastr.warning("培养方案论证费不能为空");
		return ;
	}
	if(sxsb===""){
		toastr.warning("实训设备费不能为空");
		return ;
	}
	if(clf===""){
		toastr.warning("差旅费不能为空");
		return ;
	}

	if(jsks==="0"&&wlkczy==="0"&&yyglf==="0"&&cdzlf==="0"&&jxyxsbf==="0"&&pyfalzf==="0"&&sxsb==="0"&&clf==="0"){
		toastr.warning("所有费用总和为0");
		return ;
	}

	var returnObject=new Object();
	returnObject.departmentCode=departmentCode;
	returnObject.departmentName=departmentName;
	returnObject.year=year;
	returnObject.jsksf=jsks;
	returnObject.wlkczy=wlkczy;
	returnObject.yyglf=yyglf;
	returnObject.cdzlf=cdzlf;
	returnObject.jxyxsbf=jxyxsbf;
	returnObject.pyfalzf=pyfalzf;
	returnObject.sxsbf=sxsb;
	returnObject.clf=clf;
	returnObject.createPerson=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	returnObject.personName=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;;
	return returnObject;
}

// chart自适应
function chartListener(){
	window.addEventListener("resize", function() {
		var predictionChart = echarts.init(document.getElementById('predictionChart'));
		predictionChart.resize();
		var departmentPredictionChart = echarts.init(document.getElementById('departmentPredictionChart'));
		departmentPredictionChart.resize();
	});
}

// 开始检索
function startSearch(){
	var year=getNormalSelectValue("departmentDataPrediction_year");
	var departmentCode=getNormalSelectValue("departmentDataPrediction_department");
	if(year===""&&departmentCode===""){
		toastr.warning("检索条件不能为空");
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getDataPredtiction",
		data: {
			"year":year,
			"departmentCode":departmentCode
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
				var edu800List=backjson.data.edu800List;
				if(edu800List.length==0){
					toastr.warning("暂无预决算数据");
				}
				drawTab2(edu800List);
			} else {
				drawDepartmentPredictionTableEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

// 重置检索
function reReloadSearchs(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getDataPredtiction",
		data: {
			"year":"",
			"departmentCode":""
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
				var reObject = new Object();
				reObject.normalSelectIds = "#departmentDataPrediction_year,#departmentDataPrediction_department";
				reReloadSearchsWithSelect(reObject);

				var edu800List=backjson.data.edu800List;
				if(edu800List.length==0){
					toastr.warning("暂无预决算数据");
				}
				stuffDepartmentPredictionTableEmptyTable(edu800List);
			} else {
				drawDepartmentPredictionTableEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//页面初始化时按钮事件绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//录入二级学院数据
	$('#wantAddDepartmentDataPrediction').unbind('click');
	$('#wantAddDepartmentDataPrediction').bind('click', function(e) {
		wantAddDepartmentDataPrediction();
		e.stopPropagation();
	});

	//批量删除二级学院数据
	$('#wantDeletePredictions').unbind('click');
	$('#wantDeletePredictions').bind('click', function(e) {
		wantDeletePredictions();
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	$("#departmentDataPrediction_department").change(function() {
		startSearch();
	});

	//重置检索
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});
}

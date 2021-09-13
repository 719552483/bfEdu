$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); // 初始化下拉框
	getDataPredtictionInfo("","");
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
				drawTab1(edu800List,edu800SumList);
				getYearSelect(edu800SumList);
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

//初始化渲染年份下拉框
function getYearSelect(edu800SumList) {
	var haveYears=edu800SumList;
	var str = '<option value="seleceConfigTip">请选择</option>';

	for (var i = 0; i < haveYears.length; i++) {
		var readeyStr= '<option value="' + haveYears[i].year + '">' + haveYears[i].year+'</option>';
		if(str.indexOf(readeyStr)===-1){
			str += readeyStr;
		}
	}
	stuffManiaSelect("#predictionChart_changeYear", str);
	stuffManiaSelect("#departmentPredictionChart_changeYear", str);
}

// 年份change
function stuffYearSelect(){
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

//渲染学院chart
function stuffPredictionChart(edu800SumList){
	var dataList=[
		{value: edu800SumList.jsksf, name: '教师课时费'},
		{value: edu800SumList.wlkczy, name: '网络课程资源'},
		{value: edu800SumList.yyglf, name: '人员管理费'},
		{value: edu800SumList.cdzlf, name: '场地租赁费'},
		{value: edu800SumList.jxyxsbf, name: '教学运行设备费'},
		{value: edu800SumList.pyfalzf, name: '培养方案论证费'},
		{value: edu800SumList.sxsbf, name: '实训设备费'},
		{value: edu800SumList.clf, name: '差旅费'}
	];
	dataList=dataList.sort(compare("value"));

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
				data:dataList,
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
/*
 * tab1 end
 */

// chart自适应
function chartListener(){
	window.addEventListener("resize", function() {
		var predictionChart = echarts.init(document.getElementById('predictionChart'));
		predictionChart.resize();
		var departmentPredictionChart = echarts.init(document.getElementById('departmentPredictionChart'));
		departmentPredictionChart.resize();
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
}

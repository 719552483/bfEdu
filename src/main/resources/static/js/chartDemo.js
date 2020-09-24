$(function() {
	pageGPS("#publicCodeModel");
	pageGPS("#publicCodeModel_cahrt");
	$('.isSowIndex').selectMania(); // 初始化下拉框
	drawChartArea();
	chartListener();
});

/**
 * tab1
 * */
//填充tab1
function drawChartArea(){
	stuffzhexiantuArea();
	stuffZhuZhuangTuArea();
	stuffBingtuArea();
	stuffSandiantuArea();
}

//渲染折线图区域
function stuffzhexiantuArea(){
    stuffZhexiantuOne();
	stuffZhexiantuTwo();
	stuffZhexiantuThree();
	stuffZhexiantuFour();
}

//折线图1
function stuffZhexiantuOne(){
	var myChart = echarts.init(document.getElementById("zhexiantuOne"));

	option = {
		title: {
			text: '基础折线图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		color:['rgba(47,69,84,0.87)', 'rgba(97,160,168,0.87)',  '#91c7ae','#749f83', '#546570'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['模拟数据名称1', '模拟数据名称2', '模拟数据名称3', '模拟数据名称4', '模拟数据名称5']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name: '模拟数据名称1',
				type: 'line',
				stack: '总量',
				data: [120, 132, 101, 134, 90, 230, 210]
			},
			{
				name: '模拟数据名称2',
				type: 'line',
				stack: '总量',
				data: [220, 182, 191, 234, 290, 330, 310]
			},
			{
				name: '模拟数据名称3',
				type: 'line',
				stack: '总量',
				data: [150, 232, 201, 154, 190, 330, 410]
			},
			{
				name: '模拟数据名称4',
				type: 'line',
				stack: '总量',
				data: [320, 332, 301, 334, 390, 330, 320]
			},
			{
				name: '模拟数据名称5',
				type: 'line',
				stack: '总量',
				data: [820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	};


	myChart.setOption(option);
}

//折线图2
function stuffZhexiantuTwo(){
	var myChart = echarts.init(document.getElementById("zhexiantuTwo"));

	option = {
		title: {
			text: '堆叠折线图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['模拟数据名称1', '模拟数据名称2', '模拟数据名称3', '模拟数据名称4', '模拟数据名称5']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				boundaryGap: false,
				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			},
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: '模拟数据名称1',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [120, 132, 101, 134, 90, 230, 210]
			},
			{
				name: '模拟数据名称2',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [220, 182, 191, 234, 290, 330, 310]
			},
			{
				name: '模拟数据名称3',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [150, 232, 201, 154, 190, 330, 410]
			},
			{
				name: '模拟数据名称4',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [320, 332, 301, 334, 390, 330, 320]
			},
			{
				name: '模拟数据名称5',
				type: 'line',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'top'
					}
				},
				areaStyle: {},
				data: [820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	};

	myChart.setOption(option);
}

//折线图3
function stuffZhexiantuThree(){
	var myChart = echarts.init(document.getElementById("zhexiantuThree"));
	var base = +new Date(2016, 9, 3);
	var oneDay = 24 * 3600 * 1000;
	var valueBase = Math.random() * 300;
	var valueBase2 = Math.random() * 50;
	var data = [];
	var data2 = [];

	for (var i = 1; i < 10; i++) {
		var now = new Date(base += oneDay);
		var dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');

		valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
		valueBase <= 0 && (valueBase = Math.random() * 300);
		data.push([dayStr, valueBase]);

		valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
		valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
		data2.push([dayStr, valueBase2]);
	}

	option = {
		animation: false,
		title: {
			text: '触屏拖拽缩放折线图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		legend: {
			top: 'bottom',
			data: ['意向']
		},
		tooltip: {
			triggerOn: 'none',
			position: function (pt) {
				return [pt[0], 130];
			}
		},
		toolbox: {
			left: 'center',
			itemSize: 20,
			top: 10,
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				restore: {}
			}
		},
		xAxis: {
			type: 'time',
			// boundaryGap: [0, 0],
			axisPointer: {
				value: '2016-10-7',
				snap: true,
				lineStyle: {
					color: '#004E52',
					opacity: 0.5,
					width: 2
				},
				label: {
					show: true,
					formatter: function (params) {
						return echarts.format.formatTime('yyyy-MM-dd', params.value);
					},
					backgroundColor: '#004E52'
				},
				handle: {
					show: true,
					color: '#004E52'
				}
			},
			splitLine: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			axisTick: {
				inside: true
			},
			splitLine: {
				show: false
			},
			axisLabel: {
				inside: true,
				formatter: '{value}\n'
			},
			z: 10
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		dataZoom: [{
			type: 'inside',
			throttle: 50
		}],
		series: [
			{
				name: '模拟模拟数据',
				type: 'line',
				smooth: true,
				symbol: 'circle',
				symbolSize: 5,
				sampling: 'average',
				itemStyle: {
					color: '#8ec6ad'
				},
				stack: 'a',
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#8ec6ad'
					}, {
						offset: 1,
						color: '#ffe'
					}])
				},
				data: data
			},
			{
				name: '模拟模拟数据',
				type: 'line',
				smooth: true,
				stack: 'a',
				symbol: 'circle',
				symbolSize: 5,
				sampling: 'average',
				itemStyle: {
					color: '#d68262'
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#d68262'
					}, {
						offset: 1,
						color: '#ffe'
					}])
				},
				data: data2
			}

		]
	};
	myChart.setOption(option);
}

//折线图4
function stuffZhexiantuFour(){
	var myChart = echarts.init(document.getElementById("zhexiantuFour"));
	option = {
		title: {
			text: '峰值折线图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['模拟数据1', '模拟数据2', '模拟数据3', '模拟数据4', '模拟数据5', '模拟数据6', '模拟数据7', '模拟数据8', '模拟数据9', '模拟数据10']
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			},
			axisPointer: {
				snap: true
			}
		},
		visualMap: {
			show: false,
			dimension: 0,
			pieces: [{
				lte: 1,
				color: 'green'
			}, {
				gt: 1,
				lte: 3,
				color: 'red'
			}, {
				gt:3,
				lte: 6,
				color: 'green'
			},{
				gt:6,
				lte:8,
				color: 'red'
			}, {
				gt:8,
				lte: 10,
				color: 'green'
			},  ]
		},
		series: [
			{
				name: '模拟模拟数据',
				type: 'line',
				smooth: true,
				data: [300, 560, 550, 540, 270, 300, 550, 500, 400, 390],
				markArea: {
					data: [ [{
						name: '峰值区域1',
						xAxis: '模拟数据2'
					}, {
						xAxis: '模拟数据4'
					}], [{
						name: '峰值区域2',
						xAxis: '模拟数据7'
					}, {
						xAxis: '模拟数据9'
					}] ]
				}
			}
		]
	};

	myChart.setOption(option);
}

//渲染柱状图区域
function stuffZhuZhuangTuArea(){
	stuffZhuZhuangTuOne();
	stuffZhuZhuangTuTwo();
	stuffZhuZhuangTuThree();
	stuffZhuZhuangTuFour();
}

//柱状图1
function  stuffZhuZhuangTuOne() {
	var myChart = echarts.init(document.getElementById("zhuzhuangtuOne"));
	option = {
		title: {
			text: '基础柱状图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		animationEasing: 'elasticOut',
		color: 'rgba(22,178,209,0.66)',
		xAxis: {
			type: 'category',
			data: ['模拟数据1', '模拟数据2', '模拟数据3', '模拟数据4', '模拟数据5', '模拟数据6', '模拟数据7']
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: [120, 200, 150, 80, 70, 110, 130],
			type: 'bar',
			showBackground: true,
			backgroundStyle: {
				color: 'rgba(220, 220, 220, 0.8)'
			}
		}]
	};
	myChart.setOption(option);
}

//柱状图2
function  stuffZhuZhuangTuTwo(){
	var myChart = echarts.init(document.getElementById("zhuzhuangtuTwo"));
	option = {
		title: {
			text: '正负柱状图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		animationEasing: 'elasticOut',
		color:['rgba(112,144,162,0.87)', 'rgba(97,160,168,0.87)',  'rgba(210,14,13,0.61)'],
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['利润', '支出', '收入']
		},
		xAxis: [
			{
				type: 'value'
			}
		],
		yAxis: [
			{
				type: 'category',
				axisTick: {
					show: false
				},
				data: ['模拟数据1', '模拟数据2', '模拟数据3', '模拟数据4', '模拟数据5', '模拟数据6', '模拟数据7']
			}
		],
		series: [
			{
				name: '利润',
				type: 'bar',
				label: {
					show: true,
					position: 'inside'
				},
				data: [200, 170, 240, 244, 200, 220, 210]
			},
			{
				name: '收入',
				type: 'bar',
				stack: '总量',
				label: {
					show: true
				},
				data: [320, 302, 341, 374, 390, 450, 420]
			},
			{
				name: '支出',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'left'
				},
				data: [-120, -132, -101, -134, -190, -230, -210]
			}
		]
	};

	myChart.setOption(option);
}

//柱状图3
function  stuffZhuZhuangTuThree(){
	var myChart = echarts.init(document.getElementById("zhuzhuangtuThree"));
	option = {
		title: {
			text: '堆叠柱状图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		animationEasing: 'elasticOut',
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['数据组成1', '数据组成2', '数据组成3', '数据组成4', '数据组成5']
		},
		color:['rgba(22,178,209,0.66)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)','rgba(112,144,162,0.87)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		xAxis: {
			type: 'value'
		},
		yAxis: {
			type: 'category',
			data: ['模拟数据1', '模拟数据2', '模拟数据3', '模拟数据4', '模拟数据5']
		},
		series: [
			{
				name: '数据组成1',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'insideRight'
				},
				data: [320, 302, 301, 334, 390]
			},
			{
				name: '数据组成2',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'insideRight'
				},
				data: [120, 132, 101, 134, 90]
			},
			{
				name: '数据组成3',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'insideRight'
				},
				data: [220, 182, 191, 234, 290]
			},
			{
				name: '数据组成4',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'insideRight'
				},
				data: [150, 212, 201, 154, 190]
			},
			{
				name: '数据组成5',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'insideRight'
				},
				data: [820, 832, 901, 934, 1290]
			}
		]
	};
	myChart.setOption(option);
}

//柱状图4
function  stuffZhuZhuangTuFour(){
	var myChart = echarts.init(document.getElementById("zhuzhuangtuFour"));
	var xAxisData = [];
	var data1 = [];
	var data2 = [];
	for (var i = 0; i < 100; i++) {
		xAxisData.push('模拟数据' + i);
		data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
		data2.push((Math.cos(i / 5) * (i / 5 -10) + i / 6) * 5);
	}

	option = {
		title: {
			text: '交错对比柱状图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['类别1', '类别2']
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			}
		},
		color:['rgba(22,178,209,0.66)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)','rgba(112,144,162,0.87)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		dataZoom : [
			{
				type: 'slider',
				show: true,
				start: 0,
				end: 56, //默认展示的个数
				height: 20,//这里可以设置dataZoom的尺寸
				xAxisIndex: [0],
			},
		],
		xAxis: {
			data: xAxisData,
			splitLine: {
				show: false
			}
		},
		yAxis: {
		},
		series: [{
			name: '类别1',
			type: 'bar',
			data: data1,
			animationDelay: function (idx) {
				return idx * 10;
			}
		}, {
			name: '类别2',
			type: 'bar',
			data: data2,
			animationDelay: function (idx) {
				return idx * 10 + 100;
			}
		}],
		animationEasing: 'elasticOut',
		animationDelayUpdate: function (idx) {
			return idx * 5;
		}
	};
	myChart.setOption(option);
}

//渲染饼图区域
function stuffBingtuArea(){
	stuffBingtuOne();
	stuffBingtuTwo();
	stuffBingtuThree();
	stuffBingtuFour();
}

//饼图1
function stuffBingtuOne() {
	var myChart = echarts.init(document.getElementById("bingtuOne"));
	option = {
		title: {
			text: '基础饼图',
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
			data: ['模拟数据1', '模拟数据2', '模拟数据3', '模拟数据4', '模拟数据5']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		animationEasing: 'elasticOut',
		color:['rgba(112,144,162,0.87)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)', 'rgba(97,160,168,0.87)', 'rgba(22,178,209,0.66)', '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		series: [
			{
				name: '数据类型',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [
					{value: 335, name: '模拟数据1'},
					{value: 310, name: '模拟数据2'},
					{value: 234, name: '模拟数据3'},
					{value: 135, name: '模拟数据4'},
					{value: 1548, name: '模拟数据5'}
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

//饼图2
function stuffBingtuTwo(){
	var myChart = echarts.init(document.getElementById("bingtuTwo"));
	var data = [
		[5000, 10000, 6785.71],
		[4000, 10000, 6825],
		[3000, 6500, 4463.33],
		[2500, 5600, 3793.83],
		[2000, 4000, 3060],
		[2000, 4000, 3222.33],
		[2500, 4000, 3133.33],
		[1800, 4000, 3100],
		[2000, 3500, 2750],
		[2000, 3000, 2500],
		[1800, 3000, 2433.33],
		[2000, 2700, 2375],
		[1500, 2800, 2150],
		[1500, 2300, 2100],
		[1600, 3500, 2057.14],
		[1500, 2600, 2037.5],
		[1500, 2417.54, 1905.85],
		[1500, 2000, 1775],
		[1500, 1800, 1650]
	];
	var cities = ['朝阳', '阜新', '北镇', '绥中', '大连', '庄河', '海城', '大石桥', '沈阳', '康平', '西丰', '开原', '铁岭', '法库', '凌海', '昌图', '抚顺', '丹东', '本溪'];
	var barHeight =100;

	option = {
		title: {
			text: '极地坐标系饼图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		legend: {
			show: true,
			left: 'left',
			bottom:'bottom',
			data: ['数据范围', '均值']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		animationEasing: 'elasticOut',
		color:['rgba(22,135,190,0.81)','rgba(210,14,13,0.89)','rgba(112,144,162,0.87)' ,'rgba(207,125,101,0.85)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		angleAxis: {
			type: 'category',
			data: cities
		},
		tooltip: {
			show: true,
			formatter: function (params) {
				var id = params.dataIndex;
				return cities[id] + '<br>最低：' + data[id][0] + '<br>最高：' + data[id][1] + '<br>平均：' + data[id][2];
			}
		},
		radiusAxis: {
		},
		polar: {
		},
		series: [{
			type: 'bar',
			itemStyle: {
				color: 'transparent'
			},
			data: data.map(function (d) {
				return d[0];
			}),
			coordinateSystem: 'polar',
			stack: '最大最小值',
			silent: true
		}, {
			type: 'bar',
			data: data.map(function (d) {
				return d[1] - d[0];
			}),
			coordinateSystem: 'polar',
			name: '数据范围',
			stack: '最大最小值'
		}, {
			type: 'bar',
			itemStyle: {
				color: 'transparent'
			},
			data: data.map(function (d) {
				return d[2] - barHeight;
			}),
			coordinateSystem: 'polar',
			stack: '均值',
			silent: true,
			z: 10
		}, {
			type: 'bar',
			data: data.map(function (d) {
				return barHeight * 2;
			}),
			coordinateSystem: 'polar',
			name: '均值',
			stack: '均值',
			barGap: '-100%',
			z: 10
		}]
	};

	myChart.setOption(option);
}

//饼图3
function stuffBingtuThree(){
	var myChart = echarts.init(document.getElementById("bingtuThree"));
	option = {
		color:['rgba(22,178,209,0.66)','rgba(112,144,162,0.87)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)', 'rgba(97,160,168,0.87)',  '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		title: {
			text: '堆叠极地坐标饼图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		angleAxis: {
		},
		tooltip: {
			show: true
		},
		animationEasing: 'elasticOut',
		radiusAxis: {
			type: 'category',
			data: ['模拟数据1', '模拟数据2', '模拟数据3', '模拟数据4'],
			z: 10
		},
		polar: {
		},
		series: [{
			type: 'bar',
			data: [1, 2, 3, 4],
			coordinateSystem: 'polar',
			name: '类型1',
			stack: 'a'
		}, {
			type: 'bar',
			data: [2, 4, 6, 8],
			coordinateSystem: 'polar',
			name: '类型2',
			stack: 'a'
		}, {
			type: 'bar',
			data: [1, 2, 3, 4],
			coordinateSystem: 'polar',
			name: '类型3',
			stack: 'a'
		}],
		legend: {
			show: true,
			left: 'left',
			bottom:'bottom',
			data: ['类型1', '类型2', '类型3']
		}
	};

	myChart.setOption(option);
}

//饼图4
function stuffBingtuFour(){
	var myChart = echarts.init(document.getElementById("bingtuFour"));
	option = {
		color:['rgba(112,144,162,0.87)', 'rgba(210,14,13,0.61)', 'rgba(22,178,209,0.66)','rgba(207,125,101,0.85)', '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		title: {
			text: '放射饼图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		angleAxis: {
			type: 'category',
			data: ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7']
		},
		animationEasing: 'elasticOut',
		tooltip: {
			show: true
		},
		radiusAxis: {
		},
		polar: {
		},
		series: [{
			type: 'bar',
			data: [1, 2, 3, 4, 3, 5, 1],
			coordinateSystem: 'polar',
			name: '类型1',
			stack: 'a'
		}, {
			type: 'bar',
			data: [2, 4, 6, 1, 3, 2, 1],
			coordinateSystem: 'polar',
			name: '类型2',
			stack: 'a'
		}, {
			type: 'bar',
			data: [1, 2, 3, 4, 1, 2, 5],
			coordinateSystem: 'polar',
			name: '类型3',
			stack: 'a'
		}],
		legend: {
			show: true,
			left: 'left',
			bottom:'bottom',
			data: ['类型1', '类型2', '类型3']
		}
	};
	myChart.setOption(option);
}

//渲染饼图区域
function stuffSandiantuArea(){
	stuffSandiantuOne();
	stuffSandiantuTwo();
	stuffSandiantuThree();
	stuffSandiantuFour();
}

//散点图1
function stuffSandiantuOne(){
	var myChart = echarts.init(document.getElementById("sandiantuOne"));
	option = {
		title: {
			text: '基础散点图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		tooltip: {
			show:true,
			formatter: function (params) {
				return "模拟数据   "+params.value;
			}
		},
		xAxis: {
			scale: true,
			name:'数据类型1',
			nameLocation:'middle',
			nameTextStyle:{
				color:"gray",
				fontSize:13,
				padding:20
			}
		},
		yAxis: {
			scale: true,
			name:'数据类型2',
			nameLocation:'middle',
			nameTextStyle:{
				color:"gray",
				fontSize:13,
				padding:20
			}
		},
		series: [{
			type: 'effectScatter',
			symbolSize: 20,
			color:"rgba(210,14,13,0.61)",
			data: [
				[172.7, 105.2],
				[153.4, 42]
			]
		}, {
			type: 'scatter',
			color:"rgba(22,178,209,0.66)",
			data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
				[172.7, 105.2], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
				[154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [153.4, 42], [152.0, 45.8],
				[162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
				[167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3]
			],
		}]
	};

	myChart.setOption(option);
}

//散点图2
function stuffSandiantuTwo(){
	var myChart = echarts.init(document.getElementById("sandiantuTwo"));

	var hours = ['0','1', '2', '3', '4', '5', '6',
		'7', '8', '9','10','11',
		'12', '13', '14', '15', '16', '17',
		'18', '19', '20', '21', '22', '23'];
	var days = ['模拟数据1', '模拟数据2', '模拟数据3',
		'模拟数据4', '模拟数据5', '模拟数据6', '模拟数据7'];

	var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];
	data = data.map(function (item) {
		return [item[1], item[0], item[2]];
	});

	option = {
		title: {
			text: '分布散点图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		color: 'rgb(22,178,209)',
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		tooltip: {
			show:true,
			formatter: function (params) {
				return "模拟数据   "+params.value;
			}
		},
		xAxis: {
			type: 'category',
			data: hours,
			boundaryGap: false,
			splitLine: {
				show: true,
				lineStyle: {
					color: '#999',
					type: 'dashed'
				}
			},
			axisLine: {
				show: false
			}
		},
		yAxis: {
			type: 'category',
			data: days,
			axisLine: {
				show: false
			}
		},
		series: [{
			name: 'Punch Card',
			type: 'scatter',
			symbolSize: function (val) {
				return val[2] * 2;
			},
			data: data,
			animationDelay: function (idx) {
				return idx * 5;
			}
		}]
	};
	myChart.setOption(option);
}

//散点图3
function stuffSandiantuThree(){
	var myChart = echarts.init(document.getElementById("sandiantuThree"));
	var data = [
		[[28604,77,17096869,'模拟数据1',1990],[31163,77.4,27662440,'模拟数据',1990],[1516,68,1154605773,'模拟数据2',1990],[13670,74.7,10582082,'模拟数据3',1990],[28599,75,4986705,'模拟数据4',1990],[29476,77.1,56943299,'模拟数据5',1990],[31476,75.4,78958237,'模拟数据6',1990],[28666,78.1,254830,'模拟数据7',1990],[1777,57.7,870601776,'India',1990],[29550,79.1,122249285,'模拟数据8',1990],[2076,67.9,20194354,'模拟数据9',1990],[12087,72,42972254,'模拟数据10',1990],[24021,75.4,3397534,'模拟数据11',1990],[43296,76.8,4240375,'模拟数据12',1990],[10088,70.8,38195258,'模拟数据13',1990],[19349,69.6,147568552,'模拟数据14',1990],[10670,67.3,53994605,'模拟数据15',1990],[26424,75.7,57110117,'模拟数据16',1990],[37062,75.4,252847810,'模拟数据17',1990]],
		[[44056,81.8,23968973,'模拟数据1',2015],[43294,81.7,35939927,'模拟数据',2015],[13334,76.9,1376048943,'模拟数据2',2015],[21291,78.5,11389562,'模拟数据3',2015],[38923,80.8,5503457,'模拟数据4',2015],[37599,81.9,64395345,'France',2015],[44053,81.1,80688545,'模拟数据6',2015],[42182,82.8,329425,'模拟数据7',2015],[5903,66.8,1311050527,'India',2015],[36162,83.5,126573481,'模拟数据8',2015],[1390,71.4,25155317,'模拟数据9',2015],[34644,80.7,50293439,'模拟数据10',2015],[34186,80.6,4528526,'模拟数据11',2015],[64304,81.6,5210967,'模拟数据12',2015],[24787,77.3,38611794,'模拟数据13',2015],[23038,73.13,143456918,'模拟数据14',2015],[19360,76.5,78665830,'模拟数据15',2015],[38225,81.4,64715810,'模拟数据16',2015],[53354,79.1,321773631,'模拟数据17',2015]]
	];

	option = {
		title: {
			text: '数据多维度散点图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		legend: {
			right: 10,
			data: ['1990', '2015']
		},
		tooltip: {
			show:true,
			formatter: function (params) {
				return params.value;
			}
		},
		xAxis: {
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			}
		},
		yAxis: {
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
			scale: true
		},
		series: [{
			name: '1990',
			data: data[0],
			type: 'scatter',
			symbolSize: function (data) {
				return Math.sqrt(data[2]) / 5e2;
			},
			emphasis: {
				label: {
					show: true,
					formatter: function (param) {
						return param.data[3];
					},
					position: 'top'
				}
			},
			itemStyle: {
				shadowBlur: 10,
				shadowColor: 'rgba(120, 36, 50, 0.5)',
				shadowOffsetY: 5,
				color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
					offset: 0,
					color: 'rgb(251, 118, 123)'
				}, {
					offset: 1,
					color: 'rgb(204, 46, 72)'
				}])
			}
		}, {
			name: '2015',
			data: data[1],
			type: 'scatter',
			symbolSize: function (data) {
				return Math.sqrt(data[2]) / 5e2;
			},
			emphasis: {
				label: {
					show: true,
					formatter: function (param) {
						return param.data[3];
					},
					position: 'top'
				}
			},
			itemStyle: {
				shadowBlur: 10,
				shadowColor: 'rgba(25, 100, 150, 0.5)',
				shadowOffsetY: 5,
				color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
					offset: 0,
					color: 'rgb(129, 227, 238)'
				}, {
					offset: 1,
					color: 'rgb(25, 183, 207)'
				}])
			}
		}]
	};
	myChart.setOption(option);
}

//散点图4
function stuffSandiantuFour(){
	var myChart = echarts.init(document.getElementById("sandiantuFour"));

	var hours = ['0','1', '2', '3', '4', '5', '6',
		'7', '8', '9','10','11',
		'12', '13', '14', '15', '16', '17',
		'18', '19', '20', '21', '22', '23'];
	var days = ['模拟数据1', '模拟数据2', '模拟数据3',
		'模拟数据4', '模拟数据5', '模拟数据6', '模拟数据7'];


	var data = [[2,8,0],[2,9,0],[2,10,3],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,15,12],[3,16,9],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];

	option = {
		title: {
			text: '分布散点图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		color: 'rgb(22,178,209)',
		polar: {},
		tooltip: {
			show:true,
			formatter: function (params) {
				return "模拟数据   "+params.value;
			}
		},
		angleAxis: {
			type: 'category',
			data: hours,
			boundaryGap: false,
			splitLine: {
				show: true,
				lineStyle: {
					color: '#999',
					type: 'dashed'
				}
			},
			axisLine: {
				show: false
			}
		},
		radiusAxis: {
			type: 'category',
			show:false,
			data: days,
			axisLine: {
				show: false
			},
			axisLabel: {
				rotate: 45
			}
		},
		series: [{
			name: 'Punch Card',
			type: 'scatter',
			coordinateSystem: 'polar',
			symbolSize: function (val) {
				return val[2] * 2;
			},
			data: data,
			animationDelay: function (idx) {
				return idx * 5;
			}
		}]
	};
	myChart.setOption(option);
}
/**
 * tab1 end
 * */



/**
 * tab2
 * */


/**
 * tab2 end
 * */

// chart自适应
function chartListener(){
	// chart自适应
	window.addEventListener("resize", function() {
		var zhexiantuOne = echarts.init(document.getElementById('zhexiantuOne'));
		zhexiantuOne.resize();

		var zhexiantuTwo = echarts.init(document.getElementById('zhexiantuTwo'));
		zhexiantuTwo.resize();

		var zhexiantuThree = echarts.init(document.getElementById('zhexiantuThree'));
		zhexiantuThree.resize();

		var zhexiantuFour = echarts.init(document.getElementById('zhexiantuFour'));
		zhexiantuFour.resize();

		var zhuzhuangtuOne = echarts.init(document.getElementById('zhuzhuangtuOne'));
		zhuzhuangtuOne.resize();

		var zhuzhuangtuTwo = echarts.init(document.getElementById('zhuzhuangtuTwo'));
		zhuzhuangtuTwo.resize();

		var zhuzhuangtuThree = echarts.init(document.getElementById('zhuzhuangtuThree'));
		zhuzhuangtuThree.resize();

		var zhuzhuangtuFour = echarts.init(document.getElementById('zhuzhuangtuFour'));
		zhuzhuangtuFour.resize();

		var bingtuOne = echarts.init(document.getElementById('bingtuOne'));
		bingtuOne.resize();

		var bingtuTwo = echarts.init(document.getElementById('bingtuTwo'));
		bingtuTwo.resize();

		var bingtuThree = echarts.init(document.getElementById('bingtuThree'));
		bingtuThree.resize();

		var bingtuFour = echarts.init(document.getElementById('bingtuFour'));
		bingtuFour.resize();
	});
}


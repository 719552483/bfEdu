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
	stuffKxiantuArea();
	stuffleidatuArea();
	stuffguanxituArea();
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

//渲染K线图区域
function stuffKxiantuArea(){
	stuffKxiantuOne();
	stuffKxiantuTwo();
}

//K线图1
function stuffKxiantuOne(){
	var myChart = echarts.init(document.getElementById("KxiantuOne"));
	option = {
		title: {
			text: '基础K线图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			show:true
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		animationEasing: 'elasticOut',
		xAxis: {
			data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
		},
		yAxis: {},
		series: [{
			type: 'k',
			dimensions: [null, '开始', '结束', '最低', '最高'],
			encode: {
				x: 0,
				y: [1, 2, 3, 4],
				tooltip: [1, 2, 3, 4]
			},
			itemStyle: {
				normal: {
					color: 'rgba(17,167,207,0.49)', // 阳线填充颜色
					color0: 'rgba(210,14,13,0.49)'// 阴线填充颜色
				},
				emphasis: {
					color: 'rgba(17,167,207,0.49)', // 阳线填充颜色
					color0: 'rgba(210,14,13,0.49)'// 阴线填充颜色
				}
			},
			data: [
				[20, 30, 10, 35],
				[40, 35, 30, 55],
				[33, 38, 33, 40],
				[40, 40, 32, 42]
			]
		}]
	};
	myChart.setOption(option);
}

//K线图2
function stuffKxiantuTwo(){
	var myChart = echarts.init(document.getElementById("KxiantuTwo"));

	function splitData(rawData) {
		var categoryData = [];
		var values = [];
		for (var i = 0; i < rawData.length; i++) {
			categoryData.push(rawData[i][0]);
			rawData[i][0] = i;
			values.push(rawData[i]);
		}
		return {
			categoryData: categoryData,
			values: values
		};
	}

	function renderItem(params, api) {
		var xValue = api.value(0);
		var openPoint = api.coord([xValue, api.value(1)]);
		var closePoint = api.coord([xValue, api.value(2)]);
		var lowPoint = api.coord([xValue, api.value(3)]);
		var highPoint = api.coord([xValue, api.value(4)]);
		var halfWidth = api.size([1, 0])[0] * 0.35;
		var style = api.style({
			stroke: api.visual('color')
		});

		return {
			type: 'group',
			children: [{
				type: 'line',
				shape: {
					x1: lowPoint[0], y1: lowPoint[1],
					x2: highPoint[0], y2: highPoint[1]
				},
				style: style
			}, {
				type: 'line',
				shape: {
					x1: openPoint[0], y1: openPoint[1],
					x2: openPoint[0] - halfWidth, y2: openPoint[1]
				},
				style: style
			}, {
				type: 'line',
				shape: {
					x1: closePoint[0], y1: closePoint[1],
					x2: closePoint[0] + halfWidth, y2: closePoint[1]
				},
				style: style
			}]
		};
	}

	var rawData=[["2004-01-02",10452.74,10409.85,10367.41,10554.96,168890000],["2004-01-05",10411.85,10544.07,10411.85,10575.92,221290000],["2004-01-06",10543.85,10538.66,10454.37,10584.07,191460000],["2004-01-07",10535.46,10529.03,10432,10587.55,225490000],["2004-01-08",10530.07,10592.44,10480.59,10651.99,237770000],["2004-01-09",10589.25,10458.89,10420.52,10603.48,223250000],["2004-01-12",10461.55,10485.18,10389.85,10543.03,197960000],["2004-01-13",10485.18,10427.18,10341.19,10539.25,197310000],["2004-01-14",10428.67,10538.37,10426.89,10573.85,186280000],["2004-01-15",10534.52,10553.85,10454.52,10639.03,260090000],["2004-01-16",10556.37,10600.51,10503.7,10666.88,254170000],["2004-01-20",10601.4,10528.66,10447.92,10676.96,224300000],["2004-01-21",10522.77,10623.62,10453.11,10665.7,214920000],["2004-01-22",10624.22,10623.18,10545.03,10717.4,219720000],["2004-01-23",10625.25,10568.29,10490.14,10691.77,234260000],["2004-01-26",10568,10702.51,10510.44,10725.18,186170000],["2004-01-27",10701.1,10609.92,10579.33,10748.81,206560000],["2004-01-28",10610.07,10468.37,10412.44,10703.25,247660000],["2004-01-29",10467.41,10510.29,10369.92,10611.56,273970000],["2004-01-30",10510.22,10488.07,10385.56,10551.03,208990000],["2004-02-02",10487.78,10499.18,10395.55,10614.44,224800000],["2004-02-03",10499.48,10505.18,10414.15,10571.48,183810000],["2004-02-04",10503.11,10470.74,10394.81,10567.85,227760000],["2004-02-05",10469.33,10495.55,10399.92,10566.37,187810000],["2004-02-06",10494.89,10593.03,10433.7,10634.81,182880000],["2004-02-09",10592,10579.03,10433.7,10634.81,160720000],["2004-02-10",10578.74,10613.85,10511.18,10667.03,160590000],["2004-02-11",10605.48,10737.7,10561.55,10779.4,277850000],["2004-02-12",10735.18,10694.07,10636.44,10775.03,197560000],["2004-02-13",10696.22,10627.85,10578.66,10755.47,208340000],["2004-02-17",10628.88,10714.88,10628.88,10762.07,169730000],["2004-02-18",10706.68,10671.99,10623.62,10764.36,164370000],["2004-02-19",10674.59,10664.73,10626.44,10794.95,219890000],["2004-02-20",10666.29,10619.03,10559.11,10722.77,220560000],["2004-02-23",10619.55,10609.62,10508.89,10711.84,229950000],["2004-02-24",10609.55,10566.37,10479.33,10681.4,225670000],["2004-02-25",10566.59,10601.62,10509.4,10660.73,192420000],["2004-02-26",10598.14,10580.14,10493.7,10652.96,223230000],["2004-02-27",10581.55,10583.92,10519.03,10689.55,200050000],["2004-03-01",10582.25,10678.14,10568.74,10720.14,185030000],["2004-03-02",10678.36,10591.48,10539.4,10713.92,215580000],["2004-03-03",10588.59,10593.11,10506.66,10651.03,188800000],["2004-03-04",10593.48,10588,10522.59,10645.33,161050000],["2004-03-05",10582.59,10595.55,10497.11,10681.4,223550000],["2004-03-08",10595.37,10529.48,10505.85,10677.85,199300000],["2004-03-09",10529.52,10456.96,10391.48,10567.03,246270000],["2004-03-10",10457.59,10296.89,10259.34,10523.11,259000000],["2004-03-11",10288.85,10128.38,10102.75,10356.22,292050000],["2004-03-12",10130.67,10240.08,10097.04,10281.63,223350000],["2004-03-15",10238.45,10102.89,10066.08,10252.68,219150000],["2004-03-16",10103.41,10184.67,10085.34,10253.26,194560000],["2004-03-17",10184.3,10300.3,10184.3,10356.59,181210000],["2004-03-18",10298.96,10295.78,10187.78,10355.04,218820000],["2004-03-19",10295.85,10186.6,10163.71,10355.41,261590000],["2004-03-22",10185.93,10064.75,9985.19,10185.93,248930000],["2004-03-23",10066.67,10063.64,10020.75,10177.04,215260000],["2004-03-24",10065.41,10048.23,9975.86,10140.23,224310000],["2004-03-25",10049.56,10218.82,10049.56,10246.15,216420000],["2004-03-26",10218.37,10212.97,10145.63,10306.22,198830000],["2004-03-29",10212.91,10329.63,10212.91,10389.93,197150000],["2004-03-30",10327.63,10381.7,10264.15,10411.41,189060000],["2004-03-31",10380.89,10357.7,10287.11,10428.59,207400000],["2004-04-01",10357.52,10373.33,10299.48,10449.33,218660000],["2004-04-02",10375.33,10470.59,10375.33,10548.74,243070000],["2004-04-05",10470.59,10558.37,10423.33,10582.22,182130000],["2004-04-06",10553.76,10570.81,10467.26,10596.37,175720000],["2004-04-07",10569.26,10480.15,10422.74,10580.51,218040000],["2004-04-08",10482.77,10442.03,10383.84,10590.15,187730000],["2004-04-12",10444.38,10515.56,10439.27,10559.28,142190000],["2004-04-13",10516.05,10381.28,10343.17,10572.13,202540000],["2004-04-14",10378.1,10377.95,10259.35,10453.39,230460000],["2004-04-15",10377.95,10397.46,10279.37,10481.21,262880000],["2004-04-16",10398.32,10451.97,10343.74,10500.57,234660000],["2004-04-19",10451.62,10437.85,10351.97,10501.79,173340000],["2004-04-20",10437.85,10314.5,10297.39,10530.61,204710000],["2004-04-21",10311.87,10317.27,10200.38,10398.53,232630000],["2004-04-22",10314.99,10461.2,10255.88,10529.12,265740000],["2004-04-23",10463.11,10472.84,10362.97,10543.95,277070000],["2004-04-26",10472.91,10444.73,10396.75,10540.26,183040000],["2004-04-27",10445.38,10478.16,10410.52,10570.92,213410000],["2004-04-28",10476.67,10342.6,10301.65,10479.58,232090000],["2004-04-29",10339.41,10272.27,10199.31,10443.81,231880000],["2004-04-30",10273.06,10225.57,10198.39,10374.61,218010000],["2004-05-03",10227.27,10314,10199.67,10365.74,198830000],["2004-05-04",10314.32,10317.2,10232.31,10403.14,208020000],["2004-05-05",10316.98,10310.95,10249.63,10382.98,172170000],["2004-05-06",10308.2,10241.26,10147.21,10332.1,202690000],["2004-05-07",10240.62,10117.34,10086.94,10302.93,228140000],["2004-05-10",10116.28,9990.02,9881.86,10116.28,272130000],["2004-05-11",9989.24,10019.47,9928.91,10092.78,223650000],["2004-05-12",10011.52,10045.16,9822.1,10089.87,246410000],["2004-05-13",10044.31,10010.74,9924.94,10100.24,215300000],["2004-05-14",10008.43,10012.87,9912.45,10096.69,175180000],["2004-05-17",10009.92,9906.91,9827.21,10009.92,199660000],["2004-05-18",9906.71,9968.51,9895.77,10028.27,191770000],["2004-05-19",9962.55,9937.71,9919.9,10124.79,227420000],["2004-05-20",9939.12,9937.64,9867.73,10014.5,155570000],["2004-05-21",9939.34,9966.74,9910.81,10058.5,180980000],["2004-05-24",9968.02,9958.43,9891.22,10084.91,187000000],["2004-05-25",9958.08,10117.62,9895.41,10139.27,213950000],["2004-05-26",10116.84,10109.89,10034.16,10175.75,171700000],["2004-05-27",10109.89,10205.2,10106.13,10267.66,186670000],["2004-05-28",10205.83,10188.45,10137.14,10250.27,159560000],["2004-06-01",10187.18,10202.65,10104.07,10254.17,166590000],["2004-06-02",10199.78,10262.97,10170.57,10310.1,183540000],["2004-06-03",10261.85,10195.91,10163.4,10309.46,162840000],["2004-06-04",10196.83,10242.82,10196.83,10327.84,161190000],["2004-06-07",10243.31,10391.08,10243.31,10410.81,172490000],["2004-06-08",10389.41,10432.52,10323.94,10462.97,170220000],["2004-06-09",10431.1,10368.44,10325.07,10466.59,175090000],["2004-06-10",10367.8,10410.1,10333.94,10448,154090000],["2004-06-14",10401.23,10334.73,10283.48,10403.5,166530000],["2004-06-15",10336.51,10380.43,10319.89,10464.04,223780000],["2004-06-16",10380.23,10379.58,10320.6,10433.52,153020000],["2004-06-17",10378.59,10377.52,10308.25,10417.69,169820000],["2004-06-18",10375.82,10416.41,10328.2,10471.84,300680000],["2004-06-21",10417.82,10371.47,10336.44,10471.76,175300000],["2004-06-22",10370.21,10395.07,10284.24,10431.05,203470000],["2004-06-23",10395.14,10479.57,10323.32,10498.67,210770000],["2004-06-24",10477.43,10443.81,10398.16,10530.01,214330000],["2004-06-25",10444.24,10371.84,10329.88,10514.67,308250000],["2004-06-28",10377.52,10357.09,10317.64,10505.16,231100000],["2004-06-29",10356.35,10413.43,10315.65,10460.25,180210000],["2004-06-30",10413.43,10435.48,10348.98,10489.16,227800000],["2004-07-01",10434,10334.16,10255.55,10473.23,234900000],["2004-07-02",10334,10282.83,10228.71,10371.4,146600000],["2004-07-06",10280.26,10219.34,10163.6,10308.43,180070000],["2004-07-07",10211.92,10240.29,10156.45,10300.53,179940000],["2004-07-08",10238.52,10171.56,10134.99,10297.73,181790000],["2004-07-09",10173.12,10213.22,10150.32,10277.16,161230000],["2004-07-12",10211.75,10238.22,10130.42,10284.39,155520000],["2004-07-13",10238.37,10247.59,10188.45,10297.58,160630000],["2004-07-14",10232.84,10208.8,10129.31,10313.95,298900000],["2004-07-15",10208.2,10163.16,10115.81,10275.27,231930000],["2004-07-16",10162.34,10139.78,10095.32,10289.4,267310000],["2004-07-19",10140.95,10094.06,10027.33,10211.6,198380000],["2004-07-20",10094.43,10149.07,10031.24,10186.9,197640000],["2004-07-21",10156.3,10046.13,10027.92,10279.96,277570000],["2004-07-22",10047.6,10050.33,9906.62,10114.41,247870000],["2004-07-23",10045.46,9962.22,9893.93,10069.51,238540000],["2004-07-26",9964.71,9961.92,9874.38,10054.32,221240000],["2004-07-27",9963.54,10085.14,9942.75,10133.95,236270000],["2004-07-28",10084.03,10117.07,9966.34,10170.31,223560000],["2004-07-29",10115.52,10129.24,10049.74,10213.08,215050000],["2004-07-30",10129.12,10139.71,10045.76,10194.13,197240000],["2004-08-02",10138.45,10179.16,10063.75,10224.29,177330000],["2004-08-03",10178.27,10120.24,10064.57,10228.49,190880000],["2004-08-04",10117.96,10126.51,10029.02,10186.16,157430000],["2004-08-05",10127.1,9963.03,9945.84,10158.44,178250000],["2004-08-06",9960.67,9815.33,9767.54,9963.47,215870000],["2004-08-09",9816.14,9814.66,9773.74,9902.49,148320000],["2004-08-10",9815.55,9944.67,9798.44,9961.7,167590000],["2004-08-11",9931.24,9938.32,9804.63,9981.61,182920000],["2004-08-12",9936.48,9814.59,9780.52,9940.02,248090000],["2004-08-13",9814.11,9825.35,9746.6,9897.34,182590000],["2004-08-16",9825.35,9954.55,9807.44,9987.58,176390000],["2004-08-17",9955.5,9972.83,9916.05,10053.21,186120000],["2004-08-18",9964.22,10083.15,9910.82,10097.01,187150000],["2004-08-19",10082.78,10040.82,9972.39,10111.91,162780000],["2004-08-20",10040.81,10110.14,9989.65,10143.76,175000000],["2004-08-23",10111.1,10073.05,10046.72,10159.54,144500000],["2004-08-24",10074.89,10098.63,10044.66,10165.07,143050000],["2004-08-25",10098.49,10181.74,10041.93,10224.29,172570000],["2004-08-26",10181.07,10173.41,10124.88,10225.61,131960000],["2004-08-27",10174.07,10195.01,10143.91,10235.49,114580000],["2004-08-30",10193.83,10122.52,10110.43,10226.87,114850000],["2004-08-31",10121.97,10173.92,10056.09,10198.03,163580000],["2004-09-01",10170.12,10168.46,10092.37,10230.48,171950000],["2004-09-02",10168.39,10290.28,10129.01,10312.99,181200000],["2004-09-03",10277.82,10260.2,10229.52,10346.99,215670000],["2004-09-07",10261.52,10341.16,10255.62,10388.95,204530000],["2004-09-08",10342.42,10313.36,10267.94,10390.64,222220000],["2004-09-09",10313.36,10289.1,10269.49,10337.33,223160000],["2004-09-10",10289.47,10313.07,10196.19,10348.68,217580000],["2004-09-13",10306.65,10314.76,10250.61,10380.47,203200000],["2004-09-14",10315.13,10318.16,10260.93,10374.79,186180000],["2004-09-15",10316.9,10231.36,10195.6,10324.87,203740000],["2004-09-16",10231.59,10244.49,10194.35,10315.72,173240000],["2004-09-17",10245.82,10284.46,10219.71,10352.37,295880000],["2004-09-20",10283.87,10204.89,10152.9,10293.23,222360000],["2004-09-21",10204.52,10244.93,10159.54,10291.39,223840000],["2004-09-22",10244.05,10109.18,10075.33,10244.05,240390000],["2004-09-23",10108.29,10038.9,9999.67,10134.84,222620000],["2004-09-24",10039.42,10047.24,9993.92,10111.39,204060000],["2004-09-27",10046.65,9988.54,9952.78,10077.32,198710000],["2004-09-28",9989.73,10077.4,9950.71,10132.04,232170000],["2004-09-29",10078.06,10136.24,10002.57,10160.5,218540000],["2004-09-30",10136.38,10080.27,9987.36,10155.49,377130000],["2004-10-01",10082.04,10192.65,10081.38,10237.05,267550000],["2004-10-04",10191.4,10216.54,10153.79,10313.81,253190000],["2004-10-05",10216.76,10177.68,10123.19,10253.93,224410000],["2004-10-06",10170.7,10239.92,10112.2,10267.14,232020000],["2004-10-07",10239.84,10125.4,10086.83,10267.57,275340000],["2004-10-08",10124.11,10055.2,10013.91,10177.53,228590000],["2004-10-11",10056.09,10081.97,10017.67,10142.74,157180000],["2004-10-12",10080.42,10077.18,9985.44,10121.49,215820000],["2004-10-13",10085.21,10002.33,9935.08,10157.11,276800000],["2004-10-14",10002.54,9894.45,9837.22,10048.48,268650000],["2004-10-15",9895.63,9933.38,9845.56,10022.31,317590000],["2004-10-18",9932.98,9956.32,9816.73,10002.18,227840000],["2004-10-19",9958.38,9897.62,9854.19,10064.2,264220000],["2004-10-20",9895.19,9886.93,9766.95,9957.05,272670000],["2004-10-21",9884.65,9865.76,9769.16,9969.07,272050000],["2004-10-22",9863.85,9757.81,9732.81,9920.99,258220000],["2004-10-25",9757.22,9749.99,9660.18,9827.2,233370000],["2004-10-26",9750.59,9888.48,9718.94,9914.65,273770000],["2004-10-27",9888.25,10002.03,9807.8,10051.96,256200000],["2004-10-28",9998.94,10004.54,9900.42,10074.89,254490000],["2004-10-29",10004.69,10027.47,9936.77,10083.44,262950000],["2004-11-01",10028.73,10054.39,9953.29,10124.44,267040000],["2004-11-02",10053.87,10035.73,9976.29,10180.85,369480000],["2004-11-03",10137.05,10137.05,10062.8,10253.27,332790000],["2004-11-04",10132.48,10314.76,10076.36,10352.81,365770000],["2004-11-05",10317.05,10387.54,10279.96,10458.1,325770000],["2004-11-08",10385.15,10391.31,10313.51,10452.58,258040000],["2004-11-09",10387.62,10386.37,10327,10466.81,248430000],["2004-11-10",10378.59,10385.48,10330.54,10470.21,281290000],["2004-11-11",10386.95,10469.84,10364.1,10513.42,254080000],["2004-11-12",10469.21,10539.01,10419.77,10565.48,322250000],["2004-11-15",10541.89,10550.24,10463.34,10612.31,266460000],["2004-11-16",10549.79,10487.65,10445.31,10570.56,237060000],["2004-11-17",10481.83,10549.57,10470.21,10655.09,295230000],["2004-11-18",10549.2,10572.55,10499.62,10639.43,242230000],["2004-11-19",10571.63,10456.91,10419.89,10588.29,275340000],["2004-11-22",10455.73,10489.42,10380.95,10535.46,240410000],["2004-11-23",10486.69,10492.6,10407.18,10547.28,254780000],["2004-11-24",10493.86,10520.31,10451.66,10565.76,204070000],["2004-11-26",10518.69,10522.23,10479.52,10574.7,91510000],["2004-11-29",10520.64,10475.9,10390.92,10590.73,247670000],["2004-11-30",10475.27,10428.02,10380.58,10530.8,286900000],["2004-12-01",10425.8,10590.22,10421.66,10618.59,307970000],["2004-12-02",10590.44,10585.12,10485.21,10670.02,296050000],["2004-12-03",10597.9,10592.21,10515.73,10670.47,286270000],["2004-12-06",10591.32,10547.06,10490.31,10614.82,218660000],["2004-12-07",10546.8,10440.58,10423.21,10612.9,258710000],["2004-12-08",10438.77,10494.23,10395.05,10550.16,247020000],["2004-12-09",10492.45,10552.82,10389.81,10579.94,278740000],["2004-12-10",10552.16,10543.22,10469.62,10616.23,242290000],["2004-12-13",10543.44,10638.32,10520.61,10678.52,257530000],["2004-12-14",10640.53,10676.45,10571.67,10715.76,303800000],["2004-12-15",10675.71,10691.45,10601.74,10749.53,305010000],["2004-12-16",10691.71,10705.64,10612.31,10776.43,293600000],["2004-12-17",10704.83,10649.92,10562.76,10766.01,619180000],["2004-12-20",10652.14,10661.6,10622.2,10769.13,298650000],["2004-12-21",10661.89,10759.43,10646.6,10789.66,294880000],["2004-12-22",10752.34,10815.89,10709.78,10861.33,252910000],["2004-12-23",10815,10827.12,10780.12,10895.1,193270000],["2004-12-27",10828.01,10776.13,10755.67,10892.52,170140000],["2004-12-28",10776.06,10854.54,10774.51,10890.82,169870000],["2004-12-29",10853.72,10829.19,10771.26,10872.71,162830000],["2004-12-30",10829.12,10800.3,10781.67,10880.03,146210000],["2004-12-31",10800.3,10783.01,10759.94,10849.81,141140000],["2005-01-03",10783.75,10729.43,10694.18,10892.67,270620000],["2005-01-04",10727.81,10630.78,10587.48,10803.62,293280000],["2005-01-05",10629.53,10597.83,10561.03,10736.16,263550000],["2005-01-06",10593.19,10622.88,10555.48,10708.37,232850000],["2005-01-07",10624.8,10603.96,10545.8,10697.81,242520000],["2005-01-10",10603.44,10621.03,10544.99,10696.85,234160000],["2005-01-11",10619.77,10556.22,10504.72,10632.63,255650000],["2005-01-12",10561.32,10617.78,10481.37,10648.52,293140000],["2005-01-13",10617.41,10505.83,10463.26,10650.96,271180000],["2005-01-14",10506.71,10558,10475.01,10606.47,223070000],["2005-01-18",10554.23,10628.79,10456.61,10665.44,267680000],["2005-01-19",10626.05,10539.97,10519.2,10668.4,242250000],["2005-01-20",10538.9,10471.47,10414.72,10582.09,242810000],["2005-01-21",10471.98,10392.99,10370.97,10541.3,275680000],["2005-01-24",10393.58,10368.61,10317.1,10491.71,259170000],["2005-01-25",10369.42,10461.56,10369.42,10534.72,260720000],["2005-01-26",10463.19,10498.59,10433.56,10571.66,247140000],["2005-01-27",10498.14,10467.4,10379.47,10535.16,269690000],["2005-01-28",10470.58,10427.2,10331.58,10520.61,358720000],["2005-01-31",10428.76,10489.94,10414.49,10559.77,298060000],["2005-02-01",10489.72,10551.94,10464.38,10609.73,283800000],["2005-02-02",10551.05,10596.79,10501.02,10638.25,279860000],["2005-02-03",10592.21,10593.1,10511.96,10640.69,229000000],["2005-02-04",10593.17,10716.13,10553.93,10750.94,246270000],["2005-02-07",10715.76,10715.76,10650.59,10774.8,218040000],["2005-02-08",10712.51,10724.63,10647.85,10783.97,244710000],["2005-02-09",10717.76,10664.11,10621.84,10781.38,310030000],["2005-02-10",10665,10749.61,10633.67,10803.92,254150000],["2005-02-11",10742.92,10796.01,10680.15,10865.69,263370000],["2005-02-14",10795.72,10791.13,10722.63,10853.8,215370000],["2005-02-15",10791.06,10837.32,10745.1,10886.31,241500000],["2005-02-16",10832.03,10834.88,10746.21,10889.78,256940000],["2005-02-17",10835.03,10754.26,10729.95,10873.6,257860000],["2005-02-18",10755.15,10785.22,10682.29,10854.98,335660000],["2005-02-22",10783.38,10611.2,10596.79,10806.36,340910000],["2005-02-23",10609.28,10673.79,10583.64,10735.42,268490000],["2005-02-24",10672.24,10748.79,10612.24,10779.39,257340000],["2005-02-25",10748.42,10841.6,10698.32,10871.53,247140000],["2005-02-28",10842.05,10766.23,10709.41,10877.07,288160000],["2005-03-01",10794.98,10830,10769.04,10849.14,247210000],["2005-03-02",10825.68,10811.97,10736.16,10896.66,235950000],["2005-03-03",10812.27,10833.03,10744.14,10904.34,233480000],["2005-03-04",10834.51,10940.55,10834.51,10996.93,240210000],["2005-03-07",10940.55,10936.86,10886.09,11027.15,229120000],["2005-03-08",10935.6,10912.62,10863.4,10996.56,205970000],["2005-03-09",10912.32,10805.62,10768.66,10949.2,267970000],["2005-03-10",10806.28,10851.51,10757.36,10907.45,224040000],["2005-03-11",10845.3,10774.36,10728.62,10897.68,243050000],["2005-03-14",10773.92,10804.51,10709.26,10859.12,237050000],["2005-03-15",10804.29,10745.1,10716.87,10884.76,237710000],["2005-03-16",10741.63,10633.07,10569.3,10764.16,278620000],["2005-03-17",10633.3,10626.35,10561.1,10707.86,228160000],["2005-03-18",10627.83,10629.67,10520.6,10709.85,531670000],["2005-03-21",10629.9,10565.39,10503.46,10662.93,254560000],["2005-03-22",10565.39,10470.51,10446.78,10651.41,308690000],["2005-03-23",10470.58,10456.02,10384.34,10558.51,327490000],["2005-03-24",10457.06,10442.87,10415.16,10554.6,238110000],["2005-03-28",10444.13,10485.65,10412.79,10568.05,213820000],["2005-03-29",10486.1,10405.7,10351.76,10565.46,301970000],["2005-03-30",10405.77,10540.93,10395.21,10564.8,276060000],["2005-03-31",10541.59,10503.76,10448.19,10586.15,259250000],["2005-04-01",10504.57,10404.3,10349.02,10600.56,318810000],["2005-04-04",10401.71,10421.14,10307.64,10496.44,293800000],["2005-04-05",10421.14,10458.46,10372.59,10530.14,271690000],["2005-04-06",10453.45,10486.02,10434.22,10557.18,237570000],["2005-04-07",10485.88,10546.32,10434.3,10589.99,283340000],["2005-04-08",10546.32,10461.34,10445.31,10584.6,201110000],["2005-04-11",10462.08,10448.56,10393.36,10530.58,192720000],["2005-04-12",10448.63,10507.97,10331.21,10552.6,267070000],["2005-04-13",10507.45,10403.93,10355.16,10567.38,274850000],["2005-04-14",10403.71,10278.75,10248.23,10457.06,303780000],["2005-04-15",10276.61,10087.51,10059.36,10311.26,417360000],["2005-04-18",10088.54,10071.25,9961.52,10183.5,301220000],["2005-04-19",10071.55,10127.41,10021.08,10220.21,285960000],["2005-04-20",10131.18,10012.36,9978.74,10232.34,323910000],["2005-04-21",10010.51,10218.6,10010.51,10250.3,287550000],["2005-04-22",10216.68,10157.71,10055.29,10266.48,272500000],["2005-04-25",10158.52,10242.47,10148.25,10305.87,231210000],["2005-04-26",10240.99,10151.13,10108.79,10298.85,255270000],["2005-04-27",10150.32,10198.8,10048.27,10250.23,248390000],["2005-04-28",10194.58,10070.37,10036.74,10229.09,279300000],["2005-04-29",10073.47,10192.51,10021.23,10231.31,303790000],["2005-05-02",10192,10251.7,10149.06,10309.86,239610000],["2005-05-03",10251.04,10256.95,10169.39,10327.37,277710000],["2005-05-04",10255.25,10384.64,10239.95,10412.2,275240000],["2005-05-05",10384.49,10340.38,10276.75,10447.08,236460000],["2005-05-06",10339.71,10345.4,10300.7,10454.4,230410000],["2005-05-09",10345.4,10384.34,10288.95,10416.56,204600000],["2005-05-10",10382.94,10281.11,10230.35,10389.96,234910000],["2005-05-11",10272.91,10300.25,10172.86,10355.31,214890000],["2005-05-12",10299.74,10189.48,10155.86,10357.37,249840000],["2005-05-13",10188.23,10140.12,10062.76,10268.85,258410000],["2005-05-16",10139.61,10252.29,10118.32,10274.39,217230000],["2005-05-17",10247.49,10331.88,10175.81,10357.3,241110000],["2005-05-18",10323.19,10464.45,10323.19,10518.17,299760000],["2005-05-19",10464.45,10493.19,10394.39,10538.71,209180000],["2005-05-20",10492.75,10471.91,10400.6,10535.24,232250000],["2005-05-23",10472.8,10523.56,10438.36,10589.92,225290000],["2005-05-24",10522.68,10503.68,10433.78,10550.24,204650000],["2005-05-25",10503.17,10457.8,10396.46,10516.17,187990000],["2005-05-26",10458.68,10537.6,10450.55,10581.87,194620000],["2005-05-27",10537.08,10542.55,10489.35,10579.94,168060000],["2005-05-31",10541.89,10467.48,10437.77,10574.92,240780000],["2005-06-01",10462.86,10549.87,10433.48,10616.15,230170000],["2005-06-02",10548.83,10553.49,10478.26,10590.07,187680000],["2005-06-03",10552.82,10460.97,10427.35,10572.18,222230000],["2005-06-06",10461.64,10467.03,10410.28,10519.79,170200000],["2005-06-07",10466,10483.07,10454.18,10603.15,213990000],["2005-06-08",10484.84,10476.86,10439.77,10575.81,195810000],["2005-06-09",10477.75,10503.02,10410.8,10556.9,209810000],["2005-06-10",10503.02,10512.63,10410.5,10581.13,217100000],["2005-06-13",10503.57,10522.56,10437.32,10611.1,205630000],["2005-06-14",10521.95,10547.57,10473.92,10617.01,192030000],["2005-06-15",10548.65,10566.37,10471.69,10628.67,220840000],["2005-06-16",10566.76,10578.65,10501.92,10632.2,217730000],["2005-06-17",10580.41,10623.07,10561,10710.38,373400000],["2005-06-20",10621.54,10609.1,10539.21,10656.66,173110000],["2005-06-21",10608.88,10599.67,10545.89,10670.56,203440000],["2005-06-22",10599.36,10587.93,10543.28,10676.24,198810000],["2005-06-23",10587.09,10421.44,10401.49,10617.39,288030000],["2005-06-24",10422.28,10297.83,10266.3,10452.82,343150000],["2005-06-27",10298.07,10290.78,10229.4,10377.55,220510000],["2005-06-28",10291.01,10405.63,10285.86,10434.18,215350000],["2005-06-29",10405.94,10374.48,10332.52,10472.46,222550000],["2005-06-30",10374.18,10274.97,10253.49,10458.19,301810000],["2005-07-01",10273.59,10303.44,10239.91,10380.78,231380000],["2005-07-05",10292.62,10371.8,10282.64,10388.91,235620000],["2005-07-06",10366.52,10270.68,10242.21,10413.23,237210000],["2005-07-07",10269.76,10302.29,10142.24,10337.84,275310000],["2005-07-08",10302.9,10449.14,10279.65,10486.5,249260000],["2005-07-11",10449.6,10519.72,10425.97,10570.67,225470000],["2005-07-12",10519.49,10513.89,10444.46,10583.02,233390000],["2005-07-13",10513.36,10557.39,10481.36,10596.98,216660000],["2005-07-14",10559.86,10628.88,10559.86,10696.96,267790000],["2005-07-15",10629.44,10640.83,10559.46,10698.07,239700000],["2005-07-18",10640.19,10574.99,10533.59,10681.99,206290000],["2005-07-19",10576.9,10646.56,10573,10718.69,318160000],["2005-07-20",10629.52,10689.15,10535.1,10726.81,312420000],["2005-07-21",10690.03,10627.77,10567.98,10735.33,281750000],["2005-07-22",10624.19,10651.18,10552.54,10702.21,231480000],["2005-07-25",10651.66,10596.48,10565.12,10709.69,190250000],["2005-07-26",10597.6,10579.77,10535.58,10667.9,220390000],["2005-07-27",10579.45,10637.09,10530.5,10689.31,213220000],["2005-07-28",10633.5,10705.55,10603.49,10745.68,220170000],["2005-07-29",10705.16,10640.91,10608.27,10754.6,215280000],["2005-08-01",10641.78,10623.15,10578.97,10713.51,192790000],["2005-08-02",10623.79,10683.74,10600.62,10729.6,241690000],["2005-08-03",10681.51,10697.59,10600.02,10735.17,237650000],["2005-08-04",10696.8,10610.1,10568.7,10709.77,230600000],["2005-08-05",10610.34,10558.03,10512.49,10643.46,218240000],["2005-08-08",10557.24,10536.93,10497.45,10635.65,185880000],["2005-08-09",10537.65,10615.67,10537.01,10662.8,207460000],["2005-08-10",10606.52,10594.41,10553.81,10746.87,258420000],["2005-08-11",10591.83,10685.89,10549.43,10721.56,234250000],["2005-08-12",10682.7,10600.3,10549.19,10688.68,215040000],["2005-08-15",10599.19,10634.38,10532.48,10687.72,173340000],["2005-08-16",10631.59,10513.45,10489.24,10650.14,232520000],["2005-08-17",10505.6,10550.71,10472.45,10625.86,235040000],["2005-08-18",10531.12,10554.92,10517.67,10592.34,213900000],["2005-08-19",10552.7,10559.23,10503.9,10656.59,219830000],["2005-08-22",10559.78,10569.89,10509.07,10669.81,215570000],["2005-08-23",10571.01,10519.58,10475.63,10604.29,210670000],["2005-08-24",10519.34,10434.87,10407.56,10584.3,256640000],["2005-08-25",10434.39,10450.63,10391.71,10506.6,188100000],["2005-08-26",10450.95,10397.29,10355.02,10480.01,192100000],["2005-08-29",10396.9,10463.05,10321.42,10508.35,202970000],["2005-08-30",10461.54,10412.82,10329.15,10476.83,234650000],["2005-08-31",10415.84,10481.6,10357.65,10484.55,281200000],["2005-09-01",10481.44,10459.63,10382.09,10557.47,278990000],["2005-09-02",10460.67,10447.37,10400.88,10536.14,204490000],["2005-09-06",10447.69,10589.24,10447.69,10621.96,233670000],["2005-09-07",10588.68,10633.5,10534.23,10667.1,226790000],["2005-09-08",10633.11,10595.93,10530.01,10670.6,222990000],["2005-09-09",10594.1,10678.56,10573.47,10727.53,247140000],["2005-09-12",10678.41,10682.94,10618.13,10743.77,201190000],["2005-09-13",10673.71,10597.44,10561.61,10701.57,222620000],["2005-09-14",10545.85,10558.75,10488.05,10627.85,216300000],["2005-09-15",10545.85,10558.75,10488.05,10627.85,225350000],["2005-09-16",10560.5,10641.94,10539.64,10696.24,546940000],["2005-09-19",10641.87,10557.63,10497.29,10656.75,233530000],["2005-09-20",10558.19,10481.52,10453.98,10642.26,244560000],["2005-09-21",10484.23,10378.03,10335.28,10512.02,266650000],["2005-09-22",10376.2,10422.05,10303.51,10489.64,254260000],["2005-09-23",10421.81,10419.59,10328.59,10494.42,238590000],["2005-09-26",10420.22,10443.63,10381.53,10544.98,234320000],["2005-09-27",10444.58,10456.21,10376.83,10534.31,224960000],["2005-09-28",10456.61,10473.08,10390.05,10560.02,238740000],["2005-09-29",10472.61,10552.78,10389.01,10583.43,236020000],["2005-09-30",10540.51,10568.7,10526.34,10569.81,222160000],["2005-10-03",10569.5,10535.48,10486.17,10637,239190000],["2005-10-04",10534.36,10441.11,10409.89,10618.41,301840000],["2005-10-05",10434.81,10317.36,10299.27,10477.21,266720000],["2005-10-06",10317.36,10287.1,10200.81,10425.98,316440000],["2005-10-07",10287.42,10292.31,10221.47,10387.48,237340000],["2005-10-10",10292.95,10238.76,10184.09,10378.19,236540000],["2005-10-11",10239.16,10253.17,10195.13,10361.15,261000000],["2005-10-12",10247.4,10216.9,10186.17,10308.23,293420000],["2005-10-13",10216.91,10216.59,10098.18,10309.2,270400000],["2005-10-14",10216.59,10287.34,10165.12,10327.21,238950000],["2005-10-17",10287.42,10348.1,10213.06,10419.58,242880000],["2005-10-18",10349.14,10285.26,10233.47,10412.85,297590000],["2005-10-19",10277.18,10414.13,10173.52,10444.15,316880000],["2005-10-20",10411.73,10281.1,10230.27,10483.21,334850000],["2005-10-21",10282.22,10215.22,10161.6,10354.02,357930000],["2005-10-24",10219.15,10385,10219.15,10411.57,263690000],["2005-10-25",10383.88,10377.87,10282.78,10457.52,246960000],["2005-10-26",10377.39,10344.98,10283.1,10474.18,266810000],["2005-10-27",10334.81,10229.95,10229.95,10348.66,236490000],["2005-10-28",10231.15,10402.77,10213.14,10433.51,283060000],["2005-10-31",10403.17,10440.07,10372.67,10539.16,320080000],["2005-11-01",10437.51,10406.77,10352.42,10510.03,294480000],["2005-11-02",10406.29,10472.73,10347.7,10527.32,279710000],["2005-11-03",10470.49,10522.59,10421.98,10613.84,320900000],["2005-11-04",10523.23,10530.76,10441.59,10593.51,230870000],["2005-11-07",10531.24,10586.23,10488.74,10632.34,241260000],["2005-11-08",10574.18,10539.72,10478.49,10606.8,201770000],["2005-11-09",10539.24,10546.21,10466.24,10637.78,244430000],["2005-11-10",10550.61,10640.1,10519.71,10655.22,293350000],["2005-11-11",10641.3,10686.04,10595.89,10725.99,195880000],["2005-11-14",10686.6,10697.17,10618.89,10756.88,211290000],["2005-11-15",10697.01,10686.44,10610.08,10783.62,267560000],["2005-11-16",10697.81,10674.76,10653.14,10710.78,286000000],["2005-11-17",10677,10720.22,10619.61,10778.5,274320000],["2005-11-18",10719.34,10766.33,10663.79,10865.58,351030000],["2005-11-21",10766.33,10820.28,10708.86,10871.11,250280000],["2005-11-22",10815.96,10871.43,10729.99,10907.77,311190000],["2005-11-23",10865.9,10916.09,10855.42,10950.59,236740000],["2005-11-25",10915.13,10931.62,10883.55,10997.5,122460000],["2005-11-28",10932.74,10890.72,10839.37,10992.39,259360000],["2005-11-29",10888.48,10888.16,10850.29,10994.85,255250000],["2005-11-30",10883.91,10805.87,10789.38,10959.8,257650000],["2005-12-01",10806.03,10912.57,10806.03,10969.97,256980000],["2005-12-02",10912.01,10877.51,10818.36,10952.83,214900000],["2005-12-05",10876.95,10835.01,10766.57,10923.37,237340000],["2005-12-06",10835.41,10856.86,10809.15,10956.13,264630000],["2005-12-07",10856.86,10810.91,10737.27,10916.89,243490000],["2005-12-08",10808.43,10755.12,10705.17,10871.11,253290000],["2005-12-09",10751.76,10778.58,10694.05,10845.33,238930000],["2005-12-12",10778.66,10767.77,10707.18,10857.02,254130000],["2005-12-13",10765.69,10823.72,10694.29,10902.64,329050000],["2005-12-14",10821.32,10883.51,10786.34,10953.07,336440000],["2005-12-15",10883.43,10881.67,10803.55,10985.01,297560000],["2005-12-16",10881.67,10875.59,10830.84,10978.21,419040000],["2005-12-19",10875.51,10836.53,10781.7,10970.04,331170000],["2005-12-20",10836.93,10805.55,10754.56,10905.28,254440000],["2005-12-21",10805.63,10833.73,10776.01,10933.7,257850000],["2005-12-22",10831.56,10889.44,10785.93,10928.34,229500000],["2005-12-23",10901.68,10883.27,10869.98,10904.4,126720000],["2005-12-27",10883.75,10777.77,10754.16,10956.99,174190000],["2005-12-28",10778.25,10796.26,10750.4,10858.07,153230000],["2005-12-29",10795.7,10784.82,10747.76,10870.71,160010000],["2005-12-30",10783.86,10717.5,10675.64,10801.87,191020000],["2006-01-03",10718.3,10847.41,10650.18,10888.4,302950000],["2006-01-04",10843.97,10880.15,10772.89,10946.27,271490000],["2006-01-05",10880.39,10882.15,10797.55,10951.39,250910000],["2006-01-06",10875.45,10959.31,10846.21,11005.98,291740000],["2006-01-09",10959.47,11011.9,10906.33,11053.93,248240000],["2006-01-10",11010.46,11011.58,10902.96,11054.49,264270000],["2006-01-11",11011.66,11043.44,10939.86,11099.15,266260000],["2006-01-12",11043.12,10962.36,10918.09,11070.1,244890000],["2006-01-13",10961.48,10959.87,10888.88,11033.04,209940000],["2006-01-17",10957.55,10896.32,10841.17,10977.01,251470000],["2006-01-18",10890.08,10854.86,10778.33,10934.9,361540000],["2006-01-19",10855.18,10880.71,10796.66,10965,370960000],["2006-01-20",10880.71,10667.39,10637.21,10890.08,519090000],["2006-01-23",10668.75,10688.77,10607.36,10783.7,366090000],["2006-01-24",10690.21,10712.22,10624.49,10804.75,375980000],["2006-01-25",10713.26,10709.74,10615.2,10832.93,412460000],["2006-01-26",10768.17,10809.47,10709.73,10827.96,400550000],["2006-01-27",10815.32,10907.21,10766.01,10988.29,398810000],["2006-01-30",10913.13,10899.92,10887.67,10930.34,323690000],["2006-01-31",10900.4,10864.86,10807.55,10970.28,369370000],["2006-02-01",10862.14,10953.95,10815.39,11001.82,333580000],["2006-02-02",10950.11,10851.98,10800.35,10987.73,314190000],["2006-02-03",10849.57,10793.62,10725.35,10905.28,346600000],["2006-02-06",10793.3,10798.27,10725.91,10868.62,263190000],["2006-02-07",10796.42,10749.76,10691.97,10874.79,351880000],["2006-02-08",10742.16,10858.62,10712.3,10897.44,330080000],["2006-02-09",10859.42,10883.35,10800.91,11003.5,314190000],["2006-02-10",10883.51,10919.05,10787.62,10972.76,303570000],["2006-02-13",10915.21,10892.32,10824.6,10982.93,244330000],["2006-02-14",10890.72,11028.39,10873.62,11071.54,307060000],["2006-02-15",11025.67,11058.97,10940.18,11115.56,298850000],["2006-02-16",11059.05,11120.68,10997.66,11154.14,302980000],["2006-02-17",11119.56,11115.32,11035.44,11178.8,329160000],["2006-02-21",11115.48,11069.06,11011.18,11182.68,270410000],["2006-02-22",11086.98,11137.17,11064.25,11159.02,337280000],["2006-02-23",11133.52,11069.22,11017.27,11167.83,270410000],["2006-02-24",11068.33,11061.85,11010.46,11085.38,247270000],["2006-02-27",11062.81,11097.55,11038.72,11180.48,268610000],["2006-02-28",11096.75,10993.41,10947.07,11115.24,325450000],["2006-03-01",10993.25,11053.53,10960.6,11115.8,270620000],["2006-03-02",11052.57,11025.51,10951.71,11090.91,274280000],["2006-03-03",11024.23,11021.59,10942.99,11125.01,365750000],["2006-03-06",11022.47,10958.59,10899.76,11084.66,292510000],["2006-03-07",10957.31,10980.69,10885.35,11032.31,284770000],["2006-03-08",10977.08,11005.74,10885.99,11065.61,276610000],["2006-03-09",11005.66,10972.28,10923.86,11093.39,266390000],["2006-03-10",10972.92,11076.34,10948.43,11125.41,257440000],["2006-03-13",11067.61,11076.02,11019.75,11157.82,251020000],["2006-03-14",11076.02,11151.34,11030.23,11190.96,251560000],["2006-03-15",11149.76,11209.77,11097.23,11258.28,274740000],["2006-03-16",11210.97,11253.24,11176.07,11324.8,306150000],["2006-03-17",11294.94,11279.65,11253.23,11294.94,480830000],["2006-03-20",11278.93,11274.53,11208.33,11350.73,247410000],["2006-03-21",11275.89,11235.47,11188.56,11364.34,331800000],["2006-03-22",11234.51,11317.43,11200.22,11358.01,342980000],["2006-03-23",11317.35,11270.29,11207.85,11363.46,292420000],["2006-03-24",11270.61,11279.97,11197.21,11353.21,240800000],["2006-03-27",11280.13,11250.11,11194.07,11314.96,226240000],["2006-03-28",11250.11,11154.54,11132.05,11312.31,272490000],["2006-03-29",11154.94,11215.7,11117.48,11283.97,279470000],["2006-03-30",11195.36,11150.7,11118.12,11259.08,276900000],["2006-03-31",11151.34,11109.32,11069.78,11229.47,317000000],["2006-04-03",11113,11144.94,11101.07,11287.02,278440000],["2006-04-04",11142.54,11203.85,11094.03,11269.17,246950000],["2006-04-05",11203.21,11239.55,11141.82,11290.3,250190000],["2006-04-06",11233.01,11216.5,11137.57,11294.3,240370000],["2006-04-07",11228.1,11120.04,11108.75,11268.92,256290000],["2006-04-10",11119.88,11141.33,11083.06,11211.37,207380000],["2006-04-11",11141.33,11089.63,11017.99,11220.98,266080000],["2006-04-12",11089.47,11129.97,11052.17,11194,212590000],["2006-04-13",11130.13,11137.65,11053.29,11210.73,230870000],["2006-04-17",11137.33,11073.78,11017.43,11203.13,239730000],["2006-04-18",11074.58,11268.77,11064.01,11302.3,309660000],["2006-04-19",11265.4,11278.77,11181.84,11379.79,292280000],["2006-04-20",11278.53,11342.89,11221.3,11429.25,336420000],["2006-04-21",11343.45,11347.45,11272.61,11468.16,325090000],["2006-04-24",11346.81,11336.32,11246.35,11420.05,232000000],["2006-04-25",11336.56,11283.25,11213.05,11401.32,289230000],["2006-04-26",11283.25,11354.49,11256.12,11428.77,270270000],["2006-04-27",11349.53,11382.51,11220.74,11465.75,361740000],["2006-04-28",11358.33,11367.14,11278.13,11462.95,738440000],["2006-05-01",11367.78,11343.29,11304.3,11476.96,365970000],["2006-05-02",11372.74,11416.44,11343.28,11427.43,335420000],["2006-05-03",11414.69,11400.28,11308.55,11472.96,380540000],["2006-05-04",11401.8,11438.86,11366.82,11512.18,333940000],["2006-05-05",11440.62,11577.74,11440.62,11616.16,338910000],["2006-05-08",11576.37,11584.54,11504.09,11665.14,309920000],["2006-05-09",11584.62,11639.77,11535.71,11684.28,263250000],["2006-05-10",11630.48,11642.65,11545.64,11709.09,284530000],["2006-05-11",11639.29,11500.73,11449.74,11660.58,322510000],["2006-05-12",11500.01,11380.99,11336.96,11551.4,321240000],["2006-05-15",11380.43,11428.77,11273.65,11485.61,300550000],["2006-05-16",11428.21,11419.89,11334.64,11520.42,307170000],["2006-05-17",11410.13,11205.61,11139.17,11412.28,399460000],["2006-05-18",11206.17,11128.29,11096.35,11301.26,338300000],["2006-05-19",11124.37,11144.06,11009.98,11254.6,485500000],["2006-05-22",11092.9,11125.32,11040.16,11175.03,340590000],["2006-05-23",11126.29,11098.35,11068.49,11254.68,315860000],["2006-05-24",11100.11,11117.32,10980.29,11241.15,403410000],["2006-05-25",11114.96,11211.05,11089.55,11258.12,295350000],["2006-05-26",11211.69,11278.61,11177.43,11329.36,240330000],["2006-05-30",11277.25,11094.43,11071.7,11277.25,261260000],["2006-05-31",11091.15,11168.31,11050.4,11225.78,353660000],["2006-06-01",11169.03,11260.28,11115.4,11290.86,295150000],["2006-06-02",11260.52,11247.87,11158.06,11329.28,268640000],["2006-06-05",11247.55,11048.72,11025.75,11259.96,254990000],["2006-06-06",11048.24,11002.14,10890.24,11140.45,385870000],["2006-06-07",11002.06,10930.9,10897.76,11107.48,333490000],["2006-06-08",10929.7,10938.82,10726.15,11032.15,442150000],["2006-06-09",10939.14,10891.92,10842.89,11015.67,272930000],["2006-06-12",10892,10792.58,10767.61,10969.32,242490000],["2006-06-13",10783.14,10706.14,10653.23,10893.04,399220000],["2006-06-14",10713.1,10816.91,10699.25,10816.99,355620000],["2006-06-15",10817.48,11015.19,10788.34,11049.85,358870000],["2006-06-16",11009.1,11014.54,10984.29,11045.04,451930000],["2006-06-19",11014.87,10942.11,10886.63,11098.99,377040000],["2006-06-20",10942.03,10974.84,10895.28,11066.73,274060000],["2006-06-21",10975.24,11079.46,10952.43,11165.91,309290000],["2006-06-22",11077.78,11019.11,10954.83,11127.73,250460000],["2006-06-23",11019.19,10989.09,10932.82,11098.67,221940000],["2006-06-26",10990.29,11045.28,10937.06,11089.07,202770000],["2006-06-27",11048.24,10924.74,10920.73,11064.09,269010000],["2006-06-28",10925.3,10973.56,10869.02,11026.07,260240000],["2006-06-29",10974.36,11190.8,10974.36,11225.06,337830000],["2006-06-30",11190.8,11150.22,11100.11,11288.86,365670000],["2006-07-03",11149.34,11228.02,11146.06,11277.09,134790000],["2006-07-05",11225.06,11151.82,11083.94,11239.47,248320000],["2006-07-06",11147.12,11225.3,11117.16,11301.58,224520000],["2006-07-07",11224.18,11090.67,11040.32,11227.62,253730000],["2006-07-10",11130.53,11103.55,11090.1,11174.47,207740000],["2006-07-11",11102.59,11134.77,10987.33,11186.32,298130000],["2006-07-12",11133.97,11013.18,10973.37,11181.12,266320000],["2006-07-13",11012.62,10846.29,10790.82,11015.19,328780000],["2006-07-14",10846.53,10739.35,10664.43,10892.64,312080000],["2006-07-17",10739.35,10747.36,10668.35,10858.22,251640000],["2006-07-18",10745.84,10799.23,10658.35,10867.02,288860000],["2006-07-19",10854.22,11011.42,10796.74,11038.16,343400000],["2006-07-20",11007.26,10928.1,10884.47,11098.75,336300000],["2006-07-21",10937.94,10868.38,10778.58,10995.73,433240000],["2006-07-24",10868.7,11051.05,10868.7,11096.35,269370000],["2006-07-25",11037.59,11103.71,11000.05,11133.73,281840000],["2006-07-26",11102.91,11102.51,10987.41,11208.09,287170000],["2006-07-27",11104.19,11100.43,11040.8,11245.47,286530000],["2006-07-28",11102.11,11219.7,11102.11,11282.05,269730000],["2006-07-31",11218.9,11185.68,11115.24,11265.8,226190000],["2006-08-01",11184.8,11125.73,11035.92,11210.65,199150000],["2006-08-02",11167.91,11199.92,11124.52,11228.98,229410000],["2006-08-03",11195.28,11242.59,11101.55,11304.78,211890000],["2006-08-04",11244.59,11240.35,11165.11,11367.94,210410000],["2006-08-07",11239.47,11219.38,11143.02,11294.14,169710000],["2006-08-08",11218.18,11173.59,11117.8,11319.51,212270000],["2006-08-09",11168.47,11076.18,11044.64,11296.22,231270000],["2006-08-10",11073.14,11124.37,10998.06,11176.47,211270000],["2006-08-11",11103.55,11088.02,11042.88,11121.4,166870000],["2006-08-14",11089.07,11097.87,11049.68,11242.83,205830000],["2006-08-15",11098.03,11230.26,11098.03,11271.25,208750000],["2006-08-16",11224.91,11327.12,11207.85,11373.78,219190000],["2006-08-17",11321.19,11334.96,11298.54,11372.34,243000000],["2006-08-18",11333.76,11381.47,11273.49,11437.66,282660000],["2006-08-21",11353.29,11345.04,11322.31,11381.46,196220000],["2006-08-22",11344.41,11339.84,11279.25,11426.13,213690000],["2006-08-23",11337.12,11297.9,11238.67,11394.75,170410000],["2006-08-24",11297.82,11304.46,11232.83,11386.59,170710000],["2006-08-25",11301.22,11284.05,11218.66,11350.09,150200000],["2006-08-28",11285.33,11352.01,11240.91,11411.24,180810000],["2006-08-29",11352.65,11369.94,11255.88,11432.38,198620000],["2006-08-30",11365.98,11382.91,11309.99,11452.95,180100000],["2006-08-31",11383.47,11381.15,11326.8,11451.03,156960000],["2006-09-01",11427.41,11464.15,11381.14,11476.4,168010000],["2006-09-05",11461.83,11469.28,11385.95,11533.87,184960000],["2006-09-06",11421.33,11406.2,11395.15,11469.27,190990000],["2006-09-07",11405.16,11331.44,11273.89,11443.66,213670000],["2006-09-08",11332.24,11392.11,11295.18,11448.3,161650000],["2006-09-11",11389.87,11396.84,11295.9,11468.88,216000000],["2006-09-12",11412.52,11498.09,11396.83,11512.74,237300000],["2006-09-13",11487.69,11543.32,11423.73,11605.59,214190000],["2006-09-14",11508.82,11527.39,11495.77,11548.84,203780000],["2006-09-15",11528.75,11560.77,11504.57,11661.38,365450000],["2006-09-18",11538.35,11555,11528.43,11588.22,192680000],["2006-09-19",11554.6,11540.91,11450.3,11605.67,178880000],["2006-09-20",11542.28,11613.19,11514.5,11680.19,226390000],["2006-09-21",11611.67,11533.23,11471.76,11677.39,241370000],["2006-09-22",11532.91,11508.1,11423.57,11588.62,198480000],["2006-09-25",11536.67,11575.81,11486,11616.23,267990000],["2006-09-26",11575.73,11669.39,11517.54,11723.74,283670000],["2006-09-27",11670.19,11689.24,11595.75,11775.6,296890000],["2006-09-28",11689.4,11718.45,11625.92,11775.36,236500000],["2006-09-29",11718.05,11679.07,11642.17,11782.49,216040000],["2006-10-02",11678.99,11670.35,11608.79,11773.6,198010000],["2006-10-03",11670.11,11727.34,11608.23,11794.41,230570000],["2006-10-04",11722.94,11850.61,11654.02,11879.18,281860000],["2006-10-05",11832.51,11866.69,11821.55,11869.33,253550000],["2006-10-06",11865.49,11850.21,11743.35,11921.04,242980000],["2006-10-09",11849.56,11857.81,11759.36,11923.53,177940000],["2006-10-10",11857.73,11867.17,11778.09,11930.33,227210000],["2006-10-11",11865.49,11852.13,11762.72,11907.6,256040000],["2006-10-12",11896.63,11947.7,11852.12,11959.14,291010000],["2006-10-13",11947.22,11960.51,11862.29,12009.97,295100000],["2006-10-16",11957.7,11980.59,11945.7,11996.92,217430000],["2006-10-17",11977.4,11950.02,11849.16,12024.54,238130000],["2006-10-18",11947.62,11992.68,11900.79,12108.91,276350000],["2006-10-19",11988.92,12011.73,11911.44,12082.33,260150000],["2006-10-20",12013.01,12002.37,11881.34,12087.38,313840000],["2006-10-23",12001.33,12116.91,11940.41,12177.35,288780000],["2006-10-24",12116.51,12127.88,12028.14,12204.8,257650000],["2006-10-25",12127.24,12134.68,12017.66,12212.16,238470000],["2006-10-26",12134.84,12163.66,12037.99,12236.1,237150000],["2006-10-27",12164.78,12090.26,12024.78,12202.72,277340000],["2006-10-30",12074.01,12086.49,12050.23,12117.07,206240000],["2006-10-31",12086.18,12080.73,11986.84,12160.46,277410000],["2006-11-01",12080.25,12031.02,11972.99,12160.7,245720000],["2006-11-02",12023.98,12018.54,11938.89,12070.25,222140000],["2006-11-03",12018.3,11986.04,11928.97,12095.3,197740000],["2006-11-06",11985.16,12105.55,11973.23,12146.45,211250000],["2006-11-07",12104.75,12156.77,12065.2,12239.94,222400000],["2006-11-08",12147.38,12176.54,12051.6,12233.54,252650000],["2006-11-09",12174.7,12103.3,12039.59,12236.1,275340000],["2006-11-10",12102.74,12108.43,12074.01,12173.08,204440000],["2006-11-13",12084.89,12131.88,12084.89,12164.22,194050000],["2006-11-14",12132.44,12218.01,12051.68,12261.15,255300000],["2006-11-15",12214.37,12251.71,12156.37,12326.07,258840000],["2006-11-16",12250.05,12305.82,12204,12375.37,223350000],["2006-11-17",12293.49,12342.55,12278.2,12342.55,285110000],["2006-11-20",12340.71,12316.54,12257.34,12400.1,228960000],["2006-11-21",12312.13,12321.59,12233.94,12409.31,216660000],["2006-11-22",12321.91,12326.95,12238.43,12403.54,177740000],["2006-11-24",12321.71,12280.17,12219.28,12340.89,77630000],["2006-11-27",12279.13,12121.71,12079.01,12303.32,236740000],["2006-11-28",12095.27,12136.44,12073.4,12148.78,222630000],["2006-11-29",12134.4,12226.73,12119.7,12283.05,219270000],["2006-11-30",12226.73,12221.93,12118.42,12317.1,294890000],["2006-12-01",12220.97,12194.13,12070.52,12289.3,275410000],["2006-12-04",12195.57,12283.85,12149.27,12349.87,270630000],["2006-12-05",12283.69,12331.6,12218.24,12398.57,233170000],["2006-12-06",12328.72,12309.25,12239.95,12390.88,220840000],["2006-12-07",12310.13,12278.41,12233.06,12396.33,212230000],["2006-12-08",12256.21,12307.48,12243.31,12332.16,240800000],["2006-12-11",12306.21,12328.48,12245.32,12399.54,213850000],["2006-12-12",12328.24,12315.58,12222.65,12396.01,248140000],["2006-12-13",12312.71,12317.5,12263.19,12411.55,213520000],["2006-12-14",12317.5,12416.76,12271.44,12472.76,253900000],["2006-12-15",12417.96,12445.52,12377.35,12536.37,417750000],["2006-12-18",12446.24,12441.27,12372.3,12545.74,237310000],["2006-12-19",12439.51,12471.32,12348.5,12517.78,233450000],["2006-12-20",12471.32,12463.87,12393.45,12549.35,193300000],["2006-12-21",12461.62,12421.25,12369.97,12526.59,192090000],["2006-12-22",12407.87,12343.21,12341.77,12417.96,138050000],["2006-12-26",12341.94,12407.63,12301.4,12439.19,110210000],["2006-12-27",12463.46,12510.57,12407.62,12518.34,143650000],["2006-12-28",12510.57,12501.52,12440.23,12566.17,126740000],["2006-12-29",12500.48,12463.15,12423.81,12560.16,161560000],["2007-01-03",12459.54,12474.52,12373.82,12630.34,327200000],["2007-01-04",12467.32,12480.69,12405.47,12510.26,259060000],["2007-01-05",12480.05,12398.01,12326.79,12504.4,235220000],["2007-01-08",12393.93,12423.49,12337.53,12445.37,223500000],["2007-01-09",12424.77,12416.6,12337.85,12516.66,225190000],["2007-01-10",12417,12442.16,12313.01,12487.18,226570000],["2007-01-11",12442.96,12514.98,12413.72,12586.12,261720000],["2007-01-12",12514.66,12556.08,12432.3,12616.08,256530000],["2007-01-16",12555.84,12582.59,12489.9,12638.27,242720000],["2007-01-17",12563.53,12577.15,12550.95,12613.28,272720000],["2007-01-18",12575.06,12567.93,12487.9,12674.16,250690000],["2007-01-19",12567.93,12565.53,12462.5,12649.89,287480000],["2007-01-22",12566.33,12477.16,12389.68,12619.04,293400000],["2007-01-23",12467.96,12533.8,12467.96,12553.44,236760000],["2007-01-24",12534.37,12621.77,12489.98,12659.42,216920000],["2007-01-25",12621.77,12502.56,12461.54,12670.48,245780000],["2007-01-26",12503.28,12487.02,12391.44,12582.67,247020000],["2007-01-29",12487.1,12490.78,12422.93,12599.74,234510000],["2007-01-30",12484.7,12523.31,12463.07,12538.06,244040000],["2007-01-31",12520.03,12621.69,12461.3,12685.54,258410000],["2007-02-01",12617.2,12673.68,12563.85,12741.3,235130000],["2007-02-02",12673.84,12653.49,12582.99,12740.65,203610000],["2007-02-05",12641.08,12661.74,12630.5,12681.06,204140000],["2007-02-06",12661.66,12666.31,12586.44,12738.41,201010000],["2007-02-07",12656.86,12666.87,12589.56,12748.99,194020000],["2007-02-08",12639.16,12637.63,12576.59,12666.88,193820000],["2007-02-09",12638.03,12580.83,12518.58,12725.59,220330000],["2007-02-12",12595.9,12552.55,12536.77,12605.11,174980000],["2007-02-13",12549.19,12654.85,12549.19,12702.36,204940000],["2007-02-14",12651.29,12741.86,12623.21,12793.29,210880000],["2007-02-15",12741.7,12765.01,12681.85,12828.38,183280000],["2007-02-16",12764.13,12767.57,12685.86,12829.42,243560000],["2007-02-20",12766.85,12786.64,12675.04,12845.76,205760000],["2007-02-21",12782.87,12738.41,12662.79,12813.88,213470000],["2007-02-22",12735.77,12686.02,12621.93,12792.97,206860000],["2007-02-23",12679.89,12647.48,12578.51,12726.79,215430000],["2007-02-26",12647.88,12632.26,12562.72,12746.34,230080000],["2007-02-27",12628.9,12216.24,12078.85,12628.9,393300000],["2007-02-28",12214.92,12268.63,12122.03,12396.81,412820000],["2007-03-01",12265.59,12234.34,11996.17,12338.89,372010000],["2007-03-02",12233.78,12114.1,12064.91,12293.15,315180000],["2007-03-05",12111.61,12050.41,11973.58,12220.16,278770000],["2007-03-06",12051.17,12207.59,12051.17,12252.61,278810000],["2007-03-07",12204.46,12192.45,12122.11,12315.18,263540000],["2007-03-08",12193.33,12260.7,12183.79,12355.47,241070000],["2007-03-09",12262.06,12276.32,12200.62,12379.51,211040000],["2007-03-12",12275.68,12318.62,12205.58,12385.44,219580000],["2007-03-13",12307.49,12075.96,12049.85,12319.66,312340000],["2007-03-14",12074.52,12133.4,11926.79,12187.88,333450000],["2007-03-15",12133.16,12159.68,12060.1,12228.42,232600000],["2007-03-16",12160.16,12110.41,12053.05,12226.01,388660000],["2007-03-19",12110.41,12226.17,12110.41,12273.52,208480000],["2007-03-20",12226.81,12288.1,12172.66,12324.31,196620000],["2007-03-21",12288.98,12447.52,12220.49,12489.02,246000000],["2007-03-22",12446.72,12461.14,12364.21,12524.03,232700000],["2007-03-23",12460.5,12481.01,12396.89,12550.07,206410000],["2007-03-26",12480.37,12469.07,12339.53,12526.27,219960000],["2007-03-27",12468.59,12397.29,12336.89,12484.54,209340000],["2007-03-28",12396.49,12300.36,12234.5,12415.56,224830000],["2007-03-29",12301.48,12348.75,12251.89,12424.77,208160000],["2007-03-30",12348.91,12354.35,12237.87,12442.4,233630000],["2007-04-02",12354.52,12382.3,12284.54,12450.81,209420000],["2007-04-03",12431.28,12510.93,12378.94,12534.49,220470000],["2007-04-04",12511.36,12530.05,12444.55,12591.81,210130000],["2007-04-05",12505.73,12560.83,12501.25,12573.02,164930000],["2007-04-09",12562.64,12569.14,12505.83,12641.22,191590000],["2007-04-10",12568.49,12573.85,12496.48,12641.87,214690000],["2007-04-11",12573.12,12484.62,12432.53,12618.63,245470000],["2007-04-12",12483.64,12552.96,12407.5,12580.92,218300000],["2007-04-13",12551.91,12612.13,12504.04,12654.47,224240000],["2007-04-16",12611.64,12720.46,12596.36,12770.6,225020000],["2007-04-17",12719.56,12773.04,12669.5,12837.4,256880000],["2007-04-18",12771.08,12803.84,12691.2,12871.21,261950000],["2007-04-19",12799.77,12808.63,12677.47,12889.17,262590000],["2007-04-20",12811.15,12961.98,12811.15,13035.77,415650000],["2007-04-23",12961.49,12919.4,12867.96,13029.59,223290000],["2007-04-24",12919.64,12953.94,12845.12,13033.66,238400000],["2007-04-25",12951.42,13089.89,12929.8,13142.31,250170000],["2007-04-26",13088.84,13105.5,13016.43,13197.49,251620000],["2007-04-27",13104.04,13120.94,13002.37,13195.05,270910000],["2007-04-30",13120.21,13062.91,13003.91,13226.99,264090000],["2007-05-01",13062.75,13136.14,12993.02,13188.96,248960000],["2007-05-02",13133.94,13211.88,13105.34,13291.6,251340000],["2007-05-03",13206.65,13241.38,13131.42,13306.55,247240000],["2007-05-04",13243.08,13264.62,13176.61,13340.6,236320000],["2007-05-07",13264.13,13312.97,13218.87,13385.06,206190000],["2007-05-08",13309.4,13309.07,13192.45,13359.05,225600000],["2007-05-09",13300.62,13362.87,13229.92,13410.17,237040000],["2007-05-10",13359.05,13215.13,13161.08,13376.2,224640000],["2007-05-11",13212.2,13326.22,13192.62,13373.35,210570000],["2007-05-14",13325.81,13346.78,13265.02,13432.84,199620000],["2007-05-15",13346.05,13383.84,13302.65,13518.33,265250000],["2007-05-16",13374.13,13487.53,13325.49,13526.54,237790000],["2007-05-17",13486.96,13476.72,13384.89,13558.24,195810000],["2007-05-18",13476.4,13556.53,13454.46,13611.95,282930000],["2007-05-21",13556.53,13542.88,13473.31,13636.98,215550000],["2007-05-22",13544.99,13539.95,13466.57,13632.03,201290000],["2007-05-23",13540.84,13525.65,13476.72,13648.69,208260000],["2007-05-24",13522.6,13441.13,13391.56,13645.52,240810000],["2007-05-25",13441.94,13507.28,13410,13571.48,183470000],["2007-05-29",13507.28,13521.34,13428.86,13603.26,205620000],["2007-05-30",13517.89,13633.08,13403.26,13650.64,224780000],["2007-05-31",13633,13627.64,13564.49,13718.82,243510000],["2007-06-01",13628.69,13668.11,13562.54,13756.69,212780000],["2007-06-04",13667.21,13676.32,13575.14,13723.37,177830000],["2007-06-05",13673.19,13595.46,13523.7,13689.4,223040000],["2007-06-06",13590.66,13465.67,13403.1,13606.75,236830000],["2007-06-07",13463.48,13266.73,13236.34,13517.85,298880000],["2007-06-08",13267.14,13424.39,13207.73,13445.19,242000000],["2007-06-11",13423.74,13424.96,13335.16,13519.88,183300000],["2007-06-12",13424.39,13295.01,13264.05,13474.12,233420000],["2007-06-13",13287.62,13482.35,13287.62,13502.76,253050000],["2007-06-14",13482.43,13553.73,13444.07,13622.66,228680000],["2007-06-15",13556.65,13639.48,13556.65,13741.18,425080000],["2007-06-18",13639,13612.98,13560.15,13720.29,174380000],["2007-06-19",13611.68,13635.42,13527.14,13705.41,233720000],["2007-06-20",13636.56,13489.42,13469.43,13735.08,274670000],["2007-06-21",13486.66,13545.84,13368.79,13596.56,241170000],["2007-06-22",13545.03,13360.26,13323.51,13564.13,380870000],["2007-06-25",13360.09,13352.05,13273.68,13519.34,251720000],["2007-06-26",13352.37,13337.66,13272.79,13491.7,240950000],["2007-06-27",13336.93,13427.73,13205.08,13455.36,246010000],["2007-06-28",13427.48,13422.28,13342.05,13537.47,207130000],["2007-06-29",13422.61,13408.62,13291.32,13556.16,262110000],["2007-07-02",13409.6,13535.43,13406.59,13586.97,196410000],["2007-07-03",13556.87,13577.3,13531.83,13592.07,111580000],["2007-07-05",13576.24,13565.84,13459.84,13637.78,188840000],["2007-07-06",13559.01,13611.68,13501.54,13670.46,176040000],["2007-07-09",13612.66,13649.97,13563.89,13739.06,192840000],["2007-07-10",13648.59,13501.7,13463.57,13685.9,274420000],["2007-07-11",13500.4,13577.87,13435.45,13638.75,224410000],["2007-07-12",13579.33,13861.73,13579.33,13889.45,300520000],["2007-07-13",13859.86,13907.25,13784.83,13982.93,223820000],["2007-07-16",13907.09,13950.98,13834.33,14053.57,209060000],["2007-07-17",13951.96,13971.55,13880.67,14095.6,266020000],["2007-07-18",13955.05,13918.22,13768.73,14020.89,324400000],["2007-07-19",13918.79,14000.41,13860.18,14121.04,265390000],["2007-07-20",14000.73,13851.08,13745.65,14039.67,377650000],["2007-07-23",13851.73,13943.42,13819.54,14039.59,237450000],["2007-07-24",13940.9,13716.95,13661.51,13967.65,296990000],["2007-07-25",13718.25,13785.07,13607.7,13919.77,266860000],["2007-07-26",13783.12,13473.57,13307.74,13793.61,426880000],["2007-07-27",13472.68,13265.47,13228.57,13589.17,337120000],["2007-07-30",13266.21,13358.31,13143.87,13445.12,295450000],["2007-07-31",13360.66,13211.99,13182.15,13579.41,319890000],["2007-08-01",13211.09,13362.37,13041.77,13431.06,355960000],["2007-08-02",13357.82,13463.33,13272.79,13547.47,264830000],["2007-08-03",13462.25,13181.91,13156.79,13539.5,301800000],["2007-08-06",13183.13,13468.78,13077.05,13501.86,311810000],["2007-08-07",13467.72,13504.3,13282.38,13635.09,273340000],["2007-08-08",13497.23,13657.86,13386.92,13769.63,288040000],["2007-08-09",13652.33,13270.68,13196.05,13675.66,362500000],["2007-08-10",13270.59,13239.54,12958.04,13386.43,338560000],["2007-08-13",13238.24,13236.53,13163.54,13440.08,215260000],["2007-08-14",13235.72,13028.92,12974.3,13309.04,269120000],["2007-08-15",13021.93,12861.47,12800.83,13184.51,272760000],["2007-08-16",12859.52,12845.78,12455.92,12996.73,457150000],["2007-08-17",12848.05,13079.08,12847.24,13289.7,423940000],["2007-08-20",13078.51,13121.35,12938.77,13245.8,231810000],["2007-08-21",13120.05,13090.86,12975.68,13228.57,204000000],["2007-08-22",13088.26,13236.13,13075.34,13304.33,205530000],["2007-08-23",13237.27,13235.88,13127.69,13358.22,198160000],["2007-08-24",13231.78,13378.87,13174.27,13402.2,186060000],["2007-08-27",13377.16,13322.13,13248.32,13438.46,152440000],["2007-08-28",13318.43,13041.85,13024.29,13319.61,230470000],["2007-08-29",13043.07,13289.29,13020.63,13336.93,227440000],["2007-08-30",13287.91,13238.73,13126.39,13355.46,193240000],["2007-08-31",13240.84,13357.74,13240.84,13472.35,234930000],["2007-09-04",13358.39,13448.86,13248.57,13521.86,262260000],["2007-09-05",13442.85,13305.47,13203.86,13442.85,231850000],["2007-09-06",13306.44,13363.35,13217.11,13464.79,203600000],["2007-09-07",13360.74,13113.38,13059.16,13360.74,238300000],["2007-09-10",13116.39,13127.85,12992.02,13280.67,221760000],["2007-09-11",13129.4,13308.39,13124.68,13369.77,200160000],["2007-09-12",13298.31,13291.65,13195.4,13408.62,195280000],["2007-09-13",13292.38,13424.88,13292.38,13519.91,209950000],["2007-09-14",13421.39,13442.52,13273.68,13507.55,204780000],["2007-09-17",13441.95,13403.42,13306.69,13514.71,169710000],["2007-09-18",13403.18,13739.39,13379.68,13772.15,277620000],["2007-09-19",13740.61,13815.56,13689.8,13936.68,276590000],["2007-09-20",13813.52,13766.7,13680.21,13893.02,200880000],["2007-09-21",13768.33,13820.19,13740.61,13948.95,419390000],["2007-09-24",13821.57,13759.06,13702.89,13930.74,236690000],["2007-09-25",13757.84,13778.65,13629.16,13847.1,213040000],["2007-09-26",13779.3,13878.15,13741.26,13962.61,206560000],["2007-09-27",13879.53,13912.94,13811.17,13991.63,156920000],["2007-09-28",13912.94,13895.63,13802.96,13994.64,203030000],["2007-10-01",13895.71,14087.55,13869.86,14147.3,205720000],["2007-10-02",14087.14,14047.31,13951.72,14166.16,169270000],["2007-10-03",14038.86,13968.05,13883.43,14090.48,178920000],["2007-10-04",13967.89,13974.31,13894.98,14074.54,143300000],["2007-10-05",13969.07,14066.01,13965.05,14169.49,183540000],["2007-10-08",14065.36,14043.73,13747.41,14134.05,116420000],["2007-10-09",14043.73,14164.53,13980.9,14198.83,176740000],["2007-10-10",14165.02,14078.69,13963.26,14225.66,163280000],["2007-10-11",14079.1,14015.12,13917.82,14279.96,235090000],["2007-10-12",14016.34,14093.08,13949.85,14168.51,178740000],["2007-10-15",14092.43,13984.8,13877.82,14157.38,220490000],["2007-10-16",13986.34,13912.94,13810.68,14061.37,229920000],["2007-10-17",13920.66,13892.54,13738.66,14075.84,315420000],["2007-10-18",13887.9,13888.96,13746.22,13984.39,205540000],["2007-10-19",13888.47,13522.02,13478.94,13888.47,332350000],["2007-10-22",13521.62,13566.97,13337.9,13636.8,229440000],["2007-10-23",13568.93,13676.23,13494.95,13754.91,206550000],["2007-10-24",13675.58,13675.25,13423.74,13751.5,259150000],["2007-10-25",13677.85,13671.92,13471.87,13819.78,274330000],["2007-10-26",13675.66,13806.7,13622.01,13885.95,311390000],["2007-10-29",13807.35,13870.26,13748.33,13966.18,207930000],["2007-10-30",13869.04,13792.47,13719.8,13930.91,189730000],["2007-10-31",13792.06,13930.01,13711.59,13990.65,277660000],["2007-11-01",13924.16,13567.87,13522.75,13924.16,335560000],["2007-11-02",13569.9,13595.1,13381.64,13708.58,279780000],["2007-11-05",13592.58,13543.4,13393.67,13666.15,259590000],["2007-11-06",13542.34,13660.94,13460.73,13716.55,252360000],["2007-11-07",13646.72,13300.02,13269.46,13646.72,273050000],["2007-11-08",13299.7,13266.29,13001.93,13463.66,403680000],["2007-11-09",13261.17,13042.74,12920.65,13321.81,356840000],["2007-11-12",13039.16,12987.55,12910.4,13238.73,291980000],["2007-11-13",12975.11,13307.09,12975.11,13357.57,298250000],["2007-11-14",13305.47,13231.01,13159.88,13465.2,267510000],["2007-11-15",13230.68,13110.05,13007.95,13333.59,242570000],["2007-11-16",13109.48,13176.79,12987.22,13293.44,314920000],["2007-11-19",13176.3,12958.44,12871.14,13195.48,285790000],["2007-11-20",12955.92,13010.14,12800.74,13179.23,325810000],["2007-11-21",13006.65,12799.04,12725.39,13055.59,284550000],["2007-11-23",12889.45,12980.88,12796.29,12981.56,122250000],["2007-11-26",12979.99,12743.44,12707.26,13104.44,265610000],["2007-11-27",12744.78,12958.44,12711.98,13040.38,296070000],["2007-11-28",12958.04,13289.45,12958.04,13353.51,310080000],["2007-11-29",13287.91,13311.73,13150.21,13399.03,201410000],["2007-11-30",13314.25,13371.72,13225.32,13570.31,312570000],["2007-12-03",13368.22,13314.57,13207.6,13490.24,212170000],["2007-12-04",13311.24,13248.73,13139.56,13395.21,204940000],["2007-12-05",13244.01,13444.96,13244.01,13513,256800000],["2007-12-06",13445.85,13619.89,13362.37,13652.49,197270000],["2007-12-07",13618.27,13625.58,13514.22,13744.02,179420000],["2007-12-10",13623.55,13727.03,13582.5,13807.02,190220000],["2007-12-11",13726.87,13432.77,13374.89,13850.92,280630000],["2007-12-12",13434.8,13473.9,13299.61,13778.98,310470000],["2007-12-13",13473.98,13517.96,13281,13586.73,248800000],["2007-12-14",13515.11,13339.85,13284.66,13557.54,245590000],["2007-12-17",13339.2,13167.2,13111.92,13378.38,243400000],["2007-12-18",13168.66,13232.47,13059.32,13346.84,233020000],["2007-12-19",13231.98,13207.27,13097.77,13368.79,208330000],["2007-12-20",13206.46,13245.64,13112.98,13354,203910000],["2007-12-21",13241.66,13450.65,13241.66,13518.2,430600000],["2007-12-24",13487.12,13550.04,13451.35,13562.72,86400000],["2007-12-26",13547.95,13551.69,13440.16,13614.53,122410000],["2007-12-27",13549.17,13359.61,13325.71,13551.53,145770000],["2007-12-28",13361.23,13365.87,13272.14,13494.3,142930000],["2007-12-31",13364.16,13264.82,13197.35,13423.91,167240000],["2008-01-02",13261.82,13043.96,12969.42,13338.23,239580000],["2008-01-03",13044.12,13056.72,12968.44,13197.43,200620000],["2008-01-04",13046.56,12800.18,12740.51,13049.65,304210000],["2008-01-07",12801.15,12827.49,12640.44,12984.95,306700000],["2008-01-08",12820.9,12589.07,12511.03,12998.11,322690000],["2008-01-09",12590.21,12735.31,12431.53,12814.97,332900000],["2008-01-10",12733.11,12853.09,12632.15,12931.29,325330000],["2008-01-11",12850.74,12606.3,12495.91,12863.34,301890000],["2008-01-14",12613.78,12778.15,12596.95,12866.1,245370000],["2008-01-15",12777.5,12501.11,12425.92,12777.5,339700000],["2008-01-16",12476.81,12466.16,12294.48,12699.05,500040000],["2008-01-17",12467.05,12159.21,12089.38,12597.85,439830000],["2008-01-18",12159.94,12099.3,11953.71,12441.85,483300000],["2008-01-22",12092.72,11971.19,11508.74,12167.42,506500000],["2008-01-23",11969.08,12270.17,11530.12,12339.1,536520000],["2008-01-24",12272.69,12378.61,12114.83,12522.82,387900000],["2008-01-25",12391.7,12207.17,12103.61,12590.69,393660000],["2008-01-28",12205.71,12383.89,12061.42,12423.81,278990000],["2008-01-29",12385.19,12480.3,12262.29,12604.92,285090000],["2008-01-30",12480.14,12442.83,12311.55,12715.96,334680000],["2008-01-31",12438.28,12650.36,12197.09,12734.74,394330000],["2008-02-01",12638.17,12743.19,12510.05,12841.88,379580000],["2008-02-04",12743.11,12635.16,12557.61,12810.34,237410000],["2008-02-05",12631.85,12265.13,12234.97,12631.85,334380000],["2008-02-06",12257.25,12200.1,12142.14,12436.33,296360000],["2008-02-07",12196.2,12247,12045,12366.99,326200000],["2008-02-08",12248.47,12182.13,12058.01,12330.97,262200000],["2008-02-11",12181.89,12240.01,12006.79,12332.76,268100000],["2008-02-12",12241.56,12373.41,12207.9,12524.12,256970000],["2008-02-13",12368.12,12552.24,12354.22,12627.76,236300000],["2008-02-14",12551.51,12376.98,12332.03,12611.26,233790000],["2008-02-15",12376.66,12348.21,12216.68,12441.2,289800000],["2008-02-19",12349.59,12337.22,12276.81,12571.11,257550000],["2008-02-20",12333.31,12427.26,12159.42,12489.29,298000000],["2008-02-21",12426.85,12284.3,12225.36,12545.79,293420000],["2008-02-22",12281.09,12381.02,12116.92,12429.05,307090000],["2008-02-25",12380.77,12570.22,12292.03,12612.47,288600000],["2008-02-26",12569.48,12684.92,12449.08,12771.14,291760000],["2008-02-27",12683.54,12694.28,12527.64,12815.59,263720000],["2008-02-28",12689.28,12582.18,12463.32,12713.99,247270000],["2008-02-29",12579.58,12266.39,12210.3,12579.58,351870000],["2008-03-03",12264.36,12258.9,12101.29,12344.71,259730000],["2008-03-04",12259.14,12213.8,11991.06,12291.22,347720000],["2008-03-05",12204.93,12254.99,12105.36,12392.74,304570000],["2008-03-06",12254.59,12040.39,12010.03,12267.86,283100000],["2008-03-07",12039.09,11893.69,11778.66,12131.33,307580000],["2008-03-10",11893.04,11740.15,11691.47,11993.75,312020000],["2008-03-11",11741.33,12156.81,11741.33,12205.98,372330000],["2008-03-12",12148.61,12110.24,12037.79,12360.58,288130000],["2008-03-13",12096.49,12145.74,11832.88,12242.29,336260000],["2008-03-14",12146.39,11951.09,11781.43,12249.86,380810000],["2008-03-17",11946.45,11972.25,11650.44,12119.69,382890000],["2008-03-18",11975.92,12392.66,11975.92,12411.63,367780000],["2008-03-19",12391.52,12099.66,12077.27,12525.19,328460000],["2008-03-20",12102.43,12361.32,12024.68,12434.34,502650000],["2008-03-24",12361.97,12548.64,12346.17,12687.61,264320000],["2008-03-25",12547.34,12532.6,12397.62,12639.82,237650000],["2008-03-26",12531.79,12422.86,12309.62,12531.79,235020000],["2008-03-27",12421.88,12302.46,12264.76,12528.13,235390000],["2008-03-28",12303.92,12216.4,12164.22,12441.67,209000000],["2008-03-31",12215.92,12262.89,12095.18,12384.84,273610000],["2008-04-01",12266.64,12654.36,12266.64,12693.93,295530000],["2008-04-02",12651.67,12608.92,12488.22,12790.28,232760000],["2008-04-03",12604.69,12626.03,12455.04,12734.97,183870000],["2008-04-04",12626.35,12609.42,12489.4,12738.3,181260000],["2008-04-07",12612.59,12612.43,12550.22,12786.83,198070000],["2008-04-08",12602.66,12576.44,12440.55,12664.38,197200000],["2008-04-09",12574.65,12527.26,12416.53,12686.93,194950000],["2008-04-10",12526.78,12581.98,12447.96,12705.9,227330000],["2008-04-11",12579.78,12325.42,12280.89,12579.78,286850000],["2008-04-14",12324.77,12302.06,12208.42,12430.86,216010000],["2008-04-15",12303.6,12362.47,12223.97,12459.36,208950000],["2008-04-16",12371.51,12619.27,12371.51,12670.56,269490000],["2008-04-17",12617.4,12620.49,12472.71,12725.93,217000000],["2008-04-18",12626.76,12849.36,12626.76,12965.47,304030000],["2008-04-21",12850.91,12825.02,12666.08,12902.69,192400000],["2008-04-22",12825.02,12720.23,12604.53,12870.86,214950000],["2008-04-23",12721.45,12763.22,12627,12883.8,244120000],["2008-04-24",12764.68,12848.95,12651.51,12979.88,249920000],["2008-04-25",12848.38,12891.86,12703.7,12987.29,240760000],["2008-04-28",12890.76,12871.75,12791.55,13015.62,222300000],["2008-04-29",12870.37,12831.94,12737.82,12970.27,218020000],["2008-04-30",12831.45,12820.13,12746.45,13052.91,255070000],["2008-05-01",12818.34,13010,12721.94,13079.94,245480000],["2008-05-02",13012.53,13058.2,12931.35,13191.49,205410000],["2008-05-05",13056.57,12969.54,12896.5,13105.75,197810000],["2008-05-06",12968.89,13020.83,12817.53,13071.07,199370000],["2008-05-07",13010.82,12814.35,12756.14,13097.77,235000000],["2008-05-08",12814.84,12866.78,12727.56,12965.95,195570000],["2008-05-09",12860.68,12745.88,12648.09,12871.75,180240000],["2008-05-12",12768.38,12876.05,12746.36,12903.33,198110000],["2008-05-13",12872.08,12832.18,12716.16,12957.65,236710000],["2008-05-14",12825.12,12898.38,12806.21,13037.44,206820000],["2008-05-15",12891.29,12992.66,12798.39,13028.16,217780000],["2008-05-16",12992.74,12986.8,12860.6,13069.52,249260000],["2008-05-19",12985.41,13028.16,12899.19,13170.97,193770000],["2008-05-20",13026.04,12828.68,12742.29,13026.04,265220000],["2008-05-21",12824.94,12601.19,12550.39,12926.71,265810000],["2008-05-22",12597.69,12625.62,12515.78,12743.68,216360000],["2008-05-23",12620.9,12479.63,12420.2,12637.43,190210000],["2008-05-27",12479.63,12548.35,12397.56,12626.84,201530000],["2008-05-28",12542.9,12594.03,12437.38,12693.77,213680000],["2008-05-29",12593.87,12646.22,12493.47,12760.21,206420000],["2008-05-30",12647.36,12638.32,12555.6,12750.84,210230000],["2008-06-02",12637.67,12503.82,12385.76,12645.4,199090000],["2008-06-03",12503.2,12402.85,12317.61,12620.98,227460000],["2008-06-04",12391.86,12390.48,12283.74,12540.37,238590000],["2008-06-05",12388.81,12604.45,12358.07,12652.81,236160000],["2008-06-06",12602.74,12209.81,12180.5,12602.74,307820000],["2008-06-09",12210.13,12280.32,12102.5,12406.36,266350000],["2008-06-10",12277.71,12289.76,12116.58,12425.98,240760000],["2008-06-11",12286.34,12083.77,12029.46,12317.2,247120000],["2008-06-12",12089.63,12141.58,12041.43,12337.72,260960000],["2008-06-13",12144.59,12307.35,12096.23,12376.72,247980000],["2008-06-16",12306.86,12269.08,12139.79,12381.44,222140000],["2008-06-17",12269.65,12160.3,12114.14,12378.67,174690000],["2008-06-18",12158.68,12029.06,11947.07,12212.33,212900000],["2008-06-19",12022.54,12063.09,11881.03,12188.31,230920000],["2008-06-20",12062.19,11842.69,11785.04,12078.23,429700000],["2008-06-23",11843.83,11842.36,11731.06,11986.96,182870000],["2008-06-24",11842.36,11807.43,11668.53,11962.37,225270000],["2008-06-25",11805.31,11811.83,11683.75,12008.7,236160000],["2008-06-26",11808.57,11453.42,11431.92,11808.57,302550000],["2008-06-27",11452.85,11346.51,11248.48,11556.33,338250000],["2008-06-30",11345.7,11350.01,11226.34,11504.55,282210000],["2008-07-01",11344.64,11382.26,11106.65,11465.79,299590000],["2008-07-02",11382.34,11215.51,11180.58,11510.41,230690000],["2008-07-03",11297.33,11288.53,11158.02,11336.49,148760000],["2008-07-07",11289.19,11231.96,11094.44,11477.52,248240000],["2008-07-08",11225.03,11384.21,11101.19,11459.52,271500000],["2008-07-09",11381.93,11147.44,11115.61,11505.12,227100000],["2008-07-10",11148.01,11229.02,11006.01,11351.24,248010000],["2008-07-11",11226.17,11100.54,10908.64,11292.04,275010000],["2008-07-14",11103.64,11055.19,10972.63,11299.7,205360000],["2008-07-15",11050.8,10962.54,10731.96,11201.67,331390000],["2008-07-16",10961.89,11239.28,10831.61,11308.41,307590000],["2008-07-17",11238.39,11446.66,11118.46,11538.5,335260000],["2008-07-18",11436.56,11496.57,11290.5,11599.57,378610000],["2008-07-21",11495.02,11467.34,11339.02,11663.4,212850000],["2008-07-22",11457.9,11602.5,11273.32,11692.79,273690000],["2008-07-23",11603.39,11632.38,11410.02,11820.21,264520000],["2008-07-24",11630.34,11349.28,11288.79,11714.21,241140000],["2008-07-25",11341.14,11370.69,11252.47,11540.78,190920000],["2008-07-28",11369.47,11131.08,11094.76,11439.25,197550000],["2008-07-29",11133.44,11397.56,11086.13,11444.05,206930000],["2008-07-30",11397.56,11583.69,11328.68,11681.47,208520000],["2008-07-31",11577.99,11378.02,11317.69,11631.16,220200000],["2008-08-01",11379.89,11326.32,11205.41,11512.61,189700000],["2008-08-04",11326.32,11284.15,11144.59,11449.67,170250000],["2008-08-05",11286.02,11615.77,11286.02,11652.24,234990000],["2008-08-06",11603.64,11656.07,11454.64,11745.71,180060000],["2008-08-07",11655.42,11431.43,11355.63,11680.5,229610000],["2008-08-08",11432.09,11734.32,11344.23,11808.49,212830000],["2008-08-11",11729.67,11782.35,11580.19,11933.55,183190000],["2008-08-12",11781.7,11642.47,11541.43,11830.39,173590000],["2008-08-13",11632.81,11532.96,11377.37,11689.05,182550000],["2008-08-14",11532.07,11615.93,11399.84,11744.33,159790000],["2008-08-15",11611.21,11659.9,11540.05,11776.41,215040000],["2008-08-18",11659.65,11479.39,11410.18,11744.49,156290000],["2008-08-19",11478.09,11348.55,11260.53,11501.45,171580000],["2008-08-20",11345.94,11417.43,11240.18,11511.06,144880000],["2008-08-21",11415.23,11430.21,11263.63,11501.29,130020000],["2008-08-22",11426.79,11628.06,11426.79,11684,138790000],["2008-08-25",11626.19,11386.25,11336.82,11626.19,148610000],["2008-08-26",11383.56,11412.87,11284.47,11483.62,119800000],["2008-08-27",11412.46,11502.51,11349.69,11575.14,120580000],["2008-08-28",11499.87,11715.18,11493.72,11756.46,149150000],["2008-08-29",11713.23,11543.55,11508.78,11730.49,166910000],["2008-09-02",11545.63,11516.92,11444.79,11831.29,177090000],["2008-09-03",11506.01,11532.88,11328.84,11629.69,174250000],["2008-09-04",11532.48,11188.23,11130.26,11532.48,229200000],["2008-09-05",11185.63,11220.96,10998.77,11301.73,198300000],["2008-09-08",11224.87,11510.74,11224.87,11656.64,273000000],["2008-09-09",11514.73,11230.73,11209.81,11623.5,257300000],["2008-09-10",11233.91,11268.92,11135.64,11453.5,214260000],["2008-09-11",11264.44,11433.71,11018.72,11461.15,247820000],["2008-09-12",11429.32,11421.99,11191.08,11532.72,238890000],["2008-09-15",11416.37,10917.51,10849.85,11416.37,432970000],["2008-09-16",10905.62,11059.02,10604.7,11193.12,494760000],["2008-09-17",11056.58,10609.66,10521.81,11068.87,463200000],["2008-09-18",10609.01,11019.69,10403.75,11149.07,488060000],["2008-09-19",11027.51,11388.44,11027.51,11415.48,655110000],["2008-09-22",11394.42,11015.69,10956.43,11450.81,213210000],["2008-09-23",11015.69,10854.17,10763.77,11214.65,204480000],["2008-09-24",10850.02,10825.17,10696.38,11041.02,183630000],["2008-09-25",10827.17,11022.06,10799.77,11206.05,218530000],["2008-09-26",11019.04,11143.13,10781.37,11218.48,232560000],["2008-09-29",11139.62,10365.45,10266.76,11139.62,385940000],["2008-09-30",10371.58,10850.66,10371.58,10922.03,319770000],["2008-10-01",10847.4,10831.07,10495.99,11022.06,256670000],["2008-10-02",10825.54,10482.85,10368.08,10843.1,395330000],["2008-10-03",10483.96,10325.38,10261.75,10844.69,299690000],["2008-10-06",10322.52,9955.5,9503.1,10322.52,391460000],["2008-10-07",9955.42,9447.11,9391.67,10205.04,362520000],["2008-10-08",9437.23,9258.1,9042.97,9778.04,479270000],["2008-10-09",9261.69,8579.19,8523.27,9522.77,436740000],["2008-10-10",8568.67,8451.19,7773.71,8989.13,674920000],["2008-10-13",8462.42,9387.61,8462.42,9501.91,399290000],["2008-10-14",9388.97,9310.99,9050.06,9924.28,412740000],["2008-10-15",9301.91,8577.91,8516.5,9301.91,374350000],["2008-10-16",8577.04,8979.26,8176.17,9073.64,422450000],["2008-10-17",8975.35,8852.22,8640.83,9304.38,360600000],["2008-10-20",8852.3,9265.43,8799.49,9305.89,241400000],["2008-10-21",9179.11,9045.21,9017.3,9293.07,231160000],["2008-10-22",9027.84,8519.21,8324.07,9027.84,348840000],["2008-10-23",8519.77,8691.25,8200.06,8864.48,340740000],["2008-10-24",8683.21,8378.95,8088.63,8683.21,335680000],["2008-10-27",8375.92,8175.77,8085.37,8639.64,281180000],["2008-10-28",8178.72,9065.12,8153.79,9112.51,372160000],["2008-10-29",9062.33,8990.96,8800.61,9405.05,316230000],["2008-10-30",9004.66,9180.69,8916.81,9380.36,267210000],["2008-10-31",9179.09,9325.01,9014.78,9498.48,310950000],["2008-11-03",9326.04,9319.83,9175.03,9488.92,180970000],["2008-11-04",9323.89,9625.28,9323.89,9711.46,254930000],["2008-11-05",9616.6,9139.27,9086.06,9628.15,264640000],["2008-11-06",9134.01,8695.79,8607.14,9216.37,344350000],["2008-11-07",8696.03,8943.81,8661.22,9032.54,246300000],["2008-11-10",8946.6,8870.54,8735.61,9212.94,221230000],["2008-11-11",8864.32,8693.96,8499.62,8892.2,257270000],["2008-11-12",8684.52,8282.66,8235.66,8684.52,314660000],["2008-11-13",8281.14,8835.25,7947.74,8898.41,476600000],["2008-11-14",8822.19,8497.31,8421.08,8980.93,304370000],["2008-11-17",8494.84,8273.58,8197.12,8596.31,278220000],["2008-11-18",8273.34,8424.75,8075.81,8540.08,366390000],["2008-11-19",8420.69,7997.28,7967.33,8534.34,350470000],["2008-11-20",7995.53,7552.29,7464.51,8224.35,528130000],["2008-11-21",7552.37,8046.42,7392.27,8121.45,569010000],["2008-11-24",8048.09,8443.39,8023.32,8624.27,491890000],["2008-11-25",8445.14,8479.47,8244.43,8682.09,374020000],["2008-11-26",8464.49,8726.61,8250.8,8760.46,283920000],["2008-11-28",8690.24,8829.04,8687.05,8840.33,155510000],["2008-12-01",8826.89,8149.09,8123.04,8826.89,321010000],["2008-12-02",8153.75,8419.09,8072.47,8490.62,307520000],["2008-12-03",8409.14,8591.69,8170.19,8654.77,294680000],["2008-12-04",8587.07,8376.24,8222.84,8705.98,280880000],["2008-12-05",8376.08,8635.42,8084.25,8722.47,346370000],["2008-12-08",8637.65,8934.18,8637.65,9151.61,358970000],["2008-12-09",8934.1,8691.33,8591.69,8978.14,284950000],["2008-12-10",8693,8761.42,8589.86,8942.46,232830000],["2008-12-11",8750.13,8565.09,8480.18,8861.86,290540000],["2008-12-12",8563.1,8629.68,8272.22,8705.43,271030000],["2008-12-15",8628.81,8564.53,8431.04,8738.4,229940000],["2008-12-16",8565.65,8924.14,8534.03,8985.63,337190000],["2008-12-17",8921.91,8824.34,8701.13,9001.96,239260000],["2008-12-18",8823.94,8604.99,8516.02,8946.36,274080000],["2008-12-19",8606.5,8579.11,8499.06,8823.78,550150000],["2008-12-22",8573.37,8519.69,8351.79,8672.06,211090000],["2008-12-23",8518.65,8419.49,8376.8,8647.6,174640000],["2008-12-24",8428.17,8468.48,8417.02,8498.26,66930000],["2008-12-26",8468.71,8515.55,8434.94,8581.58,86760000],["2008-12-29",8515.87,8483.93,8349.24,8575.6,153730000],["2008-12-30",8487.51,8668.39,8463.7,8700.89,162560000],["2008-12-31",8666.48,8776.39,8634.06,8862.65,226760000],["2009-01-02",8772.25,9034.69,8725.1,9080.57,213700000],["2009-01-05",9027.13,8952.89,8841.7,9093.47,233760000],["2009-01-06",8954.57,9015.1,8868.07,9175.19,215410000],["2009-01-07",8996.94,8769.7,8690.45,8996.94,266710000],["2009-01-08",8769.94,8742.46,8593.52,8807.14,226620000],["2009-01-09",8738.8,8599.18,8541.75,8800.45,204300000],["2009-01-12",8599.26,8473.97,8391.85,8653.97,273550000],["2009-01-13",8474.61,8448.56,8325.59,8584.68,304050000],["2009-01-14",8446.01,8200.14,8097.95,8446.01,355050000],["2009-01-15",8196.24,8212.49,7949.65,8326.06,436660000],["2009-01-16",8215.67,8281.22,8086.01,8424.59,439360000],["2009-01-20",8279.63,7949.09,7920.66,8309.02,419200000],["2009-01-21",7949.17,8228.1,7890.63,8286.4,410040000],["2009-01-22",8224.43,8122.8,7925.75,8239.33,420040000],["2009-01-23",8108.79,8077.56,7856.86,8187.88,370510000],["2009-01-26",8078.04,8116.03,7971.15,8278.12,316720000],["2009-01-27",8117.39,8174.73,8042.6,8264.1,247750000],["2009-01-28",8175.93,8375.45,8175.93,8446.33,357940000],["2009-01-29",8373.06,8149.01,8092.14,8373.06,247450000],["2009-01-30",8149.01,8000.86,7924.88,8243.95,303160000],["2009-02-02",8000.62,7936.83,7796.17,8053.43,293890000],["2009-02-03",7936.99,8078.36,7855.19,8157.13,313090000],["2009-02-04",8070.32,7956.66,7899.79,8197.04,345520000],["2009-02-05",7954.83,8063.07,7811.7,8138.65,390980000],["2009-02-06",8056.38,8280.59,8044.03,8360.07,396380000],["2009-02-09",8281.38,8270.87,8137.7,8376.56,289280000],["2009-02-10",8269.36,7888.88,7835.83,8293.17,449890000],["2009-02-11",7887.05,7939.53,7820.14,8042.36,270280000],["2009-02-12",7931.97,7932.76,7662.04,7956.02,331960000],["2009-02-13",7933,7850.41,7811.38,8005.96,251960000],["2009-02-17",7845.63,7552.6,7502.59,7845.63,332850000],["2009-02-18",7546.35,7555.63,7451.37,7661.56,268220000],["2009-02-19",7555.23,7465.95,7420.63,7679.01,301480000],["2009-02-20",7461.49,7365.67,7226.29,7500.44,584900000],["2009-02-23",7365.99,7114.78,7092.64,7477.1,406150000],["2009-02-24",7115.34,7350.94,7077.35,7396.34,468010000],["2009-02-25",7349.58,7270.89,7123.94,7442.13,450270000],["2009-02-26",7269.06,7182.08,7135.25,7451.13,321300000],["2009-02-27",7180.97,7062.93,6952.06,7244.61,667950000],["2009-03-02",7056.48,6763.29,6736.69,7056.48,568670000],["2009-03-03",6764.81,6726.02,6661.74,6922.59,445280000],["2009-03-04",6726.5,6875.84,6715.11,7012.19,464830000],["2009-03-05",6874.01,6594.44,6531.28,6874.01,509770000],["2009-03-06",6595.16,6626.94,6443.27,6776.44,425170000],["2009-03-09",6625.74,6547.05,6440.08,6758.44,365990000],["2009-03-10",6547.01,6926.49,6547.01,6951.5,640020000],["2009-03-11",6923.13,6930.4,6804.55,7078.22,524430000],["2009-03-12",6932.39,7170.06,6840.79,7198.25,488690000],["2009-03-13",7219.2,7223.98,7106.34,7241.98,479010000],["2009-03-16",7225.33,7216.97,7171.41,7428.75,586970000],["2009-03-17",7218,7395.7,7129.6,7407.41,391880000],["2009-03-18",7395.7,7486.58,7218.24,7592.03,584110000],["2009-03-19",7489.68,7400.8,7325.13,7624.45,559920000],["2009-03-20",7402.31,7278.38,7215.77,7524.81,672950000],["2009-03-23",7279.25,7775.86,7279.25,7789.24,515600000],["2009-03-24",7773.47,7660.21,7585.98,7837.11,379670000],["2009-03-25",7659.81,7749.81,7539.54,7897.48,454090000],["2009-03-26",7752.36,7924.56,7709.19,7969,397260000],["2009-03-27",7922.57,7776.18,7695.97,7922.57,323650000],["2009-03-30",7773.31,7522.02,7406.85,7773.31,383260000],["2009-03-31",7523.77,7608.92,7502.98,7744.24,399840000],["2009-04-01",7606.13,7761.6,7450.74,7804.77,361340000],["2009-04-02",7763.99,7978.08,7763.99,8129.33,442820000],["2009-04-03",7980.63,8017.59,7850.33,8090.71,308210000],["2009-04-06",8016.16,7975.85,7830.66,8037.42,247400000],["2009-04-07",7968.92,7789.56,7733.56,7968.92,276920000],["2009-04-08",7788.68,7837.11,7715.09,7925.36,255350000],["2009-04-09",7839.89,8083.38,7839.89,8150.44,462060000],["2009-04-13",8082.02,8057.81,7888.96,8146.86,424250000],["2009-04-14",8057.41,7920.18,7840.53,8076.05,513010000],["2009-04-15",7914.92,8029.62,7808.19,8069.92,413280000],["2009-04-16",8029.14,8125.43,7933.08,8201.81,359470000],["2009-04-17",8125.43,8131.33,8024.92,8251.2,537670000],["2009-04-20",8128.94,7841.73,7801.58,8128.94,453660000],["2009-04-21",7841.73,7969.56,7699.79,8027.54,424030000],["2009-04-22",7964.78,7886.57,7802.46,8111.02,387030000],["2009-04-23",7886.81,7957.06,7762.8,8015.36,327240000],["2009-04-24",7957.45,8076.29,7905.6,8182.3,402720000],["2009-04-27",8073.82,8025,7920.42,8152.27,282990000],["2009-04-28",8023.56,8016.95,7898.75,8136.74,274710000],["2009-04-29",8018.31,8185.73,8018.31,8278.12,300340000],["2009-04-30",8188.51,8168.12,8083.62,8383.81,341400000],["2009-05-01",8167.41,8212.41,8047.54,8278.28,237360000],["2009-05-04",8213.6,8426.74,8213.6,8488.87,354490000],["2009-05-05",8425.55,8410.65,8321.37,8520.8,311490000],["2009-05-06",8403.48,8512.28,8350.12,8608.26,454480000],["2009-05-07",8513.56,8409.85,8296.04,8651.51,476640000],["2009-05-08",8410.73,8574.65,8388.11,8657.96,428420000],["2009-05-11",8569.23,8418.77,8347.41,8569.23,332630000],["2009-05-12",8419.17,8469.11,8306.47,8574.88,334840000],["2009-05-13",8461.8,8284.89,8208.74,8461.8,336930000],["2009-05-14",8285.92,8331.32,8218.94,8427.93,323800000],["2009-05-15",8326.22,8268.64,8206.67,8422.28,308820000],["2009-05-18",8270.15,8504.08,8270.15,8534.66,288280000],["2009-05-19",8502.48,8474.85,8402.61,8594.16,277710000],["2009-05-20",8471.82,8422.04,8376.4,8645.85,468640000],["2009-05-21",8416.07,8292.13,8185.25,8416.07,302280000],["2009-05-22",8292.21,8277.32,8218.86,8415.75,244190000],["2009-05-26",8275.33,8473.49,8194.33,8523.59,314760000],["2009-05-27",8473.65,8300.02,8280.82,8534.66,285990000],["2009-05-28",8300.5,8403.8,8221.65,8463.7,290730000],["2009-05-29",8404.04,8500.33,8323.91,8541.27,361910000],["2009-06-01",8501.53,8721.44,8501.53,8797.58,354830000],["2009-06-02",8721.6,8740.87,8635.25,8832.16,257560000],["2009-06-03",8740.07,8675.24,8556.9,8750.83,252160000],["2009-06-04",8665.72,8750.24,8609.17,8802.59,237800000],["2009-06-05",8751.75,8763.13,8673.41,8900.48,254970000],["2009-06-08",8759.35,8764.49,8593.84,8832.13,189630000],["2009-06-09",8764.83,8763.06,8688.99,8854.8,187930000],["2009-06-10",8763.66,8739.02,8625.21,8871.36,219920000],["2009-06-11",8736.23,8770.92,8697.99,8911.11,249900000],["2009-06-12",8770.01,8799.26,8671.61,8850.95,164020000],["2009-06-15",8798.5,8612.13,8540.87,8798.5,230220000],["2009-06-16",8612.44,8504.67,8483.58,8688.69,240690000],["2009-06-17",8504.36,8497.18,8421.46,8602.99,237870000],["2009-06-18",8496.73,8555.6,8438.61,8634.28,220050000],["2009-06-19",8556.96,8539.73,8476.02,8665.26,528710000],["2009-06-22",8538.52,8339.01,8306.66,8538.52,291240000],["2009-06-23",8340.44,8322.91,8239.17,8413.22,237150000],["2009-06-24",8323.51,8299.86,8246.2,8456.83,189430000],["2009-06-25",8299.25,8472.4,8236.07,8512.6,222540000],["2009-06-26",8468.54,8438.39,8364.17,8509.73,307640000],["2009-06-29",8440.13,8529.38,8406.57,8569.59,216480000],["2009-06-30",8528.93,8447,8369.99,8584.17,233340000],["2009-07-01",8447.53,8504.06,8447,8610.32,184600000],["2009-07-02",8503,8280.74,8260.41,8503,157800000],["2009-07-06",8279.3,8324.87,8156.49,8364.02,206900000],["2009-07-07",8324.95,8163.6,8138.51,8355.48,210880000],["2009-07-08",8157.02,8178.41,8057.94,8259.05,325250000],["2009-07-09",8179.01,8183.17,8117.27,8273.48,192660000],["2009-07-10",8182.49,8146.52,8057.57,8216.65,174260000],["2009-07-13",8146.82,8331.68,8106.16,8348.08,253520000],["2009-07-14",8331.37,8359.49,8255.27,8407.48,189170000],["2009-07-15",8363.95,8616.21,8363.95,8643.04,305000000],["2009-07-16",8612.66,8711.82,8543.97,8750.28,216580000],["2009-07-17",8711.89,8743.94,8638.81,8797.97,301410000],["2009-07-20",8746.05,8848.15,8717.26,8884.43,213730000],["2009-07-21",8848.15,8915.94,8780.82,8991.07,218910000],["2009-07-22",8912.39,8881.26,8802.13,8993.48,199010000],["2009-07-23",8882.31,9069.29,8837.95,9143.05,274760000],["2009-07-24",9066.11,9093.24,8955.77,9144.48,214310000],["2009-07-27",9093.09,9108.51,8996.58,9154.23,176830000],["2009-07-28",9106.92,9096.72,8980.03,9154.76,198270000],["2009-07-29",9092.34,9070.72,8967.26,9141.23,190510000],["2009-07-30",9072.84,9154.46,9072.84,9298.13,232410000],["2009-07-31",9154.61,9171.61,9081.3,9264.65,265570000],["2009-08-03",9173.65,9286.56,9162.09,9342.11,221690000],["2009-08-04",9285.05,9320.19,9207.21,9370.3,195990000],["2009-08-05",9315.36,9280.97,9173.2,9374.38,236610000],["2009-08-06",9277.19,9256.26,9168.44,9378.01,244450000],["2009-08-07",9258.45,9370.07,9258.45,9466.89,216600000],["2009-08-10",9368.41,9337.95,9249.99,9420.56,161370000],["2009-08-11",9334.33,9241.45,9180.23,9351.86,171380000],["2009-08-12",9236.06,9361.61,9199.8,9442.47,197420000],["2009-08-13",9362.29,9398.19,9269.26,9448.97,145620000],["2009-08-14",9398.04,9321.4,9214.47,9425.17,172780000],["2009-08-17",9313.85,9135.34,9078.28,9313.85,207100000],["2009-08-18",9134.36,9217.94,9124.08,9262.08,158530000],["2009-08-19",9208.68,9279.16,9099.14,9333.34,176910000],["2009-08-20",9278.55,9350.05,9237.52,9385.72,151740000],["2009-08-21",9347.86,9505.96,9347.86,9549.19,293530000],["2009-08-24",9506.18,9509.28,9442.17,9625.89,190590000],["2009-08-25",9509.21,9539.29,9485.7,9646.53,173890000],["2009-08-26",9538.61,9543.52,9446.71,9613.65,154660000],["2009-08-27",9541.63,9580.63,9440.43,9629.98,163980000],["2009-08-28",9582.74,9544.2,9476.63,9666.71,205770000],["2009-08-31",9542.91,9496.28,9389.27,9552.97,201600000],["2009-09-01",9492.32,9310.6,9275.15,9573.67,267680000],["2009-09-02",9306.21,9280.67,9223.08,9378.77,175200000],["2009-09-03",9282.03,9344.61,9252.93,9350.27,168750000],["2009-09-04",9345.36,9441.27,9302.28,9465.37,152400000],["2009-09-08",9440.13,9497.34,9402.8,9564.45,202370000],["2009-09-09",9496.59,9547.22,9435.45,9604.43,190820000],["2009-09-10",9546.54,9627.48,9479.2,9666.55,234130000],["2009-09-11",9625.44,9605.41,9532.11,9698.67,196760000],["2009-09-14",9598.08,9626.8,9492.96,9662.1,196480000],["2009-09-15",9626.42,9683.41,9553.8,9745.91,224030000],["2009-09-16",9683.71,9791.71,9648.95,9837.05,241270000],["2009-09-17",9789.82,9783.92,9706.23,9896.38,225470000],["2009-09-18",9784.75,9820.2,9751.27,9898.57,424930000],["2009-09-21",9818.61,9778.86,9688.4,9846.12,172830000],["2009-09-22",9779.61,9829.87,9742.96,9890.71,194620000],["2009-09-23",9830.63,9748.55,9724.9,9937.72,233330000],["2009-09-24",9749.99,9707.44,9637.53,9836.82,201890000],["2009-09-25",9706.68,9665.19,9605.19,9781.73,189350000],["2009-09-28",9663.23,9789.36,9658.09,9861.39,163780000],["2009-09-29",9789.74,9742.2,9705.1,9861.99,154000000],["2009-09-30",9741.83,9712.28,9583.04,9817.17,268390000],["2009-10-01",9711.6,9509.28,9482.98,9714.7,266990000],["2009-10-02",9507.62,9487.67,9378.77,9571.71,219750000],["2009-10-05",9488.73,9599.75,9449.81,9640.33,173850000],["2009-10-06",9601.26,9731.25,9601.26,9793.37,206020000],["2009-10-07",9725.69,9725.58,9634.96,9782.56,167650000],["2009-10-08",9728.22,9786.87,9709.78,9872.5,209580000],["2009-10-09",9786.04,9864.94,9731.32,9890.41,161120000],["2009-10-12",9865.24,9885.8,9814.45,9978.07,158850000],["2009-10-13",9883.98,9871.06,9780.9,9935.53,211510000],["2009-10-14",9873.55,10015.86,9873.55,10064.98,284810000],["2009-10-15",10014.88,10062.94,9916.93,10087.43,252480000],["2009-10-16",10061.36,9995.91,9884.51,10072.62,307770000],["2009-10-19",9996.67,10092.19,9967.49,10146.61,186240000],["2009-10-20",10092.42,10041.48,9952.98,10157.26,214500000],["2009-10-21",10038.84,9949.36,9909.83,10157.94,251050000],["2009-10-22",9946.18,10081.31,9879.07,10133.08,231900000],["2009-10-23",10099.9,9972.18,9908.7,10138.59,305670000],["2009-10-26",9972.33,9867.96,9817.55,10107.99,270050000],["2009-10-27",9868.34,9882.17,9802.36,9994.55,237060000],["2009-10-28",9881.11,9762.69,9723.31,9940.89,257370000],["2009-10-29",9762.91,9962.58,9762.91,9996.67,248950000],["2009-10-30",9961.52,9712.73,9664.89,9980.19,327980000],["2009-11-02",9712.13,9789.44,9647.06,9883.68,242460000],["2009-11-03",9787.47,9771.91,9649.78,9844.84,231520000],["2009-11-04",9767.3,9802.14,9745.76,9962.35,224130000],["2009-11-05",9807.8,10005.96,9807.8,10043.75,211040000],["2009-11-06",10001.35,10023.42,9898.49,10077.08,181010000],["2009-11-09",10020.62,10226.94,10020.62,10248.93,227470000],["2009-11-10",10223.01,10246.97,10148.12,10300.33,193950000],["2009-11-11",10247.42,10291.26,10217.19,10357.38,166920000],["2009-11-12",10289.82,10197.47,10157.64,10341.21,183810000],["2009-11-13",10197.85,10270.47,10162.93,10332.29,167280000],["2009-11-16",10267.53,10406.96,10267.53,10465.83,202570000],["2009-11-17",10404.77,10437.42,10318.69,10465.76,158320000],["2009-11-18",10426.27,10426.31,10330.33,10471.28,166340000],["2009-11-19",10425.33,10332.44,10226.41,10425.33,196250000],["2009-11-20",10327.91,10318.16,10237.6,10377.41,230430000],["2009-11-23",10320.13,10450.95,10320.13,10524.4,182350000],["2009-11-24",10451.25,10433.71,10335.62,10488.66,163750000],["2009-11-25",10432.96,10464.4,10385.65,10513.6,130080000],["2009-11-27",10452.23,10309.92,10179.33,10452.23,130290000],["2009-11-30",10309.77,10344.84,10238.05,10394.34,223580000],["2009-12-01",10343.82,10471.58,10343.82,10537.03,190220000],["2009-12-02",10470.44,10452.68,10386.03,10537.63,159500000],["2009-12-03",10455.63,10366.15,10338.49,10533.55,243970000],["2009-12-04",10368.57,10388.9,10285.44,10549.04,460660000],["2009-12-07",10386.86,10390.11,10321.11,10478.23,196580000],["2009-12-08",10385.42,10285.97,10216.44,10385.42,221770000],["2009-12-09",10282.85,10337.05,10207.29,10377.11,188610000],["2009-12-10",10336,10405.83,10332.14,10479.06,195910000],["2009-12-11",10403.41,10471.5,10385.42,10516.47,179970000],["2009-12-14",10471.28,10501.05,10431.6,10566.88,154360000],["2009-12-15",10499.31,10452,10380.96,10542.09,187560000],["2009-12-16",10449.81,10441.12,10401.9,10552.75,208310000],["2009-12-17",10439.99,10308.26,10279.39,10439.99,198860000],["2009-12-18",10309.39,10328.89,10237.75,10412.55,480080000],["2009-12-21",10330.1,10414.14,10330.1,10489.41,164470000],["2009-12-22",10414.67,10464.93,10399.33,10511.56,135080000],["2009-12-23",10464.32,10466.44,10409,10520.93,112460000],["2009-12-24",10467.12,10520.1,10450.95,10541.26,52670000],["2009-12-28",10517.91,10547.07,10517.91,10550.78,102010000],["2009-12-29",10547.83,10545.41,10518.59,10605.65,92890000],["2009-12-30",10544.36,10548.51,10470.75,10583.28,110160000],["2009-12-31",10548.51,10428.05,10420.56,10578.74,137940000],["2010-01-04",10430.69,10583.96,10430.69,10641.62,179780000],["2010-01-05",10584.56,10572.02,10468.86,10647.14,188540000],["2010-01-06",10564.72,10573.68,10488.28,10655.22,186040000],["2010-01-07",10571.11,10606.86,10471.73,10655.6,217390000],["2010-01-08",10606.4,10618.19,10509.74,10653.11,172710000],["2010-01-11",10620.31,10663.99,10538.91,10739.87,182050000],["2010-01-12",10662.86,10627.26,10523.35,10701.48,256050000],["2010-01-13",10628.09,10680.77,10569.07,10747.12,202810000],["2010-01-14",10680.16,10710.55,10619.02,10767.15,201320000],["2010-01-15",10706.99,10609.65,10529.09,10736.54,362930000],["2010-01-19",10608.37,10725.43,10555.47,10763.45,192150000],["2010-01-20",10719.69,10603.15,10492.36,10719.69,203270000],["2010-01-21",10603.91,10389.88,10334.18,10651.14,304290000],["2010-01-22",10389.58,10172.98,10133.15,10450.04,323620000],["2010-01-25",10175.1,10196.86,10135.95,10316.65,215330000],["2010-01-26",10195.35,10194.29,10102.17,10323,217300000],["2010-01-27",10194.29,10236.16,10060.98,10294.13,262170000],["2010-01-28",10236.92,10120.46,10023.8,10310.68,240050000],["2010-01-29",10122.04,10067.33,10014.35,10272.29,316900000],["2010-02-01",10068.99,10185.53,10068.99,10227.24,198430000],["2010-02-02",10186.13,10296.85,10138.75,10333.35,237140000],["2010-02-03",10291.73,10270.55,10192.03,10356.86,198940000],["2010-02-04",10273.12,10002.18,9984.35,10273.12,304240000],["2010-02-05",10003.69,10012.23,9822.84,10078.89,308320000],["2010-02-08",10005.43,9908.39,9882.85,10059.24,216270000],["2010-02-09",9910.28,10058.64,9910.28,10154.24,236210000],["2010-02-10",10055.46,10038.38,9946.26,10120.15,178600000],["2010-02-11",10037.85,10144.19,9963.19,10184.85,194470000],["2010-02-12",10137.23,10099.14,9962.13,10140.18,296510000],["2010-02-16",10100.81,10268.81,10100.81,10292.62,234900000],["2010-02-17",10261.48,10309.24,10223.16,10366.83,193270000],["2010-02-18",10309.39,10392.9,10255.58,10416.79,185310000],["2010-02-19",10387.77,10402.35,10316.5,10459.18,241750000],["2010-02-22",10402.43,10383.38,10333.05,10468.55,158440000],["2010-02-23",10383.16,10282.41,10239.34,10430.16,190740000],["2010-02-24",10284,10374.16,10271.61,10416.94,181450000],["2010-02-25",10366.6,10321.03,10155.75,10366.6,242550000],["2010-02-26",10321.41,10325.26,10250.45,10391.24,282120000],["2010-03-01",10326.1,10403.79,10320.05,10444.6,173750000],["2010-03-02",10404.16,10405.98,10359.8,10493.8,217180000],["2010-03-03",10406.28,10396.76,10359.58,10496.22,183290000],["2010-03-04",10396.53,10444.14,10363.88,10484.05,165740000],["2010-03-05",10445.13,10566.2,10445.13,10587.13,184270000],["2010-03-08",10563.78,10552.52,10500.9,10632.48,171780000],["2010-03-09",10552.24,10564.38,10493.49,10637.46,219860000],["2010-03-10",10560.13,10567.33,10502.64,10639.05,186570000],["2010-03-11",10560.98,10611.84,10489.87,10626.73,150000000],["2010-03-12",10611.77,10624.69,10561.66,10690.9,166140000],["2010-03-15",10623.41,10642.15,10540.65,10680.32,160570000],["2010-03-16",10642.53,10685.98,10594.16,10717.42,227410000],["2010-03-17",10686.36,10733.67,10658.1,10787.86,194190000],["2010-03-18",10733.44,10779.17,10686.89,10821.49,153280000],["2010-03-19",10780,10741.98,10665.35,10869.55,434190000],["2010-03-22",10741,10785.89,10672.23,10836.68,157200000],["2010-03-23",10787.18,10888.83,10752.41,10906.06,189140000],["2010-03-24",10887.62,10836.15,10788.77,10925.48,195570000],["2010-03-25",10837.51,10841.21,10818.77,10985.26,200330000],["2010-03-26",10841.29,10850.36,10801.84,10934.85,175490000],["2010-03-29",10849.23,10895.86,10827.91,10954.43,136710000],["2010-03-30",10895.02,10907.42,10837.21,10968.56,148810000],["2010-03-31",10907.34,10856.63,10802.22,10933.19,197060000],["2010-04-01",10857.31,10927.07,10851.57,10983.14,159520000],["2010-04-05",10927.45,10973.55,10880.36,11026.75,139480000],["2010-04-06",10972.49,10969.99,10893.89,11017.76,159960000],["2010-04-07",10961.95,10897.52,10835.77,11000.22,187000000],["2010-04-08",10896.99,10927.07,10810.15,10969.92,158930000],["2010-04-09",10926.92,10997.35,10894.19,11032.12,150660000],["2010-04-12",10996.75,11005.97,10957.22,11066.96,153960000],["2010-04-13",11006.72,11019.42,10925.86,11072.7,183950000],["2010-04-14",11020.7,11123.11,11004.61,11147.14,223920000],["2010-04-15",11122.96,11144.57,11051.31,11189.61,203720000],["2010-04-16",11143.66,11018.66,10947.55,11186.82,373950000],["2010-04-19",11018.36,11092.05,10940.6,11116.76,214850000],["2010-04-20",11093.11,11117.06,11045.8,11190.22,175170000],["2010-04-21",11116.91,11124.92,11018.59,11217.35,188880000],["2010-04-22",11119.78,11134.29,10975.66,11175.33,214700000],["2010-04-23",11132.18,11204.28,11058.87,11247.2,207380000],["2010-04-26",11205.11,11205.03,11150.01,11308.95,191920000],["2010-04-27",11203.67,10991.99,10962.81,11260.88,263400000],["2010-04-28",10988.87,11045.27,10938.48,11115.63,236760000],["2010-04-29",11045.64,11167.32,11045.64,11232.54,194310000],["2010-04-30",11168.23,11008.61,10984.35,11235.94,255130000],["2010-05-03",11009.6,11151.83,11004.15,11203.37,178080000],["2010-05-04",11149.48,10926.77,10843.71,11149.48,242100000],["2010-05-05",10918.4,10868.12,10867,10947,218830000],["2010-05-06",10862.22,10520.32,9787.17,10925.86,459890000],["2010-05-07",10519.42,10380.43,10221.5,10622.27,428730000],["2010-05-10",10386.18,10785.14,10386.18,10880.14,313350000],["2010-05-11",10780,10748.26,10653.71,10888.3,223950000],["2010-05-12",10742.15,10896.91,10725.81,10941.88,196630000],["2010-05-13",10896.61,10782.95,10752.72,10952.84,201480000],["2010-05-14",10780.68,10620.16,10509.89,10780.68,256500000],["2010-05-17",10616.98,10625.83,10424.72,10707.3,221910000],["2010-05-18",10625.45,10510.95,10463.15,10760.05,246370000],["2010-05-19",10505.7,10444.37,10306.22,10558.56,266340000],["2010-05-20",10440.21,10068.01,10042.46,10440.21,360350000],["2010-05-21",10063.93,10193.39,9860.93,10225.88,438220000],["2010-05-24",10193.46,10066.57,10028.78,10235.63,211430000],["2010-05-25",10061.43,10043.75,9756.11,10061.43,316960000],["2010-05-26",10045.11,9974.45,9937.79,10211.6,316080000],["2010-05-27",9971.73,10258.99,9971.73,10279.01,264770000],["2010-05-28",10258,10136.63,10078.66,10293.45,243720000],["2010-06-01",10133.94,10024.02,9976.56,10249.27,221900000],["2010-06-02",10025.61,10249.54,10007.09,10256.57,200850000],["2010-06-03",10250.67,10255.28,10158.92,10348.84,176870000],["2010-06-04",10249.61,9931.97,9881.11,10249.61,256600000],["2010-06-07",9931.75,9816.49,9798.73,10025.84,222940000],["2010-06-08",9812.94,9939.98,9726.33,9971.57,259680000],["2010-06-09",9941.57,9899.25,9859.04,10093.33,222680000],["2010-06-10",9901.67,10172.53,9901.67,10206.61,221730000],["2010-06-11",10166.78,10211.07,10038.31,10235.1,187890000],["2010-06-14",10211.83,10190.89,10175.02,10354.97,177920000],["2010-06-15",10192.4,10404.77,10192.4,10416.11,203170000],["2010-06-16",10404.24,10409.46,10289.37,10456.39,165700000],["2010-06-17",10409.98,10434.17,10293.49,10479.74,181070000],["2010-06-18",10435,10450.64,10379.6,10513.75,338010000],["2010-06-21",10452.46,10442.41,10387.54,10627.19,165190000],["2010-06-22",10441.95,10293.52,10276.14,10524.78,175750000],["2010-06-23",10293.3,10298.44,10195.81,10393.89,195100000],["2010-06-24",10297.08,10152.8,10112.6,10314.31,244440000],["2010-06-25",10153.48,10143.81,10039.97,10261.1,434500000],["2010-06-28",10143.05,10138.52,10070.12,10246.82,164100000],["2010-06-29",10135.72,9870.3,9786.45,10135.72,290500000],["2010-06-30",9868.34,9774.02,9741.07,9951.47,235090000],["2010-07-01",9773.27,9732.53,9596.04,9834.71,262820000],["2010-07-02",9732.23,9686.48,9603.8,9798.19,199570000],["2010-07-06",9689.21,9743.62,9648.26,9880.76,261020000],["2010-07-07",9736.85,10018.28,9716.38,10029.93,219560000],["2010-07-08",10019.26,10138.99,9987.02,10175.02,192210000],["2010-07-09",10137.93,10198.03,10079.05,10226.48,134810000],["2010-07-12",10199.24,10216.27,10121.13,10260.62,131490000],["2010-07-13",10217.55,10363.02,10217.55,10436.2,179040000],["2010-07-14",10370.96,10366.72,10265.16,10423.03,208530000],["2010-07-15",10367.1,10359.31,10216.04,10409.49,210000000],["2010-07-16",10356.2,10097.9,10071.63,10356.2,335060000],["2010-07-19",10098.12,10154.43,10051.28,10213.09,176970000],["2010-07-20",10151.48,10229.96,9973.17,10248.2,194410000],["2010-07-21",10226.02,10120.53,10053.85,10310.04,203900000],["2010-07-22",10121.81,10322.3,10121.81,10391.78,202220000],["2010-07-23",10321.16,10424.62,10237.84,10465.19,200000000],["2010-07-26",10424.17,10525.43,10391.02,10545.94,178820000],["2010-07-27",10525.28,10537.69,10460.65,10632.52,180550000],["2010-07-28",10537.01,10497.88,10445.17,10586.36,162070000],["2010-07-29",10498.94,10467.16,10383.45,10609.74,202110000],["2010-07-30",10465.19,10465.94,10327.37,10528.84,208160000],["2010-08-02",10468.82,10674.38,10468.82,10715.21,167640000],["2010-08-03",10673.92,10636.38,10564.18,10714.19,164880000],["2010-08-04",10630.2,10680.43,10583.1,10738.48,173360000],["2010-08-05",10679.67,10674.98,10571.6,10712.37,139610000],["2010-08-06",10668.55,10653.56,10491.37,10688.08,154870000],["2010-08-09",10654.62,10698.75,10618.26,10755.66,166330000],["2010-08-10",10696.63,10644.25,10522.63,10717.21,203490000],["2010-08-11",10631.82,10378.83,10339.63,10631.82,219330000],["2010-08-12",10361.58,10319.95,10222.85,10388.37,221030000],["2010-08-13",10320.33,10303.15,10254.18,10381.86,151620000],["2010-08-16",10303.07,10302.01,10193.26,10354.39,146040000],["2010-08-17",10297.55,10405.85,10297.55,10501.67,191340000],["2010-08-18",10398.59,10415.54,10308.83,10486.38,168560000],["2010-08-19",10411.15,10271.21,10202.34,10412.29,227740000],["2010-08-20",10270.98,10213.62,10131.88,10276.13,251150000],["2010-08-23",10215.51,10174.41,10146.18,10328.88,173000000],["2010-08-24",10170.86,10040.45,9975.86,10170.86,223680000],["2010-08-25",10040.15,10060.06,9925.34,10104.18,183890000],["2010-08-26",10059.83,9985.81,9959.17,10138.12,176330000],["2010-08-27",9982.4,10150.65,9925.11,10176.3,207760000],["2010-08-30",10145.58,10009.73,10005.56,10170.1,150480000],["2010-08-31",10006.42,10014.72,9915.73,10101.53,255420000],["2010-09-01",10016.01,10269.47,10016.01,10305.87,205710000],["2010-09-02",10270.08,10320.1,10211.8,10350.98,149930000],["2010-09-03",10321.92,10447.93,10321.92,10484.71,168600000],["2010-09-07",10446.8,10340.69,10304.44,10448.99,149040000],["2010-09-08",10338.57,10387.01,10318.93,10460.5,166760000],["2010-09-09",10388.22,10415.24,10359.23,10515.86,163590000],["2010-09-10",10415.01,10462.77,10376.34,10502.8,140320000],["2010-09-13",10458.6,10544.13,10458.45,10605.73,190720000],["2010-09-14",10544.81,10526.49,10460.34,10622.69,192410000],["2010-09-15",10526.42,10572.73,10453.15,10609.21,167420000],["2010-09-16",10571.75,10594.83,10499.43,10624.58,170300000],["2010-09-17",10595.44,10607.85,10529.67,10689.29,367230000],["2010-09-20",10608.08,10753.62,10594.38,10783.51,157120000],["2010-09-21",10753.39,10761.03,10674.83,10844.89,186740000],["2010-09-22",10761.11,10739.31,10682.4,10829.75,168590000],["2010-09-23",10738.48,10662.42,10610.12,10779.65,156830000],["2010-09-24",10664.39,10860.26,10664.39,10897.83,179270000],["2010-09-27",10860.03,10812.04,10776.44,10902.52,143910000],["2010-09-28",10809.85,10858.14,10714.03,10905.44,167110000],["2010-09-29",10857.98,10835.28,10759.75,10901.96,158830000],["2010-09-30",10835.96,10788.05,10732.27,10960.99,214540000],["2010-10-01",10789.72,10829.68,10759.14,10907.41,161890000],["2010-10-04",10828.85,10751.27,10682.66,10875.54,160370000],["2010-10-05",10752.63,10944.72,10752.63,10982.98,216240000],["2010-10-06",10936.79,10967.65,10880.08,11015.86,163440000],["2010-10-07",10968.41,10948.58,10878.04,11032.17,141920000],["2010-10-08",10948.5,11006.48,10901.12,11055.29,152280000],["2010-10-11",11006.93,11010.34,10956.26,11068.54,114830000],["2010-10-12",11010.79,11020.4,10890.76,11064.68,155150000],["2010-10-13",11022.82,11096.08,11014.19,11187.77,224920000],["2010-10-14",11096.92,11096.92,10996.71,11148.15,196170000],["2010-10-15",11096.01,11062.78,10985.28,11172.07,319210000],["2010-10-18",11062.71,11143.69,11021.46,11184.86,190290000],["2010-10-19",11139.6,10978.62,10897.57,11139.6,247640000],["2010-10-20",10974.52,11107.97,10969.47,11176.08,220140000],["2010-10-21",11105.24,11146.57,11038.79,11249.57,178060000],["2010-10-22",11146.41,11132.56,11071.22,11192.09,104570000],["2010-10-25",11133.4,11164.05,11127.27,11266.3,168110000],["2010-10-26",11163.06,11169.46,11055.48,11221.04,159040000],["2010-10-27",11168.4,11126.28,10986.68,11172.83,167080000],["2010-10-28",11127.34,11113.95,11033.87,11217.33,156250000],["2010-10-29",11120.45,11118.4,11028.08,11178.43,189650000],["2010-11-01",11120.3,11124.62,11053.29,11257.59,150130000],["2010-11-02",11125.3,11188.72,11125.3,11266.26,150390000],["2010-11-03",11184.8,11215.13,11088.74,11261.23,177580000],["2010-11-04",11216.65,11434.84,11216.65,11481.01,234680000],["2010-11-05",11435.3,11444.08,11336.15,11505.83,211670000],["2010-11-08",11439.61,11406.84,11324.27,11454.44,143990000],["2010-11-09",11403.51,11346.75,11293.35,11453.01,161910000],["2010-11-10",11342.81,11357.04,11239.69,11395.37,164170000],["2010-11-11",11326.69,11283.1,11175.17,11350.3,296660000],["2010-11-12",11281.28,11192.58,11114.1,11307.69,217650000],["2010-11-15",11194.02,11201.97,11149.97,11314.36,155660000],["2010-11-16",11194.7,11023.5,10949.86,11194.7,254570000],["2010-11-17",11017.83,11007.88,10947.52,11091.69,160250000],["2010-11-18",11010.49,11181.23,11010.49,11234.74,171770000],["2010-11-19",11180.77,11203.55,11096.92,11238.52,219400000],["2010-11-22",11201.59,11178.58,11044.39,11213.92,152850000],["2010-11-23",11177.6,11036.37,10968.78,11177.6,192820000],["2010-11-24",11037.43,11187.28,11037.43,11221.11,138280000],["2010-11-26",11183.5,11092,11046.74,11183.5,68400000],["2010-11-29",11083.75,11052.49,10906.46,11092.49,151530000],["2010-11-30",11049.72,11006.02,10916.26,11083.18,233770000],["2010-12-01",11007.31,11255.78,11007.31,11297.52,202520000],["2010-12-02",11255.93,11362.41,11237.2,11404.42,212090000],["2010-12-03",11361.81,11382.09,11280.6,11408.58,149440000],["2010-12-06",11381.33,11362.19,11313.6,11422.66,122240000],["2010-12-07",11363.85,11359.16,11327.68,11507.27,175720000],["2010-12-08",11354.45,11372.48,11281.43,11441.62,152510000],["2010-12-09",11370.44,11370.06,11293.77,11449.37,167970000],["2010-12-10",11370.44,11410.32,11326.01,11446.65,151820000],["2010-12-13",11406.16,11428.56,11369,11513.7,151190000],["2010-12-14",11429.09,11476.54,11389.32,11543.9,149860000],["2010-12-15",11475.64,11457.47,11416.6,11552.45,189670000],["2010-12-16",11457.93,11499.25,11394.88,11553.51,163040000],["2010-12-17",11499.02,11491.91,11421.45,11542.58,358300000],["2010-12-20",11491.3,11478.13,11417.32,11561.61,125360000],["2010-12-21",11478.36,11533.16,11454.97,11585.83,119420000],["2010-12-22",11532.17,11559.49,11486.23,11600.97,122040000],["2010-12-23",11559.11,11573.49,11514.54,11615.57,100840000],["2010-12-27",11572.81,11555.03,11480.52,11597.41,76820000],["2010-12-28",11554.8,11575.54,11514.88,11624.32,114100000],["2010-12-29",11572.74,11585.38,11557.53,11655.04,77800000],["2010-12-30",11585.83,11569.71,11535.5,11614.44,76820000],["2010-12-31",11569.33,11577.51,11515.79,11612.77,93330000],["2011-01-03",11577.43,11670.75,11577.43,11750.9,203420000],["2011-01-04",11670.9,11691.18,11582.99,11766.94,178630000],["2011-01-05",11688.76,11722.89,11610.29,11775.72,169990000],["2011-01-06",11716.93,11697.31,11615.31,11795.78,193080000],["2011-01-07",11696.86,11674.76,11578.64,11761.49,188720000],["2011-01-10",11672.34,11637.45,11545.87,11698.33,150340000],["2011-01-11",11638.51,11671.88,11601.57,11756.57,157440000],["2011-01-12",11673.62,11755.44,11673.62,11814.55,144960000],["2011-01-13",11753.7,11731.9,11666.32,11803.19,161660000],["2011-01-14",11732.2,11787.38,11658.41,11827.11,200770000],["2011-01-18",11783.82,11837.93,11740.83,11909.23,203390000],["2011-01-19",11834.21,11825.29,11746.36,11922.92,166250000],["2011-01-20",11823.7,11822.8,11700.68,11890.15,180800000],["2011-01-21",11824.76,11871.84,11802.97,11960.31,249480000],["2011-01-24",11873.5,11980.52,11826.58,12021.24,184000000],["2011-01-25",11979.08,11977.19,11840.05,12072.17,191950000],["2011-01-26",11978.85,11985.44,11903.28,12069.83,168320000],["2011-01-27",11985.36,11989.83,11907.71,12066.72,167770000],["2011-01-28",11990.36,11823.7,11775.64,12047.65,214170000],["2011-01-31",11824.46,11891.93,11738.3,11951.08,206580000],["2011-02-01",11892.5,12040.16,11892.5,12082.24,180890000],["2011-02-02",12038.27,12041.97,11962.73,12104.11,143440000],["2011-02-03",12040.68,12062.26,11957.97,12105.17,143710000],["2011-02-04",12061.65,12092.15,12003.34,12125.38,121780000],["2011-02-07",12092.38,12161.63,12003.34,12219.45,132960000],["2011-02-08",12152.7,12233.15,12114.78,12258.92,126650000],["2011-02-09",12229.59,12239.89,12135.86,12304.29,162910000],["2011-02-10",12239.66,12229.29,12107.4,12291.35,274440000],["2011-02-11",12227.78,12273.26,12138.4,12326.85,184290000],["2011-02-14",12266.83,12268.19,12185.21,12327,146350000],["2011-02-15",12266.75,12226.64,12146.27,12293.47,142580000],["2011-02-16",12219.79,12288.17,12195.54,12338.43,146270000],["2011-02-17",12287.79,12318.14,12216.8,12357.5,130860000],["2011-02-18",12318.6,12391.25,12265.16,12417.97,230040000],["2011-02-22",12389.74,12212.79,12142.97,12394.7,201860000],["2011-02-23",12211.81,12105.78,12007.39,12289.84,213490000],["2011-02-24",12104.64,12068.5,11960.62,12202.69,190860000],["2011-02-25",12060.93,12130.45,12043.83,12202.2,147540000],["2011-02-28",12130.22,12226.34,12112.28,12293.47,199560000],["2011-03-01",12226.57,12058.02,12036,12304.03,183240000],["2011-03-02",12057.34,12066.8,11970.08,12154.97,147270000],["2011-03-03",12068.01,12258.2,12068.01,12317.84,157840000],["2011-03-04",12258.88,12169.88,12056.81,12306.26,166700000],["2011-03-07",12171.09,12090.03,12025.51,12268.87,176200000],["2011-03-08",12085.8,12214.38,12039.02,12276.37,158610000],["2011-03-09",12211.16,12213.09,12106.68,12293.74,128360000],["2011-03-10",12211.43,11984.61,11924.48,12211.43,180660000],["2011-03-11",11976.96,12044.4,11936.32,12087.01,143670000],["2011-03-14",12042.13,11993.16,11873.43,12058.44,163000000],["2011-03-15",11988.69,11855.42,11648.5,11988.69,221930000],["2011-03-16",11854.13,11613.3,11548.14,11862.08,254070000],["2011-03-17",11614.82,11774.59,11614.82,11842.55,182260000],["2011-03-18",11777.23,11858.52,11777.23,11971.14,355050000],["2011-03-21",11860.11,12036.53,11860.11,12117.88,143390000],["2011-03-22",12036.37,12018.63,11965.38,12096.01,115660000],["2011-03-23",12018.4,12086.02,11936.7,12131.89,133940000],["2011-03-24",12087.54,12170.56,12064.6,12221.08,131610000],["2011-03-25",12170.71,12220.59,12143.62,12290.29,129790000],["2011-03-28",12221.19,12197.88,12197.88,12272.92,123070000],["2011-03-29",12193.87,12279.01,12141.65,12310.35,129030000],["2011-03-30",12280.07,12350.61,12271.52,12413.43,140340000],["2011-03-31",12350.84,12319.73,12277.05,12422.96,186140000],["2011-04-01",12321.02,12376.72,12301.11,12454.52,147600000],["2011-04-04",12374.6,12400.03,12331.35,12445.75,114660000],["2011-04-05",12402.08,12393.9,12320.34,12474.5,142340000],["2011-04-06",12386.66,12426.75,12347.13,12499.03,182350000],["2011-04-07",12426.45,12409.49,12307.62,12471.7,158590000],["2011-04-08",12409.8,12380.05,12310.46,12475.03,122820000],["2011-04-11",12380.43,12381.11,12319.35,12476.93,109950000],["2011-04-12",12381.04,12263.58,12185.09,12381.04,137260000],["2011-04-13",12263.73,12270.99,12203.63,12372.94,118950000],["2011-04-14",12270.24,12285.15,12137.98,12332.71,140670000],["2011-04-15",12285.45,12341.83,12238.34,12402.61,234710000],["2011-04-18",12339.71,12201.59,12093.89,12339.79,190220000],["2011-04-19",12201.44,12266.75,12163.29,12320.53,149870000],["2011-04-20",12279.17,12453.54,12279.17,12530.96,203900000],["2011-04-21",12453.62,12505.99,12377.82,12563.89,166630000],["2011-04-25",12505.99,12479.88,12401.02,12547.5,128660000],["2011-04-26",12480.86,12595.37,12448.32,12652.17,183980000],["2011-04-27",12592.23,12690.96,12518.55,12729.41,160550000],["2011-04-28",12689.75,12763.31,12617.43,12807.36,148760000],["2011-04-29",12763.39,12810.54,12711.85,12885.92,378620000],["2011-05-02",12810.16,12807.36,12754.53,12928.45,150960000],["2011-05-03",12806.38,12807.51,12700.72,12891.44,191510000],["2011-05-04",12806.29,12723.58,12632.46,12852.81,193720000],["2011-05-05",12723.65,12584.17,12504.85,12757.26,176950000],["2011-05-06",12580.76,12638.74,12580.76,12788.78,168320000],["2011-05-09",12637.83,12684.68,12591.59,12751.35,133940000],["2011-05-10",12685.13,12760.36,12665.45,12806.6,156000000],["2011-05-11",12745.87,12630.03,12577.21,12748.21,200680000],["2011-05-12",12629.81,12695.92,12497.97,12746.09,216510000],["2011-05-13",12695.65,12595.75,12522.79,12749.08,169940000],["2011-05-16",12594.84,12548.37,12482.07,12676.66,192310000],["2011-05-17",12541.18,12479.58,12342.29,12591.51,192830000],["2011-05-18",12471.78,12560.18,12402.15,12595.6,175120000],["2011-05-19",12561.46,12605.32,12506.67,12673.78,158470000],["2011-05-20",12604.64,12512.04,12453.96,12630.11,174980000],["2011-05-23",12511.29,12381.26,12292.49,12511.29,150720000],["2011-05-24",12381.87,12356.21,12315.42,12465.8,145920000],["2011-05-25",12355.45,12394.66,12271.9,12462.28,145750000],["2011-05-26",12391.56,12402.76,12285.75,12456.08,149070000],["2011-05-27",12398.06,12441.58,12382.93,12519.35,126030000],["2011-05-31",12443.4,12569.79,12443.4,12611.68,208290000],["2011-06-01",12569.34,12290.14,12273.41,12569.34,183020000],["2011-06-02",12289.61,12248.55,12171.39,12359.31,156370000],["2011-06-03",12247.87,12151.26,12061.96,12247.87,157740000],["2011-06-06",12151.19,12089.96,12045.76,12201.44,166600000],["2011-06-07",12090.18,12070.81,12055.64,12214.46,162610000],["2011-06-08",12066.5,12048.94,11981.28,12145.21,156870000],["2011-06-09",12049.47,12124.36,12038.49,12205.49,149700000],["2011-06-10",12124.17,11951.91,11912.03,12124.17,178310000],["2011-06-13",11945.33,11952.97,11883.15,12066.46,153370000],["2011-06-14",11951.38,12076.11,11951.38,12156.52,159620000],["2011-06-15",12075.2,11897.27,11841.87,12075.2,182500000],["2011-06-16",11896.13,11961.52,11821.96,12023.39,189500000],["2011-06-17",11962.58,12004.36,11952.55,12109.11,342010000],["2011-06-20",12004.28,12080.38,11942.07,12129.54,127250000],["2011-06-21",12081.33,12190.01,12059.46,12248.97,147570000],["2011-06-22",12189.63,12109.67,12082.43,12242.31,125330000],["2011-06-23",12108.5,12050,11841.19,12108.5,206760000],["2011-06-24",12049.24,11934.58,11892.95,12082.65,279660000],["2011-06-27",11934.73,12043.56,11907.71,12113.5,177920000],["2011-06-28",12042.28,12188.69,12042.28,12225.89,135050000],["2011-06-29",12187.63,12261.42,12148.88,12311.03,158720000],["2011-06-30",12262.1,12414.34,12262.1,12464.63,179980000],["2011-07-01",12412.07,12582.77,12404.08,12596.13,141870000],["2011-07-05",12583,12569.87,12504.1,12642.9,123000000],["2011-07-06",12562.47,12626.02,12507.84,12668.03,132330000],["2011-07-07",12628.37,12719.49,12628.37,12753.89,153740000],["2011-07-08",12717.9,12657.2,12541.33,12717.9,131150000],["2011-07-11",12655.77,12505.76,12443.4,12655.77,133250000],["2011-07-12",12505.46,12446.88,12423.27,12603.77,162640000],["2011-07-13",12447.33,12491.61,12447.33,12635.52,139970000],["2011-07-14",12492.67,12437.12,12398.94,12602.3,140810000],["2011-07-15",12437.8,12479.73,12374.75,12539.21,215420000],["2011-07-18",12475.11,12385.16,12276.59,12475.11,148950000],["2011-07-19",12385.96,12587.42,12385.96,12636.62,167550000],["2011-07-20",12583.75,12571.91,12499.4,12654.37,140340000],["2011-07-21",12567.14,12724.41,12567.14,12794,188410000],["2011-07-22",12724.71,12681.16,12605.59,12768.31,136760000],["2011-07-25",12679.72,12592.8,12509.58,12682.97,128760000],["2011-07-26",12592.12,12501.3,12457.25,12618.11,145140000],["2011-07-27",12498.65,12302.55,12275.38,12499.48,182770000],["2011-07-28",12301.95,12240.11,12200.99,12412.48,148710000],["2011-07-29",12239.28,12143.24,12044.21,12262.74,230910000],["2011-08-01",12144.3,12132.49,11978.55,12320.94,182820000],["2011-08-02",12130.22,11866.62,11857.91,12152.96,207060000],["2011-08-03",11863.89,11896.44,11678.69,11957.63,198220000],["2011-08-04",11893.79,11383.68,11365.74,11893.79,300760000],["2011-08-05",11384.29,11444.61,11126.32,11634.04,406310000],["2011-08-08",11433.93,10809.85,10779.05,11433.93,479980000],["2011-08-09",10810.91,11239.77,10588.55,11251.08,431410000],["2011-08-10",11227.92,10719.94,10662.04,11227.92,396300000],["2011-08-11",10729.85,11143.31,10729.85,11286.39,393190000],["2011-08-12",11143.39,11269.02,11116.29,11402.83,228030000],["2011-08-15",11269.93,11482.9,11269.93,11521.73,188120000],["2011-08-16",11479.12,11405.93,11279.69,11479.12,187800000],["2011-08-17",11392.01,11410.21,11306.18,11550.37,171280000],["2011-08-18",11406.27,10990.58,10830.59,11406.27,308520000],["2011-08-19",10989.6,10817.65,10749.83,11099.26,336370000],["2011-08-22",10820.37,10854.65,10800.09,11075.04,226720000],["2011-08-23",10854.58,11176.76,10837.93,11189.14,244130000],["2011-08-24",11175.7,11320.71,11078.56,11345.54,227380000],["2011-08-25",11321.02,11149.82,11083.41,11437.87,255050000],["2011-08-26",11145.2,11284.54,10922.85,11347.5,244410000],["2011-08-29",11286.58,11539.25,11286.58,11568.08,177540000],["2011-08-30",11532.06,11559.95,11409.87,11641.34,182090000],["2011-08-31",11560.55,11613.53,11512.12,11739.39,229740000],["2011-09-01",11613.3,11493.57,11471.02,11733.11,178110000],["2011-09-02",11492.06,11240.26,11180.66,11492.06,174660000],["2011-09-06",11237.23,11139.3,10890.11,11237.23,217420000],["2011-09-07",11138.01,11414.86,11138.01,11432.88,166320000],["2011-09-08",11414.64,11295.81,11243.59,11504.4,173040000],["2011-09-09",11294.53,10992.13,10919.21,11294.53,228170000],["2011-09-12",10990.01,11061.12,10789.87,11082.08,197160000],["2011-09-13",11054.99,11105.85,10960.99,11176.16,189980000],["2011-09-14",11106.83,11246.73,10986.57,11393.75,192600000],["2011-09-15",11247.64,11433.18,11247.64,11460.73,172080000],["2011-09-16",11433.48,11509.09,11381.79,11582.16,425900000],["2011-09-19",11506.67,11401.01,11228.95,11506.67,157580000],["2011-09-20",11401.39,11408.66,11340.24,11581.33,157060000],["2011-09-21",11408.58,11124.84,11102.52,11509.77,221860000],["2011-09-22",11121.89,10733.83,10572.2,11121.89,306170000],["2011-09-23",10732.77,10771.48,10593.85,10844.55,223140000],["2011-09-26",10771.86,11043.86,10750.4,11067.4,225620000],["2011-09-27",11045.38,11190.69,11045.38,11398.21,212700000],["2011-09-28",11189.1,11010.9,10990.58,11344.89,172410000],["2011-09-29",11012.79,11153.98,10955.43,11288.74,191340000],["2011-09-30",11152.32,10913.38,10892.27,11173.36,213200000],["2011-10-03",10912.02,10655.3,10640.55,11008.06,242870000],["2011-10-04",10650.31,10808.71,10362.26,10832.93,267440000],["2011-10-05",10800.39,10939.95,10682.55,10987.82,226440000],["2011-10-06",10940.03,11123.33,10834.07,11147.02,190030000],["2011-10-07",11123.41,11103.12,11025.93,11282.68,188080000],["2011-10-10",11104.64,11433.18,11104.64,11448.5,144270000],["2011-10-11",11432.57,11416.3,11312.69,11491.45,133360000],["2011-10-12",11417.28,11518.85,11417.28,11647.4,188130000],["2011-10-13",11518.09,11478.13,11338.8,11545.26,143990000],["2011-10-14",11479.04,11644.49,11479.04,11681.57,133570000],["2011-10-17",11643.35,11397,11366.73,11643.35,140360000],["2011-10-18",11396.17,11577.05,11396.17,11665.45,201410000],["2011-10-19",11577.62,11504.62,11427.96,11696.14,169580000],["2011-10-20",11502.13,11541.78,11378.16,11623.29,166100000],["2011-10-24",11807.96,11913.62,11775,11985.36,161870000],["2011-10-25",11912.71,11706.62,11664.09,11925.84,161450000],["2011-10-26",11707.83,11869.04,11676.5,11937.23,183730000],["2011-10-27",11872.14,12208.55,11872.14,12299.03,251640000],["2011-10-28",12207.42,12231.11,12096.66,12303.16,163620000],["2011-10-31",12229.22,11955.01,11943.4,12229.29,185790000],["2011-11-01",11951.61,11657.96,11562.6,11951.61,218290000],["2011-11-02",11658.56,11836.04,11658.56,11911.95,154140000],["2011-11-03",11835.59,12044.47,11828.43,12078.42,158170000],["2011-11-04",12043.41,11983.24,11833.43,12043.41,126150000],["2011-11-07",11982.94,12068.39,11866.73,12105.51,122110000],["2011-11-08",12055.52,12170.18,11982.53,12203.48,144950000],["2011-11-09",12166.32,11780.94,11726.88,12166.32,180200000],["2011-11-10",11779.96,11893.79,11776.63,11984.11,165250000],["2011-11-11",11897.65,12153.68,11897.65,12212.07,134520000],["2011-11-14",12153,12078.98,12013.06,12192.66,119610000],["2011-11-15",12077.85,12096.16,11959.78,12206.02,14510000],["2011-11-16",12084.74,11905.59,11872.75,12122.01,166220000],["2011-11-17",11905.67,11770.73,11659.43,11975.9,169830000],["2011-11-18",11769.36,11796.16,11707.34,11891.97,181240000],["2011-11-21",11795.55,11547.31,11434.54,11795.55,170960000],["2011-11-22",11542.24,11493.72,11402.87,11612.47,148570000],["2011-11-23",11492.67,11257.55,11242.76,11492.67,152220000],["2011-11-25",11252.11,11231.78,11192.81,11381.07,87480000],["2011-11-28",11232.47,11523.01,11232.47,11599.76,204950000],["2011-11-29",11523.54,11555.63,11478.32,11667.23,156950000],["2011-11-30",11559.64,12045.68,11559.64,12067.4,286790000],["2011-12-01",12046.21,12020.03,11916.38,12122.58,143700000],["2011-12-02",12022.37,12019.42,11972.12,12191.6,150110000],["2011-12-05",12021.46,12097.83,12020.78,12234.51,153830000],["2011-12-06",12097.75,12150.13,12046.93,12232.02,145920000],["2011-12-07",12144.41,12196.37,12024.19,12266.3,168440000],["2011-12-08",12195.91,11997.7,11963.11,12212.26,165880000],["2011-12-09",11995.88,12184.26,11995.88,12230.65,154250000],["2011-12-12",12181.08,12021.39,11914.98,12181.08,149050000],["2011-12-13",12018.66,11954.94,11894.96,12187.1,171910000],["2011-12-14",11949.79,11823.48,11753.77,11984.15,161240000],["2011-12-15",11825.37,11868.81,11815.11,12001.71,136930000],["2011-12-16",11870.17,11866.39,11791.31,12018.55,389520000],["2011-12-19",11866.62,11766.26,11728.46,11961.71,135170000],["2011-12-20",11769.14,12103.58,11769.14,12131.81,165180000],["2011-12-21",12103.28,12107.74,11963.76,12180.55,163250000],["2011-12-22",12107.59,12169.65,12065.74,12225.7,151610000],["2011-12-23",12169.88,12294,12151.72,12310.16,80420000],["2011-12-27",12293.47,12291.35,12241.55,12357.38,95980000],["2011-12-28",12288.85,12151.41,12126.7,12312.62,84010000],["2011-12-29",12152.32,12287.04,12152.32,12302.4,8410000],["2011-12-30",12286.28,12217.56,12190.2,12313.3,96670000],["2012-01-03",12221.19,12397.38,12221.19,12534.26,152560000],["2012-01-04",12392.39,12418.42,12291.35,12474.88,145130000],["2012-01-05",12417.06,12415.7,12283.9,12435.98,158440000],["2012-01-06",12407.75,12359.92,12305.2,12457.78,131120000],["2012-01-09",12360.15,12392.69,12305.16,12445.71,122200000],["2012-01-10",12394.51,12462.47,12394.51,12554.8,141230000],["2012-01-11",12459.44,12449.45,12345.24,12503.87,130260000],["2012-01-12",12449.98,12471.02,12354.36,12526.76,128230000],["2012-01-13",12469.96,12422.06,12288.44,12469.96,161470000],["2012-01-17",12423.12,12482.07,12423.12,12607.44,148670000],["2012-01-18",12474.77,12578.95,12424.33,12607.71,154170000],["2012-01-19",12578.19,12623.98,12518.48,12678.62,148030000],["2012-01-20",12623.83,12720.48,12568.35,12763.84,255110000],["2012-01-23",12720.17,12708.82,12620.2,12806.98,149860000],["2012-01-24",12708.44,12675.75,12551.78,12753.02,125420000],["2012-01-25",12673.78,12756.96,12537.25,12794.95,135430000],["2012-01-26",12757.48,12734.63,12679,12884.63,130840000],["2012-01-27",12733.72,12660.46,12591.21,12749.24,164410000],["2012-01-30",12659.32,12653.72,12492.18,12679.83,130430000],["2012-01-31",12654.78,12632.91,12542.85,12756.05,168070000],["2012-02-01",12632.76,12716.46,12632.76,12826.51,143500000],["2012-02-02",12716.54,12705.41,12650.24,12785.49,114360000],["2012-02-03",12705.11,12862.23,12705.11,12917.14,142840000],["2012-02-06",12860.79,12845.13,12755.97,12888.8,108040000],["2012-02-07",12844.44,12878.2,12753.4,12931.1,116150000],["2012-02-08",12865.94,12883.95,12789.2,12947.37,138250000],["2012-02-09",12884.41,12890.46,12820.68,12978.18,157080000],["2012-02-10",12889.55,12801.23,12712.26,12889.55,123620000],["2012-02-13",12799.11,12874.04,12794.49,12929.44,112240000],["2012-02-14",12871.92,12878.28,12771.71,12903.63,120050000],["2012-02-15",12865.41,12780.95,12740.38,12927.47,127560000],["2012-02-16",12779.58,12904.08,12760.06,12936.74,134450000],["2012-02-17",12903.33,12949.87,12871.39,13006.41,234650000],["2012-02-21",12949.34,12965.69,12895.57,13049.43,164780000],["2012-02-22",12966.22,12938.67,12875.29,13029.42,124200000],["2012-02-23",12937.08,12984.69,12856.25,13050.3,120480000],["2012-02-24",12981.2,12982.95,12928.72,13055.15,89440000],["2012-02-27",12981.2,12981.51,12859.28,13051.48,143530000],["2012-02-28",12976.74,13005.12,12925.88,13058.17,114490000],["2012-02-29",13005.27,12952.07,12903.1,13087.16,182460000],["2012-03-01",12952.37,12980.3,12911.88,13067.07,139670000],["2012-03-02",12980.75,12977.57,12903.29,13031.84,93900000],["2012-03-05",12977.34,12962.81,12850.46,13030.17,108630000],["2012-03-06",12958.5,12759.15,12701.33,12958.5,142330000],["2012-03-07",12756.12,12837.33,12726.76,12882.78,175110000],["2012-03-08",12835.53,12907.94,12834.19,12963.95,103530000],["2012-03-09",12908.32,12922.02,12868.06,12997.25,103240000],["2012-03-12",12920.58,12959.71,12876.23,13022.94,100000000],["2012-03-13",12953.13,13177.68,12953.13,13193.12,163130000],["2012-03-14",13177.22,13194.1,13108.2,13269.48,163610000],["2012-03-15",13192.89,13252.76,13122.2,13286.36,161650000],["2012-03-16",13253.59,13232.62,13190.7,13331.77,392620000],["2012-03-19",13232.02,13239.13,13157.62,13298.96,147120000],["2012-03-20",13238.3,13170.19,13096.13,13238.3,131660000],["2012-03-21",13170.79,13124.62,13085.34,13230.24,124860000],["2012-03-22",13124.47,13046.14,12973.79,13125.38,122060000],["2012-03-23",13045.99,13080.73,12977.57,13128.03,129930000],["2012-03-26",13082.62,13241.63,13082.62,13268.61,122080000],["2012-03-27",13242.09,13197.73,13176.54,13298.96,129280000],["2012-03-28",13195.54,13126.21,13048.41,13249.65,141540000],["2012-03-29",13125.99,13145.82,12993.84,13177.64,136250000],["2012-03-30",13147.94,13212.04,13127.58,13249.12,171190000],["2012-04-02",13147.94,13264.49,13128.86,13316.86,108790000],["2012-04-03",13258.96,13199.55,13114.18,13297.14,123980000],["2012-04-04",13198.19,13074.75,12995.05,13198.19,125000000],["2012-04-05",13067.18,13060.14,12975.98,13123.07,109530000],["2012-04-09",13057.57,12929.59,12860.11,13057.57,105580000],["2012-04-10",12929.59,12715.93,12689.1,12951.46,159290000],["2012-04-11",12716.92,12805.39,12716.92,12890.91,125210000],["2012-04-12",12806.45,12986.58,12784.92,13018.82,119780000],["2012-04-13",12986.2,12849.59,12826.05,12992.63,140990000],["2012-04-16",12850.88,12921.41,12840.51,13032.59,120990000],["2012-04-17",12921.87,13115.54,12921.87,13168.33,115320000],["2012-04-18",13114.56,13032.75,12977.16,13131.7,113520000],["2012-04-19",13028.73,12964.1,12874.3,13115.05,139810000],["2012-04-20",12964.48,13029.26,12961,13127.99,212080000],["2012-04-23",13028.05,12927.17,12810.24,13028.05,139370000],["2012-04-24",12927.77,13001.56,12902.34,13088.75,134110000],["2012-04-25",12997.54,13090.72,12972.65,13169.92,135260000],["2012-04-26",13090.04,13204.62,13044.7,13243.83,107570000],["2012-04-27",13204.7,13228.31,13152.82,13311.87,110850000],["2012-04-30",13228.39,13213.63,13132.8,13271.9,127870000],["2012-05-01",13214.16,13279.32,13152.17,13359.62,123400000],["2012-05-02",13277.96,13268.57,13164.06,13305.96,100770000],["2012-05-03",13267.36,13206.59,13155.58,13314.59,102090000],["2012-05-04",13204.62,13038.27,13005.2,13204.62,113790000],["2012-05-07",13036,13008.53,12931.63,13080.69,110080000],["2012-05-08",13000.73,12932.09,12789.35,13001.19,138620000],["2012-05-09",12921.66,12835.06,12728.69,12947.49,147460000],["2012-05-10",12831.58,12855.04,12804.75,12972.92,151650000],["2012-05-11",12851.79,12820.6,12740.99,12933.07,148370000],["2012-05-14",12818.86,12695.35,12634.01,12818.86,143190000],["2012-05-15",12694.82,12632,12583.68,12795.74,156060000],["2012-05-16",12617.39,12598.55,12559.57,12764.71,143130000],["2012-05-17",12598.47,12442.49,12415.85,12670.22,147430000],["2012-05-18",12442.94,12369.38,12309.63,12539.52,240720000],["2012-05-21",12369.23,12504.48,12336.38,12545.57,142110000],["2012-05-22",12505.23,12502.81,12425.39,12613.46,133650000],["2012-05-23",12501.6,12496.15,12289.27,12536.34,152190000],["2012-05-24",12491.91,12529.75,12390.99,12589.24,126810000],["2012-05-25",12530.59,12454.83,12404.16,12575.88,93000000],["2012-05-29",12455.21,12580.69,12455.21,12646.65,107510000],["2012-05-30",12578.87,12419.86,12373.35,12578.87,122830000],["2012-05-31",12414.41,12393.45,12298.05,12503.98,205140000],["2012-06-01",12391.56,12118.57,12080.46,12391.56,162940000],["2012-06-04",12119.85,12101.46,12003.75,12190.92,126440000],["2012-06-05",12101.16,12127.95,12029.22,12183.5,108970000],["2012-06-06",12125,12414.79,12125,12420.39,140110000],["2012-06-07",12416.83,12460.96,12414.94,12606.87,131150000],["2012-06-08",12460.96,12554.2,12364.76,12573.16,111810000],["2012-06-11",12553.81,12411.23,12395.04,12682.07,121060000],["2012-06-12",12412.14,12573.8,12386.79,12588.37,111360000],["2012-06-13",12566.38,12496.38,12420.39,12632.42,125780000],["2012-06-14",12497.82,12651.91,12471.44,12706.02,128640000],["2012-06-15",12651.68,12767.17,12636.85,12815.91,284290000],["2012-06-18",12767.02,12741.82,12657.96,12815.38,111280000],["2012-06-19",12744.54,12837.33,12744.54,12917.37,125180000],["2012-06-20",12837.1,12824.39,12744.92,12877.18,119110000],["2012-06-21",12823.1,12573.57,12561.46,12857.39,146750000],["2012-06-22",12574.82,12640.78,12574.67,12674.08,209990000],["2012-06-25",12639.8,12502.66,12458.01,12639.87,134090000],["2012-06-26",12503.57,12534.67,12452.03,12576.41,109270000],["2012-06-27",12532.93,12627.01,12532.71,12646.87,97950000],["2012-06-28",12626.25,12602.26,12450.17,12626.25,125870000],["2012-06-29",12604.6,12880.09,12604.53,12880.39,191630000],["2012-07-02",12879.71,12871.39,12795.48,12902.12,109640000],["2012-07-03",12868.06,12943.66,12845.28,12946.2,63850000],["2012-07-05",12941.85,12896.67,12852.24,12961.3,97800000],["2012-07-06",12889.4,12772.47,12702.99,12889.4,96760000],["2012-07-09",12772.02,12736.29,12686.57,12772.02,100150000],["2012-07-10",12733.87,12653.12,12606.91,12830.29,114760000],["2012-07-11",12653.04,12604.53,12534.33,12661.97,128420000],["2012-07-12",12602.71,12573.27,12492.25,12630.64,142760000],["2012-07-13",12573.73,12777.09,12573.04,12784.73,121080000],["2012-07-16",12776.33,12727.21,12690.05,12779.58,93500000],["2012-07-17",12728.73,12805.54,12645.1,12829.23,119620000],["2012-07-18",12796.98,12908.7,12754.61,12921.94,130070000],["2012-07-19",12909.61,12943.36,12889.93,12977.57,139480000],["2012-07-20",12942.68,12822.57,12810.35,12942.83,210770000],["2012-07-23",12820.45,12721.46,12583.41,12820.45,137760000],["2012-07-24",12720.93,12617.32,12521.84,12730.09,131530000],["2012-07-25",12617.77,12676.05,12617.62,12732.77,127320000],["2012-07-26",12680.59,12887.93,12680.59,12931.22,133620000],["2012-07-27",12888.91,13075.66,12888.53,13117.74,161510000],["2012-07-30",13075.35,13073.01,13042.85,13128.64,91730000],["2012-07-31",13071.72,13008.68,13006.48,13082.66,125980000],["2012-08-01",13007.47,12976.13,12951.16,13074.83,132780000],["2012-08-02",12969.7,12878.88,12778.9,12969.85,112770000],["2012-08-03",12884.82,13096.17,12884.82,13133.18,112390000],["2012-08-06",13099.88,13117.51,13099.72,13187.28,84270000],["2012-08-07",13118.65,13168.6,13118.42,13215.97,95240000],["2012-08-08",13158.1,13175.64,13115.24,13202.65,84910000],["2012-08-09",13174.73,13165.19,13125.09,13200.23,84350000],["2012-08-10",13163.15,13207.95,13094.96,13208.22,86640000],["2012-08-13",13204.93,13169.43,13112.94,13205.01,67550000],["2012-08-14",13168.11,13172.14,13142.1,13223.01,84430000],["2012-08-15",13157.47,13164.78,13138.23,13192.89,77130000],["2012-08-16",13163.24,13250.11,13145.85,13269.35,114580000],["2012-08-17",13251.2,13275.2,13244.85,13281.32,138550000],["2012-08-20",13274.58,13271.64,13230.06,13276.15,87590000],["2012-08-21",13272.1,13203.58,13186.6,13330.76,117060000],["2012-08-22",13198.31,13172.76,13120.34,13205.06,111220000],["2012-08-23",13171.37,13057.46,13046.46,13171.37,108800000],["2012-08-24",13052.82,13157.97,13027.2,13175.51,88030000],["2012-08-27",13157.74,13124.67,13115.46,13176.17,96070000],["2012-08-28",13122.74,13102.99,13081.12,13147.32,81630000],["2012-08-29",13103.46,13107.48,13081.27,13144.81,91530000],["2012-08-30",13101.29,13000.71,12978.91,13101.37,89980000],["2012-08-31",13002.72,13090.84,13002.64,13151.87,119780000],["2012-09-04",13092.15,13035.94,12977.09,13092.39,103920000],["2012-09-05",13036.09,13047.48,13018.74,13095.91,92550000],["2012-09-06",13045.23,13292,13045.08,13294.13,128650000],["2012-09-07",13289.53,13306.64,13266.22,13320.27,142210000],["2012-09-10",13308.56,13254.29,13251.39,13324.1,123810000],["2012-09-11",13254.6,13323.36,13253.21,13354.34,104920000],["2012-09-12",13321.62,13333.35,13317.52,13373.62,111520000],["2012-09-13",13329.71,13539.86,13325.11,13573.33,151770000],["2012-09-14",13540.4,13593.37,13533.94,13653.24,185160000],["2012-09-17",13588.57,13553.1,13526.67,13593.15,128020000],["2012-09-18",13552.33,13564.64,13517.81,13582.12,120720000],["2012-09-19",13565.41,13577.96,13556.74,13626.48,116210000],["2012-09-20",13575.17,13596.93,13503,13599.02,117910000],["2012-09-21",13597.24,13579.47,13571.53,13647.1,429610000],["2012-09-24",13577.85,13558.92,13521.68,13601.9,120370000],["2012-09-25",13559.92,13457.55,13457.25,13620.21,138630000],["2012-09-26",13458.63,13413.51,13406.91,13480.37,124350000],["2012-09-27",13413.47,13485.97,13413.47,13522.83,113990000],["2012-09-28",13485.89,13437.13,13367.27,13487.66,146950000],["2012-10-01",13437.66,13515.11,13437.66,13598.25,106120000],["2012-10-02",13515.3,13482.36,13424.92,13567.06,90730000],["2012-10-03",13479.21,13494.61,13439.12,13536.27,103890000],["2012-10-04",13495.18,13575.36,13495.18,13594.33,106390000],["2012-10-05",13569.18,13610.15,13568.75,13661.87,115500000],["2012-10-08",13589.26,13583.65,13552.09,13610.38,71300000],["2012-10-09",13582.88,13473.53,13473.31,13592.33,103630000],["2012-10-10",13473.53,13344.97,13327.62,13478.83,101120000],["2012-10-11",13346.28,13326.39,13326.12,13428.49,86630000],["2012-10-12",13325.62,13328.85,13296.43,13401.32,113740000],["2012-10-15",13329.54,13424.23,13325.93,13437.66,114880000],["2012-10-16",13423.84,13551.78,13423.76,13556.37,113450000],["2012-10-17",13539.63,13557,13468.9,13561.65,135570000],["2012-10-18",13553.24,13548.94,13510.93,13588.73,128410000],["2012-10-19",13545.33,13343.51,13312.22,13545.49,239080000],["2012-10-22",13344.28,13345.89,13235.15,13368.55,121880000],["2012-10-23",13344.9,13102.53,13083.28,13344.9,122220000],["2012-10-24",13103.53,13077.34,13063.63,13155.21,110670000],["2012-10-25",13079.64,13103.68,13017.37,13214.11,114590000],["2012-10-26",13104.22,13107.21,13040.17,13151.72,134640000],["2012-10-29",13107.21,13107.21,13107.21,13107.21,134643904],["2012-10-30",13107.21,13107.21,13107.21,13107.21,134643904],["2012-10-31",13107.44,13096.46,13052.07,13189.08,138160000],["2012-11-01",13099.19,13232.62,13099.11,13273.71,140510000],["2012-11-02",13232.62,13093.16,13076.57,13289.45,137660000],["2012-11-05",13092.28,13112.44,13038.71,13140.58,95350000],["2012-11-06",13112.9,13245.68,13112.9,13290.75,105710000],["2012-11-07",13228.24,12932.73,12876.6,13228.32,164250000],["2012-11-08",12932.81,12811.32,12811.24,12980.23,138350000],["2012-11-09",12811.17,12815.39,12743.39,12890.19,131670000],["2012-11-12",12815.93,12815.16,12783,12861.28,62360000],["2012-11-13",12808.71,12756.18,12748.51,12898.25,142200000],["2012-11-14",12746.54,12570.95,12542.68,12797.73,162180000],["2012-11-15",12571.1,12542.38,12496.56,12600.59,129150000],["2012-11-16",12542.31,12588.31,12471.49,12604.17,197110000],["2012-11-19",12590.23,12795.96,12590.23,12796.19,136910000],["2012-11-20",12790.89,12788.51,12701.07,12808.56,134160000],["2012-11-21",12788.36,12836.89,12786.13,12845.99,97300000],["2012-11-23",12833.13,13009.53,12832.98,13011.45,61110000],["2012-11-26",13008.45,12967.37,12900.17,13008.45,114360000],["2012-11-27",12963.38,12878.13,12868.26,12980.19,117900000],["2012-11-28",12875.56,12985.11,12765.32,12989.1,131000000],["2012-11-29",12977.35,13021.82,12961.92,13062.56,113620000],["2012-11-30",13022.05,13025.58,12988.68,13053.74,171070000],["2012-12-03",13027.73,12965.6,12959.42,13087.32,112900000],["2012-12-04",12966.45,12951.78,12940.07,13022.51,125290000],["2012-12-05",12948.96,13034.49,12923.44,13089.11,161230000],["2012-12-06",13026.19,13074.04,13007.84,13076.88,116850000],["2012-12-07",13072.87,13155.13,13072.87,13157.28,124130000],["2012-12-10",13154.89,13169.88,13139.08,13195.35,118530000],["2012-12-11",13170.34,13248.44,13170.34,13306.57,124510000],["2012-12-12",13250.05,13245.45,13227.44,13329.44,127510000],["2012-12-13",13241.38,13170.72,13147.19,13264.41,101190000],["2012-12-14",13170.8,13135.01,13118.46,13190.41,117620000],["2012-12-17",13135.17,13235.39,13134.63,13244.33,142980000],["2012-12-18",13236.61,13350.96,13232.58,13365.86,152920000],["2012-12-19",13351.04,13251.97,13251.74,13357.7,149020000],["2012-12-20",13246.67,13311.72,13216.03,13314.64,119800000],["2012-12-21",13309.95,13190.84,13122.53,13309.95,413270000],["2012-12-24",13190.15,13138.93,13128.55,13190.38,47710000],["2012-12-26",13138.85,13114.59,13076.87,13174.88,79410000],["2012-12-27",13114.97,13096.31,12964.08,13141.74,100160000],["2012-12-28",13095.08,12938.11,12926.86,13095.46,85980000],["2012-12-31",12938.19,13104.14,12883.89,13109.13,145740000],["2013-01-02",13104.3,13412.55,13104.3,13412.71,161430000],["2013-01-03",13413.01,13391.36,13358.3,13430.6,129630000],["2013-01-04",13391.05,13435.21,13376.23,13447.11,107590000],["2013-01-07",13436.13,13384.29,13343.32,13436.13,113120000],["2013-01-08",13377.42,13328.85,13293.13,13377.42,129570000],["2013-01-09",13329.92,13390.51,13329.08,13416.55,123070000],["2013-01-10",13391.82,13471.22,13382.29,13478.2,133520000],["2013-01-11",13471.45,13488.43,13439.97,13496.68,119200000],["2013-01-14",13488.43,13507.32,13459.84,13520.18,118460000],["2013-01-15",13507.32,13534.89,13445.8,13546.37,102280000],["2013-01-16",13534.89,13511.23,13468.96,13534.89,118540000],["2013-01-17",13511.23,13596.02,13510.24,13633.89,183900000],["2013-01-18",13596.02,13649.7,13571.86,13649.93,260900000],["2013-01-22",13649.7,13712.21,13622.96,13712.21,144300000],["2013-01-23",13712.21,13779.33,13710.13,13794.29,104490000],["2013-01-24",13779.33,13825.33,13779.33,13879.66,124780000],["2013-01-25",13825.33,13895.98,13825.33,13895.98,130300000],["2013-01-28",13895.98,13881.93,13862.57,13915.72,113570000],["2013-01-29",13881.93,13954.42,13880.01,13969.99,108230000],["2013-01-30",13954.42,13910.42,13896.95,13966.13,117200000],["2013-01-31",13910.42,13860.58,13860.58,13941.06,142600000],["2013-02-01",13860.58,14009.79,13860.58,14019.78,128420000],["2013-02-04",14009.79,13880.08,13866.83,14009.79,130420000],["2013-02-05",13880.08,13979.3,13880.08,14013.6,134390000],["2013-02-06",13979.3,13986.52,13913.18,13991.61,127560000],["2013-02-07",13986.52,13944.05,13852.2,13988.06,118530000],["2013-02-08",13944.05,13992.97,13944.05,14022.62,99860000],["2013-02-11",13992.97,13971.24,13940.41,13992.97,75090000],["2013-02-12",13971.24,14018.7,13968.94,14038.97,117180000],["2013-02-13",14018.7,13982.91,13945.78,14029.35,130520000],["2013-02-14",13982.91,13973.39,13921.94,13990.36,114800000],["2013-02-15",13973.39,13981.76,13906.73,14001.93,195670000],["2013-02-19",13981.76,14035.67,13977.9,14044.82,136410000],["2013-02-20",14035.67,13927.54,13919.28,14058.27,138540000],["2013-02-21",13927.54,13880.62,13834.4,13927.54,131410000],["2013-02-22",13880.62,14000.57,13880.62,14001.19,139850000],["2013-02-25",14000.57,13784.17,13784.01,14081.58,152190000],["2013-02-26",13784.17,13900.13,13784.17,13918.44,132580000],["2013-02-27",13900.13,14075.37,13880.19,14104.86,107010000],["2013-02-28",14075.37,14054.49,14050.18,14149.15,177150000],["2013-03-01",14054.49,14089.66,13937.6,14107.09,125920000],["2013-03-04",14089.66,14127.82,14030.37,14128.21,110810000],["2013-03-05",14127.82,14253.77,14127.82,14286.37,112100000],["2013-03-06",14253.77,14296.24,14253,14320.65,116510000],["2013-03-07",14296.24,14329.49,14296.24,14354.69,117080000],["2013-03-08",14329.49,14397.07,14329.49,14413.17,115630000],["2013-03-11",14397.07,14447.29,14373.32,14448.06,94880000],["2013-03-12",14447.29,14450.06,14412.06,14478.8,102100000],["2013-03-13",14450.06,14455.28,14411.66,14472.8,83920000],["2013-03-14",14455.28,14539.14,14455.28,14539.29,117390000],["2013-03-15",14539.14,14514.11,14470.5,14539.14,407770000],["2013-03-18",14514.11,14452.06,14404.21,14521.59,119640000],["2013-03-19",14452.06,14455.82,14382.09,14514.34,122170000],["2013-03-20",14455.82,14511.73,14455.82,14546.82,121240000],["2013-03-21",14511.73,14421.49,14383.02,14511.73,110450000],["2013-03-22",14421.49,14512.03,14421.49,14519.95,101450000],["2013-03-25",14512.03,14447.75,14395,14563.75,124840000],["2013-03-26",14447.75,14559.65,14447.75,14561.54,96030000],["2013-03-27",14559.65,14526.16,14439.55,14559.65,92680000],["2013-03-28",14526.16,14578.54,14520.86,14585.1,153710000],["2013-04-01",14578.54,14572.85,14531.48,14605.72,91400000],["2013-04-02",14572.85,14662.01,14572.85,14684.49,98420000],["2013-04-03",14662.01,14550.35,14525.36,14683.13,127140000],["2013-04-04",14550.35,14606.11,14538.72,14625.24,104790000],["2013-04-05",14606.11,14565.25,14434.43,14606.11,131250000],["2013-04-08",14565.25,14613.48,14497.8,14613.48,106680000],["2013-04-09",14613.48,14673.46,14598.5,14716.46,128580000],["2013-04-10",14673.46,14802.24,14673.46,14826.66,120520000],["2013-04-11",14802.24,14865.14,14785.36,14887.51,144570000],["2013-04-12",14865.14,14865.06,14790.57,14865.21,119570000],["2013-04-15",14865.06,14599.2,14598.58,14865.06,161680000],["2013-04-16",14599.2,14756.78,14599.2,14761.73,126320000],["2013-04-17",14756.78,14618.59,14560.81,14756.78,168010000],["2013-04-18",14618.59,14537.14,14495.29,14650.26,158050000],["2013-04-19",14537.14,14547.51,14444.03,14553.73,207200000],["2013-04-22",14547.51,14567.17,14457.6,14588.83,146890000],["2013-04-23",14567.17,14719.46,14554.29,14721.42,137320000],["2013-04-24",14719.46,14676.3,14666.54,14747.42,138020000],["2013-04-25",14676.3,14700.8,14665.45,14768.05,129600000],["2013-04-26",14700.8,14712.55,14684.82,14743.49,128910000],["2013-04-29",14712.55,14818.75,14712.55,14844.96,97060000],["2013-04-30",14818.75,14839.8,14734.47,14839.8,148250000],["2013-05-01",14839.8,14700.95,14687.05,14839.8,112620000],["2013-05-02",14700.95,14831.58,14700.95,14834.63,91180000],["2013-05-03",14831.58,14973.96,14831.58,15009.59,119890000],["2013-05-06",14973.96,14968.89,14941.09,14988.87,116160000],["2013-05-07",14968.89,15056.2,14968.89,15056.67,117230000],["2013-05-08",15056.2,15105.12,15021.87,15106.81,113510000],["2013-05-09",15105.12,15082.62,15046.87,15144.83,97810000],["2013-05-10",15082.62,15118.49,15038.18,15118.49,98980000],["2013-05-13",15113.42,15091.68,15053.46,15113.42,94280000],["2013-05-14",15091.68,15215.25,15089.3,15219.55,124590000],["2013-05-15",15211.87,15275.69,15175.39,15301.34,124030000],["2013-05-16",15273.92,15233.22,15215.82,15302.49,145090000],["2013-05-17",15234.75,15354.4,15234.75,15357.4,175750000],["2013-05-20",15348.33,15335.28,15314.15,15391.84,116420000],["2013-05-21",15334.97,15387.58,15325.68,15434.5,122970000],["2013-05-22",15387.12,15307.17,15265.96,15542.4,171850000],["2013-05-23",15300.57,15294.5,15180.23,15348.41,148810000],["2013-05-24",15290.74,15303.1,15199.63,15306.71,105660000],["2013-05-28",15307.33,15409.39,15307.33,15521.49,130680000],["2013-05-29",15399.94,15302.8,15229.53,15400.25,114020000],["2013-05-30",15306.02,15324.53,15280.99,15398.7,121150000],["2013-05-31",15322.22,15115.57,15115.57,15392.38,208830000],["2013-06-03",15123.55,15254.03,15123.55,15254.11,147980000],["2013-06-04",15255.22,15177.54,15100.78,15304.98,134280000],["2013-06-05",15168.1,14960.59,14945.57,15168.63,141400000],["2013-06-06",14955.45,15040.62,14844.22,15040.62,140410000],["2013-06-07",15044.46,15248.12,15044.46,15255.58,137380000],["2013-06-10",15247.81,15238.59,15211.25,15300.64,94250000],["2013-06-11",15231.38,15122.02,15086.09,15251.07,101610000],["2013-06-12",15130.39,14995.23,14981.21,15241.28,105770000],["2013-06-13",14992.54,15176.08,14953.45,15202.27,104490000],["2013-06-14",15178.08,15070.18,15044.8,15205.92,107430000],["2013-06-17",15078.71,15179.85,15078.71,15261.71,139250000],["2013-06-18",15186.3,15318.23,15186.3,15340.09,99210000],["2013-06-19",15315.47,15112.19,15112.11,15322.07,111380000],["2013-06-20",15105.51,14758.32,14732.03,15105.51,172630000],["2013-06-21",14760.62,14799.4,14688.43,14858.56,420080000],["2013-06-24",14795.79,14659.56,14551.27,14795.79,158670000],["2013-06-25",14669.69,14760.31,14669.69,14812.03,135940000],["2013-06-26",14769.99,14910.14,14769.68,14938.98,133230000],["2013-06-27",14921.28,15024.49,14921.28,15075.01,113650000],["2013-06-28",15016.58,14909.6,14884.8,15034.63,230000000],["2013-07-01",14911.6,14974.96,14911.6,15083.28,120570000],["2013-07-02",14974.96,14932.41,14870.51,15049.22,116610000],["2013-07-03",14923.73,14988.37,14858.93,15025.9,61000000],["2013-07-05",14995.46,15135.84,14971.2,15137.51,94560000],["2013-07-08",15137.22,15224.69,15137.22,15262.72,136820000],["2013-07-09",15228.46,15300.34,15228.46,15320.42,109270000],["2013-07-10",15298.03,15291.66,15258.89,15348.95,105050000],["2013-07-11",15298,15460.92,15298,15483.55,124950000],["2013-07-12",15460.69,15464.3,15410.27,15498.39,130140000],["2013-07-15",15459.69,15484.26,15455.77,15509.48,99430000],["2013-07-16",15485.03,15451.85,15415.71,15498.16,105970000],["2013-07-17",15456.92,15470.52,15438.12,15502,126240000],["2013-07-18",15465.91,15548.54,15465.91,15589.4,136270000],["2013-07-19",15524.27,15543.74,15491.96,15544.55,229260000],["2013-07-22",15543.97,15545.55,15516.2,15576.21,180920000],["2013-07-23",15547,15567.74,15544.06,15604.22,98700000],["2013-07-24",15576.69,15542.24,15496.84,15602.6,99320000],["2013-07-25",15539.17,15555.61,15455.59,15560.33,103260000],["2013-07-26",15547.85,15558.83,15405.16,15560.97,94880000],["2013-07-29",15557.14,15521.97,15482.27,15557.14,87240000],["2013-07-30",15534.49,15520.59,15479.13,15593.91,117550000],["2013-07-31",15528.57,15499.54,15492.96,15634.32,145120000],["2013-08-01",15503.85,15628.02,15503.85,15650.69,111040000],["2013-08-02",15627.56,15658.36,15558.68,15658.43,104838000],["2013-08-05",15651.98,15612.13,15584.83,15655.21,76850000],["2013-08-06",15608.44,15518.74,15473.4,15608.44,87730000],["2013-08-07",15516.21,15470.67,15421.75,15516.21,88430000],["2013-08-08",15477.27,15498.32,15418.6,15557.12,90990000],["2013-08-09",15496.63,15425.51,15346.65,15507.76,81180000],["2013-08-12",15415.22,15419.68,15359.93,15441.75,78060000],["2013-08-13",15420.68,15451.01,15342.34,15504.14,84790000],["2013-08-14",15447.71,15337.66,15316.62,15453.08,91030000],["2013-08-15",15332.71,15112.19,15094.03,15332.71,128340000],["2013-08-16",15112.57,15081.47,15054.38,15139.77,151620000],["2013-08-19",15076.79,15010.74,15005.42,15106.39,111660000],["2013-08-20",15011.82,15002.99,14992.16,15074.92,102340000],["2013-08-21",14993.81,14897.55,14880.84,15019.7,98340000],["2013-08-22",14908.6,14963.74,14899,14989.12,153490000],["2013-08-23",14988.78,15010.51,14931.24,15025.56,131860000],["2013-08-26",15014.58,14946.46,14945.24,15049.98,102820000],["2013-08-27",14939.25,14776.13,14765.42,14939.25,118610000],["2013-08-28",14770.99,14824.51,14760.41,14867.4,104620000],["2013-08-29",14817.91,14840.95,14792.11,14916.01,93170000],["2013-08-30",14844.1,14810.31,14762.35,14848.24,135850000],["2013-09-03",14801.55,14833.96,14777.48,14933.35,142530000],["2013-09-04",14832.42,14930.87,14799.09,14956.74,122150000],["2013-09-05",14929.49,14937.48,14923.27,14987.47,101010000],["2013-09-06",14941.55,14922.5,14789.4,15009.84,108410000],["2013-09-09",14927.19,15063.12,14927.19,15088.41,90660000],["2013-09-10",15067.23,15191.06,15067.23,15192.13,103200000],["2013-09-11",15194.13,15326.6,15194.13,15326.6,102090000],["2013-09-12",15327.14,15300.64,15283.26,15345.32,99760000],["2013-09-13",15312.86,15376.06,15312.86,15380.97,90890000],["2013-09-16",15381.36,15494.78,15381.36,15549.87,105740000],["2013-09-17",15503.15,15529.73,15503.15,15555.07,104480000],["2013-09-18",15533.03,15676.94,15470.16,15709.58,145410000],["2013-09-19",15677.86,15636.55,15625.45,15695.89,116280000],["2013-09-20",15635.09,15451.09,15448.09,15654.77,379652512],["2013-09-23",15452.31,15401.38,15368.25,15466.95,94920000],["2013-09-24",15402.54,15334.59,15327.14,15433.75,85430000],["2013-09-25",15339.02,15273.26,15253.16,15372.48,81890000],["2013-09-26",15274.42,15328.3,15274.42,15387.19,79050000],["2013-09-27",15317.45,15258.24,15211.81,15317.45,95660000],["2013-09-30",15249.82,15129.67,15086.71,15249.82,122330000],["2013-10-01",15132.49,15191.7,15110.34,15208.4,82460000],["2013-10-02",15182.65,15133.14,15044.71,15182.65,86094200],["2013-10-03",15127.23,14996.48,14947.03,15127.23,91300000],["2013-10-04",14994.68,15072.58,14972.33,15083.99,75100000],["2013-10-07",15069.3,14936.24,14920.83,15069.3,79620000],["2013-10-08",14938.04,14776.53,14773.47,14938.04,102691296],["2013-10-09",14778.19,14802.98,14719.43,14852.5,103190000],["2013-10-10",14806.39,15126.07,14806.39,15126.07,106540000],["2013-10-11",15126.52,15237.11,15100.13,15237.3,85730000],["2013-10-14",15231.33,15301.26,15136.38,15309.48,81420000],["2013-10-15",15300.3,15168.01,15161.33,15301.91,91440000],["2013-10-16",15170.7,15373.83,15170.7,15374.15,92850000],["2013-10-17",15369.46,15371.65,15229.02,15376.11,108490000],["2013-10-18",15371.71,15399.65,15321.81,15412.97,156660000],["2013-10-21",15401.32,15392.2,15362.66,15410.18,93660000],["2013-10-22",15394.22,15467.66,15394.22,15518.1,107030000],["2013-10-23",15465.34,15413.33,15366.19,15465.66,90630000],["2013-10-24",15414.87,15509.21,15414.13,15528.63,89240000],["2013-10-25",15523.7,15570.3,15513,15570.6,109900000],["2013-10-28",15569.2,15568.9,15533.5,15599.1,92760000],["2013-10-29",15572.2,15680.4,15572.2,15683.1,86600000],["2013-10-30",15680.7,15618.8,15574.5,15721,79170000],["2013-10-31",15619.92,15545.75,15544.69,15651.86,114050000],["2013-11-01",15558.01,15615.55,15543.25,15649.4,101830000],["2013-11-04",15621.2,15639.12,15588.48,15658.9,71200000],["2013-11-05",15631.22,15618.22,15522.18,15651.89,91890000],["2013-11-06",15628.72,15746.88,15628.72,15750.29,109200000],["2013-11-07",15751.31,15593.98,15586.33,15797.68,103860000],["2013-11-08",15591.54,15761.78,15579.35,15764.29,101200000],["2013-11-11",15759.28,15783.1,15737.22,15791.45,58860000],["2013-11-12",15773.15,15750.67,15708.29,15793.38,79260000],["2013-11-13",15739.5,15821.63,15672,15822.98,92450000],["2013-11-14",15806.22,15876.22,15798.74,15884.99,123860000],["2013-11-15",15876.16,15961.7,15875.9,15962.98,126460000],["2013-11-18",15962.72,15976.02,15942.17,16030.28,94860000],["2013-11-19",15974.06,15967.03,15943.78,16025.85,84570000],["2013-11-20",15971.2,15900.82,15865.37,16016.85,84350000],["2013-11-21",15908.07,16009.99,15908.07,16016.04,79000000],["2013-11-22",16008.71,16064.77,15976.27,16068.78,81000000],["2013-11-25",16072.09,16072.54,16055.46,16109.63,94040000],["2013-11-26",16070.93,16072.8,16070.93,16120.25,107450000],["2013-11-27",16073.37,16097.33,16057.34,16107.99,65730000],["2013-11-29",16105.16,16086.41,16074.14,16174.51,69190000],["2013-12-02",16087.12,16008.77,15986.23,16098,92590000],["2013-12-03",16004.72,15914.62,15859.68,16004.72,103910000],["2013-12-04",15910.51,15889.77,15791.29,15960.36,111180000],["2013-12-05",15886.5,15821.51,15809.37,15896.19,128080000],["2013-12-06",15825.55,16020.2,15825.55,16022.35,98260000],["2013-12-09",16019.49,16025.53,16015.29,16058.4,91810000],["2013-12-10",16024.12,15973.13,15969.53,16029.06,79420000],["2013-12-11",15970.75,15843.53,15827.7,15997.22,107170000],["2013-12-12",15844.82,15739.43,15703.79,15845.11,105870000],["2013-12-13",15745.66,15755.36,15717.92,15792.8,83179200],["2013-12-16",15759.6,15884.57,15759.6,15930.31,101470000],["2013-12-17",15884.06,15875.26,15836.45,15917.96,101490000],["2013-12-18",15876.57,16167.97,15808.92,16173.04,129621904],["2013-12-19",16162.51,16179.08,16121.54,16194.72,94980000],["2013-12-20",16178.57,16221.14,16178.57,16287.84,285190000],["2013-12-23",16225.25,16294.61,16225.25,16318.11,78930000],["2013-12-24",16295.7,16357.55,16295.7,16360.6,33640000],["2013-12-26",16370.97,16479.88,16370.97,16483,50160000],["2013-12-27",16486.37,16478.41,16461.23,16529.01,47230000],["2013-12-30",16484.51,16504.29,16476.87,16504.35,54223700],["2013-12-31",16512.38,16576.66,16511.48,16588.25,78760000],["2014-01-02",16572.17,16441.35,16416.49,16573.07,80960000],["2014-01-03",16456.89,16469.99,16439.3,16518.74,72770000],["2014-01-06",16474.04,16425.1,16405.52,16532.99,89380000],["2014-01-07",16429.02,16530.94,16429.02,16562.32,81270000],["2014-01-08",16527.66,16462.74,16416.69,16528.88,103260000],["2014-01-09",16471.41,16444.76,16378.61,16525.35,83990000],["2014-01-10",16453.62,16437.05,16379.02,16487.65,85190000],["2014-01-13",16434.03,16257.94,16240.6,16453.13,111680000],["2014-01-14",16261.99,16373.86,16260.83,16373.92,98610000],["2014-01-15",16378.03,16481.94,16376.78,16505.28,101130000],["2014-01-16",16477.7,16417.01,16375.56,16477.7,87370000],["2014-01-17",16408.02,16458.56,16378.8,16495.26,184970000],["2014-01-21",16459.27,16414.44,16316.25,16520.6,111570000],["2014-01-22",16420.48,16373.34,16332.98,16453.49,87470000],["2014-01-23",16371.99,16197.35,16140.58,16372.96,100540000],["2014-01-24",16203.29,15879.11,15879.11,16203.29,141450000],["2014-01-27",15879.05,15837.88,15783.55,15942.77,127540000],["2014-01-28",15840.84,15928.56,15840.84,15945.89,89110000],["2014-01-29",15927.08,15738.79,15708.98,15927.08,109590000],["2014-01-30",15743.03,15848.61,15733.27,15907.53,92100000],["2014-01-31",15847.19,15698.85,15617.55,15847.19,137090000],["2014-02-03",15697.69,15372.8,15356.17,15708.54,151050000],["2014-02-04",15372.93,15445.24,15356.62,15481.85,124110000],["2014-02-05",15443,15440.23,15340.69,15478.21,105130000],["2014-02-06",15443.83,15628.53,15443,15632.09,106980000],["2014-02-07",15630.64,15794.08,15625.53,15798.51,10578200],["2014-02-10",15793.63,15801.79,15733.69,15801.79,84110000],["2014-02-11",15804.17,15994.77,15803.4,16027.19,95930000],["2014-02-12",15993.04,15963.94,15928.75,16036.56,77310000],["2014-02-13",15946.99,16027.59,15863.25,16039.37,99470000],["2014-02-14",16018.08,16154.39,15985.39,16175.55,84060000],["2014-02-18",16153.97,16130.4,16107.04,16167.33,91250000],["2014-02-19",16126.23,16040.56,16031.66,16225.72,80560000],["2014-02-20",16044.15,16133.23,16006.59,16161.64,77720000],["2014-02-21",16135.92,16103.3,16093.8,16191.92,126580000],["2014-02-24",16102.27,16207.14,16102.27,16300.04,244580000],["2014-02-25",16207.34,16179.66,16147.25,16254.26,99470000],["2014-02-26",16180.36,16198.41,16155.86,16252.35,93980000],["2014-02-27",16197.7,16272.65,16159.81,16276.28,97640000],["2014-02-28",16273.23,16321.71,16226.09,16398.95,122110000],["2014-03-03",16321.71,16168.03,16071.25,16321.71,92760000],["2014-03-04",16169.32,16395.88,16169.32,16419.49,96120000],["2014-03-05",16395.88,16360.18,16343.96,16406.55,73980000],["2014-03-06",16360.56,16421.89,16360.56,16450.17,75900000],["2014-03-07",16424.53,16452.72,16398.86,16505.7,80690000],["2014-03-10",16453.1,16418.68,16334.2,16453.1,68210000],["2014-03-11",16419.39,16351.25,16325.17,16460.33,78150000],["2014-03-12",16350.67,16340.08,16260.03,16364.74,77900000],["2014-03-13",16341.55,16108.89,16084.1,16405.07,86160000],["2014-03-14",16106.32,16065.67,16046.99,16165.05,85660000],["2014-03-17",16066.37,16247.22,16066.37,16270.34,88930000],["2014-03-18",16245.93,16336.19,16245.93,16369.94,79140000],["2014-03-19",16335.71,16222.17,16126.29,16363.32,90110000],["2014-03-20",16221.98,16331.05,16160.33,16353.98,91530000],["2014-03-21",16332.69,16302.77,16290.79,16456.45,353670000],["2014-03-24",16303.28,16276.69,16215.56,16380.51,110620000],["2014-03-25",16279.2,16367.88,16279.2,16407.18,89110000],["2014-03-26",16370.71,16268.99,16268.99,16466.04,92770000],["2014-03-27",16268.67,16264.23,16191.79,16300.94,93650000],["2014-03-28",16267.77,16323.06,16267.77,16414.86,86370000],["2014-03-31",16324.22,16457.66,16324.22,16480.85,104510000],["2014-04-01",16458.05,16532.61,16457.6,16565.73,88010000],["2014-04-02",16532.8,16573,16506.6,16588.19,78120000],["2014-04-03",16572.36,16572.55,16527.6,16604.15,77220000],["2014-04-04",16576.02,16412.71,16392.77,16631.63,104350000],["2014-04-07",16414.15,16245.87,16244.01,16421.38,116540000],["2014-04-08",16245.16,16256.14,16180.28,16296.86,98510000],["2014-04-09",16256.37,16437.18,16256.37,16438.82,91550000],["2014-04-10",16437.24,16170.22,16153.34,16456.12,112550000],["2014-04-11",16168.87,16026.75,16015.32,16168.87,119550000],["2014-04-14",16028.29,16173.24,16028.29,16184.76,90020000],["2014-04-15",16173.49,16262.56,16063.2,16272.95,97850000],["2014-04-16",16266.23,16424.85,16266.23,16424.85,94650000],["2014-04-17",16424.14,16408.54,16368.14,16460.49,136190000],["2014-04-21",16408.92,16449.25,16402.08,16459.78,79500000],["2014-04-22",16449.38,16514.37,16449.38,16565.71,84830000],["2014-04-23",16513.73,16501.65,16477.28,16525.99,76830000],["2014-04-24",16503.39,16501.65,16452.3,16541.26,80340000],["2014-04-25",16503.26,16361.46,16333.78,16503.26,90630000],["2014-04-28",16363.2,16448.74,16312.66,16500.37,105510000],["2014-04-29",16451.18,16535.37,16451.18,16559.39,71240000],["2014-04-30",16534.86,16580.84,16510.87,16592.28,92970000],["2014-05-01",16580.26,16558.87,16525.25,16604.79,75627353],["2014-05-02",16562.34,16512.89,16488.31,16620.06,78910000],["2014-05-05",16509.75,16530.55,16377.09,16547.92,70320000],["2014-05-06",16529.85,16401.02,16399.99,16529.85,74340000],["2014-05-07",16401.66,16518.54,16357.35,16522.94,93870000],["2014-05-08",16518.16,16550.97,16502.01,16622.95,75620000],["2014-05-09",16551.23,16583.34,16498.71,16588.77,74980000],["2014-05-12",16584.82,16695.47,16584.82,16704.84,71550000],["2014-05-13",16695.92,16715.44,16695.92,16735.51,71340000],["2014-05-14",16716.08,16613.97,16595,16717.56,71970000],["2014-05-15",16613.52,16446.81,16397.46,16622.9,106610000],["2014-05-16",16447.32,16491.31,16414.32,16498.99,119330000],["2014-05-19",16490.35,16511.86,16442.12,16526.26,82180000],["2014-05-20",16511.22,16374.31,16341.3,16511.22,75150000],["2014-05-21",16376.17,16533.06,16376.17,16544.6,76730000],["2014-05-22",16532.74,16543.08,16489.61,16565.39,59250000],["2014-05-23",16544.49,16606.27,16544.49,16613.07,61340000],["2014-05-27",16607.42,16675.5,16607.42,16688.69,80870000],["2014-05-28",16674.98,16633.18,16620.22,16674.98,62480000],["2014-05-29",16637.74,16698.74,16620.43,16698.74,55500000],["2014-05-30",16697.33,16717.17,16648.85,16721.22,105190000],["2014-06-02",16716.85,16743.63,16682.07,16756.64,57560000],["2014-06-03",16736.7,16722.34,16690.01,16736.7,67830000],["2014-06-04",16720,16737.53,16673.65,16742.91,65570000],["2014-06-05",16739.14,16836.11,16709.95,16845.81,70460000],["2014-06-06",16839.64,16924.28,16839.64,16924.28,80530000],["2014-06-09",16926.08,16943.1,16912.92,16970.17,67130000],["2014-06-10",16940.4,16945.92,16897.44,16946.34,64560000],["2014-06-11",16943.16,16843.88,16821.85,16943.16,61860000],["2014-06-12",16840.48,16734.19,16703.73,16841.57,72560000],["2014-06-13",16734.64,16775.74,16718.6,16787.89,95220000],["2014-06-16",16765.56,16781.01,16722.86,16802.14,77900000],["2014-06-17",16779.21,16808.49,16732.91,16823.55,63530000],["2014-06-18",16806.12,16906.62,16755.29,16911.41,73720000],["2014-06-19",16909.9,16921.46,16858.88,16923.43,80220000],["2014-06-20",16920.62,16947.08,16920.62,16978.02,247350000],["2014-06-23",16946.5,16937.26,16896.09,16954.27,63640000],["2014-06-24",16934.62,16818.13,16805.23,16969.7,80220000],["2014-06-25",16817.68,16867.51,16799.41,16883.54,73920000],["2014-06-26",16866.81,16846.13,16746.09,16872.52,63650000],["2014-06-27",16846.9,16851.84,16773.84,16862.73,137690000],["2014-06-30",16852.49,16826.6,16801.94,16871.27,90360000],["2014-07-01",16828.53,16956.07,16828.53,16998.7,74050000],["2014-07-02",16949.71,16976.24,16949.71,16986.63,57840000],["2014-07-03",16979,17068.26,16979,17074.65,66800000],["2014-07-07",17063.83,17024.21,16992.45,17063.83,61480000],["2014-07-08",17022.09,16906.62,16874.79,17022.09,75250000],["2014-07-09",16916.83,16985.61,16913.81,16998.95,67120000],["2014-07-10",16980.35,16915.07,16805.38,16980.35,67510000],["2014-07-11",16918.31,16943.81,16860.3,16949.46,61000000],["2014-07-14",16950.93,17055.42,16950.93,17088.43,60570000],["2014-07-15",17055.03,17060.68,17006.39,17120.34,101730000],["2014-07-16",17061.91,17138.2,17061.91,17139.35,111500000],["2014-07-17",17133.45,16976.81,16966.19,17151.56,99240000],["2014-07-18",16978.16,17100.18,16977.52,17113.51,112530379],["2014-07-21",17095.11,17051.73,16974.34,17095.11,67590000],["2014-07-22",17054.97,17113.54,17040.13,17133.43,77960000],["2014-07-23",17117.01,17086.63,17058.05,17121.05,73440000],["2014-07-24",17092.02,17083.8,17061.07,17119.83,66390000],["2014-07-25",17079.5,16960.57,16915.65,17082.33,67290000],["2014-07-28",16956.91,16982.59,16877.72,17001.38,66190000],["2014-07-29",16984.33,16912.11,16912.11,17056.46,75980000],["2014-07-30",16920.11,16880.36,16817.16,16983.94,77750000],["2014-07-31",16869.63,16563.3,16563.3,16869.63,101670000],["2014-08-01",16561.7,16493.37,16437.07,16584.75,84860000],["2014-08-04",16493.72,16569.28,16447.2,16596.22,76260000],["2014-08-05",16559.97,16429.47,16369.55,16559.97,76630000],["2014-08-06",16425.1,16443.34,16372.32,16490.7,78600000],["2014-08-07",16448.29,16368.27,16333.78,16504.35,80430000],["2014-08-08",16369.68,16553.93,16364.22,16556.59,82420000],["2014-08-11",16557.27,16569.98,16557.27,16627.99,65560000],["2014-08-12",16565.55,16560.54,16518.06,16589.31,62630000],["2014-08-13",16567.54,16651.8,16567.54,16670.29,66020000],["2014-08-14",16657.32,16713.58,16651.67,16714.22,62370000],["2014-08-15",16717.01,16662.91,16575.42,16775.27,109180000],["2014-08-18",16664.45,16838.74,16664.45,16840.28,75670000],["2014-08-19",16839.06,16919.59,16839.06,16929.13,67220000],["2014-08-20",16910.03,16979.13,16896.55,16994.89,61960000],["2014-08-21",16983.88,17039.49,16983.88,17074.59,65160000],["2014-08-22",17038.27,17001.22,16984.52,17064.28,64330000],["2014-08-25",17011.81,17076.87,17011.81,17124.74,57400000],["2014-08-26",17079.57,17106.7,17079.57,17153.8,50710000],["2014-08-27",17111.03,17122.01,17090.61,17134.6,61690000],["2014-08-28",17119.06,17079.57,17018.33,17119.06,51860000],["2014-08-29",17083.42,17098.45,17035.38,17110.42,81500000],["2014-09-02",17097.42,17067.56,17009.07,17113.51,64820000],["2014-09-03",17067.24,17078.28,17060.21,17151.89,62770000],["2014-09-04",17083.61,17069.58,17030.12,17161.55,68120000],["2014-09-05",17065.89,17137.36,17009.62,17137.36,76630000],["2014-09-08",17131.71,17111.42,17079.17,17137.88,65640000],["2014-09-09",17110.39,17013.87,16993.29,17111.55,69030000],["2014-09-10",17016.05,17068.71,16974.57,17080.27,76780000],["2014-09-11",17057.41,17049,16983.88,17057.41,63650000],["2014-09-12",17044.05,16987.51,16937.67,17044.05,82820000],["2014-09-15",16988.76,17031.14,16951.38,17051.85,71740000],["2014-09-16",17027.16,17131.97,16985.55,17167.05,73200000],["2014-09-17",17131.01,17156.85,17089.01,17221.11,87810000],["2014-09-18",17163.73,17265.99,17163.73,17275.37,85300000],["2014-09-19",17267.21,17279.74,17257.46,17350.64,349620000],["2014-09-22",17271.71,17172.68,17159.36,17277.88,74300000],["2014-09-23",17165.91,17055.87,17055.87,17171.88,77090000],["2014-09-24",17056.64,17210.06,17033.93,17226.6,80530000],["2014-09-25",17204.86,16945.8,16945.8,17204.86,93520000],["2014-09-26",16948.62,17113.15,16948.11,17148.15,74670000],["2014-09-29",17107.69,17071.22,16934.43,17107.69,70220000],["2014-09-30",17070.45,17042.9,17017.11,17145.1,102290000],["2014-10-01",17040.46,16804.71,16776.13,17041.16,104240000],["2014-10-02",16808.27,16801.05,16674.04,16857.25,75490000],["2014-10-03",16802.2,17009.69,16802.2,17027.84,87940000],["2014-10-06",17010.34,16991.91,16930.38,17099.39,655449984],["2014-10-07",16988.25,16719.39,16715.79,16988.25,79420000],["2014-10-08",16718.65,16994.22,16663.26,17006.91,106930000],["2014-10-09",16989.37,16659.25,16649.04,16989.37,93210000],["2014-10-10",16654.88,16544.1,16543.91,16757.6,136370000],["2014-10-13",16535.43,16321.07,16310.47,16602.41,107830000],["2014-10-14",16321.9,16315.19,16273.64,16463.67,110410000],["2014-10-15",16313.3,16141.74,15855.12,16313.3,160380000],["2014-10-16",16137.14,16117.24,15935.22,16211.12,131670000],["2014-10-17",16118.39,16380.41,16118.39,16427.38,137910000],["2014-10-20",16373.15,16399.67,16260.54,16401.63,94320000],["2014-10-21",16406.03,16614.81,16405.77,16620.78,105110000],["2014-10-22",16615.26,16461.32,16459.85,16653.89,92050000],["2014-10-23",16468.07,16677.9,16468.07,16767.52,99420000],["2014-10-24",16677.04,16805.41,16649.72,16811.71,90400000],["2014-10-27",16796.1,16817.94,16729.83,16836.98,72580000],["2014-10-28",16825.19,17005.75,16825.19,17006.45,83870000],["2014-10-29",17005.07,16974.31,16895.38,17065.5,76450000],["2014-10-30",16968.14,17195.42,16920.76,17223.96,80180000],["2014-10-31",17208.78,17390.52,17208.78,17395.54,121610000],["2014-11-03",17390.9,17366.24,17339.85,17410.65,80030000],["2014-11-04",17368.81,17383.84,17278.36,17397.23,81390000],["2014-11-05",17385.76,17484.53,17385.76,17486.59,76030000],["2014-11-06",17491.66,17554.47,17440.35,17560.31,70670000],["2014-11-07",17558.58,17573.93,17493.37,17575.33,82860000],["2014-11-10",17568.98,17613.74,17547.51,17621.87,71430000],["2014-11-11",17615.64,17614.9,17584.94,17638.21,52880000],["2014-11-12",17604.75,17612.2,17536.17,17626.71,75980000],["2014-11-13",17618.69,17652.79,17583.88,17705.48,80540000],["2014-11-14",17653.11,17634.74,17613.2,17664.15,72850000],["2014-11-17",17631.85,17647.75,17606.81,17675.07,70330000],["2014-11-18",17643.09,17687.82,17642.03,17735.71,87420000],["2014-11-19",17685.51,17685.73,17624.5,17712.26,73780000],["2014-11-20",17677.32,17719,17603.89,17720.44,77740000],["2014-11-21",17721.02,17810.06,17721.02,17894.83,140940000],["2014-11-24",17812.63,17817.9,17793.19,17855.27,85510000],["2014-11-25",17819.05,17814.94,17790.89,17854.73,88190000],["2014-11-26",17812.25,17827.75,17791.16,17833.76,67450000],["2014-11-28",17830.55,17828.24,17807.78,17893.42,80470000],["2014-12-01",17827.27,17776.8,17726.55,17827.27,86390000],["2014-12-02",17778.85,17879.55,17778.85,17897.05,81970000],["2014-12-03",17880.9,17912.62,17855.59,17924.15,99400000],["2014-12-04",17910.02,17900.1,17814.81,17937.96,76270000],["2014-12-05",17903.05,17958.79,17903.05,17991.19,79110000],["2014-12-08",17954,17852.48,17804,17960,88680000],["2014-12-09",17847.37,17801.2,17629.57,17847.37,100400000],["2014-12-10",17797.99,17533.15,17508.1,17797.99,115100000],["2014-12-11",17534.3,17596.34,17534.3,17758.51,90100000],["2014-12-12",17590.05,17280.83,17280.83,17590.05,121950000],["2014-12-15",17285.74,17180.84,17115.28,17403.54,114050000],["2014-12-16",17173.07,17068.87,17067.59,17427.44,116640000],["2014-12-17",17069.16,17356.87,17069.16,17389.3,118220000],["2014-12-18",17367.85,17778.15,17367.85,17778.4,123940000],["2014-12-19",17778.02,17804.8,17746.55,17874.03,343689984],["2014-12-22",17812.25,17959.44,17812.25,17962.78,98460000],["2014-12-23",17971.51,18024.17,17970.16,18069.22,82890000],["2014-12-24",18035.73,18030.21,18027.78,18086.24,42870000],["2014-12-26",18038.3,18053.71,18038.3,18103.45,52570000],["2014-12-29",18046.58,18038.23,18021.57,18073.04,53870000],["2014-12-30",18035.02,17983.07,17959.7,18035.02,47490000],["2014-12-31",17987.66,17823.07,17820.88,18043.22,82840000],["2015-01-02",17823.07,17832.99,17731.3,17951.78,76270000],["2015-01-05",17821.3,17501.65,17475.93,17821.3,116160000],["2015-01-06",17504.18,17371.64,17262.37,17581.05,101870000],["2015-01-07",17374.78,17584.52,17374.78,17597.08,91030000],["2015-01-08",17591.97,17907.87,17591.97,17916.04,114890000],["2015-01-09",17911.02,17737.37,17686.09,17915.32,93390000],["2015-01-12",17742.05,17640.84,17571.58,17793.88,92500000],["2015-01-13",17645.02,17613.68,17498.23,17923.01,99360000],["2015-01-14",17609.06,17427.09,17264.9,17609.06,109180000],["2015-01-15",17436.3,17320.71,17298.04,17517.41,94520000],["2015-01-16",17320,17511.57,17243.55,17528.37,140480000],["2015-01-20",17516.96,17515.23,17346.73,17588.7,119600000],["2015-01-21",17509.96,17554.28,17396.04,17599.58,95530000],["2015-01-22",17557.29,17813.98,17482.54,17840.89,111980000],["2015-01-23",17812.5,17672.6,17667.53,17812.5,97110000],["2015-01-26",17668.11,17678.7,17567.6,17696.36,87220000],["2015-01-27",17638.53,17387.21,17288.31,17638.53,135940000],["2015-01-28",17402.91,17191.37,17189,17484.41,115980000],["2015-01-29",17195.29,17416.85,17136.3,17433.13,111690000],["2015-01-30",17416.85,17164.95,17156.82,17419.9,168560000],["2015-02-02",17169.99,17361.04,17037.76,17367.68,108090000],["2015-02-03",17369.97,17666.4,17369.97,17670.76,112860000],["2015-02-04",17664.99,17673.02,17603.21,17782.22,102560000],["2015-02-05",17677.26,17884.88,17677.26,17889.58,79890000],["2015-02-06",17881.54,17824.29,17764.4,17951.09,93610000],["2015-02-09",17821.49,17729.21,17685.32,17821.49,81590000],["2015-02-10",17736.15,17868.76,17729.24,17890.34,89930000],["2015-02-11",17867.86,17862.14,17759.65,17897.21,89890000],["2015-02-12",17862.14,17972.38,17862.14,17975.65,117160000],["2015-02-13",17968.65,18019.35,17961.76,18037.41,85230000],["2015-02-17",18019.8,18047.58,17951.41,18052.01,98760000],["2015-02-18",18045.72,18029.85,17982.2,18048.7,75090000],["2015-02-19",18028.67,17985.77,17924.6,18028.67,79130000],["2015-02-20",17985.77,18140.44,17878.37,18144.29,111390000],["2015-02-23",18140.76,18116.84,18054.84,18141.21,83670000],["2015-02-24",18112.57,18209.19,18098.73,18231.09,79310000],["2015-02-25",18208.67,18224.57,18182.76,18244.38,80480000],["2015-02-26",18224.41,18214.42,18157.07,18239.43,81500000],["2015-02-27",18213.26,18132.7,18132.38,18213.26,101110000],["2015-03-02",18134.05,18288.63,18122.59,18288.63,89790000],["2015-03-03",18281.95,18203.37,18136.88,18281.95,83830000],["2015-03-04",18203.37,18096.9,18029.5,18203.37,80900000],["2015-03-05",18096.9,18135.72,18087.65,18160.35,75840000],["2015-03-06",18135.72,17856.78,17825.15,18135.72,113350000],["2015-03-09",17856.56,17995.72,17856.56,18031.04,85820000],["2015-03-10",17989.56,17662.94,17662.94,17989.56,120450000],["2015-03-11",17662.94,17635.39,17627,17731.78,102120000],["2015-03-12",17626.84,17895.22,17620.49,17900.1,111550000],["2015-03-13",17889.05,17749.31,17629.89,17889.05,113620000],["2015-03-16",17751.24,17977.42,17751.24,17988.5,101760000],["2015-03-17",17972.22,17849.08,17785.79,17972.22,82560000],["2015-03-18",17846.8,18076.19,17697.52,18097.12,130950000],["2015-03-19",18072.58,17959.03,17934.24,18072.99,107820000],["2015-03-20",17961.13,18127.65,17961.13,18197.29,333870016],["2015-03-23",18136.73,18116.04,18116.04,18205.93,98030000],["2015-03-24",18110.87,18011.14,18010.44,18149.24,87190000],["2015-03-25",18012.61,17718.54,17718.54,18041.97,106560000],["2015-03-26",17716.27,17678.23,17579.27,17759.51,117740000],["2015-03-27",17673.63,17712.66,17630.49,17729.14,103220000],["2015-03-30",17727.48,17976.31,17727.48,18008.64,104040000],["2015-03-31",17965.37,17776.12,17773.02,17965.37,119470000],["2015-04-01",17778.52,17698.18,17585.01,17778.52,103360000],["2015-04-02",17699.52,17763.24,17673.49,17815.03,87370000],["2015-04-06",17755.5,17880.85,17646.8,17941.79,100850000],["2015-04-07",17884.32,17875.42,17871.21,17983.12,72150000],["2015-04-08",17877.62,17902.51,17822.23,17976.2,76820000],["2015-04-09",17902.51,17958.73,17823.1,17984.22,86740000],["2015-04-10",17956.73,18057.65,17945.55,18066.76,116410000],["2015-04-13",18052.32,17977.04,17974.81,18107.57,120090000],["2015-04-14",17979.11,18036.7,17905.48,18075.6,82830000],["2015-04-15",18045.71,18112.61,18045.71,18160.52,113610000],["2015-04-16",18106.27,18105.77,18063.86,18169.26,89520000],["2015-04-17",18102.56,17826.3,17748.53,18102.56,138860000],["2015-04-20",17841.18,18034.93,17841.18,18092.22,103160000],["2015-04-21",18034.23,17949.59,17929.63,18109.7,95180000],["2015-04-22",17950.82,18038.27,17887.76,18056.02,91260000],["2015-04-23",18031.9,18058.69,17966.77,18133.03,100240000],["2015-04-24",18056.42,18080.14,18009.08,18108.87,119130000],["2015-04-27",18097.89,18037.97,18024.66,18175.56,121110000],["2015-04-28",18035.9,18110.14,17917.36,18119.65,124930000],["2015-04-29",18093.69,18035.53,17953.69,18096.46,101980000],["2015-04-30",18033.33,17840.52,17774.89,18033.33,129180000],["2015-05-01",17859.27,18024.06,17859.27,18028.89,91700000],["2015-05-04",18026.02,18070.4,18026.02,18133.76,86010000],["2015-05-05",18062.53,17928.2,17905.71,18086.01,95340000],["2015-05-06",17934.81,17841.98,17733.12,18019.75,100430000],["2015-05-07",17840.25,17924.06,17796.94,17973.07,80920000],["2015-05-08",17933.64,18191.11,17933.64,18205.23,94960000],["2015-05-11",18187.78,18191.11,18089.11,18199.95,86050000],["2015-05-12",18096.16,18068.23,17924.8,18119.18,89270000],["2015-05-13",18070.37,18060.49,18039.2,18132.79,85180000],["2015-05-14",18062.49,18252.24,18116.51,18299.31,91580000],["2015-05-15",18251.97,18272.56,18215.07,18272.72,108220000],["2015-05-18",18267.25,18298.88,18244.26,18325.54,79080000],["2015-05-19",18300.48,18312.39,18261.35,18351.36,87200000],["2015-05-20",18315.06,18285.4,18272.56,18350.13,80190000],["2015-05-21",18285.87,18285.74,18249.9,18314.89,84270000],["2015-05-22",18286.87,18232.02,18217.14,18286.87,78890000],["2015-05-26",18229.75,18041.54,17990.02,18229.75,109440000],["2015-05-27",18045.08,18162.99,18045.08,18190.35,96400000],["2015-05-28",18154.14,18126.12,18066.4,18154.14,67510000],["2015-05-29",18128.12,18010.68,17967.74,18128.12,139810000],["2015-06-01",18017.82,18040.37,17982.06,18105.83,85640000],["2015-06-02",18033.33,18011.94,17925.33,18091.87,77550000],["2015-06-03",18018.42,18076.27,18010.42,18168.09,73120000],["2015-06-04",18072.47,17905.58,17876.95,18087.15,93470000],["2015-06-05",17905.38,17849.46,17822.9,17940.78,89140000],["2015-06-08",17849.46,17766.55,17760.61,17852.35,86300000],["2015-06-09",17766.95,17764.04,17714.97,17817.83,90550000],["2015-06-10",17765.38,18000.4,17765.38,18045.14,96980000],["2015-06-11",18001.27,18039.37,18001.27,18109.77,89490000],["2015-06-12",18035.83,17898.84,17857.07,18035.83,83760000],["2015-06-15",17890.76,17791.17,17698.42,17890.76,91920000],["2015-06-16",17787.43,17904.48,17774.12,17919.62,77510000],["2015-06-17",17909.58,17935.74,17839.65,17998,92410000],["2015-06-18",17944.61,18115.84,17944.61,18174.73,94460000],["2015-06-19",18116.24,18015.95,18010.58,18117.71,251650000],["2015-06-22",18027.63,18119.78,18027.63,18181.67,77780000],["2015-06-23",18121.78,18144.07,18108.1,18188.81,75970000],["2015-06-24",18139.1,17966.07,17966.07,18139.1,104980000],["2015-06-25",17977.11,17890.36,17890.36,18036.1,78990000],["2015-06-26",17892.03,17946.68,17892.03,18013.15,158120000],["2015-06-29",17936.74,17596.35,17590.55,17936.74,116340000],["2015-06-30",17599.96,17619.51,17576.5,17714.66,126460000],["2015-07-01",17638.12,17757.91,17638.12,17801.83,87010000],["2015-07-02",17763.32,17730.11,17687.52,17825.49,83080000],["2015-07-06",17728.08,17683.58,17564.36,17734.36,90130000],["2015-07-07",17684.92,17776.91,17465.68,17793.45,105840000],["2015-07-08",17759.01,17515.42,17496.22,17759.01,69830000],["2015-07-09",17530.38,17548.62,17530.38,17764.85,100520000],["2015-07-10",17561.12,17760.41,17561.12,17797.49,85800000],["2015-07-13",17787.27,17977.68,17787.27,17987.57,86380000],["2015-07-14",17974.61,18053.58,17956.17,18072.82,76740000],["2015-07-15",18053.38,18050.17,18010.15,18090.39,80460000],["2015-07-16",18078.16,18120.25,18065.33,18131.61,85030000],["2015-07-17",18117.58,18086.45,18032.06,18121.12,106510000],["2015-07-20",18085.91,18100.41,18064.5,18137.12,75060000],["2015-07-21",18096.67,17919.29,17868.34,18096.67,100170000],["2015-07-22",17918.35,17851.04,17807.41,17919.35,112370000],["2015-07-23",17853.78,17731.92,17705.03,17860.95,88600000],["2015-07-24",17731.05,17568.53,17553.73,17756.54,103470000],["2015-07-27",17561.78,17440.59,17399.17,17561.78,117860000],["2015-07-28",17449.81,17630.27,17449.81,17650.07,103450000],["2015-07-29",17631.4,17751.39,17629.2,17776.78,93140000],["2015-07-30",17743.24,17745.98,17640.85,17761.25,76650000],["2015-07-31",17755.87,17689.86,17671.59,17783.59,106120000],["2015-08-03",17696.74,17598.2,17496.61,17704.76,87880000],["2015-08-04",17596.93,17550.69,17505.5,17635.78,99060000],["2015-08-05",17555.24,17540.47,17492.9,17661.37,102450000],["2015-08-06",17542.61,17419.75,17362.86,17572.04,96170000],["2015-08-07",17414.94,17373.38,17279.08,17414.94,81800000],["2015-08-10",17375.18,17615.17,17375.18,17629.13,92430000],["2015-08-11",17593.59,17402.84,17352.63,17593.59,103010000],["2015-08-12",17382.93,17402.51,17125.81,17423.9,120400000],["2015-08-13",17401.64,17408.25,17341.34,17481.78,88550000],["2015-08-14",17410.12,17477.4,17394.06,17492.9,82120000],["2015-08-17",17472.66,17545.18,17341.72,17551.4,73380000],["2015-08-18",17537.3,17511.34,17486.42,17568.4,79900000],["2015-08-19",17508.74,17348.73,17282.42,17517.19,104720000],["2015-08-20",17345.32,16990.69,16990.69,17345.32,128530000],["2015-08-21",16990.69,16459.75,16459.55,16990.69,225170000],["2015-08-24",16459.75,15871.35,15370.33,16459.75,293920000],["2015-08-25",15882.27,15666.44,15651.24,16312.94,213220000],["2015-08-26",15676.26,16285.51,15676.26,16303.75,208420000],["2015-08-27",16285.51,16654.77,16285.51,16666.69,171980000],["2015-08-28",16649.42,16643.01,16535.18,16669.97,131790000],["2015-08-31",16632.02,16528.03,16444.05,16632.02,141440000],["2015-09-01",16528.03,16058.35,15979.95,16528.03,171390000],["2015-09-02",16058.35,16351.38,16058.35,16352.58,133480000],["2015-09-03",16364.34,16374.76,16317.31,16550.07,109730000],["2015-09-04",16341.16,16102.38,16003.83,16341.16,159470000],["2015-09-08",16109.93,16492.68,16109.93,16503.41,123870000],["2015-09-09",16505.04,16253.57,16220.1,16664.65,118790000],["2015-09-10",16252.57,16330.4,16212.08,16441.94,122690000],["2015-09-11",16330.4,16433.09,16244.65,16434.76,104630000],["2015-09-14",16450.86,16370.96,16330.87,16450.86,92660000],["2015-09-15",16382.58,16599.85,16382.58,16644.11,93050000],["2015-09-16",16599.51,16739.95,16593.9,16755.98,99620000],["2015-09-17",16738.08,16674.74,16639.93,16933.43,129600000],["2015-09-18",16674.74,16384.58,16343.76,16674.74,341689984],["2015-09-21",16406.1,16510.19,16391.88,16578.6,90730000],["2015-09-22",16477.45,16330.47,16221.73,16477.45,119010000],["2015-09-23",16332.81,16279.89,16211.98,16355.29,86030000],["2015-09-24",16257.11,16201.32,16016.36,16257.11,122220000],["2015-09-25",16205.07,16314.67,16205.07,16465.23,130790000],["2015-09-28",16313.26,16001.89,15981.85,16313.26,139930000],["2015-09-29",16001.76,16049.13,15942.37,16118.89,121160000],["2015-09-30",16057.08,16284.7,16057.08,16297.6,145740000],["2015-10-01",16278.62,16272.01,16073.82,16348.87,111420000],["2015-10-02",16258.25,16472.37,16013.66,16472.77,136890000],["2015-10-05",16502.1,16776.43,16502.1,16798.37,127660000],["2015-10-06",16774.02,16790.19,16746.03,16865.09,120010000],["2015-10-07",16805.42,16912.29,16765,16963.3,115690000],["2015-10-08",16904.17,17050.75,16859.34,17081.28,100730000],["2015-10-09",17054.69,17084.49,17027.23,17110.88,103730000],["2015-10-12",17082.29,17131.86,17064.58,17139.21,72500000],["2015-10-13",17113.55,17081.89,17034.45,17172.81,99400000],["2015-10-14",17079.08,16924.75,16887.67,17111.38,120110000],["2015-10-15",16944.86,17141.75,16933.57,17144.42,122960000],["2015-10-16",17141.75,17215.97,17107.35,17220.02,145880000],["2015-10-19",17209.43,17230.54,17129.19,17235.95,118430000],["2015-10-20",17228.47,17217.11,17147.99,17264.88,106670000],["2015-10-21",17225.93,17168.61,17153.13,17314.99,107100000],["2015-10-22",17180.88,17489.16,17180.88,17505.18,152420000],["2015-10-23",17525.11,17646.7,17525.11,17679.37,158090000],["2015-10-26",17649.57,17623.05,17602.51,17660.7,116660000],["2015-10-27",17608.89,17581.43,17540.57,17635.18,113960000],["2015-10-28",17586.69,17779.52,17556.71,17779.95,115630000],["2015-10-29",17771.5,17755.8,17684.72,17786,90300000],["2015-10-30",17756.6,17663.54,17662.87,17799.96,149250000],["2015-11-02",17672.62,17828.76,17655.02,17845.9,100840000],["2015-11-03",17819.74,17918.15,17796.02,17977.85,92290000],["2015-11-04",17929.58,17867.58,17828.83,17964.12,99890000],["2015-11-05",17871.25,17863.43,17779.19,17929.51,98910000],["2015-11-06",17855.22,17910.33,17768.6,17912.04,107450000],["2015-11-09",17900.78,17730.48,17667.78,17900.78,121210000],["2015-11-10",17724.13,17758.21,17657.72,17768.66,108640000],["2015-11-11",17769.5,17702.22,17696.91,17807.18,95230000],["2015-11-12",17691.93,17448.07,17443.5,17691.93,113660000],["2015-11-13",17439.25,17245.24,17238.89,17439.25,134640000],["2015-11-16",17229.94,17483.01,17210.43,17483.01,137590000],["2015-11-17",17486.99,17489.5,17451.41,17599.33,167190000],["2015-11-18",17485.49,17737.16,17485.49,17752.16,106810000],["2015-11-19",17739.83,17732.75,17681.98,17772.97,114630000],["2015-11-20",17732.75,17823.81,17732.75,17914.34,153140000],["2015-11-23",17823.61,17792.68,17751.53,17868.18,134680000],["2015-11-24",17770.9,17812.19,17683.51,17862.6,127170000],["2015-11-25",17820.81,17813.39,17801.83,17854.92,82540000],["2015-11-27",17806.04,17813.39,17749.32,17830.36,82540000],["2015-11-30",17802.84,17719.92,17719.79,17837.24,155560000],["2015-12-01",17719.72,17888.35,17719.72,17895.5,103880000],["2015-12-02",17883.14,17729.68,17708.2,17901.58,102860000],["2015-12-03",17741.57,17477.67,17425.56,17780.59,126990000],["2015-12-04",17482.68,17847.63,17482.68,17866.47,137650000],["2015-12-07",17845.49,17730.51,17639.25,17845.49,99670000],["2015-12-08",17703.99,17568,17485.39,17703.99,113720000],["2015-12-09",17558.18,17492.3,17403.51,17767.69,122020000],["2015-12-10",17493.17,17574.75,17474.66,17697.74,107310000],["2015-12-11",17574.75,17265.21,17230.5,17574.75,134510000],["2015-12-14",17277.11,17368.5,17138.47,17378.02,142540000],["2015-12-15",17374.78,17524.91,17341.18,17627.63,123430000],["2015-12-16",17530.85,17749.09,17483.68,17784.36,123790000],["2015-12-17",17756.54,17495.84,17493.5,17796.76,115780000],["2015-12-18",17495.04,17128.55,17124.31,17496.58,344560000],["2015-12-21",17154.94,17251.62,17116.73,17272.36,114910000],["2015-12-22",17253.55,17417.27,17242.86,17451.11,91570000],["2015-12-23",17427.63,17602.61,17427.63,17607.92,92820000],["2015-12-24",17593.26,17552.17,17543.95,17606.34,40350000],["2015-12-28",17535.66,17528.27,17437.34,17536.9,59770000],["2015-12-29",17547.37,17720.98,17547.37,17750.02,69860000],["2015-12-30",17711.94,17603.87,17588.87,17714.13,59760000],["2015-12-31",17590.66,17425.03,17421.16,17590.66,93690000],["2016-01-04",17405.48,17148.94,16957.63,17405.48,148060000],["2016-01-05",17147.5,17158.66,17038.61,17195.84,105750000],["2016-01-06",17154.83,16906.51,16817.62,17154.83,120250000],["2016-01-07",16888.36,16514.1,16463.63,16888.36,176240000],["2016-01-08",16519.17,16346.45,16314.57,16651.89,141850000],["2016-01-11",16358.71,16398.57,16232.03,16461.85,127790000],["2016-01-12",16419.11,16516.22,16322.07,16591.35,117480000],["2016-01-13",16526.63,16151.41,16123.2,16593.51,153530000],["2016-01-14",16159.01,16379.05,16075.12,16482.05,158830000],["2016-01-15",16354.33,15988.08,15842.11,16354.33,239210000],["2016-01-19",16009.45,16016.02,15900.25,16171.96,144360000],["2016-01-20",15989.45,15766.74,15450.56,15989.45,191870000],["2016-01-21",15768.87,15882.68,15704.66,16038.59,145140000],["2016-01-22",15921.1,16093.51,15921.1,16136.79,145850000],["2016-01-25",16086.46,15885.22,15880.15,16086.46,123250000],["2016-01-26",15893.16,16167.23,15893.16,16185.79,118210000],["2016-01-27",16168.74,15944.46,15878.3,16235.03,138350000],["2016-01-28",15960.28,16069.64,15863.72,16102.14,130120000],["2016-01-29",16090.26,16466.3,16090.26,16466.3,217940000],["2016-02-01",16453.63,16449.18,16299.47,16510.98,114450000],["2016-02-02",16420.21,16153.54,16108.44,16420.21,126210000],["2016-02-03",16186.2,16336.66,15960.45,16381.69,141870000],["2016-02-04",16329.67,16416.58,16266.16,16485.84,131490000],["2016-02-05",16417.95,16204.97,16129.81,16423.63,139010000],["2016-02-08",16147.51,16027.05,15803.55,16147.51,165880000],["2016-02-09",16005.41,16014.38,15881.11,16136.62,127740000],["2016-02-10",16035.61,15914.74,15899.91,16201.89,122290000],["2016-02-11",15897.82,15660.18,15503.01,15897.82,172070000],["2016-02-12",15691.62,15973.84,15691.62,15974.04,132550000],["2016-02-16",16012.39,16196.41,16012.39,16196.41,142030000],["2016-02-17",16217.98,16453.83,16217.98,16486.12,124080000],["2016-02-18",16483.76,16413.43,16390.43,16511.84,104950000],["2016-02-19",16410.96,16391.99,16278,16410.96,134340000],["2016-02-22",16417.13,16620.66,16417.13,16664.24,102240000],["2016-02-23",16610.39,16431.78,16403.53,16610.39,98170000],["2016-02-24",16418.84,16484.99,16165.86,16507.39,93620000],["2016-02-25",16504.38,16697.29,16458.42,16697.98,94120000],["2016-02-26",16712.7,16639.97,16623.91,16795.98,98480000],["2016-02-29",16634.15,16516.5,16510.4,16726.12,126220000],["2016-03-01",16545.67,16865.08,16545.67,16865.56,105050000],["2016-03-02",16851.17,16899.32,16766.32,16900.17,104470000],["2016-03-03",16896.17,16943.9,16820.73,16944.31,91110000],["2016-03-04",16945,17006.77,16898.84,17062.38,106910000],["2016-03-07",16991.29,17073.95,16940.48,17099.25,100290000],["2016-03-08",17050.67,16964.1,16921.51,17072.79,108380000],["2016-03-09",16969.17,17000.36,16947.94,17048.5,116690000],["2016-03-10",17006.05,16995.13,16821.86,17130.11,117570000],["2016-03-11",17014.99,17213.31,17014.99,17220.09,123420000],["2016-03-14",17207.49,17229.13,17161.16,17275.07,96350000],["2016-03-15",17217.15,17251.53,17120.35,17251.7,92830000],["2016-03-16",17249.34,17325.76,17204.07,17379.18,118710000],["2016-03-17",17321.38,17481.49,17297.65,17529.01,117990000],["2016-03-18",17481.49,17602.3,17481.49,17620.58,321230016],["2016-03-21",17589.7,17623.87,17551.28,17644.97,84410000],["2016-03-22",17602.71,17582.57,17540.42,17648.94,95450000],["2016-03-23",17588.81,17502.59,17486.27,17588.81,84240000],["2016-03-24",17485.33,17515.73,17399.01,17517.14,84100000],["2016-03-28",17526.08,17535.39,17493.03,17583.81,70460000],["2016-03-29",17512.58,17633.11,17434.27,17642.81,86160000],["2016-03-30",17652.36,17716.66,17652.36,17790.11,79330000],["2016-03-31",17716.05,17685.09,17669.72,17755.7,102600000],["2016-04-01",17661.74,17792.75,17568.02,17811.48,104890000],["2016-04-04",17799.39,17737,17710.67,17806.38,85230000],["2016-04-05",17718.03,17603.32,17579.56,17718.03,115230000],["2016-04-06",17605.45,17716.05,17542.54,17723.55,99410000],["2016-04-07",17687.28,17541.96,17484.23,17687.28,90120000],["2016-04-08",17555.39,17576.96,17528.16,17694.51,79990000],["2016-04-11",17586.48,17556.41,17555.9,17731.63,107100000],["2016-04-12",17571.34,17721.25,17553.57,17744.43,81020000],["2016-04-13",17741.66,17908.28,17741.66,17918.35,91710000],["2016-04-14",17912.25,17926.43,17885.44,17962.14,84510000],["2016-04-15",17925.95,17897.46,17867.41,17937.65,118160000],["2016-04-18",17890.2,18004.16,17848.22,18009.53,89390000],["2016-04-19",18012.1,18053.6,17984.43,18103.46,89820000],["2016-04-20",18059.49,18096.27,18031.21,18167.63,100210000],["2016-04-21",18092.84,17982.52,17963.89,18107.29,102720000],["2016-04-22",17985.05,18003.75,17909.89,18026.85,134120000],["2016-04-25",17990.94,17977.24,17855.55,17990.94,83770000],["2016-04-26",17987.38,17990.32,17934.17,18043.77,92570000],["2016-04-27",17996.14,18041.55,17920.26,18084.66,109090000],["2016-04-28",18023.88,17830.76,17796.55,18035.73,100920000],["2016-04-29",17813.09,17773.64,17651.98,17814.83,136670000],["2016-05-02",17783.78,17891.16,17773.71,17912.35,80100000],["2016-05-03",17870.75,17750.91,17670.88,17870.75,97060000],["2016-05-04",17735.02,17651.26,17609.01,17738.06,95020000],["2016-05-05",17664.48,17660.71,17615.82,17736.11,81530000],["2016-05-06",17650.3,17740.63,17580.38,17744.54,80020000],["2016-05-09",17743.85,17705.91,17668.38,17783.16,85590000],["2016-05-10",17726.66,17928.35,17726.66,17934.61,75790000],["2016-05-11",17919.03,17711.12,17711.05,17919.03,87390000],["2016-05-12",17711.12,17720.5,17625.38,17798.19,88560000],["2016-05-13",17711.12,17535.32,17512.48,17734.74,86640000],["2016-05-16",17531.76,17710.71,17531.76,17755.8,88440000],["2016-05-17",17701.46,17529.98,17469.92,17701.46,103260000],["2016-05-18",17501.28,17526.62,17418.21,17636.22,79120000],["2016-05-19",17514.16,17435.4,17331.07,17514.16,95530000],["2016-05-20",17437.32,17500.94,17437.32,17571.75,111990000],["2016-05-23",17507.04,17492.93,17480.05,17550.7,87790000],["2016-05-24",17525.19,17706.05,17525.19,17742.59,86480000],["2016-05-25",17735.09,17851.51,17735.09,17891.71,79180000],["2016-05-26",17859.52,17828.29,17803.82,17888.66,68940000],["2016-05-27",17826.85,17873.22,17824.73,17873.22,73190000],["2016-05-31",17891.5,17787.2,17724.03,17899.24,147390000],["2016-06-01",17754.55,17789.67,17664.79,17809.18,78530000],["2016-06-02",17789.05,17838.56,17703.55,17838.56,75560000],["2016-06-03",17799.8,17807.06,17689.68,17833.17,82270000],["2016-06-06",17825.69,17920.33,17822.81,17949.68,71870000],["2016-06-07",17936.22,17938.28,17936.22,18003.23,78750000],["2016-06-08",17931.91,18005.05,17931.91,18016,71260000],["2016-06-09",17969.98,17985.19,17915.88,18005.22,69690000],["2016-06-10",17938.82,17865.34,17812.34,17938.82,90540000],["2016-06-13",17830.5,17732.48,17731.35,17893.28,101690000],["2016-06-14",17710.77,17674.82,17595.79,17733.92,93740000],["2016-06-15",17703.65,17640.17,17629.01,17762.96,94130000],["2016-06-16",17602.23,17733.1,17471.29,17754.91,91950000],["2016-06-17",17733.44,17675.16,17602.78,17733.44,248680000],["2016-06-20",17736.87,17804.87,17736.87,17946.36,99380000],["2016-06-21",17827.33,17829.73,17799.8,17877.84,85130000],["2016-06-22",17832.67,17780.83,17770.36,17920.16,89440000]];
	var data = splitData(rawData);

	myChart.setOption(option = {
		title: {
			text: '分散K线图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		animation: false,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross'
			},
			backgroundColor: 'rgba(245, 245, 245, 0.8)',
			borderWidth: 1,
			borderColor: '#ccc',
			padding: 10,
			textStyle: {
				color: '#000'
			},
			position: function (pos, params, el, elRect, size) {
				var obj = {top: 10};
				obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
				return obj;
			},
			extraCssText: 'width: 170px'
		},
		axisPointer: {
			link: {xAxisIndex: 'all'},
			label: {
				backgroundColor: '#777'
			}
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
				data: data.categoryData,
				scale: true,
				boundaryGap: false,
				axisLine: {onZero: false},
				splitLine: {show: false},
				splitNumber: 20,
				min: 'dataMin',
				max: 'dataMax',
				axisPointer: {
					z: 100
				}
			}
		],
		yAxis: [
			{
				scale: true,
				splitArea: {
					show: true
				}
			}
		],
		dataZoom : [
			{
				type: 'slider',
				show: true,
				start: 98,
				end: 100,
				minValueSpan: 10,
				height: 20
			}
		],
		series: [
			{
				name: '模拟数据',
				type: 'custom',
				renderItem: renderItem,
				dimensions: [null, '开始', '结束', '最低', '最高'],
				encode: {
					x: 0,
					y: [1, 2, 3, 4],
					tooltip: [1, 2, 3, 4]
				},
				data: data.values
			}
		]
	}, true);
	myChart.setOption(option);
}

//渲染雷达图区域
function stuffleidatuArea(){
	stuffleidatuOne();
	stuffleidatuTwo();
}

//雷达图1
function stuffleidatuOne(){
	var myChart = echarts.init(document.getElementById("leidatuOne"));
	option = {
		title: {
			text: '基础雷达图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		color:['rgb(21,167,188)','rgba(210,14,13,0.61)' ,'rgba(207,125,101,0.85)', 'rgba(97,160,168,0.87)', 'rgba(22,178,209,0.66)', '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
		tooltip: {},
		legend: {
			left: 'left',
			bottom:'bottom',
			top:'center',
			top:'20%',
			data: ['数据1', '数据2']
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '50%',
			containLabel: true
		},
		radar: {
			// shape: 'circle',
			name: {
				textStyle: {
					color: '#fff',
					backgroundColor: '#999',
					borderRadius: 3,
					padding: [3, 5]
				}
			},
			indicator: [
				{ name: '类别1', max: 6500},
				{ name: '类别2', max: 16000},
				{ name: '类别3', max: 30000},
				{ name: '类别4', max: 38000},
				{ name: '类别5', max: 52000},
				{ name: '类别6', max: 25000}
			]
		},
		series: [{
			name: '预算 vs 开销（Budget vs spending）',
			type: 'radar',
			// areaStyle: {normal: {}},
			data: [
				{
					value: [4300, 10000, 28000, 35000, 50000, 19000],
					name: '数据1'
				},
				{
					value: [5000, 14000, 28000, 31000, 42000, 21000],
					name: '数据2'
				}
			]
		}]
	};
	myChart.setOption(option);
}

//雷达图2
function stuffleidatuTwo(){
	var myChart = echarts.init(document.getElementById("leidatuTwo"));
	option = {
		title: {
			text: '占比雷达图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		tooltip: {
			trigger: 'item',
			backgroundColor: 'gray'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '50%',
			containLabel: true
		},
		legend: {
			type: 'scroll',
			bottom: 10,
			data: (function (){
				var list = [];
				for (var i = 1; i <=28; i++) {
					list.push(i + 2000 + '');
				}
				return list;
			})()
		},
		visualMap: {
			top: 'middle',
			right: 10,
			color: ['rgba(0,153,201,0.77)', 'rgba(224,14,13,0.7)'],
			calculable: true
		},
		radar: {
			indicator: [
				{ text: '类别1', max: 400},
				{ text: '类别12', max: 400},
				{ text: '类别3', max: 400},
				{ text: '类别14', max: 400},
				{ text: '类别5', max: 400}
			]
		},
		series: (function (){
			var series = [];
			for (var i = 1; i <= 28; i++) {
				series.push({
					name: '模拟数据',
					type: 'radar',
					symbol: 'none',
					lineStyle: {
						width: 1
					},
					emphasis: {
						areaStyle: {
							color: 'rgba(0,250,0,0.3)'
						}
					},
					data: [{
						value: [
							(40 - i) * 10,
							(38 - i) * 4 + 60,
							i * 5 + 10,
							i * 9,
							i * i /2
						],
						name: i + 2000 + ''
					}]
				});
			}
			return series;
		})()
	};
	myChart.setOption(option);
}

//渲染关系图区域
function stuffguanxituArea(){
	stuffguanxituOne();
	stuffguanxituTwo();
	stuffguanxituThree();
	stuffguanxituFour();
}

//关系图1
function stuffguanxituOne(){
	var myChart = echarts.init(document.getElementById("guanxituOne"));
	option = {
		title: {
			text: '基础关系图',
			textStyle: {
				color: 'rgba(96,173,197,0.96)',
				fontSize: '16'
			},
		},
		height:'340px',
		color:'rgba(45,164,202,0.87)',
		grid: {
			left: '3%',
			right: '4%',
			bottom: '50%',
			containLabel: true
		},
		tooltip: {},
		animationDurationUpdate: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [
			{
				type: 'graph',
				layout: 'none',
				zoom:0.7,
				symbolSize: 40,
				roam: true,
				label: {
					show: true
				},
				edgeSymbol: ['circle', 'arrow'],
				edgeSymbolSize: [4, 10],
				edgeLabel: {
					fontSize: 20
				},
				data: [{
					name: '节点1',
					x: 300,
					y: 300
				}, {
					name: '节点2',
					x: 800,
					y: 300
				}, {
					name: '节点3',
					x: 550,
					y: 100
				}, {
					name: '节点4',
					x: 550,
					y: 500
				}],
				// links: [],
				links: [{
					source: 0,
					target: 1,
					symbolSize: [5, 20],
					label: {
						show: true
					},
					lineStyle: {
						width: 5,
						curveness: 0.2
					}
				}, {
					source: '节点2',
					target: '节点1',
					label: {
						show: true
					},
					lineStyle: {
						curveness: 0.2
					}
				}, {
					source: '节点1',
					target: '节点3'
				}, {
					source: '节点2',
					target: '节点3'
				}, {
					source: '节点2',
					target: '节点4'
				}, {
					source: '节点1',
					target: '节点4'
				}],
				lineStyle: {
					opacity: 0.9,
					width: 2,
					curveness: 0
				}
			}
		]
	};
	myChart.setOption(option);
}

//关系图2
function stuffguanxituTwo(){
	var myChart = echarts.init(document.getElementById("guanxituTwo"));
	myChart.showLoading();
	$.get('mapJson/les-miserables.gexf', function (xml) {
		myChart.hideLoading();

		var graph = echarts.dataTool.gexf.parse(xml);
		var categories = [];
		for (var i = 0; i < 9; i++) {
			categories[i] = {
				name: '类目' + i
			};
		}
		graph.nodes.forEach(function (node) {
			node.itemStyle = null;
			node.symbolSize = 10;
			node.value = node.symbolSize;
			node.category = node.attributes.modularity_class;
			// Use random x, y
			node.x = node.y = null;
			node.draggable = true;
		});
		option = {
			title: {
				text: '分散关系图',
				textStyle: {
					color: 'rgba(96,173,197,0.96)',
					fontSize: '16'
				},
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '50%',
				containLabel: true
			},
			tooltip: {},
			legend: [{
				// selectedMode: 'single',
				left: 'center',
				bottom:'bottom',
				data: categories.map(function (a) {
					return a.name;
				})
			}],
			animation: false,
			series : [
				{
					name: 'Les Miserables',
					type: 'graph',
					zoom:0.8,
					layout: 'force',
					data: graph.nodes,
					links: graph.links,
					categories: categories,
					roam: true,
					label: {
						position: 'right'
					},
					force: {
						repulsion: 100
					}
				}
			]
		};

		myChart.setOption(option);
	}, 'xml');
}

//关系图3
function stuffguanxituThree(){
	var myChart = echarts.init(document.getElementById("guanxituThree"));
	myChart.showLoading();
	$.get('mapJson/les-miserables.gexf', function (xml) {
		myChart.hideLoading();

		var graph = echarts.dataTool.gexf.parse(xml);
		var categories = [];
		for (var i = 0; i < 9; i++) {
			categories[i] = {
				name: '类目' + i
			};
		}
		graph.nodes.forEach(function (node) {
			node.itemStyle = null;
			node.value = node.symbolSize;
			node.symbolSize /= 1.5;
			node.label = {
				show: node.symbolSize > 30
			};
			node.category = node.attributes.modularity_class;
		});
		option = {
			title: {
				text: '放射关系图',
				textStyle: {
					color: 'rgba(96,173,197,0.96)',
					fontSize: '16'
				},
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '50%',
				containLabel: true
			},
			tooltip: {},
			legend: [{
				// selectedMode: 'single',
				left: 'center',
				bottom:'bottom',
				data: categories.map(function (a) {
					return a.name;
				})
			}],
			animationDuration: 1500,
			animationEasingUpdate: 'quinticInOut',
			series : [
				{
					name: 'Les Miserables',
					type: 'graph',
					layout: 'none',
					data: graph.nodes,
					links: graph.links,
					categories: categories,
					roam: true,
					focusNodeAdjacency: true,
					itemStyle: {
						borderColor: '#fff',
						borderWidth: 1,
						shadowBlur: 10,
						shadowColor: 'rgba(0, 0, 0, 0.3)'
					},
					label: {
						position: 'right',
						formatter: '{b}'
					},
					lineStyle: {
						color: 'source',
						curveness: 0.3
					},
					emphasis: {
						lineStyle: {
							width: 10
						}
					}
				}
			]
		};

		myChart.setOption(option);
	}, 'xml');
}

//关系图4
function stuffguanxituFour(){
	var myChart = echarts.init(document.getElementById("guanxituFour"));
	myChart.showLoading();
	$.get('mapJson/les-miserables.gexf', function (xml) {
		myChart.hideLoading();

		var graph = echarts.dataTool.gexf.parse(xml);
		var categories = [];
		for (var i = 0; i < 9; i++) {
			categories[i] = {
				name: '类目' + i
			};
		}
		graph.nodes.forEach(function (node) {
			node.itemStyle = null;
			node.value = node.symbolSize;
			node.symbolSize /= 1.5;
			node.label = {
				normal: {
					show: node.symbolSize > 10
				}
			};
			node.category = node.attributes.modularity_class;
		});
		option = {
			title: {
				text: '环状关系图',
				textStyle: {
					color: 'rgba(96,173,197,0.96)',
					fontSize: '16'
				},
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '50%',
				containLabel: true
			},
			tooltip: {},
			legend: [{
				left: 'center',
				bottom:'bottom',
				data: categories.map(function (a) {
					return a.name;
				})
			}],
			animationDurationUpdate: 1500,
			animationEasingUpdate: 'quinticInOut',
			series: [
				{
					name: 'Les Miserables',
					type: 'graph',
					zoom:0.7,
					layout: 'circular',
					circular: {
						rotateLabel: true
					},
					data: graph.nodes,
					links: graph.links,
					categories: categories,
					roam: true,
					label: {
						position: 'right',
						formatter: '{b}'
					},
					lineStyle: {
						color: 'source',
						curveness: 0.3
					}
				}
			]
		};

		myChart.setOption(option);
	}, 'xml');
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

		var sandiantuOne = echarts.init(document.getElementById('sandiantuOne'));
		sandiantuOne.resize();
		var sandiantuTwo = echarts.init(document.getElementById('sandiantuTwo'));
		sandiantuTwo.resize();
		var sandiantuThree = echarts.init(document.getElementById('sandiantuThree'));
		sandiantuThree.resize();
		var sandiantuFour = echarts.init(document.getElementById('sandiantuFour'));
		sandiantuFour.resize();

		var KxiantuOne = echarts.init(document.getElementById('KxiantuOne'));
		KxiantuOne.resize();
		var KxiantuTwo = echarts.init(document.getElementById('KxiantuTwo'));
		KxiantuTwo.resize();

		var leidatuOne = echarts.init(document.getElementById('leidatuOne'));
		leidatuOne.resize();
		var leidatuTwo = echarts.init(document.getElementById('leidatuTwo'));
		leidatuTwo.resize();

		var guanxituOne = echarts.init(document.getElementById('guanxituOne'));
		guanxituOne.resize();
		var guanxituTwo = echarts.init(document.getElementById('guanxituTwo'));
		guanxituTwo.resize();
		var guanxituThree = echarts.init(document.getElementById('guanxituThree'));
		guanxituThree.resize();
		var guanxituFour = echarts.init(document.getElementById('guanxituFour'));
		guanxituFour.resize();

	});
}


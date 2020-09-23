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
	stuffZhuZhuangTuArea()
}

//渲染柱状图区域
function stuffZhuZhuangTuArea(){
    stuffZhuZhuangTuOne();
	stuffZhuZhuangTuTwo();
	stuffZhuZhuangTuThree();
	stuffZhuZhuangTuFour();
}

//柱状图1
function stuffZhuZhuangTuOne(){
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
			data: ['数据名称1', '数据名称2', '数据名称3', '数据名称4', '数据名称5']
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
				name: '数据名称1',
				type: 'line',
				stack: '总量',
				data: [120, 132, 101, 134, 90, 230, 210]
			},
			{
				name: '数据名称2',
				type: 'line',
				stack: '总量',
				data: [220, 182, 191, 234, 290, 330, 310]
			},
			{
				name: '数据名称3',
				type: 'line',
				stack: '总量',
				data: [150, 232, 201, 154, 190, 330, 410]
			},
			{
				name: '数据名称4',
				type: 'line',
				stack: '总量',
				data: [320, 332, 301, 334, 390, 330, 320]
			},
			{
				name: '数据名称5',
				type: 'line',
				stack: '总量',
				data: [820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	};


	myChart.setOption(option);
}

//柱状图2
function stuffZhuZhuangTuTwo(){
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
			data: ['数据名称1', '数据名称2', '数据名称3', '数据名称4', '数据名称5']
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
				name: '数据名称1',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [120, 132, 101, 134, 90, 230, 210]
			},
			{
				name: '数据名称2',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [220, 182, 191, 234, 290, 330, 310]
			},
			{
				name: '数据名称3',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [150, 232, 201, 154, 190, 330, 410]
			},
			{
				name: '数据名称4',
				type: 'line',
				stack: '总量',
				areaStyle: {},
				data: [320, 332, 301, 334, 390, 330, 320]
			},
			{
				name: '数据名称5',
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

//柱状图3
function stuffZhuZhuangTuThree(){

}

//柱状图3
function stuffZhuZhuangTuFour(){

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
	});
}


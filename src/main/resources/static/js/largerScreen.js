//加载地图信息
function getMapInfo() {
	var currentTeachLocal = [
		{name: '锦州凌海',
			value: [121.35, 41.17]
		},
		{name: '绥中',
			value: [120.33, 40.32]
		},
		{name: '大连',
			value: [121.62, 38.92]
		},
		{
			name: '朝阳市',
			value: [120.451176, 41.576758]
		},
		{
			name: '北镇',
			value: [121.883693,41.594137]
		},
		{
			name: '阜新市',
			value: [121.648962, 42.011796]
		},
		{
			name: '康平',
			value: [123.35, 42.75]
		},
		{
			name: '法库',
			value: [123.245, 42.30]
		},
		{
			name: '沈阳市',
			value: [123.429096, 41.796767]
		},
		{
			name: '昌图',
			value: [123.46, 42.36]
		},
		{
			name: '西丰',
			value: [124.72, 42.73]
		},
		{
			name: '开原',
			value: [124.03, 42.53]
		},
		{
			name: '铁岭市',
			value: [123.844279, 42.290585]
		},
		{
			name: '海城',
			value: [122.41, 40.41]
		},
		{
			name: '大石桥',
			value: [122.50, 40.65]
		},
		{
			name: '庄河',
			value: [122.98, 39.70]
		}]
	$.getJSON("mapJson/liaoNing.json", function(result) {
		$.each(result, function(i, field) {
			drawMap("main8", result, currentTeachLocal);
		});
	});
}

//渲染中间地图
function drawMap(id, allMapJson, currentTeachLocal) {
	echarts.registerMap('liaoNing', allMapJson);
	var myChart = echarts.init(document.getElementById(id));

	option = {
		title: {
			// text: '辽宁省教学点分布',
			// subtext: "2019年学院高职扩招在籍学生6230人，其中第一批高职扩招在籍学生2931人，共设57个教学班\n第二批高职扩招学生3299人，共设85个教学班级。", //副标题 \n 用于换行
			itemGap: 15, //主副标题间距
			// padding: [10, 10, 5, 5], //设置标题内边距,上，右，下，左
			left: "center",
			// x: "left",
			// y: 'top',
			textStyle: {
				fontSize: 20, //大小
				fontWeight: '800', //粗细
				color: 'rgb(121, 210, 236)'
			},
			subtextStyle: { //副标题的属性
				fontSize: 13, //大小
				fontWeight: '400', //粗细
				color: 'rgba(157, 227, 249, 0.91)'
			}
		},
		geo: {
			map: "liaoNing",
			roam: false, //开启鼠标缩放和漫游
			zoom: 0.8, //地图缩放级别
			selectedMode: false, //选中模式：single | multiple
			left: 0,
			right: 0,
			top:-50,
			bottom: -50,
			label: {
				normal: { //静态的时候展示样式
					show: false, //是否显示地图省份得名称
					textStyle: {
						color: "#fff",
						fontSize: 10,
						fontFamily: "Arial"
					}
				},
				emphasis: {
					color: 'white', //动态展示文字的样式
				},
			},
			itemStyle: {
				normal: {
					areaColor: "rgba(255, 255, 255, 0)",
					borderWidth: 1.5,
					textStyle: {
						color: "#fff"
					},
					borderColor: "rgba(153, 215, 234, 0.58)" //地图边框颜色
				},
				emphasis: {
					color: "#fff",
					areaColor: "rgba(45, 189, 232, 0.83)"
				}
			}
		},
		series: [{
			name: '教学点',
			type: 'effectScatter',
			coordinateSystem: 'geo',
			hoverAnimation: true,
			label: {
				normal: {
					formatter: '{b}',
					position: 'right',
					show: true
				}
			},
			data: currentTeachLocal,
			symbolSize: 15,
			rippleEffect: {
				brushType: 'stroke'
			},
			itemStyle: {
				normal: {
					color: 'rgb(1, 226, 251)' // 散点的颜色
				}
			}
		}]
	}
	myChart.setOption(option);

	myChart.on('click', function(params) {
		showVideoPlayer(params);
	});
}

//点击地图展示大监控
function showVideoPlayer(params) {
	//判断是否点击散点
	if (typeof(params.data) === "undefined") {
		return;
	} else {
		$('.leftHideenArea').addClass('animated slideOutLeft');
		$('.rightHideenArea').addClass('animated slideOutRight');
		$('.topHideenArea').addClass('animated slideOutUp');
		var wait = setInterval(function() {
			if (!$('.topHideenArea').is(":animated")) {
				clearInterval(wait);
				//执行code
				$(".videOnwer").html(params.data.name+'教学点实时监控画面');
				$(".videOnwer").show();
				$('.topHideenArea,.head_top.head_top:eq(0)').hide();
				$('.rightHideenArea').hide();
				$('.leftHideenArea').hide();
				$('.bigVideoArea').addClass('animated slideInDown');
				$('.bigVideoArea').show();
				$('#bigVideo')[0].play();
				$('.leftHideenArea').removeClass('animated slideOutLeft');
				$('.rightHideenArea').removeClass('animated slideOutRight');
				$('.topHideenArea').removeClass('animated slideOutUp');
			}
		}, 600);
	}
}

//隐藏大监控
function hiddenBigVideo(){
	$('.bigVideoArea').hide();
	$('.rightHideenArea').show();
	$('.topHideenArea').show();
	$('.leftHideenArea').addClass('animated slideInLeft');
	$('.rightHideenArea').addClass('animated slideInRight');
	$('.topHideenArea').addClass('animated slideInDown');
	$('.leftHideenArea,.head_top:eq(0)').show();
	$('#bigVideo')[0].pause();
	var wait = setInterval(function() {
		if (!$('.topHideenArea').is(":animated")) {
			clearInterval(wait);
			//执行code
			$('.bigVideoArea').removeClass('animated slideOutDown');
			var mySwiper1 = new Swiper('.visual_swiper1', {
				autoplay: true,//可选选项，自动滑动
				speed: 800,//可选选项，滑动速度
				autoplay: {
					delay: 2500,//1秒切换一次
				},
			})
			var mySwiper2 = new Swiper('.visual_swiper2', {
				autoplay: true,//可选选项，自动滑动
				direction: 'vertical',//可选选项，滑动方向 vertical||horizontal
				speed: 2000,//可选选项，滑动速度
			});
		}
	}, 600);
}

//table文字格式化
function paramsMatter(value, row, index) {
	if(typeof value === 'undefined'||value==null||value===""){
		return [ '<div class="myTooltip normalTxt" title="暂无">暂无</div>' ]
			.join('');
	}else{
		return [ '<div class="myTooltip" title="' + value + '">' + value + '</div>' ]
			.join('');
	}
}

//渲染授课教师人数表
function stuffTeacherCountTable(tableInfo){
	var screen=window.screen.width;
	var pagelist=0;
	if(screen<=1366){
		pagelist=3;
	}else{
		pagelist=4;
	}
	$('#teacherCountTable').bootstrapTable('destroy').bootstrapTable({
		data:tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize:pagelist,
		pageList: [pagelist],
		showToggle: false,
		showFooter: false,
		search: true,
		editable: false,
		striped: false,
		toolbar: '#toolbar',
		showColumns: false,
		onClickRow : function(row, $element, field) {
			changePageData(row);
		},
		onPostBody: function() {
			changetableStyleByScreen(tableInfo);
		},
		columns: [{
			field: 'edu104Id',
			title: '唯一标志',
			align: 'center',
			visible: false
		},
			{
				field: 'departmentName',
				title: '二级学院名称',
				align: 'center'
			},{
				field: 'teacherCount',
				title: '授课教师数',
				align: 'center'
			}
		]
	});
}

//点击切换页面数据源
function changePageData(row){
	var returnObject=new Object();
	returnObject.departmentCode=row.edu104Id;
	returnObject.schoolYearCode="";
	returnObject.batchCode="";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getBigScreenData",
		data: {
			"searchInfo":JSON.stringify(returnObject)
		},
		dataType : 'json',
		success : function(backjson) {
			if(backjson.code===200){
				reloadChart(backjson.data);
			}else{
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染教师类型分布chart
function stuffTeacherTypeCount(teacherTypeData,isSingle){
	var xAxisDatas=new Array();
	var seriesdatas = new Array();

	for (var i = 0; i <teacherTypeData.length ; i++) {
		xAxisDatas.push(teacherTypeData[i].name);
		seriesdatas.push(teacherTypeData[i].data)
	}

	var typeOne = new Array();
	var typeTwo = new Array();
	var typeThree = new Array();

	for (var i = 0; i <teacherTypeData.length; i++) {
		typeOne.push(seriesdatas[i][0]);
		typeTwo.push(seriesdatas[i][1]);
		typeThree.push(seriesdatas[i][2]);
	}

	var Titledatas = [];
	var typeOneDatas = [];
	var typeTwoDatas = [];
	var typeThreeDatas = [];

	//分组
	var screen=window.screen.width;
	var groupNum=0;
	if(screen<=1366){
		groupNum=3;
	}else{
		groupNum=4;
	}
	for(var i=0;i<xAxisDatas.length;i+=groupNum){
		Titledatas.push(xAxisDatas.slice(i,i+groupNum));
	}

	for(var i=0;i<typeOne.length;i+=3){
		typeOneDatas.push(typeOne.slice(i,i+groupNum));
		typeTwoDatas.push(typeTwo.slice(i,i+groupNum));
		typeThreeDatas.push(typeThree.slice(i,i+groupNum));
	}

	for (var i = 0; i < Titledatas.length; i++) {
		var stuffOption;
		var str='';
		stuffOption = {
			grid: {
				left: '-20',
				top: '30',
				right: '20',
				bottom: '10',
				containLabel: true
			},
			legend: {
				top: 0,
				textStyle: {
					color: "#fff",
				},
				itemWidth: 10,  // 设置宽度
				itemHeight: 10, // 设置高度
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				},
				confine: true
			},
			xAxis: {
				type: 'category',
				data: Titledatas[i],
				axisTick: { //---坐标轴 刻度
					show: true, //---是否显示
				},
				axisLine: { //---坐标轴 轴线
					show: true, //---是否显示
					lineStyle: {
						color: '#ff000000',
						width: 1,
						type: 'dotted',
					},
				},
				axisLabel: {//X轴文字
					textStyle: {
						fontSize: 12,
						color: '#fff'
					},
				},
			},
			yAxis: {
				type: 'value',
				show:false
			},
			series: [{
				name: '专任教师',
				type: 'bar',
				data: typeOneDatas[i],
				barWidth: 20,
				barGap: 0.5, //柱子之间间距 //柱图宽度      两种情况都要设置，设置series 中对应数据柱形的itemStyle属性下的emphasis和normal的barBorderRadius属性初始化时候圆角  鼠标移上去圆角
				itemStyle: {
					normal: {
						barBorderRadius: 50,
						color: "#446ACF",
					}
				},
			}, {
				name: '兼职教师',
				type: 'bar',
				data: typeTwoDatas[i],
				barWidth:20, //柱图宽度
				barGap: 0.5,
				itemStyle: {
					normal: { //设置颜色的渐变
						barBorderRadius: 50,
						color: "#4fb69d",
					}
				},
			},{
				name: '外聘教师',
				type: 'bar',
				data: typeThreeDatas[i],
				barWidth: 20,
				barGap: 0.5, //柱子之间间距 //柱图宽度      两种情况都要设置，设置series 中对应数据柱形的itemStyle属性下的emphasis和normal的barBorderRadius属性初始化时候圆角  鼠标移上去圆角
				itemStyle: {
					normal: {
						barBorderRadius: 50,
						color: "rgba(182,123,30,0.91)",
					}
				},
			}]
		};

		if(isSingle){
			var thisChart= echarts.init(document.getElementById('singleTeacheeTypeCount'));
			thisChart.setOption(stuffOption);
		}else{
			str=' <div class="swiper-slide chartDom1" id="teacherTypeCount'+i+'"></div>';
			$(".teacheeTypeCountAppendArea").append(str);
			var thisChart= echarts.init(document.getElementById('teacherTypeCount'+i));
			thisChart.setOption(stuffOption);
		}
	}

	if(!isSingle){
		if(Titledatas.length>1){
			mySwiper = new Swiper('.visual_swiperRight2', {
				autoplay: true,//可选选项，自动滑动
				speed: 800,//可选选项，滑动速度
				autoplay: {
					delay: 2500,//1秒切换一次
				},
			})
		}
	}
}

//渲染课时类型分布
function stuffclassHourTypeCount(periodTypeData,isSingle) {
	var screen=window.screen.width;
	var groupNum=0;
	if(screen<=1366){
		groupNum=4;
	}else{
		groupNum=5;
	}
	var titleArray = [];
	var seriesDatas = periodTypeData.periodTypeEcharts;
	for (var i = 0; i < periodTypeData.departmentNames.length;i += groupNum) {
		titleArray.push(periodTypeData.departmentNames.slice(i, i + groupNum));
	}

	var typeOneDatas = [];
	var typeTwoDatas = [];
	var typeThreeDatas = [];
	var typeFourDatas = [];

	for (var i = 0; i < seriesDatas.length; i++) {
		var currrentData = seriesDatas[i].data;
		if (seriesDatas[i].name === "理论学时") {
			for (var c = 0; c < currrentData.length; c +=groupNum) {
				typeOneDatas.push(currrentData.slice(c, c + groupNum));
			}
		}
		if (seriesDatas[i].name === "实践学时") {
			for (var d = 0; d < currrentData.length; d += groupNum) {
				typeTwoDatas.push(currrentData.slice(d, d + groupNum));
			}
		}
		if (seriesDatas[i].name === "集中学时") {
			for (var f = 0; f < currrentData.length; f += groupNum) {
				typeThreeDatas.push(currrentData.slice(f, f + groupNum));
			}
		}
		if (seriesDatas[i].name === "分散学时") {
			for (var g = 0; g < currrentData.length;g+= groupNum) {
				typeFourDatas.push(currrentData.slice(g, g + groupNum));
			}
		}
	}

		for (var i = 0; i < typeOneDatas.length; i++) {
			var stuffOption;
			var str = '';
			stuffOption = {
				color: ['#446ACF', '#4fb69d', 'rgb(197,135,31)', '#018bbf', '#338bcf', '#cd6d34', '#FD9E06', '#ad4b3e'],
				tooltip: {
					trigger: 'axis',
					confine: true,
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '0',
					top: '30',
					right: '0',
					bottom: '-10',
					containLabel: true
				},
				legend: {
					top: 0,
					textStyle: {
						color: "#fff",
					},
					itemWidth: 10,  // 设置宽度
					itemHeight: 10, // 设置高度
				},
				xAxis: {
					type: 'value',
					show: false
				},
				yAxis: {
					type: 'category',
					data: titleArray[i],
					splitLine: {//分割线
						show: false
					},
					axisTick: {       //y轴刻度线
						"show": false
					},
					axisLine: { //---坐标轴 轴线
						show: true, //---是否显示
						lineStyle: {
							color: '#ff000000',
							width: 1,
							type: 'dotted',
						},
					},
					axisLabel: {//Y轴刻度值
						textStyle: {
							fontSize: 12,
							color: '#fff'
						},
					},
				},
				series: [
					{
						name: '理论学时',
						type: 'bar',
						stack: '总量',
						barWidth: 20,
						itemStyle: {
							normal: {
								barBorderRadius: [10, 0, 0, 10]
							}
						},
						data: typeOneDatas[i]
					},
					{
						name: "实践学时",
						type: 'bar',
						stack: '总量',
						barWidth: 20,
						data: typeTwoDatas[i]
					},
					{
						name: '集中学时',
						type: 'bar',
						stack: '总量',
						barWidth: 20,
						data: typeThreeDatas[i]
					},
					{
						name: '分散学时',
						type: 'bar',
						stack: '总量',
						barWidth: 20,
						itemStyle: {
							normal: {
								barBorderRadius: [0, 10, 10, 0]
							}
						},
						data: typeFourDatas[i]
					}
				]
			};
			if(isSingle){
				var thisChart= echarts.init(document.getElementById('singleClassHourTypeCount'));
				thisChart.setOption(stuffOption);
			}else{
				str=' <div class="swiper-slide chartDom1" id="classHourTypeCount'+i+'"></div>';
				$(".classHourTypeAppendArea").append(str);
				var thisChart= echarts.init(document.getElementById('classHourTypeCount'+i));
				thisChart.setOption(stuffOption);
			}
		}

	if(!isSingle){
		if(typeOneDatas.length>1){
			mySwiperRight3 = new Swiper('.visual_swiperRight3', {
				autoplay: true,//可选选项，自动滑动
				direction: 'vertical',//可选选项，滑动方向 vertical||horizontal
				speed: 1000,//可选选项，滑动速度
			});
		}
	}
}

//学院概貌分析
function stuffstudentFaceCount(studentAgeData,studentJobData){
	var studentAgeData=reStuffData(studentAgeData);
	var studentJobData =reStuffData(studentJobData);
	var option3 = {
		tooltip: {
			show: true,
			trigger: "item",
			confine: true
		},
		radar: {
			center: ["50%", "50%"],//偏移位置
			radius: "80%",
			startAngle: 40, // 起始角度
			splitNumber: 4,
			shape: "circle",
			splitArea: {
				areaStyle: {
					color: 'transparent'
				}
			},
			axisLabel: {
				show: false,
				fontSize: 20,
				color: "#000",
				fontStyle: "normal",
				fontWeight: "normal"
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: "rgba(255, 255, 255, 0.5)"
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: "rgba(255, 255, 255, 0.5)"
				}
			},
			indicator: studentAgeData.indicator
		},
		series: [{
			type: "radar",
			data: studentAgeData.renderData
		}]
	}
	var option31 = {
		tooltip: {
			show: true,
			trigger: "item",
			confine: true
		},
		radar: {
			center: ["50%", "50%"],//偏移位置
			radius: "80%",
			startAngle: 40, // 起始角度
			splitNumber: 4,
			shape: "circle",
			splitArea: {
				areaStyle: {
					color: 'transparent'
				}
			},
			axisLabel: {
				show: false,
				fontSize: 20,
				color: "#000",
				fontStyle: "normal",
				fontWeight: "normal"
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: "rgba(255, 255, 255, 0.5)"
				}
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: "rgba(255, 255, 255, 0.5)"
				}
			},
			indicator: studentJobData.indicator
		},
		series: [{
			type: "radar",
			data: studentJobData.renderData
		}]
	}

	var myChart3 = echarts.init(document.getElementById('main3'));
	myChart3.setOption(option3);
	var myChart31 = echarts.init(document.getElementById('main31'));
	myChart31.setOption(option31);
	var mySwiper1 = new Swiper('.visual_swiper1', {
		autoplay: true,//可选选项，自动滑动
		speed: 800,//可选选项，滑动速度
		autoplay: {
			delay: 2500,//1秒切换一次
		},
	})
}

//学院概貌分析饼图渲染demo
function reStuffData(data){
	var color = ['#e9df3d', '#f79c19', '#21fcd6', '#08c8ff', '#df4131'];
	var returnObject=new Object();

	var max = 0;
	data.forEach(function(d) {
		max = parseInt(d.value) > max ? parseInt(d.value) : max;
	});

	var renderData = [{
		value: [],
		name: "学员概貌",
		symbol: 'none',
		lineStyle: {
			normal: {
				color: '#ecc03e',
				width: 2
			}
		},
		areaStyle: {
			normal: {
				color: new echarts.graphic.LinearGradient(0, 0, 1, 0,
					[{
						offset: 0,
						color: 'rgba(203, 158, 24, 0.8)'
					}, {
						offset: 1,
						color: 'rgba(190, 96, 20, 0.8)'
					}],
					false)
			}
		}
	}];


	data.forEach(function(d, i) {
		var value = ['', '', '', '', ''];
		value[i] = max,
			renderData[0].value[i] = d.value;
		renderData.push({
			name: "学员概貌",
			value: value,
			symbol: 'circle',
			symbolSize: 12,
			lineStyle: {
				normal: {
					color: 'transparent'
				}
			},
			itemStyle: {
				normal: {
					color: color[i],
				}
			}
		})
	})
	var indicator = [];

	data.forEach(function(d) {
		indicator.push({
			name: d.name,
			max: max,
			color: '#fff'
		})
	})

	returnObject.indicator=indicator;
	returnObject.renderData=renderData;
	return returnObject;
}

//渲染开课数量
function stuffoptenClassCount(chartInfo,isSingle) {
	var chartInfos = [];
	for (var i = 0; i < chartInfo.length;i += 3) {
		chartInfos.push(chartInfo.slice(i, i + 3));
	}

	for (var i = 0; i < chartInfos.length; i++) {
		var className='courseCount_swiper-slide'+i;
		var parentStr='<div class="swiper-slide '+className+'"></div>';
		$(".courseCountAppendArea").append(parentStr);
	}

	for (var i = 0; i < chartInfos.length; i++) {
		var currentInfo = chartInfos[i];
		var className='courseCount_swiper-slide'+i;
		for (var c = 0; c < currentInfo.length; c++) {
			var str="";
			if(isSingle){
				var option1 = cicleColor1(currentInfo[c]);
				var openClassCount = echarts.init(document.getElementById('singleCourseCount'));
				openClassCount.setOption(option1);
			}else{
				if(c==0){
					var option1 = cicleColor1(currentInfo[c]);
					str='<div class="visualSssf_right_box chartDom1" id="classOpenCount'+currentInfo[c].text+'"></div>';
					$("."+className).append(str);
					var openClassCount = echarts.init(document.getElementById('classOpenCount'+currentInfo[c].text));
					openClassCount.setOption(option1);
				}else if(c==1){
					var option2 = cicleColor2(currentInfo[c]);
					str=' <div class="visualSssf_right_box chartDom1" id="classOpenCount'+currentInfo[c].text+'"></div>';
					$("."+className).append(str);
					var openClassCount = echarts.init(document.getElementById('classOpenCount'+currentInfo[c].text));
					openClassCount.setOption(option2);
				}else{
					var option3 = cicleColor3(currentInfo[c]);
					str=' <div class="visualSssf_right_box chartDom1" id="classOpenCount'+currentInfo[c].text+'"></div>';
					$("."+className).append(str);
					var openClassCount = echarts.init(document.getElementById('classOpenCount'+currentInfo[c].text));
					openClassCount.setOption(option3);
				}
			}
		}
	}

	if(!isSingle){
		mySwiper1 = new Swiper('.visual_swiperRightCourseCount', {
			autoplay: true,//可选选项，自动滑动
			speed: 800,//可选选项，滑动速度
			autoplay: {
				delay: 2500,//1秒切换一次
			},
		})
	}
}

//蓝色饼图demo
function cicleColor1(currentInfo){
	var returnOption=new Array();
	var value=0;
	if(currentInfo.courseCount!=0){
		value=Math.floor(currentInfo.courseCompleteCount/currentInfo.courseCount*100);
	}
	returnOption = {
		title: {
			text: `${value}%`,
			subtext: currentInfo.text,
			left: 'center',
			top: 'center',//top待调整
			textStyle: {
				color: '#fff',
				fontSize: 16,
				fontFamily: 'PingFangSC-Regular'
			},
			subtextStyle: {
				color: '#ff',
				fontSize:12,
				fontFamily: 'PingFangSC-Regular',
				top: 'center'
			},
			itemGap: -1//主副标题间距
		},
		tooltip: {
			trigger: 'item',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var all=parseInt(currentInfo.courseCount);
				var noNum=parseInt(currentInfo.courseCount)-parseInt(currentInfo.courseCompleteCount);
				var result = ''
				var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#1d54f7"></span>';
				var notHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:gray"></span>';
				result= "共"+all+ "门课程</br>"
					   + dotHtml +
					   "已完成："+currentInfo.courseCompleteCount+ "</br>"+
						notHtml +
						"未完成："+noNum;
				return result
			},
			confine: true
		},
		series: [{
			name: currentInfo.text,
			type: 'pie',
			clockWise: true,
			radius: ['65%', '70%'],
			itemStyle: {
				normal: {
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			},
			hoverAnimation: false,
			data: [{
				value: value,
				name: '已完成课程',
				itemStyle: {
					normal: {
						borderWidth: 8,
						borderColor: {
							colorStops: [{
								offset: 0,
								color: '#1d54f7' || '#00cefc' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#68eaf9' || '#367bec' // 100% 处的颜色
							}]
						},
						color: { // 完成的圆环的颜色
							colorStops: [{
								offset: 0,
								color: '#1d54f7' || '#00cefc' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#68eaf9' || '#367bec' // 100% 处的颜色
							}]
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				}
			}, {
				name: 'gap',
				value: 100 - value,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0
					}
				}
			}]
		}]
	}
	return returnOption;
}

//绿色饼图demo
function cicleColor2(currentInfo){
	var value=0;
	if(currentInfo.courseCount!=0){
		value=Math.floor(currentInfo.courseCompleteCount/currentInfo.courseCount*100);
	}
	var returnOption=new Array();
	returnOption = {
		title: {
			text: `${value}%`,
			subtext: currentInfo.text,
			left: 'center',
			top: 'center',//top待调整
			textStyle: {
				color: '#fff',
				fontSize: 16,
				fontFamily: 'PingFangSC-Regular'
			},
			subtextStyle: {
				color: '#ff',
				fontSize: 12,
				fontFamily: 'PingFangSC-Regular',
				top: 'center'
			},
			itemGap: -1//主副标题间距
		},
		tooltip: {
			trigger: 'item',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var all=parseInt(currentInfo.courseCount);
				var noNum=parseInt(currentInfo.courseCount)-parseInt(currentInfo.courseCompleteCount);
				var result = ''
				var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#02df94"></span>';
				var notHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:gray"></span>';
				result= "共"+all+ "门课程</br>"
					+ dotHtml +
					"已完成："+currentInfo.courseCompleteCount+ "</br>"+
					notHtml +
					"未完成："+noNum;
				return result
			},
			confine: true
		},
		series: [{
			name: currentInfo.text,
			type: 'pie',
			clockWise: true,
			radius: ['65%', '70%'],
			itemStyle: {
				normal: {
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			},
			hoverAnimation: false,
			data: [{
				value: value,
				name: '已完成课程',
				itemStyle: {
					normal: {
						borderWidth: 8,
						borderColor: {
							colorStops: [{
								offset: 0,
								color: '#02df94' || '#25d6bc' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#28d3d0' || '#14dbaa' // 100% 处的颜色
							}]
						},
						color: { // 完成的圆环的颜色
							colorStops: [{
								offset: 0,
								color: '#02df94' || '#25d6bc' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#28d3d0' || '#14dbaa' // 100% 处的颜色
							}]
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				}
			}, {
				name: 'gap',
				value: 100 - value,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0
					}
				}
			}]
		}]
	}
	return returnOption;
}

//黄色饼图demo
function cicleColor3(currentInfo){
	var value=0;
	if(currentInfo.courseCount!=0){
		value=Math.floor(currentInfo.courseCompleteCount/currentInfo.courseCount*100);
	}
	var returnOption=new Array();
	returnOption = {
		title: {
			text: `${value}%`,
			subtext: currentInfo.text,
			left: 'center',
			top: 'center',//top待调整
			textStyle: {
				color: '#fff',
				fontSize: 16,
				fontFamily: 'PingFangSC-Regular'
			},
			subtextStyle: {
				color: '#ff',
				fontSize: 12,
				fontFamily: 'PingFangSC-Regular',
				top: 'center'
			},
			itemGap: -1//主副标题间距
		},
		tooltip: {
			trigger: 'item',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var all=parseInt(currentInfo.courseCount);
				var noNum=parseInt(currentInfo.courseCount)-parseInt(currentInfo.courseCompleteCount);
				var result = ''
				var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#eb3600"></span>';
				var notHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:gray"></span>';
				result= "共"+all+ "门课程</br>"
					+ dotHtml +
					"已完成："+currentInfo.courseCompleteCount+ "</br>"+
					notHtml +
					"未完成："+noNum;
				return result
			},
			confine: true
		},
		series: [{
			name: currentInfo.text,
			type: 'pie',
			clockWise: true,
			radius: ['65%', '70%'],
			itemStyle: {
				normal: {
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			},
			hoverAnimation: false,
			data: [{
				value: value,
				name: '已完成课程',
				itemStyle: {
					normal: {
						borderWidth: 8,
						borderColor: {
							colorStops: [{
								offset: 0,
								color: '#eb3600' || '#cc9a00' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#d0a00e' || '#d0570e' // 100% 处的颜色
							}]
						},
						color: { // 完成的圆环的颜色
							colorStops: [{
								offset: 0,
								color: '#eb3600' || '#cc9a00' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#d0a00e' || '#d0570e' // 100% 处的颜色
							}]
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				}
			}, {
				name: 'gap',
				value: 100 - value,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0
					}
				}
			}]
		}]
	}
	return returnOption;
}

//渲染学员统计人数
function stuffStudentCount(seriesdata,yAxisData){
	var seriesdatas = [];
	var yAxisDatas = [];

	//每五个五一组
	for(var i=0;i<seriesdata.length;i+=5){
		seriesdatas.push(seriesdata.slice(i,i+5));
	}
	for(var i=0;i<yAxisData.length;i+=5){
		yAxisDatas.push(yAxisData.slice(i,i+5));
	}
	for (var i = 0; i <seriesdatas.length ; i++) {
		var str="";
		var stuffOption;
		var currentYAxisData=yAxisDatas[i];
		var changeLeft=0;
		for (var j = 0; j < currentYAxisData.length; j++) {
			if(currentYAxisData[j].length>=0){
				changeLeft=60;
				break
			}else{
				changeLeft=30;
			}
		}
		stuffOption = {
			"title": {
				"text": " ",
				"left": "center",
				"y": "10",
				"textStyle": {
					"color": "#fff"
				}
			},
			"grid": {
				"left": changeLeft,
				"top": 0,
				"bottom": 10
			},
			"tooltip": {
				"trigger": "item",
				"confine": true,
				"textStyle": {
					"fontSize": 12
				},
				"formatter": "{b0}:{c0}"
			},
			"xAxis": {
				"max": 100,
				"splitLine": {
					"show": false
				},
				"axisLine": {
					"show": false
				},
				"axisLabel": {
					"show": false
				},
				"axisTick": {
					"show": false
				}
			},
			"yAxis": [
				{
					"type": "category",
					"inverse": false,
					"data": yAxisDatas[i],
					"axisLine": {
						"show": false
					},
					"axisTick": {
						"show": false
					},
					"axisLabel": {
						"margin": -4,
						"textStyle": {
							"color": "#fff",
							"fontSize": 16.25
						}
					}
				},

			],
			"series": [
				{
					"type": "pictorialBar",
					"symbol": "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC",
					"symbolRepeat": "fixed",
					"symbolMargin": "5%",
					"symbolClip": true,
					"symbolSize": 22.5,
					"symbolPosition": "start",
					"symbolOffset": [
						20,
						0
					],
					"symbolBoundingData": 300,
					"data": seriesdatas[i],
					"z": 10
				},
				{
					"type": "pictorialBar",
					"itemStyle": {
						"normal": {
							"opacity": 0.3
						}
					},
					"label": {
						"normal": {
							"show": false
						}
					},
					"animationDuration": 0,
					"symbolRepeat": "fixed",
					"symbolMargin": "5%",
					"symbol": "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC",
					"symbolSize": 22.5,
					"symbolBoundingData": 300,
					"symbolPosition": "start",
					"symbolOffset": [
						20,
						0
					],
					"data": seriesdatas[i],
					"z": 5
				}
			]
		};
		str=' <div class="swiper-slide chartDom1" id="localStudent'+i+'"></div>';
		$(".localStudentInfoArea").append(str);
		var myRight3= echarts.init(document.getElementById('localStudent'+i));
		myRight3.setOption(stuffOption);
	}

	if(seriesdatas.length>1){
		mySwiper2 = new Swiper('.visual_swiper2', {
			autoplay: true,//可选选项，自动滑动
			direction: 'vertical',//可选选项，滑动方向 vertical||horizontal
			speed: 1000,//可选选项，滑动速度
		});
	}
}

//渲染学员统计人数2
function stuffStudentCount2(seriesdata,yAxisData){

	var seriesdatas = [];
	var yAxisDatas = [];

	//每五个五一组
	for(var i=0;i<seriesdata.length;i+=5){
		seriesdatas.push(seriesdata.slice(i,i+5));
	}
	for(var i=0;i<yAxisData.length;i+=5){
		yAxisDatas.push(yAxisData.slice(i,i+5));
	}

	var firstStr="<div class='swiper-wrapper localStudentInfoArea2'></div>";
	$(".visual_swiper2_2").append(firstStr);

	for (var i = 0; i <seriesdatas.length ; i++) {
		var str="";
		var stuffOption;
		var currentYAxisData=yAxisDatas[i];
		var changeLeft=0;
		for (var j = 0; j < currentYAxisData.length; j++) {
			if(currentYAxisData[j].length>=0){
				changeLeft=60;
				break
			}else{
				changeLeft=30;
			}
		}
		stuffOption = {
			"title": {
				"text": " ",
				"left": "center",
				"y": "10",
				"textStyle": {
					"color": "#fff"
				}
			},
			"grid": {
				"left": changeLeft,
				"top": 0,
				"bottom": 10
			},
			"tooltip": {
				"trigger": "item",
				"confine": true,
				"textStyle": {
					"fontSize": 12
				},
				"formatter": "{b0}:{c0}"
			},
			"xAxis": {
				"max": 100,
				"splitLine": {
					"show": false
				},
				"axisLine": {
					"show": false
				},
				"axisLabel": {
					"show": false
				},
				"axisTick": {
					"show": false
				}
			},
			"yAxis": [
				{
					"type": "category",
					"inverse": false,
					"data": yAxisDatas[i],
					"axisLine": {
						"show": false
					},
					"axisTick": {
						"show": false
					},
					"axisLabel": {
						"margin": -4,
						"textStyle": {
							"color": "#fff",
							"fontSize": 16.25
						}
					}
				},

			],
			"series": [
				{
					"type": "pictorialBar",
					"symbol": "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC",
					"symbolRepeat": "fixed",
					"symbolMargin": "5%",
					"symbolClip": true,
					"symbolSize": 22.5,
					"symbolPosition": "start",
					"symbolOffset": [
						20,
						0
					],
					"symbolBoundingData": 300,
					"data": seriesdatas[i],
					"z": 10
				},
				{
					"type": "pictorialBar",
					"itemStyle": {
						"normal": {
							"opacity": 0.3
						}
					},
					"label": {
						"normal": {
							"show": false
						}
					},
					"animationDuration": 0,
					"symbolRepeat": "fixed",
					"symbolMargin": "5%",
					"symbol": "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC",
					"symbolSize": 22.5,
					"symbolBoundingData": 300,
					"symbolPosition": "start",
					"symbolOffset": [
						20,
						0
					],
					"data": seriesdatas[i],
					"z": 5
				}
			]
		};
		str=' <div class="swiper-slide chartDom1" id="localStudent2'+i+'"></div>';
		$(".localStudentInfoArea2").append(str);
		var myRight3= echarts.init(document.getElementById('localStudent2'+i));
		myRight3.setOption(stuffOption);
	}

	if(seriesdatas.length>1){
		var mySwiper2 = new Swiper('.visual_swiper2_2', {
			autoplay: true,//可选选项，自动滑动
			direction: 'vertical',//可选选项，滑动方向 vertical||horizontal
			speed: 1000,//可选选项，滑动速度
		});
	}
}

//初始化加载chart
function loadChart(){
	var returnObject=new Object();
	returnObject.departmentCode="";
	returnObject.schoolYearCode="";
	returnObject.batchCode="";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getBigScreenData",
		data: {
			"searchInfo":JSON.stringify(returnObject)
		},
		dataType : 'json',
		success : function(backjson) {
			if(backjson.code===200){
				//中间地图
				getMapInfo();

				//授课教师人数
				stuffTeacherCountTable(backjson.data.departmentData);
				//教师类型分布
				stuffTeacherTypeCount(backjson.data.teacherTypeData,false);
				//课时类型分布
				stuffclassHourTypeCount(backjson.data.periodTypeData,false);

				//学员概貌分析
				stuffstudentFaceCount(backjson.data.studentAgeData,backjson.data.studentJobData);
				//授课情况统计
				stuffoptenClassCount(backjson.data.courseData,false);
				//学员统计人数
				stuffStudentCount(backjson.data.studentsInLocal.seriesdata,backjson.data.studentsInLocal.yAxisData);
			}
		}
	});
}

//重新渲染chartDom
function reloadChart(backjsonData){
	//教师类型分布
	var teacherTypeCountCharts=$(".teacheeTypeCountAppendArea").find('.chartDom1').length;
	if(teacherTypeCountCharts>1){
		mySwiper.autoplay.stop();
	}

	//课时类型分布
	var classHourTypeCharts=$(".classHourTypeAppendArea").find('.chartDom1').length;
	if(classHourTypeCharts>1){
		mySwiperRight3.autoplay.stop();
	}

	//授课情况统计
	var courseCountCharts=$(".courseCountAppendArea").find('.swiper-slide').length;
	if(courseCountCharts>1){
		mySwiper1.autoplay.stop();
	}

	//学员人数统计
	var localStudentCountCharts=$(".localStudentInfoArea").find('.chartDom1').length;
	if(localStudentCountCharts>1){
		mySwiper2.autoplay.stop();
	}

	$(".visual_swiper2,.visual_swiperRight2,.visual_swiperRight3,.visual_swiperRightCourseCount").hide();
	$(".visual_swiper2_2,#singleTeacheeTypeCount,#singleClassHourTypeCount,#singleCourseCount").show();
	$(".visual_swiper2_2").empty();

	//教师类型分布
	stuffTeacherTypeCount(backjsonData.teacherTypeData,true);
	//课时类型分布
	stuffclassHourTypeCount(backjsonData.periodTypeData,true);
	//学员概貌分析
	stuffstudentFaceCount(backjsonData.studentAgeData,backjsonData.studentJobData);
	//授课情况统计
	stuffoptenClassCount(backjsonData.courseData,true);
	//学员统计人数
	stuffStudentCount2(backjsonData.studentsInLocal.seriesdata,backjsonData.studentsInLocal.yAxisData);
	//中间隐藏的四个小chart
	stuffCenterCiecle(backjsonData);

	//返回初始页面
	$('#returnConfigPage').unbind('click');
	$('#returnConfigPage').bind('click', function(e) {
		returnConfigPage();
		e.stopPropagation();
	});
}

//渲染中间隐藏的四个小chart
function stuffCenterCiecle(backjsonData){
	$(".centerMap").hide();
	$(".smallBingtu").show();
	//隐藏map
	if (!$(".centerMap").is(':hidden')) {
		$('.centerMap').addClass('animated bounceOut');
		var wait = setInterval(function() {
			if (!$('.centerMap').is(":animated")) {
				$('.centerMap').removeClass('animated bounceOut').hide();
				clearInterval(wait);
			}
		}, 300);
	}

	//展示chart
	$('.smallBingtu').addClass('animated bounceIn');
	var wait = setInterval(function() {
		if (!$('.smallBingtu').is(":animated")) {
			$('.smallBingtu').removeClass('animated bounceIn').show();
			clearInterval(wait);
		}
	}, 600);

	$("#returnConfigPage").removeClass('noneStartImportant').css("display",'table-cell');

	//教师职称分布
     teacherTitleCount(backjsonData.teacherZcTypeData);

	//教师授课课时
	teacherCrouseHours(backjsonData.periodByTeacherType);

	//集中课时统计
	jzksClassPeriodDate(backjsonData.jzksClassPeriodDate);

	//分散课时统计
	fsksClassPeriodDate(backjsonData.fsksClassPeriodDate);
}

//教师职称分布
function teacherTitleCount(teacherZcTypeData){
	var option = {
		// color :['rgba(13,133,196,0.74)', 'rgba(22,193,222,0.89)', 'rgba(46,204,118,0.81)', 'rgba(131,221,33,0.89)', 'rgba(179,174,16,0.91)'],
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)'
		},
		graphic: [{//2、中心的文字设置
			type: 'group',
			left: 'center',
			top: 'center',
			children: [
				{
					type: 'circle',
					z: 100,
					left: 'center',
					top: 'middle',
					shape: {
						cx: 0,
						cy: 0,
						r:50,
					},
					style: {
						fill: 'rgba(255,255,255,0)',
						stroke: 'rgba(255,255,255,0)',
						lineWidth: 2,
					}
				},
				{
					type: 'text',
					z: 100,
					left: 'center',
					top: 'middle',
					style: {
						x:3,
						y:10,
						fill: 'white',
						text: [
							'教师职称统计',
						].join('\n'),
						textAlign:'center',//3、居中显示
						fontSize:15,
						fontWeight:800
					}
				}
			]
		}],
		series: [
			{
				name: '职称名称',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '30',
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(16,16,16,0.58)'
					},
					normal: {
						label : {
							color: "white",
							show: false,
							position: 'inside',
						},
						color: function(params) {
							var colorList = [
								{
									c1: 'rgba(15,122,226,0.67)',//操作
									c2: 'rgba(16,210,216,0.67)'
								},
								{
									c1: 'rgba(16,210,216,0.67)',//操作
									c2: 'rgba(81,207,104,0.67)'
								},
								{
									c1: 'rgba(81,207,104,0.67)',//操作
									c2: 'rgba(231,238,36,0.67)'
								},
								{
									c1: 'rgba(231,238,36,0.67)',//操作
									c2: 'rgba(227,135,40,0.67)'
								},
								{
									c1: 'rgba(227,135,40,0.67)',//操作
									c2: 'rgba(222,65,16,0.68)'
								},
								{
									c1: 'rgba(222,65,16,0.67)',//操作
									c2: 'rgba(219,86,109,0.67)'
								},
								{
									c1: 'rgba(219,86,109,0.67)',//操作
									c2: 'rgba(212,46,164,0.67)'
								},{
									c1: 'rgba(212,46,164,0.67)',//操作
									c2: 'rgba(136,45,214,0.67)'
								},{
									c1: 'rgba(136,45,214,0.67)',//操作
									c2: 'rgba(54,18,189,0.67)'
								},{
									c1: 'rgba(54,18,189,0.67)',//操作
									c2: 'rgba(15,122,226,0.67)'
								}]
							return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

								offset: 0,
								color: colorList[params.dataIndex].c1
							}, {
								offset: 1,
								color: colorList[params.dataIndex].c2
							}])
							/*  return colorList[params.dataIndex]*/
						}
					}
				},
				data: teacherZcTypeData
			}
		]
	};

	var teacherTitleCount = echarts.init(document.getElementById('teacherTitleCount'));
	teacherTitleCount.setOption(option);
}

//授课课时分布
function teacherCrouseHours(periodByTeacherType){
	var option = {
		color :['rgba(13,133,196,0.74)', 'rgba(22,193,222,0.89)', 'rgba(46,204,118,0.81)', 'rgba(131,221,33,0.89)', 'rgba(179,174,16,0.91)'],
		tooltip: {
			trigger: 'item',
			formatter: '{a} <br/>{b}: {c} ({d}%)'
		},
		graphic: [{//2、中心的文字设置
			type: 'group',
			left: 'center',
			top: 'center',
			children: [
				{
					type: 'circle',
					z: 100,
					left: 'center',
					top: 'middle',
					shape: {
						cx: 0,
						cy: 0,
						r:50,
					},
					style: {
						fill: 'rgba(255,255,255,0)',
						stroke: 'rgba(255,255,255,0)',
						lineWidth: 2,
					}
				},
				{
					type: 'text',
					z: 100,
					left: 'center',
					top: 'middle',
					style: {
						x:3,
						y:10,
						fill: 'white',
						text: [
							'教师类型统计',
						].join('\n'),
						textAlign:'center',//3、居中显示
						fontSize:15,
						fontWeight:800
					}
				}
			]
		}],
		series: [
			{
				name: '教师类型',
				type: 'pie',
				radius: ['50%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '30',
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(16,16,16,0.58)'
					},
					normal: {
						label : {
							color: "white",
							show: false,
							position: 'inside',
						},
						color: function(params) {
							var colorList = [
								{
									c1: 'rgba(15,122,226,0.67)',//操作
									c2: 'rgba(16,210,216,0.67)'
								},
								{
									c1: 'rgba(16,210,216,0.67)',//操作
									c2: 'rgba(81,207,104,0.67)'
								},
								{
									c1: 'rgba(81,207,104,0.67)',//操作
									c2: 'rgba(231,238,36,0.67)'
								},
								{
									c1: 'rgba(231,238,36,0.67)',//操作
									c2: 'rgba(227,135,40,0.67)'
								},
								{
									c1: 'rgba(227,135,40,0.67)',//操作
									c2: 'rgba(222,65,16,0.68)'
								},
								{
									c1: 'rgba(222,65,16,0.67)',//操作
									c2: 'rgba(219,86,109,0.67)'
								},
								{
									c1: 'rgba(219,86,109,0.67)',//操作
									c2: 'rgba(212,46,164,0.67)'
								},{
									c1: 'rgba(212,46,164,0.67)',//操作
									c2: 'rgba(136,45,214,0.67)'
								},{
									c1: 'rgba(136,45,214,0.67)',//操作
									c2: 'rgba(54,18,189,0.67)'
								},{
									c1: 'rgba(54,18,189,0.67)',//操作
									c2: 'rgba(15,122,226,0.67)'
								}]
							return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

								offset: 0,
								color: colorList[params.dataIndex].c1
							}, {
								offset: 1,
								color: colorList[params.dataIndex].c2
							}])
							/*  return colorList[params.dataIndex]*/
						}
					}
				},
				data: periodByTeacherType
			}
		]
	};

	var periodByTeacherTypeCount = echarts.init(document.getElementById('periodByTeacherTypeCount'));
	periodByTeacherTypeCount.setOption(option);
}

//集中课时统计
function jzksClassPeriodDate(jzksClassPeriodDate){
	var option=jzksClassPeriodChartDemo(jzksClassPeriodDate);
	var jzksClassPeriodDate = echarts.init(document.getElementById('jzksClassPeriodDate'));
	jzksClassPeriodDate.setOption(option);
}

//分散课时统计
function fsksClassPeriodDate(fsksClassPeriodDate){
	var option=fsksClassPeriodChartDemo(fsksClassPeriodDate);
	var fsksClassPeriodDate = echarts.init(document.getElementById('fsksClassPeriodDate'));
	fsksClassPeriodDate.setOption(option);
}

//集中课时chart demo
function jzksClassPeriodChartDemo(currentInfo){
	var returnOption=new Array();
	var value=0;
	if(currentInfo.peridoCount!=0){
		value=Math.floor(currentInfo.periodCompleteCount/currentInfo.peridoCount*100);
	}
	returnOption = {
		title: {
			text: `${value}%`,
			subtext: currentInfo.text,
			left: 'center',
			top: 'center',//top待调整
			textStyle: {
				color: '#fff',
				fontSize: 16,
				fontFamily: 'PingFangSC-Regular'
			},
			subtextStyle: {
				color: '#ff',
				fontSize:12,
				fontFamily: 'PingFangSC-Regular',
				top: 'center'
			},
			itemGap: -1//主副标题间距
		},
		tooltip: {
			trigger: 'item',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var all=parseInt(currentInfo.peridoCount);
				var noNum=parseInt(currentInfo.peridoCount)-parseInt(currentInfo.periodCompleteCount);
				var result = ''
				var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#19daf7"></span>';
				var notHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:gray"></span>';
				result= "共"+all+ "个课时</br>"
					+ dotHtml +
					"已完成："+currentInfo.periodCompleteCount+ "</br>"+
					notHtml +
					"未完成："+noNum;
				return result
			},
			confine: true
		},
		series: [{
			name: currentInfo.text,
			type: 'pie',
			clockWise: true,
			radius: ['65%', '70%'],
			itemStyle: {
				normal: {
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			},
			hoverAnimation: false,
			data: [{
				value: value,
				name: '已完成课时',
				itemStyle: {
					normal: {
						borderWidth: 25,
						borderColor: {
							colorStops: [{
								offset: 0,
								color: '#19daf7' || '#0cfcdc' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#0cfcdc' || '#19daf7' // 100% 处的颜色
							}]
						},
						color: { // 完成的圆环的颜色
							colorStops: [{
								offset: 0,
								color: '#19daf7' || '#0cfcdc' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#0cfcdc' || '#19daf7' // 100% 处的颜色
							}]
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				}
			}, {
				name: 'gap',
				value: 100 - value,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0
					}
				}
			}]
		}]
	}
	return returnOption;
}

//分散课时chart demo
function fsksClassPeriodChartDemo(currentInfo){
	var returnOption=new Array();
	var value=0;
	if(currentInfo.peridoCount!=0){
		value=Math.floor(currentInfo.periodCompleteCount/currentInfo.peridoCount*100);
	}
	returnOption = {
		title: {
			text: `${value}%`,
			subtext: currentInfo.text,
			left: 'center',
			top: 'center',//top待调整
			textStyle: {
				color: '#fff',
				fontSize: 16,
				fontFamily: 'PingFangSC-Regular'
			},
			subtextStyle: {
				color: '#ff',
				fontSize:12,
				fontFamily: 'PingFangSC-Regular',
				top: 'center'
			},
			itemGap: -1//主副标题间距
		},
		tooltip: {
			trigger: 'item',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var all=parseInt(currentInfo.peridoCount);
				var noNum=parseInt(currentInfo.peridoCount)-parseInt(currentInfo.periodCompleteCount);
				var result = ''
				var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fc5919"></span>';
				var notHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:gray"></span>';
				result= "共"+all+ "个课时</br>"
					+ dotHtml +
					"已完成："+currentInfo.periodCompleteCount+ "</br>"+
					notHtml +
					"未完成："+noNum;
				return result
			},
			confine: true
		},
		series: [{
			name: currentInfo.text,
			type: 'pie',
			clockWise: true,
			radius: ['65%', '70%'],
			itemStyle: {
				normal: {
					label: {
						show: false
					},
					labelLine: {
						show: false
					}
				}
			},
			hoverAnimation: false,
			data: [{
				value: value,
				name: '已完成课时',
				itemStyle: {
					normal: {
						borderWidth: 25,
						borderColor: {
							colorStops: [{
								offset: 0,
								color: '#f7af0d' || '#fc5919' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#fc5919' || '#f7af0d' // 100% 处的颜色
							}]
						},
						color: { // 完成的圆环的颜色
							colorStops: [{
								offset: 0,
								color: '#f7af0d' || '#fc5919' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#fc5919' || '#f7af0d' // 100% 处的颜色
							}]
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						}
					}
				}
			}, {
				name: 'gap',
				value: 100 - value,
				itemStyle: {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: 'rgba(0, 0, 0, 0)',
						borderColor: 'rgba(0, 0, 0, 0)',
						borderWidth: 0
					}
				}
			}]
		}]
	}
	return returnOption;
}

//返回初始化页面
function returnConfigPage(){
	$(".visual_swiper2,.visual_swiperRight2,.visual_swiperRight3,.visual_swiperRightCourseCount").show();
	$(".visual_swiper2_2,#singleTeacheeTypeCount,#singleClassHourTypeCount,#singleCourseCount,#returnConfigPage").hide();

	//隐藏
	$('.smallBingtu').addClass('animated bounceOut');
	var wait = setInterval(function() {
		if (!$('.smallBingtu').is(":animated")) {
			$('.smallBingtu').removeClass('animated bounceOut').hide();
			clearInterval(wait);
		}
	}, 300);

	$('.centerMap').addClass('animated bounceIn').show();
	var wait1 = setInterval(function() {
		if (!$('.centerMap').is(":animated")) {
			$('.centerMap').removeClass('animated bounceIn');
			clearInterval(wait1);
		}
	}, 300);

	//教师类型分布
	var teacherTypeCountCharts=$(".teacheeTypeCountAppendArea").find('.chartDom1').length;
	if(teacherTypeCountCharts>1){
		mySwiper.autoplay.start();
	}

	//课时类型分布
	var classHourTypeCharts=$(".classHourTypeAppendArea").find('.chartDom1').length;
	if(classHourTypeCharts>1){
		mySwiperRight3.autoplay.start();
	}

	//授课情况统计
	$(".courseCountAppendArea").find('.swiper-slide:last').remove();
	var courseCountCharts=$(".courseCountAppendArea").find('.swiper-slide').length;
	if(courseCountCharts>1){
		mySwiper1.autoplay.start();
	}

	//学员人数统计
	var localStudentCountCharts=$(".localStudentInfoArea").find('.chartDom1').length;
	if(localStudentCountCharts>1){
		mySwiper2.autoplay.start();
	}
}

//初始化加载
function loadConfig(){
	var a = $('.visualSssf_left a')
	for (var i = 0; i < a.length; i++) {
		a[i].index = i;
		a[i].onclick = function () {
			for (var i = 0; i < a.length; i++) {
				a[i].className = ''
			}
			this.className = 'active'
		}
	}

	var sfzcllH = $('.sfzcll_box').height()
	var sfzcllHtwo = sfzcllH - 2
	$('.sfzcll_box').css('line-height', sfzcllH + 'px')
	$('.sfzcll_smallBk>div').css('line-height', sfzcllHtwo + 'px')

	//删除加载动画
	$('#load').fadeOut(1000)
	setTimeout(function () {
			$('#load').remove()
		}
		, 1100);
}

//根据设备分辨率改变table css
function changetableStyleByScreen(tableInfo){
	if(tableInfo.length<=2){
		return;
	}

	var screen=window.screen.width;
	var allth=$(".visual_left").find(".tableArea").find("tbody").find("tr").find("td");
	if(screen<=1366){
		$(".visual_left").find(".tableArea").find(".search").find("input")[0].style.height="17px";
		for (var i = 0; i < allth.length; i++) {
			allth[i].style.lineHeight=0.6;
		}
		$(".visual_left").find(".tableArea").find(".fixed-table-pagination").find(".pagination")[0].style.marginTop="1%";
	}else{
		$(".visual_left").find(".tableArea").find(".search").find("input")[0].style.height="25px";
		for (var i = 0; i < allth.length; i++) {
			allth[i].style.lineHeight=1.428571429;
		}
		$(".visual_left").find(".tableArea").find(".fixed-table-pagination").find(".pagination")[0].style.marginTop="4%";
	}
}

//chart自适应
function ListeneChart(){
	window.addEventListener("resize", function() {
		var currentShowPage=parseInt($(".currentShowPage")[0].innerText);
		if(currentShowPage==1){
			reloadPage1()
		}
	});
}

//page1 chart自适应
function reloadPage1(){
	var myChart;
	var chartDom1s=$(".chartDom1");
	for (var i = 0; i < chartDom1s.length; i++) {
		if(chartDom1s[i].id!==""){
			myChart = echarts.init(document.getElementById(chartDom1s[i].id));
			myChart.resize();
		}
	}
}

$(function () {
	loadConfig();
	loadChart();
	ListeneChart();
})






















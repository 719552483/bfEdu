$(function() {
    getMapInfo();
    getChartsInfo();
    getTableInfo();
    // changAction();
});

function getChartsInfo() {
    // $.ajax({
    // 	method : 'get',
    // 	cache : false,
    // 	url : "testJson/getIndexChartsInfo.json",
    // 	dataType : 'json',
    // 	success : function(backjson) {
    // 		showCostConsumption(backjson);
    // 		showMdc(backjson);
    // 		showOfficeCount(backjson);
    // 		showDoctorsStatistical(backjson);
    // 	}
    // });
    var backjson = 1;
    drawCharts(backjson, "全省");
}

function getTableInfo() {
    // 发送查询所有用户请求
    // $.ajax({
    //  method : 'get',
    //  cache : false,
    //  url : "/queryDrgGroupIntoInfo",
    //  dataType : 'json',
    //  success : function(backjson) {
    // 	 if (backjson.result) {
    // 		 stuffDrgGroupMangerTable(backjson);
    // 	 } else {
    // 		 jGrowlStyleClose('操作失败，请重试');
    // 	 }
    //  }
    // });
//	var tableInfo = {
//		"teachingPlaceInfo": [{
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点1",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点2",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点3",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点4",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点5",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点6",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点7",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点8",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点9",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点10",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点11",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点12",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点13",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点14",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点15",
//		}, {
//			"id": "id",
//			"studyLocal": "沈阳市**县",
//			"allStudent": 105,
//			"studyLocalName": "沈阳市教学点16",
//		}]
//	}

    var tableInfo = {
        "teachingPlaceInfo": [{
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点1",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点2",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点3",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点4",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点5",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点6",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点7",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点8",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点9",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点10",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点11",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点12",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点13",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点14",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent": "***",
            "studyLocalName": "沈阳市教学点15",
        }, {
            "id": "id",
            "studyLocal": "沈阳市**县",
            "allStudent":"***" ,
            "studyLocalName": "沈阳市教学点16",
        }]
    }
    stuffTeachingPlaceTable(tableInfo);
}

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
            drawMap("map", result, currentTeachLocal);
        });
    });
}

function drawMap(id, allMapJson, currentTeachLocal) {
    echarts.registerMap('liaoNing', allMapJson);
    var myChart = echarts.init(document.getElementById(id));

    option = {
        title: {
            text: '辽宁省教学点分布',
            subtext: "2019年学院高职扩招在籍学生6230人，其中第一批高职扩招在籍学生2931人，共设57个教学班\n第二批高职扩招学生3299人，共设85个教学班级。", //副标题 \n 用于换行
            itemGap: 15, //主副标题间距
            padding: [20, 10, 5, 5], //设置标题内边距,上，右，下，左
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
            left: 50,
            right: 50,
            top:40,
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
}

function stuffTeachingPlaceTable(tableInfo) {
    $('#teachingPlaceTable').bootstrapTable('destroy').bootstrapTable({
        data: tableInfo.teachingPlaceInfo,
        pagination: true,
        pageNumber: 1,
        pageSize: 4,
        pageList: [4],
        showToggle: false,
        showFooter: false,
        search: true,
        editable: false,
        striped: false,
        toolbar: '#toolbar',
        showColumns: false,
        columns: [{
            field: 'id',
            title: 'id',
            align: 'center',
            visible: false
        },
            {
                field: 'studyLocalName',
                title: '教学点名称',
                align: 'center'
            }, {
                field: 'studyLocal',
                title: '教学点地址',
                align: 'center'
            }, {
                field: 'allStudent',
                title: '学生人数',
                align: 'center'
            }, {
                field: 'action',
                title: '操作',
                align: 'center',
                formatter: teachingPlaceFormatter
            }
        ]
    });

    function teachingPlaceFormatter(value, row, index) {
        return ['<button type="button" class="btn btn-info myBtn myBtnNOLeft moreInfoBtn" id="moreInfo">教点详情</button>' +
        '<button type="button" id="samllVidebackConfig" class="btn btn-info myBtn myBtnNOLeft myBtnHaveRight hiddenBtn' +
        index + '">退出</button>'
        ]
            .join('');
    }

    $(".MyTableStyle").find(".bootstrap-table").find(".fixed-table-toolbar").find(".search")[0].className =
        "pull-left search";
    $(".MyTableStyle").find(".bootstrap-table").find(".fixed-table-toolbar").find(".search")[0].childNodes[0].placeholder =
        "搜索教学点详情"
}

function drawCharts(backjson, Range) {
    var attendanceInfo = [{
        name: '**市',
        type: 'line',
        data: [30, 20, 50, 70, 50, 85, 88]
    },
        {
            name: '***市',
            type: 'line',
            data: [40, 80, 52, 87, 53, 85, 90]
        },
        {
            name: '****市',
            type: 'line',
            data: [50, 50, 89, 32, 64, 97, 87]
        },
        {
            name: '*****市',
            type: 'line',
            data: [30, 54, 76, 56, 78, 77, 67]
        },
        {
            name: '******市',
            type: 'line',
            data: [30, 20, 50, 70, 50, 85, 100]
        }
    ];
    drawAttendanceCharts("attendance", attendanceInfo, Range);

    var maleToFemaleRatioInfo = {
        city: ['**市', '**市', '**市', '**市', '**市'],
        woman: [59, 57, 50, 49, 56],
        man: [41, 43, 50, 51, 44]
    }
    maleToFemaleRatioCharts("sexPart", maleToFemaleRatioInfo, Range);

    var occupationalDistributionInfo = [{
        value: 335,
        name: '工人',

    },
        {
            value: 310,
            name: '农民',

        },

        {
            value: 234,
            name: '退伍军人'
        },
        {
            value: 135,
            name: '再就业人员'
        },
        {
            value: 1548,
            name: '其他'
        }
    ];
    occupationalDistributionCharts("studentJob", occupationalDistributionInfo, Range);

    var classHourInfo = [120, 152, 200, 334, 290];
    classHourCharts("classHours", classHourInfo, Range);

    var avgMonthlyIncomeInfo = [6300, 4300, 3300, 4000, 5300];
    avgMonthlyIncome("income", avgMonthlyIncomeInfo, Range);

    var ageDistributionInfo = [{
        value: 335,
        name: '25岁-30岁'
    },
        {
            value: 310,
            name: '30岁-40岁'
        },
        {
            value: 274,
            name: '40岁-45岁'
        },
        {
            value: 400,
            name: '45岁-50岁'
        },
        {
            value: 235,
            name: '50岁以上'
        }
    ];
    ageDistribution("agePart", ageDistributionInfo, Range);
}

//左1上角考勤率
function drawAttendanceCharts(id, attendanceInfo, Range) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(id));

    option = {
        title: {
            text: Range + '考勤率',
            textStyle: {
                color: 'rgba(94, 173, 197, 0.81)',
                fontSize: '18'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['星期一', '星期二', '星期三', '星期四', '星期五'],
            axisLabel: { //改变X轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },

        },
        yAxis: {
            type: 'value',
            scale: true,
            show: true,
            splitLine: {
                show: false
            },
            axisLabel: { //改变y轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },

        },
        series: attendanceInfo
    };
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
}
//左1end

//左2男女比例
function maleToFemaleRatioCharts(id, maleToFemaleRatioInfo, Range) {

    var myChart = echarts.init(document.getElementById(id));
    option = {
        title: {
            text: Range + '男女学员占比',
            textStyle: {
                color: 'rgba(94, 173, 197, 0.81)',
                fontSize: '18'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{b}<br />{a0}{c0}%<br />{a1}{c1}%'
        },
        color: ['#009999', '#006699'],
        legend: {
            padding: [40, 10],
            data: ['男学员', '女学员'],
            textStyle: { //图例文字的样式
                color: '#ccc',
                fontSize: 12
            },

        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    return Math.abs(value); //负数取绝对值变正数
                }
            },
            axisLabel: { //改变X轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
            show: false,


        }],
        yAxis: [{
            type: 'category',
            axisLabel: { //改变y轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },


            axisTick: {
                show: false
            },
            data: maleToFemaleRatioInfo.city
        }],
        series: [{
            name: '男学员',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true
                }
            },
            data: maleToFemaleRatioInfo.man,
            itemStyle: {
                normal: {
                    color: 'rgba(4,249,249, 0.2)',
                    //这里修改了柱子的颜色以及透明度，
                }
            },
            barWidth: 16, // 控制柱子的宽度
            barGap: '60%' // 控制柱子的间隔

        },
            {
                name: '女学员',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'left'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        formatter: function(value) {
                            if (value.data < 0) {
                                return -value.data;
                            }
                        },
                    }
                },
                data: maleToFemaleRatioInfo.woman,
                itemStyle: {
                    normal: {
                        color: 'rgba(255,251,236, 0.2)',
                        //这里修改了柱子的颜色以及透明度，
                    }
                },
                barWidth: 16, // 控制柱子的宽度
                barGap: '60%' // 控制柱子的间隔
            }
        ]
    };
    myChart.setOption(option);
}
//左2end

//左3 职业分布
function occupationalDistributionCharts(id, occupationalDistributionInfo, Range) {
    var myChart = echarts.init(document.getElementById(id));
    //定义颜色数组
    option = {
        title: {
            text: Range + '职业占比',
            textStyle: {
                color: 'rgba(94, 173, 197, 0.81)',
                fontSize: '18'
            },
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        // 	orient: 'vertical',
        // 	x: 'left',
        // 	data: ['工人', '农民', '退伍军人', '再就业人员', '其他'],
        // 	textStyle: { //图例文字的样式
        // 		color: '#ccc',
        // 		fontSize: 12
        // 	},
        // },
        series: [{
            name: '职业分布',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                // normal: {
                // 	show: false,
                // 	position: 'center'
                // },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle: {
                normal: {
                    color: function(params) {
                        //自定义颜色
                        var colorList = [
                            'rgba(81, 211, 212, 0.68)', 'rgba(95, 208, 193, 0.84)',
                            'rgba(152, 245, 177, 0.68)', 'rgba(197, 170, 29, 0.72)', 'rgba(113, 203, 230, 0.78)'
                        ];
                        return colorList[params.dataIndex]
                    }
                }
            },
            // labelLine: {
            // 	normal: {
            // 		show: false
            // 	}
            // },
            data: occupationalDistributionInfo
        }]
    };
    myChart.setOption(option);
}
//左3end

//右1课时进度
function classHourCharts(id, classHourInfo, Range) {
    var myChart = echarts.init(document.getElementById(id));

    option = {
        title: {
            text: Range + '课时进度统计',
            textStyle: {
                color: 'rgba(96, 173, 197, 0.81)',
                fontSize: '18'
            },
            left: 'center'
        },
        color: 'rgba(79,174,172, 0.3)',
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['**市', '**市', '**市', '**市', '**市'],
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: { //改变X轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },

        }],
        yAxis: [{
            type: 'value',
            scale: true,
            show: true,
            splitLine: {
                show: false
            },
            axisLabel: { //改变y轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
        }],
        series: [{
            name: '完成课时',
            type: 'bar',
            barWidth: '60%',
            data: classHourInfo,
            barWidth: 18, // 控制柱子的宽度
            barGap: '60%' // 控制柱子的间隔
        }]
    };
    myChart.setOption(option);
}
//右1end

//右2平均月收入
function avgMonthlyIncome(id, avgMonthlyIncomeInfo, Range) {
    var myChart = echarts.init(document.getElementById(id));

    var option = {
        title: {
            text: Range + '学员就业月平均收入',
            textStyle: {
                color: 'rgba(96, 173, 197, 0.81)',
                fontSize: '18'
            },
            left: 'center'
        },
        color: 'rgba(207, 118, 105, 0.46)',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },

        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            scale: true,
            show: true,
            splitLine: {
                show: false
            },
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: { //改变X轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
        },
        yAxis: {

            axisLabel: { //改变X轴字体颜色
                show: true,
                textStyle: {
                    color: '#fff'
                }
            },
            type: 'category',
            data: ['**市', '**市', '**市', '**市', '**市']
        },
        series: [

            {

                type: 'bar',
                data: avgMonthlyIncomeInfo,
                barWidth: 18, // 控制柱子的宽度
                barGap: '60%' // 控制柱子的间隔
            }
        ]
    };
    myChart.setOption(option);
}
//右2end

//右3年龄分布
function ageDistribution(id, ageDistributionInfo, Range) {
    var myChart = echarts.init(document.getElementById(id));

    option = {

        title: {
            text: Range + '学员年龄分布',
            textStyle: {
                color: 'rgba(96, 173, 197, 0.81)',
                fontSize: '18'
            },
            left: 'center'
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [{
            name: '年龄分布',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: ageDistributionInfo.sort(function(a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            // label: {
            // 	normal: {
            // 		textStyle: {
            // 			color: 'rgba(17, 196, 197, 0.7)'
            // 		}
            // 	}
            // },
            // labelLine: {
            // 	normal: {
            // 		lineStyle: {
            // 			color: 'rgba(17, 196, 197, 0.7)'
            // 		},
            // 		smooth: 0.2,
            // 		length: 10,
            // 		length2: 20
            // 	}
            // },
            // itemStyle: {
            // 	normal: {
            // 		color: '#c23531',
            // 		shadowBlur: 200,
            // 		shadowColor: 'rgba(0, 0, 0, 0.5)'
            // 	},
            //
            // },
            itemStyle: {
                normal: {
                    shadowBlur: 500,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    color: function(params) {
                        //自定义颜色
                        var colorList = [
                            'rgb(94, 197, 184)', 'rgba(99, 206, 177, 0.76)',
                            'rgba(15, 179, 29, 0.45)', 'rgba(208, 187, 29, 0.67)', 'rgba(113, 203, 230, 0.78)'
                        ];
                        return colorList[params.dataIndex]
                    }
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function(idx) {
                return Math.random() * 200;
            }
        }]
    };
    myChart.setOption(option);
}
//右3end

// chart自适应
window.addEventListener("resize", function() {
    var myChart = echarts.init(document.getElementById('map'));
    myChart.resize();
    var myChart = echarts.init(document.getElementById('attendance'));
    myChart.resize();
    var myChart = echarts.init(document.getElementById('sexPart'));
    myChart.resize();
    var myChart = echarts.init(document.getElementById('studentJob'));
    myChart.resize();
    var myChart = echarts.init(document.getElementById('classHours'));
    myChart.resize();
    var myChart = echarts.init(document.getElementById('income'));
    myChart.resize();
    var myChart = echarts.init(document.getElementById('agePart'));
    myChart.resize();
});

//页面下拉框的change时间绑定
// function changAction(){
//
// }
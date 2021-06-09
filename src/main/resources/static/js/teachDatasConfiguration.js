var color = ['#e9df3d', '#f79c19', '#21fcd6', '#08c8ff', '#df4131'];



//交通工具流量
option2 = {

    tooltip: {//鼠标指上时的标线
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: ['类型1', '类型2', '类型3'],
        right: '10px',
        top: '0px',
        textStyle: {
            fontSize: 12,
            color: '#fff'
        }
    },
    grid: {
        x: 35,
        y: 25,
        x2: 8,
        y2: 25,
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
            lineStyle: {
                color: '#57617B'
            }
        },
        axisLabel: {
            textStyle: {
                color:'#fff',
            },
        },
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }],
    yAxis: [{
        type: 'value',
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#57617B',

            }
        },
        axisLabel: {
            margin: 10,
            textStyle: {
                fontSize: 14
            },
            textStyle: {
                color:'#fff',
            },
        },
        splitLine: {
            lineStyle: {
                color: 'rgba(255,255,255,.2)',
                type:'dotted',
            }
        }
    }],
    series: [{
        name: '类型1',
        type: 'line',
        smooth: true,
        lineStyle: {
            normal: {
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                }, {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(137,189,27)'
            }
        },
        data: [20,35,34,45,52,41,49,64,24,52.4,24,33]
    }, {
        name: '类型2',
        type: 'line',
        smooth: true,
        lineStyle: {
            normal: {
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0, 136, 212, 0.3)'
                }, {
                    offset: 0.8,
                    color: 'rgba(0, 136, 212, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(0,136,212)'
            }
        },
        data: [97.3,99.2,99.3,100.0,99.6,90.6,80.0,91.5,69.8,67.5,90.4,84.9]
    }, {
        name: '类型3',
        type: 'line',
        smooth: true,
        lineStyle: {
            normal: {
                width: 2
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(219, 50, 51, 0.3)'
                }, {
                    offset: 0.8,
                    color: 'rgba(219, 50, 51, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: 'rgb(219,50,51)'
            }
        },
        data: [84.2,81.0,67.5,62.1,43.7,68.5,51.9,71.8,76.7,67.6,62.9,0]
    }, ]
};

var shadowColor = '#374b86';
var value = 85;
option6 = {

    title: {
        //text: `${value}万辆`,
        text: `2019第二批`,
        subtext: '共60周',
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

    series: [{
        name: 'pie1',
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
            name: 'completed',
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

var shadowColor = '#374b86';
var value = 46;
option7 = {

    title: {
        //text: `${value}万辆`,
        text: `2020第一批`,
        subtext: '共65周',
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

    series: [{
        name: 'pie1',
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
            name: 'completed',
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
//////////////////////今日实时收费 end

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};
var geoCoordMap = {
    "海门":[121.15,31.89],
    "鄂尔多斯":[109.781327,39.608266],
    "招远":[120.38,37.35],
    "舟山":[122.207216,29.985295],
    "齐齐哈尔":[123.97,47.33],
    "盐城":[120.13,33.38],
    "赤峰":[118.87,42.28],
    "青岛":[120.33,36.07],
    "乳山":[121.52,36.89],
    "金昌":[102.188043,38.520089],
    "泉州":[118.58,24.93],
    "莱西":[120.53,36.86],
    "日照":[119.46,35.42],
    "胶南":[119.97,35.88],
    "南通":[121.05,32.08],
    "拉萨":[91.11,29.97],
    "云浮":[112.02,22.93],
    "梅州":[116.1,24.55],
    "文登":[122.05,37.2],
    "上海":[121.48,31.22],
    "攀枝花":[101.718637,26.582347],
    "威海":[122.1,37.5],
    "承德":[117.93,40.97],
    "厦门":[118.1,24.46],
    "汕尾":[115.375279,22.786211],
    "潮州":[116.63,23.68],
    "丹东":[124.37,40.13],
    "太仓":[121.1,31.45],
    "曲靖":[103.79,25.51],
    "烟台":[121.39,37.52],
    "福州":[119.3,26.08],
    "瓦房店":[121.979603,39.627114],
    "即墨":[120.45,36.38],
    "抚顺":[123.97,41.97],
    "玉溪":[102.52,24.35],
    "张家口":[114.87,40.82],
    "阳泉":[113.57,37.85],
    "莱州":[119.942327,37.177017],
    "湖州":[120.1,30.86],
    "汕头":[116.69,23.39],
    "昆山":[120.95,31.39],
    "宁波":[121.56,29.86],
    "湛江":[110.359377,21.270708],
    "揭阳":[116.35,23.55],
    "荣成":[122.41,37.16],
    "连云港":[119.16,34.59],
    "葫芦岛":[120.836932,40.711052],
    "常熟":[120.74,31.64],
    "东莞":[113.75,23.04],
    "河源":[114.68,23.73],
    "淮安":[119.15,33.5],
    "泰州":[119.9,32.49],
    "南宁":[108.33,22.84],
    "营口":[122.18,40.65],
    "惠州":[114.4,23.09],
    "江阴":[120.26,31.91],
    "蓬莱":[120.75,37.8],
    "韶关":[113.62,24.84],
    "嘉峪关":[98.289152,39.77313],
    "广州":[113.23,23.16],
    "延安":[109.47,36.6],
    "太原":[112.53,37.87],
    "清远":[113.01,23.7],
    "中山":[113.38,22.52],
    "昆明":[102.73,25.04],
    "寿光":[118.73,36.86],
    "盘锦":[122.070714,41.119997],
    "长治":[113.08,36.18],
    "深圳":[114.07,22.62],
    "珠海":[113.52,22.3],
    "宿迁":[118.3,33.96],
    "咸阳":[108.72,34.36],
    "铜川":[109.11,35.09],
    "平度":[119.97,36.77],
    "佛山":[113.11,23.05],
    "海口":[110.35,20.02],
    "江门":[113.06,22.61],
    "章丘":[117.53,36.72],
    "肇庆":[112.44,23.05],
    "大连":[121.62,38.92],
    "临汾":[111.5,36.08],
    "吴江":[120.63,31.16],
    "石嘴山":[106.39,39.04],
    "沈阳":[123.38,41.8],
    "苏州":[120.62,31.32],
    "茂名":[110.88,21.68],
    "嘉兴":[120.76,30.77],
    "长春":[125.35,43.88],
    "胶州":[120.03336,36.264622],
    "银川":[106.27,38.47],
    "张家港":[120.555821,31.875428],
    "三门峡":[111.19,34.76],
    "锦州":[121.15,41.13],
    "南昌":[115.89,28.68],
    "柳州":[109.4,24.33],
    "三亚":[109.511909,18.252847],
    "自贡":[104.778442,29.33903],
    "吉林":[126.57,43.87],
    "阳江":[111.95,21.85],
    "泸州":[105.39,28.91],
    "西宁":[101.74,36.56],
    "宜宾":[104.56,29.77],
    "呼和浩特":[111.65,40.82],
    "成都":[104.06,30.67],
    "大同":[113.3,40.12],
    "镇江":[119.44,32.2],
    "桂林":[110.28,25.29],
    "张家界":[110.479191,29.117096],
    "宜兴":[119.82,31.36],
    "北海":[109.12,21.49],
    "西安":[108.95,34.27],
    "金坛":[119.56,31.74],
    "东营":[118.49,37.46],
    "牡丹江":[129.58,44.6],
    "遵义":[106.9,27.7],
    "绍兴":[120.58,30.01],
    "扬州":[119.42,32.39],
    "常州":[119.95,31.79],
    "潍坊":[119.1,36.62],
    "重庆":[106.54,29.59],
    "台州":[121.420757,28.656386],
    "南京":[118.78,32.04],
    "滨州":[118.03,37.36],
    "贵阳":[106.71,26.57],
    "无锡":[120.29,31.59],
    "本溪":[123.73,41.3],
    "克拉玛依":[84.77,45.59],
    "渭南":[109.5,34.52],
    "马鞍山":[118.48,31.56],
    "宝鸡":[107.15,34.38],
    "焦作":[113.21,35.24],
    "句容":[119.16,31.95],
    "北京":[116.46,39.92],
    "徐州":[117.2,34.26],
    "衡水":[115.72,37.72],
    "包头":[110,40.58],
    "绵阳":[104.73,31.48],
    "乌鲁木齐":[87.68,43.77],
    "枣庄":[117.57,34.86],
    "杭州":[120.19,30.26],
    "淄博":[118.05,36.78],
    "鞍山":[122.85,41.12],
    "溧阳":[119.48,31.43],
    "库尔勒":[86.06,41.68],
    "安阳":[114.35,36.1],
    "开封":[114.35,34.79],
    "济南":[117,36.65],
    "德阳":[104.37,31.13],
    "温州":[120.65,28.01],
    "九江":[115.97,29.71],
    "邯郸":[114.47,36.6],
    "临安":[119.72,30.23],
    "兰州":[103.73,36.03],
    "沧州":[116.83,38.33],
    "临沂":[118.35,35.05],
    "南充":[106.110698,30.837793],
    "天津":[117.2,39.13],
    "富阳":[119.95,30.07],
    "泰安":[117.13,36.18],
    "诸暨":[120.23,29.71],
    "郑州":[113.65,34.76],
    "哈尔滨":[126.63,45.75],
    "聊城":[115.97,36.45],
    "芜湖":[118.38,31.33],
    "唐山":[118.02,39.63],
    "平顶山":[113.29,33.75],
    "邢台":[114.48,37.05],
    "德州":[116.29,37.45],
    "济宁":[116.59,35.38],
    "荆州":[112.239741,30.335165],
    "宜昌":[111.3,30.7],
    "义乌":[120.06,29.32],
    "丽水":[119.92,28.45],
    "洛阳":[112.44,34.7],
    "秦皇岛":[119.57,39.95],
    "株洲":[113.16,27.83],
    "石家庄":[114.48,38.03],
    "莱芜":[117.67,36.19],
    "常德":[111.69,29.05],
    "保定":[115.48,38.85],
    "湘潭":[112.91,27.87],
    "金华":[119.64,29.12],
    "岳阳":[113.09,29.37],
    "长沙":[113,28.21],
    "衢州":[118.88,28.97],
    "廊坊":[116.7,39.53],
    "菏泽":[115.480656,35.23375],
    "合肥":[117.27,31.86],
    "武汉":[114.31,30.52],
    "大庆":[125.03,46.58]
};
option9 = {
    title: {
        text: ' ',
        sublink: ' ',
        x:'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            return params.name + ' : ' + params.value[2];
        }
    },
    legend: {
        orient: 'vertical',
        y: 'bottom',
        x:'right',
        data:['pm2.5'],
        textStyle: {
            color: '#fff'
        }
    },
    visualMap: {
        min: 0,
        max: 200,
        calculable: true,
        color: ['#d94e5d','#eac736','#50a3ba'],
        textStyle: {
            color: '#fff'
        }
    },
    geo: {
        map: 'china',
        label: {
            emphasis: {
                show: false
            }
        },
        itemStyle: {
            normal: {
                areaColor: 'rgba(127,199,221,0.1)',
                borderColor: '#0177ff'
            },
            emphasis: {
                areaColor: '#071537'//鼠标指上市时的颜色
            }
        }
    },
    series: [
        {
            name: ' ',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData([
                {name: "海门", value: 9},
                {name: "鄂尔多斯", value: 12},
                {name: "招远", value: 12},
                {name: "舟山", value: 12},
                {name: "齐齐哈尔", value: 14},
                {name: "盐城", value: 15},
                {name: "赤峰", value: 16},
                {name: "青岛", value: 18},
                {name: "乳山", value: 18},
                {name: "金昌", value: 19},
                {name: "泉州", value: 21},
                {name: "莱西", value: 21},
                {name: "日照", value: 21},
                {name: "胶南", value: 22},
                {name: "南通", value: 23},
                {name: "拉萨", value: 24},
                {name: "云浮", value: 24},
                {name: "梅州", value: 25},
                {name: "文登", value: 25},
                {name: "上海", value: 25},
                {name: "攀枝花", value: 25},
                {name: "威海", value: 25},
                {name: "承德", value: 25},
                {name: "厦门", value: 26},
                {name: "汕尾", value: 26},
                {name: "潮州", value: 26},
                {name: "丹东", value: 27},
                {name: "太仓", value: 27},
                {name: "曲靖", value: 27},
                {name: "烟台", value: 28},
                {name: "福州", value: 29},
                {name: "瓦房店", value: 30},
                {name: "即墨", value: 30},
                {name: "抚顺", value: 31},
                {name: "玉溪", value: 31},
                {name: "张家口", value: 31},
                {name: "阳泉", value: 31},
                {name: "莱州", value: 32},
                {name: "湖州", value: 32},
                {name: "汕头", value: 32},
                {name: "昆山", value: 33},
                {name: "宁波", value: 33},
                {name: "湛江", value: 33},
                {name: "揭阳", value: 34},
                {name: "荣成", value: 34},
                {name: "连云港", value: 35},
                {name: "葫芦岛", value: 35},
                {name: "常熟", value: 36},
                {name: "东莞", value: 36},
                {name: "河源", value: 36},
                {name: "淮安", value: 36},
                {name: "泰州", value: 36},
                {name: "南宁", value: 37},
                {name: "营口", value: 37},
                {name: "惠州", value: 37},
                {name: "江阴", value: 37},
                {name: "蓬莱", value: 37},
                {name: "韶关", value: 38},
                {name: "嘉峪关", value: 38},
                {name: "广州", value: 38},
                {name: "延安", value: 38},
                {name: "太原", value: 39},
                {name: "清远", value: 39},
                {name: "中山", value: 39},
                {name: "昆明", value: 39},
                {name: "寿光", value: 40},
                {name: "盘锦", value: 40},
                {name: "长治", value: 41},
                {name: "深圳", value: 41},
                {name: "珠海", value: 42},
                {name: "宿迁", value: 43},
                {name: "咸阳", value: 43},
                {name: "铜川", value: 44},
                {name: "平度", value: 44},
                {name: "佛山", value: 44},
                {name: "海口", value: 44},
                {name: "江门", value: 45},
                {name: "章丘", value: 45},
                {name: "肇庆", value: 46},
                {name: "大连", value: 47},
                {name: "临汾", value: 47},
                {name: "吴江", value: 47},
                {name: "石嘴山", value: 49},
                {name: "沈阳", value: 50},
                {name: "苏州", value: 50},
                {name: "茂名", value: 50},
                {name: "嘉兴", value: 51},
                {name: "长春", value: 51},
                {name: "胶州", value: 52},
                {name: "银川", value: 52},
                {name: "张家港", value: 52},
                {name: "三门峡", value: 53},
                {name: "锦州", value: 54},
                {name: "南昌", value: 54},
                {name: "柳州", value: 54},
                {name: "三亚", value: 54},
                {name: "自贡", value: 56},
                {name: "吉林", value: 56},
                {name: "阳江", value: 57},
                {name: "泸州", value: 57},
                {name: "西宁", value: 57},
                {name: "宜宾", value: 58},
                {name: "呼和浩特", value: 58},
                {name: "成都", value: 58},
                {name: "大同", value: 58},
                {name: "镇江", value: 59},
                {name: "桂林", value: 59},
                {name: "张家界", value: 59},
                {name: "宜兴", value: 59},
                {name: "北海", value: 60},
                {name: "西安", value: 61},
                {name: "金坛", value: 62},
                {name: "东营", value: 62},
                {name: "牡丹江", value: 63},
                {name: "遵义", value: 63},
                {name: "绍兴", value: 63},
                {name: "扬州", value: 64},
                {name: "常州", value: 64},
                {name: "潍坊", value: 65},
                {name: "重庆", value: 66},
                {name: "台州", value: 67},
                {name: "南京", value: 67},
                {name: "滨州", value: 70},
                {name: "贵阳", value: 71},
                {name: "无锡", value: 71},
                {name: "本溪", value: 71},
                {name: "克拉玛依", value: 72},
                {name: "渭南", value: 72},
                {name: "马鞍山", value: 72},
                {name: "宝鸡", value: 72},
                {name: "焦作", value: 75},
                {name: "句容", value: 75},
                {name: "北京", value: 79},
                {name: "徐州", value: 79},
                {name: "衡水", value: 80},
                {name: "包头", value: 80},
                {name: "绵阳", value: 80},
                {name: "乌鲁木齐", value: 84},
                {name: "枣庄", value: 84},
                {name: "杭州", value: 84},
                {name: "淄博", value: 85},
                {name: "鞍山", value: 86},
                {name: "溧阳", value: 86},
                {name: "库尔勒", value: 86},
                {name: "安阳", value: 90},
                {name: "开封", value: 90},
                {name: "济南", value: 92},
                {name: "德阳", value: 93},
                {name: "温州", value: 95},
                {name: "九江", value: 96},
                {name: "邯郸", value: 98},
                {name: "临安", value: 99},
                {name: "兰州", value: 99},
                {name: "沧州", value: 100},
                {name: "临沂", value: 103},
                {name: "南充", value: 104},
                {name: "天津", value: 105},
                {name: "富阳", value: 106},
                {name: "泰安", value: 112},
                {name: "诸暨", value: 112},
                {name: "郑州", value: 113},
                {name: "哈尔滨", value: 114},
                {name: "聊城", value: 116},
                {name: "芜湖", value: 117},
                {name: "唐山", value: 119},
                {name: "平顶山", value: 119},
                {name: "邢台", value: 119},
                {name: "德州", value: 120},
                {name: "济宁", value: 120},
                {name: "荆州", value: 127},
                {name: "宜昌", value: 130},
                {name: "义乌", value: 132},
                {name: "丽水", value: 133},
                {name: "洛阳", value: 134},
                {name: "秦皇岛", value: 136},
                {name: "株洲", value: 143},
                {name: "石家庄", value: 147},
                {name: "莱芜", value: 148},
                {name: "常德", value: 152},
                {name: "保定", value: 153},
                {name: "湘潭", value: 154},
                {name: "金华", value: 157},
                {name: "岳阳", value: 169},
                {name: "长沙", value: 175},
                {name: "衢州", value: 177},
                {name: "廊坊", value: 193},
                {name: "菏泽", value: 194},
                {name: "合肥", value: 229},
                {name: "武汉", value: 273},
                {name: "大庆", value: 279}
            ]),
            symbolSize: 12,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }
        }
    ]
}
//////////////////////收费站收费量 end

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


//chart自适应
function ListeneChart(){
    window.addEventListener("resize", function() {
        var myChart = echarts.init(document.getElementById('main1'));
        myChart.resize();

        myChart = echarts.init(document.getElementById('main2'));
        myChart.resize();

        myChart = echarts.init(document.getElementById('main3'));
        myChart.resize();

        myChart = echarts.init(document.getElementById('main31'));
        myChart.resize();

        var allRight3=$(".localStudentInfoArea").find(".swiper-slide");
        for (var i = 0; i < allRight3.length; i++) {
            myChart = echarts.init(document.getElementById(allRight3[i].id));
            myChart.resize();
        }

        myChart = echarts.init(document.getElementById('main5'));
        myChart.resize();

        myChart = echarts.init(document.getElementById('main6'));
        myChart.resize();

        myChart = echarts.init(document.getElementById('main7'));
        myChart.resize();

        myChart = echarts.init(document.getElementById('main8'));
        myChart.resize();
    });
}

//加载chart
function loadChart(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getBigScreenData",
        dataType : 'json',
        success : function(backjson) {
            if(backjson.code===200){
                //右1
                var studentAgeData=reStuffData(backjson.data.studentAgeData);
                var studentJobData =reStuffData(backjson.data.studentJobData);
                option3 = {
                    tooltip: {
                        show: true,
                        trigger: "item"
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
                option31 = {
                    tooltip: {
                        show: true,
                        trigger: "item"
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
                drawRight1(option3,option31);

                //右2
                drawRight2(backjson.data.pointInfo);

                //右3
                var seriesdata=backjson.data.studentsInLocal.seriesdata;
                var yAxisData=backjson.data.studentsInLocal.yAxisData;
                var seriesdatas = [];
                var yAxisDatas = [];

                //每五个五一组
                for(var i=0;i<seriesdata.length;i+=5){
                    seriesdatas.push(seriesdata.slice(i,i+5));
                }
                for(var i=0;i<yAxisData.length;i+=5){
                    yAxisDatas.push(yAxisData.slice(i,i+5));
                }
                drawRight3(seriesdatas,yAxisDatas);
            }
        }
    });


    //学院开课数量
    var option1 = {
        grid: {
            left: '0',
            top: '30',
            right: '0',
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

            }

        },

        xAxis: {

            type: 'category',

            data: ["字段1","字段2","字段3","字段4","字段5","字段6","字段7","字段8","字段9"],

            axisTick: { //---坐标轴 刻度

                show: true, //---是否显示

            },

            axisLine: { //---坐标轴 轴线

                show: true, //---是否显示

                lineStyle: {

                    color: 'rgba(255,255,255,.1)',

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

            splitLine: {//分割线

                show: true,

                lineStyle: {
                    color: 'rgba(255,255,255,.1)',

                    width: 1,
                    type: 'dotted'

                }

            },

            axisLabel: {//Y轴刻度值

                formatter: '{value}',

                textStyle: {

                    fontSize: 12,

                    color: '#fff'

                },

            },

            axisLine: { //---坐标轴 轴线

                show: false, //---是否显示

            },

        },

        series: [{

            name: '类型1',

            type: 'bar',

            data: [3, 7, 4, 9, 3, 5,9, 3, 5],

            barWidth: 15,

            barGap: 0.5, //柱子之间间距 //柱图宽度      两种情况都要设置，设置series 中对应数据柱形的itemStyle属性下的emphasis和normal的barBorderRadius属性初始化时候圆角  鼠标移上去圆角

            itemStyle: {

                normal: {
                    barBorderRadius: 50,
                    color: "#446ACF",

                }

            },

        }, {

            name: '类型2',

            type: 'bar',
            data: [6, 2, 5, 2, 5, 6,9, 3, 5],
            barWidth: 15, //柱图宽度
            barGap: 0.5,
            itemStyle: {

                normal: { //设置颜色的渐变
                    barBorderRadius: 50,
                    color: "#4fb69d",

                }

            },

        }]

    };
    drawLeft1(option1);

    //交通工具流量
    var myChart2 = echarts.init(document.getElementById('main2'));
    myChart2.setOption(option2);

    //各类型扩招人数
    drawCenter1(option1);

    //中间地图
    getMapInfo();
}

//左1
function  drawLeft1(option1){
    var myChart1 = echarts.init(document.getElementById('main1'));
    myChart1.setOption(option1);
}

//中1
function  drawCenter1(option1,option2,option3){
    var value =80;
    option5 = {
        title: {
            // text: `${value}万辆`,
            text: `2019第一批`,
            subtext: '共65周',
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

        series: [{
            name: 'pie1',
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
                name: 'completed',
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
    var myChart5 = echarts.init(document.getElementById('main5'));
    myChart5.setOption(option5);
    var myChart6 = echarts.init(document.getElementById('main6'));
    myChart6.setOption(option6);
    var myChart7 = echarts.init(document.getElementById('main7'));
    myChart7.setOption(option7);
}

//右1
function drawRight1(option3,option31){
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

//右2
function drawRight2(tableInfo) {
    $('#rightTable').bootstrapTable('destroy').bootstrapTable({
        data:tableInfo,
        pagination: true,
        pageNumber: 1,
        pageSize:3,
        pageList: [3],
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
                field: 'pointName',
                title: '任务点名称',
                align: 'center'
            }, {
                field: 'action',
                title: '操作',
                align: 'center',
                width:'20px',
                formatter: teachingPlaceFormatter
            }
        ]
    });

    function teachingPlaceFormatter(value, row, index) {
        return ['<button type="button" id="moreInfo" class="btn btn-info myBtn moreInfo moreInfo'+index+'" >教点详情</button>' +
        '<button type="button" id="return" class="btn btn-info myBtn noneStart returnBtn returnBtn' +index + '">返回</button>'
        ]
            .join('');
    }

    $(".tableArea").show();
}

//右3
function drawRight3(seriesdatas,yAxisDatas){
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
        str=' <div class="swiper-slide" id="main'+i+'"></div>';
        $(".localStudentInfoArea").append(str);
        var myRight3= echarts.init(document.getElementById('main'+i));
        myRight3.setOption(stuffOption);
    }

    if(seriesdatas.length>1){
        var mySwiper2 = new Swiper('.visual_swiper2', {
            autoplay: true,//可选选项，自动滑动
            direction: 'vertical',//可选选项，滑动方向 vertical||horizontal
            speed: 1000,//可选选项，滑动速度
        });
    }
}

//右1饼图 重新渲染backjson中的chart数据
function reStuffData(data){
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

$(function () {
    judgementPWDisModifyFromImplements();
    loadConfig();
    loadChart();
    ListeneChart();
})























//跳转指定页面
function pointPage(eve){
	window.location.href = eve.classList[0]+".html";
}

/*
显示所有可选快捷方式
*/
function showAllShortcuts() {
	if ($(".placeul").find("li").length < 2) {
		$(".placeul").append('<li><a>添加常用快捷键</a></li>'); //更改位置
	}
	$(".configIndexPage,.moreNoticeArea").hide();
	$(".allShortcuts").show();
	drawAllShortcuts();
	allShortcutsDrawChoosend();
	shortcutsMouseAction();
}

/*
根据菜单渲染所有待选快捷键
*/
function drawAllShortcuts() {
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	$(".allShortcuts").find(".bacimg").remove();

	for (var i = 0; i < currentMenus.length; ++i) {
		if(currentMenus[i].parentElement.style.display!=="none"){
			$(".allShortcuts").append('<div class="bacimg ' + currentMenus[i].id + '">' +
				'<div class="choosingArea">' +
				'<img src="img/' + currentMenus[i].id + '.png" />' +
				'<div class="cover">' +
				'已选' +
				'</div>' +
				'</div>' +
				'<h2><a>' + currentMenus[i].innerText + '</a></h2>' +
				'<p><a class="wantAddShortcut">添加</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="giveupAddShortcut">取消</a></p>' +
				'</div>');
		}
	}
}

/*
渲染已选快捷键
*/
function allShortcutsDrawChoosend() {
	var choosedShortcutsArray = new Array;
	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		choosedShortcutsArray.push($(".choosendShortcuts").find("li")[i].classList[0])
	}
	var allShortcuts = $(".allShortcuts").find(".bacimg");
	for (var i = 0; i < allShortcuts.length; ++i) {
		if (choosedShortcutsArray.indexOf(allShortcuts[i].classList[1]) === -1) {
			$(".allShortcuts").find("." + allShortcuts[i].classList[1]).removeClass("imgSha");
			$("." + allShortcuts[i].classList[1]).find(".cover").hide();
			allShortcuts[i].setAttribute("choosed", false);
		} else {
			$(".allShortcuts").find("." + allShortcuts[i].classList[1]).addClass("imgSha");
			$("." + allShortcuts[i].classList[1]).find(".cover").show();
			allShortcuts[i].setAttribute("choosed", true);
		}
	}
}

/*
鼠标移入移出
*/
function shortcutsMouseAction() {
	$(".allShortcuts").on('mouseover', '.bacimg', function(e) {
		if (e.currentTarget.childNodes[0].childNodes[1].style.display === "none") {
			e.currentTarget.childNodes[0].childNodes[1].style.display = "block";
			e.currentTarget.childNodes[0].childNodes[1].firstChild.data = "选择";
		}
		e.currentTarget.classList.add("imgSha");
	}).on('mouseout', '.bacimg', function(e) {
		if (e.currentTarget.attributes[1].nodeValue === "false") {
			e.currentTarget.childNodes[0].childNodes[1].style.display = "none";
			e.currentTarget.classList.remove("imgSha");
		}
	});
}

/*
快捷方式区域按钮绑定事件
*/
function ShortcutsButtonBind() {
	$('#addShortcuts').unbind('click');
	$('#addShortcuts').bind('click', function(e) {
		addShortcuts();
		e.stopPropagation();
	});

	$('#shortcutsRefresh').unbind('click');
	$('#shortcutsRefresh').bind('click', function(e) {
		shortcutsRefresh();
		e.stopPropagation();
	});

	$(".allShortcuts").on('click', '.wantAddShortcut,.cover', function(e) {
		wantAddShortcut(e);
		e.stopPropagation();
	});

	$(".allShortcuts").on('click', '.giveupAddShortcut', function(e) {
		giveupAddShortcut(e.srcElement.parentNode.parentNode);
		e.stopPropagation();
	});
}

/*
快捷方式上方确定按钮
*/
function addShortcuts() {
	var oldShortcutsList = new Array;
	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		oldShortcutsList.push($(".choosendShortcuts").find("li")[i].classList[0]);
	}
	var newShortcutsList = new Array;
	for (var i = 0; i < $(".bacimg").length; ++i) {
		if ($(".bacimg")[i].attributes[1].nodeValue === "true") {
			newShortcutsList.push($(".bacimg")[i].classList[1]);
		}
	}

	if (!isSameArray(newShortcutsList, oldShortcutsList)) {
		$.showModal("#remindModal",true);
		$(".remindType").html("快捷方式");
		$(".remindActionType").html("修改");
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			readyToReloadShortcutsList();
			e.stopPropagation();
		});
	} else {
		toastr.warning('暂未进行任何操作');
	}
}

/*
预备添加
*/
function wantAddShortcut(e) {
	if (e.srcElement.offsetParent.attributes[1].nodeValue === "true") {
		e.srcElement.offsetParent.className = e.srcElement.offsetParent.className + " animated shake";
		//动画执行完后删除类名
		reomveAnimation('.bacimg', "animated shake");
	} else {
		e.srcElement.offsetParent.childNodes[0].childNodes[1].style.display = "block";
		e.srcElement.offsetParent.childNodes[0].childNodes[1].firstChild.data = "已选";
		e.srcElement.offsetParent.setAttribute("choosed", true);
	}
}

/*
取消预备添加
*/
function giveupAddShortcut(e) {
	if (e.attributes[1].nodeValue === "true") {
		e.childNodes[0].childNodes[1].style.display = "none";
		e.classList.remove("imgSha");
		e.setAttribute("choosed", false);
	} else {
		e.className = e.className + " animated shake";
		//动画执行完后删除类名
		reomveAnimation('.bacimg', "animated shake");
	}
}

/*
重置按钮
*/
function shortcutsRefresh() {
	var currentALLShortcuts = $(".bacimg");
	$(".bacimg").removeClass("imgSha");
	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		if (i <= 5) {
			currentALLShortcuts[i].attributes[1].nodeValue = true;
			currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "block";
			currentALLShortcuts[i].classList.add("imgSha");
		} else {
			currentALLShortcuts[i].attributes[1].nodeValue = false;
			currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "none";
		}
	}

	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].style.display = "block";
	}
	reDrawSelect('#authorityGroup', '全部', '全部');
}

/*
全选按钮
*/
function shortcutsAllChose() {
	var currentALLShortcuts = $(".bacimg");
	$(".bacimg").removeClass("imgSha");
	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].attributes[1].nodeValue = true;
		currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "block";
		var oldClass = currentALLShortcuts[i].className;
		currentALLShortcuts[i].className = oldClass + ' imgSha';
	}

	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].style.display = "block";
	}
	reDrawSelect('#authorityGroup', '全部', '全部');
}

/*
获得新选择快捷方式
*/
function readyToReloadShortcutsList() {
	var allShortcuts = $(".bacimg");
	var currentShortcutList = new Array();
	var newShortcut ="";

	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		currentShortcutList.push($(".choosendShortcuts").find("li")[i].classList[0]);
	}

	for (var i = 0; i < allShortcuts.length; ++i) {
		if (allShortcuts[i].attributes[1].nodeValue === "true") {
			newShortcut+=allShortcuts[i].classList[1]+",";
		}
	}
	
	
	$.ajax({
		method: 'get',
		cache: false,
		url: "/newShortcut",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName").attr("userid"),
			"newShortcut":newShortcut.substring(0,newShortcut.length-1)
		},
		dataType: 'json',
		success: function(backjson) {
			if (backjson.code === 200) {
				for (var i = 0; i < allShortcuts.length; ++i) {
					reloadShortcutsList(allShortcuts[i], currentShortcutList, i);
					
					var userInfo = JSON.parse($.session.get('userInfo'));
					userInfo.yxkjfs=newShortcut.substring(0,newShortcut.length-1);
					$.session.remove('userInfo');
					$.session.set('userInfo', JSON.stringify(userInfo));
					
					$.hideModal();
					$(".allShortcuts,.moreNoticeArea").hide();
					$(".configIndexPage").show();
					$(".placeul").find("li:eq(1)").remove();
				}
				toastr.success(backjson.msg);
			} else {
				toastr.warning('操作失败');
			}
		}
	});
}

/*
重新渲染首页已选快捷方式
*/
function reloadShortcutsList(thisShortcuts, currentShortcutList, index) {
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	if (thisShortcuts.attributes[1].nodeValue === "true" && currentShortcutList.indexOf(thisShortcuts.classList[1]) ===
		-1) {
		addChoosendShortcut(thisShortcuts.classList[1], currentMenus[index].innerText);
	} else if (thisShortcuts.attributes[1].nodeValue === "false") {
		removeChoosendShortcut(thisShortcuts.classList[1]);
	}
}

/*
添加已选快捷方式至list
*/
function addChoosendShortcut(className, TextName) {
	$(".choosendShortcuts").append('<li onclick="pointPage(this)" class="' + className +
		'"><img class="choosedShortcutsIcon" src="img/' + className +
		'.png" />' +
		'<p>' + TextName + '</a></p>' +
		'</li>');
}

/*
在list删除快捷方式
*/
function removeChoosendShortcut(className) {
	$(".choosendShortcuts").find("." + className).remove();
}

//获取所有角色类型
function drawAuthorityGroup() {
	var str = '<option value="all">所有权限</option>';
	var allMenuParents = $(parent.frames["leftFrame"].document).find(".leftmenu").find('dd'); //frame获取父窗口中的menu
	for (var i = 0; i < allMenuParents.length; i++) {
		if (i !== 0&&allMenuParents[i].style.display!=="none") {
			str += '<option value="' + allMenuParents[i].firstElementChild.innerText + '">' + allMenuParents[i].firstElementChild.innerText + '</option>';
		}
	}
	$("#authorityGroup").append(str);
	$('.isSowIndex').selectMania(); //初始化下拉框
}

//权限分类下拉框事件绑定
function authorityGroupChange() {
	$("#authorityGroup").change(function() {
		groupChangeAction();
	})
}

//权限分类下拉框事件
function groupChangeAction() {
	var currentGroup = $('#authorityGroup').selectMania('get')[0].value;
	var allAuthoritys = $(".allShortcuts").find(".bacimg");
	if (currentGroup === "all") {
		for (var i = 0; i < allAuthoritys.length; ++i) {
			allAuthoritys[i].style.display = "block";
		}
	} else if (currentGroup === "系统管理") {
		for (var i = 0; i < allAuthoritys.length; ++i) {
			allAuthoritys[i].style.display = "none";
		}
		$(".allShortcuts").find(".addAccount").show();
		$(".allShortcuts").find(".authoritysConfiguration").show();
	} else {
		var allMenuParents = $(parent.frames["leftFrame"].document).find(".leftmenu").find('.title'); //frame获取父窗口中的menu
		var showMenuson;
		var showMenusonArray = new Array();
		for (var i = 0; i < allMenuParents.length; ++i) {
			if (allMenuParents[i].innerText == currentGroup) {
				showMenuson = allMenuParents[i].nextElementSibling.children;
			}
		}

		for (var i = 0; i < showMenuson.length; ++i) {
			showMenusonArray.push(showMenuson[i].innerText);
		}

		for (var i = 0; i < allAuthoritys.length; ++i) {
			if (showMenusonArray.indexOf(allAuthoritys[i].childNodes[1].innerText) !== -1) {
				allAuthoritys[i].style.display = "block";
			} else if (showMenusonArray.indexOf(allAuthoritys[i].childNodes[1].innerText) === -1) {
				allAuthoritys[i].style.display = "none";
			}
		}
	}
}

//加载通知
function loadNotices(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getNotices",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code===200) {
			    drawNotices(backjson.data);
			}else{
				drawNotices([]);
			}
		}
	});
}

//渲染通知区域
function drawNotices(allNotices){
	$(".newlist").empty();
	var str="";
	var stffNum=0;
	for (var i = 0; i < allNotices.length; i++) {
		if(allNotices[i].showInIndex==="T"&&stffNum<=6){
			stffNum++;
			str+='<a href="noticeHTMLmodel.html?newId=' + allNotices[i].edu700_ID +'"><li class="NoticeChildren" id="'+allNotices[i].edu700_ID+'">'+allNotices[i].title+'<b>'+allNotices[i].sendDate+'</b></li></a>';
		}
	}
	
	if(str.length===0){
		str='<li class="NoNotice">暂未发布任何重要通知...</li>';
		$(".noticeArea").find("a").remove();
	}
	
	$(".newlist").append(str);
}

//更多按钮
function moreNotices(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getMoreNotice",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code===200) {
				var isShowNum=$(".newlist").find("a").length;
				if(isShowNum===backjson.data.length){
					toastr.warning("暂无更多通知");
					return;
				}else{
					stuffMoreNoctices(backjson.data);
					$(".moreNoticeArea").show();
					$(".allShortcuts,.configIndexPage,.versionInfo,.xline:last").hide();
				}
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//加载更多通知
function stuffMoreNoctices(moreInfo){
	$(".newlist2").empty();
	var str="";
	for (var i = 0; i < moreInfo.length; i++) {
		str+='<a href="noticeHTMLmodel.html?newId=' + moreInfo[i].edu700_ID +'"><li class="NoticeChildren" id="'+moreInfo[i].edu700_ID+'">'+moreInfo[i].title+'<b>'+moreInfo[i].sendDate+'</b></li></a>';
	}
	$(".newlist2").append(str);
}

/*
加载用户信息
*/
function loadUserScdlsj() {
	//渲染用户信息
	var userInfo = JSON.parse($.session.get('userInfo'));
	if(userInfo.scdlsj==="fristTime"){
		$(".longinInfo").hide();
	}else{
		$(".longinInfo").find("i").html("您上次登录的时间：<br>"+userInfo.scdlsj);
		$(".longinInfo").show();
	}
}

//返回按钮
function returnBack(){
	$(".configIndexPage,.versionInfo,.xline:last").show();
	$(".allShortcuts,.moreNoticeArea").hide();
}

//填充chart
function stuffChart(){
     // getChartInfo();
	stuffChart1();
	stuffChart2();
}

//chart1
function  stuffChart1(){
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById("chart1"));
	option = {
		title: {
			text: '专业基础信息',
			textStyle: {
				color: 'rgba(94, 173, 197, 0.81)',
				fontSize: '14'
			},
			padding: [5, 10],
			left: 'left'
		},
		tooltip: {
			trigger: 'axis'
		},
		dataZoom : [
			{
				type: 'slider',
				show: true,
				start: 0,
				end: 30, //默认展示的个数
				height: 20,//这里可以设置dataZoom的尺寸
				xAxisIndex: [0],
			},
		],
		legend: {
			textStyle: { //图例文字的样式
				fontSize: 10
			},
		},
		tooltip: {},
		dataset: {
			source: [
				['product', '行政班数量', '学生数量', '老师数量'],
				['畜牧兽医', 10, 85,50],
				['会计', 43, 85, 93],
				['电气自动化技术', 43, 85, 93],
				['高尔夫球运动与管理', 43, 85, 93],
				['计算机网络技术', 43, 85, 93],
				['信息安全与管理', 43, 85, 93],
				['园艺技术', 43, 85, 93],
				['电子商务', 43, 85, 93],
				['作物生产技术', 43, 85, 93],
				['农村金融', 43, 85, 93],
				['食品加工技术', 43, 85, 97]
			]
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {},
		series: [
			{
				type: 'bar',
				itemStyle: {
					normal: {
						label: {
							show: true, //开启显示
							position: 'top', //在上方显示
							textStyle: { //数值样式
								color: 'rgb(22,178,209)',
								fontSize: 12
							}
						}
					}
				},
				color: 'rgba(22,178,209,0.66)'
			},
			{
				type: 'bar',
				itemStyle: {
					normal: {
						label: {
							show: true, //开启显示
							position: 'top', //在上方显示
							textStyle: { //数值样式
								color: 'rgb(248,89,12)',
								fontSize: 12
							}
						}
					}
				},
				color: 'rgba(248,89,12,0.64)'
			},
			{
				type: 'bar',
				itemStyle: {
					normal: {
						label: {
							show: true, //开启显示
							position: 'top', //在上方显示
							textStyle: { //数值样式
								color: 'rgb(143,201,22)',
								fontSize: 12
							}
						}
					}
				},
				color: 'rgba(143,201,22,0.64)'
			},
		]
	};

	// 使用刚指定的配置项和数据显示图表
	myChart.setOption(option);
}

//chart2
function  stuffChart2(){
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById("chart2"));
	option = {
		title: {
			text: '课时分布',
			textStyle: {
				color: 'rgba(94, 173, 197, 0.81)',
				fontSize: '14'
			}
		},
		legend: {
			textStyle: { //图例文字的样式
				fontSize: 10
			},
		},
		color: 'rgba(22,178,209,0.66)',
		tooltip: {
			trigger: 'axis',
			axisPointer: {            // 坐标轴指示器，坐标轴触发有效
				type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function (params) {
				var tar = params[1];
				return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
			}
		},
		grid: {
			left: '7%',
			right: '10%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			splitLine: {show: false},
			data: ['总学时','理论学时', '实践学时', '分散学时', '集中学时']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				name: '',
				type: 'bar',
				stack: '总量',
				itemStyle: {
					barBorderColor: 'rgba(0,0,0,0)',
					color: 'rgba(0,0,0,0)'
				},
				emphasis: {
					itemStyle: {
						barBorderColor: 'rgba(0,0,0,0)',
						color: 'rgba(0,0,0,0)'
					}
				},
				data: [0, 220, 0, 220, 0]
			},
			{
				name: '学时',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside'
				},
				data: [400, 180, 220, 180, 220]
			}
		]
	};
	// 使用刚指定的配置项和数据显示图表
	myChart.setOption(option);
}

// chart自适应
function chartListener(){
	// chart自适应
	window.addEventListener("resize", function() {
		var myChart = echarts.init(document.getElementById('chart1'));
		myChart.resize();
		var myChart = echarts.init(document.getElementById('chart2'));
		myChart.resize();
	});
}

$(function() {
	loadUserScdlsj();
	ShortcutsButtonBind();
	drawAuthorityGroup();
	loadNotices();
	loadChoosendShortcuts();
	stuffChart();
	chartListener();

	//返回首页事件绑定
	$('.backIndex').unbind('click');
	$('.backIndex').bind('click', function(e) {
		backToIndex();
		e.stopPropagation();
	});

	//返回按钮
	$('.returnBackBtn').unbind('click');
	$('.returnBackBtn').bind('click', function(e) {
		returnBack();
		e.stopPropagation();
	});

	//权限分类下拉框事件绑定
	$("#authorityGroup").change(function() {
		groupChangeAction();
	})

	//全选快捷键
	$('#shortcutsAllChose').unbind('click');
	$('#shortcutsAllChose').bind('click', function(e) {
		shortcutsAllChose();
		e.stopPropagation();
	});

	//更多通知
	$('.moreNotices').unbind('click');
	$('.moreNotices').bind('click', function(e) {
		moreNotices();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
});

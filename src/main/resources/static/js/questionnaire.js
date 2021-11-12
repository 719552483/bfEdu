$(function() {
	judgementPWDisModifyFromImplements();
	btnBind();
	var role=JSON.parse($.session.get('userInfo')).js.split(",");
	getAllQuestion(role);
	chartListener();
});

//获取可做的问卷
function getAllQuestion(role){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAllQuestionByUserId",
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
			if(backjson.code==200){
				if(role.length>1){
					stuffAllQuestionTable(backjson.data,false);
				}else if(role.length<=1&&role[0]==="学生"){
					stuffAllQuestionTable(backjson.data,true);
				}
			}else{
				if(role.length>1){
					stuffAllQuestionTable({},false);
				}else if(role.length<=1&&role[0]==="学生"){
					stuffAllQuestionTable({},true);
				}
				toastr.warning(backjson.msg);
			}
		}
	});
}

/*
	*渲染所有问卷表
	*不是学生渲染所有  只有结果统计按钮
	*否则渲染可做的问卷  只有开始答题按钮
* */
function stuffAllQuestionTable(tableInfo,isStudent){
	window.releaseNewsEvents = {
		'click #answerCount' : function(e, value, row, index) {
			answerCount(row);
		},
		'click #beginAnswer' : function(e, value, row, index) {
			beginAnswer(row);
		}
	};

	$('#allQuestionTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [10],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		showExport: false,      //是否显示导出
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : !isStudent?true:false,
		onPageChange : function() {
			drawPagination(".allQuestionTableArea", "问卷");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
		{
			field : 'edu801_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		},{
				title: '序号',
				align: 'center',
				class:'tableNumberTd',
				formatter: tableNumberMatter
			},{
			field : 'title',
			title : '问卷标题',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'permissionsName',
			title : '所属二级学院',
			align : 'left',
			sortable: true,
			visible : !isStudent?true:false,
			formatter :paramsMatter
		}, {
			field : 'personName',
			title : '作者',
			align : 'left',
			sortable: true,
			visible : !isStudent?true:false,
			formatter : paramsMatter
		},{
			field : 'createDate',
			title : '生成时间',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'num',
			title : '答题人数',
			align : 'left',
			sortable: true,
			visible : !isStudent?true:false,
			formatter : numMatter
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			formatter : releaseNewsFormatter,
			events : releaseNewsEvents,
		}]
	});

	function releaseNewsFormatter(value, row, index) {
		if(!isStudent){
			return [ '<ul class="toolbar tabletoolbar">'
			+ '<li id="answerCount"><span><img src="images/i05.png" style="width:24px"></span>结果统计</li>'
			+ '</ul>' ].join('');
		}else{
			return [ '<ul class="toolbar tabletoolbar">'
			+ '<li id="beginAnswer"><span><img src="images/d02.png" style="width:24px"></span>开始答题</li>'
			+ '</ul>' ].join('');
		}
	}

	function numMatter(value, row, index) {
		var str='';
		value==0?str='暂时无人答题..':str=value+'人';
		return [ '<div class="myTooltip normalTxt" title="'+str+'">'+str+'</div>' ]
			.join('');
	}

	drawPagination(".allQuestionTableArea", "问卷");
	drawSearchInput(".allQuestionTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".allQuestionTableArea", "问卷");
}

//开始答题
function beginAnswer(row){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/questionsAnswer",
		data: {
			"edu801Id":JSON.stringify(row.edu801_ID),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
		},
		dataType: 'json',
		beforeSend: function (xhr) {
			requestErrorbeforeSend();
		},
		error: function (textStatus) {
			requestError();
		},
		complete: function (xhr, status) {
			requestComplete();
		},
		success: function (backjson) {
			hideloding();
			if (backjson.code==200) {
				$('#doQuestionModal').MultiStep({
					data:reMarkSingleQuestion(backjson.data.allQuestions),
					final:'确认提交问卷？',
					title:backjson.data.title,
					finalLabel:'提交',
					prevText:'上一个',
					nextText:'下一个',
					skipText:'跳过',
					finishText:'确认提交',
					modalSize:'lg'
				});

				$.showModal("#doQuestionModal",true);
				$("#doQuestionModal").find(".modal-header").find(".close").find("span").html('');
				$("#doQuestionModal").addClass("finalCheckCssArea");
				toolTipUp(".tooltipCite");
				$("#edu108Id").html(row.edu801_ID);

				//提示框取消按钮
				$("#doQuestionModal").find(".modal-header").find(".close").unbind('click');
				$("#doQuestionModal").find(".modal-header").find(".close").bind('click', function(e) {
					$.hideModal();
					e.stopPropagation();
				});

			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充问卷的问题
function reMarkSingleQuestion(allQuestions){
	var returnArray=new Array();
	for (var i = 0; i < allQuestions.length; i++) {
		var questionObject=new Object();
		if(allQuestions[i].type==="radio"){
			questionObject=drawRadio(allQuestions[i],i);
		}else if(allQuestions[i].type==="check"){
			questionObject=drawCheck(allQuestions[i],i);
		}else if(allQuestions[i].type==="rate"){
			questionObject=drawRate(allQuestions[i],i);
		}else if(allQuestions[i].type==="answer"){
			questionObject=drawAnswer(allQuestions[i],i);
		}
		returnArray.push(questionObject);
	}
	return returnArray;
}

//渲染单选题
function drawRadio(info,index){
	var returnObject=new Object();
	var str='<div class="singleA_Q singleA_Q'+info.edu802_ID+'" type="'+info.type+'">'+
		'<span class="questionTitle"><p class="questionTxt">'+info.title+'</p></span>';
	for (var i = 0; i < info.ckeckOrRaidoInfo.length; i++) {
		var singleInfo=info.ckeckOrRaidoInfo[i];
		str+='<div class="col4 giveBottom overArea">'
			+'<input type="radio" name="Q'+singleInfo.edu802_ID+'" class="blue noneOutline" value="'+singleInfo.edu803_ID+'"/><cite class="tooltipCite" title="'+singleInfo.checkOrRadioText+'">'+singleInfo.checkOrRadioText
			+ '</cite></div>';
	}
	str+='</div>';

	returnObject.content=str;
	returnObject.label=(index+1).toString();
	returnObject.skip=true;
	return returnObject;
}

//渲染多选题
function drawCheck(info,index){
	var returnObject=new Object();
	var str='<div class="singleA_Q singleA_Q'+info.edu802_ID+'" type="'+info.type+'">'+
		'<span class="questionTitle"><p class="questionTxt">'+info.title+'</p></span>';
	for (var i = 0; i < info.ckeckOrRaidoInfo.length; i++) {
		var singleInfo=info.ckeckOrRaidoInfo[i];
		str+='<div class="col4 giveBottom overArea">'
			+'<input type="checkbox" name="Q'+singleInfo.edu802_ID+'" class="blue noneOutline" value="'+singleInfo.edu803_ID+'"/><cite class="tooltipCite" title="'+singleInfo.checkOrRadioText+'">'+singleInfo.checkOrRadioText
			+ '</cite></div>';
	}
	str+='</div>';

	returnObject.content=str;
	returnObject.label=(index+1).toString();
	returnObject.skip=true;
	return returnObject;
}

//渲染评分题
function drawRate(info,index){
	var returnObject=new Object();
	var str='<div class="singleA_Q singleA_Q'+info.edu802_ID+'" type="'+info.type+'">' +
		'<fieldset class="starability-slot starability-growRotate">' +
		'<span class="questionTitle"><p class="questionTxt">'+info.title+'</p></span>';
	for (var i = 5; i > 0; i--) {
		str+='<input type="radio" id="rate'+info.edu802_ID+i+'" name="Q'+info.edu802_ID+'" value="'+i+'" />'
			+'<label for="rate'+info.edu802_ID+i+'" title="'+i+'分" class="tooltipCite">'+i+'分</label>';
	}
	str+='</fieldset></div>';

	returnObject.content=str;
	returnObject.label=(index+1).toString();
	returnObject.skip=true;
	return returnObject;
}

//渲染简答题
function drawAnswer(info,index){
	var returnObject=new Object();
	var str='<div class="singleA_Q singleA_Q'+info.edu802_ID+'" type="'+info.type+'">'+
		'<span class="questionTitle">' +
		'<p class="questionTxt">'+info.title+'</p>' +
		'</span>'
		+'<textarea style="width: 480px;max-width: 500px;margin-top: -10px;margin-left:0px " maxlength="300"  type="text" class="breakOptionTextArea" id="Q'+info.edu802_ID+'" placeholder="请回答(最多300个字符,中文2个，英文1个)..." />'
		+'</div>';

	returnObject.content=str;
	returnObject.label=(index+1).toString();
	returnObject.skip=true;
	return returnObject;
}

//获取答题结果并关闭模态框
function getQuestionRs(){
	var returnArray=new Array();
	var allArea=$("#doQuestionModal").find(".singleA_Q");
	for (var i = 0; i < allArea.length; i++) {
		var returnObject=new Object();
		var type=allArea[i].attributes[1].nodeValue;
		var currentId=allArea[i].classList[1].replace("singleA_Q","");
		if(type==="radio"||type==="rate"){
			returnObject.type=type;
			returnObject.questionId=currentId;
			typeof $('input:radio[name="Q'+currentId+'"]:checked').val()==="undefined"?returnObject.answer='':returnObject.answer=$('input:radio[name="Q'+currentId+'"]:checked').val();
		}else if(type==="check"){
			var checkBoxVlue=new Array();
			returnObject.type=type;
			returnObject.questionId=currentId;
			$('input:checkbox[name="Q'+currentId+'"]:checked').each(function() {
				checkBoxVlue.push($(this).val());
			});
			returnObject.answer=checkBoxVlue;
		}else if(type==="answer"){
			returnObject.type=type;
			returnObject.questionId=currentId;
			returnObject.answer=$("#Q"+currentId).val();
		}
		returnArray.push(returnObject);
	}
	checkAnswer(returnArray);
}

//检查答案信息
function checkAnswer(answers){
	var noAnswerNum=0;
	for (var i = 0; i <answers.length; i++) {
		if(typeof answers[i].answer==="string"){
			if(answers[i].answer===""){
				noAnswerNum++;
			}
		}else{
			if(answers[i].answer.length==0){
				noAnswerNum++;
			}
		}
	}

	if(noAnswerNum==answers.length){
		toastr.warning('暂未答题');
		return;
	}

	sendAnswer(answers)
}

//发送答案信息
function sendAnswer(answers){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/answerQuestion",
		data: {
			"edu801Id":$("#edu108Id")[0].innerText,
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"questionDetail":JSON.stringify(answers)
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
				toastr.success("问卷提交成功");
				$.hideModal();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
	$.hideModal();
}

//查看问卷结果统计
function answerCount(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchQuestionStatistical",
		data: {
			"edu801Id":row.edu801_ID
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
				$(".allArea").hide();
				$(".answerCountArea").show();
				$(".questionCountChart,.msgBox").remove();
				stuffCountChart(backjson.data);
				$(".questionCountTitle").html('问卷 -<cite>'+row.title+'</cite>- 结果分析展示:');

				//返回主页面
				$('#returnAll').unbind('click');
				$('#returnAll').bind('click', function(e) {
					$(".allArea").show();
					$(".answerCountArea").hide();
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充统计chart
function stuffCountChart(countInfo){
	for (var i = 0; i < countInfo.length; i++) {
		if(countInfo[i].type==="radio"){
			$(".countChartArea").append('<div class="questionCountChart col1" id="radio_chart'+i+'" style="height: 312px;"></div>')
			drawRadioCount("radio_chart"+i,countInfo[i],i);
		}else if(countInfo[i].type==="check"){
			$(".countChartArea").append('<div class="questionCountChart col1" id="check_chart'+i+'" style="height: 312px;"></div>')
			drawCheckCount("check_chart"+i,countInfo[i],i);
		}else if(countInfo[i].type==="rate"){
			$(".countChartArea").append('<div class="questionCountChart col1" id="rete_chart'+i+'" style="height: 312px;"></div>')
			drawRateCount("rete_chart"+i,countInfo[i],i);
		}else if(countInfo[i].type==="answer"){
			drawAnswerCount("answer_Area"+i,countInfo[i],i);
		}
	}
}

//单选结果统计模板
function drawRadioCount(drawId,radioInfo,index){
	var myChart = echarts.init(document.getElementById(drawId));
	option = {
		title: {
			text:'Q'+(index+1)+'- '+radioInfo.title,
			textStyle: {
				color: 'rgba(94, 173, 197, 0.81)',
				fontSize: '20'
			}
		},
		legend: {
			show:false
		},
		animationEasing: 'elasticOut',
		color: 'rgba(22,178,209,0.66)',
		tooltip: {
			trigger: 'axis',
			axisPointer: {            // 坐标轴指示器，坐标轴触发有效
				type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function (params) {
				var tar = params[1];
				return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value+'人';
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
			splitLine: {show: false},
			data: radioInfo.titleList
		},
		yAxis: {
			name: '人数',
			splitLine: {show: true},
			minInterval: 1,
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
				data: radioInfo.hiddenList
			},
			{
				name: '人数',
				type: 'bar',
				stack: '总量',
				label: {
					show: true,
					position: 'inside'
				},
				data: radioInfo.numberList
			}
		]
	};

	myChart.setOption(option);
}

//多选结果统计模板
function drawCheckCount(drawId,checkInfo,index){
	var myChart = echarts.init(document.getElementById(drawId));
	option = {
		title: {
			text:'Q'+(index+1)+'- '+checkInfo.title,
			textStyle: {
				color: 'rgba(94, 173, 197, 0.81)',
				fontSize: '20'
			}
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {            // 坐标轴指示器，坐标轴触发有效
				type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function (params) {
				var tar= params[0];
				return tar.name + '<br/>'+
					'人数: ' + tar.value[1]+'人';
			}
		},
		color: 'rgba(22,178,209,0.66)',
		animationEasing: 'elasticOut',
		dataset: {
			source: checkInfo.checkList
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: {name: '人数',minInterval: 1},
		yAxis: {splitLine: {show: false},type: 'category'},
		series: [
			{
				type: 'bar',
				encode: {
					// Map the "amount" column to X axis.
					x: '人数',
					// Map the "product" column to Y axis
					y: 'product'
				}
			}
		]
	};
	myChart.setOption(option);
}

//评分结果统计模板
function drawRateCount(drawId,reteInfo,index){
	var myChart = echarts.init(document.getElementById(drawId));
	option = {
		title: {
			text:'Q'+(index+1)+'- '+reteInfo.title,
			textStyle: {
				color: 'rgba(94, 173, 197, 0.81)',
				fontSize: '20'
			}
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			},
			formatter: function (params) {
				var num= params[0];
				var percent = params[1];
				return num.name + '<br/>'+
					num.seriesName + ' : ' + num.value+'人<br/>'+
					percent.seriesName + ' : ' + percent.value+'%';
			}
		},
		legend: {
			left: 'center',
			bottom:'bottom',
			data: ['人数', '百分比']
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
				data: ['1颗星', '2颗星', '3颗星', '4颗星', '5颗星'],
				axisPointer: {
					type: 'shadow'
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '人数',
				minInterval: 1,
				splitLine: {show: true},
				axisLabel: {
					formatter: '{value} 人'
				}
			},
			{
				type: 'value',
				splitLine: {show: false},
				name: '百分比',
				min: 0,
				max: 100,
				interval: 20,
				axisLabel: {
					formatter: '{value} %'
				}
			}
		],
		series: [
			{
				name: '人数',
				type: 'bar',
				color: 'rgba(22,178,209,0.66)',
				data: reteInfo.peopleNum
			},
			{
				name: '百分比',
				type: 'line',
				yAxisIndex: 1,
				color: 'rgba(221,25,20,0.94)',
				data: reteInfo.percentageList
			}
		]
	};

	myChart.setOption(option);
}

//简答题展示模板
function drawAnswerCount(drawId,answerInfo,index){
	var str='<div class="col1 msgBox" id="'+drawId+'">'+
			'<div class="title">Q'+(index+1)+'- '+answerInfo.title+'</div>'+
			'<div class="list"><ul>';

	for (var i = 0; i < answerInfo.result.length; i++) {
		str+='<li>' +
			'<div class="userPic"><img src="images/i07.png" style="width: 100%;"/></div>' +
			'<div class="content">' +
			'<div class="userName"><a>'+answerInfo.result[i].user_Name+'</a>:</div>'+
			'<div class="msgInfo">'+answerInfo.result[i].answer+'</div>'+
			'<div class="times"><span>'+answerInfo.result[i].createDate+'</span></div>'+
			'</div>'+
			'</li>';
	}

	str+='</ul></div></div>';
	$(".countChartArea").append(str);
}

// chart自适应
function chartListener(){
	window.addEventListener("resize", function() {
		var resizeElements=$('.questionCountChart');
		for (var i = 0; i < resizeElements.length; i++) {
			var id=resizeElements[i].id;
			var myChart = echarts.init(document.getElementById(id));
			myChart.resize();
		}
	});
}

//页面按钮事件绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}
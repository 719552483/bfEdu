$(function() {
	btnBind();
	var role=JSON.parse($.session.get('userInfo')).js.split(",");
	getAllQuestion(role);
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
			// questionDetails(row);
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
	// $.ajax({
	// 	method : 'get',
	// 	cache : false,
	// 	url : "/",
	// 	data: {
	// 		"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
	// 		"SearchCriteria":JSON.stringify(serachObject)
	// 	},
	// 	dataType : 'json',
	// 	beforeSend: function(xhr) {
	// 		requestErrorbeforeSend();
	// 	},
	// 	error: function(textStatus) {
	// 		requestError();
	// 	},
	// 	complete: function(xhr, status) {
	// 		requestComplete();
	// 	},
	// 	success : function(backjson) {
	// 		hideloding();
	// 		if (backjson.code === 200) {
	// 			toastr.info(backjson.msg);
	// 			stuffAdministrationClassTable(backjson.data);
	// 		} else {
	// 			drawAdministrationClassEmptyTable();
	// 			toastr.warning(backjson.msg);
	// 		}
	// 	}
	// });
	$.hideModal();
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
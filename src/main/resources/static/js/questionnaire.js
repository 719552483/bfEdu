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
					data:[{
						content:'Hi!!',
						label:'1',
						skip:true
					},{
						content:'This is a multi-step modal',
						skip:true
					},{
						content:`You can have skip options`,
						skip:true
					},{
						content:`<small>You can include html content as well!</small><br><br>
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>
                `,
						skip:true
					},{
						content:`This is the end<br>Hold your breath and count to ten`,
						skip:true
					}],
					final:'确认提交问卷？',
					title:'问卷',
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

//页面按钮事件绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}
$(function() {
	judgementPWDisModifyFromImplements();
	deafultSearch();
	getMajorTrainingSelectInfo();
	drawStudentBaseInfoEmptyTable();
	btnControl();
	binBind();
	getYearInfo();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

//获取学年信息
function getYearInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAllXn",
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code === 200) {
				stuffYearSelect(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充学年下拉框
function stuffYearSelect(yearInfo){
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < yearInfo.length; i++) {
		str += '<option value="' + yearInfo[i].edu400_ID + '">' + yearInfo[i].xnmc
			+ '</option>';
	}
	stuffManiaSelect("#xn", str);
	stuffManiaSelect("#loadForXn", str);
	stuffManiaSelect("#confirmGradeForXn", str);
	stuffManiaSelect("#cancelGradeForXn", str);
	stuffManiaSelect("#loadNotPassForXn", str);
	stuffManiaSelect("#gradeFreesForXn", str);
}

//初始化检索
function deafultSearch(){
	var returnObject = new Object();
	returnObject.level = "";
	returnObject.department = "";
	returnObject.grade = "";
	returnObject.major = "";
	returnObject.xnid = "";
	returnObject.className = "";
	returnObject.courseName = "";
	returnObject.studentNumber = "";
	returnObject.studentName = "";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryGrades",
		data: {
			"SearchCriteria":JSON.stringify(returnObject),
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
				stuffStudentBaseInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawStudentBaseInfoEmptyTable();
			}
		}
	});
}

//获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
	SelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		if(getNormalSelectValue("major")===""){
			return;
		}
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryGrades",
			data: {
				"SearchCriteria":JSON.stringify(getSearchObject()),
				"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
			},
			dataType : 'json',
			success : function(backjson) {
				if (backjson.code===200) {
					stuffStudentBaseInfoTable(backjson.data);
				} else {
					toastr.warning(backjson.msg);
					drawStudentBaseInfoEmptyTable();
				}
			}
		});
	});
}

//填充空的学生表
function drawStudentBaseInfoEmptyTable() {
	stuffStudentBaseInfoTable({});
}

//渲染学生表
function stuffStudentBaseInfoTable(tableInfo) {
	window.releaseNewsEvents = {
		'click #wantGradeEntry': function(e, value, row, index) {
			wantGradeEntry(row,index);
		},
		'click #comfirmGradeEntry': function(e, value, row, index) {
			comfirmGradeEntry(row,index);
		},
		'click #cancelGradeEntry': function(e, value, row, index) {
			cancelGradeEntry(row,index);
		},
		'click #wantGradeFree': function(e, value, row, index) {
			wantGradeFree(row,index);
		},
		'click #reExamInfo': function(e, value, row, index) {
			reExamInfo(row,index);
		}
	};

	$('#gradeEntryTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
		    fileName: '学生成绩导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".studentBaseInfoTableArea", "学生信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		onDblClickRow : function(row, $element, field) {
			var index =parseInt($element[0].dataset.index);
			wantGradeEntry(row,index);
		},
		columns: [
			{
				field: 'edu005_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			}, {
				field: 'className',
				title: '行政班',
				align: 'left',
				sortable: true,
				formatter: xzbnameMatter
			},{
				field: 'xn',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},  {
				field: 'studentName',
				title: '姓名',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'studentCode',
				title: '学号',
				align: 'left',
				sortable: true,
				visible: false,
				formatter: paramsMatter
			} ,{
				field: 'grade',
				title: '成绩',
				align: 'left',
				sortable: true,
				formatter: gradeMatter
			}, {
				field: 'isMx',
				title: '免修状态',
				align: 'center',
				width:'10',
				sortable: true,
				formatter: isMxMatter
			},{
				field: 'isResit',
				title: '是否补考',
				align: 'center',
				sortable: true,
				width:'10',
				formatter: isResitMatter
			},{
				field: 'exam_num',
				title: '补考次数',
				align: 'left',
				sortable: true,
				visible: true,
				formatter: examNnumMatter
			} ,
			{
				field: 'isConfirm',
				title: '成绩确认',
				align: 'center',
				sortable: true,
				width:'10',
				formatter: isConfirmMatter
			},{
				field: 'gradeEnter',
				title: '录入人',
				align: 'left',
				sortable: true,
				formatter: gradeEnterMatter
			},{
				field: 'entryDate',
				title: '录入时间',
				align: 'left',
				sortable: true,
				formatter: entryDateMatter
			},  {
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: releaseNewsFormatter,
				events: releaseNewsEvents,
			}
		]
	});

	function releaseNewsFormatter(value, row, index) {
		if(row.isConfirm==="T"){//成绩是否确认
			var isMx=true;//是否免修
			var isPass=true;//是否及格
			row.isMx==="0"||row.isMx==="05"||row.isMx==null||typeof row.isMx==="undefined"?isMx=false:isMx=true;
			row.grade==="T"||row.grade>=60?isPass=true:isPass=false;
			if(isMx){
				return [
					'<ul class="toolbar tabletoolbar">' +
					'<li id="wantGradeFree" class="insertBtn wantGradeFree'+index+'"><span><img src="images/d07.png" style="width:24px"></span>免修</li>' +
					'</ul>'
				]
					.join('');
			}else{
				if(isPass){
					if(row.exam_num!=null&&row.exam_num>0){
						return [
							'<ul class="toolbar tabletoolbar">' +
							'<li id="reExamInfo" class="queryBtn reExamInfo'+index+'"><span><img src="images/i06.png" style="width:24px"></span>补考记录</li>' +
						'</ul>'
						]
							.join('');
					}else{
						return [
							'<div class="myTooltip normalTxt" title="暂无操作">暂无操作</div>'
						]
							.join('');
					}
				}else{
					if(row.exam_num!=null&&row.exam_num>0){
						if(row.exam_num<5){
							return [
								'<ul class="toolbar tabletoolbar">' +
								'<li id="wantGradeEntry" class="insertBtn wantGradeEntry'+index+'"><span><img src="images/t01.png" style="width:24px"></span>录入</li>' +
								'<li id="reExamInfo" class="queryBtn reExamInfo'+index+'"><span><img src="images/i06.png" style="width:24px"></span>补考记录</li>' +
								'<li id="wantGradeFree" class="insertBtn wantGradeFree'+index+'"><span><img src="images/d07.png" style="width:24px"></span>免修</li>' +
								'<li id="comfirmGradeEntry" class="noneStart comfirmGradeEntry'+index+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
								'<li id="cancelGradeEntry" class="noneStart cancelGradeEntry'+index+'"><span><img src="images/t03.png"></span>取消</li>' +
								'</ul>'
							]
								.join('');
						}else{
							return [
								'<ul class="toolbar tabletoolbar">' +
								'<li id="reExamInfo" class="queryBtn reExamInfo'+index+'"><span><img src="images/i06.png" style="width:24px"></span>补考记录</li>' +
								'</ul>'
							]
								.join('');
						}
					}else{
						return [
							'<ul class="toolbar tabletoolbar">' +
							'<li id="wantGradeEntry" class="insertBtn wantGradeEntry'+index+'"><span><img src="images/t01.png" style="width:24px"></span>录入</li>' +
							'<li id="wantGradeFree" class="insertBtn wantGradeFree'+index+'"><span><img src="images/d07.png" style="width:24px"></span>免修</li>' +
							'<li id="comfirmGradeEntry" class="noneStart comfirmGradeEntry'+index+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
							'<li id="cancelGradeEntry" class="noneStart cancelGradeEntry'+index+'"><span><img src="images/t03.png"></span>取消</li>' +
							'</ul>'
						]
							.join('');
					}
				}
			}
		}else{
			return [
				'<ul class="toolbar tabletoolbar">' +
				'<li id="wantGradeEntry" class="insertBtn wantGradeEntry'+index+'"><span><img src="images/t01.png" style="width:24px"></span>录入</li>' +
				'<li id="wantGradeFree" class="insertBtn wantGradeFree'+index+'"><span><img src="images/d07.png" style="width:24px"></span>免修</li>' +
				'<li id="comfirmGradeEntry" class="noneStart comfirmGradeEntry'+index+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
				'<li id="cancelGradeEntry" class="noneStart cancelGradeEntry'+index+'"><span><img src="images/t03.png"></span>取消</li>' +
				'</ul>'
			]
				.join('');
		}
	}

	function xzbnameMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
					'<div class="myTooltip redTxt" title="暂无行政班">暂无行政班</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip" title="'+value+'">'+value+'</div>'
				]
				.join('');
		}
	}

	function examNnumMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				'<div class="myTooltip normalTxt" title="暂未补考">暂未补考</div>'
			]
				.join('');
		} else {
			return [
				'<div class="myTooltip normalTxt" title="'+value+'次">'+value+'次</div>'
			]
				.join('');
		}
	}

	function isMxMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined"||value==='0') {
			return [
				'<div class="myTooltip normalTxt" title="正常">正常</div>'
			]
				.join('');
		} else if(value==='01'){
			return [
				'<div class="myTooltip normalTxt" title="免修">免修</div>'
			]
				.join('');
		}else if(value==='02'){
			return [
				'<div class="myTooltip normalTxt" title="缓考">缓考</div>'
			]
				.join('');
		}else if(value==='03'){
			return [
				'<div class="myTooltip normalTxt" title="休学">休学</div>'
			]
				.join('');
		}else if(value==='04'){
			return [
				'<div class="myTooltip normalTxt" title="退学">退学</div>'
			]
				.join('');
		}else{
			return [
				'<div class="myTooltip normalTxt" title="缺考">缺考</div>'
			]
				.join('');
		}
	}

	function gradeMatter(value, row, index) {
		var className='';
		if((row.isMx!=='0'&&row.isMx!==""&&row.isMx!=null&&typeof row.isMx!=="undefined") && (row.isMx!=='05')){
			if(row.isMx==='01'){
				return [
					'<div class="myTooltip normalTxt" title="免修">免修</div>'
				]
					.join('');
			}else if(row.isMx==='02'){
				return [
					'<div class="myTooltip normalTxt" title="缓考">缓考</div>'
				]
					.join('');
			}else if(row.isMx==='03'){
				return [
					'<div class="myTooltip normalTxt" title="休学">休学</div>'
				]
					.join('');
			}else{
				return [
					'<div class="myTooltip normalTxt" title="退学">退学</div>'
				]
					.join('');
			}
		}else{
			if(row.isExamCrouse==="T"){
				if (typeof value==="undefined"||value==null||value==="") {
					return [ '<div>' +
					'<span class="grade grade'+index+'">暂无成绩</span>' +
					'<input type="text" class="gradeInput tableInput noneStart" id="grade'+index+'">' +
					'</div>' ].join('');
				} else {
					parseFloat(value)>=60?className='greenTxt':className="redTxt";
					return [ '<div class="myTooltip" title="'+value+'">' +
					'<span class="'+className+' grade grade'+index+'">'+value+'</span>' +
					'<input type="text" class="gradeInput tableInput noneStart" id="grade'+index+'">' +
					'</div>' ].join('');
				}
			}else{
				var title="";
				if(row.grade==null){
					title="暂无成绩";
				}else{
					row.grade==="T"?title="通过":title="不通过";
					title==="通过"?className='greenTxt':className="redTxt";
				}
				var str='<option value="T">通过</option><option value="F">不通过</option>';
				if(typeof value==="undefined"||value==null||value==="null"){
					return [
						'<div class="myTooltip gradeArea'+index+'" title="'+title+'">' +
						'<span class="grade grade'+index+'">暂无成绩</span>' +
						'<select class="isSowIndex myTableSelect myTableSelect' +index + '" id="grade'+index+'">'
						+ str +
						'</select>'+
						'</div>'
					]
						.join('');
				}else{
					return [
						'<div class="myTooltip gradeArea'+index+'" title="'+title+'">' +
						'<span class="'+className+' grade grade'+index+'">'+title+'</span>' +
						'<select class="isSowIndex myTableSelect myTableSelect' +index + '" id="grade'+index+'">'
						+ str +
						'</select>'+
						'</div>'
					]
						.join('');
				}
			}
		}

		$('.isSowIndex').selectMania(); // 初始化下拉框
	}

	function gradeEnterMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				''
			]
				.join('');
		} else {
			return [
				'<div class="myTooltip" title="'+value+'">'+value+'</div>'
			]
				.join('');
		}
	}

	function entryDateMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				''
			]
				.join('');
		} else {
			return [
				'<div class="myTooltip" title="'+value+'">'+value+'</div>'
			]
				.join('');
		}
	}

	function isResitMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				'<div class="myTooltip normalTxt" title="未录入">未录入</div>'
			]
				.join('');
		} else if(value==="T"){
			return [
				'<div class="myTooltip" title="是"><i class="iconfont icon-yixuanze greenTxt"></i></div>'
			]
				.join('');
		}else{
			return [
				'<div class="myTooltip" title="否"><i class="iconfont icon-chacha redTxt"></i></div>'
			]
				.join('');
		}
	}

	function isConfirmMatter(value, row, index) {
		if (value==="T") {
			return [
				'<div class="myTooltip" title="已确认"><i class="iconfont icon-yixuanze greenTxt"></i></div>'
			]
				.join('');

		} else {
			return [
				'<div class="myTooltip normalTxt" title="未确认">未确认</div>'
			]
				.join('');
		}
	}

	drawPagination(".studentBaseInfoTableArea", "学生信息");
	drawSearchInput(".studentBaseInfoTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".studentBaseInfoTableArea", "学生信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//预备录入成绩
function wantGradeEntry(row,index){
	var thisInfo=$("#gradeEntryTable").bootstrapTable('getRowByUniqueId',row.edu005_ID);
	if(thisInfo.grade==='T'||parseFloat(thisInfo.grade)>=60){
		toastr.warning("暂无操作");
		return;
	}

	if(row.exam_num!=null&&row.exam_num>=5){
		toastr.warning("最多补考五次");
		return;
	}

	var showGradeInput=$(".gradeInput");
	var showNum=0;
	for (var i = 0; i <showGradeInput.length ; i++) {
		if(showGradeInput[i].style.display==="block"||showGradeInput[i].style.display==="inline-block"){
			showNum++;
		}
	}
	if(showNum>=1){
		toastr.warning("请先录完上一个成绩");
		return;
	}

	$(".wantGradeEntry"+index).hide();
	$(".wantGradeFree"+index).hide();
	$(".reExamInfo"+index).hide();
	$(".grade"+index).hide();
	$(".comfirmGradeEntry"+index).show();
	$(".cancelGradeEntry"+index).show();
	if(row.isExamCrouse==="T"){
		$("#grade"+index).show();
		row.grade!=null?$("#grade"+index).val(row.grade).focus():$("#grade"+index).val("").focus();
	}else{
        $(".gradeArea"+index).show();
        $(".myTableSelect"+index).show();
	}
}

//确认录入成绩
function comfirmGradeEntry(row,index){
	var currentGrade;
	if(row.isExamCrouse==="T"){
		 currentGrade=$("#grade"+index).val();
		if(currentGrade===""){
			toastr.warning('成绩不能为空');
			return;
		}

		if(!checkIsNumber(currentGrade) && currentGrade!==""){
			toastr.warning('成绩必须是数字');
			return;
		}
	}else{
		 currentGrade=$("#grade"+index).val();
	}
	sendGrade(currentGrade,row);
}

//取消录入成绩
function cancelGradeEntry(row,index){
	$(".wantGradeEntry"+index).show();
	$(".wantGradeFree"+index).show();
	$(".reExamInfo"+index).show();
	$(".grade"+index).show();
	$(".comfirmGradeEntry"+index).hide();
	$(".cancelGradeEntry"+index).hide();
	if(row.isExamCrouse==="T"){
		$("#grade"+index).hide();
		$("#grade"+index).val("");
	}else{
		$(".myTableSelect"+index).hide();
	}
}

//发送学生成绩请求
function sendGrade(currentGrade,row) {
	row.grade=currentGrade;
	row.Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
	row.gradeEnter=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/giveGrade",
		data: {
			"gradeObject":JSON.stringify(row)
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
				$("#gradeEntryTable").bootstrapTable("updateByUniqueId", {id: row.edu005_ID, row: backjson.data});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//预备成绩免修
function wantGradeFree(row,index){
	var IS_MX=queryEJDMElementInfo().IS_MX;
	if(typeof IS_MX==="undefined"||IS_MX==null){
		toastr.warning("暂无免修状态");
		return;
	}
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < IS_MX.length; i++) {
		str += '<option value="' + IS_MX[i].ejdm + '">' + IS_MX[i].ejdmz
			+ '</option>';
	}
	stuffManiaSelect("#gradeFreeStatus", str);
	$.showModal("#gradeFreeModal",true);

	//确认免修
	$('#confirmGradeFree').unbind('click');
	$('#confirmGradeFree').bind('click', function(e) {
		confirmGradeFree(row);
		e.stopPropagation();
	});
}

//确认免修
function confirmGradeFree(row){
	var mxStatus=getNormalSelectValue("gradeFreeStatus");
	if(mxStatus===""){
		toastr.warning('请选择免修状态');
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateMXStatus",
		data: {
			"edu005_ID":row.edu005_ID,
			'mxStatus':mxStatus
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
				row.isMx=mxStatus;
				$("#gradeEntryTable").bootstrapTable("updateByUniqueId", {id: row.edu005_ID, row: row});
				toastr.success('操作成功');
				$.hideModal("#gradeFreeModal")
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取补考详情
function reExamInfo(row,index){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getHistoryGrade",
		data: {
			"Edu005Id":row.edu005_ID
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
				if(backjson.data.length===0){
					toastr.warning("暂无补考信息");
					return;
				}
				$.showModal("#reExamInfoModal",false);
				$("#reExamInfoModal").find(".moadalTitle").html(row.studentName+"-"+row.courseName+"补考记录");
				$(".historyInfo").empty();
				var historyTxt="";
				var str='<option value="T">通过</option><option value="F">不通过</option>';
				for (var i = 0; i < backjson.data.length; i++) {
					var currentHistory= backjson.data[i];
					var gradeInputTxt='';
					if(currentHistory.grade==='T'||currentHistory.grade==="F"){
						gradeInputTxt='<select value="'+currentHistory.grade+'" class="isSowIndex historyGradeSelect" id="historyGradeSelect' +currentHistory.edu0051_ID + '">'
							+ str +
							'</select>';
					}else{
						gradeInputTxt='<input class="myInput manyInfoInput noneStart historyGradeInput" value="'+currentHistory.grade+'" id="gradeInput'+currentHistory.edu0051_ID+'" spellcheck="false">';
					}

					var reExamText="";
					i<=0?reExamText="正常考试":reExamText="第"+i+"次补考";
					historyTxt+='<div class="historyArea" edu0051_ID="'+currentHistory.edu0051_ID+'" grade="'+currentHistory.grade+'"><p class="Historystep">'+reExamText+'</p><div>' +
						'<span><cite>课程名称：</cite><b>'+nullMatter(currentHistory.courseName)+'</b></span>'+
						'<span><cite>补考成绩：</cite><b class="historyGradeB">'+gradeMatter(currentHistory.grade)+'</b>'+gradeInputTxt+'</span>'+
						'<span><cite>补考时间：</cite><b>'+nullMatter(currentHistory.entryDate)+'</b></span>'+
						'<span><cite>操作人：</cite><b>'+nullMatter(currentHistory.gradeEnter)+'</b></span>'+
						'</div></div>' ;
					if((i+1)!=backjson.data.length){
						historyTxt+='<img class="spiltImg" src="images/uew_icon_hover.png"></img>';
					}
				}
				$(".historyInfo").append(historyTxt);
				$('#wantModifyReExamInfo').show();
				$('#comfirmModifyReExamInfo,#cancelModifyReExamInfo,.historyGradeInput,#reExamInfoModal .select-mania,.historyGradeSelect').hide();

				//预备修改补考成绩
				$('#wantModifyReExamInfo').unbind('click');
				$('#wantModifyReExamInfo').bind('click', function(e) {
					wantModifyReExamInfo();
					e.stopPropagation();
				});

				//取消修改补考成绩
				$('#cancelModifyReExamInfo').unbind('click');
				$('#cancelModifyReExamInfo').bind('click', function(e) {
					cancelModifyReExamInfo();
					e.stopPropagation();
				});

				//确认修改补考成绩
				$('#comfirmModifyReExamInfo').unbind('click');
				$('#comfirmModifyReExamInfo').bind('click', function(e) {
					comfirmModifyReExamInfo(backjson.data,row);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

function gradeMatter(str){
	if(str==='T'||str==="F"){
		if(str==='T'){
			return '通过'
		}else{
			return '不通过'
		}
	}else{
		str==null||str===""?str="暂无":str=str;
	}
	return str;
}

//预备修改补考成绩
function wantModifyReExamInfo(){
	$('.isSowIndex').selectMania(); //初始化下拉框
	$('#wantModifyReExamInfo,.historyGradeB').hide();
	$('#comfirmModifyReExamInfo,#cancelModifyReExamInfo,.historyGradeInput,#reExamInfoModal .select-mania').show();
}

//取消修改补考成绩
function cancelModifyReExamInfo(){
	$('#wantModifyReExamInfo,.historyGradeB').show();
	$('#comfirmModifyReExamInfo,#cancelModifyReExamInfo,.historyGradeInput,#reExamInfoModal .select-mania').hide();
}

//确认修改补考成绩
function comfirmModifyReExamInfo(currentHistory,row){
	var modifyInfo=new Array();
	for (let i = 0; i < currentHistory.length; i++) {
		var modifyObject=new Object();
		if(currentHistory[i].grade==='T'||currentHistory[i].grade==="F"){
			if(isModifyed(getNormalSelectValue('historyGradeSelect'+currentHistory[i].edu0051_ID),currentHistory[i].grade)){
				modifyObject.edu0051_ID=currentHistory[i].edu0051_ID;
				modifyObject.grade=getNormalSelectValue('historyGradeSelect'+currentHistory[i].edu0051_ID);
				modifyInfo.push(modifyObject);
			}
		}else{
			if(!checkIsNumber($('#gradeInput'+currentHistory[i].edu0051_ID).val())){
				toastr.warning('输入框只接受数字类型');
				return;
			}

			if(isModifyed($('#gradeInput'+currentHistory[i].edu0051_ID).val(),currentHistory[i].grade)){
				modifyObject.edu0051_ID=currentHistory[i].edu0051_ID;
				modifyObject.grade=$('#gradeInput'+currentHistory[i].edu0051_ID).val();
				modifyInfo.push(modifyObject);
			}
		}
	}

	if(modifyInfo.length==0){
		toastr.warning('未做任何修改');
		return;
	}


	if(row.exam_num>=5){
		if(currentHistory[currentHistory.length-1].grade==='T'||currentHistory[currentHistory.length-1].grade==="F"){
			if(currentHistory[currentHistory.length-1].grade!==getNormalSelectValue('historyGradeSelect'+currentHistory[currentHistory.length-1].edu0051_ID)){
				toastr.warning('不能修改第五次补考成绩');
				return;
			}
		}else{
			if(currentHistory[currentHistory.length-1].grade!==$('#gradeInput'+currentHistory[currentHistory.length-1].edu0051_ID).val()){
				toastr.warning('不能修改第五次补考成绩');
				return;
			}
		}
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateMakeUpGrade",
		data: {
			"gradeObjectList":JSON.stringify(modifyInfo),
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
				if(currentHistory[currentHistory.length-1].grade==='T'||currentHistory[currentHistory.length-1].grade==="F"){
					if(currentHistory[currentHistory.length-1].grade!==getNormalSelectValue('historyGradeSelect'+currentHistory[currentHistory.length-1].edu0051_ID)){
						var updateTableInfo=$("#gradeEntryTable").bootstrapTable('getRowByUniqueId', currentHistory[currentHistory.length-1].edu005_ID);
						updateTableInfo.grade=getNormalSelectValue('historyGradeSelect'+currentHistory[currentHistory.length-1].edu0051_ID);
						$("#gradeEntryTable").bootstrapTable('updateByUniqueId', {
							id: currentHistory[currentHistory.length-1].edu005_ID,
							row: updateTableInfo
						});
					}
				}else{
					if(currentHistory[currentHistory.length-1].grade!==$('#gradeInput'+currentHistory[currentHistory.length-1].edu0051_ID).val()){
						var updateTableInfo=$("#gradeEntryTable").bootstrapTable('getRowByUniqueId', currentHistory[currentHistory.length-1].edu005_ID);
						updateTableInfo.grade=$('#gradeInput'+currentHistory[currentHistory.length-1].edu0051_ID).val();
						$("#gradeEntryTable").bootstrapTable('updateByUniqueId', {
							id: currentHistory[currentHistory.length-1].edu005_ID,
							row: updateTableInfo
						});
					}
				}

				$.hideModal('#reExamInfoModal');
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//判断是否修改
function isModifyed(newGrade,oldGrade){
	var isModifyed=false;
	newGrade===oldGrade?isModifyed=false:isModifyed=true;
	return isModifyed;
}

//获取检索对象
function getSearchObject(){
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");
	var xnid =getNormalSelectValue("xn");
	var className=$("#className").val();
	var courseName=$("#courseName").val();
	var studentNumber=$("#studentNumber").val();
	var studentName=$("#studentName").val();


	var returnObject = new Object();
	returnObject.level = levelValue;
	returnObject.department = departmentValue;
	returnObject.grade = gradeValue;
	returnObject.major = majorValue;
	returnObject.xnid = xnid;
	returnObject.className = className;
	returnObject.courseName = courseName;
	returnObject.studentNumber = studentNumber;
	returnObject.studentName = studentName;
	return returnObject;
}

//开始检索
function startSearch(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryGrades",
		data: {
			"SearchCriteria":JSON.stringify(getSearchObject()),
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
				stuffStudentBaseInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawStudentBaseInfoEmptyTable();
			}
		}
	});
}

//重置检索
function research(){
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.actionSelectIds = "#department,#grade,#major";
	reObject.InputIds = "#className,#courseName,#studentNumber,#studentName";
	reObject.normalSelectIds = "#xn";
	reReloadSearchsWithSelect(reObject);
	deafultSearch();
}

//预备下载成绩模板
function wantLoadGradeModel() {
	reStuffWantLoadGradeModel();
	$.showModal("#wantLoadGradeModal",true);

	//预备下载成绩模板
	$('#ComfirmLoadGradeModel').unbind('click');
	$('#ComfirmLoadGradeModel').bind('click', function(e) {
		ComfirmLoadGradeModel();
		e.stopPropagation();
	});
}

//确认下载成绩模板
function ComfirmLoadGradeModel(){
	var xnid=getNormalSelectValue("loadForXn");
	var className=$("#loadForXzbmc").val();
	var courseName=$("#loadForKcmc").val();

	if(className===""){
		toastr.warning("请选择行政班");
		return;
	}

	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(courseName===""){
		toastr.warning("请选择课程");
		return;
	}

	var gradeInfo=new Object();
	gradeInfo.xnid=xnid;
	gradeInfo.xn=getNormalSelectText("loadForXn");
	gradeInfo.className=className;
	gradeInfo.courseName=courseName;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/wantDownloadGradeModal",
		data: {
			"gradeInfo":JSON.stringify(gradeInfo)
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
				var url = "/downloadGradeModal";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "gradeInfo").attr("value",JSON.stringify(gradeInfo)));
				form.appendTo('body').submit().remove();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重置下载成绩模板区域
function reStuffWantLoadGradeModel(){
	var reObject = new Object();
	reObject.InputIds = "#loadForXzbmc,#loadForKcmc";
	reObject.normalSelectIds = "#loadForXn";
	reReloadSearchsWithSelect(reObject);
	$("#loadForXzbmc").attr("choosendClassId",'');
}

//预备导入成绩
function wantImportGrades(){
	$("#importGradeModal").find(".moadalTitle").html("批量导入成绩");
	$.showModal("#importGradeModal",true);
	$("#gradeInfoFile,#showFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#gradeInfoFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#gradeInfoFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#studentInfoFile").val("");
			return
		}
		$("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	//检验导入文件
	$('#checkGradeFile').unbind('click');
	$('#checkGradeFile').bind('click', function(e) {
		checkGradeFile();
		e.stopPropagation();
	});

	//确认导入文件
	$('.confirmImportGrade').unbind('click');
	$('.confirmImportGrade').bind('click', function(e) {
		confirmImportGrade();
		e.stopPropagation();
	});
}

//检验导入文件
function checkGradeFile(){
	if ($("#gradeInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}

	var formData = new FormData();
	formData.append("file",$('#gradeInfoFile')[0].files[0]);

	$.ajax({
		url:'/checkGradeFile',
		dataType:'json',
		type:'POST',
		async: true,
		data: formData,
		processData : false, // 使数据不做处理
		contentType : false, // 不要设置Content-Type请求头
		success: function(backjosn){
			$(".fileLoadingArea").hide();
			if(backjosn.code===200){
				showImportSuccessInfo("#importGradeModal",backjosn.msg);
			}else{
				showImportErrorInfo("#importGradeModal",backjosn.msg);
			}
		},beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
	});
}

//确认导入文件
function confirmImportGrade(){
	if ($("#gradeInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	var lrrInfo=new Object();
	lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
	lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;

	var formData = new FormData();
	formData.append("file",$('#gradeInfoFile')[0].files[0]);
	formData.append("lrrInfo",JSON.stringify(lrrInfo));

	$.ajax({
		url:'/importGradeFile',
		dataType:'json',
		type:'POST',
		async: true,
		data: formData,
		processData : false, // 使数据不做处理
		contentType : false, // 不要设置Content-Type请求头
		success: function(backjosn){
			$(".fileLoadingArea").hide();
			if(backjosn.code===200){
				stuffStudentBaseInfoTable(backjosn.data);
				toastr.success('成功导入'+backjosn.data.length+'条成绩，请【成绩确认】！');
				var reObject = new Object();
				reObject.fristSelectId = "#level";
				reObject.actionSelectIds = "#department,#grade,#major";
				reObject.InputIds = "#className,#courseName,#studentNumber,#studentName";
				reObject.normalSelectIds = "#xn";
				reReloadSearchsWithSelect(reObject);
				$.hideModal("#importGradeModal")
			}else{
				showImportErrorInfo("#importGradeModal",backjosn.msg);
			}
		},beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
	});
}

//预备成绩确认
function wantConfirmGrade(){
	reStuffForConfirmGrade();
	$.showModal("#confirmGradeModal",true);

	//确认按钮
	$('#confirmGrade').unbind('click');
	$('#confirmGrade').bind('click', function(e) {
		confirmGrade();
		e.stopPropagation();
	});
}

//成绩确认
function confirmGrade(){
	var xnid=getNormalSelectValue("confirmGradeForXn");
	var className=$("#confirmGradeForXzbmc").val();
	var courseName=$("#confirmGradeForKcmc").val();
	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(className===""){
		toastr.warning("请选择行政班");
		return;
	}

	if(courseName===""){
		toastr.warning("请选择课程班");
		return;
	}

	var gradeInfo=new Object();
	gradeInfo.xnid=xnid;
	gradeInfo.xn=getNormalSelectText("confirmGradeForXn");
	gradeInfo.className=className;
	gradeInfo.courseName=courseName;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/confirmGrade",
		data: {
			"gradeInfo":JSON.stringify(gradeInfo),
			"userKey":JSON.parse($.session.get('userInfo')).userKey
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
				var data=backjson.data;
				for (var i = 0; i < data.length; i++) {
					$("#gradeEntryTable").bootstrapTable('updateByUniqueId', {
						id: backjson.data[i].edu005_ID,
						row: backjson.data[i]
					});
				}
				toolTipUp(".myTooltip");
				toastr.success(backjson.msg);
				$.hideModal("#confirmGradeModal");
			} else if(backjson.code===204){
				$.hideModal("#confirmGradeModal",false);
				$.showModal("#timeOutModal",true);
				//返回
				$('.timeOutCanle').unbind('click');
				$('.timeOutCanle').bind('click', function(e) {
					$.hideModal("#timeOutModal",false);
					$.showModal("#confirmGradeModal",true);
					e.stopPropagation();
				});

				//发起特殊申请
				$('.confirmTimeOut').unbind('click');
				$('.confirmTimeOut').bind('click', function(e) {
					confirmTimeOut();
					e.stopPropagation();
				});
			}else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//发起特殊申请
function confirmTimeOut(){
	var businessInfo=new Object();
	businessInfo.Edu990_ID=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	businessInfo.userName=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
	businessInfo.xnid=getNormalSelectValue("confirmGradeForXn");
	businessInfo.courseName=$("#confirmGradeForKcmc").val();
	businessInfo.className=$("#confirmGradeForXzbmc").val();

	$.ajax({
		method : 'get',
		cache : false,
		url : "/addTeacherGetGrade",
		data: {
			"businessInfo":JSON.stringify(businessInfo),
			"approvalInfo":JSON.stringify(getApprovalobect2()),
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
				$.hideModal();
				toastr.success("申请发起成功，请等待审批通过");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//审批流对象
function getApprovalobect2(){
	var approvalObject=new Object();
	approvalObject.businessType="09";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//重置确认成绩条件
function reStuffForConfirmGrade(){
	var reObject = new Object();
	reObject.InputIds = "#confirmGradeForXzbmc,#confirmGradeForKcmc";
	reObject.normalSelectIds = "#confirmGradeForXn";
	reReloadSearchsWithSelect(reObject);
}

//预备取消成绩确认
function wantCancelGrade(){
	reStuffForCancelGrade();
	$.showModal("#cancelGradeModal",true);

	//确认按钮
	$('#cancelGrade').unbind('click');
	$('#cancelGrade').bind('click', function(e) {
		cancelGrade();
		e.stopPropagation();
	});
}

//取消成绩确认
function cancelGrade(){
	var xnid=getNormalSelectValue("cancelGradeForXn");
	var className=$("#cancelGradeForXzbmc").val();
	var courseName=$("#cancelGradeForKcmc").val();
	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(className===""){
		toastr.warning("行政班名称不能为空");
		return;
	}

	if(courseName===""){
		toastr.warning("课程班名称不能为空");
		return;
	}

	var gradeInfo=new Object();
	gradeInfo.xnid=xnid;
	gradeInfo.xn=getNormalSelectText("cancelGradeForXn");
	gradeInfo.className=className;
	gradeInfo.courseName=courseName;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/cancelGrade",
		data: {
			"gradeInfo":JSON.stringify(gradeInfo),
			"approvalInfo":JSON.stringify(getApprovalobect())
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
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//取消成绩确认审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="08";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//重置确认成绩条件
function reStuffForCancelGrade(){
	var reObject = new Object();
	reObject.InputIds = "#cancelGradeForXzbmc,#cancelGradeForKcmc";
	reObject.normalSelectIds = "#cancelGradeForXn";
	reReloadSearchsWithSelect(reObject);
}

//获取所有行政班
function getAllClass(isCheck){
	var serachObject=new Object();
	serachObject.level='';
	serachObject.department='';
	serachObject.grade='';
	serachObject.major='';
	serachObject.className='';
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClassGradeModel",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"SearchCriteria":JSON.stringify(serachObject)
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
				$.hideModal("#wantLoadGradeModal",false);
				$.showModal("#chooseCalssModal",true);
				stuffAdministrationClassTable(backjson.data,isCheck);
				//提示框取消按钮
				$('.specialCanle1').unbind('click');
				$('.specialCanle1').bind('click', function(e) {
					$.hideModal("#chooseCalssModal",false);
					$.showModal("#wantLoadGradeModal",true);
					e.stopPropagation();
				});

				//确认选择行政班
				$('#confirmChoosedClalss').unbind('click');
				$('#confirmChoosedClalss').bind('click', function(e) {
					confirmChoosedClass();
					e.stopPropagation();
				});
			} else {
				stuffAdministrationClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//确认选择行政班
function confirmChoosedClass(){
	var choosendClass=$("#chooseClassTable").bootstrapTable("getSelections");
	if(choosendClass.length==0){
		toastr.warning('请选择班级');
		return;
	}

	$("#loadForXzbmc").attr("choosendClassId",choosendClass[0].edu300_ID);
	$("#loadForXzbmc").val(choosendClass[0].xzbmc);
	$.hideModal("#chooseCalssModal",false);
	$.showModal("#wantLoadGradeModal",true);
}

var choosendClass=new Array();
//填充行政班表
function stuffAdministrationClassTable(tableInfo,isCheck){
	choosendClass=new Array();
	var checkTxt=new Object();
	if(typeof isCheck==="undefined"){
		checkTxt.field='radio';
		checkTxt.radio=true;
	}else{
		checkTxt.field='check';
		checkTxt.checkbox=true;
	}

	$('#chooseClassTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		showExport: false,      //是否显示导出
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".chooseClassTableArea", "行政班信息");
			if(typeof isCheck!=="undefined"){
				//勾选已选数据
				for (var i = 0; i < choosendClass.length; i++) {
					$("#chooseClassTable").bootstrapTable("checkBy", {field:"edu300_ID", values:[choosendClass[i].edu300_ID]})
				}
			}
		},
		onCheck : function(row) {
			if(typeof isCheck!=="undefined"){
				onCheckForClass(row);
			}
		},
		onUncheck : function(row) {
			if(typeof isCheck!=="undefined"){
				onUncheckForClass(row);
			}
		},
		onCheckAll : function(rows) {
			if(typeof isCheck!=="undefined"){
				onCheckAllForClass(rows);
			}
		},
		onUncheckAll : function(rows,rows2) {
			if(typeof isCheck!=="undefined"){
				onUncheckAllForClass(rows2);
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			checkTxt,
			{
			field : 'edu300_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
			},{
			field : 'xzbmc',
			title : '行政班名称',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'pyccmc',
			title : '培养层次',
			align : 'left',
			sortable: true,
			formatter :paramsMatter,
			visible : false
		}, {
			field : 'xbmc',
			title : '所属二级学院',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
			visible : true
		},{
			field : 'njmc',
			title : '年级',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
			visible : false
		},{
			field : 'zymc',
			title : '专业',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
			visible : false
		},{
			field : 'batchName',
			title : '批次',
			align : 'left',
			sortable: true,
			visible : false,
			formatter :paramsMatter
		}, {
			field : 'zxrs',
			title : '在校人数',
			align : 'left',
			sortable: true,
			visible : false,
			formatter : paramsMatter
		}]
	});

	drawPagination(".chooseClassTableArea", "行政班信息");
	drawSearchInput(".chooseClassTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".chooseClassTableArea", "行政班信息");
}

//单选课程
function onCheckForClass(row){
	if(choosendClass.length<=0){
		choosendClass.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendClass.length; i++) {
			if(choosendClass[i].edu300_ID===row.edu300_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendClass.push(row);
		}
	}
}

//单反选课程
function onUncheckForClass(row){
	if(choosendClass.length<=1){
		choosendClass.length=0;
	}else{
		for (var i = 0; i < choosendClass.length; i++) {
			if(choosendClass[i].edu300_ID===row.edu300_ID){
				choosendClass.splice(i,1);
			}
		}
	}
}

//全选课程
function onCheckAllForClass(row){
	for (var i = 0; i < row.length; i++) {
		choosendClass.push(row[i]);
	}
}

//全反选课程
function onUncheckAllForClass(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu300_ID);
	}


	for (var i = 0; i < choosendClass.length; i++) {
		if(a.indexOf(choosendClass[i].edu300_ID)!==-1){
			choosendClass.splice(i,1);
			i--;
		}
	}
}

//获取课程
function getCoruses(){
	var chosendClass=$("#loadForXzbmc").attr("choosendClassId");
	var choosendTerm=getNormalSelectValue("loadForXn");
	if(chosendClass===""){
		toastr.warning('请先选择班级');
		return;
	}
	if(choosendTerm===""){
		toastr.warning('请先选择学年');
		return;
	}
	searchCourseByClass(chosendClass,choosendTerm);
}

//根据班级学年获取课程
function searchCourseByClass(chosendClass,choosendTerm){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByClass",
		data: {
			"edu300_ID":chosendClass,
			"term":choosendTerm
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
				$("#chooseCruoseModal").find(".moadalTitle").html("可选课程库");
				$.hideModal("#wantLoadGradeModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data);

				//提示框取消按钮
				$('.specialCanle2').unbind('click');
				$('.specialCanle2').bind('click', function(e) {
					$.hideModal("#chooseCruoseModal",false);
					$.showModal("#wantLoadGradeModal",true);
					e.stopPropagation();
				});

				//确认选择课程
				$('#confirmChooseCrouse').unbind('click');
				$('#confirmChooseCrouse').bind('click', function(e) {
					confirmChooseCrouse();
					e.stopPropagation();
				});
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosendCrouse=new Array();
//填充课程表
function stuffCrouseClassTable(tableInfo,isCheck){
	choosendCrouse=new Array();
	var checkTxt=new Object();
	if(typeof isCheck==="undefined"){
		checkTxt.field='radio';
		checkTxt.radio=true;
	}else{
		checkTxt.field='check';
		checkTxt.checkbox=true;
	}

	$('#chooseCrouseTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		showExport: false,      //是否显示导出
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".chooseCrouseTableArea", "课程信息");
			if(typeof isCheck!=="undefined"){
				//勾选已选数据
				for (var i = 0; i < choosendCrouse.length; i++) {
					$("#chooseCrouseTable").bootstrapTable("checkBy", {field:"edu108_ID", values:[choosendCrouse[i].edu108_ID]})
				}
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		onCheck : function(row) {
			if(typeof isCheck!=="undefined"){
				onCheck(row);
			}
		},
		onUncheck : function(row) {
			if(typeof isCheck!=="undefined"){
				onUncheck(row);
			}
		},
		onCheckAll : function(rows) {
			if(typeof isCheck!=="undefined"){
				onCheckAll(rows);
			}
		},
		onUncheckAll : function(rows,rows2) {
			if(typeof isCheck!=="undefined"){
				onUncheckAll(rows2);
			}
		},
		columns: [
			checkTxt,
			{
				field : 'edu108_ID',
				title: '唯一标识',
				align : 'center',
				sortable: true,
				visible : false
			},{
				field : 'kcmc',
				title : '课程名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'kcxz',
				title : '课程性质',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},{
				field : 'kclx',
				title : '课程类型',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'ksfs',
				title : '考试方式',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}]
	});

	drawPagination(".chooseCrouseTableArea", "课程信息");
	drawSearchInput(".chooseCrouseTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".chooseCrouseTableArea", "课程信息");
}

//单选课程
function onCheck(row){
	if(choosendCrouse.length<=0){
		choosendCrouse.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendCrouse.length; i++) {
			if(choosendCrouse[i].edu108_ID===row.edu108_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendCrouse.push(row);
		}
	}
}

//单反选课程
function onUncheck(row){
	if(choosendCrouse.length<=1){
		choosendCrouse.length=0;
	}else{
		for (var i = 0; i < choosendCrouse.length; i++) {
			if(choosendCrouse[i].edu108_ID===row.edu108_ID){
				choosendCrouse.splice(i,1);
			}
		}
	}
}

//全选课程
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosendCrouse.push(row[i]);
	}
}

//全反选课程
function onUncheckAll(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu108_ID);
	}


	for (var i = 0; i < choosendCrouse.length; i++) {
		if(a.indexOf(choosendCrouse[i].edu108_ID)!==-1){
			choosendCrouse.splice(i,1);
			i--;
		}
	}
}

//确认选择课程
function confirmChooseCrouse(){
	var tableSelected= $("#chooseCrouseTable").bootstrapTable("getSelections");
	if(tableSelected.length==0){
		toastr.warning('请选择课程');
		return;
	}
	$("#loadForKcmc").val(tableSelected[0].kcmc);
	$.hideModal("#chooseCruoseModal",false);
	$.showModal("#wantLoadGradeModal",true);
}

//预备下载不及格成绩模板
function wantLoadNoPassGradeModel() {
	reStuffWantLoadNotPassGradeModel();
	$.showModal("#wantEnteryNotPassModal",true);

	//预备下载成绩模板
	$('#ComfirmLoadNotPassGradeModel').unbind('click');
	$('#ComfirmLoadNotPassGradeModel').bind('click', function(e) {
		ComfirmLoadGradeModelForNotPass();
		e.stopPropagation();
	});
}

//根据学年和用户获取课程
function getCourseByXNAndUserID(){
	var xn=getNormalSelectValue('loadNotPassForXn');
	if(xn===""){
		toastr.warning('请选择学年');
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByXNAndID",
		data: {
			"term":xn,
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
			if (backjson.code === 200) {
				$("#chooseCruoseModal").find(".moadalTitle").html("可选课程");
				$.hideModal("#wantEnteryNotPassModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data,true);

				//提示框取消按钮
				$('.specialCanle2').unbind('click');
				$('.specialCanle2').bind('click', function(e) {
					$.hideModal("#chooseCruoseModal",false);
					$.showModal("#wantEnteryNotPassModal",true);
					e.stopPropagation();
				});

				//确认选择课程
				$('#confirmChooseCrouse').unbind('click');
				$('#confirmChooseCrouse').bind('click', function(e) {
					confirmChooseCrouseForNotPass();
					e.stopPropagation();
				});
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重置下载不及格模态框
function reStuffWantLoadNotPassGradeModel(){
	var reObject = new Object();
	reObject.InputIds = "#loadNotPassForKcmc,#loadNotPassForXzbmc";
	reObject.normalSelectIds = "#loadNotPassForXn";
	reReloadSearchsWithSelect(reObject);
	$("#loadNotPassForXzbmc").attr("choosendClassId",'');
}

//不及格确认选择课程
function confirmChooseCrouseForNotPass(){
	if(choosendCrouse.length==0){
		toastr.warning('请选择课程');
		return;
	}
	var kcmcs=new Array();
	for (var i = 0; i < choosendCrouse.length; i++){
		kcmcs.push(choosendCrouse[i].kcmc);
	}

	$("#loadNotPassForKcmc").val(kcmcs);
	$.hideModal("#chooseCruoseModal",false);
	$.showModal("#wantEnteryNotPassModal",true);
}

//不及格获取班级
function getclassforNotPass(){
	var choosendTerm=getNormalSelectValue("loadNotPassForXn");
	var chosendCrouse=$("#loadNotPassForKcmc").val();
	if(choosendTerm===""){
		toastr.warning('请先选择学年');
		return;
	}
	if(chosendCrouse===""){
		toastr.warning('请先选择课程');
		return;
	}
	searchAdministrationClassGradeModelMakeUp(chosendCrouse,choosendTerm);
}

//不及格根据班级学年和课程获取行政班
function searchAdministrationClassGradeModelMakeUp(chosendCrouse,choosendTerm){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClassGradeModelMakeUp",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"term":choosendTerm,
			"couserName":chosendCrouse,
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
				$.hideModal("#wantEnteryNotPassModal",false);
				$.showModal("#chooseCalssModal",true);
				stuffAdministrationClassTable(backjson.data,true);
				//提示框取消按钮
				$('.specialCanle1').unbind('click');
				$('.specialCanle1').bind('click', function(e) {
					$.hideModal("#chooseCalssModal",false);
					$.showModal("#wantEnteryNotPassModal",true);
					e.stopPropagation();
				});

				//确认选择行政班
				$('#confirmChoosedClalss').unbind('click');
				$('#confirmChoosedClalss').bind('click', function(e) {
					confirmChoosedClassforNotPass();
					e.stopPropagation();
				});
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//不及格确认选择行政班
function confirmChoosedClassforNotPass(){
	if(choosendClass.length==0){
		toastr.warning('请选择班级');
		return;
	}

	var classNames=new Array();
	var classIds=new Array();
	for (var i = 0; i < choosendClass.length; i++){
		classNames.push(choosendClass[i].xzbmc);
		classIds.push(choosendClass[i].edu300_ID);
	}

	$("#loadNotPassForXzbmc").attr("choosendClassId",classIds);
	$("#loadNotPassForXzbmc").val(classNames);
	$.hideModal("#chooseCalssModal",false);
	$.showModal("#wantEnteryNotPassModal",true);
}

//不及格确认下载成绩模板
function ComfirmLoadGradeModelForNotPass(){
	var xnid=getNormalSelectValue("loadNotPassForXn");
	var courseName=$("#loadNotPassForKcmc").val();

	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(courseName===""){
		toastr.warning("请选择课程");
		return;
	}

	var queryInfo=new Object();
	queryInfo.trem=xnid;
	queryInfo.crouse=courseName;
	queryInfo.userId=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	queryInfo.classes=$("#loadNotPassForXzbmc").attr("choosendClassId");
	$.ajax({
		method : 'get',
		cache : false,
		url : "/exportMakeUpGradeCheckModel",
		data: {
			"queryInfo":JSON.stringify(queryInfo)
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
				var url = "/exportMakeUpGradeModel";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "queryInfo").attr("value",JSON.stringify(queryInfo)));
				form.appendTo('body').submit().remove();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//不及格预备导入成绩
function wantImportGradesforNotPass(){
	$("#importGradeModal").find(".moadalTitle").html("批量二次导入(不及格)成绩");
	$.showModal("#importGradeModal",true);
	$("#gradeInfoFile,#showFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#gradeInfoFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#gradeInfoFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#studentInfoFile").val("");
			return
		}
		$("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	//不及格检验导入文件
	$('#checkGradeFile').unbind('click');
	$('#checkGradeFile').bind('click', function(e) {
		checkGradeFileforNotPass();
		e.stopPropagation();
	});

	//不及格确认导入文件
	$('.confirmImportGrade').unbind('click');
	$('.confirmImportGrade').bind('click', function(e) {
		confirmImportGradeforNotPass();
		e.stopPropagation();
	});
}

//不及格检验导入文件
function checkGradeFileforNotPass(){
	if ($("#gradeInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}

	var lrrInfo=new Object();
	lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
	lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;

	var formData = new FormData();
	formData.append("file",$('#gradeInfoFile')[0].files[0]);
	formData.append("lrrInfo",JSON.stringify(lrrInfo));

	$.ajax({
		url:'/checkGradeFileMakeUp',
		dataType:'json',
		type:'POST',
		async: true,
		data: formData,
		processData : false, // 使数据不做处理
		contentType : false, // 不要设置Content-Type请求头
		success: function(backjosn){
			$(".fileLoadingArea").hide();
			if(backjosn.code===200){
				showImportSuccessInfo("#importGradeModal",backjosn.msg);
			}else{
				showImportErrorInfo("#importGradeModal",backjosn.msg);
			}
		},beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
	});
}

//不及格确认导入文件
function confirmImportGradeforNotPass(){
	if ($("#gradeInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	var lrrInfo=new Object();
	lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
	lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;

	var formData = new FormData();
	formData.append("file",$('#gradeInfoFile')[0].files[0]);
	formData.append("lrrInfo",JSON.stringify(lrrInfo));

	$.ajax({
		url:'/importGradeFileMakeUp',
		dataType:'json',
		type:'POST',
		async: true,
		data: formData,
		processData : false, // 使数据不做处理
		contentType : false, // 不要设置Content-Type请求头
		success: function(backjosn){
			$(".fileLoadingArea").hide();
			if(backjosn.code===200){
				var currentMainTable=$("#gradeEntryTable").bootstrapTable("getData");

				for (var i = 0; i < currentMainTable.length; i++) {
					for (var b = 0; b < backjosn.data.length; b++) {
						if(currentMainTable[i].edu005_ID==backjosn.data[b].edu005_ID){
							$("#gradeEntryTable").bootstrapTable('updateByUniqueId', {
								id: backjosn.data[b].edu005_ID,
								row: backjosn.data[b]
							});
						}
					}
				}

				toastr.success('成功导入'+backjosn.data.length+'条成绩');
				var reObject = new Object();
				reObject.fristSelectId = "#level";
				reObject.actionSelectIds = "#department,#grade,#major";
				reObject.InputIds = "#className,#courseName,#studentNumber,#studentName";
				reObject.normalSelectIds = "#xn";
				reReloadSearchsWithSelect(reObject);
				$.hideModal("#importGradeModal")
			}else{
				showImportErrorInfo("#importGradeModal",backjosn.msg);
			}
		},beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
	});
}

//成绩确认班级focus
function confirmGradeForXzbmc(){
	var serachObject=new Object();
	serachObject.level='';
	serachObject.department='';
	serachObject.grade='';
	serachObject.major='';
	serachObject.className='';
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClassGradeModel",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"SearchCriteria":JSON.stringify(serachObject)
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
				$.hideModal("#confirmGradeModal",false);
				$.showModal("#chooseCalssModal",true);
				stuffAdministrationClassTable(backjson.data);
				//提示框取消按钮
				$('.specialCanle1').unbind('click');
				$('.specialCanle1').bind('click', function(e) {
					$.hideModal("#chooseCalssModal",false);
					$.showModal("#confirmGradeModal",true);
					e.stopPropagation();
				});

				//确认选择行政班
				$('#confirmChoosedClalss').unbind('click');
				$('#confirmChoosedClalss').bind('click', function(e) {
					confirmChoosedClalssForconfirmGrade();
					e.stopPropagation();
				});
			} else {
				stuffAdministrationClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//成绩确认-确认选择行政班
function confirmChoosedClalssForconfirmGrade(){
	var choosendClass=$("#chooseClassTable").bootstrapTable("getSelections");
	if(choosendClass.length==0){
		toastr.warning('请选择班级');
		return;
	}

	$("#confirmGradeForXzbmc").val(choosendClass[0].xzbmc);
	$("#confirmGradeForXzbmc").attr("choosendClassId",choosendClass[0].edu300_ID);
	$.hideModal("#chooseCalssModal",false);
	$.showModal("#confirmGradeModal",true);
}

//成绩确认-课程focus
function confirmGradeForKcmc(){
	var chosendClass=$("#confirmGradeForXzbmc").attr("choosendClassId");
	var choosendTerm=getNormalSelectValue("confirmGradeForXn");
	if(chosendClass===""){
		toastr.warning('请先选择班级');
		return;
	}
	if(choosendTerm===""){
		toastr.warning('请先选择学年');
		return;
	}
	searchCourseByClassForConfirmGrade(chosendClass,choosendTerm);
}

//成绩确认-获取课程
function searchCourseByClassForConfirmGrade(chosendClass,choosendTerm){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByClass",
		data: {
			"edu300_ID":chosendClass,
			"term":choosendTerm
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
				$("#chooseCruoseModal").find(".moadalTitle").html("可选课程库");
				$.hideModal("#confirmGradeModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data);

				//提示框取消按钮
				$('.specialCanle2').unbind('click');
				$('.specialCanle2').bind('click', function(e) {
					$.hideModal("#chooseCruoseModal",false);
					$.showModal("#confirmGradeModal",true);
					e.stopPropagation();
				});

				//确认选择课程
				$('#confirmChooseCrouse').unbind('click');
				$('#confirmChooseCrouse').bind('click', function(e) {
					confirmChooseCrouseForConfirmGrade();
					e.stopPropagation();
				});
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//成绩确认-确认选择课程
function confirmChooseCrouseForConfirmGrade(){
	var tableSelected= $("#chooseCrouseTable").bootstrapTable("getSelections");
	if(tableSelected.length==0){
		toastr.warning('请选择课程');
		return;
	}
	$("#confirmGradeForKcmc").val(tableSelected[0].kcmc);
	$.hideModal("#chooseCruoseModal",false);
	$.showModal("#confirmGradeModal",true);
}

//取消成绩确认班级focus
function cancelGradeForXzbmc(){
	var serachObject=new Object();
	serachObject.level='';
	serachObject.department='';
	serachObject.grade='';
	serachObject.major='';
	serachObject.className='';
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClassGradeModel",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
			"SearchCriteria":JSON.stringify(serachObject)
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
				$.hideModal("#cancelGradeModal",false);
				$.showModal("#chooseCalssModal",true);
				stuffAdministrationClassTable(backjson.data);
				//提示框取消按钮
				$('.specialCanle1').unbind('click');
				$('.specialCanle1').bind('click', function(e) {
					$.hideModal("#chooseCalssModal",false);
					$.showModal("#cancelGradeModal",true);
					e.stopPropagation();
				});

				//确认选择行政班
				$('#confirmChoosedClalss').unbind('click');
				$('#confirmChoosedClalss').bind('click', function(e) {
					confirmChoosedClalssForCancelGrade();
					e.stopPropagation();
				});
			} else {
				stuffAdministrationClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//取消成绩-确认选择行政班
function confirmChoosedClalssForCancelGrade(){
	var choosendClass=$("#chooseClassTable").bootstrapTable("getSelections");
	if(choosendClass.length==0){
		toastr.warning('请选择班级');
		return;
	}

	$("#cancelGradeForXzbmc").val(choosendClass[0].xzbmc);
	$("#cancelGradeForXzbmc").attr("choosendClassId",choosendClass[0].edu300_ID);
	$.hideModal("#chooseCalssModal",false);
	$.showModal("#cancelGradeModal",true);
}

//取消成绩确认-课程focus
function cancelGradeForKcmc(){
	var chosendClass=$("#cancelGradeForXzbmc").attr("choosendClassId");
	var choosendTerm=getNormalSelectValue("cancelGradeForXn");
	if(chosendClass===""){
		toastr.warning('请先选择班级');
		return;
	}
	if(choosendTerm===""){
		toastr.warning('请先选择学年');
		return;
	}
	searchCourseByClassForCancelGrade(chosendClass,choosendTerm);
}

//取消成绩确认-获取课程
function searchCourseByClassForCancelGrade(chosendClass,choosendTerm){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByClass",
		data: {
			"edu300_ID":chosendClass,
			"term":choosendTerm
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
				$("#chooseCruoseModal").find(".moadalTitle").html("可选课程库");
				$.hideModal("#cancelGradeModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data);

				//提示框取消按钮
				$('.specialCanle2').unbind('click');
				$('.specialCanle2').bind('click', function(e) {
					$.hideModal("#chooseCruoseModal",false);
					$.showModal("#cancelGradeModal",true);
					e.stopPropagation();
				});

				//确认选择课程
				$('#confirmChooseCrouse').unbind('click');
				$('#confirmChooseCrouse').bind('click', function(e) {
					confirmChooseCrouseForCancelGrade();
					e.stopPropagation();
				});
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//成绩确认-确认选择课程
function confirmChooseCrouseForCancelGrade(){
	var tableSelected= $("#chooseCrouseTable").bootstrapTable("getSelections");
	if(tableSelected.length==0){
		toastr.warning('请选择课程');
		return;
	}
	$("#cancelGradeForKcmc").val(tableSelected[0].kcmc);
	$.hideModal("#chooseCruoseModal",false);
	$.showModal("#cancelGradeModal",true);
}

//预备批量免修
function wantGradeFrees(){
	var reObject = new Object();
	reObject.InputIds = "#gradeFreesForKcmc";
	reObject.normalSelectIds = "#gradeFreesForXn,#gradeFreesForSylx";
	reReloadSearchsWithSelect(reObject);

	var sylx=queryEJDMElementInfo().sylx;
	if(typeof sylx==="undefined"||sylx==null){
		toastr.warning("暂无生源类型");
		return;
	}
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < sylx.length; i++) {
		str += '<option value="' + sylx[i].ejdm + '">' + sylx[i].ejdmz
			+ '</option>';
	}
	stuffManiaSelect("#gradeFreesForSylx", str);
	$.showModal("#gradeFreesModal",true);
}

//预备批量免修modal课程focus
function gradeFreesForKcmc(){
	var xn=getNormalSelectValue("gradeFreesForXn");
	if(xn===""){
		toastr.warning('请选择学年');
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByXNAndID",
		data: {
			"term":xn,
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
			if (backjson.code === 200) {
				$("#chooseCruoseModal").find(".moadalTitle").html("可选课程库");
				$.hideModal("#gradeFreesModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data,true);

				//提示框取消按钮
				$('.specialCanle2').unbind('click');
				$('.specialCanle2').bind('click', function(e) {
					$.hideModal("#chooseCruoseModal",false);
					$.showModal("#gradeFreesModal",true);
					e.stopPropagation();
				});

				//确认选择课程
				$('#confirmChooseCrouse').unbind('click');
				$('#confirmChooseCrouse').bind('click', function(e) {
					confirmGradeFreesForKcmc();
					e.stopPropagation();
				});
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//批量免修确认选择课程
function confirmGradeFreesForKcmc(){
	if(choosendCrouse.length==0){
		toastr.warning('请选择课程');
		return;
	}
	var kcmcs=new Array();
	for (var i = 0; i < choosendCrouse.length; i++){
		kcmcs.push(choosendCrouse[i].kcmc);
	}

	$("#gradeFreesForKcmc").val(kcmcs);
	$.hideModal("#chooseCruoseModal",false);
	$.showModal("#gradeFreesModal",true);
}

//批量免修确认
function sendconfirmGradeFrees(){
	var xn=getNormalSelectValue('gradeFreesForXn');
	var sylx=getNormalSelectValue('gradeFreesForSylx');
	var kc=$("#gradeFreesForKcmc").val();

	if(xn===""){
		toastr.warning('请选择学年');
		return;
	}

	if(kc===""){
		toastr.warning('请选择课程');
		return;
	}

	if(sylx===""){
		toastr.warning('请选择生源类型');
		return;
	}

	$.hideModal("#gradeFreesModal",false);
	$.showModal("#remindModal",true);
	$(".remindType").html(getNormalSelectText('gradeFreesForSylx')+' / '+getNormalSelectText('gradeFreesForXn')+'的'+' / ('+kc+')课程');
	$(".remindActionType").html(" -免修");

	//确认
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		$.ajax({
			method : 'get',
			cache : false,
			url : "/updateMXStatusByCourse",
			data: {
				"term":xn,
				"courserName":kc,
				"sylxbm":sylx,
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
				startSearch();
				requestComplete();
			},
			success : function(backjson) {
				if (backjson.code === 200) {
					// var mxStudentds=backjson.data;
					// for (var i = 0; i < mxStudentds.length; i++) {
					// 	$("#gradeEntryTable").bootstrapTable('updateByUniqueId', {
					// 		id: mxStudentds[i].edu005_ID,
					// 		row: mxStudentds[i]
					// 	});
					// }
					toastr.success(backjson.msg);
					$.hideModal("#remindModal",false);
				} else {
					hideloding();
					toastr.warning(backjson.msg);
				}
			}
		});
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.specialCanleTip').unbind('click');
	$('.specialCanleTip').bind('click', function(e) {
		$.hideModal("#remindModal",false);
		$.showModal("#gradeFreesModal",true);
		e.stopPropagation();
	});
}

//成绩未确认查询
function notComfrimQuery(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseGetGradeByTeacher",
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
				stuffnotComfrimQueryTable(backjson.data);
				$.showModal('#notComfrimQueryModal',true);
			}else{
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充课程表
function stuffnotComfrimQueryTable(tableInfo){
	$('#notComfrimQueryTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		showExport: false,      //是否显示导出
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".notComfrimQueryTableTableArea", "未确认课程信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field : 'id',
				title: '唯一标识',
				align : 'center',
				sortable: true,
				visible : false
			},{
				field : 'className',
				title : '班级名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'courseName',
				title : '课程名称',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},{
				field : 'xn',
				title : '学年',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'xbmc',
				title : '二级学院',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'isExamCrouse',
				title : '是否为考试课',
				visible : false,
				align : 'left',
				sortable: true,
				formatter : isExamCrouseMatter
			}]
	});

	function isExamCrouseMatter(value, row, index) {
		if(typeof value === 'undefined'||value==null||value===""){
			return [ '<div class="myTooltip normalTxt" title="否">否</div>' ]
				.join('');
		}else{
			return [ '<div class="myTooltip" title="是">是</div>' ]
				.join('');
		}
	}

	drawPagination(".notComfrimQueryTableTableArea", "未确认课程信息");
	drawSearchInput(".notComfrimQueryTableTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".notComfrimQueryTableTableArea", "未确认课程信息");
}

//初始化页面按钮绑定事件
function binBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#research').unbind('click');
	$('#research').bind('click', function(e) {
		research();
		e.stopPropagation();
	});

	//预备下载成绩模板
	$('#wantLoadGradeModel').unbind('click');
	$('#wantLoadGradeModel').bind('click', function(e) {
		wantLoadGradeModel();
		e.stopPropagation();
	});

	//预备导入成绩
	$('#wantImportGrades').unbind('click');
	$('#wantImportGrades').bind('click', function(e) {
		wantImportGrades();
		e.stopPropagation();
	});

	//成绩确认
	$('#wantConfirmGrade').unbind('click');
	$('#wantConfirmGrade').bind('click', function(e) {
		wantConfirmGrade();
		e.stopPropagation();
	});

	//成绩确认班级focus
	$('#confirmGradeForXzbmc').focus(function(e){
		confirmGradeForXzbmc();
		e.stopPropagation();
	});

	//成绩确认课程focus
	$('#confirmGradeForKcmc').focus(function(e){
		confirmGradeForKcmc();
		e.stopPropagation();
	});

	//取消成绩确认
	$('#wantCancelGrade').unbind('click');
	$('#wantCancelGrade').bind('click', function(e) {
		wantCancelGrade();
		e.stopPropagation();
	});

	//取消成绩确认班级focus
	$('#cancelGradeForXzbmc').focus(function(e){
		cancelGradeForXzbmc();
		e.stopPropagation();
	});

	//取消成绩确认课程focus
	$('#cancelGradeForKcmc').focus(function(e){
		cancelGradeForKcmc();
		e.stopPropagation();
	});

	//下载模板modal班级focus
	$('#loadForXzbmc').focus(function(e){
		getAllClass();
		e.stopPropagation();
	});

	//下载模板modal课程focus
	$('#loadForKcmc').focus(function(e){
		getCoruses();
		e.stopPropagation();
	});

	//预备下载不及格成绩模板
	$('#wantLoadNoPassGradeModel').unbind('click');
	$('#wantLoadNoPassGradeModel').bind('click', function(e) {
		wantLoadNoPassGradeModel();
		e.stopPropagation();
	});

	//下载不及格模板modal课程focus
	$('#loadNotPassForKcmc').focus(function(e){
		getCourseByXNAndUserID();
		e.stopPropagation();
	});

	//下载不及格模板modal班级focus
	$('#loadNotPassForXzbmc').focus(function(e){
		getclassforNotPass();
		e.stopPropagation();
	});

	//不及格预备导入成绩
	$('#wantConfirmNotPassGrade').unbind('click');
	$('#wantConfirmNotPassGrade').bind('click', function(e) {
		wantImportGradesforNotPass();
		e.stopPropagation();
	});

	//预备批量免修
	$('#wantGradeFrees').unbind('click');
	$('#wantGradeFrees').bind('click', function(e) {
		wantGradeFrees();
		e.stopPropagation();
	});

	//预备批量免修modal课程focus
	$('#gradeFreesForKcmc').focus(function(e){
		gradeFreesForKcmc();
		e.stopPropagation();
	});

	//确认免修
	$('#confirmGradeFrees').unbind('click');
	$('#confirmGradeFrees').bind('click', function(e) {
		sendconfirmGradeFrees(1);
		e.stopPropagation();
	});

	//成绩未确认查询
	$('#notComfrimQuery').unbind('click');
	$('#notComfrimQuery').bind('click', function(e) {
		notComfrimQuery();
		e.stopPropagation();
	});
}







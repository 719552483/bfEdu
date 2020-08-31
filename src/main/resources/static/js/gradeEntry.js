var EJDMElementInfo;
$(function() {
	getMajorTrainingSelectInfo();
	drawStudentBaseInfoEmptyTable();
	btnControl();
	binBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

//获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
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
		columns: [
			{
				field: 'edu005_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			}, {
				field: 'className',
				title: '行政班',
				align: 'left',
				formatter: xzbnameMatter
			},{
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				formatter: paramsMatter
			},  {
				field: 'studentName',
				title: '姓名',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'grade',
				title: '成绩',
				align: 'left',
				formatter: gradeMatter
			}, {
				field: 'gradeEnter',
				title: '录入人',
				align: 'left',
				formatter: gradeEnterMatter
			},{
				field: 'entryDate',
				title: '录入时间',
				align: 'left',
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
		return [
			'<ul class="toolbar tabletoolbar">' +
			'<li id="wantGradeEntry" class="insertBtn wantGradeEntry'+index+'"><span><img src="images/t01.png" style="width:24px"></span>录入</li>' +
			'<li id="comfirmGradeEntry" class="noneStart comfirmGradeEntry'+index+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
			'<li id="cancelGradeEntry" class="noneStart cancelGradeEntry'+index+'"><span><img src="images/t03.png"></span>取消</li>' +
			'</ul>'
		]
			.join('');
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

	function gradeMatter(value, row, index) {
		if(row.isExamCrouse==="T"){
			if (typeof value==="undefined"||value==null||value==="") {
				return [ '<div>' +
				'<span class="grade grade'+index+'"></span>' +
				'<input type="text" class="gradeInput tableInput noneStart" id="grade'+index+'">' +
				'</div>' ].join('');
			} else {
				return [ '<div class="myTooltip" title="'+value+'">' +
				'<span class="grade grade'+index+'">'+value+'</span>' +
				'<input type="text" class="gradeInput tableInput noneStart" id="grade'+index+'">' +
				'</div>' ].join('');
			}
		}else{
			var title="";
			if(row.grade==null){
				title="暂无成绩";
			}else{
				row.grade==="T"?title="通过":title="不通过";
			}
             var str='<option value="T">通过</option><option value="F">不通过</option>';
			if(typeof value==="undefined"||value==null||value==="null"){
				return [
					'<div class="myTooltip gradeArea'+index+'" title="'+title+'">' +
					'<span class="grade grade'+index+'"></span>' +
					'<select class="isSowIndex myTableSelect myTableSelect' +index + '" id="grade'+index+'">'
						+ str +
					'</select>'+
					'</div>'
				]
					.join('');
			}else{
				return [
					'<div class="myTooltip gradeArea'+index+'" title="'+title+'">' +
						'<span class="grade grade'+index+'">'+title+'</span>' +
						'<select class="isSowIndex myTableSelect myTableSelect' +index + '" id="grade'+index+'">'
						+ str +
						'</select>'+
					'</div>'
				]
					.join('');
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

	drawPagination(".studentBaseInfoTableArea", "学生信息");
	drawSearchInput(".studentBaseInfoTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".studentBaseInfoTableArea", "学生信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//预备录入成绩
function wantGradeEntry(row,index){
	$(".wantGradeEntry"+index).hide();
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
	var currentGrade=$("#grade"+index).val();
	if(row.isExamCrouse==="T"){
		 currentGrade=$("#grade"+index).val();
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
				row.entryDate=backjson.data;
				$("#gradeEntryTable").bootstrapTable("updateByUniqueId", {id: row.edu005_ID, row: row});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取检索对象
function getSearchObject(){
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");
	var className=$("#className").val();
	var courseName=$("#courseName").val();
	var studentNumber=$("#studentNumber").val();
	var studentName=$("#studentName").val();


	var returnObject = new Object();
	returnObject.level = levelValue;
	returnObject.department = departmentValue;
	returnObject.grade = gradeValue;
	returnObject.major = majorValue;
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
	reReloadSearchsWithSelect(reObject);
	drawStudentBaseInfoEmptyTable();
}

//初始化页面按钮绑定事件
function binBind() {
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
}


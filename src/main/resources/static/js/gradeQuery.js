var EJDMElementInfo;
$(function() {
	stuffNj();
	drawStudentGradeEmptyTable();
	binBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

//填充年级下拉框
function stuffNj(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getStudentXn",
		data: {
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
			var str = '';
			if (backjson.code === 500) {
				toastr.info(backjson.msg);
				str = '<option value="seleceConfigTip">暂无选择</option>';
			}else{
				str = '<option value="seleceConfigTip">请选择</option>';
			}
			for (var i = 0; i < backjson.data.length; i++) {
				str += '<option value="'+backjson.data[i].edu400_ID+'">'+ backjson.data[i].xnmc+'</option>';
			}
			stuffManiaSelect("#grade", str);
		}
	});
}

//填充空的学生表
function drawStudentGradeEmptyTable() {
	stuffStudentGradeTable({});
}

//渲染学生表
function stuffStudentGradeTable(tableInfo) {
	$('#studentGradeTable').bootstrapTable('destroy').bootstrapTable({
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
		    fileName: '成绩导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",   
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".studentGradeTableArea", "成绩信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'edu005_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			},{
				field: 'className',
				title: '行政班',
				align: 'left',
				sortable: true,
				formatter: xzbnameMatter
			}, {
				field: 'xn',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: xzbnameMatter
			},{
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},  {
				field: 'studentName',
				title: '学生姓名',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'grade',
				title: '成绩',
				align: 'left',
				sortable: true,
				formatter: gradeMatter
			}, {
				field: 'credit',
				title: '课程总学分',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'getCredit',
				title: '课程已获学分',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'gradeEnter',
				title: '录入人',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'entryDate',
				title: '录入时间',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}
		]
	});

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
		if (value==="T"||value==="F") {
			var str="";
			value==="T"?str="通过":str="不通过";
			if(str==="通过"){
				return [
					'<div class="myTooltip greenTxt" title="'+str+'">'+str+'</div>'
				]
					.join('');
			}else{
				return [
					'<div class="myTooltip redTxt" title="'+str+'">'+str+'</div>'
				]
					.join('');
			}
		} else {
			if(value==null||value===""||typeof value==="undefined"){
				return [
					'<div class="myTooltip normalTxt" title="暂无成绩">暂无成绩</div>'
				]
					.join('');
			}else{
				if(parseInt(value)<60){
					return [
						'<div class="myTooltip redTxt" title="'+value+'">'+value+'</div>'
					]
						.join('');
				}else{
					return [
						'<div class="myTooltip greenTxt" title="'+value+'">'+value+'</div>'
					]
						.join('');
				}
			}
		}
	}

	drawPagination(".studentGradeTableArea", "成绩信息");
	drawSearchInput(".studentGradeTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".studentGradeTableArea", "成绩信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//获取检索对象
function getSearchObject(){
	var grade = getNormalSelectValue("grade");
	var courseName=$("#courseName").val();

	var returnObject = new Object();
	returnObject.grade = grade;
	returnObject.courseName = courseName;
	return returnObject;
}

//开始检索
function startSearch(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentGetGrades",
		data: {
			"SearchCriteria":JSON.stringify(getSearchObject()),
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
				stuffStudentGradeTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawStudentGradeEmptyTable();
			}
		}
	});
}

//重置检索
function research(){
	var reObject = new Object();
	reObject.normalSelectIds = "#grade";
	reObject.InputIds = "#courseName";
	reReloadSearchsWithSelect(reObject);
	drawStudentGradeEmptyTable();
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


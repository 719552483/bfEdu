$(function() {
	drawStudentGradeEmptyTable();
	$('.isSowIndex').selectMania(); //初始化下拉框
	stuffNj();
	btnBind();
});

//填充年级下拉框
function stuffNj(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAllXn",
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
				toastr.warning(backjson.msg);
				str = '<option value="seleceConfigTip">暂无选择</option>';
			}else{
				str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.data.length; i++) {
					str += '<option value="'+backjson.data[i].edu400_ID+'">'+ backjson.data[i].xnmc+'</option>';
				}
			}
			stuffManiaSelect("#grade", str);
			stuffManiaSelect("#export_grade", str);
		}
	});
}

//填充空的成绩表
function drawStudentGradeEmptyTable() {
	stuffStudentGradeTable({});
}

//渲染成绩表
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
				field: 'isResit',
				title: '是否补考',
				align: 'center',
				sortable: true,
				width:'10',
				formatter: isResitMatter
			},
			{
				field: 'isConfirm',
				title: '成绩确认',
				align: 'center',
				sortable: true,
				width:'10',
				formatter: isConfirmMatter
			},{
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
	drawPagination(".studentGradeTableArea", "成绩信息");
	drawSearchInput(".studentGradeTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".studentGradeTableArea", "成绩信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//预备选择学生
function wantChooseStudent(){
	var reObject = new Object();
	reObject.InputIds = "#chooseStudent_className,#chooseStudent_StudentName,#chooseStudent_number";
	reReloadSearchsWithSelect(reObject);

	//初始化表格
	var oTable = new stuffStudentTable();
	oTable.Init();

	//学生开始检索
	$('#allStudent_StartSearch').unbind('click');
	$('#allStudent_StartSearch').bind('click', function(e) {
		allStudentStartSearch();
		e.stopPropagation();
	});

	//学生重置检索
	$('#allStudent_ReSearch').unbind('click');
	$('#allStudent_ReSearch').bind('click', function(e) {
		allStudentReSearch();
		e.stopPropagation();
	});

	//确认选择学生
	$('#confirmChoosedStudent').unbind('click');
	$('#confirmChoosedStudent').bind('click', function(e) {
		confirmChoosedStudent();
		e.stopPropagation();
	});
}

//渲染学生表
function stuffStudentTable(){
	var oTableInit = new Object();
	oTableInit.Init = function () {
		$('#chooseStudentTable').bootstrapTable('destroy').bootstrapTable({
			url:'/studentMangerSearchStudent',         //请求后台的URL（*）
			method: 'POST',                      //请求方式（*）
			striped: true,                      //是否显示行间隔色
			cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,                   //是否显示分页（*）
			queryParamsType: '',
			dataType: 'json',
			pageNumber: 1, //初始化加载第一页，默认第一页
			queryParams: queryParams,//请求服务器时所传的参数
			sidePagination: 'server',//指定服务器端分页
			pageSize: 5,//单页记录数
			search: false,
			silent: false,
			showRefresh: false,                  //是否显示刷新按钮
			showToggle: false,
			clickToSelect: true,
			showExport: false,      //是否显示导出
			striped: true,
			toolbar: '#toolbar',
			showColumns: false,
			onPostBody: function() {
				drawPagination(".chooseStudentTableArea", "学生信息");
				drawSearchInput(".chooseStudentTableArea");
				changeTableNoRsTip();
				changeColumnsStyle(".chooseStudentTableArea", "学生信息");
				toolTipUp(".myTooltip");
			},
			onPageChange: function() {
				drawPagination(".chooseStudentTableArea", "学生信息");
			},
			columns: [
				{
					field : 'radio',
					radio : true
				},{
					field: 'edu001_ID',
					title: '唯一标识',
					align: 'center',
					sortable: true,
					visible: false
				},
				 {
					field: 'xzbname',
					title: '行政班',
					align: 'left',
					sortable: true,
					formatter: xzbnameMatter
				}, {
					field: 'xh',
					title: '学号',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, {
					field: 'xm',
					title: '姓名',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, {
					field: 'xb',
					title: '性别',
					align: 'left',
					sortable: true,
					formatter: sexFormatter
				} ],
			responseHandler: function (res) {  //后台返回的结果
				if(res.code == 200){
					var data = {
						total: res.data.total,
						rows: res.data.rows
					};
					$.showModal("#chooseStudentModal",true);
					return data;
				}else{
					var data = {
						total: 0,
						rows:[]
					};
					toastr.warning(res.msg);
					return data;
				}
			}
		});
	};

	// 得到查询的参数
	function queryParams(params) {
		var temp=getSearchStudentObject();
		temp.pageNum=params.pageNumber;
		temp.pageSize=params.pageSize;
		return JSON.stringify(temp);
	}

	function xzbnameMatter(value, row, index) {
		if (value===""||value==null) {
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

	return oTableInit;
}

//得到学生检索对象
function getSearchStudentObject(){
	var className = $("#chooseStudent_className").val();
	var studentName = $("#chooseStudent_StudentName").val();
	var studentNumber = $("#chooseStudent_number").val();

	var searchObject = new Object();
	searchObject.className = className;
	searchObject.studentName = studentName;
	searchObject.studentNumber = studentNumber;
	searchObject.level = "";
	searchObject.department = "";
	searchObject.grade = "";
	searchObject.major = "";
	searchObject.administrationClass = "";
	searchObject.status = "";
	searchObject.studentRollNumber = "";
	searchObject.userId =$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	return searchObject;
}

//学生开始检索
function allStudentStartSearch(){
	var oTable = new stuffStudentTable();
	oTable.Init();
}

//学生重置检索
function allStudentReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#chooseStudent_className,#chooseStudent_StudentName,#chooseStudent_number";
	reReloadSearchsWithSelect(reObject);
	var oTable = new stuffStudentTable();
	oTable.Init();
}

//确认选择学生
function confirmChoosedStudent(){
	var choosed=$("#chooseStudentTable").bootstrapTable("getSelections");
	if(choosed.length==0){
		toastr.warning('请选择学生');
		return;
	}
	$("#student").val(choosed[0].xm);
	$("#student").attr("studentId",choosed[0].edu001_ID);
	$.hideModal("#chooseStudentModal");
}

//开始检索
function startSearch(){
	var searchCriteria=getSearchObject();
	if(typeof searchCriteria==="undefined"){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentGetGrades",
		data: {
			"SearchCriteria":JSON.stringify(searchCriteria),
			"userKey":searchCriteria.student
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

//获取检索对象
function getSearchObject(){
	var grade = getNormalSelectValue("grade");
	var courseName=$("#courseName").val();
	var student=$("#student").attr("studentId");

	if(student===""){
		toastr.warning('请选择学生');
		return;
	}

	var returnObject = new Object();
	returnObject.student = student;
	returnObject.grade = grade;
	returnObject.courseName = courseName;
	return returnObject;
}

//重置检索
function research() {
	var reObject = new Object();
	reObject.InputIds = "#student,#courseName";
	reObject.normalSelectIds = "#grade";
	reReloadSearchsWithSelect(reObject);
	$("#student").attr("studentId","");
	drawStudentGradeEmptyTable();
}

//预备成绩导出
function exportGrade(){
	$("#export_classes").val("");
	$("#export_crouse").val("");
	$("#export_classes").attr("choosendClassId","");
	$("#export_crouse").attr("choosendCrouseIds","");

	var reObject = new Object();
	reObject.normalSelectIds = "#export_grade";
	reReloadSearchsWithSelect(reObject);

	$.showModal("#exportGradeModal",true);
}

//预备选择班级
function wantChooseExportClass(){
	$("#chooseCalss_className").val("");
	getAllClass('');

	//检索行政班
	$('#chooseCalss_StartSearch').unbind('click');
	$('#chooseCalss_StartSearch').bind('click', function(e) {
		chooseCalssStartSearch();
		e.stopPropagation();
	});

	//重置检索行政班
	$('#chooseCalss_ReSearch').unbind('click');
	$('#chooseCalss_ReSearch').bind('click', function(e) {
		chooseCalssReSearch();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.specialCanle1').unbind('click');
	$('.specialCanle1').bind('click', function(e) {
		$.hideModal("#chooseCalssModal",false);
		$.showModal("#exportGradeModal",true);
		e.stopPropagation();
	});

	//确认选择行政班
	$('#confirmChoosedClalss').unbind('click');
	$('#confirmChoosedClalss').bind('click', function(e) {
		confirmChoosedClass();
		e.stopPropagation();
	});
}

//获取所有行政班
function getAllClass(calssName){
	var serachObject=new Object();
	serachObject.level='';
	serachObject.department='';
	serachObject.grade='';
	serachObject.major='';
	serachObject.className=calssName;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClass",
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
				$.hideModal("#exportGradeModal",false);
				$.showModal("#chooseCalssModal",true);
				stuffAdministrationClassTable(backjson.data);
			} else {
				stuffAdministrationClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充行政班表
function stuffAdministrationClassTable(tableInfo){
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
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [ {
			field : 'radio',
			radio : true
		},  {
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
			formatter :paramsMatter
		}, {
			field : 'xbmc',
			title : '所属二级学院',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'njmc',
			title : '年级',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'zymc',
			title : '专业',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
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

//检索行政班
function chooseCalssStartSearch(){
	var className=$("#chooseCalss_className").val();
	if(className===""){
		toastr.warning('班级名称不能为空');
		return;
	}
	getAllClass(className);
}

//重置检索行政班
function chooseCalssReSearch(){
	getAllClass("");
	$("#chooseCalss_className").val("");
}

//确认选择行政班
function confirmChoosedClass(){
	var choosendClass=$("#chooseClassTable").bootstrapTable("getSelections");
	if(choosendClass.length==0){
		toastr.warning('请选择班级');
		return;
	}

	$("#export_classes").attr("choosendClassId",choosendClass[0].edu300_ID);
	$("#export_classes").val(choosendClass[0].xzbmc);
	$.hideModal("#chooseCalssModal",false);
	$.showModal("#exportGradeModal",true);
}

//预备选择课程
function wantChooseExportCrouse(){
	var chosendClass=$("#export_classes").attr("choosendClassId");
	if(chosendClass===""){
		toastr.warning('请先选择班级');
		return;
	}
	searchCourseByClass(chosendClass);

	//提示框取消按钮
	$('.specialCanle2').unbind('click');
	$('.specialCanle2').bind('click', function(e) {
		$.hideModal("#chooseCruoseModal",false);
		$.showModal("#exportGradeModal",true);
		e.stopPropagation();
	});

	//确认选择课程
	$('#confirmChooseCrouse').unbind('click');
	$('#confirmChooseCrouse').bind('click', function(e) {
		confirmChooseCrouse();
		e.stopPropagation();
	});
}

//根据班级获取课程
function searchCourseByClass(chosendClass){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByClass",
		data: {
			"edu300_ID":chosendClass
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
				$("#chooseCruoseModal").find(".moadalTitle").html($("#export_classes").val()+"课程");
				$.hideModal("#exportGradeModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data);
			} else {
				stuffCrouseClassTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosendCrouses=new Array();
//填充课程表
function stuffCrouseClassTable(tableInfo){
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
		onCheck : function(row) {
			onCheck(row);
		},
		onUncheck : function(row) {
			onUncheck(row);
		},
		onCheckAll : function(rows) {
			onCheckAll(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAll(rows2);
		},
		onPageChange : function() {
			drawPagination(".chooseCrouseTableArea", "课程信息");
			for (var i = 0; i < choosendCrouses.length; i++) {
				$("#chooseCrouseTable").bootstrapTable("checkBy", {field:"edu108_ID", values:[choosendCrouses[i].edu108_ID]})
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [ {
			field: 'check',
			checkbox: true
		},  {
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
	if(choosendCrouses.length<=0){
		choosendCrouses.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendCrouses.length; i++) {
			if(choosendCrouses[i].edu108_ID===row.edu108_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendCrouses.push(row);
		}
	}
}

//单反选课程
function onUncheck(row){
	if(choosendCrouses.length<=1){
		choosendCrouses.length=0;
	}else{
		for (var i = 0; i < choosendCrouses.length; i++) {
			if(choosendCrouses[i].edu108_ID===row.edu108_ID){
				choosendCrouses.splice(i,1);
			}
		}
	}
}

//全选教课程
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosendCrouses.push(row[i]);
	}
}

//全反选课程
function onUncheckAll(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu108_ID);
	}


	for (var i = 0; i < choosendCrouses.length; i++) {
		if(a.indexOf(choosendCrouses[i].edu108_ID)!==-1){
			choosendCrouses.splice(i,1);
			i--;
		}
	}
}

//确认选择课程
function confirmChooseCrouse(){
	if(choosendCrouses.length==0){
		toastr.warning('请选择课程');
		return;
	}
	var choosendCrousesIds=new Array();
	var choosendCrousesNames=new Array();
	for (var i = 0; i < choosendCrouses.length; i++) {
		choosendCrousesIds.push(choosendCrouses[0].edu108_ID);
		choosendCrousesNames.push(choosendCrouses[0].kcmc);
	}

	$("#export_crouse").attr("choosendCrouseIds",choosendCrousesIds);
	$("#export_crouse").val(choosendCrousesNames);
	$.hideModal("#chooseCruoseModal",false);
	$.showModal("#exportGradeModal",true);
}

//确认成绩导出
function confirmExportGrade(){
	var classes=$("#export_classes").attr("choosendClassId");
	var crouses=$("#export_crouse").attr("choosendCrouseIds");
	var trem=getNormalSelectValue("export_grade")
	if(classes===""){
		toastr.warning("请选择班级");
		return;
	}

	if(trem===""){
		toastr.warning("请选择学年");
		return;
	}

	var sendObject=new Object();
	sendObject.classes=classes;
	sendObject.crouses=crouses;
	sendObject.trem=trem;

	var url = "/exportGrade";
	var form = $("<form></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "queryInfo").attr("value",JSON.stringify(sendObject)));
	form.appendTo('body').submit().remove();
}

//初始化页面按钮绑定事件
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//学生focus
	$('#student').focus(function(e){
		wantChooseStudent();
		e.stopPropagation();
	});

	//班级focus
	$('#export_classes').focus(function(e){
		wantChooseExportClass();
		e.stopPropagation();
	});

	//课程focus
	$('#export_crouse').focus(function(e){
		wantChooseExportCrouse();
		e.stopPropagation();
	});

	//预备成绩导出
	$('#exportGrade').unbind('click');
	$('#exportGrade').bind('click', function(e) {
		exportGrade();
		e.stopPropagation();
	});

	//确认成绩导出
	$('#confirmExportGrade').unbind('click');
	$('#confirmExportGrade').bind('click', function(e) {
		confirmExportGrade();
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#research').unbind('click');}
	$('#research').bind('click', function(e) {
		research();
		e.stopPropagation();
	});

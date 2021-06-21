$(function() {
	judgementPWDisModifyFromImplements();
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
			stuffManiaSelect("#exportNoPassGrade_grade", str);
			stuffManiaSelect("#gradeSituationGrade", str);
			stuffManiaSelect("#gradeSituationGradeForNotPass", str);
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
		onDblClickRow : function(row, $element, field) {
			reExamInfo(row);
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
			},{
				field: 'exam_num',
				title: '补考次数(双击详情)',
				align: 'left',
				sortable: true,
				formatter: examNnumMatter
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

//获取补考详情
function reExamInfo(row){
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
				for (var i = 0; i < backjson.data.length; i++) {
					var currentHistory= backjson.data[i];
					var reExamText="";
					i<=0?reExamText="正常考试":reExamText="第"+i+"次补考";
					historyTxt+='<div class="historyArea"><p class="Historystep">'+reExamText+'</p><div>' +
						'<span><cite>课程名称：</cite><b>'+nullMatter(currentHistory.courseName)+'</b></span>'+
						'<span><cite>补考成绩：</cite><b>'+nullMatter(currentHistory.grade)+'</b></span>'+
						'<span><cite>补考时间：</cite><b>'+nullMatter(currentHistory.entryDate)+'</b></span>'+
						'<span><cite>操作人：</cite><b>'+nullMatter(currentHistory.gradeEnter)+'</b></span>'+
						'</div></div>' ;
					if((i+1)!=backjson.data.length){
						historyTxt+='<img class="spiltImg" src="images/uew_icon_hover.png"></img>';
					}
				}
				$(".historyInfo").append(historyTxt);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//预备选择学生
function wantChooseStudent(){
	var reObject = new Object();
	reObject.InputIds = "#chooseStudent_className,#chooseStudent_StudentName,#chooseStudent_number";
	reReloadSearchsWithSelect(reObject);

	//初始化表格
	var oTable = new stuffStudentTable('radio');
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

var choosendStudent=new Array();
//渲染学生表
function stuffStudentTable(cheeckType){
	choosendStudent=new Array();
	var cheeckObject=new Object();
	if(cheeckType==='radio'){
		cheeckObject={
				field : 'radio',
				radio : true
		};
	}else{
		cheeckObject={
				field : 'check',
				checkbox : true
		};
	}

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
			onCheck : function(row) {
				onCheckStudent(row);
			},
			onUncheck : function(row) {
				onUncheckStudent(row);
			},
			onCheckAll : function(rows) {
				onCheckAllStudent(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAllStudent(rows2);
			},
			onPostBody: function() {
				drawPagination(".chooseStudentTableArea", "学生信息");
				drawSearchInput(".chooseStudentTableArea");
				changeTableNoRsTip();
				changeColumnsStyle(".chooseStudentTableArea", "学生信息");
				toolTipUp(".myTooltip");
				if(cheeckType!=='radio'){
					//勾选已选数据
					for (var i = 0; i < choosendStudent.length; i++) {
						$("#chooseStudentTable").bootstrapTable("checkBy", {field:"edu001_ID", values:[choosendStudent[i].edu001_ID]})
					}
				}
			},
			onPageChange: function() {
				drawPagination(".chooseStudentTableArea", "学生信息");
			},
			columns: [
				cheeckObject,
				{
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

//单选学生
function onCheckStudent(row){
	if(choosendStudent.length<=0){
		choosendStudent.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendStudent.length; i++) {
			if(choosendStudent[i].edu001_ID===row.edu001_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendStudent.push(row);
		}
	}
}

//单反选学生
function onUncheckStudent(row){
	if(choosendStudent.length<=1){
		choosendStudent.length=0;
	}else{
		for (var i = 0; i < choosendStudent.length; i++) {
			if(choosendStudent[i].edu001_ID===row.edu001_ID){
				choosendStudent.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllStudent(row){
	for (var i = 0; i < row.length; i++) {
		choosendStudent.push(row[i]);
	}
}

//全反选学生
function onUncheckAllStudent(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu001_ID);
	}


	for (var i = 0; i < choosendStudent.length; i++) {
		if(a.indexOf(choosendStudent[i].edu001_ID)!==-1){
			choosendStudent.splice(i,1);
			i--;
		}
	}
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
	// var courseName=$("#courseName").val();
	var student=$("#student").attr("studentId");

	if(student===""){
		toastr.warning('请选择学生');
		return;
	}

	var returnObject = new Object();
	returnObject.student = student;
	returnObject.grade = grade;
	// returnObject.courseName = courseName;
	return returnObject;
}

//重置检索
function research() {
	var reObject = new Object();
	reObject.InputIds = "#student";
	reObject.normalSelectIds = "#grade";
	reReloadSearchsWithSelect(reObject);
	$("#student").attr("studentId","");
	drawStudentGradeEmptyTable();
}

//预备成绩导出
function exportGrade(){
	$("#exportGradeModal").find(".searchArea").show();
	$("#exportGradeModal").find(".exportGradeLookArea").hide();
	$("#export_classes").val("");
	$("#export_crouse").val("");
	$("#export_classes").attr("choosendClassId","");
	$("#export_crouse").attr("choosendCrouseIds","");

	var reObject = new Object();
	reObject.normalSelectIds = "#export_grade";
	reReloadSearchsWithSelect(reObject);

	$.showModal("#exportGradeModal",true);
	$("#exportGradeModal").find('.moadalTitle').html("班级成绩导出");
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
function wantChooseExportCrouse(type){
	if(type==1){
		choosendCrouses=new Array();
		var chosendClass=$("#export_classes").attr("choosendClassId");
		var choosendTerm=getNormalSelectValue("export_grade");
		if(chosendClass===""){
			toastr.warning('请先选择班级');
			return;
		}
		if(choosendTerm===""){
			toastr.warning('请先选择学年');
			return;
		}
		searchCourseByClass(chosendClass,choosendTerm,type);
		//提示框取消按钮
		$('.specialCanle2').unbind('click');
		$('.specialCanle2').bind('click', function(e) {
			$.hideModal("#chooseCruoseModal",false);
			$.showModal("#exportGradeModal",true);
			e.stopPropagation();
		});
	}else{
		var chosendTerm=getNormalSelectValue("exportNoPassGrade_grade");
		var chosendTermText=getNormalSelectText("exportNoPassGrade_grade");
		if(chosendTerm===""){
			toastr.warning('请先选择学年');
			return;
		}
		searchCourseByXN(chosendTerm,chosendTermText,type);
		//提示框取消按钮
		$('.specialCanle2').unbind('click');
		$('.specialCanle2').bind('click', function(e) {
			$.hideModal("#chooseCruoseModal",false);
			$.showModal("#exportNoPassGradeModal",true);
			e.stopPropagation();
		});
	}

	//确认选择课程
	$('#confirmChooseCrouse').unbind('click');
	$('#confirmChooseCrouse').bind('click', function(e) {
		confirmChooseCrouse(type);
		e.stopPropagation();
	});
}

//根据班级获取课程
function searchCourseByClass(chosendClass,choosendTerm,type){
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
				choosendCrouses.length = 0;
				$("#chooseCruoseModal").find(".moadalTitle").html($("#export_classes").val()+"课程");
				$.hideModal("#exportGradeModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data,type);
			} else {
				stuffCrouseClassTable({},type);
				toastr.warning(backjson.msg);
			}
		}
	});
}

//根据学年获取课程
function searchCourseByXN(choosendTerm,chosendTermText,type){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseByXN",
		data: {
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
				choosendCrouses.length = 0;
				$("#chooseCruoseModal").find(".moadalTitle").html(chosendTermText+"课程库");
				$.hideModal("#exportNoPassGradeModal",false);
				$.showModal("#chooseCruoseModal",true);
				stuffCrouseClassTable(backjson.data,type);
			} else {
				stuffCrouseClassTable({},type);
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosendCrouses=new Array();
//填充课程表
function stuffCrouseClassTable(tableInfo,type){
	var chekType;
	if(type==1){
		chekType={
			field: 'check',
			checkbox: true
		}
	}else{
		chekType={
			field : 'radio',
			radio : true
		}
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
		onCheck : function(row) {
			onCheck(row,type);
		},
		onUncheck : function(row) {
			onUncheck(row,type);
		},
		onCheckAll : function(rows) {
			onCheckAll(rows,type);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAll(rows2,type);
		},
		onPageChange : function() {
			drawPagination(".chooseCrouseTableArea", "课程信息");
			if(type==1){
				for (var i = 0; i < choosendCrouses.length; i++) {
					$("#chooseCrouseTable").bootstrapTable("checkBy", {field:"edu108_ID", values:[choosendCrouses[i].edu108_ID]})
				}
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			chekType,
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
function onCheck(row,type){
	if(type==1){
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
}

//单反选课程
function onUncheck(row,type){
	if(type==1){
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
}

//全选教课程
function onCheckAll(row,type){
	if(type==1){
		for (var i = 0; i < row.length; i++) {
			choosendCrouses.push(row[i]);
		}
	}
}

//全反选课程
function onUncheckAll(row,type){
	if(type==1){
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
}

//确认选择课程
function confirmChooseCrouse(type){
	var choosendCrousesIds=new Array();
	var choosendCrousesNames=new Array();
	if(type==1){
		if(choosendCrouses.length==0){
			toastr.warning('请选择课程');
			return;
		}
		for (var i = 0; i < choosendCrouses.length; i++) {
			choosendCrousesIds.push(choosendCrouses[i].edu108_ID);
			choosendCrousesNames.push(choosendCrouses[i].kcmc);
		}
		$("#export_crouse").attr("choosendCrouseIds",choosendCrousesNames);
		$("#export_crouse").val(choosendCrousesNames);
		$.hideModal("#chooseCruoseModal",false);
		$.showModal("#exportGradeModal",true);
	}else{
		var tableSelected= $("#chooseCrouseTable").bootstrapTable("getSelections");
		if(tableSelected.length==0){
			toastr.warning('请选择课程');
			return;
		}
		for (var i = 0; i < tableSelected.length; i++) {
			choosendCrousesIds.push(tableSelected[i].edu108_ID);
			choosendCrousesNames.push(tableSelected[i].kcmc);
		}
		$("#exportNoPassGrade_crouseName").attr("choosendCrouseIds",choosendCrousesNames);
		$("#exportNoPassGrade_crouseName").val(choosendCrousesNames);
		$.hideModal("#chooseCruoseModal",false);
		$.showModal("#exportNoPassGradeModal",true);
	}
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

//确认成绩导出预览
function exportGradeLook(){
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
	$.ajax({
		method : 'get',
		cache : false,
		url : "/selectGrade",
		data: {
			"queryInfo":JSON.stringify(sendObject)
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
			if (backjson.code==200) {
				$("#exportGradeModal").find(".searchArea").hide();
				$("#exportGradeModal").find(".exportGradeLookArea").show();
				$("#exportGradeModal").find('.moadalTitle').html($("#export_classes").val()+' '+getNormalSelectText("export_grade")+' '+$("#export_crouse").val()+' -成绩导出预览')
				//返回
				$('#exportGradeLookRetuen').unbind('click');
				$('#exportGradeLookRetuen').bind('click', function(e) {
					$("#exportGradeModal").find('.moadalTitle').html("班级成绩导出");
					$("#exportGradeModal").find(".searchArea").show();
					$("#exportGradeModal").find(".exportGradeLookArea").hide();
					e.stopPropagation();
				});
				stuffExportGradeLookTable(backjson.data,$("#export_crouse").val());
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//渲染成绩导出预览表
function stuffExportGradeLookTable(tableInfo,crouseName){
	$('#exportGradeLookTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: false,
		onPageChange: function() {
			drawPagination(".exportGradeLookTableArea", "成绩信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'edu001_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			}, {
				field: 'studentName',
				title: '学生姓名',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'grade',
				title: '分数',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}
		]
	});

	drawPagination(".exportGradeLookTableArea", "成绩信息");
	changeTableNoRsTip();
	drawSearchInput(".exportGradeLookTableArea");
	toolTipUp(".myTooltip");
}

//预备不及格成绩导出
function exportNoPassGrade(){
	$("#exportNoPassGrade_crouseName").val("");
	$("#exportNoPassGrade_crouseName").attr("choosendCrouseIds",'');
	$("#exportNoPassGradeModal").find(".searchArea").show();
	$("#exportNoPassGradeModal").find(".exportNoPassGradeArea").hide();

	var reObject = new Object();
	reObject.normalSelectIds = "#exportNoPassGrade_grade";
	reReloadSearchsWithSelect(reObject);

	$.showModal("#exportNoPassGradeModal",true);

	//返回
	$('.specialCanle_exportNoPass').unbind('click');
	$('.specialCanle_exportNoPass').bind('click', function(e) {
		jugementRetrun();
		e.stopPropagation();
	});
	$("#exportNoPassGradeModal").find('.moadalTitle').html("不及格成绩导出");
}

//确认不及格成绩导出
function confirmExportNoPassGrade(){
	var crouseName=$("#exportNoPassGrade_crouseName").attr("choosendCrouseIds");
	var trem=getNormalSelectValue("exportNoPassGrade_grade");
	if(trem===""){
		toastr.warning("请选择学年");
		return;
	}

	if(crouseName===""){
		toastr.warning("请选择课程");
		return;
	}

	var sendObject=new Object();
	sendObject.crouse=crouseName;
	sendObject.trem=trem;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/exportMakeUpGradeCheck",
		data: {
			"queryInfo":JSON.stringify(sendObject)
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
				var url = "/exportMakeUpGrade";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "queryInfo").attr("value",JSON.stringify(sendObject)));
				form.appendTo('body').submit().remove();
				$.hideModal("#exportNoPassGradeModal");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//确认不及格成绩导出预览
function exportNoPassGradeLook(){
	var crouseName=$("#exportNoPassGrade_crouseName").val();
	var trem=getNormalSelectValue("exportNoPassGrade_grade");
	if(trem===""){
		toastr.warning("请选择学年");
		return;
	}

	if(crouseName===""){
		toastr.warning("课程不能为空");
		return;
	}

	var sendObject=new Object();
	sendObject.crouse=crouseName;
	sendObject.trem=trem;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/selectMakeUpGradeCheck",
		data: {
			"queryInfo":JSON.stringify(sendObject)
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
			if (backjson.code == 200) {
				$("#exportNoPassGradeModal").find('.moadalTitle').html(getNormalSelectText("exportNoPassGrade_grade")+' '+crouseName+' -不及格成绩导出预览');
				$("#exportNoPassGradeLook").hide();
				$("#exportNoPassGradeModal").find(".searchArea").hide();
				$("#exportNoPassGradeModal").find(".exportNoPassGradeArea").show();
				stuffExportNoPassGradeLookTable(backjson.data,crouseName);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//不及格成绩导出返回按钮事件
function jugementRetrun(){
	var exportNoPassGradeDis=$(".exportNoPassGradeArea");
	if(exportNoPassGradeDis[0].style.display==="block"||exportNoPassGradeDis[0].style.display==="inline-block"){
		$("#exportNoPassGradeModal").find('.moadalTitle').html("不及格成绩导出");
		$("#exportNoPassGradeLook").show();
		$("#exportNoPassGradeModal").find(".searchArea").show();
		$("#exportNoPassGradeModal").find(".exportNoPassGradeArea").hide();
	}else{
		$.hideModal();
	}
}

//渲染不及格成绩导出预览表
function stuffExportNoPassGradeLookTable(tableInfo,crouseName){
	$('#exportNoPassGradeTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".exportNoPassGradeAreaTable", "成绩信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'edu001_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			},{
				field: 'xn',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: paramsMatter,
				visible: false
			},{
				field: 'className',
				title: '行政班名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'studentName',
				title: '学生姓名',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'studentCode',
				title: '学号',
				align: 'left',
				sortable: true,
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'entryDate',
				title: '录入时间',
				align: 'left',
				sortable: true,
				formatter: paramsMatter,
				visible: false
			},{
				field: 'grade',
				title: '成绩',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'exam_num',
				title: '考试状态',
				align: 'left',
				sortable: true,
				formatter: examNumMatter
			}
		]
	});

	function examNumMatter(value, row, index) {
		var str='';
		if (value==0) {
			str='正考成绩';
		} else {
			str='第'+value+'次补考';
		}

		return [ '<div class="myTooltip normalTxt" title="'+str+'">'+str+'</div>' ]
			.join('');
	}

	drawPagination(".exportNoPassGradeAreaTable", "成绩信息");
	changeColumnsStyle(".exportNoPassGradeAreaTable", "成绩信息");
	changeTableNoRsTip();
	drawSearchInput(".exportNoPassGradeAreaTable");
	toolTipUp(".myTooltip");
}


/*
*成绩录入情况
* */

//页面主题内容显示隐藏控制
function mainAreaControl(){
	$(".scheduleClassesMainArea,.gradeSituationArea").toggle();
	if($('.isFrist')[0].innerText==="T"){
		gradeSituationBtnBind();
		stuffSituationTable({});
	}
	$('.isFrist').html("F");
}

//成绩录入情况按钮事件绑定
function gradeSituationBtnBind(){
	//返回
	$('.returnMain').unbind('click');
	$('.returnMain').bind('click', function(e) {
		mainAreaControl();
		$(".placeul").find("li:last-child").remove();
		e.stopPropagation();
	});

	//成绩录入情况开始检索
	$('#startSearch_gradeSituation').unbind('click');
	$('#startSearch_gradeSituation').bind('click', function(e) {
		startSearchGradeSituation();
		e.stopPropagation();
	});

	//成绩录入情况重置检索
	$('#research_gradeSituation').unbind('click');
	$('#research_gradeSituation').bind('click', function(e) {
		researchGradeSituation();
		e.stopPropagation();
	});
}

//渲染成绩录入情况表
function stuffSituationTable(tableInfo){
	$('#gradeSituationTable').bootstrapTable('destroy').bootstrapTable({
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
		striped: true,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: getNormalSelectValue("gradeSituationGrade")+'成绩录入情况'  //文件名称
		},
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".gradeSituationTableArea", "录入记录");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'className',
				title: '行政班',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'sfsqks',
				title: '是否已结课',
				align: 'left',
				sortable: true,
				formatter: sfsqksMatter
			},{
				field: 'isConfirm',
				title: '是否确认成绩',
				align: 'left',
				sortable: true,
				formatter: isConfirmMatter
			},{
				field: 'isExamCrouse',
				title: '是否为考试课程',
				align: 'left',
				sortable: true,
				formatter: isExamMatter,
				visible: false
			}, {
				field: 'lsmc',
				title: '负责教师',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}
		]
	});

	function sfsqksMatter(value, row, index) {
		if(value==="T"){
			return [ '<div class="myTooltip greenTxt" title="已结课">已结课</div>' ]
				.join('');
		}else{
			return [ '<div class="myTooltip redTxt" title="未结课">未结课</div>' ]
				.join('');
		}
	}

	function isConfirmMatter(value, row, index) {
		if(value==="T"&&value!=null){
			return [ '<div class="myTooltip greenTxt" title="已确认">已确认</div>' ]
				.join('');
		}else{
			return [ '<div class="myTooltip redTxt" title="未确认">未确认</div>' ]
				.join('');
		}
	}

	function isExamMatter(value, row, index) {
		if(value==="T"&&value!=null){
			return [ '<div class="myTooltip" title="考试课">考试课</div>' ]
				.join('');
		}else{
			return [ '<div class="myTooltip" title="非考试课">非考试课</div>' ]
				.join('');
		}
	}

	drawPagination(".gradeSituationTableArea", "录入记录");
	changeColumnsStyle(".gradeSituationTableArea", "录入记录");
	changeTableNoRsTip();
	drawSearchInput(".gradeSituationTableArea");
	toolTipUp(".myTooltip");
}

//成绩录入情况开始检索
function startSearchGradeSituation(){
	var trem=getNormalSelectValue("gradeSituationGrade");
	var sfsqks=getNormalSelectValue("gradeSituatioIsEnd");
	var confirm=getNormalSelectValue("gradeSituationIsComfrim");

	if(trem===""){
		toastr.warning('请选择学年');
		return;
	}

	var sendObject=new Object();
	sendObject.trem=trem;
	sendObject.sfsqks=sfsqks;
	sendObject.confirm=confirm;
	searchCourseGetGrade(sendObject);
}

//成绩录入情况重置检索
function researchGradeSituation(){
	var reObject = new Object();
	reObject.normalSelectIds = "#gradeSituationGrade,#gradeSituatioIsEnd,#gradeSituationIsComfrim";
	reReloadSearchsWithSelect(reObject);
	stuffSituationTable({});
}

//检索成绩录入情况
function searchCourseGetGrade(sendObject){
	if(typeof sendObject==="undefined"){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchCourseGetGrade",
		data: {
			"searchCriteria":JSON.stringify(sendObject)
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
				stuffSituationTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				stuffSituationTable();
			}
		}
	});
}

//更改tab1 首次加载
function changTbleIsFirst(){
	if($('.tab2IsFrist')[0].innerText==="T"){
		tab2Btnbind();
		stuffSituationNotPassTable({});
	}
	$('.tab2IsFrist').html("F");
}

//不及格录入情况按钮时间绑定
function tab2Btnbind(){
	//change事件
	$("#gradeSituationGradeForNotPass").change(function() {
		if(getNormalSelectValue("gradeSituationGradeForNotPass")!==""){
			searchMakeUpCount(getNormalSelectValue("gradeSituationGradeForNotPass"));
		}else{
			stuffSituationNotPassTable({});
		}
		}
	);
}

//根据学年获取不及格情况数据
function  searchMakeUpCount(term){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchMakeUpCount",
		data: {
			"trem":term
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
				stuffSituationNotPassTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				stuffSituationNotPassTable();
			}
		}
	});
}

//渲染不及格成绩录入情况表
function stuffSituationNotPassTable(tableInfo){
	$('#gradeSituationForNotPassTable').bootstrapTable('destroy').bootstrapTable({
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
		striped: true,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: getNormalSelectValue("gradeSituationGradeForNotPass")+'不及格成绩录入情况'  //文件名称
		},
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".gradeSituationForNotPassTableArea", "录入记录");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'className',
				title: '行政班',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'lsmc',
				title: '负责教师',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'sum',
				title: '正考不及格人数',
				align: 'left',
				sortable: true,
				formatter: sumMatter
			},{
				field: 'pass',
				title: '仍不及格人数',
				align: 'left',
				sortable: true,
				formatter: passMatter
			}
		]
	});

	function sumMatter(value, row, index) {
		return [ '<div class="myTooltip" title="'+value+'人">'+value+'人</div>' ]
			.join('');
	}

	function passMatter(value, row, index) {
		var showValue=row.sum-value;
		return [ '<div class="myTooltip" title="'+showValue+'人">'+showValue+'人</div>' ]
			.join('');
	}

	drawPagination(".gradeSituationForNotPassTableArea", "录入记录");
	changeColumnsStyle(".gradeSituationForNotPassTableArea", "录入记录");
	changeTableNoRsTip();
	drawSearchInput(".gradeSituationForNotPassTableArea");
	toolTipUp(".myTooltip");
}

/*
*成绩录入情况 end
* */

//预备学生个人总体成绩导出
function exportAllGrade(){
	var reObject = new Object();
	reObject.InputIds = "#chooseStudent_className,#chooseStudent_StudentName,#chooseStudent_number";
	reReloadSearchsWithSelect(reObject);

	//初始化表格
	var oTable = new stuffStudentTable('check');
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

	//确认选择学生 总体成绩导出
	$('#confirmChoosedStudent').unbind('click');
	$('#confirmChoosedStudent').bind('click', function(e) {
		exportAllGradeConfirm();
		e.stopPropagation();
	});

	$.showModal("#chooseStudentModal",true);
}

//确认选择导出学生
function exportAllGradeConfirm(){
	if(choosendStudent.length==0){
		toastr.warning('请选择学生');
		return;
	}
	// window.open ("exportAllGrade.html?userId="+$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue);

	var choosendStudentArray=new Array();
	for (var i = 0; i < choosendStudent.length; i++) {
		choosendStudentArray.push(choosendStudent[i].edu001_ID);

	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/printStudentGradeCheck",
		data: {
			"ids":JSON.stringify(choosendStudentArray),
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
			if (backjson.code==200) {
				var exportAllGradeInfos = $.session.get('exportAllGradeInfos');
				if(exportAllGradeInfos==="undefined"||exportAllGradeInfos===undefined){
					$.session.set('exportAllGradeInfos', choosendStudentArray);
				}else{
					$.session.remove('exportAllGradeInfos');
					$.session.set('exportAllGradeInfos', choosendStudentArray);
				}

				window.open ("exportAllGrade.html?userId="+$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//初始化页面按钮绑定事件
function btnBind(){
	//重置检索
	$('#research').unbind('click');
	$('#research').bind('click', function(e) {
		research();
		e.stopPropagation();
	});

	//预备学生个人总体成绩导出
	$('#exportAllGrade').unbind('click');
	$('#exportAllGrade').bind('click', function(e) {
		exportAllGrade();
		e.stopPropagation();
	});

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
		wantChooseExportCrouse(1);
		e.stopPropagation();
	});

	//课程focus
	$('#exportNoPassGrade_crouseName').focus(function(e){
		wantChooseExportCrouse(2);
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

	//确认成绩导出预览
	$('#exportGradeLook').unbind('click');
	$('#exportGradeLook').bind('click', function(e) {
		exportGradeLook();
		e.stopPropagation();
	});

	//预备不及格成绩导出
	$('#exportNoPassGrade').unbind('click');
	$('#exportNoPassGrade').bind('click', function(e) {
		exportNoPassGrade();
		e.stopPropagation();
	});

	//确认不及格成绩导出
	$('#confirmExportNoPassGrade').unbind('click');
	$('#confirmExportNoPassGrade').bind('click', function(e) {
		confirmExportNoPassGrade();
		e.stopPropagation();
	});

	//确认不及格成绩导出预览
	$('#exportNoPassGradeLook').unbind('click');
	$('#exportNoPassGradeLook').bind('click', function(e) {
		exportNoPassGradeLook();
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//查看成绩录入情况
	$('#gradeSituation').unbind('click');
	$('#gradeSituation').bind('click', function(e) {
		mainAreaControl();
		$(".placeul").append('<li><a>成绩录入情况</a></li>');
		e.stopPropagation();
	});
}


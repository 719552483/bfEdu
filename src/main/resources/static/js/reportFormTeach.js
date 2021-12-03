var EJDMElementInfo;
$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); //初始化下拉框
	getYearInfo();
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	LinkageSelectPublic("#departmnetArea_level","#departmnetArea_department","#departmnetArea_grade","#departmnetArea_major");
	tab3BinBind();
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
	// stuffManiaSelect("#year", str);
	stuffManiaSelect("#singleStudent_year", str);
	stuffManiaSelect("#departmnetArea_year", str);
	stuffManiaSelect("#student2Data_year", str);
	stuffManiaSelect("#progress_year", str);
	stuffManiaSelect("#tab4ReportArea_year", str);
	stuffDownLoadStudentFileXnTable(yearInfo);
}

//预备选择课程
function coruseNamefocus(inputId){
	var SearchCriteria=new Object();
	SearchCriteria.kcmc=$("#"+inputId).val();

	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarySeacchClass",
		data: {
			"SearchCriteria":JSON.stringify(SearchCriteria),
			'userId':$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
				allCrouseModalBtnBind();
				allCrouseReSearch();
				$.showModal('#allCrouseModal',true);
				stuffAllCrouse(backjson.data);
				//确认
				$('#allCrouse_confirm').unbind('click');
				$('#allCrouse_confirm').bind('click', function(e) {
					var choosend=$("#chooseCrouseTable").bootstrapTable("getSelections");
					if(choosend.length<=0){
						toastr.warning('请选择课程');
						return;
					}
					$("#"+inputId).val(choosend[0].kcmc);
					$.hideModal();
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充课程表
function stuffAllCrouse(tableInfo){
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
		showColumns : false,
		onPageChange : function() {
			drawPagination(".chooseCrouseTableArea", "课程信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field : 'radio',
				radio : true
			},{
				title: '序号',
				align: 'center',
				class:'tableNumberTd',
				formatter: tableNumberMatter
			},
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
}

//课程modal事件绑定
function allCrouseModalBtnBind(){
	//开始检索
	$('#allCrouse_StartSearch').unbind('click');
	$('#allCrouse_StartSearch').bind('click', function(e) {
		allCrouseStartSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#allCrouse_ReSearch').unbind('click');
	$('#allCrouse_ReSearch').bind('click', function(e) {
		allCrouseReSearch();
		e.stopPropagation();
	});
}

//课程modal开始检索
function allCrouseStartSearch(){
	if($("#allCrouse_Name").val()===''){
		toastr.warning('请选择检索条件');
		return;
	}

	var SearchCriteria=new Object();
	SearchCriteria.kcmc=$("#allCrouse_Name").val();

	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarySeacchClass",
		data: {
			"SearchCriteria":JSON.stringify(SearchCriteria),
			'userId':$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
				stuffAllCrouse(backjson.data);
			} else {
				stuffAllCrouse({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//课程modal重置检索
function allCrouseReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#allCrouse_Name";
	reReloadSearchsWithSelect(reObject);

	var SearchCriteria=new Object();
	SearchCriteria.kcmc='';

	$.ajax({
		method : 'get',
		cache : false,
		url : "/librarySeacchClass",
		data: {
			"SearchCriteria":JSON.stringify(SearchCriteria),
			'userId':$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
				stuffAllCrouse(backjson.data);
			} else {
				stuffAllCrouse({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//行政班focus
function xzbFocus(id){
	xzbReReloadSearchs();
	getXzb();
	xzbBtnBind(id);
	$.showModal('#allClassModal',true);
	LinkageSelectPublic("#allClass_level","#allClass_department","#allClass_grade","#allClass_major");
}

//获取行政班
function getXzb(){
	var serachObject=getXzbSearchInfo();

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
	$('#allClass_administrationClassTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".administrationClassTableArea", "行政班信息");
		},
		columns: [ {
			field : 'radio',
			radio : true
		},{
			title: '序号',
			align: 'center',
			class:'tableNumberTd',
			formatter: tableNumberMatter
		},  {
			field : 'edu300_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		}, {
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
			formatter :paramsMatter,
			visible : false
		},{
			field : 'xzbbh',
			title : '行政班班号',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
			visible : false
		},
		{
			field : 'xzbdm',
			title : '行政班代码',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
			visible : false
		},{
			field : 'xzbbm',
			title : '行政班编码',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
			visible : false
		}]
	});
	drawPagination(".administrationClassTableArea", "行政班信息");
	drawSearchInput(".administrationClassTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".administrationClassTableArea", "行政班信息");
}

//获取行政班检索条件
function getXzbSearchInfo(){
	var returnObject=new Object();
	returnObject.level=getNormalSelectValue('allClass_level');
	returnObject.department=getNormalSelectValue('allClass_department');
	returnObject.grade=getNormalSelectValue('allClass_grade');
	returnObject.major=getNormalSelectValue('allClass_major');
	returnObject.className=$('#allClass_Name').val();
	return returnObject;
}

//行政班Modal重置检索
function xzbReReloadSearchs(){
	var reObject = new Object();
	reObject.fristSelectId = "#allClass_level";
	reObject.InputIds = "#allClass_Name";
	reObject.actionSelectIds = "#allClass_department,#allClass_grade,#allClass_major";
	reReloadSearchsWithSelect(reObject);
	getXzb();
}

//确认选择行政班
function allClassConfirm(id){
	var choosedClass = $("#allClass_administrationClassTable").bootstrapTable("getSelections");
	if(choosedClass.length<=0){
		toastr.warning('暂未选择行政班');
		return;
	}
	$('#'+id).val(choosedClass[0].xzbmc);
	$.hideModal();
}

//行政班modal事件绑定
function xzbBtnBind(id){
	//开始检索
	$('#allClass_StartSearch').unbind('click');
	$('#allClass_StartSearch').bind('click', function(e) {
		getXzb();
		e.stopPropagation();
	});

	//重置检索
	$('#allClass_ReSearch').unbind('click');
	$('#allClass_ReSearch').bind('click', function(e) {
		xzbReReloadSearchs();
		e.stopPropagation();
	});

	//确认选择
	$('#allClass_confirm').unbind('click');
	$('#allClass_confirm').bind('click', function(e) {
		allClassConfirm(id);
		e.stopPropagation();
	});
}


/**
 * tab2
 * */
//判断是否首次点击tab2
function judgmentIsFristTimeLoadTab2(){
	var isFirstShowTab2 = $(".isFirstShowTab2")[0].innerText;
	if (isFirstShowTab2 === "T") {
		$(".isFirstShowTab2").html("F");
		stuffEJDElement(EJDMElementInfo);
		LinkageSelectPublic("#singleStudent_level","#singleStudent_department","#singleStudent_grade","#singleStudent_major");
		stuffSingleStudentGradeTable({},'1');
		tab2BinBind();
	}
}

//渲染学生排名表
function stuffSingleStudentGradeTable(tableInfo,type){
	var columns=[];
	if(type==='1'){
		columns=[
			{
				field : 'edu201_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
			},{
				title: '序号',
				align: 'center',
				class:'tableNumberTd',
				formatter: tableNumberMatter
			},{
				field : 'studentName',
				title : '学生姓名',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
				field : 'className',
				title : '行政班名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'studentCode',
				title : '学号',
				align : 'left',
				sortable: true,
				visible : false,
				formatter : paramsMatter
			},{
				field : 'sum',
				title : '总分',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},{
				field : 'avg',
				title : '平均分',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},{
				field : '',
				title : '排名',
				align : 'left',
				sortable: true,
				formatter :pmMatter
			}
		]
	}else {
		columns=[
			{
				field : 'edu201_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
			},{
				title: '序号',
				align: 'center',
				class:'tableNumberTd',
				formatter: tableNumberMatter
			},{
				field : 'studentName',
				title : '学生姓名',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			}, {
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
				formatter : paramsMatter
			},{
				field : 'xn',
				title : '学年',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},{
				field : 'grade',
				title : '成绩',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			}
		]
	}

	$('#singleStudentGradeTable').bootstrapTable('destroy').bootstrapTable({
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
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".singleStudentGradeTableArea", "排名信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: columns
	});


	//排名格式化
	function pmMatter(value, row, index) {
		return [
			'<div class="myTooltip" title="第'+(index+1)+'名">第'+(index+1)+'名</div>'
		]
			.join('');
	}

	drawPagination(".singleStudentGradeTableArea", "排名信息");
	drawSearchInput(".singleStudentGradeTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".singleStudentGradeTableArea", "排名信息");
	toolTipUp(".myTooltip");
}

//开始检索学生排名
function singleStudentStartSearch(canNoBatch){
	var singleStudentSearchInfo=getSingleStudentSearchInfo(canNoBatch);
	if(typeof singleStudentSearchInfo==='undefined'){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchProfessionalCourseResult",
		data: {
			"SearchCriteria":JSON.stringify(singleStudentSearchInfo)
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
				stuffSingleStudentGradeTable(backjson.data,singleStudentSearchInfo.type);
			} else {
				stuffSingleStudentGradeTable({},singleStudentSearchInfo.type);
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得学生排名检索对象
function getSingleStudentSearchInfo(canNoBatch){
	var edu103=getNormalSelectValue('singleStudent_level');
	var edu103Name=getNormalSelectText('singleStudent_level');
	var edu104=getNormalSelectValue('singleStudent_department');
	var edu104Name=getNormalSelectText('singleStudent_department');
	var edu105=getNormalSelectValue('singleStudent_grade');
	var edu105Name=getNormalSelectText('singleStudent_grade');
	var edu106=getNormalSelectValue('singleStudent_major');
	var edu106Name=getNormalSelectText('singleStudent_major');
	var batch=getNormalSelectValue('singleStudent_bath');
	var batchName=getNormalSelectText('singleStudent_bath');
	var xn=getNormalSelectValue('singleStudent_year');
	var xnName=getNormalSelectText('singleStudent_year');
	var className=$('#singleStudent_className').val();
	var studentName=$('#singleStudent_studentName').val();
	var courseName=$('#singleStudent_courseName').val();

	if(edu103===''){
		toastr.warning('层次不能为空');
		return;
	}

	if(edu104===''){
		toastr.warning('二级学院不能为空');
		return;
	}

	if(edu105===''){
		toastr.warning('年级不能为空');
		return;
	}

	if(edu106===''){
		toastr.warning('专业不能为空');
		return;
	}

	if(xn===''){
		toastr.warning('学年不能为空');
		return;
	}

	if(batch===''&&!canNoBatch){
		toastr.warning('批次类型不能为空');
		return;
	}

	var searchInfo=new Object();
	searchInfo.edu103=edu103;
	searchInfo.edu104=edu104;
	searchInfo.edu105=edu105;
	searchInfo.edu106=edu106;
	searchInfo.batch=batch;
	searchInfo.edu103Name=edu103Name;
	searchInfo.edu104Name=edu104Name;
	searchInfo.edu105Name=edu105Name;
	searchInfo.edu106Name=edu106Name;
	searchInfo.batchName=batchName;

	var returnObject=new Object();
	returnObject.searchInfo=searchInfo;
	returnObject.xnid=xn;
	returnObject.xnName=xnName;
	returnObject.className=className;
	returnObject.studentName=studentName;
	courseName===''?returnObject.type='1':returnObject.type='2';
	returnObject.courseName=courseName;
	return returnObject;
}

//学生排名重置检索
function singleStudentReReloadSearchs(){
	var reObject = new Object();
	reObject.fristSelectId = "#singleStudent_level";
	reObject.actionSelectIds = "#singleStudent_department,#singleStudent_grade,#singleStudent_major";
	reObject.normalSelectIds = "#singleStudent_year,#singleStudent_bath";
	reObject.InputIds = "#singleStudent_className,#singleStudent_studentName,#singleStudent_courseName";
	reReloadSearchsWithSelect(reObject);
	stuffSingleStudentGradeTable({});
}

//预备学生个人成绩排名导出
function exportGradeSingleStudent(){
	var singleStudentSearchInfo=getSingleStudentSearchInfo(false);
	if(typeof singleStudentSearchInfo==='undefined'){
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html(singleStudentSearchInfo.searchInfo.edu103Name+'/'+
		singleStudentSearchInfo.searchInfo.edu104Name+'/'+
		singleStudentSearchInfo.searchInfo.edu105Name+'/'+
		singleStudentSearchInfo.searchInfo.edu106Name+'/'+
		singleStudentSearchInfo.searchInfo.batchName+'/'+
		singleStudentSearchInfo.xnName
	);
	$(".remindActionType").html("学生个人成绩排名的导出");
	//确认新增关系按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		checkExportGradeSingleStudent(singleStudentSearchInfo);
		e.stopPropagation();
	});
}

//验证学生个人成绩排名导出条件
function checkExportGradeSingleStudent(singleStudentSearchInfo){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/exportProfessionalCourseResultCheck",
		data: {
			"SearchCriteria":JSON.stringify(singleStudentSearchInfo)
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
				confrimkExportGradeSingleStudent(singleStudentSearchInfo);
				$.hideModal();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//确认学生个人成绩排名导出
function confrimkExportGradeSingleStudent(singleStudentSearchInfo){
	var url ="/exportProfessionalCourseResult";
	var form = $("<form></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "SearchCriteria").attr("value",JSON.stringify(singleStudentSearchInfo)));
	form.appendTo('body').submit().remove();
}

//tab2页面按钮事件绑定
function tab2BinBind(){
	//开始检索
	$('#singleStudent_startSearch').unbind('click');
	$('#singleStudent_startSearch').bind('click', function(e) {
		singleStudentStartSearch(true);
		e.stopPropagation();
	});

	//重置检索
	$('#singleStudent_reReloadSearchs').unbind('click');
	$('#singleStudent_reReloadSearchs').bind('click', function(e) {
		singleStudentReReloadSearchs();
		e.stopPropagation();
	});

	//学生个人成绩排名导出
	$('#exportGrade_singleStudent').unbind('click');
	$('#exportGrade_singleStudent').bind('click', function(e) {
		exportGradeSingleStudent();
		e.stopPropagation();
	});

	// $("#singleStudent_year").change(function() {
	// 	singleStudentStartSearch();
	// });

	//行政班focus
	$('#singleStudent_className').focus(function(e){
		xzbFocus("singleStudent_className");
		e.stopPropagation();
	});

	//课程focus
	$('#singleStudent_courseName').focus(function(e){
		coruseNamefocus("singleStudent_courseName");
		e.stopPropagation();
	});
}
/**
 * tab2 end
 * */



/**
 * tab3
 * */
//学院及格率开始检索
function departmnetAreaStartSearch(){
	var departmnetAreaSearchInfo=getDepartmnetAreaSearchInfo();
	if(typeof departmnetAreaSearchInfo==='undefined'){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchProfessionalByXY",
		data: {
			"SearchCriteria":JSON.stringify(departmnetAreaSearchInfo)
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
				$('.departmentConfigArea').hide();

				if(departmnetAreaSearchInfo.show==1){
					stuffTab3Table(backjson.data);
					$('.departmentTableArea').show();
					$('.departmentChartArea').hide();
				}else{
					$('.departmentChartArea').show().empty();
					$('.departmentTableArea').hide();
					drawChart(backjson.data);
					chartListener();
				}
			} else {
				toastr.warning(backjson.msg);
				$('.departmentConfigArea').show();
				$('.departmentChartArea').hide();
				$('.departmentTableArea').hide();
			}
		}
	});
}

//填充  tab3 table
function stuffTab3Table(tableInfo){
	$('#tab3Table').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo.data,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: tableInfo.text+'导出'  //文件名称
		},
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onPageChange : function() {
			drawPagination(".departmentTableArea", "及格率信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns:[
			[
				{
					title: tableInfo.text,
					colspan: 2
				}
			],
			[
				{
					field : 'name',
					title : '二级学院名称',
					align : 'center',
					sortable: true,
					formatter :paramsMatter
				},
				{
					field : 'passingRate',
					title : '及格率',
					align : 'center',
					sortable: true,
					formatter :passingRateMatter
				}
			]
		]
	});

	function passingRateMatter(value, row, index) {
		return [ '<div class="myTooltip normalTxt" title="'+value+'%">'+value+'%</div>' ]
			.join('');
	}

	drawPagination(".departmentTableArea", "及格率信息");
	drawSearchInput(".departmentTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".departmentTableArea", "及格率信息");
}

//填充  chart
function drawChart(data) {
	$('.departmentChartArea').append('<div class="departmentChart col1" id="drawChart0"></div>');

	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById("drawChart0"));

	var option = {
		toolbox: {
			show: true,
			right:100,
			feature: {
				saveAsImage: {
					show:true,
					excludeComponents :['toolbox'],
					pixelRatio: 2
				}
			}
		},
		title: {
			text:data.text,
			textStyle: {
				color: 'rgba(94, 173, 197, 0.81)',
				fontSize: '20'
			},
			padding: [5, 10],
			left: 'center'
		},
		animationEasing: 'elasticOut',
		tooltip: {
			trigger: 'axis'
		},
		dataZoom : [
			{
				show: true,//是否显示滑动条
				type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
				startValue: 0, // 从头开始。
				endValue: 5, // 一次性展示6个。
				height: 20,//这里可以设置dataZoom的尺寸
			}
		],
		tooltip: {
			formatter: function (params) {
				return params.name + '<br/>' + '及格率:' +params.data + '%' ;
			}},
		color: 'rgba(22,178,209,0.66)',
		grid: {
			left: '10%',
			right: '10%',
			bottom: '15%',
			top: '20%',
			containLabel: true
		},
		xAxis: {
			type: 'category',
			// name: '学院名称',// 给x轴加单位
			data: data.xbmc,
			axisLabel: {
				show: false
				}
		},
		yAxis: {
			type: 'value',
			splitLine: {show: false},
			name: '及格率百分比(%)',// 给y轴加单位
			max:100,
			min:0,
			interval:10 //每次增加几个
		},
		series: [{
			data: data.passingRate,
			type: 'bar',
			itemStyle: {
				normal: {
					label: {
						formatter: "{b}"+ "\n\n" +"{c}"+"%",
						show: true, //开启显示
						position: 'top', //在上方显示
						textStyle: { //数值样式
							color: 'rgba(82,171,212,0.81)',
							fontSize: 12
						}
					}
				}
			},
		}]
	};

	// 使用刚指定的配置项和数据显示图表
	myChart.setOption(option);
}

//获得学院及格率区域检索条件
function getDepartmnetAreaSearchInfo(){
	var edu103Id=getNormalSelectValue('departmnetArea_level');
	var xnid=getNormalSelectValue('departmnetArea_year');
	var edu104Id=getNormalSelectValue('departmnetArea_department');
	var edu105Id=getNormalSelectValue('departmnetArea_grade');
	var edu106Id=getNormalSelectValue('departmnetArea_major');
	var batch=getNormalSelectValue('departmnetArea_bath');
	var courseName=$('#departmnetArea_crouseName').val();
	var edu103IdName=getNormalSelectText('departmnetArea_level');
	var xnName=getNormalSelectText('departmnetArea_year');
	var edu104IdName=getNormalSelectText('departmnetArea_department');
	var edu105IdName=getNormalSelectText('departmnetArea_grade');
	var edu106IdName=getNormalSelectText('departmnetArea_major');
	var batchName=getNormalSelectText('departmnetArea_bath');
	var showType=getNormalSelectValue('singleStudent_showType');

	if(edu103Id===''){
		toastr.warning('层次不能为空');
		return;
	}

	if(xnid===''){
		toastr.warning('学年不能为空');
		return;
	}

	if(batch!==''&&(edu104Id===''||edu105Id===''||edu106Id==='')){
		toastr.warning('请补全批次之前的检索条件');
		return;
	}

	var returnObject=new Object();
	returnObject.edu103Id=edu103Id;
	returnObject.edu104Id=edu104Id;
	returnObject.edu105Id=edu105Id;
	returnObject.edu106Id=edu106Id;
	returnObject.batch=batch;
	returnObject.courseName=courseName;
	returnObject.xnid=xnid;
	returnObject.edu103IdName=edu103IdName;
	returnObject.edu104IdName=edu104IdName;
	returnObject.edu105IdName=edu105IdName;
	returnObject.edu106IdName=edu106IdName;
	returnObject.batchName=batchName;
	returnObject.xnName=xnName;
	showType===''||showType==='1'?returnObject.show=1:returnObject.show==2;

	return returnObject;
}

// chart自适应
function chartListener(){
	// chart自适应
	window.addEventListener("resize", function() {
		var all=$('.departmentChartArea').find('.col1');
		for (var i = 0; i < all.length; i++) {
			var myChart = echarts.init(document.getElementById(all[i].id));
			myChart.resize();
		}
	});
}

//重置检索
function departmnetAreaReReloadSearchs(){
	var reObject = new Object();
	reObject.fristSelectId = "#departmnetArea_level";
	reObject.actionSelectIds = "#departmnetArea_department,#departmnetArea_grade,#departmnetArea_major";
	reObject.normalSelectIds = "#departmnetArea_year,#departmnetArea_bath,#singleStudent_showType";
	reObject.InputIds = "#departmnetArea_crouseName";
	reReloadSearchsWithSelect(reObject);
	$('.departmentConfigArea').show();
	$('.departmentChartArea').hide();
	$('.departmentTableArea').hide();
}

//tab3页面按钮事件绑定
function tab3BinBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//开始检索
	$('#departmnetArea_startSearch').unbind('click');
	$('#departmnetArea_startSearch').bind('click', function(e) {
		departmnetAreaStartSearch();
		e.stopPropagation();
	});

	//课程focus
	$('#departmnetArea_crouseName').focus(function(e){
		coruseNamefocus("departmnetArea_crouseName");
		e.stopPropagation();
	});

	//重置检索
	$('#departmnetArea_reReloadSearchs').unbind('click');
	$('#departmnetArea_reReloadSearchs').bind('click', function(e) {
		departmnetAreaReReloadSearchs();
		e.stopPropagation();
	});

	//type change事件
	$("#singleStudent_showType").change(function() {
		departmnetAreaStartSearch();
	});
}

/**
 * tab3 end
 * */

/**
 * tab4
 * */
//判断是否首次点击Tba4
function judgmentIsFristTimeLoadTab4(){
	var isFirstShowTab4 = $(".isFirstShowTab4")[0].innerText;
	if (isFirstShowTab4 === "T") {
		$(".isFirstShowTab4").html("F");
		stuffEJDElement(EJDMElementInfo);
		LinkageSelectPublic("#student2Data_level","#student2Data_department","#student2Data_grade","#student2Data_major");
		tab4BinBind();
		stuffTab4Table({},getNormalSelectValue('student2Data_type'));
	}
}

//填充tab4 Table
function stuffTab4Table(tableInfo,type){
    window.releaseNewsEvents = {
        'click #graduateDeatils': function(e, value, row, index) {
            graduateDeatils(row);
        }
    };

	var columnses=[];
	if(type==='1'||type===''){
		columnses=[ {
			field : 'edu001_ID',
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
			field :'xm',
			title : '姓名',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field : 'pyccmc',
			title : '培养层次',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'szxbmc',
			title : '二级学院',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		}, {
			field : 'njmc',
			title : '年级',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field :'zymc',
			title : '专业',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field :'batchName',
			title : '批次',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field :'xzbname',
			title : '行政班',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field :'own',
			title : '课程总数',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field :'pass',
			title : '通过课程数',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		},{
			field :'rate',
			title : '及格率',
			align : 'left',
			sortable: true,
			formatter : rateMatter
		}];
	}else{
		columnses=[ {
			field : 'edu300_ID',
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
            field : 'pyccmc',
            title : '培养层次',
            align : 'left',
            sortable: true,
            formatter :paramsMatter
        },{
            field : 'xbmc',
            title : '二级学院',
            align : 'left',
            sortable: true,
            formatter :paramsMatter
        }, {
            field : 'njmc',
            title : '年级',
            align : 'left',
            sortable: true,
            formatter :paramsMatter
        },{
            field :'zymc',
            title : '专业',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'batchName',
            title : '批次',
            align : 'left',
            sortable: true,
            formatter : paramsMatter

        },{
            field :'xzbmc',
            title : '行政班',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'own',
            title : '学生总人数',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'pass',
            title : '预计毕业学生数量',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'rate',
            title : '毕业率',
            align : 'left',
            sortable: true,
            formatter : rateMatter
        },{
            field: 'action',
            title: '操作',
            align: 'center',
            clickToSelect: false,
            formatter: releaseNewsFormatter,
            events: releaseNewsEvents
        }];
	}

	$('#tab4Table').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: type==='1'||type===''?'及格率导出':'毕业率导出' //文件名称
		},
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
        uniqueId: type ==='1'?'edu001_ID':'edu300_ID',
		onPageChange : function() {
			drawPagination(".tab4TableArea", "数据");
		},
		columns: columnses
	});

    function releaseNewsFormatter(value, row, index) {
        return [
            '<ul class="toolbar tabletoolbar">' +
            '<li class="queryBtn" id="graduateDeatils"><span><img src="img/info.png" style="width:24px"></span>详情</li>'+
            '</ul>'
        ]
            .join('');
    }

	function rateMatter(value, row, index) {
    	var colorClass='';
		parseInt(value)>=60?colorClass='greenTxt':colorClass='redTxt';

		return [ '<div class="myTooltip '+colorClass+'" title="value">'+value+'</div>' ]
			.join('');
	}

	drawPagination(".tab4TableArea", "数据");
	drawSearchInput(".tab4TableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".tab4TableArea", "数据");
}

//毕业率详情按钮事件
function graduateDeatils(row){
    var tab4SearchInfo = new Object();
    var classObJECT=new Object();
    classObJECT.pyccbm=row.pyccbm;
    classObJECT.xzbname=row.xzbmc;
    tab4SearchInfo.classInfo = classObJECT;
    tab4SearchInfo.type='1';
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchGraduationRate",
        data: {
            "SearchCriteria":JSON.stringify(tab4SearchInfo)
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
                $.showModal('#graduateDeatilsModal',true);
                $('#graduateDeatilsModal').find('.moadalTitle').html(row.xzbmc+'毕业率详情');
                stuffGraduateDeatilsTable(backjson.data);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充毕业率详情 Table
function stuffGraduateDeatilsTable(tableInfo){
	window.releaseNewsEvents = {
		'click #graduateDeatils_Info': function(e, value, row, index) {
			graduateDeatilsInfo(row);
		}
	};
    $('#graduateDeatilsTable').bootstrapTable('destroy').bootstrapTable({
        data : tableInfo,
        pagination : true,
        pageNumber : 1,
        pageSize : 5,
        pageList : [ 5 ],
        showToggle : false,
        showFooter : false,
        clickToSelect : true,
        search : true,
        editable : false,
        striped : true,
        toolbar : '#toolbar',
        showColumns : true,
        onPageChange : function() {
            drawPagination(".graduateDeatilsTableArea", "详情信息");
        },
        columns: [{
            field : 'edu001_ID',
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
            field :'xm',
            title : '姓名',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'own',
            title : '课程总数',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'pass',
            title : '通过课程数',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
            field :'rate',
            title : '及格率',
            align : 'left',
            sortable: true,
            formatter : paramsMatter
        },{
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : releaseNewsFormatter,
			events : releaseNewsEvents,
		}]
    });

	function releaseNewsFormatter(value, row, index) {
		return [
			'<ul class="toolbar tabletoolbar">' +
			'<li class="queryBtn" id="graduateDeatils_Info"><span><img src="img/info.png" style="width:24px"></span>课程详情</li>'+
			'</ul>'
		]
			.join('');
	}

    drawPagination(".graduateDeatilsTableArea", "详情信息");
    drawSearchInput(".graduateDeatilsTableArea");
    changeTableNoRsTip();
    toolTipUp(".myTooltip");
    changeColumnsStyle(".graduateDeatilsTableArea", "详情信息");
}

//成绩详情
function graduateDeatilsInfo(row){
	var SearchCriteriaOBJECT = new Object();
	SearchCriteriaOBJECT.grade = '';
	SearchCriteriaOBJECT.courseName = '';

	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentGetGrades",
		data: {
			"userKey":row.edu001_ID,
			"SearchCriteria":JSON.stringify(SearchCriteriaOBJECT)
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
				$.showModal('#studentGraduateInfoModal',true);
				$.hideModal('#graduateDeatilsModal',false);
				drwaGradeInfo(backjson.data,row);

				$('.specialCanle').unbind('click');
				$('.specialCanle').bind('click', function(e) {
					$.showModal('#graduateDeatilsModal',true);
					$.hideModal('#studentGraduateInfoModal',false);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染学生成绩详情
function drwaGradeInfo(gradeInfo,row){
	$("#studentGraduateInfoModal").find(".moadalTitle").html(row.xm+"成绩详情");
	$(".historyInfo").empty();
	var historyTxt="";
	for (var i = 0; i < gradeInfo.length; i++) {
		var currentHistory= gradeInfo[i];
		var passTxt='';
		var colorClass='';
		currentHistory.isPassed==="T"?passTxt="通过":passTxt="未通过";
		currentHistory.isPassed==="T"?colorClass="greenTxt":colorClass="redTxt";

		historyTxt+='<div class="historyArea"><div>' +
			'<span><cite>课程名称：</cite><b>'+nullMatter(currentHistory.courseName)+'</b></span>'+
			'<span><cite>成绩：</cite><b>'+nullMatter(currentHistory.grade)+'</b></span>'+
			'<span><cite>是否通过：</cite><b class="'+colorClass+'">'+passTxt+'</b></span>'+
			'</div></div>' ;
	}
	$(".historyInfo").append(historyTxt);
}

//类型下拉框change事件
function student2DataByNumChange(){
	var type=getNormalSelectValue('student2Data_type');

	if(type==='1'||type===''){
		$('.student2Data_byNumArea').hide();
		$('#tab4').find('.myformtextTipArea').hide();
		$('.student2DataStudentNameArea').show();
        $('#student2Data_studentName').attr("disabled", false);
        $('#student2Data_studentName').attr("placeholder", '请输入学生姓名...');
	}else{
		$('.student2Data_byNumArea').show();
		$('#tab4').find('.myformtextTipArea').show();
        $('#student2Data_studentName').val('');
        $('#student2Data_studentName').attr("disabled", true);
        $('#student2Data_studentName').attr("placeholder", '暂不可输入...');
	}
	$('#student2Data_byNum').val('');

}

//tab4开始检索
function student2DataStartSearch(){
	var tab4SearchInfo=getTab4SearchInfo();
	if(typeof tab4SearchInfo==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchGraduationRate",
		data: {
			"SearchCriteria":JSON.stringify(tab4SearchInfo)
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
				stuffTab4Table(backjson.data,getNormalSelectValue('student2Data_type'));
			} else {
				stuffTab4Table({},getNormalSelectValue('student2Data_type'));
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得Tab4的检索对象
function getTab4SearchInfo(){
	var edu103Id=getNormalSelectValue('student2Data_level');
	var edu104Id=getNormalSelectValue('student2Data_department');
	var edu105Id=getNormalSelectValue('student2Data_grade');
	var edu106Id=getNormalSelectValue('student2Data_major');
	var xnid=getNormalSelectValue('student2Data_year');
	var batch=getNormalSelectValue('student2Data_bath');
	var className=$('#student2Data_className').val();
	var studentName=$('#student2Data_studentName').val();
	var type=getNormalSelectValue('student2Data_type');
	var byNum=$('#student2Data_byNum').val();
	var edu103IdName=getNormalSelectText('student2Data_level');
	var edu104IdName=getNormalSelectText('student2Data_department');
	var edu105IdName=getNormalSelectText('student2Data_grade');
	var edu106IdName=getNormalSelectText('student2Data_major');
	var xnidName=getNormalSelectText('student2Data_year');
	var batchName=getNormalSelectText('student2Data_bath');

	if(edu103Id===''){
		toastr.warning('层次不能为空');
		return;
	}

	if(type===''){
		toastr.warning('查询类型不能为空');
		return;
	}

	if(byNum!==''&&isNaN(byNum)){
		toastr.warning('宽容基数必须是数字');
		return;
	}

	var classObJECT=new Object();
	classObJECT.pyccbm=edu103Id;
	classObJECT.zybm=edu106Id;
	classObJECT.batch=batch;
	classObJECT.xnid=xnid;
	classObJECT.pyccmc=edu103IdName;
	classObJECT.xbmc=edu104IdName;
	classObJECT.edu105IdName=edu105IdName;
	classObJECT.zymc=edu106IdName;
	classObJECT.xnidName=xnidName;
	classObJECT.batchName=batchName;
	if(type==='2'){
		classObJECT.njbm=edu105Id;
		classObJECT.xbbm=edu104Id;
		classObJECT.xzbmc=className;
	}else{
		classObJECT.nj=edu105Id;
		classObJECT.szxb=edu104Id;
		classObJECT.xzbname=className;
		classObJECT.xm=studentName;
	}

	var returnObject=new Object();
	returnObject.type=type;
	returnObject.num=byNum===''?0:byNum;
	returnObject.classInfo=classObJECT;

	return returnObject;
}

//tab4重置检索
function student2DataReReloadSearchs(){
	var reObject = new Object();
	reObject.fristSelectId = "#student2Data_level";
	reObject.actionSelectIds = "#student2Data_department,#student2Data_grade,#student2Data_major";
	reObject.normalSelectIds = "#student2Data_year,#student2Data_bath,#student2Data_type";
	reObject.InputIds = "#student2Data_className,#student2Data_studentName,#student2Data_byNum";
	reReloadSearchsWithSelect(reObject);
	stuffTab4Table({},getNormalSelectValue('student2Data_type'));
	$('.student2Data_byNumArea').hide();
	$('#tab4').find('.myformtextTipArea').hide();
    $('#student2Data_studentName').attr("disabled", false);
    $('#student2Data_studentName').attr("placeholder", '请输入学生姓名...');
}

//下载学生学年及格率报表数据
function downLoadStudentFile(){
	var unCheckArray=new Array();
	for (var i = 0; i <choosendXn.length; i++) {
		unCheckArray.push(choosendXn[i].edu400_ID);
	}

	$("#downLoadStudentFileXnTable").bootstrapTable("uncheckBy", {field:"edu400_ID", values:unCheckArray});
	$.showModal('#downLoadStudentFileModal',true);
	choosendXn=new Array();
}

var choosendXn=new Array();
//下载学生学年及格率报表数据Modal 填充学年表
function stuffDownLoadStudentFileXnTable(tableInfo){
	choosendXn=new Array();

	$('#downLoadStudentFileXnTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		showExport: false,      //是否显示导出
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onCheck : function(row) {
			onCheckXnManger(row);
		},
		onUncheck : function(row) {
			onUncheckXnManger(row);
		},
		onCheckAll : function(rows) {
			onCheckAllXnManger(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllXnManger(rows2);
		},
		onPageChange : function() {
			drawPagination(".downLoadStudentFileXnTableArea", "学年信息");
			for (var i = 0; i < choosendXn.length; i++) {
				$("#downLoadStudentFileXnTable").bootstrapTable("checkBy", {field:"edu400_ID", values:[choosendXn[i].edu400_ID]})
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns : [ {
			field : 'edu400_ID',
			title: '唯一标识',
			align : 'left',
			sortable: true,
			visible : false
		},{
			field: 'check',
			align : 'center',
			checkbox: true
		},{
			title: '序号',
			align: 'center',
			class:'tableNumberTd',
			formatter: tableNumberMatter
		}, {
			field : 'xnmc',
			title : '学年',
			align : 'center',
			sortable: true,
			formatter :paramsMatter
		} ]
	});

	drawPagination(".downLoadStudentFileXnTableArea", "学年信息");
	drawSearchInput(".downLoadStudentFileXnTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".downLoadStudentFileXnTableArea", "学年信息");
}

//单选
function onCheckXnManger(row){
	if(choosendXn.length<=0){
		choosendXn.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendXn.length; i++) {
			if(choosendXn[i].edu400_ID===row.edu400_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendXn.push(row);
		}
	}
}

//单反选
function onUncheckXnManger(row){
	if(choosendXn.length<=1){
		choosendXn.length=0;
	}else{
		for (var i = 0; i < choosendXn.length; i++) {
			if(choosendXn[i].edu400_ID===row.edu400_ID){
				choosendXn.splice(i,1);
			}
		}
	}
}

//全选
function onCheckAllXnManger(row){
	for (var i = 0; i < row.length; i++) {
		choosendXn.push(row[i]);
	}
}

//全反选
function onUncheckAllXnManger(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu400_ID);
	}


	for (var i = 0; i < choosendXn.length; i++) {
		if(a.indexOf(choosendXn[i].edu400_ID)!==-1){
			choosendXn.splice(i,1);
			i--;
		}
	}
}

//确认下载学生学年及格率报表数据
function confirmStudentFileDownLoad(){
	var xn=choosendXn;
	if(xn.length<=0){
		toastr.warning('请选择学年');
		return;
	}
	var xns=new Array();
	for (var i = 0; i < choosendXn.length; i++) {
		xns.push(choosendXn[i].edu400_ID);
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/exportStudentPassReportCheck",
		data: {
			"SearchCriteria":JSON.stringify(xns)
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
				var url = "/exportStudentPassReport";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "SearchCriteria").attr("value",JSON.stringify(xns)));
				form.appendTo('body').submit().remove();
				toastr.info('文件下载中，请稍候...');
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//及格率报表数据展示
function showStudentFile(){
	$('.tab4ReportArea').show();
	$('.tab4MainArea').hide();
	studentFileAreaBtnBind();
	var a=[{'xnmc':'45455'}];
	stuffTab4ReportTable(a);
}

//及格率报表数据开始检索
function tab4ReportAreaStartSearch(){

}

//获取及格率报表数据
function getTab4ReportInfo(){
	stuffTab4ReportTable();
}

//填充及格率报表
function stuffTab4ReportTable(tableInfo){
	$('#tab4ReportAreaTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		// exportDataType: "all",
		// showExport: true,      //是否显示导出
		// exportOptions:{
		// 	fileName: '辽宁职业学院XX学院学生及格率统计表'  //文件名称
		// },
		onPageChange : function() {
			drawPagination(".tab4ReportArea", "授课信息数据");
		},
		columns:[
			[
				{
					title: "辽宁职业学院XX学院学生及格率统计表",
					colspan: 10
				}
			],
			[
				{
					field: 'xnmc',
					title: "年级",
					valign:"middle",
					align:"center",
					sortable: true,
					formatter: paramsMatter,
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'zxs',
					title: "批次",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					title: "专业",
					valign:"middle",
					formatter: paramsMatter,
					align:"center",
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'zxs',
					title: "人数",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},{
					field: 'zxs',
					title: "2019-2020学年",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 3,
					rowspan: 1
				},
				{
					field: 'zxs',
					title: "总体及格率(%)",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'zxs',
					title: "预计毕业率(%)",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'zxs',
					title: "实际毕业率(%)",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				}
			],
			[
				{
					field: 'zrjs',
					title: '本学年课程总数',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				},
				{
					field: 'jzjs',
					title: '及格率(%)',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				},
				{
					field: 'wpjs',
					title: '学年专业学生不及格情况统计占比(%)',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				}
			]
		]
	});

	drawPagination(".tab4ReportArea", "授课信息数据");
	drawSearchInput(".tab4ReportArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//及格率报表数据展示 按钮事件绑定
function studentFileAreaBtnBind(){
	//返回
	$('#returnTab4MainArea').unbind('click');
	$('#returnTab4MainArea').bind('click', function(e) {
		$('.tab4ReportArea').hide();
		$('.tab4MainArea').show();
		e.stopPropagation();
	});

	//开始检索
	$('#tab4ReportArea_startSearch').unbind('click');
	$('#tab4ReportArea_startSearch').bind('click', function(e) {
		tab4ReportAreaStartSearch();
		e.stopPropagation();
	});
}

//tab4页面按钮事件绑定
function tab4BinBind(){
	//类型change事件
	$("#student2Data_type").change(function() {
		student2DataByNumChange();
	});

	//开始检索
	$('#student2Data_startSearch').unbind('click');
	$('#student2Data_startSearch').bind('click', function(e) {
		student2DataStartSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#student2Data_reReloadSearchs').unbind('click');
	$('#student2Data_reReloadSearchs').bind('click', function(e) {
		student2DataReReloadSearchs();
		e.stopPropagation();
	});

	//下载学生学年及格率报表数据
	$('#downLoadStudentFile').unbind('click');
	$('#downLoadStudentFile').bind('click', function(e) {
		downLoadStudentFile();
		e.stopPropagation();
	});

	//确认下载学生学年及格率报表数据
	$('#confirmStudentFileDownLoad').unbind('click');
	$('#confirmStudentFileDownLoad').bind('click', function(e) {
		confirmStudentFileDownLoad();
		e.stopPropagation();
	});

	//行政班focus
	$('#student2Data_className').focus(function(e){
		xzbFocus("student2Data_className");
		e.stopPropagation();
	});

	//及格率报表数据展示
	$('#showStudentFile').unbind('click');
	$('#showStudentFile').bind('click', function(e) {
		showStudentFile();
		e.stopPropagation();
	});
}
/**
 * tab4 end
 * */


/**
 * tab5 start
 * */
function judgmentIsFristTimeLoadTab5(){
	var isFirstShowTab5 = $(".isFirstShowTab5")[0].innerText;
	if (isFirstShowTab5 === "T") {
		$(".isFirstShowTab5").html("F");
		// getTab5TableInfo(1);
		drawAllTable({});
		tab5BtnBind();
	}
}

//获取tab5的数据
function getTab5TableInfo(type){
	var searchInfo=getTab5SearchInfo(true);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/teachInfoReportData",
		data: {
			"SearchCriteria":JSON.stringify(searchInfo)
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
				stuffTab5Table(backjson.data,type);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充tab5的表格
function stuffTab5Table(tableInfo,stuffType){
	if(stuffType==1){
		drawAllTable(tableInfo);
	}else{
		drawDepartmentTable(tableInfo);
	}
}

//渲染全院表格
function drawAllTable(tableInfo){
	var searchInfo=getTab5SearchInfo(true);
	var stuffTitle='';
	searchInfo.xnmc===''?stuffTitle='全学年':stuffTitle=searchInfo.xnmc;

	$('#tab5Table').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".tab5TableArea", "授课进度信息");
		},
		columns:[
			[
				{
					title: "辽宁职业学院高职扩招"+stuffTitle+"授课进度信息统计表",
					colspan: 8
				}
			],
			[
				{
					field: 'xnmc',
					title: "学年",
					valign:"middle",
					align:"center",
					sortable: true,
					formatter: paramsMatter,
					colspan: 1,
					rowspan: 2
				},
				{
					title: "授课教师数",
					valign:"middle",
					formatter: peopleNumMatter,
					align:"center",
					colspan: 3,
					rowspan: 1
				},
				{
					field: 'skms',
					title: "学年授课课程门数",
					formatter: kcMSNumMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'zxs',
					title: "学年总学时数",
					formatter: xsNumMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'jhxs',
					title: "计划学时数",
					formatter: xsNumMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					field: 'sjskxs',
					title: "实际授课学时数",
					formatter: sjskxsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				}
			],
			[
				{
					field: 'zrjs',
					title: '专任教师',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				},
				{
					field: 'jzjs',
					title: '兼职教师',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				},
				{
					field: 'wpjs',
					title: '外聘教师',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				}
			]
		]
	});

	drawPagination(".tab5TableArea", "授课进度信息");
	drawSearchInput(".tab5TableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//渲染分选表格
function drawDepartmentTable(tableInfo){
	var searchInfo=getTab5SearchInfo(true);
	$('#tab5Table').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".tab5TableArea", "授课进度信息");
		},
		columns:[
			[
				{
					title: "辽宁职业学院高职扩招"+searchInfo.xbmc+searchInfo.xnmc+"授课进度信息统计表",
					colspan: 9
				}
			],
			[
				{
					field: 'zymc',
					title: "专业",
					valign:"middle",
					formatter: paramsMatter,
					align:"center",
					colspan: 1,
					sortable: true,
					rowspan: 2
				},
				{
					field: 'xnmc',
					title: "学年",
					formatter: paramsMatter,
					valign:"middle",
					align:"center",
					sortable: true,
					colspan: 1,
					rowspan: 2
				},
				{
					title: "授课教师数",
					valign:"middle",
					align:"center",
					formatter: peopleNumMatter,
					colspan: 3,
					rowspan: 1
				},
				{
					field: 'skms',
					title: "学年授课课程门数",
					formatter: kcMSNumMatter,
					valign:"middle",
					align:"center",
					colspan: 1,
					sortable: true,
					rowspan: 2
				},
				{
					field: 'zxs',
					title: "学年总学时数",
					valign:"middle",
					formatter: xsNumMatter,
					align:"center",
					colspan: 1,
					sortable: true,
					rowspan: 2
				},
				{
					field: 'jhxs',
					title: "计划学时数",
					valign:"middle",
					formatter: xsNumMatter,
					align:"center",
					colspan: 1,
					sortable: true,
					rowspan: 2
				},
				{
					field: 'sjskxs',
					title: "实际授课学时数",
					valign:"middle",
					formatter: sjskxsMatter,
					align:"center",
					colspan: 1,
					sortable: true,
					rowspan: 2
				}
			],
			[
				{
					field: 'zrjs',
					title: '专任教师',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				},
				{
					field: 'jzjs',
					title: '兼职教师',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				},
				{
					field: 'wpjs',
					title: '外聘教师',
					valign:"middle",
					sortable: true,
					formatter: peopleNumMatter,
					align:"center"
				}
			]
		]
	});

	drawPagination(".tab5TableArea", "授课进度信息");
	drawSearchInput(".tab5TableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//获取tab5的检索对象
function getTab5SearchInfo(canEmpty){
	var xn=getNormalSelectValue('progress_year');
	var xb=getNormalSelectValue('progress_department');

	var xnmc=getNormalSelectText('progress_year');
	var xbmc=getNormalSelectText('progress_department');
	if((xn===''&&xb==='')&&!canEmpty){
		toastr.warning('检索条件不能为空');
		return;
	}

	var returnObject=new Object();
	returnObject.xn=xn;
	returnObject.xb=xb;
	returnObject.xnmc=xnmc;
	returnObject.xbmc=xbmc;
	return returnObject;
}

//开始检索
function startSearchTab5(){
	var tab5SearchInfo=getTab5SearchInfo(true);
	// if(typeof tab5SearchInfo==='undefined'){
	// 	return;
	// }
	var type=0;
	if(tab5SearchInfo.xb!==''){
		type=2;
	}else{
		type=1;
	}
	getTab5TableInfo(type);
}

//重置检索
function reReloadSearchsTab5(){
	var reObject = new Object();
	reObject.normalSelectIds = "#progress_year,#progress_department";
	reReloadSearchsWithSelect(reObject);
	getTab5TableInfo(1);
}

//全院授课信息报表数据
function allInfoDownLoad(){
	var searchInfo=getTab5SearchInfo(true);
	var url = "/teachingInfoReport";
	var form = $("<form></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "SearchCriteria").attr("value",JSON.stringify(searchInfo)));
	form.appendTo('body').submit().remove();
	toastr.info('文件下载中，请稍候...');
}

//分院授课报表数据
function someInfoDownLoad(){
	var searchInfo=getTab5SearchInfo(false);
	if(typeof searchInfo==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/teachingInfoCollegeReportCheck",
		data: {
			"SearchCriteria":JSON.stringify(searchInfo)
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
				var url = "/teachingInfoCollegeReport";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "SearchCriteria").attr("value",JSON.stringify(searchInfo)));
				form.appendTo('body').submit().remove();
				toastr.info('文件下载中，请稍候...');
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//学院下拉框
function stuffDepartmentSelect(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllDepartment",
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
				var reObject = new Object();
				reObject.normalSelectIds = "#someInfoDownLoad_department";
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.data.length; i++) {
					str += '<option value="' + backjson.data[i].edu104_ID + '">' + backjson.data[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#progress_department", str);
				stuffManiaSelect("#someInfoDownLoad_department", str);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//tab5事件绑定
function tab5BtnBind(){
	//全院授课信息报表数据
	$('#allInfoDownLoad').unbind('click');
	$('#allInfoDownLoad').bind('click', function(e) {
		allInfoDownLoad();
		e.stopPropagation();
	});

	//分院授课报表数据
	$('#someInfoDownLoad').unbind('click');
	$('#someInfoDownLoad').bind('click', function(e) {
		someInfoDownLoad();
		e.stopPropagation();
	});

	//填充学院下拉框
	stuffDepartmentSelect();

	//开始检索
	$('#startSearchTab5').unbind('click');
	$('#startSearchTab5').bind('click', function(e) {
		startSearchTab5();
		e.stopPropagation();
	});

	//重置检索
	$('#reReloadSearchsTab5').unbind('click');
	$('#reReloadSearchsTab5').bind('click', function(e) {
		reReloadSearchsTab5();
		e.stopPropagation();
	});
}
/**
 * tab5 end
 * */


/**
 * tab6 start
 * */
function judgmentIsFristTimeLoadTab6(){
	var isFirstShowTab6 = $(".isFirstShowTab6")[0].innerText;
	if (isFirstShowTab6 === "T") {
		stuffTab6Select();
		$(".isFirstShowTab6").html("F");
		getTab6TableInfo();
		tab6BtnBind();
	}
}

//渲染tab6非联动的培养计划下拉框
function stuffTab6Select(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getJwPublicCodes",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
		},
		dataType : 'json',
		success : function(backjson) {
			if (backjson.result) {
				var str='<option value="seleceConfigTip">请选择</option>';
				//层次
				var allLevel=backjson.allLevel;
				for (var i = 0; i < allLevel.length; i++) {
					str += '<option value="' + allLevel[i].edu103_ID + '">' + allLevel[i].pyccmc
						+ '</option>';
				}
				stuffManiaSelect("#studentWork_level", str);

				//系部
				str='<option value="seleceConfigTip">请选择</option>';
				var allDepartment=backjson.allDepartment;
				for (var i = 0; i < allDepartment.length; i++) {
					str += '<option value="' + allDepartment[i].edu104_ID + '">' + allDepartment[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#studentWork_department", str);

				//年级
				str='<option value="seleceConfigTip">请选择</option>';
				var allGrade=backjson.allGrade;
				for (var i = 0; i < allGrade.length; i++) {
					str += '<option value="' + allGrade[i].edu105_ID + '">' + allGrade[i].njmc
						+ '</option>';
				}
				stuffManiaSelect("#studentWork_grade", str);

				//专业
				str='<option value="seleceConfigTip">请选择</option>';
				var allMajor=backjson.allMajor;
				for (var i = 0; i < allMajor.length; i++) {
					str += '<option value="' + allMajor[i].edu106_ID + '">' + allMajor[i].zymc
						+ '</option>';
				}
				stuffManiaSelect("#studentWork_major", str);
			} else {
				toastr.warning('暂无可选检索条件');
			}
		}
	});
}

//获取tab6报表信息
function getTab6TableInfo(){
	var tab6SearchInfo=getTab6SearchInfo();
	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentWorkReportData",
		data: {
			"SearchCriteria":JSON.stringify(tab6SearchInfo)
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
				stufftab6Table(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});

}

//渲染就业报表
function stufftab6Table(backjsonData) {
	var tableInfo=backjsonData.tableInfo;

	$('#tab6ReportAreaTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".tab6ReportArea", "就业情况信息");
		},
		columns:backjsonData.columns
	});

	drawPagination(".tab6ReportArea", "就业情况信息");
	drawSearchInput(".tab6ReportArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//获得tab6检索条件
function getTab6SearchInfo(){
	var level = getNormalSelectValue("studentWork_level");
	var department = getNormalSelectValue("studentWork_department");
	var grade = getNormalSelectValue("studentWork_grade");
	var major = getNormalSelectValue("studentWork_major");
	var levelTxt = getNormalSelectText("studentWork_level");
	var departmentTxt  = getNormalSelectText("studentWork_department");
	var gradeTxt  = getNormalSelectText("studentWork_grade");
	var majorTxt  = getNormalSelectText("studentWork_major");

	var returnObject = new Object();
	returnObject.pycc = level;
	returnObject.xbbm = department;
	returnObject.njbm = grade;
	returnObject.zybm = major;
	returnObject.levelTxt = levelTxt;
	returnObject.departmentTxt = departmentTxt;
	returnObject.gradeTxt = gradeTxt;
	returnObject.majorTxt = majorTxt;
	return returnObject;
}

//tab6事件绑定
function tab6BtnBind(){
	//开始检索
	$('#startSearchTab6').unbind('click');
	$('#startSearchTab6').bind('click', function(e) {
		// startSearchTab6();
		e.stopPropagation();
	});

	//重置检索
	$('#reReloadSearchsTab6').unbind('click');
	$('#reReloadSearchsTab6').bind('click', function(e) {
		// reReloadSearchsTab6();
		e.stopPropagation();
	});
}


/**
 * tab6 end
 * */

//人数格式化
function peopleNumMatter(value, row, index) {
	return [
		'<div class="myTooltip" title="'+value+'人">'+value+'人</div>'
	]
		.join('');
}

//课程门数格式化
function kcMSNumMatter(value, row, index) {
	return [
		'<div class="myTooltip" title="'+value+'门">'+value+'门</div>'
	]
		.join('');
}

//学时格式化
function xsNumMatter(value, row, index) {
	return [
		'<div class="myTooltip" title="'+value+'学时">'+value+'学时</div>'
	]
		.join('');
}

//实际授课学时格式化
function sjskxsMatter(value, row, index) {
	var sjskxs=row.sjskxs;
	var zxs=row.zxs;
	if(sjskxs===zxs){
		return [
			'<div class="myTooltip greenTxt" title="'+value+'学时">'+value+'学时<i class="iconfont icon-yixuanze greenTxt" style="padding-left: 12px"></i></div>'
		]
			.join('');
	}else{
		return [
			'<div class="myTooltip normalTxt" title="'+value+'学时" style="margin-left: -35px;">'+value+'学时</div>'
		]
			.join('');
	}
}


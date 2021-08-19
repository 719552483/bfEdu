$(function() {
	judgementPWDisModifyFromImplements();
	LinkageSelectPublic("#level","#department","#grade","#major");
	$('.isSowIndex').selectMania(); //初始化下拉框
	getYearInfo();
	binBind();
	getCourseForPresent();
	EJDMElementInfo=queryEJDMElementInfo();
});

/**
 * tab1
 * */
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
	stuffManiaSelect("#year", str);
	stuffManiaSelect("#singleStudent_year", str);
	stuffManiaSelect("#departmnetArea_year", str);
	stuffManiaSelect("#student2Data_year", str);
}

//获取合格率信息
function getCourseForPresent(){
	//初始化表格
	var oTable = new stuffCrouseRsForPresentQueryTable();
	oTable.Init();
}

//填充合格率表
function stuffCrouseRsForPresentQueryTable(){
	requestErrorbeforeSend();
	window.releaseNewsEvents = {
		'click #gardeDeatils' : function(e, value, row, index) {
			getGardeDeatils(row);
		},
		'click #checkOnDeatils' : function(e, value, row, index) {
			checkOnDeatils(row);
		}
	};

	var oTableInit = new Object();
	oTableInit.Init = function () {
		$('#crouseRsForPresentQueryTable').bootstrapTable('destroy').bootstrapTable({
			url:'/searchCourseResult',         //请求后台的URL（*）
			method: 'POST',                      //请求方式（*）
			striped: true,                      //是否显示行间隔色
			cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,                   //是否显示分页（*）
			queryParamsType: '',
			dataType: 'json',
			pageNumber: 1, //初始化加载第一页，默认第一页
			queryParams: queryParams,//请求服务器时所传的参数
			sidePagination: 'server',//指定服务器端分页
			pageSize: 10,//单页记录数
			pageList: [10,20,30,40],//分页步进值
			search: false,
			silent: false,
			showRefresh: false,                  //是否显示刷新按钮
			showToggle: false,
			clickToSelect: true,
			showExport: false,      //是否显示导出
			striped: true,
			toolbar: '#toolbar',
			showColumns: true,
			onPostBody: function() {
				drawPagination(".crouseRsForPresentQueryTableArea", "授课成果");
				drawSearchInput(".crouseRsForPresentQueryTableArea");
				changeTableNoRsTip();
				toolTipUp(".myTooltip");
				changeColumnsStyle(".crouseRsForPresentQueryTableArea", "授课成果");
				btnControl();
			},
			onPageChange : function() {
				drawPagination(".crouseRsForPresentQueryTableArea", "授课成果");
			},
			columns : [
				{
					field : 'edu201_ID',
					title: '唯一标识',
					align : 'center',
					visible : false
				}, {
					field : 'className',
					title : '班级名称',
					align : 'left',
					sortable: true,
					formatter : paramsMatter
				},{
					field : 'kcmc',
					title : '课程名称',
					align : 'left',
					sortable: true,
					formatter : paramsMatter
				},{
					field : 'xn',
					title : '学年',
					align : 'left',
					visible : false,
					sortable: true,
					formatter : paramsMatter
				},{
					field : 'classType',
					title : '班级类型',
					align : 'left',
					visible : false,
					sortable: true,
					formatter :classTypeMatter
				},{
					field : 'lsmc',
					title : '任课教师',
					align : 'left',
					sortable: true,
					formatter : paramsMatter
				},{
					field : 'passingRate',
					title : '及格率',
					align : 'left',
					width: "100px",
					sortable: true,
					formatter :passingRateMatter
				},{
					field : 'action',
					title : '操作',
					align : 'center',
					clickToSelect : false,
					formatter : releaseNewsFormatter,
					events : releaseNewsEvents,
				}],
			responseHandler: function (res) {  //后台返回的结果
				hideloding();
				if(res.code == 200){
					var data = {
						total: res.data.total,
						rows: res.data.rows
					};
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

	function releaseNewsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="queryBtn" id="gardeDeatils"><span><img src="img/info.png" style="width:24px"></span>成绩详情</li>'
		+ '<li class="queryBtn" id="checkOnDeatils"><span><img src="images/d04.png" style="width:24px"></span>出勤情况</li>'
		+ '</ul>' ].join('');
	}

	// 得到查询的参数
	function queryParams(params) {
		var temp=getCourseForPresentSearchInfo(false);
		temp.pageNum=params.pageNumber;
		temp.pageSize=params.pageSize;
		return JSON.stringify(temp);
	}

	return oTableInit;
}

//获取合格率检索条件
function getCourseForPresentSearchInfo(canEmpty){
	var xnid=getNormalSelectValue("year");
	var ls=	$("#teacher")[0].attributes[4].nodeValue;
	var className=$("#className").val();
	var kcmc=$("#coruseName").val();
	var level=getNormalSelectValue("level");
	var department=getNormalSelectValue("department");
	var grade=getNormalSelectValue("grade");
	var major=getNormalSelectValue("major");
	if(xnid===""&&ls===""&&className===""&&kcmc===""&&level===''&&department===''&&grade===''&&major===''&&canEmpty){
		toastr.warning("检索条件不能为空");
		return;
	}

	var returnObject=new Object();
	returnObject.xnid=xnid;
	returnObject.ls=ls;
	returnObject.className=className;
	returnObject.kcmc=kcmc;
	returnObject.edu103=level;
	returnObject.edu104=department;
	returnObject.edu105=grade;
	returnObject.edu106=major;
	return returnObject;
}

//合格率开始检索
function startSearch(){
	var searchInfo=getCourseForPresentSearchInfo(true);
	if(typeof searchInfo==='undefined'){
		return;
	}
	getCourseForPresent();
}

//合格率重置检索
function reReloadSearchs(){
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.actionSelectIds = "#department,#grade,#major";
	reObject.normalSelectIds = "#year";
	reObject.InputIds = "#coruseName,#className,#teacher";
	reReloadSearchsWithSelect(reObject);
	$("#teacher").attr("choosendTeacherId","");
	getCourseForPresent();
}

//出勤情况
function checkOnDeatils(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAttendanceDetail",
		data: {
			"taskId":row.edu201_ID
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
				stuffCheckOnTable(backjson.data,row);
				$.showModal("#checkOnModal",true);
				$("#checkOnModal").find(".moadalTitle").html(row.kcmc+"-出勤信息");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染出勤情况表格
function stuffCheckOnTable(tableInfo,row){
	$('#checkOnForCourseRsTable').bootstrapTable('destroy').bootstrapTable({
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
			fileName: row.kcmc+'出勤情况导出'  //文件名称
		},
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: false,
		onPageChange: function() {
			drawPagination(".checkOnForCourseRsTableArea", "出勤信息");
		},
		columns: [
			 {
				field: 'xn',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'week',
				title: '周数',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'xqmc',
				title: '星期',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},  {
				field: 'kjmc',
				title: '课节',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'kcmc',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'attendance',
				title: '出勤率',
				align: 'left',
				sortable: true,
				formatter: attendanceMatter
			}
		]
	});

	function attendanceMatter(value, row, index) {
		if(value==null||typeof value==="undefined"||value===""){
			return [ '<span class="label label-default myTooltip" title="未录入">未录入</span>' ]
				.join('');
		}else{
			var currentValue=parseFloat(value.split("%")[0]);
			if(currentValue>0 && currentValue>=50){
				return [ '<span class="label label-success myTooltip" title="'+value+'">'+value+'</span>' ]
					.join('');
			}else{
				return [ '<span class="label label-danger myTooltip" title="'+value+'">'+value+'</span>' ]
					.join('');
			}
		}
	}

	drawPagination(".checkOnForCourseRsTableArea", "出勤信息");
	drawSearchInput(".checkOnForCourseRsTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".checkOnForCourseRsTableArea", "出勤信息");
	toolTipUp(".myTooltip");
}

//获取详情
function getGardeDeatils(row){
	getDeatilsInfo(row);
}

//获取成绩详情信息
function getDeatilsInfo(row){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchClassInfo",
		data:{
			"edu201Id":row.edu201_ID
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
				$(".crouseRsForPresentArea,.crouseRsForDeatilsArea").hide();
				$(".crouseRsForDeatils1Area").show();
				$('.GeneratDeatils1_Name').html(row.xn+' '+row.kcmc);
				stuffCrouseRsForDeatilsTable1(backjson.data);

				//返回
				$('#return_crouseRsForDeatils1Area').unbind('click');
				$('#return_crouseRsForDeatils1Area').bind('click', function(e) {
					$(".crouseRsForPresentArea").show();
					$(".crouseRsForDeatils1Area,.crouseRsForDeatilsArea").hide();
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染成绩详情表1
function stuffCrouseRsForDeatilsTable1(tableInfo){
	window.releaseNewsEvents = {
		'click #gardeDeatilsForClass' : function(e, value, row, index) {
			getGardeDeatilsForStudent(row);
		}
	};

	$('#crouseRsForDeatilsTable1').bootstrapTable('destroy').bootstrapTable({
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
			fileName: '班级授课成果导出'  //文件名称
		},
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".crouseRsForDeatilsTable1Area", "授课成果");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field : 'edu201_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
			}, {
				field : 'className',
				title : '班级名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'kcmc',
				title : '课程名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'lsmc',
				title : '任课教师',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'passingRate',
				title : '及格率',
				align : 'left',
				width: "100px",
				sortable: true,
				formatter :passingRateMatter
			},{
				field : 'action',
				title : '操作',
				align : 'center',
				clickToSelect : false,
				formatter : releaseNewsFormatter,
				events : releaseNewsEvents,
			}
		]
	});

	function releaseNewsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="queryBtn" id="gardeDeatilsForClass"><span><img src="img/info.png" style="width:24px"></span>学生个人成绩详情</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".crouseRsForDeatilsTable1Area", "授课成果");
	drawSearchInput(".crouseRsForDeatilsTable1Area");
	changeTableNoRsTip();
	changeColumnsStyle(".crouseRsForDeatilsTable1Area", "授课成果");
	toolTipUp(".myTooltip");
	btnControl();
}

//获取学生个人成绩详情
function getGardeDeatilsForStudent(row){
	var searchInfo=getCourseForDeatilsSearchInfo(row);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchGradeInfo",
		data:{
			"searchInfo":JSON.stringify(searchInfo)
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
				crouseRsForDeatilsReSearch();
				crouseRsForDeatilsBinBind(row);
				stuffCrouseRsForDeatilsTable(backjson.data);
				$("#currentEdu201_ID").html(row.edu201_ID);
				$("#currentCourseName").html(row.kcmc);
				$(".crouseRsForPresentArea,.crouseRsForDeatils1Area").hide();
				$(".crouseRsForDeatilsArea").show();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染成绩详情表2
function stuffCrouseRsForDeatilsTable(tableInfo){
	$('#crouseRsForDeatilsTable').bootstrapTable('destroy').bootstrapTable({
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
			drawPagination(".crouseRsForDeatilsTableArea", "成绩信息");
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
				field: 'studentCode',
				title: '学号',
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
				formatter: paramsMatter,
				visible : false
			},{
				field: 'getCredit',
				title: '课程已获学分',
				align: 'left',
				sortable: true,
				formatter: paramsMatter,
				visible : false
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

	drawPagination(".crouseRsForDeatilsTableArea", "成绩信息");
	drawSearchInput(".crouseRsForDeatilsTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".crouseRsForDeatilsTableArea", "成绩信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//获取成绩详情检索信息
function getCourseForDeatilsSearchInfo(row) {
	var returnObject=new Object();
	returnObject.edu201_ID=row.edu201_ID;
	returnObject.courseName=row.kcmc;
	returnObject.className=row.className;
	returnObject.StudentName='';
	return returnObject;
}

//成绩详情开始检索
function crouseRsForDeatilsSstartSearch(row){
	var searchInfo=new Object();
	searchInfo.edu201_ID=$("#currentEdu201_ID")[0].innerText;
	searchInfo.courseName=$("#currentCourseName")[0].innerText;
	searchInfo.className=row.className;
	searchInfo.StudentName=$("#studentName").val();
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchGradeInfo",
		data:{
			"searchInfo":JSON.stringify(searchInfo)
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
				stuffCrouseRsForDeatilsTable(backjson.data);
			} else {
				stuffCrouseRsForDeatilsTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重置成绩详情检索
function crouseRsForDeatilsReSearch(){
	var reObject = new Object();
	// reObject.InputIds = "#xzbMc,#studentName";
	reObject.InputIds = "#studentName";
	reReloadSearchsWithSelect(reObject);
}

//详情按钮事件绑定
function crouseRsForDeatilsBinBind(row){
	//开始检索
	$('#crouseRsForDeatils_startSearch').unbind('click');
	$('#crouseRsForDeatils_startSearch').bind('click', function(e) {
		crouseRsForDeatilsSstartSearch(row);
		e.stopPropagation();
	});

	//重置检索
	$('#crouseRsForDeatils_reReloadSearchs').unbind('click');
	$('#crouseRsForDeatils_reReloadSearchs').bind('click', function(e) {
		crouseRsForDeatilsReSearch();
		crouseRsForDeatilsSstartSearch();
		e.stopPropagation();
	});

	//返回
	$('#return').unbind('click');
	$('#return').bind('click', function(e) {
		crouseRsForDeatilsReSearch();
		$(".crouseRsForPresentArea,.crouseRsForDeatilsArea").hide();
		$(".crouseRsForDeatils1Area").show();
		e.stopPropagation();
	});
}

//获取所有教师
function getTeacherInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllTeacher",
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
			if (backjson.code === 200) {
				stuffAllClassMangersTable(backjson.data);
				$.showModal("#allClassMangersModal",true);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充教师表
function stuffAllClassMangersTable(tableInfo){
	$('#allClassMangersTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 5,
		pageList : [ 5 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		singleSelect: true,// 单选checkbox
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPageChange : function() {
			drawPagination(".allClassMangersTableArea", "教师信息");
		},
		columns : [ {
			field : 'edu101_ID',
			title : 'id',
			align : 'center',
			visible : false
		},{
			field: 'check',
			checkbox: true
		},{
			field : 'szxbmc',
			title : '二级学院',
			align : 'left',
			formatter : paramsMatter

		}, {
			field : 'xm',
			title : '姓名',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'jzgh',
			title : '教工号',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xb',
			title : '性别',
			align : 'left',
			formatter : sexFormatter
		}]
	});

	// 性别文字化
	function sexFormatter(value, row, index) {
		if (value === "M") {
			return [ '<div class="myTooltip" title="男">男</div>' ].join('');
		} else {
			return [ '<div class="myTooltip" title="女">女</div>' ].join('');
		}
	}
	drawPagination(".allClassMangersTableArea", "教师信息");
	drawSearchInput(".allClassMangersTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//选择教师模态框事件绑定
function teacherModalBtnBind(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
	//开始检索
	$('#allClassMangers_StartSearch').unbind('click');
	$('#allClassMangers_StartSearch').bind('click', function(e) {
		allClassMangersStartSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#allClassMangers_ReSearch').unbind('click');
	$('#allClassMangers_ReSearch').bind('click', function(e) {
		allClassMangersReSearch();
		e.stopPropagation();
	});

	//确认选择行政班
	$('#confirmChoosedTeacher').unbind('click');
	$('#confirmChoosedTeacher').bind('click', function(e) {
		confirmChoosedTeacher();
		e.stopPropagation();
	});
}

//教师开始检索
function allClassMangersStartSearch(){
	var departmentName=$("#departmentName").val();
	var mangerName=$("#mangerName").val();
	var mangerNumber=$("#mangerNumber").val();
	if(departmentName===""&&mangerName===""&&mangerNumber===""){
		toastr.warning('检索条件为空');
		return;
	}
	var serachObject=new Object();
	departmentName===""?serachObject.departmentName="":serachObject.departmentName=departmentName;
	mangerName===""?serachObject.xm="":serachObject.xm=mangerName;
	mangerNumber===""?serachObject.jzgh="":serachObject.jzgh=mangerNumber;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacher",
		data: {
			"SearchCriteria":JSON.stringify(serachObject),
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
				stuffAllClassMangersTable(backjson.data);
			} else {
				stuffAllClassMangersTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//教师重置检索
function allClassMangersReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
}

//确认选择教师
function confirmChoosedTeacher(){
	var choosed=$("#allClassMangersTable").bootstrapTable("getSelections");
	if(choosed.length==0){
		toastr.warning('请选择教师');
		return;
	}
	$("#teacher").val(choosed[0].xm);
	$("#teacher").attr("choosendTeacherId",choosed[0].edu101_ID);
	$.hideModal("#allClassMangersModal");
}

function classTypeMatter(value, row, index) {
	if(value==="01"){
		return [ '<div class="myTooltip" title="行政班">行政班</div>' ]
			.join('');
	}else{
		return [ '<div class="myTooltip" title="教学班">教学班</div>' ]
			.join('');
	}
}

function passingRateMatter(value, row, index) {
	var currentValue=parseFloat(value.split("%")[0]);
	if(currentValue>0 && currentValue>=50){
		return [ '<span class="label label-success myTooltip" title="'+value+'">'+value+'</span>' ]
			.join('');
	}else{
		return [ '<span class="label label-danger myTooltip" title="'+value+'">'+value+'</span>' ]
			.join('');
	}
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

//页面初始化时按钮事件绑定
function binBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//教师focus
	$('#teacher,#yearTeacher').focus(function(e){
		teacherModalBtnBind();
		getTeacherInfo();
		e.stopPropagation();
	});

	//课程focus
	$('#coruseName').focus(function(e){
		coruseNamefocus("coruseName");
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});
}

/**
 * tab1 end
 * */

/**
 * tab2
 * */
var EJDMElementInfo;
//判断是否首次点击tab2
function judgmentIsFristTimeLoadTab2(){
	var isFirstShowTab2 = $(".isFirstShowTab2")[0].innerText;
	if (isFirstShowTab2 === "T") {
		$(".isFirstShowTab2").html("F");
		stuffEJDElement(EJDMElementInfo);
		LinkageSelectPublic("#singleStudent_level","#singleStudent_department","#singleStudent_grade","#singleStudent_major");
		stuffSingleStudentGradeTable({});
		tab2BinBind();
	}
}

//渲染学生排名表
function stuffSingleStudentGradeTable(tableInfo){
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
		columns: [
			{
				field : 'edu201_ID',
				title: '唯一标识',
				align : 'center',
				visible : false
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
			}
		]
	});

	drawPagination(".singleStudentGradeTableArea", "排名信息");
	drawSearchInput(".singleStudentGradeTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".singleStudentGradeTableArea", "排名信息");
	toolTipUp(".myTooltip");
}

//开始检索学生排名
function singleStudentStartSearch(){
	var singleStudentSearchInfo=getSingleStudentSearchInfo();
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
				stuffSingleStudentGradeTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得学生排名检索对象
function getSingleStudentSearchInfo(){
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

	if(batch===''){
		toastr.warning('批次类型不能为空');
		return;
	}

	if(xn===''){
		toastr.warning('学年不能为空');
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

	return returnObject;
}

//学生排名重置检索
function singleStudentReReloadSearchs(){
	var reObject = new Object();
	reObject.fristSelectId = "#singleStudent_level";
	reObject.actionSelectIds = "#singleStudent_department,#singleStudent_grade,#singleStudent_major";
	reObject.normalSelectIds = "#singleStudent_year,#singleStudent_bath";
	reObject.InputIds = "#singleStudent_className,#singleStudent_studentName";
	reReloadSearchsWithSelect(reObject);
	stuffSingleStudentGradeTable({});
}

//预备学生个人成绩排名导出
function exportGradeSingleStudent(){
	var singleStudentSearchInfo=getSingleStudentSearchInfo();
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
		singleStudentStartSearch();
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

	$("#singleStudent_year").change(function() {
		singleStudentStartSearch();
	});
}

/**
 * tab2 end
 * */



/**
 * tab3
 * */
//判断是否首次点击Tba3
function judgmentIsFristTimeLoadTab3() {
	var isFirstShowTab3 = $(".isFirstShowTab3")[0].innerText;
	if (isFirstShowTab3 === "T") {
		$(".isFirstShowTab3").html("F");
		stuffEJDElement(EJDMElementInfo);
		LinkageSelectPublic("#departmnetArea_level","#departmnetArea_department","#departmnetArea_grade","#departmnetArea_major");
		tab3BinBind();
	}
}

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
				$('.departmentChartArea').show().empty();
				drawChart(backjson.data);
				chartListener();
			} else {
				toastr.warning(backjson.msg);
				$('.departmentConfigArea').show();
				$('.departmentChartArea').hide();
			}
		}
	});
}

//填充  chart
function drawChart(data) {
	$('.departmentChartArea').append('<div class="departmentChart col1" id="drawChart0"></div>');

	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById("drawChart0"));

	var option = {
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
	reObject.normalSelectIds = "#departmnetArea_year,#departmnetArea_bath";
	reObject.InputIds = "#departmnetArea_crouseName";
	reReloadSearchsWithSelect(reObject);
	$('.departmentConfigArea').show();
	$('.departmentChartArea').hide();
}

//tab3页面按钮事件绑定
function tab3BinBind(){
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
	var columnses=[];
	if(type==='1'){
		columnses=[ {
			field : 'edu001_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
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
			formatter : paramsMatter
		}];
	}else{
		columnses=[ {
			field : 'edu300_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		},{
			field : 'pyccmc',
			title : '学生姓名1',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'pyccmc1',
			title : '行政班1',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		}, {
			field : 'pyccmc',
			title : '学号1',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field :'pyccmc',
			title : '毕业率',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
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
		onPageChange : function() {
			drawPagination(".mainStudentBaseInfoTableArea", "数据");
		},
		columns: columnses
	});

	drawPagination(".mainStudentBaseInfoTableArea", "数据");
	drawSearchInput(".mainStudentBaseInfoTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".mainStudentBaseInfoTableArea", "数据");
}

//类型下拉框change事件
function student2DataByNumChange(){
	var type=getNormalSelectValue('student2Data_type');

	if(type==='1'||type===''){
		$('.student2Data_byNumArea').hide();
		$('#tab4').find('.myformtextTipArea').hide();
	}else{
		$('.student2Data_byNumArea').show();
		$('#tab4').find('.myformtextTipArea').show();
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
	classObJECT.xbbm=edu104Id;
	classObJECT.nj=edu105Id;
	classObJECT.zybm=edu106Id;
	classObJECT.batch=batch;
	classObJECT.xnid=xnid;
	classObJECT.xzbmc=className;
	classObJECT.studentName=studentName;
	classObJECT.pyccmc=edu103IdName;
	classObJECT.xbmc=edu104IdName;
	classObJECT.edu105IdName=edu105IdName;
	classObJECT.zymc=edu106IdName;
	classObJECT.xnidName=xnidName;
	classObJECT.batchName=batchName;

	var returnObject=new Object();
	returnObject.type=type;
	returnObject.num=byNum;
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
}
/**
 * tab4 end
 * */


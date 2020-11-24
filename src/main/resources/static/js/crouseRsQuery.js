$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	getYearInfo();
	binBind();
	getCourseForPresent();
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
	stuffManiaSelect("#year", str);
}

//获取合格率信息
function getCourseForPresent(){
	//初始化表格
	var oTable = new stuffCrouseRsForPresentQueryTable();
	oTable.Init();
}

//填充合格率表
function stuffCrouseRsForPresentQueryTable(){
	window.releaseNewsEvents = {
		'click #gardeDeatils' : function(e, value, row, index) {
			getGardeDeatils(row);
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
			showExport: true,      //是否显示导出
			exportDataType: "all",
			exportOptions:{
				fileName: '课程合格率导出'  //文件名称
			},
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
				},{
					field : 'xn',
					title : '学年',
					align : 'left',
					formatter : paramsMatter
				},{
					field : 'classType',
					title : '班级类型',
					align : 'left',
					visible : false,
					formatter :classTypeMatter
				}, {
					field : 'className',
					title : '班级名称',
					align : 'left',
					formatter : paramsMatter
				},{
					field : 'kcmc',
					title : '课程名称',
					align : 'left',
					formatter : paramsMatter
				},{
					field : 'lsmc',
					title : '任课教师',
					align : 'left',
					formatter : paramsMatter
				},{
					field : 'passingRate',
					title : '及格率',
					align : 'left',
					width: "100px",
					formatter :passingRateMatter
				},{
					field : 'checkOnRate',
					title : '出勤率',
					align : 'left',
					width: "100px",
					formatter :checkOnRateMatter
				},{
					field : 'action',
					title : '操作',
					align : 'center',
					clickToSelect : false,
					formatter : releaseNewsFormatter,
					events : releaseNewsEvents,
				}],
			responseHandler: function (res) {  //后台返回的结果
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

	// 得到查询的参数
	function queryParams(params) {
		var temp=getCourseForPresentSearchInfo();
		temp.pageNum=params.pageNumber;
		temp.pageSize=params.pageSize;
		return JSON.stringify(temp);
	}

	function releaseNewsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="queryBtn" id="gardeDeatils"><span><img src="img/info.png" style="width:24px"></span>成绩详情</li>'
		+ '</ul>' ].join('');
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

	function checkOnRateMatter(value, row, index) {
		if(row.checkOnRate==null||typeof row.checkOnRate==="undefined"||row.checkOnRate===""){
			return [ '<span class="label label-default myTooltip" title="未录入">未录入</span>' ]
				.join('');
		}else{
			var currentValue=parseFloat(row.checkOnRate.split("%")[0]);
			if(currentValue>0 && currentValue>=50){
				return [ '<span class="label label-success myTooltip" title="'+row.checkOnRate+'">'+row.checkOnRate+'</span>' ]
					.join('');
			}else{
				return [ '<span class="label label-danger myTooltip" title="'+row.checkOnRate+'">'+row.checkOnRate+'</span>' ]
					.join('');
			}
		}
	}

	return oTableInit;
}

//获取合格率检索条件
function getCourseForPresentSearchInfo(){
	var xnid=getNormalSelectValue("year");
	var ls=	$("#teacher")[0].attributes[4].nodeValue;
	var className=$("#className").val();
	var kcmc=$("#coruseName").val();

	var returnObject=new Object();
	returnObject.xnid=xnid;
	returnObject.ls=ls;
	returnObject.className=className;
	returnObject.kcmc=kcmc;
	return returnObject;
}

//合格率开始检索
function startSearch(){
	var searchInfo=getCourseForPresentSearchInfo();
	if(searchInfo.xnid===""&&searchInfo.ls===""&&searchInfo.className===""&&searchInfo.kcmc===""){
		toastr.warning("检索条件不能为空");
		return;
	}
	getCourseForPresent();
}

//合格率重置检索
function reReloadSearchs(){
	var reObject = new Object();
	reObject.normalSelectIds = "#year";
	reObject.InputIds = "#coruseName,#className,#teacher";
	reReloadSearchsWithSelect(reObject);
	$("#teacher").attr("choosendTeacherId","");
	getCourseForPresent();
}

//获取详情
function getGardeDeatils(row){
	getDeatilsInfo(row);
}

//获取成绩详情信息
function getDeatilsInfo(row){
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
				changeShowArea();
				crouseRsForDeatilsBinBind();
				stuffCrouseRsForDeatilsTable(backjson.data);
				$("#currentEdu201_ID").html(row.edu201_ID);
				$("#currentCourseName").html(row.kcmc);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染成绩详情表
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
	returnObject.className=$("#xzbMc").val();
	returnObject.StudentName=$("#studentName").val();
	return returnObject;
}

//成绩详情开始检索
function crouseRsForDeatilsSstartSearch(){
	var searchInfo=new Object();
	searchInfo.edu201_ID=$("#currentEdu201_ID")[0].innerText;
	searchInfo.courseName=$("#currentCourseName")[0].innerText;
	searchInfo.className=$("#xzbMc").val();
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
	reObject.InputIds = "#xzbMc,#studentName";
	reReloadSearchsWithSelect(reObject);
}

//改变展示区域
function changeShowArea(){
	$(".crouseRsForPresentArea").toggle();
	$(".crouseRsForDeatilsArea").toggle();
}

//详情按钮事件绑定
function crouseRsForDeatilsBinBind(){
	//开始检索
	$('#crouseRsForDeatils_startSearch').unbind('click');
	$('#crouseRsForDeatils_startSearch').bind('click', function(e) {
		crouseRsForDeatilsSstartSearch();
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
		changeShowArea();
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
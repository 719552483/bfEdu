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

	function ztMatter(value, row, index) {
		if (row.zt==="在读") {
			return [
				'<div class="myTooltip greenTxt" title="在读">在读</div>'
			]
				.join('');
		} else if(row.zt==="毕业"){
			return [
				'<div class="myTooltip normalTxt" title="'+row.zt+'">'+row.zt+'</div>'
			]
				.join('');
		}else if(row.zt==="其他"){
			return [
				'<div class="myTooltip" title="'+row.zt+'">'+row.zt+'</div>'
			]
				.join('');
		}else{
			return [
				'<div class="myTooltip redTxt" title="'+row.zt+'">'+row.zt+'</div>'
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
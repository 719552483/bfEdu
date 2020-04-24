$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	drawStudentBaseInfoEmptyTable();
	binBind();
});

//填充空的学生表
function drawStudentBaseInfoEmptyTable() {
	stuffStudentBaseInfoTable({});
}

function stuffStudentBaseInfoTable(tableInfo) {
	window.releaseNewsEvents = {
		'click #studentDetails': function(e, value, row, index) {
			alert(1)
		},
		'click #modifyStudent': function(e, value, row, index) {
			alert(1)
		},
		'click #removeStudent': function(e, value, row, index) {
			removeStudent(row);
		}
	};

	$('#studentBaseInfoTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo.newsInfo,
		pagination: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		striped: true,
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".studentBaseInfoTableArea", "学生信息");
		},
		columns: [{
				field: 'id',
				title: 'id',
				align: 'center',
				visible: false
			},
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'level',
				title: '层次',
				align: 'left',
				formatter: paramsMatter

			}, {
				field: 'department',
				title: '系部',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'grade',
				title: '年级',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'major',
				title: '专业名称',
				align: 'center',
				formatter: paramsMatter
			}, {
				field: 'administrationClass',
				title: '行政班',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'studentNumber',
				title: '学号',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'studentName',
				title: '姓名',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'sex',
				title: '性别',
				align: 'left',
				formatter: sexFormatter,
				visible: false
			}, {
				field: 'studentStatus',
				title: '状态',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'academyName',
				title: '学院名称',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'academyCode',
				title: '学院代码',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'educationalSystem',
				title: '学制',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'isroll',
				title: '是否有学籍',
				align: 'left',
				formatter: isrollMatter,
				visible: false
			},
			{
				field: 'admissioTicketNumber',
				title: '准考证号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			},
			{
				field: 'examineeNumber',
				title: '考生号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'IdNumber',
				title: '身份证号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'studentRollNumber',
				title: '学籍号',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'usedName',
				title: '曾用名',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'birthDate',
				title: '出生日期',
				align: 'left',
				formatter: timeFormatter,
				visible: false
			}, {
				field: 'enterSchoolDate',
				title: '入学时间',
				align: 'left',
				formatter: timeFormatter,
				visible: false
			}, {
				field: 'nation',
				title: '民族',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'isMarriage',
				title: '婚否',
				align: 'left',
				formatter: marriageMatter,
				visible: false
			}, {
				field: 'ducationalLevel',
				title: '文化程度',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'politicalLandscape',
				title: '政治面貌',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'fromLocal',
				title: '生源地',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'familyAddress',
				title: '家庭住址',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'enterSchoolScore',
				title: '入学总分',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'studentMark',
				title: '备注',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'phoneNumber',
				title: '手机号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'email',
				title: 'E-mail',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'birthplace',
				title: '籍贯',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'Height',
				title: '身高',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'bodyWeight',
				title: '体重',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'fromArmy',
				title: '来自军队',
				align: 'left',
				formatter: isOrNotisMatter,
				visible: false
			}, {
				field: 'fromType',
				title: '生源类型',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'fromWay',
				title: '招生方式',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'isOrder',
				title: '是否订单',
				align: 'left',
				formatter: isOrNotisMatter,
				visible: false
			}, {
				field: 'isFiling',
				title: '是否建档',
				align: 'left',
				formatter: isFilingMatter,
				visible: false
			}, {
				field: 'testerType',
				title: '考生类别',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'enterSchoolWay',
				title: '入学方式',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'subjectsType',
				title: '科类',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'enrolWay',
				title: '录取形式',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'studyWay',
				title: '学习形式',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
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
				'<li id="studentDetails"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
				'<li id="modifyStudent"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
				'<li id="removeStudent"><span><img src="images/t03.png"></span>删除</li>' +
				'</ul>'
			]
			.join('');
	}

	function isrollMatter(value, row, index) {
		if (value) {
			return [
					'<div class="myTooltip greenTxt" title="有学籍">有学籍</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip redTxt" title="无学籍">无学籍</div>'
				]
				.join('');
		}
	}

	function marriageMatter(value, row, index) {
		if (value) {
			return [
					'<div class="myTooltip" title="已婚">已婚</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip" title="未婚">未婚</div>'
				]
				.join('');
		}
	}

	function isFilingMatter(value, row, index) {
		if (value) {
			return [
					'<div class="myTooltip greenTxt" title="已建档">已建档</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip redTxt" title="未建档">未建档</div>'
				]
				.join('');
		}
	}

	drawPagination(".studentBaseInfoTableArea", "学生信息");
	drawSearchInput();
	changeTableNoRsTip();
	changeColumnsStyle( ".studentBaseInfoTableArea", "学生信息");
	toolTipUp(".myTooltip");
}

//单个删除学生
function removeStudent(row) {
	$(".remindTip").show();
	showMaskingElement();
	$(".remindType").html("学生");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.id);
		removeNewsAjaxDemo("#studentBaseInfoTable", removeArray, ".studentBaseInfoTableArea", "学生信息");
		e.stopPropagation();
	});
}

//多选删除学生
function removeStudents() {
	var chosenNews = $('#studentBaseInfoTable').bootstrapTable('getAllSelections');
	if (chosenNews.length === 0) {
		toastr.warning('暂未选择任何数据');
	} else {
		$(".remindTip").show();
		showMaskingElement();
		$(".remindType").html("学生");
		$(".remindActionType").html("删除");
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			var removeNewsArray = new Array;
			for (var i = 0; i < chosenNews.length; i++) {
				removeNewsArray.push(chosenNews[i].id);
			}
			removeNewsAjaxDemo("#studentBaseInfoTable", removeNewsArray, ".studentBaseInfoTableArea", "学生信息");
			e.stopPropagation();
		});
	}
}

//预备新增学生
function wantAddStudent() {
	$(".addStudentTip").show();
	showMaskingElement();
	stuffStatusSelect();
	drawCalenr("#dateOfBrith");
	drawCalenr("#enterSchoolDate");
}

//填充状态下拉框
function stuffStatusSelect() {
	if ($("#newStudentStatus").find("option").length === 1) {
		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < studentStuatsArray.length; i++) {
			str += '<option value="' + studentStuatsArray[i] + '">' + studentStuatsArray[i] + '</option>';
		}
		stuffManiaSelect("#newStudentStatus", str);
	}
}


//获取学生信息
function getStudentInfo() {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	var tableInfo = {
		"newsInfo": [{
			"id": "id1",
			"level": "层次",
			"department": "系部",
			"grade": "年级",
			"major": "专业",
			"administrationClass": "行政班",
			"studentNumber": "学号",
			"studentName": "姓名",
			"sex": "M",
			"studentStatus": "在读",
			"academyName": "学院名称",
			"academyCode": "学院代码",
			"educationalSystem": 3,
			"isroll": true,
			"admissioTicketNumber": "准考证号",
			"examineeNumber": "考生号",
			"IdNumber": "身份证号",
			"studentRollNumber": "学籍号",
			"usedName": "曾用名",
			"birthDate": "199402275210000000",
			"enterSchoolDate": "201902275210000000",
			"nation": "汉",
			"isMarriage": false,
			"ducationalLevel": "大专",
			"politicalLandscape": "团员",
			"fromLocal": "辽宁",
			"familyAddress": "湖南常德阳光花园1403",
			"enterSchoolScore": 857,
			"studentMark": "",
			"phoneNumber": "18673622251",
			"email": "",
			"birthplace": "湖南",
			"Height": 170,
			"bodyWeight": 80,
			"fromArmy": false,
			"fromType": "生源类型",
			"fromWay": "招生方式",
			"isOrder": false,
			"isFiling": true,
			"testerType": "考生类别",
			"enterSchoolWay": "入学方式",
			"subjectsType": "文科",
			"enrolWay": "录取形式",
			"studyWay": "学习方式",


		}]
	}
	stuffStudentBaseInfoTable(tableInfo);
}

//开始检索
function startSearch() {
	var level = getNormalSelectValue("level");
	var department = getNormalSelectValue("department");
	var grade = getNormalSelectValue("grade");
	var major = getNormalSelectValue("major");
	var administrationClass = getNormalSelectValue("administrationClass");
	var status = getNormalSelectValue("status");
	var studentNumber = $("#studentNumber").val();
	var studentName = $("#studentName").val();
	var studentRollNumber = $("#studentRollNumber").val();
	var className = $("#className").val();

	if (level === "seleceConfigTip" &&
		department === "seleceConfigTip" &&
		grade === "seleceConfigTip" &&
		major === "seleceConfigTip" &&
		administrationClass === "seleceConfigTip" &&
		status === "seleceConfigTip" &&
		studentNumber === "" &&
		studentName === "" &&
		studentRollNumber === "" &&
		className === ""
	) {
		toastr.warning('请输入检索条件');
		return;
	}

	var searchObject = new Object();
	if (level !== "seleceConfigTip") {
		searchObject.level = level;
	}
	if (department !== "seleceConfigTip") {
		searchObject.department = department;
	}
	if (grade !== "seleceConfigTip") {
		searchObject.grade = grade;
	}
	if (major !== "seleceConfigTip") {
		searchObject.major = major;
	}
	if (administrationClass !== "seleceConfigTip") {
		searchObject.administrationClass = administrationClass;
	}
	if (status !== "seleceConfigTip") {
		searchObject.status = status;
	}

	if (studentNumber !== "") {
		searchObject.studentNumber = studentNumber;
	}
	if (studentName !== "") {
		searchObject.studentName = studentName;
	}
	if (studentRollNumber !== "") {
		searchObject.studentRollNumber = studentRollNumber;
	}
	if (className !== "") {
		searchObject.className = className;
	}

	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	getStudentInfo();
}

//下载学生信息模板
function loadStudentInfoModel() {
	var $eleForm = $("<form method='get'></form>");
	$eleForm.attr("action", "https://codeload.github.com/douban/douban-client/legacy.zip/master"); //下载文件接口
	$(document.body).append($eleForm);
	//提交表单，实现下载
	$eleForm.submit();
}

//导入学生信息文件
function importStudentInfo() {
	$(".importStudentInfo").show();
	showMaskingElement();
	$("#studentInfoFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#studentInfoFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toUpperCase();
		if (suffix != "xls".toUpperCase() && suffix !== ".xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#studentInfoFile").val("");
			return
		}
		$("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
}

//检验学生信息文件
function checkStudentInfoFile() {
	if ($("#studentInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	$("#studentInfoForm").attr("action", ""); //检验文件接口
	$("#studentInfoFile").attr("uploadSuccess", true);
	toastr.success('文件正确');
}

//确认提交学生信息文件
function confirmImportStudentInfo() {
	if ($("#studentInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}

	if ($("#studentInfoFile")[0].attributes[2].nodeValue === "false") {
		toastr.warning('请检验文件\\文件检验不通过');
		return;
	}
	$("#studentInfoForm").attr("action", ""); //提交文件接口
	$("#studentInfoForm").submit();
	toastr.success('文件上传成功');
}



//初始化页面按钮绑定事件
function binBind() {
	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//新增学生
	$('#addStudent').unbind('click');
	$('#addStudent').bind('click', function(e) {
		wantAddStudent();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$(".tip").hide();
		showMaskingElement();
		e.stopPropagation();
	});

	//批量删除学生
	$('#removeStudents').unbind('click');
	$('#removeStudents').bind('click', function(e) {
		removeStudents();
		e.stopPropagation();
	});

	//上传学生信息文件
	$('#importStudentInfo').unbind('click');
	$('#importStudentInfo').bind('click', function(e) {
		importStudentInfo();
		e.stopPropagation();
	});

	//下载学生信息模板
	$('#loadStudentInfoModel').unbind('click');
	$('#loadStudentInfoModel').bind('click', function(e) {
		loadStudentInfoModel();
		e.stopPropagation();
	});

	//确认上传
	$('.confirmImportStudentInfo').unbind('click');
	$('.confirmImportStudentInfo').bind('click', function(e) {
		confirmImportStudentInfo();
		e.stopPropagation();
	});

	//检验学生信息文件
	$('#checkStudentInfoFile').unbind('click');
	$('#checkStudentInfoFile').bind('click', function(e) {
		checkStudentInfoFile();
		e.stopPropagation();
	});


}

var studentStuatsArray = ["辍学",
	"取消学籍",
	"在读",
	"休学",
	"退学",
	"参军",
	"开出学籍",
	"离校",
	"转学",
	"毕业",
	"结业",
	"其它",
	"离校未毕业",
	"开出",
	"死亡",
	"自动退学",
];

var EJDMElementInfo;
var choosendStudent=new Array();
$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getMajorTrainingSelectInfo();
	btnControl();
	binBind();
	getStudentInfo();
	$("#addStudentzy").change(function() {
		var levelValue = getNormalSelectValue("addStudentpycc");
		var departmentValue = getNormalSelectValue("addStudentxb");
		var gradeValue =getNormalSelectValue("addStudentnj");
		var majorValue =getNormalSelectValue("addStudentzy");

		var culturePlanObject=new Object();
		culturePlanObject.level=levelValue;
		culturePlanObject.department=departmentValue;
		culturePlanObject.grade=gradeValue;
		culturePlanObject.major=majorValue;
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryCulturePlanAdministrationClasses",
			data: {
				"culturePlanInfo":JSON.stringify(culturePlanObject)
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
				if (backjson.result) {
					var str = '<option value="seleceConfigTip">暂无选择</option>';
					if (backjson.classesInfo.length===0) {
						toastr.warning('暂无班级');
					}else{
						str = '<option value="seleceConfigTip">请选择</option>';
						for (var i = 0; i < backjson.classesInfo.length; i++) {
							str += '<option value="' + backjson.classesInfo[i].edu300_ID + '">' + backjson.classesInfo[i].xzbmc
								+ '</option>';
						}
					}
					stuffManiaSelect("#addStudentxzb", str);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
});

//获取所有学生
function getStudentInfo() {
	//初始化表格
	var oTable = new stuffStudentBaseInfoTable();
	oTable.Init();
}

//获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		if(typeof getNotNullSearchs()==="undefined"){
			return;
		}
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryCulturePlanStudent",
			data: {
				"culturePlanInfo":JSON.stringify(getNotNullSearchs())
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
				if (backjson.result) {
					hideloding();
					if (backjson.classInfo.length===0&&backjson.studentInfo.length===0) {
						toastr.warning('暂无信息');
						return;
					}

					if (backjson.classInfo.length===0) {
						toastr.warning('暂无班级信息');
					}else{
						var str = '<option value="seleceConfigTip">请选择</option>';
						for (var i = 0; i < backjson.classInfo.length; i++) {
							str += '<option value="' + backjson.classInfo[i].edu300_ID + '">' + backjson.classInfo[i].xzbmc
								+ '</option>';
						}
						stuffManiaSelect("#administrationClass", str);
					}
					if (backjson.studentInfo.length===0) {
						toastr.warning('暂无学生信息');
						$("#reportFormStudentTable").bootstrapTable("removeAll");
					}else{
						stuffStudentBaseInfoTable(backjson.studentInfo);
					}
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

//渲染学生表
function stuffStudentBaseInfoTable() {
	window.releaseNewsEvents = {
		'click #studentDetails': function(e, value, row, index) {
			studentDetails(row,index);
		}
	};

	var oTableInit = new Object();
	oTableInit.Init = function () {
		$('#reportFormStudentTable').bootstrapTable('destroy').bootstrapTable({
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
			showExport: true,      //是否显示导出
			exportDataType: "all",
			exportOptions:{
				fileName: '学生信息导出'  //文件名称
			},
			striped: true,
			toolbar: '#toolbar',
			showColumns: true,
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
			onPostBody: function() {
				drawPagination(".reportFormStudentTableArea", "学生信息","serverPage",1);
				drawSearchInput(".studentBaseInfoTableArea");
				changeTableNoRsTip();
				changeColumnsStyle( ".reportFormStudentTableArea", "学生信息","serverPage");
				toolTipUp(".myTooltip");
				btnControl();

				//勾选已选数据
				for (var i = 0; i < choosendStudent.length; i++) {
					$("#reportFormStudentTable").bootstrapTable("checkBy", {field:"edu001_ID", values:[choosendStudent[i].edu001_ID]})
				}
			},
			onPageChange: function() {
				drawPagination(".reportFormStudentTableArea", "学生信息","serverPage",1);
			},
			columns: [
				{
					field: 'check',
					checkbox: true
				},{
					field: 'edu001_ID',
					title: '唯一标识',
					align: 'center',
					sortable: true,
					visible: false
				},
				{
					field: 'pyccmc',
					title: '层次',
					align: 'left',
					sortable: true,
					formatter: paramsMatter

				}, {
					field: 'szxbmc',
					title: '二级学院',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, {
					field: 'njmc',
					title: '年级',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, {
					field: 'zymc',
					title: '专业名称',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, {
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
				},{
					field: 'sylx',
					title: '生源类型',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				},  {
					field: 'xb',
					title: '性别',
					align: 'left',
					sortable: true,
					formatter: sexFormatter,
					visible: false
				}, {
					field: 'zt',
					title: '状态',
					align: 'left',
					sortable: true,
					formatter: ztMatter
				}, {
					field: 'sfyxj',
					title: '是否有学籍',
					align: 'left',
					sortable: true,
					formatter: isrollMatter,
					visible: false
				},
				{
					field: 'zkzh',
					title: '准考证号',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				},
				{
					field: 'ksh',
					title: '考生号',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				},
				// {
				// 	field: 'sfzh',
				// 	title: '身份证号',
				// 	align: 'left',
				// 	sortable: true,
				// 	formatter: paramsMatter,
				// 	visible: false
				// },
				{
					field: 'xjh',
					title: '学籍号',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				},{
					field: 'zym',
					title: '曾用名',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'csrq',
					title: '出生日期',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'rxsj',
					title: '入学时间',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'mz',
					title: '民族',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'hf',
					title: '婚否',
					align: 'left',
					sortable: true,
					formatter: marriageMatter,
					visible: false
				}, {
					field: 'whcd',
					title: '文化程度',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'zzmm',
					title: '政治面貌',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'syd',
					title: '生源地',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'jtzz',
					title: '家庭住址',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'rxzf',
					title: '入学总分',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'bz',
					title: '备注',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'sjhm',
					title: '手机号',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'email',
					title: 'E-mail',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'jg',
					title: '籍贯',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'sg',
					title: '身高',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
					field: 'tz',
					title: '体重',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				},  {
					field: 'zsfs',
					title: '招生方式',
					align: 'left',
					sortable: true,
					formatter: paramsMatter
				}, {
					field: 'dxpy',
					title: '是否订单',
					align: 'left',
					sortable: true,
					formatter: isOrNotisMatter,
					visible: false
				}, {
					field: 'action',
					title: '操作',
					align: 'center',
					clickToSelect: false,
					formatter: releaseNewsFormatter,
					events: releaseNewsEvents,
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
		var temp=getSearchStudentObject();
		temp.pageNum=params.pageNumber;
		temp.pageSize=params.pageSize;
		return JSON.stringify(temp);
	}

	function releaseNewsFormatter(value, row, index) {
		return [
				'<ul class="toolbar tabletoolbar">' +
				'<li id="studentDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
				'</ul>'
			]
			.join('');
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
	
	function isrollMatter(value, row, index) {
		if (value==="T") {
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
		if (value==="T") {
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

//单选学生
function onCheck(row){
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
function onUncheck(row){
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
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosendStudent.push(row[i]);
	}
}

//全反选学生
function onUncheckAll(row){
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

//后端分页导出学生
function exportStudent(){
	var url = "/exportStudentExcel";
	var  searchStudentObject=getSearchStudentObject();
	var form = $("<form></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "searchInfo").attr("value", JSON.stringify(searchStudentObject)));
	form.on("submit",function() {
		requestErrorbeforeSend()
		//做ajax
		$.ajax({
			url: url,
			method: "POST",
			data:{
				"searchInfo":JSON.stringify(searchStudentObject)
			},
			success: function () {
				hideloding()
			}
		})
	});
	form.appendTo('body').submit().remove();
}

//展示学生详情
function studentDetails(row,index){
	$.showModal("#addStudentModal",false);
	// $(".StudentIDNumInput").hide();
	$("#addStudentModal").find(".formtext").hide();
	$("#addStudentModal").find(".moadalTitle").html(row.xm+"-详细信息");
	$('#addStudentModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
	$(".XhArea").show();
	//清空模态框中元素原始值
	emptyStudentBaseInfoArea();
	$(".addStudentTip").show();
	drawCalenr("#dateOfBrith");
	drawCalenr("#enterSchoolDate");
	stuffStudentDetails(row);
}

//填充学生信息
function stuffStudentDetails(row){
	$("#addStudentNum").val(row.xh);
	$("#addStudentName").val(row.xm);
	$("#addStudentUsedName").val(row.zym);
	stuffManiaSelectWithDeafult("#addStudentSex", row.xb);
	stuffManiaSelectWithDeafult("#addStudentStatus", row.ztCode);
	$("#dateOfBrith").val(row.csrq);
	stuffManiaSelectWithDeafult("#addStudentxzb", row.edu300_ID,row.xzbname);
	// $("#addStudentIDNum").val(row.sfzh);
	stuffManiaSelectWithDeafult("#addStudentNation", row.mzbm);
	stuffManiaSelectWithDeafult("#addStudentIsHaveStatus", row.sfyxj);
	$("#addStudentStatusNum").val(row.xjh);
	stuffManiaSelectWithDeafult("#addStudentzzmm", row.zzmmbm);
	$("#addStudentsyd").val(row.syd);
	stuffManiaSelectWithDeafult("#addStudentwhcd", row.whcdbm);
	$("#addStudentksh").val(row.ksh);
	$("#addStudentrxzf").val(row.rxzf);
	$("#enterSchoolDate").val(row.rxsj);
	$("#addStudentbyzh").val(row.byzh);
	$("#addStudentzkzh").val(row.zkzh);
	$("#addStudentphoneNum").val(row.sjhm);
	$("#addStudentemail").val(row.email);
	$("#addStudentjk").val(row.jg);
	$("#addStudentzhiye").val(row.zy);
	$("#addStudentsg").val(row.sg);
	$("#addStudenttz").val(row.tz);
	stuffManiaSelectWithDeafult("#addStudentIsMarried", row.hf);
	stuffManiaSelectWithDeafult("#addStudentType", row.sylxbm);
	stuffManiaSelectWithDeafult("#addStudentzsfs", row.zsfscode);
	stuffManiaSelectWithDeafult("#addStudentIsDxpy", row.dxpy);
	stuffManiaSelectWithDeafult("#addStudentIsPoorFamily", row.pkjt);
	$("#addStudentjtzz").val(row.jtzz);
	$("#addStudentzjxy").val(row.zjxy);
	$("#addStudentbz").val(row.bz);
	stuffCanChooseClass(row.pycc,row.szxb,row.nj,row.zybm,row.edu300_ID);
	stuffRelationSelect("#addStudentpycc","#addStudentxb","#addStudentnj","#addStudentzy",row.pycc,row.szxb,row.nj,row.zybm);
}

//填充可选行政班
function stuffCanChooseClass(pycc,szxb,nj,zybm,edu300_ID){
	var culturePlanObject=new Object();
	culturePlanObject.level=pycc;
	culturePlanObject.department=szxb;
	culturePlanObject.grade=nj;
	culturePlanObject.major=zybm;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryCulturePlanAdministrationClasses",
		data: {
			"culturePlanInfo":JSON.stringify(culturePlanObject)
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
			if (backjson.result) {
				//层次
				var str = '';
				var classesInfo=backjson.classesInfo;
				if (backjson.classesInfo.length===0) {
					str = '<option value="seleceConfigTip">暂无选择</option>';
					toastr.warning('暂无班级');
				}else{
					for (var i = 0; i < classesInfo.length; i++) {
						if(classesInfo[i].edu300_ID===parseInt(edu300_ID)){
							str += '<option value="' + classesInfo[i].edu300_ID + '">' + classesInfo[i].xzbmc
								+ '</option>';
						}
					}
					for (var i = 0; i < classesInfo.length; i++) {
						if(classesInfo[i].edu300_ID!==parseInt(edu300_ID)){
							str += '<option value="' + classesInfo[i].edu300_ID + '">' + classesInfo[i].xzbmc
								+ '</option>';
						}
					}
				}
				stuffManiaSelect("#addStudentxzb", str);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//清空学生信息模态框
function emptyStudentBaseInfoArea() {
	var reObject = new Object();
	reObject.fristSelectId ="#addStudentpycc";
	reObject.actionSelectIds ="#addStudentxb,#addStudentnj,#addStudentzy,#addStudentxzb";
	reObject.InputIds = "#addStudentName,#addStudentUsedName,#dateOfBrith,#addStudentStatusNum,#addStudentStatusNum,#addStudentksh,#addStudentrxzf,#enterSchoolDate,#addStudentbyzh,#addStudentzkzh,#addStudentphoneNum,#addStudentemail,#addStudentjk,#addStudentzhiye,#addStudentsg,#addStudenttz,#addStudentjtzz,#addStudentzjxy,#addStudentbz";
	reObject.normalSelectIds = "#addStudentSex,#addStudentStatus,#addStudentNation,#addStudentIsHaveStatus,#addStudentzzmm,#addStudentwhcd,#addStudentIsMarried,#addStudentType,#addStudentzsfs,#addStudentIsDxpy,#addStudentIsPoorFamily";
	reReloadSearchsWithSelect(reObject);
}

//得到检索对象
function getSearchStudentObject(){
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

	var searchObject = new Object();
	level !== ""?searchObject.level = level:searchObject.level = "";
	department !== ""?searchObject.department = department:searchObject.department = "";
	grade !== ""?searchObject.grade = grade:searchObject.grade = "";
	major !== ""?searchObject.major = major:searchObject.major = "";
	administrationClass !== ""?searchObject.administrationClass = administrationClass:searchObject.administrationClass = "";
	status !== ""?searchObject.status = status:searchObject.status = "";
	studentNumber !== ""?searchObject.studentNumber = studentNumber:searchObject.studentNumber = "";
	studentName !== ""?searchObject.studentName = studentName:searchObject.studentName = "";
	studentRollNumber !== ""?searchObject.studentRollNumber = studentRollNumber:searchObject.studentRollNumber = "";
	className !== ""?searchObject.className = className:searchObject.className = "";
	searchObject.userId =$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	return searchObject;
}

//开始检索
function startSearch() {
	getStudentInfo();
}

//必选检索条件检查
function getNotNullSearchs() {
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");
	var levelText = getNormalSelectText("level");
	var departmentText = getNormalSelectText("department");
	var gradeText =getNormalSelectText("grade");
	var majorText =getNormalSelectText("major");
	
	var returnObject = new Object();
	returnObject.level = levelValue;
	returnObject.department = departmentValue;
	returnObject.grade = gradeValue;
	returnObject.major = majorValue;
	returnObject.levelTxt = levelText;
	returnObject.departmentTxt = departmentText;
	returnObject.gradeTxt = gradeText;
	returnObject.majorTxt = majorText;
	return returnObject;
}

//重置检索
function researchStudents(){
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.actionSelectIds = "#department,#grade,#major";
	reObject.normalSelectIds = "#administrationClass,#status,#testWay,#coursesSemester";
	reObject.InputIds = "#studentNumber,#studentName,#studentRollNumber,#className";
	reReloadSearchsWithSelect(reObject);
	getStudentInfo();
}

//全院学生报表数据
function downloadAll(){
	var $eleForm = $("<form method='get'></form>");
	$eleForm.attr("action", "/studentReport"); //下载文件接口
	$(document.body).append($eleForm);
	//提交表单，实现下载
	$eleForm.submit();
}

//分院学生报表数据
function downloadSome(){
	var xb=getNormalSelectValue('department');
	if(xb===''){
		toastr.warning('请选择二级学院');
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentCollegeReportCheck",
		data: {
			"xbbm":xb
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
				var url = "/studentCollegeReport";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "xbbm").attr("value",xb));
				form.appendTo('body').submit().remove();
				toastr.info('文件下载中，请稍后...');
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
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
	$('#researchStudents').unbind('click');
	$('#researchStudents').bind('click', function(e) {
		researchStudents();
		e.stopPropagation();
	});

	//全院学生报表数据
	$('#downloadAll').unbind('click');
	$('#downloadAll').bind('click', function(e) {
		downloadAll();
		e.stopPropagation();
	});

	//分院学生报表数据
	$('#downloadSome').unbind('click');
	$('#downloadSome').bind('click', function(e) {
		downloadSome();
		e.stopPropagation();
	});
}


var EJDMElementInfo;
var choosendStudent=new Array();
$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getMajorTrainingSelectInfo();
	btnControl();
	binBind();
	getStudentInfo();
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
						$("#studentBaseInfoTable").bootstrapTable("removeAll");
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

//填充空的学生表
function drawStudentBaseInfoEmptyTable() {
	stuffStudentBaseInfoTable({});
}

//渲染学生表
function stuffStudentBaseInfoTable(tableInfo) {
	window.releaseNewsEvents = {
		'click #studentDetails': function(e, value, row, index) {
			studentDetails(row,index);
		},
		'click #modifyStudent': function(e, value, row, index) {
			modifyStudent(row,index);
		},
		'click #removeStudent': function(e, value, row, index) {
			removeStudent(row);
		}
	};

	var oTableInit = new Object();
	oTableInit.Init = function () {
		$('#studentBaseInfoTable').bootstrapTable('destroy').bootstrapTable({
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
				drawPagination(".studentBaseInfoTableArea", "学生信息","serverPage",1);
				drawSearchInput(".studentBaseInfoTableArea");
				changeTableNoRsTip();
				changeColumnsStyle( ".studentBaseInfoTableArea", "学生信息","serverPage");
				toolTipUp(".myTooltip");
				btnControl();

				//勾选已选数据
				for (var i = 0; i < choosendStudent.length; i++) {
					$("#studentBaseInfoTable").bootstrapTable("checkBy", {field:"edu001_ID", values:[choosendStudent[i].edu001_ID]})
				}

				// //解决点击排序表内检索框自动增加的问题
				// var allsearchIcons=$(".studentBaseInfoTableArea").find(".searchIcon");
				// var searchIconDom=$(".studentBaseInfoTableArea").find(".searchIcon:eq(0)")[0].outerHTML;
				// if(allsearchIcons.length>1){
				// 	$(".studentBaseInfoTableArea").find(".searchIcon").remove();
				// }
				// $(".studentBaseInfoTableArea").find(".search").prepend(searchIconDom);
			},
			onPageChange: function() {
				drawPagination(".studentBaseInfoTableArea", "学生信息","serverPage",1);
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
				}, {
					field: 'sfzh',
					title: '身份证号',
					align: 'left',
					sortable: true,
					formatter: paramsMatter,
					visible: false
				}, {
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
				'<li id="modifyStudent" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
				'<li id="removeStudent" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
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
	$("#addStudentModal").find(".moadalTitle").html(row.xm+"-详细信息");
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
	$("#addStudentIDNum").val(row.sfzh);
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

//填充可选行政阿布呢
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

//修改学生信息
function modifyStudent(row,index){
	if(row.ztCode==='007'){
		toastr.warning('此学生暂不可操作');
		return;
	}
	$.showModal("#addStudentModal",true);
	$("#addStudentModal").find(".moadalTitle").html(row.xm+"-详细信息");
	$(".XhArea").hide();
	//清空模态框中元素原始值
	emptyStudentBaseInfoArea();
	$(".addStudentTip").show();
	drawCalenr("#dateOfBrith");
	drawCalenr("#enterSchoolDate");
	stuffStudentDetails(row);
	//为模态框联动select绑定事件
	LinkageSelectPublic("#addStudentpycc","#addStudentxb","#addStudentnj","#addStudentzy",row.pycc);
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
	//修改学生确认按钮
	$('.confirmBtn').unbind('click');
	$('.confirmBtn').bind('click', function(e) {
		var modifyStudentInfo=getAddStudentInfo();
		if(typeof modifyStudentInfo ==='undefined'){
			return;
		}
		remindModifyStudent(row);
		e.stopPropagation();
	});
}

//提醒修改学生
function remindModifyStudent(row){
	$.hideModal("#addStudentModal",false);
	$.showModal("#remindModal",true);
	$(".remindType").html(row.xm);
	$(".remindActionType").html("修改");
	
	//确认修改学生
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmModifyStudent(row);
		e.stopPropagation();
	});
	
	//取消修改学生
	$("#remindModal").find(".cancel").unbind('click');
	$("#remindModal").find(".cancel").bind('click', function(e) {
		$.hideModal("#remindModal",false);
		$.showModal("#addStudentModal",true);
		$('.cancelTipBtn,.cancel').unbind('click');
		$('.cancelTipBtn,.cancel').bind('click', function(e) {
			$.hideModal();
			e.stopPropagation();
		});
		e.stopPropagation();
	});
}

//确认修改学生
function confirmModifyStudent(row){
	var modifyStudentInfo=getAddStudentInfo();
	if(typeof modifyStudentInfo ==='undefined'){
		return;
	}
	modifyStudentInfo.edu001_ID=row.edu001_ID;
	modifyStudentInfo.xh=row.xh;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyStudent",
		data: {
             "updateinfo":JSON.stringify(modifyStudentInfo),
			 "approvalobect":JSON.stringify(getApprovalobect())
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
				$.hideModal("#remindModal",false);
				$("#studentBaseInfoTable").bootstrapTable("updateByUniqueId", {id: row.edu001_ID, row: backjson.data});
				$.hideModal("#addStudentModal");
				toastr.success(backjson.msg);
				toolTipUp(".myTooltip");
			} else {
				$.hideModal("#remindModal");
				toastr.warning(backjson.msg);
			}
		}
	});
}

//单个删除学生
function removeStudent(row) {
	if(row.ztCode==='007'){
		toastr.warning('此学生暂不可操作');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html('- '+row.xm+' ');
	$(".remindActionType").html("删除");
	
	//确认删除学生
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		var removeObject = new Object;
		removeObject.studentId=row.edu001_ID;
		removeObject.edu300_ID=row.edu300_ID;
		removeArray.push(removeObject);
		sendStudentRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//多选删除学生
function removeStudents() {
	var chosenStudents = choosendStudent;
	for (var i = 0; i < chosenStudents.length; i++) {
		if(chosenStudents[i].ztCode==="007"){
			toastr.warning('有学生暂不可进行此操作');
			return;
		}
	}

	if (chosenStudents.length === 0) {
		toastr.warning('暂未选择任何数据');
	} else {
		$.showModal("#remindModal",true);
		$(".remindType").html("所选学生");
		$(".remindActionType").html("删除");
		
		//确认删除学生
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			var removeArray = new Array;
			for (var i = 0; i < chosenStudents.length; i++) {
				var removeObject = new Object;
				removeObject.studentId=chosenStudents[i].edu001_ID;
				removeObject.edu300_ID=chosenStudents[i].edu300_ID;
				removeArray.push(removeObject);
			}
			sendStudentRemoveInfo(removeArray);
			e.stopPropagation();
		});
	}
}

//发送删除学生请求
function sendStudentRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeStudents",
		data: {
             "removeInfo":JSON.stringify(removeArray) 
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
				for (var i = 0; i < removeArray.length; i++) {
					$("#studentBaseInfoTable").bootstrapTable('removeByUniqueId', removeArray[i].studentId);
				}
				drawPagination(".studentBaseInfoTableArea", "学生信息","serverPage",1);
				$(".myTooltip").tooltipify();
				$.hideModal("#remindModal");
				toastr.success(backjson.msg);
			} else {
				$.hideModal("#remindModal");
				toastr.warning(backjson.msg);
			}
		}
	});
}

//预备新增学生
function wantAddStudent() {
	//显示模态框
	$.showModal("#addStudentModal",true);
	$("#addStudentModal").find(".moadalTitle").html("新增学生");
	$(".XhArea").hide();
	//清空模态框中元素原始值
	emptyStudentBaseInfoArea();
	//为模态框联动select绑定事件
	LinkageSelectPublic("#addStudentpycc","#addStudentxb","#addStudentnj","#addStudentzy");
	//填充日期选择器
	drawCalenr("#dateOfBrith");
	drawCalenr("#enterSchoolDate");
	//专业seclect联动事件
	$("#addStudentzy").change(function() {
		var addStudentQueryObject=new Object();
		addStudentQueryObject.level=getNormalSelectValue("addStudentpycc");
		addStudentQueryObject.department=getNormalSelectValue("addStudentxb");
		addStudentQueryObject.grade=getNormalSelectValue("addStudentnj");
		addStudentQueryObject.major=getNormalSelectValue("addStudentzy");
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryCulturePlanStudent",
			data: {
	             "culturePlanInfo":JSON.stringify(addStudentQueryObject) 
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
					if (backjson.classInfo.length===0) {
						toastr.warning('暂无班级信息');
					}else{
						var str = '<option value="seleceConfigTip">请选择</option>';
						for (var i = 0; i < backjson.classInfo.length; i++) {
							str += '<option value="' + backjson.classInfo[i].edu300_ID + '">' + backjson.classInfo[i].xzbmc
									+ '</option>';
						}
						stuffManiaSelect("#addStudentxzb", str);
					}
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
	//确认新增学生
	$('.confirmBtn').unbind('click');
	$('.confirmBtn').bind('click', function(e) {
		confirmAddStudent();
		e.stopPropagation();
	});
}

//确认新增学生
function confirmAddStudent(){
	var addStudentInfo=getAddStudentInfo();
	if(typeof addStudentInfo ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addStudent",
		data: {
             "addInfo":JSON.stringify(addStudentInfo) 
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
				$('#studentBaseInfoTable').bootstrapTable("prepend", backjson.data);
				$(".myTooltip").tooltipify();
				$.hideModal("#addStudentModal");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取新增学生的信息
function getAddStudentInfo(){
	var xm=$("#addStudentName").val();
	var zym=$("#addStudentUsedName").val();
	var xb= getNormalSelectValue("addStudentSex");
	var ztCode= getNormalSelectValue("addStudentStatus");
	var zt= getNormalSelectText("addStudentStatus");
	var csrq=$("#dateOfBrith").val();
	if(csrq!==""){
	 var nl= byage($("#dateOfBrith").val());
	}
	var pycc= getNormalSelectValue("addStudentpycc");
	var pyccmc= getNormalSelectText("addStudentpycc");
	var szxb= getNormalSelectValue("addStudentxb");
	var szxbmc= getNormalSelectText("addStudentxb");
	var nj= getNormalSelectValue("addStudentnj");
	var njmc= getNormalSelectText("addStudentnj");
	var zybm= getNormalSelectValue("addStudentzy");
	var zymc= getNormalSelectText("addStudentzy");
	var sylxbm= getNormalSelectValue("addStudentType");
	var xylx= getNormalSelectText("addStudentType");
	var Edu300_ID= getNormalSelectValue("addStudentxzb");
	var xzbname= getNormalSelectText("addStudentxzb");
	var sfzh=$("#addStudentIDNum").val();
	var mzbm= getNormalSelectValue("addStudentNation");
	var mz= getNormalSelectText("addStudentNation");
	var sfyxj= getNormalSelectValue("addStudentIsHaveStatus");
	var xjh=$("#addStudentStatusNum").val();
	var zzmmbm= getNormalSelectValue("addStudentzzmm");
	var zzmm= getNormalSelectText("addStudentzzmm");
	var syd=$("#addStudentsyd").val();
	var whcd= getNormalSelectText("addStudentwhcd");
	var whcdbm= getNormalSelectValue("addStudentwhcd");
	var ksh=$("#addStudentksh").val();
	var rxzf=$("#addStudentrxzf").val();
	var rxsj=$("#enterSchoolDate").val();
	var byzh=$("#addStudentbyzh").val();
	var zkzh=$("#addStudentzkzh").val();
	var sjhm=$("#addStudentphoneNum").val();
	var email=$("#addStudentemail").val();
	var jg=$("#addStudentjk").val();
	var zy=$("#addStudentzhiye").val();
	var sg=$("#addStudentsg").val();
	var tz=$("#addStudenttz").val();
	var hf= getNormalSelectValue("addStudentIsMarried");
	var zsfs= getNormalSelectText("addStudentzsfs");
	var zsfscode= getNormalSelectValue("addStudentzsfs");
	var dxpy= getNormalSelectValue("addStudentIsDxpy");
	var pkjt= getNormalSelectValue("addStudentIsPoorFamily");
	var jtzz=$("#addStudentjtzz").val();
	var zjxy=$("#addStudentzjxy").val();
	var bz=$("#addStudentbz").val();

	if(xm===""){
		toastr.warning('姓名不能为空');
		return;
	}
	if(sylxbm===""){
		toastr.warning('生源类型不能为空');
		return;
	}
	
	if(xb===""){
		toastr.warning('性别不能为空');
		return;
	}
	
	if(ztCode===""){
		toastr.warning('状态不能为空');
		return;
	}
	
	if(csrq===""){
		toastr.warning('出生日期不能为空');
		return;
	}
	
	if(nl<=0){
		toastr.warning('出生日期异常');
		return;
	}
	
	if(pycc===""){
		toastr.warning('层次不能为空');
		return;
	}
	
	if(szxb===""){
		toastr.warning('二级学院不能为空');
		return;
	}
	
	if(nj===""){
		toastr.warning('年级不能为空');
		return;
	}
	
	if(zybm===""){
		toastr.warning('专业不能为空');
		return;
	}
	
	if(Edu300_ID===""){
		toastr.warning('班级不能为空');
		return;
	}
	
	if(sfzh===""){
		toastr.warning('身份证号不能为空');
		return;
	}
	
	if(mzbm===""){
		toastr.warning('民族不能为空');
		return;
	}
	
	if(!checkIsNumber(rxzf) && rxzf!==""){
		toastr.warning('入学总分必须是数字');
		return;
	}
	
//	if(rxsj===""){
//		toastr.warning('入学时间不能为空');
//		return;
//	}
	
	if(!isCardNo(sfzh)&&sfzh!==""){
		toastr.warning('身份证号格式不正确');
		return;
	}
	
	if(!phoneRex(sjhm)&&sjhm!==""){
		toastr.warning('手机号码格式不正确');
		return;
	}
	
	if(emailRex(email)){
		toastr.warning('E-mail格式不正确');
		return;
	}
	
	if(!checkIsNumber(sg) && sg!==""){
		toastr.warning('身高必须是数字');
		return;
	}
	
	if(!checkIsNumber(tz) && tz!==""){
		toastr.warning('体重必须是数字');
		return;
	}
	
	if(sfyxj==="T" && xjh===""){
		toastr.warning('学籍号不能为空');
		return;
	}
	
	if(sfyxj==="F" && xjh!==""){
		toastr.warning('学籍号必须为空');
		return;
	}
	
	var returnObject=new Object();
//	returnObject.xh=xh;
	returnObject.xm=xm;
	returnObject.zym=zym;
	returnObject.xb=xb;
	returnObject.ztCode=ztCode;
	returnObject.zt=zt;
	returnObject.csrq=csrq;
	returnObject.nl=nl;
	returnObject.pycc=pycc;
	returnObject.pyccmc=pyccmc;
	returnObject.szxb=szxb;
	returnObject.szxbmc=szxbmc;
	returnObject.nj=nj;
	returnObject.njmc=njmc;
	returnObject.zybm=zybm;
	returnObject.zymc=zymc;
	returnObject.edu300_ID=Edu300_ID;
	returnObject.xzbname=xzbname;
	returnObject.sfzh=sfzh;
	returnObject.mzbm=mzbm;
	returnObject.mz=mz;
	returnObject.xjh=xjh;
	xjh===""||xjh==="F"?returnObject.sfyxj="F":returnObject.sfyxj="T";
	returnObject.zzmmbm=zzmmbm;
	returnObject.zzmm=zzmm;
	returnObject.syd=syd;
	returnObject.whcd=whcd;
	returnObject.whcdbm=whcdbm;
	returnObject.ksh=ksh;
	returnObject.rxzf=rxzf;
	returnObject.rxsj=rxsj;
	returnObject.byzh=byzh;
	returnObject.zkzh=zkzh;
	returnObject.sjhm=sjhm;
	returnObject.email=email;
	returnObject.jg=jg;
	returnObject.zy=zy;
	returnObject.sg=sg;
	returnObject.tz=tz;
	returnObject.hf=hf;
	returnObject.zsfs=zsfs;
	returnObject.zsfscode=zsfscode;
	returnObject.dxpy=dxpy;
	returnObject.pkjt=pkjt;
	returnObject.jtzz=jtzz;
	returnObject.zjxy=zjxy;
	returnObject.bz=bz;
	returnObject.sylx=xylx;
	returnObject.sylxbm=sylxbm;
	return returnObject;
}

//预备导入学生
function importStudentInfo() {
	$.showModal("#importStudentInfoModal",true);
	$("#studentInfoFile,#showFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#studentInfoFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#studentInfoFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#studentInfoFile").val("");
			return
		}
		$("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	//下载导入模板
	$('#loadStudentInfoModel').unbind('click');
	$('#loadStudentInfoModel').bind('click', function(e) {
		loadStudentInfoModel();
		e.stopPropagation();
	});
}

//预备批量更新学生
function modifyStudents(){
	var choosendStudents = choosendStudent;
	if(choosendStudents.length===0){
		toastr.warning('暂未选择学生');
		return;
	}
	for (var i = 0; i < choosendStudents.length; i++) {
		if(choosendStudents[i].zt==="007"){
			toastr.warning('有学生暂不可进行此操作');
			return;
		}
	}
	$.showModal("#modifyStudentsModal",true);
	$("#ModifyStudentsFile,#showModifyFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#ModifyStudentsFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#ModifyStudentsFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#ModifyStudentsFile").val("");
			return
		}
		$("#showModifyFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	
	//下载更新模板
	$('#loadModifyStudentsModal').unbind('click');
	$('#loadModifyStudentsModal').bind('click', function(e) {
		loadModifyStudentsModal(choosendStudents);
		e.stopPropagation();
	});
}

//预备批量发放毕业证
function graduationStudents(){
	var choosendStudents = choosendStudent;
	for (var i = 0; i < choosendStudents.length; i++) {
		if(choosendStudents[i].zt==="007"){
			toastr.warning('有学生暂不可进行此操作');
			return;
		}
	}
	if(choosendStudents.length===0){
		toastr.warning('暂未选择学生');
		return;
	}else{
		var choosendStudentArray=new Array();
		for (var i = 0; i < choosendStudents.length; i++) {
			choosendStudentArray.push(choosendStudents[i].edu001_ID);
		}
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("已选学生");
	$(".remindActionType").html("毕业证发放");
	
	//确认发放毕业证按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmGraduationStudents(choosendStudentArray);
		e.stopPropagation();
	});
}

//检验导入学生文件
function checkStudentInfoFile() {
	if ($("#studentInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}

    var formData = new FormData();
    formData.append("file",$('#studentInfoFile')[0].files[0]);

    $.ajax({
        url:'/verifiyImportStudentFile',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
        	if(backjosn.result){
        		$(".fileLoadingArea").hide();
        		if(!backjosn.isExcel){
        			showImportErrorInfo("#importStudentInfoModal","请上传xls或xlsx类型的文件");
        		   return
        		}
        		if(!backjosn.sheetCountPass){
        			showImportErrorInfo("#importStudentInfoModal","上传文件的标签页个数不正确");
        		   return
        		}
        		if(!backjosn.modalPass){
        			showImportErrorInfo("#importStudentInfoModal","模板格式与原始模板不对应");
        		   return
        		}
        		if(!backjosn.haveData){
        			showImportErrorInfo("#importStudentInfoModal","文件暂无数据");
        		   return
        		}
        		if(!backjosn.dataCheck){
        			showImportErrorInfo("#importStudentInfoModal",backjosn.checkTxt);
        		   return
        		}
        		
        		showImportSuccessInfo("#importStudentInfoModal",backjosn.checkTxt);
        	}else{
        	  toastr.warning('操作失败，请重试');
        	}
        },beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
    });
}

//检验修改学生文件
function checkModifyStudentsFile(){
	if ($("#ModifyStudentsFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	
	var formData = new FormData();
	formData.append("file",$('#ModifyStudentsFile')[0].files[0]);
	
    $.ajax({
        url:'/verifiyModifyStudentFile',
        dataType:'json',
        type:'POST',
        async: true,
        data: formData,
        processData : false, // 使数据不做处理
        contentType : false, // 不要设置Content-Type请求头
        success: function(backjosn){
        	if(backjosn.result){
        		$(".fileLoadingArea").hide();
        		if(!backjosn.isExcel){
        			showImportErrorInfo("#modifyStudentsModal","请上传xls或xlsx类型的文件");
        		   return
        		}
        		if(!backjosn.sheetCountPass){
        			showImportErrorInfo("#modifyStudentsModal","上传文件的标签页个数不正确");
        		   return
        		}
        		if(!backjosn.modalPass){
        			showImportErrorInfo("#modifyStudentsModal","模板格式与原始模板不对应");
        		   return
        		}
        		if(!backjosn.haveData){
        			showImportErrorInfo("#modifyStudentsModal","文件暂无数据");
        		   return
        		}
        		if(!backjosn.dataCheck){
        			showImportErrorInfo("#modifyStudentsModal",backjosn.checkTxt);
        		   return
        		}
        		
        		showImportSuccessInfo("#modifyStudentsModal",backjosn.checkTxt);
        	}else{
        	  toastr.warning('操作失败，请重试');
        	}
        },beforeSend: function(xhr) {
			$(".fileLoadingArea").show();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
    });
}

//确认提交导入学生文件
function confirmImportStudentInfo() {
		if ($("#studentInfoFile").val() === "") {
			toastr.warning('请选择文件');
			return;
		}
	
	    var formData = new FormData();
	    formData.append("file",$('#studentInfoFile')[0].files[0]);

	    $.ajax({
	        url:'/importStudent',
	        dataType:'json',
	        type:'POST',
	        async: true,
	        data: formData,
	        processData : false, // 使数据不做处理
	        contentType : false, // 不要设置Content-Type请求头
	        success: function(backjosn){
				$(".fileLoadingArea").hide();
	        	if(backjosn.code===200){
					var importStudents=backjosn.data;
					for (var i = 0; i <importStudents.length; i++) {
						$('#studentBaseInfoTable').bootstrapTable("prepend", importStudents[i]);
					}
					toastr.success(backjosn.msg);
					toolTipUp(".myTooltip");
					$.hideModal("#importStudentInfoModal");
				}else{
					if(!backjosn.data.isExcel){
						showImportErrorInfo("#importStudentInfoModal","请上传xls或xlsx类型的文件");
						return
					}
					if(!backjosn.data.sheetCountPass){
						showImportErrorInfo("#importStudentInfoModal","上传文件的标签页个数不正确");
						return
					}
					if(!backjosn.data.modalPass){
						showImportErrorInfo("#importStudentInfoModal","模板格式与原始模板不对应");
						return
					}
					if(!backjosn.data.haveData){
						showImportErrorInfo("#importStudentInfoModal","文件暂无数据");
						return
					}
					if(!backjosn.data.dataCheck){
						showImportErrorInfo("#importStudentInfoModal",backjosn.data.checkTxt);
						return
					}
				}
	        },beforeSend: function(xhr) {
	           $(".fileLoadingArea").show();
			},
			error: function(textStatus) {
				requestError();
			},
			complete: function(xhr, status) {
				requestComplete();
			},
	    });
}

//确认提交修改学生文件
function confirmModifyStudentInfo() {
		if ($("#ModifyStudentsFile").val() === "") {
			toastr.warning('请选择文件');
			return;
		}
	
	    var formData = new FormData();
	    formData.append("file",$('#ModifyStudentsFile')[0].files[0]);
	    formData.append("approvalInfo",JSON.stringify(getApprovalobect()));

	    $.ajax({
	        url:'/modifyStudents',
	        dataType:'json',
	        type:'POST',
	        async: true,
	        data: formData,
	        processData : false, // 使数据不做处理
	        contentType : false, // 不要设置Content-Type请求头
	        success: function(backjosn){
				$(".fileLoadingArea").hide();
				if(backjosn.code===200){
					var choosendStudents = backjosn.data;
					for (var i = 0; i < choosendStudents.length; i++) {
						$("#studentBaseInfoTable").bootstrapTable("updateByUniqueId", {id: choosendStudents[i].edu001_ID, row: choosendStudents[i]});
					}
					toastr.success(backjosn.msg);
					$.hideModal("#modifyStudentsModal");
					toolTipUp(".myTooltip");
				}else{
					if(!backjosn.data.isExcel){
						showImportErrorInfo("#modifyStudentsModal","请上传xls或xlsx类型的文件");
						return
					}
					if(!backjosn.data.sheetCountPass){
						showImportErrorInfo("#modifyStudentsModal","上传文件的标签页个数不正确");
						return
					}
					if(!backjosn.data.modalPass){
						showImportErrorInfo("#modifyStudentsModal","模板格式与原始模板不对应");
						return
					}
					if(!backjosn.data.haveData){
						showImportErrorInfo("#modifyStudentsModal","文件暂无数据");
						return
					}
					if(!backjosn.data.dataCheck){
						showImportErrorInfo("#modifyStudentsModal",backjosn.data.checkTxt);
						return
					}
				}
	        },beforeSend: function(xhr) {
	           $(".fileLoadingArea").show();
			},
			error: function(textStatus) {
				requestError();
			},
			complete: function(xhr, status) {
				requestComplete();
			},
	    });
}

//清空学生信息模态框
function emptyStudentBaseInfoArea() {
	var reObject = new Object();
	reObject.fristSelectId ="#addStudentpycc";
	reObject.actionSelectIds ="#addStudentxb,#addStudentnj,#addStudentzy,#addStudentxzb";
	reObject.InputIds = "#addStudentName,#addStudentUsedName,#dateOfBrith,#addStudentIDNum,#addStudentStatusNum,#addStudentStatusNum,#addStudentksh,#addStudentrxzf,#enterSchoolDate,#addStudentbyzh,#addStudentzkzh,#addStudentphoneNum,#addStudentemail,#addStudentjk,#addStudentzhiye,#addStudentsg,#addStudenttz,#addStudentjtzz,#addStudentzjxy,#addStudentbz";
	reObject.normalSelectIds = "#addStudentSex,#addStudentStatus,#addStudentNation,#addStudentIsHaveStatus,#addStudentzzmm,#addStudentwhcd,#addStudentIsMarried,#addStudentType,#addStudentzsfs,#addStudentIsDxpy,#addStudentIsPoorFamily";
	reReloadSearchsWithSelect(reObject);
}

//下载学生信息模板
function loadStudentInfoModel() {
	var $eleForm = $("<form method='get'></form>");
	$eleForm.attr("action", "/downloadStudentModal"); //下载文件接口
	$(document.body).append($eleForm);
	//提交表单，实现下载
	$eleForm.submit();
}

//下载更新模板
function loadModifyStudentsModal(choosendStudents){
	var choosendStudentsId=new Array();
	for (var i = 0; i < choosendStudents.length; i++) {
		choosendStudentsId.push(choosendStudents[i].edu001_ID);
	}

	 var url = "/downloadModifyStudentsModal";
     var modifyStudentIDs = JSON.stringify(choosendStudentsId) ;
     var form = $("<form></form>").attr("action", url).attr("method", "post");
     form.append($("<input></input>").attr("type", "hidden").attr("name", "modifyStudentIDs").attr("value", modifyStudentIDs));
     form.appendTo('body').submit().remove();

}

//确认发放毕业证
function confirmGraduationStudents(choosendStudents){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/graduationStudents",
		data: {
             "choosendStudents":JSON.stringify(choosendStudents) 
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
				var choosendStudents = choosendStudent;
				for (var i = 0; i < choosendStudents.length; i++) {
					choosendStudents[i].zt="毕业";
					choosendStudents[i].ztCode="graduation";
					$("#studentBaseInfoTable").bootstrapTable("updateByUniqueId", {id: choosendStudents[i].edu001_ID, row: choosendStudents[i]});
				}
				toastr.success(backjson.msg);
				 $.hideModal("#remindModal");
				 toolTipUp(".myTooltip");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
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

//学生审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="05";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
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
		$.hideModal();
		e.stopPropagation();
	});

	//批量删除学生
	$('#removeStudents').unbind('click');
	$('#removeStudents').bind('click', function(e) {
		removeStudents();
		e.stopPropagation();
	});

	//导入学生
	$('#importStudentInfo').unbind('click');
	$('#importStudentInfo').bind('click', function(e) {
		importStudentInfo();
		e.stopPropagation();
	});
	
	//批量更新学生
	$('#modifyStudents').unbind('click');
	$('#modifyStudents').bind('click', function(e) {
		modifyStudents();
		e.stopPropagation();
	});
	
	//批量发放毕业证
	$('#graduationStudents').unbind('click');
	$('#graduationStudents').bind('click', function(e) {
		graduationStudents();
		e.stopPropagation();
	});
	
	//检验学生文件
	$('#checkStudentInfoFile').unbind('click');
	$('#checkStudentInfoFile').bind('click', function(e) {
		checkStudentInfoFile();
		e.stopPropagation();
	});
	
	//检验修改学生文件
	$('#checkModifyStudentsFile').unbind('click');
	$('#checkModifyStudentsFile').bind('click', function(e) {
		checkModifyStudentsFile();
		e.stopPropagation();
	});

	//确认导入学生
	$('.confirmImportStudentInfo').unbind('click');
	$('.confirmImportStudentInfo').bind('click', function(e) {
		confirmImportStudentInfo();
		e.stopPropagation();
	});
	
	//确认批量修改学生
	$('.confirmModifyStudents').unbind('click');
	$('.confirmModifyStudents').bind('click', function(e) {
		confirmModifyStudentInfo();
		e.stopPropagation();
	});
	
	//重置检索
	$('#researchStudents').unbind('click');
	$('#researchStudents').bind('click', function(e) {
		researchStudents();
		e.stopPropagation();
	});
}


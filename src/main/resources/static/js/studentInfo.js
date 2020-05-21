var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getMajorTrainingSelectInfo();
	drawStudentBaseInfoEmptyTable();
	binBind();
});

//获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
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
	
	$("#administrationClass").change(function() {
		var xzbCodeObject=new Object();
		xzbCodeObject.edu300_ID=getNormalSelectValue("administrationClass");
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryStudentInfoByAdministrationClass",
			data: {
	             "xzbCodeObject":JSON.stringify(xzbCodeObject) 
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
					if (backjson.studentInfo.length===0) {
						toastr.warning('暂无学生信息');
						$("#studentBaseInfoTable").bootstrapTable("removeAll"); 
						return;
					}
					stuffStudentBaseInfoTable(backjson.studentInfo);
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

	$('#studentBaseInfoTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
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
				field: 'edu001_ID',
				title: 'edu001_ID',
				align: 'center',
				visible: false
			},
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'pyccmc',
				title: '层次',
				align: 'left',
				formatter: paramsMatter

			}, {
				field: 'szxbmc',
				title: '系部',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'njmc',
				title: '年级',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'zymc',
				title: '专业名称',
				align: 'center',
				formatter: paramsMatter
			}, {
				field: 'xzbname',
				title: '行政班',
				align: 'left',
				formatter: xzbnameMatter
			}, {
				field: 'xh',
				title: '学号',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'xm',
				title: '姓名',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'xb',
				title: '性别',
				align: 'left',
				formatter: sexFormatter,
				visible: false
			}, {
				field: 'zt',
				title: '状态',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'sfyxj',
				title: '是否有学籍',
				align: 'left',
				formatter: isrollMatter
			},
			{
				field: 'zkzh',
				title: '准考证号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			},
			{
				field: 'ksh',
				title: '考生号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'sfzh',
				title: '身份证号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'xjh',
				title: '学籍号',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'zym',
				title: '曾用名',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'csrq',
				title: '出生日期',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'rxsj',
				title: '入学时间',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'mz',
				title: '民族',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'hf',
				title: '婚否',
				align: 'left',
				formatter: marriageMatter,
				visible: false
			}, {
				field: 'whcd',
				title: '文化程度',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'zzmm',
				title: '政治面貌',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'syd',
				title: '生源地',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'jtzz',
				title: '家庭住址',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'rxzf',
				title: '入学总分',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'bz',
				title: '备注',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'sjhm',
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
				field: 'jg',
				title: '籍贯',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'sg',
				title: '身高',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'tz',
				title: '体重',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'lzjd',
				title: '来自军队',
				align: 'left',
				formatter: isOrNotisMatter,
				visible: false
			}, {
				field: 'zsfs',
				title: '招生方式',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'dxpy',
				title: '是否订单',
				align: 'left',
				formatter: isOrNotisMatter,
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
	
	function xzbnameMatter(value, row, index) {
		if (value===""||value==null) {
			return [
					'<div class="myTooltip redTxt" title="行政班已删除">行政班已删除</div>'
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
	drawSearchInput(".studentBaseInfoTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".studentBaseInfoTableArea", "学生信息");
	toolTipUp(".myTooltip");
}

//展示学生详情
function studentDetails(row,index){
	$.showModal("#addStudentModal",false);
	$("#addStudentModal").find(".moadalTitle").html(row.xm+"-详细信息");
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
	stuffManiaSelectWithDeafult("#addStudentpycc", row.pycc,row.pyccmc);
	stuffManiaSelectWithDeafult("#addStudentxb", row.szxb,row.szxbmc);
	stuffManiaSelectWithDeafult("#addStudentnj", row.nj,row.njmc);
	stuffManiaSelectWithDeafult("#addStudentzy", row.zybm,row.zymc);
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
	stuffManiaSelectWithDeafult("#addStudentIsFromArmy", row.lzjd);
	stuffManiaSelectWithDeafult("#addStudentzsfs", row.zsfscode);
	stuffManiaSelectWithDeafult("#addStudentIsDxpy", row.dxpy);
	stuffManiaSelectWithDeafult("#addStudentIsPoorFamily", row.pkjt);
	$("#addStudentjtzz").val(row.jtzz);
	$("#addStudentzjxy").val(row.zjxy);
	$("#addStudentbz").val(row.bz);
}

//修改学生信息
function modifyStudent(row,index){
	$.showModal("#addStudentModal",true);
	$("#addStudentModal").find(".moadalTitle").html(row.xm+"-详细信息");
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
				if (backjson.result) {
					hideloding();
					if (backjson.classesInfo.length===0) {
						toastr.warning('暂无班级信息');
						return;
					}
					var str = '<option value="seleceConfigTip">请选择</option>';
					for (var i = 0; i < backjson.classesInfo.length; i++) {
						str += '<option value="' + backjson.classesInfo[i].edu300_ID + '">' + backjson.classesInfo[i].xzbmc
								+ '</option>';
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
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyStudent",
		data: {
             "updateinfo":JSON.stringify(modifyStudentInfo) 
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
				if (backjson.xhhave) {
					toastr.warning('学号已存在');
					return;
				}
				$("#studentBaseInfoTable").bootstrapTable("updateByUniqueId", {id: row.edu001_ID, row: modifyStudentInfo});
				toastr.success('修改成功');
				$.hideModal("#remindModal");
				toolTipUp(".myTooltip");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//单个删除学生
function removeStudent(row) {
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
	var chosenStudents = $('#studentBaseInfoTable').bootstrapTable('getAllSelections');
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
			if (backjson.result) {
				hideloding();
				for (var i = 0; i < removeArray.length; i++) {
					$("#studentBaseInfoTable").bootstrapTable('removeByUniqueId', removeArray[i].studentId);
				}
				drawPagination(".studentBaseInfoTableArea", "学生信息");
				$(".myTooltip").tooltipify();
				$.hideModal("#remindModal");
				toastr.success('删除成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备新增学生
function wantAddStudent() {
	//显示模态框
	$.showModal("#addStudentModal",true);
	$("#addStudentModal").find(".moadalTitle").html("新增学生");
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
			if (backjson.result) {
				hideloding();
				if (backjson.IDcardIshave) {
					toastr.warning('身份证号码已存在');
					return;
				}
				if (backjson.xhhave) {
					toastr.warning('学号已存在');
					return;
				}
				if (backjson.studentSpill) {
					toastr.warning('班级人数超过上限');
					return;
				}
				addStudentInfo.edu001_ID=backjson.id;
				$('#studentBaseInfoTable').bootstrapTable("prepend", addStudentInfo);
				$(".myTooltip").tooltipify();
				toastr.success('新增成功');
				$.hideModal("#addStudentModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取新增学生的信息
function getAddStudentInfo(){
	var xh=$("#addStudentNum").val();
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
	var lzjd= getNormalSelectValue("addStudentIsFromArmy");
	var zsfs= getNormalSelectText("addStudentzsfs");
	var zsfscode= getNormalSelectValue("addStudentzsfs");
	var dxpy= getNormalSelectValue("addStudentIsDxpy");
	var pkjt= getNormalSelectValue("addStudentIsPoorFamily");
	var jtzz=$("#addStudentjtzz").val();
	var zjxy=$("#addStudentzjxy").val();
	var bz=$("#addStudentbz").val();
	
	
	if(xh===""){
		toastr.warning('学号不能为空');
		return;
	}
	
	if(xm===""){
		toastr.warning('姓名不能为空');
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
		toastr.warning('系部不能为空');
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
	
	if(rxsj===""){
		toastr.warning('入学时间不能为空');
		return;
	}
	
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
	returnObject.xh=xh;
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
	returnObject.lzjd=lzjd;
	returnObject.zsfs=zsfs;
	returnObject.zsfscode=zsfscode;
	returnObject.dxpy=dxpy;
	returnObject.pkjt=pkjt;
	returnObject.jtzz=jtzz;
	returnObject.zjxy=zjxy;
	returnObject.bz=bz;
	return returnObject;
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
}

//下载学生信息模板
function loadStudentInfoModel() {
	var $eleForm = $("<form method='get'></form>");
	$eleForm.attr("action", "/downloadStudentModal"); //下载文件接口
	$(document.body).append($eleForm);
	//提交表单，实现下载
	$eleForm.submit();
}

//导入学生信息文件
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
}

//检验学生信息文件
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
        async: false,
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

//确认提交学生信息文件
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
	        async: false,
	        data: formData,
	        processData : false, // 使数据不做处理
	        contentType : false, // 不要设置Content-Type请求头
	        success: function(backjosn){
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
        		
        		var importStudents=backjosn.importStudent;
        		for (var i = 0; i <importStudents.length; i++) {
    				$('#studentBaseInfoTable').bootstrapTable("prepend", importStudents[i]);
        		}
				toastr.success('导入成功');
				$.hideModal("#importStudentInfoModal");
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
	reObject.InputIds = "#addStudentNum,#addStudentName,#addStudentUsedName,#dateOfBrith,#addStudentIDNum,#addStudentStatusNum,#addStudentStatusNum,#addStudentksh,#addStudentrxzf,#enterSchoolDate,#addStudentbyzh,#addStudentzkzh,#addStudentphoneNum,#addStudentemail,#addStudentjk,#addStudentzhiye,#addStudentsg,#addStudenttz,#addStudentjtzz,#addStudentzjxy,#addStudentbz";
	reObject.normalSelectIds = "#addStudentSex,#addStudentStatus,#addStudentNation,#addStudentIsHaveStatus,#addStudentzzmm,#addStudentwhcd,#addStudentIsMarried,#addStudentIsFromArmy,#addStudentzsfs,#addStudentIsDxpy,#addStudentIsPoorFamily";
	reReloadSearchsWithSelect(reObject);
}







//必选检索条件检查
function getNotNullSearchs() {
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");

	if (levelValue == "") {
		toastr.warning('层次不能为空');
		return;
	}

	if (departmentValue == "") {
		toastr.warning('系部不能为空');
		return;
	}

	if (gradeValue == "") {
		toastr.warning('年级不能为空');
		return;
	}

	if (majorValue == "") {
		toastr.warning('专业不能为空');
		return;
	}
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


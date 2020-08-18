//var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	getSearchAreaSelectInfo();
	drawTeacherBaseInfoEmptyTable();
	btnControl();
	binBind();
});

//获得检索区域下拉框数据
function getSearchAreaSelectInfo(){
		$.ajax({
			method : 'get',
			cache : false,
			url : "/getJwPublicCodes",
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
					var showstr="暂无选择";
					var allDepartmentStr=""; 
					var allMajorStr=""; 
					if (backjson.allDepartment.length>0) {
						showstr="请选择";
						allDepartmentStr= '<option value="seleceConfigTip">'+showstr+'</option>';
						for (var i = 0; i < backjson.allDepartment.length; i++) {
							allDepartmentStr += '<option value="' + backjson.allDepartment[i].edu104_ID + '">' + backjson.allDepartment[i].xbmc
									+ '</option>';
						}
					}else{
						allDepartmentStr= '<option value="seleceConfigTip">'+showstr+'</option>';
					}
					stuffManiaSelect("#department", allDepartmentStr);
					stuffManiaSelect("#addTeacherXb", allDepartmentStr);
					
					showstr="暂无选择"
					if (backjson.allMajor.length>0) {
						showstr="请选择";
						var allMajorStr = '<option value="seleceConfigTip">'+showstr+'</option>';
						for (var i = 0; i < backjson.allMajor.length; i++) {
							allMajorStr += '<option value="' + backjson.allMajor[i].edu106_ID + '">' + backjson.allMajor[i].zymc
									+ '</option>';
						}
					}else{
						allMajorStr= '<option value="seleceConfigTip">'+showstr+'</option>';
					}
					stuffManiaSelect("#major", allMajorStr);
					stuffManiaSelect("#addTeacherZY", allMajorStr);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
}

//填充空的教师表
function drawTeacherBaseInfoEmptyTable() {
	stuffTeacherBaseInfoTable({});
}

//渲染教师表
function stuffTeacherBaseInfoTable(tableInfo) {
	window.releaseNewsEvents = {
		'click #businessStart': function(e, value, row, index) {
			businessStart(row,index);
		}
	};

	$('#teacherBaseInfoTable').bootstrapTable('destroy').bootstrapTable({
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
		    fileName: '在职教职工导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",   
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".teacherBaseInfoTableArea", "教职工信息");
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},{
				field: 'edu112_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			 {
				field: 'szxbmc',
				title: '系部',
				align: 'left',
				formatter: szxbmcMatter
			}, {
				field: 'zymc',
				title: '专业',
				align: 'left',
				formatter: zymcMatter
			}, {
				field: 'jzglx',
				title: '教职工类型',
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
				formatter: sexFormatter
			},{
				field: 'jzgh',
				title: '教职工号',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'nl',
				title: '年龄',
				align: 'left',
				formatter: paramsMatter
			},{
				field: 'zc',
				title: '职称',
				align: 'left',
				formatter: paramsMatter
			},{
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
				'<li id="businessStart" class="insertBtn"><span><img src="images/t01.png"></span>安排出差</li>' +
				'</ul>'
			]
			.join('');
	}

	function szxbmcMatter(value, row, index) {
		if (value===""||value==null) {
			return [
					'<div class="myTooltip normalTxt" title="暂未分配系部">暂未分配系部</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip" title="'+value+'">'+value+'</div>'
				]
				.join('');
		}
	}

	function zymcMatter(value, row, index) {
		if (value===""||value==null) {
			return [
					'<div class="myTooltip normalTxt" title="暂未分配专业">暂未分配专业</div>'
				]
				.join('');
		} else {
			return [
					'<div class="myTooltip" title="'+value+'">'+value+'</div>'
				]
				.join('');
		}
	}
	

	drawPagination(".teacherBaseInfoTableArea", "教职工信息");
	drawSearchInput(".teacherBaseInfoTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".teacherBaseInfoTableArea", "教职工信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//预备单个教师安排出差
function businessStart(row,index){
	drawCalenr("#startTime",true);
	drawCalenr("#endTime",true);
	$.showModal("#startModal",true);
	emtypModal();
	var choosendArray=new Array();
	choosendArray.push(row);
	$('.confirmStartBtn').unbind('click');
	$('.confirmStartBtn').bind('click', function(e) {
		sendBusinessStart(choosendArray);
		e.stopPropagation();
	});
}

//预备多个教师安排出差
function businessStarts(row,index){
	var chosend = $('#teacherBaseInfoTable').bootstrapTable('getAllSelections');
	if(chosend.length===0){
		toastr.warning('暂未选择教职工');
		return;
	}
	drawCalenr("#startTime",true);
	drawCalenr("#endTime",true);
	$.showModal("#startModal",true);
	emtypModal();
	var choosendArray=new Array();
	for (var i = 0; i < chosend.length; i++) {
		choosendArray.push(chosend[i]);
	}
	$('.confirmStartBtn').unbind('click');
	$('.confirmStartBtn').bind('click', function(e) {
		sendBusinessStart(choosendArray);
		e.stopPropagation();
	});
}

//发送出差请求
function sendBusinessStart(choosend){
	var businessInfo=geBusinessStartInfo(choosend);
	if(typeof businessInfo ==='undefined'){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/addTeacherBusiness",
		data: {
			"businessInfo":JSON.stringify(businessInfo),
			"approvalInfo":JSON.stringify(getApprovalobect()),
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
			$.hideModal("#startModal");
			if (backjson.code===200) {
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得出差信息
function geBusinessStartInfo(choosend){
	var teacherIdArray=new Array();
	var teacherNameArray=new Array();
	for (var i = 0; i <choosend.length ; i++) {
		teacherIdArray.push(choosend[i].edu101_ID);
		teacherNameArray.push(choosend[i].xm);
	}
	var Edu990_ID=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	var userName=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
	var destination=$("#location").val();
	var startTime=$("#startTime").val();
	var endTime=$("#endTime").val();
	var businessExplain=$("#explain").val();

	if(startTime===""){
		toastr.warning('开始时间不能为空');
		return;
	}
	if(endTime===""){
		toastr.warning('结束时间不能为空');
		return;
	}
	if(destination===""){
		toastr.warning('出差地不能为空');
		return;
	}

	if(!checkTime(startTime,endTime)){
		toastr.warning("结束日期必须晚于开始日期");
		return;
	}

	var returnObject=new Object();
	returnObject.edu990_ID=Edu990_ID;
	returnObject.userName=userName;
	returnObject.destination=destination;
	returnObject.startTime=startTime;
	returnObject.endTime=endTime;
	returnObject.businessExplain=businessExplain;
	returnObject.endTime=endTime;
	returnObject.teacherId=teacherIdArray.toString();
	returnObject.teacherName=teacherNameArray.toString();
	return returnObject;
}

//清空出差信息模态框
function emtypModal(){
	$("#startTime").val("");
	$("#endTime").val("");
	$("#location").val("");
	$("#explain").val("");
}

//开始检索在职教师
function startSearch(){
	var searchObject = getSearchValue();
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeachersInService",
		dataType : 'json',
		data: {
			"searchInfo":JSON.stringify(searchObject)
		},
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
				stuffTeacherBaseInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawTeacherBaseInfoEmptyTable();
			}
		}
	});
}

//获得检索区域的值
function getSearchValue(){
	var departmentValue = getNormalSelectValue("department");
	var majorValue = getNormalSelectValue("major");
	var zcValue = getNormalSelectValue("teacherZc");
	
	var departmentText = getNormalSelectText("department");
	var majorText = getNormalSelectText("major");
	var zcText = getNormalSelectText("teacherZc");
	var name=$("#teacherName").val();
	var jzgh=$("#teacherJzgh").val();
	
	
	var returnObject = new Object();
	if(departmentValue!==""){
		returnObject.szxb = departmentValue;
		returnObject.szxbmc = departmentText;
	}
	
	if(majorValue!==""){
		returnObject.zy = majorValue;
		returnObject.zymc = majorText;
	}
	
	if(zcValue!==""){
		returnObject.zc = zcText;
		returnObject.zcbm = zcValue;
	}
	
	if(name!==""){
		returnObject.xm = name;
	}
	
	if(jzgh!==""){
		returnObject.jzgh = jzgh;
	}
	return returnObject;
}

//外聘教师审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="06";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//重置检索
function researchTeachers(){
	var reObject = new Object();
	reObject.InputIds = "#teacherName,#teacherJzgh";
	reObject.normalSelectIds = "#department,#major,#teacherZc";
	reReloadSearchsWithSelect(reObject);
	drawTeacherBaseInfoEmptyTable();
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

	//批量出差
	$('#businessStarts').unbind('click');
	$('#businessStarts').bind('click', function(e) {
		businessStarts();
		e.stopPropagation();
	});

	//重置检索
	$('#researchTeachers').unbind('click');
	$('#researchTeachers').bind('click', function(e) {
		researchTeachers();
		e.stopPropagation();
	});
}
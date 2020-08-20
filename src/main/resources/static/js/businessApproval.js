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


/*tab1 start*/
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
				field: 'edu101_ID',
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
				'<li id="businessStart" class="insertBtn"><span><img src="images/t01.png"></span>发起出差申请</li>' +
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

//审批流对象
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
/*tab1 end*/

/*tab2 start*/
//渲染tab2
function showTab2(){
    stuffRecordsEmptyTable();
    tab2BtnBind();
}

//填充空的出差记录表
function stuffRecordsEmptyTable(){
	stuffRecordsTable({});
}

//填充出差记录表
function stuffRecordsTable(tableInfo){
	window.recordsEvents = {
		'click #recordInfo': function(e, value, row, index) {
			recordInfo(row,index);
		},
		'click #modifyRecord': function(e, value, row, index) {
			modifyRecord(row,index);
		},
		'click #removeRecord': function(e, value, row, index) {
			removeRecord(row,index);
		}
	};

	$('#recordsTable').bootstrapTable('destroy').bootstrapTable({
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
			fileName: '出差记录导出'  //文件名称
		},
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".recordsTableArea", "出差记录");
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
				field: 'userName',
				title: '发起用户',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'destination',
				title: '目的地',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'startTime',
				title: '开始日期',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'endTime',
				title: '结束日期',
				align: 'left',
				formatter: paramsMatter
			},{
				field: 'businessExplain',
				title: '备注',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'businessState',
				title: '审批状态',
				align: 'left',
				formatter: approvalMatter
			},{
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: recordsFormatter,
				events: recordsEvents,
			}
		]
	});

	function recordsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="queryBtn" id="recordInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
		+ '<li class="modifyBtn" id="modifyRecord"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
		+ '<li class="deleteBtn" id="removeRecord"><span><img src="images/t03.png"></span>删除</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".recordsTableArea", "出差记录");
	drawSearchInput(".recordsTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".recordsTableArea", "出差记录");
	toolTipUp(".myTooltip");
	btnControl();
}

//重置检索出差记录
function reloadRecordsSearch(){
	var reObject = new Object();
	reObject.InputIds = "#records_startUserName,#records_TeacherName,#records_location";
	reObject.normalSelectIds = "#records_status";
	reReloadSearchsWithSelect(reObject);
	stuffRecordsEmptyTable();
}

//查看记录详情
function recordInfo(row,index){
	$.showModal("#recordsInfoModal",false);
	$(".reChooseTeacher").hide();
	stuffRecordInfo(row,true,"recordsImg2");
}

//修改记录
function modifyRecord(row,index){
	if(row.businessState==="passing"){
		toastr.warning('该记录暂不可进行此操作');
		return;
	}
	$.showModal("#recordsInfoModal",true);
	$(".reChooseTeacher").hide();
	stuffRecordInfo(row,false,"recordsImg1");
	//确认修改
	$('.confirmModifyBtn').unbind('click');
	$('.confirmModifyBtn').bind('click', function(e) {
		confirmModifyRecord(row);
		e.stopPropagation();
	});
}

//填充详情模态框内容
function stuffRecordInfo(row,unbind,imgName){
    $("#recordsInfo_startTime").val(row.startTime);
	$("#recordsInfo_endtTime").val(row.endTime);
	$("#recordsInfo_startUser").val(row.userName);
	$("#recordsInfo_location").val(row.destination);
	$("#recordsInfo_explain").val(row.businessExplain);
	$(".singleRecordsArea").empty();

	var Ids=row.teacherId.split(",");
	var names=row.teacherName.split(",")
	for (var i = 0; i < Ids.length; i++) {
		$(".singleRecordsArea").append('<div id="'+Ids[i]+'" class="col5 singleTeacher'+Ids[i]+' singleTeacher '+imgName+'">'+names[i]+'</div>');
	}

	if(unbind){
		$('#recordsInfoModal').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
		$('.singleRecordsArea').unbind('click');
		$(".reChooseTeacher").hide();
	}else{
		$(".reChooseTeacher").show();
		drawCalenr("#recordsInfo_startTime",true);
		drawCalenr("#recordsInfo_endtTime",true);
		$('#recordsInfoModal').find(".myInput").attr("disabled", false)
		$('.singleRecordsArea').unbind('click');
		$('.singleRecordsArea').bind('click', function(e) {
			removeSingleTeacher(e);
			e.stopPropagation();
		});
	}
}

//删除记录中的教职工
function removeSingleTeacher(eve){
	if($(".singleRecordsArea").find(".singleTeacher").length===1){
		toastr.warning('至少保留一名教职工');
		return;
	}
	var id=eve.currentTarget.firstChild.id;
	$(".singleRecordsArea").find(".singleTeacher"+id).remove();
}

var choosendTeachers=new Array();
//增加记录中的教职工
function addTeacher(){
	$.hideModal("#recordsInfoModal",false);
    $.showModal("#addTeacherModal",true);
	getAddTeacherInfo();
	choosendTeachers.length=0;
	$('#confirmAddTeacherBtn').unbind('click');
	$('#confirmAddTeacherBtn').bind('click', function(e) {
		confirmAddTeacher();
		e.stopPropagation();
	});
}

//渲染老师
function getAddTeacherInfo(){
	var searchObject = getAddValue();
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
				stuffAddTeacherTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawTeacherBaseInfoEmptyTable();
			}
		}
	});
}

//渲染教师表
function stuffAddTeacherTable(tableInfo) {
	$('#addTeacherTable').bootstrapTable('destroy').bootstrapTable({
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
		showExport: false,      //是否显示导出
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: false,
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
		onPageChange: function() {
			drawPagination(".addTeacherTable", "教职工信息");
			for (var i = 0; i < choosendTeachers.length; i++) {
				$("#addTeacherTable").bootstrapTable("checkBy", {field:"edu101_ID", values:[choosendTeachers[i].edu101_ID]})
			}
		},
		columns: [
			{
				field : 'check',
				checkbox : true
			},{
				field : 'edu101_ID',
				title : 'id',
				align : 'center',
				visible : false
			},{
				field: 'szxbmc',
				title: '系部',
				align: 'left',
				formatter: paramsMatter
			},{
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
			}
		]
	});

	drawPagination(".addTeacherTable", "教职工信息");
	drawSearchInput(".addTeacherTable");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//单选教师
function onCheck(row){
	if(choosendTeachers.length<=0){
		choosendTeachers.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendTeachers.length; i++) {
			if(choosendTeachers[i].edu101_ID===row.edu101_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendTeachers.push(row);
		}
	}
}

//单反选教师
function onUncheck(row){
	if(choosendTeachers.length<=1){
		choosendTeachers.length=0;
	}else{
		for (var i = 0; i < choosendTeachers.length; i++) {
			if(choosendTeachers[i].edu101_ID===row.edu101_ID){
				choosendTeachers.splice(i,1);
			}
		}
	}
}

//全选教师
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosendTeachers.push(row[i]);
	}
}

//全反选教师
function onUncheckAll(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu101_ID);
	}


	for (var i = 0; i < choosendTeachers.length; i++) {
		if(a.indexOf(choosendTeachers[i].edu101_ID)!==-1){
			choosendTeachers.splice(i,1);
			i--;
		}
	}
}

//确认新增教职工
function confirmAddTeacher(){
	var choosed=choosendTeachers;
	if(choosed.length===0){
		toastr.warning("请选择教职工");
		return;
	}

	var singleTeachers=$(".singleTeacher");
	for (var i = 0; i < singleTeachers.length; i++) {
		for (var c = 0; c < choosed.length; c++) {
           if(parseInt(singleTeachers[i].id)===choosed[c].edu101_ID){
			   toastr.warning("有教职工已选择");
			   return;
		   }
		}
	}

	for (var i = 0; i < choosed.length; i++) {
		$(".singleRecordsArea").append('<div id="'+choosed[i].edu101_ID+'" class="col5 singleTeacher'+choosed[i].edu101_ID+' singleTeacher recordsImg1">'+choosed[i].xm+'</div>');
	}
	$.hideModal("#addTeacherModal",false);
	$.showModal("#recordsInfoModal",true);
}

//确认修改记录
function confirmModifyRecord(row){
	var businessInfo=getModifyInfo(row);
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
			$.hideModal("#recordsInfoModal");
			if (backjson.code===200) {
				toastr.success(backjson.msg);
				$("#recordsTable").bootstrapTable("updateByUniqueId", {id: row.edu112_ID, row: businessInfo});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得修改的记录信息
function getModifyInfo(row){
	var teacherIdArray=new Array();
	var teacherNameArray=new Array();
	var allSingleTeacher=$(".singleTeacher ");
	for (var i = 0; i <allSingleTeacher.length ; i++) {
		teacherIdArray.push(allSingleTeacher[i].id);
		teacherNameArray.push(allSingleTeacher[i].innerText);
	}

	var Edu990_ID=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	var userName=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
	var destination=$("#recordsInfo_location").val();
	var startTime=$("#recordsInfo_startTime").val();
	var endTime=$("#recordsInfo_endtTime").val();
	var businessExplain=$("#recordsInfo_explain").val();

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
	returnObject.edu112_ID=row.edu112_ID;
	return returnObject;
}

//获得检索区域的值
function getAddValue(){
	var returnObject = new Object();
	returnObject.szxb = "";
	returnObject.szxbmc = "";
	returnObject.zy = "";
	returnObject.zymc = "";
	returnObject.zc = "";
	returnObject.zcbm = "";
	returnObject.xm = "";
	returnObject.jzgh = "";
	return returnObject;
}

//单个删除记录
function removeRecord(row){
	if(row.businessState==="passing"){
		toastr.warning('该记录暂不可进行此操作');
		return;
	}
	var idArray=new Array();
	idArray.push(row.edu112_ID);
	sendRemoveRecord(idArray);
}

//批量删除记录
function removeRecords(){
	var choosed = $("#recordsTable").bootstrapTable("getSelections");
	if(choosed.length==0){
		toastr.warning('请选择记录');
		return;
	}

	for (var i = 0; i < choosed.length; i++) {
		if(choosed[i].businessState==="passing"){
			toastr.warning('有记录暂不可进行此操作');
			return;
		}
	}

	var idArray=new Array();
	for (var i = 0; i < choosed.length; i++) {
		idArray.push(choosed[i].edu112_ID);
	}
	sendRemoveRecord(idArray);
}

//发送删除记录请求
function sendRemoveRecord(removeArray){
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeTeacherBusiness",
		data: {
			"removeKeys":JSON.stringify(removeArray)
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
					$().bootstrapTable('removeByUniqueId', removeArray[i]);
				}
				toolTipUp(".myTooltip");
				tableRemoveAction('#recordsTable', removeArray, ".teacherBaseInfoTableArea", "教职工信息")
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}
/*tab2 end*/


//tab2按钮事件绑定
function tab2BtnBind(){
    //批量删除出差记录
	$('#removeRecords').unbind('click');
	$('#removeRecords').bind('click', function(e) {
		removeRecords();
		e.stopPropagation();
	});

	//开始检索出差记录
	$('#recordsSearch').unbind('click');
	$('#recordsSearch').bind('click', function(e) {
		recordsSearch();
		e.stopPropagation();
	});

	//重置检索出差记录
	$('#reloadRecordsSearch').unbind('click');
	$('#reloadRecordsSearch').bind('click', function(e) {
		reloadRecordsSearch();
		e.stopPropagation();
	});

	//二级模态框返回按钮事件
	$('.specialCanle').unbind('click');
	$('.specialCanle').bind('click', function(e) {
		$.hideModal("#addTeacherModal",false);
		$.showModal("#recordsInfoModal",true);
		e.stopPropagation();
	});


	//新增教职工
	$('#addTeacher').unbind('click');
	$('#addTeacher').bind('click', function(e) {
		addTeacher();
		e.stopPropagation();
	});
}

//开始检索出差记录
function recordsSearch(){
	var recordsSearchInfo=getRecordsSearchInfo();
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacherBusiness",
		dataType : 'json',
		data: {
			"searchInfo":JSON.stringify(recordsSearchInfo)
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
				stuffRecordsTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				stuffRecordsEmptyTable();
			}
		}
	});
}

//获得tab2的检索信息
function getRecordsSearchInfo(){
  var userName=$("#records_startUserName").val();
	var teacherName=$("#records_TeacherName").val();
	var destination=$("#records_location").val();
	var businessState=getNormalSelectValue("records_status");
	var returnObject=new Object();
	if(userName!==""){
		returnObject.userName=userName;
	}
	if(teacherName!==""){
		returnObject.teacherName=teacherName;
	}
	if(destination!==""){
		returnObject.destination=destination;
	}
	if(businessState!==""){
		returnObject.businessState=businessState;
	}
	return returnObject;
}

//初始化页面按钮绑定事件
function binBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//出差申请开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//出差申请重置检索
	$('#researchTeachers').unbind('click');
	$('#researchTeachers').bind('click', function(e) {
		researchTeachers();
		e.stopPropagation();
	});

	//批量出差
	$('#businessStarts').unbind('click');
	$('#businessStarts').bind('click', function(e) {
		businessStarts();
		e.stopPropagation();
	});
}
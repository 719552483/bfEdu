var roleOptionStr="";//全局变量接收当前所有部门
$(function() {
	drawTaskEmptyTable();
	binBind();
	getBmInfo();
});

//获取部门信息
function getBmInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getKkbmInfo",
		data: {
            "ejdmGlzd":"kcbm"
        },
		dataType : 'json',
		success : function(backjson) {
			hideloding();
			if (backjson.result) {
				roleOptionStr='<option value="seleceConfigTip">请选择部门</option>';
				for (var i = 0; i < backjson.bmInfo.length; i++) {
					roleOptionStr += '<option value="' +  backjson.bmInfo[i].bf000_ID + '">' +  backjson.bmInfo[i].ejdmz + '</option>';
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充空的任务书表
function drawTaskEmptyTable() {
	stuffTaskInfoTable({});
}

//渲染可发布任务书表
function stuffTaskInfoTable(tableInfo) {
	window.scheduleClassesEvents = {
			'click #putOut': function(e, value, row, index) {
				putOut(row,index);
			}
	};
	
	$('#scheduleClassesTable').bootstrapTable('destroy').bootstrapTable({
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
		    fileName: '可发布教学任务书导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",   
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".scheduleClassesTableArea", "教学任务书");
		},
		onDblClickRow : function(row, $element, field) {
			onDblClickScheduleClassesTable(row, $element, field);
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'jxbmc',
				title: '教学班名称',
				align: 'left',
				formatter: paramsMatter

			}, 	{
				field: 'kcmc',
				title: '课程',
				align: 'left',
				formatter: kcmcMatter

			},	{
				field: 'bhzymc',
				title: '专业',
				align: 'left',
				formatter: bhzymcMatter

			},	{
				field: 'bhxzbmc',
				title: '行政班',
				align: 'left',
				formatter: bhxzbmcMatter

			},	{
				field: 'jxbrs',
				title: '教学班人数',
				align: 'left',
				formatter: paramsMatter

			},{
				field: 'zyls',
				title: '主要老师',
				clickToSelect: false,
				align: 'left',
				formatter: pointTeacherMatter

			},{
				field: 'ls',
				title: '老师',
				clickToSelect: false,
				align: 'left',
				formatter: pointTeacherMatter
			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'left',
				clickToSelect: false,
				formatter: sfxylcjMatter

			},	{
				field: 'zhouxs',
				title: '周课时',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'kkbm',
				title: '开课部门',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'pkbm',
				title: '排课部门',
				align: 'left',
				formatter: pkbmMatter,
				clickToSelect: false
			},{
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: scheduleClassesFormatter,
				events: scheduleClassesEvents,
			}
		]
	});
	
	function scheduleClassesFormatter(value, row, index) {
		return [
				'<ul class="toolbar tabletoolbar">' +
				'<li id="putOut" class="queryBtn"><span><img src="img/right.png" style="width:24px"></span>发布</li>' +
				'</ul>'
			]
			.join('');
	}
	
	function kcmcMatter(value, row, index) {
		return [ '<span class="myTooltip" title="'+$.uniqueArray(row.kcmc)+'">'+$.uniqueArray(row.kcmc)+'</span>' ].join('');
	}
	
	function bhxzbmcMatter(value, row, index) {
		return [ '<span class="myTooltip" title="'+$.uniqueArray(row.bhxzbmc)+'">'+$.uniqueArray(row.bhxzbmc)+'</span>' ].join('');
	}
	
	function bhzymcMatter(value, row, index) {
		return [ '<span class="myTooltip" title="'+$.uniqueArray(row.bhzymc).slice(0, -1)+'">'+$.uniqueArray(row.bhzymc).slice(0, -1)+'</span>' ].join('');
	}
	
	function pkbmMatter(value, row, index) {
		return [
				'<span title="'+row.pkbm+'" class="myTooltip pkbmTxt pkbmTxt' + index + '">' + row.pkbm + '</span><select class="myTableSelect myTableSelect' +
				index + '" id="pkbmSelect'+index+'">' + roleOptionStr + '</select>'
			]
			.join('');
	}
	

	drawPagination(".scheduleClassesTableArea", "教学任务书");
	drawSearchInput(".scheduleClassesTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".scheduleClassesTableArea", "教学任务书");
	toolTipUp(".myTooltip");
	btnControl();
	sfxylcjControlBind();
}

//任务书表双击事件
function onDblClickScheduleClassesTable(row, $element, field){
	var index =parseInt($element[0].dataset.index);
	if(field==="ls"){
		getLsInfo('#scheduleClassesTable',index,"ls");
	}else if(field==="zyls"){
		getLsInfo('#scheduleClassesTable',index,"zyls");
	}else if(field==="pkbm"){
		wantChangePKBM(index,"pkbm");
	}else{
		return;
	}
}

//预备改变排课部门1
function wantChangePKBM(index,cellName){
	$('.pkbmTxt' + index).hide();
	$(".myTableSelect" + index).show();
	changePKBM("#pkbmSelect" + index,'.pkbmTxt' + index,".myTableSelect" + index,"#scheduleClassesTable",index,cellName);
}

//预备改变排课部门2
function wantChangePutOutPKBM(index,cellName){
	$('.putOutTaskpkbmTxt' + index).hide();
	$(".myputOutTaskTableSelect" + index).show();
	changePKBM("#putOutTaskpkbmSelect" + index,'.putOutTaskpkbmTxt' + index,".myputOutTaskTableSelect" + index,"#putOutTaskTable",index,cellName);
}

//改变排课部门
function changePKBM(id,showClass,hideClass,tableID,index,cellName){
	$(id).change(function(e){
		var value=$(id).val();
		var txt=$(id).find("option:selected").text()
		if(value!=="seleceConfigTip"){
			$(tableID).bootstrapTable('updateCell', {
				index: index,
				field: cellName,
				value: txt
			});
			
			$(tableID).bootstrapTable('updateCell', {
				index: index,
				field: cellName+"Code",
				value: value
			});
			$(hideClass).hide();
			$(showClass).show();
		}
	});
	if(tableID==="#scheduleClassesTable"){
		sfxylcjControlBind();
	}else{
		putOutTasksfxylcjControlBind();
	}
}

//获取教师信息
function getLsInfo(tableid,index,cellName){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllTeacher",
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
				$.showModal("#allTeacherModal",true);
				stuffTaecherTable(backjson.teacherList);
				allTaecherAreabtnBind(tableid,index,cellName);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

var choosendTeachers=new Array();
//填充教师表
function stuffTaecherTable(tableInfo){
		$('#allTeacherTable').bootstrapTable('destroy').bootstrapTable({
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
			showColumns : false,
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
			onPageChange : function() {
				drawPagination(".allClassMangersTableArea", "教师信息");
				for (var i = 0; i < choosendTeachers.length; i++) {
					$("#allTeacherTable").bootstrapTable("checkBy", {field:"edu101_ID", values:[choosendTeachers[i].edu101_ID]})
				}
			},
			columns : [ {
				field : 'edu101_ID',
				title : 'id',
				align : 'center',
				visible : false
			},{
				field: 'check',
				checkbox: true
			}, {
				field : 'szxbmc',
				title : '系部',
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

//检索任务书表
function searchTask(){
	var taskInfo=getSearchInfo();
	if(typeof taskInfo ==='undefined'){
		return;
	}
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getTaskInfo",
		data: {
             "searchInfo":JSON.stringify(taskInfo) 
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
				if(backjson.taskInfo.length===0){
					toastr.info('暂无可发布的教学任务书');
					return;
				}
				stuffTaskInfoTable(rePutTaskInfo(backjson.taskInfo));
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//得到检索任务书的检索条件
function getSearchInfo(){
	var xzbmc=$("#xzbmc").val();
	var kcmc=$("#kcmc").val();
	if(xzbmc===""&&kcmc===""){
		toastr.warning('检索条件不能为空');
		return;
	}
	
	var returnObject=new Object();
	returnObject.xzbmc=xzbmc;
	returnObject.kcmc=kcmc;
	return returnObject;
}

//重新组装任务书信息
function rePutTaskInfo(oldTaskInfo){
	var newTaskArray=new Array();
	for (var i = 0; i < oldTaskInfo.length; i++) {
		var jxbInfo=oldTaskInfo[i].jxbInfo;
		var crouseInfo=oldTaskInfo[i].crouseInfo;
		var newTaskInfo=new Object;
		newTaskInfo.edu301_ID=jxbInfo.edu301_ID;
		newTaskInfo.edu108_ID=crouseInfo.edu108_ID;
		newTaskInfo.jxbmc=jxbInfo.jxbmc;
		newTaskInfo.kcmc=jxbInfo.kcmc;
		newTaskInfo.bhzyCode=jxbInfo.bhzyCode;
		newTaskInfo.bhzymc=$.uniqueArray(jxbInfo.bhzymc.split(","));
		newTaskInfo.jxbrs=jxbInfo.jxbrs;
		newTaskInfo.bhxzbid=jxbInfo.bhxzbid;
		newTaskInfo.bhxzbmc=jxbInfo.bhxzbmc;
		newTaskInfo.ls="";
		newTaskInfo.lsCode="";
		newTaskInfo.zyls="";
		newTaskInfo.zylsCode="";
		typeof(crouseInfo.sfxylcj) !== "undefined"&&crouseInfo.sfxylcj!==""?newTaskInfo.sfxylcj="T":newTaskInfo.sfxylcj="F";
		newTaskInfo.zhouxs=crouseInfo.zhouxs;
		newTaskInfo.kkbm=crouseInfo.kkbm;
		newTaskInfo.kkbmCode=crouseInfo.kkbmCode;
		newTaskInfo.pkbm=crouseInfo.kkbm;
		newTaskInfo.pkbmCode=crouseInfo.kkbmCode;
		newTaskArray.push(newTaskInfo);
	}
	return newTaskArray;
}

//是否需要录入成绩格式化1
function sfxylcjMatter(value, row, index) {
	if (row.sfxylcj==="T") {
		return [
				'<span class="noneStart">是</span><section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="sfxylcjControl" id="sfxylcjControl'+index+'" type="checkbox" checked="checked"><label></label></div></section>'
			]
			.join('');
	} else {
		return [
				'<span class="noneStart">否</span><section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="sfxylcjControl" id="sfxylcjControl'+index+'" type="checkbox"><label></label></div></section>'
			]
			.join('');
	}
}

//是否需要录入成绩格式化2
function putOutTasksfxylcjMatter(value, row, index) {
	if (row.sfxylcj==="T") {
		return [
				'<span class="noneStart">是</span><section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="putOutTaskssfxylcjControl" id="putOutTasksfxylcjControl'+index+'" type="checkbox" checked="checked"><label></label></div></section>'
			]
			.join('');
	} else {
		return [
				'<span class="noneStart">否</span><section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="putOutTaskssfxylcjControl" id="putOutTasksfxylcjControl'+index+'" type="checkbox"><label></label></div></section>'
			]
			.join('');
	}
}

//指定老师格式化
function pointTeacherMatter(value, row, index) {
	if (value===""||typeof(value) === "undefined"||value===null){
		return [
              '<div class="myTooltip redTxt" title="暂未指定老师,双击选择">暂未指定老师</div>'
			]
			.join('');
	} else {
		return [
             '<div class="myTooltip greenTxt" title="'+value+'">'+value+'</div>'
			]
			.join('');
	}
}

//开始检索教师
function allTeacherStartSearch(){
	var departmentName=$("#departmentName").val();
	var mangerName=$("#mangerName").val();
	var mangerNumber=$("#mangerNumber").val();
	if(departmentName===""&&mangerName===""&&mangerNumber===""){
		toastr.warning('检索条件为空');
		return;
	}
	var serachObject=new Object();
	departmentName===""?serachObject.departmentName="":serachObject.departmentName=departmentName;
	mangerName===""?serachObject.mangerName="":serachObject.mangerName=mangerName;
	mangerNumber===""?serachObject.mangerNumber="":serachObject.mangerNumber=mangerNumber;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacher",
		data: {
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
			 if (backjson.result) {
				 stuffTaecherTable(backjson.techerList);
			 	 } else {
					toastr.warning('操作失败，请重试');
			 	 }
		}
	});
}

//重置检索教师
function allTaecherReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
	stuffTaecherTable();
}

//确认选择教师事件
function confirmChoosedTeacher(tableId,index,cellName){
	var teachers = $("#allTeacherTable").bootstrapTable("getSelections");
	var fieldName1="";
	var fieldName2="";
	if(tableId==="#scheduleClassesTable"){
		fieldName1=cellName;
		fieldName2=cellName+"Code";
	}else{
		fieldName1=cellName;
		fieldName2=cellName.substring(0,cellName.length-2);
	}

	var mcArray=new Array();
	var codeArray=new Array();
	for (var i = 0; i < teachers.length; i++) {
		mcArray.push(teachers[i].xm);
		codeArray.push(teachers[i].edu101_ID);
	}


	$(tableId).bootstrapTable('updateCell', {
		index: index,
		field: fieldName1,
		value:  JSON.stringify(mcArray)
	});

	$(tableId).bootstrapTable('updateCell', {
		index: index,
		field: fieldName2,
		value: JSON.stringify(codeArray)
	});

	// var choosedTeacher = $("#allTeacherTable").bootstrapTable("getSelections")
	//
	// if(choosedTeacher.length===0){
	// 	toastr.warning('暂未选择教师');
	// 	return;
	// }
	//
	// var fieldName1="";
	// var fieldName2="";
	// if(tableId==="#scheduleClassesTable"){
	// 	fieldName1=cellName;
	// 	fieldName2=cellName+"Code";
	// }else{
	// 	fieldName1=cellName;
	// 	fieldName2=cellName.substring(0,cellName.length-2);
	// }
	//
	// var choosedTask = $(tableId).bootstrapTable("getSelections");
	// if(choosedTask<=0){
	// 	$(tableId).bootstrapTable('updateCell', {
	// 		index: index,
	// 		field: fieldName1,
	// 		value: choosedTeacher[0].xm
	// 	});
	//
	// 	$(tableId).bootstrapTable('updateCell', {
	// 		index: index,
	// 		field: fieldName2,
	// 		value: JSON.stringify(choosedTeacher[0].edu101_ID)
	// 	});
	// }else{
	// 	for (var i = 0; i < choosedTask.length; i++) {
	// 		if(choosedTask[i].check){
	// 			$(tableId).bootstrapTable('updateCell', {
	// 				index: i,
	// 				field: fieldName1,
	// 				value: choosedTeacher[0].xm
	// 			});
	//
	// 			$(tableId).bootstrapTable('updateCell', {
	// 				index: i,
	// 				field: fieldName2,
	// 				value:JSON.stringify(choosedTeacher[0].edu101_ID)
	// 			});
	// 		}
	// 	}
	// }
	// if(tableId==="#scheduleClassesTable"){
	// 	sfxylcjControlBind();
	// }else{
	// 	putOutTasksfxylcjControlBind();
	// }
	$.hideModal();
}

//switch事件绑定1
function sfxylcjControlBind() {
	$('.sfxylcjControl').unbind('click');
	$('.sfxylcjControl').bind('click', function(e) {
		var index=parseInt(e.currentTarget.attributes[0].nodeValue);
		changsfxylcj('#scheduleClassesTable',"#sfxylcjControl"+index,index);
		e.stopPropagation();
	});
}

//switch事件绑定2
function putOutTasksfxylcjControlBind() {
	$('.putOutTaskssfxylcjControl').unbind('click');
	$('.putOutTaskssfxylcjControl').bind('click', function(e) {
		var index=parseInt(e.currentTarget.attributes[0].nodeValue);
		changsfxylcj('#putOutTaskTable',"#putOutTasksfxylcjControl"+index,index);
		e.stopPropagation();
	});
}

//改变是否需要录成绩
function changsfxylcj(tableid,inputid,index){
	var currentStatu=$(inputid)[0].checked;
	currentStatu?currentStatu="T":currentStatu="F";
	$(tableid).bootstrapTable('updateCell', {
		index: index,
		field: "sfxylcj",
		value:currentStatu
	});
	if(tableid==="#scheduleClassesTable"){
		sfxylcjControlBind();
	}else{
		putOutTasksfxylcjControlBind();
	}
}

//单个发布任务书
function putOut(row,index){
	var putOutArray=new Array();
	var putOutObject=new Object();
	putOutObject.edu301_ID=row.edu301_ID;
	putOutObject.edu108_ID=row.edu108_ID;
	putOutObject.jxbmc=row.jxbmc;
	putOutObject.kcmc=row.kcmc;
	putOutObject.zymc=row.bhzymc[0];
	putOutObject.jxbrs=row.jxbrs;
	putOutObject.xzbmc=row.bhxzbmc;
	putOutObject.zxs=row.zhouxs;
	putOutObject.ls=row.lsCode;
	putOutObject.lsmc=row.ls;
	putOutObject.zyls=row.zylsCode;
	putOutObject.zylsmc=row.zyls;
	putOutObject.pkbm=row.pkbm;
	putOutObject.pkbmCode=row.pkbmCode;
	putOutObject.kkbm=row.kkbm;
	putOutObject.kkbmCode=row.kkbmCode;
	putOutObject.sfxylcj=row.sfxylcj;
	putOutArray.push(putOutObject);
	checkPutOutInfo(putOutArray);
}

//批量发布任务书
function putOutTasks(){
	var choosedTasks = $("#scheduleClassesTable").bootstrapTable("getSelections");
	if (choosedTasks.length === 0) {
		toastr.warning('暂未选择任务书');
		return;
	}
	
	var putOutArray=new Array();
	for (var i = 0; i < choosedTasks.length; i++) {
		var putOutObject=new Object();
		putOutObject.edu301_ID=choosedTasks[i].edu301_ID;
		putOutObject.edu108_ID=choosedTasks[i].edu108_ID;
		putOutObject.jxbmc=choosedTasks[i].jxbmc;
		putOutObject.kcmc=choosedTasks[i].kcmc;
		putOutObject.zymc=choosedTasks[i].bhzymc[0];
		putOutObject.jxbrs=choosedTasks[i].jxbrs;
		putOutObject.xzbmc=choosedTasks[i].bhxzbmc;
		putOutObject.zxs=choosedTasks[i].zhouxs;
		putOutObject.ls=choosedTasks[i].lsCode;
		putOutObject.lsmc=choosedTasks[i].ls;
		putOutObject.zyls=choosedTasks[i].zylsCode;
		putOutObject.zylsmc=choosedTasks[i].zyls;
		putOutObject.pkbm=choosedTasks[i].pkbm;
		putOutObject.pkbmCode=choosedTasks[i].pkbmCode;
		putOutObject.kkbm=choosedTasks[i].kkbm;
		putOutObject.kkbmCode=choosedTasks[i].kkbmCode;
		putOutObject.sfxylcj=choosedTasks[i].sfxylcj;
		putOutArray.push(putOutObject);
	}
	
	checkPutOutInfo(putOutArray);
}

//检查任务书信息
function checkPutOutInfo(putOutArray){
	for (var i = 0; i < putOutArray.length; i++) {
		if(putOutArray[i].ls===""&&putOutArray[i].zyls===""){
			toastr.warning('有教学班暂未指定教师');
			return;
		}
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("所选    "+putOutArray.length+"  条任务书");
	$(".remindActionType").html("发布");
	//确认删除学生
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendPutOutInfo(putOutArray);
		e.stopPropagation();
	});
}

//发送发布任务书的请求
function sendPutOutInfo(putOutArray){
	for (var i = 0; i < putOutArray.length; i++) {
		var classList=new Array();
		var teacherList=new Array();
		var baseTeacherList=new Array();
		var teacheOb=new Object();
		var zyteacheOb=new Object();
		var classOb=new Object();
		zyteacheOb.edu101_ID=putOutArray[i].zyls;
		zyteacheOb.teacherName=putOutArray[i].zylsmc;
		teacheOb.edu101_ID=putOutArray[i].ls;
		teacheOb.teacherName=putOutArray[i].lsmc;
		classOb.edu301_ID=putOutArray[i].edu301_ID;
		classOb.className=putOutArray[i].jxbmc;
		classList.push(classOb);
		teacherList.push(teacheOb);
		baseTeacherList.push(zyteacheOb);

		putOutArray[i].classList=classList;
		putOutArray[i].teacherList=teacherList;
		putOutArray[i].baseTeacherList=baseTeacherList;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/putOutTask",
		data: {
            "taskInfo":JSON.stringify(putOutArray) ,
			"approvalInfo":JSON.stringify(getApprovalobect())
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
				for (var i = 0; i < putOutArray.length; i++) {
					$("#scheduleClassesTable").bootstrapTable("remove", {field: "jxbmc", values: putOutArray[i].jxbmc}); 
				}
				$.hideModal("#remindModal");
				toastr.success('发布任务书成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//查看已发布任务书
function showputedTask(IsmainAreaControl){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryPutedTasks",
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
				if (backjson.taskInfo.length===0) {
					toastr.warning('暂无已发布任务书');
					return;
				}
				stuffPutOutTaskTable(backjson.taskInfo);
				if (typeof(IsmainAreaControl) === "undefined") {
					mainAreaControl();
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//渲染已发布任务书表
function stuffPutOutTaskTable(tableInfo) {
	window.putOutTaskEvents = {
			'click #modifyTask': function(e, value, row, index) {
				modifyTask(row,index);
			},'click #removeTask': function(e, value, row, index) {
				removeTask(row,index);
			}
	};
	
	$('#putOutTaskTable').bootstrapTable('destroy').bootstrapTable({
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
		    fileName: '已发布教学任务书导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",   
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".putOutTaskTableArea", "教学任务书");
		},
		onDblClickRow : function(row, $element, field) {
			onDblClickputOutTaskTable(row, $element, field);
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},{
				field: 'edu201_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'jxbmc',
				title: '教学班名称',
				align: 'left',
				formatter: paramsMatter

			}, 	{
				field: 'kcmc',
				title: '课程',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'zymc',
				title: '专业',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'xzbmc',
				title: '行政班',
				align: 'left',
				formatter: xzbmcMatter

			},	{
				field: 'jxbrs',
				title: '教学班人数',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'lsmc',
				title: '老师',
				clickToSelect: false,
				align: 'left',
				formatter: pointTeacherMatter
			},{
				field: 'zylsmc',
				title: '主要老师',
				clickToSelect: false,
				align: 'left',
				formatter: pointTeacherMatter

			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'left',
				clickToSelect: false,
				formatter: putOutTasksfxylcjMatter
			},	{
				field: 'zxs',
				title: '周课时',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'kkbm',
				title: '开课部门',
				align: 'left',
				formatter: paramsMatter

			},	{
				field: 'pkbm',
				title: '排课部门',
				align: 'left',
				formatter: putOutTaskpkbmMatter,
				clickToSelect: false
			},{
				field: 'sszt',
				title: '审核状态',
				align: 'left',
				formatter: ztMatter
			},{
				field: 'fkyj',
				title: '反馈意见',
				align: 'left',
				formatter: paramsMatter
			},{
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: putOutTaskFormatter,
				events: putOutTaskEvents,
			}
		]
	});
	
	function putOutTaskFormatter(value, row, index) {
		if(row.sszt==="pass"){
			return [
                '<div class="noActionText">不可操作</div>'
				]
				.join('');
		}
		return [
				'<ul class="toolbar tabletoolbar" style="min-width: 500px;">' +
				'<li id="modifyTask" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
				'<li id="removeTask" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
				'</ul>'
			]
			.join('');
	}
	
	function xzbmcMatter(value, row, index) {
		return [ '<span class="myTooltip" title="'+$.uniqueArray(row.xzbmc)+'">'+$.uniqueArray(row.xzbmc)+'</span>' ].join('');
	}
	
	function putOutTaskpkbmMatter(value, row, index) {
		return [
				'<span title="'+row.pkbm+'" class="myTooltip putOutTaskpkbmTxt putOutTaskpkbmTxt' + index + '">' + row.pkbm + '</span><select class="myTableSelect myputOutTaskTableSelect' +
				index + '" id="putOutTaskpkbmSelect'+index+'">' + roleOptionStr + '</select>'
			]
			.join('');
	}
	
	
	function ztMatter(value, row, index) {
		if (row.sszt==="pass") {
			return [ '<div class="myTooltip" title="已通过"><i class="iconfont icon-yixuanze greenTxt"></i></div>' ]
					.join('');
		} else if (row.sszt==="nopass"){
			return [ '<div class="myTooltip" title="不通过"><i class="iconfont icon-chacha redTxt"></i></div>' ]
					.join('');
		} else if (row.sszt==="passing"){
			return [ '<div class="myTooltip normalTxt" title="审批中">审批中</div>' ]
			.join('');
        }
	}
	
	

	drawPagination(".putOutTaskTableArea", "教学任务书");
	drawSearchInput(".putOutTaskTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".putOutTaskTableArea", "教学任务书");
	toolTipUp(".myTooltip");
	btnControl();
	putOutTasksfxylcjControlBind();
}

//已发布任务书表双击事件
function onDblClickputOutTaskTable(row, $element, field){
	if(row.sszt==="noStatus"){
		var index =parseInt($element[0].dataset.index);
		if(field==="lsmc"){
			getLsInfo('#putOutTaskTable',index,"lsmc");
		}else if(field==="zylsmc"){
			getLsInfo('#putOutTaskTable',index,"zylsmc");
		}else if(field==="pkbm"){
			wantChangePutOutPKBM(index,"pkbm");
		}else{
			return;
		}
	}
}

//批量删除任务书
function removePutOutTasks(){
	var chosenTask = $('#putOutTaskTable').bootstrapTable('getAllSelections');
	for (var i = 0; i < chosenTask.length; i++) {
		if(chosenTask[i].sszt==="pass"){
			toastr.warning('不能删除已通过审核的教学任务书');
			return;
		}
	}
	
	if (chosenTask.length === 0) {
		toastr.warning('暂未选择任何教学任务书');
	} else {
		$.showModal("#remindModal",true);
		$(".remindType").html('所选教学任务书');
		$(".remindActionType").html("删除");
		
		//确认删除学生
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			var removeArray = new Array;
			for (var i = 0; i < chosenTask.length; i++) {
				removeArray.push(chosenTask[i].edu201_ID);
			}
			sendTaskRemoveInfo(removeArray);
			e.stopPropagation();
		});
	}
}

//单个删除任务书
function removeTask(row,index){
	if(row.sszt==="pass"){
		toastr.warning('不能删除已通过审核的教学任务书');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html('教学任务书');
	$(".remindActionType").html("删除");
	
	//确认删除学生
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.edu201_ID);
		sendTaskRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除任务书请求
function sendTaskRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeTasks",
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
					$("#putOutTaskTable").bootstrapTable('removeByUniqueId', removeArray[i]);
				}
				drawPagination(".putOutTaskTableArea", "教学任务书");
				$(".myTooltip").tooltipify();
				$.hideModal("#remindModal");
				toastr.success('删除成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备修改任务书
function modifyTask(row,index){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryTaskByID",
		data: {
             "ID":JSON.stringify(row.edu201_ID) 
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
				var edu201=backjson.taskInfo;
				if(edu201.ls===row.ls&&edu201.zyls===row.zyls&&edu201.pkbmCode===row.pkbmCode&&edu201.sfxylcj===row.sfxylcj){
					toastr.warning('该教学任务书暂未进行任何修改');
					return;
				}
				comfirmModifyTask(row,index);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认修改任务书
function comfirmModifyTask(row,index){
	if(row.sszt==="passing"){
		toastr.warning('该任务书暂不可进行操作');
		return ;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("所选任务书");
	$(".remindActionType").html("修改");
	
	//确认修改任务书
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		$.ajax({
			method : 'get',
			cache : false,
			url : "/modifyTask",
			data: {
	             "modifyInfo":JSON.stringify(row) 
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
					$('#putOutTaskTable').bootstrapTable("updateRow", {index: index, row: row});
					$.hideModal("#remindModal");
					toastr.success('修改成功');
					$(".myTooltip").tooltipify();
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
		e.stopPropagation();
	});
}

//检索已发布任务书
function startSearchPutOutTasks(){
	var xzbmc=$("#xzbmc").val();
	var kcmc=$("#kcmc").val();
	if(xzbmc===""&&kcmc===""){
		toastr.warning('检索条件为空');
		return;
	}
	var serachObject=new Object();
	xzbmc===""?serachObject.xzbmc="":serachObject.xzbmc=xzbmc;
	kcmc===""?serachObject.kcmc="":serachObject.kcmc=kcmc;
	serachObject.sszt="";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchPutOutTasks",
		data: {
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
			 if (backjson.result) {
				 stuffPutOutTaskTable(backjson.taskInfo);
			 	 } else {
					toastr.warning('操作失败，请重试');
			 	 }
		}
	});
}


//页面展示区域控制
function mainAreaControl(){
	$(".formtext,.scheduleClassesTableArea,.putOutTaskTableArea,#putOutTasks,#showputedTask,#startSearch,#reback,#removePutOutTasks,#startSearchPutOutTasks,#research1,#research2").toggle();
	var reObject = new Object();
	reObject.InputIds = "#xzbmc,#kcmc";
	reReloadSearchsWithSelect(reObject);
}

//任务书审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="04";
	approvalObject.proposerType=JSON.parse($.session.get('authoritysInfo')).bF991_ID;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//选择教师模态框按钮绑定事件
function allTaecherAreabtnBind(tableid,index,cellName) {
	// 开始检索教师按钮
	$('#allClassMangers_StartSearch').unbind('click');
	$('#allClassMangers_StartSearch').bind('click', function(e) {
		allTeacherStartSearch();
		e.stopPropagation();
	});
	
	// 重置检索教师按钮
	$('#allClassMangers_ReSearch').unbind('click');
	$('#allClassMangers_ReSearch').bind('click', function(e) {
		allTaecherReSearch();
		e.stopPropagation();
	});
	
	// 确认选择教师
	$('#confirmChoosedTeacher').unbind('click');
	$('#confirmChoosedTeacher').bind('click', function(e) {
		confirmChoosedTeacher(tableid,index,cellName);
		e.stopPropagation();
	});
}

//已发布任务书区域按钮绑定事件
function putOutTaskAreabtnBind(tableid,index,cellName) {
	//检索已发布任务书
	$('#startSearchPutOutTasks').unbind('click');
	$('#startSearchPutOutTasks').bind('click', function(e) {
		startSearchPutOutTasks();
		e.stopPropagation();
	});
	
	// 重置检索已发布任务书
	$('#research2').unbind('click');
	$('#research2').bind('click', function(e) {
		var reObject = new Object();
		reObject.InputIds = "#xzbmc,#kcmc";
		reReloadSearchsWithSelect(reObject);
		showputedTask(false);
		e.stopPropagation();
	});
	
	// 批量删除任务书
	$('#removePutOutTasks').unbind('click');
	$('#removePutOutTasks').bind('click', function(e) {
		removePutOutTasks();
		e.stopPropagation();
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

	//检索任务书
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		searchTask();
		e.stopPropagation();
	});
	
	//批量发布任务书
	$('#putOutTasks').unbind('click');
	$('#putOutTasks').bind('click', function(e) {
		putOutTasks();
		e.stopPropagation();
	});
	
	//查看已发布任务书
	$('#showputedTask').unbind('click');
	$('#showputedTask').bind('click', function(e) {
		showputedTask();
		putOutTaskAreabtnBind();
		e.stopPropagation();
	});
	
	// 重置检索可发布任务书
	$('#research1').unbind('click');
	$('#research1').bind('click', function(e) {
		var reObject = new Object();
		reObject.InputIds = "#xzbmc,#kcmc";
		reReloadSearchsWithSelect(reObject);
		drawTaskEmptyTable();
		e.stopPropagation();
	});
	
	//返回
	$('#reback').unbind('click');
	$('#reback').bind('click', function(e) {
		mainAreaControl();
		e.stopPropagation();
	});
}
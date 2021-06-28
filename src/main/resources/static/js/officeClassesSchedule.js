var roleOptionObject=new Object();//全局变量接收当前所有部门
$(function() {
	judgementPWDisModifyFromImplements();
	drawTaskEmptyTable();
	binBind();
	getBmInfo();
	$('.isSowIndex').selectMania(); // 初始化下拉框
	stuffDepartmnet();
	deafultSearch();
});

//查询可选二级学院
function stuffDepartmnet(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getUsefulDepartment",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
		},
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code===200) {
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.data.length; i++) {
					str += '<option value="' + backjson.data[i].edu104_ID + '">' + backjson.data[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#department", str);
			} else {
				toastr.warning('获取二级学院失败，请重试');
			}
		}
	});
}

//初始化检索
function deafultSearch(){
	var returnObject=new Object();
	returnObject.pyjhmc="";
	returnObject.kcmc="";
	returnObject.departmentCode="";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getTaskInfo",
		data: {
			"searchInfo":JSON.stringify(returnObject),
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
				toastr.info(backjson.msg);
				stuffTaskInfoTable(backjson.data);
			} else {
				drawTaskEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取部门信息
function getBmInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getPkAndKkInfo",
		dataType : 'json',
		success : function(backjson) {
			if (backjson.result) {
				var roleOptionStr='<option value="seleceConfigTip">请选择部门</option>';
				var kkbm=backjson.kkbm;
				for (var i = 0; i < kkbm.length; i++) {
					roleOptionStr += '<option value="' + kkbm[i].edu104_ID + '">' +  kkbm[i].xbmc + '</option>';
				}
				roleOptionObject.kkbm=roleOptionStr;

				roleOptionStr='<option value="seleceConfigTip">请选择部门</option>';
				var pkbm=backjson.pkbm;
				for (var i = 0; i < pkbm.length; i++) {
					roleOptionStr += '<option value="' + pkbm[i].edu104_ID + '">' +  pkbm[i].xbmc + '</option>';
				}
				roleOptionObject.pkbm=roleOptionStr;
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

var choosendCanPutTask=new Array();
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
		onCheck : function(row) {
			onCheckCanPutTask(row);
		},
		onUncheck : function(row) {
			onUncheckCanPutTask(row);
		},
		onCheckAll : function(rows) {
			onCheckAllCanPutTask(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllCanPutTask(rows2);
		},
		onPageChange: function() {
			drawPagination(".scheduleClassesTableArea", "教学任务书");
			for (var i = 0; i < choosendCanPutTask.length; i++) {
				$("#scheduleClassesTable").bootstrapTable("checkBy", {field:"edu206_ID", values:[choosendCanPutTask[i].edu206_ID]})
			}
		},
		onPostBody : function() {
			sfxylcjControlBind();
			toolTipUp(".myTooltip");
		},
		onDblClickRow : function(row, $element, field) {
			choosendTeachers.length=0;
			onDblClickScheduleClassesTable(row, $element, field);
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'edu206_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			},
			{
				field: 'className',
				title: '班级-(双击选择)',
				align: 'left',
				clickToSelect: false,
				formatter: classNameMatter
			},{
				field: 'xn',
				title: '学年-(双击选择)',
				align: 'left',
				clickToSelect: false,
				formatter: xnMatter
			}, {
				field: 'kcmc',
				title: '课程',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},	{
				field: 'pyjhmc',
				title: '培养计划名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'lsmc',
				title: '任课老师-(双击选择)',
				clickToSelect: false,
				align: 'left',
				formatter: pointTeacherMatter
			},{
				field: 'zylsmc',
				title: '助教-(双击选择)',
				clickToSelect: false,
				align: 'left',
				formatter: pointTeacherMatter
			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'left',
				clickToSelect: false,
				formatter: sfxylcjMatter
			},{
				field: 'zxs',
				title: '总学时',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'kkbm',
				title: '开课部门-(双击选择)',
				align: 'left',
				formatter: kkbmMatter,
				visible: false,
				clickToSelect: false
			},	{
				field: 'pkbm',
				title: '排课部门-(双击选择)',
				align: 'left',
				formatter: pkbmMatter,
				visible: false,
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
	

	function pkbmMatter(value, row, index) {
		if(typeof value==="undefined"||value==null||value==="null"){
			return [
				'<span title="暂未选择排课部门,双击选择" class="myTooltip pkbmTxt normalTxt pkbmTxt' + index + '">暂未安排</span><select class="myTableSelect myTableSelect' +
				index + '" id="pkbmSelect'+index+'">' + roleOptionObject.pkbm + '</select>'
			]
				.join('');
		}else{
			return [
				'<span title="'+row.pkbm+'" class="myTooltip pkbmTxt pkbmTxt' + index + '">' + row.pkbm + '</span><select class="myTableSelect myTableSelect' +
				index + '" id="pkbmSelect'+index+'">' + roleOptionObject.pkbm + '</select>'
			]
				.join('');
		}
	}

	function kkbmMatter(value, row, index) {
		if(typeof value==="undefined"||value==null){
			return [
				'<span title="暂未选择开课部门,双击选择" class="myTooltip kkbmTxt normalTxt kkbmTxt' + index + '">暂未安排</span><select class="myTableSelect mykkbmTableSelect' +
				index + '" id="kkbmSelect'+index+'">' + roleOptionObject.kkbm + '</select>'
			]
				.join('');
		}else{
			return [
				'<span title="'+row.kkbm+'" class="myTooltip kkbmTxt kkbmTxt' + index + '">' + row.kkbm + '</span><select class="myTableSelect mykkbmTableSelect' +
				index + '" id="kkbmSelect'+index+'">' + roleOptionObject.kkbm + '</select>'
			]
				.join('');
		}
	}

	drawPagination(".scheduleClassesTableArea", "开课计划");
	drawSearchInput(".scheduleClassesTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".scheduleClassesTableArea", "开课计划");
	toolTipUp(".myTooltip");
	sfxylcjControlBind();
	$("#removePutOutTasks").hide();
}

//单选学生
function onCheckCanPutTask(row){
	if(choosendCanPutTask.length<=0){
		choosendCanPutTask.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendCanPutTask.length; i++) {
			if(choosendCanPutTask[i].edu206_ID===row.edu206_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendCanPutTask.push(row);
		}
	}
}

//单反选学生
function onUncheckCanPutTask(row){
	if(choosendCanPutTask.length<=1){
		choosendCanPutTask.length=0;
	}else{
		for (var i = 0; i < choosendCanPutTask.length; i++) {
			if(choosendCanPutTask[i].edu206_ID===row.edu206_ID){
				choosendCanPutTask.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllCanPutTask(row){
	for (var i = 0; i < row.length; i++) {
		choosendCanPutTask.push(row[i]);
	}
}

//全反选学生
function onUncheckAllCanPutTask(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu206_ID);
	}


	for (var i = 0; i < choosendCanPutTask.length; i++) {
		if(a.indexOf(choosendCanPutTask[i].edu206_ID)!==-1){
			choosendCanPutTask.splice(i,1);
			i--;
		}
	}
}

//任务书表双击事件
function onDblClickScheduleClassesTable(row, $element, field){
	var index =parseInt($element[0].dataset.index);
	if(field==="lsmc"){
		getLsInfo('#scheduleClassesTable',index,"ls");
	}else if(field==="zylsmc"){
		getLsInfo('#scheduleClassesTable',index,"zyls");
	}else if(field==="pkbm"){
		wantChangePKBM(index,"pkbm");
	}else if(field==="kkbm"){
		wantChangeKkBM(index,"kkbm");
	}else if(field==="className"){
		wantChooseClass(row,"#scheduleClassesTable");
	}else if(field==="xn"){
		wantChooseXn(row,"#scheduleClassesTable");
	}else{
		return;
	}
}

//预备选择学年
function wantChooseXn(row,tableID){
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
			if (backjson.code === 200) {
				$.showModal("#chooseXnModal",true);
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.data.length; i++) {
					str += '<option value="' + backjson.data[i].edu400_ID + '">' + backjson.data[i].xnmc
						+ '</option>';
				}
				stuffManiaSelect("#Xn", str);

				//确认选择班级
				$('#confirmChooseXn').unbind('click');
				$('#confirmChooseXn').bind('click', function(e) {
					confirmChooseXn(row,tableID);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//确认选择学年
function confirmChooseXn(row,tableID){
	var choosedXn=getNormalSelectValue("Xn");
	if(choosedXn===""){
		toastr.warning("暂未选择学年");
		return;
	}

	row.xnid=choosedXn;
	row.xn=getNormalSelectText("Xn");
	if(tableID==="scheduleClassesTable"){
		$(tableID).bootstrapTable('updateByUniqueId', {
			id: row.edu206_ID,
			row: row
		});
	}else{
		$(tableID).bootstrapTable('updateByUniqueId', {
			id: row.edu201_ID,
			row: row
		});
	}
	toolTipUp(".myTooltip");
	$.hideModal("#chooseXnModal");
}

var isFisrtEnterClassModal=true;
//预备选择班级
function wantChooseClass(row,tableID){
	$(".itab").find("li:eq(0)").find("a").trigger('click');
	reloadClassModalSearchArea();
	if(isFisrtEnterClassModal){
		stuffClassModalSearchArea();
	}

	getAllXzb();
	getAllJxb();
	classModalBtnbind(row,tableID);
	$.showModal("#chooseClassModal",true);
	isFisrtEnterClassModal=false;
}

//获取所有行政班
function getAllXzb(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/findAllClass",
		data:{
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
			if (backjson.result) {
				hideloding();
				if(backjson.classList.length===0){
					stuffXzbTable({});
				}else{
					stuffXzbTable(backjson.classList);
				}
			}
		}
	});
}

//获取所有教学班
function getAllJxb(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/taskSearchTeachingClass",
		data: {
			"teachingClassName":""
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
			if (backjson.code===200) {
				hideloding();
				stuffJxbTable(backjson.data);
			}
		}
	});
}

//班级模态框按钮事件绑定
function classModalBtnbind(row,tableID){
	//行政班开始检索
	$('#xzb_StartSearch').unbind('click');
	$('#xzb_StartSearch').bind('click', function(e) {
		xzbStartSearch();
		e.stopPropagation();
	});

	//行政班重置检索
	$('#xzb_ReSearch').unbind('click');
	$('#xzb_ReSearch').bind('click', function(e) {
		var reObject = new Object();
		reObject.normalSelectIds = "#batch,#grade";
		reObject.InputIds = "#xzbmc";
		reReloadSearchsWithSelect(reObject);
		getAllXzb();
		e.stopPropagation();
	});

	//教学班开始检索
	$('#jxb_StartSearch').unbind('click');
	$('#jxb_StartSearch').bind('click', function(e) {
		jxbStartSearch();
		e.stopPropagation();
	});

	//教学班重置检索
	$('#jxb_ReSearch').unbind('click');
	$('#jxb_ReSearch').bind('click', function(e) {
		var reObject = new Object();
		reObject.InputIds = "#jxbmc";
		reReloadSearchsWithSelect(reObject);
		getAllJxb();
		e.stopPropagation();
	});

	//确认选择班级
	$('#confirmChooseClass').unbind('click');
	$('#confirmChooseClass').bind('click', function(e) {
		confirmChooseClass(row,tableID);
		e.stopPropagation();
	});
}

//开始检索行政班
function xzbStartSearch(){
	var xzbmc=$("#xzbmc").val();
	var batch=getNormalSelectValue("batch");
	var grade=getNormalSelectValue("grade");
	if(xzbmc===""&&batch===""&&grade===""){
		toastr.warning("检索条件不能为空");
		return;
	}

	var searchInfo=new Object();
	searchInfo.xzbmc=xzbmc;
	searchInfo.batch=batch;
	searchInfo.grade=grade;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/taskSearchAdministrativeClass",
		data: {
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
				stuffXzbTable(backjson.data);
			} else {
				stuffXzbTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//开始检索教学班
function jxbStartSearch(){
	var teachingClassName=$("#jxbmc").val();
	if(teachingClassName===""){
		toastr.warning("检索条件不能为空");
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/taskSearchTeachingClass",
		data: {
			"teachingClassName":teachingClassName
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
				stuffJxbTable(backjson.data);
			} else {
				stuffJxbTable({});
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染班级模态框检索下拉框
function stuffClassModalSearchArea(){
	//批次
	var str='';
	var EJDMElementInfo=queryEJDMElementInfo();

	if(EJDMElementInfo.pclx.length==0){
		str='<option value="seleceConfigTip">暂无批次</option>';
	}else{
		str='<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < EJDMElementInfo.pclx.length; i++) {
			str += '<option value="' + EJDMElementInfo.pclx[i].ejdm + '">' + EJDMElementInfo.pclx[i].ejdmz+ '</option>';
		}
	}
	stuffManiaSelect('#batch', str);

	//年级
	str='';
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/searchAllNj",
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code == 200) {
				str='<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.data.length; i++) {
					str += '<option value="' + backjson.data[i].edu105_ID + '">' + backjson.data[i].njmc+ '</option>';
				}
			} else {
				str='<option value="seleceConfigTip">暂无年级</option>';
			}
			stuffManiaSelect('#grade', str);
		}
	});
}

//重置班级模态框检索区域
function reloadClassModalSearchArea(){
	var reObject = new Object();
	reObject.normalSelectIds = "#batch,#grade";
	reObject.InputIds = "#xzbmc,#jxbmc";
	reReloadSearchsWithSelect(reObject);
}

//渲染行政班表
function stuffXzbTable(tableInfo){
	$('#xzbTable').bootstrapTable('destroy').bootstrapTable({
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
		onPageChange : function() {
			drawPagination(".xzbTableArea", "行政班信息");
		},
		columns : [ {
			field : 'edu300_ID',
			title : 'id',
			align : 'center',
			visible : false
		},{
			field : 'radio',
			radio : true
		}, {
			field : 'batchName',
			title : '批次',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'njmc',
			title : '年级',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'xzbmc',
			title : '班级名称',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'zxrs',
			title : '在校人数',
			align : 'left',
			formatter : paramsMatter
		}]
	});
	drawPagination(".xzbTableArea", "行政班信息");
	drawSearchInput(".xzbTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//渲染教学班表
function stuffJxbTable(tableInfo){
	$('#jxbTable').bootstrapTable('destroy').bootstrapTable({
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
		onPageChange : function() {
			drawPagination(".jxbTableArea", "教学班信息");
		},
		columns : [ {
			field : 'edu301_ID',
			title : 'id',
			align : 'center',
			visible : false
		},{
			field : 'radio',
			radio : true
		}, {
			field : 'jxbmc',
			title : '教学班名称',
			align : 'left',
			formatter : paramsMatter
		}, {
			field : 'bhxzbmc',
			title : '包含行政班',
			align : 'left',
			formatter : paramsMatter
		},{
			field : 'jxbrs',
			title : '在校人数',
			align : 'left',
			formatter : paramsMatter
		}]
	});
	drawPagination(".jxbTableArea", "教学班信息");
	drawSearchInput(".jxbTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//确认选择班级
function confirmChooseClass(row,tableID){
	var zxbTableSelected= $("#xzbTable").bootstrapTable("getSelections");
	var jxbTableSelected= $("#jxbTable").bootstrapTable("getSelections");
	if(zxbTableSelected.length==0&&jxbTableSelected.length==0){
		toastr.warning('请选择班级');
		return;
	}
	var choosendType=$("#chooseClassModal").find("#usual1").find(".itab").find("ul").find(".selected").attr("calssType");
	var choosendclassName;
	var choosendclassValue;
	if(choosendType==="01"){
		choosendclassName=zxbTableSelected[0].xzbmc;
		choosendclassValue=zxbTableSelected[0].edu300_ID;
	}else{
		choosendclassName=jxbTableSelected[0].jxbmc;
		choosendclassValue=jxbTableSelected[0].edu301_ID;
	}

	row.className=choosendclassName;
	row.classId=choosendclassValue;
	row.classType=choosendType;
	$(tableID).bootstrapTable('updateByUniqueId', {
		id: row.edu201_ID,
		row: row
	});
	$.hideModal("#chooseClassModal");
	toolTipUp(".myTooltip");
}

//预备改变排课部门1
function wantChangePKBM(index,cellName){
	if($("#pkbmSelect" + index).find("option").length<=1){
		toastr.warning('暂无排课部门');
		return;
	}
	$('.pkbmTxt' + index).hide();
	$(".myTableSelect" + index).show();
	changePKBM("#pkbmSelect" + index,'.pkbmTxt' + index,".myTableSelect" + index,"#scheduleClassesTable",index,cellName);
}

//预备改变开课部门1
function wantChangeKkBM(index,cellName){
	if($("#kkbmSelect" + index).find("option").length<=1){
		toastr.warning('暂无开课部门');
		return;
	}
	$('.kkbmTxt' + index).hide();
	$(".mykkbmTableSelect" + index).show();
	changePKBM("#kkbmSelect" + index,'.kkbmTxt' + index,".mykkbmTableSelect" + index,"#scheduleClassesTable",index,cellName);
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
		url : "/queryAllTeachers",
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
				$.showModal("#allTeacherModal",true);
				stuffTaecherTable(backjson.data);
				allTaecherAreabtnBind(tableid,index,cellName);
			} else {
				toastr.warning(backjson.msg);
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
	if(typeof taskInfo==='undefined'){
		return;
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/getTaskInfo",
		data: {
             "searchInfo":JSON.stringify(taskInfo),
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
				toastr.info(backjson.msg);
				stuffTaskInfoTable(backjson.data);
			} else {
				drawTaskEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//得到检索任务书的检索条件
function getSearchInfo(){
	var pyjhmc=$("#pyjhmc").val();
	var kcmc=$("#kcmc").val();
	var departmentCode=getNormalSelectValue("department");
	if(pyjhmc===""&&kcmc===""&&departmentCode===""){
		toastr.warning("检索条件不能为空");
		return;
	}

	var returnObject=new Object();
	returnObject.pyjhmc=pyjhmc;
	returnObject.kcmc=kcmc;
	returnObject.departmentCode=departmentCode;
	return returnObject;
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
	if (value===""||typeof(value) === "undefined"||value===null||value==='null'){
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

//班级格式化
function classNameMatter(value, row, index) {
	if(typeof value==="undefined"||value==null){
		return [
			'<div class="classChoseArea'+index+' myTooltip" title="暂未选择班级，双击选择"><span class="redTxt classTxt'+index+'">暂未选择</span>' +
			'</div>'
		].join('');
	}else{
		return [
			'<div class="classChoseArea'+index+' myTooltip" title="'+value+'"><span class="normalTxt classTxt'+index+'">'+value+'</span>' +
			'</div>'
		].join('');
	}
}

//学年格式化
function xnMatter(value, row, index) {
	if(typeof value==="undefined"||value==null){
		return [
			'<div class="myTooltip" title="暂未选择学年，双击选择"><span class="redTxt classTxt'+index+'">暂未选择</span>' +
			'</div>'
		].join('');
	}else{
		return [
			'<div class="myTooltip" title="'+value+'"><span class="normalTxt classTxt'+index+'">'+value+'</span>' +
			'</div>'
		].join('');
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
	mangerName===""?serachObject.xm="":serachObject.xm=mangerName;
	mangerNumber===""?serachObject.jzgh="":serachObject.jzgh=mangerNumber;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAllTeacher",
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
			 if (backjson.code === 200) {
				 stuffTaecherTable(backjson.data);
			 } else {
			 	toastr.warning(backjson.msg);
				 stuffTaecherTable({});
			 }
		}
	});
}

//重置检索教师
function allTaecherReSearch(){
	var reObject = new Object();
	reObject.InputIds = "#departmentName,#mangerName,#mangerNumber";
	reReloadSearchsWithSelect(reObject);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllTeachers",
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
				stuffTaecherTable(backjson.data);
			} else {
				toastr.warning(backjson.data);
				stuffTaecherTable({});
			}
		}
	});
}

//确认选择教师事件
function confirmChoosedTeacher(tableId,index,cellName){
	var choosedTeacher = choosendTeachers;
	if(choosedTeacher.length===0){
		toastr.warning('暂未选择教师');
		return;
	}

	var fieldName1="";
	var fieldName2="";
	if(tableId==="#scheduleClassesTable"){
		fieldName1=cellName;
		fieldName2=cellName+"mc";
	}else{
		fieldName1=cellName;
		fieldName2=cellName+"mc";
	}

	var mcArray=new Array();
	var codeArray=new Array();
	for (var i = 0; i < choosedTeacher.length; i++) {
		mcArray.push(choosedTeacher[i].xm);
		codeArray.push(choosedTeacher[i].edu101_ID);
	}
	var drawLsStr=mcArray.toString();
	var drawLsStr2=codeArray.toString();

	var choosedTask = $(tableId).bootstrapTable("getSelections");
	var datas = $(tableId).bootstrapTable("getData");

	if(tableId==="#scheduleClassesTable"){
		sfxylcjControlBind();
	}else{
		putOutTasksfxylcjControlBind();
	}

	if(choosedTask<=0){
		//判断选择的老师是否会与已选择的任务书中的老师冲突
		for (var i = 0; i < codeArray.length; i++) {
			if(cellName==='ls'){
				if(codeArray.indexOf(parseInt(datas[index].zyls))!==-1){
					toastr.warning('该任务书助教包含该教师');
					return;
				}
			}else{
				if(codeArray.indexOf(parseInt(datas[index].ls))!==-1){
					toastr.warning('该任务书任课教师包含该教师');
					return;
				}
			}
		}
		$(tableId).bootstrapTable('updateCell', {
			index: index,
			field: fieldName2,
			value:  drawLsStr
		});

		$(tableId).bootstrapTable('updateCell', {
			index: index,
			field: fieldName1,
			value: drawLsStr2
		});
	}else{
		for (var i = 0; i < choosedTask.length; i++) {
			//判断选择的老师是否会与已选择的任务书中的老师冲突
			for (var c = 0; c < codeArray.length; c++) {
				if(cellName==='ls'){
					if(codeArray.indexOf(parseInt(choosedTask[i].zyls))!==-1){
						toastr.warning('有任务书助教包含该教师');
						return;
					}
				}else{
					if(codeArray.indexOf(parseInt(choosedTask[i].ls))!==-1){
						toastr.warning('有任务书任课教师包含该教师');
						return;
					}
				}
			}

			if(choosedTask[i].check){
				var row=choosedTask[i];
				row.lsmc=drawLsStr;
				row.ls=drawLsStr2;
				$(tableId).bootstrapTable('updateByUniqueId', {
					id: choosedTask[i].edu206_ID,
					row: row
				});
				// $(tableId).bootstrapTable('updateCell', {
				// 	index: i,
				// 	field: fieldName2,
				// 	value:  drawLsStr
				// });
				//
				//
				// $(tableId).bootstrapTable('updateCell', {
				// 	index: i,
				// 	field: fieldName1,
				// 	value:drawLsStr2
				// });
			}
		}
	}
	$.hideModal();
	toolTipUp(".myTooltip");
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
	putOutArray.push(row);
	checkPutOutInfo(putOutArray);
}

//批量发布任务书
function putOutTasks(){
	var choosedTasks = choosendCanPutTask;
	if (choosedTasks.length === 0) {
		toastr.warning('暂未选择任务书');
		return;
	}
	checkPutOutInfo(choosedTasks);
}

//检查任务书信息
function checkPutOutInfo(putOutArray){
	for (var i = 0; i < putOutArray.length; i++) {
		if(putOutArray[i].ls===""||putOutArray[i].ls==null){
			toastr.warning('有任务书暂未指定任课老师');
			return;
		}

		if(typeof putOutArray[i].classId==="undefined"||putOutArray[i].classId==null){
			toastr.warning('有任务书暂未指定班级');
			return;
		}

		if(typeof putOutArray[i].xnid==="undefined"||putOutArray[i].xnid==null||putOutArray[i].xnid==""){
			toastr.warning('有任务书暂未指定学年');
			return;
		}
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("所选    "+putOutArray.length+"  条任务书");
	$(".remindActionType").html("发布");
	//确认发布任务书
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		sendPutOutInfo(putOutArray);
		e.stopPropagation();
	});
}

//发送发布任务书的请求
function sendPutOutInfo(putOutArray){
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
			if (backjson.code === 200) {
				for (var i = 0; i < putOutArray.length; i++) {
					$("#scheduleClassesTable").bootstrapTable('removeByUniqueId', putOutArray[i].edu201_ID);
				}
				$.hideModal("#remindModal");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
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
				$("#putOutTasks").hide();
				stuffPutOutTaskTable(backjson.data);
				var reObject = new Object();
				reObject.InputIds = "#pyjhmc,#kcmc";
				reObject.normalSelectIds = "#department";
				reReloadSearchsWithSelect(reObject);
				if (typeof(IsmainAreaControl) === "undefined") {
					mainAreaControl();
				}
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosendPutOutTask=new Array();
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
		onCheck : function(row) {
			onCheckPutOutTask(row);
		},
		onUncheck : function(row) {
			onUncheckPutOutTask(row);
		},
		onCheckAll : function(rows) {
			onCheckAllPutOutTask(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllPutOutTask(rows2);
		},
		onPageChange: function() {
			drawPagination(".putOutTaskTableArea", "教学任务书");
			for (var i = 0; i < choosendPutOutTask.length; i++) {
				$("#putOutTaskTable").bootstrapTable("checkBy", {field:"edu201_ID", values:[choosendPutOutTask[i].edu201_ID]})
			}
		},
		onPostBody : function() {
			putOutTasksfxylcjControlBind();
			toolTipUp(".myTooltip");
		},
		onDblClickRow : function(row, $element, field) {
			choosendTeachers.length=0;
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
				sortable: true,
				visible: false
			},
			{
				field: 'className',
				title: '班级-(双击选择)',
				align: 'left',
				clickToSelect: false,
				sortable: true,
				formatter: classNameMatter
			},
			{
				field: 'xn',
				title: '学年-(双击选择)',
				align: 'left',
				clickToSelect: false,
				sortable: true,
				formatter: xnMatter
			},
			{
				field: 'pyjhmc',
				title: '培养计划名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'kcmc',
				title: '课程',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'fbsj',
				title: '发布时间',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},	{
				field: 'jxbrs',
				title: '教学班人数',
				align: 'left',
				sortable: true,
				visible: false,
				formatter: paramsMatter
			},	{
				field: 'lsmc',
				title: '任课老师-(双击选择)',
				clickToSelect: false,
				align: 'left',
				sortable: true,
				formatter: pointTeacherMatter
			},{
				field: 'zylsmc',
				title: '助教-(双击选择)',
				clickToSelect: false,
				align: 'left',
				sortable: true,
				formatter: pointTeacherMatter
			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'left',
				sortable: true,
				clickToSelect: false,
				formatter: putOutTasksfxylcjMatter
			},{
				field: 'zxs',
				title: '总学时',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},{
				field: 'kkbm',
				title: '开课部门-(双击选择)',
				align: 'left',
				sortable: true,
				formatter: putOutTaskkkbmMatter,
				visible: false,
				clickToSelect: false
			},	{
				field: 'pkbm',
				title: '排课部门-(双击选择)',
				align: 'left',
				sortable: true,
				formatter: putOutTaskpkbmMatter,
				visible: false,
				clickToSelect: false
			},{
				field: 'sszt',
				title: '审核状态',
				align: 'center',
				sortable: true,
				formatter: ztMatter
			},{
				field: 'fkyj',
				title: '反馈意见',
				align: 'left',
				sortable: true,
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
		if(row.sszt==="passing"){
			return [
                '<div class="noActionText">不可操作</div>'
				]
				.join('');
		}else if(row.sszt==="pass"){
			return [
				'<ul class="toolbar tabletoolbar" style="min-width: 500px;">' +
				'<li id="removeTask" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
				'</ul>'
			]
				.join('');
		}else{
			return [
				'<ul class="toolbar tabletoolbar" style="min-width: 500px;">' +
				'<li id="modifyTask" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
				'<li id="removeTask" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
				'</ul>'
			]
				.join('');
		}
	}

	function putOutTaskpkbmMatter(value, row, index) {
		if(value ==null||value ==="null"){
			return [
				'<span title="暂未安排" class="myTooltip normalTxt putOutTaskpkbmTxt putOutTaskpkbmTxt' + index + '">暂未安排</span><select class="myTableSelect myputOutTaskTableSelect' +
				index + '" id="putOutTaskpkbmSelect'+index+'">' + roleOptionObject.pkbm + '</select>'
			]
				.join('');
		}else{
			return [
				'<span title="'+row.pkbm+'" class="myTooltip putOutTaskpkbmTxt putOutTaskpkbmTxt' + index + '">' + row.pkbm + '</span><select class="myTableSelect myputOutTaskTableSelect' +
				index + '" id="putOutTaskpkbmSelect'+index+'">' + roleOptionObject.pkbm + '</select>'
			]
				.join('');
		}
	}

	function putOutTaskkkbmMatter(value, row, index) {
		if(value ==null||value ==="null"){
			return [
				'<span title="暂未安排" class="myTooltip normalTxt putOutTaskkkbmTxt putOutTaskkkbmTxt' + index + '">暂未安排</span><select class="myTableSelect mykkbmputOutTaskTableSelect' +
				index + '" id="putOutTaskkkbmSelect'+index+'">' + roleOptionObject.kkbm + '</select>'
			]
				.join('');
		}else{
			return [
				'<span title="'+row.kkbm+'" class="myTooltip putOutTaskkkbmTxt putOutTaskkkbmTxt' + index + '">' + row.kkbm + '</span><select class="myTableSelect mykkbmputOutTaskTableSelect' +
				index + '" id="putOutTaskkkbmSelect'+index+'">' + roleOptionObject.kkbm + '</select>'
			]
				.join('');
		}
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
	putOutTasksfxylcjControlBind();
}

//单选学生
function onCheckPutOutTask(row){
	if(choosendPutOutTask.length<=0){
		choosendPutOutTask.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendPutOutTask.length; i++) {
			if(choosendPutOutTask[i].edu201_ID===row.edu201_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendPutOutTask.push(row);
		}
	}
}

//单反选学生
function onUncheckPutOutTask(row){
	if(choosendPutOutTask.length<=1){
		choosendPutOutTask.length=0;
	}else{
		for (var i = 0; i < choosendPutOutTask.length; i++) {
			if(choosendPutOutTask[i].edu201_ID===row.edu201_ID){
				choosendPutOutTask.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllPutOutTask(row){
	for (var i = 0; i < row.length; i++) {
		choosendPutOutTask.push(row[i]);
	}
}

//全反选学生
function onUncheckAllPutOutTask(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu201_ID);
	}


	for (var i = 0; i < choosendPutOutTask.length; i++) {
		if(a.indexOf(choosendPutOutTask[i].edu201_ID)!==-1){
			choosendPutOutTask.splice(i,1);
			i--;
		}
	}
}

//已发布任务书表双击事件
function onDblClickputOutTaskTable(row, $element, field){
	if(row.sszt==="passing"){
		toastr.warning('不允许修改审核中的任务书');
		return;
	}
	var index =parseInt($element[0].dataset.index);
	if(field==="lsmc"){
		getLsInfo('#putOutTaskTable',index,"ls");
	}else if(field==="zylsmc"){
		getLsInfo('#putOutTaskTable',index,"zyls");
	}else if(field==="pkbm"){
		wantChangePutOutPKBM(index,"pkbm");
	}else if(field==="kkbm") {
		wantChangePutOutKKBM(index, "kkbm");
	}else if(field==="className"){
		wantChooseClass(row,"#putOutTaskTable");
	}else if(field==="xn"){
		wantChooseXn(row,"#putOutTaskTable");
	}else{
		return;
	}
}

//预备改变排课部门2
function wantChangePutOutPKBM(index,cellName){
	$('.putOutTaskpkbmTxt' + index).hide();
	$(".myputOutTaskTableSelect" + index).show();
	changePKBM("#putOutTaskpkbmSelect" + index,'.putOutTaskpkbmTxt' + index,".myputOutTaskTableSelect" + index,"#putOutTaskTable",index,cellName);
}

//预备改变开课部门2
function wantChangePutOutKKBM(index,cellName){
	$('.putOutTaskkkbmTxt' + index).hide();
	$(".mykkbmputOutTaskTableSelect" + index).show();
	changePKBM("#putOutTaskkkbmSelect" + index,'.putOutTaskkkbmTxt' + index,".mykkbmputOutTaskTableSelect" + index,"#putOutTaskTable",index,cellName);
}

//批量删除任务书
function removePutOutTasks(){
	var chosenTask = choosendPutOutTask;
	for (var i = 0; i < chosenTask.length; i++) {
		if(chosenTask[i].sszt==="passing"){
			toastr.warning('不能操作审核中的教学任务书');
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
	if(row.sszt==="passing"){
		toastr.warning('不能删除正在审核的教学任务书');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html('教学任务书');
	$(".remindActionType").html("删除");
	
	//确认删除
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
			hideloding();
			if (backjson.code===200) {
				for (var i = 0; i < removeArray.length; i++) {
					$("#putOutTaskTable").bootstrapTable('removeByUniqueId', removeArray[i]);
				}
				drawPagination(".putOutTaskTableArea", "教学任务书");
				$(".myTooltip").tooltipify();
				$.hideModal("#remindModal");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
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
				if(edu201.classId===row.classId&&edu201.kkbm===row.kkbm&&edu201.pkbm===row.pkbm&&edu201.ls===row.ls&&edu201.zyls===row.zyls&&edu201.pkbmCode===row.pkbmCode&&edu201.sfxylcj===row.sfxylcj){
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
	var sendArray=new Array();
	sendArray.push(row);

	//确认修改任务书
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		$.ajax({
			method : 'get',
			cache : false,
			url : "/putOutTask",
			data: {
				"taskInfo":JSON.stringify(sendArray) ,
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
				if (backjson.code === 200) {
					$('#putOutTaskTable').bootstrapTable("updateRow", {index: index, row: row});
					$.hideModal("#remindModal");
					toastr.success(backjson.msg);
					$(".myTooltip").tooltipify();
				} else {
					toastr.warning(backjson.msg);
				}
			}
		});
		e.stopPropagation();
	});
}

//检索已发布任务书
function startSearchPutOutTasks(){
	var kcmc=$("#putOutTaskKcmc").val();
	var putOutTaskLevel=getNormalSelectValue("putOutTaskLevel");
	var putOutTaskDepartment=getNormalSelectValue("putOutTaskDepartment");
	var putOutTaskGrade=getNormalSelectValue("putOutTaskGrade");
	var putOutTaskMajor=getNormalSelectValue("putOutTaskMajor");
	var putOutTaskYear=getNormalSelectValue("putOutTaskYear");

	if(kcmc===""&&putOutTaskLevel==""&&putOutTaskDepartment==""&&putOutTaskGrade==""
		&&putOutTaskMajor===""&&putOutTaskYear===""
	){
		toastr.warning('检索条件为空');
		return;
	}
	var serachObject=new Object();
	serachObject.level=putOutTaskLevel;
	serachObject.department=putOutTaskDepartment;
	serachObject.grade=putOutTaskGrade;
	serachObject.major=putOutTaskMajor;
	kcmc===""?serachObject.kcmc="":serachObject.kcmc=kcmc;
	serachObject.sszt="";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchPutOutTasks",
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
	$(".formtext,.scheduleClassesTableArea,.putOutTaskTableArea,#showputedTask,#startSearch,#reback,#removePutOutTasks,#startSearchPutOutTasks,#research1,#research2,.controlArea").toggle();
	var reObject = new Object();
	reObject.InputIds = "#putOutTaskKcmc";
	reObject.normalSelectIds = "#putOutTaskLevel,#putOutTaskDepartment,#putOutTaskGrade,#putOutTaskMajor,#putOutTaskYear";
	reReloadSearchsWithSelect(reObject);
}

//任务书审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="04";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
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

	//确认选择教师
	$('#confirmChoosedTeacher').unbind('click');
	$('#confirmChoosedTeacher').bind('click', function(e) {
		confirmChoosedTeacher(tableid,index,cellName);
		e.stopPropagation();
	});
}

//已发布任务书区域按钮绑定事件
function putOutTaskAreabtnBind() {
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
		reObject.InputIds = "#kcmc";
		reObject.normalSelectIds = "#putOutTaskLevel,#putOutTaskDepartment,#putOutTaskGrade,#putOutTaskMajor,#putOutTaskYear";
		reReloadSearchsWithSelect(reObject);
		showputedTask(false);
		e.stopPropagation();
	});

	$('#removePutOutTasks').unbind('click');
	$('#removePutOutTasks').bind('click', function(e) {
		removePutOutTasks();
		e.stopPropagation();
	});
}

//获取学期信息
function getSemesterInfo() {
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getAllXn",
		dataType: 'json',
		beforeSend: function (xhr) {
			requestErrorbeforeSend();
		},
		error: function (textStatus) {
			requestError();
		},
		complete: function (xhr, status) {
			requestComplete();
		},
		success: function (backjson) {
			hideloding();
			if (backjson.result) {
				if(backjson.termInfo.length===0){
					toastr.warning('暂无学年信息');
					return;
				}
				//初始化下拉框
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < backjson.termInfo.length; i++) {
					str += '<option value="' + backjson.termInfo[i].edu400_ID + '">' + backjson.termInfo[i].xnmc + '</option>';
				}
				stuffManiaSelect("#putOutTaskYear", str);
			} else {
				toastr.warning('操作失败，请重试');
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
		getSemesterInfo();
		LinkageSelectPublic("#putOutTaskLevel","#putOutTaskDepartment","#putOutTaskGrade","#putOutTaskMajor");
		showputedTask();
		putOutTaskAreabtnBind();
		$(".scheduleClassesSearchArea").hide();
		$(".putOutTaskSearchArea").show();
		e.stopPropagation();
	});
	
	// 重置检索可发布任务书
	$('#research1').unbind('click');
	$('#research1').bind('click', function(e) {
		var reObject = new Object();
		reObject.InputIds = "#pyjhmc,#kcmc";
		reObject.normalSelectIds = "#department";
		reReloadSearchsWithSelect(reObject);
		deafultSearch();
		e.stopPropagation();
	});
	
	//返回
	$('#reback').unbind('click');
	$('#reback').bind('click', function(e) {
		mainAreaControl();
		$(".scheduleClassesSearchArea").show();
		$(".putOutTaskSearchArea").hide();
		$("#putOutTasks").show();
		e.stopPropagation();
	});
}
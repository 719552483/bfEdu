$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	$("input[type='number']").inputSpinner();
	getDataPredtictionInfo();
	getAllDepartment();
	btnBind();
	//只选择年
	$("#add_year").datetimepicker({
		format : 'yyyy',
		language:'zh-CN',
		initialDate:new Date(),
		autoclose :true,
		todayHighlight:true,
		startView:4,
		minView :4,
		todayBtn: "linked",
	});
});

//获取预决算数据信息
function getDataPredtictionInfo() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getDataPredtiction",
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
				var edu800List=backjson.data.edu800List;
				var edu800SumList=backjson.data.edu800SumList;
				if(edu800List.length==0&&edu800SumList.length==0){
					toastr.warning("暂无预决算数据");
				}
				drawTab1(edu800List,edu800SumList);
				drawTab2(edu800List);
			} else {
				drawPredictionTableEmptyTable();
				drawDepartmentPredictionTableEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

/*
 * tab1
 */
function drawTab1(edu800List,edu800SumList) {
	// if(edu800List.length==0){
	// 	drawPredictionTableEmptyTable();
	// }else{
	// 	stuffPredictionTableEmptyTable(edu800List);
	// }
	//
	// if(edu800SumList.length==0){
	// 	drawDepartmentPredictionTableEmptyTable();
	// }else{
	// 	stuffDepartmentPredictionTableEmptyTable(edu800SumList);
	// }
}


/*
 * tab1 end
 */

/*
 * tab2
 */
function drawTab2(edu800List) {
	if(edu800List.length==0){
		drawDepartmentPredictionTableEmptyTable();
	}else{
		stuffDepartmentPredictionTableEmptyTable(edu800List);
	}
}

//渲染空的二级学院录入表
function drawDepartmentPredictionTableEmptyTable(){
	stuffDepartmentPredictionTableEmptyTable({});
}

var choosend=new Array();
//渲染二级学院录入表
function stuffDepartmentPredictionTableEmptyTable(tableInfo){
	window.releaseNewsEvents = {
		'click #modifyPrediction' : function(e, value, row, index) {
			modifyPrediction(row);
		},
		'click #deletePrediction' : function(e, value, row, index) {
			wantDeletePrediction(row);
		}
	};
	$('#departmentPredictionTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: '二级学院预决算导出'  //文件名称
		},
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onCheck : function(row) {
			onCheckXZB(row);
		},
		onUncheck : function(row) {
			onUncheckXZB(row);
		},
		onCheckAll : function(rows) {
			onCheckAllXZB(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllXZB(rows2);
		},
		onPageChange : function() {
			drawPagination(".departmentPredictionTableArea", "预决算信息");
			for (var i = 0; i < choosend.length; i++) {
				$("#departmentPredictionTable").bootstrapTable("checkBy", {field:"edu800_ID", values:[choosend[i].edu800_ID]})
			}
		},
		columns: [ {
			field : 'check',
			checkbox : true
		},  {
			field : 'edu800_ID',
			title: '唯一标识',
			align : 'center',
			sortable: true,
			visible : false
		},{
			field : 'departmentName',
			title : '二级学院',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'year',
			title : '年份',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'jsksf',
			title : '教师课时费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'wlkczy',
			title : '网络课程资源',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'yyglf',
			title : '人员管理费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'cdzlf',
			title : '场地租赁费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'jxyxsbf',
			title : '教学运行设备费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'pyfalzf',
			title : '培养方案论证费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'sxsbf',
			title : '实训设备费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'clf',
			title : '差旅费',
			align : 'left',
			sortable: true,
			formatter :paramsMatter
		},{
			field : 'personName',
			title : '录入人',
			align : 'left',
			sortable: true,
			formatter :paramsMatter,
			visible : false
		},{
			field : 'createDate',
			title : '录入时间',
			align : 'left',
			sortable: true,
			formatter :paramsMatter,
			visible : false
		},{
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : releaseNewsFormatter,
			events : releaseNewsEvents,
		} ]
	});

	function releaseNewsFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li class="modifyBtn" id="modifyPrediction"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
		+ '<li class="deleteBtn" id="deletePrediction"><span><img src="images/t03.png" style="width:24px"></span>删除</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".departmentPredictionTableArea", "预决算信息");
	drawSearchInput(".departmentPredictionTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".departmentPredictionTableArea", "预决算信息");
}

//单选
function onCheck(row){
	if(choosend.length<=0){
		choosend.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].edu800_ID===row.edu800_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosend.push(row);
		}
	}
}

//单反选
function onUncheck(row){
	if(choosend.length<=1){
		choosend.length=0;
	}else{
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].edu800_ID===row.edu800_ID){
				choosend.splice(i,1);
			}
		}
	}
}

//全选
function onCheckAll(row){
	for (var i = 0; i < row.length; i++) {
		choosend.push(row[i]);
	}
}

//全反选
function onUncheckAll(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu800_ID);
	}


	for (var i = 0; i < choosend.length; i++) {
		if(a.indexOf(choosend[i].edu800_ID)!==-1){
			choosend.splice(i,1);
			i--;
		}
	}
}

//预备修改
function modifyPrediction(row){

}

//发送修改请求
function modifyPrediction(row){

}

//单个删除
function wantDeletePrediction(row){

}

//多选删除
function wantDeletePredictions(){

}

//发送删除请求
function modifyPrediction(deleteIds){

}

//预备录入二级学院数据
function wantAddDepartmentDataPrediction(){
	emptyModal();
	$.showModal("#addModal",true);
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", false) // 取消input元素为readonly
}

//确认新增数据
function confirmAddDepartmentDataPrediction(){
	var departmentDataPrediction=getDepartmentDataPrediction();
	if(typeof departmentDataPrediction==="undefined"){
		return;
	}
	var allDepartmentPrediction = $("#departmentPredictionTable").bootstrapTable("getData");
	for (var i = 0; i < allDepartmentPrediction.length; i++) {
		if(allDepartmentPrediction[i].year===departmentDataPrediction.year){
			toastr.warning(allDepartmentPrediction[i].year+"年预决算数据已存在");
			return ;
		}
	}

	$.ajax({
		method : 'get',
		cache : false,
		url : "/saveFinanceInfo",
		data: {
			"financeInfo":JSON.stringify(departmentDataPrediction)
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
				$('#departmentPredictionTable').bootstrapTable("prepend", backjson.data);
				toolTipUp(".myTooltip");
				$.hideModal("#addModal");
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}
/*
 * tab2 end
 */

//清空模态框
function emptyModal(){
	var reObject = new Object();
	reObject.InputIds = "#add_year";
	reObject.numberInputs = "#add_jsks,#add_wlkczy,#add_yyglf,#add_cdzlf,#add_jxyxsbf,#add_pyfalzf,#add_sxsb,#add_clf";
	reObject.normalSelectIds = "#add_department";
	reReloadSearchsWithSelect(reObject);
}

//查询全部二级学院
function getAllDepartment(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllDepartment",
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
				var selectInfo=backjson.data;
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var i = 0; i < selectInfo.length; i++) {
					str += '<option value="' + selectInfo[i].edu104_ID + '">' + selectInfo[i].xbmc
						+ '</option>';
				}
				stuffManiaSelect("#add_department", str);
			} else {
				toastr.info(backjson.msg);
			}
		}
	});
}

//获取新增数据
function getDepartmentDataPrediction(){
	var departmentCode=getNormalSelectValue("add_department");
	var departmentName=getNormalSelectText("add_department");
	var year=$("#add_year").val();

	var jsks=$("#add_jsks").val();
	var wlkczy=$("#add_wlkczy").val();
	var yyglf=$("#add_yyglf").val();
	var cdzlf=$("#add_cdzlf").val();
	var jxyxsbf=$("#add_jxyxsbf").val();
	var pyfalzf=$("#add_pyfalzf").val();
	var sxsb=$("#add_sxsb").val();
	var clf=$("#add_clf").val();

	if(departmentCode===""){
		toastr.warning("二级学院不能为空");
		return ;
	}
	if(year===""){
		toastr.warning("年份不能为空");
		return ;
	}
	if(jsks===""){
		toastr.warning("教师课时费不能为空");
		return ;
	}
	if(wlkczy===""){
		toastr.warning("网络课程资源不能为空");
		return ;
	}
	if(yyglf===""){
		toastr.warning("人员管理费不能为空");
		return ;
	}
	if(cdzlf===""){
		toastr.warning("场地租赁费不能为空");
		return ;
	}
	if(jxyxsbf===""){
		toastr.warning("教学运行设备费不能为空");
		return ;
	}
	if(pyfalzf===""){
		toastr.warning("培养方案论证费不能为空");
		return ;
	}
	if(sxsb===""){
		toastr.warning("实训设备费不能为空");
		return ;
	}
	if(clf===""){
		toastr.warning("差旅费不能为空");
		return ;
	}

	if(jsks==="0"&&wlkczy==="0"&&yyglf==="0"&&cdzlf==="0"&&jxyxsbf==="0"&&pyfalzf==="0"&&sxsb==="0"&&clf==="0"){
		toastr.warning("所有费用总和为0");
		return ;
	}

	var returnObject=new Object();
	returnObject.departmentCode=departmentCode;
	returnObject.departmentName=departmentName;
	returnObject.year=year;
	returnObject.jsksf=jsks;
	returnObject.wlkczy=wlkczy;
	returnObject.yyglf=yyglf;
	returnObject.cdzlf=cdzlf;
	returnObject.jxyxsbf=jxyxsbf;
	returnObject.pyfalzf=pyfalzf;
	returnObject.sxsbf=sxsb;
	returnObject.clf=clf;
	returnObject.createPerson=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span").attr("userId");
	returnObject.personName=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;;
	return returnObject;
}

//页面初始化时按钮事件绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//录入二级学院数据
	$('#wantAddDepartmentDataPrediction').unbind('click');
	$('#wantAddDepartmentDataPrediction').bind('click', function(e) {
		wantAddDepartmentDataPrediction();
		e.stopPropagation();
	});

	//批量删除二级学院数据
	$('#wantDeletePredictions').unbind('click');
	$('#wantDeletePredictions').bind('click', function(e) {
		wantDeletePredictions();
		e.stopPropagation();
	});

	//确认录入二级学院数据
	$('.confirmBtn').unbind('click');
	$('.confirmBtn').bind('click', function(e) {
		confirmAddDepartmentDataPrediction();
		e.stopPropagation();
	});
}

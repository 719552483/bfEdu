var EJDMElementInfo;
var allLocation;
$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	allLocation=queryAllLocationInfo();
	stuffEJDElement(EJDMElementInfo);
	getMajorAdministrationClassSelectInfo();
	drawAdministrationClassEmptyTable();
	btnBind();
	$("input[type='number']").inputSpinner();
	deafultSearch();
});

// 查询所有归属地
function queryAllLocationInfo(){
	var queryRs;
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/searchAllLocal",
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code == 200) {
				queryRs=backjson.data;
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
	return queryRs;
}


//初始化检索
function deafultSearch(){
	var serachObject=new Object();
	serachObject.level="";
	serachObject.department="";
	serachObject.grade="";
	serachObject.major="";
	serachObject.className="";

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClass",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
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
				toastr.info(backjson.msg);
				stuffAdministrationClassTable(backjson.data);
			} else {
				drawAdministrationClassEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}
/*
 * tab1
 */
//获取-行政班管理- 有逻辑关系select信息
function getMajorAdministrationClassSelectInfo() {
	LinkageSelectPublic("#level","#department","#grade","#major");

	$("#major").change(function() {
		var nouNullSearch=getNotNullSearchs();
		var className = $("#AdministrationClassName").val();
		if(typeof nouNullSearch ==='undefined'){
			return;
		}
		className===""?nouNullSearch.className="":nouNullSearch.className=className;
		$.ajax({
			method : 'get',
			cache : false,
			url : "/searchAdministrationClass",
			data: {
				"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
				"SearchCriteria":JSON.stringify(nouNullSearch)
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
					dropConfigOption("#major");
					toastr.info(backjson.msg);
					stuffAdministrationClassTable(backjson.data);
				} else {
					drawAdministrationClassEmptyTable();
					toastr.warning(backjson.msg);
				}
			}
		});
	});
}

//填充空行政班表
function drawAdministrationClassEmptyTable(){
	stuffAdministrationClassTable({});
}

var choosendXzb=new Array();
//填充行政班表
function stuffAdministrationClassTable(tableInfo){
	window.releaseNewsEvents = {
			'click #removeAdministrationClass' : function(e, value, row, index) {
				removeAdministrationClass(row);
			},
			'click #administrationClassInfo' : function(e, value, row, index) {
				administrationClassInfo(row);
			},
			'click #modifyAdministrationClass' : function(e, value, row, index) {
				modifyAdministrationClass(row);
			}
		};

		$('#administrationClassTable').bootstrapTable('destroy').bootstrapTable({
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
			    fileName: '行政班导出'  //文件名称
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
				drawPagination(".administrationClassTableArea", "行政班信息");
				for (var i = 0; i < choosendXzb.length; i++) {
					$("#administrationClassTable").bootstrapTable("checkBy", {field:"edu300_ID", values:[choosendXzb[i].edu300_ID]})
				}
			},
			onPostBody: function() {
				toolTipUp(".myTooltip");
			},
			columns: [ {
				field : 'check',
				checkbox : true
			},  {
				field : 'edu300_ID',
				title: '唯一标识',
				align : 'center',
				sortable: true,
				visible : false
			},{
				field : 'pyccmc',
				title : '培养层次',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			}, {
				field : 'xbmc',
				title : '所属二级学院',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'njmc',
				title : '年级',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'zymc',
				title : '专业',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'batchName',
				title : '批次',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},{
				field : 'localName',
				title : '归属地',
				align : 'left',
				sortable: true,
				formatter :paramsMatter
			},  {
				field : 'xzbmc',
				title : '行政班名称',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'xzbbh',
				title : '行政班班号',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},
			{
				field : 'xzbdm',
				title : '行政班代码',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'xzbbm',
				title : '行政班编码',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},{
				field : 'zxrs',
				title : '在校人数',
				align : 'left',
				sortable: true,
				formatter : paramsMatter
			},
			// 	{
			// 	field : 'rnrs',
			// 	title : '容纳人数',
			// 	align : 'left',
			// 	sortable: true,
			// 	formatter : rnrsMatter
			// },
				{
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
					+ '<li class="queryBtn" id="administrationClassInfo"><span><img src="img/info.png" style="width:24px"></span>详情</li>'
					+ '<li class="modifyBtn" id="modifyAdministrationClass"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
					+ '<li class="deleteBtn" id="removeAdministrationClass"><span><img src="images/t03.png"></span>删除</li>'
					+ '</ul>' ].join('');
		}

		// function rnrsMatter(value, row, index) {
		// 	if(row.rnrs===0){
		// 		return [ '<div class="myTooltip normalTxt" title="暂未定额">暂未定额</div>' ].join('');
		// 	}else{
		// 		return [ '<div class="myTooltip" title="'+row.rnrs+'">'+row.rnrs+'人</div>' ].join('');
		// 	}
		// }

		drawPagination(".administrationClassTableArea", "行政班信息");
		drawSearchInput(".administrationClassTableArea");
		changeTableNoRsTip();
		toolTipUp(".myTooltip");
		changeColumnsStyle(".administrationClassTableArea", "行政班信息");
		btnControl();
}

//单选学生
function onCheckXZB(row){
	if(choosendXzb.length<=0){
		choosendXzb.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendXzb.length; i++) {
			if(choosendXzb[i].edu300_ID===row.edu300_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendXzb.push(row);
		}
	}
}

//单反选学生
function onUncheckXZB(row){
	if(choosendXzb.length<=1){
		choosendXzb.length=0;
	}else{
		for (var i = 0; i < choosendXzb.length; i++) {
			if(choosendXzb[i].edu300_ID===row.edu300_ID){
				choosendXzb.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllXZB(row){
	for (var i = 0; i < row.length; i++) {
		choosendXzb.push(row[i]);
	}
}

//全反选学生
function onUncheckAllXZB(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu300_ID);
	}


	for (var i = 0; i < choosendXzb.length; i++) {
		if(a.indexOf(choosendXzb[i].edu300_ID)!==-1){
			choosendXzb.splice(i,1);
			i--;
		}
	}
}

//查看行政班详情
function administrationClassInfo(row){
	$.showModal("#addAdministrationClassModal",false);
	$("#addAdministrationClassModal").find(".moadalTitle").html(row.pyccmc+'/'+row.xbmc+'/'+row.njmc+'/'+row.zymc+"-"+row.xzbmc);
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", true) // 将input元素设置为readonly
	$(".myabeNoneTipBtn,.addAdministrationClass_classCodeArea,.addAdministrationClass_selfNumArea").hide();
	$(".addAdministrationClass_classCodeArea").show();
	$(".addAdministrationClassTip").find(".canNotModifythings").remove();
	stuffAdministrationClassDetails(row,false);
}

//填充行政班详情
function stuffAdministrationClassDetails(row,ismodify){
	var str='';
	//批次
	if(ismodify){
		for (var i = 0; i < EJDMElementInfo.pclx.length; i++) {
			if(EJDMElementInfo.pclx[i].ejdm===row.batch){
				str = '<option value="' + EJDMElementInfo.pclx[i].ejdm + '">' + EJDMElementInfo.pclx[i].ejdmz+ '</option>';
			}
		}
		for (var i = 0; i < EJDMElementInfo.pclx.length; i++) {
			if(EJDMElementInfo.pclx[i].ejdm!==row.batch){
				str += '<option value="' + EJDMElementInfo.pclx[i].ejdm + '">' + EJDMElementInfo.pclx[i].ejdmz+ '</option>';
			}
		}
	}else{
		str = '<option value="' + row.batch + '">' + row.batchName+ '</option>';
	}
	stuffManiaSelect('#addAdministrationClass_batch', str);

	str='';
	//归属地
	if(ismodify){
		for (var i = 0; i < allLocation.length; i++) {
			if(allLocation[i].edu500Id==parseInt(row.localCode)){
				str = '<option value="' + allLocation[i].edu500Id + '">' + allLocation[i].localName+ '</option>';
			}
		}
		for (var i = 0; i < allLocation.length; i++) {
			if(allLocation[i].edu500Id!=parseInt(row.localCode)){
				str += '<option value="' + allLocation[i].edu500Id + '">' + allLocation[i].localName+ '</option>';
			}
		}
	}else{
		str = '<option value="' + row.localCode + '">' + row.localName+ '</option>';
	}
	stuffManiaSelect('#addAdministrationClass_local', str);

	actionStuffManiaSelectWithDeafult("#addAdministrationClass_level",row.pyccbm,row.pyccmc); //层次
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_department",row.xbbm,row.xbmc); //二级学院
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_garde",row.njbm,row.njmc); //年级
	actionStuffManiaSelectWithDeafult("#addAdministrationClass_major",row.zybm,row.zymc); //专业
	$("#addAdministrationClass_classCode").val(row.xzbbh);
	$("#addAdministrationClass_className").val(row.xzbmc);
	// $("#addAdministrationClass_houldNum").val(row.rnrs);
	$("#addAdministrationClass_selfNum").val(row.zdybjxh);
}

//检查是否能操作行政班
function checkAdministrationClass(edu300ids){
	var returnData="";
	$.ajax({
		method: 'post',
		cache: false,
		url: "/checkClassUsed",
		data:{
			"classIds": JSON.stringify(edu300ids)
		},
		async:false,
		dataType: 'json',
		success: function(backjson) {
			if(backjson.code===200) {
				returnData="T"
			}else{
				returnData="F"
			}
		}
	});
	return returnData;
}


//预备修改行政班
function modifyAdministrationClass(row){
	var checkArray=new Array();
	checkArray.push(row.edu300_ID);
    var sfsckkjh=checkAdministrationClass(checkArray);
	if(sfsckkjh==="T"){
		toastr.warning('不能修改已生成开课计划的班级');
		return;
	}
	$.showModal("#addAdministrationClassModal",true);
	$("#addAdministrationClassModal").find(".moadalTitle").html(row.pyccmc+'/'+row.xbmc+'/'+row.njmc+'/'+row.zymc+"-"+row.xzbmc);
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	$(".myabeNoneTipBtn,.canNotModifythings").show();
	$(".addAdministrationClass_classCodeArea").hide();
	$(".addAdministrationClassTip").find("label:lt(4)").after('<samll class="canNotModifythings"><br />(不可改)</samll>');
	stuffAdministrationClassDetails(row,true);
	//确认修改行政班
	$('.confirmAddAdministrationClass').unbind('click');
	$('.confirmAddAdministrationClass').bind('click', function(e) {
		confirmModifyAdministrationClass(row);
		e.stopPropagation();
	});
}

//确认修改行政班
function confirmModifyAdministrationClass(row){
	var NotNullSearchs=getNotNullSearchs();
	if(typeof NotNullSearchs ==='undefined'){
		return;
	}
	// if ($("#addAdministrationClass_houldNum").val()!==""&&isNaN($("#addAdministrationClass_houldNum").val())) {
	// 	toastr.warning('容纳人数只接受数字参数');
	// 	return;
	// }

	var newClassInfo=getAdministrationClassDetails(true);
	newClassInfo.edu300_ID=row.edu300_ID;
	newClassInfo.xzbmc=$("#addAdministrationClass_className").val();
	// newClassInfo.rnrs=$("#addAdministrationClass_houldNum").val();
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/modifyAdministrationClass",
		data: {
             "modifyInfo":JSON.stringify(newClassInfo),
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
				if(backjson.namehave){
					toastr.warning('班级名称已存在');
					return;
				}
				hideloding();
				$("#administrationClassTable").bootstrapTable('updateByUniqueId', {
					id: newClassInfo.edu300_ID,
					row: newClassInfo
				});
				$.hideModal("#addAdministrationClassModal");
				toolTipUp(".myTooltip");
				drawPagination(".administrationClassTableArea", "行政班信息");
				toastr.success('修改成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//预备添加行政班
function wantAddAdministrationClass(){
	$(".addAdministrationClassTip").find(".canNotModifythings").remove();
	emptyAdministrationClassDetailsArea();
	$(".canNotModifythings,.addAdministrationClass_classCodeArea").hide();
	$(".addAdministrationClass_selfNumArea").show();
	$("#addAdministrationClass_selfNum").val("");
	$.showModal("#addAdministrationClassModal",true);
	$("#addAdministrationClassModal").find(".moadalTitle").html("新增行政班");
	$('.addAdministrationClassTip').find(".myInput").attr("disabled", false) // 将input元素设置为readonly
	//确认新增行政班
	$('.confirmAddAdministrationClass').unbind('click');
	$('.confirmAddAdministrationClass').bind('click', function(e) {
		confirmAddAdministrationClass();
		e.stopPropagation();
	});
}

//确认新增行政班
function confirmAddAdministrationClass(){
	var newAdministrationClassObject=getAdministrationClassDetails(false);
	if(typeof newAdministrationClassObject ==='undefined'){
		return;
	}
	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addAdministrationClass",
		data: {
             "addInfo":JSON.stringify(newAdministrationClassObject)
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
				if(backjson.namehave){
					toastr.warning('班级名称已存在');
					return;
				}
				if(backjson.numhave){
					toastr.warning('自定义班级序号已存在');
					return;
				}
				newAdministrationClassObject.edu300_ID=backjson.id;
				newAdministrationClassObject.xqmc=backjson.xqmc;
				newAdministrationClassObject.xqbm=backjson.xqbm;
				newAdministrationClassObject.yxbz=backjson.yxbz;
				newAdministrationClassObject.sfsckkjh=backjson.sfsckkjh;
				newAdministrationClassObject.xzbbh=backjson.xzbbh;
				newAdministrationClassObject.xzbdm=backjson.xzbdm;
				newAdministrationClassObject.xzbbm=backjson.xzbbm;

				$('#administrationClassTable').bootstrapTable("prepend", newAdministrationClassObject);
				$.hideModal("#addAdministrationClassModal");
				toolTipUp(".myTooltip");
				drawPagination(".administrationClassTableArea", "行政班信息");
				toastr.success('新增行政班成功');
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//获取新增行政班信息
function getAdministrationClassDetails(ismodify){
//	if(getNormalSelectValue("addAdministrationClass_campus") === ""){
//		toastr.warning('校区不能为空');
//		return;
//	}
	if(getNormalSelectValue("addAdministrationClass_level") === ""){
		toastr.warning('层次不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_department") === ""){
		toastr.warning('二级学院不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_garde") === ""){
		toastr.warning('年级不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_major") === ""){
		toastr.warning('专业不能为空');
		return;
	}
	if(getNormalSelectValue("addAdministrationClass_batch") === ""){
		toastr.warning('批次不能为空');
		return;
	}

	if(getNormalSelectValue("addAdministrationClass_local") === ""){
		toastr.warning('归属地不能为空');
		return;
	}

	if($("#addAdministrationClass_selfNum").val() === ""){
		toastr.warning('自定义班级序号不能为空');
		return;
	}
	if(!checkIsNumber($("#addAdministrationClass_selfNum").val()) && $("#addAdministrationClass_selfNum").val()!==""){
		toastr.warning('自定义班级序号必须是数字');
		return;
	}
//	if($("#addAdministrationClass_classCode").val() === ""){
//		toastr.warning('班号不能为空');
//		return;
//	}
	if($("#addAdministrationClass_className").val() === ""){
		toastr.warning('班级名称不能为空');
		return;
	}
	// if ($("#addAdministrationClass_houldNum").val()!==""&&isNaN($("#addAdministrationClass_houldNum").val())) {
	// 	toastr.warning('容纳人数只接受数字参数');
	// 	return;
	// }

	var newClassObject=new Object();
	newClassObject.xzbmc=$("#addAdministrationClass_className").val();
//	newClassObject.xzbbh=$("#addAdministrationClass_classCode").val();
	newClassObject.pyccmc=getNormalSelectText("addAdministrationClass_level");
	newClassObject.pyccbm=getNormalSelectValue("addAdministrationClass_level");
	newClassObject.xbmc=getNormalSelectText("addAdministrationClass_department");
	newClassObject.xbbm=getNormalSelectValue("addAdministrationClass_department");
	newClassObject.njbm=getNormalSelectValue("addAdministrationClass_garde");
	newClassObject.njmc=getNormalSelectText("addAdministrationClass_garde");
	newClassObject.zybm=getNormalSelectValue("addAdministrationClass_major");
	newClassObject.zymc=getNormalSelectText("addAdministrationClass_major");
	newClassObject.batch=getNormalSelectValue("addAdministrationClass_batch");
	newClassObject.batchName=getNormalSelectText("addAdministrationClass_batch");
	newClassObject.localCode=getNormalSelectValue("addAdministrationClass_local");
	ismodify?newClassObject.localName=getNormalSelectText("addAdministrationClass_local"):newClassObject.localName=getNormalSelectText("addAdministrationClass_local").split('-')[1];
	newClassObject.zdybjxh=$("#addAdministrationClass_selfNum").val();
//	newClassObject.xqmc=getNormalSelectText("addAdministrationClass_campus");
//	newClassObject.xqbm=getNormalSelectValue("addAdministrationClass_campus");
	newClassObject.zxrs=0;
	newClassObject.rnrs=0;
	// $("#addAdministrationClass_houldNum").val()===""?newClassObject.rnrs=0:newClassObject.rnrs=parseInt($("#addAdministrationClass_houldNum").val());
	return newClassObject;
}

//重新渲染新增行政班区域
function emptyAdministrationClassDetailsArea(){
	stuffEJDElement(EJDMElementInfo); //校区
	LinkageSelectPublic("#addAdministrationClass_level","#addAdministrationClass_department","#addAdministrationClass_garde","#addAdministrationClass_major"); //联动select
	var reObject = new Object();
	reObject.InputIds = "#addAdministrationClass_className";
	reObject.actionSelectIds = "#addAdministrationClass_department,#addAdministrationClass_garde,#addAdministrationClass_major";
	reReloadSearchsWithSelect(reObject);

	//归属地
	var str='<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i <allLocation.length ; i++) {
		str += '<option value="' + allLocation[i].edu500Id + '">'+allLocation[i].city+' - ' + allLocation[i].localName+ '</option>';
	}
	stuffManiaSelect('#addAdministrationClass_local', str);
}

//单个删除行政班
function removeAdministrationClass(row){
	var checkArray=new Array();
	checkArray.push(row.edu300_ID);
	var sfsckkjh=checkAdministrationClass(checkArray);
	if(sfsckkjh==="T"){
		toastr.warning('不能删除已生成开课计划的班级');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("行政班 -"+row.xzbmc);
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		removeArray.push(row.edu300_ID);
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//多选删除行政班
function removeAdministrationClasses() {
	var chosenclasses = choosendXzb;
	if (chosenclasses.length === 0) {
		toastr.warning('暂未选择任何班级');
		return;
	}

	var checkArray=new Array();
	for (var i = 0; i < chosenclasses.length; i++) {
		checkArray.push(chosenclasses[i].edu300_ID);
	}
	var sfsckkjh=checkAdministrationClass(checkArray);
	if(sfsckkjh==="T"){
		toastr.warning('不能删除已生成开课计划的班级');
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("已选行政班");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeArray = new Array;
		for (var i = 0; i < chosenclasses.length; i++) {
			removeArray.push(chosenclasses[i].edu300_ID);
		}
		sendLvelRemoveInfo(removeArray);
		e.stopPropagation();
	});
}

//发送删除培养计划下的专业课程请求
function sendLvelRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeAdministrationClass",
		data: {
             "deleteIds":JSON.stringify(removeArray)
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
				tableRemoveAction("#administrationClassTable", removeArray, ".administrationClassTableArea", "行政班信息");
				$.hideModal("#remindModal");
				$(".myTooltip").tooltipify();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//检索行政班
function startSearchAdministrationClass(){
	var nouNullSearch=getNotNullSearchs();
	var className = $("#AdministrationClassName").val();
	if(typeof nouNullSearch ==='undefined'){
		return;
	}
	var serachObject=new Object();
	serachObject.level=nouNullSearch.level;
	serachObject.department=nouNullSearch.department;
	serachObject.grade=nouNullSearch.grade;
	serachObject.major=nouNullSearch.major;
	className===""?serachObject.className="":serachObject.className=className;

	// 发送查询所有用户请求
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAdministrationClass",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue,
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
				toastr.info(backjson.msg);
				stuffAdministrationClassTable(backjson.data);
			} else {
				drawAdministrationClassEmptyTable();
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重置检索
function reReloadAdministrationClassSearchs() {
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.InputIds = "#AdministrationClassName";
	reObject.actionSelectIds = "#department,#grade,#major";
	reReloadSearchsWithSelect(reObject);
	deafultSearch();
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

//页面初始化时按钮事件绑定
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//预备新增行政班
	$('#wantAddAdministrationClass').unbind('click');
	$('#wantAddAdministrationClass').bind('click', function(e) {
		wantAddAdministrationClass();
		e.stopPropagation();
	});

	//批量删除行政班
	$('#removedministrationClasses').unbind('click');
	$('#removedministrationClasses').bind('click', function(e) {
		removeAdministrationClasses();
		e.stopPropagation();
	});

	//检索行政班
	$('#startSearchAdministrationClass').unbind('click');
	$('#startSearchAdministrationClass').bind('click', function(e) {
		startSearchAdministrationClass();
		e.stopPropagation();
	});

	//重置检索
	$('#reReloadSearchsAdministrationClass').unbind('click');
	$('#reReloadSearchsAdministrationClass').bind('click', function(e) {
		reReloadAdministrationClassSearchs();
		e.stopPropagation();
	});
}

/*
 * tab2
 */
// 判断是否是第一加载tab2的内容
function judgmentIsFristTimeLoadTab2() {
	var isFirstShowTab2 = $(".isFirstShowTab2")[0].innerText;
	if (isFirstShowTab2 === "T") {
		stuffEmptyTeachingClassTable();
		addTeachingClassBtnbind();
		allteachingClassAreaStartSearch();
		$(".isFirstShowTab2").html("F");
	}
}

// 添加教学班区域初始化时按钮事件绑定
function addTeachingClassBtnbind() {
	// 批量删除
	$('#removeTeachingClasses').unbind('click');
	$('#removeTeachingClasses').bind('click', function(e) {
		removeTeachingClasses();
		e.stopPropagation();
	});

	// 教学班导出点名表
	$('#exportRollcallTable').unbind('click');
	$('#exportRollcallTable').bind('click', function(e) {
		exportRollcallTable();
		e.stopPropagation();
	});

	// 开始检索
	$('#allteachingClassArea_startSearch').unbind('click');
	$('#allteachingClassArea_startSearch').bind('click', function(e) {
		allteachingClassAreaStartSearch();
		e.stopPropagation();
	});

	// 重置检索
	$('#allteachingClassArea_reSearch').unbind('click');
	$('#allteachingClassArea_reSearch').bind('click', function(e) {
		allteachingClassAreaReSearch();
		e.stopPropagation();
	});

	//新增教学班
	$('#addTeachingClass').unbind('click');
	$('#addTeachingClass').bind('click', function(e) {
		addTeachingClass();
		e.stopPropagation();
	});
}

//新增教学班
function addTeachingClass(){
	getAllXzb({});
	stuffChoosendXzb({});
	$("#newNAME").val("");
	$.showModal("#modifyTeachingClassModal",true);
	$("#modifyTeachingClassModal").find(".moadalTitle").html("新增教学班");
	//确认按钮
	$('.confirmModifyTeachingClass').unbind('click');
	$('.confirmModifyTeachingClass').bind('click', function(e) {
		confirmModifyTeachingClass(false);
		e.stopPropagation();
	});
}

//填充空的教学班列表
function stuffEmptyTeachingClassTable(){
	stuffTeachingClassTable({});
}

// 获取教学班列表信息
function getAllTeachingClassInfo(isReturnLastPage) {
	var notNullSearchs=teachingClassTetNotNullSearchs();
	if(typeof notNullSearchs ==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllTeachingClasses2",
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
			hideloding();
			if (backjson.code===200) {
				stuffTeachingClassTable(backjson.data);
				if (isReturnLastPage) {
					changeClassManagementShowArea();
					addTeachingClassBtnbind();
				}
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosendJxb=new Array();
// 填充教学班列表
function stuffTeachingClassTable(tableInfo) {
	window.teachingClassEvents = {
		'click #modifyTeachingClassName' : function(e, value, row, index) {
			modifyTeachingClass(row, index);
		},
		'click #removeTeachingClass' : function(e, value, row, index) {
			removeTeachingClass(row);
		}
	};

	$('#teachingClassTable').bootstrapTable('destroy').bootstrapTable({
		data :tableInfo,
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
		    fileName: '教学班导出'  //文件名称
		},
		search : true,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : true,
		onCheck : function(row) {
			onCheckJxb(row);
		},
		onUncheck : function(row) {
			onUncheckJxb(row);
		},
		onCheckAll : function(rows) {
			onCheckAllJxb(rows);
		},
		onUncheckAll : function(rows,rows2) {
			onUncheckAllJxb(rows2);
		},
		onPageChange : function() {
			drawPagination(".teachingClassTableArea", "教学班信息");
			for (var i = 0; i < choosendJxb.length; i++) {
				$("#teachingClassTable").bootstrapTable("checkBy", {field:"edu301_ID", values:[choosendJxb[i].edu301_ID]})
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [ {
			field : 'check',
			checkbox : true
		},	{
			field: 'edu301_ID',
			title: '唯一标识',
			align: 'center',
			sortable: true,
			visible: false
		},{
			field : 'jxbmc',
			title : '教学班名称',
			align : 'left',
			sortable: true,
			formatter : paramsMatter,
		},{
			field : 'zymc',
			title : '专业',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		}, {
			field : 'bhxzbmc',
			title : '班级',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		}, {
			field : 'jxbrs',
			title : '教学班人数',
			align : 'left',
			sortable: true,
			formatter : paramsMatter
		}, {
			field : 'action',
			title : '操作',
			align : 'center',
			clickToSelect : false,
			formatter : teachingClassFormatter,
			events : teachingClassEvents,
		} ]
	});

	function teachingClassFormatter(value, row, index) {
		return [ '<ul class="toolbar tabletoolbar">'
		+ '<li id="modifyTeachingClassName"><span><img src="images/t02.png" style="width:24px"></span>修改</li>'
		+ '<li id="removeTeachingClass"><span><img src="images/t03.png"></span>删除</li>'
		+ '</ul>' ].join('');
	}

	drawPagination(".teachingClassTableArea", "教学班信息");
	changeColumnsStyle(".teachingClassTableArea", "教学班信息");
	drawSearchInput(".teachingClassTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//单选学生
function onCheckJxb(row){
	if(choosendJxb.length<=0){
		choosendJxb.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosendJxb.length; i++) {
			if(choosendJxb[i].edu301_ID===row.edu301_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosendJxb.push(row);
		}
	}
}

//单反选学生
function onUncheckJxb(row){
	if(choosendJxb.length<=1){
		choosendJxb.length=0;
	}else{
		for (var i = 0; i < choosendJxb.length; i++) {
			if(choosendJxb[i].edu301_ID===row.edu301_ID){
				choosendJxb.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllJxb(row){
	for (var i = 0; i < row.length; i++) {
		choosendJxb.push(row[i]);
	}
}

//全反选学生
function onUncheckAllJxb(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].edu301_ID);
	}


	for (var i = 0; i < choosendJxb.length; i++) {
		if(a.indexOf(choosendJxb[i].edu301_ID)!==-1){
			choosendJxb.splice(i,1);
			i--;
		}
	}
}

// 修改教学班
function modifyTeachingClass(row, index) {
	var sendArray=new Array();
	sendArray.push(row.edu301_ID);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkTeachingClassInTask",
		data: {
			"classIds":JSON.stringify(sendArray)
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
				$.showModal("#modifyTeachingClassModal",true);
				$("#modifyTeachingClassModal").find(".moadalTitle").html("修改教学班");
				$("#newNAME").val(row.jxbmc);
				stuffChoosendXzb(row,index);
				stuffAllXzb(row,index);
				//确认按钮
				$('.confirmModifyTeachingClass').unbind('click');
				$('.confirmModifyTeachingClass').bind('click', function(e) {
					confirmModifyTeachingClass(true,row);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

// 单个删除教学班
function removeTeachingClass(row) {
	var sendArray=new Array();
	sendArray.push(row.edu301_ID);
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkTeachingClassInTask",
		data: {
			"classIds":JSON.stringify(sendArray)
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
				$.showModal("#remindModal",true);
				$(".remindType").html("教学班");
				$(".remindActionType").html("删除");
				$('.confirmRemind').unbind('click');
				$('.confirmRemind').bind('click',function(e) {
					var removeArray = new Array;
					removeArray.push(row.edu301_ID);
					sendTeachingClassRemoveInfo(removeArray);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

// 批量删除教学班
function removeTeachingClasses() {
	var chosenTeachingClasses =choosendJxb;
	if (chosenTeachingClasses.length === 0) {
		toastr.warning('暂未选择任何数据');
		return;
	}

	var sendArray=new Array();
	for (var i = 0; i < chosenTeachingClasses.length; i++) {
		sendArray.push(chosenTeachingClasses[i].edu301_ID);
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/checkTeachingClassInTask",
		data: {
			"classIds":JSON.stringify(sendArray)
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
				$.showModal("#remindModal",true);
				$(".remindType").html("教学班");
				$(".remindActionType").html("删除");
				$('.confirmRemind').unbind('click');
				$('.confirmRemind').bind('click',function(e) {
					var removeArray = new Array;
					for (var i = 0; i < chosenTeachingClasses.length; i++) {
						removeArray.push(chosenTeachingClasses[i].edu301_ID);
					}
					sendTeachingClassRemoveInfo(removeArray);
					e.stopPropagation();
				});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//发送删除教学班请求
function sendTeachingClassRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeTeachingClass",
		data: {
             "deleteIds":JSON.stringify(removeArray)
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
				tableRemoveAction("#teachingClassTable", removeArray, ".teachingClassTableArea", "教学班信息");
				$.hideModal("#remindModal");
				$(".myTooltip").tooltipify();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 开始检索
function allteachingClassAreaStartSearch() {
	var className = $("#allteachingClass_className").val();

	var searchObject = new Object();
	searchObject.className=className;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeachingClass",
		data: {
             "SearchCriteria":JSON.stringify(searchObject)
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
				stuffTeachingClassTable(backjson.tableInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

// 重置检索
function allteachingClassAreaReSearch() {
	var reObject = new Object();
	reObject.InputIds = "#allteachingClass_className";
	reReloadSearchsWithSelect(reObject);
	getAllTeachingClassInfo(false);
}

//教学班管理必选检索条件检查
function teachingClassTetNotNullSearchs(){
	var levelValue = getNormalSelectValue("classManagement_level");
	var departmentValue = getNormalSelectValue("classManagement_department");
	var gradeValue =getNormalSelectValue("classManagement_grade");
	var majorValue =getNormalSelectValue("classManagement_major");
	var levelText = getNormalSelectText("classManagement_level");
	var departmentText = getNormalSelectText("classManagement_department");
	var gradeText =getNormalSelectText("classManagement_grade");
	var majorText =getNormalSelectText("classManagement_major");

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

//渲染可选班级
function stuffAllXzb(row,index){
	getAllXzb(row,index);
}

//渲染已选的行政班
function stuffChoosendXzb(row){
	$(".chooseendArea").empty();
	var bhxzbmc=new Array();
	var bhxzb=new Array();;
	if(typeof row.bhxzbmc!=="undefined"){
		bhxzbmc=row.bhxzbmc.split(",");
		bhxzb=row.bhxzbid.split(",");
	}

	var str='<span class="soprtAreaTitle">已选班级:</span>';
	for (var i = 0; i < bhxzb.length; i++) {
		if(bhxzb[i]!==""){
			str+='<div class="col1 giveBottom">' +
				'<div class="icheck-material-blue"> ' +
				'<input type="checkbox" class="controlBtn" id="'+bhxzb[i]+'" checked="true"> ' +
				'<label for="'+bhxzb[i]+'">'+bhxzbmc[i]+'</label>' +
				'</div>' +
				'</div>';
		}
	}
	$(".chooseendArea").append(str);
	// 判断
	$('.controlBtn').unbind('click');
	$('.controlBtn').bind('click', function(e) {
		judgAddOrRemove(e);
	});
}

//判断穿梭框的新增或删除
function judgAddOrRemove(eve){
	var parentClass=eve.currentTarget.parentElement.parentElement.parentElement.classList[0];
	if(parentClass==="chooseLibirary"){
		removeLibiraryClass(eve);
		addChoosendClass(eve);
	}else{
		removeChoosendClass(eve);
		addLibiraryClass(eve);
	}
	$(".norsArea").hide();
	// 判断
	$('.controlBtn').unbind('click');
	$('.controlBtn').bind('click', function(e) {
		judgAddOrRemove(e);
	});
}

//添加已选班级
function  addChoosendClass(eve){
	$(".chooseendArea").append(eve.currentTarget.parentElement.parentElement.outerHTML);
}

//删除已选班级
function  removeChoosendClass(eve){
	var removeId=eve.currentTarget.attributes[2].nodeValue;
	var allChoosend=$(".chooseendArea").find(".col1");
	for (var i = 0; i < allChoosend.length; i++) {
		if(allChoosend[i].childNodes[0].children[0].id===removeId){
			$(".chooseendArea").find('.col1:eq('+i+')').remove();
		}
	}
}

//添加可选班级
function addLibiraryClass(eve){
	$(".chooseLibirary").append(eve.currentTarget.parentElement.parentElement.outerHTML);
}

//删除可选班级
function  removeLibiraryClass(eve){
	var removeId=eve.currentTarget.attributes[2].nodeValue;
	var allLibirary=$(".chooseLibirary").find(".col1");
	for (var i = 0; i < allLibirary.length; i++) {
		if(allLibirary[i].childNodes[0].children[0].id===removeId){
			$(".chooseLibirary").find('.col1:eq('+i+')').remove();
		}
	}
}

//获取所有行政班
function getAllXzb(row){
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
					toastr.info('暂无可选行政班');
					return;
				}

				$(".chooseLibirary").empty();
				var xzbInfo=backjson.classList;
				var bhxzb=new Array();
				if(typeof row.bhxzbid!=="undefined"){
					bhxzb=row.bhxzbid.split(",");
				}

				var str='<span class="soprtAreaTitle">可选班级:</span>';
				var addNum=0;
				for (var i = 0; i < xzbInfo.length; i++) {
					if(bhxzb.indexOf(JSON.stringify(xzbInfo[i].edu300_ID))===-1){
						str+='<div class="col1 giveBottom">' +
							'<div class="icheck-material-blue"> ' +
							'<input type="checkbox" class="controlBtn" id="'+xzbInfo[i].edu300_ID+'" checked="false"> ' +
							'<label for="'+xzbInfo[i].edu300_ID+'">'+xzbInfo[i].xzbmc+'</label>' +
							'</div>' +
							'</div>';
						addNum++;
					}
				}
				if(addNum==0){
					str+='<span class="norsArea">暂无可选行政班...</span>';
				}
				$(".chooseLibirary").append(str);
				// 判断
				$('.controlBtn').unbind('click');
				$('.controlBtn').bind('click', function(e) {
					judgAddOrRemove(e);
				});
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//确认修改教学班
function confirmModifyTeachingClass(isModify,row){
	var ids = $('.chooseendArea').find('input');
	var names = $('.chooseendArea').find('label');
	var bhxzbmc = new Array(); //包含行政班名称
	var bhxzbCode  = new Array(); //包含行政班编码

	for (var i = 0; i < ids.length; i++) {
		bhxzbmc.push(names[i].innerText);
		bhxzbCode.push(ids[i].id);
	}

	if($('#newNAME').val()===""){
		toastr.warning("教学班名称不能为空");
		return
	}
	if(bhxzbCode.length==0){
		toastr.warning("请选择行政班");
		return
	}
	if(bhxzbCode.length>0&&bhxzbCode.length<=1){
		toastr.warning("至少选择两个行政班");
		return
	}

    var modifyInfo=new Object();
	modifyInfo.jxbmc=$('#newNAME').val();
	modifyInfo.bhxzbmc=bhxzbmc.toString();
	modifyInfo.bhxzbid=bhxzbCode.toString();

	if(isModify){
		modifyInfo.edu301_ID=row.edu301_ID;
	}
	var sendArray=new Array();
	sendArray.push(modifyInfo);

	$.ajax({
		method : 'get',
		cache : false,
		url : "/confirmClassAction",
		data: {
			"classInfo":JSON.stringify(sendArray)
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
				if(isModify){
					$("#teachingClassTable").bootstrapTable('updateByUniqueId', {
						id: backjson.data[0].edu301_ID,
						row: backjson.data[0]
					});
				}else{
					$('#teachingClassTable').bootstrapTable("prepend",backjson.data[0]);
				}
				toolTipUp(".myTooltip");
				toastr.success(backjson.msg);
				$.hideModal("#modifyTeachingClassModal");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//教学班导出点名表
function exportRollcallTable(){
	var choosedClass = $("#teachingClassTable").bootstrapTable("getSelections");
	if(choosedClass.length===0){
		toastr.warning('暂未选择教学班');
		return;
	}
	var sendArray=new Array();
	for (var i = 0; i < choosedClass.length; i++) {
		sendArray.push(choosedClass[i].edu301_ID);
	}

	var url = "/exportRollcallExcel";
	var sendArray = JSON.stringify(sendArray) ;
	var form = $("<form></form>").attr("action", url).attr("method", "post");
	form.append($("<input></input>").attr("type", "hidden").attr("name", "edu301Ids").attr("value", sendArray));
	form.appendTo('body').submit().remove();
}
/*教学班管理end*/
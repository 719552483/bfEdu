var EJDMElementInfo;
$(function() {
	judgementPWDisModifyFromImplements();
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
	binBind();
	getXbInfo();
	getReportInfo();
});

//获取二级学院信息
function getXbInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllDepartment",
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code===200) {
				stuffXbInfo(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充二级学院下拉框
function stuffXbInfo(selectInfo){
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < selectInfo.length; i++) {
		str += '<option value="' + selectInfo[i].edu104_ID + '">' + selectInfo[i].xbmc
			+ '</option>';
	}
	stuffManiaSelect("#department", str);
}

//获取学生报表数据
function getReportInfo(){
	var searchCriteria=getSearchInfo();
	if(typeof searchCriteria==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentReportData",
		data: {
			"SearchCriteria":JSON.stringify(searchCriteria)
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
				stuffReportTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//渲染学生报表数据表
function stuffReportTable(backjsonData){
	var tableInfo=backjsonData.tableInfo;

	$('#reportFormStudentTable').bootstrapTable('destroy').bootstrapTable({
		data : tableInfo,
		pagination : true,
		pageNumber : 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle : false,
		showFooter : false,
		clickToSelect : true,
		showExport: false,      //是否显示导出
		search : false,
		editable : false,
		striped : true,
		toolbar : '#toolbar',
		showColumns : false,
		onPostBody: function(data) {
			toolTipUp(".myTooltip");
		},
		onPageChange: function(number, size) {
			var currentPage=$('#reportFormStudentTable').bootstrapTable('getData',{'useCurrentPage':true});
			for (var i = 0; i < currentPage.length; i++) {
				if(currentPage[i].gradeBatch==='小计'){
					mergeCountCells('reportFormStudentTable',i,'gradeBatch',3,1);
				}
			}

			var rowsObject=new Object();
			rowsObject.rows=currentPage;
			mergeRowCells(rowsObject, "gradeBatch", $("#reportFormStudentTable"),tableInfo);
		},
		columns:backjsonData.columns
	});

	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	var currentPage=$('#reportFormStudentTable').bootstrapTable('getData',{'useCurrentPage':true});
	for (var i = 0; i < currentPage.length; i++) {
		if(currentPage[i].gradeBatch==='小计'){
			mergeCountCells('reportFormStudentTable',i,'gradeBatch',3,1);
		}
	}

	var rowsObject=new Object();
	rowsObject.rows=currentPage;
	mergeRowCells(rowsObject, "gradeBatch", $("#reportFormStudentTable"),tableInfo);
}

//合并行
function mergeRowCells(data, fieldName, target,tableInfo) {
	if (data.rows.length == 0) {
		return;
	}
	var numArr = [];
	var number=0;
	if( data.rows.length>1){
		for (let i = 0; i < data.rows.length; i++) {
			if(data.rows[i][fieldName]!='' && data.rows[i][fieldName]!='-'){
				if(data.rows[i-1]){
					if(data.rows[i-1][fieldName]!='' && data.rows[i-1][fieldName]!='-'){
						if(data.rows[i-1][fieldName]==data.rows[i][fieldName]){
							number++
						}
						else{
							number=number+1
							numArr.push({index:i-number,number:number,pan:'1'})
							number=0
						}
					}
				}
				if(!data.rows[i+1]){
					number=number
					numArr.push({index:i-number,number:number+1,pan:'2'})
					number=0
				}else{
					if(data.rows[i+1][fieldName]=='' || data.rows[i+1][fieldName]=='-'){
						number=number
						numArr.push({index:i-number,number:number+1,pan:'3'})
						number=0
					}
				}
			}else{
				numArr.push({index:i,number:1,pan:'4'})
			}
		}
	}else{
		numArr.push({index:0,number:1,pan:'5'})
	}
	// console.log(numArr);
	for (let x = 0; x < numArr.length; x++) {
		var index= numArr[x]['index'];
		if(data.rows[index].gradeBatch!=='小计'){
			$(target).bootstrapTable('mergeCells', { index: index, field: fieldName, colspan: 1, rowspan: numArr[x]['number']});
		}
	}
}

//人数格式化
function peopleNumMatter(value, row, index) {
	return [
		'<div class="myTooltip" title="'+value+'人">'+value+'人</div>'
	]
		.join('');
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
	var searchCriteria=getSearchInfo();
	if(typeof searchCriteria==='undefined'){
		return;
	}
	$.ajax({
		method : 'get',
		cache : false,
		url : "/studentCollegeReportCheck",
		data: {
			"SearchCriteria":JSON.stringify(searchCriteria)
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
				form.append($("<input></input>").attr("type", "hidden").attr("name", "SearchCriteria").attr("value",JSON.stringify(searchCriteria)));
				form.appendTo('body').submit().remove();
				toastr.info('文件下载中，请稍后...');
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得检索对象
function getSearchInfo(){
	var returnOnject=new Object()
	var xbbm=getNormalSelectValue('department');
	var nj = getNormalSelectValue("nj");
	var pc =getNormalSelectValue("pc");

	if(nj!==''&&xbbm===''){
		toastr.warning('请选择二级学院');
		return;
	}

	if(pc!==''&&(xbbm===''||nj==='')){
		if(xbbm===''){
			toastr.warning('请选择二级学院');
			return;
		}

		if(nj===''){
			toastr.warning('请选择年级');
			return;
		}
	}

	returnOnject.xbbm=xbbm;
	returnOnject.njbm=nj;
	returnOnject.batch=pc;

	return returnOnject;
}

//初始化页面按钮绑定事件
function binBind() {
	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		getReportInfo();
		e.stopPropagation();
	});

	//重置检索
	$('#researchStudents').unbind('click');
	$('#researchStudents').bind('click', function(e) {
		var reObject = new Object();
		reObject.normalSelectIds = "#department,#nj,#pc";
		reReloadSearchsWithSelect(reObject);
		getReportInfo();
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

	//学院change事件
	$("#department").change(function() {
		var xbbm=getNormalSelectValue('department');
		if(xbbm!==''){
			$.ajax({
				method : 'get',
				cache : false,
				url : "/departmentMatchGrade",
				data: {
					"departmentCode":xbbm
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
						var str = '<option value="seleceConfigTip">请选择</option>';
						for (var i = 0; i <  backjson.grade.length; i++) {
							str += '<option value="' +  backjson.grade[i].edu105_ID + '">' +  backjson.grade[i].njmc
								+ '</option>';
						}
						stuffManiaSelect("#nj", str);
					} else {
						toastr.warning('暂无年级');
					}
				}
			});
		}
	});
}


var EJDMElementInfo;
$(function() {
	getMajorTrainingSelectInfo();
	drawStudentBaseInfoEmptyTable();
	btnControl();
	binBind();
	getYearInfo();
	$('.isSowIndex').selectMania(); //初始化下拉框
	deafultSearch();
});

//获取学年信息
function getYearInfo(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchAllXn",
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code === 200) {
				stuffYearSelect(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充学年下拉框
function stuffYearSelect(yearInfo){
	var str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < yearInfo.length; i++) {
		str += '<option value="' + yearInfo[i].edu400_ID + '">' + yearInfo[i].xnmc
			+ '</option>';
	}
	stuffManiaSelect("#xn", str);
	stuffManiaSelect("#loadForXn", str);
	stuffManiaSelect("#confirmGradeForXn", str);
	stuffManiaSelect("#cancelGradeForXn", str);
}

//初始化检索
function deafultSearch(){
	var returnObject = new Object();
	returnObject.level = "";
	returnObject.department = "";
	returnObject.grade = "";
	returnObject.major = "";
	returnObject.xnid = "";
	returnObject.className = "";
	returnObject.courseName = "";
	returnObject.studentNumber = "";
	returnObject.studentName = "";
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryGrades",
		data: {
			"SearchCriteria":JSON.stringify(returnObject),
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
				stuffStudentBaseInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawStudentBaseInfoEmptyTable();
			}
		}
	});
}

//获取-专业培养计划- 有逻辑关系select信息
function getMajorTrainingSelectInfo() {
	SelectPublic("#level","#department","#grade","#major");
	$("#major").change(function() {
		if(getNormalSelectValue("major")===""){
			return;
		}
		$.ajax({
			method : 'get',
			cache : false,
			url : "/queryGrades",
			data: {
				"SearchCriteria":JSON.stringify(getSearchObject()),
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
					stuffStudentBaseInfoTable(backjson.data);
				} else {
					toastr.warning(backjson.msg);
					drawStudentBaseInfoEmptyTable();
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
		'click #wantGradeEntry': function(e, value, row, index) {
			wantGradeEntry(row,index);
		},
		'click #comfirmGradeEntry': function(e, value, row, index) {
			comfirmGradeEntry(row,index);
		},
		'click #cancelGradeEntry': function(e, value, row, index) {
			cancelGradeEntry(row,index);
		}
	};

	$('#gradeEntryTable').bootstrapTable('destroy').bootstrapTable({
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
		    fileName: '学生成绩导出'  //文件名称
		},
		striped: true,
	    sidePagination: "client",   
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".studentBaseInfoTableArea", "学生信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		onDblClickRow : function(row, $element, field) {
			var index =parseInt($element[0].dataset.index);
			wantGradeEntry(row,index);
		},
		columns: [
			{
				field: 'edu005_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			}, {
				field: 'className',
				title: '行政班',
				align: 'left',
				sortable: true,
				formatter: xzbnameMatter
			},{
				field: 'xn',
				title: '学年',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'courseName',
				title: '课程名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			},  {
				field: 'studentName',
				title: '姓名',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'studentCode',
				title: '学号',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'grade',
				title: '成绩',
				align: 'left',
				sortable: true,
				formatter: gradeMatter
			}, {
				field: 'isResit',
				title: '是否补考',
				align: 'center',
				sortable: true,
				width:'10',
				formatter: isResitMatter
			},
			{
				field: 'isConfirm',
				title: '成绩确认',
				align: 'center',
				sortable: true,
				width:'10',
				formatter: isConfirmMatter
			},{
				field: 'gradeEnter',
				title: '录入人',
				align: 'left',
				sortable: true,
				formatter: gradeEnterMatter
			},{
				field: 'entryDate',
				title: '录入时间',
				align: 'left',
				sortable: true,
				formatter: entryDateMatter
			},  {
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
			'<li id="wantGradeEntry" class="insertBtn wantGradeEntry'+index+'"><span><img src="images/t01.png" style="width:24px"></span>录入</li>' +
			'<li id="comfirmGradeEntry" class="noneStart comfirmGradeEntry'+index+'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
			'<li id="cancelGradeEntry" class="noneStart cancelGradeEntry'+index+'"><span><img src="images/t03.png"></span>取消</li>' +
			'</ul>'
		]
			.join('');
	}
	
	function xzbnameMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
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

	function gradeMatter(value, row, index) {
		var className='';
		if(row.isExamCrouse==="T"){
			if (typeof value==="undefined"||value==null||value==="") {
				return [ '<div>' +
				'<span class="grade grade'+index+'"></span>' +
				'<input type="text" class="gradeInput tableInput noneStart" id="grade'+index+'">' +
				'</div>' ].join('');
			} else {
				parseFloat(value)>=60?className='greenTxt':className="redTxt";
				return [ '<div class="myTooltip" title="'+value+'">' +
				'<span class="'+className+' grade grade'+index+'">'+value+'</span>' +
				'<input type="text" class="gradeInput tableInput noneStart" id="grade'+index+'">' +
				'</div>' ].join('');
			}
		}else{
			var title="";
			if(row.grade==null){
				title="暂无成绩";
			}else{
				row.grade==="T"?title="通过":title="不通过";
				title==="通过"?className='greenTxt':className="redTxt";
			}
             var str='<option value="T">通过</option><option value="F">不通过</option>';
			if(typeof value==="undefined"||value==null||value==="null"){
				return [
					'<div class="myTooltip gradeArea'+index+'" title="'+title+'">' +
					'<span class="grade grade'+index+'"></span>' +
					'<select class="isSowIndex myTableSelect myTableSelect' +index + '" id="grade'+index+'">'
						+ str +
					'</select>'+
					'</div>'
				]
					.join('');
			}else{
				return [
					'<div class="myTooltip gradeArea'+index+'" title="'+title+'">' +
						'<span class="'+className+' grade grade'+index+'">'+title+'</span>' +
						'<select class="isSowIndex myTableSelect myTableSelect' +index + '" id="grade'+index+'">'
						+ str +
						'</select>'+
					'</div>'
				]
					.join('');
			}
		}
		$('.isSowIndex').selectMania(); // 初始化下拉框
	}

	function gradeEnterMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				''
			]
				.join('');
		} else {
			return [
				'<div class="myTooltip" title="'+value+'">'+value+'</div>'
			]
				.join('');
		}
	}

	function entryDateMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				''
			]
				.join('');
		} else {
			return [
				'<div class="myTooltip" title="'+value+'">'+value+'</div>'
			]
				.join('');
		}
	}

	function isResitMatter(value, row, index) {
		if (value===""||value==null||typeof value==="undefined") {
			return [
				'<div class="myTooltip normalTxt" title="未录入">未录入</div>'
			]
				.join('');
		} else if(value==="T"){
			return [
				'<div class="myTooltip" title="是"><i class="iconfont icon-yixuanze greenTxt"></i></div>'
			]
				.join('');
		}else{
			return [
				'<div class="myTooltip" title="否"><i class="iconfont icon-chacha redTxt"></i></div>'
			]
				.join('');
		}
	}

	function isConfirmMatter(value, row, index) {
		if (value==="T") {
			return [
				'<div class="myTooltip" title="已确认"><i class="iconfont icon-yixuanze greenTxt"></i></div>'
			]
				.join('');

		} else {
			return [
				'<div class="myTooltip normalTxt" title="未确认">未确认</div>'
			]
				.join('');
		}
	}

	drawPagination(".studentBaseInfoTableArea", "学生信息");
	drawSearchInput(".studentBaseInfoTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".studentBaseInfoTableArea", "学生信息");
	toolTipUp(".myTooltip");
	btnControl();
}

//预备录入成绩
function wantGradeEntry(row,index){
	if(row.isConfirm==="T"&&row.isResit!=="T"){
		toastr.warning("成绩已确认，不能再次录入");
		return;
	}

	var showGradeInput=$(".gradeInput");
	var showNum=0;
	for (var i = 0; i <showGradeInput.length ; i++) {
		if(showGradeInput[i].style.display==="block"||showGradeInput[i].style.display==="inline-block"){
			showNum++;
		}
	}
	if(showNum>=1){
		toastr.warning("请先录完上一个成绩");
		return;
	}

	$(".wantGradeEntry"+index).hide();
	$(".grade"+index).hide();
	$(".comfirmGradeEntry"+index).show();
	$(".cancelGradeEntry"+index).show();
	if(row.isExamCrouse==="T"){
		$("#grade"+index).show();
		row.grade!=null?$("#grade"+index).val(row.grade).focus():$("#grade"+index).val("").focus();
	}else{
        $(".gradeArea"+index).show();
        $(".myTableSelect"+index).show();
	}
}

//确认录入成绩
function comfirmGradeEntry(row,index){
	var currentGrade;
	if(row.isExamCrouse==="T"){
		 currentGrade=$("#grade"+index).val();
		if(currentGrade===""){
			toastr.warning('成绩不能为空');
			return;
		}

		if(!checkIsNumber(currentGrade) && currentGrade!==""){
			toastr.warning('成绩必须是数字');
			return;
		}
	}else{
		 currentGrade=$("#grade"+index).val();
	}
	sendGrade(currentGrade,row);
}

//取消录入成绩
function cancelGradeEntry(row,index){
	$(".wantGradeEntry"+index).show();
	$(".grade"+index).show();
	$(".comfirmGradeEntry"+index).hide();
	$(".cancelGradeEntry"+index).hide();
	if(row.isExamCrouse==="T"){
		$("#grade"+index).hide();
		$("#grade"+index).val("");
	}else{
		$(".myTableSelect"+index).hide();
	}
}

//发送学生成绩请求
function sendGrade(currentGrade,row) {
	row.grade=currentGrade;
	row.Edu101_ID=JSON.parse($.session.get('userInfo')).userKey;
	row.gradeEnter=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/giveGrade",
		data: {
			"gradeObject":JSON.stringify(row)
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
				row.entryDate=backjson.data;
				$("#gradeEntryTable").bootstrapTable("updateByUniqueId", {id: row.edu005_ID, row: row});
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取检索对象
function getSearchObject(){
	var levelValue = getNormalSelectValue("level");
	var departmentValue = getNormalSelectValue("department");
	var gradeValue =getNormalSelectValue("grade");
	var majorValue =getNormalSelectValue("major");
	var xnid =getNormalSelectValue("xn");
	var className=$("#className").val();
	var courseName=$("#courseName").val();
	var studentNumber=$("#studentNumber").val();
	var studentName=$("#studentName").val();


	var returnObject = new Object();
	returnObject.level = levelValue;
	returnObject.department = departmentValue;
	returnObject.grade = gradeValue;
	returnObject.major = majorValue;
	returnObject.xnid = xnid;
	returnObject.className = className;
	returnObject.courseName = courseName;
	returnObject.studentNumber = studentNumber;
	returnObject.studentName = studentName;
	return returnObject;
}

//开始检索
function startSearch(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryGrades",
		data: {
			"SearchCriteria":JSON.stringify(getSearchObject()),
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
				stuffStudentBaseInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawStudentBaseInfoEmptyTable();
			}
		}
	});
}

//重置检索
function research(){
	var reObject = new Object();
	reObject.fristSelectId = "#level";
	reObject.actionSelectIds = "#department,#grade,#major";
	reObject.InputIds = "#className,#courseName,#studentNumber,#studentName";
	reObject.normalSelectIds = "#xn";
	reReloadSearchsWithSelect(reObject);
	deafultSearch();
}

//预备下载成绩模板
function wantLoadGradeModel() {
	reStuffWantLoadGradeModel();
	$.showModal("#wantLoadGradeModal",true);

	//预备下载成绩模板
	$('#ComfirmLoadGradeModel').unbind('click');
	$('#ComfirmLoadGradeModel').bind('click', function(e) {
		ComfirmLoadGradeModel();
		e.stopPropagation();
	});
}

//确认下载成绩模板
function ComfirmLoadGradeModel(){
	var xnid=getNormalSelectValue("loadForXn");
	var className=$("#loadForXzbmc").val();
	var courseName=$("#loadForKcmc").val();

	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(className===""){
		toastr.warning("行政班名称不能为空");
		return;
	}

	if(courseName===""){
		toastr.warning("课程班名称不能为空");
		return;
	}

	var gradeInfo=new Object();
	gradeInfo.xnid=xnid;
	gradeInfo.xn=getNormalSelectText("loadForXn");
	gradeInfo.className=className;
	gradeInfo.courseName=courseName;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/wantDownloadGradeModal",
		data: {
			"gradeInfo":JSON.stringify(gradeInfo)
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
				var url = "/downloadGradeModal";
				var form = $("<form></form>").attr("action", url).attr("method", "post");
				form.append($("<input></input>").attr("type", "hidden").attr("name", "gradeInfo").attr("value",JSON.stringify(gradeInfo)));
				form.appendTo('body').submit().remove();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重置下载成绩模板区域
function reStuffWantLoadGradeModel(){
	var reObject = new Object();
	reObject.InputIds = "#loadForXzbmc,#loadForKcmc";
	reObject.normalSelectIds = "#loadForXn";
	reReloadSearchsWithSelect(reObject);
}

//预备导入成绩
function wantImportGrades(){
	$.showModal("#importGradeModal",true);
	$("#gradeInfoFile,#showFileName").val("");
	$(".fileErrorTxTArea,.fileSuccessTxTArea,.fileLoadingArea").hide();
	$("#gradeInfoFile").on("change", function(obj) {
		//判断图片格式
		var fileName = $("#gradeInfoFile").val();
		var suffixIndex = fileName.lastIndexOf(".");
		var suffix = fileName.substring(suffixIndex + 1).toLowerCase();
		if (suffix != "xls" && suffix !== "xlsx") {
			toastr.warning('请上传Excel类型的文件');
			$("#studentInfoFile").val("");
			return
		}
		$("#showFileName").val(fileName.substring(fileName.lastIndexOf("\\") + 1));
	});
	//检验导入文件
	$('#checkGradeFile').unbind('click');
	$('#checkGradeFile').bind('click', function(e) {
		checkGradeFile();
		e.stopPropagation();
	});

	//确认导入文件
	$('.confirmImportGrade').unbind('click');
	$('.confirmImportGrade').bind('click', function(e) {
		confirmImportGrade();
		e.stopPropagation();
	});
}

//检验导入文件
function checkGradeFile(){
	if ($("#gradeInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}

	var formData = new FormData();
	formData.append("file",$('#gradeInfoFile')[0].files[0]);

	$.ajax({
		url:'/checkGradeFile',
		dataType:'json',
		type:'POST',
		async: true,
		data: formData,
		processData : false, // 使数据不做处理
		contentType : false, // 不要设置Content-Type请求头
		success: function(backjosn){
			$(".fileLoadingArea").hide();
			if(backjosn.code===200){
				showImportSuccessInfo("#importGradeModal",backjosn.msg);
			}else{
				showImportErrorInfo("#importGradeModal",backjosn.msg);
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

//确认导入文件
function confirmImportGrade(){
	if ($("#gradeInfoFile").val() === "") {
		toastr.warning('请选择文件');
		return;
	}
	var lrrInfo=new Object();
	lrrInfo.userykey=JSON.parse($.session.get('userInfo')).userKey;
	lrrInfo.lrr=$(parent.frames["topFrame"].document).find(".topright").find(".user").find("span")[0].innerText;

	var formData = new FormData();
	formData.append("file",$('#gradeInfoFile')[0].files[0]);
	formData.append("lrrInfo",JSON.stringify(lrrInfo));

	$.ajax({
		url:'/importGradeFile',
		dataType:'json',
		type:'POST',
		async: true,
		data: formData,
		processData : false, // 使数据不做处理
		contentType : false, // 不要设置Content-Type请求头
		success: function(backjosn){
			$(".fileLoadingArea").hide();
			if(backjosn.code===200){
				stuffStudentBaseInfoTable(backjosn.data);
				toastr.success('成功导入'+backjosn.data.length+'条成绩');
				var reObject = new Object();
				reObject.fristSelectId = "#level";
				reObject.actionSelectIds = "#department,#grade,#major";
				reObject.InputIds = "#className,#courseName,#studentNumber,#studentName";
				reObject.normalSelectIds = "#xn";
				reReloadSearchsWithSelect(reObject);
				$.hideModal("#importGradeModal")
			}else{
				showImportErrorInfo("#importGradeModal",backjosn.msg);
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

//预备成绩确认
function wantConfirmGrade(){
	reStuffForConfirmGrade();
	$.showModal("#confirmGradeModal",true);

	//确认按钮
	$('#confirmGrade').unbind('click');
	$('#confirmGrade').bind('click', function(e) {
		confirmGrade();
		e.stopPropagation();
	});
}

//成绩确认
function confirmGrade(){
	var xnid=getNormalSelectValue("confirmGradeForXn");
	var className=$("#confirmGradeForXzbmc").val();
	var courseName=$("#confirmGradeForKcmc").val();
	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(className===""){
		toastr.warning("行政班名称不能为空");
		return;
	}

	if(courseName===""){
		toastr.warning("课程班名称不能为空");
		return;
	}

	var gradeInfo=new Object();
	gradeInfo.xnid=xnid;
	gradeInfo.xn=getNormalSelectText("confirmGradeForXn");
	gradeInfo.className=className;
	gradeInfo.courseName=courseName;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/confirmGrade",
		data: {
			"gradeInfo":JSON.stringify(gradeInfo),
			"userKey":JSON.parse($.session.get('userInfo')).userKey
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
				var data=backjson.data;
				for (var i = 0; i < data.length; i++) {
					$("#gradeEntryTable").bootstrapTable('updateByUniqueId', {
						id: backjson.data[i].edu005_ID,
						row: backjson.data[i]
					});
				}
				toolTipUp(".myTooltip");
				toastr.success(backjson.msg);
				$.hideModal("#confirmGradeModal");
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重置确认成绩条件
function reStuffForConfirmGrade(){
	var reObject = new Object();
	reObject.InputIds = "#confirmGradeForXzbmc,#confirmGradeForKcmc";
	reObject.normalSelectIds = "#confirmGradeForXn";
	reReloadSearchsWithSelect(reObject);
}

//预备取消成绩确认
function wantCancelGrade(){
	reStuffForCancelGrade();
	$.showModal("#cancelGradeModal",true);

	//确认按钮
	$('#cancelGrade').unbind('click');
	$('#cancelGrade').bind('click', function(e) {
		cancelGrade();
		e.stopPropagation();
	});
}

//取消成绩确认
function cancelGrade(){
	var xnid=getNormalSelectValue("cancelGradeForXn");
	var className=$("#cancelGradeForXzbmc").val();
	var courseName=$("#cancelGradeForKcmc").val();
	if(xnid===""){
		toastr.warning("请选择学年");
		return;
	}

	if(className===""){
		toastr.warning("行政班名称不能为空");
		return;
	}

	if(courseName===""){
		toastr.warning("课程班名称不能为空");
		return;
	}

	var gradeInfo=new Object();
	gradeInfo.xnid=xnid;
	gradeInfo.xn=getNormalSelectText("cancelGradeForXn");
	gradeInfo.className=className;
	gradeInfo.courseName=courseName;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/cancelGrade",
		data: {
			"gradeInfo":JSON.stringify(gradeInfo),
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
			if (backjson.code===200) {
				toastr.warning(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//取消成绩确认审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="08";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=JSON.parse($.session.get('userInfo')).userKey;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//重置确认成绩条件
function reStuffForCancelGrade(){
	var reObject = new Object();
	reObject.InputIds = "#cancelGradeForXzbmc,#cancelGradeForKcmc";
	reObject.normalSelectIds = "#cancelGradeForXn";
	reReloadSearchsWithSelect(reObject);
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
	$('#research').unbind('click');
	$('#research').bind('click', function(e) {
		research();
		e.stopPropagation();
	});

	//预备下载成绩模板
	$('#wantLoadGradeModel').unbind('click');
	$('#wantLoadGradeModel').bind('click', function(e) {
		wantLoadGradeModel();
		e.stopPropagation();
	});

	//预备导入成绩
	$('#wantImportGrades').unbind('click');
	$('#wantImportGrades').bind('click', function(e) {
		wantImportGrades();
		e.stopPropagation();
	});

	//成绩确认
	$('#wantConfirmGrade').unbind('click');
	$('#wantConfirmGrade').bind('click', function(e) {
		wantConfirmGrade();
		e.stopPropagation();
	});

	//取消成绩确认
	$('#wantCancelGrade').unbind('click');
	$('#wantCancelGrade').bind('click', function(e) {
		wantCancelGrade();
		e.stopPropagation();
	});


	//补考成绩录入
	$('#wantRepeatGrade').unbind('click');
	$('#wantRepeatGrade').bind('click', function(e) {
		wantRepeatGrade();
		e.stopPropagation();
	});
}







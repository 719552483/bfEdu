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
		'click #teacherDetails': function(e, value, row, index) {
//			studentDetails(row,index);
		},
		'click #modifyTeacher': function(e, value, row, index) {
//			modifyStudent(row,index);
		},
		'click #removeTeacher': function(e, value, row, index) {
//			removeStudent(row);
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
		    fileName: '学生信息导出'  //文件名称
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
				field: 'edu001_ID',
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
			},  {
				field: 'csrq',
				title: '出生日期',
				align: 'left',
				formatter: paramsMatter,
				visible: false
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
			}, {
				field: 'whcd',
				title: '文化程度',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'hf',
				title: '婚否',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			},
			{
				field: 'mz',
				title: '民族',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			},
			 {
				field: 'dxsj',
				title: '到校时间',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'lxfs',
				title: '联系方式',
				align: 'left',
				formatter: paramsMatter,
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
				'<li id="teacherDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
				'<li id="modifyTeacher" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
				'<li id="removeTeacher" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
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









//预备添加教师
function wantAddTeacher(){
	rebackTeacherInfo();
	$.showModal("#addTeacherModal",true);
	drawCalenr("#addTeacherCsrq");
	drawCalenr("#addTeacherDxsj");
	//确认按钮绑定事件
	$('.confirmaddTeacherBtn').unbind('click');
	$('.confirmaddTeacherBtn').bind('click', function(e) {
		confirmaddTeacher();
		e.stopPropagation();
	});
}

//确认添加教师
function confirmaddTeacher(){
	var newTeacherInfo=getnewTeacherInfo();
	if(typeof newTeacherInfo ==='undefined'){
		return;
	}
	sendNewTeacherInfo(newTeacherInfo);
}

//发送添加教师请求
function sendNewTeacherInfo(newTeacherInfo){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addTeacher",
		data: {
             "addInfo":JSON.stringify(newTeacherInfo) 
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
				newTeacherInfo.edu101_ID=backjson.newId;
				newTeacherInfo.jzgh=backjson.jzgh;
				$('#teacherBaseInfoTable').bootstrapTable("prepend", newTeacherInfo);
				$(".myTooltip").tooltipify();
				toastr.success('新增成功');
				$.hideModal("#addTeacherModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}


//重置教师信息模态框
function rebackTeacherInfo(){
	var reObject = new Object();
	reObject.normalSelectIds = "#addTeacherSex,#addTeacherType,#addTeacherXb,#addTeacherZY,#addTeacherHf,#addTeacherMz,#addTeacherZc,#addTeacherWhcd,#addTeacherZzmm";
	reObject.InputIds = "#addTeacherName,#addTeacherCsrq,#addTeacherSfzh,#addTeacherDxsj,#addTeacherLxfs";
	reReloadSearchsWithSelect(reObject);
}

//开始检索教师
function startSearch(){
	var searchObject = getSearchValue();
	if ($.isEmptyObject(searchObject)) {
		searchAllTeacher();
	}else{
		searchAllTeacherBy(searchObject);
	}
}

//检索所有教师
function searchAllTeacher(){
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
				if(backjson.teacherList.length===0){
					toastr.warning('暂无教师信息');
					drawTeacherBaseInfoEmptyTable();
				}else{
					stuffTeacherBaseInfoTable(backjson.teacherList);
				}
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//按条件检索有教师
function searchAllTeacherBy(searchObject){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeacher",
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
			hideloding();
			if (backjson.result) {
				if(backjson.techerList.length===0){
					toastr.warning('暂无教师信息');
					drawTeacherBaseInfoEmptyTable();
				}else{
					stuffTeacherBaseInfoTable(backjson.techerList);
				}
			} else {
				toastr.warning('操作失败，请重试');
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

//获得新增教师的信息
function getnewTeacherInfo(){
	var xb = getNormalSelectValue("addTeacherSex");
	var jzglxbm = getNormalSelectValue("addTeacherType");
	var jzglx = getNormalSelectText("addTeacherType");
	var szxb = getNormalSelectValue("addTeacherXb");
	var szxbmc = getNormalSelectText("addTeacherXb");
	var zy = getNormalSelectValue("addTeacherZY");
	var zymc = getNormalSelectText("addTeacherZY");
	var hf= getNormalSelectValue("addTeacherHf");
	var mzbm = getNormalSelectValue("addTeacherMz");
	var mz = getNormalSelectText("addTeacherMz");
	var zcbm = getNormalSelectValue("addTeacherZc");
	var zc = getNormalSelectText("addTeacherZc");
	var whcdbm = getNormalSelectValue("addTeacherWhcd");
	var whcd = getNormalSelectText("addTeacherWhcd");
	var zzmmbm = getNormalSelectValue("addTeacherZzmm");
	var zzmm = getNormalSelectText("addTeacherZzmm");
	var xm=$("#addTeacherName").val();
	var csrq=$("#addTeacherCsrq").val();
	var sfzh=$("#addTeacherSfzh").val();
	var dxsj=$("#addTeacherDxsj").val();
	var lxfs=$("#addTeacherLxfs").val();
	
	if(xm===""){
		toastr.warning('姓名不能为空');
		return;
	}
	
	if(xb===""){
		toastr.warning('性别不能为空');
		return;
	}
	
	if(jzglxbm===""){
		toastr.warning('教职工类型不能为空');
		return;
	}
	
	if(csrq===""){
		toastr.warning('出生日期不能为空');
		return;
	}
	
	if(dxsj===""){
		toastr.warning('到校时间不能为空');
		return;
	}
	
	if(!isCardNo(sfzh)&&sfzh!==""){
		toastr.warning('身份证号格式不正确');
		return;
	}
	var nl="";
	if(csrq!==""){
	   nl= byage($("#addTeacherCsrq").val());
	}
	
	if(nl<18){
		toastr.warning('年龄不足18岁,请确认出生日期');
		return;
	}
	
	var returnObject = new Object();
	returnObject.xb=xb;
	returnObject.jzglx=jzglx;
	returnObject.jzglxbm=jzglxbm;
	returnObject.szxb=szxb;
	returnObject.szxbmc=szxbmc;
	returnObject.zy=zy;
	returnObject.zymc=zymc;
	returnObject.hf=hf;
	returnObject.mzbm=mzbm;
	returnObject.mz=mz;
	returnObject.zcbm=zcbm;
	returnObject.zc=zc;
	returnObject.whcdbm=whcdbm;
	returnObject.whcd=whcd;
	returnObject.zzmmbm=zzmmbm;
	returnObject.zzmm=zzmm;
	returnObject.xm=xm;
	returnObject.csrq=csrq;
	returnObject.sfzh=sfzh;
	returnObject.dxsj=dxsj;
	returnObject.lxfs=lxfs;
	returnObject.nl=nl;
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
	
	
	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});
	
	//新增教师
	$('#addTeacher').unbind('click');
	$('#addTeacher').bind('click', function(e) {
		wantAddTeacher();
		e.stopPropagation();
	});
}
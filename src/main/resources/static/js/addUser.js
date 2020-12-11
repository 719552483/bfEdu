var roleOptionStr="";//全局变量接收当前所有角色类型
var roleOption="";//全局变量接收当前所有角色类型

var departmentOptionStr="";//全局变量接收当前所有二级学院
var departmentOption="";//全局变量接收当前所有二级学院
$(function() {
	getallRole(); 
	drawNewUserRoleSelect();
	btnBind();
});

//获取所有角色类型
function getallRole() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRole",
		async:false,
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
			roleOption=backjson.data.allRole;
			departmentOption=backjson.data.allDepartment;
			if(roleOption.length===0){
				//首次使用 用户角色为空的情况
				roleOptionStr= '<option value="seleceConfigTip">暂无可选权限</option>';
			}else{
				for (var i = 0; i < roleOption.length; i++) {
					roleOptionStr += '<option value="' +  roleOption[i].bf991_ID + '">' +  roleOption[i].js + '</option>';
				}
			}

			if(departmentOption.length===0){
				//首次使用 用户二级学院为空的情况
				departmentOptionStr= '<option value="seleceConfigTip">暂无二级学院</option>';
			}else{
				for (var i = 0; i < departmentOption.length; i++) {
					departmentOptionStr += '<option value="' +  departmentOption[i].edu104_ID + '">' +  departmentOption[i].xbmc + '</option>';
				}
			}
		}
	});
}

//初始化页面内容
function drawNewUserRoleSelect() {
	$("#newRole").append(roleOptionStr);
	$("#newRole").multiSelect();
	$("#roleBtnDepartment").append(departmentOptionStr);
	$("#roleBtnDepartment").multiSelect();
}

//添加用户
function addUser() {
	var username = $("#add_username").val();
	var newRole =$("#newRole").val();
	var pwd = $("#add_pwd").val();
	var confirmPwd = $("#add_confirmPwd").val();
	var roleBtnDepartment =$("#roleBtnDepartment").val();

	verifyNewUserInfo(username, newRole, pwd, confirmPwd,roleBtnDepartment);
}

//验证用户输入
function verifyNewUserInfo(username, newRole, pwd, confirmPwd,roleBtnDepartment) {
	if (username === "") {
		toastr.warning('用户名不能为空');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	if (pwd === "") {
		toastr.warning('密码不能为空');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	if (confirmPwd === "") {
		toastr.warning('确认密码不能为空');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	 if(newRole==null){
	 	toastr.warning('新用户权限未设置');
	 	$(".saveNewAccountSetUp").addClass("animated shake");
	 	reomveAnimation('.saveNewAccountSetUp', "animated shake");
	 	return;
	 }else{
		 newRole=getRoleMoreSelectVALUES("#newRole");
	 }

	//新旧密码对比
	if (pwd !== confirmPwd) {
		toastr.warning('确认密码不正确');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	//用户名只能为长度为24
	if (username.length>24) {
		toastr.warning('用户名只长度超过24');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	//密码长度只能为长度为16
	if (pwd.length>16) {
		toastr.warning('密码长度超过16');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	var CharOnlyTset = /^[A-Za-z0-9]+$/;

	//用户名只能由数字和26个英文字母组成的字符串
	if (!CharOnlyTset.test(username)) {
		toastr.warning('用户名只由数字和26个英文字母组成');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	//密码只能由数字和26个英文字母组成的字符串
	if (!CharOnlyTset.test(pwd)) {
		toastr.warning('密码只由数字和26个英文字母组成');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	var patter_special_char = /[,;；，《》]+/;

	//用户名特殊字符验证
	if (patter_special_char.test(username)) {
		toastr.warning('用户名不允许包含特殊字符');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	//密码特殊字符验证
	if (patter_special_char.test(pwd)) {
		toastr.warning('密码不允许包含特殊字符');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	var deparmentSelect = $("#roleBtnDepartment").val();
	//密码特殊字符验证
	if (deparmentSelect==null) {
		toastr.warning('请选择分管二级学院');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("用户"+username);
	$(".remindActionType").html("生成");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		//保存新用户设置
		saveNewUser(username, newRole, pwd);
		e.stopPropagation();
	});
}

//发送新用户保存数据库
function saveNewUser(username, newRole, pwd) {
	var newUserObject = new Object();
	newUserObject.yhm = username;
	newUserObject.js = newRole.name;
	newUserObject.jsId = newRole.value;
	newUserObject.mm = pwd;
	var deparmentSelect =getxBMoreSelectVALUES("#roleBtnDepartment");
	newUserObject.deparmentIds =deparmentSelect.value;
	newUserObject.deparmentNames =deparmentSelect.name;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/newUser",
		data: {
            "newUserInfo":JSON.stringify(newUserObject)
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
			if(backjson.code===200){
				$.hideModal("#remindModal");
				var reObject = new Object();
				reObject.InputIds = "#add_username,#add_pwd,#add_confirmPwd";
				reReloadSearchsWithSelect(reObject);
				emptyMUtiSelect();
				toastr.success(backjson.msg);
			}else{
				toastr.warning(backjson.msg);
			}
		}
	});
}

//清空多选框
function emptyMUtiSelect(){
	var jsSelect=$(".AuthorityArae").find(".multi-select-menuitems").find("input");
	for (var i = 0; i < jsSelect.length; i++) {
		jsSelect[i].checked = "";
	}
	$("#newRole").val(null);

	var dbSelect=$(".newUserBtnDepartment").find(".multi-select-menuitems").find("input");
	for (var i = 0; i < dbSelect.length; i++) {
		dbSelect[i].checked = "";
	}
	$("#roleBtnDepartment").val(null);

	$(".newUserBtnDepartment,.AuthorityArae").find(".multi-select-button").html("-- 请选择 --");
}

//获取所有用户
function getUserInfo() {
	//初始化表格
	var oTable = new stuffTable();
	oTable.Init();
}

var choosend=new Array();
//填充所有用户table
function stuffTable() {
	window.allUserEvents = {
		'click #modifiRole': function(e, value, row, index) {
			modifiRole(row);
		},
		'click #removeUser': function(e, value, row, index) {
			removeUser(row);
		},
		'click #tableCanle': function(e, value, row, index) {
			canleModify(row);
		},
		'click #tableOk': function(e, value, row, index) {
			okModify(row, index);
		}
	};
	var oTableInit = new Object();
	//初始化Table
	oTableInit.Init = function () {
		$('#allUserTable').bootstrapTable('destroy').bootstrapTable({
			url:'/queryUserList',         //请求后台的URL（*）
			method: 'POST',                      //请求方式（*）
			striped: true,                      //是否显示行间隔色
			cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination: true,                   //是否显示分页（*）
			queryParamsType: '',
			dataType: 'json',
			pageNumber: 1, //初始化加载第一页，默认第一页
			queryParams: queryParams,//请求服务器时所传的参数
			sidePagination: 'server',//指定服务器端分页
			pageSize: 10,//单页记录数
			pageList: [10,20,30,40],//分页步进值
			search: false,
			silent: false,
			clickToSelect: true,
			showRefresh: false,                  //是否显示刷新按钮
			showToggle: false,
			onPostBody: function() {
				drawPagination(".allUserTableArea", "用户信息");
				drawSearchInput(".allUserTableArea");
				changeTableNoRsTip();
				toolTipUp(".myTooltip");
				changeColumnsStyle(".allUserTableArea", "用户信息");
			},
			onCheck : function(row) {
				onCheckRelation(row);
			},
			onUncheck : function(row) {
				onUncheckRelation(row);
			},
			onCheckAll : function(rows) {
				onCheckAllRelation(rows);
			},
			onUncheckAll : function(rows,rows2) {
				onUncheckAllRelation(rows2);
			},
			onPageChange: function() {
				drawPagination(".allUserTableArea", "用户信息");

			},
			onPostBody: function() {
				for (var i = 0; i < choosend.length; i++) {
					$("#allUserTable").bootstrapTable("checkBy", {field:"bf990_ID", values:[choosend[i].bf990_ID]})
				}
			},
			columns: [	{
							field: 'check',
							checkbox: true
						},{
							field: 'bf990_ID',
							title: '唯一标识',
							align: 'center',
							sortable: true,
							visible: false
						},
						{
							field: 'yhm',
							title: '用户名',
							sortable: true,
							formatter: userNameFormatter,
							align: 'left'
						},{
							field: 'personName',
							title: '用户名称',
							sortable: true,
							formatter: paramsMatter,
							align: 'left'
						}, {
							field: 'js',
							title: '用户角色',
							sortable: true,
							align: 'left',
							formatter: userRoleFormatter,
						}, {
							field: 'deparmentNames',
							title: '分管二级学院',
							sortable: true,
							align: 'left',
							formatter: deparmentNamesFormatter,
						},{
							field: 'action',
							title: '操作',
							align: 'center',
							width: '16%',
							clickToSelect: false,
							formatter: allUserFormatter,
							events: allUserEvents,
						}],
			responseHandler: function (res) {  //后台返回的结果
				if(res.code == 200){
					var data = {
						total: res.data.total,
						rows: res.data.rows
					};
					return data;
				}else{
					var data = {
						total: 0,
						rows:[]
					};
					toastr.warning(res.msg);
					return data;
				}
			}
		});
	};

	// 得到查询的参数
	function queryParams(params) {
		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
			pageNum: params.pageNumber,
			pageSize: params.pageSize,
			departmentName: $("#departmentName").val(),
			roleName: $("#roleName").val(),
			personName: $("#userName").val(),
			yhm:$("#yhm").val()
		};
		return JSON.stringify(temp);
	}

	function allUserFormatter(value, row, index) {
		return [
			'<ul class="toolbar tabletoolbar">' +
			'<li id="modifiRole" class="blockStart blockStart' + row.bf990_ID +
			'"><span><img src="images/t02.png" style="width:24px"></span>角色修改</li>' +
			'<li id="removeUser" class="blockStart blockStart' + row.bf990_ID + '"><span><img src="images/t03.png"></span>删除用户</li>' +
			'<li id="tableOk" class="noneStart noneStart' + row.bf990_ID +
			'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
			'<li id="tableCanle" class="noneStart noneStart' + row.bf990_ID + '"><span><img src="images/t03.png"></span>取消</li>' +
			'</ul>'
		]
			.join('');
	}

	function userRoleFormatter(value, row, index) {
		return [
			'<div class="multipleInTableArea multipleInTableArea'+row.bf990_ID+'"><span title="'+row.js+'" class="myTooltip roleTxt roleTxt' + row.bf990_ID + '">' + row.js + '</span>' +
			'<select class="myTableSelect myTableSelect' +row.bf990_ID + '" name="userRol'+row.bf990_ID+'"  id="userRol'+row.bf990_ID+'" multiple="true">' + roleOptionStr + '' +
			'</select></div>'
		]
			.join('');
	}

	function deparmentNamesFormatter(value, row, index) {
		if(value===""||value==null||typeof value==="undefined"){
			return [
				'<div class="multipleInTableArea deparmentInTableArea'+row.bf990_ID+'"><span title="暂未绑定" class="myTooltip deparmentTxt deparmentTxt' + row.bf990_ID + '">暂未绑定</span>' +
				'<select class="myTableSelect mydeparmentTableSelect' +row.bf990_ID + '" name="userDeparment'+row.bf990_ID+'" id="userDeparment'+row.bf990_ID+'" multiple="true">' + departmentOptionStr + '' +
				'</select></div>'
			]
				.join('');
		}else{
			return [
				'<div class="multipleInTableArea deparmentInTableArea'+row.bf990_ID+'"><span title="'+row.deparmentNames+'" class="myTooltip deparmentTxt deparmentTxt' + row.bf990_ID + '">' + row.deparmentNames + '</span>' +
				'<select class="myTableSelect mydeparmentTableSelect' +row.bf990_ID + '" name="userDeparment'+row.bf990_ID+'" id="userDeparment'+row.bf990_ID+'" multiple="true">' + departmentOptionStr + '' +
				'</select></div>'
			]
				.join('');
		}
	}

	function userNameFormatter(value, row, index) {
		return [
			'<input id="userNameInTable' + row.bf990_ID + '" type="text" class="dfinput UserNameInTable Mydfinput" value="' + row.yhm +
			'"><span title="'+row.yhm+'" class="myTooltip blockName' +
			row.bf990_ID + '">' + row.yhm + '</span>'
		]
			.join('');
	}

	return oTableInit;
}

//单选学生
function onCheckRelation(row){
	if(choosend.length<=0){
		choosend.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].bf990_ID===row.bf990_ID){
				add=false;
				break;
			}
		}
		if(add){
			choosend.push(row);
		}
	}
}

//单反选学生
function onUncheckRelation(row){
	if(choosend.length<=1){
		choosend.length=0;
	}else{
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].bf990_ID===row.bf990_ID){
				choosend.splice(i,1);
			}
		}
	}
}

//全选学生
function onCheckAllRelation(row){
	for (var i = 0; i < row.length; i++) {
		choosend.push(row[i]);
	}
}

//全反选学生
function onUncheckAllRelation(row){
	var a=new Array();
	for (var i = 0; i < row.length; i++) {
		a.push(row[i].bf990_ID);
	}


	for (var i = 0; i < choosend.length; i++) {
		if(a.indexOf(choosend[i].bf990_ID)!==-1){
			choosend.splice(i,1);
			i--;
		}
	}
}

//修改用户
function modifiRole(row) {
	$('.roleTxt' + row.bf990_ID).hide();
	$('.deparmentTxt' + row.bf990_ID).hide();
	$('.blockStart' + row.bf990_ID).hide();
	$(".blockName" + row.bf990_ID).hide();
	$(".multipleInTableArea"+row.bf990_ID).find(".multi-select-container").show();
	$(".deparmentInTableArea"+row.bf990_ID).find(".multi-select-container").show();
	$(".noneStart" + row.bf990_ID).show();
	$("#userNameInTable" + row.bf990_ID).show();
	$(".currentId").html(row.bf990_ID);
	$("#userRol"+row.bf990_ID).multiSelect();
	$("#userDeparment"+row.bf990_ID).multiSelect();
	var jsIdARRAY=row.jsId.split(",");
	var jsSelect=$(".multipleInTableArea"+row.bf990_ID).find(".multi-select-menuitems").find("input");

	var stuffArray=new Array();
	for (var i = 0; i < jsSelect.length; i++) {
		var currentJs=jsSelect[i].attributes[2].nodeValue;
		if(jsIdARRAY.indexOf(currentJs)!=-1){
			jsSelect[i].checked = "checked";
			stuffArray.push(currentJs);
		}else{
			jsSelect[i].checked = "";
		}
	}
	$("#userRol"+row.bf990_ID).val(stuffArray);

	var stuffArray2=new Array();
	var XBIdARRAY=row.deparmentIds.split(",");
	var xbSelect=$(".deparmentInTableArea"+row.bf990_ID).find(".multi-select-menuitems").find("input");
	for (var i = 0; i < xbSelect.length; i++) {
		var currentXb=xbSelect[i].attributes[2].nodeValue;
		if(XBIdARRAY.indexOf(currentXb)!=-1){
			xbSelect[i].checked = "checked";
			stuffArray2.push(currentXb);
		}else{
			xbSelect[i].checked = "";
		}
	}
	$("#userDeparment"+row.bf990_ID).val(stuffArray2);
}

//单个删除用户
function removeUser(row) {
	$.showModal("#remindModal",true);
	$(".remindType").html("用户"+row.yhm);
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeUserArray = new Array;
		removeUserArray.push(row.bf990_ID);
		removeuUerAjaxDemo(removeUserArray);
		e.stopPropagation();
	});
}

//批量删除用户
function removeUsersBtn() {
	var chosenUsers = $('#allUserTable').bootstrapTable('getAllSelections');
	if (chosenUsers.length === 0) {
		toastr.warning('暂未选择任何用户');
	} else {
		var removeUserArray = new Array;
		$.showModal("#remindModal",true);
		$(".remindType").html("所选用户");
		$(".remindActionType").html("删除");
		for (var i = 0; i < chosenUsers.length; i++) {
			removeUserArray.push(chosenUsers[i].bf990_ID);
		}
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			removeuUerAjaxDemo(removeUserArray);
			e.stopPropagation();
		});
	}
}

//取消删除用户
function canleModify(row) {
	$('.roleTxt' + row.bf990_ID).show();
	$('.deparmentTxt' + row.bf990_ID).show();
	$('.blockStart' + row.bf990_ID).show();
	$(".blockName" + row.bf990_ID).show();
	$(".noneStart" + row.bf990_ID).hide();
	$("#userNameInTable" + row.bf990_ID).hide();
	$(".multipleInTableArea"+row.bf990_ID).find(".multi-select-container").hide();
	$(".deparmentInTableArea"+row.bf990_ID).find(".multi-select-container").hide();
}

//确认修改用户
function okModify(row, index) {
	var usernameInInput = $("#userNameInTable" + row.bf990_ID).val();
	var roleInSelect =$('#userRol' + row.bf990_ID).val();
	if (usernameInInput === "") {
		toastr.warning('用户名不能为空');
		return;
	}
	if (roleInSelect==null) {
		toastr.warning('用户权限未设置');
		return;
	}
	
	$.showModal("#remindModal",true);
	$(".remindType").html(row.yhm);
	$(".remindActionType").html("修改");
	//确认修改用户按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmodifyUser(row, index);
		e.stopPropagation();
	});
}

//发送修改用户
function confirmodifyUser(row, index) {
	var usernameInInput = $("#userNameInTable" + row.bf990_ID).val();
	var roleInSelect = getRoleMoreSelectVALUES("#userRol"+row.bf990_ID);
	var deparmentSelect = $('#userDeparment' + row.bf990_ID).val();
	var modifyObject =row;

	if(deparmentSelect==null){
		modifyObject.deparmentIds =null;
		modifyObject.deparmentNames =null;
	}else{
		deparmentSelect=getxBMoreSelectVALUES("#userDeparment"+row.bf990_ID)
		modifyObject.deparmentIds =deparmentSelect.value;
		modifyObject.deparmentNames =deparmentSelect.name;
	}

	modifyObject.BF990_ID = row.bf990_ID;
	modifyObject.yhm = usernameInInput;
	modifyObject.js = roleInSelect.name;
	modifyObject.jsId = roleInSelect.value;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/newUser",
		data: {
            "newUserInfo":JSON.stringify(modifyObject)
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
			$.hideModal("#remindModal");
			$("#allUserTable").bootstrapTable("updateByUniqueId", {id: row.bf990_ID, row: modifyObject});
			$(".tip").hide();
			toolTipUp(".myTooltip");
			toastr.success(backjson.msg);
			drawPagination(".allUserTableArea", "用户信息");
		}
	});
}

//删除用户请求模板
function removeuUerAjaxDemo(removeArray) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeUser",
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
			if (backjson.code === 200) {
				hideloding();
				tableRemoveAction("#allUserTable", removeArray, ".allUserTableArea", "用户信息");
				$.hideModal("#remindModal");
				$(".myTooltip").tooltipify();
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获得角色多选的值
function getRoleMoreSelectVALUES(id) {
	var values =$(id).val();
	var valuesTxt = "";
	if(values!=null){
		for (var i = 0; i < values.length; ++i) {
			valuesTxt+=values[i]+',';
		}
	}
	var valuesNames =new Array();
	for (var r = 0; r < roleOption.length; r++) {
		for (var v = 0; v < values.length; v++) {
			if(roleOption[r].bf990_ID===parseInt(values[v])){
				valuesNames.push(roleOption[r].js);
			}
		}
	}

	var nameStr="";
	for (var i = 0; i < valuesNames.length; i++) {
		nameStr+=valuesNames[i]+',';
	}

	var returnObject=new Object();
	returnObject.value=valuesTxt.substring(0,valuesTxt.length-1);
	returnObject.name=nameStr.substring(0,nameStr.length-1);

	return returnObject;
}

//获得系部多选的值
function getxBMoreSelectVALUES(id) {
	var values =$(id).val();
	var valuesTxt = "";
	if(values!=null){
		for (var i = 0; i < values.length; ++i) {
			valuesTxt+=values[i]+',';
		}
	}
	var valuesNames =new Array();
	for (var r = 0; r < departmentOption.length; r++) {
		for (var v = 0; v < values.length; v++) {
			if(departmentOption[r].edu104_ID===parseInt(values[v])){
				valuesNames.push(departmentOption[r].xbmc);
			}
		}
	}

	var nameStr="";
	for (var i = 0; i < valuesNames.length; i++) {
		nameStr+=valuesNames[i]+',';
	}

	var returnObject=new Object();
	returnObject.value=valuesTxt.substring(0,valuesTxt.length-1);
	returnObject.name=nameStr.substring(0,nameStr.length-1);

	return returnObject;
}

//开始检索
function startSearch(){
	var yhm=$("#yhm").val();
	var userName=$("#userName").val();
	var roleName=$("#roleName").val();
	var departmentName=$("#departmentName").val();
	if(yhm===""&&userName===""&&roleName===""&&departmentName===""){
		toastr.warning('请输入检索条件');
		return;
	}
	getUserInfo();
}

//重置检索
function reReloadSearchs(){
	var reObject = new Object();
	reObject.InputIds = "#yhm,#userName,#roleName,#departmentName";
	reReloadSearchsWithSelect(reObject);
	getUserInfo();
}

//按钮事件绑定
function btnBind() {
	//确认新增用户按钮
	$('.addConfirm').unbind('click');
	$('.addConfirm').bind('click', function(e) {
		addUser();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//批量删除按钮
	$('.removeUsersBtn').unbind('click');
	$('.removeUsersBtn').bind('click', function(e) {
		removeUsersBtn();
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#reReloadSearchs').unbind('click');
	$('#reReloadSearchs').bind('click', function(e) {
		reReloadSearchs();
		e.stopPropagation();
	});
}

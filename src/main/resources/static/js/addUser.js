var roleOptionStr="";//全局变量接收当前所有角色类型
$(function() {
	getallRole(); 
	drawNewUserRoleSelect();
	btnBind();
	getAllUserInfo();
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
			if(backjson.allRoleInfo.length===0){
				//首次使用 用户角色为空的情况
				roleOptionStr= '<option value="seleceConfigTip">暂无可选权限</option>';
			}else{
				roleOptionStr='<option value="seleceConfigTip">请选择用户角色</option>';
				for (var i = 0; i < backjson.allRoleInfo.length; i++) {
					roleOptionStr += '<option value="' +  backjson.allRoleInfo[i].js + '">' +  backjson.allRoleInfo[i].js + '</option>';
				}
			}
		}
	});
}

//初始化页面内容
function drawNewUserRoleSelect() {
	$("#newRole").append(roleOptionStr);
	$('.isSowIndex').selectMania(); //初始化下拉框
}

//添加用户
function addUser() {
	var username = $("#add_username").val();
	var newRole = getNormalSelectValue("newRole");
	var pwd = $("#add_pwd").val();
	var confirmPwd = $("#add_confirmPwd").val();

	verifyNewUserInfo(username, newRole, pwd, confirmPwd);
}

//验证用户输入
function verifyNewUserInfo(username, newRole, pwd, confirmPwd) {
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

	 if(newRole===""){
	 	toastr.warning('新用户权限未设置');
	 	$(".saveNewAccountSetUp").addClass("animated shake");
	 	reomveAnimation('.saveNewAccountSetUp', "animated shake");
	 	return;
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

	$.showModal("#remindModal",true);
	$(".remindType").html("用户"+username);
	$(".remindActionType").html("生成");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		//保存新用户设置
		saveNewUser(username, newRole, pwd, confirmPwd);
		e.stopPropagation();
	});
}

//发送新用户保存数据库
function saveNewUser(username, newRole, pwd, confirmPwd) {
	var newUserObject = new Object();
	newUserObject.yhm = username;
	newUserObject.js = newRole;
	newUserObject.mm = pwd;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/newUser",
		data: {
            "newUserInfo":JSON.stringify(newUserObject),
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
			if(backjson.userNameHave){
				toastr.warning('用户名已存在');
				return;
			}
			newUserObject.bf990_ID = backjson.id; //数据库生成的id
			$('#allUserTable').bootstrapTable('append', newUserObject);
			drawPagination(".allUserTableArea", "用户信息");
			var reObject = new Object();
			reObject.InputIds = "#add_username,#add_pwd,#add_confirmPwd";
			reObject.numberInputs = "#newRole";
			reReloadSearchsWithSelect(reObject);
			toolTipUp(".myTooltip");
			toastr.success('新增用户成功');
		}
	});
}

//获取所有用户
function getAllUserInfo() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllUser",
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
			stuffTable(backjson.allUser);
		}
	});
}

//填充所有用户table
function stuffTable(tableInfo) {
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

	$('#allUserTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10],
		showToggle: false,
		showFooter: false,
		search: true,
		editable: false,
		striped: true,
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".allUserTableArea", "用户信息");
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},{
				field: 'bf990_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'yhm',
				title: '用户名称',
				formatter: userNameFormatter,
				align: 'left'
			}, {
				field: 'js',
				title: '用户角色',
				align: 'left',
				formatter: userRoleFormatter,
			}, {
				field: 'action',
				title: '操作',
				align: 'center',
				width: '16%',
				formatter: allUserFormatter,
				events: allUserEvents,
			}
		]
	});

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
				'<span title="'+row.js+'" class="myTooltip roleTxt roleTxt' + row.bf990_ID + '">' + row.js + '</span><select class="myTableSelect myTableSelect' +
				row.bf990_ID + '" id="isSowIndex">' + roleOptionStr + '</select>'
			]
			.join('');
	}

	function userNameFormatter(value, row, index) {
		return [
				'<input id="userNameInTable' + row.bf990_ID + '" type="text" class="dfinput UserNameInTable Mydfinput" value="' + row.yhm +
				'"><span title="'+row.yhm+'" class="myTooltip blockName' +
				row.bf990_ID + '">' + row.yhm + '</span>'
			]
			.join('');
	}
	drawPagination(".allUserTableArea", "用户信息");
	drawSearchInput(".allUserTableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	changeColumnsStyle(".allUserTableArea", "用户信息");
}

//修改用户
function modifiRole(row) {
	$('.roleTxt' + row.bf990_ID).hide();
	$('.blockStart' + row.bf990_ID).hide();
	$(".blockName" + row.bf990_ID).hide();
	$(".myTableSelect" + row.bf990_ID).show();
	$(".noneStart" + row.bf990_ID).show();
	$("#userNameInTable" + row.bf990_ID).show();
	$(".currentId").html(row.bf990_ID);
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
	$('.blockStart' + row.bf990_ID).show();
	$(".blockName" + row.bf990_ID).show();
	$(".myTableSelect" + row.bf990_ID).hide();
	$(".noneStart" + row.bf990_ID).hide();
	$("#userNameInTable" + row.bf990_ID).hide();
}

//确认修改用户
function okModify(row, index) {
	var usernameInInput = $("#userNameInTable" + row.bf990_ID).val();
	var roleInSelect = $('.myTableSelect' + row.bf990_ID).val();
	if (usernameInInput === "") {
		toastr.warning('用户名不能为空');
		return;
	}
	if (typeof(roleInSelect) === "undefined"||roleInSelect==="seleceConfigTip") {
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
	var roleInSelect = $('.myTableSelect' + row.bf990_ID).val();
	var modifyObject =row;
	modifyObject.BF990_ID = row.bf990_ID;
	modifyObject.yhm = usernameInInput;
	modifyObject.js = roleInSelect;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/newUser",
		data: {
            "newUserInfo":JSON.stringify(modifyObject),
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
			if(backjson.userNameHave){
				toastr.warning('用户名已存在');
				return;
			}
			$('#allUserTable').bootstrapTable('updateRow', {
				index: index,
				row: modifyObject
			});
			$(".tip").hide();
			toolTipUp(".myTooltip");
			toastr.success('修改用户成功');
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
			if (backjson.result) {
				hideloding();
				tableRemoveAction("#allUserTable", removeArray, ".allUserTableArea", "用户信息");
				$.hideModal("#remindModal");
				$(".myTooltip").tooltipify();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
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
}

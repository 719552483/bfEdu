roleOptionStr = getallRole(); //全局变量接收当前所有角色类型

$(function() {
	drawNewUserRoleSelect();
	btnBind();
	getAllUserInfo();
});

//获取所有角色类型
function getallRole() {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	//这里还应该考虑首次使用  backjson长度为0 既用户角色为空的情况
	backjson = ["角色1", "角色2", "角色3"];
	var str;
	for (var i = 0; i < backjson.length; i++) {
		str += '<option value="' + backjson[i] + '">' + backjson[i] + '</option>';
	}
	return str;
}

//初始化页面内容
function drawNewUserRoleSelect() {
	$("#newRole").append(roleOptionStr);
	$('.isSowIndex').selectMania(); //初始化下拉框
}

//添加用户
function addUser() {
	var username = $("#add_username").val();
	var newRole = $('#newRole').selectMania('get')[0].value;
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

	// if(newRole===""){
	// 	toastr.warning('新用户权限未设置');
	// 	$(".saveNewAccountSetUp").addClass("animated shake");
	// 	reomveAnimation('.saveNewAccountSetUp', "animated shake");
	// 	return;
	// }

	//新旧密码对比
	if (pwd !== confirmPwd) {
		toastr.warning('确认密码不正确');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}

	//规则检查   todo

	//保存新用户设置
	saveNewUser(username, newRole, pwd, confirmPwd);
}

//发送新用户保存数据库
function saveNewUser(username, newRole, pwd, confirmPwd) {
	// $.ajax({
	// 	method : 'get',
	// 	cache : false,
	// 	url : "testJson/getIndexChartsInfo.json",
	// 	dataType : 'json',
	// 	success : function(backjson) {
	// 		showCostConsumption(backjson);
	// 		showMdc(backjson);
	// 		showOfficeCount(backjson);
	// 		showDoctorsStatistical(backjson);
	// 	}
	// });
	var insertObject = new Object();
	insertObject.id = "id3"; //数据库生成的id
	insertObject.userName = username;
	insertObject.userRole = newRole;
	$('#allUserTable').bootstrapTable('append', insertObject);
	toastr.success('新增用户成功');
	$("#add_username,#add_pwd,#add_confirmPwd").val("");
	drawPagination(".allUserTableArea", "用户信息");
}

//获取所有用户
function getAllUserInfo() {
	// 发送查询所有用户请求
	$.ajax({
		method: 'get',
		cache: false,
		url: "mapJson/test.json",
		dataType: 'json',
		beforeSend: function(xhr) {
			requestErrorbeforeSend();
		},
		success: function(backjson) {
			var tableInfo = {
				"newsInfo": [{
					"id": "id1",
					"userName": "admin1",
					"userRole": "角色1"
				}, {
					"id": "id2",
					"userName": "admin2",
					"userRole": "角色1"
				}]
			}
			stuffTable(tableInfo);
			hideloding();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
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
		data: tableInfo.newsInfo,
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
		showColumns: false,
		onPageChange: function() {
			drawPagination(".allUserTableArea", "用户信息");
		},
		columns: [{
				field: 'id',
				title: 'id',
				align: 'center',
				visible: false
			},
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'userName',
				title: '用户名称',
				formatter: userNameFormatter,
				align: 'left'
			}, {
				field: 'userRole',
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
				'<li id="modifiRole" class="blockStart blockStart' + row.id +
				'"><span><img src="images/t02.png" style="width:24px"></span>角色修改</li>' +
				'<li id="removeUser" class="blockStart blockStart' + row.id + '"><span><img src="images/t03.png"></span>删除用户</li>' +
				'<li id="tableOk" class="noneStart noneStart' + row.id +
				'"><span><img src="img/right.png" style="width:24px"></span>确认</li>' +
				'<li id="tableCanle" class="noneStart noneStart' + row.id + '"><span><img src="images/t03.png"></span>取消</li>' +
				'</ul>'
			]
			.join('');
	}

	function userRoleFormatter(value, row, index) {
		return [
				'<span title="'+row.userRole+'" class="myTooltip roleTxt roleTxt' + row.id + '">' + row.userRole + '</span><select class="myTableSelect myTableSelect' +
				row.id + '" id="isSowIndex">' + roleOptionStr + '</select>'
			]
			.join('');
	}

	function userNameFormatter(value, row, index) {
		return [
				'<input id="userNameInTable' + row.id + '" type="text" class="dfinput UserNameInTable" value="' + row.userName +
				'"><span title="'+row.userName+'" class="myTooltip blockName' +
				row.id + '">' + row.userName + '</span>'
			]
			.join('');
	}

	drawPagination(".allUserTableArea", "用户信息");
	drawSearchInput();
	toolTipUp(".myTooltip");
}

//修改用户
function modifiRole(row) {
	$('.roleTxt' + row.id).hide();
	$('.blockStart' + row.id).hide();
	$(".blockName" + row.id).hide();
	$(".myTableSelect" + row.id).show();
	$(".noneStart" + row.id).show();
	$("#userNameInTable" + row.id).show();
	$(".currentId").html(row.id);
}

//单个删除用户
function removeUser(row) {
	$(".removeUserTip").show();
	$('.confirmremoveUser').unbind('click');
	$('.confirmremoveUser').bind('click', function(e) {
		var removeUserArray = new Array;
		removeUserArray.push(row.id);
		removeNewsAjaxDemo("#allUserTable", removeUserArray, ".allUserTableArea", "用户信息");
		e.stopPropagation();
	});
}

//批量删除用户
function removeUsersBtn() {
	var chosenUsers = $('#allUserTable').bootstrapTable('getAllSelections');
	if (chosenUsers.length === 0) {
		toastr.warning('暂未选择任何通知');
	} else {
		var removeUserArray = new Array;
		$(".removeUserTip").show();
		for (var i = 0; i < chosenUsers.length; i++) {
			removeUserArray.push(chosenUsers[i].id);
		}
		$('.confirmremoveUser').unbind('click');
		$('.confirmremoveUser').bind('click', function(e) {
			removeNewsAjaxDemo("#allUserTable", removeUserArray, ".allUserTableArea", "用户信息");
			e.stopPropagation();
		});
	}
}

//取消删除用户
function canleModify(row) {
	$('.roleTxt' + row.id).show();
	$('.blockStart' + row.id).show();
	$(".blockName" + row.id).show();
	$(".myTableSelect" + row.id).hide();
	$(".noneStart" + row.id).hide();
	$("#userNameInTable" + row.id).hide();
}

//确认修改用户
function okModify(row, index) {
	var usernameInInput = $("#userNameInTable" + row.id).val();
	var roleInSelect = $('.myTableSelect' + row.id).val();
	if (usernameInInput !== row.userName || roleInSelect !== row.userRole) {
		$(".modifyUserTip").show();
		//确认修改用户按钮
		$('.confirmodifyUser').unbind('click');
		$('.confirmodifyUser').bind('click', function(e) {
			confirmodifyUser(row, index);
			e.stopPropagation();
		});
	} else {
		canleModify(row);
	}
}

//确认修改用户
function confirmodifyUser(row, index) {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	var usernameInInput = $("#userNameInTable" + row.id).val();
	var roleInSelect = $('.myTableSelect' + row.id).val();
	var updateObject = new Object();
	updateObject.id = row.id;
	updateObject.userName = usernameInInput;
	updateObject.userRole = roleInSelect;
	$('#allUserTable').bootstrapTable('updateRow', {
		index: index,
		row: updateObject
	});
	$(".tip").hide();
	toolTipUp(".myTooltip");
	toastr.success('修改用户成功');
	drawPagination(".allUserTableArea", "用户信息");
}

//删除用户请求模板
function removeuUerAjaxDemo(news) {
	// 发送查询所有用户请求
	// $.ajax({
	// 	method: 'get',
	// 	cache: false,
	// 	url: "mapJson/test.json",
	// 	data: {
	// 		"newShortcut": JSON.stringify(news)
	// 	},
	// 	dataType: 'json',
	// 	success: function(backjson) {
	// 		if (backjson.result) {
	// 			for (var i = 0; i < news.length; i++) {
	// 					$('#releaseNewsTable').bootstrapTable('removeByUniqueId',news[i]);
	// 			}
	// 			$(".tip").hide();
	// 			drawPagination("通知");
	// 			toastr.success('删除成功');
	// 		} else {
	// 			toastr.error('操作失败');
	// 		}
	// 	}
	// });
	for (var i = 0; i < news.length; i++) {
		$('#allUserTable').bootstrapTable('removeByUniqueId', news[i]);
		toolTipUp(".myTooltip");
	}
	$(".tip").hide();
	drawPagination(".allUserTableArea", "用户信息");
	toastr.success('删除用户成功');
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
	$('.tipCancelBtn,.cancelremoveUser,.modifyUserTip,.tipCancelBtn').unbind('click');
	$('.tipCancelBtn,.cancelremoveUser,.modifyUserTip,.tipCancelBtn').bind('click', function(e) {
		$(".tip").hide();
		e.stopPropagation();
	});

	//批量删除按钮
	$('.removeUsersBtn').unbind('click');
	$('.removeUsersBtn').bind('click', function(e) {
		removeUsersBtn();
		e.stopPropagation();
	});
}

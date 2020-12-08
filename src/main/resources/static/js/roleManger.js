$(function() {
	showAllShortcuts();
	btnBind();
	drawAuthorityGroup();
	authorityGroupChange();
	getAllRoleInfo();
	$("#anqx").multiSelect(); 
});

//获取所有角色类型
function drawAuthorityGroup() {
	var str = '<option value="全部">全部</option>';
	var allMenuParents = $(parent.frames["leftFrame"].document).find(".leftmenu").find('.title'); //frame获取父窗口中的menu
	for (var i = 0; i < allMenuParents.length; i++) {
		str += '<option value="' + allMenuParents[i].innerText + '">' + allMenuParents[i].innerText + '</option>';
	}
	$("#authorityGroup").append(str);
	$('.isSowIndex').selectMania(); //初始化下拉框
}

/*
显示所有可选快捷方式
*/
function showAllShortcuts() {
	drawAllShortcuts();
	allShortcutsDrawChoosend();
	shortcutsMouseAction();
}

/*
根据菜单渲染所有选择
*/
function drawAllShortcuts() {
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	var allShortcutsNum = $(".allShortcuts").find(".bacimg").length;
	if (allShortcutsNum <= 0) {
		for (var i = 0; i < currentMenus.length; ++i) {
			$(".allShortcuts").append('<div class="bacimg ' + currentMenus[i].id + '">' +
				'<div class="choosingArea">' +
				'<img src="img/' + currentMenus[i].id + '.png" />' +
				'<div class="cover">' +
				'已选' +
				'</div>' +
				'</div>' +
				'<h2><a>' + currentMenus[i].innerText + '</a></h2>' +
				'<p><a class="wantAddShortcut">添加</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="giveupAddShortcut">取消</a></p>' +
				'</div>')
		}
	}
}

/*
渲染已选
*/
function allShortcutsDrawChoosend() {
	var choosedShortcutsArray = new Array;
	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		choosedShortcutsArray.push($(".choosendShortcuts").find("li")[i].classList[0])
	}
	var allShortcuts = $(".allShortcuts").find(".bacimg");
	for (var i = 0; i < allShortcuts.length; ++i) {
		if (choosedShortcutsArray.indexOf(allShortcuts[i].classList[1]) === -1) {
			$(".allShortcuts").find("." + allShortcuts[i].classList[1]).removeClass("imgSha");
			$("." + allShortcuts[i].classList[1]).find(".cover").hide();
			allShortcuts[i].setAttribute("choosed", false);
		} else {
			$(".allShortcuts").find("." + allShortcuts[i].classList[1]).addClass("imgSha");
			$("." + allShortcuts[i].classList[1]).find(".cover").show();
			allShortcuts[i].setAttribute("choosed", true);
		}
	}
}

/*
鼠标移入移出
*/
function shortcutsMouseAction() {
	$(".allShortcuts").on('mouseover', '.bacimg', function(e) {
		if (e.currentTarget.childNodes[0].childNodes[1].style.display === "none") {
			e.currentTarget.childNodes[0].childNodes[1].style.display = "block";
			e.currentTarget.childNodes[0].childNodes[1].firstChild.data = "选择";
		}
		e.currentTarget.classList.add("imgSha");
	}).on('mouseout', '.bacimg', function(e) {
		if (e.currentTarget.attributes[1].nodeValue === "false") {
			e.currentTarget.childNodes[0].childNodes[1].style.display = "none";
			e.currentTarget.classList.remove("imgSha");
		}
	});
}

/*
快捷方式区域按钮绑定事件
*/
function btnBind() {
	$('#addShortcuts').unbind('click');
	$('#addShortcuts').bind('click', function(e) {
		addShortcuts();
		e.stopPropagation();
	});

	$('#shortcutsGiveup').unbind('click');
	$('#shortcutsGiveup').bind('click', function(e) {
		shortcutsGiveup();
	});

	$('#shortcutsAllChose').unbind('click');
	$('#shortcutsAllChose').bind('click', function(e) {
		shortcutsAllChose();
		e.stopPropagation();
	});

	$('#shortcutsRefresh').unbind('click');
	$('#shortcutsRefresh').bind('click', function(e) {
		shortcutsRefresh();
		e.stopPropagation();
	});

	$('#addRole').unbind('click');
	$('#addRole').bind('click', function(e) {
		addRole();
		e.stopPropagation();
	});

	$('#canleiModifRole').unbind('click');
	$('#canleiModifRole').bind('click', function(e) {
		canleiModifRole();
		e.stopPropagation();
	});

	$('#canleShowRoleAuthoritys').unbind('click');
	$('#canleShowRoleAuthoritys').bind('click', function(e) {
		canleShowRoleAuthoritys();
		e.stopPropagation();
	});

	$('.removeUsersBtn').unbind('click');
	$('.removeUsersBtn').bind('click', function(e) {
		removeRolersBtn();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	$(".allShortcuts").on('click', '.wantAddShortcut,.cover', function(e) {
		wantAddShortcut(e);
		e.stopPropagation();
	});

	$(".allShortcuts").on('click', '.giveupAddShortcut', function(e) {
		giveupAddShortcut(e.srcElement.parentNode.parentNode);
		e.stopPropagation();
	});
}

/*
快捷方式上方取消按钮
*/
function shortcutsGiveup() {
	$(".configIndexPage").show();
	$(".allShortcuts").hide();
	$(".choosendShortcuts").find("li").removeClass("imgSha");
	$(".placeul").find("li:eq(1)").remove();
}

/*
快捷方式上方确定按钮
*/
function addShortcuts() {
	var oldShortcutsList = new Array;
	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		oldShortcutsList.push($(".choosendShortcuts").find("li")[i].classList[0]);
	}
	var newShortcutsList = new Array;
	for (var i = 0; i < $(".bacimg").length; ++i) {
		if ($(".bacimg")[i].attributes[1].nodeValue === "true") {
			newShortcutsList.push($(".bacimg")[i].classList[1]);
		}
	}

	if (!isSameArray(newShortcutsList, oldShortcutsList)) {
		$(".tip").show().fadeIn(200);
		$(".tipTitle").html("快捷方式");
	} else {
		shortcutsGiveup();
	}
}

/*
预备添加
*/
function wantAddShortcut(e) {
	if (e.srcElement.offsetParent.attributes[1].nodeValue === "true") {
		e.srcElement.offsetParent.className = e.srcElement.offsetParent.className + " animated shake";
		//动画执行完后删除类名
		reomveAnimation('.bacimg', "animated shake");
	} else {
		e.srcElement.offsetParent.childNodes[0].childNodes[1].style.display = "block";
		e.srcElement.offsetParent.childNodes[0].childNodes[1].firstChild.data = "已选";
		e.srcElement.offsetParent.setAttribute("choosed", true);
	}
}

/*
取消预备添加
*/
function giveupAddShortcut(e) {
	if (e.attributes[1].nodeValue === "true") {
		e.childNodes[0].childNodes[1].style.display = "none";
		e.classList.remove("imgSha");
		e.setAttribute("choosed", false);
	} else {
		e.className = e.className + " animated shake";
		//动画执行完后删除类名
		reomveAnimation('.bacimg', "animated shake");
	}
}

/*
重置按钮
*/
function shortcutsRefresh() {
	var currentALLShortcuts = $(".bacimg");
	$(".bacimg").removeClass("imgSha");
	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].attributes[1].nodeValue = false;
		currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "none";
	}

	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].style.display = "block";
	}
	reDrawSelect('#authorityGroup', '全部', '全部');
}

/*
全选按钮
*/
function shortcutsAllChose() {
	var currentALLShortcuts = $(".bacimg");
	$(".bacimg").removeClass("imgSha");
	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].attributes[1].nodeValue = true;
		currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "block";
		var oldClass = currentALLShortcuts[i].className;
		currentALLShortcuts[i].className = oldClass + ' imgSha';
	}

	for (var i = 0; i < currentALLShortcuts.length; ++i) {
		currentALLShortcuts[i].style.display = "block";
	}
	reDrawSelect('#authorityGroup', '全部', '全部');
}


//权限分类下拉框事件绑定
function authorityGroupChange() {
	$("#authorityGroup").change(function() {
		groupChangeAction();
	})
}

//权限分类下拉框事件
function groupChangeAction() {
	var currentGroup = $('#authorityGroup').selectMania('get')[0].value;
	var allAuthoritys = $(".allShortcuts").find(".bacimg");
	if (currentGroup === "全部") {
		for (var i = 0; i < allAuthoritys.length; ++i) {
			allAuthoritys[i].style.display = "block";
		}
	} else if (currentGroup === "系统管理") {
		for (var i = 0; i < allAuthoritys.length; ++i) {
			allAuthoritys[i].style.display = "none";
		}
		$(".allShortcuts").find(".addAccount").show();
		$(".allShortcuts").find(".authoritysConfiguration").show();
	} else {
		var allMenuParents = $(parent.frames["leftFrame"].document).find(".leftmenu").find('.title'); //frame获取父窗口中的menu
		var showMenuson;
		var showMenusonArray = new Array();
		for (var i = 0; i < allMenuParents.length; ++i) {
			if (allMenuParents[i].innerText == currentGroup) {
				showMenuson = allMenuParents[i].nextElementSibling.children;
			}
		}

		for (var i = 0; i < showMenuson.length; ++i) {
			showMenusonArray.push(showMenuson[i].innerText);
		}

		for (var i = 0; i < allAuthoritys.length; ++i) {
			if (showMenusonArray.indexOf(allAuthoritys[i].childNodes[1].innerText) !== -1) {
				allAuthoritys[i].style.display = "block";
			} else if (showMenusonArray.indexOf(allAuthoritys[i].childNodes[1].innerText) === -1) {
				allAuthoritys[i].style.display = "none";
			}
		}
	}
	var allHide=true;
	var allbacimg=$(".bacimg");
	for (var i = 0; i < allbacimg.length; ++i) {
		if(allbacimg[i].style.display==="block"){
			allHide=false;
			break;
		}
	}

	if(allHide){
		$(".noAuthorityArea").show()
	}else{
		$(".noAuthorityArea").hide()
	}
}


//添加角色按钮
function addRole() {
	var addRolename = $("#add_rolename").val();
	var newRoleAuthoritys = getNewRoleAuthoritys();
	var newAnqx = getNewAnqxs();
	if (addRolename === "") {
		toastr.warning('新角色名称不能为空');
		return;
	}

	if (newRoleAuthoritys.length === 0) {
		toastr.warning('新角色未选择菜单权限');
		return;
	}
	
	if (newAnqx==="") {
		toastr.warning('新角色未选择按钮权限');
		return;
	}
	
	
	
	$.showModal("#remindModal",true);
	$(".remindType").html("角色");
	$(".remindActionType").html("新增");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		comfirmAddRole(addRolename, newRoleAuthoritys,newAnqx);
		e.stopPropagation();
	});
}

//确认新增角色
function comfirmAddRole(roleName, authorityInfo,newAnqx) {
	//组装角色对象
	var roleObject=new Object();
	roleObject.js=roleName;
	roleObject.cdqx=authorityInfo;
	roleObject.anqx=newAnqx;
	
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addRole",
		data: {
             "newRoleInfo":JSON.stringify(roleObject) 
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
			if (backjson.code == 200) {
				$.hideModal("#remindModal");
				roleObject.bf991_ID=backjson.data;
				$('#allRoleTable').bootstrapTable('append', roleObject);
				drawPagination(".allRoleTableArea", "角色信息");
				toastr.success(backjson.msg);
				$("#add_rolename").val("");
				shortcutsRefresh();
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
	
	
}

/*
获得新选择快捷方式
*/
function getNewRoleAuthoritys() {
	var allShortcuts = $(".bacimg");
	var currentShortcutList = new Array();
	var newShortcut = new Array();
	var newShortcutValues = "";
	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		currentShortcutList.push($(".choosendShortcuts").find("li")[i].classList[0]);
	}

	for (var i = 0; i < allShortcuts.length; ++i) {
		if (allShortcuts[i].attributes[1].nodeValue === "true") {
			newShortcut.push(allShortcuts[i].classList[1]);
		}
	}
	
	for (var i = 0; i < newShortcut.length; ++i) {
		newShortcutValues+=newShortcut[i]+',';
	}
	
	return newShortcutValues.substring(0,newShortcutValues.length-1);
}

/*
获得新选择按钮权限
*/
function getNewAnqxs() {
	var anqxs =$("#anqx").val();
	var anqxValues = "";
	if(anqxs!=null){
		for (var i = 0; i < anqxs.length; ++i) {
			anqxValues+=anqxs[i]+',';
		}
	}
	return anqxValues.substring(0,anqxValues.length-1);
}

//获取所有角色信息
function getAllRoleInfo() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getAllRole",
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
				stuffTable(backjson.data.allRole);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

var choosend=new Array();
//填充角色表
function stuffTable(tableInfo) {
	window.allRoleEvents = {
		'click #wantModifyRole': function(e, value, row, index) {
			wantModifyRole(row, index);
		},
		'click #removeRole': function(e, value, row, index) {
			removeRoler(row);
		},
		'click #showRoleAuthoritys': function(e, value, row, index) {
			showRoleAuthoritys(row, index);
		}
	};

	$('#allRoleTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		striped: true,
		toolbar: '#toolbar',
		showColumns: true,
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
			drawPagination(".allRoleTableArea", "角色信息");
			for (var i = 0; i < choosend.length; i++) {
				$("#allRoleTable").bootstrapTable("checkBy", {field:"bf991_ID", values:[choosend[i].bf991_ID]})
			}
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},{
				field: 'bf991_ID',
				title: '唯一标识',
				align: 'center',
				sortable: true,
				visible: false
			},
			{
				field: 'js',
				title: '角色名称',
				align: 'left',
				sortable: true,
				formatter: paramsMatter
			}, {
				field: 'cdqx',
				title: '菜单权限',
				align: 'left',
				clickToSelect: false,
				formatter: authorityInfoFormatter,
				events: allRoleEvents
			}, {
				field: 'anqx',
				title: '按钮权限',
				sortable: true,
				formatter: anqxFormatter,
				align: 'left'
			}, {
				field: 'action',
				title: '操作',
				clickToSelect: false,
				align: 'center',
				formatter: allRoleFormatter,
				events: allRoleEvents
			}
		]
	});

	function allRoleFormatter(value, row, index) {
		return [
				'<ul class="toolbar tabletoolbar">' +
				'<li id="wantModifyRole" class="blockStart blockStart' + row.id +
				'"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
				'<li id="removeRole" class="blockStart blockStart' + row.id + '"><span><img src="images/t03.png"></span>删除</li>' +
				'</ul>'
			]
			.join('');
	}

	function authorityInfoFormatter(value, row, index) {
		return [
			'<ul class="toolbar tabletoolbar">' +
			'<li id="showRoleAuthoritys" class="blockStart blockStart' + row.id +
			'"><span><img src="images/i02.png" style="width:24px"></span>查看所有菜单权限</li>' +
			'</ul>'
		]
	}
	
	function anqxFormatter(value, row, index) {
		var anqxString="";
		var anqx=row.anqx.split(",");
		for (var i = 0; i < anqx.length; i++) {
			if(anqx[i]==="insert"){
				anqxString+='<span class="label label-success">可新增</span>';
			}else if(anqx[i]==="delete"){
				anqxString+='<span class="label label-danger">可删除</span>';
			}else if(anqx[i]==="modify"){
				anqxString+='<span class="label label-primary">可修改</span>';
			}else if(anqx[i]==="query"){
				anqxString+='<span class="label label-info">可查询</span>';
			}
		}
		return [
			'<div class="anqxArea">'+anqxString+'</div>'
		]
	}
	drawPagination(".allRoleTableArea", "角色信息");
	drawSearchInput(".allRoleTableArea");
	changeColumnsStyle( ".allRoleTableArea", "学生信息");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//单选学生
function onCheckRelation(row){
	if(choosend.length<=0){
		choosend.push(row);
	}else{
		var add=true;
		for (var i = 0; i < choosend.length; i++) {
			if(choosend[i].bf991_ID===row.bf991_ID){
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
			if(choosend[i].bf991_ID===row.bf991_ID){
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
		a.push(row[i].bf991_ID);
	}


	for (var i = 0; i < choosend.length; i++) {
		if(a.indexOf(choosend[i].bf991_ID)!==-1){
			choosend.splice(i,1);
			i--;
		}
	}
}

//查看角色所有权限
function showRoleAuthoritys(row, index) {
	$("#tab1,#canleShowRoleAuthoritys,.formtext").show();
	$("#addRole,#tab2,#shortcutsAllChose,#shortcutsRefresh,.forminfo").hide();
	$(".roleName_forShowAuthority").html(row.js);
	$(".forminfo").find("li").find("i").hide();
	choseCurrentAuthoritys(row, index)
}

//取消查看角色所有权限
function canleShowRoleAuthoritys(row, index) {
	$("#tab1,#canleShowRoleAuthoritys,.formtext").hide();
	$("#addRole,#tab2,#shortcutsAllChose,#shortcutsRefresh,.forminfo").show();
	// choseCurrentAuthoritys(row, index)
}

//修改角色
function wantModifyRole(row, index) {
	$(".currentId").html(row.bf991_ID);
	$("#tab1,#modifyRole,#canleiModifRole").show();
	$("#addRole,#tab2").hide();
	$("#add_rolename").val(row.js).focus();
	shortcutsRefresh();
	choseCurrentAuthoritys(row, index);
	multiSelectWithDefault("#anqx",row.anqx.split(",")); //按钮权限
}

//在所有权限去勾选当前角色所拥护的权限
function choseCurrentAuthoritys(row, index) {
	var currentALLShortcuts = $(".bacimg");
	$(".bacimg").removeClass("imgSha");
	if(row.cdqx==="sys"){
		for (var i = 0; i < currentALLShortcuts.length; ++i) {
			currentALLShortcuts[i].attributes[1].nodeValue = true;
			currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "block";
			currentALLShortcuts[i].classList.add("imgSha");
		}
	}else{
		var authorityInfoArray = row.cdqx.split(",");
		for (var i = 0; i < currentALLShortcuts.length; ++i) {
			if (authorityInfoArray.indexOf(currentALLShortcuts[i].classList[1]) !== -1) {
				currentALLShortcuts[i].attributes[1].nodeValue = true;
				currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "block";
				currentALLShortcuts[i].classList.add("imgSha");
			} else {
				currentALLShortcuts[i].attributes[1].nodeValue = false;
				currentALLShortcuts[i].childNodes[0].childNodes[1].style.display = "none";
			}
		}

		for (var i = 0; i < currentALLShortcuts.length; ++i) {
			currentALLShortcuts[i].style.display = "block";
		}
	}
	
	


	$('#modifyRole').unbind('click');
	$('#modifyRole').bind('click', function(e) {
		modifyRole(row, index);
		e.stopPropagation();
	});
}

//修改角色
function modifyRole(row, index) {
	var addRolename = $("#add_rolename").val();
	var newRoleAuthoritys = getNewRoleAuthoritys();
	var newAnqx = getNewAnqxs();
	if (addRolename === "") {
		toastr.warning('角色名称不能为空');
		return;
	}

	if (newRoleAuthoritys.length === 0) {
		toastr.warning('角色暂未选择任何权限');
		return;
	}
	
	if (newAnqx==="") {
		toastr.warning('角色未选择按钮权限');
		return;
	}
	

	if (newRoleAuthoritys===row.cdqx && addRolename === row.js&&row.anqx===newAnqx) {
		toastr.warning('暂未进行任何操作');
		return;
	}

	$.showModal("#remindModal",true);
	$(".remindType").html("所选角色权限");
	$(".remindActionType").html("修改");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		//组装角色对象
		var roleObject=new Object();
		roleObject.BF991_ID=row.bf991_ID;
		roleObject.js=addRolename;
		roleObject.cdqx=newRoleAuthoritys;
		roleObject.anqx=newAnqx;
		comfirmModifyRole(roleObject,index);
		e.stopPropagation();
	});
}

//确认修改角色
function comfirmModifyRole(roleObject,index) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/addRole",
		data: {
             "newRoleInfo":JSON.stringify(roleObject)
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
				$.hideModal("#remindModal");
				$('#allRoleTable').bootstrapTable('updateRow', {
					index: index,
					row: roleObject
				});
				toolTipUp(".myTooltip");
				$("#tab1,#modifyRole,#canleiModifRole").hide();
				$("#addRole,#tab2").show();
				$(".forminfo").find("li").find("i").show();
				toastr.success(backjson.msg);
				drawPagination(".allRoleTableArea", "角色信息");
			} else {
				hideloding();
				toastr.warning(backjson.msg);
			}
		}
	});

}

//取消修改角色
function canleiModifRole() {
	$("#tab1,#modifyRole,#canleiModifRole,#tab2").show();
	$("#addRole,#tab1").hide();
	$(".forminfo").find("li").find("i").hide();
}

//删除角色
function removeRoler(row) {
	$.showModal("#remindModal",true);
	$(".remindType").html("角色");
	$(".remindActionType").html("删除");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeUserArray = new Array;
		removeUserArray.push(row.bf991_ID);
		sendRoleRemoveInfo(removeUserArray);
		e.stopPropagation();
	});
}

//批量删除角色
function removeRolersBtn() {
	var chosenUsers = $('#allRoleTable').bootstrapTable('getAllSelections');
	if (chosenUsers.length === 0) {
		toastr.warning('暂未选择任何角色');
	} else {
		var removeUserArray = new Array;
		$(".comfirmRemoveRoleTip").show();
		for (var i = 0; i < chosenUsers.length; i++) {
			removeUserArray.push(chosenUsers[i].bf991_ID);
		}
		$.showModal("#remindModal",true);
		$(".remindType").html("所选角色");
		$(".remindActionType").html("删除");
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			sendRoleRemoveInfo(removeUserArray);
			e.stopPropagation();
		});
	}
}

//发送删除培养计划下的专业课程请求
function sendRoleRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeRole",
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
				$.hideModal("#remindModal");
				tableRemoveAction("#allRoleTable", removeArray, ".allRoleTableArea", "角色信息");
				$(".myTooltip").tooltipify();
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//重新加载tab
function reloadTab() {
	$(".toolbar1,#addRole").show();
	$("#canleShowRoleAuthoritys,#modifyRole,#canleiModifRole").hide();
	$("#canleShowRoleAuthoritys,.formtext").hide();
	$("#addRole,#shortcutsAllChose,#shortcutsRefresh,.forminfo").show();
	$(".forminfo").find("li").find("i").show();
	$("#add_rolename").val("");
	shortcutsRefresh();
}

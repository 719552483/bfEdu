$(function() {
	$("#anqx").multiSelect();
	getAllRoleInfo();
	drawAllShortcuts();
	btnBind();
});

//根据菜单渲染所有选择
function drawAllShortcuts() {
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	var allShortcutsNum = $(".allShortcuts").find(".bacimg").length;
	if (allShortcutsNum <= 0) {
		for (var i = 0; i < currentMenus.length; ++i) {
			if(currentMenus[i].attributes[3].nodeValue==="true"){
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
}

//获取所有角色信息
function getAllRoleInfo() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/selectGzhAuthority",
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
				stuffTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//填充角色表
function stuffTable(tableInfo) {
	window.allRoleEvents = {
		'click #wantModifyRole': function(e, value, row, index) {
			wantModifyRole(row, index);
		},
		'click #showRoleAuthoritys': function(e, value, row, index) {
			showRoleAuthoritys(row, index);
		}
	};

	$('#gzhRoleTable').bootstrapTable('destroy').bootstrapTable({
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
		onPageChange: function() {
			drawPagination(".gzhRoleTableArea", "角色信息");
		},
		onPostBody: function() {
			toolTipUp(".myTooltip");
		},
		columns: [
			{
				field: 'bf995_ID',
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
				clickToSelect: false,
				formatter: anqxFormatter,
				align: 'left'
			}, {
				field: 'action',
				title: '操作',
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
		var anqx='';
		if(row.anqx!=null&&row.anqx!==''&&typeof row.anqx!=="undefined"){
			anqx=row.anqx.split(",")
		}else{
			anqx.length=0;
			anqxString="暂未设置按钮权限";
		}

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
	drawPagination(".gzhRoleTableArea", "角色信息");
	drawSearchInput(".gzhRoleTableArea");
	changeColumnsStyle( ".gzhRoleTableArea", "学生信息");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
}

//查看角色权限
function showRoleAuthoritys(row, index){
	$(".tools,.qxArea,#canleShowRoleAuthoritys").show();
	$(".gzhRoleTableArea,.authorityGroupArea,#shortcutsAllChose,#shortcutsRefresh,.toolbar1").hide();
	$(".roleName_forShowAuthority").html(row.js);
	allShortcutsDrawChoosend();
	shortcutsMouseAction();
	choseCurrentAuthoritys(row, index);
}

//查看角色权限取消返回
function canleShowRoleAuthoritys(){
	$(".tools,.qxArea").hide();
	$(".gzhRoleTableArea").show();
}

//修改角色
function wantModifyRole(row, index) {
	$(".tools,.qxArea,.authorityGroupArea,#shortcutsAllChose,#shortcutsRefresh,.toolbar1").show();
	$(".gzhRoleTableArea,#canleShowRoleAuthoritys").hide();
	$(".roleName_forShowAuthority").html(row.js);
	allShortcutsDrawChoosend();
	shortcutsMouseAction();
	choseCurrentAuthoritys(row, index);
	authorityGroupChange();

	if(row.anqx!=null&&row.anqx!==''&&typeof row.anqx!=="undefined"){
		multiSelectWithDefault("#anqx",row.anqx.split(",")); //按钮权限
	}

	//确认修改权限
	$('#modifyRole').unbind('click');
	$('#modifyRole').bind('click', function(e) {
		modifyRole(row, index);
		e.stopPropagation();
	});
}

//修改角色取消返回
function canleiModifRole() {
	$(".tools,.qxArea").hide();
	$(".gzhRoleTableArea").show();
}

//预备修改权限
function modifyRole(row, index) {
	var newRoleAuthoritys = getNewRoleAuthoritys();
	var newAnqx = getNewAnqxs();
	if (newRoleAuthoritys.length === 0) {
		toastr.warning('角色暂未选择任何权限');
		return;
	}

	if (newAnqx==="") {
		toastr.warning('角色未选择按钮权限');
		return;
	}

	if (newRoleAuthoritys===row.cdqx &&row.anqx===newAnqx) {
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
		roleObject.BF995_ID=row.bf995_ID;
		roleObject.BF991_ID=row.bf991_ID;
		roleObject.cdqx=newRoleAuthoritys;
		roleObject.anqx=newAnqx;
		roleObject.js=row.js;
		comfirmModifyRole(roleObject,index);
		e.stopPropagation();
	});
}

//确认修改角色
function comfirmModifyRole(roleObject,index) {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/updateGzhAuthority",
		data: {
			"authorityInfo":JSON.stringify(roleObject)
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
				$('#gzhRoleTable').bootstrapTable('updateRow', {
					index: index,
					row: roleObject
				});
				toolTipUp(".myTooltip");
				canleiModifRole()
				toastr.success(backjson.msg);
				drawPagination(".gzhRoleTableArea", "角色信息");
			} else {
				hideloding();
				toastr.warning(backjson.msg);
			}
		}
	});

}

//获得新选择快捷方式
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

//获得新选择按钮权限
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

//渲染权限
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

//鼠标移入移出
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

//预备添加
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

//取消预备添加
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
		var authorityInfoArray;
		row.cdqx===null?authorityInfoArray=[]:authorityInfoArray=row.cdqx.split(",");
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
}

//权限分类下拉框事件绑定
function authorityGroupChange() {
	drawAuthorityGroup();
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

//渲染权限下拉框
function drawAuthorityGroup() {
	var str = '<option value="全部">全部</option>';
	var allMenuParents = $(parent.frames["leftFrame"].document).find(".leftmenu").find('.title'); //frame获取父窗口中的menu
	for (var i = 0; i < allMenuParents.length; i++) {
		str += '<option value="' + allMenuParents[i].innerText + '">' + allMenuParents[i].innerText + '</option>';
	}
	$("#authorityGroup").append(str);
	$('.isSowIndex').selectMania(); //初始化下拉框
}


//重置权限
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

//全选权限
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

//按钮绑定事件
function btnBind(){
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//点击添加权限
	$(".allShortcuts").on('click', '.wantAddShortcut,.cover', function(e) {
		wantAddShortcut(e);
		e.stopPropagation();
	});

	//点击取消权限
	$(".allShortcuts").on('click', '.giveupAddShortcut', function(e) {
		giveupAddShortcut(e.srcElement.parentNode.parentNode);
		e.stopPropagation();
	});

	//全选权限
	$('#shortcutsAllChose').unbind('click');
	$('#shortcutsAllChose').bind('click', function(e) {
		shortcutsAllChose();
		e.stopPropagation();
	});

	//重置权限
	$('#shortcutsRefresh').unbind('click');
	$('#shortcutsRefresh').bind('click', function(e) {
		shortcutsRefresh();
		e.stopPropagation();
	});

	//查看权限取消返回
	$('#canleShowRoleAuthoritys').unbind('click');
	$('#canleShowRoleAuthoritys').bind('click', function(e) {
		canleShowRoleAuthoritys();
		e.stopPropagation();
	});

	//修改权限取消返回
	$('#canleiModifRole').unbind('click');
	$('#canleiModifRole').bind('click', function(e) {
		canleiModifRole();
		e.stopPropagation();
	});
}
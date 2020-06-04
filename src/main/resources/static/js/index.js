/*
加载用户信息
*/
function loadUserInfo() {
	//渲染用户信息
	var userInfo = JSON.parse($.session.get('userInfo'));
	$(parent.frames["topFrame"].document).find(".user").find("span").attr("userId",userInfo.bF990_ID); // frame获取父窗
	$(parent.frames["topFrame"].document).find(".user").find("span").html(userInfo.yhm); // frame获取父窗
	if(userInfo.scdlsj==="fristTime"){
		$(".welinfo:eq(1)").hide(); 
	}else{
		$(".welinfo:eq(1)").find("i").html("您上次登录的时间："+userInfo.scdlsj); 
		$(".welinfo:eq(1)").show(); 
	}
}

/*
加载已选的快捷方式
*/
function loadChoosendShortcuts() {
	//根据权限渲染菜单
	var userInfo = JSON.parse($.session.get('userInfo'));
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	if(typeof(userInfo.yxkjfs) !== "undefined"){
		var allChoosedShortcuts =userInfo.yxkjfs.split(",");
		for (var k = 0; k < currentMenus.length; ++k) {
			for (var i = 0; i < allChoosedShortcuts.length; ++i) {
				if (allChoosedShortcuts[i] === currentMenus[k].id) {
					$(".choosendShortcuts").append('<li class="' + allChoosedShortcuts[i] +
						'"><img class="choosedShortcutsIcon" src="img/' + allChoosedShortcuts[i] +
						'.png" />' +
						'<p><a href="'+allChoosedShortcuts[i]+'.html">' + currentMenus[k].innerText + '</a></p>' +
						'</li>');
				}
			}
		}
	}else{
		//默认显示6个快捷方式
		for (var k = 0; k < currentMenus.length; ++k) {
			if(k<=5){
				$(".choosendShortcuts").append('<li class="' + currentMenus[k].id +
						'"><img class="choosedShortcutsIcon" src="img/' + currentMenus[k].id +
						'.png" />' +
						'<p><a href="'+currentMenus[k].id+'.html">' + currentMenus[k].innerText + '</a></p>' +
						'</li>');
			}
		}
	}
}

/*
显示所有可选快捷方式
*/
function showAllShortcuts() {
	if ($(".placeul").find("li").length < 2) {
		$(".placeul").append('<li><a>添加常用快捷键</a></li>'); //更改位置
	}
	$(".configIndexPage").hide();
	$(".allShortcuts").show();
	drawAllShortcuts();
	allShortcutsDrawChoosend();
	shortcutsMouseAction();
}

/*
根据菜单渲染所有待选快捷键
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
渲染已选快捷键
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
function ShortcutsButtonBind() {
	$('#addShortcuts').unbind('click');
	$('#addShortcuts').bind('click', function(e) {
		addShortcuts();
		e.stopPropagation();
	});

	$('#shortcutsRefresh').unbind('click');
	$('#shortcutsRefresh').bind('click', function(e) {
		shortcutsRefresh();
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
		$.showModal("#remindModal",true);
		$(".remindType").html("快捷方式");
		$(".remindActionType").html("修改");
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			readyToReloadShortcutsList();
			e.stopPropagation();
		});
	} else {
		toastr.warning('暂未进行任何操作');
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
		if (i <= 5) {
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

/*
获得新选择快捷方式
*/
function readyToReloadShortcutsList() {
	var allShortcuts = $(".bacimg");
	var currentShortcutList = new Array();
	var newShortcut ="";

	for (var i = 0; i < $(".choosendShortcuts").find("li").length; ++i) {
		currentShortcutList.push($(".choosendShortcuts").find("li")[i].classList[0]);
	}

	for (var i = 0; i < allShortcuts.length; ++i) {
		if (allShortcuts[i].attributes[1].nodeValue === "true") {
			newShortcut+=allShortcuts[i].classList[1]+",";
		}
	}
	
	
	$.ajax({
		method: 'get',
		cache: false,
		url: "/newShortcut",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName").attr("userid"),
			"newShortcut":newShortcut.substring(0,newShortcut.length-1)
		},
		dataType: 'json',
		success: function(backjson) {
			if (backjson) {
				for (var i = 0; i < allShortcuts.length; ++i) {
					reloadShortcutsList(allShortcuts[i], currentShortcutList, i);
					
					var userInfo = JSON.parse($.session.get('userInfo'));
					userInfo.yxkjfs=newShortcut.substring(0,newShortcut.length-1);
					$.session.remove('userInfo');
					$.session.set('userInfo', JSON.stringify(userInfo));
					
					$.hideModal();
					$(".allShortcuts").hide();
					$(".configIndexPage").show();
					$(".placeul").find("li:eq(1)").remove();
				}
			} else {
				toastr.warninf('操作失败');
			}
		}
	});
}

/*
重新渲染首页已选快捷方式
*/
function reloadShortcutsList(thisShortcuts, currentShortcutList, index) {
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	if (thisShortcuts.attributes[1].nodeValue === "true" && currentShortcutList.indexOf(thisShortcuts.classList[1]) ===
		-1) {
		addChoosendShortcut(thisShortcuts.classList[1], currentMenus[index].innerText);
	} else if (thisShortcuts.attributes[1].nodeValue === "false") {
		removeChoosendShortcut(thisShortcuts.classList[1]);
	}
}

/*
添加已选快捷方式至list
*/
function addChoosendShortcut(className, TextName) {
	$(".choosendShortcuts").append('<li class="' + className +
		'"><img class="choosedShortcutsIcon" src="img/' + className +
		'.png" />' +
		'<p><a href="'+className+'.html">' + TextName + '</a></p>' +
		'</li>');
}

/*
在list删除快捷方式
*/
function removeChoosendShortcut(className) {
	$(".choosendShortcuts").find("." + className).remove();
}

//获取所有角色类型
function drawAuthorityGroup() {
	var str = '<option value="all">所有权限</option>';
	var allMenuParents = $(parent.frames["leftFrame"].document).find(".leftmenu").find('.title'); //frame获取父窗口中的menu
	for (var i = 0; i < allMenuParents.length; i++) {
		if (i !== 0) {
			str += '<option value="' + allMenuParents[i].innerText + '">' + allMenuParents[i].innerText + '</option>';
		}
	}
	$("#authorityGroup").append(str);
	$('.isSowIndex').selectMania(); //初始化下拉框
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
	if (currentGroup === "all") {
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
}

//加载通知
function loadNotices(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getNotices",
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
			    drawNotices(backjson.allNotices);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//渲染通知区域
function drawNotices(allNotices){
	$(".newlist").find("li").remove();
	var str="";
	var Typestr="show";
	for (var i = 0; i < allNotices.length; i++) {
		if(allNotices[i].sfsyzs==="T"){
			str+='<a href="noticeHTMLmodel.html?newId=' + allNotices[i].edu993_ID +'"><li class="NoticeChildren" id="'+allNotices[i].edu993_ID+'">'+allNotices[i].tzbt+'<b>'+allNotices[i].fbsj+'</b></li></a>';
		}
	}
	
	if(str.length===0){
		str='<li class="NoNotice">暂未发布任何重要通知...</li>';
		$(".leftinfos").find("a").remove();
	}
	
	$(".newlist").append(str);
	//发布通知按钮
	$('.NoticeChildren').unbind('click');
	$('.NoticeChildren').bind('click', function(e) {
		getNoticeInfo(e.currentTarget.id);
		e.stopPropagation();
	});
}

//查看通知详情
function getNoticeInfo(id){
	
}


$(function() {
	checkSession(); 
	loadUserInfo();
	loadChoosendShortcuts();
	ShortcutsButtonBind();
	drawAuthorityGroup();
	loadNotices();
	
	//返回首页事件绑定
	$('.backIndex').unbind('click');
	$('.backIndex').bind('click', function(e) {
		backToIndex();
		e.stopPropagation();
	});
	
	//权限分类下拉框事件绑定
	$("#authorityGroup").change(function() {
		groupChangeAction();
	})

	//全选快捷键
	$('#shortcutsAllChose').unbind('click');
	$('#shortcutsAllChose').bind('click', function(e) {
		shortcutsAllChose();
		e.stopPropagation();
	});
	
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
});

$(document).ready(function() {
	stuffSeession();
	// getFromRedis();
	$("body").find("input").attr("spellcheck",false);
	controlMenuRelation();
});

//获取redies
function  getFromRedis(keName){
	var returnData=new Object();
	$.ajax({
		method: 'post',
		cache: false,
		url: "/getFromRedis",
		data: {
			"key": keName
		},
		dataType: 'json',
		success: function(backjson) {
			if(backjson.code===200) {
				returnData=backjson.data;
			}
		}
	});
	return returnData;
}

//填充session
function stuffSeession(){
	drawNewsBySession();
	var userInfo =JSON.parse($.session.get('userInfo')) ;
	$.ajax({
		method: 'post',
		cache: false,
		url: "/verifyUser",
		data: {
			"username": userInfo.yhm,
			"password":  userInfo.mm
		},
		dataType: 'json',
		success: function(backjson) {
			if(backjson.code===200) {
				$.session.set('allAuthority', backjson.data.authoritysInfo);
				var auArray=JSON.parse(backjson.data.authoritysInfo);
				$.session.set('authoritysInfo',JSON.stringify(auArray[0]));
				btnControl();
			}
		}
	});
}

//检查是否存在session 实现拦截
function drawNewsBySession(){
	 var userInfo =$.session.get('userInfo');
	 
	 //url拦截  无session转登录页
	 if(typeof userInfo == "undefined" ){
		 top.location = "login.html";
     }else{
    	 if(JSON.parse($.session.get('userInfo')).js!=="sys"){
    		 $(parent.frames["topFrame"].document).find(".nav").find("li:eq(1)").hide(); // 用户不是管理员则隐藏发布通知
    	 }
     }
}

//根据session的按钮权限控制按钮
function btnControl(){
	 var allAnqx=["insert","delete","modify","query"];
	 var btnInfo ="";
	 var currentJsId=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	 var currentJsmc=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].innerText;
	 var allJsInfo =JSON.parse($.session.get('allAuthority'));
	for (var i = 0; i < allJsInfo.length; i++) {
       if(parseInt(currentJsId) ===allJsInfo[i].bF991_ID){
		   btnInfo=allJsInfo[i].anqx.split(",");
	   }
	}

	 if(currentJsmc==="sys"){
		 return;
	 }
	 for (var i = 0; i < allAnqx.length; i++) {
		 if(btnInfo.indexOf(allAnqx[i])===-1){
			 $(parent.frames["rightFrame"].document).find("."+allAnqx[i]+"Btn").hide();
		 }else{
			 $(parent.frames["rightFrame"].document).find("."+allAnqx[i]+"Btn").show();
		 }
	 }
}

//控制菜单栏父节点和子节点的关系
function controlMenuRelation(){
// 导航切换
	$(".menuson li").click(
		function() {
			$(".menuson li.active").removeClass("active")
			$(this).addClass("active");
			$(parent.frames["topFrame"].document).find(".nav").find("a")
				.removeClass("selected");
		});

	$('.title').click(function() {
		var $ul = $(this).next('ul');
		$('dd').find('ul').slideUp();
		if ($ul.is(':visible')) {
			$(this).next('ul').slideUp();
		} else {
			$(this).next('ul').slideDown();
		}
	});
}

// 查询需要的二级代码信息
function queryEJDMElementInfo(){
	var queryRs;
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/getEJDM",
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
				queryRs=backjson.data.allEJDM;
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
	return queryRs;
}

//渲染二级代码相关的元素
function stuffEJDElement(rs){
	var idOrNotisEvement=$(".isOrNotIsEvement");
	if(typeof(rs.shxlk) != "undefined"){
		var idOrNotis=rs.shxlk;
		for (var i = 0; i < idOrNotisEvement.length; i++) {
			var str = '<option value="seleceConfigTip">请选择</option>';
			for (var g = 0; g < idOrNotis.length; g++) {
				str += '<option value="' + idOrNotis[g].ejdm + '">' + idOrNotis[g].ejdmz
						+ '</option>';
			}
			stuffManiaSelect("#"+idOrNotisEvement[i].id, str);
		}
		$(".isOrNotIsEvement").change(function(e) {
			dropConfigOption("#"+e.currentTarget.id);
		});
	}else{
		for (var i = 0; i < idOrNotisEvement.length; i++) {
			var str = '<option value="seleceConfigTip">暂无选择</option>';
			stuffManiaSelect("#"+idOrNotisEvement[i].id, str);
		}
	}
	
	//所有二级代码
	for (var key in rs) {
		drawEJDMselect(rs[key]);
	}
}

//根据二级代码内容填充相关元素
function drawEJDMselect(EJDMInfo){
	if(typeof(EJDMInfo) != "undefined"){
		var allEvement=$(".isSowIndex "); //获取所有下拉select
		for (var i = 0; i < allEvement.length; i++) {
			var dorwEvementId=allEvement[i].id;
			var currentTxt=allEvement[i].parentNode.previousElementSibling.innerText.replace("*", "").trim().replace(/\s/g,"");
			if(EJDMInfo[0].ejdmmc===currentTxt){
				var str = '<option value="seleceConfigTip">请选择</option>';
				for (var g = 0; g < EJDMInfo.length; g++) {
					str += '<option value="' + EJDMInfo[g].ejdm + '">' + EJDMInfo[g].ejdmz
							+ '</option>';
				}
				stuffManiaSelect("#"+dorwEvementId, str);
			}
		}
	}
}

//联动select公共方法
function LinkageSelectPublic(levelInputId,departmentInputId,gradeInputId,majorInputId,configValue){
	//获取层次
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryAllLevel",
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
				var str = '';
				if (typeof(configValue) === "undefined") {
					str = '<option value="seleceConfigTip">请选择</option>';
				}else{
					for (var i = 0; i < backjson.allLevel.length; i++) {
						if (backjson.allLevel[i].pyccbm===configValue) {
							str = '<option value="' + backjson.allLevel[i].edu103_ID + '">' + backjson.allLevel[i].pyccmc+ '</option>';
						}
					}
				}
				
				
				if (typeof(configValue) === "undefined") {
					for (var i = 0; i < backjson.allLevel.length; i++) {
						str += '<option value="' + backjson.allLevel[i].edu103_ID + '">' + backjson.allLevel[i].pyccmc
								+ '</option>';
					}
				}else{
					for (var i = 0; i < backjson.allLevel.length; i++) {
						if (backjson.allLevel[i].pyccbm!==configValue) {
							str += '<option value="' + backjson.allLevel[i].edu103_ID + '">' + backjson.allLevel[i].pyccmc
							+ '</option>';
						}
					}
				}
				
				stuffManiaSelect(levelInputId, str);
			} else {
				toastr.warning('获取层次失败，请重试');
			}
		}
	});

	//层次change
	$(levelInputId).change(function() {
		var choosedLevel=getNormalSelectValue(levelInputId.substring(1, levelInputId.length));
		$.ajax({
			method : 'get',
			cache : false,
			url : "/levelMatchDepartment",
			data: {
	             "leveCode":choosedLevel,
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
				if (backjson.code === 200) {
					var departments=new Array();
					var all=new Array();
					for (var i = 0; i < backjson.data.length; i++) {
						var departmentObject=new Object();
						departmentObject.name=backjson.data[i].edu104mc;
						departmentObject.value=backjson.data[i].edu104;
						var isHave=all.indexOf(backjson.data[i].edu104);
						if(isHave===-1){
							departments.push(departmentObject);
							all.push(backjson.data[i].edu104);
						}
					}
					drawNextSelect(levelInputId, departments, departmentInputId);
				} else {
					toastr.warning(backjson.msg);
					drawNextSelect(levelInputId, {}, departmentInputId);
				}
			}
		});
	});

	//系部change
	$(departmentInputId).change(function() {
		var choosedDepartment=getNormalSelectValue(departmentInputId.substring(1, departmentInputId.length));
		$.ajax({
			method : 'get',
			cache : false,
			url : "/departmentMatchGrade",
			data: {
	             "departmentCode":choosedDepartment 
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
					var grades=new Array();
					var all=new Array();
					for (var i = 0; i < backjson.grade.length; i++) {
						var gradeObject=new Object();
						gradeObject.name=backjson.grade[i].edu105mc;
						gradeObject.value=backjson.grade[i].edu105;
						var isHave=all.indexOf(backjson.grade[i].edu105);
						if(isHave===-1){
							grades.push(gradeObject);
							all.push(backjson.grade[i].edu105);
						}
					}
					drawNextSelect(departmentInputId, grades,gradeInputId);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});

	//年级change
	$(gradeInputId).change(function() {
		var choosedGrade=getNormalSelectValue(gradeInputId.substring(1, gradeInputId.length));
		$.ajax({
			method : 'get',
			cache : false,
			url : "/gradeMatchMajor",
			data: {
	             "gradeCode":choosedGrade 
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
					var majors=new Array();
					var all=new Array();
					for (var i = 0; i < backjson.major.length; i++) {
						var majorObject=new Object();
						majorObject.name=backjson.major[i].edu106mc;
						majorObject.value=backjson.major[i].edu106;
						var isHave=all.indexOf(backjson.major[i].edu106);
						if(isHave===-1){
							majors.push(majorObject);
							all.push(backjson.major[i].edu106);
						}
					}
					drawNextSelect(gradeInputId, majors, majorInputId);
				} else {
					toastr.warning('操作失败，请重试');
				}
			}
		});
	});
}

//删除动画方法
function reomveAnimation(domClass, animationClass) {
	var wait = setInterval(function() {
		if (!$(domClass).is(":animated")) {
			clearInterval(wait);
			$(domClass).removeClass(animationClass);
		}
	}, 600);
}

// 两个数组是否相同
function isSameArray(array, array2) {
	var isSame;
	if (array.length < array2.length) {
		isSame = false;
		return isSame;
	}

	for (var i = 0; i < array.length; ++i) {
		if (array2.indexOf(array[i]) === -1) {
			isSame = false;
			break;
		} else {
			isSame = true;
		}
	}
	return isSame;
}

// 重新加载select的默认值
function reDrawSelect(ID, value, text) {
	$(ID).selectMania('set', [ {
		value : value,
		text : text
	} ]);
}

// 渲染分页信息样式
function drawPagination(tableAreaClass, paginationTxt) {
	$(tableAreaClass).find("table").find("thead").find("input").attr("title","全选当前页");
	$(tableAreaClass).find("table").find("thead").find("input").tooltipify({offsetLeft:-30,offsetTop:-15,position:"top",displayAware:false});
	//分页信息样式
	var numInfo =Trim($(tableAreaClass).find(".fixed-table-pagination").find(".pagination-detail").find("span:eq(0)")[0].innerText,":g") ;
	var a = numInfo.indexOf(" ");
	var numInfo1 = numInfo.substring(a + 1);
	var b = numInfo1.indexOf(" ")
	var num1 = numInfo1.substring(b, 0);

	var c = numInfo1.substring(b + 1).indexOf(" ");
	var numInfo2 = numInfo1.substring(b + 1).substring(c + 1);
	var d = numInfo2.indexOf(" ");
	var num2 = numInfo2.substring(d, 0);

	var numInfo3 = numInfo2.substring(d + 1);
	var e = numInfo3.indexOf(" ");
	var lastNumInfo = numInfo3.substring(e + 1);
	var f = lastNumInfo.indexOf(" ");
	var num3 = lastNumInfo.substring(f, 0);
	$(tableAreaClass).find(".fixed-table-pagination")
			.find(".pagination-detail").find("span").hide();
	$(tableAreaClass).find(".fixed-table-pagination")
			.find(".pagination-detail").append(
					'<span class="pagination-info">' + '显示第 <i class="blue">'
							+ num1 + '</i> 到第 <i class="blue">' + num2
							+ '</i> 条' + paginationTxt + '，总共 <i class="blue">'
							+ num3 + '</i> 条' + paginationTxt + '</span>');
	toolTipUp(".myTooltip");
	
	//导出重构
	$(".bootstrap4").find(".columns").find(".btn,.keep-open").removeAttr("title");
	$(".bootstrap4").find(".export").find("a").html("导出Excel");
	
	$(".bootstrap4").find(".export").find("i").addClass("iconfont icon-Excel");
	if($(".bootstrap4").find(".export").find(".exportImg").length===0){
		var str=$(".bootstrap4").find(".export").find("a:last-child").html();
		$(".bootstrap4").find(".export").find("a:last-child").html('<img class="exportImg" src="images/i01.png" style="width: 24px;">'+str);
	}
	
	$(".bootstrap4").find(".export").unbind('click');
	$(".bootstrap4").find(".export").bind('click', function(e) {
	    checkTableHaveData(tableAreaClass);
		e.stopPropagation();
	});
	
	$(".bootstrap4").find(".keep-open").unbind('click');
	$(".bootstrap4").find(".keep-open").bind('click', function(e) {
		$(".bootstrap4").find(".keep-open").find(".dropdown-menu").toggle();
		
		$(".dropdown-menu").find("label").unbind('click');
		$(".dropdown-menu").find("label").bind('click', function(e) {
			drawPagination(tableAreaClass, paginationTxt);
			e.stopPropagation();
		});
		
		$('body').click(function(e) {
			$('.dropdown-menu').hide();
	    });
		e.stopPropagation();
	});
}

// 判断table是否渲染了数据
function checkTableHaveData(tableAreaClass){
	var tables=$(tableAreaClass).find("table");
	var id="";
	for (var i = 0; i < tables.length; i++) {
		if(tables[i].id!==""&&typeof(tables[i].id) !== "undefined"){
			id=tables[i].id;
		}
	}
	
	var datas = $("#"+id).bootstrapTable("getData");
	if(datas.length===0){
		toastr.warning('暂未产生数据源');
	}else{
		$(".bootstrap4").find(".export").find(".dropdown-menu").show();
		$('body').click(function(e) {
			$('.dropdown-menu').hide();
	    })
	}
}

// 渲染表格搜索框
function drawSearchInput(area) {
	if (typeof(area) !== "undefined") {
		$(area).find(".fixed-table-toolbar").find(".search").prepend('<img class="searchIcon" src="images/ico06.png" style="width: 24px;" />');
	}else{
		$(".fixed-table-toolbar").find(".search").prepend('<img class="searchIcon" src="images/ico06.png" style="width: 24px;" />');
	}
	

	$(area).find(".fixed-table-toolbar").find(".search").find("input").attr("spellcheck",false);
	// 聚焦
	$(area).find(".fixed-table-toolbar").find(".search").find("input").focus(function(e) {
		$(area).find(".searchIcon").addClass("serachFocus");
		toolTipUp(".myTooltip");
	});

	// 失焦
	$(area).find(".fixed-table-toolbar").find(".search").find("input").blur(function(e) {
		$(area).find(".searchIcon").removeClass("serachFocus");
		toolTipUp(".myTooltip");
	});
}

// 改变初始化table无内容样式
function changeTableNoRsTip(str) {
	if (typeof str !== 'undefined') {
		$(".no-records-found").find("td").html(str);
		return;
	}
	$(".no-records-found").find("td").html("暂无数据.....");
}

// 下拉框选值后渲染下一个select
function drawNextSelect(btndSelctId, selectInfo, drawSelctId) {
	// 拼接option HTML结构
	$(drawSelctId).find("option").remove();
	var str ='';
	selectInfo.length===0?str = '<option value="seleceConfigTip">暂无选择</option>':str = '<option value="seleceConfigTip">请选择</option>';
	for (var i = 0; i < selectInfo.length; i++) {
		str += '<option value="' + selectInfo[i].value + '">' + selectInfo[i].name
				+ '</option>';
	}

	// 改变值是否删除初始化的请选择项
	if ($(btndSelctId).find("option:eq(0)")[0].attributes[0].nodeValue === "seleceConfigTip") {
		dropConfigOption(btndSelctId);
	}
	// 重新渲染选择
	stuffManiaSelect(drawSelctId, str);
}

//select删除初始化的请选择项
function dropConfigOption(btndSelctId){
	if ($(btndSelctId).find("option:eq(0)")[0].attributes[0].nodeValue === "seleceConfigTip") {
		$(btndSelctId).selectMania('destroy');
		$(btndSelctId).find("option:eq(0)").remove();
		$(btndSelctId).selectMania(); // 初始化下拉框
	}
}

// 渲染maniaSelect 1
function stuffManiaSelect(SelctId, str) {
	$(SelctId).selectMania('destroy');
	$(SelctId).empty();
	$(SelctId).append(str);
	$(SelctId).selectMania(); // 初始化下拉框
}

//maniaSelect 有默认值 指定默认值
function stuffManiaSelectWithDeafult(id,cheeckedValue,cheeckedTxt){
	if(cheeckedValue===""||cheeckedValue==null||typeof(cheeckedValue) === "undefined"){
		return;
	}
	
	var currentAllOption=$(id).find("option");
	var options=new Array();
	if(cheeckedValue==null){
		for (var i = 0; i < currentAllOption.length; i++) {
			if(currentAllOption[i].attributes[0].value!==cheeckedValue&&currentAllOption[i].attributes[0].value!=="seleceConfigTip"){
				var optionsObject=new Object();
				optionsObject.value=currentAllOption[i].attributes[0].value;
				optionsObject.valueTxt=currentAllOption[i].innerText;
				options.push(optionsObject);
			}
		}
		
		var str='<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < options.length; i++) {
			str += '<option value="' + options[i].value + '">' + options[i].valueTxt + '</option>';
		}
		stuffManiaSelect(id, str);
	}else{
		for (var i = 0; i < currentAllOption.length; i++) {
			if(currentAllOption[i].attributes[0].value===cheeckedValue){
				var firstObject=new Object();
				firstObject.value=currentAllOption[i].attributes[0].value;
				firstObject.valueTxt=currentAllOption[i].innerText;
				options.push(firstObject);
			}
		}
		
		for (var i = 0; i < currentAllOption.length; i++) {
			if(currentAllOption[i].attributes[0].value!==cheeckedValue&&currentAllOption[i].attributes[0].value!=="seleceConfigTip"){
				var optionsObject=new Object();
				optionsObject.value=currentAllOption[i].attributes[0].value;
				optionsObject.valueTxt=currentAllOption[i].innerText;
				options.push(optionsObject);
			}
		}
		
		var str="";
		if(options.length!==0){
			for (var i = 0; i < options.length; i++) {
				str += '<option value="' + options[i].value + '">' + options[i].valueTxt + '</option>';
			}
		}else{
			str = '<option value="' + cheeckedValue + '">' + cheeckedTxt + '</option>';
		}
		stuffManiaSelect(id, str);
	}
}

//联动SELECT 有默认值 指定默认值
function actionStuffManiaSelectWithDeafult(id,cheeckedValue,cheeckedTxt){
	var str="";
	if($.isArray(cheeckedValue)){
		for (var i = 0; i < cheeckedValue.length; i++) {
			str += '<option value="' + cheeckedValue[i] + '">' + cheeckedTxt[i] + '</option>';
		}
	}else{
		str='<option value="'+cheeckedValue+'">'+cheeckedTxt+'</option>';
		stuffManiaSelect(id, str);
	}
}

//multiInput 有默认值 指定默认值
function multiSelectWithDefault(id,Default){
	$(id).val(Default);
	var allinputEVE = $(id)[0].nextSibling.childNodes[1].childNodes[0].childNodes;
	for (var i = 0; i < allinputEVE.length; ++i) {
		allinputEVE[i].childNodes[0].checked = false;
	}
	
    var showStr="";
	for (var j = 0; j < Default.length; ++j) {
		for (var i = 0; i < allinputEVE.length; ++i) {
			if (Default[j] === allinputEVE[i].childNodes[0].attributes[2].nodeValue) {
				allinputEVE[i].childNodes[0].checked = true;
				showStr+=allinputEVE[i].innerText+',';
			}
		}
	}
	showStr=showStr.substring(0,showStr.length-1);
	$(id)[0].nextElementSibling.childNodes[0].innerText=showStr;
//	$(id)[0].nextElementSibling.childNodes[0].innerText=Default;
//	$(id).val(Default);
//	var allinputEVE=$(id)[0].nextSibling.childNodes[1].childNodes[0].childNodes;
//
//	for (var i = 0; i < allinputEVE.length; ++i) {
//		allinputEVE[i].childNodes[0].checked = false;
//	}
//	
//	for (var j = 0; j < Default.length; ++j) {
//		for (var i = 0; i < allinputEVE.length; ++i) {
//			if(Default[j]===allinputEVE[i].childNodes[0].attributes[2].nodeValue){
//				allinputEVE[i].childNodes[0].checked = true;
//			}
//		}
//	}
}

// 获取无action select的值
function getNormalSelectValue(id) {
	var returnvalue;
	if ($("#" + id).selectMania('get').length === 0) {
		returnvalue = "";
	} else {
		$("#" + id).selectMania('get')[0].value==="seleceConfigTip"?returnvalue="":returnvalue= $("#" + id).selectMania('get')[0].value;
	}
	return returnvalue;
}

//获取无action text的值
function getNormalSelectText(id) {
	var returntext;
	if ($("#" + id).selectMania('get').length === 0) {
		returntext = "";
	} else {
		$("#" + id).selectMania('get')[0].value==="seleceConfigTip"?returntext="":returntext= $("#" + id).selectMania('get')[0].text;
	}
	return returntext;
}

// 带select的重置检索
function reReloadSearchsWithSelect(reObject) {
	// 重置后需要留值得select
	if (typeof (reObject.fristSelectId) !== "undefined") {
		var fristSelect = $(reObject.fristSelectId).find("option");
		var str = '<option value="seleceConfigTip">请选择</option>';
		for (var i = 0; i < fristSelect.length; i++) {
			if (fristSelect[i].attributes[0].nodeValue !== "seleceConfigTip") {
				str += '<option value="'
						+ fristSelect[i].attributes[0].nodeValue + '">'
						+ fristSelect[i].innerText + '</option>';
			}
		}
		$(reObject.fristSelectId).selectMania('destroy');
		$(reObject.fristSelectId).find("option").remove();
		$(reObject.fristSelectId).append(str);
		$(reObject.fristSelectId).selectMania(); // 初始化下拉框
	}
	// 重置input
	if (typeof (reObject.InputIds) !== "undefined") {
		$(reObject.InputIds).val("");
	}

	// 重置普通select
	if (typeof (reObject.normalSelectIds) !== "undefined") {
		var normalSelectIdAarray=reObject.normalSelectIds.split(",");
		
		for (var i = 0; i < normalSelectIdAarray.length; i++) {
			var currentoptionArray=$(normalSelectIdAarray[i]).find("option");
			var str='<option value="seleceConfigTip">请选择</option>';
			var optionArray=new Array();
			for (var k = 0; k < currentoptionArray.length; k++){
				if(currentoptionArray[k].value!=="seleceConfigTip"){
					var optionObject=new Object();
					optionObject.value=currentoptionArray[k].value;
					optionObject.txt=currentoptionArray[k].outerText;
					optionArray.push(optionObject);
				}
				
			}
			$(normalSelectIdAarray[i]).selectMania('destroy');
			$(normalSelectIdAarray[i]).find("option").remove();
			for (var g = 0; g < optionArray.length;g++){
				str+='<option value="'+optionArray[g].value+'">'+optionArray[g].txt+'</option>';
			}
			stuffManiaSelect(normalSelectIdAarray[i], str)
		}
	}
	
	//重置数字input
	if (typeof (reObject.numberInputs) !== "undefined") {
		var numberInput=reObject.numberInputs.split(",");
		for (var i = 0; i < numberInput.length;i++){
			$(numberInput[i]).val(0);
		}
	}

	// 重置action select
	if (typeof (reObject.actionSelectIds) !== "undefined") {
		$(reObject.actionSelectIds).selectMania('destroy');
		$(reObject.actionSelectIds).find("option").remove();
		$(reObject.actionSelectIds).append(
				'<option value="seleceConfigTip">暂不可选</option>');
		$(reObject.actionSelectIds).selectMania(); // 初始化下拉框
	}
}

//有标签页页面切换更新面包屑导航
function drawBreadPilot(eve) {
	if ($(".placeul").find("li").length > 2) {
		$(".placeul").find("li:eq(2)").remove();
	}
	$(".placeul").append('<li><a>' + eve.innerText + '</a></li>'); //更改位置
}

/* 删除通知请求模板 */
function tableRemoveAction(tableId, removeId, pagnationClass, pagnationTxt) {
	for (var i = 0; i < removeId.length; i++) {
		$(tableId).bootstrapTable('removeByUniqueId', removeId[i]);
	}
	$(".tip").hide();
	drawPagination(pagnationClass, pagnationTxt);
	toastr.success('删除成功');
	$(".myTooltip").tooltipify();
	
	
}

// 返回首页按钮
function backToIndex() {
	var currentTopMenus = $(parent.frames["topFrame"].document).find(".nav")
			.find("li"); // frame获取父窗口中的top.html
	for (var i = 0; i < currentTopMenus.length; ++i) {
		if (currentTopMenus[i].childNodes[0].className === "selected") {
			currentTopMenus[i].childNodes[0].classList.remove("selected");
		}
	}
	window.location.href = "index.html";
	$(".maskingElement").hide();
	$(parent.frames["topFrame"].document).find(".maskingElement").hide(); // frame获取父窗
	$(parent.frames["leftFrame"].document).find(".maskingElement").hide(); // frame获取父窗
}

// 反选
function recheckAll() {
	var currentChecked=$("#checkAll")[0].checked;
	if(currentChecked){
		$(".stuffCheckArea").find(".col4").find("input").attr("checked", false);
		$("#checkAll").attr("checked", false);
	}else{
		$(".stuffCheckArea").find(".col4").find("input").attr("checked", true);
		$("#checkAll").attr("checked", true);
	}
}

// 全选
function checkAll() {
	var currentChecked=$("#checkAll")[0].checked;
	if(currentChecked){
		$(".stuffCheckArea").find(".col4").find("input").attr("checked", true);
		$("#recheckAll").attr("checked", false);
	}else{
		$(".stuffCheckArea").find(".col4").find("input").attr("checked", false);
		$("#checkAll").attr("checked", false);
		$("#recheckAll").attr("checked", true);
	}
	

}

// 单个选择与全选/反选
function singleCheck() {
	$("#recheckAll").attr("checked", false);
	$("#checkAll").attr("checked", false);
	
	var allChildren=$(".stuffCheckArea").find("input");
	var choosedNum=0;
	var rechoosedNum=0;
	for (var i = 0; i < allChildren.length; i++) {
		if(allChildren[i].checked){
			choosedNum++;
		}else{
			rechoosedNum++;
		}
	}
	
	if(choosedNum===allChildren.length){
		$("#checkAll").attr("checked", true);
	}else if(rechoosedNum===allChildren.length){
		$("#recheckAll").attr("checked", true);
	}
}

// 判断多选是否选择
function checkExamine(checkArea) {
	var isCheckedSomeOne = true;
	if ($(checkArea).find("#checkAll")[0].checked === true) {
		return isCheckedSomeOne
	}

	if ($(checkArea).find("#recheckAll")[0].checked === true) {
		isCheckedSomeOne = false;
		return isCheckedSomeOne
	}

	var allChecks = $(checkArea).find(".stuffCheckArea").find(".col4").find(
			"input");
	var nocheckNum = 0;
	for (var i = 0; i < allChecks.length; i++) {
		if (allChecks[i].checked === false) {
			nocheckNum++;
		}
	}
	if (nocheckNum === allChecks.length) {
		isCheckedSomeOne = false;
		return isCheckedSomeOne;
	}
	return isCheckedSomeOne;
}

// 判断表格有无勾选数据
function tableIsChecked(id, type) {
	var currentTable = $(id).bootstrapTable("getSelections");
	if (currentTable.length === 0) {
		toastr.warning('没有选择' + type);
		return false;
	} else {
		return true;
	}
}

//刷新多选下拉框
function refreshMultiSselect(id){
	$("input:checkbox").removeAttr("checked");
	$(id)[0].nextElementSibling.children[0].innerText="-- 请选择 --";
	$(id).val(null);
}

//模态框出现
jQuery.extend({  
	showModal:function(id,showFooter) {  
		$(id).modal("show");
		if(showFooter){
			$(id).find(".modal-footer").show();
		}else{
			$(id).find(".modal-footer").hide();
		}
		$(parent.frames["topFrame"].document).find(".maskingElement").show(); // frame获取父窗
		$(parent.frames["leftFrame"].document).find(".maskingElement").show(); // frame获取父窗
   }  
})  

//模态框消失
jQuery.extend({  
	hideModal:function(id,hideOtherMasking) { 
		if (typeof(id) != "undefined"&&id!=="") {
			$(id).modal("hide");
		}else{
			var allModal=$(".modal");
			for (var i = 0; i < allModal.length; ++i) {
				$("#"+allModal[i].id).modal("hide");
			}
		}
		
		if(typeof(hideOtherMasking) == "undefined"){
			$(parent.frames["topFrame"].document).find(".maskingElement").fadeOut(300); // frame获取父窗
			$(parent.frames["leftFrame"].document).find(".maskingElement").fadeOut(300); // frame获取父窗
		}
   }  
}) 


// 请求beforeSend
function requestErrorbeforeSend() {
	$(".loadingMasking").show();
	$(parent.frames["topFrame"].document).find(".maskingElement").show(); // frame获取父窗
	$(parent.frames["leftFrame"].document).find(".maskingElement").show(); // frame获取父窗
}

// loading 效果隐藏
function hideloding() {
	$(".loadingMasking").hide();
	$(parent.frames["topFrame"].document).find(".maskingElement").hide(); // frame获取父窗
	$(parent.frames["leftFrame"].document).find(".maskingElement").hide(); // frame获取父窗
	var allModal=$(".modal-backdrop");
	for (var i = 0; i < allModal.length; ++i) {
		if(allModal.length<=1){
			$(parent.frames["topFrame"].document).find(".maskingElement").hide(); // frame获取父窗
			$(parent.frames["leftFrame"].document).find(".maskingElement").hide(); // frame获取父窗
		}else{
			$(parent.frames["topFrame"].document).find(".maskingElement").show(); // frame获取父窗
			$(parent.frames["leftFrame"].document).find(".maskingElement").show(); // frame获取父窗
			return;
		}
	}
}

// 请求complete
function requestComplete() {
	if (status == 'timeout') {
		ajaxTimeOut.abort(); // 取消请求;
		toastr.error("获取所有用户请求超时");
	}
}

// 请求404
function requestError() {
	hideloding();
	window.location.href = "error.html";
}

// 检查输入是否是数字
function checkIsNumber(num) {
	var patrn = /^(-)?\d+(\.\d+)?$/;
	if (patrn.exec(num) == null || num == "") {
		return false
	} else {
		return true
	}
}

//课程名字文字化
function calssNameMatter(value, row, index) {
	if (row.sfsckkjh==="T") {
		return [ '<div class="myTooltip greenTxt" title="' + row.kcmc
				+ '">' + row.kcmc + '</div>' ].join('');
	} else {
		return [ '<div class="myTooltip redTxt" title="' + row.kcmc
				+ '">' + row.kcmc + '</div>' ].join('');
	}
}

//授课学期文字化
function skxqMatter(value, row, index) {
	var skxqArray=JSON.parse(row.skxq);
	var skxqArrayToTxt='';
	 for (var i = 0; i < skxqArray.length; ++i) {
		 skxqArrayToTxt+=skxqArray[i]+',';
	 }
	 
	var skxqTxt='第'+skxqArrayToTxt.substring(0,skxqArrayToTxt.length-1)+'学期';
	return [ '<div class="myTooltip" title="地' + skxqTxt
				+ '">' + skxqTxt+ '</div>' ].join('');
}

//审批状态文字化
function approvalMatter(value, row, index) {
	if (value==="pass") {
		return [ '<div class="myTooltip greenTxt" title="已通过"><i class="iconfont icon-yixuanze greenTxt"></i>已通过</div>' ]
				.join('');
	} else if (value==="nopass"){
		return [ '<div class="myTooltip redTxt" title="不通过"><i class="iconfont icon-chacha redTxt"></i>不通过</div>' ]
				.join('');
	} else if (value==="passing"){
		return [ '<div class="myTooltip normalTxt" title="审批中">审批中</div>' ]
		.join('');
    }
}

// 是否文字化
function isOrNotisMatter(value, row, index) {
	if (value) {
		return [ '<div class="myTooltip" title="是">是</div>' ].join('');
	} else {
		return [ '<div class="myTooltip" title="否">否</div>' ].join('');
	}
}

// 性别文字化
function sexFormatter(value, row, index) {
	if (value === "M") {
		return [ '<div class="myTooltip" title="男">男</div>' ].join('');
	} else {
		return [ '<div class="myTooltip" title="女">女</div>' ].join('');
	}
}

// 时间文字化
function timeFormatter(value, row, index) {
	if(typeof(value) != "undefined"&&value!=null){
		return [ '<div class="myTooltip" title="'
					+ stampToDatetimeString(value, true) + '">'
					+ stampToDatetimeString(value, true) + '</div>' ].join('');
	}else{
		return [ '<div class="myTooltip normalTxt" title="暂无">暂无</div>' ]
		.join('');
	}
}

//课程表类型table Formatter
function scheduleFormatter(value, row, index) {
	var htmlStr = "";
	if ($.isArray(value)) {
		for (var i = 0; i < value.length; i++) {
			htmlStr += '<div classRoomID="' + value[i].classRoomId
					+ '" teacherID="' + value[i].teacherId + '" classTypeId="'
					+ value[i].classTypeId + '" classID="' + value[i].classId
					+ '" courseId="' + value[i].courseId
					+ '"  class="singleSchedule singleScheduleHover '
					+ changeClassAreaBg(value[i].classTypeId) + '">'
					+ '<span class="scheduleClassName">'+ value[i].className+'</span>'
				    + '<span class="scheduleClassName">'+ value[i].courseName+'</span>'
				    + '<span class="scheduleClassName">'+ charSpiltMatter(value[i].teacherName)+'</span>'
				    + '<span class="lastscheduleClassName">'+ value[i].classRoom+'</span>'
					+  '</div>'
		}
	} else {
		htmlStr = '<div class="singleSchedule"></div>'
	}

	return [ htmlStr ].join('');
}

//时间戳转换时间格式字符
function stampToDatetimeString(time,splitTotime){
	 var date=new Date(time);
	    var y = date.getFullYear();
	    var m = date.getMonth() + 1;
	    var d = date.getDate();
	    var hour = date.getHours().toString();
	    var minutes = date.getMinutes().toString();
	    var seconds = date.getSeconds().toString();
	    if (hour < 10) {
	        hour = "0" + hour;
	    }
	    if (minutes < 10) {
	        minutes = "0" + minutes;
	    }
	    if (seconds < 10) {
	        seconds = "0" + seconds;
	    }
	    if(splitTotime){
	    	return  y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + " " + hour + ":" + minutes + ":" + seconds;
	    }else{
	    	return  y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
	    }
}

// table增加tooltip
function paramsMatter(value, row, index) {
	// 替换空格，因为字符串拼接的时候如果遇到空格，会自动将后面的部分截掉，所有这里用html的转义符
	// &nbsp;代替
	// var values;
	// if (!isNaN(value)) {
	// values = value;
	// } else {
	// values = value.replace(/\s+/g, '&nbsp;');
	// }
	// return [
	// '<div class="myTooltip" title="' + values + '">' + value + '</div>'
	// ]
	// .join('');
	if(typeof value === 'undefined'||value==null||value===""){
		return [ '<div class="myTooltip normalTxt" title="暂无">暂无</div>' ]
		.join('');
	}else{
		return [ '<div class="myTooltip" title="' + value + '">' + value + '</div>' ]
		.join('');
	}
}

// 根据课程类型改变背景颜色
function changeClassAreaBg(classType) {
	if (classType == 1) {
		return "PEC_corlor";
	} else if (classType == 2) {
		return "PE_corlor";
	} else if (classType == 3) {
		return "MC_corlor";
	} else if (classType == 4) {
		return "C_Appropriates_corlor";
	}

}

//上传文件失败渲染
function showImportErrorInfo(AreaClass,errorInfo){
	$(AreaClass).find(".fileErrorTxTArea").show();
	$(AreaClass).find(".fileSuccessTxTArea").hide();
	$(AreaClass).find(".fileErrorTxTArea").find("b").html("Error:"+errorInfo);
	$(AreaClass).find("form").find("input").val("");
}

//上传文件成功渲染
function showImportSuccessInfo(AreaClass,successInfo){
	$(AreaClass).find(".fileErrorTxTArea").hide();
	$(AreaClass).find(".fileSuccessTxTArea").show();
	$(AreaClass).find(".fileSuccessTxTArea").find("b").html("Success:"+successInfo);
}

//根据出生日期算年龄
function byage(strBirthday){
	var returnAge;  
	
	
        var birthYear = strBirthday.split("-")[0];  
        var birthMonth = strBirthday.split("-")[1]; 
        var birthDay = strBirthday.split("-")[2]; 
        d = new Date();  
        var nowYear = d.getFullYear();  
	var nowMonth = d.getMonth() + 1;  
	var nowDay = d.getDate();  
	if(nowYear == birthYear){  
	  returnAge = 0;//同年 则为0岁  
	}  
	else{  
	var ageDiff = nowYear - birthYear ; //年之差  
		if(ageDiff > 0){  
		if(nowMonth == birthMonth) {  
		var dayDiff = nowDay - birthDay;//日之差  
		if(dayDiff < 0)  
		returnAge = ageDiff - 1;  
		else  
		returnAge = ageDiff ;  
		}  
		else  
		{  
		var monthDiff = nowMonth - birthMonth;//月之差  
		if(monthDiff < 0)  
		returnAge = ageDiff - 1;  
		else  
		returnAge = ageDiff ;  
		}  
		}  
		else  
		returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天  
		}  
		return returnAge;//返回周岁年龄
	}

// 列操作改变样式并且绑定点击事件填充toolTip
function changeColumnsStyle(changeAreaClass, txt) {
	var colum = $(changeAreaClass).find(".columns").find(".keep-open").find("i").removeClass().addClass("iconfont icon-liebiao");

	$(changeAreaClass).find(".columns").find(".keep-open").find("ul").find("input").bind('click',function(e) {
				drawPagination(changeAreaClass, txt);
				toolTipUp(".myTooltip");
				e.stopPropagation();
	});
}

//导航定位
function pageGPS(ID){
	$(ID).change(function(e) {
		var currentGroup = $(ID).selectMania('get')[0].value;
		 $('html,body').animate({scrollTop:$('#'+currentGroup).offset().top}, 300);
	})
}

// 启动tooltip
function toolTipUp(className) {
	$(className).tooltipify();
}


//判断开始结束时间大小
function checkTime(startTime,endTime){
	var start=new Date(startTime.replace("-", "/").replace("-", "/"));
	var end=new Date(endTime.replace("-", "/").replace("-", "/"));
	if(end<start){
		return false;
	}
	return true;
}

// 日期选择初始化
function drawCalenr(id,isSplitToday) {
	var endDateParams;
	if (typeof(isSplitToday) === "undefined") {
		$(id).datetimepicker({
			  format : 'yyyy-mm-dd',
			  language:'zh-CN',
			  initialDate:new Date(),
			  weekStart: 1,
			  autoclose :true,
			  minView :2,
			  todayHighlight:true,
			  startView:2,
			  endDate:new Date(),
	          todayBtn: "linked",
		});
	}else{
		$(id).datetimepicker({
			  format : 'yyyy-mm-dd',
			  language:'zh-CN',
			  initialDate:new Date(),
			  weekStart: 1,
			  autoclose :true,
			  minView :2,
			  todayHighlight:true,
			  startView:2,
			  startDate:new Date(),
	          todayBtn: "linked",
		});
	}
}

// 数据库时间转化
function formatterTimeToBase(time, indludeTime) {
	var formatterTime;
	if (indludeTime) {
		var reg1 = /-/g;
		var reg2 = /:/g;
		var withoutrg1 = time.replace(reg1, '');
		var withoutrg2 = withoutrg1.replace(reg2, '');
		var formatterTime = withoutrg2.replace(/\s+/g, "");
		return formatterTime;
	} else {
		var date;
		var reg1 = /-/g;
		date = time.replace(reg1, '');
		formatterTime = date + "000000"
	}
	return formatterTime;
}

// 页面时间转换
function formatterTimeToPage(date, isSplitTOAfterHours) {
	var year = date.substring(0, 4);
	var month = date.substring(4, 6);
	var day = date.substring(6, 8);
	if (isSplitTOAfterHours) {
		var hours = date.substring(8, 10);
		var min = date.substring(10, 12);
		var sec = date.substring(12, 14);
		return year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':'
				+ sec;
	} else {
		return year + '-' + month + '-' + day;
	}
}

// 获取当前时间
function getCrrruentDate() {
	var oDate = new Date(); // 实例一个时间对象；
	var y = oDate.getFullYear().toString(); // 获取系统的年；
	var m = (oDate.getMonth() + 1).toString(); // 获取系统月份，由于月份是从0开始计算，所以要加1
	var d = oDate.getDate().toString(); // 获取系统日，
	var h = oDate.getHours().toString(); // 获取系统时，
	var min = oDate.getMinutes().toString(); // 分
	var s = oDate.getSeconds().toString(); // 秒
	return y + m + d + h + min + s;
}

//去掉字符中的双引号
function charSpiltMatter(value, row, index) {
	if(value!=null){
		var reg = new RegExp('"',"g");
		var str = value.replace(reg, "");

		return [ '<div class="myTooltip" title="'+str+'">'+str+'</div>' ]
			.join('');
	}else{
		return [ '<div class="myTooltip" title="暂无">暂无</div>' ]
			.join('');
	}
}

//字符去所有空格  需要设置第2个参数为":g"
function Trim(str, is_global)

{

	var result;

	result = str.replace(/(^\s+)|(\s+$)/g, "");

	if (is_global.toLowerCase() == "g")

	{

		result = result.replace(/\s/g, "");

	}

	return result;

}

//身份证号验证
function isCardNo (card){
//	//身份证可以为空
//	if (isEmpty(card)) {
//         return false;
//    }
	var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
        return false;
    }
    return true;
}

//手机号验证
function phoneRex (value){
	 var rex = /^1[3-9]+\d{9}$/;
	 if (rex.test(value)) {
        return true;
     } else {
        return false;
     }
}

//email验证
function emailRex (value){
	var search_str = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
	if(!search_str.test(value)){       
	     return false;
	}else{
		 return true;
	}
}

//数组去重
jQuery.extend({  
    uniqueArray:function(a) {  
    	var bool = $.isArray(a)
    	if(!bool){
    		if(a.indexOf(",")!==-1){
    			a=a.slice(0, -1).split(",");
    		}else{
    			a=a.split(",");
    		}
    	}
        var r=[];  
        for (var i=0,l=a.length; i<l; ++i)jQuery.inArray(a[i],r)<0&&r.push(a[i]);  
        return r;  
   }  
})


function Format(now,mask)
{
	var d = now;
	var zeroize = function (value, length)
	{
		if (!length) length = 2;
		value = String(value);
		for (var i = 0, zeros = ''; i < (length - value.length); i++)
		{
			zeros += '0';
		}
		return zeros + value;
	};

	return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0)
	{
		switch ($0)
		{
			case 'd': return d.getDate();
			case 'dd': return zeroize(d.getDate());
			case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
			case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
			case 'M': return d.getMonth() + 1;
			case 'MM': return zeroize(d.getMonth() + 1);
			case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
			case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
			case 'yy': return String(d.getFullYear()).substr(2);
			case 'yyyy': return d.getFullYear();
			case 'h': return d.getHours() % 12 || 12;
			case 'hh': return zeroize(d.getHours() % 12 || 12);
			case 'H': return d.getHours();
			case 'HH': return zeroize(d.getHours());
			case 'm': return d.getMinutes();
			case 'mm': return zeroize(d.getMinutes());
			case 's': return d.getSeconds();
			case 'ss': return zeroize(d.getSeconds());
			case 'l': return zeroize(d.getMilliseconds(), 3);
			case 'L': var m = d.getMilliseconds();
				if (m > 99) m = Math.round(m / 10);
				return zeroize(m);
			case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
			case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
			case 'Z': return d.toUTCString().match(/[A-Z]+$/);
			// Return quoted strings with the surrounding quotes removed
			default: return $0.substr(1, $0.length - 2);
		}
	});
};

function timeStamp2String(time){
	var datetime = new Date(time);
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
	var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}





/*
加载已选的快捷方式
*/
function loadChoosendShortcuts() {
	$(parent.frames["rightFrame"].document).find(".choosendShortcuts").find("li").remove();
	//根据权限渲染菜单
	var userInfo = JSON.parse($.session.get('userInfo'));
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	if(typeof(userInfo.yxkjfs) !== "undefined"){
		var allChoosedShortcuts =userInfo.yxkjfs.split(",");
		for (var k = 0; k < currentMenus.length; ++k) {
			for (var i = 0; i < allChoosedShortcuts.length; ++i) {
				if (allChoosedShortcuts[i] === currentMenus[k].id&&currentMenus[k].parentElement.style.display!=="none") {
					$(parent.frames["rightFrame"].document).find(".choosendShortcuts").append('<li onclick="pointPage(this)" class="' + allChoosedShortcuts[i] +
						'"><img class="choosedShortcutsIcon" src="img/' + allChoosedShortcuts[i] +
						'.png" />' +
						'<p>' + currentMenus[k].innerText + '</a></p>' +
						'</li>');
				}
			}
		}
	}else{
		//默认显示6个快捷方式
		for (var k = 0; k < currentMenus.length; ++k) {
			if(k<=5&&currentMenus[k].parentElement.style.display!=="none"){
				$(parent.frames["rightFrame"].document).find(".choosendShortcuts").append('<li class="' + currentMenus[k].id +
					'"><img class="choosedShortcutsIcon" onclick="pointPage(this)" src="img/' + currentMenus[k].id +
					'.png" />' +
					'<p>' + currentMenus[k].innerText + '</a></p>' +
					'</li>');
			}
		}
	}

	$(".choosendShortcuts").find("li").on({
		mouseover : function(e){
			var hoverClass=e.currentTarget.className;
			$(".choosendShortcuts").find("."+hoverClass).addClass("wantPonitShortcuts");
		} ,
		mouseout : function(e){
			var hoverClass=e.currentTarget.classList[0];
			$(".choosendShortcuts").find("."+hoverClass).removeClass("wantPonitShortcuts");
		}
	}) ;
}

//根据权限渲染菜单
function changeMenu(){
	//首先全部展示父节点
	$(parent.frames["leftFrame"].document).find(".leftmenu").find("dd").show();

	var js="";
	var jsid="";
	js=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].innerText;
	jsid=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
	var menusParents = $(parent.frames["leftFrame"].document).find(".menuson"); //frame获取父窗口中的menu
	var removeArray=new Array();

	if(js!=="sys"){
		var cdTxt="";
		var allAuthority=JSON.parse($.session.get('allAuthority'));
		for (var i = 0; i < allAuthority.length; i++) {
			if(allAuthority[i].bF991_ID===parseInt(jsid)){
				cdTxt=allAuthority[i].cdqx;
			}
		}
		var cdqx = cdTxt.split(",");
		for (var c = 0; c< currentMenus.length; ++c) {
			if(cdqx.indexOf(currentMenus[c].id)===-1){
				$(parent.frames["leftFrame"].document).find("#"+currentMenus[c].id).closest('li').hide();
			}else{
				$(parent.frames["leftFrame"].document).find("#"+currentMenus[c].id).closest('li').show();
			}
		}
         //获取子节点都被隐藏的父节点
		for (var m = 0; m< menusParents.length; ++m) {
			var hideParents=false;
			for (var c = 0; c< menusParents[m].children.length; ++c) {
				if(menusParents[m].children[c].style.display!=="none"){
					hideParents=true;
					break;
				}
			}
			if(hideParents){
				menusParents[m].style.display="";
			}else{
				removeArray.push(menusParents[m].parentNode.className);
			}
		}

		//隐藏子节点都被隐藏的父节点
		for (var m = 0; m< removeArray.length; ++m) {
			$(parent.frames["leftFrame"].document).find("."+removeArray[m]).hide();
		}
	}

	loadChoosendShortcuts();
}
$(function() {
	var ids=$.session.get('exportAllGradeInfos').split(',');
	$.ajax({
		method : 'get',
		cache : false,
		url : "/printStudentGrade",
		data: {
			"ids":JSON.stringify(ids)
		},
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code==200) {
				stuffTableInfo(backjson.data);

				$('#export').unbind('click');
				$('#export').bind('click', function(e) {
					exportHtml();
					e.stopPropagation();
				});

				$('#export2').unbind('click');
				$('#export2').bind('click', function(e) {
					aa();
					e.stopPropagation();
				});
			} else {
				alert(backjson.msg);
			}
		}
	});
});

//填充成绩信息
function stuffTableInfo(testInfo){
	//详情
	for (var i = 0; i < testInfo.length; i++) {
		$(".infoTable").append($(".demo").clone());
		$(".infoTable").find(".demo").attr("id",'single'+testInfo[i].studentInfo.edu001_ID);
		$("#single"+testInfo[i].studentInfo.edu001_ID).removeClass("demo");

		$("#single"+testInfo[i].studentInfo.edu001_ID).addClass("single");
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.szxbmc').html(testInfo[i].studentInfo.szxbmc);
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.zymc').html(testInfo[i].studentInfo.zymc);
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.njmc').html(testInfo[i].studentInfo.njmc);
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.xzbname').html(testInfo[i].studentInfo.xzbname);
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.xh').html(testInfo[i].studentInfo.xh);
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.xm').html(testInfo[i].studentInfo.xm);
		$("#single"+testInfo[i].studentInfo.edu001_ID).find('.pyccmc').html(testInfo[i].studentInfo.pyccmc);

		var detail=testInfo[i].detail;
		for (let j = 0; j < detail.length; j++) {
			var uuid=getUUID();
			$("#single"+testInfo[i].studentInfo.edu001_ID).find(".tableArea").append($(".tableDemo:last").clone());
			$("#single"+testInfo[i].studentInfo.edu001_ID).find(".tableDemo:last-child").attr("id",'singleTable'+uuid);
			$("#singleTable"+uuid).removeClass("tableDemo");
			// $("#singleTable"+uuid).addClass("printArea");
			$("#single"+testInfo[i].studentInfo.edu001_ID).find('.currentXn:eq('+j+')').html(detail[j].xn);
			$("#single"+testInfo[i].studentInfo.edu001_ID).find('.getXf:eq('+j+')').html(detail[j].getCredit==null?'暂无':detail[j].getCredit);

			var allGrades=detail[j].gradeList;
			var str='';
			for (var a = 0; a < allGrades.length; a++) {
				var gradeTxt;
				allGrades[a].grade==null?gradeTxt='暂无':gradeTxt=allGrades[a].grade;
				var getCreditTxt;
				allGrades[a].getCredit==null?getCreditTxt='0':getCreditTxt=allGrades[a].getCredit;
				str='<tr>' +
					'<th style="width: 50%"><div><span></span>'+allGrades[a].courseName+'</div></th>' +
					'<th style="width: 15%"><div><span></span>'+allGrades[a].lx+'</div></th>' +
					'<th style="width: 10%"><div><span></span>'+allGrades[a].xs+'</div></th>' +
					'<th style="width: 10%"><div><span></span>'+getCreditTxt+'</div></th>' +
					'<th style="width: 15%"><div><span></span>'+gradeTxt+'</div></th>' +
					'</tr>';+
				$("#singleTable"+uuid).find('table').find('tbody').append(str);
			}
		}
	}

	var kclxTxt='';
	var thisDate=new Date().getTime();
	//公共
	for (var i = 0; i < testInfo[0].kclx.length; i++) {
		kclxTxt+=testInfo[0].kclx[i].ejdm+'-'+testInfo[0].kclx[i].ejdmz+'&nbsp;&nbsp;';
	}
	$(".kclxTxt").html(kclxTxt);
	$(".thisDate").html(timeStamp2String(thisDate));
}


function exportHtml(){
	var all=$(".single");

	for (var i = 0; i <all.length ; i++) {
		html2canvas(all[i],{
			onrendered:function(canvas){
				$("#ele").append(canvas);
				var mycanvas1=$("canvas:last-child")[0];
				//将转换后的img标签插入到html中
				var img = convertCanvasToImage(mycanvas1);
				$('#imgDiv').append(img);//imgDiv表示你要插入的容器id
				$('#imgDiv').find('img:last').wrap("<div></div>");
				$("#export").hide();
				$("#export2").show();
			}
		})
	}


	$("#ele,.infoTable").hide();

}

function convertCanvasToImage(canvas){
	//新Image对象,可以理解为DOM;
	var image = new Image();

	//canvas.toDataURL返回的是一串Base64编码的URL,当然,浏览器自己肯定支持
	//指定格式PNG
	image.src = canvas.toDataURL("image/png");
	return image;
}

function aa(){
	$('#imgDiv').find('div').css('page-break-after','always');

	$("#imgDiv").print({
		globalStyles : false,
		mediaPrint : false,
		iframe : false
	});
}

//生成UUID
function getUUID() {
	return 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

//在Jquery里格式化Date日期时间数据
function timeStamp2String(time){
	var datetime = new Date();
	datetime.setTime(time);
	var year = datetime.getFullYear();
	var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
	var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
	var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
	var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
	var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
	return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}





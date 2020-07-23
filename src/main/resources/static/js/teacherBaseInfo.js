//var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
//	getMajorTrainingSelectInfo();
	drawTeacherBaseInfoEmptyTable();
//	btnControl();
//	binBind();
});


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
				formatter: paramsMatter
			}, {
				field: 'zymc',
				title: '专业',
				align: 'center',
				formatter: paramsMatter
			}, {
				field: 'rxsj',
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
				field: 'xh',
				title: '教职工号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
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
				field: 'ksh',
				title: '职称',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: '学历',
				title: '身份证号',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'sfyxj',
				title: '婚否',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			},
			{
				field: 'zkzh',
				title: '民族',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			},
			 {
				field: 'xjh',
				title: '到校时间',
				align: 'left',
				formatter: paramsMatter,
				visible: false
			}, {
				field: 'ss',
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

	drawPagination(".teacherBaseInfoTableArea", "教职工信息");
	drawSearchInput(".teacherBaseInfoTableArea");
	changeTableNoRsTip();
	changeColumnsStyle(".teacherBaseInfoTableArea", "教职工信息");
	toolTipUp(".myTooltip");
	btnControl();
}
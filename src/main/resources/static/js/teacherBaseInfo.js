//var EJDMElementInfo;
$(function() {
	$('.isSowIndex').selectMania(); //初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo);
//	getMajorTrainingSelectInfo();
//	drawStudentBaseInfoEmptyTable();
//	btnControl();
//	binBind();
});
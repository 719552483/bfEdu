var EJDMElementInfo;

$(function() {
    EJDMElementInfo=queryEJDMElementInfo();
    $('.isSowIndex').selectMania(); //初始化下拉框
    drawlocalInfoTableEmptyTable();
    getSearchAreaSelectInfo();
    binBind();
    stuffEJDElement(EJDMElementInfo);
});

//获得学年
function getSearchAreaSelectInfo(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getJwPublicCodes",
        data: {
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
            if (backjson.result) {
                var allTermStr="";
                var showstr="暂无选择";
                if (backjson.allTerm.length>0) {
                    showstr="请选择";
                    allTermStr= '<option value="seleceConfigTip">'+showstr+'</option>';
                    for (var i = 0; i < backjson.allTerm.length; i++) {
                        allTermStr += '<option value="' + backjson.allTerm[i].edu400_ID + '">' + backjson.allTerm[i].xnmc
                            + '</option>';
                    }
                }else{
                    allTermStr= '<option value="seleceConfigTip">'+showstr+'</option>';
                }
                stuffManiaSelect("#schoolYear", allTermStr);


            } else {
                toastr.warning('操作失败，请重试');
            }
        }
    });
}

//填充空的教学点表
function drawlocalInfoTableEmptyTable() {
    stufflocalInfoTable({});
}

//渲染教学点表
function stufflocalInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #localInfoPkDetails': function(e, value, row, index) {
            localInfoPkDetails(row,index);
        }
    };

    $('#localInfoTable').bootstrapTable('destroy').bootstrapTable({
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
            fileName: '教学任务点使用率导出'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onPageChange: function() {
            drawPagination(".localInfoTableArea", "教学任务点信息");
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
           {
                field: 'edu500Id',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            }, {
                field: 'city',
                title: '地级市',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'localName',
                title: '教学点名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'pointName',
                title: '教学任务点名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'siteUtilization',
                title: '场地使用率',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
            }, {
                field: 'localAddress',
                title: '详细地址',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'remarks',
                title: '备注',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
            },
            {
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
            '<li id="localInfoPkDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>教学点排课详情</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".localInfoTableArea", "教学任务点信息");
    drawSearchInput(".localInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".localInfoTableArea", "教学点任务信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//获取教学点拍客详情信息
function localInfoPkDetails(row,index){
    if(row.siteUtilization==="0.00%"){
        toastr.warning('教学点暂未进行排课');
        return;
    }

    var xn=getNormalSelectValue("schoolYear");
    if(xn===""){
        toastr.warning('请选择学年');
        return;
    }

    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchCourseDetailByXNAndPointid",
        data: {
            "term":xn,
            "pointId":row.edu501Id
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
                stuffPkInfoTable(backjson.data,row);
                $("#PkDetailsModal").find(".moadalTitle").html(getNormalSelectText("schoolYear")+'-'+ row.pointName+'排课详情');
                $.showModal("#PkDetailsModal",true);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//渲染排课详情表
function stuffPkInfoTable(tableInfo,row) {
    $('#PkInfoTable').bootstrapTable('destroy').bootstrapTable({
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
            fileName:getNormalSelectText("schoolYear")+'-'+ row.pointName+'排课详情'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onPageChange: function() {
            drawPagination(".PkInfoTableArea", "排课详情");
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {
                field: 'classRoom',
                title: '教学点',
                align: 'left',
                sortable: true,
                visible: false,
                formatter: paramsMatter
            }, {
                field: 'point',
                title: '教学任务点',
                align: 'left',
                sortable: true,
                visible: false,
                formatter: paramsMatter
            },{
                field: 'className',
                title: '班级',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'courseName',
                title: '课程',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'classType',
                title: '课程类型',
                align: 'left',
                sortable: true,
                visible: false,
                formatter: paramsMatter
            },  {
                field: 'teacherName',
                title: '教师',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'szz',
                title: '所在周',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
            },{
                field: 'xqmc',
                title: '星期',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
            },{
                field: 'kjmc',
                title: '课节',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
            }
        ]
    });


    drawPagination(".PkInfoTableArea", "排课详情");
    drawSearchInput(".PkInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".PkInfoTableArea", "排课详情");
    toolTipUp(".myTooltip");
    btnControl();
}

//开始检索教学点
function startSearch(){
    var searchObject = getSearchValue();
    if(searchObject.academicYearId === undefined){
        toastr.warning('请选择学年');
        return;
    }
    searchAllSiteBy(searchObject);
}

//获得检索区域的值
function getSearchValue(){
    var localName= $("#localName").val();
    var pointName= $("#pointName").val();
    var city = getNormalSelectText("city");
    var cityCode = getNormalSelectValue("city");
    var academicYearId = getNormalSelectValue("schoolYear");

    var returnObject = new Object();
    if(localName!==""){
        returnObject.localName = localName;
    }

    if(pointName!==""){
        returnObject.pointName = pointName;
    }

    if(cityCode!==""){
        returnObject.cityCode = cityCode;
        returnObject.city = city;
    }

    if(academicYearId!==""){
        returnObject.academicYearId = academicYearId;
    }

    return returnObject;
}

//按条件检索教学点
function searchAllSiteBy(searchObject){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchLocalUsed",
        data: {
            "SearchCriteria":JSON.stringify(searchObject)
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
                stufflocalInfoTable(backjson.data);
                toastr.success(backjson.msg);
            } else {
                toastr.warning(backjson.msg);
                drawlocalInfoTableEmptyTable();
            }
        }
    });
}

//重置检索
function researchSites(){
    var reObject = new Object();
    reObject.InputIds = "#localName,#SiteName";
    reObject.normalSelectIds = "#schoolYear,#city";
    reReloadSearchsWithSelect(reObject);
    drawlocalInfoTableEmptyTable();
}

//初始化页面按钮绑定事件
function binBind() {
    //开始检索
    $('#startSearch').unbind('click');
    $('#startSearch').bind('click', function(e) {
        startSearch();
        e.stopPropagation();
    });

    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchSites();
        e.stopPropagation();
    });

    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });
}
var EJDMElementInfo;

$(function() {
    EJDMElementInfo=queryEJDMElementInfo();
    $('.isSowIndex').selectMania(); //初始化下拉框
    $("input[type='number']").inputSpinner();
    drawlocalInfoTableEmptyTable();
    getSearchAreaSelectInfo();
    binBind();
    stuffEJDElement(EJDMElementInfo);
});

//获得检索区域下拉框数据
function getSearchAreaSelectInfo(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getJwPublicCodes",
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
                var showstr="暂无选择";
                var allDepartmentStr="";
                var allTeacherStr="";
                if (backjson.allDepartment.length>0) {
                    showstr="请选择";
                    allDepartmentStr= '<option value="seleceConfigTip">'+showstr+'</option>';
                    for (var i = 0; i < backjson.allDepartment.length; i++) {
                        allDepartmentStr += '<option value="' + backjson.allDepartment[i].edu104_ID + '">' + backjson.allDepartment[i].xbmc
                            + '</option>';
                    }
                }else{
                    allDepartmentStr= '<option value="seleceConfigTip">'+showstr+'</option>';
                }
                stuffManiaSelect("#addManagementDepartment", allDepartmentStr);
                stuffManiaSelect("#employDepartment", allDepartmentStr);

                var showstr="暂无选择";
                if (backjson.allTeacher.length>0) {
                    showstr="请选择";
                    allTeacherStr= '<option value="seleceConfigTip">'+showstr+'</option>';
                    for (var i = 0; i < backjson.allTeacher.length; i++) {
                        allTeacherStr += '<option value="' + backjson.allTeacher[i].edu101_ID + '">' + backjson.allTeacher[i].xm
                            + '</option>';
                    }
                }else{
                    allTeacherStr= '<option value="seleceConfigTip">'+showstr+'</option>';
                }
                stuffManiaSelect("#addSiteManager", allTeacherStr);


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
        'click #localInfoDetails': function(e, value, row, index) {
            localInfoDetails(row,index);
        },
        'click #modifySite': function(e, value, row, index) {
            modifySite(row,index);
        },
        'click #removeSite': function(e, value, row, index) {
            removeSite(row);
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
            fileName: '教学点导出'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onPageChange: function() {
            drawPagination(".localInfoTableArea", "教学点信息");
        },
        columns: [
            {
                field: 'check',
                checkbox: true,
            },{
                field: 'edu500Id',
                title: '唯一标识',
                align: 'center',
                visible: false
            },
            {
                field: 'jxdmc',
                title: '教学任务点名称',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'ssxq',
                title: '所属校区',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'glxb',
                title: '管理系部',
                align: 'left',
                formatter: paramsMatter
            },{
                field: 'cdlx',
                title: '场地类型',
                align: 'left',
                formatter: paramsMatter
            },  {
                field: 'cdxz',
                title: '场地性质',
                align: 'left',
                formatter: paramsMatter,
            },  {
                field: 'cdfzr',
                title: '场地负责人',
                align: 'left',
                formatter: paramsMatter,
            }, {
                field: 'cdsyl',
                title: '场地使用率',
                align: 'left',
                formatter: paramsMatter,
            },
            {
                field: 'bz',
                title: '备注',
                align: 'left',
                formatter: paramsMatter,
            },
            {
                field: 'xxdz',
                title: '详细地址',
                align: 'left',
                formatter: paramsMatter
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
            '<li id="localInfoDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".localInfoTableArea", "教学点信息");
    drawSearchInput(".localInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".localInfoTableArea", "教学点信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//展示教学点详情
function localInfoDetails(row,index){
    $.showModal("#addSiteModal",false);
    $("#addSiteModal").find(".moadalTitle").html(row.jxdmc+"-详细信息");
    $('#addSiteModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    rebackSiteInfo();
    stufflocalInfoDetails(row);
}

//重置教学点信息模态框
function rebackSiteInfo(){
    var reObject = new Object();
    reObject.InputIds = "#addTeachingPointName,#addCapacity,#addRemarks,#addAddress";
    reObject.normalSelectIds = "#addSchool,#addManagementDepartment,#addSiteType,#addSiteNature,#addBuilding,#addStorey,#addSiteManager,#addSiteStatus";
    reReloadSearchsWithSelect(reObject);
}

//填充教学点信息
function stufflocalInfoDetails(row){
    $("#addTeachingPointName").val(row.jxdmc);
    $("#addAddress").val(row.xxdz);
    stuffManiaSelectWithDeafult("#addSchool", row.ssxqCode);
    stuffManiaSelectWithDeafult("#addManagementDepartment", row.glxbCode);
    stuffManiaSelectWithDeafult("#addSiteType", row.cdlxCode);
    stuffManiaSelectWithDeafult("#addSiteNature", row.cdxzCode);
    stuffManiaSelectWithDeafult("#addBuilding", row.lfCode);
    stuffManiaSelectWithDeafult("#addStorey", row.lcCode);
    stuffManiaSelectWithDeafult("#addSiteManager", row.cdfzrCode);
    stuffManiaSelectWithDeafult("#addSiteStatus", row.cdztCode);
    $("#addRemarks").val(row.bz);
    $("#addCapacity").val(row.rnrs);
}

//开始检索教学点
function startSearch(){
    var searchObject = getSearchValue();
    if ($.isEmptyObject(searchObject)) {
        searchAllSite();
    }else{
        searchAllSiteBy(searchObject);
    }
}

//获得检索区域的值
function getSearchValue(){
    var jxdmc= $("#SiteName").val();
    var ssxq = getNormalSelectText("school");
    var ssxqCode = getNormalSelectValue("school");
    var cdlx = getNormalSelectText("siteStype");
    var cdlxCode = getNormalSelectValue("siteStype");
    var cdxz = getNormalSelectText("siteNature");
    var cdxzCode = getNormalSelectValue("siteNature");
    var lf= getNormalSelectText("building");
    var lfCode = getNormalSelectValue("building");
    var xn = getNormalSelectText("schoolYear");


    var returnObject = new Object();
    if(jxdmc!==""){
        returnObject.jxdmc = jxdmc;
    }

    if(xn!==""){
        returnObject.academicYear = xn;
    }

    if(ssxq!==""){
        returnObject.ssxq = ssxq;
        returnObject.ssxqCode = ssxqCode;
    }

    if(cdlx!==""){
        returnObject.cdlx = cdlx;
        returnObject.cdlxCode = cdlxCode;
    }

    if(cdxz!==""){
        returnObject.cdxz = cdxz;
        returnObject.cdxzCode = cdxzCode;
    }

    if(lf!==""){
        returnObject.lf = lf;
        returnObject.lfCode = lfCode;
    }

    return returnObject;
}

//检索所有教学点
function searchAllSite(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/queryAllSite",
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
                if(backjson.siteList.length===0){
                    toastr.warning('暂无教学点信息');
                    drawlocalInfoTableEmptyTable();
                }else{
                    stufflocalInfoTable(backjson.siteList);
                }
            } else {
                toastr.warning('操作失败，请重试');
            }
        }
    });
}

//按条件检索教学点
function searchAllSiteBy(searchObject){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchSite",
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
            if (backjson.result) {
                if(backjson.siteList.length===0){
                    toastr.warning('暂无教学点信息');
                    drawlocalInfoTableEmptyTable();
                }else{
                    stufflocalInfoTable(backjson.siteList);
                }
            } else {
                toastr.warning('操作失败，请重试');
            }
        }
    });
}

//重置检索
function researchSites(){
    var reObject = new Object();
    reObject.InputIds = "#SiteName";
    reObject.normalSelectIds = "#school,#siteStype,#building,#storey,#siteNature,#employDepartment";
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
}
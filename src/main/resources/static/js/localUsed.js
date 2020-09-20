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
            fileName: '教学任务点使用率导出'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onPageChange: function() {
            drawPagination(".localInfoTableArea", "教学任务点信息");
        },
        columns: [
           {
                field: 'edu500Id',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            }, {
                field: 'localName',
                title: '教学点名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'city',
                title: '地级市',
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
            }
            // {
            //     field: 'action',
            //     title: '操作',
            //     align: 'center',
            //     clickToSelect: false,
            //     formatter: releaseNewsFormatter,
            //     events: releaseNewsEvents,
            // }
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

    drawPagination(".localInfoTableArea", "教学任务点信息");
    drawSearchInput(".localInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".localInfoTableArea", "教学点任务信息");
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
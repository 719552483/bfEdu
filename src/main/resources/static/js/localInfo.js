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
            fileName: '教学任务点导出'  //文件名称
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
                field: 'check',
                checkbox: true,
            },{
                field: 'edu500Id',
                title: '唯一标识',
                align: 'center',
                visible: false
            }, {
                field: 'localName',
                title: '教学点名称',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'city',
                title: '地级市',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'country',
                title: '区/县',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'townShip',
                title: '乡/镇',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'localAddress',
                title: '详细地址',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'remarks',
                title: '备注',
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
            '<li id="localInfoDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
            '<li id="modifySite" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
            '<li id="removeSite" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".localInfoTableArea", "教学任务点信息");
    drawSearchInput(".localInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".localInfoTableArea", "教学任务点信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//单个删除教学点
function removeSite(row){
    $.showModal("#remindModal",true);
    $(".remindType").html('教学点- '+row.localName+' ');
    $(".remindActionType").html("删除");

    //确认删除教学点
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.edu500Id);
        sendRemoveInfo(removeArray);
        e.stopPropagation();
    });
}

//批量删除教学点
function removeSites(){
    var chosenSites = $('#localInfoTable').bootstrapTable('getAllSelections');
    if (chosenSites.length === 0) {
        toastr.warning('暂未选择任何数据');
    } else {
        $.showModal("#remindModal",true);
        $(".remindType").html("所选教学点");
        $(".remindActionType").html("删除");

        //确认删除教学点
        $('.confirmRemind').unbind('click');
        $('.confirmRemind').bind('click', function(e) {
            var removeArray = new Array;
            for (var i = 0; i < chosenSites.length; i++) {
                removeArray.push(chosenSites[i].edu500Id);
            }
            sendRemoveInfo(removeArray);
            e.stopPropagation();
        });
    }
}

//发送删除请求
function sendRemoveInfo(removeArray){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/removeSite",
        data: {
            "removeIDs":JSON.stringify(removeArray)
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
                for (var i = 0; i < removeArray.length; i++) {
                    $('#localInfoTable').bootstrapTable('removeByUniqueId', removeArray[i]);
                }
                $(".myTooltip").tooltipify();
                toastr.success(backjson.msg);
                $.hideModal("#remindModal");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}


//展示教学点详情
function localInfoDetails(row,index){
    $.showModal("#addSiteModal",false);
    $("#addSiteModal").find(".moadalTitle").html(row.localName+"-详细信息");
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
    $("#addTeachingPointName").val(row.localName);
    $("#addAddress").val(row.localAddress);
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

//预备修改教学点
function modifySite(row,index){
    $.showModal("#addSiteModal",true);
    $("#addSiteModal").find(".moadalTitle").html("修改教学任务点-"+row.jxdmc);
    $('#addSiteModal').find(".modal-body").find("input").attr("disabled", false) // 将input元素设置为readonly
    //清空模态框中元素原始值
    rebackSiteInfo();
    stufflocalInfoDetails(row);
    //确认按钮绑定事件
    $('.confirmaddSiteBtn').unbind('click');
    $('.confirmaddSiteBtn').bind('click', function(e) {
        confirmmodifySite(row,index);
        e.stopPropagation();
    });
}

//确认修改教学点
function confirmmodifySite(row,index){
    var modifylocalInfo=getnewlocalInfo();
    if(typeof modifylocalInfo ==='undefined'){
        return;
    }
    $.hideModal("#addSiteModal",false);
    $.showModal("#remindModal",true);
    $(".remindType").html(row.jxdmc);
    $(".remindActionType").html("修改");

    //确认按钮绑定事件
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        sendModifySite(row,modifylocalInfo);
        e.stopPropagation();
    });
}

//发送修改教学点请求
function sendModifySite(row,modifylocalInfo){
    modifylocalInfo.edu500Id=row.edu500Id;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addSiteInfo",
        data: {
            "newSiteInfo":JSON.stringify(modifylocalInfo)
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
                $("#localInfoTable").bootstrapTable('updateByUniqueId', {
                    id: modifylocalInfo.edu500Id,
                    row: modifylocalInfo
                });
                $(".myTooltip").tooltipify();
                toastr.success(backjson.msg);
                $.hideModal("#remindModal");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得新增教学点的信息
function getnewlocalInfo(){
    var localName= $("#addLocalName").val();
    var localAddress= $("#addLocalAddress").val();
    var city = getNormalSelectText("addCity");
    var cityCode = getNormalSelectValue("addCity");
    var country = $("#country").val();
    var townShip = $("#townShip").val();
    var remarks = $("#remarks").val();

    var returnObject = new Object();
    if(localName == "" || localAddress == "" || city == "" || country == "") {
        return undefined;
    }


    returnObject.localName=localName;
    returnObject.localAddress=localAddress;
    returnObject.city=city;
    returnObject.cityCode=cityCode;
    returnObject.country=country;
    returnObject.townShip=townShip;
    returnObject.remarks=remarks;

    return returnObject;
}

//预备添加教学点
function wantAddSite(){
    rebackSiteInfo();
    $("#addSiteModal").find(".moadalTitle").html("新增教学任务点");
    $('#addSiteModal').find(".modal-body").find("input").attr("disabled", false) // 将input元素设置为readonly
    $.showModal("#addSiteModal",true);
    //确认按钮绑定事件
    $('.confirmaddSiteBtn').unbind('click');
    $('.confirmaddSiteBtn').bind('click', function(e) {
        confirmaddSite();
        e.stopPropagation();
    });
}

//确认添加教学点
function confirmaddSite(){
    var newSiteInfo=getnewlocalInfo();
    if(typeof newSiteInfo ==='undefined'){
        toastr.warning('请检查必填项');
        return;
    }
    sendNewSiteInfo(newSiteInfo);
}

//发送添加教学点请求
function sendNewSiteInfo(newSiteInfo){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addSiteInfo",
        data: {
            "newSiteInfo":JSON.stringify(newSiteInfo)
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
                newSiteInfo.edu500Id=backjson.data;
                $('#localInfoTable').bootstrapTable("prepend", newSiteInfo);
                $(".myTooltip").tooltipify();
                toastr.success(backjson.msg);
                $.hideModal("#addSiteModal");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//开始检索教学点
function startSearch(){
    var searchObject = getSearchValue();
    searchAllSiteBy(searchObject);
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
    var lc = getNormalSelectText("storey");
    var lcCode = getNormalSelectValue("storey");


    var returnObject = new Object();
    if(jxdmc!==""){
        returnObject.jxdmc = jxdmc;
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

    if(lc!==""){
        returnObject.lc = lc;
        returnObject.lcCode = lcCode;
    }

    return returnObject;
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
    //提示框取消按钮
    $('.cancelTipBtn,.cancel').unbind('click');
    $('.cancelTipBtn,.cancel').bind('click', function(e) {
        $.hideModal();
        e.stopPropagation();
    });

    //开始检索
    $('#startSearch').unbind('click');
    $('#startSearch').bind('click', function(e) {
        startSearch();
        e.stopPropagation();
    });

    //新增教学点
    $('#addSite').unbind('click');
    $('#addSite').bind('click', function(e) {
        wantAddSite();
        e.stopPropagation();
    });

    //批量删除教学点
    $('#removeSites').unbind('click');
    $('#removeSites').bind('click', function(e) {
        removeSites();
        e.stopPropagation();
    });


    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchSites();
        e.stopPropagation();
    });
}
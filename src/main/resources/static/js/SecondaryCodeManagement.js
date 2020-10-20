var EJDMElementInfo;

$(function() {
    EJDMElementInfo=queryEJDMElementInfo();
    $('.isSowIndex').selectMania(); //初始化下拉框
    $("input[type='number']").inputSpinner();
    drawlocalInfoTableEmptyTable();
    binBind();
    stuffEJDElement(EJDMElementInfo);
    searchAllSiteBy(new Object);
});

//填充空的二级代码表
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
        },
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
            fileName: '二级代码导出'  //文件名称
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
                field: 'check',
                checkbox: true,
            },{
                field: 'edu000Id',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            },{
                field: 'ejdmglzd',
                title: '二级代码关联字段',
                align: 'left',
                sortable: true,
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'ejdmmc',
                title: '二级代码名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'ejdm',
                title: '二级代码',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'ejdmz',
                title: '二级代码值',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
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

    drawPagination(".localInfoTableArea", "二级代码信息");
    drawSearchInput(".localInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".localInfoTableArea", "二级代码信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//单个删除二级代码
function removeSite(row){
    $.showModal("#remindModal",true);
    $(".remindType").html('二级代码- '+row.ejdmz+' ');
    $(".remindActionType").html("删除");

    //确认删除
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.bf000_ID);
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
        $(".remindType").html("所选二级代码");
        $(".remindActionType").html("删除");

        //确认删除教学点
        $('.confirmRemind').unbind('click');
        $('.confirmRemind').bind('click', function(e) {
            var removeArray = new Array;
            for (var i = 0; i < chosenSites.length; i++) {
                removeArray.push(chosenSites[i].bf000_ID);
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
        url : "/removeSecondaryCode",
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
    $("#addSiteModal").find(".moadalTitle").html(row.ejdmz+"-详细信息");
    $('#addSiteModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    rebackSiteInfo();
    stufflocalInfoDetails(row);
}

//重置教学点信息模态框
function rebackSiteInfo(){
    var reObject = new Object();
    reObject.InputIds = "#addEjdmmc,#addEjdmglzd,#addEjdm,#addEjdmz";
    reReloadSearchsWithSelect(reObject);
}

//填充二级代码信息
function stufflocalInfoDetails(row){
    $("#addEjdmmc").val(row.ejdmmc);
    $("#addEjdmglzd").val(row.ejdmglzd);
    $("#addEjdm").val(row.ejdm);
    $("#addEjdmz").val(row.ejdmz);
}

//预备修改教学点
function modifySite(row,index){
    $.showModal("#addSiteModal",true);
    $("#addSiteModal").find(".moadalTitle").html("修改二级代码-"+row.ejdmz);
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

//确认修改二级代码
function confirmmodifySite(row,index){
    var modifylocalInfo=getnewlocalInfo();
    if(typeof modifylocalInfo ==='undefined'){
        return;
    }
    modifylocalInfo.bf000_ID = row.bf000_ID;
    $.hideModal("#addSiteModal",false);
    $.showModal("#remindModal",true);
    $(".remindType").html(row.ejdzm);
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
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addSecondaryCode",
        data: {
            "newCodeInfo":JSON.stringify(modifylocalInfo)
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
                    id: modifylocalInfo.bf000_ID,
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
    var ejdmmc= $("#addEjdmmc").val();
    var ejdmglzd= $("#addEjdmglzd").val();
    var ejdm = $("#addEjdm").val();
    var ejdmz = $("#addEjdmz").val();

    var returnObject = new Object();
    if(ejdmmc == "" || ejdmglzd == "" || ejdm == "" || ejdmz == "") {
        return undefined;
    }


    returnObject.ejdmmc=ejdmmc;
    returnObject.ejdmglzd=ejdmglzd;
    returnObject.ejdm=ejdm;
    returnObject.ejdmz=ejdmz;
    return returnObject;
}

//预备添加教学点
function wantAddSite(){
    rebackSiteInfo();
    $("#addSiteModal").find(".moadalTitle").html("新增二级代码");
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
        url : "/addSecondaryCode",
        data: {
            "newCodeInfo":JSON.stringify(newSiteInfo)
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
                newSiteInfo.bf000_ID=backjson.data.bf000_ID;
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

//开始检索耳机代码
function startSearch(){
    var searchObject = getSearchValue();
    searchAllSiteBy(searchObject);
}

//获得检索区域的值
function getSearchValue(){
    var ejdmmc= $("#ejdmmc").val();

    var returnObject = new Object();
    if(ejdmmc!==""){
        returnObject.ejdmmc = ejdmmc;
    }

    return returnObject;
}

//按条件检索教学点
function searchAllSiteBy(searchObject){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchSecondaryCode",
        data: {
            "searchCriteria":JSON.stringify(searchObject)
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
    reObject.InputIds = "#ejdmmc";
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

    //新增二级代码
    $('#addSite').unbind('click');
    $('#addSite').bind('click', function(e) {
        wantAddSite();
        e.stopPropagation();
    });

    //批量删除二级代码
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
/*
* 教学点page
*
* */
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

//填充空的教学点表
function drawlocalInfoTableEmptyTable() {
    stufflocalInfoTable({});
}

var choosendlocal=new Array();
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
        'click #pointDetail': function(e, value, row, index) {
            pointDetail(row);
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
        onCheck : function(row) {
            onCheck(row);
        },
        onUncheck : function(row) {
            onUncheck(row);
        },
        onCheckAll : function(rows) {
            onCheckAll(rows);
        },
        onUncheckAll : function(rows,rows2) {
            onUncheckAll(rows2);
        },
        onPageChange: function() {
            drawPagination(".localInfoTableArea", "教学任务点信息");
            for (var i = 0; i < choosendlocal.length; i++) {
                $("#localInfoTable").bootstrapTable("checkBy", {field:"edu500Id", values:[choosendlocal[i].edu500Id]})
            }
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {
                field: 'check',
                checkbox: true,
            },{
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
                field: 'country',
                title: '区/县',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'pointCount',
                title: '任务点',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'localAddress',
                title: '详细地址',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'remarks',
                title: '备注',
                align: 'left',
                sortable: true,
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
            '<li id="pointDetail" class="pointBtn"><span><img src="img/culturePlanapproval.png" style="width:24px"></span>教学任务点信息</li>' +
            '<li id="removeSite" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
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

//单选学生
function onCheck(row){
    if(choosendlocal.length<=0){
        choosendlocal.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendlocal.length; i++) {
            if(choosendlocal[i].edu500Id===row.edu500Id){
                add=false;
                break;
            }
        }
        if(add){
            choosendlocal.push(row);
        }
    }
}

//单反选学生
function onUncheck(row){
    if(choosendlocal.length<=1){
        choosendlocal.length=0;
    }else{
        for (var i = 0; i < choosendlocal.length; i++) {
            if(choosendlocal[i].edu500Id===row.edu500Id){
                choosendlocal.splice(i,1);
            }
        }
    }
}

//全选学生
function onCheckAll(row){
    for (var i = 0; i < row.length; i++) {
        choosendlocal.push(row[i]);
    }
}

//全反选学生
function onUncheckAll(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu500Id);
    }


    for (var i = 0; i < choosendlocal.length; i++) {
        if(a.indexOf(choosendlocal[i].edu500Id)!==-1){
            choosendlocal.splice(i,1);
            i--;
        }
    }
}

//获取教学任务点信息
function pointDetail(row){
    choosendPoint=new Array();
    edu500Id=row.edu500Id;

    reBackPonitInfoSearch();
    pointBtnBind();
    getPointBy(new Object(),row.localName);
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
               toolTipUp(".myTooltip");
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
    reObject.InputIds = "#addLocalName,#addCountry,#addLocalAddress,#addRemarks";
    reObject.normalSelectIds = "#addCity";
    reReloadSearchsWithSelect(reObject);
}

//填充教学点信息
function stufflocalInfoDetails(row){
    $("#addCountry").val(row.country);
    $("#addLocalName").val(row.localName);
    $("#addLocalAddress").val(row.localAddress);
    stuffManiaSelectWithDeafult("#addCity", row.cityCode);
    $("#addRemarks").val(row.remarks);
}

//预备修改教学点
function modifySite(row,index){
    $.showModal("#addSiteModal",true);
    $("#addSiteModal").find(".moadalTitle").html("修改教学点-"+row.localName);
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
    $(".remindType").html(row.localName);
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
               toolTipUp(".myTooltip");
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
    var country = $("#addCountry").val();
    var remarks = $("#addRemarks").val();

    var returnObject = new Object();
    if(localName == "" || localAddress == "" || city == "") {
        return undefined;
    }


    returnObject.localName=localName;
    returnObject.localAddress=localAddress;
    returnObject.city=city;
    returnObject.cityCode=cityCode;
    returnObject.country=country;
    returnObject.remarks=remarks;

    return returnObject;
}

//预备添加教学点
function wantAddSite(){
    rebackSiteInfo();
    $("#addSiteModal").find(".moadalTitle").html("新增教学点");
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
               toolTipUp(".myTooltip");
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
    var localName= $("#localName").val();
    var country= $("#country").val();
    var city = getNormalSelectText("city");
    var cityCode = getNormalSelectValue("city");

    var returnObject = new Object();
    if(localName!==""){
        returnObject.localName = localName;
    }

    if(country!==""){
        returnObject.country = country;
    }

    if(city!==""){
        returnObject.city = city;
        returnObject.cityCode = cityCode;
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
    reObject.InputIds = "#localName,#country";
    reObject.normalSelectIds = "#city";
    reReloadSearchsWithSelect(reObject);
    searchAllSiteBy(new Object);
}

//教学点详情合并导出
function wantLoadDetails(){
    $.showModal("#loadDetailsModal",true);
    stuffMultipleDefault();

    $('.confirmLoadDetails').unbind('click');
    $('.confirmLoadDetails').bind('click', function(e) {
        exportFile();
        e.stopPropagation();
    });
}

var haveToCheck=['教学点名称','地级市','区/县','教学任务点名称'];
//渲染多选下拉默认选择隐藏
function stuffMultipleDefault(){
    $("#exportThings").multiSelect();
    $(".exportThingsArea").find(".multi-select-container").find("span").html('教学点名称, 地级市, 区/县, 教学任务点名称');

    var jsSelect=$(".exportThingsArea").find(".multi-select-menuitems").find("input");
    for (var i = 0; i < jsSelect.length; i++) {
        var currentJs=jsSelect[i].attributes[2].nodeValue;
        for (var h = 0; h < haveToCheck.length; h++) {
            if(haveToCheck.indexOf(currentJs)!=-1){
                jsSelect[i].checked = "checked";
                $(".exportThingsArea").find(".multi-select-menuitems").find("label:eq("+i+")").hide();
            }else{
                jsSelect[i].checked = "";
                $(".exportThingsArea").find(".multi-select-menuitems").find("label:eq("+i+")").show();
            }
        }
    }
    $("#exportThings").val(haveToCheck);
    $(".loadDetailsModalRsTxtCite").html(haveToCheck.toString());

    //监控选择  渲染提示文字
    $('#exportThings').change(function(e){
        $(".loadDetailsModalRsTxtCite").html($("#exportThings").val().toString());
    });
}

//开始导出文件
function exportFile(){
    var sendObject=new Object();
    sendObject.city=getNormalSelectValue("cityForLoad");
    sendObject.item=$("#exportThings").val().toString();
    $.ajax({
        method : 'get',
        cache : false,
        url : "/exportPointByCityCheck",
        data: {
            "sendObject":JSON.stringify(sendObject)
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
            if (backjson.code == 200) {
                $.hideModal();
                startLoadFile(sendObject);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//开始下载文件
function startLoadFile(sendObject){
    var url = "/exportPointByCity";
    var form = $("<form></form>").attr("action", url).attr("method", "post");
    form.append($("<input></input>").attr("type", "hidden").attr("name", "sendObject").attr("value",JSON.stringify(sendObject)));
    form.appendTo('body').submit().remove();
}
/*
* 教学点page end
*
* */

/*
* 教学任务点page
* */
var edu500Id;
//获取教学任务点
function getPointBy(searchObject,localName){
    searchObject.edu500Id = edu500Id;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchPointInfo",
        data: {
            "SearchCriteria":JSON.stringify(searchObject),
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
                stuffPointInfoTable(backjson.data);
                $.showModal("#localPointInfoModal",true);
                $("#localPointInfoModal").find(".moadalTitle").html(localName+"-教学任务点信息");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充空的教学任务点表
function drawPointInfoTableEmptyTable() {
    stuffPointInfoTable({});
}

var choosendPoint=new Array();
//渲染教学任务点表
function stuffPointInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #pointDetails': function(e, value, row, index) {
            pointDetails(row,index);
        },
        'click #modifyPoint': function(e, value, row, index) {
            modifyPoint(row,index);
        },
        'click #removePoint': function(e, value, row, index) {
            removePoint(row);
        }
    };

    $('#pointInfoTable').bootstrapTable('destroy').bootstrapTable({
        data: tableInfo,
        pagination: true,
        pageNumber: 1,
        pageSize : 5,
        pageList : [ 5 ],
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
        onCheck : function(row) {
            onCheckPoint(row);
        },
        onUncheck : function(row) {
            onUncheckPoint(row);
        },
        onCheckAll : function(rows) {
            onCheckAllPoint(rows);
        },
        onUncheckAll : function(rows,rows2) {
            onUncheckAllPoint(rows2);
        },
        onPageChange: function() {
            drawPagination(".pointInfoTableArea", "教学任务点信息");
            for (var i = 0; i < choosendPoint.length; i++) {
                $("#pointInfoTable").bootstrapTable("checkBy", {field:"edu501Id", values:[choosendPoint[i].edu501Id]})
            }
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {
                field: 'check',
                checkbox: true,
            },{
                field: 'edu501Id',
                title: '唯一标识',
                align: 'center',
                sortable: true,
                visible: false
            },{
                field: 'pointName',
                title: '教学任务点名称',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            }, {
                field: 'capacity',
                title: '可容纳人数',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },{
                field: 'remarks',
                title: '备注',
                align: 'left',
                sortable: true,
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
            '<li id="pointDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
            '<li id="modifyPoint" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
            '<li id="removePoint" class="deleteBtn"><span><img src="images/t03.png"></span>删除</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".pointInfoTableArea", "教学任务点信息");
    drawSearchInput(".pointInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".pointInfoTableArea", "教学任务点信息");
    toolTipUp(".myTooltip");
    btnControl();
}

//展示教学点详情
function pointDetails(row,index){
    $.hideModal("#localPointInfoModal",false);
    $.showModal("#addPointModal",true);

    $("#addPointModal").find(".moadalTitle").html(row.pointName+"-详细信息");
    $('#addPointModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    stuffPointDetails(row);
}

//预备修改任务点
function modifyPoint(row,index){
    $.hideModal("#localPointInfoModal",false);
    $.showModal("#addPointModal",true);

    $("#addPointModal").find(".moadalTitle").html("修改教学点-"+row.pointName);
    $('#addPointModal').find(".modal-body").find("input").attr("disabled", false) // 将input元素设置为readonly
    //清空模态框中元素原始值
    stuffPointDetails(row);
    //确认按钮绑定事件
    $('.confirmaddPointBtn').unbind('click');
    $('.confirmaddPointBtn').bind('click', function(e) {
        confirmmodifyPoint(row,index);
        e.stopPropagation();
    });
}

//确认修改任务点
function confirmmodifyPoint(row,index){
    var modifylocalInfo=getnewPointInfo();
    if(typeof modifylocalInfo ==='undefined'){
        return;
    }
    $.hideModal("#addPointModal",false);
    $.showModal("#remindModal",true);
    $(".remindType").html(row.pointName);
    $(".remindActionType").html("修改");

    //确认按钮绑定事件
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        sendModifyPoint(row,modifylocalInfo);
        e.stopPropagation();
    });
}

//发送修改任务点请求
function sendModifyPoint(row,modifylocalInfo){
    modifylocalInfo.edu501Id=row.edu501Id;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addLocalPointInfo",
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
                $("#pointInfoTable").bootstrapTable('updateByUniqueId', {
                    id: modifylocalInfo.edu501Id,
                    row: modifylocalInfo
                });
               toolTipUp(".myTooltip");
                toastr.success(backjson.msg);
                $.hideModal("#remindModal",false);
                $.showModal("#localPointInfoModal",true);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充教学点信息
function stuffPointDetails(row){
    $("#addPointName").val(row.pointName);
    $("#addCapacity").val(row.capacity);
    $("#addPointRemarks").val(row.remarks);
}

//单个删除任务点
function removePoint(row){
    $.showModal("#remindModal",true);
    $.hideModal("#localPointInfoModal",false);
    $(".remindType").html('教学任务点- '+row.pointName+' ');
    $(".remindActionType").html("删除");

    //确认删除教学点
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.edu501Id);
        sendRemovePointInfo(removeArray);
        e.stopPropagation();
    });
}

//批量删除教学点
function removePoints(){
    var chosenSites =$('#pointInfoTable').bootstrapTable('getAllSelections');;
    if (chosenSites.length === 0) {
        toastr.warning('暂未选择任何数据');
    } else {
        $.showModal("#remindModal",true);
        $.hideModal("#localPointInfoModal",false);
        $(".remindType").html("所选教学点");
        $(".remindActionType").html("删除");

        //确认删除教学点
        $('.confirmRemind').unbind('click');
        $('.confirmRemind').bind('click', function(e) {
            var removeArray = new Array;
            for (var i = 0; i < chosenSites.length; i++) {
                removeArray.push(chosenSites[i].edu501Id);
            }
            sendRemovePointInfo(removeArray);
            e.stopPropagation();
        });
    }
}

//发送删除请求
function sendRemovePointInfo(removeArray){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/removePoint",
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
                    $('#pointInfoTable').bootstrapTable('removeByUniqueId', removeArray[i]);
                }
                toastr.success(backjson.msg);
                $.showModal("#localPointInfoModal",true);
                $.hideModal("#remindModal",false);
                toolTipUp(".myTooltip");
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//单选教学任务点
function onCheckPoint(row){
    if(choosendPoint.length<=0){
        choosendPoint.push(row);
    }else{
        var add=true;
        for (var i = 0; i < choosendPoint.length; i++) {
            if(choosendPoint[i].edu501Id===row.edu501Id){
                add=false;
                break;
            }
        }
        if(add){
            choosendPoint.push(row);
        }
    }
}

//单反选教学任务点
function onUncheckPoint(row){
    if(choosendPoint.length<=1){
        choosendPoint.length=0;
    }else{
        for (var i = 0; i < choosendPoint.length; i++) {
            if(choosendPoint[i].edu501Id===row.edu501Id){
                choosendPoint.splice(i,1);
            }
        }
    }
}

//全选教学任务点
function onCheckAllPoint(row){
    for (var i = 0; i < row.length; i++) {
        choosendPoint.push(row[i]);
    }
}

//全反选教学任务点
function onUncheckAllPoint(row){
    var a=new Array();
    for (var i = 0; i < row.length; i++) {
        a.push(row[i].edu501Id);
    }


    for (var i = 0; i < choosendPoint.length; i++) {
        if(a.indexOf(choosendPoint[i].edu501Id)!==-1){
            choosendPoint.splice(i,1);
            i--;
        }
    }
}

//预备添加任务点
function wantAddPoint(){
    rebackPointInfo();
    $("#addPointModal").find(".moadalTitle").html("新增教学任务点");
    $('#addPointModal').find(".modal-body").find("input").attr("disabled", false) // 将input元素设置为readonly
    $.hideModal("#localPointInfoModal",false);
    $.showModal("#addPointModal",true);
    //确认按钮绑定事件
    $('.confirmaddPointBtn').unbind('click');
    $('.confirmaddPointBtn').bind('click', function(e) {
        confirmaddPoint();
        e.stopPropagation();
    });
}

//确认添加任务点
function confirmaddPoint(){
    var newSiteInfo=getnewPointInfo();
    if(typeof newSiteInfo ==='undefined'){
        toastr.warning('请检查必填项');
        return;
    }
    sendNewPointInfo(newSiteInfo);
}

//发送添加教学点请求
function sendNewPointInfo(newSiteInfo){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/addLocalPointInfo",
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
                newSiteInfo.edu501Id=backjson.data;
                $('#pointInfoTable').bootstrapTable("prepend", newSiteInfo);
                toolTipUp(".myTooltip");
                toastr.success(backjson.msg);
                $.hideModal("#addPointModal",false);
                $.showModal("#localPointInfoModal",true);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//获得新增任务点的信息
function getnewPointInfo(){
    var pointName= $("#addPointName").val();
    var capacity= $("#addCapacity").val();
    var remarks = $("#addPointRemarks").val();

    var returnObject = new Object();
    if(pointName == "" || capacity == 0) {
        return undefined;
    }


    returnObject.edu500Id=edu500Id;
    returnObject.pointName=pointName;
    returnObject.capacity=capacity;
    returnObject.remarks=remarks;

    return returnObject;
}

//重置新增任务点信息模态框
function rebackPointInfo(){
    var reObject = new Object();
    reObject.InputIds = "#addPointName,#addCapacity,#addPointRemarks";
    $("#addCapacity").val(0);
    reReloadSearchsWithSelect(reObject);
}

//开始检索任务点
function startSearchPoint(){
    var searchObject = getPointSearchValue();
    if(searchObject.pointName===""||typeof searchObject.pointName==="undefined"){
        toastr.warning('名称不能为空');
        return;
    }

    searchPointBy(searchObject);
}

//获得任务点检索区域的值
function getPointSearchValue(){
    var pointName= $("#pointName").val();

    var returnObject = new Object();
    if(pointName!==""){
        returnObject.pointName = pointName;
    }

    returnObject.edu500Id = edu500Id;
    return returnObject;
}

//按条件检索教学任务点
function searchPointBy(searchObject){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchPointInfo",
        data: {
            "SearchCriteria":JSON.stringify(searchObject),
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
                stuffPointInfoTable(backjson.data);
            } else {
                drawPointInfoTableEmptyTable();
                toastr.warning(backjson.msg);
            }
        }
    });
}

//重置教学点信息模态框
function reBackPonitInfoSearch(){
    var reObject = new Object();
    reObject.InputIds = "#pointName";
    reReloadSearchsWithSelect(reObject);
    var returnObject = new Object();
    returnObject.pointName = '';
    returnObject.edu500Id = edu500Id;
    searchPointBy(returnObject);
}

//教学任务点模态框绑定事件
function pointBtnBind(){
    //提示框取消按钮
    $('.specialCanle').unbind('click');
    $('.specialCanle').bind('click', function(e) {
        $.hideModal("#addPointModal",false);
        $.showModal("#localPointInfoModal",true);
        e.stopPropagation();
    });

    //开始检索
    $('#startSearchPoint').unbind('click');
    $('#startSearchPoint').bind('click', function(e) {
        startSearchPoint();
        e.stopPropagation();
    });

    //新增教学点
    $('#addPoint').unbind('click');
    $('#addPoint').bind('click', function(e) {
        wantAddPoint();
        e.stopPropagation();
    });

    //重置教学点任务点
    $('#researchPoint').unbind('click');
    $('#researchPoint').bind('click', function(e) {
        reBackPonitInfoSearch();
        e.stopPropagation();
    });

    //批量删除教学点
    $('#removePoint').unbind('click');
    $('#removePoint').bind('click', function(e) {
        removePoints();
        e.stopPropagation();
    });

}

/*
* 教学任务点page end
* */
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

    //教学点详情合并导出
    $('#wantLoadDetails').unbind('click');
    $('#wantLoadDetails').bind('click', function(e) {
        wantLoadDetails();
        e.stopPropagation();
    });

    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchSites();
        e.stopPropagation();
    });
}
/*
* 教学点page
*
* */
var EJDMElementInfo;

$(function() {
    judgementPWDisModifyFromImplements();
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
            '<li id="pointDetail" class="pointBtn"><span><img src="img/culturePlanapproval.png" style="width:24px"></span>教学任务点信息</li>' +
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
            stuffPointInfoTable(backjson.data);
            $.showModal("#localPointInfoModal",true);
            $("#localPointInfoModal").find(".moadalTitle").html(localName+" -教学任务点信息");
            if(backjson.data.length==0){
                toastr.warning(localName+' -暂无教学任务点');
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
    $.showModal("#addPointModal",false);

    $("#addPointModal").find(".moadalTitle").html(row.pointName+"-详细信息");
    $('#addPointModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    stuffPointDetails(row);
}

//填充教学点信息
function stuffPointDetails(row){
    $("#addPointName").val(row.pointName);
    $("#addCapacity").val(row.capacity);
    $("#addPointRemarks").val(row.remarks);
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



    //重置教学点任务点
    $('#researchPoint').unbind('click');
    $('#researchPoint').bind('click', function(e) {
        reBackPonitInfoSearch();
        var returnObject = new Object();
        returnObject.pointName = '';
        returnObject.edu500Id = edu500Id;
        searchPointBy(returnObject);
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
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

/*
* localAssets Page
* */
//填充空的教学点表
function drawlocalInfoTableEmptyTable() {
    stufflocalInfoTable({});
}

//渲染教学点表
function stufflocalInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #localInfoDetails': function(e, value, row, index) {
            getAssetsInfo(row.edu500Id);
        },
        'click #pointDetail': function(e, value, row, index) {
            pointDetail(row);
        }
    };

    $('#localAssetsTable').bootstrapTable('destroy').bootstrapTable({
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
            '<li id="localInfoDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>物资详情</li>' +
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

//跳转教学任务点
function pointDetail(row){
    edu500Id=row.edu500Id;

    var reObject = new Object();
    reObject.InputIds = "#pointName";
    reReloadSearchsWithSelect(reObject);

    localPointBtnBind();
    getPointBy(new Object(),row.localName);
}

//渲染详情
function stuffDeatils(info){
    $(".AssetsDetailsArea").empty();
    let midStr = "";
    let startStr = '<div class="historyArea" style="margin-bottom: 10px;"><div>';
    let endStr = '</div></div>';
    for (let i of info) {
        midStr += '<span><cite>'+i.assetsName+": "+'</cite><b>'+i.assetsNum+'</b></span>'
    }
    $(".AssetsDetailsArea").append(startStr+midStr+endStr);
}

//获取教学点固定资产信息
function getAssetsInfo(edu500Id){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getLocalAssets",
        data: {
            "edu500Id":edu500Id
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
            if(backjson.code === 200) {
                stuffDeatils(backjson.data);
                $.showModal("#AssetsDetailsModal",false);
                $("#AssetsDetailsModal").find(".moadalTitle").html("固定资产详情");
            } else {
                toastr.warning(backjson.msg)
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
    var townShip= $("#townShip").val();
    var city = getNormalSelectText("city");
    var cityCode = getNormalSelectValue("city");

    var returnObject = new Object();
    if(localName!==""){
        returnObject.localName = localName;
    }

    if(country!==""){
        returnObject.country = country;
    }

    if(townShip!==""){
        returnObject.townShip = townShip;
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
    reObject.InputIds = "#localName,#country,#townShip";
    reObject.normalSelectIds = "#city";
    reReloadSearchsWithSelect(reObject);
    searchAllSiteBy(new Object);
}

/*
* localAssets Page end
* */

/*
* localPoint Page
* */
var edu500Id;
//按条件检索教学点
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
            if (backjson.code == 200) {
                stuffPointInfoTable(backjson.data);
                $.showModal("#localPointInfoModal",true);
                $("#localPointInfoModal").find(".moadalTitle").html(localName+"-教学任务点信息");
            } else {
                toastr.warning(backjson.msg);
                drawPointInfoTableEmptyTable();
            }
        }
    });
}

//填充空的教学任务点表
function drawPointInfoTableEmptyTable() {
    stuffPointInfoTable({});
}

//渲染教学点表
function stuffPointInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #localAssetsDetails': function(e, value, row, index) {
            getAssetsDetails(row.edu501Id,row.pointName);
        },
        'click #modifyAssets': function(e, value, row, index) {
            modifyPointAssets(row,index);
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
        onPageChange: function() {
            drawPagination(".pointInfoTableArea", "教学任务点信息");
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
        },
        columns: [
            {     field: 'edu501Id',
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
                visible: false,
                formatter: paramsMatter,
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
            '<li id="localAssetsDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>物资详情</li>' +
            '<li id="modifyAssets" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>更新物资数量</li>' +
            '</ul>'
        ]
            .join('');
    }

    drawPagination(".pointInfoTableArea", "教学任务点信息");
    drawSearchInput(".pointInfoTableArea");
    changeTableNoRsTip();
    changeColumnsStyle(".pointInfoTableArea", "教学任务点信息");
    toolTipUp(".myTooltip");
}

//获取教学点固定资产信息
function getAssetsDetails(edu501Id,pointName){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getLocalPoingAssets",
        data: {
            "edu501Id":edu501Id
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
            if(backjson.code === 200) {
                stuffAssetsDeatils(backjson.data);
                $.showModal("#pointAssetsDetailsModal",false);
                $.hideModal("#localPointInfoModal",false);
                $("#pointAssetsDetailsModal").find(".moadalTitle").html(pointName+" 固定资产详情");
            } else {
                toastr.warning(backjson.msg)
            }
        }
    });
}

//渲染详情
function stuffAssetsDeatils(info){
    $(".pointAssetsDetailsArea").empty();
    let midStr = "";
    let startStr = '<div class="historyArea" style="margin-bottom: 10px;"><div>';
    let endStr = '</div></div>';
    for (let i of info) {
        midStr += '<span><cite>'+i.assetsName+": "+'</cite><b>'+i.assetsNum+'</b></span>'
    }
    $(".pointAssetsDetailsArea").append(startStr+midStr+endStr);
}

//预备修改教学点物资信息
function modifyPointAssets(row,index){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/queryEdu000",
        data: {
            "ejdmglzd":"gdzclx"
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
            stuffoldAssestInfo(row.edu501Id);
        },
        success : function(backjson) {
            hideloding();
            stuffChangeAssets(backjson);
            $.showModal("#changeAssetsModal",true);
            $.hideModal("#localPointInfoModal",false);
            $("#changeAssetsModal").find(".moadalTitle").html(row.pointName+"修改物资信息");
            //确认按钮绑定事件
            $('.confirmChangeAssetsBtn').unbind('click');
            $('.confirmChangeAssetsBtn').bind('click', function(e) {
                let assetsDetails = getPointAssetsDetails(row);
                saveAssets(assetsDetails);
                e.stopPropagation();
            });
        }
    });
}

function stuffoldAssestInfo(edu501Id){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/getLocalPoingAssets",
        data: {
            "edu501Id":edu501Id
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
            if(backjson.code === 200) {
                var allAssetsInput=$('.assetsClass').find('[type="number"]');
                for (let i = 0; i <allAssetsInput.length; i++) {
                    for (let d = 0; d <backjson.data.length; d++) {
                        if(allAssetsInput[i].id===backjson.data[d].assetsType&&backjson.data[d].assetsType!=null){
                            $("#"+allAssetsInput[i].id).val(backjson.data[d].assetsNum);
                        }
                    }
                }
            } else {
                toastr.warning(backjson.msg)
            }
        }
    });
}

//获取教学点固定资产信息
function saveAssets(assetsDetails){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/saveAssets",
        data: {
            "assetsDetails":JSON.stringify(assetsDetails)
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
            if(backjson.code === 200) {
                $.showModal("#localPointInfoModal",true);
                $.hideModal("#changeAssetsModal",false);
                toastr.success(backjson.msg)
            } else {
                toastr.warning(backjson.msg)
            }
        }
    });
}

//获取修改信息
function getPointAssetsDetails(row) {
    var allAssetsLabel=$('.assetsClass').find('label');
    var allAssetsInput=$('.assetsClass').find('[type="number"]');

    var assetsList = new Array();

    for (let i = 0; i <allAssetsLabel.length; i++) {
        let object = new Object();
        object.assetsName = allAssetsLabel[i].innerText;
        object.assetsNum = allAssetsInput[i].value;
        object.assetsType = allAssetsInput[i].id;
        object.Edu500_ID = edu500Id;
        object.edu501Id = row.edu501Id;
        assetsList.push(object);
    }

    return assetsList;
}

//渲染修改物资
function stuffChangeAssets(info){
    $("#changeAssetsArea").empty();
    let midStr = "";
    for (let i of info) {
        let t = 0;
        midStr += '<div class="col4 giveBottom assetsClass">' +
            '                <ul class="forminfo">' +
            '                    <div class="MyspinnerStyle">' +
            '                        <label class="selectName ">'+i.ejdmz+'</label> <input' +
            '                            type="number" value="0" min="0" step="1" data-decimals="0"' +
            '                            id="'+i.ejdm+'" />' +
            '                    </div>' +
            '                </ul>' +
            '            </div>'
    }
    $("#changeAssetsArea").append(midStr);
    $("input[type='number']").inputSpinner();
}

//开始检索任务点
function startSearchPoint(){
    var searchObject = getPointSearchValue();
    searchAllPointBy(searchObject);
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

//按条件检索任务点
function searchAllPointBy(searchObject){
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

//重置任务点信息模态框
function reBackPonitInfoSearch(){
    var reObject = new Object();
    reObject.InputIds = "#pointName";
    reReloadSearchsWithSelect(reObject);
    var returnObject = new Object();
    returnObject.pointName = '';
    returnObject.edu500Id = edu500Id;
    searchAllPointBy(returnObject);
}

//教学任务点按钮事件绑定
function localPointBtnBind(){
    //提示框取消按钮1
    $('.specialCanle1').unbind('click');
    $('.specialCanle1').bind('click', function(e) {
        $.showModal("#localPointInfoModal",true);
        $.hideModal("#pointAssetsDetailsModal",false);
        e.stopPropagation();
    });

    //提示框取消按钮2
    $('.specialCanle2').unbind('click');
    $('.specialCanle2').bind('click', function(e) {
        $.showModal("#localPointInfoModal",true);
        $.hideModal("#changeAssetsModal",false);
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
        e.stopPropagation();
    });
}
/*
* localPoint Page end
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

    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchSites();
        e.stopPropagation();
    });
}
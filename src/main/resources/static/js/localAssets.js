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
    parent.rightFrame.location.href="localPointAssets.html?edu500Id="+row.edu500Id;
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
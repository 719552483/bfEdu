var EJDMElementInfo;
var edu500Id;
var assetsTotal;

$(function() {
    EJDMElementInfo=queryEJDMElementInfo();
    $('.isSowIndex').selectMania(); //初始化下拉框
    // $("input[type='number']").inputSpinner();
    edu500Id = getQueryVariable("edu500Id");
    drawlocalInfoTableEmptyTable();
    queryAssetsType();
    binBind();
    stuffEJDElement(EJDMElementInfo);
    searchAllSiteBy(new Object());
});

//获取url传递过来的参数
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}


//填充空的教学任务点表
function drawlocalInfoTableEmptyTable() {
    stufflocalInfoTable({});
}

//渲染教学点表
function stufflocalInfoTable(tableInfo) {
    window.releaseNewsEvents = {
        'click #localInfoDetails': function(e, value, row, index) {
            getAssetsInfo(row.edu501Id);
        },
        'click #modifySite': function(e, value, row, index) {
            modifySite(row,index);
        }
    };

    $('#localPointAssestTable').bootstrapTable('destroy').bootstrapTable({
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
            '<li id="localInfoDetails" class="queryBtn"><span><img src="img/info.png" style="width:24px"></span>物资详情</li>' +
            '<li id="modifySite" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>更新物资数量</li>' +
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

//获取教学点固定资产信息
function queryAssetsType(edu501Id){
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
        },
        success : function(backjson) {
            hideloding();
            assetsTotal = backjson;
        }
    });
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


//获取教学点固定资产信息
function getAssetsInfo(edu501Id){
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
                stuffDeatils(backjson.data);
                $.showModal("#AssetsDetailsModal",false);
                $("#AssetsDetailsModal").find(".moadalTitle").html("固定资产详情");
            } else {
                toastr.warning(backjson.msg)
            }
        }
    });
}

//预备修改物资信息
function modifySite(row,index){
    stuffChangeAssets(assetsTotal);
    $.showModal("#changeAssetsModal",true);
    //确认按钮绑定事件
    $('.confirmaddSiteBtn').unbind('click');
    $('.confirmaddSiteBtn').bind('click', function(e) {
        let assetsDetails = getAssetsDetails(row);
        saveAssets(assetsDetails);
        e.stopPropagation();
    });
}

function getAssetsDetails(row) {
    var allAssetsLabel=$('.assetsClass').find('label');
    var allAssetsInput=$('.assetsClass').find('input');

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
                $.hideModal("#changeAssetsModal");
                toastr.success(backjson.msg)
            } else {
                toastr.warning(backjson.msg)
            }
        }
    });
}

//展示教学点详情
function localInfoDetails(row,index){
    $.showModal("#addSiteModal",false);
    $("#addSiteModal").find(".moadalTitle").html(row.pointName+"-详细信息");
    $('#addSiteModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    rebackSiteInfo();
    stufflocalInfoDetails(row);
}

//重置教学点信息模态框
function rebackSiteInfo(){
    var reObject = new Object();
    reObject.InputIds = "#addPointName,#addCapacity,#addRemarks";
    reReloadSearchsWithSelect(reObject);
}


//开始检索教学点
function startSearch(){
    var searchObject = getSearchValue();
    searchAllSiteBy(searchObject);
}

//获得检索区域的值
function getSearchValue(){
    var pointName= $("#pointName").val();

    var returnObject = new Object();
    if(pointName!==""){
        returnObject.pointName = pointName;
    }

    return returnObject;
}

//按条件检索教学点
function searchAllSiteBy(searchObject){
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
    reObject.InputIds = "#pointName";
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

    //返回
    $('#goBack').unbind('click');
    $('#goBack').bind('click', function(e) {
        // parent.rightFrame.location.href="localInfo.html";
        window.history.back()
        e.stopPropagation();
    });


    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchSites();
        e.stopPropagation();
    });
}
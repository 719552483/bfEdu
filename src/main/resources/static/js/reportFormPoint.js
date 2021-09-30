var EJDMElementInfo;
$(function() {
    judgementPWDisModifyFromImplements();
    EJDMElementInfo=queryEJDMElementInfo();
    getYearInfo();
    $('.isSowIndex').selectMania(); //初始化下拉框
    binBind();
    stuffEJDElement(EJDMElementInfo);
    getReportFormPointInfo();
});

//获取学年信息
function getYearInfo(){
    $.ajax({
        method : 'get',
        cache : false,
        url : "/searchAllXn",
        dataType : 'json',
        success : function(backjson) {
            if (backjson.code === 200) {
                stuffYearSelect(backjson.data);
            } else {
                toastr.warning(backjson.msg);
            }
        }
    });
}

//填充学年下拉框
function stuffYearSelect(yearInfo){
    var str = '<option value="seleceConfigTip">请选择</option>';
    for (var i = 0; i < yearInfo.length; i++) {
        str += '<option value="' + yearInfo[i].edu400_ID + '">' + yearInfo[i].xnmc
            + '</option>';
    }
    stuffManiaSelect("#xn", str);
}

//获取教学点报表数据
function getReportFormPointInfo(){
    var searchValue=getSearchValue();
    $.ajax({
        method : 'get',
        cache : false,
        url : "/pointReportData",
        data: {
            "SearchCriteria":JSON.stringify(searchValue)
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
                drawReportFormPointTable(backjson.data);
            } else {
                toastr.warning(backjson.msg);
                drawReportFormPointTable({});
            }
        }
    });
}

//渲染教学点报表数据
function drawReportFormPointTable(tableInfo){
    var tableInfo=tableInfo;

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
            fileName: getNormalSelectText("xn")+'教学点报表导出'  //文件名称
        },
        striped: true,
        sidePagination: "client",
        toolbar: '#toolbar',
        showColumns: true,
        onPageChange: function() {
            drawPagination(".localInfoTableAreawithNoAction", "教学点信息");

            var currentPage=$('#localInfoTable').bootstrapTable('getData',{'useCurrentPage':true});
            var rowsObject=new Object();
            rowsObject.rows=currentPage;
            mergeRowCells(rowsObject, "localName", $("#localInfoTable"),tableInfo);
        },
        onPostBody: function() {
            toolTipUp(".myTooltip");
            var currentPage=$('#localInfoTable').bootstrapTable('getData',{'useCurrentPage':true});
            var rowsObject=new Object();
            rowsObject.rows=currentPage;
            mergeRowCells(rowsObject, "localName", $("#localInfoTable"),tableInfo);
            $('.verticalAlignCell').css('vertical-align', 'middle');
        },
        columns: [
           {
                field: 'localName',
                class: 'verticalAlignCell',
                title: '教学点名称',
                align: 'center',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'city',
                title: '地级市',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'country',
                title: '区/县',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'localAddress',
                title: '详细地址',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'pointCount',
                title: '任务点个数',
                align: 'left',
                sortable: true,
                formatter: pointCountMatter
            },
            {
                field: 'remarks',
                title: '教学点备注',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'pointName',
                title: '教学任务点信息',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'capacity',
                title: '可容纳人数',
                align: 'left',
                sortable: true,
                formatter: capacityMatter
            },
            {
                field: 'remarks',
                title: '教学任务点备注',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'edu502List',
                title: '物资详情',
                align: 'left',
                sortable: true,
                formatter: edu502ListMatter
            },
            {
                field: 'xn',
                title: '学年',
                align: 'left',
                sortable: true,
                formatter: paramsMatter
            },
            {
                field: 'countUsed',
                title: '总排课数',
                align: 'left',
                sortable: true,
                formatter: PkMatter
            },
            {
                field: 'complete',
                title: '已完成课节数',
                align: 'left',
                sortable: true,
                formatter: PkMatter
            },
            {
                field: 'unfinished',
                title: '未完成课节数',
                align: 'left',
                sortable: true,
                formatter: PkMatter
            }
        ]
    });

    function edu502ListMatter(value, row, index){
        if(value.length>0){
            var str='';
            var strMyTooltip='';
            for (var i = 0; i < value.length; i++) {
                if(i<(value.length-1)){
                    str+=value[i].assetsName+':'+value[i].assetsNum+'<br/>';
                    strMyTooltip+=value[i].assetsName+':'+value[i].assetsNum+'&#10;';
                }else {
                    str+=value[i].assetsName+':'+value[i].assetsNum;
                    strMyTooltip+=value[i].assetsName+':'+value[i].assetsNum;
                }
            }
            return [ '<div class="myTooltip noTextIndent" title="'+strMyTooltip+'">'+str+'</div>' ]
                .join('');
        }else{
            return [ '<div class="myTooltip normalTxt" title="暂无">暂无</div>' ]
                .join('');
        }
    }

    function pointCountMatter(value, row, index){
        return [ '<div class="myTooltip" title="'+value+'个">'+value+'个</div>' ]
            .join('');
    }

    function capacityMatter(value, row, index){
        return [ '<div class="myTooltip" title="'+value+'人">'+value+'人</div>' ]
            .join('');
    }

    function PkMatter(value, row, index){
        return [ '<div class="myTooltip" title="'+value+'节">'+value+'节</div>' ]
            .join('');
    }

    drawPagination(".localInfoTableAreawithNoAction", "教学点信息");
    drawSearchInput(".localInfoTableAreawithNoAction");
    changeTableNoRsTip();
    changeColumnsStyle(".localInfoTableAreawithNoAction", "教学点信息");
    toolTipUp(".myTooltip");

    var rowsObject=new Object();
    rowsObject.rows=tableInfo;
    mergeRowCells(rowsObject, "localName", $("#localInfoTable"),tableInfo);
}

//获得检索区域的值
function getSearchValue(){
    var city = getNormalSelectText("city");
    var cityCode = getNormalSelectValue("city");
    var country= $("#country").val();
    var localName= $("#localName").val();
    var xn = getNormalSelectValue("xn");

    var returnObject = new Object();
    returnObject.city = city;
    returnObject.cityCode = cityCode;
    returnObject.country = country;
    returnObject.localName = localName;
    returnObject.xn = xn;

    return returnObject;
}

// //教学点详情合并导出
// function wantLoadDetails(){
//     $.showModal("#loadDetailsModal",true);
//     stuffMultipleDefault();
//
//     $('.confirmLoadDetails').unbind('click');
//     $('.confirmLoadDetails').bind('click', function(e) {
//         exportFile();
//         e.stopPropagation();
//     });
// }

// var haveToCheck=['教学点名称','地级市','区/县','教学任务点名称'];
// //渲染多选下拉默认选择隐藏
// function stuffMultipleDefault(){
//     var reObject = new Object();
//     reObject.normalSelectIds = "#cityForLoad";
//     reReloadSearchsWithSelect(reObject);
//
//     $("#exportThings").multiSelect();
//     $(".exportThingsArea").find(".multi-select-container").find("span").html('教学点名称, 地级市, 区/县, 教学任务点名称');
//
//     var jsSelect=$(".exportThingsArea").find(".multi-select-menuitems").find("input");
//     for (var i = 0; i < jsSelect.length; i++) {
//         var currentJs=jsSelect[i].attributes[2].nodeValue;
//         for (var h = 0; h < haveToCheck.length; h++) {
//             if(haveToCheck.indexOf(currentJs)!=-1){
//                 jsSelect[i].checked = "checked";
//                 $(".exportThingsArea").find(".multi-select-menuitems").find("label:eq("+i+")").hide();
//             }else{
//                 jsSelect[i].checked = "";
//                 $(".exportThingsArea").find(".multi-select-menuitems").find("label:eq("+i+")").show();
//             }
//         }
//     }
//     $("#exportThings").val(haveToCheck);
//     $(".loadDetailsModalRsTxtCite").html(haveToCheck.toString());
//
//     //监控选择  渲染提示文字
//     $('#exportThings').change(function(e){
//         $(".loadDetailsModalRsTxtCite").html($("#exportThings").val().toString());
//     });
// }
//
// //开始导出文件
// function exportFile(){
//     var sendObject=new Object();
//     sendObject.city=getNormalSelectValue("cityForLoad");
//     sendObject.item=$("#exportThings").val().toString();
//     $.ajax({
//         method : 'get',
//         cache : false,
//         url : "/exportPointByCityCheck",
//         data: {
//             "sendObject":JSON.stringify(sendObject)
//         },
//         dataType : 'json',
//         beforeSend: function(xhr) {
//             requestErrorbeforeSend();
//         },
//         error: function(textStatus) {
//             requestError();
//         },
//         complete: function(xhr, status) {
//             requestComplete();
//         },
//         success : function(backjson) {
//             hideloding();
//             if (backjson.code == 200) {
//                 $.hideModal();
//                 startLoadFile(sendObject);
//             } else {
//                 toastr.warning(backjson.msg);
//             }
//         }
//     });
// }

// //开始下载文件
// function startLoadFile(sendObject){
//     var url = "/exportPointByCity";
//     var form = $("<form></form>").attr("action", url).attr("method", "post");
//     form.append($("<input></input>").attr("type", "hidden").attr("name", "sendObject").attr("value",JSON.stringify(sendObject)));
//     form.appendTo('body').submit().remove();
// }

//重置检索
function researchSites(){
    var reObject = new Object();
    reObject.InputIds = "#country,#localName";
    reObject.normalSelectIds = "#city,#xn";
    reReloadSearchsWithSelect(reObject);
    getReportFormPointInfo();
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
        getReportFormPointInfo();
        e.stopPropagation();
    });

    // //教学点详情合并导出
    // $('#wantLoadDetails').unbind('click');
    // $('#wantLoadDetails').bind('click', function(e) {
    //     wantLoadDetails();
    //     e.stopPropagation();
    // });

    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchSites();
        e.stopPropagation();
    });
}
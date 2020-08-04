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
                stuffManiaSelect("#addPasternType", allDepartmentStr);
                stuffManiaSelect("#addManagementDepartment", allDepartmentStr);
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
        'click #SiteDetails': function(e, value, row, index) {
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
                checkbox: true
            },{
                field: 'edu500_ID',
                title: '唯一标识',
                align: 'center',
                visible: false
            },
            {
                field: 'jxdmc',
                title: '教学点名称',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'ssxq',
                title: '所属校区',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'pkzyxb',
                title: '排课占用系部',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'rnrs',
                title: '容纳人数',
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
                visible: false
            }, {
                field: 'lf',
                title: '楼房',
                align: 'left',
                formatter: paramsMatter
            },{
                field: 'lc',
                title: '楼层',
                align: 'left',
                formatter: paramsMatter
            }, {
                field: 'cdfzr',
                title: '场地负责人',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            }, {
                field: 'cdzt',
                title: '场地状态',
                align: 'left',
                formatter: paramsMatter,
                visible: false
            },
            {
                field: 'bz',
                title: '备注',
                align: 'left',
                formatter: paramsMatter,
                visible: false
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
            '<li id="modifySite" class="modifyBtn"><span><img src="images/t02.png" style="width:24px"></span>修改</li>' +
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

//单个删除教学点
function removeSite(row){
    $.showModal("#remindModal",true);
    $(".remindType").html('教学点- '+row.xm+' ');
    $(".remindActionType").html("删除");

    //确认删除学生
    $('.confirmRemind').unbind('click');
    $('.confirmRemind').bind('click', function(e) {
        var removeArray = new Array;
        removeArray.push(row.edu101_ID);
        sednRemoveInfo(removeArray);
        e.stopPropagation();
    });
}

//展示教学点详情
function localInfoDetails(row,index){
    $.showModal("#addSiteModal",false);
    $("#addSiteModal").find(".moadalTitle").html(row.xm+"-详细信息");
    $('#addSiteModal').find(".modal-body").find("input").attr("disabled", true) // 将input元素设置为readonly
    //清空模态框中元素原始值
    rebackSiteInfo();
    stufflocalInfoDetails(row);
}

//重置教学点信息模态框
function rebackSiteInfo(){
    var reObject = new Object();
    reObject.normalSelectIds = "#addTeacherSex,#addTeacherType,#addTeacherXb,#addTeacherZY,#addTeacherHf,#addTeacherMz,#addTeacherZc,#addTeacherWhcd,#addTeacherZzmm";
    reObject.InputIds = "#addTeachingPointName,#addTeacherCsrq,#addTeacherSfzh,#addTeacherDxsj,#addTeacherLxfs";
    reReloadSearchsWithSelect(reObject);
}

//填充教学点信息
function stufflocalInfoDetails(row){
    $("#addTeacherName").val(row.xm);
    stuffManiaSelectWithDeafult("#addTeacherSex", row.xb);
    stuffManiaSelectWithDeafult("#addTeacherType", row.jzglxbm);
    $("#addTeacherCsrq").val(row.csrq);
    $("#addTeacherSfzh").val(row.sfzh);
    stuffManiaSelectWithDeafult("#addTeacherXb", row.szxb);
    stuffManiaSelectWithDeafult("#addTeacherZY", row.zy);
    stuffManiaSelectWithDeafult("#addTeacherHf", row.hf);
    stuffManiaSelectWithDeafult("#addTeacherMz", row.mzbm);
    stuffManiaSelectWithDeafult("#addTeacherZc", row.zcbm);
    stuffManiaSelectWithDeafult("#addTeacherWhcd", row.whcdbm);
    $("#addTeacherDxsj").val(row.dxsj);
    stuffManiaSelectWithDeafult("#addTeacherZzmm", row.zzmmbm);
    $("#addTeacherLxfs").val(row.lxfs);
}

//预备修改教学点
function modifySite(row,index){
    $.showModal("#addTeacherModal",true);
    $("#addTeacherModal").find(".moadalTitle").html("修改教职工-"+row.xm);
    $('#addTeacherModal').find(".modal-body").find("input").attr("disabled", false) // 将input元素设置为readonly
    //清空模态框中元素原始值
    rebackTeacherInfo();
    stufflocalInfoDetails(row);
    //确认按钮绑定事件
    $('.confirmaddTeacherBtn').unbind('click');
    $('.confirmaddTeacherBtn').bind('click', function(e) {
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
    $(".remindType").html(row.xm);
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
    modifylocalInfo.edu500_ID=row.edu500_ID;
    $.ajax({
        method : 'get',
        cache : false,
        url : "/modifyTeacher",
        data: {
            "modifyInfo":JSON.stringify(modifylocalInfo)
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
            if (backjson.result) {
                hideloding();
                if (backjson.IDcardIshave) {
                    toastr.warning('身份证号码已存在');
                    return;
                }
                $("#teacherBaseInfoTable").bootstrapTable('updateByUniqueId', {
                    id: modifylocalInfo.edu500_ID,
                    row: modifylocalInfo
                });
                $(".myTooltip").tooltipify();
                toastr.success('修改成功');
                $.hideModal("#remindModal");
            } else {
                toastr.warning('操作失败，请重试');
            }
        }
    });
}

//获得新增教学点的信息
function getnewlocalInfo(){
    var xb = getNormalSelectValue("addTeacherSex");
    var jzglxbm = getNormalSelectValue("addTeacherType");
    var jzglx = getNormalSelectText("addTeacherType");
    var szxb = getNormalSelectValue("addTeacherXb");
    var szxbmc = getNormalSelectText("addTeacherXb");
    var zy = getNormalSelectValue("addTeacherZY");
    var zymc = getNormalSelectText("addTeacherZY");
    var hf= getNormalSelectValue("addTeacherHf");
    var mzbm = getNormalSelectValue("addTeacherMz");
    var mz = getNormalSelectText("addTeacherMz");
    var zcbm = getNormalSelectValue("addTeacherZc");
    var zc = getNormalSelectText("addTeacherZc");
    var whcdbm = getNormalSelectValue("addTeacherWhcd");
    var whcd = getNormalSelectText("addTeacherWhcd");
    var zzmmbm = getNormalSelectValue("addTeacherZzmm");
    var zzmm = getNormalSelectText("addTeacherZzmm");
    var xm=$("#addTeacherName").val();
    var csrq=$("#addTeacherCsrq").val();
    var sfzh=$("#addTeacherSfzh").val();
    var dxsj=$("#addTeacherDxsj").val();
    var lxfs=$("#addTeacherLxfs").val();

    if(xm===""){
        toastr.warning('姓名不能为空');
        return;
    }

    if(xb===""){
        toastr.warning('性别不能为空');
        return;
    }

    if(jzglxbm===""){
        toastr.warning('教职工类型不能为空');
        return;
    }

    if(csrq===""){
        toastr.warning('出生日期不能为空');
        return;
    }

    var returnObject = new Object();
    returnObject.xb=xb;
    returnObject.jzglx=jzglx;
    returnObject.jzglxbm=jzglxbm;
    returnObject.szxb=szxb;
    returnObject.szxbmc=szxbmc;
    returnObject.zy=zy;
    returnObject.zymc=zymc;
    returnObject.hf=hf;
    returnObject.mzbm=mzbm;
    returnObject.mz=mz;
    returnObject.zcbm=zcbm;
    returnObject.zc=zc;
    returnObject.whcdbm=whcdbm;
    returnObject.whcd=whcd;
    returnObject.zzmmbm=zzmmbm;
    returnObject.zzmm=zzmm;
    returnObject.xm=xm;
    returnObject.csrq=csrq;
    returnObject.sfzh=sfzh;
    returnObject.dxsj=dxsj;
    returnObject.lxfs=lxfs;
    returnObject.nl=nl;
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
        return;
    }
    sendNewTeacherInfo(newSiteInfo);
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
    $('#removeTeachers').unbind('click');
    $('#removeTeachers').bind('click', function(e) {
        removeTeachers();
        e.stopPropagation();
    });

    //下载教师文件
    $('#loadTeacherInfoModel').unbind('click');
    $('#loadTeacherInfoModel').bind('click', function(e) {
        loadTeacherInfoModel();
        e.stopPropagation();
    });

    //检验修改教师文件
    $('#checkModifyTeachersFile').unbind('click');
    $('#checkModifyTeachersFile').bind('click', function(e) {
        checkModifyTeachersFile();
        e.stopPropagation();
    });


    //重置检索
    $('#researchSites').unbind('click');
    $('#researchSites').bind('click', function(e) {
        researchTeachers();
        e.stopPropagation();
    });
}
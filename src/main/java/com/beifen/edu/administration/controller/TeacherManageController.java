package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.TeacherManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

//教职工管理控制层
@Controller
public class TeacherManageController {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    TeacherManageService teacherManageService;


    @RequestMapping("searchTeachersInService")
    @ResponseBody
    public ResultVO searchTeachersInService(@RequestParam("searchInfo") String searchInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.fromObject(searchInfo);
        Edu101 edu101 = (Edu101) JSONObject.toBean(jsonObject, Edu101.class);
        result = teacherManageService.searchTeachersInService(edu101);
        return result;
    }

    @RequestMapping("addTeacherBusiness")
    @ResponseBody
    public ResultVO addTeacherBusiness(@RequestParam("businessInfo") String businessInfo, @RequestParam("approvalInfo") String approvalInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject edu112Json = JSONObject.fromObject(businessInfo);
        Edu112 edu112 = (Edu112) JSONObject.toBean(edu112Json, Edu112.class);
        JSONObject edu600Json = JSONObject.fromObject(approvalInfo);
        Edu600 edu600 = (Edu600) JSONObject.toBean(edu600Json, Edu600.class);
        result = teacherManageService.addTeacherBusiness(edu112, edu600);
        return result;
    }


}

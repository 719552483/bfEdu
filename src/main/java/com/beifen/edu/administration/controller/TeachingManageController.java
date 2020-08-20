package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSONObject;
import com.beifen.edu.administration.PO.TimeTablePO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.TeachingManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

//教务管理控制层
@Controller
public class TeachingManageController {

    @Autowired
    TeachingManageService teachingManageService;



    /**
     * 搜索在职教师
     * @param searchInfo
     * @return
     */
    @RequestMapping("searchTeachersInService")
    @ResponseBody
    public ResultVO searchTeachersInService(@RequestParam("searchInfo") String searchInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.parseObject(searchInfo);
        Edu101 edu101 = JSONObject.toJavaObject(jsonObject, Edu101.class);
        result = teachingManageService.searchTeachersInService(edu101);
        return result;
    }

    /**
     * 教师出差申请
     * @param businessInfo
     * @param approvalInfo
     * @return
     */
    @RequestMapping("addTeacherBusiness")
    @ResponseBody
    public ResultVO addTeacherBusiness(@RequestParam("businessInfo") String businessInfo, @RequestParam("approvalInfo") String approvalInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject edu112Json = JSONObject.parseObject(businessInfo);
        Edu112 edu112 = JSONObject.toJavaObject(edu112Json, Edu112.class);
        JSONObject edu600Json = JSONObject.parseObject(approvalInfo);
        Edu600 edu600 = JSONObject.toJavaObject(edu600Json, Edu600.class);
        result = teachingManageService.addTeacherBusiness(edu112, edu600);
        return result;
    }

    /**
     * 删除出差申请
     * @param removeKeys
     * @return
     */
    @RequestMapping("removeTeacherBusiness")
    @ResponseBody
    public ResultVO removeTeacherBusiness(@RequestParam("removeKeys") String removeKeys) {
        ResultVO result;
        List<String>  removeKeyList= JSONObject.parseArray(removeKeys, String.class);
        result = teachingManageService.removeTeacherBusiness(removeKeyList);
        return result;
    }

    /**
     * 出差申请查询
     * @param searchInfo
     * @return
     */
    @RequestMapping("searchTeacherBusiness")
    @ResponseBody
    public ResultVO searchTeacherBusiness(@RequestParam("searchInfo") String searchInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject edu112Json = JSONObject.parseObject(searchInfo);
        Edu112 edu112 = JSONObject.toJavaObject(edu112Json, Edu112.class);
        result = teachingManageService.searchTeacherBusiness(edu112);
        return result;
    }

    /**
     * 教师课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/getScheduleInfo")
    @ResponseBody
    public ResultVO getScheduleInfo(@RequestParam("searchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.parseObject(searchObject);
        TimeTablePO timeTable = JSONObject.toJavaObject(jsonObject, TimeTablePO.class);
        result = teachingManageService.getScheduleInfo(timeTable);
        return result;
    }

    /**
     * 教师课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/getStudentScheduleInfo")
    @ResponseBody
    public ResultVO getStudentScheduleInfo(@RequestParam("searchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.parseObject(searchObject);
        TimeTablePO timeTable = JSONObject.toJavaObject(jsonObject, TimeTablePO.class);
        result = teachingManageService.getStudentScheduleInfo(timeTable);
        return result;
    }

}

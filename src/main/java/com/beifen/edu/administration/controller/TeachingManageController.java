package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.TeachingManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

//教务管理控制层
@Controller
public class TeachingManageController {

    @Autowired
    private TeachingManageService teachingManageService;



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
    @RequestMapping("/getScheduleInfoNew")
    @ResponseBody
    public ResultVO getScheduleInfo(@RequestParam("searchObject") String searchObject,@RequestParam("userId") String userId,@RequestParam("jsId") String jsId) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
//        if(!"10800".equals(jsId)){
//            result = ResultVO.setFailed("您不是干事角色，无法修改课程");
//        }else{
            JSONObject jsonObject = JSONObject.parseObject(searchObject);
            TimeTablePO timeTable = JSONObject.toJavaObject(jsonObject, TimeTablePO.class);
            result = teachingManageService.getScheduleInfoNew(timeTable,userId,jsId);
//        }
        return result;
    }

    /**
     * 学生课程表查询
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

    /**
     * 课表详情查询
     * @param classId
     * @param courseType
     * @param edu_180Id
     * @return
     */
    @RequestMapping("/getScheduleInfoDetail")
    @ResponseBody
    public ResultVO getScheduleInfoDetail(@RequestParam("classId") String classId, @RequestParam("courseType") String courseType, @RequestParam("edu_180Id") String edu_180Id) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        result = teachingManageService.getScheduleInfoDetail(classId,courseType,edu_180Id);
        return result;
    }

    /**
     * 授课名单那查询
     * @param searchsObject
     * @return
     */
    @RequestMapping("/findStudentInTeaching")
    @ResponseBody
    public ResultVO findStudentInTeaching(@RequestParam("searchsObject") String searchsObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSON.parseObject(searchsObject);
        ClassStudentViewPO classStudent = JSON.toJavaObject(jsonObject, ClassStudentViewPO.class);
        result = teachingManageService.findStudentInTeaching(classStudent);
        return result;
    }


    /**
     * 可申请考试任务书查询
     * @param userId
     * @param searchCriteria
     * @return
     */
    @RequestMapping("/searchTaskCanTest")
    @ResponseBody
    public ResultVO searchTaskCanTest(@RequestParam("userId") String userId,@RequestParam("searchCriteria") String searchCriteria) {
        JSONObject jsonObject = JSON.parseObject(searchCriteria);
        TestTaskSearchPO testTaskSearchPO = JSON.toJavaObject(jsonObject, TestTaskSearchPO.class);
        ResultVO result = teachingManageService.searchTaskCanTest(userId,testTaskSearchPO);
        return result;
    }


    /**
     * 申请结课
     * @param tasks
     * @param approvalInfo
     * @return
     */
    @RequestMapping("/askForExam")
    @ResponseBody
    public ResultVO askForExam(@RequestParam("tasks") String tasks,@RequestParam("approvalInfo") String approvalInfo) {
        List<String> edu201IdList = JSON.parseArray(tasks, String.class);
        JSONObject jsonObject = JSON.parseObject(approvalInfo);
        Edu600 edu600 = JSON.toJavaObject(jsonObject, Edu600.class);
        ResultVO result = teachingManageService.askForExam(edu201IdList,edu600);
        return result;
    }

    /**
     * 班主任日志查询
     * @param searchCriteria
     * @return
     */
    @RequestMapping("/searchTeacherLog")
    @ResponseBody
    public ResultVO searchTeacherLog(@RequestParam("searchCriteria") String searchCriteria) {
        TeacherLogSerachPO teacherLogSerach = JSON.parseObject(searchCriteria, TeacherLogSerachPO.class);
        ResultVO result = teachingManageService.searchTeacherLog(teacherLogSerach);
        return result;
    }


    /**
     * 班主任日志保存
     * @param newLogInfo
     * @return
     */
    @RequestMapping("/teacherAddLog")
    @ResponseBody
    public ResultVO teacherAddLog(@RequestParam("newLogInfo") String newLogInfo) {
        Edu114 edu114 = JSON.parseObject(newLogInfo, Edu114.class);
        ResultVO result = teachingManageService.teacherAddLog(edu114);
        return result;
    }

    /**
     * 班主任日志删除
     * @param deleteIdArray
     * @return
     */
    @RequestMapping("/removeTeacherLog")
    @ResponseBody
    public ResultVO removeTeacherLog(@RequestParam("deleteIdArray") String deleteIdArray) {
        List<String> deleteIdList = JSON.parseArray(deleteIdArray, String.class);
        ResultVO result = teachingManageService.removeTeacherLog(deleteIdList);
        return result;
    }

    /**
     * 教师调课
     * @param changInfo
     * @return
     */
    @RequestMapping("/changeSchedule")
    @ResponseBody
    public ResultVO changeSchedule(@RequestParam("changInfo") String changInfo) {
        Edu203 edu203 = JSON.parseObject(changInfo, Edu203.class);
        ResultVO result = teachingManageService.changeScheduleOne(edu203);
        return result;
    }

    /**
     * 教师调课
     * @param changInfo
     * @return
     */
    @RequestMapping("/changeScheduleNew")
    @ResponseBody
    public ResultVO changeScheduleNew (@RequestParam("changInfo") String changInfo,//修改后对象信息
                                   @RequestParam("oldchangInfo") String oldchangInfo,//原对象信息 需要有Edu202_id和Edu101_id
                                   @RequestParam("type") String type//操作类型：（1.调一周的课程，2.调一天的课程，3.调某一节课程）
    ) {
        Edu203 edu203 = JSON.parseObject(changInfo, Edu203.class);
        Edu203 edu203old = JSON.parseObject(oldchangInfo, Edu203.class);
        ResultVO result = teachingManageService.changeSchedule(edu203,edu203old,type);
        return result;
    }

    /**
     * 老师检索分散学时课表
     * @param searchObject
     * @return
     */
    @RequestMapping("/searchScatteredClassByTeacher")
    @ResponseBody
    public ResultVO searchScatteredClassByTeacher(@RequestParam("searchObject") String searchObject) {
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        ResultVO result = teachingManageService.searchScatteredClassByTeacher(timeTablePO);
        return result;
    }

    /**
     * 学生检索分散学时课表
     * @param searchObject
     * @return
     */
    @RequestMapping("/searchScatteredClassByStudent")
    @ResponseBody
    public ResultVO searchScatteredClassByStudent(@RequestParam("searchObject") String searchObject) {
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        ResultVO result = teachingManageService.searchScatteredClassByStudent(timeTablePO);
        return result;
    }

    /**
     * 教师是保存分散学时授课信息
     * @param ScatteredClass
     * @return
     */
    @RequestMapping("/saveScatteredClass")
    @ResponseBody
    public ResultVO saveScatteredClass(@RequestParam("ScatteredClass") String ScatteredClass) {
        Edu207 edu207 = JSON.parseObject(ScatteredClass, Edu207.class);
        ResultVO result = teachingManageService.saveScatteredClass(edu207);
        return result;
    }

    /**
     * 教务课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/getSchedule")
    @ResponseBody
    public ResultVO getSchedule(@RequestParam("SearchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        SchedulePO schedulePO = JSON.parseObject(searchObject, SchedulePO.class);
        result = teachingManageService.getSchedule(schedulePO);
        return result;
    }

    /**
     * 教务课程表查询
     * @param yearId
     * @return
     */
    @RequestMapping("/getYearWeek")
    @ResponseBody
    public ResultVO getYearWeek(@RequestParam("yearId") String yearId) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        result = teachingManageService.getYearWeek(yearId);
        return result;
    }

    /**
     * 教师学年课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/getYearScheduleInfo")
    @ResponseBody
    public ResultVO getYearScheduleInfo(@RequestParam("searchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        result = teachingManageService.getYearScheduleInfo(timeTablePO);
        return result;
    }

    /**
     * 学生学年课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/getStudentYearScheduleInfo")
    @ResponseBody
    public ResultVO getStudentYearScheduleInfo(@RequestParam("searchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.parseObject(searchObject);
        TimeTablePO timeTable = JSONObject.toJavaObject(jsonObject, TimeTablePO.class);
        result = teachingManageService.getStudentYearScheduleInfo(timeTable);
        return result;
    }

    /**
     * 老师检索学年分散学时课表
     * @param searchObject
     * @return
     */
    @RequestMapping("/searchYearScatteredClassByTeacher")
    @ResponseBody
    public ResultVO searchYearScatteredClassByTeacher(@RequestParam("searchObject") String searchObject) {
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        ResultVO result = teachingManageService.searchYearScatteredClassByTeacher(timeTablePO);
        return result;
    }

    /**
     * 学生检索学年分散学时课表
     * @param searchObject
     * @return
     */
    @RequestMapping("/searchYearScatteredClassByStudent")
    @ResponseBody
    public ResultVO searchYearScatteredClassByStudent(@RequestParam("searchObject") String searchObject) {
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        ResultVO result = teachingManageService.searchYearScatteredClassByStudent(timeTablePO);
        return result;
    }

    /**
     * 教务查询教师学年课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/JwGetYearScheduleInfo")
    @ResponseBody
    public ResultVO JwGetYearScheduleInfo(@RequestParam("searchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        result = teachingManageService.JwGetYearScheduleInfo(timeTablePO);
        return result;
    }

    /**
     * 教务查询班级学年课程表查询
     * @param searchObject
     * @return
     */
    @RequestMapping("/JwGetYearScheduleInfoByClass")
    @ResponseBody
    public ResultVO JwGetYearScheduleInfoByClass(@RequestParam("searchObject") String searchObject) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        result = teachingManageService.JwGetYearScheduleInfoByClass(timeTablePO);
        return result;
    }

    /**
     * 教务检索学年分散学时课表
     * @param searchObject
     * @return
     */
    @RequestMapping("/JwSearchYearScatteredClassByTeacher")
    @ResponseBody
    public ResultVO JwSearchYearScatteredClassByTeacher(@RequestParam("searchObject") String searchObject) {
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        ResultVO result = teachingManageService.JwSearchYearScatteredClassByTeacher(timeTablePO);
        return result;
    }

    /**
     * 教务检索班级分散学时课表
     * @param searchObject
     * @return
     */
    @RequestMapping("/JwSearchYearScatteredClassByClass")
    @ResponseBody
    public ResultVO JwSearchYearScatteredClassByClass(@RequestParam("searchObject") String searchObject) {
        TimeTablePO timeTablePO = JSON.parseObject(searchObject, TimeTablePO.class);
        ResultVO result = teachingManageService.JwSearchYearScatteredClassByClass(timeTablePO);
        return result;
    }

    /**
     * 教务查询授课成果
     * @return
     */
    @RequestMapping("/searchCourseResult")
    @ResponseBody
    public ResultVO searchCourseResult(@RequestBody CourseResultPagePO courseResultPagePO) {
        ResultVO result = teachingManageService.searchCourseResult(courseResultPagePO);
        return result;
    }

    /**
     * 教务查询成绩详情
     * @return
     */
    @RequestMapping("/searchGradeInfo")
    @ResponseBody
    public ResultVO searchGradeInfo(@RequestParam("searchInfo") String searchInfo) {
        Edu005 edu005 = JSON.parseObject(searchInfo, Edu005.class);
        ResultVO result = teachingManageService.searchGradeInfo(edu005);
        return result;
    }

    /**
     * 教务查询成绩详情
     * @return
     */
    @RequestMapping("/searchAllXn")
    @ResponseBody
    public ResultVO searchAllXn() {
        ResultVO result = teachingManageService.searchAllXn();
        return result;
    }

    /**
     * 教务查询成绩详情
     * @return
     */
    @RequestMapping("/searchAttendanceDetail")
    @ResponseBody
    public ResultVO searchAttendanceDetail(@RequestParam("taskId") String taskId) {
        ResultVO result = teachingManageService.searchAttendanceDetail(taskId);
        return result;
    }

}

package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.TeachingManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

//教务管理控制层
@Controller
public class TeachingManageController {

    @Autowired
    private TeachingManageService teachingManageService;

    ReflectUtils utils = new ReflectUtils();

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
     * 教师确认成绩申请
     * @param businessInfo
     * @param approvalInfo
     * @return
     */
    @RequestMapping("addTeacherGetGrade")
    @ResponseBody
    public ResultVO addTeacherGetGrade(@RequestParam("businessInfo") String businessInfo, @RequestParam("approvalInfo") String approvalInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject edu115Json = JSONObject.parseObject(businessInfo);
        Edu115 edu115 = JSONObject.toJavaObject(edu115Json, Edu115.class);
        JSONObject edu600Json = JSONObject.parseObject(approvalInfo);
        Edu600 edu600 = JSONObject.toJavaObject(edu600Json, Edu600.class);
        result = teachingManageService.addTeacherGetGrade(edu115, edu600);
        return result;
    }





    /**
     * 修改补考成绩申请
     * @return
     */
    @RequestMapping("updateMakeUpGrade")
    @ResponseBody
    public ResultVO updateMakeUpGrade(@RequestParam(value = "SearchCriteria") String SearchCriteria) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.parseObject(SearchCriteria);
        Edu600 edu600 = JSON.parseObject(jsonObject.getString("approvalInfo"), Edu600.class);
        List<Edu0051> edu0051List = JSON.parseArray(jsonObject.getString("edu0051"),Edu0051.class);
//        List<net.sf.json.JSONObject> objectList = JSON.parseArray(SearchCriteria, net.sf.json.JSONObject.class);

        for(int i = 0;i<edu0051List.size();i++){
            Edu0051 edu0051 = edu0051List.get(i);
            result = teachingManageService.updateMakeUpGradeCheck(edu0051);
            if(result.getCode()!=200){
                return result;
            }
        }
        for(int i = 0;i<edu0051List.size();i++){
//            Edu600 edu600 = JSON.parseObject(objectList.get(i).getString("approvalInfo"), Edu600.class);
            Edu0051 edu0051 = edu0051List.get(i);
            result = teachingManageService.updateMakeUpGrade(edu0051,edu600);
            if(result.getCode()!=200){
                return result;
            }
        }

        return ResultVO.setSuccess("审批发起成功");

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
     * 查询学科是否录入成绩
     * @param searchCriteria
     * @return
     */
    @RequestMapping("/searchCourseGetGrade")
    @ResponseBody
    public ResultVO searchCourseGetGrade(@RequestParam("searchCriteria") String searchCriteria) {
        JSONObject jsonObject = JSON.parseObject(searchCriteria);
        CourseGetGradePO courseGetGradePO = JSON.toJavaObject(jsonObject, CourseGetGradePO.class);
        ResultVO result = teachingManageService.searchCourseGetGrade(courseGetGradePO);
        return result;
    }


    /**
     * 查询学科不及格人数和通过人数
     * @return
     */
    @RequestMapping("/searchMakeUpCount")
    @ResponseBody
    public ResultVO searchMakeUpCount(@RequestParam("trem") String trem) {
        ResultVO result = teachingManageService.searchMakeUpCount(trem);
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
//    @RequestMapping("/changeSchedule")
//    @ResponseBody
//    public ResultVO changeSchedule(@RequestParam("changInfo") String changInfo) {
//        Edu203 edu203 = JSON.parseObject(changInfo, Edu203.class);
//        ResultVO result = teachingManageService.changeScheduleOne(edu203);
//        return result;
//    }

    /**
     * 教师调课
     * @param changInfo
     * @return
     */
    @RequestMapping("/changeScheduleNew")
    @ResponseBody
    public ResultVO changeScheduleNew (@RequestParam("changInfo") String changInfo,//修改后对象信息
                                   @RequestParam("oldchangInfo") String oldchangInfo,//原对象信息 需要有Edu202_id和Edu101_id
                                   @RequestParam("type") String type,//操作类型：（1.调一周的课程，2.调一天的课程，3.调某一节课程）
                                   @RequestParam("userId") String user_id
    ) {
        Edu203 edu203 = JSON.parseObject(changInfo, Edu203.class);
        Edu203 edu203old = JSON.parseObject(oldchangInfo, Edu203.class);
        ResultVO result = teachingManageService.changeSchedule(edu203,edu203old,type,user_id);
        return result;
    }

    /**
     * 教师调课-只调教师
     * @return
     */
    @RequestMapping("/changeScheduleTeacher")
    @ResponseBody
    public ResultVO changeScheduleTeacher(@RequestParam String SearchCriteria) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String changInfo = jsonObject.getString("changInfo");
        String teacherId = jsonObject.getString("teacherId");
        String edu201Id = jsonObject.getString("edu201Id");
        List<Edu203> edu203List = JSON.parseArray(changInfo, Edu203.class);
        ResultVO result = teachingManageService.changeScheduleTeacher(edu203List,teacherId,edu201Id);
        return result;
    }

    /**
     * 教师调课-分散学时（检验）
     * @param
     * @return
     */
    @RequestMapping("/changeScheduleScatteredCheck")
    @ResponseBody
    public ResultVO changeScheduleScatteredCheck(@RequestParam("edu207Id") String edu207Id,@RequestParam("week") String week) {
        ResultVO result = teachingManageService.changeScheduleScatteredCheck(edu207Id,week);
        return result;
    }

    /**
     * 教师调课-分散学时
     * @param
     * @return
     */
    @RequestMapping("/changeScheduleScattered")
    @ResponseBody
    public ResultVO changeScheduleScattered(@RequestParam("edu207Id") String edu207Id,@RequestParam("week") String week,@RequestParam("count") String count,@RequestParam("userId") String user_id) {
        ResultVO result = teachingManageService.changeScheduleScattered(edu207Id,week,count,user_id);
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
     * 导出教务查询班级学年课程表
     * @return
     */
    @RequestMapping("/ExportJwGetYearScheduleInfoByClass")
    @ResponseBody
    public ResultVO ExportJwGetYearScheduleInfoByClass(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xnid = jsonObject.getString("xnid");
        String xbbm = jsonObject.getString("xbbm");
        // 将收到的jsonObject转为javabean 关系管理实体类
        String xbmc = teachingManageService.selectXbmc(xbbm);
        List<String> classIds = teachingManageService.selectClass(xbbm);
        List<TimeTablePO> list = new ArrayList<TimeTablePO>();
        for(int i = 0;i<classIds.size();i++){
            String classId = classIds.get(i);
            TimeTablePO timeTable = teachingManageService.ExportJwGetYearScheduleInfoByClass(xnid,classId);
            if(timeTable.getNewInfo() != null){
                list.add(timeTable);
            }
        }
        if(list.size()<=0){
            result = ResultVO.setSuccess("学院暂无课表");
            return result;
        }
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="PointDetail";
            }else{
                fileName=xbmc+"集中学时导出";
            }
            //创建Excel文件

            XSSFWorkbook workbook = teachingManageService.exportJwGetYearScheduleInfoByClass(list);
            try {
                utils.loadModal(response,fileName, workbook);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 导出教务查询学院周课表
     * @return
     */
    @RequestMapping("/ExportJwGetYearScheduleInfoByWeeks")
    @ResponseBody
    public ResultVO ExportJwGetYearScheduleInfoByWeeks(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xnid = jsonObject.getString("xnid");
        String xbbm = jsonObject.getString("xbbm");
        String week = jsonObject.getString("week");
        // 将收到的jsonObject转为javabean 关系管理实体类
        String xbmc = "";
        if (xbbm == null || "".equals(xbbm)){
            xbmc = "全部学院";
        }else{
            xbmc = teachingManageService.selectXbmc(xbbm);
        }


        TimeTablePO timeTable = teachingManageService.ExportJwGetYearScheduleInfoByWeeks(xnid,xbbm,week);

        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName=xbmc+"第"+week+"周集中学时导出";
        }
        //创建Excel文件

        XSSFWorkbook workbook = teachingManageService.exportJwGetYearScheduleInfoByWeeks(timeTable,xbmc,week);
        try {
            utils.loadModal(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }
    /**
     * 导出教务查询学院周课表
     * @return
     */
    @RequestMapping("/ExportJwGetYearScheduleInfoByWeeksCheck")
    @ResponseBody
    public ResultVO ExportJwGetYearScheduleInfoByWeeksCheck(@RequestParam String SearchCriteria) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xnid = jsonObject.getString("xnid");
        String xbbm = jsonObject.getString("xbbm");
        String week = jsonObject.getString("week");
        TimeTablePO timeTable = teachingManageService.ExportJwGetYearScheduleInfoByWeeks(xnid,xbbm,week);
        if (timeTable == null || timeTable.getNewInfo() == null){
            result =  ResultVO.setFailed("学院本周暂无课表");
        }else{
            result = ResultVO.setSuccess("成功");
        }

        return result;
    }

    /**
     * 导出教务查询班级学年课程表
     * @return
     */
    @RequestMapping("/ExportJwGetYearScheduleInfoByClassCheck")
    @ResponseBody
    public ResultVO ExportJwGetYearScheduleInfoByClassCheck(@RequestParam("xnid") String xnid, @RequestParam("xbbm") String xbbm) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        String xbmc = teachingManageService.selectXbmc(xbbm);
        List<String> classIds = teachingManageService.selectClass(xbbm);
        List<TimeTablePO> list = new ArrayList<TimeTablePO>();
        for(int i = 0;i<classIds.size();i++){
            String classId = classIds.get(i);
            TimeTablePO timeTable = teachingManageService.ExportJwGetYearScheduleInfoByClass(xnid,classId);
            if(timeTable.getNewInfo() != null){
                list.add(timeTable);
            }
        }
        if(list.size()<=0){
            result = ResultVO.setFailed("学院暂无课表");
            return result;
        }
        result = ResultVO.setSuccess("成功");
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
     * 教务查询班级授课成果
     * @return
     */
    @RequestMapping("/searchClassInfo")
    @ResponseBody
    public ResultVO searchClassInfo(@RequestParam("edu201Id") String edu201Id) {
        ResultVO result = teachingManageService.searchClassInfo(edu201Id);
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
     * 教务查询专业授课成果
     * @return
     */
    @RequestMapping("/searchProfessionalCourseResult")
    @ResponseBody
    public ResultVO searchProfessionalCourseResult(@RequestParam("SearchCriteria") String SearchCriteria) {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        Edu107 edu107 = JSON.parseObject(jsonObject.getString("searchInfo"), Edu107.class);
        String xnid = jsonObject.getString("xnid");
        String className = jsonObject.getString("className");
        String studentName = jsonObject.getString("studentName");
        String courseName = jsonObject.getString("courseName");
        if(courseName != null && !"".equals(courseName)){
            result = teachingManageService.searchProfessionalCourseResult2(edu107,xnid,className,studentName,courseName);
        }else{
            result = teachingManageService.searchProfessionalCourseResult(edu107,xnid,className,studentName);
        }
        return result;
    }

    /**
     * 教务查询专业授课成果
     * @return
     */
    @RequestMapping("/searchProfessionalByXY")
    @ResponseBody
    public ResultVO searchProfessionalByXY(@RequestParam("SearchCriteria") String SearchCriteria) {
        ResultVO result;
        ProfessionalRequestPO professionalRequestPO = JSON.parseObject(SearchCriteria, ProfessionalRequestPO.class);
        if(professionalRequestPO.getXnid() == null || "".equals(professionalRequestPO.getXnid())){
            result = ResultVO.setFailed("学年不能为空");
        }else if(professionalRequestPO.getEdu103Id() == null || "".equals(professionalRequestPO.getEdu103Id())){
            result = ResultVO.setFailed("层次不能为空");
        }else if(professionalRequestPO.getEdu104Id() == null || "".equals(professionalRequestPO.getEdu104Id())){
            //查询各个学院的studentGetGrades
            result = teachingManageService.searchProfessionalByXY(professionalRequestPO.getXnid(),professionalRequestPO.getEdu103Id(),professionalRequestPO);
        }else if(professionalRequestPO.getEdu105Id() == null || "".equals(professionalRequestPO.getEdu105Id())){
            //查询某一学院各个年级的
            result = teachingManageService.searchProfessionalByNJ(professionalRequestPO.getXnid(),professionalRequestPO.getEdu103Id(),professionalRequestPO.getEdu104Id(),professionalRequestPO);
        }else if(professionalRequestPO.getEdu106Id() == null || "".equals(professionalRequestPO.getEdu106Id())){
            //查询某一学院某个年级各个专业的
            result = teachingManageService.searchProfessionalByZY(professionalRequestPO.getXnid(),professionalRequestPO.getEdu103Id(),professionalRequestPO.getEdu104Id(),professionalRequestPO.getEdu105Id(),professionalRequestPO);
        }else if(professionalRequestPO.getBatch() == null || "".equals(professionalRequestPO.getBatch())){
            //查询某一学院某个年级某个专业各个批次的
            result = teachingManageService.searchProfessionalByCourse(professionalRequestPO.getXnid(),professionalRequestPO.getEdu103Id(),professionalRequestPO.getEdu104Id(),professionalRequestPO.getEdu105Id(),professionalRequestPO.getEdu106Id(),professionalRequestPO);
        }else{
            //查询某一学院某个年级某个专业某一批次各个课程的
            result = teachingManageService.searchProfessionalByBatch(professionalRequestPO.getXnid(),professionalRequestPO.getEdu103Id(),professionalRequestPO.getEdu104Id(),professionalRequestPO.getEdu105Id(),professionalRequestPO.getEdu106Id(),professionalRequestPO.getBatch(),professionalRequestPO);
        }
        return result;
    }

    /**
     * 教务查询学生及格率
     * @return
     */
//    @RequestMapping("/searchPassRate")
//    @ResponseBody
//    public ResultVO searchPassRate(@RequestParam("SearchCriteria") String SearchCriteria) {
//        StudentXNPassViewPO studentXNPassViewPO = JSON.parseObject(SearchCriteria, StudentXNPassViewPO.class);
//        ResultVO result = teachingManageService.searchPassRate(studentXNPassViewPO);
//        return result;
//    }

    /**
     * 教务查询学生预计毕业率
     * @return
     */
    @RequestMapping("/searchGraduationRate")
    @ResponseBody
    public ResultVO searchGraduationRate(@RequestParam("SearchCriteria") String SearchCriteria) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String type = jsonObject.getString("type");
        if("1".equals(type)){//1为及格率
            String classInfo = jsonObject.getString("classInfo");
            StudentXNPassViewPO studentXNPassViewPO = JSON.parseObject(classInfo, StudentXNPassViewPO.class);
            ResultVO result = teachingManageService.searchPassRate(studentXNPassViewPO);
            return result;
        }else{//2为毕业率
            Edu300 edu300 = JSON.parseObject(jsonObject.getString("classInfo"), Edu300.class);
            String num = jsonObject.getString("num");
            ResultVO result = teachingManageService.searchGraduationRate(edu300,num);
            return result;
        }
    }

    /**
     * 教务查询课程完成进度
     * @return
     */
    @RequestMapping("/searchCourseProgress")
    @ResponseBody
    public ResultVO searchCourseProgress(@RequestParam("xnid") String xnid) {
        ResultVO result = teachingManageService.searchCourseProgress(xnid);
        return result;
    }


    /**
     * 导出教务专业授课成果-校验
     * @return
     */
    @RequestMapping("/exportProfessionalCourseResultCheck")
    @ResponseBody
    public ResultVO exportProfessionalCourseResultCheck(@RequestParam("SearchCriteria") String SearchCriteria) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        Edu107 edu107 = JSON.parseObject(jsonObject.getString("searchInfo"), Edu107.class);
        String xnid = jsonObject.getString("xnid");
        ResultVO result = teachingManageService.exportProfessionalCourseResultCheck(edu107,xnid);
        if(result.getCode() == 200){
            result = ResultVO.setSuccess("可以导出数据");
        }
        return result;
    }

    /**
     * 导出教务专业授课成果
     * @return
     */
    @RequestMapping("/exportProfessionalCourseResult")
    @ResponseBody
    public ResultVO exportProfessionalCourseResult(HttpServletRequest request,HttpServletResponse response,@RequestParam("SearchCriteria") String SearchCriteria) {
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        Edu107 edu107 = JSON.parseObject(jsonObject.getString("searchInfo"), Edu107.class);
        String xnid = jsonObject.getString("xnid");
        ResultVO result = teachingManageService.exportProfessionalCourseResultCheck(edu107,xnid);
        if(result.getCode() != 200){
            return result;
        }else{
            List<Edu005PO> edu005POList = (List<Edu005PO>) result.getData();
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            edu107 = edu005POList.get(0).getEdu107();
            if(isIE){
                fileName="courseResult";
            }else{
                fileName=edu107.getEdu106mc()+"专业"+edu107.getBatchName()+"学生排名明细单";
            }
            //创建Excel文件
            XSSFWorkbook workbook = teachingManageService.exportProfessionalCourseResult(edu005POList,edu107.getEdu106mc(),xnid);
            try {
                utils.loadModal(response,fileName, workbook);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
            result = ResultVO.setSuccess("下载成功");
        }
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

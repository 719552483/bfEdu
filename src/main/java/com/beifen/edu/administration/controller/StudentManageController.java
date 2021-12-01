package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.StudentBreakPO;
import com.beifen.edu.administration.PO.StudentSearchPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.StaffManageService;
import com.beifen.edu.administration.service.StudentManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.util.WebUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

//学生管理控制层
@Controller
public class StudentManageController {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    private StudentManageService studentManageService;
    @Autowired
    private StaffManageService staffManageService;

    /**
     * 新增学生
     * @param addInfo
     * @return
     */
    @RequestMapping("addStudent")
    @ResponseBody
    public ResultVO<Edu001> addStudent(@RequestParam("addInfo") String addInfo) {
        ResultVO<Edu001> result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.fromObject(addInfo);
        Edu001 edu001 = (Edu001) JSONObject.toBean(jsonObject, Edu001.class);
        result = studentManageService.addNewStudent(edu001);
        return result;
    }

    /**
     * 删除学生
     * @param removeInfo
     * @return
     */
    @RequestMapping("removeStudents")
    @ResponseBody
    public ResultVO removeStudents(@RequestParam String removeInfo) {
        ResultVO result;
        JSONArray deleteArray = JSONArray.fromObject(removeInfo); // 解析json字符
        result =  studentManageService.removeStudentByID(deleteArray);
        return result;
    }

    /**
     * 修改学生
     * @param updateinfo
     * @param approvalobect
     * @return
     */
    @RequestMapping("modifyStudent")
    @ResponseBody
    public ResultVO modifyStudent(@RequestParam("updateinfo") String updateinfo,@RequestParam("approvalobect") String approvalobect) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(updateinfo);
        JSONObject apprvalObject = JSONObject.fromObject(approvalobect);
        Edu001 edu001 = (Edu001) JSONObject.toBean(jsonObject, Edu001.class);
        Edu600 edu600 = (Edu600) JSONObject.toBean(apprvalObject, Edu600.class);
        result = studentManageService.modifyStudent(edu001,edu600);
        return result;
    }

    /**
     * 下载学生导入模板
     *
     * @return returnMap
     * @throws IOException
     * @throws ParseException
     */
    @RequestMapping("downloadStudentModal")
    @ResponseBody
    public ResultVO downloadStudentModal(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createImportStudentModal(workbook);
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="ImportStudent";
        }else{
            fileName="导入学生模板";
        }
        utils.loadModal(response,fileName, workbook);
        ResultVO result = ResultVO.setSuccess("模版下载成功");
        return result;
    }

    /**
     * 下载学生更新模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("downloadModifyStudentsModal")
    @ResponseBody
    public ResultVO downloadModifyStudentsModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "modifyStudentIDs") String modifyStudentIDs) throws IOException, ParseException {
        // 根据ID查询已选学生信息
        com.alibaba.fastjson.JSONArray modifyStudentArray = JSON.parseArray(modifyStudentIDs);
        List<Edu001> chosedStudents=new ArrayList<Edu001>();
        for (int i = 0; i < modifyStudentArray.size(); i++) {
            Edu001 edu001=studentManageService.queryStudentBy001ID(modifyStudentArray.get(i).toString());
            chosedStudents.add(edu001);
        }
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="modifyStudents";
        }else{
            fileName="批量更新学生模板";
        }
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createModifyStudentModal(workbook,chosedStudents);
        utils.loadModal(response,fileName, workbook);

        ResultVO result = ResultVO.setSuccess("模版下载成功");
        return result;
    }

    /**
     * 导入学生
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping("importStudent")
    @ResponseBody
    public ResultVO importStudent(@RequestParam("file") MultipartFile file){
        ResultVO result;
        result = studentManageService.importStudent(file);
        return result;
    }

    /**
     * 批量修改学生
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("modifyStudents")
    @ResponseBody
    public ResultVO modifyStudents(HttpServletRequest request){
        ResultVO result;
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String approvalInfo = multipartRequest.getParameter("approvalInfo"); //接收客户端传入文件携带的审批流参数
        //格式化审批流信息
        JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
        Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);
        result = studentManageService.modifyStudents(file,edu600);
        return result;
    }

    /**
     * 检验导入学生的文件
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyImportStudentFile")
    @ResponseBody
    public Object verifiyImportStudentFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> checkRS = utils.checkStudentFile(file, "ImportEdu001", "导入学生信息");
        checkRS.put("result", true);
        return checkRS;
    }

    /**
     * 检验修改学生的文件
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyModifyStudentFile")
    @ResponseBody
    public Object verifiyModifyStudentFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> checkRS = utils.checkStudentFile(file, "ModifyEdu001", "已选学生信息");
        checkRS.put("result", true);
        return checkRS;
    }



//    @RequestMapping("/graduationStudents")
//    @ResponseBody
//    public ResultVO graduationStudents(@RequestParam String choosendStudents) {
//        ResultVO result;
//        com.alibaba.fastjson.JSONArray graduationArray = JSON.parseArray(choosendStudents);
//        result =studentManageService.graduationStudents(graduationArray);
//        return result;
//    }
    /**
     * 批量发放毕业证
     * @param
     * @return
     */
    @RequestMapping("/graduationStudents")
    @ResponseBody
    public ResultVO graduationStudents(@RequestParam("studentInfo") String studentInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(studentInfo);
        List<String> list = com.alibaba.fastjson.JSONObject.parseArray(jsonObject.getString("Edu300_ID"),String.class);
        String edu300ids = list.stream().map(String::valueOf).collect(Collectors.joining(","));
        Edu001 edu001 = (Edu001) JSONObject.toBean(jsonObject, Edu001.class);
        edu001.setEdu300_ID(edu300ids);
        result =studentManageService.graduationStudents(edu001);
        return result;
    }

    /**
     * 查询就业信息
     * @param
     * @return
     */
    @RequestMapping("/employmentStudents")
    @ResponseBody
    public ResultVO employmentStudents(@RequestParam("studentInfo") String studentInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(studentInfo);
        Edu0011 edu0011= (Edu0011) JSONObject.toBean(jsonObject, Edu0011.class);
        result =studentManageService.employmentStudents(edu0011);
        return result;
    }

    /**
     * 修改学生就业信息
     */
    @RequestMapping("/updateEmploymentStudents")
    @ResponseBody
    public ResultVO updateEmploymentStudents(@RequestParam("studentInfo") String studentInfo) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.fromObject(studentInfo);
        Edu0011 edu0011= (Edu0011) JSONObject.toBean(jsonObject, Edu0011.class);
        result = studentManageService.updateEmploymentStudents(edu0011);
        return result;
    }

    /**
     * 清空学生就业信息
     */
    @RequestMapping("/clearEmploymentStudents")
    @ResponseBody
    public ResultVO clearEmploymentStudents(@RequestParam("deleteIds") String deleteIds) {
        ResultVO result;
        // 将收到的jsonObject转为javabean 关系管理实体类
        List<String> deleteIdList = JSON.parseArray(deleteIds, String.class);
        result = studentManageService.clearEmploymentStudents(deleteIdList);
        return result;
    }


    /**
     * 下载学生就业信息模板-check
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
        @RequestMapping("downloadEmploymentStudentsModalCheck")
    @ResponseBody
    public ResultVO downloadEmploymentStudentsModalCheck(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "studentInfo") String studentInfo) throws IOException, ParseException {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(studentInfo);
        Edu0011 edu0011= (Edu0011) JSONObject.toBean(jsonObject, Edu0011.class);
        result =studentManageService.employmentStudents(edu0011);
        return result;
    }

    /**
     * 下载学生就业信息模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("downloadEmploymentStudentsModal")
    @ResponseBody
    public ResultVO downloadEmploymentStudentsModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "studentInfo") String studentInfo) throws IOException, ParseException {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(studentInfo);
        Edu0011 edu0011= (Edu0011) JSONObject.toBean(jsonObject, Edu0011.class);
        result =studentManageService.employmentStudents(edu0011);
        if(result.getCode() != 200){
            return result;
        }
        List<Edu0011> edu0011List = (List<Edu0011>) result.getData();
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="employmentStudentsInfo";
        }else{
            fileName="学生就业信息模板";
        }
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createEmploymentStudentsModal(workbook,edu0011List);
        utils.loadModal(response,fileName, workbook);
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 检验导入学生就业信息的文件
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyImportEmploymentStudentsFile")
    @ResponseBody
    public Object verifiyImportEmploymentStudentsFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> checkRS= utils.verifiyImportEmploymentStudentsFile(file, "ImportEdu0011", "已选学生就业信息");
        checkRS.put("result", true);
        return checkRS;
    }

    /**
     * 导入学生就业信息的文件
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("importStudentWorkInfo")
    @ResponseBody
    public ResultVO importStudentWorkInfo(@RequestParam("file") MultipartFile file){
        ResultVO result;
        result = studentManageService.importStudentWorkInfo(file);
        return result;
    }

    /**
     * 学生管理搜索学生
     *
     * @param studentSearchPO
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("studentMangerSearchStudent")
    @ResponseBody
    public ResultVO studentMangerSearchStudent(@RequestBody StudentSearchPO studentSearchPO) {

        // 填充搜索对象
        Edu001 edu001 = new Edu001();
        edu001.setPycc(studentSearchPO.getLevel());
        edu001.setSzxb(studentSearchPO.getDepartment());
        edu001.setNj(studentSearchPO.getGrade());
        edu001.setZybm(studentSearchPO.getMajor());
        edu001.setEdu300_ID(studentSearchPO.getAdministrationClass());
        edu001.setZtCode(studentSearchPO.getStatus());
        edu001.setXh(studentSearchPO.getStudentNumber());
        edu001.setXm(studentSearchPO.getStudentName());
        edu001.setXjh(studentSearchPO.getStudentRollNumber());
        edu001.setXzbname(studentSearchPO.getClassName());

        ResultVO result = studentManageService.studentMangerSearchStudent(edu001,studentSearchPO.getUserId(),studentSearchPO.getPageNum(),studentSearchPO.getPageSize());
        return result;
    }


    /**
     * 数据报表-学生
     *
     * @return returnMap
     */
//    @RequestMapping("exportStudentNum")
//    @ResponseBody
//    public ResultVO exportStudentNum(HttpServletRequest request,HttpServletResponse response,@RequestParam("searchInfo") String searchInfo) {
//        ResultVO result;
//        com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(searchInfo);
//        String szxb = jsonObject.getString("szxb");
//        String szxbmc = jsonObject.getString("szxbmc");
//        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
//        String fileName;
//        if(isIE){
//            fileName="exportStudentNum";
//        }else{
//            if(szxb != null && !"".equals(szxb)){
//                fileName=szxbmc+"，学生基础信息表";
//            }else{
//                fileName="全校学生基础信息表";
//            }
//
//        }
//        //创建Excel文件
//        XSSFWorkbook workbook = studentManageService.exportStudentNum(szxb);
//        try {
//            utils.loadModal(response,fileName, workbook);
//        } catch (IOException e) {
//            e.printStackTrace();
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//        result = ResultVO.setSuccess("下载成功");
//        return result;
//    }




    /**
     * 生成学生名单
     * @param searchInfo
     * @return
     */
    @RequestMapping("/exportStudentExcel")
    @ResponseBody
    public ResultVO exportStudentExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam("searchInfo") String searchInfo) {
        StudentSearchPO studentSearchPO = JSON.parseObject(searchInfo, StudentSearchPO.class);
        // 填充搜索对象
        Edu001 edu001 = new Edu001();
        edu001.setPycc(studentSearchPO.getLevel());
        edu001.setSzxb(studentSearchPO.getDepartment());
        edu001.setNj(studentSearchPO.getGrade());
        edu001.setZybm(studentSearchPO.getMajor());
        edu001.setEdu300_ID(studentSearchPO.getAdministrationClass());
        edu001.setZtCode(studentSearchPO.getStatus());
        edu001.setXh(studentSearchPO.getStudentNumber());
        edu001.setXm(studentSearchPO.getStudentName());
        edu001.setXjh(studentSearchPO.getStudentRollNumber());
        edu001.setXzbname(studentSearchPO.getClassName());

        ResultVO result = studentManageService.exportStudentExcel(request,response,edu001,studentSearchPO.getUserId());
        return result;
    }


    /**
     * 查看学生评价
     * @param appraiseInfo
     * @return
     */
    @RequestMapping("/queryStudentAppraise")
    @ResponseBody
    public ResultVO queryStudentAppraise(@RequestParam("appraiseInfo") String appraiseInfo) {
        com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(appraiseInfo);
        Edu004 edu004 = JSON.toJavaObject(jsonObject, Edu004.class);
        ResultVO result =studentManageService.queryStudentAppraise(edu004);
        return result;
    }

    /**
     * 增改学生评价
     * @param studentArray
     * @param appraiseInfo
     * @return
     */

    @RequestMapping("/studentAppraise")
    @ResponseBody
    public ResultVO studentAppraise(@RequestParam("studentArray") String studentArray,@RequestParam("appraiseInfo") String appraiseInfo,@RequestParam("userKey") String userKey,@RequestParam("userName") String userName) {
        List<String> studnetIdList = JSON.parseArray(studentArray, String.class);
        ResultVO result =studentManageService.studentAppraise(studnetIdList,userKey,appraiseInfo,userName);
        return result;
    }

    /**
     * 学生查询成绩
     * @param userKey
     * @return
     */

    @RequestMapping("/studentGetGrades")
    @ResponseBody
    public ResultVO studentGetGrades(@RequestParam("userKey") String userKey,@RequestParam("SearchCriteria") String searchCriteria) {
        com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(searchCriteria);
        Edu005 edu005 = JSON.toJavaObject(jsonObject, Edu005.class);
        ResultVO result =studentManageService.studentGetGrades(userKey,edu005);
        return result;
    }

    /**
     * 根据班级、学科查询成绩
     * @param
     * @return
     */

    @RequestMapping("/studentGetGradesByClass")
    @ResponseBody
    public ResultVO studentGetGradesByClass(@RequestParam("className") String className,@RequestParam("courseName") String courseName) {
        ResultVO result =studentManageService.studentGetGradesByClass(className,courseName);
        return result;
    }

    /**
     * 根据班级查询学科
     * @param
     * @return
     */

    @RequestMapping("/searchCourseByClasses")
    @ResponseBody
    public ResultVO searchCourseByClasses(@RequestParam("edu300_ID") String edu300_ID,@RequestParam("term") String term) {
        List<String> list = Arrays.asList(edu300_ID.split(","));
        ResultVO result =studentManageService.searchCourseByClasses(list,term);
        return result;
    }

    /**
     * 根据班级查询学科
     * @param
     * @return
     */

    @RequestMapping("/searchCourseByClass")
    @ResponseBody
    public ResultVO searchCourseByClass(@RequestParam("edu300_ID") String edu300_ID,@RequestParam("term") String term) {
        ResultVO result =studentManageService.searchCourseByClass(edu300_ID,term);
        return result;
    }

    /**
     * 只根据班级查询学科
     * @param
     * @return
     */

    @RequestMapping("/searchCourseByClassOnly")
    @ResponseBody
    public ResultVO searchCourseByClassOnly(@RequestParam("edu300_ID") String edu300_ID,@RequestParam("xnid") String xnid) {
        ResultVO result =studentManageService.searchCourseByClassOnly(edu300_ID,xnid);
        return result;
    }

    /**
     * 根据学年查询学科
     * @param
     * @return
     */

    @RequestMapping("/searchCourseByXN")
    @ResponseBody
    public ResultVO searchCourseByXN(@RequestParam("term") String term) {
        ResultVO result =studentManageService.searchCourseByXN(term);
        return result;
    }

    /**
     * 根据学年、用户id查询学科
     * @param
     * @return
     */

    @RequestMapping("/searchCourseByXNAndID")
    @ResponseBody
    public ResultVO searchCourseByXNAndID(@RequestParam("term") String term,@RequestParam("userId")String userId) {
        ResultVO result =studentManageService.searchCourseByXNAndID(term,userId);
        return result;
    }

    /**
     * 下载打印学生总表-校验
     * */
    @RequestMapping("/printStudentGradeCheck")
    @ResponseBody
    public ResultVO printStudentGradeCheck(@RequestParam("ids") String ids,@RequestParam("userId") String userId) {
        List<String> studentIds = JSON.parseArray(ids, String.class);
        ResultVO result =studentManageService.printStudentGradeCheck(studentIds,userId);
        return result;
    }

    /**
    * 下载打印学生总表
    * */
    @RequestMapping("/printStudentGrade")
    @ResponseBody
    public ResultVO printStudentGrade(@RequestParam("ids") String ids) {
        List<String> studentIds = JSON.parseArray(ids, String.class);
        ResultVO result =studentManageService.printStudentGrade(studentIds);
        return result;
    }

    /**
     * 下载打印学生单个学期成绩
     * */
    @RequestMapping("/printStudentGradeOne")
    @ResponseBody
    public ResultVO printStudentGradeOne(@RequestParam("studentId") String ids,@RequestParam("xnid") String xnid) {
        List<String> studentId = JSON.parseArray(ids, String.class);
        ResultVO result =studentManageService.printStudentGradeOne(studentId,xnid);
        return result;
    }
    /**
    * 修改免修状态
    * */
    @RequestMapping("/updateMXStatus")
    @ResponseBody
    public ResultVO updateMXStatus(@RequestParam("edu005_ID") String edu005_ID,@RequestParam("mxStatus") String mxStatus) {
        ResultVO result =studentManageService.updateMXStatus(edu005_ID,mxStatus);
        return result;
    }

    /**
     * 批量修改免修状态
     * */
    @RequestMapping("/updateMXStatusByCourse")
    @ResponseBody
    public ResultVO updateMXStatusByCourse(@RequestParam("courserName") String courserName,@RequestParam("sylxbm") String sylxbm,@RequestParam("term") String term,@RequestParam("userId") String userId) {
        List<String> list = Arrays.asList(courserName.split(","));
        String result =studentManageService.updateMXStatusByCourse(list,sylxbm,term);
        ResultVO voresult = ResultVO.setSuccess(result);
        return voresult;
    }

    /**
     * 学生查询相关学年
     * @param userKey
     * @return
     */

    @RequestMapping("/getStudentXn")
    @ResponseBody
    public ResultVO studentGetSchoolYear(@RequestParam("userKey") String userKey) {
        ResultVO result =studentManageService.studentGetSchoolYear(userKey);
        return result;
    }

    /**
     * 根据二级学院权限查询学生
     * @param userId
     * @return
     */

    @RequestMapping("/getStudentByUserDepartment")
    @ResponseBody
    public ResultVO getStudentByUserDepartment(@RequestParam("userId") String userId,@RequestParam("searchsObject") String searchsObject) {
        StudentBreakPO studentBreakPO = JSON.parseObject(searchsObject, StudentBreakPO.class);
        ResultVO result =studentManageService.getStudentByUserDepartment(userId,studentBreakPO);
        return result;
    }

    /**
     * 学生查询违纪记录
     * @param userId
     * @return
     */
    @RequestMapping("/studentFindBreak")
    @ResponseBody
    public ResultVO studentFindBreak(@RequestParam("userId") String userId) {
        ResultVO result =studentManageService.studentFindBreak(userId);
        return result;
    }

    /**
     * 学生评价查询
     * @param userId
     * @return
     */
    @RequestMapping("/studentGetAppraise")
    @ResponseBody
    public ResultVO studentGetAppraise(@RequestParam("userId") String userId) {
        ResultVO result =studentManageService.studentGetAppraise(userId);
        return result;
    }


    /**
     * 学生报表数据
     * @return
     */
    @RequestMapping("/studentReport")
    @ResponseBody
    public ResultVO studentReport(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
        ResultVO result;
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName="学生报表数据";
        }
        //创建Excel文件
        XSSFWorkbook workbook = studentManageService.studentReport();
        try {
            utils.loadModal2(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 学生报表数据
     * @return
     */
    @RequestMapping("/studentCollegeReportCheck")
    @ResponseBody
    public ResultVO studentCollegeReportCheck(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xbbm = jsonObject.getString("xbbm");
        String njbm = jsonObject.getString("njbm");
        String batch = jsonObject.getString("batch");

        List<Edu300> edu300List = studentManageService.queryStudentReport(xbbm,njbm,batch);
        if (edu300List.size() == 0) {
            result = ResultVO.setFailed("该学院暂无数据");
        }else{
            result = ResultVO.setSuccess("下载成功");

        }
        return result;
    }

    /**
     * 学生报表数据
     * @return
     */
    @RequestMapping("/studentCollegeReport")
    @ResponseBody
    public ResultVO studentReportCollege(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xbbm = jsonObject.getString("xbbm");
        String njbm = jsonObject.getString("njbm");
        String batch = jsonObject.getString("batch");
        List<Edu300> edu300List = studentManageService.queryStudentReport(xbbm,njbm,batch);
        if(edu300List.size() == 0){
            result = ResultVO.setFailed("该学院暂无数据");
            return result;
        }
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName=edu300List.get(0).getXbmc()+"学生报表数据";
        }
        //创建Excel文件
        XSSFWorkbook workbook = studentManageService.studentReport2(edu300List);
        try {
            utils.loadModal2(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 授课信息报表
     * @return
     */
    @RequestMapping("/teachingInfoReport")
    @ResponseBody
    public ResultVO teachingInfoReport(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xnid = jsonObject.getString("xn");
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName="授课信息报表数据";
        }
        //创建Excel文件
        XSSFWorkbook workbook = studentManageService.teachingInfoReport(xnid);
        try {
            utils.loadModal2(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 授课信息报表-各学院
     * @return
     */
    @RequestMapping("/teachingInfoCollegeReport")
    @ResponseBody
    public ResultVO teachingInfoCollegeReport(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xbbm = jsonObject.getString("xb");
        String xnid = jsonObject.getString("xn");
        List<Edu106> edu106List = studentManageService.queryCollege(xbbm);
        if(edu106List.size() == 0){
            result = ResultVO.setFailed("该学院暂无数据");
            return result;
        }
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName=edu106List.get(0).getDepartmentName()+"授课信息报表数据";
        }
        //创建Excel文件
        XSSFWorkbook workbook = studentManageService.teachingInfoCollegeReport(edu106List,xnid);
        try {
            utils.loadModal2(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 授课信息报表-各学院
     * @return
     */
    @RequestMapping("/teachingInfoCollegeReportCheck")
    @ResponseBody
    public ResultVO teachingInfoCollegeReportCheck(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xbbm = jsonObject.getString("xb");
        String xnid = jsonObject.getString("xn");
        List<Edu106> edu106List = studentManageService.queryCollege(xbbm);
        if(edu106List.size() == 0){
            result = ResultVO.setFailed("该学院暂无数据");
            return result;
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    //导出班级学生原始成绩
    @RequestMapping("/exportGradeByClassIdAndcourseName")
    @ResponseBody
    public ResultVO exportGradeByClassIdAndcourseName(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String courseName = jsonObject.getString("courseName");
        String className = jsonObject.getString("className");
        String xnid = jsonObject.getString("xnid");
        List<String> list = Arrays.asList(className.split(","));

        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName="初始成绩导出";
        }
        //创建Excel文件
        XSSFWorkbook workbook = studentManageService.exportGradeByClassIdAndcourseName(courseName,list,xnid);
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

    //导出班级学生原始成绩-校验
    @RequestMapping("/exportGradeByClassIdAndcourseNameCheck")
    @ResponseBody
    public ResultVO exportGradeByClassIdAndcourseNameCheck(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String courseName = jsonObject.getString("courseName");
        String className = jsonObject.getString("className");
        String xnid = jsonObject.getString("xnid");
        List<String> list = Arrays.asList(className.split(","));
        result = studentManageService.exportGradeByClassIdAndcourseNameCheck(courseName,list,xnid);
        return result;
    }

    //定时统计教职工课时费

    //学生学年及格率报表
    @RequestMapping("/exportStudentPassReport")
    @ResponseBody
    public ResultVO exportStudentPassReport(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        List<String> list = JSON.parseArray(SearchCriteria, String.class);

        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else{
            fileName="学生学年及格率报表";
        }
        //创建Excel文件
        XSSFWorkbook workbook = studentManageService.exportStudentPassReport(list);
        try {
            utils.loadModal3(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    //学生学年及格率报表
    @RequestMapping("/exportStudentPassReportCheck")
    @ResponseBody
    public ResultVO exportStudentPassReportCheck(HttpServletRequest request, HttpServletResponse response,@RequestParam String SearchCriteria) throws IOException, ParseException {
        ResultVO result;
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

    /**
     * 学生报表数据-报表
     * @return
     */
    @RequestMapping("/studentReportData")
    @ResponseBody
    public ResultVO studentReportData(@RequestParam String SearchCriteria){
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xbbm = jsonObject.getString("xbbm");
        String njbm = jsonObject.getString("njbm");
        String batch = jsonObject.getString("batch");
        if(xbbm != null && !"".equals(xbbm)){
            List<Edu300> edu300List = studentManageService.queryStudentReport(xbbm,njbm,batch);
            if (edu300List.size() == 0) {
                result = ResultVO.setFailed("该学院暂无数据!");
                return result;
            }
            result = studentManageService.studentReportData(edu300List);
        }else{
            result = studentManageService.studentReportDataAll();
        }
        return result;
    }

    /**
     * 教学点报表数据-报表
     * @return
     */
    @RequestMapping("/pointReportData")
    @ResponseBody
    public ResultVO pointReportData(@RequestParam String SearchCriteria){
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String cityCode = jsonObject.getString("cityCode");
        String country = jsonObject.getString("country");
        String localName = jsonObject.getString("localName");
        String xnid = jsonObject.getString("xn");
        Edu500 edu500 = new Edu500();
        edu500.setCityCode(cityCode);
        edu500.setCountry(country);
        edu500.setLocalName(localName);
        List<Edu500> list = studentManageService.queryPointByCity(edu500);
        if(list.size() == 0){
            result = ResultVO.setFailed("暂无教学点信息");
            return result;
        }
        result = studentManageService.pointReportData(list,xnid);
        return result;
    }

    /**
     * 授课信息报表数据-报表
     * @return
     */
    @RequestMapping("/teachInfoReportData")
    @ResponseBody
    public ResultVO teachInfoReportData(@RequestParam String SearchCriteria){
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        String xbbm = jsonObject.getString("xb");
        String xnid = jsonObject.getString("xn");
        if(xbbm != null && !"".equals(xbbm)){
            List<Edu106> edu106List = studentManageService.queryCollege(xbbm);
            if(edu106List.size() == 0){
                result = ResultVO.setFailed("该学院暂无数据");
                return result;
            }
            result = studentManageService.teachInfoReportData(edu106List,xnid);
        }else{
            result = studentManageService.teachInfoReportDataAll(xnid);
        }
        return result;
    }

    /**
     * 及格率报表数据展示-报表
     * @return
     */
    @RequestMapping("/studentPassReport")
    @ResponseBody
    public ResultVO studentPassReport(@RequestParam String SearchCriteria){
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(SearchCriteria);
        Edu107 edu107 = (Edu107) JSONObject.toBean(jsonObject, Edu107.class);
        result = studentManageService.studentPassReportCheck(edu107);
        if(result.getCode() != 200){
            return result;
        }else{
            List<Edu107> edu107List = (List<Edu107>) result.getData();
            result = studentManageService.studentPassReport(edu107List);
        }
        return result;
    }
}

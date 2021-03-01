package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.StudentBreakPO;
import com.beifen.edu.administration.PO.StudentSearchPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
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
import java.util.List;
import java.util.Map;

//学生管理控制层
@Controller
public class StudentManageController {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    private StudentManageService studentManageService;

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


    /**
     * 批量发放毕业证
     * @param choosendStudents
     * @return
     */
    @RequestMapping("/graduationStudents")
    @ResponseBody
    public ResultVO graduationStudents(@RequestParam String choosendStudents) {
        ResultVO result;
        com.alibaba.fastjson.JSONArray graduationArray = JSON.parseArray(choosendStudents);
        result =studentManageService.graduationStudents(graduationArray);
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

    @RequestMapping("/searchCourseByClass")
    @ResponseBody
    public ResultVO searchCourseByClass(@RequestParam("edu300_ID") String edu300_ID,@RequestParam("term") String term) {
        ResultVO result =studentManageService.searchCourseByClass(edu300_ID,term);
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
    * 修改免修状态
    * */
    @RequestMapping("/updateMXStatus")
    @ResponseBody
    public ResultVO updateMXStatus(@RequestParam("edu005_ID") String edu005_ID,@RequestParam("mxStatus") String mxStatus) {
        ResultVO result =studentManageService.updateMXStatus(edu005_ID,mxStatus);
        return result;
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


}

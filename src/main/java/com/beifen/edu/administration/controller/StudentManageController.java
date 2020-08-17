package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu301;
import com.beifen.edu.administration.domian.Edu600;
import com.beifen.edu.administration.service.AdministrationPageService;
import com.beifen.edu.administration.service.ApprovalProcessService;
import com.beifen.edu.administration.service.StudentManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//学生管理控制层
@Controller
public class StudentManageController {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    private StudentManageService studentManageService;
    @Autowired
    private AdministrationPageService administrationPageService;
    @Autowired
    private ApprovalProcessService approvalProcessService;


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
     * @param SearchCriteria
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("studentMangerSearchStudent")
    @ResponseBody
    public ResultVO studentMangerSearchStudent(@RequestParam String SearchCriteria) {
        JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
        // 根据层次等信息查出培养计划id
        String level = searchObject.getString("level");
        String department = searchObject.getString("department");
        String grade = searchObject.getString("grade");
        String major = searchObject.getString("major");
        String administrationClass = searchObject.getString("administrationClass");
        String status = searchObject.getString("status");
        String studentNumber = searchObject.getString("studentNumber");
        String studentName = searchObject.getString("studentName");
        String studentRollNumber = searchObject.getString("studentRollNumber");
        String className = searchObject.getString("className");

        // 填充搜索对象
        Edu001 edu001 = new Edu001();
        edu001.setPycc(level);
        edu001.setSzxb(department);
        edu001.setNj(grade);
        edu001.setZybm(major);
        edu001.setEdu300_ID(administrationClass);
        edu001.setZtCode(status);
        edu001.setXh(studentNumber);
        edu001.setXm(studentName);
        edu001.setXjh(studentRollNumber);
        edu001.setXzbname(className);

        ResultVO result = studentManageService.studentMangerSearchStudent(edu001);
        return result;
    }

}

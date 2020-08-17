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
    public Object removeStudents(@RequestParam String removeInfo) {
        JSONArray deleteArray = JSONArray.fromObject(removeInfo); // 解析json字符
        for (int i = 0; i < deleteArray.size(); i++) {
            JSONObject jsonObject = deleteArray.getJSONObject(i);
            String edu300_ID = jsonObject.getString("edu300_ID");
            long studentId = jsonObject.getLong("studentId");

            List<Edu301> teachingClassesBy300id = administrationPageService.queryTeachingClassByXzbCode(edu300_ID);
            List<Edu301> teachingClassesBy001id = administrationPageService
                    .queryTeachingClassByXSCode(String.valueOf(studentId));
            studentManageService.removeStudentUpdateCorrelationInfo(teachingClassesBy300id, teachingClassesBy001id,
                    edu300_ID, studentId);
            studentManageService.removeStudentByID(studentId);
        }
        Map<String, Object> returnMap = new HashMap();
        returnMap.put("result", true);
        return returnMap;
    }

    /**
     * 修改学生
     * @param updateinfo
     * @return
     */
    @RequestMapping("modifyStudent")
    @ResponseBody
    public Object modifyStudent(@RequestParam("updateinfo") String updateinfo,@RequestParam("approvalobect") String approvalobect) {
        Map<String, Object> returnMap = new HashMap();
        JSONObject jsonObject = JSONObject.fromObject(updateinfo);
        JSONObject apprvalObject = JSONObject.fromObject(approvalobect);
        Edu001 edu001 = (Edu001) JSONObject.toBean(jsonObject, Edu001.class);
        Edu600 edu600 = (Edu600) JSONObject.toBean(apprvalObject, Edu600.class);
        List<Edu001> currentAllStudent = studentManageService.queryAllStudent();

        // 判断身份证是否存在
        boolean IdcardHave= false;
        for (int i = 0; i < currentAllStudent.size(); i++) {
            if (!currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())
                    && currentAllStudent.get(i).getSfzh().equals(edu001.getSfzh())) {
                IdcardHave = true;
                break;
            }
        }

        // 判断是否改变行政班
        boolean isChangeXZB = false;
        for (int i = 0; i < currentAllStudent.size(); i++) {
            if (currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())) {
                if (currentAllStudent.get(i).getEdu300_ID() == null
                        || currentAllStudent.get(i).getEdu300_ID().equals("")) {
                    isChangeXZB = true;
                    break;
                } else {
                    if (!currentAllStudent.get(i).getEdu300_ID().equals(edu001.getEdu300_ID())) {
                        isChangeXZB = true;
                        break;
                    }
                }
            }
        }

        boolean studentSpill=false;
        // 不存在则修改学生
        if (!IdcardHave) {
            //如果修改操作为修改学生状态为休学 发送审批流对象
            Edu001 oldEdu001 = studentManageService.queryStudentBy001ID(edu001.getEdu001_ID().toString());
            if(edu001.getZtCode().equals("002") && !"002".equals(oldEdu001.getZtCode())){
                edu001.setZtCode("007");
                edu001.setZt("休学申请中");
                edu600.setBusinessKey(edu001.getEdu001_ID());
            }
            if (!isChangeXZB) {
                // 没有修改行政班的情况
                studentManageService.addStudent(edu001);
            } else {
                // 判断修改是否会超过行政班容纳人数
                studentSpill = studentManageService.administrationClassesIsSpill(edu001.getEdu300_ID());
                if(!studentSpill){
                    studentManageService.updateStudent(edu001);
                }
            }
            approvalProcessService.initiationProcess(edu600);
        }

        returnMap.put("newStudentInfo", edu001);
        returnMap.put("studentSpill", studentSpill);
        returnMap.put("IdcardHave", IdcardHave);
        returnMap.put("result", true);
        return returnMap;
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
    public void downloadStudentModal(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
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
    public void downloadModifyStudentsModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "modifyStudentIDs") String modifyStudentIDs) throws IOException, ParseException {
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
    }

    /**
     * 导入学生
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping("importStudent")
    @ResponseBody
    public Object importStudent(@RequestParam("file") MultipartFile file) throws Exception {
        Map<String, Object> returnMap = utils.checkStudentFile(file, "ImportEdu001", "导入学生信息");
        boolean modalPass = (boolean) returnMap.get("modalPass");
        if (!modalPass) {
            return returnMap;
        }

        if(!returnMap.get("dataCheck").equals("")){
            boolean dataCheck = (boolean) returnMap.get("dataCheck");
            if (!dataCheck) {
                return returnMap;
            }
        }

        if(!returnMap.get("importStudent").equals("")){
            List<Edu001> importStudent = (List<Edu001>) returnMap.get("importStudent");
            String yxbz = "1";
            for (int i = 0; i < importStudent.size(); i++) {
                Edu001 edu001 = importStudent.get(i);
                edu001.setYxbz(yxbz);
                edu001.setXh(studentManageService.getNewStudentXh(edu001.getEdu300_ID())); //新生的学号
                studentManageService.addStudent(edu001); // 新增学生
                List<Edu301> teachingClassesBy300id = administrationPageService.queryTeachingClassByXzbCode(edu001.getEdu300_ID());
                String xzbid = edu001.getEdu300_ID();
                studentManageService.addStudentUpdateCorrelationInfo(teachingClassesBy300id, xzbid);
            }
        }
        return returnMap;
    }

    /**
     * 批量修改学生
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("modifyStudents")
    @ResponseBody
    public Object modifyStudents(HttpServletRequest request) throws Exception {
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String approvalInfo = multipartRequest.getParameter("approvalInfo"); //接收客户端传入文件携带的审批流参数
        //格式化审批流信息
        JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
        Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);

        Map<String, Object> returnMap = utils.checkStudentFile(file, "ModifyEdu001", "已选学生信息");
        boolean modalPass = (boolean) returnMap.get("modalPass");
        if (!modalPass) {
            return returnMap;
        }

        if(!returnMap.get("dataCheck").equals("")){
            boolean dataCheck = (boolean) returnMap.get("dataCheck");
            if (!dataCheck) {
                return returnMap;
            }
        }

        if(!returnMap.get("importStudent").equals("")){
            List<Edu001> modifyStudents = (List<Edu001>) returnMap.get("importStudent");
            for (int i = 0; i < modifyStudents.size(); i++) {
                //如果修改操作为修改学生状态为休学 发送审批流对象
                Edu001 oldEdu001 = studentManageService.queryStudentBy001ID(modifyStudents.get(i).getEdu001_ID().toString());
                if(modifyStudents.get(i).getZtCode().equals("002") && !"002".equals(oldEdu001.getZtCode())){
                    modifyStudents.get(i).setZtCode("007");
                    modifyStudents.get(i).setZt("休学申请中");
                    edu600.setBusinessKey(modifyStudents.get(i).getEdu001_ID());
                }
                studentManageService.updateStudent(modifyStudents.get(i)); //修改学生
                approvalProcessService.initiationProcess(edu600);
            }
            returnMap.put("modifyStudentsInfo", modifyStudents);
        }
        return returnMap;
    }

    /**
     * 检验导入学生的文件
     *
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyImportStudentFile")
    @ResponseBody
    public Object verifiyImportStudentFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> returnMap = new HashMap();
        Map<String, Object> checkRS = utils.checkStudentFile(file, "ImportEdu001", "导入学生信息");
        checkRS.put("result", true);
        return checkRS;
    }

    /**
     * 检验修改学生的文件
     *
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyModifyStudentFile")
    @ResponseBody
    public Object verifiyModifyStudentFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> returnMap = new HashMap();
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
    public Object graduationStudents(@RequestParam String choosendStudents) {
        Map<String, Object> returnMap = new HashMap();
        com.alibaba.fastjson.JSONArray graduationArray = JSON.parseArray(choosendStudents);
        for (int i = 0; i < graduationArray.size(); i++) {
            studentManageService.graduationStudents(graduationArray.get(i).toString());
        }
        returnMap.put("result", true);
        return returnMap;
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
    public Object studentMangerSearchStudent(@RequestParam String SearchCriteria) {
        Map<String, Object> returnMap = new HashMap();
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

        List<Edu001> studentInfo = studentManageService.studentMangerSearchStudent(edu001);
        returnMap.put("studentInfo", studentInfo);
        returnMap.put("result", true);
        return returnMap;
    }

}

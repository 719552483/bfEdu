package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.CourseCheckOnPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu101Dao;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.AdministrationPageService;
import com.beifen.edu.administration.service.ApprovalProcessService;
import com.beifen.edu.administration.service.StaffManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
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
import java.util.*;

//教职工管理控制层
@Controller
public class StaffManageController {

    @Autowired
    private AdministrationPageService administrationPageService;
    @Autowired
    private ApprovalProcessService approvalProcessService;
    @Autowired
    private StaffManageService staffManageService;
    @Autowired
    private Edu101Dao edu101Dao;

    ReflectUtils utils = new ReflectUtils();
    /**
     * 新增教师
     * @param newTeacherInfo
     * @return
     */
    @RequestMapping("addTeacher")
    @ResponseBody
    public Object addTeacher(@RequestParam("addInfo") String newTeacherInfo, @RequestParam("approvalInfo") String approvalInfo) {
        Map<String, Object> returnMap = new HashMap();
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.fromObject(newTeacherInfo);
        JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
        Edu101 edu101 = (Edu101) JSONObject.toBean(jsonObject, Edu101.class);
        Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);
        List<Edu101> allTeacher = staffManageService.queryAllTeacher();
        // 判断身份证是否存在
        boolean IDcardIshave = false;
        for (int i = 0; i < allTeacher.size(); i++) {
            if(allTeacher.get(i).getSfzh()!=null){
                if(allTeacher.get(i).getSfzh().equals(edu101.getSfzh())){
                    IDcardIshave=true;
                    break;
                }
            }
        }

        if (!IDcardIshave) {
            String jzgh = staffManageService.getNewTeacherJzgh();
            edu101.setJzgh(jzgh);
            staffManageService.addTeacher(edu101);
            //如果新增教师是外聘教师 发起审批流
            if(edu101.getJzglxbm().equals("004")){
                edu101.setWpjzgspzt("passing");
                edu600.setBusinessKey(edu101.getEdu101_ID());
                approvalProcessService.initiationProcess(edu600);
            }
            returnMap.put("newId", edu101.getEdu101_ID());
            returnMap.put("jzgh", jzgh);
        }

        returnMap.put("IDcardIshave", IDcardIshave);
        returnMap.put("result", true);
        return returnMap;
    }

    /**
     * 修改教师
     * @param modifyInfo
     * @return
     */
    @RequestMapping("modifyTeacher")
    @ResponseBody
    public ResultVO modifyTeacher(@RequestParam String modifyInfo,@RequestParam("approvalInfo") String approvalInfo) {
//        Map<String, Object> returnMap = new HashMap();
        // 将收到的jsonObject转为javabean 关系管理实体类
        JSONObject jsonObject = JSONObject.fromObject(modifyInfo);
        JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
        Edu101 edu101 = (Edu101) JSONObject.toBean(jsonObject, Edu101.class);
        Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);
        List<Edu101> allTeacher = staffManageService.queryAllTeacher();
        // 判断身份证是否存在
//        boolean IDcardIshave = false;
        if(edu101.getSfzh() != null && !"".equals(edu101.getSfzh())) {
            for (int i = 0; i < allTeacher.size(); i++) {
                if (allTeacher.get(i).getSfzh() != null) {
                    List<Edu101> edu101List = edu101Dao.teacherIDcardIsExist(allTeacher.get(i).getSfzh(), edu101.getEdu101_ID());
                    if (edu101List.size() != 0) {
//                    IDcardIshave=true;
//                    returnMap.put("IDcardIshave", IDcardIshave);
//                    returnMap.put("result", false);
                        return ResultVO.setFailed("身份证号重复，请重新修改！");
                    }
                }
            }
        }
//        if (!IDcardIshave) {
            //如果修改是将教师改为外聘教师 发起审批流
            if(edu101.getJzglxbm().equals("004")){
                edu101.setWpjzgspzt("passing");
                edu600.setBusinessKey(edu101.getEdu101_ID());
                approvalProcessService.initiationProcess(edu600);
            }
            return staffManageService.updateTeacher(edu101);
//        }
    }



    /**
     * 删除教师
     * 课节id唯一  所以不需要考虑是否选择了学年
     */
    @RequestMapping("/removeTeacher")
    @ResponseBody
    public Object removeTeacher(@RequestParam String removeIDs) {
        Map<String, Object> returnMap = new HashMap();
        com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(removeIDs);
        boolean canRemove=true;
        for (int i = 0; i < deleteArray.size(); i++) {
            //查询教师是否有任务书
            canRemove= staffManageService.checkTeacherTasks(deleteArray.get(i).toString());
            if(!canRemove){
                break;
            }
        }


        if(canRemove){
            //删除教师
            for (int i = 0; i < deleteArray.size(); i++) {
                staffManageService.removeTeacher(deleteArray.get(i).toString());
            }
        }
        returnMap.put("result", true);
        returnMap.put("canRemove", canRemove);
        return returnMap;
    }


    /**
     * 下载课程导入模板
     *
     * @return returnMap
     * @throws IOException
     * @throws ParseException
     */
    @RequestMapping("downloadNewClassModel")
    @ResponseBody
    public void downloadNewClassModel(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createImportNewClassModel(workbook);
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="ImportClass";
        }else{
            fileName="导入课程模板";
        }
        utils.loadModal(response,fileName, workbook);
    }


    /**
     * 检验课程导入的文件
     *
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyImportNewClassFile")
    @ResponseBody
    public Object verifiyImportNewClassFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> returnMap = new HashMap();
        Map<String, Object> checkRS = utils.checkNewClassFile(file, "ImportClass", "导入课程信息");
        checkRS.put("result", true);
        return checkRS;
    }

    /**
     * 下载教师导入模板
     *
     * @return returnMap
     * @throws IOException
     * @throws ParseException
     */
    @RequestMapping("downloadTeacherModal")
    @ResponseBody
    public void downloadTeacherModal(HttpServletRequest request,HttpServletResponse response) throws IOException, ParseException {
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createImportTeacherModal(workbook);
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="ImportTeacher";
        }else{
            fileName="导入教职工模板";
        }
        utils.loadModal(response,fileName, workbook);
    }


    /**
     * 检验导入教师的文件
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyImportTeacherFile")
    @ResponseBody
    public Object verifiyImportTeacherFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> returnMap = new HashMap();
        Map<String, Object> checkRS = utils.checkTeacherFile(file, "ImportEdu101", "导入教职工信息");
        checkRS.put("result", true);
        return checkRS;
    }


    /**
     * 导入教师
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("importTeacher")
    @ResponseBody
    public Object importTeacher(HttpServletRequest request) throws Exception {
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String approvalInfo = multipartRequest.getParameter("approvalInfo"); //接收客户端传入文件携带的审批流参数
        //格式化审批流信息
        JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
        Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);

        Map<String, Object> returnMap = utils.checkTeacherFile(file, "ImportEdu101", "导入教职工信息");
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

        if(!returnMap.get("importTeacher").equals("")){
            List<Edu101> importTeacher = (List<Edu101>) returnMap.get("importTeacher");
            String yxbz = "1";
            for (int i = 0; i < importTeacher.size(); i++) {
                Edu101 edu101 = importTeacher.get(i);
                String jzgh = staffManageService.getNewTeacherJzgh(); //新教师的教职工号
                edu101.setJzgh(jzgh);
                staffManageService.addTeacher(edu101); // 新增教师
                if(edu101.getJzglxbm().equals("004")){
                    edu101.setWpjzgspzt("passing");
                    edu600.setBusinessKey(importTeacher.get(i).getEdu101_ID());
                    approvalProcessService.initiationProcess(edu600);
                }
            }
        }
        return returnMap;
    }


    /**
     * 下载教师更新模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("downloadModifyTeachersModal")
    @ResponseBody
    public void downloadModifyTeachersModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "modifyTeacherIDs") String modifyTeacherIDs) throws IOException, ParseException {
        // 根据ID查询已选学生信息
        com.alibaba.fastjson.JSONArray modifyTeacherArray = JSON.parseArray(modifyTeacherIDs);
        List<Edu101> chosedTeachers=new ArrayList<Edu101>();
        for (int i = 0; i < modifyTeacherArray.size(); i++) {
            Edu101 edu101= staffManageService.queryTeacherBy101ID(modifyTeacherArray.get(i).toString());
            chosedTeachers.add(edu101);
        }
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="modifyTeachers";
        }else{
            fileName="批量更新教职工模板";
        }
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createModifyTeacherModal(workbook,chosedTeachers);
        utils.loadModal(response,fileName, workbook);
    }


    /**
     * 检验修改教师的文件
     *
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     * @throws ServletException
     */
    @RequestMapping("verifiyModifyTeacherFile")
    @ResponseBody
    public Object verifiyModifyTeacherFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
        Map<String, Object> returnMap = new HashMap();
        Map<String, Object> checkRS = utils.checkTeacherFile(file, "ModifyEdu101", "已选教职工信息");
        checkRS.put("result", true);
        return checkRS;
    }


    /**
     * 批量修改教师
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping("modifyTeachers")
    @ResponseBody
    public Object modifyTeachers(HttpServletRequest request) throws Exception {
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String approvalInfo = multipartRequest.getParameter("approvalInfo"); //接收客户端传入文件携带的审批流参数
        //格式化审批流信息
        JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
        Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);
        Map<String, Object> returnMap = utils.checkTeacherFile(file, "ModifyEdu101", "已选教职工信息");

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

        if(!returnMap.get("importTeacher").equals("")){
            List<Edu101> modifyTeachers = (List<Edu101>) returnMap.get("importTeacher");
            for (int i = 0; i < modifyTeachers.size(); i++) {
                staffManageService.addTeacher(modifyTeachers.get(i)); //修改教师
                if(modifyTeachers.get(i).getJzglxbm().equals("004")){
                    modifyTeachers.get(i).setWpjzgspzt("passing");
                    edu600.setBusinessKey(modifyTeachers.get(i).getEdu101_ID());
                    approvalProcessService.initiationProcess(edu600);
                }
            }
            returnMap.put("modifyTeachersInfo", modifyTeachers);
        }
        return returnMap;
    }


    /**
     * 根据权限查询所有教师
     * @param userId
     * @return
     */
    @RequestMapping("queryAllTeacher")
    @ResponseBody
    public ResultVO queryAllTeacher(@RequestParam("userId") String userId) {
        ResultVO result = staffManageService.queryAllTeacherByUserId(userId);
        return result;
    }

    /**
     * 查询所有教师
     *
     * @return returnMap
     */
    @RequestMapping("queryAllTeachers")
    @ResponseBody
    public ResultVO queryAllTeacher() {
        ResultVO result = staffManageService.queryAllTeachers();
        return result;
    }

    /**
     * 搜索教师
     *
     * @param SearchCriteria
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("searchTeacher")
    @ResponseBody
    public ResultVO SearchTeacher(@RequestParam String SearchCriteria,@RequestParam("userId") String userId) {
        JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
        String szxb ="";
        String zy = "";
        String zc = "";
        String xm ="";
        String jzgh = "";
        String szxbmc = "";

        if (jsonObject.has("departmentCode")){
            szxb = jsonObject.getString("departmentCode");
        }
        if (jsonObject.has("zy")){
            zy = jsonObject.getString("zy");
        }
        if (jsonObject.has("zc")){
            zc = jsonObject.getString("zc");
        }
        if (jsonObject.has("xm")){
            xm = jsonObject.getString("xm");
        }
        if (jsonObject.has("jzgh")){
            jzgh = jsonObject.getString("jzgh");
        }
        if (jsonObject.has("departmentName")){
            szxbmc = jsonObject.getString("departmentName");
        }

        Edu101 edu101 = new Edu101();
        edu101.setSzxb(szxb);
        edu101.setZy(zy);
        edu101.setZc(zc);
        edu101.setXm(xm);
        edu101.setJzgh(jzgh);
        edu101.setSzxbmc(szxbmc);
        ResultVO result = administrationPageService.searchTeacher(edu101,userId);
        return result;
    }

    /**
     * 搜索教师
     *
     * @param SearchCriteria
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("searchAllTeacher")
    @ResponseBody
    public ResultVO searchAllTeacher(@RequestParam String SearchCriteria) {
        JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
        String xm ="";
        String jzgh = "";
        String szxbmc = "";

        if (jsonObject.has("xm")){
            xm = jsonObject.getString("xm");
        }
        if (jsonObject.has("jzgh")){
            jzgh = jsonObject.getString("jzgh");
        }
        if (jsonObject.has("departmentName")){
            szxbmc = jsonObject.getString("departmentName");
        }

        Edu101 edu101 = new Edu101();
        edu101.setXm(xm);
        edu101.setJzgh(jzgh);
        edu101.setSzxbmc(szxbmc);
        ResultVO result = administrationPageService.searchAllTeacher(edu101);
        return result;
    }

    /**
     * 查询需要录入成绩的名单
     * @param userId
     * @param SearchCriteria
     * @return
     */
    @RequestMapping("queryGrades")
    @ResponseBody
    public ResultVO queryGrades(@RequestParam("userId") String userId,@RequestParam("SearchCriteria") String SearchCriteria) {
        JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
        Edu001 edu001 = new Edu001();
        edu001.setPycc(jsonObject.getString("level"));
        edu001.setSzxb(jsonObject.getString("department"));
        edu001.setNj(jsonObject.getString("grade"));
        edu001.setZybm(jsonObject.getString("major"));
        edu001.setXm(jsonObject.getString("studentName"));
        edu001.setXh(jsonObject.getString("studentNumber"));
        edu001.setXzbname(jsonObject.getString("className"));
        Edu005 edu005 = new Edu005();
        edu005.setCourseName(jsonObject.getString("courseName"));
        edu005.setXnid(jsonObject.getString("xnid"));
        ResultVO result = staffManageService.queryGrades(userId,edu001,edu005);
        return result;
    }

    /**
     * 查询未确认成绩班级名单
     * @param userId
     * @return
     */
    @RequestMapping("searchCourseGetGradeByTeacher")
    @ResponseBody
    public ResultVO searchCourseGetGradeByTeacher(@RequestParam("userId") String userId) {

        ResultVO result = staffManageService.searchCourseGetGradeByTeacher(userId);
        return result;
    }

    /**
     * 录入或修改成绩
     *
     * @return returnMap
     */
    @RequestMapping("giveGrade")
    @ResponseBody
    public ResultVO giveGrade(@RequestParam("gradeObject") String gradeObject) {
        com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(gradeObject);
        Edu005 edu005 = JSON.toJavaObject(jsonObject, Edu005.class);
        ResultVO result = staffManageService.giveGrade(edu005);
        return result;
    }

    /**
     * 修改补考成绩
     *
     * @return returnMap
     */
    @RequestMapping("updateMakeUpGrade")
    @ResponseBody
    public ResultVO updateMakeUpGrade(@RequestParam("gradeObjectList") String gradeObject,@RequestParam("userId")String userId) {
        List<Edu0051> edu0051s = JSON.parseArray(gradeObject, Edu0051.class);
        ResultVO result = staffManageService.updateMakeUpGrade(edu0051s,userId);
        return result;
    }

    /**
     * 确认成绩并生成补考标识
     *
     * @return returnMap
     */
    @RequestMapping("confirmGrade")
    @ResponseBody
    public ResultVO confirmGrade(@RequestParam("gradeInfo") String gradeInfo,@RequestParam("userKey") String userKey) {
        Edu005 edu005 = JSON.parseObject(gradeInfo, Edu005.class);
        ResultVO result = staffManageService.confirmGrade(edu005,userKey);
        return result;
    }

    /**
     * 验证是成绩是否存在
     *
     * @return returnMap
     */
    @RequestMapping("wantDownloadGradeModal")
    @ResponseBody
    public ResultVO wantDownloadGradeModal(@RequestParam("gradeInfo") String gradeInfo) {
        ResultVO result;
        Edu005 edu005 = JSON.parseObject(gradeInfo, Edu005.class);
        List<Edu005> edu005List = administrationPageService.checkGradeInfo(edu005);
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以录入的成绩，请重新输入");
        } else {
            result = ResultVO.setSuccess("共找到"+edu005List.size()+"条可录入成绩");
        }
        return result;
    }


    /**
     * 下载成绩模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("downloadGradeModal")
    @ResponseBody
    public ResultVO downloadGradeModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "gradeInfo") String gradeInfo) {
        ResultVO result;
        Edu005 edu005 = JSON.parseObject(gradeInfo, Edu005.class);
        List<Edu005> edu005List = administrationPageService.checkGradeInfo(edu005);
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以录入的成绩，请重新输入");
        } else {
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="modifyGrade";
            }else{
                fileName=edu005.getXn()+edu005.getClassName()+edu005.getCourseName()+"成绩模板";

            }
            //创建Excel文件
            XSSFWorkbook workbook = administrationPageService.creatGradeModel(edu005List);
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
     * 查询补考成绩
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("getHistoryGrade")
    @ResponseBody
    public ResultVO getHistoryGrade(@RequestParam(value = "Edu005Id") String Edu005Id) {
        ResultVO result = administrationPageService.getHistoryGrade(Edu005Id);
        return result;
    }

    /**
     * 溯源数据
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("rootsData")
    @ResponseBody
    public ResultVO rootsData() {
        ResultVO result = administrationPageService.rootsData();
        return result;
    }



    /**
     * 导出成绩excel
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportGrade")
    @ResponseBody
    public ResultVO exportGrade(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
        String classes = jsonObject.getString("classes");
        String crouses = jsonObject.getString("crouses");
        String trem = jsonObject.getString("trem");
        List<String> list = Arrays.asList(crouses.split(","));
        List<Edu005> edu005List = administrationPageService.getExportGrade(classes,trem,list);
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="modifyGrade";
            }else{
                fileName=edu005List.get(0).getClassName()+"成绩单";
            }
            //创建Excel文件
            XSSFWorkbook workbook = administrationPageService.exportGrade(edu005List,list.size());
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
     * 导出成绩excel(明细)
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportGradeAll")
    @ResponseBody
    public ResultVO exportGradeAll(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
        String classes = jsonObject.getString("classes");
        String crouses = jsonObject.getString("crouses");
        String trem = jsonObject.getString("trem");
        List<String> list = Arrays.asList(crouses.split(","));
        List<Edu005> edu005List = administrationPageService.getExportGrade(classes,trem,list);
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="modifyGrade";
            }else{
                fileName=edu005List.get(0).getClassName()+"成绩单";
            }
            //创建Excel文件
            XSSFWorkbook workbook = administrationPageService.exportGradeAll(edu005List,list.size());
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
     * 导出成绩excel-查询
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("selectGrade")
    @ResponseBody
    public ResultVO selectGrade(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
        String classes = jsonObject.getString("classes");
        String crouses = jsonObject.getString("crouses");
        String trem = jsonObject.getString("trem");
        List<String> list = Arrays.asList(crouses.split(","));
        List<Edu005> edu005List = administrationPageService.getExportGrade(classes,trem,list);
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到数据，请重新输入");
        }else{
            result = ResultVO.setSuccess("查找成功",edu005List);
        }
        return result;
    }

    /**
     * 查询-导出不合格成绩excel
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("selectMakeUpGradeCheck")
    @ResponseBody
    public ResultVO selectMakeUpGradeCheck(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
//        String classes = jsonObject.getString("classes");
        String crouse = jsonObject.getString("crouse");
        String trem = jsonObject.getString("trem");

        List<Edu0051> edu0051List = administrationPageService.exportMakeUpGrade(trem,crouse);
        if(edu0051List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            result = ResultVO.setSuccess("查找成功",edu0051List);
        }
        return result;
    }

    /**
     * 校验-导出不合格成绩excel
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportMakeUpGradeCheck")
    @ResponseBody
    public ResultVO exportMakeUpGradeCheck(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
//        String classes = jsonObject.getString("classes");
        String crouse = jsonObject.getString("crouse");
        String trem = jsonObject.getString("trem");

        List<Edu0051> edu0051List = administrationPageService.exportMakeUpGrade(trem,crouse);
        if(edu0051List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            result = ResultVO.setSuccess("成功");
        }
        return result;
    }

    /**
     * 校验-导出不合格成绩excel模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportMakeUpGradeCheckModel")
    @ResponseBody
    public ResultVO exportMakeUpGradeCheckModel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
//        String classes = jsonObject.getString("classes");
        String crouse = jsonObject.getString("crouse");
        String trem = jsonObject.getString("trem");
        String classes = jsonObject.getString("classes");
        String userId = jsonObject.getString("userId");
        List<String> cc = Arrays.asList(crouse.split(","));
        List<Edu005> edu005List  = new ArrayList<>();
        if(!"".equals(classes) && classes != null){
            List<String> classs = Arrays.asList(classes.split(","));
            edu005List = administrationPageService.exportMakeUpGradeCheckModel(trem,cc,classs,userId);
        }else{
            edu005List = administrationPageService.exportMakeUpGradeCheckModel(trem,cc,userId);
        }
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            result = ResultVO.setSuccess("成功");
        }
        return result;
    }


    /**
     * 导出不合格成绩excel模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportMakeUpGradeModel")
    @ResponseBody
    public ResultVO exportMakeUpGradeModel(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
//        String classes = jsonObject.getString("classes");
        String crouse = jsonObject.getString("crouse");
        String trem = jsonObject.getString("trem");
        String classes = jsonObject.getString("classes");
        String userId = jsonObject.getString("userId");
        List<String> cc = Arrays.asList(crouse.split(","));
        List<Edu005> edu005List  = new ArrayList<>();
        if(!"".equals(classes) && classes != null){
            List<String> classs = Arrays.asList(classes.split(","));
            edu005List = administrationPageService.exportMakeUpGradeCheckModel(trem,cc,classs,userId);
        }else{
            edu005List = administrationPageService.exportMakeUpGradeCheckModel(trem,cc,userId);
        }
        if(edu005List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="makeupGrade";
            }else{
                if("F".equals(edu005List.get(0).getIsExamCrouse())){
                    fileName="补考成绩录入单";
                }else{
                    fileName="补考成绩录入名单";
                }
            }
            //创建Excel文件
            XSSFWorkbook workbook = administrationPageService.exportMUGradeModel(edu005List);
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
     * 导出不合格成绩excel
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportMakeUpGrade")
    @ResponseBody
    public ResultVO exportMakeUpGrade(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "queryInfo") String queryInfo) {
        ResultVO result;
        JSONObject jsonObject = JSONObject.fromObject(queryInfo);
//        String classes = jsonObject.getString("classes");
        String crouse = jsonObject.getString("crouse");
        String trem = jsonObject.getString("trem");

        List<Edu0051> edu0051List = administrationPageService.exportMakeUpGrade(trem,crouse);
        if(edu0051List.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的成绩，请重新输入");
        }else{
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="makeupGrade";
            }else{
                fileName=edu0051List.get(0).getCourseName()+"成绩单";
            }
            //创建Excel文件
            XSSFWorkbook workbook = administrationPageService.exportMUGrade(edu0051List);
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
     * 校验导入成绩文件
     * @param file
     * @return
     */
    @RequestMapping("checkGradeFile")
    @ResponseBody
    public ResultVO checkGradeFile(MultipartFile file){
        ResultVO result = administrationPageService.checkGradeFile(file);
        return result;
    }

    /**
     * 导入成绩文件
     * @return
     */
    @RequestMapping("importGradeFile")
    @ResponseBody
    public ResultVO importGradeFile(HttpServletRequest request){
        ResultVO result;
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String lrrInfo = multipartRequest.getParameter("lrrInfo"); //接收客户端传入文件携带的录入人参数
        //格式化录入人信息
        JSONObject jsonObject = JSONObject.fromObject(lrrInfo);
        String lrrmc = jsonObject.getString("lrr");
        String userKey = jsonObject.getString("userykey");

        ResultVO checkResult = administrationPageService.checkGradeFile(file);
        if (checkResult.getCode() == 500) {
            return checkResult;
        }

        result = administrationPageService.importGradeFile(file,lrrmc,userKey);

        return result;
    }

    /**
     * 校验导入补考成绩文件
     * @return
     */
    @RequestMapping("checkGradeFileMakeUp")
    @ResponseBody
    public ResultVO checkGradeFileMakeUp(/*MultipartFile file,*/HttpServletRequest request){
        ResultVO resultVO = new ResultVO();
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file");
        String lrrInfo = multipartRequest.getParameter("lrrInfo");
        JSONObject jsonObject = JSONObject.fromObject(lrrInfo);
        String userKey = jsonObject.getString("userykey");
        try {
            resultVO = administrationPageService.checkGradeFileMakeUp(file,userKey);
        } catch (Exception e) {
            e.printStackTrace();
            resultVO = ResultVO.setFailed("模版错误，导入失败");
            return resultVO;
        }

        return resultVO;
    }

    /**
     * 导入补考成绩文件
     * @return
     */
    @RequestMapping("importGradeFileMakeUp")
    @ResponseBody
    public ResultVO importGradeFileMakeUp(HttpServletRequest request){
        ResultVO result;
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String lrrInfo = multipartRequest.getParameter("lrrInfo"); //接收客户端传入文件携带的录入人参数
        //格式化录入人信息
        JSONObject jsonObject = JSONObject.fromObject(lrrInfo);
        String lrrmc = jsonObject.getString("lrr");
        String userKey = jsonObject.getString("userykey");
        ResultVO checkResult = new ResultVO();
        try {
            checkResult = administrationPageService.checkGradeFileMakeUp(file,userKey);
            if(checkResult.getCode() == 500){
                return checkResult;
            }
        }catch (Exception e){
            checkResult = ResultVO.setFailed("模版错误，导入失败");
            return checkResult;
        }
        result = administrationPageService.importGradeFileMakeUp(file,lrrmc,userKey);

        return result;
    }

    /**
     * 考勤录入查询
     * @return
     */
    @RequestMapping("searchCourseCheckOn")
    @ResponseBody
    public ResultVO searchCourseCheckOn(@RequestParam(value = "searchInfo") String searchInfo){
        CourseCheckOnPO searchInfoPO = JSON.parseObject(searchInfo, CourseCheckOnPO.class);
        ResultVO result = administrationPageService.searchCourseCheckOn(searchInfoPO);
        return result;
    }

    /**
     * 下载考勤模板
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("downloadCourseCheckOnModal")
    @ResponseBody
    public ResultVO downloadCourseCheckOnModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "courseId") String courseId) {
        ResultVO result;
        CourseCheckOnPO courseCheckOnPO = staffManageService.getCourseCheckOnInfo(courseId);
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="modifyGrade";
        }else{
            fileName=courseCheckOnPO.getXn()+courseCheckOnPO.getKcmc()+"第"+courseCheckOnPO.getWeek()+"周"+courseCheckOnPO.getXqmc()+courseCheckOnPO.getKjmc()+"考勤情况";

        }
        //创建Excel文件
        XSSFWorkbook workbook = staffManageService.creatCourseCheckOnModal(courseCheckOnPO);
        try {
            utils.loadModalwithNote(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");

        return result;
    }

    /**
     * 校验导入考勤情况文件
     * @param file
     * @return
     */
    @RequestMapping("checkCourseCheckOnFile")
    @ResponseBody
    public ResultVO checkCourseCheckOnFile(MultipartFile file){
        ResultVO result = staffManageService.checkCourseCheckOnFile(file);
        return result;
    }

    /**
     * 导入考勤文件
     * @return
     */
    @RequestMapping("importCourseCheckOnFile")
    @ResponseBody
    public ResultVO importCourseCheckOnFile(HttpServletRequest request){
        ResultVO result;
        MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
        MultipartFile file = multipartRequest.getFile("file"); //文件流
        String lrrInfo = multipartRequest.getParameter("lrrInfo"); //接收客户端传入文件携带的录入人参数
        //格式化录入人信息
        JSONObject jsonObject = JSONObject.fromObject(lrrInfo);
        String lrrmc = jsonObject.getString("lrr");
        String userKey = jsonObject.getString("userykey");

        ResultVO checkResult = staffManageService.checkCourseCheckOnFile(file);
        if (checkResult.getCode() == 500) {
            return checkResult;
        }

        result = staffManageService.importCourseCheckOnFile(file,lrrmc,userKey);

        return result;
    }


    /**
     * 校验导入考勤情况文件
     * @return
     */
    @RequestMapping("searchCourseCheckOnDetail")
    @ResponseBody
    public ResultVO searchCourseCheckOnDetail(@RequestParam(value = "courseId") String courseId){
        ResultVO result = staffManageService.searchCourseCheckOnDetail(courseId);
        return result;
    }

    /**
     * 取消成绩确认
     * @return
     */
    @RequestMapping("cancelGrade")
    @ResponseBody
    public ResultVO cancelGrade(@RequestParam(value = "gradeInfo") String gradeInfo,@RequestParam(value = "approvalInfo") String approvalInfo){
        Edu005 edu005 = JSON.parseObject(gradeInfo, Edu005.class);
        Edu600 edu600 = JSON.parseObject(approvalInfo, Edu600.class);
        ResultVO result = staffManageService.cancelGrade(edu005,edu600);
        return result;
    }


}

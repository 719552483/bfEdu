package com.beifen.edu.administration.service;

import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.DateUtils;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.criteria.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

//学生管理业务层
@Service
public class StudentManageService {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    private AdministrationPageService administrationPageService;
    @Autowired
    private ApprovalProcessService approvalProcessService;
    @Autowired
    private Edu001Dao edu001Dao;
    @Autowired
    private Edu101Dao edu101Dao;
    @Autowired
    private Edu105Dao edu105Dao;
    @Autowired
    private Edu106Dao edu106Dao;
    @Autowired
    private Edu203Dao edu203Dao;
    @Autowired
    private Edu300Dao edu300Dao;
    @Autowired
    private Edu990Dao edu990Dao;
    @Autowired
    private Edu992Dao edu992Dao;
    @Autowired
    private Edu004Dao edu004Dao;
    @Autowired
    private Edu005Dao edu005Dao;
    @Autowired
    private Edu0051Dao edu0051Dao;
    @Autowired
    private Edu201Dao edu201Dao;
    @Autowired
    private Edu204Dao edu204Dao;
    @Autowired
    private Edu400Dao edu400Dao;
    @Autowired
    private Edu500Dao edu500Dao;
    @Autowired
    private Edu501Dao edu501Dao;
    @Autowired
    private Edu502Dao edu502Dao;
    @Autowired
    private Edu006Dao edu006Dao;
    @Autowired
    private Edu007Dao edu007Dao;
    @Autowired
    private Edu000Dao edu000Dao;
    @Autowired
    private RedisUtils redisUtils;




    // 查询所有学生信息
    public List<Edu001> queryAllStudent() {
        return edu001Dao.findAll();
    }

    // 新增学生是否会超过行政班容纳人数
    public boolean administrationClassesIsSpill(String edu300_ID) {
        boolean studentSpill = false;
        int nrrs = edu300Dao.queryXZBrnrs(edu300_ID);
        int counts = edu001Dao.countXzbRS(edu300_ID);

        if ((counts + 1) > nrrs && nrrs != 0) {
            studentSpill = true;
        }
        return studentSpill;
    }

    // 查询学生身份证号是否存在
    public boolean IDcardIshave(String sfzh) {
        boolean isHave = false;
        if (sfzh != null) {
            List<Edu001> IDcards = edu001Dao.IDcardIshave(sfzh);
            if (IDcards.size() > 0)
                isHave = true;
        }
        return isHave;
    }

    // 为新生生成学号
    public String getNewStudentXh(Edu001 edu001) {
        //todo（学号生成规则）
//        String departmentId = edu001.getSzxb();
//        String gradeId = edu001.getNj();
//        String majorId = edu001.getZybm();
        String classId = edu001.getEdu300_ID();
        String newXh = "newXh"+classId;
        return newXh;
    }

    //添新学生
    public ResultVO<Edu001> addNewStudent(Edu001 edu001) {
            ResultVO<Edu001> resultVO = new ResultVO<>();
            // 判断新增学生是否会超过行政班容纳人数
            boolean studentSpill = administrationClassesIsSpill(edu001.getEdu300_ID());
            if (studentSpill) {
                resultVO = ResultVO.setFailed("行政班容纳人数已达上限，请更换班级");
                return resultVO;
            }
            // 判断身份证是否存在
//            boolean IDcardIshave = IDcardIshave(edu001.getSfzh());
//            if (IDcardIshave) {
//                resultVO = ResultVO.setFailed("身份证号重复，请确认后重新输入");
//                return resultVO;
//            }

        String newXh = getNewStudentXh(edu001); //新生的学号
        String yxbz = "1";
        edu001.setYxbz(yxbz);
        edu001.setXh(newXh);
        addStudent(edu001); // 新增学生
        administrationPageService.addAdministrationClassesZXRS(edu001.getEdu300_ID());
        resultVO = ResultVO.setSuccess("新增学生成功",edu001);

        return resultVO;
    }

    // 新增学生
    public void addStudent(Edu001 edu001) {
        edu001Dao.save(edu001);

        Edu990 edu990 = new Edu990();
        edu990.setYhm(edu001.getXh());
        edu990.setMm("123456");
        edu990.setJs("学生");
        edu990.setJsId("8050");
        edu990.setUserKey(edu001.getEdu001_ID().toString());
        edu990.setPersonName(edu001.getXm());
        edu990Dao.save(edu990);

        Edu992 edu992 = new Edu992();
        edu992.setBF990_ID(edu990.getBF990_ID());
        edu992.setBF991_ID(Long.parseLong("8050"));
        edu992Dao.save(edu992);
    }


    // 删除学生
    public ResultVO removeStudentByID(JSONArray deleteArray) {
        ResultVO resultVO = new ResultVO();
        Integer count = 0;
        for (int i = 0; i < deleteArray.size(); i++) {
            JSONObject jsonObject = deleteArray.getJSONObject(i);
            String edu300_ID = jsonObject.getString("edu300_ID");
            Long studentId = jsonObject.getLong("studentId");
            edu001Dao.removeStudentByID(studentId);
            edu300Dao.ZxrsMinusOne(edu300_ID);
            count++;
        }
        resultVO = ResultVO.setSuccess("成功删除了"+count+"个学生");
        return resultVO;
    }

    // 修改学生时修改了行政班的情况
    public void updateStudent(Edu001 oldStudentInfo,Edu001 newStudentInfo) {
        // 新行政班人数加一
        administrationPageService.addAdministrationClassesZXRS(newStudentInfo.getEdu300_ID());

        // 旧行政班未被删除则旧行政班人数减一
        String oldXZB = queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
        if (oldXZB != null) {
            String oldXZBId = edu001Dao.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
            administrationPageService.cutAdministrationClassesZXRS(oldXZBId);
        }
        administrationPageService.changeStudentClass(oldStudentInfo,newStudentInfo);

        // 修改学生
        edu001Dao.save(newStudentInfo);
    }

    // 根据id查询学生信息
    public Edu001 queryStudentBy001ID(String edu001Id) {
        return edu001Dao.queryStudentBy001ID(edu001Id);
    }

    //根据id查学生学号
    public String queryXhBy001ID(String edu001_ID) {
        return edu001Dao.queryXhBy001ID(edu001_ID);
    }

    // 批量发放毕业证
    public ResultVO graduationStudents(com.alibaba.fastjson.JSONArray graduationArray) {
        ResultVO resultVO;
        Integer count = 0;
        for (int i = 0; i < graduationArray.size(); i++) {
            edu001Dao.graduationStudents(graduationArray.get(i).toString());
            count++;
        }
        resultVO = ResultVO.setSuccess("成功发放了"+count+"个毕业证");
        return resultVO;
    }

    // 学生管理搜索学生
    public ResultVO studentMangerSearchStudent(Edu001 edu001,String userId,Integer pageNumber,Integer pageSize) {
        ResultVO resultVO;

        Map<String, Object> returnMap = new HashMap<>();
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        String jzglx = edu101Dao.queryTeacherByUserId(userId);

        pageNumber = pageNumber < 0 ? 0 : pageNumber;
        pageSize = pageSize < 0 ? 10 : pageSize;

        Specification<Edu001> specification = new Specification<Edu001>() {
            @Override
            public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb)
            {
                //page : 0 开始, limit : 默认为 10
                List<Predicate> predicates = new ArrayList<>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String> get("pycc"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String> get("szxb"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.equal(root.<String> get("nj"), edu001.getNj()));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String> get("zybm"), edu001.getZybm()));
                }
                if (edu001.getEdu300_ID() != null && !"".equals(edu001.getEdu300_ID())) {
                    predicates.add(cb.equal(root.<String> get("edu300_ID"), edu001.getEdu300_ID()));
                }
                if (edu001.getZtCode() != null && !"".equals(edu001.getZtCode())) {
                    predicates.add(cb.equal(root.<String> get("ztCode"), edu001.getZtCode()));
                }
                if (edu001.getXjh() != null && !"".equals(edu001.getXjh())) {
                    predicates.add(cb.like(root.<String> get("xjh"), '%' + edu001.getXjh() + '%'));
                }
                if (edu001.getXh() != null && !"".equals(edu001.getXh())) {
                    predicates.add(cb.like(root.<String> get("xh"), '%' + edu001.getXh() + '%'));
                }
                if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
                    predicates.add(cb.like(root.<String> get("xm"), '%' + edu001.getXm() + '%'));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String> get("xzbname"), '%' + edu001.getXzbname() + '%'));
                }
                if(jzglx!=null && !"".equals(jzglx) && !jzglx.contains("教辅人员")){
                    Path<Object> path = root.get("szxb");//定义查询的字段
                    CriteriaBuilder.In<Object> in = cb.in(path);
                    for (int i = 0; i <departments.size() ; i++) {
                        in.value(departments.get(i));//存入值
                    }
                    predicates.add(cb.and(in));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        PageRequest page = new PageRequest(pageNumber-1, pageSize, Sort.Direction.ASC,"xh");

        Page<Edu001> edu001Page = edu001Dao.findAll(specification, page);

        List<Edu001> edu001s = edu001Page.getContent();
        long count = edu001Dao.count(specification);

        if(edu001s.size() == 0) {
            resultVO = ResultVO.setFailed("暂无学生信息");
        } else {
            returnMap.put("rows",edu001s);
            returnMap.put("total",count);
            resultVO = ResultVO.setSuccess("共找到"+count+"个学生",returnMap);
        }
        return resultVO;
    }




    // 查询学生所在行政班ID
    public String queryStudentXzbCode(String edu001Id) {
        return edu001Dao.queryStudentXzbCode(edu001Id);
    }


    public ResultVO modifyStudent(Edu001 edu001, Edu600 edu600) {
        ResultVO resultVO;
        Edu001 oldEdu001 = queryStudentBy001ID(edu001.getEdu001_ID().toString());
        // 判断身份证是否存在
//        List<Edu001> cardList = edu001Dao.checkIdCard(edu001.getSfzh(),edu001.getEdu001_ID());
//        if(cardList.size() != 0) {
//            resultVO = ResultVO.setFailed("身份证号重复，请确认后重新输入");
//            return resultVO;
//        }

        //如果修改操作为修改学生状态为休学 发送审批流对象
        if(edu001.getZtCode().equals("002") && !"002".equals(oldEdu001.getZtCode())){
            edu001.setZtCode("007");
            edu001.setZt("休学申请中");
            edu600.setBusinessKey(edu001.getEdu001_ID());
            boolean isSuccess = approvalProcessService.initiationProcess(edu600);
            if (!isSuccess) {
                resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
                return resultVO;
            }
        }

        // 判断是否改变行政班
        if (oldEdu001.getEdu300_ID().equals(edu001.getEdu300_ID())) {
            edu001.setXh(oldEdu001.getXh());
            edu001Dao.save(edu001);
        } else {
            // 判断修改是否会超过行政班容纳人数
            boolean studentSpill = administrationClassesIsSpill(edu001.getEdu300_ID());
            if(studentSpill){
                resultVO = ResultVO.setFailed("行政班容纳人数已达上限，请更换班级");
                return resultVO;
            } else {
                if(edu001.getXh() == null || "".equals(edu001.getXh())) {
                    resultVO = ResultVO.setFailed("更换行政班需要新的学号，请确认学号后单独修改");
                    return resultVO;
                }
                List<Edu001> edu001List = edu001Dao.checkXH(edu001.getXh(), edu001.getEdu001_ID());
                if(edu001List.size() != 0) {
                    resultVO = ResultVO.setFailed("新输入的学号已存在，请重新输入");
                    return resultVO;
                }
                updateStudent(oldEdu001,edu001);
            }
        }

        resultVO = ResultVO.setSuccess("学生信息修改成功",edu001);
        return resultVO;
    }


    /**
     * 批量导入学生
     * @param file
     * @return
     */
    public ResultVO importStudent(MultipartFile file){
        ResultVO resultVO = new ResultVO();
        Map<String, Object> returnMap = null;
        try {
            returnMap = utils.checkStudentFile(file, "ImportEdu001", "导入学生信息");
        } catch (Exception e) {
            e.printStackTrace();
            resultVO = ResultVO.setFailed("导入失败");
            return resultVO;
        }

        boolean modalPass = (boolean) returnMap.get("modalPass");
        if (!modalPass) {
            resultVO = ResultVO.setFailed("模版错误，导入失败",returnMap);
            return resultVO;
        }

        if(!returnMap.get("dataCheck").equals("")){
            boolean dataCheck = (boolean) returnMap.get("dataCheck");
            if (!dataCheck) {
                resultVO = ResultVO.setFailed("数据格式有误，请修改后重试",returnMap);
                return resultVO;
            }
        }

        Integer count = 0;
        if(!returnMap.get("importStudent").equals("")){
            List<Edu001> importStudent = (List<Edu001>) returnMap.get("importStudent");
            String yxbz = "1";
            for (int i = 0; i < importStudent.size(); i++) {
                Edu001 edu001 = importStudent.get(i);
                edu001.setYxbz(yxbz);
                edu001.setXh(getNewStudentXh(edu001)); //新生的学号
                addStudent(edu001); // 新增学生
                count++;
            }
            resultVO = ResultVO.setSuccess("成功导入了"+count+"个学生",importStudent);
        }

        return resultVO;
    }

    /**
     * 批量修改学生
     * @param file
     * @param edu600
     * @return
     */
    public ResultVO modifyStudents(MultipartFile file, Edu600 edu600) {
        ResultVO resultVO = new ResultVO();
        Map<String, Object> returnMap = null;
        try {
            returnMap = utils.checkStudentFile(file, "ModifyEdu001", "已选学生信息");
        } catch (Exception e) {
            e.printStackTrace();
            resultVO = ResultVO.setFailed("修改失败");
            return resultVO;
        }
        boolean modalPass = (boolean) returnMap.get("modalPass");
        if (!modalPass) {
            resultVO = ResultVO.setFailed("修改失败",returnMap);
            return resultVO;
        }

        if(!returnMap.get("dataCheck").equals("")){
            boolean dataCheck = (boolean) returnMap.get("dataCheck");
            if (!dataCheck) {
                resultVO = ResultVO.setFailed("修改失败",returnMap);
                return resultVO;
            }
        }

        List<Edu001> oldList = new ArrayList<>();
        if(!returnMap.get("importStudent").equals("")){
            List<Edu001> modifyStudents = (List<Edu001>) returnMap.get("importStudent");
            for (int i = 0; i < modifyStudents.size(); i++) {
                ResultVO modifyResult = modifyStudent(modifyStudents.get(i), edu600);//修改学生

                if(!(modifyResult.getCode() == 200)) {
                    for (Edu001 e : oldList) {
                        edu001Dao.save(e);
                    }
                    returnMap.put("matchXh",false);
                    resultVO = ResultVO.setFailed ("修改"+modifyStudents.get(i).getXm()+"时,发现"+modifyResult.getMsg(),returnMap);
                    return resultVO;
                } else {
                    if(oldList.size() != 0) {
                        oldList.add((Edu001)modifyResult.getData());
                    }
                }
            }
            resultVO = ResultVO.setSuccess("成功修改了"+modifyStudents.size()+"个学生",modifyStudents);
        }

        return resultVO;
    }

    //查询学生评价
    public ResultVO queryStudentAppraise(Edu004 edu004) {
        ResultVO resultVO;
        Edu004 one = edu004Dao.findAppraiseByTeacher(edu004.getEdu001_ID().toString(),edu004.getEdu101_ID().toString());
        if (one == null) {
            resultVO = ResultVO.setFailed("此学生暂无评价");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",one);
        }
        return resultVO;
    }


    //增改学生评价
    public ResultVO studentAppraise(List<String> studnetIdList, String userKey,String appraiseInfo,String userName) {
        ResultVO resultVO;

        for (String s : studnetIdList) {
            Edu004 one = edu004Dao.findAppraiseByTeacher(s,userKey);
            if (one != null) {
                one.setAppraiseText(appraiseInfo);
                edu004Dao.save(one);
            } else {
                Edu004 edu004 = new Edu004();
                edu004.setEdu001_ID(Long.parseLong(s));
                edu004.setEdu101_ID(Long.parseLong(userKey));
                edu004.setTeacherName(userName);
                edu004.setAppraiseText(appraiseInfo);
                Date currentTime = new Date();
                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String dateString = formatter.format(currentTime);
                edu004.setCreatDate(dateString);
                edu004Dao.save(edu004);
            }
        }

        resultVO = ResultVO.setSuccess("成功评价了"+studnetIdList.size()+"个学生");
        return resultVO;
    }

    //学生查询成绩
    public ResultVO studentGetGrades(String userKey,Edu005 edu005) {
        ResultVO resultVO;

        String studentCode;
        if(userKey == null || "".equals(userKey)){
            studentCode = "";
        }else{
            Edu001 one = edu001Dao.findOne(Long.parseLong(userKey));
            if(one == null) {
                resultVO = ResultVO.setFailed("您不是本校学生,无法查询成绩");
                return resultVO;
            }
            studentCode = one.getXh();
        }
        Specification<Edu005> specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
//                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
//                    predicates.add(cb.like(root.<String>get("courseName"),"%"+edu005.getCourseName()+"%"));
//                }
                if (edu005.getGrade() != null && !"".equals(edu005.getGrade())) {
                    predicates.add(cb.equal(root.<String>get("xnid"), edu005.getGrade()));
                }
                if (studentCode != null && !"".equals(studentCode)) {
                    predicates.add(cb.equal(root.<String>get("studentCode"), studentCode));
                }
                if (edu005.getEdu300_ID() != null && !"".equals(edu005.getEdu300_ID())) {
                    predicates.add(cb.equal(root.<String>get("Edu300_ID"), edu005.getEdu300_ID()));
                }
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
//                predicates.add(cb.isNotNull(root.<String>get("isConfirm")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无成绩信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu005List);
        }
        return resultVO;
    }



    //根据班级、学科查询成绩
    public ResultVO studentGetGradesByClass(String className,String courseName) {
        ResultVO resultVO;
        List<Edu005> edu005List = edu005Dao.studentGetGradesByClass(className,courseName);
        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无成绩信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu005List);
        }
        return resultVO;
    }

    // 根据班级查询学科
    public ResultVO searchCourseByClass(String edu300_ID,String trem) {
        ResultVO resultVO;
        List<Edu201> edu201List = edu201Dao.searchCourseByClass(edu300_ID,trem);
//        List<Edu201> edu201List2 = edu201Dao.searchCourseByClass2(edu300_ID,trem);
//        edu201List.addAll(edu201List2);
        if (edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课程信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu201List);
        }
        return resultVO;
    }

    // 根据班级查询学科
    public ResultVO searchCourseByClassOnly(String edu300_ID) {
        ResultVO resultVO;
        List<Edu201> edu201List = edu201Dao.searchCourseByClassOnly(edu300_ID);
//        List<Edu201> edu201List2 = edu201Dao.searchCourseByClass2(edu300_ID,trem);
//        edu201List.addAll(edu201List2);
        if (edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课程信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu201List);
        }
        return resultVO;
    }


    // 根据班级查询学科
    public ResultVO searchCourseByClasses(List<String> edu300_IDs,String trem) {
        ResultVO resultVO;
        List<Edu201> edu201List = edu201Dao.searchCourseByClasses(edu300_IDs,trem);

        List<Edu201> collect = edu201List.stream().collect(Collectors.collectingAndThen(
                Collectors.toCollection(
                        () -> new TreeSet<>(Comparator.comparing(user -> user.getKcmc()))),
                ArrayList::new));

//        List<Edu201> edu201List2 = edu201Dao.searchCourseByClass2(edu300_ID,trem);
//        edu201List.addAll(edu201List2);
        if (edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课程信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",collect);
        }
        return resultVO;
    }

    // 根据学年查询学科
    public ResultVO searchCourseByXN(String trem) {
        ResultVO resultVO;
        List<Edu201> edu201List = edu201Dao.searchCourseByXN(trem);
        if (edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课程信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu201List);
        }
        return resultVO;
    }

    // 根据学年、用户id查询学科
    public ResultVO searchCourseByXNAndID(String trem,String userId) {
        ResultVO resultVO;
        String edu101Id = edu101Dao.queryTeacherIdByUserId(userId);
        List<Edu201> edu201List = edu201Dao.searchCourseByXNAndID(trem,edu101Id);
        if (edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课程信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu201List);
        }
        return resultVO;
    }

    // 修改免修状态
    public ResultVO updateMXStatus(String edu005_ID,String mxStatus) {
        ResultVO resultVO;
        edu005Dao.updateMXStatus(edu005_ID,mxStatus);
        resultVO = ResultVO.setSuccess("修改成功");
        return resultVO;
    }

    // 下载打印学生总表-校验
    public ResultVO printStudentGradeCheck(List<String> edu001_ID,String userId) {
        ResultVO resultVO;
        //根据用户ID查询二级学院权限信息
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
        for(int i = 0;i<edu001_ID.size();i++){
            Edu001 e = edu001Dao.findOne(Long.parseLong(edu001_ID.get(i)));
            if(!departments.contains(e.getSzxb())){
                resultVO = ResultVO.setFailed("您没有导出学生（"+e.getSzxbmc()+"）【"+e.getXm()+"】成绩的权限");
                return resultVO;
            }
        }
        resultVO = ResultVO.setSuccess("成功");
        return resultVO;
    }

    // 下载打印学生总表
    public ResultVO printStudentGrade(List<String> edu001IDs) {
        ResultVO resultVO;
        List ll = new ArrayList();
        for(int j = 0;j<edu001IDs.size();j++){
            Map map = new HashMap();
            String edu001_ID = edu001IDs.get(j);
            Edu001 edu001 = edu001Dao.findOne(Long.parseLong(edu001_ID));
            map.put("studentInfo",edu001);
            List<Edu000> edu000List = edu000Dao.queryejdm("cklx");
            map.put("kclx",edu000List);
            List<String> xnList = edu005Dao.findXNListByEdu001ID(edu001_ID);
//        if(xnList.size() == 0){
//            resultVO = ResultVO.setFailed("暂无成绩列表");
//        }
            List gradeList = new ArrayList();
            for(int i = 0;i<xnList.size();i++){
                Map mm = new HashMap();
                String xnid = xnList.get(i);
                List<Edu005> edu005List = edu005Dao.findXNListByEdu001IDAndXNID(edu001_ID,xnid);
                for(Edu005 e: edu005List){
                    String xs = edu005Dao.findzxs(e.getEdu201_ID()+"");
                    String lx = edu005Dao.findkclx(e.getEdu201_ID()+"");
                    e.setXs(xs);
                    e.setLx(lx);
                }
                String grade = edu005Dao.findGradeListByEdu001IDAndXNID(edu001_ID,xnid);
                mm.put("xn",edu005List.get(0).getXn());
                mm.put("getCredit",grade);
                mm.put("gradeList",edu005List);
                gradeList.add(mm);
            }
            map.put("detail",gradeList);
            ll.add(map);
        }
        resultVO = ResultVO.setSuccess("成功",ll);
        return resultVO;
    }

    // 下载打印学生总表
    public ResultVO printStudentGradeOne(List<String> studentIds,String xnid) {
        ResultVO resultVO;
            Map map = new HashMap();
            List ll = new ArrayList();
            String edu001_ID = studentIds.get(0);
            Edu001 edu001 = edu001Dao.findOne(Long.parseLong(edu001_ID));
            map.put("studentInfo",edu001);
            List<Edu000> edu000List = edu000Dao.queryejdm("cklx");
            map.put("kclx",edu000List);
//            List<String> xnList = edu005Dao.findXNListByEdu001ID(edu001_ID);
//        if(xnList.size() == 0){
//            resultVO = ResultVO.setFailed("暂无成绩列表");
//        }
            List gradeList = new ArrayList();
//            for(int i = 0;i<xnList.size();i++){
                Map mm = new HashMap();
//                String xnid = xnList.get(i);
                List<Edu005> edu005List = edu005Dao.findXNListByEdu001IDAndXNID(edu001_ID,xnid);
                for(Edu005 e: edu005List){
                    String xs = edu005Dao.findzxs(e.getEdu201_ID()+"");
                    String lx = edu005Dao.findkclx(e.getEdu201_ID()+"");
                    e.setXs(xs);
                    e.setLx(lx);
                }
                String grade = edu005Dao.findGradeListByEdu001IDAndXNID(edu001_ID,xnid);
                mm.put("xn",edu005List.get(0).getXn());
                mm.put("getCredit",grade);
                mm.put("gradeList",edu005List);
                gradeList.add(mm);
//            }
            map.put("detail",gradeList);
            ll.add(map);
        resultVO = ResultVO.setSuccess("成功",ll);
        return resultVO;
    }


    // 批量修改免修状态
    public String updateMXStatusByCourse(List<String> courserName,String sylxbm,String term) {
        String resultVO;
//        List<Edu005> edu005List = edu005Dao.updateMXStatusByCourse(courserName,sylxbm,term);
//        for(int i = 0;i<edu005List.size();i++){
//            Edu005 edu005 = edu005List.get(i);
//            edu005Dao.updateMXStatus(edu005.getEdu005_ID()+"","01");
//        }
        int i = edu005Dao.selectMXStatusByCourse(courserName,sylxbm,term);
        edu005Dao.updateMXStatusByCourse(courserName,sylxbm,term);
        edu005Dao.updateGetCreditByMXStatus();
        resultVO = "免修了"+i+"个学生";
        return resultVO;
    }

    //学生查询相关学年
    public ResultVO studentGetSchoolYear(String userKey) {
        ResultVO resultVO;
        Edu001 one = edu001Dao.findOne(Long.parseLong(userKey));
        if (one == null ) {
            resultVO = ResultVO.setFailed("您不是本校学生");
            return resultVO;
        }
        List<String> edu201IdList = edu204Dao.searchEdu201IdByEdu300Id(one.getEdu300_ID());
        List<Edu400> edu400List = edu400Dao.getYearFromEdu201(edu201IdList);
        if(edu400List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无学年信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu400List);
        }
        return resultVO;
    }


    //根据用户二级学院权限查询学生
    public ResultVO getStudentByUserDepartment(String userId, StudentBreakPO studentBreakPO) {
        ResultVO resultVO;
        //根据用户ID查询二级学院权限信息
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
        //根据用户二级学院权限查询学生
        Specification<Edu001> specification = new Specification<Edu001>() {
            public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (studentBreakPO.getLevel() != null && !"".equals(studentBreakPO.getLevel())) {
                    predicates.add(cb.equal(root.<String> get("pycc"), studentBreakPO.getLevel()));
                }
                if (studentBreakPO.getDepartment() != null && !"".equals(studentBreakPO.getDepartment())) {
                    predicates.add(cb.equal(root.<String> get("szxb"), studentBreakPO.getDepartment()));
                }
                if (studentBreakPO.getGrade() != null && !"".equals(studentBreakPO.getGrade())) {
                    predicates.add(cb.equal(root.<String> get("nj"), studentBreakPO.getGrade()));
                }
                if (studentBreakPO.getMajor() != null && !"".equals(studentBreakPO.getMajor())) {
                    predicates.add(cb.equal(root.<String> get("zybm"), studentBreakPO.getMajor()));
                }
                Path<Object> path = root.get("szxb");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <departments.size() ; i++) {
                    in.value(departments.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu001> edu001List = edu001Dao.findAll(specification);

        if (edu001List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无学生信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu001List.size()+"个学生",edu001List);
        }

        return resultVO;
    }

    //学生查询违纪记录
    public ResultVO studentFindBreak(String userId) {
        ResultVO resultVO;

        String userType = redisUtils.get(RedisDataConstant.USER_TYPE + userId).toString();

        if ("02".equals(userType)) {
            resultVO = ResultVO.setFailed("您不是本校学生，无法查找违纪记录");
            return resultVO;
        }

        Edu990 edu990 = edu990Dao.queryUserById(userId);
        List<Edu006> edu006List = edu006Dao.findAllByEdu006Ids(edu990.getUserKey());
        if(edu006List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到违纪记录");
        } else{
            resultVO = ResultVO.setSuccess("共找到"+edu006List.size()+"条违纪记录",edu006List);
        }
        return resultVO;

    }

    //学生评价查询
    public ResultVO studentGetAppraise(String userId) {
        ResultVO resultVO;

        String userType = redisUtils.get(RedisDataConstant.USER_TYPE + userId).toString();

        if ("02".equals(userType)) {
            resultVO = ResultVO.setFailed("您不是本校学生，无法查找评价记录");
            return resultVO;
        }

        Edu990 edu990 = edu990Dao.queryUserById(userId);
        List<Edu004> edu004List = edu004Dao.findAllByEdu006Ids(edu990.getUserKey());
        if(edu004List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到评价记录");
        } else{
            resultVO = ResultVO.setSuccess("共找到"+edu004List.size()+"条评价记录",edu004List);
        }
        return resultVO;
    }

    //生成学生名单Excel
    public ResultVO exportStudentExcel(HttpServletRequest request, HttpServletResponse response, Edu001 edu001,String userId) {
        ResultVO resultVO;

        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        Specification<Edu001> specification = new Specification<Edu001>() {
            public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb)
            {
                List<Predicate> predicates = new ArrayList<>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String> get("pycc"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String> get("szxb"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.equal(root.<String> get("nj"), edu001.getNj()));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String> get("zybm"), edu001.getZybm()));
                }
                if (edu001.getEdu300_ID() != null && !"".equals(edu001.getEdu300_ID())) {
                    predicates.add(cb.equal(root.<String> get("Edu300_ID"), edu001.getEdu300_ID()));
                }
                if (edu001.getZtCode() != null && !"".equals(edu001.getZtCode())) {
                    predicates.add(cb.equal(root.<String> get("ztCode"), edu001.getZtCode()));
                }
                if (edu001.getXjh() != null && !"".equals(edu001.getXjh())) {
                    predicates.add(cb.like(root.<String> get("xjh"), '%' + edu001.getXjh() + '%'));
                }
                if (edu001.getXh() != null && !"".equals(edu001.getXh())) {
                    predicates.add(cb.like(root.<String> get("xh"), '%' + edu001.getXh() + '%'));
                }
                if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
                    predicates.add(cb.like(root.<String> get("xm"), '%' + edu001.getXm() + '%'));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String> get("xzbname"), '%' + edu001.getXzbname() + '%'));
                }

                Path<Object> path = root.get("szxb");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <departments.size() ; i++) {
                    in.value(departments.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu001> edu001List = edu001Dao.findAll(specification);

        if(edu001List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的学生");
            return resultVO;
        }

        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName="";
        if(isIE){
            fileName="studentInfo";
        }else{
            fileName="学生名单";
        }
        //创建Excel文件
        XSSFWorkbook workbook  = new XSSFWorkbook();
        utils.createStudentModal(workbook,edu001List);
        try {
            utils.loadModal(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("生成成功");
        return resultVO;
    }

    public List<Edu300> queryStudentReport(String xbbm,String njbm,String batch) {
        List<Edu300> edu300List = new ArrayList<>();
        if(njbm != null && !"".equals(njbm)){
            if(batch != null && !"".equals(batch)){
                edu300List = edu300Dao.queryStudentReport(xbbm,njbm,batch);
            }else{
                edu300List = edu300Dao.queryStudentReport(xbbm,njbm);
            }
        }else{
            edu300List = edu300Dao.queryStudentReport(xbbm);
        }

        return edu300List;
    }

    public List<Edu106> queryCollege(String xbbm) {
        List<Edu106> edu106List = edu106Dao.findAllByDepartmentCode(xbbm);
        return edu106List;
    }

    //学生报表数据-页面-全部
    public ResultVO studentReportDataAll(){
        ResultVO result;
        List<Map> mapList = new ArrayList<>();
        List<Edu300> edu300List = edu300Dao.findAllGroupByZybm();
        List<Edu000> edu000List = edu000Dao.queryejdm("sylx");
        //小计的班级
        List<Long> edu300IdsAll = new ArrayList<>();
        for (int i = 2;i<edu300List.size()+2;i++){
            Map map = new HashMap();
            Edu300 edu300 = edu300List.get(i-2);
            //判断是否为同一批次和年级
            List<Long> edu300Ids = edu300Dao.findAllByZybm(edu300.getNjbm(),edu300.getZybm(),edu300.getBatch());
            if(i != 2){
                Edu300 edu300Last = edu300List.get(i-3);
                if(!edu300.getNjbm().equals(edu300Last.getNjbm()) || !edu300.getBatch().equals(edu300Last.getBatch())){
                    map.put("gradeBatch","小计");
                    //各个类型人数
                    for(int j =0;j<edu000List.size();j++){
                        String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M",edu000List.get(j).getEjdm());
                        map.put("man"+(j+1),lxM);
                        String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F",edu000List.get(j).getEjdm());
                        map.put("woman"+(j+1),lxF);
                    }
                    String xtxm = edu001Dao.queryStudentCode(edu300IdsAll,"M");
                    String xtxf = edu001Dao.queryStudentCode(edu300IdsAll,"F");
                    map.put("xtxm",xtxm);
                    map.put("xtxf",xtxf);
                    String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M"); //合计男
                    String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F"); //合计女
                    map.put("hjM",lxM);
                    map.put("hjF",lxF);
                    String all = edu001Dao.queryStudentCount(edu300IdsAll);
                    map.put("all",all);
                    mapList.add(map);
                    edu300IdsAll.clear();
                    map = new HashMap();
                }
            }
            edu300IdsAll.addAll(edu300Ids);
            //年纪批次
            map.put("gradeBatch",edu300.getNjmc()+edu300.getBatchName());
            //分院
            map.put("xbmc",edu300.getXbmc());
            //专业
            map.put("zymc",edu300.getZymc());
            //各个类型人数
            for(int j =0;j<edu000List.size();j++){
                String lxM = edu001Dao.queryStudentCount(edu300Ids,"M",edu000List.get(j).getEjdm());
                map.put("man"+(j+1),lxM);
                String lxF = edu001Dao.queryStudentCount(edu300Ids,"F",edu000List.get(j).getEjdm());
                map.put("woman"+(j+1),lxF);
            }
            String xtxm = edu001Dao.queryStudentCode(edu300IdsAll,"M");
            map.put("xtxm",xtxm);
            String xtxf = edu001Dao.queryStudentCode(edu300IdsAll,"F");
            map.put("xtxf",xtxf);

            String lxM = edu001Dao.queryStudentCount(edu300Ids,"M");
            map.put("hjM",lxM);
            String lxF = edu001Dao.queryStudentCount(edu300Ids,"F");
            map.put("hjF",lxF);
            String all = edu001Dao.queryStudentCount(edu300Ids);
            map.put("all",all);
            mapList.add(map);
        }
        Map map = new HashMap();
        map.put("gradeBatch","小计");
        //各个类型人数
        for(int j =0;j<edu000List.size();j++){
            String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M",edu000List.get(j).getEjdm());
            map.put("man"+(j+1),lxM);
            String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F",edu000List.get(j).getEjdm());
            map.put("woman"+(j+1),lxF);
        }
        String xtxm = edu001Dao.queryStudentCode(edu300IdsAll,"M");
        String xtxf = edu001Dao.queryStudentCode(edu300IdsAll,"F");
        map.put("xtxm",xtxm);
        map.put("xtxf",xtxf);
        String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M"); //合计男
        String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F"); //合计女
        map.put("hjM",lxM);
        map.put("hjF",lxF);
        String all = edu001Dao.queryStudentCount(edu300IdsAll);
        map.put("all",all);
        mapList.add(map);

        //columns
        Object[] objects = new Object[3];
        List l = new ArrayList();
        //标题
        map = new HashMap();
        map.put("title","辽宁职业学院高职扩招学生汇总表");
        map.put("colspan",edu000List.size()*2+8);
        l.add(map);
        objects[0] = l;
        //第二行
        l = new ArrayList();
        StudentPO studentPO = new StudentPO("gradeBatch","年级批次","middle","center",1,2,"paramsMatter");
        l.add(studentPO);
        studentPO = new StudentPO("xbmc","分院","middle","center",1,2,"paramsMatter");
        l.add(studentPO);
        studentPO = new StudentPO("zymc","专业","middle","center",1,2,"paramsMatter");
        l.add(studentPO);
        List l2 = new ArrayList();
        for(int j =0;j<edu000List.size();j++){
            StudentPO2 studentPO2 = new StudentPO2(edu000List.get(j).getEjdmz(),"middle","center",2,1,"paramsMatter");
            StudentPO3 studentPO3 = new StudentPO3("man"+(j+1),"男","middle","center","peopleNumMatter");
            l2.add(studentPO3);
            studentPO3 = new StudentPO3("woman"+(j+1),"女","middle","center","peopleNumMatter");
            l2.add(studentPO3);
            l.add(studentPO2);
        }
        StudentPO2 studentPO2 = new StudentPO2("休退学","middle","center",2,1,"paramsMatter");
        StudentPO3 studentPO3 = new StudentPO3("xtxm","男","middle","center","peopleNumMatter");
        l2.add(studentPO3);
        studentPO3 = new StudentPO3("xtxf","女","middle","center","peopleNumMatter");
        l2.add(studentPO3);
        l.add(studentPO2);
        studentPO2 = new StudentPO2("合计","middle","center",2,1,"paramsMatter");
        studentPO3 = new StudentPO3("hjM","男","middle","center","peopleNumMatter");
        l2.add(studentPO3);
        studentPO3 = new StudentPO3("hjF","女","middle","center","peopleNumMatter");
        l2.add(studentPO3);
        l.add(studentPO2);
        studentPO = new StudentPO("all","总计","middle","center",1,2,"peopleNumMatter");
        l.add(studentPO);
        objects[1] = l;
        objects[2] = l2;
        Map re = new HashMap();
        re.put("tableInfo",mapList);
        re.put("columns",objects);
        result = ResultVO.setSuccess("查询成功",re);
//        result = ResultVO.setSuccess("查询成功",mapList);
        return result;
    }
    //学生报表数据-页面-各个学院
    public ResultVO studentReportData(List<Edu300> edu300List){
        ResultVO result;
        List<Map> mapList = new ArrayList<>();
        List<Edu000> edu000List = edu000Dao.queryejdm("sylx");
        List<Long> edu300IdsAll = new ArrayList<>();
        for (int i = 2;i<edu300List.size()+2;i++){
            Map map = new HashMap();
            Edu300 edu300 = edu300List.get(i-2);
            if(i != 2){
                Edu300 edu300Last = edu300List.get(i-3);
                if(!edu300.getNjbm().equals(edu300Last.getNjbm()) || !edu300.getBatch().equals(edu300Last.getBatch()) || !edu300.getXbbm().equals(edu300Last.getXbbm())  || !edu300.getZybm().equals(edu300Last.getZybm())){
                    map.put("gradeBatch","小计");
                    //各个类型人数
                    for(int j =0;j<edu000List.size();j++){
                        String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M",edu000List.get(j).getEjdm());
                        map.put("man"+(j+1),lxM);
                        String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F",edu000List.get(j).getEjdm());
                        map.put("woman"+(j+1),lxF);
                    }
                    String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M"); //合计男
                    String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F"); //合计女
                    map.put("hjM",lxM);
                    map.put("hjF",lxF);
                    String all = edu001Dao.queryStudentCount(edu300IdsAll);
                    map.put("all",all);
                    mapList.add(map);
                    edu300IdsAll.clear();
                    map = new HashMap();
                }
            }
            edu300IdsAll.add(edu300.getEdu300_ID());
            map.put("xbzy",edu300.getXbmc()+"-"+edu300.getZymc());
            map.put("gradeBatch",edu300.getNjmc()+edu300.getBatchName());
            map.put("className",edu300.getXzbmc());
            List<Long> edu300Ids = new ArrayList<>();
            edu300Ids.add(edu300.getEdu300_ID());
            for(int j =0;j<edu000List.size();j++){
                String lxM = edu001Dao.queryStudentCount(edu300Ids,"M",edu000List.get(j).getEjdm());
                String lxF = edu001Dao.queryStudentCount(edu300Ids,"F",edu000List.get(j).getEjdm());
                map.put("man"+(j+1),lxM);
                map.put("woman"+(j+1),lxF);
            }
            String lxM = edu001Dao.queryStudentCount(edu300Ids,"M");
            String lxF = edu001Dao.queryStudentCount(edu300Ids,"F");
            map.put("hjM",lxM);
            map.put("hjF",lxF);
            String all = edu001Dao.queryStudentCount(edu300Ids);
            map.put("all",all);
            mapList.add(map);
        }
        Map map = new HashMap();
        map.put("gradeBatch","小计");
        //各个类型人数
        for(int j =0;j<edu000List.size();j++){
            String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M",edu000List.get(j).getEjdm());
            map.put("man"+(j+1),lxM);
            String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F",edu000List.get(j).getEjdm());
            map.put("woman"+(j+1),lxF);
        }
        String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M"); //合计男
        String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F"); //合计女
        map.put("hjM",lxM);
        map.put("hjF",lxF);
        String all = edu001Dao.queryStudentCount(edu300IdsAll);
        map.put("all",all);
        mapList.add(map);

        //columns
        Object[] objects = new Object[3];
        List l = new ArrayList();
        //标题
        map = new HashMap();
        map.put("title",edu300List.get(0).getXbmc()+"扩招汇总表");
        map.put("colspan",edu000List.size()*2+6);
        l.add(map);
        objects[0] = l;
        //第二行
        l = new ArrayList();
        StudentPO studentPO = new StudentPO("gradeBatch","年级批次","middle","center",1,2,"paramsMatter");
        l.add(studentPO);
        studentPO = new StudentPO("xbzy","分院专业","middle","center",1,2,"paramsMatter");
        l.add(studentPO);
        studentPO = new StudentPO("className","班级","middle","center",1,2,"paramsMatter");
        l.add(studentPO);
        List l2 = new ArrayList();
        for(int j =0;j<edu000List.size();j++){
            StudentPO2 studentPO2 = new StudentPO2(edu000List.get(j).getEjdmz(),"middle","center",2,1,"paramsMatter");
            StudentPO3 studentPO3 = new StudentPO3("man"+(j+1),"男","middle","center","peopleNumMatter");
            l2.add(studentPO3);
            studentPO3 = new StudentPO3("woman"+(j+1),"女","middle","center","peopleNumMatter");
            l2.add(studentPO3);
            l.add(studentPO2);
        }
        StudentPO2 studentPO2 = new StudentPO2("合计","middle","center",2,1,"paramsMatter");
        StudentPO3 studentPO3 = new StudentPO3("hjM","男","middle","center","peopleNumMatter");
        l2.add(studentPO3);
        studentPO3 = new StudentPO3("hjF","女","middle","center","peopleNumMatter");
        l2.add(studentPO3);
        l.add(studentPO2);
        studentPO = new StudentPO("all","总计","middle","center",1,2,"peopleNumMatter");
        l.add(studentPO);
        objects[1] = l;
        objects[2] = l2;
        Map re = new HashMap();
        re.put("tableInfo",mapList);
        re.put("columns",objects);
        result = ResultVO.setSuccess("查询成功",re);
        return result;
    }

    //学生报表数据  ugly but useful
    public XSSFWorkbook studentReport() {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("全校扩招汇总表");
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cells[] = new XSSFCell[3];
        // 所有标题数组
        String[] titles = new String[5]; /*{"学年","行政班名称","课程名称","学生姓名", "学号","成绩"}*/
        List<Edu000> edu000List = edu000Dao.queryejdm("sylx");
        titles[0] = "序号";
        titles[1] = "年级批次";
        titles[2] = "分院";
        titles[3] = "专业";
        titles[4] = "辽宁职业学院高职扩招学生汇总表";
        for (int i = 0; i < titles.length; i++) {
            cells[0] = firstRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }
        XSSFRow firstRow2 = sheet.createRow(1);
        XSSFRow firstRow3 = sheet.createRow(2);
        for(int i = 0;i<edu000List.size();i++){
            cells[1] = firstRow2.createCell(i*2+4);
            cells[1].setCellValue(edu000List.get(i).getEjdmz());
            cells[2] = firstRow3.createCell(i*2+4);
            cells[2].setCellValue("男");
            cells[2] = firstRow3.createCell(i*2+5);
            cells[2].setCellValue("女");
            CellRangeAddress region = new CellRangeAddress(1, 1, i*2+4, i*2+5);
            sheet.addMergedRegion(region);
        }
        cells[1] = firstRow2.createCell(edu000List.size()*2+4);
        cells[1].setCellValue("休退学");
        cells[2] = firstRow3.createCell(edu000List.size()*2+4);
        cells[2].setCellValue("男");
        cells[2] = firstRow3.createCell(edu000List.size()*2+5);
        cells[2].setCellValue("女");

        cells[1] = firstRow2.createCell(edu000List.size()*2+6);
        cells[1].setCellValue("合计");
        cells[2] = firstRow3.createCell(edu000List.size()*2+6);
        cells[2].setCellValue("男");
        cells[2] = firstRow3.createCell(edu000List.size()*2+7);
        cells[2].setCellValue("女");
        sheet.addMergedRegion(new CellRangeAddress(1, 1, edu000List.size()*2+4, edu000List.size()*2+5));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, edu000List.size()*2+6, edu000List.size()*2+7));
        cells[1] = firstRow2.createCell(edu000List.size()*2+8);
        cells[1].setCellValue("总计");
        sheet.addMergedRegion(new CellRangeAddress(1, 2, edu000List.size()*2+8, edu000List.size()*2+8));
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 0, 0));//序号
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 1, 1));//年级批次
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 2, 2));//分院
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 3, 3));//专业
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, edu000List.size()*2+8));//辽宁职业学院高职扩招学生汇总表

        //上面都是标题 呕~
        List<Edu300> edu300List = edu300Dao.findAllGroupByZybm();
        //字体居中
        CellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        //小计的数量
        int z = 0;
        //小计的班级
        List<Long> edu300IdsAll = new ArrayList<>();
        for (int i = 2;i<edu300List.size()+2;i++){
            Edu300 edu300 = edu300List.get(i-2);
            //判断是否为同一批次和年级
            List<Long> edu300Ids = edu300Dao.findAllByZybm(edu300.getNjbm(),edu300.getZybm(),edu300.getBatch());
            if(i != 2){
                Edu300 edu300Last = edu300List.get(i-3);
                if(!edu300.getNjbm().equals(edu300Last.getNjbm()) || !edu300.getBatch().equals(edu300Last.getBatch())){
                    utils.appendCell(sheet,i+z,"","小计",-1,0,false,cellStyle);
                    sheet.addMergedRegion(new CellRangeAddress(i+z+1, i+z+1, 0, 3));
                    for(int j =0;j<edu000List.size();j++){
                        String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M",edu000List.get(j).getEjdm());
                        String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F",edu000List.get(j).getEjdm());
                        utils.appendCell(sheet,i+z,"",lxM,-1,4+j*2,false);
                        utils.appendCell(sheet,i+z,"",lxF,-1,5+j*2,false);
                    }
                    String xtxm = edu001Dao.queryStudentCode(edu300IdsAll,"M");
                    String xtxf = edu001Dao.queryStudentCode(edu300IdsAll,"F");
                    utils.appendCell(sheet,i+z,"",xtxm,-1,4+edu000List.size()*2,false);
                    utils.appendCell(sheet,i+z,"",xtxf,-1,5+edu000List.size()*2,false);
                    String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M"); //合计男
                    String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F"); //合计女
                    utils.appendCell(sheet,i+z,"",lxM,-1,6+edu000List.size()*2,false);
                    utils.appendCell(sheet,i+z,"",lxF,-1,7+edu000List.size()*2,false);
                    String all = edu001Dao.queryStudentCount(edu300IdsAll);
                    utils.appendCell(sheet,i+z,"",all,-1,8+edu000List.size()*2,false);
                    z++;
                    edu300IdsAll.clear();
                }
            }
            edu300IdsAll.addAll(edu300Ids);
            utils.appendCell(sheet,i+z,"",(i-1)+"",-1,0,false);
            utils.appendCell(sheet,i+z,"",edu300.getNjmc()+edu300.getBatchName(),-1,1,false);
            utils.appendCell(sheet,i+z,"",edu300.getXbmc(),-1,2,false);
            utils.appendCell(sheet,i+z,"",edu300.getZymc(),-1,3,false);
            for(int j =0;j<edu000List.size();j++){
                String lxM = edu001Dao.queryStudentCount(edu300Ids,"M",edu000List.get(j).getEjdm());
                String lxF = edu001Dao.queryStudentCount(edu300Ids,"F",edu000List.get(j).getEjdm());
                utils.appendCell(sheet,i+z,"",lxM,-1,4+j*2,false);
                utils.appendCell(sheet,i+z,"",lxF,-1,5+j*2,false);
            }
            String xtxm = edu001Dao.queryStudentCode(edu300IdsAll,"M");
            String xtxf = edu001Dao.queryStudentCode(edu300IdsAll,"F");
            utils.appendCell(sheet,i+z,"",xtxm,-1,4+edu000List.size()*2,false);
            utils.appendCell(sheet,i+z,"",xtxf,-1,5+edu000List.size()*2,false);
            String lxM = edu001Dao.queryStudentCount(edu300Ids,"M");
            String lxF = edu001Dao.queryStudentCount(edu300Ids,"F");
            utils.appendCell(sheet,i+z,"",lxM,-1,6+edu000List.size()*2,false);
            utils.appendCell(sheet,i+z,"",lxF,-1,7+edu000List.size()*2,false);
            String all = edu001Dao.queryStudentCount(edu300Ids);
            utils.appendCell(sheet,i+z,"",all,-1,8+edu000List.size()*2,false);
        }
        utils.appendCell(sheet,edu300List.size()+2+z,"","小计",-1,0,false,cellStyle);
        sheet.addMergedRegion(new CellRangeAddress(edu300List.size()+3+z, edu300List.size()+3+z, 0, 3));
        for(int j =0;j<edu000List.size();j++){
            String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M",edu000List.get(j).getEjdm());
            String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F",edu000List.get(j).getEjdm());
            utils.appendCell(sheet,edu300List.size()+2+z,"",lxM,-1,4+j*2,false);
            utils.appendCell(sheet,edu300List.size()+2+z,"",lxF,-1,5+j*2,false);
        }
        String xtxm = edu001Dao.queryStudentCode(edu300IdsAll,"M");
        String xtxf = edu001Dao.queryStudentCode(edu300IdsAll,"F");
        utils.appendCell(sheet,edu300List.size()+2+z,"",xtxm,-1,4+edu000List.size()*2,false);
        utils.appendCell(sheet,edu300List.size()+2+z,"",xtxf,-1,5+edu000List.size()*2,false);
        String lxM = edu001Dao.queryStudentCount(edu300IdsAll,"M");
        String lxF = edu001Dao.queryStudentCount(edu300IdsAll,"F");
        utils.appendCell(sheet,edu300List.size()+2+z,"",lxM,-1,6+edu000List.size()*2,false);
        utils.appendCell(sheet,edu300List.size()+2+z,"",lxF,-1,7+edu000List.size()*2,false);
        String all = edu001Dao.queryStudentCount(edu300IdsAll);
        utils.appendCell(sheet,edu300List.size()+2+z,"",all,-1,8+edu000List.size()*2,false);

        sheet.setColumnWidth(0, 5*256);
        sheet.setColumnWidth(1, 20*256);
        sheet.setColumnWidth(2, 25*256);
        sheet.setColumnWidth(3, 25*256);
        return workbook;
    }

    //学生报表数据-分专业
    public XSSFWorkbook studentReport2(List<Edu300> edu300List) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet(edu300List.get(0).getXbmc()+"扩招汇总表");
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cells[] = new XSSFCell[3];
        // 所有标题数组
        String[] titles = new String[5]; /*{"学年","行政班名称","课程名称","学生姓名", "学号","成绩"}*/
        List<Edu000> edu000List = edu000Dao.queryejdm("sylx");
        titles[0] = "序号";
        titles[1] = "分院专业";
        titles[2] = "年级批次";
        titles[3] = "班级";
        titles[4] = "辽宁职业学院高职扩招学生汇总表";
        for (int i = 0; i < titles.length; i++) {
            cells[0] = firstRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }
        XSSFRow firstRow2 = sheet.createRow(1);
        XSSFRow firstRow3 = sheet.createRow(2);
        for(int i = 0;i<edu000List.size();i++){
            cells[1] = firstRow2.createCell(i*2+4);
            cells[1].setCellValue(edu000List.get(i).getEjdmz());
            cells[2] = firstRow3.createCell(i*2+4);
            cells[2].setCellValue("男");
            cells[2] = firstRow3.createCell(i*2+5);
            cells[2].setCellValue("女");
            CellRangeAddress region = new CellRangeAddress(1, 1, i*2+4, i*2+5);
            sheet.addMergedRegion(region);
        }
        cells[1] = firstRow2.createCell(edu000List.size()*2+4);
        cells[1].setCellValue("合计");
        cells[2] = firstRow3.createCell(edu000List.size()*2+4);
        cells[2].setCellValue("男");
        cells[2] = firstRow3.createCell(edu000List.size()*2+5);
        cells[2].setCellValue("女");
        CellRangeAddress region = new CellRangeAddress(1, 1, edu000List.size()*2+4, edu000List.size()*2+5);
        sheet.addMergedRegion(region);
        cells[1] = firstRow2.createCell(edu000List.size()*2+6);
        cells[1].setCellValue("总计");
        sheet.addMergedRegion(new CellRangeAddress(1, 2, edu000List.size()*2+6, edu000List.size()*2+6));
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 0, 0));//序号
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 1, 1));//年级批次
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 2, 2));//分院
        sheet.addMergedRegion(new CellRangeAddress(0, 2, 3, 3));//专业
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, edu000List.size()*2+6));//辽宁职业学院高职扩招学生汇总表

        //上面都是标题 呕~
//        List<Edu300> edu300List = edu300Dao.findAllGroupByZybm();
        for (int i = 2;i<edu300List.size()+2;i++){
            Edu300 edu300 = edu300List.get(i-2);
            utils.appendCell(sheet,i,"",(i-1)+"",-1,0,false);
            utils.appendCell(sheet,i,"",edu300.getNjmc()+edu300.getBatchName(),-1,2,false);
            utils.appendCell(sheet,i,"",edu300.getXbmc()+"-"+edu300.getZymc(),-1,1,false);
            utils.appendCell(sheet,i,"",edu300.getXzbmc(),-1,3,false);
            List<Long> edu300Ids = new ArrayList<>();
            edu300Ids.add(edu300.getEdu300_ID());
            for(int j =0;j<edu000List.size();j++){
                String lxM = edu001Dao.queryStudentCount(edu300Ids,"M",edu000List.get(j).getEjdm());
                String lxF = edu001Dao.queryStudentCount(edu300Ids,"F",edu000List.get(j).getEjdm());
                utils.appendCell(sheet,i,"",lxM,-1,4+j*2,false);
                utils.appendCell(sheet,i,"",lxF,-1,5+j*2,false);
            }
            String lxM = edu001Dao.queryStudentCount(edu300Ids,"M");
            String lxF = edu001Dao.queryStudentCount(edu300Ids,"F");
            utils.appendCell(sheet,i,"",lxM,-1,4+edu000List.size()*2,false);
            utils.appendCell(sheet,i,"",lxF,-1,5+edu000List.size()*2,false);
            String all = edu001Dao.queryStudentCount(edu300Ids);
            utils.appendCell(sheet,i,"",all,-1,6+edu000List.size()*2,false);
        }

        sheet.setColumnWidth(0, 5*256);
        sheet.setColumnWidth(1, 20*256);
        sheet.setColumnWidth(2, 25*256);
        sheet.setColumnWidth(3, 25*256);
        return workbook;
    }

    //授课信息报表
    public XSSFWorkbook teachingInfoReport(String xnid) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("授课信息");
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFRow twoRow = sheet.createRow(1);// 第一行

        XSSFCell cells[] = new XSSFCell[3];
        // 所有标题数组
        cells[0] = firstRow.createCell(0);
        cells[0].setCellValue("辽宁职业学院高职扩招学年授课信息统计表");
        String[] titles = new String[3]; /*{"学年","行政班名称","课程名称","学生姓名", "学号","成绩"}*/
        List<Edu000> edu000List = edu000Dao.queryejdm("sylx");
        titles[0] = "序号";
        titles[1] = "学年";
        titles[2] = "授课教师数";
        for (int i = 0; i < titles.length; i++) {
            cells[1] = twoRow.createCell(i);
            cells[1].setCellValue(titles[i]);
        }
        cells[1] = twoRow.createCell(5);
        cells[1].setCellValue("学年授课课程门数");
        cells[1] = twoRow.createCell(6);
        cells[1].setCellValue("学年总学时数");
        cells[1] = twoRow.createCell(7);
        cells[1].setCellValue("计划学时数");
        cells[1] = twoRow.createCell(8);
        cells[1].setCellValue("实际授课学时数");


        XSSFRow threeRow = sheet.createRow(2);//第三行
        cells[2] = threeRow.createCell(2);
        cells[2].setCellValue("专任教师");
        cells[2] = threeRow.createCell(3);
        cells[2].setCellValue("兼职教师");
        cells[2] = threeRow.createCell(4);
        cells[2].setCellValue("外聘教师");
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));//序号
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 1, 1));//学年
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 2, 4));//授课教师数
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 8));//辽宁职业学院高职扩招学年授课信息统计表
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 5, 5));//
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 6, 6));//
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 7, 7));//
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 8, 8));//

        if(xnid != null && !"".equals(xnid)){
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
            utils.appendCell(sheet,2,"",1+"",-1,0,false);
            utils.appendCell(sheet,2,"",edu400.getXnmc(),-1,1,false);
            String zrjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","001");
            utils.appendCell(sheet,2,"",zrjs,-1,2,false);
            String jzjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","003");
            utils.appendCell(sheet,2,"",jzjs,-1,3,false);
            String wpjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","004");
            utils.appendCell(sheet,2,"",wpjs,-1,4,false);
            String skms = edu201Dao.findskmsByxnid(edu400.getEdu400_ID()+"");
            utils.appendCell(sheet,2,"",skms,-1,5,false);
            String zxs = edu203Dao.getzxsByXnid(edu400.getEdu400_ID()+"");
            utils.appendCell(sheet,2,"",zxs,-1,6,false);
            utils.appendCell(sheet,2,"",zxs,-1,7,false);

            try{
                Date now = new Date();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String kssj = edu400.getKssj();
                Date startDate = sdf.parse(kssj);
                String jssj = edu400.getJssj();
                Date endDate = sdf.parse(jssj);
                if(now.getTime()<startDate.getTime()){
                    utils.appendCell(sheet,2,"","0",-1,8,false);
                }else if(now.getTime()>endDate.getTime()){
                    utils.appendCell(sheet,2,"",zxs,-1,8,false);
                }else{
                    //获取当前教学周
                    int week = DateUtils.calcWeekOffset(startDate,now)+1;
                    //获取当前星期id
                    String xqid = DateUtils.dateToWeek(now);
                    String countPass = edu203Dao.getPKcount3(xnid,week,xqid);
                    utils.appendCell(sheet,2,"",countPass,-1,8,false);
                }
            }catch (Exception e){
                e.printStackTrace();
            }

        }else{
            List<Edu400> edu400List = edu400Dao.findAllXn();
            for(int i = 0;i<edu400List.size();i++){
                Edu400 edu400 = edu400List.get(i);
                utils.appendCell(sheet,i+2,"",(i+1)+"",-1,0,false);
                utils.appendCell(sheet,i+2,"",edu400.getXnmc(),-1,1,false);
                String zrjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","001");
                utils.appendCell(sheet,i+2,"",zrjs,-1,2,false);
                String jzjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","003");
                utils.appendCell(sheet,i+2,"",jzjs,-1,3,false);
                String wpjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","004");
                utils.appendCell(sheet,i+2,"",wpjs,-1,4,false);
                String skms = edu201Dao.findskmsByxnid(edu400.getEdu400_ID()+"");
                utils.appendCell(sheet,i+2,"",skms,-1,5,false);
                String zxs = edu203Dao.getzxsByXnid(edu400.getEdu400_ID()+"");
                utils.appendCell(sheet,i+2,"",zxs,-1,6,false);
                utils.appendCell(sheet,i+2,"",zxs,-1,7,false);
                try{
                    Date now = new Date();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String kssj = edu400.getKssj();
                    Date startDate = sdf.parse(kssj);
                    String jssj = edu400.getJssj();
                    Date endDate = sdf.parse(jssj);
                    if(now.getTime()<startDate.getTime()){
                        utils.appendCell(sheet,i+2,"","0",-1,8,false);
                    }else if(now.getTime()>endDate.getTime()){
                        utils.appendCell(sheet,i+2,"",zxs,-1,8,false);
                    }else{
                        //获取当前教学周
                        int week = DateUtils.calcWeekOffset(startDate,now)+1;
                        //获取当前星期id
                        String xqid = DateUtils.dateToWeek(now);
                        String countPass = edu203Dao.getPKcount3(xnid,week,xqid);
                        utils.appendCell(sheet,i+2,"",countPass,-1,8,false);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
        sheet.setColumnWidth(1, 20*256);
        sheet.setColumnWidth(5, 25*256);
        sheet.setColumnWidth(6, 25*256);
        return workbook;

    }

    //授课信息报表-各学院
    public XSSFWorkbook teachingInfoCollegeReport(List<Edu106> edu106List,String xnid) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("授课信息");
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFRow twoRow = sheet.createRow(1);// 第一行

        XSSFCell cells[] = new XSSFCell[3];
        // 所有标题数组
        cells[0] = firstRow.createCell(0);
        cells[0].setCellValue(edu106List.get(0).getDepartmentName()+"高职扩招学年授课信息统计表");
        String[] titles = new String[4]; /*{"学年","行政班名称","课程名称","学生姓名", "学号","成绩"}*/
        List<Edu000> edu000List = edu000Dao.queryejdm("sylx");
        titles[0] = "序号";
        titles[1] = "专业";
        titles[2] = "学年";
        titles[3] = "授课教师数";
        for (int i = 0; i < titles.length; i++) {
            cells[1] = twoRow.createCell(i);
            cells[1].setCellValue(titles[i]);
        }
        cells[1] = twoRow.createCell(6);
        cells[1].setCellValue("学年授课课程门数");
        cells[1] = twoRow.createCell(7);
        cells[1].setCellValue("学年总学时数");
        cells[1] = twoRow.createCell(8);
        cells[1].setCellValue("计划学时数");
        cells[1] = twoRow.createCell(9);
        cells[1].setCellValue("实际授课学时数");
        XSSFRow threeRow = sheet.createRow(2);//第三行
        cells[2] = threeRow.createCell(3);
        cells[2].setCellValue("专任教师");
        cells[2] = threeRow.createCell(4);
        cells[2].setCellValue("兼职教师");
        cells[2] = threeRow.createCell(5);
        cells[2].setCellValue("外聘教师");
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 0, 0));//序号
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 1, 1));//专业
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 2, 2));//学年
        sheet.addMergedRegion(new CellRangeAddress(1, 1, 3, 5));//授课教师数
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 9));//辽宁职业学院高职扩招学年授课信息统计表
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 6, 6));//
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 7, 7));//
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 8, 8));//
        sheet.addMergedRegion(new CellRangeAddress(1, 2, 9, 9));//


        if(xnid != null && !"".equals(xnid)){

        }else{
            List<Edu400> edu400List = edu400Dao.findAllXn();
            for(int i = 0;i<edu106List.size();i++){
                for(int j = 0;j<edu400List.size();j++){
                    utils.appendCell(sheet,i*j+j+2,"",(i*j+j+1)+"",-1,0,false);
                    utils.appendCell(sheet,i*j+j+2,"",(i*j+j+1)+"",-1,0,false);
                }
            }
        }



        sheet.setColumnWidth(1, 20*256);
        sheet.setColumnWidth(2, 20*256);
        sheet.setColumnWidth(7, 25*256);
        sheet.setColumnWidth(6, 25*256);
        return workbook;

    }


    //创建成绩模板
    public XSSFWorkbook exportGradeByClassIdAndcourseName(String courseName,List<String> className,String xnid) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("已选成绩详情");

        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cells[] = new XSSFCell[1];
        // 所有标题数组
        String[] titles = new String[] {"学年","行政班名称","课程名称","学生姓名", "学号","成绩","免修状态"};

        // 循环设置标题
        for (int i = 0; i < titles.length; i++) {
            cells[0] = firstRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }
        List<Edu005> edu005List = edu005Dao.exportGradeByClassIdAndcourseName(courseName,className,xnid);

        for (int i = 0; i < edu005List.size(); i++) {
            utils.appendCell(sheet,i,"",edu005List.get(i).getXn(),-1,0,false);
            utils.appendCell(sheet,i,"",edu005List.get(i).getClassName(),-1,1,false);
            utils.appendCell(sheet,i,"",edu005List.get(i).getCourseName(),-1,2,false);
            utils.appendCell(sheet,i,"",edu005List.get(i).getStudentName(),-1,3,false);
            utils.appendCell(sheet,i,"",edu005List.get(i).getStudentCode(),-1,4,false);
            if(edu005List.get(i).getIsMx() != null){
                utils.appendCell(sheet,i,"",edu005List.get(i).getGrade(),-1,5,false);
            }else if (edu005List.get(i).getIsConfirm() == null) {
                utils.appendCell(sheet,i,"",edu005List.get(i).getGrade(),-1,5,false);
            }else if("F".equals(edu005List.get(i).getIsResit())){
                utils.appendCell(sheet,i,"",edu005List.get(i).getGrade(),-1,5,false);
            }else{
                Edu0051 edu0051 = edu0051Dao.getGradeByNum(edu005List.get(i).getEdu005_ID()+"","0");
                if(edu0051 == null){
                    utils.appendCell(sheet,i,"",edu005List.get(i).getGrade(),-1,5,false);
                }else{
                    utils.appendCell(sheet,i,"",edu0051.getGrade(),-1,5,false);
                }
            }
            utils.appendCell(sheet,i,"",edu000Dao.queryEjdmMcByEjdmZ(edu005List.get(i).getIsMx(),"IS_MX"),-1,6,false);
        }

        sheet.setColumnWidth(0, 12*256);
        sheet.setColumnWidth(1, 16*256);
        sheet.setColumnWidth(2, 30*256);
        sheet.setColumnWidth(3, 10*256);
        sheet.setColumnWidth(4, 20*256);

        return workbook;
    }

    public ResultVO exportGradeByClassIdAndcourseNameCheck(String courseName,List<String> list,String xnid) {
        ResultVO resultVO;
        for (int i = 0; i <list.size() ; i++) {
            List<String> className = new ArrayList<>();
            className.add(list.get(i));
            List<Edu005> edu005List = edu005Dao.exportGradeByClassIdAndcourseName(courseName,className,xnid);
            if(edu005List.size() == 0){
                resultVO = ResultVO.setFailed(className+"没有"+courseName+"课程数据");
                return resultVO;
            }
        }
        resultVO = ResultVO.setSuccess("成功");
        return resultVO;
    }

    //学生学年及格率报表
    public XSSFWorkbook exportStudentPassReport(List<String> xnids) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        for(String xnid:xnids){
            Edu400 e = edu400Dao.findOne(Long.parseLong(xnid));
            XSSFSheet sheet = workbook.createSheet("学生."+e.getXnmc()+"及格率报表");

            XSSFRow firstRow = sheet.createRow(0);// 第一行
            XSSFRow twoRow = sheet.createRow(1);// 第2行
            XSSFCell cells[] = new XSSFCell[3];
            // 所有标题数组
            String[] titles = new String[] {"序号","年级","专业","人数"};
            for (int i = 0; i < titles.length; i++) {
                cells[0] = firstRow.createCell(i);
                cells[0].setCellValue(titles[i]);
                sheet.addMergedRegion(new CellRangeAddress(0,2,i,i));//
            }
            //学年
            cells[0] = firstRow.createCell(4);
            cells[0].setCellValue(e.getXnmc());
            sheet.addMergedRegion(new CellRangeAddress(0,0,4,9));
            //及格率（%）
            cells[1] = twoRow.createCell(4);
            cells[1].setCellValue("及格率（%）");
            sheet.addMergedRegion(new CellRangeAddress(1,2,4,4));
            //学年专业学生不及格情况统计占比（%）
            cells[1] = twoRow.createCell(5);
            cells[1].setCellValue("学年专业学生不及格情况统计占比（%）");
            sheet.addMergedRegion(new CellRangeAddress(1,1,5,9));

            //不及格人数占比
            String[] titles2 = new String[] {"1科不及格人数占比","2科不及格人数占比","3科不及格人数占比","4科不及格人数占比","5科及以上不及格人数占比"};
            XSSFRow threeRow = sheet.createRow(2);// 第3行
            for (int i = 0; i < titles2.length; i++) {
                cells[0] = threeRow.createCell(i+5);
                cells[0].setCellValue(titles2[i]);
            }
            List<Edu105> edu105List = edu105Dao.queryAllGrade();
            int index = 0;
            for(Edu105 edu105:edu105List){
                List<String> edu300List = edu300Dao.findAllZy(edu105.getEdu105_ID()+"");
                for(int i = 1;i<=edu300List.size();i++){
                    Edu106 edu106 = edu106Dao.query106BYID(edu300List.get(i-1));
                    utils.appendCell(sheet, index+i+1,"", (index+i)+"", -1, 0, false);
                    utils.appendCell(sheet, index+i+1, "", edu105.getNjmc(), -1, 1, false);
                    utils.appendCell(sheet, index+i+1, "", edu106.getZymc(), -1, 2, false);
                    //人数
                    String peopleNum = edu300Dao.findPeopleNum(edu300List.get(i-1),edu105.getEdu105_ID()+"");
                    utils.appendCell(sheet, index+i+1, "", peopleNum, -1, 3, false);
                    Integer passNum = Integer.parseInt(peopleNum);
                    //1-4科不及格
                    for(int j = 1;j<5;j++){
                        String noPassPeopleNum = edu005Dao.findNoPassPeopleNum(edu300List.get(i-1),edu105.getEdu105_ID()+"",j+"",xnid);
                        passNum = passNum-Integer.parseInt(noPassPeopleNum);
                        if("0".equals(noPassPeopleNum)){
                            utils.appendCell(sheet, index+i+1, "", "0人/0.00%", -1, 4+j, false);
                        }else{
                            double v = Double.parseDouble(noPassPeopleNum) / Double.parseDouble(peopleNum);
                            NumberFormat nf = NumberFormat.getPercentInstance();
                            nf.setMinimumFractionDigits(2);//设置保留小数位
                            String usedPercent = nf.format(v);
                            utils.appendCell(sheet, index+i+1, "", noPassPeopleNum+"人/"+usedPercent, -1, 4+j, false);
                        }
                    }
                    //5科+不及格
                    String noPassPeopleNum = edu005Dao.findNoPassPeopleNum2(edu300List.get(i-1),edu105.getEdu105_ID()+"","5",xnid);
                    passNum = passNum-Integer.parseInt(noPassPeopleNum);
                    if("0".equals(noPassPeopleNum)){
                        utils.appendCell(sheet, index+i+1, "", "0人/0.00%", -1, 9, false);
                    }else{
                        double v = Double.parseDouble(noPassPeopleNum) / Double.parseDouble(peopleNum);
                        NumberFormat nf = NumberFormat.getPercentInstance();
                        nf.setMinimumFractionDigits(2);//设置保留小数位
                        String usedPercent = nf.format(v);
                        utils.appendCell(sheet, index+i+1, "", noPassPeopleNum+"人/"+usedPercent, -1, 9, false);
                    }
                    //及格率
                    String gradeListNum = edu005Dao.findGradeListNum(edu300List.get(i-1),edu105.getEdu105_ID()+"",xnid);
                    if("0".equals(gradeListNum)){
                        utils.appendCell(sheet, index+i+1, "", "该专业暂无课程或未录成绩", -1, 4, false);
                    }else{
                        double v = Double.parseDouble(passNum.toString()) / Double.parseDouble(peopleNum);
                        NumberFormat nf = NumberFormat.getPercentInstance();
                        nf.setMinimumFractionDigits(2);//设置保留小数位
                        String usedPercent = nf.format(v);
                        utils.appendCell(sheet, index+i+1, "", usedPercent, -1, 4, false);
                    }
                }
                index = edu300List.size();
            }
            sheet.setColumnWidth(0, 4*256);
            sheet.setColumnWidth(1, 5*256);
            sheet.setColumnWidth(2, 20*256);
            sheet.setColumnWidth(3, 5*256);
            sheet.setColumnWidth(4, 22*256);
            sheet.setColumnWidth(5, 15*256);
            sheet.setColumnWidth(6, 15*256);
            sheet.setColumnWidth(7, 15*256);
            sheet.setColumnWidth(8, 15*256);
            sheet.setColumnWidth(9, 15*256);
        }


        return workbook;
    }

    //查询教学任务点
    public List<Edu500> queryPointByCity(Edu500 edu500) {
        Specification<Edu500> specification = new Specification<Edu500>() {
            public Predicate toPredicate(Root<Edu500> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu500.getLocalName() != null && !"".equals(edu500.getLocalName())) {
                    predicates.add(cb.like(root.<String> get("localName"), "%"+edu500.getLocalName()+"%"));
                }
                if (edu500.getCountry() != null && !"".equals(edu500.getCountry())) {
                    predicates.add(cb.like(root.<String> get("country"), "%"+edu500.getCountry()+"%"));
                }
                if (edu500.getCityCode() != null && !"".equals(edu500.getCityCode())) {
                    predicates.add(cb.equal(root.<String> get("cityCode"), edu500.getCityCode()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu500> edu500s = edu500Dao.findAll(specification);

        if(edu500s.size() == 0) {
            return edu500s;
        }

        List<Long> edu500Ids = edu500s.stream().map(Edu500::getEdu500Id).collect(Collectors.toList());

        List<Edu500> edu500List = edu500Dao.findAllByEdu500Ids(edu500Ids);

        return edu500List;
    }

    public ResultVO pointReportData(List<Edu500> list,String xnid){
        ResultVO resultVO;
        List<PointReport> pointReportList = new ArrayList<>();
        if(xnid != null && !"".equals(xnid)){
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
            for (Edu500 edu500 :list){
                List<Edu501> edu501List = edu501Dao.findAllByEdu501Id(edu500.getEdu500Id()+"");
                for(Edu501 edu501:edu501List){
                    PointReport pointReport = new PointReport();
                    pointReport.setEdu500Id(edu500.getEdu500Id());
                    pointReport.setCity(edu500.getCity());
                    pointReport.setCityCode(edu500.getCityCode());
                    pointReport.setCountry(edu500.getCountry());
                    pointReport.setLocalAddress(edu500.getLocalAddress());
                    pointReport.setLocalName(edu500.getLocalName());
                    pointReport.setPointCount(edu500.getPointCount());
                    pointReport.setPointRemarks(edu500.getRemarks());
                    //
                    pointReport.setXn(edu400.getXnmc());
                    pointReport.setCapacity(edu501.getCapacity());
                    pointReport.setPointName(edu501.getPointName());
                    pointReport.setRemarks(edu501.getRemarks());
                    List<Edu502> edu502List = edu502Dao.findAllByEdu501Id(edu501.getEdu501Id()+"");
                    pointReport.setEdu502List(edu502List);
                    Integer countUsed = edu203Dao.findEdu203CountByEdu501Id(edu501.getEdu501Id()+"",xnid);
                    pointReport.setCountUsed(countUsed+"");


                    try{
                        Date now = new Date();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        String kssj = edu400.getKssj();
                        Date startDate = sdf.parse(kssj);
                        String jssj = edu400.getJssj();
                        Date endDate = sdf.parse(jssj);
                        if(now.getTime()<startDate.getTime()){
                            pointReport.setComplete("0");
                            pointReport.setUnfinished(countUsed+"");
                        }else if(now.getTime()>endDate.getTime()){
                            pointReport.setComplete(countUsed+"");
                            pointReport.setUnfinished("0");
                        }else{
                            //获取当前教学周
                            int week = DateUtils.calcWeekOffset(startDate,now)+1;
                            //获取当前星期id
                            String xqid = DateUtils.dateToWeek(now);
                            Integer countPass = edu203Dao.getPKcount3(xnid,week,xqid,edu501.getEdu501Id()+"");
                            pointReport.setComplete(countPass+"");
                            pointReport.setUnfinished((countUsed-countPass)+"");
                        }
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                    pointReportList.add(pointReport);
                }
            }
        }else{
            List<Edu400> edu400List = edu400Dao.findAll();
            for (Edu500 edu500 :list){
                List<Edu501> edu501List = edu501Dao.findAllByEdu501Id(edu500.getEdu500Id()+"");
                for(Edu501 edu501:edu501List){
                    for(Edu400 edu400:edu400List){
                        PointReport pointReport = new PointReport();
                        pointReport.setEdu500Id(edu500.getEdu500Id());
                        pointReport.setCity(edu500.getCity());
                        pointReport.setCityCode(edu500.getCityCode());
                        pointReport.setCountry(edu500.getCountry());
                        pointReport.setLocalAddress(edu500.getLocalAddress());
                        pointReport.setLocalName(edu500.getLocalName());
                        pointReport.setPointCount(edu500.getPointCount());
                        pointReport.setPointRemarks(edu500.getRemarks());
                        //
                        pointReport.setXn(edu400.getXnmc());
                        pointReport.setCapacity(edu501.getCapacity());
                        pointReport.setPointName(edu501.getPointName());
                        pointReport.setRemarks(edu501.getRemarks());
                        List<Edu502> edu502List = edu502Dao.findAllByEdu501Id(edu501.getEdu501Id()+"");
                        pointReport.setEdu502List(edu502List);
                        Integer countUsed = edu203Dao.findEdu203CountByEdu501Id(edu501.getEdu501Id()+"",edu400.getEdu400_ID()+"");
                        pointReport.setCountUsed(countUsed+"");


                        try{
                            Date now = new Date();
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            String kssj = edu400.getKssj();
                            Date startDate = sdf.parse(kssj);
                            String jssj = edu400.getJssj();
                            Date endDate = sdf.parse(jssj);
                            if(now.getTime()<startDate.getTime()){
                                pointReport.setComplete("0");
                                pointReport.setUnfinished(countUsed+"");
                            }else if(now.getTime()>endDate.getTime()){
                                pointReport.setComplete(countUsed+"");
                                pointReport.setUnfinished("0");
                            }else{
                                //获取当前教学周
                                int week = DateUtils.calcWeekOffset(startDate,now)+1;
                                //获取当前星期id
                                String xqid = DateUtils.dateToWeek(now);
                                Integer countPass = edu203Dao.getPKcount3(edu400.getEdu400_ID()+"",week,xqid,edu501.getEdu501Id()+"");
                                pointReport.setComplete(countPass+"");
                                pointReport.setUnfinished((countUsed-countPass)+"");
                            }
                        }catch (Exception e){
                            e.printStackTrace();
                        }
                        pointReportList.add(pointReport);
                    }

                }
            }
        }
        resultVO = ResultVO.setSuccess("查询成功！",pointReportList);
        return resultVO;
    }

    //授课信息报表数据-报表-全校的
    public ResultVO teachInfoReportDataAll(String xnid){
        ResultVO resultVO;
        List<Map> list = new ArrayList<>();
        if(xnid != null && !"".equals(xnid)){
            Map map = new HashMap();
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
            map.put("xnmc",edu400.getXnmc());
            String zrjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","001");
            String jzjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","003");
            String wpjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","004");
            map.put("zrjs",zrjs);
            map.put("jzjs",jzjs);
            map.put("wpjs",wpjs);
            String skms = edu201Dao.findskmsByxnid(edu400.getEdu400_ID()+"");
            map.put("skms",skms);
            String zxs = edu203Dao.getzxsByXnid(edu400.getEdu400_ID()+"");
            map.put("zxs",zxs);
            map.put("jhxs",zxs);
            try{
                Date now = new Date();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String kssj = edu400.getKssj();
                Date startDate = sdf.parse(kssj);
                String jssj = edu400.getJssj();
                Date endDate = sdf.parse(jssj);

                if(now.getTime()<startDate.getTime()){
                    map.put("sjskxs","0");
                }else if(now.getTime()>endDate.getTime()){
                    map.put("sjskxs",zxs);
                }else{
                    //获取当前教学周
                    int week = DateUtils.calcWeekOffset(startDate,now)+1;
                    //获取当前星期id
                    String xqid = DateUtils.dateToWeek(now);
                    String countPass = edu203Dao.getPKcount3(xnid,week,xqid);
                    map.put("sjskxs",countPass);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
            list.add(map);
        }else{
            List<Edu400> edu400List = edu400Dao.findAllXn();
            for(Edu400 edu400:edu400List){
                Map map = new HashMap();
                map.put("xnmc",edu400.getXnmc());
                String zrjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","001");
                String jzjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","003");
                String wpjs = edu203Dao.getjsslByXnAndLx(edu400.getEdu400_ID()+"","004");
                map.put("zrjs",zrjs);
                map.put("jzjs",jzjs);
                map.put("wpjs",wpjs);
                String skms = edu201Dao.findskmsByxnid(edu400.getEdu400_ID()+"");
                map.put("skms",skms);
                String zxs = edu203Dao.getzxsByXnid(edu400.getEdu400_ID()+"");
                map.put("zxs",zxs);
                map.put("jhxs",zxs);
                try{
                    Date now = new Date();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String kssj = edu400.getKssj();
                    Date startDate = sdf.parse(kssj);
                    String jssj = edu400.getJssj();
                    Date endDate = sdf.parse(jssj);

                    if(now.getTime()<startDate.getTime()){
                        map.put("sjskxs","0");
                    }else if(now.getTime()>endDate.getTime()){
                        map.put("sjskxs",zxs);
                    }else{
                        //获取当前教学周
                        int week = DateUtils.calcWeekOffset(startDate,now)+1;
                        //获取当前星期id
                        String xqid = DateUtils.dateToWeek(now);
                        String countPass = edu203Dao.getPKcount3(xnid,week,xqid);
                        map.put("sjskxs",countPass);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }
                list.add(map);
            }
        }
        resultVO = ResultVO.setSuccess("查询成功",list);
        return resultVO;
    }

    //授课信息报表数据-报表-分院的
    public ResultVO teachInfoReportData(List<Edu106> edu106List,String xnid) {
        ResultVO resultVO;
        List<Map> list = new ArrayList<>();
        if (xnid != null && !"".equals(xnid)) {
            for (Edu106 edu106 : edu106List) {
                Map map = new HashMap();
                Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                map.put("zymc",edu106.getZymc());
                map.put("xnmc", edu400.getXnmc());
                String zrjs = edu203Dao.getjsslByXnAndLx2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "", "001");
                String jzjs = edu203Dao.getjsslByXnAndLx2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "", "003");
                String wpjs = edu203Dao.getjsslByXnAndLx2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "", "004");
                map.put("zrjs", zrjs);
                map.put("jzjs", jzjs);
                map.put("wpjs", wpjs);
                String skms = edu201Dao.findskmsByxnid2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "");
                map.put("skms", skms);
                String zxs = edu203Dao.getzxsByXnid2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "");
                map.put("zxs", zxs);
                map.put("jhxs", zxs);
                try {
                    Date now = new Date();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String kssj = edu400.getKssj();
                    Date startDate = sdf.parse(kssj);
                    String jssj = edu400.getJssj();
                    Date endDate = sdf.parse(jssj);

                    if (now.getTime() < startDate.getTime()) {
                        map.put("sjskxs", "0");
                    } else if (now.getTime() > endDate.getTime()) {
                        map.put("sjskxs", zxs);
                    } else {
                        //获取当前教学周
                        int week = DateUtils.calcWeekOffset(startDate, now) + 1;
                        //获取当前星期id
                        String xqid = DateUtils.dateToWeek(now);
                        String countPass = edu203Dao.getPKcount4(xnid, week, xqid, edu106.getEdu106_ID() + "");
                        map.put("sjskxs", countPass);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                list.add(map);
            }

        } else {
            List<Edu400> edu400List = edu400Dao.findAllXn();
            for (Edu106 edu106 : edu106List) {
                for (Edu400 edu400 : edu400List) {
                    Map map = new HashMap();
                    map.put("zymc",edu106.getZymc());
                    map.put("xnmc", edu400.getXnmc());
                    String zrjs = edu203Dao.getjsslByXnAndLx2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "", "001");
                    String jzjs = edu203Dao.getjsslByXnAndLx2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "", "003");
                    String wpjs = edu203Dao.getjsslByXnAndLx2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "", "004");
                    map.put("zrjs", zrjs);
                    map.put("jzjs", jzjs);
                    map.put("wpjs", wpjs);
                    String skms = edu201Dao.findskmsByxnid2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "");
                    map.put("skms", skms);
                    String zxs = edu203Dao.getzxsByXnid2(edu106.getEdu106_ID() + "", edu400.getEdu400_ID() + "");
                    map.put("zxs", zxs);
                    map.put("jhxs", zxs);
                    try {
                        Date now = new Date();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        String kssj = edu400.getKssj();
                        Date startDate = sdf.parse(kssj);
                        String jssj = edu400.getJssj();
                        Date endDate = sdf.parse(jssj);

                        if (now.getTime() < startDate.getTime()) {
                            map.put("sjskxs", "0");
                        } else if (now.getTime() > endDate.getTime()) {
                            map.put("sjskxs", zxs);
                        } else {
                            //获取当前教学周
                            int week = DateUtils.calcWeekOffset(startDate, now) + 1;
                            //获取当前星期id
                            String xqid = DateUtils.dateToWeek(now);
                            String countPass = edu203Dao.getPKcount4(edu400.getEdu400_ID()+"", week, xqid, edu106.getEdu106_ID() + "");
                            map.put("sjskxs", countPass);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    list.add(map);
                }
            }
        }
        resultVO = ResultVO.setSuccess("查询成功", list);
        return resultVO;
    }
}

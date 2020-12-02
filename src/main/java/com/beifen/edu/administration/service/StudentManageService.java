package com.beifen.edu.administration.service;

import com.beifen.edu.administration.PO.StudentBreakPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
    private Edu204Dao edu204Dao;
    @Autowired
    private Edu400Dao edu400Dao;
    @Autowired
    private Edu006Dao edu006Dao;
    @Autowired
    private Edu007Dao edu007Dao;
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
            boolean IDcardIshave = IDcardIshave(edu001.getSfzh());
            if (IDcardIshave) {
                resultVO = ResultVO.setFailed("身份证号重复，请确认后重新输入");
                return resultVO;
            }

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

                Path<Object> path = root.get("szxb");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <departments.size() ; i++) {
                    in.value(departments.get(i));//存入值
                }
                predicates.add(cb.and(in));

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
        List<Edu001> cardList = edu001Dao.checkIdCard(edu001.getSfzh(),edu001.getEdu001_ID());
        if(cardList.size() != 0) {
            resultVO = ResultVO.setFailed("身份证号重复，请确认后重新输入");
            return resultVO;
        }

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
        if (oldEdu001.getEdu300_ID() == edu001.getEdu300_ID()) {
           edu001Dao.save(edu001);
        } else {
            // 判断修改是否会超过行政班容纳人数
            boolean studentSpill = administrationClassesIsSpill(edu001.getEdu300_ID());
            if(studentSpill){
                resultVO = ResultVO.setFailed("行政班容纳人数已达上限，请更换班级");
                return resultVO;
            } else {
                if(edu001.getXh().equals(oldEdu001.getXh())) {
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
                    resultVO = ResultVO.setFailed ("修改"+modifyStudents.get(i).getXm()+"时,发现"+modifyResult.getMsg());
                    return resultVO;
                } else {
                    oldList.add((Edu001)modifyResult.getData());
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

        Edu001 one = edu001Dao.findOne(Long.parseLong(userKey));
        if(one == null) {
            resultVO = ResultVO.setFailed("您不是本校学生,无法查询成绩");
            return resultVO;
        }
        String studentCode = one.getXh();


        Specification<Edu005> specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("courseName"),"%"+edu005.getCourseName()+"%"));
                }
                if (edu005.getGrade() != null && !"".equals(edu005.getGrade())) {
                    predicates.add(cb.equal(root.<String>get("xnid"), edu005.getGrade()));
                }
                if (studentCode != null && !"".equals(studentCode)) {
                    predicates.add(cb.equal(root.<String>get("studentCode"), studentCode));
                }
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
}

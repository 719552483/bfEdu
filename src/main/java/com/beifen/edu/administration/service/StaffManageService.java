package com.beifen.edu.administration.service;

import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.DateUtils;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.criteria.*;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

//教职工管理业务层
@Service
public class StaffManageService {

    @Autowired
    Edu000Dao edu000Dao;
    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu001Dao edu001Dao;
    @Autowired
    Edu201Dao edu201Dao;
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    Edu205Dao edu205Dao;
    @Autowired
    Edu300Dao edu300Dao;
    @Autowired
    Edu005Dao edu005Dao;
    @Autowired
    Edu400Dao edu400Dao;
    @Autowired
    Edu0051Dao edu0051Dao;
    @Autowired
    Edu108Dao edu108Dao;
    @Autowired
    Edu107Dao edu107Dao;
    @Autowired
    Edu302Dao edu302Dao;
    @Autowired
    Edu208Dao edu208Dao;
    @Autowired
    Edu203Dao edu203Dao;
    @Autowired
    Edu404Dao edu404Dao;
    @Autowired
    Edu008Dao edu008Dao;
    @Autowired
    Edu999Dao edu999DAO;
    @Autowired
    TeacherGradeClassViewDao teacherGradeClassViewDao;
    @Autowired
    TeacherMUGradeClassViewDao teacherMUGradeClassViewDao;
    @Autowired
    ApprovalProcessService approvalProcessService;
    @Autowired
    AdministrationPageService administrationPageService;
    @Autowired
    CourseCheckOnDao courseCheckOnDao;
    @Autowired
    RedisUtils redisUtils;
    @Autowired
    Edu115Dao edu115Dao;
    @Autowired
    CourseGradeViewDao courseGradeViewDao;


    ReflectUtils utils = new ReflectUtils();



    //新增教师
    public void addTeacher(Edu101 edu101) {
        edu101Dao.save(edu101);

        Edu990 edu990 = new Edu990();
        edu990.setYhm(edu101.getJzgh());
        edu990.setMm("123456");
        edu990.setJs("教职工");
        edu990.setJsId("8050");
        edu990.setUserKey(edu101.getEdu101_ID().toString());
        edu990.setPersonName(edu101.getXm());
        edu990Dao.save(edu990);

        Edu992 edu992 = new Edu992();
        edu992.setBF990_ID(edu990.getBF990_ID());
        edu992.setBF991_ID(Long.parseLong("8051"));
        edu992Dao.save(edu992);

    }

    // 根据id查询教师所有信息
    public Edu101 queryTeacherBy101ID(String techerId) {
        return edu101Dao.queryTeacherBy101ID(techerId);
    }

    // 根据id查询教职工号
    public String queryJzghBy101ID(String techerId) {
        return edu101Dao.queryJzghBy101ID(techerId);
    }

    // 查询所有教师
    public List<Edu101> queryAllTeacher() {
        return edu101Dao.findAll();
    }

    //查询教师任务书
    public boolean checkTeacherTasks(String edu101Id) {
        boolean canRemove=true;
        List<Edu201> teacherTasks =edu201Dao.queryTaskByTeacherID(edu101Id);
        List<Edu201> mainTeacherTasks =edu201Dao.queryMainTaskByTeacherID(edu101Id);
        if(teacherTasks.size()>0||mainTeacherTasks.size()>0){
            canRemove=false;
        }
        return canRemove;
    }

    //删除教师
    public void removeTeacher(String edu101Id) {
        edu101Dao.removeTeacher(edu101Id);
    }

    //查询教师身份证号是否已存在
    public boolean teacherIDcardIshave(String sfzh) {
        boolean isHave = false;
        if (sfzh != null) {
            List<Edu101> IDcards = edu101Dao.teacherIDcardIshave(sfzh);
            if (IDcards.size() > 0)
                isHave = true;
        }
        return isHave;
    }

    // 为教师生成学号
    public String getNewTeacherJzgh() {
        String newXh = "";
        for(;;){
            String jzgh_before =utils.getRandom(2);
            newXh = "1"+jzgh_before+utils.getRandom(3);
            String s = edu101Dao.queryJzghSFCZ(newXh);
            if("0".equals(s)){
                break;
            }
        }
        return newXh;
    }


    //根据权限查询所有教师
    public ResultVO queryAllTeacherByUserId(String userId) {
        ResultVO resultVO;

        //从redis中查询二级学院管理权限
//        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        List<Edu101> teacherList = edu101Dao.queryAllTeacherByUserId();

        if(teacherList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无教师信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+teacherList.size()+"个教师",teacherList);
        }

        return resultVO;
    }



    //查询需要录入成绩学生
    public List<Edu005> queryGrades2(String userId) {
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();

        //查询教师任务书ID列表
        List<String> edu201IdList = edu205Dao.findEdu201IdByTeacher(userKey);
        if(edu201IdList.size() == 0) {
            return null;
        }

        //根据条件筛选培养计划
        Specification<Edu107> specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> edu107List = edu107Dao.findAll(specification);
        if (edu107List.size() == 0) {
            return null;
        }
        List<Long> edu107IdList = edu107List.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            return null;
        }
        List<String> edu201Ids = edu201Dao.getTaskByEdu108Ids(edu108IdList);
        //两个201id集合去交集
        edu201IdList.retainAll(edu201Ids);
        if(edu201IdList.size() == 0) {
            return null;
        }

        List edu201ids = utils.heavyListMethod(edu201IdList);

        //根据条件筛选成绩表
        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                Path<Object> Edu201Path = root.get("edu201_ID");//定义查询的字段
                CriteriaBuilder.In<Object> inEdu201 = cb.in(Edu201Path);
                for (int i = 0; i < edu201ids.size(); i++) {
                    inEdu201.value(edu201ids.get(i));//存入值
                }
                predicates.add(cb.and(inEdu201));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

        if (edu005List.size() == 0) {
            return null;
        }
        return edu005List;
    }

    public ResultVO searchCourseGetGradeByTeacher(String userId){
        ResultVO resultVO;
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();
        List<CourseGradeViewPO> courseGradeViewPOList = courseGradeViewDao.searchCourseGetGradeByTeacher(userKey);
        if(courseGradeViewPOList.size() == 0){
            resultVO = ResultVO.setFailed("暂无需要成绩确认的班级");
        }else{
            resultVO = ResultVO.setSuccess("共"+courseGradeViewPOList.size()+"个需要成绩确认的班级",courseGradeViewPOList);
        }
        return resultVO;
    }

    //查询需要录入成绩学生
    public ResultVO queryGrades(String userId, Edu001 edu001, Edu005 edu005) {
        ResultVO resultVO;
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();

        //查询教师任务书ID列表
        List<String> edu201IdList = edu205Dao.findEdu201IdByTeacher(userKey);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        //根据条件筛选培养计划
        Specification<Edu107> specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String>get("edu103"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String>get("edu104"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.like(root.<String>get("edu105"), '%' + edu001.getNj() + '%'));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String>get("edu106"), edu001.getZybm()));
                }

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> edu107List = edu107Dao.findAll(specification);
        if (edu107List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<Long> edu107IdList = edu107List.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<String> edu201Ids = edu201Dao.getTaskByEdu108Ids(edu108IdList);
        //两个201id集合去交集
        edu201IdList.retainAll(edu201Ids);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        List edu201ids = utils.heavyListMethod(edu201IdList);

        //根据条件筛选成绩表
        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("courseName"), "%" + edu005.getCourseName() + "%"));
                }
                if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
                    predicates.add(cb.like(root.<String>get("studentName"),"%"+edu001.getXm()+"%"));
                }
                if (edu001.getXh() != null && !"".equals(edu001.getXh())) {
                    predicates.add(cb.like(root.<String>get("studentCode"),"%"+edu001.getXh()+"%"));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String>get("className"),"%"+edu001.getXzbname()+"%"));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }

                Path<Object> Edu201Path = root.get("edu201_ID");//定义查询的字段
                CriteriaBuilder.In<Object> inEdu201 = cb.in(Edu201Path);
                for (int i = 0; i < edu201ids.size(); i++) {
                    inEdu201.value(edu201ids.get(i));//存入值
                }
                predicates.add(cb.and(inEdu201));
                query.orderBy(cb.desc(root.get("className")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合要求的学生");
        } else {
            resultVO = ResultVO.setSuccess("查找成功",edu005List);
        }

        return resultVO;
    }


    //查询需要录入成绩的班级
    public ResultVO queryGradesClass(String userId, Edu001 edu001, Edu005 edu005) {
        ResultVO resultVO;
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();

        //查询教师任务书ID列表
        List<String> edu201IdList = edu205Dao.findEdu201IdByTeacher(userKey);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        //根据条件筛选培养计划
        Specification<Edu107> specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String>get("edu103"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String>get("edu104"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.like(root.<String>get("edu105"), '%' + edu001.getNj() + '%'));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String>get("edu106"), edu001.getZybm()));
                }

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> edu107List = edu107Dao.findAll(specification);
        if (edu107List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<Long> edu107IdList = edu107List.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<String> edu201Ids = new ArrayList<>();
        if(edu108IdList.size()>1000) {
            List<List<Long>> edu108Idss = utils.splitList(edu108IdList, 1000);
            for(List<Long> e:edu108Idss){
                edu201Ids.addAll(edu201Dao.getTaskByEdu108Ids(e));
            }
        }else{
            edu201Ids = edu201Dao.getTaskByEdu108Ids(edu108IdList);
        }

        //两个201id集合去交集
        edu201IdList.retainAll(edu201Ids);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        List edu201ids = utils.heavyListMethod(edu201IdList);

        //根据条件筛选成绩表
        Specification<TeacherGradeClassPO> teacherGradeClassPOSpecification = new Specification<TeacherGradeClassPO>() {
            public Predicate toPredicate(Root<TeacherGradeClassPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("courseName"), "%" + edu005.getCourseName() + "%"));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String>get("className"),"%"+edu001.getXzbname()+"%"));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getIsConfirm() != null && !"".equals(edu005.getIsConfirm())) {
                    if("T".equals(edu005.getIsConfirm())){
                        predicates.add(cb.equal(root.<String>get("isConfirm"),edu005.getIsConfirm()));
                    }else{
                        predicates.add(cb.isNull(root.<String>get("isConfirm")));
                    }
                }
                Path<Object> Edu201Path = root.get("edu201_id");//定义查询的字段
                CriteriaBuilder.In<Object> inEdu201 = cb.in(Edu201Path);
                for (int i = 0; i < edu201ids.size(); i++) {
                    inEdu201.value(edu201ids.get(i));//存入值
                }
                predicates.add(cb.and(inEdu201));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<TeacherGradeClassPO> teacherGradeClassPOList = teacherGradeClassViewDao.findAll(teacherGradeClassPOSpecification);

        if (teacherGradeClassPOList.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合要求的班级");
        } else {
            resultVO = ResultVO.setSuccess("查找成功",teacherGradeClassPOList);
        }

        return resultVO;
    }

    //验证是否可录入补考成绩
    public ResultVO entryMUGradesCheck(String edu005Id){
        ResultVO resultVO;
        Edu005 edu005 = edu005Dao.findOne(Long.parseLong(edu005Id));
        Edu404 edu404 = edu404Dao.findbyxnid2(edu005.getXnid());
        if (edu404 == null){
            resultVO = ResultVO.setFailed("补考录入时间未开启!");
            return resultVO;
        }
        if ("1".equals(edu404.getStatus())){
            resultVO = ResultVO.setFailed("补考录入时间已截止!");
            return resultVO;
        }

        if(edu005.getExam_num() != null && Integer.parseInt(edu404.getCount())==edu005.getExam_num()){
            resultVO = ResultVO.setFailed("已录入补考成绩!");
            return resultVO;
        }
        resultVO = ResultVO.setSuccess("通过!");
        return resultVO;
    }

    //确认录入补考成绩
    public ResultVO entryMUGrades(String userId,List<Edu005> edu005s,List<String> ids){
        ResultVO resultVO;
        TeacherMUGradeClassPO teacherMUGradeClassPO = teacherMUGradeClassViewDao.findbyid(ids.get(0));
        Edu404 edu404 = edu404Dao.findbyxnid2(teacherMUGradeClassPO.getXnid());
        if (edu404 == null){
            resultVO = ResultVO.setFailed("补考录入时间未开启!");
            return resultVO;
        }
        if ("1".equals(edu404.getStatus())){
            resultVO = ResultVO.setFailed("补考录入时间已截止!");
            return resultVO;
        }
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(currentTime);

        for (int i = 0;i<edu005s.size();i++){
            Edu005 edu005New = edu005s.get(i);
            Edu005 edu005 = edu005Dao.findOne(edu005New.getEdu005_ID());
            edu005.setGrade(edu005New.getGrade());
            double grade = Double.parseDouble(edu005New.getGrade());
            if (grade < 60.00) {
                edu005.setGetCredit(0.00);
                edu005.setIsPassed("F");
            } else {
                edu005.setGetCredit(edu005New.getCredit());
                edu005.setIsPassed("T");
            }
            edu005.setExam_num(Integer.parseInt(edu404.getCount()));
            edu005Dao.save(edu005);

            //如果缺少成绩，则补录之前缺失的成绩(录入第五次补考成绩)
            List<Edu0051> edu0051List = edu0051Dao.getHistoryGrade(edu005.getEdu005_ID()+"");//
            if(edu0051List == null){
                Edu0051 edu0051 = new Edu0051();
                edu0051.setEdu005_ID(edu005.getEdu005_ID());
                edu0051.setEdu001_ID(edu005.getEdu001_ID());
                edu0051.setEdu201_ID(edu005.getEdu201_ID());
                edu0051.setEdu300_ID(edu005.getEdu300_ID());
                edu0051.setEdu101_ID(edu005.getEdu101_ID());
                edu0051.setCourseName(edu005.getCourseName());
                edu0051.setClassName(edu005.getClassName());
                edu0051.setStudentName(edu005.getStudentName());
                edu0051.setStudentCode(edu005.getStudentCode());
                edu0051.setGradeEnter("-1");
                edu0051.setEntryDate(dateString);
                edu0051.setGrade(edu005.getGrade());
                edu0051.setXnid(edu005.getXnid());
                edu0051.setXn(edu005.getXn());
                edu0051.setExam_num(0);
                edu0051Dao.save(edu0051);
                edu0051List = edu0051Dao.getHistoryGrade(edu005.getEdu005_ID()+"");
            }
            int examNum = edu0051List.get(edu0051List.size()-1).getExam_num();//0
            for(int ii =1 ;ii<(edu005.getExam_num()-examNum);ii++){
                Edu0051 edu0051 = new Edu0051();
                edu0051.setEdu005_ID(edu005.getEdu005_ID());
                edu0051.setEdu001_ID(edu005.getEdu001_ID());
                edu0051.setEdu201_ID(edu005.getEdu201_ID());
                edu0051.setEdu300_ID(edu005.getEdu300_ID());
                edu0051.setEdu101_ID(edu005.getEdu101_ID());
                edu0051.setCourseName(edu005.getCourseName());
                edu0051.setClassName(edu005.getClassName());
                edu0051.setStudentName(edu005.getStudentName());
                edu0051.setStudentCode(edu005.getStudentCode());
                edu0051.setGradeEnter(edu005.getGradeEnter());
                edu0051.setEntryDate(dateString);
                edu0051.setGrade("-1");
                edu0051.setXnid(edu005.getXnid());
                edu0051.setXn(edu005.getXn());
                edu0051.setExam_num(examNum+ii);
                edu0051Dao.save(edu0051);
            }

            Edu0051 edu0051 = new Edu0051();
            edu0051.setEdu005_ID(edu005.getEdu005_ID());
            edu0051.setEdu001_ID(edu005.getEdu001_ID());
            edu0051.setEdu201_ID(edu005.getEdu201_ID());
            edu0051.setEdu300_ID(edu005.getEdu300_ID());
            edu0051.setEdu101_ID(edu005.getEdu101_ID());
            edu0051.setCourseName(edu005.getCourseName());
            edu0051.setClassName(edu005.getClassName());
            edu0051.setStudentName(edu005.getStudentName());
            edu0051.setStudentCode(edu005.getStudentCode());
            edu0051.setGradeEnter(edu005.getGradeEnter());
            edu0051.setEntryDate(dateString);
            edu0051.setGrade(edu005.getGrade());
            edu0051.setXnid(edu005.getXnid());
            edu0051.setXn(edu005.getXn());
            edu0051.setExam_num(edu005.getExam_num());
            edu0051Dao.save(edu0051);
        }
        for (int i =0;i<ids.size();i++){
            teacherMUGradeClassPO = teacherMUGradeClassViewDao.findbyid(ids.get(i));
            List<Edu005> edu005List = edu005Dao.entryMUGrades(teacherMUGradeClassPO.getClassName(),teacherMUGradeClassPO.getCourseName(),edu404.getCount());
            if(edu005List.size()>0){
                for (Edu005 edu005:edu005List){
                    edu005.setExam_num(Integer.parseInt(edu404.getCount()));
                    edu005Dao.save(edu005);

                    //如果缺少成绩，则补录之前缺失的成绩(录入第五次补考成绩)
                    List<Edu0051> edu0051List = edu0051Dao.getHistoryGrade(edu005.getEdu005_ID()+"");//
                    if(edu0051List == null){
                        Edu0051 edu0051 = new Edu0051();
                        edu0051.setEdu005_ID(edu005.getEdu005_ID());
                        edu0051.setEdu001_ID(edu005.getEdu001_ID());
                        edu0051.setEdu201_ID(edu005.getEdu201_ID());
                        edu0051.setEdu300_ID(edu005.getEdu300_ID());
                        edu0051.setEdu101_ID(edu005.getEdu101_ID());
                        edu0051.setCourseName(edu005.getCourseName());
                        edu0051.setClassName(edu005.getClassName());
                        edu0051.setStudentName(edu005.getStudentName());
                        edu0051.setStudentCode(edu005.getStudentCode());
                        edu0051.setGradeEnter(edu005.getGradeEnter());
                        edu0051.setEntryDate(dateString);
                        edu0051.setGrade("-1");
                        edu0051.setXnid(edu005.getXnid());
                        edu0051.setXn(edu005.getXn());
                        edu0051.setExam_num(0);
                        edu0051Dao.save(edu0051);
                        edu0051List = edu0051Dao.getHistoryGrade(edu005.getEdu005_ID()+"");
                    }
                    int examNum = edu0051List.get(edu0051List.size()-1).getExam_num();//0
                    for(int ii =1 ;ii<(edu005.getExam_num()-examNum);ii++){
                        Edu0051 edu0051 = new Edu0051();
                        edu0051.setEdu005_ID(edu005.getEdu005_ID());
                        edu0051.setEdu001_ID(edu005.getEdu001_ID());
                        edu0051.setEdu201_ID(edu005.getEdu201_ID());
                        edu0051.setEdu300_ID(edu005.getEdu300_ID());
                        edu0051.setEdu101_ID(edu005.getEdu101_ID());
                        edu0051.setCourseName(edu005.getCourseName());
                        edu0051.setClassName(edu005.getClassName());
                        edu0051.setStudentName(edu005.getStudentName());
                        edu0051.setStudentCode(edu005.getStudentCode());
                        edu0051.setGradeEnter(edu005.getGradeEnter());
                        edu0051.setEntryDate(dateString);
                        edu0051.setGrade("-1");
                        edu0051.setXnid(edu005.getXnid());
                        edu0051.setXn(edu005.getXn());
                        edu0051.setExam_num(examNum+ii);
                        edu0051Dao.save(edu0051);
                    }

                    Edu0051 edu0051 = new Edu0051();
                    edu0051.setEdu005_ID(edu005.getEdu005_ID());
                    edu0051.setEdu001_ID(edu005.getEdu001_ID());
                    edu0051.setEdu201_ID(edu005.getEdu201_ID());
                    edu0051.setEdu300_ID(edu005.getEdu300_ID());
                    edu0051.setEdu101_ID(edu005.getEdu101_ID());
                    edu0051.setCourseName(edu005.getCourseName());
                    edu0051.setClassName(edu005.getClassName());
                    edu0051.setStudentName(edu005.getStudentName());
                    edu0051.setStudentCode(edu005.getStudentCode());
                    edu0051.setGradeEnter(edu005.getGradeEnter());
                    edu0051.setEntryDate(dateString);
                    edu0051.setGrade(edu005.getGrade());
                    edu0051.setXnid(edu005.getXnid());
                    edu0051.setXn(edu005.getXn());
                    edu0051.setExam_num(edu005.getExam_num());
                    edu0051Dao.save(edu0051);
                }
            }
        }
        resultVO = ResultVO.setSuccess("成绩录入成功!");
        return resultVO;
    }


    //查询需要录入补考成绩的班级
    public ResultVO queryMUGradesClass(String userId, Edu001 edu001, Edu005 edu005) {
        ResultVO resultVO;
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();

        //查询教师任务书ID列表
        List<String> edu201IdList = edu205Dao.findEdu201IdByTeacher(userKey);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        //根据条件筛选培养计划
        Specification<Edu107> specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String>get("edu103"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String>get("edu104"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.like(root.<String>get("edu105"), '%' + edu001.getNj() + '%'));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String>get("edu106"), edu001.getZybm()));
                }

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> edu107List = edu107Dao.findAll(specification);
        if (edu107List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<Long> edu107IdList = edu107List.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<String> edu201Ids = new ArrayList<>();
        if(edu108IdList.size()>1000) {
            List<List<Long>> edu108Idss = utils.splitList(edu108IdList, 1000);
            for(List<Long> e:edu108Idss){
                edu201Ids.addAll(edu201Dao.getTaskByEdu108Ids(e));
            }
        }else{
            edu201Ids = edu201Dao.getTaskByEdu108Ids(edu108IdList);
        }
        //两个201id集合去交集
        edu201IdList.retainAll(edu201Ids);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        List edu201ids = utils.heavyListMethod(edu201IdList);

        //根据条件筛选成绩表
        Specification<TeacherMUGradeClassPO> teacherGradeClassPOSpecification = new Specification<TeacherMUGradeClassPO>() {
            public Predicate toPredicate(Root<TeacherMUGradeClassPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("courseName"), "%" + edu005.getCourseName() + "%"));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String>get("className"),"%"+edu001.getXzbname()+"%"));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }

                Path<Object> Edu201Path = root.get("edu201_id");//定义查询的字段
                CriteriaBuilder.In<Object> inEdu201 = cb.in(Edu201Path);
                for (int i = 0; i < edu201ids.size(); i++) {
                    inEdu201.value(edu201ids.get(i));//存入值
                }
                predicates.add(cb.and(inEdu201));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<TeacherMUGradeClassPO> teacherMUGradeClassPOList = teacherMUGradeClassViewDao.findAll(teacherGradeClassPOSpecification);

        if (teacherMUGradeClassPOList.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合要求的班级");
        } else {
            resultVO = ResultVO.setSuccess("查找成功",teacherMUGradeClassPOList);
        }

        return resultVO;
    }

    //根据TGC的id查询需要录入成绩的学生名单
    public ResultVO queryGradesByTGCId(List<String> ids,Edu005 edu005){
        ResultVO resultVO;
        List<Edu005> edu005List = new ArrayList<>();
        for(int i = 0;i<ids.size();i++){
            String id = ids.get(i);
            TeacherGradeClassPO teacherGradeClassPOList = teacherGradeClassViewDao.findbyid(id);
            List<Edu005> edu005s = edu005Dao.studentGetGradesByClassCourseXn(teacherGradeClassPOList.getClassName(),teacherGradeClassPOList.getCourseName(),teacherGradeClassPOList.getXnid());
            List<Long> edu005IdList = edu005s.stream().map(e -> e.getEdu005_ID()).distinct().collect(Collectors.toList());
            //根据条件筛选成绩表
            Specification<Edu005> edu005Specification = new Specification<Edu005>() {
                public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                        predicates.add(cb.like(root.<String>get("courseName"), "%" + edu005.getCourseName() + "%"));
                    }
                    if (edu005.getStudentName() != null && !"".equals(edu005.getStudentName())) {
                        predicates.add(cb.like(root.<String>get("studentName"),"%"+edu005.getStudentName()+"%"));
                    }
                    if (edu005.getStudentCode() != null && !"".equals(edu005.getStudentCode())) {
                        predicates.add(cb.like(root.<String>get("studentCode"),"%"+edu005.getStudentCode() +"%"));
                    }
                    if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                        predicates.add(cb.like(root.<String>get("className"),"%"+edu005.getClassName()+"%"));
                    }
                    if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                        predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                    }

                    Path<Object> Edu005Path = root.get("edu005_ID");//定义查询的字段
                    CriteriaBuilder.In<Object> inEdu005 = cb.in(Edu005Path);
                    for (int i = 0; i < edu005IdList.size(); i++) {
                        inEdu005.value(edu005IdList.get(i));//存入值
                    }
                    predicates.add(cb.and(inEdu005));
                    query.orderBy(cb.desc(root.get("className")));
                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Edu005> edu005Lists = edu005Dao.findAll(edu005Specification);
            if(edu005Lists.size()>0){
                edu005List.addAll(edu005Lists);
            }
        }
        if(edu005List.size() == 0){
            resultVO = ResultVO.setFailed("暂无数据");
        }else{
            resultVO = ResultVO.setSuccess("共查询到"+edu005List.size()+"条数据",edu005List);
        }
        return resultVO;
    }

    //根据TMUGC的id查询需要录入补考成绩的学生名单
    public ResultVO queryGradesByTMUGCId(List<String> ids,Edu005 edu005){
        ResultVO resultVO;
        List<Edu005> edu005List = new ArrayList<>();
        for(int i = 0;i<ids.size();i++){
            String id = ids.get(i);
            TeacherMUGradeClassPO teacherMUGradeClassPO = teacherMUGradeClassViewDao.findbyid(id);
            List<Edu005> edu005s = edu005Dao.studentGetGradesByClassCourseXn2(teacherMUGradeClassPO.getClassName(),teacherMUGradeClassPO.getCourseName(),teacherMUGradeClassPO.getXnid());
            List<Long> edu005IdList = edu005s.stream().map(e -> e.getEdu005_ID()).distinct().collect(Collectors.toList());
            //根据条件筛选成绩表
            Specification<Edu005> edu005Specification = new Specification<Edu005>() {
                public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                        predicates.add(cb.like(root.<String>get("courseName"), "%" + edu005.getCourseName() + "%"));
                    }
                    if (edu005.getStudentName() != null && !"".equals(edu005.getStudentName())) {
                        predicates.add(cb.like(root.<String>get("studentName"),"%"+edu005.getStudentName()+"%"));
                    }
                    if (edu005.getStudentCode() != null && !"".equals(edu005.getStudentCode())) {
                        predicates.add(cb.like(root.<String>get("studentCode"),"%"+edu005.getStudentCode() +"%"));
                    }
                    if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                        predicates.add(cb.like(root.<String>get("className"),"%"+edu005.getClassName()+"%"));
                    }
                    if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                        predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                    }

                    Path<Object> Edu005Path = root.get("edu005_ID");//定义查询的字段
                    CriteriaBuilder.In<Object> inEdu005 = cb.in(Edu005Path);
                    for (int i = 0; i < edu005IdList.size(); i++) {
                        inEdu005.value(edu005IdList.get(i));//存入值
                    }
                    predicates.add(cb.and(inEdu005));
                    query.orderBy(cb.desc(root.get("className")));
                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Edu005> edu005Lists = edu005Dao.findAll(edu005Specification);
            if(edu005Lists.size()>0){
                edu005List.addAll(edu005Lists);
            }
        }
        if(edu005List.size() == 0){
            resultVO = ResultVO.setFailed("暂无数据");
        }else{
            resultVO = ResultVO.setSuccess("共查询到"+edu005List.size()+"条数据",edu005List);
        }
        return resultVO;
    }

    //根据xnid查询学年信息
    public ResultVO queryNowXN(String xnid) {
        ResultVO resultVO;
        if(xnid != null && !"".equals(xnid)){
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
            if (edu400 == null){
                resultVO = ResultVO.setFailed("暂无学年信息!");
            }else{
                resultVO = ResultVO.setSuccess("查询成功!",edu400);
            }
        }else{
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
            java.util.Date date=new java.util.Date();
            String str=sdf.format(date);
            xnid = edu400Dao.findXnidByNow(str);
            if(xnid == null){
                resultVO = ResultVO.setFailed("暂无学年信息!");
            }else{
                Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                resultVO = ResultVO.setSuccess("查询成功!",edu400);
            }
        }
        return resultVO;
    }

    //根据xnid查询补考录入信息
    public ResultVO queryMUinfo(String xnid) {
        ResultVO resultVO;
        if(xnid != null && !"".equals(xnid)){
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
            if(edu400 == null){
                resultVO = ResultVO.setFailed("暂无当前学年信息!");
                return resultVO;
            }
            Edu404 edu404 = edu404Dao.findbyxnid2(xnid);
            if (edu404 == null){
                resultVO = ResultVO.setFailed("暂未开启补考录入",edu400.getXnmc());
            }else{
                resultVO = ResultVO.setSuccess("查询成功!",edu404);
            }
        }else{
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
            java.util.Date date=new java.util.Date();
            String str=sdf.format(date);
            xnid = edu400Dao.findXnidByNow(str);
            if(xnid == null){
                resultVO = ResultVO.setFailed("暂无当前学年信息!");
            }else{
                Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                Edu404 edu404 = edu404Dao.findbyxnid2(xnid);
                if (edu404 == null){
                    resultVO = ResultVO.setFailed("暂未开启补考录入",edu400.getXnmc());
                }else{
                    resultVO = ResultVO.setSuccess("查询成功!",edu404);
                }
            }
        }
        return resultVO;
    }

    //修改补考成绩
    /*public ResultVO updateMakeUpGrade(List<Edu0051> edu0051s,String userId) {
        ResultVO resultVO;
        for (int ii =0;ii<edu0051s.size();ii++) {
            Edu0051 edu0051 = edu0051s.get(ii);
            Edu0051 edu0051old = edu0051Dao.findOne(edu0051.getEdu0051_ID());
            edu0051old.setGrade(edu0051.getGrade());
            Edu005 edu005 = edu005Dao.findOne(edu0051old.getEdu005_ID());
            if (edu0051old.getExam_num() == edu005.getExam_num()) {
                if (edu005.getGrade().equals("T")) {
                    edu005.setGetCredit(edu005.getCredit());
                    edu005.setIsPassed("T");
                } else if (edu005.getGrade().equals("F")) {
                    edu005.setGetCredit(0.00);
                    edu005.setIsPassed("F");
                } else {
                    double i = Double.parseDouble(edu005.getGrade());
                    if (i < 60.00) {
                        edu005.setGetCredit(0.00);
                        edu005.setIsPassed("F");
                    } else {
                        edu005.setGetCredit(edu005.getCredit());
                        edu005.setIsPassed("T");
                    }
                }
                edu005.setGrade(edu0051.getGrade());
                edu005Dao.save(edu005);
            }
            administrationPageService.addLog(userId,6,1,edu0051old.getEdu0051_ID()+"",edu0051.getStudentName()+":"+edu0051.getCourseName());
            edu0051Dao.save(edu0051old);
        }
        resultVO = ResultVO.setSuccess("成绩修改成功");
        return resultVO;
    }*/



    //录入或修改成绩
    public ResultVO giveGrade(Edu005 edu005) {
        ResultVO resultVO;
        Edu404 edu404 = new Edu404();
        if("T".equals(edu005.getIsResit()) && "T".equals(edu005.getIsConfirm())){
            edu404 = edu404Dao.findbyxnid2(edu005.getXnid());
            if (edu404 == null){
                resultVO = ResultVO.setFailed("补考录入时间未开启!");
                return resultVO;
            }
            if ("1".equals(edu404.getStatus())){
                resultVO = ResultVO.setFailed("补考录入时间已截止!");
                return resultVO;
            }
        }

        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(currentTime);
        edu005.setEntryDate(dateString);
        if(edu005.getIsMx() != null && !edu005.getIsMx().equals("0")){
            if(edu005.getIsMx().equals("01")){
                edu005.setGetCredit(edu005.getCredit());
                edu005.setIsPassed("T");
            }else{
                edu005.setIsPassed("F");
            }
        }else{
            if ("F".equals(edu005.getGrade())) {
                edu005.setGetCredit(0.00);
                edu005.setIsPassed("F");
            } else if ("T".equals(edu005.getGrade())) {
                edu005.setGetCredit(edu005.getCredit());
                edu005.setIsPassed("T");
            } else {
                double i = Double.parseDouble(edu005.getGrade());
                if (i < 60.00) {
                    edu005.setGetCredit(0.00);
                    edu005.setIsPassed("F");
                } else {
                    edu005.setGetCredit(edu005.getCredit());
                    edu005.setIsPassed("T");
                }
            } if("T".equals(edu005.getIsResit())){
//                if(edu005.getExam_num() == null){
//                    edu005.setExam_num(1);
//                }else{
//                    edu005.setExam_num(edu005.getExam_num()+1);
//                }
                edu005.setExam_num(Integer.parseInt(edu404.getCount()));
            }
        }
        edu005Dao.save(edu005);
        if("T".equals(edu005.getIsResit()) && "T".equals(edu005.getIsConfirm())){
            Edu0051 edu0051 = edu0051Dao.getGradeByNum(edu005.getEdu005_ID()+"",edu005.getExam_num()+"");
            if(edu0051 == null){
                edu0051 = new Edu0051();
            }
            edu0051.setEdu005_ID(edu005.getEdu005_ID());
            edu0051.setEdu001_ID(edu005.getEdu001_ID());
            edu0051.setEdu201_ID(edu005.getEdu201_ID());
            edu0051.setEdu300_ID(edu005.getEdu300_ID());
            edu0051.setEdu101_ID(edu005.getEdu101_ID());
            edu0051.setCourseName(edu005.getCourseName());
            edu0051.setClassName(edu005.getClassName());
            edu0051.setStudentName(edu005.getStudentName());
            edu0051.setStudentCode(edu005.getStudentCode());
            edu0051.setGradeEnter(edu005.getGradeEnter());
            edu0051.setEntryDate(edu005.getEntryDate());
            edu0051.setGrade(edu005.getGrade());
            edu0051.setXnid(edu005.getXnid());
            edu0051.setXn(edu005.getXn());
            edu0051.setExam_num(edu005.getExam_num());
            edu0051Dao.save(edu0051);
        }
        resultVO = ResultVO.setSuccess("成绩录入成功",edu005);
        return resultVO;
    }



    //查询所有老师
    public ResultVO queryAllTeachers() {
        ResultVO resultVO;
        List<Edu101> edu101List = edu101Dao.findAllteachers();
        if(edu101List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可选老师");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu101List);
        }
        return resultVO;
    }

    //查询所有上课老师
    public ResultVO queryAllClassTeachers(String xnid,Edu300 edu300) {
        ResultVO resultVO;

        Specification<Edu300> specification = new Specification<Edu300>() {
            public Predicate toPredicate(Root<Edu300> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu300.getPyccbm() != null && !"".equals(edu300.getPyccbm())) {
                    predicates.add(cb.equal(root.<String>get("pyccbm"), edu300.getPyccbm()));
                }
                if (edu300.getXbbm() != null && !"".equals(edu300.getXbbm())) {
                    predicates.add(cb.equal(root.<String>get("xbbm"), edu300.getXbbm()));
                }
                if (edu300.getNjbm() != null && !"".equals(edu300.getNjbm())) {
                    predicates.add(cb.equal(root.<String>get("njbm"), edu300.getNjbm()));
                }
                if (edu300.getZybm() != null && !"".equals(edu300.getZybm())) {
                    predicates.add(cb.equal(root.<String>get("zybm"), edu300.getZybm()));
                }
                if (edu300.getBatch() != null && !"".equals(edu300.getBatch())) {
                    predicates.add(cb.equal(root.<String>get("batch"), edu300.getBatch()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu300> classEntities = edu300Dao.findAll(specification);
        List<Long> edu300Ids = classEntities.stream().map(Edu300::getEdu300_ID).collect(Collectors.toList());

        List<Edu101> edu101List = new ArrayList<>();
        if(xnid == null || "".equals(xnid)){
            edu101List = edu101Dao.queryAllClassTeachers(edu300Ids);
        }else{
            edu101List = edu101Dao.queryAllClassTeachers(xnid,edu300Ids);
        }
        if(edu101List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无授课老师");
        } else {
            Map map = new HashMap();
            //查询总学时和已上学时
            edu101List = setwwxs(edu101List,xnid);
            map.put("tableInfo",edu101List);
            List<Edu000> edu000List = edu000Dao.queryejdm("jzglx");
            if(xnid == null || "".equals(xnid)){
                List<Edu400> edu400List = edu400Dao.findAllXn();
                List<Map> mapList = new ArrayList<>();
                List<Map> mapList2 = new ArrayList<>();
                int max[] = new int[edu000List.size()];
                int max2[] = new int[edu000List.size()];
                for(Edu400 edu400:edu400List){
                    Map mapData = new HashMap();
                    Map mapData2 = new HashMap();
                    mapData.put("name",edu400.getXnmc());
                    mapData2.put("name",edu400.getXnmc());
                    int[] value = new int[edu000List.size()];
                    int[] value2 = new int[edu000List.size()];
                    for (int i = 0;i<edu000List.size();i++){
                        value[i] = edu101Dao.queryAllClassTeachersNum(edu400.getEdu400_ID()+"",edu000List.get(i).getEjdm(),edu300Ids);
                        value2[i] = edu101Dao.queryAllClassTeachersTNum(edu400.getEdu400_ID()+"",edu000List.get(i).getEjdm(),edu300Ids);
                        if(max[i] < value[i]){
                            max[i] = value[i];
                        }
                        if(max2[i] < value2[i]){
                            max2[i] = value2[i];
                        }
                    }
                    mapData.put("value",value);
                    mapList.add(mapData);
                    mapData2.put("value",value2);
                    mapList2.add(mapData2);
                }
                map.put("data",mapList);
                map.put("data2",mapList2);
                mapList = new ArrayList<>();
                mapList2 = new ArrayList<>();
                for(int i = 0;i<edu000List.size();i++){
                    Edu000 edu000 = edu000List.get(i);
                    Map mapData = new HashMap();
                    mapData.put("name",edu000.getEjdmz());
                    if(max[i] == 0){
                        mapData.put("max",10);
                    }else{
                        mapData.put("max",max[i]+10);
                    }
                    mapList.add(mapData);
                    Map mapData2 = new HashMap();
                    mapData2.put("name",edu000.getEjdmz());
                    if(max[i] == 0){
                        mapData2.put("max",10);
                    }else{
                        mapData2.put("max",max2[i]+100);
                    }
                    mapList2.add(mapData2);
                }
                map.put("indicator",mapList);
                map.put("indicator2",mapList2);
            }else{
                Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                List<Map> mapList = new ArrayList<>();
                List<Map> mapList2 = new ArrayList<>();
                Map mapData = new HashMap();
                Map mapData2 = new HashMap();
                mapData.put("name",edu400.getXnmc());
                mapData2.put("name",edu400.getXnmc());
                int[] value = new int[edu000List.size()];
                int[] value2 = new int[edu000List.size()];
                int max[] = new int[edu000List.size()];
                int max2[] = new int[edu000List.size()];
                for (int i = 0;i<edu000List.size();i++){
                    value[i] = edu101Dao.queryAllClassTeachersNum(xnid,edu000List.get(i).getEjdm(),edu300Ids);
                    value2[i] = edu101Dao.queryAllClassTeachersTNum(xnid,edu000List.get(i).getEjdm(),edu300Ids);
                    if(max[i] < value[i]){
                        max[i] = value[i];
                    }
                    if(max2[i] < value2[i]){
                        max2[i] = value2[i];
                    }
                }
                mapData.put("value",value);
                mapData2.put("value",value2);
                mapList.add(mapData);
                map.put("data",mapList);
                mapList2.add(mapData2);
                map.put("data2",mapList2);
                mapList = new ArrayList<>();
                mapList2 = new ArrayList<>();
                for(int i = 0;i<edu000List.size();i++){
                    Edu000 edu000 = edu000List.get(i);
                    mapData = new HashMap();
                    mapData.put("name",edu000.getEjdmz());
                    if(max[i] == 0){
                        mapData.put("max",10);
                    }else{
                        mapData.put("max",max[i]+10);
                    }
                    mapList.add(mapData);
                    mapData2 = new HashMap();
                    mapData2.put("name",edu000.getEjdmz());
                    if(max[i] == 0){
                        mapData2.put("max",10);
                    }else{
                        mapData2.put("max",max2[i]+100);
                    }
                    mapList2.add(mapData2);
                }
                map.put("indicator",mapList);
                map.put("indicator2",mapList2);
            }
            resultVO = ResultVO.setSuccess("查询成功",map);
        }
        return resultVO;
    }

    public List<Edu101> setwwxs(List<Edu101> edu101List,String xnid){
        try {
            if(xnid == null || "".equals(xnid)){
                for(Edu101 e:edu101List){
                    //全部的学时
                    e.setJsxs(edu203Dao.findAllYsxsByTeacher(e.getEdu101_ID()+""));
                    //已上的学时
                    int i = Integer.parseInt(edu203Dao.findAllYsxsByTeacher2(e.getEdu101_ID()+""));

                    Date now = new Date();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String str=sdf.format(now);
                    xnid = edu400Dao.findXnidByNow(str);
                    Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                    int week = DateUtils.calcWeekOffset(sdf.parse(edu400.getKssj()), now) + 1;
                    String xqid = DateUtils.dateToWeek(now);
                    int ii = Integer.parseInt(edu203Dao.findAllYsxsByTeacher3(e.getEdu101_ID()+"",xnid, week+"", xqid));
                    e.setYsxs((i+ii)+"");
                }
            }else{
                for(Edu101 e:edu101List){
                    //全部的学时
                    String all = edu203Dao.findAllYsxsByTeacher1(e.getEdu101_ID()+"",xnid);
                    e.setJsxs(all);
                    //已上的学时
                    Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                    Date now = new Date();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String kssj = edu400.getKssj();
                    Date startDate = sdf.parse(kssj);
                    String jssj = edu400.getJssj();
                    Date endDate = sdf.parse(jssj);
                    if (now.getTime() < startDate.getTime()) {
                        e.setYsxs("0");
                    }else if (now.getTime() > endDate.getTime()) {
                        e.setYsxs(all);
                    }else{
                        int week = DateUtils.calcWeekOffset(sdf.parse(edu400.getKssj()), now) + 1;
                        String xqid = DateUtils.dateToWeek(now);
                        String pass = edu203Dao.findAllYsxsByTeacher3(e.getEdu101_ID()+"",xnid, week+"", xqid);
                        e.setYsxs(pass);
                    }
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return  edu101List;
    }

    public Edu201 setXs(Edu201 e,String edu101Id){
        try {
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong(e.getXnid()));
            Date now = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String kssj = edu400.getKssj();
            Date startDate = sdf.parse(kssj);
            String jssj = edu400.getJssj();
            Date endDate = sdf.parse(jssj);
            if (now.getTime() < startDate.getTime()) {
//                        map.put("sjskxs", "0");
                String numm = edu203Dao.findXsByTeacher(e.getEdu201_ID()+"",edu101Id);
                e.setJsxs(numm);
                e.setYsxs("0");
            } else if (now.getTime() > endDate.getTime()) {
//                        map.put("sjskxs", zxs);
                String numm = edu203Dao.findXsByTeacher(e.getEdu201_ID()+"",edu101Id);
                e.setJsxs(numm);
                e.setYsxs(numm);
            }else{
                String numm = edu203Dao.findXsByTeacher(e.getEdu201_ID()+"",edu101Id);
                e.setJsxs(numm);
                int week = DateUtils.calcWeekOffset(startDate, now) + 1;
                //获取当前星期id
                String xqid = DateUtils.dateToWeek(now);
                String countPass = edu203Dao.findYsxsByTeacher(e.getEdu201_ID()+"",edu101Id, week+"", xqid);
                e.setYsxs(countPass);
            }
        }catch(Exception exception){
            exception.printStackTrace();
        }
        return e;
    }

    //查询所有上课老师授课情况
    public ResultVO queryAllClassTeachersDetail(String edu101Id,String xnid) {
        ResultVO resultVO;
        Map resultMap = new HashMap();
        List<Edu201> edu201List;
        if(xnid == null || "".equals(xnid)){
            edu201List = edu201Dao.queryAllClassTeachersDetail(edu101Id);
            if(edu201List.size() == 0) {
                resultVO = ResultVO.setFailed("暂无数据！");
            } else {
                for(Edu201 e:edu201List){
                    e = setXs(e,edu101Id);
                    if("01".equals(e.getClassType())){
                        e.setBjsl("1");
                    }else{
//                    String num = edu201Dao.queryBJSL(e.getEdu201_ID()+"");
//                    e.setBjsl(num);
                        String className = e.getClassName();
                        int num = className.length() - className.replaceAll(",", "").length() + 1;
                        e.setBjsl(num+"");
                    }
                }
                resultMap.put("tableInfo",edu201List);

                List<Edu000> edu000List = edu000Dao.queryejdm("cklx");
                List<Map> mapList = new ArrayList<>();
                for(Edu000 edu000:edu000List){
                    Map map = new HashMap();
                    map.put("name",edu000.getEjdmz());
                    map.put("value",edu201Dao.queryAllClassTeachersDetailKCLX(edu101Id,edu000.getEjdm()));
                    mapList.add(map);
                }
                resultMap.put("data",mapList);
                resultVO = ResultVO.setSuccess("查询成功",resultMap);
            }
        }else{
            edu201List = edu201Dao.queryAllClassTeachersDetail(edu101Id,xnid);
            if(edu201List.size() == 0) {
                resultVO = ResultVO.setFailed("暂无数据！");
            } else {
                try {
                    Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
                    Date now = new Date();
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    String kssj = edu400.getKssj();
                    Date startDate = sdf.parse(kssj);
                    String jssj = edu400.getJssj();
                    Date endDate = sdf.parse(jssj);
                    if (now.getTime() < startDate.getTime()) {
//                        map.put("sjskxs", "0");
                        for(Edu201 e:edu201List){
                            if("01".equals(e.getClassType())){
                                e.setBjsl("1");
                            }else{
                                String className = e.getClassName();
                                int num = className.length() - className.replaceAll(",", "").length() + 1;
                                e.setBjsl(num+"");
                            }
                            String numm = edu203Dao.findXsByTeacher(e.getEdu201_ID()+"",edu101Id);
                            e.setJsxs(numm);
                            e.setYsxs("0");
                        }
                    } else if (now.getTime() > endDate.getTime()) {
//                        map.put("sjskxs", zxs);
                        for(Edu201 e:edu201List){
                            if("01".equals(e.getClassType())){
                                e.setBjsl("1");
                            }else{
                                String className = e.getClassName();
                                int num = className.length() - className.replaceAll(",", "").length() + 1;
                                e.setBjsl(num+"");
                            }
                            String numm = edu203Dao.findXsByTeacher(e.getEdu201_ID()+"",edu101Id);
                            e.setJsxs(numm);
                            e.setYsxs(numm);
                        }
                    }else{
                        for(Edu201 e:edu201List){
                            if("01".equals(e.getClassType())){
                                e.setBjsl("1");
                            }else{
                                String className = e.getClassName();
                                int num = className.length() - className.replaceAll(",", "").length() + 1;
                                e.setBjsl(num+"");
                            }
                            String numm = edu203Dao.findXsByTeacher(e.getEdu201_ID()+"",edu101Id);
                            e.setJsxs(numm);
                            int week = DateUtils.calcWeekOffset(startDate, now) + 1;
                            //获取当前星期id
                            String xqid = DateUtils.dateToWeek(now);
                            String countPass = edu203Dao.findYsxsByTeacher(e.getEdu201_ID()+"",edu101Id, week+"", xqid);
                            e.setYsxs(countPass);
                        }
                    }
                }catch(Exception e){
                    e.printStackTrace();
                }

                resultMap.put("tableInfo",edu201List);

                List<Edu000> edu000List = edu000Dao.queryejdm("cklx");
                List<Map> mapList = new ArrayList<>();
                for(Edu000 edu000:edu000List){
                    Map map = new HashMap();
                    map.put("name",edu000.getEjdmz());
                    map.put("value",edu201Dao.queryAllClassTeachersDetailKCLX(edu101Id,xnid,edu000.getEjdm()));
                    mapList.add(map);
                }
                resultMap.put("data",mapList);
                resultVO = ResultVO.setSuccess("查询成功",resultMap);
            }
        }
        return resultVO;
    }


    //获取考勤信息
    public CourseCheckOnPO getCourseCheckOnInfo(String courseId) {
        CourseCheckOnPO courseCheckOnPO = courseCheckOnDao.findOne(courseId);
        return courseCheckOnPO;
    }

    //创建考勤情况模版
    public XSSFWorkbook creatCourseCheckOnModal(CourseCheckOnPO courseCheckOnPO) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("考勤情况详情");

        //编写注意事项
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cell = firstRow.createCell(0);
        XSSFFont font = workbook.createFont();
        font.setColor(IndexedColors.RED.getIndex());//文字颜色
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        cell.setCellStyle(style);
        cell.setCellValue("注意：出勤情况请填写代码，01为正常，02为缺席");


        XSSFRow secondRow = sheet.createRow(1);// 第二行
        XSSFCell cells[] = new XSSFCell[1];
        // 所有标题数组
        String[] titles = new String[] {"学年","课程名称","周数","星期","课节","行政班名称","学生姓名","学号","出勤情况"};

        // 循环设置标题
        for (int i = 0; i < titles.length; i++) {
            cells[0] = secondRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }

        //根据任务书获取学生名单
        Edu201 one = edu201Dao.findOne(Long.parseLong(courseCheckOnPO.getEdu201_id()));
        List<String> edu300Ids = new ArrayList<>();
        if ("01".equals(one.getClassType())) {
            edu300Ids.add(one.getClassId().toString());
        } else {
            List<String> edu300IdsByEdu301Id = edu302Dao.findEdu300IdsByEdu301Id(one.getClassId().toString());
            edu300Ids.addAll(edu300IdsByEdu301Id);
        }
        List<Edu001> studentInEdu300 = edu001Dao.getStudentInEdu300(edu300Ids);

        for (int i = 0; i < studentInEdu300.size(); i++) {
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getXn(),-1,0,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getKcmc(),-1,1,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getWeek(),-1,2,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getXqmc(),-1,3,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getKjmc(),-1,4,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getXzbname(),-1,5,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getXm(),-1,6,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getXh(),-1,7,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getEdu203_id(),-1,9,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getEdu201_id(),-1,10,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getEdu001_ID().toString(),-1,11,false);
        }

        sheet.setColumnWidth(0, 12*256);
        sheet.setColumnWidth(1, 30*256);
        sheet.setColumnWidth(2, 4*256);
        sheet.setColumnWidth(3, 8*256);
        sheet.setColumnWidth(4, 10*256);
        sheet.setColumnWidth(5, 16*256);
        sheet.setColumnWidth(6, 10*256);
        sheet.setColumnWidth(7, 20*256);
        sheet.setColumnWidth(8, 10*256);

        sheet.setColumnHidden((short)9, true);
        sheet.setColumnHidden((short)10, true);
        sheet.setColumnHidden((short)11, true);

        CellRangeAddress region = new CellRangeAddress(0, 0, 0, 7);
        sheet.addMergedRegion(region);

        return workbook;
    }

    //校验导入考勤情况文件
    public ResultVO checkCourseCheckOnFile(MultipartFile file) {
        ResultVO resultVO;
        String fileName = file.getOriginalFilename();
        String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (!"xlsx".equals(suffix) && !"xls".equals(suffix)) {
            resultVO = ResultVO.setFailed("文件格式错误");
            return resultVO;
        }
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
            XSSFSheet sheet = workbook.getSheet("考勤情况详情");
            int totalRows = sheet.getPhysicalNumberOfRows() - 2;
            // 遍历集合数据，产生数据行
            for (int i = 0; i < totalRows; i++) {
                int rowIndex = i + 2;
                XSSFRow contentRow = sheet.getRow(rowIndex);
                XSSFCell cell0 = contentRow.getCell(0);
                XSSFCell cell1 = contentRow.getCell(1);
                XSSFCell cell2 = contentRow.getCell(2);
                XSSFCell cell3 = contentRow.getCell(3);
                XSSFCell cell4 = contentRow.getCell(4);
                XSSFCell cell5 = contentRow.getCell(5);
                XSSFCell cell6 = contentRow.getCell(6);
                XSSFCell cell7 = contentRow.getCell(7);
                XSSFCell cell9 = contentRow.getCell(9);
                XSSFCell cell10 = contentRow.getCell(10);
                XSSFCell cell11 = contentRow.getCell(11);
                if (cell0 == null || cell1 == null || cell2 == null || cell3 == null || cell4 == null || cell5 == null || cell6 == null || cell7 == null) {
                    resultVO = ResultVO.setFailed("第"+rowIndex+"行存在空值");
                    return resultVO;
                }
                if (cell9 == null || cell10 == null || cell11 == null ) {
                    resultVO = ResultVO.setFailed("模版错误，请示使用下载的模版");
                    return resultVO;
                }
                XSSFCell cell = contentRow.getCell(8);
                if(cell != null) {
                    String data = cell.toString();
                    Boolean isFit = true;//data是否为数值型
                    if (data != null) {
                        //判断data是否为数值型
                        if (!"01".equals(data) && !"02".equals(data)) {
                            isFit = false;
                        }
                    }
                    if(!isFit) {
                        resultVO = ResultVO.setFailed("第"+rowIndex+"行考勤情况代码违规");
                        return resultVO;
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("格式校验成功");
        return resultVO;
    }


    //导入考情情况文件
    public ResultVO importCourseCheckOnFile(MultipartFile file, String lrrmc, String userKey) {
        ResultVO resultVO;
        CourseCheckOnPO checkOnPO = new CourseCheckOnPO();
        try {
            int count = 0;
            XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
            XSSFSheet sheet = workbook.getSheet("考勤情况详情");
            int totalRows = sheet.getPhysicalNumberOfRows() - 2;
            XSSFRow row = sheet.getRow(2);
            String edu203_id = row.getCell(9).toString();
            String edu201_id = row.getCell(10).toString();

            //删除原有数据
            edu208Dao.deleteByEdu203Id(edu203_id);

            // 遍历集合数据，产生数据行
            for (int i = 0; i < totalRows; i++) {
                int rowIndex = i + 2;
                XSSFRow contentRow = sheet.getRow(rowIndex);
                XSSFCell dataCell = contentRow.getCell(8);
                String edu001_id = contentRow.getCell(11).toString();

                EDU208 edu208 = new EDU208();
                edu208.setEdu001_ID(Long.parseLong(edu001_id));
                edu208.setEdu201_ID(Long.parseLong(edu201_id));
                edu208.setEdu203_ID(Long.parseLong(edu203_id));
                if ( dataCell != null ) {
                    edu208.setOnCheckFlag(dataCell.toString());
                    if("01".equals(dataCell.toString())) {
                        count++;
                    }
                }
                edu208Dao.save(edu208);

            }

            double v = Double.parseDouble(String.valueOf(count)) / Double.parseDouble(String.valueOf(totalRows));
            NumberFormat nf = NumberFormat.getPercentInstance();
            nf.setMinimumFractionDigits(2);//设置保留小数位
            String usedPercent = nf.format(v);
            //更新出勤率
            edu203Dao.updateAttendance(edu203_id,usedPercent);
            CourseCheckOnPO data = courseCheckOnDao.findOne(edu203_id);
            BeanUtils.copyProperties(checkOnPO,data);
        } catch (IOException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("导入成功",checkOnPO);
        return resultVO;
    }


    //查询详情
    public ResultVO searchCourseCheckOnDetail(String courseId) {
        ResultVO resultVO;
        List<Object[]> dataList = edu208Dao.findAllByEdu203ID(courseId);
        if(dataList.size() == 0) {
            resultVO = ResultVO.setFailed("该课节未找到考勤记录");
            return resultVO;
        }
        CheckOnDetailPO checkOnDetailPO = new CheckOnDetailPO();
        List<CheckOnDetailPO> newCheckOnDetailPO = utils.castEntity(dataList, CheckOnDetailPO.class, checkOnDetailPO);

        resultVO = ResultVO.setSuccess("共找到"+newCheckOnDetailPO.size()+"个学生",newCheckOnDetailPO);
        return resultVO;
    }

    //记录操作日志
    public void addLog(String user_ID,String interface_name,String param_value){
        Edu999 edu999 = new Edu999();
        edu999.setInterface_name(interface_name);
        edu999.setParam_value(param_value);
        edu999.setUser_ID(user_ID);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        edu999.setTime(df.format(new Date()));
        edu999DAO.save(edu999);
    }


    //确认成绩并生成补考标识
    public ResultVO confirmGrade(Edu005 edu005, String userKey) {
        ResultVO resultVO;


        if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
            Edu400 edu400 = edu400Dao.getTermInfoById(edu005.getXnid());
            if(edu400 != null){
                String lrsj = edu400.getLrsj();
                if(lrsj != null && !"".equals(lrsj)){
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");//注意月份是MM
                    try {
                        Date lrsjDate = simpleDateFormat.parse(lrsj);
                        Date now = new Date();
                        int compareTo = lrsjDate.compareTo(now);
                        if(compareTo != 1){
                            Edu115 edu115 = edu115Dao.queryBySearch(edu005.getClassName(),edu005.getCourseName(),edu005.getXnid());
                            if(edu115 == null){
                                resultVO =  ResultVO.setDateFailed("录入时间超过截至日期");
                                return resultVO;
                            }else if("nopass".equals(edu115.getBusinessState())){
                                resultVO =  ResultVO.setFailed("已提交延迟确认成绩申请，请等待上级审批！");
                                return resultVO;
                            }

                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
        }


        //根据条件筛选成绩表
        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                predicates.add(cb.isNull(root.<String>get("isConfirm")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };


        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到可确认的课程或该课程已经进行过确认操作");
            return resultVO;
        }

        Long edu201_id = edu005List.get(0).getEdu201_ID();
        Edu205 edu205 = edu205Dao.findExist(userKey,edu201_id);

        if (edu205 == null) {
            resultVO = ResultVO.setFailed("您不是该课程的老师无法确认成绩");
            return resultVO;
        }

        List<Long> confirmIdList = edu005List.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());

        List<Edu005> edu005ss = edu005Dao.findConfirmGrade(confirmIdList);
        if(edu005ss.size()>0){
            Edu005 e = edu005ss.get(0);
            resultVO = ResultVO.setFailed("【"+e.getCourseName()+"】课程，该学生【"+e.getStudentName()+"】成绩未录入！");
            return resultVO;
        }


        edu005Dao.updateConfirmGrade(confirmIdList);

        String param = "courseName:"+edu005.getCourseName()+",xnid:"+edu005.getXnid()+",className:"+edu005.getClassName();
        addLog(userKey,"confirmGrade",param);

        Specification<Edu005> newSpecification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                    predicates.add(cb.isNotNull(root.<String>get("isPassed")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005s = edu005Dao.findAll(newSpecification);

        Map<String, List<Edu005>> passMap = edu005s.stream().collect(Collectors.groupingBy(Edu005::getIsPassed, Collectors.toList()));

        passMap.forEach((key,value) -> {
            if("F".equals(key)) {
                List<Long> noPassIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
                edu005Dao.updateResitFlag(noPassIdList,"T");
            } else if ("T".equals(key)) {
                List<Long> passIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
                edu005Dao.updateResitFlag(passIdList,"F");
            }
        });

        //根据条件筛选成绩表
        Specification<Edu005> specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> newEdu005List = edu005Dao.findAll(specification);

        for(int i = 0;i < newEdu005List.size();i++){
            Edu005 e005 = newEdu005List.get(i);
            if("T".equals(e005.getIsResit()) && "T".equals(e005.getIsConfirm()) && e005.getGrade()!=null){
                Edu0051 edu0051 = new Edu0051();
                edu0051.setEdu005_ID(e005.getEdu005_ID());
                edu0051.setEdu001_ID(e005.getEdu001_ID());
                edu0051.setEdu201_ID(e005.getEdu201_ID());
                edu0051.setEdu300_ID(e005.getEdu300_ID());
                edu0051.setEdu101_ID(e005.getEdu101_ID());
                edu0051.setCourseName(e005.getCourseName());
                edu0051.setClassName(e005.getClassName());
                edu0051.setStudentName(e005.getStudentName());
                edu0051.setStudentCode(e005.getStudentCode());
                edu0051.setGradeEnter(e005.getGradeEnter());
                edu0051.setEntryDate(e005.getEntryDate());
                edu0051.setGrade(e005.getGrade());
                edu0051.setXnid(edu005.getXnid());
                edu0051.setXn(edu005.getXn());
                edu0051.setExam_num(0);
                edu0051Dao.save(edu0051);
            }
        }

        resultVO = ResultVO.setSuccess("成绩确认成功",newEdu005List);

        return resultVO;
    }

    //确认成绩并生成补考标识(验证)
    public ResultVO confirmGradeCheck(Edu005 edu005, String userKey) {
        ResultVO resultVO;
        if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
            Edu400 edu400 = edu400Dao.getTermInfoById(edu005.getXnid());
            if(edu400 != null){
                String lrsj = edu400.getLrsj();
                if(lrsj != null && !"".equals(lrsj)){
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");//注意月份是MM
                    try {
                        Date lrsjDate = simpleDateFormat.parse(lrsj);
                        Date now = new Date();
                        int compareTo = lrsjDate.compareTo(now);
                        if(compareTo != 1){
                            Edu115 edu115 = edu115Dao.queryBySearch(edu005.getClassName(),edu005.getCourseName(),edu005.getXnid());
                            if(edu115 == null){
                                resultVO =  ResultVO.setDateFailed("录入时间超过截至日期");
                                return resultVO;
                            }else if("nopass".equals(edu115.getBusinessState())){
                                resultVO =  ResultVO.setFailed("已提交延迟确认成绩申请，请等待上级审批！");
                                return resultVO;
                            }

                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
        }


        //根据条件筛选成绩表
        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                predicates.add(cb.isNull(root.<String>get("isConfirm")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };


        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到可确认的课程或该课程已经进行过确认操作");
            return resultVO;
        }

        Long edu201_id = edu005List.get(0).getEdu201_ID();
        Edu205 edu205 = edu205Dao.findExist(userKey,edu201_id);

        if (edu205 == null) {
            resultVO = ResultVO.setFailed("您不是该课程的老师无法确认成绩");
            return resultVO;
        }

        List<Long> confirmIdList = edu005List.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());

        List<Edu005> edu005ss = edu005Dao.findConfirmGrade(confirmIdList);
        if(edu005ss.size()>0){
            Edu005 e = edu005ss.get(0);
            resultVO = ResultVO.setFailed("【"+e.getCourseName()+"】课程，【"+e.getClassName()+"】班级，该学生【"+e.getStudentName()+"】成绩未录入！");
            return resultVO;
        }


//        edu005Dao.updateConfirmGrade(confirmIdList);
//
//        String param = "courseName:"+edu005.getCourseName()+",xnid:"+edu005.getXnid()+",className:"+edu005.getClassName();
//        addLog(userKey,"confirmGrade",param);
//
//        Specification<Edu005> newSpecification = new Specification<Edu005>() {
//            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
//                List<Predicate> predicates = new ArrayList<Predicate>();
//                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
//                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
//                }
//                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
//                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
//                }
//                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
//                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
//                }
//                predicates.add(cb.isNotNull(root.<String>get("isPassed")));
//                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
//            }
//        };
//
//        List<Edu005> edu005s = edu005Dao.findAll(newSpecification);
//
//        Map<String, List<Edu005>> passMap = edu005s.stream().collect(Collectors.groupingBy(Edu005::getIsPassed, Collectors.toList()));
//
//        passMap.forEach((key,value) -> {
//            if("F".equals(key)) {
//                List<Long> noPassIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
//                edu005Dao.updateResitFlag(noPassIdList,"T");
//            } else if ("T".equals(key)) {
//                List<Long> passIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
//                edu005Dao.updateResitFlag(passIdList,"F");
//            }
//        });
//
//        //根据条件筛选成绩表
//        Specification<Edu005> specification = new Specification<Edu005>() {
//            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
//                List<Predicate> predicates = new ArrayList<Predicate>();
//                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
//                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
//                }
//                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
//                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
//                }
//                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
//                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
//                }
//                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
//            }
//        };
//
//        List<Edu005> newEdu005List = edu005Dao.findAll(specification);
//
//        for(int i = 0;i < newEdu005List.size();i++){
//            Edu005 e005 = newEdu005List.get(i);
//            if("T".equals(e005.getIsResit()) && "T".equals(e005.getIsConfirm()) && e005.getGrade()!=null){
//                Edu0051 edu0051 = new Edu0051();
//                edu0051.setEdu005_ID(e005.getEdu005_ID());
//                edu0051.setEdu001_ID(e005.getEdu001_ID());
//                edu0051.setEdu201_ID(e005.getEdu201_ID());
//                edu0051.setEdu300_ID(e005.getEdu300_ID());
//                edu0051.setEdu101_ID(e005.getEdu101_ID());
//                edu0051.setCourseName(e005.getCourseName());
//                edu0051.setClassName(e005.getClassName());
//                edu0051.setStudentName(e005.getStudentName());
//                edu0051.setStudentCode(e005.getStudentCode());
//                edu0051.setGradeEnter(e005.getGradeEnter());
//                edu0051.setEntryDate(e005.getEntryDate());
//                edu0051.setGrade(e005.getGrade());
//                edu0051.setXnid(edu005.getXnid());
//                edu0051.setXn(edu005.getXn());
//                edu0051.setExam_num(0);
//                edu0051Dao.save(edu0051);
//            }
//        }

        resultVO = ResultVO.setSuccess("验证成功");

        return resultVO;
    }

    //验证无误后,确认成绩
    public void confirmGradeAll(Edu005 edu005, String userKey) {

        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                predicates.add(cb.isNull(root.<String>get("isConfirm")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);
        List<Long> confirmIdList = edu005List.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());

        edu005Dao.updateConfirmGrade(confirmIdList);

        String param = "courseName:"+edu005.getCourseName()+",xnid:"+edu005.getXnid()+",className:"+edu005.getClassName();
        addLog(userKey,"confirmGrade",param);

        Specification<Edu005> newSpecification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                predicates.add(cb.isNotNull(root.<String>get("isPassed")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005s = edu005Dao.findAll(newSpecification);

        Map<String, List<Edu005>> passMap = edu005s.stream().collect(Collectors.groupingBy(Edu005::getIsPassed, Collectors.toList()));

        passMap.forEach((key,value) -> {
            if("F".equals(key)) {
                List<Long> noPassIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
                edu005Dao.updateResitFlag(noPassIdList,"T");
            } else if ("T".equals(key)) {
                List<Long> passIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
                edu005Dao.updateResitFlag(passIdList,"F");
            }
        });

        //根据条件筛选成绩表
        Specification<Edu005> specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> newEdu005List = edu005Dao.findAll(specification);

        for(int i = 0;i < newEdu005List.size();i++){
            Edu005 e005 = newEdu005List.get(i);
            if("T".equals(e005.getIsResit()) && "T".equals(e005.getIsConfirm()) && e005.getGrade()!=null){
                Edu0051 edu0051 = new Edu0051();
                edu0051.setEdu005_ID(e005.getEdu005_ID());
                edu0051.setEdu001_ID(e005.getEdu001_ID());
                edu0051.setEdu201_ID(e005.getEdu201_ID());
                edu0051.setEdu300_ID(e005.getEdu300_ID());
                edu0051.setEdu101_ID(e005.getEdu101_ID());
                edu0051.setCourseName(e005.getCourseName());
                edu0051.setClassName(e005.getClassName());
                edu0051.setStudentName(e005.getStudentName());
                edu0051.setStudentCode(e005.getStudentCode());
                edu0051.setGradeEnter(e005.getGradeEnter());
                edu0051.setEntryDate(e005.getEntryDate());
                edu0051.setGrade(e005.getGrade());
                edu0051.setXnid(edu005.getXnid());
                edu0051.setXn(edu005.getXn());
                edu0051.setExam_num(0);
                edu0051Dao.save(edu0051);
            }
        }
    }


    //成绩取消确认
    public ResultVO cancelGrade(Edu005 edu005, Edu600 edu600) {
        ResultVO resultVO;

        Specification<Edu005> specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合条件的成绩，请确认后重新输入");
            return resultVO;
        }

        //根据任务书查询二级学院代码
        Long edu201_id = edu005List.get(0).getEdu201_ID();
        Edu201 edu201 = edu201Dao.findOne(edu201_id);
        Edu108 edu1081 = edu108Dao.findOne(edu201.getEdu108_ID());
        Edu107 edu1071 = edu107Dao.findOne(edu1081.getEdu107_ID());
        String departmentCode = edu1071.getEdu104();

        //添加取消确认成绩信息表
        Edu008 edu008 = new Edu008();
        edu008.setXnid(edu005.getXnid());
        edu008.setXn(edu005.getXn());
        edu008.setClassName(edu005.getClassName());
        edu008.setCourseName(edu005.getCourseName());
        edu008.setXnid(edu005.getXnid());
        edu008.setDepartmentCode(departmentCode);
        edu008.setStatus("passing");
        edu008Dao.save(edu008);

        //设置业务主键并发起审批
        edu600.setBusinessKey(edu008.getEdu008_ID());
        boolean isSuccess = approvalProcessService.initiationProcess(edu600);

        if (isSuccess) {
            resultVO = ResultVO.setSuccess("审批发起成功");
        } else {
            edu008Dao.delete(edu008.getEdu008_ID());
            resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
        }

        return resultVO;
    }


    //取消成绩确认标识和补考标识
    public void cancelGradeInfo(String edu008Id) {
        Edu008 edu008 = edu008Dao.findOne(Long.parseLong(edu008Id));
        edu008.setStatus("passed");
        edu008Dao.save(edu008);
        List<String> Edu005Ids = edu005Dao.cancelGradeInfoQuery(edu008.getXnid(),edu008.getCourseName(),edu008.getClassName());
        //删除补考成绩表
        edu0051Dao.deleteEdu0051sByEdu005Id(Edu005Ids);
        //修改正考数据 （已得学分（getCredit），是否补考，是否确认，补考次数（exam_num））
        edu005Dao.cancelGradeInfo(edu008.getXnid(),edu008.getCourseName(),edu008.getClassName());

    }

    //更新教师信息
    public ResultVO updateTeacher(Edu101 edu101) {
        ResultVO resultVO;
        Edu101 e = edu101Dao.findOne(edu101.getEdu101_ID());
        String s = e.getJzgh();
        if(s.equals(edu101.getJzgh())){
            edu101Dao.save(edu101);
            resultVO = ResultVO.setSuccess("修改成功");
            return resultVO;
        }
        String num = edu101Dao.queryJzghSFCZ(edu101.getJzgh());
        if (!"0".equals(num)){
            resultVO = ResultVO.setFailed("教职工号重复，请重新修改！");
            return resultVO;
        }
        Edu990 e990 = edu990Dao.checkIsHaveUser(edu101.getJzgh());
        if(e990 != null){
            resultVO = ResultVO.setFailed("教职工号与其他用户账号重复，请重新修改！");
            return resultVO;
        }

        Edu990 e9901 = edu990Dao.getUserInfo(s);
        e9901.setYhm(edu101.getJzgh());
        edu990Dao.save(e9901);
        edu101Dao.save(edu101);
        resultVO = ResultVO.setSuccess("修改成功");
        return resultVO;
    }

    public Edu005 getEdu005ByTGCId(String id){
        Edu005 edu005 = new Edu005();
        TeacherGradeClassPO teacherGradeClassPO = teacherGradeClassViewDao.findbyid(id);
        edu005.setClassName(teacherGradeClassPO.getClassName());//班级名称
        edu005.setCourseName(teacherGradeClassPO.getCourseName());//课程名称
        edu005.setXn(teacherGradeClassPO.getXn());
        edu005.setXnid(teacherGradeClassPO.getXnid());//学年
        return edu005;
    }
}

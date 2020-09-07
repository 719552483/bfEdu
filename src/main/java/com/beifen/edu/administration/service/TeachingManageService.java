package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.ClassPeriodConstant;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.constant.SecondaryCodeConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

//教务管理业务层
@Service
public class TeachingManageService {

    @Autowired
    Edu001Dao edu001Dao;
    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    Edu112Dao edu112Dao;
    @Autowired
    Edu113Dao edu113Dao;
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu302Dao edu302Dao;
    @Autowired
    Edu108Dao edu108Dao;
    @Autowired
    Edu200Dao edu200Dao;
    @Autowired
    RedisUtils redisUtils;
    @Autowired
    Edu201Dao edu201Dao;
    @Autowired
    Edu114Dao edu114Dao;
    @Autowired
    ApprovalProcessService approvalProcessService;
    @Autowired
    TeachingScheduleViewDao teachingScheduleViewDao;
    @Autowired
    StudentScheduleViewDao studentScheduleViewDao;
    @Autowired
    ClassStudentViewDao classStudentViewDao;

    ReflectUtils utils = new ReflectUtils();

    /**
     * 搜索在职教师
     * @param edu101
     * @return
     */
    public ResultVO searchTeachersInService(Edu101 edu101) {
        ResultVO resultVO;
        Specification<Edu101> specification = new Specification<Edu101>() {
            public Predicate toPredicate(Root<Edu101> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu101.getSzxb() != null && !"".equals(edu101.getSzxb())) {
                    predicates.add(cb.equal(root.<String> get("szxb"),edu101.getSzxb()));
                }
                if (edu101.getZy() != null && !"".equals(edu101.getZy())) {
                    predicates.add(cb.equal(root.<String> get("zy"),edu101.getZy()));
                }
                if (edu101.getXm() != null && !"".equals(edu101.getXm())) {
                    predicates.add(cb.like(root.<String> get("xm"), '%' + edu101.getXm() + '%'));
                }
                if (edu101.getJzgh() != null && !"".equals(edu101.getJzgh())) {
                    predicates.add(cb.like(root.<String> get("jzgh"), '%' + edu101.getJzgh() + '%'));
                }
                if (edu101.getSzxbmc() != null && !"".equals(edu101.getSzxbmc())) {
                    predicates.add(cb.like(root.<String> get("szxbmc"), '%' + edu101.getSzxbmc() + '%'));
                }
                if (edu101.getZc() != null && !"".equals(edu101.getZc())) {
                    predicates.add(cb.equal(root.<String> get("zc"),edu101.getZc()));
                }
                Predicate predicate1 = cb.notEqual(root.<String>get("wpjzgspzt"), "passing");
                Predicate predicate2 = cb.isNull(root.<String>get("wpjzgspzt"));
                predicates.add(cb.or(predicate1, predicate2));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu101> teacherList = edu101Dao.findAll(specification);

        if(teacherList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的教师");
        } else {
            resultVO = ResultVO.setSuccess("共搜索到"+teacherList.size()+"个教师",teacherList);
        }

        return resultVO;
    }

    /**
     * 教师出差申请
     * @param edu112
     * @param edu600
     * @return
     */
    public ResultVO addTeacherBusiness(Edu112 edu112, Edu600 edu600) {
        ResultVO resultVO;

        //找到发起人姓名，若不是在校人员，使用用户姓名
        String userName = edu992Dao.getTeacherNameByEdu990Id(edu112.getEdu990_ID().toString());
        if("".equals(userName) || userName == null) {
            userName = edu990Dao.queryUserById(edu112.getEdu990_ID().toString()).getYhm();
        }
        edu112.setUserName(userName);
        edu112.setBusinessState("nopass");
        edu112Dao.save(edu112);
        if(edu112.getEdu112_ID() == null) {
            resultVO = ResultVO.setFailed("出差申请失败，请检查申请信息");
            return resultVO;
        }

        String[] teacherIds = edu112.getTeacherId().split(",");
        String[] teacherNames = edu112.getTeacherName().split(",");

        //删除关联信息
        edu113Dao.delteByEdu112Id(edu112.getEdu112_ID().toString());

        for (int i = 0; i <teacherIds.length; i++) {
            Edu113 save = new Edu113();
            save.setEdu112_ID(edu112.getEdu112_ID());
            save.setEud101_ID(Long.parseLong(teacherIds[i]));
            save.setTeacherName(teacherNames[i]);
            edu113Dao.save(save);
        }

        edu600.setBusinessKey(edu112.getEdu112_ID());
        boolean isSuccess = approvalProcessService.initiationProcess(edu600);
        if (!isSuccess) {
            resultVO = ResultVO.setApprovalFailed("审批流程发起失败，请联系管理员");
            edu113Dao.delteByEdu112Id(edu112.getEdu112_ID().toString());
        } else {
            resultVO = ResultVO.setSuccess("出差申请成功");
        }
        return resultVO;
    }

    /**
     * 出差申请查询
     * @param edu112
     * @return
     */
    public ResultVO searchTeacherBusiness(Edu112 edu112) {
        ResultVO resultVO;
        Specification<Edu112> specification = new Specification<Edu112>() {
            public Predicate toPredicate(Root<Edu112> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu112.getBusinessState() != null && !"".equals(edu112.getBusinessState())) {
                    predicates.add(cb.equal(root.<String> get("businessState"),edu112.getBusinessState()));
                }
                if (edu112.getUserName() != null && !"".equals(edu112.getUserName())) {
                    predicates.add(cb.like(root.<String> get("userName"), '%' + edu112.getUserName() + '%'));
                }
                if (edu112.getTeacherName() != null && !"".equals(edu112.getTeacherName())) {
                    predicates.add(cb.like(root.<String> get("teacherName"), '%' + edu112.getTeacherName() + '%'));
                }
                if (edu112.getDestination() != null && !"".equals(edu112.getDestination())) {
                    predicates.add(cb.like(root.<String> get("destination"), '%' + edu112.getDestination() + '%'));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu112> resultList = edu112Dao.findAll(specification);

        if (resultList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合条件的出差申请");
            return resultVO;
        } else {
            resultVO = ResultVO.setSuccess("共找到"+resultList.size()+"条出差申请",resultList);
        }

        return resultVO;
    }

    /**
     * 删除出差申请
     * @param removeKeyList
     * @return
     */
    public ResultVO removeTeacherBusiness(List<String> removeKeyList) {
        ResultVO resultVO;
        Integer count = 0;

        for (String s : removeKeyList) {
            //删除出差申请关联表
            edu113Dao.delteByEdu112Id(s);
            //删除出差申请主表
            edu112Dao.delete(Long.parseLong(s));
            count++;
        }

        if (count == 0) {
            resultVO = ResultVO.setFailed("并未找到任何记录");
        } else {
            resultVO  = ResultVO.setSuccess("成功删除了"+count+"条出差记录");
        }

        return resultVO;
    }

    /**
     * 教师课程表查询
     * @param timeTable
     * @return
     */
    public ResultVO getScheduleInfo(TimeTablePO timeTable) {
        ResultVO resultVO;
        Edu101 edu101 = edu101Dao.getTeacherInfoByEdu990Id(timeTable.getCurrentUserId());

        if(edu101 == null) {
            resultVO = ResultVO.setFailed("您不是本校教师，无法查看您的课程");
            return resultVO;
        }
        //根据信息查询所有课表信息
        List<SchoolTimetablePO> schoolTimetableList = teachingScheduleViewDao.findAllByEdu101Id(edu101.getEdu101_ID().toString(),
                timeTable.getWeekTime(), timeTable.getSemester());
        if(schoolTimetableList.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到您的课程");
        } else {
            timeTable.setNewInfo(timeTablePackage(schoolTimetableList));
            resultVO = ResultVO.setSuccess("当前周共找到"+schoolTimetableList.size()+"个课程",timeTable);
        }
        return resultVO;
    }

    /**
     * 查询学生课表
     * @param timeTable
     * @return
     */
    public ResultVO getStudentScheduleInfo(TimeTablePO timeTable) {
        ResultVO resultVO;
        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
        Edu001 edu001 = edu001Dao.getStudentInfoByEdu990Id(timeTable.getCurrentUserId());
        if(edu001 == null) {
            resultVO = ResultVO.setFailed("您不是本校学生，无法查看您的课程");
            return resultVO;
        }

        //根据信息查询所有课表信息
        List<StudentSchoolTimetablePO> studentSchoolTimetableList = studentScheduleViewDao.findAllByEdu301Ids(edu001.getEdu300_ID().toString(),
                timeTable.getWeekTime(), timeTable.getSemester());
        if(studentSchoolTimetableList.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到您的课程");
        } else {
            for (StudentSchoolTimetablePO o : studentSchoolTimetableList) {
                SchoolTimetablePO s = new SchoolTimetablePO();
                try {
                    utils.copyParm(o,s);
                    schoolTimetableList.add(s);
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                }
            }
            timeTable.setNewInfo(timeTablePackage(schoolTimetableList));
            resultVO = ResultVO.setSuccess("当前周共找到"+schoolTimetableList.size()+"个课程",timeTable);
        }
        return resultVO;
    }

    /**
     * 组装课程信息
     * @param schoolTimetableList
     * @return
     */
    private List<Map> timeTablePackage(List<SchoolTimetablePO> schoolTimetableList) {
        List<Map> newInfo = new ArrayList<>();

        Map map1 = new HashMap();
        map1.put("id","id1");
        map1.put("classPeriod",ClassPeriodConstant.SECTION_ONE);
        Map map2 = new HashMap();
        map2.put("id","id2");
        map2.put("classPeriod",ClassPeriodConstant.SECTION_TWO);
        Map map3 = new HashMap();
        map3.put("id","id3");
        map3.put("classPeriod",ClassPeriodConstant.SECTION_THREE);
        Map map4 = new HashMap();
        map4.put("id","id4");
        map4.put("classPeriod",ClassPeriodConstant.SECTION_FOUR);
        Map map5 = new HashMap();
        map5.put("id","id5");
        map5.put("classPeriod",ClassPeriodConstant.SECTION_FIVE);
        Map map6 = new HashMap();
        map6.put("id","id6");
        map6.put("classPeriod",ClassPeriodConstant.SECTION_SIX);
        Map map7 = new HashMap();
        map7.put("id","id7");
        map7.put("classPeriod",ClassPeriodConstant.SECTION_SEVEN);
        Map map8 = new HashMap();
        map8.put("id","id8");
        map8.put("classPeriod",ClassPeriodConstant.SECTION_EIGHT);
        Map map9 = new HashMap();
        map9.put("id","id9");
        map9.put("classPeriod",ClassPeriodConstant.SECTION_NINE);
        Map map10 = new HashMap();
        map10.put("id","id10");
        map10.put("classPeriod",ClassPeriodConstant.SECTION_TEN);
        Map map11 = new HashMap();
        map11.put("id","id11");
        map11.put("classPeriod",ClassPeriodConstant.SECTION_ELEVEN);
        Map map12 = new HashMap();
        map12.put("id","id12");
        map12.put("classPeriod",ClassPeriodConstant.SECTION_TWELVE);

        for (SchoolTimetablePO s : schoolTimetableList) {
            if(ClassPeriodConstant.SECTION_ONE.equals(s.getKjmc())) {
                map1 = classPackage(map1,s);
            }
            if(ClassPeriodConstant.SECTION_TWO.equals(s.getKjmc())) {
                map2 = classPackage(map2,s);
            }
            if(ClassPeriodConstant.SECTION_THREE.equals(s.getKjmc())) {
                map3 = classPackage(map3,s);
            }
            if(ClassPeriodConstant.SECTION_FOUR.equals(s.getKjmc())) {
                map4 = classPackage(map4,s);
            }
            if(ClassPeriodConstant.SECTION_FIVE.equals(s.getKjmc())) {
                map5 = classPackage(map5,s);
            }
            if(ClassPeriodConstant.SECTION_SIX.equals(s.getKjmc())) {
                map6 = classPackage(map6,s);
            }
            if(ClassPeriodConstant.SECTION_SEVEN.equals(s.getKjmc())) {
                map7 = classPackage(map7,s);
            }
            if(ClassPeriodConstant.SECTION_EIGHT.equals(s.getKjmc())) {
                map8 = classPackage(map8,s);
            }
            if(ClassPeriodConstant.SECTION_NINE.equals(s.getKjmc())) {
                map9 = classPackage(map9,s);
            }
            if(ClassPeriodConstant.SECTION_TEN.equals(s.getKjmc())) {
                map10 = classPackage(map10,s);
            }
            if(ClassPeriodConstant.SECTION_ELEVEN.equals(s.getKjmc())) {
                map11 = classPackage(map11,s);
            }
            if(ClassPeriodConstant.SECTION_TWELVE.equals(s.getKjmc())) {
                map12 = classPackage(map12,s);
            }
        }

        newInfo.add(map1);
        newInfo.add(map2);
        newInfo.add(map3);
        newInfo.add(map4);
        newInfo.add(map5);
        newInfo.add(map6);
        newInfo.add(map7);
        newInfo.add(map8);
        newInfo.add(map9);
        newInfo.add(map10);
        newInfo.add(map11);
        newInfo.add(map12);

        return newInfo;
    }


    //按星期组装课程
    private Map classPackage(Map map,SchoolTimetablePO s) {
        List<SchoolTimetablePO> newList = new ArrayList<>();

        String xq = s.getXqid();

        switch (xq) {
            case "01":
                if(map.get("monday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("monday")).add(s);
                } else {
                    newList.add(s);
                    map.put("monday",newList);
                }
                break;
            case "02":
                if(map.get("tuesday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("tuesday")).add(s);
                } else {
                    newList.add(s);
                    map.put("tuesday",newList);
                }
                break;
            case "03":
                if(map.get("wednesday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("wednesday")).add(s);
                } else {
                    newList.add(s);
                    map.put("wednesday",newList);
                }
                break;
            case "04":
                if(map.get("thursday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("thursday")).add(s);
                } else {
                    newList.add(s);
                    map.put("thursday",newList);
                }
                break;
            case "05":
                if(map.get("friday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("friday")).add(s);
                } else {
                    newList.add(s);
                    map.put("friday",newList);
                }
                break;
            case "06":
                if(map.get("saturday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("saturday")).add(s);
                } else {
                    newList.add(s);
                    map.put("saturday",newList);
                }
                break;
            case "07":
                if(map.get("sunday") !=  null ){
                    ((List<SchoolTimetablePO>)map.get("sunday")).add(s);
                } else {
                    newList.add(s);
                    map.put("sunday",newList);
                }
                break;
        }

        return map;
    }


    /**
     * 课表详情查询
     * @param classId
     * @param courseType
     * @param edu_180Id
     * @return
     */
    public ResultVO getScheduleInfoDetail(String classId,String courseType ,String edu_180Id) {
        ResultVO resultVO;
        Map<String, Object> returnMap = new HashMap();

        List<String> edu300IdList = new ArrayList<>();

        if (SecondaryCodeConstant.ADMINISTRATIVE_CLASS_TYPE.equals(courseType)) {
            edu300IdList.add(classId);
        } else {
            edu300IdList= edu302Dao.findEdu300IdsByEdu301Id(classId);
        }


        if (edu300IdList.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合要求的行政班");
            return resultVO;
        }

        List<Edu001> studentList = edu001Dao.getStudentInEdu300(edu300IdList);
        if (studentList.size() == 0) {
            resultVO = ResultVO.setFailed("教学班内暂无学生");
            return resultVO;
        }

        Edu108 edu108 = edu108Dao.queryPlanByEdu108ID(edu_180Id);

        returnMap.put("studentList", studentList);
        returnMap.put("planInfo", edu108);

        resultVO = ResultVO.setSuccess("查询成功", returnMap);

        return resultVO;
    }

    /**
     * 查询授课学生名单
     * @param classStudent
     * @return
     */
    public ResultVO findStudentInTeaching(ClassStudentViewPO classStudent) {
        ResultVO resultVO;

        if("".equals(classStudent.getUserKey()) || classStudent.getUserKey() == null){
            resultVO = ResultVO.setFailed("您不是本校老师，暂时无法查询");
            return resultVO;
        }

        Specification<ClassStudentViewPO> specification = new Specification<ClassStudentViewPO>() {
            public Predicate toPredicate(Root<ClassStudentViewPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (classStudent.getGradation() != null && !"".equals(classStudent.getGradation())) {
                    predicates.add(cb.equal(root.<String> get("gradation"),classStudent.getGradation()));
                }
                if (classStudent.getDepartment() != null && !"".equals(classStudent.getDepartment())) {
                    predicates.add(cb.equal(root.<String> get("department"),classStudent.getDepartment()));
                }
                if (classStudent.getGrade() != null && !"".equals(classStudent.getGrade())) {
                    predicates.add(cb.equal(root.<String> get("grade"),classStudent.getGrade()));
                }
                if (classStudent.getMajor() != null && !"".equals(classStudent.getMajor())) {
                    predicates.add(cb.equal(root.<String> get("major"),classStudent.getMajor()));
                }
                if (classStudent.getSex() != null && !"".equals(classStudent.getSex())) {
                    predicates.add(cb.equal(root.<String> get("sex"),classStudent.getSex()));
                }
                if (classStudent.getUserKey() != null && !"".equals(classStudent.getUserKey())) {
                    predicates.add(cb.equal(root.<String> get("userKey"),classStudent.getUserKey()));
                }
                if (classStudent.getName() != null && !"".equals(classStudent.getName())) {
                    predicates.add(cb.like(root.<String> get("name"), '%' + classStudent.getName() + '%'));
                }
                if (classStudent.getClassName() != null && !"".equals(classStudent.getClassName())) {
                    predicates.add(cb.like(root.<String> get("className"), '%' + classStudent.getClassName() + '%'));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<ClassStudentViewPO> allInfo = classStudentViewDao.findAll(specification);
        List<Edu001> edu001List;
        if(allInfo.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的学生名单");
        } else {
            List<String> studentIds = new ArrayList<>();
            for (ClassStudentViewPO e : allInfo) {
                studentIds.add(e.getEdu001_id().toString());
            }
            edu001List = edu001Dao.findStudentsByIds(studentIds);
            resultVO = ResultVO.setSuccess("共找到"+edu001List.size()+"个学生",edu001List);
        }

        return resultVO;
    }


    public ResultVO searchTaskCanTest(String userId, TestTaskSearchPO testTaskSearchPO) {
        ResultVO resultVO;

        //从redis中查询二级学院管理权限
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        //根据权限查询课程
        Specification<Edu200> edu200specification = new Specification<Edu200>() {
            public Predicate toPredicate(Root<Edu200> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (testTaskSearchPO.getCourseCode() != null && !"".equals(testTaskSearchPO.getCourseCode())) {
                    predicates.add(cb.like(root.<String>get("kcdm"), "%"+testTaskSearchPO.getCourseCode()+"%"));
                }
                if (testTaskSearchPO.getCourseName() != null && !"".equals(testTaskSearchPO.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("kcmc"), "%"+testTaskSearchPO.getCourseName()+"%"));
                }
                if (testTaskSearchPO.getCoursesNature() != null && !"".equals(testTaskSearchPO.getCoursesNature())) {
                    predicates.add(cb.equal(root.<String>get("kcxzCode"), testTaskSearchPO.getCoursesNature()));
                }
                Path<Object> path = root.get("departmentCode");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <departments.size() ; i++) {
                    in.value(departments.get(i));//存入值
                }
                predicates.add(cb.and(in));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu200> edu200List = edu200Dao.findAll(edu200specification);

        if(edu200List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以审请考试的课程");
            return resultVO;
        }

        List<Long> edu200IdList = edu200List.stream().map(e -> e.getBF200_ID()).collect(Collectors.toList());

        List<Long> edu108IdList = edu108Dao.findPlanByEdu200Ids(edu200IdList);

        if(edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以审请考试的课程");
            return resultVO;
        }

        //查询任务书
        Specification<Edu201> edu201specification = new Specification<Edu201>() {
            public Predicate toPredicate(Root<Edu201> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (testTaskSearchPO.getClassName() != null && !"".equals(testTaskSearchPO.getClassName())) {
                    predicates.add(cb.like(root.<String>get("className"), "%"+testTaskSearchPO.getClassName()+"%"));
                }
                predicates.add(cb.isNotNull(root.<String>get("sfypk")));
                predicates.add(cb.equal(root.<String>get("sfsqks"), "F"));

                Path<Object> path = root.get("edu108_ID");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <edu108IdList.size() ; i++) {
                    in.value(edu108IdList.get(i));//存入值
                }
                predicates.add(cb.and(in));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu201> edu201List = edu201Dao.findAll(edu201specification);

        if(edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以审请考试的课程");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu201List.size()+"门课程",edu201List);
        }

        return resultVO;
    }


    //申请考试
    public ResultVO askForExam(List<String> edu201IdList, Edu600 edu600) {
        ResultVO resultVO;

        for (String s : edu201IdList) {
            edu201Dao.changeTestStatus(s,"passing");

            edu600.setBusinessKey(Long.parseLong(s));
            boolean isSuccess = approvalProcessService.initiationProcess(edu600);

            if(!isSuccess) {
                edu201Dao.changeTestStatus(s,"F");
                resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
                return resultVO;
            }
        }

        resultVO = ResultVO.setSuccess("申请成功");
        return resultVO;
    }


    //班主任日志查询
    public ResultVO searchTeacherLog(TeacherLogSerachPO teacherLogSerach) {
        ResultVO resultVO;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Specification<Edu114> specification = new Specification<Edu114>() {
                public Predicate toPredicate(Root<Edu114> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                    try {
                        if (teacherLogSerach.getLogType() != null && !"".equals(teacherLogSerach.getLogType())) {
                            predicates.add(cb.equal(root.<String>get("logType"), teacherLogSerach.getLogType()));
                        }
                        if (teacherLogSerach.getEdu101_ID() != null && !"".equals(teacherLogSerach.getEdu101_ID())) {
                            predicates.add(cb.equal(root.<String>get("edu101_ID"), teacherLogSerach.getEdu101_ID()));
                        }
                        if (teacherLogSerach.getStartDate() != null && !"".equals(teacherLogSerach.getStartDate())) {
                            Date startDate = sdf.parse(teacherLogSerach.getStartDate());
                            predicates.add(cb.greaterThanOrEqualTo(root.get("creatDate"), startDate));
                        }
                        if (teacherLogSerach.getEndDate() != null && !"".equals(teacherLogSerach.getEndDate())) {
                            Date endDate = sdf.parse(teacherLogSerach.getEndDate());
                            predicates.add(cb.lessThanOrEqualTo(root.get("creatDate"), endDate));
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu114> edu114List = edu114Dao.findAll(specification);

        if(edu114List.size() == 0) {
            resultVO = ResultVO.setFailed("暂未找到日志");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu114List.size()+"条日志",edu114List);
        }

        return resultVO;
    }

    //保存修改教师日志
    public ResultVO teacherAddLog(Edu114 edu114) {
        ResultVO resultVO;
        edu114.setCreatDate(new Date());
        edu114Dao.save(edu114);
        resultVO = ResultVO.setSuccess("操作成功",edu114);
        return resultVO;
    }

    //班主任日志删除
    public ResultVO removeTeacherLog(List<String> deleteIdList) {
        ResultVO resultVO;
        edu114Dao.deleteByEdu114IdList(deleteIdList);
        resultVO = ResultVO.setSuccess("成功删除了"+deleteIdList.size()+"条日志");
        return resultVO;
    }
}


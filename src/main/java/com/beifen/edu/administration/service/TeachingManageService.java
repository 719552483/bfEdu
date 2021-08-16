package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.ClassPeriodConstant;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.constant.SecondaryCodeConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.DateUtils;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
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

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
import java.sql.Timestamp;
import java.text.NumberFormat;
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
    Edu000Dao edu000Dao;
    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu104Dao edu104Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    Edu112Dao edu112Dao;
    @Autowired
    Edu115Dao edu115Dao;
    @Autowired
    Edu116Dao edu116Dao;
    @Autowired
    Edu113Dao edu113Dao;
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu302Dao edu302Dao;
    @Autowired
    Edu300Dao edu300Dao;
    @Autowired
    Edu301Dao edu301Dao;
    @Autowired
    Edu108Dao edu108Dao;
    @Autowired
    Edu107Dao edu107Dao;
    @Autowired
    Edu200Dao edu200Dao;
    @Autowired
    Edu203Dao edu203Dao;
    @Autowired
    RedisUtils redisUtils;
    @Autowired
    Edu201Dao edu201Dao;
    @Autowired
    Edu114Dao edu114Dao;
    @Autowired
    Edu207Dao edu207Dao;
    @Autowired
    Edu999Dao edu999DAO;
    @Autowired
    Edu400Dao edu400Dao;
    @Autowired
    Edu402Dao edu402Dao;
    @Autowired
    Edu005Dao edu005Dao;
    @Autowired
    Edu0051Dao edu0051Dao;
    @Autowired
    Edu208Dao edu208Dao;
    @Autowired
    Edu600Dao edu600Dao;
    @Autowired
    ApprovalProcessService approvalProcessService;
    @Autowired
    TeachingScheduleViewDao teachingScheduleViewDao;
    @Autowired
    StudentScheduleViewDao studentScheduleViewDao;
    @Autowired
    ClassStudentViewDao classStudentViewDao;
    @Autowired
    ScheduleViewDao scheduleViewDao;
    @Autowired
    YearScheduleViewDao yearScheduleViewDao;
    @Autowired
    CourseCheckOnDao courseCheckOnDao;
    @Autowired
    CourseGradeViewDao courseGradeViewDao;
    @Autowired
    CourseMakeUpViewDao courseMakeUpViewDao;

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
     * 教师确认成绩申请
     * @param edu115
     * @param edu600
     * @return
     */
    public ResultVO addTeacherGetGrade(Edu115 edu115, Edu600 edu600) {
        ResultVO resultVO;

        //找到发起人姓名，若不是在校人员，使用用户姓名
        String userName = edu992Dao.getTeacherNameByEdu990Id(edu115.getEdu990_ID().toString());
        if("".equals(userName) || userName == null) {
            userName = edu990Dao.queryUserById(edu115.getEdu990_ID().toString()).getYhm();
        }
        edu115.setUserName(userName);
        edu115.setBusinessState("nopass");
        edu115Dao.save(edu115);
        if(edu115.getEdu115_ID() == null) {
            resultVO = ResultVO.setFailed("申请失败");
            return resultVO;
        }
        edu600.setBusinessKey(edu115.getEdu115_ID());
        boolean isSuccess = approvalProcessService.initiationProcess(edu600);
        if (!isSuccess) {
            resultVO = ResultVO.setApprovalFailed("审批流程发起失败，请联系管理员");
        } else {
            resultVO = ResultVO.setSuccess("申请成功");
        }
        return resultVO;
    }


    /**
     * 修改补考成绩申请
     * @return
     */
    public ResultVO updateMakeUpGrade(Edu0051 edu0051Old, Edu600 edu600) {
        ResultVO resultVO;
        Edu0051 edu0051 = edu0051Dao.findOne(edu0051Old.getEdu0051_ID());
        Edu990 edu990 = edu990Dao.findOne(edu600.getProposerKey());
            Edu116 edu116 = new Edu116();
            edu116.setEdu990_ID(edu990.getBF990_ID());
            edu116.setUserName(edu990.getPersonName());
            edu116.setBusinessState("passing");
            edu116.setXnid(edu0051.getXnid());
            edu116.setCourseName(edu0051.getCourseName());
            edu116.setClassName(edu0051.getClassName());
            edu116.setStudentName(edu0051.getStudentName());
            edu116.setEdu0051_ID(edu0051.getEdu0051_ID()+"");
            edu116.setGrade(edu0051Old.getGrade());
            edu116.setGradeOld(edu0051.getGrade());
            edu116.setExam_num(edu0051.getExam_num()+"");
            edu116Dao.save(edu116);
            edu600.setBusinessKey(edu116.getEdu116_ID());
            boolean isSuccess = approvalProcessService.initiationProcess(edu600);
            if (!isSuccess) {
                resultVO = ResultVO.setApprovalFailed("审批流程发起失败，请联系管理员");
            } else {
                resultVO = ResultVO.setSuccess("申请成功");
            }
        return resultVO;
    }

    /**
     * 修改补考成绩申请-验证
     * @return
     */
    public ResultVO updateMakeUpGradeCheck(Edu0051 edu0051) {
        ResultVO resultVO;

        List<Edu116> edu116s = edu116Dao.queryByEdu0051Id(edu0051.getEdu0051_ID()+"");

        if(edu116s.size()>0){
            resultVO = ResultVO.setFailed("该学生第"+edu116s.get(0).getExam_num()+"次补考成绩已修改，正在审批中...");
        }else{
            resultVO = ResultVO.setSuccess("可以申请");
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
            Edu600 e = edu600Dao.countoneByBUSINESSKEY(s);
            if(e != null){
                e.setIsDelete("T");
                edu600Dao.save(e);
            }
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
        //根据信息查询所有课表信息searchScatteredClassByTeacher
        List<SchoolTimetablePO> schoolTimetableList = teachingScheduleViewDao.findAllByEdu101Id(edu101.getEdu101_ID().toString(),
                timeTable.getWeekTime(), timeTable.getSemester());
        List<SchoolTimetablePO> schoolTimetableLists = replaceScheduleweek(schoolTimetableList);
        if(schoolTimetableLists.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到您的课程");
        } else {
            timeTable.setNewInfo(timeTablePackage(schoolTimetableLists));
            resultVO = ResultVO.setSuccess("当前周共找到"+schoolTimetableLists.size()+"个课程",timeTable);
        }
        return resultVO;
    }

    /**
     * 教师课程表查询
     * @param timeTable
     * @return
     */
    public ResultVO getScheduleInfoNew(TimeTablePO timeTable,String userId,String jsId) {
        ResultVO resultVO;
        String js = edu402Dao.findjsId();
        if(!js.equals(jsId)){
            resultVO = ResultVO.setFailed("您不是干事角色，无法修改课程");
            return resultVO;
        }
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
        Edu107 edu107 = new Edu107();
        Edu108 edu108 = new Edu108();
        Specification<Edu107> Edu107Specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                Path<Object> path = root.get("edu104");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <departments.size() ; i++) {
                    in.value(departments.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu107> relationEntities = edu107Dao.findAll(Edu107Specification);

        if (relationEntities.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课表");
            return resultVO;
        }
        List<Long> edu107Ids = relationEntities.stream().map(Edu107::getEdu107_ID).collect(Collectors.toList());

        Specification<Edu108> edu108specification = new Specification<Edu108>() {
            public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                Path<Object> path = root.get("edu107_ID");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <edu107Ids.size() ; i++) {
                    in.value(edu107Ids.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu108> edu108List = edu108Dao.findAll(edu108specification);

        if(edu108List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课表");
            return resultVO;
        }

        List<Long> edu108Ids = edu108List.stream().map(Edu108::getEdu108_ID).collect(Collectors.toList());
        List<String> edu201List = edu201Dao.queryCoursePlanIdsNew(edu108Ids,timeTable.getSemester());
//        List<String> list = new ArrayList<String>();
//        for(int i = 0;i <edu201List.size();i++){
//            String ss = edu201List.get(i);
//            list.addAll(Arrays.asList(ss.split(",")));
//        }
        if(edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无课表");
            return resultVO;
        }
        //根据信息查询所有课表信息searchScatteredClassByTeacher
        List<SchoolTimetablePO> schoolTimetableList = teachingScheduleViewDao.findAllByEdu101IdNew(edu201List,
                timeTable.getWeekTime(), timeTable.getSemester());
        List<SchoolTimetablePO> schoolTimetableLists = replaceScheduleweek(schoolTimetableList);
        if(schoolTimetableLists.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到课程");
        } else {
            timeTable.setNewInfo(timeTablePackage(schoolTimetableLists));
            resultVO = ResultVO.setSuccess("当前周共找到"+schoolTimetableLists.size()+"个课程",timeTable);
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

        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(edu001.getEdu300_ID());
        classIds.add(Long.parseLong(edu001.getEdu300_ID()));
        String[] classIdList = utils.listToString(classIds, ',').split(",");
        //根据信息查询所有课表信息
        List<StudentSchoolTimetablePO> studentSchoolTimetableList = studentScheduleViewDao.findAllByEdu301Ids(classIdList,
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
        }

        newInfo.add(map1);
        newInfo.add(map2);
        newInfo.add(map3);
        newInfo.add(map4);
        newInfo.add(map5);
        newInfo.add(map6);

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
                    predicates.add(cb.like(root.<String> get("xzbname"), '%' + classStudent.getClassName() + '%'));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<ClassStudentViewPO> allInfo = classStudentViewDao.findAll(specification);
        List<Edu001> edu001List;
        if(allInfo.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的学生名单");
        } else {
            //获取行政班集合
            List<String> edu300Ids = allInfo.stream().map(ClassStudentViewPO::getEdu300_id).distinct().collect(Collectors.toList());
            //查询行政班内的学生
            edu001List = edu001Dao.getStudentInEdu300(edu300Ids);
            resultVO = ResultVO.setSuccess("共找到"+edu001List.size()+"个学生",edu001List);
        }

        return resultVO;
    }


    public ResultVO searchTaskCanTest(String userId, TestTaskSearchPO testTaskSearchPO) {
        ResultVO resultVO;

        Edu990 edu990 = edu990Dao.queryUserById(userId);
        String userKey = edu990.getUserKey();
        //查询任务书
        Specification<Edu201> edu201specification = new Specification<Edu201>() {
            public Predicate toPredicate(Root<Edu201> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (testTaskSearchPO.getClassName() != null && !"".equals(testTaskSearchPO.getClassName())) {
                    predicates.add(cb.like(root.<String>get("className"), "%"+testTaskSearchPO.getClassName()+"%"));
                }
                if (testTaskSearchPO.getCourseName() != null && !"".equals(testTaskSearchPO.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("kcmc"), "%"+testTaskSearchPO.getCourseName()+"%"));
                }
                if (testTaskSearchPO.getSfsqks() != null && !"".equals(testTaskSearchPO.getSfsqks())) {
                    predicates.add(cb.equal(root.<String>get("sfsqks"), testTaskSearchPO.getSfsqks()));
                }else{
                    predicates.add(cb.equal(root.<String>get("sfsqks"), "F"));
                }
                predicates.add(cb.like(root.<String>get("ls"), "%"+userKey+"%"));
                predicates.add(cb.isNotNull(root.<String>get("sfypk")));
                query.orderBy(cb.desc(root.get("jksj")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu201> edu201List = edu201Dao.findAll(edu201specification);

        if(edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以结课的课程");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu201List.size()+"门课程",edu201List);
        }

        return resultVO;
    }


    public ResultVO searchMakeUpCount(String trem){
        ResultVO resultVO;
        Specification<MakeUpGradePO> specification = new Specification<MakeUpGradePO>() {
            public Predicate toPredicate(Root<MakeUpGradePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();

                predicates.add(cb.equal(root.<String>get("xnid"), trem));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<MakeUpGradePO> makeUpGradePOList = courseMakeUpViewDao.findAll(specification);


        if(makeUpGradePOList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无数据");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+makeUpGradePOList.size()+"条数据",makeUpGradePOList);
        }
        return resultVO;
    }

    public ResultVO searchCourseGetGrade(CourseGetGradePO courseGetGradePO) {
        ResultVO resultVO;

        Specification<CourseGradeViewPO> specification = new Specification<CourseGradeViewPO>() {
            public Predicate toPredicate(Root<CourseGradeViewPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (courseGetGradePO.getSfsqks() != null && !"".equals(courseGetGradePO.getSfsqks())) {
                    predicates.add(cb.equal(root.<String>get("sfsqks"), courseGetGradePO.getSfsqks()));
                }
                if (courseGetGradePO.getConfirm() != null && !"".equals(courseGetGradePO.getConfirm())) {
                    if ("T".equals(courseGetGradePO.getConfirm())){
                        predicates.add(cb.equal(root.<String>get("isConfirm"), courseGetGradePO.getConfirm()));
                    }else{
                        predicates.add(cb.isNull(root.<String>get("isConfirm")));
                    }
                }
                predicates.add(cb.equal(root.<String>get("xnid"), courseGetGradePO.getTrem()));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<CourseGradeViewPO> courseGradeViewPOList = courseGradeViewDao.findAll(specification);

        if(courseGradeViewPOList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无数据");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+courseGradeViewPOList.size()+"条数据",courseGradeViewPOList);
        }

        return resultVO;
    }

    //申请考试
    public ResultVO askForExam(List<String> edu201IdList, Edu600 edu600) {
        ResultVO resultVO;
        for (String businessKey : edu201IdList) {
            edu201Dao.changeTestStatus(businessKey,"T");
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
            String time = df.format(new Date());
            edu201Dao.changeTestStatusTime(businessKey,time);
        }
        resultVO = ResultVO.setSuccess("结课成功");
        return resultVO;
    }


    //班主任日志查询
    public ResultVO searchTeacherLog(TeacherLogSerachPO teacherLogSerach) {
        ResultVO resultVO;

        Specification<Edu114> specification = new Specification<Edu114>() {
                public Predicate toPredicate(Root<Edu114> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (teacherLogSerach.getLogType() != null && !"".equals(teacherLogSerach.getLogType())) {
                    predicates.add(cb.equal(root.<String>get("logType"), teacherLogSerach.getLogType()));
                }
                if (teacherLogSerach.getEdu101_ID() != null && !"".equals(teacherLogSerach.getEdu101_ID())) {
                    predicates.add(cb.equal(root.<String>get("edu101_ID"), teacherLogSerach.getEdu101_ID()));
                }
                if (teacherLogSerach.getStartDate() != null && !"".equals(teacherLogSerach.getStartDate())) {
                    Timestamp startTime = Timestamp.valueOf(teacherLogSerach.getStartDate()+" 00:00:00.000000");
                    predicates.add(cb.greaterThanOrEqualTo(root.get("creatDate"), startTime));
                }
                if (teacherLogSerach.getEndDate() != null && !"".equals(teacherLogSerach.getEndDate())) {
                    Timestamp endTime = Timestamp.valueOf(teacherLogSerach.getEndDate()+" 00:00:00.000000");
                    long et = endTime.getTime() + (long) 1000 * 3600 * 24 - 1;
                    endTime = new Timestamp(et);
                    predicates.add(cb.lessThan(root.get("creatDate"), endTime));
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

    //教师调课
    public ResultVO changeSchedule(Edu203 edu203,Edu203 edu203old,String type,String user_id) {
        ResultVO resultVO;
        String param = "type:"+type+",edu101_id:"+edu203old.getEdu101_id()+",newEdu101_id:"+edu203.getEdu101_id()+",edu202_ID:"+edu203old.getEdu202_ID()+",week:"
                +edu203old.getWeek()+",xqid:"+edu203old.getXqid()+",kjid:"+edu203old.getKjid()+",newWeek:"
                +edu203.getWeek()+",newXqid:"+edu203.getXqid()+",newKjid:"+edu203.getKjid();
        addLog(user_id,"changeScheduleNew",param);
        if("1".equals(type)){
            Specification<Edu203> specification = new Specification<Edu203>() {
                public Predicate toPredicate(Root<Edu203> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    predicates.add(cb.equal(root.<String>get("edu101_id"), edu203old.getEdu101_id()));
                    predicates.add(cb.equal(root.<String>get("edu202_ID"), edu203old.getEdu202_ID()));
                    predicates.add(cb.equal(root.<String>get("week"), edu203old.getWeek()));
                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Edu203> list = edu203Dao.findAll(specification);
            if(list.size() == 0){
                resultVO = ResultVO.setFailed("暂未找到预备调课目标");
                return resultVO;
            }else{
                for (int i = 0;i<list.size();i++){
                    Edu203 newEdu203 = new Edu203();
                    Edu203 oldedu203 = list.get(i);
                    newEdu203.setEdu203_ID(oldedu203.getEdu203_ID());
                    newEdu203.setEdu202_ID(oldedu203.getEdu202_ID());
                    newEdu203.setKjid(edu203.getKjid());
                    newEdu203.setKjmc(edu203.getKjmc());
                    newEdu203.setWeek(edu203.getWeek());
                    newEdu203.setXqid(edu203.getXqid());
                    newEdu203.setXqmc(edu203.getXqmc());
                    newEdu203.setKjid(oldedu203.getKjid());
                    newEdu203.setKjmc(oldedu203.getKjmc());
                    newEdu203.setXqid(oldedu203.getXqid());
                    newEdu203.setXqmc(oldedu203.getXqmc());
                    if(edu203.getEdu101_id() != null && !"".equals(edu203.getEdu101_id())){
                        newEdu203.setEdu101_id(edu203.getEdu101_id());
                        newEdu203.setTeacherName(edu203.getTeacherName());
//                        newEdu203.setTeacherType(edu203.getTeacherType());
                    }
                    changeScheduleOne(newEdu203);
                }
            }
        }else if("2".equals(type)){
            Specification<Edu203> specification = new Specification<Edu203>() {
                public Predicate toPredicate(Root<Edu203> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    predicates.add(cb.equal(root.<String>get("edu101_id"), edu203old.getEdu101_id()));
                    predicates.add(cb.equal(root.<String>get("edu202_ID"), edu203old.getEdu202_ID()));
                    predicates.add(cb.equal(root.<String>get("week"), edu203old.getWeek()));
                    predicates.add(cb.equal(root.<String>get("xqid"), edu203old.getXqid()));
                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Edu203> list = edu203Dao.findAll(specification);
            if(list.size() == 0){
                resultVO = ResultVO.setFailed("暂未找到预备调课目标");
                return resultVO;
            }else{
                for (int i = 0;i<list.size();i++){
                    Edu203 newEdu203 = new Edu203();
                    Edu203 oldedu203 = list.get(i);
                    newEdu203.setEdu203_ID(oldedu203.getEdu203_ID());
                    newEdu203.setEdu202_ID(oldedu203.getEdu202_ID());
                    newEdu203.setKjid(edu203.getKjid());
                    newEdu203.setKjmc(edu203.getKjmc());
                    newEdu203.setWeek(edu203.getWeek());
                    newEdu203.setXqid(edu203.getXqid());
                    newEdu203.setXqmc(edu203.getXqmc());
                    newEdu203.setKjid(oldedu203.getKjid());
                    newEdu203.setKjmc(oldedu203.getKjmc());
                    if(edu203.getEdu101_id() != null && !"".equals(edu203.getEdu101_id())){
                        newEdu203.setEdu101_id(edu203.getEdu101_id());
                        newEdu203.setTeacherName(edu203.getTeacherName());
//                        newEdu203.setTeacherType(edu203.getTeacherType());
                    }
                    changeScheduleOne(newEdu203);
                }
            }
        }else if("3".equals(type)){
            Specification<Edu203> specification = new Specification<Edu203>() {
                public Predicate toPredicate(Root<Edu203> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    predicates.add(cb.equal(root.<String>get("edu101_id"), edu203old.getEdu101_id()));
                    predicates.add(cb.equal(root.<String>get("edu202_ID"), edu203old.getEdu202_ID()));
                    predicates.add(cb.equal(root.<String>get("week"), edu203old.getWeek()));
                    predicates.add(cb.equal(root.<String>get("xqid"), edu203old.getXqid()));
                    predicates.add(cb.equal(root.<String>get("kjid"), edu203old.getKjid()));
                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };
            List<Edu203> list = edu203Dao.findAll(specification);
            if(list.size() == 0){
                resultVO = ResultVO.setFailed("暂未找到预备调课目标");
                return resultVO;
            }else{
                for (int i = 0;i<list.size();i++){
                    Edu203 newEdu203 = new Edu203();
                    Edu203 oldedu203 = list.get(i);
                    newEdu203.setEdu203_ID(oldedu203.getEdu203_ID());
                    newEdu203.setEdu202_ID(oldedu203.getEdu202_ID());
                    newEdu203.setKjid(edu203.getKjid());
                    newEdu203.setKjmc(edu203.getKjmc());
                    newEdu203.setWeek(edu203.getWeek());
                    newEdu203.setXqid(edu203.getXqid());
                    newEdu203.setXqmc(edu203.getXqmc());
                    if(edu203.getEdu101_id() != null && !"".equals(edu203.getEdu101_id())){
                        newEdu203.setEdu101_id(edu203.getEdu101_id());
                        newEdu203.setTeacherName(edu203.getTeacherName());
//                        newEdu203.setTeacherType(edu203.getTeacherType());
                    }
                    changeScheduleOne(newEdu203);
                }
            }
        }
        resultVO = ResultVO.setSuccess("调整成功");
        return resultVO;
    }

    //教师调课-单课节
    public ResultVO changeScheduleOne(Edu203 edu203) {
        ResultVO resultVO;
        Edu203 edu2031 = edu203Dao.findOne(edu203.getEdu203_ID());
        List<Edu203> thanList = edu203Dao.thanClasses(edu2031.getEdu202_ID(),edu2031.getWeek(),edu2031.getKjid(),edu2031.getXqid());
        List<Edu203> lessList = edu203Dao.lessClasses(edu2031.getEdu202_ID(),edu2031.getWeek(),edu2031.getKjid(),edu2031.getXqid());
        edu203.setKsz(edu203.getWeek());
        edu203.setJsz(edu203.getWeek());
        if(edu203.getEdu101_id() == null || "".equals(edu203.getEdu101_id())){
            edu203.setEdu101_id(edu2031.getEdu101_id());
            edu203.setTeacherName(edu2031.getTeacherName());
        }
        edu203.setTeacherType(edu2031.getTeacherType());
        edu203.setLocalId(edu2031.getLocalId());
        edu203.setLocalName(edu2031.getLocalName());
        edu203.setPointId(edu2031.getPointId());
        edu203.setPointName(edu2031.getPointName());
        for (int i = 0;i<thanList.size();i++){
            Edu203 than = thanList.get(i);
            than.setKsz((Integer.parseInt(edu2031.getWeek())+1)+"");
            edu203Dao.save(than);
        }
        for (int i = 0;i<lessList.size();i++){
            Edu203 less = lessList.get(i);
            less.setJsz((Integer.parseInt(edu2031.getWeek())-1)+"");
            edu203Dao.save(less);
        }
        edu203Dao.save(edu203);
        resultVO = ResultVO.setSuccess("调整成功");
        return resultVO;
    }

    //教师调课-分散学时（检验）
    public ResultVO changeScheduleScatteredCheck(String edu207Id,String week) {
        ResultVO resultVO;
        Edu207 edu207 = edu207Dao.findOne(Long.parseLong(edu207Id));
        List<Edu207> edu207List =  edu207Dao.findAllByEdu201IdAndWeek(edu207.getEdu201_ID(),week);
        if(edu207List.size() == 0){
            resultVO = ResultVO.setSuccess("可以调课");
        }else{
            resultVO = ResultVO.setFailed("目标周数已有分散学时安排");
        }
        return resultVO;
    }

    public void addLog(String user_ID,String interface_name,String param_value){
        Edu999 edu999 = new Edu999();
        edu999.setInterface_name(interface_name);
        edu999.setParam_value(param_value);
        edu999.setUser_ID(user_ID);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        edu999.setTime(df.format(new Date()));
        edu999DAO.save(edu999);
    }

    //教师调课-分散学时
    public ResultVO changeScheduleScattered(String edu207Id,String week,String count,String user_id) {
        ResultVO resultVO;
        Edu207 edu207 = edu207Dao.findOne(Long.parseLong(edu207Id));
        if(edu207 == null){
            resultVO = ResultVO.setFailed("选择分散课时暂无，请刷新后重试！");
            return resultVO;
        }
        //全部调整
        String param = "";
        if(edu207.getClassHours() == Integer.parseInt(count)){
            param = "edu207Id:"+edu207.getEdu207_ID()+",oldWeek:"+edu207.getWeek()+",newWeek:"+week+",ALL";
            edu207.setWeek(week);
            edu207Dao.save(edu207);
            resultVO = ResultVO.setSuccess("调课成功");
        }else{
            //原数据课时减少

            edu207.setClassHours(edu207.getClassHours()-Integer.parseInt(count));
            edu207Dao.save(edu207);
            //目标周新增数据
            Edu207 edu207new = new Edu207();
            edu207new.setClassHours(Integer.parseInt(count));
            edu207new.setCourseContent(edu207.getCourseContent());
            edu207new.setCourseName(edu207.getCourseName());
            edu207new.setEdu201_ID(edu207.getEdu201_ID());
            edu207new.setTeachingPlatform(edu207.getTeachingPlatform());
            edu207new.setWeek(week);
            edu207new.setClassId(edu207.getClassId());
            edu207new.setClassName(edu207.getClassName());
            edu207new.setCourseType(edu207.getCourseType());
            edu207new.setEdu108_ID(edu207.getEdu108_ID());
            edu207Dao.save(edu207new);
            param = "oldEdu207Id:"+edu207.getEdu207_ID()+",newEdu207Id:"+edu207new.getEdu207_ID();
            resultVO = ResultVO.setSuccess("调课成功");
        }
//        edu207.setWeek(week);
//        edu207Dao.save(edu207);

        addLog(user_id,"changeScheduleScattered",param);
        return resultVO;
    }

    //老师检索分散学时课表
    public ResultVO searchScatteredClassByTeacher(TimeTablePO timeTablePO) {
        ResultVO resultVO;
        Edu101 edu101 = edu101Dao.getTeacherInfoByEdu990Id(timeTablePO.getCurrentUserId());
        if(edu101 == null) {
            resultVO = ResultVO.setFailed("您不是本校教师，无法查看您的课程");
            return resultVO;
        }
        //根据信息查询所有课表信息
        List<String> edu201Ids = teachingScheduleViewDao.findEdu201IdsByEdu101Id(edu101.getEdu101_ID().toString(),timeTablePO.getSemester());
        if(edu201Ids.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到您的课程");
        } else {
            List<Edu207> edu207List = edu207Dao.findAllByEdu201Ids(edu201Ids, timeTablePO.getWeekTime());
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前周课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前周共找到"+edu207List.size()+"条分散学识安排",edu207List);
            }
        }
        return resultVO;
    }


    //学生检索分散学时课表
    public ResultVO searchScatteredClassByStudent(TimeTablePO timeTablePO) {
        ResultVO resultVO;
        Edu001 edu001 = edu001Dao.getStudentInfoByEdu990Id(timeTablePO.getCurrentUserId());
        if(edu001 == null) {
            resultVO = ResultVO.setFailed("您不是本校学生，无法查看您的课程");
            return resultVO;
        }

        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(edu001.getEdu300_ID());
        classIds.add(Long.parseLong(edu001.getEdu300_ID()));
        String[] classIdList = utils.listToString(classIds, ',').split(",");
        //根据信息查询所有课表信息
        List<String> edu201Ids = studentScheduleViewDao.findEdu201IdsByEdu301Ids(classIdList, timeTablePO.getSemester());
        if(edu201Ids.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到您的课程");
        } else {
            List<Edu207> edu207List = edu207Dao.findAllByEdu201Ids(edu201Ids, timeTablePO.getWeekTime());
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前周课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前周共找到"+edu207List.size()+"条分散学识安排",edu207List);
            }
        }
        return resultVO;
    }

    //保存分散学士属性
    public ResultVO saveScatteredClass(Edu207 edu207) {
        ResultVO resultVO;
        edu207Dao.save(edu207);
        resultVO = ResultVO.setSuccess("保存成功",edu207);
        return resultVO;
    }


    //教务查询课表
    public ResultVO getSchedule(SchedulePO schedulePO) {
        ResultVO resultVO;
        TimeTablePO timeTable = new TimeTablePO();
        //从redis中查询二级学院管理权限
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + schedulePO.getCurrentUserId());

        Specification<Edu107> Edu107Specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (schedulePO.getLevel() != null && !"".equals(schedulePO.getLevel())) {
                    predicates.add(cb.equal(root.<String>get("edu103"), schedulePO.getLevel()));
                }
                if (schedulePO.getDepartment() != null && !"".equals(schedulePO.getDepartment())) {
                    predicates.add(cb.equal(root.<String>get("edu104"), schedulePO.getDepartment()));
                }
                if (schedulePO.getGrade() != null && !"".equals(schedulePO.getGrade())) {
                    predicates.add(cb.equal(root.<String>get("edu105"), schedulePO.getGrade()));
                }
                if (schedulePO.getMajor() != null && !"".equals(schedulePO.getMajor())) {
                    predicates.add(cb.equal(root.<String>get("edu106"),  schedulePO.getMajor()));
                }
                Path<Object> path = root.get("edu104");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <departments.size() ; i++) {
                    in.value(departments.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu107> relationEntities = edu107Dao.findAll(Edu107Specification);

        if (relationEntities.size() == 0) {
            resultVO = ResultVO.setFailed("当前周暂无符合要求的课表");
            return resultVO;
        }
        List<Long> edu107Ids = relationEntities.stream().map(Edu107::getEdu107_ID).collect(Collectors.toList());

        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107Ids);
        if(edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("当前周暂无符合要求的课表");
            return resultVO;
        }

        List edu108Ids = utils.heavyListMethod(edu108IdList);

        Specification<ScheduleViewPO> scheduleViewPOSpecification = new Specification<ScheduleViewPO>() {
            public Predicate toPredicate(Root<ScheduleViewPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                predicates.add(cb.equal(root.<String>get("xnid"),  schedulePO.getSemester()));
                if (!"type2".equals(schedulePO.getCrouseType())) {
                    predicates.add(cb.equal(root.<String>get("week"),  schedulePO.getWeekTime()));
                }
                if (schedulePO.getLocal() != null && !"".equals(schedulePO.getLocal())) {
                    predicates.add(cb.equal(root.<String>get("classRoomId"),  schedulePO.getLocal()));
                }
                if (schedulePO.getLocation() != null && !"".equals(schedulePO.getLocation())) {
                    predicates.add(cb.equal(root.<String>get("pointId"),  schedulePO.getLocation()));
                }
                predicates.add(cb.equal(root.<String>get("teacherType"),"01"));
                if (schedulePO.getClassId() != null && !"".equals(schedulePO.getClassId())) {
                    List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(schedulePO.getClassId());
                    classIds.add(Long.parseLong(schedulePO.getClassId()));
                    Path<Object> classPath = root.get("classId");//定义查询的字段
                    CriteriaBuilder.In<Object> classIn = cb.in(classPath);
                    for (int i = 0; i <classIds.size() ; i++) {
                        classIn.value(classIds.get(i));//存入值
                    }
                    predicates.add(cb.and(classIn));
                }
                if (schedulePO.getTeacherId() != null && !"".equals(schedulePO.getTeacherId())) {
                    predicates.add(cb.or(cb.like(root.<String>get("teacherId"), "%"+schedulePO.getTeacherId()+"%"),cb.like(root.<String>get("baseTeacherId"), "%"+schedulePO.getTeacherId()+"%")));
                }
                Path<Object> path = root.get("courseId");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <edu108Ids.size() ; i++) {
                    in.value(edu108Ids.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<ScheduleViewPO> scheduleViewPOList = scheduleViewDao.findAll(scheduleViewPOSpecification);

        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
        if(scheduleViewPOList.size() == 0) {
            resultVO = ResultVO.setFailed("当前周未找到符合要求的课程");
            return resultVO;
        } else {
            for (ScheduleViewPO o : scheduleViewPOList) {
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
            timeTable.setCurrentUserId(schedulePO.getCurrentUserId());
            timeTable.setSemester(schedulePO.getSemester());
            timeTable.setWeekTime(schedulePO.getWeekTime());
            List<SchoolTimetablePO> schoolTimetableLists = replaceScheduleweek(schoolTimetableList);
            timeTable.setNewInfo(timeTablePackage(schoolTimetableLists));
            resultVO = ResultVO.setSuccess("当前周共找到"+schoolTimetableList.size()+"个课程",timeTable);
        }

        if("type2".equals(schedulePO.getCrouseType())) {
            List<String> edu201Ids = schoolTimetableList.stream().map(SchoolTimetablePO::getEdu201_id).distinct().collect(Collectors.toList());
            List<Edu207> edu207List = edu207Dao.findAllByEdu201Ids(edu201Ids, timeTable.getWeekTime());
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前周课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前周共找到"+edu207List.size()+"条分散学识安排",edu207List);
            }
        }

        return resultVO;
    }

    //计算学年周数
    public ResultVO getYearWeek(String yearId) {
        ResultVO resultVO;
        List<Map<String,Object>> weekList = new ArrayList<>();
        Edu400 edu400 = edu400Dao.findOne(Long.parseLong(yearId));
        try {
            //记录开始日期
            String startDate = edu400.getKssj();
            //计算开始日期是星期几
            int weekOfDate = DateUtils.getWeekOfDate(startDate);
            String endDate;
            //计算第一周结束日期
            if(weekOfDate == 0) {
                 endDate = startDate;
            } else {
                 endDate = DateUtils.getCalculateDateToString(startDate, 7-weekOfDate);
            }
            String countDate = DateUtils.getCalculateDateToString(endDate, 1);
            //将第一周放入周集合
            Map<String,Object> firstMap = new HashMap<>();
            firstMap.put("id","1");
            firstMap.put("value","第1周("+ startDate +"至"+endDate+")");
            weekList.add(firstMap);
            //循环放入最后一周之前的周信息
            for (int i = 0; i < edu400.getZzs() - 2; i++) {
                Map<String,Object> newMap = new HashMap<>();
                String dateOne = DateUtils.getCalculateDateToString(countDate, 7*i);
                String dateTwo = DateUtils.getCalculateDateToString(countDate, 7*(i+1)-1);
                newMap.put("id",String.valueOf(i+2));
                newMap.put("value","第"+(i+2)+"周("+ dateOne +"至"+dateTwo+")");
                weekList.add(newMap);
            }
            //将最后一周放入周集合
            Map<String,Object> lastMap = new HashMap<>();
            String dateThree = DateUtils.getCalculateDateToString(countDate, 7*(edu400.getZzs()-2));
            lastMap.put("id",String.valueOf(edu400.getZzs()));
            lastMap.put("value","第"+edu400.getZzs()+"周("+ dateThree +"至"+edu400.getJssj()+")");
            weekList.add(lastMap);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("查询成功",weekList);
        return resultVO;
        
    }


    //教师查询学年课表
    public ResultVO getYearScheduleInfo(TimeTablePO timeTable) {
        ResultVO resultVO;
        Edu101 edu101 = edu101Dao.getTeacherInfoByEdu990Id(timeTable.getCurrentUserId());

        if(edu101 == null) {
            resultVO = ResultVO.setFailed("您不是本校教师，无法查看您的课程");
            return resultVO;
        }

        Specification<YearSchedulePO> specification = new Specification<YearSchedulePO>() {
            public Predicate toPredicate(Root<YearSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (timeTable.getSemester() != null && !"".equals(timeTable.getSemester())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  timeTable.getSemester()));
                }
                if (edu101.getEdu101_ID() != null && !"".equals(edu101.getEdu101_ID())) {
                    predicates.add(cb.equal(root.<String>get("edu101_id"),  edu101.getEdu101_ID()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        //根据信息查询所有课表信息
        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
        List<YearSchedulePO> yearSchedules = yearScheduleViewDao.findAll(specification);
        List<YearSchedulePO> yearSchedulePOS = replaceSchedule(yearSchedules);
        if(yearSchedulePOS.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年找到您的课程");
        } else {
            for (YearSchedulePO o : yearSchedulePOS) {
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
            resultVO = ResultVO.setSuccess("当前学年共找到"+yearSchedulePOS.size()+"个课程",timeTable);
        }
        return resultVO;
    }

    //重新整理周课表
    private List<SchoolTimetablePO> replaceScheduleweek(List<SchoolTimetablePO> yearSchedules) {
        List<SchoolTimetablePO> newList = new ArrayList<>();
        int size = yearSchedules.size();
        for (int i = 0; i < size ; i++) {
            String kjid = yearSchedules.get(i).getKjid();
            String xqid = yearSchedules.get(i).getXqid();
            String classid = yearSchedules.get(i).getClassId();
            List<SchoolTimetablePO> orderList = new ArrayList<>();
            for ( int j = i ;j < size; j++) {
                SchoolTimetablePO info = yearSchedules.get(j);
                if (kjid.equals(info.getKjid()) && xqid.equals(info.getXqid()) && classid.equals(info.getClassId())) {
                    orderList.add(info);
                }
                if (j == size-1 || !(kjid.equals(info.getKjid()) && xqid.equals(info.getXqid()) && classid.equals(info.getClassId()))) {
                    break;
                }
            }
            List<String> ssz = new ArrayList<>();
            for (SchoolTimetablePO e : orderList) {
                if (e.getKsz().equals(e.getJsx())) {
                    ssz.add("第"+e.getKsz()+"周");
                } else {
                    ssz.add("第"+e.getKsz()+"-"+e.getJsx()+"周");
                }
            }
            SchoolTimetablePO addInfo = orderList.get(0);
            addInfo.setSzz(utils.listToString(ssz,','));
            newList.add(addInfo);
            i += orderList.size()-1;
        }
        return newList;
    }

    //重新整理学年课表
    private List<YearSchedulePO> replaceSchedule(List<YearSchedulePO> yearSchedules) {
        List<YearSchedulePO> newList = new ArrayList<>();
        int size = yearSchedules.size();
        for (int i = 0; i < size ; i++) {
            String kjid = yearSchedules.get(i).getKjid();
            String xqid = yearSchedules.get(i).getXqid();
            List<YearSchedulePO> orderList = new ArrayList<>();
            for ( int j = i ;j < size; j++) {
                YearSchedulePO info = yearSchedules.get(j);
                if (kjid.equals(info.getKjid()) && xqid.equals(info.getXqid())) {
                    orderList.add(info);
                }
                if (j == size-1 || !(kjid.equals(info.getKjid()) && xqid.equals(info.getXqid()))) {
                    break;
                }
            }
            List<String> ssz = new ArrayList<>();
            for (YearSchedulePO e : orderList) {
                if (e.getKsz().equals(e.getJsz())) {
                    ssz.add("第"+e.getKsz()+"周");
                } else {
                    ssz.add("第"+e.getKsz()+"-"+e.getJsz()+"周");
                }
            }
            YearSchedulePO addInfo = orderList.get(0);
            addInfo.setSzz(utils.listToString(ssz,','));
            newList.add(addInfo);
            i += orderList.size()-1;
        }
        return newList;
    }


    //学生查询学年课表
    public ResultVO getStudentYearScheduleInfo(TimeTablePO timeTable) {
        ResultVO resultVO;
        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
        Edu001 edu001 = edu001Dao.getStudentInfoByEdu990Id(timeTable.getCurrentUserId());
        if(edu001 == null) {
            resultVO = ResultVO.setFailed("您不是本校学生，无法查看您的课程");
            return resultVO;
        }

        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(edu001.getEdu300_ID());
        classIds.add(Long.parseLong(edu001.getEdu300_ID()));
        String[] classIdList = utils.listToString(classIds, ',').split(",");


        //根据信息查询所有课表信息
        Specification<YearSchedulePO> specification = new Specification<YearSchedulePO>() {
            public Predicate toPredicate(Root<YearSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (timeTable.getSemester() != null && !"".equals(timeTable.getSemester())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  timeTable.getSemester()));
                }
                predicates.add(cb.equal(root.<String>get("teacherType"),  "01"));
                Path<Object> classPath = root.get("classId");//定义查询的字段
                CriteriaBuilder.In<Object> classIn = cb.in(classPath);
                for (int i = 0; i <classIdList.length ; i++) {
                    classIn.value(classIdList[i]);//存入值
                }
                predicates.add(cb.and(classIn));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<YearSchedulePO> yearSchedules = yearScheduleViewDao.findAll(specification);
        List<YearSchedulePO> yearSchedulePOS = replaceSchedule(yearSchedules);
        if(yearSchedulePOS.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年找到您的课程");
        } else {
            for (YearSchedulePO o : yearSchedulePOS) {
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
            resultVO = ResultVO.setSuccess("当前学年共找到"+yearSchedulePOS.size()+"个课程",timeTable);
        }
        return resultVO;
    }

    //老师检索学年分散学时课表
    public ResultVO searchYearScatteredClassByTeacher(TimeTablePO timeTablePO) {
        ResultVO resultVO;
        Edu101 edu101 = edu101Dao.getTeacherInfoByEdu990Id(timeTablePO.getCurrentUserId());
        if(edu101 == null) {
            resultVO = ResultVO.setFailed("您不是本校教师，无法查看您的课程");
            return resultVO;
        }
        //根据信息查询所有课表信息
        List<String> edu201Ids = teachingScheduleViewDao.findEdu201IdsByEdu101Id(edu101.getEdu101_ID().toString(),timeTablePO.getSemester());
        if(edu201Ids.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年未找到您的课程");
        } else {
            List<Edu207> edu207List = edu207Dao.findAllByEdu201IdsWithoutWeek(edu201Ids);
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前学年课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前学年共找到"+edu207List.size()+"条分散学时安排",edu207List);
            }
        }
        return resultVO;
    }

    //学生检索学年分散学时课表
    public ResultVO searchYearScatteredClassByStudent(TimeTablePO timeTablePO) {
        ResultVO resultVO;
        Edu001 edu001 = edu001Dao.getStudentInfoByEdu990Id(timeTablePO.getCurrentUserId());
        if(edu001 == null) {
            resultVO = ResultVO.setFailed("您不是本校学生，无法查看您的课程");
            return resultVO;
        }

        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(edu001.getEdu300_ID());
        classIds.add(Long.parseLong(edu001.getEdu300_ID()));
        String[] classIdList = utils.listToString(classIds, ',').split(",");
        //根据信息查询所有课表信息
        List<String> edu201Ids = studentScheduleViewDao.findEdu201IdsByEdu301Ids(classIdList, timeTablePO.getSemester());
        if(edu201Ids.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年找到您的课程");
        } else {
            List<Edu207> edu207List = edu207Dao.findAllByEdu201IdsWithoutWeek(edu201Ids);
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前学年课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前学年共找到"+edu207List.size()+"条分散学识安排",edu207List);
            }
        }
        return resultVO;
    }

    //教务查询老师学年课表
    public ResultVO JwGetYearScheduleInfo(TimeTablePO timeTable) {
        ResultVO resultVO;
        Specification<YearSchedulePO> specification = new Specification<YearSchedulePO>() {
            public Predicate toPredicate(Root<YearSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (timeTable.getSemester() != null && !"".equals(timeTable.getSemester())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  timeTable.getSemester()));
                }
                if (timeTable.getCurrentUserId() != null && !"".equals(timeTable.getCurrentUserId())) {
                    predicates.add(cb.equal(root.<String>get("edu101_id"),  Long.parseLong(timeTable.getCurrentUserId())));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        //根据信息查询所有课表信息
        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
        List<YearSchedulePO> yearSchedules = yearScheduleViewDao.findAll(specification);
        List<YearSchedulePO> yearSchedulePOS = replaceSchedule(yearSchedules);
        if(yearSchedulePOS.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年找到您的课程");
        } else {
            for (YearSchedulePO o : yearSchedulePOS) {
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
            resultVO = ResultVO.setSuccess("当前学年共找到"+yearSchedulePOS.size()+"个课程",timeTable);
        }
        return resultVO;
    }
    
    //教务查询班级学年课程表查询
    public ResultVO JwGetYearScheduleInfoByClass(TimeTablePO timeTable) {
        ResultVO resultVO;
        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
       
        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(timeTable.getCurrentUserId());
        classIds.add(Long.parseLong(timeTable.getCurrentUserId()));
        String[] classIdList = utils.listToString(classIds, ',').split(",");


        //根据信息查询所有课表信息
        Specification<YearSchedulePO> specification = new Specification<YearSchedulePO>() {
            public Predicate toPredicate(Root<YearSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (timeTable.getSemester() != null && !"".equals(timeTable.getSemester())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  timeTable.getSemester()));
                }
                predicates.add(cb.equal(root.<String>get("teacherType"),  "01"));
                Path<Object> classPath = root.get("classId");//定义查询的字段
                CriteriaBuilder.In<Object> classIn = cb.in(classPath);
                for (int i = 0; i <classIdList.length ; i++) {
                    classIn.value(classIdList[i]);//存入值
                }
                predicates.add(cb.and(classIn));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<YearSchedulePO> yearSchedules = yearScheduleViewDao.findAll(specification);
        List<YearSchedulePO> yearSchedulePOS = replaceSchedule(yearSchedules);
        if(yearSchedulePOS.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年未找到您的课程");
        } else {
            for (YearSchedulePO o : yearSchedulePOS) {
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
            resultVO = ResultVO.setSuccess("当前学年共找到"+yearSchedulePOS.size()+"个课程",timeTable);
        }
        return resultVO;
    }

    public String selectXbmc(String xybm) {
        Edu104 e = edu104Dao.findOne(Long.parseLong(xybm));
        return e.getXbmc();
    }

    public List<String> selectClass(String xybm) {
        List<String> ids = edu300Dao.selectClass(xybm);
        return ids;
    }

    //导出教务查询班级学年课程表
    public TimeTablePO ExportJwGetYearScheduleInfoByClass(String xnid,String classId) {
        TimeTablePO timeTable = new TimeTablePO();
        ResultVO resultVO;
        List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(classId);
        String name = edu300Dao.findOne(Long.parseLong(classId)).getXzbmc();
        timeTable.setWeekTime(name);
        classIds.add(Long.parseLong(classId));
        String[] classIdList = utils.listToString(classIds, ',').split(",");


        //根据信息查询所有课表信息
        Specification<YearSchedulePO> specification = new Specification<YearSchedulePO>() {
            public Predicate toPredicate(Root<YearSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (xnid != null && !"".equals(xnid)) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  xnid));
                }
                predicates.add(cb.equal(root.<String>get("teacherType"),  "01"));
                Path<Object> classPath = root.get("classId");//定义查询的字段
                CriteriaBuilder.In<Object> classIn = cb.in(classPath);
                for (int i = 0; i <classIdList.length ; i++) {
                    classIn.value(classIdList[i]);//存入值
                }
                predicates.add(cb.and(classIn));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<YearSchedulePO> yearSchedules = yearScheduleViewDao.findAll(specification);
        List<YearSchedulePO> yearSchedulePOS = replaceSchedule(yearSchedules);
        if(yearSchedulePOS.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年未找到您的课程");
        } else {
            for (YearSchedulePO o : yearSchedulePOS) {
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
        }
        return timeTable;
    }


    //导出教务查询学院周课表
    public TimeTablePO ExportJwGetYearScheduleInfoByWeeks(String xnid,String xbmc,String week) {
        TimeTablePO timeTable = new TimeTablePO();
        List<Edu107> edu107List = new ArrayList<>();
        if(xbmc == null || "".equals(xbmc)){
            edu107List = edu107Dao.findAll();
        }else{
            edu107List = edu107Dao.departmentMatchGrade(xbmc);
        }
        if (edu107List.size() == 0) {
            return timeTable;
        }
        List<Long> edu107Ids = edu107List.stream().map(Edu107::getEdu107_ID).collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107Ids);
        if(edu108IdList.size() == 0) {
            return timeTable;
        }
        List edu108Ids = utils.heavyListMethod(edu108IdList);
        Specification<ScheduleViewPO> scheduleViewPOSpecification = new Specification<ScheduleViewPO>() {
            public Predicate toPredicate(Root<ScheduleViewPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                predicates.add(cb.equal(root.<String>get("xnid"),  xnid));
                predicates.add(cb.equal(root.<String>get("week"),  week));
                Path<Object> path = root.get("courseId");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <edu108Ids.size() ; i++) {
                    in.value(edu108Ids.get(i));//存入值
                }
                predicates.add(cb.and(in));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<ScheduleViewPO> scheduleViewPOList = scheduleViewDao.findAll(scheduleViewPOSpecification);
        if(scheduleViewPOList.size() == 0) {
            return timeTable;
        } else {
            List<SchoolTimetablePO> schoolTimetableList = new ArrayList<>();
            for (ScheduleViewPO o : scheduleViewPOList) {
                if("02".equals(o.getCourseType())){
                    Edu301 edu301 = edu301Dao.findOne(Long.parseLong(o.getClassId()));
                    o.setClassName(edu301.getBhxzbmc());
                }
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
            List<SchoolTimetablePO> schoolTimetableLists = replaceScheduleweek(schoolTimetableList);
            timeTable.setNewInfo(timeTablePackage(schoolTimetableLists));
        }
        return timeTable;
    }

    //导出教务查询学院周课表
    public XSSFWorkbook exportJwGetYearScheduleInfoByWeeks(TimeTablePO timeTable,String xbmc,String week) {
        XSSFWorkbook workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet(xbmc+"第"+week+"周集中课时详情");
            XSSFRow firstRow = sheet.createRow(0);// 第一行
            XSSFCell cells[] = new XSSFCell[1];
            // 所有标题数组
            String[] titles = new String[]{"", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"};

            // 循环设置标题
            for (int i = 0; i < titles.length; i++) {
                cells[0] = firstRow.createCell(i);
                cells[0].setCellValue(titles[i]);
            }
            List<Map> newInfo = timeTable.getNewInfo();
            int j = 1;
            int k = 0;
            for (int i = 0; i < newInfo.size(); i++) {
                j = 1;
                utils.appendCell(sheet, k, "", "第"+(i*2+1)+"-"+(i*2+2)+"节", -1, 0, false);

                //星期日
                List<SchoolTimetablePO> sunday = (List<SchoolTimetablePO>) newInfo.get(i).get("sunday");
                if (sunday != null) {
                    int kk = 0;
                    for (int y = 0; y < sunday.size(); y++) {
                        SchoolTimetablePO p = sunday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 7, false, cs);
                        kk++;
                    }
                    if (sunday.size() > j) {
                        j = sunday.size();
                    }
                }
                //星期一
                List<SchoolTimetablePO> monday = (List<SchoolTimetablePO>) newInfo.get(i).get("monday");
                if (monday != null) {
                    int kk = 0;
                    for (int y = 0; y < monday.size(); y++) {
                        SchoolTimetablePO p = monday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 1, false, cs);
                        kk++;
                    }
                    if (monday.size() > j) {
                        j = monday.size();
                    }
                }
                //星期二
                List<SchoolTimetablePO> tuesday = (List<SchoolTimetablePO>) newInfo.get(i).get("tuesday");
                if (tuesday != null) {
                    int kk = 0;
                    for (int y = 0; y < tuesday.size(); y++) {
                        SchoolTimetablePO p = tuesday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 2, false, cs);
                        kk++;
                    }
                    if (tuesday.size() > j) {
                        j = tuesday.size();
                    }
                }
                //星期三
                List<SchoolTimetablePO> wednesday = (List<SchoolTimetablePO>) newInfo.get(i).get("wednesday");
                if (wednesday != null) {
                    int kk = 0;
                    for (int y = 0; y < wednesday.size(); y++) {
                        SchoolTimetablePO p = wednesday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 3, false, cs);
                        kk++;
                    }
                    if (wednesday.size() > j) {
                        j = wednesday.size();
                    }
                }
                //星期四
                List<SchoolTimetablePO> thursday = (List<SchoolTimetablePO>) newInfo.get(i).get("thursday");
                if (thursday != null) {
                    int kk = 0;
                    for (int y = 0; y < thursday.size(); y++) {
                        SchoolTimetablePO p = thursday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 4, false, cs);
                        kk++;
                    }
                    if (thursday.size() > j) {
                        j = thursday.size();
                    }
                }
                //星期五
                List<SchoolTimetablePO> friday = (List<SchoolTimetablePO>) newInfo.get(i).get("friday");
                if (friday != null) {
                    int kk = 0;
                    for (int y = 0; y < friday.size(); y++) {
                        SchoolTimetablePO p = friday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 5, false, cs);
                        kk++;
                    }
                    if (friday.size() > j) {
                        j = friday.size();
                    }
                }
                //星期六
                List<SchoolTimetablePO> saturday = (List<SchoolTimetablePO>) newInfo.get(i).get("saturday");
                if (saturday != null) {
                    int kk = 0;
                    for (int y = 0; y < saturday.size(); y++) {
                        SchoolTimetablePO p = saturday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 6, false, cs);
                        kk++;
                    }
                    if (saturday.size() > j) {
                        j = saturday.size();
                    }
                }
                k = k + j;
            }

            sheet.setColumnWidth(0, 15 * 256);
            sheet.setColumnWidth(1, 30 * 256);
            sheet.setColumnWidth(2, 30 * 256);
            sheet.setColumnWidth(3, 30 * 256);
            sheet.setColumnWidth(4, 30 * 256);
            sheet.setColumnWidth(5, 30 * 256);
            sheet.setColumnWidth(6, 30 * 256);
            sheet.setColumnWidth(7, 30 * 256);
        return workbook;
    }

    //导出集中学时课表
    public XSSFWorkbook exportJwGetYearScheduleInfoByClass(List<TimeTablePO> timeTables) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        for(int ii = 0;ii<timeTables.size();ii++) {
            TimeTablePO timeTable = timeTables.get(ii);
            XSSFSheet sheet = workbook.createSheet(timeTable.getWeekTime()+"集中课时详情");
            XSSFRow firstRow = sheet.createRow(0);// 第一行
            XSSFCell cells[] = new XSSFCell[1];
            // 所有标题数组
            String[] titles = new String[]{"", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"};

            // 循环设置标题
            for (int i = 0; i < titles.length; i++) {
                cells[0] = firstRow.createCell(i);
                cells[0].setCellValue(titles[i]);
            }
            List<Map> newInfo = timeTable.getNewInfo();
            int j = 1;
            int k = 0;
            for (int i = 0; i < newInfo.size(); i++) {
                j = 1;
                utils.appendCell(sheet, k, "", "第"+(i*2+1)+"-"+(i*2+2)+"节", -1, 0, false);

                //星期日
                List<SchoolTimetablePO> sunday = (List<SchoolTimetablePO>) newInfo.get(i).get("sunday");
                if (sunday != null) {
                    int kk = 0;
                    for (int y = 0; y < sunday.size(); y++) {
                        SchoolTimetablePO p = sunday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 7, false, cs);
                        kk++;
                    }
                    if (sunday.size() > j) {
                        j = sunday.size();
                    }
                }
                //星期一
                List<SchoolTimetablePO> monday = (List<SchoolTimetablePO>) newInfo.get(i).get("monday");
                if (monday != null) {
                    int kk = 0;
                    for (int y = 0; y < monday.size(); y++) {
                        SchoolTimetablePO p = monday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 1, false, cs);
                        kk++;
                    }
                    if (monday.size() > j) {
                        j = monday.size();
                    }
                }
                //星期二
                List<SchoolTimetablePO> tuesday = (List<SchoolTimetablePO>) newInfo.get(i).get("tuesday");
                if (tuesday != null) {
                    int kk = 0;
                    for (int y = 0; y < tuesday.size(); y++) {
                        SchoolTimetablePO p = tuesday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 2, false, cs);
                        kk++;
                    }
                    if (tuesday.size() > j) {
                        j = tuesday.size();
                    }
                }
                //星期三
                List<SchoolTimetablePO> wednesday = (List<SchoolTimetablePO>) newInfo.get(i).get("wednesday");
                if (wednesday != null) {
                    int kk = 0;
                    for (int y = 0; y < wednesday.size(); y++) {
                        SchoolTimetablePO p = wednesday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 3, false, cs);
                        kk++;
                    }
                    if (wednesday.size() > j) {
                        j = wednesday.size();
                    }
                }
                //星期四
                List<SchoolTimetablePO> thursday = (List<SchoolTimetablePO>) newInfo.get(i).get("thursday");
                if (thursday != null) {
                    int kk = 0;
                    for (int y = 0; y < thursday.size(); y++) {
                        SchoolTimetablePO p = thursday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 4, false, cs);
                        kk++;
                    }
                    if (thursday.size() > j) {
                        j = thursday.size();
                    }
                }
                //星期五
                List<SchoolTimetablePO> friday = (List<SchoolTimetablePO>) newInfo.get(i).get("friday");
                if (friday != null) {
                    int kk = 0;
                    for (int y = 0; y < friday.size(); y++) {
                        SchoolTimetablePO p = friday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 5, false, cs);
                        kk++;
                    }
                    if (friday.size() > j) {
                        j = friday.size();
                    }
                }
                //星期六
                List<SchoolTimetablePO> saturday = (List<SchoolTimetablePO>) newInfo.get(i).get("saturday");
                if (saturday != null) {
                    int kk = 0;
                    for (int y = 0; y < saturday.size(); y++) {
                        SchoolTimetablePO p = saturday.get(y);
                        ArrayList<String> arrayList = new ArrayList<String>();
                        arrayList.add(p.getClassName());
                        arrayList.add(p.getCourseName());
                        arrayList.add(p.getSzz());
                        arrayList.add("任课教师：" + p.getTeacherName());
                        String name = p.getBaseTeacherName();
                        if (name == null) {
                            name = "";
                        }
                        arrayList.add("助教：" + name);
                        arrayList.add(p.getClassRoom() + "-" + p.getPoint());
                        arrayList.add("地址：" + p.getLocalAddress());
                        CellStyle cs = workbook.createCellStyle();
                        cs.setWrapText(true);
                        String content = String.join("\n", arrayList);
                        utils.appendCell(sheet, k + kk, "", content, -1, 6, false, cs);
                        kk++;
                    }
                    if (saturday.size() > j) {
                        j = saturday.size();
                    }
                }
                k = k + j;
            }

            sheet.setColumnWidth(0, 15 * 256);
            sheet.setColumnWidth(1, 30 * 256);
            sheet.setColumnWidth(2, 30 * 256);
            sheet.setColumnWidth(3, 30 * 256);
            sheet.setColumnWidth(4, 30 * 256);
            sheet.setColumnWidth(5, 30 * 256);
            sheet.setColumnWidth(6, 30 * 256);
            sheet.setColumnWidth(7, 30 * 256);
        }
        return workbook;
    }
    
    //教务检索学年分散学时课表
    public ResultVO JwSearchYearScatteredClassByTeacher(TimeTablePO timeTablePO) {
        ResultVO resultVO;
        String edu101Id = timeTablePO.getCurrentUserId();
       
        //根据信息查询所有课表信息
        List<String> edu201Ids = teachingScheduleViewDao.findEdu201IdsByEdu101Id(edu101Id,timeTablePO.getSemester());
        if(edu201Ids.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年未找到您的课程");
        } else {
            List<Edu207> edu207List = edu207Dao.findAllByEdu201IdsWithoutWeek(edu201Ids);
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前学年课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前学年共找到"+edu207List.size()+"条分散学时安排",edu207List);
            }
        }
        return resultVO;
    }

    //教务检索班级分散学时课表
    public ResultVO JwSearchYearScatteredClassByClass(TimeTablePO timeTablePO) {
        ResultVO resultVO;
        List<Long> classIds = edu302Dao.findEdu301IdsByEdu300Id(timeTablePO.getCurrentUserId());
        classIds.add(Long.parseLong(timeTablePO.getCurrentUserId()));
        String[] classIdList = utils.listToString(classIds, ',').split(",");
        //根据信息查询所有课表信息
//        List<String> edu201Ids = studentScheduleViewDao.findEdu201IdsByEdu301Ids(classIdList, timeTablePO.getSemester());
        List<String> edu201Ids = edu201Dao.findEdu201IdsByclassIds(classIdList, timeTablePO.getSemester());
        if(edu201Ids.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年未找到您的课程");
        } else {
            List<Edu207> edu207List = edu207Dao.findAllByEdu201IdsWithoutWeek(edu201Ids);
            if (edu207List.size() == 0) {
                resultVO = ResultVO.setFailed("当前学年课程暂无分散学时安排");
            } else {
                resultVO = ResultVO.setSuccess("当前学年共找到"+edu207List.size()+"条分散学识安排",edu207List);
            }
        }
        return resultVO;
    }

    //教务查询授课成果
    public ResultVO searchCourseResult(CourseResultPagePO courseResultPagePO) {
        ResultVO resultVO;
        Map<String, Object> returnMap = new HashMap<>();

        Integer pageNumber = courseResultPagePO.getPageNum();
        Integer pageSize = courseResultPagePO.getPageSize();

        pageNumber = pageNumber < 0 ? 0 : pageNumber;
        pageSize = pageSize < 0 ? 10 : pageSize;

        //根据条件筛选培养计划
        Specification<Edu107> Edu107Specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (courseResultPagePO.getEdu103() != null && !"".equals(courseResultPagePO.getEdu103())) {
                    predicates.add(cb.equal(root.<String>get("edu103"), courseResultPagePO.getEdu103()));
                }
                if (courseResultPagePO.getEdu104() != null && !"".equals(courseResultPagePO.getEdu104())) {
                    predicates.add(cb.equal(root.<String>get("edu104"), courseResultPagePO.getEdu104()));
                }
                if (courseResultPagePO.getEdu105() != null && !"".equals(courseResultPagePO.getEdu105())) {
                    predicates.add(cb.equal(root.<String>get("edu105"), courseResultPagePO.getEdu105()));
                }
                if (courseResultPagePO.getEdu106() != null && !"".equals(courseResultPagePO.getEdu106())) {
                    predicates.add(cb.equal(root.<String>get("edu106"), courseResultPagePO.getEdu106()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> relationEntities = edu107Dao.findAll(Edu107Specification);

        if (relationEntities.size() == 0) {
            resultVO = ResultVO.setFailed("暂时没有符合条件的课程");
            return resultVO;
        }
        List<Long> edu107IdList = relationEntities.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂时没有符合条件的课程");
            return resultVO;
        }
        Specification<Edu201> specification = new Specification<Edu201>() {
            public Predicate toPredicate(Root<Edu201> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (courseResultPagePO.getXnid() != null && !"".equals(courseResultPagePO.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  courseResultPagePO.getXnid()));
                }
                if (courseResultPagePO.getLs() != null && !"".equals(courseResultPagePO.getLs())) {
                    predicates.add(cb.like(root.<String>get("ls"), "%"+courseResultPagePO.getLs()+"%"));
                }
                if (courseResultPagePO.getClassName() != null && !"".equals(courseResultPagePO.getClassName())) {
                    predicates.add(cb.like(root.<String>get("className"), "%"+courseResultPagePO.getClassName()+"%"));
                }
                if (courseResultPagePO.getKcmc() != null && !"".equals(courseResultPagePO.getKcmc())) {
                    predicates.add(cb.like(root.<String>get("kcmc"), "%"+courseResultPagePO.getKcmc()+"%"));
                }
                Path<Object> path = root.get("edu108_ID");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i < edu108IdList.size() ; i++) {
                    in.value(edu108IdList.get(i));//存入值
                }
                predicates.add(cb.and(in));
                predicates.add(cb.equal(root.<String>get("sfsqks"),  "T"));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        PageRequest page = new PageRequest(pageNumber-1, pageSize, Sort.Direction.ASC,"pyjhmc");
        Page<Edu201> pages = edu201Dao.findAll(specification,page);

        List<Edu201> edu201List = pages.getContent();
        long count = edu201Dao.count(specification);


        if (edu201List.size() == 0) {
            resultVO = ResultVO.setFailed("暂时没有符合条件的课程");
            return resultVO;
        }

        List<CourseResultPO> courseResultList = new ArrayList<>();
        for (Edu201 e : edu201List) {
            CourseResultPO data = new CourseResultPO();
            try {
                BeanUtils.copyProperties(data,e);
            } catch (IllegalAccessException ex) {
                ex.printStackTrace();
            } catch (InvocationTargetException ex) {
                ex.printStackTrace();
            }
            Long edu201Id = e.getEdu201_ID();

            //查询及格数据
            String countAll = edu005Dao.countAllByEdu201(edu201Id);
            String countPass = edu005Dao.countPassByEdu201(edu201Id);
            if(Integer.parseInt(countPass) != 0){
                double v = Double.parseDouble(countPass) / Double.parseDouble(countAll);
                NumberFormat nf = NumberFormat.getPercentInstance();
                nf.setMinimumFractionDigits(2);//设置保留小数位
                String usedPercent = nf.format(v);
                data.setPassingRate(usedPercent);
            } else {
                data.setPassingRate("0.00%");
            }

            //查询出勤数据
            String countCheckOnAll = edu208Dao.countAllByEdu201(edu201Id);
            if(Integer.parseInt(countCheckOnAll) != 0) {
                String countCheckOnAllPass = edu208Dao.countPassByEdu201(edu201Id);
                if(Integer.parseInt(countCheckOnAllPass) != 0){
                    double v = Double.parseDouble(countCheckOnAllPass) / Double.parseDouble(countCheckOnAll);
                    NumberFormat nf = NumberFormat.getPercentInstance();
                    nf.setMinimumFractionDigits(2);//设置保留小数位
                    String checkOnPercent = nf.format(v);
                    data.setCheckOnRate(checkOnPercent);
                } else {
                    data.setCheckOnRate("0.00%");
                }
            }

            courseResultList.add(data);
        }

        returnMap.put("rows",courseResultList);
        returnMap.put("total",count);

        resultVO = ResultVO.setSuccess("共找到"+courseResultList.size()+"条课程信息",returnMap);
        return resultVO;
    }

    //教务查询专业授课成果-查询各个学院的
    public ResultVO searchProfessionalByXY(String xnid,String edu103Id) {
        ResultVO resultVO;
        List<Edu104> edu104List = edu104Dao.findAll();
        List<ProfessionalSortPO> professionalSortPOS = new ArrayList<>();
        for (Edu104 e : edu104List) {
            ProfessionalSortPO data = new ProfessionalSortPO();
            try {
                BeanUtils.copyProperties(data,e);
            } catch (IllegalAccessException ex) {
                ex.printStackTrace();
            } catch (InvocationTargetException ex) {
                ex.printStackTrace();
            }
            Long edu104Id = e.getEdu104_ID();
            //查询及格数据
            String countAll = edu005Dao.countAllByEdu104AndXN(edu104Id,xnid,edu103Id);
            String countPass = edu005Dao.countPassByEdu104ndXN(edu104Id,xnid,edu103Id);
            if(Integer.parseInt(countPass) != 0){
                double v = Double.parseDouble(countPass) / Double.parseDouble(countAll);
                NumberFormat nf = NumberFormat.getPercentInstance();
                nf.setMinimumFractionDigits(2);//设置保留小数位
                String usedPercent = nf.format(v);
                data.setPassingRate(usedPercent);
            } else {
                data.setPassingRate("0.00%");
            }
            professionalSortPOS.add(data);
        }
        professionalSortPOS.sort(Comparator.comparing(ProfessionalSortPO::getPassingRate).reversed());
        resultVO = ResultVO.setSuccess("查询成功",professionalSortPOS);
        return resultVO;
    }


    //教务查询专业授课成果
    public ResultVO searchProfessionalCourseResult(Edu107 edu107,String xnid,String className,String studentName) {
        ResultVO resultVO;
        List<Edu107> edu107List = edu107Dao.searchProfessionalCourseResult(edu107.getEdu103(),edu107.getEdu104(),edu107.getEdu105(),edu107.getEdu106(),edu107.getBatch());
        if(edu107List.size() == 0){
            resultVO = ResultVO.setFailed("未制订培养计划");
        }else if(edu107List.size() > 1){
            resultVO = ResultVO.setFailed("该专业批次制订了多个培养计划，无法统计");
        }else{
            edu107 = edu107List.get(0);
            List<Object[]> dataList;
            List<Edu005PO> edu005List = new ArrayList<>();
            if(className != null && !"".equals(className) && studentName != null && !"".equals(studentName)){
                dataList = edu005Dao.searchProfessionalCourseResult4(edu107.getEdu107_ID()+"",xnid,className,studentName);
                if(dataList.size() == 0){
                    resultVO = ResultVO.setFailed("暂无数据");
                    return resultVO;
                }
                for(Object[] o:dataList){
                    Edu005PO edu005 = new Edu005PO();
                    edu005.setEdu005_ID(Long.parseLong((String) o[0]));
                    edu005.setAvg((String) o[5]);
                    edu005.setClassName((String) o[1]);
                    edu005.setStudentCode((String) o[2]);
                    edu005.setStudentName((String) o[3]);
                    edu005.setSum((String) o[4]);
                    edu005List.add(edu005);
                }
            }else if(studentName != null && !"".equals(studentName)){
                dataList = edu005Dao.searchProfessionalCourseResult2(edu107.getEdu107_ID()+"",xnid,studentName);
                if(dataList.size() == 0){
                    resultVO = ResultVO.setFailed("暂无数据");
                    return resultVO;
                }
                for(Object[] o:dataList){
                    Edu005PO edu005 = new Edu005PO();
                    edu005.setEdu005_ID(Long.parseLong((String) o[0]));
                    edu005.setAvg((String) o[5]);
                    edu005.setClassName((String) o[1]);
                    edu005.setStudentCode((String) o[2]);
                    edu005.setStudentName((String) o[3]);
                    edu005.setSum((String) o[4]);
                    edu005List.add(edu005);
                }
            }else if(className != null && !"".equals(className)){
                dataList = edu005Dao.searchProfessionalCourseResult3(edu107.getEdu107_ID()+"",xnid,className);
                if(dataList.size() == 0){
                    resultVO = ResultVO.setFailed("暂无数据");
                    return resultVO;
                }
                for(Object[] o:dataList){
                    Edu005PO edu005 = new Edu005PO();
                    edu005.setEdu005_ID(Long.parseLong((String) o[0]));
                    edu005.setAvg((String) o[5]);
                    edu005.setClassName((String) o[1]);
                    edu005.setStudentCode((String) o[2]);
                    edu005.setStudentName((String) o[3]);
                    edu005.setSum((String) o[4]);
                    edu005List.add(edu005);
                }
            }else{
                dataList = edu005Dao.searchProfessionalCourseResult(edu107.getEdu107_ID()+"",xnid);
                if(dataList.size() == 0){
                    resultVO = ResultVO.setFailed("暂无数据");
                    return resultVO;
                }
                for(Object[] o:dataList){
                    Edu005PO edu005 = new Edu005PO();
                    edu005.setEdu005_ID(Long.parseLong((String) o[0]));
                    edu005.setAvg((String) o[5]);
                    edu005.setClassName((String) o[1]);
                    edu005.setStudentCode((String) o[2]);
                    edu005.setStudentName((String) o[3]);
                    edu005.setSum((String) o[4]);
                    edu005List.add(edu005);
                }
            }
            resultVO = ResultVO.setSuccess("查询成功！",edu005List);
        }
        return resultVO;
    }


    //导出教务专业授课成果-校验
    public ResultVO exportProfessionalCourseResultCheck(Edu107 edu107,String xnid) {
        ResultVO resultVO;
        List<Edu107> edu107List = edu107Dao.searchProfessionalCourseResult(edu107.getEdu103(),edu107.getEdu104(),edu107.getEdu105(),edu107.getEdu106(),edu107.getBatch());
        if(edu107List.size() == 0){
            resultVO = ResultVO.setFailed("未制订培养计划");
        }else if(edu107List.size() > 1){
            resultVO = ResultVO.setFailed("该专业批次制订了多个培养计划，无法统计");
        }else{
            edu107 = edu107List.get(0);
            List<Object[]> dataList;
            List<Edu005PO> edu005List = new ArrayList<>();
            dataList = edu005Dao.searchProfessionalCourseResult(edu107.getEdu107_ID()+"",xnid);
            if(dataList.size() == 0){
                resultVO = ResultVO.setFailed("暂无数据");
                return resultVO;
            }for(Object[] o:dataList){
                Edu005PO edu005 = new Edu005PO();
                edu005.setEdu005_ID(Long.parseLong((String) o[0]));
                edu005.setAvg((String) o[5]);
                edu005.setClassName((String) o[1]);
                edu005.setStudentCode((String) o[2]);
                edu005.setStudentName((String) o[3]);
                edu005.setSum((String) o[4]);
                edu005.setEdu107(edu107);
                edu005List.add(edu005);
            }
            resultVO = ResultVO.setSuccess("查询成功！",edu005List);
        }
        return resultVO;
    }


    //导出教务专业授课成果
    public XSSFWorkbook exportProfessionalCourseResult(List<Edu005PO> edu005POList,String name,String xnid) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet(name+"专业授课成果");
        Edu400 edu400 = edu400Dao.findOne(Long.parseLong(xnid));
        String xnmc = edu400.getXnmc();
        Edu107 e = edu005POList.get(0).getEdu107();
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        //辽宁职业学院XX学年XX学院XX专业学生成绩排名统计表
        String firstTitle = "辽宁职业学院"+xnmc+e.getEdu104mc()+name+"专业学生成绩排名统计表";
        XSSFCell cells[] = new XSSFCell[1];
//        cells[0] = firstRow.createCell(0);
//        cells[0].setCellValue(firstTitle);
        XSSFCell cell2 = firstRow.createCell(0);
        cell2.setCellValue(firstTitle);
        XSSFRow twoRow = sheet.createRow(1);// 第二行
        // 所有标题数组
//        String[] titles = new String[] {"班级","姓名","各门课程成绩","总分", "平均分","名次"};
        //班级
        cells[0] = twoRow.createCell(0);
        cells[0].setCellValue("班级");
        CellRangeAddress region2 = new CellRangeAddress(1, 2, 0, 0);
        sheet.addMergedRegion(region2);
        //姓名
        cells[0] = twoRow.createCell(1);
        cells[0].setCellValue("姓名");
        CellRangeAddress region3 = new CellRangeAddress(1, 2, 1, 1);
        sheet.addMergedRegion(region3);
        //学号
        cells[0] = twoRow.createCell(2);
        cells[0].setCellValue("学号");
        CellRangeAddress region8 = new CellRangeAddress(1, 2, 2, 2);
        sheet.addMergedRegion(region8);
        //各门课程成绩
//        cells[0] = twoRow.createCell(2);
//        cells[0].setCellValue("各门课程成绩");
        //详细成绩
        List<String> courseNameList = edu005Dao.findCourseListByEdu107Id(e.getEdu107_ID()+"",xnid);
        XSSFRow threeRow = sheet.createRow(2);// 第三行
        for(int i =0;i<courseNameList.size();i++){
            cells[0] = threeRow.createCell(3+i);
            cells[0].setCellValue(courseNameList.get(i));
        }
        CellRangeAddress region7 = new CellRangeAddress(1, 1, 3, 2+courseNameList.size());
        sheet.addMergedRegion(region7);

        XSSFCell cell = twoRow.createCell(3);
        cell.setCellValue("各门课程成绩");
        CellStyle cellStyle = workbook.createCellStyle();
        //字体居中
        cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        cell.setCellStyle(cellStyle);
        //总分
        cells[0] = twoRow.createCell(3+courseNameList.size());
        cells[0].setCellValue("总分");
        CellRangeAddress region4 = new CellRangeAddress(1, 2, 3+courseNameList.size(), 3+courseNameList.size());
        sheet.addMergedRegion(region4);
        //平均分
        cells[0] = twoRow.createCell(4+courseNameList.size());
        cells[0].setCellValue("平均分");
        CellRangeAddress region5 = new CellRangeAddress(1, 2, 4+courseNameList.size(), 4+courseNameList.size());
        sheet.addMergedRegion(region5);
        //名次
        cells[0] = twoRow.createCell(5+courseNameList.size());
        cells[0].setCellValue("名次");
        CellRangeAddress region6 = new CellRangeAddress(1, 2, 5+courseNameList.size(), 5+courseNameList.size());
        sheet.addMergedRegion(region6);
        //合并单元格
        CellRangeAddress region = new CellRangeAddress(0, 0, 0, 5+courseNameList.size());
        sheet.addMergedRegion(region);
        cell2.setCellStyle(cellStyle);

        for (int i = 0; i < edu005POList.size(); i++) {
            //班级
            utils.appendCell(sheet,i+2,"",edu005POList.get(i).getClassName(),-1,0,false);
            //姓名
            utils.appendCell(sheet,i+2,"",edu005POList.get(i).getStudentName(),-1,1,false);
            //学号
            utils.appendCell(sheet,i+2,"",edu005POList.get(i).getStudentCode(),-1,2,false);
            //各个科目详情
            for(int j = 0;j<courseNameList.size();j++){
                Edu005 edu005 = edu005Dao.findedu005bySCX(edu005POList.get(i).getStudentCode(),courseNameList.get(j),xnid);
                if(edu005 == null){
                    utils.appendCell(sheet,i+2,"","暂无成绩",-1,3+j,false);
                }else if(edu005.getIsMx() != null){
                    utils.appendCell(sheet,i+2,"",edu000Dao.queryEjdmMcByEjdmZ(edu005.getIsMx(),"IS_MX"),-1,3+j,false);
                }else if(edu005.getIsConfirm() == null){
                    utils.appendCell(sheet,i+2,"","成绩未确认",-1,3+j,false);
                }else{
                    utils.appendCell(sheet,i+2,"",edu005.getGrade(),-1,3+j,false);
                }
            }
            //总分
            utils.appendCell(sheet,i+2,"",edu005POList.get(i).getSum(),-1,3+courseNameList.size(),false);
            //平均分
            utils.appendCell(sheet,i+2,"",edu005POList.get(i).getAvg(),-1,4+courseNameList.size(),false);
            //名次
            utils.appendCell(sheet,i+2,"","第"+(i+1)+"名",-1,5+courseNameList.size(),false);
        }

//        for (int i = 0; i < edu0051List.size(); i++) {
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getXn(),-1,0,false);
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getClassName(),-1,1,false);
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getCourseName(),-1,2,false);
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getStudentName(),-1,3,false);
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getStudentCode(),-1,4,false);
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getEntryDate(),-1,5,false);
//            utils.appendCell(sheet,i,"",edu0051List.get(i).getGrade(),-1,6,false);
//            if(edu0051List.get(i).getExam_num() == 0){
//                utils.appendCell(sheet,i,"","正考成绩",-1,7,false);
//            }else{
//                utils.appendCell(sheet,i,"","第"+edu0051List.get(i).getExam_num()+"次补考成绩",-1,7,false);
//            }
//        }
//
        sheet.setColumnWidth(0, 20*256);
        sheet.setColumnWidth(1, 12*256);
        sheet.setColumnWidth(2, 20*256);
//        sheet.setColumnWidth(3, 10*256);
//        sheet.setColumnWidth(4, 20*256);
//        sheet.setColumnWidth(5, 30*256);
//        sheet.setColumnWidth(7, 20*256);

        return workbook;
    }

    //教务查询成绩详情
    public ResultVO searchGradeInfo(Edu005 edu005) {
        ResultVO resultVO;

        Specification<Edu005> specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getStudentName() != null && !"".equals(edu005.getStudentName())) {
                    predicates.add(cb.like(root.<String>get("studentName"), edu005.getStudentName()));
                }
                if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
                    predicates.add(cb.like(root.<String>get("className"), edu005.getClassName()));
                }
                if (edu005.getEdu201_ID() != null && !"".equals(edu005.getEdu201_ID())) {
                    predicates.add(cb.equal(root.<Long>get("edu201_ID"), edu005.getEdu201_ID()));
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


    //教务查询班级授课成果
    public ResultVO searchClassInfo(String edu201_Id) {
        ResultVO resultVO;
//        List<Edu201> edu201List = edu201Dao.searchClassInfo(edu201Id);
        Edu201 edu201 = edu201Dao.findOne(Long.parseLong(edu201_Id));
        if (edu201 == null) {
            resultVO = ResultVO.setFailed("暂无数据");
            return resultVO;
        }
        List<String> className = Arrays.asList(edu201.getClassName().split(","));
        List<CourseResultPO> courseResultList = new ArrayList<>();
        for(int i = 0;i<className.size();i++){
            Edu201 edu201New = new Edu201();
            edu201New.setEdu201_ID(edu201.getEdu201_ID());
            edu201New.setXn(edu201.getXn());
            edu201New.setKcmc(edu201.getKcmc());
            edu201New.setLsmc(edu201.getLsmc());
            edu201New.setClassName(className.get(i));
            CourseResultPO data = new CourseResultPO();
            try {
                BeanUtils.copyProperties(data,edu201New);
            } catch (IllegalAccessException ex) {
                ex.printStackTrace();
            } catch (InvocationTargetException ex) {
                ex.printStackTrace();
            }
            //查询及格数据
            String countAll = edu005Dao.countAllByEdu201AndClassname(data.getEdu201_ID(),data.getClassName());
            String countPass = edu005Dao.countPassByEdu201AndClassname(data.getEdu201_ID(),data.getClassName());
            if(Integer.parseInt(countPass) != 0){
                double v = Double.parseDouble(countPass) / Double.parseDouble(countAll);
                NumberFormat nf = NumberFormat.getPercentInstance();
                nf.setMinimumFractionDigits(2);//设置保留小数位
                String usedPercent = nf.format(v);
                data.setPassingRate(usedPercent);
            } else {
                data.setPassingRate("0.00%");
            }
            courseResultList.add(data);
        }

        resultVO = ResultVO.setSuccess("查询成功",courseResultList);
        return resultVO;
    }


    //获取全部学年
    public ResultVO searchAllXn() {
        ResultVO resultVO;
        List<Edu400> allXn = edu400Dao.findAllXn();
        if (allXn.size() == 0) {
            resultVO = ResultVO.setFailed("暂无学年信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+allXn.size()+"条学年信息",allXn);
        }
        return resultVO;
    }

    //考勤情况详情
    public ResultVO searchAttendanceDetail(String taskId) {
        ResultVO resultVO;
        List<CourseCheckOnPO> courseCheckOnList = courseCheckOnDao.findAllByEdu201(taskId);
        if (courseCheckOnList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无考勤信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+courseCheckOnList.size()+"条考勤信息",courseCheckOnList);
        }

        return resultVO;
    }
}


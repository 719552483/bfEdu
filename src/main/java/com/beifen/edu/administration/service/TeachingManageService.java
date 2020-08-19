package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.SchoolTimetablePO;
import com.beifen.edu.administration.PO.TimeTablePO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.ClassPeriodConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//教务管理业务层
@Service
public class TeachingManageService {

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
    ApprovalProcessService approvalProcessService;
    @Autowired
    TeachingScheduleViewDao teachingScheduleViewDao;

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
        edu112.setBusinessState("passing");
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
        approvalProcessService.initiationProcess(edu600);
        resultVO = ResultVO.setSuccess("出差申请成功");

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
                map1 = classPackage(map1,s,ClassPeriodConstant.SECTION_ONE);
            }
            if(ClassPeriodConstant.SECTION_TWO.equals(s.getKjmc())) {
                map2 = classPackage(map2,s,ClassPeriodConstant.SECTION_TWO);
            }
            if(ClassPeriodConstant.SECTION_THREE.equals(s.getKjmc())) {
                map3 = classPackage(map3,s,ClassPeriodConstant.SECTION_THREE);
            }
            if(ClassPeriodConstant.SECTION_FOUR.equals(s.getKjmc())) {
                map4 = classPackage(map4,s,ClassPeriodConstant.SECTION_FOUR);
            }
            if(ClassPeriodConstant.SECTION_FIVE.equals(s.getKjmc())) {
                map5 = classPackage(map5,s,ClassPeriodConstant.SECTION_FIVE);
            }
            if(ClassPeriodConstant.SECTION_SIX.equals(s.getKjmc())) {
                map6 = classPackage(map6,s,ClassPeriodConstant.SECTION_SIX);
            }
            if(ClassPeriodConstant.SECTION_SEVEN.equals(s.getKjmc())) {
                map7 = classPackage(map7,s,ClassPeriodConstant.SECTION_SEVEN);
            }
            if(ClassPeriodConstant.SECTION_EIGHT.equals(s.getKjmc())) {
                map8 = classPackage(map8,s,ClassPeriodConstant.SECTION_EIGHT);
            }
            if(ClassPeriodConstant.SECTION_NINE.equals(s.getKjmc())) {
                map9 = classPackage(map9,s,ClassPeriodConstant.SECTION_NINE);
            }
            if(ClassPeriodConstant.SECTION_TEN.equals(s.getKjmc())) {
                map10 = classPackage(map10,s,ClassPeriodConstant.SECTION_TEN);
            }
            if(ClassPeriodConstant.SECTION_ELEVEN.equals(s.getKjmc())) {
                map11 = classPackage(map11,s,ClassPeriodConstant.SECTION_ELEVEN);
            }
            if(ClassPeriodConstant.SECTION_TWELVE.equals(s.getKjmc())) {
                map12 = classPackage(map12,s,ClassPeriodConstant.SECTION_TWELVE);
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
    private Map classPackage(Map map,SchoolTimetablePO s,String session) {

        //定义星期是否使用开关
        Boolean mondy = false;
        Boolean tuesday = false;
        Boolean wednesday = false;
        Boolean thursday = false;
        Boolean friday = false;
        Boolean saturday = false;
        Boolean sunday = false;

        //定义每周课程数组
        List<SchoolTimetablePO> mondayList = new ArrayList<>();
        List<SchoolTimetablePO> tuesdayList = new ArrayList<>();
        List<SchoolTimetablePO> wednesdayList = new ArrayList<>();
        List<SchoolTimetablePO> thursdayList = new ArrayList<>();
        List<SchoolTimetablePO> fridayList = new ArrayList<>();
        List<SchoolTimetablePO> saturdayList = new ArrayList<>();
        List<SchoolTimetablePO> sundayList = new ArrayList<>();


        String xq = s.getXqid();
        switch (xq) {
            case "01":
                mondayList.add(s);
                mondy = true;
                break;
            case "02":
                tuesdayList.add(s);
                tuesday = true;
                break;
            case "03":
                wednesdayList.add(s);
                wednesday = true;
                break;
            case "04":
                thursdayList.add(s);
                thursday = true;
                break;
            case "05":
                fridayList.add(s);
                friday = true;
                break;
            case "06":
                saturdayList.add(s);
                saturday = true;
                break;
            case "07":
                sundayList.add(s);
                sunday = true;
                break;
        }

        if(mondy) {
            map.put("monday",mondayList);
        }
        if(tuesday) {
            map.put("tuesday",tuesdayList);
        }
        if(wednesday) {
            map.put("wednesday",wednesdayList);
        }
        if(thursday) {
            map.put("thursday",thursdayList);
        }
        if(friday) {
            map.put("friday",fridayList);
        }
        if(saturday) {
            map.put("saturday",saturdayList);
        }
        if(sunday) {
            map.put("sunday",sundayList);
        }

        return map;
    }
}

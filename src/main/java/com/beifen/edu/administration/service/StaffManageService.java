package com.beifen.edu.administration.service;

import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

//教职工管理业务层
@Service
public class StaffManageService {

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
    Edu005Dao edu005Dao;
    @Autowired
    Edu108Dao edu108Dao;
    @Autowired
    Edu107Dao edu107Dao;
    @Autowired
    ApprovalProcessService approvalProcessService;
    @Autowired
    RedisUtils redisUtils;


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
        String jzgh_before =utils.getRandom(2);
        String newXh = "1"+jzgh_before+utils.getRandom(3);
        return newXh;
    }


    //根据权限查询所有教师
    public ResultVO queryAllTeacherByUserId(String userId) {
        ResultVO resultVO;

        //从redis中查询二级学院管理权限
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        List<Edu101> teacherList = edu101Dao.queryAllTeacherByUserId(departments);

        if(teacherList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无教师信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+teacherList.size()+"个教师",teacherList);
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

    //录入或修改成绩
    public ResultVO giveGrade(Edu005 edu005) {
        ResultVO resultVO;
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(currentTime);
        edu005.setEntryDate(dateString);
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
        }
        edu005Dao.save(edu005);
        resultVO = ResultVO.setSuccess("成绩录入成功",dateString);
        return resultVO;
    }


    //查询所有老师
    public ResultVO queryAllTeachers() {
        ResultVO resultVO;
        List<Edu101> edu101List = edu101Dao.findAll();
        if(edu101List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可选老师");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu101List);
        }
        return resultVO;
    }
}

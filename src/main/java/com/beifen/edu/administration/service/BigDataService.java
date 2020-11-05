package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.BigDataDepartmentPO;
import com.beifen.edu.administration.PO.BigDataTeacherTypePO;
import com.beifen.edu.administration.PO.EchartDataPO;
import com.beifen.edu.administration.PO.EchartPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.Edu501;
import com.beifen.edu.administration.domian.Edu800;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;


/**
 * 大数据业务层
 */
@Configuration
@Service
public class BigDataService {

    @Autowired
    private Edu800Dao edu800Dao;
    @Autowired
    private Edu501Dao edu501Dao;
    @Autowired
    private Edu202Dao edu202Dao;
    @Autowired
    private Edu001Dao edu001Dao;
    @Autowired
    private ReflectUtils utils;

    //保存大数据财务信息
    public ResultVO saveFinanceInfo(Edu800 edu800) {
        ResultVO resultVO;
        String createDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        edu800.setCreateDate(createDate);
        edu800Dao.save(edu800);
        resultVO = ResultVO.setSuccess("操作成功",edu800);
        return resultVO;
    }


    //删除大数据财务信息
    public ResultVO deleteFinanceInfo(List<String> edu108IdList) {
        ResultVO resultVO;
        edu800Dao.deleteByEdu108Ids(edu108IdList);
        resultVO = ResultVO.setSuccess("删除了"+edu108IdList.size()+"条信息");
        return resultVO;
    }


    //获取大数据财务信息
    public ResultVO getDataPredtiction(String year,String departmentCode) {
        ResultVO resultVO;
        Map<String,Object> returnMap = new HashMap<>();

        Specification<Edu800> specification = new Specification<Edu800>() {
            public Predicate toPredicate(Root<Edu800> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (year != null && !"".equals(year)) {
                    predicates.add(cb.equal(root.<String>get("year"), year));
                }
                if (departmentCode != null && !"".equals(departmentCode)) {
                    predicates.add(cb.equal(root.<String>get("departmentCode"), departmentCode));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu800> edu800List = edu800Dao.findAll(specification);

        List<Edu800> edu800SumList;
        if(year != null && !"".equals(year) ) {
            edu800SumList = edu800Dao.findSumInfoByYear(year);
        }else {
            edu800SumList = edu800Dao.findSumInfo();
        }

        returnMap.put("edu800List",edu800List);
        returnMap.put("edu800SumList",edu800SumList);

        resultVO = ResultVO.setSuccess("查询成功",returnMap);

        return resultVO;
    }

    //获取大屏展示数据
    public ResultVO getBigScreenData() {
        ResultVO resultVO;
        Map<String,Object> returnMap = new HashMap<>();

        //教学任务点查询
        List<Edu501> edu501List = edu501Dao.findAll();
        returnMap.put("pointInfo",edu501List);

        //教学点学生人数查询
        Map<String, Object> studentsInLocal = getStudentsInLocal();
        returnMap.put("studentsInLocal",studentsInLocal);

        //学生年龄雷达图
        List<EchartPO> studentAgeData = getStudentsByAge();
        returnMap.put("studentAgeData",studentAgeData);

        //学生职业雷达图
        List<EchartPO> studentJobData = getStudentsByJob();
        returnMap.put("studentJobData",studentJobData);

        //二级学院列表
        List<BigDataDepartmentPO> departmentData= getBigDataDepartment();
        returnMap.put("departmentData",departmentData);

        //获取教师类型数据
        List<BigDataTeacherTypePO> teacherTypeData= getBigDataTeacherType();
        Map<String, List<BigDataTeacherTypePO>> teacherTypeByDepartemnt = teacherTypeData.stream().collect(Collectors.groupingBy(BigDataTeacherTypePO::getEdu104Id));
        //整理教师类型柱状图数据
        List<EchartDataPO> newTeacherTypeData = new ArrayList<>();
        teacherTypeByDepartemnt.forEach((key, value) -> {
            EchartDataPO echartDataPO = packageTeacherType(value);
            newTeacherTypeData.add(echartDataPO);
        });
        returnMap.put("teacherTypeData",newTeacherTypeData);

        resultVO = ResultVO.setSuccess("查询成功",returnMap);
        return resultVO;
    }

    //整理教师类型柱状图数据
    private EchartDataPO packageTeacherType(List<BigDataTeacherTypePO> value) {
        EchartDataPO echartDataPO = new EchartDataPO();
        Integer zrjs = 0;
        Integer jzjs = 0;
        Integer wpjs = 0;
        String[] data = {zrjs.toString(),jzjs.toString(),wpjs.toString()};
        for(BigDataTeacherTypePO e : value) {
            Integer i = Integer.parseInt(e.getTeacherCount());
            if("001".equals(e.getTeacherType())) {
                data[0]=i.toString();
            } else if ("003".equals(e.getTeacherType())) {
                data[1]=i.toString();
            } else if ("004".equals(e.getTeacherType())) {
                data[2]=i.toString();
            }
        }

        echartDataPO.setName(value.get(0).getDepartmentName());
        echartDataPO.setData(data);

        return echartDataPO;
    }

    //获取大屏教师类型数据
    private List<BigDataTeacherTypePO> getBigDataTeacherType() {
        List<Object[]> teacherTypeList = edu202Dao.getTeacherType();
        BigDataTeacherTypePO bigDataTeacherTypePO = new BigDataTeacherTypePO();
        List<BigDataTeacherTypePO> newteacherTypeList = utils.castEntity(teacherTypeList, BigDataTeacherTypePO.class, bigDataTeacherTypePO);
        return newteacherTypeList;
    }

    //获取大屏二级学院列表
    private List<BigDataDepartmentPO> getBigDataDepartment() {
        List<Object[]> departmentPOList = edu202Dao.getDepartment();
        BigDataDepartmentPO bigDataDepartmentPO = new BigDataDepartmentPO();
        List<BigDataDepartmentPO> newdepartmentPOList = utils.castEntity(departmentPOList, BigDataDepartmentPO.class, bigDataDepartmentPO);
        return newdepartmentPOList;
    }

    //获取各职业学生人数
    private List<EchartPO> getStudentsByJob() {
        List<EchartPO> echartPOS = edu001Dao.getStudentByJob();
        return echartPOS;
    }

    //获取各年龄段学生人数
    private List<EchartPO> getStudentsByAge() {
        List<EchartPO> echartPOS = new ArrayList<>();

        Integer count1 = edu001Dao.getStudentByAge("0","19");
        Integer count2 = edu001Dao.getStudentByAge("20","29");
        Integer count3 = edu001Dao.getStudentByAge("30","39");
        Integer count4 = edu001Dao.getStudentByAge("40","49");
        Integer count5 = edu001Dao.getStudentByAge("50","99");

        String name1 = "20岁以下";
        String name2 = "20-30岁";
        String name3 = "30-40岁";
        String name4= "40-50岁";
        String name5 = "50岁以上";

        for (int i = 0; i <5 ; i++) {
            EchartPO echartPO = new EchartPO();
            switch(i) {
                case 0:
                    echartPO.setName(name1);
                    echartPO.setValue(count1.toString());
                    echartPOS.add(echartPO);
                    break;
                case 1:
                    echartPO.setName(name2);
                    echartPO.setValue(count2.toString());
                    echartPOS.add(echartPO);
                    break;
                case 2:
                    echartPO.setName(name3);
                    echartPO.setValue(count3.toString());
                    echartPOS.add(echartPO);
                    break;
                case 3:
                    echartPO.setName(name4);
                    echartPO.setValue(count4.toString());
                    echartPOS.add(echartPO);
                    break;
                case 4:
                    echartPO.setName(name5);
                    echartPO.setValue(count5.toString());
                    echartPOS.add(echartPO);
                    break;
            }

        }

        return echartPOS;
    }

    //教学点学生人数查询
    private Map<String,Object> getStudentsInLocal() {
        Map<String,Object> returnMap = new HashMap<>();

//        List<StudentInPointPO> studentInPointList = edu202Dao.getStudentsInLocal();
//
//        List<String> yAxisData = studentInPointList.stream().map(StudentInPointPO::getLocalName).collect(Collectors.toList());
//        List<Long> seriesdata = studentInPointList.stream().map(StudentInPointPO::getStudentCount).collect(Collectors.toList());
//
//        returnMap.put("yAxisData",yAxisData);
//        returnMap.put("seriesdata",seriesdata);

        return returnMap;
    }
}

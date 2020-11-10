package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.DateUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.text.ParseException;
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
    private Edu104Dao edu104Dao;
    @Autowired
    private Edu201Dao edu201Dao;
    @Autowired
    private Edu400Dao edu400Dao;
    @Autowired
    private Edu203Dao edu203Dao;
    @Autowired
    private Edu207Dao edu207Dao;
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
    public ResultVO getBigScreenData(BigDataSearchPO bigDataSearch) {
        ResultVO resultVO;
        Map<String,Object> returnMap = new HashMap<>();

        //教学任务点查询
        List<Edu501> edu501List = edu501Dao.findAll();
        returnMap.put("pointInfo",edu501List);

        //二级学院列表
        List<BigDataDepartmentPO> departmentData= getBigDataDepartment();
        returnMap.put("departmentData",departmentData);

        if("".equals(bigDataSearch.getDepartmentCode())) {
            //教学点学生人数查询
            Map<String, Object> studentsInLocal = getStudentsInLocal(bigDataSearch);
            returnMap.put("studentsInLocal",studentsInLocal);

            //学生年龄雷达图
            List<EchartPO> studentAgeData = getStudentsByAge(bigDataSearch);
            returnMap.put("studentAgeData",studentAgeData);

            //学生职业雷达图
            List<EchartPO> studentJobData = getStudentsByJob(bigDataSearch);
            returnMap.put("studentJobData",studentJobData);

            //获取教师类型数据
            List<BigDataTeacherTypePO> teacherTypeData= getBigDataTeacherType(bigDataSearch);
            Map<String, List<BigDataTeacherTypePO>> teacherTypeByDepartemnt = teacherTypeData.stream().collect(Collectors.groupingBy(BigDataTeacherTypePO::getEdu104Id));
            //整理教师类型柱状图数据
            List<EchartDataPO> newTeacherTypeData = new ArrayList<>();
            teacherTypeByDepartemnt.forEach((key, value) -> {
                EchartDataPO echartDataPO = packageTeacherType(value);
                newTeacherTypeData.add(echartDataPO);
            });
            returnMap.put("teacherTypeData",newTeacherTypeData);

            //获取课时类型数据
            List<BigDataPeriodTypePO> periodTypeData= getBigDataPeriodType(bigDataSearch);
            //按顺序整理课时格式
            List<EchartDataPO> periodTypeEcharts = packagePeriodType(periodTypeData);
            //按顺序获取二级学院名称
            List<String> departmentNames = periodTypeData.stream().map(BigDataPeriodTypePO::getDepartmentName).collect(Collectors.toList());
            //组装课时类型Echart信息
            Map<String,Object> newPeriodTypeData = new HashMap<>();
            newPeriodTypeData.put("departmentNames",departmentNames);
            newPeriodTypeData.put("periodTypeEcharts",periodTypeEcharts);
            returnMap.put("periodTypeData",newPeriodTypeData);

            //获取开课情况数据
            List<Edu104> edu104List = edu104Dao.getEdu104InPlan();
            List<Map<String,Object>> courseData = new ArrayList<>();
            for(Edu104 e : edu104List) {
                Map<String,Object> map = new HashMap<>();
                List<Edu201> edu201IsCompleted = edu201Dao.getEdu201IsCompleted(e.getEdu104_ID());
                List<Edu201> edu201By104ID = edu201Dao.getEdu201By104ID(e.getEdu104_ID());
                map.put("text",e.getXbmc());
                map.put("courseCount",edu201By104ID.size());
                map.put("courseCompleteCount",edu201IsCompleted.size());
                courseData.add(map);
            }
            returnMap.put("courseData",courseData);
        } else {
            //教学点学生人数查询
            Map<String, Object> studentsInLocal = getStudentsInLocal(bigDataSearch);
            returnMap.put("studentsInLocal",studentsInLocal);

            //学生年龄雷达图
            List<EchartPO> studentAgeData = getStudentsByAge(bigDataSearch);
            returnMap.put("studentAgeData",studentAgeData);

            //学生职业雷达图
            List<EchartPO> studentJobData = getStudentsByJob(bigDataSearch);
            returnMap.put("studentJobData",studentJobData);

            //获取教师类型数据
            List<BigDataTeacherTypePO> teacherTypeData= getBigDataTeacherType(bigDataSearch);
            Map<String, List<BigDataTeacherTypePO>> teacherTypeByDepartemnt = teacherTypeData.stream().collect(Collectors.groupingBy(BigDataTeacherTypePO::getEdu104Id));
            //整理教师类型柱状图数据
            List<EchartDataPO> newTeacherTypeData = new ArrayList<>();
            teacherTypeByDepartemnt.forEach((key, value) -> {
                EchartDataPO echartDataPO = packageTeacherType(value);
                newTeacherTypeData.add(echartDataPO);
            });
            returnMap.put("teacherTypeData",newTeacherTypeData);

            //获取课时类型数据
            List<BigDataPeriodTypePO> periodTypeData= getBigDataPeriodType(bigDataSearch);
            //按顺序整理课时格式
            List<EchartDataPO> periodTypeEcharts = packagePeriodType(periodTypeData);
            //按顺序获取二级学院名称
            List<String> departmentNames = periodTypeData.stream().map(BigDataPeriodTypePO::getDepartmentName).collect(Collectors.toList());
            //组装课时类型Echart信息
            Map<String,Object> newPeriodTypeData = new HashMap<>();
            newPeriodTypeData.put("departmentNames",departmentNames);
            newPeriodTypeData.put("periodTypeEcharts",periodTypeEcharts);
            returnMap.put("periodTypeData",newPeriodTypeData);

            //获取开课情况数据
            List<Edu104> edu104List = edu104Dao.getEdu104InPlanInDepartment(bigDataSearch.getDepartmentCode());
            List<Map<String,Object>> courseData = new ArrayList<>();
            for(Edu104 e : edu104List) {
                Map<String,Object> map = new HashMap<>();
                List<Edu201> edu201IsCompleted = edu201Dao.getEdu201IsCompleted(e.getEdu104_ID());
                List<Edu201> edu201By104ID = edu201Dao.getEdu201By104ID(e.getEdu104_ID());
                map.put("text",e.getXbmc());
                map.put("courseCount",edu201By104ID.size());
                map.put("courseCompleteCount",edu201IsCompleted.size());
                courseData.add(map);
            }
            returnMap.put("courseData",courseData);

            //查询教师职称分布
            List<BigDataTeacherTypePO> teacherZcTypeData= getTeacherZcType(bigDataSearch);
            //组装饼图数据
            List<Map<String,Object>> newTeacherZcTypeData = new ArrayList<>();
            for(BigDataTeacherTypePO e : teacherZcTypeData) {
                HashMap<String, Object> map = new HashMap<>();
                if(e.getTeacherTypeName() == null) {
                    map.put("name","暂无职称");
                } else {
                    map.put("name",e.getTeacherType());
                }
                map.put("value",e.getTeacherCount());
                newTeacherZcTypeData.add(map);
            }
            returnMap.put("teacherZcTypeData",newTeacherZcTypeData);

            //查询各类型教师课时数
            List<BigDataTeacherTypePO> periodByTeacherType= getPeriodByTeacherType(bigDataSearch);
            //组装饼图数据
            List<Map<String,Object>> newPeriodByTeacherType = new ArrayList<>();
            for(BigDataTeacherTypePO e : periodByTeacherType) {
                HashMap<String, Object> map = new HashMap<>();
                map.put("name",e.getTeacherType());
                map.put("value",e.getTeacherCount());
                newPeriodByTeacherType.add(map);
            }
            returnMap.put("periodByTeacherType",newPeriodByTeacherType);

            //计算当前日期是该学年的第几周星期几
            Edu400 edu400 = edu400Dao.findOne(Long.parseLong("31951"));
            String kssj = edu400.getKssj();
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
            int dayOfWeek;
            int week;
            try {
                int weekOfDate = DateUtils.getWeekOfDate(df.format(new Date()));

                int daysBetween = DateUtils.getDaysBetween(kssj, df.format(new Date()));
                int leftDay = daysBetween % 7;
                if (leftDay != 0) {
                    week = daysBetween / 7;
                }else {
                    week = daysBetween / 7 + 1;
                }
                if(weekOfDate == 0) {
                    dayOfWeek = 7;
                }else {
                    dayOfWeek = weekOfDate;
                }
                //查询集中学时实时课时占比
                Map<String,Object> jzksMap = new HashMap<>();
                List<Edu203> jzksClassPeriod = edu203Dao.getJzksClassPeriod(bigDataSearch.getDepartmentCode());
                List<Edu203> jzksClassPeriodComplete = edu203Dao.getJzksClassPeriodComplete(bigDataSearch.getDepartmentCode(),week,dayOfWeek);
                jzksMap.put("text","集中学时");
                jzksMap.put("peridoCount",jzksClassPeriod.size()*2);
                jzksMap.put("periodCompleteCount",jzksClassPeriodComplete.size()*2);
                returnMap.put("jzksClassPeriodDate",jzksMap);

                //查询分散学时实时课时占比
                Map<String,Object> fsksMap = new HashMap<>();
                Long fsksClassPeriod = edu207Dao.getFsksClassPeriod(bigDataSearch.getDepartmentCode());
                Long fsksClassPeriodComplete = edu207Dao.getFsksClassPeriodComplete(bigDataSearch.getDepartmentCode(),week);
                fsksMap.put("text","分散学时");
                fsksMap.put("peridoCount",fsksClassPeriod);
                fsksMap.put("periodCompleteCount",fsksClassPeriodComplete);
                returnMap.put("fsksClassPeriodDate",fsksMap);

            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        resultVO = ResultVO.setSuccess("查询成功",returnMap);
        return resultVO;
    }

    //获取各类型老师集中学时数量
    private List<BigDataTeacherTypePO> getPeriodByTeacherType(BigDataSearchPO bigDataSearch) {
        String departmentCode = bigDataSearch.getDepartmentCode();
        List<Object[]> teacherZcType = edu202Dao.getPeriodByTeacherType(departmentCode);

        BigDataTeacherTypePO bigDataTeacherTypePO = new BigDataTeacherTypePO();
        List<BigDataTeacherTypePO> newteacherTypeList = utils.castEntity(teacherZcType, BigDataTeacherTypePO.class, bigDataTeacherTypePO);
        return newteacherTypeList;
    }

    //获取教师职称分布
    private List<BigDataTeacherTypePO> getTeacherZcType(BigDataSearchPO bigDataSearch) {
        String departmentCode = bigDataSearch.getDepartmentCode();
        List<Object[]> teacherZcType = edu202Dao.getTeacherZcType(departmentCode);

        BigDataTeacherTypePO bigDataTeacherTypePO = new BigDataTeacherTypePO();
        List<BigDataTeacherTypePO> newteacherTypeList = utils.castEntity(teacherZcType, BigDataTeacherTypePO.class, bigDataTeacherTypePO);
        return newteacherTypeList;
    }

    private List<EchartDataPO> packagePeriodType(List<BigDataPeriodTypePO> periodTypeData) {
        EchartDataPO llxsEchartDataPO = new EchartDataPO();
        EchartDataPO sjxsEchartDataPO = new EchartDataPO();
        EchartDataPO jzxsEchartDataPO = new EchartDataPO();
        EchartDataPO fsxsEchartDataPO = new EchartDataPO();

        String[] llxsData = new String[periodTypeData.size()];
        String[] sjxsData = new String[periodTypeData.size()];
        String[] jzxsData = new String[periodTypeData.size()];
        String[] fsxsData = new String[periodTypeData.size()];

        for (int i = 0; i < periodTypeData.size();i++) {
            llxsData[i] = periodTypeData.get(i).getLlxs();
            sjxsData[i] = periodTypeData.get(i).getSjxs();
            jzxsData[i] = periodTypeData.get(i).getJzxs();
            fsxsData[i] = periodTypeData.get(i).getFsxs();
        }

        llxsEchartDataPO.setName("理论学时");
        llxsEchartDataPO.setData(llxsData);
        sjxsEchartDataPO.setName("实践学时");
        sjxsEchartDataPO.setData(sjxsData);
        jzxsEchartDataPO.setName("集中学时");
        jzxsEchartDataPO.setData(jzxsData);
        fsxsEchartDataPO.setName("分散学时");
        fsxsEchartDataPO.setData(fsxsData);

        ArrayList<EchartDataPO> echartDataPOList = new ArrayList<>();
        echartDataPOList.add(llxsEchartDataPO);
        echartDataPOList.add(sjxsEchartDataPO);
        echartDataPOList.add(jzxsEchartDataPO);
        echartDataPOList.add(fsxsEchartDataPO);

        return echartDataPOList;
    }

    //获取课时类型数据
    private List<BigDataPeriodTypePO> getBigDataPeriodType(BigDataSearchPO bigDataSearchPO) {
        String departmentCode = bigDataSearchPO.getDepartmentCode();
        List<Object[]> periodTypeList;
        if("".equals(departmentCode)) {
            periodTypeList = edu202Dao.getPeriodType();
        } else {
            periodTypeList = edu202Dao.getPeriodTypeInDepartment(departmentCode);
        }

        BigDataPeriodTypePO bigDataPeriodTypePO = new BigDataPeriodTypePO();
        List<BigDataPeriodTypePO> newPeriodTypeList = utils.castEntity(periodTypeList, BigDataPeriodTypePO.class, bigDataPeriodTypePO);
        return newPeriodTypeList;
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
    private List<BigDataTeacherTypePO> getBigDataTeacherType(BigDataSearchPO bigDataSearchPO) {
        String departmentCode = bigDataSearchPO.getDepartmentCode();
        List<Object[]> teacherTypeList;
        if ("".equals(departmentCode)) {
            teacherTypeList = edu202Dao.getTeacherType();
        } else {
            teacherTypeList = edu202Dao.getTeacherTypeInDepartment(departmentCode);
        }

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
    private List<EchartPO> getStudentsByJob(BigDataSearchPO bigDataSearchPO) {
        String departmentCode = bigDataSearchPO.getDepartmentCode();

        List<EchartPO> echartPOS;
        if("".equals(departmentCode)) {
            echartPOS = edu001Dao.getStudentByJob();
        } else {
            echartPOS = edu001Dao.getStudentByJobWithDepatrment(departmentCode);
        }

        return echartPOS;
    }

    //获取各年龄段学生人数
    private List<EchartPO> getStudentsByAge(BigDataSearchPO bigDataSearch) {
        List<EchartPO> echartPOS = new ArrayList<>();

        String departmentCode = bigDataSearch.getDepartmentCode();

        Integer count1;
        Integer count2;
        Integer count3;
        Integer count4;
        Integer count5;

        if("".equals(departmentCode)) {
             count1 = edu001Dao.getStudentByAge("0","19");
             count2 = edu001Dao.getStudentByAge("20","29");
             count3 = edu001Dao.getStudentByAge("30","39");
             count4 = edu001Dao.getStudentByAge("40","49");
             count5 = edu001Dao.getStudentByAge("50","99");
        } else {
             count1 = edu001Dao.getStudentByAgeWithDepartment("0","19",departmentCode);
             count2 = edu001Dao.getStudentByAgeWithDepartment("20","29",departmentCode);
             count3 = edu001Dao.getStudentByAgeWithDepartment("30","39",departmentCode);
             count4 = edu001Dao.getStudentByAgeWithDepartment("40","49",departmentCode);
             count5 = edu001Dao.getStudentByAgeWithDepartment("50","99",departmentCode);
        }


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
    private Map<String,Object> getStudentsInLocal(BigDataSearchPO bigDataSearchPO) {
        Map<String,Object> returnMap = new HashMap<>();

        String departmentCode = bigDataSearchPO.getDepartmentCode();
//        List<Object[]> studentInPointList = edu202Dao.getStudentsInLocal();
//        StudentInPointPO studentInPointPO = new StudentInPointPO();
//        List<StudentInPointPO> newStudentInPointPO = utils.castEntity(studentInPointList, StudentInPointPO.class, studentInPointPO);

        List<StudentInPointPO> newStudentInPointPO;
        if("".equals(departmentCode)) {
           newStudentInPointPO  = edu202Dao.getStudentsInLocalByEdu300();
        } else {
            newStudentInPointPO  = edu202Dao.getStudentsInLocalByEdu300Only(departmentCode);
        }

        List<String> yAxisData = newStudentInPointPO.stream().map(StudentInPointPO::getLocalName).collect(Collectors.toList());
        List<Long> seriesdata = newStudentInPointPO.stream().map(a -> {
            long studentCount = Long.parseLong(a.getStudentCount());
            return studentCount;
        }).collect(Collectors.toList());

        returnMap.put("yAxisData",yAxisData);
        returnMap.put("seriesdata",seriesdata);

        return returnMap;
    }
}

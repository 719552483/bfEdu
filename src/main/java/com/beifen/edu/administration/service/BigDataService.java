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
    private Edu101Dao edu101Dao;
    @Autowired
    private Edu500Dao edu500Dao;
    @Autowired
    private Edu300Dao edu300Dao;
    @Autowired
    private Edu200Dao edu200Dao;
    @Autowired
    private Edu105Dao edu105Dao;
    @Autowired
    private Edu000Dao edu000Dao;
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
        List<Long> schoolYearCodeList = new ArrayList<>();
        List<Long> yearCodeList = new ArrayList<>();
        List<String> batchCodeList = new ArrayList<>();
        String departmentCode = bigDataSearch.getDepartmentCode();

        //获取年级信息
        List<Edu105> edu105List = edu105Dao.findAll();
        returnMap.put("schoolYearInfo",edu105List);

        //获取学年信息
        List<Edu400> edu400List = edu400Dao.findAllXn();
        returnMap.put("yearInfo",edu400List);

        //获取批次信息
        List<Edu000> batchList = edu000Dao.queryejdm("pclx");
        returnMap.put("batchInfo",batchList);
        //重新组装年级
        if ("".equals(bigDataSearch.getSchoolYearCode()) || bigDataSearch.getSchoolYearCode() == null) {
            List<Long> edu105IdS = edu105List.stream().map(Edu105::getEdu105_ID).collect(Collectors.toList());
            schoolYearCodeList.addAll(edu105IdS);
        } else {
            schoolYearCodeList.add(Long.parseLong(bigDataSearch.getSchoolYearCode()));
        }
        //重新组装学年
        if ("".equals(bigDataSearch.getYearCode()) || bigDataSearch.getYearCode() == null) {
            List<Long> edu400IdS = edu400List.stream().map(Edu400::getEdu400_ID).collect(Collectors.toList());
            yearCodeList.addAll(edu400IdS);
        } else {
            yearCodeList.add(Long.parseLong(bigDataSearch.getYearCode()));
        }
        //重新组装批次
        if ("".equals(bigDataSearch.getBatchCode()) || bigDataSearch.getBatchCode() == null) {
            List<String> batchCodes = batchList.stream().map(Edu000::getEjdm).collect(Collectors.toList());
            batchCodeList.addAll(batchCodes);
        } else {
            batchCodeList.add(bigDataSearch.getBatchCode());
        }

        //二级学院列表
        List<BigDataDepartmentPO> departmentData= getBigDataDepartment(schoolYearCodeList,batchCodeList,yearCodeList);
        returnMap.put("departmentData",departmentData);

        //教学点学生人数查询
        Map<String, Object> studentsInLocal = getStudentsInLocal(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
        returnMap.put("studentsInLocal",studentsInLocal);

        //学生年龄雷达图
        List<EchartPO> studentAgeData = getStudentsByAge(departmentCode,schoolYearCodeList,batchCodeList);
        returnMap.put("studentAgeData",studentAgeData);

        //学生职业雷达图
        List<EchartPO> studentJobData = getStudentsByJob(departmentCode,schoolYearCodeList,batchCodeList);
        returnMap.put("studentJobData",studentJobData);

        //获取教师类型数据
        List<BigDataTeacherTypePO> teacherTypeData= getBigDataTeacherType(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
        Map<String, List<BigDataTeacherTypePO>> teacherTypeByDepartemnt = teacherTypeData.stream().collect(Collectors.groupingBy(BigDataTeacherTypePO::getEdu104Id));
        //整理教师类型柱状图数据
        List<EchartDataPO> newTeacherTypeData = new ArrayList<>();
        teacherTypeByDepartemnt.forEach((key, value) -> {
            EchartDataPO echartDataPO = packageTeacherType(value);
            newTeacherTypeData.add(echartDataPO);
        });
        returnMap.put("teacherTypeData",newTeacherTypeData);

        //获取课时类型数据
        List<BigDataPeriodTypePO> periodTypeData= getBigDataPeriodType(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
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
        List<Edu104> edu104List;
        if("".equals(bigDataSearch.getDepartmentCode())) {
            edu104List = edu104Dao.getEdu104InPlan(schoolYearCodeList,batchCodeList);
        } else {
            edu104List = edu104Dao.getEdu104InPlanInDepartment(departmentCode,schoolYearCodeList,batchCodeList);
        }
        List<Map<String,Object>> courseData = new ArrayList<>();
        for(Edu104 e : edu104List) {
            Map<String,Object> map = new HashMap<>();
            Long edu201IsCompleted = edu201Dao.getEdu201IsCompleted(e.getEdu104_ID(),yearCodeList);
            Long edu201By104ID = edu201Dao.getEdu201By104ID(e.getEdu104_ID(),yearCodeList);
            map.put("text",e.getXbmc());
            map.put("courseCount",edu201By104ID);
            map.put("courseCompleteCount",edu201IsCompleted);
            courseData.add(map);
        }
        returnMap.put("courseData",courseData);

        if(!"".equals(bigDataSearch.getDepartmentCode())) {
            //查询教师职称分布
            List<BigDataTeacherTypePO> teacherZcTypeData= getTeacherZcType(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
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
            List<BigDataTeacherTypePO> periodByTeacherType= getPeriodByTeacherType(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
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
            Integer jzxsCount = 0;
            Integer jzxsCompleteCount = 0;
            Integer fsxsCount = 0;
            Integer fsxsCompleteCount = 0;
            Map<String,Object> jzksMap = new HashMap<>();
            Map<String,Object> fsksMap = new HashMap<>();
            try {
                for(Long edu400Id : yearCodeList) {
                    Edu400 edu400 = edu400Dao.findOne(edu400Id);
                    String kssj = edu400.getKssj();
                    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
                    int dayOfWeek;
                    int week;
                    int weekOfDate = DateUtils.getWeekOfDate(df.format(new Date()));
                    int daysBetween = DateUtils.getDaysBetween(kssj, df.format(new Date()));
                    int leftDay = daysBetween % 7;
                    if (leftDay == 0) {
                        week = (daysBetween / 7) + 1;
                    }else {
                        week = (daysBetween / 7) + 2;
                    }
                    if(weekOfDate == 0) {
                        dayOfWeek = 7;
                    }else {
                        dayOfWeek = weekOfDate;
                    }
                    //查询集中学时实时课时占比
                    Long jzksClassPeriod = edu203Dao.getJzksClassPeriod(departmentCode,schoolYearCodeList,batchCodeList,edu400Id);
                    Long jzksClassPeriodComplete = edu203Dao.getJzksClassPeriodComplete(departmentCode,week,dayOfWeek,schoolYearCodeList,batchCodeList,edu400Id);
                    if(jzksClassPeriod != null) {
                        jzxsCount += Integer.parseInt(jzksClassPeriod.toString()) * 2;
                    }
                    if(jzksClassPeriodComplete != null) {
                        jzxsCompleteCount += Integer.parseInt(jzksClassPeriodComplete.toString()) *2;
                    }
                    //查询分散学时实时课时占比
                    Long fsksClassPeriod = edu207Dao.getFsksClassPeriod(departmentCode,schoolYearCodeList,batchCodeList,edu400Id);
                    Long fsksClassPeriodComplete = edu207Dao.getFsksClassPeriodComplete(departmentCode,week,schoolYearCodeList,batchCodeList,edu400Id);
                    if(fsksClassPeriod != null) {
                        fsxsCount += Integer.parseInt(fsksClassPeriod.toString());
                    }
                    if(fsksClassPeriodComplete != null) {
                        fsxsCompleteCount += Integer.parseInt(fsksClassPeriodComplete.toString());
                    }
                }
                jzksMap.put("text","集中学时进度");
                jzksMap.put("peridoCount",jzxsCount);
                jzksMap.put("periodCompleteCount",jzxsCompleteCount);
                returnMap.put("jzksClassPeriodDate",jzksMap);

                fsksMap.put("text","分散学时进度");
                fsksMap.put("peridoCount",fsxsCount);
                fsksMap.put("periodCompleteCount",fsxsCompleteCount);
                returnMap.put("fsksClassPeriodDate",fsksMap);
            } catch (ParseException e) {
                e.printStackTrace();
            }

        }

        resultVO = ResultVO.setSuccess("查询成功",returnMap);
        return resultVO;
    }

    //获取各类型老师集中学时数量
    private List<BigDataTeacherTypePO> getPeriodByTeacherType(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList) {
        List<Object[]> teacherZcType = edu202Dao.getPeriodByTeacherType(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);

        BigDataTeacherTypePO bigDataTeacherTypePO = new BigDataTeacherTypePO();
        List<BigDataTeacherTypePO> newteacherTypeList = utils.castEntity(teacherZcType, BigDataTeacherTypePO.class, bigDataTeacherTypePO);
        return newteacherTypeList;
    }

    //获取教师职称分布
    private List<BigDataTeacherTypePO> getTeacherZcType(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList) {
        List<Object[]> teacherZcType = edu202Dao.getTeacherZcType(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);

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
    private List<BigDataPeriodTypePO> getBigDataPeriodType(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList) {
        List<Object[]> periodTypeList;
        if("".equals(departmentCode)) {
            periodTypeList = edu202Dao.getPeriodType(schoolYearCodeList,batchCodeList,yearCodeList);
        } else {
            periodTypeList = edu202Dao.getPeriodTypeInDepartment(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
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
    private List<BigDataTeacherTypePO> getBigDataTeacherType(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList) {
        List<Object[]> teacherTypeList;
        if ("".equals(departmentCode)) {
            teacherTypeList = edu202Dao.getTeacherType(schoolYearCodeList,batchCodeList,yearCodeList);
        } else {
            teacherTypeList = edu202Dao.getTeacherTypeInDepartment(departmentCode,schoolYearCodeList,batchCodeList,yearCodeList);
        }
        BigDataTeacherTypePO bigDataTeacherTypePO = new BigDataTeacherTypePO();
        List<BigDataTeacherTypePO> newteacherTypeList = utils.castEntity(teacherTypeList, BigDataTeacherTypePO.class, bigDataTeacherTypePO);
        return newteacherTypeList;
    }

    //获取大屏二级学院列表
    private List<BigDataDepartmentPO> getBigDataDepartment(List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList) {
        List<Object[]> departmentPOList = edu202Dao.getDepartment(schoolYearCodeList,batchCodeList,yearCodeList);
        BigDataDepartmentPO bigDataDepartmentPO = new BigDataDepartmentPO();
        List<BigDataDepartmentPO> newdepartmentPOList = utils.castEntity(departmentPOList, BigDataDepartmentPO.class, bigDataDepartmentPO);
        return newdepartmentPOList;
    }

    //获取各职业学生人数
    private List<EchartPO> getStudentsByJob(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList) {
        List<Object[]> dataList;

        if("".equals(departmentCode)) {
            dataList = edu001Dao.getStudentByJob(schoolYearCodeList,batchCodeList);

        } else {
            dataList = edu001Dao.getStudentByJobWithDepatrment(departmentCode,schoolYearCodeList,batchCodeList);
        }

        EchartPO echartPO = new EchartPO();
        List<EchartPO> echartPOS = utils.castEntity(dataList, EchartPO.class, echartPO);

        return echartPOS;
    }

    //获取各年龄段学生人数
    private List<EchartPO> getStudentsByAge(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList) {
        List<EchartPO> echartPOS = new ArrayList<>();

        Integer count1;
        Integer count2;
        Integer count3;
        Integer count4;
        Integer count5;

        if("".equals(departmentCode)) {
             count1 = edu001Dao.getStudentByAge("0","19",schoolYearCodeList,batchCodeList);
             count2 = edu001Dao.getStudentByAge("20","29",schoolYearCodeList,batchCodeList);
             count3 = edu001Dao.getStudentByAge("30","39",schoolYearCodeList,batchCodeList);
             count4 = edu001Dao.getStudentByAge("40","49",schoolYearCodeList,batchCodeList);
             count5 = edu001Dao.getStudentByAge("50","99",schoolYearCodeList,batchCodeList);
        } else {
             count1 = edu001Dao.getStudentByAgeWithDepartment("0","19",departmentCode,schoolYearCodeList,batchCodeList);
             count2 = edu001Dao.getStudentByAgeWithDepartment("20","29",departmentCode,schoolYearCodeList,batchCodeList);
             count3 = edu001Dao.getStudentByAgeWithDepartment("30","39",departmentCode,schoolYearCodeList,batchCodeList);
             count4 = edu001Dao.getStudentByAgeWithDepartment("40","49",departmentCode,schoolYearCodeList,batchCodeList);
             count5 = edu001Dao.getStudentByAgeWithDepartment("50","99",departmentCode,schoolYearCodeList,batchCodeList);
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
    private Map<String,Object> getStudentsInLocal(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList) {
        Map<String,Object> returnMap = new HashMap<>();
        List<Object[]> dataList;


        if("".equals(departmentCode)) {
            dataList  = edu202Dao.getStudentsInLocalByEdu300(schoolYearCodeList,batchCodeList);
        } else {
            dataList  = edu202Dao.getStudentsInLocalByEdu300Only(departmentCode,schoolYearCodeList,batchCodeList);
        }

        StudentInPointPO studentInPointPO = new StudentInPointPO();
        List<StudentInPointPO> newStudentInPointPO = utils.castEntity(dataList, StudentInPointPO.class, studentInPointPO);;

        List<String> yAxisData = newStudentInPointPO.stream().map(StudentInPointPO::getLocalName).collect(Collectors.toList());
        List<Long> seriesdata = newStudentInPointPO.stream().map(a -> {
            long studentCount = Long.parseLong(a.getStudentCount());
            return studentCount;
        }).collect(Collectors.toList());

        returnMap.put("yAxisData",yAxisData);
        returnMap.put("seriesdata",seriesdata);

        return returnMap;
    }

    //获取大屏汇总数据
    public ResultVO getBigScreenTotalData() {
        ResultVO resultVO;
        Map<String,Object> returnMap = new HashMap<>();
        //二级学院数量
        returnMap.put("departmentCount",8);
        //教师数量
        Long teacherCount = edu101Dao.findAllteacher();
        returnMap.put("teacherCount",teacherCount);
        //学生数量
        Long studentCount = edu001Dao.findAllStudent();
        returnMap.put("studentCount",studentCount);
        //教学点数量
        Long localCount = edu500Dao.findAllLocal();
        returnMap.put("localCount",localCount);
        //行政班数量
        Long classCount = edu300Dao.findAllClass();
        returnMap.put("classCount",classCount);
        //课程数量
        Long courseCount = edu200Dao.findAllCourse();
        returnMap.put("courseCount",courseCount);

        //已完成课时数量
        List<String> Edu400Idlist = edu201Dao.getYearList();
        try {
            Integer jzxsCount = 0;
            Integer fsxsCount = 0;
            for(String edu400Id : Edu400Idlist) {
                Edu400 edu400 = edu400Dao.findOne(Long.parseLong(edu400Id));
                String kssj = edu400.getKssj();
                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
                int dayOfWeek;
                int week;
                int weekOfDate = DateUtils.getWeekOfDate(df.format(new Date()));
                int daysBetween = DateUtils.getDaysBetween(kssj, df.format(new Date()));
                int leftDay = daysBetween % 7;
                if (leftDay == 0) {
                    week = (daysBetween / 7) + 1;
                }else {
                    week = (daysBetween / 7) + 2;
                }
                if(weekOfDate == 0) {
                    dayOfWeek = 7;
                }else {
                    dayOfWeek = weekOfDate;
                }
                //查询集中学时实时课时占比
                Long jzksClassPeriodCompleted = edu203Dao.getJzksClassPeriodCompleted(week,dayOfWeek,edu400Id);
                jzxsCount+= Integer.parseInt(jzksClassPeriodCompleted.toString())*2;
                //查询分散学时实时课时占比
                Long fsksClassPeriodCompleted = edu207Dao.getFsksClassPeriodCompleted(week,edu400Id);
                if(fsksClassPeriodCompleted != null) {
                    fsxsCount += Integer.parseInt(fsksClassPeriodCompleted.toString());
                }
            }
            returnMap.put("completehoursCount",jzxsCount+fsxsCount);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("查询成功",returnMap);
        return resultVO;

    }
}

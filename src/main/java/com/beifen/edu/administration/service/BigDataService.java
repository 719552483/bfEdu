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
import org.springframework.util.CollectionUtils;

import javax.persistence.criteria.*;
import java.text.NumberFormat;
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
    private Edu8001Dao edu8001Dao;
    @Autowired
    private Edu501Dao edu501Dao;
    @Autowired
    private Edu202Dao edu202Dao;
    @Autowired
    private Edu001Dao edu001Dao;
    @Autowired
    private Edu0011Dao edu0011Dao;
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
    private Edu106Dao edu106Dao;
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

    //新增修改财务信息详情
    public ResultVO saveFinanceInfoDetail(Edu8001 edu8001) {
        ResultVO resultVO;
        String createDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        edu8001.setCreateDate(createDate); 
        edu8001Dao.save(edu8001);
        resultVO = ResultVO.setSuccess("操作成功",edu8001);
        return resultVO;
    }

    public ResultVO searchFinanceInfoDetail(Edu8001 edu8001,String startTime,String endTime) {
        ResultVO resultVO;
        Map map = new HashMap();
        Specification<Edu8001> specification = new Specification<Edu8001>() {
            public Predicate toPredicate(Root<Edu8001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu8001.getName() != null && !"".equals(edu8001.getName())) {
                    predicates.add(cb.like(root.<String>get("name"), "%" + edu8001.getName() + "%"));
                }
                if (edu8001.getLbbm() != null && !"".equals(edu8001.getLbbm())) {
                    predicates.add(cb.equal(root.<String>get("lbbm"),edu8001.getLbbm()));
                }
                if(startTime != null && !"".equals(startTime)){
                    predicates.add(cb.greaterThanOrEqualTo(root.<String>get("payTime"), startTime));
                }
                if(endTime != null && !"".equals(endTime)){
                    predicates.add(cb.lessThanOrEqualTo(root.<String>get("payTime"),endTime));
                }
                query.where(cb.and(predicates.toArray(new Predicate[predicates.size()])));
                query.orderBy(cb.desc(root.get("payTime")));
                return query.getRestriction();
            }
        };
        List<Edu8001> edu8001List = edu8001Dao.findAll(specification);
        if(edu8001List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无数据");
            return resultVO;
        }
        map.put("tableInfo",edu8001List);
        //年度支出
        SimpleDateFormat SimpleDateFormat = new SimpleDateFormat("yyyy");
        Date date = new Date();
        String year = SimpleDateFormat.format(date);
        Double nowM = edu8001Dao.findByYear(year);
        Double lastM = edu8001Dao.findByYear((Integer.parseInt(year)-1)+"");
        Map mapAll = new HashMap();
        mapAll.put("now",nowM);
        if(nowM-lastM > 0){
            mapAll.put("status","up");
            mapAll.put("count",nowM-lastM);
        }else if(nowM-lastM < 0){
            mapAll.put("status","down");
            mapAll.put("count",lastM-nowM);
        }else{
            mapAll.put("status","equal");
            mapAll.put("count",0);
        }
        map.put("amount",mapAll);
        //条数
        List<Edu000> edu000List = edu000Dao.queryejdm("zclx");
        List<Map> mapList = new ArrayList<>();
        List<String> data = new ArrayList<>();
        Double count = edu8001Dao.findMoney();
        List<Double> data1 = new ArrayList<>();
        List<Double> data2 = new ArrayList<>();
        data.add("总数");
        data1.add(0.0);
        data2.add(count);
        for(Edu000 edu000:edu000List){
            data.add(edu000.getEjdmz());
            Double countL = edu8001Dao.findMoneyByLx(edu000.getEjdm());
            data1.add(count-countL);
            data2.add(countL);
            count = count-countL;
            Map map0 = new HashMap();
            map0.put("name",edu000.getEjdmz());
            map0.put("value",edu8001Dao.findCountByLx(edu000.getEjdm()));
            mapList.add(map0);
        }
        map.put("pieChart",mapList);
        mapAll = new HashMap();
        mapAll.put("dataName",data);
        mapAll.put("data1",data1);
        mapAll.put("data2",data2);
        map.put("histogram",mapAll);

        resultVO = ResultVO.setSuccess("共查询到"+edu8001List.size()+"条数据",map);
        return resultVO;
    }

    //批量删除财务信息详情
    public ResultVO deleteFinanceInfodetail(List<String> edu8001IdList) {
        ResultVO resultVO;
        edu8001Dao.deleteFinanceInfodetail(edu8001IdList);
        resultVO = ResultVO.setSuccess("删除了"+edu8001IdList.size()+"条信息");
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

    //获取大屏展示数据
    public ResultVO getBigScreenDataNew() {
        ResultVO resultVO;
        Map<String,Object> returnMap = new HashMap<>();
        //title:总人数
        //--------------------------------------------
        List<Map> titleList = new ArrayList<>();
        Map<String,Object> mapTitle = new HashMap<>();
        mapTitle.put("name","辽宁职业学院扩招学生总人数");
        Long allStudentCount = edu001Dao.findAllStudent();
        mapTitle.put("allStudent",allStudentCount);
        mapTitle.put("manStudent",edu001Dao.findAllStudentByXb("M"));
        mapTitle.put("womanStudent",edu001Dao.findAllStudentByXb("F"));
        titleList.add(mapTitle);
        List<Edu105> edu105List = edu105Dao.findAll();
        for(Edu105 edu105:edu105List){
            mapTitle = new HashMap<>();
            mapTitle.put("name",edu105.getNjmc()+"级总人数");
            mapTitle.put("allStudent",edu001Dao.findAllStudentByNj(edu105.getEdu105_ID()+""));
            mapTitle.put("manStudent",edu001Dao.findAllStudentByNj(edu105.getEdu105_ID()+"","M"));
            mapTitle.put("womanStudent",edu001Dao.findAllStudentByNj(edu105.getEdu105_ID()+"","F"));
            titleList.add(mapTitle);
        }
        returnMap.put("title",titleList);
        //--------------------------------------------
        // 图1：各个年级批次专业学生数量
        //--------------------------------------------
        Map<String,Object> map1 = new HashMap<>();
        //(获取学生年级和批次)
        List<Edu300> edu300List = edu300Dao.findAllXSLX();
        Object[] studentType = new Object[edu300List.size()];
        //获取专业信息
        List<Edu106> edu106List = edu106Dao.findAll();
        Object[] zyType = new Object[edu106List.size()];
        List<Object[]> countArray = new ArrayList<>();
        for (int i = 0;i<edu300List.size();i++){
            Edu300 edu300 = edu300List.get(i);
            studentType[i] = edu300.getNjmc()+"级"+edu300.getBatchName();
            Object[] studentCountArray = new Object[edu106List.size()];
            for (int j = 0;j<edu106List.size();j++){
                Edu106 edu106 = edu106List.get(j);
                if(i == 0){
                    zyType[j] = edu106.getZymc();
                }
                int studentCount = edu300Dao.findStudentCount(edu300.getNjbm(),edu300.getBatch(),edu106.getEdu106_ID()+"");
                studentCountArray[j] = studentCount;
            }
            countArray.add(studentCountArray);
        }
        map1.put("studentType",studentType);
        map1.put("zyType",zyType);
        map1.put("countArray",countArray);
        returnMap.put("echar1",map1);
        //--------------------------------------------
        // 图2：生源类型
        //--------------------------------------------
        List<Object[]> dataList = edu001Dao.getStudentByJob();
        EchartPO echartPO = new EchartPO();
        List<EchartPO> echartPOS = utils.castEntity(dataList, EchartPO.class, echartPO);
        returnMap.put("echar2",echartPOS);
        //--------------------------------------------
        // 图3：教学点人数
        //--------------------------------------------
        List<Map> studentsInLocal = getStudentsInLocalNew();
        returnMap.put("echar3",studentsInLocal);
        //--------------------------------------------
        // 图4：年龄雷达图
        //--------------------------------------------
        List<EchartPO> studentAgeData = getStudentsByAge();
        returnMap.put("echar4",studentAgeData);
        //--------------------------------------------
        // 图5：学生毕业人数
        //--------------------------------------------
        List<Map> echar5 = new ArrayList<>();
        for (int i = 0;i<edu300List.size();i++){
            Edu300 edu300 = edu300List.get(i);
            Map map5 = new HashMap();
            map5.put("name",edu300.getNjmc()+"级"+edu300.getBatchName());
            List data = new ArrayList();
            data.add(edu001Dao.findAllStudentByNjPc(edu300.getNjbm(),edu300.getBatch()));
            data.add(edu001Dao.findAllStudentByNjPcTOBY(edu300.getNjbm(),edu300.getBatch()));
            //查询预计毕业人数
            data.add(edu001Dao.findYJBYStudent(edu300.getNjbm(),edu300.getBatch()));
            map5.put("data",data);
            echar5.add(map5);
        }
        returnMap.put("echar5",echar5);
        //--------------------------------------------
        // 图6：学生就业信息
        //--------------------------------------------
        Map returnMap6 = new HashMap();
        List<Map> echar6 = new ArrayList<>();
        Map map6 = new HashMap();
        map6.put("name","学院扩招总体学生就业率");
        //毕业人数
        int biyeCount = edu001Dao.findAllStudentByNjPcTOBY();
        map6.put("allCount",biyeCount);
        String jyxx = edu0011Dao.findAllJYCount();
        map6.put("jyCount",Integer.parseInt(jyxx));
        returnMap6.put("all",map6);
        for (int i = 0;i<edu300List.size();i++){
            Edu300 edu300 = edu300List.get(i);
            map6 = new HashMap();
            map6.put("name",edu300.getNjmc()+"级"+edu300.getBatchName());
            biyeCount = Integer.parseInt(edu001Dao.findAllStudentByNjPcTOBY(edu300.getNjbm(),edu300.getBatch()));
            map6.put("allCount",biyeCount);
            jyxx = edu0011Dao.findAllJYCount(edu300.getNjbm(),edu300.getBatch());
            map6.put("jyCount",Integer.parseInt(jyxx));
            echar6.add(map6);
        }
        returnMap6.put("other",echar6);
        returnMap.put("echar6",returnMap6);
        //--------------------------------------------
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
    private List<Map> getStudentsInLocalNew(){
        List<Map> mapList = new ArrayList<>();
        List<Object[]> dataList  = edu202Dao.getStudentsInLocalByEdu300New();
        StudentInCityPO studentInCityPO = new StudentInCityPO();
        List<StudentInCityPO> newStudentInCityPO = utils.castEntity(dataList, StudentInCityPO.class, studentInCityPO);;
        for(StudentInCityPO s:newStudentInCityPO){
            List<Object[]> aaa  = edu202Dao.getStudentsInLocalByEdu300NewByCity(s.getCity());
            if(aaa.size() <= 5){
                Map<String,Object> returnMap = new HashMap<>();
                returnMap.put("title",s);
                StudentInPointPO studentInPointPO = new StudentInPointPO();
                List<StudentInPointPO> newStudentInPointPO = utils.castEntity(aaa, StudentInPointPO.class, studentInPointPO);
                returnMap.put("detail",newStudentInPointPO);
                mapList.add(returnMap);
            }else{
                List<List<Object[]>> bbb = utils.splitList2(aaa, 5);
                for(List<Object[]> e:bbb){
                    Map<String,Object> returnMap = new HashMap<>();
                    returnMap.put("title",s);
                    StudentInPointPO studentInPointPO = new StudentInPointPO();
                    List<StudentInPointPO> newStudentInPointPO = utils.castEntity(e, StudentInPointPO.class, studentInPointPO);
                    returnMap.put("detail",newStudentInPointPO);
                    mapList.add(returnMap);
                }
            }
        }
        return mapList;
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

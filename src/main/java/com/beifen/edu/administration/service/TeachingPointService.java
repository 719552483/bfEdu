package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.PO.SchoolTimetablePO;
import com.beifen.edu.administration.PO.YearSchedulePO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.ClassPeriodConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


//教学任务点业务层
@Service
public class TeachingPointService {

    @Autowired
    Edu500Dao edu500Dao;
    @Autowired
    Edu400Dao edu400Dao;
    @Autowired
    Edu200Dao edu200Dao;
    @Autowired
    Edu202Dao edu202Dao;
    @Autowired
    Edu203Dao edu203Dao;
    @Autowired
    Edu501Dao edu501Dao;
    @Autowired
    Edu502Dao edu502Dao;
    @Autowired
    YearScheduleViewDao yearScheduleViewDao;


    ReflectUtils utils = new ReflectUtils();

    /**
     * 检查同校区是否有重复教学点
     * @param edu500
     * @return
     */
    public  List<Edu500> checkRepeatPoint(Edu500 edu500){
        Specification<Edu500> specification = new Specification<Edu500>() {
            public Predicate toPredicate(Root<Edu500> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu500.getEdu500Id() != null && !"".equals(edu500.getEdu500Id())) {
                    predicates.add(cb.notEqual(root.<String> get("edu500Id"), edu500.getEdu500Id()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu500> edu500List = edu500Dao.findAll(specification);
        return edu500List;
    }

    /**
     *新增教学点
     * @param newSite
     */
    public ResultVO addSite(Edu500 newSite) {
        ResultVO resultVO;
//        // 判断同校区是否存在重复教学点
//        List<Edu500> edu500List = checkRepeatPoint(newSite);
        edu500Dao.save(newSite);
        resultVO = ResultVO.setSuccess("操作成功",newSite.getEdu500Id());
        return resultVO;
    }

    /**
     * 按条件检索教学点
     * @param edu500
     * @return
     */
    public ResultVO searchSite(Edu500 edu500) {
        ResultVO resultVO;
        Specification<Edu500> specification = new Specification<Edu500>() {
            public Predicate toPredicate(Root<Edu500> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu500.getLocalName() != null && !"".equals(edu500.getLocalName())) {
                    predicates.add(cb.like(root.<String> get("localName"), "%"+edu500.getLocalName()+"%"));
                }
                if (edu500.getCountry() != null && !"".equals(edu500.getCountry())) {
                    predicates.add(cb.like(root.<String> get("country"), "%"+edu500.getCountry()+"%"));
                }
                if (edu500.getCityCode() != null && !"".equals(edu500.getCityCode())) {
                    predicates.add(cb.equal(root.<String> get("cityCode"), edu500.getCityCode()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu500> edu500s = edu500Dao.findAll(specification);

        if(edu500s.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的教学点",edu500s);
            return resultVO;
        }

        List<Long> edu500Ids = edu500s.stream().map(Edu500::getEdu500Id).collect(Collectors.toList());

        List<Edu500> edu500List = edu500Dao.findAllByEdu500Ids(edu500Ids);

        if(edu500List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的教学点",edu500List);
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu500List.size()+"个教学点",edu500List);
        }
        return resultVO;
    }

    //根据校区编码查询教学点
    public List<Edu500> querySiteBySsxqCode() {
        return edu500Dao.findAll();
    }

    //查询教学点是否被占用
    public boolean checkIsUsed(String edu500Id) {
        boolean isUsed=false;
        List<Edu500> siteList =edu500Dao.checkIsUsed(edu500Id);
        if(siteList.size()>0){
            isUsed=true;
        }
        return isUsed;
    }

    //删除教学点
    public ResultVO removeSite(List<String> deleteArray) {
        ResultVO resultVO;
        for (String s : deleteArray) {
            edu500Dao.removeSite(s);
        }
        resultVO = ResultVO.setSuccess("成功删除了"+deleteArray.size()+"个教学点");
        return resultVO;
    }

    //教学点使用率查询
    public ResultVO searchLocalUsed(LocalUsedPO localUsedPO) {
        ResultVO resultVO;
        Edu500 edu500 = new Edu500();
        edu500.setCityCode(localUsedPO.getCityCode());
        edu500.setLocalName(localUsedPO.getLocalName());
        ResultVO searchResult = searchSite(edu500);
        if(searchResult.getCode() == 500) {
            resultVO = ResultVO.setFailed("暂无符合要求的教学点");
            return resultVO;
        }
        List<Edu500> edu500List = (List<Edu500>) searchResult.getData();

        Specification<Edu501> specification = new Specification<Edu501>() {
            public Predicate toPredicate(Root<Edu501> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (localUsedPO.getPointName() != null && !"".equals(localUsedPO.getPointName())) {
                    predicates.add(cb.like(root.<String> get("pointName"), "%"+localUsedPO.getPointName()+"%"));
                }
                Path<Object> path = root.get("edu500Id");//定义查询的字段
                CriteriaBuilder.In<Object> in = cb.in(path);
                for (int i = 0; i <edu500List.size() ; i++) {
                    in.value(edu500List.get(i).getEdu500Id());//存入值
                }
                predicates.add(cb.and(in));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu501> siteList = edu501Dao.findAll(specification);

        if(siteList.size() == 0){
            resultVO = ResultVO.setFailed("暂无符合要求的教学点");
            return resultVO;
        }

        List<Long> edu501Ids=siteList.stream().map(Edu501::getEdu501Id).collect(Collectors.toList());
        List<LocalUsedPO> localUsedPOS = edu501Dao.findLocalUsedPOBy501Ids(edu501Ids);

        //查找学年总周数
        int weeks = Integer.parseInt(edu400Dao.getWeekByYear(localUsedPO.getAcademicYearId()));
        //Integer countUsed = weeks * 6;
        Integer countUsed = edu203Dao.findEdu203IdsByxnid(localUsedPO.getAcademicYearId());
        for (LocalUsedPO e : localUsedPOS) {
            List<Edu203> edu203s = edu203Dao.findEdu203IdsByEdu501Id(e.getEdu501Id().toString(),localUsedPO.getAcademicYearId());
            if(edu203s.size() != 0){
                double v = edu203s.size() / Double.parseDouble(countUsed.toString());
                NumberFormat nf = NumberFormat.getPercentInstance();
                nf.setMinimumFractionDigits(2);//设置保留小数位
                String usedPercent = nf.format(v);
                e.setSiteUtilization(usedPercent);
            } else {
                e.setSiteUtilization("0.00%");
            }
        }

        resultVO = ResultVO.setSuccess("共找到"+localUsedPOS.size()+"个教学点",localUsedPOS);

        return resultVO;
    }


    //新增教学任务点
    public ResultVO addLocalPointInfo(Edu501 edu501) {
        ResultVO resultVO;
        edu501Dao.save(edu501);
        resultVO = ResultVO.setSuccess("操作成功",edu501.getEdu501Id());
        return resultVO;
    }



    //搜索教学任务点
    public ResultVO searchPointInfo(Edu501 edu501) {
        ResultVO resultVO;
        Specification<Edu501> specification = new Specification<Edu501>() {
            public Predicate toPredicate(Root<Edu501> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu501.getPointName() != null && !"".equals(edu501.getPointName())) {
                    predicates.add(cb.like(root.<String> get("pointName"), "%"+edu501.getPointName()+"%"));
                }
                if (edu501.getEdu500Id() != null && !"".equals(edu501.getEdu500Id())) {
                    predicates.add(cb.equal(root.<String> get("edu500Id"), edu501.getEdu500Id()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu501> pointList = edu501Dao.findAll(specification);

        if(pointList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的教学任务点",pointList);
        } else {
            resultVO = ResultVO.setSuccess("共找到"+pointList.size()+"个教学任务点",pointList);
        }
        return resultVO;
    }


    //删除教学任务点
    public ResultVO removePoint(List<String> deleteArray) {
        ResultVO resultVO;
        for (String s : deleteArray) {
            edu501Dao.removeSite(s);
        }
        resultVO = ResultVO.setSuccess("成功删除了"+deleteArray.size()+"个教学点");
        return resultVO;
    }


    //根据教学点查询教学任务点
    public ResultVO getPointBySite(String edu500Id) {
        ResultVO resultVO;
        List<Edu501> pointList = edu501Dao.findAllByEdu501Id(edu500Id);

        if(pointList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无教学任务点",pointList);
        } else {
            resultVO = ResultVO.setSuccess("共找到"+pointList.size()+"个教学任务点",pointList);
        }
        return resultVO;
    }

    //根据教学点查询固定资产
    public ResultVO getLocalAssets(String edu500Id) {
        ResultVO resultVO;
        List<Edu502> edu502List = edu502Dao.findAllByEdu500Id(Long.parseLong(edu500Id));

        if(edu502List.size() == 0) {
            resultVO = ResultVO.setFailed("该教学点未录入物资信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu502List);
        }

        return resultVO;
    }

    //根据教学任务点查询固定资产
    public ResultVO getLocalPoingAssets(String edu501Id) {
        ResultVO resultVO;
        List<Edu502> edu502List = edu502Dao.findAllByEdu501Id(edu501Id);

        if(edu502List.size() == 0) {
            resultVO = ResultVO.setFailed("该教学点未录入物资信息");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu502List);
        }

        return resultVO;
    }


    //保存教学任务点物资信息
    public ResultVO saveAssets(List<Edu502> edu502List) {
        ResultVO resultVO;
        List<Long> edu501Ids = edu502List.stream().map(Edu502::getEdu501Id).collect(Collectors.toList());
        edu502Dao.deleteByEdu501Ids(edu501Ids);

        for (Edu502 edu502 : edu502List) {
            edu502Dao.save(edu502);
        }

        resultVO = ResultVO.setSuccess("固定资产更新成功");

        return resultVO;
    }

    //搜索全部教学点
    public ResultVO searchAllLocal() {
        ResultVO resultVO;
        List<Edu500> edu500List = edu500Dao.findAll();
        if(edu500List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无教学点信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu500List.size()+"个教学点",edu500List);
        }
        return resultVO;
    }

    //查询教学任务点
    public List<LocalUsedPO> queryPointByCity(String city) {
        List<LocalUsedPO> list;
        if(city != null && !"".equals(city)){
            list = edu501Dao.exportPointByCity(city);
        }else{
            list = edu501Dao.exportPointByCity2();
        }

        return list;
    }



    //导出教学任务点excel
    /*public XSSFWorkbook exportPointByCity(List<LocalUsedPO> list, int size) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("已选成绩详情");

        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cells[] = new XSSFCell[1];
        // 所有标题数组
        String[] titles = new String[]{"教学点名称", "地级市", "区/县", "详细地址", "任务点名称", "可容纳人数"};

        // 循环设置标题
        for (int i = 0; i < titles.length; i++) {
            cells[0] = firstRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }

        for (int i = 0; i < list.size(); i++) {
            utils.appendCell(sheet, i, "", edu0051List.get(i).getXn(), -1, 0, false);
            utils.appendCell(sheet, i, "", edu0051List.get(i).getClassName(), -1, 1, false);
            utils.appendCell(sheet, i, "", edu0051List.get(i).getCourseName(), -1, 2, false);
            utils.appendCell(sheet, i, "", edu0051List.get(i).getStudentName(), -1, 3, false);
            utils.appendCell(sheet, i, "", edu0051List.get(i).getStudentCode(), -1, 4, false);
            utils.appendCell(sheet, i, "", edu0051List.get(i).getIsExamCrouse(), -1, 6, false);

//			utils.appendCell(sheet,i,"",edu0051List.get(i).getGrade(),-1,6,false);
//			if(edu0051List.get(i).getExam_num() == 0){
//				utils.appendCell(sheet,i,"","正考成绩",-1,7,false);
//			}else{
//				utils.appendCell(sheet,i,"","第"+edu0051List.get(i).getExam_num()+"次补考成绩",-1,7,false);
//			}
        }

        sheet.setColumnWidth(0, 12 * 256);
        sheet.setColumnWidth(1, 16 * 256);
        sheet.setColumnWidth(2, 30 * 256);
        sheet.setColumnWidth(3, 10 * 256);
        sheet.setColumnWidth(4, 20 * 256);
        sheet.setColumnHidden((short) 6, true);
        return workbook;
    }*/


    //根据教学任务点查询固定资产
    public ResultVO searchCourseDetailByXNAndPointid(String term,String pointId) {
        ResultVO resultVO;

        Specification<YearSchedulePO> specification = new Specification<YearSchedulePO>() {
            public Predicate toPredicate(Root<YearSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (term != null && !"".equals(term)) {
                    predicates.add(cb.equal(root.<String>get("xnid"),  term));
                }
                if (pointId != null && !"".equals(pointId)) {
                    predicates.add(cb.equal(root.<String>get("pointId"),  pointId));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
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
//            resultVO = ResultVO.setSuccess("当前学年共找到"+yearSchedulePOS.size()+"个课程",timeTablePackage(schoolTimetableList));
            resultVO = ResultVO.setSuccess("当前学年共找到"+yearSchedulePOS.size()+"个课程",yearSchedulePOS);
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
        map1.put("classPeriod", ClassPeriodConstant.SECTION_ONE);
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

}

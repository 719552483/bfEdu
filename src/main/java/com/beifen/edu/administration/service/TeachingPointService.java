package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.PO.SchoolTimetablePO;
import com.beifen.edu.administration.PO.YearSchedulePO;
import com.beifen.edu.administration.PO.YearSchedulePO2;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.ClassPeriodConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.DateUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.*;
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
        Long id  = newSite.getEdu500Id();
        if (id != null){
            Edu500 edu500Old = edu500Dao.findOne(id);
            if(!edu500Old.getLocalName().equals(newSite.getLocalName())){
                edu203Dao.updateLocalName(id,newSite.getLocalName());
            }
        }
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
        Long id  = edu501.getEdu501Id();
        if (id != null){
            Edu501 edu501Old = edu501Dao.findOne(id);
            if(!edu501Old.getPointName().equals(edu501.getPointName())){
                edu203Dao.updatePointName(id,edu501.getPointName());
            }
        }
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
    public List<Edu500> queryPointByCity(String city) {
        List<Edu500> list;
        if(city != null && !"".equals(city)){
            list = edu500Dao.exportPointByCity(city);
        }else{
            list = edu500Dao.findAll();
        }

        return list;
    }



    //导出教学任务点excel
    public XSSFWorkbook exportPointByCity(List<Edu500> list,List<String> titleList) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("教学点详情合并导出");

        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cells[] = new XSSFCell[1];
        // 所有标题数组
//        String[] titles = new String[]{"教学点名称", "地级市", "区/县", "详细地址","任务点个数","教学点备注", "教学任务点名称", "可容纳人数","场地平均使用率","教学任务点备注","物资详情","排课信息"};

        String[] titles = titleList.toArray(new String[titleList.size()]);

        // 循环设置标题
        for (int i = 0; i < titles.length; i++) {
            cells[0] = firstRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }
        //控制行数
        int j = 0;
        for (int i = 0; i < list.size(); i++) {
            //控制列数
            int k = 0;
            Edu500 edu500 = list.get(i);
            utils.appendCell(sheet, j, "", edu500.getLocalName(), -1, k, false);k++;
            utils.appendCell(sheet, j, "", list.get(i).getCity(), -1, k, false);k++;
            utils.appendCell(sheet, j, "", list.get(i).getCountry(), -1, k, false);k++;
            if(titleList.contains("详细地址")){
                utils.appendCell(sheet, j, "", list.get(i).getCountry(), -1, k, false);k++;
            }
            List<Edu501> edu501List = edu501Dao.findAllByEdu501Id(edu500.getEdu500Id()+"");
            if(titleList.contains("任务点个数")){
                utils.appendCell(sheet, j, "", edu501List.size()+"个", -1, k, false);k++;
            }
            if(titleList.contains("教学点备注")){
                utils.appendCell(sheet, j, "", list.get(i).getRemarks(), -1, k, false);k++;
            }
            if(edu501List.size() == 0){
                //直接换行
                j++;
            }
            for (int ii = 0;ii<edu501List.size();ii++){
                int kk = 0;
                Edu501 edu501 = edu501List.get(ii);
                utils.appendCell(sheet, j, "", (ii+1)+"."+edu501.getPointName(), -1, k+kk, false);kk++;
                if(titleList.contains("可容纳人数")){
                    utils.appendCell(sheet, j, "", edu501.getCapacity()+"人", -1, k+kk, false);kk++;
                }
                Integer countAll = edu203Dao.findEdu203Count();
                Integer countUsed = edu203Dao.findEdu203CountByEdu501Id(edu501.getEdu501Id()+"");
                if(titleList.contains("场地平均使用率")){
                    //计算平均使用率
                    if(countUsed != 0){
                        double v = Double.parseDouble(countUsed.toString()) / Double.parseDouble(countAll.toString());
                        NumberFormat nf = NumberFormat.getPercentInstance();
                        nf.setMinimumFractionDigits(2);//设置保留小数位
                        String usedPercent = nf.format(v);
                        utils.appendCell(sheet, j, "", usedPercent, -1, k+kk, false);kk++;
                    } else {
                        utils.appendCell(sheet, j, "", "0.00%", -1, k+kk, false);kk++;
                    }
                }
                if(titleList.contains("教学任务点备注")){
                    utils.appendCell(sheet, j, "", edu501.getRemarks(), -1, k+kk, false);kk++;
                }
                if(titleList.contains("物资详情")){
                    List<Edu502> edu502List = edu502Dao.findAllByEdu501Id(edu501.getEdu501Id()+"");
                    ArrayList<String> arrayList = new ArrayList<String>();
                    for (int iii = 0;iii<edu502List.size();iii++){
                        arrayList.add(edu502List.get(iii).getAssetsName()+":"+edu502List.get(iii).getAssetsNum());
                    }
                    CellStyle cs = workbook.createCellStyle();
                    cs.setWrapText(true);
                    String content = String.join("\n", arrayList);
                    utils.appendCell(sheet, j, "", content, -1, k+kk, false,cs);kk++;
                }
                if(titleList.contains("排课信息")){
                    utils.appendCell(sheet, j, "", "共排"+countUsed+"节课", -1, k+kk, false);kk++;
                }
                j++;
            }
        }
        int k = 0;
        sheet.setColumnWidth(k, 20 * 256);k++;
        sheet.setColumnWidth(k, 20 * 256);k++;
        sheet.setColumnWidth(k, 20 * 256);k++;
        if(titleList.contains("详细地址")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        if(titleList.contains("任务点个数")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        if(titleList.contains("教学点备注")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        sheet.setColumnWidth(k, 20 * 256);k++;
        if(titleList.contains("可容纳人数")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        if(titleList.contains("场地平均使用率")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        if(titleList.contains("教学任务点备注")){
            sheet.setColumnWidth(k, 30 * 256);k++;
        }
        if(titleList.contains("物资详情")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        if(titleList.contains("排课信息")){
            sheet.setColumnWidth(k, 20 * 256);k++;
        }
        return workbook;
    }


    //根据教学任务点查询固定资产
    public ResultVO searchCourseDetailByXNAndPointid(String term,String pointId) {
        ResultVO resultVO;
        Edu400 edu400 = edu400Dao.findOne(Long.parseLong(term));
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
        List<YearSchedulePO2> yearSchedulePOS = replaceSchedule(yearSchedules,edu400.getKssj());
        if(yearSchedulePOS.size() == 0) {
            resultVO = ResultVO.setFailed("当前学年找到您的课程");
        } else {
//            for (YearSchedulePO o : yearSchedulePOS) {
//                SchoolTimetablePO s = new SchoolTimetablePO();
//                try {
//                    utils.copyParm(o,s);
//                    schoolTimetableList.add(s);
//                } catch (NoSuchMethodException e) {
//                    e.printStackTrace();
//                } catch (IllegalAccessException e) {
//                    e.printStackTrace();
//                } catch (InvocationTargetException e) {
//                    e.printStackTrace();
//                }
//            }
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
    private List<YearSchedulePO2> replaceSchedule(List<YearSchedulePO> yearSchedules,String date) {
        List<YearSchedulePO2> newList = new ArrayList<>();

        try {
            int weekOfDate = DateUtils.getWeekOfDate(date);
            String endDate;
            if(weekOfDate == 0) {
                endDate = date;
            } else {
                endDate = DateUtils.getCalculateDateToString(date, 7-weekOfDate);
            }
            String countDate = DateUtils.getCalculateDateToString(endDate, 1);
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
                List<String> dateList = new ArrayList<>();
                for (YearSchedulePO e : orderList) {
                    if (e.getKsz().equals(e.getJsz())) {
                        ssz.add("第"+e.getKsz()+"周");
                        int xq = Integer.parseInt(e.getXqid());
                        int ksz = Integer.parseInt(e.getKsz());
                        String dateOne = DateUtils.getCalculateDateToString(countDate, 7*(ksz-2)+xq-1);
                        dateList.add(dateOne);
                    } else {
                        ssz.add("第"+e.getKsz()+"-"+e.getJsz()+"周");
                        for(int z = Integer.parseInt(e.getKsz());z<=Integer.parseInt(e.getJsz());z++){
                            int xq = Integer.parseInt(e.getXqid());
                            String dateOne = DateUtils.getCalculateDateToString(countDate, 7*(z-2)+xq-1);
                            dateList.add(dateOne);
                        }
                    }
                }
                YearSchedulePO addInfo = orderList.get(0);
                addInfo.setSzz(utils.listToString(ssz,','));
                YearSchedulePO2 s = new YearSchedulePO2();
                utils.copyParm(addInfo,s);
                s.setDate(utils.listToString(dateList,','));
                newList.add(s);
                i += orderList.size()-1;
            }
        }catch (Exception e){
            e.printStackTrace();
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

package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.Edu203;
import com.beifen.edu.administration.domian.Edu500;
import com.beifen.edu.administration.domian.Edu501;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
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
                if (edu500.getTownShip() != null && !"".equals(edu500.getTownShip())) {
                    predicates.add(cb.like(root.<String> get("townShip"), "%"+edu500.getTownShip()+"%"));
                }
                if (edu500.getCityCode() != null && !"".equals(edu500.getCityCode())) {
                    predicates.add(cb.equal(root.<String> get("cityCode"), edu500.getCityCode()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu500> teacherEntities = edu500Dao.findAll(specification);

        if(teacherEntities.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的教学点",teacherEntities);
        } else {
            resultVO = ResultVO.setSuccess("共找到"+teacherEntities.size()+"个教学点",teacherEntities);
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
        Integer countUsed = weeks * 6;
        for (LocalUsedPO e : localUsedPOS) {
            List<String> edu202Ids = edu202Dao.findEdu202IdsByEdu501Id(e.getEdu501Id().toString());
            if(edu202Ids.size() != 0){
                List<Edu203> usedList = edu203Dao.findAllbyEdu202Ids(edu202Ids);
                double v = usedList.size() / Double.parseDouble(countUsed.toString());
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


    //新增叫教学任务点
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
}

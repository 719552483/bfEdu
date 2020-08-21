package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu200Dao;
import com.beifen.edu.administration.dao.Edu203Dao;
import com.beifen.edu.administration.dao.Edu400Dao;
import com.beifen.edu.administration.dao.Edu500Dao;
import com.beifen.edu.administration.domian.Edu203;
import com.beifen.edu.administration.domian.Edu500;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.lang.reflect.InvocationTargetException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;


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
    Edu203Dao edu203Dao;

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
                if (edu500.getSsxqCode() != null && !"".equals(edu500.getSsxqCode())) {
                    predicates.add(cb.equal(root.<String> get("ssxqCode"), edu500.getSsxqCode()));
                }
                if (edu500.getJxdmc() != null && !"".equals(edu500.getJxdmc())) {
                    predicates.add(cb.equal(root.<String> get("jxdmc"), edu500.getJxdmc()));
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
        // 判断同校区是否存在重复教学点
        List<Edu500> edu500List = checkRepeatPoint(newSite);
        if (edu500List.size() != 0) {
            resultVO = ResultVO.setFailed("该校区存在相同教学任务点，请重新录入");
        } else {
            edu500Dao.save(newSite);
            resultVO = ResultVO.setSuccess("操作成功",newSite.getEdu500Id());
        }
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
                if (edu500.getJxdmc() != null && !"".equals(edu500.getJxdmc())) {
                    predicates.add(cb.like(root.<String> get("jxdmc"),'%' + edu500.getJxdmc() + '%'));
                }
                if (edu500.getSsxq() != null && !"".equals(edu500.getSsxq())) {
                    predicates.add(cb.equal(root.<String> get("ssxq"),edu500.getSsxq()));
                }
                if (edu500.getCdlx() != null && !"".equals(edu500.getCdlx())) {
                    predicates.add(cb.equal(root.<String> get("cdlx"),edu500.getCdlx()));
                }
                if (edu500.getCdxz() != null && !"".equals(edu500.getCdxz())) {
                    predicates.add(cb.equal(root.<String> get("cdxz"),edu500.getCdxz()));
                }
                if (edu500.getLc() != null && !"".equals(edu500.getLc())) {
                    predicates.add(cb.equal(root.<String> get("lc"),edu500.getLc()));
                }
                if (edu500.getLf() != null && !"".equals(edu500.getLf())) {
                    predicates.add(cb.equal(root.<String> get("lf"),edu500.getLf()));
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
    public List<Edu500> querySiteBySsxqCode(String xqCode) {
        return edu500Dao.querySiteBySsxqCode(xqCode);
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
            boolean isUsed = checkIsUsed(s);
            if (isUsed) {
                resultVO = ResultVO.setFailed("存在教学点被占用，无法进行删除操作");
                return resultVO;
            }
        }

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
        try {
            utils.copy(localUsedPO,edu500);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        List<Edu500> siteList =(List<Edu500>) searchSite(edu500).getData();

        if(siteList.size() == 0){
            resultVO = ResultVO.setFailed("暂无符合要求的教学点");
            return resultVO;
        }

        //查找学年总周数
        int weeks = Integer.parseInt(edu400Dao.getWeekByYear(localUsedPO.getAcademicYearId()));
        Integer countUsed = weeks * 12;
        List<LocalUsedPO> localUsedPOList = new ArrayList<>();
        for (Edu500 e : siteList) {
            LocalUsedPO save = new LocalUsedPO();
            List<String> edu202Ids = edu200Dao.findIdByJxdmc(e.getJxdmc());
            if(edu202Ids.size() != 0){
                List<Edu203> usedList = edu203Dao.findAllbyEdu202Ids(edu202Ids);
                NumberFormat nf = NumberFormat.getPercentInstance();
                nf.setMinimumFractionDigits(2);//设置保留小数位
                String usedPercent = nf.format(usedList.size() / countUsed);
                save.setSiteUtilization(usedPercent);
            } else {
                save.setSiteUtilization("0.00%");
            }
            try {
                utils.copyTargetSuper(e,save);
            } catch (NoSuchMethodException noSuchMethodException) {
                noSuchMethodException.printStackTrace();
            } catch (IllegalAccessException illegalAccessException) {
                illegalAccessException.printStackTrace();
            } catch (InvocationTargetException invocationTargetException) {
                invocationTargetException.printStackTrace();
            }
            localUsedPOList.add(save);
        }

        resultVO = ResultVO.setSuccess("共找到"+localUsedPOList.size()+"个教学点",localUsedPOList);

        return resultVO;
    }
}
package com.beifen.edu.administration.service;


import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu800Dao;
import com.beifen.edu.administration.domian.Edu800;
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


/**
 * 大数据业务层
 */
@Configuration
@Service
public class BigDataService {

    @Autowired
    private Edu800Dao edu800Dao;

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
}

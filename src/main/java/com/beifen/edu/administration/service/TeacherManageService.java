package com.beifen.edu.administration.service;


import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu101Dao;
import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu112;
import com.beifen.edu.administration.domian.Edu600;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

//教职工管理业务层
@Service
public class TeacherManageService {

    @Autowired
    Edu101Dao edu101Dao;


    public ResultVO searchTeachersInService(Edu101 edu101) {
        ResultVO resultVO;
        Specification<Edu101> specification = new Specification<Edu101>() {
            public Predicate toPredicate(Root<Edu101> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu101.getSzxb() != null && !"".equals(edu101.getSzxb())) {
                    predicates.add(cb.equal(root.<String> get("szxb"),edu101.getSzxb()));
                }
                if (edu101.getZy() != null && !"".equals(edu101.getZy())) {
                    predicates.add(cb.equal(root.<String> get("zy"),edu101.getZy()));
                }
                if (edu101.getXm() != null && !"".equals(edu101.getXm())) {
                    predicates.add(cb.like(root.<String> get("xm"), '%' + edu101.getXm() + '%'));
                }
                if (edu101.getJzgh() != null && !"".equals(edu101.getJzgh())) {
                    predicates.add(cb.like(root.<String> get("jzgh"), '%' + edu101.getJzgh() + '%'));
                }
                if (edu101.getSzxbmc() != null && !"".equals(edu101.getSzxbmc())) {
                    predicates.add(cb.like(root.<String> get("szxbmc"), '%' + edu101.getSzxbmc() + '%'));
                }
                if (edu101.getZc() != null && !"".equals(edu101.getZc())) {
                    predicates.add(cb.equal(root.<String> get("zc"),edu101.getZc()));
                }
                predicates.add(cb.notEqual(root.<String> get("wpjzgspzt"),"passing"));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu101> teacherList = edu101Dao.findAll(specification);

        resultVO = ResultVO.setSuccess("共搜索到"+teacherList.size()+"个教师",teacherList);

        return resultVO;
    }

    public ResultVO addTeacherBusiness(Edu112 edu112, Edu600 edu600) {
        ResultVO resultVO = new ResultVO();

        return resultVO;
    }
}

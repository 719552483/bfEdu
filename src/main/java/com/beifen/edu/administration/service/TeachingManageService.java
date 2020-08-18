package com.beifen.edu.administration.service;


import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

//教务管理业务层
@Service
public class TeachingManageService {

    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    Edu112Dao edu112Dao;
    @Autowired
    Edu113Dao edu113Dao;
    @Autowired
    ApprovalProcessService approvalProcessService;

    /**
     * 搜索在职教师
     * @param edu101
     * @return
     */
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
                Predicate predicate1 = cb.notEqual(root.<String>get("wpjzgspzt"), "passing");
                Predicate predicate2 = cb.isNull(root.<String>get("wpjzgspzt"));
                predicates.add(cb.or(predicate1, predicate2));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu101> teacherList = edu101Dao.findAll(specification);

        if(teacherList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合要求的教师");
        } else {
            resultVO = ResultVO.setSuccess("共搜索到"+teacherList.size()+"个教师",teacherList);
        }

        return resultVO;
    }

    /**
     * 教师出差申请
     * @param edu112
     * @param edu600
     * @return
     */
    public ResultVO addTeacherBusiness(Edu112 edu112, Edu600 edu600) {
        ResultVO resultVO;

        String userName = edu992Dao.getTeacherNameByEdu990Id(edu112.getEdu990_ID().toString());

        edu112.setUserName(userName);
        edu112.setBusinessState("passing");
        edu112Dao.save(edu112);
        if(edu112.getEdu112_ID() == null) {
            resultVO = ResultVO.setFailed("出差申请失败，请检查申请信息");
            return resultVO;
        }

        String[] teacherIds = edu112.getTeacherId().split(",");
        String[] teacherNames = edu112.getTeacherName().split(",");

        edu113Dao.delteByEdu112Id(edu112.getEdu112_ID().toString());

        for (int i = 0; i <teacherIds.length; i++) {
            Edu113 save = new Edu113();
            save.setEdu112_ID(edu112.getEdu112_ID());
            save.setEud101_ID(Long.parseLong(teacherIds[i]));
            save.setTeacherName(teacherNames[i]);
            edu113Dao.save(save);
        }

        approvalProcessService.initiationProcess(edu600);
        resultVO = ResultVO.setSuccess("出差申请成功");

        return resultVO;
    }

    /**
     * 出差申请查询
     * @param edu112
     * @return
     */
    public ResultVO searchTeacherBusiness(Edu112 edu112) {
        ResultVO resultVO;
        Specification<Edu112> specification = new Specification<Edu112>() {
            public Predicate toPredicate(Root<Edu112> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu112.getUserName() != null && !"".equals(edu112.getUserName())) {
                    predicates.add(cb.equal(root.<String> get("zc"),edu112.getUserName()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu112> resultList = edu112Dao.findAll(specification);

        if (resultList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无符合条件的出差申请");
            return resultVO;
        } else {
            resultVO = ResultVO.setSuccess("共找到"+resultList.size()+"条出差申请");
        }

        return resultVO;
    }
}

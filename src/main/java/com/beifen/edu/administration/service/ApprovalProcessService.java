package com.beifen.edu.administration.service;

import com.beifen.edu.administration.BO.Edu600BO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * 审批流程事务控制层
 */
@Configuration
@Service
public class ApprovalProcessService {

    @Autowired
    private Edu600Dao edu600DAO;
    @Autowired
    private Edu602Dao edu602Dao;
    @Autowired
    private Edu601Dao edu601Dao;
    @Autowired
    private Edu990Dao edu990Dao;
    @Autowired
    private Edu000Dao edu000Dao;

    public boolean initiationProcess(Edu600 edu600) {
        boolean isSuccess = false;
        //保存审批信息
        Edu600 newEdu600 = edu600DAO.save(edu600);
        //开始流转
        isSuccess = processFlow(newEdu600);

        return isSuccess;

    }

    private boolean processFlow(Edu600 edu600) {
        //准备审批历史记录类和成功标识
        Edu601 edu601 = new Edu601();
        boolean isSuccess = true;
        //获取审批信息
        String businessType = edu600.getBusinessType();//业务类型
        Long lastRole = edu600.getLastRole();//上一步审批人

        //复制属性
        try {
            BeanUtils.copyProperties(edu601, edu600);
            edu601.setUpdateDate(new Date());
            edu601.setCurrentPeople(edu600.getExaminerkey());
            edu601Dao.save(edu601);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }


        //根据审批信息查找流转节点
        Edu602 edu602 = edu602Dao.selectNextRole(businessType, lastRole.toString());
        if(edu602 == null) {
            isSuccess =  false;
        } else {
            edu600.setLastRole(edu600.getCurrentRole());
            edu600.setCurrentRole(edu602.getNextRole());
            edu600.setLastRole(edu602.getCurrentRole());
            edu600.setApprovalState("1");
            edu600.setUpdateDate(new Date());
            //更新审批信息
            edu600DAO.save(edu600);
        }

        return isSuccess;
    }

    /**
     * 搜索审批信息
     * @param edu600BO
     * @return
     */
    public List<Edu600BO> searchApproval(Edu600BO edu600BO) {
        Edu600 edu600 = new Edu600();
        List<Edu600BO> approvalExList = new ArrayList<>();

        try {
            //复制属性并赋值新属性
            BeanUtils.copyProperties(edu600,edu600BO);

            //赋值查询条件
            edu600.setCurrentRole(edu600BO.getCurrentUserRole());

            Specification<Edu600> specification = new Specification<Edu600>() {
                public Predicate toPredicate(Root<Edu600> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    if (edu600.getCurrentRole() != null && !"".equals(edu600.getCurrentRole())) {
                        predicates.add(cb.equal(root.<String> get("pycc"), edu600.getCurrentRole()));
                    }
                    if (edu600.getBusinessType() != null && !"".equals(edu600.getBusinessType())) {
                        predicates.add(cb.equal(root.<String> get("szxb"), edu600.getBusinessType()));
                    }
                    if (edu600.getProposerKey() != null && !"".equals(edu600.getProposerKey())) {
                        predicates.add(cb.equal(root.<String> get("szxb"), edu600.getProposerKey()));
                    }
                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };

            List<Edu600> aprovalList = edu600DAO.findAll(specification);

            for (Edu600 e :  aprovalList) {
                Edu600BO approvalEx = new Edu600BO();
                //赋值已有属性
                BeanUtils.copyProperties(approvalEx,e);
                //查询申请人信息
                Edu990 proposer = edu990Dao.queryUserById(e.getProposerKey().toString());
                approvalEx.setProposerName(proposer.getYhm());
                //获取上一步审批人信息
                Edu990 lastPerson = edu990Dao.queryUserById(e.getLastExaminerKey().toString());
                approvalEx.setLastPersonName(lastPerson.getYhm());
                //获取业务类型信息
                String splx = edu000Dao.queryEjdmByEjdmZ(e.getBusinessType(), "splx");
                approvalEx.setBusinessName(splx);
                //将封装数据加入数组
                approvalExList.add(approvalEx);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return approvalExList;

    }
}

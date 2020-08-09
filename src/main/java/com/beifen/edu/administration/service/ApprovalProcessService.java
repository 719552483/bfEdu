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

    /**
     * 发起审批流程
     * @param edu600
     * @return
     */
    public boolean initiationProcess(Edu600 edu600) {
        boolean isSuccess;
        edu600.setCurrentRole(edu600.getProposerType());
        edu600.setExaminerkey(edu600.getProposerKey());
        edu600.setApprovalState("0");
        edu600.setCreatDate(new Date());
        edu600.setUpdateDate(new Date());

        //保存审批信息
        Edu600 newEdu600 = edu600DAO.save(edu600);
        //保存历史审批记录
        saveApprovalHistory(edu600, "0");
        //进入流转将当前节点变为下一节点
        edu600.setLastRole(edu600.getProposerType());
        edu600.setLastExaminerKey(edu600.getProposerKey());
        //开始流转
        isSuccess = processFlow(newEdu600, "1");

        return isSuccess;

    }

    /**
     *
     * @param edu600
     * @param approvalFlag
     * @return
     */
    public boolean saveApprovalHistory(Edu600 edu600,String approvalFlag) {
        //初始化成功标识和审批历史记录实体类
        boolean isSuccess = true;
        Edu601 edu601 = new Edu601();

        //复制属性并存储历史审批记录
        try {
            BeanUtils.copyProperties(edu601, edu600);
            edu601.setUpdateDate(new Date());
            edu601.setApprovalResult(approvalFlag);
            Edu601 save = edu601Dao.save(edu601);
            if(save == null) {
                isSuccess = false;
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        return isSuccess;

    }

    /**
     * 审批流转控制
     * @param edu600
     * @param approvalFlag
     * @return
     */
    private boolean processFlow(Edu600 edu600, String approvalFlag) {
        //初始化成功标识
        boolean isSuccess = true;
        //获取审批信息
        String businessType = edu600.getBusinessType();//业务类型
        Long lastRole = edu600.getLastRole();//上一步审批人

       if("1".equals(approvalFlag)){
            //根据审批信息查找流转节点
            Edu602 edu602 = edu602Dao.selectNextRole(businessType, lastRole.toString());
            if(edu602 == null) {
                isSuccess =  false;
            } else {
                //更新同意审批信息
                edu600.setCurrentRole(edu602.getNextRole());
                edu600.setLastRole(edu602.getCurrentRole());
                edu600.setApprovalState("1");
                edu600.setLastApprovalOpinions(edu600.getApprovalOpinions());
                edu600.setApprovalOpinions("");
                edu600.setUpdateDate(new Date());
                Edu600 save = edu600DAO.save(edu600);
                if(save == null){
                    isSuccess = false;
                }
            }
        } else if("2".equals(approvalFlag)) {
            //更新不同意审批信息
            edu600.setCurrentRole(edu600.getProposerType());
            edu600.setLastRole(edu600.getCurrentRole());
            edu600.setApprovalState("2");
            edu600.setLastApprovalOpinions(edu600.getApprovalOpinions());
            edu600.setApprovalOpinions("");
            edu600.setUpdateDate(new Date());
            Edu600 save = edu600DAO.save(edu600);
            if(save == null){
                isSuccess = false;
            }
        } else if("3".equals(approvalFlag)){
           //更新追回审批信息
           Edu600 eud600select = new Edu600();
           eud600select.setLastExaminerKey(edu600.getExaminerkey());
           eud600select.setBusinessKey(eud600select.getBusinessKey());
           Specification<Edu601> specification = new Specification<Edu601>() {
               public Predicate toPredicate(Root<Edu601> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                   List<Predicate> predicates = new ArrayList<Predicate>();
                   if (eud600select.getBusinessKey() != null && !"".equals(eud600select.getBusinessKey())) {
                       predicates.add(cb.equal(root.<String> get("businessKey"), edu600.getBusinessKey()));
                   }
                   if (eud600select.getLastExaminerKey() != null && !"".equals(eud600select.getLastExaminerKey())) {
                       predicates.add(cb.equal(root.<String> get("lastExaminerKey"), eud600select.getLastExaminerKey()));
                   }
                   return cb.and(predicates.toArray(new Predicate[predicates.size()]));
               }
           };
           List<Edu601> edu601List = edu601Dao.findAll(specification);
           Edu601 edu601 = edu601List.get(0);
           try {
               //复制属性
               BeanUtils.copyProperties(edu600, edu601);
               edu600.setCurrentRole(edu601.getLastRole());
               Edu602 edu602 = edu602Dao.selectNextRole(businessType, edu600.getCurrentRole().toString());
               edu600.setLastRole(edu602.getLastRole());
           } catch (IllegalAccessException e) {
               e.printStackTrace();
           } catch (InvocationTargetException e) {
               e.printStackTrace();
           }

           edu600.setUpdateDate(new Date());
           Edu600 save = edu600DAO.save(edu600);
           if(save == null){
               isSuccess = false;
           }
       } else {
           isSuccess = false;
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
                        predicates.add(cb.equal(root.<String> get("currentRole"), edu600.getCurrentRole()));
                    }
                    if (edu600.getBusinessType() != null && !"".equals(edu600.getBusinessType())) {
                        predicates.add(cb.equal(root.<String> get("businessType"), edu600.getBusinessType()));
                    }
                    if (edu600.getProposerKey() != null && !"".equals(edu600.getProposerKey())) {
                        predicates.add(cb.equal(root.<String> get("proposerKey"), edu600.getProposerKey()));
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
                if(e.getLastExaminerKey() == null || "".equals(e.getExaminerkey())) {
                    approvalEx.setLastPersonName("");
                }else {
                    Edu990 lastPerson = edu990Dao.queryUserById(e.getLastExaminerKey().toString());
                    approvalEx.setLastPersonName(lastPerson.getYhm());
                }
                //获取业务类型信息
                String splx = edu000Dao.queryEjdmMcByEjdmZ(e.getBusinessType(), "splx");
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

    /**
     * 搜索审批人
     * @return
     */
    public List<Edu990> getProposerList() {
        //查找申请表中涉及到的审批人
        List<Edu990> proposerList = edu990Dao.selectProposer();
        return proposerList;
    }

    /**
     * 审批操作
     * @param edu600BO
     * @return
     */
    public boolean approvalOperation(Edu600BO edu600BO) {
        boolean isSuccess = true;
        Edu600 edu600 = new Edu600();
        String approvalFlag = edu600BO.getApprovalFlag();

        try {
            BeanUtils.copyProperties(edu600,edu600BO);
            //流转前保存审批记录
            saveApprovalHistory(edu600, approvalFlag);
            //进入流转将当前节点变为上一节点
            edu600.setLastRole(edu600BO.getCurrentRole());
            edu600.setLastExaminerKey(edu600BO.getExaminerkey());
            isSuccess = processFlow(edu600, approvalFlag);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    /**
     * 搜索可追回审批记录
     * @param edu600BO
     * @return
     */
    public List<Edu600BO> searchCanBackApproval(Edu600BO edu600BO) {
        List<Edu600BO> approvalExList = new ArrayList<>();
        try {
            //赋值查询条件
            Edu600 edu600 = new Edu600();
            edu600.setProposerKey(edu600BO.getProposerKey());
            edu600.setBusinessType(edu600BO.getBusinessType());
            edu600.setLastExaminerKey(edu600BO.getExaminerkey());

            Specification<Edu600> specification = new Specification<Edu600>() {
                public Predicate toPredicate(Root<Edu600> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    if (edu600.getBusinessType() != null && !"".equals(edu600.getBusinessType())) {
                        predicates.add(cb.equal(root.<String> get("businessType"), edu600.getBusinessType()));
                    }
                    if (edu600.getProposerKey() != null && !"".equals(edu600.getProposerKey())) {
                        predicates.add(cb.equal(root.<String> get("proposerKey"), edu600.getProposerKey()));
                    }
                    if (edu600.getLastExaminerKey() != null && !"".equals(edu600.getLastExaminerKey())) {
                        predicates.add(cb.equal(root.<String> get("lastExaminerKey"), edu600.getLastExaminerKey()));
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
                if(e.getLastExaminerKey() == null || "".equals(e.getExaminerkey())) {
                    approvalEx.setLastPersonName("");
                }else {
                    Edu990 lastPerson = edu990Dao.queryUserById(e.getLastExaminerKey().toString());
                    approvalEx.setLastPersonName(lastPerson.getYhm());
                }
                //获取业务类型信息
                String splx = edu000Dao.queryEjdmMcByEjdmZ(e.getBusinessType(), "splx");
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

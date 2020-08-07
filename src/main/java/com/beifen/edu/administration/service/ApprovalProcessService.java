package com.beifen.edu.administration.service;

import com.beifen.edu.administration.dao.Edu600Dao;
import com.beifen.edu.administration.dao.Edu601Dao;
import com.beifen.edu.administration.dao.Edu602Dao;
import com.beifen.edu.administration.domian.Edu600;
import com.beifen.edu.administration.domian.Edu601;
import com.beifen.edu.administration.domian.Edu602;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;


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
}

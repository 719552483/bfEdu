package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu600;

public class Edu600BO extends Edu600 {
    private String proposerName;//申请人姓名
    private String businessName;//业务类型名称
    private String lastPersonName;//上一步审批人姓名
    private Long currentUserRole;//当前用户角色
    private String approvalFlag;//操作表示（1同意，2不同意）


    public String getApprovalFlag() {
        return approvalFlag;
    }

    public void setApprovalFlag(String approvalFlag) {
        this.approvalFlag = approvalFlag;
    }

    public String getProposerName() {
        return proposerName;
    }

    public void setProposerName(String proposerName) {
        this.proposerName = proposerName;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getLastPersonName() {
        return lastPersonName;
    }

    public void setLastPersonName(String lastPersonName) {
        this.lastPersonName = lastPersonName;
    }

    public Long getCurrentUserRole() {
        return currentUserRole;
    }

    public void setCurrentUserRole(Long currentUserRole) {
        this.currentUserRole = currentUserRole;
    }
}

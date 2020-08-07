package com.beifen.edu.administration.BO;

import com.beifen.edu.administration.domian.Edu600;

public class EDU600BO extends Edu600 {
    private String proposerName;//申请人姓名
    private String businessName;//业务类型名称
    private String lastPersonName;//上一步审批人姓名
    private Long currentUserRole;//当前用户角色



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

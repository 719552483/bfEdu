package com.beifen.edu.administration.domian;

import javax.persistence.*;

//审批流转表
@Entity
@Table(name = "Edu602")
public class Edu602 {

    private Long edu602Id;//审批流转主键
    private String approvalIndex;//流转序列
    private Long businessType;//业务主键
    private Long lastRole;//上一步审批角色
    private Long currentRole;//当前审批角色
    private Long nextRole;//下一步审批角色

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "edu602Id")

    public Long getEdu602Id() {
        return edu602Id;
    }

    public void setEdu602Id(Long edu602Id) {
        this.edu602Id = edu602Id;
    }

    public String getApprovalIndex() {
        return approvalIndex;
    }

    public void setApprovalIndex(String approvalIndex) {
        this.approvalIndex = approvalIndex;
    }

    public Long getBusinessType() {
        return businessType;
    }

    public void setBusinessType(Long businessType) {
        this.businessType = businessType;
    }

    public Long getLastRole() {
        return lastRole;
    }

    public void setLastRole(Long lastRole) {
        this.lastRole = lastRole;
    }

    public Long getCurrentRole() {
        return currentRole;
    }

    public void setCurrentRole(Long currentRole) {
        this.currentRole = currentRole;
    }

    public Long getNextRole() {
        return nextRole;
    }

    public void setNextRole(Long nextRole) {
        this.nextRole = nextRole;
    }
}

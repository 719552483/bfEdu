package com.beifen.edu.administration.domian;


import javax.persistence.*;
import java.util.Date;

//审批信息表
@Entity
@Table(name = "Edu600")
public class Edu600 {

    private Long edu600Id;//审批流主键
    private String businessType;//业务类型
    private Long businessKey;//业务主键
    private Long proposerType;//申请人类型
    private Long proposerKey;//申请人主键
    private Long examinerRole;//当前审批人类型
    private Long examinerkey;//当前审批人主键
    private Long lastExaminerKey;//上一部审批人主键
    private String lastApprovalOpinions;//上一步审批意见
    private String approvalOpinions;//审批意见
    private String approvalState;//审批状态
    private String approvalStyl;//审批类型
    private Long lastRole;//上一步审批角色
    private Long currentRole;//当前审批角色
    private Date creatDate;//发起时间
    private Date updateDate;//修改时间



    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "edu600Id")
    public Long getEdu600Id() {
        return edu600Id;
    }

    public void setEdu600Id(Long edu600Id) {
        this.edu600Id = edu600Id;
    }

    public Long getLastExaminerKey() {
        return lastExaminerKey;
    }

    public void setLastExaminerKey(Long lastExaminerKey) {
        this.lastExaminerKey = lastExaminerKey;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public Long getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(Long businessKey) {
        this.businessKey = businessKey;
    }

    public Long getProposerType() {
        return proposerType;
    }

    public void setProposerType(Long proposerType) {
        this.proposerType = proposerType;
    }

    public Long getProposerKey() {
        return proposerKey;
    }

    public void setProposerKey(Long proposerKey) {
        this.proposerKey = proposerKey;
    }

    public Date getCreatDate() {
        return creatDate;
    }

    public void setCreatDate(Date creatDate) {
        this.creatDate = creatDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getApprovalOpinions() {
        return approvalOpinions;
    }

    public void setApprovalOpinions(String approvalOpinions) {
        this.approvalOpinions = approvalOpinions;
    }

    public String getApprovalState() {
        return approvalState;
    }

    public void setApprovalState(String approvalState) {
        this.approvalState = approvalState;
    }

    public Long getCurrentRole() {
        return currentRole;
    }

    public void setCurrentRole(Long currentRole) {
        this.currentRole = currentRole;
    }

    public String getApprovalStyl() {
        return approvalStyl;
    }

    public void setApprovalStyl(String approvalStyl) {
        this.approvalStyl = approvalStyl;
    }

    public Long getLastRole() {
        return lastRole;
    }

    public void setLastRole(Long lastRole) {
        this.lastRole = lastRole;
    }

    public String getLastApprovalOpinions() {
        return lastApprovalOpinions;
    }

    public void setLastApprovalOpinions(String lastApprovalOpinions) {
        this.lastApprovalOpinions = lastApprovalOpinions;
    }

    public Long getExaminerRole() {
        return examinerRole;
    }

    public void setExaminerRole(Long examinerRole) {
        this.examinerRole = examinerRole;
    }

    public Long getExaminerkey() {
        return examinerkey;
    }

    public void setExaminerkey(Long examinerkey) {
        this.examinerkey = examinerkey;
    }


}

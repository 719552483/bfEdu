package com.beifen.edu.administration.domian;

import javax.persistence.*;
import java.util.Date;

//审批历史表
@Entity
@Table(name = "Edu601")
public class Edu601 {

    private Long edu601Id;//审批历史主键
    private Long edu600Id;//审批流主键
    private String businessType;//业务类型
    private Long businessKey;//业务主键
    private String proposerType;//申请人类型
    private Long proposerKey;//申请人主键
    private Long CurrentPeople;//当前操作人
    private String approvalOpinions;//审批意见
    private String approvalResult;//审批结果
    private Date creatDate;//发起时间
    private Date updateDate;//修改时间

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "edu601Id")

    public Long getEdu601Id() {
        return edu601Id;
    }

    public void setEdu601Id(Long edu601Id) {
        this.edu601Id = edu601Id;
    }

    public Long getEdu600Id() {
        return edu600Id;
    }

    public void setEdu600Id(Long edu600Id) {
        this.edu600Id = edu600Id;
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

    public String getProposerType() {
        return proposerType;
    }

    public void setProposerType(String proposerType) {
        this.proposerType = proposerType;
    }

    public Long getProposerKey() {
        return proposerKey;
    }

    public void setProposerKey(Long proposerKey) {
        this.proposerKey = proposerKey;
    }

    public String getApprovalOpinions() {
        return approvalOpinions;
    }

    public void setApprovalOpinions(String approvalOpinions) {
        this.approvalOpinions = approvalOpinions;
    }

    public String getApprovalResult() {
        return approvalResult;
    }

    public void setApprovalResult(String approvalResult) {
        this.approvalResult = approvalResult;
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

    public Long getCurrentPeople() {
        return CurrentPeople;
    }

    public void setCurrentPeople(Long currentPeople) {
        CurrentPeople = currentPeople;
    }
}

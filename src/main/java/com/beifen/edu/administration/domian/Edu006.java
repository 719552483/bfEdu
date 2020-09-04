package com.beifen.edu.administration.domian;


import javax.persistence.*;

//学生违纪信息主表
@Entity
@Table(name = "Edu006")
public class Edu006 {

    private Long Edu006_ID;//主键
    private Long Edu101_ID;//录入人主键
    private String creatUser;//录入人姓名
    private String breachType;//违纪类型
    private String breachName;//违纪类型名称
    private String breachDate;//违纪日期
    private String HandlingOpinions;//处理意见
    private String creatDate;//录入日期
    private String cancelState;//撤销标识
    private String cancelDate;//撤销日期
    private String approvalState;//审批状态

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu006_ID")

    public Long getEdu006_ID() {
        return Edu006_ID;
    }

    public void setEdu006_ID(Long edu006_ID) {
        Edu006_ID = edu006_ID;
    }

    public Long getEdu101_ID() {
        return Edu101_ID;
    }

    public void setEdu101_ID(Long edu101_ID) {
        Edu101_ID = edu101_ID;
    }

    public String getCreatUser() {
        return creatUser;
    }

    public void setCreatUser(String creatUser) {
        this.creatUser = creatUser;
    }

    public String getBreachType() {
        return breachType;
    }

    public void setBreachType(String breachType) {
        this.breachType = breachType;
    }

    public String getBreachName() {
        return breachName;
    }

    public void setBreachName(String breachName) {
        this.breachName = breachName;
    }

    public String getBreachDate() {
        return breachDate;
    }

    public void setBreachDate(String breachDate) {
        this.breachDate = breachDate;
    }

    public String getHandlingOpinions() {
        return HandlingOpinions;
    }

    public void setHandlingOpinions(String handlingOpinions) {
        HandlingOpinions = handlingOpinions;
    }

    public String getCreatDate() {
        return creatDate;
    }

    public void setCreatDate(String creatDate) {
        this.creatDate = creatDate;
    }

    public String getCancelState() {
        return cancelState;
    }

    public void setCancelState(String cancelState) {
        this.cancelState = cancelState;
    }

    public String getCancelDate() {
        return cancelDate;
    }

    public void setCancelDate(String cancelDate) {
        this.cancelDate = cancelDate;
    }

    public String getApprovalState() {
        return approvalState;
    }

    public void setApprovalState(String approvalState) {
        this.approvalState = approvalState;
    }
}
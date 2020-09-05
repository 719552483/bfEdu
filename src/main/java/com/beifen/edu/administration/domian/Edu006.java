package com.beifen.edu.administration.domian;


import javax.persistence.*;

//学生违纪信息主表
@Entity
@Table(name = "Edu006")
public class Edu006 {

    private Long Edu006_ID;//主键
    private Long Edu101_ID;//录入人主键
    private String Edu001_ID;//学生ID
    private String studentName;//学生姓名
    private String creatUser;//录入人姓名
    private String breachType;//违纪类型
    private String breachName;//违纪类型名称
    private String breachDate;//违纪日期
    private String handlingOpinions;//处理意见
    private String creatDate;//录入日期
    private String cancelState;//撤销标识
    private String cancelDate;//撤销日期
    private String approvalState;//审批状态

    public Edu006() {}

    public Edu006(Long Edu006_ID,Long Edu101_ID,String Edu001_ID,String studentName,
                      String creatUser,String breachType, String breachName,String breachDate,
                        String handlingOpinions,String creatDate,String cancelState,String cancelDate,
                          String approvalState) {
        this.Edu006_ID = Edu006_ID;
        this.Edu101_ID = Edu101_ID;
        this.Edu001_ID = Edu001_ID;
        this.studentName = studentName;
        this.creatUser = creatUser;
        this.breachType = breachType;
        this.breachName = breachName;
        this.breachDate = breachDate;
        this.handlingOpinions = handlingOpinions;
        this.creatDate = creatDate;
        this.cancelState = cancelState;
        this.cancelDate = cancelDate;
        this.approvalState = approvalState;
    }



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

    public String getEdu001_ID() {
        return Edu001_ID;
    }

    public void setEdu001_ID(String edu001_ID) {
        Edu001_ID = edu001_ID;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
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
        return handlingOpinions;
    }

    public void setHandlingOpinions(String handlingOpinions) {
        this.handlingOpinions = handlingOpinions;
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

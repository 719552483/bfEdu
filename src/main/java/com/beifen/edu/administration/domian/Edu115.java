package com.beifen.edu.administration.domian;

import javax.persistence.*;

//成绩确认申请表
@Entity
@Table(name = "Edu115")
public class Edu115 {
    private Long Edu115_ID;//主键
    private Long Edu990_ID;//发起人用户ID
    private String userName;//用户名称
    private String xnid;//学年id
    private String courseName;//课程名称
    private String className;//班级名称
    private String businessState;//状态
    private String businessExplain;//情况说明



    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu115_ID")

    public Long getEdu115_ID() {
        return Edu115_ID;
    }

    public void setEdu115_ID(Long edu115_ID) {
        Edu115_ID = edu115_ID;
    }

    public Long getEdu990_ID() {
        return Edu990_ID;
    }

    public void setEdu990_ID(Long edu990_ID) {
        Edu990_ID = edu990_ID;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getBusinessState() {
        return businessState;
    }

    public void setBusinessState(String businessState) {
        this.businessState = businessState;
    }

    public String getBusinessExplain() {
        return businessExplain;
    }

    public void setBusinessExplain(String businessExplain) {
        this.businessExplain = businessExplain;
    }
}

package com.beifen.edu.administration.domian;

import javax.persistence.*;

//取消成绩确认信息表
@Entity
@Table(name="Edu008")
public class Edu008 {
    private Long Edu008_ID;//主键
    private String xn;//学年
    private String xnid;//学年id
    private String courseName;//课程名称
    private String className;//行政班名称
    private String departmentCode;//二级学院代码


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu008_ID")
    public Long getEdu008_ID() {
        return Edu008_ID;
    }

    public void setEdu008_ID(Long edu008_ID) {
        Edu008_ID = edu008_ID;
    }

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
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

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }
}

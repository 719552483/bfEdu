package com.beifen.edu.administration.PO;


//需要录入成绩的班级

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "TEACHER_GRADE_CLASS")
public class TeacherGradeClassPO {

    private String id;
    private String courseName;//课程名称
    private String className;//行政班名称
    private String xn;//学年
    private String xnid;
    private String edu300_id;
    private String edu201_id;
    private String isConfirm;//是否确认
    private String business_state;//延时确认成绩审核状态
    private String status;//取消成绩确认状态

    @Id
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
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

    public String getEdu300_id() {
        return edu300_id;
    }

    public void setEdu300_id(String edu300_id) {
        this.edu300_id = edu300_id;
    }

    public String getEdu201_id() {
        return edu201_id;
    }

    public void setEdu201_id(String edu201_id) {
        this.edu201_id = edu201_id;
    }

    public String getIsConfirm() {
        return isConfirm;
    }

    public void setIsConfirm(String isConfirm) {
        this.isConfirm = isConfirm;
    }

    public String getBusiness_state() {
        return business_state;
    }

    public void setBusiness_state(String business_state) {
        this.business_state = business_state;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

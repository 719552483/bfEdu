package com.beifen.edu.administration.PO;


//教务查询课表实体类

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
}

package com.beifen.edu.administration.PO;

import java.io.Serializable;

public class BigDataDepartmentPO implements Serializable {
    private String edu104Id;//二级学院ID
    private String departmentName;//二级学院名称
    private String teacherCount;//授课教师人数

    public BigDataDepartmentPO(){}

    public BigDataDepartmentPO(String edu104Id, String departmentName, String teacherCount) {
        this.edu104Id = edu104Id;
        this.departmentName = departmentName;
        this.teacherCount = teacherCount;
    }

    public String getEdu104Id() {
        return edu104Id;
    }

    public void setEdu104Id(String edu104Id) {
        this.edu104Id = edu104Id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getTeacherCount() {
        return teacherCount;
    }

    public void setTeacherCount(String teacherCount) {
        this.teacherCount = teacherCount;
    }
}

package com.beifen.edu.administration.PO;

import java.io.Serializable;

public class BigDataTeacherTypePO implements Serializable {
    private String edu104Id;//二级学院ID
    private String departmentName;//二级学院名称
    private String teacherCount;//授课教师人数
    private String teacherTypeName;//授课教师类型名称
    private String teacherType;//授课教师类型Id

    public BigDataTeacherTypePO(){}

    public BigDataTeacherTypePO(String edu104Id, String departmentName, String teacherCount, String teacherTypeName,String teacherType) {
        this.edu104Id = edu104Id;
        this.departmentName = departmentName;
        this.teacherCount = teacherCount;
        this.teacherType = teacherType;
        this.teacherTypeName = teacherTypeName;
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

    public String getTeacherType() {
        return teacherType;
    }

    public void setTeacherType(String teacherType) {
        this.teacherType = teacherType;
    }

    public String getTeacherTypeName() {
        return teacherTypeName;
    }

    public void setTeacherTypeName(String teacherTypeName) {
        this.teacherTypeName = teacherTypeName;
    }
}

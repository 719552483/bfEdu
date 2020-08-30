package com.beifen.edu.administration.PO;


//申请考试查询条件PO
public class TestTaskSearchPO {
    private String courseCode;//课程代码
    private String courseName;//课程名称
    private String coursesNature;//课程性质
    private String className;//班级名称

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCoursesNature() {
        return coursesNature;
    }

    public void setCoursesNature(String coursesNature) {
        this.coursesNature = coursesNature;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }
}

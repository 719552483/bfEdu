package com.beifen.edu.administration.domian;

import javax.persistence.*;


//分散学时排课内容实体类
@Entity
@Table(name = "Edu207")
public class Edu207 {
    private Long Edu207_ID;//主键
    private String Edu201_ID; //任务书ID
    private String week;//所在周
    private Integer classHours; //课时
    private String courseName;//课程名称
    private String courseContent;//课程内容
    private String teachingPlatform;//授课平台
    private String classId;//班级id
    private String className;//班级名称
    private String Edu108_ID;//授课平台
    private String courseType;//授课平台
    private String edu101_ID;//教师id
    private String teacherName;//教师名称

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu207_ID")

    public Long getEdu207_ID() {
        return Edu207_ID;
    }

    public void setEdu207_ID(Long edu207_ID) {
        Edu207_ID = edu207_ID;
    }

    public String getEdu201_ID() {
        return Edu201_ID;
    }

    public void setEdu201_ID(String edu201_ID) {
        Edu201_ID = edu201_ID;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public Integer getClassHours() {
        return classHours;
    }

    public void setClassHours(Integer classHours) {
        this.classHours = classHours;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseContent() {
        return courseContent;
    }

    public void setCourseContent(String courseContent) {
        this.courseContent = courseContent;
    }

    public String getTeachingPlatform() {
        return teachingPlatform;
    }

    public void setTeachingPlatform(String teachingPlatform) {
        this.teachingPlatform = teachingPlatform;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getEdu108_ID() {
        return Edu108_ID;
    }

    public void setEdu108_ID(String edu108_ID) {
        Edu108_ID = edu108_ID;
    }

    public String getCourseType() {
        return courseType;
    }

    public void setCourseType(String courseType) {
        this.courseType = courseType;
    }

    public String getEdu101_ID() {
        return edu101_ID;
    }

    public void setEdu101_ID(String edu101_ID) {
        this.edu101_ID = edu101_ID;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
}

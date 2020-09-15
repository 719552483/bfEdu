package com.beifen.edu.administration.PO;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//课程表查询PO
@Entity
@Table(name = "TEACHING_SCHEDULE_VIEW")
public class SchoolTimetablePO {
    private String ID;
    private String edu203_id;
    private String edu201_id;
    private String kjid;
    private String kjmc;
    private String xqid;
    private String xqmc;
    private String week;
    private String edu202_id;
    private String jsx;
    private String ksz;
    private String xnid;
    private String classRoomId;
    private String classRoom;
    private String classId;
    private String className;
    private String teacherName;
    private String baseTeacherName;
    private String teacherId;
    private String baseTeacherId;
    private String userName;
    private String userType;
    private String edu101_id;
    private String classType;
    private String classTypeId;
    private String courseId;
    private String courseName;
    private String courseType;

    @Id
    public String getID() {
        return ID;
    }
    public void setID(String ID) {
        this.ID = ID;
    }

    public String getEdu203_id() {
        return edu203_id;
    }

    public void setEdu203_id(String edu203_id) {
        this.edu203_id = edu203_id;
    }

    public String getKjid() {
        return kjid;
    }

    public void setKjid(String kjid) {
        this.kjid = kjid;
    }

    public String getKjmc() {
        return kjmc;
    }

    public void setKjmc(String kjmc) {
        this.kjmc = kjmc;
    }

    public String getXqid() {
        return xqid;
    }

    public void setXqid(String xqid) {
        this.xqid = xqid;
    }

    public String getXqmc() {
        return xqmc;
    }

    public void setXqmc(String xqmc) {
        this.xqmc = xqmc;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public String getEdu202_id() {
        return edu202_id;
    }

    public void setEdu202_id(String edu202_id) {
        this.edu202_id = edu202_id;
    }

    public String getJsx() {
        return jsx;
    }

    public void setJsx(String jsx) {
        this.jsx = jsx;
    }

    public String getKsz() {
        return ksz;
    }

    public void setKsz(String ksz) {
        this.ksz = ksz;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public String getClassRoomId() {
        return classRoomId;
    }

    public void setClassRoomId(String classRoomId) {
        this.classRoomId = classRoomId;
    }

    public String getClassRoom() {
        return classRoom;
    }

    public void setClassRoom(String classRoom) {
        this.classRoom = classRoom;
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

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getBaseTeacherName() {
        return baseTeacherName;
    }

    public void setBaseTeacherName(String baseTeacherName) {
        this.baseTeacherName = baseTeacherName;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getBaseTeacherId() {
        return baseTeacherId;
    }

    public void setBaseTeacherId(String baseTeacherId) {
        this.baseTeacherId = baseTeacherId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getEdu101_id() {
        return edu101_id;
    }

    public void setEdu101_id(String edu101_id) {
        this.edu101_id = edu101_id;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getClassTypeId() {
        return classTypeId;
    }

    public void setClassTypeId(String classTypeId) {
        this.classTypeId = classTypeId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseType() {
        return courseType;
    }

    public void setCourseType(String courseType) {
        this.courseType = courseType;
    }

    public String getEdu201_id() {
        return edu201_id;
    }

    public void setEdu201_id(String edu201_id) {
        this.edu201_id = edu201_id;
    }
}

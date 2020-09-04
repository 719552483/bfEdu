package com.beifen.edu.administration.domian;

import javax.persistence.*;

//学生违纪关联表
@Entity
@Table(name = "Edu007")
public class Edu007 {

    private Long Edu007_ID; //主键
    private Long Edu006_ID; //违纪主表主键
    private Long Edu101_ID; //违纪学生主键
    private String studentName; //违纪学生姓名

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu007_ID")

    public Long getEdu007_ID() {
        return Edu007_ID;
    }

    public void setEdu007_ID(Long edu007_ID) {
        Edu007_ID = edu007_ID;
    }

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

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
}

package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教师出差关联表
@Entity
@Table(name = "Edu113")
public class Edu113 {

    private Long Edu113_ID;
    private Long Edu112_ID;
    private Long Eud101_ID;
    private String teacherName;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "EDU113_ID")

    public Long getEdu113_ID() {
        return Edu113_ID;
    }

    public void setEdu113_ID(Long edu113_ID) {
        Edu113_ID = edu113_ID;
    }

    public Long getEdu112_ID() {
        return Edu112_ID;
    }

    public void setEdu112_ID(Long edu112_ID) {
        Edu112_ID = edu112_ID;
    }

    public Long getEud101_ID() {
        return Eud101_ID;
    }

    public void setEud101_ID(Long eud101_ID) {
        Eud101_ID = eud101_ID;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
}

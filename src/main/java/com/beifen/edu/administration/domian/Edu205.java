package com.beifen.edu.administration.domian;

import javax.persistence.*;

//任务书与教师关联表
@Entity
@Table(name = "Edu205")
public class Edu205 {
    private Long Edu205_ID;//主键ID
    private Long Edu201_ID; //任务书ID
    private Long Edu101_ID;//教师表ID
    private String teacherType;//教师类型
    private String techerName;//教师姓名

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu205_ID")

    public Long getEdu205_ID() {
        return Edu205_ID;
    }

    public void setEdu205_ID(Long edu205_ID) {
        Edu205_ID = edu205_ID;
    }

    public Long getEdu201_ID() {
        return Edu201_ID;
    }

    public void setEdu201_ID(Long edu201_ID) {
        Edu201_ID = edu201_ID;
    }

    public Long getEdu101_ID() {
        return Edu101_ID;
    }

    public void setEdu101_ID(Long edu101_ID) {
        Edu101_ID = edu101_ID;
    }

    public String getTeacherType() {
        return teacherType;
    }

    public void setTeacherType(String teacherType) {
        this.teacherType = teacherType;
    }

    public String getTecherName() {
        return techerName;
    }

    public void setTecherName(String techerName) {
        this.techerName = techerName;
    }
}

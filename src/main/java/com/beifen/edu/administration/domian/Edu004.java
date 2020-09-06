package com.beifen.edu.administration.domian;


import javax.persistence.*;

//学生评价表
@Entity
@Table(name="Edu004")
public class Edu004 {
    private Long Edu004_ID;//主键
    private Long Edu001_ID;//学生id
    private Long Edu101_ID;//老师id
    private String teacherName;//教师姓名
    private String appraiseText;//评价文本
    private String creatDate;//评价创建时间

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu004_ID")

    public Long getEdu004_ID() {
        return Edu004_ID;
    }

    public void setEdu004_ID(Long edu004_ID) {
        Edu004_ID = edu004_ID;
    }

    public Long getEdu001_ID() {
        return Edu001_ID;
    }

    public void setEdu001_ID(Long edu001_ID) {
        Edu001_ID = edu001_ID;
    }

    public String getAppraiseText() {
        return appraiseText;
    }

    public void setAppraiseText(String appraiseText) {
        this.appraiseText = appraiseText;
    }

    public Long getEdu101_ID() {
        return Edu101_ID;
    }

    public void setEdu101_ID(Long edu101_ID) {
        Edu101_ID = edu101_ID;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getCreatDate() {
        return creatDate;
    }

    public void setCreatDate(String creatDate) {
        this.creatDate = creatDate;
    }
}

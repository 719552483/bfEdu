package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷评分题答案
@Entity
@Table(name = "Edu806")
public class Edu806 {
    private Long Edu806_ID;//主键
    private Long Edu801_ID;//调查问卷ID
    private Long Edu802_ID;//问题ID
    private String user_ID;//用户ID
    private int sore;//分数
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu806_ID")

    public Long getEdu806_ID() {
        return Edu806_ID;
    }

    public void setEdu806_ID(Long edu806_ID) {
        Edu806_ID = edu806_ID;
    }

    public Long getEdu801_ID() {
        return Edu801_ID;
    }

    public void setEdu801_ID(Long edu801_ID) {
        Edu801_ID = edu801_ID;
    }

    public Long getEdu802_ID() {
        return Edu802_ID;
    }

    public void setEdu802_ID(Long edu802_ID) {
        Edu802_ID = edu802_ID;
    }

    public String getUser_ID() {
        return user_ID;
    }

    public void setUser_ID(String user_ID) {
        this.user_ID = user_ID;
    }

    public int getSore() {
        return sore;
    }

    public void setSore(int sore) {
        this.sore = sore;
    }
}

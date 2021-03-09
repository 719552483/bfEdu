package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷与学生关系表
@Entity
@Table(name = "Edu804")
public class Edu804 {
    private Long Edu804_ID;//主键
    private String Edu801_IDS;//调查问卷IDS
    private String user_ID;//用户ID
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu804_ID")

    public Long getEdu804_ID() {
        return Edu804_ID;
    }

    public void setEdu804_ID(Long edu804_ID) {
        Edu804_ID = edu804_ID;
    }

    public String getEdu801_IDS() {
        return Edu801_IDS;
    }

    public void setEdu801_IDS(String edu801_IDS) {
        Edu801_IDS = edu801_IDS;
    }

    public String getUser_ID() {
        return user_ID;
    }

    public void setUser_ID(String user_ID) {
        this.user_ID = user_ID;
    }
}

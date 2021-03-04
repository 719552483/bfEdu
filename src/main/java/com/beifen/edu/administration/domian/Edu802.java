package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷题目表
@Entity
@Table(name = "Edu802")
public class Edu802 {
    private Long Edu802_ID;//主键
    private String title;//标题
    private Long Edu801_ID;//调查问卷ID
    private String createPerson;//录入人
    private String personName;//录入人名称
    private String createDate;//录入时间
    private String type;//题目类型(checked单选radio多选3评分4简答)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu802_ID")

    public Long getEdu802_ID() {
        return Edu802_ID;
    }

    public void setEdu802_ID(Long Edu802_ID) {
        Edu802_ID = Edu802_ID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public Long getEdu801_ID() {
        return Edu801_ID;
    }

    public void setEdu801_ID(Long edu801_ID) {
        Edu801_ID = edu801_ID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}

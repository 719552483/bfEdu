package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷表
@Entity
@Table(name = "Edu801")
public class Edu801 {
    private Long Edu801_ID;//主键
    private String title;//标题
    private Integer num;//答卷学生数量
    private String createPerson;//录入人
    private String personName;//录入人名称
    private String createDate;//录入时间
    private String permissions;//哪些学院的学员需要答题
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu801_ID")

    public Long getEdu801_ID() {
        return Edu801_ID;
    }

    public void setEdu801_ID(Long edu801_ID) {
        Edu801_ID = edu801_ID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getNum() {
        return num;
    }

    public void setNum(Integer num) {
        this.num = num;
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

    public String getPermissions() {
        return permissions;
    }

    public void setPermissions(String permissions) {
        this.permissions = permissions;
    }
}

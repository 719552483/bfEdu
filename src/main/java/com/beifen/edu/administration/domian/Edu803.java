package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷选项表
@Entity
@Table(name = "Edu803")
public class Edu803 {
    private Long Edu803_ID;//主键
    private Long Edu802_ID;//调查问卷题目ID
    private String index;//选项(A,B,C,D...)
    private String text;//答案
    private String createPerson;//录入人
    private String personName;//录入人名称
    private String createDate;//录入时间
    private String num;//学生选择数量
    private String value;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu803_ID")

    public Long getEdu803_ID() {
        return Edu803_ID;
    }

    public void setEdu803_ID(Long Edu803_ID) {
        Edu803_ID = Edu803_ID;
    }

    public Long getEdu802_ID() {
        return Edu802_ID;
    }

    public void setEdu802_ID(Long edu802_ID) {
        Edu802_ID = edu802_ID;
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

    public String getNum() {
        return num;
    }

    public void setNum(String num) {
        this.num = num;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}

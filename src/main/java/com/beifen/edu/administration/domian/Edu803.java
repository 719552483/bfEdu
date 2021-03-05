package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷题目表
@Entity
@Table(name = "Edu803")
public class Edu803 {
    private Long Edu803_ID;//主键
    private Long Edu802_ID;//调查问卷题目ID
    private String checkOrRadioIndex;//选项(A,B,C,D...)
    private String checkOrRadioText;//答案
    private String createPerson;//录入人
    private String personName;//录入人名称
    private String createDate;//录入时间
    private int num;//学生选择数量
    private String checkOrRadioValue;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu803_ID")

    public Long getEdu803_ID() {
        return Edu803_ID;
    }

    public void setEdu803_ID(Long edu803_ID) {
        Edu803_ID = edu803_ID;
    }

    public Long getEdu802_ID() {
        return Edu802_ID;
    }

    public void setEdu802_ID(Long edu802_ID) {
        Edu802_ID = edu802_ID;
    }

    public String getCheckOrRadioIndex() {
        return checkOrRadioIndex;
    }

    public void setCheckOrRadioIndex(String checkOrRadioIndex) {
        this.checkOrRadioIndex = checkOrRadioIndex;
    }

    public String getCheckOrRadioText() {
        return checkOrRadioText;
    }

    public void setCheckOrRadioText(String checkOrRadioText) {
        this.checkOrRadioText = checkOrRadioText;
    }

    public String getCheckOrRadioValue() {
        return checkOrRadioValue;
    }

    public void setCheckOrRadioValue(String checkOrRadioValue) {
        this.checkOrRadioValue = checkOrRadioValue;
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

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

}

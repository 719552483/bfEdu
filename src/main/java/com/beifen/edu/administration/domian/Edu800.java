package com.beifen.edu.administration.domian;

import javax.persistence.*;

//通知类主表
@Entity
@Table(name = "Edu800")
public class Edu800 {
    private Long Edu800_ID;//主键
    private String departmentCode;//学院代码
    private String departmentName;//学院名称
    private String year;//年份
    private Double jsksf;//教师课时费
    private Double wlkczy;//网络课程资源
    private Double yyglf;//人员管理费
    private Double cdzlf;//场地租赁费
    private Double jxyxsbf;//教学运行设备费
    private Double pyfalzf;//培养方案论证费
    private Double sxsbf;//实训设备费
    private Double clf;//差旅费
    private String createPerson;//录入人
    private String personName;//录入人名称
    private String createDate;//录入时间

    public Edu800() {}
    public Edu800(Double jsksf,Double wlkczy,Double yyglf,Double cdzlf,Double jxyxsbf,Double pyfalzf,Double sxsbf,Double clf,String year) {
        this.year = year;
        this.jsksf = jsksf;
        this.wlkczy = wlkczy;
        this.yyglf = yyglf;
        this.cdzlf = cdzlf;
        this.jxyxsbf = jxyxsbf;
        this.pyfalzf = pyfalzf;
        this.sxsbf =sxsbf;
        this.clf = clf;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu800_ID")

    public Long getEdu800_ID() {
        return Edu800_ID;
    }

    public void setEdu800_ID(Long edu800_ID) {
        Edu800_ID = edu800_ID;
    }


    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }


    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Double getJsksf() {
        return jsksf;
    }

    public void setJsksf(Double jsksf) {
        this.jsksf = jsksf;
    }

    public Double getWlkczy() {
        return wlkczy;
    }

    public void setWlkczy(Double wlkczy) {
        this.wlkczy = wlkczy;
    }

    public Double getYyglf() {
        return yyglf;
    }

    public void setYyglf(Double yyglf) {
        this.yyglf = yyglf;
    }

    public Double getCdzlf() {
        return cdzlf;
    }

    public void setCdzlf(Double cdzlf) {
        this.cdzlf = cdzlf;
    }

    public Double getJxyxsbf() {
        return jxyxsbf;
    }

    public void setJxyxsbf(Double jxyxsbf) {
        this.jxyxsbf = jxyxsbf;
    }

    public Double getPyfalzf() {
        return pyfalzf;
    }

    public void setPyfalzf(Double pyfalzf) {
        this.pyfalzf = pyfalzf;
    }

    public Double getSxsbf() {
        return sxsbf;
    }

    public void setSxsbf(Double sxsbf) {
        this.sxsbf = sxsbf;
    }

    public Double getClf() {
        return clf;
    }

    public void setClf(Double clf) {
        this.clf = clf;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }
}

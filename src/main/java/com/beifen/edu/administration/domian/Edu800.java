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
    private String jsksf;//教师课时费
    private String wlkczy;//网络课程资源
    private String yyglf;//人员管理费
    private String cdzlf;//场地租赁费
    private String jxyxsbf;//教学运行设备费
    private String pyfalzf;//培养方案论证费
    private String sxsbf;//实训设备费
    private String clf;//差旅费
    private String createPerson;//录入人
    private String createDate;//录入时间

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

    public String getJsksf() {
        return jsksf;
    }

    public void setJsksf(String jsksf) {
        this.jsksf = jsksf;
    }

    public String getWlkczy() {
        return wlkczy;
    }

    public void setWlkczy(String wlkczy) {
        this.wlkczy = wlkczy;
    }

    public String getYyglf() {
        return yyglf;
    }

    public void setYyglf(String yyglf) {
        this.yyglf = yyglf;
    }

    public String getCdzlf() {
        return cdzlf;
    }

    public void setCdzlf(String cdzlf) {
        this.cdzlf = cdzlf;
    }

    public String getJxyxsbf() {
        return jxyxsbf;
    }

    public void setJxyxsbf(String jxyxsbf) {
        this.jxyxsbf = jxyxsbf;
    }

    public String getPyfalzf() {
        return pyfalzf;
    }

    public void setPyfalzf(String pyfalzf) {
        this.pyfalzf = pyfalzf;
    }

    public String getSxsbf() {
        return sxsbf;
    }

    public void setSxsbf(String sxsbf) {
        this.sxsbf = sxsbf;
    }

    public String getClf() {
        return clf;
    }

    public void setClf(String clf) {
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
}

package com.beifen.edu.administration.domian;

import javax.persistence.*;

//支出金额明细表
@Entity
@Table(name = "Edu8001")
public class Edu8001 {
    private Long Edu8001_ID;//主键
    private String departmentCode;//学院代码
    private String departmentName;//学院名称
    private String edu101Id;//userId
    private String name;//姓名
    private String payTime;//支出时间(年-月-日)
    private String lb;//支出类型
    private String lbbm;//支出类型编码
    private String reason;//事由
    private String fy;//花费金额
    private String createDate;//录入时间
    private String bz;//备注

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu8001_ID")

    public Long getEdu8001_ID() {
        return Edu8001_ID;
    }

    public void setEdu8001_ID(Long edu8001_ID) {
         Edu8001_ID = edu8001_ID;
    }

    public String getLb() {
        return lb;
    }

    public void setLb(String lb) {
        this.lb = lb;
    }

    public String getFy() {
        return fy;
    }

    public void setFy(String fy) {
        this.fy = fy;
    }

    public String getBz() {
        return bz;
    }

    public void setBz(String bz) {
        this.bz = bz;
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

    public String getEdu101Id() {
        return edu101Id;
    }

    public void setEdu101Id(String edu101Id) {
        this.edu101Id = edu101Id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPayTime() {
        return payTime;
    }

    public void setPayTime(String payTime) {
        this.payTime = payTime;
    }

    public String getLbbm() {
        return lbbm;
    }

    public void setLbbm(String lbbm) {
        this.lbbm = lbbm;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }
}

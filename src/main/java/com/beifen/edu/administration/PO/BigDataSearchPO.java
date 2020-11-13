package com.beifen.edu.administration.PO;

public class BigDataSearchPO {
    private String departmentCode; //二级学院代码
    private String schoolYearCode; //年级代码
    private String yearCode; //学年代码
    private String batchCode; //批次代码

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getSchoolYearCode() {
        return schoolYearCode;
    }

    public void setSchoolYearCode(String schoolYearCode) {
        this.schoolYearCode = schoolYearCode;
    }

    public String getBatchCode() {
        return batchCode;
    }

    public void setBatchCode(String batchCode) {
        this.batchCode = batchCode;
    }

    public String getYearCode() {
        return yearCode;
    }

    public void setYearCode(String yearCode) {
        this.yearCode = yearCode;
    }
}

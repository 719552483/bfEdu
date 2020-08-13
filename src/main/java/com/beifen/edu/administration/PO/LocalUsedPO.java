package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu500;

public class LocalUsedPO extends Edu500 {
    private String siteUtilization;//场地使用率
    private String academicYear;//学年


    public String getSiteUtilization() {
        return siteUtilization;
    }

    public void setSiteUtilization(String siteUtilization) {
        this.siteUtilization = siteUtilization;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}

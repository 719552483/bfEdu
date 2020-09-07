package com.beifen.edu.administration.PO;


import java.util.Date;

//班主任日志查询PO
public class TeacherLogSerachPO {

    private Long Edu114_ID;//主键
    private Long Edu101_ID;//教师ID
    private String teacherName;//教师名称
    private String logType;//日志类型
    private String typeName;//日志类型名称
    private String logTitle;//日志标题
    private String logDetail;//日志详情
    private String creatDate;//创建时间
    private String startDate;//开始时间
    private String endDate;//结束时间

    public Long getEdu114_ID() {
        return Edu114_ID;
    }

    public void setEdu114_ID(Long edu114_ID) {
        Edu114_ID = edu114_ID;
    }

    public Long getEdu101_ID() {
        return Edu101_ID;
    }

    public void setEdu101_ID(Long edu101_ID) {
        Edu101_ID = edu101_ID;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getLogType() {
        return logType;
    }

    public void setLogType(String logType) {
        this.logType = logType;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getLogTitle() {
        return logTitle;
    }

    public void setLogTitle(String logTitle) {
        this.logTitle = logTitle;
    }

    public String getLogDetail() {
        return logDetail;
    }

    public void setLogDetail(String logDetail) {
        this.logDetail = logDetail;
    }

    public String getCreatDate() {
        return creatDate;
    }

    public void setCreatDate(String creatDate) {
        this.creatDate = creatDate;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}

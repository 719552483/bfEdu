package com.beifen.edu.administration.domian;

import javax.persistence.*;
import java.util.Date;

//教师日志表
@Entity
@Table(name = "Edu114")
public class Edu114 {

    private Long Edu114_ID;//主键
    private Long Edu101_ID;//教师ID
    private String teacherName;//教师名称
    private String logType;//日志类型
    private String typeName;//日志类型名称
    private String logTitle;//日志标题
    private String logDetail;//日志详情
    private Date creatDate;//创建时间

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu114_ID")


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

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getLogTitle() {
        return logTitle;
    }

    public void setLogTitle(String logTitle) {
        this.logTitle = logTitle;
    }

    @Lob
    @Basic(fetch = FetchType.LAZY)
    public String getLogDetail() {
        return logDetail;
    }

    public void setLogDetail(String logDetail) {
        this.logDetail = logDetail;
    }

    public Date getCreatDate() {
        return creatDate;
    }

    public void setCreatDate(Date creatDate) {
        this.creatDate = creatDate;
    }
}

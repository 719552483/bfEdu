package com.beifen.edu.administration.domian;

import javax.persistence.*;

//通知类主表
@Entity
@Table(name = "Edu700")
public class Edu700 {
    private Long Edu700_ID;//主键
    private Long Edu104_ID;//二级学院ID
    private Long Edu101_ID;//发件人ID
    private String departmentName;//二级学院名称
    private String senderName;//发件人姓名
    private String sendDate;//发送日期
    private String noticeType;//通知类型
    private String showInIndex;//是否首页展示
    private String title;//标题
    private String noticeContent;//通知内容

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu700_ID")

    public Long getEdu700_ID() {
        return Edu700_ID;
    }

    public void setEdu700_ID(Long edu700_ID) {
        Edu700_ID = edu700_ID;
    }

    public Long getEdu104_ID() {
        return Edu104_ID;
    }

    public void setEdu104_ID(Long edu104_ID) {
        Edu104_ID = edu104_ID;
    }

    public Long getEdu101_ID() {
        return Edu101_ID;
    }

    public void setEdu101_ID(Long edu101_ID) {
        Edu101_ID = edu101_ID;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSendDate() {
        return sendDate;
    }

    public void setSendDate(String sendDate) {
        this.sendDate = sendDate;
    }

    public String getNoticeType() {
        return noticeType;
    }

    public void setNoticeType(String noticeType) {
        this.noticeType = noticeType;
    }

    public String getShowInIndex() {
        return showInIndex;
    }

    public void setShowInIndex(String showInIndex) {
        this.showInIndex = showInIndex;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // 指定blob字段
    @Lob
    @Basic(fetch = FetchType.LAZY)
    public String getNoticeContent() {
        return noticeContent;
    }

    public void setNoticeContent(String noticeContent) {
        this.noticeContent = noticeContent;
    }
}

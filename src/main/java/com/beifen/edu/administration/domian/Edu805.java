package com.beifen.edu.administration.domian;

import javax.persistence.*;

//调查问卷简答题答案
@Entity
@Table(name = "Edu805")
public class Edu805 {
    private Long Edu805_ID;//主键
    private String Edu801_ID;//调查问卷ID
    private String Edu802_ID;//问题ID
    private String user_ID;//用户ID
    private String answer;//答案
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
    @SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu805_ID")

    public Long getEdu805_ID() {
        return Edu805_ID;
    }

    public void setEdu805_ID(Long edu805_ID) {
        Edu805_ID = edu805_ID;
    }

    public String getEdu801_ID() {
        return Edu801_ID;
    }

    public void setEdu801_ID(String edu801_ID) {
        Edu801_ID = edu801_ID;
    }

    public String getEdu802_ID() {
        return Edu802_ID;
    }

    public void setEdu802_ID(String edu802_ID) {
        Edu802_ID = edu802_ID;
    }

    public String getUser_ID() {
        return user_ID;
    }

    public void setUser_ID(String user_ID) {
        this.user_ID = user_ID;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}

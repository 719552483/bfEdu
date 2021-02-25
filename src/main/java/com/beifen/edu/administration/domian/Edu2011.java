package com.beifen.edu.administration.domian;

import javax.persistence.*;

//教学任务书表
@Entity
@Table(name = "Edu2011")
public class Edu2011 {
	private Long Edu2011_ID; //ID
	private String Edu202_Id;//任务书ID
	private String classId;  //教学班ID
	private String className;  //班级名称
	private String kcmc;  //课程名称
//	private String courseId;  //课程id
	private String czsj; //操作时间
	private String userId;//操作人
	private String username;//操作人姓名
	private String type;//类型1.集中学时2.分散学时
	private String week;//周数
	private String lessons;//课时

	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu2011_ID")
	public Long getEdu2011_ID() {
		return Edu2011_ID;
	}
	public void setEdu2011_ID(Long edu201_ID) {
		Edu2011_ID = edu201_ID;
	}

	public String getClassId() {
		return classId;
	}

	public void setClassId(String classId) {
		this.classId = classId;
	}

	public String getEdu202_Id() {
		return Edu202_Id;
	}

	public void setEdu202_Id(String edu202_Id) {
		Edu202_Id = edu202_Id;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getKcmc() {
		return kcmc;
	}

	public void setKcmc(String kcmc) {
		this.kcmc = kcmc;
	}

//	public String getCourseId() {
//		return courseId;
//	}
//
//	public void setCourseId(String courseId) {
//		this.courseId = courseId;
//	}

	public String getCzsj() {
		return czsj;
	}

	public void setCzsj(String czsj) {
		this.czsj = czsj;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}

	public String getLessons() {
		return lessons;
	}

	public void setLessons(String lessons) {
		this.lessons = lessons;
	}
}

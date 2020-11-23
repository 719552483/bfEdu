package com.beifen.edu.administration.domian;

import javax.persistence.*;

//排课关联表
@Entity
@Table(name = "Edu203")
public class Edu203 {
	private Long Edu203_ID;
	private String Edu202_ID; //排课表ID
	private String ksz;//开始周
	private String jsz;//结束周
	private String week;//所在周
	private String kjid; // 课节id
	private String kjmc; // 课节名称
	private String xqid; // 星期id
	private String xqmc; // 星期名称
	private String Edu101_id;//教师id
	private String teacherName;//教师名称
	private String teacherType;//教师类型
	private String localId; //教学点id
	private String localName; //教学点名称
	private String pointId; //任务点id
	private String pointName; //任务点名称
	private String sflrkqqk; //是否录入考勤情况

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu203_ID")

	public Long getEdu203_ID() {
		return Edu203_ID;
	}

	public void setEdu203_ID(Long edu203_ID) {
		Edu203_ID = edu203_ID;
	}

	public String getEdu202_ID() {
		return Edu202_ID;
	}

	public void setEdu202_ID(String edu202_ID) {
		Edu202_ID = edu202_ID;
	}

	public String getKjid() {
		return kjid;
	}

	public void setKjid(String kjid) {
		this.kjid = kjid;
	}

	public String getKjmc() {
		return kjmc;
	}

	public void setKjmc(String kjmc) {
		this.kjmc = kjmc;
	}

	public String getXqid() {
		return xqid;
	}

	public void setXqid(String xqid) {
		this.xqid = xqid;
	}

	public String getXqmc() {
		return xqmc;
	}

	public void setXqmc(String xqmc) {
		this.xqmc = xqmc;
	}

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}

	public String getKsz() {
		return ksz;
	}

	public void setKsz(String ksz) {
		this.ksz = ksz;
	}

	public String getJsz() {
		return jsz;
	}

	public void setJsz(String jsz) {
		this.jsz = jsz;
	}

	public String getEdu101_id() {
		return Edu101_id;
	}

	public void setEdu101_id(String edu101_id) {
		Edu101_id = edu101_id;
	}

	public String getTeacherName() {
		return teacherName;
	}

	public void setTeacherName(String teacherName) {
		this.teacherName = teacherName;
	}

	public String getTeacherType() {
		return teacherType;
	}

	public void setTeacherType(String teacherType) {
		this.teacherType = teacherType;
	}

	public String getLocalId() {
		return localId;
	}

	public void setLocalId(String localId) {
		this.localId = localId;
	}

	public String getLocalName() {
		return localName;
	}

	public void setLocalName(String localName) {
		this.localName = localName;
	}

	public String getPointId() {
		return pointId;
	}

	public void setPointId(String pointId) {
		this.pointId = pointId;
	}

	public String getPointName() {
		return pointName;
	}

	public void setPointName(String pointName) {
		this.pointName = pointName;
	}

	public String getSflrkqqk() {
		return sflrkqqk;
	}

	public void setSflrkqqk(String sflrkqqk) {
		this.sflrkqqk = sflrkqqk;
	}
}

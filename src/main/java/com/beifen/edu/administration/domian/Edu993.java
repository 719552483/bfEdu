package com.beifen.edu.administration.domian;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//通知表
@Entity
@Table(name = "Edu993")
public class Edu993 {
	private Long Edu993_ID;
	private String sfsyzs; // 是否首页展示
	private String tzzt; // 通知主体
	private String tzbt;// 通知标题
	private String fbsj;// 发布时间

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu993_ID")
	public Long getEdu993_ID() {
		return Edu993_ID;
	}

	public void setEdu993_ID(Long edu993_ID) {
		Edu993_ID = edu993_ID;
	}

	public String getSfsyzs() {
		return sfsyzs;
	}

	public void setSfsyzs(String sfsyzs) {
		this.sfsyzs = sfsyzs;
	}

	// 指定blob字段
	@Lob
	@Basic(fetch = FetchType.LAZY)
	public String getTzzt() {
		return tzzt;
	}

	public void setTzzt(String tzzt) {
		this.tzzt = tzzt;
	}

	public String getTzbt() {
		return tzbt;
	}

	public void setTzbt(String tzbt) {
		this.tzbt = tzbt;
	}

	public String getFbsj() {
		return fbsj;
	}

	public void setFbsj(String fbsj) {
		this.fbsj = fbsj;
	}

}

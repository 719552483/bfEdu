package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//用戶表
@Entity
@Table(name = "Edu990")
public class Edu990 {
	private Long BF990_ID;
	private String js; // 角色类型
	private String mm; // 密码
	private String yhm; // 用户名
	private String scdlsj; // 上次登录时间
	private String yxkjfs; //已选快捷方式

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "BF990_ID")
	public Long getBF990_ID() {
		return BF990_ID;
	}

	public void setBF990_ID(Long bF990_ID) {
		BF990_ID = bF990_ID;
	}

	public String getJs() {
		return js;
	}

	public void setJs(String js) {
		this.js = js;
	}

	public String getMm() {
		return mm;
	}

	public void setMm(String mm) {
		this.mm = mm;
	}

	public String getYhm() {
		return yhm;
	}

	public void setYhm(String yhm) {
		this.yhm = yhm;
	}

	public String getScdlsj() {
		return scdlsj;
	}

	public void setScdlsj(String scdlsj) {
		this.scdlsj = scdlsj;
	}

	public String getYxkjfs() {
		return yxkjfs;
	}

	public void setYxkjfs(String yxkjfs) {
		this.yxkjfs = yxkjfs;
	}

}

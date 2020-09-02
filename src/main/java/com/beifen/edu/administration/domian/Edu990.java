package com.beifen.edu.administration.domian;

import javax.persistence.*;

//用戶表
@Entity
@Table(name = "Edu990")
public class Edu990 {
	private Long BF990_ID;
	private String js; // 角色名称
	private String jsId; // 角色id
	private String deparmentIds;//关联二级学院
	private String deparmentNames;//关联二级学院名称
	private String mm; // 密码
	private String yhm; // 用户名
	private String scdlsj; // 上次登录时间
	private String yxkjfs; //已选快捷方式
	private String userKey;//系统内人员主键
	private String userName;//系统内人员名称

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

	public String getDeparmentIds() {
		return deparmentIds;
	}

	public void setDeparmentIds(String deparmentIds) {
		this.deparmentIds = deparmentIds;
	}

	public String getDeparmentNames() {
		return deparmentNames;
	}

	public void setDeparmentNames(String deparmentNames) {
		this.deparmentNames = deparmentNames;
	}

	// 指定blob字段
	@Lob
	@Basic(fetch = FetchType.LAZY)
	public String getYxkjfs() {
		return yxkjfs;
	}

	public void setYxkjfs(String yxkjfs) {
		this.yxkjfs = yxkjfs;
	}

	public String getUserKey() {
		return userKey;
	}

	public void setUserKey(String userKey) {
		this.userKey = userKey;
	}

	public String getJsId() {
		return jsId;
	}

	public void setJsId(String jsId) {
		this.jsId = jsId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
}

package com.beifen.edu.administration.domian;

import javax.persistence.*;

//系统用户操作日志表
@Entity
@Table(name = "Edu996")
public class Edu996 {
	private Long Edu996_ID; //日志ID
	private String user_ID;//用户ID
	private String user_name;//用户姓名
	private Integer actionKey;//操作参数
	private String actionValue;//操作名称
	private Integer bussinsneType;//业务类型
	private String bussinsneValue;//业务类型
	private String bussinsneinfo;//业务信息
	private String time;//访问时间
	private String operationalInfo;//操作信息


	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu996_ID")
	public Long getEdu996_ID() {
		return Edu996_ID;
	}

	public void setEdu996_ID(Long edu996_ID) {
		Edu996_ID = edu996_ID;
	}

	public String getUser_ID() {
		return user_ID;
	}

	public void setUser_ID(String user_ID) {
		this.user_ID = user_ID;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public Integer getActionKey() {
		return actionKey;
	}

	public void setActionKey(Integer actionKey) {
		this.actionKey = actionKey;
	}

	public String getActionValue() {
		return actionValue;
	}

	public void setActionValue(String actionValue) {
		this.actionValue = actionValue;
	}

	public Integer getBussinsneType() {
		return bussinsneType;
	}

	public void setBussinsneType(Integer bussinsneType) {
		this.bussinsneType = bussinsneType;
	}

	public String getBussinsneinfo() {
		return bussinsneinfo;
	}

	public void setBussinsneinfo(String bussinsneinfo) {
		this.bussinsneinfo = bussinsneinfo;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getBussinsneValue() {
		return bussinsneValue;
	}

	public void setBussinsneValue(String bussinsneValue) {
		this.bussinsneValue = bussinsneValue;
	}

	public String getOperationalInfo() {
		return operationalInfo;
	}

	public void setOperationalInfo(String operationalInfo) {
		this.operationalInfo = operationalInfo;
	}
}
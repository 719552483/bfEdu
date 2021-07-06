package com.beifen.edu.administration.domian;

import javax.persistence.*;

//操作记录表
@Entity
@Table(name = "Edu999")
public class Edu999 {
	private Long Edu999_ID; //任务书ID
	private String user_ID;//用户ID
	private String interface_name;//接口名
	private String param_value;//参数名
	private String time;//访问时间


	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu999_ID")
	public Long getEdu999_ID() {
		return Edu999_ID;
	}

	public void setEdu999_ID(Long edu999_ID) {
		Edu999_ID = edu999_ID;
	}

	public String getUser_ID() {
		return user_ID;
	}

	public void setUser_ID(String user_ID) {
		this.user_ID = user_ID;
	}

	public String getInterface_name() {
		return interface_name;
	}

	public void setInterface_name(String interface_name) {
		this.interface_name = interface_name;
	}

	public String getParam_value() {
		return param_value;
	}

	public void setParam_value(String param_value) {
		this.param_value = param_value;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}
}
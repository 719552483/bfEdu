package com.beifen.edu.administration.domian;

import javax.persistence.*;

//学年表
@Entity
@Table(name = "Edu402")
public class Edu402 {
	private Long Edu402_ID;//主键
	private String jsmc; //角色名称
	private String jsid;//角色ID

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu402_ID")
	public Long getEdu402_ID() {
		return Edu402_ID;
	}
	public void setEdu402_ID(Long Edu402_ID) {
		Edu402_ID = Edu402_ID;
	}
	public String getJsmc() {
		return jsmc;
	}

	public void setJsmc(String jsmc) {
		this.jsmc = jsmc;
	}

	public String getJsid() {
		return jsid;
	}

	public void setJsid(String jsid) {
		this.jsid = jsid;
	}
}
package com.beifen.edu.administration.domian;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//二级代码表
@Entity
@Table(name = "Edu000")
public class Edu000  implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long BF000_ID;
	private String ejdmglzd;  //二级代码关联字段
	private String ejdm;//二级代码
	private String ejdmz;  //二级代码值
	private String ejdmmc; //二级代码名称
	private String yxbz; //有效标志
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "BF000_ID")
	public Long getBF000_ID() {
		return BF000_ID;
	}
	public void setBF000_ID(Long bF000_ID) {
		BF000_ID = bF000_ID;
	}
	
	public String getEjdmglzd() {
		return ejdmglzd;
	}

	public void setEjdmglzd(String ejdmglzd) {
		this.ejdmglzd = ejdmglzd;
	}
	public String getEjdmz() {
		return ejdmz;
	}
	public void setEjdmz(String ejdmz) {
		this.ejdmz = ejdmz;
	}
	public String getEjdmmc() {
		return ejdmmc;
	}
	public void setEjdmmc(String ejdmmc) {
		this.ejdmmc = ejdmmc;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	public String getEjdm() {
		return ejdm;
	}
	public void setEjdm(String ejdm) {
		this.ejdm = ejdm;
	}
	
	
	
}

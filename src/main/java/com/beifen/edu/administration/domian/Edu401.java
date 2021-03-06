package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;

//课节表
@Entity
@Table(name = "Edu401")
public class Edu401 implements Serializable {
	private Long Edu401_ID;
	private String kjsx; //课节顺序
	private String kjmc; //课节名称
	private String sjd; //时间段

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu401_ID")
	public Long getEdu401_ID() {
		return Edu401_ID;
	}
	public void setEdu401_ID(Long edu401_ID) {
		Edu401_ID = edu401_ID;
	}
	public String getKjsx() {
		return kjsx;
	}
	public void setKjsx(String kjsx) {
		this.kjsx = kjsx;
	}
	public String getKjmc() {
		return kjmc;
	}
	public void setKjmc(String kjmc) {
		this.kjmc = kjmc;
	}
	public String getSjd() {
		return sjd;
	}
	public void setSjd(String sjd) {
		this.sjd = sjd;
	}

	
	
}
package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import java.io.Serializable;


@Entity
@Table(name = "Edu104")
public class Edu104 implements Serializable {
 //系部关系管理
	private  Long Edu104_ID; 	
	private  String xbmc;//系部名称
	private  String xbbm;//系部编码
	private  String yxbz;//有效标志
	private  String iskk;//是否为开课部门
	private  String ispk;//是否为排课部门


	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu104_ID")
	public Long getEdu104_ID() {
		return Edu104_ID;
	}
	public void setEdu104_ID(Long edu104_ID) {
		Edu104_ID = edu104_ID;
	}

	public String getXbmc() {
		return xbmc;
	}
	public void setXbmc(String xbmc) {
		this.xbmc = xbmc;
	}
	public String getXbbm() {
		return xbbm;
	}
	public void setXbbm(String xbbm) {
		this.xbbm = xbbm;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}

	public String getIskk() {
		return iskk;
	}

	public void setIskk(String iskk) {
		this.iskk = iskk;
	}

	public String getIspk() {
		return ispk;
	}

	public void setIspk(String ispk) {
		this.ispk = ispk;
	}
}

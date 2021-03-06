package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


@Entity
@Table(name = "Edu106")
public class Edu106 {

	private Long Edu106_ID;
	private Long Edu104_ID;//学院ID
	private String zybm;//专业编码
	private String zymc;//专业名称
	private String yxbz;//有效标志
	private String departmentName;//学院名称

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu106_ID")
	public Long getEdu106_ID() {
		return Edu106_ID;
	}
	public void setEdu106_ID(Long edu106_ID) {
		Edu106_ID = edu106_ID;
	}
	public String getZybm() {
		return zybm;
	}
	public void setZybm(String zybm) {
		this.zybm = zybm;
	}
	public String getZymc() {
		return zymc;
	}
	public void setZymc(String zymc) {
		this.zymc = zymc;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}

	public Long getEdu104_ID() {
		return Edu104_ID;
	}

	public void setEdu104_ID(Long edu104_ID) {
		Edu104_ID = edu104_ID;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
}

package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


@Entity
@Table(name = "Edu107")
public class Edu107 {

	//层次关系维护表
	private  Long Edu107_ID; 	
	private  String pyjhmc;//培养计划名称 
	private  String edu103mc;//培养层次名称 
	private  String edu103;//培养层次id
	private  String edu104mc;//系部名称
	private  String edu104;//系部id
	private  String edu105;//年级id
	private  String edu105mc;//年级名称
	private  String edu106;//专业id
	private  String edu106mc;//专业名称
	private  String yxbz;//有效标志
	private  String xbsp;//系部审批
	private String batch;// 批次代码
	private String batchName; //批次名称
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu107_ID")
	public Long getEdu107_ID() {
		return Edu107_ID;
	}
	public void setEdu107_ID(Long edu107_ID) {
		Edu107_ID = edu107_ID;
	}
	public String getEdu103() {
		return edu103;
	}
	public void setEdu103(String edu103) {
		this.edu103 = edu103;
	}
	public String getEdu103mc() {
		return edu103mc;
	}
	public void setEdu103mc(String edu103mc) {
		this.edu103mc = edu103mc;
	}
	public String getEdu104() {
		return edu104;
	}
	public void setEdu104(String edu104) {
		this.edu104 = edu104;
	}
	public String getEdu104mc() {
		return edu104mc;
	}
	public void setEdu104mc(String edu104mc) {
		this.edu104mc = edu104mc;
	}
	public String getEdu105() {
		return edu105;
	}
	public void setEdu105(String edu105) {
		this.edu105 = edu105;
	}
	public String getEdu105mc() {
		return edu105mc;
	}
	public void setEdu105mc(String edu105mc) {
		this.edu105mc = edu105mc;
	}
	public String getEdu106() {
		return edu106;
	}
	public void setEdu106(String edu106) {
		this.edu106 = edu106;
	}


	public String getPyjhmc() {
		return pyjhmc;
	}
	public void setPyjhmc(String pyjhmc) {
		this.pyjhmc = pyjhmc;
	}
	public String getEdu106mc() {
		return edu106mc;
	}
	public void setEdu106mc(String edu106mc) {
		this.edu106mc = edu106mc;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}

	public String getXbsp() {
		return xbsp;
	}

	public void setXbsp(String xbsp) {
		this.xbsp = xbsp;
	}

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public String getBatchName() {
		return batchName;
	}

	public void setBatchName(String batchName) {
		this.batchName = batchName;
	}
}

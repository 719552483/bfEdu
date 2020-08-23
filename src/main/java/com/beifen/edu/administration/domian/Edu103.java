package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu103")
public class Edu103 {
    //培养层次管理表
	//该表对应的是培养层次，如全日制 全日制二年中职等
	private  Long Edu103_ID; 	
//	private  String xq; //校区
	private  String pyccmc;//培养层次名称 
	private  String pyccbm;//培养层次编码
	private  String xz; //学制
	private  String rxjj; //入学季节
	private  String yxbz; //有效标志
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu103_ID")
	public Long getEdu103_ID() {
		return Edu103_ID;
	}
	public void setEdu103_ID(Long edu103_ID) {
		Edu103_ID = edu103_ID;
	}
//	public String getXq() {
//		return xq;
//	}
//	public void setXq(String xq) {
//		this.xq = xq;
//	}
	public String getPyccmc() {
		return pyccmc;
	}
	public void setPyccmc(String pyccmc) {
		this.pyccmc = pyccmc;
	}
	public String getXz() {
		return xz;
	}
	public void setXz(String xz) {
		this.xz = xz;
	}
	public String getRxjj() {
		return rxjj;
	}
	public void setRxjj(String rxjj) {
		this.rxjj = rxjj;
	}
	public String getPyccbm() {
		return pyccbm;
	}
	public void setPyccbm(String pyccbm) {
		this.pyccbm = pyccbm;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}

	

	
	

	

	
	
}

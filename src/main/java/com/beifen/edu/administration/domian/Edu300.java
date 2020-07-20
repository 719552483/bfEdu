package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//行政班表
@Entity
@Table(name = "Edu300")
public class Edu300 {
	private Long Edu300_ID;
	private String xzbmc;  //行政班名称
	private String xzbbm;  //行政班编码
	private  String xzbbh;//行政班班号
	private  String pyccmc;//培养层次名称 
	private  String pyccbm;//培养层次编码
	private  String xbmc;//系部名称
	private  String xbbm;//系部编码
	private  String njbm;//年级编码
	private  String njmc;//年级名称
	private  String zybm;//专业编码
	private  String zymc;//专业名称
	private  String xqmc;//校区名称
	private  String xqbm;//校区编码
	private  int zxrs;//在校人数    -新增学生是分配行政班 改变行政班在校人数
	private  int rnrs;//容纳人数
	private String sfsckkjh;  //是否生成开课计划--
	private  String yxbz;//有效标志
	
	@Id                                                             
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu300_ID")
	public Long getEdu300_ID() {
		return Edu300_ID;
	}
	public void setEdu300_ID(Long edu300_ID) {
		Edu300_ID = edu300_ID;
	}
	public String getXzbmc() {
		return xzbmc;
	}
	public void setXzbmc(String xzbmc) {
		this.xzbmc = xzbmc;
	}
	public String getXzbbm() {
		return xzbbm;
	}
	public void setXzbbm(String xzbbm) {
		this.xzbbm = xzbbm;
	}
	public String getPyccmc() {
		return pyccmc;
	}
	public void setPyccmc(String pyccmc) {
		this.pyccmc = pyccmc;
	}
	public String getPyccbm() {
		return pyccbm;
	}
	public void setPyccbm(String pyccbm) {
		this.pyccbm = pyccbm;
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
	public String getNjbm() {
		return njbm;
	}
	public void setNjbm(String njbm) {
		this.njbm = njbm;
	}
	public String getNjmc() {
		return njmc;
	}
	public void setNjmc(String njmc) {
		this.njmc = njmc;
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
	public String getXqmc() {
		return xqmc;
	}
	public void setXqmc(String xqmc) {
		this.xqmc = xqmc;
	}
	public String getXqbm() {
		return xqbm;
	}
	public void setXqbm(String xqbm) {
		this.xqbm = xqbm;
	}
	public int getZxrs() {
		return zxrs;
	}
	public void setZxrs(int zxrs) {
		this.zxrs = zxrs;
	}
	public int getRnrs() {
		return rnrs;
	}
	public void setRnrs(int rnrs) {
		this.rnrs = rnrs;
	}
	
	
	
public String getSfsckkjh() {
		return sfsckkjh;
	}
	public void setSfsckkjh(String sfsckkjh) {
		this.sfsckkjh = sfsckkjh;
	}
	//	public String getBzrmc() {
//		return bzrmc;
//	}
//	public void setBzrmc(String bzrmc) {
//		this.bzrmc = bzrmc;
//	}
//	public String getBzrbm() {
//		return bzrbm;
//	}
//	public void setBzrbm(String bzrbm) {
//		this.bzrbm = bzrbm;
//	}
//	public String getFdymc() {
//		return fdymc;
//	}
//	public void setFdymc(String fdymc) {
//		this.fdymc = fdymc;
//	}
//	public String getFdybm() {
//		return fdybm;
//	}
//	public void setFdybm(String fdybm) {
//		this.fdybm = fdybm;
//	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	public String getXzbbh() {
		return xzbbh;
	}
	public void setXzbbh(String xzbbh) {
		this.xzbbh = xzbbh;
	}
	
	
}

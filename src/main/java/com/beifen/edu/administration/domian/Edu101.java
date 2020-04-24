package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;



@Entity
@Table(name = "Edu101")
public class Edu101 {
 //教师基本信息表
	
	
	private  long Edu101_ID; 	
	private  String jgh; //教工号
	private  String jsxm; //教师姓名
	private  String sfzh; //身份证号
	private  String xb;//教师性别  M男F女
	private  String bjnd;//班级年度
	private  String csrq;//出生日期
	private  String nl;//年龄
	private  String hf;//婚否 T已婚 F未婚
	private  String mz;//民族
	private  String xl;//学历
	private  String xw;//学位
	private  String dxsj;//到校时间
	private  String lxfs;//联系方式
	private  String ssyx; //所属院系，指该教师属于哪个学院的
	private  String yxbz;
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu101_ID")
	public long getEdu101_ID() {
		return Edu101_ID;
	}
	public void setEdu101_ID(long edu101_ID) {
		Edu101_ID = edu101_ID;
	}
	public String getJgh() {
		return jgh;
	}
	public void setJgh(String jgh) {
		this.jgh = jgh;
	}
	public String getJsxm() {
		return jsxm;
	}
	public void setJsxm(String jsxm) {
		this.jsxm = jsxm;
	}
	public String getSfzh() {
		return sfzh;
	}
	public void setSfzh(String sfzh) {
		this.sfzh = sfzh;
	}
	public String getXb() {
		return xb;
	}
	public void setXb(String xb) {
		this.xb = xb;
	}
	public String getBjnd() {
		return bjnd;
	}
	public void setBjnd(String bjnd) {
		this.bjnd = bjnd;
	}
	public String getCsrq() {
		return csrq;
	}
	public void setCsrq(String csrq) {
		this.csrq = csrq;
	}
	public String getNl() {
		return nl;
	}
	public void setNl(String nl) {
		this.nl = nl;
	}
	public String getHf() {
		return hf;
	}
	public void setHf(String hf) {
		this.hf = hf;
	}
	public String getMz() {
		return mz;
	}
	public void setMz(String mz) {
		this.mz = mz;
	}
	public String getXl() {
		return xl;
	}
	public void setXl(String xl) {
		this.xl = xl;
	}
	public String getXw() {
		return xw;
	}
	public void setXw(String xw) {
		this.xw = xw;
	}
	public String getDxsj() {
		return dxsj;
	}
	public void setDxsj(String dxsj) {
		this.dxsj = dxsj;
	}
	public String getLxfs() {
		return lxfs;
	}
	public void setLxfs(String lxfs) {
		this.lxfs = lxfs;
	}
	public String getSsyx() {
		return ssyx;
	}
	public void setSsyx(String ssyx) {
		this.ssyx = ssyx;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}//有效标志
	
	
	

	

	
	
}

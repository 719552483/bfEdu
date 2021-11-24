package com.beifen.edu.administration.domian;


import javax.persistence.*;

//学生就业信息表
@Entity
@Table(name = "Edu0011")
public class Edu0011 {
	private  Long Edu0011_ID;
	private  Long Edu001_ID;
	private  String pycc;//培养层次编码
	private  String pyccmc;//培养层次名称
	private  String szxb;//所在系部编码
	private  String szxbmc;//所在系部名称
	private  String nj; //年级编码
	private  String njmc; //年级名称
	private  String zybm; //专业编码
	private  String zymc;//专业名称
	private  String Edu300_ID; //行政班ID
	private  String xzbname; //行政班名称
	private  String xm; //学生姓名
	private  String jyxs;//就业形式
	private  String jyxsbm;//就业形式编码
	private  String dwmc;//单位名称
	private  String dwlxr;//单位联系人
	private  String dwlxdh;//单位联系电话
	private  String dwdz;//单位地址
	private  String bz;//备注
	private  String sclr;//首次录入
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu0011_ID")
	public Long getEdu0011_ID() {
		return Edu0011_ID;
	}
	public void setEdu0011_ID(Long edu0011_ID) {
		Edu0011_ID = edu0011_ID;
	}

	public Long getEdu001_ID() {
		return Edu001_ID;
	}

	public void setEdu001_ID(Long edu001_ID) {
		Edu001_ID = edu001_ID;
	}

	public String getPycc() {
		return pycc;
	}

	public void setPycc(String pycc) {
		this.pycc = pycc;
	}

	public String getPyccmc() {
		return pyccmc;
	}

	public void setPyccmc(String pyccmc) {
		this.pyccmc = pyccmc;
	}

	public String getSzxb() {
		return szxb;
	}

	public void setSzxb(String szxb) {
		this.szxb = szxb;
	}

	public String getSzxbmc() {
		return szxbmc;
	}

	public void setSzxbmc(String szxbmc) {
		this.szxbmc = szxbmc;
	}

	public String getNj() {
		return nj;
	}

	public void setNj(String nj) {
		this.nj = nj;
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

	public String getEdu300_ID() {
		return Edu300_ID;
	}

	public void setEdu300_ID(String edu300_ID) {
		Edu300_ID = edu300_ID;
	}

	public String getXzbname() {
		return xzbname;
	}

	public void setXzbname(String xzbname) {
		this.xzbname = xzbname;
	}

	public String getXm() {
		return xm;
	}

	public void setXm(String xm) {
		this.xm = xm;
	}

	public String getJyxs() {
		return jyxs;
	}

	public void setJyxs(String jyxs) {
		this.jyxs = jyxs;
	}

	public String getJyxsbm() {
		return jyxsbm;
	}

	public void setJyxsbm(String jyxsbm) {
		this.jyxsbm = jyxsbm;
	}

	public String getDwmc() {
		return dwmc;
	}

	public void setDwmc(String dwmc) {
		this.dwmc = dwmc;
	}

	public String getDwlxr() {
		return dwlxr;
	}

	public void setDwlxr(String dwlxr) {
		this.dwlxr = dwlxr;
	}

	public String getDwlxdh() {
		return dwlxdh;
	}

	public void setDwlxdh(String dwlxdh) {
		this.dwlxdh = dwlxdh;
	}

	public String getDwdz() {
		return dwdz;
	}

	public void setDwdz(String dwdz) {
		this.dwdz = dwdz;
	}

	public String getBz() {
		return bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getSclr() {
		return sclr;
	}

	public void setSclr(String sclr) {
		this.sclr = sclr;
	}
}

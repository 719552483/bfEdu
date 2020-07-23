package com.beifen.edu.administration.domian;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


//学生基本信息表
@Entity
@Table(name = "Edu001")
public class Edu001 {
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
	private  String Edu301_ID;//教学班ID
	private  String jxbname;//教学班名称
	private  String xh; //学号
	private  String xm; //学生姓名
	private  String zym; //曾用名
	private  String xb;//性别
	private  String zt;//状态
	private  String ztCode;//状态编码
	private  String csrq;//出生日期
	private  String nl; //年龄
	private  String sfzh;//身份证号 
	private  String mz;//民族
	private  String mzbm;//民族编码
	private  String sfyxj;//是否有学籍
	private  String xjh;//学籍号
	private  String zzmm;//政治面貌
	private  String zzmmbm;//政治面貌编码
	private  String syd;//生源地
	private  String whcd;//文化程度
	private  String whcdbm;//文化程度编码
	private  String sylx;//生源类型
	private  String sylxbm;//生源类型编码
	private  String ksh;//考生号
	private  String rxzf;//入学总分
	private  String rxsj;//入学时间
	private  String byzh;//毕业证号
	private  String zkzh;//准考证号
	private  String sjhm;//手机号码
	private  String email;//email
	private  String jg;//籍贯
	private  String sg;//身高
	private  String tz;//体重
	private  String hf;//婚否
	private  String zsfs;//招生方式
	private  String zsfscode;//招生方式编码
	private  String dxpy;//定向培养
	private  String pkjt;//贫困家庭
	private  String jtzz;//家庭住址
	private  String zjxy;//宗教信仰
	private  String zy; //职业
	private  String bz;//备注
	private  String yxbz;//有效标志
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu001_ID")
	public Long getEdu001_ID() {
		return Edu001_ID;
	}
	public void setEdu001_ID(Long edu001_ID) {
		Edu001_ID = edu001_ID;
	}
	public String getXh() {
		return xh;
	}
	public void setXh(String xh) {
		this.xh = xh;
	}
	public String getXm() {
		return xm;
	}
	public void setXm(String xm) {
		this.xm = xm;
	}
	public String getNl() {
		return nl;
	}
	public void setNl(String nl) {
		this.nl = nl;
	}
	public String getXb() {
		return xb;
	}
	public void setXb(String xb) {
		this.xb = xb;
	}
	public String getZy() {
		return zy;
	}
	public void setZy(String zy) {
		this.zy = zy;
	}
	public String getNj() {
		return nj;
	}
	public void setNj(String nj) {
		this.nj = nj;
	}
	public String getCsrq() {
		return csrq;
	}
	public void setCsrq(String csrq) {
		this.csrq = csrq;
	}
	public String getHf() {
		return hf;
	}
	public void setHf(String hf) {
		this.hf = hf;
	}
	public String getZt() {
		return zt;
	}
	public void setZt(String zt) {
		this.zt = zt;
	}
	public String getZtCode() {
		return ztCode;
	}
	public void setZtCode(String ztCode) {
		this.ztCode = ztCode;
	}

	public String getPycc() {
		return pycc;
	}
	public void setPycc(String pycc) {
		this.pycc = pycc;
	}
	public String getSzxb() {
		return szxb;
	}
	public void setSzxb(String szxb) {
		this.szxb = szxb;
	}
	public String getZymc() {
		return zymc;
	}
	public void setZymc(String zymc) {
		this.zymc = zymc;
	}
	public String getSfzh() {
		return sfzh;
	}
	public void setSfzh(String sfzh) {
		this.sfzh = sfzh;
	}
	public String getMz() {
		return mz;
	}
	public void setMz(String mz) {
		this.mz = mz;
	}
	public String getZzmm() {
		return zzmm;
	}
	public void setZzmm(String zzmm) {
		this.zzmm = zzmm;
	}
	public String getSyd() {
		return syd;
	}
	public void setSyd(String syd) {
		this.syd = syd;
	}
	public String getWhcd() {
		return whcd;
	}
	public void setWhcd(String whcd) {
		this.whcd = whcd;
	}
	public String getYxbz() {
		return yxbz;
	}
	public void setYxbz(String yxbz) {
		this.yxbz = yxbz;
	}
	public String getRxsj() {
		return rxsj;
	}
	public void setRxsj(String rxsj) {
		this.rxsj = rxsj;
	}
//	public String getEdu300_ID() {
//		return Edu300_ID;
//	}
//	public void setEdu300_ID(String edu300_ID) {
//		Edu300_ID = edu300_ID;
//	}
	public String getEdu301_ID() {
		return Edu301_ID;
	}
	public void setEdu301_ID(String edu301_ID) {
		Edu301_ID = edu301_ID;
	}
	public String getXzbname() {
		return xzbname;
	}
	public void setXzbname(String xzbname) {
		this.xzbname = xzbname;
	}
	public String getJxbname() {
		return jxbname;
	}
	public void setJxbname(String jxbname) {
		this.jxbname = jxbname;
	}
	public String getPyccmc() {
		return pyccmc;
	}
	public void setPyccmc(String pyccmc) {
		this.pyccmc = pyccmc;
	}
	public String getSzxbmc() {
		return szxbmc;
	}
	public void setSzxbmc(String szxbmc) {
		this.szxbmc = szxbmc;
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
	public String getMzbm() {
		return mzbm;
	}
	public void setMzbm(String mzbm) {
		this.mzbm = mzbm;
	}
	public String getZzmmbm() {
		return zzmmbm;
	}
	public void setZzmmbm(String zzmmbm) {
		this.zzmmbm = zzmmbm;
	}
	public String getWhcdbm() {
		return whcdbm;
	}
	public void setWhcdbm(String whcdbm) {
		this.whcdbm = whcdbm;
	}
	public String getZym() {
		return zym;
	}
	public void setZym(String zym) {
		this.zym = zym;
	}
	public String getSfyxj() {
		return sfyxj;
	}
	public void setSfyxj(String sfyxj) {
		this.sfyxj = sfyxj;
	}
	public String getXjh() {
		return xjh;
	}
	public void setXjh(String xjh) {
		this.xjh = xjh;
	}
	public String getKsh() {
		return ksh;
	}
	public void setKsh(String ksh) {
		this.ksh = ksh;
	}
	public String getRxzf() {
		return rxzf;
	}
	public void setRxzf(String rxzf) {
		this.rxzf = rxzf;
	}
	public String getByzh() {
		return byzh;
	}
	public void setByzh(String byzh) {
		this.byzh = byzh;
	}
	public String getZkzh() {
		return zkzh;
	}
	public void setZkzh(String zkzh) {
		this.zkzh = zkzh;
	}
	public String getSjhm() {
		return sjhm;
	}
	public void setSjhm(String sjhm) {
		this.sjhm = sjhm;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getJg() {
		return jg;
	}
	public void setJg(String jg) {
		this.jg = jg;
	}
	public String getSg() {
		return sg;
	}
	public void setSg(String sg) {
		this.sg = sg;
	}
	public String getTz() {
		return tz;
	}
	public void setTz(String tz) {
		this.tz = tz;
	}
	
	public String getSylx() {
		return sylx;
	}
	public void setSylx(String sylx) {
		this.sylx = sylx;
	}
	public String getSylxbm() {
		return sylxbm;
	}
	public void setSylxbm(String sylxbm) {
		this.sylxbm = sylxbm;
	}
	public String getZsfs() {
		return zsfs;
	}
	public void setZsfs(String zsfs) {
		this.zsfs = zsfs;
	}
	public String getDxpy() {
		return dxpy;
	}
	public void setDxpy(String dxpy) {
		this.dxpy = dxpy;
	}
	public String getPkjt() {
		return pkjt;
	}
	public void setPkjt(String pkjt) {
		this.pkjt = pkjt;
	}
	public String getJtzz() {
		return jtzz;
	}
	public void setJtzz(String jtzz) {
		this.jtzz = jtzz;
	}
	public String getZjxy() {
		return zjxy;
	}
	public void setZjxy(String zjxy) {
		this.zjxy = zjxy;
	}
	public String getBz() {
		return bz;
	}
	public void setBz(String bz) {
		this.bz = bz;
	}
	public String getZsfscode() {
		return zsfscode;
	}
	public void setZsfscode(String zsfscode) {
		this.zsfscode = zsfscode;
	}
	public String getEdu300_ID() {
		return Edu300_ID;
	}
	public void setEdu300_ID(String edu300_ID) {
		Edu300_ID = edu300_ID;
	}
	
	
}

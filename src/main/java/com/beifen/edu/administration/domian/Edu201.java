package com.beifen.edu.administration.domian;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

//教学任务书表
@Entity
@Table(name = "Edu201")
public class Edu201 {
	private Long Edu201_ID; //任务书ID
	private Long classId;  //教学班ID
	private Long Edu108_ID;  //培养计划ID
	private String pyjhmc;//培养计划名称
	private String sffbjxrws;  //是否发布教学任务书
	private	String classType; //班级类型
	private String className;  //班级名称
	private String kcmc;  //课程名称
	private String zymc;  //专业名称
	private String jxbrs;  //教学班人数
	private String xn;//学年
	private String xnid;//学年ID
	private String zxs;  //总学时
	private Double llxs;  //理论学时
	private Double sjxs;  //实践学时
	private Double fsxs;  //分散学时
	private Double jzxs;  //集中学时
	private  String ls;//老师
	private  String lsmc;//老师姓名
	private  String zyls;//主要老师
	private  String zylsmc;//主要老师姓名
	private String pkbm;  //排课部门
	private String pkbmCode;  //排课部门编码
	private String kkbm;  //开课部门
	private String kkbmCode;  //开课部门编码
	private String sfxylcj;  //是否需要录成绩
	private String sfsqks; //是否申请考试
	private String sszt;  //审核状态
	private String fkyj;  //反馈意见
	private String sfypk;  //是否已排课
	private Double xf;//学分
	private String fbsj; //发布时间
	private String pksj; //排课时间
	private String jksj; //结课时间
	private String Edu104_ID;//学院id
	private String Edu104_mc;//学院名称
	private String classLittleName;//教学班别名
	private String bjsl;//班级数量
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu201_ID")
	public Long getEdu201_ID() {
		return Edu201_ID;
	}
	public void setEdu201_ID(Long edu201_ID) {
		Edu201_ID = edu201_ID;
	}

	public Long getClassId() {
		return classId;
	}

	public void setClassId(Long classId) {
		this.classId = classId;
	}

	public Long getEdu108_ID() {
		return Edu108_ID;
	}
	public void setEdu108_ID(Long edu108_ID) {
		Edu108_ID = edu108_ID;
	}
	public String getLs() {
		return ls;
	}
	public void setLs(String ls) {
		this.ls = ls;
	}
	public String getZyls() {
		return zyls;
	}
	public void setZyls(String zyls) {
		this.zyls = zyls;
	}
	public String getPkbm() {
		return pkbm;
	}
	public void setPkbm(String pkbm) {
		this.pkbm = pkbm;
	}
	public String getPkbmCode() {
		return pkbmCode;
	}
	public void setPkbmCode(String pkbmCode) {
		this.pkbmCode = pkbmCode;
	}
	public String getSfxylcj() {
		return sfxylcj;
	}
	public void setSfxylcj(String sfxylcj) {
		this.sfxylcj = sfxylcj;
	}
	public String getLsmc() {
		return lsmc;
	}
	public void setLsmc(String lsmc) {
		this.lsmc = lsmc;
	}
	public String getZylsmc() {
		return zylsmc;
	}
	public void setZylsmc(String zylsmc) {
		this.zylsmc = zylsmc;
	}

	public String getKcmc() {
		return kcmc;
	}
	public void setKcmc(String kcmc) {
		this.kcmc = kcmc;
	}
	public String getZymc() {
		return zymc;
	}
	public void setZymc(String zymc) {
		this.zymc = zymc;
	}
	public String getJxbrs() {
		return jxbrs;
	}
	public void setJxbrs(String jxbrs) {
		this.jxbrs = jxbrs;
	}
	public String getZxs() {
		return zxs;
	}
	public void setZxs(String zxs) {
		this.zxs = zxs;
	}
	public String getKkbm() {
		return kkbm;
	}
	public void setKkbm(String kkbm) {
		this.kkbm = kkbm;
	}
	public String getKkbmCode() {
		return kkbmCode;
	}
	public void setKkbmCode(String kkbmCode) {
		this.kkbmCode = kkbmCode;
	}
	public String getSszt() {
		return sszt;
	}
	public void setSszt(String sszt) {
		this.sszt = sszt;
	}
	public String getFkyj() {
		return fkyj;
	}
	public void setFkyj(String fkyj) {
		this.fkyj = fkyj;
	}
	public String getSfypk() {
		return sfypk;
	}
	public void setSfypk(String sfypk) {
		this.sfypk = sfypk;
	}

	public String getSffbjxrws() {
		return sffbjxrws;
	}

	public void setSffbjxrws(String sffbjxrws) {
		this.sffbjxrws = sffbjxrws;
	}

	public String getClassType() {
		return classType;
	}

	public void setClassType(String classType) {
		this.classType = classType;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getSfsqks() {
		return sfsqks;
	}

	public void setSfsqks(String sfsqks) {
		this.sfsqks = sfsqks;
	}

	public String getXn() {
		return xn;
	}

	public void setXn(String xn) {
		this.xn = xn;
	}

	public String getXnid() {
		return xnid;
	}

	public void setXnid(String xnid) {
		this.xnid = xnid;
	}

	public Double getXf() {
		return xf;
	}

	public void setXf(Double xf) {
		this.xf = xf;
	}

	public String getPyjhmc() {
		return pyjhmc;
	}

	public void setPyjhmc(String pyjhmc) {
		this.pyjhmc = pyjhmc;
	}

	public Double getLlxs() {
		return llxs;
	}

	public void setLlxs(Double llxs) {
		this.llxs = llxs;
	}

	public Double getSjxs() {
		return sjxs;
	}

	public void setSjxs(Double sjxs) {
		this.sjxs = sjxs;
	}

	public Double getFsxs() {
		return fsxs;
	}

	public void setFsxs(Double fsxs) {
		this.fsxs = fsxs;
	}

	public Double getJzxs() {
		return jzxs;
	}

	public void setJzxs(Double jzxs) {
		this.jzxs = jzxs;
	}

	public String getFbsj() {
		return fbsj;
	}

	public void setFbsj(String fbsj) {
		this.fbsj = fbsj;
	}

	public String getPksj() {
		return pksj;
	}

	public void setPksj(String pksj) {
		this.pksj = pksj;
	}

	public String getJksj() {
		return jksj;
	}

	public void setJksj(String jksj) {
		this.jksj = jksj;
	}

	public String getEdu104_ID() {
		return Edu104_ID;
	}

	public void setEdu104_ID(String edu104_ID) {
		Edu104_ID = edu104_ID;
	}

	public String getEdu104_mc() {
		return Edu104_mc;
	}

	public void setEdu104_mc(String edu104_mc) {
		Edu104_mc = edu104_mc;
	}

	public String getClassLittleName() {
		return classLittleName;
	}

	public void setClassLittleName(String classLittleName) {
		this.classLittleName = classLittleName;
	}

	public String getBjsl() {
		return bjsl;
	}

	public void setBjsl(String bjsl) {
		this.bjsl = bjsl;
	}
}

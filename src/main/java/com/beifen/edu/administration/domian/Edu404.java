package com.beifen.edu.administration.domian;

import javax.persistence.*;

//补考成绩时间表
@Entity
@Table(name = "Edu404")
public class Edu404 {
	private Long Edu404_ID;//id
	private String xnmc; //学年名称
	private String xnid;//学年id
	private String count;//补考次数
	private String status;//状态（0：开启/1：结束）
	private String startDateRange;//开始时间
	private String endDateRange;//结束时间
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "Edu404_ID")

	public Long getEdu404_ID() {
		return Edu404_ID;
	}

	public void setEdu404_ID(Long edu404_ID) {
		Edu404_ID = edu404_ID;
	}

	public String getXnmc() {
		return xnmc;
	}

	public void setXnmc(String xnmc) {
		this.xnmc = xnmc;
	}

	public String getXnid() {
		return xnid;
	}

	public void setXnid(String xnid) {
		this.xnid = xnid;
	}

	public String getCount() {
		return count;
	}

	public void setCount(String count) {
		this.count = count;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStartDateRange() {
		return startDateRange;
	}

	public void setStartDateRange(String startDateRange) {
		this.startDateRange = startDateRange;
	}

	public String getEndDateRange() {
		return endDateRange;
	}

	public void setEndDateRange(String endDateRange) {
		this.endDateRange = endDateRange;
	}
}
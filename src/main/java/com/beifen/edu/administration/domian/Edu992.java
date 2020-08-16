package com.beifen.edu.administration.domian;

import javax.persistence.*;

//用户角色关联表
@Entity
@Table(name = "Edu992")
public class Edu992 {
	private Long EDU992_ID;//主键
	private Long BF991_ID;//角色表主键
	private Long BF990_ID;//用户表主键

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
	@Column(name = "EDU992_ID")
	public Long getEDU992_ID() {
		return EDU992_ID;
	}

	public void setEDU992_ID(Long EDU992_ID) {
		this.EDU992_ID = EDU992_ID;
	}

	public Long getBF991_ID() {
		return BF991_ID;
	}

	public void setBF991_ID(Long BF991_ID) {
		this.BF991_ID = BF991_ID;
	}

	public Long getBF990_ID() {
		return BF990_ID;
	}

	public void setBF990_ID(Long BF990_ID) {
		this.BF990_ID = BF990_ID;
	}
}

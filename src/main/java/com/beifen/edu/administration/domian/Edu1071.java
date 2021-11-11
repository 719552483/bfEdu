package com.beifen.edu.administration.domian;


import javax.persistence.*;

//培养计划与行政班关联表
@Entity
@Table(name = "Edu1071")
public class Edu1071 {

	private Long Edu1071_ID;//主键ID
	private Long Edu107_ID; //培养计划ID
	private Long  Edu300_ID;//行政班ID
	private String className;//行政班名称

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BF_SEQUENCE")
	@SequenceGenerator(name = "BF_SEQUENCE", sequenceName = "BF_SEQUENCE")
    @Column(name = "Edu1071_ID")
	public Long getEdu1071_ID() {
		return Edu1071_ID;
	}
	public void setEdu1071_ID(Long edu1071_ID) {
		Edu1071_ID = edu1071_ID;
	}

	public Long getEdu107_ID() {
		return Edu107_ID;
	}

	public void setEdu107_ID(Long edu107_ID) {
		Edu107_ID = edu107_ID;
	}

	public Long getEdu300_ID() {
		return Edu300_ID;
	}

	public void setEdu300_ID(Long edu300_ID) {
		Edu300_ID = edu300_ID;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}
}

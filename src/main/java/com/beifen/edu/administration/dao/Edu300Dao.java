package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu300;


public interface Edu300Dao extends JpaRepository<Edu300, Long>, JpaSpecificationExecutor<Edu300>{
	//查询培养计划下的行政班
	@Query(value = "select * from edu300 e where pyccbm =?1 and xbbm=?2 and njbm =?3 and zybm=?4", nativeQuery = true)
	List<Edu300> queryCulturePlanAdministrationClasses(String levelCode, String departmentCode, String gradeCode,String majorCode);

	
	// 根据id删除专业
	@Transactional
	@Modifying
	@Query(value = "delete from edu300 where Edu300_ID =?1", nativeQuery = true)
	void removeAdministrationClass(String edu300id);
	
	//生成开课计划时修改行政班的开课计划属性
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu300 SET sfsckkjh =?2 WHERE Edu300_ID =?1", nativeQuery = true)
	void generatAdministrationCoursePlan(String edu300Id, String isGeneratCoursePlan);
}

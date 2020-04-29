package com.beifen.edu.administration.dao;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu301;

public interface Edu301Dao extends JpaRepository<Edu301, Long>, JpaSpecificationExecutor<Edu301>{

	// 根据id删除教学班
	@Transactional
	@Modifying
	@Query(value = "delete from edu301 where Edu301_ID =?1", nativeQuery = true)
	public void removeTeachingClassByID(String edu301id);

	//查询培养计划下的所有教学班
	@Query(value = "select * from edu301 e where pyccbm =?1 and xbbm=?2 and njbm =?3 and zybm=?4", nativeQuery = true)
	List<Edu301> getCulturePlanAllTeachingClasses(String levelCode, String departmentCode, String gradeCode, String majorCode);

	//修改教学班名称
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu301 SET jxbmc =?2 WHERE Edu301_ID =?1", nativeQuery = true)
	public void modifyTeachingClassName(String edu301id, String newName);
}

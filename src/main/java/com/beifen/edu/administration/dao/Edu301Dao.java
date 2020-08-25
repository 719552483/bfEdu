package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu301;

public interface Edu301Dao extends JpaRepository<Edu301, Long>, JpaSpecificationExecutor<Edu301> {

	// 根据id删除教学班
	@Transactional
	@Modifying
	@Query(value = "delete from edu301 where Edu301_ID =?1", nativeQuery = true)
	public void removeTeachingClassByID(String edu301id);

	// 查询培养计划下的所有教学班
	@Query(value = "select * from edu301 e where pyccbm =?1 and xbbm=?2 and njbm =?3 and zybm=?4", nativeQuery = true)
	List<Edu301> getCulturePlanAllTeachingClasses(String levelCode, String departmentCode, String gradeCode,
			String majorCode);

	// 修改教学班名称
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu301 SET jxbmc =?2 WHERE Edu301_ID =?1", nativeQuery = true)
	public void modifyTeachingClassName(String edu301id, String newName);

	// 根据行政班查询教学班
	@Query(value = "select * from edu301 e where e.bhxzbid like %?1%", nativeQuery = true)
	List<Edu301> queryTeachingClassByXzbCode(String xzbcode);

	// 根据301ID查询教学班
	@Query(value = "select * from edu301 where Edu301_ID =?1", nativeQuery = true)
	Edu301 queryJXBByEdu301ID(String edu301id);

	// 根据学生查询教学班
	@Query(value = "select * from edu301 e where e.bhxs_Code like %?1%", nativeQuery = true)
	public List<Edu301> queryTeachingClassByXSCode(String edu001Id);

	// 改变教学班人数
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu301 SET jxbrs =?2 WHERE Edu301_ID =?1", nativeQuery = true)
	public void changeTeachingClassesRS(String edu301_ID, int newRS);

	// 新增学生时改变教学班包含学生信息
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu301 SET bhxs_Code=?1 WHERE Edu301_ID =?2", nativeQuery = true)
	public void updateJXBbhxsInfo(String newBhxsid, long jxbid);

	// 根据教学班查询行人数
	@Query(value = "select e.jxbrs from edu301 e where e.Edu301_ID =?1", nativeQuery = true)
	public int queryJXBrs(String jxbcode);


	//根据id集合查询教学班
	@Query(value = "select e.* from edu301 e where e.Edu301_ID in ?1",nativeQuery = true)
	List<Edu301> findAllInEdu301Ids(List<Long> edu301Ids);
}

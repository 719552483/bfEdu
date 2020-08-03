package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu300;

public interface Edu300Dao extends JpaRepository<Edu300, Long>, JpaSpecificationExecutor<Edu300> {
	// 查询培养计划下的行政班
	@Query(value = "select * from edu300 e where pyccbm =?1 and xbbm=?2 and njbm =?3 and zybm=?4", nativeQuery = true)
	List<Edu300> queryCulturePlanAdministrationClasses(String levelCode, String departmentCode, String gradeCode,String majorCode);

	// 根据id删除行政班
	@Transactional
	@Modifying
	@Query(value = "delete from edu300 where Edu300_ID =?1", nativeQuery = true)
	void removeAdministrationClass(String edu300id);
	
	// 根据id查询行政班
	@Query(value = "select * from edu300 where Edu300_ID =?1", nativeQuery = true)
	List<Edu300> queryXzbByEdu300ID(String edu300_ID);
	
	//根据300名称查询300id
	@Query(value = "select e.Edu300_ID from edu300 e where e.xzbmc =?1", nativeQuery = true)
	Object queryEdu300IdByEdu300Name(String edu300Name);
	

	// 生成开课计划时修改行政班的开课计划属性
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu300 SET sfsckkjh =?2 WHERE Edu300_ID =?1", nativeQuery = true)
	void generatAdministrationCoursePlan(String edu300Id, String isGeneratCoursePlan);

	// 根据行政班id查询行政班在校人数
	@Query(value = "select e.zxrs from edu300 e where Edu300_ID =?1", nativeQuery = true)
	int queryZXRS(String xzbcode);
	
	// 根据行政班id查询行政班容纳人数
	@Query(value = "select e.rnrs from edu300 e where Edu300_ID =?1", nativeQuery = true)
	int countXzbStudentsById(String deleteEdu300Id);

	// 查询行政班容纳人数人数
	@Query(value = "select e.rnrs from edu300 e where Edu300_ID =?1", nativeQuery = true)
	int queryXZBrnrs(String edu300_ID);

	// 新增学生是改变行政班在校人数
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu300 SET zxrs =?2 WHERE Edu300_ID =?1", nativeQuery = true)
	public void changeAdministrationClassesZXRS(String xzbcode, int newZXRS);

	// 判断导入学生的培养计划和行政班是否对应
	@Query(value = "select * from edu300 e where e.Edu300_ID=?1 and e.pyccbm=?2 and e.xbbm=?3 and njbm=?4 and zybm=?5", nativeQuery = true)
	public List<Edu300> classMatchCultruePaln(String edu300_ID, String pycc, String szxb, String nj, String zybm);


}

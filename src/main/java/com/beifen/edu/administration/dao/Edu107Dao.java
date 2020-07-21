package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu107;

public interface Edu107Dao extends JpaRepository<Edu107, Long>, JpaSpecificationExecutor<Edu107> {

	// 查询所有培养计划
	@Query(value = "select * from edu107", nativeQuery = true)
	public List<Edu107> queryAllRelation();

	// 根据id删除
	@Transactional
	@Modifying
	@Query(value = "delete from edu107 where Edu107_ID =?1", nativeQuery = true)
	void removeRelation(String id);

	// 查询某层次下的系部
	@Query(value = "select * from edu107 e where e.edu103=?1", nativeQuery = true)
	public List<Edu107> levelMatchDepartment(String leveCode);

	// 查询某系部下的年级
	@Query(value = "select * from edu107 e where e.edu104=?1", nativeQuery = true)
	public List<Edu107> departmentMatchGrade(String departmentCode);

	//查询某年级下的专业
	@Query(value = "select * from edu107 e where e.edu105=?1", nativeQuery = true)
	public List<Edu107> gradeMatchMajor(String gradeCode);
	
	// 根据专业编码查培养计划
	@Query(value = "select * from edu107 e where e.zybm=?1", nativeQuery = true)
	public List<Edu107> query107ByMajorCode(String zybm);

	//根据层次 系部 年级 专业定位培养计划  返回id
	@Query(value = "select e.Edu107_ID from edu107 e where e.pyccbm=?1 and e.xbbm=?2 and e.njbm=?3 and e.zybm=?4", nativeQuery = true)
	public long queryEdu107ID(String levelCode, String departmentCode, String gradeCode, String majorCode);

	// 根据层次 系部 年级 专业定位培养计划 返回结果集
	@Query(value = "select * from edu107 e where e.pyccbm=?1 and e.xbbm=?2 and e.njbm=?3 and e.zybm=?4", nativeQuery = true)
	public List<Edu107> queryPyjh(String levelCode, String departmentCode, String gradeCode, String majorCode);


}

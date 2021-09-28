package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu107;

public interface Edu107Dao extends JpaRepository<Edu107, Long>, JpaSpecificationExecutor<Edu107> {

	// 根据权限查询所有培养计划
	@Query(value = "select * from edu107 where edu104 in ?1 ", nativeQuery = true)
	public List<Edu107> queryAllRelation(List<String> departments);

	// 根据id删除
	@Transactional
	@Modifying
	@Query(value = "delete from edu107 where Edu107_ID =?1", nativeQuery = true)
	void removeRelation(String id);

	// 根据权限查询某层次下的系部
	@Query(value = "select * from edu107 e where e.edu103=?1 and e.edu104 in ?2", nativeQuery = true)
	public List<Edu107> levelMatchDepartment(String leveCode,List<String> departments);

	// 查询某层次下的系部
	@Query(value = "select * from edu107 e where e.edu103=?1", nativeQuery = true)
	public List<Edu107> getDepartmentInLevel(String leveCode);

	// 查询某系部下的年级
	@Query(value = "select * from edu107 e where e.edu104=?1", nativeQuery = true)
	public List<Edu107> departmentMatchGrade(String departmentCode);

	//查询年级和系部下的专业
	@Query(value = "select * from edu107 e where e.edu105 = ?1 and e.edu104 = ?2", nativeQuery = true)
	public List<Edu107> gradeMatchMajor(String gradeCode,String departmentCode);
	
	// 根据专业编码查培养计划
	@Query(value = "select * from edu107 e where e.edu106=?1", nativeQuery = true)
	public List<Edu107> query107ByMajorCode(String zybm);

	//根据层次 系部 年级 专业定位培养计划  返回id
	@Query(value = "select e.Edu107_ID from edu107 e where e.edu103=?1 and e.edu104=?2 and e.edu105=?3 and e.edu106=?4", nativeQuery = true)
	public List<Long> queryEdu107ID(String levelCode, String departmentCode, String gradeCode, String majorCode);

	// 根据层次 系部 年级 专业定位培养计划 返回结果集
	@Query(value = "select * from edu107 e where e.edu103=?1 and e.edu104=?2 and e.edu105=?3 and e.edu106=?4", nativeQuery = true)
	public List<Edu107> queryPyjh(String levelCode, String departmentCode, String gradeCode, String majorCode);

	// 根据主键查询数据
	@Query(value = "select * from edu107 e where e.Edu107_ID=?1", nativeQuery = true)
    Edu107 getEdu107ByID(String edu107_id);

	@Transactional
	@Modifying
	@Query(value = "update edu107 set xbsp = ?1 where Edu107_ID =?2", nativeQuery = true)
    void changeProcessState(String passing, String edu107Id);

	//查询年级下的专业
	@Query(value = "select * from edu107 e where e.edu105 = ?1", nativeQuery = true)
	List<Edu107> gradeMatchMajorUsed(String njbm);

	//查询年级下的专业
	@Query(value = "select * from edu107 where edu103 = ?1 and edu104 = ?2 and edu105 = ?3 and edu106 = ?4 and batch = ?5", nativeQuery = true)
	List<Edu107> searchProfessionalCourseResult(String edu103,String edu104,String edu105,String edu106,String batch);

	//查询年级下的专业
	@Query(value = "select * from edu107 where edu103 = ?1 and edu104 = ?2 and edu105 = ?3 and edu106 = ?4 ", nativeQuery = true)
	List<Edu107> searchProfessionalCourseResult(String edu103,String edu104,String edu105,String edu106);

	//查询专业年级下的批次
	@Query(value = "select * from edu107 where  edu105 = ?1 and edu106 = ?2 and xbsp = 'pass' order by batch", nativeQuery = true)
	List<Edu107> searchBatch(String edu105,String edu106);
}

package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu104;

public interface Edu104Dao extends JpaRepository<Edu104, Long>, JpaSpecificationExecutor<Edu104> {

	// 查询系部
	@Query(value = "select * from edu104", nativeQuery = true)
	public List<Edu104> queryAllDepartment();

	// 根据id删除系部
	@Transactional
	@Modifying
	@Query(value = "delete from edu104 where Edu104_ID =?1", nativeQuery = true)
	public void removeDeaparment(String edu104ID);

	// 根据id查系部
	@Query(value = "select * from edu104 e  where  e.Edu104_ID =?1", nativeQuery = true)
	public List<Edu104> queryAllDepartmentByXbbm(String xbbm);
	
	//按名称查系部编码
	@Query(value = "select e.Edu104_ID from edu104 e  where  e.xbmc =?1", nativeQuery = true)
	public String queryXbCodeByXbName(String xbbm);

	@Query(value = "select * from edu104 where Edu104_ID =?1", nativeQuery = true)
	public Edu104 query104BYID(String edu104id);

	//查询所有排课部门
	@Query(value = "select * from edu104 e where e.iskk ='T'", nativeQuery = true)
    List<Edu104> queryAllKkbm();

	//查询所有排课部门
	@Query(value = "select * from edu104 e where e.ispk ='T'", nativeQuery = true)
	List<Edu104> queryAllPkbm();

	//根据权限查询二级学院
	@Query(value = "select * from edu104 e where e.Edu104_ID in ?1", nativeQuery = true)
    List<Edu104> query104BYdepartments(List<String> departments);

	//根据id查询二级学院名称
	@Query(value = "select xbmc from edu104 where Edu104_ID in ?1", nativeQuery = true)
	List<String> queryXbNameByIds(List<String> departmentList);

	//查询有培养计划的二级学院
	@Query(value = "select distinct b.*\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID" +
			"              and a.edu105 in ?1" +
			"              and a.batch in ?2" +
			"            order by b.EDU104_ID",nativeQuery = true)
    List<Edu104> getEdu104InPlan(List<Long> schoolYearCodeList,List<String> batchCodeList);

	@Query(value = "select distinct b.*\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1" +
			"              and a.edu105 in ?2" +
			"              and a.batch in ?3" +
			"            order by b.EDU104_ID",nativeQuery = true)
	List<Edu104> getEdu104InPlanInDepartment(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList);

	//查询所有授课部门
	@Query(value = "select * from edu104 where edu104_id in (select distinct b.EDU104_ID from edu107 a,edu104 b where a.EDU104 = b.EDU104_ID)", nativeQuery = true)
	List<Edu104> queryAllSkbm();
}

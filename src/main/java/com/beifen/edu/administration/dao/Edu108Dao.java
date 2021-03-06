package com.beifen.edu.administration.dao;

import java.util.List;

import com.beifen.edu.administration.domian.Edu201;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu108;

public interface Edu108Dao extends JpaRepository<Edu108, Long>, JpaSpecificationExecutor<Edu108> {
	// 根据权限查询培养计划下的专业课程
	@Query(value = "select * from edu108 e where e.Edu107_ID=?1", nativeQuery = true)
	public List<Edu108> queryCulturePlanCouses(long edu107id);

	// 查询培养计划下的专业课程id 集合
	@Query(value = "select e.edu108_ID from Edu108 e where e.Edu107_ID in ?1",nativeQuery = true)
	List<String> queryCulturePlanIds(List<Long> edu107ids);


	// 根据ID查询培养计划信息
	@Query(value = "select * from edu108 e where e.Edu108_ID=?1", nativeQuery = true)
	public Edu108 queryPlanByEdu108ID(String edu108id);

	// 根据ID删除培养计划
	@Transactional
	@Modifying
	@Query(value = "delete from edu108 where Edu108_ID =?1", nativeQuery = true)
	public void removeCultureCrose(String edu108id);

	// 根据id修改培养计划
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu108 SET xbsp =?2 WHERE Edu108_ID =?1", nativeQuery = true)
	public void chengeCulturePlanCrouseStatus(String id, String status);

	// 培养计划审核 -改变培养计划反馈意见
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu108 SET fkyj =?2 WHERE Edu108_ID =?1", nativeQuery = true)
	public void chengeCulturePlanCrouseFeedBack(String id, String feedBack);

	// 查询更改状态的课程是否在培养计划中
	@Query(value = "select * from edu108 WHERE Edu200_ID =?1", nativeQuery = true)
	public List<Edu108> classIsInCurturePlan(String edu200id);

	// 确认生成开课计划
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu108 SET sfsckkjh =?4,Edu300_ID=?3,xzbmc=?2 WHERE Edu108_ID =?1", nativeQuery = true)
	public void chengeCulturePlanCrouseFeedBack(String crouses, String classNames, String classIds,
			String isGeneratCoursePlan);

	// 判断行政班是否包含在培养计划中
	@Query(value = "select * from edu108 e where e.Edu300_ID like %?1%", nativeQuery = true)
	public List<Edu108> queryAdministrationClassesCrouse(String xzbCode);

	//审批结束后回写培养计划状态
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu108 SET xbsp = ?2 WHERE Edu108_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state);

	//根据课程查询培养计划
	@Query(value = "select e.* from edu108 e where e.Edu200_ID = ?1", nativeQuery = true)
	List<Edu108> findPlanByEdu200Id(String edu200Id);

	//根据200ID集合查询108id集合
	@Query(value = "select distinct e.edu108_ID from Edu108 e,Edu107 f where e.edu200_ID in ?1 and f.xbsp = 'pass'",nativeQuery = true)
    List<Long> findPlanByEdu200Ids(List<Long> edu200IdList);

	//根据edu107id集合查询108
	@Query(value = "select distinct e.edu108_ID from Edu108 e, Edu107 f where e.edu107_ID in ?1 and f.xbsp = 'pass'", nativeQuery = true)
    List<Long> getEdu108ByEdu107(List<Long> edu107IdList);

	//根据edu107id集合查询108
	@Query(value = "select e.* from Edu108 e where e.edu107_ID = ?1", nativeQuery = true)
	List<Edu108> getEdu108ByEdu107Id(String edu107Id);

	@Query(value = "select e.edu108_ID from Edu108 e, Edu107 f where e.edu107_ID = f.edu107_ID and f.edu104 in ?1", nativeQuery = true)
	List<Long> findAllBydepartments(List<String> departments);
}
